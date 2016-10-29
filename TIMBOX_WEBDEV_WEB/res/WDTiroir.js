//#15.00Aa WDTiroir.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation des champs tiroir

// Animation de l'ouverture ou de la fermeture du champ tiroir
function WDAnimTiroir (oTiroir, bOuverture, nHauteurBas, nType, nCourbe, nDuree)
{
	if (oTiroir)
	{
		// Memorise les parametres (pour les appels de fonctions 'virtuelles' dans le constructeur de WDAnim)
		this.m_oTiroir = oTiroir;
		this.m_bOuverture = bOuverture;

		// Sauve la propriete de debordement et la fixe a sa valeur demandee
		this.m_sSavOverflowY = _JGCS(this.m_oTiroir.m_oPartieBasse).overflowY;
		this.m_oTiroir.m_oPartieBasse.style.overflowY = "hidden";

		// Calcule les tailles
		// La taille min est de 1 en 1 sinon toute le champ s'affiche en mode de compatibilite
		var nMin = bIEQuirks ? 1 : 0;
		var nDebut = this.m_bOuverture ? nMin : nHauteurBas;
		var nFin = this.m_bOuverture ? nHauteurBas : nMin;

		// Si on est en ouveture, il faut afficher le volet maintenant
		if (this.m_bOuverture)
		{
			SetDisplay(this.m_oTiroir.m_oPartieBasse, true);
		}

		// Appel de la classe de base (lance l'animation)
		var oPartieBasse = this.m_oTiroir.m_oPartieBasse;
		var pfSetPropHauteur = function(nVal) { oPartieBasse.style.height = nVal + "px"; };
		WDAnim.prototype.constructor.apply(this,[pfSetPropHauteur, WDChamp.prototype.XML_CHAMP_PROP_NUM_HAUTEUR, nDebut, nFin, nType, nCourbe, nDuree]);
	}
}

// Declare l'heritage
WDAnimTiroir.prototype = new WDAnim();
// Surcharge le constructeur qui a ete efface
WDAnimTiroir.prototype.constructor = WDAnimTiroir;

// Annule l'animation
// Ne met PAS dans l'etat final
//WDAnim.prototype.vAnnule = function vAnnule()

// Marque la fin de l'animation
WDAnimTiroir.prototype.vFin = function vFin()
{
	// Masque le volet si on est en fermeture (en ouverture le veolet a deja ete affiche)
	if (!this.m_bOuverture)
	{
		SetDisplay(this.m_oTiroir.m_oPartieBasse, false);
	}

	// Appel de la classe de base (memorise que l'animation est finie)
	WDAnim.prototype.vFin.apply(this, []);

	// Restaure les proprietes
	this.m_oTiroir.m_oPartieBasse.style.height = "auto";
	this.m_oTiroir.m_oPartieBasse.style.overflowY = this.m_sSavOverflowY;

	// Notifie le tiroir que l'animation est finie
	this.m_oTiroir.FinAnimation();
};

// Manipulation d'un tiroir
function WDTiroir(sAliasChamp, tabStyle, nHauteurBas, nType, nCourbe, nDuree)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, undefined, undefined]);

		this.m_tabStyle = tabStyle;
		// Parametres pour l'animation
		this.m_nHauteurBas = nHauteurBas;
		this.m_nType = nType ? nType : 0;
		this.m_nCourbe = nCourbe ? nCourbe : 0;
		this.m_nDuree = nDuree ? nDuree : 25;
	}
};

// Declare l'heritage
WDTiroir.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDTiroir.prototype.constructor = WDTiroir;
// Constantes de style
WDTiroir.prototype.ms_nStyleFerme = 0;
WDTiroir.prototype.ms_nStyleOuvert = 1;

// Initialisation
WDTiroir.prototype.Init = function Init()
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Recupere la partie haute et la partie basse
	this.m_oPartieHaute = oGetId('H-' + this.m_sAliasChamp);
	this.m_oPartieBasse = oGetId('B-' + this.m_sAliasChamp);

	// Recupere les clics sur la zone haute
	var oThis = this;
	if (bIE)
	{
		this.m_oPartieHaute.onclick = function() { oThis.OnClick(event); };
	}
	else
	{
		this.m_oPartieHaute.onclick = function(event) { oThis.OnClick(event); };
	}
};

// Pas de fonction pour la gestion des Pcodes il faut utiliser directement DeclarePCode et RecuperePCode

// Manipule le tiroir sur une action de l'utilisateur
WDTiroir.prototype.OnClick = function OnClick(oEvent)
{
	// Uniquement sur les champs est actif
	// Et si on clic sur le fond
	if ((this.eGetEtat() == this.ms_eEtatActif) && this.bClickDansFond(oEvent))
	{
		// Change le mode interne interne
		this.SetValeur(oEvent, (parseInt(this.oGetElementByName(document, "").value) == 0), null);

		// Appel le PCode navigateur de modification
		this.RecuperePCode(this.ms_nEventNavModifSimple)(oEvent);
	}
};

