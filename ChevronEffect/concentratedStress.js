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
  //let w = 4*moment/(gusset.length*gusset.length);
  let N1 = braces.T*sinTensAngle - braces.C*sinCompAngle;

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
    z = Math.max(zWLY, zGusset);
  }
  
  //max gusset - EQ-27
  let zMax = Math.round((gusset.length - (moment/Vef))*10)/10;
  if (z > zMax)
  {
    zMax = "z exceeds zmax";
  }

  //Rz
  let Rz = moment / (gusset.length - z);
  Rz = Math.round(Rz*10)/10;
  //max shear
  let Vmax = Math.round((Vma + Rz)*10)/10;

  //max moment
  let Mmax = 0.5*Vef*z + N1*beam.length*12*.25;
  Mmax = Math.round(Mmax*10)/10;

  //DRAW DIAGRAMS
  
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
   let targetScale = 10;
   let scaleFactor = Vmax/targetScale;
   let edge_w_scaled = (Rz/z)/scaleFactor;
   let maxShear = edge_w_scaled*z;

  //DRAW SHEAR X-AXIS
   ctx.beginPath();
   ctx.lineWidth=0.15;
   let yStart = maxShear+10;
   ctx.font = "small-caps 3px Calibri";
   ctx.fillText("Shear", 0, yStart-1);
   ctx.moveTo(0, yStart);
   ctx.lineTo(offsetX + gusset.length + offsetX, yStart);
   ctx.stroke();

   //****SHEAR - BALANCED PORTION*****
   let i;
   let numP = 50;
   ctx.strokeStyle = 'red';
   ctx.lineWidth=0.1;
   ctx.beginPath();
   ctx.moveTo(offsetX, yStart);
   //up
   ctx.lineTo(offsetX+z, yStart-edge_w_scaled*z);
   ctx.moveTo(offsetX+z, yStart-edge_w_scaled*z); 
   //plateau
   ctx.lineTo(offsetX+gusset.length-z, yStart-edge_w_scaled*z);
   ctx.moveTo(offsetX+gusset.length-z, yStart-edge_w_scaled*z);
   ctx.lineTo(offsetX + gusset.length, yStart);

  ctx.stroke();

  //****SHEAR - UNBALANCED PORTION*****
  let w_inner = N1/(gusset.length-z);
  let w_inner_scaled = w_inner/scaleFactor;
  let rightRxnScaled = (N1*beam.a/beam.length)/scaleFactor;
  let leftRxnScaled = N1/scaleFactor - rightRxnScaled;
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  
  if (N1 != 0)
  {
    ctx.moveTo(0, yStart+leftRxnScaled);
    ctx.lineTo(offsetX + z, yStart + leftRxnScaled);
    ctx.moveTo(offsetX + z, yStart+leftRxnScaled);
    ctx.lineTo(offsetX + gusset.length-z, yStart-rightRxnScaled);
    ctx.moveTo(offsetX + gusset.length-z, yStart-rightRxnScaled);
    ctx.lineTo(2*offsetX+gusset.length, yStart-rightRxnScaled);
  }  
  ctx.stroke();

  //SHEAR - TOTAL
   ctx.strokeStyle = 'purple';
   ctx.lineWidth=.48;
   ctx.beginPath();
   //flat portion
   ctx.moveTo(0, yStart+leftRxnScaled);
   ctx.lineTo(offsetX, yStart+leftRxnScaled);
   ctx.moveTo(offsetX, yStart+leftRxnScaled);
   //zone 1
   ctx.lineTo(offsetX + z, yStart+leftRxnScaled-edge_w_scaled*z);
   ctx.moveTo(offsetX + z, yStart+leftRxnScaled-edge_w_scaled*z);
   //zone 2
   ctx.lineTo(offsetX + gusset.length-z, yStart-edge_w_scaled*z-rightRxnScaled);
   ctx.moveTo(offsetX + gusset.length-z, yStart-edge_w_scaled*z-rightRxnScaled);
    //zone 3
    ctx.lineTo(offsetX+gusset.length, yStart-rightRxnScaled);
    ctx.moveTo(offsetX+gusset.length, yStart-rightRxnScaled);
    //zone 4
    ctx.lineTo(2*offsetX + gusset.length, yStart-rightRxnScaled);
   ctx.stroke();

    displayTableConcentratedForces(Vmax, Mmax, beam.phiVn, zWLY, zGusset, zMax, Vef, Rz);
}
