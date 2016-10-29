//#15.00Aa WDTable.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Attention a ne pas mettre d'accent dans ce fichier COMMENTAIRES inclus

// Classe representant une requete pour du cache
function WDCacheRequete (oChampTable)
{
	// Table liee a la requete
	this.m_oChampTable = oChampTable;

	// Debut de la requete
	this.m_oDate = new Date();
};

WDCacheRequete.prototype =
{
	// Valeur par defaut des variables : mis dans le prototype
	m_nColonneTri: -1,		// Tri demande
	m_nLigne: -1,			// Ligne modifie
	m_nIdRequeteAJAX: undefined, // Objet de requete AJAX
	sCommandeAjax_LignesTable: "LIGNESTABLE",
	sCommandeAjax_LignesTriTable: "LIGNESTRITABLE",
	sCommandeAjax_ParCourtAP: "PARCOURTAP",
	sCommandeAjax_RechercheTable: "RECHERCHETABLE",
	sCommandeAjax_ModifTable: "MODIFTABLE",
	sParametreAjax_ColonneLien: "WD_TABLE_COL_LIEN_",
	sParametreAjax_Debut: "WD_TABLE_DEBUT_",
	sParametreAjax_Nombre: "WD_TABLE_NOMBRE_",
	sParametreAjax_CleEnreg: "WD_TABLE_CLEENREG_",
	sParametreAjax_CleEnreg_Pos: "WD_TABLE_CLEENREG_POS_",
	sParametreAjax_CleEnregAP: "WD_TABLE_CLEENREGAP_",
	sParametreAjax_CleEnregAP_Pos: "WD_TABLE_CLEENREGAP_POS_",
	sParametreAjax_TriAWP: "WD_TABLE_TRIAWP_",
	sParametreAjax_ColTri: "WD_TABLE_COL_TRI_",
	sParametreAjax_Recherche_Marge: "WD_TABLE_RECHERCHE_MARGE_",
	sParametreAjax_Recherche_Nombre: "WD_TABLE_RECHERCHE_NOMBRE_",
	sParametreAjax_Recherche_Col: "WD_TABLE_RECHERCHE_COL_",
	sParametreAjax_Recherche_Valeur: "WD_TABLE_RECHERCHE_VAL_",

	// Contruit le bout de requete supplementaire transmit en AWP
	sConstuitAWP: function(bSelection)
	{
		// Contruit le bout de requete pour la continuation du parcourt en arriere plan dans les pages AWP
		var sRequete = this.sConstuitPosAP();

		// Ajoute le tri courant de la table
		if (clWDAJAXMain.m_bPageAWP)
		{
			if (this.m_oChampTable.m_nColonneTriePre > -1)
				sRequete += "&" + this.sParametreAjax_TriAWP + "=" + clWDEncode.sEncodePOST((this.m_oChampTable.m_bSensTriPre ? "+" : "-") + this.m_oChampTable.m_nColonneTriePre);

			// Ajoute la selection de la table : on utilise le champ special ajoute a la page pour transmettre la selection complete au serveur
			// sans perturber le reste
			if (!bSelection)
			{
				var sSelection = clWDAJAXMain.sConstruitValeurChamp(this.m_oChampTable.m_oFormulaireSelAWP);
				if (sSelection.length)
					sRequete += "&" + sSelection;
			}
		}

		return sRequete;
	},

	// Contruit le bout de requete pour la continuation du parcourt en arriere plan dans les pages AWP
	sConstuitPosAP: function()
	{
		// Si pas de position : fin
		if (this.m_oChampTable.m_sCleParcourtAP.length == 0)
			return "";

		// Meme si on a fini le parcourt car il faut se replacer sur le serveur

		// Sinon ajoute les informations qui vont bien
		return "&" + this.sParametreAjax_CleEnregAP_Pos + "=" + this.m_oChampTable.m_nNbLignes + "&" + this.sParametreAjax_CleEnregAP + "=" + clWDEncode.sEncodePOST(this.m_oChampTable.m_sCleParcourtAP);
	},

	// Construit la requete pour la recherche dans une table
	sConstuitRequeteRechercheTable: function(nNombre, nMarge, sRecherche)
	{
		//	- Commande AJAX (non specifique)
		var sRequete = this.sCommandeAjax_RechercheTable + "=" + clWDEncode.sEncodePOST(this.m_oChampTable.m_sAliasChamp);
		// Nouvelle serie d'ordres
//		//	- Lignes (specifique)
//		sRequete += "&" + nMarge + "=" + nNombre;
//		//	- Recherche (specifique)
//		sRequete += "&" + this.m_nColonneTri + "=" + sRecherche;
		sRequete += "&" + this.sParametreAjax_Recherche_Marge + "=" + nMarge;
		sRequete += "&" + this.sParametreAjax_Recherche_Nombre + "=" + nNombre;
		sRequete += "&" + this.sParametreAjax_Recherche_Col + "=" + this.m_nColonneTri;
		sRequete += "&" + this.sParametreAjax_Recherche_Valeur + "=" + clWDEncode.sEncodePOST(sRecherche);

		// Ajoute la position du parcours en AP si besoin
		sRequete += this.sConstuitAWP(false);

		// On renvoie la requete creee
		return sRequete;
	},

	// Construit la requete pour recuperer les lignes d'une table
	sConstuitRequeteLignesTable: function(bTriCroissant, nCleEnregPos, sCleEnreg)
	{
		var sRequete = "";
		//	- Commande AJAX (non specifique)
		// Si on en demande pas juste le nombre de lignes
		if ((this.m_oSegment.m_nDebut != -1) && (this.m_oSegment.m_nTaille != -1))
		{
			// Selon si on demande un tri de colonnes
			sRequete = ((this.m_nColonneTri > -1) ? this.sCommandeAjax_LignesTriTable : this.sCommandeAjax_LignesTable) + "=" + clWDEncode.sEncodePOST(this.m_oChampTable.m_sAliasChamp);
			//	- contexte d'execution (specifique)
			sRequete += "&" + this.m_oSegment.m_nDebut + "=" + this.m_oSegment.m_nTaille;
			//	- Ordre de tri (specifique)
			if (this.m_nColonneTri >= 0)
			{
				// La syntaxe de la requete de tri est maintenant de la forme WD_TABLE_COL_TRI_=[-]NumeroColonne
//				sRequete += "&" + this.m_nColonneTri + "=" + (bTriCroissant ? "1" : "0");
				sRequete += "&" + this.sParametreAjax_ColTri + "=" + (bTriCroissant ? "" : "-") + this.m_nColonneTri;
			}
		}
		else
		{
			sRequete = this.sCommandeAjax_ParCourtAP + "=" + clWDEncode.sEncodePOST(this.m_oChampTable.m_sAliasChamp);
		}

		// Ajoute la position du parcours en AP si besoin
		sRequete += this.sConstuitAWP(false);

		//	- Cle de la ligne si disponible (Table/ZRs AWP)
		if (sCleEnreg.length > 0)
		{	// On doit encode la cle car elle peut contenir des + et des = qui sont decode/remplace lors de la reception du POST
			sRequete += "&" + this.sParametreAjax_CleEnreg_Pos + "=" + nCleEnregPos;
			sRequete += "&" + this.sParametreAjax_CleEnreg + "=" + clWDEncode.sEncodePOST(sCleEnreg);
		}

		// On renvoie la requete creee
		return sRequete;
	},

	// Construit la le debut de la requete pour la modification dans une table/ZR
	// tabContenu :	- Valeurs de la ligne du cache pour les tables
	//				- Champs de la ligne pour les ZR
	sConstuitRequeteModifLigne: function(bZR, tabContenu, sCleEnreg)
	{
		//	- Commande AJAX (non specifique)
		var sRequete = this.sCommandeAjax_ModifTable + "=" + clWDEncode.sEncodePOST(this.m_oChampTable.m_sAliasChamp);
		//	- Numero de ligne
		sRequete += "&" + "LIGNE" + "=" + this.m_nLigne;
		//	- Cle de la ligne si disponible (Table/ZRs AJAX)
		if (sCleEnreg.length > 0)
		{	// On doit encode la cle car elle peut contenir des + et des = qui sont decode/remplace lors de la reception du POST
			sRequete += "&" + this.sParametreAjax_CleEnreg + "=" + clWDEncode.sEncodePOST(sCleEnreg);
		}

		// Ajoute la position du parcours en AP si besoin
		sRequete += this.sConstuitAWP(false);

		// Valeurs (Specifiques)
		if (bZR)
		{
			var sValeur = clWDAJAXMain.sConstruitValeurPage(tabContenu);
			if (sValeur != "")
				sRequete += "&" + sValeur;
		}
		else
		{
			var tabParamValeur = new Array(tabContenu.length);
			var i;
			var nLimiteI = tabContenu.length;
			for (i = 0; i < nLimiteI; i++)
			{
				if ((tabContenu[i].m_nValeur !== undefined) && (tabContenu[i].m_nValeur !== -1))
					tabParamValeur[i] = "C" + i + "=" + tabContenu[i].m_nValeur;
				else
					tabParamValeur[i] = "C" + i + "=" + clWDEncode.sEncodePOST(tabContenu[i].m_sValeur);
			}
			sRequete += "&" + tabParamValeur.join("&");
		}

		// On renvoie le debut de la requete creee
		return sRequete;
	},

	// Construit la requete pour la selection dans une table
	sConstuitRequeteSelection: function(nColonneLien, nDebut, nNombre, sCleEnreg)
	{
		//	- Detail
		var sRequete = this.sParametreAjax_Debut + "=" + nDebut + "&" + this.sParametreAjax_Nombre + "=" + nNombre;
		//	- Colonne lien si besoin : On met le parametre en indic WL pour detecter les problemes dans le serveur
		sRequete += "&" + this.sParametreAjax_ColonneLien + "=" + (nColonneLien != -1 ? nColonneLien + 1 : "");
		//	- Cle de la ligne si disponible (Table/ZRs AJAX)
		if (sCleEnreg.length > 0)
		{	// On doit encode la cle car elle peut contenir des + et des = qui sont decode/remplace lors de la reception du POST
			sRequete += "&" + this.sParametreAjax_CleEnreg + "=" + clWDEncode.sEncodePOST(sCleEnreg);
		}

		// Ajoute la position du parcours en AP si besoin
		sRequete += this.sConstuitAWP(true);

		// On renvoie la requete creee
		return sRequete;
	},

	// Valeur par defaut des variables : mis dans le prototype
	EnvoiRequete: function(oSegment, nColonneTri, bTriCroissant, nCleEnregPos, sCleEnreg)
	{
		// Nombre de lignes demandes
		this.m_oSegment = oSegment;
		// Tri demande
		this.m_nColonneTri = nColonneTri;

		// On demande les (nFin - nDebut) lignes a partir de nDebut
		this.m_nIdRequeteAJAX = clWDAJAXMain.AJAXRecupereLignesTable(this, this.sConstuitRequeteLignesTable(bTriCroissant, nCleEnregPos, sCleEnreg));

		// On s'ajoute au cache si il n'y a pas d'erreur
		if (this.m_nIdRequeteAJAX === false)
		{
			delete this.m_nIdRequeteAJAX;
			return;
		}
		else
		{
			this.m_oChampTable.m_oCache.m_tabRequetes.push(this);
		}
	},

	EnvoiRequeteRecherche: function(nNombre, nMarge, nColonneTri, sValeur)
	{
		// Tri demande
		this.m_nColonneTri = nColonneTri;

		// On demande les (nFin - nDebut) lignes a partir de nDebut
		this.m_nIdRequeteAJAX = clWDAJAXMain.AJAXRecupereLignesTable(this, this.sConstuitRequeteRechercheTable(nNombre, nMarge, sValeur));

		// On s'ajoute au cache si il n'y a pas d'erreur
		if (this.m_nIdRequeteAJAX === false)
		{
			delete this.m_nIdRequeteAJAX;
			return;
		}
		else
		{
			this.m_oChampTable.m_oCache.m_tabRequetes.push(this);
		}
	},

	// Envoi une requete de modification d'une ligne de table/ZR
	// tabContenu :	- Valeurs de la ligne du cache pour les tables
	//				- Champs de la ligne pour les ZR
	EnvoiRequeteModifLigne: function(nLigneAbsolue, bZR, tabContenu, sCleEnreg)
	{
		this.m_nLigne = nLigneAbsolue;

		// On demande les (nFin - nDebut) lignes a partir de nDebut
		this.m_nIdRequeteAJAX = clWDAJAXMain.AJAXRecupereLignesTable(this, this.sConstuitRequeteModifLigne(bZR, tabContenu, sCleEnreg));

		// On s'ajoute au cache si il n'y a pas d'erreur
		if (this.m_nIdRequeteAJAX === false)
		{
			delete this.m_nIdRequeteAJAX;
			return;
		}
		else
		{
			this.m_oChampTable.m_oCache.m_tabRequetes.push(this);
		}
	},

	EnvoiRequeteSelection: function(nColonneLien, nDebut, nNombre, sCleEnreg)
	{
		var bSubmit = nColonneLien != -1 ? (this.m_oChampTable.nColonneLien(nColonneLien) == 2) : false;
		// On demande les (nFin - nDebut) lignes a partir de nDebut
		this.m_nIdRequeteAJAX = clWDAJAXMain.AJAXRecupereLignesTableSelection(this, this.sConstuitRequeteSelection(nColonneLien, nDebut, nNombre, sCleEnreg), bSubmit);

		// On s'ajoute au cache si il n'y a pas d'erreur
		if (this.m_nIdRequeteAJAX === false)
		{
			delete this.m_nIdRequeteAJAX;
			return;
		}
		else
		{
			this.m_oChampTable.m_oCache.m_tabRequetes.push(this);
		}
	},

	// Traite la reponse du serveur
	ActionListe: function(oXMLLignes)
	{
		// Si ona ete supprime : notre pointeur sur la table est null
		if (!this.m_oChampTable)
		{
			return;
		}

		// Puis demande au cache de nous supprimer en sauvant notre pointeur sur la table car celui-ci va etre mis a null
		var oChampTable = this.m_oChampTable;
		this.SupprimeRequete(false);

		// Remplis le cache et met a jour l'affichage
		if (oChampTable.bActionListe(oXMLLignes))
		{
			// Et on demande la MAJ de la ligne si besoin
			if (this.m_nLigne > -1)
			{
				if (((oChampTable.m_nNbLignesPage == 0) && (this.m_nLigne < oChampTable.m_nNbLignes)) || ((oChampTable.m_nNbLignesPage != 0) && (this.m_nLigne >= oChampTable.m_nDebut) && (this.m_nLigne <= oChampTable.m_nDebut + oChampTable.m_nNbLignesPage + 1)))
				{
					oChampTable.MAJLigne(this.m_nLigne);
				}
			}
		}
	},

	// Calcule si notre requete est encore valide
	bEstValide: function()
	{
		// On calcule la difference avec la date courante : limite => 10 secondes
		return ((new Date()).getTime() - this.m_oDate.getTime() <= 10000);
	},

	// Se supprime soit meme
	SupprimeRequete: function(bReinitTable)
	{
		// Sauve le pointeur sur la table
		var oChampTable = this.m_oChampTable;
		// Se libere
		oChampTable.m_oCache.SupprimeRequete(this);

		// Et reinit la table au besoin
		if (bReinitTable)
		{
			// On ne le fait pas immediatement pour ne pas flooder le serveur
			oChampTable.nSetTimeout("Reinit", 2000);
		}
	}
};

// Classe representant une ligne de cache modifiee
function WDTableCacheLigneModifie(oCacheLigne)
{
	// Sauve la ligne de cache
	this.m_oCacheLigne = oCacheLigne;

	// Change la ligne pointe par la ligne physique
	this.m_oCacheLigne.m_oLigneHTML.SwapLigneCache(this.m_oCacheLigne.m_nColonneHTML, this);

	// Initialise le tableau des valeurs modifiees
	this.m_tabValeursChaine = new Array(oCacheLigne.m_tabValeurs.length);
	// Et le tableau des valeurs entieres (Combo/Interrupteur)
	this.m_tabValeursEntier = new Array(oCacheLigne.m_tabValeurs.length);
};

WDTableCacheLigneModifie.prototype.bLigneVirtuelle = true;

// Recupere la ligne dans le HTML
WDTableCacheLigneModifie.prototype.vnGetLigneHTML = function vnGetLigneHTML(nLigneAbsolue)
{
	return this.m_oCacheLigne.vnGetLigneHTML.apply(this.m_oCacheLigne, arguments);
};

// Recupere la colonne dans le HTML
WDTableCacheLigneModifie.prototype.vnGetColonneHTML = function vnGetColonneHTML()
{
	return this.m_oCacheLigne.vnGetColonneHTML.apply(this.m_oCacheLigne, arguments);
};

// Recupere le contenu d'une cellule
WDTableCacheLigneModifie.prototype.sGetCellule = function sGetCellule(nColonne, bPourEntier)
{
	if (this.m_tabValeursChaine[nColonne])
		return bPourEntier ? this.m_tabValeursEntier[nColonne] : this.m_tabValeursChaine[nColonne];
	else
		return this.m_oCacheLigne.sGetCellule.apply(this.m_oCacheLigne, arguments);
};

// Renvoie le tableaux des options d'une cellule combo
WDTableCacheLigneModifie.prototype.tabContenuCellule = function tabContenuCellule()
{
	return this.m_oCacheLigne.tabContenuCellule.apply(this.m_oCacheLigne, arguments);
};

// Recupere la cle d'un enreg
WDTableCacheLigneModifie.prototype.sGetCleEnreg = function sGetCleEnreg()
{
	return this.m_oCacheLigne.sGetCleEnreg.apply(this.m_oCacheLigne, arguments);
};

// Met le contenu dans une ligne du HTML
WDTableCacheLigneModifie.prototype.bMAJLigne = function bMAJLigne(nLigneAbsolue, oChampTable)
{
	// Met la valeur depuis la ligne en cache
	this.m_oCacheLigne.bMAJLigne.apply(this.m_oCacheLigne, arguments);

	var tabValeurs = this.m_tabValeursChaine;

	// Puis ecrit nos valeurs par dessus
	var i;
	var nLimiteI = tabValeurs.length;
	for (i = 0; i < nLimiteI; i++)
	{
		if (tabValeurs[i] !== undefined)
		{
			var oValeur = tabValeurs[i];
			// Remplit la cellule
			oChampTable.vRemplitCellule(this.m_oCacheLigne.m_oLigneHTML.oGetCellule(this.m_oCacheLigne.m_nColonneHTML, i, oChampTable), tabValeurs[i], nLigneAbsolue, i);
		}
	}

	// Non il n'y a pas de modifications en modification des donnees d'une ligne de table
//	// Remplit les ruptures
//	oChampTable.RemplitRuptures(nLigneEffective, this.vnGetColonneEffective(nLigneAbsolue, 0), this.m_oValeursRuptures);

	return true;
};

// Detache la ligne
WDTableCacheLigneModifie.prototype.DetacheEtVide = function DetacheEtVide(oChampTable)
{
	this.m_oCacheLigne.DetacheEtVide(oChampTable);
};

// Indique que l'on a change la valeur de la colonne donnee
WDTableCacheLigneModifie.prototype.ChangementValeur = function ChangementValeur(nColonne, sValeur, nValeur)
{
	if (nColonne < this.m_tabValeursChaine.length)
	{
		this.m_tabValeursChaine[nColonne] = sValeur;
		this.m_tabValeursEntier[nColonne] = nValeur;
	}
};

// Valide les changements fait dans la ligne
WDTableCacheLigneModifie.prototype.ValideChangement = function ValideChangement(oTableCache, nLigneAbsolue)
{
	var bChangement = false;

	var tabValeursChaine = this.m_tabValeursChaine;
	var tabValeursEntier = this.m_tabValeursEntier;

	// Place les valeurs dans la ligne du cache
	var i;
	var nLimiteI = tabValeursChaine.length;
	for (i = 0; i < nLimiteI; i++)
	{
		if (tabValeursChaine[i] !== undefined)
		{
			bChangement |= this.m_oCacheLigne.bChangementValeur(i, tabValeursChaine[i], tabValeursEntier[i]);
		}
	}

	// Construit une requete pour le serveur s'il y a eu des changement
	if (bChangement)
	{
		oTableCache.CreeRequeteModifLigne(nLigneAbsolue, false, this.m_oCacheLigne.m_tabValeurs);
	}
};

// Fixe la hauteur de la ligne
WDTableCacheLigneModifie.prototype.SetHauteur = function SetHauteur()
{
	return this.m_oCacheLigne.SetHauteur.apply(this.m_oCacheLigne, arguments); ;
};

// Lit la hauteur de la ligne
WDTableCacheLigneModifie.prototype.nGetHauteur = function nGetHauteur()
{
	return this.m_oCacheLigne.nGetHauteur.apply(this.m_oCacheLigne, arguments);
};

// Change le style de la ligne
WDTableCacheLigneModifie.prototype.SetStyle = function SetStyle()
{
	return this.m_oCacheLigne.SetStyle.apply(this.m_oCacheLigne, arguments);
};

// Classe representant une ligne de cache
function WDTableCacheLigne (oXMLLigne, oChampTable, nLigne)
{
	// Si on est dans le constructeur pour la declaration de l'heritage
	if (!oXMLLigne)
	{
		return;
	}

	// Si on a un attribut de style de la ligne : on le stocke
//	this.m_sStyleCouleur = this.sTransformeCouleur(oXMLLigne, false);
//	this.m_sStyleCouleurFond = this.sTransformeCouleur(oXMLLigne, true);
	this.m_sStyleCouleur = clWDAJAXMain.sXMLGetAttributSafe(oXMLLigne, this.XML_STYLE_COULEUR, "");
	this.m_sStyleCouleurFond = clWDAJAXMain.sXMLGetAttributSafe(oXMLLigne, this.XML_STYLE_COULEURF, "");
	this.m_sCleEnreg = clWDAJAXMain.sXMLGetAttributSafe(oXMLLigne, this.XML_CLEENREG, "");
	// On ne doit prendre this.XML_LIGNE_POSABSOLUE que s'il est disponible
	this.m_nPosAbsolue = clWDAJAXMain.nXMLGetAttributSafe(oXMLLigne, this.XML_LIGNE_POSABSOLUE, nLigne);

	// Traite le cas des ruptures si elles existent
	var oXMLRupture = oXMLLigne.getElementsByTagName(this.XML_RUPTURES);
	if (oXMLRupture && oXMLRupture.length)
	{
		// Le contenu des ruptures
		this.m_oValeursRuptures = new Object();
		var oXMLRuptureHaut = oXMLRupture[0].getElementsByTagName(this.XML_RUPTURES_HAUT);
		if (oXMLRuptureHaut && oXMLRuptureHaut.length)
		{
			this.m_oValeursRuptures.m_sHaut = clWDAJAXMain.sXMLGetValeur(oXMLRuptureHaut[0]);
		}
		var oXMLRuptureBas = oXMLRupture[0].getElementsByTagName(this.XML_RUPTURES_BAS);
		if (oXMLRuptureBas && oXMLRuptureBas.length)
		{
			this.m_oValeursRuptures.m_sBas = clWDAJAXMain.sXMLGetValeur(oXMLRuptureBas[0]);
		}
	}

	// La valeurs
	var oXMLLigneChildNodes = oXMLLigne.childNodes;
	// Si on a une balise RUPTURES (normalement a la fin) il faut ignorer le dernier fils
	var i;
	var nLimiteI = oXMLLigneChildNodes.length - (this.m_oValeursRuptures ? 1 : 0);
	var tabValeurs = new Array(nLimiteI);
	for (i = 0; i < nLimiteI; i++)
	{
		// Optim ???
		var oXMLCellule = oXMLLigneChildNodes[i];
		var oXMLCelluleChildNodes = oXMLCellule.childNodes;

		var oCellule = new Object()

		// Si on a un attribut de style de la cellule : on le stocke
//		oCellule.m_sStyleCouleur = this.sTransformeCouleur(oXMLCellule, false);
//		oCellule.m_sStyleCouleurFond = this.sTransformeCouleur(oXMLCellule, true);
		oCellule.m_sStyleCouleur = clWDAJAXMain.sXMLGetAttributSafe(oXMLCellule, this.XML_STYLE_COULEUR, "");
		oCellule.m_sStyleCouleurFond = clWDAJAXMain.sXMLGetAttributSafe(oXMLCellule, this.XML_STYLE_COULEURF, "");

		// Si on est dans le cas d'une ZR on lit la balise millieu
		if ((oXMLCelluleChildNodes.length == 3) && (oXMLCelluleChildNodes[1].nodeName == WDAJAXMain.prototype.XML_CHAMP_LIGNES_LIGNE_CORPS))
		{
			oCellule.m_sValeur = clWDAJAXMain.sXMLGetValeur(oXMLCelluleChildNodes[1]);
		}
		else
		{
			oCellule.m_sValeur = clWDAJAXMain.sXMLGetValeur(oXMLCellule);

			// Proprietes specifiques
			switch (oChampTable.nColonneType(i))
			{
			// Combo
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_COMBO:
				// Regarde si la cellule n'a pas un ..Contenu specifique
				var tabOptions = clWDAJAXMain.tabXMLGetTableauValeur(oXMLCellule, "OPTION");

				// Si non : prend la valeur generale de la colonne comme valeur
				if (!tabOptions)
				{
					tabOptions = oChampTable.tabColonneCombo(i);
				}

				// Et memorise le contenu dans tous les cas
				oCellule.m_tabOptions = tabOptions;

				if (tabOptions)
				{
					var sValeur = oCellule.m_sValeur;
					var j;
					var nLimiteJ = tabOptions.length;
					for (j = 0; j < nLimiteJ; j++)
					{
						if (sValeur == tabOptions[j])
						{
							oCellule.m_nValeur = j;
							break;
						}
					}
				}
				else
				{
					// Pas de tableau des options : saturation
					oCellule.m_nValeur = -1;
				}
				break;

			// Interrupteur
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_INTERRUPTEUR:
				oCellule.m_nValeur = parseInt(oCellule.m_sValeur, 10);
				break;

			// Image
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_IMAGE:
				break;

			// Autres
			default:
				// Et fait comme le champ de saisie => Pas de break
			// Saisie
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE:
				break;
			}
		}

		tabValeurs[i] = oCellule;
	}
	this.m_tabValeurs = tabValeurs;

};

//WDTableCacheLigne.prototype.XML_STYLE = "STYLE";
WDTableCacheLigne.prototype.XML_STYLE_COULEUR = "COULEUR";
WDTableCacheLigne.prototype.XML_STYLE_COULEURF = "COULEURFOND";
WDTableCacheLigne.prototype.XML_CLEENREG = "CLEENREG";
WDTableCacheLigne.prototype.XML_LIGNE_POSABSOLUE = "POSABSOLUE";
WDTableCacheLigne.prototype.XML_RUPTURES = "RUPTURES";
WDTableCacheLigne.prototype.XML_RUPTURES_HAUT = "HAUT";
WDTableCacheLigne.prototype.XML_RUPTURES_BAS = "BAS";
WDTableCacheLigne.prototype.m_oVide = { m_sValeur:"", m_sStyleCouleur:"", m_sStyleCouleurFond:"", m_nValeur:-1, m_sCleEnreg:"" };
WDTableCacheLigne.prototype.m_nValeur = -1;
WDTableCacheLigne.prototype.m_nHauteur = -1;

