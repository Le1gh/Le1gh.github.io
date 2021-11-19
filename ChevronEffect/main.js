document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded
  //document.getElementById("button").addEventListener("click", getInitialInputs);
  document.getElementById("inputs").addEventListener("submit", getInitialInputs);
  //event listener for the start over button
  $("#startAgainBtn").on('click', startOver);
});




function displayTable(V, M, phiVn, minG) {
    //$('#checks').empty();
    let source = $("#uniformStressDisplay").html();
    var template = Handlebars.compile(source);
    var data = {
     maxShear : V,
     maxMoment : M,
     beamPhiVn: phiVn,
     minGusset: minG
         };
    var newTable = template(data);
    $('#uniformDivID').html(newTable);
    $('#theButton').hide();
    $('#startAgainBtn').show();

};

function displayTableConcentratedForces(V, M, phiVn, zWLY, zGusset, zMax, vef, RZ) {
    //$('#checks').empty();
    let source = $("#concStressDisplay").html();
    var template = Handlebars.compile(source);
    var data = {
     maxShear : V,
     maxMoment : M,
     beamPhiVn: phiVn,
     beamPhiVn: phiVn,
     z_WLY: zWLY,
     z_gusset: zGusset,
     z_max: zMax,
     Vef: vef, 
     Rz: RZ
         };
      
    var newTable = template(data);
    $('#concentratedDivID').html(newTable);
    $('#theButton').hide();
    $('#startAgainBtn').show();
};


function startOver() {
  //$('#startAgainBtn').hide();
  location.reload();
}