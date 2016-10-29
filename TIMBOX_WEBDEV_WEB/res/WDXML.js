//#12.00Aa WDXML.js
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

var TEXT_NODE = 3;
var CDATA_NODE = 4;
var PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = 8;

var XMLErreur = -1;
var xHTML = 1;
var XMLBalise = 1;
var XMLAttribut = 2;
var XMLElement = XMLBalise + XMLAttribut;
var XMLValeur = 4;
var XMLSousElement = 16;
var XMLNiveauCourant = 32;
var XMLContinue = 64;
var XMLExact = 1;
var XMLCommencePar = 2;
var XMLContient = 4;
var XMLIgnoreLaCasse = 16;
var XMLAvecNamespace = 32;
var XMLEncodageAucun = 1;
var XMLEncodageUTF8 = 2;
var XMLEncodageUTF16 = 3;
var XMLEncodageIso8859_1 = 6;
var XMLEncodageIso8859_2 = 7;
var XMLEncodageIso8859_3 = 8;
var XMLEncodageIso8859_4 = 9;
var XMLEncodageIso8859_5 = 10;
var XMLEncodageIso8859_6 = 11;
var XMLEncodageIso8859_7 = 12;
var XMLEncodageIso8859_8 = 13;
var XMLEncodageIso8859_9 = 14;
var XMLDocumentDefaut = 0;
var XMLPositionCourante = 1;
var XMLSansEntete = 2;

var XMLDebutNS = "xmlns";
var XMLDebutComment = "#";

var gTabDocXML = new Array();
var gTabConvTexteXML = new Array();
gTabConvTexteXML[gTabConvTexteXML.length] = new XMLConversionTexteXML("&","amp");
gTabConvTexteXML[gTabConvTexteXML.length] = new XMLConversionTexteXML("'","apos");
gTabConvTexteXML[gTabConvTexteXML.length] = new XMLConversionTexteXML(">","gt");
gTabConvTexteXML[gTabConvTexteXML.length] = new XMLConversionTexteXML("<","lt");
gTabConvTexteXML[gTabConvTexteXML.length] = new XMLConversionTexteXML("\"","quot");

function XMLConversionTexteXML(t,x)
{
	this.t = t;
	this.x = x;
}

function XMLInitRechDoc(pDoc)
{
	pDoc.Rech = false;
	pDoc.DebRech = null;
	pDoc.AttRech = XMLErreur;
	pDoc.ValRech = null;
	pDoc.OptRechNiv = XMLElement + XMLSousElement + XMLNiveauCourant;
	pDoc.OptRech = XMLExact;
	pDoc.Dehors = false;
}

function XMLInitDoc(pDoc,Nom,Doc,Vide)
{
	pDoc.Nom = Nom;
	pDoc.Doc = Doc;
	pDoc.Pos = Vide ? null : Doc.documentElement;
	pDoc.Att = XMLErreur;
	pDoc.Ent = null;
	XMLInitRechDoc(pDoc);
}

function clDocumentXML(Nom,Doc,Vide)
{
	XMLInitDoc(this,Nom,Doc,Vide);
}

function pclDocXML(Nom,Doc,Vide)
{
	for (var i = 0; i < gTabDocXML.length; i++) if (gTabDocXML[i].Nom == Nom) return ((!Doc) || ((gTabDocXML[i].Doc != null) && ((Vide) || (gTabDocXML[i].Pos != null)))) ? gTabDocXML[i] : null;
	return null;
}

function XMLAjoutDoc(Nom,Doc,Vide)
{
	var p = pclDocXML(Nom);
	if (p != null) XMLInitDoc(p,Nom,Doc,Vide);
	else gTabDocXML[gTabDocXML.length] = new clDocumentXML(Nom,Doc,Vide);
}

function bXMLChaineVide(s)
{
	return (s == null) || (s == "");
}

