//#15.00Aa WDZRHorizontale.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation des champs zone repetee galerie

// Manipulation d'une zone repetee galerie
function WDZRHorizontale(sAliasChamp)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, undefined, undefined]);

		// Rien pour l'instant
	}
};

// Declare l'heritage
WDZRHorizontale.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDZRHorizontale.prototype.constructor = WDZRHorizontale;

// Pas de l'augmentation de la vitesse de defilement
WDZRHorizontale.prototype.ms_nPasDefilement = 8;

// Initialisation
WDZRHorizontale.prototype.Init = function Init()
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Recupere les differents champs caches
	this.m_oChamp = this.oGetElementByName(document);
	this.m_oChampDeb = this.oGetElementByName(document, "_DEB");
	this.m_oChampOcc = this.oGetElementByName(document, "_OCC");
	this.m_oChampPos = this.oGetElementByName(document, "_POSV");

	// Recupere la partie defilante de la ZR
	this.m_oDivPos = this.oGetIDElement("POS");
	this.m_oDivPosTable = this.m_oDivPos.getElementsByTagName("TABLE")[0];
	this.m_oDivPosParent = this.m_oDivPos.parentNode;
	this.m_oDivScrollBar = this.oGetIDElement("SB");

//	// Fixe le contenu du div de positionnement
//	if (bIEQuirks)
//	{
//		this.m_oDivPos.style.width = Math.min(this.m_oDivPosParent.offsetWidth, this.m_oDivPosTable.offsetWidth) + "px";
//		this.m_oDivScrollBar.parentNode.style.overflow = "hidden";
//	}

	// Intialisation du defilement
	this._InitDefilement();

	// Hook le resizing pour deplacer les elements en cas de changement de geometrie
	// => Pas de hook on est deja automatiquement appele sur la methode OnResize

	// Positionne le champ
	this._InitDeplace();
};

// Pas de fonction pour la gestion des Pcodes il faut utiliser directement DeclarePCode et RecuperePCode

// Intialisation du defilement
WDZRHorizontale.prototype._InitDefilement = function _InitDefilement()
{
	// Le gestionnaire de glissement de la barre en base
	this.m_oDragScrollBar = new WDDragScrollBar(this);
	this.m_oDragScrollBar.Init();

	// La gestion du defilement sur les boutons gauche et droite
	this._InitBoutons();
	// La gestion du defilement sur le fond de la barre de defilement
	this._InitDefilementFondSB()
};

// La gestion du defilement sur les boutons gauche et droite
WDZRHorizontale.prototype._InitBoutons = function _InitBouton()
{
	this._InitUnBouton("BG", false);
	this._InitUnBouton("BD", true);
};

// La gestion du defilement sur un des boutons
WDZRHorizontale.prototype._InitUnBouton = function _InitUnBouton(sSuffixe, bDroite)
{
	// Intercepte le bouton down, le bouton up
	// On en gere pas le clic car on veux un defilement immediat
	var oBtn = this.oGetIDElement(sSuffixe);
	var oThis = this;
	HookOnXXX(oBtn, 'onmousedown', 'mousedown', function(oEvent) { oThis.OnMouseDownBtn.apply(oThis, [oEvent ? oEvent : event, bDroite]); return bStopPropagation(oEvent ? oEvent : event); });
	HookOnXXX(oBtn, 'onmouseup', 'mouseup', function(oEvent) { oThis.OnMouseUpBtn.apply(oThis, [oEvent ? oEvent : event, bDroite, true]); return bStopPropagation(oEvent ? oEvent : event); });
};

// La gestion du defilement sur le fond de la barre de defilement
WDZRHorizontale.prototype._InitDefilementFondSB = function _InitDefilementFondSB()
{
	var oThis = this;
	HookOnXXX(this.m_oDivScrollBar.parentNode, 'onmousedown', 'mousedown', function(oEvent) { oThis.OnMouseDownFondSB.apply(oThis, [oEvent ? oEvent : event]); return bStopPropagation(oEvent ? oEvent : event); });
	// Il faut intercepter cet evenement sur le document sinon on ne recoit pas le relachement du bouton hors de la barre
	HookOnXXX(document, 'onmouseup', 'mouseup', function(oEvent) { oThis.OnMouseUpFondSB.apply(oThis, [oEvent ? oEvent : event]); return bStopPropagation(oEvent ? oEvent : event); });
	HookOnXXX(document, 'onmousemove', 'mousemove', function(oEvent) { oThis.OnMouseMoveFondSB.apply(oThis, [oEvent ? oEvent : event]); return bStopPropagation(oEvent ? oEvent : event); });
};

