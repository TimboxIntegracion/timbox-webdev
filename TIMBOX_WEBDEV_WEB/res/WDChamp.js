//#15.00Aa WDChamp.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Classe utilitaire de gestion d'un tableau de champ indice par nom
function WDTableauChamps ()
{
	// Tableau fils qui contient les champs
	// La classe n'herite pas de Array (c'est +/- inutile en plus), car sinon cela interdirai toute variable locale
	this.m_tabChamps = [];
}

// Nombre de champ
WDTableauChamps.prototype.nGetNbChamps = function()
{
	return this.m_tabChamps.length;
};

// Declare un champ
WDTableauChamps.prototype.DeclareChamp = function(oChamp)
{
	this.m_tabChamps[oChamp.m_sAliasChamp] = oChamp;
};

// Recupere un champ
WDTableauChamps.prototype.oGetChamp = function(sChamp)
{
	return this.m_tabChamps[sChamp];
};

// Appele une methode sur tous les camps
WDTableauChamps.prototype.AppelMethode = function(sFonction, tabParam, oExclus)
{
	for (var sChamp in this.m_tabChamps)
	{
		// Recupere le champ et teste sa validite
		var oChamp = this.m_tabChamps[sChamp];
		if (oChamp && (oChamp != oExclus) && (oChamp.m_oPartieBasse  != oExclus))
		{
			// Applique alors la methode sur le champ
			oChamp[sFonction].apply(oChamp, tabParam);
		}
	}
};

// Appele une methode sur un champ dont on connait le nom
// tabParam : tableau des parametres
WDTableauChamps.prototype.AppelMethodeChamp = function AppelMethodeChamp(sAlias, sFonction, tabParam)
{
	var oChamp = this.oGetChamp(sAlias);
	if (oChamp)
	{
		oChamp[sFonction].apply(oChamp, tabParam);
	}
};
WDTableauChamps.prototype.AppelFonctionChamp = function AppelFonctionChamp(sAlias, sFonction, tabParam)
{
	var oChamp = this.oGetChamp(sAlias);
	if (oChamp)
	{
		return oChamp[sFonction].apply(oChamp, tabParam);
	}
	return undefined;
};


// Classe de base de manipulation des champs de WebDev
// - Gestion de l'appartenace a :
//	- Une ZR
//	- Un onglet
// - Gestion des evenements AJAX (affectation etc)
function WDChamp(sAliasChamp, sAliasZR, sAliasAttribut)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// L'alias du champ
		this.m_sAliasChamp = sAliasChamp;
		// La ZR eventuelle qui contient le champ si la propriete ..Valeur est liee a un attribut (sAliasChamp est alors l'alias de cet attribut)
		if (sAliasZR)
		{
			this.m_sAliasZR = sAliasZR;
			this.m_sAliasAttribut = sAliasAttribut;
		}

		// Tableau des PCodes du champ
		this.m_tabPCodes = [];

		// Le champ est actif
//		this.m_nVisible = true;
		this.m_eEtat = this.ms_eEtatActif;
	}
}

// Tableau global des champs JS de la page
WDChamp.prototype.ms_tabChamps = new WDTableauChamps();
// Tableau global des ZRs/Tables de la page (pour pouvoir les manipulers des les inits des champs
WDChamp.prototype.ms_tabTablesZRs = new WDTableauChamps();
// Numero des PCodes navigateurs
WDChamp.prototype.ms_nEventNavBlur = 10;
WDChamp.prototype.ms_nEventNavChange = 11;
WDChamp.prototype.ms_nEventNavFocus = 12;
WDChamp.prototype.ms_nEventNavSelectLigne = 20;
WDChamp.prototype.ms_nEventNavModifSimple = 21;
WDChamp.prototype.ms_nEventNavAffichageMois = 28;
WDChamp.prototype.ms_nEventNavSelectionJour = 29;
WDChamp.prototype.ms_nEventNavUploadSelection = 30;
WDChamp.prototype.ms_nEventNavUploadAvancement = 31;
// Fonction vide pour la gestion des PCodes
WDChamp.prototype.m_pfVide = function() { return true; }
// Etats des champs.AppelMethode Les valeurs mappent sur les valeurs WL meme si visible n'est pas utilise
WDChamp.prototype.ms_eEtatActif = 0;
WDChamp.prototype.ms_eEtatLectureSeule = 1;
WDChamp.prototype.ms_eEtatGrise = 4;

