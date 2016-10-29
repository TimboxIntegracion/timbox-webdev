//#15.00Aa WDVideo.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation des champs video

// Classe de base de la manipulation des differents players
function WDVideoPlayer (oChampVideo, oParamVideo)
{
	// Recuperes les parametres
	if (oParamVideo)
	{
		this.m_oChampVideo = oChampVideo;
		// Ignore eType, ePlayerDefaut et bDemarrageAuto
		this.m_sFichier = oParamVideo.sFichier;
		this.m_sImage = oParamVideo.sImage;
		this.m_sLibelle = oParamVideo.sLibelle;
		this.m_bPleinEcran = oParamVideo.bPleinEcran;
		this.m_bBoucle = oParamVideo.bBoucle;
		this.m_eControles = oParamVideo.eControles;
		this.m_sHTMLDefaut = oParamVideo.sHTMLDefaut;
		this.m_bDemarrageAuto = oParamVideo.bDemarrageAuto;
	}
};

// Constantes
WDVideoPlayer.prototype.ms_eEtatArret = 1;
WDVideoPlayer.prototype.ms_eEtatPause = 2;
WDVideoPlayer.prototype.ms_eEtatJoue = 3;
WDVideoPlayer.prototype.ms_eControlesSans = 0;
WDVideoPlayer.prototype.ms_eControlesSimple = 1;
WDVideoPlayer.prototype.ms_eControlesComplet = 2;

// Methodes par defaut (retourne la valeur d'erreur)
// Lance la lecture
WDVideoPlayer.prototype.vbJoue = function vbJoue() { return false; };
WDVideoPlayer.prototype.vbPause = function vbPause() { return false; };
WDVideoPlayer.prototype.vbArret = function vbArret() { return false; };
WDVideoPlayer.prototype.vnGetEtat = function vnGetEtat() { return this.ms_eEtatArret; };
WDVideoPlayer.prototype.vbVaDebut = function vbVaDebut() { return this.vbSetPosition(0); };
WDVideoPlayer.prototype.vbVaFin = function vbVaFin() { return this.vbSetPosition(this.vnGetDuree()); };
WDVideoPlayer.prototype.vnGetPosition = function vnGetPosition() { return 0; };
WDVideoPlayer.prototype.vbSetPosition = function vbSetPosition(nPosition) { return false; };
WDVideoPlayer.prototype.vnGetDuree = function vnGetDuree() { return 0; };
WDVideoPlayer.prototype.vnGetHauteur = function vnGetHauteur() { return 0; };
WDVideoPlayer.prototype.vnGetLargeur = function vnGetLargeur() { return 0; };
WDVideoPlayer.prototype.vnGetVolume = function vnGetVolume() { return 100; };
WDVideoPlayer.prototype.vbSetVolume = function vbSetVolume(nVolume) { return false; };
WDVideoPlayer.prototype._vsGetAttributsObject = function _vsGetAttributsObject () { return ""; };
WDVideoPlayer.prototype._vsGetParamsObject = function _vsGetParamsObject () { return ""; };
WDVideoPlayer.prototype._vsGetAttributsEmbed = function _vsGetAttributsEmbed () { return ""; };
WDVideoPlayer.prototype._vsGetParamsEmbed = function _vsGetParamsEmbed() { return ""; };

// Construit le champ
WDVideoPlayer.prototype.vConstruitPlayer = function vConstruitPlayer(oConteneur)
{
	oConteneur.innerHTML = this._vsGetPlayerHTML();

	// Recupere le champ
	this.m_oObjet = this.m_oChampVideo.oGetObjectEmbed(this.m_oChampVideo.m_sAliasChamp);
};

