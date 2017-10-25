
//global variables which are used by the displayTable function that populates the Handlebars template
var phiPnBSAngle;
var phiPnBSBeam;
var phiPnSC;
var phiPnBeamYield;
var phiPnBeamRupt;
var phiPnAngleYield;
var phiPnAngleRupt;
var phiPnBoltBeamSide;
var oneBoltBS;
var oneBoltBeamTearoutEdge;
var oneBoltBeamTearoutCenter;
var oneBoltBeamBearing;
var oneBoltAngleBearing;
var oneBoltAngleTearoutEdge;
var oneBoltAngleTearoutCenter;
var beam;
var angle;
var bolt;


$(document).ready(function() {

  //event listener for the button
$("#theButton").on("click", getProps);

//event listener for the start over button
$('#startAgainBtn').on('click', startOver);

//event listener to ask for additional user input only if beam is coped
$('#beamCopeForm').one('change', function() {
	var copeCondition = $('#beamCope').val();
	var n = document.getElementById('inputTable').rows.length;
	
	if (copeCondition === "toponly") {
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(n-2);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Beam Cope - Top Edge Distance";
    	cell2.innerHTML = "<input id='copeEdgeDist_top' class = 'form-control input-sm' placeholder = 1.5 value=1.5></input>";
    	var row = mytable.insertRow(n-1);
		var cella = row.insertCell(0);
    	var cellb = row.insertCell(1);
    	cella.innerHTML = "Beam - Horizontal End Distance";
    	cellb.innerHTML = "<input id='beamLeh' class = 'form-control input-sm' placeholder = 1.25 value = 1.25></input>";
	} 
	if (copeCondition ==="both") {
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(n-2);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Beam Cope - Top Edge Distance";
    	cell2.innerHTML = "<input id='copeEdgeDist_top' class = 'form-control input-sm' placeholder = 1.5 value=1.5></input>";
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(n-1);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Beam Cope - Bottom Edge Distance";
    	cell2.innerHTML = "<input id='copeEdgeDist_bot' class = 'form-control input-sm' placeholder = 1.5 value=1.5></input>";
    	var row = mytable.insertRow(n);
		var cella = row.insertCell(0);
    	var cellb = row.insertCell(1);
    	cella.innerHTML = "Beam - Horizontal End Distance";
    	cellb.innerHTML = "<input id='beamLeh' class = 'form-control input-sm' placeholder = 1.25 value = 1.25></input>";
	}
});

//event listener to ask for additional user input only if SC bolts
$('#jointTypeForm').one('change', function() {
	var jointType = $('#jointType').val();	
	if (jointType === "SCA" || jointType === "SCB") {
		var mytable = document.getElementById('inputTable');
		var row = mytable.insertRow(7);
		var cell1 = row.insertCell(0);
    	var cell2 = row.insertCell(1);
    	cell1.innerHTML = "Number of fillers";
    	cell2.innerHTML = "<input id='numFillers' class = 'form-control input-sm' type = number></input>";
    } 
});

//end of on ready function
});

