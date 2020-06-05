
        $(document).ready(function(){
			
				$("#cropDetailsForm").validate({
		errorClass : "help-block",
		errorElement : "span",
		highlight : function(element, errorClass, validClass) {
			$(element).parents('.form-group').addClass('error');
			$(element).parents('.form-group').removeClass('success');
		},
		unhighlight : function(element, errorClass, validClass) {
			$(element).parents('.form-group').removeClass('error');
			$(element).parents('.form-group').addClass('success');
		},
		invalidHandler : function(form, validator) {
			$.sticky(error_message, {
				autoclose : 5000,
				position : "top-right",
				type : "st-error"
			});
		}
		});	
			
		var error = $('#error').val();
		
		if(typeof error !== 'undefined' && error != ''){
			new PNotify({
					title : 'Error',
					text : error,
					type : 'error',
					opacity : .8
				});
		}

        var countryVal=$("#country").val();
        var countryDisabled=$("#country").prop("disabled");
        if(countryVal!=null && countryVal!="" && !countryDisabled){
        enableState();
        setStateAuto();
        }

        var districtVal=$("#district").val();
        var stateDisabled=$("#Text_state").prop("disabled");
        if(districtVal!=null && districtVal!="" && !stateDisabled){
            enableDistrict();
             setDistrictAuto();
        }
        });

        $('#listMoney_grossCashInflow').attr('disabled', 'disabled');
        $('#listMoney_netIncome').attr('disabled', 'disabled');
        $('#listMoney_marketPrice').attr('disabled', 'disabled');
        updateMoneyTags();

         $('#country').change(function(){
         setStateAuto();
         clearState();
         enableState();
                 });


        $("#state").bind("enableDistrictAutocomplete", function() {
            setDistrictAuto();
            clearDistrict();
            enableDistrict();

                    });

            function enableState(){
             $("#Text_state").prop("disabled",false);
                        $("#Text_state").prop("readonly",null);
            };

            function enableDistrict(){
            $("#Text_district").prop("disabled",false);
                    $("#Text_district").prop("readonly",null);
            };

            function setStateAuto(){
            var st=$( "#country" ).val();
                    $('#Text_state').attr("data-custom-controller","/Crop/CropDetails/populateStateAutocomplete/"+st);
            }

     function setDistrictAuto(){
                var st=$('#state').val();
            $('#Text_district').attr("data-custom-controller","/Crop/CropDetails/populateDistrictAutocomplete/"+st);
        }

        function clearState(){
            $("#state").val("");
            $("#Text_state").val("");
        }

        function clearDistrict(){
            $("#district").val("");
            $("#Text_district").val("");
        }

        $('#district').change(function(){
            var d = $('#district').val();
            if(districtIds.indexOf(d) != -1){
                $('#district').val("");
                $('#Text_district').val("");
                new PNotify({
                    title: error,
                    text: "District Already Selected!"  ,
                    type: error,
                    pnotify_animate_speed : fadeOutduration,
                    opacity : .8

                });
            }

        });





        $('#hid_marketPrice').change(function(){
            calculateGrossCashInflow();
        });

        $('#yield').change(function(){
            calculateGrossCashInflow();
        });

        if(cropId != 0){
        var childArr=$("[class*=trackChildModifications]");
        if(childArr.length!=0){
            for(var i=0;i<childArr.length;i++)
            {
                var elm = childArr[i].id;
                $('#'+ elm).change(function(){
                    $("#operationType").val("M");
                });
            }
        }
        }



        function calculateGrossCashInflow(){
            var marketPrice = $("#hid_marketPrice").val();
            var yield = $("#yield").val();
            if(marketPrice != '' && yield != ''){
                $.ajax({
                    Type :'POST',
                    url :getContextPath()+"/app/Crop/CropDetails/calculateGrossCashInflow",
                    data :({
                        marketPrice :	marketPrice,
                        yield		:	yield
                    }),
                    success :function(data){
                        $("#hid_grossCashInflow").val(data);
                        var arg= data.split("~");
                        $("#amount_grossCashInflow").val(arg[1]);
                        setCurrencyDropDown("grossCashInflow",arg[0]);
                        formatCurrency('grossCashInflow', false,false);
                    }
                    });
            }

        }

        $('#hid_grossCashInflow').change(function(){
            calculateNetIncome();
        });

        $('#hid_costOfCultivation').change(function(){
            calculateNetIncome();
        });

        function calculateNetIncome(){
            var grossCashInflow = $("#hid_grossCashInflow").val();
            var costOfCultivation = $("#hid_costOfCultivation").val();
            if(grossCashInflow != '' && costOfCultivation != ''){
                $.ajax({
                    Type :'POST',
                    url :getContextPath()+"/app/Crop/CropDetails/calculateNetIncome",
                    data :({
                        grossCashInflow 	:	grossCashInflow,
                        costOfCultivation	:	costOfCultivation
                    }),
                    success :function(data){
                        $("#hid_netIncome").val(data);
                        var arg= data.split("~");
                        $("#amount_netIncome").val(arg[1]);
                        setCurrencyDropDown("netIncome", arg[0]);
                        formatCurrency('netIncome', false,false);
                    }
                    });
            }

        }

        function getMonthDiff(){
            var harvestMonth_el = document.getElementById("harvestMonth");
            var harvestMonth = harvestMonth_el.options[harvestMonth_el.selectedIndex].getAttribute('data-code');
            var sowingMonth_el = document.getElementById("sowingMonth");
            var sowingMonth = sowingMonth_el.options[sowingMonth_el.selectedIndex].getAttribute('data-code');
            if(sowingMonth != '' &&  sowingMonth != null && harvestMonth != ''  && harvestMonth != null){
                $.ajax({
                    Type :'POST',
                    url :getContextPath()+"/app/Crop/CropDetails/getMonthDiff",
                    data :({
                        sowingMonth 	:	sowingMonth,
                        harvestMonth	:	harvestMonth
                    }),
                    success :function(data){
                        $("#duration").val(data);
                    }
                    });
            }

        }

        function updateMoneyTags(){

             $("select[id^='listMoney_costOfCultivation']").change(function() {
                    console.log("start 1");

                    var item = document.getElementById("listMoney_costOfCultivation");
                    var itemVal = item.options[item.selectedIndex].getAttribute('data-code');
                    console.log("itemVal :  " + itemVal);

                    setCurrencyDropDown("marketPrice", itemVal);
                    formatCurrency('marketPrice', false, false);
                    console.log("marketPrice :  " +$('#listMoney_marketPrice').val());

                    setCurrencyDropDown("grossCashInflow", itemVal);
                    formatCurrency('grossCashInflow', false, false);
                    console.log("grossCashInflow :  " +$('#listMoney_grossCashInflow').val());

                    setCurrencyDropDown("netIncome", itemVal);
                    formatCurrency('netIncome', false, false);
                    console.log("netIncome :  " +$('#listMoney_netIncome').val());

                    console.log("end 1");

               });
             
        }

        function deleteTableRecord(masterId, parentId){
            actionURL = "/app/Crop/CropDetails/delete/";
            delSingleAction = true;
            deleteRow(actionURL,delSingleAction,masterId, parentId);
            $('.deleteRecord_'+masterId).modal('hide');

        }

        function deleteRecord(masterId, parentId){
            actionUrl=actionUrls["Delete"];
            delSingleAction = false;
            deleteRow(actionUrl,delSingleAction,masterId, parentId);
            $('.deleteRecord_'+masterId).modal('hide');
            $('#commonButton_'+ masterId).hide();
        }

        function deleteRow(actionURL, singleAction, masterId, parentId) {
            if(viewModeProperty=='false'){
                if(singleAction == true){
                    multipleIds.length = 0;
                }
                if (multipleIds.length == 0) {
                    multipleIds.push(lastRowId);
                }
                var deleteUrl = "";
                var actionForDelete="delete";

             deleteUrl = contextPath + "/app/"+parentId+"/"+masterId+"/"+actionForDelete+"/"+ multipleIds;

                $.ajax({
                    type : "GET",
                    url : deleteUrl,
                    success : function(result) {
                        //tableId.dataTable().fnDraw();
                        //loadDataTableData(masterIdOnClick , parentIdOnClick);
                        if (result) {
                            result = result.trim();
                            var n = result.split("|");
                            if (n[0] == "success") {
                                new PNotify({
                                      title: 'Done',
                                        text: 'Record(s) deleted successfully!',
                                        type: 'success',
                                        opacity: .8
                                });
                            }

                            $('#id').val(n[1]);
							$("#crop_master_id").val(n[1]);
							$("#cropId").val(n[1]);
							cropId = n[1];
							
							var baseURL = getContextPath() + "/app/" + parentid + "/"+masterId +"/" +  "loadPage/" + cropId+"/false";
					
							$('#CropDetailsVoDiv').load(baseURL, function() {
								$('#childTabs').tab(); // initialize tabs
							});

                            /*var currUrl = window.location.href;
                            var splitString = currUrl.split('?');
                            var paramString = splitString[1];
                            if(typeof paramString =="undefined"){
                                paramString="";
                            }
                            var baseURL = contextPath
                            + "/app/"+parentId+"/edit/"+$("#id").val()+"?"
                            + paramString;
                            neutrinoNavigateTo(baseURL);*/
                        }

                    },

                    error : function() {
                        new PNotify({
                        title: 'Error',
                        text: 'There was some error deleting the record(s)!',
                        type: 'error',
                        opacity: .8
                        });
                    }
            });
                }else{
                    return false;
                }

            }
        
        