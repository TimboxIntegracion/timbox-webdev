//#15.00Aa WDZR.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Attention a ne pas mettre d'accent dans ce fichier COMMENTAIRES inclus

// Ligne dans une ZR
function WDZRCacheLigne (oXMLLigne, oObjetZR, nLigne)
{
	if (oXMLLigne)
	{
		// Appel le constructeur de la classe de base
		WDTableCacheLigne.prototype.constructor.apply(this, [oXMLLigne, oObjetZR, nLigne]);

		// Recupere la ligne et la colonne effective
		this.m_nLignePosVisibleEff = clWDAJAXMain.nXMLGetAttributSafe(oXMLLigne, this.XML_LIGNE_EFFECTIVE, nLigne);
		this.m_nColonneEff = clWDAJAXMain.nXMLGetAttributSafe(oXMLLigne, this.XML_COLONNE_EFFECTIVE, nLigne % oObjetZR.vnGetNbLignesLogiquesParLignePhysique());
	}
};

// Declare l'heritage
WDZRCacheLigne.prototype = new WDTableCacheLigne();
// Surcharge le constructeur qui a ete efface
WDZRCacheLigne.prototype.constructor = WDZRCacheLigne;

WDZRCacheLigne.prototype.XML_LIGNE_EFFECTIVE = "LIGNEEFF";
WDZRCacheLigne.prototype.XML_COLONNE_EFFECTIVE = "COLONNEEFF";

// Recupere la ligne dans le HTML
WDZRCacheLigne.prototype.vnGetLigneHTML = function vnGetLigneHTML(nLigneAbsolue)
{
	// Se place par rapport a la premiere ligne affichee
	return this.m_nLignePosVisibleEff;
};

// Recupere la colonne dans le HTML
WDZRCacheLigne.prototype.vnGetColonneHTML = function vnGetColonneHTML()
{
	return this.m_nColonneEff;
};

// Classe manipulant une ZR
function WDZR(sAliasChamp, bSansLimite, nHauteurLigne, nPagesMargeMin, nPagesMargeMax, tabStyle, nNbColonnes)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDTable.prototype.constructor.apply(this, [sAliasChamp, bSansLimite, nHauteurLigne, nPagesMargeMin, nPagesMargeMax, WDTable.prototype.SELECTION_SIMPLE, tabStyle]);

		// Initialise le tableau des champs fils
		this.m_tabChampsFils = new WDTableauChamps();

		// Se declare dans la table globale des Tables/ZRs AJAX
		WDChamp.prototype.ms_tabTablesZRs.DeclareChamp(this);

		this.m_nNbColonnes = nNbColonnes;

		// Ne rien mettre ici qui doit etre remit a zero dans l'init
	}
};

// Declare l'heritage
WDZR.prototype = new WDTable();
// Surcharge le constructeur qui a ete efface
WDZR.prototype.constructor = WDZR;

// Initialisation
WDZR.prototype.Init = function(nColonneTrie)
{
	// Appel de la methode de la classe de base
	WDTable.prototype.Init.apply(this, [nColonneTrie]);
};

// Creation d'une ligne
WDZR.prototype.voCreeCacheLigne = function voCreeCacheLigne(oXMLLigne, nLigne)
{
	return new WDZRCacheLigne(oXMLLigne, this, nLigne);
};

// Declare un champ a la ZR
WDZR.prototype.DeclareChampFils = function(oFils)
{
	// Est normalement dans une ZR (this.m_nType == WDAJAXMain.prototype.XML_CHAMP_TYPE_ZONEREPETEE)
	this.m_tabChampsFils.DeclareChamp(oFils);
};

