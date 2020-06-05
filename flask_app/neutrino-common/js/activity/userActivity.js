var taskIdForUserActivity = "";
$(document)
		.ready(
				function() {
					
					(function(){
						$.ajax({
							type : "GET",
							url : getContextPath() + "/app/useractivity/getParentId/" + id,
							dataType : 'json',
							data : {
								"currentEntityUri" : enUri
							},
							success : function(data) {
								idParent = data;
								retrieveComment();
							},
							error : function() {
								idParent = id;
								retrieveComment();
							}
						});
						
						/*
						 * check the actual target to avoid conflict with show event
						 * of tab with accordian's show event as tabs are also used
						 * in this accordian
						 */
						$('#commentAccordian').on('shown.bs.collapse', function(event) {
							if ($(event.target).is("div")) {
								retrieveComment();
							}
						});

				})();	
				
					if ($("#taskId").val() != undefined) {
						taskIdForUserActivity ="";//For Master-Notes, there is no use of taskId parameter...Refer NoteController.java
					} else if (typeof taskId != "undefined"){
						taskIdForUserActivity = taskId;
					}
					else {
						taskIdForUserActivity = "";
					}

					/* Code for comment */
					$("#comment_button").click(function() {
						$(this).hide();
						$("#comment_textarea").val("");
						$("#comment_area").show();
					});

					$("#icon_comment_refresh").click(function() {
						retrieveComment();

					});
					
					$("#icon_activity_stream_refresh").click(function() {
						retrievActivity();
					});

					$("#icon_loan_application_activity_refresh").click(function(){
					    retrievRuleExecutionResult();
					});

					$("#comment_cancel_button").click(function() {
						$("#comment_area").hide();
						$("#comment_button").show();
					});

					$('#comment_container').on(
							'mouseenter',
							".outerdiv",
							function() {
								$(this).find(".comment_toolbar").show();
								$(this).find(".innerdiv").css("background",
										"#F0F0F0");
							});
					$('#comment_container').on(
							'mouseleave',
							".outerdiv",
							function() {
								$(this).find(".comment_toolbar").hide();
								$(this).find(".innerdiv").css("background",
										"none");
							});

					/*
					 * $('#commentAccordian').on('hide', function() {
					 * $('#icon_plus_comment').toggleClass("glyphicon glyphicon-minus"); });
					 */
					$('#comment_container').on(
							'click',
							".delete_comment",
							function() {
								var commentId = $(this).parents(
										".comment_toolbar:first").find("input")
										.val();
								var topparent = $(this).parents(
										".outerdiv:first");
								deleteComment(commentId, topparent);
							});

					$('#comment_container').on(
							'click',
							".edit_comment",
							function() {
								var username = $(this).parents(
										".innerdiv:first").find(
										".comment_username").html();
								$(".comment_edit_username").html(username);

								var datetime = $(this).parents(
										".innerdiv:first").find(
										".comment_datetime").text();
								$(".comment_edit_datetime").text(datetime);

								var commentText = $(this).parents(
										".innerdiv:first")
										.find(".comment_text").text();
								$("#comment_edit_textarea").val(commentText);

								comment_edit_id = $(this).parents(
										".comment_toolbar:first").find("input")
										.val();

								$("#comment_edit_modal").modal("show");
							});

					/*---------------- Code for Notes--------------------------------- */

					var tiny = tinymce
							.init({
								selector : "#notes_textarea",
								theme : "advanced",
								theme_advanced_buttons1 : "bold,italic,underline,separator,fontsizeselect,forecolor,separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,bullist,numlist,undo,redo,link,unlink",
								theme_advanced_path : false,
								entity_encoding : "raw",
							   setup : function(ed){
						            var CW="C";                    // C= count characters - W= count words           
						           /* var mCh=$('#notes_textarea').attr('maxLength');                  // max  characters
						            var mWr=$('#notes_textarea').attr('maxLength'); */                 // max words
						            var text;
						            
						            //because we are not using @lob , and the limit of varchar2 in database is 3999
						            var totalLength = 3999;

						            ed.onKeyPress.add(function(ed,e)
						            {
						                var sH=tinymce.activeEditor.getContent();
						                var sW = (sH.replace(/(<([^>]+)>)/ig,""));
						                if (CW=="C")
						                {      
						                	// 8 : for 'BackSpace' , 46 : for 'Del' 
						                   /* if ( (sH.length>totalLength || sW.length>=mCh) && (e.keyCode != 8 && e.keyCode != 46)){  
						                       e.preventDefault();
						                    }*/
						                                        /*text="<b>You may NOT write more than "+mCh+" characters.</b>";*/
						                                        /*var leftChars = mCh - (sW.length);
						 						                text = ""+leftChars+" character(s) left.";*/
						 						               if (sH.length>totalLength){
						 						            	   text = "You can not add more characters because of extra styling.";
						 						               }	                
						 						                
						                }
						                else if(CW=="W")
						                {						                	
						                    /*if (sW.split(' ').length>mWr){                    
						                    return false;
						                    }*/
						                    /*text="<b>You may NOT write more than "+mWr+" words.</b>";
						                    var leftWords = mWr - (sW.split(' ').length);
								                text = ""+leftWords+" word(s) left.";*/
						                }        
						                                /*tinymce.DOM.setHTML(tinymce.DOM.get(tinyMCE.activeEditor.id + '_path_row'), text);*/
						                return false;
						            });
						                     }
						        });
					
					$('#notes_edit_modal').on(
							'shown.bs.modal',
							function() {

								tinyMCE.execCommand('mceAddControl', false,
										'notes_edit_textarea');
							});

					$('#notes_edit_modal')
							.on(
									'hidden',
									function(event) {

										if ($(event.target).attr('id') == "notes_edit_modal") {
											tinyMCE.execCommand(
													'mceRemoveControl', false,
													'notes_edit_textarea');
										}
									});
													

					$('body').on(
							'change',
							".notes_private_checkbox",
							function() {
								if ($(this).is(":checked")) {
									$(this).parents(".note_form_top").find(
											".allowed_users").show();
								} else {
									$(this).parents(".note_form_top").find(
											".allowed_users").hide();
											$(".multiselect-container li").each(function(){
								var i_ck = $(this).find("input[type='checkbox']");
								if(i_ck.is(":checked")){
							   i_ck.prop("checked",false); 
							}
							});
							$("#listOfAllowedUsers_edit option").each(function(){
							   $(this).removeAttr('selected');
							
							});	
							$("#listOfAllowedUsers_edit-control-group").find("button[type='button']").html("None selected <b class='caret'></b>");
								}
							});
					/* show note add form */
					$("#notes_button").click(function() {
						$(this).hide();
						$("#notes_title_input").val("");
						$("#notes_textarea").val("");
						$("#notes_area").show();
						tinyMCE.get('notes_textarea').setContent("");		
						$('#note_code').val('').trigger('chosen:updated');
						$('#removeFile').trigger('click');
						if($("#notes_add_checkbox").is(":checked"))
						{
							$("#notes_add_checkbox").prop('checked',false);
							$("#notes_add_checkbox").parents(".note_form_top").find(
											".allowed_users").hide();
							$(".multiselect-container li").each(function(){
								var i_ck = $(this).find("input[type='checkbox']");
								if(i_ck.is(":checked")){
							   i_ck.prop("checked",false); 
							}
							});		
							$("#listOfAllowedUsers-control-group").find("button[type='button']").html("None selected <b class='caret'></b>");
						}
						
					});

					$("#notes_cancel_button").click(function() {
						$("#notes_area").hide();
						$("#notes_button").show();
					});

					$("#icon_note_refresh").click(function() {
						retrieveNote();

					});
					$('#notes_container').on(
							'mouseenter',
							".outerdiv_notes",
							function() {
								$(this).find(".notes_toolbar").show();
								$(this).find(".innerdiv_notes").css(
										"background", "#F0F0F0");
							});

					$('#notes_container').on(
							'mouseleave',
							".outerdiv_notes",
							function() {
								$(this).find(".notes_toolbar").hide();
								$(this).find(".innerdiv_notes").css(
										"background", "none");
							});
					$('#notes_container').on(
							'click',
							".delete_note",
							function() {
								var noteId = $(this).parents(
										".notes_toolbar:first").find("input")
										.val();
								var topparent = $(this).parents(
										".outerdiv_notes:first");
								deleteNote(noteId, topparent);
							});

					$('#notes_container').on(
							'click',
							".edit_note",
							function() {

								notes_edit_id = $(this).parents(
										".notes_toolbar:first").find("input")
										.val();

								$.ajax({
									type : "POST",
									url : getContextPath()
											+ "/app/note/getNoteForEdit/"
											+ notes_edit_id,
									success : function(data) {

										$(".notes_edit_modal_body").html(data);
										$("#notes_edit_modal").modal("show");
										
										tinyMCE.execCommand('mceAddControl', false,'notes_edit_textarea');
									}
								});

								// editCheckBoxClicked();
							});
					// functions for tags
					$('#tag_li').click(function(e) {  
						retrieveTags();
					});

					/* COMMON FUNCTIONALITY FOR ALL TABS */
					$("#mainChildTabss i").not("#icon_comment_refresh").hide();

					$('a[data-toggle="tab"]')
							.on(
									'shown.bs.tab',
									function(e) {
										if ($(e.target).attr("href") == "#notes") {
											retrieveNote();
										} else if ($(e.target).attr("href") == "#loanAppNotes") {
											retrieveNoteForLoanApp();
										}else if ($(e.target).attr("href") == "#comments11") {
											retrieveComment();
										} else if ($(e.target).attr("href") == "#activity_stream") {
											retrievActivity();
										} else if ($(e.target).attr("href") == "#loan_application_activity_rule") {
											retrievRuleExecutionResult();
										} else if ($(e.target).attr("href") == "#entityHistory") {
											retrieveHistory();
										}
										$(e.target).find("i").show();
										$(e.relatedTarget).find("i").hide();

									});
					
					
				});

