
//global variables which are used by the displayTable function that populates the Handlebars template
var phiPnBS;
var phiPnBearing;
var phiPnTearout;
var phiPnBearingAngle;
var phiPnTearoutAngle;
var phiPnSC;
var phiPnBeamYield;
var phiPnBeamRupt;
var phiPnAngleYield;
var phiPnAngleRupt;



$(document).ready(function() {

	var config = {
   apiKey: "AIzaSyCKn2GS1dSRVd0e6tTLFu-iLVQrQTAEByo",
   authDomain: "steel-design.firebaseapp.com",
   databaseURL: "https://steel-design.firebaseio.com",
   projectId: "steel-design",
   storageBucket: "steel-design.appspot.com",
   messagingSenderId: "519166628563"
  };
firebase.initializeApp(config);


  //event listener for the button
$("#theButton").on("click", getProps);

//event listener for the start over button
$('#startAgainBtn').on('click', startOver);

//event listener to ask for additional user input only if beam is coped
$('#beamCopeForm').one('change', function() {
	var copeCondition = $('#beamCope').val();
	
	if (copeCondition === "toponly" || copeCondition ==="both") {
		console.log(copeCondition);
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(11);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Beam Cope - Top Edge Distance";
    	cell2.innerHTML = "<input id='copeEdgeDist_top' placeholder = 1.5 value=1.5></input>";
	} 
	if (copeCondition ==="both") {
		console.log(copeCondition);
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(12);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Beam Cope - Bottom Edge Distance";
    	cell2.innerHTML = "<input id='copeEdgeDist_bot' placeholder = 1.5 value=1.5></input>";
	}
});

//end of on ready function
});


//this function never gets called. I tried, but couldn't get this to work.
function getFB(aBeam) {
var DB = firebase.database();
DB.ref().on('value', function(results) {
	var allShapes = results.val();
	for (var i in allShapes) {
		if (allShapes[i].Size === aBeam) {
			shape = allShapes[i];
			tw = shape.tw;
			bf = shape.bf;
			d = shape.d;
			tf = shape.tf
			}
	}
	var theBeam = {
		Fy: 50,
		Fu: 65,
		tw: tw,
		d: d,
		bf: bf,
		tf: tf,
		Lev_top: parseFloat($('#copeEdgeDist_top').val()),
		Lev_bot: parseFloat($('#copeEdgeDist_bot').val())
	};
	
});

}


function getProps() {

var beamSize= $('#beamSize').val();
var angleSize= $('#angleSize').val();
console.log(beamSize);

var beam;
var angle;
var bolt;

//Wshapes is a large array of objects in a separate Wshapes.js file
for (var i = 0; i < Wshapes.length; i++) {
		if (beamSize === Wshapes[i].Size) {
			beamtw = parseFloat(Wshapes[i].tw);
			beambf = parseFloat(Wshapes[i].bf);
			beamtf = parseFloat(Wshapes[i].tf);
			beamd = parseFloat(Wshapes[i].d);
		}
	}
	
//angles is a large array of objects in a separate angles.js file
for (var i = 0; i < angles.length; i++) {
		if (angleSize === angles[i].Size) {
			anglet = parseFloat(angles[i].t);
			angleb = parseFloat(angles[i].b);
		}
	}

beam = {
	Fy: 50,
	Fu: 65,
	tw: beamtw,
	bf: beambf,
	tf: beamtf,
	d: beamd,
	Lev_top: parseFloat($('#copeEdgeDist_top').val()),
	Lev_bot: parseFloat($('#copeEdgeDist_bot').val())
}


angle = {
	Fy: 36,
	Fu: 58,
	t: anglet,
	b: angleb,
	Lev_top: parseFloat($('#edgeDistAngleTop').val()),
	Lev_bot: parseFloat($('#edgeDistAngleBot').val())
};

bolt = {
	size: parseFloat($('#boltSize').val()),
	defCond: $('#defCond').val(),
	n: parseInt($('#numBolts').val()),
	s: parseFloat($('#boltSpacing').val()),
	hole: $('#holeType').val(),
	thread: $('#threadCond').val(),
	grade: $("#boltGrade").val(),
	type: $('#jointType').val()
};

var holeDia;
	if (bolt.hole === "STD" && bolt.size < 1) {
		holeDia = bolt.size + 1/16;
	}
	else if (hole === "STD" && bolt.size >= 1) {
		holeDia = bolt.size + 0.125;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size === 0.5) {
		holeDia = 0.625;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size >= 0.625 && bolt.size < 1) {
		holeDia = bolt.size + 3/16;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size === 1) {
		holeDia = bolt.size + 0.25;
	}
	else if (hole === "OVS" || hole === "SSLT" && bolt.size > 1) {
		holeDia = bolt.size + 0.3125;
	}
	else if (hole === "SSLT" || hole === "SSLT" && bolt.size > 1) {
		holeDia = bolt.size + 0.3125;
	}


runCalcs(angle, beam, bolt, holeDia);
drawFig(angle, beam, bolt);
displayTable();

//end of getProps
}

