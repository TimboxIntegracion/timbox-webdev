//#15.00Aa WDSaisieRiche.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Classe de base de manipulation des boutons
// Sert aussi pour les boutons d'action simple
function WDBarreBouton (oObjetParent, oBouton, sCommande, oParamCommande)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		this.m_oObjetParent = oObjetParent;
		this.m_oBouton = oBouton;
		this.m_sCommande = sCommande;
		this.m_oParamCommande = oParamCommande;

		// Hook les methodes des boutons
		var oThis = this;
		if (bIE)
		{
			this.m_oBouton.onmouseover = function() { oThis.OnMouseOver(event); };
			this.m_oBouton.onmouseout = function() { oThis.OnMouseOut(event); };
			this.m_oBouton.onclick = function() { oThis.OnClick(event); };
		}
		else
		{
			this.m_oBouton.onmouseover = function(event) { oThis.OnMouseOver(event); };
			this.m_oBouton.onmouseout = function(event) { oThis.OnMouseOut(event); };
			this.m_oBouton.onclick = function(event) { oThis.OnClick(event); };
		}
	}
}

// Pas d'heritage

// Membre statiques
// Etat des boutons
WDBarreBouton.prototype.ms_nEtatNormal = 0;
WDBarreBouton.prototype.ms_nEtatSurvol = 1;
WDBarreBouton.prototype.ms_nEtatActif = 2;

// Declare les fonction une par une

// Hook les boutons
WDBarreBouton.prototype.PrePlaceBarre = function ()
{
	// Rien
};
WDBarreBouton.prototype.PostPlaceBarre = function ()
{
	// Rien
};

// Gestion de la souris
WDBarreBouton.prototype.OnMouseOver = function(oEvent)
{
	// La souris est au dessus du champ
	this.m_bSurvol = true;

	// Rafraichit le bouton
	this.RafEtatSimple(oEvent);
};

WDBarreBouton.prototype.OnMouseOut = function(oEvent)
{
	// La souris n'est plus au dessus du champ
	delete this.m_bSurvol;

	// Rafraichit le bouton
	this.RafEtatSimple(oEvent);
};

WDBarreBouton.prototype.OnClick = function(oEvent)
{
	// Execute la commande : methode definie dans les classes derivees
	this.ExecuteCommande(oEvent);

	// Rafraichit le bouton
	// => inutile car fait par la gestion des commandes
//	this.RafEtatSimple(oEvent);
};

// Execute la commande
WDBarreBouton.prototype.ExecuteCommande = function(oEvent)
{
	// Execute la fonction
	this.m_oObjetParent[this.m_sCommande](oEvent, this.m_oParamCommande);
};

// Rafraichit le bouton : methode par defaut
WDBarreBouton.prototype.RafEtatSimple = function(oEvent)
{
	this.RafEtat(oEvent, this.m_oObjetParent.oGetParamEtat(oEvent, false));
};

// Rafraichit le bouton : methode par defaut
WDBarreBouton.prototype.RafEtat = function(oEvent, oDataEtat)
{
	// Calcul de l'etat de survol du bouton
	var nEtat = this.m_bSurvol ? this.ms_nEtatSurvol : this.ms_nEtatNormal;

	// Applique ensuite l'etat d'activation
	nEtat = this.nGetEtatSpecifique(oEvent, nEtat, oDataEtat);

	// Puis dessine l'etat
	if (nEtat != this.m_nEtat)
	{
		if (nEtat != this.ms_nEtatNormal)
		{
			this.m_nEtat = nEtat;
		}
		else
		{
			delete this.m_nEtat;
		}
		this.m_oBouton.style.backgroundImage = this.m_oObjetParent.sGetImageBouton(nEtat);
	}
};

// Calcule l'etat specifique du bouton : inchange
WDBarreBouton.prototype.nGetEtatSpecifique = function(oEvent, nEtat, oDataEtat)
{
	return nEtat;
};


