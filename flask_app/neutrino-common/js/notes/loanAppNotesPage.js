
$.extend( $.fn.dataTableExt.oSort, {


	"date-my-asc": function ( a, b ) {

		a = a.trim().replace("<div style='display:none'>","").replace("</div>","");
		b = b.trim().replace("<div style='display:none'>","").replace("</div>","");
		a=a.split("$")[1].split(" ")[0]+"T"+a.split("$")[1].split(" ")[1];
		b=b.split("$")[1].split(" ")[0]+"T"+b.split("$")[1].split(" ")[1];
		var datea=Date.parse(a.trim()+".000");
		var dateb=Date.parse(b.trim()+".000");


		return ((datea < dateb) ? -1 : ((datea > dateb) ? 1 : 0));
	},

	"date-my-desc": function ( a, b ) {

		a = a.trim().replace("<div style='display:none'>","").replace("</div>","");
		b = b.trim().replace("<div style='display:none'>","").replace("</div>","");
		a=a.split("$")[1].split(" ")[0]+"T"+a.split("$")[1].split(" ")[1];
		b=b.split("$")[1].split(" ")[0]+"T"+b.split("$")[1].split(" ")[1];
		var datea=Date.parse(a.trim()+".000");
		var dateb=Date.parse(b.trim()+".000");
		return ((datea < dateb) ? 1 : ((datea > dateb) ? -1 : 0));
	},

	"html-my-asc": function ( a, b ) {
		var	expReg=new RegExp(/<\/?[^>]+(>|$)/g);
		if(expReg.test(a))
		{
			a=a.replace(expReg, "");
			b=b.replace(expReg, "");

		}
		a = a.trim();
		b = b.trim();



		return a.localeCompare(b);
	},

	"html-my-desc": function ( a, b ) {
		var	expReg=new RegExp(/<\/?[^>]+(>|$)/g);
		if(expReg.test(a))
		{
			a=a.replace(expReg, "");
			b=b.replace(expReg, "");

		}
		a = a.trim();
		b = b.trim();



		return b.localeCompare(a);
	}
} );
function format ( d ) {
    // `d` is the original data object for the row and index is hardcoded

    return '<div style="word-wrap: break-word;" class="modal-body modal-content " width="100%" >'+d[3]+'</div>';
}

function viewMoreLess(substringNo,data,label,label2)
{

if(data.length>substringNo)
	{
		return "<div class =\"viewMore\">"+data.substring(0, substringNo-7)+" <a  onclick=\"viewMore('"+data+"','"+(substringNo-7)+"','"+label+"','"+label2+"')\" >"+label+"</a><div style='display:none'>"+data.substring(substringNo+1-7, data.length)+"</div>"+"</div>";
	}
	else
	{
		return data;
	}
}

function viewMore(data,substringNo,labelMore,labelLess)
{


	if(event.target.parentElement.className=="viewMore")
	{
		event.target.parentElement.className	="viewLess";
		event.target.parentElement.innerHTML=data+"&nbsp<a  onclick=\"viewMore('"+data+"','"+substringNo+"','"+labelMore+"','"+labelLess+"')\" >"+labelLess+"</a>";

	}
	else
	{
		event.target.parentElement.className="viewMore";
		event.target.parentElement.innerHTML=data.substring(0, substringNo)+"&nbsp<a  onclick=\"viewMore('"+data+"','"+substringNo+"','"+labelMore+"','"+labelLess+"')\" >"+labelMore+"</a>";

	}

}


	 function toEscapeHTMLAttrSearch(expReg,inputSearchTag,data)
    {
    if($(inputSearchTag).val()!=undefined){
        var term = $(inputSearchTag).val();
             for (var i = data.length - 1; i >= 0; i--) {
                if(expReg.test(data[i]))
                {
                    if(~data[i].replace(expReg, "").toLowerCase().indexOf(term.toLowerCase()))
                        return true;
                }
                    else
                {
                    if(~data[i].toLowerCase().indexOf(term.toLowerCase()))
                        return true;
                }
             }
              return false;
             }
             else
             {
             return true;
             }


    }
    function toEscapeHTMLAttrSearchMultiColumn(expReg,inputSearchTag,data,rowNo)
    {
if($(inputSearchTag).val()!=undefined){
        var term = $(inputSearchTag).val();

	                if(expReg.test(data[rowNo]))
	                {
	                    if(~data[rowNo].replace(expReg, "").toLowerCase().indexOf(term.toLowerCase()))
	                        return true;
                }
                else
                {
                    if(~data[rowNo].toLowerCase().indexOf(term.toLowerCase()))
                        return true;
                }


                 return false;
                 }
                 else
                 {
                 return true;
                 }
    }
	 $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
if(typeof(Handler)=="undefined")
		return toEscapeHTMLAttrSearch(new RegExp(/<\/?[^>]+(>|$)/g),$('#'+settings.nTable.id+'_filter input'),searchData);
			 else
			 	return toEscapeHTMLAttrSearchMultiColumn(new RegExp(/<\/?[^>]+(>|$)/g),$(Handler),searchData,Handler[0].id.split("_")[1]);

	});

	 function substringNo(meta,document,col)
	 {
	 	var width=$("#"+meta.settings.nTable.id).width();
            var rowWith=meta.settings.aoColumns[col].width;
            var elem=document.querySelector('#neutrino-body th,#neutrino-body td');
            var fontSize=getComputedStyle(elem).fontSize;
            return (width*rowWith.split("%")[0])*1.8181/(fontSize.split("px")[0]*100);
	 }