// Gestion sepcifique de l'evenement roulette SI il y a deplacement
WDZR.prototype._vOnRoulette = function(oEvent)
{
	// Appel de la methode de la classe de base
	WDTable.prototype._vOnRoulette.apply(this, [oEvent]);

	// Si on est en saisie dans une zone repetee valide la modification de la ligne par une selection d'une autre partie du DOM
	// Dans certaines tables, ce code declenche une execution de DeplaceTable mais avec un deplacement vide.

	// Il ne faut pas donner le focus a l'ascensuer car cela provoque un defilement irregulier (ou pas de dfilment du tout) dans IE
	this.oGetIDElement(this.ID_TABLEINTERNE).focus();
//	this.m_oAscenseur.focus();
};

// Pas de bordure dans les ZRs
WDZR.prototype._vnGetOffset = function _vnGetOffset(oLignePhysique)
{
	return 0;
};

// Indique si une ligne est selectionnee + retourne faux dans le cas des ZRs
WDZR.prototype.vLigneEstSelectionneeSansZR = function(nLigneAbsolue)
{
	return false;
};

// Vide une cellule de ZR
WDZR.prototype.vVideCellule = function vVideCellule(oCellule)
{
	// Pas d'appel de la methode de la classe de base

	// La suppression des ruptures est fait par l'appel parent

	// Supprime les elements JavaScript pour les reference circulaires entre le DOM et le JS
	var tabElements = this.tabGetElements(oCellule, true);
	var i;
	var nLimiteI = tabElements.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// Gestion des anciennes fonctions : non on supprime l'element
		var oElement = tabElements[i];
		oElement.onchange = null;
		oElement.onblur = null;
		oElement.onfocus = null;
	}

	// Vide la cellule
	SupprimeFils(oCellule);
};

// Remplit une cellule de la ZR
WDZR.prototype.vRemplitCellule = function vRemplitCellule(oCellule, sValeur, nLigneAbsolue, nColonne)
{
	// Pas d'appel de la methode de la classe de base

	// L'ajout des ruptures est fait par l'appel parent

	// Vide la cellule
	this.vVideCellule(oCellule);

	// Et place le contenu dans la cellule
	oCellule.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, false, true);

	var oTmp = this;
	var sCelluleId = oCellule.id;

	// Puis on hook le onblur de tous les champs de la selection
	var tabElements = this.tabGetElements(oCellule, true);
	var i;
	var nLimiteI = tabElements.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// @@@ Gestion des anciennes fonctions ???
		var oElement = tabElements[i];
		if (oElement.onchange === undefined)
		{
			this.SetOnXXX(oElement, "onblur", sCelluleId, nLigneAbsolue, true);
		}
		else
		{
			this.SetOnXXX(oElement, "onblur", sCelluleId, nLigneAbsolue, false);
			this.SetOnXXX(oElement, "onchange", sCelluleId, nLigneAbsolue, true);
		}

		// On doit passer par une fonction pour les valeurs des variables sinon on a la valeurs de i lors de sa destruction
		this.SetOnFocus(oElement, sCelluleId, nLigneAbsolue, i);
	}
};

// On doit passer par une fonction pour les valeurs des variables
WDZR.prototype.SetOnXXX = function(oElement, sFonction, sCelluleId, nLigneAbsolue, bFlag)
{
	var oTmp = this;
	var pfnOld = oElement[sFonction];
	// On ne se rehook pas
	if (pfnOld && (pfnOld.toString().match(/^function\s+SetOnXXX/) != null))
	{
		return;
	}
	if (bIE)
	{
		oElement[sFonction] = function SetOnXXX() { if (pfnOld) pfnOld.apply(oElement); oTmp.OnValideLigneZR(event, sCelluleId, nLigneAbsolue, bFlag); };
	}
	else
	{
		oElement[sFonction] = function SetOnXXX(event) { if (pfnOld) pfnOld.apply(oElement, [event]); oTmp.OnValideLigneZR(event, sCelluleId, nLigneAbsolue, bFlag); };
	}
};