// Positionne le champ en fonction de la valeur initiale du positionnement
WDZRHorizontale.prototype._InitDeplace = function _InitDeplace()
{
	// Recupere la valeur initiale
	var nPosition = parseInt(this.m_oChampPos.value, 10);
	// Filtre les valeurs invalides
	if (isNaN(nPosition) || (nPosition < 0))
	{
		nPosition = 0;
	}

	// Positionne le champ
	// Appele la methode interne commune qui reecrit dans m_oChampPos car on peut avoir modifie la valeur
	this._Deplace(nPosition);
};

// Positionne le champ en fonction d'une position et la memorise
WDZRHorizontale.prototype._Deplace = function _Deplace(nPosition)
{
	// Uniquement si la position change
	if (this.m_nPosition != nPosition)
	{
		// Memorise la nouvelle position
		this.m_nPosition = nPosition;
		this.m_oChampPos.value = nPosition;

		// Deplace les elements graphiques
		this._DeplaceElements();
	}
};

// Recupere les differentes largeurs
WDZRHorizontale.prototype.nGetLargeurTotale = function nGetLargeurTotale()
{
//	return this.m_oDivPos.offsetWidth;
//	return this.m_oDivPos.scrollWidth;
	return this.m_oDivPosTable.offsetWidth;
}
WDZRHorizontale.prototype.nGetLargeurCliente = function nGetLargeurCliente()
{
	return this.m_oDivPosParent.clientWidth;
}
WDZRHorizontale.prototype.nGetLargeurClienteSB = function nGetLargeurClienteSB()
{
	return this.m_oDivScrollBar.parentNode.clientWidth;
}

// Positionne les elements graphique du champ en fonction de la position courante
WDZRHorizontale.prototype._DeplaceElements = function _DeplaceElements()
{
	// Recupere la taille totale de la zone a defiler
	var nLargeurTotale = this.nGetLargeurTotale();
	var nLargeurCliente = this.nGetLargeurCliente();
	var nLargeurClienteSB = this.nGetLargeurClienteSB();

	// Valeur qui seront calculees
	// - Deplacement horizontal de la zone au pixel
	// - Position de l'ascenseur
	// - Largeur de l'ascenseur
	var nScrollLeft = this.m_nPosition;
	var nLeft = 0;
	var nWidth = 0;

	// Si on a trop de place
	if (nLargeurTotale <= nLargeurCliente)
	{
		// Positionne la zone au pixel au centre avec une valeur negative
		nScrollLeft = parseInt(-(nLargeurCliente - nLargeurTotale) / 2);

		// Positionne la barre de defilement pour prendre toute la place
		nLeft = 0;
		nWidth = nLargeurClienteSB;
	}
	else
	{
		// Il y a un defilement

		// Positionne la zone au pixel mais pas trop loin
		// En revanche on ne corrige pas la position
		if ((nLargeurTotale - nScrollLeft) < nLargeurCliente)
		{
			nScrollLeft = nLargeurTotale - nLargeurCliente;
		}

		// Positionne la barre de defilement
		nLeft = parseInt(nScrollLeft * nLargeurClienteSB / nLargeurTotale);
		nWidth = parseInt(nLargeurCliente * nLargeurClienteSB / nLargeurTotale);
	}

	this.m_oDivPosParent.scrollLeft = nScrollLeft;
	this.m_oDivScrollBar.style.left = nLeft + "px";
	this.m_oDivScrollBar.style.width = nWidth + "px";
};

// Fonction appele en cas de redimensionnement de la fenetre
// Evenement sur le rechargement du champ
WDZRHorizontale.prototype.OnResize = function OnResize(oEvent)
{
	// Appel de la classe de base
	WDChamp.prototype.OnResize.apply(this, [oEvent]);

	// Force le redessin de la barre
	this._DeplaceElements();
};

