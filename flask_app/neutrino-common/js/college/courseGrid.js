var collegeId=0;
$(document).ready(function() {
	if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {

		collegeId = $("#collegeId").val();

	}

contextPath=getContextPath();
});

function RefreshTable(tableId, urlData)
{
	$.getJSON(urlData, { viewable: true}, function( json )
		{
		table = $(tableId).DataTable();
		oSettings = table.settings();
		table.clear(this);
		for (var i=0; i<json.aaData.length; i++){
			table.row.add(json.aaData[i]).draw();
		}
		
		oSettings[0].aiDisplay = oSettings[0].aiDisplayMaster.slice();
		table.draw();
		});
}

function loadCourseTable(collegeId) {
	$('#courseTable').DataTable().ajax.reload();
	var contextPath = getContextPath();
	$.ajax({

		url : contextPath + "/app/College/Course/loadPage/"+ collegeId,

		type : 'POST',

		async : false,

		success : function(jqXHR) {
			var baseURL = contextPath
			+ "/app/College/Course/loadData/"
			+ collegeId;
			$('#courseTable tbody').load(baseURL,{viewable: true}, function() {

				$('#courseDiv').tab(); // initialize tabs

			});

		},

		failure : function() {

			$.sticky("Some Error Occured", {
				autoclose : 10000,
				position : "top-right",
				type : "st-failure"
			});

		}

	});

}

function openDialogCourse(action, id) {
	var contextPath = getContextPath();
	$.ajax({

		url : contextPath + "/app/College/Course/" + action,

		type : 'POST',

		async : false,

		data : "id=" + id,

		success : function(jqXHR) {

			$('#childModalCourse').html(jqXHR);
			$('#childModalWindowDoneButtonCourse').show();
			$('#create_another_Course').removeAttr("disabled");
			$('#create_another_div_Course').show();
			$('#dialog-form-CourseEdit').hide();
			$('#dialog-form-CourseView').hide();
			$('#dialog-form-CourseNew').show();

		},

		error : function(jqXHR, textStatus, errorThrown) {

			alert(jqXHR + " : " + textStatus + " : " + errorThrown);

		}

	});

	$('#dialog-form-Course').modal('show');

}

function closeDialogCourse() {

	$('#dialog-form-Course').modal('hide');

}

function StickyMessage(message)
{

	$.sticky(message, {
		autoclose : 10000,
		position : "top-right",
		type : "st-success"
	});

}

function hide(divId) {
	divId = "#" + divId;
	$(divId).hide();

}

function saveCollegeOnce() {
       if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
          return;
       }
       if ($("#masterForm").valid()) {
             var contextPath = getContextPath();
             if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
                   collegeId = $("#collegeId").val();
             }
             $.ajax({
                   type : "POST",
                   url : contextPath + "/app/College/saveClgOnce",
                   data : $("#masterForm").serialize()+ "&parentId="+collegeId,
                   clearForm : true,
                   async: false,
                   success : function(response) {
                          $("#collegeId").val(response);
                   },
                   error : function() {

                          $.sticky("Some Error Occured while saving college", {
                                 autoclose : 5000,
                                 position : "top-right",
                                 type : "st-failure"
                          });

                   }

             });
       }
}



function validationDuration(){

    if(!($("#courseDuration").val() != "" && $("#courseDuration").val() > 0)){
       $.sticky("Course duration should be greater than zero", {
           				autoclose : 5000,
           				position : "top-right",
           				type : "st-error"
           			});
        return false;
     }
     return true;
}

