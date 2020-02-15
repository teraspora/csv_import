class CsvValidator {

    nthIndexOf = (s, t, n) => s.split(t, n).join(t).length;
    // contains_duplicates = arr => [...new Set(arr)].length < arr.length;

    rules = [
        /^\d{1,11}_\d{1,5}_\d{1,5}$/g,
        /^\d{1,20}$/g,
        /^[A-Za-z\s]{1,100}$/g,
        /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/g,
        /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/g,
        /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/g,
        /^\d\.\d{1,2}$/g,
        /^https?:\/\/.*/g
    ];

    fieldCount = this.rules.length;

    msgs = {
        // Note:  line_no + 1 accounts for stripped header row
        wrong_length_row:   (line_no, field_count, expected_count) => `On line ${line_no + 1}: Found ${field_count} columns, expecting ${expected_count} columns`,
        empty_field:        (line_no, column_no) => `On line ${line_no + 1}, column ${column_no}: required field missing`,
        bad_format:         (line_no, column_no, field_value) => `On line ${line_no + 1}, column ${column_no}: Found ‘${field_value}’ which has an unexpected format.`,
        duplicate_id:       line_no => `On line ${line_no + 1}: Row already defined in file previously`,
    }

    ids = [];
    
    constructor(csv_file_data) {
        this.data = csv_file_data;
    }

    validateField(field, rule) {
        // return true or false depending on whether string value in field matches the pattern in rule
        let match_array = field.match(rule);
        if (!match_array || match_array.length != 1) {
            return false;
        }
        return match_array[0] == field;
    }

    validateRow(row, row_index, rules) {
        let row_msgs = [];
        const fields = row.split(`,`);
        // First allow an extra row on the end with no printable chars - or any empty row:
        if (fields.length == 1 && fields[0] == ``) {
            return [];
        }
        // Next, check for short or long rows
        if (fields.length != this.fieldCount) {
            return [this.msgs.wrong_length_row(row_index, fields.length, this.fieldCount)];
        }
        fields.forEach((field, field_index) => {
            // check not null
            if (!field) {
                row_msgs.push(this.msgs.empty_field(row_index, row.search(/,\s*,/g))); 
            }
            else {
                if (field_index == 7) {     // strip off Microsoft CR (`\r`) character from last field:
                    field = field.replace(`\r`, ``);
                }
                else if (field_index == 0) {
                    // Test for duplicate ids:
                    if (this.ids.includes(field)) {
                        row_msgs.push(this.msgs.duplicate_id(row_index));
                    }
                    else {
                        // add to ids array so we can check for duplicates
                        this.ids.push(field);
                    }
                }
                if (!this.validateField(field, rules[field_index])) {
                    row_msgs.push(this.msgs.bad_format(row_index, this.nthIndexOf(row, `,`, field_index), field));       
                }
            }
        });
        return row_msgs;    // if no errors detected, this will be an empty array
    }

    validateFile() {
        let file_msgs = [];
        // Leave out first row (header);
        let rows = this.data.split(`\n`).slice(1);
        rows.forEach((row, row_index) => {
            file_msgs.push(...this.validateRow(row, row_index, this.rules));
        });
        return file_msgs;
    }
}

const csv_importer = document.getElementById('csv-input');
     
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        csv_importer.addEventListener('change', handleFileSelect, false);
        let data = ``;
    }
}

function handleFileSelect(ev0) {
    console.log(`In 'handleFileSelect().'\n\n`);
    f = ev0.target.files[0];
    let rdr = new FileReader();
    rdr.readAsText(f);
    // test when read
    rdr.onloadend = ev1 => {
        if (ev1.target.readyState == FileReader.DONE) {
            if (ev0.target === csv_importer) {
                data = rdr.result;
                console.log(`*** Got CSV data\n\n`);
                const cv = new CsvValidator(data);
                const errs = cv.validateFile();
                if (!errs || !errs.length) {
                    console.log(`No errors, submit file...`);
                    // submit file
                }
                else {
                    errs.forEach( err => {
                        console.log(`Error: ${err}`);
                    });
                    // inform user about errors
                }
            }
        }
    };
}
