//#15.00Aa MenuDeroulant.JS
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

MAXSUBMENU=10
function CreerMain(name, X,Y,haut,vertical,colFOn,colFOff,colTOn,colTOff)
{
	this.nb=0;
	this.X=X;
	this.Y=Y;
	this.hauteur=haut;
	this.Add=AddMain;
	this.Print=PrintMain;
	this.vert=vertical;
	this.nom=name;
	this.mainmenu=this;

	this.RepertoireImage="";
	this.ImageSiSousMenu="fleche1.gif";
	this.ImageSiPasSousMenu="vide.gif";
	this.font="ms sans serif";
	this.colBarre="#EDF2F9";
	this.colFond="#EDF2F9";
	this.colContour="#000066";
	this.colOver="#316AC5";
	this.colTextOff="navy";
	this.colTextOn="white";
	this.cssTexte=";font-weight:bold;color:navy;font-family:ms sans serif;font-size:12px";
	this.delai=500;
	this.isout=0;
	this.MnuImgBor = "MenuBordure.gif"
	this.MnuMarLib = 15
	this.MnuImgFond= ""
	this.MnuImgFondOption= "";

	this.AFF=AFF;
	this.start=start;
	this.hideall=hideall;
	this.onfond=onfond;
}

function AddMain(txt,larg,mnu,url,target)
{
	var m=new Object;
	m.txt=txt;
	m.hauteur=this.hauteur;
	m.vert=this.vert;
	m.larg=larg;
	m.mnu=mnu;
	m.url=url;
	m.target=target;
	m.mainmenu=this;

	this.nb++;
	this[this.nb]=m;

	if(mnu!='')
	{
		eval(mnu+'.parent="'+txt+'"');
		//eval(mnu+'.mainmenu="'+this.nom+'"');
	};
}

function PrintMain()
{
	X=this.X;
	Y=this.Y;
	A="";
	for (var i=1;i<=this.nb;i++)
	{
		if (this[i].mnu=="")
		{
			this[i].mnu='0';
		}
		if ((document.all)||(window.sidebar)||(!document.layers))
		{
			var clic="";
			var style="";
			if(this[i].url!="")
			{
				style="cursor:pointer;";
				clic=" onclick=\""+this[i].url+"\";";
			}

			if(this.vert)
			{
				if (this.MnuImgFond!="")
				{
					A+="<DIV id='"+this.nom+i+"' style='position:absolute;left:"+X+"px;top:"+Y+"px;"+style+"width:"+this[i].larg+"px;height:"+this[i].hauteur+"px;background-color:"+this.colBarre+";"+this.cssTexte+";color:"+this.colTextOff+";text-align:left;background-image:url(\""+this.RepertoireImage+this.MnuImgFond+"\");background-repeat:repeat-x;' onmouseover='"+this.nom+".start("+i+","+(X+this[i].larg+1)+","+Y+")'"+clic+">"+this[i].txt+"</DIV>";
				}
				else
				{
					A+="<DIV id='"+this.nom+i+"' style='position:absolute;left:"+X+"px;top:"+Y+"px;"+style+"width:"+this[i].larg+"px;height:"+this[i].hauteur+"px;background-color:"+this.colBarre+";"+this.cssTexte+";color:"+this.colTextOff+";text-align:left;' onmouseover='"+this.nom+".start("+i+","+(X+this[i].larg+1)+","+Y+")'"+clic+">"+this[i].txt+"</DIV>";
				}
			}
			else
			{
				if (this.MnuImgFond!="")
				{
					A+="<DIV id='"+this.nom+i+"' style='position:absolute;left:"+X+"px;top:"+Y+"px;"+style+"width:"+this[i].larg+"px;height:"+this[i].hauteur+"px;background-color:"+this.colBarre+";"+this.cssTexte+";color:"+this.colTextOff+";text-align:center;background-image:url(\""+this.RepertoireImage+this.MnuImgFond+"\");background-repeat:repeat-x;' onmouseover='"+this.nom+".start("+i+","+X+","+(Y+this[i].hauteur+1)+")'"+clic+">"+this[i].txt+"</DIV>";
				}
				else
				{
					A+="<DIV id='"+this.nom+i+"' style='position:absolute;left:"+X+"px;top:"+Y+"px;"+style+"width:"+this[i].larg+"px;height:"+this[i].hauteur+"px;background-color:"+this.colBarre+";"+this.cssTexte+";color:"+this.colTextOff+";text-align:center;' onmouseover='"+this.nom+".start("+i+","+X+","+(Y+this[i].hauteur+1)+")'"+clic+">"+this[i].txt+"</DIV>";
				}
			}
		}
		if (document.layers)
		{

			var txt=this[i].txt;
			if(this[i].url!="")
			{
				txt="<A href='"+this[i].url+"'>"+txt+"</A>";
			}

			if(this.vert)
			{
				A+="<LAYER name='"+this.nom+i+"' left="+X+" top="+Y+" width="+this[i].larg+" height="+this.hauteur+" bgcolor="+this.colBarre+" onmouseover='"+this.nom+".start("+i+","+(X+this[i].larg+1)+","+Y+")'><SPAN style='background-color:"+this.colBarre+this.cssTexte+"'>"+txt+"</SPAN></LAYER>";
			}
			else
			{
				A+="<LAYER name='"+this.nom+i+"' left="+X+" top="+Y+" width="+this[i].larg+" height="+this.hauteur+" bgcolor="+this.colBarre+" onmouseover='"+this.nom+".start("+i+","+X+","+(Y+this.hauteur+1)+")'><CENTER><SPAN style='background-color:"+this.colBarre+this.cssTexte+"'>"+txt+"</SPAN></CENTER></LAYER>";
			}
		}

		if(this.vert)
		{
			Y+=this[i].hauteur+1;
		}
		else
		{
			X+=this[i].larg+1;

		}
	}
	document.write(A);
}

