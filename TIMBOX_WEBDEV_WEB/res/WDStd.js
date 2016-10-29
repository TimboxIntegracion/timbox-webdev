//#14.00Af WDStd.js
//VersionVI: 30A150063j
// Le seul support technique disponible pour cette librairie est
// accessible a travers le service "Assistance Directe".

var CC_ACC=4;
var CO_FIN=1;
var CO_MOT=2;
var CO_CAS=4;
var RG_PRM=-0x80000000;
var RG_SUI=-0x7fffffff;

function EstChiffre(c)
{
	return (c>="0")&&(c<="9");
}

function ChaineConstruit(f)
{
	var p=0;
	while((p=f.indexOf("%",p))>=0)
	{
		var d=p+1;
		var i=d;
		var b=(f.charAt(i)=="%");
		if(b)i++;
		else while((i<f.length)&&EstChiffre(f.charAt(i)))i++;
		if(i>d)
		{
			var n=parseInt(f.substring(d,i));
			var r=((n>0)&&(n<arguments.length))?arguments[n]:(b?"%":"");
			f=f.substring(0,p)+r+f.substring(i,f.length);
			p+=r.length;
		}
		else p++;
	}
	return f;
}

function EstEspace(c)
{
	return ((c>"\x08")&&(c<"\x0e"))||(c==" ");
}

function SansEspace(s)
{
	var d=0;
	while((d<s.length)&&EstEspace(s.charAt(d)))d++;
	var f=s.length-1;
	while((f>d)&&EstEspace(s.charAt(f)))f--;
	return s.substring(d,f+1);
}

function CarSansAccent(c)
{
	if((c=="\x9f")||(c=="\xdd"))return "Y";
	if((c>"\xbf")&&(c<"\xc6"))return "A";
	if(c=="\xc7")return "C";
	if((c>"\xc7")&&(c<"\xcc"))return "E";
	if((c>"\xcb")&&(c<"\xd0"))return "I";
	if(c=="\xd0")return "D";
	if(c=="\xd1")return "N";
	if(((c>"\xd1")&&(c<"\xd7"))||(c=="\xd8"))return "O";
	if((c>"\xd8")&&(c<"\xdd"))return "U";
	if((c>"\xdf")&&(c<"\xe6"))return "a";
	if(c=="\xe7")return "c";
	if((c>"\xe7")&&(c<"\xec"))return "e";
	if((c>"\xeb")&&(c<"\xf0"))return "i";
	if(c=="\xf1")return "n";
	if(((c>"\xf1")&&(c<"\xf7"))||(c=="\xf8"))return "o";
	if((c>"\xf8")&&(c<"\xfd"))return "u";
	if((c=="\xfd")||(c=="\xff"))return "y";
	return c;
}

function EstPonctuation(c)
{
	return (c<"\t")||((c>"\r")&&(c<" "))||((c>" ")&&(c<"0"))||((c>"9")&&(c<"A"))||((c>"Z")&&(c<"a"))||((c>"z")&&(c<"\x83"))||((c>"\x83")&&(c<"\x8c"))||(c=="\x8d")||((c>"\x8e")&&(c<"\x99"))||(c=="\x9b")||(c=="\x9d")||((c>"\x9f")&&(c<"\xaa"))||((c>"\xaa")&&(c<"\xb2"))||((c>"\xb3")&&(c<"\xb9"))||(c=="\xbb")||(c=="\xbf")||(c=="\xd7")||(c=="\xf7");
}

function EstPonctuationOuEspace(c)
{
	return EstPonctuation(c)||EstEspace(c);
}

function ChaineFormate(s,o)
{
	var CC_ESP=1;
	var CC_PON=2;
	var CC_CAS=16;
	var CC_MAJ=32;
	var CC_MIN=64;
	if(typeof(s)==typeof(0))s+="";
	if(o&CC_ESP)s=SansEspace(s);
	if(o&CC_CAS+CC_MAJ)s=s.toUpperCase();
	if(o&CC_MIN)s=s.toLowerCase();
	if(!(o&(CC_PON+CC_ACC)))return s;
	var r = "";
	for(var i=0;i<s.length;i++)
	{
		var c=s.charAt(i);
		if(o&CC_ACC)c=CarSansAccent(c);
		var b=true;
		if((!(o&CC_PON))||(!EstPonctuationOuEspace(c)))r+=c;
	}
	return r;
}

