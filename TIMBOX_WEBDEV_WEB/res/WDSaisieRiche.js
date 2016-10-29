//#12.00Aa WDSaisieRiche.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Le champ contient plusieurs elements :
// Role									ID			Membre
// - Un INPUT type="hidden"				ALIAS		m_oValeur
// - Un DIV/TD/Autres hote racine		ALIAS_HTE	m_oHote
//	- (IE)Un DIV editable				ALIAS_EDT	m_oData		Construit dynamiquement
//	- (FF/Autres)IFrame					ALIAS_EDT				Construit dynamiquement
//		- BODY editable								m_oData		Construit dynamiquement

// Manipulation d'un bouton On/Off du champ de saisie
function WDBarreBoutonOnOffRiche (oObjetParent, oBouton, sCommande, sStyle, tabStyleValeur)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		// Appel le constructeur de la classe de base
		WDBarreBoutonOnOff.prototype.constructor.apply(this, [oObjetParent, oBouton, "ExecuteCommande", [sCommande, false, null]]);

		// Sauve les parametres specifiques
		this.m_sStyle = sStyle;
		// Valeurs que l'on recherche ou que l'on evite dans le style
		// Chaque valeur est un couple : valeur (sVal, bTst)
		// Si le booleen est a vrai on recherche style == this.m_sStyleValeur, a faux on recherche !=
		this.m_tabStyleValeur = tabStyleValeur;
	}
};

// Declare l'heritage
WDBarreBoutonOnOffRiche.prototype = new WDBarreBoutonOnOff();
// Surcharge le constructeur qui a ete efface
WDBarreBoutonOnOffRiche.prototype.constructor = WDBarreBoutonOnOffRiche;

// Declare les fonction une par une

// Execute la commande : methode definie dans les classes derivees
WDBarreBoutonOnOffRiche.prototype.ExecuteCommande = function(oEvent)
{
	// Sauve le range courant
	var oDataEtat = this.m_oObjetParent.oGetParamEtat(oEvent, false);
	// Il ne faut pas forcer sur les commandes a effet immediat
	if (oDataEtat[0] && (this.m_sStyle != "textAlign"))
	{

		// Efface un ancien etat
		if (this.m_oRange)
		{
			delete this.m_oRange;
			delete this.m_bForceActif;
		}

		// Inverse l'etat
		switch (this.nGetEtatSpecifique(oEvent, this.ms_nEtatNormal, oDataEtat))
		{
		case this.ms_nEtatNormal:
			this.m_bForceActif = true;
			break;
		case this.ms_nEtatActif:
			this.m_bForceActif = false;
			break;
		}

		this.m_oRange = oDataEtat[0];
	}

	// Execute la commande
	WDBarreBoutonOnOff.prototype.ExecuteCommande.apply(this, arguments);
};

// Si on doit manipuler l'etat surcharge

// Applique ensuite l'etat d'activation
WDBarreBoutonOnOffRiche.prototype.bActif = function (oEvent, oDataEtat)
{
	// Si on a un range memorise et que la selection est identique : retourne la valeur
	if (this.m_oRange)
	{
		try
		{
			if (this.m_oObjetParent.bCompareRange(this.m_oRange, oDataEtat[0]))
			{
				return this.m_bForceActif;
			}
		}
		catch (e)
		{
		}
		// La selection a change
		delete this.m_oRange;
		delete this.m_bForceActif;
	}

	if (oDataEtat[2] && this.m_sStyle.length)
	{
		switch (this.m_oParamCommande[0])
		{
		case "italic":
			// Le style italique utilise la balise EM qui ne change pas le style
			// => Cas particulier
			if (this.__bStyleMatchRecursif(oDataEtat[1], "EM") != false)
			{
				return true;
			}
			break;
		case "underline":
			// Le souligne et le barre se partage le meme style et cascadent mais sans que cela se voit dans le style
			// Teste le style local et le style des parents
			if (this.__bStyleMatchRecursif(oDataEtat[1], "U") != false)
			{
				return true;
			}
			break;
		case "strikeThrough":
			if (this.__bStyleMatchRecursif(oDataEtat[1], "STRIKE") != false)
			{
				return true;
			}
			break;
		case "bold":
			// Pour chrome qui retourne "normal" au lieu de "400" : cas particulier
			if (oDataEtat[2][this.m_sStyle] == "normal")
			{
				return false;
			}
			// Pas de break
		default:
			if (this.__bStyleMatch(oDataEtat[2][this.m_sStyle]))
			{
				return true;
			}
			break;
		}
	}
	// L'etat n'est pas actif
	return false;
};

// Verifie si l'element matche le style en pronfondeur
WDBarreBoutonOnOffRiche.prototype.__bStyleMatchRecursif = function(oElement, sBalise)
{
	// Teste le style local et le style des parents
	while (oElement && (oElement != this.m_oObjetParent.m_oData))
	{
		// Si le style match ou que l'on a une balise specifique
		if ((this.__bStyleMatch(_JGCS(oElement)[this.m_sStyle])) || (oElement.tagName && (oElement.tagName.toUpperCase() == sBalise)))
		{
			return true;
		}
		oElement = oElement.parentNode;
	}
	return false;
};

// Verifie si l'element matche le style
WDBarreBoutonOnOffRiche.prototype.__bStyleMatch = function(sValeur)
{
	var i;
	var nLimiteI = this.m_tabStyleValeur.length;
	for (i = 0; i < nLimiteI; i++)
	{
		var oTest = this.m_tabStyleValeur[i];
		// Comme this.m_tabStyleValeur est une reference sur un tableau inline, on semble lister aussi la propriete .length que l'on ne veux pas
		if (oTest)
		{
			if (oTest.bTst)
			{
				if (sValeur == oTest.sVal)
				{
					return true;
				}
			}
			else
			{
				if (sValeur != oTest.sVal)
				{
					return true;
				}
			}
		}
	}
	return false;
};

// Manipulation d'un bouton dropdown du champ de saisie
function WDBarreBoutonPopupRiche (oObjetParent, oBouton, sCommande, oPopup)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		// Appel le constructeur de la classe de base
		WDBarreBoutonPopup.prototype.constructor.apply(this, [oObjetParent, oBouton, "ExecuteCommande", [sCommande, false, null], oPopup]);
	}
};

// Declare l'heritage
WDBarreBoutonPopupRiche.prototype = new WDBarreBoutonPopup();
// Surcharge le constructeur qui a ete efface
WDBarreBoutonPopupRiche.prototype.constructor = WDBarreBoutonPopupRiche;

// Declare les fonction une par une

// Clic sur une couleur : "vraie" commande
WDBarreBoutonPopupRiche.prototype.OnClickP = function(oEvent)
{
	var oSource = bIE ? oEvent.srcElement : oEvent.target;
	// Filtre les clics autour des couleurs
	if (oSource.tagName.toUpperCase() == "DIV")
	{
		// Trouve la couleur
		this.m_oParamCommande[2] = _JGCS(oSource).backgroundColor;

		// Execute la commande de la classe de base deux niveau au dessus
		WDBarreBouton.prototype.ExecuteCommande.apply(this, [oEvent]);
	}

	// Ferme la popup
	WDBarreBoutonPopup.prototype.OnClickP.apply(this, arguments);
};

// Manipulation d'une combo du champ de saisie
function WDSaisieRicheCbm (oObjetParent, oCombo, sCommande, sStyle, tabValeurs)
{
	this.m_oObjetParent		= oObjetParent;
	this.m_oCombo			= oCombo;
	this.m_sCommande		= sCommande;
	this.m_sStyle			= sStyle;

	// Pour la validation W3C, il faut au moins une option dans les combos :
	// La generation ajoute une option dans la combo, et je la supprime ici
	this.m_oCombo.options.length = 0;

	// Remplit la combo
	var i;
	var nLimiteI = tabValeurs.length;
	for (i = 0; i < nLimiteI; i++)
	{
		var clValeur = tabValeurs[i];
		// Comme tabValeurs est une reference sur un tableau inline, on semble lister aussi la propriete .length que l'on ne veux pas
		if (clValeur)
		{
			this.m_oCombo.options[this.m_oCombo.options.length] = new Option(clValeur.sN, clValeur.sV);
		}
	}

	// Hook les methodes des boutons
	// Uniquement si le parent n'est pas dans une ZR
	// Si le parent est dans une ZR, le hook est fait au deplacement de la barre
	if (!(oObjetParent.bGestionZR()))
	{
		this.PostPlaceBarre();
	}
};

