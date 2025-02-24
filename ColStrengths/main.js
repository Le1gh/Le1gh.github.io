var E = 29000.;
var Fy = 50.;
var G = 11200;

$(document).ready(function() {
    $('#theButton').on("click", getStrengths);
    //event listener for the start over button
	$('#startAgainBtn').on('click', startOver);
 });

function getStrengths() {
    // get the column size
    var Lcx = parseFloat($('#colKLx').val());
    var Lcy = parseFloat($('#colKLy').val());
    var Lcz = parseFloat($('#colKLz').val());
	var xa = parseFloat($('#xa').val());
	//var ya = parseFloat($('#ya').val());
	var Pu = parseFloat($('#Pu').val());
    var colSize = $('#colSize').val();
 
    for (var i = 0; i < Wshapes.length; i++) {
        if (colSize === Wshapes[i].Size) {
            var column = {
                A: parseFloat(Wshapes[i].A),
                d: parseFloat(Wshapes[i].d),
                bf2tf: parseFloat(Wshapes[i].bf2tf),
                htw: parseFloat(Wshapes[i].htw),
                tw: parseFloat(Wshapes[i].tw),
                rx: parseFloat(Wshapes[i].rx),
                ry: parseFloat(Wshapes[i].ry),
                bf: parseFloat(Wshapes[i].bf),
                tf: parseFloat(Wshapes[i].tf),
                Ix: parseFloat(Wshapes[i].Ix),
                Iy: parseFloat(Wshapes[i].Iy),
                Cw: parseFloat(Wshapes[i].Cw),
                J: parseFloat(Wshapes[i].J),
        }
    }
}

var FBLimitState = phiPn_FlexuralBuckling(Lcx, Lcy, column.A, column.rx, column.ry,);
var TBLimitState = phiPn_TorsionalBuckling(column.A, column.Ix, column.Iy, column.Cw, Lcz, column.J);
var LBLimitState = phiPn_LocalBuckling(Lcx, Lcy, column.A, column.bf2tf, column.htw, column.tw, column.rx, column.ry, column.bf, column.d, column.tf);
var CAFTBLimitState = phiPn_CAFTB(column, Lcz, xa);
var bracing = calcTorsionalBracingStiffness(column, Pu, xa, Lcz, FBLimitState, LBLimitState, TBLimitState);
displayTable(FBLimitState, TBLimitState, LBLimitState, CAFTBLimitState);
displayBracing(bracing);
}

    
function phiPn_FlexuralBuckling(KLx, KLy, A, rx, ry)
{
    var Fcr;
    var Fe;

    //calculate Fe
    var Fex = Math.pow(3.14159, 2) * E/Math.pow(KLx * 12. / rx, 2);
    var Fey = Math.pow(3.14159, 2) * E/Math.pow(KLy * 12. / ry, 2);
    Fe = Math.min(Fex, Fey);

    //calculate Fcr
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
     var phiPnFB = parseInt(0.9*Fcr*A);
     return phiPnFB;

}

function phiPn_LocalBuckling(KLx, KLy, A, bf2tf, htw, tw, rx, ry, bf, d, tf) {
    var Fcr;
    var Fe;
    var Ae = A;
    var lambdarFlange = 0.56*Math.sqrt(E / Fy)
    var lambdarWeb = 1.49*Math.sqrt(E / Fy)
    console.log(lambdarFlange, lambdarWeb);

    //calculate Fe
    var Fex = Math.pow(3.14159, 2) * E/Math.pow(KLx * 12. / rx, 2);
    var Fey = Math.pow(3.14159, 2) * E/Math.pow(KLy * 12. / ry, 2);
    Fe = Math.min(Fex, Fey);

    //calculate Fcr
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
 //check for slender flanges only
    
     if (bf2tf > lambdarFlange*Math.sqrt(Fy/Fcr) && htw < lambdarWeb*Math.sqrt(Fy/Fcr)) {
        var c1 = 0.22;
        var c2 = 1.49;
        var Fel = Fy*Math.pow(c2*lambdarFlange/bf2tf, 2);
        var be = bf*(1-c1*Math.sqrt(Fel/Fcr))*Math.sqrt(Fel/Fcr);
        Ae = (2*be*tf)+(tw*d-2*tf);
     }

     //check for slender webs
     if (htw >lambdarWeb*Math.sqrt(Fy/Fcr) && bf2tf < lambdarFlange*Math.sqrt(Fy/Fcr)) {
        var c1 = 0.18;
        var c2 = 1.31;
        var h = htw*tw;
        var Fel = Fy*Math.pow(c2*lambdarWeb/htw, 2);
        var he = h*(1-c1*Math.sqrt(Fel/Fcr))*Math.sqrt(Fel/Fcr);
        Ae = (2*bf*tf)+tw*he;
     }

     //check if both are slender
      if (htw >lambdarWeb*Math.sqrt(Fy/Fcr) && bf2tf > lambdarFlange*Math.sqrt(Fy/Fcr)) {
        var c1Flange = 0.22;
        var c2Flange = 1.49;
        var c1Web = 0.18;
        var c2Web = 1.31;
        var FelFlange = Fy*Math.pow(c2Flange*lambdarFlange/bf2tf, 2);
        var FelWeb = Fy*Math.pow(c2Web*lambdarWeb/htw, 2);
        var be = bf*(1-c1Flange*Math.sqrt(FelFlange/Fcr))*Math.sqrt(FelFlange/Fcr);
        var he = h*(1-c1*Math.sqrt(Fel/Fcr))*Math.sqrt(Fel/Fcr);
        Ae = he*tw+2*bf*be;
     }
   
     if (htw < lambdarWeb*Math.sqrt(Fy/Fcr) && bf2tf < lambdarFlange*Math.sqrt(Fy/Fcr)) {
        var phiPnLB = "N/A";
     }

     else {
     var phiPnLB = parseInt(0.9*Fcr*Math.min(Ae,A));
    }
     return phiPnLB;

}