function XMLDocument(Nom,Code,Option,Elem)
{
	var d = null;
	var c = !bXMLChaineVide(Code);
	if (c && window.DOMParser)
	{
		var p = new DOMParser();
		if (p == null) return false;
		d = p.parseFromString(Code,"text/" + ((Option == xHTML) ? "html" : "xml"));
	}
	else if ((!c) && (document != null) && (document.implementation != null) && (document.implementation.createDocument != null)) d = document.implementation.createDocument(null,(Elem != null) ? Elem : null,null);
	else if (window.ActiveXObject != null)
	{
		d = new ActiveXObject("Microsoft.XMLDOM");
		if (d == null) return false;
		if (c)
		{
			d.loadXML(Code);
			if ((d.parseError != null) && (d.parseError.errorCode != 0)) return false;
		}
	}
	if (d == null) return false;
	XMLAjoutDoc(Nom,d,!c);
	if (c)
	{
		var e = Code.indexOf("<?");
		if (e == XMLErreur) return true;
		var s = "?>";
		var f = Code.indexOf(s,e);
		if (f == XMLErreur) return true;
		var p = pclDocXML(Nom);
		if (p == null) return false;
		p.Ent = Code.substring(e,f + s.length);
	}
	return true;
}

function sTexteXMLRemplace(s,c,r)
{
	var i = 0;
	while ((i < s.length) && ((i = s.indexOf(c,i)) != XMLErreur))
	{
		s = ((i > 0) ? s.substring(0,i) : "") + r + (((i + c.length) < s.length) ? s.substring(i + c.length,s.length) : "");
		i += r.length;
	}
	return s;
}

function sXMLEntite(s)
{
	return "&" + s + ";";
}

function TexteVersXML(s)
{
	for (var i = 0; i < gTabConvTexteXML.length; i++) s = sTexteXMLRemplace(s,gTabConvTexteXML[i].t,sXMLEntite(gTabConvTexteXML[i].x));
	return s;
}

function XMLVersTexte(s)
{
	for (var i = 0; i < gTabConvTexteXML.length; i++) s = sTexteXMLRemplace(s,sXMLEntite(gTabConvTexteXML[i].x),gTabConvTexteXML[i].t);
	return s;
}

function bXMLChaineCompare(s,r,m)
{
	if (!r) return true;
	if (m & XMLIgnoreLaCasse)
	{
		s = s.toUpperCase();
		r = r.toUpperCase();
	}
	if (m & XMLCommencePar) s = s.substring(0,r.length);
	return (m & XMLContient) ? (s.indexOf(r) != XMLErreur) : (s == r);
}

function bXMLAttributNS(a)
{
	return bXMLChaineCompare(a.name,XMLDebutNS,XMLIgnoreLaCasse + XMLCommencePar);
}

function nXMLAttribut(p,r,m)
{
	for (var i = 0; i < p.attributes.length; i++) if ((!bXMLAttributNS(p.attributes[i])) && bXMLChaineCompare(p.attributes[i].name,r,m)) return i;
	return XMLErreur;
}

function XMLAjouteAttribut(Nom,Att,Val,Pos)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	p.Pos.setAttribute(Att,TexteVersXML(Val));
	if (Pos)
	{
		var i = nXMLAttribut(p.Pos,Att);
		if (i != XMLErreur) p.Att = i;
	}
	return true;
}

function XMLAjouteFils(Nom,Elem,Val,Pos)
{
	var p = pclDocXML(Nom,true,true);
	if (p == null) return false;
	var e = p.Doc.createElement(Elem);
	if (e == null) return false;
	var t = null;
	if ((!bXMLChaineVide(Val)) && (((t = p.Doc.createTextNode(TexteVersXML(XMLVersTexte(Val)))) == null) || (e.appendChild(t) == null))) return false;
	if (p.Pos == null)
	{
		if (p.Doc.documentElement == null)
		{
			if (p.Doc.appendChild(e) == null) return false;
		}
		else
		{
			if (!XMLDocument(Nom,null,null,Elem)) return false;
			if ((t != null) && ((e = p.Doc.documentElement).appendChild(t) == null)) return false;
		}
	}
	else if (p.Pos.appendChild(e) == null) return false;
	if (Pos || (p.Pos == null))
	{
		p.Pos = e;
		p.Att = XMLErreur;
	}
	return true;
}