// Recupere la ligne dans le HTML
WDTableCacheLigne.prototype.vnGetLigneHTML = function vnGetLigneHTML(nLigneAbsolue)
{
	return nLigneAbsolue;
};

// Recupere la colonne dans le HTML
WDTableCacheLigne.prototype.vnGetColonneHTML = function vnGetColonneHTML()
{
	return 0;
};

// Recupere le contenu d'une cellule
WDTableCacheLigne.prototype.sGetCellule = function sGetCellule(nColonne, bPourEntier)
{
	var oValeur = (nColonne < this.m_tabValeurs.length) ? this.m_tabValeurs[nColonne] : this.m_oVide;
	return bPourEntier ? oValeur.m_nValeur : oValeur.m_sValeur;
};

// Renvoie le tableaux des options d'une cellule combo
WDTableCacheLigne.prototype.tabContenuCellule = function tabContenuCellule(nColonne)
{
	return this.m_tabValeurs[nColonne].m_tabOptions;
};

// Recupere la cle d'un enreg
WDTableCacheLigne.prototype.sGetCleEnreg = function sGetCleEnreg()
{
	return this.m_sCleEnreg;
};

// Transforme une couleur si besoin
WDTableCacheLigne.prototype.sTransformeCouleur = function sTransformeCouleur(oXML, bCouleurFond)
{
	var sCouleur = clWDAJAXMain.sXMLGetAttributSafe(oXML, bCouleurFond ? this.XML_STYLE_COULEURF : this.XML_STYLE_COULEUR, "");
	// Si la couleur est vide : force transparent ou noir
	return sCouleur.length > 0 ? sCouleur : "";
};

// Met le contenu du cache dans une ligne du HTML
WDTableCacheLigne.prototype.bMAJLigne = function bMAJLigne(nLigneAbsolue, oChampTable)
{
	// Calcule si la ligne est selectionnee
	// Dans les ZR il n'y a pas de style de ligne selectionnee donc on ne doit pas supprimer les couleurs locales
	var bSelectedSansZR = oChampTable.vLigneEstSelectionneeSansZR();

	// Si le numero est HORS du HTML, n'affiche pas la ligne
	if (!this.m_oLigneHTML)
	{
		return false;
	}

	// Met le style dans la ligne
	var nColonneHTML = this.vnGetColonneHTML();
	var oLigneHTML = this.m_oLigneHTML.oGetLigneLogiqueHTML(nColonneHTML);
	this.SetCouleurObjet(oLigneHTML, bSelectedSansZR ? this.m_oVide : this);

	var tabValeurs = this.m_tabValeurs;

	// On parcours les valeur pour les mettre dans le HTML
	var i = 0;
	var nLimiteI = tabValeurs.length;
	var oCellule = this.m_oLigneHTML.oGetCellule(nColonneHTML, i, oChampTable);
	while (oCellule || (i < nLimiteI))
	{
		if (oCellule)
		{
			var oValeur = (i < nLimiteI) ? tabValeurs[i] : this.m_oVide;
			// Remplit la cellule
			oChampTable.vRemplitCellule(oCellule, oValeur.m_sValeur, nLigneAbsolue, i);

			oCellule = oCellule.parentNode;
			// 65479 Si on est dans dans une table avec hauteur variable, il faut prendre un niveau au dessus
			if ((oChampTable.m_nType == WDAJAXMain.prototype.XML_CHAMP_TYPE_TABLE) && oChampTable.bGetHauteurLigneVariable())
			{
				oCellule = oCellule.parentNode;
			}

			// Et met son style
			this.SetCouleurObjet(oCellule, bSelectedSansZR ? this.m_oVide : oValeur);
		}

		// Et passe a la suivante
		oCellule = this.m_oLigneHTML.oGetCellule(nColonneHTML, (++i), oChampTable);
	}

	// Remplit les ruptures
	oChampTable.RemplitRuptures(this.m_oLigneHTML, nColonneHTML, this.m_oValeursRuptures);

	return true;
};

// Detache la ligne
WDTableCacheLigne.prototype.DetacheEtVide = function DetacheEtVide(oChampTable)
{
	if (this.m_oLigneHTML)
	{
		this.m_oLigneHTML.DetacheEtVide(this.m_nColonneHTML, oChampTable);
	}
};

// Indique que l'on a change la valeur de la colonne donnee
WDTableCacheLigne.prototype.ChangementValeur = function ChangementValeur(nColonne, sValeur, nValeur)
{
	// Normalement on ne passe pas ici
};

// Defini la couleur d'un objet
WDTableCacheLigne.prototype.SetCouleurObjet = function SetCouleurObjet(oObjet, oCouleur)
{
	// Recupere les objets de manipulation du style
	var oStyle = oObjet.style;
	var oCurrentStyle = _JGCS(oObjet);

	// Couleur
	if (oStyle.color != oCouleur.m_sStyleCouleur)
	{
		oStyle.color = oCouleur.m_sStyleCouleur;
	}

	// Couleur de fond
	if (oStyle.backgroundColor != oCouleur.m_sStyleCouleurFond)
	{
		oStyle.backgroundColor = oCouleur.m_sStyleCouleurFond;
	}
};

// Indique que l'on a change la valeur de la colonne donnee
WDTableCacheLigne.prototype.bChangementValeur = function bChangementValeur(nColonne, sValeur, nValeur)
{
	var tabValeurs = this.m_tabValeurs;

	// Si la colonne existe et change
	if ((nColonne < tabValeurs.length) && !(tabValeurs[nColonne].m_sValeur === sValeur))
	{
		tabValeurs[nColonne].m_sValeur = sValeur;
		tabValeurs[nColonne].m_nValeur = nValeur;
		return true;
	}
	return false;
};

// Fixe la hauteur de la ligne
WDTableCacheLigne.prototype.SetHauteur = function SetHauteur(nHauteur)
{
	this.m_nHauteur = nHauteur;
};

// Lit la hauteur de la ligne
WDTableCacheLigne.prototype.nGetHauteur = function nGetHauteur()
{
	return this.m_nHauteur;
};

// Change le style de la ligne
WDTableCacheLigne.prototype.SetStyle = function SetStyle(sStyle, oChampTable, nLigneAbsolue, oEvent)
{
	// Modifie le style de la ligne
	if (this.m_oLigneHTML)
	{
		this.m_oLigneHTML.SetStyle(this.m_nColonneHTML, sStyle);
		// Et force la MAJ si la ligne est pleine : ce qui est normalement le cas puisqu'on est ici
		this.m_oLigneHTML.bMAJSiPlein(this.m_nColonneHTML, oChampTable, nLigneAbsolue, oEvent);
	}
};

// Representation d'un segment de lignes entre 0 et nMax
function Segment (nDebut, nTaille, nMax)
{
	this.m_nDebut = nDebut;
	this.m_nTaille = nTaille;

	// On commence forcement a zero
	if (this.m_nDebut < 0)
	{	// Sauf que -1, -1 est autorise
		if ((this.m_nDebut != -1) && (this.m_nTaille != -1))
		{
			// Ainsi que zero en taille
			if (this.m_nTaille != 0) this.m_nTaille += this.m_nDebut;
			this.m_nDebut = 0
		}
	}

	// Et on se limite a nMax lignes si besoin
	if (nMax >= 0)
	{
		if (this.m_nDebut >= nMax)
		{
			// Se vide
			delete this.m_nDebut;
			delete this.m_nTaille;
			return;
		}

		if (this.m_nDebut + this.m_nTaille > nMax)
		{
			// Limite le nombre de lignes
			if (this.m_nTaille != 0) this.m_nTaille = nMax - this.m_nDebut;
		}
	}
};

// Valeur par defaut
Segment.prototype.m_nDebut = -1;
Segment.prototype.m_nTaille = 0;

// Calcule l'intersection avec un autre segment, se modifie pour ne contenir que la partie non interceptee
// Renvoie vrai si le segment resultat est vide
// On ne peut englober un precedent segment
Segment.prototype.bIntersecte = function bIntersecte(oSegment)
{
	// Si vide => Fini
	if ((this.m_nDebut == -1) || (this.m_nTaille <= 0))
	{
		return true;
	}

	// Si toutes les lignes dans l'autre segment
	if (oSegment && (oSegment.m_nTaille == 0))
	{
		// Se vide
		delete this.m_nDebut;
		delete this.m_nTaille;
		return true;
	}

	// Si l'autre est vide=> Fini
	if ((!oSegment) || (oSegment.m_nDebut == -1) || (oSegment.m_nTaille <= 0))
	{
		return false;
	}
	// Si on est dedans => Fini
	if ((this.m_nDebut >= oSegment.m_nDebut) && (this.m_nDebut + this.m_nTaille <= oSegment.m_nDebut + oSegment.m_nTaille))
	{
		// Se vide
		delete this.m_nDebut;
		delete this.m_nTaille;
		return true;
	}
	// Si on est avant avec intersection
	else if ((this.m_nDebut < oSegment.m_nDebut) && (this.m_nDebut + this.m_nTaille > oSegment.m_nDebut))
	{
		// Se vide du surplus
		this.m_nTaille = oSegment.m_nDebut - this.m_nDebut;
		return false;
	}
	// Si on est apres avec intersection
	else if ((this.m_nDebut >= oSegment.m_nDebut) && (this.m_nDebut < oSegment.m_nDebut + oSegment.m_nTaille) && (this.m_nDebut + this.m_nTaille > oSegment.m_nDebut + oSegment.m_nTaille))
	{
		// Deplace le debut
		this.m_nTaille -= oSegment.m_nDebut + oSegment.m_nTaille - this.m_nDebut;
		this.m_nDebut = oSegment.m_nDebut + oSegment.m_nTaille;
		return false;
	}
	return false;
};

// Indique si le segment est vide
Segment.prototype.bEstVide = function bEstVide()
{
//	return ((this.m_nTaille <= 0) || ((this.m_nDebut < 0) && (this.m_nDebut + this.m_nTaille <= 0)))
	return ((this.m_nTaille < 0) || ((this.m_nDebut < 0) && (this.m_nDebut + this.m_nTaille <= 0)))
};

// Classe representant un le cache
function WDTableCache (oChampTable)
{
	// On sauve l'objet qui represente la table que l'on manipule
	this.m_oChampTable = oChampTable;

	// Recalcule les marges
	this.RecalculeMarges(oChampTable.m_nNbLignesPage, oChampTable.m_nPagesMargeMin, oChampTable.m_nPagesMargeMax, oChampTable.m_nPagesMargeRequete);

	// Et aucunes lignes de cache
	this.m_tabLignes = new Array();

	// Le tableaux des zones demandes
	this.m_tabRequetes = new Array();
};

WDTableCache.prototype =
{
	m_nDebutCache: -1, // Au debut on a un cache vide
	XML_LIGNE: "LIGNE",
	XML_LIGNE_NUMERO: "NUMERO",

	// Recalcule le nombre d'elements de marge dans le cache par rapport a la position de la premiere ligne affichee
	RecalculeMarges: function(nNbLignesPage, nPagesMargeMin, nPagesMargeMax, nPagesMargeRequete)
	{
		// Si pas de limite au nombre de ligne => Fini
		if (nNbLignesPage == 0)
			return;

		// Nombre minimum de marge dans le cache avant de refaire une demande
		this.m_nLignesMargeMinAvant = nPagesMargeMin * nNbLignesPage;
		this.m_nLignesMargeMinTaille = (nPagesMargeMin * 2 + 1) * nNbLignesPage + 2;
		// Nombre maximum de marge dans le cache avant de virer du cache
		this.m_nLignesMargeMaxAvant = nPagesMargeMax * nNbLignesPage;
		this.m_nLignesMargeMaxApres = (nPagesMargeMax + 1) * nNbLignesPage + 2;
		// Marge mimimum lors de requetes de lignes dans le cache
		this.m_nLignesMargeRequeteAvant = Math.min(nPagesMargeRequete * nNbLignesPage, this.m_nLignesMargeMaxAvant);
		this.m_nLignesMargeRequeteTaille = Math.min((nPagesMargeRequete * 2 + 1) * nNbLignesPage + 2, this.m_nLignesMargeMaxAvant + this.m_nLignesMargeMaxApres);
	},

	// Remplit le cache avec des donnees si besoin
	RemplitCache: function(nPosition, bForce, nColonneTri, bTriCroissant)
	{
		// Force si on a un tri
		if (nColonneTri > -1)
		{
			// Invalide completement le cache ce qui equivant a bForce = ture
			this.m_tabLignes.length = 0;
			delete this.m_nDebutCache;
		}

		var oCacheRequete;
		// Si on est dans le cas sans limite de lignes : on demande toujours toutes les lignes
		if (this.m_oChampTable.m_nNbLignesPage == 0)
		{
			oCacheRequete = new Segment(0, 0);
		}
		else
		{
			// On demande par defaut les valeurs autour de la position donnee en se limitant au nombre de lignes de la table
			var oCacheMin = new Segment(Math.max(0, nPosition - this.m_nLignesMargeMinAvant), this.m_nLignesMargeMinTaille, bForce ? -1 : this.m_oChampTable.m_nNbLignes);
			// On demande un mimimun de lignes apres la fin pour el cas ou celle-ci change
			oCacheRequete = new Segment(Math.max(0, nPosition - this.m_nLignesMargeRequeteAvant), this.m_nLignesMargeRequeteTaille, bForce ? -1 : this.m_oChampTable.m_nNbLignes + this.m_nLignesMargeMinTaille);

			// Si le cache est non vide, et que l'on ne force pas on regarde ce qu'il manque et on le demande
			if ((this.m_nDebutCache != -1) && (!bForce))
			{
				// Si on a assez de lignes dans le cache
				var oCache = new Segment(Math.max(0, this.m_nDebutCache), this.m_tabLignes.length);
				if (oCacheMin.bIntersecte(oCache))
				{
					return;
				}

				// Puis on regarde si notre requete intersecte les precedentes demandes
				if (this.bIntersecteAnciennesRequetes(oCacheMin, nColonneTri > -1))
				{
					return;
				}

				// On intersecte la requete avec le cache courant
				oCacheRequete.bIntersecte(oCache);
			}
		}

		// Si il n'y a pas intersection : on intersecte la requete minimale avec le cache actuel et les requetes en cours pour avori la requete minimale
		if (!this.bIntersecteAnciennesRequetes(oCacheRequete, nColonneTri > -1))
		{
			// En mode AWP : Trouve l'enreg le plus proche dans le cache pour se positionner dessus
			var nCleEnregPos = -1;
			var sCleEnreg = "";
			if (clWDAJAXMain.m_bPageAWP)
			{
				if ((this.m_nDebutCache >= 0) && (this.m_oChampTable.m_nNbLignesPage != 0))
				{
					// Si le debut du cache est avant la zone en requete
					if (this.m_nDebutCache < oCacheRequete.m_nDebut)
					{
						// On prend le plus proche dans le cache
						nCleEnregPos = Math.min(this.m_nDebutCache + this.m_tabLignes.length - 1, oCacheRequete.m_nDebut - 1);
					}
					else
					{
						nCleEnregPos = Math.max(this.m_nDebutCache, oCacheRequete.m_nDebut + oCacheRequete.m_nTaille);
					}
					sCleEnreg = this.sGetCleEnregLigne(nCleEnregPos);
				}

				// Si on n'a pas de positionnement : utilise la cle fournis pour la position de debut
				if ((this.m_oChampTable.m_nDebut > -1) && (this.m_oChampTable.m_sCleDebut) &&
					((nCleEnregPos == -1) || (Math.abs(this.m_oChampTable.m_nDebut - oCacheRequete.m_nDebut) < Math.abs(this.m_oChampTable.m_nDebut - nCleEnregPos))))
				{
					nCleEnregPos = this.m_oChampTable.m_nDebut;
					sCleEnreg = this.m_oChampTable.m_sCleDebut;
				}
			}

			// Cree la requete qui va bien
			this.CreeRequete(oCacheRequete, nColonneTri, bTriCroissant, nCleEnregPos, sCleEnreg);
		}
	},

	// Calcule l'intersection d'une requete avec les requetes precedentes
	// Renvoie vrai si la requetes resultat est vide
	bIntersecteAnciennesRequetes: function(oRequete, bForce)
	{
		// Vire les anciennes requetes qui sont en timeout
		this.PurgeAnciennesRequetes(bForce);

		// Regarde si il y a intersection avec de precedente requetes
		var i;
		var nLimiteI = this.m_tabRequetes.length;
		for (i = 0; i < nLimiteI; i++)
		{
			// Si la requete intersecte le segment et devient vide
			if (oRequete.bIntersecte(this.m_tabRequetes[i].m_oSegment))
			{
				return true;
			}

			// Ne gere pas le cas de l'englobement
		}

		return oRequete.bEstVide();
	},

	// Verifie si il y a besoin d'envoyer une requete et la cree si besoin
	CreeRequete: function(oCacheRequete, nColonneTri, bTriCroissant, nCleEnregPos, sCleEnreg)
	{
		// Cree une requete que l'on envoie
		var oRequete = new WDCacheRequete(this.m_oChampTable);

		oRequete.EnvoiRequete(oCacheRequete, nColonneTri, bTriCroissant, nCleEnregPos, sCleEnreg);

		// Decide si il faut afficher ou non le picto de travail
		this.m_oChampTable.AfficheLoading();
	},

	// Creer une requete de recherche
	CreeRequeteRecherche: function(nColonneTri, sValeur)
	{

		// Cree une requete que l'on envoie
		var oRequete = new WDCacheRequete(this.m_oChampTable);

		// On ne cree pas la meme requete si on est en nombre de ligne limite par page ou pas
		// Si on est en nombre de ligne illimite this.m_nLignesMargeRequeteAvant n'existe pas
		oRequete.EnvoiRequeteRecherche(this.m_oChampTable.m_nNbLignesPage, this.m_nLignesMargeRequeteAvant ? this.m_nLignesMargeRequeteAvant : 0, nColonneTri, sValeur);

		// Decide si il faut afficher ou non le picto de travail
		this.m_oChampTable.AfficheLoading();
	},

	// Creer une requete de modification de ligne
	// tabContenu :	- Valeurs de la ligne du cache pour les tables
	//				- Champs de la ligne pour les ZR
	CreeRequeteModifLigne: function(nLigneAbsolue, bZR, tabContenu)
	{
		// Cree une requete que l'on envoie
		var oRequete = new WDCacheRequete(this.m_oChampTable);

		// Envoi la requete de recherche
		oRequete.EnvoiRequeteModifLigne(nLigneAbsolue, bZR, tabContenu, this.sGetCleEnregLigne(nLigneAbsolue));

		// Decide si il faut afficher ou non le picto de travail
		this.m_oChampTable.AfficheLoading();
	},

	// Creer une requete de selection de ligne
	CreeRequeteSelection: function(nColonneLien)
	{
		// Cree une requete que l'on envoie
		var oRequete = new WDCacheRequete(this.m_oChampTable);

		// Envoi la requete de recherche
		oRequete.EnvoiRequeteSelection(nColonneLien, this.m_nDebutCache, this.m_tabLignes.length, this.sGetCleEnregLigne(this.m_nDebutCache));

		// Normalement notre parent affiche le masque de loading
//		this.m_oChampTable.AfficheLoading();
	},

	// Calcule la cle d'enreg a utiliser
	sGetCleEnregLigne: function(nLigneAbsolue)
	{
		// Recupere la cle de l'enreg si besoin
		// Si la ligne est dans le cache (Normalement c'est toujours le cas)
		if (this.bDansPlageCache(nLigneAbsolue))
		{
			var oLigne = this.m_tabLignes[nLigneAbsolue - this.m_nDebutCache];
			if (oLigne)
			{
				return oLigne.sGetCleEnreg();
			}
		}
		return "";
	},

	// Vire les anciennes requetes qui sont en timeout
	PurgeAnciennesRequetes: function(bForce)
	{
		var i;
		var nLimiteI = this.m_tabRequetes.length;
		for (i = 0; i < nLimiteI; i++)
		{
			if ((this.m_tabRequetes[i].bEstValide() == false) || bForce)
			{
				delete this.m_tabRequetes[i].m_oChampTable;
				// On commence par rechercher la requete
				var oRequete = clWDAJAXMain.GetWDAJAXRequete(this.m_tabRequetes[i].m_nIdRequeteAJAX);
				// Si on trouve la requete, on l'annule
				if (oRequete != null) oRequete.Annule();
				delete oRequete;

				// Vire la requete du tableau
				this.m_tabRequetes.splice(i, 1);
				// Ne pas oublier le -- sinon on saute une requete
				i--;
				nLimiteI--;
			}
		}

		// Decide si il faut afficher ou non le picto de travail
		this.m_oChampTable.AfficheLoading();
	},

	// Supprime une requete
	SupprimeRequete: function(oRequete)
	{
		// Recherche la requete selon un critere de date et de numero de requete AJAX
		var i;
		var nLimiteI = this.m_tabRequetes.length;
		for (i = 0; i < nLimiteI; i++)
		{
			if ((this.m_tabRequetes[i].m_oDate.getTime() == oRequete.m_oDate.getTime()) && (this.m_tabRequetes[i].m_nIdRequeteAJAX == oRequete.m_nIdRequeteAJAX))
			{
				delete this.m_tabRequetes[i].m_oChampTable;
				// Vire la requete du tableau
				this.m_tabRequetes.splice(i, 1);
				// Et fini
				return;
			}
		}

		// Decide si il faut afficher ou non le picto de travail
		this.m_oChampTable.AfficheLoading();
	},

	// Indique si une requete de tri existe dans le cache
	bAvecRequeteTri: function()
	{
		// Recherche la requete selon un critere de date et de numero de requete AJAX
		var i;
		var nLimiteI = this.m_tabRequetes.length;
		for (i = 0; i < nLimiteI; i++)
		{
			if (this.m_tabRequetes[i].m_nColonneTri > -1)
			{
				// On a trouve une requete
				return true;
			}
		}
		return false;
	},

	// Decide si la ligne numero nLigne a sa place dans le cache
	// Si non => Renvoi -1
	// Si oui => Fait de la place eventuelle dans le cache et renvoi la place de cette ligne
	nPlaceLigneCache: function(nLigne)
	{
		// Si on est pas en nombre de ligne illimite on teste si la ligne est hors cache
		if (this.m_oChampTable.m_nNbLignesPage > 0)
		{
			// Si la ligne est trop loin de la ligne courante => Fini
			if ((nLigne < this.m_oChampTable.m_nDebut - this.m_nLignesMargeMaxAvant) || (nLigne >= this.m_oChampTable.m_nDebut + this.m_nLignesMargeMaxApres))
			{
				return -1;
			}
		}

		// Si on n'a pas encore de cache : on l'initialise
		if (this.m_nDebutCache == -1)
		{
			this.m_nDebutCache = nLigne;
			//assert(this.m_tabLignes.length == 0);
			this.m_tabLignes.push(null);
			return 0;
		}

		// Sinon on agrandi le tableau au besoin
		// Si la ligne est avant le debut du cache
		if (nLigne < this.m_nDebutCache)
		{
			// Si on est "proche" du cache (=> Une partie du cache est
			// On ajoute un tableau vide au debut
			// Insere le nombre d'entre vides qui vont bien et les initialise a zero
			var i;
			var nLimiteI = this.m_nDebutCache - nLigne;
			for (i = 0; i < nLimiteI; i++)
			{
				this.m_tabLignes.unshift(null);
			}
//			this.m_tabLignes = (new Array(this.m_nDebutCache - nLigne)).concat(this.m_tabLignes);
			// Decale le debut
			this.m_nDebutCache = nLigne;
		}
		else if (nLigne >= this.m_nDebutCache + this.m_tabLignes.length)
		{	// Si la ligne est apres la fin
			var i;
			var nLimiteI = nLigne - this.m_nDebutCache - this.m_tabLignes.length + 1;
			for (i = 0; i < nLimiteI; i++)
			{
				this.m_tabLignes.push(null);
			}
//			this.m_tabLignes = this.m_tabLignes.concat(new Array(nLigne - this.m_nDebutCache - this.m_tabLignes.length + 1));
			// Pas de decalage du debut
		}
		else if ((nLigne - this.m_nDebutCache < this.m_tabLignes.length) && (this.m_tabLignes[nLigne - this.m_nDebutCache] != null))
		{	// La ligne est dans la place : on supprime par securite la ligne du cache
			delete this.m_tabLignes[nLigne - this.m_nDebutCache].m_tabValeurs;
			this.m_tabLignes[nLigne - this.m_nDebutCache] = null;
		}

		// Renvoie la distance au debut
		return nLigne - this.m_nDebutCache;
	},

	// Recoit des donnees du serveur et le met dans le cache et analysant le XML des donnees
	RemplitCacheLignes: function(oXMLLignes)
	{
		// Si le debut n'est pas dans le cache c'est que l'on recoit une ancienne requete
		// Et donc la MAJ ne peu pas se faire bien (on ne connait pas l'origine) donc on le calcule
		var bNoteMAJLigne = this.bDansPlageCache(this.m_oChampTable.m_nDebut);

		// Met a jour le cache avec chaque ligne
		var oXMLLigne = oXMLLignes.firstChild;
		while (oXMLLigne != null)
		{
			// Lit le numero de la ligne
			//assert(XMLLigne.nodeName == this.XML_LIGNE);
			var nLigne = parseInt(clWDAJAXMain.sXMLGetAttribut(oXMLLigne, this.XML_LIGNE_NUMERO), 10);

			// Decide si on doit mettre la ligne dans le cache et fait la place si necessaire dans celui-ci
			// On recoit le numero de position dans le cache (ou -1)
			var nPosCacheLigne = this.nPlaceLigneCache(nLigne);
			if (nPosCacheLigne != -1)
			{
				//assert(this.m_tabLignes[nPosCacheLigne] == null);
				// Ajoute la ligne dans le cache
				this.m_tabLignes[nPosCacheLigne] = this.m_oChampTable.voCreeCacheLigne(oXMLLigne, nLigne);

				// Si la ligne est visible : force sa MAJ
				if (bNoteMAJLigne)
				{
					this.m_oChampTable.NoteMAJLigne(nLigne);
				}
			}

			// Passe a la ligne suivante
			oXMLLigne = oXMLLigne.nextSibling;
		}
	},

	// Vide le cache des donnees inutiles
	SupprimeLignesInutiles: function()
	{
		// Si pas encore de cache => Fini
		if (this.Cache == -1)
		{
			return;
		}

		// Si on est en nombre illimite de lignes : supprime les lignes qui sont apres la fin
		if (this.m_oChampTable.m_nNbLignesPage == 0)
		{
			if (this.m_tabLignes.length > this.m_oChampTable.m_nNbLignes)
			{
				this.m_tabLignes = this.m_tabLignes.slice(0, this.m_oChampTable.m_nNbLignes);
			}
			return;
		}

		// Si tous le cache est avant la zone de marge => Supprime le cache
		if (this.m_nDebutCache + this.m_tabLignes.length <= this.m_oChampTable.m_nDebut - this.m_nLignesMargeMaxAvant)
		{
			this.m_tabLignes.length = 0;
			delete this.m_nDebutCache;
			return;
		}

		// Si le cache est apres la zone de marge => Supprime le cache
		if (this.m_nDebutCache >= this.m_oChampTable.m_nDebut + this.m_nLignesMargeMaxApres)
		{
			this.m_tabLignes.length = 0;
			delete this.m_nDebutCache;
			return;
		}

		// Si le debut du cache est avant la zone de marge (Et donc avec une zone de recouvrement au vu des test precedents) : supprime le cache en trop
		if (this.m_nDebutCache < this.m_oChampTable.m_nDebut - this.m_nLignesMargeMaxAvant)
		{
			this.m_tabLignes = this.m_tabLignes.slice(this.m_oChampTable.m_nDebut - this.m_nLignesMargeMaxAvant - this.m_nDebutCache);
			this.m_nDebutCache = this.m_oChampTable.m_nDebut - this.m_nLignesMargeMaxAvant;
		}

		// Si on a trop de cache vers la fin (Et donc avec une zone de recouvrement au vu des test precedents) : supprime le cache en trop
		if (this.m_nDebutCache + this.m_tabLignes.length >= this.m_oChampTable.m_nDebut + this.m_nLignesMargeMaxApres)
		{
			this.m_tabLignes = this.m_tabLignes.slice(0, this.m_nLignesMargeMaxApres);
		}
		// Si on des lignes qui n'existent plus
		if (this.m_nDebutCache + this.m_tabLignes.length > this.m_oChampTable.m_nNbLignes)
		{
			this.m_tabLignes = this.m_tabLignes.slice(0, this.m_oChampTable.m_nNbLignes - this.m_nDebutCache);
		}
	},

	// Recupere une ligne dans le cache
	oGetLigne: function oGetLigne(nLigneAbsolue)
	{
		// Si la ligne n'est pas dans le cache : fini
		// Si la ligne n'est pas dans le cache => fini aussi
		if (!this.bDansPlageCache(nLigneAbsolue))
		{
			return null;
		}
		return this.m_tabLignes[nLigneAbsolue - this.m_nDebutCache];
	},

	// Met a jour la ligne donnee en fonction des elements dans le cache
	// nLigneAbsolue est le numero de ligne, nLigneRelative est le numero de ligne parmis les lignes affiches
	bMAJLigne: function(nLigneAbsolue)
	{
		var oLigne = this.oGetLigne(nLigneAbsolue);
		if (oLigne)
		{
			// Demande a la ligne de cache
			return oLigne.bMAJLigne(nLigneAbsolue, this.m_oChampTable);
		}
		return false;
	},

	// Renvoie le tableaux des options d'une cellule combo
	tabContenuCellule: function(nLigneAbsolue, nColonne)
	{
		var oLigne = this.oGetLigne(nLigneAbsolue);
		if (oLigne)
		{
			// Demande a la ligne de cache
			return oLigne.tabContenuCellule(nColonne);
		}
		// Si la ligne n'est pas dans le cache : fini
		return null;
	},

	// Recupere le contenu d'une cellule
	sGetCellule: function(nLigneAbsolue, nColonne, bPourEntier)
	{
		var oLigne = this.oGetLigne(nLigneAbsolue);
		if (oLigne)
		{
			// Demande a la ligne de cache
			return oLigne.sGetCellule(nColonne, bPourEntier);
		}
		return bPourEntier ? -1 : "";
	},

	// Indique si une ligne est dans la zone normalement couverte par le cache
	bDansPlageCache: function(nLigne)
	{
		// Le ligne ne doit pas etre avant ou apres
		return ((nLigne >= this.m_nDebutCache) && (nLigne < this.m_nDebutCache + this.m_tabLignes.length))
	},

	// Indique que l'on a change la valeur de la colonne donnee
	// nLigne est en valeur absolue
	ChangementValeur: function(nLigne, nLigneRelative, nColonne, sValeur, nValeur)
	{
		// Si pas de cache => Fini c'est qu'il y a eu une erreur fatale => reset de la table
		if (this.m_nDebutCache == -1) return;

		// Trouve le numerode ligne dans le cache
		var nLigneCache = nLigne - this.m_nDebutCache;

		// Si la ligne est dans le cache on la modifie
		if ((nLigneCache <= this.m_tabLignes.length) && (this.m_tabLignes[nLigneCache] != null))
		{
			this.m_tabLignes[nLigneCache].ChangementValeur(nColonne, sValeur, nValeur);
		}
	},

	// Et notifie le serveur de la validation d'une ligne
	// nLigne est en valeur absolue
	ValideChangement: function(nLigneAbsolue)
	{
		var oLigneCache = this.m_tabLignes[nLigneAbsolue - this.m_nDebutCache];
		// Valide le changement sur la ligne virtuelle
		if (oLigneCache && oLigneCache.bLigneVirtuelle)
		{
			oLigneCache.ValideChangement(this, nLigneAbsolue);
		}
	},

	// Supprime les lignes virtuelles
	SupprimeLignesVirtuelles: function()
	{
		// On parcours nos lignes de cache et supprime les lignes virtuelles
		var i;
		var nLimiteI = this.m_tabLignes.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var oLigne = this.m_tabLignes[i];
			// Si c'est une ligne virtuelle
			if (oLigne && oLigne.bLigneVirtuelle)
			{
				// Remet la ligne normale
				this.m_tabLignes[i] = oLigne.m_oCacheLigne;
				// Change la ligne pointe par la ligne physique
				oLigne.m_oCacheLigne.m_oLigneHTML.SwapLigneCache(oLigne.m_oCacheLigne.m_nColonneHTML, oLigne.m_oCacheLigne);

				// Supprime les membres
				delete oLigne.m_oCacheLigne;
				delete oLigne.m_tabValeurs;
				delete oLigne;
			}
		}
	},

	// Cree la ligne virtuelle si besoin
	// nLigne est en valeur absolue
	CreeLigneVirtuelle: function(nLigneAbsolue)
	{
		// Calcule la position absolue dans le tableau
		var nLigneRelativeDebutCache = nLigneAbsolue - this.m_nDebutCache;
		if (this.m_tabLignes[nLigneRelativeDebutCache] && !this.m_tabLignes[nLigneRelativeDebutCache].bLigneVirtuelle)
		{
			this.m_tabLignes[nLigneRelativeDebutCache] = new WDTableCacheLigneModifie(this.m_tabLignes[nLigneRelativeDebutCache]);
		}
	},

	// Fixe la hauteur d'une ligne
	SetHauteur: function(nLigneAbsolue, nHauteur)
	{
		var oLigne = this.oGetLigne(nLigneAbsolue);
		if (oLigne)
		{
			// Modifie la ligne
			oLigne.SetHauteur(nHauteur);
			return;
		}
	},

	// Lit la hauteur de la ligne
	nGetHauteur: function(nLigneAbsolue)
	{
		var oLigne = this.oGetLigne(nLigneAbsolue);
		if (oLigne)
		{
			// Demande a la ligne de cache
			return oLigne.nGetHauteur();
		}
		// Si la ligne n'est pas dans le cache : fini
		return -1;
	},

	// Convertit les coordonees visible <=> absolue
	nPosAbsolue2PosVisible: function nPosAbsolue2PosVisible(nLignePosAbsolue)
	{
		// Si la valeur n'est pas dans le cache
		if ((this.m_tabLignes.length == 0) || (nLignePosAbsolue < this.m_tabLignes[0].m_nPosAbsolue) || (nLignePosAbsolue > this.m_tabLignes[this.m_tabLignes.length - 1].m_nPosAbsolue))
		{
			return nLignePosAbsolue;
		}

		// On parcours nos lignes de cache et supprime les lignes virtuelles
		var i;
		var nLimiteI = this.m_tabLignes.length;
		for (i = 0; i < nLimiteI; i++)
		{
			var oLigne = this.m_tabLignes[i];
			// Si c'est une ligne virtuelle
			if (oLigne && (oLigne.m_nPosAbsolue == nLignePosAbsolue))
			{
				return i + this.m_nDebutCache;
			}
		}
//		alert("non trouve 1 " + nLignePosAbsolue);
		return nLignePosAbsolue;
	},
	nPosVisible2PosAbsolue: function nPosVisible2PosAbsolue(nLignePosVisible)
	{
		if (this.m_tabLignes.length == 0)
		{
			return nLignePosVisible;
		}

		var oLigne = this.oGetLigne(nLignePosVisible);
		if (oLigne)
		{
			// Retourne la valeur de la ligne
			return oLigne.m_nPosAbsolue;
		}
//		alert("non trouve 2 " + nLignePosVisible);
		return nLignePosVisible;
	}
};

