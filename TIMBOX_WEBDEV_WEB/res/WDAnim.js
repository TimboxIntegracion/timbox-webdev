//#15.00Af WDAnim.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

function WDAnim(pfSetProp, eProp, nValDebut, nValFin, nType, nCourbe, nDuree)
{
	if (pfSetProp !== undefined)
	{
		this.m_pfSetProp = pfSetProp;
		this.m_eProp = eProp;
		this.m_nValDebut = nValDebut;
		this.m_nValDelta = nValFin - nValDebut;
		this.m_nDebut = (new Date()).getTime();
		// Centieme de secondes => millisecondes
		this.m_nType = nType;
		this.m_nCourbe = nCourbe;
		this.m_nDuree = nDuree * 10;
		this.m_bFini = false;
		var oThis = this;
		this.m_pfCallBack = function() { oThis.vMaj(); }
		// Premiere animation
		// Note cette fonction est surchargable dans les classes derivees (!!!)
		// Donc il faut bien faire attention d'appeller le constructeur en dernier dans les constructeurs derives
		this.vMaj();
	}
}

WDAnim.prototype.ms_nTypeFondu=1;
WDAnim.prototype.ms_nTypeBalayageBas=2;
WDAnim.prototype.ms_nTypeBalayageHaut=3;
WDAnim.prototype.ms_nTypeBalayageDroite=4;
WDAnim.prototype.ms_nTypeBalayageGauche=5;
WDAnim.prototype.ms_nTypeRecouvrementHaut=6;
WDAnim.prototype.ms_nTypeRecouvrementBas=7;
WDAnim.prototype.ms_nTypeRecouvrementGauche=8;
WDAnim.prototype.ms_nTypeRecouvrementDroite=9;
WDAnim.prototype.ms_nTypeRecouvrement=10;
WDAnim.prototype.ms_nTypeRecouvrementZoom=11;
WDAnim.prototype.ms_nTypeDecouvrement=12;
WDAnim.prototype.ms_nTypeDecouvrementZoom=13;

WDAnim.prototype.ms_nCourbeLineaire=0;
WDAnim.prototype.ms_nCourbeAccelere=1;
WDAnim.prototype.ms_nCourbeDecelere=2;

WDAnim.prototype.vMaj = function vMaj()
{
	// Calcule l'avancement
	var nTemps = (new Date()).getTime() - this.m_nDebut;
	var dAvancement = Math.min(1, nTemps / this.m_nDuree);
	// Calcule la valeur et l'affiche
	if (this.m_pfSetProp)
	{
		var nVal=0;
		if(this.m_nCourbe==this.ms_nCourbeLineaire) nVal=this.m_nValDebut+dAvancement*this.m_nValDelta;
		else nVal=this.m_nValDebut+this.m_nValDelta*(((this.m_nCourbe==this.ms_nCourbeAccelere)?0:1)+Math.sin(((this.m_nCourbe==this.ms_nCourbeAccelere)?0:(Math.PI*1.5))+((Math.PI/2)*dAvancement)))
		this.m_pfSetProp(nVal);
	}

	// Si on n'est pas arrive a la fin
	if (nTemps < this.m_nDuree)
	{
		// Toutes les 25ms ou le temps restant
		var nTimer = Math.min(25, this.m_nDuree - nTemps);
		this.m_nTimeout = setTimeout(this.m_pfCallBack, nTimer);
	}
	else
	{
		// Indique que l'animation est finie
		this.vFin();
	}
};

// Annule l'animation
// Ne met PAS dans l'etat final
WDAnim.prototype.vAnnule = function vAnnule()
{
	// Annule le timeout
	clearTimeout(this.m_nTimeout);
	delete this.m_nTimeout;

	// Fin de l'animation
	this.vFin();
}

// Marque la fin de l'animation
WDAnim.prototype.vFin = function vFin()
{
	// Memorise que l'animation est finie
	this.m_bFini = true;
	delete this.m_nTimeout;
};

