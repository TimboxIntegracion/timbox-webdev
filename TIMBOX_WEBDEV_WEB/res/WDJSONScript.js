//#15.00Aa WDJSONScript.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Attention a ne pas mettre d'accent dans ce fichier COMMENTAIRES inclus

// Classe representant un appel JSONScript

function WDJSONScriptRequete (nId, sURL, sParamCallback, pCallback)
{
	// Init des membres a memoriser
	this.m_nId = nId;
	this.m_pCallback = pCallback;
	this.m_sNomCallback = "WDJSONScriptRequete_" + nId;

	// Creation de la callback
	window[this.m_sNomCallback] = function() { clWDJSONScriptMain.Appel(nId, arguments[0]); };

	// Creation de la balise src
	var oScript = document.createElement("SCRIPT");
	// Et cible de la balise
	oScript.src = sURL + ((sURL.indexOf('?') == -1) ? '?' : '&') + sParamCallback + '=' + this.m_sNomCallback;
	oScript.charset = "UTF-8";

	// Et ajout de la balise dans la page
	this.m_oScript = document.body.appendChild(oScript);
}

WDJSONScriptRequete.prototype =
{
	AppelCallback:function (oValeur)
	{
		// Appele la callback utilisateur
		this.m_pCallback(oValeur);

		// Supprime la balise de la page
		document.body.removeChild(this.m_oScript);
		delete this.m_oScript;
		this.m_oScript = null;

		// Supprime la callback globale intermediaire
		// On ne peut pas la supprimer donc on la met a null pour ne pas perdre trop de memoire
		window[this.m_sNomCallback] = null;
	}
};

// Classe de suivi des appels JSONScript

function WDJSONScriptMain ()
{
	this.m_tabRequete = new Array();	// Tableau des requetes
	this.m_nIdPos = 1;					// Id de connection
};

WDJSONScriptMain.prototype =
{
	// Creation d'un nouvel appel
	JSONScriptExecute:function (sURL, sParamCallback, sCallback)
	{
		// Creation et appel
		this.m_tabRequete[this.m_nIdPos] = new WDJSONScriptRequete(this.m_nIdPos, sURL, sParamCallback, eval(sCallback));
		// Numero suivant
		this.m_nIdPos++;
	},

	// Appel de la callback pour un element donne
	Appel:function (nId, oValeur)
	{
		this.m_tabRequete[nId].AppelCallback(oValeur);
		// Supprime l'objet
		delete this.m_tabRequete[nId];
	}
};

// On instancie un objet principal
var clWDJSONScriptMain = new WDJSONScriptMain();