function XMLAnnuleRecherche(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return;
	XMLInitRechDoc(p);
}

function sXMLElemVersTxt(e,n)
{
	if (e.nodeType == TEXT_NODE) return e.nodeValue;
	if (e.nodeType == CDATA_NODE) return e.xml;
	var p = "";
	if (n > 0)
	{
//		p += "\n";
//		for (var i = 0; i < n; i++) p += "\t";
	}
	var s = p + "<" + e.nodeName;
	for (var i = 0; i < e.attributes.length; i++) s += " " + e.attributes[i].nodeName + "=\"" + e.attributes[i].nodeValue + "\"";
	var b = e.childNodes.length > 0;
	if (!b) s += "/";
	s += ">";
	if (b)
	{
		var f = false;
		for (var i = 0; i < e.childNodes.length; i++)
		{
			s += sXMLElemVersTxt(e.childNodes[i],n+1);
			f = f || (e.childNodes[i].nodeType != TEXT_NODE);
		}
//		if (f) s += (p == "") ? "\n" : p;
		s += "</" + e.nodeName + ">";
	}
	return s;
}

function XMLConstruitChaine(Nom,Option,Encod)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return "";
	return ((Option & XMLSansEntete) ? "" : (((p.Ent != null) ? p.Ent : "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>") + "\n")) + sXMLElemVersTxt((Option & XMLPositionCourante) ? p.Pos : p.Doc.documentElement,0) + "\n";
}

function nXMLDernier(t)
{
	return ((t!= null) ? t.length : 0) - 1;
}

function pXMLDernier(t)
{
	return ((t != null) && (t.length > 0)) ? t[nXMLDernier(t)] : null;
}

function XMLPositionneElement(p,e)
{
	p.Pos = e;
	p.Att = XMLErreur;
}

function pXMLParent(p)
{
	return (p.Att == XMLErreur) ? (((p.Pos.parentNode != null) && (p.Pos.parentNode.nodeType == XMLBalise)) ? p.Pos.parentNode : null) : p.Pos;
}

function nXMLIndiceAttribut(e,d,s)
{
	if (e.attributes == null) return XMLErreur;
	for (var i = d; s ? (i < e.attributes.length) : (i >= 0); s ? i++ : i--) if (!bXMLAttributNS(e.attributes[i])) return i;
	return XMLErreur;
}

function nXMLDernierAttribut(e)
{
	return (e != null) ? nXMLIndiceAttribut(e,nXMLDernier(e.attributes),false) : XMLErreur;
}

function bXMLDernierFils(p,e)
{
	var f = (e != null) ? pXMLDernier(e.childNodes) : null;
	if ((f != null) && (f.nodeType != TEXT_NODE))
	{
		XMLPositionneElement(p,f);
		return true;
	}
	return (p.Att = nXMLDernierAttribut(e)) >= 0;
}

function XMLDernier(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	bXMLDernierFils(p,pXMLParent(p));
	XMLInitRechDoc(p);
	return true;
}

function pXMLCourant(p,a,m)
{
	if (p.Att != XMLErreur) return (a == null) ? p.Pos.attributes[p.Att] : null;
	if (a == null) return p.Pos;
	var i = nXMLAttribut(p.Pos,a,m);
	return (i != XMLErreur) ? p.Pos.attributes[i] : null;
}

function XMLDonnee(Nom,Att,Mod)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return "";
	var e = pXMLCourant(p,Att,Mod);
	var a = (p.Att != XMLErreur) || (Att != null);
	return ((e != null) && (a || ((e.firstChild != null) && (e.firstChild.nodeType == TEXT_NODE)))) ? (a ? e : e.firstChild).nodeValue : "";
}

function XMLEnDehors(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return true;
	return p.Dehors;
}

function bXMLPosElemFils(p,e)
{
	if (e == null) return false;
	var b = false;
	for (var i = 0; (!b) && (i < e.childNodes.length); i++) if ((b = (e.childNodes[i].nodeType != TEXT_NODE)) == true) XMLPositionneElement(p,e.childNodes[i]);
	return b;
}