function runCalcs(angle, beam, bolt, holeDiameter) {

//
//BOLT SHEAR
//
var boltStrength;
if (bolt.grade === "groupA") {
		if (bolt.thread === "N") {
			boltStrength = 54;
		}
		if (bolt.thread === "X") {
			boltStrength = 68;
		}
} else if (bolt.grade === "groupB") {
		if (bolt.thread === "N") {
			boltStrength = 68;
		}
		if (bolt.thread === "X") {
			boltStrength = 84;
		}
}  

phiPnBS = 0.75*2*boltStrength*0.25*3.14159*bolt.size*bolt.size*bolt.n;
phiPnBS = Math.round(phiPnBS, 1);
//
//SLIP CRITICAL STRENGTH
//	
	var Tb;

	//if not SC, no need to report this limit state	
	if (bolt.type = "noSC") {
		phiPnSC = "N/A";
	}
	if (bolt.grade == "groupA") {
			switch (bolt.size) {
				case 0.5: 
					Tb = 12;
					break;
				case 0.625:
					Tb =19;
					break;
				case 0.75:
					Tb =28;
					break;
				case 0.875:
					Tb =39;
					break;
				case 1:
					Tb =51;
					break;
				case 1.125:
					Tb =64;
					break;
				case 1.25:
					Tb =81;
					break;
				case 1.375:
					Tb =97;
					break;
				case 1.5:
					Tb =118;
					break;
				default:
					Tb = 0;
			}

	}
	else if (bolt.grade == "groupB") {
			switch (bolt.size) {
				case 0.5: 
					Tb = 15;
					break;
				case 0.625:
					Tb =24;
					break;
				case 0.75:
					Tb =35;
					break;
				case 0.875:
					Tb =49;
					break;
				case 1:
					Tb =64;
					break;
				case 1.125:
					Tb =80;
					break;
				case 1.25:
					Tb =102;
					break;
				case 1.375:
					Tb =121;
					break;
				case 1.5:
					Tb =148;
					break;
				default:
					Tb = 0;
			}

	}
//this is incomplete. The following is a placeholder.
	if (bolt.hole === "STD" || bolt.hole === "SSLT") {
		phiPnSC = 100;
	}
	else if (bolt.hole === "OVS") {
		phiPnSC = 200;
	}

//
//BOLT BEARING ON BEAM
//

	if (bolt.defCond === "Yes") {
		phiPnBearing = 0.75*2.4*bolt.n*bolt.size*beam.tw*beam.Fu;
	}
	else if (bolt.defCond === "No") {
		phiPnBearing = 0.75*3*bolt.n*bolt.size*beam.tw*beam.Fu;
	}
	phiPnBearing = Math.round(phiPnBearing,1);


//
//BOLT TEAROUT ON BEAM
//
	
	var Lc = bolt.s - holeDiameter;
	var Lc_top = beam.Lev_top-0.5*holeDiameter;
	var Lc_bot = beam.Lev_bot-0.5*holeDiameter;
	if (beam.Lev_top && beam.Lev_bot) {
		if (bolt.defCond === "Yes") {
			phiPnTearout = 0.75*1.2*((bolt.n-1)*Lc+Lc_top)*beam.tw*beam.Fu;
			phiPnTearout = Math.round(phiPnTearout, 1);
		}
		else if (bolt.defCond === "No") {
			phiPnTearout = 0.75*2.4*((bolt.n-1)*Lc+Lc_top)*beam.tw*beam.Fu;
			phiPnTearout = Math.round(phiPnTearout, 1);
		}
	} else {
		phiPnTearout = "N/A"	
	}
	
//
//SHEAR YIELDING ON BEAM
//

if (beam.Lev_top && beam.Lev_bot) {
	phiPnBeamYield = 1.0*0.6*beam.Fy*beam.tw*((bolt.n-1)*bolt.s+beam.Lev_top+beam.Lev_bot);
	phiPnBeamYield = Math.round(phiPnBeamYield, 1);
} else {
	phiPnBeamYield = "N/A";
}
//
//SHEAR RUPTURE ON BEAM
//
if (beam.Lev_top && beam.Lev_bot) {
	var beamAg = beam.tw*((bolt.n-1)*bolt.s+beam.Lev_top+beam.Lev_bot);
	var beamAn = beamAg - (beam.tw*bolt.n*holeDiameter);
	phiPnBeamRupt = 0.75*0.6*beam.Fu*beamAn;
	phiPnBeamRupt = Math.round(phiPnBeamRupt, 1);
} else {
	phiPnBeamRupt = "N/A";
}

//
//BOLT BEARING ON ANGLE
//

	if (bolt.defCond === "Yes") {
		phiPnBearingAngle = 2*0.75*2.4*bolt.n*bolt.size*angle.t*angle.Fu;
	}
	else if (bolt.defCond === "No") {
		phiPnBearingAngle = 2*0.75*3*bolt.n*bolt.size*angle.t*angle.Fu;
	}
	phiPnBearingAngle = Math.round(phiPnBearingAngle,1);

//
//BOLT TEAROUT ON ANGLE
//	
var Lc_angle_top = angle.Lev_top-0.5*holeDiameter;
var Lc_angle_bot = angle.Lev_bot-0.5*holeDiameter;
var Lc_min = Math.min(Lc_angle_top, Lc_angle_bot);

	if (bolt.defCond === "Yes") {
			phiPnTearoutAngle = 2*0.75*1.2*((bolt.n-1)*Lc+Lc_angle_top)*angle.t*angle.Fu;
			phiPnTearoutAngle = Math.round(phiPnTearoutAngle, 1);
		}
	else if (bolt.defCond === "No") {
			phiPnTearoutAngle = 2*0.75*2.4*((bolt.n-1)*Lc+Lc_angle_top)*angle.t*angle.Fu;
			phiPnTearoutAngle = Math.round(phiPnTearoutAngle, 1);
		}
//
//SHEAR YIELDING ON ANGLE
//

phiPnAngleYield = 1.0*2*0.6*angle.Fy*angle.t*((bolt.n-1)*bolt.s+angle.Lev_top+angle.Lev_bot);
phiPnAngleYield = Math.round(phiPnAngleYield, 1);

//
//SHEAR RUPTURE ON ANGLE
//
var holePlus = holeDiameter + 1/16;
var angleAg = angle.t*((bolt.n-1)*bolt.s+angle.Lev_top+angle.Lev_bot);
var angleAn = angleAg - (angle.t*bolt.n*holePlus);
phiPnAngleRupt = 0.75*0.6*2*angle.Fu*angleAn;
phiPnAngleRupt = Math.round(phiPnAngleRupt, 1);
//
//BLOCK SHEAR ON ANGLE
//



//this is closing curly brace of runCalcs()
};
//
// FUNCTION TO DRAW FIGURE
//

