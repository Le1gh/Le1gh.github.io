function uniformStress(braces, gusset, beam)
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
  let V1 = braces.T*cosTensAngle + braces.C*cosCompAngle;
  let minGusset = Math.round(V1*beam.d/beam.phiVn);

  let moment = V1*beam.d/2;
  let w = 4*moment/(gusset.length*gusset.length);
  let N1 = braces.T*sinTensAngle - braces.C*sinCompAngle;
  let z = N1/gusset.length;

  //CALCULATE MAX SHEAR AND MOMENT
  let Vmax = Math.round(2*moment/gusset.length);
  let Mmax = Math.round(Math.abs(moment/8) + Math.abs(N1*beam.length*12/4));

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

   //****SHEAR - BALANCED PORTION*****
   let i;
   ctx.strokeStyle = 'red';
   ctx.lineWidth=0.1;
   ctx.beginPath();
   for (i = 0; i <= gusset.length; i+=intervalX)
   {
    if (i <= gusset.length/2)
    { 
      ctx.lineTo(offsetX + i, yStart-w_scaled*i);
      ctx.moveTo(offsetX + i, yStart-w_scaled*i);
    }
    else
    {
      ctx.lineTo(offsetX+i, yStart - w_scaled*gusset.length + w_scaled*i);
      ctx.moveTo(offsetX+i, yStart - w_scaled*gusset.length + w_scaled*i);
    }   
   }
    

  ctx.stroke();

  //****SHEAR - UNBALANCED PORTION*****
  let z_scaled = z/scaleFactor;
  let unbVertScaled = N1/scaleFactor;
  console.log("unbVertScaled is " + unbVertScaled);
  let rightRxn = unbVertScaled*beam.a/beam.length;
  let leftRxn = unbVertScaled - rightRxn;
  ctx.strokeStyle = 'blue';
  ctx.beginPath();
  
  if (N1 != 0)
  {
    ctx.moveTo(0, yStart+leftRxn);
    ctx.lineTo(offsetX, yStart+leftRxn);
    ctx.moveTo(offsetX, yStart+leftRxn);
    ctx.lineTo(offsetX+gusset.length, yStart-rightRxn);
    ctx.moveTo(offsetX+gusset.length, yStart-rightRxn);
    ctx.lineTo(2*offsetX+gusset.length, yStart-rightRxn);
  }  
  ctx.stroke();

  //SHEAR - TOTAL
   ctx.strokeStyle = 'purple';
   ctx.lineWidth=.48;
   ctx.beginPath();
   ctx.moveTo(0, yStart+leftRxn);
   ctx.lineTo(offsetX, yStart+leftRxn);
   ctx.moveTo(offsetX, yStart+leftRxn);
   for (i = 0; i <= gusset.length/2; i+=intervalX)
   {
      ctx.lineTo(offsetX+i, yStart + leftRxn - w_scaled*i - z_scaled*i);
      ctx.moveTo(offsetX+i, yStart + leftRxn - w_scaled*i - z_scaled*i);
   }
    ctx.moveTo(offsetX+gusset.length, yStart - rightRxn);
    
  for (i = gusset.length; i >= gusset.length/2; i-= intervalX)
   {
      //w_scaled*gusset.length + w_scaled*i);
      let x = gusset.length - i;
      ctx.lineTo(offsetX+gusset.length - x, yStart - rightRxn - w_scaled*x + z_scaled*x);
      ctx.moveTo(offsetX+gusset.length - x, yStart - rightRxn - w_scaled*x + z_scaled*x);
   }
  
  ctx.moveTo(offsetX+gusset.length, yStart-rightRxn);
  ctx.lineTo(2*offsetX+gusset.length, yStart-rightRxn)
  ctx.stroke();

  //****MOMENT DIAGRAM*****
 

  let yMomentStart = yStart+Math.max(Math.abs(unbVertScaled/2), Math.abs(maxShear))+8;


  //DRAW  AXIS
  ctx.strokeStyle = 'black';
  ctx.lineWidth=0.15;
  ctx.beginPath();
  ctx.moveTo(0, yMomentStart);
  ctx.lineTo(2*offsetX+gusset.length, yMomentStart);
  ctx.moveTo(offsetX, yMomentStart);
  ctx.font = "small-caps 3px Calibri";
  ctx.fillText("Moment", 0, yMomentStart-1);
  ctx.stroke();

   
  let momentCoeff = Math.abs(moment/8) + Math.abs(N1*beam.length*12/4);
  let targetScaleMoment = 10;
  let scaleFactorMoment = momentCoeff/targetScaleMoment;
  wMomScaled = w/scaleFactorMoment;
  zMomScaled = z/scaleFactorMoment;
  
  //BALANCED MOMENT
   ctx.strokeStyle = 'red';
   ctx.lineWidth=0.1;
   ctx.moveTo(offsetX, yMomentStart);
   let m = 0.25*wMomScaled*gusset.length*gusset.length;
  for (i = 0; i <= gusset.length/2; i+=intervalX)
   {
    let x = offsetX+i;
    ctx.lineTo(x, yMomentStart -(m/gusset.length)*(i-2*i*i/gusset.length));
    ctx.moveTo(x, yMomentStart -(m/gusset.length)*(i-2*i*i/gusset.length));
   }
  for (i = 0; i <= gusset.length/2; i+=intervalX)
   {
    let x = offsetX+i;
    ctx.lineTo(x+gusset.length/2, yMomentStart +(m/gusset.length)*(i-2*i*i/gusset.length));
    ctx.moveTo(x+gusset.length/2, yMomentStart +(m/gusset.length)*(i-2*i*i/gusset.length));
   }
  ctx.stroke();
   

   //UNBALANCED MOMENT
   let endMoment = beam.a*12*zMomScaled*gusset.length/2;
   ctx.strokeStyle = 'blue';
   ctx.beginPath();
   ctx.moveTo(0, yMomentStart+((beam.a*12-offsetX)/(beam.a*12))*endMoment);
   ctx.lineTo(offsetX, yMomentStart + endMoment);
   ctx.moveTo(offsetX, yMomentStart + endMoment);
   for (i = 0; i < gusset.length; i+=intervalX)
   {
      ctx.lineTo(offsetX + i, yMomentStart + endMoment - zMomScaled*i*i/2 + zMomScaled*gusset.length*i/2);
      ctx.moveTo(offsetX + i, yMomentStart + endMoment - zMomScaled*i*i/2 + zMomScaled*gusset.length*i/2);
   }
   ctx.moveTo(offsetX+gusset.length, yMomentStart+endMoment);
   ctx.lineTo(2*offsetX + gusset.length, yMomentStart+((beam.a*12-offsetX)/(beam.a*12))*endMoment);
   ctx.stroke();

   //TOTAL MOMENT
   ctx.strokeStyle = 'purple';
   ctx.lineWidth=.48;
   ctx.beginPath();
   ctx.moveTo(0, yMomentStart+((beam.a*12-offsetX)/(12*beam.a))*endMoment);
   ctx.lineTo(offsetX, yMomentStart + endMoment);
   ctx.moveTo(offsetX, yMomentStart + endMoment);
   for (i = 0; i <= gusset.length/2; i+=intervalX)
   {
      ctx.lineTo(offsetX + i, yMomentStart + endMoment - zMomScaled*i*i/2 + zMomScaled*gusset.length*i/2-(m/gusset.length)*(i-2*i*i/gusset.length));
      ctx.moveTo(offsetX + i, yMomentStart + endMoment - zMomScaled*i*i/2 + zMomScaled*gusset.length*i/2 -(m/gusset.length)*(i-2*i*i/gusset.length));
   }
   ctx.moveTo(offsetX + gusset.length/2, yMomentStart+endMoment - zMomScaled*gusset.length*gusset.length/8 + zMomScaled*gusset.length*gusset.length/4);
   for (i = 0; i <= gusset.length/2; i+=intervalX)
   {
      let x = gusset.length/2 + i;
      ctx.lineTo(offsetX + x, yMomentStart + endMoment - zMomScaled*x*x/2 + zMomScaled*gusset.length*x/2+(m/gusset.length)*(i-2*i*i/gusset.length));
      ctx.moveTo(offsetX + x, yMomentStart + endMoment - zMomScaled*x*x/2 + zMomScaled*gusset.length*x/2+(m/gusset.length)*(i-2*i*i/gusset.length));
   }
  ctx.moveTo(offsetX+ gusset.length, yMomentStart + endMoment);
  ctx.lineTo(2*offsetX + gusset.length, yMomentStart+((beam.a*12-offsetX)/(12*beam.a))*endMoment);
   
   ctx.stroke();

   


      //DRAW BEAM
      let beamStart = yMomentStart + Math.abs(endMoment) + 15;
    ctx.lineWidth=0.15;
    ctx.strokeStyle = 'black';
     ctx.beginPath();
     ctx.moveTo(0, beamStart);
     ctx.lineTo(offsetX*2+gusset.length, beamStart);
     ctx.moveTo(0, beamStart + beam.tf,);
     ctx.lineTo( offsetX*2+gusset.length, beamStart + beam.tf);
      ctx.moveTo( 0, beamStart + beam.d,);
     ctx.lineTo( offsetX*2+gusset.length, beamStart + beam.d,);
      ctx.moveTo(0, beamStart +beam.d- beam.tf);
     ctx.lineTo(offsetX*2+gusset.length, beamStart + beam.d-beam.tf);
     
   //DRAW GUSSET PLATE
  
  let gussetStart = beamStart + beam.d;
   ctx.moveTo(offsetX, gussetStart);
   ctx.lineTo(offsetX + gusset.length, gussetStart);
   ctx.lineTo(offsetX + gusset.length, gussetStart + gusset.height*bevelFactor);
   ctx.lineTo(offsetX + gusset.length - gusset.height*(1-bevelFactor*.7), gussetStart + gusset.height);
   ctx.lineTo(offsetX + gusset.height*(1-bevelFactor*.7), gussetStart + gusset.height);
   ctx.lineTo(offsetX, gussetStart + gusset.height*bevelFactor);
   ctx.lineTo(offsetX, gussetStart);
   ctx.stroke();

   //Draw key
   ctx.lineWidth = .2;
   ctx.textAlign = 'left';
   ctx.textBaseline = 'middle';
    ctx.font = "small-caps 2px Calibri";
    ctx.beginPath();
   ctx.moveTo(offsetX+0.1*gusset.length, beamStart + 0.3*beam.d);
   ctx.lineTo(offsetX+0.2*gusset.length, beamStart + 0.3*beam.d);
   ctx.strokeStyle = 'red';
   ctx.fillText("Balanced Component", offsetX + 0.25*gusset.length, beamStart + 0.3*beam.d);
   ctx.stroke();

    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(offsetX+0.1*gusset.length, beamStart + 0.5*beam.d);
    ctx.lineTo(offsetX+0.2*gusset.length, beamStart + 0.5*beam.d);
   ctx.fillText("Unbalanced Component", offsetX + 0.25*gusset.length, beamStart + 0.5*beam.d);
   ctx.stroke();

     ctx.strokeStyle = 'purple';
    ctx.beginPath();
    ctx.moveTo(offsetX+0.1*gusset.length, beamStart + 0.7*beam.d);
    ctx.lineTo(offsetX+0.2*gusset.length, beamStart + 0.7*beam.d);
   ctx.fillText("Total", offsetX + 0.25*gusset.length, beamStart + 0.7*beam.d);
   ctx.stroke();

   displayTable(Vmax, Mmax, beam.phiVn, minGusset);
};