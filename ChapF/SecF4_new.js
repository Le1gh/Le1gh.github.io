function phiMn_LTB_F4_new(L, beam)
{
    //assuming this applies only to BU
    var Cb = 1;
    var E = 29000.;

	var MnLTB;
    var MnLTB_new;
    var h0 = 0;
    var Lr = 0;
    var res = getF4Vals_new(beam);
    console.log("F4 new rt is " + res.rt);
    if (!beam.isBU)
    {
        h0 = beam.d - beam.tf;
    }
    if (beam.isBU)
    {
        var h = beam.d - beam.tf_comp - beam.tf_tens;
        var J = (1/3)*(beam.bf_comp*Math.pow(beam.tf_comp, 3) + beam.bf_tens*Math.pow(beam.tf_tens, 3) + h*Math.pow(beam.tw, 3));
        beam.J = J; 
        h0 = beam.d - 0.5*beam.tf_comp - 0.5*beam.tf_tens;   
    }
    var d = beam.J / (beam.Sxc * h0);
    var g = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((0.7*(My/beam.Sxc)/ E), 2));
    var My = beam.Fy*Math.min(beam.Sxt, beam.Sxc);
    var j = 0.7*My/beam.Sxc;
    var g_prime = Math.sqrt(Math.pow(d, 2) + 6.76 * Math.pow((j / E), 2));
    //Is the rt in the following using aw, etc. or the new aw?
    var Lr_new = (1. / 12) * 1.95 * res.rt * (E / j) * Math.sqrt(d + g_prime);
    
    var Lp = (1. / 12) * 1.1 * res.rt * Math.sqrt(E / beam.Fy);
    
    console.log("F4 new Lr is " + Lr_new);
    console.log("F4 new Lp is " + Lp);
    console.log("F4 new My " + My);
    console.log("F4 Myc_dist " + beam.Myc_dist);
    console.log("F4 Myc with Sxc " + beam.Sxc*beam.Fy);
    console.log("F4 Myt with Sxt " + beam.Sxt*beam.Fy);

    if (L > Lp && L < Lr_new)
    {
        MnLTB_new = Cb*(res.Rpc*beam.Myc_dist - (res.Rpc*beam.Myc_dist - 0.7*My)*(L - Lp)/(Lr_new - Lp));
        MnLTB_new = Math.min(MnLTB_new, res.Rpc*beam.Myc_dist);
        MnLTB_new = Math.round(0.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (inelastic, Sec. F4)";
    }
    else if (L > Lr_new)
    {
        var term1 = Cb*E*3.14159*3.14159*beam.Sxc/(Math.pow(L*12/res.rt, 2));
        var term2 = Math.sqrt(1+0.078*(beam.J/(beam.Sxc*h0))*Math.pow(L*12/res.rt, 2));
        MnLTB_new = term1*term2;
        MnLTB_new = Math.min(MnLTB_new, res.Rpc*beam.Myc_dist);
        MnLTB_new = Math.round(.9*MnLTB_new/12);
        MnLTB_new = MnLTB_new + " (elastic, Sec. F4)";
    }


    return MnLTB_new;   
}

function phiMn_CFY_F4_new(L, beam)
{
    var Mp = beam.Fy*beam.Z;
    var res = getF4Vals_new(beam);
    var phiMn = "N/A";
    console.log("CFY_F4 Rpc: " + res.Rpc);
    console.log("CFY_F4 Sxc: " + beam.Sxc);
    //this is using the User Note
    //var phiMn_compFlangeYielding = Math.round(0.9*res.Rpc*beam.Myc/12);
    //phiMn_compFlangeYielding + " (Sec F4 with User Note)\n";

    //using commentary
    if (beam.Sxt >= beam.Sxc)
    {
        phiMn = res.Rpc*beam.Fy*beam.Sxc;
    }
    else
    {
        phiMn = res.Rpc*beam.Myc_dist;
    }

    var phiMn_Commentary = Math.round(0.9*phiMn/12);
    phiMn_Commentary += " (Sec F4)";
    return phiMn_Commentary;
}

function phiMn_FLB_F4_new(L, beam)
{
    var Mn_FLB_F4_new = "N/A";
    var res = getF4Vals_new(beam);
   
    //new
    if (beam.bf2tf < beam.lambdar_flange_new && beam.bf2tf > beam.lambdap_flange_new)
    {
        Mn_FLB_F4_new = (0.9/12)*res.Rpc*beam.Myc_dist - (res.Rpc*beam.Myc_dist - 0.75*beam.Myc_dist)*(beam.bf2tf - beam.lambdap_flange_new)/(beam.lambdar_flange_new - beam.lambdap_flange_new);
        Mn_FLB_F4_new= Math.round(Mn_FLB_F4_new);
        Mn_FLB_F4_new = Mn_FLB_F4_new + " (Sec F4)";

        Mn_FLB_F4_new = (0.9/12)*res.Rpc*beam.Myc_dist- (res.Rpc*beam.Myc_dist - 0.75*beam.Myc_dist)*(beam.bf2tf - beam.lambdap_flange_new)/(beam.lambdar_flange_new - beam.lambdap_flange_new);
        Mn_FLB_F4_new= Math.round(Mn_FLB_F4_new);
        Mn_FLB_F4_new = Mn_FLB_F4_new + " (Sec F4)";
    }
   return Mn_FLB_F4_new;
}

function getF4Vals_new(beam) 
{
    console.log("Myc_dist " + beam.Myc_dist);
    var aw = beam.hc*beam.tw/(beam.bf_comp*beam.tf_comp);
    var denom = 12*(1+beam.hc*beam.tw/(6*beam.bf_comp*beam.tf_comp));
    var rt = beam.bf_comp/Math.sqrt(denom);
    console.log("F4 new, hc is " + beam.hc);
    var Rpc = 1;
    var Sx = Math.min(beam.Sxt, beam.Sxc);
    var Mp = beam.Fy*Math.min(beam.Z, 1.6*Sx);

    console.log("Mp: " + Mp);
    //calc Rpc
    console.log("beam.Iyc " + beam.Iyc);
    console.log("beam.Iy " + beam.Iy);
    if (beam.Iyc/beam.Iy > 0.23)
    {
        console.log("F4 new case 1 of RPC calc");
        if  (beam.hcy/beam.tw <= beam.lambdap_web_new)
        {
            Rpc = Mp/beam.Myc_dist;
        }
        else
        {
            var Mratio = Mp/beam.Myc_dist;
            var lambda = beam.hcy/beam.tw;
            var Rpc_temp = Mratio - (Mratio-1)*( (lambda - beam.lambdap_web_new)/(beam.lambdar_web_new - beam.lambdap_web_new) );
            Rpc = Math.min(Mratio, Rpc_temp);            
        }
    }


    var result =
    {
        Rpc: Rpc,
        rt: rt
    }
    return result;
}
