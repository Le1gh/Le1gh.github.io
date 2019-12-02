function concentratedStress(braces, gusset, beam)
{
  
  let b = beam.length - beam.a;
  let CBraceLength = Math.sqrt(Math.pow(beam.a, 2) + Math.pow(beam.storyHeight, 2));
  let TBraceLength = Math.sqrt(Math.pow(b, 2) + Math.pow(beam.storyHeight, 2));
  let cosCompAngle = beam.a/CBraceLength;
  let cosTensAngle = b/TBraceLength;
  let sinCompAngle = beam.storyHeight/CBraceLength;
  let sinTensAngle = beam.storyHeight/TBraceLength;
  let tanCompAngle = beam.storyHeight/beam.a;
  let tanTensAngle = beam.storyHeight/b;
  let Fy = 50;
  let V1 = braces.T *cosTensAngle + braces.C*cosCompAngle;
  let moment = V1*beam.d/2;
  let w = 4*moment/(gusset.length*gusset.length);
  let N1 = braces.T*sinTensAngle - braces.C*sinCompAngle;

  //Minimum gusset line 269
  let Vma = beam.Vgrav + N1*Math.max(beam.a, beam.length-beam.a) * (1/beam.length);
  let Vef = Math.round((beam.phiVn - Vma)*10) / 10;
  let term1 = Math.pow(V1/(0.6*Fy*gusset.length), 2);
  let term2 = Math.pow(Vef/(0.9*Fy*(gusset.length - moment/Vef)), 2);
  let minGussetThickness = Math.sqrt(term1 + term2);
  
  //calculate z
  //from web local yielding
  let zWLY = Math.round((0.5*gusset.length - Math.sqrt(.25*Math.pow(gusset.length, 2) - moment/(Fy*beam.tw)) - 5*beam.k)*10)/10;

   // z corresponding to gusset length and thickness
  // TODO: check phi in line below
  let z_denom = Math.sqrt(Math.pow(.9*Fy*gusset.thickness, 2) - Math.pow(V1/(0.6*Fy*gusset.length), 2));
  let zGusset = Math.round((0.5*gusset.length - Math.sqrt(0.25*Math.pow(gusset.length, 2) - moment/z_denom, 2))*10)/10;
  let z = zGusset;
  if (.25*Math.pow(gusset.length, 2) - moment/(Fy*beam.tw) < 0)
  {
    zWLY = "Does not satisfy WLY";
  }
  else if (zWLY < 0)
   {
      zWLY = "No min";
      z = zGusset;
   }
  else
  {
    console.log("shouldn't be here");
    z = Math.max(zWLY, zGusset);
  }
 
  console.log("zWLY is " + zWLY);
  console.log("ze vals are " + zWLY + " and " + zGusset);
  
  //max gusset - EQ-27
  let zMax = Math.round((gusset.length - (moment/Vef))*10)/10;
  if (z > zMax)
  {
    zMax = "z exceeds zmax";
  }

  //Rz
  console.log("z is" + z);
  let Rz = moment / (gusset.length - z);
  Rz = Math.round(Rz*10)/10;
  //max shear
  let Vmax = Vma + Rz;

  //max moment
  let Mmax = 0.5*Vef*z + N1*beam.length*12*.25;
  Mmax = Math.round(Mmax*10)/10;
  //DRAW DIAGRAMS
  /*
  let c = document.getElementById('myCanvas');
  let ctx = c.getContext("2d");
  let bevelFactor = .75;
  let offsetX = 15;
  c.height = 900;
  c.width = 600;
  ctx.scale(7,7);
  ctx.translate(1,1);
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth=0.07;


    //SET SCALE
   let numPoints = gusset.length*4;
   let intervalX = gusset.length/numPoints;
   let maxShear = w*gusset.length/2;
   let targetScale = 10;
   let scaleFactor = maxShear/targetScale;
   maxShear = maxShear/scaleFactor;
   let w_scaled = w/scaleFactor;

  //DRAW SHEAR X-AXIS
   ctx.beginPath();
   ctx.lineWidth=0.15;
   let yStart = maxShear+2;
   ctx.font = "small-caps 3px Calibri";
   ctx.fillText("Shear", 0, yStart-1);
   ctx.moveTo(0, yStart);
   ctx.lineTo(offsetX + gusset.length + offsetX, yStart);
   ctx.stroke();
*/
    displayTableConcentratedForces(Vmax, Mmax, beam.phiVn, zWLY, zGusset, zMax, Vef, Rz);
}
