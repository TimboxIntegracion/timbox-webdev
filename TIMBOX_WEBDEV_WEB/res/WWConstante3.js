//#15.00Aa WWConstante3.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Days of the week
var STD_LUNDI = "Monday";
var STD_MARDI = "Thuesday";
var STD_MERCREDI = "Wednesday";
var STD_JEUDI = "Thursday";
var STD_VENDREDI = "Friday";
var STD_SAMEDI = "Saturday";
var STD_DIMANCHE = "Sunday";

// Month of the year
var STD_JANVIER = "January";
var STD_FEVRIER = "February";
var STD_MARS = "March";
var STD_AVRIL = "April";
var STD_MAI = "May";
var STD_JUIN = "June";
var STD_JUILLET = "July";
var STD_AOUT = "August";
var STD_SEPTEMBRE = "September";
var STD_OCTOBRE = "October";
var STD_NOVEMBRE = "November";
var STD_DECEMBRE = "December";

// Constants for the popup menu of tables/loopers
var TABLE_EXPORT_EXCEL = "Export to Excel...";
var TABLE_EXPORT_WORD = "Export to Word...";
var TABLE_EXPORT_XML = "Export to XML...";
var TABLE_EXPORT_PDF = "Print in PDF...";

// Error messages of debug
var STD_ERREUR_MESSAGE			= "Error running browser code\nError ";
var STD_ERREUR_INDICE_RADIO		= "Subscript out of bounds when accessing radio button ";
var STD_ERREUR_NUM_INDICE_RADIO		= "1001";
var STD_ERREUR_INDICE_CHECK		= "Subscript out of bounds when accessing check box ";
var STD_ERREUR_NUM_INDICE_CHECK		= "1002";
var STD_ERREUR_INDICE_LISTE		= "Subscript out of bounds when accessing list box ";
var STD_ERREUR_NUM_INDICE_LISTE		= "1003";
var STD_ERREUR_CHAMP_FOCUS		= "SetFocus: unknown control";
var STD_ERREUR_NUM_CHAMP_FOCUS		= "1004";
var STD_ERREUR_PAGE_INCONNUE		= "Unknown page";
var STD_ERREUR_NUM_PAGE_INCONNUE	= "1005";
var STD_ERREUR_FRAME_INCONNUE		= "Unknown frame";
var STD_ERREUR_NUM_FRAME_INCONNUE	= "1006";
var STD_ERREUR_INDICE_ATTRIBUT		= "Subscript out of bounds when accessing looper attribute ";
var STD_ERREUR_NUM_INDICE_ATTRIBUT	= "1007";
var STD_ERREUR_CHAMP_OBLIGATOIRE1	= "'";
var STD_ERREUR_CHAMP_OBLIGATOIRE2	= "' control required";
var STD_TITRE_TRACE					= "Trace of WebDev browser codes";
var STD_INFO_TRACE					= "Ctrl+P enables you to print the trace window";
var STD_ERREUR_MESSAGE_UPLOAD		= "The upload failed.\nAn unexpected error occurred while uploading one of the files.\nCheck the size of the files to upload.";
var STD_ERREUR_MESSAGE_VIDEO		= "Unable to display the video file: %1.\n- Check whether the file exists on the server.\n- Check whether the consultation of this type of file (filtering by MIME type) is allowed by the Web server.";

// Tooltips and messages of the toolbar for the chart controls
var CHART_TOOLBAR =
{
	// Tooltips of the buttons in the bar
	ALTTEXT :
	{
		PIE : "Pie charts...",
		COL : "Bar charts...",
		CUR : "Line charts...",
		STO : "Stock charts...",
		SAV : "Save as...",
		PRI : "Print...",
		LEG : "Legend...",
		GDH : "Horizontal gridlines",
		GDV : "Vertical gridlines",
		SMO : "Smoothing",
		GRA : "Gradient",
		RAI : "Raised",
		ANT : "Anti-aliasing",
		TRA : "Transparency"
	},

	// Caption of the menu for the legend
	LEG :
	{
		0 : "None",
		1 : "Right",
		2 : "Left",
		3 : "Top",
		4 : "Bottom"
	},

	// Text of the menus for the types
	// Pie charts
	PIE :
	{
		0 : "Pie",
		1 : "Semi-circular",
		2 : "Donut"
	},
	// Bar charts
	COL :
	{
		0 : "Clustered bar charts",
		1 : "Stacked bar charts",
		2 : "Grouped horizontal bar charts",
		3 : "Stacked horizontal bar charts"
	},
	// Line charts
	CUR :
	{
		0 : "Line",
		1 : "Scatter",
		2 : "Area",
		3 : "Radar"
	},
	// Stock charts
	STO :
	{
		0 : "Candlestick",
		1 : "BarCharts",
		2 : "MinMax"
	}
};

// Tooltips and messages in the toolbar of the rich HTML edit control
var HTML_TOOLBAR =
{
	// Tooltips of the buttons in the bar
	ALTTEXT :
	{
		GRA : "Bold",
		ITA : "Italic",
		SOU : "Underline",
		BAR : "Strikeout",
		AGA : "Align left",
		ACE : "Center",
		ADR : "Align right",
		AJU : "Justify",
		LNU : "Numbering",
		LPU : "Bullets",
		RMO : "Decrease indent",
		RPL : "Increase indent",
		EXP : "Superscript",
		IND : "Subscript",
		COL : "Color",
		LNK : "Insert a link",
		IMG : "Insert an image",
		FNA : "Font",
		FSI : "Font size"
	}
};
