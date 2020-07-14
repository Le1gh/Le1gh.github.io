function phiMn_LTB_F5_new(L, beam, getLs)
{
    //assuming this applies only to BU
    var Cb = 1;
    var E = 29000.;

    var MnLTB_new;
    var res = getF5Vals_new(beam);
    var Fcr = 0;

    var Lp = (1. / 12) * 1.1 * res.rt * Math.sqrt(E / beam.Fy);
    var Lr_new = (1. / 12) * Math.PI * res.rt * Math.sqrt(E/(0.7*beam.Myc_dist/beam.Sxc));

    if (L > Lp && L <= Lr_new)
    {
        console.log("INELASTIC VALS TO CHECK " + beam.Sxc + " " + res.Rpg + " " + res.rt);
        MnLTB_new = Cb*(res.Rpg*beam.Myc_dist - (res.Rpg*beam.Myc_dist - 0.7*res.Rpg*beam.Myc_dist)*(L - Lp)/(Lr_new - Lp));
        MnLTB_new = Math.min(MnLTB_new, res.Rpg*beam.Myc_dist);
        MnLTB_new = Math.round(0.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (inelastic, Sec. F5)";
    }
    else if (L > Lr_new)
    {
        console.log("VALS TO CHECK " + beam.Sxc + " " + res.Rpg + " " + res.rt);
        MnLTB_new = Cb*E*3.14159*3.14159*beam.Sxc*res.Rpg/(Math.pow(L*12/res.rt, 2));
        MnLTB_new = Math.min(MnLTB_new, res.Rpg*beam.Myc_dist);
        MnLTB_new = Math.round(.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (elastic, Sec. F5)";
    }
        

    console.log("Lr is " + Lr);
    Lr = Math.round(Lr*10)/10;
    console.log("Lr is " + Lr);
    console.log("Lp is " + Lp);
    Lp = Math.round(Lp*10)/10;
    console.log("Lp is " + Lp);
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
        return MnLTB_new;
    }
}

function phiMn_FLB_F5_new(L, beam)
{
    var Mn_FLB_F5_new = "N/A";
    var Fcr = 0;
    var res = getF5Vals_new(beam);

    Mn_FLB_F5_new = res.Rpg*beam.Myc_dist - 0.25*res.Rpg*beam.Myc_dist*(beam.bf2tf - beam.lambdap_flange_new)/(beam.lambdar_flange_new - beam.lambdap_flange_new);
    Mn_FLB_F5_new = (0.9/12)* Mn_FLB_F5_new;
    Mn_FLB_F5_new = Math.round(Mn_FLB_F5_new);
    Mn_FLB_F5_new = Mn_FLB_F5_new + " (Sec F5)";

    return Mn_FLB_F5_new;
}

function phiMn_CFY_F5_new(L, beam)
{
    var res = getF5Vals_new(beam);
    var phiMn_compFlangeYielding = Math.round(0.9*res.Rpg*beam.Myc_dist/12);
    phiMn_compFlangeYielding  = phiMn_compFlangeYielding + " (Sec F5)";

    return phiMn_compFlangeYielding;
}

function getF5Vals_new(beam) 
{
 
    var E = 29000;
    var Sx = Math.min(beam.Sxt, beam.Sxc);
    var Mp = beam.Fy*Math.min(beam.Z, 1.6*Sx);
    
    var aw_new = beam.hcy*beam.tw/(beam.bf_comp*beam.tf_comp);
    var crw_new = 3.1 + 5/aw_new;
    crw_new = Math.min(crw_new, 4.6);
    crw_new = Math.max(crw_new, 5.7);
    var secTerm_new = beam.hcy/beam.tw - crw_new*Math.sqrt(E/beam.Fy);
    var firstTerm_new = aw_new/(1200+300*aw_new);

     var rt = beam.bf_comp/Math.sqrt(12*(1+aw_new/6));
    var Rpg = 1-firstTerm_new*secTerm_new; 
    Rpg = Math.min(1, Rpg);

    var result =
    {
        rt: rt,
        Rpg: Rpg
    }
    return result;
}
