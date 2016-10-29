//#15.00Ae WDLIB.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".


// Liste des messages d'erreurs qui peuvent etre affiches :
var sErreur = bPCSFR ? "La valeur saisie est incorrecte." : "The entered value is incorrect.";
var sErreurMail = bPCSFR ? "L'adresse email saisie ne correspond pas à une adresse email valide." : sErreur;
var sErreurMailMul=bPCSFR?"L'une des adresses emails saisies ne correspond pas à une adresse email valide.":sErreur;

var sPCSSaisie="";

var sMasqueJJ=bPCSFR?"JJ":"DD";
var sMasqueAAAA=bPCSFR?"AAAA":"YYYY";

function sJour(i)
{
	switch(i)
	{
		case 0: return STD_DIMANCHE;
		case 1: return STD_LUNDI;
		case 2: return STD_MARDI;
		case 3: return STD_MERCREDI;
		case 4: return STD_JEUDI;
		case 5: return STD_VENDREDI;
		case 6: return STD_SAMEDI;
		default: return "";
	}
}

function sMois(i)
{
	switch(i)
	{
		case 0: return STD_JANVIER;
		case 1: return STD_FEVRIER;
		case 2: return STD_MARS;
		case 3: return STD_AVRIL;
		case 4: return STD_MAI;
		case 5: return STD_JUIN;
		case 6: return STD_JUILLET;
		case 7: return STD_AOUT;
		case 8: return STD_SEPTEMBRE;
		case 9: return STD_OCTOBRE;
		case 10: return STD_NOVEMBRE;
		case 11: return STD_DECEMBRE;
		default: return "";
	}
}

///////////////////////////////////////////////////////////////////////
function bIsNetscape()
{
	return ( navigator.appName=="Netscape" )
}
///////////////////////////////////////////////////////////////////////
var b = false;
function bIsExplorer()
{
	return ( navigator.appName=="Microsoft Internet Explorer" )
}
///////////////////////////////////////////////////////////////////////
function bIsLetter (c)
{   return ( ((c >= "a") && (c <= "z")) ||
			 ((c >= "A") && (c <= "Z")) ||
			 ( c == "á" ) || ( c == "à" ) || ( c == "â" ) ||
			 ( c == "é" ) || ( c == "è" ) || ( c == "ê" ) ||
			 ( c == "ï" ) || ( c == "î" ) ||
			 ( c == "ö" ) || ( c == "ô" ) ||
			 ( c == "ü" ) || ( c == "ù" ) || ( c == "û" ) ||
			 ( c == "ç" ) )
}
///////////////////////////////////////////////////////////////////////
function bIsDigit (c)
{	return ( (c >= "0") && (c <= "9") )	}
///////////////////////////////////////////////////////////////////////
function bIsSepTel(c)
{	return ( ( c == " " ) || ( c == "/" ) || ( c == "\\" ) || ( c == "." ) )		}
///////////////////////////////////////////////////////////////////////
function bIsSymbol(c)
{	return ( ( c == "," ) || ( c == "." ) || ( c == "+" ) || ( c == "-" ) || ( c == " " ) || ( c == "*" ) || ( c == "/" ) )		}
///////////////////////////////////////////////////////////////////////
function bIsControl(c)
{	return ( c < " " )		}
///////////////////////////////////////////////////////////////////////
function bIsSigne(c)
{	return (c=="+") || (c=="-")	}
///////////////////////////////////////////////////////////////////////
function bIsSepDec(c)
{	return ( (c == ".") || (c == ","))		}

///////////////////////////////////////////////////////////////////////
function bEspNS() 
{
	return bIsNetscape() && (typeof(_WW_SEPMILLIER_) != "undefined") && (_WW_SEPMILLIER_.charCodeAt(0) == 160)
}

///////////////////////////////////////////////////////////////////////
function GetChp(evt)
{
	if (bIsExplorer()) return evt.srcElement;
	if (bIsNetscape()) return evt.target;
	return null;
}