WDAnim.prototype.bFini = function bFini()
{
	return this.m_bFini;
};

function AnimationJoueSurProprieteChamp(nValDebut, nValFin, nDuree, nCourbe, pfSetProp, eProp)
{
	var nType = 0;
	return new WDAnim(pfSetProp, eProp, nValDebut, nValFin, nType, nCourbe, nDuree);
}

function WDAnimSurImage(oBaliseImg, sImageDebut, nOpaciteDebut, nType, nCourbe, nDuree, sImageFin)
{
	if (oBaliseImg !== undefined)
	{
		this.m_oBaliseImg=oBaliseImg;
		this.m_oDiv=document.createElement("div");
		this.SetSuperposable(this.m_oDiv);
		this.m_oDiv.style.overflow="hidden";
		this.AjoutFrere(this.m_oDiv);
		var nX=this.GetX(oBaliseImg);
		var nY=this.GetY(oBaliseImg);
		var nLargeur=this.GetLargeur(oBaliseImg);
		var nHauteur=this.GetHauteur(oBaliseImg);
		this.SetX(this.m_oDiv,nX);
		this.SetY(this.m_oDiv,nY);
		this.SetLargeur(this.m_oDiv,nLargeur);
		this.SetHauteur(this.m_oDiv,nHauteur);
		this.m_oBaliseImgTemp=this.oAjoutImageTemp(nLargeur,nHauteur,sImageDebut,nOpaciteDebut,nType,this.bImageTempFrere(nType),nX,nY);
		this.m_oBaliseImg=oBaliseImg;
		this.m_oAnimImage=null;
		this.m_oAnimImageTemp=null;
		this.m_oAnimImageTempX=null;
		this.m_oAnimImageTempY=null;
		this.m_oAnimImageTempL=null;
		this.m_oAnimImageTempH=null;
		this.m_oAnimDivTempX=null;
		this.m_oAnimDivTempY=null;
		this.m_oAnimDivTempL=null;
		this.m_oAnimDivTempH=null;
		this.m_oAnimImageTempFinX=null;
		this.m_oAnimImageTempFinY=null;
		this.m_oAnimImageTempFinL=null;
		this.m_oAnimImageTempFinH=null;
		this.m_oBaliseImgTempFin=null;
		this.m_sVisibilite=this.GetVisibilite(oBaliseImg);
		if(this.b2Image(nType))
		{
			this.m_oBaliseImgTempFin=this.oAjoutImageTemp(nLargeur,nHauteur,sImageFin,nOpaciteDebut,nType);
			this.SetVisibilite(oBaliseImg,"hidden");
		}		
		var oThis=this;
		switch(nType) 
		{
		case this.ms_nTypeFondu:
			this.SetOpacite(oBaliseImg,0);
			var fSetOpacite=function(nVal) { oThis.SetOpacite(oThis.m_oBaliseImg,nVal); };
			var fSetOpaciteTemp=function(nVal) { oThis.SetOpacite(oThis.m_oBaliseImgTemp,nVal); };
			this.m_oAnimImage=AnimationJoueSurProprieteChamp(0,nOpaciteDebut,nDuree,nCourbe,fSetOpacite);
			this.m_oAnimImageTemp=AnimationJoueSurProprieteChamp(nOpaciteDebut,0,nDuree,nCourbe,fSetOpaciteTemp);
			break;
		case this.ms_nTypeBalayageBas:
			this.InitYImageTemp(nY,nY+nHauteur,nDuree,nCourbe);
		case this.ms_nTypeRecouvrementHaut:
			this.InitYImageTempFin(nY-nHauteur,nY,nDuree,nCourbe);
			break;
		case this.ms_nTypeBalayageHaut:
			this.InitYImageTemp(nY,nY-nHauteur,nDuree,nCourbe);
		case this.ms_nTypeRecouvrementBas:
			this.InitYImageTempFin(nY+nHauteur,nY,nDuree,nCourbe);
			break;
		case this.ms_nTypeBalayageDroite:
			this.InitXImageTemp(nX,nX+nLargeur,nDuree,nCourbe);
		case this.ms_nTypeRecouvrementGauche:
			this.InitXImageTempFin(nX-nLargeur,nX,nDuree,nCourbe);
			break;
		case this.ms_nTypeBalayageGauche:
			this.InitXImageTemp(nX,nX-nLargeur,nDuree,nCourbe);
		case this.ms_nTypeRecouvrementDroite:
			this.InitXImageTempFin(nX+nLargeur,nX,nDuree,nCourbe);
			break;
		case this.ms_nTypeRecouvrement:
			this.InitXDiv(nX+nLargeur/2,nX,nDuree,nCourbe);
			this.InitXImageTempFin(nX,nX,nDuree,nCourbe);
			this.InitYDiv(nY+nHauteur/2,nY,nDuree,nCourbe);
			this.InitYImageTempFin(nY,nY,nDuree,nCourbe);
			this.InitLargeurDiv(nLargeur,nDuree,nCourbe,true);
			this.InitHauteurDiv(nHauteur,nDuree,nCourbe,true);
			break;
		case this.ms_nTypeRecouvrementZoom:
			this.InitXImageTempFin(nX+nLargeur/2,nX,nDuree,nCourbe);
			this.InitYImageTempFin(nY+nHauteur/2,nY,nDuree,nCourbe);
			this.InitLargeurImageTempFin(nLargeur,nDuree,nCourbe,true);
			this.InitHauteurImageTempFin(nHauteur,nDuree,nCourbe,true);
			break;
		case this.ms_nTypeDecouvrement:
			this.InitXDiv(nX,nX+nLargeur/2,nDuree,nCourbe);
			this.InitXImageTemp(nX,nX,nDuree,nCourbe);
			this.InitYDiv(nY,nY+nHauteur/2,nDuree,nCourbe);
			this.InitYImageTemp(nY,nY,nDuree,nCourbe);
			this.InitLargeurDiv(nLargeur,nDuree,nCourbe);
			this.InitHauteurDiv(nHauteur,nDuree,nCourbe);
			break;
		case this.ms_nTypeDecouvrementZoom:
			this.InitXImageTemp(nX,nX+nLargeur/2,nDuree,nCourbe);
			this.InitYImageTemp(nY,nY+nHauteur/2,nDuree,nCourbe);
			this.InitLargeurImageTemp(nLargeur,nDuree,nCourbe);
			this.InitHauteurImageTemp(nHauteur,nDuree,nCourbe);
			break;
		default:
			break;
		}

		// Appel de la classe de base (lance l'animation)
		WDAnim.prototype.constructor.apply(this,[null,null,null,null,nType,nCourbe,nDuree]);
	}
}

