

$(document).ready(function() {

  //event listener for the button
$("#theButton").on("click", getWasher);

//event listener for the start over button
$('#startAgainBtn').on('click', startOver);


//event listener to ask for additional user input only if SC or PT bolts
$('#jointTypeForm').one('change', function() {
	var tempJointType = $('#jointType').val();
	console.log(tempJointType);
	if (tempJointType === "SC" || tempJointType === "PT") {
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(5);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Pretensioning method";
    	cell2.innerHTML = "<select id='method' class = 'form-control input-sm'><option>1</option></select>";
    } 
});

//end of on ready function
});

function getWasher() {

	var size = parseFloat($('#boltSize').val());
	var hole = $('#holeType').val();
	var plateFy = $('#plate').val();
	var grade = $("#boltGrade").val();
	var type = $('#jointType').val();


//end of getWasher
}

//
// FUNCTION TO RELOAD THE PAGE ON CLICK
//

function startOver() {
	location.reload();
}