/* =========================================================================================== */
/* ================= JQUERY FUNCTIONS FOR COMMENTS ================== */
/* =========================================================================================== */

function closeCommentDialog() {
	$("#comment_edit_modal").modal("hide");
}

function editComment() {
	if ($("#comment_edit_textarea").val() != "") {
		
		if ($("#comment_edit_textarea").val().length <= 3) {
			$.sticky("Comment should contain more than 3 letters. ", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			
			return;
		}
		
		
		
		
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/comment/editcomment/"
					+ comment_edit_id,
			dataType : 'json',
			data : {
				"commentText" : $("#comment_edit_textarea").val(),
			},

			success : function(data) {
				closeCommentDialog();

				/*
				 * new PNotify({ title : success, text : commentEdit_success, type :
				 * success, pnotify_animate_speed : fadeOutduration, opacity :
				 * .8 });
				 */

				$("#comment_area").hide();
				$("#comment_button").show();
				retrieveComment();
				$("#comment_textarea").val("");

			},
			error : function() {
				closeCommentDialog();
				$("#comment_area").hide();
				$("#comment_button").show();
				retrieveComment();
				$("#comment_textarea").val("");
			}
		});
	} else {

		new PNotify({
			title : failure,
			text : comment_cantBlank,
			type : error,
			pnotify_animate_speed : fadeOutduration,
			opacity : .8
		});
	}
}

