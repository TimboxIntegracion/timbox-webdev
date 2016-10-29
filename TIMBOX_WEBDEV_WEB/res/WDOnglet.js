//#15.00Aa WDOnglet.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation des onglets

// Manipule un volet
function WDVolet (oOnglet, nIndiceVolet)
{
	// + 1 car les volets sont avec les indices WL donc qui commencent a 1
	var sAlias = oOnglet.m_sAliasChamp + '_' + (nIndiceVolet + 1);
	// Trouve les elements : titre et corps
	this.m_oTitre = oGetId(sAlias);
	this.m_oCorps = oGetId('dww' + sAlias);
	this.m_oLien = this.m_oTitre.getElementsByTagName("A")[0];
	// Memorise notre indice
	this.m_nIndiceVolet = nIndiceVolet;

	if (this.m_oTitre)
	{
		// Hook le clic dans le titre
		var oThis = this;
		var oTmpOnglet = oOnglet;
		this.m_fOnClick = this.m_oTitre.onclick;

		if (bIE)
		{
			this.m_oTitre.onclick = function () { oThis.OnClick(event, oTmpOnglet); };
		}
		else
		{
			this.m_oTitre.onclick = function (event) { oThis.OnClick(event, oTmpOnglet); };
		}
	}
};

WDVolet.prototype =
{
//	m_oTitre:			null,
//	m_oCorps:			null,
//	m_oLien:			null,
//	m_m_nIndiceVolet:	null,
//	m_fOnClick:			null,

	// Clic sur un onglet
	OnClick: function(oEvent, oOnglet)
	{
		// Filtre le cas de l'onglet desactive
		if (this.m_oLien)
		{
			// IE : regarde la propriete disabled
			if (bIE)
			{
				if (this.m_oLien.disabled)
				{
					return;
				}
			}
			else
			{
				// Parcours les attributs de this.m_oLien pour voir si l'attribut disabled existe
				var tabAttributs = this.m_oLien.attributes;
				var i;
				var nLimiteI = tabAttributs.length;
				for (i = 0; i < nLimiteI; i++)
				{
					var oAttribut = tabAttributs.item(i);

					// Si l'attribut existe => on ne change pas l'onglet
					if (oAttribut.nodeName.toLowerCase() == "disabled")
					{
						return;
					}
				}
			}
		}

		// Indique le clic au parent
		oOnglet.OnClick(oEvent, this.m_nIndiceVolet);

		// Puis execute le code de click existant
		if (this.m_fOnClick)
		{
			this.m_fOnClick.apply(this.m_oTitre, [oEvent]);
		}
	},

	Affiche: function(bAffiche, oOnglet)
	{
		// Affiche ou masque le volet
		SetDisplay(this.m_oCorps, bAffiche);

		// Change le style du volet
		this.m_oTitre.className = oOnglet.m_tabStyle[bAffiche ? oOnglet.ms_nStyleActif : oOnglet.ms_nStyleInactif];

		// Supprime ou affiche la barre de separation
		switch (oOnglet.m_ePosition)
		{
			case oOnglet.ms_ePosVolet_Haut:
				this.m_oTitre.style.borderBottomWidth = bAffiche ? '0px' : '1px';
				break;
			case oOnglet.ms_ePosVolet_Bas:
				this.m_oTitre.style.borderTopWidth = bAffiche ? '0px' : '1px';
				break;
			case oOnglet.ms_ePosVolet_Gauche:
				this.m_oTitre.style.borderRightWidth = bAffiche ? '0px' : '1px';
				break;
			case oOnglet.ms_ePosVolet_Droite:
				this.m_oTitre.style.borderLeftWidth = bAffiche ? '0px' : '1px';
				break;
		}

		if (!bIE)
		{
			this.m_oTitre.style.borderCollapse = bAffiche ? "separate" : "collapse";
		}

		// Force la MAJ des champs dans l'onglet (on n'exclus aucun champ)
		AppelMethode(WDChamp.prototype.ms_sOnDisplay, [this.m_oCorps]);
	},

	// Calcule si le lien est actif
	bActif: function()
	{
		// Si le lien est grise
		if (this.m_oLien.disabled)
		{
			return false;
		}

		// Si le lien est desactive
		if (this.m_oLien.readOnly || this.m_oLien.attributes['READONLY'])
		{
			return false;
		}

		return true;
	},

	// Change la hauteur du volet
	Hauteur: function(nHauteur)
	{
		this.m_oCorps.firstChild.firstChild.firstChild.height = nHauteur + "px";
	}
};