// Construit le html du champ
WDVideoPlayer.prototype._vsGetPlayerHTML = function _vsGetPlayerHTML(oConteneur)
{
	var sBaliseName = "name=\"" + this.m_oChampVideo.m_sAliasChamp + "\" ";
	var sAttributsMin = sBaliseName + "width=\"100%\" height=\"100%\" ";
	// Balise OBJECT + EMBED
	var sCode = "<object id=\"" + this.m_oChampVideo.m_sAliasChamp + "\" " + sAttributsMin + this._vsGetAttributsObject() + ">";
	sCode += this._vsGetParamsObject();
	sCode += "<embed " + sAttributsMin + this._vsGetAttributsEmbed() + " " + this._vsGetParamsEmbed() + ">";
	sCode += "</embed></object>";
	return sCode;
};

// Manipulation de media player
function WDVideoMediaPlayer(oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoPlayer.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
	}
};
WDVideoMediaPlayer.prototype = new WDVideoPlayer();
WDVideoMediaPlayer.prototype.constructor = WDVideoMediaPlayer;

WDVideoMediaPlayer.prototype.vbJoue = function vbJoue() { this.m_oObjet.controls.play(); return true; };
WDVideoMediaPlayer.prototype.vbPause = function vbPause() { this.m_oObjet.controls.pause(); return true; };
WDVideoMediaPlayer.prototype.vbArret = function vbArret() { this.m_oObjet.controls.stop(); return true; };
// Les etats generaux (stop pause play correspondent au constantes WL)
WDVideoMediaPlayer.prototype.vnGetEtat = function vnGetEtat() { return this.m_oObjet.playState; };
//WDVideoMediaPlayer.prototype.vbDebut = function vbDebut() { return (this.m_oObjet.controls.currentPosition == 0); };
//WDVideoMediaPlayer.prototype.vbFin = function vbFin() { return (this.m_oObjet.controls.currentPosition == this.m_oObjet.controls.currentItem.duration); };
WDVideoMediaPlayer.prototype.vnGetPosition = function vnGetPosition() { return Math.floor(this.m_oObjet.controls.currentPosition * 1000); };
WDVideoMediaPlayer.prototype.vbSetPosition = function vbSetPosition(nPosition) { this.m_oObjet.controls.currentPosition = nPosition / 1000; return true; };
WDVideoMediaPlayer.prototype.vnGetDuree = function vnGetDuree() { return this.m_oObjet.controls.currentItem.duration * 1000; };
WDVideoMediaPlayer.prototype.vnGetHauteur = function vnGetHauteur() { return this.m_oObjet.controls.currentItem.imageSourceHeight; };
WDVideoMediaPlayer.prototype.vnGetLargeur = function vnGetLargeur() { return this.m_oObjet.controls.currentItem.imageSourceWidth; };
WDVideoMediaPlayer.prototype.vnGetVolume = function vnGetVolume() { return this.m_oObjet.Settings.volume; };
WDVideoMediaPlayer.prototype.vbSetVolume = function vbSetVolume(nVolume) { this.m_oObjet.Settings.volume = nVolume; return true; };

// Recupere le mode d'interface
WDVideoMediaPlayer.prototype._sGetUiMode = function _sGetUiMode()
{
	switch (this.m_eControles)
	{
	case this.ms_eControlesSans:
		return "none";
	default:
	case this.ms_eControlesSimple:
		return "mini";
	case this.ms_eControlesComplet:
		return "full";
	}
};

// Manipulation de l'ActiveX media player
function WDVideoMediaPlayerIE(oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoMediaPlayer.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
	}
};
WDVideoMediaPlayerIE.prototype = new WDVideoMediaPlayer();
WDVideoMediaPlayerIE.prototype.constructor = WDVideoMediaPlayerIE;