// On doit passer par une fonction pour les valeurs des variables sinon on a la valeurs de i lors de sa destruction
WDZR.prototype.SetOnFocus = function(oElement, sCelluleId, nLigneAbsolue, i)
{
	var oTmp = this;
	var pfnOldFocus = oElement.onfocus;
	// On ne se rehook pas
	if (pfnOldFocus && (pfnOldFocus.toString().match(/^function\s+SetOnFocus/) != null))
	{
		return;
	}
	if (bIE)
	{
		oElement.onfocus = function SetOnFocus() { if (pfnOldFocus) pfnOldFocus.apply(oElement); oTmp.OnFocusLigneZR(event, sCelluleId, nLigneAbsolue, i); };
	}
	else
	{
		oElement.onfocus = function SetOnFocus(event) { if (pfnOldFocus) pfnOldFocus.apply(oElement, [event]); oTmp.OnFocusLigneZR(event, sCelluleId, nLigneAbsolue, i); };
	}
};

// Corrige m_bDebordeLargeur selon le type du champ (pour les ZRs)
// Si la ZR est vide => on trouve scrollWidth a 0 donc on a m_bDebordeLargeur a vrai
WDZR.prototype._vRedimAscenseur = function()
{
	// Pas d'appel de la classe de base

	this.m_bDebordeLargeur = false;
};

// Met a jour les pictos de tri de la table (maintenant que l'on a recu la liste des colonnes)
// Rien dans les ZR
WDZR.prototype.vAffichePictoTriColonnes = function()
{
	// Pas d'appel de la classe de base
};

// Recupere le nombre de colonne de presentation
WDZR.prototype.vnGetNbLignesLogiquesParLignePhysique = function()
{
	return this.m_nNbColonnes;
};

// Valide la ligne selectionnee et envoie la modification au serveur
WDZR.prototype.vOnValideLigneZRExterne = function(oEvent)
{
	// La selection contient les numero de ligne en valeur absolue et pas en valeur affichee
	var nSelectionPosVisible = this.nPosAbsolue2PosVisible(this.m_tabSelection[0]);

	// Recupere l'ID de la cellule depuis son numero de le ligne (pas d'information de colonne car on est pas dans une table)
	var sIDCellule = this.sGetIDCellule(nSelectionPosVisible);

	this.m_sValideLigneZRCelluleId = sIDCellule;
	this.m_nValideLigneZRLigneAbsolue = nSelectionPosVisible;
	this.m_bValideLigneZRChangement = true;

	this._OnValideLigneZR();
};

// Valide une ligne de table et envoie la modification au serveur
WDZR.prototype.OnValideLigneZR = function(oEvent, sCelluleId, nLigneAbsolue, bChangement)
{
	// Si on est dans un lien n'active uniquement si on a recu le focus APRES une modification
	if (this.bEstLienOuImageDansLien(oEvent))
	{
		if (!this.m_bValideLigneZRCelluleDansLien)
		{
			return;
		}
		else
		{
			// Pour ne plus influencer le prochain passage
			delete this.m_bValideLigneZRCelluleDansLien;
		}
	}

	// Si pas de changement : fini
	if (!bChangement && !this.m_bValideLigneZRChangement)
		return;

	// Memorisation du changement
	this.m_bValideLigneZRChangement = true;

	// Pour les gestion du champ qui prend le focus on se fait un setTimeout (1ms)
	// Comme ca le onfocus a le temps de traiter le cas et de nous bloquer
	// Seulement si on n'a pas deja un timeout
	if (!this.m_nValideLigneZRTimeOutId)
	{
		this.m_sValideLigneZRCelluleId = sCelluleId;
		this.m_nValideLigneZRLigneAbsolue = nLigneAbsolue;
		this.m_nValideLigneZRTimeOutId = this.nSetTimeout("_OnValideLigneZR", 1);
	}
};

