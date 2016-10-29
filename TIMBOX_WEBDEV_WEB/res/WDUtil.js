//#15.00Aa WDUtil.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Attention a ne pas mettre d'accent dans ce fichier COMMENTAIRES inclus

// Detection du navigateur

var bIE = navigator.appName.indexOf("Microsoft") != -1;
var bIE7 = false;
var bIE8 = false;
var bIE9 = false;
var bIEQuirks = false;
// On fait un cas particulier pour IE7
if (bIE)
{
	// Cas particulier de Opera qui s'annonce par defaut comme IE
	if (navigator.userAgent.indexOf("Opera") == -1)
	{
		var oExpr = new RegExp("MSIE (\\d)+[\\.\\d]*");
		var oRes = oExpr.exec(navigator.userAgent);
		if (oRes && oRes[1])
		{
			var nVersionIE = parseInt(oRes[1]);
			// Si la verison de IE est IE8 => on defini AUSSI bIE7
			if (nVersionIE >= 7)
			{
				bIE7 = true;
			}
			if (nVersionIE >= 8)
			{
				bIE8 = true;
			}
			if (nVersionIE >= 9)
			{
				bIE9 = true;
			}
		}
		// Detecte le "quirks mode"
		bIEQuirks = (document.compatMode == "BackCompat");
	}
	else
	{
		bIE = false;
	}
};
// Detection de gecko pour avoir les autres browser ?
var bFF = (navigator.userAgent.toLowerCase().indexOf('firefox/') != -1);
if (bFF)
{
	var oExpr = new RegExp("Fire[Ff]ox/\\s*(\\d+)\\.*(\\d+)");
	var oRes = oExpr.exec(navigator.userAgent);
	var bFF35 = (oRes && oRes[1] && (((parseInt(oRes[1]) >= 3) && oRes[2] && (parseInt(oRes[2]) >= 5)) || (parseInt(oRes[1]) >= 4)));
	oRes = null;
	oExpr = null;
}
var bCrm = (navigator.userAgent.toLowerCase().indexOf('chrome') != -1);
var bSfr = (navigator.userAgent.toLowerCase().indexOf('safari') != -1) && (!bCrm);
var bMac = (navigator.platform.indexOf('Mac') != -1);
var bWK = bCrm || bSfr;

// Sens de lecture
var bRTL = bIE ? (document.dir == "rtl") : (document.documentElement.dir == "rtl");
function GetStyleLeft(oStyle) { return bRTL ? oStyle.right : oStyle.left; };
function SetStyleLeft(oStyle, nVal, nOffset) { if (bRTL) { oStyle.right = (nVal - nOffset) + 'px'; } else { oStyle.left = (nVal + nOffset) + 'px'; } };

// .style.display des TR/TD
var sDisplayBlockTABLE = bIE && (!bIE8 || bIEQuirks) ? 'block' : 'table';
var sDisplayBlockTD = bIE && (!bIE8 || bIEQuirks) ? 'block' : 'table-cell';
var sDisplayBlockTR = bIE && (!bIE8 || bIEQuirks) ? 'block' : 'table-row';

function sGetDisplayBlock (oBalise)
{
	switch (oBalise.tagName.toLowerCase())
	{
	case "table": return sDisplayBlockTABLE;
	case "tr": return sDisplayBlockTR;
	case "td": return sDisplayBlockTD;
	default: return 'block';
	}
};
function SetDisplay(oBalise, bAffiche)
{
	if (oBalise && oBalise.style)
	{
		oBalise.style.display = bAffiche ? sGetDisplayBlock(oBalise) : 'none';
	}
};

// Emulation de getElementById (IE4 et IE pocket)
var oGetId = null;
if (document.getElementById)
{
	oGetId = function(sNomChamp) { return document.getElementById(sNomChamp); };
}
else if (document.all)
{
	oGetId = function(sNomChamp) { return document.all(sNomChamp); };
}
else
{
	oGetId = function(sNomChamp) { return null; };
};

// Stop la propagation des evenements
var bStopPropagation = null;
if (bIE)
{
	bStopPropagation = function (oEvent) { oEvent.returnValue = false; return false; };
}
else
{
	bStopPropagation = function (oEvent) { if (oEvent.preventDefault) { oEvent.preventDefault(); } return false; };
};