// Indique si on a clique sur le fond du haut
WDTiroir.prototype.bClickDansFond = function bClickDansFond(oEvent)
{
	// Recupere la liste des elements exclus
	var tabElementsExclus = this.tabGetElements(this.m_oPartieHaute, true);

	// Remonte la liste des elements depuis la partie clique
	var i;
	var nLimiteI = tabElementsExclus.length;
	var oElement = bIE ? oEvent.srcElement : oEvent.explicitOriginalTarget;
	while (oElement && oElement != this.m_oPartieHaute)
	{
		// Si l'element est dans la liste : on ne clique pas sur le fond
		for (i = 0; i < nLimiteI; i++)
		{
			if (tabElementsExclus[i] == oElement)
			{
				return false;
			}
		}
		oElement = oElement.parentNode;
	}
	return true;
};

// Changement de l'etat
WDTiroir.prototype.SetValeur = function SetValeur(oEvent, sValeur, oChamp)
{
	// Conversion de la valeur en booleen
	var bOuverture = this.bConversionValeur(sValeur);

	// Appel de la methode de la classe de base (ignore la valeur retourne par l'implementation de la classe de base)
	WDChamp.prototype.SetValeur.apply(this, [oEvent, bOuverture, oChamp]);

	// Affecte la valeur dans le champ formulaire
	var sValeur = bOuverture ? "1" : "0";
	this.oGetElementByName(document, "").value = sValeur;

	// Affiche/masque la partie basse
	this.AfficheTiroir(bOuverture);

	return sValeur;
};

// Recupere la valeur
WDTiroir.prototype.GetValeur = function GetValeur(oEvent, sValeur, oChamp)
{
	// Conversion de la valeur en booleen
	var bOuverture = this.bConversionValeur(sValeur);

	// Appel de la methode de la classe de base et retour de son resultat
	return WDChamp.prototype.GetValeur.apply(this, [oEvent, bOuverture, oChamp]);
};

// Lit les proprietes
WDTiroir.prototype.GetProp = function GetProp(eProp, oEvent, oValeur, oChamp)
{
	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_HAUTEUR:
		// Traite le cas de ..Hauteur : lit la hauteur du bas en tenant compte de la hauteur du haut
		return this.m_oPartieHaute.offsetHeight + this.m_nHauteurBas;
	case this.XML_CHAMP_PROP_NUM_LARGEUR:
		// Traite le cas de ..Largeur : lit la largeur du haut (le bas n'est pas forcement visible)
		return this.m_oPartieHaute.offsetWidth;
	case this.XML_CHAMP_PROP_NUM_ENROULE:
		// Rebond sur ..Valeur avec l'inverse
		return !this.GetValeur(oEvent, oValeur, oChamp);
	default:
		// Retourne a l'implementation de la classe de base avec la valeur eventuellement modifie
		return WDChamp.prototype.GetProp.apply(this, [eProp, oEvent, oValeur, oChamp]);
	}
};

// Ecrit les proprietes
WDTiroir.prototype.SetProp = function SetProp(eProp, oEvent, oValeur, oChamp)
{
	// Implementation de la classe de base
	oValeur = WDChamp.prototype.SetProp.apply(this, [eProp, oEvent, oValeur, oChamp]);

	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_HAUTEUR:
		// Traite le cas de ..Hauteur : modifie la hauteur du bas en tenant compte de la hauteur du haut
		this.m_nHauteurBas = oValeur - this.m_oPartieHaute.offsetHeight;
		this.m_oPartieBasse.getElementsByTagName("td")[0].height = this.m_nHauteurBas;
		return this.m_nHauteurBas
	case this.XML_CHAMP_PROP_NUM_LARGEUR:
		// Traite le cas de ..Largeur : modifie la hauteur du haut et du bas
		this.m_oPartieHaute.getElementsByTagName("td")[0].style.width = oValeur + "px";
		this.m_oPartieBasse.getElementsByTagName("td")[0].style.width = oValeur + "px";
		this.m_oPartieHaute.parentNode.style.width = oValeur + "px";
		return oValeur;
	case this.XML_CHAMP_PROP_NUM_ENROULE:
		// Rebond sur ..Valeur avec l'inverse
		return this.SetValeur(oEvent, !oValeur, oChamp);
	default:
		return oValeur;
	}
};

// Affiche/masque la partie basse
WDTiroir.prototype.AfficheTiroir = function AfficheTiroir(bOuverture)
{
	// Donne les bonne propriete a la partie basse
	// On gere le cas d'une animation deja en cours
	if (this.m_oAnimation)
	{
		// Annule l'animation (restaure automatiquement les proprietees du champ)
		this.m_oAnimation.vAnnule();
	}

	// Lance l'animation de la partie basse
	this.m_oAnimation = new WDAnimTiroir(this, bOuverture, this.m_nHauteurBas, this.m_nType, this.m_nCourbe, this.m_nDuree);

	// Change le style de la partie haute
	var sClass = this.m_tabStyle[bOuverture ? this.ms_nStyleOuvert : this.ms_nStyleFerme];
	if (sClass === undefined)
	{
		sClass = "";
	}
	this.m_oPartieHaute.className = sClass;
};

// Notifie le tiroir que l'animation est finie
WDTiroir.prototype.FinAnimation = function FinAnimation(bOuvert)
{
	delete this.m_oAnimation;

	// Force la MAJ des champs dans l'onglet (on n'exclus aucun champ)
	AppelMethode(WDChamp.prototype.ms_sOnDisplay, [this.m_oPartieBasse]);
}
