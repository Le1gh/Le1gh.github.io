document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded
  document.getElementById("theButton").addEventListener("click", getInitialInputs);

  //event listener for the start over button
  $("#startAgainBtn").on('click', startOver);
});

/*
$(document).ready(function() {
  $('#theButton').on('click', getInitialInputs);
});
*/

function getInitialInputs()
{
  let Fy = 50;
  let stressDist = document.getElementById('stressModel').value;
  let gusset = 
  {
    length: parseFloat(document.getElementById('gussetLength1').value),
    height: parseFloat(document.getElementById('gussetHeight1').value),
    thickness: parseFloat(document.getElementById('gussetThickness1').value)
  }
  if (Number.isNaN(gusset.height) || Number.isNaN(gusset.length) || Number.isNaN(gusset.thickness))
  {
    alert("Gusset data must be provided.");
  }
  

  let tensionForce =  parseFloat(document.getElementById('tensionForce1').value);

  let compressionForce = parseFloat(document.getElementById('compressionForce1').value);

  if (Number.isNaN(tensionForce) || Number.isNaN(compressionForce))
  {
    alert("Brace forces must be provided.");
  }

  let Vgravity = parseFloat(document.getElementById('Vgrav').value);

  let beamSize = document.getElementById('beamSize').value;

  for (let i = 0; i < Wshapes.length; i++) 
  {
    if (beamSize === Wshapes[i].Size) 
    {
      beamtw = parseFloat(Wshapes[i].tw);
      beambf = parseFloat(Wshapes[i].bf);
      beamtf = parseFloat(Wshapes[i].tf);
      beamd = parseFloat(Wshapes[i].d);
      beamk = parseFloat(Wshapes[i].kdes);
    }
  }

  let braces = 
  {
    C: compressionForce,
    T: tensionForce
  }

  let beam = 
  {
    tw: beamtw,
    bf: beambf,
    tf: beamtf,
    d: beamd,
    k: beamk,
    length : parseFloat(document.getElementById('beamLength').value),
    storyHeight : parseFloat(document.getElementById('storyHeight').value),
    a : parseFloat(document.getElementById('a').value),
    phiVn : Math.round(0.9*Fy*0.6*beamtw*beamd),
    Vgrav : Vgravity
  }


  if (stressDist == "uniformStressModel")
  {
    uniformStress(braces, gusset, beam);
  }
  else
  {
    concentratedStress(braces, gusset, beam);
  }
}



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