WDVideoMediaPlayerIE.prototype._vsGetAttributsObject = function _vsGetAttributsObject()
{
	return "CLASSID=\"CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6\" type=\"application/x-oleobject\" ";
};
WDVideoMediaPlayerIE.prototype._vsGetParamsObject = function _vsGetParamsObject()
{
	var sParam = "<param name=\"url\" value=\"" + this.m_sFichier + "\">";
	sParam += "<param name=\"AutoStart\" value=\"false\">";
	sParam += "<param name=\"uiMode\" value=\"" + this._sGetUiMode() + "\">";
	if (this.m_bBoucle)
	{
		sParam += "<param name=\"playCount\" value=\"1000\">";
	}
	return sParam;
};
WDVideoMediaPlayerIE.prototype._vsGetAttributsEmbed = function _vsGetAttributsEmbed()
{
	return "type=\"application/x-mplayer2\" pluginspage=\"http://microsoft.com/windows/mediaplayer/en/download/\" ";
};
WDVideoMediaPlayerIE.prototype._vsGetParamsEmbed = function _vsGetParamsEmbed()
{
	var sParam = "uiMode=\"" + this._sGetUiMode() + "\" src=\"" + this.m_sFichier + "\" autostart=\"false\" ";
	if (this.m_bBoucle)
	{
		sParam += "playCount=\"1000\" ";
	}
	return sParam;
};

// Manipulation du plugin MediaPlayer sous WebKit
function WDVideoMediaPlayerWK(oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoMediaPlayerIE.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
	}
};
WDVideoMediaPlayerWK.prototype = new WDVideoMediaPlayerIE();
WDVideoMediaPlayerWK.prototype.constructor = WDVideoMediaPlayerWK;

// Construit le champ
WDVideoMediaPlayerWK.prototype.vConstruitPlayer = function vConstruitPlayer(oConteneur)
{
	// Appel le constructeur de la classe de base
	WDVideoMediaPlayerIE.prototype.vConstruitPlayer.apply(this, [oConteneur]);

	// Ecrase le m_oObjet avec le object (et pas le embed)
	this.m_oObjet = document.getElementsByName(this.m_oChampVideo.m_sAliasChamp)[0];
};

// Dans les player a base de webkit, les interfaces de l'objet son presentes avec la premiere lettre en minuscule....
WDVideoMediaPlayerWK.prototype.vnGetVolume = function vnGetVolume() { return this.m_oObjet.settings.volume; };
WDVideoMediaPlayerWK.prototype.vbSetVolume = function vbSetVolume(nVolume) { this.m_oObjet.settings.volume = nVolume; return true; };

// Manipulation du plugin MediaPlayer
function WDVideoMediaPlayerFF(oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoMediaPlayer.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
	}
};
WDVideoMediaPlayerFF.prototype = new WDVideoMediaPlayer();
WDVideoMediaPlayerFF.prototype.constructor = WDVideoMediaPlayerFF;

// Construit le champ
WDVideoMediaPlayerFF.prototype.vConstruitPlayer = function vConstruitPlayer(oConteneur)
{
	// Appel le constructeur de la classe de base
	WDVideoMediaPlayer.prototype.vConstruitPlayer.apply(this, [oConteneur]);

	// Ecrase le m_oObjet avec le object (et pas le embed)
	this.m_oObjet = document.getElementsByName(this.m_oChampVideo.m_sAliasChamp)[0];
};

// Construit le html du champ
WDVideoMediaPlayerFF.prototype._vsGetPlayerHTML = function _vsGetPlayerHTML(oConteneur)
{
	return this.m_sHTMLDefaut;
};

// Manipulation de du player flash
function WDVideoFlash (oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoPlayer.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
		this.m_sMsgErreur = STD_ERREUR_MESSAGE_VIDEO.replace(/\%1/g, this.m_sFichier);
	}
};
WDVideoFlash.prototype = new WDVideoPlayer();
WDVideoFlash.prototype.constructor = WDVideoFlash;