///////////////////////////////////////////////////////////////////////
function GetCar(evt)
{
	if (bIsExplorer()) return String.fromCharCode(evt.keyCode);
	if (bIsNetscape()) return String.fromCharCode(evt.which);;
	return "";
}

///////////////////////////////////////////////////////////////////////
function ValRetIE(evt,test)
{
	if (test || (evt.keyCode == 13))
	{
		return evt.keyCode;
	}
	return test;
}

///////////////////////////////////////////////////////////////////////
function ValRet(evt,test)
{
	if (bIsNetscape()) return test || bIsControl(GetCar(evt));
	if (bIsExplorer()) return evt.returnValue = ValRetIE(evt,test);
	return true;
}

///////////////////////////////////////////////////////////////////////
function GetPositionCaret(chp) 
{	
	var p = 0;
	if (document.selection)
	{
		chp.focus();
		var s = document.selection.createRange();
		s.moveStart ('character',-chp.value.length);
		p = s.text.length;
	}	
	else if (chp.selectionStart || (chp.selectionStart == '0')) p = chp.selectionStart;
	return p;
}

///////////////////////////////////////////////////////////////////////
function SetPositionCaret(chp,pos)
{
	if(chp.setSelectionRange)
	{
		chp.focus();
		chp.setSelectionRange(pos,pos);
	}
	else if (chp.createTextRange)
	{
		var s = chp.createTextRange();	
		s.collapse(true);
		s.moveEnd('character', pos);
		s.moveStart('character', pos);
		s.select();
	}
}

///////////////////////////////////////////////////////////////////////
function GetSel (chp) 
{
	if (document.selection)
	{
		chp.focus();
		var s = document.selection.createRange();
		return s.text;
	}
	if (chp.selectionStart || (chp.selectionStart == '0')) return chp.value.substring(chp.selectionStart,chp.selectionEnd);
	return "";
}

///////////////////////////////////////////////////////////////////////
function GetDebSel (chp) 
{	
	if (document.selection) 
	{		
		chp.focus();		
		var s = document.selection.createRange();
		var l = s.text.length;
		s.moveStart ('character',-chp.value.length);		
		return s.text.length - l;	
	}	
	if (chp.selectionStart || (chp.selectionStart == '0')) return chp.selectionStart;	
	return 0;
}

///////////////////////////////////////////////////////////////////////
function GetPositionCaretDetSel(ch)
{
	var j = GetPositionCaret(ch);
	var l = GetSel(ch).length;
	if ((l > 0) && (!ch.readOnly))
	{
		var ds = GetDebSel(ch);
		ch.value = ch.value.substring(0,ds) + ch.value.substring(ds + l,ch.value.length);
		j = ds;
		SetPositionCaret(ch,j);
	}
	return j;
}

///////////////////////////////////////////////////////////////////////
function remplacePos(s,i,r)
{
	return s.substring(0,i) + r + s.substring(i + 1,s.length);
}

///////////////////////////////////////////////////////////////////////
function remplace(s,c,r,d)
{
	var i = s.indexOf(c,d);
	if (i < 0) return s;
	return s.substring(0,i)+r+s.substring(i+c.length,s.length);
}

///////////////////////////////////////////////////////////////////////
function remplaceTout(s,c,r)
{
	var i = 0;
	while ((i = s.indexOf(c)) >= 0) s = remplacePos(s,i,r);
	return s;
}

///////////////////////////////////////////////////////////////////////
function InserePos(s,i,r)
{
	return s.substring(0,i) + r + s.substring(i,s.length);
}

///////////////////////////////////////////////////////////////////////
function ExtraitDebutLimite(s,d,l)
{
	var f=s.indexOf(l,d);
	return s.substring(d,(f<0)?s.length:f);
}

///////////////////////////////////////////////////////////////////////
function CarMasqueDate(c)
{
	switch(c)
	{
		case "J":
		case "M":
		case "A":
			return true;
		default:
			return false;
	}
}