WDAnimSurImage.prototype = new WDAnim();
WDAnimSurImage.prototype.constructor = WDAnimSurImage;

WDAnimSurImage.prototype.GetOpacite = function GetOpacite(oBaliseImg)
{
	return _JCPOR(oBaliseImg.style.opacity, oBaliseImg);
};

WDAnimSurImage.prototype.SetOpacite = function SetOpacite(oBaliseImg, nVal)
{
	oBaliseImg.style.opacity = _JCPO(nVal, oBaliseImg);
};

WDAnimSurImage.prototype.GetX=function GetX(oBaliseImg)
{
	return _JCCP(oBaliseImg.offsetLeft,oBaliseImg,true,true);
};

WDAnimSurImage.prototype.SetX=function SetX(oBaliseImg,nVal)
{
	oBaliseImg.style.left=_JCCP(nVal,oBaliseImg,true,false)+"px";
};

WDAnimSurImage.prototype.GetY=function GetY(oBaliseImg)
{
	return _JCCP(oBaliseImg.offsetTop,oBaliseImg,false,true);
};

WDAnimSurImage.prototype.SetY=function SetY(oBaliseImg,nVal)
{
	oBaliseImg.style.top=_JCCP(nVal,oBaliseImg,false,false)+"px";
};

WDAnimSurImage.prototype.GetLargeur=function GetLargeur(oBaliseImg)
{
	return oBaliseImg.offsetWidth;
};