function getProps() {

var beamSize= $('#beamSize').val();
var angleSize= $('#angleSize').val();



//Wshapes is a large array of objects in a separate Wshapes.js file
for (var i = 0; i < Wshapes.length; i++) {
		if (beamSize === Wshapes[i].Size) {
			beamtw = parseFloat(Wshapes[i].tw);
			beambf = parseFloat(Wshapes[i].bf);
			beamtf = parseFloat(Wshapes[i].tf);
			beamd = parseFloat(Wshapes[i].d);
		}
	}
	
//deal with beam cope geometry
var Lev_top = parseFloat($('#copeEdgeDist_top').val());
var Lev_bot = parseFloat($('#copeEdgeDist_bot').val());
var Leh = parseFloat($('#beamLeh').val());

if (isNaN(Lev_top)) {
	Lev_top = 0;
}
if (isNaN(Lev_bot)) {
	Lev_bot = 0;
}
if (isNaN(Leh)) {
	Leh = 0;
}
beam = {
	Fy: 50,
	Fu: 65,
	cope: $('#beamCope').val(),
	tw: beamtw,
	bf: beambf,
	tf: beamtf,
	d: beamd,
	Lev_top: Lev_top,
	Lev_bot:Lev_bot, 
	Leh: Leh
}


angle = {
	Fy: 36,
	Fu: 58,
	t: parseFloat($('#angleThickness').val()),
	b: 3.5,
	Lev_top: parseFloat($('#edgeDistAngleTop').val()),
	Lev_bot: parseFloat($('#edgeDistAngleBot').val()),
	Leh: parseFloat($('#horizDistAngle').val())
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
	else if (bolt.hole === "STD" && bolt.size >= 1) {
		holeDia = bolt.size + 0.125;
	}
	else if (bolt.hole === "OVS" || bolt.hole === "SSLT" && bolt.size === 0.5) {
		holeDia = 0.625;
	}
	else if (bolt.hole === "OVS" || bolt.hole === "SSLT" && bolt.size >= 0.625 && bolt.size < 1) {
		holeDia = bolt.size + 3/16;
	}
	else if (bolt.hole === "OVS" || bolt.hole === "SSLT" && bolt.size === 1) {
		holeDia = bolt.size + 0.25;
	}
	else if (bolt.hole === "OVS" || bolt.hole === "SSLT" && bolt.size > 1) {
		holeDia = bolt.size + 0.3125;
	}
	else if (hole === "SSLT" || bolt.hole === "SSLT" && bolt.size > 1) {
		holeDia = bolt.size + 0.3125;
	}

//CHECKS TO MAKE SURE GEOMETRIES ARE REASONABLE
if (testInput(angle, beam, bolt,holeDia)) {
runCalcs(angle, beam, bolt, holeDia);
drawFig(angle, beam, bolt);
displayTable();
}

//end of getProps
}

//function to test that inputs are reasonable
function testInput(angle, beam, bolt, holeDia) {
if (beam.d < (angle.Lev_top+angle.Lev_bot+(bolt.n-1)*bolt.s)) {
	alert("The connection is too long. Please choose a different geometry.");
	return false;
}
if (bolt.hole === "SSLT" || bolt.hole === "OVS" && bolt.type === "noSC") {
	alert("You must use a slip-critical joint with OVS or SSLT holes.");
	return false;
}
if (bolt.s < bolt.size*2.67 || bolt.s-(bolt.size+.125) < bolt.size) {
	alert("Bolt spacing must be at least 2-2/3d and bolt clear distance must be at least d.");
	return false;
}

var maxDist = Math.max(beam.Leh, beam.Lev_top, beam.Lev_bot, angle.Leh, angle.Lev_top, angle.Lev_bot);

if (maxDist > 6 || maxDist > 12*beam.tw || maxDist > 12*angle.t) {
	alert("Bolt edge distance is too large.");
	return false;
}
if (beam.cope == "") {
	alert("Please specify beam cope information.");
	return false;
} else {return true;}
//end of testInput function
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
oneBoltBS = 0.75*2*boltStrength*0.25*3.14159*bolt.size*bolt.size;
phiPnBS = 0.75*2*boltStrength*0.25*3.14159*bolt.size*bolt.size*bolt.n;
phiPnBS = Math.round(phiPnBS, 1);
//
//SLIP CRITICAL STRENGTH
//	
	var Tb;
	var hf;
	var nFills = $('#numFillers').val();
	if (nFills === 1 || nFills === 0) {
		hf = 1.0;
	} else {
		hf = 0.85;
	};
	//if not SC, no need to report this limit state	
	
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
	} else if (bolt.grade == "groupB") {
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

	if (bolt.type === "noSC") {
		phiPnSC = "N/A";
	} else if (bolt.hole === "STD" || bolt.hole === "SSLT") {
		phiPnSC = 1.0*1.13*hf*Tb*2;
		phiPnSC = Math.round(phiPnSC, 1);
	} else if (bolt.hole === "OVS") {
		phiPnSC = 0.85*1.13*hf*Tb*2;
		phiPnSC = Math.round(phiPnSC, 1);
	}

//
//BOLT BEARING ON BEAM
//

	if (bolt.defCond === "Yes") {
		phiPnBearing = 0.75*2.4*bolt.n*bolt.size*beam.tw*beam.Fu;
		oneBoltBeamBearing = 0.75*2.4*bolt.size*beam.tw*beam.Fu;
	}
	else if (bolt.defCond === "No") {
		phiPnBearing = 0.75*3*bolt.n*bolt.size*beam.tw*beam.Fu;
		oneBoltBeamBearing = 0.75*3*bolt.size*beam.tw*beam.Fu;
	}
	phiPnBearing = Math.round(phiPnBearing,1);
	oneBoltBeamBearing = Math.round(oneBoltBeamBearing,1);

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
			oneBoltBeamTearoutCenter = 0.75*1.2*Lc*beam.tw*beam.Fu;
			oneBoltBeamTearoutEdge = 0.75*1.2*Lc_top*beam.tw*beam.Fu;
		}
		else if (bolt.defCond === "No") {
			phiPnTearout = 0.75*2.4*((bolt.n-1)*Lc+Lc_top)*beam.tw*beam.Fu;
			phiPnTearout = Math.round(phiPnTearout, 1);
			oneBoltBeamTearoutCenter = 0.75*2.4*Lc*beam.tw*beam.Fu;
			oneBoltBeamTearoutEdge = 0.75*2.4*Lc_top*beam.tw*beam.Fu;
		}
	} else {
		phiPnTearout = "N/A"
		oneBoltBeamTearoutCenter = 1000000000;
		oneBoltBeamTearoutEdge = 1000000000;	
	}