///////////////////////////////////////////////////////////////////////
function ValLimiteMasque(v,m)
{
	var d=0;
	var f=0;
	switch(m)
	{
		case "AAAA":
		case "YYYY":
			f=9999;
			break;
		case "MM":
			d=1;
			f=12;
			break;
		case "JJ":
		case "DD":
			d=1;
			f=31;
			break;
		default:
			break;
	}
	return Math.max(Math.min(v,f),d);
}

///////////////////////////////////////////////////////////////////////
function RecupValMasqueDate(s,m,c)
{
	var d=0;
	if(c!=null)
	{
		var p=c.indexOf(m);
		if(p>=0)d=p;
	}
	return ValLimiteMasque(parseInt(s.substring(d,Math.min(s.length,d+m.length)),10),m);
}

///////////////////////////////////////////////////////////////////////
function ValMois(m)
{
	var i=0;
	for(i=0;i<12;i++) if(sMois(i).indexOf(m)>=0) return i+1;
	return 0;
}

///////////////////////////////////////////////////////////////////////
function RemplaceMasqueLimite(s,m,v)
{
	var x=""+ValLimiteMasque(v,m);
	var n=m.length-x.length;
	while(n-->0)x="0"+x;
	return remplace(s,m,x);
}

///////////////////////////////////////////////////////////////////////
function init(evt,val,masque)
{
	var c = GetChp(evt);
	sPCSSaisie = c.value;
	if(c.value!="")
	{
		if(masque!=null)
		{
			var s=c.value;
			var p=0;
			var q=0;
			var d=0;
			var e=0;
			var l=masque.length;
			var n=s.length;
			var j=0;
			var m=0;
			var a=0;
			while((p<l)&&(q<n))
			{
				var x=masque.charAt(p);
				var y=masque.charAt(d);
				var by=CarMasqueDate(y);
				var f=(p==l-1);
				var bt=((f)||(by!=CarMasqueDate(x))||(by&&(x!=y)));
				if(bt)
				{
					var t=masque.substring(d,p+(f?1:0));
					if(by)
					{
						var u=ExtraitDebutLimite(s,e,x);
						switch(t)
						{
							case "AAAA":
								a=RecupValMasqueDate(u,t);
								break;
							case "JJ":
								j=RecupValMasqueDate(u,t);
								break;
							case "MMMM":
								m=ValMois(u);
								break;
							default:
								break;
						}
						q+=u.length;
					}
					else q+=t.length;
					d=p;
					e=q;
				}
				p++;
				if((!by)&&(!bt))q++;
			}
			c.value=RemplaceMasqueLimite(RemplaceMasqueLimite(RemplaceMasqueLimite(val,"MM",m),sMasqueJJ,j),sMasqueAAAA,a);
		}
		return;
	}
	c.value = val;
	SetPositionCaret(c,0);
}

///////////////////////////////////////////////////////////////////////
function RecupMasqueLimite(s,m,p)
{
	
}

///////////////////////////////////////////////////////////////////////
function reinit(evt,val,masque,exp)
{
	var c=GetChp(evt);
	if(c.value==val) c.value="";
	if((masque!=null)&&(c.value!=""))
	{
		if(!VerifRegExp(c,exp)) return;
		var s=c.value;
		var d=new Date();
		d.setDate(RecupValMasqueDate(s,sMasqueJJ,val));
		d.setMonth(RecupValMasqueDate(s,"MM",val)-1);
		d.setFullYear(RecupValMasqueDate(s,sMasqueAAAA,val));
		c.value=RemplaceMasqueLimite(RemplaceMasqueLimite(remplace(remplace(masque,"JJJJ",sJour(d.getDay())),"MMMM",sMois(d.getMonth())),"JJ",d.getDate()),"AAAA",d.getFullYear());
	}
	if(c.value==sPCSSaisie) return;
	sPCSSaisie=c.value;
	var r="Firefox/";
	var p=navigator.userAgent.indexOf(r);
	if((bIsExplorer()||((p>=0)&&(parseInt(navigator.userAgent.substring(p+r.length,navigator.userAgent.length))>=2)))&&(c.onchange!=null)) c.onchange(evt);
}