// Manipulation d'un bouton On/Off du champ de saisie
function WDBarreBoutonOnOff (oObjetParent, oBouton, sCommande, oParamCommande)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		// Appel le constructeur de la classe de base
		WDBarreBouton.prototype.constructor.apply(this, [oObjetParent, oBouton, sCommande, oParamCommande]);
	}
}

// Declare l'heritage
WDBarreBoutonOnOff.prototype = new WDBarreBouton();
// Surcharge le constructeur qui a ete efface
WDBarreBoutonOnOff.prototype.constructor = WDBarreBoutonOnOff;

// Declare les fonction une par une

// Applique ensuite l'etat d'activation
WDBarreBoutonOnOff.prototype.nGetEtatSpecifique = function(oEvent, nEtat, oDataEtat)
{
	// Si on a un etat surcharge
	// Appele la methode des classes derive de calcul de l'etat
	if (this.bActif(oEvent, oDataEtat))
	{
		return this.ms_nEtatActif;
	}
	else
	{
		return WDBarreBouton.prototype.nGetEtatSpecifique.apply(this, [oEvent, nEtat, oDataEtat]);
	}
};

// Pas de surcharge de l'etat par defaut
WDBarreBoutonOnOff.prototype.bEtatSurcharge = function(oEvent, oDataEtat)
{
	return false;
};

// Manipulation d'un bouton dropdown du champ de saisie
function WDBarreBoutonPopup (oObjetParent, oBouton, sCommande, oParamCommande, oPopup)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		// Appel le constructeur de la classe de base
		WDBarreBouton.prototype.constructor.apply(this, [oObjetParent, oBouton, sCommande, oParamCommande]);

		this.m_oPopup = oPopup;

		// Hook les methodes des boutons
		var oThis = this;
		var fClickPopup;
		if (bIE)
		{
			this.m_oBouton.getElementsByTagName("IMG")[0].onclick = function() { oThis.OnClick(event); };
			fClickPopup = function() { oThis.OnClickP(event); return bStopPropagation(event); };
		}
		else
		{
			this.m_oBouton.getElementsByTagName("IMG")[0].onclick = function(event) { oThis.OnClick(event); };
			fClickPopup = function(event) { oThis.OnClickP(event); return bStopPropagation(event); };
		}

		// Et les clics de la popup
		var tabTD = this.m_oPopup.getElementsByTagName("TD");
		for (var oTD in tabTD)
		{
			tabTD[oTD].onmousedown = fClickPopup;
		}

		this.m_bSurvol = false;
	}
}

// Declare l'heritage
WDBarreBoutonPopup.prototype = new WDBarreBouton();
// Surcharge le constructeur qui a ete efface
WDBarreBoutonPopup.prototype.constructor = WDBarreBoutonPopup;

// Declare les fonction une par une

// Surcharge des fonctions de survol
WDBarreBoutonPopup.prototype.OnMouseOver = function(oEvent)
{
	// Filtre les cas ou le focus reste dans le TD
	if (!this.m_bSurvol)
	{
		// Rappel de la methode de la classe de base
		WDBarreBouton.prototype.OnMouseOver.apply(this, [oEvent]);
	}
};

WDBarreBoutonPopup.prototype.OnMouseOut = function(oEvent)
{
	// Detecte si la souris quitte vraiment l'objet
	var oDestination = bIE ? oEvent.toElement : oEvent.relatedTarget;
	if (bEstFils(oDestination, this.m_oBouton, document))
	{
		// L'element qui recoit la souris est encore dans le bouton : ne masque pas la popup
		return;
	}

	// Masque la popup
	SetDisplay(this.m_oPopup, false);

	// Rappel de la methode de la classe de base
	WDBarreBouton.prototype.OnMouseOut.apply(this, [oEvent]);
};

// Execute la commande : affiche la popup
WDBarreBoutonPopup.prototype.ExecuteCommande = function(oEvent)
{
	SetDisplay(this.m_oPopup, true);
};

