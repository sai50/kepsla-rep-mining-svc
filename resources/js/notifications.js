var sessionSelectedOrganizationId=0;
var reviewNotifications=0;
var reviewUserActionNotification=0;
var reviewAdminActionNotification=0;
var reviewAdminDeadlineReachedNotification=0;
var reviewNotesNotification=0;
var reviewRespondedFlaggedNotification=0;
$(document).ready(function() {
	 $.ajaxSetup({ cache: false }); 
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDate",
		altFormat: "mm/dd/yy",
		maxDate: new Date,
		onClose : function(selectedDate) {
		$("#to").datepicker("option", "minDate", selectedDate);
		dateValidationForm();
		}
	});
	
	$("#to").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altToDate",
		altFormat: "mm/dd/yy",
		maxDate: new Date,
		onClose : function(selectedDate) {
		$("#from").datepicker("option", "maxDate", selectedDate);
		dateValidationForm(); 
		}
	
	});
	   getSessionData().then(function(){
	   poplateOrganizations(function(selectedOrgId) {
		   getNotificationReviews(selectedOrgId);
		   getNotificationReviewActions(selectedOrgId);
		   getNotificationReviewNotes(selectedOrgId);
		   responedFlaggedReviews(selectedOrgId);
		   getAdminReviewActions(selectedOrgId);
		   getUserReviewActions(selectedOrgId);
		   getAllReviewResponse();
	   });
	   })   
});

$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	 saveSessionDatas();
	 getNotificationReviews(organizationId);
	 getNotificationReviewActions(organizationId);
	 getNotificationReviewNotes(organizationId);
	 getUserReviewActions(organizationId);
	 responedFlaggedReviews(organizationId);
	 getAdminReviewActions(organizationId);
	 getAllReviewResponse();
});

function setDefaults(){
	$("#from").datepicker("setDate","-1y");
	$("#to").datepicker("setDate",new Date());
	
	
}


/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	commonOrgPopulation(callback,'organizationName');
}
function  getNotificationReviews(selectedOrgId){
	$('#notificationReviewsDiv').html('');
	loadingForDashBoard();
	 $.ajax({
			type:"GET",
			url:"../notifications/getReviews.htm?organizationId="+selectedOrgId,
			contentType:"application/json",
			async:false,
			success:function(response){
				reviewNotifications=response.successObject.notificationReviews;
				unloadingForDashBoard();
				var html = "";
				if(response.successObject.notificationReviews.length>0){
					//$('#NotificationReviews').html(response.length+" Reviews Loaded").show();
					html +='<div class="col-md-12">';
					html +='<div><a class="SmallLightDarkBlueContentLink" href="#" onclick=redirectView("../notifications/getReviewsForNotifications.htm") id="NotificationReviews">'+response.successObject.notificationReviews.length+' Reviews Loaded.</a>';
					html +='</div>';
					html +='</div>';
					$('#notificationReviewsDiv').append(html).show();
				}/*else{
					$('#notificationReviewsDiv').hide();
					
				}*/
			},error:function(response){
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
			}
	});
}
function getNotificationReviewActions(selectedOrgId){
	$('#notificationReviewActionsDiv').html('');
	loadingForDashBoard();
	 $.ajax({
			type:"GET",
			url:"../notifications/getReviewActions.htm?organizationId="+selectedOrgId,
			contentType:"application/json",
			async:false,
			success:function(response){
				reviewUserActionNotification=response;
				var html = "";
				if(response.length>0){
					html +='<div class="col-md-12">';
					html +='<div><a class="SmallLightDarkBlueContentLink" href="#" onclick=redirectView("../notifications/reviewNotificationActions.htm") id="NotificationReviewActions">'+response.length+' Actions shared with you.</a>';
					html +='</div>';
					html +='</div>';
					$('#notificationReviewActionsDiv').append(html).show();
					//$('#NotificationReviewActions').html(response.length+" Actions shared with you").show();
					/*$("a[href='../notifications/reviewActions.htm']").click(function(e) {
					});*/
				}/*else{
					$('#notificationReviewActionsDiv').hide();
					
				}*/
			},error:function(response){
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
			}
	});
}

function getNotificationReviewNotes(selectedOrgId){
	loadingForDashBoard();
	$('#notificatinReiewNotesDiv').html('');
	 $.ajax({
			type:"GET",
			url:"../notifications/getReviewNotes.htm?organizationId="+selectedOrgId,
			contentType:"application/json",
			async:false,
			success:function(response){
				var html = "";
				reviewNotesNotification=response;
				if(response.length>0){
					html +='<div class="col-md-12">';
					html +='<div><a class="SmallLightDarkBlueContentLink" href="#" onclick=redirectView("../notifications/getNotificationReviewNotes.htm") id="NotificatinReiewNotes">'+response.length+' Notes shared with you.</a>';
					html +='</div>';
					html +='</div>';
					$('#notificatinReiewNotesDiv').append(html).show();
					//$('#NotificatinReiewNotes').html(response.length+" Notes shared with you").show();
					/*$("a[href='../notifications/reviewNotes.htm']").click(function(e) {
					});*/
				}/*else {
					$('#notificatinReiewNotesDiv').hide();
				}*/
			},error:function(response){
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
			}
	});
}

