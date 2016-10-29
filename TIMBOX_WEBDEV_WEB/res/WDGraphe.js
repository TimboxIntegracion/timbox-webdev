//#12.00Aa WDGraphe.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".


// Manipulation d'un bouton On/Off du champ de saisie
function WDBarreBoutonOnOffGraphe (oObjetParent, oBouton, sCommande)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		// Appel le constructeur de la classe de base
		WDBarreBoutonOnOff.prototype.constructor.apply(this, [oObjetParent, oBouton, "ExecuteCommande", [sCommande]]);
	}
}

// Declare l'heritage
WDBarreBoutonOnOffGraphe.prototype = new WDBarreBoutonOnOff();
// Surcharge le constructeur qui a ete efface
WDBarreBoutonOnOffGraphe.prototype.constructor = WDBarreBoutonOnOffGraphe;

// Declare les fonction une par une

// Applique ensuite l'etat d'activation
WDBarreBoutonOnOffGraphe.prototype.bActif = function(oEvent, oDataEtat)
{
	// Demande a l'objet parent
	return this.m_oObjetParent.bActif(this.m_oParamCommande);
};

// Manipulation d'une graphe par sa barre d'options
function WDGraphe(sAliasChamp, eModeBarre, sImageSurvol, sImageActif, sAliasZR, sAliasAttribut)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDBarre.prototype.constructor.apply(this, [sAliasChamp, sAliasZR, sAliasAttribut, eModeBarre, sImageSurvol, sImageActif]);

		var oThis = this;
		this.m_fRafBarreTrue = function(event) { return oThis.RafBarre(event, true); }
		this.m_fRafBarreFalse = function(event) { return oThis.RafBarre(event); }
		this.m_fRafBarreTrueMMove = function(event) { return oThis.RafBarreMMove(event); }
	}
};

// Declare l'heritage
WDGraphe.prototype = new WDBarre();
// Surcharge le constructeur qui a ete efface
WDGraphe.prototype.constructor = WDGraphe;

// Declare les fonction une par une

// Description de la barre
// - Le type (m_nBoutonXXX ou ms_nCombo)
// - Le suffixe du nom
// - La commande/la fonction (pour les boutons commandes)
// - Le style
// - Les parametres
WDGraphe.prototype.m_tabDescBarre = [
// Boutons OnOff
	{ nType: 0, sSuf: "GDH", sCom: "GDH" },
	{ nType: 0, sSuf: "GDV", sCom: "GDV" },
	{ nType: 0, sSuf: "SMO", sCom: "SMO" },
	{ nType: 0, sSuf: "GRA", sCom: "GRA" },
	{ nType: 0, sSuf: "RAI", sCom: "RAI" },
	{ nType: 0, sSuf: "ANT", sCom: "ANT" },
	{ nType: 0, sSuf: "TRA", sCom: "TRA" },
// Boutons popup
// Boutons action
	{ nType: 2, sSuf: "SAV", sCom: "OnSave", tabP: [] },
	{ nType: 2, sSuf: "PRI", sCom: "OnPrint", tabP: [] },
// Combo
// Boutons popup avec menu
	{ nType: 5, sSuf: "PIE", sCom: "OnOption", tabP: ["P", "H", "D"] },
	{ nType: 5, sSuf: "COL", sCom: "OnOption", tabP: ["C", "S", "HC", "HS"] },
	{ nType: 5, sSuf: "CUR", sCom: "OnOption", tabP: ["C", "S", "A", "R"] },
	{ nType: 5, sSuf: "STO", sCom: "OnOption", tabP: ["C", "B", "M"] },
	{ nType: 4, sSuf: "LEG", sCom: "OnOption", tabP: ["S", "D", "G", "H", "B"] },
];

WDGraphe.prototype.m_tabConversionCom = {
	PIE: "TYP",
	COL: "TYP",
	CUR: "TYP",
	STO: "TYP",
	LEG: "LEG"
};

WDGraphe.prototype.m_tabConversionVal = {
	PIE: [0, 26, 23],
	COL: [1, 9, 27, 28],
	CUR: [2, 5, 24, 25],
	STO: [6, 7, 8],
	LEG: [0, 1, 2, 3, 4]
};

// Initialisation
WDGraphe.prototype.Init = function Init(sParamGraphe, sUrlBase, tabBoutonsInfo)
{
	// Initialise les membres : le champ graphe lui meme est l'hote
	this.m_oHote = this.oGetElementById(document, "");

	// Appel de la methode de la classe de base
	// Fait ici car on a besoin d'une partie de l'initalisation precedente
	WDBarre.prototype.Init.apply(this, [tabBoutonsInfo]);

	// Analyse les parametres du graphes
	this.DeduitParam(sParamGraphe);
	this.m_sUrlBase = sUrlBase;

	// Met a jour la barre d'outils
	this.RafBarre(null);
};

