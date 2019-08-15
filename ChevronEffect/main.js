document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded
  document.getElementById("theButton").addEventListener("click", getData);
  // Handler when all assets (including images) are loaded
//drawLineStyles();
});

function getData()
{
  let gusset = 
  {
    length: document.getElementById('gussetLength').value,
    height: document.getElementById('gussetHeight').value,
    thickness: document.getElementById('gussetThickness').value
  }
  
  let tensionBrace = 
  {
    tensionForce: document.getElementById('tensionForce').value,
    braceAngle: document.getElementById('braceAngle').value
  }

  let compressionBrace = 
  {
    compressionForce: document.getElementById('tensionForce').value,
    braceAngle: document.getElementById('braceAngle').value
  }

  let beamSize = document.getElementById('beamSize').value;
  console.log(beamSize);

  for (let i = 0; i < Wshapes.length; i++) {
    if (beamSize === Wshapes[i].Size) {
      beamtw = parseFloat(Wshapes[i].tw);
      beambf = parseFloat(Wshapes[i].bf);
      beamtf = parseFloat(Wshapes[i].tf);
      beamd = parseFloat(Wshapes[i].d);
    }
  }
  let beam = 
  {
    tw: beamtw,
    bf: beambf,
    tf: beamtf,
    d: beamd
  }

  const compressionForce = document.getElementById('compressionForce').value;
  const braceAngle = document.getElementById('braceAngle').value;

  drawConnection(tensionBrace, compressionForce, gusset, beam);
}

function drawConnection(tBrace, cBrace, gusset, beam)
{
  let c = document.getElementById('myCanvas');
  let ctx = c.getContext("2d");
  let bevelFactor = .75;
  c.height = 400;
  c.width = 600;
  ctx.scale(7,7);
  ctx.translate(1,1);
   ctx.fillStyle = 'black';
   ctx.strokeStyle = 'black';
    ctx.lineWidth=0.1;
   ctx.beginPath();
   ctx.moveTo(0,0);
   ctx.lineTo(gusset.length, 0);
   ctx.lineTo(gusset.length, gusset.height*bevelFactor);
   ctx.lineTo(gusset.length - gusset.height*(1-bevelFactor*.7), gusset.height);
   ctx.lineTo(gusset.height*(1-bevelFactor*.7), gusset.height);
   ctx.lineTo(0, gusset.height*bevelFactor);
   ctx.lineTo(0,0);
   ctx.stroke();


console.log("is this broken");
  //ctx.lineTo(gusset.length, 0);
  //ctx.lineTo(gusset.length, -gusset.height);
  //ctx.lineTo(0, -gusset.height);
  ctx.stroke;
  /*
  var angleLength = (bolt.n-1)*bolt.s + angle.Lev_top+angle.Lev_bot;
  var r = beam.tw;  
  var c = document.getElementById("myCanvas");
  c.width = Math.max(beam.bf*7*2, angle.b*7*2);
  c.height = Math.max(beam.d*7*2, angle.b*7*2);
  var ctx = c.getContext("2d");
  ctx.scale(7,7);
  ctx.translate(1,1);
  ctx.lineWidth=0.1;
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(beam.bf,0);
  ctx.moveTo(beam.bf,0);
  ctx.lineTo(beam.bf,beam.tf);
  */
}

function drawLineStyles() 
{

  
  var data = new google.visualization.DataTable();
  data.addColumn('number');
  data.addColumn('number');
  data.addColumn('number');
  data.addColumn('number');
  data.addColumn('number');

  data.addRows([
    [0, 0, 1, 10, 11],
    [100, 0, 1, 10, 11],   
    ]);

  var options = 
  {       
    colors: ['#a52714', '#a52714', '#a52714', '#a52714', '#a52714'],
    gridlines: {color: 'none'},
    legend: {position: 'none'},
    vAxis:{
     baselineColor: '#fff',
     gridlineColor: '#fff',
     textPosition: 'none'
    },
     hAxis:{
     baselineColor: '#fff',
     gridlineColor: '#fff',
     textPosition: 'none'
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);   

}

function drawLineStyles2() 
{
        var data2 = new google.visualization.DataTable();
      data2.addColumn('number');
      data2.addColumn('number');
      data2.addColumn('number');
      data2.addRows([
        [30, -5, -15],
        [70, -5, -15],   
        ]);

      var data3 = new google.visualization.DataTable();
      data3.addColumn('number');
      data3.addColumn('number');
      data3.addColumn('number');
      data3.addRows([
        [10, 20, 30],
        [70, 20, 30]
        ]);
        var options = {       
        colors: ['#a52714', '#a52714', '#a52714'],
        gridlines: {color: 'none'},
        legend: {position: 'none'},
        vAxis:{
         baselineColor: '#fff',
         gridlineColor: '#fff',
         textPosition: 'none'
        },
         hAxis:{
         baselineColor: '#fff',
         gridlineColor: '#fff',
         textPosition: 'none'
        }
      };

       var chart2 = new google.visualization.LineChart(document.getElementById('chart_div2'));
       //chart2.draw(data2, options);
       chart2.draw(data3, options);

}
