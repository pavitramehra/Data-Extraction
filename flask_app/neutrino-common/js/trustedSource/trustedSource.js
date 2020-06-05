function onClickDownloadCredentials()
{
	var id=$('#id').val();
	var url = getContextPath() + "/app/OauthClientDetails/downloadclientcredentials/"+id;
		neutrinoNavigateTo(url);
		$('#downloadCredentials').attr("disabled", "disabled");
		$('#mailCredentials').attr("disabled", "disabled");
}
function onClickMailCredentials()
{
	var id=$('#id').val();
	$.ajax({
		url : getContextPath() + "/app/OauthClientDetails/mailclientcredentials/"+id,
		type : 'GET',
		async : false,
	
		success : function(data) {
			$('#downloadCredentials').attr("disabled", "disabled");
			$('#mailCredentials').attr("disabled", "disabled");
		},
		error : function(jqXHR, textStatus, errorThrown) {
			new PNotify({
												title : "Failure",
												text : "Error Occured While Sending Email",
												type : "error",
												pnotify_animate_speed : fadeOutduration,
												opacity : .8
								});
		}

	});	
}
		
		
		
	
	function convertIpAddrToVal(ipAddArr){
		
		return 1000000000*parseInt(ipAddArr[0]) + 1000000*parseInt(ipAddArr[1]) + 1000*parseInt(ipAddArr[2]) + parseInt(ipAddArr[3]);
		
	}
		
		function handleIpAddressErrors(){
			new PNotify({
				title : 'Error',
				text : 'IP Address Range Invalid',
				type : 'error',
				pnotify_animate_speed : .8,
				opacity : 1
			});
		}
		function handleIpAddExistsErrors()
		{
			new PNotify({
				title : 'Error',
				text : 'The IP Address(es) you\'re trying to add already exist in the range. Please check',
				type : 'error',
				pnotify_animate_speed : .8,
				opacity : 1
			});
			
		}
		function handleIpAddEmptyErrors(){
			new PNotify({
				title : 'Error',
				text : 'IP Address Cannot be empty',
				type : 'error',
				pnotify_animate_speed : .8,
				opacity : 1
			});
		}
		
 