WDAnimSurImage.prototype.SetLargeur=function SetLargeur(oBaliseImg,nVal)
{
	oBaliseImg.style.width=nVal+"px";
};

WDAnimSurImage.prototype.GetHauteur=function GetHauteur(oBaliseImg)
{
	return oBaliseImg.offsetHeight;
};

WDAnimSurImage.prototype.SetHauteur=function SetHauteur(oBaliseImg,nVal)
{
	oBaliseImg.style.height=nVal+"px";;
};

WDAnimSurImage.prototype.GetVisibilite=function GetVisibilite(oBaliseImg)
{
	return oBaliseImg.style.visibility;
};

WDAnimSurImage.prototype.SetVisibilite=function SetVisibilite(oBaliseImg,sVal)
{
	oBaliseImg.style.visibility=sVal;
};

WDAnimSurImage.prototype.SetSuperposable=function SetSuperposable(oBalise)
{
	oBalise.style.position="absolute";
};

WDAnimSurImage.prototype.InitHauteurImage=function InitHauteurImage(nHauteur,nDuree,nCourbe)
{
	this.SetHauteur(this.m_oBaliseImg,0);
	var oThis=this;
	var fSetHauteur=function(nVal) { oThis.SetHauteur(oThis.m_oBaliseImg,nVal); };
	this.m_oAnimImage=AnimationJoueSurProprieteChamp(0,nHauteur,nDuree,nCourbe,fSetHauteur);
};

WDAnimSurImage.prototype.InitLargeurImage=function InitLargeurImage(nLargeur,nDuree,nCourbe)
{
	this.SetLargeur(this.m_oBaliseImg,0);
	var oThis=this;
	var fSetLargeur=function(nVal) { oThis.SetLargeur(oThis.m_oBaliseImg,nVal); };
	this.m_oAnimImage=AnimationJoueSurProprieteChamp(0,nLargeur,nDuree,nCourbe,fSetLargeur);
};

WDAnimSurImage.prototype.InitXImageTemp=function InitXImageTemp(nXDeb,nXFin,nDuree,nCourbe)
{
	var oThis=this;
	var fSetX=function(nVal) { oThis.SetX(oThis.m_oBaliseImgTemp,nVal); };
	this.m_oAnimImageTempX=AnimationJoueSurProprieteChamp(nXDeb,nXFin,nDuree,nCourbe,fSetX);
};

WDAnimSurImage.prototype.InitYImageTemp=function InitYImageTemp(nYDeb,nYFin,nDuree,nCourbe)
{
	var oThis=this;
	var fSetY=function(nVal) { oThis.SetY(oThis.m_oBaliseImgTemp,nVal); };
	this.m_oAnimImageTempY=AnimationJoueSurProprieteChamp(nYDeb,nYFin,nDuree,nCourbe,fSetY);
};

WDAnimSurImage.prototype.InitLargeurImageTemp=function InitLargeurImageTemp(nLargeur,nDuree,nCourbe)
{
	var oThis=this;
	var fSetLargeur=function(nVal) { oThis.SetLargeur(oThis.m_oBaliseImgTemp,nVal); };
	this.m_oAnimImageTempL=AnimationJoueSurProprieteChamp(nLargeur,0,nDuree,nCourbe,fSetLargeur);
};

WDAnimSurImage.prototype.InitHauteurImageTemp=function InitHauteurImageTemp(nHauteur,nDuree,nCourbe)
{
	var oThis=this;
	var fSetHauteur=function(nVal) { oThis.SetHauteur(oThis.m_oBaliseImgTemp,nVal); };
	this.m_oAnimImageTempH=AnimationJoueSurProprieteChamp(nHauteur,0,nDuree,nCourbe,fSetHauteur);
};

