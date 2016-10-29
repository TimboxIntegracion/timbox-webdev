//#15.00Aa WDSaisie.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation d'un champ de saisie
function WDSaisie (sIndication, sAliasChamp, sAliasZR, sAliasAttribut)
{
	// Si on est pas dans l'init d'un protoype
	if (sIndication !== undefined)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, sAliasZR, sAliasAttribut]);

		// L'indication
		if (sIndication.length > 0)
		{
			this.m_sIndication = sIndication;
		}
	}
};

// Declare l'heritage
WDSaisie.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDSaisie.prototype.constructor = WDSaisie;

// Membres statiques
// Si on est pas dans IE : il faut utiliser les couleurs au format rgb(128, 128, 128)
WDSaisie.prototype.ms_sIndicationCouleur = bIE ? "#808080" : "rgb(128, 128, 128)";
WDSaisie.prototype.ms_sIndicationStyleF = "italic";

// Initialisation :
// - clObjetCalendrier : Objet de manipulation de l'eventuel champ calendrier associe au champ
WDSaisie.prototype.Init = function (clObjetCalendrier, sFormatAffichage)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Sauve le champ calendrier associe
	if (clObjetCalendrier)
	{
		this.m_clObjetCalendrier = clObjetCalendrier;
	}
	this.m_sFormatAffichage = sFormatAffichage;

	// Recupere la collections des champs
	this._GetChamps();

	// Place l'indication si besoin
	this.RAZIndication();
};

// Recupere la collection des champs
WDSaisie.prototype._GetChamps = function()
{
	// Si la valeur du champ n'est pas lie a un attribut de zone repetee
	if (!this.bGestionZR())
	{
		// On force la recuperation : si le champ est dans une ZR sans etre lie a un attribtu pour sa valeur : la liste peut changer
		if (!this.m_tabChamp)
		{
			this.m_tabChamp = document.getElementsByName(this.m_sAliasChamp);
		}
	}
	else
	{
		// Recupere la collection des champs dans la ZR
		var nDebut = this.nGetZRDebut();
		var nOccurrence = this.nGetZROccurrence();

		// Allocation et parcours du tableau
		this.m_tabChamp = new Array(nOccurrence);
		var i = 0;
		var nLimiteI = nOccurrence;
		for (i = 0; i < nLimiteI; i++)
		{
			// Par compat, on a l'alias de l'attribut dans le nom du champ
//			this.m_tabChamp[i] = this.oGetElementByNameZRIndice(document, i + nDebut, "");
			this.m_tabChamp[i] = document.getElementsByName("_" + (i + nDebut) + "_" + this.m_sAliasChamp)[0];
		}
	}
};

// Place l'indication si besoin (Init ou apres un submit AJAX)
WDSaisie.prototype.RAZIndication = function ()
{
	// Place l'indication si besoin
	if (this.m_sIndication)
	{
		// MAJ de la collection des champs
		this._GetChamps();

		// Parcours de la collection
		var i = 0;
		var nLimiteI = this.m_tabChamp.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var oChamp = this.m_tabChamp[i];
			if (oChamp && (oChamp.value.length == 0))
			{
				// Supprime le focus
				oChamp.blur();

				// Dans firefox, l'appel de blur appel le code JS alors que ce n'est pas le cas dans IE
				if (oChamp.value.length == 0)
				{
					// Modifie le style
					this._SetStyle(oChamp);
					// Place l'indication
					oChamp.value = this.m_sIndication;
				}
			}
		}
	}
};

// Affiche le style de l'indication
WDSaisie.prototype._SetStyle = function (oChamp)
{
	// Sauve la couleur et le style de la police
	var oStyle = _JGCS(oChamp);
	oChamp.sIndicationColor = oStyle.color;
	oChamp.sIndicationFontStyle = oStyle.fontStyle;

	// Et met les styles demande
	oChamp.style.color = this.ms_sIndicationCouleur;
	oChamp.style.fontStyle = this.ms_sIndicationStyleF;

	oChamp.bIndication = true;
};