// Clic sur un element : a definir dans les classes derivees
WDBarreBoutonPopup.prototype.OnClickP = function(oEvent)
{
	// Ferme la popup
	SetDisplay(this.m_oPopup, false);

	// L'element n'est plus survole
	WDBarreBouton.prototype.OnMouseOut.apply(this, [oEvent]);

	// Pour une raison non claire, on a un evenement MouseOver appele apres avoir masque le menu : on le bloque
	var oThis = this;
	setTimeout(function() { oThis.OnMouseOut(bIE ? { toElement: null} : { relatedTarget: null }); }, 100);
};

// Manipulation d'une popup "menu"
function WDBarreBoutonPopupMenu (oObjetParent, oBouton, sCommande, oPopup, tabOptions)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		// Appel le constructeur de la classe de base
		WDBarreBoutonPopup.prototype.constructor.apply(this, [oObjetParent, oBouton, sCommande, null, oPopup]);

		// Memorise le tableau des options
		this.m_tabOptions = tabOptions;

		// Calcul les fonctions
		var oThis = this;
		var fOnMouseOver, fOnMouseOut;
		if (bIE)
		{
			fOnMouseOver = function() { oThis.OnMouseOverMenu(event); };
			fOnMouseOut = function() { oThis.OnMouseOutMenu(event); };
		}
		else
		{
			fOnMouseOver = function(event) { oThis.OnMouseOverMenu(event); };
			fOnMouseOut = function(event) { oThis.OnMouseOutMenu(event); };
		}

		// Et fixe le texte dans les options
		var i;
		var nLimiteI = this.m_tabOptions.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var oSPAN = document.createElement("SPAN");
			var oTexte = document.createTextNode(this.m_tabOptions[i].sTexte);
			oSPAN.appendChild(oTexte);
			this.m_tabOptions[i].oTD.appendChild(oSPAN);
			this.m_tabOptions[i].oTD.noWrap = "true";
			this.m_tabOptions[i].oTD.onmouseover = fOnMouseOver;
			this.m_tabOptions[i].oTD.onmouseout = fOnMouseOut;
		}
	}
}

// Declare l'heritage
WDBarreBoutonPopupMenu.prototype = new WDBarreBoutonPopup();
// Surcharge le constructeur qui a ete efface
WDBarreBoutonPopupMenu.prototype.constructor = WDBarreBoutonPopupMenu;
WDBarreBoutonPopupMenu.prototype.m_nOptionSurvol = -1;

// Declare les fonction une par une

WDBarreBoutonPopupMenu.prototype.OnMouseOverMenu = function(oEvent)
{
	// Indique quelle option est survolee
	var nOptionSurvol = this.__nGetOptionEvent(oEvent);
	if (this.m_nOptionSurvol != nOptionSurvol)
	{
		this.m_nOptionSurvol = nOptionSurvol;
	}

	// Rafraichit les options du sous menu si besoin
	this.__RafEtatOptions(oEvent);
};

WDBarreBoutonPopupMenu.prototype.OnMouseOutMenu = function(oEvent)
{
	// Indique quelle option est survolee
	var nOptionSurvol = this.__nGetOptionEvent(oEvent);
	if (this.m_nOptionSurvol == nOptionSurvol)
	{
		delete this.m_nOptionSurvol;
	}

	// Rafraichit les options du sous menu si besoin
	this.__RafEtatOptions(oEvent);
};

// Trouve l'option parent
WDBarreBoutonPopupMenu.prototype.__nGetOptionEvent = function(oEvent)
{
	var oSource = bIE ? oEvent.srcElement : oEvent.target;
	var i;
	var nLimiteI = this.m_tabOptions.length;
	for (i = 0; i < nLimiteI; i++)
	{
		if (bEstFils(oSource, this.m_tabOptions[i].oTD, document))
		{
			return i;
		}
	}

	return -1;
};

// Rafraichit les options du sous menus
WDBarreBoutonPopupMenu.prototype.ExecuteCommande = function(oEvent)
{
	// Appel de la classe de base
	WDBarreBoutonPopup.prototype.ExecuteCommande.apply(this, [oEvent]);

	// Rafraichit les options du sous menu si besoin
	this.__RafEtatOptions(oEvent);
};