function deleteComment(commentId, topparent) {
	$.ajax({
		type : "POST",
		url : getContextPath() + "/app/comment/delcomment/" + commentId,
		success : function(data) {

			$(topparent).remove();
		},
		error : function() {
			new PNotify({
				title : failure,
				text : error_deletingComment,
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
		}
	});
}
function addComment() {

	if (idParent != null) {
	
		if ($("#comment_textarea").val() != "") {
			
			if ($("#comment_textarea").val().length <= 3) {
				
				
				new PNotify({
					title : failure,
					text : "Comment should contain more than 3 letters. ",
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
				});
				$("#comment_area").hide();
				$("#comment_button").show();
				return;
			}
			
			
			$.ajax({
				type : "POST",
				url : getContextPath() + "/app/comment/addcomment/" + idParent,
				dataType : 'json',
				data : {
					"commentText" : $("#comment_textarea").val(),
					"currentEntityUri" : enUri
				},
				success : function(data) {
					$("#comment_area").hide();
					$("#comment_button").show();
					retrieveComment();
				},
				error : function() {
					$("#comment_area").hide();
					$("#comment_button").show();
					retrieveComment();
				}
			});
		} else {
			$.sticky(please_enterComment, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});

		}
	} else {
		new PNotify({
			title : failure,
			text : error_addingComment,
			type : error,
			pnotify_animate_speed : fadeOutduration,
			opacity : .8
		});

	}

}

function retrieveComment() {
	if (idParent != null) {
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/comment/retrieveComment/" + idParent,
			data : {
				"currentEntityUri" : enUri
			},
			success : function(data) {
				$("#comment_container").html(data);
				$("#comment_container").scrollTop(1e4);
			},
			error : function(jqXHR, error, errorThrown) {
				new PNotify({
					title : failure,
					text : error_retrievingComment,
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
				});
			}
		});

	}
}