WDSaisieRicheCbm.prototype =
{
	// Hook les boutons
	// Le fait de deplacer la barre fait perdre le hook sur onchange des combos
	PrePlaceBarre:function ()
	{
		this.m_oCombo.onchange = null;
	},
	// Le fait de deplacer la barre fait perdre le hook sur onchange des combos
	PostPlaceBarre:function ()
	{
		var oThis = this;
		if (bIE)
		{
			this.m_oCombo.onchange = function () { oThis.OnChange(event); }
		}
		else
		{
			this.m_oCombo.onchange = function (event) { oThis.OnChange(event); }
		}
	},

	OnChange:function (oEvent)
	{
		// Memorise le range courant
		var oRange = this.m_oObjetParent.oGetRange();
		if (oRange)
		{
			this.m_oRange = oRange;
		}

		// Execute la commande
		this.m_oObjetParent.ExecuteCommande(oEvent, [this.m_sCommande, false, this.m_oCombo.options[this.m_oCombo.selectedIndex].value]);

		// Rafraichit le bouton
		// => inutile car fait par ExecuteCommande
//		this.RafEtatSimple(oEvent);
	},

	// Rafraichit le bouton
	RafEtatSimple:function (oEvent)
	{
		this.RafEtat(oEvent, this.m_oObjetParent.oGetParamEtat(oEvent, false));
	},

	RafEtat:function (oEvent, oDataEtat)
	{
		// Si on a un range memorise et que la selection est identique : retourne la valeur
		if (this.m_oRange)
		{
			try
			{
				if (this.m_oObjetParent.bCompareRange(this.m_oRange, oDataEtat[0]))
				{
					// Ne fait rien (ne change pas l'etat)
					return;
				}
			}
			catch (e)
			{
			}
			// La selection a change
			delete this.m_oRange;
		}

		// Si on n'a pas de style
		if (!oDataEtat[2])
		{
			return;
		}

		// On pretraite la valeur du style pour eviter les valeurs transforme de firefox
		var sValeurStyleCal = oDataEtat[2][this.m_sStyle];

		// Cas de la taille de la police
		if (this.m_sStyle == "fontSize")
		{
			this.__RafEtat_Taille(oEvent, sValeurStyleCal);
		}
		else
		{
			this.__RafEtat_Police(oEvent, sValeurStyleCal);
		}
	},

	// Traite la selection de la taille de la police
	__RafEtat_Taille:function (oEvent, sValeurStyleCal)
	{
		// Supprime les '
		sValeurStyleCal.replace(/'/g,"");

		// Cas de la taille transformee en px
		if (sValeurStyleCal.charAt(sValeurStyleCal.length - 2) == 'p')
		{
			var dTaille = parseFloat(sValeurStyleCal);
			if (sValeurStyleCal.charAt(sValeurStyleCal.length - 1) == 't')
			{
				dTaille *= 96.0 / 72.0;
			}
			if (dTaille < 11.5)			// 10 => 1
			{
				sValeurStyleCal = "1";
			}
			else if (dTaille < 14.5)	// 13 => 2
			{
				sValeurStyleCal = "2";
			}
			else if (dTaille < 17)		// 16 => 3
			{
				sValeurStyleCal = "3";
			}
			else if (dTaille < 21)		// 18 => 4
			{
				sValeurStyleCal = "4";
			}
			else if (dTaille < 28)		// 24 => 5
			{
				sValeurStyleCal = "5";
			}
			else if (dTaille < 40)		// 32 => 6
			{
				sValeurStyleCal = "6";
			}
			else						// 48 => 7
			{
				sValeurStyleCal = "7";
			}
		}

		// Selectionne l'element dans la combo
		var tabOptions = this.__tabRechercheValeurCombo(sValeurStyleCal, function (sValeur, oOption) { return (sValeur.toUpperCase() == oOption.value.toUpperCase()); });
		if (tabOptions.length > 0)
		{
			if (this.m_oCombo.selectedIndex != tabOptions[0])
			{
				this.m_oCombo.selectedIndex = tabOptions[0];
			}
			return;
		}

		// Element non trouve dans la combo : l'ajoute a la combo
		var nPos = this.m_oCombo.options.length;
		this.m_oCombo.options[this.m_oCombo.options.length] = new Option(sValeurStyleCal, sValeurStyleCal);
		this.m_oCombo.selectedIndex = nPos;
	},

	// Transforme une liste de police en tableau
	__tabSplitPolices:function (sValeur)
	{
		// Commence par separer les differentes valeurs
		var tabPolices = sValeur.split(',');
		// Puis supprime les apostrophes et espaces au debut
		var i;
		var nLimiteI = tabPolices.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var nTaille = tabPolices[i].length;
			while ((nTaille > 0) && ((tabPolices[i].charAt(0) == "'") || (tabPolices[i].charAt(0) == " ")))
			{
				tabPolices[i] = tabPolices[i].substring(1);
				nTaille--;
			}
			while ((nTaille > 0) && ((tabPolices[i].charAt(nTaille - 1) == "'") || (tabPolices[i].charAt(nTaille - 1) == " ")))
			{
				tabPolices[i] = tabPolices[i].substring(0, nTaille - 1);
				nTaille--;
			}
		}
		return tabPolices;
	},


	// Traite la selection du style de la police
	__RafEtat_Police:function (oEvent, sValeurStyleCal)
	{
		// Commence par separer les differentes valeurs
		var tabPolices = this.__tabSplitPolices(sValeurStyleCal);
		var sSubStitutionReconstruite = tabPolices.join(',');

		// Recherche la police dans la combo avec le texte
		var fTest = function (sValeur, oOption)
		{
			// Transforme la valeur en tableau
			return (sValeur.toUpperCase() == WDSaisieRicheCbm.prototype.__tabSplitPolices(oOption.value)[0].toUpperCase());
		}
		var tabOptions = this.__tabRechercheValeurCombo(tabPolices[0], fTest);
		if (tabOptions.length > 0)
		{
			// Test si on a une valeur identique
			var i;
			var nLimiteI = tabOptions.length;
			for (i = 0; i < nLimiteI; i++)
			{
				if (this.__tabSplitPolices(this.m_oCombo.options[tabOptions[i]].value).join(',').toUpperCase() == sSubStitutionReconstruite.toUpperCase())
				{
					// Trouvee
					if (this.m_oCombo.selectedIndex != tabOptions[i])
					{
						this.m_oCombo.selectedIndex = tabOptions[i];
					}
					return;
				}
			}

			// On n'a pas d'option complete : ajoute un doublon
			var nPos = this.m_oCombo.options.length;
			this.m_oCombo.options[this.m_oCombo.options.length] = new Option(tabPolices[0] + '(' + sSubStitutionReconstruite + ')', sSubStitutionReconstruite);
			this.m_oCombo.selectedIndex = nPos;
			return;
		}

		// On n'a pas l'option et pas de doublon : ajoute simplement
		var nPos = this.m_oCombo.options.length;
		this.m_oCombo.options[this.m_oCombo.options.length] = new Option(tabPolices[0], sSubStitutionReconstruite);
		this.m_oCombo.selectedIndex = nPos;
	},

	__tabRechercheValeurCombo:function (sValeur, fbFonction)
	{
		var tabOptions = new Array();
		var i;
		var nLimiteI = this.m_oCombo.options.length;
		for (i = 0; i < nLimiteI; i++)
		{
			if (fbFonction(sValeur, this.m_oCombo.options[i]))
			{
				// Trouve
				tabOptions.push(i);
			}
		}
		return tabOptions;
	}
};

// Manipulation d'un champ de saisie HTML
function WDSaisieRiche(sAliasChamp, eModeBarre, sImageSurvol, sImageActif, sAliasZR, sAliasAttribut)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDBarre.prototype.constructor.apply(this, [sAliasChamp, sAliasZR, sAliasAttribut, eModeBarre, sImageSurvol, sImageActif]);

		var oThis = this;
		if (bIE)
		{
			this.m_fKeyDown = function(event) { return oThis.bOnKeyDown(event); }
		}
		else
		{
			this.m_fRafBarre = function(event) { return oThis.RafBarre(event, true); }
		}
//		this.m_fResize = function(event) { return oThis.OnResize(event); }
	}
};

// Declare l'heritage
WDSaisieRiche.prototype = new WDBarre();
// Surcharge le constructeur qui a ete efface
WDSaisieRiche.prototype.constructor = WDSaisieRiche;

// Declare les fonction une par une

WDSaisieRiche.prototype.ms_sSuffixeHote = "_HTE";
WDSaisieRiche.prototype.ms_sSuffixeEditeur = "_EDT";

WDSaisieRiche.prototype.ms_tabPropBordureSav = ["borderTopWidth", "borderTopStyle", "borderTopColor",
												"borderLeftWidth", "borderLeftStyle", "borderLeftColor",
												"borderRightWidth", "borderRightStyle", "borderRightColor",
												"borderBottomWidth", "borderBottomStyle", "borderBottomColor" ];

