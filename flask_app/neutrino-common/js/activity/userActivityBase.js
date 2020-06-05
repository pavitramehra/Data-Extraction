(function() {
	idParent = null;
	$(document).ready(
			function() {
				id = $("#id input").val();
				if (!id) {
					id = $('input[name="id"]').val();
				}
				masterID = $("#masterID").val();
				function handler(e) {
					$.ajax({
						type : "GET",
						url : getContextPath()
								+ "/app/useractivity/getActivityAccordion/",
						data : {
							"currentEntityUri" : $('#collapse-uact').attr(
									"entity-name"),
							"masterId" : masterID
						},
						success : function(data) {
							$('#collapse-uact').html(data);
							unbindHandler();
						},
						error : function(j) {
							new PNotify({
								title : failure,
								text : error_loading_activity,
								type : error,
								pnotify_animate_speed : fadeOutduration,
								opacity : .8
							});
							unbindHandler();
						}
					});
				}
				function unbindHandler() {
					$("#collapse-uact").unbind("show.bs.collapse", handler);
				}
				$('#collapse-uact').on('show.bs.collapse', handler);
			})
})();