// Rafraichit les options du sous menu si besoin
WDBarreBoutonPopupMenu.prototype.__RafEtatOptions = function(oEvent)
{
	var i;
	var nLimiteI = this.m_tabOptions.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// Aucune option n'est survolee
		this.__RafEtatOption(oEvent, i, this.m_nOptionSurvol);
	}
};

// Rafraichit l'etat d'un bouton lors de l'ouverture du menu
WDBarreBoutonPopupMenu.prototype.__RafEtatOption = function(oEvent, nOption, nOptionSurvol)
{
	// Regarde si l'option est active
	var oOption = this.m_tabOptions[nOption];
	var nEtat = this.__nGetEtatSpecifiqueOption(oEvent, (nOption != nOptionSurvol) ? this.ms_nEtatNormal : this.ms_nEtatSurvol, oOption);

	// Puis dessine l'etat
	if (nEtat != oOption.m_nEtat)
	{
		if (nEtat != this.ms_nEtatNormal)
		{
			oOption.m_nEtat = nEtat;
		}
		else
		{
			delete oOption.m_nEtat;
		}
		oOption.oTD.style.backgroundImage = this.m_oObjetParent.sGetImageBouton(nEtat);

	}
};

// Regarde si l'option est active
WDBarreBoutonPopupMenu.prototype.__nGetEtatSpecifiqueOption = function(oEvent, nEtat, oOption)
{
	// Si on a un etat surcharge
	return this.m_oObjetParent.bActifOption(oEvent, oOption.oParamCommande) ? this.ms_nEtatActif : nEtat;
};

// Clic sur une option : trouve la commande associe et l'execute
WDBarreBoutonPopupMenu.prototype.OnClickP = function(oEvent)
{
	// Trouve l'option parent
	var nOption = this.__nGetOptionEvent(oEvent);
	if (nOption != -1)
	{
		// Fixe les parametres de la commande
		this.m_oParamCommande = this.m_tabOptions[nOption].oParamCommande;
	}

	// Appel la methode dans ExecuteCommande en evitant l'implementation de la classe parent
	WDBarreBouton.prototype.ExecuteCommande.apply(this, [oEvent]);

	// Appel de la classe de base (ferme le menu)
	WDBarreBoutonPopup.prototype.OnClickP.apply(this, [oEvent]);
};

// Manipulation d'une popup "menu" avec selection du bouton parent si un des fils est selectionne
function WDBarreBoutonPopupMenuS (oObjetParent, oBouton, sCommande, oPopup, tabOptions)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetParent)
	{
		// Appel le constructeur de la classe de base
		WDBarreBoutonPopupMenu.prototype.constructor.apply(this, [oObjetParent, oBouton, sCommande, oPopup, tabOptions]);
	}
}

// Declare l'heritage
WDBarreBoutonPopupMenuS.prototype = new WDBarreBoutonPopupMenu();
// Surcharge le constructeur qui a ete efface
WDBarreBoutonPopupMenuS.prototype.constructor = WDBarreBoutonPopupMenuS;

// Declare les fonction une par une

// Calcule l'etat specifique du bouton : inchange
WDBarreBoutonPopupMenuS.prototype.nGetEtatSpecifique = function(oEvent, nEtat, oDataEtat)
{
	// Si on a une option d'activee
	var i;
	var nLimiteI = this.m_tabOptions.length;
	for (i = 0; i < nLimiteI; i++)
	{
		if (this.m_oObjetParent.bActifOption(oEvent, this.m_tabOptions[i].oParamCommande))
		{
			return this.ms_nEtatActif;
		}
	}

	// Aucune option du menu n'est active : appele la methode de la classe de base
	return WDBarreBoutonPopupMenu.prototype.nGetEtatSpecifique.apply(this, [oEvent, nEtat, oDataEtat]);
};

