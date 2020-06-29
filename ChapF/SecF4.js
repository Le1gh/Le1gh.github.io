function phiMn_LTB_F4(L, beam, version)
{
    //assuming this applies only to BU
    var Cb = 1;
    var E = 29000.;

	var MnLTB;
    var MnLTB_new;
    var h0 = 0;
    var Myc;
    var Lr = 0;
    var res = getF4Vals(beam);
    if (!beam.isBU)
    {
        h0 = beam.d - beam.tf;
        Myc = beam.Fy*beam.Sx;
    }
    if (beam.isBU)
    {
        var h = beam.d - beam.tf_comp - beam.tf_tens;
        var J = (1/3)*(beam.bf_comp*Math.pow(beam.tf_comp, 3) + beam.bf_tens*Math.pow(beam.tf_tens, 3) + h*Math.pow(beam.tw, 3));
        beam.J = J; 
        h0 = beam.d - 0.5*beam.tf_comp - 0.5*beam.tf_tens;   
    }
    var d = beam.J / (beam.Sxc * h0);
    var g = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((res.FL / E), 2));
    Lr = (1. / 12) * 1.95 * res.rt * (E / (res.FL)) * Math.sqrt(d + g);
    Myc = beam.Fy*beam.Sxc;
    var j = 0.7*Myc/beam.Sxc;
    var g_prime = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((j / E), 2));
    Lr_new = (1. / 12) * 1.95 * res.rt * (E / j) * Math.sqrt(d + g_prime);
    
    var Lp = (1. / 12) * 1.1 * res.rt * Math.sqrt(E / beam.Fy);
    
    if(L < Lp)
        {
            MnLTB = "N/A";
            MnLTB_new = "N/A";
        }
    else if(L > Lp && L < Lr)
        {
            MnLTB = Cb * (res.Rpc*Myc - (res.Rpc*Myc - res.FL * beam.Sxc) * (L - Lp) / (Lr - Lp));
            MnLTB = Math.round(0.9*Math.min(MnLTB, res.Rpc*Myc)/12);
            MnLTB = MnLTB + " (inelastic, Sec. F4)";

            MnLTB_new = Cb * (res.Rpc*Myc - (res.Rpc*Myc - 0.7*Myc) * (L - Lp) / (Lr - Lp));
            MnLTB_new = Math.round(0.9*Math.min(MnLTB_new, res.Rpc*Myc)/12);
            MnLTB_new = MnLTB_new + " (inelastic, Sec. F4)";
        }
	else 
		{
			var Fcr = (Cb*E*3.14159*3.14159/(Math.pow(L*12/res.rt, 2)))*Math.sqrt(1+0.078*(beam.J/(beam.Sxc*h0))*Math.pow(L*12/res.rt, 2));
			MnLTB = beam.Sxc*Fcr;
			MnLTB = Math.round(0.9*Math.min(MnLTB, res.Rpc*Myc)/12);
            MnLTB = MnLTB + " (elastic), Sec. F4";
            MnLTB_new = MnLTB;
		}

    if (L > Lp && L < Lr_new)
    {
        MnLTB_new = Cb*(res.Rpc*Myc - (res.Rpc*Myc - 0.7*Myc)*(L - Lp)/(Lr_new - Lp));
        MnLTB_new = Math.min(MnLTB_new, res.Rpc*Myc);
        MnLTB_new = Math.round(0.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (inelastic, Sec. F5)";
    }
    else
    {
        var term1 = Cb*E*3.14159*3.14159*beam.Sxc/(Math.pow(L*12/res.rt, 2));
        var term2 = Math.sqrt(1+0.078*(beam.J/(beam.Sxc*h0))*Math.pow(L*12/res.rt, 2));
         MnLTB_new = term1*term2;
        MnLTB_new = Math.min(MnLTB_new, res.Rpc*Myc);
        MnLTB_new = Math.round(.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (elastic, Sec. F5)";
    }

    console.log("MnLTB F4 is " + MnLTB);
    console.log("Lp " + Lp);
    console.log("Lr " + Lr);
    if (version === 'new')
        return MnLTB_new;
    else
        return MnLTB;   
}

function phiMn_CFY_F4(L, beam)
{
    var Myc = beam.Fy*beam.Sxc;
    var Mp = beam.Fy*beam.Z;
    var res = getF4Vals(beam);
    var phiMn_compFlangeYielding = Math.round(0.9*res.Rpc*Myc/12);
    phiMn_compFlangeYielding + " (Sec F4)";
    console.log("CFY is " + phiMn_compFlangeYielding);
    return phiMn_compFlangeYielding;    
    
}

function phiMn_FLB_F4(L, beam, version)
{
    var Mn_FLB_F4 = "N/A";
    var Mn_FLB_F4_new = "N/A";
    var res = getF4Vals(beam);
    let kc = 4/(Math.sqrt(beam.htw));
    if (kc < 0.35)
        kc = 0.35;
    else if (kc > 0.76)
        kc = 0.76
    if (beam.bf2tf < beam.lambdar_flange && beam.bf2tf > beam.lambdap_flange)
    {
        console.log("inside Comp FLB check with NC flanges");
        Mn_FLB_F4 = (0.9/12)*res.Rpc*res.Myc - (res.Rpc*res.Myc - res.FL*beam.Sxc)*(beam.bf2tf - beam.lambdap_flange)/(beam.lambdar_flange - beam.lambdap_flange);
        Mn_FLB_F4 = Math.round(Mn_FLB_F4);
        Mn_FLB_F4 = Mn_FLB_F4 + " (Sec F4)";

        Mn_FLB_F4_new = (0.9/12)*res.Rpc*res.Myc - (res.Rpc*res.Myc - 0.75*beam.Fy*beam.Sxc)*(beam.bf2tf - beam.lambdap_flange)/(beam.lambdar_flange - beam.lambdap_flange);
        Mn_FLB_F4_new= Math.round(Mn_FLB_F4_new);
        Mn_FLB_F4_new = Mn_FLB_F4_new + " (Sec F4)";
    }  
    else if (beam.bf2tf > beam.lambdar_flange)
    {
        console.log("inside Comp FLB check with slender flanges");
        Mn_FLB_F4 = (0.9/12)*0.9*E*beam.Sx*kc/Math.pow(beam.bf2tf,2);
        Mn_FLB_F4 = Math.round(Mn_FLB_F4);
        Mn_FLB_F4 = Mn_FLB_F4 + " (Sec F4)";

        Mn_FLB_F4_new = (0.9/12)*res.Rpc*res.Myc - (res.Rpc*res.Myc - 0.75*beam.Fy*beam.Sxc)*(beam.bf2tf - beam.lambdap_flange)/(beam.lambdar_flange - beam.lambdap_flange);
        Mn_FLB_F4_new= Math.round(Mn_FLB_F4_new);
        Mn_FLB_F4_new = Mn_FLB_F4_new + " (Sec F4)";
    }
    if (version === 'new')
        return Mn_FLB_F4_new;
    else
        return Mn_FLB_F4;
}

function phiMn_TFY(L, beam)
{
    var Mn_TFY = "N/A";
    var Sx = Math.min(beam.Sxc, beam.Sxt);
    var Mp = beam.Fy*Math.min(beam.Z, 1.6*Sx);
    var Rpt = 0;
    var Myt = beam.Fy*beam.Sxt;

    //calc Rpt
    if (beam.Iyc/beam.Iy > 0.23)
    {
        if  (beam.hc/beam.tw <= beam.lambdap_web)
        {
            Rpt = Mp/Myt;
        }
        else
        {
            var Mratio = Mp/Myt;
            var lambda = beam.hc/beam.tw;
            var Rpt_temp = Mratio - (Mratio-1)*( (lambda - beam.lambdap_web)/(beam.lambdar_web - beam.lambdap_web) );
            Rpt = Math.max(Mratio, Rpt_temp);
        }
    }
    //calc limit state
    if (beam.Sxt >= beam.Sxc)
    {
        Mn_TFY = "N/A";
    }
    else
    {
        Mn_TFY = Math.round(0.9*Rpt*Myt/12);
        Mn_TFY = Mn_TFY + " (Sec F4)";
    }
    return Mn_TFY;
}

function getF4Vals(beam) 
{
    var aw = beam.hc*beam.tw/(beam.bf_comp*beam.tf_comp);
    var rt = beam.bf_comp/Math.sqrt(12*(1+aw/6));
    var Rpc = 1;
    var Myc = beam.Fy*beam.Sxc;
    var Sx = Math.min(beam.Sxt, beam.Sxc);
    var Mp = beam.Fy*Math.min(beam.Z, 1.6*Sx);
    var FL = 0.7*beam.Fy;

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

    //calc FL
    if (beam.Sxt/beam.Sxc < 0.7)
        FL = Math.min(0.5*beam.Fy, beam.Sxt*beam.Fy/beam.Sxc);
    
    var result =
    {
        Rpc: Rpc,
        FL: FL,
        Myc: Myc,
        rt: rt,
        aw: aw
    }
    return result;
}