function showCommentArea() {

	$('#addcomment').show();
}
/* =========================================================================================== */
/* ================= JQUERY FUNCTIONS FOR NOTES ================== */
/* =========================================================================================== */
function closenotesDialog() {
	$("#notes_edit_modal").modal("hide");
	
}
function addNote() {
	
	if (id) {
		var noteText = tinyMCE.get('notes_textarea').getContent();
		if(noteText != undefined && noteText.length > 4000){
			$.sticky(note_code_text_length_alert, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
			
			return;
		}
	
		if ($("#note_code").val()) {
			
			if(checkFileTypesSupported($("#file"))){				
			
			var title=$("#notes_title_input").val();
			
			var formData = new FormData();
			var file=$("#file")[0].files[0];			
			if(file){
				formData.append("attachedFile",file);
			}
			formData.append("text",noteText);
			formData.append("currentEntityUri",enUri);
			formData.append("privateNote",$("#notes_add_checkbox").is(":checked"));
			if($('#listOfAllowedUsers').val() != null && $('#listOfAllowedUsers').val()!=""){
				formData.append("listOfAllowedUsers",$('#listOfAllowedUsers').val());
			}
			formData.append("title",title);
			formData.append("noteCode.id",$("#note_code").val());
			formData.append("taskId", taskIdForUserActivity);			
			
			$.ajax({
				traditional : true,
				type : "POST",
				url : getContextPath() + "/app/note/addnote/" + idParent,
				enctype : "multipart/form-data",
				data :formData,
				success : function(data) {
					$("#notes_area").hide();
					$("#notes_button").show();
					refreshNotes(data);

				},
				error : function() {
					new PNotify({
						title : failure,
						text : error_addingNote,
						type : error,
						pnotify_animate_speed : fadeOutduration,
						opacity : .8
					});
				},
				processData : false,
				contentType : false
			});
			}
			else{
				 var pnvar = new PNotify({
					 	delay : 5000,
						title : failure,
						text : attachment_invalidFileType+''+supportedFileTypes,
						type : error,
						pnotify_animate_speed : fadeOutduration,
						opacity : .8
				  });
				  pnvar.css("word-wrap","break-word");				
			}
		} else {
			$.sticky(title_cantEmpty, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});

		}
	} else {
		new PNotify({
			title : failure,
			text : ownerId_notPresent,
			type : error,
			pnotify_animate_speed : fadeOutduration,
			opacity : .8
		});

	}
}

function refreshNotes(data) {
	$("#notes_container").html(data);
	$("#notes_container").scrollTop(1e4);
}

function refreshNotesAreaDiv(data) {
	$("#notes_area").html(data);
	$("#notes_area").hide();
}

function retrieveNote() {	
	if (id) {
		// var enUri = "${currentEntityClassName}";
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/note/retrievenote/" + idParent,
			data : {
				"currentEntityUri" : enUri,
				"taskId" : taskIdForUserActivity
			},
			success : function(data) {
				refreshNotes(data);
			},
			error : function(jqXHR, error, errorThrown) {
				new PNotify({
					title : failure,
					text : error_retrievingNote,
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
				});
			}
		});
		
		/*if($("#notes_area").find('.note_add_form').length==0){
			 $.ajax({
				type:"GET",
				url : getContextPath() + "/app/note/getDefaultNoteContentArea/" + idParent,
				async : false,
				success : function(jqXHR) {
					refreshNotesAreaDiv(jqXHR);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(jqXHR + " : " + textStatus + " : " + errorThrown);
				}  
				   
			   });
		}*/
	}
}