///////////////////////////////////////////////////////////////////////
function GetAn(d)
{
	var y = d.getYear();
	if (y < 1900) y += 1900;
	return y;
}

///////////////////////////////////////////////////////////////////////
function ControleSaisie(s,m,d,sep)
{
	if (s.charAt(d + 1) == sep) return s;
	var max = 0;
	var c = m.charAt(d);
	if ((c == "J")||(c=="D")) max = 31;
	else if ((c == "M") && (sep == "/")) max = 12;
	else if (c == "H") max = 23;
	else if (((c == "M") && (sep = ":")) || (c == "S")) max = 59;
	else if ((c == "A")||(c=="Y"))
	{
		if (((d > 0) && (s.charAt(d - 1) != sep)) || (s.length <= (d + 2)) || (s.charAt(d + 2) == sep)) return s;
		var dat = new Date();
		var y = GetAn(dat);
		var ymin = y - 99;
		var p = s.charAt(d);
		var mil = parseInt(p) * 1000;
		if (((mil + 999) >= ymin) && (mil <= y)) return s;
		var sie = Math.floor(y / 100);
		return s.substring(0,d) + "" + (sie - ((((sie * 100) + (parseInt(p) * 10)) > y) ? 1 : 0)) + s.charAt(d) + s.substring(d + 3,s.length);
	}
	else return s;
	if (parseInt(s.charAt(d)) * 10 > max) s = s.substring(0,d) + "0" + s.charAt(d) + s.substring(d + 2,s.length);
	return s;
}

///////////////////////////////////////////////////////////////////////
function EffaceMasque(s,sep)
{
	var r = "";
	var i = 0;
	var c = "";
	var m = "";
	for (i = 0; i < s.length; i++)
	{
		var x = s.charAt(i);
		var b = x == sep;
		if (!b) if (bIsDigit(x)) c += x; else m += x;
		if (b || (i == s.length - 1))
		{
			if (m == "") r += c;
			else
			{
				var v = "00";
				if (sep == "/")
				{
					var d = new Date();
					if ((m.charAt(0) == "J") || (m.charAt(0) == "D")) v = ((d.getDate() < 10) ? "0" : "") + d.getDate();
					else if (m.charAt(0) == "M") v = ((d.getMonth() < 9) ? "0" : "") + (d.getMonth() + 1);
					else if ((m.charAt(0) == "A")||(m.charAt(0) == "Y"))
					{
						var a = GetAn(d);
						if (c.length + m.length == 2) a = a % 100;
						v = ((a < 10) ? "0" : "") + a;
					}
				}
				if (v.substring(0,c.length) == c) r += v;
				else
				{
					r += c;
					var j = 0;
					for (j = 0; j < m.length; j++) r += "0";
				}
			}
			c = m = "";
			if (b) r += x;
		}
	}
	return r;
}