WDAnimSurImage.prototype.InitXImageTempFin=function InitXImageTempFin(nXDeb,nXFin,nDuree,nCourbe)
{
	var oThis=this;
	var fSetX=function(nVal) { oThis.SetX(oThis.m_oBaliseImgTempFin,nVal); };
	this.m_oAnimImageTempFinX=AnimationJoueSurProprieteChamp(nXDeb,nXFin,nDuree,nCourbe,fSetX);
};

WDAnimSurImage.prototype.InitYImageTempFin=function InitYImageTempFin(nYDeb,nYFin,nDuree,nCourbe)
{
	var oThis=this;
	var fSetY=function(nVal) { oThis.SetY(oThis.m_oBaliseImgTempFin,nVal); };
	this.m_oAnimImageTempFinY=AnimationJoueSurProprieteChamp(nYDeb,nYFin,nDuree,nCourbe,fSetY);
};

WDAnimSurImage.prototype.InitLargeurImageTempFin=function InitLargeurImageTempFin(nLargeur,nDuree,nCourbe,bFin)
{
	var oThis=this;
	var fSetLargeur=function(nVal) { oThis.SetLargeur(oThis.m_oBaliseImgTempFin,nVal); };
	this.m_oAnimImageTempFinL=AnimationJoueSurProprieteChamp(bFin?0:nLargeur,bFin?nLargeur:0,nDuree,nCourbe,fSetLargeur);
};

WDAnimSurImage.prototype.InitHauteurImageTempFin=function InitHauteurImageTempFin(nHauteur,nDuree,nCourbe,bFin)
{
	var oThis=this;
	var fSetHauteur=function(nVal) { oThis.SetHauteur(oThis.m_oBaliseImgTempFin,nVal); };
	this.m_oAnimImageTempFinH=AnimationJoueSurProprieteChamp(bFin?0:nHauteur,bFin?nHauteur:0,nDuree,nCourbe,fSetHauteur);
};

WDAnimSurImage.prototype.InitXDiv=function InitXDiv(nXDeb,nXFin,nDuree,nCourbe)
{
	var oThis=this;
	var fSetX=function(nVal) { oThis.SetX(oThis.m_oDiv,nVal); };
	this.m_oAnimDivTempX=AnimationJoueSurProprieteChamp(nXDeb,nXFin,nDuree,nCourbe,fSetX);
};

WDAnimSurImage.prototype.InitYDiv=function InitYDiv(nYDeb,nYFin,nDuree,nCourbe)
{
	var oThis=this;
	var fSetY=function(nVal) { oThis.SetY(oThis.m_oDiv,nVal); };
	this.m_oAnimDivTempY=AnimationJoueSurProprieteChamp(nYDeb,nYFin,nDuree,nCourbe,fSetY);
};

WDAnimSurImage.prototype.InitLargeurDiv=function InitLargeurDiv(nLargeur,nDuree,nCourbe,bFin)
{
	var oThis=this;
	var fSetLargeur=function(nVal) { oThis.SetLargeur(oThis.m_oDiv,nVal); };
	this.m_oAnimDivTempL=AnimationJoueSurProprieteChamp(bFin?0:nLargeur,bFin?nLargeur:0,nDuree,nCourbe,fSetLargeur);
};

WDAnimSurImage.prototype.InitHauteurDiv=function InitHauteurDiv(nHauteur,nDuree,nCourbe,bFin)
{
	var oThis=this;
	var fSetHauteur=function(nVal) { oThis.SetHauteur(oThis.m_oDiv,nVal); };
	this.m_oAnimDivTempH=AnimationJoueSurProprieteChamp(bFin?0:nHauteur,bFin?nHauteur:0,nDuree,nCourbe,fSetHauteur);
};

