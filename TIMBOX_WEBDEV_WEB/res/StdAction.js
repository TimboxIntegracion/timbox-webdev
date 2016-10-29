var _p=null;
var _r=null;
var _b=null;
function _CFI(a)
{
	var i = a.indexOf("?");
	var j = a.lastIndexOf("?");

	while (j > i)
	{
		a = a.substring(0, j - 1) + "&" + a.substring(j + 1);
		j = a.lastIndexOf("?");
	}
	return a;
}
function _JCL(a,t,n,o)
{
	a=_CFI(a);
	if(t=="_blank")
	{
		if(o)open(a,n.toUpperCase(),o);
		else open(a,n.toUpperCase());
	}
	else if(t=="_top")top.document.location=a;
	else if(t=="_parent")parent.document.location=a;
	else if(t=="_self")self.document.location=a;
	else {
		var f=_JOF(top,t);
		if(f.parent==self){open(a,t);}
		else{f.document.location=a;}
	}
}
function _JRL(a,t,n,o)
{
	a=_CFI(a);
	if(t=="_blank")
	{
		if(o)open(a,n.toUpperCase(),o);
		else open(a,n.toUpperCase());
	}
	else if(t=="_top")top.document.location.replace(a);
	else if(t=="_parent")parent.document.location.replace(a);
	else if(t=="_self")self.document.location.replace(a);
	else _JOF(top,t).document.location.replace(a);
}
function _JSL(p,a,t,n,o,ac)
{
	a=_CFI(a);
	p.WD_ACTION_.value=(ac?ac:"");_b=p.WD_BUTTON_CLICK_.value;p.WD_BUTTON_CLICK_.value=a;var s=1;
	if ((navigator.appName == "Microsoft Internet Explorer") && (navigator.platform.substr(0, 3) == "Mac")) s=200;
	if(t=="_blank"&&o)
	{
		var d=new Date();var e=(n!=""?n.toUpperCase():"_BLANK_"+Math.abs(Date.UTC(d.getYear(),d.getMonth(),d.getDay(),d.getHours(),d.getMinutes(),d.getSeconds())));
		if(o)open("",e,o);else open("",e);t=e;s=1000;
	}
	else if(t!="_blank"&&t!="_self"&&t!="_top"&&t!="_parent")t=t.toUpperCase();
	_p=p;_r=p.target;p.target=t;p.submit();
	setTimeout("_JRE()",s);
}
function _JRE(){_p.target=_r;_p.WD_BUTTON_CLICK_.value=_b;}
function _JOF(w,n)
{
	try
	{
		if(w.frames[n])
		{
			return w.frames[n];
		}
	}
	catch(e)
	{
	}
	var i;for(i=0;i<w.frames.length;i++)
	{
		try
		{
			if (w.frames[i].name.toUpperCase() == n.toUpperCase())
			{
				return w.frames[i];
			}
		}
		catch (e)
		{
		}
		var f =_JOF(w.frames[i],n);
		if(f)
		{
			return f;
		}
	}
	return null;
}
function _JGE(i,d,s,p)
{
	var clElement;
	var isu=i.replace(/_/g, "");
	if(d.getElementById)
	{
		if (!s)
		{
			if(!p)
			{
				clElement=d.getElementById(i);if(clElement)return clElement;
				clElement=d.getElementById(i+'_');if(clElement&&(d.getElementsByName(i+"_AS").length>0))return clElement;
			}
			clElement=d.getElementById("tz"+i);if(clElement)return clElement;
			clElement=d.getElementById("dz"+i);if(clElement)return clElement;
			clElement=d.getElementById("tz"+isu);if(clElement)return clElement;
			clElement=d.getElementById("bz"+isu);if(clElement)return clElement;
			clElement=d.getElementById("dww"+isu);if(clElement)return clElement;
		}
		else
		{
			clElement=d.getElementById("dwwcz"+isu);if(clElement)return clElement;
			clElement=d.getElementById("dzcz"+i);if(clElement)return clElement;
			clElement=d.getElementById("cz"+i);if(clElement)return clElement;
			clElement=d.getElementById("dww"+isu);if(clElement)return clElement;
			clElement=d.getElementById("bz"+isu);if(clElement)return clElement;
			clElement=d.getElementById("tz"+isu);if(clElement)return clElement;
			clElement=d.getElementById("dz"+i);if(clElement)return clElement;
			clElement=d.getElementById("ctz"+i);if(clElement)return clElement;
			clElement=d.getElementById("con-"+i);if(clElement)return clElement;
			clElement=d.getElementById("tz"+i);if(clElement)return clElement;
			clElement=d.getElementById("lz"+i);if(clElement)return clElement;
			if(!p)
			{
				clElement=d.getElementById(i+'_');if(clElement&&(d.getElementsByName(i+"_AS").length>0))return clElement;
				clElement=d.getElementById(i);if(clElement)return clElement;
			}
		}
	}
	else if(d.all)
	{
		if (!s)
		{
			if(!p)
			{
				clElement=d.all[i];if(clElement)return clElement;
				clElement=d.all[i+'_'];if(clElement&&(d.getElementsByName(i+"_AS").length>0))return clElement;
			}
			clElement=d.all["tz"+i];if(clElement)return clElement;
			clElement=d.all["dz"+i];if(clElement)return clElement;
			clElement=d.all["tz"+isu];if(clElement)return clElement;
			clElement=d.all["bz"+isu];if(clElement)return clElement;
			clElement=d.all["dww"+isu];if(clElement)return clElement;
		}
		else
		{
			clElement=d.all["dwwcz"+isu];if(clElement)return clElement;
			clElement=d.all["dzcz"+i];if(clElement)return clElement;
			clElement=d.all["cz"+i];if(clElement)return clElement;
			clElement=d.all["dww"+isu];if(clElement)return clElement;
			clElement=d.all["bz"+isu];if(clElement)return clElement;
			clElement=d.all["tz"+isu];if(clElement)return clElement;
			clElement=d.all["dz"+i];if(clElement)return clElement;
			clElement=d.all["ctz"+i];if(clElement)return clElement;
			clElement=d.all["con-"+i];if(clElement)return clElement;
			clElement=d.all["tz"+i];if(clElement)return clElement;
			clElement=d.all["lz"+i];if(clElement)return clElement;
			if(!p)
			{
				clElement=d.all[i+'_'];if(clElement&&(d.getElementsByName(i+"_AS").length>0))return clElement;
				clElement=d.all[i];if(clElement)return clElement;
			}
		}
	}
	else{var a=new Object();a.style=new Object();return a;}
}