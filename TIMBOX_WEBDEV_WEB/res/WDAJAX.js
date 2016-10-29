//#15.00Aa WDAJAX.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Attention a ne pas mettre d'accent dans ce fichier COMMENTAIRES inclus

// Classe representant une requete

function WDAJAXRequete(nId, clRequete, bPost, bSynchrone)
{
	// On initialise nos membres
	this.m_nId = nId;
	this.m_clRequete = clRequete;
	this.m_bPost = bPost;
	this.m_bSynchrone = bSynchrone;
	this.m_bValide = true;
};

var _sAJAXNouvellePage = "";

WDAJAXRequete.prototype =
{
	m_sCallback:			"",				// Pas de callback par defaut
	readyStateUninitialized:0,				// Les valeurs d'etat de requetes
	readyStateLoading:		1,
	readyStateLoaded:		2,
	readyStateInteractive:	3,
	readyStateComplete:		4,
	sHeaderErreur:			"WebDevError",		// Header d'erreur
	sHeaderRedirPHP:		"WebDevRedirPHP",	// Header de redirection
	sHeaderXML:				"WebDevXMLDoc",

	// La callback en cas d'evenement asynchrone
	OnReadyState:function()
	{	// si c'est la notification de resultat pret
		if( this.m_clRequete.readyState == this.readyStateComplete )
		{	// on valide le resultat
			if( this.bValideResultat() )
			{	// si la requete n'a pas ete annulee
				if (this.m_sCallback != "")
				{	// on valide le resultat de la requete
					this.m_bValide = true;
					// on appelle la callback
					var sTmp = this.sGetResultat();
					eval(this.m_sCallback + "(sTmp," + this.m_nId + ")");
				}
			}
			// on libere la requete
			this.Libere();
		}
	},

	// La callback en cas d'evenement asynchrone dans le cas de la gestion des tables
	OnReadyStateTable:function (oObjetRequeteTable)
	{
		// Parfois on recoit deux readyStateComplete donc on n'a plus de requete
		// Test du cas
		if (!this.m_clRequete)
		{
			return;
		}

		// Si c'est la notification de resultat pret
		if (this.m_clRequete.readyState == this.readyStateComplete)
		{
			var bRes = false;

			// On valide le resultat
			if (this.bValideResultat())
			{
//				// Si la requete n'a pas ete annulee
//				this.m_bValide = true;

				// Si le resulat est valide on le renvoi
				bRes = clWDAJAXMain.bReponseGenerique(this, _PAGE_, oObjetRequeteTable);
			}

			// Si pas un resultat valide : reinti la table pour plus de securite
			if (!bRes)
			{
				// Libere la requete cote table pour eviter de bloquer le champs en demandant le reinit de la table
				oObjetRequeteTable.SupprimeRequete(true);
			}
			// Libere la requete
			this.Libere();
		}
	},

	// Regarde si il y a une redirection vers une page d'erreur en PHP
	bRedirectionPHP:function()
	{
		// Blinde par une exception car certains navigateurs renvoient une exception si le header n'existe pas
		try
		{	// on recupere la partie erreur de la requete
			var sErreur = this.m_clRequete.getResponseHeader(this.sHeaderRedirPHP);
			// Renvoie true si il y a eu une erreur qui declenche une redirection
			return (sErreur && sErreur.length>0 );
		}
		catch(e)
		{	// Pas de header, pas d'erreur
			return false;
		}
	},

	// Regarde si il y a une erreur serveur
	bErreurServeur:function()
	{	// on blinde par une exception car certains navigateurs renvoient une exception si le header n'existe pas
		try
		{	// on recupere la partie erreur de la requete
			var sErreur = this.m_clRequete.getResponseHeader(this.sHeaderErreur);
			// on renvoie true si il y a eu une erreur
			return ( sErreur && sErreur.length>0 );
		}
		catch(e)
		{	// pas de header, pas d'erreur
			return false;
		}
	},

	// La methode d'invocation : appel en interne
	Envoi:function (sRequete,sURL)
	{
		// Calcul de l'URL si on est en mode GET (uniquement si la requete est non vide
		if (!this.m_bPost && (sRequete.length > 0))
		{
			// On ajoute un ? ou un &
			sURL += ((sURL.indexOf("?") == -1) ? "?" : "&") + sRequete;
		}

		// On passe en mode invalide => Notre reponse n'a pas de sens
		this.m_bValide = false;

		// On actualise le compteur de requete synchrone en cours si besoin
		if (this.m_bSynchrone)
		{
			clWDAJAXMain.m_nRequeteSynchrone++;
		}
		// Et on affiche le temoin d'activite AJAX (Dans tous les cas : synchrone et asynchrone)
		clWDAJAXMain.ReactualiseActivite(false);

		// Ouverture de la requete
		this.m_clRequete.open(this.m_bPost ? "POST" : "GET", sURL, !this.m_bSynchrone);

		// Ajoute l'encodage du POST
		this.m_clRequete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

		// Puis envoie de la requete
		this.m_clRequete.send(this.m_bPost ? sRequete : "");

		// On actualise le compteur de requete synchrone en cours si besoin
		if (this.m_bSynchrone)
		{
			clWDAJAXMain.m_nRequeteSynchrone--;
			// Et on affiche le temoin d'activite AJAX (Uniquement dans le cas synchrone)
			clWDAJAXMain.ReactualiseActivite(false);
		}
	},

	// Renvoi l'alphabet de la reponse si trouve
	// Sinon renvoi l'alphabet du document
	// Ne renvoie rien si le navigateur n'est pas IE
	sGetDocRequeteAlphabet:function ()
	{
		// Par defaut on prend la valeur stocke dans le document
		var sAlphabet = document.charset;

		// Si pas IE => FIni
		if (!sAlphabet)
		{
			return undefined;
		}

		// On regarde si on a un type mine dans la requete
		try
		{
			var sHeader = this.m_clRequete.getResponseHeader("Content-type");

			// Si on trouve la marque du charset : on renvoie la suite
			if (sHeader.indexOf("charset=") > 0)
			{
				return sHeader.substring(sHeader.indexOf("charset=") + "charset=".length);
			}
			// Sinon on renvoie la valeur par defaut
		}
		catch(e)
		{	// Pas de header, charset du document
		}
		return sAlphabet;
	},

	// verifie la validite du resultat d'une requete
	// affiche l'erreur dans le navigateur
	bValideResultat:function()
	{
		this.m_bValide = false;
		// le resultat n'est valide que si la requete a abouti
		if( this.m_clRequete.readyState == this.readyStateComplete )
		{	// si on a eu une erreur HTTP, inutile d'aller plus loin
			if( this.m_clRequete.status < 400 )
			{
				// Si il y a une redirection (Affichage d'une erreur PHP)
				if (this.bRedirectionPHP())
				{
					// On recupere la redirection
					var sRedirection = this.m_clRequete.responseText;
					// Execute la redirection
					document.location.replace(unescape(sRedirection));
				}
				else if(this.bErreurServeur())
				{	// Si il y a une erreur WL du serveur

					// Se libere soit meme
					_sAJAXNouvellePage = this.m_clRequete.responseText;

					// Si on est en internet exploreur il faut aussi injecter le charset sinon cela ne marche pas
					var sAlphabet = this.sGetDocRequeteAlphabet();
					this.Libere();
					// Marque l'AJAX comme plus disponible
					clWDAJAXMain.BloqueAJAX();

					// Si on est pas dans un gadget
					if (typeof System != "object")
					{
						// Methode qui ne marche pas en asynchrone : l'appel de open() arrete l'execution du script
						// Jamais de .open : cela ne marche pas dans certains navigateur
						if (bIE)
						{
							// On fait un cas particulier pour IE7
							if (bIE7)
							{
								var oDoc = document.open("text/html", "replace");
								if (sAlphabet)
								{
									oDoc.charset = sAlphabet;
								}
								oDoc.write(_sAJAXNouvellePage);
								oDoc.close();
							}
							else
							{
								document.oDoc = document.open("text/html", "_self", "", true);
								document.oDoc = document.oDoc.document;
								if (sAlphabet) document.oDoc.charset = sAlphabet;
								setTimeout("document.oDoc.write(_sAJAXNouvellePage);", 1);
							}
						}
						else
						{
							if (sAlphabet)
							{
								setTimeout("document.write(_sAJAXNouvellePage);document.charset='" + sAlphabet + "';document.close();", 1);
							}
							else
							{
								setTimeout("document.write(_sAJAXNouvellePage);document.close();", 1);
							}
						}
					}
					else
					{
						// On est dans un gadget => affiche dans un format specifique fonctionnel
						// Supprime les RC de presentation
						_sAJAXNouvellePage = _sAJAXNouvellePage.replace(/\r/g, "");
						_sAJAXNouvellePage = _sAJAXNouvellePage.replace(/\n/g, "");
						// Remplace les paragraphes par des RC
						_sAJAXNouvellePage = _sAJAXNouvellePage.replace(/\<br\s*\/{0,1}\>/ig, "\r\n");
						_sAJAXNouvellePage = _sAJAXNouvellePage.replace(/\<P\>/ig, "\r\n");
						// Supprime les balise
						_sAJAXNouvellePage = _sAJAXNouvellePage.replace(/\<[^\>]+\>/ig, "");
						// Remet des paragraphes
						_sAJAXNouvellePage = _sAJAXNouvellePage.replace(/\r\n/g, "<br />");
						document.body.innerHTML = _sAJAXNouvellePage;
					}
//					document.write(sPageErreur);
//					document.close();
					// On ne doit pas remplacer le document immediatement car sinon le reste du script en cours risque
					// de ne pas bien marcher (Erreur JS) dans certains navigateur (IE)
				}
				else
				{	// on valide le resultat
					this.m_bValide = true;
					return true;
				}
			}
		}
		// resultat non valide
		return false;
	},

	// Recuperation du resultat en texte
	sGetResultat:function()
	{
		// Selon notre etat de validite
		if (this.m_bValide)
		{
			// On blinde par une exception car certains navigateurs renvoient une exception si le header n'existe pas
			try
			{
				// On recupere l'entete d'information sur le nom XML de la requete
				var sNomXML = this.m_clRequete.getResponseHeader(this.sHeaderXML);
				// Si on a un nom alors on declare le document XML et on renvoi son nom
				if (sNomXML && sNomXML.length > 0)
				{
					// Ici declaration du document XML
					XMLAjoutDoc(sNomXML, this.m_clRequete.responseXML);
					return sNomXML;
				}
			}
			catch(e)
			{
				// Pas de header, pas de reponse XML
			}

			// On renvoie la reponse bien encode pour le navigateur
			return clWDEncode.sEncodeCharset(this.m_clRequete.responseText, false);
		}
		else
		{
			return "";
		}
	},

	// La fonction d'initialisation : definie les callbacks
	Init:function()
	{
		// On definie la fonction de changement d'etat uniquement si on est en mode asynchrone
		if (!this.m_bSynchrone)
		{
			// Une reference sur nous meme
			var clWDAJAXRequete = this;
			this.m_clRequete.onreadystatechange = function() { clWDAJAXRequete.OnReadyState.call(clWDAJAXRequete); };
		}
	},

	// La fonction d'initialisation pour les tables ; definie la callback
	InitTable:function (oObjetRequeteTable)
	{
		// On definie la fonction de changement d'etat uniquement si on est en mode asynchrone
		if (!this.m_bSynchrone)
		{
			// Une reference sur nous meme
			var clWDAJAXRequete = this;
			this.m_clRequete.onreadystatechange = function() { clWDAJAXRequete.OnReadyStateTable.call(clWDAJAXRequete, oObjetRequeteTable); };
		}
	},

	// Renvoie Vrai si la requete est en cours
	bEnCours:function()
	{	// on renvoie true si une callback est active
		return (this.m_sCallback != "");
	},

	// Annule une requete asynchrone
	Annule:function()
	{
		// On annule la callback
		delete this.m_sCallback;

		// IE 6 : Bloque le onreadystatechange (delete ne suffit pas) + Un = null ne fonctionne pas donc on met une fonction vide
		this.m_clRequete.onreadystatechange = function () { };

		// Et on se libere
		this.Libere();
	},

	// Fermeture de la requete : se libere du tableau global des requetes
	Libere:function()
	{
		var i;
		var nLimiteI = clWDAJAXMain.m_tabConnection.length;
		for (i = 0; i < nLimiteI; i++)
		{
			// Si c'est nous meme
			if (clWDAJAXMain.m_tabConnection[i].m_nId == this.m_nId)
			{
				// On se supprime du tableau
				clWDAJAXMain.m_tabConnection[i] = null;
				// Et on enleve l'element du tableau
				clWDAJAXMain.m_tabConnection.splice(i, 1);
				// Et on sort direct
				break;
			}
		}
		// On libere nos membres par securite
		if (this && this.m_clRequete)
		{
			delete this.m_clRequete.onreadystatechange;	// Obligatoire ?
			delete this.m_clRequete;					// Pas obligatoire
		}

		// Actualise le temoin d'activite AJAX
		clWDAJAXMain.ReactualiseActivite(false);
	}
};

// Classe de creation des requetes

function WDAJAXMain()
{
	this.m_tabConnection = new Array();	// Tableau des connections
	this.m_nIdPos = 1;					// Id de connection

	this.m_tabRequetes = new Array();	// Tableau des evenements AJAX a traiter

	this.m_nRequeteSynchrone = 0;

	// Memorise si on est en mode AWP
	this.m_bPageAWP = document.location.pathname.substr(document.location.pathname.length - 4, 4).toUpperCase() == ".AWP";
};