WDVideoFlash.prototype.vbJoue = function vbJoue() { return this.m_oObjet.bJoue(); };
WDVideoFlash.prototype.vbPause = function vbPause() { return this.m_oObjet.bPause(); };
WDVideoFlash.prototype.vbArret = function vbArret() { return this.m_oObjet.bArret(); };
WDVideoFlash.prototype.vnGetEtat = function vnGetEtat() { return this.m_oObjet.nGetEtat(); };
//WDVideoFlash.prototype.vbDebut = function vbDebut() { return this.m_oObjet.bDebut(); };
//WDVideoFlash.prototype.vbFin = function vbFin() { return this.m_oObjet.bFin(); };
WDVideoFlash.prototype.vnGetPosition = function vnGetPosition() { return this.m_oObjet.nGetPosition(); };
WDVideoFlash.prototype.vbSetPosition = function vbSetPosition(nPosition) { return this.m_oObjet.bSetPosition(nPosition); };
WDVideoFlash.prototype.vnGetDuree = function vnGetDuree() { return this.m_oObjet.nGetDuree(); };
WDVideoFlash.prototype.vnGetHauteur = function vnGetHauteur() { return this.m_oObjet.nGetHauteur(); };
WDVideoFlash.prototype.vnGetLargeur = function vnGetLargeur() { return this.m_oObjet.nGetLargeur(); };
WDVideoFlash.prototype.vnGetVolume = function vnGetVolume() { return this.m_oObjet.nGetVolume(); };
WDVideoFlash.prototype.vbSetVolume = function vbSetVolume(nVolume) { return this.m_oObjet.bSetVolume(nVolume); };
WDVideoFlash.prototype._vsGetAttributsObject = function _vsGetAttributsObject()
{
	return "classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" type=\"application/x-shockwave-flash\" ";
};
WDVideoFlash.prototype._vsGetParamsObject = function _vsGetParamsObject()
{
	var sParam = "<param name=\"Movie\" value=\"" + _WD_ + "res/WDVideo.swf\">";
	sParam += "<param name=\"src\" value=\"" + _WD_ + "res/WDVideo.swf\">";
	sParam += "<param name=\"FlashVars\" VALUE=\"sAlias=" + this.m_oChampVideo.m_sAliasChamp + "\">";
	sParam += "<param name=\"WMode\" value=\"Window\">";
	sParam += "<param name=\"Play\" value=\"0\">";
	sParam += "<param name=\"Loop\" value=\"-1\">";
	sParam += "<param name=\"Quality\" value=\"high\">";
	sParam += "<param name=\"AllowScriptAccess\" value=\"sameDomain\">";
	sParam += "<param name=\"AllowFullScreen\" value=\"" + (this.m_bPleinEcran ? "true" : "false") + "\">";
	return sParam;
};
WDVideoFlash.prototype._vsGetAttributsEmbed = function _vsGetAttributsEmbed()
{
	return "type=\"application/x-shockwave-flash\" pluginspage=\"http://www.adobe.com/go/getflashplayer\" ";
};
WDVideoFlash.prototype._vsGetParamsEmbed = function _vsGetParamsEmbed()
{
	var sParam = "src=\"" + _WD_ + "res/WDVideo.swf\" ";
	sParam += "flashVars=\"sAlias=" + this.m_oChampVideo.m_sAliasChamp + "\" ";
	sParam += "play=\"true\" ";
	sParam += "loop=\"false\" ";
	sParam += "quality=\"high\" ";
	sParam += "allowScriptAccess=\"sameDomain\" ";
	sParam += "allowFullScreen=\"" + (this.m_bPleinEcran ? "true" : "false") + "\" ";
	return sParam;
};

// Manipulation de quicktime
function WDVideoQuickTime (oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoPlayer.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
		this.m_nEtat = this.ms_eEtatArret;
	}
};
WDVideoQuickTime.prototype = new WDVideoPlayer();
WDVideoQuickTime.prototype.constructor = WDVideoQuickTime;

