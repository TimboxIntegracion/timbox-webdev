//#15.00Aa WDDrag.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation d'un element par Drag-Drop
function WDDrag (bConstructeur)
{
	// Si on est vraiment dans la construction d'un objet
	if (bConstructeur)
	{
		// Cree les fonctions de rappel
		var oThis = this;
		this.m_fMouseDown = function(oEvent) { oThis.OnMouseDown.apply(oThis, [oEvent ? oEvent : event]); return bStopPropagation(oEvent ? oEvent : event); };
		this.m_fMouseMove = function(oEvent) { oThis.OnMouseMove.apply(oThis, [oEvent ? oEvent : event]); return bStopPropagation(oEvent ? oEvent : event); };
		this.m_fMouseUp = function(oEvent) { oThis.OnMouseUp.apply(oThis, [oEvent ? oEvent : event]); return bStopPropagation(oEvent ? oEvent : event); };
		this.m_fSelectStart = function(oEvent) { return bStopPropagation(oEvent ? oEvent : event); }; // Ne fonctionne que avec IE

		this.m_oLastRedim = null;
	}
};

// Initialisation
WDDrag.prototype.Init = function Init()
{
};

// Recupere les positions
WDDrag.prototype.nGetPosX = function nGetPosX()
{
	return this.m_nPosX;
};
WDDrag.prototype.nGetPosY = function nGetPosY()
{
	return this.m_nPosY;
};

// Appel lors du debut d'un click pour le redimensionnement
// Pose les hooks
WDDrag.prototype.OnMouseDown = function OnMouseDown(oEvent)
{
	// Sauve la position souris
	this.m_nPosX = oEvent.clientX;
	this.m_nPosY = oEvent.clientY;

	// Intercepte les evenements sur le document
	if (!this.m_bHookPoses)
	{
		this.m_bHookPoses = true;
		HookOnXXX(document, 'onmousemove', 'mousemove', this.m_fMouseMove);
		HookOnXXX(document, 'onmouseup', 'mouseup', this.m_fMouseUp);
		if (bIE)
		{
			HookOnXXX(document, 'onselectstart', 'selectstart', this.m_fSelectStart);
		}
	}
};

// Indique si on doit rafraichir un eventuel dessin lors du move
WDDrag.prototype.bUpdateRefresh = function bUpdateRefresh()
{
	// On laisse le temp du rafraichissement
	if (this.m_oLastRedim && ((new Date()).getTime() - this.m_oLastRedim.getTime() < 50))
	{
		return false;
	}

	// On memorise pour le du rafraichissement
	this.m_oLastRedim = new Date();

	return true;
};

// Appel lors du deplacement de la souris
WDDrag.prototype.OnMouseMove = function OnMouseMove(oEvent)
{
	// Pas de filtre pour le rafraichissement c'est au parent de filtrer
};

// Appel lors du relachement de la souris
// Restaure les fonctions hookees
WDDrag.prototype.OnMouseUp = function OnMouseUp(oEvent)
{
	// Restaure les hook du document
	if (this.m_bHookPoses)
	{
		if (bIE)
		{
			UnhookOnXXX(document, 'onselectstart', 'selectstart', this.m_fSelectStart);
		}
		UnhookOnXXX(document, 'onmouseup', 'mouseup', this.m_fMouseUp);
		UnhookOnXXX(document, 'onmousemove', 'mousemove', this.m_fMouseMove);
		delete this.m_bHookPoses;
	}

	// Vire la limitation du rafriachissement
	delete this.m_oLastRedim;

	// Vire la position souris
	delete this.m_nPosX;
	delete this.m_nPosY;
};
