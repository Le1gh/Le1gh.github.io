function phiMn_LTB_F5(L, beam, version)
{
    //assuming this applies only to BU
    var Cb = 1;
    var E = 29000.;

    var MnLTB;
    var MnLTB_new;
    var res = getF5Vals(beam);
    var Fcr = 0;
    var Myc = beam.Fy*beam.Sxc;

    var Lp = (1. / 12) * 1.1 * res.rt * Math.sqrt(E / beam.Fy);
    var Lr = (1. / 12) * Math.PI * res.rt * Math.sqrt(E/(0.7*beam.Fy));
    var Lr_new = (1. / 12) * Math.PI * res.rt * Math.sqrt(E/(0.7*Myc/beam.Sxc));
    
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

    if (L > Lp && L < Lr_new)
    {
        MnLTB_new = Cb*(res.Rpg_new*Myc - (res.Rpg_new*Myc - 0.7*res.Rpg_new*My)*(L - Lp)/(Lr_new - Lp));
        MnLTB_new = Math.min(MnLTB_new, res.Rpg_new*Myc);
        MnLTB_new = Math.round(0.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (inelastic, Sec. F5)";
    }
    else
    {
        MnLTB_new = Cb*E*3.14159*3.14159*beam.Sxc*res.Rpg_new/(Math.pow(L*12/res.rt, 2));
        MnLTB_new = Math.min(MnLTB_new, res.Rpg_new*Myc);
        MnLTB_new = Math.round(.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (elastic, Sec. F5)";
    }

    console.log("MnLTB F5 is " + MnLTB);
    console.log("Lp " + Lp);
    console.log("Lr " + Lr);
    if (version === 'new')
        return MnLTB_new;
    else
        return MnLTB;   
}

function phiMn_CFY_F5(L, beam, version)
{
    var res = getF5Vals(beam);
    console.log("Rpg " + res.Rpg);
    var phiMn_compFlangeYielding = Math.round(0.9*res.Rpg*beam.Fy*beam.Sxc/12);
    phiMn_compFlangeYielding  = phiMn_compFlangeYielding + " (Sec F5)";

    var phiMn_compFlangeYielding_new = Math.round(0.9*res.Rpg_new*beam.Fy*beam.Sxc/12);
    phiMn_compFlangeYielding_new  = phiMn_compFlangeYielding_new + " (Sec F5)";
    console.log("CFY is " + phiMn_compFlangeYielding);
    if (version === 'new')
        return phiMn_compFlangeYielding_new;
    else
        return phiMn_compFlangeYielding;
}


function phiMn_FLB_F5(L, beam, version)
{
    var Mn_FLB_F5 = "N/A";
    var Mn_FLB_F5_new = "N/A";
    var Fcr = 0;
    var res = getF5Vals(beam);
    let kc = 4/(Math.sqrt(beam.htw));
    var Myc = beam.Fy*beam.Sxc;
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

    Mn_FLB_F5_new = res.Rpg_new*Myc - 0.25*res.Rpg_new*Myc*(beam.bf2tf - beam.lambdap_flange)/(beam.lambdar_flange - beam.lambdap_flange);
    Mn_FLB_F5_new = (0.9/12)* Mn_FLB_F5_new;
    Mn_FLB_F5_new = Mn_FLB_F5_new + " (Sec F5)";

    if (version === 'new')
        return Mn_FLB_F5_new;
    else
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
    var aw = beam.hc*beam.tw/(beam.bf_comp*beam.tf_comp);
    var crw = 3.1 + 5/aw;
    crw = Math.min(crw, 4.6);
    crw = Math.max(crw, 5.7);
    var rt = beam.bf_comp/Math.sqrt(12*(1+aw/6));
    var Rpc = 1;
    var E = 29000;
    var Myc = beam.Fy*beam.Sxc;
    var Sx = Math.min(beam.Sxt, beam.Sxc);
    var Mp = beam.Fy*Math.min(beam.Z, 1.6*Sx);
    var Rpg = 0;

    //calc Rpc
    if (beam.Iyc/beam.Iy > 0.23)
    {
        if  (beam.hc/beam.tw <= beam.lambdap_web)
            Rpc = Mp/Myc;
        else
        {
            var Mratio = Mp/Myc;
            var lambda = beam.hc/beam.tw;
            var Rpc_temp = Mratio - (Mratio-1)*( (lambda - beam.lambdap_web)/(beam.lambdar_web - beam.lambdap_web) );
            Rpc = Math.max(Mratio, Rpc_temp);
        }
    }
    console.log("Rpc = " + Rpc);

    //calc RPG
    var firstTerm = aw/(1200+300*aw);
    var secTerm = beam.hc/beam.tw - 5.7*Math.sqrt(E/beam.Fy);
    Rpg = 1 - firstTerm*secTerm;
    Rpg = Math.min(Rpg, 1);

    //calc Rpg new
    var secTerm_new = beam.hc/beam.tw - crw*Math.sqrt(E/beam.Fy);
    var Rpg_new = 1-firstTerm*secTerm_new; 
    
    var result =
    {
        Rpc: Rpc,
        Myc: Myc,
        rt: rt,
        Rpg: Rpg, 
        Rpg_new: Rpg_new
    }
    return result;
}