WDVideoQuickTime.prototype.vbJoue = function vbJoue() { this.m_oObjet.Play(); this.m_nEtat = this.ms_eEtatJoue; return true; };
WDVideoQuickTime.prototype.vbPause = function vbPause() { this.m_oObjet.Stop(); this.m_nEtat = this.ms_eEtatPause; return true; };
WDVideoQuickTime.prototype.vbArret = function vbArret() { this.m_oObjet.Stop(); this.m_oObjet.Rewind(); this.m_nEtat = this.ms_eEtatArret; return true; };
// Les etats generaux (stop pause play correspondent au constantes WL)
WDVideoQuickTime.prototype.vnGetEtat = function vnGetEtat() { return this.m_nEtat; };
//WDVideoQuickTime.prototype.vbDebut = function vbDebut() {  };
//WDVideoQuickTime.prototype.vbFin = function vbFin() {  };
WDVideoQuickTime.prototype.vnGetPosition = function vnGetPosition() { return this.__nUnitToMs(this.m_oObjet.GetTime()); };
WDVideoQuickTime.prototype.vbSetPosition = function vbSetPosition(nPosition) { this.m_oObjet.SetTime(this.__nMsToUnit(nPosition)); return true; };
WDVideoQuickTime.prototype.vnGetDuree = function vnGetDuree() { return this.__nUnitToMs(this.m_oObjet.GetDuration()); };
WDVideoQuickTime.prototype.vnGetHauteur = function vnGetHauteur() { return this.__nGetDimension(true); };
WDVideoQuickTime.prototype.vnGetLargeur = function vnGetLargeur() { return this.__nGetDimension(false); };
WDVideoQuickTime.prototype.vnGetVolume = function vnGetVolume() { return parseInt(this.m_oObjet.GetVolume() * 100 / 255); };
WDVideoQuickTime.prototype.vbSetVolume = function vbSetVolume(nVolume) { this.m_oObjet.SetVolume(nVolume * 255 / 100); return true; };

// Conversions de ms en unite de la video (framerate)
WDVideoQuickTime.prototype.__nMsToUnit = function __nMsToUnit(nMs) { return nMs / 1000 * this.m_oObjet.GetTimeScale(); };
WDVideoQuickTime.prototype.__nUnitToMs = function __nUnitToMs(nUnit) { return nUnit * 1000 / this.m_oObjet.GetTimeScale(); };
// Conversion des dimensions
WDVideoQuickTime.prototype.__nGetDimension = function __nGetDimension(bHauteur)
{
	// sRectangle contient une chaine de la forme x1, y1, x2, y2
	// donc on calcule x2 - x1 et y2 - y1
	var sRectangle = this.m_oObjet.GetRectangle();
	var tabCoords = sRectangle.split(",");
	return parseInt(tabCoords[bHauteur ? 3 : 2], 10) - parseInt(tabCoords[bHauteur ? 1 : 0], 10);
};

// Construit le html du champ
WDVideoQuickTime.prototype._vsGetPlayerHTML = function _vsGetPlayerHTML(oConteneur)
{
	return this.m_sHTMLDefaut;
};

// Manipulation d'une balise video
function WDVideoBaliseVideo (oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoPlayer.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
	}
};
WDVideoBaliseVideo.prototype = new WDVideoPlayer();
WDVideoBaliseVideo.prototype.constructor = WDVideoBaliseVideo;

// Manipulation d'une balise object
function WDVideoBaliseObject (oChampVideo, oParamVideo)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampVideo)
	{
		// Appel le constructeur de la classe de base
		WDVideoPlayer.prototype.constructor.apply(this, [oChampVideo, oParamVideo]);

		// Init specifique
	}
};
WDVideoBaliseObject.prototype = new WDVideoPlayer();
WDVideoBaliseObject.prototype.constructor = WDVideoBaliseObject;

// Construit le champ
//WDVideoBaliseObject.prototype.vConstruitPlayer = function vConstruitPlayer(oConteneur)
//{
//	// Garde le player par defaut
//	return;
//};

// Construit le html du champ
WDVideoBaliseObject.prototype._vsGetPlayerHTML = function _vsGetPlayerHTML(oConteneur)
{
	return this.m_sHTMLDefaut;
};

// Manipulation d'un champ video
function WDVideo(sAliasChamp, sAliasZR, sAliasAttribut)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, sAliasZR, sAliasAttribut]);

		// On a toujours un objet player valide
		this.m_oPlayer = new WDVideoPlayer(this);
	}
};