// Classe de base des colonnes
function WDColonne (oXMLColonne)
{
	// Propriete generiques
	this.m_bSaisissable = clWDAJAXMain.bXMLGetAttributSafe(oXMLColonne, this.XML_SAISISSABLE);
	this.m_bVisible = clWDAJAXMain.bXMLGetAttributSafe(oXMLColonne, this.XML_VISIBLE);
	this.m_sBulle = clWDAJAXMain.sXMLGetAttributSafe(oXMLColonne, this.XML_BULLE, null);
	this.m_bTri = clWDAJAXMain.bXMLGetAttributSafe(oXMLColonne, this.XML_TRI);
	this.m_bRecherche = clWDAJAXMain.bXMLGetAttributSafe(oXMLColonne, this.XML_RECHERCHE);

	// Proprietes specifiques
	this.m_nType = clWDAJAXMain.nXMLGetAttributSafe(oXMLColonne, WDAJAXMain.prototype.XML_CHAMP_ATT_TYPE, WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE);
	switch (this.m_nType)
	{
	// Combo
	case WDAJAXMain.prototype.XML_CHAMP_TYPE_COMBO:
		// Tableaux des options
		this.m_tabOptions = clWDAJAXMain.tabXMLGetTableauValeur(oXMLColonne, "OPTION");
		// Si le tableau n'existe pas => c'est que l'on a une saturation : met la colonne en lecture seule
		if (!this.m_tabOptions)
		{
			this.m_bSaisissable = false;
		}
		break;

	// Interrupteur
	case WDAJAXMain.prototype.XML_CHAMP_TYPE_INTERRUPTEUR:
		break;

	// Autres
	default:
		// Force le type
		this.m_nType = WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE;
		// Et fait comme le champ de saisie et de la champ image => Pas de break

	// Image
	case WDAJAXMain.prototype.XML_CHAMP_TYPE_IMAGE:
		// Pas saisissable
		this.m_bSaisissable = false;
		// Et fait comme le champ de saisie => Pas de break

	// Saisie
	case WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE:
		// Gestion des liens
		this.m_nLien = clWDAJAXMain.nXMLGetAttributSafe(oXMLColonne, this.XML_LIEN, 0);
		if (this.m_nLien != 0)
		{
			this.m_nEtatLien = clWDAJAXMain.nXMLGetAttributSafe(oXMLColonne, this.XML_ETATLIEN, 0);
		}
		break;
	}
};

// Valeur par defaut des proprietes
WDColonne.prototype.m_nLien = 0;	// Type de lien : sans
WDColonne.prototype.m_nEtatLien = 0;// Etat du lien : actif
WDColonne.prototype.m_tabOptions = new Array();
// Constantes
WDColonne.prototype.XML_SAISISSABLE = "SAISISSABLE";
WDColonne.prototype.XML_VISIBLE = "VISIBLE";
WDColonne.prototype.XML_LIEN = "LIEN";
WDColonne.prototype.XML_ETATLIEN = "ETATLIEN";
WDColonne.prototype.XML_BULLE = "BULLE";
WDColonne.prototype.XML_TRI = "TRI";
WDColonne.prototype.XML_RECHERCHE = "RECHERCHE";

// Classe de base de l'etat d'une ligne
function WDEtatLigne(oChampTable, nLigneHTML, nNbLignesLogiques)
{
	// On initialise les elements
	if (oChampTable)
	{
		// La ligne physique (balise TR + par defaut invisible)
		this.m_oLignePhysique = oChampTable.oGetIDElement(nLigneHTML);
		this.m_nLigneHTML = nLigneHTML;

		// Les lignes logiques de la ligne
		var i;
		var nLimiteI = oChampTable.vnGetNbLignesLogiquesParLignePhysique();
		this.m_tabLignesLogiques = new Array(nLimiteI);
		for (i = 0; i < nLimiteI; i++)
		{
			var oLigneLogique = new Object();
			oLigneLogique = new Object();
			// Par defaut ligne invisible et non remplie
			oLigneLogique.m_oLigneCache = null;

			// Si on n'a plus d'une colonne manipule les cellules sinon manipule les lignes
			oLigneLogique.m_oLigneLogique = (nLimiteI > 1) ? oChampTable.oGetIDElement(nLigneHTML, i) : this.m_oLignePhysique;

			this.m_tabLignesLogiques[i] = oLigneLogique;
		}

		// Et les ruptures
		this.RecalculeObjetsRuptures(oChampTable, nLigneHTML);
	}
};

// Pas de classe de base
//// Declare l'heritage
//WDEtatLigne.prototype = new xxx();
//// Surcharge le constructeur qui a ete efface
//WDEtatLigne.prototype.constructor = WDEtatLigne;

WDEtatLigne.prototype.oGetLigneLogique = function oGetLigneLogique(nColonneHTML)
{
	return this.m_tabLignesLogiques[nColonneHTML];
};

WDEtatLigne.prototype.oGetLigneLogiqueHTML = function oGetLigneLogiqueHTML(nColonneHTML)
{
	return this.oGetLigneLogique(nColonneHTML).m_oLigneLogique;
};

// Recupere une cellule pour les donnees
WDEtatLigne.prototype.oGetCellule = function oGetCellule(nColonneHTML, nColonne, oChampTable)
{
	// Selon si on a :
	// - Une ligne logique par ligne physique mais plusieurs colonnes (cas des tables)
	// - Une ligne logique par ligne physique et une colonne (ZR mono colonnes)
	// - Plusieurs lignes logiques par ligne physique mais une colonne (ZR multi colonnes)
	if (this.m_tabLignesLogiques.length <= 1)
	{
		return oChampTable.oGetIDCellule(this.m_nLigneHTML, nColonne);
	}
	else if (nColonne == 0)
	{
		return oChampTable.oGetIDCellule(this.m_nLigneHTML, nColonneHTML);
	}
	else
	{
		// Pour avoir la condition de sortie de la boucle de remplissage des lignes
		return null;
	}
};

// Mise a jour des pointeurs des ruptures
WDEtatLigne.prototype.RecalculeObjetsRuptures = function RecalculeObjetsRuptures(oChampTable, nLigneHTML)
{
	// Et les ruptures
	// Les ruptures n'existent qu'une seule fois par ligne physique
	if (oChampTable.nGetNbRuptures() > 0)
	{
		this.m_oRupturesHaut = oChampTable.oGetIDElement(WDTable.prototype.ID_RUPTURE_HAUT, nLigneHTML);
		this.m_oRupturesBas = oChampTable.oGetIDElement(WDTable.prototype.ID_RUPTURE_BAS, nLigneHTML);
	}
};

// Invalide l'etat de toutes les lignes
WDEtatLigne.prototype.nInvalide = function nInvalide(oChampTable, nPositionAbsolue, bForce, oEvent)
{
	var i;
	var nLimiteI = this.m_tabLignesLogiques.length;
	for (i = 0; i < nLimiteI; i++)
	{
		if (this.bPlein(i) || bForce)
		{
			this.MasqueLigne(i, oChampTable, nPositionAbsolue++, oEvent);
		}
	}
	return nPositionAbsolue;
};

// Change la ligne entre une ligne virtuelle et une ligne reelle
WDEtatLigne.prototype.SwapLigneCache = function SwapLigneCache(nColonneHTML, oLigneCache)
{
	this.m_tabLignesLogiques[nColonneHTML].m_oLigneCache = oLigneCache;
};

// Modifie le style de la ligne
WDEtatLigne.prototype.SetStyle = function SetStyle(nColonneHTML, sStyle)
{
	this.m_tabLignesLogiques[nColonneHTML].m_oLigneLogique.className = sStyle;
};

// Indique si une ligne est pleine
WDEtatLigne.prototype.bPlein = function bPlein(nColonneHTML)
{
	return this.m_tabLignesLogiques[nColonneHTML].m_oLigneCache ? true : false;
};

// Force la MAJ si la ligne est pleine
WDEtatLigne.prototype.bMAJSiPlein = function bMAJSiPlein(nColonneHTML, oChampTable, nLigneAbsolue, oEvent)
{
	var oLigneCache = this.m_tabLignesLogiques[nColonneHTML].m_oLigneCache;
	if (oLigneCache)
	{
		return this.bMAJ(nColonneHTML, oLigneCache, oChampTable, nLigneAbsolue, oEvent);
	}
	return false;
};

// MAJ d'une ligne
WDEtatLigne.prototype.bMAJ = function bMAJ(nColonneHTML, oLigneCache, oChampTable, nLigneAbsolue, oEvent)
{
	var bRes;
	// Notifie la table de la MAJ => fait dans les fonctions internes
//	oChampTable.vPreMAJLigne(nLigneAbsolue, oEvent);

	if (oLigneCache)
	{
		this.AfficheLigne(nColonneHTML, oLigneCache, oChampTable, nLigneAbsolue, oEvent);

		// Maj
		bRes = oLigneCache.bMAJLigne(nLigneAbsolue, oChampTable);
	}
	else
	{
		this.MasqueLigne(nColonneHTML, oChampTable, nLigneAbsolue, oEvent);
		bRes = true;
	}

	// Notifie la table de la MAJ
	oChampTable.vPostMAJLigne(nLigneAbsolue, oEvent);

	return bRes;
};

// Se detache d'une ligne du cahce (et la vide
WDEtatLigne.prototype.DetacheEtVide = function DetacheEtVide(nColonneHTML, oChampTable)
{
	// Se detache
	this.Detache(nColonneHTML);
	// Et vide la ligne
	oChampTable.vVideCellule(this.oGetCellule(nColonneHTML, 0, oChampTable));
};

// Se detache d'une ligne du cache
WDEtatLigne.prototype.Detache = function Detache(nColonneHTML)
{
	this.DetacheO(this.m_tabLignesLogiques[nColonneHTML])
};

// Se detache d'une ligne du cache
WDEtatLigne.prototype.DetacheO = function DetacheO(oLigneLogique)
{
	// La ligne est vide ou va etre videe
	if (oLigneLogique.m_oLigneCache)
	{
		delete oLigneLogique.m_oLigneCache.m_oLigneHTML;
		delete oLigneLogique.m_oLigneCache.m_nColonneHTML;
		oLigneLogique.m_oLigneCache = null;
	}
};

// Affiche une ligne
WDEtatLigne.prototype.AfficheLigne = function AfficheLigne(nColonneHTML, oLigneCache, oChampTable, nLigneAbsolue, oEvent)
{
	// Notifie les champs fils
	oChampTable.vPreMAJLigne(nLigneAbsolue, oEvent);

	var oLigneLogique = this.m_tabLignesLogiques[nColonneHTML];

	// Si la ligne du cache n'est pas la meme que la ligne actuelle
	if (oLigneLogique.m_oLigneCache != oLigneCache)
	{
		// Se detache si besoin
		this.DetacheO(oLigneLogique);
		// Et detache aussi la nouvelle ligne si besoin
		oLigneCache.DetacheEtVide(oChampTable);
		// Et s'attache
		oLigneLogique.m_oLigneCache = oLigneCache;
		oLigneCache.m_oLigneHTML = this;
		oLigneCache.m_nColonneHTML = nColonneHTML;
	}

	// Affiche la cellule
	oLigneLogique.m_oLigneLogique.style.visibility = "inherit";

	// Affiche la ligne complete
	this.vAfficheLigne();
};

// Masque une ligne
WDEtatLigne.prototype.MasqueLigne = function MasqueLigne(nColonneHTML, oChampTable, nLigneAbsolue, oEvent)
{
	// Notifie les champs fils
	oChampTable.vPreMAJLigne(nLigneAbsolue, oEvent);

	// La ligne est vide ou va etre videe
	var oLigneLogique = this.m_tabLignesLogiques[nColonneHTML];
	// Se detache si besoin
	this.DetacheO(oLigneLogique);

	// Maj
	oChampTable.vVideCellule(oChampTable.oGetIDCellule(this.m_nLigneHTML, nColonneHTML));

	// Vide les ruptures si on est sur la premiere colonne
	if (nColonneHTML == 0)
	{
		oChampTable.VideRuptures(this);
	}

	// Masque la cellule
	oLigneLogique.m_oLigneLogique.style.visibility = "hidden";
	// L'objet parent a souvent recue la couleur
	if (oLigneLogique.m_oLigneLogique.parentNode.tagName.toUpperCase() == "TD")
	{
		oLigneLogique.m_oLigneLogique.parentNode.style.backgroundColor = "transparent";
	}

	// Masque la ligne complete si besoin
	this.vAfficheLigne();
};

// Affiche/Masque la ligne si besoin
WDEtatLigne.prototype.vAfficheLigne = function vAfficheLigne()
{
//	SetDisplay(this.m_oLignePhysique, this.m_tabLignesLogiques[0].m_oLigneCache != null);
	this.m_oLignePhysique.style.visibility = this.m_tabLignesLogiques[0].m_oLigneCache ? "inherit" : "hidden";
};

// Classe de base de l'etat des lignes
function WDEtatLignes (oChampTable, nNbLignesHTML)
{
	if (oChampTable)
	{
		var nNbLignesLogiques = oChampTable.vnGetNbLignesLogiquesParLignePhysique();

		var i;
		var nLimiteI = nNbLignesHTML;
		this.m_tabEtatLignes = new Array(nNbLignesHTML);
		for (i = 0; i < nLimiteI; i++)
		{
			this.m_tabEtatLignes[i] = new WDEtatLigne(oChampTable, i, nNbLignesLogiques);
		}
	}
}

// Pas de classe de base
//// Declare l'heritage
//WDEtatLignes.prototype = new xxx();
//// Surcharge le constructeur qui a ete efface
//WDEtatLignes.prototype.constructor = WDEtatLignes;

// Mise a jour des pointeurs des ruptures
WDEtatLignes.prototype.RecalculeObjetsRuptures = function RecalculeObjetsRuptures(oChampTable)
{
	var i;
	var nLimiteI = this.m_tabEtatLignes.length;
	for (i = 0; i < nLimiteI; i++)
	{
		this.m_tabEtatLignes[i].RecalculeObjetsRuptures(oChampTable, i);
	}
};

// Invalide l'etat de toutes les lignes
WDEtatLignes.prototype.Invalide = function Invalide(oChampTable, nPositionAbsolue, nDebut, bForce, oEvent)
{
	var i;
	var nLimiteI = this.m_tabEtatLignes.length;
	for (i = nDebut; i < nLimiteI; i++)
	{
		nPositionAbsolue = this.m_tabEtatLignes[i].nInvalide(oChampTable, nPositionAbsolue, bForce, oEvent);
	}
};

// Recupere le nombre de lignes
WDEtatLignes.prototype.nGetNbEtatLignes = function nGetNbEtatLignes()
{
	return this.m_tabEtatLignes.length;
};

// Recupere une ligne donnee
WDEtatLignes.prototype.oGetEtatLigne = function oGetEtatLigne(nLigneHTML)
{
	return this.m_tabEtatLignes[nLigneHTML];
};

// Classe manipulant la table
function WDTable(sAliasChamp, bSansLimite, nHauteurLigne, nPagesMargeMin, nPagesMargeMax, nTypeSelection, tabStyle, tabImgTri, tabImgRecherche)
{
	// Si on est pas dans l'init d'un protoype
	if (sAliasChamp)
	{
		// Appel le constructeur de la classe de base
		WDChamp.prototype.constructor.apply(this, [sAliasChamp, undefined, undefined]);

		// Donnees de base
		this.m_bSansLimite = bSansLimite;	// Si on limite le nombre de ligne dans la page
		this.m_nHauteurLigne = nHauteurLigne;
		// Si on est en nombre limite de ligne
		if (!this.m_bSansLimite)
		{
			this.m_nPagesMargeMin = nPagesMargeMin;	// Nombre minimum de lignes dans le cache avant la premiere ligne affiche (Ou apres la denriere)
			this.m_nPagesMargeMax = nPagesMargeMax;	// Nombre maximum de lignes coserve dans le cache avant la premiere ligne
			this.m_nPagesMargeRequete = parseInt((nPagesMargeMax + nPagesMargeMin) / 2, 10);
		}
		this.m_nTypeSelection = nTypeSelection;	// Type de selection autorisee

		// Tableau des noms de styles
		this.m_tabStyle = tabStyle;

		var nImage;
		// Images de tri et de recherche avec prechargement
		if (tabImgTri)
		{
			this.m_tabImgTri = tabImgTri;
			for (nImage in this.m_tabImgTri) { (new Image()).src = this.m_tabImgTri[nImage]; };
		}
		if (tabImgRecherche)
		{
			this.m_tabImgRecherche = tabImgRecherche;
			for (nImage in this.m_tabImgRecherche) { (new Image()).src = this.m_tabImgRecherche[nImage]; };
		}

		// Nombre d'initialisation
		this.m_nNbInits = 0;

		// Ne rien mettre ici qui doit etre remit a zero dans l'init
	}
};

// Declare l'heritage
WDTable.prototype = new WDChamp();
// Surcharge le constructeur qui a ete efface
WDTable.prototype.constructor = WDTable;

// Membres statique/valeurs par defaut
// Donnees semi-dynamique
WDTable.prototype.m_nFacteurAscenseur = 1;		// Le facteur multiplicateur de la barre de defilement (Pour les tables tres tres grandes)
// La limite des barres d'outils n'est pas la meme selon le navigateur
// - IE			134217727	ou 0x7FFFFFF
// - Firefox	71582788	ou 0x4444444
WDTable.prototype.m_nLimiteHauteur = (bIE ? (bIE8 ? 1342177 : 134217727) : 71582788);
WDTable.prototype.m_bRequeteDiffereeForce = false;	// Debut de la prochaine requete : utilise par le systeme de requete differe
WDTable.prototype.m_nColonneTrie = -1;
WDTable.prototype.m_nColonneTriePre = -1;			// Indication de tri que l'on a recu du serveur
WDTable.prototype.m_bSensTri = true;
WDTable.prototype.m_bSensTriPre = true;				// Indication de tri que l'on a recu du serveur
WDTable.prototype.m_nColonneRecherche = -1;			// Colonne de recherche
WDTable.prototype.m_bFinTrouve = false;				// Si la fin de la table est connue
WDTable.prototype.m_sCleParcourtAP = "";			// Par defaut pas de cle pour le positionnement du parcour en arriere plan
WDTable.prototype.m_bRetourServeurSelection = true;	// Par defaut on notifie le serveur de chaque selection
//WDTable.prototype.m_oFormRecherche = undefined;
//WDTable.prototype.m_oImgOrigine = undefined;
//WDTable.prototype.m_fOnMouseDown = undefined;
WDTable.prototype.m_bMasqueVisible = false;
WDTable.prototype.m_bHauteurLigneVariable = true; // Active par defaut en 15
WDTable.prototype.m_nNbRuptures = 0;				// Nombre de ruptures par defaut (evite un tentative de AMJ si la table n'a pas de ruptures)