WDChamp.prototype.ID_SEPARATEUR = "_";

// Initialisation
WDChamp.prototype.Init = function()
{
	// Si c'est l'init du premier champ
	if (WDChamp.prototype.ms_tabChamps.nGetNbChamps() == 0)
	{
		this.__InitInitiale();
	}

	// Si le champ est dans une ZR : notifie l'objet ZR de sa presence
	// Note : On ne peut pas faire cette declaration dans le constructeur car l'existence de l'objet de la ZR n'est pas garanti
	// En effet l'ordre actuel de creation des objets est : fils puis parent
	// Ce qui signifie que la liste comlete n'est pas complete avant la fin de tous les init. Sauf que l'init de la ZR est
	// alors pares celui de tous ces fils donc on peut considerer qu'il existe
	if (this.bGestionZR())
	{
		WDChamp.prototype.ms_tabTablesZRs.AppelMethodeChamp(this.m_sAliasZR, "DeclareChampFils", [this]);
	}

	// Se memorise comme champ dans le tableau global
	// Fait dans l'init et pas dans la construction, pour ne pas ajouter un champ invalide
	WDChamp.prototype.ms_tabChamps.DeclareChamp(this);
};

// Methode d'initialisation generale de la classe
// Appelle lors de l'init du PREMIER champ
WDChamp.prototype.__InitInitiale = function()
{
	// Enregistre l'evenement onresize sur la fenetre
	var fOnResize;
	if (bIE)
	{
		fOnResize = function() { AppelMethode(WDChamp.prototype.ms_sOnResize, [event], undefined) };
	}
	else
	{
		fOnResize = function(oEvent) { AppelMethode(WDChamp.prototype.ms_sOnResize, [oEvent], undefined) };
	}
	HookOnXXX(window, 'onresize', 'resize', fOnResize);
};

// Methode STATIQUE : Recupere l'objet attache a un champ
function oGetObjetChamp(sAlias)
{
	return WDChamp.prototype.ms_tabChamps.oGetChamp(sAlias);
};

// Methode STATIQUE : Appele une methode sur tout les champs sauf le champ passe en parametre
// Il est possible de ne pas passer le parametre
// tabParam : tableau des parametres
function AppelMethode(sFonction, tabParam, oExclus)
{
	WDChamp.prototype.ms_tabChamps.AppelMethode(sFonction, tabParam, oExclus);
};

// Methode STATIQUE : Appele une methode sur un champ dont on connait le nom
// tabParam : tableau des parametres
function AppelMethodeChamp(sAlias, sFonction, tabParam)
{
	WDChamp.prototype.ms_tabChamps.AppelMethodeChamp(sAlias, sFonction, tabParam);
}
function AppelFonctionChamp(sAlias, sFonction, tabParam)
{
	return WDChamp.prototype.ms_tabChamps.AppelFonctionChamp(sAlias, sFonction, tabParam);
}


// Appele une methode sur tout les champs sauf sur le champ courant
// tabParam : tableau des parametres
WDChamp.prototype.AppelMethodeAutres = function(sFonction, tabParam)
{
	AppelMethode(sFonction, tabParam, this);
};

//////////////////////////////////////////////////////////////////////////
// Gestion des PCodes

// Declare un PCode navigateur au champ
WDChamp.prototype.DeclarePCode = function(ePCodeNav, pfFonction)
{
	this.m_tabPCodes[ePCodeNav] = pfFonction;
};