// Attache une fonction a un evenement
function HookOnXXX (oCible, sEventIE, sEventFF, fFonction, bCapture)
{
	if (oCible.addEventListener)
	{
		oCible.addEventListener(sEventFF, fFonction, bCapture ? true : false);
	}
	else if (oCible.attachEvent)
	{
		oCible.attachEvent(sEventIE, fFonction);
	}
	else
	{
		// Cas d'un objet sorti du DOM dans opera : ne fait rien
	}
};

// Detache une fonction d'un evenement
function UnhookOnXXX(oCible, sEventIE, sEventFF, fFonction, bCapture)
{
	if (oCible.removeEventListener)
	{
		oCible.removeEventListener(sEventFF, fFonction, bCapture ? true : false);
	}
	else if (oCible.detachEvent)
	{
		oCible.detachEvent(sEventIE, fFonction);
	}
	else
	{
		// Cas d'un objet sorti du DOM dans opera : ne fait rien
	}
};

// Indique si un element est fils d'un autre
function bEstFils (oElement, oParent, oDocument)
{
	while (oElement && oElement != oDocument.body)
	{
		if (oElement == oParent)
		{
			return true;
		}
		oElement = oElement.parentNode;
	}
	return false;
};

// Supprime tous les fils d'un elements
function SupprimeFils (oElement)
{
	var tabChildNodes = oElement.childNodes;
	while (tabChildNodes.length > 0)
	{
		oElement.removeChild(tabChildNodes[0]);
	}
};

// Construit les parametres d'une fonction serveur appelee
// nNbParamIgnore contient le nombre de parametres a ignorer dans tabParamOriginaux
function sConstuitProcedureParams (nNbParamIgnore, tabParamsOriginaux)
{
	var i;
	var nLimiteI = tabParamsOriginaux.length;
	// + Car on laisse le premier indice vide donc comme ca on a automatiquement le "&" initial
	var tabParams = new Array(nLimiteI - nNbParamIgnore + 1);
	tabParams[0] = "";
	for (i = nNbParamIgnore; i < nLimiteI; i++)
	{
		var nIndiceReel = i - nNbParamIgnore + 1;
		// Si l'arguement est un booleen alors on envoi 0/1 pour faux/vrai
		// Car le cast en chaine du false/true du JS donne "false"/"true", ce que le serveur ne sait pas bien convertir en boolen
		var oParam = tabParamsOriginaux[i];
		tabParams[nIndiceReel] = "PA" + (i - nNbParamIgnore + 1) + "=" + ((oParam === true) ? "1" : ((oParam === false) ? "0" : clWDEncode.sEncodePOST(oParam + "")));
	}
	return tabParams.join("&");
};

// Recupere l'action depuis le location
function _sGetPageActionDepuisLocation (sAction)
{
	// On prend l'URL si on n'a pas d'action
	sAction = location.href + sAction;
	// On vire l'ancre
	var nAncreTaille = location.hash.length;
	if (nAncreTaille > 0)
	{
		var nAncrePos = sAction.indexOf(location.hash);
		sAction = sAction.substr(0, nAncrePos) + sAction.substr(nAncrePos + nAncreTaille);
	}
	return sAction;
}

// Recupere l'action d'une page
// oPage : formulaire a utiliser (null possible)
// bParamSuppr : indique s'il faut supprimer les parametres de l'URL
// bIDSession : Indique s'il faut ajouter l'ID de session
// bPourRepRes : Indique que la reference est avec le repertoire res et qu'il faut eviter les chemin relatifs
function sGetPageAction (oPage, bParamSuppr, bIDSession, bPourRepRes)
{
	// Trouve la page si besoin
	if (!oPage)
	{
		oPage = _PAGE_;
	}

	// Calcule l'URL
	var sAction = (oPage.action.length > 0) ? oPage.action : "";
	if ((sAction.length == 0) || (sAction.charAt(0) == "?"))
	{
		// Si l'action se retourve deja dans l'URL de la page, on ne la double pas
		if (-1 != location.href.indexOf(sAction))
		{
			sAction = _sGetPageActionDepuisLocation("");
		}
		else
		{
			sAction = _sGetPageActionDepuisLocation(sAction);
		}
	}
	// Implicitement on a sAction > 0 (testé dans le premier if)
	else if (bIE8 && !bIEQuirks)
	{
		// En mode non quirks, IE retourne une addresse absolue pour FORM.action
		// Sauf que dans une page AWP l'action est vide. IE complete quand même et retourne donc le chemin de la page
		// Evidement ce n'est pas une action valide au final
		var sActionAttribut = _PAGE_.getAttributeNode("action").value;
		if ((0 == sActionAttribut.length) || ("?" == sActionAttribut.charAt(0)))
		{
			sAction = _sGetPageActionDepuisLocation(sActionAttribut);
		}
	}

	if (bPourRepRes && (sAction.indexOf('/') == -1) && (sAction.length > 0))
	{
		sAction = "../" + sAction;
	}

	// Vire les parametres
	if (bParamSuppr && (sAction.indexOf("?") != -1))
	{
		sAction = sAction.substr(0, sAction.indexOf("?"));
	}

	// Ajoute l'ID de session si besoin
	if (bIDSession && (sAction.indexOf("AWPID=") == -1) && (window["_AWPID_A_"] !== undefined))
	{
		// Ajoute le separateur et la session
		sAction += ((sAction.indexOf("?") != -1) ? _AWPID_A_ : _AWPID_P_);
	}
	// Renvoie la valeur
	return sAction;
};