// Description de la barre
// - Le type (m_nBoutonXXX ou ms_nCombo)
// - Le suffixe du nom
// - La commande/la fonction (pour les boutons commandes)
// - Le style
// - Les parametres
WDSaisieRiche.prototype.m_tabDescBarre = [
// Boutons OnOff
	{ nType: 0, sSuf: "GRA", sCom: "bold", sSty: "fontWeight", tabP: [{ sVal: "400", bTst: false}] },
	{ nType: 0, sSuf: "ITA", sCom: "italic", sSty: "fontStyle", tabP: [{ sVal: "italic", bTst: true }, { sVal: "oblique", bTst: true}] },
	{ nType: 0, sSuf: "SOU", sCom: "underline", sSty: "textDecoration", tabP: [{ sVal: "underline", bTst: true}] },
	{ nType: 0, sSuf: "BAR", sCom: "strikeThrough", sSty: "textDecoration", tabP: [{ sVal: "line-through", bTst: true}] },
	{ nType: 0, sSuf: "AGA", sCom: "JustifyLeft", sSty: "textAlign", tabP: [{ sVal: "left", bTst: true}] },
	{ nType: 0, sSuf: "ACE", sCom: "JustifyCenter", sSty: "textAlign", tabP: [{ sVal: "center", bTst: true}] },
	{ nType: 0, sSuf: "ADR", sCom: "JustifyRight", sSty: "textAlign", tabP: [{ sVal: "right", bTst: true}] },
	{ nType: 0, sSuf: "AJU", sCom: "JustifyFull", sSty: "textAlign", tabP: [{ sVal: "justify", bTst: true}] },
	{ nType: 0, sSuf: "LNU", sCom: "InsertOrderedList", sSty: "", tabP: [] },
	{ nType: 0, sSuf: "LPU", sCom: "InsertUnorderedList", sSty: "", tabP: [] },
	{ nType: 0, sSuf: "RMO", sCom: "Outdent", sSty: "", tabP: [] },
	{ nType: 0, sSuf: "RPL", sCom: "Indent", sSty: "", tabP: [] },
	{ nType: 0, sSuf: "EXP", sCom: "superscript", sSty: "", tabP: [] },
	{ nType: 0, sSuf: "IND", sCom: "subscript", sSty: "", tabP: [] },
// Boutons popup
	{ nType: 1, sSuf: "COL", sCom: "ForeColor" },
// Boutons action
	{ nType: 2, sSuf: "LNK", sCom: "OnLink" },
	{ nType: 2, sSuf: "IMG", sCom: "OnImage" },
// Combo
	{ nType: 3, sSuf: "FNA", sCom: "FontName", sSty: "fontFamily", tabP: [
			{ sN: "Arial", sV: "Arial,Helvetica,sans-serif" },
			{ sN: "Courier", sV: "Courier New,Courier,mono" },
			{ sN: "Geneva", sV: "Geneva,Verdana,Arial,Helvetica" },
			{ sN: "Georgia", sV: "Georgia,Times New Roman,Times" },
			{ sN: "Helvetica", sV: "Helvetica" },
			{ sN: "Tahoma", sV: "Tahoma,Arial,Helvetica,sans-serif" },
			{ sN: "Times New Roman", sV: "Times New Roman,Times,serif" },
			{ sN: "Verdana", sV: "Verdana,Geneva,Arial,Helvetica" }
		]
	},
	{ nType: 3, sSuf: "FSI", sCom: "FontSize", sSty: "fontSize", tabP: [
			{ sN: "1", sV: "1" },
			{ sN: "2", sV: "2" },
			{ sN: "3", sV: "3" },
			{ sN: "4", sV: "4" },
			{ sN: "5", sV: "5" },
			{ sN: "6", sV: "6" },
			{ sN: "7", sV: "7" }
		]
	},
];

// Initialisation
WDSaisieRiche.prototype.Init = function Init(tabBoutonsInfo)
{
	// Lance l'init interne qui gere le cas du 'reinit'
	// Rappele le Init de la classe de base
	this.__InitInterne(true, tabBoutonsInfo);
};

// Initialisation
WDSaisieRiche.prototype.__InitInterne = function __InitInterne(bInitInitiale, tabBoutonsInfo)
{
	// Si on est pas dans l'init initiale : supprime tout les elements initialises
	if (!bInitInitiale)
	{
		this.__Uninit();
	}

	// Initialise les membres et le contenu
	this.__Init1(bInitInitiale);

	if (bInitInitiale)
	{
		// Appel de la methode de la classe de base
		// Fait ici car on a besoin d'une partie de l'initalisation de __InitCommun
		WDBarre.prototype.Init.apply(this, [tabBoutonsInfo]);
	}

	// Fini l'initalisation
	// true : initialisation initiale
	this.__Init2(bInitInitiale);
};

// Initialise ou reinitialise les membres qui font reference au HTML
// Cree aussi l'iframe
WDSaisieRiche.prototype.__Init1 = function __Init1(bInitInitiale)
{
	// Si on est dans une ZR AJAX : ne fait rien sur les champs
	if (this.oGetZRAjax())
		return;

	// Initialise les membres
	this.m_oValeur = this.oGetElementByIdZR(document, "");
	this.m_oHote = this.oGetElementByIdZR(document, this.ms_sSuffixeHote);

	// Si c'est l'init initiale recupere le tabindex d'une des valeurs
	// Si on est dans une ZR tout les champs ont le meme tabindex donc cela ne pose pas de problemes
	// On peut ne pas avoir this.m_oHote si la ligne selectionne n'est pas sur la page courante
	if (bInitInitiale && this.m_oHote)
	{
		// Reporte si besoin l'attribut TABINDEX
		var oTabIndex = this.m_oHote.attributes.getNamedItem("TABINDEX");
		if (oTabIndex)
		{
			this.m_sTabIndex = oTabIndex.nodeValue;
			// Supprime l'attribut du parent
			this.m_oHote.removeAttribute("TABINDEX", 0);
		}
	}

	// Construit le contenu
	this.__InitCommun();
};

// Inverse les elements important de __Init1 (pour ne pas garder des references croisees perdu dans IE)
WDSaisieRiche.prototype.__Uninit1 = function()
{
	// Si on est dans une ZR AJAX : ne fait rien sur les champs
	if (this.oGetZRAjax())
		return;

	// Supprime le contenu
	// En particulier suppression de tous les hooks des lignes hors de la ligne selectionnee de la ZR
	this.__UninitCommun();

	if (this.m_oHote)
	{
		// Restaure la bordure de l'hote
		if (bIE)
		{
			// Restaure le style de la bordure de l'hote pour IE
			var sProp;
			for (sProp in this.m_oHoteStyleBordure)
			{
				this.m_oHote.style[sProp] = this.m_oHoteStyleBordure[sProp];
			}
			delete this.m_oHoteStyleBordure;
		}
		else
		{
			this.m_oHote.style.border = "";
		}
		SupprimeFils(this.m_oHote);
	}
	this.m_oHote = null; delete this.m_oHote;
	this.m_oValeur = null; delete this.m_oValeur;
};

// Fini l'initalisation
WDSaisieRiche.prototype.__Init2 = function(bInitInitiale)
{
	// Si on est dans une ZR : place la barre d'outils
	// On peut ne pas avoir oHoteBarre si la ligne selectionne n'est pas sur la page courante
	if (this.bGestionZR())
	{
		this.DeplaceBarre(this.oGetElementByIdZRIndice(document, this.nGetZRValeur(), this.ms_sSuffixeCommande));
	}

	// Cree/Recree le lien avec la barre d'outils si besoin
	this.__InitHookDocumentBarre();

	// Fixe la valeur
	// On peut ne pas avoir m_oData/m_oValeur si la ligne selectionne n'est pas sur la page courante
	if (this.m_oData && this.m_oValeur)
	{
		this.m_oData.innerHTML = this.m_oValeur.value;
	}

	// Met a jour la barre d'outils
	this.RafBarre(null);

	// Initialisation specifique
	this.__InitSpecifique(bInitInitiale);
};

// Inverse les elements important de __Init2 (pour ne pas garder des references croisees perdu dans IE)
WDSaisieRiche.prototype.__Uninit2 = function()
{
	// Pour ie : unhook de keydown
	this.__UninitSpecifique();

	// Unhook le document
	this.__UnhookDocumentBarre();
};

// Supprime tout les hooks en cas de reinitialisation du champ
WDSaisieRiche.prototype.__Uninit = function()
{
	// Si on est dans une ZR AJAX : ne fait rien sur les champs
	if (this.oGetZRAjax())
		return;

	// Appel les initialisation dans l'ordre inverse de l'initialisation
	this.__Uninit2();
	this.__Uninit1();
};

// Change l'etat du champ
WDSaisieRiche.prototype.SetEtat = function(eEtat)
{
	// Appel de la methode de la classe de base
	WDBarre.prototype.SetEtat.apply(this, arguments);

	// Traite les modifications
	this.__ActiveModeEditable();
};

