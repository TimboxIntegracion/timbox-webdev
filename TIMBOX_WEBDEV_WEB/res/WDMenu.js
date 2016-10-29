//#15.00Aa WDMenu.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation des menus
function WDMenu (sAliasChamp, bOnglet)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, undefined, undefined]);

		this.m_bOnglet = bOnglet;
	}
};

// Declare l'heritage
WDMenu.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDMenu.prototype.constructor = WDMenu;

// Initialisation
WDMenu.prototype.Init = function ()
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Trouve la racine du menu
	this.m_oRacine = _JGE(this.m_sAliasChamp, document, true, false);

	// Si le menu n'existe pas (menu invisible avec l'option ne pas generer les champ hidden)
	if (!this.m_oRacine)
	{
		return;
	}

	// Applique le changement de style et l'affichage des sous menus en survol d'option
	if (this.m_bOnglet)
	{
		// Traite les onglets
		this.AjouteJSSurvolOnglet(this.m_oRacine);
	}
	// Traite les sous menus normaux
	this.AjouteJSSurvolSousMenu(this.m_oRacine);
};

// Applique le changement de style et l'affichage des onglets
WDMenu.prototype.AjouteJSSurvolOnglet = function (oRacine)
{
	// Les options sont les TD avec WDOngletOption comme class
	var tabOnglets = oRacine.getElementsByTagName("TD");
	var i;
	var nLimiteI = tabOnglets.length;
	for (i = 0; i < nLimiteI; i++)
	{
		var oOnglet = tabOnglets[i];
		if ((oOnglet.className == "WDOngletOption") || (oOnglet.className == "WDOngletOptionSelect"))
		{
			var bAvecSousMenu = false;
			// Cherche sont eventuel sous menu
			var tabTABLE = oOnglet.getElementsByTagName("TABLE");
			var j;
			var nLimiteJ = tabTABLE.length;
			for (j = 0; j < nLimiteJ; j++)
			{
				var oTABLE = tabTABLE[j];
				if (oTABLE.parentNode.className == "WDSousOnglet")
				{
					bAvecSousMenu = true;
					this.AjouteJSSurvol_SousMenu(oOnglet, oTABLE);
				}
			}

			// Si on a pas de sous menu : mettre le code de survol
			if (!bAvecSousMenu)
			{
				this.AjouteJSSurvol_Simple(oOnglet);
			}
		}
	}
};

// Applique le changement de style et l'affichage des sous menus en survol d'option
WDMenu.prototype.AjouteJSSurvolSousMenu = function (oRacine)
{
	// Liste les fils de la balise et trouve la balise TR si elle existe
	var tabOptionsMenu = oRacine.getElementsByTagName("TR");
	var i;
	var nLimiteI = tabOptionsMenu.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// Applique le changement de style et l'affichage des sous menus en survol d'un option
		this.AjouteJSSurvol(tabOptionsMenu[i]);
	}
};

// Applique le changement de style et l'affichage des sous menus en survol d'un option
WDMenu.prototype.AjouteJSSurvol = function (oOptionMenu)
{
	// Si le style de la ligne n'est pas celui d'une option
	if ((oOptionMenu.className != "WDMenuOption") && (oOptionMenu.className != "WDMenuOptionSelect"))
	{
		return;
	}

	// Regarde si l'option a un sous menu
	var tabSousMenus = oOptionMenu.getElementsByTagName("TABLE");

	if (tabSousMenus.length)
	{
		this.AjouteJSSurvol_SousMenu(oOptionMenu, tabSousMenus[0]);
	}
	else
	{
		this.AjouteJSSurvol_Simple(oOptionMenu);
	}
};

// Ajoute les fonctions JS en survol pour une option avec un sous menu
WDMenu.prototype.AjouteJSSurvol_SousMenu = function AjouteJSSurvol_SousMenu(oOptionMenu, oSousMenu)
{
	// Sauve la classe normale de l'option
	oOptionMenu.oldClassName = oOptionMenu.className;

	if (bIE)
	{
		oOptionMenu.onmouseover = function()
		{
			oOptionMenu.className = oOptionMenu.oldClassName + "Hover";
			// Seulement si le menu n'est pas desactive
			// La norme indique que les elements sont retournes dans l'ordre => On demand le premier donc [0]
			var tabLiens = oOptionMenu.getElementsByTagName("A");
			if (!(tabLiens && tabLiens[0].disabled))
			{
				SetDisplay(oSousMenu, true);
			}
		};
		oOptionMenu.onmouseout = function()
		{
			oOptionMenu.className = oOptionMenu.oldClassName;
			SetDisplay(oSousMenu, false);
		};
	}
	else
	{
		oOptionMenu.onmouseover = function(event)
		{
			oOptionMenu.className = oOptionMenu.oldClassName + "Hover";
			// Seulement si le menu n'est pas desactive
			// La norme indique que les elements sont retournes dans l'ordre => On demand le premier donc [0]
			var tabLiens = oOptionMenu.getElementsByTagName("A");
			if (!(tabLiens && tabLiens[0].attributes.getNamedItem("disabled")))
			{
				SetDisplay(oSousMenu, true);
			}
		};
		oOptionMenu.onmouseout = function(event)
		{
			oOptionMenu.className = oOptionMenu.oldClassName;
			SetDisplay(oSousMenu, false);
		};
	}
};

// Ajoute les fonctions JS en survol pour une option sans sous menu
WDMenu.prototype.AjouteJSSurvol_Simple = function (oOptionMenu)
{
	// Sauve la classe normale de l'option
	oOptionMenu.oldClassName = oOptionMenu.className;

	if (this.m_bIE)
	{
		oOptionMenu.onmouseover = function () { oOptionMenu.className = oOptionMenu.oldClassName + "Hover"; };
		oOptionMenu.onmouseout = function () { oOptionMenu.className = oOptionMenu.oldClassName; };
	}
	else
	{
		oOptionMenu.onmouseover = function (event) { oOptionMenu.className = oOptionMenu.oldClassName + "Hover"; };
		oOptionMenu.onmouseout = function (event) { oOptionMenu.className = oOptionMenu.oldClassName; };
	}
};

// Execute le clic sur le fond d'une option
WDMenu.prototype.OnClick = function(oEvent)
{
	// Filtre les clics qui sont sur la zone du lien
	var oSource = bIE ? oEvent.srcElement : oEvent.explicitOriginalTarget;

	// On ne fait l'action que si le clic n'est pas sur la zone du lien
	// Avec certaines version de firefox, on recoit la balise texte a l'interieur du lien
	if (!oSource || ((oSource.tagName + "").toUpperCase() == "A") || (oSource.parentNode && ((oSource.parentNode.tagName + "").toUpperCase() == "A")))
	{
		return;
	}

	// On trouve maintenant l'action en consultant le href du lien
	var oTR = oSource
	while (oTR && ((oTR.tagName + "").toUpperCase() != "TR"))
	{
		// Ne remonte pas jusqu'au document
		if (oTR == document.body)
		{
			return;
		}

		oTR = oTR.parentNode;
	}

	// Recupere la balise A
	var tabA = oTR.getElementsByTagName("A");
	if (tabA && tabA.length && tabA[0])
	{
		var sAction = tabA[0].href;
		if (sAction && sAction.length)
		{
			if (sAction.substring(0, "javascript:".length) == "javascript:")
			{
				sAction = sAction.substring("javascript:".length);
			}
			eval(sAction);
		}
	}
};
