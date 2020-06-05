function showAutoCompleteError(autoCompleteIdText){

                var id = autoCompleteIdText.replace("Text_","");
                var strictMode = $("#strictMode_"+id).val();
                if(strictMode ==null || strictMode!="true") {
                    return
                }
                var content_id = "#"+$("#contentIdVarID_"+id).val();
                var parentOfAutoContainer = "content_"+id;
                var autoCompleteElement=$("#"+autoCompleteIdText);
				if(!$("."+autoCompleteIdText+"_strictMode").length && $("."+autoCompleteIdText+"_strictMode").length==0 && $("#"+autoCompleteIdText).val()) {
					$(autoCompleteElement).closest(".form-group").find("span").filter(function(){ return $(autoCompleteElement).text() == 'This field is required.'; }).remove();
					if($(autoCompleteElement).siblings('[id="auto-container"]').css('visibility')=='hidden' && !($(autoCompleteElement).closest(".form-group").find("span.help-block").length >=1))
					{
						$(autoCompleteElement).closest(".form-group").append("<span class='help-block fcr-imp "+autoCompleteIdText+"_strictMode' for='"+autoCompleteIdText+"' generated='true'>Please choose from list of values.</span>");
					}
					$(content_id).removeClass('success');
					$(content_id).addClass('error');
				}
				latestAutoCompleteEleId = $(autoCompleteElement).attr("id");
				if (jQuery("#"+parentOfAutoContainer+" #auto-container").css("visibility") === 'hidden') {
                    $(autoCompleteElement).val("");
                }
				$("#"+id).val("");
}

