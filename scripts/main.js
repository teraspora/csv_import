document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        let csv_importer = document.getElementById('csv-input');
        csv_importer.addEventListener('change', handleFileSelect, false);
        let csv_data = '';
        let error_msgs = [/* flesh this out */];
        let all_errors = [];

        function validateCsv(row_index, row) {
            let row_errors = [];
            for (const [field_index, value] of row.entries) {
                switch(field_index) {
                    case 0: 
                        // Validate id_str and add to row_errors as appropriate
                        break;
                    case 1:
                        // Validate number and add to row_errors as appropriate
                        break;
                    case 2:
                        // Validate country and add to row_errors as appropriate
                        break;
                    case 3: 
                        // Validate start_time and add to row_errors as appropriate
                        break;
                    case 4:
                        // Validate connect_time and add to row_errors as appropriate
                        break;
                    case 5:
                        // Validate end_time and add to row_errors as appropriate
                        break;
                    case 6:
                        // Validate score and add to row_errors as appropriate
                        break;
                    case 7:
                        // Validate URL and add to row_errors as appropriate
                        break;     
                }
                return row_errors;
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
                        csv_data = rdr.result;
                        console.log(`*** Got CSV data\n\n`);
                        console.table(csv_data);
                        const rows = csv_data.split(`\n`).slice(1, -1);
                        for (const [row_index, row] of rows.entries) {
                            const errors = validateCsv(row_index, row);
                            if (errors === ``) {
                                // continue
                            }
                            else {
                                // add these errors to global array of errors
                            }
                        }
                        // Either upload the file or report the errors.
                    }
                }
            };
        }
    }
}          