function deleteNote(noteId, topparent) {
	$.ajax({
		type : "POST",
		url : getContextPath() + "/app/note/delnote/" + noteId,
		success : function(data) {

			$(topparent).remove();
		},
		error : function() {
			new PNotify({
				title : failure,
				text : error_deletingNote,
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
		}
		
	});
}

function editNotes() {
	var noteText = tinyMCE.get('notes_edit_textarea').getContent();
	
	if(noteText != undefined && noteText.length > 4000){
		$.sticky(note_code_text_length_alert, {
			autoclose : 5000,
			position : "top-right",
			type : "st-error"
		});
		
		return;
	}
	
	if (noteText != "" && $("#notes_edit_inputtitle").val() != "") {
		if(checkFileTypesSupported($("#fileEdit"))){		
		
		var title=$("#notes_edit_inputtitle").val();
		
		var formData = new FormData();
		var file=$("#fileEdit")[0].files[0];			
		if(file){
			formData.append("attachedFile",file);
		}
		formData.append("id",notes_edit_id);
		formData.append("text",noteText);
		formData.append("privateNote",$("#notes_edit_checkbox").is(":checked"));
		formData.append("listOfAllowedUsers",$('#listOfAllowedUsers_edit').val());
		formData.append("title",title);
		formData.append("attachedDocumentId",$("#attachedDocumentId").val());
		formData.append("noteCode.id",$("#note_code_edit").val());
		formData.append("taskId", taskIdForUserActivity);
		
		$.ajax({
			traditional : true,
			type : "POST",
			url : getContextPath() + "/app/note/editnote/",
			enctype : "multipart/form-data",
			data : formData,
			success : function(data) {
				closenotesDialog();
				refreshNotes(data);
			},
			error : function() {
				new PNotify({
					title : failure,
					text : error_editingNote,
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
				});
			},
			processData : false,
			contentType : false
		});
		
	}
		else{
			new PNotify({
				title : failure,
				text : attachment_invalidFileType+''+supportedFileTypes,
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
		}
	}
		else {

		new PNotify({
			title : failure,
			text : note_cantEmpty,
			type : error,
			pnotify_animate_speed : fadeOutduration,
			opacity : .8
		});
	}
}

var isNotesTabClicked = false;
function paintNotesForm(){
	if(isNotesTabClicked === false){
        if(!currentStage1){
            currentStage1 = $("#currentStage").val();
           }
        if(currentStage1==""){
            currentStage1='LEAD';
        }
        if(currentStage1=='LEAD'){
             productTypeName = $("#loanProdCode").val();
        }
    	if (typeof VAR_APP_MAIN_PAGE_productId == 'undefined' || VAR_APP_MAIN_PAGE_productId == undefined) {
    		VAR_APP_MAIN_PAGE_productId = "";
    	}
	$.ajax({
		type : "POST",
		url : getContextPath() + "/app/LoanAppNotesController/getNotesForm/",
		data : {
			"loanStage" : currentStage1,
			"productType" : productTypeName,
			"product" : VAR_APP_MAIN_PAGE_productId
		},
		success : function(data) {
            $("#loanAppNotes").html(data);
			retrieveNoteForLoanApp();
		},
		error : function() {
			new PNotify({
				title : failure,
				text : "Error in Retrieving form",
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
		}
		
	});
	isNotesTabClicked = true;
	return true;
	}
}

function retrieveNoteForLoanApp() {	
	if (id) {
		var isEnquiry=false;
		if($("#enquiryTask").val()){
			isEnquiry=$("#enquiryTask").val();
		}
		$.ajax({
			type : "POST",
			url : getContextPath() + "/app/LoanAppNotesController/retrievenote/" + idParent,
			data : {
				"currentEntityUri" : enUri,
				"taskId" : taskIdForUserActivity,
				"isEnquiry" : isEnquiry
			},
			success : function(data) {
				refreshNotes(data);
			},
			error : function(jqXHR, error, errorThrown) {
				new PNotify({
					title : failure,
					text : error_retrievingNote,
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
				});
			}
		});
		
	}
}
/* =========================================================================================== */
/* ================= JQUERY FUNCTIONS FOR ACTIVITY TAG ============== */
/* =========================================================================================== */
function retrievActivity() {
	if (id) {
		var urlToHit=getContextPath()+ "/app/useractivity/retrieveactivity/" + idParent;
		if(enUri==applicationUriVal){
			urlToHit=getContextPath()+ "/app/LoanApplication/retrieveactivity/" + idParent; 
		}
		if(enUri==userUriVal){
			var urlToHit=getContextPath()+ "/app/useractivity/retrieveUserActivity/" + idParent;
		}
		$
				.ajax({
					type : "POST",
					url : urlToHit,
					data : {
						"currentEntityUri" : enUri
					},
					success : function(data) {
						$("#activity_stream").html(data);
					},
					error : function(jqXHR, error, errorThrown) {
						new PNotify({
							title : failure,
							text : error_retrievingActivity,
							type : error,
							pnotify_animate_speed : fadeOutduration,
							opacity : .8
						});
					}
				});
	}
}

/* =========================================================================================== */
/*
 * ================= JQUERY FUNCTIONS FOR RULE EXECUTION TAG FOR LOAN
 * APPLICATION ============
 */
/* =========================================================================================== */
function retrievRuleExecutionResult() {
	var appId = $("#appId").val();

		$.ajax({
			type : "GET",
			url : getContextPath()
					+ "/app/useractivity/retriveRuleExecutionResult",
			data : {
				applicationId : appId,
			},
			success : function(data) {
				$("#loan_application_activity_rule").html(data);
			},
			error : function(jqXHR, error, errorThrown) {
				new PNotify({
					title : failure,
					text : error_retrievingActivity,
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
				});
			}
		});

}

/* =========================================================================================== */
/*
 * ================= JQUERY FUNCTION FOR RETRIEVING HISTORY OF AN
 * ENTITY=====================
 */
/* =========================================================================================== */
function retrieveHistory() {
	// alert('history Area');
	$.ajax({
		type : "GET",
		url : getContextPath() + "/app/Snapshot/retrieveSnapshots/" + idParent,
		data : {
			"currentEntityUri" : enUri
		},
		success : function(historyTabContent) {
			$('#entityHistory').html(historyTabContent);
		},
		error : function(jqXHR, error, errorThrown) {

		}
	});
}

/* =========================================================================================== */
/*
 * ================= JQUERY FUNCTIONS For classification tags
 */
/* =========================================================================================== */
function addTag()
{
	if(taskIdForUserActivity == ""){
        taskIdForUserActivity = null;
    }


	
	if (id) {
		var tagVal =$("#Text_tagName_auto").val();
		
		if((tagVal=="")){
			new PNotify({
				title : failure,
				text : tag_cantEmpty,
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
			return ;
		}
		
		var specChars=$("#specialCharacters").val();
		var charArray = specChars.split("");
        var isValidTag= 'true';
        for (var i = 0; i < charArray.length; i++) {
			if (tagVal.includes(charArray[i]))
			{
				isValidTag='false';
				break;
			}																
		}
        
        if(isValidTag=='false'){
        	new PNotify({
                title : failure,
                text : special_char_error + specChars,
                type : error,
                pnotify_animate_speed : fadeOutduration,
                opacity : .8
        	});
        	return;
        }
		
			$.ajax({
				type : "POST",
				
				url : getContextPath() + "/app/tag/addTag/" + idParent + "/" + taskIdForUserActivity,
				data : {
					"tagName" : $("#Text_tagName_auto").val(),
					"currentEntityUri" : enUri	
				},
				success : function(data) {
					$("#Text_tagName_auto").val("");
					retrieveTags();
				},
				error : function(jqXHR, error, errorThrown) {
					$("#Text_tagName_auto").val("");

					retrieveTags();
					new PNotify({
						title : failure,
						text : error_addingTag,
						type : error,
						pnotify_animate_speed : fadeOutduration,
						opacity : .8
					});


				}
			});
		

	} else {
		new PNotify({
			title : failure,
			text : ownerId_notPresent,
			type : error,
			pnotify_animate_speed : fadeOutduration,
			opacity : .8
		});

	}



}


function retrieveTags(){
    if(taskIdForUserActivity == ""){
        taskIdForUserActivity = null;
    }
	$.ajax({
		type : "POST",
		url : getContextPath() + "/app/tag/retrieveTag/" + idParent + "/" + taskIdForUserActivity,
		data : {
			"currentEntityUri" : enUri

		},
		success : function(data) {
			$('#tag_container').html(data);
		},
		error : function(j) {

			new PNotify({
				title : failure,
				text : error_retrieveingTag,
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});


		}
	});


}
function deleteTag(tagName){

	$.ajax({
		type : "POST",
		url : getContextPath() + "/app/tag/removeTag/" + idParent,
		data : {
			"tagName" : tagName,
			"currentEntityUri" : enUri

		},
		success : function(data) {
			retrieveTags();
		},
		error : function(j) {
			retrieveTags();

			new PNotify({
				title : failure,
				text : error_deletingTag,
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});

		}
	});

}
$(document).ready(function(){
	$('body').on('change',"#file",function(){	
		$("#removeFile").show();
		var file=$("#file");
		if(!checkFileTypesSupported(file)){			
			 var pnvar = new PNotify({
				 	delay : 5000,
					title : failure,
					text : attachment_invalidFileType+''+supportedFileTypes,
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
			  });
			  pnvar.css("word-wrap","break-word");
		}		
	});	
	$('body').on('change',"#fileEdit",function(){	
		$("#removeFileEdit").show();
		var fileEdit=$("#fileEdit");
		if(!checkFileTypesSupported(fileEdit)){			
			 var pnvar = new PNotify({
				 	delay : 5000,
					title : failure,
					text : attachment_invalidFileType+''+supportedFileTypes,
					type : error,
					pnotify_animate_speed : fadeOutduration,
					opacity : .8
			  });
			  pnvar.css("word-wrap","break-word");
		}		
	});	
	$('#removeFile').click(function(){
		$("#file").val('');
		$("#removeFile").hide();
	});		
	
	$("#notes_button").click(function(){
		$("#file").attr("accept",supportedFileTypes);
		$("#fileTypeDiv").html("<small>File types supported are   :   "+supportedFileTypes+"</small>");		
			
		tinyMCE.get('notes_textarea').getBody().setAttribute('contenteditable', true);
	});
	$("#notes_edit_modal").click(function(){
		$("#fileEdit").attr("accept",supportedFileTypes);
		$("#fileSizeDiv").show();
		$("#fileEditTypeDiv").html("<small>File types supported are:"+supportedFileTypes+"</small>");		
	});
});
function checkFileTypesSupported(file){
	var fileAttached=file.val().split('.').pop().toLowerCase();
	if(fileAttached==''){
		return true;
	}
	else{
		fileAttached='.'+fileAttached;
		var i;
		for(i=0;i<supportedFileTypes.length;i++){
			if(supportedFileTypes[i]==fileAttached){
				return true;
			}
		}
		return false;
	}
}

/* =========================================================================================== */
/* ================= JQUERY FUNCTIONS FOR USAGE TAB ============== */
/* =========================================================================================== */

var isUsageClicked = false;
function paintUsageTab(){
	if(isUsageClicked === false){
		fetchUsageData();
		isUsageClicked = true;
		return true;
	}
}

function fetchUsageData(){
	$.ajax({
		type : "POST",
		url : getContextPath() + "/app/useractivity/getUsageTabContent/",
		data : {
			"masterId" : masterID,
			"id" : id
		},
		success : function(data) {
            $("#usage").html(data);
		},
		error : function() {
			new PNotify({
				title : failure,
				text : "Error in retrieving Usage",
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
		}
		
	});
}

$("#icon_usage").click(function() {
		fetchUsageData();
});


/* =========================================================================================== */
/* ================= JQUERY FUNCTIONS FOR AUDIT TAB ============== */
/* =========================================================================================== */

var isAuditClicked = false;
function paintAuditTab(){
	if(isAuditClicked === false){
		paintAuditTab();
		isAuditClicked = true;
		return true;
	}
}

function paintAuditTab(){
	$.ajax({
		type : "POST",
		url : getContextPath() + "/app/useractivity/getAuditTabContent",
		data : {
			"masterId" : masterID,
			"id" : id
		},
		success : function(data) {
            $("#usage").html(data);
		},
		error : function() {
			new PNotify({
				title : failure,
				text : "Error in retrieving Audit log",
				type : error,
				pnotify_animate_speed : fadeOutduration,
				opacity : .8
			});
		}
		
	});
}

$("#icon_audit").click(function() {
		fetchUsageData();
});