// Classe de base pour un champ avec une barre
function WDBarre(sAliasChamp, sAliasZR, sAliasAttribut, eModeBarre, sImageSurvol, sImageActif)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, sAliasZR, sAliasAttribut]);

		// Mode de la barre
		this.m_eModeBarre = (eModeBarre !== undefined) ? eModeBarre : this.ms_nModeBarreAutomatique;
		// Image de survol
		this.m_tabImagesBoutons = new Array();
		this.m_tabImagesBoutons[WDBarreBouton.prototype.ms_nEtatNormal] = "";
		this.m_tabImagesBoutons[WDBarreBouton.prototype.ms_nEtatSurvol] = sImageSurvol ? sImageSurvol : (_WD_ + "res/" + this.ms_sImageSurvolDefaut);
		(new Image()).src = this.m_tabImagesBoutons[WDBarreBouton.prototype.ms_nEtatSurvol];
		this.m_tabImagesBoutons[WDBarreBouton.prototype.ms_nEtatActif] = sImageActif ? sImageActif : (_WD_ + "res/" + this.ms_sImageActifDefaut);
		(new Image()).src = this.m_tabImagesBoutons[WDBarreBouton.prototype.ms_nEtatActif];
	}
};

// Declare l'heritage
WDBarre.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDBarre.prototype.constructor = WDBarre;

// Membres statiques
WDBarre.prototype.ms_sImageSurvolDefaut = "Bkg_Mover.gif";
WDBarre.prototype.ms_sImageActifDefaut = "Bkg_Select.gif";
WDBarre.prototype.ms_nModeBarreAutomatique = 0;
WDBarre.prototype.ms_nModeBarreToujours = 1;
WDBarre.prototype.ms_nModeBarreJamais = 2;
WDBarre.prototype.ms_nBoutonOnOff = 0;			// WDSaisieRicheBtn
WDBarre.prototype.ms_nBoutonPopup = 1;			// WDBarreBoutonPopup
WDBarre.prototype.ms_nBoutonAction = 2;			// WDSaisieRicheBtnC
WDBarre.prototype.ms_nCombo = 3;				// WDSaisieRicheCbm
WDBarre.prototype.ms_nBoutonPopupMenu = 4;		// WDBarreBoutonPopupMenu
WDBarre.prototype.ms_nBoutonPopupMenuS = 5;		// WDBarreBoutonPopupMenuS
WDBarre.prototype.ms_sSuffixeCommande = "_COM";
WDBarre.prototype.ms_tabClassBordures = ["", "_TDG", "_TDD", "_TDGD"];
WDBarre.prototype.ms_nMarqueBordureGauche = 0x1;
WDBarre.prototype.ms_nMarqueBordureDroite = 0x2;

// Declare les fonction une par une

// Initialisation
WDBarre.prototype.Init = function Init(tabBoutonsInfo)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Initialisation de la barre
	this._InitBarre(tabBoutonsInfo);
};

// Initialisation de la barre dans l'init
WDBarre.prototype._InitBarre = function _InitBarre(tabBoutonsInfo)
{
	// La barre est une seule fois dans la page : pas de recherche en tenant compte de la ZR
	this.m_oBarre = this.oGetElementById(document, this.ms_sSuffixeCommande);

	// Selon le mode de la barre
	switch (this.m_eModeBarre)
	{
	// Toujours :
	case this.ms_nModeBarreToujours:
		SetDisplay(this.m_oBarre, true);
		// Utilise la definition par la classe derive pour le hook du rafraichissement
		this._InitBarreAutomatique();
		break;
	// Jamais:
	case this.ms_nModeBarreJamais:
		// Rien
		break;
	// Automatique
	case this.ms_nModeBarreAutomatique:
	default:
		// Utilise la definition par la classe derive
		this._InitBarreAutomatique();
		break;
	}

	// Initialise les boutons de la barre
	this.m_tabBarreElements = new Array();
	this._InitBarreBoutons(tabBoutonsInfo);
};

