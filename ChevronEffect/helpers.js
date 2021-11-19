function getInitialInputs()
{
  let Fy = 50;
  let stressDist = document.getElementById('stressModel').value;
  let gusset = 
  {
    length: Number(document.getElementById('gussetLength1').value),
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
  if (Number.isNaN(Vgravity))
  {
    Vgravity = 0;
  }

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