// Debut du clic sur un des boutons de defilement
WDZRHorizontale.prototype.OnMouseDownBtn = function OnMouseDownBtn(oEvent, bDroite)
{
	// Normalement il n'y a plus de timer mais on le supprime au besoin
	this.OnMouseUpBtn(oEvent, bDroite, false);

	// Effectue un premier deplacement
	this.m_nDefilementV = this.ms_nPasDefilement;
	this.OnDefilementBouton(bDroite);

	// Lance le timer du deplacement
	this[this.sNomVariableTimeXXX("OnDefilementBouton")] = this.nSetInterval("OnDefilementBouton", 50, bDroite);
};

// Fin du clic sur un des boutons de defilement
WDZRHorizontale.prototype.OnMouseUpBtn = function OnMouseUpBtn(oEvent, bDroite, bDepuisUp)
{
	// Probleme avec IE, sur une serie de clic rapide on recoit Down, Up, Up et pas Down, Up, Down, Up
	// Donc si on recoit un Up seul, on force un defilement
	if (bIE && bDepuisUp && !this.bGetTimeXXXExiste("OnDefilementBouton"))
	{
		// Effectue un premier deplacement
		this.m_nDefilementV = this.ms_nPasDefilement;
		this.OnDefilementBouton(bDroite);
	}
	// Normalement il y a un timer mais on le supprime uniquement s'il existe
	this.AnnuleTimeXXX("OnDefilementBouton", true);
};

// Effectue un deplacement du contenu par appuis continu sur le bouton
WDZRHorizontale.prototype.OnDefilementBouton = function OnDefilementBouton(bDroite)
{
	// Effectue le defilement avec le pas courant
	this.OnDefilement(bDroite, this.m_nDefilementV);

	// Augmente la vitesse de defilement
	if (this.m_nDefilementV <= this.ms_nPasDefilement * 10)
	{
		this.m_nDefilementV += this.ms_nPasDefilement;
	}
};

// Debut du clic sur le fond de l'ascenseur
WDZRHorizontale.prototype.OnMouseDownFondSB = function OnMouseDownFondSB(oEvent)
{
	// Normalement il n'y a plus de timer mais on le supprime au besoin
	this.OnMouseUpFondSB(oEvent);

	// Effectue un premier deplacement
	// En memorisant la position de clic car on n'aura pas l'evenement dans le timer
	this.m_nClientX = oEvent.clientX;
	this.OnDefilementFondSB();

	// Lance le timer du deplacement, la repetition est 'lente' (300-500ms)
	// Normalement le comportement est : une repetition 'lente' puis des repetitions 'rapides' (50-100ms)
	this[this.sNomVariableTimeXXX("OnDefilementFondSB")] = this.nSetInterval("OnDefilementFondSB", 300);
};

// Fin du clic sur un des boutons de defilement
WDZRHorizontale.prototype.OnMouseUpFondSB = function OnMouseUpFondSB(oEvent)
{
	// Normalement il y a un timer mais on le supprime uniquement s'il existe
	this.AnnuleTimeXXX("OnDefilementFondSB", true);
};

// MAJ des coordonnees de la souris si le bouton est enfonce
WDZRHorizontale.prototype.OnMouseMoveFondSB = function OnMouseMoveFondSB(oEvent)
{
	this.m_nClientX = oEvent.clientX;
};

// Effectue un deplacement du contenu par appuis continu sur le fond de l'ascenseur
WDZRHorizontale.prototype.OnDefilementFondSB = function OnDefilementFondSB()
{
	// Verifie que le clic n'est pas sur l'ascenseur et en profite pour calculer si on est a droite ou a gauche
	var bDroite;
	var nClientXLocal = _JCCP(this.m_nClientX, this.m_oDivScrollBar, true, false);
	if (nClientXLocal < this.m_oDivScrollBar.offsetLeft)
	{
		bDroite = false;
	}
	else if (nClientXLocal > (this.m_oDivScrollBar.offsetLeft + this.m_oDivScrollBar.offsetWidth))
	{
		bDroite = true;
	}
	else
	{
		return;
	}

	// Calcule le pas : 90% de l'ecran
	var nPas = Math.ceil(this.nGetLargeurCliente() * 0.9);

	// Effectue le defilement avec le pas courant
	this.OnDefilement(bDroite, nPas);
};