// Supprime le style de l'indication
WDSaisie.prototype._ClearStyle = function (oChamp)
{
	// Restaure la couleur et le style de la police
	var oStyle = _JGCS(oChamp);
	// Sauf si la couleur a ete entre temps par programmation
	if ((oStyle.color == this.ms_sIndicationCouleur) && (oChamp.sIndicationColor !== undefined))
	{
		oChamp.style.color = oChamp.sIndicationColor;
		oChamp.sIndicationColor = undefined;
	}
	// Pareil pour le style de la police
	if ((oStyle.fontStyle == this.ms_sIndicationStyleF) && (oChamp.sIndicationFontStyle !== undefined))
	{
		oChamp.style.fontStyle = oChamp.sIndicationFontStyle;
		oChamp.sIndicationFontStyle = undefined;
	}

	if (oChamp.bIndication !== undefined)
	{
		oChamp.bIndication = false;
	}
};

// Lit les proprietes dont l'indication
WDSaisie.prototype.GetProp = function GetProp(eProp, oEvent, oValeur, oChamp)
{
	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_INDICATION:
		// Traite le cas de ..Indication : modifie la valeur
		return this.m_sIndication ? this.m_sIndication : "";
	default:
		// Retourne a l'implementation de la classe de base avec la valeur eventuellement modifie
		return WDChamp.prototype.GetProp.apply(this, [eProp, oEvent, oValeur, oChamp]);
	}
};

// Ecrit les proprietes dont l'indication
WDSaisie.prototype.SetProp = function SetProp(eProp, oEvent, oValeur, oChamp)
{
	// Implementation de la classe de base
	oValeur = WDChamp.prototype.SetProp.apply(this, [eProp, oEvent, oValeur, oChamp]);

	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_INDICATION:
		// Traite le cas de ..Indication
		// MAJ de la collection des champs
		this._GetChamps();

		// Pour bien faire le style : simule une prise de focus et une perte de focus
		// Comme ca on gere bien le cas de l'indication vide avant et vide apres

		// Parcours de la collection
		var i = 0;
		var nLimiteI = this.m_tabChamp.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var oChamp = this.m_tabChamp[i];
			if (oChamp)
			{
				// Supprime le focus
				oChamp.blur();
				// Simule une prise de focus
				this.OnFocus(null, oChamp);
			}
		}

		// Supprime l'indication
		if (oValeur.length > 0)
		{
			this.m_sIndication = oValeur;
		}
		else
		{
			delete this.m_sIndication;
		}

		// Simule une perte de focus
		for (i = 0; i < nLimiteI; i++)
		{
			var oChamp = this.m_tabChamp[i];
			if (oChamp)
			{
				this.OnBlur(null, oChamp);
			}
		}
		return oValeur;
	default:
		return oValeur;
	}
};

// Lecture de la valeur du champ en programmation : supprime l'indication si elle est affichee
WDSaisie.prototype.GetValeur = function (oEvent, sValeur, oChamp)
{
	if (this.m_sIndication)
	{
		return oChamp.bIndication ? "" : sValeur;
	}
	return sValeur;
};

// Ecriture de la valeur du champ en programmation : ajoute l'indication si besoin ou supprime le style de l'indication
WDSaisie.prototype.SetValeur = function(oEvent, sValeur, oChamp)
{
	// Appel de la methode de la classe de base (ignore la valeur retourne par l'implementation de la classe de base)
	WDChamp.prototype.SetValeur.apply(this, [oEvent, sValeur, oChamp]);

	if (this.m_sIndication)
	{
		// Si la valeur est vide => Affiche l'indication
		if (sValeur.length == 0)
		{
			// Si la valeur affichee n'est pas deja l'indication
			if (!oChamp.bIndication)
			{
				// Affiche l'indication : pas besoin de l'afficher : le code autour le fera pour nous => on met juste le style
				this._SetStyle(oChamp);
			}
			// Dans tout les cas retourne l'indication car c'est la valeur finalement dans le champ
			return this.m_sIndication;
		}

		// La valeur est non vide : il faut supprimer l'indication si besoin
		if (oChamp.bIndication)
		{
			this._ClearStyle(oChamp);
		}
	}

	// Dans tous les cas : retourne la vraie valeur
	return sValeur;
};