// Recupere un PCode navigateur du champ
// Cette fonction n'appele pas le PCode : il n'est pas possible de transformer simplement les parametres variables et en supprimant un
// Mais cette fonction retourne une fonction vide qui permet de ne rien faire planter
WDChamp.prototype.RecuperePCode = function(ePCodeNav)
{
	var pfFonction = this.m_tabPCodes[ePCodeNav];
	if (pfFonction)
	{
		return pfFonction;
	}
	return this.m_pfVide;
};

// Cree un Timeout sur le champ courant et renvoi l'id du Timeout
// La fonction est en fait une fonction '...'. Elle concatene les parametre a partir du troisieme comme arguments de la procedure appelee
// Seule les parametres de type chaines sont encadre par des " MAIS NE sont pas escapes
WDChamp.prototype.nSetTimeout = function nSetTimeout(sFonction, nDuree)
{
	return this.__nSetTimeXXX(sFonction, nDuree, false, this.__sArgumentsVersTableauChaine(arguments, 2));
};

// Cree un timer sur le champ courant et renvoi l'id du timer
// La fonction est en fait une fonction '...'. Elle concatene les parametre a partir du troisieme comme arguments de la procedure appelee
// Seule les parametres de type chaines sont encadre par des " MAIS NE sont pas escapes
WDChamp.prototype.nSetInterval = function nSetInterval(sFonction, nDuree)
{
	return this.__nSetTimeXXX(sFonction, nDuree, true, this.__sArgumentsVersTableauChaine(arguments, 2));
};


// Recupere le tableau des arguments d'une fonction avec conversion en chaine
WDChamp.prototype.__sArgumentsVersTableauChaine = function __sArgumentsVersTableauChaine(tabParam, nPremier)
{
	// Construit le tableau des parametres
	var tabParam_Chaine = [];
	var i;
	var nLimiteI = tabParam.length;
	// Commence au troisieme argument
	for (i = nPremier; i < nLimiteI; i++)
	{
		// Ajoute l'argument avec des " si c'est une chaine
		var arg = tabParam[i];
		tabParam_Chaine.push(((typeof arg).toLowerCase() == "string") ? "\"" + arg + "\"" : arg + "");
	}

	return "[" + tabParam_Chaine.join(",") + "]";
};

// Version interne qui prend un tableau d'arguments
// L'argument 0 est la fonction, l'argument 1 est la duree
WDChamp.prototype.__nSetTimeXXX = function __nSetTimeXXX(sFonction, nDuree, bInterval, tabParam_Chaine)
{
	if (bInterval)
	{
		return setInterval("AppelMethodeChamp(\"" + this.m_sAliasChamp + "\",\"" + sFonction + "\"," + tabParam_Chaine + ");", nDuree);
	}
	else
	{
		return setTimeout("AppelMethodeChamp(\"" + this.m_sAliasChamp + "\",\"" + sFonction + "\"," + tabParam_Chaine + ");", nDuree);
	}
};

// Gestion de setTimeout avec appel unique (un seul appel en attente)
WDChamp.prototype.nSetTimeoutUnique = function nSetTimeoutUnique(sFonction, nDuree)
{
	// Supprime le Timeout de meme nom s'il existe
	this.AnnuleTimeXXX(sFonction, false);

	// Et cree le nouveau
	var nTimeout = this.__nSetTimeXXX("TimeoutUnique", nDuree, false, "[\"" + sFonction + "\"," + this.__sArgumentsVersTableauChaine(arguments, 2) + "]");
	this[this.sNomVariableTimeXXX(sFonction)] = nTimeout;
	return nTimeout;
};

// Callback pour la gestion des timeouts uniques
WDChamp.prototype.TimeoutUnique = function TimeoutUnique(sFonction, tabParam)
{
	// Supprime le timeout
	this.SupprimeTimeout(sFonction);
	// Appel la fonction
	this[sFonction].apply(this, tabParam);
};

// Recupere un timer
WDChamp.prototype.bGetTimeXXXExiste = function bGetTimeXXXExiste(sFonction)
{
	// Si le Timeout existe
	return (this[this.sNomVariableTimeXXX(sFonction)] !== undefined);
}

