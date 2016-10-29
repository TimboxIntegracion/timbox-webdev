//#15.00Aa WDCalendrier.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Manipulation d'un champ calendrier
function WDCalendrier(sAliasChamp, sAliasZR, sAliasAttribut)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, sAliasZR, sAliasAttribut]);
	}
}

// Declare l'heritage
WDCalendrier.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDCalendrier.prototype.constructor = WDCalendrier;

// Membres statiques
WDCalendrier.prototype.ms_sSuffixeJour = "_JOUR";
WDCalendrier.prototype.ms_sSuffixeMois = "_MOIS";
WDCalendrier.prototype.ms_sActionPrecedent = "CALENDRIERPREC";
WDCalendrier.prototype.ms_sActionSuivant = "CALENDRIERSUIV";
WDCalendrier.prototype.ms_sActionAujourdhui = "CALENDRIERAUJO";

// Declare les fonction une par une

// Initialisation :
// - clObjetSaisie : Objet de manipulation de l'eventuel champ de saisie associe au champ
WDCalendrier.prototype.Init = function (clObjetSaisie)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	// Sauve le champ de saisie associe
	if (clObjetSaisie)
	{
		this.m_clObjetSaisie = clObjetSaisie;

		// Et cree l'objet popup automatique
		this.m_oPopupAutomatique = new WDPopupAutomatique(this);
	}
};

// Evenement avant l'affectation en AJAX du contenu du calendrier
WDCalendrier.prototype.PreAffecteHTML = function (bDepuisAJAX)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.PreAffecteHTML.apply(this, [bDepuisAJAX]);

	// Si la popup existe (la classe gere en interne le cas de la popup affichee)
	if (this.m_oPopupAutomatique)
	{
		this.m_oPopupAutomatique.PreAffecteHTML(bDepuisAJAX);
	}
};

// Evenement apres l'affectation en AJAX du contenu du calendrier
WDCalendrier.prototype.PostAffecteHTML = function (bDepuisAJAX)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.PostAffecteHTML.apply(this, [bDepuisAJAX]);

	// Si la popup existe
	if (this.m_oPopupAutomatique)
	{
		this.m_oPopupAutomatique.PostAffecteHTML(bDepuisAJAX);
	}
};

// Indique si on doit utiliser la gestion dans une ZR
WDCalendrier.prototype.bGestionZR_SansPopup = function()
{
	// Dans une ZR et sans champ de saisie
	return (this.bGestionZR() && !this.m_clObjetSaisie);
};

// Indique si on doit utiliser la gestion des popup dans une ZR
WDCalendrier.prototype.bGestionZR_AvecPopup = function()
{
	// Dans une ZR et sans champ de saisie
	return (this.bGestionZR() && this.m_clObjetSaisie);
};

// Recupere le champ dans le HTML
// La liaison n'est plus statique car les elements dans les ZRs changent
WDCalendrier.prototype.oGetElementHTMLValeur = function()
{
	// Si la valeur du champ n'est pas lie a un attribut de zone repetee
	if (!this.bGestionZR_SansPopup())
	{
		return this.oGetElementByName(document, this.ms_sSuffixeJour);
	}
	else
	{
		// Recupere la collection des champs dans la ZR
		// ATTENTION, le champ est SANS suffixe pour ne pas casser le placement des valeurs dans le moteur
		return this.oGetElementByNameZRCalc(true, document, "");
	}
};

// Recupere le champ dans le HTML
WDCalendrier.prototype.oGetElementHTMLMois = function ()
{
	// Si la valeur du champ n'est pas lie a un attribut de zone repetee
	// Ou si on est dans une popup d'un champ de saisie d'une ZR
	if (!this.bGestionZR_SansPopup())
	{
		return this.oGetElementByName(document, this.ms_sSuffixeMois);
	}
	else
	{
		// Recupere la collection des champs dans la ZR
		return this.oGetElementByNameZRCalc(true, document, this.ms_sSuffixeMois);
	}
};

// Recupere le champ dans le HTML
// La liaison n'est plus statique car les elements dans les ZRs changent
WDCalendrier.prototype.oGetElementHTMLPopup = function ()
{
//	// Si la valeur du champ n'est pas lie a un attribut de zone repetee
//	if (!this.m_sAliasZR)
//	{
		return _JGE(this.m_sAliasChamp, document, true, true);
//	}
//	else
//	{
//		// Recupere la collection des champs dans la ZR
//		return _JGE(this.sGetNomElementZR(""), document, true, true);
//	}
};

