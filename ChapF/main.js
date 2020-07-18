
$(document).ready(function() {
   
$('#startAgainBtn').on('click', startOver);
//event listener for BU shapes

$('#beamForm').on('change', function() {

//$('#beamForm').one('change', function() {
    var type = $('#beamSize').val();  
    var n = document.getElementById('inputTable').rows.length;

    if (type === "BU" && n <= 6) {
        
        var BUTable = document.getElementById('inputTable');
        var row1 = BUTable.insertRow(4);
        var cell1 = row1.insertCell(0);
        var cell2 = row1.insertCell(1);
        cell1.innerHTML = "Depth";
        cell2.innerHTML = "<input id='depth' class = 'form-control input-sm'></input>";
        var row2 = BUTable.insertRow(5);
        var cell1 = row2.insertCell(0);
        var cell2 = row2.insertCell(1);
        cell1.innerHTML = "Web thickness";
        cell2.innerHTML = "<input id='tw' class = 'form-control input-sm' ></input>";
        var row3 = BUTable.insertRow(6);
        var cell1 = row3.insertCell(0);
        var cell2 = row3.insertCell(1);
        cell1.innerHTML = "Comp. Flange Width";
        cell2.innerHTML = "<input id='bfComp' class = 'form-control input-sm'></input>";
        var row4 = BUTable.insertRow(7);
        var cell1 = row4.insertCell(0);
        var cell2 = row4.insertCell(1);
        cell1.innerHTML = "Comp. Flange Thickness";
        cell2.innerHTML = "<input id='tfComp' class = 'form-control input-sm'></input>";
        var row5 = BUTable.insertRow(8);
        var cell1 = row5.insertCell(0);
        var cell2 = row5.insertCell(1);
        cell1.innerHTML = "Tens. Flange Width";
        cell2.innerHTML = "<input id='bfTens' class = 'form-control input-sm'></input>";
        var row6 = BUTable.insertRow(9);
        var cell1 = row6.insertCell(0);
        var cell2 = row6.insertCell(1);
        cell1.innerHTML = "Tens. Flange Thickness";
        cell2.innerHTML = "<input id='tfTens' class = 'form-control input-sm'></input>";
    } 
});
    
 $('#runFunc').on("click", start);

    });


    
function getSlenderness(beam)
{
    const E = 29000.;
    let lambdap_web;
    let lambdar_web;
    let lambdap_flange;
    let lambdar_flange;
    var Mp = beam.Z * beam.Fy;
    var My = Math.min(beam.Sxc, beam.Sxt)*beam.Fy;
    My = Math.min(My, Mp);
    var kc_temp = Math.min(0.76, 4/Math.sqrt(beam.htw));
    var kc = Math.max(kc_temp, 0.35);
    console.log("Mp: " + Mp);
    console.log("beam.htw " + beam.htw);

    //WEBS
    //if symmetric, case 15
    if (beam.isSymmetric)
    {
        lambdap_web = 3.76*Math.sqrt(E/beam.Fy);
        lambdar_web = 5.7*Math.sqrt(E/beam.Fy);
    }
    //if unsymmetric, case 16
    else
    {
        let num = (beam.hc/beam.hp)*Math.sqrt(E / beam.Fy);
        let denom = Math.pow(0.54*Mp/My-0.09, 2);        
        lambdar_web = 5.7*Math.sqrt(E/beam.Fy);
        lambdap_web = Math.min(num/denom, lambdar_web);
    }

    //FLANGES 
    //if built-up, Case 11
    if (beam.isBU)
    {
        var FL = 0;
        if ( (beam.htw > lambdar_web) || beam.Sxt/beam.Sxc <= 0.7)
        {
            FL = 0.7*beam.Fy;
        }     
        else
        {
            FL = beam.Fy*beam.Sxt/beam.Sxc;
            FL = Math.max(FL, 0.5*beam.Fy);
        }
        console.log("FL: " + FL);
        console.log("kc " + kc);
        lambdap_flange = 0.38 * Math.sqrt(E / beam.Fy);
        lambdar_flange = 0.95 * Math.sqrt(kc*E / FL);
    }
    //if not built up, Case 10
    else
    {
        lambdap_flange = 0.38 * Math.sqrt(E / beam.Fy);
        lambdar_flange =  Math.sqrt(E / beam.Fy);
    }


    //clasify slenderness
    if (beam.bf2tf <= lambdap_flange)
        flangeStatus = "compact";
    else if (beam.bf2tf > lambdap_flange && beam.bf2tf < lambdar_flange)
        flangeStatus = "non-compact";
    else
        flangeStatus = "slender";
    //web
    if (beam.htw <= lambdap_web)
        webStatus = "compact";
    else if (beam.htw > lambdap_web && beam.htw < lambdar_web)
        webStatus = "non-compact";
    else
        webStatus = "slender";
    beam.lambdap_flange = lambdap_flange;
    beam.lambdar_flange = lambdar_flange;
    beam.lambdap_web = lambdap_web;
    beam.lambdar_web = lambdar_web;
 
    console.log("lambdap " + beam.lambdap_flange);
    console.log("lambdar " + beam.lambdar_flange);
    var status =
    {
        flange: flangeStatus,
        web: webStatus,
        beam: beam
    }
    
    return status;
}

