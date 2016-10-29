//#15.00Aa WDUpload.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation des champs Upload

// Manipulation d'un Upload
function WDUpload(sAliasChamp, sAliasZR, sAliasAttribut, sFiltre)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, sAliasZR, sAliasAttribut]);

		this.m_oFlash = null;
		this.m_sFiltre = sFiltre;
	}
};

// Declare l'heritage
WDUpload.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDUpload.prototype.constructor = WDUpload;
// Enumeration eUPLOADPROGRESSDATA
WDUpload.prototype.ms_eProgressDataEnvoyee = 0;
WDUpload.prototype.ms_eProgressDataTotal = 1;
WDUpload.prototype.ms_eProgressDataFichierEnvoyee = 2;
WDUpload.prototype.ms_eProgressDataFichierTotal = 3;
WDUpload.prototype.ms_eProgressDataFichier = 4;


// Initialisation
WDUpload.prototype.Init = function Init()
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Init interne
	this._Init(false);
};

// Init interne (aussi appele lors de l'affichage)
WDUpload.prototype._Init = function _Init(bPourDisplay)
{
	// Recupere le champ flash
	this.m_oFlash = this.oGetObjectEmbed(this.m_sAliasChamp);
	// Si le flash est deplace dans le DOM, il faut refixer sa valeur sinon le lien avec les fonctions interne est perdu
	if (bFF && bPourDisplay)
	{
		this.m_oFlash.src = this.m_oFlash.src;
	}
	// Donne au flash le nom du champ
	this.nSetTimeout("InitFlash", 500);
//	this.m_oFlash.SetVariable("obj", this.m_sAliasChamp);

	// Hack pour chrome/safari qui ne met pas le champ flash dans le formulaire
	if (bWK)
	{
		_PAGE_[this.m_sAliasChamp] = this.m_oFlash;
	}
};

// Initialise le flahs en lui donnant ses parametres
WDUpload.prototype.InitFlash = function InitFlash()
{
	// Donne le nom du champ
	this.SetVariable("obj", this.m_sAliasChamp);
	// Et le filtre
	this.SetVariable("fil", this.m_sFiltre);
};

// Donne la variable au flash
WDUpload.prototype.SetVariable = function SetVariable(sVar, sValeur)
{
	//validar que el objeto contenga la funcion para que no marque error
	if(typeof this.m_oFlash.SetVariable == "function")
		this.m_oFlash.SetVariable(sVar, sValeur);
};

// Interface AVEC le WL

// ..Valeur
WDUpload.prototype.GetValeur = function GetValeur(oEvent, nOccurrence, oChamp)
{
	// Rappel de la classe de base avec la bonne valeur
	return WDChamp.prototype.GetValeur.apply(this, [oEvent, this.GetPropriete("GetValeur", ""), oChamp]);
};

// Lit les proprietes dont l'occurrence et []
WDUpload.prototype.GetProp = function GetProp(eProp, oEvent, oValeur, oChamp)
{
	switch (eProp)
	{
	case this.XML_CHAMP_PROP_NUM_SOUSELEMENT:
		// Recupere la liste des fichiers;
		var sValeur = this.GetValeur();
		// Transforme la chaine en tableau
		var tabValeur = sValeur.split("\r\n");

		// Passe en indice C
		var nPosition = oValeur - 1;
		// Recupere la valeur si l'indice est valide
		if ((nPosition >= 0) && (nPosition < tabValeur.length))
		{
			return tabValeur[nPosition];
		}
		return "";

	case this.XML_CHAMP_PROP_NUM_OCCURRENCE:
		// Traite le cas de ..Occurrence
		return this.GetPropriete("GetOccurrence", 0);
	default:
		// Retourne a l'implementation de la classe de base avec la valeur eventuellement modifie
		return WDChamp.prototype.GetProp.apply(this, [eProp, oEvent, oValeur, oChamp]);
	}
};

// Ecrit les proprietes dont l'occurrence : pas en ecriture
//WDUpload.prototype.SetProp = function SetProp(eProp, oEvent, oValeur, oChamp)

// Submit de la page
WDUpload.prototype.OnSubmit = function OnSubmit()
{
	// Pas d'upload dans le submit pour le moment
//	// Appele la fonction interne commune avec UploadLance
//	this.__Lance();
//
//	// Attend la fin de l'upload
//	while (this.bGetUploadEnCours())
//	{
//		// Attente active mais il n'y a pas moyen de faire autrement en JS
//	}
};