// Encodage des valeurs

function WDEncode (bUTF8)
{
	// On aura besoin de transforme les chaines recus pour gerer les caratere interdit en ISO-8859-1 si besoin
	// Pas besoin de le faire en UTF-8 car il on deja ete encode pour avoir au final la bonne valeur unicode
	if (bUTF8 === undefined)
	{
		bUTF8 = ((document.charset ? document.charset : (document.characterSet ? document.characterSet : "iso-8859-1")).toLowerCase() != "iso-8859-1");
	}

	if (!bUTF8)
	{
		// On defini notre fonction d'encodage des parametres
		this.sEncodePOST = WDEncode.prototype.sEncodePOST_CP1252;

		// Et d'ecriture de valeur dans le HTML
		this.sEncodeCharset = WDEncode.prototype.sEncodeCharset_CP1252;
	}
	else
	{
		// Le fonctionnement par defaut des fonctions est OK
	}
};

// Fonctionnement par defaut des fonctions d'encodage : pour les pages UTF8
// Encodage pour l'ecriture dans le POST : simple echapement
WDEncode.prototype.sEncodePOST = function sEncodePOST(sValeur)
{
	return encodeURIComponent(sValeur);
};

// Encodage pour l'ecriture dans la page : ne fait rien
WDEncode.prototype.sEncodeCharset = function sEncodeCharset(sValeur)
{
	return sValeur;
};

// Version pour les pages non UTF8 (CP1252) des fonctions d'encodage
// Encodage pour l'ecriture dans le POST : remplacement de tous les carateres unicodes par leur valeur CP1252 si possible
WDEncode.prototype.sEncodePOST_CP1252 = function sEncodePOST_CP1252(sValeur)
{
	// Traite les carateres unicodes
	sValeur = sValeur.replace(/[\u0100-\uFFFF]/g, function(sCar) { var n = sCar.charCodeAt(0); var i; var nLimiteI = WDEncode.prototype.tabConvCP1252.length; for(i = 0; i < nLimiteI; i++) { if(WDEncode.prototype.tabConvCP1252[i] == n) { return String.fromCharCode(i + 128); } } return sCar; } );
	// Escape le tout
	sValeur = escape(sValeur);
	// Et remplace le + car il represente l'encodage de l'espace
	return sValeur.replace(/\+/g, "%2B");
};

// Encodage pour l'ecriture dans la page : remplace les carateres qui ne sont pas dans l'alphabet par leur valeur UNICODE
WDEncode.prototype.sEncodeCharset_CP1252 = function sEncodeCharset_CP1252(sValeur, bHTML)
{
	// Le jeu de caratere de windows est CP1252. Qui est un surensemble de ISO-8859-1
	// Il faut convertir tous les carateres entre 0x80 et 0x9F en leur version unicode

	// Puis les caractere de la plage
	// 128 = 0x80
	sValeur = sValeur.replace(/[\x80-\x9F]/g, function(sCar) { return String.fromCharCode(WDEncode.prototype.tabConvCP1252[sCar.charCodeAt(0) - 128]); } );

	if (bHTML)
	{
		// Les caracteres restant (0xA0-0xFF) sont encode normalement en HTML
		sValeur = sValeur.replace(/[\xA0-\xFF]/g, function(sCar) { return "&#" + sCar.charCodeAt(0) + ";"; } );
	}

	// Renvoi de la valeur convertie
	return sValeur;
};

