//#15.00Aa WDEvent.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation des evenements

// Manipulation d'un evenement
function WDEvent (fCallback, oCibleDOM, tabEvenementNom, bCapture)
{
	if (fCallback)
	{
		// Memorise les parametres (pour la liberation)
		this.m_fCallback = fCallback;
		this.m_oCibleDOM = oCibleDOM;
		this.m_tabEvenementNom = tabEvenementNom;
		this.m_bCapture = bCapture;

		// Attache l'evement
		HookOnXXX(this.m_oCibleDOM, this.m_tabEvenementNom[0], this.m_tabEvenementNom[1], this.m_fCallback, this.m_bCapture);
	}
};

// Supprime un evenement
WDEvent.prototype.Libere = function Libere()
{
	// Detache l'evement
	UnhookOnXXX(this.m_oCibleDOM, this.m_tabEvenementNom[0], this.m_tabEvenementNom[1], this.m_fCallback, this.m_bCapture);
};

// Manipulation de la liste des evenements (singleton)
function WDEventMain ()
{
	// Initialise le tableaux des evenements
	this.m_tabEvenements = new Object();
	this.m_nEvenementSuivant = 1;
};

// Tableau des evenements predefinis
// Format : [ "Nom IE", "Nom autres" ]
WDEventMain.prototype.tabEvenements = [
	[ 'onclick',	'click'		],	// 0 : onclick
	[ 'ondblclick',	'dblclick'	],	// 1 : ondblclick (existe ?)
	[ 'onmousedown','mousedown'	],	// 2 : onmousedown
	[ 'onmouseup',	'mouseup'	],	// 3 : onmouseup
	[ 'onmousemove','mousemove'	],	// 4 : onmousemove
	[ 'onmouseout',	'mouseout'	],	// 5 : onmouseout
	[ 'onmouseover','mouseover'	],	// 6 : onmouseover
	[ 'onkeydown',	'keydown'	],	// 7 : onkeydown
	[ 'onkeypress',	'keypress'	],	// 8 : onkeypress
	[ 'onkeyup',	'keyup'		],	// 9 : onkeyup
	[ 'onfocus',	'focus'		],	// 10 : onfocus
	[ 'onblur',		'blur'		],	// 11 : onblur
	[ 'onchange',	'change'	],	// 12 : onchange
	[ 'onselect',	'select'	],	// 13 : onselect
	[ 'onload',		'load'		],	// 14 : onload
	[ 'onunload',	'unload'	],	// 15 : onunload
	[ 'onreset',	'reset'		],	// 16 : onreset
	[ 'onsubmit',	'submit'	],	// 17 : onsubmit
	[ 'onresize',	'resize'	],	// 18 : onresize
	[ 'onscroll',	'scroll'	],	// 19 : onscroll
//	[ 'onhelp',		'help'		],	// ?? : onhelp
];
WDEventMain.prototype.ms_nOptionCapture = 1;
WDEventMain.prototype.ms_nDOMWindow = 0;
WDEventMain.prototype.ms_nDOMDocument = 1;
WDEventMain.prototype.ms_nDOMBody = 2;
WDEventMain.prototype.ms_nDOMForm = 3;
WDEventMain.prototype.ms_nInterruptionAction = 1;
WDEventMain.prototype.ms_nInterruptionPropagation = 2;


// Ajout d'un evenement
// Version publique qui traite les parametres
WDEventMain.prototype.nEvenement = function nEvenement(oCallback, oCible, oEvenement, oOptions)
{
	// oCallback : recupere un pointeur de fonction
	var fCallback = this.__fGetCallback(oCallback);

	// oCible : recupere un objet DOM
	var oCibleDOM = this.__oGetCibleDOM(oCible);

	// oEvenement : recupere une description d'evement
	var tabEvenementNom = this.__tabGetEvenementNom(oEvenement);

	// oOptions : transforme en entier
	var nOptions = this.__nGetOptions(oOptions);

	// Si les parametres sont valides, appel la version interne
	if (fCallback && oCibleDOM && tabEvenementNom && !isNaN(nOptions))
	{
		return this.__nEvenement(fCallback, oCibleDOM, tabEvenementNom, nOptions);
	}
	else
	{
		// Erreur
		return 0;
	}
};

