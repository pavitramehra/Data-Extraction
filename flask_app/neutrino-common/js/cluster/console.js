function refreshClusterStatus() {
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/getClusterStatus",
		type : "GET",
		success : function(jqXHR) {
			$("#currentNodeStatusTxt").removeClass("hide");
			
			showAlertMessage("fetched cluster status from remote node", 'success');
			if($("#cacheCountCheckBox").prop("checked")){
				jqXHR.availableCacheNames="Count:"+jqXHR.availableCacheNames.length
			}
			jqXHR.degradedCacheNames="Count:"+jqXHR.degradedCacheNames.length
			displayCacheStatusResult("clusterStatus",jqXHR);

		},
		error : function(jqXHR) {
			showAlertMessage("Error", 'error');
		}
	});

}

function generateCredentials(){
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/generateCredentials",
		type : "GET",
		success : function(jqXHR) {
			showAlertMessage(jqXHR, 'success');
		},
		error : function(jqXHR) {
			showAlertMessage("Error", 'error');
		}
	});
}
function showAlertMessage(message, type) {
	console.log(message);
	new PNotify({
		title : 'Message',
		text : message,
		type : type,
		opacity : .9
	});

}

function showOthersNodes(){

	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/getClusterNodeAddresses",
		type : "GET",
		success : function(jqXHR) {
			
			$("#clusterNodesDiv").removeClass("hide");
			$("#clusterNodes tbody tr").remove();
			jqXHR.forEach(function(nodeAddress){
				$("#clusterNodes tbody").append("<tr><td>"+nodeAddress+"</td>"+
						"<td><button class='btn' onclick='showRemoteClusterStatus(`"+nodeAddress+"`)'> Cluster status</button>"+
						" <button class='btn hide more-options' onclick='clearRemoteHibernateCache(`"+nodeAddress+"`)'> Clear Hibernate cache</button>"+
						" <button class='btn' onclick='markActiveOnRemote(`"+nodeAddress+"`)'> Mark active</button>"+
						" <button class='btn' onclick='showEventHistory(`"+nodeAddress+"`)'> Event History</button>"+
						" <button class='btn' onclick='deleteNode(`"+nodeAddress+"`)'> Delete</button>");
			})
		},
		error : function(jqXHR) {
			showAlertMessage("Error", 'error');
		}
	});

}


function addNodeAddress(){
	
	var nodeAddress=$("#newNodeAddress").val();
	
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/addNodeAddress?nodeAddress="+nodeAddress,
		type : "GET",
		success : function(jqXHR) {
			showOthersNodes();
			showAlertMessage("Node address Added", 'success');
		},
		error : function(jqXHR) {
			showAlertMessage("Error", 'error');
		}
	});
}

function deleteNode(nodeAddress){
		
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/deleteNodeAddress?nodeAddress="+nodeAddress,
		type : "GET",
		success : function(jqXHR) {
			showOthersNodes();
			showAlertMessage("Node address deleted", 'success');
		},
		error : function(jqXHR) {
			showAlertMessage("Error", 'error');
		}
	});

	
}

function showRemoteClusterStatus(nodeAddress){
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/getClusterStatusOnNode?nodeAddress="+nodeAddress,
		type : "GET",
		success : function(jqXHR) {
			if(jqXHR!=null && jqXHR!=""){
				showAlertMessage("fetched cluster status from remote node", 'success');
				if($("#cacheCountCheckBox").prop("checked")){
					jqXHR.availableCacheNames="Count:"+jqXHR.availableCacheNames.length
				}
				jqXHR.nodeUrl=nodeAddress
				jqXHR.degradedCacheNames="Count:"+jqXHR.degradedCacheNames.length
				displayCacheStatusResult(md5(nodeAddress),jqXHR);
			}else{
				showAlertMessage("Could not fetch cluster status from remote", 'error');
			}
		},
		error : function(jqXHR) {
			showError(jqXHR);
		}
	});
}

