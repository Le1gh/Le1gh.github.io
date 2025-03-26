$(document).ready(function() {

    console.log("hi");
	



	//const outputDiv = document.getElementById('jsonOutput');
	//outputDiv.textContent = jsonString;
   

   




    // Function to format value for arrays and objects
    function formatValue(value) {
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          // If it's an array, return each element as a list item
          return `<ul class="array-list">${value.map(item => `<li>${JSON.stringify(item)}</li>`).join('')}</ul>`;
        } else {
          // If it's an object, recursively create a nested table
          let nestedTable = '<table class="nested-table"><tbody>';
          for (const [key, val] of Object.entries(value)) {
            nestedTable += `<tr><td>${key}</td><td>${formatValue(val)}</td></tr>`;
          }
          nestedTable += '</tbody></table>';
          return nestedTable;
        }
      }
      return value;  // For primitive types (strings, numbers, etc.)
    }

	const headerRow = document.getElementById('headerRow');

		// Create table headers dynamically from the flattened keys
		const flattenedJson = flattenJson(jsonData1);
		Object.keys(flattenedJson).forEach(key => {
		  const headerCell = document.createElement('th');
		  headerCell.textContent = key;
		  headerRow.appendChild(headerCell);
		});
		
	processFile(jsonData1, "dataRow1");
	processFile(jsonData2, "dataRow2");
	processFile(jsonData3, "dataRow3");
	processFile(jsonData4, "dataRow4");
	processFile(jsonData5, "dataRow5");
	processFile(jsonData6, "dataRow6");
	processFile(jsonData7, "dataRow7");
	processFile(jsonData8, "dataRow8");
	processFile(jsonData9, "dataRow9");
	processFile(jsonData10, "dataRow10");
	processFile(jsonData11, "dataRow11");
	processFile(jsonData12, "dataRow12");
	processFile(jsonData13, "dataRow13");
	processFile(jsonData14, "dataRow14");
	processFile(jsonData15, "dataRow15");
	processFile(jsonData16, "dataRow16");
	
	

	    // Function to flatten nested keys and format them as strings
    function flattenJson(obj, prefix = '') {
      let result = {};

      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;  // Concatenate the keys with a dot
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          // If the value is an object, recurse into it
          Object.assign(result, flattenJson(value, newKey));
        } else {
          // If the value is not an object, store the value
          result[newKey] = value;
        }
      }

      return result;
    }

function processFile(file, id)
	{
		const flattenedJson = flattenJson(file);

		const dataRow = document.getElementById(id);



		// Create the data row dynamically from the flattened values
		Object.values(flattenedJson).forEach(value => {
		  const dataCell = document.createElement('td');
		  dataCell.innerHTML = formatValue(value);  // Use innerHTML for nested structures
		  dataRow.appendChild(dataCell);
		});
	}
   
	
	
});





