
$(document).ready(function() {
    $('#runFunc').on("click", showMnPn);

    });
    
function phiPn(KLx, KLy, A, bf2tf, htw, tw, rx, ry, bf, d, tf, kdet)
{
    var E = 29000.;
    var Fy = 50.;
    var Fcr;
    var Fe;
   	var Ae = A;

    //calculate Fe
    var Fex = Math.pow(3.14159, 2) * E/Math.pow(KLx * 12. / rx, 2);
    var Fey = Math.pow(3.14159, 2) * E/Math.pow(KLy * 12. / ry, 2);
    Fe = Math.min(Fex, Fey);
    var lambdarFlange = 0.56*Math.sqrt(E / Fy)
    var lambdarWeb = 1.49*Math.sqrt(E / Fy)
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

     var phiPn = 0.9*Fcr*Math.min(A, Ae);
     return phiPn;

}

function phiMn(L, Cb, Z, S, rts, J, h0, ry, Iy, bf2tf, htw)
{
    var E = 29000.;
    var Fy = 50.;
    var Mp = Z * Fy;
	var MnFLB;
	var MnLTB;
	var Lpprime;
	var Mpprime;
    var Lp = (1. / 12) * 1.76 * ry * Math.sqrt(E / Fy);
    var d = J / (S * h0);
    var g = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((0.7 * Fy / E), 2));
    var Lr = (1. / 12) * 1.95 * rts * (E / (0.7 * Fy)) * Math.sqrt(d + g);
	var lambdap = 0.38 * Math.sqrt(E / Fy);
	var	lambdar = Math.sqrt(E / Fy);
	
//calc Mn_LTB
    if(L < Lp)
        {
            MnLTB = Mp;
        }
    else if(L > Lp && L < Lr)
        {
            MnLTB = Cb * (Mp - (Mp - 0.7 * Fy * S) * (L - Lp) / (Lr - Lp));
            MnLTB = Math.min(MnLTB, Mp);
        }
	else 
		{
			Fcr = (Cb*E*3.14159*3.14159/(Math.pow(L*12/rts, 2)))*Math.sqrt(1+0.078*d*Math.pow(L*12/rts, 2));
			MnLTB = S*Fcr;
			MnLTB = Math.min(MnLTB, Mp);
		}
    //address noncompact and slender flanges (webs are always compact)
	if(bf2tf > lambdap && bf2tf < lambdar)
    {
        MnFLB = Mp - (Mp - 0.7 * Fy * S) * (bf2tf - lambdap) / (lambdar - lambdap);
		
	}
    else if(bf2tf > lambdar)
    {
        MnFLB = 0.9*E*S*4/(Math.sqrt(htw)*Math.pow(bf2tf,2));
    }
	else 
	{
		MnFLB = Mp;
	}
	Mn = Math.min(MnFLB, MnLTB);
    var phiMn = 0.9 * Mn / 12;
    return phiMn;
}

function getMnPn(L, KLx, KLy, Cb)
{
    var mnpn = [];
    for(var i = 0; i < Wshapes.length; i++) {
        var shape = Wshapes[i];   
        var pn = phiPn(KLx, KLy, shape.A, shape.bf2tf, shape.htw, shape.tw, shape.rx, shape.ry, shape.bf, shape.d, shape.tf, shape.kdet);
        var rts = Math.sqrt(Math.sqrt(shape.Iy*shape.Cw)/shape.Sx);
        var h0 = shape.d - shape.tf;
        var mn = phiMn(L, Cb, shape.Zx, shape.Sx, rts, shape.J, h0, shape.ry, shape.Iy, shape.bf2tf, shape.htw);
  
        mnpn[i] = {
            "size": shape["Size"],
            "weight": parseInt(shape["W"]),
            "phiMn": mn,
            "phiPn": pn,
            "depthSeries": parseInt(shape["Size"].slice(1).split("X")[0])
        }
    }
      return mnpn;
}

function getShape(Pu, Mu, maxDepth, mnpn) {
   
    for (var i = 0; i < mnpn.length; i++) {
        var shape = mnpn[i];
        
        if(Pu/shape["phiPn"] >= 0.2)
        {
            shape["result"] = (Pu/shape["phiPn"]) + (8./9)*(Mu/shape["phiMn"]);
        }
        else
        {
            shape["result"] = (Pu/(2*shape["phiPn"])) + (Mu/shape["phiMn"]);
        }
        
    }
    
    var minWeight = Infinity;
    var minShape = "No W" + maxDepth + " shape satisfies the criteria.";
   
    for (var j = 0; j < mnpn.length; j++) {
        var shape = mnpn[j];
        if (shape["result"] <= 1 && shape["weight"] < minWeight && shape["depthSeries"] <= maxDepth)
            {
            minWeight = shape["weight"];
            minShape = shape["size"];
            }   
    }
   
    return minShape;
}


function showMnPn() {

 var L=parseInt($('#flexL').val());
 var KLx=parseInt($("#colKLx").val());
 var KLy=parseInt($("#colKLy").val());
 var Cb=parseInt($("#Cb").val());
 var Pu=parseInt($("#Pu").val());
 var Mu=parseInt($("#Mu").val());
 var maxDepth=parseInt($("#maximumDepth").val());
 var mnpn = getMnPn(L, KLx, KLy, Cb);
 var theAnswer = getShape(Pu, Mu, maxDepth, mnpn);
 $('#result').html(theAnswer);
 var ourShape = mnpn.findIndex(x => x.size==theAnswer); 
  $('#phiMn').html(ourShape);
  }