function drawFig(angle, beam, bolt) {
	var angleLength = (bolt.n-1)*bolt.s + angle.Lev_top+angle.Lev_bot;
	var r = beam.tw;	
	var c = document.getElementById("myCanvas");
	c.width = beam.bf*1.2*7;
	c.height = beam.d*1.2*7;
	var ctx = c.getContext("2d");
	ctx.scale(7,7);
	ctx.translate(1,1);
	ctx.lineWidth=0.1;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(beam.bf,0);
	ctx.moveTo(beam.bf,0);
	ctx.lineTo(beam.bf,beam.tf);
	ctx.moveTo(beam.bf,beam.tf);
	ctx.lineTo(beam.bf-0.5*beam.bf+r+0.5*beam.tw,beam.tf);
	ctx.moveTo(beam.bf-0.5*beam.bf+r+0.5*beam.tw,beam.tf);
	ctx.arc(beam.bf-0.5*beam.bf+r+0.5*beam.tw, beam.tf+r,r, 1.5*Math.PI, Math.PI, true);
	ctx.moveTo(beam.bf*0.5+beam.tw*.5, beam.tf+r);
	ctx.lineTo(beam.bf*0.5+beam.tw*.5, beam.d-(beam.tf+r));
	ctx.moveTo(beam.bf*0.5+beam.tw*.5, beam.d-(beam.tf+r));
	ctx.arc(beam.bf-0.5*beam.bf+r+0.5*beam.tw, beam.d-beam.tf-r, r, 1.0*Math.PI, 0.5*Math.PI, true);
	ctx.moveTo(beam.bf-0.5*beam.bf+r+0.5*beam.tw, beam.d-beam.tf);
	ctx.lineTo(beam.bf, beam.d-beam.tf);
	ctx.moveTo(beam.bf, beam.d-beam.tf);
	ctx.lineTo(beam.bf, beam.d);
	ctx.lineTo(0, beam.d);
	ctx.moveTo(0, beam.d);
	ctx.lineTo(0, beam.d-beam.tf);
	ctx.moveTo(0, beam.d-beam.tf);
	ctx.lineTo(beam.bf*0.5-beam.tw*0.5-r, beam.d-beam.tf);
	ctx.moveTo(beam.bf*0.5-beam.tw*0.5-r, beam.d-beam.tf);	
	ctx.arc(beam.bf*0.5-beam.tw*0.5-r, beam.d-beam.tf-r, r, 0.5*Math.PI, 0, true);
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw, beam.d-beam.tf-r);
	ctx.lineTo(0.5*beam.bf-0.5*beam.tw, beam.tf+r);
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw, beam.tf+r);
	ctx.arc(0.5*beam.bf-0.5*beam.tw-r, beam.tf+r, r, 0, 1.5*Math.PI, true);
	ctx.moveTo(0.5*beam.bf-0.5*beam.tw-r, beam.tf);
	ctx.lineTo(0, beam.tf);
	ctx.moveTo(0, beam.tf);
	ctx.lineTo(0,0);
	//draw the left angle
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw, 2*beam.tf);
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.b, 2*beam.tf+angleLength);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf - 0.5*beam.tw - angle.t, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf - 0.5*beam.tw - angle.t, 2*beam.tf+angleLength);
	//draw the right angle
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf);
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw + angle.b, 2*beam.tf+angleLength);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw, 2*beam.tf+angleLength);
	ctx.moveTo(0.5*beam.bf + 0.5*beam.tw + angle.t, 2*beam.tf);
	ctx.lineTo(0.5*beam.bf + 0.5*beam.tw + angle.t, 2*beam.tf+angleLength);
	ctx.stroke();
	//draw bolts on left angle
	for (var i = 0; i<bolt.n; i++) {
		ctx.beginPath();
		var ctrx = 0.5*beam.bf - 0.5*beam.tw - angle.b*0.6;
		var ctry = 2*beam.tf+angle.Lev_top+i*bolt.s;
		ctx.arc(ctrx, ctry, bolt.size*0.5, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.stroke();
	};
	//draw bolts on right angle
	for (var i = 0; i<bolt.n; i++) {
		ctx.beginPath();
		var ctrx = 0.5*beam.bf + 0.5*beam.tw + angle.b*0.6;
		var ctry = 2*beam.tf+angle.Lev_top+i*bolt.s;
		ctx.arc(ctrx, ctry, bolt.size*0.5, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.stroke();
	};

	//draw bolts through beam web
	for (var i = 0; i<bolt.n; i++) {
		ctx.beginPath();
		var ycoord = 2*beam.tf+angle.Lev_top-0.5*bolt.size+i*bolt.s;
		ctx.rect(0.5*beam.bf - 0.5*beam.tw-angle.t, ycoord, 2*angle.t+beam.tw, bolt.size);
		ctx.fill();
		ctx.stroke();
	};
}

//
//FUNCTION TO POPULATE HANDLEBARS TEMPLATE
//

function displayTable() {
	var source = $("#limit-states").html();
	var template = Handlebars.compile(source);
	var data = {phiPnBS: phiPnBS, 
		slipCritStrength: phiPnSC, 
		bearing: phiPnBearing, 
		tearout: phiPnTearout, 
		bearingAngles: phiPnBearingAngle, 
		tearoutAngles: phiPnTearoutAngle, 
		shearYieldBeam: phiPnBeamYield,
		shearRuptBeam: phiPnBeamRupt,
		shearYieldAngles: phiPnAngleYield,
		shearRuptAngles: phiPnAngleRupt
		 };
	var newTable = template(data);
	$('#checks').html(newTable);
	$('#theButton').hide();
	$('#startAgainBtn').show();
};

//
// FUNCTION TO RELOAD THE PAGE ON CLICK
//

function startOver() {
	location.reload();
}
