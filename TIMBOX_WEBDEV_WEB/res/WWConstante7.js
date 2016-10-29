//#15.00Aa WWConstante7.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

// Days of the week
var STD_LUNDI = "Lunes";
var STD_MARDI = "Martes";
var STD_MERCREDI = unescape("Mi%E9rcoles");
var STD_JEUDI = "Jueves";
var STD_VENDREDI = "Viernes";
var STD_SAMEDI = unescape("S%E1bado");
var STD_DIMANCHE = "Domingo";

// Month of the year
var STD_JANVIER = "Enero";
var STD_FEVRIER = "Febrero";
var STD_MARS = "Marzo";
var STD_AVRIL = "Abril";
var STD_MAI = "Mayo";
var STD_JUIN = "Junio";
var STD_JUILLET = "Julio";
var STD_AOUT = "Augosto";
var STD_SEPTEMBRE = "Septiembre";
var STD_OCTOBRE = "Octubre";
var STD_NOVEMBRE = "Noviembre";
var STD_DECEMBRE = "Diciembre";

// Constants for the popup menu of tables/loopers
var TABLE_EXPORT_EXCEL = "Exportar a Excel...";
var TABLE_EXPORT_WORD = "Exportar a Word...";
var TABLE_EXPORT_XML = "Exportar a XML...";
var TABLE_EXPORT_PDF = "Imprimir en PDF...";

// Error messages of debug
var STD_ERREUR_MESSAGE			= unescape("Error durante la ejecuci%F3n del c%F3digo en el navegador\nError ");
var STD_ERREUR_INDICE_RADIO		= unescape("Sub%EDndice fuera de l%EDmite al acceder a un radio button ");
var STD_ERREUR_NUM_INDICE_RADIO	= "1001";
var STD_ERREUR_INDICE_RADIO		= unescape("Sub%EDndice fuera de l%EDmite al acceder a un check box ");
var STD_ERREUR_NUM_INDICE_CHECK	= "1002";
var STD_ERREUR_INDICE_RADIO		= unescape("Sub%EDndice fuera de l%EDmite al acceder a una list box ");
var STD_ERREUR_NUM_INDICE_LISTE	= "1003";
var STD_ERREUR_CHAMP_FOCUS		= "SetFocus: campo desconocido";
var STD_ERREUR_NUM_CHAMP_FOCUS	= "1004";
var STD_ERREUR_PAGE_INCONNUE	= unescape("P%E1gina desconocida");
var STD_ERREUR_NUM_PAGE_INCONNUE = "1005";
var STD_ERREUR_FRAME_INCONNUE	= "Frame desconocido";
var STD_ERREUR_NUM_FRAME_INCONNUE = "1006";
var STD_ERREUR_INDICE_RADIO		= unescape("Sub%EDndice fuera de l%EDmite al acceder a atributo de looper ");
var STD_ERREUR_NUM_INDICE_ATTRIBUT = "1007";
var STD_ERREUR_CHAMP_OBLIGATOIRE1 = "'";
var STD_ERREUR_CHAMP_OBLIGATOIRE2 = "' campo requerido";
var STD_TITRE_TRACE				= unescape("Rastreo del c%F3digo de WebDev en el navegador");
var STD_INFO_TRACE				= unescape("Ctrl+P le permite imprimir el c%F3digo de rastreo");
var STD_ERREUR_MESSAGE_UPLOAD	= unescape("El upload ha fallado.\nUn error inesperado ocurri%F3 al subir un archivo.\nAseg%FArese de que los archivos que desea subir no sean demasiado grandes.");
var STD_ERREUR_MESSAGE_VIDEO	= unescape("Ha sido imposible mostrar el fichero de video: %1\n- Verifique si el fichero existe en el servidor\n- Verifique si el Servidor Web autoriza la consultaci%F3n de este tipo de fichero (filtrado por tipo MIME)");

// Tooltips and messages of the toolbar for the chart controls
var CHART_TOOLBAR =
{
	// Tooltips of the buttons in the bar
	ALTTEXT :
	{
		PIE : unescape("Gr%E1fico circular..."),
		COL : unescape("Gr%E1fico de barras..."),
		CUR : unescape("Gr%E1fico de l%EDneas..."),
		STO : unescape("Gr%E1fico de cotizaciones..."),
		SAV : "Guardar como...",
		PRI : "Imprimir...",
		LEG : "Leyenda...",
		GDH : unescape("L%EDneas de cuadr%EDcula horizontales"),
		GDV : unescape("L%EDneas de cuadr%EDcula verticales"),
		SMO : "Suavizado",
		GRA : "Pendiente",
		RAI : "Estilo 3D",
		ANT : "Anti-aliasing",
		TRA : "Transparencia"
	},

	// Caption of the menu for the legend
	LEG :
	{
		0 : "Ninguno",
		1 : "Derecha",
		2 : "Izquierda",
		3 : "Parte superior",
		4 : "Parte inferior"
	},

	// Text of the menus for the types
	// Pie charts
	PIE :
	{
		0 : unescape("C%EDrculo"),
		1 : unescape("Semi-c%EDrculo"),
		2 : "Anillo"
	},
	// Bar charts
	COL :
	{
		0 : unescape("Gr%E1fico de barra agrupada"),
		1 : unescape("Gr%E1fico de barra apilada"),
		2 : unescape("Gr%E1fico de barra agrupada horizontal"),
		3 : unescape("Gr%E1fico de barra apilada vertical")
	},
	// Line charts
	CUR :
	{
		0 : unescape("L%EDnea"),
		1 : unescape("Dispersi%F3n"),
		2 : unescape("%C1rea"),
		3 : "Radar"
	},
	// Stock charts
	STO :
	{
		0 : "Candela",
		1 : unescape("Gr%E1ficos de barra"),
		2 : "MinMax"
	}
};

// Tooltips and messages in the toolbar of the rich HTML edit control
var HTML_TOOLBAR =
{
	// Tooltips of the buttons in the bar
	ALTTEXT :
	{
		GRA : "Negrita",
		ITA : unescape("It%E1lica"),
		SOU : "Subraya",
		BAR : "Tachado",
		AGA : "Alineado izquierdo",
		ACE : "Centrado",
		ADR : "Alineado derecho",
		AJU : "Justificado",
		LNU : unescape("Numeraci%F3n"),
		LPU : unescape("Vi%F1etas"),
		RMO : unescape("Disminuir tabulaci%F3n"),
		RPL : unescape("Incrementar tabulaci%F3n"),
		EXP: "Exponente",
		IND : unescape("Sub%EDndice"),
		COL : "Color",
		LNK : "Insertar un link",
		IMG : "Insertar una imagen",
		FNA : "Fuente",
		FSI : unescape("Tama%F1o de fuente")
	}
};