///////////////////////////////////////////////////////////////////////
function CompleteSaisie(evt,m,sep,em)
{
	var car = GetCar(evt);
	var ch = GetChp(evt);
	var bp = (car == "+");
	var bi = (bp || (car == "-")) && (sep == "/") && bIsDigit(ch.value.charAt(0));
	var res = true;
	if (bIsNetscape())
	{
		res = ( bi || bIsDigit(car) || (car==sep) || bIsControl(car) );
		if ((!res) || bIsControl(car)) return res;
	}
	if (bIsExplorer())
	{
		evt.returnValue = ValRetIE(evt,bi || bIsDigit(car) || (car==sep));
		if (!evt.returnValue || (evt.keyCode == 13)) return res;
	}
	if (ch.readOnly) return res;
	var j = bi ? 0 : GetPositionCaretDetSel(ch);
	if (bi) ch.value = _JDJ(ch.value, m, bp ? 1 : (-1));
	else 
	{
		var i = 0;
		var s = m;
		var d = 0;
		if ((ch.value.charAt(j) == sep) && (j > 0) && (m.charAt(j) == sep) && bIsDigit(ch.value.charAt(j - 1))) j++;
		var jd = j;
		while (i < Math.max(jd + 1, ch.value.length)) 
		{
			var c = ((i == jd) && (bIsDigit(car) || (i > ch.value.length))) ? car : ch.value.charAt(i);
			if (bIsDigit(c)) 
			{
				var u = 0;
				for (u = d; u < s.length; u++)
					if ((s.charAt(u) != sep) && (!bIsDigit(s.charAt(u)))) 
					{
						s = remplacePos(s, u, c);
						break;
					};
			}
			var b = (ch.value.charAt(i) == sep);
			if (i == jd) 
			{
				var t = s;
				s = ControleSaisie(s, m, d, sep);
				var k = d + 1;
				while ((k < s.length) && (s.charAt(k) != t.charAt(k))) 
				{
					if ((!b) && ((i + 1) < ch.value.length) && (ch.value.charAt(i + 1) != sep)) i++;
					j++;
					k++;
				}
			}
			if (b && ((d = s.indexOf(sep, d)) >= 0)) d++;
			i++;
		}
		ch.value = em ? EffaceMasque(s, sep) : s;
		j++;
		if (ch.value.charAt(j) == sep) j++;
	}
	SetPositionCaret(ch,j);
	if (bIsExplorer) evt.returnValue = false;
	return false;
}

///////////////////////////////////////////////////////////////////////
function SelectAll(ch)
{
	if(ch.setSelectionRange)
	{
		ch.setSelectionRange(0,ch.value.length);
		ch.selectionEnd=ch.value.length;
	}
	else if(ch.createTextRange)
	{
		var s=ch.createTextRange();
		s.collapse(true);
		s.moveStart('character',0);
		s.moveEnd('character',ch.value.length);
		s.select();
	}
}

///////////////////////////////////////////////////////////////////////
function initNombre(evt,m)
{
	if (_WW_SEPMILLIER_ == "") return;
	var ch = GetChp(evt);
	ch.value = remplaceTout(ch.value,_WW_SEPMILLIER_,"");
	if(bEspNS()) ch.value=remplaceTout(ch.value," ","");
	SelectAll(ch);
}

//////////////////////////////////////////////////////////////////////
function PosOuFin(s,c)
{
	var p = s.indexOf(c);
	return (p < 0) ? s.length : p;
}

///////////////////////////////////////////////////////////////////////
function reinitNombre(evt,m)
{
	var ch = GetChp(evt);
	if(ch.value=="")return;
	var v = PosOuFin(ch.value,_WW_SEPDECIMAL_);
	var w = PosOuFin(m,_WW_SEPDECIMAL_);
	if ((_WW_SEPMILLIER_ != "") && (v >= 4))
	{
		var n = 0;
		var i = v;
		while (i-- > 0)
		{
			w--;
			if (bIsDigit(ch.value.charAt(i)) && (w > 0) && (m.charAt(w) == " "))
			{
				ch.value = InserePos(ch.value,i+1,_WW_SEPMILLIER_);
				w--;
			}
		}
	}
	if (_WW_SEPDECIMAL_ == "") return;
	if (m.charAt(w = PosOuFin(m,_WW_SEPDECIMAL_)) != _WW_SEPDECIMAL_) return;
	v = PosOuFin(ch.value,_WW_SEPDECIMAL_);
	if (ch.value.charAt(v) != _WW_SEPDECIMAL_) ch.value += _WW_SEPDECIMAL_;
	while (w++ < m.length) if (++v > ch.value.length) ch.value += "0";
}