// Declare l'heritage
WDVideo.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDVideo.prototype.constructor = WDVideo;

WDVideo.prototype.ms_ePlayerDefaut = 0;
WDVideo.prototype.ms_ePlayerWindowsMedia = 1;
WDVideo.prototype.ms_ePlayerFlashRecent = 2;
WDVideo.prototype.ms_ePlayerFlashAncien = 3;
WDVideo.prototype.ms_ePlayerQuickTime = 4;
WDVideo.prototype.ms_ePlayerHTML5Video = 5;
WDVideo.prototype.ms_ePlayerObjectSimple = 6;
WDVideo.prototype.ms_eVideoWindowsMedia = 0;
WDVideo.prototype.ms_eVideoFlash = 1;
WDVideo.prototype.ms_eVideoMP4 = 2;
WDVideo.prototype.ms_eVideoMPG = 3;
WDVideo.prototype.ms_eVideoQuickTime = 4;
WDVideo.prototype.ms_eVideoOGG = 5;
WDVideo.prototype.ms_eVideoMKV = 6;
WDVideo.prototype.ms_eVideoAutres = 7;
WDVideo.prototype.ms_eVideoAucune = 8;

// Initialisation
WDVideo.prototype.Init = function Init(sParamVideo)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Trouve le conteneur HTML
	this.m_oConteneur = oGetId("tz" + this.m_sAliasChamp);

	// Analyse les parametres (sParamVideo est objet JS en JSON)
	this.DeduitParam(sParamVideo);
};

// Pas de fonction pour la gestion des Pcodes il faut utiliser directement DeclarePCode et RecuperePCode

WDVideo.prototype.sGetVariable = function sGetVariable(sVariable)
{
	return this.m_oPlayer[sVariable];
};
WDVideo.prototype.bGetVariable = function bGetVariable(sVariable)
{
	return this.m_oPlayer[sVariable];
};
WDVideo.prototype.nGetVariable = function nGetVariable(sVariable)
{
	return this.m_oPlayer[sVariable];
};
// Fonctions pour les fonctions MultimediaXxx du WL

WDVideo.prototype.MethodePlayer = function MethodePlayer(sMethode, oErreur, oArguments)
{
	// Rebond sur la classe de manipulation du player
	try
	{
		return this.m_oPlayer[sMethode].apply(this.m_oPlayer, oArguments);
	}
	catch (e)
	{
		return oErreur;
	}
};

// Lance la lecture
WDVideo.prototype.bJoue = function bJoue()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vbJoue", false, arguments);
};

// Mise en pause
WDVideo.prototype.bPause = function bPause()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vbPause", false, arguments);
};

// Arret (= pause generalement)
WDVideo.prototype.bArret = function bArret()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vbArret", false, arguments);
};

// Etat
WDVideo.prototype.nGetEtat = function nGetEtat()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vnGetEtat", WDVideoPlayer.prototype.ms_eEtatArret, arguments);
};

// Va au debut de la video
WDVideo.prototype.bDebut = function bDebut()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vbVaDebut", false, arguments);
};

// Va a la fin de la video
WDVideo.prototype.bFin = function bFin()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vbVaFin", false, arguments);
};

// Lecture de la position (en ms)
WDVideo.prototype.nGetPosition = function nGetPosition()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vnGetPosition", 0, arguments);
};

// Fixe la position (en ms)
WDVideo.prototype.bSetPosition = function bSetPosition(nPosition)
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vbSetPosition", false, arguments);
};

// Recupere la duree totale (en ms)
WDVideo.prototype.nGetDuree = function nGetDuree()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vnGetDuree", 0, arguments);
};

// Hauteur
WDVideo.prototype.nGetHauteur = function nGetHauteur()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vnGetHauteur", 0, arguments);
};

// Largeur
WDVideo.prototype.nGetLargeur = function nGetLargeur()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vnGetLargeur", 0, arguments);
};