function phiPn_TorsionalBuckling(A, Ix, Iy, Cw, Lcz, J) {
    var Fe = (1/(Ix+Iy))*(Math.pow(3.14159, 2)*29000*Cw/Math.pow(Lcz*12, 2)+11200*J);
    var Fcr;
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
    var phiPnTB = parseInt(0.9*Fcr*A);
    return phiPnTB;
}

function phiPn_CAFTB(column, Lcz, xa) {
	var h0 = column.d - column.tf;
	var ro_squared = Math.pow(column.rx, 2) + Math.pow(column.ry, 2) + Math.pow(xa, 2);
	var first_term = Math.pow(Math.PI, 2) * 29000*(column.Iy) / Math.pow(Lcz*12, 2);
	var inner_term = 0.25*Math.pow(h0, 2) + Math.pow(xa, 2);
	var Fe = (1/(column.A * ro_squared)) * (first_term * inner_term + 11200 * column.J);
	var Fcr;
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
    var phiPnCAFTB = parseInt(0.9*Fcr*column.A);
    return phiPnCAFTB;
}
/*
function phiPn_CAFTB(A, Cw, Iy, d, rx, ry, J, Lcz) {
	var temp_num = Cw+Iy*Math.pow(0.5*d, 2);
	var temp_denom = A*(Math.pow(rx, 2)+Math.pow(ry, 2)+Math.pow(0.5*d, 2));
	var Fe = 0.9*(G*J+(E*Math.pow(3.14159265, 2)*temp_num/Math.pow(Lcz*12, 2)))*(1/temp_denom);
	var Fcr;
    if (Fy/Fe < 2.25) {
        Fcr = Fy * Math.pow(0.658, (Fy/Fe))
    }
    else {
        Fcr = 0.877 * Fe;
    }
    var phiPnCAFTB = parseInt(0.9*Fcr*A);
    return phiPnCAFTB;
}
*/

function calcTorsionalBracingStiffness(column, Pu, ya, Lcz, Pn_FB, Pn_LB, Pn_TB) 
{
	var h0 = column.d - column.tf;
	var E = 29000;
	var Aa = Math.max(2, (4 - 2*ya) / h0);
	var ro_squared = Math.pow(column.rx, 2) + Math.pow(column.ry, 2) + Math.pow(ya, 2);
	
	var n = 1;
	var taub = 1;
	var Po = Math.min(Pn_FB, Pn_TB);
	if (Pn_LB)
		Po = Math.min(Po, Pn_TB);
	var num_second_term = 0.25*Math.pow(h0, 2) + Math.pow(ya, 2);
	var numerator = Aa*Math.pow(Pu*ro_squared - Po * num_second_term, 2);
	var denominator = 4*n*taub*E*column.Iy/(12*Lcz) * (0.25*Math.pow(h0, 2) + Math.pow(ya, 2));
	console.log(numerator);
	console.log(denominator);
	var beta = numerator / denominator;
    return parseInt(beta);

}


function displayTable(FB, TB, LB, CAFTB) {
    //$('#checks').empty();
    var source = $("#colStrengths").html();
    var template = Handlebars.compile(source);
    var data = {
    	showFB: FB,
        showTB: TB,
        showLB: LB,
        showCAFTB: CAFTB
         };
    var newTable = template(data);
    $('#checks').html(newTable);
    $('#theButton').hide();
    $('#startAgainBtn').show();

};

function displayBracing(FB, TB, LB, CAFTB) {
    //$('#checks').empty();
    var source = $("#bracingVals").html();
    var template = Handlebars.compile(source);
    var data = {
    	showBracing: FB
         };
    var newTable = template(data);
    $('#bracing').html(newTable);
    //$('#theButton').hide();
    //$('#startAgainBtn').show();

};
    
//
// FUNCTION TO RELOAD THE PAGE ON CLICK
//

function startOver() {
	location.reload();

}