function autoCompleteTagScript(autoCompleteTagScriptInput){
	$(document).ready(function(){
	var autoCompleteId = "Text_"+autoCompleteTagScriptInput.id;
	var temp = $("#"+autoCompleteId).attr("data-showValueOnEditOrViewMode");
	var value = $("#"+autoCompleteId).attr("data-value");
	var itemLabel = $("#"+autoCompleteId).attr("data-itemLabel");
	var className = $("#"+autoCompleteId).attr("data-className");
	var labelVal=autoCompleteTagScriptInput.labelVal;
	applyTooltip(autoCompleteId, '');
    $("#Text_"+autoCompleteTagScriptInput.id).data("text-value",$("#Text_"+autoCompleteTagScriptInput.id).val());
	if(($("#Text_"+autoCompleteTagScriptInput.id).attr("name")==null||$("#Text_"+autoCompleteTagScriptInput.id).attr("name")=="")&&($("#Text_"+autoCompleteTagScriptInput.id).hasClass('required')))
	{
		$("#Text_"+autoCompleteTagScriptInput.id).attr("name","XText_"+autoCompleteTagScriptInput.id);

	}
	
	if(labelVal=="" && value && itemLabel && className && (temp=="true")){
		$.ajax({
			url : getContextPath()+"/app/autocomplete/getAutoCompleteValue",
			type: 'post',
			data : ({
				id:value,
				showLabel:itemLabel,
				className : className
			}),
			success : function(data) {
				if(data){
					$("#"+autoCompleteId).val(data);
				}
			}
		});
	}

	var strictMode = $("#strictMode_"+autoCompleteTagScriptInput.id).val();
	if(strictMode && strictMode=="true") {
		$("#"+autoCompleteId).on("focusout", function(event) {
			var id = $(event.target).attr("id").replace("Text_","");
			var parentOfAutoContainer = "content_"+id;
			var lovClicked = $("#lovClicked_"+id).val();
			if($(event.relatedTarget).hasClass("swFB")){
				return;
			}
			if(!lovClicked || lovClicked=="false" || ($("#Text_"+id).data("text-value")!=null && $("#Text_"+id).val()!=$("#Text_"+id).data("text-value"))) {
			    showAutoCompleteError(autoCompleteId);
			}
		});
	}

});
}
var latestAutoCompleteEleId="";
var colWidth=0;
var spanVar = 0;
var textId ;
var plainId ;
var  value1;
var value2;
var value3;
var value4;
var currListItem;
var currListItemIndex;
var countryId="";
var stateId="";
var cityId="";
var inputTag_id;

		function loadData(obj, pm_value, pm_id, flag,page,minCharsToBeginSearch,isPrevNext) {
			//'this' is same map as autoCompleteTagScriptInput
				value1=obj;
				value2=pm_value;
				value3=pm_id;
				value4=flag;
				if(value3!=undefined)
					inputTag_id = this.id;

				var count=0;
				var idCurr=pm_id.split("Text_")[1];
				currListItem="listitem_"+idCurr;
				var listViewSuffix= $("#idVarID_"+idCurr).val();
				var listview = $("#listview_"+listViewSuffix);
				var isSearchable = false;
				var nonWhiteSpacePattern = new RegExp(/\S/);

				var id = $("#id input").val();
				if (!id) {
					id = $('input[name="id"]').val();
				}
				var enUri = this.currentEntityClassName;

				s_cols = $("#searchColListVarID_"+idCurr).val();
				i_val =  $("#itemValueVarID_"+idCurr).val();
				i_label =  $("#itemLabelVarID_"+idCurr).val();
				cName =  $("#classNameVarID_"+idCurr).val();
				content_id="#"+$("#contentIdVarID_"+idCurr).val();
				itemsList=$("#items_"+idCurr).val();

				//custom Controller
				var customControllerVar = $("#"+pm_id).attr("data-custom-controller");
				if(customControllerVar){
					var url = getContextPath()+'/app';
					var path = customControllerVar;
					var customURL = url+path;
				}else{
					var customURL = getContextPath()+"/app/autocomplete/populate";
				}
				var strictSearchOnitemsList = $("#strictSearchOnitemsList_"+idCurr).val();
				var containsSearchEnabled = $("#containsSearchEnabledID_"+idCurr).val();

				var additionalData = ({});
				var additionalDataFunc = window[this.additionalDataCollectionFunction];
				if(typeof additionalDataFunc ==='function') {
					additionalData = additionalDataFunc.apply(null,[this.additionalDataCollectionFunction_params]);
					}
				if(typeof additionalData === 'undefined'){
					additionalData = ({});
				}

				textId=content_id;
				plainId=idCurr;

				var jsonData = ({
					searchCol : s_cols,
					itemVal : i_val,
					value : pm_value,
					className : cName,
					loadApprovedEntityFlag : flag,
					idCurr : idCurr,
					i_label:i_label,
					content_id : content_id,
					page:page,
					entity_id:id,
					currentEntityClassName:enUri,
					itemsList:itemsList,
					strictSearchOnitemsList:strictSearchOnitemsList,
					containsSearchEnabled : containsSearchEnabled
					});
				var parentId=this.parentId;
				if(parentId)
					{
						var parentIdValue=$('#'+parentId).val();
					}
				var parentCol=this.parentCol;
				var emptyParentErrorMessage=this.emptyParentErrorMsg;
				if(parentCol && !parentIdValue)
					{
					$.sticky(
							emptyParentErrorMessage,
							{
								autoclose : 2000,
								position : "top-right",
								type : "st-error"
							});
					return false;
					}

				if(parentId && parentCol && emptyParentErrorMessage){
					var parentDataJson = ({parentId:parentIdValue,
											parentCol:parentCol});
					$.extend( true, jsonData, parentDataJson);
				}
				$.extend( true, jsonData, additionalData );
				if(pm_value.length >= minCharsToBeginSearch && nonWhiteSpacePattern.test(pm_value)){
					isSearchable = true;
				}else{
					hideAutoCompleteMenu();
				}
				var showResults=$("#Text_"+this.id).data("showResults");
				clearTimeout(showResults);

				if(!isSearchable){
					return;
				}
				var that = this;//same map as autoCompleteTagScriptInput
				showResults= setTimeout(function(){
				$.ajax({
					url : customURL,
					type : 'POST',
					data : jsonData,
					success : function(data) {
                        var tableData=data.d;
						var table;
						if(tableData != null && tableData != undefined){
							var colNames=data.scl;
							var colHead=data.colh
							spanVar=12/colNames.length;
							var widthSpan=0;
							var spanVar1=1;
							//var searchColContainsId=false;
							if(tableData.length>0)
							{
								spanVar1=spanVar1+colNames.length;
								if(spanVar1>=2)
								{
									widthSpan=120*spanVar1;
								}
								else
								{
									widthSpan=400;
								}
							}
							if(widthSpan<300)
							{
								widthSpan=300;
							}



							table="";
							var k;

							table=table+"<div id='autocompleteDiv'><ul id='holder' class='twocolumn' style=\"min-width:"+widthSpan+"px;\">";
							if(data.s==0)
							{
							    table=table+"<span id="+"listitem_" +data.ic+"><div class='alert alert-danger reset-m p-2'>"+jQuery.i18n.prop("autocomplete_no_data")+"</div></span>"
							}
							else
							{
								table=table+"<span id=\"listitem_"+data.ic+"\"><div class='eo-eo-eo p-l5 p-r5'><div class='row'>";
								for(k=0;k<colHead.length;k++)
								{

									table=table+"<div class='col-sm-"+spanVar+"'>"+colHead[k]+"</div>";
								}
								table=table+"</div></div></span>";
								var i;
								for(i=0;i<tableData.length;i++)
								{
									var j;
									var fnArg=[tableData[i][data.il],tableData[i][data.iv],data.ic];
									var jk;
									var patt1=/'/g;
									for(jk=0;jk<3;jk++)
									{

									    if(fnArg[jk]!=null && String(fnArg[jk]).indexOf('\'') > -1)
									    {

									        fnArg[jk]=fnArg[jk].replace(patt1,"\\'");
									    }
									}

									table=table+'<li id="listitem_'+data.ic+i+'" style="min-width:'+widthSpan+'px;" username="'+fnArg[0]+'" userid="'+fnArg[1]+'" idForHiddenFieldToSet="'+fnArg[2]+'">';
									table=table+"<a id='listitem_"+data.ic+i+"a' onclick=\"myFunc('"+fnArg[0]+"', '"+fnArg[1]+"' , '"+fnArg[2]+"', this.parentElement);\">"
									table=table+"<div class='row'>"
									for(j=0;j<colNames.length;j++)
									{
										table=table+"<div  class='col-sm-"+spanVar+"'>"+tableData[i][colNames[j]]+"</div>";
									}
									table=table+"</div></a></li>";
								}
								table=table+"<li class=\"buttonList\" style=\"min-width:"+widthSpan+"px;\"><div class=\"row\" align=\"center\" id=\"buttonlist\">";
								if(data.s!=null)
								{
									var size=parseInt(data.s);
									if(size>3)
									{
										var x=Math.ceil((parseFloat(size/3)-1));
										table=table+"<input type=\"button\" value=\"<<\" id=\" 1\" class=\"swFB\" onclick=\"paginate_func(0,this);\" />"
										if(parseInt(data.p)==0)
										{
											table=table+"<input type=\"button\" value=\"<\" id=\" paginate\" class=\"swFB\" onclick=\"paginate_func('backward',this)\" disabled=\"disabled\" />";
										}
										else{
											table=table+"<input type=\"button\" value=\"<\" id=\" paginate\" class=\"swFB\" onclick=\"paginate_func('backward',this)\" />";
										}
										var j=0;
										var y=0.00;
										if(parseInt(data.p)%6>=0 && parseInt(data.p)/6>=1)
										{
											j=parseInt(data.p)/6*6;
											y=parseFloat(j);
										}
										var i;
										for(i=y;(i <= (Math.ceil(parseFloat(size) / 3 - 1) + y) && i < 6 + y) && j <= Math.ceil(parseFloat( size) / 3 - 1);i++)
										{
											if(parseInt(data.p)==parseInt(i))
											{
												table=table+"<input type=\"button\" value=\""+parseInt(j + 1)+"\" id=\"active\" class=\"swFB\" onclick=\"paginate_func("+j+",this);\" />";
											}
											else
											{
												table=table+"<input type=\"button\" value=\""+parseInt(j + 1)+"\" class=\"swFB\" onclick=\"paginate_func("+j+",this);\" />";
											}
											j++;
										}
										if(parseInt(data.p)==x)
										{
											table=table+"<input type=\"button\" value=\">\" id=\"paginate\" class=\"swFB\" onclick=\"paginate_func('forward',this)\" disabled=\"disabled\" />";
										}
										else
										{
											table=table+"<input type=\"button\" value=\">\" id=\"paginate\" class=\"swFB\" onclick=\"paginate_func('forward',this)\" />";
										}
										table=table+"<input type=\"button\" value=\">>\" id="+j+" class=\"swFB\" onclick=\"paginate_func("+x+",this)\" />";
										table=table+"<input type=\"text\" onkeyup=\"paginate_func_textBox("+x+",event,this)\" class=\"textbox_Pagination removeAutocompleteBottomClass \" id=\"textBox\" style=\"width:45px;\" />";
										table=table+"<span  class=\"glyphicon glyphicon-search\" onclick=\"paginate_func_textBox("+x+",event,this)\"></span>";
									}
								}
								table=table+"<div class='pull-right block-in'><input type=\"button\" value='&times;' id=\"close-auto-co\" class='btn btn-xs removeAutocompleteBottomClass' onkeydown=\"if(event.keyCode == 13) {hideAutoCompleteMenu($(this));  }\" onclick=\"hideAutoCompleteMenu($(this))\" onblur=\"hideAutoCompleteMenu($(this))\" /></div>"
								table=table+"</div></div></li>";
							}
							table=table+"</ul></div>";
						} else{
							table = data;
						}
						$("#Text_"+that.id).off("keyup");
						$("#Text_"+that.id).off("keydown");

						//var availableTags = data;
						var id = "#" + idCurr;
						var temp=$('<div></div>').append(table).find('#autocompleteDiv');
						var holder = temp.html();
						colWidth = temp.find('#colWidth').attr('title');
						document.getElementById('idDataFound_'+idCurr).value = temp.find('#idDataFound').attr('title');
						$(content_id).find("#auto-container").empty();
						$(content_id).find("#auto-container").append(holder);
						showMenu_autoComplete(content_id,that.id);
						$(document).bind( 'mousedown',hideAutoComplete);

						$(window).on("scroll",function(){hideAutoCompleteMenu()});
						currListItemIndex =0;
					/* 	$("#listitem_" + idCurr+"0a").focus(); */
						var strictMode = $("#strictMode_"+idCurr+"").val();
						if(strictMode && strictMode=="true") {
							var currentVal = $("#"+pm_id).val().trim();
							/*var valueChanged = true;

							 $("[id^='listitem_"+idCurr+"']").each(function() {
								var currentObj = $(this);
								var text = currentObj.text().trim();
								if(text==currentVal) {
									valueChanged = false;
								}
							});
							if(valueChanged) {*/
								$("#lovClicked_"+idCurr).val("false");
							//}
							$("."+pm_id+"_strictMode").remove();
						}else if(strictMode && strictMode=="false"){
							myFunc(jsonData.value,jsonData.value,idCurr,null,false);
						}
						if(isPrevNext) {
						$("input#Text_"+idCurr).val(pm_value);
						}
						$("input#Text_"+idCurr).focus();

						$("#Text_"+that.id).keydown(function(evt) {
						  if(evt.which==27 ){
							  hideAutoCompleteMenu();
						  }
						 // up arrow key pressed
							 if(evt.which==38 ){
								 var prevElementExist=false;
						if($("li#"+currListItem+currListItemIndex).prev("li#"+currListItem+(currListItemIndex-1)).find("a#"+currListItem+(currListItemIndex-1)+"a").length >0){

									 prevElementExist=true;
								 }

						 currListItemIndex--;
								 if(prevElementExist || ($("li#"+currListItem+currListItemIndex).length>0 && prevElementExist==false)){
								 $("#"+currListItem+(currListItemIndex-1)).focus();
								 $("#"+currListItem+currListItemIndex).css("background","none");
								 $("#"+currListItem+(currListItemIndex-1)).css("background","#86bd6f");
								 }

							/* 	 var newId= $("#"+currListItem+(currListItemIndex-1)+"a");
								 if(newId){
									 currListItemIndex--;
									 $("#"+currListItem+currListItemIndex+"a").focus();
								 } */
						}

						// down arrow key pressed
						 else if(evt.which==40 ){
						var nextElementExist=false;
							 if($("li#"+currListItem+currListItemIndex).next("li#"+currListItem+(currListItemIndex+1)).find("a#"+currListItem+(currListItemIndex+1)+"a").length >0){
								 nextElementExist=true;
							 }

							 if(nextElementExist  || ($("li#"+currListItem+currListItemIndex).length>0 && nextElementExist==false)){
							 $("#"+currListItem+currListItemIndex).focus();
							 $("#"+currListItem+(currListItemIndex-1)).css("background","none");
							 $("#"+currListItem+currListItemIndex).css("background","#86bd6f");

							 }
							 currListItemIndex++;
							}
							//enter key pressed
						 else if(evt.which==13  && (!$("#Text_"+that.id).val())){
							 var tempIndex=currListItemIndex-1;
							 hideAutoCompleteMenu();
							 $("#Text_"+that.id).focus();
						 }

						 else if(evt.which==13  && $("#Text_"+that.id).val()!=""){
							 var tempIndex=currListItemIndex-1;
							 var element=$("#"+currListItem+tempIndex);
							 if(element.length==0)return;
							 myFunc(element.attr('username'),element.attr('userId'),element.attr('idForHiddenFieldToSet'),element,true);
							 hideAutoCompleteMenu();
							 $("#Text_"+that.id).focus();

						 } else if(evt.which==9){
							 var noOfRecord = $("#"+currListItem).siblings('li').length-1;
							 if(noOfRecord<0){
								hideAutoCompleteMenu();
							 } else if(noOfRecord==1 && jQuery("#content_"+that.id+" #auto-container").css("visibility")!=='hidden'){
								tempIndex=0;
								var element=$("#"+currListItem+tempIndex);
								myFunc(element.attr('username'),element.attr('userId'),element.attr('idForHiddenFieldToSet'),element,true);
								hideAutoCompleteMenu();
								$("#Text_"+that.id).focus();
							 }
                            if($("#Text_"+that.id).data("text-value")!=null && $("#Text_"+that.id).val()!=$("#Text_"+that.id).data("text-value")){
                                showAutoCompleteError("Text_"+that.id);
                            }
						 }
							//backspace pressed
						});
						return false;
					}
				});
			}, 1000);
			$("#Text_"+this.id).data("showResults",showResults);

		}

 function showMenu_autoComplete(content_id,autoCompleteInput_Id) {
	 var autoContainerStyle = new Map();

	 var elementPosition = document.getElementById("Text_"+autoCompleteInput_Id).getBoundingClientRect();
		 if($(window).outerHeight() < (elementPosition.bottom + $(content_id).find("#auto-container").outerHeight())){
			 autoContainerStyle.top = (elementPosition.top -  $(content_id).find("#auto-container").outerHeight())+"px";
		 }
		 else
			 {
			 autoContainerStyle.top = (elementPosition.top + $(content_id).find(".auto-complete-input").outerHeight())+"px";
			 }

	if($(window).outerWidth()<elementPosition.left+$(content_id).find("#auto-container").outerWidth()){
		var autoContainerStyleLeft = (elementPosition.left-($(content_id).find("#auto-container").outerWidth()-elementPosition.width));
		if(autoContainerStyleLeft<0){
		    autoContainerStyleLeft=0;
		}
		autoContainerStyle.left = autoContainerStyleLeft+"px";
	}else{
		autoContainerStyle.left = elementPosition.left;
	}


	autoContainerStyle.visibility='visible';
	autoContainerStyle["word-break"]='break-all';
	$(textId).find("#auto-container").css(autoContainerStyle);
	 $('.modal-body').css("overflow", "unset");
// 	 $(textId).find("#auto-container").find(liId).focus();

	}
	function hideAutoCompleteMenu() {
		$(textId).find("#auto-container").css('visibility', 'hidden');
		$('#auto-container').parents('div.modal-body').css("overflow", "unset");
		if(latestAutoCompleteEleId != "") {
        	$("#"+latestAutoCompleteEleId).focusout();
        }
        latestAutoCompleteEleId = "";
		 $(document).unbind( 'mousedown',hideAutoComplete);
	}


     function paginate_func(page,thisactive)
     {  //'this' is same map as autoCompleteTagScriptInput
    	 var p = $(thisactive).parents('[id="buttonlist"]');
		 if(page=="forward"){
    		var forward_btnValue= p.find('[id=active]').val();
       		var page_num=parseInt(forward_btnValue,10) ;
      		window['loadData_'+inputTag_id](value1,value2,value3,value4,page_num,this.minCharsToBeginSearch,true);
    		 }
    	 else if(page=="backward"){
    		var prev_btnValue= p.find('[id=active]').val();
			var page_num=parseInt(prev_btnValue,10)-2;
			window['loadData_'+inputTag_id](value1,value2,value3,value4,page_num,this.minCharsToBeginSearch,true);
		 }

    	 else {
			window['loadData_'+inputTag_id](value1,value2,value3,value4,page,this.minCharsToBeginSearch,true);
    	 }
     }

	 function paginate_func_textBox(size,event,this_input)
	 {


		//'this' is same map as autoCompleteTagScriptInput
		if(event.keyCode == 13 ||event.type=='click') {
			 var page=$(this_input).parents('ul').find('[id="textBox"]').val()-1;

		 if(parseInt(page)==-1 || parseInt(page)>parseInt(size))
			 {
			 window['loadData_'+inputTag_id](value1,value2,value3,value4,0,this.minCharsToBeginSearch,false);


			 }
		 else if(isNaN(page)){
			 window['loadData_'+inputTag_id](value1,value2,value3,value4,0,this.minCharsToBeginSearch,false);


		 }
		 else
			 {
			 window['loadData_'+inputTag_id](value1,value2,value3,value4,page,this.minCharsToBeginSearch,false);

			 }
	 }
			    }

	  $("#Text_"+this.id).dblclick(function()
			 {
		 window['loadData_'+inputTag_id](this,this.value,this.id, this.loadApprovedEntityFlag,0,this.minCharsToBeginSearch,false);
			 });

	  function hideAutoComplete(event){
			if ($(event.target).parents("#auto-container").length==0) {
								 hideAutoCompleteMenu();
							 }
		}
	 function myFunc(a,b,c,d,e)
		{
			if(d){
		 		$(d).addClass('autoCompleteSelectedItem');
		 	}

			if(e==null || e=='undefined'){
				e=true;
			}
			document.getElementById("Text_"+c).value=a;
			document.getElementById(c).value=b;

			$("#Text_"+c).focus();
			var event = $("#onSelectEvent_"+plainId).val();
			var id = $("#idVarID_"+plainId).val();
			var found = $("#idDataFound_"+plainId).val();
			if(!e){
			found=1;
			}
			if(event != null && event != '' && found != "0")
				{
				$('#'+id).trigger(event,d);
				}
			$("#Text_"+c).data("text-value",a);
			$("#lovClicked_"+c).val("true");
			$(".Text_"+c+"_strictMode").remove();
			$("#Text_"+c).parents('.form-group').removeClass('error');
			//$("#Text_"+c).valid();
			$("#active").removeAttr("id");
			if(e){
			 /* keyPressed =false; */
			$('#content_'+c +' #holder').hide();
			$("#Text_"+c).blur();
			$('.tooltip').removeClass('in');//PDDEV-17316 for removing tooltip.
			}
		}