function CreerMenu(nom,mainmenu,niv,target,hauteur)
{
	this.nb=0;
	this.X=0;
	this.Y=0;
	this.width=1;
	this.niv=niv;
	this.parent="";
	this.ON=-1;
	this.nom=nom;
	this.target="";
	if ((target!="")&&(target!=null))
		this.target=target;
	this.mainmenu=mainmenu;

	if(hauteur)
	{
		this.hauteur=hauteur;
	}
	else
	{
		this.hauteur=mainmenu.hauteur
	}

	this.add=Add;
	this.aff=aff;
	this.mmover=mmover;
	this.mmclick=mmclick;
	this.clear=clear;
	this.over=over;
	this.out=out;
	this.hide=hide;
}

function Add(lib,lnk,mnu,target)
{
	var rub = new Object;
	rub.lib=lib;
	rub.target=target;
	rub.lnk="";
	if ((lnk!="")&&(lnk!=null))
		rub.lnk=lnk;
	rub.mnu="";
	if ((mnu!="")&&(mnu!=null))
	{
		rub.mnu=mnu;
		mnu.parent=this;
	}

	rub.mainmenu=this.mainmenu;

	this[this.nb]=rub;
	this.nb++;
}

function start(i,x,y)
{
	this.isout=1;
	this.hideall(i);
	if (this[i].mnu!=0)
	{
		eval(this[i].mnu+".aff("+x+","+y+")");
	};
	BGCalque(this.nom+i,this.colOver,this.colContour);
	FontCalque(this.nom+i,this.colTextOn,0);
	MoveCalque(this.nom+"fond",x-50,y+1);
	ShowCalque(this.nom+"fond");
	return false;
}

function onfond()
{
	this.isout=1;
	setTimeout(this.nom+".hideall()",this.delai);
}

function hideall(i)
{
	if (this.isout==1)
	{
		for (var i=0;i<MAXSUBMENU;i++)
		{
			HideCalque(this.nom+"niv"+i);
			HideCalque(this.nom+"fond");
		}
		for (var i=1;i<=this.nb;i++)
		{
			BGCalque(this.nom+i,this.colBarre,this.colFond);
			FontCalque(this.nom+i,this.colTextOff,0);
		}
		window.status="";
		MoveCalque(this.nom+"fond",1,1);
	}
}