function nXMLPremierAttribut(e)
{
	return (e != null) ? nXMLIndiceAttribut(e,0,true) : XMLErreur;
}

function bXMLFils(p)
{
	var b = false;
	if (p.Att == XMLErreur)
	{
		var n = nXMLPremierAttribut(p.Pos);
		if (n != XMLErreur)
		{
			p.Att = n;
			b = true;
		}
		else b = bXMLPosElemFils(p,p.Pos);
	}
	return b;
}

function XMLFils(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	var b = bXMLFils(p);
	XMLInitRechDoc(p);
	return b;
}

function XMLNomElement(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return "";
	var c = pXMLCourant(p);
	return c.nodeName.substring(((c.nodeType == COMMENT_NODE) && bXMLChaineCompare(c.nodeName,XMLDebutComment,XMLIgnoreLaCasse + XMLCommencePar)) ? XMLDebutComment.length : 0,c.nodeName.length);
}

function XMLNomParent(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return "";
	var e = pXMLParent(p);
	return (e != null) ? e.nodeName : "";
}

function XMLParent(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	var e = pXMLParent(p);
	if (e != null) XMLPositionneElement(p,e);
	XMLInitRechDoc(p);
	return (e != null);
}

function bXMLElemPrec(p)
{
	return (p.previousSibling != null) && (p.previousSibling.nodeType != TEXT_NODE) && (p.previousSibling.nodeType != PROCESSING_INSTRUCTION_NODE);
}

function bXMLDansFilsRech(p,b)
{
	var e = b ? p.Pos : p.Pos.parentNode;
	while ((e != null) && (e.parentNode != p.DebRech)) e = e.parentNode;
	return e != null;
}

function bXMLRechercheOK(p)
{
	if (p.ValRech == null) return true;
	var b = false;
	if (p.Att != XMLErreur)
	{
		if (p.OptRechNiv & XMLAttribut) b = bXMLChaineCompare(p.Pos.attributes[p.Att].nodeName,p.ValRech,p.OptRech);
		if ((!b) && (p.OptRechNiv & XMLValeur)) b = bXMLChaineCompare(p.Pos.attributes[p.Att].nodeValue,p.ValRech,p.OptRech);
	}
	else
	{
		if (p.OptRechNiv & XMLBalise) b = bXMLChaineCompare(p.Pos.nodeName,p.ValRech,p.OptRech);
		if ((!b) && (p.OptRechNiv & XMLValeur) && (p.Pos.firstChild != null) && (p.Pos.firstChild.nodeType == TEXT_NODE)) b = bXMLChaineCompare(p.Pos.firstChild.nodeValue,p.ValRech,p.OptRech);
	}
	return b;
}

function bXMLRetourSiEchec(p,b,e,a)
{
	if (!b)
	{
		p.Pos = e;
		p.Att = a;
		p.Dehors = true;
	}
	return b;
}

function XMLPrecedent(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	p.Dehors = false;
	var e = p.Pos;
	var a = p.Att;
	var b = false;
	while (!b)
	{
		if (p.Rech && (p.OptRechNiv & XMLSousElement) && (p.Att == XMLErreur))
		{
			b = bXMLDernierFils(p,p.Pos);
		}
		if ((!b) && ((!p.Rech) || ((p.OptRechNiv & XMLNiveauCourant) || (pXMLParent(p) != p.DebRech.parentNode))))
		{
			if ((p.Att != XMLErreur) && ((!p.Rech) || (p.OptRechNiv & (XMLAttribut | XMLValeur))))
			{
				var n = nXMLIndiceAttribut(p.Pos,p.Att - 1,false);
				if (n != XMLErreur)
				{
					p.Att = n;
					b = true;
				}
			}
			else if (!bXMLElemPrec(p.Pos))
			{
				var n = nXMLDernierAttribut(p.Pos.parentNode);
				if ((p.Pos.parentNode != null) && (n != XMLErreur))
				{
					p.Pos = p.Pos.parentNode;
					p.Att = n;
					b = true;
				}
			}
			else
			{
				XMLPositionneElement(p,p.Pos.previousSibling);
				b = true;
			}
		}
		if ((!b) && p.Rech)
		{
			var q = null;
			while ((!b) && ((q = pXMLParent(p)) != null) && ((p.OptRechNiv & XMLContinue) || ((((p.Att == XMLErreur) ? q : q.parentNode) == p.DebRech) && (p.OptRechNiv & XMLNiveauCourant)) || bXMLDansFilsRech(p,bXMLElemPrec(q)))) XMLPositionneElement(p,(b = bXMLElemPrec(q)) ? q.previousSibling : q);
		}
		if (!b) break;
		b = bXMLRechercheOK(p);
	}
	return bXMLRetourSiEchec(p,b,e,a);
}