function getSlenderness_new(beam)
{
    console.log("old beam htw: " + beam.htw);
    console.log("new beam htw: " + beam.htw_new);
    const E = 29000.;
    let lambdap_web;
    let lambdar_web;
    let lambdap_flange;
    let lambdar_flange;
    var Mp = beam.Z * beam.Fy;
    var My = Math.min(beam.Sxc, beam.Sxt)*beam.Fy;
    My = Math.min(My, Mp);

    //FLANGES 
    //if built-up, Case 11
    var kc_temp = Math.min(0.76, 4/Math.sqrt(beam.htw));
    var kc = Math.max(kc_temp, 0.35);
    if (beam.isBU)
    {
        lambdap_flange = 0.38 * Math.sqrt(E / beam.Fy);
        lambdar_flange = 1.14 * Math.sqrt(kc*E / beam.Fy);
    }
    //if not built up, Case 10
    else
    {
        lambdap_flange = 0.38 * Math.sqrt(E / beam.Fy);
        lambdar_flange =  Math.sqrt(E / beam.Fy);
    }

    //WEBS
    //if symmetric, case 15
    if (beam.isSymmetric)
    {
        lambdap_web = 3.76*Math.sqrt(E/beam.Fy);
        var aw = beam.hc*beam.tw/(beam.bf_comp*beam.tf_comp);
        var crw = 3.1 + 5/aw;      
        lambdar_web = crw*Math.sqrt(E/beam.Fy);
    }
    //if unsymmetric, case 16
    else
    {
        let num = (beam.hcy/beam.hp)*Math.sqrt(E / beam.Fy);
        let denom = Math.pow(0.54*Mp/beam.Myc_dist-0.09, 2); 
        var aw = beam.hc*beam.tw/(beam.bf_comp*beam.tf_comp);
        var crw = 3.1 + 5/aw;      
        lambdar_web = crw*Math.sqrt(E/beam.Fy);
        lambdap_web = Math.min(num/denom, lambdar_web);
        console.log("THIS SHOULD BE LAMBDA P WEB " + lambdap_web);
    }

    //Sec F13 check
    var limit = Math.max(18,  1.2*lambdar_flange)
   
    if (beam.bf2tf > limit)
    {
        var footnote= document.getElementById('footnote');
        var tag = document.createElement("h2");
        var text = document.createTextNode("NOTE: Flange slenderness exceeds limits in Section F13 of the proposal.");
        tag.appendChild(text);
        footnote.appendChild(tag);
    }

    if (beam.bf2tf <= lambdap_flange)
        flangeStatus = "compact";
    else if (beam.bf2tf > lambdap_flange && beam.bf2tf < lambdar_flange)
        flangeStatus = "non-compact";
    else
        flangeStatus = "slender";

    //web
    if (beam.isSymmetric)
    {
         if (beam.htw <= lambdap_web)
            webStatus = "compact";
        else if (beam.htw > lambdap_web && beam.htw < lambdar_web)
            webStatus = "non-compact";
        else
            webStatus = "slender";
    }
    else
    {
        if (beam.htw_new <= lambdap_web)
            webStatus = "compact";
        else if (beam.htw_new > lambdap_web && beam.htw_new < lambdar_web)
            webStatus = "non-compact";
        else
            webStatus = "slender";

    }
 
    
    beam.lambdap_flange_new = lambdap_flange;
    beam.lambdar_flange_new = lambdar_flange;
    beam.lambdap_web_new = lambdap_web;
    beam.lambdar_web_new = lambdar_web;
   
    var status =
    {
        flange_new: flangeStatus,
        web_new: webStatus,
        beam: beam
    }
    console.log("testing beam status, lambda_r flange " + status.beam.lambdar_flange);
    return status;
}