// Initialise la barre d'outils
WDGraphe.prototype._InitBarreAutomatique = function _InitBarreAutomatique()
{
	// Ajoute le hook sur onmouseover et onmouseout
	// et initialise les callback de redimensionnement/defilement du navigateur
//	this.m_fMouseOver = document.onmouseover;
//	this.m_fMouseOut = document.onmouseout;

	HookOnXXX(this.m_oHote, 'onmouseover', 'mouseover', this.m_fRafBarreTrue);
	HookOnXXX(this.m_oHote, 'onmouseout', 'mouseout', this.m_fRafBarreFalse);
	HookOnXXX(this.m_oBarre, 'onmouseout', 'mouseout', this.m_fRafBarreFalse);

	// Hook temporairement le onmousemove pour que si la souris est au dessus du champ, que la barre d'affiche au debut
	HookOnXXX(this.m_oHote, 'onmousemove', 'mousemove', this.m_fRafBarreTrueMMove);

//	if (bIE)
//	{
//		this.m_oHote.onmouseover = function () { if (oThis.m_fMouseOver) { oThis.m_fMouseOver.apply(this); } oThis.RafBarre(event); };
//		this.m_oHote.onmouseout = function () { if (oThis.m_fMouseOut) { oThis.m_fMouseOut.apply(this); } oThis.RafBarre(event); };
//	}
//	else
//	{
//		HookOnXXX(this.m_oDocument, 'onclick', 'click', this.m_fRafBarre);
//		HookOnXXX(this.m_oDocument, 'onkeyup', 'keyup', this.m_fRafBarre);
//		document.onclick = function (event) { if (oThis.m_fDocOnClick) { oThis.m_fDocOnClick.apply(document, [event]); } oThis.RafBarre(event); };
//		document.onkeyup = function (event) { if (oThis.m_fDocOnKeyUp) { oThis.m_fDocOnKeyUp.apply(document, [event]); } oThis.RafBarre(event); };
//	}
};

// Creation des boutons de la barre d'outils

// Boutons on/off
WDGraphe.prototype._voNewBoutonOnOff = function _voNewBoutonOnOff(oElementBarre, oDesc)
{
	return new WDBarreBoutonOnOffGraphe(this, oElementBarre, oDesc.sCom, oDesc.sSty, oDesc.tabP);
};
//// Boutons popup
//WDGraphe.prototype._voNewBoutonPopup = function _voNewBoutonPopup(oElementBarre, oDesc)
//{
//	return null;
//};
// Boutons action
WDGraphe.prototype._voNewBoutonAction = function _voNewBoutonAction(oElementBarre, oDesc)
{
	return new WDBarreBouton(this, oElementBarre, oDesc.sCom, oDesc.tabP);
};
//// Combos
//WDGraphe.prototype._voNewBoutonCombo = function _voNewBoutonCombo(oElementBarre, oDesc)
//{
//	return null;
//};
// Menus
WDGraphe.prototype._voNewBoutonMenu = function _voNewBoutonMenu(oElementBarre, oDesc)
{
	// Complete le tableau des options avec la description des options
	var tabOptions = new Array(oDesc.tabP.length);
	var j;
	var nLimiteJ = oDesc.tabP.length;
	for (j = 0; j < nLimiteJ; j++)
	{
		tabOptions[j] = new Object();
		tabOptions[j].oTD = this.oGetElementByIdBarre(document, oDesc.sSuf + "_" + oDesc.tabP[j]);
		tabOptions[j].oParamCommande = [this.m_tabConversionCom[oDesc.sSuf], this.m_tabConversionVal[oDesc.sSuf][j]];
		tabOptions[j].sTexte = CHART_TOOLBAR[oDesc.sSuf][j];
	}
	if (oDesc.nType == this.ms_nBoutonPopupMenu)
	{
		return new WDBarreBoutonPopupMenu(this, oElementBarre, oDesc.sCom, this.oGetElementByIdBarre(document, oDesc.sSuf + "P"), tabOptions);
	}
	else
	{
		return new WDBarreBoutonPopupMenuS(this, oElementBarre, oDesc.sCom, this.oGetElementByIdBarre(document, oDesc.sSuf + "P"), tabOptions);
	}
};
// Menus avec highlight du parent si un element est selectionne
WDGraphe.prototype._voNewBoutonMenuS = function _voNewBoutonMenuS(oElementBarre, oDesc)
{
	// Appel le code de _voNewBoutonMenu qui ensuite fait le bon new
	return this._voNewBoutonMenu(oElementBarre, oDesc);
};