//
//BOLT BEARING ON ANGLE
//

	if (bolt.defCond === "Yes") {
		phiPnBearingAngle = 2*0.75*2.4*bolt.n*bolt.size*angle.t*angle.Fu;
		oneBoltAngleBearing = 2*0.75*2.4*bolt.size*angle.t*angle.Fu;
	}
	else if (bolt.defCond === "No") {
		phiPnBearingAngle = 2*0.75*3*bolt.n*bolt.size*angle.t*angle.Fu;
		oneBoltAngleBearing = 2*0.75*3*bolt.size*angle.t*angle.Fu;
	}
	phiPnBearingAngle = Math.round(phiPnBearingAngle,1);
	oneBoltAngleBearing = Math.round(oneBoltAngleBearing, 1);
//
//BOLT TEAROUT ON ANGLE
//	
var Lc_angle_top = angle.Lev_top-0.5*holeDiameter;
var Lc_angle_bot = angle.Lev_bot-0.5*holeDiameter;
var Lc_min = Math.min(Lc_angle_top, Lc_angle_bot);

	if (bolt.defCond === "Yes") {
			phiPnTearoutAngle = 2*0.75*1.2*((bolt.n-1)*Lc+Lc_angle_top)*angle.t*angle.Fu;
			oneBoltAngleTearoutCenter = 2*0.75*1.2*Lc*angle.t*angle.Fu;
			oneBoltAngleTearoutEdge = 2*0.75*1.2*Lc_angle_top*angle.t*angle.Fu;
		}
	else if (bolt.defCond === "No") {
			phiPnTearoutAngle = 2*0.75*2.4*((bolt.n-1)*Lc+Lc_angle_top)*angle.t*angle.Fu;
			oneBoltAngleTearoutCenter = 2*0.75*2.4*Lc*angle.t*angle.Fu;
			oneBoltAngleTearoutEdge = 2*0.75*2.4*Lc_angle_top*angle.t*angle.Fu;			
		}
	phiPnTearoutAngle = Math.round(phiPnTearoutAngle, 1);
	oneBoltAngleTearoutCenter = Math.round(oneBoltAngleTearoutCenter, 1);
	oneBoltAngleTearoutEdge= Math.round(oneBoltAngleTearoutEdge, 1);
//
//COMBINE BOLT SHEAR, BEARING, AND TEAROUT ON BEAM  OR ON ANGLE
//
var edgeBoltBeamSide = Math.min(oneBoltBS, oneBoltBeamBearing, oneBoltAngleBearing, oneBoltBeamTearoutEdge, oneBoltAngleTearoutEdge);
var typBoltBeamSide = Math.min(oneBoltBS, oneBoltBeamBearing, oneBoltAngleBearing, oneBoltBeamTearoutCenter, oneBoltAngleTearoutCenter);
phiPnBoltBeamSide = Math.round(edgeBoltBeamSide + (bolt.n-1)*typBoltBeamSide, 1);