function getUserReviewActions(selectedOrgId){
	loadingForDashBoard();
	$('#userReviewActionsDiv').html('');
	 $.ajax({
			type:"GET",
			url:"../notifications/getReachedDeadLineReviewActions.htm?organizationId="+selectedOrgId,
			contentType:"application/json",
			async:false,
			success:function(response){
				reviewAdminActionNotification=response;
				var html ="";
				if(response.length>0){
					html +='<div class="col-md-12">';
					html +='<div><a class="SmallLightDarkBlueContentLink" href="#" onclick=redirectView("../notifications/userNotificationReviewActions.htm") id="userReviewActions">'+response.length+' Actions assigned by you has reached deadline.</a>';
					html +='</div>';
					html +='</div>';
					$('#userReviewActionsDiv').append(html).show();
					//$('#userReviewActions').html(response.length+" Actions assigned by you has reached deadline.").show();
					/*$("a[href='../notifications/userReviewActions.htm']").click(function(e) {
					});*/
				}/*else{
					$('#userReviewActionsDiv').hide();
					
				}*/
			},error:function(response){
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
			}
	});
}



function  responedFlaggedReviews(selectedOrgId){
	loadingForDashBoard();
	$('#responedFlaggedReviewsDiv').html('');
	 $.ajax({
			type:"GET",
			url:"../notifications/getResponedFlaggedReviews.htm?organizationId="+selectedOrgId,
			contentType:"application/json",
			async:false,
			success:function(response){
				var html = "";
				reviewRespondedFlaggedNotification=response;
				if(response.length>0){
					html +='<div class="col-md-12">';
					html +='<div><a class="SmallLightDarkBlueContentLink" href="#" onclick=redirectView("../notifications/responseFlaggedReviewsFromAdmin.htm") id="ResponedFlaggedReviews">'+response.length+' Response to your flagged reviews.</a>';
					html +='</div>';
					html +='</div>';
					$('#responedFlaggedReviewsDiv').append(html).show();
					
					//$('#ResponedFlaggedReviews').html(response.length+" Response to your flagged reviews").show();
					/*$("a[href='../notifications/responseFlaggedReviews.htm']").click(function(e) {
					});*/
				}/*else{
					$('#responedFlaggedReviewsDiv').hide();
					
				}*/
			},error:function(response){
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
			}
	});
}


function  getAdminReviewActions(selectedOrgId){
	loadingForDashBoard();
	$('#adminReviewActionsDiv').html('');
    $.ajax({
		type:"GET",
		url:"../notifications/getAdminReviewActions.htm?organizationId="+selectedOrgId,
		contentType:"application/json",
		async:false,
		success:function(response){
			var html = "";
		reviewAdminDeadlineReachedNotification=response;
			if(response.length>0){
				html +='<div class="col-md-12">';
				html +='<div><a class="SmallLightDarkBlueContentLink" href="#" onclick=redirectView("../notifications/adminReviewActions.htm") id="adminReviewActions">'+response.length+' Actions assigned by Admin.</a>';
				html +='</div>';
				html +='</div>';
				$('#adminReviewActionsDiv').append(html).show();
				}
		  },error:function(response){
           if (jqXHR.status === 0) {
              // alert('Not connect.\n Verify Network.');
           } else if (jqXHR.status == 404) {
              // alert('Requested page not found. [404]');
           } else if (jqXHR.status == 500) {
              // alert('Internal Server Error [500].');
           } else if (exception === 'parsererror') {
               //alert('Requested JSON parse failed.');
           } else if (exception === 'timeout') {
              // alert('Time out error.');
           } else if (exception === 'abort') {
               //alert('Ajax request aborted.');
           } else {
               //alert('Uncaught Error.\n' + jqXHR.responseText);
           }
		}
});
}

function getAllReviewResponse(){
	$('#notificationMessage').html('');
	if((reviewNotifications==0) && (reviewUserActionNotification==0) && (reviewAdminActionNotification==0) && (reviewAdminDeadlineReachedNotification==0) && (reviewNotesNotification==0) && (reviewRespondedFlaggedNotification==0))
		{
		$('#notificationMessage').append('<h4><font color="red">There is no new notification for you</font></h4>').show(600);
		unloadingForDashBoard();
		}else{
			$('#notificationMessage').html('');
			unloadingForDashBoard();
		}
}