function showError(response){
	showAlertMessage("Not able to call api", 'error');
}

function displayCacheStatusResult(divId,content){
	if($("#"+divId).length==0){
		$("#clusterStatusContainer").append("<div id='"+divId+"'></div>");
	}
	
	var clusterStatus={};
	clusterStatus.clusterName=content.clusterName;
	clusterStatus.memberCount=content.members.length;
	var count=1;
	content.members.forEach(function(member){
		clusterStatus["member_"+count]=member;
		count++;
	})
	clusterStatus.currentNodeLogicalName=content.localAddress;
	clusterStatus.coordinatorAddress=content.coordinatorAddress;
	clusterStatus.availableCacheNames=content.availableCacheNames;
	clusterStatus.degradedCacheNames=content.degradedCacheNames;
	var ppTable2 = prettyPrint(clusterStatus, {
		expanded : true, 
		maxDepth : 5
	});
	$("#"+divId).html(ppTable2);
	$("#"+divId).focus();
	$('.nav-tabs a[href="#cluster-status-tab"]').tab('show')
}

function displayClusterEvents(divId,content,nodeAddress){
	if($("#"+divId).length==0){
		$("#clusterEventsContainer").append("<div id='"+divId+"'></div>");
	}
	var eventsData=[];
	content.forEach(function(eventData){
		var event={};
		event.time=new Date(eventData.time).toString();
		event.eventName=eventData.eventName;
		event.newMembers=eventData.newMembers;
		event.oldMembers=eventData.oldMembers;
		if(eventData.subgroupsMerged!=null){
			event.subgroupsMerged=eventData.subgroupsMerged;
		}
		eventsData.push(event);
	})
	eventsData.node="A";
	eventsData.reverse();
	var ppTable2 = prettyPrint(eventsData, {
		expanded : true, 
		maxDepth : 5
	});
	$("#"+divId).html(ppTable2);
	$("#"+divId).prepend("<h2>Node- "+nodeAddress+"</h2>");
	$("#"+divId).focus();

}
function clearRemoteHibernateCache(nodeAddress){
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/evictHibernateCacheOnNode?nodeAddress="+nodeAddress,
		type : "GET",
		success : function(jqXHR) {
			showAlertMessage("Hibernate cache cleared on "+nodeAddress +" node", 'success');
		},
		error : function(jqXHR) {
			showError(jqXHR);
		}
	});
}

function markActiveOnRemote(nodeAddress){
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/markCacheActiveOnNode?nodeAddress="+nodeAddress,
		type : "GET",
		success : function(jqXHR) {
			showAlertMessage("Cache updated to active on "+nodeAddress+" node", 'success');
		},
		error : function(jqXHR) {
			showError(jqXHR);
		}
	});
}

function clearHibernateCacheOnCurrent(){
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/evictHibernateCache",
		type : "GET",
		success : function(jqXHR) {
			showAlertMessage("Hibernate cache cleared on current node", 'success');
		},
		error : function(jqXHR) {
			showError(jqXHR);
		}
	});

}

function markActiveOnCurrentNode(){
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/markCacheActive",
		type : "GET",
		success : function(jqXHR) {
			showAlertMessage("Cache updated to active on current node", 'success');
		},
		error : function(jqXHR) {
			showError(jqXHR);
		}
	});

}
function showMoreOptions(){
	$(".more-options").toggleClass("hide");
}

function showEventHistory(nodeAddress){
	$.ajax({
		url : getContextPath() + "/cluster/clusterConsole/getClusterEventsList",
		type : "GET",
		success : function(jqXHR) {
			showAlertMessage("fetched cluster events list", 'success');
			displayClusterEvents(md5(nodeAddress)+"_event",jqXHR,nodeAddress);
			$('.nav-tabs a[href="#cluster-events-tab"]').tab('show')
		},
		error : function(jqXHR) {
			showError(jqXHR);
		}
	});
}