// Annule un Timeout
WDChamp.prototype.AnnuleTimeXXX = function AnnuleTimeXXX(sFonction, bInterval)
{
	// Si le Timeout existe
	var sVarTimeXXX = this.sNomVariableTimeXXX(sFonction);
	var nTimeXXX = this[sVarTimeXXX];
	if (nTimeXXX !== undefined)
	{
		// Le libere
		if (bInterval)
		{
			clearInterval(nTimeXXX);
		}
		else
		{
			clearTimeout(nTimeXXX);
		}
		// Et supprime la variable
		delete this[sVarTimeXXX];
	}
};

// Supprime la reference a un Timeout
WDChamp.prototype.SupprimeTimeout = function SupprimeTimeout(sFonction)
{
	// Si le Timeout existe
	var sVarTimeout = this.sNomVariableTimeXXX(sFonction);
	if (this[sVarTimeout] !== undefined)
	{
		delete this[sVarTimeout];
	}
};

// Calcule le nom de la variable memorisant le Timeout
WDChamp.prototype.sNomVariableTimeXXX = function sNomVariableTimeXXX(sFonction)
{
	return "m_nTimeXXX_" + sFonction;
};

WDChamp.prototype.nGetVariableTimeXXX = function nGetVariableTimeXXX(sFonction)
{
	return this[this.sNomVariableTimeXXX(sFonction)];
};

//////////////////////////////////////////////////////////////////////////
// Etat du champ

// Etats des champs. Les valeurs mappent sur les valeurs WL meme si visible n'est pas utilise
WDChamp.prototype.SetEtat = function(eEtat)
{
	this.m_eEtat = eEtat;
};
WDChamp.prototype.eGetEtat = function()
{
	return this.m_eEtat;
};

// Methode predefinies nommee
// - Tous les champs : affectation du contenu HTML pour l'AJAX
WDChamp.prototype.PreAffecteHTML = function PreAffecteHTML(bDepuisAJAX) { };
WDChamp.prototype.ms_sPreAffecteHTML = "PreAffecteHTML";
WDChamp.prototype.PostAffecteHTML = function PostAffecteHTML(bDepuisAJAX) { };
WDChamp.prototype.ms_sPostAffecteHTML = "PostAffecteHTML";
// - Tous les champs : Notifie le champ le conteneur xxx est affiche via un .display = "block"
WDChamp.prototype.OnDisplay = function OnDisplay(oElementRacine) { };
WDChamp.prototype.ms_sOnDisplay = "OnDisplay";
// - Tous les champs : Notifie le champ que la fenetre est redimentionnee
WDChamp.prototype.OnResize = function OnResize(oEvent) {};
WDChamp.prototype.ms_sOnResize = "OnResize";
// - Tous les champs : affectation de la valeur
WDChamp.prototype.SetValeur = function SetValeur(oEvent, sValeur, oChamp) { return sValeur; };
WDChamp.prototype.ms_sSetValeur = "SetValeur";
WDChamp.prototype.GetValeur = function GetValeur(oEvent, sValeur, oChamp) { return sValeur; };
WDChamp.prototype.ms_sGetValeur = "GetValeur";
// - Affectation des parametres du champ
WDChamp.prototype.DeduitParam = function DeduitParam(sParamChamp) { };
WDChamp.prototype.ms_sDeduitParam = "DeduitParam";
// - Champ table : rafraichissement du contenu
WDChamp.prototype.Refresh = function Refresh(nReset, nNouveauDebut, sCleNouveauDebut) { };
WDChamp.prototype.ms_sRefresh = "Refresh";
// - Champ avec "barre" (graphe/saisie riche)
WDChamp.prototype.MasqueBarre = function MasqueBarre(oEvent) { };
WDChamp.prototype.ms_sMasqueBarre = "MasqueBarre";

