 function convertCSVtoJSON() 
		{
            const file = document.getElementById('csvFile').files[0];
            if (!file) {
                alert('Please select a CSV file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const csvData = event.target.result;

                // Use PapaParse to parse the CSV
                const parsedData = Papa.parse(csvData, {
                    header: true, // Assumes the first row contains headers
                    dynamicTyping: true // Converts numeric values to numbers automatically
                });

                const jsonData = parsedData.data;
                document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);
            };
            
            reader.readAsText(file);
        }