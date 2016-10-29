//#15.00Ad WDCornage.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

function WDCornage(sAliasChamp,nCoin)
{
	if(sAliasChamp)
	{
		WDChamp.prototype.constructor.apply(this,[sAliasChamp,undefined,undefined]);
		this.m_nCoin=nCoin;
	}
}

WDCornage.prototype=new WDChamp();
WDCornage.prototype.constructor=WDCornage;

WDCornage.prototype.ms_nCoinHautGauche=0;
WDCornage.prototype.ms_nCoinHautDroit=1;
WDCornage.prototype.ms_nCoinBasGauche=2;
WDCornage.prototype.ms_nCoinBasDroit=3;

WDCornage.prototype.ms_nDelta=10;
WDCornage.prototype.ms_nDelai=10;

function sExtraitImage(sURLImage,sSepDeb,sSepFin)
{
	return sURLImage.substring(sURLImage.indexOf(sSepDeb)+1,sURLImage.lastIndexOf((sSepFin==null)?sSepDeb:sSepFin));
}

WDCornage.prototype.Init=function Init()
{
	WDChamp.prototype.Init.apply(this,[]);
	this.m_oObjet=oGetId(this.m_sAliasChamp);
	this.InitTailleImageStyle(_JGCS(this.m_oObjet).backgroundImage);
	this.m_nLargeurInit=this.nGetLargeur();
	this.m_nHauteurInit=this.nGetHauteur();
	this.m_nTimer=0;
	var oThis=this;
	if(bIE)
	{
		this.m_oObjet.onmouseover=function() { oThis.OnMouseOver(event); };
		this.m_oObjet.onmouseout=function() { oThis.OnMouseOut(event); };
	}
	else
	{
		this.m_oObjet.onmouseover=function(event) { oThis.OnMouseOver(event); };
		this.m_oObjet.onmouseout=function(event) { oThis.OnMouseOut(event); };
	}
	this.m_pfCallBack=function() { oThis.Anim(); }
};

// Calcul les hauteurs de l'image du champ depuis le style
WDCornage.prototype.InitTailleImageStyle=function InitTailleImageStyle(sURLImageStyle)
{
	// Extrait le chemin de l'image
	var sURLImage=sExtraitImage(sURLImageStyle,"\"");
	if(sURLImage=="") sURLImage=sExtraitImage(sURLImageStyle,"\'");
	if(sURLImage=="") sURLImage=sExtraitImage(sURLImageStyle,"(",")");

	this.InitTailleImage(sURLImage);
};

WDCornage.prototype.ms_sInitTailleImage="InitTailleImage";
WDCornage.prototype.InitTailleImage=function InitTailleImage(sURLImage)
{
	// Il faut attendre le chargement de l'image pour lire sa taille
	// Donc on memorise directement l'image
	this.m_oImage=new Image();
	this.m_oImage.src=sURLImage;
};

WDCornage.prototype.nGetLargeur=function nGetLargeur()
{
	return this.m_oObjet.offsetWidth;
};

WDCornage.prototype.nGetHauteur=function nGetHauteur()
{
	return this.m_oObjet.offsetHeight;
};

WDCornage.prototype.nDelta=function nDelta(nValInit,nValFin,nVal)
{
	var nFacteur=(nValInit>nValFin)?(-1):1;
	return (this.m_bOuvre?1:(-1))*nFacteur*Math.min(Math.max(1,Math.round((nFacteur*(nValFin-nValInit))/this.ms_nDelta)),nFacteur*(this.m_bOuvre?(nValFin-nVal):(nVal-nValInit)));
};

WDCornage.prototype.sValeurStyle=function sValeurStyle(nVal)
{
	return nVal+"px";
};

WDCornage.prototype.Anim=function Anim()
{
	var nLargeur=this.nGetLargeur();
	var nDeltaX=this.nDelta(this.m_nLargeurInit,this.m_oImage.width,nLargeur);
	var nHauteur=this.nGetHauteur();
	var nDeltaY=this.nDelta(this.m_nHauteurInit,this.m_oImage.height,nHauteur);
	var oObjet=this.m_oObjet;
	var oStyle=oObjet.style;
	var bDeltaX=(nDeltaX!=0);
	if(bDeltaX)
	{
		if((this.m_nCoin==this.ms_nCoinHautDroit)||(this.m_nCoin==this.ms_nCoinBasDroit)) oStyle.left=this.sValeurStyle(oObjet.offsetLeft-nDeltaX);
		oStyle.width=this.sValeurStyle(nLargeur+nDeltaX);
	}
	var bDeltaY=(nDeltaY!=0);
	if(bDeltaY)
	{
		if(this.m_nCoin>this.ms_nCoinHautDroit) oStyle.top=this.sValeurStyle(oObjet.offsetTop-nDeltaY);
		oStyle.height=this.sValeurStyle(nHauteur+nDeltaY);
	}
	this.m_nTimer=(bDeltaX||bDeltaY)?setTimeout(this.m_pfCallBack,this.ms_nDelai):0;
};

function FinAnim(oAnim)
{
	if(oAnim!=null)
	{
		oAnim.vAnnule();
		delete oAnim;
	}
	return null;
}

WDCornage.prototype.LanceAnim=function LanceAnim(bOuvre)
{
	if(bOuvre!=this.m_bOuvre)
	{
		if(this.m_nTimer!=0)
		{
			clearTimeout(this.m_nTimer);
			this.m_nTimer=0;
		}
		this.m_bOuvre=bOuvre;
	}
	if(this.m_nTimer==0) this.Anim();
};

WDCornage.prototype.OnMouseOver=function OnMouseOver(oEvent)
{
	this.LanceAnim(true);
};

WDCornage.prototype.OnMouseOut=function OnMouseOut(oEvent)
{
	this.LanceAnim(false);
};