function phiMn_LTB(L, beam, getLs)
{
    var Cb = 1;
    var E = 29000.;
    var Mp = beam.Z * beam.Fy;
    var rts = 0;
    var h0 = 0;
    var Lr = 0.;
    var Lp = (1. / 12) * 1.76 * beam.ry * Math.sqrt(E / beam.Fy);
    if (!beam.isBU)
    {
        rts = Math.sqrt(Math.sqrt(beam.Iy*beam.Cw)/beam.Sx);
        //rts = beam.bf_comp/(Math.sqrt(12*(1+h*beam.tw/(6*beam.bf_comp*beam.tf_comp))));
        h0 = beam.d - beam.tf;
        var d = beam.J / (beam.Sx * h0);
        var g = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((0.7 * beam.Fy / E), 2));
        Lr = (1. / 12) * 1.95 * rts * (E / (0.7 * beam.Fy)) * Math.sqrt(d + g);
    }
    if (beam.isBU)
    {
        var h = beam.d - beam.tf_comp - beam.tf_tens;
        console.log("h is " + h);
        rts = beam.bf_comp/(Math.sqrt(12*(1+h*beam.tw/(6*beam.bf_comp*beam.tf_comp))));
        var J = (1/3)*(beam.bf_comp*Math.pow(beam.tf_comp, 3) + beam.bf_tens*Math.pow(beam.tf_tens, 3) + h*Math.pow(beam.tw, 3));
        beam.J = J; 
        h0 = beam.d - 0.5*beam.tf_comp - 0.5*beam.tf_tens;
        var d = beam.J / (beam.Sxc * h0);
        var g = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((0.7 * beam.Fy / E), 2));
        Lr = (1. / 12) * 1.95 * rts * (E / (0.7 * beam.Fy)) * Math.sqrt(d + g);
        console.log("J is " + J);
    }        
	
//calc Mn_LTB
    if(L < Lp)
        {
            MnLTB = "N/A (L < Lp)";
        }
    else if(L > Lp && L < Lr)
        {
            MnLTB = Cb * (Mp - (Mp - 0.7 * beam.Fy * beam.Sxc) * (L - Lp) / (Lr - Lp));
            MnLTB = Math.round(0.9*Math.min(MnLTB, Mp)/12);
            MnLTB = MnLTB + " (inelastic, Sec. F3)";
        }
	else 
		{
			var Fcr = (Cb*E*3.14159*3.14159/(Math.pow(L*12/rts, 2)))*Math.sqrt(1+0.078*(beam.J/(beam.Sxc*h0))*Math.pow(L*12/rts, 2));
			MnLTB = beam.Sxc*Fcr;
			MnLTB = Math.round(0.9*Math.min(MnLTB, Mp)/12);
            MnLTB = MnLTB + " (elastic, Sec. F3)";
		}

    Lr = Math.round(Lr*10)/10;
    Lp = Math.round(Lp*10)/10;

    if (getLs)
    {
        var lengths = {
            Lp: Lp,
            Lr: Lr
        }
        return lengths;
    }
    else
    {    
        return MnLTB;
    }

}

function phiMn_FLB_2016(L, beam)
{
    var MnFLB = 0;
    var Cb = 1;
    var E = 29000.;
    var Mp = beam.Z * beam.Fy;
   
    let kc = 4/(Math.sqrt(beam.htw));
    if (kc < 0.35)
        kc = 0.35;
    else if (kc > 0.76)
        kc = 0.76


    if(beam.bf2tf > beam.lambdap_flange && beam.bf2tf < beam.lambdar_flange)
    {
        MnFLB = Mp - (Mp - 0.7 * beam.Fy * beam.Sx) * (beam.bf2tf - beam.lambdap_flange) / (beam.lambdar_flange - beam.lambdap_flange);        
        MnFLB = Math.round(0.9*MnFLB/12);
        MnFLB = MnFLB + " (Sec F3)";
        console.log("MnFLB" + MnFLB);
    }
    else if(beam.bf2tf >= beam.lambdar_flange)
    {
        MnFLB = 0.9*E*beam.Sx*kc/Math.pow(beam.bf2tf,2);
        MnFLB = Math.round(0.9*MnFLB/12);
        MnFLB = MnFLB + " (Sec F3)";
    }

    return MnFLB;
}