// Active le mode editable
WDSaisieRiche.prototype.__ActiveModeEditable = function()
{
	var bContentEditable;
	var sDesignMode;
	var sCouleurFond;

	// Selon l'etat
	switch (this.eGetEtat())
	{
	default:
	case WDChamp.prototype.ms_eEtatActif:
		bContentEditable = true;
		sDesignMode = 'on';
		sCouleurFond = '';
		break;

	case WDChamp.prototype.ms_eEtatLectureSeule:
		bContentEditable = false;
		sDesignMode = 'off';
		sCouleurFond = '';
		break;

	case WDChamp.prototype.ms_eEtatGrise:
		bContentEditable = false;
		sDesignMode = 'off';
		sCouleurFond = 'InactiveBorder';
		break;
	}

	// On peut ne pas avoir m_oData/m_oDocument si la ligne selectionne n'est pas sur la page courante
	if (this.m_oData && this.m_oDocument)
	{
		if (bIE)
		{
			// Passe en mode editable
			this.m_oDocument.contentEditable = bContentEditable;
			this.m_oData.contentEditable = bContentEditable;
		}
		else
		{
			// Passe en mode editable uniquement si l'element est visible
			if (_JGCS(this.m_oHote).display != "none")
			{
				this.m_oDocument.designMode = sDesignMode;
			}
		}
		this.m_oData.style.backgroundColor = sCouleurFond;
	}
};

// Reactive le mode d'edition (pour firefox uniquement)
WDSaisieRiche.prototype.__ReactiveModeEditable = function()
{
	if (!bIE)
	{
		// Uniquement si l'element est visible
		// Si l'element est invisible, la modification sera faite quand l'element est rendu visible
		if (_JGCS(this.m_oHote).display != "none")
		{
			this.m_oDocument.designMode = 'off';

			// Selon l'etat
			switch (this.eGetEtat())
			{
			default:
			case WDChamp.prototype.ms_eEtatActif:
				this.m_oDocument.designMode = 'on';
				break;

			case WDChamp.prototype.ms_eEtatLectureSeule:
			case WDChamp.prototype.ms_eEtatGrise:
				// Laisse desactive
				break;
			}
		}
	}
};

// Initialisation commune des contenus : IFrame ou HTML direct dans les ZR
WDSaisieRiche.prototype.__InitCommun = function()
{
	// Si on est pas dans une ZR
	if (!this.bGestionZR())
	{
		// Initialise directement l'IFrame
		this.__InitCommunIFrame();
	}
	else
	{
		this.__InitCommunZR();
	}
};

// Initialisation commune de l'IFrame
WDSaisieRiche.prototype.__InitCommunIFrame = function()
{
	// Construit l'IFRAME interne
	var oIFrame = document.createElement("IFRAME");
	oIFrame.id = this.sGetNomElement(this.ms_sSuffixeEditeur);
	oIFrame.src = "javascript:\"\"";

	// Copie la bordure de l'hote sur l'iframe
	var oStyleHote = _JGCS(this.m_oHote);
	// Sauve le style de la bordure de l'hote pour IE
	if (bIE)
	{
		this.m_oHoteStyleBordure = new Object();
		var sProp;
		for (sProp in this.ms_tabPropBordureSav)
		{
			var sNomProp = this.ms_tabPropBordureSav[sProp];
			this.m_oHoteStyleBordure[sNomProp] = oStyleHote[sNomProp];
		}
	}
	oIFrame.style.border = oStyleHote.borderLeftWidth + ' ' + oStyleHote.borderLeftStyle + ' ' + oStyleHote.borderLeftColor;
	this.m_oHote.style.border = '0px solid transparent';
	this.__OnResize(null, oIFrame, oIFrame.style);
	oIFrame.frameBorder = "0";
	oIFrame.border = "0";

	// Reporte si besoin l'attribut TABINDEX
	if (this.m_sTabIndex)
	{
		oIFrame.tabIndex = this.m_sTabIndex;
	}

	// L'ajoute au document
	SupprimeFils(this.m_oHote);
	this.m_oIFrame = this.m_oHote.appendChild(oIFrame);

	// Document a manipuler
	this.m_oDocument = this.m_oIFrame.contentWindow.document;

	// Construit le contenu de l'IFRAME
	var sIFrameHTML = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">";
	// Cela ne semble pas fonctionner dans certaines version de FireFox sans le xmlns
	sIFrameHTML += bRTL ? "<HTML dir=\"rtl\">" : "<HTML>";
	sIFrameHTML += "<HEAD xmlns=\"http://www.w3.org/1999/xhtml\">";
	// Recupere le style du texte
	var sStyleBase = this.__sGetStyleBase();
	sIFrameHTML += "<STYLE type=\"text/css\">BODY{margin:1px;overflow:auto;" + sStyleBase + "}</STYLE>";
	sIFrameHTML += "<META http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><BASE href=\"" + _WD_ + "\" /></HEAD><BODY></BODY></HTML>";

	// L'ecrit
	this.m_oDocument.open();
	this.m_oDocument.write(sIFrameHTML);
	this.m_oDocument.close();

	// Memorise les donnees
	this.m_oData = this.m_oDocument.body;
};

// Initialisation commune des contenus dans une ZR : IFrame ou HTML direct dans les ZR
WDSaisieRiche.prototype.__InitCommunZR = function()
{
	var nDebut = this.nGetZRDebut();
	var nOccurrence = this.nGetZROccurrence();
	var nValeur = this.nGetZRValeur();

	var i;
	var nLimiteI = nDebut + nOccurrence;
	for (i = nDebut; i < nLimiteI; i++)
	{
		if (i != nValeur)
		{
			// Initialise une valeur sans le HTML
			this.__InitCommunZR_HTML(i);
		}
		else
		{
			// Initialise l'IFrame
			this.__InitCommunZR_IFrame(i);
		}
	}
};

// Initialisation commune des contenus dans une ZR : IFrame
WDSaisieRiche.prototype.__InitCommunZR_IFrame = function(nIndice)
{
	// On ne peut pas le faire maintenant car this.m_oBarre n'est pas encore defini
//	// Place la barre d'outils
//	this.m_oBarre = this.oGetElementByIdZRIndice(document, nIndice, this.ms_sSuffixeCommande).insertBefore(this.m_oBarre, null);

	// Init l'IFrame
	if (this.m_oHote)
	{
		this.__InitCommunIFrame();
	}
};

// Initialisation commune des contenus dans une ZR : HTML
WDSaisieRiche.prototype.__InitCommunZR_HTML = function(nIndice)
{
	// Place simplement la valeur HTML
	var oValeur = this.oGetElementByIdZRIndice(document, nIndice, "");
	var oHote = this.oGetElementByIdZRIndice(document, nIndice, this.ms_sSuffixeHote);

	if (!oValeur || !oHote)
	{
		return;
	}

	// Applique la couleur selon l'etat
	var oAttribut = oValeur.attributes.getNamedItem("DISABLED");
	oHote.style.backgroundColor = (oAttribut && oAttribut.specified) ? 'InactiveBorder' : '';
	// Pour avoir un asenseur et ne pas deformer la page
	oHote.style.overflow = "auto";
	// Maintenant que l'hote est pret : ecrit la valeur
	oHote.innerHTML = oValeur.value;

	// Se branche sur le onclick de l'element pour pourvoir changer de ligne
	// normalement il n'y a pas de code de onclick sur l'hote donc on n'a pas besoin de gerer le cas
	var oThis = this;
	if (bIE)
	{
		oHote.onclick = function() { oThis.OnClickLigne(event, nIndice); };
	}
	else
	{
		oHote.onclick = function(event) { oThis.OnClickLigne(event, nIndice); };
	}
};

// Inverse les elements important de __InitCommun (pour ne pas garder des references croisees perdu dans IE)
WDSaisieRiche.prototype.__UninitCommun = function()
{
	// Si on est dans une ZR : suppression des onclick sur les elements
	if (this.bGestionZR())
	{
		this.__UninitCommunZR();
	}

	// Suppression de l'iframe et des membres
	this.m_oData = null; delete this.m_oData;
	this.m_oDocument = null; delete this.m_oDocument;
	this.m_oIFrame = null; delete this.m_oIFrame;
};

// Inverse les elements important de __InitCommunZR (pour ne pas garder des references croisees perdu dans IE)
// (sauf la gestion de l'iframe qui est manipule globalement)
WDSaisieRiche.prototype.__UninitCommunZR = function()
{
	// Pour toutes les lignes de la ZR qui n'ont pas
	var nDebut = this.nGetZRDebut();
	var nOccurrence = this.nGetZROccurrence();
	var nValeur = this.nGetZRValeur();

	var i;
	var nLimiteI = nDebut + nOccurrence;
	for (i = nDebut; i < nLimiteI; i++)
	{
		// Uninitialise une valeur dans le HTML
		this.__UninitCommunZR_HTML(i);
	}
};

