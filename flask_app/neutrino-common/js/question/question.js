function showError(text){
    new PNotify({
	    title : some_errror_occured,
	    text : text,
		type : 'error',
		opacity : .8
	});
}
function handleReference(){
    if($('#questionType option:selected').attr('data-code') == REFERENCE){
        $('#referenceDiv').show();
        $('#Text_reference').addClass('required');
    }else{
        $('#referenceDiv').hide();
        $('#Text_reference').removeClass('required');
    }
}
function handleCustomLOV(){
    if($('#questionType option:selected').attr('data-code') == CUSTOM_LOV){
        $('#customeLOVTableDiv').show();
    }else{
        $('#customeLOVTableDiv').hide();
        $('#LOVBody').empty();
        lovIndex = 0;
    }
}
function handleScore(){
    if($('#questionType option:selected').attr('data-code') == SCORE){
        $('#scoreTableDiv').show();
    }else{
        $('#scoreTableDiv').hide();
        $('#scoreBody').empty();
        scoreIndex = 0;
    }
}

function handleDateTypeQuestion(){
    if($('#questionType option:selected').attr('data-code') == DATE){
        $('#futureDateDiv').show();
    }else{
    	$('#futureDateAllowed').prop("checked",false);
    	$('#futureDateAllowed').parents("span:first").removeClass("uni-checked");
    	$('#futureDateAllowed').parents("span:first").removeClass("checked");
        $('#futureDateDiv').hide();
    }
}

function handleQuestionTypeChange(){
	handleDateTypeQuestion();
    handleReference();
    handleScore();
    handleCustomLOV();
}

function addNewScoreRow(){
    $.ajax({url: getContextPath() + "/app/Question/getNewScoreRow/"+scoreIndex, success: function(result){
        $("#scoreBody").append(result);
        scoreIndex++;
    }});
}

function addNewLOVRow(){
    $.ajax({url: getContextPath() + "/app/Question/getCustomLOVRow/"+lovIndex, success: function(result){
        $("#LOVBody").append(result);
        lovIndex++;
    }});
}

function removeScore(index){
    $('#scoreRow_'+index).remove();
}

function removeLOV(index){
    $('#lovRow_'+index).remove();
}

function disableFields(){
    if(questionMasterViewMode == 'true'){
        $('#create_new_lov').attr('disabled','disabled');
        $('#create_new_score').attr('disabled','disabled');
        $("[id^='deleteLOV']").each(function(){
            $(this).removeAttr('onclick');
        });
        $("[id^='deleteScore']").each(function(){
            $(this).removeAttr('onclick');
        });
    }
}

function validateQuestionMaster(){
    var questionType = $('#questionType option:selected').attr('data-code');

    if(questionType == SCORE){
        if($('#scoreBody tr').length == 0){
            showError('Atleast one Score row is required.');
            return false;
        }
        var scoreValue =[];

        $("input[id^='score_itemValue_']").each(function(){
            scoreValue.push($(this).val().replace(" ", ""));
        });
        if(isduplicateExist(scoreValue)){
            showError('Duplicate Score Values.');
            return false;
        }
    }
    if(questionType == CUSTOM_LOV){
        if($('#LOVBody tr').length == 0){
            showError('Atleast one Custom LOV row is required.');
            return false;
        }
        var lovArray =[];

        $("input[id^='lov_itemValue_']").each(function(){
            lovArray.push($(this).val().replace(" ", ""));
        });
        if(isduplicateExist(lovArray)){
            showError('Duplicate Custom LOV Values.');
            return false;
        }
    }
    return true;
}

function saveForm() {
    if ($("#masterForm").valid()){
        var returnValue = validateQuestionMaster();
        if(returnValue == true){
            var formTemp = $("#masterForm");
            formTemp.submit();
        }
     }
}

function saveAndSendForApproval(context) {
    if ($("#masterForm").valid()){
        var returnValue = validateQuestionMaster();
        if(returnValue == true){
            var form = document.getElementById("masterForm");
            form.action = context + "/app/" + $("#masterID").val() + "/saveAndSendForApproval";
            form.submit();
        }
	}
}

function isduplicateExist(array) {
    for(var i = 0; i <= array.length; i++) {
        for(var j = i; j <= array.length; j++) {
            if(i != j && array[i] == array[j]) {
                return true;
            }
        }
    }
    return false;
}
$(document).ready(function() {
    disableFields();
    handleQuestionTypeChange();
    $('#questionType').change(function(){
         handleQuestionTypeChange();
    });
});