function phiMn_FLB_new(L, beam)
{
    var MnFLB = 0;
    var Cb = 1;
    var E = 29000.;
    var Mp = beam.Z * beam.Fy;
    let kc = 4/(Math.sqrt(beam.htw));
    if (kc < 0.35)
        kc = 0.35;
    else if (kc > 0.76)
        kc = 0.76

    if(beam.bf2tf > beam.lambdap_flange_new && beam.bf2tf < beam.lambdar_flange_new)
    {
        MnFLB = Mp - (Mp - 0.75 * beam.Fy * beam.Sx) * (beam.bf2tf - beam.lambdap_flange_new) / (beam.lambdar_flange_new - beam.lambdap_flange_new);        
        MnFLB = Math.round(0.9*MnFLB/12);
    }
    else if(beam.bf2tf > beam.lambdar_flange_new)
    {
        MnFLB = 0.9*E*beam.Sx*kc/Math.pow(beam.bf2tf,2);
        MnFLB = Math.round(0.9*MnFLB/12);
        MnFLB = MnFLB;
    }
    MnFLB = MnFLB + " (Sec F3)";
    
    return MnFLB;
}

function start() 
{
    var L=parseInt($('#flexL').val());
    var Fy=parseInt($('#Fy').val());
    var E = 29000;
    var beamSize= $('#beamSize').val();
    var status;
    var status_new;
    if (beamSize === "BU")
    {
        beam = 
        {
            Fy: Fy,
            d: parseFloat($('#depth').val()),
            tw: parseFloat($('#tw').val()),
            tf_comp: parseFloat($('#tfComp').val()),
            bf_comp: parseFloat($('#bfComp').val()),
            tf_tens: parseFloat($('#tfTens').val()),
            bf_tens: parseFloat($('#bfTens').val()),            
            isBU: true,
            isSymmetric: false           
        }
    
        if (beam.tf_comp === beam.tf_tens && beam.bf_comp === beam.bf_tens)
            beam.isSymmetric= true
        beam.bf2tf= beam.bf_comp/(2*beam.tf_comp);
        beam.htw= (beam.d-beam.tf_comp-beam.tf_tens)/beam.tw;
        if (beam.htw > 12*Math.sqrt(E/Fy) || beam.htw > 0.4*E/Fy)
        {
            var footnote= document.getElementById('footnote');
            var tag = document.createElement("h2");
            var text = document.createTextNode("NOTE: Web slenderness may exceed limits in Sec F13 of the proposal, depending on transverse stiffener spacing. See Sec. F13");

            tag.appendChild(text);
            footnote.appendChild(tag);
         }
    
        beam = getBUprops(beam);
        status = getSlenderness(beam);
        beam = status.beam;
        status_new = getSlenderness_new(beam);
        beam = status_new.beam;
        
    }
    else
    {
        for (var i = 0; i < Wshapes.length; i++) 
        {
            if (beamSize === Wshapes[i].Size) 
            {
                var My = Fy*parseFloat(Wshapes[i].Sx);
                beam = {
                    Fy: Fy,
                    My: My,
                    tw: parseFloat(Wshapes[i].tw),
                    bf: parseFloat(Wshapes[i].bf),
                    tf: parseFloat(Wshapes[i].tf),
                    d: parseFloat(Wshapes[i].d),
                    bf2tf: parseFloat(Wshapes[i].bf2tf),
                    htw: parseFloat(Wshapes[i].htw),
                    Z: parseFloat(Wshapes[i].Zx),
                    ry: parseFloat(Wshapes[i].ry),
                    Iy: parseFloat(Wshapes[i].Iy),
                    Cw: parseFloat(Wshapes[i].Cw),
                    J: parseFloat(Wshapes[i].J),
                    Sx: parseFloat(Wshapes[i].Sx),
                    Sxc: parseFloat(Wshapes[i].Sx),
                    Sxt: parseFloat(Wshapes[i].Sx),
                    isBU: false,
                    isSymmetric: true
                }
            }
        }
        status = getSlenderness(beam);
        console.log("bf2tf " + beam.bf2tf)
        beam = status.beam;
        status_new = getSlenderness_new(beam);
        beam = status_new.beam;
    }
    
    var limitStates = 
    {
        LTB: "N/A",
        LTB_new: "N/A",
        FLB_2016: "N/A",
        FLB_new: "N/A",
        phiMP: Math.round(0.9*beam.Z*beam.Fy/12),
        phiMP_new: Math.round(0.9*beam.Z*beam.Fy/12),
        CFY: "N/A",
        CFY_new: "N/A",
        TFY: "N/A"
    }

    var intermedVals =
    {
        Sxc: "",
        Sxc_new: "",
        Sxt: "",
        Sxt_new: "",
        Lp: "",
        Lp_new: "",
        Lr: "",
        Lr_new: "",
        hc: "",
        hcy: "",
        My: "",
        Myc: ""
    }
    //************************
    //**********2016**********
    //************************
 
    //Section F2 and F3
    if (beam.isSymmetric && status.flange === 'compact' && status.web === 'compact')
    {
        limitStates.LTB= phiMn_LTB(L, beam, false);
        var lens = phiMn_LTB(L, beam, true);
        intermedVals.Lp = lens.Lp;
        intermedVals.Lr = lens.Lr;
    }


    else if (beam.isSymmetric && status.web === 'compact' && (status.flange === 'non-compact' || status.flange === 'slender'))
    {
        limitStates.LTB= phiMn_LTB(L, beam, false);
        limitStates.LTB= phiMn_LTB(L, beam, false);
        var lens = phiMn_LTB(L, beam, true);
        intermedVals.Lp = lens.Lp;
        intermedVals.Lr = lens.Lr;
        limitStates.FLB_2016 = phiMn_FLB_2016(L, beam);
    }
    //Section F4 - NO ROLLED SHAPES FALL IN THIS SECTION BECAUSE ALL WEBS ARE COMPACT
    else if ( (beam.isSymmetric && status.web === 'non-compact') || (!beam.isSymmetric && status.web != 'slender') )
    {
        //TODO: take out all these Ls if unnecessary
        console.log("Section F4 applies");
        limitStates.CFY = phiMn_CFY_F4(L, beam);
        limitStates.LTB = phiMn_LTB_F4(L, beam, false);
        var lens = phiMn_LTB_F4(L, beam, true);
        intermedVals.Lp = lens.Lp;
        intermedVals.Lr = lens.Lr;
        limitStates.FLB_2016 = phiMn_FLB_F4(L, beam);
        limitStates.TFY = phiMn_TFY(L, beam);
        console.log("CFY " + limitStates.CFY + "\nTFY: " + limitStates.TFY + "\nFLB: " + limitStates.FLB_2016);
    }
    //Section F5
    else if ( status.web === 'slender' )
    {
        //TODO: take out all these Ls if unnecessary
        console.log("Section F5 applies");
        limitStates.CFY = phiMn_CFY_F5(L, beam);  
        limitStates.LTB = phiMn_LTB_F5(L, beam, false);
        var lens = phiMn_LTB_F5(L, beam, true);
        intermedVals.Lp = lens.Lp;
        intermedVals.Lr = lens.Lr;
        limitStates.FLB_2016 = phiMn_FLB_F5(L, beam);
        limitStates.TFY = phiMn_TFY_F5(L, beam);
        console.log("CFY " + limitStates.CFY + "\nTFY: " + limitStates.TFY + "\nFLB: " + limitStates.FLB_2016);
    }


    //************************
    //**********Proposed**********
    //************************
    var limitExceeded = false;
    var limit = Math.max(18,  1.2*beam.lambdar_flange_new)
    if (beam.htw > 12*Math.sqrt(E/Fy) || beam.htw > 0.4*E/Fy)
    {
        limitStates.phiMP_new = "N/A";
        limitExceeded = true;
    }
    else if (beam.bf2tf > limit)
    {
        limitStates.phiMP_new = "N/A";
        limitExceeded = true;
    }
    //Section F2 and F3
    else if (beam.isSymmetric && status_new.flange_new === 'compact' && status_new.web_new === 'compact')
    {
        limitStates.LTB_new = limitStates.LTB;
        intermedVals.Lr_new =  intermedVals.Lr;
        intermedVals.Lp_new =  intermedVals.Lp;
    }
    else if (beam.isSymmetric && status_new.web_new === 'compact' && (status_new.flange_new === 'non-compact' || status_new.flange_new === 'slender'))
    {
        limitStates.LTB_new = limitStates.LTB;
        intermedVals.Lr_new =  intermedVals.Lr;
        intermedVals.Lp_new =  intermedVals.Lp;
        limitStates.FLB_new = phiMn_FLB_new(L, beam);
    }
    //Section F4 - NO ROLLED SHAPES FALL IN THIS SECTION BECAUSE ALL WEBS ARE COMPACT
    else if ( (beam.isSymmetric && status_new.web_new === 'non-compact') || (!beam.isSymmetric && status_new.web_new != 'slender') )
    {
        //TODO: take out all these Ls if unnecessary
        console.log("Section F4 applies");
        limitStates.CFY_new = phiMn_CFY_F4_new(L, beam);
        limitStates.LTB_new = phiMn_LTB_F4_new(L, beam, false);
        var lens = phiMn_LTB_F4_new(L, beam, true);
        intermedVals.Lp_new = lens.Lp;
        intermedVals.Lr_new = lens.Lr;
        limitStates.FLB_new = phiMn_FLB_F4_new(L, beam);
    }
    //Section F5
    else if ( status_new.web_new === 'slender' )
    {
        //TODO: take out all these Ls if unnecessary
        console.log("Section F5 applies");
        limitStates.CFY_new = phiMn_CFY_F5_new(L, beam);  
        limitStates.LTB_new = phiMn_LTB_F5_new(L, beam, false);
        var lens = phiMn_LTB_F5_new(L, beam, true);
        intermedVals.Lp_new = lens.Lp;
        intermedVals.Lr_new = lens.Lr;
        limitStates.FLB_new = phiMn_FLB_F5_new(L, beam);
    }

    showTable(status, status_new, limitStates, intermedVals, beam, limitExceeded);
}