WDSaisieRiche.prototype.__UninitCommunZR_HTML = function(nIndice)
{
	// Trouve simplement la valeur HTML
	var oHote = this.oGetElementByIdZRIndice(document, nIndice, this.ms_sSuffixeHote);
	if (oHote)
	{
		SupprimeFils(oHote);
		oHote.onclick = null;
	}
};

// Sur le changement d'etat
WDSaisieRiche.prototype.ms_sOnEtat = "OnEtat";
WDSaisieRiche.prototype.OnEtat = function OnEtat()
{
	this.__InitSpecifique(false);
};

// Initialisation specifique
WDSaisieRiche.prototype.__InitSpecifique = function __InitSpecifique(bInitInitiale)
{
	// Met a jour le mode lecture seule/grise du champ
	if (this.m_oValeur)
	{
		var bLectureSeule = false;
		var oAttribut = this.m_oValeur.attributes.getNamedItem("READONLY");
		if (oAttribut && oAttribut.specified)
		{
			// Appele directement la methode de la classe de base car on ne veux pas modifier maintenant l'iframe
			// (fait par __ActiveModeEditable)
			WDBarre.prototype.SetEtat.apply(this, [this.ms_eEtatLectureSeule]);
			bLectureSeule = true;
		}
		// Grise est prioritaire sur lecture seule
		var bGrise = false;
		oAttribut = this.m_oValeur.attributes.getNamedItem("DISABLED");
		if (oAttribut && oAttribut.specified)
		{
			// Appele directement la methode de la classe de base car on ne veux pas modifier maintenant l'iframe
			// (fait par __ActiveModeEditable)
			WDBarre.prototype.SetEtat.apply(this, [this.ms_eEtatGrise]);
			bGrise = true;
		}

		// Si on n'est pas en lecture seule ou en grise, et que l'on n'etait pas actif, passe en actif
		if (!bLectureSeule && !bGrise && (this.ms_eEtatActif != this.eGetEtat()))
		{
			WDBarre.prototype.SetEtat.apply(this, [this.ms_eEtatActif]);
		}
	}

	// Passe en mode editable
	this.__ActiveModeEditable();

	// Pour ie : hook de keydown pour gerer le cas des balises P a remplacer par des br
	if (bIE)
	{
		// On peut ne pas avoir m_oData si la ligne selectionne n'est pas sur la page courante
		if (this.m_oDocument)
		{
			HookOnXXX(this.m_oDocument, 'onkeydown', 'keydown', this.m_fKeyDown);
		}
	}
};

// Desinitialisation specifique
WDSaisieRiche.prototype.__UninitSpecifique = function()
{
	// pas besoin de supprimer le mode editable

	// Pas besoin de supprimer la fonction de redimensionnement : elle est globale

	// Pour ie : hook de keydown pour gerer le cas des balises P a remplacer par des br
	if (bIE)
	{
		// On peut ne pas avoir m_oData si la ligne selectionne n'est pas sur la page courante
		if (this.m_oDocument)
		{
			UnhookOnXXX(this.m_oDocument, 'onkeydown', 'keydown', this.m_fKeyDown);
		}
	}
};

// Recupere le style sous forme de texte avec un ; terminal si le style est non vide
WDSaisieRiche.prototype.__sGetCSSTexte = function(oElement)
{
	// Uniquement si le style existe
	if (oElement && oElement.style)
	{
		var sCSSTexte = oElement.style.cssText;
		if (sCSSTexte)
		{
			// Ajoute le ";" si besoin
			if ((sCSSTexte.length > 0) && (sCSSTexte.substring(sCSSTexte.length - 1) != ";"))
			{
				sCSSTexte += ";";
			}
			return sCSSTexte;
		}
	}
	return "";
};

// Rearenge le style pour supprimer les doublons
WDSaisieRiche.prototype.__sOptimiseStyle = function(sStyle)
{
	// Separe la chaine en couple separee par ;
	var tabStyle = sStyle.split(";");
	var tabStyleOpt = [];
	var i;
	var nLimiteI = tabStyle.length
	for (i = 0; i < nLimiteI; i++)
	{
		var sStyleElement = tabStyle[i];
		if (sStyleElement && (sStyleElement.length > 0))
		{
			// Separe le nom et la valeur
			var tabElement = sStyleElement.split(":");
			// Supprime les espaces
			tabElement[0] = tabElement[0].replace(/ /g, "")
			if (tabElement[0] && (tabElement[0].length > 0))
			{
				// Ignore les attribut width et height
				switch (tabElement[0].toLowerCase())
				{
				case "width":
				case "height":
					break;
				default:
					// Si le style est deja present le replace sinon le cree
					tabStyleOpt[tabElement[0]] = tabElement[1];
					break;
				}
			}
		}
	}

	// Reconstruit la chaine
	// On ne peut pas utiliser join car les indexs sont importants
	var sStyleOpt = "";
	var sCle;
	for (var sCle in tabStyleOpt)
	{
		sStyleOpt += sCle + ":" + tabStyleOpt[sCle] + ";";
	}
	return sStyleOpt;
};

// Recupere le style par defaut du champ
WDSaisieRiche.prototype.__sGetStyleBase = function()
{
	var sStyle = "";

	// On ajoute TOUJOURS le style par l'id car le navigateur tient compte des deux
	// On les ajoute dans CET ordre car si une directive est dans les deux c'est l'ordre d'application du navigateur
	// des doulon de style sont possibles

	// Recupere le style du champ : convention avec la generation HTML, le style est celui sur le champ cache
	if (this.m_oValeur.className)
	{
		sStyle += this.__sGetCSSTexte(this.__oGetStyleRule("." + this.m_oValeur.className));
	}
	sStyle += this.__sGetCSSTexte(this.__oGetStyleRule("#" + this.m_sAliasChamp));

	// Si il y a un style inline sur la balise input, il faut l'ajouter
	sStyle += this.__sGetCSSTexte(this.m_oValeur);

	// Puis on rearenge le style pour supprimer les doublons
	return this.__sOptimiseStyle(sStyle);
};

// Recupere la regle de style avec le nom donnee
WDSaisieRiche.prototype.__oGetStyleRule = function(sRuleName)
{
	// On recherche le style a la racine
	var tabStyles = document.getElementsByTagName("STYLE");
	var i;
	var nLimiteI = tabStyles.length;
	for (i = 0; i < nLimiteI; i++)
	{
		var oRule = this.__oGetStyleRule_UnFeuille(tabStyles[i], sRuleName);
		if (oRule)
		{
			return oRule;
		}
	}

	// On recherche les styles dans les feuilles de style externes
	tabStyles = document.getElementsByTagName("LINK");
	var i;
	var nLimiteI = tabStyles.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// Unique les feuilles de style
		if (tabStyles[i].rel.toUpperCase() == "STYLESHEET")
		{
			var oRule = this.__oGetStyleRule_UnFeuille(tabStyles[i], sRuleName);
			if (oRule)
			{
				return oRule;
			}
		}
	}
	return null;
};

// Recupere la regle de style avec le nom donnee
WDSaisieRiche.prototype.__oGetStyleRule_UnFeuille = function(oFeuille, sRuleName)
{
	// Pour internet explorer
	if (oFeuille.styleSheet)
	{
		var oFeuilleStyle = oFeuille.styleSheet;

		// On parcours les sous styles
		var j;
		var nLimiteJ = oFeuilleStyle.rules.length;
		for (j = 0; j < nLimiteJ; j++)
		{
			if (oFeuilleStyle.rules[j].selectorText == sRuleName)
			{
				return oFeuilleStyle.rules[j];
			}
		}
	}
	// Pour FireFox et autres
	else if (oFeuille.sheet)
	{
		var oFeuilleStyle = oFeuille.sheet;

		// Normalise en avance le nom : supprime les espaces de formatage (ajoute entre les ',')
		// et passe en minuscule pour chrome
		sRuleName = sRuleName.replace(/ /g, "").toLowerCase();

		// On parcours les sous styles
		var j;
		var nLimiteJ = oFeuilleStyle.cssRules.length;
		for (j = 0; j < nLimiteJ; j++)
		{
			// On recupere la liste des styles pour voir si notre style y est
			// Comme les styles sont groupes par le moteur selon des styles qui doivent reste identique il sufit de trouver notre style une fois
			// Ici les styles sont groupe donc il faut faire un parsing
			var tabStylesNom = oFeuilleStyle.cssRules[j].selectorText.split(",");
			var k;
			var nLimiteK = tabStylesNom.length;
			for (k = 0; k < nLimiteK; k++)
			{
				// Il faut faire une comparaison sans case pour chrome
				if (tabStylesNom[k].replace(/ /g, "").toLowerCase() == sRuleName)
				{
					return oFeuilleStyle.cssRules[j];
				}
			}
		}
	}
};

