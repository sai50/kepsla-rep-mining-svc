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
		 $.get(organizationSourceMappingUrl+"listOrg.htm?sourceMasterFilter=",function(response){
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
		$.get("../organizationSourceMapping/orgNameOnId.htm?orgId="+orgId+"&sourceMasterFilter=",function(response){
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
		$.get("../organizationSourceMapping/orgNameOnId.htm?orgId="+selectOrgNameId+"&sourceMasterFilter=",function(response){
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




/**************************************************************************************************************************
 *                      Add Organization Source Mapping                                                                             *
 **************************************************************************************************************************/
function addOrganizationSourceMapping(){
	//$('#organizationSourceMappingListForm').hide();//@d
	$('#addAndEditOrganizationSourceMappingDiv').hide();
	$("#organizationSourceMappingDataDiv").hide();
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	if(sessionStorage.getItem("orgListandIds")!==undefined && sessionStorage.getItem("orgListandIds")!==null 
			&& sessionStorage.getItem("listSources")!==undefined && sessionStorage.getItem("listSources")!=null ){
		var html = addOrganizationSourceMappingFormHtml(JSON.parse(sessionStorage.getItem("orgListandIds")),JSON.parse(sessionStorage.getItem("listSources")));
		var divId = $('#'+getDivId("OrganizationSourceMapping"));
		appendOrganizationSourceMappingAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	}
	return false;
}
function addOrganizationSourceMappingFormHtml(orgs,sources){
	var organizationNameList = orgs;
	organizationNameListResponse=organizationNameList;
	var sourceNameList = sources;
	//var priorityNameList = response.successObject.priorityNameList;
	
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading" id="addOrganizationSourceMappingDivForm">';
	html += '<h4>Add Organization Source Mapping</h4>';
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
			var id = organizationNameList[i].idValue;
			var organizationName = organizationNameList[i].value;
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
			var id = sourceNameList[i].label;
			var sourceName = sourceNameList[i].value;
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
	//@m Add
	/** ************************************Priority***************************************************** */
	if(sourceNameList.length>0){	
		html += '<div class="form-group">';
		html += '<label>Priority<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm" id="priorityId" onChange="addMoreFields()">';
		html += '<option  value="0">-----SELECT------</option>';
		html += '<option  value="HIGH">HIGH</option>';
		html += '<option  value="MEDIUM">MEDIUM</option>';
		html += '<option  value="LOW">LOW</option>';
		/*for(var i=0;i<priorityNameList.length;i++){
			var id = priorityNameList[i].id;
			var priority = priorityNameList[i].priority;
			html+=	'<option value='+id+'>'+priority+'</option>';
		}*/
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>Priority<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm" disabled="disabled"><option>No Priority Found</option></select>';
		html += '</div>';
	}
	/** ************************************organization Scraping Name ***************************************************** */
	html += '<div class="form-group" id="Add-organizationScrapingName-Error">';
	html += '<label>Search Key String<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="organizationScrapingName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationScrapingName" placeholder="Enter Organization Scraping Name" maxlength="150">';
	html += '</div>';
	
	/** ************************************Search Key String****by manoj 01-02-16************************************************* *//*
	html +='<div id="apiAndSecretKeyDiv">';
	html += '<div class="form-group" id="Add-ApiKey-Error">';
	html += '<label>Search Key String</label>';
	html += '<span style="color: #a94442" id="apiKey-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="searchKeyString" placeholder="Enter Search Key String" maxlength="50">';
	html += '</div>';*/
	
	/** ************************************Organization Source Link Url ********************************************* */
	html +='<div id="organizationSourceLinkDiv">';
	html += '<div class="form-group" id="Add-organizationSourceLink-Error">';
	html += '<label>Organization Source Scrapping URL</label>';
	html += '<span style="color: #a94442" id="organizationSourceLink-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationSourceLink" placeholder="Enter Source Scrapping URL" maxlength="300">';
	html += '</div>';
	
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
	
	
	
	/** ************************************Source URL********by manoj 01-02-16********************************************* */
	html +='<div id="sourceUrlDiv">';
	html += '<div class="form-group" id="Add-sourceUrl-Error">';
	html += '<label>Source URL(ReplyToReview)</label>';
	html += '<span style="color: #a94442" id="sourceUrl-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sourceUrl" placeholder="Source URL(ReplyToReview)" maxlength="200">';
	html += '</div>';
	
	
	
	/** ************************************Api Key***************************************************** */
	html +='<div id="apiAndSecretKeyDiv">';
	html += '<div class="form-group" id="Add-ApiKey-Error">';
	html += '<label>Api Key</label>';
	html += '<span style="color: #a94442" id="apiKey-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="apiKey" placeholder="Enter Api Key" maxlength="50">';
	html += '</div>';
	
	/** ************************************APP Secret Key************by manoj 01-02-16***************************************** */
	html += '<div class="form-group" id="Add-SecretKey-Error">';
	html += '<label>APP Secret Key</label>';
	html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="secretKey" placeholder="Enter Secret Key" maxlength="50">';
	html += '</div>';

	
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
	
	/** ************************************Data Extraction Period ***************************************************** */

	//html += '<div class="form-group" id="Add-SecretKey-Error">';
	html += '<div class="form-group" id="Add-SecretKey-Error">';
	html += '<label>Data Extraction Period(In Days)</label>';
	html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="secretKey" placeholder="Enter No Of Days " maxlength="200">';
	html += '</div>';
	//html += '</div>';
	
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
		
		/** ************************************Data Extraction Period ***********by manoj 01-02-16****************************************** */
		//html += '<div class="form-group" id="Add-SecretKey-Error">';
		html += '<div class="form-group" id="Add-dataExtractionPeriod-Error">';
		html += '<label>Data Extraction Period(In Days)</label>';
		html += '<span style="color: #a94442" id="dataExtractionPeriod-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="dataExtractionPeriod" placeholder="Enter No Of Days " maxlength="200">';
		html += '</div>';
		//html += '</div>';
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
	var orgFullNameForSave=$("#organizationFullNameId option[value='"+organizationId+"'").text();
	var sourceId = $('#sourceNameId option:selected').val();
	var sourceFulNameForSave=$("#sourceNameId option[value='"+sourceId+"'").text();
	var organizationScrapingName = $.trim($('#organizationScrapingName').val());//by manoj
	var organizationSourceLink = $.trim($('#organizationSourceLink').val());//by manoj
	var apiKey = $.trim($('#apiKey').val());
	
	var secretKey = $.trim($('#secretKey').val());
	var organizationUserName = $.trim($('#organizationUsername').val());
	var organizationPassword = $.trim($('#organizationPassword').val());
	var sourceUrl = $.trim($('#sourceUrl').val());
	var pageId = $.trim($('#pageID').val());//by manoj
	var tokenSecretKey = $.trim($('#tokenSecretKey').val());//by manoj
	var acessTokenKey = $.trim($('#accessToken').val());
	var acessTokenSecretKey = $.trim($('#accessTokenSecret').val());
	var priority = $.trim($('#priorityId option:selected').text	());
	var priorityValue = $.trim($('#priorityId option:selected').val());
	var dataExtractionPeriod = $.trim($('#dataExtractionPeriod').val());
	//var organizationScrapingName = $.trim($('#organizationScrapingName').val());
	if(organizationId>0 && sourceId>0 && priority!="-----SELECT------" && organizationScrapingName!=""){
	var JSONObject = {};
	JSONObject['organizationId'] = organizationId;
	JSONObject['priority'] = priority;
	JSONObject['sourceId'] = sourceId;
	JSONObject['organizationScrapingName'] = organizationScrapingName;
	JSONObject['organizationSourceLink'] = organizationSourceLink;
	JSONObject['pageId'] = pageId;
	JSONObject['tokenSecretKey'] = tokenSecretKey;
	JSONObject['apiKey'] = apiKey;
	JSONObject['sourceLogin'] = organizationUserName;
	JSONObject['sourcePass'] = organizationPassword;
	JSONObject['sourceUrl'] = sourceUrl;
	JSONObject['secretKey'] = secretKey;
	//JSONObject['organizationScrapingName'] = organizationScrapingName;
	JSONObject['accessToken'] = acessTokenKey;
	JSONObject['accessTokenSecret'] = acessTokenSecretKey;
	JSONObject['dataExtractionPeriod'] = dataExtractionPeriod;
	JSONObject['organizationFullName']=orgFullNameForSave;
	JSONObject['sourceName']=sourceFulNameForSave;
	JSONObject['sourceType']=findSourceType(sourceId);
	$.post(organizationSourceMappingUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$("#addAndEditOrganizationSourceMappingDiv").hide();
			$('#addOrganizationSourceMappingSuccessDiv').show(600);
			$('#page-wrapper').unmask();
			$('#addOrganizationSourceMappingDivForm').remove();
			//--------------------
			$('#organizationSourceMappingDataDiv').html('');
			var html=listOrganizationSourceMappingHtml(response);
			$("#organizationSourceMappingDataDiv").show();
			$('#organizationSourceMappingDataDiv').append(html);
			
			$('#organizationSourceMappingListTable').dataTable();
			$('#page-wrapper').unmask();
			//-----------------------
		//	organizationSourceMappingList();
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
		alert("responseStatus..."+response.status+"responseText..."+response.statusText)
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

function findSourceType(sourceId){
var sourceList=	JSON.parse(sessionStorage.getItem("listSources"));
for(var i=0;i<sourceList.length;i++){
	if(sourceList[i].label==sourceId){
		return sourceList[i].idValue;
	}
}
}
function updateOrganizationSourceMapping(id){	
	$('#page-wrapper').mask('Loading...');
	$("#addAndEditOrganizationSourceMappingDiv").hide();
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
	var editedOrganizationSourceUrl = $.trim($('#editedOrganizationSourceUrl').val());
	var editedOrganizationScrapingName = $.trim($('#editedOrganizationScrapingName').val());
	var editedOrganizationSourceLink = $.trim($('#editedOrganizationSourceLink').val());
	var editedApiKey = $('#editedApiKey').val();
	var editedSecretKey = $('#editedSecretKey').val();
	var editedAcessTokenKey = $('#editedAccessToken').val();
	var editedAcessTokenSecretKey = $('#editedAccessTokenSecret').val();
	var editedPageId = $('#editedPageId').val();
	var editedDataExtractionPeriod = $.trim($('#editedDataExtractionPeriod').val());
	editedOrganizationSourceLink=editedOrganizationSourceLink.replace(/%/g,"KePsLa");
	var JSONObject = {};
	JSONObject['id'] = ids;
	JSONObject['organizationId'] = editOrganizationNameId;
	JSONObject['sourceId'] = editedSourceNameId;
	JSONObject['priority'] =editedPriority;
	JSONObject['organizationScrapingName'] = editedOrganizationScrapingName;
	JSONObject['sourcePass'] = editedOrganizationPassword;
	JSONObject['sourceLogin'] = editedOrganizationUsername;
	JSONObject['sourceUrl'] = editedOrganizationSourceUrl;
	JSONObject['organizationSourceLink'] = editedOrganizationSourceLink;
	JSONObject['secretKey'] = editedSecretKey;
	JSONObject['accessToken'] = editedAcessTokenKey;
	JSONObject['accessTokenSecret'] = editedAcessTokenSecretKey;
	JSONObject['pageId'] = editedPageId;
	JSONObject['apiKey'] = editedApiKey;
	JSONObject['dataExtractionPeriod'] = editedDataExtractionPeriod;
	JSONObject['organizationFullName']=organizationFullNameForUpdate;
	JSONObject['sourceName']=sourceNameForUpdate;
	JSONObject['sourceType']=sourceTypeForUpdate;
	$('#page-wrapper').mask('Loading...');
	
	$.post(organizationSourceMappingUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			// organizationSourceMappingList();
			$.ajaxSetup({ cache: false });
			
			$('#organizationSourceMappingDataDiv').html('');
			var html=listOrganizationSourceMappingHtml(response);
			$('#organizationSourceMappingDataDiv').show();
			$('#organizationSourceMappingDataDiv').append(html);
			$('#organizationSourceMappingListTable').dataTable();
			$('#page-wrapper').unmask();
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