// Le tableau pour la conversion depuis CP1252
//										128		129?	130		131		132		133		134		135		136		137		138		139		140		141?	142		143?	144?	145		146		147		148		149		150		151		152		153		154		155		156		157?	158		159
//										0x80	0x81	0x82	0x83	0x84	0x85	0x86	0x87	0x88	0x89	0x8A	0x8B	0x8C	0x8D	0x8E	0x8F	0x90	0x91	0x92	0x93	0x94	0x95	0x96	0x97	0x98	0x99	0x9A	0x9B	0x9C	0x9D	0x9E	0x9F
WDEncode.prototype.tabConvCP1252 = [	8364,	129,	8218,	402,	8222,	8230,	8224,	8225,	710,	8240,	352,	8249,	338,	141,	381,	143,	144,	8216,	8217,	8220,	8221,	8226,	8211,	8212,	732,	8482,	353,	8250,	339,	157,	382,	376	],

// Fonction de reencodage en HTML
WDEncode.prototype.sEncodeInnerHTML = function sEncodeInnerHTML(sValeur, bRemplaceBR, bPasEncodeBalise, bSansHTMLDansEncodeCharset)
{
	// Remplace le minimum de caracteres
	if (!bPasEncodeBalise)
	{
		sValeur = sValeur.replace(/&/g, "&amp;");
		sValeur = sValeur.replace(/</g, "&lt;");
		sValeur = sValeur.replace(/>/g, "&gt;");
//		sValeur = sValeur.replace(/\'/g, "&apos;");
//		sValeur = sValeur.replace(/\"/g, "&quot;");
	}

	// Si le charset de la page est Latin1 (Donc pas en UTF-8)
	// => On transforme les caractere de CP1252 en leur equivalent unicode qui va fonctionner
	// => On encode les autres caracteres > 127
	// Appele le pointeru qui pointe deja sur la bonne fonction
	sValeur = this.sEncodeCharset(sValeur, bSansHTMLDansEncodeCharset ? false : true);

	if (bRemplaceBR)
	{
		// Met des balises BR pour les marques de lignes
		sValeur = sValeur.replace(/\r\n/g, "<br />");
		sValeur = sValeur.replace(/\n/g, "<br />");
	}

	// Renvoi de la valeur
	return sValeur;
};

// Instancie un objet principal
var clWDEncode = new WDEncode(_bUTF8_);


// Gestion des elements popup de la page
function WDPopupAutomatique (oObjetParent)
{
	// Memorise les parametres
	this.m_oObjetParent = oObjetParent;

	var oThis = this;
	// Cree la methode de hook dans la classe
	if (bIE)
	{
		this.m_fOnFocus = function() { return oThis.OnFocus(event); };
		this.m_fOnBlur = function() { return oThis.OnBlur(event); };
	}
	else
	{
		this.m_fOnFocus = function(event) { return oThis.OnFocus(event); };
		this.m_fOnBlur = function(event) { return oThis.OnBlur(event); };
	}
};