function XMLPremier(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	var e = pXMLParent(p);
	var n = nXMLPremierAttribut(e);
	if ((e != null) && (n != XMLErreur))
	{
		p.Pos = e;
		p.Att = n;
	}
	else bXMLPosElemFils(p,e);
	XMLInitRechDoc(p);
	return true;
}

function XMLRacine(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	XMLPositionneElement(p,p.Doc.documentElement);
	XMLInitRechDoc(p);
	return true;
}

function XMLRecherche(Nom,Valeur,Parcours,Option)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	p.Rech = true;
	p.DebRech = p.Pos;
	p.AttRech = p.Att;
	p.ValRech = Valeur;
	p.OptRechNiv = ((Parcours != null) ? Parcours : 0) + ((!(Parcours & (XMLElement + XMLValeur))) ? XMLElement : 0) + ((!(Parcours & (XMLNiveauCourant + XMLSousElement + XMLContinue))) ? (XMLNiveauCourant + XMLSousElement) : 0);
	p.OptRech = (Option != null) ? Option : XMLExact;
	p.Dehors = false;
	return XMLSuivant(Nom);
}

function XMLSuivant(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return false;
	p.Dehors = false;
	var e = p.Pos;
	var a = p.Att;
	var b = false;
	while (!b)
	{
		if (p.Rech && (p.OptRechNiv & XMLSousElement) && (p.Att == XMLErreur))
		{
			b = (p.OptRechNiv & XMLAttribut) ? bXMLFils(p) : bXMLPosElemFils(p,p.Pos);
		}
		if ((!b) && ((!p.Rech) || ((p.OptRechNiv & XMLNiveauCourant) || (pXMLParent(p) != p.DebRech.parentNode))))
		{
			if ((p.Att != XMLErreur) && ((!p.Rech) || (p.OptRechNiv & (XMLAttribut | XMLValeur))))
			{
				var n = nXMLIndiceAttribut(p.Pos,p.Att + 1,true);
				if (n == XMLErreur) b = bXMLPosElemFils(p,p.Pos);
				else
				{
					p.Att = n;
					b = true;
				}
			}
			else if (p.Pos.nextSibling != null)
			{
				XMLPositionneElement(p,p.Pos.nextSibling);
				b = true;
			}
		}
		if ((!b) && p.Rech)
		{
			var q = null;
			while ((!b) && ((q = pXMLParent(p)) != null) && ((p.OptRechNiv & XMLContinue) || ((((p.Att == XMLErreur) ? q : q.parentNode) == p.DebRech) && (p.OptRechNiv & XMLNiveauCourant)) || bXMLDansFilsRech(p,q.nextSibling != null))) XMLPositionneElement(p,(b = (q.nextSibling != null)) ? q.nextSibling : q);
		}
		if (!b) break;
		b = bXMLRechercheOK(p);
	}
	return bXMLRetourSiEchec(p,b,e,a);
}

function XMLTermine(Nom)
{
	var p = pclDocXML(Nom,true,true);
	if (p == null) return false;
	p.Doc = p.Pos = p.DebRech = null;
	return true;
}

function XMLTrouve(Nom)
{
	return !XMLEnDehors(Nom)
}

function XMLTypeElement(Nom)
{
	var p = pclDocXML(Nom,true);
	if (p == null) return XMLErreur;
	return (p.Att != XMLErreur) ? XMLAttribut : XMLBalise;
}
