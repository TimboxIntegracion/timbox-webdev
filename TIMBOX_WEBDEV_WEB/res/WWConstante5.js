//#15.00Aa WWConstante5.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Constantes pour les jours de la semaine
var STD_LUNDI = "Lundi";
var STD_MARDI = "Mardi";
var STD_MERCREDI = "Mercredi";
var STD_JEUDI = "Jeudi";
var STD_VENDREDI = "Vendredi";
var STD_SAMEDI = "Samedi";
var STD_DIMANCHE = "Dimanche";

// Constantes pour les mois de l'annee
var STD_JANVIER = "Janvier";
var STD_FEVRIER = unescape("F%E9vrier");
var STD_MARS = "Mars";
var STD_AVRIL = "Avril";
var STD_MAI = "Mai";
var STD_JUIN = "Juin";
var STD_JUILLET = "Juillet";
var STD_AOUT = unescape("Ao%FBt");
var STD_SEPTEMBRE = "Septembre";
var STD_OCTOBRE = "Octobre";
var STD_NOVEMBRE = "Novembre";
var STD_DECEMBRE = unescape("D%E9cembre");

// Constantes du menu contectuel des tables/zones repetees
var TABLE_EXPORT_EXCEL = "Exporter vers Excel...";
var TABLE_EXPORT_WORD = "Exporter vers Word...";
var TABLE_EXPORT_XML = "Exporter vers XML...";
var TABLE_EXPORT_PDF = "Imprimer en PDF...";

// Messages d'erreur de debug
var STD_ERREUR_MESSAGE			= unescape("Une erreur est survenue pendant l'ex%E9cution du code navigateur\nErreur ");
var STD_ERREUR_INDICE_RADIO		= unescape("Indice hors bornes lors de l'acc%E8s au s%E9lecteur ");
var STD_ERREUR_NUM_INDICE_RADIO		= "1001";
var STD_ERREUR_INDICE_CHECK		= unescape("Indice hors bornes lors de l'acc%E8s %E0 l'interrupteur ");
var STD_ERREUR_NUM_INDICE_CHECK		= "1002";
var STD_ERREUR_INDICE_LISTE		= unescape("Indice hors bornes lors de l'acc%E8s %E0 la liste ");
var STD_ERREUR_NUM_INDICE_LISTE		= "1003";
var STD_ERREUR_CHAMP_FOCUS		= "DonneFocus : champ inconnu";
var STD_ERREUR_NUM_CHAMP_FOCUS		= "1004";
var STD_ERREUR_PAGE_INCONNUE		= "Page inconnue";
var STD_ERREUR_NUM_PAGE_INCONNUE	= "1005";
var STD_ERREUR_FRAME_INCONNUE		= "Frame inconnue";
var STD_ERREUR_NUM_FRAME_INCONNUE	= "1006";
var STD_ERREUR_INDICE_ATTRIBUT		= unescape("Indice hors bornes lors de l'acc%E8s %E0 l'attribut de zone r%E9p%E9t%E9e ");
var STD_ERREUR_NUM_INDICE_ATTRIBUT	= "1007";
var STD_ERREUR_CHAMP_OBLIGATOIRE1	= "Champ '";
var STD_ERREUR_CHAMP_OBLIGATOIRE2	= "' obligatoire";
var STD_TITRE_TRACE					= "Trace des codes navigateur de WebDev";
var STD_INFO_TRACE					= unescape("Utiliser Ctrl+P pour imprimer la fen%EAtre de trace");
var STD_ERREUR_MESSAGE_UPLOAD		= unescape("L'upload a %E9chou%E9.\nUne erreur inattendue est survenue pendant l'upload d'un des fichiers.\nV%E9rifiez que les fichiers %E0 uploader ne sont pas trop volumineux.");
var STD_ERREUR_MESSAGE_VIDEO		= unescape("Impossible de trouver le fichier vid%E9o : %251.\nPour corriger ce probl%E8me :\n- V%E9rifiez que le fichier existe toujours sur le serveur.\n- V%E9rifiez que le serveur WEB ne bloque pas les fichiers de ce type.");

// Bulles et messages de la barre d'outils des champs graphes
var CHART_TOOLBAR =
{
	// Bulles des images
	ALTTEXT :
	{
		PIE : "Secteurs...",
		COL : "Histogrammes...",
		CUR : "Courbes...",
		STO : "Boursiers...",
		SAV : "Enregistrer sous...",
		PRI : "Imprimer...",
		LEG : unescape("L%E9gende"),
		GDH : "Quadrillage Horizontal",
		GDV : "Quadrillage Vertical",
		SMO : "Lissage",
		GRA : unescape("D%E9grad%E9"),
		RAI : "Relief",
		ANT : unescape("Anticr%E9nelage"),
		TRA : "Transparence"
	},

	// Textes du menu de la legende
	LEG :
	{
		0 : "Aucune",
		1 : "Droite",
		2 : "Gauche",
		3 : "Haut",
		4 : "Bas"
	},

	// Texte des menus des types
	// Courbes
	PIE :
	{
		0 : "Secteur",
		1 : unescape("H%E9micycle"),
		2 : "Donut"
	},
	// Histogrammes
	COL :
	{
		0 : unescape("Histogrammes group%E9s"),
		1 : unescape("Histogrammes empil%E9s"),
		2 : unescape("Histogrammes horizontaux group%E9s"),
		3 : unescape("Histogrammes horizontaux empil%E9s")
	},
	// Courbes
	CUR :
	{
		0 : "Courbe",
		1 : "Nuage de points",
		2 : "Aire",
		3 : "Radar"
	},
	// Boursiers
	STO :
	{
		0 : "Chandeliers japonais",
		1 : "BarCharts",
		2 : "Minimum Maximum"
	}
};

// Bulles et messages de la barre d'outils du champ de saisie riche HTML
var HTML_TOOLBAR =
{
	// Bulles des boutons de la barre
	ALTTEXT :
	{
		GRA : "Gras",
		ITA : "Italique",
		SOU : unescape("Soulign%E9"),
		BAR : unescape("Barr%E9"),
		AGA : unescape("Aligner %E0 gauche"),
		ACE : "Centrer",
		ADR : unescape("Aligner %E0 droite"),
		AJU : "Justifier",
		LNU : unescape("Num%E9rotation"),
		LPU : "Puces",
		RMO : unescape("R%E9duire le retrait"),
		RPL : "Augmenter le retrait",
		EXP : "Exposant",
		IND : "Indice",
		COL : "Couleur",
		LNK : unescape("Ins%E9rer un lien"),
		IMG : unescape("Ins%E9rer une image"),
		FNA : "Police",
		FSI : "Taille de la police"
	}
};