// Effectue un deplacement du contenu d'une quantite fixe
WDZRHorizontale.prototype.OnDefilement = function OnDefilement(bDroite, nPas)
{
	// Effectue le defilement
	var nPosition;
	if (bDroite)
	{
		nPosition = this.m_nPosition + nPas;
	}
	else
	{
		nPosition = this.m_nPosition - nPas;
	}

	// Limite le deplacement
	nPosition = Math.min(nPosition, this.nGetLargeurTotale() - this.nGetLargeurCliente());
	nPosition = Math.max(nPosition, 0);

	this._Deplace(nPosition);
};

// Le gestionnaire de glissement de la barre en base
function WDDragScrollBar (oObjetZRHorizontale)
{
	// Si on est pas dans l'init d'un protoype
	if (oObjetZRHorizontale)
	{
		// Appel le constructeur de la classe de base
		WDDrag.prototype.constructor.apply(this, [true]);

		// Sauve l'objet attache
		this.m_oObjetZRHorizontale = oObjetZRHorizontale;
	}
};

// Declare l'heritage
WDDragScrollBar.prototype = new WDDrag();
// Surcharge le constructeur qui a ete efface
WDDragScrollBar.prototype.constructor = WDDragScrollBar;

// Intialisation
WDDragScrollBar.prototype.Init = function Init()
{
	// Appel de la methode de la classe de base
	WDDrag.prototype.Init.apply(this, []);

	// Intercepte le click sur la barre
	HookOnXXX(this.m_oObjetZRHorizontale.m_oDivScrollBar, 'onmousedown', 'mousedown', this.m_fMouseDown);
}

// Appel lors du debut d'un click pour le deplacement
// Pose les hooks
WDDragScrollBar.prototype.OnMouseDown = function OnMouseDown(oEvent)
{
	// Appel de la classe de base : sauve la position de la souris et place les hooks
	WDDrag.prototype.OnMouseDown.apply(this, [oEvent]);

	// Sauve la position originale
	this.m_nPosition = this.m_oObjetZRHorizontale.m_nPosition;
};

// Appel lors du deplacement de la souris
WDDragScrollBar.prototype.OnMouseMove = function OnMouseMove(oEvent)
{
	// Si on n'a pas besoin de rafraichir
	if (!this.bUpdateRefresh())
	{
		return;
	}

	// Appel de la classe de base
	WDDrag.prototype.OnMouseMove.apply(this, [oEvent]);

	// Recupere la taille totale de la zone a defiler
	var nLargeurTotale = this.m_oObjetZRHorizontale.nGetLargeurTotale();
	var nLargeurCliente = this.m_oObjetZRHorizontale.nGetLargeurCliente();
	var nLargeurClienteSB = this.m_oObjetZRHorizontale.nGetLargeurClienteSB();

	// Calcule la nouvelle position
	// ATTENTION : Si on est en affichage de droite a gauche il faut inverser le deplacement de la souris car
	// les coordonnees X sont toujours de gauche a droite
	var nOffset = 0;
	if (document.dir == "rtl")
		nOffset = -(oEvent.clientX - this.nGetPosX());
	else
		nOffset = oEvent.clientX - this.nGetPosX();
	// Modifie en fonction de la largueur relative de la zone de defilement
	nOffset = parseInt(nOffset * nLargeurTotale / nLargeurClienteSB);

	var nNouvellePosition = nOffset + this.m_nPosition;

	// Pas trop au debut
	if (nNouvellePosition < 0)
	{
		nNouvellePosition = 0;
	}

	// Pas trop a la fin
	// Si on a trop de place
	if (nLargeurTotale <= nLargeurCliente)
	{
		nNouvellePosition = 0;
	}
	else if (nNouvellePosition + nLargeurCliente > nLargeurTotale)
	{
		// Si on est trop loin
		nNouvellePosition = nLargeurTotale - nLargeurCliente;
	}

	// Fixe la nouvelle position
	this.m_oObjetZRHorizontale._Deplace(nNouvellePosition);
};

// Appel lors du relachement de la souris
WDDragScrollBar.prototype.OnMouseUp = function OnMouseUp(oEvent)
{
	// Appel de la classe de base
	WDDrag.prototype.OnMouseUp.apply(this, [oEvent]);

	// Vire la position originale
	delete this.m_nPosition;
};