// Fonction WL UploadLance
// !!! Fonction en ellipse !!!
//WDUpload.prototype.Lance = function Lance (sFonction)
WDUpload.prototype.Lance = function Lance()
{
	// Appele la fonction interne commune avec OnSubmit
	// Prepare au passage les parametres
//	this.__Lance(clWDEncode.sEncodePOST(sFonction), sConstuitProcedureParams(1, arguments));
	this.__Lance(sConstuitProcedureParams(0, arguments));
};

// Fonction principale de l'upload
// sFonction et sParams sont deja encode pour l'URL
//WDUpload.prototype.__Lance = function Lance(sFonction, sParams)
WDUpload.prototype.__Lance = function Lance(sParams)
{
	// Si on a des fichier a uploader et que l'on n'est pas deja en cours d'upload
	if ((this.GetPropriete("GetOccurrence", 0) == 0) || this.bGetUploadEnCours())
	{
		return;
	}

	// - Prepare le parametre de session AWP
	// @@@ TODO
	var sParamAWP = "";
	// - Prepare le nom du champ
	var sNomChamp = "&WD_BUTTON_CLICK_=" + this.m_sAliasChamp;

	// La requete pour les fichiers normaux
	var sURL = "WD_ACTION_=UPLOADFICHIER" + sParamAWP + sNomChamp;
	// La requete pour le dernier fichier
	var sURLFinale;
//	if (sFonction)
	if (sParams !== undefined)
	{
		// Cas de UploadLance : avec procedure et parametre
//		sURLFinale = "WD_ACTION_=UPLOADFICHIERFIN" + sParamAWP + sNomChamp + "&WD_PROCEDURE_=" + clWDEncode.sEncodePOST(sFonction) + sParams;
		sURLFinale = "WD_ACTION_=UPLOADFICHIERFIN" + sParamAWP + sNomChamp + sParams;
	}
	else
	{
		// Cas du submit : upload normal
		sURLFinale = sURL;
	}

	var sAction = sGetPageAction(null, false, true, true);
	sAction += ((sAction.indexOf("?") != -1) ? "&" : "?");
	// Notifie le flash
	this.m_oFlash.SetVariable("url", sAction + sURL);
	this.m_oFlash.SetVariable("urlfin", sAction + sURLFinale);

	// Memorise le moment du lancement de l'upload pour avoir une reference pour les reveils periodiques du serveur
	this.m_nReveilDernier = (new Date()).getTime();
	// Avec l'action serveur
	this.m_sReveilURL = sAction + "WD_ACTION_=UPLOADREVEIL" + sParamAWP + sNomChamp;

	// Lance l'upload
	this.m_oFlash.SetVariable("action", "upload");
};

// Si on a un upload en cours
WDUpload.prototype.bGetUploadEnCours = function bGetUploadEnCours()
{
	return this.GetPropriete("GetUploadEnCours", false);
};

// Fonctions WL UploadTailleXXX
WDUpload.prototype.nGetProgressData = function nGetProgressData (eInformation)
{
	// Si on est dans un upload : this.m_tabProgressData est indexe sur les ms_eProgressDataXXX
	if (this.m_tabProgressData)
	{
		return this.m_tabProgressData[eInformation];
	}

	// Valeur par defaut de l'avancement de l'upload si on est pas dans un upload
	return 0;
};

// Fonction WL UploadSupprime
WDUpload.prototype.Supprime = function Supprime (nPosition)
{
	// Le code flash attend un indice WL en fait
//	// Appel le .swf : en indice C sous forme de chaine
//	this.m_oFlash.SetVariable("sup", (nPosition - 1) + "");
	this.m_oFlash.SetVariable("sup", nPosition + "");
};

// Fonction WL UploadSupprimeTout
WDUpload.prototype.SupprimeTout = function SupprimeTout ()
{
	// Appel le flash
	this.m_oFlash.SetVariable("action", "raz");
};

