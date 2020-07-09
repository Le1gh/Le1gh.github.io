function phiMn_LTB_F5(L, beam, version)
{
    //assuming this applies only to BU
    var Cb = 1;
    var E = 29000.;

    var MnLTB;
    var MnLTB_new;
    var res = getF5Vals(beam);
    var Fcr = 0;

    var Lp = (1. / 12) * 1.1 * res.rt * Math.sqrt(E / beam.Fy);
    var Lr = (1. / 12) * Math.PI * res.rt * Math.sqrt(E/(0.7*beam.Fy));
    
    if(L < Lp)
        {
            MnLTB = "N/A";
        }
    else if(L > Lp && L < Lr)
        {
            Fcr = Cb * (beam.Fy - (0.3*beam.Fy)*(L - Lp)/(Lr - Lp));
            Fcr = Math.min(Fcr, beam.Fy);
            MnLTB = res.Rpg*Fcr*beam.Sxc;
            MnLTB = Math.round(0.9*MnLTB/12);
            MnLTB = MnLTB + " (inelastic, Sec. F5)";

        }
    else 
        {
            Fcr = Cb*E*3.14159*3.14159/(Math.pow(L*12/res.rt, 2));
            Fcr = Math.min(Fcr, beam.Fy);
            MnLTB = res.Rpg*Fcr*beam.Sxc;
            MnLTB = Math.round(.9*MnLTB/12);
            MnLTB = MnLTB + " (elastic, Sec. F5)";

        }

        return MnLTB;   
}

function phiMn_CFY_F5(L, beam)
{
    var res = getF5Vals(beam);
    console.log("Rpg for CFY_F5 " + res.Rpg);
    console.log("Sxc for CFY_F5 " + beam.Sxc);
    console.log("Rpg " + res.Rpg);
    var phiMn_compFlangeYielding = Math.round(0.9*res.Rpg*beam.Fy*beam.Sxc/12);
    phiMn_compFlangeYielding  = phiMn_compFlangeYielding + " (Sec F5)";

    return phiMn_compFlangeYielding;
}


function phiMn_FLB_F5(L, beam)
{
    var Mn_FLB_F5 = "N/A";
    var Fcr = 0;
    var res = getF5Vals(beam);
    let kc = 4/(Math.sqrt(beam.htw));
   
    if (kc < 0.35)
        kc = 0.35;
    else if (kc > 0.76)
        kc = 0.76
    if (beam.bf2tf < beam.lambdar_flange && beam.bf2tf > beam.lambdap_flange)
    {
        console.log("inside Comp FLB check with NC flanges in F5");
        Fcr = beam.Fy - (0.3*beam.Fy)*(beam.bf2tf - beam.lambdap_flange)/(beam.lambdar_flange - beam.lambdap_flange);
        Mn_FLB_F5 = Math.round((0.9/12)*Fcr*res.Rpg*beam.Sxc);
        Mn_FLB_F5 = Mn_FLB_F5 + " (Sec F5)";
    }  
    else if (beam.bf2tf > beam.lambdar_flange)
    {
        console.log("inside Comp FLB check with slender flanges in F5");
        Fcr = (0.9/12)*0.9*E*kc/Math.pow(beam.bf2tf,2);
        Mn_FLB_F5 = Math.round((0.9/12)*Fcr*res.Rpg*beam.Sxc);
        Mn_FLB_F5 = Mn_FLB_F5 + " (Sec F5)";
    }
        return Mn_FLB_F5;
}

function phiMn_TFY_F5(L, beam)
{
    var Mn_TFY = "N/A";

    //calc limit state
    if (beam.Sxt >= beam.Sxc)
    {
        Mn_TFY = "N/A";
    }
    else
    {
        Mn_TFY = Math.round(0.9*beam.Fy*beam.Sxt/12);
        Mn_TFY = Mn_TFY + " (Sec F5)";
    }
    return Mn_TFY;
}

function getF5Vals(beam) 
{
    var E = 29000;
    var aw = beam.hc*beam.tw/(beam.bf_comp*beam.tf_comp);
    var crw = 3.1 + 5/aw;
    crw = Math.min(crw, 4.6);
    crw = Math.max(crw, 5.7);
    var rt = beam.bf_comp/Math.sqrt(12*(1+aw/6));
 
    var E = 29000;
    var Sx = Math.min(beam.Sxt, beam.Sxc);
    
   var term2 = (beam.hc/beam.tw) - 5.7*Math.sqrt(E/beam.Fy);
   var Rpg = 1-(aw/(1200+300*aw))*term2;
   Rpg = Math.min(Rpg, 1);

    var result =
    {
        rt: rt,
        Rpg: Rpg
    }
    return result;
}