WDTable.prototype.XML_NOMBRE = "NOMBRE";
WDTable.prototype.XML_FIN = "FIN";
WDTable.prototype.XML_DEBUT = "DEBUT";
WDTable.prototype.XML_CLEENREGAP = "CLEENREGAP";
WDTable.prototype.XML_SELECTIONS = "SELECTIONS";
WDTable.prototype.XML_COLONNES = "COLONNES";
WDTable.prototype.XML_LIGNES = "LIGNES";
WDTable.prototype.XML_SELECTION = "SELECTION";
WDTable.prototype.XML_COLONNE = "COLONNE";
WDTable.prototype.XML_ERREUR = "ERREUR";
WDTable.prototype.XML_TRI = "TRI";
WDTable.prototype.XML_SENS = "SENS";
WDTable.prototype.XML_DESACTIVESERSEL = "DESACTIVESERSEL";
WDTable.prototype.XML_HAUTEURLIGNEVARIABLE = "HAUTEURLIGNEVARIABLE";
//WDTable.prototype.XML_VALMEM = "VALMEM";
WDTable.prototype.SELECTION_SANS = 0;
WDTable.prototype.SELECTION_SIMPLE = 1;
WDTable.prototype.SELECTION_MULTIPLE = 2;
WDTable.prototype.ID_SCROLLBAR = "SB";
WDTable.prototype.ID_TABLEINTERNE = "TB";
WDTable.prototype.ID_POSITION_PIXEL = "POS";
WDTable.prototype.ID_CHARGEMENT_IMG = "LOAD";
WDTable.prototype.ID_MASQUE = "MASQUE";
WDTable.prototype.ID_MASQUETRANSPARENT = "MASQUETR";
WDTable.prototype.ID_TITRE = "TITRES";
WDTable.prototype.ID_TRI = "TRI";
WDTable.prototype.ID_RECHERCHE = "RECH";
WDTable.prototype.ID_RUPTURE_HAUT = "H";
WDTable.prototype.ID_RUPTURE_BAS = "B";
WDTable.prototype.SEL_SEPARATEUR = ";";

// Fin de l'init (Apres le parcours du HTML)
WDTable.prototype.Init = function(nColonneTrie)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Init.apply(this, []);

	this.m_oDivPos = this.oGetIDElement(this.ID_POSITION_PIXEL);

	// Pour le W3C : la gestion du scroll et du redimesionnement est faite ici par code
	var oPosPixel = this.m_oDivPos;
	var oTitrePosPixel = this.oGetIDElement(this.ID_TITRE, this.ID_POSITION_PIXEL);
	if (oTitrePosPixel)
	{
		this.m_oDivPos.parentNode.onscroll = function() { oTitrePosPixel.parentNode.scrollLeft = oPosPixel.parentNode.scrollLeft; };
	}
	var oMasque = this.oGetIDElement(this.ID_MASQUE);
	var oMasqueTr = this.oGetIDElement(this.ID_MASQUETRANSPARENT);
	this.m_oDivPos.parentNode.onresize = function() { oMasque.style.width = oMasque.parentNode.clientWidth; oMasque.style.height = oMasque.parentNode.clientHeight; oMasqueTr.style.width = oMasqueTr.parentNode.clientWidth; oMasqueTr.style.height = oMasqueTr.parentNode.clientHeight; };

	// Fonction de defilement : uniquement si on a un ascenseur
	if (!this.m_bSansLimite)
	{
		// Fonction de defilement
		var oTmp = this;
		if (bIE)
		{
			this.m_fScroll = function() { oTmp.DeplaceTable(event); };
		}
		else
		{
			this.m_fScroll = function(event) { oTmp.DeplaceTable(event); };
		}

		// La scroll bar et le div positionnable
		this.m_oAscenseur = this.oGetIDElement(this.ID_SCROLLBAR);
		this.m_oAscenseurParent = this.m_oAscenseur.parentNode;

		// Initialise la roulette
		this.InitRoulette(this.m_oDivPos.parentNode);
	}

	// Initialise le HTML de la ligne en le lisant du fichier Mais uniquement lors de la prmiere init
	// (Lors des suivante le commentair en'existe surement plus)
	this.InitHTMLLigne();

	var oChampDeb = this.oGetElementByName(document, "_DEB");
	var nDebut = 0;
	var sCleDebut;
	if (oChampDeb)
	{
		var nTempDebut = this.nGetDebut(oChampDeb.value);
		if (!isNaN(nTempDebut))
		{
			// Valeur WL => valeur C
			nDebut = nTempDebut - 1;
			var sTempDebutCle = this.sGetDebutCle(oChampDeb.value);
			if (sTempDebutCle)
			{
				sCleDebut = sTempDebutCle;
			}
		}
	}

	// Recupere le champ formulaire
	this.m_oFormulaire = this.oGetElementByName(document, "");

	// Recupere la selection (Uniquement en mode AWP)
	var sSelection;
	if (clWDAJAXMain.m_bPageAWP && this.m_oFormulaire)
	{
		sSelection = this.m_oFormulaire.value;

		// On cree un deuxieme champ a cote qui a le meme nom avec un _ en plus pour avoir la selection dans le format que l'on veux
		// (Indice en base 0 separe par des ;) sans perturbe le comportement des autres fonctions
		// On ajoute le champ a la page comme ceci il sera automatiquement place dans TOUS les submit (AJAX ou NON)
		var oFormulaireSelAWP = document.createElement("INPUT");
		oFormulaireSelAWP.type = "hidden";
		oFormulaireSelAWP.name = this.m_oFormulaire.name + "_SEL";
		oFormulaireSelAWP.id = this.m_oFormulaire.name + "_SEL";
		this.m_oFormulaireSelAWP = this.m_oFormulaire.parentNode.appendChild(oFormulaireSelAWP);
	}

	// Puis appele la fonction avec les donnees de reinitialisation
	this.Reinit(nColonneTrie, nDebut, sSelection, sCleDebut);
};

// Recupere le debut depuis une valeur
WDTable.prototype.nGetDebut = function nGetDebut(sValeur)
{
	return parseInt(sValeur, 10);
};

// Recupere la cle du debut depuis une valeur
WDTable.prototype.sGetDebutCle = function sGetDebutCle(sValeur)
{
	sValeur = sValeur + "";
	if (sValeur.indexOf(";") > -1)
	{
		return sValeur.substring(sValeur.indexOf(";") + 1);
	}
	return null;
};

// Recupere le HTML d'une ligne dans la table
WDTable.prototype.InitHTMLLigne = function()
{
	this.m_sHTMLLigne = "";

	// Recupere la balise table.
	var oBaliseTable = this.oGetIDElement(this.ID_TABLEINTERNE);

	// Et lit la valeur de la balise commentaire
	var i;
	var nLimiteI = oBaliseTable.childNodes.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// Si c'est la balise commentaire
		if (oBaliseTable.childNodes[i].nodeName == "#comment")
		{
			this.m_sHTMLLigne += oBaliseTable.childNodes[i].nodeValue;
		}
		else if (oBaliseTable.childNodes[i].nodeName == "!")
		{	// Cas special pour IE5.5
			var sValeur = oBaliseTable.childNodes[i].text + "";
			// Supprime le <!-- initial et le --> final
			this.m_sHTMLLigne += sValeur.substr(4, sValeur.length - 7);
		}
	}

	// Remplace maintenant les commentaires
	this.m_sHTMLLigne = this.m_sHTMLLigne.replace(/\[%COMMENT%\]/g, "<!-- -->");
};

// Code commun a premiere init mais aussi au init suivantes
WDTable.prototype.Reinit = function(nColonneTrie, nDebut, sSelection, sCleDebut)
{
	// Si trop d'init (ie trop d'erreurs) : on arrete
	if (++this.m_nNbInits > 16)
		return;

	// Affecte la colonne de tri
	if (!(nColonneTrie === undefined))
	{
		this.m_nColonneTrie = nColonneTrie;
		this.m_nColonneTriePre = nColonneTrie;
	}

	// Donnees dynamique qui doivent etre redefinie lors de la recreation de la table
	this.SetDebut(0);						// Premiere ligne affiche
	this.m_nNbLignes = 0;					// Nombre de lignes total de la table
	this.m_oRedimColonnes = new WDRedimColonnes(this); // Le gestionnaire de redimensionnement des colonnes
	this.m_oGestionSaisie = new WDSaisieCellule(this); // Gestion de la saisie
	this.m_tabSelection = new Array();		// Tableau des lignes selectionnees
	this.m_tabColonnes = new Array();		// Les proprietes des colonnes
	this.m_nNbLignesPage = this.m_bSansLimite ? 0 : -1; // Nombre de ligne dans la page
	this.m_oCache = new WDTableCache(this);	// Notre cache

	// Restaure la selection si demande
	if (sSelection)
	{
		var nSelection = parseInt(sSelection, 10);
		while (!isNaN(nSelection))
		{
			// Ajoute la ligne
			this.m_tabSelection.push(nSelection);

			// Trouve la valeur suivante
			if (sSelection.indexOf(this.SEL_SEPARATEUR) == -1)
				break;
			sSelection = sSelection.substring(sSelection.indexOf(this.SEL_SEPARATEUR) + 1);
			nSelection = parseInt(sSelection, 10);
		}

		// Met la valeur dans le formulaire
		this.SetValFormulaire(isNaN(nSelection) ? "" : nSelection);
	}

	// Puis on initialise ce qui depend de la taille de la zone cliente :
	// Membre, defilement, HTML des lignes etc
	// En forcant la recuperation du chache
	this.OnResizeTable(true, false, nDebut, sCleDebut);

	this.AfficheMasque(true, false);
};

// Creation d'une ligne
WDTable.prototype.voCreeCacheLigne = function voCreeCacheLigne(oXMLLigne, nLigne)
{
	return new WDTableCacheLigne(oXMLLigne, this, nLigne);
};

// Initialise la gestion de la roulette
WDTable.prototype.InitRoulette = function(oCible)
{
	var oTmp = this;
	// Firefox, Chrome, Safari, Opera
	if (oCible.addEventListener)
	{
		var sEvent = bFF ? 'DOMMouseScroll' : 'mousewheel';
		oCible.addEventListener(sEvent, function(event) { return oTmp.OnRoulette(event); }, false);
	}
	else
	{
		// IE
		oCible.onmousewheel = function() { return oTmp.OnRoulette(event); };
	}
};

// Recoit le scrolling de la souris dans la zone cliente
WDTable.prototype.OnRoulette = function(oEvent)
{
	var nDeplacement = 0;

	// IE
	if (oEvent.wheelDelta)
	{
		nDeplacement = -oEvent.wheelDelta / 180 * this.m_nHauteurLigne;
	}
	else
	{
		// Firefox
		nDeplacement = (oEvent.detail ? oEvent.detail : 0) * 20;
	}

	if (nDeplacement != 0)
	{
		nDeplacement = this.nForceDefilement(nDeplacement, oEvent);

		// Gestion sepcifique de l'evenement roulette SI il y a deplacement (pour les ZRs)
		this._vOnRoulette(oEvent);

		// S'il y a eu deplacement : Evite la remonte de l'evenement
		if (nDeplacement != 0)
		{
			// Empeche la propagation de l'evenement
			return bStopPropagation(oEvent);
		}
	}
};

// Gestion sepcifique de l'evenement roulette SI il y a deplacement
WDTable.prototype._vOnRoulette = function(oEvent)
{
	// Rien
};

// Met a jour le nombre de lignes
WDTable.prototype.bMAJNbLignesVisibles = function(bMAJLignes, bTestUniquement)
{
	// Calcule le nombre de ligne a afficher et met a jour ce nombre si besoin
	if (this.m_bSansLimite)
		return false;

	// Redimensionne l'ascenseur si besoin
	this.RedimAscenseur();

	// Et le nombre a changer
	var bNbLignesChange = this.bCalculeLigneAffiche(bTestUniquement);
	// Si c'est seulement un test : sort direct
	if (bTestUniquement) return bNbLignesChange;

	if (bNbLignesChange)
	{
		// Reaffiche les lignes
		this.GenereLignesHTML();
		this.InitEtatLignes(this.m_nNbLignesHTML);

		// Applique la visibilite des colonnes
		this.AfficheColonnes();

		// Force le recalcul des marges
		this.m_oCache.RecalculeMarges(this.m_nNbLignesPage, this.m_nPagesMargeMin, this.m_nPagesMargeMax, this.m_nPagesMargeRequete);
	}

	// Met a jour l'ascenseur de droite (Ajout d'une hauteur fixe pour l'ascenseur si besoin)
	this.MAJAscenseur();

	// Et met a jour l'affichage si besoin
	if (bMAJLignes && bNbLignesChange)
		this.MAJLignes();

	return bNbLignesChange;
};

// Recoit un redimensionnement de la table principale
WDTable.prototype.OnResizeTable = function(bForce, bMAJLignes, nDebut, sCleDebut)
{
	// Met a jour le nombre de lignes
	this.bMAJNbLignesVisibles(bMAJLignes, false);

	// Remet les colonnes comme il faut si besoin
	if (!this.m_bDebordeLargeur)
		this.m_oRedimColonnes.ColonnesRestaure();

	// Si on a un nouveau debut a utiliser => Place la table a cet endroit
	// Force au passage le nombre de ligne de la table pour eviter que les verifs internes ne remettent le debut a zero
	// (La valeur provient du serveur donc a priori est valide)
	if (nDebut && (nDebut > 1))
	{
		this.SetDebut(nDebut, sCleDebut);
		this.m_nNbLignes = nDebut + this.m_nNbLignesPage;

		if (!this.m_bSansLimite)
		{
			// Remet a jour le nombre de lignes
			this.RedimAscenseur();
			// Met a jour l'ascenseur de droite (Ajout d'une hauteur fixe pour l'ascenseur si besoin)
			this.MAJAscenseur(true);
		}
	}

	// Et remplit finalement le cache si besoin => Cela va provoque une reception de donnee et un reaffichage
	this.m_oCache.RemplitCache(this.m_nDebut, bForce, -1, this.m_bSensTri);
};

// Initialise le tableau de l'etat des lignes
WDTable.prototype.InitEtatLignes = function InitEtatLignes(nNbLignesHTML)
{
	this.m_oEtatLignes = new WDEtatLignes(this, nNbLignesHTML);
};

// Recalcule le nombre de ligne a afficher dans la page et change le nombre de lignes si besoin
// Renvoi vrai si le nombre de ligne a ete (Ou va si bTestUniquement est a vrai) changer
WDTable.prototype.bCalculeLigneAffiche = function(bTestUniquement)
{
	//assert(!this.m_bSansLimite);

	// Calcule le nouveau nombre de lignes
	var oBaliseTable = this.oGetIDElement(this.ID_TABLEINTERNE);
	var nHauteur = parseInt(bIE ? oBaliseTable.height : oBaliseTable.getAttribute("height"), 10);
	// Inversion des deux lignes car comme la balise est en 100% a un endroit on ne lit pas la bonne taille (FF/chrome/etc, ok avec IE en mode compat)
	if (isNaN(nHauteur) || (nHauteur == 0)) nHauteur = parseInt(oBaliseTable.style.height, 10);
	if (isNaN(nHauteur) || (nHauteur == 0)) nHauteur = parseInt(_JGCS(oBaliseTable).height, 10);
	if (isNaN(nHauteur) || (nHauteur < this.m_nHauteurLigne)) nHauteur = this.m_nHauteurLigne;

	// Decalage a cause du debordement en largeur
	if (this.m_bDebordeLargeur) nHauteur -= 18;

	var nNbLignesPage = Math.floor(nHauteur / this.m_nHauteurLigne * this.vnGetNbLignesLogiquesParLignePhysique());

	// Si le nombre de ligne change
	if (nNbLignesPage != this.m_nNbLignesPage)
	{
		// Si ce n'est pas seulement un test : met a jour la valeur
		if (!bTestUniquement)
			this.m_nNbLignesPage = nNbLignesPage;
		return true;
	}
	return false;
};

// Defini la fonction navigateur a appeler lors de la selection d'un ligne de table
// Fonction conservee par compatibilite (a supprimer plus tard).
// Il faut maintenant appeler WDChamp::DeclarePCode
WDTable.prototype.CodeSelection = function(sCodeAppel)
{
	this.DeclarePCode(this.ms_nEventNavSelectLigne, new Function("event", "return " + sCodeAppel + ";"));
};

// Rafraichi la table
WDTable.prototype.Refresh = function(nReset, nNouveauDebut, sCleNouveauDebut)
{
	// Appel de la methode de la classe de base
	WDChamp.prototype.Refresh.apply(this, [nReset, nNouveauDebut, sCleNouveauDebut]);

	// Indique s'il faut MAJ l'ascenseur
	var bMajAscenseur = false;
	// Si reaffichage de la table
	switch (nReset)
	{
		case 1:
			this.SetDebut(0);
			// Il n'y a pas d'ascenseur en mode sans limite
			if (!this.m_bSansLimite)
				bMajAscenseur = true;
			// Pas de break ???
		case 2:
			// Se repositionne si besoin
			if (nNouveauDebut > -1)
			{
				this.SetDebut(nNouveauDebut, sCleNouveauDebut);
				// On doit remettre l'ascenseur
				bMajAscenseur = true;
			}
			break;
		case 0:
		default:
			break;
	}

	// Si on doit remettre l'ascenseur et que l'on a bien un ascenseur
	if (bMajAscenseur && !this.m_bSansLimite)
		this.MAJAscenseur(true);

	// Vire le cache
	this.m_oCache.RemplitCache(this.m_nDebut, true, this.m_nColonneTrie, this.m_bSensTri);

	// Marque toutes les lignes comme invalide
	this.m_oEtatLignes.Invalide(this, this.m_nDebut, 0, false, null);
	// Et affiche le masque qui empeche la saisie
	this.AfficheMasque(true, true);
};

// Defini le debut de la table
WDTable.prototype.SetDebut = function(nNouveauDebut, sCleNouveauDebut)
{
//	// Arrondi selon le nombre de colonnes
//	var nNbLignesLogiquesParLignePhysique = this.vnGetNbLignesLogiquesParLignePhysique();
//	if (nNbLignesLogiquesParLignePhysique > 1)
//	{
//		nNouveauDebut = Math.floor(nNouveauDebut / nNbLignesLogiquesParLignePhysique);
//		// Normalement si sCleNouveauDebut <> null alors nNouveauDebut ne doit pas changer
//	}

	this.m_nDebut = nNouveauDebut;

	// On peut ne pas avoir de cache au debut
	if (!sCleNouveauDebut && this.m_oCache)
	{
		var oLigneCache = this.m_oCache.oGetLigne(nNouveauDebut);
		if (oLigneCache)
		{
			sCleNouveauDebut = oLigneCache.sGetCleEnreg();
			if (sCleNouveauDebut.length == 0)
			{
				sCleNouveauDebut = null;
			}
		}
	}
	if (sCleNouveauDebut)
		this.m_sCleDebut = sCleNouveauDebut;
	else
		delete this.m_sCleDebut;
};

// Envoie une requete de selection
WDTable.prototype.RequeteSelection = function(nColonneLien)
{
	// Sauve la valeur du formulaire
	var sFormulaire = this.m_oFormulaire ? this.m_oFormulaire.value : "";
	// Et met la valeur complete
	this.SetValFormulaire(this.sConstruitRequeteSelection());

	// Creer une requete de modification de ligne
	this.m_oCache.CreeRequeteSelection(nColonneLien);

	// Restaure le formulaire
	this.SetValFormulaire(sFormulaire);

	// Et affiche le masque qui empeche la saisie
	this.AfficheMasque(true, true);
};

// Recupere le nombre de colonne de presentation
WDTable.prototype.vnGetNbLignesLogiquesParLignePhysique = function()
{
	return 1;
};

// Recupere l'ID de la cellule depuis son numero de le ligne et de son information de colonne dans le cas des tables
WDTable.prototype.sGetIDCellule = function sGetIDCellule(nLigneHTML, nColonneHTML)
{
	return this.sGetSuffixeIDElement(nLigneHTML, nColonneHTML);
};
// Recupere une cellule depuis son numero de le ligne et de son information de colonne dans le cas des tables
WDTable.prototype.oGetIDCellule = function oGetIDCellule(nLigneHTML, nColonneHTML)
{
	return this.oGetElementById(document, this.sGetIDCellule(nLigneHTML, nColonneHTML));
};
WDTable.prototype.oGetIDCelluleRel = function(nLigneRelative, nColonne)
{
	return this.oGetIDCellule(nLigneRelative, nColonne);
//	return this.oGetElementById(document, this.sGetIDCellule(this.nRelative2Absolue(nLigneRelative), nColonne));
};

// On stocke la derniere ligne selectionnee dans le formulaire
WDTable.prototype.SetValFormulaire = function(sValeur)
{
	// Et ecrit dedans s'il est disponible
	if (this.m_oFormulaire) this.m_oFormulaire.value = sValeur;

	// Et ecrit dans le champ cache spacial AWP si il est disponible
	if (this.m_oFormulaireSelAWP)
		this.m_oFormulaireSelAWP.value = this.sConstruitRequeteSelection();
};

// Indique si une ligne est selectionnee : renvoie son indice dans le tableau des selection ou -1 sinon
WDTable.prototype.nLigneSelectionne = function nLigneSelectionne(nLigneAbsolue)
{
	// Convertit la ligne ne numero de ligne avec position absolue
	return this.nLigneSelectionnePosAbsolue(this.nPosVisible2PosAbsolue(nLigneAbsolue));
};

// Version avec un nombre corrige des lignes invsibles
WDTable.prototype.nLigneSelectionnePosAbsolue = function nLigneSelectionnePosAbsolue(nLignePosAbsolue)
{
	var tabSelection = this.m_tabSelection;
	// Recherche dans le tableau
	var i;
	var nLimiteI = tabSelection.length;
	for (i = 0; i < nLimiteI; i++)
	{
		if (tabSelection[i] == nLignePosAbsolue)
			return i;
	}

	// Pas trouve
	return -1;
};

// Indique si une ligne est selectionnee + retourne faux dans le cas des ZRs
WDTable.prototype.vLigneEstSelectionneeSansZR = function(nLigneAbsolue)
{
	return (this.nLigneSelectionne(nLigneAbsolue) != -1);
};

// Selectionne une ligne
// Indique si la ligne a ete selectionnee (Faux si la ligne etait deja selectionnee)
WDTable.prototype.bLigneSelectionne = function bLigneSelectionne(nLigneAbsolue, bCodeNav, oEvent)
{
	// Seulement si la ligne n'existe pas encore
	if (this.nLigneSelectionne(nLigneAbsolue) != -1) return false;

	// Convertit la ligne ne numero de ligne avec position absolue
	return this._bLigneSelectionnePosAbsolue(this.nPosVisible2PosAbsolue(nLigneAbsolue), nLigneAbsolue, bCodeNav, oEvent);
};

// Version avec un nombre corrige des lignes invsibles
WDTable.prototype.bLigneSelectionnePosAbsolue = function bLigneSelectionnePosAbsolue(nLignePosAbsolue, nLigneAbsolue, bCodeNav, oEvent)
{
	// Seulement si la ligne n'existe pas encore
	if (this.nLigneSelectionnePosAbsolue(nLignePosAbsolue) != -1) return false;

	// Convertit la ligne ne numero de ligne avec position absolue
	return this._bLigneSelectionnePosAbsolue(nLignePosAbsolue, nLigneAbsolue, bCodeNav, oEvent);
};

// Version interne
WDTable.prototype._bLigneSelectionnePosAbsolue = function _bLigneSelectionnePosAbsolue(nLignePosAbsolue, nLigneAbsolue, bCodeNav, oEvent)
{
	// Ajoute la ligne
	this.m_tabSelection.push(nLignePosAbsolue);
	// Si la ligne est visible : lui change son style
	if (((this.m_nNbLignesPage == 0) && (nLigneAbsolue < this.m_nNbLignes)) || ((this.m_nNbLignesPage != 0) && (nLigneAbsolue >= this.m_nDebut) && (nLigneAbsolue <= this.m_nDebut + this.m_nNbLignesPage + 1)))
	{
		// Demande a la ligne du cache de se mettre a jour
		var oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
		if (oLigneCache)
		{
			oLigneCache.SetStyle(this.m_tabStyle[2], this, nLigneAbsolue, oEvent);
		}
	}

	// Et on stocke dans le membre de la page la derniere ligne selectionnee
	this.SetValFormulaire(nLignePosAbsolue + 1);

	// Appel le PCode navigateur de selectionne de ligne
	if (bCodeNav)
	{
		this.RecuperePCode(this.ms_nEventNavSelectLigne)(oEvent);
	}

	return true;
};

// Deselectionne une ligne
// Indique si la ligne a ete selectionnee (Faux si la ligne etait deja selectionnee)
WDTable.prototype.bLigneDeselectionne = function(nIndiceTableau, oEvent)
{
	var tabSelection = this.m_tabSelection;

	// Si la ligne n'est pas dans le tableau
	if ((nIndiceTableau < 0) || (nIndiceTableau >= tabSelection.length))
		return false;

	// Recupere le numero de la ligne
	var nLignePosAbsolue = tabSelection[nIndiceTableau];
	// Convertit la ligne ne numero de ligne avec position visible
	var nLigneAbsolue = this.nPosAbsolue2PosVisible(nLignePosAbsolue);

	// Et on vire la ligne du tableau
	tabSelection.splice(nIndiceTableau, 1);

	// Si la ligne est visible : lui change son style
	if (((this.m_nNbLignesPage == 0) && (nLigneAbsolue < this.m_nNbLignes)) || ((this.m_nNbLignesPage != 0) && (nLigneAbsolue >= this.m_nDebut) && (nLigneAbsolue <= this.m_nDebut + this.m_nNbLignesPage + 1)))
	{
		// Demande a la ligne du cache de se mettre a jour
		var oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
		if (oLigneCache)
		{
			oLigneCache.SetStyle((nLigneAbsolue % 2) == 0 ? this.m_tabStyle[0] : this.m_tabStyle[1], this, nLigneAbsolue, oEvent);
		}
	}

	// On met a jour l'eventuel element du formulaire
	this.SetValFormulaire(tabSelection.length > 0 ? (tabSelection[tabSelection.length - 1] + 1) : "");

	// Supprimee
	return true;
};

// Deselectionne tous
WDTable.prototype.bLigneDeselectionneTous = function(nLigneGarde, oEvent)
{
	// Convertit la ligne ne numero de ligne avec position absolue
	var nLigneGardePosAbsolue = this.nPosVisible2PosAbsolue(nLigneGarde);

	var bChangement = false;
	var tabSelection = this.m_tabSelection;
	var nPos = 0;

	while (tabSelection.length > nPos)
	{
		// Uniquement si ce n'est pas la ligne filtree
		if (nLigneGardePosAbsolue != tabSelection[nPos])
		{
			bChangement = this.bLigneDeselectionne(nPos, oEvent);
		}
		else
		{
			nPos++;
		}
	}
	return bChangement;
};

// Calcule la partie de selection transmise dans la requete
WDTable.prototype.sConstruitRequeteSelection = function()
{
	return this.m_tabSelection.join(this.SEL_SEPARATEUR);
};