///////////////////////////////////////////////////////////////////////
function VerifSaisieNombre(evt,m)
{
	var car = GetCar(evt);
	if (bIsControl(car)) return true;
	var ch = GetChp(evt);
	var res = true;
	var me = 0;
	var md = 0;
	var i = 0;
	while ((i < m.length) && (!bIsSepDec(m.charAt(i)))) if (bIsDigit(m.charAt(i++))) me++;
	if (bIsSepDec(m.charAt(i))) while (++i < m.length) if (bIsDigit(m.charAt(i))) md++;
	var p = GetPositionCaretDetSel(ch)
	var v = ch.value.indexOf(_WW_SEPDECIMAL_);
	if (bIsDigit(car))
	{
		var b = (v < 0) || (p <= v);
		var d = b ? 0 : (v + 1);
		var f = (b && (v >= 0)) ? v : (ch.value.length);
		var n = 0;
		for (i = d; i < f; i++) if (bIsDigit(ch.value.charAt(i))) n++;
		res = n < (b ? me : md);
	}
	else if (bIsSepDec(car))
	{
		if (res = ((v < 0) && (md > 0)))
		{
			var j = 0;
			for (i = 0; i < p; i++) if (bIsDigit(ch.value.charAt(i))) j++;
			if ((res = ((j > 0) && (j <= me) && ((ch.value.length - p) <= md))) && (car != _WW_SEPDECIMAL_))
			{
				ch.value = InserePos(ch.value,p,_WW_SEPDECIMAL_);
				SetPositionCaret(ch,p+1);
				res = false;
			}
		}
	}
	else if (car == "-") res = (ch.value.indexOf("-") < 0) && (p==0) && (m.charAt(0) == "+");
	else res = false;
	return ValRet(evt,res);
}

///////////////////////////////////////////////////////////////////////
function NewNav()
{
	return (parseInt(navigator.appVersion)>=4)
}


///////////////////////////////////////////////////////////////////////
function RegExpOK(s,e)
{
	if (NewNav()) 
	{
		r = new RegExp(e);
		if (bEspNS()) s = remplaceTout(s, " ", _WW_SEPMILLIER_);
		return (s == "") || r.test(s);
	}
	return true;
}

///////////////////////////////////////////////////////////////////////
function VerifRegExp(Champ,sRegExp)
{
	if((!Champ.readOnly)&&NewNav())
	{
		if(!RegExpOK(Champ.value,sRegExp))
		{
			if(bIsExplorer()) Champ.style.color=0xff0000;
			alert((sRegExp.indexOf("|fr")<0)?sErreur:((sRegExp.indexOf(";")<0)?sErreurMail:sErreurMailMul));
			Champ.focus();
			return false;
		}
		else if(bIsExplorer()&&(Champ.style.color=="#ff0000")) Champ.style.color=0x000000;
	}
	return true;
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// handler pour le masque "tout en majuscules" :
function ToutEnMaj(evt)
{
	var car;
	var p;
	var ch = GetChp(evt);
	// code different pour netscape et ie :
	if ( bIsNetscape() )
	{	// conversion code ascii -> caractere :
		car = String.fromCharCode(evt.which);
		// est-ce que c'est une lettre :
		if ((( car>='a' ) && ( car<='z')) || (( car>='A' ) && ( car<='Z')))
		{	
			// oui => conversion en majuscule
			ch = GetChp(evt);
			p = GetPositionCaretDetSel(ch);
			ch.value = InserePos(ch.value,p,car.toUpperCase());
			SetPositionCaret(ch,p + 1);
			return false;
		}
	}
	if ( bIsExplorer() )
	{	// conversion en caractere :
		car = String.fromCharCode(evt.keyCode);
		// puis passage en majuscule et code ascii :
		evt.keyCode = car.toUpperCase().charCodeAt(0);
	}
	return true;
}

///////////////////////////////////////////////////////////////////////

function ToutEnMin(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		if ( ( car>='A' ) && ( car<='Z') )
		{				
			evt.which = escape(car.toLowerCase());
			evt.target.handleEvent(evt);
//			return false;
		}
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.keyCode = car.toLowerCase().charCodeAt(0);
	}
	return true;
}

///////////////////////////////////////////////////////////////////////

function Lettre(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		// on accepte la touche si c'est bien une lettre :
		return bIsLetter(car) || bIsControl(car);
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		// on accepte la touche si c'est bien une lettre :
		evt.returnValue = ValRetIE(evt,bIsLetter(car));
	}

	return true;
}