// Initialise la barre d'outils
WDSaisieRiche.prototype._InitBarreAutomatique = function _InitBarreAutomatique()
{
	// Deplace en dehors de l'init de la barre pour ne pas avoir plein de cas : init initiale et init dans ZR
//	// Hook la gestion de la barre dans l'iframe
//	this.__InitHookDocumentBarre();

	// Ajoute le hook sur onkeyup et onclick
	// et initialise les callback de redimensionnement/defilement du navigateur
	this.m_fDocOnClick = document.onclick;
	this.m_fDocOnKeyUp = document.onkeyup;

	// Cette init n'est faite que une fois donc pas besoin de fonction de unhook
	var oThis = this;
	if (bIE)
	{
		document.onclick = function() { if (oThis.m_fDocOnClick) { oThis.m_fDocOnClick.apply(document); } oThis.RafBarre(event); };
		document.onkeyup = function() { if (oThis.m_fDocOnKeyUp) { oThis.m_fDocOnKeyUp.apply(document); } oThis.RafBarre(event); };
	}
	else
	{
		document.onclick = function(event) { if (oThis.m_fDocOnClick) { oThis.m_fDocOnClick.apply(document, [event]); } oThis.RafBarre(event); };
		document.onkeyup = function(event) { if (oThis.m_fDocOnKeyUp) { oThis.m_fDocOnKeyUp.apply(document, [event]); } oThis.RafBarre(event); };
	}
};

// Hook la gestion de la barre dans l'iframe
WDSaisieRiche.prototype.__InitHookDocumentBarre = function()
{
	// Le cas FF semble fonctioner aussi dans IE mais dans le doute je garde les deux cas
	// On peut ne pas avoir this.m_oData/this.m_oDocument si la ligne selectionne n'est pas sur la page courante
	if (bIE)
	{
		if (this.m_oData)
		{
			var oThis = this;
			this.m_oData.onclick = function() { oThis.RafBarre(event, true); }
			this.m_oData.onkeyup = function() { oThis.RafBarre(event, true); }
		}
	}
	else
	{
		if (this.m_oDocument)
		{
			HookOnXXX(this.m_oDocument, 'onclick', 'click', this.m_fRafBarre);
			HookOnXXX(this.m_oDocument, 'onkeyup', 'keyup', this.m_fRafBarre);
		}
	}
};

// Suppression de la gestion de la barre dans l'iframe
WDSaisieRiche.prototype.__UnhookDocumentBarre = function()
{
	if (bIE)
	{
		if (this.m_oData)
		{
			this.m_oData.onclick = null;
			this.m_oData.onkeyup = null;
		}
	}
	else
	{
		if (this.m_oDocument)
		{
			UnhookOnXXX(this.m_oDocument, 'onclick', 'click', this.m_fRafBarre);
			UnhookOnXXX(this.m_oDocument, 'onkeyup', 'keyup', this.m_fRafBarre);
		}
	}
};

// Creation des boutons de la barre d'outils

// Boutons on/off
WDSaisieRiche.prototype._voNewBoutonOnOff = function _voNewBoutonOnOff(oElementBarre, oDesc)
{
	return new WDBarreBoutonOnOffRiche(this, oElementBarre, oDesc.sCom, oDesc.sSty, oDesc.tabP);
};
// Boutons popup
WDSaisieRiche.prototype._voNewBoutonPopup = function _voNewBoutonPopup(oElementBarre, oDesc)
{
	return new WDBarreBoutonPopupRiche(this, oElementBarre, oDesc.sCom, this.oGetElementByIdBarre(document, oDesc.sSuf + "P"));
};
// Boutons action
WDSaisieRiche.prototype._voNewBoutonAction = function _voNewBoutonAction(oElementBarre, oDesc)
{
	return new WDBarreBouton(this, oElementBarre, oDesc.sCom);
};
// Combos
WDSaisieRiche.prototype._voNewBoutonCombo = function _voNewBoutonCombo(oElementBarre, oDesc)
{
	return new WDSaisieRicheCbm(this, oElementBarre, oDesc.sCom, oDesc.sSty, oDesc.tabP);
};
//// Menus
//WDSaisieRiche.prototype._voNewBoutonMenu = function _voNewBoutonMenu(oElementBarre, oDesc)
//{
//	return null;
//};
//// Menus avec highlight du parent si un element est selectionne
//WDSaisieRiche.prototype._voNewBoutonMenuS = function _voNewBoutonMenuS(oElementBarre, oDesc)
//{
//	return null;
//};

// Gestion du click dans une ligne autre de la ZR
WDSaisieRiche.prototype.OnClickLigne = function(oEvent, nLigneAbsolueBase1)
{
	// Sauve le contenu de la ligne
	this.SauveContenu(oEvent);

	// Dans le cas des ZR Ajax, il faut attendre la MAJ de la ZR par le serveur pour forcer la valeur sinon notre valeur est ecrasee
	// Appel de la methode automone qui supporte l'appel retarde
	this._OnClickLigneRetarde(oEvent, nLigneAbsolueBase1);
};

// Dans le cas des ZR Ajax, il faut attendre la MAJ de la ZR par le serveur pour forcer la valeur sinon notre valeur est ecrasee
// Appel de la methode automone qui supporte l'appel retarde
WDSaisieRiche.prototype._OnClickLigneRetarde = function(oEvent, nLigneAbsolueBase1)
{
	// Si on est dans une ZR Ajax, retarde l'appel tant que toutes les requetes ne sont pas traitees
	var oZRAjax = this.oGetZRAjax();
	if (oZRAjax && (oZRAjax.m_oCache.m_tabRequetes.length > 0))
	{
		this.nSetTimeout("_OnClickLigneRetarde", 1, null, nLigneAbsolueBase1);
		return;
	}

	// Affecte la valeur de la ZR
	this.SetZRValeur(oEvent, nLigneAbsolueBase1);

	// Redessine tout
	this.__InitInterne(false);
};

// Evenement sur l'appuis d'une touche (remplace les <p> par des <BR /> en IE
WDSaisieRiche.prototype.bOnKeyDown = function (oEvent)
{
	// Selon le code du caractere
	// On est dans IE donc pas besoin de lire le membre de FF
	if (oEvent.keyCode == 13)
	{
		// Recupere la selection
		var oRange = this.oGetRange();
		if (oRange)
		{
			// Si on a une selection texte
			if (oRange["duplicate"])
			{
				// Uniquement si on est pas dans une balise de liste
				var oElement = this.oGetSelection(oRange);
				while (oElement && (oElement != this.m_oData))
				{
					// Selon la balise trouvee
					switch (oElement.tagName.toUpperCase())
					{
					case "LI":
						// Liste : ne fait rien
						return;
					case "P":
						// Paragraphe : arrete la recherche
						oElement = null;
						break;
					default:
						oElement = oElement.parentNode;
						break;
					}
				}

				// Puis supprime les SPAN utiliser pour avoir le bon focus dans IE
				this.__SupprimeSPAN_BR_IE();

				// Ajoute le caratere
				// Ajoute un SPAN pour forcer le retour a la ligne
				// Il sera supprime ulterieurement
				oRange.pasteHTML("<br /><SPAN id=\"WDSaisieRiche_TMP\"></SPAN>");
				oRange.collapse(false);
				oRange.scrollIntoView();

				// Bloque la propagation de l'evenement
				return bStopPropagation(oEvent);
			}
			else
			{
				// La selection est un/des objets
				// Laisse IE faire seul car les objets controlRange ne permettent pas la manipulation simple
			}
		}
	}
};

// Supprime le SPAN utilise pour avoir le bon focus dans IE
WDSaisieRiche.prototype.__SupprimeSPAN_BR_IE = function(oEvent)
{
	if (bIE)
	{
		var oSPAN = this.m_oDocument.getElementById("WDSaisieRiche_TMP");
		while (oSPAN)
		{
			oSPAN.removeNode(false);
			// Logiquement il n'y a qu'un element (unicite de l'ID et suppression du precedent en ajout)
			oSPAN = this.m_oDocument.getElementById("WDSaisieRiche_TMP");
		}
	}
};

// Evenement sur le rechargement du champ
WDSaisieRiche.prototype.OnResize = function(oEvent)
{
	// Appel de la classe de base
	WDBarre.prototype.OnResize.apply(this, arguments);

	this.__OnResize(oEvent, this.m_oIFrame, _JGCS(this.m_oIFrame));
};