function saveCourse() {
   if (!$("#masterForm").valid()) {
          return;
   }else{
          saveCollegeOnce();
   }

	if ($("#courseDetail").valid() && validationDuration()) {
		if(checkDuplicates()) {

			var contextPath = getContextPath();
			if ($("#collegeId").val() != "" && $("#collegeId").val() != undefined) {
				collegeId = $("#collegeId").val();
			}
			var courseCode = $("#Text_courseCode").val();
			$("#newCourseCode").val(courseCode);
			$.ajax({

				type : "POST",

				url : contextPath + "/app/College/Course/saveToGrid",

				data : $('#courseDetail').serialize()+ "&parentId="+collegeId,

				clearForm : true,

				success : function(response) {

					$("#collegeId").val(response);
					collegeId = response;
					var isChecked =$('body').find("#create_another_Course:visible").prop('checked');
					if (isChecked) {
						$('#dialog-form-Course.modal').modal('show');
						$("#Text_courseCode").val("");
						$("input#courseName").val("");
						$("input#courseType").val("");
						$('body').find("#create_another_Course:visible").prop("checked",false);

					}else {
						$('#dialog-form-Course.modal').modal('hide');
					}

					var baseURL = contextPath
					+ "/app/College/Course/loadData/"
					+ collegeId;
					RefreshTable("#courseTable", baseURL);
					StickyMessage(data_saved);
				},

				error : function() {

					$.sticky("Some Error Occured", {
						autoclose : 10000,
						position : "top-right",
						type : "st-failure"
					});

				}

			});


		} else {
			$.sticky("Course Details already exists", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
	}
}

function checkDuplicates() {
       var result = true;
       var bankGridTableLength = $("#courseTable").find("tbody").children().length;
       var bankGridEmptyCheck = $("#courseTable").find("tbody > tr > td:eq(0)").hasClass("dataTables_empty");
       if(bankGridTableLength > 0 && !bankGridEmptyCheck) {
            for(var i=0;i<bankGridTableLength;i++ ) {
                var courseCode = $("#courseTable").find("tbody >tr").eq(i).find("td:eq(1)").children().html().trim();
                var courseName = $("#courseTable").find("tbody >tr").eq(i).find("td:eq(2)").html().trim();
                var courseType =$("#courseTable").find("tbody >tr").eq(i).find("td:eq(3)").html().trim();
                var courseRowId = $("#courseTable").find("tbody >tr").eq(i).find("td:eq(0)").html().trim();

                 if(courseCode == $("#Text_courseCode").val().trim()
                                    				&& courseName == $("#courseName").val().trim()
                                    				&& courseType == $("#courseType").val().trim()) {
                                    			result =  false;
                                    			break;
                                    		}
            }
       }
       return result;
    }


function deleteCourse(courseId) {
	$ .ajax({
		url : getContextPath()+"/app/College/Course/delete/"+ courseId ,
		data : "&collegeId=" + collegeId,
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$("#collegeId").val(jqXHR);
			collegeId = jqXHR;

			var baseURL =  getContextPath()
			+ "/app/College/Course/loadData/"
			+ collegeId;

			RefreshTable("#courseTable", baseURL);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$.sticky("Error while deleting selected Course. Please try Again!", {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
	});

}


function openEditMode(action, id) {
	$.ajax({

		url : getContextPath()+"/app/College/Course/edit/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalCourse').html(jqXHR);
			$('#childModalWindowDoneButtonCourse').show();
			$('#create_another_Course').removeAttr("disabled");
			$('#create_another_div_Course').show();
			$('#editChild').show();
			$('#dialog-form-CourseView').hide();
			$('#dialog-form-CourseEdit').show();
			$('#dialog-form-CourseNew').hide();

		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$('#dialog-form-Course').modal('show');

}


function openViewMode(action, id) {
	$.ajax({

		url : contextPath+"/app/College/Course/view/",
		data : ({
			id: id
		}),
		type : 'POST',
		async : false,
		success : function(jqXHR) {
			$('#childModalCourse').html(jqXHR);
			$('#childModalWindowDoneButtonCourse').hide();
			$('#create_another_Course').attr("disabled",true);
			$('#create_another_div_Course').hide();
			$('#viewChild').show();
			$('#dialog-form-CourseEdit').hide();
			$('#dialog-form-CourseView').show();
			$('#dialog-form-CourseNew').hide();
			var baseURL = contextPath
			+ "/app/College/Course/loadData/"
			+ id;			
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(jqXHR + " : " + textStatus + " : " + errorThrown);
		}
	});
	$('#dialog-form-Course').modal('show');

}