///////////////////////////////////////////////////////////////////////

function PremiereLettreMaj(evt)
{
	var car = GetCar(evt);
	var ch = GetChp(evt);
	var res = true;
	if ((car != (car = car.toUpperCase())) && (GetPositionCaretDetSel(ch) == 0))
	{
		ch.value = InserePos(ch.value,0,car);
		res = false;
		if (bIsExplorer()) evt.returnValue = res;
	}
	return res;
}

///////////////////////////////////////////////////////////////////////

function LettreChiffre(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return bIsLetter(car) || bIsDigit(car) || bIsControl(car) ;
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsLetter(car) || bIsDigit(car));
	}
	return true;
}

///////////////////////////////////////////////////////////////////////

function Chiffre(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return ( bIsDigit(car) || bIsControl(car) );
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsDigit(car));
	}

	return true;
}

///////////////////////////////////////////////////////////////////////

function LettreMaj(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		// conversion en majuscule :
		car = car.toUpperCase();
		// on laisse passer les caracteres de controles :
		if ( bIsControl(car) )
			return true;
		// et on refuse tout ce qui n'est pas majuscule :
		if ( ( car<'A' ) || ( car>'Z') )
			return false;
	}
	if ( bIsExplorer() )
	{	// on recupere le caractere frappe :
		car = String.fromCharCode(evt.keyCode);
		// conversion en majuscule :
		car = car.toUpperCase();
		// est-ce que c'est bien une majuscule ?
		if ( ( car >='A' ) && ( car <='Z' ) )
			// ok : on renvoi son code ascii :
			evt.keyCode = car.charCodeAt(0);
		else
			// sinon, on refuse :
			evt.returnValue = false;
	}
	return true;
}

///////////////////////////////////////////////////////////////////////

function LettreMajChiffre(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		// conversion en majuscule :
		car = car.toUpperCase();
		// on laisse passer les caracteres de controles :
		if ( bIsControl(car) )
			return true;
		// et on refuse tout ce qui n'est pas majuscule :
		if ( ( ( car<'A' ) || ( car>'Z') ) &&
			 ( ! bIsDigit(car) ) )
			return false;
	}
	if ( bIsExplorer() )
	{	// on recupere le caractere frappe :
		car = String.fromCharCode(evt.keyCode);
		// conversion en majuscule :
		car = car.toUpperCase();
		// est-ce que c'est bien une majuscule ?
		if ( ( ( car >='A' ) && ( car <='Z' ) ) ||
			 ( bIsDigit(car) ) )
			// ok : on renvoi son code ascii :
			evt.keyCode = car.charCodeAt(0);
		else
			// sinon, on refuse :
			evt.returnValue = false;
	}
	return true;
}

///////////////////////////////////////////////////////////////////////

function NumTel(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return bIsSepTel(car) || bIsDigit(car) || bIsControl(car);
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsSepTel(car) || bIsDigit(car));
	}

	return true;
}

///////////////////////////////////////////////////////////////////////

function NumTelFr(evt)
{
	var car=GetCar(evt);
	if(bIsControl(car)) return true;
	var ch=GetChp(evt);
	var res = true;
	var p = GetPositionCaretDetSel(ch);
	if ((ch.value.length < 14) && (bIsDigit(car) || (car == ".")))
	{
		if ((p == ch.value.length) && (p < 11) && (((p + 2) % 3) == 0))
		{
			ch.value = InserePos(ch.value,p,car + ".");
			res = false;
		}
	}
	else res = false;
	return ValRet(evt,res);
}

///////////////////////////////////////////////////////////////////////

function ChiffreSymbol(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return bIsSymbol(car) || bIsDigit(car) || bIsControl(car);
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsSymbol(car) || bIsDigit(car));

	}
	return true;
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function ChiffreSigne(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return ( bIsDigit(car) || bIsSigne(car) || (car==_WW_SEPMILLIER_) || bIsControl(car) );
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsDigit(car) || bIsSigne(car)  || (car==_WW_SEPMILLIER_));
	}
	return true;
}