// Fonction appelle quand le champ recoit le focus : supprime l'indication si besoin
WDSaisie.prototype.OnFocus = function (oEvent, oChamp)
{
	if (oEvent && !oChamp)
	{
		oChamp = bIE ? oEvent.srcElement : oEvent.target;
	}
	if (this.m_sIndication)
	{
		// Il faut supprimer l'indication si besoin
		if (oChamp.bIndication)
		{
			this._ClearStyle(oChamp);
			oChamp.value = "";
		}
	}
};

// Fonction appelle quand le champ perd le focus : remet l'indication si besoin
WDSaisie.prototype.OnBlur = function (oEvent, oChamp)
{
	if (oEvent && !oChamp)
	{
		oChamp = bIE ? oEvent.srcElement : oEvent.target;
	}
	if (this.m_sIndication)
	{
		// Il faut remettre l'indication si besoin
		if (oChamp.value == "")
		{
			this._SetStyle(oChamp);
			oChamp.value = this.m_sIndication;
		}
	}
};

// Fonction appelle en submit de la page : supprime l'indication pour ne pas l'envoyer au serveur
WDSaisie.prototype.OnSubmit = function (oEvent)
{
	if (this.m_sIndication)
	{
		// MAJ de la collection des champs
		this._GetChamps();

		// Parcours de la collection
		var i = 0;
		var nLimiteI = this.m_tabChamp.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var oChamp = this.m_tabChamp[i];
			if (oChamp)
			{
				// Il faut supprimer l'indication si besoin
				if (oChamp.bIndication)
				{
					this._ClearStyle(oChamp);
					oChamp.value = "";
				}
			}
		}
	}
};

// Fonction appelle quand le champ perd le focus et que la valeur a ete modifie
WDSaisie.prototype.OnChange = function (oEvent, oChamp)
{
	// Uniquement si on n'est pas en cours de modification par le champ calendrier
	if (!this.m_bChangeDepuisCalendrier)
	{
		if (!oChamp && oEvent)
		{
			oChamp = bIE ? oEvent.srcElement : oEvent.target;
		}
		this.MAJContenuCalendrier(oEvent, oChamp);
	}
};

// Notifie le champ calendrier de sa MAJ
WDSaisie.prototype.MAJContenuCalendrier = function(oEvent, oChamp)
{
	// Calcul de la valeur avec une conversion en valeur WL si besoin
	var sValeur = (!oChamp.bIndication) ? _CVD(oChamp.value, this.m_sFormatAffichage) : "";

	// Notifie le champ calendrier du changement de valeur
	this.m_clObjetCalendrier.OnChangeSaisie(oEvent, sValeur, oChamp);
};

// Notification du champ que sa valeur a changer a cause du champ calendrier
// oChampSaisie : champ de saisie precis concerne (cas des ZR)
WDSaisie.prototype.OnChangeCalendrier = function (oEvent, sValeur, oChampSaisie)
{
	// Entre l'ouverture de la popup calendrier et la selection, si le champ de saisie a ete MAJ (dans une ZR), l'objet DOM a peut etee changer
	if (this.bGestionZR())
	{
		var tabElements = document.getElementsByName(oChampSaisie.name);
		if (tabElements.length == 1)
		{
			oChampSaisie = tabElements[0];
		}
	}

	// Convertion de la valeur en valeur affichee
	sValeur = _DVC(sValeur, this.m_sFormatAffichage);

	// Simule une affectation de la valeur par programmation
	sValeur = this.SetValeur(oEvent, sValeur, oChampSaisie);

	// Puis ecrit reellement la valeur
	oChampSaisie.value = sValeur;

	// Execute le PCode de changement
	// Le probleme est que ce code va rappeler le code de l'utilisateur qui se fini par un appel a this.OnChange()
	// Sauf que dans ce cas, il n'y a pas d'evenement et pas de champ courant et que l'on ne doit pas se notifier dans l'autre sens
	this.m_bChangeDepuisCalendrier = true;

	oChampSaisie.onchange(oEvent);

	delete this.m_bChangeDepuisCalendrier;
};