// Traite la reponse du serveur : remplissage du cache et affichage des donnees si besoin
WDTable.prototype.bActionListe = function(oXMLLignes)
{
	// Sauve l'ancien nombre de lignes
	var nAncienNbLignes = this.m_nNbLignes;
	// Relit le nombre de ligne total de la table (Cas d'une table fichier)
	this.m_nNbLignes = parseInt(clWDAJAXMain.sXMLGetAttribut(oXMLLignes, this.XML_NOMBRE), 10);
	// Puis le place dans l'element du formulaire pour une utilisation en JS (TB53093)
	var oChampOcc = document.getElementsByName("_" + this.sGetNomElement("_OCC"))[0];
	if (oChampOcc)
	{
		oChampOcc.value = this.m_nNbLignes;
	}

	// Regarde si on doit ne pas notifier le serveur des selections
	if (clWDAJAXMain.bXMLAttributExiste(oXMLLignes, this.XML_DESACTIVESERSEL))
	{
		this.m_bRetourServeurSelection = false;
	}

	// Enregistre si c'est une table ou une ZR
	if (clWDAJAXMain.bXMLAttributExiste(oXMLLignes, WDAJAXMain.prototype.XML_CHAMP_ATT_TYPE))
	{
		this.m_nType = parseInt(clWDAJAXMain.sXMLGetAttribut(oXMLLignes, WDAJAXMain.prototype.XML_CHAMP_ATT_TYPE), 10);
	}

	// Si la hauteur de ligne est variable (favorise le vrai si la valeur est absente)
	this.m_bHauteurLigneVariable = clWDAJAXMain.bXMLGetAttributSafe_Vrai(oXMLLignes, this.XML_HAUTEURLIGNEVARIABLE);

	// Recupere le nombre de ruptures
	var nOldRuptures = this.m_nNbRuptures;
	this.m_nNbRuptures = clWDAJAXMain.nXMLGetAttributSafe(oXMLLignes, WDAJAXMain.prototype.XML_CHAMP_LIGNES_RUPTURES, 0);

	// Si on affiche toutes les lignes : cree le HTML et redimensionne les tableaux d'etat
	if (this.m_bSansLimite)
	{
		// On ne le fait que si le nombre de ligne a change ou dans les tables (Inutile ?)
		// Dans les ZR cela gene la saisie en cascade
		if ((nAncienNbLignes != this.m_nNbLignes) || (this.m_nType == WDAJAXMain.prototype.XML_CHAMP_TYPE_TABLE))
		{
			this.GenereLignesHTML();
			this.InitEtatLignes(this.m_nNbLignesHTML);

			// Applique la visibilite des colonnes
			this.AfficheColonnes();
		}
		else if (this.m_nNbLignes == 0)
		{
			// Si on a pas de ligne dans une ZR sans limite : on doit quand meme creer le tableau de m_tabEtatLignes
			this.InitEtatLignes(0);
		}
	}

	// Si le nombre de rupture a changer : il faut remettre a jour les pointeurs vers le HTML
	// (Cest le cas en cas de premier affichage, les HTML des lignes est deja cree AVANT de savoir qu'il y a des ruptures
	// Il faut le faire apres la creation des lignes (cas sans limite)
	if (this.m_nNbRuptures != nOldRuptures)
	{
		this.m_oEtatLignes.RecalculeObjetsRuptures(this);
	}

	// Si on a l'attribut du numero de la colonne tri : actualise l'affichage
	if (clWDAJAXMain.bXMLAttributExiste(oXMLLignes, this.XML_TRI))
	{
		this.m_nColonneTriePre = parseInt(clWDAJAXMain.sXMLGetAttribut(oXMLLignes, this.XML_TRI), 10);
		this.m_bSensTriPre = parseInt(clWDAJAXMain.sXMLGetAttribut(oXMLLignes, this.XML_SENS)) != 0;

		// Actualise l'affichage des pictos
		this.AfficheTriColonne(this.m_nColonneTriePre, !this.m_bSensTriPre);
	}
	else
	{
		delete this.m_nColonneTriePre;
		delete this.m_bSensTriPre;
	}

	// .. Si on n'a pas le nombre total de ligne : note d'envoyer une requete pour faire le parcours en arriere plan
	this.m_bFinTrouve = clWDAJAXMain.bXMLGetAttributSafe(oXMLLignes, this.XML_FIN);
	this.m_sCleParcourtAP = clWDAJAXMain.sXMLGetAttributSafe(oXMLLignes, this.XML_CLEENREGAP, "");

	// Si on recoit une commande de reset : l'execute
	switch (clWDAJAXMain.nXMLGetAttributSafe(oXMLLignes, WDAJAXMain.prototype.XML_CHAMP_REFRESH_RESETTABLE, 0))
	{
		case 1:
			// Si on a l'ttribut de position : se place au bon endroit (Utiliser par la recherche
			if (clWDAJAXMain.bXMLAttributExiste(oXMLLignes, this.XML_DEBUT))
			{
				var sDebut = clWDAJAXMain.sXMLGetAttribut(oXMLLignes, this.XML_DEBUT);
				this.Refresh(1, this.nGetDebut(sDebut), this.sGetDebutCle(sDebut));
			}
			else
				this.Refresh(1, -1);
			return false;
		case 2:
			this.Refresh(2, -1);
			return false;
		default:
			// Si on a l'ttribut de position : se place au bon endroit (Utiliser par la recherche
			if (clWDAJAXMain.bXMLAttributExiste(oXMLLignes, this.XML_DEBUT))
			{
				var sDebut = clWDAJAXMain.sXMLGetAttribut(oXMLLignes, this.XML_DEBUT);
				this.SetDebut(this.nGetDebut(sDebut), this.sGetDebutCle(sDebut));
			}
			break;
	}

	// Vide le cache des donnees inutiles
	this.m_oCache.SupprimeLignesInutiles();

	// On lance le parcours des nodes filles
	var oXMLFils = oXMLLignes.firstChild;
	while (oXMLFils != null)
	{
		// Selon le type d'action
		switch (oXMLFils.nodeName)
		{
			// Remplit le cache avec les donnees recues
			case this.XML_LIGNES: this.m_oCache.RemplitCacheLignes(oXMLFils); break;
			// Selection
			case this.XML_SELECTIONS: this.RemplitSelection(oXMLFils); break;
			// Remplit les proprietes des colonnes
			case this.XML_COLONNES: this.RemplitColonnes(oXMLFils); break;
			// Affiche une erreur
			case this.XML_ERREUR: this.AfficheErreur(oXMLFils); break;
		}
		// On passe au fils suivant
		oXMLFils = oXMLFils.nextSibling;
	}

	// Si on a un ascenseur
	if (!this.m_bSansLimite)
	{
		var bForceMAJ = clWDAJAXMain.bXMLAttributExiste(oXMLLignes, this.XML_DEBUT);
		// Met a jour la bare de defilement et les lignes visible a l'ecran
		// Sauf si on a des ruptures (sera fait APRES la MAJ de l'ecran sinon l'ascenseur utilise des anciennes donnees et un effet de yoyo apparait)
		// Sauf aussi si la hauteur des lignes est variables
		// Mais on le force si la MAJ est force
		if (bForceMAJ || !this.bGetHauteurLigneVariable())
		{
			this.MAJAscenseur(bForceMAJ);
		}
	}

	// Met a jour les pictos de tri de la table (maintenant que l'on a recu la liste des colonnes)
	this.vAffichePictoTriColonnes();

	// Et met a jour l'affichage
	this.MAJLignes();

	// Si on a un ascenseur et des ruptures, MAJ retarde (apres affichage) de l'ascenseur
	if (!this.m_bSansLimite && this.bGetHauteurLigneVariable())
	{
		this.nSetTimeout("MAJAscenseurRuptures", 1);
	}

	// Essaie de chercher la fin si besoin
	if (this.m_bFinTrouve == false)
		this.ChercheFin();

	// Decide si il faut afficher ou non le picto de travail
	this.AfficheLoading();

	return true;
};

//	// Retourne la bulle d'une colonne
//	WDTable.prototype.sGetBulle = function (sColonne)
//	{
//		var sBulle = this.m_tabColonnesBulles[sColonne];
//		return sBulle ? sBulle : "";
//	},

// Indique si la hauteur des lignes est variables
WDTable.prototype.bGetHauteurLigneVariable = function bGetHauteurLigneVariable()
{
	return (this.m_bHauteurLigneVariable || (this.m_nNbRuptures > 0));
};

// Genere le nombre de ligne HTML qui va bien pour afficher le tableau
WDTable.prototype.GenereLignesHTML = function()
{
	// Recupere la balise table.
	var oBaliseTable = this.oGetIDElement(this.ID_TABLEINTERNE);

	// Supprime les lignes actuelles
	SupprimeFils(oBaliseTable);

	// Cree des nouvelles lignes
	var i;
	this.m_nNbLignesHTML = Math.ceil(this.m_bSansLimite ? this.m_nNbLignes / this.vnGetNbLignesLogiquesParLignePhysique() : (this.m_nNbLignesPage / this.vnGetNbLignesLogiquesParLignePhysique()) + 2);
	var nLimiteI = this.m_nNbLignesHTML;

	// Recupere le HTML des lignes
	var sHTMLLigne = this.m_sHTMLLigne;
	// Remplace le mot cle de l'ancien mode par celui du nouveau mode
	var rRemplacement = new RegExp("\\[%" + this.m_sAliasChamp + "%\\]", "g");
	sHTMLLigne = sHTMLLigne.replace(rRemplacement, "[%_INDICE_%]");

	// Le tableau du HTML des lignes
	var tabHTMLLigne = new Array(nLimiteI);

	for (i = 0; i < nLimiteI; i++)
	{
		// Construit le HTML de la nouvelle ligne
		// Remplacer les balises indiquant le numero de ligne
		tabHTMLLigne[i] = sHTMLLigne.replace(/\[%_INDICE_%\]/g, i);
//		// Plus de remplacement des commentaires (deja fait au chargement du HTML)
//		var oTmp = this;
//		tabHTMLLigne[i] = tabHTMLLigne[i].replace(/\[%(\w+)\.\.BULLE%\]/g, function(sVal, sCol) { return oTmp.sGetBulle(sCol) } );
	}

	// Et selon le navigateur on recree la table differement
	if (bIE)
	{
		// Pour IE

		// Recupere le HTML
		var sHTMLTable = oBaliseTable.outerHTML;
		sHTMLTable = clWDAJAXMain.sSansEspace(sHTMLTable, true, true, true);

		// Et contruit le HTML global
		oBaliseTable.outerHTML = sHTMLTable.substr(0, sHTMLTable.length - "</TABLE>".length) + tabHTMLLigne.join("") + "</TABLE>";
	}
	else
	{
		var oRange = document.createRange();
		oRange.setStart(oBaliseTable, 0);
		oBaliseTable.appendChild(oRange.createContextualFragment(tabHTMLLigne.join("")));
		// Force le reflow de la page car sinon firefox ne le fait pas bien (Au moins jusqu'a la version
		oBaliseTable.style.width = oBaliseTable.style.width;
	}
};

// Remplit la table des lignes selectionnees
WDTable.prototype.RemplitSelection = function(oXMLSelections)
{
	// Supprime la selection memorise courante
	this.bLigneDeselectionneTous(-1);

	// Met a jour le cache des selections
	var oXMLSelection = oXMLSelections.firstChild;
	while (oXMLSelection != null)
	{
		// Lit le numero de la ligne
		//assert(XMLLigne.nodeName == this.XML_SELECTION);
		var nSelection = parseInt(clWDAJAXMain.sXMLGetValeur(oXMLSelection));
		// Les numeros recu sont deja corrige des lignes invisibles
		this.bLigneSelectionnePosAbsolue(nSelection, this.nPosAbsolue2PosVisible(nSelection), false);

		// Passe a la selection suivante
		oXMLSelection = oXMLSelection.nextSibling;
	}
};

// Recupere le nombres de ruptures
WDTable.prototype.nGetNbRuptures = function nGetNbRuptures()
{
	return this.m_nNbRuptures;
};

// Remplit les proprietes des colonnes
WDTable.prototype.RemplitColonnes = function(oXMLColonnes)
{
	// Vide la liste des colonnes
	this.m_tabColonnes = new Array(oXMLColonnes.childNodes.length)
	var tabColonnes = this.m_tabColonnes;

	// Puis parse le XML
	var oXMLColonne = oXMLColonnes.firstChild;
	var nPos = 0;
	while (oXMLColonne != null)
	{
		// Lit le numero de la ligne
		//assert(XMLLigne.nodeName == this.XML_COLONNE);
		tabColonnes[nPos++] = new WDColonne(oXMLColonne);
		// Passe a la selection suivante
		oXMLColonne = oXMLColonne.nextSibling;
	}

	// Applique la visibilite des colonnes
	this.AfficheColonnes();
};

// Applique la visibilite des colonnes
WDTable.prototype.AfficheColonnes = function()
{
	var tabColonnes = this.m_tabColonnes;
	var i;
	var nLimiteI = tabColonnes.length;
	for (i = 0; i < nLimiteI; i++)
	{
		this.AfficheColonne(i, tabColonnes[i].m_bVisible);
	}
};

// Effectue les modifications de visibilite requise sur les colonnes
WDTable.prototype.AfficheColonne = function(nColonne, bAffiche)
{
	// Affiche ou pas le titre de la colonne
	this.AfficheCellule(this.ID_TITRE, nColonne, 2, bAffiche);

	// Si la colonne n'existe pas (Pas de ligne visible) alors on ne fait rien
	var oPremiereCellule = this.oGetIDElement(0, nColonne);
	if (!oPremiereCellule)
		return;

	// Defini la taille de la colonne cote donnees
	// Si le style est deje OK ne fait rien
	var oDiv = oPremiereCellule.parentNode.parentNode;
	var oCelluleCurrentStyle = _JGCS(oDiv);
	if (oCelluleCurrentStyle.display == (bAffiche ? sGetDisplayBlock(oDiv) : 'none'))
		return;

	// Applique le style sur les lignes
	var i;
	var nLimiteI = this.m_oEtatLignes.nGetNbEtatLignes();
	for (i = 0; i < nLimiteI; i++)
	{
		this.AfficheCellule(i, nColonne, 2, bAffiche);
	}
};

// Effectue les modifications de visibilite requise sur une cellule
WDTable.prototype.AfficheCellule = function(nLigne, nColonne, nNiveau, bAffiche)
{
	// Recupere le DIV
	var oDiv = this.oGetIDElement(nLigne, nColonne);
	if (!oDiv) return;
	while (nNiveau-- > 0)
	{
		// On un niveau de DIV de plus
		oDiv = oDiv.parentNode;
		if (!oDiv) return;
	}
	// On est sur le TD parent
	SetDisplay(oDiv, bAffiche);
	// Dans FireFox : oDiv.nextSibling ne suffit pas car on trouve un noeud texte entre les balises
	var oTDSuivant = oDiv.nextSibling;
	while (oTDSuivant && oTDSuivant.nodeName == "#text")
	{
		oTDSuivant = oTDSuivant.nextSibling;
	}
	// Il faut aussi rendre invisible la colonne de redimensionnement
	if (oTDSuivant && (oTDSuivant.id.length == 0))
	{
		SetDisplay(oTDSuivant, bAffiche);
	}
};

// Affiche un erreur sur les tables
WDTable.prototype.AfficheErreur = function(oXMLErreur)
{
	// Recupere le texte de l'erreur
	alert(clWDAJAXMain.sXMLGetValeur(oXMLErreur));
};

// Vide une cellule de table
WDTable.prototype.vVideCellule = function vVideCellule(oCellule)
{
	// La suppression des ruptures est fait par l'appel parent

	// Rien actuellement
};

// Remplit une cellule de la table
WDTable.prototype.vRemplitCellule = function vRemplitCellule(oCellule, sValeur, nLigneAbsolue, nColonne)
{
	// L'ajout des ruptures est fait par l'appel parent

	// L'element cree
	var oElement;
	var oTmp = this;

	// Place la bulle de la colonne
	if (this.m_tabColonnes[nColonne].m_sBulle)
	{
		oCellule.title = this.m_tabColonnes[nColonne].m_sBulle;
	}
	else
	{
		oCellule.removeAttribute("TITLE", 0);
	}

	// Selon le type de la colonne
	switch (this.nColonneType(nColonne))
	{
		// Interrupteur
		case WDAJAXMain.prototype.XML_CHAMP_TYPE_INTERRUPTEUR:
			// Creation d'un objat INPUT avec type="checkbox"
			oElement = document.createElement("INPUT");
			oElement.type = "checkbox";
			// Coche ?
			oElement.checked = (sValeur == "1");
			// Calcul du nom et affectation a NAME et a ID
			var sName = this.sGetSuffixeIDElement(nLigneAbsolue, this.m_sAliasChamp, nColonne);
			oElement.name = sName;
			oElement.id = sName;
			// Si saissisable
			if (this.bColonneSaisissable(nColonne))
			{
				if (bIE)
				{
					oElement.onclick = function() { oTmp.ClickInterrupteur(event, oElement, nLigneAbsolue, nColonne); return bStopPropagation(event); };
				}
				else
				{
					oElement.onclick = function(event) { oTmp.ClickInterrupteur(event, oElement, nLigneAbsolue, nColonne); return bStopPropagation(event); };
				}
			}
			else
			{
				oElement.disabled = true;
			}

			// Centre l'interrupteur dans le parent
			oCellule.style.textAlign = "center";
			oCellule.style.verticalAlign = "middle";
			break;

		// Colonne image
		case WDAJAXMain.prototype.XML_CHAMP_TYPE_IMAGE:
			// Creer un champ image avec la bonne source
			if (sValeur.length > 0)
			{
				oElement = document.createElement("IMG");
				oElement.src = sValeur;
				if (bIE)
					oElement.onreadystatechange = function() { oTmp.RedimImage(oElement); };
				else
					oElement.onload = function() { oTmp.RedimImage(oElement); };

				// Si la colonne est lien actif
				if ((this.nColonneLien(nColonne) > 0) && ((this.nColonneEtatLien(nColonne) == 0) || (this.nColonneEtatLien(nColonne) == 5)))
				{
					if (bIE)
						oElement.onclick = function() { oTmp.OnColonneLien(nLigneAbsolue, nColonne, event); };
					else
						oElement.onclick = function(event) { oTmp.OnColonneLien(nLigneAbsolue, nColonne, event); };
				}

				// Centre l'image dans le parent
				oCellule.style.textAlign = "center";
				oCellule.style.verticalAlign = "middle";
			}
			break;

		// Colonne combo (liste de valeurs)
		case WDAJAXMain.prototype.XML_CHAMP_TYPE_COMBO:
			// Pas de brak; car comme colonne en saisie pour ce qui est de l'affichage => Simple texte

			// Colonne "simple" : colonne en saisie
		case WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE:
		default:
			// Si la colonne n'est pas lien : remplit simplement la cellule
			switch (this.nColonneLien(nColonne))
			{
				default:
				case 0:
					// Si on est en mode hauteur de ligne variable et que le contenu contient des RC, on les restectes
					if (this.m_bHauteurLigneVariable && ((-1 != sValeur.indexOf("\r")) || (-1 != sValeur.indexOf("\n"))))
					{
						// Creation d'un span conteneur
						oElement = document.createElement("span");
						// Remplace les \r\n par des <br />
						var tabLignesTexte = sValeur.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
						var i;
						var nLimiteI = tabLignesTexte.length;
						for (i = 0; i < nLimiteI; i++)
						{
							if (i > 0)
							{
								oElement.appendChild(document.createElement("br"));
							}
							oElement.appendChild(document.createTextNode(clWDEncode.sEncodeCharset(tabLignesTexte[i], false)));
						}
					}
					else
					{
						// Si on est en encodage latin-1 (Donc pas en UTF-8) : On encode les caracteres > 127
						// Pas besoin de le faire en UTF-8 car il on deja ete encode pour avoir au final la bonne valeur unicode
						oElement = document.createTextNode(clWDEncode.sEncodeCharset(sValeur, false));
					}
					break;
				case 1: // Lien
				case 2: // Lien avec submit
					// Sinon on rajoute un lien autour
					oElement = document.createElement("A");

					// Calcule l'etat du lien
					switch (this.nColonneEtatLien(nColonne))
					{
						default:
						case 0: // Actif
						case 5: // AffSansSel
							var oTmp = this;
							oElement.href = "javascript:void(0);"
							if (bIE)
								oElement.onclick = function() { oTmp.OnColonneLien(nLigneAbsolue, nColonne, event); };
							else
								oElement.onclick = function(event) { oTmp.OnColonneLien(nLigneAbsolue, nColonne, event); };
							break;
						case 4: // Grise
							oElement.disabled = true;
							// Pas de 'break;' : grise => DISABLED + READONLY
						case 1: // Lecture seule
							// On ne met pas de HREF pour ne pas avoir le soulignement du lien
							oElement.readOnly = true;
							break;
					}

					oElement.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, true);
					break;
			}
			break;
	}

	// Supprime le contenu actuel
	while (oCellule.childNodes.length)
	{
		// Si le noeud est de type lien, on supprime son evenement onclick car dans les garbages
		// collector de IE n'arrivent pas a detecter la reference circulaire (entre l'objet DOM et
		// l'objet JS) dans ce cas precis. Et au final l'objet n'est pas libere
		var oChild = oCellule.childNodes[0];
		if (oChild.tagName == "A")
		{
			oChild.onclick = null;
		}
		oCellule.removeChild(oChild);
	}

	var oNewElement;
	if (oElement)
	{
		// Et ajoute l'element. On perd la selection de la case a cocher (????)
		var oChecked = oElement.checked;
		oNewElement = oCellule.appendChild(oElement);
		// Fait un simple test pour la restauration car de toute facon soit c'est undefined, a false ou a true
		// Comme la valeur par defaut est false on n'a pas de probleme
		if (oChecked) oElement.checked = true;
	}

	if (this.nColonneType(nColonne) == WDAJAXMain.prototype.XML_CHAMP_TYPE_IMAGE)
	{
		if (oNewElement) this.RedimImage(oNewElement);
	}

	// Si la colonne n'est pas saisissable : affiche un autre curseur
	if (this.bColonneSaisissable(nColonne) == false)
	{
		oCellule.style.cursor = "default";
	}
};

// Vide les ruptures
WDTable.prototype.VideRuptures = function VideRuptures(oEtatLigne)
{
	// Vide les ruptures uniquement si on est sur la premiere colonnes
	if (this.nGetNbRuptures() > 0)
	{
		this.VideUneRupture(oEtatLigne.m_oRupturesHaut);
		this.VideUneRupture(oEtatLigne.m_oRupturesBas);
	}
};

// Vide une cellule de rupture
WDTable.prototype.VideUneRupture = function VideUneRupture(oRupture)
{
	// La rupture n'existe pas toujours (colonne autre que la premiere pour le haut)
	if (oRupture)
	{
		// Supprime le contenu
		// Supprimer les evenements des elements formulaires pour les reference circulaires entre le DOM et le JS ?
		SupprimeFils(oRupture);

		// Et masque la cellule
		SetDisplay(oRupture.parentNode, false);
	}
};

// Remplit les ruptures
WDTable.prototype.RemplitRuptures = function RemplitRuptures(oEtatLigne, nColonneHTML, oValeursRuptures)
{
	// Remplit les ruptures uniquement si on est sur la premiere colonne
	// C'est inutile de le faire pour les autres colonne :
	// - Dans une table, les colonnes appartiennent a la meme ligne
	// - Dans une ZRs (multicolones), la ligne change s'il y a une rupture
	if (this.nGetNbRuptures() > 0)
	{
		var oValeursRuptures = oValeursRuptures ? oValeursRuptures : {};
		// Seul la premire ligne logique peu afficher une rupture
		this.RemplitUnRupture(oEtatLigne.m_oRupturesHaut, oValeursRuptures.m_sHaut, (nColonneHTML == 0));
		// On vide systematiquement pour les bas de ruptures
		// Il faudra peut-etre etre plus precis (bug ? si on met a jour un element au millieu d'une ligne)
		this.RemplitUnRupture(oEtatLigne.m_oRupturesBas, oValeursRuptures.m_sBas, true);
	}
};

// Replit une cellule de rupture
WDTable.prototype.RemplitUnRupture = function RemplitUnRupture(oRupture, sValeur, bVide)
{
	// La rupture n'existe pas toujours (colonne autre que la premiere pour le haut)
	if (oRupture)
	{
		// Vide le contenu actuel de la rupture si demande
		if (bVide)
		{
			this.VideUneRupture(oRupture);
		}

		// Remplit la rupture
		if (sValeur && sValeur.length)
		{
			oRupture.innerHTML = clWDEncode.sEncodeInnerHTML(sValeur, false, true);
			// Normalement oRupture est un TD
			SetDisplay(oRupture.parentNode, true);
		}
	}
};

// Redimensionne une image en gardant son aspect
WDTable.prototype.RedimImage = function(oImage)
{
	if (bIE && (oImage.readyState != "complete"))
		return;

	// Recupere les dimensions
	var nImageX = oImage.offsetWidth;
	var nImageY = oImage.offsetHeight;
	var nDispoX = oImage.parentNode.parentNode.clientWidth;
	var nDispoY = oImage.parentNode.parentNode.clientHeight;

	var nFinalX = nDispoX;
	var nFinalY = nDispoY;

	// Si une des dimensions est trop petite
	if (nImageX <= nDispoX)
	{
		if (nImageY <= nDispoY)
		{
			// L'image est plus petite que la place disponible
			// Ne fait rien => Le navigateur affiche deje bien l'image
			return;
		}
		else
		{
			// La dimension verticale est la contrainte
			nFinalX = nImageX * nDispoY / nImageY;
//			nFinalY = nDispoY;
		}
	}
	else if (nImageY <= nDispoY)
	{
		// La dimension Y est trop petite
		// Pas besoin de tester le cas X trop petit (Deje teste) => la dimension horizontale est la contrainte
//		nFinalX = nDispoX;
		nFinalY = nImageY * nDispoX / nImageX;
	}
	else
	{
		// L'image est trop grande dans les deux dimensions

		// Calcule les deux ratios de dimension
		var dRImage = nImageX / nImageY;
		var dRDispo = nDispoX / nDispoY;
		// On se place dans une ou l'autre dimension
		if (dRDispo > dRImage)
		{	// La contrainte est la hauteur
			nFinalX = nDispoY * dRImage;
//			nFinalY = nDispoY;
		}
		else
		{	// La contrainte est la largeur
//			nFinalX = nDispoX;
			nFinalY = nDispoX * dRImage;
		}
	}
	oImage.style.width = nFinalX + "px";
	oImage.style.height = nFinalY + "px";
};

// Gestion de la modification des interrupteurs
WDTable.prototype.ClickInterrupteur = function(oEvent, oInterrupteur, nLigneAbsolue, nColonne)
{
	var nLigneRelative = nLigneAbsolue - this.m_nDebut;

	var sValeur = oInterrupteur.checked ? "1" : "0";
	var nValeur = oInterrupteur.checked ? 1 : 0;

	// Cree la ligne virtuelle si besoin
	this.CreeLigneVirtuelle(nLigneRelative);
	// Valide le changement
	this.ChangementValeur(nLigneRelative, nColonne, sValeur, nValeur);
	// Et notifie le serveur
	this.ValideChangement(nLigneRelative);
	// Et on demande la MAJ de la ligne
	this.bMAJLigne(nLigneAbsolue);
	// Supprime la ligne virtuelle
	this.SupprimeLignesVirtuelles();
};

// Decide si il faut afficher ou non le picto de travail
WDTable.prototype.AfficheLoading = function()
{
	var oImgChargement = this.oGetIDElement(this.ID_CHARGEMENT_IMG);
	if (oImgChargement)
	{
		oImgChargement.style.visibility = ((!this.m_bFinTrouve) || (this.m_oCache.m_tabRequetes.length > 0)) ? "inherit" : "hidden";
	}
};