function addIpToTable(){
				if($('#ipAdd_single').parent().parent().parent().hasClass('error'))
				{
					return;
				}
					heading = "Single IP";
					ip1 = $("#ipAdd_single").val()
					ip2	=  " - ";
					if(ip1 == ""){
							$("#ip_mapping_table").addClass("error");
							handleIpAddEmptyErrors();
							return;
					}
					var singleIpVals = ip1.split('.');
					
					var singleIpCompleteValue = convertIpAddrToVal(singleIpVals);
					

		
					
						var exists = false
					$("#ip_mapping_table tr.ipAddRange").each(function(){
							if($(this).find("td.type").html() == 'Single IP'){
									var singleIp = convertIpAddrToVal($(this).find("td.fromIp").html().split('.'));
									if(singleIpCompleteValue == singleIp)  
									{
										exists = true;
									}
							}
							else if($(this).find("td.type").html() == 'Range of IP')
							{
									var fromIp = $(this).find("td.fromIp").html();
									var toIp = $(this).find("td.toIp").html();
									var fromIpVal = convertIpAddrToVal(fromIp.split('.'));
									var toIpVal =   convertIpAddrToVal(toIp.split('.'));
									if( fromIpVal <=singleIpCompleteValue && toIpVal >=  singleIpCompleteValue ){
										exists = true;			
									}
							}
							
							if(exists){
								return false;
						
							}
					});
					
					
						if(exists == true)
						{
							$("#ip_mapping_table").addClass("error");
							handleIpAddExistsErrors();
							return;
						}
						
						$("#ip_mapping_table").removeClass("error");
					addValuesToIPTable(heading, ip1, ip2);
					$("#ipAdd_single").val("");
		
		}	
		

	function addIpRangeToTable(){
				if($('#ipaddressfrom').parent().parent().parent().hasClass('error')|| 
				$('#ipaddressto').parent().parent().parent().hasClass('error'))
				{
					return;
				}
					heading = "Range of IP";
					ip1 = $("#ipaddressfrom").val();
					ip2 = $("#ipaddressto").val();
					if(ip1 == "" || ip2 == ""){
							$("#ip_mapping_table").addClass("error");
							handleIpAddEmptyErrors();
							return;
					}
					var ipValsFrom = ip1.split('.');
					var ipValsTo = ip2.split('.');
					
					//Comparison
					var ipFromCompleteValue = convertIpAddrToVal(ipValsFrom);
					var ipToCompleteValue = convertIpAddrToVal(ipValsTo);
			
					if(ipToCompleteValue <= ipFromCompleteValue)
					{
						$("#ipaddressfrom").parent().parent().addClass("error");
						handleIpAddressErrors();
						return;
						
					}
						
						var exists = false
					$("#ip_mapping_table tr.ipAddRange").each(function(){
							if($(this).find("td.type").html() == 'Single IP'){
									var singleIp = convertIpAddrToVal($(this).find("td.fromIp").html().split('.'));
							
									if(ipFromCompleteValue <= singleIp && ipToCompleteValue >= singleIp)  
									{
										exists = true;
									}
							}
							else if($(this).find("td.type").html() == 'Range of IP')
							{
								exists = true;
									var fromIp = $(this).find("td.fromIp").html();
									var toIp = $(this).find("td.toIp").html();
									var fromIpVal = convertIpAddrToVal(fromIp.split('.'));
									var toIpVal =   convertIpAddrToVal(toIp.split('.'));
									if(ipFromCompleteValue > toIpVal){
										exists = false;
										
									}
									else if( fromIpVal > ipToCompleteValue){
									
										exists = false;
										
									}
							}
							
							if(exists){
								return false;
						
							}
					});
					
					
						if(exists == true)
						{
							$("#ipaddressfrom").parent().parent().addClass("error");
							handleIpAddExistsErrors();
							return;
						}
					
					$("#ipaddressfrom").parent().parent().removeClass("error");
					
					addValuesToIPTable(heading, ip1, ip2);
					$("#ipaddressfrom").val("");
					$("#ipaddressto").val("");
		}	
		
    
    

    function addValuesToIPTable(heading, ip1, ip2){
			
	var table = document.getElementById("ip_mapping_table");
	if(table.rows.length == 2){
				$("#ip_mapping_table").show();
			}
			
			var endSize = table.rows.length - 2;
        var row = $("#ip_mapping_table tbody>tr:last").clone(true, true);
					row.find("td").eq(0).contents().first().replaceWith(heading);
					
					 row.find("input").eq(0).val(ip1);
				    row.find("td").eq(1).contents().first().replaceWith(ip1);
					
					 row.find("input").eq(1).val(ip2);
					row.find("td").eq(2).contents().first().replaceWith(ip2);
				row.removeClass("defaultRow");
				row.show();
			
        $("#ip_mapping_table").append(row);
    }
	
 
		

var secretValidFlag = false;
var clientIdValidFlag = false;
var secretMatchFlag = false;

