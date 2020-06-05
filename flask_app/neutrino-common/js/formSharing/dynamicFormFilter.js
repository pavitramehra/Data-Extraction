$(document).ready(function() {
     $('#filterPreviewTab').click(function(event){
	        if ($(this).hasClass('disabled')) {
	            return false;
	        }
	    });
	  var selectedForms=$("#dynamicForms").val();
	  if(selectedForms==null)
	  {
		  $('#filterPreviewTab').addClass("disabled");
      }

	  if($("#no-dynamic-form-err").length!=0){
		  try {
			  $("#no-dynamic-form-err").append(label.dynamicform.nodynamicform.exists);
			}
			catch(err) {
				$("#no-dynamic-form-err").append("Can't create dynamic form filter as no dynamic form exists in the system for this module.");
			}
	  }

      if(viewMode != "true" && edit != "true"){
          if(isCreateDyFilterBtnClicked != "true"){
                       var sourceProductId = $("#dynamicFormFilterSourceProduct").val();
                       loadDynamicFormsBySourceProduct(sourceProductId);
          }
          $("#dynamicFormFilterSourceProduct").on("change",function(){
                 var sourceProductId = $("#dynamicFormFilterSourceProduct").val();
                 loadDynamicFormsBySourceProduct(sourceProductId);
          });
     }
});


function createDyFilter()
{

	if($("#dynamicFormSelection").valid())
	{
		  var selectedIds=JSON.stringify($("#dynamicForms").val());
		  var forms={selectedForms:selectedIds}


		  jQuery.ajax({
              url : getContextPath() + "/app/DynamicFormFilter/createFilter",
              type : "POST",
              data : forms,
              success : function(data) {
            	  jQuery("#filterCreationTab").html(data);
            	  $('#filterPreviewTab').removeClass("disabled");
            	  $('#filterFormSelectionTab').removeClass("active");
            	  $('#filterFormTabs a:last').tab('show');
              },
              error : function(xhr, textStatus, errorThrown) {
                   //alert("Error");
              }
        });
	}
}

function importForm() {
    var importFormSourceProductId = $("#importFormSourceProduct").val();
	if ($("#formNameModalForm").valid()
			&& validateImportFormName($("#importFormName").val(),importFormSourceProductId)) {
		var id = $("#filterFormTabstab1").data("filterId");
		var url = getContextPath() + "/app/DynamicFormFilter/import/" + id;
		$("#csrfInput").val(getCsrfTokenValue());
		$("#importFormSourceProductId").val(importFormSourceProductId);
		$("#formNameModalForm").attr("action", url);
		$("#formNameModalForm").submit();
	}

}

function validateImportFormName(formname,importFormSourceProductId) {
	var returnflag = false;
	jQuery.ajax({
		async : false,
		url : getContextPath() + "/app/dynamicForm/validateFormDetail/"
				+ formname,
		type : "POST",
		data : {importFormSourceProductId:importFormSourceProductId},
		success : function(response) {
			if (response == "valid") {
				returnflag = true;
			}

			else {
				$("#import-form-name-error-message").show();
				returnflag = false;
			}
		},
		error : function(xhr, textStatus, errorThrown) {
			returnflag = false;
			/* alert("Error"); */
		}
	});
	return returnflag;
}

function openFormForFieldSelection()
{

	if($("#formFieldSelection").valid())
	{
		  var selectedIds=$("#selectedDynamicForm").val();
		  var formData={formId:selectedIds};
		  var selectedFormName=$("#selectedDynamicForm option:selected").text().trim();
		  jQuery.ajax({
              url : getContextPath() + "/app/DynamicFormFilter/displayForm",
              type : "POST",
              data : formData,
              success : function(data) {
                  jQuery("#formDisplayModalBody").html(data);
                  $("#selectedFormNameInHeader").html(selectedFormName);
                  $("#uiMetaDataVo_"+formKey).find("[name^='uiComponents'][name$='.id'][type='hidden']").not( $("[name*=phoneNumberVO]")).each(function(){
                      var parentFieldKeyVal = $(this).next().next().next().next().val();
                      if(parentFieldKeyVal==""){
                          $(this).after("<div class='row'>" +
                                "<input type='checkbox' fieldSelector='true' value="+$(this).val()+"  checked> " +
                                "</div>");
                      }
                  });
                  showFormModal();
              },
              error : function(xhr, textStatus, errorThrown) {
            	  new PNotify({
	     				title : 'Error',
	     				text : some_errror_occured,
	     				type : 'error',
	     				opacity : .8
	     			});
              }
        });
	}
}
function addAllFieldsFromAllForms()
{

	  jQuery.ajax({
          url : getContextPath() + "/app/dynamicForm/addAllComponents",
          type : "POST",
          success : function(data) {

        	  var url = getContextPath()+"/app/dynamicForm/refreshPreviewSection";
        		$("#preview-section").load(url,{viewMode : viewMode}, function() {
        			addElementSelector();
        		});
          },
          error : function(xhr, textStatus, errorThrown) {
        	  new PNotify({
     				title : 'Error',
     				text : some_errror_occured,
     				type : 'error',
     				opacity : .8
     			  });
          }
    });
}
function showFormModal()
{
	$("#formDisplayModal").modal('show');

}
function showformNameInputModal()
{
	$("#formNameInputModal").modal('show');
}
function hideFormNameModal()
{
	$("#formNameInputModal").modal('hide');
}
function hideFormModal()
{
	$("#formDisplayModal").modal('hide');
}
function selectAndRefreshForm()
{

	var dataToSend={};
	var selectedFields=[];
	var selectedFormName=$("#selectedDynamicForm option:selected").text().trim();
	$("#uiMetaDataVo_"+formKey).find("[fieldSelector='true']")
	.each(function()
	{
		if($(this).prop("checked"))
		{

			selectedFields.push($(this).val());
		}

	});
	$("#uiMetaDataVo_"+formKey).find("[name^='uiComponents'][name$='.parentFieldKey'][type='hidden']").each(function(){
        if($(this).val()!=""){
            if(selectedFields.indexOf($(this).val()) > -1){
                selectedFields.push($(this).prev().prev().prev().prev().val());
            }
        }
    });

	dataToSend["selectedFields"]=selectedFields.toString();
	dataToSend["selectedFormId"]=$("#selectedDynamicForm").val();
	hideFormModal();
	  jQuery.ajax({
          url : getContextPath() + "/app/dynamicForm/addMultipleComponents",
          type : "POST",
          data : dataToSend,
          success : function(data) {

        	  var url = getContextPath()+"/app/dynamicForm/refreshPreviewSection";
        		$("#preview-section").load(url,{viewMode : viewMode}, function() {
        			addElementSelector();
        		});
          },
          error : function(xhr, textStatus, errorThrown) {
        	  	new PNotify({
     				title : 'Error',
     				text : some_errror_occured,
     				type : 'error',
     				opacity : .8
     			 });
          }
    });



}

function loadDynamicFormsBySourceProduct(sourceProductId){
    if(sourceProductId !== undefined && sourceProductId !==""){

      var viewMode = false;
      jQuery.ajax({
                  url : getContextPath() + "/app/DynamicFormFilter/loadDynamicFormsBySourceProduct",
                  type : "POST",
                  data : {sourceProductId:sourceProductId,viewMode : viewMode},
                  success : function(data) {
                        $("#dynamicFormsViewDiv").html(data);
                  },
                  error : function(xhr, textStatus, errorThrown) {
                        new PNotify({
                            title : 'Error',
                            text : some_errror_occured,
                            type : 'error',
                            opacity : .8
                         });
                  }
            });
    }
}