// Envoie une requete (Via un timer) pour avoir la fin du fichier apres une petite temporisation
// Verifie si on n'a pas une requete normale en cours pour ne pas lancer la requete de remplissage
// On ne peu etre e la fin car on remplit en arriere plan
WDTable.prototype.ChercheFin = function()
{
	// Si on a deja une requete en cours => Ne fait rien
	// Ou si on connait la fin
	if ((this.m_oCache.m_tabRequetes.length > 0) || this.m_bFinTrouve)
	{
		return;
	}

	// Note d'envoier une requete aux serveur dans ce domaine dans une seconde
	this.nSetTimeout("EnvoieChercheFin", 1000);
};

// Envoie un requte pour calculer la fin
WDTable.prototype.EnvoieChercheFin = function()
{
	// Si on a deja une requete en cours => Ne fait rien
	// Ou si on connait la fin (Requete arrive entre temps)
	if ((this.m_oCache.m_tabRequetes.length > 0) || this.m_bFinTrouve)
	{
		return;
	}

	// Cree une requete que l'on envoie
//	this.m_oCache.CreeRequete(new Segment(-1, -1), -1, true, this.m_nCleEnregPosParcourAP, this.m_sCleEnregParcourAP)
	this.m_oCache.CreeRequete(new Segment(-1, -1), -1, true, -1, "")
};

// Rafraichit une ligne
WDTable.prototype.bMAJLigne = function bMAJLigne (nLigneAbsolue, oEvent)
{
	return this.m_oCache.bMAJLigne(nLigneAbsolue);
};
WDTable.prototype.bMAJLigneRel = function bMAJLigneRel (nLigneRelative, oEvent)
{
	return this.m_oCache.bMAJLigne(this.nRelative2Absolue(nLigneRelative));
};

WDTable.prototype.nRelative2Absolue = function nRelative2Absolue(nLigneRelative)
{
	return nLigneRelative + this.m_nDebut;
};

// Rafraichit les lignes visible si besoin
WDTable.prototype.MAJLignes = function MAJLignes (oEvent)
{
	// Parcours les lignes invalides
	var i;
	var nNumPlein = 0;
	var nLimiteI = this.m_oEtatLignes.nGetNbEtatLignes();
	var nLimiteJ = this.vnGetNbLignesLogiquesParLignePhysique();
	var nLigneAbsolue = this.m_nDebut;
	var oLigneCache;
	for (i = 0; i < nLimiteI; i++)
	{
		// Recupere la ligne
		var oEtatLigne = this.m_oEtatLignes.oGetEtatLigne(i);

		// Parcours les lignes logiques
		// Sur la premiere cellule il y a forcement du contenu
		var j;
		for (j = 0; j < nLimiteJ; j++, nLigneAbsolue++)
		{
			// Ce cas est inclus dans le suivant car si this.m_nDebut == 0 alors nLigneAbsolue == i donc (i >= this.m_nNbLignes) equivaut a (nLigneAbsolue >= this.m_nNbLignes)
//			// Si la table ne peux etre completement affichee et que l'on est dans une ligne masque
//			if ((this.m_nDebut == 0) && (this.m_nNbLignes < this.m_nNbLignesPage) && (i >= this.m_nNbLignes))
			if (nLigneAbsolue >= this.m_nNbLignes)
			{
				// Si la ligne est visible => La masque
				if (oEtatLigne.bPlein(j))
				{
					oEtatLigne.MasqueLigne(j, this, nLigneAbsolue, oEvent);
				}
				// Mais c'est un cas ou il faut compter la ligne comme pleine
				nNumPlein++;
			}
			else
			{
				// Affiche la ligne
				oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
				if (oLigneCache)
				{
					// Si on change de ligne (rupture)
					if (oLigneCache.vnGetColonneHTML() != j)
					{
						for (; j < nLimiteJ; j++)
						{
							oEtatLigne.MasqueLigne(j, this, nLigneAbsolue, oEvent);
						}
						break;
					}
//					oEtatLigne.AfficheLigne(j, oLigneCache, this, nLigneAbsolue, oEvent);
				}
				oEtatLigne.bMAJ(j, oLigneCache, this, nLigneAbsolue, oEvent);

				// Met le style de la ligne
				// Ligne "impaire" (La numerotation commence a zero pour la ligne 1)
				var sStyle = ((nLigneAbsolue) % 2) == 0 ? this.m_tabStyle[0] : this.m_tabStyle[1];
				// Si la ligne est selectionne, on met un style particulier s'il y en a un
				if ((this.nLigneSelectionne(nLigneAbsolue) != -1) && (this.m_tabStyle[2].length > 0))
				{
					sStyle = this.m_tabStyle[2];
				}

				oEtatLigne.SetStyle(j, sStyle);

//				if (!oLigneCache)
//				{
//					// Et on demande au cache de la mettre a jour si besoin
//					oEtatLigne.bMAJ(this, nLigneAbsolue, oEvent);
//				}

				// Compte le nombre de lignes OK
				if (oEtatLigne.bPlein(j))
				{
					nNumPlein++;
				}
			}
		}
	}

	// Si la fonction existe dans la page : effectue les operations apres submit AJAX
	if (window.FinSubmitAJAX && (typeof FinSubmitAJAX == "function"))
	{
		FinSubmitAJAX();
	}

	// Affiche eventuellement le masque
	this.AfficheMasque(nNumPlein != nLimiteI, false);
};

WDTable.prototype.AfficheMasque = function(bVisible, bMasqueTransparent)
{
	// Affiche la petite image de chargement
	this.AfficheLoading();

	// Si il y a des requetes de tri en attente dans le cache : force le masque
	if (this.m_oCache.bAvecRequeteTri())
		bVisible = true;

	// Si l'etat du masque ne change pas on ne fait rien pour ne pas changer les animations
	if (this.m_bMasqueVisible == bVisible)
		return;

	// Sauve l'etat du masque
	this.m_bMasqueVisible = bVisible;

	// Affiche les masques qui vont bien
	this.AfficheMasques(bMasqueTransparent);

	// Si on ne force pas le masque d'attente alors on se note de l'afficher peut etre dans quelques instants
	if (bMasqueTransparent)
	{
		this.nSetTimeout("AfficheMasques", 1000, false);
	}
};

// Affiche les masque si besoin
WDTable.prototype.AfficheMasques = function(bMasqueTransparent)
{
	// Affiche les masques qui vont bien
	this.AfficheUnMasque(this.ID_MASQUE, this.m_bMasqueVisible && !bMasqueTransparent);
	// Masque transparent
	this.AfficheUnMasque(this.ID_MASQUETRANSPARENT, this.m_bMasqueVisible && bMasqueTransparent);
};

// Affiche un masque
WDTable.prototype.AfficheUnMasque = function(sIdMasque, bVisible)
{
	// Recupere le masque
	var oMasque = this.oGetIDElement(sIdMasque);

	// On deplace enventuellement le champ si il va etre visible
	if (bVisible)
	{
		oMasque.style.left = oMasque.parentNode.scrollLeft;
		// Et on le redimensionne aussi pour qu'il prenne la place disponible
//		oMasque.style.width = oMasque.parentNode.clientWidth;
//		oMasque.style.height = oMasque.parentNode.clientHeight;
		oMasque.style.width = oMasque.parentNode.offsetWidth;
		oMasque.style.height = oMasque.parentNode.offsetHeight;
	}
	else
	{
		// On remet a gauche pour eviter les probleme de zone vide a droite
		oMasque.style.left = 0;
	}

	// Si on n'a pas toutes les lignes ou s'il y a des requetes en cours => L'affiche
	oMasque.style.visibility = bVisible ? "inherit" : "hidden";
};

// Notifie les champs qu'une ligne va etre masque
WDTable.prototype._vMasqueLigneInterne = function _vMasqueLigneInterne(nLigneAbsolue, bLigneSelectionnee, oEvent)
{
	// Rien
};

// Recupere les valeurs de la zone de l'ascenseur en tenant compte du facteur multiplicatif
WDTable.prototype.nGetAscenseurParentScrollTop = function()
{
	var oScrollTop = this.m_nAscenseurParentScrollTop ? this.m_nAscenseurParentScrollTop : this.m_oAscenseurParent.scrollTop;
	if (this.m_nFacteurAscenseur == 1)
	{
		// Si il n'y a pas de facteur multiplicatif, on retourne la valeur directement
		// Il y un cas particulier pour eviter les calculs abusifs et les division par zero dans le cas ou toutes les lignes sont visibles
		return oScrollTop;
	}
	else
	{
		// s = scrollTop, f = facteur multiplication, Nv = nombre de lignes visible, Nt = nombre de lignes total, h = hauteur d'une ligne
		// Pourquoi ?
		// ScrollTop * f est une bonne aproximation
		// Sauf que la zone ne defile que jusqu'a la hauteur visible de la zone (ScrollTop = HauteurTotale - HauteurVisible)
		// Cette zone depend de la table/ZR et ne TIENT pas compte du facteur multiplicatif ce qui fait que l'on ne peut scroller que jusqu'a (f - 1) page de la fin.
		// Donc il faut un facteur correctif pour tenir compte de cette hauteur.
		// Mais ce facteur commence a zero (il ne faut pas decaler de (f - 1) page en haut)
		// Donc (f - 1) est module par la position dans la table
		// En faut cette formule est factorisee et la valeur hauteur de ligne n'est pas prise en compte (calcule par l'appelant)
		// La formule originale est la suivante :
		//			  s * f   Nv * (f - 1) * s * f	 s * f		  Nv * (f - 1)
		// Position = ----- + -------------------- = ----- * (1 + ------------)
		//				h		 (Nt - Nv) * h		   h			Nt - Nv
		return oScrollTop * this.m_nFacteurAscenseur * (1 + this.m_nNbLignesPage * (this.m_nFacteurAscenseur - 1) / (this.m_nNbLignes - this.m_nNbLignesPage));
	}
};

// Affecte le deplacement de l'ascenseur en differe
WDTable.prototype.SetAscenseurParentScrollTop = function(fNouvellePositionSansCorrection)
{

	// Cas general (pas de facteur multiplicatif)
	var fNouvellePosition = fNouvellePositionSansCorrection;
	if (this.m_nFacteurAscenseur > 1)
	{
		fNouvellePosition = fNouvellePositionSansCorrection / this.m_nFacteurAscenseur;
		fNouvellePosition *= 1 - this.m_nNbLignesPage * (this.m_nFacteurAscenseur - 1) / (this.m_nNbLignes - this.m_nNbLignesPage);
	}

	// Si la position change
	var nNouvellePosition = Math.floor(fNouvellePosition);
	// Gere le cas de deux appel en serie : utilisation de nSetTimeoutUnique et comparaison a la valeur memoriser
	var nAnciennePosition = (this.m_nAscenseurParentScrollTop !== undefined) ? this.m_nAscenseurParentScrollTop : this.m_oAscenseurParent.scrollTop;
	if (nAnciennePosition != nNouvellePosition)
	{
		this.m_nAscenseurParentScrollTop = nNouvellePosition;
		this.nSetTimeoutUnique("SetAscenseurParentScrollTopCallBack", 500, nNouvellePosition);
	}
};

// Affecte le deplacement de l'ascenseur
WDTable.prototype.SetAscenseurParentScrollTopCallBack = function(nNouvellePosition)
{
	delete this.m_nAscenseurParentScrollTop;
	this.m_oAscenseurParent.scrollTop = nNouvellePosition;
};

// Corrige m_bDebordeLargeur selon le type du champ (pour les ZRs)
WDTable.prototype._vRedimAscenseur = function()
{
	// Rien dans les tables
};

// Redimensionne l'ascenseur si besoin
WDTable.prototype.RedimAscenseur = function()
{
	// Met a jour le flag de debordement en largeur
	this.m_bDebordeLargeur = (this.m_oDivPos.parentNode.scrollWidth > this.m_oDivPos.parentNode.clientWidth);

	// Si l'ascenseur horizontal a ete force : il faut en tenir compte
	if ((this.m_oDivPos.parentNode.style.overflowX == "scroll") || (this.m_oDivPos.parentNode.style.overflow == "scroll"))
		this.m_bDebordeLargeur = true;

	// Corrige m_bDebordeLargeur selon le type du champ (pour les ZRs)
	this._vRedimAscenseur();

	var sNouvelleHauteur = "";

	// Si la table deborde
	if (this.m_bDebordeLargeur)
	{
		// Reduit le div de l'ascenseur vertical si besoin
		var oConteneurDroite = this.m_oAscenseurParent.parentNode;
		sNouvelleHauteur = (oConteneurDroite.parentNode.clientHeight - 18) + "px";
	}
	else
	{
		var oConteneurDroite = this.m_oAscenseurParent.parentNode;
		sNouvelleHauteur = "100%";
	}
//	oConteneurDroite.style.height = sNouvelleHauteur;
	// On ne change pas la taille sinon cela deplace l'ascenseur
	if (this.m_oAscenseurParent.style.height != sNouvelleHauteur)
	{
		this.m_oAscenseurParent.style.height = sNouvelleHauteur;
	}
};

// Lit la hauteur de la ligne
// (on ne doit pas etre en mode sans limite)
WDTable.prototype.__nGetHauteurLigne = function __nGetHauteurLigne(nLigneAbsolue)
{
	return this.m_oCache.nGetHauteur(nLigneAbsolue);
};

// Lit la hauteur de la ligne en valeur relative a la premiere ligne te tient compte du mode sans limite
WDTable.prototype.nGetHauteurLigneRel = function nGetHauteurLigneRel(nLigneRelative)
{
	if (this.m_bSansLimite)
	{
		// Recupere la hauteur de la ligne depuis le debut
		// En mode sans limite ligne relative <=> ligne absolue
		var oEtatLigne = this.m_oEtatLignes.oGetEtatLigne(nLigneRelative);
		return oEtatLigne.m_oLignePhysique.offsetHeight + this._vnGetOffset(oEtatLigne.m_oLignePhysique);
	}
	else
	{
		// Retourne -1 si la hauteur de la ligne est inconnue
		return this.__nGetHauteurLigne(this.nRelative2Absolue(nLigneRelative));
	}
};

// Position la zone de placement au pixel en tenant compte de la hauteur de la premiere ligne
WDTable.prototype.nGetDivPosTop = function nGetDivPosTop()
{
	// Recupere la valeur originale en conservant la partie decimale
	var sPos = this.m_oDivPos.style.top;
	if (sPos.length == 0)
	{
		return 0;
	}
	var fPos = parseFloat(this.m_oDivPos.style.top);

	// Si la table/ZR inclus des elements de hauteur variable
	if (this.bGetHauteurLigneVariable())
	{
		// Et que :
		// La hauteur de la premiere ligne est connue
		// Ce n'est pas la hauteur par defaut
		var nHauteurLigne = this.__nGetHauteurLigne(this.m_nDebut);
		if ((nHauteurLigne != -1) && (nHauteurLigne != this.m_nHauteurLigne))
		{
			// Alors on calcul le deplacement original
			fPos = fPos * this.m_nHauteurLigne / nHauteurLigne;
		}
	}

	return parseInt(fPos);
};

// Position la zone de placement au pixel en tenant compte de la hauteur de la premiere ligne
WDTable.prototype.SetDivPosTop = function SetDivPosTop (nPosition)
{
	var fPos = nPosition;
	// Si la table/ZR inclus des elements de hauteur variable
	if (this.bGetHauteurLigneVariable())
	{
		// Et que :
		// La hauteur de la premiere ligne est connue
		// Ce n'est pas la hauteur par defaut
		var nHauteurLigne = this.__nGetHauteurLigne(this.m_nDebut);
		if (nHauteurLigne != -1)
		{
			if (nHauteurLigne != this.m_nHauteurLigne)
			{
				// Alors on calcul le deplacement original
				fPos = fPos * nHauteurLigne / this.m_nHauteurLigne;
			}
		}
		else
		{
			// La hauteur de la ligne est inconnue
			// Declenche le calcul et la MAJ differee
			this.nSetTimeoutUnique("CalculeHauteurLigne", 1, nPosition);
		}
	}

	this.m_oDivPos.style.top = fPos + "px";
};

WDTable.prototype._vnGetOffset = function _vnGetOffset(oLignePhysique)
{
	// Si on est pas en "quirks mode", il faut tenir compte des bordure du parent si on est dans un table (pas de bordure dans les ZRs)
	if (!bIEQuirks)
	{
		// On ne prend que la bordure du bas car les bordures sont fusionnees
		return this.__nGetOffset(oLignePhysique.borderBottomWidth);
	}
	return 0;
};

// Calcule la hauteur des lignes visibles
WDTable.prototype._CalculeHauteurLigne = function _CalculeHauteurLigne()
{
	// Pour toutes les lignes affichees
	var i;
	var nLimiteI = this.m_oEtatLignes.nGetNbEtatLignes();
	for (i = 0; i < nLimiteI; i++)
	{
		// Si la ligne est visible
		var oEtatLigne = this.m_oEtatLignes.oGetEtatLigne(i);
		if (oEtatLigne.bPlein(0))
		{
			// Recupere sa hauteur et la fixe
			var oLigneCache = oEtatLigne.oGetLigneLogique(0).m_oLigneCache;
			if (oLigneCache.nGetHauteur() == -1)
			{
				var nHauteurTotale = oEtatLigne.m_oLignePhysique.offsetHeight;

				// Si on est pas en "quirks mode", il faut tenir compte des bordure du parent si on est dans un table (pas de burdure dans les ZRs)
				nHauteurTotale += this._vnGetOffset(oEtatLigne.m_oLignePhysique);

				// Il faut aussi tenir compte de la hauteur des ruptures
				if (this.nGetNbRuptures() > 0)
				{
					// La rupture n'existe pas toujours (colonne autre que la premiere pour le haut)
					if (oEtatLigne.m_oRupturesHaut)
					{
						nHauteurTotale += oEtatLigne.m_oRupturesHaut.parentNode.offsetHeight;
					}
					if (oEtatLigne.m_oRupturesBas)
					{
						nHauteurTotale += oEtatLigne.m_oRupturesBas.parentNode.offsetHeight;
					}
				}

				// Fixe la hauteur
				oLigneCache.SetHauteur(nHauteurTotale);
			}
		}
	}
};


// Callback pour calculer la hauteur des lignes visibles
WDTable.prototype.CalculeHauteurLigne = function CalculeHauteurLigne(nPosition)
{
	this._CalculeHauteurLigne();
	// Reforce le positionnement de l'affichage
	this.SetDivPosTop(nPosition);
};

// Recupere la dernier hauteur de ligne
WDTable.prototype.nGetLastHauteurLigneMoyenne = function nGetLastHauteurLigneMoyenne()
{
	return this.m_nLastHauteurLigneMoyenne ? this.m_nLastHauteurLigneMoyenne : this.m_nHauteurLigne;
}

WDTable.prototype.nGetLastNbLignesLogiquesParLignePhysiqueMoyen = function nGetLastNbLignesLogiquesParLignePhysiqueMoyen()
{
	return this.m_nLastNbLignesLogiquesParLignePhysiqueMoyen ? this.m_nLastNbLignesLogiquesParLignePhysiqueMoyen : this.vnGetNbLignesLogiquesParLignePhysique();
};

// Calcule la hauteur moyenne des lignes affichees
WDTable.prototype.nGetHauteurLigneMoyenne = function nGetHauteurLigneMoyenne()
{
	if (this.bGetHauteurLigneVariable())
	{
		var nHauteurLigneTotale = 0;
		var nHauteurLigneNb = 0;
		var i;
		var nLimiteI = this.m_oEtatLignes.nGetNbEtatLignes();
		for (i = 0; i < nLimiteI; i++)
		{
			var oEtatLigne = this.m_oEtatLignes.oGetEtatLigne(i);
			if (oEtatLigne.oGetLigneLogique(0).m_oLigneCache)
			{
				var nHauteurLigne = oEtatLigne.oGetLigneLogique(0).m_oLigneCache.nGetHauteur();
				if (nHauteurLigne && nHauteurLigne > 0)
				{
					nHauteurLigneTotale += nHauteurLigne;
					nHauteurLigneNb++;
				}
			}
		}
		if (nHauteurLigneNb > 0)
		{
			// Quand on a des ruptures, la hauteur de ligne moyenne est inferieure...
			return Math.ceil(nHauteurLigneTotale / nHauteurLigneNb);
//			return Math.max(nHauteurLigneTotale / nHauteurLigneNb, this.m_nHauteurLigne);
		}
		else
		{
			// Si on a une ancienne hauteur de ligne moyenne, l'utilise pour que l'ascenseur ne joue pas au yoyo
			if (this.m_nLastHauteurLigneMoyenne && (this.m_nLastHauteurLigneMoyenne > 0))
			{
				return this.m_nLastHauteurLigneMoyenne;
			}
		}
	}
	// Autres cas (hauteur non variable ou valeur incalculable
	return this.m_nHauteurLigne;
};

// Calcule le nombre de ligne logique par ligne physique moyen
WDTable.prototype.nGetNbLignesLogiquesParLignePhysiqueMoyen = function nGetNbLignesLogiquesParLignePhysiqueMoyen()
{
	var nGetNbLignesLogiquesParLignePhysique = this.vnGetNbLignesLogiquesParLignePhysique();

	if (this.nGetNbRuptures() > 0)
	{
		var nLigneLogiqueTotale = 0;
		var nLignePhysique = 0;
		var i;
		var nLimiteI = this.m_oEtatLignes.nGetNbEtatLignes();
		for (i = 0; i < nLimiteI; i++)
		{
			var oEtatLigne = this.m_oEtatLignes.oGetEtatLigne(i);
			// Parcours les lignes logiques
			var j;
			var nLimiteJ = nGetNbLignesLogiquesParLignePhysique;
			for (j = 0; j < nLimiteJ; j++)
			{
				if (oEtatLigne.bPlein(j))
				{
					// Si c'est la premiere colonne compte la ligne
					if (j == 0)
					{
						nLignePhysique++;
					}
					// Compte la colonne
					nLigneLogiqueTotale++;
				}
			}
		}
		if (nLignePhysique > 0)
		{
			return Math.min(nLigneLogiqueTotale / nLignePhysique, nGetNbLignesLogiquesParLignePhysique);
		}
		else
		{
			return nGetNbLignesLogiquesParLignePhysique;
		}
	}
	else
	{
		// Si on n'a pas de rupture le calcul est simple
		return nGetNbLignesLogiquesParLignePhysique;
	}
};

// Met a jour la bare de defilement et les lignes visible a l'ecran pour les ruptures
WDTable.prototype.MAJAscenseurRuptures = function MAJAscenseurRuptures()
{
	// Calcule la hauteur des lignes
	this._CalculeHauteurLigne();

	// MAJ de l'ascenseur
	this.MAJAscenseur();
};

// Met a jour la bare de defilement et les lignes visible a l'ecran
WDTable.prototype.MAJAscenseur = function MAJAscenseur(bForceMAJ)
{
	// Redimensionne l'ascenseur si besoin
	this.RedimAscenseur();

	// Si on force alors on place la ligne au debut
	if (bForceMAJ)
	{
		this.SetDivPosTop(0);
	}

	// Force le zero deplacement au parent de la position au pixel
	this.m_oDivPos.parentNode.scrollTop = "0px";

//	// Decalage a cause du debordement en largeur
//	var nDecalageDebordement = this.m_bDebordeLargeur ? 18 : 0;

	// Calcule la hauteur moyenne des lignes affichees
	var nHauteurLigneMoyenne = this.nGetHauteurLigneMoyenne();

	// On calcule la nouvelle hauteur si besoin
	// Si on a plus d'une logique par ligne physique, il faut en tenir compte pour afficher entierement la derniere ligne
	var nNouvelleHauteur;
	var nNbLignesLogiquesParLignePhysiqueMoyen = this.nGetNbLignesLogiquesParLignePhysiqueMoyen();
	if (nNbLignesLogiquesParLignePhysiqueMoyen > 1)
	{
		nNouvelleHauteur = Math.floor(nHauteurLigneMoyenne * Math.ceil(this.m_nNbLignes / nNbLignesLogiquesParLignePhysiqueMoyen));
	}
	else
	{
		nNouvelleHauteur = Math.floor(nHauteurLigneMoyenne * this.m_nNbLignes);
	}
	// Si zero ligne ou probleme de nombre de lignes
	if (nNouvelleHauteur <= 0) nNouvelleHauteur = 1;
	// Si la nouvelle hauteur est trop importante pour le navigateur : on utilise un facteur d'echelle
	this.m_nFacteurAscenseur = Math.ceil(nNouvelleHauteur / this.m_nLimiteHauteur);
	if (this.m_nFacteurAscenseur > 1)
		nNouvelleHauteur = Math.floor(nNouvelleHauteur / this.m_nFacteurAscenseur);

	// On change la hauteur si besoin
	var sNouvelleHauteur = nNouvelleHauteur + "px";
	if ((this.m_oAscenseur.style.height != sNouvelleHauteur) || bForceMAJ)
	{
		// Calcule si on doit MAJ la position
		var nDivPosTop = this.nGetDivPosTop();
		if ((Math.floor(((this.m_oAscenseurParent.scrollTop * this.m_nFacteurAscenseur) - nDivPosTop) / nHauteurLigneMoyenne) != this.m_nDebut) || bForceMAJ)
		{
			// On ne tient plus compte du facteur de correction c'est integre dans SetAscenseurParentScrollTop
			// De meme que le fait de derterminer si la position change
			// Defini la position de la scroll bar en fonction du debut
			var fNouvellePosition = (this.m_nDebut / nNbLignesLogiquesParLignePhysiqueMoyen) * nHauteurLigneMoyenne + nDivPosTop;
			this.SetAscenseurParentScrollTop(fNouvellePosition);
		}
		this.m_oAscenseur.style.height = sNouvelleHauteur;
	}
	this.m_nLastHauteurLigneMoyenne = nHauteurLigneMoyenne;
	this.m_nLastNbLignesLogiquesParLignePhysiqueMoyen = nNbLignesLogiquesParLignePhysiqueMoyen;

	// Et met si besoin l'evenement sur le scrolling
	if (!this.m_oAscenseurParent.onscroll)
	{
		this.m_oAscenseurParent.onscroll = this.m_fScroll;
	}

	// Deplace eventuellement la table si besoin (En cas de fichier raccourci)
	if ((this.m_nDebut > 0) && (this.m_nNbLignes - this.m_nDebut < this.m_nNbLignesPage))
	{
		// Calcule le debut exact en tenant compte des lignes avec rupture en base
		var nDebut = this.m_nNbLignes - this.m_nNbLignesPage;
		if (nDebut < 0)
		{
			nDebut = 0;
			// Les hauteurs de lignes ont put deplacer l'ascenseur
			this.SetAscenseurParentScrollTop(0);
		}
		this.SetDebut(nDebut);

		// Deplace la table => Provoque un rappel a nous meme mais comme on s'est modifie pour ne plus verifier notre condition
		// Pas plus de un appel recursif
		this.DeplaceTable();
	}
};