// Definition du PCode de selection de jour navigateur
// Fonction conservee par compatibilite (a supprimer plus tard).
// Il faut maintenant appeler WDChamp::DeclarePCode
WDCalendrier.prototype.CodeSelectionJour = function(pfPCodeSelection)
{
	this.DeclarePCode(this.ms_nEventNavSelectionJour, pfPCodeSelection);
};

// Definition du PCode d'affichage de mois navigateur
// Fonction conservee par compatibilite (a supprimer plus tard).
// Il faut maintenant appeler WDChamp::DeclarePCode
WDCalendrier.prototype.CodeAffichageMois = function(pfPCodeAffichage)
{
	this.DeclarePCode(this.ms_nEventNavAffichageMois, pfPCodeAffichage);
};

// Selection du jour depuis un clic dans la cellule mais AUTOUR du lien
WDCalendrier.prototype.OnJourClick = function (oEvent, sDate, sActionMoteur)
{
	// Filtre les clics qui sont sur la zone du lien
	var oSource = bIE ? oEvent.srcElement : oEvent.explicitOriginalTarget;
	if (oSource && ((oSource.tagName + "").toUpperCase() == "TD"))
	{
		return this.OnJour(oEvent, sDate, sActionMoteur);
	}
};

// Selection du jour
WDCalendrier.prototype.OnJour = function (oEvent, sDate, sActionMoteur)
{
	// Recupere le champ contenant la valeur
	var oChampvaleur = this.oGetElementHTMLValeur();

	// Sauve l'ancienne valeur
	var sOldDate = oChampvaleur.value;

	// Ecrit la date dans la valeur du champ
	oChampvaleur.value = sDate;
	// Appel le PCode de selection s'il existe
	var bRes = this.RecuperePCode(this.ms_nEventNavSelectionJour)(oEvent, sActionMoteur);
	if (bRes !== false)
	{
		// Valide la valeur dans le champ de saisie si on en a un
		if (this.m_oPopupAutomatique)
		{
			// Transmet la valeur et les indications au champ de saisie
			this.m_clObjetSaisie.OnChangeCalendrier(oEvent, oChampvaleur.value, this.m_oChampSaisie);

			// Et se masque
			this.m_oPopupAutomatique.Masque(undefined, false);
		}

		// Pas de return XXX : casse les HREFs
//		return bRes;
		return;
	}
	// Restaure l'ancienne valeur en cas d'annulation
	oChampvaleur.value = sOldDate;
};

WDCalendrier.prototype.OnAujourdhui = function ()
{
	// Pas de return XXX : casse les HREFs
	// Calcule la date du jour avec DateSys
//	return this.OnJour(undefined, _DS(), this.ms_sActionAujourdhui);
	this.OnJour(undefined, _DS(), this.ms_sActionAujourdhui);
};

// Change le mois courant
WDCalendrier.prototype.OnChangeMois = function (nOffset, sActionMoteur)
{
	// Recupere le champ contenant la valeur
	var oChampMois = this.oGetElementHTMLMois();

	// Sauve l'ancienne valeur
	var sOldDate = oChampMois.value;
	// Conversion de la date en chaine en objet Date
	var oMois = _WMD(sOldDate);

	// Modifie le mois
	var nMois = oMois.getMonth();
	nMois += nOffset;

	// Normalise le mois
	var nOffsetAnnee = 0;
	while (nMois < 0)
	{
		nOffsetAnnee--;
		nMois += 12;
	}
	while (nMois > 11)
	{
		nOffsetAnnee++;
		nMois -= 12;
	}

	// Defini le mois et forcant le debut du mois
	oMois.setMonth(nMois, 1);
	// Force l'annee si besoin
	if (nOffsetAnnee != 0)
	{
		oMois.setYear(oMois.getYear() + nOffsetAnnee);
	}

	// Convertit la valeur en chaine WL ecrite dans le champ cache
	oChampMois.value = _JDTW(oMois);
	// Appel le PCode de selection s'il existe
	var bRes = this.RecuperePCode(this.ms_nEventNavAffichageMois)(undefined, sActionMoteur);
	if (bRes !== false)
	{
		// Pas de return XXX : casse les HREFs
//		return bRes;
		return;
	}
	// Restaure l'ancienne valeur en cas d'annulation
	oChampMois.value = sOldDate;
};