//
//SHEAR YIELDING ON BEAM
//

if (beam.cope != "no") {
	phiPnBeamYield = 1.0*0.6*beam.Fy*beam.tw*((bolt.n-1)*bolt.s+beam.Lev_top+beam.Lev_bot);
	phiPnBeamYield = Math.round(phiPnBeamYield, 1);
} else {
	phiPnBeamYield = "N/A";
}
//
//SHEAR RUPTURE ON BEAM
//
if (beam.cope != "no") {
	var beamAg = beam.tw*((bolt.n-1)*bolt.s+beam.Lev_top+beam.Lev_bot);
	var beamAn = beamAg - (beam.tw*bolt.n*(holeDiameter+0.0625));
	phiPnBeamRupt = 0.75*0.6*beam.Fu*beamAn;
	phiPnBeamRupt = Math.round(phiPnBeamRupt, 1);
} else {
	phiPnBeamRupt = "N/A";
}
//BLOCK SHEAR ON BEAM
//
if (beam.cope != "no") {
	var minBeamLev = Math.min(beam.Lev_top, beam.Lev_bot);
	var beamAgv = beam.tw*(bolt.s*(bolt.n-1)+minBeamLev);
	var beamAnv = beamAgv - beam.tw*(bolt.n-0.5)*(holeDiameter+0.0625);
	var beamAnt = beam.tw*(beam.Leh-0.5*(holeDiameter+0.0625));
	var beamFuAnt = beam.Fu*beamAnt;
	var beamComp = Math.min(beam.Fu*beamAnv, beam.Fy*beamAgv);
	phiPnBSBeam = 0.75*(0.6*beamComp+beamFuAnt);
	phiPnBSBeam = Math.round(phiPnBSBeam, 1);
} else {
	phiPnBSBeam = "N/A";
}


//
//SHEAR YIELDING ON ANGLE
//

phiPnAngleYield = 1.0*2*0.6*angle.Fy*angle.t*((bolt.n-1)*bolt.s+angle.Lev_top+angle.Lev_bot);
phiPnAngleYield = Math.round(phiPnAngleYield, 1);

//
//SHEAR RUPTURE ON ANGLE
//
var angleAg = angle.t*((bolt.n-1)*bolt.s+angle.Lev_top+angle.Lev_bot);
var angleAn = angleAg - (angle.t*bolt.n*(holeDiameter+0.0625));
phiPnAngleRupt = 0.75*0.6*2*angle.Fu*angleAn;
phiPnAngleRupt = Math.round(phiPnAngleRupt, 1);
//
//BLOCK SHEAR ON ANGLE
//
var minLev = Math.min(angle.Lev_top, angle.Lev_bot);
var angleAgv = angle.t*(bolt.s*(bolt.n-1)+minLev);
var angleAnv = angleAgv - angle.t*(bolt.n-0.5)*(holeDiameter+0.0625);
var angleAnt = angle.t*(angle.Leh-0.5*(holeDiameter+0.0625));
var FuAnt = angle.Fu*angleAnt;
var angleComp = Math.min(angle.Fu*angleAnv, angle.Fy*angleAgv);
phiPnBSAngle = 0.75*2*(0.6*angleComp+FuAnt);
phiPnBSAngle = Math.round(phiPnBSAngle, 1);

//this is closing curly brace of runCalcs()
};
//
// FUNCTION TO DRAW FIGURE
//

function drawFig(angle, beam, bolt) {
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
	var data = {LSBoltBeamSide: phiPnBoltBeamSide, 
		slipCritStrength: phiPnSC, 
		shearYieldBeam: phiPnBeamYield,
		shearRuptBeam: phiPnBeamRupt,
		blockShearBeam: phiPnBSBeam,
		shearYieldAngles: phiPnAngleYield,
		shearRuptAngles: phiPnAngleRupt,
		blockShearAngles: phiPnBSAngle
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