// Evenement sur le rechargement du champ
WDSaisieRiche.prototype.__OnResize = function(oEvent, oIFrame, oStyle)
{
	// Si on est dans IE, il force la taille des IFrame
	var nLargeurOffset = 0;
	var nHauteurOffset = 0;
	if (bIE)
	{
		// Si on est en "quirks mode", il faut tenir compte des bordure du parent
		if (bIEQuirks)
		{
			nLargeurOffset = this.__nGetOffset(oStyle.borderLeftWidth) + this.__nGetOffset(oStyle.borderRightWidth);
			nHauteurOffset = this.__nGetOffset(oStyle.borderTopWidth) + this.__nGetOffset(oStyle.borderBottomWidth);
		}

		// Sauf si on est dans l'init et que l'iframe n'est pas encore dans l'hote
		if (this.m_oIFrame == oIFrame)
		{
			this.m_oHote.removeChild(oIFrame);
		}
	}
	else
	{
		// On remet une taille extensible que que le m_oHote recalcule sa taille (utile en reduction)
		oIFrame.style.width = '100%';
		oIFrame.style.height = '100%';
	}

	var nLargeur = this.m_oHote.offsetWidth;
	var nHauteur = this.m_oHote.offsetHeight;
	// Si on est en "quirks mode", il faut tenir compte des bordure du parent
	nLargeur -= nLargeurOffset;
	nHauteur -= nHauteurOffset;

	if (bIE && (this.m_oIFrame == oIFrame))
	{
		this.m_oHote.appendChild(oIFrame);
	}
	// Filtre les valeurs negatives (possible si offsetXXX retourne 0 et que l'on supprime les bordures)
	oIFrame.style.width = (nLargeur >= 0) ? nLargeur : 0;
	oIFrame.style.height = (nHauteur >= 0) ? nHauteur : 0;
};

// Force la MAJ des champs dans l'onglet (on n'exclus aucun champ)
// Ancienne version appelee par JS_CelluleAfficheDialogue
WDSaisieRiche.prototype.OnShow = function(oElementRacine)
{
	AppelMethode(WDChamp.prototype.ms_sOnDisplay, [oElementRacine]);
}

// Passe en mode editable les barres affichees
WDSaisieRiche.prototype.OnDisplay = function(oElementRacine)
{
	// Appel de la methode de la classe de base
	WDBarre.prototype.OnDisplay.apply(this, arguments);

	if (this.m_oHote && bEstFils(this.m_oHote, oElementRacine, document))
	{
		var bResize = true;
		// Deplace si besoin l'iframe (FF)
		if (this.m_oDocument != oElementRacine.getElementsByTagName("IFRAME")[0].contentWindow.document)
		{
			// Reinitialise les membres et le contenu
			this.__InitInterne(false);

			// On ne redimensionnera pas
			bResize = false;
		}

		this.__ReactiveModeEditable();

		// Et redimensionne la zone cliente si besoin
		if (bResize)
		{
			this.OnResize(null);
		}
	}
};

// Methode appele directement
// - Champ dans une ZR : notifie le champ de l'affichage/suppression de la ligne
WDSaisieRiche.prototype.OnLigneZRAffiche = function OnLigneZRAffiche(nLigneAbsolueBase1, bSelectionne)
{
	// Appel de la methode de la classe de base
	WDBarre.prototype.OnLigneZRAffiche.apply(this, arguments);

	// Si c'est la ligne selectionnee
	if (bSelectionne)
	{
		// Init 1

		// Initialise les membres
		this.m_oValeur = this.oGetElementByIdZRIndice(document, nLigneAbsolueBase1, "");
		this.m_oHote = this.oGetElementByIdZRIndice(document, nLigneAbsolueBase1, this.ms_sSuffixeHote);
		// Initialise l'IFrame
		this.__InitCommunZR_IFrame(nLigneAbsolueBase1 - 1);

		// Init 2
		this.DeplaceBarre(this.oGetElementByIdZRIndice(document, nLigneAbsolueBase1, this.ms_sSuffixeCommande));

		// Cree/Recree le lien avec la barre d'outils si besoin
		this.__InitHookDocumentBarre();

		// Fixe la valeur
		// On peut ne pas avoir m_oData/m_oValeur si la ligne selectionne n'est pas sur la page courante
		if (this.m_oData && this.m_oValeur)
		{
			this.m_oData.innerHTML = this.m_oValeur.value;
		}

		// Met a jour la barre d'outils
		this.RafBarre(null);

		// Initialisation specifique
		this.__InitSpecifique(false);
	}
	else
	{
		// Initialise une valeur dans le HTML
		this.__InitCommunZR_HTML(nLigneAbsolueBase1);
	}
};
WDSaisieRiche.prototype.OnLigneZRMasque = function OnLigneZRMasque(nLigneAbsolueBase1, bSelectionne, oEvent)
{
	// Uninit 2

	// Si c'est la ligne selectionnee
	if (bSelectionne)
	{
		// Sauve la valeur
		this.SauveContenu(oEvent);

		// Pour ie : unhook de keydown
		this.__UninitSpecifique();

		// Unhook le document
		this.__UnhookDocumentBarre();
	}

	// Trouve simplement la valeur HTML
	var oHote = this.oGetElementByIdZRIndice(document, nLigneAbsolueBase1, this.ms_sSuffixeHote);
	if (oHote)
	{
		// Restaure la bordure de l'hote
		if (bSelectionne)
		{
			if (bIE)
			{
				// Restaure le style de la bordure de l'hote pour IE
				var sProp;
				for (sProp in this.m_oHoteStyleBordure)
				{
					oHote.style[sProp] = this.m_oHoteStyleBordure[sProp];
				}
				delete this.m_oHoteStyleBordure;
			}
			else
			{
				oHote.style.border = "";
			}
		}

		SupprimeFils(oHote);
		oHote.onclick = null;
	}

	// Suppression de l'iframe et des membres
	if (bSelectionne)
	{
		this.m_oData = null; delete this.m_oData;
		this.m_oDocument = null; delete this.m_oDocument;
		this.m_oIFrame = null; delete this.m_oIFrame;

		// Uninit1

		// Restaure la bordure de l'hote : aucune importance on supprime la ligne

		this.m_oHote = null; delete this.m_oHote;
		this.m_oValeur = null; delete this.m_oValeur;
	}

	// Appel de la methode de la classe de base
	WDBarre.prototype.OnLigneZRMasque.apply(this, [nLigneAbsolueBase1, bSelectionne, oEvent]);
};

// Met a jour la barre d'outils
WDSaisieRiche.prototype.RafBarre = function(oEvent, bAfficheBarre)
{
	// Calcule l'etat de la barre dans tous les cas
	// Calcule si besoin si on doit afficher la barre
	if (bAfficheBarre === undefined)
	{
		// Regarde l'element actif dans le document
		var oA = null;
		if (!bIE && oEvent)
		{
			oA = oEvent.explicitOriginalTarget;
		}
		if (!oA)
		{
			oA = document.activeElement;
			// Avec Firefox la valeur recue n'est pas forcement dans le document (c'est un objet externe donc sans acces)
			try
			{
				oA.parentNode;
			}
			catch (e)
			{
				oA = null;
			}
		}
		if (bEstFils(oA, this.m_oBarre, document) || bEstFils(oA, this.m_oHote, document))
		{
			bAfficheBarre = true;
		}
		// Si on est dans une ZR Ajax, on recoit parfois le fils racine de la cellule
		var oZRAjax = this.oGetZRAjax();
		if (oZRAjax && oZRAjax.m_tabSelection && (oA == oZRAjax.oGetIDLigneEffective(oZRAjax.m_tabSelection[0])))
		{
			bAfficheBarre = true;
		}
	}

	// Si le champ n'avais pas le focus, le notifie qu'il le recoit
	if (bAfficheBarre)
	{
		this.OnFocus(oEvent);
	}
	else
	{
		// Supprime le focus si besoin
		this.OnBlur(oEvent);
	}

	// Masque les autres barres
	if (bAfficheBarre)
	{
		this.AppelMethodeAutres(WDChamp.prototype.ms_sMasqueBarre, [oEvent]);
	}

	// Memorise la valeur uniquement en mode automatiqueoDataCommande
	if (this.m_eModeBarre != this.ms_nModeBarreAutomatique)
	{
		bAfficheBarre = undefined;
	}

	// Puis appele la methode de la classe de base
	WDBarre.prototype.RafBarre.apply(this, [oEvent, bAfficheBarre]);
};

// Masque la barre d'outil a la demande d'un autre champ
WDSaisieRiche.prototype.MasqueBarre = function(oEvent)
{
	// Supprime le focus si besoin
	this.OnBlur(oEvent);

	// Appel de la classe de base
	WDBarre.prototype.MasqueBarre.apply(this, arguments);
};

// Si le champ n'avais pas le focus, le donne
WDSaisieRiche.prototype.OnFocus = function(oEvent)
{
	// Si le champ n'a pas encore le focus
	if (!this.m_bFocus)
	{
		// Memorise que l'on a le focus
		this.m_bFocus = true;
		// Execute le PCode
		this.RecuperePCode(this.ms_nEventNavFocus)(oEvent);
	}
};

