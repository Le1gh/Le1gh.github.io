
$(document).ready(function() {
   
$('#startAgainBtn').on('click', startOver);
//event listener for BU shapes
$('#beamForm').one('change', function() {
    var type = $('#beamSize').val();  
    
    if (type === "BU") {
        
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
    if (beam.isSymmetric)
    {
        var Mp = beam.Z * beam.Fy;
        lambdap_flange = 0.38 * Math.sqrt(E / beam.Fy);
        lambdar_flange = Math.sqrt(E / beam.Fy);
        lambdap_web = 3.76*Math.sqrt(E/beam.Fy);
        lambdar_web = 5.7*Math.sqrt(E/beam.Fy);
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
    }
    beam.lambdap_flange = lambdap_flange;
    beam.lambdar_flange = lambdar_flange;
    beam.lambdap_web = lambdap_web;
    beam.lambdar_web = lambdar_web;
 
    var status =
    {
        flange: flangeStatus,
        web: webStatus,
        beam: beam
    }
     console.log("testing beam status, lambda_p flange " + status.beam.lambdap_flange);
    return status;
}

function getSlenderness_singlySymmetric(beam)
{
    const E = 29000.;
    let lambdap_flange;
    let lambdar_flange;
    let lambdap_web;
    let lambdar_web;
    if (!beam.isSymmetric)
    {
        var Mp = beam.Z * beam.Fy;
        var My = Math.min(beam.Sxc, beam.Sxt)*beam.Fy;
        var kc_temp = Math.max(0.76, 4/beam.htw);
        var kc = Math.min(kc_temp, 0.35);
        lambdap_flange = 0.38 * Math.sqrt(E / beam.Fy);
        lambdar_flange = 0.95 * Math.sqrt(kc*E / beam.Fy);
        let num = (beam.hc/beam.hp)*Math.sqrt(E / beam.Fy);
        let denom = Math.pow(0.54*Mp/My-0.09, 2);        
        lambdar_web = 5.7*Math.sqrt(E/beam.Fy);
        lambdap_web = Math.min(num/denom, lambdar_web);
        console.log("Flange lambdas: " + lambdap_flange + " and " + lambdar_flange);
        console.log("Web lambdas: " +lambdap_web + " and " + lambdar_web);
        console.log("Mp " + Mp);
        console.log("My " + Mp);
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
    }
    beam.lambdap_flange = lambdap_flange;
    beam.lambdar_flange = lambdar_flange;
    beam.lambdap_web = lambdap_web;
    beam.lambdar_web = lambdar_web;
    var status =
    {
        flange: flangeStatus,
        web: webStatus,
        beam: beam
    }
    console.log("testing beam status, lambda_p flange " + status.beam.lambdap_flange);
    return status;
}

function phiMn_LTB(L, beam)
{
    var Cb = 1;
    var E = 29000.;
    var Mp = beam.Z * beam.Fy;
    var rts = 0;
    var h0 = 0;
    var Lr = 0;
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
            console.log("Cb " + Cb);
            console.log("Mp " + Mp);
            console.log("Sxc " + beam.Sxc);
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
    console.log("LTB " + MnLTB);
    console.log("Lp" + Lp);
    console.log("Lr" + Lr);
    return MnLTB;
    //address noncompact and slender flanges (webs are always compact)

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
    }
    else if(beam.bf2tf > beam.lambdar_flange)
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
   
    MnFLB = Mp - (Mp - 0.75 * beam.Fy * beam.Sx) * (beam.bf2tf - beam.lambdap_flange) / (beam.lambdar_flange - beam.lambdap_flange);        
    MnFLB = Math.round(0.9*MnFLB/12);
    MnFLB = MnFLB + " (Sec F3)";
    
    return MnFLB;
}

function start() 
{
    var L=parseInt($('#flexL').val());
    var Fy=parseInt($('#Fy').val());
    var beamSize= $('#beamSize').val();
    if (beamSize === "BU")
    {
        beam = {
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
        beam = getBUprops(beam);
        if (beam.isSymmetric)
        {
            var status = getSlenderness(beam);
            beam = status.beam;
        }
        else
        {
            var status = getSlenderness_singlySymmetric(beam);
            beam = status.beam;
        }
    }
    else
    {
        for (var i = 0; i < Wshapes.length; i++) 
        {
            if (beamSize === Wshapes[i].Size) 
            {
                beam = {
                    Fy: Fy,
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
        var status = getSlenderness(beam);
  
    }
    
    var limitStates = 
    {
        LTB: "N/A",
        LTB_new: "N/A",
        FLB_2016: "N/A",
        FLB_new: "N/A",
        phiMP: 0.9*beam.Z*beam.Fy/12,
        CFY: "N/A",
        CFY_new: "N/A",
        TFY: "N/A"
    }
    //Section F2 and F3
    if (beam.isSymmetric && status.flange === 'compact' && status.web === 'compact')
    {
        limitStates.LTB= phiMn_LTB(L, beam);
    }
    else if (beam.isSymmetric && status.web === 'compact' && (status.flange === 'non-compact' || status.flange === 'slender'))
    {
        limitStates.LTB= phiMn_LTB(L, beam, '2016');
        limitStates.LTB_new = limitStates.LTB;
        limitStates.FLB_2016 = phiMn_FLB_2016(L, beam);
        limitStates.FLB_new = phiMn_FLB_new(L, beam);
    }
    //Section F4 - NO ROLLED SHAPES FALL IN THIS SECTION BECAUSE ALL WEBS ARE COMPACT
    else if ( (beam.isSymmetric && status.web === 'non-compact') || (!beam.isSymmetric && status.web != 'slender') )
    {
        //TODO: take out all these Ls if unnecessary
        console.log("Section F4 applies");
        limitStates.CFY = phiMn_CFY_F4(L, beam);
        limitStates.CFY_new = limitStates.CFY;
        limitStates.LTB = phiMn_LTB_F4(L, beam, '2016');
        limitStates.LTB_new = phiMn_LTB_F4(L, beam, 'new');
        limitStates.FLB_2016 = phiMn_FLB_F4(L, beam, '2016');
        limitStates.FLB_new = phiMn_FLB_F4(L, beam, 'new');
        limitStates.TFY = phiMn_TFY(L, beam);
        console.log("CFY " + limitStates.CFY + "\nTFY: " + limitStates.TFY + "\nFLB: " + limitStates.FLB_2016);
        limitStates.phiMP = "N/A";
    }
    //Section F5
    else if ( status.web === 'slender' )
    {
        //TODO: take out all these Ls if unnecessary
        console.log("Section F5 applies");
        limitStates.CFY = phiMn_CFY_F5(L, beam, '2016');  
        limitStates.CFY_new = phiMn_CFY_F5(L, beam, 'new');  
        limitStates.LTB = phiMn_LTB_F5(L, beam, '2016');
        limitStates.LTB_new = phiMn_LTB_F5(L, beam, 'new');
        limitStates.FLB_2016 = phiMn_FLB_F5(L, beam);
        limitStates.TFY = phiMn_TFY_F5(L, beam);
        console.log("CFY " + limitStates.CFY + "\nTFY: " + limitStates.TFY + "\nFLB: " + limitStates.FLB_2016);
        limitStates.phiMP = "N/A";
    }
    console.log("CFY " + limitStates.CFY);
    showTable(status, limitStates);
}

function showTable(status, LS)
{
    $('#flangeStatus').html(status.flange);
    $('#webStatus').html(status.web);
    $('.yielding').html(LS.phiMP);
    $('#LTB').html(LS.LTB);
    $('#LTB_new').html(LS.LTB_new);
    $('#FLB_2016').html(LS.FLB_2016);
    $('#FLB_new').html(LS.FLB_new);
    $('#CFY_2016').html(LS.CFY);
    $('#CFY_new').html(LS.CFY_new);
    $('#TFY_2016').html(LS.TFY);
    $('#TFY_new').html("N/A");

    $('#runFunc').hide();
    $('#startAgainBtn').show();

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
    console.log("web thickness " + beam.tw);
    console.log("NAfrom Comp " + NAfromCompFlange);
    console.log("PNA " + PNA);
    console.log("area is " + area);
    console.log("Ix: " + Ix);
    console.log("Iy: " + Iy);

    var hp = Math.abs(2*(PNA-beam.tf_comp));
    var c_tens = beam.d - NAfromCompFlange;
    var Sxc = Ix/NAfromCompFlange;
    var Sxt = Ix/c_tens;
    //var Zx = compFlangeArea*Math.abs(PNA-0.5*beam.tf_comp) + tensFlangeArea*Math.abs(beam.d-PNA-0.5*beam.tf_tens) + webArea*Math.abs(beam.tf_comp+0.5*clear_h-PNA);

    var newBeam =
    {
        Fy: beam.Fy,
        bf_comp: beam.bf_comp,
        tf_comp: beam.tf_comp,
        bf_tens: beam.tf_tens,
        tf_tens: beam.tf_tens,
        tw: beam.tw,
        d: beam.d,
        isBU: beam.isBU,
        isSymmetric: beam.isSymmetric,
        Ix: Ix,
        Area: area,
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
        Iyc: Iyc
    }
    console.log("Z " + newBeam.Z);
    console.log("ry " + ry);
    console.log("Ix again: " + newBeam.Ix);
    console.log("hp " + newBeam.hp);
    console.log("Sxc " + Sxc);
    console.log("Sxt " + Sxt);
    return newBeam;
}


function startOver() {
    location.reload();

}