function hide()
{
	if (this.ON>-1)
	{
		if (this[this.ON].mnu!="")
		{
			var nom=this.mainmenu.nom+"niv"+this[this.ON].mnu.niv;
			HideCalque(nom);
			this[this.ON].mnu.hide();
		}
	}
	this.ON=-1;
}

function over(i)
{
	var nom=this.mainmenu.nom+"niv"+this.niv+"n"+i;
	var nomtd=nom+"td";
	this.mainmenu.isout=0;
	BGCalque(nom,this.mainmenu.colOver,this.mainmenu.colContour);
	FontCalque(nomtd,this.mainmenu.colTextOn,0);
}

function out(i)
{
	var nom=this.mainmenu.nom+"niv"+this.niv+"n"+i;
	var nomtd=nom+"td";
	var cFond=this.mainmenu.colFond;
	if (this[i].lib!="-")
	{
		BGCalque(nom,cFond,cFond);
		FontCalque(nomtd,this.mainmenu.colTextOff,0);
	}
}

function clear()
{
	for (var j=0;j<this.nb;j++)
	{
		this.out(j);
		this.hide();
	}
}

function mmover(i)
{
	this.clear();
	this.over(i);
	this.ON=i;
	if (this[i].mnu!="")
	{
		this[i].mnu.aff();
	}
	var ok=1;
	var Y="";
	var Z=this[i].lib;
	var u=this;
	while (u.niv>0)
	{
		Z=u.parent[u.parent.ON].lib+" > "+Z;
		u=u.parent;
	}
	Z=u.parent+" > "+Z;
	for (var j=0;j<Z.length ;j++ )
	{
		if (Z.charAt(j)=="<")
		{
			ok=0;
		}
		if (ok==1)
		{
			Y+=Z.charAt(j);
		}
		if (Z.charAt(j)==">")
		{
			ok=1;
		}
	}
	window.status=Y;
}

function mmclick(event)
{
	lnk=this[this.ON].lnk;
	if (lnk!="")
	{
		if (this[this.ON].target=="_blank")
		{
			eval(lnk);
		}
		else
		{
			eval(lnk);
		}
	}
}

function AFF()
{
	var n=new Image;
	n.src=this.RepertoireImage+this.ImageSiSousMenu;
	var m=new Image;
	m.src=this.RepertoireImage+this.ImageSiPasSousMenu;
	var A="";
	if ((document.all)||(window.sidebar)||(!document.layers))
	{
		A="<DIV id='"+this.nom+"fond' style='position:absolute;border=1px;top:10px;left:100px;width:500px;height:400px;visibility:hidden;font-family:"+this.font+"' onmouseover='"+this.nom+".onfond()'></DIV>";
		for (var i=0;i<MAXSUBMENU;i++)
		{
			A+="<DIV id='"+this.nom+"niv"+i+"' style='position:absolute;top:10px;left:100px;visibility:hidden;font-family:"+this.font+"'></DIV>";
		}
	}
	else
	{
		A="<LAYER name='"+this.nom+"fond' width=500 height=600 visibility=hide top=100 left=100 onmouseover='"+this.nom+"onfond()'>&nbsp;</LAYER>";
		for (var i=0;i<MAXSUBMENU;i++)
		{
			A+="<LAYER name='"+this.nom+"niv"+i+"' top=200 left=200 visibility=show></LAYER>";
		}
	}
	document.write(A);
	this.Print();
}

// cadre interne : 0 ou 1
MnuCadInt = 0;