function showTable(status, status_new, LS, IV, beam, limitExceeded)
{
    //round beam values
    var Sxc = Math.round(beam.Sxc*10)/10;
    var Sxt = Math.round(beam.Sxt*10)/10;
    var Sxc_new = Sxc;
    var Sxt_new = Sxt;
    var My = Math.round(beam.My*10)/10;
    var My_new = My;
    var Myc = "N/A";
    var Myc_new = "N/A";
    var hc = "N/A";
    var hc_new = "N/A";
    var hcy = "N/A";
    var hcy_new = "N/A";
    var htw_2016 = Math.round(beam.htw*100)/100;
    var htw_new = Math.round(beam.htw_new*100)/100;
    var lpFlange = Math.round(beam.lambdap_flange*100)/100;
    var lrFlange = Math.round(beam.lambdar_flange*100)/100;
    var lpFlangeNew = Math.round(beam.lambdap_flange_new*100)/100;
    var lrFlangeNew = Math.round(beam.lambdar_flange_new*100)/100;
    var lpWeb = Math.round(beam.lambdap_web*100)/100;
    var lrWeb = Math.round(beam.lambdar_web*100)/100;
    var lpWebNew = Math.round(beam.lambdap_web_new*100)/100;
    var lrWebNew = Math.round(beam.lambdar_web_new*100)/100;

    if (beam.isBU)
    {
        hc = Math.round(beam.hc*10)/10;
        hc_new = hc;
        hcy_new = Math.round(beam.hcy*10)/10;
        Myc_new = Math.round(beam.Myc_dist*10)/10;
    }

    if (limitExceeded)
    {
        Sxc_new = "N/A";
        Sxt_new = "N/A";
        My_new = "N/A";
        hcy_new = "N/A";
        hc_new = "N/A";
        Myc_new = "N/A";
        IV.Lp_new = "N/A";
        IV.Lr_new = "N/A";
    }
    
    //populate HTML  
    $('#flangeStatus').html(status.flange);
    $('#webStatus').html(status.web);
    $('#flangeStatus_new').html(status_new.flange_new);
    $('#webStatus_new').html(status_new.web_new);
    $('#yielding').html(LS.phiMP);
    $('#yielding_new').html(LS.phiMP_new);
    $('#LTB').html(LS.LTB);
    $('#LTB_new').html(LS.LTB_new);
    $('#FLB_2016').html(LS.FLB_2016);
    $('#FLB_new').html(LS.FLB_new);
    $('#CFY_2016').html(LS.CFY);
    $('#CFY_new').html(LS.CFY_new);
    $('#TFY_2016').html(LS.TFY);
    $('#TFY_new').html("N/A");

    $('#Lp').html(IV.Lp);
    $('#Lp_new').html(IV.Lp_new);
    $('#Lr').html(IV.Lr);
    $('#Lr_new').html(IV.Lr_new);

    $('#flange_lambda_p').html(lpFlange);
    $('#flange_lambda_p_new').html(lpFlangeNew);
    $('#flange_lambda_r').html(lrFlange);
    $('#flange_lambda_r_new').html(lrFlangeNew);
    $('#web_lambda_p').html(lpWeb);
    $('#web_lambda_p_new').html(lpWebNew);
    $('#web_lambda_r').html(lrWeb);
    $('#web_lambda_r_new').html(lrWebNew);
    $('#htw_2016').html(htw_2016);
    $('#htw_new').html(htw_new);

    $('#My').html(My);
    $('#My_new').html(My_new);
    $('#Myc').html(Myc);
    $('#Myc_new').html(Myc_new);
    $('#hc').html(hc);
    $('#hc_new').html(hc_new);
    $('#hcy').html(hcy);
    $('#hcy_new').html(hcy_new);
    $('#Sxc').html(Sxc);
    $('#Sxt').html(Sxt);
    $('#Sxc_new').html(Sxc_new);
    $('#Sxt_new').html(Sxt_new);

    //$('#runFunc').hide();
    //$('#startAgainBtn').show();

}

