//#15.00Aa WDDeplacement.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Attention a ne pas mettre d'accent dans ce fichier COMMENTAIRES inclus

// Manipulation des Cookies
function WDCookie ()
{
	// Rien
}

WDCookie.prototype =
{
	cSeparateurCookie:	';',
	cSeparateurValeur:	'=',

	// Recupere le cookie
	GetCookie:function (sNom)
	{
		var tabCookies = document.cookie.split(WDCookie.prototype.cSeparateurCookie);
		var i = 0;
		var nLimiteI = tabCookies.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var tabCookie = tabCookies[i].split(WDCookie.prototype.cSeparateurValeur);
			if ((tabCookie[0] == sNom || tabCookie[0] == ' ' + sNom) && tabCookie[1])
			{
				return unescape(tabCookie[1]);
			}
		}
		return "";
	},

	// Ecrit un cookie
	SetCookie:function (sNom, sValeur)
	{
		sExp = "Mon, 31 Dec 2010 23:59:59 UTC";
		// Si on est dans le futur (Apres 2009) : On met une autre date
		if (parseInt((new Date()).getFullYear()) >= 2009)
		{
			sExp = new Date((new Date()).getTime() + 30*24*3600*1000).toGMTString();
		}
		this._SetCookie(sNom, sValeur, sExp);
	},

	// Supprime un cookie
	ClearCookie:function (sNom)
	{
		this._SetCookie(sNom, "", "Fri, 02 Jan 1970 00:00:00 UTC");
	},

	// Ecrit un cookie, version interne
	_SetCookie:function (sNom, sValeur, sExp)
	{
		document.cookie = sNom + WDCookie.prototype.cSeparateurValeur + escape(sValeur) + "; expires=" + sExp + "; path=/;";
	}
};

// Classe representant un champ et sa position
function WDPosition ()
{
	// Tableau des indications
	this.m_tabElements = new Array();

	this.m_tabElements[WDPosition.prototype.nIndiceVersion] = WDPosition.prototype.nVersionCourante;
	this.m_tabElements[WDPosition.prototype.nIndiceVersionMinReq] = WDPosition.prototype.nVersionMinReq;
}

WDPosition.prototype =
{
	nVersionCourante:		0,
	nVersionMin:			0,
	nVersionMinReq:			0,
	nIndiceVersion:			0,
	nIndiceVersionMinReq:	1,
	nIndicePosX:			2,
	nIndicePosY:			3,
	cSeparateur:			'|',

	// Serialisation
	toString:function ()
	{
		// Renvoie les valeurs separees par des |
		return this.m_tabElements.join(WDPosition.prototype.cSeparateur);
	},

	// Deserialisation
	bFromString:function (sValeur)
	{
		// Explose la chaine
		var tabTmp = sValeur.split(WDPosition.prototype.cSeparateur);

		// Si il y a un probleme avec les versions
		if (tabTmp[WDPosition.prototype.nIndiceVersion] < WDPosition.prototype.nVersionMin)
		{
			return false;
		}
		if (tabTmp[WDPosition.prototype.nVersionMinReq] > WDPosition.prototype.nVersionCourante)
		{
			return false;
		}

		// Sauve le tableau
		this.m_tabElements = tabTmp;

		return true;
	},

	// Ecriture d'une propriete
	Ecrit:function (nIndice, sValeur)
	{
		// Sauve la valeur
		this.m_tabElements[nIndice] = sValeur;
	},

	// Lecture d'une propriete
	sLit:function (nIndice)
	{
		// Lit la valeur
		return this.m_tabElements[nIndice];
	}
};

function AjouteDeplacement (tabMemorise)
{
	// Ajoute une serie d'element au tableau des elements memorise
	document.oWDDeplace.m_tabMemorise = document.oWDDeplace.m_tabMemorise.concat(tabMemorise);
}

// Classe representant la manipulation du deplacement d'un champ par le fond
function WDDeplace (sNomApplication, sNomPage)
{
	// Hook sur le onmousemove de document
	var oTmp = this;
	this.m_fMouseMove = function(oEvent) { oTmp.OnMouseMove.call(oTmp, oEvent ? oEvent : event); };
	this.m_fMouseUp = function(oEvent) { oTmp.OnMouseUp.call(oTmp, oEvent ? oEvent : event); };

	// Evite les probleme et supprime tout ce qui n'est pas alphanimerique dans les chaine (Normalement deje fait
//	this.m_sPrefixeId = sNomApplication.replace(/[^a-zA-Z]/g, "") + "." + sNomPage.replace(/[^a-zA-Z]/g, "") + ".";
	this.m_sPrefixeId = sNomApplication + "." + sNomPage + ".";

	// Tableau des elements dont ont doit restaurer la position
	this.m_tabMemorise = new Array();

	// On se note de charger et de restaurer les positions
	// Mais ce sera fait apres les AjouteDeplacement
	setTimeout("document.oWDDeplace.ChargePositions();document.oWDDeplace.RestaurePositions();", 1);
}