// Calcule le nouveau debut logique de la page
WDTable.prototype.nGetDebutLogique = function nGetDebutLogique(nDebutPhysique)
{
	// Effectue le calcul avec une simple regle de trois
	// C'est la valeur resultat si on n'a pas de ruptures ou que le calcule echoue
	var nDebutLogique = nDebutPhysique * this.nGetLastNbLignesLogiquesParLignePhysiqueMoyen();

	// Si on a des ruptures, tente de calculer la vrai premiere ligne en fonction de la derniere premiere ligne connue
	if (this.nGetNbRuptures() > 0)
	{
		// Parcours les lignes logiques depuis le debut actuel tant que l'on n'est pas sur le debut de la ligne physique
		var nLigneAbsolue = this.m_nDebut;
		var oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
		if (oLigneCache)
		{
			var nSens = nDebutPhysique > oLigneCache.vnGetLigneHTML() ? 1 : -1;
			while ((nLigneAbsolue >= 0) && (nLigneAbsolue < this.m_nNbLignes))
			{
				if (!oLigneCache)
				{
					// On n'a pas la ligne, prend la ligne calculee
					break;
				}
				// Si on est sur la bonne ligne
				if ((oLigneCache.vnGetLigneHTML() == nDebutPhysique) && (oLigneCache.vnGetColonneHTML() == 0))
				{
					// Memorise le resultat
					nDebutLogique = nLigneAbsolue;
					break;
				}
				// On n'est pas sur la bonne ligne
				// Continue la recherche
				nLigneAbsolue += nSens;

				// Recupere la ligne suivante
				oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
			}
		}
	}

	return nDebutLogique;
};

// Deplacement de la table
WDTable.prototype.DeplaceTable = function(oEvent)
{
	// Finie la saisie si besoin
	if (this.m_oGestionSaisie.m_bSaisie)
	{
		this.m_oGestionSaisie.SaisieFin(true, false);
	}

	// Force le zero deplacement au parent de la position au pixel
	this.m_oDivPos.parentNode.scrollTop = "0px";

	// Defini la position du debut en fonction de la Ascenseur
	var nNouveauDebutPhysique = Math.floor(this.nGetAscenseurParentScrollTop() / this.nGetLastHauteurLigneMoyenne());

	// Calcule le nouveau debut logique de la page

	// Recupere le debut en ligne logique et pas en ligne physique
	var nNouveauDebutLogique = this.nGetDebutLogique(nNouveauDebutPhysique);

	// Si on n'a pas bouger : fini
	if (nNouveauDebutLogique == this.m_nDebut)
	{
		// Deplace au pixel le div de la table
		this.SetDivPosTop(Math.floor((nNouveauDebutPhysique * this.nGetLastHauteurLigneMoyenne()) - this.nGetAscenseurParentScrollTop()));

		return;
	}

	// Si la ligne selectionnee est DANS la zone deplacee, on la notifie
	if ((this.m_tabSelection.length > 0) && (this.m_tabSelection[0] != -1))
	{
		this._vMasqueLigneInterne(this.nPosAbsolue2PosVisible(this.m_tabSelection[0]), true, oEvent);
	}

	// Sinon defini de debut
	this.SetDebut(nNouveauDebutLogique);

//	// Met a jour la Ascenseur
//	this.MAJAscenseur();

	// Invalide les lignes et les reaffiche si elles sont disponible
	var bLignesInvalides = false;
	var bAfficheMasque = false;
	var i;
	var nLimiteI = this.m_oEtatLignes.nGetNbEtatLignes();
	var nLimiteJ = this.vnGetNbLignesLogiquesParLignePhysique();
	var nLigneAbsolue = this.m_nDebut;
	var oLigneCache;
	for (i = 0; i < nLimiteI; i++)
	{
		// Recupere la ligne
		var oEtatLigne = this.m_oEtatLignes.oGetEtatLigne(i);

		// Parcours les lignes logiques
		// Sur la premiere cellule il y a forcement du contenu
		var j;
		for (j = 0; j < nLimiteJ; j++, nLigneAbsolue++)
		{
			if (nLigneAbsolue >= this.m_nNbLignes)
				break;
			// Affiche la ligne
			var oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
			if (oLigneCache)
			{
				// Si on change de ligne (rupture)
				if (oLigneCache.vnGetColonneHTML() != j)
				{
					for (; j < nLimiteJ; j++)
					{
//						oEtatLigne.AfficheLigne(j, null, this, nLigneAbsolue, oEvent);
						oEtatLigne.MasqueLigne(j, this, nLigneAbsolue, oEvent);
					}
					break;
				}
			}
			oEtatLigne.bMAJ(j, oLigneCache, this, nLigneAbsolue, oEvent);
			var bPlein = oEtatLigne.bPlein(j);
			// Et si on a pas la ligne on le note pour redemander les valeurs
			if ((!bPlein) && !oLigneCache && (nLigneAbsolue < this.m_nNbLignes))
			{
				// Affiche le masque
				bAfficheMasque = true;
			}
		}
		if (nLigneAbsolue >= this.m_nNbLignes)
		{
			break;
		}
	}
	// Masque les lignes restantes dans le cas (rare) ou l'ascenseur est faux (grandes variations locale de la hauteur des lignes)
	this.m_oEtatLignes.Invalide(this, -1, i + 1, true, oEvent);

	// Affiche le masque si besoin
	this.AfficheMasque(bAfficheMasque, false);

	// Vide le cache invalide
	this.m_oCache.SupprimeLignesInutiles();

	// Annule un precedent setTimeout si besoin
	this.AnnuleTimeXXX("RemplitCacheDiff", false);

	// Si le cache est vide => C'est que l'on a un gros deplacement
	// => Effectue une requete differe pour ne pas en faire 50
	if (this.m_oCache.m_nDebutCache == -1)
	{
		// Remplit les variables
		this.m_bRequeteDiffereeForce = bLignesInvalides;

		// Et lance la requete en differe (300ms)
		this.nSetTimeoutUnique("RemplitCacheDiff", 300);
	}
	else
	{
		// Si besoin demande du cache
		this.m_oCache.RemplitCache(this.m_nDebut, bLignesInvalides, -1, this.m_bSensTri);
	}

	// Et met a jour l'affichage
	this.MAJLignes(oEvent);

	// Code deplace APRES l'appel de SetDebut et le remplissage des lignes pour avoir lenouveau debut et les lignes affichees
	// Deplace au pixel le div de la table
	this.SetDivPosTop(Math.floor((nNouveauDebutPhysique * this.nGetLastHauteurLigneMoyenne()) - this.nGetAscenseurParentScrollTop()));
};

// Fonction de requete differee
WDTable.prototype.RemplitCacheDiff = function()
{
	// Demande du cache
	this.m_oCache.RemplitCache(this.m_nDebut, this.m_bRequeteDiffereeForce);
	delete this.m_bRequeteDiffereeForce;
};

// Gestion du redimensionnement d'une colonne
// On recoit cette evenement lors du click
WDTable.prototype.OnRedimCol = function(oEvent, nColonne, nTailleMinimale)
{
	// Appel notre gestionnaire de redimensionnement
	this.m_oRedimColonnes.OnMouseDown(oEvent, nColonne, nTailleMinimale);
};

// Lien sur une colonne lien
WDTable.prototype.OnColonneLien = function(nLigneAbsolue, nColonne, oEvent)
{
	// Pour l'instant : rebondi sur la selection simple de ligne
	this.OnSelectLigne(nLigneAbsolue - this.m_nDebut, nColonne, oEvent, true);
};

// Met a jour les pictos de tri de la table (maintenant que l'on a recu la liste des colonnes
WDTable.prototype.vAffichePictoTriColonnes = function()
{
	// Parcours toutes les colonnes
	var tabColonnes = this.m_tabColonnes;
	var i;
	var nLimiteI = tabColonnes.length;
	for (i = 0; i < nLimiteI; i++)
	{
		// Affiche le picto de tri
		var oImage = this.oGetIDElement(this.ID_TITRE, this.ID_TRI, i);
		if (oImage)
		{
			SetDisplay(oImage, tabColonnes[i].m_bTri);
		}
		// Et le picto de recherche
		var oImage = this.oGetIDElement(this.ID_TITRE, this.ID_RECHERCHE, i);
		if (oImage)
		{
			SetDisplay(oImage, tabColonnes[i].m_bRecherche);
		}
	}
};

// Actualise l'affichage du tri de colonne
WDTable.prototype.AfficheTriColonne = function(nColonne, bInverse)
{
	var oTmp = this;
	// Vire le flag de tri de la colonne trie
	if (this.m_nColonneTrie != -1)
	{
		var oAncienneImage = this.oGetIDElement(this.ID_TITRE, this.ID_TRI, this.m_nColonneTrie);
		if (oAncienneImage)
		{
			oAncienneImage.src = this.m_tabImgTri[0];
			// Et restaure la fonction de click
			var nOldColonneTrie = this.m_nColonneTrie;
			if (bIE)
			{
				oAncienneImage.onclick = function() { oTmp.OnTriColonne(nOldColonneTrie, 0, event); };
			}
			else
			{
				oAncienneImage.onclick = function(oEvent) { oTmp.OnTriColonne(nOldColonneTrie, 0, oEvent); };
			}
		}
	}

	// Memorise notre colonne comme trie
	this.m_nColonneTrie = nColonne;
	this.m_bSensTri = !bInverse;

	// Affiche l'image
	var oImage = this.oGetIDElement(this.ID_TITRE, this.ID_TRI, this.m_nColonneTrie);
	if (oImage)
	{
		oImage.src = bInverse ? this.m_tabImgTri[2] : this.m_tabImgTri[1];
		// Et modifie la fonction de click
		if (bIE)
		{
			oImage.onclick = bInverse ? function() { oTmp.OnTriColonne(nColonne, 0, event); } : function() { oTmp.OnTriColonne(nColonne, 1, event); }
		}
		else
		{
			oImage.onclick = bInverse ? function(oEvent) { oTmp.OnTriColonne(nColonne, 0, oEvent); } : function(oEvent) { oTmp.OnTriColonne(nColonne, 1, oEvent); }
		}
	}
};

// Force le defilement de la ZR
// Renvoi le deplacement reel
WDTable.prototype.nForceDefilement = function(nDeplacement, oEvent)
{
	// Si pas de possibilite de defilement : fini
	if (parseInt(this.m_oAscenseur.style.height) <= this.m_oAscenseurParent.clientHeight)
		return 0;

	var noAnciennePosition = this.m_oAscenseurParent.scrollTop;
	// Deplace l'ascenseur
	if (this.m_oAscenseurParent.scrollTop + nDeplacement < 0)
		this.m_oAscenseurParent.scrollTop = 0;
	else if (this.m_oAscenseurParent.scrollTop + nDeplacement > parseInt(this.m_oAscenseur.style.height) - this.m_oAscenseurParent.clientHeight)
		this.m_oAscenseurParent.scrollTop = parseInt(this.m_oAscenseur.style.height) - this.m_oAscenseurParent.clientHeight;
	else
		this.m_oAscenseurParent.scrollTop += nDeplacement;
	this.DeplaceTable(oEvent);

	// Renvoie le deplacement reel
	return (this.m_oAscenseurParent.scrollTop - noAnciennePosition);
};

// Click sur une ligne
WDTable.prototype.OnSelectLigne = function(nLigneRelative, nColonne, oEvent, bColonneLien)
{
	// Si on est sans selection => Sort direct
	if (this.m_nTypeSelection == WDTable.prototype.SELECTION_SANS) return;
	// Si on a une requete en cours : la modification de la selection va etre ecrase donc on l'interdit
	if (this.m_oCache.m_tabRequetes.length > 0) return;

	var bCtrl = (oEvent && !bColonneLien) ? oEvent.ctrlKey : false;
	var bMaj = (oEvent && !bColonneLien) ? oEvent.shiftKey : false;

	var nLigneAbsolue = this.nRelative2Absolue(nLigneRelative);
	// Si on a changer la selection
	var bChangementSelection = false;

	// Selection simple ?
	var bSelectionSimple = (this.m_nTypeSelection == WDTable.prototype.SELECTION_SIMPLE) || bColonneLien;

	// Si on est en selection simple ou que ctrl et shift ne sont pas enfonce (Selection multiple): supprime les autres selections
	// Sauf la ligne en cours de selection car elle doit rester selectionnee
	if (bSelectionSimple || ((bCtrl == false) && (bMaj == false)))
	{
		bChangementSelection = this.bLigneDeselectionneTous(nLigneAbsolue, oEvent);
	}

	// Regarde si la ligne est selectionne
	nIndiceTableauSelectionActuelle = this.nLigneSelectionne(nLigneAbsolue, oEvent);

	// Decide si on va deselectionne la ligne si elle est selectionne
	if (nIndiceTableauSelectionActuelle != -1)
	{
		// bCtrl est a faux si la colonne est lien donc c'est OK
		if ((bSelectionSimple || (this.m_nTypeSelection == WDTable.prototype.SELECTION_MULTIPLE)) && bCtrl)
		{
			// Deselectionne la ligne
			bChangementSelection = this.bLigneDeselectionne(nIndiceTableauSelectionActuelle, oEvent);
		}
		// Sinon ne fait rien : on laisse la ligne selectionnee
	}
	else
	{
		// Dans le cas de la selection multiple on traite les touches shift et cltrl
		// Ctrl => Rien a faire on ajoute simplement a la selection
		// Shfit => On ajoute tout entre la premiere selectionne si elle existe et la nouvelle
		if (!bSelectionSimple && (bMaj == true))
		{
			if (this.m_tabSelection.length > 0)
			{
				var i = this.nPosAbsolue2PosVisible(this.m_tabSelection[0]);
				var nSens = (i < nLigneAbsolue) ? 1 : -1;
				for (i += nSens; i != nLigneAbsolue; i += nSens)
				{
					// Selectionne les lignes si besoin
					bChangementSelection |= this.bLigneSelectionne(i, true, oEvent);
				}
			}
		}

		// Selectionne la ligne
		bChangementSelection |= this.bLigneSelectionne(nLigneAbsolue, true, oEvent);
	}

	// Gere une eventuelle entree en saisie dans la ligne
	this.m_oGestionSaisie.OnClickCellule(nLigneRelative, nColonne);

	// Envoie une requete au serveur demandant le refraichissement de la ligne donnee si il y a eu une nouvelle selection
	if ((bChangementSelection || bColonneLien) && (this.m_bRetourServeurSelection))
		this.RequeteSelection(bColonneLien ? nColonne : -1);
};

// Gestionnaire du tri des colonnes
WDTable.prototype.OnTriColonne = function(nColonne, bInverse, oEvent)
{
	// Affiche le picto dans la colonne de tri
	this.AfficheTriColonne(nColonne, bInverse);

	// Lance une requete pour le tri en bloquant l'affichage
	this.m_oCache.RemplitCache(this.m_nDebut, false, nColonne, this.m_bSensTri);
	// Marque toutes les lignes comme invalide
	this.m_oEtatLignes.Invalide(this, this.m_nDebut, 0, false, oEvent);
	// Et affiche le masque qui empeche la saisie
	this.AfficheMasque(true, false);
};

// Deplacement de la souris au dessus d'une image de recherche
WDTable.prototype.OnRechercheSouris = function(nColonne, oImg, bSourisOver)
{
	// Si on est sur la colonne en cours de recherche on laisse l'image qui va bien
	if (nColonne == this.m_nColonneRecherche)
	{
		return true;
	}

	oImg.src = this.m_tabImgRecherche[bSourisOver ? 1 : 0];
	return true;
};

WDTable.prototype.OnRechercheColonne = function(nColonneRecherche, oImgOrigine)
{
	// Supprime l'ancinne recherche si besoin (Arrive dans des combinaisons d'evenements bizarres)
	this.OnAnnuleRechercheColonne();

	// Objet qui servira pour placer le formulaire
	var oParent = oImgOrigine.parentNode;

	// Cree dynamiquement la zone de recherche
	var oFormRecherche = document.createElement("FORM");
	// Avec son action
	oFormRecherche.method = "POST";
	oFormRecherche.action = "javascript:return false;";
	// Et la methode de validation qui renvoie toujours faux pour ne pas valider le formulaire
	var oTmp = this;
	// Attention ! Dans les fonctions, this designe le formulaire et pas l'objet externe courant
	if (bIE)
		oFormRecherche.onsubmit = function() { oTmp.OnValideRechercheColonne(this.elements[0].value, event); return bStopPropagation(event); };
	else
		oFormRecherche.onsubmit = function(event) { oTmp.OnValideRechercheColonne(this.elements[0].value, event); return bStopPropagation(event); };
	// Puis on place le formulaire au bon endroit
	oFormRecherche.style.position = "absolute";
	oFormRecherche.style.top = "0px";
	oFormRecherche.style.left = "0px";
	oFormRecherche.style.width = (oParent.offsetWidth - oImgOrigine.offsetWidth - 1) + "px";
	oFormRecherche.style.height = "100%";

	// Ensuite on fait le champs de saisie
	var oSaisieRecherche = document.createElement("INPUT");
	oSaisieRecherche.type = "TEXT";
	// On l'attache a son parent
	oFormRecherche.appendChild(oSaisieRecherche);
	// Et gere la perte du focus
	if (bIE)
		oSaisieRecherche.onblur = function() { oTmp.OnAnnuleRechercheColonne(); return bStopPropagation(event); };
	else
		oSaisieRecherche.onblur = function(event) { oTmp.OnAnnuleRechercheColonne(); return bStopPropagation(event); };
	// Et lui defini son style
	oSaisieRecherche.style.position = "absolute";
	oSaisieRecherche.style.top = "0px";
	oSaisieRecherche.style.left = "0px";
	oSaisieRecherche.style.width = "100%";
	oSaisieRecherche.style.height = "100%";
	oSaisieRecherche.style.borderWidth = "0";
	oSaisieRecherche.style.borderStyle = "solid";
	// Si la hauteur du parent est faible : reduit la taille de la police
	if ((oParent.offsetHeight <= 18) && (oParent.offsetHeight > 0))
	{
		oSaisieRecherche.style.fontSize = Math.max(oParent.offsetHeight - 4, 6) + "px";
	}

	// On met le tout dans la cellule de recherche
	this.m_oFormRecherche = oParent.appendChild(oFormRecherche);

	// On affiche l'image de recherche
	oImgOrigine.src = this.m_tabImgRecherche[2];

	// Et donne le focus au champ de saisie
	this.m_oFormRecherche.elements[0].focus();

	// Colonne de recherche
	this.m_nColonneRecherche = nColonneRecherche;
	this.m_oImgOrigine = oImgOrigine;
	// On supprime la gestion de la perte du survol pour ne pas remettre la mauvaise image
	this.m_fOnMouseDown = oImgOrigine.onmousedown;

	var oTmp2 = this.m_oFormRecherche;
	if (bIE)
		oImgOrigine.onmousedown = function() { oTmp.OnValideRechercheColonne(oTmp2.elements[0].value, event); return bStopPropagation(event); };
	else
		oImgOrigine.onmousedown = function(event) { oTmp.OnValideRechercheColonne(oTmp2.elements[0].value, event); return bStopPropagation(event); };
};

// Valide la recherche et l'effectue
WDTable.prototype.OnValideRechercheColonne = function(sValeurRecherche, oEvent)
{
	// Seulement si on a une recherche et que la valeur recherchee est non vide)
	if ((this.m_oFormRecherche) && (sValeurRecherche.length > 0))
	{
		this.m_oCache.CreeRequeteRecherche(this.m_nColonneRecherche, sValeurRecherche);

		// Marque toutes les lignes comme invalide
		this.m_oEtatLignes.Invalide(this, this.m_nDebut, 0, false, oEvent);
		// Et affiche le masque qui empeche la saisie
		this.AfficheMasque(true, true);
	}

	// Supprime le HTML de la recherche
	this.OnAnnuleRechercheColonne();
};

// Annule la recherche dans une colonne
WDTable.prototype.OnAnnuleRechercheColonne = function()
{
	// Seulement si on a deja une recherche en cours : on la supprime
	if (this.m_oFormRecherche)
	{
		// Supprime le onblur de l'element de saisie pour eviter que le navigateur (IE) ne s'emelle les pinceau si on creer un nouvek objet
		this.m_oFormRecherche.elements[0].onblur = null;

		// Detache et supprime le formulaire du document
		this.m_oFormRecherche = this.m_oFormRecherche.parentNode.removeChild(this.m_oFormRecherche);
	}

	// Restaure l'etat de l'image
	if (this.m_oImgOrigine)
	{
		// L'image originale
		this.m_oImgOrigine.src = this.m_tabImgRecherche[0];
		// Et de click
		if (this.m_fOnMouseDown) { this.m_oImgOrigine.onmousedown = this.m_fOnMouseDown; }
	}

	// Supprime nos membres
	delete this.m_nColonneRecherche;
	delete this.m_oFormRecherche;
	delete this.m_oImgOrigine;
	delete this.m_fOnMouseDown;
};

// Indique le nombre de colonne
WDTable.prototype.nNbColonnes = function()
{
	return this.m_tabColonnes.length;
};

// Indique si la colonne donnee est saisisable
WDTable.prototype.bColonneSaisissable = function(nColonne)
{
	// Si la colonne n'est pas dans le tableau => Pas saisissable
	if ((nColonne >= this.m_tabColonnes.length) || (nColonne < 0))
	{
		return false;
	}

	// Si la colonne est lien elle n'est pas saisissable
	if (this.m_tabColonnes[nColonne].m_nLien != "0") return false;

	// Sinon on renvoie la valeur dans le tableau
	return this.m_tabColonnes[nColonne].m_bSaisissable;
};

// Indique si la colonne donnee est lien
WDTable.prototype.nColonneLien = function(nColonne)
{
	// Si la colonne n'est pas dans le tableau => Pas saisissable
	if ((nColonne >= this.m_tabColonnes.length) || (nColonne < 0))
	{
		return WDColonne.prototype.m_nLien;
	}

	// Sinon on renvoie la valeur dans le tableau
	return this.m_tabColonnes[nColonne].m_nLien;
};

// Indique l'etat de la colonne donnee lien
WDTable.prototype.nColonneEtatLien = function(nColonne)
{
	// Si la colonne n'est pas dans le tableau => Pas saisissable
	if ((nColonne >= this.m_tabColonnes.length) || (nColonne < 0))
	{
		return WDColonne.prototype.m_nEtatLien;
	}

	// Sinon on renvoie la valeur dans le tableau
	return this.m_tabColonnes[nColonne].m_nEtatLien;
};

// Indique le type de la colonne
WDTable.prototype.nColonneType = function(nColonne)
{
//	// Si la colonne n'est pas dans le tableau => colonne normale
//	if ((nColonne >= this.m_tabColonnes.length) || (nColonne < 0))
//	{
//		return WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE;
//	}

	// Sinon on renvoie la valeur dans le tableau
	return this.m_tabColonnes[nColonne].m_nType;
};

// Renvoie le tableau des options d'une colonne COMBO
WDTable.prototype.tabColonneCombo = function(nColonne)
{
	// Si la colonne n'est pas dans le tableau => tableau vide
	if ((nColonne >= this.m_tabColonnes.length) || (nColonne < 0))
	{
		return WDColonne.prototype.m_tabOptions;
	}

	// Sinon on renvoie la valeur dans le tableau
	return this.m_tabColonnes[nColonne].m_tabOptions;
};

// Renvoie le tableaux des options d'une cellule combo
WDTable.prototype.tabContenuCellule = function(nLigneRelative, nColonne)
{
	// Regarde si la cellule a une contenu personnalise
	var tabOptions = this.m_oCache.tabContenuCellule(this.nRelative2Absolue(nLigneRelative), nColonne);
	// Si non, retourne le contenu normal de la combo
	return tabOptions ? tabOptions : this.tabColonneCombo(nColonne);
};

// Indique que l'on a change la valeur de la colonne donnee
WDTable.prototype.ChangementValeur = function(nLigneRelative, nColonne, sValeur, nValeur)
{
	// Par securite si la colonne n'est pas saisissable => Fini (Normalement cela n'arrive pas
	if (this.bColonneSaisissable(nColonne) == false) return;

	// On met la valeur dans le cache et on le marque comme modifie
	this.m_oCache.ChangementValeur(this.nRelative2Absolue(nLigneRelative), nLigneRelative, nColonne, sValeur, nValeur);
};

// Action avant la MAJ d'une ligne
WDTable.prototype.vPreMAJLigne = function vPreMAJLigne(nLigneAbsolue, oEvent)
{
	// Rien
};

// Action apres la MAJ d'une ligne
WDTable.prototype.vPostMAJLigne = function vPostMAJLigne(nLigneAbsolue, oEvent)
{
	// Rien
};

WDTable.prototype.nGetLigneHTMLDebut = function nGetLigneHTMLDebut()
{
	return this.m_oCache.oGetLigne(this.m_nDebut).vnGetLigneHTML(this.m_nDebut);
};

// Recupere la ligne d'etat d'une ligne absolue donnee
WDTable.prototype.oGetEtatLigne = function oGetEtatLigne(nLigneAbsolue)
{
	return null;
};

// Note que la ligne devra etre MAJ si elle est visible
WDTable.prototype.NoteMAJLigne = function NoteMAJLigne(nLigneAbsolue)
{
	// Si la ligne est visible : lui change son style
	if (((this.m_nNbLignesPage == 0) && (nLigneAbsolue < this.m_nNbLignes)) || ((this.m_nNbLignesPage != 0) && (nLigneAbsolue >= this.m_nDebut) && (nLigneAbsolue <= this.m_nDebut + this.m_nNbLignesPage + 1)))
	{
		// Trouve la ligne physique de la ligne
		var oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
		if (oLigneCache)
		{
			this.m_oEtatLignes.oGetEtatLigne(oLigneCache.vnGetLigneHTML(nLigneAbsolue) - this.nGetLigneHTMLDebut()).Detache(oLigneCache.vnGetColonneHTML());
		}
	}
};

// Demande la MAJ de la ligne absolue
WDTable.prototype.MAJLigne = function MAJLigne(nLigneAbsolue, oEvent)
{
	// Trouve la ligne physique de la ligne
	var oLigneCache = this.m_oCache.oGetLigne(nLigneAbsolue);
	if (oLigneCache)
	{
		this.m_oEtatLignes.oGetEtatLigne(oLigneCache.vnGetLigneHTML(nLigneAbsolue) - this.nGetLigneHTMLDebut()).bMAJ(oLigneCache.vnGetColonneHTML(), oLigneCache, this, nLigneAbsolue, oEvent)
		
		// Si la fonction existe dans la page : effectue les operations apres submit AJAX
		if (window.FinSubmitAJAX && (typeof FinSubmitAJAX == "function"))
		{
			FinSubmitAJAX();
		}
	}
};

// Convertit les coordonees visible <=> absolue
WDTable.prototype.nPosAbsolue2PosVisible = function nPosAbsolue2PosVisible(nLignePosAbsolue)
{
	// Effectue la recherche dans le cache
	if (nLignePosAbsolue != -1)
	{
		return this.m_oCache.nPosAbsolue2PosVisible(nLignePosAbsolue);
	}
	else
	{
		return -1;
	}
},
WDTable.prototype.nPosVisible2PosAbsolue = function nPosVisible2PosAbsolue(nLignePosVisible)
{
	// Recupere la ligne absolue de la ligne du cache
	if (nLignePosVisible != -1)
	{
		return this.m_oCache.nPosVisible2PosAbsolue(nLignePosVisible);
	}
	else
	{
		return -1;
	}
},

// Et notifie le serveur de la validation d'une ligne
WDTable.prototype.ValideChangement = function(nLigneRelative)
{
	this.m_oCache.ValideChangement(this.nRelative2Absolue(nLigneRelative));
};

// Supprime les lignes virtuelles
WDTable.prototype.SupprimeLignesVirtuelles = function()
{
	this.m_oCache.SupprimeLignesVirtuelles();
};