// Initialise les boutons de la barre d'outils
WDBarre.prototype._InitBarreBoutons = function _InitBarreBoutons(tabBoutonsInfo)
{
	// m_tabDescBarre est un tableau definies par les classes derivees
	// Chaque ligne contient au minimum 3 parametres :
	// - nType : Type du bouton
	// - sSuf : Suffixe du bouton
	// - sCom : Commande associee
	// Les classes derives doivent implementer les classes de creation pour creer leur bon objet du bon type derive

	// Creation des boutons
	var i;
	var nLimiteI = this.m_tabDescBarre.length;
	for (i = 0; i < nLimiteI; i++)
	{
		var oDesc = this.m_tabDescBarre[i];
		// Comme this.m_tabDescBouton est un tableau inline, on semble lister aussi la propriete .length que l'on ne veux pas
		if (oDesc)
		{
			var oBouton = null;
			var oElementBarre = this.oGetElementByIdBarre(document, oDesc.sSuf);
			switch (oDesc.nType)
			{
				case this.ms_nBoutonOnOff:
					oBouton = this._voNewBoutonOnOff(oElementBarre, oDesc);
					break;
				case this.ms_nBoutonPopup:
					oBouton = this._voNewBoutonPopup(oElementBarre, oDesc);
					break;
				case this.ms_nBoutonAction:
					oBouton = this._voNewBoutonAction(oElementBarre, oDesc);
					break;
				case this.ms_nCombo:
					oBouton = this._voNewBoutonCombo(oElementBarre, oDesc);
					break;
				case this.ms_nBoutonPopupMenu:
					oBouton = this._voNewBoutonMenu(oElementBarre, oDesc);
					break;
				case this.ms_nBoutonPopupMenuS:
					oBouton = this._voNewBoutonMenuS(oElementBarre, oDesc);
					break;
			}

			// Ajoute le bouton
			if (oBouton)
			{
				this.m_tabBarreElements.push(oBouton);
				// Traite les options du bouton
				if (tabBoutonsInfo && tabBoutonsInfo[oDesc.sSuf])
				{
					// Visibilite
					if (tabBoutonsInfo[oDesc.sSuf].bVisible !== undefined)
					{
						// Si l'element est une combo, il faut remonter d'un cran
						if ("select" == oElementBarre.tagName.toLowerCase())
						{
							oElementBarre = oElementBarre.parentNode;
						}
						SetDisplay(oElementBarre, tabBoutonsInfo[oDesc.sSuf].bVisible);
					}
					// Bordures
					if (tabBoutonsInfo[oDesc.sSuf].nSeparateurs !== undefined)
					{
						oElementBarre.className = this.sGetNomElement(this.ms_sSuffixeCommande + this.ms_tabClassBordures[tabBoutonsInfo[oDesc.sSuf].nSeparateurs]);
					}
				}
			}
		}
	}
};

// Creation des boutons de la barre d'outils

// Boutons on/off
WDBarre.prototype._voNewBoutonOnOff = function _voNewBoutonOnOff(oElementBarre, oDesc)
{
	return null;
};
// Boutons popup
WDBarre.prototype._voNewBoutonPopup = function _voNewBoutonPopup(oElementBarre, oDesc)
{
	return null;
};
// Boutons action
WDBarre.prototype._voNewBoutonAction = function _voNewBoutonAction(oElementBarre, oDesc)
{
	return null;
};
// Combos
WDBarre.prototype._voNewBoutonCombo = function _voNewBoutonCombo(oElementBarre, oDesc)
{
	return null;
};
// Menus
WDBarre.prototype._voNewBoutonMenu = function _voNewBoutonMenu(oElementBarre, oDesc)
{
	return null;
};
// Menus avec highlight du parent si un element est selectionne
WDBarre.prototype._voNewBoutonMenuS = function _voNewBoutonMenuS(oElementBarre, oDesc)
{
	return null;
};