// Met a jour la barre d'outils
WDGraphe.prototype.RafBarre = function(oEvent, bAfficheBarre)
{
	// Calcule si besoin si on doit afficher la barre
	if ((this.m_eModeBarre == this.ms_nModeBarreAutomatique) && (bAfficheBarre === undefined))
	{
		bAfficheBarre = false;
		// Regarde l'element actif dans le document
		if (oEvent)
		{
			var oA = null;
			if (!bIE)
			{
				oA = oEvent.relatedTarget;
			}
			if (!oA)
			{
				oA = oEvent.toElement;
			}
			if (bEstFils(oA, this.m_oBarre, document) || bEstFils(oA, this.m_oHote, document))
			{
				bAfficheBarre = true;
			}
		}
	}

	// Puis appele la methode de la classe de base
	WDBarre.prototype.RafBarre.apply(this, [oEvent, bAfficheBarre]);
};

// MAJ de la barre sur le premier mousemove
WDGraphe.prototype.RafBarreMMove = function(oEvent)
{
	// Supprime le hook
	UnhookOnXXX(this.m_oHote, 'onmousemove', 'mousemove', this.m_fRafBarreTrueMMove);
	// Supprime la fonction
	delete this.m_fRafBarreTrueMMove;

	// Appele la methode normale
	this.RafBarre(oEvent, true);
};

// Indique si un bouton est actif
WDGraphe.prototype.bActif = function(oDataCommande)
{
	return this.m_tabEtat[oDataCommande[0]];
};

// Gestion des commandes

// Execute une commande
WDGraphe.prototype.ExecuteCommande = function(oEvent, oDataCommande)
{
	// Calcule la commande
	this.m_tabEtat[oDataCommande[0]] = this.m_tabEtat[oDataCommande[0]] ? 0 : 1;

	// Envoie la requete
	this.m_oHote.src = this.sGetRequete(false);

	// Rafrachit les boutons
	this.RafBarre(oEvent, true);
};

// Change le type du graphe
WDGraphe.prototype.OnOption = function(oEvent, oDataCommande)
{
	this.m_tabEtat[oDataCommande[0]] = oDataCommande[1];

	// Envoie la requete
	this.m_oHote.src = this.sGetRequete(false);

	// Rafrachit les boutons
	this.RafBarre(oEvent, true);
};

// Indique l'etat d'une option d'un menu popup
WDGraphe.prototype.bActifOption = function(oEvent, oDataCommande)
{
	return (this.m_tabEtat[oDataCommande[0]] == oDataCommande[1]);
};

// Sauve le graphe
WDGraphe.prototype.OnSave = function(oEvent)
{
	document.location = this.sGetRequete(true);
};

// Imprime le graphe
WDGraphe.prototype.OnPrint = function(oEvent)
{
	// Calcule la hauteur et la largeur
	var nHaut = this.m_oHote.offsetHeight + 30;
	var nLarg = this.m_oHote.offsetWidth + 30;

	// Ouvre l'image dans une popup et demande l'impression
	var oPopup = window.open(this.sGetRequete(false), "WDG_" + (new Date()).getTime(), "resizable=yes,height=" + nHaut + ",width=" + nLarg);
	oPopup.print();
};

// Calcule la requete serveur
WDGraphe.prototype.sGetRequete = function(bSauvegarde)
{
	// Prend l'URL courante de la page
	var sRequete = this.m_sUrlBase;

	// Si besoin ajoute un ? au lieu d'un &
	sRequete += (sRequete.indexOf("?") == -1) ? "?" : "&";

	// Le debut de la requete
	return sRequete + "WD_ACTION_=" + (bSauvegarde ? "GRAPHESAUVE" : "GRAPHEPARAM") + "&WD_BUTTON_CLICK_=" + this.m_sAliasChamp + "&WD_PARAM_=" + this.sGetParam() + "&" + this.m_sAliasChamp + "=" + (new Date()).getTime();
};

// Calcule les parametres pour le serveur
WDGraphe.prototype.sGetParam = function()
{
	var sParam = this.m_tabEtat["TYP"];
	sParam += "," + this.m_tabEtat["GDH"];
	sParam += "," + this.m_tabEtat["GDV"];
	sParam += "," + this.m_tabEtat["SMO"];
	sParam += "," + this.m_tabEtat["GRA"];
	sParam += "," + this.m_tabEtat["RAI"];
	sParam += "," + this.m_tabEtat["ANT"];
	sParam += "," + this.m_tabEtat["TRA"];
	return sParam + "," + this.m_tabEtat["LEG"];
};

// Analyse les parametres du graphes
WDGraphe.prototype.DeduitParam = function(sParamGraphe)
{
	// Appel de la methode de la classe de base
	WDBarre.prototype.DeduitParam.apply(this, [sParamGraphe]);

	// Construit la variable tabEtat
	eval("this.m_tabEtat = " + sParamGraphe);
};

// Recupere le texte alternatif d'un bouton
WDGraphe.prototype.sGetAltText = function(sSuffixe)
{
	return CHART_TOOLBAR.ALTTEXT[sSuffixe];
};