// Valide une ligne de table et envoie la modification au serveur
WDZR.prototype._OnValideLigneZR = function()
{
	// Recuperation et suppression des proprietes
	var sCelluleId = this.m_sValideLigneZRCelluleId;
	delete this.m_sValideLigneZRCelluleId;
	var nLigneAbsolue = this.m_nValideLigneZRLigneAbsolue;
	delete this.m_nValideLigneZRLigneAbsolue;
	delete this.m_bValideLigneZRChangement;
	delete this.m_nValideLigneZRTimeOutId;

	// Recupere le formulaire a la main
	var tabContenu = this.tabGetElements(oGetId(sCelluleId), false);

	// Et envoi la requete
	// Uniquement si on a des valeurs sinon le serveur fait une erreur de manque de valeurs
	if (tabContenu && (tabContenu.length > 0))
	{
		this.m_oCache.CreeRequeteModifLigne(nLigneAbsolue, true, tabContenu);
	}
};

// Recupere tous les elements formulaire d'une ligne de zone repetee
WDZR.prototype.tabGetElements = function(oCellule, bAvecLien)
{
	var tabElements = new Array();

	if (oCellule)
	{
		// Ajoute dans le tableau les 4 types de champ formulaire
		// La valeur retournee par getElementsByTagName n'est pas un tableau donc :
		// tabElements = tabElements.concat(oCellule.getElementsByTagName("XXX")); ne fonctionne pas

		tabElements = this._tabGetUnTypeElement(oCellule, "BUTTON", tabElements);
		tabElements = this._tabGetUnTypeElement(oCellule, "INPUT", tabElements);
		tabElements = this._tabGetUnTypeElement(oCellule, "SELECT", tabElements);
		tabElements = this._tabGetUnTypeElement(oCellule, "TEXTAREA", tabElements);
		if (bAvecLien)
		{
			tabElements = this._tabGetUnTypeElement(oCellule, "A", tabElements);
		}
	}

	return tabElements;
};

// Indique si le champ source d'un evenement est un lien ou une image dans un lien
WDZR.prototype.bEstLienOuImageDansLien = function(oEvent)
{
	// Si on est dans un lien n'active uniquement si on a recu le focus APRES une modification
	if (!oEvent)
	{
		return false;
	}
	var oChamp = bIE ? oEvent.srcElement : oEvent.target;
	switch (oChamp.tagName.toLowerCase())
	{
		// Selon le cas (on peut avoir une image dans le lien et alors la source est l'image et pas le lien)
		case "img":
			return (oChamp.parentNode.tagName.toLowerCase() == "a");
		case "a":
			return true;
		default:
			return false;
	}
};

// Indique qu'une ligne donnee de la ZR a recu le focus
WDZR.prototype.OnFocusLigneZR = function(oEvent, sCelluleId, nLigneAbsolue, nNumElement)
{
	// Si on a un traitement de focus qui correspond : on le bloque
	if (this.m_nValideLigneZRTimeOutId && (this.m_sValideLigneZRCelluleId == sCelluleId) && (this.m_nValideLigneZRLigneAbsolue == nLigneAbsolue))
	{
		// Si on est dans un lien n'active uniquement si on a recu le focus APRES une modification
		if (this.bEstLienOuImageDansLien(oEvent))
		{
			this.m_bValideLigneZRCelluleDansLien = true;
		}
		clearTimeout(this.m_nValideLigneZRTimeOutId);
		delete this.m_sValideLigneZRCelluleId;
		delete this.m_nValideLigneZRLigneAbsolue;
		// Ne supprime pas le flag de changement
		// delete this.m_bValideLigneZRChange
		delete this.m_nValideLigneZRTimeOutId;
	}

	if (!this.m_bSansLimite)
	{
		var nDefilement = 0;
		// Si la ligne est au debut et a moitie visible ou a la fin : force le defilement
		if ((nLigneAbsolue == this.m_nDebut) && (parseInt(this.m_oDivPos.style.top, 10) < 0))
		{
			nDefilement = parseInt(this.m_oDivPos.style.top, 10);
		}
		else if (nLigneAbsolue >= (this.m_nDebut + this.m_nNbLignesPage))
		{
			nDefilement = parseInt(this.m_oAscenseur.style.height, 10) / this.m_nNbLignes;
		}

		// Si on a un defilement
		if (nDefilement != 0)
		{

//			this.nForceDefilement(nDefilement, null);

			// Et note de redonner le focus
//			this.DonneFocusZR(sCelluleId, nNumElement);
			this.nSetTimeout("DonneFocusZR", 20, nDefilement, sCelluleId, nLigneAbsolue);
		}
	}
};