// Methode appele directement
// - Champ dans une ZR : notifie le champ de l'affichage/suppression de la ligne
WDChamp.prototype.OnLigneZRAffiche = function OnLigneZRAffiche(nLigneAbsolueBase1, bSelectionne) { };
WDChamp.prototype.ms_sOnLigneZRAffiche = "OnLigneZRAffiche";
WDChamp.prototype.OnLigneZRMasque = function OnLigneZRMasque(nLigneAbsolueBase1, bSelectionne, oEvent) { };
WDChamp.prototype.ms_sOnLigneZRMasque = "OnLigneZRMasque";

// - Tous les champs : ..Xxx generique
WDChamp.prototype.XML_CHAMP_PROP_NUM_SOUSELEMENT = -2;	// Objet
WDChamp.prototype.XML_CHAMP_PROP_NUM_CONTENU = -1;		// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_VALEUR = 1;		// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_LIBELLE = 3;		// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_HAUTEUR = 5;		// Entier
WDChamp.prototype.XML_CHAMP_PROP_NUM_LARGEUR = 6;		// Entier
WDChamp.prototype.XML_CHAMP_PROP_NUM_COULEUR = 10;		// Formate en chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_COULEURFOND = 11;	// Formate en chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_ETAT = 12;		// Balise XML
WDChamp.prototype.XML_CHAMP_PROP_NUM_OCCURRENCE = 14;	// Entier
WDChamp.prototype.XML_CHAMP_PROP_NUM_VISIBLE = 18;		// Valeur formate en chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_VALEURAFFICHEE = 21; // Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_IMAGE = 34;		// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_URL = 38;			// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_BULLE = 39;		// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_X = 41;			// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_Y = 42;			// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_CURSEURSOURIS = 43; // Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICEGRAS = 47;	// Entier
WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICEITALIQUE = 48; // Booleen formate en chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICENOM = 49;	// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICESOULIGNE = 50; // Booleen formate en chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICETAILLE = 51;	// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_OPACITE = 52;		// Entier
WDChamp.prototype.XML_CHAMP_PROP_NUM_CADRAGEH = 53;		// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_CADRAGEV = 54;		// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_INDICATION = 58;	// Chaine
WDChamp.prototype.XML_CHAMP_PROP_NUM_ENROULE = 72;		// Booleen formate en chaine
WDChamp.prototype.GetProp = function GetProp(eProp, oEvent, oValeur, oChamp)
{
	// Traite le cas de ..Valeur pour faire un rebond sur GetValeur
	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_SOUSELEMENT:
		return null;
	case this.XML_CHAMP_PROP_NUM_VALEUR:
		return this.GetValeur(oEvent, oValeur, oChamp);
	default:
		return oValeur;
	}
};
WDChamp.prototype.ms_sGetProp = "GetProp";
WDChamp.prototype.SetProp = function SetProp(eProp, oEvent, oValeur, oChamp)
{
	// Traite le cas de ..Valeur pour faire un rebond sur SetValeur
	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_VALEUR:
		return this.SetValeur(oEvent, oValeur, oChamp);
	default:
		// Retourne inchangee la valeur de la propriete
		return oValeur;
	}
};
WDChamp.prototype.ms_sSetProp = "SetProp";

//////////////////////////////////////////////////////////////////////////
// Gestion des ZRs

// Indique si on est dans une ZR
WDChamp.prototype.bGestionZR = function()
{
	return ((this.m_sAliasZR) ? true : false);
};
// Indique si on est dans une ZR AJAX et si c'est le cas retourne l'objet de la ZR (sinon retourne undefined)
WDChamp.prototype.oGetZRAjax = function()
{
	return (this.bGestionZR() ? WDChamp.prototype.ms_tabTablesZRs.oGetChamp(this.m_sAliasZR) : undefined);
};