// Fonction WL UploadTailleFichier
WDUpload.prototype.nGetUploadTailleFichier = function nGetUploadTailleFichier(nIndiceFichierWL)
{
	if (!nIndiceFichierWL)
	{
		nIndiceFichierWL = 1;
	}

	// Recupere la liste des fichiers avec leur taille
	var sListeFichierDetails = this.GetPropriete("GetValeurTaille", "");
	// Transforme la chaine en tableau
	var tabDetails = sListeFichierDetails.split("\r\n");
	// Passe en indice C
	var nIndiceFichier = nIndiceFichierWL - 1;
	// Recupere la valeur si l'indice est valide
	if ((nIndiceFichier >= 0) && (nIndiceFichier < tabDetails.length))
	{
		// La chaine est de la forme Fichier TAB taille
		return parseInt(tabDetails[nIndiceFichier].split("\t")[1], 10);
	}
	return 0;

	// Appel le flash pour recuperer les informations
	this.m_oFlash.SetVariable("action", "raz");
};

// Interface pour le flash

// Appel d'une methode depuis le flash
// => Il faut utiliser AppelMethodeChamp

// Recupere une valeur du flash
WDUpload.prototype.GetPropriete = function GetPropriete(sMethode, oDefaut)
{
	// Cree la variable
	this.m_oPropriete = oDefaut;

	// Appel le flash
	this.m_oFlash.SetVariable("action", sMethode);

	// Recupere la valeur renseigne par la callback
	var oPropriete = this.m_oPropriete;
	delete this.m_oPropriete;

	return oPropriete;
};

// Procedure generique pour retourner une valeur au JS
// - Liste des fichiers (pour ..Valeur et [])
// - Nombre des fichiers (pour ..Occurrence)
WDUpload.prototype.OnGetPropriete = function OnGetPropriete(oPropriete)
{
	// La fonction est appele en callback par le flash pour nous donner la proriete
	this.m_oPropriete = oPropriete;
};

// Progression de l'upload
WDUpload.prototype.OnAvancement = function OnAvancement(nEnvoyee, nTotal, nFichierEnvoyee, nFichierTotal, nFichier)
{
	if (isNaN(nEnvoyee))
	{
		// Affiche le message d'erreur
		alert(STD_ERREUR_MESSAGE_UPLOAD);
		// Et force une MAJ de l'affichage
		nEnvoyee = 1;
		nTotal = 1;
	}
	// Memorise les donnees de la progression
	// Passe nFichier de l'indice C en indice WL
	this.m_tabProgressData = [nEnvoyee, nTotal, nFichierEnvoyee, nFichierTotal, nFichier + 1];

	// Pour eviter les messages de flash sur le script qui s'execute trop longtemp, on repouse l'appel
	// Si un appel est deja en attente : pas d'empilage
	// En revanche les dernieres donnees sont utilisees (voir la ligne au dessus)
	if (this.nGetVariableTimeXXX("OnAvancement") === undefined)
	{
		this[this.sNomVariableTimeXXX("OnAvancement")] = this.nSetTimeout("__OnAvancement", 1);
	}
};

// Progression de l'upload version interne
WDUpload.prototype.__OnAvancement = function __OnAvancement()
{
	// Effectue un reveil periodique de la session pour que un upload long ne la fasse pas tomber en timeout
	var nMaintenant = (new Date()).getTime();
	// Si le dernier reveil est trop ancien, en effectue un autre
	// Toutes les 3 minutes
	if (this.m_nReveilDernier && ((nMaintenant - this.m_nReveilDernier) > 180000))
	{
		// Requete AJAX vers le serveur
		var oImageTemp = (new Image()).src = this.m_sReveilURL + "&RAND=" + Math.random();
		this.m_nReveilDernier = nMaintenant;
	}

	// Appele le PCode
	// Pas d'event
	this.RecuperePCode(this.ms_nEventNavUploadAvancement)();

	// Supprime les donnees de la progression
	delete this.m_tabProgressData;
	this.SupprimeTimeout("OnAvancement");
};

// Changement du contenu de la liste des fichiers
WDUpload.prototype.OnChange = function OnChange()
{
	// Appele le PCode
	// Pas d'event
	this.RecuperePCode(this.ms_nEventNavUploadSelection)();
};

// Passe en mode editable les barres affichees
WDUpload.prototype.OnDisplay = function OnDisplay(oElementRacine)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.OnDisplay.apply(this, [oElementRacine]);

	if (this.m_oFlash && bEstFils(this.m_oFlash, oElementRacine, document))
	{
		// Reinit les membres du flash (requis dans le cas d'un pageaffiche dialogue)
		this._Init(true);
	}
};