WDAnimSurImage.prototype.bAnimFini=function bAnimFini(oAnim)
{
	if(oAnim==null) return true;
	if(oAnim.bFini())
	{
		delete oAnim;
		oAnim=null;
		return true;
	}
	return false;
}

WDAnimSurImage.prototype.b2Image=function b2Image(nType)
{
	return (nType>this.ms_nTypeFondu)&&(nType<this.ms_nTypeDecouvrement);
}

WDAnimSurImage.prototype.bImageTempFrere=function bImageTempFrere(nType)
{
	return (nType==this.ms_nTypeRecouvrement);
}

WDAnimSurImage.prototype.AjoutFrere=function AjoutFrere(oBalise)
{
	if(this.m_oBaliseImg.nextSibling)
	{
		this.m_oBaliseImg.parentNode.insertBefore(oBalise,this.m_oBaliseImg.nextSibling);
	}
	else
	{
		this.m_oBaliseImg.parentNode.appendChild(oBalise);
	}
}

WDAnimSurImage.prototype.oAjoutImageTemp=function oAjoutImageTemp(nLargeur,nHauteur,sImage,nOpacite,nType,bFrere,nX,nY)
{
	var oBaliseImgTemp=new Image();
	this.SetSuperposable(oBaliseImgTemp);
	if(bFrere)
	{
		this.AjoutFrere(oBaliseImgTemp);
		this.SetX(oBaliseImgTemp,nX);
		this.SetY(oBaliseImgTemp,nY);
	}
	else this.m_oDiv.appendChild(oBaliseImgTemp);
	this.SetLargeur(oBaliseImgTemp,nLargeur);
	this.SetHauteur(oBaliseImgTemp,nHauteur);
	if((nOpacite<100)&&(nType!=this.ms_nTypeDecouvrement)) this.SetOpacite(oBaliseImgTemp,nOpacite);
	oBaliseImgTemp.src=sImage;
	return oBaliseImgTemp;
}

WDAnimSurImage.prototype.vMaj=function vMaj()
{
	// Si les deux animations sont finies
	if(this.bAnimFini(this.m_oAnimImage)&&this.bAnimFini(this.m_oAnimImageTemp)&&this.bAnimFini(this.m_oAnimImageTempX)&&this.bAnimFini(this.m_oAnimImageTempY)&&this.bAnimFini(this.m_oAnimImageTempL)&&this.bAnimFini(this.m_oAnimImageTempH)&&this.bAnimFini(this.m_oAnimImageTempFinX)&&this.bAnimFini(this.m_oAnimImageTempFinY)&&this.bAnimFini(this.m_oAnimImageTempFinL)&&this.bAnimFini(this.m_oAnimImageTempFinH)&&this.bAnimFini(this.m_oAnimDivTempX)&&this.bAnimFini(this.m_oAnimDivTempY)&&this.bAnimFini(this.m_oAnimDivTempL)&&this.bAnimFini(this.m_oAnimDivTempH))
	{
		this.m_bFini=true;
		if(this.b2Image(this.m_nType)) this.SetVisibilite(this.m_oBaliseImg,this.m_sVisibilite);
		// Supprime l'image temporaire du document
		this.m_oDiv.parentNode.removeChild(this.m_oDiv);
		(this.bImageTempFrere(this.m_nType)?this.m_oBaliseImg.parentNode:this.m_oDiv).removeChild(this.m_oBaliseImgTemp);
		delete this.m_oDiv;
		delete this.m_oBaliseImgTemp;
		delete this.m_oBaliseImgTempFin;
	}
	// Sinon se relance
	else
	{
		setTimeout(this.m_pfCallBack,25);
	}
};

function sAnimationJoueSurImage(sValeur, oImage, sImageDebut, nOpaciteDebut, nType, nCourbe, nDuree)
{
	// Lance l'animation
	new WDAnimSurImage(oImage, sImageDebut, nOpaciteDebut, nType, nCourbe, nDuree,sValeur);
	// Et retourne la valeur (pour le .src)
	return sValeur;
}