WDDeplace.prototype =
{
//	m_nPosX:			-1,			// Pas de deplacement
//	m_nPosY:			-1,
//	m_oObjetDeplace:	null,
//	m_fOldMouseMove:	null,		// Par defaut le document n'a pas de fonction OnMouseMove
//	m_fOldMouseUp:		null,		// Par defaut le document n'a pas de fonction OnMouseUp
//	m_bSauvePosition:	false,		// Sauve la position
	m_nBloqueTime:		0,			// Evite les problemes avec null et indefined dans les comparaisons
	sCookieName:		"WDDeplace",
	cSeparateurId:		'&',
	cSeparateurData:	':',

	// Bloque le traitement du deplacement
	BloqueMouseDown:function ()
	{
		// On ne peu pas bloquer la propagation (Empecherai des traitements legitime de mousedown au niveau plus global)
		// On note de na pas traiter ce clic a ce moment
		this.m_nBloqueTime = (new Date()).getTime();
	},

	// Appele par un champ deplacable au debut du clic
	OnMouseDown:function (oEvent, sIdDeplace, bSauvePosition, bZR)
	{
		// Si on est proche d'un deplacement bloque : on se bloque. La limite est fixe raisonnablement a 20ms (Resolution du timer)
		if (((new Date()).getTime() - this.m_nBloqueTime) < 20)
		{
			return;
		}

		// Si il y a deja un deplacement en cours : le libere
		if (this.m_oObjetDeplace)
		{
			this.OnMouseUp();
		}

		// Si ce n'est pas le bouton gauche : fini
		if (bIE)
		{
			if (oEvent.button != 1) return;
		}
		else
		{
			if (oEvent.button != 0) return;
		}

		// Cherche l'element a modifier
		var oObjet = _JGE(sIdDeplace, document, true, false);
		if (!oObjet)
		{
			return;
		}

		// GP 27/11/2007 : QW45597 Si on est dans une zone repetee : on tente de trouver l'element directement au lieu de premier dans la page
		if (bZR)
		{
			var sIdDww = "dww" + sIdDeplace.replace(/_/g, '');
			var sIdDwwCz = "dwwcz" + sIdDeplace.replace(/_/g, '');
			var oCurseur = bIE ? oEvent.srcElement : oEvent.target;
			var oCurseurPrec = null;
			while ((oCurseur != null) && (oCurseur != document.body) && (oCurseur != oCurseurPrec))
			{
				// Regarde si on ne trouve pas un element plus favorable
				if ((oCurseur.id == sIdDww) || (oCurseur.id == sIdDwwCz))
				{
					oObjet = oCurseur;
					break;
				}
				// Remonte au parent
				oCurseurPrec = oCurseur;
				oCurseur = oCurseur.parentNode;
			}
		}

		// Sauve la position souris
		this.m_nPosX = oEvent.clientX;
		this.m_nPosY = oEvent.clientY;

		// Et la position originale de l'element
		this.m_nPosElementX = parseInt(GetStyleLeft(_JGCS(oObjet)));
		this.m_nPosElementY = parseInt(_JGCS(oObjet).top);

		// Et l'objet a deplacer
		this.m_oObjetDeplace = oObjet;
		this.m_bSauvePosition = bSauvePosition;
		this.m_sIdDeplace = sIdDeplace;

		// Sauve les hooks du document en evitant de se hooker deux fois
		// Et pose les notres
		if (document.onmousemove != this.m_fMouseMove)
		{
			// Sur le deplacement de la souris
			this.m_fOldMouseMove = document.onmousemove;
			document.onmousemove = this.m_fMouseMove;
		}
		if (document.onmouseup != this.m_fMouseUp)
		{
			// Sur le deplacement de la souris
			this.m_fOldMouseUp = document.onmouseup;
			document.onmouseup = this.m_fMouseUp;
		}

		// Bloque les prochain traitement du deplacement
		this.BloqueMouseDown();

		// Empeche la propagation de l'evenement
		return bStopPropagation(oEvent);
	},

	// Appele par un champ deplacable en fin de clic
	OnMouseUp:function ()
	{
		// Si pas de deplacement en cours
		if (!this.m_oObjetDeplace)
		{
			return;
		}

		// Sauve la position si demandee
		if (this.m_bSauvePosition)
		{
			this.SauvePosition();
		}

		// Supprime la position souris
		delete this.m_nPosX;
		delete this.m_nPosY;
		delete this.m_nPosElementX;
		delete this.m_nPosElementY;

		// Et l'objet a deplacer
		delete this.m_oObjetDeplace;
		delete this.m_bSauvePosition;
		delete this.m_sIdDeplace;

		// Restaure les hook du document
		document.onmousemove = this.m_fOldMouseMove;
		delete this.m_fOldMouseMove;
		document.onmouseup = this.m_fOldMouseUp;
		delete this.m_fOldMouseUp;
	},

	// Hook du deplacement dans le document
	OnMouseMove:function (oEvent)
	{
		// Rappele la fonction sauve
		if (typeof this.m_fOldMouseMove == "function")
		{
			this.m_fOldMouseMove(oEvent);
		}

		// Si on n'a plus de bouton enfonce : fin du deplacement
		if (bIE)
		{
			if (oEvent.button != 1)
			{
				this.OnMouseUp();
				return;
			}
		}

		// Effectue le deplacement
		var nDeltaX = oEvent.clientX - this.m_nPosX;
		var nDeltaY = oEvent.clientY - this.m_nPosY;
		SetStyleLeft(this.m_oObjetDeplace.style, this.m_nPosElementX, nDeltaX);
		this.m_oObjetDeplace.style.top = (this.m_nPosElementY + nDeltaY) + "px";

		// Empeche la propagation de l'evenement
		return bStopPropagation(oEvent);
	},

	// Restaure les positions des champs deplaces
	RestaurePositions:function ()
	{
		// Pour toutes les entrees du tableau des positions : deplace le champ
		for (var sIdComplet in this.m_tabPositions)
		{
			// Si l'id est dans notre application et dans la page courante
			if (sIdComplet.substring(0, this.m_sPrefixeId.length) == this.m_sPrefixeId)
			{
				var sId = sIdComplet.substring(this.m_sPrefixeId.length);

				// Si l'id est dans la liste des elements a restaurer
				var i;
				var nLimiteI = this.m_tabMemorise.length;
				for (i = 0; i < nLimiteI; i++)
				{
					if (this.m_tabMemorise[i] == sId)
					{
						// Restaure la position
						var oObjet = _JGE(sId, document, true, false);
						if (oObjet)
						{
							SetStyleLeft(oObjet.style, parseInt(this.m_tabPositions[sIdComplet].sLit(WDPosition.prototype.nIndicePosX)), 0);
							oObjet.style.top = this.m_tabPositions[sIdComplet].sLit(WDPosition.prototype.nIndicePosY);
						}
						// Sort de la recherche
						break;
					}
				}

				// Si l'objet n'existe plus dans les objets deplacables ont le supprime pour ne pas surchager la page
				if (i == nLimiteI)
				{
					delete this.m_tabPositions[sIdComplet];

					// Et resauve les positions
					this.SauvePositions();
				}
			}
		}
	},

	// Sauve la position du champ deplace courant
	SauvePosition:function ()
	{
		// Cree la structure
		var oPosition = new WDPosition();
		oPosition.Ecrit(WDPosition.prototype.nIndicePosX, GetStyleLeft(_JGCS(this.m_oObjetDeplace)));
		oPosition.Ecrit(WDPosition.prototype.nIndicePosY, _JGCS(this.m_oObjetDeplace).top);

		// Ajoute dans le tableau des positions (Ou le remplace)
		this.m_tabPositions[this.m_sPrefixeId + this.m_sIdDeplace] = oPosition;

		// Et sauve les positions
		this.SauvePositions();
	},

	// Charge le tableau des positions
	ChargePositions: function()
	{
		// On ne fait pas un vrai tableau mais un objet pour avoir un tableau associatif via les proprietes
		this.m_tabPositions = new Object();

		// Recupere la valeur du cookie
		var sCookie = (new WDCookie()).GetCookie(WDDeplace.prototype.sCookieName);
		if (sCookie.length == 0)
		{
			return;
		}

		// Decoupe le cookie
		var tabPositions = sCookie.split(WDDeplace.prototype.cSeparateurId);
		var i = 0;
		var nLimiteI = tabPositions.length;
		for (i = 0; i < nLimiteI; i++)
		{
			// Gere les cas d'erreurs
			if (!tabPositions[i])
			{
				continue;
			}

			var tabPosition = tabPositions[i].split(WDDeplace.prototype.cSeparateurData);

			// Gere les cas d'erreurs
			if (!tabPosition[0] || !tabPosition[1])
			{
				continue;
			}

			// Et affecte les valeurs
			var oPosition = new WDPosition();
			if (oPosition.bFromString(tabPosition[1]))
			{
				this.m_tabPositions[tabPosition[0]] = oPosition;
			}
		}
	},

	// Sauve le tableau des positions
	SauvePositions:function ()
	{
		// Si pas d'elements : fini
		var nNbElements = 0;
		for (var sIdComplet in this.m_tabPositions)
		{
			nNbElements++;
		}

		// Si pas d'elements : fini
		if ((this.m_tabPositions.length == 0) || (nNbElements == 0))
		{
			// Supprime notre cookie au passage
			(new WDCookie()).ClearCookie(WDDeplace.prototype.sCookieName);
			return;
		}

		// Cree un tableau avec les descriptions
		var tabChainePositions = new Array();

		// Pour toutes les entrees du tableau des positions : recupere la chaine
		var i = 0;
		for (var sId in this.m_tabPositions)
		{
			// Serialise la position
			tabChainePositions[i++] = sId + WDDeplace.prototype.cSeparateurData + this.m_tabPositions[sId].toString();
		}

		// Cree la chaine du cookie
		var sValeur = tabChainePositions.join(WDDeplace.prototype.cSeparateurId);

		// Et le sauve
		(new WDCookie()).SetCookie(WDDeplace.prototype.sCookieName, sValeur);
	}
};