// Traitement du parametre oCallback : recupere un pointeur de fonction
WDEventMain.prototype.__fGetCallback = function __fGetCallback(oCallback)
{
	// Selon le type du parametre
	switch (typeof oCallback)
	{
	case 'string':
		// Chaine, tente un eval
		try
		{
			var fCallback = eval(sCallback);
			if (fCallback && (typeof fCallback == 'function'))
			{
				return fCallback;
			}
		}
		catch (e)
		{
		}
		// Non trouve
		return null;
	case 'function':
		// Fonction : retourne directement la valeur
		return oCallback;
	default:
		// Autres (en particulier les objets) : erreur
		return null;
	}
};

// Traitement du parametre oCible : recupere un objet DOM
WDEventMain.prototype.__oGetCibleDOM = function __oGetCibleDOM(oCible)
{
	// Selon le type du parametre
	switch (typeof oCible)
	{
	case 'string':
		// Chaine, tente un getElementById
		var oCibleDom = document.getElementById(oCible);
		if (oCibleDom)
		{
			return oCibleDom;
		}
		// Puis un getElementsByName
		var tabCibleDom = document.getElementsByName(oCible);
		if (tabCibleDom && tabCibleDom.length && tabCibleDom[0])
		{
			return tabCibleDom[0];
		}
		// Non trouve
		return null;
	case 'number':
		switch (oCible)
		{
		case WDEventMain.prototype.ms_nDOMWindow:
			return window;
		case WDEventMain.prototype.ms_nDOMDocument:
			return window.document;
		case WDEventMain.prototype.ms_nDOMBody:
			return window.document.body;
		case WDEventMain.prototype.ms_nDOMForm:
			return _PAGE_;
		}
	default:
		// Autres (en particulier les objets) : retourne directement la valeur
		return oCible;
	}
};

// Traitement du parametre oEvenement : recupere une description d'evement
WDEventMain.prototype.__tabGetEvenementNom = function __tabGetEvenementNom(oEvenement)
{
	// Selon le type du parametre
	switch (typeof oEvenement)
	{
	case 'number':
		// Entier, regarde dans le tableau des description
		return this.tabEvenements[oEvenement];
	case 'string':
		// Chaine, retourne la valeur pour tous les navigateurs
		return [oEvenement, oEvenement];
	default:
		// Autres (en particulier les objets et les tableaux) : retourne directement la valeur
		return oEvenement;
	}
};

// Traitement du parametre oOptions : transforme en entier
WDEventMain.prototype.__nGetOptions = function __nGetOptions(oOptions)
{
	// Selon le type du parametre
	switch (typeof oOptions)
	{
	case 'number':
		// Entier, retourne directement sa valeur
		return oOptions;
	default:
		// Autres (en particulier les chaines) : tente une transformation
		// Si elle echoue on recoit NaN que l'on traite dans l'appelant
		return parseInt(oOptions, 10);
	}
};

// Ajout d'un evenement
// Version inetrne apres traitement des parametres
WDEventMain.prototype.__nEvenement = function __nEvenement(fCallback, oCibleDOM, tabEvenementNom, nOptions)
{
	// Cree le nouvel evenement
	var bCapture = (nOptions & this.ms_nOptionCapture) != 0;
	var oEvenement = new WDEvent(fCallback, oCibleDOM, tabEvenementNom, bCapture);

	// L'enregistre
	var nEvenementID = this.m_nEvenementSuivant;
	this.m_nEvenementSuivant++;
	this.m_tabEvenements[nEvenementID] = oEvenement;

	// Et retourne son ID
	return nEvenementID;
};

// Supprime un evenement de la liste des evenements
WDEventMain.prototype.bFinEvenement = function bFinEvenement (nEvenementID)
{
	// Le retrouve dans la liste
	var oEvenement = this.m_tabEvenements[nEvenementID];

	// Si on l'a bien trouve
	if (oEvenement)
	{
		// Le detache
		oEvenement.Libere();

		// Le supprime de la liste
		delete this.m_tabEvenements[nEvenementID];

		return true;
	}
	else
	{
		// Echec evenement inexistant ou deja libere
		return false;
	}
};

// Interruption de l'evenement en cours
WDEventMain.prototype.bInterruptionEvenement = function bInterruptionEvenement(oEvent, nOptions)
{
	// Interruption de la propagation
	if ((nOptions & this.ms_nInterruptionPropagation) != 0)
	{
		if (bIE)
		{
			oEvent.cancelBubble = true;
		}
		else
		{
			oEvent.stopPropagation();
		}
	}

	// Interruption de l'action
	if ((nOptions & this.ms_nInterruptionAction) != 0)
	{
		return bStopPropagation(oEvent);
	}
	else
	{
		return true;
	}
};

// Instance principale
var clWDEventMain = new WDEventMain();