function SansAccent(s)
{
	return ChaineFormate(s,CC_ACC);
}

function ExtraitNombre(s,d)
{
	while((d<s.length)&&(s.charAt(d)=="0"))d++;
	var f=d;
	while((f<s.length)&&EstChiffre(s.charAt(f)))f++;
	return s.substring(d,f);
}

function ResCompare(s1,s2)
{
	if(s1==s2)return 0;
	if(s1<s2)return -1;
	return 1;
}

function ChaineCompare(s1,s2,o)
{
	var CC_LEX=8;
	var CC_NUM=128;
	s1=ChaineFormate(s1,o);
	s2=ChaineFormate(s2,o);
	if(!(o&(CC_LEX+CC_NUM)))return ResCompare(s1,s2);
	var i=0;
	while((i<s1.length)&&(i<s2.length))
	{
		if(o&CC_NUM)
		{
			var v1=ExtraitNombre(s1,i);
			var v2=ExtraitNombre(s2,i);
			if ((v1!="")&&(v2!=""))
			{
				var n1=parseInt(v1);
				var n2=parseInt(v2);
				if(n1!=n2)return ResCompare(n1,n2);
			}
		}
		var c1=s1.charAt(i);
		var c2=s2.charAt(i);
		if(o&CC_LEX)
		{
			var d1=CarSansAccent(c1);
			var d2=CarSansAccent(c2);
			if(d1!=d2)return ResCompare(d1,d2);
		}
		if(c1!=c2)return ResCompare(c1,c2);
		i++;
	}
	return ResCompare(s1.length,s2.length);
}

function Position(s,r,i,o)
{
	if((i==null)||(i<0))i=1;
    var f=o&CO_FIN;
	if(i==0)i=f?s.length:1;
	if(i>s.length)return 0;
	var t=new Array();
	if(typeof(r)!=typeof(t))t[0]=r;else t=r;
    if(o&CO_CAS)
    {
        s=s.toUpperCase();
        for(var x=0;x<t.length;x++)t[x]=t[x].toUpperCase();
    }
    b=-1;
    c=false;
    for(var x=0;x<t.length;x++)
    {
        r=t[x];
        if(r!="")
        {
            var p=i-1;
            var d=p;
            while((d=f?s.lastIndexOf(r,p):s.indexOf(r,p))>-1)
            {
                var e=d+r.length;
                p=f?(d-1):e;
                if((!(o&CO_MOT))||(((d==0)||EstPonctuationOuEspace(s.charAt(d-1)))&&((e==s.length)||EstPonctuationOuEspace(s.charAt(e)))))
                {
                    c=true;
                    if(f?(d>b):((d>-1)&&((b<0)||(d<b))))b=d;
                    break;
                }
            }
        }
    }
    return c?(b+1):0;
}

function PositionOccurrence(s,r,i,o)
{
	var RG_DER=-0x7ffffffd;
	var RG_PRC=-0x7ffffffe;
	if(i==null)i=1;
    if((i<1)&&(i>RG_DER))return 0;
    var f=o&CO_FIN;
    if((i==RG_DER)||(i==RG_PRC))f=!f;
    if(f)o|=CO_FIN;
    if((i!=RG_SUI)&&(i!=RG_PRC))gp=f?(s.length):1;
    if (f && (gp == 0)) return 0;
    if (i <= RG_DER) i = 1;
    var n=0;
    var p=gp;
    while((n<i)&&((p=Position(s,r,gp,o))>0))
    {
        gp=p+(f?-1:((typeof(r)==typeof(""))?r.length:1));
        n++;
    }
    return (n<i)?0:p;
}

function ChaineOccurrence(s,r,o)
{
	var n=0;
	var p=PositionOccurrence(s,r,RG_PRM,o);
	while(p>0)
	{
		n++;
		p=PositionOccurrence(s,r,RG_SUI,o);
	}
	return n;
}

function VerifieExpressionReguliere(s,f)
{
	var e=new RegExp(f);
	var r=e.exec(s);
	var t=new Array();
	if(t[0]=(r!=null)&&(r.index==0)&&(r[0].length==s.length))for(var i=1;i<arguments.length-1;i++)t[i]=(i<r.length)?r[i]:"";
	return t;
}

function EstNumerique(v)
{
	return (!isNaN(v))||(!isNaN(parseFloat(v)));
}