function getBUprops(beam)
{
    var compFlangeArea = beam.bf_comp*beam.tf_comp;
    var tensFlangeArea = beam.bf_tens*beam.tf_tens;
    var clear_h = beam.d-beam.tf_comp-beam.tf_tens;
    var webArea = clear_h*beam.tw;
    var area = compFlangeArea + tensFlangeArea + webArea;
    var NAfromCompFlange = (compFlangeArea*(0.5*beam.tf_comp) + tensFlangeArea*(beam.d-0.5*beam.tf_tens) + webArea*(beam.tf_comp + 0.5*clear_h))/area;
    var Ix_compFlange = (1/12)*beam.bf_comp*Math.pow(beam.tf_comp,3);
    var Ix_tensFlange = (1/12)*beam.bf_tens*Math.pow(beam.tf_tens,3);
    var Ix_web = (1/12)*beam.tw*Math.pow(clear_h, 3);
    var Ix = Ix_compFlange + compFlangeArea*Math.pow(NAfromCompFlange-0.5*beam.tf_comp, 2);
    Ix = Ix + Ix_tensFlange + tensFlangeArea*Math.pow(beam.d-0.5*beam.tf_tens-NAfromCompFlange, 2);
    Ix = Ix + Ix_web + webArea*Math.pow(beam.tf_comp+0.5*clear_h-NAfromCompFlange, 2);
    hc = 2*(NAfromCompFlange-beam.tf_comp);
    console.log("hc is " + hc);
    var Iy = (1/12)*beam.tf_comp*Math.pow(beam.bf_comp, 3);
    Iy = Iy + (1/12)*beam.tf_tens*Math.pow(beam.bf_tens, 3);
    Iy = Iy + (1/12)*(beam.d-beam.tf_comp-beam.tf_tens)*Math.pow(beam.tw, 3);
    var ry = Math.sqrt(Iy/area);
    Iyc = (1/12)*beam.tf_comp*Math.pow(beam.bf_comp, 3);
    console.log("Iyc " + Iyc);

    //plastic properties
    PNAlocation = "";
    if (compFlangeArea > area/2)
        PNAlocation = "CompFlange";
    else if (tensFlangeArea > area/2)
        PNAlocation = "TensFlange";
    else
        PNAlocation = "Web";
    
    var PNA = 0;
    var Zx = 0;
    if (PNAlocation === "CompFlange")
    {
        console.log("PNA is comp flange");
        PNA = 0.5*area/beam.bf_comp;
        Zx = 0.5*PNA*beam.bf_comp*PNA + 0.5*(beam.tf_comp-PNA)*beam.bf_comp*(PNA-beam.tf_comp);
        Zx = Zx + webArea*(beam.tf_comp+0.5*clear_h-PNA) + tensFlangeArea*(beam.d-0.5*beam.tf_tens-PNA);
    }
    else if (PNAlocation === "TensFlange")
    {
        console.log("PNA is comp flange");
        PNA = beam.d-(0.5*area/beam.bf_tens);
        Zx = compFlangeArea*(PNA-0.5*beam.tf_comp) + webArea*(PNA-beam.tf_comp-0.5*clear_h);
        Zx = Zx + (beam.d-PNA)*beam.bf_tens*0.5*(beam.d-PNA) + beam.bf_tens*0.5*Math.pow(PNA-beam.tf_comp - clear_h, 2);
    }
    else
    {
        PNA = beam.tf_comp+(0.5*area-beam.tf_comp*beam.bf_comp)/beam.tw;
        var webAbove = beam.tw*(PNA-beam.tf_comp);
        var webBelow = beam.tw*(beam.tf_comp+clear_h-PNA);
        Zx = compFlangeArea*(PNA-0.5*beam.tf_comp) + tensFlangeArea*(beam.d-0.5*beam.tf_tens-PNA);
        Zx = Zx + webAbove*0.5*(PNA-beam.tf_comp) + webBelow*0.5*(beam.tf_comp+clear_h-PNA);
    }

    var hp = Math.abs(2*(PNA-beam.tf_comp));
    console.log("hp is " + hp);
    var c_tens = beam.d - NAfromCompFlange;
    var Sxc = Ix/NAfromCompFlange;
    var Sxt = Ix/c_tens;
    var Myc = beam.Fy*Sxc;
    //var Zx = compFlangeArea*Math.abs(PNA-0.5*beam.tf_comp) + tensFlangeArea*Math.abs(beam.d-PNA-0.5*beam.tf_tens) + webArea*Math.abs(beam.tf_comp+0.5*clear_h-PNA);

    //new F4 calcs
    var Afc = beam.bf_comp*beam.tf_comp;
    var Aft = beam.bf_tens*beam.tf_tens;  
    var Awfc = 2*beam.tf_comp*beam.tw;
    var h = beam.d - beam.tf_comp - beam.tf_tens;
    var Aw = h*beam.tw;
    var Dp = (beam.area-2*Afc)/(2*beam.tw);
    var deltaA = Aft + Aw + Awfc - Afc;
    var sqrtTerm = Math.pow(deltaA, 2) + 2*Afc*Awfc - Math.pow(Awfc, 2);
    var dcy = ( deltaA + Math.sqrt(sqrtTerm) )/(4*beam.tw);
    var Dcy = dcy - beam.tf_comp;
    console.log("dcy " + dcy);
    var hcy = 2*Dcy;
    var term1 = (Afc/dcy)*(0.5*Dcy*beam.tf_comp + (1/3)*Math.pow(beam.tf_comp, 2));
    var term2 = Aft*(h + 0.5*beam.tf_tens);
    var term3 = (0.5*beam.tw)*(Math.pow(h, 2) - Math.pow(beam.tf_comp, 2) - (7/3)*Math.pow(dcy, 2) + 3*dcy*beam.tf_comp - (1/3)*Math.pow(Dcy, 3)/dcy);
    var Myc_comm = beam.Fy*(term1+term2+term3);
    var My = beam.Fy*Math.min(Sxc, Sxt);
    var htw_new = hcy/beam.tw;
    console.log("MYC COMM " + Myc_comm);

    var newBeam =
    {
        Fy: beam.Fy,
        bf_comp: beam.bf_comp,
        tf_comp: beam.tf_comp,
        bf_tens: beam.tf_tens,
        tf_tens: beam.tf_tens,
        tw: beam.tw,
        d: beam.d,
        h: h,
        isBU: beam.isBU,
        isSymmetric: beam.isSymmetric,
        Ix: Ix,
        area: area,
        hc: hc,
        hp: hp,
        Sxc: Sxc,
        Sxt: Sxt,
        Sx: Sxc,
        Z: Zx,
        bf2tf: beam.bf2tf,
        htw: beam.htw,
        J: 0, 
        ry: ry,
        Iyc: Iyc,
        Iy: Iy,
        Dcy: Dcy,
        dcy: dcy,
        hcy: hcy,
        Aft: Aft,
        Afc: Afc,
        Myc_dist: Myc_comm,
        Myc: Myc,
        My: My,
        htw_new: htw_new 
    }

    return newBeam;
}


function startOver() {
    location.reload();

}