// Redonne le focus a un champ de la ZR sur une ligne donnee
WDZR.prototype.DonneFocusZR = function(nDefilement, sCelluleId, nLigneAbsolue)
{
	this.nForceDefilement(nDefilement, null);
	var tabContenu = this.tabGetElements(oGetId(sCelluleId));
	// Donne le focus au champ
	var oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
	var nNumElement = (oLigneCache.vnGetLigneHTML(nLigneAbsolue) - this.nGetLigneHTMLDebut()) * this.vnGetNbLignesLogiquesParLignePhysique() + oLigneCache.vnGetColonneHTML();
	if (tabContenu && tabContenu[nNumElement])
	{
		try
		{
			tabContenu[nNumElement].focus();
		}
		catch (e)
		{
		}
	}
};

// Click sur une ligne de zone repetee
WDZR.prototype.OnSelectLigne = function(nLigneRelative, nColonne, oEvent)
{
	// Pas d'appel de la casse de base

	// Si on a une requete en cours : la modification de la selection va etre ecrase donc on l'interdit
	if (this.m_oCache.m_tabRequetes.length > 0) return;

	var nLigneAbsolue = nLigneRelative + this.m_nDebut;

	// Regarde si la ligne est selectionne et ne fait rien si c'est deja le cas
	if (this.nLigneSelectionne(nLigneAbsolue) != -1)
		return;

	// Supprime les autres selections (Normalement une seule ligne)
	this.bLigneDeselectionneTous(-1, oEvent);

	// Selectionne la ligne
	this.bLigneSelectionne(nLigneAbsolue, true, oEvent);

//	// Envoie une requete au serveur demandant le refraichissement de la ligne donnee
//	this.RequeteSelection(-1);
};

// Notifie les champs qu'une ligne va etre masque
WDZR.prototype._vMasqueLigneInterne = function(nLigneAbsolue, bLigneSelectionnee, oEvent)
{
	// Appel de la classe de base
	WDTable.prototype._vMasqueLigneInterne.apply(this, [nLigneAbsolue, bLigneSelectionnee, oEvent]);

	this.m_tabChampsFils.AppelMethode(WDChamp.prototype.ms_sOnLigneZRMasque, [nLigneAbsolue + 1, bLigneSelectionnee, oEvent]);
};

// Action avant la MAJ d'une ligne
WDZR.prototype.vPreMAJLigne = function vPreMAJLigne(nLigneAbsolue, oEvent)
{
	// Indique que la ligne est masque aux champs fils
	// Note : plusieurs endroits invalident m_bPlein sans faire ces appels
	// Ils ne concernent normalement que les tables
	this._vMasqueLigneInterne(nLigneAbsolue, (this.nLigneSelectionne(nLigneAbsolue) != -1), oEvent)
};

// Action apres la MAJ d'une ligne
WDZR.prototype.vPostMAJLigne = function vPostMAJLigne(nLigneAbsolue, oEvent)
{
	// Indique que la ligne est affichee aux champs fils
	var bLigneSelectionnee = (this.nLigneSelectionne(nLigneAbsolue) != -1);
	this.m_tabChampsFils.AppelMethode(WDChamp.prototype.ms_sOnLigneZRAffiche, [nLigneAbsolue + 1, bLigneSelectionnee]);
};
