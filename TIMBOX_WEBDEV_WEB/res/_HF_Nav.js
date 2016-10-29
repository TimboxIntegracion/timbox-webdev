// Procédures globales du projet
function _RMP(c,o,r){var p=0;var t=c.indexOf(o);var s=new String();while(t!=-1){s+=c.substring(p,t);s+=r;p=t+o.length;t=c.indexOf(o,p);		}s+=c.substring(p,c.length);return s}
function _NAO(p){if(p==0||p>127)return "toolbar=0,location=0,status=0,scrollbars=0,directories=0,menubar=0,resizable=0";var o="";if(p&1)o+="toolbar=1,";if(p&2)o+="location=1,";if(p&4)o+="status=1,";if(p&8)o+="menubar=1,";if(p&16)o+="scrollbars=1,"
if(p&32)o+="resizable=1,";if(p&64)o+="directories=1,";if(o.length>0)o=o.substr(0, o.length-1);return o}
function HFNAV_OUVREDETAILS(VSDETAIL){{var VSDETAILNAV=_RMP(VSDETAIL,"&","&amp;");VSDETAILNAV=_RMP(VSDETAILNAV,"<","&lt;");VSDETAILNAV=_RMP(VSDETAILNAV,">","&gt;");VSDETAILNAV=_RMP(VSDETAILNAV,clWDEncode.sEncodeCharset(unescape("\'")),"&#39;")
VSDETAILNAV=_RMP(VSDETAILNAV,clWDEncode.sEncodeCharset(unescape("\"")),"&quot;");VSDETAILNAV=_RMP(VSDETAILNAV,clWDEncode.sEncodeCharset(unescape("\r\n")),"<BR>")
var VPCLNAVIGATEUR=open("","DETAILS".toUpperCase(),_NAO(0)+",width="+400+",height="+600)
VPCLNAVIGATEUR.document.write(((clWDEncode.sEncodeCharset(unescape("<HTML><HEAD><TITLE>Details...</TITLE></HEAD><BODY style=\"font-family:Verdana, Arial, Helvetica, sans-serif;font-size:12px;color:#1540A1;\">"))+VSDETAILNAV)+"</BODY></HTML>"))
VPCLNAVIGATEUR.document.close();ToClipBoard(VSDETAIL)}}
function ToClipBoard(sTexte)
{
	if (window.clipboardData)
	{
		window.clipboardData.setData("Text", sTexte);
		return;
	}
	// Pas de code pour la copie pour Firefox/autres navigateur pour le moment
}