WDAJAXMain.prototype =
{
	m_bWDAJAXMainValide: true, // Drapeau qui indique si on peu encore utiliser les fonctions AJAX
	m_bChargementTermine: false, // On considere que le chargement de la page n'est pas encore termine
	m_bTestAJAXDisponible: false, // Pas teste
	m_bAJAXDisponible: true, // Mais disponible par defaut
	m_oActiviteChamp: null,
	m_bActivite: false,
	m_nActiviteOption: 0,

	eActivite_Fixe: 0,
	eActivite_HautGauche: 1,
	eActivite_HautDroite: 2,
	eActivite_BasGauche: 3,
	eActivite_BasDroite: 4,
	eActivite_Centrer: 5,
	m_fWinOnScroll: null,
	m_fWinOnResize: null,

	sCommandeAjax_Execute: "WD_ACTION_=AJAXEXECUTE", // Les commandes disponibles
	sCommandeAjax_Champ: "WD_ACTION_=AJAXCHAMP",
	sCommandeAjax_Page: "WD_ACTION_=AJAXPAGE",
	sCommandeAjax_InitGadget: "WD_ACTION_=AJAXINITGADGET",
	sCommandeAjax_Erreur: "WD_ACTION_=AJAXERREUR",
	sCommandeWDAction: "WD_ACTION_",
	sCommandeAjax_ExecuteProc: "EXECUTEPROC",
	sCommandeAjax_Evenement: "EXECUTE",
	sCommandeAjax_Reglette: "SCROLLTABLE",
	sCommandeAjax_ClicTable: "CLICTABLE",
	sCommandeAjax_ClicCalendrier: "CLICCALENDRIER",
	sCommandeAjax_Contexte: "WD_CONTEXTE_",

	XML_RACINE: "WAJAX",
	XML_RACINERegExp: new RegExp("<WAJAX>"),
	XML_JS: "JS",
	XML_REDIR: "REDIR",
	XML_CHAMP: "CHAMP",
	XML_LISTE: "LISTE",
	XML_TRACE: "TRACE",
	XML_TRACE_ID: "WDAJAX_TRACE",
	XML_CHAMP_ATT_ALIAS: "ALIAS",
	XML_CHAMP_ATT_TYPE: "TYPE",
	XML_CHAMP_TYPE_PAGEPRINCIPALE: 1,
	XML_CHAMP_TYPE_SAISIE: 2,
	XML_CHAMP_TYPE_LIBELLE: 3,
	XML_CHAMP_TYPE_BOUTON: 4,
	XML_CHAMP_TYPE_INTERRUPTEUR: 5,
	XML_CHAMP_TYPE_SELECTEUR: 6,
	XML_CHAMP_TYPE_LISTE: 7,
	XML_CHAMP_TYPE_IMAGE: 8,
	XML_CHAMP_TYPE_TABLE: 9,
	XML_CHAMP_TYPE_CHAMPFORMATE: 10,
	XML_CHAMP_TYPE_ZONEREPETEE: 11,
	XML_CHAMP_TYPE_HTML: 12,
	XML_CHAMP_TYPE_COMBO: 14,
	XML_CHAMP_TYPE_LIEN: 16,
	XML_CHAMP_TYPE_LIBELLEHTML: 17,
	XML_CHAMP_TYPE_REGLETTE: 21,
	XML_CHAMP_TYPE_MAPAREA: 22,
	XML_CHAMP_TYPE_CHEMINNAV: 23,
	XML_CHAMP_TYPE_TREEVIEW: 25,
	XML_CHAMP_TYPE_VIGNETTE: 26,
	XML_CHAMP_TYPE_IFRAME: 27,
	XML_CHAMP_TYPE_IFRAME_DEST: 31,
	XML_CHAMP_TYPE_IFRAME_SOURCE: 32,
	XML_CHAMP_TYPE_GRAPHE: 33,
	XML_CHAMP_TYPE_TIROIR: 34,
	XML_CHAMP_TYPE_CELLULE: 39,
	XML_CHAMP_TYPE_SUPERCHAMP: 40,
	XML_CHAMP_TYPE_MODELEDECHAMP_SOURCE: 42,
	XML_CHAMP_TYPE_MODELEDECHAMP_DEST: 43,
	XML_CHAMP_TYPE_ONGLET: 44,
	XML_CHAMP_TYPE_PLANSITE: 45,
	XML_CHAMP_TYPE_CALENDRIER: 47,
	XML_CHAMP_TYPE_VOLETONGLET: 49,
	XML_CHAMP_TYPE_SOUSMENU: 55,
	XML_CHAMP_TYPE_COLONNE: 56,
	XML_CHAMP_TYPE_OPTIONMENU: 57,
	XML_CHAMP_TYPE_PAGECORNEE: 79,
	// @@@ Ici nouveau champ si besoin
	XML_CHAMP_PROP: "PROP",
	XML_CHAMP_PROP_ATT_NUM: "NUM",
	XML_CHAMP_PROP_NUM_LIBELLE_TABLE_AJAX: "TABLE_AJAX",
	XML_CHAMP_PROP_NUM_VISIBLE_PARENTRELATIF: "PARENTRELATIF",
	XML_CHAMP_JS: "JS",
	XML_CHAMP_ETAT_ETAT: "ETAT",
	XML_CHAMP_OPTIONS: "OPTIONS",
	XML_CHAMP_OPTIONS_OPTION: "OPTION",
	XML_CHAMP_SATURATION: "SATURATION",
	XML_CHAMP_RECHARGE: "RECHARGE",
	XML_CHAMP_RECHARGE_PARAM: "PARAM",
	XML_CHAMP_REFRESH: "REFRESH",
	XML_CHAMP_REFRESH_RESETTABLE: "RESETTABLE",
	XML_CHAMP_REFRESH_DEBUT: "DEBUT",
	XML_CHAMP_LIGNES: "LIGNES",
	XML_CHAMP_LIGNES_DEBUT: "DEBUT",
	XML_CHAMP_LIGNES_NOMBRE: "NOMBRE",
	XML_CHAMP_LIGNES_SELECTION: "SELECTION",
	XML_CHAMP_LIGNES_RUPTURES: "RUPTURES",
	XML_CHAMP_LIGNES_COLONNES: "COLONNES",
	XML_CHAMP_LIGNES_STYLE: "STYLE",
	XML_CHAMP_LIGNES_LIGNE: "LIGNE",
	XML_CHAMP_LIGNES_LIGNE_INDICE: "INDICE",
	XML_CHAMP_LIGNES_LIGNE_INVISIBLE: "INVISIBLE",
	XML_CHAMP_LIGNES_LIGNE_DEBUT: "DEBUT",
	XML_CHAMP_LIGNES_LIGNE_CORPS: "CORPS",
	XML_CHAMP_LIGNES_LIGNE_FIN: "FIN",
	XML_CHAMP_LIGNES_LIGNE_STYLE: "STYLE",
	XML_CHAMP_TREEVIEW: "TREEVIEW",
	XML_CHAMP_TREEVIEW_SELECT: "SELECT",
	XML_CHAMP_TREEVIEW_DEROULE: "DEROULE",
	XML_CHAMP_TREEVIEW_DEROULETAB: "DEROULETAB",
	XML_CHAMP_TREEVIEW_NOEUDS: "NOEUDS",

	XML_WBTRACE_ID: "WB_TRACE",

	// Indique si le mode AJAX est temporairement bloque
	bWDAJAXMainValide: function()
	{
		// Bloque si le document n'est pas completement charge
		// Ca tombe bien on n'a le probleme que sous IE et document.readyState n'existe que sous IE
		if (document.readyState)
		{
			// Si on est dans le onunload de IE et que une autre page est affichee, l'etat recu est "loading"
			// Mais l'AJAX est encore completement disponible
			// Donc on utilise une variable qui indique que l'on a reussi une fois et que c'est bon
			if ((document.readyState == "interactive") || (document.readyState == "complete"))
			{
				// Le chargement est termine
				this.m_bChargementTermine = true;
			}
		}
		else
		{
			// On considere que le document est charge
			this.m_bChargementTermine = true;
		}

		// Renvoie la variable globale
		return (this.m_bWDAJAXMainValide && this.m_bChargementTermine);
	},

	// Bloque le mode AJAX : remplacement de la page courante
	BloqueAJAX: function()
	{
		// Supprime le temoin d'activite
		this.m_oActiviteChamp = null;
		this.m_bActivite = false;

		// Met le flag a faux
		this.m_bWDAJAXMainValide = false;

		// Et supprime toutes les requetes asynchrones en cours
		while (this.m_tabConnection.length > 0)
		{
			this.m_tabConnection[0].Libere();
		}
	},

	// Recupere un nouvel ID de requete
	nGetNouvelId: function()
	{
		return this.m_nIdPos++;
	},

	// CRee un objet XMLHttpRequest
	clCreeXMLHttpRequest: function()
	{
		var clRequete = false;
		// On teste l'objet natif
		if (window.XMLHttpRequest)
		{
			try
			{
				clRequete = new XMLHttpRequest();
			}
			catch (e)
			{
				clRequete = false;
			}
		}
		// On teste l'objet ActiveX pour IE/Windows
		if ((!clRequete) && (window.ActiveXObject))
		{
			try
			{
				clRequete = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e)
			{
				try
				{
					clRequete = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e)
				{
					clRequete = false;
				}
			}
		}
		// On retourne notre objet
		return (clRequete === false) ? null : clRequete;
	},

	// Creation d'un objet WDAJAXRequete
	// Mettre bSansInit pour faire une initialisation personnalise
	clCreeWDAJAXRequete: function(bPost, bSynchrone, bSansInit)
	{
		// Pseudo parametres par defaut
		if (bPost == null) bPost = true;
		if (bSynchrone == null) bSynchrone = false;

		// On commence par cree la requete
		var clRequete = this.clCreeXMLHttpRequest();
		// Si pas de requete (AJAX pas disponible => Fin)
		if (!clRequete)
		{
			return null;
		}
		// Puis on cree l'objet
		var nId = this.nGetNouvelId();
		// var nId = this.nGetNouvelId.call(this); ??
		var clWDAJAXRequete = new WDAJAXRequete(nId, clRequete, bPost, bSynchrone);
		// Et on l'init
		if (!bSansInit)
		{
			clWDAJAXRequete.Init();
		}

		// On l'enregistre dans le tableau des connections si c'est une connexion asynchrone
		if (!bSynchrone)
		{
			this.m_tabConnection.push(clWDAJAXRequete);
		}

		// Puis on retourne l'objet
		return clWDAJAXRequete;
	},

	// Recherche un objet WDAJAXRequete
	GetWDAJAXRequete: function(nId)
	{	// On parcourt le tableau a la recherche de la requete
		var i;
		var nLimiteI = this.m_tabConnection.length;
		for (i = 0; i < nLimiteI; i++)
		{	// si c'est la requete recherchee, on la renvoie
			if (this.m_tabConnection[i].m_nId == nId)
				return this.m_tabConnection[i];
		}
		// si on arrive ici, on n'a pas trouve
		return null;
	},

	// Traite un requete
	bReponseGenerique: function(clRequete, oPage, oTable)
	{
		// Si le resulat est valide
		if (clRequete.bValideResultat())
		{
			// Si on n'a pas en reponse XML a nous (Par exemple avec l'utilisation de PageAffiche)
			if (
				(clRequete.m_clRequete.responseText.substring(0, "<?xml".length) != "<?xml")
				|| !clRequete.m_clRequete.responseText.match(this.XML_RACINERegExp))
			{
				var sNouvellePage = clRequete.m_clRequete.responseText;

				// En IE on doit redefinir le charset sinon on a un probleme
				var sAlphabet = clRequete.sGetDocRequeteAlphabet();
				// Se libere soit meme
				clRequete.Libere();
				clRequete = null;
				// Marque l'AJAX comme plus disponible
				this.BloqueAJAX();

				// Si on est pas dans un gadget
				if (typeof System != "object")
				{
					// Et ecrit le document
					// Jamais de .open : cela ne marche pas dans certains navigateur
					if (bIE)
					{
						var oDoc = document.open("text/html", "replace");
						if (sAlphabet) oDoc.charset = sAlphabet;
						oDoc.write(sNouvellePage);
						if (bIE7)
						{
							oDoc.close();
						}
					}
					else
					{
						document.write(sNouvellePage);
						if (sAlphabet) document.charset = sAlphabet;
						document.close();
					}
				}
				else
				{
					// On est dans un gadget => affiche dans un format specifique fonctionnel
					// Supprime les RC de presentation
					sNouvellePage = sNouvellePage.replace(/\r/g, "");
					sNouvellePage = sNouvellePage.replace(/\n/g, "");
					// Remplace les paragraphes par des RC
					sNouvellePage = sNouvellePage.replace(/\<br\s*\/{0,1}\>/ig, "\r\n");
					sNouvellePage = sNouvellePage.replace(/\<P\>/ig, "\r\n");
					// Supprime les balise
					sNouvellePage = sNouvellePage.replace(/\<[^\>]+\>/ig, "");
					// Remet des paragraphes
					sNouvellePage = sNouvellePage.replace(/\r\n/g, "<br />");
					document.body.innerHTML = sNouvellePage;
				}
				return true;
			}
			else
			{
				// On traite le resultat de la requete
				return this.bActionXML(oPage, oTable, clRequete.m_clRequete.responseXML);
			}
		}
		else
		{
			return false;
		}
	},

	// Construit la valeur du champ
	sConstruitValeurChampNom: function(oPage, sChamp)
	{	// on cherche le champ
		var oChamp = this.oChercheChamp(oPage, sChamp);
		// on construit la valeur du champ
		return (oChamp ? this.sConstruitValeurChamp(oChamp) : "");
	},

	// Construit la valeur du champ avec un separateur pour la concatenation
	sConstruitValeurChampNomSep: function(oPage, sChamp)
	{
		// Rebond sur la methode simple
		var sValeur = this.sConstruitValeurChampNom(oPage, sChamp);
		// Complete si besoin
		return (sValeur.length > 0) ? ("&" + sValeur) : sValeur;
	},

	// construit la valeur du champ
	sConstruitValeurChamp: function(oChamp)
	{
		// selon le type du champ
		switch (oChamp.type.toLowerCase())
		{
			// Champs qui retournent leur valeur
			case "text":
			case "hidden":
			case "textarea":
			case "password":
				// On encode si possible les caractere UNICODEs
				var sValeur = oChamp.value;
				// Ignore les champs avec indications
				if (oChamp.bIndication === true)
				{
					sValeur = "";
				}
				return clWDEncode.sEncodePOST(oChamp.name) + "=" + clWDEncode.sEncodePOST(sValeur);
				// Champ qui ne retournent rien
			case "button":
				return "";
				// Check active
			case "checkbox":
			case "radio":
				if (oChamp.checked) { return clWDEncode.sEncodePOST(oChamp.name) + "=" + clWDEncode.sEncodePOST(oChamp.value); } else { return ""; }
			case "select-one":
				if (oChamp.selectedIndex != -1) { return clWDEncode.sEncodePOST(oChamp.name) + "=" + clWDEncode.sEncodePOST(oChamp.options[oChamp.selectedIndex].value); } else { return ""; }
			case "select-multiple":
				var sOptions = "";
				var i = 0;
				var nLimiteI = oChamp.options.length;
				for (i = 0; i < nLimiteI; i++)
				{
					if (oChamp.options[i].selected)
					{
						if (sOptions.length > 0)
						{
							sOptions += "&";
						}
						sOptions += clWDEncode.sEncodePOST(oChamp.name) + "=" + oChamp.options[i].value;
					}
				}
				return sOptions;
				// Autres champs mais moins frequents qui ne retournent rien
			case "file":
			case "reset":
			case "submit":
				return "";
			default:
				// On encode si possible les caractere UNICODEs
				var sValeur = oChamp.value;
				if (sValeur === undefined)
				{
					return "";
				}
				else
				{
					return clWDEncode.sEncodePOST(oChamp.name) + "=" + clWDEncode.sEncodePOST(sValeur);
				}
		}
		return "";
	},

	// construit les valeurs de tous les champs de la page
	sConstruitValeurPage: function(tabElements)
	{	// on parcours les champs de la page pour construire la requete
		var tabResultat = new Array(tabElements.length);
		var i;
		var nLimiteI = tabElements.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var oElem = tabElements[i];
			// Toutes le requetes AJAX incluent WD_ACTION_ qui est deja specifie
			// On doit donc le filtrer, sinon cette valeur est deux fois dans la requete et le PHP renvoie uniquement la seconde valeur
			// On evite aussi les balises EMBED et autres qui n'ont pas de type et pas de valeur
			// On vire aussi les elements inutiles des treeview (les champs PTH_xxx)
			var sNomElem = oElem.name;
			if ((sNomElem == this.sCommandeWDAction) || (!oElem.type) || (sNomElem.substr(0, 4) == "PTH_"))
			{
				tabResultat[i] = "";
			}
			else
			{
				// On rajoute le separateur si le dernier caratere n'en est pas deja un &
				// Et on contruit la valeur du champ avec
				tabResultat[i] = (((i > 0) && (tabResultat[i - 1].charAt(tabResultat[i - 1].length - 1) != "&")) ? "&" : "") + this.sConstruitValeurChamp(oElem);

				// Vire les eventuelles paires vide
				if (tabResultat[i] == "&")
					tabResultat[i] = "";
			}
		}
		return tabResultat.join("");
	},

	// construit l'URL pour appeler une procedure AJAX
	sConstruitURL: function(sURL)
	{	// on renvoie l'URL
		return sURL;
	},

	// construit la requete pour appeler une procedure AJAX
	sConstuitRequeteProcedure: function(sProcedure, sContexte)
	{	// construction de la requete AJAX
		//	- action AJAX (non specifique)
		var sRequete = this.sCommandeAjax_Execute;
		//	- commande AJAX (non specifique)
		sRequete += "&" + this.sCommandeAjax_ExecuteProc + "=" + clWDEncode.sEncodePOST(sProcedure);
		//	- contexte d'execution (specifique)
		sRequete += "&" + this.sCommandeAjax_Contexte + "=" + clWDEncode.sEncodePOST(sContexte);
		// on renvoie la requete creee
		return sRequete;
	},

	// Construit la requete pour la recherche dans une table
	sConstuitRequeteTable: function(sRequeteTable)
	{	// Construction de la requete AJAX
		//	- Action AJAX (non specifique)
		var sRequete = this.sCommandeAjax_Execute;
		//	- Commande AJAX (non specifique)
		if (sRequete.length > 0)
		{
			sRequete += "&" + sRequeteTable;
		}
		// On renvoie la requete creee
		return sRequete;
	},

	// Defini le nom du champ du formulaire dont on doit transmettre la valeur en plus lors d'un envoi sans submit
	SetZRChamp: function(sZRChamp, sValeur)
	{
		this.m_sZRChamp = sZRChamp;
		this.m_sZRChampValeur = sValeur;
	},

	// construit la requete pour appeler un evenement AJAX
	sConstuitRequeteEvenement: function(oPage, sChamp, nEvenement, nOption)
	{	// construction de la requete AJAX selon les options
		var sRequete = "";
		var sValeur;
		switch (nOption)
		{	// on envoie la valeur du champ courant
			case 1:
				// action AJAX
				sRequete += this.sCommandeAjax_Champ;
				// evenement
				sRequete += "&" + this.sCommandeAjax_Evenement + "=" + nEvenement;
				// champ
				sRequete += "&" + this.sCommandeAjax_Contexte + "=" + sChamp;
				// Valeur du champ
				sRequete += this.sConstruitValeurChampNomSep(oPage, sChamp);
				// Si on a indique (via _JAZR) de transmettre en plus l'occurrence courante de la ZR du champ : on la transmet
				if (this.m_sZRChamp)
				{
					sValeur = clWDEncode.sEncodePOST(this.m_sZRChamp) + "=" + clWDEncode.sEncodePOST(this.m_sZRChampValeur);
					if (sValeur != "")
						sRequete += "&" + sValeur;
				}
				break;

			// on envoie la valeur de tous les champs de la page
			case 2:
				// action AJAX
				sRequete += this.sCommandeAjax_Page;
				// evenement
				sRequete += "&" + this.sCommandeAjax_Evenement + "=" + nEvenement;
				// champ
				sRequete += "&" + this.sCommandeAjax_Contexte + "=" + sChamp;
				// valeurs des champs de la page
				sValeur = this.sConstruitValeurPage(oPage.elements);
				if (sValeur != "")
				{
					sRequete += "&" + sValeur;
				}
				break;

			// Clic sur une reglette mais sans submit
			case 3:
				// Action AJAX
				sRequete += this.sCommandeAjax_Execute;
				// Evenement
				sRequete += "&" + this.sCommandeAjax_Reglette + "=" + sChamp;
				// Champ reglette
				sRequete += "&" + sChamp + "=" + nEvenement;
				break;

			// Clic sur une reglette avec submit
			case 4:
				// Action AJAX
				sRequete += this.sCommandeAjax_Page;
				// Evenement
				sRequete += "&" + this.sCommandeAjax_Reglette + "=" + sChamp;
				// Champ reglette. A priori cette valeur est en double car deja dans le submit de la page donc on ne la me pas
				var oChampReglette = eval("oPage." + sChamp);
				if (oChampReglette)
				{
					oChampReglette.value = nEvenement;
				}
				// valeurs des champs de la page
				sValeur = this.sConstruitValeurPage(oPage.elements);
				if (sValeur != "")
				{
					sRequete += "&" + sValeur;
				}
				break;

			// Selection d'une ligne de table
			case 5:
				// Action AJAX
				sRequete += this.sCommandeAjax_Page;
				// Evenement
				sRequete += "&" + this.sCommandeAjax_ClicTable + "=" + sChamp;
				// Valeurs des champs de la page
				sValeur = this.sConstruitValeurPage(oPage.elements);
				if (sValeur != "")
				{
					sRequete += "&" + sValeur;
				}
				break;

			// Selection d'une ligne de table sans submit
			case 6:
				// Action AJAX
				sRequete += this.sCommandeAjax_Champ;
				// Evenement
				sRequete += "&" + this.sCommandeAjax_ClicTable + "=" + sChamp;
				// Valeur du champ
				sRequete += this.sConstruitValeurChampNomSep(oPage, sChamp);
				break;

			// Initialisation d'un gadget vista
			case 7:
				// Action AJAX
				sRequete += this.sCommandeAjax_InitGadget;
				break;

			// Action sur un champ calendrier
			case 8:
				// Action AJAX
				sRequete += this.sCommandeAjax_Champ;
				// Evenement
				sRequete += "&" + this.sCommandeAjax_ClicCalendrier + "=" + (nEvenement ? nEvenement : "");
				// Champ
				sRequete += "&" + this.sCommandeAjax_Contexte + "=" + sChamp;
				// Valeur du champ
				sRequete += this.sConstruitValeurChampNomSep(oPage, sChamp);
				var oVarChamp = oGetObjetChamp(sChamp);
				sRequete += this.sConstruitValeurChampNomSep(oPage, oVarChamp.oGetElementHTMLValeur().name);
				sRequete += this.sConstruitValeurChampNomSep(oPage, oVarChamp.oGetElementHTMLMois().name);
				// Si le champ est dans une ZR, declenche la selection de la ligne de ZR
				if (oVarChamp.bGestionZR_SansPopup())
				{
					sRequete += this.sConstruitValeurChampNomSep(oPage, oVarChamp.m_sAliasZR);
				}
				break;

			// on ne renvoie aucune valeur
			default:
				{
					// Si on a indique (via _JAZR) de transmettre en plus l'occurrence courante de la ZR du champ : on la transmet
					sValeur = "";
					if (this.m_sZRChamp)
					{
						sValeur = clWDEncode.sEncodePOST(this.m_sZRChamp) + "=" + clWDEncode.sEncodePOST(this.m_sZRChampValeur);
					}
					// Action AJAX
					sRequete += (sValeur != "") ? this.sCommandeAjax_Champ : this.sCommandeAjax_Execute;
					// evenement
					sRequete += "&" + this.sCommandeAjax_Evenement + "=" + nEvenement;
					// champ
					sRequete += "&" + this.sCommandeAjax_Contexte + "=" + sChamp;
					// Valeur de la ZR
					if (sValeur != "")
					{
						sRequete += "&" + sValeur;
					}
					break;
				}
		}

		// Dans tous les cas (Que la valeur soit traite ou non) on supprime la reference a la ZR a transmettre en plus
		delete this.m_sZRChamp;
		delete this.m_sZRChampValeur;

		// Si la fonction existe dans la page : effectue les operations apres submit AJAX
		if (window.FinSubmitAJAX && (typeof FinSubmitAJAX == "function"))
		{
			FinSubmitAJAX();
		}

		// Renvoie la requete
		return sRequete;
	},

	// AJAXDisponible
	// renvoie TRUE si AJAX est disponible sur ce navigateur
	AJAXDisponible: function()
	{
		// Si deja teste
		if (this.m_bTestAJAXDisponible)
			return this.m_bAJAXDisponible; // Renvoie la disponibilite calcule

		// On essaie de creer une requete
		var clRequete = this.clCreeXMLHttpRequest();
		// AJAX est disponible si on a pu creer la requete
		this.m_bAJAXDisponible = (clRequete != null);
		clRequete = null;
		this.m_bTestAJAXDisponible = true;

		// On renvoie la valeur calcule
		return this.m_bAJAXDisponible;
	},

	// renvoie la valeur d'un noeud XML
	sXMLGetValeur: function(XMLNoeud)
	{	// Renvoie la valeur du noeud
		// Sauf que s'il y a trop de texte, FireFox (et IE ?) decoupent en plusieurs fils de type texte
		var sValeur;

		if (XMLNoeud)
		{
			// Recupere les nodes
			var tabNodes = XMLNoeud.childNodes;
			var nLimiteI = tabNodes.length;

			// Selon le nombre de noeud
			// 1 : le retourne simplement
			if (nLimiteI == 1)
			{
				// Si la valeur est vide la valeur retourne null
				sValeur = tabNodes[0].nodeValue;
				return (sValeur !== null) ? sValeur : "";
			}
			else if (nLimiteI > 1)
			{
				// > 1 : concatene les fils via un tableau que l'on join
				var tabValeur = new Array(nLimiteI);
				// On parcours les fils
				var i;
				for (i = 0; i < nLimiteI; i++)
				{
					// Met la valeur de la node dans le tableau
					sValeur = tabNodes[i].nodeValue;
					// Si la valeur est vide la node retourne null
					tabValeur[i] = (sValeur !== null) ? sValeur : "";
				}

				// Renvoie la valeur calcule
				return tabValeur.join("");
			}
		}

		// => 0 fils ou node vide : chaine vide
		return "";
	},

	// Renvoie le tableau avec les valeurs des nodes filles d'un certains type
	tabXMLGetTableauValeur: function(oXMLRacine, sTag)
	{
		// Recupere le tableaux des noeuds qui matchent
		var tabNodesTag = oXMLRacine.getElementsByTagName(sTag);

		// Si on a bien des noeuds fils de ce type
		var nNbNodesTag = tabNodesTag.length;
		if (nNbNodesTag > 0)
		{
			// Reserve le tableau
			var tabValeur = new Array(nNbNodesTag);

			// On parcourt les options de la combo
			var nNodeTag;
			for (nNodeTag = 0; nNodeTag < nNbNodesTag; nNodeTag++)
			{
				tabValeur[nNodeTag] = this.sXMLGetValeur(tabNodesTag[nNodeTag]);
			}

			// Retourne le tableau
			return tabValeur;
		}

		// Pas de noeud du type : pas de tableau
		return null;
	},

	// Indique si un attribut existe
	bXMLAttributExiste: function(XMLNoeud, sAttribut)
	{	// Renvoie vrai si l'attribut existe
		return (XMLNoeud.attributes.getNamedItem(sAttribut) ? true : false);
	},

	// renvoie la valeur d'un attribut de noeud XML
	sXMLGetAttribut: function(XMLNoeud, sAttribut)
	{
		//assert(bXMLAttributExiste(XMLNoeud, sAttribut);
		// Renvoie la valeur du noeud
		return XMLNoeud.attributes.getNamedItem(sAttribut).nodeValue;
	},

	// Renvoie la valeur d'un attribut de noeud XML ou sDefaut si le neoud n'existe pas
	sXMLGetAttributSafe: function(XMLNoeud, sAttribut, sDefaut)
	{
		var oAtt = XMLNoeud.attributes.getNamedItem(sAttribut);
		// Renvoie la valeur de l'attribut si possible
		return oAtt ? oAtt.nodeValue : sDefaut;
	},

	// Renvoie la valeur d'un attribut de noeud XML sous forme d'un booleen (faux si le noeud n'existe pas (ou contient une valeur != "1"))
	bXMLGetAttributSafe: function(XMLNoeud, sAttribut)
	{
		return (this.sXMLGetAttributSafe(XMLNoeud, sAttribut, "0") == "1");
	},

	// Renvoie la valeur d'un attribut de noeud XML sous forme d'un booleen (vrai si le noeud n'existe pas (ou contient une valeur != "0"))
	bXMLGetAttributSafe_Vrai: function bXMLGetAttributSafe_Vrai(XMLNoeud, sAttribut)
	{
		return (this.sXMLGetAttributSafe(XMLNoeud, sAttribut, "1") != "0");
	},

	// Renvoie la valeur d'un attribut de noeud XML sous forme d'entier ou nDefaut si le neoud n'existe pas
	nXMLGetAttributSafe: function(XMLNoeud, sAttribut, nDefaut)
	{
		var oAtt = XMLNoeud.attributes.getNamedItem(sAttribut);
		// Renvoie la valeur de l'attribut si possible
		if (oAtt)
		{
			var sValeur = oAtt.nodeValue;
			// La valeur doit etre :
			// - Non vide
			// - Representer un entier valide
			if (sValeur.length > 0)
			{
				var nValeur = parseInt(oAtt.nodeValue, 10);
				if (!isNaN(nValeur))
				{
					return nValeur;
				}
			}
		}
		return nDefaut;
	},

	// Enleve a la demande les espaces, RC, tabulations d'une chaine donne
	sTrim: function(sValeur, bEspaces, bTabulations, bRCs)
	{
		var szValeur = new String(sValeur);

		// Element du debut
		var nDebutChaine = 0;
		while (nDebutChaine < szValeur.length)
		{
			var cChar = szValeur.charAt(nDebutChaine);

			// Un espace ?
			if (bEspaces && (cChar == " "))
			{	// Oui on le saute
				nDebutChaine++;
				// Traite le caratere suivant
				continue;
			}
			// Une tabulation ?
			if (bTabulations && (cChar == "\b"))
			{	// Oui on le saute
				nDebutChaine++;
				// Traite le caratere suivant
				continue;
			}
			// Un rc?
			if (bEspaces && ((cChar == "\r") || (cChar == "\n")))
			{	// Oui on le saute
				nDebutChaine++;
				// Traite le caratere suivant
				continue;
			}
			// Pas un caratere interdit : fin du parcours
			break;
		}

		// Element de la fin
		var nFinChaine = szValeur.length;
		while (nFinChaine > nDebutChaine)
		{
			var cChar = szValeur.charAt(nFinChaine - 1);
			// Un espace ?
			if (bEspaces && (cChar == " "))
			{	// Oui on le saute
				nFinChaine--;
				// Traite le caratere suivant
				continue;
			}
			// Une tabulation ?
			if (bTabulations && (cChar == "\b"))
			{	// Oui on le saute
				nFinChaine++;
				// Traite le caratere suivant
				continue;
			}
			// Un rc?
			if (bEspaces && ((cChar == "\r") || (cChar == "\n")))
			{	// Oui on le saute
				nFinChaine++;
				// Traite le caratere suivant
				continue;
			}
			// Pas un caratere interdit : fin du parcours
			break;
		}
		// on renvoie la chaine resultat
		return szValeur.substring(nDebutChaine, nFinChaine);
	},

	// Enleve a la demande TOUS les RC, tabulations et doubles espaces d'une chaine donne
	sSansEspace: function(sValeur, bEspaces, bTabulations, bRCs)
	{
		// Les RC et les tabulations
		if (bRCs && bTabulations)
		{
			sValeur = sValeur.replace(/[\r\n\b]/g, "");
		}
		else if (bRCs)	// Les RC seuls
		{
			sValeur = sValeur.replace(/[\r\n]/g, "");
		}
		else if (bTabulations)	// Les tabulations seules
		{
			sValeur = sValeur.replace(/\b/g, "");
		}

		// Les espaces
		var nOldLength = 0;
		do
		{
			nOldLength = sValeur.length;
			sValeur = bEspaces ? sValeur.replace(/  /g, " ") : sValeur;
		} while (sValeur.length < nOldLength);

		// Renvoie la chaine resultat
		return sValeur;
	},

	// Recherche un champ par son alias
	oChercheChamp: function(oPage, sNomChamp, nTypeChamp, bExterieur, bForceExterieur)
	{
		var oElement;
		// Recherche pour la visibilite
		if (bExterieur)
		{
			switch (nTypeChamp)
			{
				case this.XML_CHAMP_TYPE_TABLE:
				case this.XML_CHAMP_TYPE_ZONEREPETEE:
					oElement = this.oGetConteneurParent(sNomChamp);
					break;
				case this.XML_CHAMP_TYPE_CALENDRIER:
					// Pour le contenu du champ calendrier, on a besoin du champ exterieur/interieur
					if (bForceExterieur == false)
					{
						oElement = _JGE(sNomChamp, document, false, true);
					}
					break;
			}
			if (!oElement) oElement = _JGE(sNomChamp, document, bExterieur);
		}
		else
		{
			// Recherche normale
			switch (nTypeChamp)
			{
				// Pour les libelle il faut utiliser getElementById
				case this.XML_CHAMP_TYPE_LIBELLE:
				case this.XML_CHAMP_TYPE_CHAMPFORMATE:
				case this.XML_CHAMP_TYPE_LIBELLEHTML:
				case this.XML_CHAMP_TYPE_REGLETTE:
				case this.XML_CHAMP_TYPE_CHEMINNAV:
				case this.XML_CHAMP_TYPE_PLANSITE:
					// De meme pour les options de menu
				case this.XML_CHAMP_TYPE_SOUSMENU:
				case this.XML_CHAMP_TYPE_OPTIONMENU:
					oElement = _JGE(sNomChamp, document, false);
					break;
				// Pour les arbres il faut rechercher en priorite le champ avec un suffixe
				case this.XML_CHAMP_TYPE_TREEVIEW:
					oElement = _JGE(sNomChamp + "_", document, false);
					break;
				case this.XML_CHAMP_TYPE_LIEN:
					// Il faut rechercher les liens par ID car getElementsByName ne retourne les elements par ID que dans IE
					oElement = document.getElementById(sNomChamp);
					break;
				default:
					// Que la methode commune
					break;
			}
		}

		// Methodes commune en cas d'echec
		if (!oElement) oElement = eval("oPage." + sNomChamp);
		// Derniere chance pour les champ hors du formulaire
		if (!oElement)
		{
			oElement = document.getElementsByName(sNomChamp);
			if (oElement)
			{
				switch (nTypeChamp)
				{
				case this.XML_CHAMP_TYPE_SELECTEUR:
					// Sauf pour les interrupteur : on prend le premier champ
					break;

				case this.XML_CHAMP_TYPE_VOLETONGLET:
					// Correction pour les volets d'onglets
					// Sous IE en mode quirks, getElementsByName retourne aussi les éléments par ID
					// Et le code envoyé par le serveur en tient compte
					// Sauf que on ne peut pas modifier le code serveur car alors les sites des anciennes versions ne fonctionnerai plus forcement
					// avec un nouveau moteur.
					if (!bIEQuirks)
					{
						oElement = document.getElementById(sNomChamp);
						break;
					}

					// pas de break;
				default:
					// Sauf pour les interrupteur : on prend le premier champ
					oElement = oElement[0];
				}
			}

		}
		return oElement;
	},

	// Recupere le champ conteneur d'une ZR/Table
	oGetConteneurParent: function(sNomChamp)
	{
		var oConteneurParent = oGetId("con-" + sNomChamp);
		return oConteneurParent ? oConteneurParent : oGetId("ctz" + sNomChamp);
	},

	// Recupere la balise TBODY d'une balise TABLE
	oGetConteneurTBODY: function(oConteneurParent)
	{
		var oConteneurTBody = oConteneurParent;
		// Si le parent de la table/ZR est une balise de type table : on risque d'avoir un probleme avec la pseudo balise TBODY
		if ((oConteneurTBody) && (oConteneurTBody.tagName.toUpperCase() == "TABLE"))
		{
			// Recherche le TBODY
			var i;
			var nLimiteI = oConteneurTBody.childNodes.length;
			for (i = 0; i < nLimiteI; i++)
			{
				if (oConteneurTBody.childNodes[i].tagName && (oConteneurTBody.childNodes[i].tagName.toUpperCase() == "TBODY"))
				{
					oConteneurTBody = oConteneurTBody.childNodes[i];
					break;
				}
			}
		}
		return oConteneurTBody;
	},

	// Recupere une ligne d'un champ d'une ZR/Table
	oGetConteneurLigne: function(sNomChamp, nIndiceActuel, oConteneurTBody)
	{
		return this.oGetRemonteFilsUnique(oGetId(sNomChamp + "_" + nIndiceActuel), oConteneurTBody);
	},

	// Remonte les parent tant que l'element est unique d'un autre
	oGetRemonteFilsUnique: function(oElement, oConteneurTBody)
	{
		// Uniquement si l'element est valide et si on est dans une vraie table
		if (oElement && oConteneurTBody)
		{
			// On remonte les noeuds tant que l'on est le seul fils
			var oParent = oElement.parentNode;
			while (oParent && oParent != oConteneurTBody && (oParent.childNodes.length == 1))
			{
				oElement = oParent;
				oParent = oElement.parentNode;
			}
		}
		return oElement;
	},


	// Supprime la ligne donnee
	bSupprimeLigne: function(sNomChamp, nTypeChamp, nIndiceLigne, nNbRuptures, oConteneurParent, oConteneurTBody)
	{
		// On commence par recuperer la ligne
		var oLigneSuppr = this.oGetConteneurLigne(sNomChamp, nIndiceLigne, oConteneurTBody);

		// Si pas de ligne => Fini
		if (!oLigneSuppr) return false;

		// On supprime les ruptures de la ligne si besoin
		if (nTypeChamp != this.XML_CHAMP_TYPE_TABLE)
		{
			this.SupprimeRuptures(sNomChamp, nIndiceLigne, nNbRuptures, oConteneurTBody);
		}

		// Si on est dans une vrai table
		if (oConteneurTBody)
		{
			oLigneSuppr.parentNode.removeChild(oLigneSuppr);
		}
		else
		{
			// On supprime le noeud
			oConteneurParent.removeChild(oLigneSuppr);
		}

		// On ne supprime pas les styles car on n'a pas leurs noms
		// Mais de toutes facons comme il n'y a pas de ligne pour les appliquer pas de problemes
		// Et si un jour on rajoute de nouveau une ligne, elle sera avec son style donc celui-ci remplacera le style non detruit

		return true;
	},

	// Supprime une rupture
	SupprimeUneRupture: function(sId, oConteneurTBody)
	{
		// Trouve la rupture
		var oRupture = this.oGetRemonteFilsUnique(oGetId(sId), oConteneurTBody);
		// Si la rupture est valide et est dans le document
		if ((oRupture) && (oRupture.parentNode))
		{
			oRupture.parentNode.removeChild(oRupture);
		}
	},

	// Supprime les ruptures d'une ligne donne
	SupprimeRuptures: function(sNomChamp, nIndiceLigne, nNbRuptures, oConteneurTBody)
	{
		// On parcours les niveaux de ruptures
		var i;
		for (i = 0; i < nNbRuptures; i++)
		{
			// D'abord le haut de la rupture
			this.SupprimeUneRupture(sNomChamp + "-H-" + i + "-" + nIndiceLigne, oConteneurTBody);
			// Puis le bas
			this.SupprimeUneRupture(sNomChamp + "-B-" + i + "-" + nIndiceLigne, oConteneurTBody);
		}
	},

	// Certains champ on a un niveau de table tr td supplementaire ce qui gene la manipulation de ..Valeur et ..Libelle
	oSauteTableCadrage: function(oChamp)
	{
		if (oChamp && (oChamp.tagName.toUpperCase() == "TABLE"))
		{
			while (oChamp && (oChamp.tagName.toUpperCase() != "TD"))
			{
				oChamp = oChamp.firstChild;
			}
		}
		return oChamp;
	},

	// execute les actions pour une propriete
	ActionProprieteValeur: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		var sValeur = this.sXMLGetValeur(XMLAction);

		// Il n'y a pas encore eu de validation de l'existance de oChamp, donc on le fait ici si besoin

		// selon le type du champ
		switch (nTypeChamp)
		{
			// Le cas n'existe plus la propriete ..Valeur est transforme en ..Libelle sur le serveur
			case this.XML_CHAMP_TYPE_IMAGE:
			case this.XML_CHAMP_TYPE_MAPAREA:
			case this.XML_CHAMP_TYPE_VIGNETTE:
			case this.XML_CHAMP_TYPE_GRAPHE:
			case this.XML_CHAMP_TYPE_IFRAME: // On change la source des IFrames par un ..src
				if (oChamp) oChamp.src = sValeur;
				break;
			case this.XML_CHAMP_TYPE_LISTE:
				if (oChamp) oChamp.selectedIndex = parseInt(sValeur);
				break;
			case this.XML_CHAMP_TYPE_SELECTEUR:
				// Pour les selecteur : le code serveur a deja fait l'enventuelle transposition et le -1 requis
				var nOptionSel = parseInt(sValeur);

				// Si on a une valeur negative => Ne selectionne rien
				if (nOptionSel < 0)
				{
					// Si on n'a plus d'une option
					if (oChamp && oChamp.length)
					{	// Les deselectionnes toutes
						var i;
						var nLimiteI = oChamp.length;
						for (i = 0; i < nLimiteI; i++)
						{
							oChamp[i].checked = false;
						}
					}
					else if (oChamp)
					{
						// Une seule option
						//assert(nOptionSel==0);
						oChamp.checked = false;
					}
				}
				else
				{
					if (oChamp && oChamp.length)
					{	// Si on n'a plus d'une option
						if (oChamp && (nOptionSel <= oChamp.length)) oChamp[nOptionSel].checked = true;
					}
					else if (oChamp)
					{
						// Une seule option
						//assert(nOptionSel==0);
						oChamp.checked = true;
					}
				}
				break;
			case this.XML_CHAMP_TYPE_INTERRUPTEUR:
				if (oChamp) oChamp.checked = parseInt(sValeur);
				break;
			case this.XML_CHAMP_TYPE_LIBELLE:
			case this.XML_CHAMP_TYPE_CHAMPFORMATE:
				// Dans certains cas une table est ajoute et l'ID est sur la table au lieu de la cellule : retrouve la cellule
				oChamp = this.oSauteTableCadrage(oChamp);

				// Affectation de la valeur avec rajout des balises HTML
				if (oChamp) oChamp.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, true);
				break;
			case this.XML_CHAMP_TYPE_SAISIE: // Champ de saisie
				if (oChamp)
				{
					// On transforme pour gerer les caratere interdit en ISO-8859-1 si besoin
					oChamp.value = clWDEncode.sEncodeCharset(sValeur, false);
					// Si le champ a une variable associee (champ avec indication ou champ de saisie riche)
					// appele la methode d'ecriture de la valeur
					AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetValeur, [null, sValeur, oChamp]);
				}
				break;
			case this.XML_CHAMP_TYPE_HTML:
			case this.XML_CHAMP_TYPE_LIBELLEHTML:
				// Pour les champs HTML superposable : on prend le champ exterieur si on n'a pas le champ interieur
				if (!oChamp && oChampExt) oChamp = oChampExt;
			case this.XML_CHAMP_TYPE_REGLETTE:
			case this.XML_CHAMP_TYPE_CHEMINNAV:
			case this.XML_CHAMP_TYPE_PLANSITE:
				// Dans certains cas une table est ajoute et l'ID est sur la table au lieu de la cellule : retrouve la cellule
				oChamp = this.oSauteTableCadrage(oChamp);

				// Affectation de la valeur sans rajout des balises HTML
				if (oChamp) oChamp.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, false, true);
				break;
			default:		// Autres cas
				if (oChamp) oChamp.value = sValeur;
				break;
			case this.XML_CHAMP_TYPE_IFRAME_DEST:
			case this.XML_CHAMP_TYPE_IFRAME_SOURCE:
			case this.XML_CHAMP_TYPE_CELLULE:
			case this.XML_CHAMP_TYPE_SUPERCHAMP:
			case this.XML_CHAMP_TYPE_MODELEDECHAMP_SOURCE:
			case this.XML_CHAMP_TYPE_MODELEDECHAMP_DEST:
				//assert(false);
				break;

			case this.XML_CHAMP_TYPE_ONGLET:
				// On force la selection car la valeur renvoie par le serveur est forcement valide et
				// que la commande sur le ..Etat des volets peut ne pas encore etre execute
				AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetValeur, [null, sValeur, null]);
				break;
			case this.XML_CHAMP_TYPE_TIROIR:
				AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetValeur, [null, (parseInt(sValeur, 10) != 0), null]);
				break;
		}
	},

	// Libelle
	ActionProprieteLibelle: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		var sValeur = this.sXMLGetValeur(XMLAction);
		// Selon le type du champ
		switch (nTypeChamp)
		{
			// Cas de la page
			case this.XML_CHAMP_TYPE_PAGEPRINCIPALE:
				document.title = sValeur;
				break;

			// On traite le champ bouton specialement : Si c'est un champ image on fait comme les images
			case this.XML_CHAMP_TYPE_BOUTON:
				// Si c'est un bouton image => On doit prendre le div interne
				var oChampImg = _JGE("_" + sAliasChamp + "_IMG", document, false);
				if (oChampImg && (oChampImg.tagName.toUpperCase() != "IMG"))
				{
					oChampImg.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, true);
				}
				else if (oChamp)
				{
					// Si on a le champ c'est que c'est un champ de type input => bouton "normal"
					oChamp.value = sValeur;

				}
				break;
			case this.XML_CHAMP_TYPE_LIBELLE:
				// Dans certains cas une table est ajoute et l'ID est sur la table au lieu de la cellule : retrouve la cellule
				oChamp = this.oSauteTableCadrage(oChamp);

				// Affectation de la valeur avec rajout des balises HTML
				if (oChamp) oChamp.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, true);
				break;
			case this.XML_CHAMP_TYPE_LIBELLEHTML:
				// Dans certains cas une table est ajoute et l'ID est sur la table au lieu de la cellule : retrouve la cellule
				oChamp = this.oSauteTableCadrage(oChamp);

				// Affectation de la valeur sans rajout des balises HTML
				if (oChamp) oChamp.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, false, true);
				break;
			case this.XML_CHAMP_TYPE_LIEN:
				// On ne cherche pas le champ lui meme mais le champ autour pour avoir la balise a
				oChamp = _JGE(sAliasChamp, document, false, true);
				if (oChamp)
				{
					// Soit on est directement sur le a ou sur le TD autour
					while (oChamp && (oChamp.tagName.toUpperCase() != "A")) oChamp = oChamp.firstChild;
					if (oChamp)
					{
						oChamp.innerHTML = sValeur;
					}
				}
				break;
			case this.XML_CHAMP_TYPE_TABLE:
				// On cherche un id special pour les tables et colonne de table
				oChamp = oGetId("lz" + sAliasChamp);
				if (!oChamp) oChamp = _JGE(sAliasChamp, document, false, true);
				oChamp.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, true);
				break;

			case this.XML_CHAMP_TYPE_COLONNE:
				// Si c'est une table AJAX : on doit rechercher la cellule interne
				var sTableAjax = new String(this.sXMLGetAttributSafe(XMLAction, this.XML_CHAMP_PROP_NUM_LIBELLE_TABLE_AJAX, ""));
				if (sTableAjax.length > 0)
				{
					var nSeparateur = sTableAjax.indexOf(";");
					var oVarTable = oGetObjetChamp(sTableAjax.substring(0, nSeparateur));
					oChamp = oVarTable.oGetIDElement(oVarTable.ID_TITRE, parseInt(sTableAjax.substring(nSeparateur + 1)));
				}
				// On cherche un id special pour les tables et colonne de table
				if (!oChamp) oChamp = oGetId((nTypeChamp == this.XML_CHAMP_TYPE_TABLE ? "lz" : "tt") + sAliasChamp);
				if (!oChamp) oChamp = _JGE(sAliasChamp, document, false, true);
				oChamp.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, true);
				break;

			case this.XML_CHAMP_TYPE_SOUSMENU:
			case this.XML_CHAMP_TYPE_OPTIONMENU:
				// Cas des elements de menu
				if (oChamp) oChamp.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, true);
				break;

			default:		// Autres cas
				// Ne fait rien
				break;
		}
	},

	// Hauteur
	ActionProprieteHauteur: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		var nHauteur = parseInt(this.sXMLGetValeur(XMLAction));
		if (nHauteur >= 0)
		{
			switch (nTypeChamp)
			{
				case this.XML_CHAMP_TYPE_TIROIR:
					AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetProp, [WDChamp.prototype.XML_CHAMP_PROP_NUM_HAUTEUR, null, nHauteur, null]);
					break;

				// Cas particulier pour les conteneurs (Cellules, Superchamps, modeles de champs)
				case this.XML_CHAMP_TYPE_CELLULE:
				case this.XML_CHAMP_TYPE_SUPERCHAMP:
//				case this.XML_CHAMP_TYPE_MODELEDECHAMP_SOURCE
				case this.XML_CHAMP_TYPE_MODELEDECHAMP_DEST:
					// Il faut modifier la cellule interne
					oChamp.getElementsByTagName("TD")[0].height = nHauteur;
					// La cellule
					this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "height", nHauteur + "px", false);
					// Et la cellule externe
					oChamp = oChamp.parentNode;
					while (oChamp && (oChamp != document.body))
					{
						switch (oChamp.tagName.toUpperCase())
						{
							case "TABLE":
								oChamp.height = nHauteur;
								// Pas de break
							default:
								oChamp = oChamp.parentNode;
								break;
							case "DIV":
								this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "height", nHauteur + "px", false);
								oChamp = null;
						}
					}
					break;
				// Cas particuliers des interrupteurs et des selecteurs => Il faut manipuler chaque instance de l'interrupteur
				case this.XML_CHAMP_TYPE_INTERRUPTEUR:
				case this.XML_CHAMP_TYPE_SELECTEUR:
					// Modifie la taille globale
					this.ActionProprieteStyleGenerique(oChampExt, nTypeChamp, "height", nHauteur + "px", false);

					// Puis modifier la hauteur de chaque interrupteurs => Ce n'est pas ce que fait le code serveur traditionnel
					break;

				// Cas des onglets : on manipule les conteneur des onglets
				case this.XML_CHAMP_TYPE_ONGLET:
					this.ActionProprieteStyleGenerique(oChampExt, nTypeChamp, "height", nHauteur + "px", false);
					this.ActionProprieteStyleGenerique(oGetId("con-" + sAliasChamp), nTypeChamp, "height", nHauteur + "px", false);
					break;

				default:
					this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "height", nHauteur + "px", false);
					break;
			}
		}
	},

	// Largeur
	ActionProprieteLargueur: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		var nLargueur = parseInt(this.sXMLGetValeur(XMLAction));
		if (nLargueur >= 0)
		{
			switch (nTypeChamp)
			{
				case this.XML_CHAMP_TYPE_TIROIR:
					AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetProp, [WDChamp.prototype.XML_CHAMP_PROP_NUM_LARGEUR, null, nLargueur, null]);
					break;

				// Cas particulier pour les conteneurs (Cellules, Superchamps, modeles de champs)
				case this.XML_CHAMP_TYPE_CELLULE:
				case this.XML_CHAMP_TYPE_SUPERCHAMP:
//				case this.XML_CHAMP_TYPE_MODELEDECHAMP_SOURCE
				case this.XML_CHAMP_TYPE_MODELEDECHAMP_DEST:
					// Il faut modifier la cellule interne
					oChamp.getElementsByTagName("TD")[0].width = nLargueur;
					// La cellule
					this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "width", nLargueur + "px", false);
					// Et la cellule externe
					oChamp = oChamp.parentNode;
					while (oChamp && (oChamp != document.body))
					{
						switch (oChamp.tagName.toUpperCase())
						{
							case "TABLE":
								oChamp.width = nLargueur;
								// Pas de break
							default:
								oChamp = oChamp.parentNode;
								break;
							case "DIV":
								this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "width", nLargueur + "px", false);
								oChamp = null;
						}
					}
					break;
				// Cas particuliers des interrupteurs et des selecteurs => Il faut manipuler chaque instance de l'interrupteur
				case this.XML_CHAMP_TYPE_INTERRUPTEUR:
				case this.XML_CHAMP_TYPE_SELECTEUR:
					// Modifie la taille globale
					this.ActionProprieteStyleGenerique(oChampExt, nTypeChamp, "width", nLargueur + "px", false);

					// Puis modifier la hauteur de chaque interrupteurs => Ce n'est pas ce que fait le code serveur traditionnel
					break;

				// Cas des onglets : on manipule le conteneur externe et le contenuer interne
				case this.XML_CHAMP_TYPE_ONGLET:
					this.ActionProprieteStyleGenerique(oChampExt, nTypeChamp, "width", nLargueur + "px", false);
					this.ActionProprieteStyleGenerique(oGetId("con-" + sAliasChamp), nTypeChamp, "width", nLargueur + "px", false);

				default:
					this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "width", nLargueur + "px", false);
					break;
			}
		}
	},

	// X
	ActionProprieteX: function(oChamp, nTypeChamp, XMLAction)
	{
		//assert(oChamp.tagName == "DIV");
		// On ne filtre pas les positions , les positions negatives sont valides
		this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, bRTL ? "right" : "left", this.sXMLGetValeur(XMLAction) + "px", false);
	},

	// Y
	ActionProprieteY: function(oChamp, nTypeChamp, XMLAction)
	{
		//assert(oChamp.tagName == "DIV");
		// On ne filtre pas les positions , les positions negatives sont valides
		this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "top", this.sXMLGetValeur(XMLAction) + "px", false);
	},

	// Couleur
	ActionProprieteCouleur: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		// On ne recupere la couleur qu'une fois
		var sCouleur = this.sXMLGetValeur(XMLAction);
		// Puis selon le type de champ on fait des actions differentes
		switch (nTypeChamp)
		{
			// Les interrupteurs et les selecteurs sont particulier
			case this.XML_CHAMP_TYPE_INTERRUPTEUR:
			case this.XML_CHAMP_TYPE_SELECTEUR:
				oChamp = _JGE(sAliasChamp, document, false, true);
				// Ajoute le comportement par defaut
				break;

			case this.XML_CHAMP_TYPE_CHEMINNAV:
			case this.XML_CHAMP_TYPE_PLANSITE:
			case this.XML_CHAMP_TYPE_REGLETTE:
			case this.XML_CHAMP_TYPE_TREEVIEW:
				// Pour les champs de type reglette, le style est sur le conteneur de la reglette (Pas de problemes)
				// mais il y a une surcharge du style pour toutes les balises A dans la ligne (car sinon les balises n'heritent pas du style)
				this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "color", sCouleur, true);
				// Sans le comportement par defaut
				return;

			case this.XML_CHAMP_TYPE_COLONNE:
				// Va modifier le style dans l'entete de la page
				this.ActionProprieteCouleurFeuilleStyle("#c-" + sAliasChamp, "color", sCouleur);
				// Sans le comportement par defaut
				return;

			case this.XML_CHAMP_TYPE_SAISIE:
				// Sur les champs de saisie riche (et sur les champs de saisie avec indication)
				// Mais dans ce cas l'appel ne fait rien et c'est l'affectation sur le champ formulaire qui effectue le travail
				AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetProp, [WDChamp.prototype.XML_CHAMP_PROP_NUM_COULEUR, null, sCouleur, oChamp]);
				// Ajoute le comportement par defaut
				break;

			case this.XML_CHAMP_TYPE_LIEN:
				oChamp = _JGE(sAliasChamp, document, false, false);
				// Ajoute le comportement par defaut
				break;

			// Mais pas de problemes avec les autres champs
			default:
				// Ajoute le comportement par defaut
				break;
		}
		// Comportement par defaut
		if (oChamp && oChamp.style) oChamp.style.color = sCouleur;
	},

	// Couleur de fond
	ActionProprieteCouleurFond: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		// On ne recupere la couleur qu'une fois
		var sCouleur = this.sXMLGetValeur(XMLAction);
		// Puis selon le type de champ on fait des actions differentes
		switch (nTypeChamp)
		{
			case this.XML_CHAMP_TYPE_PAGEPRINCIPALE:
				document.bgColor = sCouleur;
				// Sans le comportement par defaut
				return;

				// Les interrupteurs et les selecteurs sont particulier
			case this.XML_CHAMP_TYPE_INTERRUPTEUR:
			case this.XML_CHAMP_TYPE_SELECTEUR:
				oChamp = _JGE(sAliasChamp, document, false, true);
				// Ajoute le comportement par defaut
				break;

			case this.XML_CHAMP_TYPE_IFRAME_DEST:
			case this.XML_CHAMP_TYPE_IFRAME_SOURCE:
			case this.XML_CHAMP_TYPE_CELLULE:
			case this.XML_CHAMP_TYPE_SUPERCHAMP:
			case this.XML_CHAMP_TYPE_MODELEDECHAMP_SOURCE:
			case this.XML_CHAMP_TYPE_MODELEDECHAMP_DEST:
				// On cherche le champ cellule
				oChamp = _JGE(sAliasChamp, document, false);
				// Ajoute le comportement par defaut
				break;
			case this.XML_CHAMP_TYPE_TIROIR:
				// Recherche le champ conteneur des deux parties
				oChamp = _JGE(sAliasChamp, document, true);
				break;

			case this.XML_CHAMP_TYPE_LIEN:
				// Pour QW46375 : Les champs liens on le style sur la balise tz (Sur la cellule conteneur) et sur le champ lien
				// On cherche la cellule de table
				var oChamp2 = _JGE(sAliasChamp, document, true);
				// Et on lui applique le style
				if (oChamp2 && oChamp2.style) oChamp2.style.backgroundColor = sCouleur;
				// Ajoute le comportement par defaut
				break;

			case this.XML_CHAMP_TYPE_REGLETTE:
				// Pour les champs de type reglette, le style est sur le conteneur de la reglette (Pas de problemes)
				// mais il y a une surcharge du style pour toutes les balises A dans la ligne (car sinon les balises n'heritent pas du style)
				this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "backgroundColor", sCouleur, true);
				// Sans le comportement par defaut
				return;

			case this.XML_CHAMP_TYPE_SAISIE:
				// Sur les champs de saisie riche (et sur les champs de saisie avec indication)
				// Mais dans ce cas l'appel ne fait rien et c'est l'affectation sur le champ formulaire qui effectue le travail
				AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetProp, [WDChamp.prototype.XML_CHAMP_PROP_NUM_COULEURFOND, null, sCouleur, oChamp]);
				// Ajoute le comportement par defaut
				break;

			// Mais pas de problemes avec les autres champs
			default:
				// Ajoute le comportement par defaut
				break;
		}
		// Comportement par defaut
		if (oChamp && oChamp.style) oChamp.style.backgroundColor = sCouleur;
	},

	// Etat d'un champ
	ActionProprieteEtat: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		// Selon le type de champ
		switch (nTypeChamp)
		{
			// Gestion de l'etat dans les champs de saisie riche
			case this.XML_CHAMP_TYPE_SAISIE:
				AppelMethodeChamp(sAliasChamp, WDSaisieRiche.prototype.ms_sOnEtat, []);
				break;
			// Champ qui genere des liens
			case this.XML_CHAMP_TYPE_BOUTON:
			case this.XML_CHAMP_TYPE_LIEN:
			case this.XML_CHAMP_TYPE_MAPAREA:
				// Et aussi sur les options de menu
			case this.XML_CHAMP_TYPE_SOUSMENU:
			case this.XML_CHAMP_TYPE_OPTIONMENU:
				// Gestion de ..Etat sur les volets d'onglets
			case this.XML_CHAMP_TYPE_VOLETONGLET:
				// Essai de trouver la collection des attributs de la balise A
				var oBaliseA = null;
				if (oChamp.tagName == "A")
				{
					oBaliseA = oChamp;
				}
				else if (oChamp.parentNode.tagName == "A")
				{
					oBaliseA = oChamp.parentNode;
				}
				else
				{
					return;
				}

				// Recupere l'etat final
				var nEtat = parseInt(this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_ETAT_ETAT));
				// Et la balise avec les attributs
				var oBalise = XMLAction.firstChild;

				// Parcours les attributs de oBalise pour les ajouter ou les supprimer du champ
				var tabAttributs = oBalise.attributes;
				var i;
				var nLimiteI = tabAttributs.length;
				for (i = 0; i < nLimiteI; i++)
				{
					var oAttribut = tabAttributs.item(i);

					if (nEtat != 0)
					{
						// Si on desactive => Supprime l'attribut
						switch (oAttribut.nodeName.toLowerCase())
						{
							case "onmouseout":
								oBaliseA.onmouseout = null;
								break;
							case "onmouseover":
								oBaliseA.onmouseover = null;
								break;
							default:
								oBaliseA.removeAttribute(oAttribut.nodeName, 0);
								break;
						}
					}
					else
					{
						// Ajoute/modifie l'attribut
						switch (oAttribut.nodeName.toLowerCase())
						{
							case "onmouseout":
								oBaliseA.onmouseout = new Function("", "document." + oAttribut.nodeValue);
								break;
							case "onmouseover":
								oBaliseA.onmouseover = new Function("", "document." + oAttribut.nodeValue);
								break;
							default:
								oBaliseA.setAttribute(oAttribut.nodeName, oAttribut.nodeValue, 0);
								break;
						}
					}
				}
				break;
			default:
				break;
		}
	},

	// Couleur de fond
	ActionProprieteVisible: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		// Selon le type du champ
		switch (nTypeChamp)
		{
		case this.XML_CHAMP_TYPE_COLONNE:
			// Si c'est une table AJAX : on doit rechercher la cellule interne
			oChamp = oGetId("tt" + sAliasChamp);
		case this.XML_CHAMP_TYPE_VOLETONGLET:
			// Cas des volets. Plus besoin de faire un cas particulier, SetDisplay gere le cas du mode "table", "table-row", etc pour FF et IE en mode IE8
		case this.XML_CHAMP_TYPE_SOUSMENU:
		case this.XML_CHAMP_TYPE_OPTIONMENU:
			// Cas des elements de menu : on fait un display:none/block
			SetDisplay(oChamp, this.sXMLGetValeur(XMLAction) != "0");
			break;

		default:
			// Si le parent est en positionnement relatif
			var bVisible = (this.sXMLGetValeur(XMLAction) != "0");
			// Si le parent est en positionnement relatif : .display
			if (this.bXMLGetAttributSafe(XMLAction, this.XML_CHAMP_PROP_NUM_VISIBLE_PARENTRELATIF))
			{
				SetDisplay(oChamp, bVisible);
			}
			else
			{
				// Sinon .visibility
				// oChamp est normalement le conteneur externe du champ
				if (oChamp && oChamp.style) oChamp.style.visibility = bVisible ? "inherit" : "hidden";
			}
			break;
		}
		// Notifie du changement de visibilite
		if (oChamp)
		{
			AppelMethode(WDChamp.prototype.ms_sOnDisplay, [oChamp]);
		}
	},

	// Image
	ActionProprieteImage: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		var sImage = this.sXMLGetValeur(XMLAction);
		// Selon le type du champ
		switch (nTypeChamp)
		{
		case this.XML_CHAMP_TYPE_PAGECORNEE:
			// Cas du champ page cornee, il faut manipuler le background-image
			oChamp.style.backgroundImage = "url('" + sImage + "')";
			// Notifie le champ du changement de taille
			AppelMethodeChamp(sAliasChamp, WDCornage.prototype.ms_sInitTailleImage, [sImage]);
			break;
		default:
			oChamp.src = sImage;
			break;
		}
	},

	// URL
	ActionProprieteURL: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		var oChampCpy = oChamp;
		// Selon le type du champ
		switch (nTypeChamp)
		{
			case this.XML_CHAMP_TYPE_MAPAREA:
				// Sur les champs image clicable simple l'id est sur le IMG et la A autour n'en a pas
				if (oChamp && (oChamp.tagName.toUpperCase() == "IMG") && (oChamp.parentNode.tagName.toUpperCase() == "A"))
					oChamp = oChamp.parentNode;
				break;
			default:
				// On ne cherche pas le champ lui meme mais le champ autour pour avoir la balise a
				oChamp = _JGE(sAliasChamp, document, false, true);
				// Sauf que on ne trouve rien dans le cas des lien simples
				if (!oChamp)
					oChamp = oChampCpy;
				break;
		}
		if (oChamp)
		{
			// Soit on est directement sur le a ou sur le TB autour
			if (oChamp.tagName.toUpperCase() == "TD") oChamp = oChamp.firstChild;
			if (oChamp)
			{
				var sURL = this.sXMLGetValeur(XMLAction);
				// Si le champ est un bouton, il faut faire autrement
				if (oChamp.tagName.toUpperCase() == "INPUT")
				{
					// Normalement son action commence par javascript:_JCL('xxx');
					// Remplacer le premier parametre
					var rPremierParam = new RegExp("\\(\\'([^\\']*)\\'", "");
					var sOnClick = oChamp.getAttributeNode("onclick").value;
					if (rPremierParam.test(sOnClick))
					{
						sOnClick = sOnClick.replace(rPremierParam, function() { return "('" + sURL + "'"; })
						oChamp.onclick = new Function("", sOnClick);
					}
				}
				else
				{
					oChamp.href = sURL;
				}
			}
		}
	},

	// Bulle
	ActionProprieteBulle: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		var sValeur = this.sXMLGetValeur(XMLAction);
		// selon le type du champ
		switch (nTypeChamp)
		{
		case this.XML_CHAMP_TYPE_INTERRUPTEUR:
		case this.XML_CHAMP_TYPE_SELECTEUR:
			// Pour les interrupteurs/selecteurs : on a un tableau d'elements
			var oElements = document.getElementsByName(sAliasChamp);
			if (oElements && oElements.length)
			{
				var i;
				var nLimiteI = oElements.length;
				for (i = 0; i < nLimiteI; i++)
				{
					if (oElements[i]) oElements[i].title = sValeur;
				}
			}
			// On ne fait pas le cas par defaut => sort direct
			return;

			// Cas special des table ou le champ trouve par defaut est le champ cache et pas la racine de la table
		case this.XML_CHAMP_TYPE_TABLE:
			oChamp = this.oGetConteneurParent(sAliasChamp);
			break;

		// Cas special pour les volets d'onglets, on fait manipuler le lien en plus du champ
		case this.XML_CHAMP_TYPE_VOLETONGLET:
			if (oChamp)
			{
				var tabBalisesA = oChamp.getElementsByTagName("a");
				if (tabBalisesA.length)
				{
					tabBalisesA[0].title = sValeur;
				}
			}
			break;

		// On traite le champ bouton specialement : Si c'est un champ image on fait comme les images
		case this.XML_CHAMP_TYPE_BOUTON:
			// On doit aussi manipuler le champ fils si disponible
			if (oChamp.firstChild) oChamp.firstChild.title = sValeur;
			break;
		}

		if (oChamp) oChamp.title = sValeur;
	},

	// CurseurSouris
	ActionProprieteCurseurSouris: function(oChamp, nTypeChamp, XMLAction)
	{
		this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, "cursor", this.sXMLGetValeur(XMLAction), true);
	},

	// PoliceGras
	ActionProprietePoliceGras: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		this.ActionProprieteStylePolice(oChamp, oChampExt, nTypeChamp, sAliasChamp, "fontWeight", parseInt(this.sXMLGetValeur(XMLAction)), true);
	},

	// PoliceItalique
	ActionProprietePoliceItalique: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		this.ActionProprieteStylePolice(oChamp, oChampExt, nTypeChamp, sAliasChamp, "fontStyle", parseInt(this.sXMLGetValeur(XMLAction)) ? "italic" : "normal", true);
	},

	// PoliceNom
	ActionProprietePoliceNom: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		this.ActionProprieteStylePolice(oChamp, oChampExt, nTypeChamp, sAliasChamp, "fontFamily", this.sXMLGetValeur(XMLAction), true);
	},

	// PoliceSoulignee
	ActionProprietePoliceSoulignee: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		this.ActionProprieteStylePolice(oChamp, oChampExt, nTypeChamp, sAliasChamp, "textDecoration", parseInt(this.sXMLGetValeur(XMLAction)) ? "underline" : "none", true);
	},

	// PoliceTaille
	ActionProprietePoliceTaille: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		this.ActionProprieteStylePolice(oChamp, oChampExt, nTypeChamp, sAliasChamp, "fontSize", this.sXMLGetValeur(XMLAction), true);
	},

	// CurseurSouris
	ActionProprieteOpacite: function(oChamp, oChampExt, nTypeChamp, XMLAction)
	{
		var nOpacite = parseInt(this.sXMLGetValeur(XMLAction));
		if (isNaN(nOpacite)) nOpacite = 100;
		if (nOpacite < 0) nOpacite = 0;
		if (nOpacite > 100) nOpacite = 100;

		// selon le type du champ
		switch (nTypeChamp)
		{
		case this.XML_CHAMP_TYPE_PAGECORNEE:
			// Prend le champ interieur
			break;
		default:
			// Prend le champ exterieur
			oChamp = oChampExt;
			break;
		}

		// Selon le navigateur
		if (bIE)
		{	// Manipule les filtres
			if (oChamp)
			{
				var tabFilters = oChamp.filters;
				if (tabFilters.exists("alpha"))
				{
					tabFilters.item("alpha").opacity = nOpacite;
				}
				else if (tabFilters.exists("DXImageTransform.Microsoft.Alpha"))
				{
					tabFilters.item("DXImageTransform.Microsoft.Alpha").opacity = nOpacite;
				}
				else if (oChamp.style)
				{
					oChamp.style.filter += "alpha(opacity=" + nOpacite + ")"
				}
			}
		}
		else
		{	// Autre : manipule opacity sous forme de double

			// oChamp est normalement le conteneur externe du champ
			if (oChamp && oChamp.style) oChamp.style.opacity = (nOpacite / 100) + "";
		}
	},

	// Cadrage horizontal
	ActionProprieteCadrageH: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		this.ActionProprieteStylePolice(oChamp, oChampExt, nTypeChamp, sAliasChamp, "textAlign", this.sXMLGetValeur(XMLAction), true);
	},

	// Cadrage vertical
	ActionProprieteCadrageV: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		this.ActionProprieteStylePolice(oChamp, oChampExt, nTypeChamp, sAliasChamp, "verticalAlign", this.sXMLGetValeur(XMLAction), true);
	},

	// Indication
	ActionProprieteIndication: function(oChamp, nTypeChamp, XMLAction, sAliasChamp)
	{
		// L'indication ne concerne que le champ de saisie
		// Celui-ci n'a pas de PCode serveur AJAX. Il n'a donc pas le focus actuellement (puisqu'un autre champ a declenche l'evenement)

		// Trouve l'objet
		AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sSetProp, [WDChamp.prototype.XML_CHAMP_PROP_NUM_INDICATION, null, this.sXMLGetValeur(XMLAction), oChamp]);
	},

	// Pseudo contenu
	ActionProprieteContenu: function(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp)
	{
		// Appele la methode pre affectation pour liberer les evenements associees car les garbages
		// collector de IE n'arrivent pas a detecter les references circulaires (entre l'objet DOM et
		// l'objet JS) dans ce cas precis. Et au final l'objet n'est pas libere.
		// True : depuis une modification AJAX
		AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sPreAffecteHTML, [true]);

		oChampExt.innerHTML = clWDEncode.sEncodeInnerHTML(this.sXMLGetValeur(XMLAction), false, true);

		// Restaure les evenements
		// True : depuis une modification AJAX
		AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sPostAffecteHTML, [true]);
	},

	// Aplique une propriete (liee a la police) du style sur un champ
	ActionProprieteStylePolice: function(oChamp, oChampExt, nTypeChamp, sAliasChamp, sNomStyle, sValeurProp, bElementsReglette)
	{
		// selon le type du champ
		switch (nTypeChamp)
		{
			// Certains elements du formulaire son impermeable a la police de l'element du dessus (La police est dans le style)
			// Il faut donc appliquer la propriete au champ
			case this.XML_CHAMP_TYPE_SAISIE:
			case this.XML_CHAMP_TYPE_BOUTON:
			case this.XML_CHAMP_TYPE_LISTE:
			case this.XML_CHAMP_TYPE_CHAMPFORMATE:
			case this.XML_CHAMP_TYPE_COMBO:
			case this.XML_CHAMP_TYPE_LIEN:
				// D'autres comme le treeview : il ne faut manipuler un id tres speficique (nom avec un _)
			case this.XML_CHAMP_TYPE_TREEVIEW:
			case this.XML_CHAMP_TYPE_LIBELLE:
				this.ActionProprieteStyleGenerique(oChamp, nTypeChamp, sNomStyle, sValeurProp, bElementsReglette);
				break;

			case this.XML_CHAMP_TYPE_COLONNE:
				// Va modifier le style dans l'entete de la page
				this.ActionProprieteCouleurFeuilleStyle("#c-" + sAliasChamp, sNomStyle, sValeurProp);
				break;

			// Les interrupteurs et les selecteurs sont particulier
			case this.XML_CHAMP_TYPE_INTERRUPTEUR:
			case this.XML_CHAMP_TYPE_SELECTEUR:
				oChampExt = _JGE(oChamp[0].name, document, false, true);
				// Pas de break

			default:
				this.ActionProprieteStyleGenerique(oChampExt, nTypeChamp, sNomStyle, sValeurProp, bElementsReglette);
				break;
		}
	},

	// Aplique une propriete du style sur un champ
	ActionProprieteStyleGenerique: function(oChamp, nTypeChamp, sNomStyle, sValeurProp, bElementsReglette)
	{
		// Si on a pas de champ : fini
		if (!oChamp)
			return;

		// selon le type du champ
		switch (nTypeChamp)
		{
			// Il faut faire de meme pour les liens du chemin de navigation
			case this.XML_CHAMP_TYPE_CHEMINNAV:
			case this.XML_CHAMP_TYPE_PLANSITE:
			case this.XML_CHAMP_TYPE_REGLETTE:
			case this.XML_CHAMP_TYPE_TREEVIEW:
				// Si on demande de traiter les elements de la reglette
				if (bElementsReglette)
				{
					this.ActionProprieteStyleGeneriqueReglette(oChamp, sNomStyle, sValeurProp);
				}
				// Pas de break

			default:
				oChamp.style[sNomStyle] = sValeurProp;
		}
	},

	// Applique une propriete du style sur les liens d'une reglette
	ActionProprieteStyleGeneriqueReglette: function(oReglette, sNomStyle, sValeurProp)
	{
		// Si on a pas de reglette : fini
		if (!oReglette)
			return;

		var tabLiens = oReglette.getElementsByTagName("a");
		var i;
		var nLimiteI = tabLiens.length;
		for (i = 0; i < nLimiteI; i++)
		{
			tabLiens[i].style[sNomStyle] = sValeurProp;
		}
	},

	// Modifie la couleur ou la couleur de fond dans les styles present dans les feuilles de style
	ActionProprieteCouleurFeuilleStyle: function(sRuleName, sNomStyle, sValeurProp)
	{
		// On modifie le style a la racine
		var tabStyles = document.getElementsByTagName("STYLE");
		var i;
		var nLimiteI = tabStyles.length;
		for (i = 0; i < nLimiteI; i++)
		{
			// Pour internet explorer
			if (tabStyles[i].styleSheet)
			{
				var oFeuilleStyle = tabStyles[i].styleSheet;

				// On parcours les sous styles
				var j;
				var nLimiteJ = oFeuilleStyle.rules.length;
				for (j = 0; j < nLimiteJ; j++)
				{
					if (oFeuilleStyle.rules[j].selectorText == sRuleName)
					{
						oFeuilleStyle.rules[j].style[sNomStyle] = sValeurProp;
					}
				}
			}
			// Pour FireFox et autres
			else if (tabStyles[i].sheet)
			{
				var oFeuilleStyle = tabStyles[i].sheet;

				// On parcours les sous styles
				var j;
				var nLimiteJ = oFeuilleStyle.cssRules.length;
				for (j = 0; j < nLimiteJ; j++)
				{
					// On recupere la liste des styles pour voir si notre style y est
					// Comme les styles sont groupes par le moteur selon des styles qui doivent reste identique il sufit de trouver notre style une fois
					// Ici les styles sont groupe donc il faut faire un parsing
					var tabStylesNom = oFeuilleStyle.cssRules[j].selectorText.split(",");
					var k;
					var nLimiteK = tabStylesNom.length;
					for (k = 0; k < nLimiteK; k++)
					{
						if (tabStylesNom[k].replace(/ /g, "") == sRuleName)
						{
							oFeuilleStyle.cssRules[j].style[sNomStyle] = sValeurProp;
						}
					}
				}
			}
		}
	},

	// Execute un code JS sur l'objet
	ActionChampJS: function(oChamp, sAliasChamp, XMLAction)
	{
		if (!oChamp)
		{
			// Essai avec un getElementById
			oChamp = _JGE(sAliasChamp, document);
		}

		if (oChamp)
		{
			eval("oChamp" + this.sXMLGetValeur(XMLAction));
		}
	},

	// Ajoute des options au champ
	ActionChampOptions: function(oChamp, XMLAction)
	{
		// On parcourt les options du champ
		var XMLOption = XMLAction.firstChild;
		while (XMLOption)
		{
			// Selon l'option transmise
			switch (XMLOption.nodeName)
			{
				// Option simple
				default:
				case this.XML_CHAMP_OPTIONS_OPTION:
					// On ajoute l'option
					oChamp.options[oChamp.options.length] = new Option(this.sXMLGetValeur(XMLOption), oChamp.options.length + 1);
					// Il y a un problemes avec les carteres > 127
					oChamp.options[oChamp.options.length - 1].innerHTML = clWDEncode.sEncodeInnerHTML(oChamp.options[oChamp.options.length - 1].innerHTML, false, true);
					break;
				// Liste sature
				case this.XML_CHAMP_SATURATION:
					//assert(oChamp.options.length == 0);
					//assert(!XMLOption.nextSibling);
					// On ajoute l'option
					oChamp.options[oChamp.options.length] = new Option(this.sXMLGetValeur(XMLOption), -1);
					break;
			}
			// Option suivante
			XMLOption = XMLOption.nextSibling;
		}
	},

	// Modifie les lignes d'une table/d'un zone repetee
	ActionChampLignes: function(oChamp, nTypeChamp, XMLAction, sNomChamp)
	{
		// On utilise outerHTML avec IE et les autres methodes avec les autres navigateurs
		var bUtiliseOuterHTML = bIE;

		// On recupere les attributs de la ZR/Table
		// Indice du premier element
		var nDebut = parseInt(this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_LIGNES_DEBUT));
		// Nombre d'element
		var nNombre = parseInt(this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_LIGNES_NOMBRE));
		// Ligne selectionne
		var nSelection = parseInt(this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_LIGNES_SELECTION));
		//asert(nNombre<=nLimite);
		var nNbRuptures = 0;
		if (this.bXMLAttributExiste(XMLAction, this.XML_CHAMP_LIGNES_RUPTURES))
		{
			nNbRuptures = parseInt(this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_LIGNES_RUPTURES));
		}
		// Multicolonnes ?
		var bMultiColonnes = this.bXMLAttributExiste(XMLAction, this.XML_CHAMP_LIGNES_COLONNES);
		var nMultiColonnes = bMultiColonnes ? parseInt(this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_LIGNES_COLONNES)) : 1;

		// Regarde si on doit aussi gerer les styles de la ligne
		var bStyle = this.bXMLAttributExiste(XMLAction, this.XML_CHAMP_LIGNES_STYLE);

		// On recupere le debut actuel
		var nDebutActuel = parseInt(eval("_PAGE_." + sNomChamp + "_DEB").value);
		var nIndiceActuel;

		// On trouve le conteneur des lignes de la table
		// On a deux conteneur : le conteneur parent logique (Souvent une balise TABLE) et le conteneur physique reel
		// qui dans le cas d'une table est une balise TBODY ajoute (+/- automatiquement par le navigateur)
		var oConteneurParent = this.oGetConteneurParent(sNomChamp);
		var oConteneurTBody = this.oGetConteneurTBODY(oConteneurParent);

		// Pour les lignes existantes
		// On a trois cas :
		// - IE + Champ table : on remplace le contenu de la ligne de table par celui renvoye par le moteur
		// - IE + ZR : on remplace l'interieur de la ligne (Exterieur du DIV) de table par celle renvoye par le moteur
		// - Autres : on fait un remplace avec les methodes du DOM

		// Supprime les lignes en trop au debut
		while ((nDebutActuel < nDebut) && this.bSupprimeLigne(sNomChamp, nTypeChamp, nDebutActuel, nNbRuptures, oConteneurParent, oConteneurTBody))
		{
			nDebutActuel++;
		}

		// Ou les lignes en trop apres la fin
		if (nDebutActuel >= nDebut + nNombre)
		{
			while (this.bSupprimeLigne(sNomChamp, nTypeChamp, nDebutActuel, nNbRuptures, oConteneurParent, oConteneurTBody))
			{
				nDebutActuel++;
			}
		}

		// Pour le premier cas on lit d'une fois le outerHTML de la table pour que le traitement soit plus rapide
		// Recupere le contenu du conteneur actuel (Sans espaces ni RC superflus)
		if (bUtiliseOuterHTML)
		{
			// Si on est dans une ZR supprime les rupture AVANT de lire le HTML de la table
			if (nTypeChamp != this.XML_CHAMP_TYPE_TABLE)
			{
				var XMLLigneLoc = XMLAction.firstChild;
				while (XMLLigneLoc)
				{
					// Recupere le numero de la ligne modifiee
					nIndiceActuel = parseInt(this.sXMLGetAttribut(XMLLigneLoc, this.XML_CHAMP_LIGNES_LIGNE_INDICE));

					// On supprime les ruptures de la ligne car sCorps les contient et cree plusieurs balises paralleles
					this.SupprimeRuptures(sNomChamp, nIndiceActuel, nNbRuptures, oConteneurTBody);

					// Ligne suivante
					XMLLigneLoc = XMLLigneLoc.nextSibling;
				}
			}

			// Pas de scope en JS donc sContenuActuelTable existe meme a la sortie du block
			// Dans le cas des ZR extensible en largeur ici on est dans le TD parent
			var sContenuActuelTable;
			if (oConteneurParent.tagName.toLowerCase() == "td")
			{
				sContenuActuelTable = oConteneurParent.innerHTML;
			}
			else
			{
				sContenuActuelTable = oConteneurParent.outerHTML;
			}

			sContenuActuelTable = this.sSansEspace(sContenuActuelTable, true, true, true);
		}

		// On parcourt les lignes du champ
		var XMLLigne;
		for (XMLLigne = XMLAction.firstChild; XMLLigne; XMLLigne = XMLLigne.nextSibling)
		{
			//assert(XMLLigne.nodeName == this.XML_CHAMP_LIGNES_LIGNE);

			// Recupere le numero de la ligne modifiee
			nIndiceActuel = parseInt(this.sXMLGetAttribut(XMLLigne, this.XML_CHAMP_LIGNES_LIGNE_INDICE));

			// On trouve la ligne actuelle avec l'ID actuel
			var oLigne = this.oGetConteneurLigne(sNomChamp, nIndiceActuel, oConteneurTBody);

			// Recupere les trois partie de la ligne
			// Optimisation : dans certains cas, si debut et fin sont vide, seule la balise corps est transmise
			var bCorpsSeul = XMLLigne.childNodes.length == 1;
			//assert(XMLLigne.childNodes[0].nodeName==this.XML_CHAMP_LIGNES_LIGNE_DEBUT);
			var sDebut = bCorpsSeul ? "" : clWDEncode.sEncodeInnerHTML(this.sXMLGetValeur(XMLLigne.childNodes[0]), false, true);
			//assert(XMLLigne.childNodes[1].nodeName==this.XML_CHAMP_LIGNES_LIGNE_CORPS);
			var sCorps = clWDEncode.sEncodeInnerHTML(this.sXMLGetValeur(XMLLigne.childNodes[bCorpsSeul ? 0 : 1]), false, true);
			//assert(XMLLigne.childNodes[2].nodeName==this.XML_CHAMP_LIGNES_LIGNE_FIN);
			var sFin = bCorpsSeul ? "" : clWDEncode.sEncodeInnerHTML(this.sXMLGetValeur(XMLLigne.childNodes[2]), false, true);

			var bInvisible = this.bXMLGetAttributSafe(XMLLigne, this.XML_CHAMP_LIGNES_LIGNE_INVISIBLE);

			if (!bInvisible && !oLigne)
			{
				// Si la ligne n'est pas masque mais que elle n'existe pas et est inseree au millieu
				var oLigneSuivante = null;
				var nLigneSuivante;
				var nLimiteLigneSuivante = nDebut + nNombre;
				for (nLigneSuivante = nIndiceActuel + 1; (nLigneSuivante < nLimiteLigneSuivante) && (!oLigneSuivante); nLigneSuivante++)
				{
					oLigneSuivante = this.oGetConteneurLigne(sNomChamp, nLigneSuivante, oConteneurTBody);
				}
				if (oLigneSuivante)
				{
					// Une ligne existe, il faut ajouter le html avant cette ligne
					if (bUtiliseOuterHTML)
					{
						// Si on peux utiliser outerHTML
						var sContenuLigneSuivante = oLigneSuivante.outerHTML;
						sContenuLigneSuivante = this.sSansEspace(sContenuLigneSuivante, true, true, true);

						// Et la position de la ligne suivante dans cette table
						// Cela fonctionne car on a vire les espaces et RC que les navigateur ajoutes
						var nPositionLigneSuivante = sContenuActuelTable.indexOf(sContenuLigneSuivante);
						sContenuActuelTable = sContenuActuelTable.substring(0, nPositionLigneSuivante) + sDebut + sCorps + sFin + sContenuActuelTable.substring(nPositionLigneSuivante);
					}
					else
					{
						// Pour les autres navigateur
						var oRange = document.createRange(); // Pas disponible pour IE donc pas d'unification possible
						oRange.setStartBefore(oLigneSuivante);
						oLigneSuivante.parentNode.insertBefore(oRange.createContextualFragment(sDebut + sCorps + sFin), oLigneSuivante);
					}
					// Et ne plus faire la suite du traitement
					continue;
				}
			}

			// Si on trouve la ligne : on change uniquement son HTML
			if (oLigne)
			{
				// Si on peux utiliser outerHTML
				if (bUtiliseOuterHTML)
				{
					if (bInvisible)
					{
						sDebut = "";
						sCorps = "";
						sFin = "";
					}

					// Pour IE
					// Et de la ligne actuelle (Sans espaces ni RC superflus)
					var sContenuActuelLigne = oLigne.outerHTML;
					sContenuActuelLigne = this.sSansEspace(sContenuActuelLigne, true, true, true);

					// Et la position de la ligne actuelle dans cette table
					// Cela fonctionne car on a vire les espaces et RC que les navigateur ajoutes
					var nPositionActuelleLigne = sContenuActuelTable.indexOf(sContenuActuelLigne);
					var nTailleActuelleLigne = sContenuActuelLigne.length;
					// Si on est dans le cas d'un multicolonne et que l'on va doubler les balise de debut et de fin : les supprimes
					var sContenuFinal = sDebut + sCorps + sFin;
					var sDebutContenu = sContenuFinal.substr(0, 4).toLowerCase();
					if ((sDebutContenu == "<tr>") && (sDebutContenu == sContenuActuelTable.substr(nPositionActuelleLigne - 4, 4).toLowerCase()))
					{
						nPositionActuelleLigne -= 4;
						nTailleActuelleLigne += 4;
					}
					var sDebutContenu = sContenuFinal.substr(0, 9).toLowerCase();
					if ((sDebutContenu == "</tr><tr>") && (sDebutContenu == sContenuActuelTable.substr(nPositionActuelleLigne - 9, 9).toLowerCase()))
					{
						nPositionActuelleLigne -= 9;
						nTailleActuelleLigne += 9;
					}
					var sFinContenu = sContenuFinal.substr(sContenuFinal.length - 5, 5).toLowerCase();
					if ((sFinContenu == "</tr>") && (sFinContenu == sContenuActuelTable.substr(nPositionActuelleLigne + nTailleActuelleLigne, 5).toLowerCase()))
					{
						nTailleActuelleLigne += 5;
					}
					else
					{
						if (sContenuActuelLigne.substr(nTailleActuelleLigne - 5, 5).toLowerCase() == "</tr>")
						{
							// Ne supprime pas le dernier </tr> (cest que l'on est sur la derniere ligne). On en a besoin pour fermer la table)
							nTailleActuelleLigne -= 5;
						}
					}

					// Et remplace cette ligne
					sContenuActuelTable = sContenuActuelTable.substring(0, nPositionActuelleLigne) + sContenuFinal + sContenuActuelTable.substring(nPositionActuelleLigne + nTailleActuelleLigne);
				}
				else
				{	// Pour les autres navigateur

					// On ne va ecrire que le corps
					oLigne = oGetId(sNomChamp + "_" + nIndiceActuel);


					// On supprime les ruptures de la ligne car sCorps les contient et cree plusieurs balises paralleles
					if (nTypeChamp != this.XML_CHAMP_TYPE_TABLE)
					{
						this.SupprimeRuptures(sNomChamp, nIndiceActuel, nNbRuptures, oConteneurTBody);
					}

					// Si on demande la suppression de la ligne
					if (bInvisible)
					{
						var oLigneParent = oLigne.parentNode;
						if ((oLigne.tagName.toLowerCase() == "div") && (oLigneParent.tagName.toLowerCase() == "td"))
						{
							var oLigneParentParent = oLigneParent.parentNode;
							oLigneParentParent.parentNode.removeChild(oLigneParentParent);
						}
						else
						{
							oLigneParent.removeChild(oLigne);
						}
					}
					else if (oLigne.parentNode.childNodes.length == 1)
					{
						// Optim ?
						oLigne.parentNode.innerHTML = sCorps;
					}
					else
					{
						// Pour les autres navigateur
						var oRange = document.createRange(); // Pas disponible pour IE donc pas d'unification possible
						oRange.setStartBefore(oLigne);
						oLigne.parentNode.replaceChild(oRange.createContextualFragment(sCorps), oLigne);
					}
					// Recupere le TBODY nouvellement cree si besoin
					if (oConteneurParent == oConteneurTBody)
					{
						oConteneurParent = this.oGetConteneurParent(sNomChamp);
						oConteneurTBody = this.oGetConteneurTBODY(oConteneurParent);
					}
				}
			}
			else
			{
				// On ne trouve pas la ligne : on doit donc la creer
				// On ajoute un voisin a la derniere ligne
				if (bIE)
				{	// Pour IE

					// insertAdjacentHTML ne marche pas sur les balises <TABLE> et <TBODY>
					if ((oConteneurTBody != oConteneurParent) && (oConteneurTBody))
					{
						// Si on n'a pas encore sContenuActuelTable on le recupere
						// Possible car on passe aussi ici pour les ZRs
						if (!sContenuActuelTable)
						{
							sContenuActuelTable = oConteneurParent.outerHTML;
							sContenuActuelTable = this.sSansEspace(sContenuActuelTable, true, true, true);
						}

						//assert(oConteneurParent.tagName.toUpperCase() == "TABLE");
						//assert(oConteneurTBody.tagName.toUpperCase() == "TBODY"))
						// Normalement la zone ce fini par </TABLE>
						//assert(sContenuTable.substr(sContenuTable.length - oConteneurParent.tagName.toUpperCase().length) == "</TABLE>")
						if (sContenuActuelTable.substr(sContenuActuelTable.length - "</TABLE>".length).toUpperCase() == "</TABLE>")
						{
							// Si on est multicolonne => Utile <TD>
							if (bMultiColonnes)
							{
								var nPosTR = sContenuActuelTable.toUpperCase().lastIndexOf("</TR>");
								// Si on ne trouve pas de TR : il n'y a pas de ligne dans la ZR
								if (nPosTR == -1)
								{
									var nPosTBody = sContenuActuelTable.toUpperCase().lastIndexOf("</TBODY>");
									// Supprime le </TD> en trop au debut de la ligne
									if (sDebut.toUpperCase().indexOf("</TR>") == 0)
									{
										sDebut = sDebut.substring("</TR>".length);
									}
									else if (sCorps.toUpperCase().indexOf("</TR>") == 0)
									{
										sCorps = sCorps.substring("</TR>".length);
									}
									if ((sFin.toUpperCase().lastIndexOf("</TR>") != (sFin.length - "</TR>".length)) && (sCorps.toUpperCase().lastIndexOf("</TR>") != (sCorps.length - "</TR>".length)))
									{
										sFin += "</TR>";
									}
									sContenuActuelTable = sContenuActuelTable.substring(0, nPosTBody) + sDebut + sCorps + sFin + sContenuActuelTable.substring(nPosTBody);
								}
								else
								{
									sContenuActuelTable = sContenuActuelTable.substring(0, nPosTR) + sDebut + sCorps + sFin + sContenuActuelTable.substring(nPosTR);
								}
							}
							else
							{
								var nPosTBody = sContenuActuelTable.toUpperCase().lastIndexOf("</TBODY>");
								sContenuActuelTable = sContenuActuelTable.substring(0, nPosTBody) + sDebut + sCorps + sFin + sContenuActuelTable.substring(nPosTBody);
							}
						}
						else
						{
							sContenuActuelTable += sDebut + sCorps + sFin + oConteneurParent.tagName;
						}
					}
					else
					{
						// Chrome est le seul a ne pas inserer un TBody
						var sLigne = sDebut + sCorps + sFin;
						// Ce code est normalement inutile, seul IE base dans cette branche
						if (bWK)
						{
							// Si on est dans une ZR multicolonne et que l'on n'est pas sur le debut de la colonne, ce code ne fonctionne pas avec chrome
							// Il faut prendre la derniere ligne du tableau
							if (sLigne.substr(0, 3).toLowerCase() == "<td")
							{
								oConteneurTBody = oConteneurTBody.lastChild;
							}
							else if (sLigne.substr(0, 5).toLowerCase() == "</tr>")
							{
								sLigne = sLigne.substr(5);
							}
						}

						oConteneurTBody.insertAdjacentHTML("beforeEnd", sLigne);
						// Met a jour le conteneur parent
						oConteneurParent = this.oGetConteneurParent(sNomChamp);
						oConteneurTBody = this.oGetConteneurTBODY(oConteneurParent);
					}
				}
				else
				{	// Pour les autres navigateur
					var oRange = document.createRange();
					if (bMultiColonnes && ((nIndiceActuel % nMultiColonnes) != 1))
					{
						oRange.setStart(oConteneurTBody.lastChild, 0);
						oConteneurTBody.lastChild.appendChild(oRange.createContextualFragment(sDebut + sCorps + sFin));
					}
					else
					{
						oRange.setStart(oConteneurTBody, 0);
						oConteneurTBody.appendChild(oRange.createContextualFragment(sDebut + sCorps + sFin));
					}

					// Recupere le TBODY nouvellement cree si besoin
					if (oConteneurParent == oConteneurTBody)
					{
						oConteneurParent = this.oGetConteneurParent(sNomChamp);
						oConteneurTBody = this.oGetConteneurTBODY(oConteneurParent);
					}
				}
			}

			// Change le(s) style(s) de la ligne si besoin

			// Si on a une quatrieme node fille c'est que l'on a un style a modifie pour la ligne
			//assert((!bStyle) || (XMLLigne.childNodes.length >= 4));
			//assert((!bStyle) || (XMLLigne.childNodes[3].nodeName==this.XML_CHAMP_LIGNES_LIGNE_STYLE));
			if (bStyle)
			{
				this.ActionLigneStyle(this.sXMLGetValeur(XMLLigne.childNodes[3]));
			}
		}

		// Met a jour le conteneur parent si besoin
		if (sContenuActuelTable)
		{
			// Dans le cas des ZR extensible en largeur ici on est dans le TD parent
			if (oConteneurParent.tagName == "TD")
			{
				oConteneurParent.innerHTML = sContenuActuelTable;
			}
			else
			{
				oConteneurParent.outerHTML = sContenuActuelTable;
			}
			oConteneurParent = this.oGetConteneurParent(sNomChamp);
			oConteneurTBody = this.oGetConteneurTBODY(oConteneurParent);
		}

		// Supprime les lignes en trop a la fin pour le cas ou les deux plages d'incides se recoupaient
		nIndiceActuel = nDebut + nNombre;
		while (this.bSupprimeLigne(sNomChamp, nTypeChamp, nIndiceActuel, nNbRuptures, oConteneurParent, oConteneurTBody))
		{
			nIndiceActuel++;
		}

		// Il y a des problemes si on vide tout dans firefox et co et que l'on vide la table
		if ((!bUtiliseOuterHTML) && (nNombre == 0) && (oConteneurTBody != oConteneurParent) && (oConteneurTBody.childNodes.length == 0))
		{
			SupprimeFils(oConteneurParent);
		}

		// Met les valeurs dans les champs cache
		eval("_PAGE_." + sNomChamp + "_DEB").value = nDebut;
		eval("_PAGE_._" + sNomChamp + "_OCC").value = nNombre;
		if (nSelection >= 0) oChamp.value = nSelection;
	},

	// Recoit un bout de CSS et l'ajoute dans la page
	// Pour optimiser les choses : si un style est vide on le degage
	ActionLigneStyle: function(sStyle)
	{
		// sTyle est un bout de CSS de la forme
		// #ID1, #ID2, ...	{ style1 }
		// #ID3, ...		{ style2 }
		// etc
		// Il peut y avoir des {} vide au milieu

		// Donc pour le parsing on decoupe d'abord selon les }
		var tabNouveauxStyles = sStyle.split("}");
		// tabNouveauxStyles contient un tableau de lignes de la forme
		// #ID1, #ID2, ...	{ style1			<= split a fait partir le } final

		// On va maintenant traiter les lignes individuelles
		var i;
		var nLimiteI = tabNouveauxStyles.length;
		for (i = 0; i < nLimiteI; i++)
		{
			this._ActionLigneStyleLigne(tabNouveauxStyles[i]);
		}
	},

	// Recoit une ligne de CSS et l'ajoute dans la page
	// Pour optimiser les choses : si un style est vide on le degage
	_ActionLigneStyleLigne: function(sLigneStyle)
	{
		var nDebutTexteStyle = sLigneStyle.indexOf("{");
		//assert(nDebutTexteStyle <= 0);
		// Par securite si pas de style (-1) ou pas de nom de style (0) on boucle
		if (nDebutTexteStyle <= 0)
			return;

		// On decoupe le nom des styles et le contenu du style
		var sNomsStyle = sLigneStyle.substring(0, nDebutTexteStyle);
		var sTexteStyle = sLigneStyle.substring(nDebutTexteStyle + 1);

		// On vire les espaces/tabulations/RC du debut et de la fin du style comme ca si on decouvre que le style est vide on va
		// optimiser en n'en creant pas un autres
		sTexteStyle = this.sTrim(sTexteStyle, true, true, true);

		// La feuille de style par defaut pour l'ajout
		var oStyle = document.getElementsByTagName("STYLE");
		var oStyleSheetDefaut = oStyle[0].styleSheet ? oStyle[0].styleSheet : oStyle[0].sheet;

		// Puis on decoupe les noms de styles selon le separateur ","
		var tabNomsStyle = sNomsStyle.split(",");

		// Et on les traites
		var i;
		var nLimiteI = tabNomsStyle.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var sNomStyle = this.sTrim(tabNomsStyle[i]);
			sNomStyle = sNomStyle.replace(/[\r\n]/g, "");
			// Si le nom du style est vide ou sans nom : on ignore ce nom de style
			if ((sNomStyle.legnth == 0) || (sNomStyle == "#"))
			{
				//assert(false);
				continue;
			}

			// Puis on modifie le style
			// Supprime l'ancien style
			var oStyleSheet = this._oActionSupprimeStyle(sNomStyle);
			// Et recree le nouveau si le texte du style est non vide
			if (sTexteStyle.length > 0)
			{	// On recre si possible le style dans la feuille de style ou on l'a supprimer
				this._ActionCreerStyle(sNomStyle, sTexteStyle, oStyleSheet ? oStyleSheet : oStyleSheetDefaut);
			}
		}
	},

	// Supprime l'ancien style portant le nom et le recree si besoin
	_oActionSupprimeStyle: function(sNomStyle)
	{
		// Recherche et supprime le style existant si besoin
		var tabStyles = document.getElementsByTagName("STYLE");
		//assert(tabStyles.length==1);
		var i;
		var nLimiteI = tabStyles.length;
		for (i = 0; i < nLimiteI; i++)
		{
			// Pour internet explorer
			if (tabStyles[i].styleSheet)
			{
				var oFeuilleStyle = tabStyles[i].styleSheet;

				// On parcours les sous styles
				var j;
				var nLimiteJ = oFeuilleStyle.rules.length;
				for (j = 0; j < nLimiteJ; j++)
				{
					if (oFeuilleStyle.rules[j].selectorText == sNomStyle)
					{
						oFeuilleStyle.removeRule(j);
						// Comme on a supprimer une regle : on recule d'un cran sinon j+1 qui est devenu j n'est pas teste
						j--;
						nLimiteJ--;
					}
				}
			}
			// Pour FireFox et autres
			else if (tabStyles[i].sheet)
			{
				var oFeuilleStyle = tabStyles[i].sheet;

				// On parcours les sous styles
				var j;
				var nLimiteJ = oFeuilleStyle.cssRules.length;
				for (j = 0; j < nLimiteJ; j++)
				{
					// On recupere la liste des styles pour voir si notre style y est
					// Comme les styles sont groupes par le moteur selon des styles qui doivent reste identique il sufit de trouver notre style une fois
					// Ici les styles sont groupe donc il faut faire un parsing
					var tabStylesNom = oFeuilleStyle.cssRules[j].selectorText.split(",");
					var k;
					var nLimiteK = tabStylesNom.length;
					for (k = 0; k < nLimiteK; k++)
					{
						// Enleve les espaces abusif
						tabStylesNom[k] = tabStylesNom[k].replace(/ /g, "");
						if (tabStylesNom[k] == sNomStyle)
						{
							// Les regles ne sont pas factorisee par le moteur donc si on en supprime une on peu supprime aussi toutes ses
							// voisines
							oFeuilleStyle.deleteRule(j);
							// Comme on a supprimer une regle : on recule d'un cran sinon j+1 qui est devenu j n'est pas teste
							j--;
							nLimiteJ--;
							break;
						}
					}
				}
			}
		}
	},

	// Cree un style dans le feuille de style donnee
	_ActionCreerStyle: function(sNomStyle, sTexteStyle, oStyleSheet)
	{
		// Ajoute un style dans la feuille de style donnee
		if (oStyleSheet.addRule)
		{	// Pour internet explorer
			oStyleSheet.addRule(sNomStyle, sTexteStyle);
		}
		else
		{
			//assert(oStyleSheet.insertRule)
			oStyleSheet.insertRule(sNomStyle + " {" + sTexteStyle + "}", oStyleSheet.length);
		}
	},

	// Contenu d'un TV
	ActionChampTreeview: function(oChamp, XMLAction, sAliasChamp)
	{
		// Recupere les sous parties

		// Selection en cours
		//assert(XMLAction.childNodes[0].nodeName == this.XML_CHAMP_TREEVIEW_SELECT);
		document.getElementsByName(sAliasChamp + "_AS")[0].value = this.sXMLGetValeur(XMLAction.childNodes[0]);

		// Noeuds deroules
		//assert(XMLAction.childNodes[1].nodeName == this.XML_CHAMP_TREEVIEW_DEROULE);
		document.getElementsByName(sAliasChamp)[0].value = this.sXMLGetValeur(XMLAction.childNodes[1]);
		//assert(XMLAction.childNodes[2].nodeName == this.XML_CHAMP_TREEVIEW_DEROULETAB);
		var sNex = this.sXMLGetValeur(XMLAction.childNodes[2]);
		document.getElementsByName("NEX_" + sAliasChamp)[0].value = sNex;
		// Il faut aussi mettre a jour la variable globale avec les elements deroules
		window["oItems_" + sAliasChamp] = sNex.split(',');

		// Contenu des noeuds
		//assert(XMLAction.childNodes[3].nodeName == this.XML_CHAMP_TREEVIEW_NOEUDS);
		var oContenu = oGetId(sAliasChamp + "_");
		oContenu.innerHTML = clWDEncode.sEncodeInnerHTML(this.sXMLGetValeur(XMLAction.childNodes[3]), false, true);
	},

	// Rechargement d'une image dynamique
	ActionChampRecharge: function(oChamp, XMLAction)
	{
		// Si on recoit un parametre de commande : l'ecrit dans la classe
		if (this.bXMLAttributExiste(XMLAction, this.XML_CHAMP_RECHARGE_PARAM))
		{
			AppelMethodeChamp(oChamp.name, WDChamp.prototype.ms_sDeduitParam, [this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_RECHARGE_PARAM)]);
		}

		// Recherche le parametre anticache du champ image
		var rNoCache = new RegExp("(" + oChamp.name + "\\=)(\\d+)", "i");
		var sUrlImage = oChamp.src;
		if (rNoCache.test(sUrlImage))
		{
			oChamp.src = sUrlImage.replace(rNoCache, function(sExp, s1, s2) { return s1 + (parseInt(s2) + 1); });
		}
		else
		{
			// Recherche un parametre sans option
			var rNoCacheVide = new RegExp("(" + oChamp.name + "\=)([^\d]|$)", "i");
			if (rNoCacheVide.test(sUrlImage))
			{
				oChamp.src = sUrlImage.replace(rNoCacheVide, function(sExp, s1, s2) { return s1 + (new Date()).getTime() + s2; });
			}
		}
	},

	// Rechargement d'une table AJAX
	ActionChampRefresh: function(sAliasChamp, XMLAction)
	{
		var nReset = this.nXMLGetAttributSafe(XMLAction, this.XML_CHAMP_REFRESH_RESETTABLE, 0);
		var sNouveauDebut = this.sXMLGetAttributSafe(XMLAction, this.XML_CHAMP_REFRESH_DEBUT, "");
		var nNouveauDebut = -1;
		var sCleNouveauDebut;
		if ((sNouveauDebut != "") && (!isNaN(parseInt(sNouveauDebut))))
		{
			nNouveauDebut = parseInt(sNouveauDebut);
			if (sNouveauDebut.indexOf(";") > -1)
			{
				sCleNouveauDebut = sNouveauDebut.substring(sNouveauDebut.indexOf(";") + 1);
			}
		}
		AppelMethodeChamp(sAliasChamp, WDChamp.prototype.ms_sRefresh, [nReset, nNouveauDebut, sCleNouveauDebut]);
	},

	// execute les actions sur les champs
	ActionChamp: function(oPage, XMLChamp)
	{
		// on recupere l'alias du champ
		var sAliasChamp = this.sXMLGetAttribut(XMLChamp, this.XML_CHAMP_ATT_ALIAS);
		// on recupere le type du champ
		var nTypeChamp = parseInt(this.sXMLGetAttribut(XMLChamp, this.XML_CHAMP_ATT_TYPE));
		// on cherche le champ
		var oChamp = this.oChercheChamp(oPage, sAliasChamp, nTypeChamp);
		var oChampExt = this.oChercheChamp(oPage, sAliasChamp, nTypeChamp, true, false);
		var XMLAction = XMLChamp.firstChild;
		while (XMLAction != null)
		{	// selon le type d'action
			switch (XMLAction.nodeName)
			{	// propriete
				case this.XML_CHAMP_PROP:
					{	// selon la propriete
						switch (parseInt(this.sXMLGetAttribut(XMLAction, this.XML_CHAMP_PROP_ATT_NUM)))
						{
							// Valeur affiche => Valeur
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_VALEURAFFICHEE:
								// Valeur
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_VALEUR: this.ActionProprieteValeur(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// Libelle
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_LIBELLE: this.ActionProprieteLibelle(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// Hauteur
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_HAUTEUR: if (oChamp) this.ActionProprieteHauteur(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// Largeur
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_LARGEUR: if (oChamp) this.ActionProprieteLargueur(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// Couleur
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_COULEUR: this.ActionProprieteCouleur(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// Couleur de fond. Comme on peu manipuler la couleur de fond de la page
							// le test d'existantce de oChamp est deporte dans ActionProprieteCouleurFond
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_COULEURFOND: this.ActionProprieteCouleurFond(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// Etat d'un champ
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_ETAT: this.ActionProprieteEtat(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// Visibilite : manipule la partie externe du champ
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_VISIBLE: this.ActionProprieteVisible(oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// Image
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_IMAGE: if (oChamp) this.ActionProprieteImage(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// URL. pas de test de l'existence du champ car on va recherche la balise autour du champ
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_URL: this.ActionProprieteURL(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// Bulle
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_BULLE: this.ActionProprieteBulle(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// X
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_X:
								// Prend le 'vrai' champ exterieur
								oChampExt = this.oChercheChamp(oPage, sAliasChamp, nTypeChamp, true, true);
								this.ActionProprieteX(oChampExt, nTypeChamp, XMLAction); break;
							// Y
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_Y:
								// Prend le 'vrai' champ exterieur
								oChampExt = this.oChercheChamp(oPage, sAliasChamp, nTypeChamp, true, true);
								this.ActionProprieteY(oChampExt, nTypeChamp, XMLAction); break;
							// CurseurSouris
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_CURSEURSOURIS: this.ActionProprieteCurseurSouris(oChampExt, nTypeChamp, XMLAction); break;
							// PoliceGras
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICEGRAS: this.ActionProprietePoliceGras(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// PoliceItalique
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICEITALIQUE: this.ActionProprietePoliceItalique(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// PoliceNom
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICENOM: this.ActionProprietePoliceNom(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// PoliceSoulignee
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICESOULIGNE: this.ActionProprietePoliceSoulignee(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// PoliceTaille
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_POLICETAILLE: this.ActionProprietePoliceTaille(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// Opacite
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_OPACITE: this.ActionProprieteOpacite(oChamp, oChampExt, nTypeChamp, XMLAction); break;
							// Cadrage horizontal
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_CADRAGEH: this.ActionProprieteCadrageH(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// Cadrage vertical
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_CADRAGEV: this.ActionProprieteCadrageV(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
							// Indication
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_INDICATION: this.ActionProprieteIndication(oChamp, nTypeChamp, XMLAction, sAliasChamp); break;
							// Pseudo contenu
							case WDChamp.prototype.XML_CHAMP_PROP_NUM_CONTENU: this.ActionProprieteContenu(oChamp, oChampExt, nTypeChamp, XMLAction, sAliasChamp); break;
						}
						break;
					}
					// Code JS a executer sur l'objet
				case this.XML_CHAMP_JS: this.ActionChampJS(oChamp, sAliasChamp, XMLAction); break;
				// Options a ajouter a l'objet
				case this.XML_CHAMP_OPTIONS: if (oChamp) this.ActionChampOptions(oChamp, XMLAction); break;
				// Lignes d'une table/ZR
				case this.XML_CHAMP_LIGNES:
					if (oChamp)
					{
						this.ActionChampLignes(oChamp, nTypeChamp, XMLAction, sAliasChamp);
						// Avec IE, on manipule la propriete outerHTML donc l'objet DOM change et oChamp et oChampExt deviennent invalides
						oChamp = this.oChercheChamp(oPage, sAliasChamp, nTypeChamp);
						oChampExt = this.oChercheChamp(oPage, sAliasChamp, nTypeChamp, true);
					}
					break;
				// Contenu d'un TV
				case this.XML_CHAMP_TREEVIEW: this.ActionChampTreeview(oChamp, XMLAction, sAliasChamp); break;
				// Rechargement d'une image dynamique
				case this.XML_CHAMP_RECHARGE: if (oChamp) this.ActionChampRecharge(oChamp, XMLAction); break;
				// Rafraichisement d'une table AJAX
				case this.XML_CHAMP_REFRESH: this.ActionChampRefresh(sAliasChamp, XMLAction); break;
			}
			// on passe a l'action suivante
			XMLAction = XMLAction.nextSibling;
		}
	},

	// execute les actions JS simple
	ActionJS: function(oPage, XMLAction)
	{	// On recupere le code JS a executer
		var sCodeJS = unescape(this.sXMLGetValeur(XMLAction));
		// Execute le code JS
		// Si on est en encodage latin-1 (Donc pas en UTF-8) : On encode les caracteres > 127
		// Pas besoin de le faire en UTF-8 car il on deja ete encode pour avoir au final la bonne valeur unicode
		eval(clWDEncode.sEncodeCharset(sCodeJS, false));
	},

	// Execute une redirection
	ActionRedirection: function(oPage, XMLAction)
	{
		// On recupere la redirection
		var sRedirection = this.sXMLGetValeur(XMLAction);
		// Execute la redirection
		document.location.replace(unescape(sRedirection));
	},

	// Affiche une trace
	ActionTrace: function(oPage, XMLAction, bAjout)
	{
		// Recherche la zone de trace dans la page
		var oDivTrace = _JGE(this.XML_TRACE_ID, document);

		// Recupere la valeur de la trace
		var sTrace = this.sXMLGetValeur(XMLAction);

		// Si besoin calcule la trace precedente pour faire une concatenation
		var sTracePrecedente = "";

		// Supprime les traces du premier affichage
		var oOldTrace = _JGE(this.XML_WBTRACE_ID, document);
		while (oOldTrace)
		{
			// Ajoute le texte a la trace precedente si besoin
			if (bAjout)
			{
				sTracePrecedente += ((sTracePrecedente.length > 0) ? "\r\n" : "") + _JCIR(oOldTrace);
			}
			// Supprime la zone de trace
			oOldTrace.parentNode.removeChild(oOldTrace);
			oOldTrace = _JGE(this.XML_WBTRACE_ID, document)
		}

		// Si besoin ajoute aussi le contenu courante de la trace
		if (bAjout)
		{
			if (oDivTrace)
			{
				sTracePrecedente += ((sTracePrecedente.length > 0) ? "\r\n" : "") + _JCIR(oDivTrace);
			}
			sTrace = sTracePrecedente + ((sTracePrecedente.length > 0) && (sTrace.length > 0) ? "\r\n" : "") + sTrace;
		}

		// Si la trace est vide : on supprime la zone de trace si besoin
		if ((sTrace + "").length == 0)
		{
			// Si la zone existe => La supprime
			if (oDivTrace)
			{
				// La supprime
				oDivTrace.parentNode.removeChild(oDivTrace);
			}
			// Fin du traitement
			return;
		}

		// Si la zone n'existe pas : la cree
		if (!oDivTrace)
		{
			// Cree dynamiquement un formulaire dans la cellule
			var oDivTrace = document.createElement("DIV");
			oDivTrace.id = this.XML_TRACE_ID;
			oDivTrace.style.width = 1024;
			oDivTrace.style.backgroundColor = "#FFFF00";
			oDivTrace.style.fontFamily = "Courier New,Courier,mono";
			oDivTrace.style.fontSize = "small";

			// Ajoute la zone a la page
			var oPremier = document.body.firstChild;
			if (oPremier)
			{
				oDivTrace = document.body.insertBefore(oDivTrace, oPremier);
			}
			else
			{
				oDivTrace = document.body.insertBefore(oDivTrace);
			}
		}
		// Affecte le texte dans la zone en effectuant la conversion
		oDivTrace.innerHTML = clWDEncode.sEncodeInnerHTML(sTrace, true);
	},

	// execute les actions
	// oObjet : Selon la requete => objet formulaire, objet table (Ou objet cache de la table)
	bActionXML: function(oPage, oObjet, oXML)
	{	// on recupere la racine
		var oXMLListeRacine = oXML.getElementsByTagName(this.XML_RACINE);
		if (oXMLListeRacine)
		{
			var oXMLRacine = oXMLListeRacine ? oXMLListeRacine[0] : null;
			if (oXMLRacine)
			{
				// Lance le parcours des actions a effectuer
				var oXMLAction = oXMLRacine.firstChild;
				// Si on est dans la MAJ d'une table => ajout a la trace precedente
				var bMAJTable = false;
				var oXMLTrace = null;
				while (oXMLAction)
				{
					// Selon le type d'action
					switch (oXMLAction.nodeName)
					{
						// Champ
						case this.XML_CHAMP: this.ActionChamp(oPage, oXMLAction); break;
						// Code js pur
						case this.XML_JS: this.ActionJS(oPage, oXMLAction); break;
						// Redirection
						case this.XML_REDIR: this.ActionRedirection(oPage, oXMLAction); break;
						// Gestion du cache des tables
						case this.XML_LISTE:
							oObjet.ActionListe(oXMLAction);
							bMAJTable = true;
							break;
						// Affichage de traces
						case this.XML_TRACE:
							oXMLTrace = oXMLAction;
							break;
					}
					// Passe au fils suivant
					oXMLAction = oXMLAction.nextSibling;
				}

				// Si on a une trace l'affiche
				if (oXMLTrace)
				{
					this.ActionTrace(oPage, oXMLTrace, bMAJTable);
				}
				return true;
			}
		}
		return false;
	},

	ErreurAJAX: function()
	{
		// Ici requete au serveur qui indique que le navigateur ne supporte pas les appels AJAX

		// L'action sans les parametres
		var sAction = sGetPageAction(null, true);
		// Ajout de la commande d'erreur
		sAction += "?" + this.sCommandeAjax_Erreur;
		// Et remplacement de la page courante
		document.location = sAction;
	},

	// Execute le code serveur d'un champ
	AJAXExecuteEvenement: function(oPage, sChamp, nEvenement, nOption)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return;

		// Si l'AJAX n'est pas disponible
		if (!this.AJAXDisponible())
		{
			// On utilise la methode normale
			this.NormalExecuteEvenement(oPage, sChamp, nEvenement, nOption);
			return;
		}

		// Empile la requete
		// Assert(this.m_tabRequetes.length == 0);
		var stRequete = new Object();
		stRequete.oPage = oPage;
		stRequete.sChamp = sChamp;
		stRequete.nEvenement = nEvenement;
		stRequete.nOption = nOption;
		this.m_tabRequetes.push(stRequete);

		// Force le reaffichage de l'activite AJAX
		this.ReactualiseActivite(true);

		// Et demande le traitement de l'evenement
		// Permet de ne pas bloquer l'affichage (Fermeture des combos)
		if (this.m_nSetTimeout_AJAX === undefined)
		{
			this.m_nSetTimeout_AJAX = setTimeout("clWDAJAXMain.TraiteAJAXExecuteEvenement();", 1);
		}
	},

	// Traite les evenements AJAX en attente
	TraiteAJAXExecuteEvenement: function()
	{
		delete this.m_nSetTimeout_AJAX;

		// Supprime le reaffichage de l'activite AJAX
		this.ReactualiseActivite(false);

		// Assert(this.m_tabRequetes.length == 1);
		// Tant que l'on a des requetes
		while (this.m_tabRequetes.length > 0)
		{
			// Recupere la requete
			var stRequete = this.m_tabRequetes[0];
			// Vire la requete de la liste
			this.m_tabRequetes.shift();
			// Traite la requete
			var bRes = this.bAJAXExecuteEvenementInterne(stRequete.oPage, stRequete.sChamp, stRequete.nEvenement, stRequete.nOption);

			// Et sort direct si on est en erreur
			if (!bRes) this.m_tabRequetes.length = 0;
			// Mode special pour le SILO, les requetes sont 'synchrones'
			if (this.m_bInvokeAndWait)
			{
				if (this.m_tabRequetes.length > 0)
				{
					this.m_nSetTimeout_AJAX = setTimeout("clWDAJAXMain.TraiteAJAXExecuteEvenement();", 1);
					break;
				}
			}
		}
	},

	// Execute le code serveur d'un champ. Version interne : celle appele via un timer
	bAJAXExecuteEvenementInterne: function(oPage, sChamp, nEvenement, nOption)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return;

		// on prepare la requete
		var sRequete = this.sConstuitRequeteEvenement(oPage, sChamp, nEvenement, nOption);

		// on prepare l'URL
		var sURL = this.sConstruitURL(sGetPageAction(oPage));
		// on cree la requete
		var clRequete = this.clCreeWDAJAXRequete(true, true);

		// Si la creation n'a pas echoue (AJAX possible)
		if (clRequete)
		{
			// On execute la requete
			clRequete.Envoi(sRequete, sURL);
			// Si le resulat est valide on le renvoi
			return this.bReponseGenerique(clRequete, oPage, null);
		}
		else
		{
			// Cas AJAX impossible
			this.ErreurAJAX();
			return false;
		}
	},

	// Appel normal dans le cas ou AJAX n'est pas disponible
	NormalExecuteEvenement: function(oPage, sChamp, nEvenement, nOption)
	{
		switch (nOption)
		{	// Envoie la valeur du champ courant. Renvoie la valeur de tous les champs car on ne sait pas faire moins
			case 1:
				// Donc pas de break ici
				// Envoie la valeur de tous les champs de la page
			case 2:
				// Construction d'un _JSL
				_JSL(oPage, sChamp, "_self", "", "");
				break;

			case 3:
				// Clic sur une reglette mais sans submit
				// Resultat de la forme "/WD110AWP/WD110AWP.EXE?WD_ACTION=SCROLLTABLE&TABLE1=4"
				// Construction d'un _JCL ?
				break;

			case 4:
				// Clic sur une reglette avec submit
				// Appel de _RXXX
				eval("_R" + sChamp + "(" + nEvenement + ")");
				break;

			// Ne renvoie aucune valeur
			default:
				// Construction d'un _JCL
				_JCL(oPage.action + "?" + sChamp, "_self", "", "");
				break;
		}
	},

	// Creation d'une requete AJAX avec une URL et des donnees
	// Commun a AJAXExecute et JSONExecute
	_sRequeteSynchroneTexte: function(bPOST, sRequete, sURL)
	{
		// on cree la requete
		var clRequete = this.clCreeWDAJAXRequete(bPOST, true);
		// Si la creation n'a pas echoue (AJAX possible)
		if (clRequete)
		{
			// on execute la requete
			clRequete.Envoi(sRequete, sURL);
			// On verifie la validite du resultat et on le renvoie si il est valide
			var sRes = clRequete.bValideResultat() ? clRequete.sGetResultat() : "";
			// Libere la requete
			clRequete.Libere();
			clRequete = null;
			// Renvoi le resultat
			return sRes;
		}
		else
		{
			// Cas AJAX impossible
			this.ErreurAJAX();
			return "";
		}
	},

	// JSONExecute
	// Declenche un appel bloquant sur un URL autorise (normalement sur le meme serveur)
	JSONExecute: function(sURL)
	{
		// Execute l'appel serveur le resultat de l'appel serveur
		var sRes = this._sRequeteSynchroneTexte(false, "", sURL);

		// Traite le resultat SANS validation
		if (sRes.length > 0)
		{
			return eval('(' + sRes + ')');
		}
		else
		{
			return {};
		}
	},

	// AJAXExecute
	// declenche l'execution synchrone d'une procedure AJAX sur le serveur
	// ATTENTION : le nombre de parametres est variable
	AJAXExecuteSynchrone: function(sProcedure, sAliasContexte)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return "";

		// on prepare la requete
		var sRequete = this.sConstuitRequeteProcedure(sProcedure, sAliasContexte);
		// on ajoute les parametres de la procedure
		sRequete += sConstuitProcedureParams(2, arguments);
		// on prepare l'URL
		var sURL = this.sConstruitURL(sGetPageAction());
		// Traite la requete
		return this._sRequeteSynchroneTexte(true, sRequete, sURL);
	},

	// AJAXExecuteAsynchrone
	// declenche l'execution asynchrone d'une procedure AJAX sur le serveur
	// ATTENTION : Le nombres de parametres est variable
	AJAXExecuteAsynchrone: function(sProcedure, sNomCallback, sAliasContexte)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return "";

		// on prepare la requete
		var sRequete = this.sConstuitRequeteProcedure(sProcedure, sAliasContexte);
		// on ajoute les parametres de la procedure
		sRequete += sConstuitProcedureParams(3, arguments);
		// on prepare l'URL
		var sURL = this.sConstruitURL(sGetPageAction());
		// on cree la requete
		var clRequete = this.clCreeWDAJAXRequete(true, false);
		// Si la creation n'a pas echoue (AJAX possible)
		if (clRequete)
		{
			// on recupere son identifiant pour manipulations ulterieure (annulation, recuperation du resultat)
			var nIdRequete = clRequete.m_nId;
			// on renseigne la allback pour la validation du resultat
			clRequete.m_sCallback = sNomCallback;
			// on execute la requete
			clRequete.Envoi(sRequete, sURL);
			// on renvoie l'identifiant de la requete
			return nIdRequete;
		}
		else
		{
			// Cas AJAX impossible
			this.ErreurAJAX();
			return "";
		}
	},

	// AJAXAppelAsynchroneEnCours
	// renvoie l'etat d'une requete asynchrone
	AJAXAppelAsynchroneEnCours: function(nId)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return false;

		// on commence par rechercher la requete
		var clRequete = this.GetWDAJAXRequete(nId);
		// si on trouve la requete, c'est qu'elle est en cours
		return (clRequete != null && clRequete.bEnCours());
	},

	// AJAXAnnuleAppelAsynchrone
	// annule une requete asynchrone
	AJAXAnnuleAppelAsynchrone: function(nId)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return false;

		// on commence par rechercher la requete
		var clRequete = this.GetWDAJAXRequete(nId);
		// si on trouve la requete, on l'annule
		if (clRequete != null) clRequete.Annule();
	},

	// AJAXRecupereLignesTable
	// Demande les lignes donnees de la tabel donnee au serveur
	AJAXRecupereLignesTable: function(oObjetRequeteTable, sRequeteTable)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return "";

		// Prepare la requete
		var sRequete = this.sConstuitRequeteTable(sRequeteTable);
		// Prepare l'URL
		var sURL = this.sConstruitURL(sGetPageAction());
		// Cree la requete et demandant une initialisation speciale
		var clRequete = this.clCreeWDAJAXRequete(true, false, true);

		// Si la creation n'a pas echoue (AJAX possible)
		if (clRequete)
		{
			// Demande l'initialisation pour les tables
			clRequete.InitTable(oObjetRequeteTable);

			// Recupere son identifiant pour manipulations ulterieure (annulation, recuperation du resultat)
			var nIdRequete = clRequete.m_nId;
			// Execute la requete
			clRequete.Envoi(sRequete, sURL);
			// Renvoie l'identifiant de la requete
			return nIdRequete;
		}
		else
		{
			// Cas AJAX impossible
			this.ErreurAJAX();
			return false;
		}
	},

	// AJAXRecupereLignesTableSelection
	// Demande les lignes donnees de la table donnee au serveur
	AJAXRecupereLignesTableSelection: function(oObjetRequeteTable, sRequeteTable, bSubmit)
	{
		// Si plus d'AJAX on sort
		if (!this.bWDAJAXMainValide()) return "";

		// Prepare la requete
		var sRequete = this.sConstuitRequeteEvenement(eval("_PAGE_"), oObjetRequeteTable.m_oChampTable.m_sAliasChamp, 0, bSubmit ? 5 : 6) + "&" + sRequeteTable;
		// Prepare l'URL
		var sURL = this.sConstruitURL(sGetPageAction());
		// Cree la requete et demandant une initialisation speciale
		var clRequete = this.clCreeWDAJAXRequete(true, false, true);

		// Si la creation n'a pas echoue (AJAX possible)
		if (clRequete)
		{
			// Demande l'initialisation pour les tables
			clRequete.InitTable(oObjetRequeteTable);

			// Recupere son identifiant pour manipulations ulterieure (annulation, recuperation du resultat)
			var nIdRequete = clRequete.m_nId;
			// Execute la requete
			clRequete.Envoi(sRequete, sURL);
			// Renvoie l'identifiant de la requete
			return nIdRequete;
		}
		else
		{
			// Cas AJAX impossible
			this.ErreurAJAX();
			return false;
		}
	},

	// Sauve le temoin d'activite AJAX
	InitActivite: function(sActiviteChamp, nActiviteOption)
	{
		// Recupere directement le champ
		this.m_oActiviteChamp = _JGE(sActiviteChamp, document, true);
		// Et sauve l'option
		this.m_nActiviteOption = nActiviteOption;

		// Initialise les callback de redimensionnement/defilement du navigateur
		this.m_fWinOnScroll = window.onscroll;
		this.m_fWinOnResize = window.onresize;

		var oTmp = this;
		if (bIE)
		{
			window.onscroll = function() { if (oTmp.m_fWinOnScroll) { oTmp.m_fWinOnScroll.apply(window); } oTmp._ReactualiseActivite(oTmp.m_bActivite); };
			window.onresize = function() { if (oTmp.m_fWinOnResize) { oTmp.m_fWinOnResize.apply(window); } oTmp._ReactualiseActivite(oTmp.m_bActivite); };
		}
		else
		{
			window.onscroll = function(event) { if (oTmp.m_fWinOnScroll) { oTmp.m_fWinOnScroll.apply(window, [event]); } oTmp._ReactualiseActivite(oTmp.m_bActivite); };
			window.onresize = function(event) { if (oTmp.m_fWinOnResize) { oTmp.m_fWinOnResize.apply(window, [event]); } oTmp._ReactualiseActivite(oTmp.m_bActivite); };
		}

		// Et met a jour le temoin
		// S'il n'a pas encore ete defini le defini
		// S'il est deje defini : utilise sa valeur pour afficher le temoin
		this._ReactualiseActivite(this.m_bActivite ? this.m_bActivite : false);
	},

	// Met a jour le temoin d'activite AJAX si besoin
	ReactualiseActivite: function(bForce)
	{
		// Calcule le nouvel etat
		var bActivite = (this.m_tabConnection.length > 0) || (this.m_nRequeteSynchrone > 0) || bForce;
		// Si l'etat change : effectue les modifications
		if (this.m_bActivite != bActivite)
		{
			this._ReactualiseActivite(bActivite);
		}
	},

	// Met a jour le temoin d'activite AJAX
	_ReactualiseActivite: function(bVisible)
	{
		// Sauve le nouvel etat
		this.m_bActivite = bVisible;

		// Si pas de temoin => Fin
		if (!this.m_oActiviteChamp) return;

		// Appel de la fonction _JFDE poru le deplacement
		_JDE(this.m_oActiviteChamp, document, this.m_nActiviteOption);

		// Et l'affiche
		this.m_oActiviteChamp.style.visibility = bVisible ? "inherit" : "hidden";
	}
};

// On instancie un objet principal
var clWDAJAXMain = new WDAJAXMain();

// S'il y a deux clics 'rapides' dans un bouton AJAX d'une zone repetee. Comme _JAEE est non bloquant (utilise un setTimeout)
// Alors il peut y avoir deux appels ) _JAZR + _JAEE qui s'empilent
// Mais au lieu de s'executer dans l'ordre _JAZR, _JAEE, _JAEE_Interne, _JAZR, _JAEE, _JAEE_Interne
// l'ordre est _JAZR, _JAEE, _JAZR, _JAEE, _JAEE_Interne, _JAEE_Interne. Comme un appel supprime la valeur surcharge par _JAZR
// alors le second ne recoit rien et manipule la premiere ligne
var bBloque = false;

// Fonction d'appel
//function _JAES(sProcedure, sAliasContexte) { return clWDAJAXMain.AJAXExecuteSynchrone(sProcedure, sAliasContexte); }
//function _JAEA(sProcedure, sNomCallback, sAliasContexte) { return clWDAJAXMain.AJAXExecuteAsynchrone(sProcedure, sNomCallback, sAliasContexte); }
function _JAAAEC(nId) { return clWDAJAXMain.AJAXAppelAsynchroneEnCours(nId); }
function _JAAAA(nId) { return clWDAJAXMain.AJAXAnnuleAppelAsynchrone(nId); }
function _JAD() { return clWDAJAXMain.AJAXDisponible(); }
function _JAEE(oPage, sChamp, nEvenement, nOption)
{
	if (bBloque)
	{	// Si on a ete bloque par un l'appel de _JAZR qui precede immediatement
		bBloque = false;
	}
	else
	{
		clWDAJAXMain.AJAXExecuteEvenement(oPage, sChamp, nEvenement, nOption);
	}
};
function _JAZR(sZRChamp, sValeur)
{
	if (clWDAJAXMain.m_sZRChamp)
	{	// Bloque l'appel de _JAEE qui suit immediatement
		bBloque = true;
	}
	else
	{
		clWDAJAXMain.SetZRChamp(sZRChamp, sValeur);
	}
};