WDPopupAutomatique.prototype =
{
//	m_oElement:				null,
//	m_oObjetParent:			null,
//	m_fOnFocus:				null,
//	m_fOnBlur:				null,
//	m_nTimeoutFocus:		null,
//	m_fTimeout:				null,

	// Affiche le champ
	Affiche:function (oEvent, oElement, oParam)
	{
		// Si on a 'deja' un element, masque l'element precedent
		if (this.m_oElement)
		{
			this.Masque(oEvent, true);
		}
		// Memorise que l'on a un element
		this.m_oElement = oElement;

		// Efface le timeout existant si besoin
		this.__ClearTimeout();

		// Hook les onfocus/onblur des elements
		this.__HookOnFocusBlurRecursif(oElement);

		// Appel le champ hote
		this.m_oObjetParent.AfficheInterne(oEvent, oElement, oParam);

		// Affiche l'element
		SetDisplay(this.m_oElement, true);

		// Donne le focus au premier champ APRES l'affichage
		try
		{
			this.m_oElement.getElementsByTagName("A")[0].focus();
		}
		catch (e)
		{
		}
	},

	// Notification de que champ doit etre masquer
	Masque:function (oEvent, bLostFocus)
	{
		// Efface le timeout existant si besoin
		this.__ClearTimeout();

		// Seulement si l'element existe (il peut ne pas existe si la popup n'a pas ete affichee
		if (this.m_oElement)
		{
			this.__UnhookOnFocusBlurRecursif(this.m_oElement);

			// Masque le champ
			SetDisplay(this.m_oElement, false);
		}

		// Appel le champ hote
		this.m_oObjetParent.MasqueInterne(oEvent, bLostFocus);

		// Supprime l'element
		delete this.m_oElement;
	},

	// Hook les onfocus/onblur des liens
	__HookOnFocusBlurRecursif:function (oElement)
	{
		// Hook l'element uniquement s'il peut recevoir le focus
		if (oElement.focus)
		{
			HookOnXXX(oElement, 'onfocus', 'focus', this.m_fOnFocus);
			HookOnXXX(oElement, 'onblur', 'blur', this.m_fOnBlur);
		}

		// Et ses fils qui ne sont pas du texte simple
		var oFils = oElement.firstChild;
		while (oFils)
		{
			if (oFils.nodeName != "#text")
			{
				this.__HookOnFocusBlurRecursif(oFils);
			}
			oFils = oFils.nextSibling;
		}
	},

	// Supprime les hooks
	__UnhookOnFocusBlurRecursif:function (oElement)
	{
		// Unhook l'element uniquement s'il peut recevoir le focus
		if (oElement.focus)
		{
			UnhookOnXXX(oElement, 'onfocus', 'focus', this.m_fOnFocus);
			UnhookOnXXX(oElement, 'onblur', 'blur', this.m_fOnBlur);
		}

		// Et ses fils qui ne sont pas du texte simple
		var oFils = oElement.firstChild;
		while (oFils)
		{
			if (oFils.nodeName != "#text")
			{
				this.__UnhookOnFocusBlurRecursif(oFils);
			}
			oFils = oFils.nextSibling;
		}
	},

	// Evenement avant l'affectation en AJAX du contenu du calendrier
	PreAffecteHTML:function (bDepuisAJAX)
	{
		// Si le champ est affiche : supprime les hooks
		if (this.m_oElement && (this.m_oElement.style.display == sGetDisplayBlock(this.m_oElement)))
		{
			this.__UnhookOnFocusBlurRecursif(this.m_oElement);
		}
	},

	// Evenement apres l'affectation en AJAX du contenu du calendrier
	PostAffecteHTML:function (bDepuisAJAX)
	{
		// Si le champ est affiche : restaure les hooks
		if (this.m_oElement && (this.m_oElement.style.display == sGetDisplayBlock(this.m_oElement)))
		{
			this.__HookOnFocusBlurRecursif(this.m_oElement);
		}
		// Donne le focus au premier champ
		try
		{
			this.m_oElement.getElementsByTagName("A")[0].focus();
		}
		catch (e)
		{
		}
	},

	// Notification qu'un lien a pris le focus.
	OnFocus:function (oEvent)
	{
		// Efface le timeout existant si besoin
		this.__ClearTimeout();
	},

	// Notification que le champ a perdu le focus.
	// Il faut tester si le focus est parti dans un autre champ du calendrier ou a l'exterieur
	OnBlur:function (oEvent)
	{
		// On veut detecter les pertes de focus du calendrier
		// Sauf que la perte de focus d'un lien peut donner le focus a un autre lien du calendrier
		// => On fait un timeout de 1ms qui sera annule par le onfocus de l'autre lien si besoin
		if (!this.m_nTimeoutFocus)
		{
			// Cree une fonction qui appele la fonction de masquage
			var oThis = this;
			this.m_fTimeout = function(oEvent) { oThis.Masque(oEvent, true); };
			// Cree la fonction de visibilite globale
			fTimeout = this.m_fTimeout;
			// Un timeout de 1ms est trop faible pour Chrome
			// Il faut une valeur vraiment importante pour les versions recente de Chrome (il y a alors quand meme un leger lag visuel) et aussi pour safari
			var nDuree = (bWK) ? 200 : 1;
			this.m_nTimeoutFocus = setTimeout("fTimeout(undefined);", nDuree);
		}
	},

	// Efface le timeout existant si besoin
	__ClearTimeout:function ()
	{
		// Supprime le timeout actif
		if (this.m_nTimeoutFocus)
		{
			// Invalide le timeout aupres du systeme
			clearTimeout(this.m_nTimeoutFocus);

			// Supprime la fonction cree (globale et la reference locale)
			fTimeout = null;
			delete this.m_fTimeout;

			// Supprime le membre
			delete this.m_nTimeoutFocus;
		}
	}
};