// Retourne le premier element d'une ZR (le champ DOIT etre dans une ZR)
WDChamp.prototype.nGetZRValeur = function()
{
	return parseInt(document.getElementsByName(this.m_sAliasZR)[0].value, 10);
};
WDChamp.prototype.SetZRValeur = function(oEvent, nLigneAbsolueBase1)
{
	// Si on est dans une ZR AJAX, notifie le champ
	var oZRAjax = this.oGetZRAjax();
	if (oZRAjax)
	{
		oZRAjax.OnSelectLigne(nLigneAbsolueBase1 - oZRAjax.m_nDebut - 1, 0, oEvent);
	}
	else
	{
		// Sinon ecrit directement dans le champ formulaire
		document.getElementsByName(this.m_sAliasZR)[0].value = nLigneAbsolueBase1;
	}
};
WDChamp.prototype.nGetZRDebut = function()
{
	return parseInt(document.getElementsByName(this.m_sAliasZR + "_DEB")[0].value, 10);
};
WDChamp.prototype.nGetZROccurrence = function()
{
	return parseInt(document.getElementsByName("_" + this.m_sAliasZR + "_OCC")[0].value, 10);
};

//////////////////////////////////////////////////////////////////////////
// Gestion des champs

// Retourne le nom d'un objet en fonction de son suffixe et du nom du champ
WDChamp.prototype.sGetNomElement = function(sSuffixe)
{
	return this.m_sAliasChamp + sSuffixe;
};
// Retourne un objet en fonction de son suffixe et du nom du champ
WDChamp.prototype.oGetElementById = function(oDocument, sSuffixe)
{
	return oDocument.getElementById(this.sGetNomElement(sSuffixe));
};
WDChamp.prototype.oGetElementByName = function(oElement, sSuffixe)
{
	return oElement.getElementsByName(this.sGetNomElement(sSuffixe))[0];
};

// Construit l'id d'un element par concatenation des suffixes
// Pseudo fonction en '...' : accepte un tableau des argument d'une fonction avec un nombre variables de parametres
WDChamp.prototype.sGetSuffixeIDElementArg = function(tabArgs)
{
	var sSuffixe = "";
	var i;
	var nLimiteI = tabArgs.length;
	for (i = 0; i < nLimiteI; i++)
	{
		sSuffixe += this.ID_SEPARATEUR + tabArgs[i];
	}
	return sSuffixe;
};
// Fonction en '...' : accepte un nombre variable d'arguments
WDChamp.prototype.sGetSuffixeIDElement = function()
{
	return this.sGetSuffixeIDElementArg(arguments);
};

// Recupere un element en construisant son identifiant
// Fonction en '...' : accepte un nombre variable d'arguments
WDChamp.prototype.oGetIDElement = function()
{
	return this.oGetElementById(document, this.sGetSuffixeIDElementArg(arguments));
};

//////////////////////////////////////////////////////////////////////////
// Gestion des champs dans les ZRs

// Retourne le nom d'un objet en fonction de son suffixe, du nom du champ et de la presence d'une ZR
WDChamp.prototype.sGetNomElementZR = function(sSuffixe)
{
	return this.sGetNomElementZRCalc(this.bGestionZR(), sSuffixe);
};
// Retourne le nom d'un objet en fonction de son suffixe, du nom du champ et de la presence d'une ZR selon le parametre
WDChamp.prototype.sGetNomElementZRCalc = function(bDansZR, sSuffixe)
{
	// Si on est dans une ZR
	if (bDansZR)
	{
		// Retourne _INDICEZR_ALIASCHAMP + suffixe
		return this.sGetNomElementZRIndice(this.nGetZRValeur(), sSuffixe);
	}
	else
	{
		// Pas dans une ZR : methode normale
		return this.sGetNomElement(sSuffixe);
	}
};

// Retourne le nom d'un objet en fonction de son suffixe, du nom du champ et de son indice dans la ZR
WDChamp.prototype.sGetNomElementZRIndice = function(nIndice, sSuffixe)
{
	// Retourne _INDICEZR_ALIASCHAMP + suffixe
	// Dans les ZR fichier avec rebond il faut tenir compte de this.nGetZRDebut() ?
//	return "_" + (nIndice + this.nGetZRDebut() - 1) + "_" + this.m_sAliasAttribut + sSuffixe;
	return "_" + nIndice + "_" + this.m_sAliasAttribut + sSuffixe;
};

