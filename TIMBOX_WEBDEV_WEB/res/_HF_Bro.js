// Procédures globales du projet
function _RMP(c,o,r){var p=0;var t=c.indexOf(o);var s=new String();while(t!=-1){s+=c.substring(p,t);s+=r;p=t+o.length;t=c.indexOf(o,p);		}s+=c.substring(p,c.length);return s}
function _NAO(p){if(p==0||p>127)return "toolbar=0,location=0,status=0,scrollbars=0,directories=0,menubar=0,resizable=0";var o="";if(p&1)o+="toolbar=1,";if(p&2)o+="location=1,";if(p&4)o+="status=1,";if(p&8)o+="menubar=1,";if(p&16)o+="scrollbars=1,"
if(p&32)o+="resizable=1,";if(p&64)o+="directories=1,";if(o.length>0)o=o.substr(0, o.length-1);return o}
function HFBRO_OPENDETAILS(VSDETAILS){{var VSBROWDETAILS=_RMP(VSDETAILS,"&","&amp;");VSBROWDETAILS=_RMP(VSBROWDETAILS,"<","&lt;");VSBROWDETAILS=_RMP(VSBROWDETAILS,">","&gt;")
VSBROWDETAILS=_RMP(VSBROWDETAILS,clWDEncode.sEncodeCharset(unescape("\'")),"&#39;");VSBROWDETAILS=_RMP(VSBROWDETAILS,clWDEncode.sEncodeCharset(unescape("\"")),"&quot;")
VSBROWDETAILS=_RMP(VSBROWDETAILS,clWDEncode.sEncodeCharset(unescape("\r\n")),"<BR>");var VPCLBROWSER=open("","DETAILS".toUpperCase(),_NAO(0)+",width="+400+",height="+600)
VPCLBROWSER.document.write(((clWDEncode.sEncodeCharset(unescape("<HTML><HEAD><TITLE>Details...</TITLE></HEAD><BODY style=\"font-family:Verdana, Arial, Helvetica, sans-serif;font-size:12px;color:#1540A1;\">"))+VSBROWDETAILS)+"</BODY></HTML>"))
VPCLBROWSER.document.Close();ToClipBoard(VSDETAILS)}}
function ToClipBoard(sText)
{
	if (window.clipboardData)
	{
		window.clipboardData.setData("Text", sText);
		return;
	}
	// No code for copy for Firefox and other browsers
}