// Manipulation des onglets
function WDOnglet (sAliasChamp, nNbOnglets, ePosition, tabStyle)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, undefined, undefined]);

		this.m_nNbOnglets = nNbOnglets;
		this.m_tabOnglets = new Array();
		this.m_ePosition = ePosition;
		this.m_tabStyle = tabStyle;
	}
};

// Declare l'heritage
WDOnglet.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDOnglet.prototype.constructor = WDOnglet;

// Membres statiques
WDOnglet.prototype.ms_ePosVolet_Haut = 0;
WDOnglet.prototype.ms_ePosVolet_Bas = 1;
WDOnglet.prototype.ms_ePosVolet_Gauche = 2;
WDOnglet.prototype.ms_ePosVolet_Droite = 3;
WDOnglet.prototype.ms_nStyleActif = 0;
WDOnglet.prototype.ms_nStyleInactif = 1;

// Initialisation
WDOnglet.prototype.Init = function()
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Construit le tableau des onglets
	var i;
	var nLimiteI = this.m_nNbOnglets;
	for (i = 0; i < nLimiteI; i++)
	{
		// Construit un onglet
		this.m_tabOnglets.push(new WDVolet(this, i));
	}
};

// Code de modification navigateur
// Il faut maintenant appeler WDChamp::DeclarePCode
WDOnglet.prototype.CodeModificationSimple = function(sFonctionModification)
{
	this.DeclarePCode(this.ms_nEventNavModifSimple, new Function("event", "return " + sFonctionModification + ";"));
};

// Affiche un volet sur un clic utilisateur
WDOnglet.prototype.OnClick = function(oEvent, nIndiceVolet)
{
	// N'active le volet que s'il est actif
	if (this.m_tabOnglets[nIndiceVolet].bActif())
	{
		// Active le volet
		this.AfficheVolet(nIndiceVolet);
	}

	// Appel le PCode navigateur de modification
	this.RecuperePCode(this.ms_nEventNavModifSimple)(oEvent);
};

// Recupere la valeur
WDOnglet.prototype.GetValeur = function GetValeur(oEvent, sValeur, oChamp)
{
	// Conversion de la valeur en booleen
	var nValeur = parseInt(sValeur, 10);

	// Appel de la methode de la classe de base et retour de son resultat
	return WDChamp.prototype.GetValeur.apply(this, [oEvent, nValeur, oChamp]);
};


// Changement du volet selectionne
WDOnglet.prototype.SetValeur = function SetValeur(oEvent, sValeur, oChamp)
{
	// Appel de la methode de la classe de base (ignore la valeur retourne par l'implementation de la classe de base)
	WDChamp.prototype.SetValeur.apply(this, [oEvent, sValeur, oChamp]);

	var nValeur = parseInt(sValeur);
	if (!isNaN(nValeur) && (nValeur >= 1));
	{
		// On force la selection car la valeur renvoie par le serveur est forcement valide et
		// Que la commande sur el ..Etat des volets peut ne pas encore etre execute
		this.AfficheVolet(nValeur - 1);
	}

	return nValeur;
};

// Lit les proprietes
WDOnglet.prototype.GetProp = function GetProp(eProp, oEvent, oValeur, oChamp)
{
	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_OCCURRENCE:
		// Traite le cas de ..Occurrence
		return this.m_nNbOnglets;
	default:
		// Retourne a l'implementation de la classe de base avec la valeur eventuellement modifie
		return WDChamp.prototype.GetProp.apply(this, [eProp, oEvent, oValeur, oChamp]);
	}
};

// Affiche un volet
WDOnglet.prototype.AfficheVolet = function(nIndiceVolet)
{
	// Masque tous les volets sauf le volet a activer
	var i;
	var nLimiteI = this.m_nNbOnglets;
	for (i = 0; i < nLimiteI; i++)
	{
		// Masque le volet
		if (i != nIndiceVolet)
		{
			this.m_tabOnglets[i].Affiche(false, this);
		}
	}
	this.m_tabOnglets[nIndiceVolet].Affiche(true, this);

	// Change la valeur du champ cache qui donne l'onglet affiche
	// + 1 car l'indice est WL pour :
	//	- La lecture en JS
	//	- Le submit au serveur qui prend un indice WL
	this.oGetElementByName(document, "").value = nIndiceVolet + 1;
};

// Change la hauteur des onglets (pour l'AJAX)
WDOnglet.prototype.HauteurVolet = function(nHauteur)
{
	// Applique la methode sur tous les volets
	var i;
	var nLimiteI = this.m_nNbOnglets;
	for (i = 0; i < nLimiteI; i++)
	{
		// Change la taille
		this.m_tabOnglets[i].Hauteur(nHauteur);
	}
};