// Retourne un objet en fonction de son suffixe, du nom du champ et de la presence d'une ZR
WDChamp.prototype.oGetElementByIdZR = function(oDocument, sSuffixe)
{
	return this.oGetElementByIdZRCalc(this.bGestionZR(), oDocument, sSuffixe);
};
WDChamp.prototype.oGetElementByNameZR = function(oElement, sSuffixe)
{
	return this.oGetElementByNameZRCalc(this.bGestionZR(), oElement, sSuffixe);
};

// Retourne un objet en fonction de son suffixe, du nom du champ et de la presence d'une ZR selon le parametre
WDChamp.prototype.oGetElementByIdZRCalc = function(bDansZR, oDocument, sSuffixe)
{
	return oDocument.getElementById(this.sGetNomElementZRCalc(bDansZR, sSuffixe));
}
WDChamp.prototype.oGetElementByNameZRCalc = function(bDansZR, oElement, sSuffixe)
{
	return oElement.getElementsByName(this.sGetNomElementZRCalc(bDansZR, sSuffixe))[0];
};

// Retourne un objet en fonction de son suffixe, du nom du champ et de son indice dans la ZR
WDChamp.prototype.oGetElementByIdZRIndice = function(oDocument, nIndice, sSuffixe)
{
	return oDocument.getElementById(this.sGetNomElementZRIndice(nIndice, sSuffixe));
}
WDChamp.prototype.oGetElementByNameZRIndice = function(oElement, nIndice, sSuffixe)
{
	return oElement.getElementsByName(this.sGetNomElementZRIndice(nIndice, sSuffixe))[0];
};

// Recupere un balise object ou embeb en fonction du navigateur
WDChamp.prototype.oGetObjectEmbed = function oGetObjectEmbed(sNom)
{
	var tabChamp = document.getElementsByName(sNom);
	// Uniquement sous IE (balise object manipule par IE, embed par FF)
	if (tabChamp && (tabChamp.length >= 1) && tabChamp[0] && (tabChamp[0].tagName.toLowerCase() == "object") && bIE)
	{
		return tabChamp[0];
	}
	else if (tabChamp && (tabChamp.length > 1) && tabChamp[1])
	{
		return tabChamp[1];
	}
	else
	{
		return oGetId(sNom);
	}
};

// Autres methodes

// Conversion d'une valeur quelquonque en booleen
WDChamp.prototype.bConversionValeur = function bConversionValeur(sValeur)
{
	// Selon le type de la valeur
	switch ((typeof sValeur).toLowerCase())
	{
	case "boolean":
		return sValeur;
	case "string":
		return (sValeur != "0");
	case "number":
		return (sValeur != "0");
	case "function":
	case "objet":
	case "undefined":
	default:
		return false;
	}
};

// Recupere tous les elements formulaire d'une cellule
WDChamp.prototype.tabGetElements = function tabGetElements(oCellule, bAvecLien)
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

// Fusionne le retour de getElementsByTagName avec un tableau
WDChamp.prototype._tabGetUnTypeElement = function _tabGetUnTypeElement(oCellule, sTag, tabElements)
{
	// Trouve les elements
	var tabElementsByTagName = oCellule.getElementsByTagName(sTag);
	// Fusionne les tableaux
	var i = 0;
	var nLimiteI = tabElementsByTagName.length;
	for (i = 0; i < nLimiteI; i++)
	{
		tabElements.push(tabElementsByTagName[i]);
	}
	// Et retourne le tableau resultat
	return tabElements;
};

WDChamp.prototype.__nGetOffset = function(sVal)
{
	var nOffset = parseInt(sVal);
	return (!isNaN(nOffset) && (nOffset > 0)) ? nOffset : 0;
};