function aff(x,y)
{
	//var nom=this.nom;
	var niv=this.mainmenu.nom+"niv"+this.niv;

	if (this.niv==0)
	{
		X=x;
		Y=y;
	}
	else
	{
		if(window.sidebar)
			X=this.parent.X+this.parent.width+1;
		else
			X=this.parent.X+this.parent.width-1;
		////Y=this.parent.Y+(hauteur+4+3*MnuCadInt)*this.parent.ON+2*MnuCadInt

		//Y=this.parent.Y+(this.hauteur)*this.parent.ON
		Y=this.parent.Y;
		for(var i=0;i<this.parent.ON;i++)
		{
			if(document.all)
			{
				Y+=document.all[this.mainmenu.nom+"niv"+(this.niv-1)+"n"+i].clientHeight;
			}
			else if((window.sidebar)||document.getElementById)
			{
				Y+=document.getElementById(this.mainmenu.nom+"niv"+(this.niv-1)+"n"+i).clientHeight+1;	//+1 : bords
			}
		}
	}

	var repimg=this.mainmenu.RepertoireImage;

	if ((document.all)||(window.sidebar)||(!document.layers))
	{
		var A=""
		A+=	"<TABLE border=0 cellpadding=0 cellspacing="+MnuCadInt+" style='"
		A+= "background-image:url(\""+repimg+this.mainmenu.MnuImgBor+"\");background-repeat:repeat-y;"
		A+= "border-color:"+this.mainmenu.colContour+";border-style:solid;border-width:1px'>";

		for (var i=0;i<this.nb;i++)
		{
			if (this[i].lib=="-")
			{
				A += "	<TR>"
				A += "		<TD style='font-size:3px;border-style:none;margin:0px;height:"+(5)+"px ' colspan=2>"
				A += "			<DIV id='"+niv+"n"+i+"' style='background-color:"+this.mainmenu.colFond+";height:"+(5)+"px'>"
				A += "				<HR noshade style='color:"+this.mainmenu.colContour+";height:1px'>"
				A += "			</DIV>"
				A += "		</TD>"
				A += "	</TR>";
			}
			else
			{
				var img=repimg+this.mainmenu.ImageSiPasSousMenu;
				var css=this.mainmenu.cssTexte;
				if (this[i].mnu!="")
				{
					img=repimg+this.mainmenu.ImageSiSousMenu;
				}
				A += "	<TR>";
				A += "		<TD style='"+css+";border-width:0;margin:0px'>";
				A += "			<TABLE id='"+niv+"n"+i+"' cellpadding=0 cellspacing=0 border="+MnuCadInt
				A += "					style='background-color:"+this.mainmenu.colFond+";border-width:"+MnuCadInt+";border-style:solid;cursor:pointer;"+css+";color:"+this.mainmenu.colTextOff+";"

				if(this.mainmenu.MnuImgFondOption!="")
				{
					A+= "background-image:url(\""+repimg+this.mainmenu.MnuImgFondOption+"\");background-repeat:repeat;"
				}
				A += "'"

				A += "					width=100% height="+this[i].hauteur+" onmouseover='"+this.nom+".mmover("+i+")' onClick='"+this.nom+".mmclick(event)' >"
				A += "				<TR>"
				A += "					<TD NOWRAP id='"+niv+"n"+i+"td' style='border-style:solid;border-width:0;' width=100% valign=middle>"
				A += "						<FONT style='margin-left:"+this.mainmenu.MnuMarLib+"px;"+css+"'>"+this[i].lib+"</FONT>"
				A += "					</TD>"
				A += "					<TD style='border-style:solid;border-width:0;' width=10 align=right valign=middle>"
				A += "						<FONT style='margin-left:"+this.mainmenu.MnuMarLib+"px;"+css+"'></FONT>"
				A += "						<IMG src='"+img+"' ALIGN=MIDDLE>"
				A += "					</TD>"
				A += "				</TR>"
				A += "			</TABLE>"
				A += "		</TD>";
				A += "	</TR>";
			}
		}
		A += "</TABLE>"
	}
	else
	{
		var A="<table border=0 cellspacing=0 cellpadding=1><tr><td bgcolor="+this.mainmenu.colContour+">";
		A+="<TABLE border=0 cellpadding=0 cellspacing=0 bgcolor="+this.mainmenu.colFond+" width=100%>";
		for (var i=0;i<this.nb;i++)
		{
			if (this[i].lib=="-")
			{
				A+="<TR><TD><HR width=99% height=1%></TD></TR>";
			}
			else
			{
				var img=repimg+this.mainmenu.ImageSiPasSousMenu;
				if (this[i].mnu!="")
				{
					img=repimg+this.mainmenu.ImageSiSousMenu;
				}
				A+="<TR><TD><TABLE border=0 width=100% cellspacing=0><TR><TD><A href='javascript:"+this.nom+".mmclick()' onmouseover='"+this.nom+".mmover("+i+")'><SPAN style='background-color:"+this.mainmenu.colFond+this.mainmenu.cssTexte+"'>"+this[i].lib+"</SPAN></A></TD><TD width=10 align=right><IMG src='"+img+"' height="+this.hauteur+" width="+this.hauteur+"></TD></TR></TABLE></TD></TR>";
			}
		}
		A+="</TABLE></TD</TR></TABLE>"
	}

	var nivparent=niv;

	if (document.all)
	{
		document.all[nivparent].innerHTML=A;
		document.all[nivparent].style.top=Y;
		document.all[nivparent].style.left=X;
		document.all[nivparent].style.visibility="visible";
		this.X=X;
		this.Y=Y;
		this.width=document.all[nivparent].clientWidth;
	}
	else if (window.sidebar||document.getElementById)
	{
		document.getElementById(nivparent).innerHTML=A;
		document.getElementById(nivparent).style.top=Y;
		document.getElementById(nivparent).style.left=X;
		document.getElementById(nivparent).style.visibility="visible";

		this.X=X;
		this.Y=Y;

		this.width=0;
		for (var i=0;i<this.nb;i++)
		{
			var n=document.getElementById(niv+"n"+i).offsetWidth;
			if(this.width<n)
				this.width=n;

		}

	}

	if (document.layers)
	{
		document.layers[nivparent].left=X;
		document.layers[nivparent].top=Y;
		document.layers[nivparent].document.write(A);
		document.layers[nivparent].document.close();
		document.layers[nivparent].visibility="show";
		this.X=X;
		this.Y=Y;
		this.width=document.layers[nivparent].clip.width;

	}


}

