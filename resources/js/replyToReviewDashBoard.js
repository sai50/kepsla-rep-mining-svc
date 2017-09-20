$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});
var reviewReplyAlertUrl = "../reviewReplyAlert/";
var organizationNameListResponse;
var organizationSourceName;
//*****organization Source Mapping Variables***************//
var organizationSourceMappingDataDiv = $('#organizationSourceMappingDataDiv');
var organizationSourceMappingTableId = $('#organizationSourceMappingTableId');
var selectedOrganizationSourceMappingIds = [];
var failedReplyIdList = [];
var failedReviewsData = {};


/**************************************************************************************************************************
 *                     List Failed Organizations                                                                       *
 **************************************************************************************************************************/
function organizationSourceMappingClick(){
	 $("#organizationSourceMappingButtonsDiv").html('');
	 $("#addAndEditOrganizationGroupDiv").hide();
	 $("#addAndEditOrganizationSourceMappingDiv").hide();
	 $("#organizationSourceMappingDataDiv").html('');
	 clearOrganizationSourceMappingMessagesDiv();
	// $("#editOrganizationSourceMappingSuccessDiv").hide();
		$('#page-wrapper').mask('Loading...');
		var JSONObject = {};
		orgId = "";
		sourceNameId = "";

    JSONObject = {"organizationId":orgId,"sourceId":sourceNameId};	
	
	$.ajax({
		type : "POST",
		url : "../reviewReplyAlert/getFullDetailsOfReplyFailedItems.htm",
		contentType : "application/json",
		data : JSON.stringify(JSONObject),
		success : function(response) {
			if(response.status=="SAVE_SUCCESS"){
				var failedAlerts = response.successObject.failedItems; 
				
				var failedUniqueOrgIds =  response.successObject.failedItems; 
				
				var arr = {};

				for ( var i=0, len=failedUniqueOrgIds.length; i < len; i++ ){
				    arr[failedUniqueOrgIds[i]['organizationId']] = failedUniqueOrgIds[i];
				}
				failedUniqueOrgIds = new Array();
				for ( var key in arr ){
					failedUniqueOrgIds.push(arr[key]);
				}
				
			 	
		var html="";
		html+=	'<div id="orgGroupFilterButtons">';
		html+=	'<form id="listOrganizationSourceMappingForm" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
		
		html+= '<label id="selectOrgID" class="control-label" style="width:21%" for="selectOrgID">OrgID <select id="selectOrgId" onchange="orgNameList()" class="form-control input-sm"   style="width: 130px;">';
		html+= '<option value="All">All</option>';
		 for(var i=0;i<failedUniqueOrgIds.length;i++){
				html+='<option value="'+failedUniqueOrgIds[i].organizationId+'">'+$.trim(failedUniqueOrgIds[i].organizationId)+'</option>';
				}
		html+= '</select>';
		html+= '</label>';
		
		html+=' <label id="selectOrgName" class="control-label" style="width:30%" for="selectOrgName">OrgName <select id="selectOrgNameId" onchange="orgIdList()" class="form-control input-sm"  style="width: 207px;">';
		html+='<option value="All">All</option>';
		for(var i=0;i<failedUniqueOrgIds.length;i++){
			html+='<option value="'+failedUniqueOrgIds[i].organizationId+'">'+$.trim(failedUniqueOrgIds[i].organizationName)+'</option>';
			}
		html+= '</select>';
		html+= '</label>';
		
		/**************for source name only************/
		 
		html+=' <label id="selectSourceName" class="control-label" style="width:24%" for="selectSourceName">SourceName <select id="selectSourceNameId" class="form-control input-sm"  disabled style="width: 130px;" onchange="clearMessage()">';
		html+='<option value="All">All</option>';
		for(var i=0;i<failedUniqueOrgIds.length;i++){
			html+='<option value="'+failedUniqueOrgIds[i].sourceName+'">'+$.trim(failedUniqueOrgIds[i].sourceName)+'</option>';
		 }
		html+= '</select>';
		html+= '</label>';

		html+='<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="organizationSourceMappingList()" value="View">';
		
		
		html+=		'<div class="form-group float-right">';
		html+=			'<button class="btn btn-primary statusUpdateButton float-right" type="button" onclick="updateMultipleReviewStatusById()">Update All</button>';
	//	html+=			'<a onclick="addOrganizationSourceMapping()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
		html+=		'</div>';
		
		html+=		'</form>';
		html+=	'</div>';
		$('#page-wrapper').unmask();
		$("#organizationSourceMappingButtonsDiv").append(html);
			}else{
				$('#organizationGroupDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
			}
		},
		error : function(response) {
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		}
});
	
        
          }

function clearMessage(){
	clearOrganizationSourceMappingMessagesDiv();
}
function orgNameList(){
	$('#page-wrapper').mask();
	clearOrganizationSourceMappingMessagesDiv();
	var orgId=$('#selectOrgId option:selected').val();
	var sourceNameId=$('#selectSourceNameId option:selected').val();
	$.ajaxSetup({ cache: false });
	$('#selectOrgName').html('');
	$('#orgGroupID').html('');
	$('#selectSourceName').html('');
	
	if(sourceNameId == "All"){
		sourceNameId = "";
	}
	
	if(orgId == "All"){
		orgId = "";
	}
	var JSONObject = {};

JSONObject = {"organizationId":orgId,"sourceId":sourceNameId};	
	
$.ajax({
	type : "POST",
	url : "../reviewReplyAlert/getFullDetailsOfReplyFailedItems.htm",
	contentType : "application/json",
	data : JSON.stringify(JSONObject),
	success : function(response) {
		if(response.status=="SAVE_SUCCESS"){
		var failedItems = response.successObject.failedItems;
		var html='';
		var html1='';
		var orgName;
		var organizationId;
		var sourceListId;
		var sourceListName;
		html+=' <label id="selectOrgName" class="control-label" style="width:290px" for="selectOrgName">OrgName <select id="selectOrgNameId" onchange="orgIdList()" class="form-control input-sm"  style="width: 200px;">';
		html1+=' <label id="selectSourceName" class="control-label" style="width:290px" for="selectSourceName">SourceName <select id="selectSourceNameId"  class="form-control input-sm"   style="width: 130px;"  onchange="clearMessage()">'; 
		for(var i=0;i<failedItems.length;i++){
			 if(orgId==failedItems[i].organizationId){
				  orgName=failedItems[i].organizationName;
				  organizationId=failedItems[i].organizationId;
				  sourceListId = failedItems[i].sourceId;
				  sourceListName = failedItems[i].sourceName;
				  
			 }
			 
			 
		}
		if(orgId==' '){
			orgName='All';
			organizationId='All';
			
		}	
		 if(organizationId>0){
				html += '<option style="display: none;" value='+organizationId+' >'+orgName+'</option>';
				html1+='<option value="'+sourceListId+'">'+sourceListName+'</option>';
				
			}
		 
		 else{
			 html+='<option value="All">All</option>';
		 for(var i=0;i<failedItems.length;i++){
			 
			 html+='<option value="'+failedItems[i].organizationId+'">'+$.trim(failedItems[i].organizationName)+'</option>';
			 html1+='<option value="'+failedItems[i].sourceId+'">'+$.trim(failedItems[i].sourceName)+'</option>';
		 }
		 
		 html1+='<option value="All">All</option>';
	     for(var i=0;i<failedItems.length;i++){
	    	 html1+='<option value="'+failedItems[i].sourceId+'">'+$.trim(failedItems[i].sourceName)+'</option>';
		}
		 
		 }
		 html+= '</select>';
		 html+= '</label>';
		$('#selectOrgName').append(html);
	
		
		html1+= '</select>';
		html1+= '</label>';
		$('#selectSourceName').append(html1);
		$('#page-wrapper').unmask();
	}else{
		$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
	}
}

});
		
	return false;
}

/************manoj**********/
function orgIdList(){
	$('#page-wrapper').mask();
	clearOrganizationSourceMappingMessagesDiv();
	var orgId=$('#selectOrgId option:selected').val();
	var selectOrgNameId=$('#selectOrgNameId option:selected').val();
	var sourceNameId=$('#selectSourceNameId option:selected').val();
	
	$.ajaxSetup({ cache: false });
	$('#selectOrgName').html('');
	$('#selectOrgID').html('');
	$('#selectSourceName').html('');
	
	if(sourceNameId == "All"){
		sourceNameId = "";
	}
	
	if(orgId == "All"){
		orgId = "";
	}
	var JSONObject = {};

JSONObject = {"organizationId":orgId,"sourceId":sourceNameId};	
	
$.ajax({
	type : "POST",
	url : "../reviewReplyAlert/getFullDetailsOfReplyFailedItems.htm",
	contentType : "application/json",
	data : JSON.stringify(JSONObject),
	success : function(response) {
		if(response.status=="SAVE_SUCCESS"){
			var failedItems = response.successObject.failedItems;
			var html2='';
			var html = '';
			var html1='';
			var orgName;
			var organizationId;
			var sourceListId;
			var sourceListName;
			html2+=  '<label id="selectOrgID" class="control-label" style="width:87%" for="selectOrgID">OrgID <select id="selectOrgId" onchange="orgNameList()" class="form-control input-sm"   style="width: 130px;">';
			html+=' <label id="selectOrgName" class="control-label" style="width:290px" for="selectOrgName">OrgName <select id="selectOrgNameId" onchange="orgIdList()" class="form-control input-sm"  style="width: 200px;">'; 
			html1+=' <label id="selectSourceName" class="control-label" style="width:290px" for="selectSourceName">SourceName <select id="selectSourceNameId"  class="form-control input-sm"   style="width: 130px;"  onchange="clearMessage()">';
			for(var i=0;i<failedItems.length;i++){
				 if(selectOrgNameId==failedItems[i].organizationId){
					  orgId=failedItems[i].organizationId;
					  organizationId=failedItems[i].organizationId;
					  sourceListId = failedItems[i].sourceId;
					  sourceListName = failedItems[i].sourceName;
				 }
			 } 
			    if(selectOrgNameId==''){
			    	orgId='All';
			    	organizationId='All';
			    }
			    if(organizationId>0){
			    	html2+= '<option style="display: none;" value='+organizationId+' >'+orgId+'</option>';
			    }
			    else{
			    html2+= '<option value="0">All</option>';
				 for(var i=0;i<failedItems.length;i++){
					 html2+='<option value="'+failedItems[i].organizationId+'">'+$.trim(failedItems[i].organizationId)+'</option>';
				 }
			    }
			    html2+= '</select>';
			    html2+= '</label>';
			 $('#selectOrgID').append(html2);
			    
			 var orgName;
			 var orgId1;
			
			 for(var i=0;i<failedItems.length;i++){
				 if(orgId==failedItems[i].organizationId){
					  orgName=failedItems[i].organizationName;
					  orgId1=failedItems[i].organizationId;
					  sourceListId = failedItems[i].sourceId;
					  sourceListName = failedItems[i].sourceName;
				 }
			 }
			 
			 if(selectOrgNameId==''){
				 orgName='ALL';
				 orgId1='All';
			 }
			
			 if(orgId1>0){
				 html += '<option style="display: none;" value='+orgId1+' >'+orgName+'</option>';
				 html1+='<option value="'+sourceListId+'">'+sourceListName+'</option>';
			 }
			 else{
			 html+='<option value="0">All</option>';
			 html1+='<option value="All">All</option>';
			 for(var i=0;i<failedItems.length;i++){
				 html+='<option value="'+failedItems[i].organizationId+'">'+$.trim(failedItems[i].organizationName)+'</option>';
			 }
			 for(var i=0;i<failedItems.length;i++){
		    	 html1+='<option value="'+failedItems[i].sourceId+'">'+$.trim(failedItems[i].sourceName)+'</option>';
		}
			 }
			 html+= '</select>';
			 html+= '</label>';
			$('#selectOrgName').append(html);			    
			 html1+= '</select>';
			 html1+= '</label>';
			$('#selectSourceName').append(html1);
			$('#page-wrapper').unmask();
				
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	}

	});
			
		return false;
	}

function organizationSourceMappingList(){
	
	 $("#addAndEditOrganizationGroupDiv").hide();
	 $("#addAndEditOrganizationSourceMappingDiv").hide();
	 
	var orgId=$('#selectOrgId option:selected').val();
	var sourceNameId=$('#selectSourceNameId option:selected').val();
	
	var JSONObject = {};
	if(orgId == "All"){
		orgId = "";
	}
	if(sourceNameId == "All"){
		sourceNameId = "";
	}
    JSONObject = {"organizationId":orgId,"sourceId":sourceNameId};	
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#organizationSourceMappingDataDiv').html('');
	
	$.ajax({
		type : "POST",
		url : "../reviewReplyAlert/getFullDetailsOfReplyFailedItems.htm",
		contentType : "application/json",
		data : JSON.stringify(JSONObject),
		success : function(response) {
			if(response.status=="SAVE_SUCCESS"){
				failedReviewsData = response;
				var html = listFailedReviewItems(response);
				$('#organizationSourceMappingDataDiv').append(html);
				$('#organizationSourceMappingListTable').dataTable();
				$('#page-wrapper').unmask();
			}else{
				$('#organizationSourceMappingDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
			}
		},
		error : function(response) {
			organizationSourceMappingDataDiv.mask(response.status+"**********"+response.statusText);
		}
});
	
	return false;
}
function listFailedReviewItems(response) {
	var failedReviewDetailsList = response.successObject.failedItems;
	var html = "";
	html += '<form id="organizationSourceMappingListForm">';
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteOrganizationSourceMappingSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;organizationSourceMapping Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationSourceMappingErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='organizationSourceMappingListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllOrganizationSourceMappingCheckBox" style="margin-left: -7px;"></th>';
	html +=	"<th>OrgID</th>";
	html +=	"<th>OrganizationFullName</th>";
	html +=	"<th>Source Name</th>";
	html +=	"<th>Reviewer Name </th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<failedReviewDetailsList.length;i++){
		var failedQueueId = failedReviewDetailsList[i].failedQueueId;
		var organizationId = failedReviewDetailsList[i].organizationId;
		var OrganizationFullName = failedReviewDetailsList[i].organizationName;
		var sourceName = failedReviewDetailsList[i].sourceName;
		var organizationSourceLink = failedReviewDetailsList[i].sourceUrl;
		var reviewSubject = failedReviewDetailsList[i].reviewSubject;
		var reviwerName = failedReviewDetailsList[i].reviwerName;
		var sourceLogin = failedReviewDetailsList[i].sourceLogin;
		var sourcePass = failedReviewDetailsList[i].sourcePass;
		var reviewText = failedReviewDetailsList[i].reviewText;
		var replyText = failedReviewDetailsList[i].reviewReplyText;
		
		if(organizationSourceLink==null || organizationSourceLink=='NULL' || organizationSourceLink=='null'|| organizationSourceLink=='Null'){
			organizationSourceLink="";
		}
		var temp= organizationSourceLink;
		
		
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" value='+failedQueueId+'></td>';
		html+=	'<td>'+organizationId+'</td>';
		html+=	'<td>'+OrganizationFullName+'</td>';
		html+=	'<td>'+sourceName+'</td>';
		html+=	'<td>'+reviwerName+'</td>';
		html+=	'<td><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="viewDetailFailedReview('+failedQueueId+')"><span aria-hidden="true" >View Details</span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("OrganizationSourceMapping");
	return html;

}

function updateMultipleReviewStatusById(){
	var failedReplyIdList = [];
	var JSONObject = {};
	selectedOrganizationSourceMappingIds=[];
	 $.ajaxSetup({ cache: false });
	selectedOrganizationSourceMappingCheckBoxLength();
	if(selectedOrganizationSourceMappingIds.length>0){
		for(i=0;i<selectedOrganizationSourceMappingIds.length; i++){
					
			failedReplyIdList.push(+(selectedOrganizationSourceMappingIds[i]));
			
			//alert(failedReplyIdList);
		}
		JSONObject = {"failedReplyIdList":failedReplyIdList}
	}else{
		$('#organizationSourceMappingSuccessModalTitle').text("Alert!");
		$('#organizationSourceMappingSuccessModalText').text("Please Select a Record.");
		$('#organizationSourceMappingSuccessModal').modal('show');
		return;
	}
	
	$.ajax({
		type : "POST",
		url : "../reviewReplyAlert/updateFailedItems.htm",
		contentType : "application/json",
		data : JSON.stringify(JSONObject),
		success : function(response) {
			if(response.status=="SAVE_SUCCESS"){
				organizationSourceMappingList();	
			
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	}

	});
	
}

	function updateSingleReviewStatusById(failedQueueId){
		var failedReplyIdList = [];
		var JSONObject = {};
		failedReplyIdList.push(+failedQueueId);
		JSONObject = {"failedReplyIdList":failedReplyIdList}

			$.ajax({
				type : "POST",
				url : "../reviewReplyAlert/updateFailedItems.htm",
				contentType : "application/json",
				data : JSON.stringify(JSONObject),
				success : function(response) {
					if(response.status=="SAVE_SUCCESS"){
						organizationSourceMappingList();		
					
				}else{
					$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
				}
			}

			});
		}
	



/**************************************************************************************************************************
 *                    View Details of the Failed Reviews                                                                              *
 **************************************************************************************************************************/
function viewDetailFailedReview(failedId){
	$('#page-wrapper').mask('Loading...');
	$('#addAndEditOrganizationSourceMappingDiv').hide();
		var html = organizationSourceMappingEditFormHtml(failedId);
		var divId = $('#'+getDivId("OrganizationSourceMapping"));
		appendOrganizationSourceMappingAddOrEditForm(divId, html);
	return false;
}
function organizationSourceMappingEditFormHtml(failedId){	
	var organizationId ;
	var organizationFullName;
	var sourceName ;
	var organizationSourceLink ;
	var reviewSubject ;
	var reviwerName ;
	var sourceLogin ;
	var sourcePass  ;
	var reviewText ;
	var replyText;
	var ErrorStack ;
	
	var failedReviewDetailedData = failedReviewsData.successObject.failedItems;
	
	for(var i=0;i<failedReviewDetailedData.length;i++){
		if(failedId == failedReviewDetailedData[i].failedQueueId){
			var organizationId = failedReviewDetailedData[i].organizationId;
			var organizationFullName = failedReviewDetailedData[i].organizationName;
			var sourceName = failedReviewDetailedData[i].sourceName;
			var organizationSourceLink = failedReviewDetailedData[i].sourceUrl;
			var reviewSubject = failedReviewDetailedData[i].reviewSubject;
			var reviwerName = failedReviewDetailedData[i].reviwerName;
			var sourceLogin = failedReviewDetailedData[i].sourceLogin;
			var sourcePass = failedReviewDetailedData[i].sourcePass;
			var reviewText = failedReviewDetailedData[i].reviewText;
			var replyText = failedReviewDetailedData[i].reviewReplyText;
			var ErrorStack = failedReviewDetailedData[i].failedReason;
		}	
		
	}
	
	
	
		
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html +=	'<h4>Review Details</h4>';
	html+=	'</div>';
	html += '<form class="col-sm-5 col-md-12" id="editOrganizationSourceMappingForm">';
	
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editOrganizationSourceMappingErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Organization Name : <font style="color: red">*</font></label>';
	html +=	'<span class="form-control ReviewDetails" id="editOrganizationName">';
		html+=	''+organizationFullName+'';
	html +=	'</span>';
	html += '</div>';
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Source Name :<font style="color: red">*</font></label>';
	html +=	'<span class="form-control ReviewDetails " id="editedSourceNameId" >';
		html+=	''+sourceName+'';
	html +=	'</span>';
	html += '</div>';
	

	
	/** ************************************Username***************************************************** */
	html += '<div class="form-group" id="Edit-organizationUsername-Error">';
	html += '<label>Username :</label>';
	html += '<span style="color: #a94442" id="edit-organizationUsername-span-Error" class="help-inline"></span>';
		if(sourceLogin==null)
		{
			sourceLogin="";
		}
		html += '<span class="form-control ReviewDetails" id="editedOrganizationUsername"  maxlength="50"  readonly> '+ sourceLogin  +' </span>';
	
	html += '</div>';
	
	
	/** ************************************Password***************************************************** */
	html += '<div class="form-group" id="Edit-organizationPassword-Error">';
	html += '<label>Password :</label>';
	html += '<span style="color: #a94442" id="edit-organizationPassword-span-Error" class="help-inline"></span>';
		if(sourcePass==null)
		{
			sourcePass="";
		}
		html += '<span class="form-control ReviewDetails" id="editedOrganizationPassword" maxlength="50"  readonly > '+sourcePass +'</span>';	
	html += '</div>';
	/** ************************************Source URL***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Source URL :</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';
		if(organizationSourceLink==null)
		{
			organizationSourceLink="";
		}
		html += '<span  class="form-control ReviewDetails" id="editedOrganizationSourceLink"   readonly > '+organizationSourceLink+' </span>';
	
	html += '</div>';
	/** ************************************Source URL END***************************************************** */
	
	/** ************************************Review Name***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Reviewer Name :</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';
			html += '<span  class="form-control ReviewDetails" id="editedOrganizationSourceLink"  maxlength="2000"  readonly > '+reviwerName+' </span>';
	html += '</div>';
	
	/** ************************************Review Subject***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Review Subject :</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';

			html += '<span  class="form-control ReviewDetails" id="editedOrganizationSourceLink"  maxlength="2000"  readonly > '+reviewSubject+' </span>';

	html += '</div>';
	
	/** ************************************Review Content***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Review Content :</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';

			html += '<span  class="form-control ReviewDetails" id="editedOrganizationSourceLink"  maxlength="2000"  readonly > '+reviewText+' </span>';

	html += '</div>';
	
	
	/** ************************************Reply Text***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Reply Text :</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';

			html += '<span  class="form-control ReviewDetails" id="editedOrganizationSourceLink"  maxlength="2000"  readonly > '+replyText+' </span>';

	html += '</div>';
	
	/** ************************************Error Stack***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Error Stack :</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';

			html += '<span  class="form-control ReviewDetails" id="editedOrganizationSourceLink"  maxlength="20000"  readonly > '+ErrorStack+' </span>';

	html += '</div>';
	
	
	/** ************************************Button***************************************************** */
	
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateSingleReviewStatusById('+failedId+')">';
	html+=	appendCancelButton(getDivId("OrganizationSourceMapping"));
	
	html +=	'</form>';
	return html;
}


/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllOrganizationSourceMappingCheckBox",function(){
    $('.organizationSourceMappingCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".organizationSourceMappingCheckBox",function(){
    if($('.organizationSourceMappingCheckBox:checked').length == $('.organizationSourceMappingCheckBox').length) {
      $('#checkAllOrganizationSourceMappingCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllOrganizationSourceMappingCheckBox').prop('checked', false);
    }
});

function selectedOrganizationSourceMappingCheckBoxLength() {
	if ($('.organizationSourceMappingCheckBox:checked').length) {
		selectedGeoCountryIds = [];
		$('.organizationSourceMappingCheckBox:checked').each(function() {
			selectedOrganizationSourceMappingIds.push($(this).val());
		});
	}
	return false;
}


function appendOrganizationSourceMappingAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearOrganizationSourceMappingMessagesDiv();
	maskId.unmask();
}
function clearOrganizationSourceMappingMessagesDiv(){
	$('#addOrganizationSourceMappingSuccessDiv,#editOrganizationSourceMappingSuccessDiv,#deleteOrganizationSourceMappingSuccessDiv,#deleteOrganizationSourceMappingErrorDiv').hide(600);
}