WDCalendrier.prototype.OnNext = function ()
{
	// Demande le mois precedent
	// Pas de return XXX : casse les HREFs
//	return this.OnChangeMois(+1, this.ms_sActionSuivant);
	this.OnChangeMois(+1, this.ms_sActionSuivant);
};

WDCalendrier.prototype.OnPrev = function ()
{
	// Demande le mois suivant
	// Pas de return XXX : casse les HREFs
//	return this.OnChangeMois(-1, this.ms_sActionPrecedent);
	this.OnChangeMois(-1, this.ms_sActionPrecedent);
};

// Gestion du champ calendrier dans un champ de saisie

// Notification (par le champ de saisie) que son contenu a changer
WDCalendrier.prototype.OnChangeSaisie = function (oEvent, sValeur, oChampSaisie)
{
	// Si on est dans une zone repetee, redessine le champ calendrier avec le mois de la ligne courante
	if (this.bGestionZR_AvecPopup())
	{
		// On bloque la MAJ (elle sera de toutes facons faite par l'ouverture de la popup
		// Sauf si on ets justement dans cette ouveture
		if (!this.m_bDansAffiche)
		{
			return;
		}
		else
		{
			this.m_sValeurPopupZR = oChampSaisie.value;
		}
	}

	if (!this.m_oChampSaisie || (this.m_oChampSaisie != oChampSaisie))
	{
		this.m_oChampSaisie = oChampSaisie;
	}

	// Appele la methode interne avec la valeur
	this.OnJour(oEvent, sValeur);
};

// Notification de que champ doit etre affiche
// Le champ aussi que le format d'affichage sont transmit pour memorisation
WDCalendrier.prototype.Affiche = function (oEvent, oChampSaisie)
{
	if (this.bGestionZR_AvecPopup())
	{
		// Ne pas le faire si la valeur du champ calendrier est DEJA a jour pour ne pas faire une double MAJ si la valeur viens d'etre modifie juste avant l'ouverture
		// Note : oChampSaisie.value contient la valeur FORMATEE du champ. C'est ce que l'on sauve dans this.m_sValeurPopupZR
		if (this.m_sValeurPopupZR != oChampSaisie.value)
		{
			// En supprimant le bloquage dans OnChangeSaisie
			this.m_bDansAffiche = true;
			this.m_clObjetSaisie.MAJContenuCalendrier(oEvent, oChampSaisie);
			delete this.m_bDansAffiche;
		}
	}

	// Trouve le champ a afficher
	var oElement = this.oGetElementHTMLPopup();

	this.m_oPopupAutomatique.Affiche(oEvent, oElement, oChampSaisie);
};

// Notification de que champ doit etre affiche
// Le champ aussi que le format d'affichage sont transmit pour memorisation
WDCalendrier.prototype.AfficheInterne = function (oEvent, oElement, oChampSaisie)
{
	// Memorise le champ precis (pour les ZR) sur lequel on est
	this.m_oChampSaisie = oChampSaisie;

	var oCibleAlign = oChampSaisie;
	// Deplace le champ selon la position du champ qui a recu le clic
	// Le champ calendrier popup est place pour que le bord droit soit aligne avec le bord droit du bouton
	// - Trouve le bouton source
	if (!oCibleAlign)
	{
		oCibleAlign = bIE ? oEvent.srcElement : oEvent.target;
	}

	// Decale le champ
	var nGauche = _JCCP(oCibleAlign.offsetLeft, oCibleAlign, true, true) + oCibleAlign.offsetWidth - parseInt(oElement.style.width, 10);
	if (nGauche < 0)
	{
		nGauche = 0;
	}
	SetStyleLeft(oElement.style, _JCCP(nGauche,oElement,true,false), 0);
	oElement.style.top = _JCCP(_JCCP(oCibleAlign.offsetTop,oCibleAlign,false,true),oElement,false,false) + oCibleAlign.offsetHeight;
};

// Notification de que champ doit etre masquer
WDCalendrier.prototype.MasqueInterne = function(oEvent, bLostFocus)
{
	// Si on a perdu le focus, il faut forcer le redessin du champ
	// Sauf si on est dans une ZR car alors le redessin a ete fait ne ouverture donc il est inutile (et declenche une MAJ abusive du champ de saisie)
	if (bLostFocus && this.m_oChampSaisie && !this.m_sAliasZR)
	{
		this.m_clObjetSaisie.OnChange(oEvent, this.m_oChampSaisie);
	}

	// Detruit les valeur memorisee sur le champ de saisie
	delete this.m_oChampSaisie;
};