///////////////////////////////////////////////////////////////////////

function ChiffreVirgule(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return ( bIsDigit(car) || (car==_WW_SEPDECIMAL_) || (car==_WW_SEPMILLIER_) || bIsControl(car) );
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsDigit(car) || (car==_WW_SEPDECIMAL_) || (car==_WW_SEPMILLIER_) || (car==","));
	}
	return true;
}

///////////////////////////////////////////////////////////////////////

function ChiffreSigneVirgule(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return ( bIsDigit(car) || bIsSigne(car) || (car==_WW_SEPDECIMAL_) || (car==_WW_SEPMILLIER_) || bIsControl(car) );
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsDigit(car) || bIsSigne(car) || (car==_WW_SEPDECIMAL_) || (car==_WW_SEPMILLIER_) || (car==","));
	}
	return true;
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function HHMM(evt,m)
{
	return CompleteSaisie(evt,m,":",true);
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function JJMMAA(evt,m)
{
	return CompleteSaisie(evt,m,"/",true);
}


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function Euro(evt)
{
	var car;

	if ( bIsNetscape() )
	{
		car = String.fromCharCode(evt.which);
		return bIsLetter(car) || bIsDigit(car) || (car==_WW_SEPMILLIER_) || (car==_WW_SEPDECIMAL_) || bIsControl(car);
	}
	if ( bIsExplorer() )
	{
		car = String.fromCharCode(evt.keyCode);
		evt.returnValue = ValRetIE(evt,bIsLetter(car) || bIsDigit(car) || (car==_WW_SEPMILLIER_) || (car==_WW_SEPDECIMAL_));
	}
	return true;
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function Email(evt)
{
	var car = GetCar(evt);
	var ch = GetChp(evt);
	var res = (car != "\"") && (car != "(") && (car != ")") && (car != "\\") && (car != "<") && (car != ">") && (car != ",") && (car != ";") && (car != ":") && ((car != "@") || (ch.value.indexOf("@") < 0));
	if (bIsExplorer()) evt.returnValue = res;
	return res;
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function CheminFichier(evt)
{
	var car = GetCar(evt);
	var res = (car != "\"") && (car != "*") && (car != "?") && (car != "<") && (car != ">") && (car != "|");
	if (bIsExplorer()) evt.returnValue = res;
	return res;
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function Fichier(evt)
{
	var car = GetCar(evt);
	var res = CheminFichier(evt) && (car != "\\") && (car != "/") && (car != ":");
	if (bIsExplorer()) evt.returnValue = res;
	return res;
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function Duree(evt,m)
{
	var car = GetCar(evt);
	return ValRet(evt,bIsDigit(car) || (car == "j") || (car == "h") || (car == "m") || (car == "s") || ((m.indexOf(car) >= 0) && (car != "+") && (car != "J") && (car != "H") && (car != "M") && (car != "S") && (car != "C")));
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function VCRE(evt,e,t)
{
	var ch=GetChp(evt);
	var c=GetCar(evt);
	if(t!=null) c=eval("c."+t+"()");
	var s=InserePos(ch.value,GetPositionCaretDetSel(ch),c);
	if(t!=null) s=eval("s."+t+"()");
	return ValRet(evt,RegExpOK(s,e));
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function initExpReg(evt,m,e)
{
	var ch=GetChp(evt);
	var r=new RegExp(e);
	var t=r.exec(ch.value);
	if(t==null)return;
	ch.value="";
	var j=1;
	while(j<t.length)ch.value+=t[j++];
	SelectAll(ch);
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function reinitExpReg(evt,m,e)
{
	var ch=GetChp(evt);
	var r=new RegExp(e);
	var t=r.exec(ch.value);
	if(t==null)return;
	var i=0;
	var j=1;
	while((j<t.length)&&((i=m.indexOf("%"))>=0)) m=remplacePos(m,i,t[j++]);
	ch.value=m;
}
