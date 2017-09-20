$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});
var organizationSourceMappingUrl = "../organizationSourceMapping/";
var organizationNameListResponse;
var organizationSourceName;
//*****organization Source Mapping Variables***************//
var organizationSourceMappingDataDiv = $('#organizationSourceMappingDataDiv');
var organizationSourceMappingTableId = $('#organizationSourceMappingTableId');
var selectedOrganizationSourceMappingIds = [];


/**************************************************************************************************************************
 *                     List Organization Source Mapping                                                                         *
 **************************************************************************************************************************/
/***********************start by manoj***********************21-01********************************/
function organizationSourceMappingClick(){
	$("#organizationSourceMappingButtonsDiv").html('');
	 $("#addAndEditOrganizationGroupDiv").hide();
	 $("#addAndEditOrganizationSourceMappingDiv").hide();
	 $("#organizationSourceMappingDataDiv").html('');
	 clearOrganizationSourceMappingMessagesDiv();
	// $("#editOrganizationSourceMappingSuccessDiv").hide();
		$('#page-wrapper').mask('Loading...');
		 $.get(organizationSourceMappingUrl+"listOrg.htm?sourceMasterFilter=filter",function(response){
			if(response.status=="LIST_SUCCESS"){
				var listOrgIdAndName = response.successObject.listOrgIdAndName; 
				var sourceList = response.successObject.sourceList; 
				
		var html="";

		html+=	'<form id="listOrganizationSourceMappingForm" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
		
		html+= '<label id="selectOrgID" class="control-label" style="width:21%" for="selectOrgID">OrgID <select id="selectOrgId" onchange="orgNameList()" class="form-control input-sm"   style="width: 130px;">';
		html+= '<option value="0">All</option>';
		 for(var i=0;i<listOrgIdAndName.length;i++){
				html+='<option value="'+listOrgIdAndName[i].id+'">'+$.trim(listOrgIdAndName[i].id)+'</option>';
				}
		html+= '</select>';
		html+= '</label>';
		
		html+=' <label id="selectOrgName" class="control-label" style="width:30%" for="selectOrgName">OrgName <select id="selectOrgNameId" onchange=" orgIdList()" class="form-control input-sm"  style="width: 207px;">';
		html+='<option value="0">All</option>';
		for(var i=0;i<listOrgIdAndName.length;i++){
			html+='<option value="'+listOrgIdAndName[i].id+'">'+$.trim(listOrgIdAndName[i].organizationFullName)+'</option>';
			}
		html+= '</select>';
		html+= '</label>';
		
		/**************for source name only************/
		 
		html+=' <label id="selectSourceName" class="control-label" style="width:24%" for="selectSourceName">SourceName <select id="selectSourceNameId" class="form-control input-sm" disabled  style="width: 130px;" onchange="clearMessage()">';
		html+='<option value="0">All</option>';
		for(var i=0;i<sourceList.length;i++){
			html+='<option value="'+sourceList[i].sourceName+'">'+$.trim(sourceList[i].sourceName)+'</option>';
		 }
		html+= '</select>';
		html+= '</label>';

		html+='<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="organizationSourceMappingList()" value="View">';
		
		
		html+=		'<div class="form-group float-right">';
		html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteOrganizationSourceMapping()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
		html+=			'<a onclick="addOrganizationSourceMapping()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
		html+=		'</div>';
		html+=		'</form>';
		
		
		$('#page-wrapper').unmask();
		$("#organizationSourceMappingButtonsDiv").append(html);
			 }else{
				$('#organizationSourceMappingButtonsDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
			}  
		
          },'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		});
        
          }
/************manoj**********/

function clearMessage(){
	clearOrganizationSourceMappingMessagesDiv();
}
function orgNameList(){
	$('#page-wrapper').mask();
/*	$('#editOrganizationSourceMappingSuccessDiv').hide();
	$('#deleteOrganizationSourceMappingSuccessDiv').hide();*/
	clearOrganizationSourceMappingMessagesDiv();
	var orgId=$('#selectOrgId option:selected').val();
	var selectOrgNameId=$('#selectOrgNameId option:selected').val();
	$.ajaxSetup({ cache: false });
	$('#selectOrgName').html('');
	$('#orgGroupID').html('');
	$('#selectSourceName').html('');
		$.get("../organizationSourceMapping/orgNameOnId.htm?orgId="+orgId+"&sourceMasterFilter=filter",function(response){
		if(response.status=="LIST_SUCCESS"){	
		var listOrganizationSourceMapping = response.successObject.listOrganizationSourceMapping;
		var listOrgIdAndName = response.successObject.listOrgIdAndName;
		var html='';
		var orgName;
		var organizationId;
		html+=' <label id="selectOrgName" class="control-label" style="width:290px" for="selectOrgName">OrgName <select id="selectOrgNameId" onchange="orgIdList()" class="form-control input-sm"  style="width: 200px;">';
		 for(var i=0;i<listOrgIdAndName.length;i++){
			 if(orgId==listOrgIdAndName[i].id){
				  orgName=listOrgIdAndName[i].organizationFullName;
				  organizationId=listOrgIdAndName[i].id;
			 }
		}
		if(orgId==0){
			orgName='ALL';
			organizationId=0;
			//organizationSourceMappingClick();
			
		}	
		 if(organizationId>0){
				html += '<option style="display: none;" value='+organizationId+' >'+orgName+'</option>';
			}
		 html+='<option value="0">All</option>';
		 for(var i=0;i<listOrgIdAndName.length;i++){
			 html+='<option value="'+listOrgIdAndName[i].id+'">'+$.trim(listOrgIdAndName[i].organizationFullName)+'</option>';
		 }
		 html+= '</select>';
		 html+= '</label>';
		$('#selectOrgName').append(html);
	
		var html1='';
		html1+=' <label id="selectSourceName" class="control-label" style="width:290px" for="selectSourceName">SourceName <select id="selectSourceNameId"  class="form-control input-sm"   style="width: 130px;"  onchange="clearMessage()">';
		html1+='<option value="0">All</option>';
		     for(var i=0;i<listOrganizationSourceMapping.length;i++){
		    	 html1+='<option value="'+listOrganizationSourceMapping[i].sourceId+'">'+$.trim(listOrganizationSourceMapping[i].sourceName)+'</option>';
		}
		html1+= '</select>';
		html1+= '</label>';
		$('#selectSourceName').append(html1);
		$('#page-wrapper').unmask();
	}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	});
	return false;
}

/************manoj**********/
function orgIdList(){
	$('#page-wrapper').mask();
	/*$('#editOrganizationSourceMappingSuccessDiv').hide();
	$('#deleteOrganizationSourceMappingSuccessDiv').hide();*/
	clearOrganizationSourceMappingMessagesDiv();
	var orgId=$('#selectOrgId option:selected').val();
	var selectOrgNameId=$('#selectOrgNameId option:selected').val();
	
	$.ajaxSetup({ cache: false });
	$('#selectOrgName').html('');
	$('#selectOrgID').html('');
	$('#selectSourceName').html('');
		$.get("../organizationSourceMapping/orgNameOnId.htm?orgId="+selectOrgNameId+"&sourceMasterFilter=filter",function(response){
		if(response.status=="LIST_SUCCESS"){
			
			var listOrganizationSourceMapping = response.successObject.listOrganizationSourceMapping;
			var listOrgIdAndName = response.successObject.listOrgIdAndName;
			var html2='';
			var organizationId;
			html2+=  '<label id="selectOrgID" class="control-label" style="width:87%" for="selectOrgID">OrgID <select id="selectOrgId" onchange="orgNameList()" class="form-control input-sm"   style="width: 130px;">';
			 for(var i=0;i<listOrgIdAndName.length;i++){
				 if(selectOrgNameId==listOrgIdAndName[i].id){
					 orgId=listOrgIdAndName[i].id;
					  organizationId=listOrgIdAndName[i].id;
				 }
			 } 
			    if(selectOrgNameId==0){
			    	orgId='All';
			    	organizationId=0;
			    	//organizationSourceMappingClick();
			    }
			    if(organizationId>0){
			    	html2+= '<option style="display: none;" value='+organizationId+' >'+orgId+'</option>';
			    }
			    html2+= '<option value="0">All</option>';
				 //html2+='<option value="'+orgId+'">'+$.trim(orgId)+'</option>';
				 for(var i=0;i<listOrgIdAndName.length;i++){
					 html2+='<option value="'+listOrgIdAndName[i].id+'">'+$.trim(listOrgIdAndName[i].id)+'</option>';
				 }
    			//html2+= '<option value="0">All</option>';
			    html2+= '</select>';
			    html2+= '</label>';
			 $('#selectOrgID').append(html2);
			    
			 var html='';
			 var orgName;
			 var orgId1;
			 html+=' <label id="selectOrgName" class="control-label" style="width:290px" for="selectOrgName">OrgName <select id="selectOrgNameId" onchange="orgIdList()" class="form-control input-sm"  style="width: 200px;">';
			 for(var i=0;i<listOrgIdAndName.length;i++){
				 if(orgId==listOrgIdAndName[i].id){
					  orgName=listOrgIdAndName[i].organizationFullName;
					  orgId1=listOrgIdAndName[i].id;
				 }
			 }
			 
			 if(selectOrgNameId==0){
				 orgName='ALL';
				 orgId1=0;
			 }
			
			 if(orgId1>0){
				 html += '<option style="display: none;" value='+orgId1+' >'+orgName+'</option>';
			 }
			 html+='<option value="0">All</option>';
			// html+='<option value="'+orgName+'">'+$.trim(orgName)+'</option>';
			 for(var i=0;i<listOrgIdAndName.length;i++){
				 html+='<option value="'+listOrgIdAndName[i].id+'">'+$.trim(listOrgIdAndName[i].organizationFullName)+'</option>';
			 }
			 //html+='<option value="0">All</option>';
			 html+= '</select>';
			 html+= '</label>';
			$('#selectOrgName').append(html);
			
			 var html1='';
			 html1+=' <label id="selectSourceName" class="control-label" style="width:290px" for="selectSourceName">SourceName <select id="selectSourceNameId"  class="form-control input-sm"   style="width: 130px;"  onchange="clearMessage()">';
			 html1+='<option value="0">All</option>';
			     for(var i=0;i<listOrganizationSourceMapping.length;i++){
			    	 html1+='<option value="'+listOrganizationSourceMapping[i].sourceId+'">'+$.trim(listOrganizationSourceMapping[i].sourceName)+'</option>';
			}
			 html1+= '</select>';
			 html1+= '</label>';
			$('#selectSourceName').append(html1);
			$('#page-wrapper').unmask();
		

			
		
			
			
			
			
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}
//end by manoj

function organizationSourceMappingList(){
	
	 $("#addAndEditOrganizationGroupDiv").hide();
	 $("#addAndEditOrganizationSourceMappingDiv").hide();
	 
	var orgId=$('#selectOrgId option:selected').val();
	var sourceNameId=$('#selectSourceNameId option:selected').val();
	
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#organizationSourceMappingDataDiv').html('');
	$.get(organizationSourceMappingUrl+"viewTable.htm?orgId="+orgId+"&sourceNameId="+sourceNameId+"&sourceMasterFilter=filter",function(response){
		if(response.status=="LIST_SUCCESS"){
			
			var html = listOrganizationSourceMappingHtml(response);
			$('#organizationSourceMappingDataDiv').append(html);
			$('#organizationSourceMappingListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#organizationSourceMappingDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	},'json').fail(function(response){
		organizationSourceMappingDataDiv.mask(response.status+"**********"+response.statusText);
	});
	return false;
}
function listOrganizationSourceMappingHtml(response) {
	var organizationSourceMappingMasterList = response.successObject.listOrganizationSourceMapping;
	var listOrgIdAndName = response.successObject.listOrgIdAndName;
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
	html +=	"<th>Source Mapping Attribute</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<organizationSourceMappingMasterList.length;i++){
		var id = organizationSourceMappingMasterList[i].id;
		var organizationId = organizationSourceMappingMasterList[i].organizationId;
		var OrganizationFullName = organizationSourceMappingMasterList[i].organizationFullName;
		var SourceType = organizationSourceMappingMasterList[i].sourceType;
		var sourceName = organizationSourceMappingMasterList[i].sourceName;
		var SourcePriority = organizationSourceMappingMasterList[i].priority;
		if(SourcePriority==null){
			SourcePriority="";
		}
		var organizationSourceLink = organizationSourceMappingMasterList[i].organizationSourceLink;
		var apiKey = organizationSourceMappingMasterList[i].apiKey;
		if(apiKey==null || apiKey=='NULL' || apiKey=='null'|| apiKey=='Null'){
			apiKey="";
		}
		
		if(organizationSourceLink==null || organizationSourceLink=='NULL' || organizationSourceLink=='null'|| organizationSourceLink=='Null'){
			organizationSourceLink="";
		}
		var temp="";
		
		temp = organizationSourceLink+"|"+apiKey;
		if(temp == "|") temp="";
		
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" value='+id+'></td>';
		html+=	'<td>'+organizationId+'</td>';
		html+=	'<td>'+OrganizationFullName+'</td>';
		html+=	'<td>'+sourceName+'</td>';
		html+=	'<td>'+temp+'</td>';
		html+=	'<td><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editOrganizationSourceMapping('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("OrganizationSourceMapping");
	return html;

}

/**************************************************************************************************************************
 *                      Add Organization Source Mapping                                                                             *
 **************************************************************************************************************************/
function addOrganizationSourceMapping(){
	//$('#organizationSourceMappingListForm').hide();//@d
	$('#addAndEditOrganizationSourceMappingDiv').hide();
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$.get(organizationSourceMappingUrl + "add.htm?sourceMasterFilter=filter", function(response) {
		var html = addOrganizationSourceMappingFormHtml(response);
		var divId = $('#'+getDivId("OrganizationSourceMapping"));
		appendOrganizationSourceMappingAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"*************"+response.statusText);
	});
	return false;
}
function addOrganizationSourceMappingFormHtml(response){
	var organizationNameList = response.successObject.organizationFullNameList;
	organizationNameListResponse=organizationNameList;
	var sourceNameList = response.successObject.sourceNameList;
	//var priorityNameList = response.successObject.priorityNameList;
	
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html += '<h4>Add Source Login Credentials</h4>';
	html+='<div>';
	html+=	'<form class="col-sm-5" id="addOrganizationSourceMappingForm">';
	/** ***********************************Sucess Div******************************************************** */
	/*html += '<div class="alert alert-success" style="display: none;"	id="addOrganizationSourceMappingSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png">Organization Source Mapping Added Successfully</strong>';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addOrganizationSourceMappingErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Name***************************************************** */
	if(organizationNameList.length>0){	
		html += '<div class="form-group">';
		html += '<label>Organization Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm" id="organizationFullNameId">';
		html += '<option  value="0">---------------------SELECT--------------------</option>';
		for(var i=0;i<organizationNameList.length;i++){
			var id = organizationNameList[i].id;
			var organizationName = organizationNameList[i].organizationFullName;
			html+=	'<option value='+id+'>'+organizationName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>Organization Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm" disabled="disabled"><option>No Countries Found</option></select>';
		html += '</div>';
	}
	
	/** ************************************Source Name***************************************************** */
	if(sourceNameList.length>0){
		html += '<div class="form-group" id="Add-sourceName-Error">';
		html += '<label>Source Name<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="sourceName-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control input-sm" id="sourceNameId" onChange="addMoreFields()">';
		html += '<option  value="0">---------------------SELECT--------------------</option>';
		for(var i=0;i<sourceNameList.length;i++){
			var id = sourceNameList[i].id;
			var sourceName = sourceNameList[i].sourceName;
			html+=	'<option value='+id+'>'+sourceName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
		
		
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>Source Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm" disabled="disabled"><option>No source Name Found</option></select>';
		html += '</div>';
	}
	
	/** ************************************Username***************************************************** */
	html +='<div id="organizationUsernameDiv">';
	html += '<div class="form-group" id="Add-organizationUsername-Error">';
	html += '<label>Username</label>';
	html += '<span style="color: #a94442" id="organizationUsername-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationUsername" placeholder="Enter Username" maxlength="50">';
	html += '</div>';
	

	/** ************************************Password**************************************************** */
	html +='<div id="organizationPasswordDiv">';
	html += '<div class="form-group" id="Add-organizationPassword-Error">';
	html += '<label>Password</label>';
	html += '<span style="color: #a94442" id="organizationPassword-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationPassword" placeholder="Enter Password" maxlength="50">';
	html += '</div>';
	
	
	
	/** ************************************Source URL (Reply to review)********by manoj 01-02-16********************************************* */
	html +='<div id="sourceUrlDiv">';
	html += '<div class="form-group" id="Add-sourceUrl-Error">';
	html += '<label>Source URL(ReplyToReview)</label>';
	html += '<span style="color: #a94442" id="sourceUrl-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sourceUrl" placeholder="Enter Source URL(ReplyToReview)" maxlength="200">';
	html += '</div>';
	
	
	
	/** ************************************Button***************************************************** */
	if(organizationNameList.length>0){
		html += '<input type="button" id="btnSaveOrganizationSourceMapping" class="btn btn-primary" value="Add" onclick ="saveOrganizationSourceMapping()">';
	}else{
		html += '<input type="button" id="btnSaveOrganizationSourceMapping" class="btn btn-primary" value="Add" disabled="disabled">';
	}
	html+=	appendCancelButton(getDivId("OrganizationSourceMapping"));
	html += '</div>';
	html += '</form>';
	return html;
}


function addMoreFields(){
	var sourceId = $('#sourceNameId option:selected').val();
	var selectedSourceName = $('#sourceNameId option:selected').text();
	var organizationNameId=$("#organizationFullNameId option:selected").val();
	$("#apiAndSecretKeyDiv").html('');
	$("#btnSaveOrganizationSourceMapping").html('');
	var html='';
	if(sourceId>0 && organizationNameId>0 && selectedSourceName=="Twitter"){
		
		/** ************************************Api Key***************************************************** */
		html +='<div id="twitterDiv">';
		html += '<div class="form-group" id="Add-ApiKey">';
		html += '<label>Consumer Key</label>';
		html += '<span style="color: #a94442" id="apiKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="apiKey" placeholder="Enter Consumer Key" maxlength="50">';
		html += '</div>';
		/** ************************************Secret Key***************************************************** */
		html += '<div class="form-group" id="Add-SecretKey">';
		html += '<label>Consumer Secret</label>';
		html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="secretKey" placeholder="Enter Consumer Secret" maxlength="50">';
		html += '</div>';
		
		/** ************************************Api Key***************************************************** */
		html += '<div class="form-group" id="Add-AccessToken-Error">';
		html += '<label>Access Token</label>';
		html += '<span style="color: #a94442" id="accessToken-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="accessToken" placeholder="Enter Access Token" maxlength="50">';
		html += '</div>';
		/** ************************************Secret Key***************************************************** */
		html += '<div class="form-group" id="Add-AccessTokenSecret-Error">';
		html += '<label>Access Token Secret</label>';
		html += '<span style="color: #a94442" id="accessTokenSecret-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="accessTokenSecret" placeholder="Enter Access Token Secret" maxlength="50">';
		html += '</div>';
		html += '</div>';
		$("#twitterDiv").append(html);
	}else{
		
		/** ************************************Api Key***************************************************** */
		html += '<div class="form-group" id="Add-ApiKey-Error">';
		html += '<label>Api Key</label>';
		html += '<span style="color: #a94442" id="apiKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="apiKey" placeholder="Enter Api Key" maxlength="50">';
		html += '</div>';
		/** ************************************Secret Key***************************************************** */
		html += '<div class="form-group" id="Add-SecretKey-Error">';
		html += '<label>APP Secret Key</label>';
		html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="secretKey" placeholder="Enter Secret Key" maxlength="50">';
		html += '</div>';
		$("#twitterDiv").append(html);
		/** ************************************Page ID**************by manoj 01-02-16*************************************** */
		html += '<div class="form-group" id="Add-SecretKey-Error">';
		html += '<label>Page ID</label>';
		html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="pageID" placeholder="Enter Secret Key" maxlength="50">';
		html += '</div>';
		
		/** ************************************Token Secret Key***********by manoj 01-02-16****************************************** */
		html += '<div class="form-group" id="Add-SecretKey-Error">';
		html += '<label>Token Secret Key</label>';
		html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="accessTokenSecret" placeholder="Enter Secret Key" maxlength="50">';
		html += '</div>';
	}
/** ************************************Button***************************************************** */	
	if(organizationNameListResponse.length>0){
		html += '<input type="button" id="btnSaveOrganizationSourceMapping" class="btn btn-primary" value="Add" onclick ="saveOrganizationSourceMapping()">';
	}else{
		html += '<input type="button" id="btnSaveOrganizationSourceMapping" class="btn btn-primary" value="Add" disabled="disabled">';
	}
	html+=	appendCancelButton(getDivId("OrganizationSourceMapping"));
	html += '</form>';
	$("#apiAndSecretKeyDiv").append(html);
}


/**************************************************************************************************************************
 *                      SAVE Organization Source Mapping                                                                             *
 **************************************************************************************************************************/

function saveOrganizationSourceMapping (){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("OrganizationSourceMapping"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addOrganizationSourceMappingSuccessDiv').hide();
	$('#addOrganizationSourceMappingErrorDiv').hide();
	
	var organizationId = $('#organizationFullNameId option:selected').val();
	var sourceId = $('#sourceNameId option:selected').val();
	var organizationUserName = $.trim($('#organizationUsername').val());
	var organizationPassword = $.trim($('#organizationPassword').val());
	var sourceUrl = $.trim($('#sourceUrl').val());
	if(organizationId>0 && sourceId>0){
	var JSONObject = {};
	JSONObject['organizationId'] = organizationId;
	JSONObject['sourceId'] = sourceId;
	JSONObject['sourceLogin'] = organizationUserName;
	JSONObject['sourcePass'] = organizationPassword;
	JSONObject['sourceUrl'] = sourceUrl;
	JSONObject['organizationScrapingName'] = $('#organizationFullNameId option:selected').text();
	JSONObject['priority'] = 'HIGH';
	
	$.post(organizationSourceMappingUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addOrganizationSourceMappingSuccessDiv').show(600);
			$('#page-wrapper').unmask();
			organizationSourceMappingList();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(divId);
			$('#addOrganizationSourceMappingErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
	}else{
		$('#organizationSourceMappingSuccessModalTitle').text("Alert");
		$('#organizationSourceMappingSuccessModalText').text("Mandatory fileds(*) are required !");
		$('#organizationSourceMappingSuccessModal').modal('show');
		$('#page-wrapper').unmask();
		return;
	}
}

/**************************************************************************************************************************
 *                    Edit Organization SOurce Mapping		                                                                              *
 **************************************************************************************************************************/
function editOrganizationSourceMapping(id){
	$('#page-wrapper').mask('Loading...');
	$('#addAndEditOrganizationSourceMappingDiv').hide();
	$.get(organizationSourceMappingUrl+"editRecord.htm?id="+id,function(response){
		var html = organizationSourceMappingEditFormHtml(response,id);
		var divId = $('#'+getDivId("OrganizationSourceMapping"));
		appendOrganizationSourceMappingAddOrEditForm(divId, html);
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function organizationSourceMappingEditFormHtml(response,id){
	var selectedId=id;
	var organizationFullNameList = response.successObject.organizationFullNameList;
	var sourceNameList = response.successObject.organizationFullNameList;
	var organizationScrapingNameList = response.successObject.organizationSourceMappingEditRecord;
	
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html +=	'<h4>Edit organization Source Mapping</h4>';
	html+=	'</div>';
	html += '<form class="col-sm-5" id="editOrganizationSourceMappingForm">';
	/** ***********************************Sucess Div******************************************************** */
	/*html += '<div class="alert alert-success" style="display: none;"	id="editOrganizationSourceMappingSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> organization Source Mapping Updated Successfully';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editOrganizationSourceMappingErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Organization Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control input-sm" id="editOrganizationName" disabled="disabled">';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationFullName = organizationScrapingNameList[i].organizationFullName;
		var organizationId =  organizationScrapingNameList[i].organizationId;
		var organizationSelectedId=organizationScrapingNameList[i].id;
		html+=	'<option value='+organizationId+'>'+organizationFullName+'</option>';
		/*if(id==organizationSelectedId){
			html+=	'<option value='+organizationId+'>'+organizationFullName+'</option>';
			break;
		}	*/
	}
	html +=	'</select>';
	html += '</div>';
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control input-sm" id="editedSourceNameId" disabled="disabled">';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var sourceName = organizationScrapingNameList[i].sourceName;
		var sourceId = organizationScrapingNameList[i].sourceId;
		var sourceSelectedId=organizationScrapingNameList[i].id;
		html+=	'<option value='+sourceId+'>'+sourceName+'</option>';
		organizationSourceName=sourceName;
		/*if(id==sourceSelectedId){
			html+=	'<option value='+sourceId+'>'+sourceName+'</option>';
			organizationSourceName=sourceName;
			break;
		}*/
	}
	html +=	'</select>';
	html += '</div>';
	
	//@m edit
	/** ************************************ Priority***************************************************** */
	html += '<div class="form-group" id="Edit-priority-Error">';
	html +=	'<select style="display:none;"  class="form-control input-sm" id="editedPriority">';
	//html += '<option  value="0"></option>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var id = organizationScrapingNameList[i].id;
		var priority = organizationScrapingNameList[i].priority;
	
		if(priority == null || priority ==''){
		html += '<option  value="0">--------SELECT--------</option>';
		html+=	'<option value="HIGH">HIGH</option>';
		html+=	'<option value="MEDIUM">MEDIUM</option>';
		html+=	'<option value="LOW">LOW</option>';
		}else{
			html+=	'<option value='+priority+'>'+priority+'</option>';
			html+=	'<option value="HIGH">HIGH</option>';
			html+=	'<option value="MEDIUM">MEDIUM</option>';
			html+=	'<option value="LOW">LOW</option>';

		}
		}
	html +=	'</select>';
	html += '</div>';
	
	/** ************************************Organization Scraping Name***************************************************** */
	html += '<div class="form-group" id="Edit-organizationScrapingName-Error">';

	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationScrapingName = organizationScrapingNameList[i].organizationScrapingName;
		var id = organizationScrapingNameList[i].id;
	html += '<input	type="hidden" type="text" value="'+organizationScrapingName+'" class="form-control input-sm" id="editedOrganizationScrapingName" placeholder="Enter organization Scraping Name" maxlength="150">';
	html += '<input	type="hidden" value="'+id+'" class="form-control input-sm" id="hiddenId">';
	
	}
	html += '</div>';	
	
	
	/** ************************************Username***************************************************** */
	html += '<div class="form-group" id="Edit-organizationUsername-Error">';
	html += '<label>Username</label>';
	html += '<span style="color: #a94442" id="edit-organizationUsername-span-Error" class="help-inline"></span>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationUsername = organizationScrapingNameList[i].sourceLogin;
		if(organizationUsername==null)
		{
			organizationUsername="";
		}
		html += '<input	type="text" value="'+organizationUsername+'" class="form-control input-sm" id="editedOrganizationUsername" placeholder="Enter Username" maxlength="50">';
	}
	html += '</div>';
	
	
	/** ************************************Password***************************************************** */
	html += '<div class="form-group" id="Edit-organizationPassword-Error">';
	html += '<label>Password</label>';
	html += '<span style="color: #a94442" id="edit-organizationPassword-span-Error" class="help-inline"></span>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationPassword = organizationScrapingNameList[i].sourcePass;
		if(organizationPassword==null)
		{
			organizationPassword="";
		}
		html += '<input	type="text" value="'+organizationPassword+'" class="form-control input-sm" id="editedOrganizationPassword" placeholder="Enter Password" maxlength="50">';		
	}
	html += '</div>';
	
	/** ************************************Source URL reply to review***************************************************** */
	html += '<div class="form-group" id="Edit-sourceUrl-Error">';
	html += '<label>Source URL(ReplyToReview)</label>';
	html += '<span style="color: #a94442" id="edit-sourceUrl-span-Error" class="help-inline"></span>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var sourceUrl = organizationScrapingNameList[i].sourceUrl;
		if(sourceUrl==null)
		{
			sourceUrl="";
		}
		html += '<input	type="text"  value="'+sourceUrl+'" class="form-control input-sm" id="editedSourceUrl" placeholder="Enter Source URL(ReplyToReview)" maxlength="200">';
	}
	html += '</div>';
	/** ************************************Source URL  reply to review END***************************************************** */

	/** ************************************organization Source URL***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Source URL</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationSourceLink = organizationScrapingNameList[i].organizationSourceLink;
		if(organizationSourceLink==null)
		{
			organizationSourceLink="";
		}
		html += '<input	type="hidden" value="'+organizationSourceLink+'" class="form-control input-sm" id="editedOrganizationSourceLink" placeholder="Enter Source URL" maxlength="200">';
	}
	html += '</div>';
	/** ************************************Source URL END***************************************************** */
	
	/************************************** For Twitter******************************************************/
	
	if(organizationSourceName=="Twitter"){
		html += '<div class="form-group" id="Edit-apiKey-Error">';
		for(var i=0;i<organizationScrapingNameList.length;i++){
			var organizationApiKey = organizationScrapingNameList[i].apiKey;
			if(organizationApiKey==null){
				organizationApiKey="";
				html += '<input	type="hidden" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Consumer key" maxlength="50">';

			}else{
				
				html += '<input	type="hidden" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Consumer key" maxlength="50">';
			}
		}
		html += '</div>';	
		/** ************************************ Secret Key***************************************************** */
		html += '<div class="form-group" id="Edit-secretKey-Error">';
		for(var i=0;i<organizationScrapingNameList.length;i++){
			var organizationSecretKey = organizationScrapingNameList[i].secretKey;
			if(organizationSecretKey==null){
				organizationSecretKey="";
				html += '<input	type="hidden" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Consumer Secret Key" maxlength="50">';

			}else{
				
				html += '<input	type="hidden" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Consumer Secret Key" maxlength="50">';
			}
		}
		html += '</div>';
		
		/** ************************************ Access Token Key***************************************************** */
		
		html += '<div class="form-group" id="Edit-accessToken-Error">';
		for(var i=0;i<organizationScrapingNameList.length;i++){
			var organizationacessTokenSecretKey = organizationScrapingNameList[i].accessToken;
			if (organizationacessTokenSecretKey==null) {
				organizationacessTokenSecretKey="";
				html += '<input	type="hidden" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessToken" placeholder="Enter access Token" maxlength="50">';

			} else {

				html += '<input	type="hidden" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessToken" placeholder="Enter access Token" maxlength="50">';
			}
		}
		html += '</div>';
		
		/** ************************************ Access Token Secret Key***************************************************** */
		
		html += '<div class="form-group" id="Edit-accessTokenSecret-Error">';
		for(var i=0;i<organizationScrapingNameList.length;i++){console.log(organizationScrapingNameList);
			var organizationacessTokenSecretKey = organizationScrapingNameList[i].accessTokenSecret;
			if (organizationacessTokenSecretKey==null) {
				organizationacessTokenSecretKey="";
				html += '<input	type="hidden" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Access Token Secret" maxlength="50">';

			} else {

				html += '<input	type="hidden" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Access Token Secret" maxlength="50">';
			}
		}
		html += '</div>';
		}else{
	
	/** ************************************ Api Key***************************************************** */
	html += '<div class="form-group" id="Edit-apiKey-Error">';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationApiKey = organizationScrapingNameList[i].apiKey;
		
		if (organizationApiKey==null) {
			organizationApiKey="";
			html += '<input	type="hidden" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Api key" maxlength="50">';

		} else {
			html += '<input	type="hidden" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Api key" maxlength="50">';

		}
	}
	html += '</div>';	
	
	/** ************************************ Secret Key***************************************************** */
	html += '<div class="form-group" id="Edit-secretKey-Error">';
		for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationSecretKey = organizationScrapingNameList[i].secretKey;
		if (organizationSecretKey==null) {
			organizationSecretKey="";
			html += '<input	type="hidden" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Secret Key" maxlength="50">';

		} else {

			html += '<input	type="hidden" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Secret Key" maxlength="50">';
		}
	}
	html += '</div>';
	/** ************************************ PAGE ID***************************************************** */
	html += '<div class="form-group" id="Edit-secretKey-Error">';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var pageId = organizationScrapingNameList[i].pageId;
			if (pageId==null) {
				pageId="";
				html += '<input	type="hidden" value="'+pageId+'" class="form-control input-sm" id="editedPageId" placeholder="Enter Secret Key" maxlength="50">';

			} else {

				html += '<input	type="hidden" value="'+pageId+'" class="form-control input-sm" id="editedPageId" placeholder="Enter Secret Key" maxlength="50">';
			}
	}
	html += '</div>';
	
	/** ************************************ Token Secret Key***************************************************** */
	html += '<div class="form-group" id="Edit-secretKey-Error">';
	
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var accessTokenSecret = organizationScrapingNameList[i].accessTokenSecret;
		if (accessTokenSecret==null) {
			accessTokenSecret="";
			html += '<input	type="hidden" value="'+accessTokenSecret+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Secret Key" maxlength="50">';
		} else {

			html += '<input	type="hidden" value="'+accessTokenSecret+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Secret Key" maxlength="50">';
		}
	}
	html += '</div>';
		}
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganizationSourceMapping('+organizationScrapingNameList.id+')">';
	html+=	appendCancelButton(getDivId("OrganizationSourceMapping"));
	html +=	'</form>';
	return html;
}

function updateOrganizationSourceMapping(id){	
	$('#page-wrapper').mask('Loading...');
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	var divId = $('#'+getDivId("OrganizationSourceMapping"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	//$('#editOrganizationSourceMappingSuccessDiv').hide();//@d
	$('#editOrganizationSourceMappingErrorDiv').hide();
	
	var ids = $.trim($('#hiddenId').val());
	var editOrganizationNameId = $('#editOrganizationName').val();
	var editedSourceNameId = $('#editedSourceNameId').val();
	var editedPriority = $.trim($('#editedPriority').val());
	var editedOrganizationUsername = $.trim($('#editedOrganizationUsername').val());
	var editedOrganizationPassword = $.trim($('#editedOrganizationPassword').val());
	var editedSourceUrl = $.trim($('#editedSourceUrl').val());
	var editedOrganizationScrapingName = $.trim($('#editedOrganizationScrapingName').val());
	var editedOrganizationSourceLink = $.trim($('#editedOrganizationSourceLink').val());
	var editedApiKey = $('#editedApiKey').val();
	var editedSecretKey = $('#editedSecretKey').val();
	var editedAcessTokenKey = $('#editedAccessToken').val();
	var editedAcessTokenSecretKey = $('#editedAccessTokenSecret').val();
	var editedPageId = $('#editedPageId').val();
	
	var JSONObject = {};
	JSONObject['id'] = ids;
	JSONObject['organizationId'] = editOrganizationNameId;
	JSONObject['sourceId'] = editedSourceNameId;
	JSONObject['priority'] =editedPriority;
	JSONObject['organizationScrapingName'] = editedOrganizationScrapingName;
	JSONObject['sourcePass'] = editedOrganizationPassword;
	JSONObject['sourceLogin'] = editedOrganizationUsername;
	JSONObject['sourceUrl'] = editedSourceUrl;
	JSONObject['organizationSourceLink'] = editedOrganizationSourceLink;
	JSONObject['secretKey'] = editedSecretKey;
	JSONObject['accessToken'] = editedAcessTokenKey;
	JSONObject['accessTokenSecret'] = editedAcessTokenSecretKey;
	JSONObject['pageId'] = editedPageId;
	JSONObject['apiKey'] = editedApiKey;
	
	
	
	$.post(organizationSourceMappingUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#page-wrapper').unmask();
			 organizationSourceMappingList();
			 $('#editOrganizationSourceMappingSuccessDiv').show(600);
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editOrganizationSourceMappingErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}


/**************************************************************************************************************************
 *                     Delete Organization Source Master                                                                        *
 **************************************************************************************************************************/
function deleteOrganizationSourceMapping(){
	selectedOrganizationSourceMappingIds=[];
	 $.ajaxSetup({ cache: false });
	selectedOrganizationSourceMappingCheckBoxLength();
	if(selectedOrganizationSourceMappingIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			clearOrganizationSourceMappingMessagesDiv();
			$.ajax({
				type:"POST",
				url:organizationSourceMappingUrl+"delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedOrganizationSourceMappingIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#organizationSourceMappingTabButtons').hide();
						var html = listOrganizationSourceMappingHtml(response);
						organizationSourceMappingDataDiv.html(html);
						$('#deleteOrganizationSourceMappingSuccessDiv').show(600);
						$('#organizationSourceMappingTabButtons').show();
						$('#organizationSourceMappingListTable').dataTable();
						$('#page-wrapper').unmask();
						selectedOrganizationSourceMappingIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteOrganizationSourceMappingErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteOrganizationSourceMappingErrorDiv').append(errorMessage);
						$('#deleteOrganizationSourceMappingErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedOrganizationSourceMappingIds = [];
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		$('#organizationSourceMappingSuccessModalTitle').text("Alert");
		$('#organizationSourceMappingSuccessModalText').text("please select a record !");
		$('#organizationSourceMappingSuccessModal').modal('show');
		return;
	}
	
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