// Cree la ligne virtuelle si besoin
WDTable.prototype.CreeLigneVirtuelle = function(nLigneRelative)
{
	this.m_oCache.CreeLigneVirtuelle(this.nRelative2Absolue(nLigneRelative));
};

// Recupere le contenu d'une cellule
WDTable.prototype.sGetCellule = function(nLigneRelative, nColonne, bPourEntier)
{
	return this.m_oCache.sGetCellule(this.nRelative2Absolue(nLigneRelative), nColonne, bPourEntier);
};


// Objet pour la gestion de la saisie
function WDSaisieCellule (oChampTable)
{
	this.m_oChampTable = oChampTable;	// Sauve l'objet attache
};

WDSaisieCellule.prototype =
{
	m_nLigneRelative: -1,	// Pas de ligne
	m_nColonne: -1,			// Pas de colonne
//	m_oDateClick:			null,		// Et pas de date
//	m_bSaisie:				false,		// Pas de saisie en cours
//	m_oFormSaisie			null,		// Pas de formulaire de saisie pour le moment
	m_nDiffClick: 1000,		// Au mimimun un double click en 1 seconde

	// Gestion du click sur une cellule
	OnClickCellule: function(nLigneRelative, nColonne)
	{
		// Si la colonne est une colonne interrupteur => Ne fait rien. L'interrupteur se gere tout seul
		var nType = this.m_oChampTable.nColonneType(nColonne)
		if ((nType == WDAJAXMain.prototype.XML_CHAMP_TYPE_INTERRUPTEUR) || (nType == WDAJAXMain.prototype.XML_CHAMP_TYPE_IMAGE))
		{
			// Si on est en saisie : fini la saisie
			if (this.m_bSaisie)
			{
				this.SaisieFin(true, false);
			}
			return;
		}

		// Si on est sur la meme ligne
		if (this.m_nLigneRelative == nLigneRelative)
		{
			// Si on est sur la meme cellule
			if (this.m_nColonne == nColonne)
			{
				// Si on est deja en saisie : ignore l'evenement : c'est que l'utilisateur a clicke dans la boite de saisie
				if (this.m_bSaisie) return;

				// Si la difference de date est assez courte : commence la saisie
				if ((new Date()).getTime() - this.m_oDateClick.getTime() < this.m_nDiffClick)
				{
					// Valide et commence la saisie
					this.SaisieCommence();
					return;
				}

				// Sinon met simplement a jour comme pour les autres cas
			}
			else
			{
				// Si on est en saisie : fini la saisie et change de case
				if (this.m_bSaisie)
				{
					this.SaisieFin(true, true, nColonne);
					return;
				}
			}
		}

		// Si on est en saisie : fini la saisie
		if (this.m_bSaisie)
		{
			this.SaisieFin(true, false);
		}

		// On supprime la precedente interception du double clic
		var oCellulePrecedente = this.m_oChampTable.oGetIDCelluleRel(this.m_nLigneRelative, this.m_nColonne);
		if (oCellulePrecedente)
		{
			oCellulePrecedente.ondblclick = null;
		}

		// Met a jour pour l'edition suivante
		this.m_nLigneRelative = nLigneRelative;
		this.m_nColonne = nColonne;
		this.m_oDateClick = new Date();

		// On intercepte le double clic qui lance directement la saisie si besoin
		var oTmp = this;
		this.m_oChampTable.oGetIDCelluleRel(this.m_nLigneRelative, this.m_nColonne).ondblclick = function() { if (oTmp.m_bSaisie) return; oTmp.SaisieCommence(); };
	},

	// Valide et commence la saisie
	SaisieCommence: function()
	{
		// Entre en saisie
		// Objet qui servira pour placer le formulaire
		var oParent = this.m_oChampTable.oGetIDCelluleRel(this.m_nLigneRelative, this.m_nColonne);

		// Fin de l'intercepte du double clic
		oParent.ondblclick = null;

		// Verifie que la colonne est saisisable
		if (!this.m_oChampTable.bColonneSaisissable(this.m_nColonne))
		{
			// Supprime nos membres
			this.m_nLigneRelative = -1;
			this.m_nColonne = -1;
			delete this.m_oDateClick;
			delete this.m_bSaisie;

			// Et sort direct
			return;
		}

		// Cree la ligne virtuelle si besoin
		this.m_oChampTable.CreeLigneVirtuelle(this.m_nLigneRelative);

		// Cree dynamiquement la zone de recherche
		var oFormSaisie = document.createElement("FORM");
		// Avec son action
		oFormSaisie.method = "POST";
		oFormSaisie.action = "javascript:return false;";
		// Et la methode de validation qui renvoie toujours faux pour ne pas valider le formulaire
		var oTmp = this;
		if (bIE)
		{
			// Prend une copie de l'evenement car on peu avoir deux operation imbrique (et window.event change alors)
			oFormSaisie.onsubmit = function() { var oEvent = event; oTmp.SaisieFin(true, true, -1); return bStopPropagation(oEvent); };
		}
		else
			oFormSaisie.onsubmit = function(event) { oTmp.SaisieFin(true, true, -1); return bStopPropagation(event); };

		// Si la hauteur des lignes est variable, on prend la hauteur effective de la ligne
		var nHauteurLigne = -1;
		if (this.m_oChampTable.bGetHauteurLigneVariable())
		{
			// Retourne -1 si la hauteur de la ligne est inconnue
			nHauteurLigne = this.m_oChampTable.nGetHauteurLigneRel(this.m_nLigneRelative);
		}
		nHauteurLigne = Math.max(nHauteurLigne, this.m_oChampTable.m_nHauteurLigne);

		// Puis on place le formulaire au bon endroit
//		oFormSaisie.style.position = "absolute";
//		oFormSaisie.style.top = "0px";
//		oFormSaisie.style.left = "0px";
		oFormSaisie.style.width = "100%";
//		oFormSaisie.style.height = "100%";
		oFormSaisie.style.height = (nHauteurLigne - 4) + "px";

		// Ensuite on fait le champs de saisie
		var oSaisie;
		// Regarde si la colonne est d'un type acceptable
		var nType = this.m_oChampTable.nColonneType(this.m_nColonne);
		switch (nType)
		{
			// Combo
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_COMBO:
				var nValeurCombo = this.m_oChampTable.sGetCellule(this.m_nLigneRelative, this.m_nColonne, true);

				oSaisie = document.createElement("SELECT");
				// Ajoute les options
				var tabOptions = this.m_oChampTable.tabContenuCellule(this.m_nLigneRelative, this.m_nColonne)
				var i;
				var nLimiteI = tabOptions.length;
				for (i = 0; i < nLimiteI; i++)
				{
					oSaisie.options[i] = new Option(tabOptions[i], i);
					if (nValeurCombo == i)
						oSaisie.options[i].selected = true;
					// Il y a un problemes avec les carteres > 127
					oSaisie.options[i].innerHTML = clWDEncode.sEncodeInnerHTML(oSaisie.options[i].innerHTML, false, true);
				}
				// Donne un ID au champ de saisie
				oSaisie.id = oParent.id + "_SAI";
				break;

			// Interrupteur
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_INTERRUPTEUR:
				break;

			// Image => Pas saissisable
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_IMAGE:
				break;

			// Saisie et autres
			case WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE:
			default:
				var sValeurCellule = this.m_oChampTable.sGetCellule(this.m_nLigneRelative, this.m_nColonne);
				// Si le contenu de la cellule contient des RC
				if ((-1 != sValeurCellule.indexOf("\r")) || (-1 != sValeurCellule.indexOf("\n")))
				{
					oSaisie = document.createElement("TEXTAREA");
				}
				else
				{
					oSaisie = document.createElement("INPUT");
					oSaisie.type = "TEXT";
				}
				// On n'oublie pas la valeur
				oSaisie.value = clWDEncode.sEncodeCharset(sValeurCellule, false);
				// Donne un ID au champ de saisie
				oSaisie.id = oParent.id + "_SAI";
				break;
		}

		// Et gere la perte du focus et la touche echap
		if (bIE)
		{
			oSaisie.onblur = function() { var oEvent = event; oTmp.SaisieFin(true, false); return bStopPropagation(oEvent); };
			oSaisie.onkeydown = function()
			{
				var oEvent = event;
				switch (oEvent.keyCode)
				{
					case 9:		// Tab
						oTmp.SaisieFin(true, true, -1);
						break;
					case 27:	// Escape
						oTmp.SaisieFin(false);
						break;
					default:
						return;
				}
				return bStopPropagation(oEvent);
			};
		}
		else
		{
			oSaisie.onblur = function(event) { oTmp.SaisieFin(true, false); return bStopPropagation(event); };
			oSaisie.onkeydown = function(event)
			{
				switch (event.keyCode)
				{
					case 9:		// Tab
						oTmp.SaisieFin(true, true, -1);
						break;
					case 27:	// Escape
						oTmp.SaisieFin(false);
						break;
					default:
						return;
				}
				return bStopPropagation(event);
			};
		}
		if (nType == WDAJAXMain.prototype.XML_CHAMP_TYPE_COMBO)
			oSaisie.onchange = oSaisie.onblur;
		// Et lui defini son style
//		oSaisie.style.position = "absolute";
//		oSaisie.style.top = "0px";
//		oSaisie.style.left = "0px";
		oSaisie.style.width = "100%";
//		oSaisie.style.height = "100%";
		// Si on n'est pas en hauteur de ligne variable
		// Si la hauteur de la ligne est inconnue (nGetHauteurLigne retourne -1)
		// SI la hauteur est invalide
		oSaisie.style.height = (nHauteurLigne - 4) + "px";

//		// Ainsi que la couleur pour faire joli
//		// Recupere la couleur de fond
		oSaisie.style.borderWidth = "0";
		oSaisie.style.borderStyle = "solid";

		// Pour la couleur de fond on remonte au parent qui est dans un div
		var oParentTable = oParent;
		while ((oParentTable.tagName == "DIV") && (oParentTable.style.backgroundColor == ""))
		{
			oParentTable = oParentTable.parentNode;
		}
		oSaisie.style.borderColor = _JGCS(oParentTable).backgroundColor;

		// Si la hauteur du parent est faible : reduit la taille de la police
		if ((oParentTable.offsetHeight <= 18) && (oParentTable.offsetHeight > 0))
		{
			oSaisie.style.fontSize = Math.max(oParentTable.offsetHeight - 4, 6) + "px";
		}

		// On vide le contenu du parent pour que le positionnement soit bon
		SupprimeFils(oParent);

		// On l'attache a son parent
		oFormSaisie.appendChild(oSaisie);

		// Sauve le handler de click de la cellule parent
		this.m_fOldClick = oParentTable.onclick;
		oParentTable.onclick = null;
		this.m_oParentTable = oParentTable;

		// On met le tout dans la cellule de recherche
		this.m_oFormSaisie = oParent.appendChild(oFormSaisie);

		// Et donne le focus au champ de saisie
		this.m_oFormSaisie.elements[0].focus();
		// Et le redonne (La premiere methode ne fonctionne pas dans certains cas)
		if (nType == WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE)
			setTimeout("oGetId('" + oParent.id + "_SAI" + "').focus()", 1);

		this.m_bSaisie = true;
	},

	// Fin de la saisie
	// bValide : Valide ou annule la saisie
	// bContinueSaisie (Uniquemenet si bValide = vrai) : Indique si on doit essayer de continuer la saisie
	// nColonne (Uniquemenet si bValide et bContinue Saisie sont vrai) : Numero de la colonne ou donner le focus
	SaisieFin: function(bValide, bContinueSaisie, nColonne)
	{
		// Fin de l'intercepte du double clic
		this.m_oChampTable.oGetIDCelluleRel(this.m_nLigneRelative, this.m_nColonne).ondblclick = null;

		// Seulement si on a deja une recherche en cours : on la supprime
		if (this.m_oFormSaisie)
		{
			// Supprime le onblur de l'element de saisie pour eviter que le navigateur (IE) ne s'emelle les pinceau si on creer un nouvek objet
			this.m_oFormSaisie.elements[0].onblur = null;
			this.m_oFormSaisie.elements[0].onkeypress = null;

			if (bValide)
			{
				// Sauve la valeur
				var sValeur = "";
				var nValeur = -1;

				// Transformations selon le type du champ
				var nType = this.m_oChampTable.nColonneType(this.m_nColonne);
				switch (nType)
				{
					// Combo
					case WDAJAXMain.prototype.XML_CHAMP_TYPE_COMBO:
						var sSelection = this.m_oFormSaisie.elements[0].value;
						nValeur = parseInt(sSelection);
						sValeur = this.m_oChampTable.tabContenuCellule(this.m_nLigneRelative, this.m_nColonne)[nValeur];
						break;

					// Interrupteur, image, saisie et autres => rien
					case WDAJAXMain.prototype.XML_CHAMP_TYPE_INTERRUPTEUR:
//						var tabElements = document.getElementsByName("_" + (this.m_oChampTable.m_nDebut + this.m_nLigneRelative) + "_" + this.m_oChampTable.m_sAliasChamp + "_" + this.m_nColonne);
//						if ((tabElements.length > 0) && (tabElements[0].checked))
//						sValeur = ((tabElements.length > 0) && (tabElements[0].checked)) ? "1" : "0";
//						nValeur = ((tabElements.length > 0) && (tabElements[0].checked)) ? 1 : 0;
						break;

					case WDAJAXMain.prototype.XML_CHAMP_TYPE_IMAGE:
						break;

					case WDAJAXMain.prototype.XML_CHAMP_TYPE_SAISIE:
					default:
						sValeur = this.m_oFormSaisie.elements[0].value;
						break;
				}
				this.m_oChampTable.ChangementValeur(this.m_nLigneRelative, this.m_nColonne, sValeur, nValeur);

				// Si on doit tenter de continuer la saisie
				if (bContinueSaisie)
				{
					// Si on a -1 : tente la colonne saisissable suivante
					if (nColonne == -1)
					{
						var i;
						var nLimiteI = this.m_oChampTable.nNbColonnes();
						for (i = this.m_nColonne + 1; i < nLimiteI; i++)
						{
							var nType = this.m_oChampTable.nColonneType(i)
							if (nType != WDAJAXMain.prototype.XML_CHAMP_TYPE_INTERRUPTEUR)
							{
								if (this.m_oChampTable.bColonneSaisissable(i))
								{
									// On va reprende a cette colonne
									nColonne = i;
									break;
								}
							}
						}
					}
				}

				// Si on a pas une colonne saisissable ou que l'on indique de ne pas continuer : valide le changement
				if (!bContinueSaisie || !this.m_oChampTable.bColonneSaisissable(nColonne))
				{
					// Et notifie le serveur
					this.m_oChampTable.ValideChangement(this.m_nLigneRelative);
				}
			}

			// Detache et supprime le formulaire du document
			this.m_oFormSaisie = this.m_oFormSaisie.parentNode.removeChild(this.m_oFormSaisie);

			// Restaure le handler de click de la cellule parent
			this.m_oParentTable.onclick = this.m_fOldClick;
			delete this.m_fOldClick;
			delete this.m_oParentTable;

			// Et on demande la MAJ de la ligne
			this.m_oChampTable.bMAJLigneRel(this.m_nLigneRelative, null);

			// Supprime nos membres
			delete this.m_oFormSaisie;
			// Si on a une colonne saisissable et que l'on n'a pas envoyer les changements : donne le
			if (bContinueSaisie && this.m_oChampTable.bColonneSaisissable(nColonne) && (nColonne != -1))
			{
				// Memorise la colonne
				this.m_nColonne = nColonne;

				// Et commence la saisie
				this.SaisieCommence();
				return;
			}
			else
			{
				// Fait le menage
				this.m_nLigneRelative = -1;
				this.m_nColonne = -1;
				delete this.m_oDateClick;
				delete this.m_bSaisie;
			}
		}

		// Supprime la ligne virtuelle
		this.m_oChampTable.SupprimeLignesVirtuelles();
	}
};

// Objet pour la gestion du redimensionnement des colonnes
function WDRedimColonnes (oChampTable)
{
	// Si on est pas dans l'init d'un protoype
	if (oChampTable)
	{
		// Appel le constructeur de la classe de base
		WDDrag.prototype.constructor.apply(this, [true]);

		// Sauve l'objet attache
		this.m_oChampTable = oChampTable;
	}
};

// Declare l'heritage
WDRedimColonnes.prototype = new WDDrag();
// Surcharge le constructeur qui a ete efface
WDRedimColonnes.prototype.constructor = WDRedimColonnes;

//WDRedimColonnes.prototype.m_nColonne:				-1,			// Pas de colonne
//WDRedimColonnes.prototype.m_nTailleOriginale:		-1,			// Et pas de taille originale
//WDRedimColonnes.prototype.m_nTailleMinimale:		-1,			// Taille minimale
//WDRedimColonnes.prototype.m_bRedimEffectue:		false,		// Indique si on a redimensionne une colonne
//WDRedimColonnes.prototype.m_tabColonnesTaille:	new Array()	// Indique les % de tailles des colonnes redimensionnees

// Sauve la largeurs des colonnes dans un tableau et renvoie le tableau
// Si bProportionnel est a vrai ne sauve que les colonnes proportionnelles
WDRedimColonnes.prototype.__tabSauveLargeurColonnes = function __tabSauveLargeurColonnes(bProportionnel)
{
	var tabLargeurColonnes = new Array();

	var i = 0;
	// Recupere le DIV
	var oCelluleColonne = this.m_oChampTable.oGetIDCelluleRel(0, i);
	var nLimiteI = this.m_oChampTable.nNbColonnes();
	while (oCelluleColonne || (i < nLimiteI))
	{
		if (oCelluleColonne)
		{
			// Recherche le TD
			while (oCelluleColonne.tagName != "TD")
			{
				oCelluleColonne = oCelluleColonne.parentNode;
			}

			// Si la colonne est invisible : ne sauve pas sa valeur : elle ne sera pas manipuler
			var oStyleCelluleColonne = _JGCS(oCelluleColonne);
			var sVisibility = oStyleCelluleColonne.visibility;
			if (((sVisibility == "visible") || (sVisibility == "inherit")) && (oStyleCelluleColonne.display != "none"))
			{
				// Lit la taille si demande
				if (((oCelluleColonne.width + "").indexOf("%") != -1) || !bProportionnel)
				{
					var nOffsetWidth = oCelluleColonne.offsetWidth;
					// Si on est pas en "quirks mode", il faut tenir compte des bordure du parent
					if (!bIEQuirks)
					{
						nOffsetWidth -= this.m_oChampTable.__nGetOffset(oStyleCelluleColonne.borderLeftWidth) + this.m_oChampTable.__nGetOffset(oStyleCelluleColonne.borderRightWidth);
					}
					// Stocke la valeur proportionnelle dans le cas proportionnel
					if (bProportionnel)
					{
						tabLargeurColonnes[i] = oCelluleColonne.width;
						this.__SetDimColonne(i, nOffsetWidth);
					}
					else
					{	// Sinon stocke la vrai valeur
						tabLargeurColonnes[i] = nOffsetWidth;
					}
				}
			}
		}

		// Passe a la colonne suivante
		i++;
		oCelluleColonne = this.m_oChampTable.oGetIDCelluleRel(0, i);
	}

	// Renvoi le tableau forme
	return tabLargeurColonnes;
};

// Restaure la largeurs des colonnes depuis le tableau donne
WDRedimColonnes.prototype.__RestaureLargeurColonnes = function __RestaureLargeurColonnes(tabLargeurColonnes)
{
	// Restaure les colonnes
	var i;
	var nLimiteI = tabLargeurColonnes.length;
	for (i = 0; i < nLimiteI; i++)
	{
		if (tabLargeurColonnes[i] !== undefined)
		{
			// Restaure la taille de la colonne
			this.__SetDimColonne(i, tabLargeurColonnes[i]);
		}
	}
};

// Si on est sur le premier redimensionnement des colonnes : memorise la taille des colonnes et fixe les largeurs
WDRedimColonnes.prototype.__ColonnesFige = function __ColonnesFige()
{
//	assert(!this.m_bRedimEffectue);

	this.m_bRedimEffectue = true;

	this.m_sTableTaille = this.m_oChampTable.oGetIDElement(this.m_oChampTable.ID_TABLEINTERNE).width;
	var oTitrePosPixel = this.m_oChampTable.oGetIDElement(this.m_oChampTable.ID_TITRE, this.m_oChampTable.ID_POSITION_PIXEL);
	this.m_sTableTitreTaille = oTitrePosPixel.width;

	// Detecte les colonnes ancrees et memorise leur pourcentage d'ancrage
	this.m_tabColonnesTaille = this.__tabSauveLargeurColonnes(true);

	// Supprime la taille de la table parent
	this.m_oChampTable.oGetIDElement(this.m_oChampTable.ID_TABLEINTERNE).width = "";
	this.m_oChampTable.oGetIDElement(this.m_oChampTable.ID_TITRE, this.m_oChampTable.ID_POSITION_PIXEL).width = "";
};

// Restaure les largeurs variables de colonnes
WDRedimColonnes.prototype.ColonnesRestaure = function ColonnesRestaure()
{
	// On n'a besoin de le faire seulement si un redimensionnement a ete effectue
	if (this.m_bRedimEffectue)
	{
		// Restaure la largeur des colonnes ancrables
		this.__RestaureLargeurColonnes(this.m_tabColonnesTaille);

		var oTitrePosPixel = this.m_oChampTable.oGetIDElement(this.m_oChampTable.ID_TITRE, this.m_oChampTable.ID_POSITION_PIXEL);
		// Restaure la taille de la table
		this.m_oChampTable.oGetIDElement(this.m_oChampTable.ID_TABLEINTERNE).width = this.m_sTableTaille;
		oTitrePosPixel.width = this.m_sTableTitreTaille;

		// Supprime les membres
		delete this.m_bRedimEffectue;
		delete this.m_tabColonnesTaille;
		delete this.m_sTableTaille;
		delete this.m_sTableTitreTaille;
	}
};

// Appel lors du debut d'un click pour le redimensionnement
// Pose les hooks
WDRedimColonnes.prototype.OnMouseDown = function OnMouseDown(oEvent, nColonne, nTailleMinimale)
{
	// Appel de la classe de base : sauve la position de la souris et place les hooks
	WDDrag.prototype.OnMouseDown.apply(this, [oEvent]);

	// Si on est sur le premier redimensionnement des colonnes : memorise la taille des colonnes et fixe les largeurs
	if (!this.m_bRedimEffectue)
	{
		this.__ColonnesFige();
	}

	// Commence par sauver le numero de colonne
	this.m_nColonne = nColonne;

	// Sauve la taille originale
	this.m_nTailleOriginale = this.m_oChampTable.oGetIDCelluleRel(0, nColonne).parentNode.offsetWidth;
//	this.m_nTailleOriginale = parseInt(this.m_oChampTable.oGetIDCelluleRel(0, nColonne).parentNode.style.width)

	// Sauve la taille minimale
	this.m_nTailleMinimale = nTailleMinimale;
};

// Appel lors du deplacement de la souris
WDRedimColonnes.prototype.OnMouseMove = function OnMouseMove(oEvent)
{
	// Si on n'a pas besoin de rafraichir
	if (!this.bUpdateRefresh())
	{
		return;
	}

	// Appel de la classe de base
	WDDrag.prototype.OnMouseMove.apply(this, [oEvent]);

	// Calcule la nouvelle taille des colonnes
	// ATTENTION : Si on est en affichage de droite a gauche il faut inverser le deplacement de la souris car
	// les coordonnees X sont toujours de gauche a droite
	var nNouvelleTaille = 0;
	if (document.dir == "rtl")
		nNouvelleTaille = -(oEvent.clientX - this.nGetPosX()) + this.m_nTailleOriginale;
	else
		nNouvelleTaille = oEvent.clientX - this.nGetPosX() + this.m_nTailleOriginale;

	if (nNouvelleTaille < 8)
	{	// Taille minimum de 8
		nNouvelleTaille = 8;
	}

	// Respecte la taille minimale
	if ((this.m_nTailleMinimale != -1) && (nNouvelleTaille < this.m_nTailleMinimale))
	{
		nNouvelleTaille = this.m_nTailleMinimale;
	}

	// Defini la taille de la colonne
//	this.__SetDimColonne(this.m_nColonne, nNouvelleTaille + "px");
	this.__SetDimColonne(this.m_nColonne, nNouvelleTaille);

	// Si on risque de devoir changer le nombre de lignes
	if (this.m_oChampTable.bMAJNbLignesVisibles(true, true))
	{
		// Sauve la largeur de toutes les colonnes
		var tabLargeurColonnes = this.__tabSauveLargeurColonnes(false);

		// Rafraichi l'ascenseur et les lignes de la table. Si le nombre de ligne change : il faut reppliquer la gestion de la largeur
		if (this.m_oChampTable.bMAJNbLignesVisibles(true, false))
		{
			// Restaure la largeur des colonnes
			this.__RestaureLargeurColonnes(tabLargeurColonnes);
		}
	}
};

// Defini la taille de toute une colonne
WDRedimColonnes.prototype.__SetDimColonne = function __SetDimColonne(nColonne, sNouvelleTaille)
{
	var sSuffixeStyle = ((sNouvelleTaille + "").indexOf("%") != -1) ? "" : "px";

	// Defini la taille de la colonne de titre
//	this.__SetDimCellule(this.m_oChampTable.ID_TITRE, nColonne, sNouvelleTaille, 3, sSuffixeStyle);
	this.__SetDimCellule(this.m_oChampTable.ID_TITRE, nColonne, sNouvelleTaille, 2, sSuffixeStyle);
	// Defini la taille de la colonne cote donnees
	var i;
	var nLimiteI = this.m_oChampTable.m_oEtatLignes.nGetNbEtatLignes();
	for (i = 0; i < nLimiteI; i++)
	{
		this.__SetDimCellule(i, nColonne, sNouvelleTaille, 2, sSuffixeStyle);
	}
};

// Definit la taille d'une cellule
WDRedimColonnes.prototype.__SetDimCellule = function SetDimCellule(nLigne, nColonne, sNouvelleTaille, nNiveau, sSuffixeStyle)
{
	// Recupere le DIV
	var oDiv = this.m_oChampTable.oGetIDElement(nLigne, nColonne);
	// Des des cas rares (Avec 0 lignes et sans repro) on a oDiv a null
	// Cela doit venir de this.m_oChampTable.m_oEtatLignes.nGetNbEtatLignes qui n'est pas a 0
	// => Blindage
	if (!oDiv) return;

//	while (nNiveau-- > 0)
	while (--nNiveau > 0)
	{
		// On un niveau de DIV de plus
		oDiv = oDiv.parentNode;

		// Pour le parent du DIV (Autre DIV)
		oDiv.style.width = sNouvelleTaille + sSuffixeStyle;
	}
	// Puis le TD parent
	oDiv = oDiv.parentNode;
	oDiv.style.width = sNouvelleTaille;
};

// Appel lors du relachement de la souris
WDRedimColonnes.prototype.OnMouseUp = function OnMouseUp(oEvent)
{
	// Appel de la classe de base
	WDDrag.prototype.OnMouseUp.apply(this, [oEvent]);

	// Vire la taille originale
	delete this.m_nTailleOriginale;
	delete this.m_nTailleMinimale;

	// Vire le numero de colonne
	delete this.m_nColonne;
};