// Si le champ avais pas le focus, le supprime
WDSaisieRiche.prototype.OnBlur = function(oEvent)
{
	// Si le champ a le focus
	if (this.m_bFocus)
	{
		// Execute le PCode
		this.RecuperePCode(this.ms_nEventNavBlur)(oEvent);
		// Memorise que l'on n'a plus le focus
		delete this.m_bFocus
	}
};

// Recupere les parametres pour RafEtat
WDSaisieRiche.prototype.oGetParamEtat = function(oEvent, bSimple)
{
	var oDataEtat = [this.oGetRange(), null, null];
	// Sous IE on peut avoir un "controlRange"
	var oElement = null;
	if (bIE && !(oDataEtat[0]["duplicate"]))
	{
		oElement = oDataEtat[0].item(0);
		oDataEtat[0] = null;
	}

	if (bSimple == false)
	{
		oDataEtat[1] = oElement ? oElement : this.oGetSelection(oDataEtat[0]);
		oDataEtat[2] = oDataEtat[1] ? _JGCS(oDataEtat[1]) : null;
	}
	return oDataEtat;
};

// Recupere la selection
WDSaisieRiche.prototype.oGetRange = function()
{
	// Recupere la selection
	if (bIE)
	{
		// Recupere la selection
		return this.m_oDocument.selection.createRange();
	}
	else
	{
		// Si le champ n'est pas visible (cellule masque qui sera affiche par CelluleAfficheDialogue) : defaultView est null
		if (this.m_oDocument.defaultView)
		{
			var oSelection = this.m_oDocument.defaultView.getSelection();
			if (oSelection && oSelection.rangeCount)
			{
				return oSelection.getRangeAt(0);
			}
		}
	}
	return null;
};

// Recupere une copie de la selection
WDSaisieRiche.prototype.oGetRangeCpy = function()
{
	var oRange = this.oGetRange();
	if (bIE)
	{
		return oRange.duplicate();
	}
	else
	{
		if (oRange)
		{
			oRange.cloneRange();
		}
	}
	return null;
};

// Compare deux range
WDSaisieRiche.prototype.bCompareRange = function(oRange1, oRange2)
{
	if (bIE)
	{
		return oRange1.isEqual(oRange2);
	}
	else
	{
		return (oRange1.compareBoundaryPoints(0, oRange2) == 0) && (oRange1.compareBoundaryPoints(2, oRange2) == 0);
	}
};

// Recupere le noeud qui contient le debut de la selection
WDSaisieRiche.prototype.oGetSelection = function(oRange)
{
	var oParentElement = null;
	// Recupere la selection
	if (bIE)
	{
		// On veut l'element le plus bas qui contient le debut
		// Donc on va reduire la selection au debut et demander le parent contenant
		// Duplication pour ne pas la modifier
		oRange = oRange.duplicate();
		oRange.collapse(true);
		var oParent = oRange.parentElement();
		// Si le focus est vraiment sortit du champ de saisie, on peut avoir un element qui n'est pas dans l'IFrame mais le body de la frame hote
		return (oParent.document == this.m_oDocument) ? oParent : this.m_oData;
	}
	else
	{
		if (oRange)
		{
			return oRange.startContainer;
		}
	}

	return null;
};

// Optimise le contenu au niveau du DOM
WDSaisieRiche.prototype.OptimiseContenu = function()
{
	// Puis supprime les SPAN utiliser pour avoir le bon focus dans IE
	this.__SupprimeSPAN_BR_IE();

	// Rien pour le moment
};

// Sauvegarde du contenu
WDSaisieRiche.prototype.SauveContenu = function(oEvent)
{
	if (this.m_oValeur)
	{
		// Optimise le contenu du champ pour avoir un HTML compact
		this.OptimiseContenu();

		// Et recupere ce contenu HTML
		var sOldValue = this.m_oValeur.value;
		this.m_oValeur.value = this.m_oData.innerHTML;

		// Si on est dans une ZR AJAX, notifie la ZR de la modification de la valeur
		// Si la valeur ne change pas.
		// Et si on ne change que la case du texte ?
		if (sOldValue.toUpperCase() != this.m_oValeur.value.toUpperCase())
		{
			var oZRAjax = this.oGetZRAjax();
			if (oZRAjax && oEvent)
			{
				oZRAjax.vOnValideLigneZRExterne(oEvent);
			}
		}
	}
};

// Affectation externe du contenu du champ
WDSaisieRiche.prototype.SetValeur = function(oEvent, sValeur, oChamp)
{
	// Appel de la methode de la classe de base (ignore la valeur retourne par l'implementation de la classe de base)
	WDBarre.prototype.SetValeur.apply(this, arguments);

	// Ecrase le contenu
	this.m_oData.innerHTML = sValeur;
	// Sauve ensuite le contenu
	this.SauveContenu();

	// Bug de FF : il faut supprimer le mode d'edition et le remettre
	this.__ReactiveModeEditable();

	// Et le relit pour avoir la version reelle du navigateur
	return this.m_oValeur.value;
};

// Lecture externe du contenu du champ
WDSaisieRiche.prototype.GetValeur = function GetValeur (oEvent, sValeur, oChamp)
{
	// sValeur est ignore car il contient une valeur obsolete
	// Sauve le contenu HTML dans le champ cache
	this.SauveContenu();
	// Puis retourne cette valeur
	return this.m_oValeur.value;
};

// Ecrit les proprietes dont la couleur et la couleur de fond
WDSaisieRiche.prototype.SetProp = function SetProp(eProp, oEvent, oValeur, oChamp)
{
	// Implementation de la classe de base
	oValeur = WDChamp.prototype.SetProp.apply(this, arguments);

	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_COULEUR:
		this.m_oDocument.body.style.color = oValeur;
		return oValeur;
	case this.XML_CHAMP_PROP_NUM_COULEURFOND:
		this.m_oDocument.body.style.backgroundColor = oValeur;
		return oValeur;
	default:
		return oValeur;
	}
};


// En cas de Submit : sauve le contenu
WDSaisieRiche.prototype.OnSubmit = function(oEvent)
{
	this.SauveContenu(oEvent);
};

// Donne le focus au champ (pour reprisesaisie et la validation de champ obligatoire
WDSaisieRiche.prototype.SetFocus = function()
{
	// Pour les navigateur autre que IE il faut d'abord donner le focus a l'IFrame
	if (!bIE)
	{
		this.m_oIFrame.contentWindow.focus();
	}
	this.m_oData.focus();
};

// Gestion des commandes

// Execute une commande
WDSaisieRiche.prototype.ExecuteCommande = function(oEvent, oDataCommande)
{
	// Donne le focus au document
	this.SetFocus();

	// Execute la commande
	this.m_oDocument.execCommand(oDataCommande[0], oDataCommande[1], oDataCommande[2])

	// Donne le focus au document
	this.SetFocus();

	// Rafrachit les boutons
	this.RafBarre(oEvent, true);
};

// Insere un lien
WDSaisieRiche.prototype.OnLink = function(oEvent)
{
	this.__OnPrompt(oEvent, "CreateLink", "Link ?", "http://", false);
};

// Insere une image
WDSaisieRiche.prototype.OnImage = function(oEvent)
{
	// Si une image est selectionnee : on prend son URL
	var oRange = this.oGetRange();
	var sDefaut = "http://"
	// Sous IE on peut avoir un "controlRange"
	if (bIE && !(oRange["duplicate"]) && oRange.item(0) && oRange.item(0).src)
	{
		sDefaut = oRange.item(0).src;
	}

	this.__OnPrompt(oEvent, "InsertImage", "Image ?", sDefaut, true);
};

// Insertion generique
WDSaisieRiche.prototype.__OnPrompt = function(oEvent, sCommande, sTexte, sDefaut, bForcePrompt)
{
	// IE
	if (bIE && !bForcePrompt)
	{
		// Demande l'affichage de l'interface
		this.ExecuteCommande(oEvent, [sCommande, true, ""]);
	}
	else
	{
		var sVal = prompt(sTexte, sDefaut);
		if ((sVal != null) && (sVal != "") && (sVal != sDefaut))
		{
			this.ExecuteCommande(oEvent, [sCommande, false, sVal]);
		}
	}
};


// Recupere le texte alternatif d'un bouton
WDSaisieRiche.prototype.sGetAltText = function(sSuffixe)
{
	return HTML_TOOLBAR.ALTTEXT[sSuffixe];
};

// Place l'indication si besoin (Init ou apres un submit AJAX)
// Declare uniquement pour le cas ou le champ est en 'dynamique' auquel cas la generation HTML fait un appel
WDSaisieRiche.prototype.RAZIndication = function()
{
};