$(function(){
	
	$('#multiselectbox_grantTypes').change(function(){

});
	
	/*$(".addThrottlingPolicy").click(function() {
			var inputRow = $(this).closest("tr");
			 var rowToCopy = inputRow.clone(true);
			 
				
		var table = document.getElementById("ip_mapping_table");
			 var endIndex = table.rows.length-1;
				rowToCopy.find("td").eq(0).html(inputRow.find("td").eq(0).html());
				
				
				$.ajax({
					url : getContextPath()+"/app/OauthClientDetails/appendTimeUnitChoices",
					data : ({
						endSize : endIndex
					}),
					async : false,
					success : function(jqXHR){
						
						
				rowToCopy.find("td").eq(1).html(jqXHR);
				
				
						
					}
					
				});
				
				rowToCopy.find("td").eq(2).html(inputRow.find("td:eq(2) input").val());
				rowToCopy.find("td").eq(3).html("<a href='javascript:void(0)' onclick='removeThrottlingPolicy($(this))'>Remove Throttling Policy</a>");
				rowToCopy.find("td").eq(4).html("");
			$("#apiThrottleMapping").append(rowToCopy);
		});
	
	*/
	
	
			 var validSecretCode = function(value) {
				 var  validSecretCode = new RegExp(password_pattren);
				  
			  return  validSecretCode.test(value);

			}

		
		$.validator.addMethod("validSecretCode", function(value, element) {

			  return  validSecretCode(value);

			},'Secret Invalid' ); 
		
	
			var validRetypeSecretCode = function(value)
			{
				var pass = $('#secret').val();
				var pass2 = $('#retype_secret').val();
				return (pass == pass2);
			}
		
			$.validator.addMethod("validRetypeSecretCode", function(value, element) {

				  return  validRetypeSecretCode(value);

				},'Secrets Do Not Match' ); 
			
			
			var checkDuplicateClientId=function checkDuplicateClientId()
			{
				var result=false;
				
				$.ajax({
					url : getContextPath() + "/app/OauthClientDetails/checkDuplicateClientId",
					type : 'GET',
					async : false,
					data : $("#masterForm").serialize(),
					success : function(data) {
						if (data == "UnAvailable")
							{
							result=true;
							}
					},
					error : function(jqXHR, textStatus, errorThrown) {
						/* new PNotify({
															title : "Failure",
															text : "Error occured in While Emailing",
															type : "error",
															pnotify_animate_speed : fadeOutduration,
															opacity : .8
											}); */
					}

				});	
				return result;
			}
			
			 $.validator.addMethod("checkDuplicateClientId", function(value, element) {

				  return  !checkDuplicateClientId();

				},'Client ID Already Exists' ); 
			
			
			
			
		$("#secret_info").hover(function()
				{
			
			$("#secret_info").popover({
				trigger: "mouseenter mouseleave",
				html:true,
				title: "Secret Essentials",
			    content:function() {
			    	return $('#secret_info_content').html();
			    },
				placement : "top"
			});
			
				});
		});

$(document).ready(function() {
	$(".grantTypes .ms-selectable #sForm_select").css('pointer-events', 'none');
	$(".grantTypes .ms-selectable #sForm_select").css('opacity', '0.7');
	
	$(".grantTypes .ms-selectable").click(function(event) {
		var selectedItem = event.target.textContent;
		if(selectedItem =='anonymous'){
			$('#ms-trustedUsers').css('pointer-events', 'none');
			$('#ms-trustedUsers').css('opacity', '0.7');
		}
		
			var listSelectable = $(".grantTypes .ms-selectable li");
			var listSelected = $(".grantTypes .ms-selection li");
			
			var flag=false;
			
			$(".grantTypes .ms-selection li.ms-selected").each(function(idx, li) {
				var elem  = $(li).children()[0].innerHTML
				if( (elem == 'password' && selectedItem == 'anonymous') || (elem == 'anonymous' && selectedItem == 'password')){
				flag=true;
				}});
		
			
			if(flag==true){
			
			listSelectable.each(function(idx, li) {
				var elem  = $(li).children()[0].innerHTML
				if( elem == 'password' || elem == 'anonymous'){
				$(li).removeAttr('style')
				$(li).addClass('ms-selected')
				}	});
			
			listSelected.each(function(idx, li) {
				var elem  = $(li).children()[0].innerHTML
				if( elem == 'password' || elem == 'anonymous'){
				$(li).css('display','none')
				$(li).removeClass('ms-selected')
				}	});
		
		$('#ms-trustedUsers').removeAttr('style');
		
			new PNotify({
				title : 'Error',
				text : errorMsgPassAndAnonym,
				type : 'error',
				pnotify_animate_speed : .8,
				opacity : 1
			});
			}
		
		
	});

	
	$(".grantTypes .ms-selection").click(function(event) {
		
		var selectedItem = event.target.textContent;
		if(selectedItem =='anonymous' || selectedItem =='Deselect All'){
			$('#ms-trustedUsers').removeAttr('style')
			flag=false;
		}
	});
	
	

});