function HideCalque(nom)
{
	if (document.all)
	{
		document.all[nom].style.visibility="hidden";
	}
	if (window.sidebar||document.getElementById)
	{
		document.getElementById(nom).style.visibility="hidden";
	}
	if (document.layers)
	{
		document.layers[nom].visibility="hide";
	}
}

function ShowCalque(nom)
{
	if (document.all)
	{
		document.all[nom].style.visibility="visible";
	}
	if (window.sidebar||document.getElementById)
	{
		document.getElementById(nom).style.visibility="visible";
	}
	if (document.layers)
	{
		document.layers[nom].visibility="show";
	}
}

function BGCalque(nom,BG,CC)
{
	if (document.all)
	{
		document.all[nom].style.backgroundColor=BG;
		document.all[nom].style.borderColor = CC;
	}
	if (window.sidebar||document.getElementById)
	{
		document.getElementById(nom).style.backgroundColor=BG;
		document.getElementById(nom).style.borderColor = CC;
	}
}

function FontCalque(nom,Font,n)
{
	if (document.all)
	{
		document.all[nom].style.color=Font;
	}
	if (window.sidebar||document.getElementById)
	{
		document.getElementById(nom).style.color=Font;
	}
}

function MoveCalque(nom,X,Y)
{
	if (document.all)
	{
		document.all[nom].style.top=Y;
		document.all[nom].style.left=X;
	}
	if (window.sidebar||document.getElementById)
	{
		document.getElementById(nom).style.top=Y;
		document.getElementById(nom).style.left=X;
	}
	if (document.layers)
	{
		document.layers[nom].top=Y;
		document.layers[nom].left=X;
	}
}

function GetLeft(nom)
{
	if (document.all)
	{
		return document.all[nom].style.left;
	}
	if (window.sidebar||document.getElementById)
	{
		return document.getElementById(nom).style.left
	}
	if (document.layers)
	{
		return document.layers[nom].left;
	}
}