// Lecture du volume (entre 0 et 100)
WDVideo.prototype.nGetVolume = function nGetVolume()
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vnGetVolume", 100, arguments);
};

// Fixe du volume (entre 0 et 100)
WDVideo.prototype.bSetVolume = function bSetVolume(nVolume)
{
	// Rebond sur la classe de manipulation du player
	return this.MethodePlayer("vbSetVolume", false, arguments);
};

// Creation du player (sParamVideo est objet JS en JSON)
WDVideo.prototype.DeduitParam = function DeduitParam(sParamVideo)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.DeduitParam.apply(this, [sParamVideo]);

	// Initialise la classe de manipulation du player
	this.__InitPlayer(eval(sParamVideo));
};

// Initialise la classe de manipulation du player
WDVideo.prototype.__InitPlayer = function __InitPlayer(oParamVideo)
{
	// Initialise le bon player en fonction des parametres et du type de la video
	var ePlayer = this.__eGetPlayer(oParamVideo);
	this.m_oPlayer = this.__oGetPlayer(ePlayer, oParamVideo);

	// Construit le champ
	this.m_oPlayer.vConstruitPlayer(this.m_oConteneur);

	// Si il y a un lancement automatique, lance la video
	if (oParamVideo.bDemarrageAuto)
	{
		// Mais pas immediatement (attend le chargement du player)
		this.nSetTimeoutUnique("bJoue", 500);
	}
};

// Trouve le bon player en fonction du type de la video
WDVideo.prototype.__eGetPlayer = function __eGetPlayer(oParamVideo)
{
	switch (oParamVideo.eType)
	{
	case this.ms_eVideoWindowsMedia:
	case this.ms_eVideoMPG:
		// Si le plugin WindowsMedia est installe
		return this.__bWindowsMedia() ? this.ms_ePlayerWindowsMedia : oParamVideo.ePlayerDefaut;
		break;
	case this.ms_eVideoFlash:
		// Si Flash est installe
		var ePlayer = this.__eGetFlash();
		return (ePlayer != this.ms_ePlayerDefaut) ? ePlayer : oParamVideo.ePlayerDefaut;
	case this.ms_eVideoMP4:
	case this.ms_eVideoQuickTime:
		// Si Flash ou QuickTime est installe
		if (this.__bQuickTime())
		{
			return this.ms_ePlayerQuickTime;
		}
//		else if (this.__eGetFlash() == this.ms_ePlayerFlashRecent)
//		{
//			return this.ms_ePlayerFlashRecent;
//		}
		return oParamVideo.ePlayerDefaut;
	case this.ms_eVideoOGG:
		return (bFF && bFF35) ? this.ms_ePlayerHTML5Video : oParamVideo.ePlayerDefaut;
		break;
	case this.ms_eVideoMKV:
	case this.ms_eVideoAutres:
	case this.ms_eVideoAucune:
	default:
		// Retourne le player trouve par le calcul serveur
		return oParamVideo.ePlayerDefaut;
	}
};

// Recupere l'objet player
WDVideo.prototype.__oGetPlayer = function __oGetPlayer(ePlayer, oParamVideo)
{
	switch (ePlayer)
	{
	case WDVideo.prototype.ms_ePlayerWindowsMedia:
		// Sous IE
		if (bIE)
		{
			return new WDVideoMediaPlayerIE(this, oParamVideo);
		}
		else if (bWK)
		{
			return new WDVideoMediaPlayerWK(this, oParamVideo);
		}
		else
		{
			return new WDVideoMediaPlayerFF(this, oParamVideo);
		}
	case WDVideo.prototype.ms_ePlayerFlashRecent:
	case WDVideo.prototype.ms_ePlayerFlashAncien:	return new WDVideoFlash(this, oParamVideo);
	case WDVideo.prototype.ms_ePlayerQuickTime:		return new WDVideoQuickTime(this, oParamVideo);
	case WDVideo.prototype.ms_ePlayerHTML5Video:	return new WDVideoBaliseVideo(this, oParamVideo);
	default:
	case WDVideo.prototype.ms_ePlayerDefaut:
	case WDVideo.prototype.ms_ePlayerObjectSimple:	return new WDVideoBaliseObject(this, oParamVideo);
	}
};