WDBarre.prototype.oGetElementByIdBarre = function oGetElementByIdBarre(oDocument, sSuffixe)
{
	// Trouve l'element
	var oElement = this.oGetElementById(oDocument, this.ms_sSuffixeCommande + "_" + sSuffixe);

	// Et en profite pour lui donner son texte alternatif
	if (oElement)
	{
		this.__sAppliqueBulle(oElement, sSuffixe);
	}
	return oElement;
};

// Met a jour la barre d'outils
WDBarre.prototype.RafBarre = function (oEvent, bAfficheBarre)
{
	// Si le champ est desactive : masque la barre
	if (this.eGetEtat() != WDChamp.prototype.ms_eEtatActif)
	{
		bAfficheBarre = false;
	}

	// Selon le mode de la barre
	switch (this.m_eModeBarre)
	{
	// Jamais : rien a faire
	case this.ms_nModeBarreJamais:
		// Rien
		break;

	// Automatique : calcule l'etat de la barre
	case this.ms_nModeBarreAutomatique:
	default:
		// Et affiche la barre si besoin
		if (bAfficheBarre)
		{
			// Affiche la barre
			SetDisplay(this.m_oBarre, true);
		}
		else
		{
			// Masque la barre
			SetDisplay(this.m_oBarre, false);
			// Pas besoin de la MAJ des boutons
			break;
		}
		// Pas de break;

	// Toujours + automatique : MAJ des boutons
	case this.ms_nModeBarreToujours:
		var oDataEtat = this.oGetParamEtat(oEvent, false);

		// Demande a chaque element de la barre
		var i;
		var nLimiteI = this.m_tabBarreElements.length;
		for (i = 0; i < nLimiteI; i++)
		{
			this.m_tabBarreElements[i].RafEtat(oEvent, oDataEtat);
		}
		break;
	}
};

// Recupere les parametres pour RafEtat
WDBarre.prototype.oGetParamEtat = function(oEvent, bSimple)
{
	return null;
};

// Recupere l'image de fond des bouton
// 0 : Normal
// 1 : Survol
// 2 : Actif
WDBarre.prototype.sGetImageBouton = function (nEtat)
{
	var sImage = this.m_tabImagesBoutons[nEtat];
	if (sImage.length > 0)
	{
		return "url(" + sImage + ")";
	}
	else
	{
		return "";
	}
};

// Applique la bulle a l'element
WDBarre.prototype.__sAppliqueBulle = function (oElement, sSuffixe)
{
	var sAltTexte = this.sGetAltText(sSuffixe);
	if (sAltTexte)
	{
		// Traite le cas des images
		var tabFils = oElement.getElementsByTagName("IMG");
		if (tabFils.length)
		{
			tabFils[0].alt = sAltTexte;
		}
		// Traite le cas des combos
		tabFils = oElement.getElementsByTagName("SELECT");
		if (tabFils.length)
		{
			tabFils[0].title = sAltTexte;
		}
	}
};

// Recupere le texte alternatif d'un bouton
// A surcharger par les classes derivees si besoin
WDBarre.prototype.sGetAltText = function (sSuffixe)
{
	return null;
};

// Masque la barre d'outil a la demande d'un autre champ
WDBarre.prototype.MasqueBarre = function(oEvent)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.MasqueBarre.apply(this, [oEvent]);

	if (this.m_eModeBarre == this.ms_nModeBarreAutomatique)
	{
		SetDisplay(this.m_oBarre, false);
	}
};

// Deplace la barre
WDBarre.prototype.DeplaceBarre = function (oHoteBarre)
{
	if (oHoteBarre)
	{
		// Demande a chaque element de la barre
		var i;
		var nLimiteI = this.m_tabBarreElements.length;
		for (i = 0; i < nLimiteI; i++)
		{
			this.m_tabBarreElements[i].PrePlaceBarre();
		}

		this.m_oBarre = oHoteBarre.insertBefore(this.m_oBarre, null);

		for (i = 0; i < nLimiteI; i++)
		{
			this.m_tabBarreElements[i].PostPlaceBarre();
		}
	}
};