// Indique si un plugin avec le nom demande existe
WDVideo.prototype.__bAvecPlugins = function __bAvecPlugins (sNom)
{
	if (navigator.plugins)
	{
		// Parcours les plugins
		var i;
		var nLimiteI = navigator.plugins.length;
		for (i = 0; i < nLimiteI; i++)
		{
			if (navigator.plugins[i].name.indexOf(sNom) >= 0)
			{
				return true;
			}
		}
	};
	return false;
};

// Si on est sous IE, utilise Windows Media
// Si on est sous firefox, regarde si le plugin est installe
WDVideo.prototype.__bWindowsMedia = function __bWindowsMedia()
{
	// Si on est sous IE, utilise Windows Media
	// Si on est sous firefox, regarde si le plugin est installe
	return (bIE || this.__bAvecPlugins("Windows Media"));
};

// Version de flash ?
WDVideo.prototype.__eGetFlash = function __eGetFlash()
{
	// Test via plugins (firefox etc...)
	var eVersionFlash = this.__eGetFlashPlugins();
	if (eVersionFlash != this.ms_ePlayerDefaut)
	{
		return eVersionFlash;
	}
	// Test via un ActiveX (IE)
	eVersionFlash = this.__eGetFlashActiveX();
	if (eVersionFlash != this.ms_ePlayerDefaut)
	{
		return eVersionFlash;
	}
	return this.ms_ePlayerDefaut;
};

// Version de flash ? Test via plugins (firefox etc...)
WDVideo.prototype.__eGetFlashPlugins = function __eGetFlashPlugins()
{
	if (navigator.plugins)
	{
		// Parcours les plugins
		var i;
		var nLimiteI = navigator.plugins.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var sDescription = navigator.plugins[i].description;
			if (sDescription)
			{
				var tabDescription = sDescription.split(" ");
				if ((tabDescription.length >= 3) && (tabDescription[0].toLowerCase() == "shockwave") && (tabDescription[1].toLowerCase() == "flash"))
				{
					var nVersion = parseInt(tabDescription[2], 10);
					if (nVersion > 9)
					{
						return this.ms_ePlayerFlashRecent;
					}
					else if (nVersion == 8)
					{
						return this.ms_ePlayerFlashAncien;
					}
				}
			}
		}
	}
	return this.ms_ePlayerDefaut;
};

// Version de flash ? Test via un ActiveX (IE)
WDVideo.prototype.__eGetFlashActiveX = function __eGetFlashActiveX()
{
	try
	{
		// Version 9 et +
		var oTest = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.9");
		if (oTest)
		{
			return this.ms_ePlayerFlashRecent;
		}
		// Normalement on ne passe pas ici...
	}
	catch (e)
	{
	}
	try
	{
		// Version 8
		var oTest = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.8");
		if (oTest)
		{
			return this.ms_ePlayerFlashAncien;
		}
		// Normalement on ne passe pas ici...
	}
	catch (e)
	{
	}
	return this.ms_ePlayerDefaut;
};

// QuickTime installe
WDVideo.prototype.__bQuickTime = function __bQuickTime()
{
	// Test via plugins (firefox etc...) ou un ActiveX (IE)
	return this.__bAvecPlugins("QuickTime") || this.__bQuickTimeActiveX();
};
WDVideo.prototype.__bQuickTimeActiveX = function __bQuickTimeActiveX()
{
	try
	{
		var oTest = new ActiveXObject("QuickTimeCheckObject.QuickTimeCheck.1");
		if (oTest && oTest.IsQuickTimeAvailable(0))
		{
			return true;
		}
		// Normalement on ne passe pas ici...
	}
	catch (e)
	{
	}
	return false;
};
