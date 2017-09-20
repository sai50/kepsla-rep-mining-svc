var roleManagementUrl = "../RoleManagement/";
var $addAndEditAdminUserDiv = $("#addAndEditAdminUserDiv");
var selectedAdminUserCheckBoxArray = [];
var featureMasterListDetails=[];
var rolesList=[];
var organizationListAll=[];
var organizationListForUser=[];
var ids = [];
var departmentIds = [];
var count=0;
var selectedOranizationIds=[];
var clientOrganizationGroupList=[];
var clientOrganizationGroupIds = [];
var clientOrganizationIds = [];

$(document).ready(function() {
	featureMasterList();
	roleList();
	listOrganization();
	listClientOrganizationGroup();
});
/***************************************************************************************************************************
 * ********************************Admin user******************************************************************************
 * *************************************************************************************************************************/
function listUser(){
	clearAllSuccessDivs();
	listAdminUser();
}

function clearAllSuccessDivs(){
	$('#addAdminUserSuccessDiv,#editAdminUserSuccessDiv').hide();
}

function listAdminUser(){
	var selectedRoleId=$('#selectRoleId option:selected').val();
	var selectedOrgGroupId=$('#selectedOrgGroupID option:selected').val();
	var selectedOrgNameId=$('#selectedOrgNameId option:selected').val();
	console.log(selectedRoleId);
	console.log(selectedOrgGroupId);
	console.log(selectedOrgNameId);
	loading();
	$('#addAndEditAdminUserDiv').hide();
	$('#listAdminUserTab').html('');
	$.ajax({
		type:"GET",
		url:"../adminUser/listBasedOnRole.htm?selectedRoleId="+selectedRoleId+"&organizationId="+selectedOrgNameId+"&organizationGroupId="+selectedOrgGroupId,
		dataType: "json",
		success: function(response){ 
		$('#page-wrapper').unmask();
		if(response.status=="LIST_SUCCESS"){
			var tempHtml = listAgentResponse(response);
			$('#listAdminUserTab').append(tempHtml);
			$('#listAdminUserTable').dataTable();
			$('#loadMaskDiv').unmask();
		}else{
			$('#listAdminUserTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	}},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"*****************"+response.statusText);
	});
}	

function listAgentResponse(response){
	$('#listAdminUserTab').html('');
	var userList = response.successObject.userList;
	console.log(userList);
	var tempHtml = "";
	tempHtml+=	'<div id="listAdminUserFormDiv">';
	tempHtml+=	'<form ="form" id="listAdminAgentForm">';
	tempHtml+=	'<div class="alert alert-success" style="display:none;margin-top: 150px;" id="saveAdminUserSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Admin User Data Saved Successfully</div>';
	tempHtml+=	'<div class="alert alert-success" style="display:none;margin-top: 150px;" id="deleteAdminUserSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Admin User Data Deleted Successfully</div>';
	tempHtml+=	'<div class="alert alert-success" style="display:none;margin-top: 150px;" id="updateAdminUserSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Admin User Data Updated Successfully</div>';
	tempHtml+=	"<table class='table table-striped dataTable no-footer' id='listAdminUserTable'>";
	tempHtml+=		'<thead>';
	tempHtml+=			'<tr>';
	tempHtml+=				'<th><input type="checkbox" id="checkAllAdminUserCheckBox" style="margin-left: 0px;"></th>';
	tempHtml+=				'<th>Login Email-Id</th>';
	tempHtml+=				'<th>UserName</th>';
	tempHtml+=				'<th>Role</th>';
	tempHtml+=				'<th>Organization</th>';
	tempHtml+=				'<th>Department</th>';
	tempHtml+=				'<th>Features</th>';
	tempHtml+=				'<th></th>';
	tempHtml+=			'</tr>';
	tempHtml+=		'</thead>';
	tempHtml+=		'<tbody>';
	for(var i=0;i<userList.length;i++){
		tempHtml+=		'<tr>';
		tempHtml+=			'<td><input type="checkbox" class="AdminUserCheckBox" value="'+userList[i].id+'"></td>';
		tempHtml+=			'<td style="word-break: break-all;">'+userList[i].userName+'</td>';
		tempHtml+=			'<td style="word-break: break-all;">'+userList[i].userFirstName+'</td>';
		tempHtml+=			'<td>'+userList[i].role+'</td>';
		if(userList[i].role=="GHN_ADMIN"){
			tempHtml+=			'<td></td>';
			tempHtml+=			'<td></td>';
			tempHtml+=			'<td><button type="button" class="btn btn-default" onclick=featureModal("'+userList[i].userName+'","'+(userList[i].userFirstName).replace(/ /g,'')+'","'+userList[i].role+'","'+userList[i].id+'","'+userList[i].selectedRoleId+'") style="background-color:#ccc;"> Features</button></td>';	
		}else if(userList[i].role=="POS_MANAGER" || userList[i].role=="POS_EMPLOYEE"){
			tempHtml+=			'<td><button type="button" class="btn btn-default" style="background-color:#ccc;" onclick=organizationModal("'+(userList[i].userName).replace(/ /g,'')+'","'+(userList[i].userFirstName).replace(/ /g,'')+'","'+(userList[i].role).replace(/ /g,'')+'","'+userList[i].id+'","'+userList[i].selectedRoleId+'")> Related Organization(s)</button></td>';		
			tempHtml+=			'<td><button type="button" class="btn btn-default" style="background-color:#ccc;" onclick=departmentModal("'+(userList[i].userName).replace(/ /g,'')+'","'+(userList[i].userFirstName).replace(/ /g,'')+'","'+(userList[i].role).replace(/ /g,'')+'","'+userList[i].id+'","'+userList[i].selectedRoleId+'")> Related Department(s)</button></td>';	
			tempHtml+=			'<td><button type="button" class="btn btn-default" style="background-color:#ccc;" onclick=featureModal("'+(userList[i].userName).replace(/ /g,'')+'","'+(userList[i].userFirstName).replace(/ /g,'')+'","'+(userList[i].role).replace(/ /g,'')+'","'+userList[i].id+'","'+userList[i].selectedRoleId+'")> Features</button></td>';	
		}else{
			tempHtml+=			'<td><button type="button" class="btn btn-default" style="background-color:#ccc;" onclick=clientModal("'+(userList[i].userName).replace(/ /g,'')+'","'+(userList[i].userFirstName).replace(/ /g,'')+'","'+(userList[i].role).replace(/ /g,'')+'","'+userList[i].id+'","'+userList[i].selectedRoleId+'")> Related Client(s)</button></td>';	
			tempHtml+=			'<td></td>';
			tempHtml+=			'<td><button type="button" class="btn btn-default" style="background-color:#ccc;" onclick=featureModal("'+(userList[i].userName).replace(/ /g,'')+'","'+(userList[i].userFirstName).replace(/ /g,'')+'","'+(userList[i].role).replace(/ /g,'')+'","'+userList[i].id+'","'+userList[i].selectedRoleId+'")> Features</button></td>';
		}
		tempHtml+=          '<td><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editAdminUser('+userList[i].id+')"><span class="glyphicon glyphicon-pencil"></span></button></span></span></td>';
		tempHtml+=		'</tr>';
	}
	tempHtml+=		'</tbody>';
	tempHtml+=	'</table>';
	tempHtml+=	'</form>';
	tempHtml+=	'</div>';
	return tempHtml;
	
}

function role(){
	$("#selectedRole").html('');
	$.ajax({
		type: "GET",
		url: "../adminUser/listRole.htm",
		dataType: "json",
		success: function(data){ 
			console.log(data);
			var response = data.successObject.listRole;
			if(response.status=="LIST_SUCCESS"){
			var html="";
			html+='<label id="selectedRole"  class="control-label" for="selectedRole">Role <select id="selectRoleId" class="form-control input-sm"  style="width: 200px;margin-bottom: 12px;margin-left: 28px" onChange="organizationGroupName()">';
			html+='<option value="0">All</option>';
			for(var i=0;i<response.length;i++){
			html+='<option value="'+response[i].id+'">'+$.trim(response[i].role)+'</option>';
			}
			html+='</select>';
			html+='</label>';	
			
	$("#selectedRole").append(html);
	$("#selectedRole").show();
		}else{
			alert("error",response.message);
		}
	}});
}

function organizationGroupName(){
	loading();
	var selectRoleId=$('#selectRoleId option:selected').val();
	$("#selectedOrgGroup").html('');
	$.ajax({
		type: "GET",
		url: "../organizationGroup/selectOrgGroup.htm",
		dataType: "json",
		success: function(response){ 
			console.log(response);
			if(response.status=="LIST_SUCCESS" && selectRoleId!=1 && selectRoleId!=0){
			unload();
			var response = response.successObject.organizationGroupList;
			var html="";
			html+='<label id="selectedOrgGroup" class="control-label" for="selectedOrgGroup">OrgGroup<select id="selectedOrgGroupID" class="form-control input-sm" style="width: 200px; margin-bottom: 12px" onChange="organizationName()">';
			html+='<option value="0">All</option>';
			for(var i=0;i<response.length;i++){
			html+='<option value="'+response[i].id+'">'+$.trim(response[i].organizationGroupName)+'</option>';
			}
			html+='</select>';
			html+='</label>';	
			
	$("#selectedOrgGroup").append(html);
	$("#selectedOrgGroup").show();
		}else{
			unload();
			$('#selectedOrgName').find('option:first').attr('selected', 'selected');
			$('#selectedOrgNameId').attr('disabled','disabled');
			var html="";
			html+='<label id="selectedOrgGroup" class="control-label" for="selectedOrgGroup">OrgGroup';
			html+='<select id="selectedOrgGroupID" Disabled class="form-control input-sm" style="width: 200px; margin-bottom: 12px">';
			html+='<option value="0">All</option>';
			html+='</select>';
			html+='</label>';
			$("#selectedOrgGroup").append(html);
			$("#selectedOrgGroup").show();
		}
	}});
}

function organizationName(){
	loading();
	var selectRoleId=$('#selectRoleId option:selected').val();
	var organizationGroupId=$('#selectedOrgGroupID option:selected').val();
	$("#selectedOrgName").html('');
		$.get("../adminUser/listClientOrganization.htm?organizationGroupId="+organizationGroupId,function(response){
			if(response.status=="LIST_SUCCESS" && selectRoleId!=1 && selectRoleId!=0 && organizationGroupId!=0){
			unload();
			console.log(response);
			var response = response.successObject.listByGroupIdList;
			var html="";
			html+='<label id="selectedOrgName" class="control-label" for="selectedOrgName">OrgName<select id="selectedOrgNameId" class="form-control input-sm" style="width: 200px; margin-bottom: 12px">';
			html+='<option value="0">All</option>';
			for(var i=0;i<response.length;i++){
			html+='<option value="'+response[i].id+'">'+$.trim(response[i].organizationFullName)+'</option>';
			}
			html+='</select>';
			html+='</label>';	
			
	$("#selectedOrgName").append(html);
	$("#selectedOrgName").show();
		}else{
			unload();
			var html="";
			html+='<label id="selectedOrgName" class="control-label" for="selectedOrgName">OrgName';
			html+='<select id="selectedOrgNameId" Disabled class="form-control input-sm" style="width: 200px; margin-bottom: 12px">';
			html+='<option value="0">All</option>';
			html+='</select>';
			html+='</label>';
			$("#selectedOrgName").append(html);
			$("#selectedOrgName").show();
		}
	});
}

function addAdminUser(){
	$.ajaxSetup({cache : false});
	loading();
	$addAndEditAdminUserDiv.html('');
	$('#addAdminUserForm').trigger('reset');//Making All Values Empty
	clearAllSuccessDivs();//Clearing All Errors
	var divId = $('#'+getDivId("AdminUser"));
	$.ajax({
		type: "GET",
		url: "../adminUser/listRoleTab.htm",
		dataType: "json",
		success: function(response){ 
		console.log(response);
		var html = createUserFormHtml(response);
		$addAndEditAdminUserDiv.append(html).show(600);
		scrollDown($addAndEditAdminUserDiv);//Scrolling To Add Page(Down)
		unload();
		}});
	return false;
}

function createUserFormHtml(response){
	response=response.successObject.roleDataList;
	$('#addAndEditAdminUserDiv').html('');
	var html = "";
	html +='<div id="createUser">';
	html+=	 addFormHeading("User Details");
	html+=	'<form class="col-sm-12" id="createUserForm">';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;" id="userCreateSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png">User Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="createUserErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************First Name***************************************************** */
	html += '<div class="form-group" id="create-userFirstName-Error" style="width:300px;">';
	html += '<label>First Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-userFirstName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userFirstName" placeholder="Enter Your First Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Last Name***************************************************** */
	html += '<div class="form-group" style="width:300px;">';
	html += '<label>Last Name</label>';
	html += '<span style="color: #a94442" id="create-userLastName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userLastName" placeholder="Enter Your Last Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Designation***************************************************** */
	html += '<div class="form-group"  style="width:300px;">';
	html += '<label>Designation</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userDesignation" placeholder="Enter Your Designation" maxlength="50">';
	html += '</div>';
	
	html+=	 addFormHeading("Login Details");
	
	/** ************************************Login Id***************************************************** */
	html += '<div class="form-group" style="width:300px;" id="create-userName-Error">';
	html += '<label>Login Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442"class="help-inline" id="create-userName-span-Error"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userName" placeholder="Enter Your Login Id" maxlength="50">';
	html += '</div>';
	
	/** ************************************Password***************************************************** */
	html += '<div class="form-group" id="create-password-Error" style="width:300px;">';
	html += '<label>Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-password-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm" id="userPassword" placeholder="Enter Your pasword." maxlength="50">';
	html += '<label>(min 6 charactes to max 12 characters long)</label>';
	html += '</div>';
	
	/** ************************************Confirm Password***************************************************** */
	html += '<div class="form-group" id="create-confirmPassword-Error" style="width:300px;">';
	html += '<label>Re-type Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-confirmPassword-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm" id="userConfirmPassword" placeholder="Retype your password again." maxlength="50">';
	html += '</div>';
	
	html+=	 addFormHeading("Contact Details");
	
	/** ************************************Mobile***************************************************** */
	html += '<div class="form-group" id="create-mobile-Error" style="width:300px;">';
	html += '<label>Mobile<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-mobile-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="userMobileNumber" placeholder="Enter Your User Mobile Number" maxlength="50">';
	html += '</div>';
	
	/** ************************************Land Line Number***************************************************** */
	html += '<div class="row">';
	html += '<div class="form-group col-lg-3" id="create-LandLine-Number-Error" style="width:200px;">';
	html += '<label>LandLine Number</label>';
	html += '<span style="color: #a94442" id="create-LandLine-Number-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="userLandLineNumber" placeholder="Enter Land Line Number" maxlength="15">';
	html += '</div>';
	/** ************************************Extension***************************************************** */
	html += '<div class="form-group col-lg-3" id="create-Extension-Error" style="width:150px;">';
	html += '<label>Extn</label>';
	html += '<span style="color: #a94442" id="create-Extension-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="extension" placeholder="Extension" maxlength="5">';
	html += '</div>';
	html += '</div>';
	
	/** ************************************Email Id***************************************************** */
	html += '<div class="form-group" id="create-secondaryEmail-Error" style="width:300px;">';
	html += '<label>Email-Id</label>';
	html += '<span style="color: #a94442" id="create-SecondaryEmail-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="secondaryEmail" placeholder="Enter Your User Mobile Number" maxlength="50">';
	html += '</div>';
	
	/** ************************************Fax***************************************************** */
	html += '<div class="form-group" id="create-fax-Error" style="width:300px;">';
	html += '<label>Fax</label>';
	html += '<span style="color: #a94442" id="create-fax-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="fax" placeholder="Enter Your User Mobile Number" maxlength="50">';
	html += '</div>';
	
	/** ************************************Role***************************************************** */
	html+='Role<font style="color: red">*</font><select id="selectedRoleUserId" class="form-control input-sm"  style="width: 300px;margin-bottom: 12px;">';
	for(var i=0;i<response.length;i++){
	html+='<option value="'+response[i].id+'">'+$.trim(response[i].role)+'</option>';
	}
	html+='</select>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Save" onclick ="createUser()">';
    html +=	appendCancelButton(getDivId("AdminUser"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	html += '</div>';
	return html;
}

function createUser(){
	loading();
	var selectedRoleId=$('#selectRoleId option:selected').val();
	var organizationId=$('#selectedOrgNameId option:selected').val();
	var organizationGroupId=$('#selectedOrgGroupID option:selected').val();
	var divId = $('#'+getDivId("AdminUser"));
	scrollDown(divId);
	$('#userCreateSuccessDiv').hide();
	$('#createUserErrorDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	var firstName = $('#userFirstName').val();
	var lastName = $('#userLastName').val();
	var designation = $('#userDesignation').val();
	var mobileNumber = $('#userMobileNumber').val();
	var landLineNumber = $('#userLandLineNumber').val();
	var extension = $('#extension').val();
	var userName = $('#userName').val();
	var password = $('#userPassword').val();
	var confirmPassword = $('#userConfirmPassword').val();
	var secondaryEmail = $('#secondaryEmail').val();
	var fax = $('#fax').val();
	var roleId = $('#selectedRoleUserId option:selected').val();
	var JSONObject = {};
	JSONObject['userName'] = userName;
	JSONObject['userFirstName'] = firstName;
	JSONObject['userLastName'] = lastName;
	JSONObject['password'] = password;
	JSONObject['mobile'] = mobileNumber;
	JSONObject['landLineNumber'] = landLineNumber;
	JSONObject['extension'] = extension;
	JSONObject['fax'] = fax;
	JSONObject['enabled'] = 1;
	JSONObject['confirmPassword'] = confirmPassword;
	JSONObject['userRoleId'] = roleId;
	JSONObject['selectedRoleId']=selectedRoleId;
	JSONObject['organizationId']=organizationId;
	JSONObject['organizationGroupId']=organizationGroupId;
	console.log(JSONObject);
	$.post("../adminUser/save.htm",JSONObject,function(response){
		console.log(response);
			if(response.status=="SAVE_SUCCESS"){
				unload();
				var html = listAgentResponse(response);
				$('#addAndEditAdminUserDiv').hide();
				$('#listAdminUserTab').append(html);
				$('#listAdminUserTable').dataTable({responsive:true});
				$('#saveAdminUserSuccessDiv').show(600);
				$('#page-wrapper').unmask();
			}else if(response.status=="SAVE_ERROR"){
				unload();
				$('#createUserErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#create-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#create-'+fieldName+'-span-Error').html(errorMessage);
				}
			}
	});
}

function deleteAdminUser(){
	var selectedRoleId=$('#selectRoleId option:selected').val();
	var organizationId=$('#selectedOrgNameId option:selected').val();
	var organizationGroupId=$('#selectedOrgGroupID option:selected').val();
	var ids = selectedIds('AdminUserCheckBox');//Pass Check Box Class
	console.log(ids);
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#deleteManageUserSuccessDiv').hide();
			$('#deleteManagerUserErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:"../adminUser/delete.htm?ids="+ids+"&selectedRoleId="+selectedRoleId+"&organizationId="+organizationId+"&organizationGroupId="+organizationGroupId,
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					console.log(response);
					if(response.status=="DELETE_SUCCESS"){
						var html = listAgentResponse(response);
						$('#listAdminUserTab').append(html);
						$('#listAdminUserTable').dataTable({responsive:true});
						$('#deleteAdminUserSuccessDiv').show();
						$('#page-wrapper').unmask();
					}else{
						$('#deleteManagerUserErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteManagerUserErrorDiv').append(errorMessage);
						$('#deleteManagerUserErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						$('#page-wrapping').unmask();
					}
				}
			});
		}
	}else{
		alert("Please select a record");
	}
}

function editAdminUser(id){
	var roleId=$('#selectRoleId option:selected').val();
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditAdminUserDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get("../adminUser/edit.htm?id="+id+"&userRoleId="+roleId,function(response){
		roleList();
		var html = editAdminUserForm(response);
		appendAdminUserAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function appendAdminUserAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	maskId.unmask();
}

function editAdminUserForm(response){
	response=response.successObject.userList;
	console.log(response);
	rolesList=rolesList.successObject.listAllRoles;
	$('#addAndEditAdminUserDiv').html('');
	var html = "";
	html +='<div id="createUser">';
	html+=	 addFormHeading("User Details");
	html+=	'<form class="col-sm-12" id="createUserForm">';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;" id="userCreateSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png">User Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="createUserErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************First Name***************************************************** */
	html += '<div class="form-group" id="create-userFirstName-Error" style="width:300px;">';
	html += '<label>First Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-userFirstName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userFirstName" value="'+response.userFirstName+'" placeholder="Enter Your First Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Last Name***************************************************** */
	html += '<div class="form-group" style="width:300px;">';
	html += '<label>Last Name</label>';
	html += '<span style="color: #a94442" id="create-userLastName-span-Error" class="help-inline"></span>';
	if(response.userLastName==null){
	html += '<input	type="text" class="form-control input-sm" id="userLastName" placeholder="Enter Your Last Name" maxlength="50">';
	}else{
		html += '<input	type="text" class="form-control input-sm" id="userLastName" value="'+response.userLastName+'" placeholder="Enter Your Last Name" maxlength="50">';	
	}
	html += '</div>';
	
	/** ************************************Designation***************************************************** */
	html += '<div class="form-group"  style="width:300px;">';
	html += '<label>Designation</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	if(response.designation==null){
	html += '<input	type="text" class="form-control input-sm" id="userDesignation" placeholder="Enter Your Designation" maxlength="50">';
	}else{
		html += '<input	type="text" class="form-control input-sm" id="userDesignation" value="'+response.designation+'" placeholder="Enter Your Designation" maxlength="50">';	
	}
	html += '</div>';
	
	html+=	 addFormHeading("Login Details");
	
	/** ************************************Login Id***************************************************** */
	html += '<div class="form-group" style="width:300px;" id="create-userName-Error">';
	html += '<label>Login Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442"class="help-inline" id="create-userName-span-Error"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userName" value="'+response.userName+'" placeholder="Enter Your Login Id" maxlength="50">';
	html += '</div>';
	
	/** ************************************Password***************************************************** */
	html += '<div class="form-group" id="create-password-Error" style="width:300px;">';
	html += '<label>Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-password-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm"  id="userPassword" placeholder="Enter Your pasword." maxlength="50">';
	html += '<label>(min 6 charactes to max 12 characters long)</label>';
	html += '</div>';
	
	/** ************************************Confirm Password***************************************************** */
	html += '<div class="form-group" id="create-confirmPassword-Error" style="width:300px;">';
	html += '<label>Re-type Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-confirmPassword-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm"  id="userConfirmPassword" placeholder="Retype your password again." maxlength="50">';
	html += '</div>';
	
	html+=	 addFormHeading("Contact Details");
	
	/** ************************************Mobile***************************************************** */
	html += '<div class="form-group" id="create-mobile-Error" style="width:300px;">';
	html += '<label>Mobile<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-mobile-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" value="'+response.mobile+'" id="userMobileNumber" placeholder="Enter Your User Mobile Number" maxlength="50">';
	html += '</div>';
	
	/** ************************************Land Line Number***************************************************** */
	html += '<div class="row">';
	html += '<div class="form-group col-lg-3" id="create-LandLine-Number-Error" style="width:200px;">';
	html += '<label>LandLine Number</label>';
	html += '<span style="color: #a94442" id="create-LandLine-Number-span-Error" class="help-inline"></span>';
	if(response.landLineNumber==null || response.landLineNumber==undefined){
		html += '<input	type="tel" class="form-control input-sm" id="userLandLineNumber" placeholder="Enter Land Line Number" maxlength="15">';
	}else{
		html += '<input	type="tel" class="form-control input-sm" value="'+response.landLineNumber+'" id="userLandLineNumber" placeholder="Enter Land Line Number" maxlength="15">';
	}
	html += '</div>';
	/** ************************************Extension***************************************************** */
	html += '<div class="form-group col-lg-3" id="create-Extension-Error" style="width:150px;">';
	html += '<label>Extn</label>';
	html += '<span style="color: #a94442" id="create-Extension-span-Error" class="help-inline"></span>';
	if(response.extension==null){
		html += '<input	type="tel" class="form-control input-sm" id="extension" placeholder="Extension" maxlength="5">';
	}else{
		html += '<input	type="tel" class="form-control input-sm" id="extension" value="'+response.extension+'" placeholder="Extension" maxlength="5">';	
	}
	html += '</div>';
	html += '</div>';
	
	/** ************************************Email Id***************************************************** */
	html += '<div class="form-group" id="create-secondaryEmail-Error" style="width:300px;">';
	html += '<label>Email-Id</label>';
	html += '<span style="color: #a94442" id="create-SecondaryEmail-span-Error" class="help-inline"></span>';
	if(response.secondaryEmail==null){
		html += '<input	type="tel" class="form-control input-sm" id="secondaryEmail" placeholder="Enter Your User Mobile Number" maxlength="50">';
	}else{
		html += '<input	type="tel" class="form-control input-sm" id="secondaryEmail" value="'+response.secondaryEmail+'" placeholder="Enter Your User Mobile Number" maxlength="50">';	
	}
	html += '</div>';
	
	/** ************************************Fax***************************************************** */
	html += '<div class="form-group" id="create-fax-Error" style="width:300px;">';
	html += '<label>Fax</label>';
	html += '<span style="color: #a94442" id="create-fax-span-Error" class="help-inline"></span>';
	if(response.fax==null){
		html += '<input	type="tel" class="form-control input-sm" id="fax" placeholder="Enter Your User Mobile Number" maxlength="50">';
	}else{
		html += '<input	type="tel" class="form-control input-sm" id="fax" value="'+response.fax+'" placeholder="Enter Your User Mobile Number" maxlength="50">';
	}
		html += '</div>';
		html += '<input	type="hidden" class="form-control input-sm" id="hiddenUserId" value="'+response.id+'" placeholder="Enter Your User Mobile Number" maxlength="50">';
	
	/** ************************************Role***************************************************** */
	html+='Role<font style="color: red">*</font><select id="selectedRoleIdForUser" class="form-control input-sm"  style="width: 300px;margin-bottom: 12px;">';
	console.log(response);
	for(var j=0;j<rolesList.length;j++){
	if(rolesList[j].id==response.selectedRoleId){
	    html+='<option selected value="'+rolesList[j].id+'">'+rolesList[j].role+'</option>';
	}else{
		html+='<option value="'+rolesList[j].id+'">'+rolesList[j].role+'</option>';	
	}}
	html+='</select>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Save And Update" onclick="updateUser()">';
    html +=	appendCancelButton(getDivId("AdminUser"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	html += '</div>';
	return html;
}

function updateUser(){
	loadingForDashBoard();
	var selectedRoleId=$('#selectRoleId option:selected').val();
	var organizationId=$('#selectedOrgNameId option:selected').val();
	var organizationGroupId=$('#selectedOrgGroupID option:selected').val();
	var divId = $('#'+getDivId("AdminUser"));
	scrollDown(divId);
	$('#userCreateSuccessDiv').hide();
	$('#createUserErrorDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	var userId = $('#hiddenUserId').val();
	var firstName = $('#userFirstName').val();
	var lastName = $('#userLastName').val();
	var designation = $('#userDesignation').val();
	var mobileNumber = $('#userMobileNumber').val();
	var landLineNumber = $('#userLandLineNumber').val();
	var extension = $('#extension').val();
	var userName = $('#userName').val();
	var password = $('#userPassword').val();
	var roleId = $('#selectedRoleIdForUser option:selected').val();
	var confirmPassword = $('#userConfirmPassword').val();
	var organizationId = $('#selectedOrgNameId option:selected').val();
	var organizationGroupId = $('#selectedOrgGroupID option:selected').val();
	var fax = $('#fax').val();
	var JSONObject = {};
	JSONObject['userName'] = userName;
	JSONObject['userFirstName'] = firstName;
	JSONObject['userLastName'] = lastName;
	JSONObject['password'] = password;
	JSONObject['mobile'] = mobileNumber;
	JSONObject['landLineNumber'] = landLineNumber;
	JSONObject['extension'] = extension;
	JSONObject['fax'] = fax;
	JSONObject['enabled'] = 1;
	JSONObject['confirmPassword'] = confirmPassword;
	JSONObject['userRoleId'] = roleId;
	JSONObject['selectedRoleId'] = selectedRoleId;
	JSONObject['organizationId'] = organizationId;
	JSONObject['organizationGroupId'] = organizationGroupId;
	JSONObject['id'] = userId;
	console.log(JSONObject);
	$.post("../adminUser/update.htm",JSONObject,function(response){
		console.log(response);
			if(response.status=="UPDATE_SUCCESS"){
				unloadingForDashBoard();
				var html = listAgentResponse(response);
				$('#addAndEditAdminUserDiv').hide();
				$('#listAdminUserTab').append(html);
				$('#listAdminUserTable').dataTable({responsive:true});
				$('#updateAdminUserSuccessDiv').show(600);
				$('#page-wrapper').unmask();
			}else if(response.status=="UPDATE_ERROR"){
				unloadingForDashBoard();
				$('#createUserErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#create-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#create-'+fieldName+'-span-Error').html(errorMessage);
				}
			}
		});
    }

function saveNewFeatureMasterMapping(userId,roleId){
	var ids =[];
	ids = selectedIds('FeatureMasterListCheckBox');//Pass Check Box Class
	console.log(ids);
	if(ids.length>0){
	var userObject = {
			roleId:roleId,
			userId:userId,
			featureIdList:ids,
         };
		$.ajax({
		url:"../adminUser/saveRoleFeature.htm",
		type:"POST",
		data:JSON.stringify(userObject),
		contentType:"application/json",
		success:function(response){
		console.log(response);
		if(response.status=="SAVE_SUCCESS"){
			unload();
			$('#featureMasterModal').modal('hide');
			$('#featureMasterSuccessModal').modal('show');
			$('#page-wrapper').unmask();
		}else{
			console.log("Some thing went wrong in saveNewFeatureMasterMapping metod");
			$('#page-wrapping').unmask();
		}			
	    }});
     	}else{
		alert("Please select a record");
	    }}

function featureMasterList(){
		$('#page-wrapper').mask('loading....');
		$.get("../roleFeature/listTab.htm",function(response){
			if(response.status=="LIST_SUCCESS"){
				featureMasterListDetails=response;
				console.log(featureMasterListDetails);
				$('#page-wrapper').unmask();
			}else{
				$('#page-wrapper').mask(response.errorMessage);
				console.log(response.errorMessage);
			}
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"*********"+response.stautsText);
			onsole.log(response.errorMessage);
		
		});
		return false;
	}

function roleList(){
	 $.ajax({
   		type: "get",
   		url: "../roleFeature/listAllRoles.htm",
        dataType: "json",
   		success: function(response){
   			console.log(response);
   			rolesList=response;
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

/******************************Edit Role Feature ***********************************************/
function editRoleFeature(id,role,parentRole,parentRoleId,features){
	$('#editRoleFeatureSuccessDiv').hide();
	var infoModal = $('#editRoleFeature');
	htmlAddClose = '';
	var title = 'Related Role Feature Mapping';
	var nameTitle = '&nbsp;&nbsp;&nbsp;&nbsp;Role Name : <b>'+role+' </b><br>'+'&nbsp;&nbsp;&nbsp;&nbsp;Parent Role  : <b>'+parentRole+'</b>';
	$.get(roleManagementUrl+"editRoleFeature.htm?id="+id+"&parentRole="+parentRoleId,function(response){
		
		var parent_role = response.successObject.roleFeatures;
		if(response.status=="LIST_SUCCESS"){
			console.log("inside sucess.......");
			var html = editRoleFeatureTree(response,id);
			infoModal.find('#modal-title').html(title);
			infoModal.find('#nameTitle').html(nameTitle);
			if(parent_role == ""){
				$('#editRoleFeaturetModalError').html('');
				$('#editRoleFeaturetModalError').append("No Feature Found !");
				$('#editRoleFeaturetModalError').show();
				infoModal.find('#editRoleFeatureDiv').hide();
				infoModal.modal('show');
			}else{
				$('#editRoleFeaturetModalError').hide();
				infoModal.find('#editRoleFeatureDiv').html(html);
				infoModal.find('#editRoleFeatureDiv').show();
				infoModal.modal('show');
			}
		}else if(response.status=="LIST_ERROR"){
			console.log("inside error");
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function editRoleFeatureTree(response,roleid){
	clearRoleManagementMessages();
	var roleFeatures = response.successObject.roleFeatures;
	var childRoleFeature = response.successObject.childRoleFeatures;
	var childID = [];
	for(var k=0;k<childRoleFeature.length;k++){
		childID.push(childRoleFeature[k].id);
	}
	console.log("child features :"+childID);
	var html = '';
	var htmlAddClose= '';
	html += 	'<h3><b>Feature Mapping</b></h3>';
	html += '<div class="tree">';
	if(childID.length == 0){
		for(var i=0;i<roleFeatures.length;i++){
			var subFeatures = roleFeatures[i].subFeatures;
			if(subFeatures!=null){
			html += '<ul>';
			html += '<li>';
			html += '<input type="checkbox" class="checkRoleFeature" checked value="parent'+roleFeatures[i].id+'"/><div>'+roleFeatures[i].feature+'</div>';
				for(var j=0;j<subFeatures.length;j++){
					var Feature = subFeatures[j].feature;
					var id = subFeatures[j].id;
						html += '<ul>';
						html += '<li>';
						html += '<input type="checkbox" checked class="checkRoleFeature" value="child'+id+'"/><div>'+Feature+'</div>';
						html += ' </li>';
						html += '</ul>';
				}
				html += ' </li>';
				html += '</ul>';
			}else{
				html += '<ul>';
				html += '<li>';
				html += '<input type="checkbox" class="checkRoleFeature" checked value="parent'+roleFeatures[i].id+'"/><div>'+roleFeatures[i].feature+'</div>';
				html += ' </li>';
				html += '</ul>';
			}
		}
		html += '</div>';
		html+='<input type="button"  class="btn btn-primary" value="Save and Update" onclick ="saveEditRoleFeature('+roleid+')">';
		html+='<input type="button"   class="btn btn-default" value="cancel" data-dismiss="modal">';
		return html;
	}else{
		for(var i=0;i<roleFeatures.length;i++){
			var subFeatures = roleFeatures[i].subFeatures;
			if(subFeatures!=null){
			html += '<ul>';
			html += '<li>';
			var contains=$.inArray(roleFeatures[i].id, childID);
			if(contains!=-1){
				html += '<input type="checkbox" class="checkRoleFeature" checked value="parent'+roleFeatures[i].id+'"/><div>'+roleFeatures[i].feature+'</div>';
			}else{
				html += '<input type="checkbox" class="checkRoleFeature" value="parent'+roleFeatures[i].id+'"/><div>'+roleFeatures[i].feature+'</div>';
			}
				for(var j=0;j<subFeatures.length;j++){
					//console.log("sub features :"+feature[j].feature);
					var Feature = subFeatures[j].feature;
					var id = subFeatures[j].id;
					var contains=$.inArray(id, childID);
					if(contains!=-1){
						html += '<ul>';
						html += '<li>';
						html += '<input type="checkbox" checked class="checkRoleFeature" value="child'+id+'"/><div>'+Feature+'</div>';
						html += ' </li>';
						html += '</ul>';
					}else{
						html += '<ul>';
						html += '<li>';
						html += '<input type="checkbox" class="checkRoleFeature" value="child'+id+'"/><div>'+Feature+'</div>';
						html += ' </li>';
						html += '</ul>';
					}
				}
				html += ' </li>';
				html += '</ul>';
			}else{
				html += '<ul>';
				html += '<li>';
				var contains=$.inArray(roleFeatures[i].id, childID);
				if(contains!=-1){
					html += '<input type="checkbox" class="checkRoleFeature" checked value="parent'+roleFeatures[i].id+'"/><div>'+roleFeatures[i].feature+'</div>';
				}else{
					html += '<input type="checkbox" class="checkRoleFeature"  value="parent'+roleFeatures[i].id+'"/><div>'+roleFeatures[i].feature+'</div>';
				}
				html += ' </li>';
				html += '</ul>';
			}
		}
		html += '</div>';
		html+='<input type="button"  class="btn btn-primary" value="Save and Update" onclick ="saveEditRoleFeature('+roleid+')">';
		html+='<input type="button"   class="btn btn-default" value="cancel" data-dismiss="modal">';
		return html;
	}
}

function featureModal(loginId,userName,role,userId,roleId){
	var featureArrayList=new Array();
	console.log(featureMasterListDetails);
	featureMasterList=featureMasterListDetails.successObject.featureMasterList;
	console.log(featureMasterList);
	$('#featureMasterModal').hide();
	$('#featureMasterModalTitle').html('');
	$('#featureMasterModalBody').html('');
	$('#addFeatureMasterMappingFooter').html('');
	$.get("../roleFeature/featureListBasedOnUserId.htm?userId="+userId,function(response){
		response=response.successObject.featureListBasedOnUserId;
		for(var k=0;k<response.length;k++){
			featureArrayList.push(response[k].featureId);
		}
		console.log(response);
	var html="";
	html+='<p id="featureMasterModalText" class="warning"></p>';
	html+='<div class="row mt10">';
	html+='&nbsp;&nbsp;&nbsp;Login-Id:<B>'+loginId+'</B><br>&nbsp;&nbsp;&nbsp;UserName:<B>'+userName+'</B><br>&nbsp;&nbsp;&nbsp;Role:<B>'+role+'</B><br><hr>';
	html+='<b>&nbsp;&nbsp;Feature Mapping</b>';
	html+='</div>';
	for(var i=0;i<featureMasterList.length;i++){
		var contains=$.inArray(featureMasterList[i].id, featureArrayList);
		if(featureMasterList[i].parentFeatureId==0 && contains!=-1){
			html+='<input type="checkbox" checked class="FeatureMasterListCheckBox" id="featureMasterCheckBox" value="'+featureMasterList[i].id+'" style="margin-left: 0px;">'+featureMasterList[i].feature+'</input><br>';
		}else if(featureMasterList[i].parentFeatureId==0 && contains==-1){
			html+='<input type="checkbox" class="FeatureMasterListCheckBox" id="featureMasterCheckBox" value='+featureMasterList[i].id+' style="margin-left: 0px;">'+featureMasterList[i].feature+'</input><br>';		
		}else if(featureMasterList[i].parentFeatureId>0 && contains!=-1){
			html+='&nbsp;&nbsp&nbsp;&nbsp;<input type="checkbox" checked class="FeatureMasterListCheckBox" id="featureMasterCheckBox" value='+featureMasterList[i].id+' style="margin-left: 0px;">'+featureMasterList[i].feature+'</input><br>';		
		}else{
			html+='&nbsp;&nbsp&nbsp;&nbsp;<input type="checkbox" class="FeatureMasterListCheckBox" id="featureMasterCheckBox" value='+featureMasterList[i].id+' style="margin-left: 0px;">'+featureMasterList[i].feature+'</input><br>';		
		}
	}
	$('#addFeatureMasterMappingFooter').append('<button type="button" class="btn btn-primary" onclick="saveNewFeatureMasterMapping('+userId+','+roleId+')">Save And Update</button>&nbsp;&nbsp;<button class="btn btn-default" aria-hidden="true" data-dismiss="modal" type="button">Cancel</button>');
	$('#featureMasterModalBody').append(html);
	$('#featureMasterModalTitle').append('Related User Feature Mapping<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>');
	$('#featureMasterModal').modal('show');
   });
	}

function listAllOrganizationForUser(userId){
	$('#page-wrapper').mask('Loading...');
	$('#listOrganizationTab').html('');
	userId=parseInt(userId);
	$.get("../adminUser/listOrganizations.htm?userId="+userId,function(response){
		if(response.status=="LIST_SUCCESS"){
			organizationListForUser=response;
			console.log(organizationListForUser);
			$('#page-wrapper').unmask();
			return response;
		}else{
			$('#page-wrapper').mask(response.errorMessage);
			return response;
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function listOrganization(){
	$('#page-wrapper').mask('Loading...');
	$('#listOrganizationTab').html('');
	$.get("../organization/list.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			organizationListAll=response;
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function organizationModal(loginId,userName,role,userId,roleId){
	ids=[];
	count=count+1;
	console.log(organizationListAll);
	var response=organizationListAll.successObject.organizationList;
	$('#featureMasterOrganizationModal').hide();
	$('#featureMasterOrganizationModalTitle').html('');
	$('#featureMasterOrganizationModalBody').html('');
	$('#featureMasterOrganizationMappingFooter').html('');
	$.get("../adminUser/organizationListByUserId.htm?userId="+userId,function(data){
		console.log(data);
	data=data.successObject.organizationListByUserId;
	var html="";
	html+='<p id="featureMasterModalText" class="warning"></p>';
	html+='<div class="row mt10">';
	html+='&nbsp;&nbsp;&nbsp;Login-Id:<B>'+loginId+'</B><br>&nbsp;&nbsp;&nbsp;UserName:<B>'+userName+'</B><br>&nbsp;&nbsp;&nbsp;Role:<B>'+role+'</B><br><hr style="margin-top: 10px;margin-bottom: 6px;border: 0;border-top: 1px solid #000;">';
	if(data.length!=0){
		html+='<div id="addOrganization" class="col-xs-15">';
		for(var i=0;i<data.length;i++){
			ids.push(''+data[i].organizationId+'');
		html+='<input type="hidden" value="'+data[i].organizationId+'" id="selectedOranization_'+data[i].organizationId+'" class="abc"><label id="organizationName_'+data[i].organizationId+'" name="selectedOrganizationNameList" class="SelectedOrganizationName" value="'+data[i].organizationId+'">Organization:&nbsp;&nbsp;&nbsp;'+data[i].organizationFullName+'';
		html+="<button type='button' id='IndustryType"+count+"' style='margin-left: 531px;margin-top: -32px;' onclick=\"(deleteTextBox('"+loginId+"','"+userName+"','"+role+"','"+userId+"','"+roleId+"','"+data[i].organizationId+"','"+count+"'))\" class='btn btn-default btn-sm'><i class='glyphicon glyphicon-trash'></i>";
		html+='</button><hr style="margin-top: 10px;width: 600px;margin-bottom: 6px;border: 0;border-top: 1px solid #000;"></label>';
		}
		html+='</div>';
	}else{
		html+='<div id="addOrganization" class="col-xs-15">';
		html+='</div>';
	}
	
	html+='<div id="organizationType"  class="col-sm-12">'
		+'<div class="SubHeading addAdminForm col-xs-14 row">'
	    +'<div class="col-sm-12 Action_heading"><h5><B>Add Organization</B></h5>'
	    +'</div>';

	html+='<form class="col-sm-12" role="form" id="addOrganizationTypeForm">'
	+ '<div class="col-sm-12 row">'
	+ '<div class="col-sm-5">'
	+'<label style="margin-left: -20px;"><h5>Select Organization:</B></h5></label>'
	+ '</div>'
	+ '<div class="col-sm-7">'
	+ '<select id="selectOrganizationName" class="form-control"  style="width: 405px;margin-bottom: 12px;margin-left: -96px;">';
	for(var i=0;i<response.length;i++){
		html+='<option value="'+response[i].id+'">'+response[i].organizationFullName+'</option>';
	}
	html+='</select>'
	+ '</div>'
	+ '</div>'
	
		+'<div class="form-group input-group">'
		+'<button id="organizationNameType"style=" margin-left: 468px;" onclick="addOrganizationName('+userId+','+count+')" class="btn btn-primary" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span><B>Add</B></button>'	
		+'</div>'
		+'</div>'
	+'</div>'
	+'</form>'
	+'</div>';
	
	html+='</div>';
	$('#featureMasterOrganizationMappingFooter').append('<button type="button" class="btn btn-primary" onclick=\'(saveOrganizationUserMapping("'+userId+'"))\'>Done</button>&nbsp;&nbsp;<button class="btn btn-default" aria-hidden="true" data-dismiss="modal" type="button">Cancel</button>');
	$('#featureMasterOrganizationModalBody').append(html);
	$('#featureMasterOrganizationModalTitle').append('Related Organizations<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>');
	$('#featureMasterOrganizationModal').modal('show');
	});
  }

function addOrganizationName(userId,count){
	var selectedOrganizationName=$('#selectOrganizationName option:selected').text();
	var selectedOrganizationId=$('#selectOrganizationName option:selected').val();
	if($.inArray(selectedOrganizationId,ids)==-1){
	ids.push(selectedOrganizationId);
		count=count+1;  
		var html="";
		html+='<input type="hidden" id="organizationNames_'+count+'" value="'+selectedOrganizationId+'" class="abc"><label id="organizationName_'+selectedOrganizationId+'" name="selectedOrganizationNameList" class="SelectedOrganizationName" value='+selectedOrganizationId+'>Organization:&nbsp;&nbsp;&nbsp;'+selectedOrganizationName+''
			+'<button type="button" id="IndustryType'+count+'" style="margin-left: 531px;margin-top: -32px;" onclick="deleteOrganizationUserTable('+selectedOrganizationId+')" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-trash"></i>'
			+'</button><hr style="margin-top: 10px;width: 600px;margin-bottom: 6px;border: 0;border-top: 1px solid #000;"></label>';
		$("#addOrganization").append(html);
	}else{
		alert("organization Already exist");
	}
}

function deleteTextBox(loginId,userName,role,userId,roleId,organizationId,count){
	if(confirm("Are you sure you want to delete selected item(s)?")){
	$.get("../adminUser/deleteUserOrganization.htm?userId="+userId+"&organizationId="+organizationId,function(data){
		console.log(data);
		if(data.status=="SUCCESS"){
		$("#organizationName_"+organizationId).remove();
		ids=jQuery.grep(ids, function(value){
			return value != organizationId;
		});
		}
	});
	}
}

function deleteOrganizationUserTable(organizationId){
	$("#organizationName_"+organizationId).remove();
	ids=jQuery.grep(ids, function(value){
		return value != organizationId;
	});
	console.log(ids);
	}

function saveOrganizationUserMapping(userId){
	console.log(ids);
	if(ids.length>0){
	var userOrganizationMappingObject = {
			userId:userId,
			organizationIds:ids,
         };
	console.log(userOrganizationMappingObject);
		$.ajax({
		url:"../adminUser/saveUserOrganizationMapping.htm",
		type:"POST",
		data:JSON.stringify(userOrganizationMappingObject),
		contentType:"application/json",
		dataType: "json",
		success:function(response){
		console.log(response);
		if(response.status=="SAVE_SUCCESS"){
			unload();
			$('#featureMasterOrganizationModal').modal('hide');
			$('#featureMasterSuccessModal').modal('show');
			$('#page-wrapper').unmask();
		}else{
			console.log("Some thing went wrong in saveOrganizationUserMapping metod");
			$('#page-wrapping').unmask();
		}			
	    }});
		}else{
			$('#featureMasterOrganizationModal').modal('hide');
			$('#featureMasterSuccessModal').modal('show');
			$('#page-wrapper').unmask();
	    }
	}

function unique(list){
	var result=[];
	$.each(list,function(i,e){
		if($.inArray(e,result)==-1)result.push(e);
	});
	return result;
}

function userRelatedDepartment(){
	$('#selectDepartmentName').html('');
	var organizationId=$('#selectOrganizationName option:selected').val();
	$.get("../adminUser/listDepartments.htm?organizationId="+organizationId,function(response){
		response=response.successObject.listDepartmentsList;
		for(var k=0;k<response.length;k++){
			var html="";
			html += '<option value="'+response[k].id+'">'+response[k].departmentName+'</option>';
			html += '</select>';
			$('#selectDepartmentName').append(html).show();
		}});
}

function departmentModal(loginId,userName,role,userId,roleId){
	departmentIds = [];
	selectedOranizationIds=[];
	$('#featureMasterDepartmentModal').hide();
	$('#featureMasterDepartmentModalTitle').html('');
	$('#featureMasterDepartmentModalBody').html('');
	$('#featureMasterDepartmentMappingFooter').html('');
	$.get("../adminUser/listOrganizations.htm?userId="+userId,function(response){
		var response=response.successObject.userOrganizationsList;
		console.log(response);
	$.get("../adminUser/departmentListByUserId.htm?userId="+userId,function(data){
		
		console.log(data);
		data=data.successObject.departmentListByUserId;
	var html="";
	html += '<p id="featureMasterModalText" class="warning"></p>';
	html += '<div class="row mt10">';
	html += '&nbsp;&nbsp;&nbsp;Login-Id:<B>' + loginId+ '</B><br>&nbsp;&nbsp;&nbsp;UserName:<B>' + userName+ '</B><br>&nbsp;&nbsp;&nbsp;Role:<B>' + role + '</B><br><hr>';
	if(data.length!=0){
		html+='<div id="addDepartment" class="col-xs-15">';
		for(var i=0;i<data.length;i++){
			departmentIds.push(''+data[i].id+'');
			selectedOranizationIds.push(''+data[i].organizationId+'');
		html+='<input type="hidden" value="'+data[i].organizationId+'" id="selectedOranization_'+data[i].organizationId+'"">';
		html+='<input type="hidden" value="'+data[i].id+'" id="selectedDepartment_'+data[i].id+'">';
		html+='<label id="organizationName_'+data[i].id+'" name="selectedOrganizationNameList" class="SelectedOrganizationName" value="'+data[i].id+'">Organization:&nbsp;&nbsp;&nbsp;'+data[i].organizationName+'&nbsp;&nbsp;&nbsp;Department:&nbsp;&nbsp;'+data[i].departmentName+'';
		html+="<button type='button' id='departmentType"+count+"' style='margin-left: 531px;margin-top: -32px;' onclick=deleteDepartmentLabelData('"+userId+"','"+roleId+"','"+data[i].id+"','"+data[i].organizationId+"') class='btn btn-default btn-sm'><i class='glyphicon glyphicon-trash'></i>";
		html+='</button><hr style="margin-top: 10px;width: 600px;margin-bottom: -3px;border: 0;border-top: 1px solid #000;"></label>';
		}
		html+='</div>';
	}else{
		html+='<div id="addDepartment" class="col-xs-15">';
		html+='</div>';
	}
	html += '<div id="departmentType"  class="col-sm-12">';
	html += '<div class="SubHeading addAdminForm col-xs-14 row">';
	html += '<div class="col-sm-12 Action_heading"><h5><B>Add Department</B></h5>';
	html += '</div>';
	html += '<form class="col-sm-12 row" role="form" id="addDepartmentTypeForm">';
	html += '<div class="col-sm-6">';
	html += 'Select Organization:<select id="selectOrganizationName" onChange = "userRelatedDepartment()" class="form-control">';
	html += '<option value="0">Select</option>';
	for(var i=0;i<response.length;i++){
	html += '<option value="'+response[i].organizationId+'">'+response[i].organizationFullName+'</option>';
	}
	html += '</select>';
	html += '</div>';
	html += '<div class="col-sm-6">';
	html += 'Select Department:<select id="selectDepartmentName" class="form-control">';
	html += '<option value="0">Select</option>';
	html += '</select>';
	html += '</div>';
	html += '</form>';
	
	html +='<div class="form-group input-group">';
	console.log(response.length);
	if(response.length>0){
	html +='<button id="organizationNameType"style="margin-left: 458px;margin-top: 7px;" onclick="addDepartmentName('+userId+','+count+')" class="btn btn-primary" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span><B>Add</B></button>';
	}else{
		html +='<button disabled id="organizationNameType"style="margin-left: 458px;margin-top: 7px;" onclick="addDepartmentName('+userId+','+count+')" class="btn btn-primary" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span><B>Add</B></button>';	
	}
	html +='</div>';
	
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$('#featureMasterDepartmentMappingFooter').append('<button type="button" class="btn btn-primary" onclick="saveOrganizationDepartmentMapping('+userId+')">Done</button>&nbsp;&nbsp;<button class="btn btn-default" aria-hidden="true" data-dismiss="modal" type="button">Cancel</button>');
	$('#featureMasterDepartmentModalBody').append(html);
	$('#featureMasterDepartmentModalTitle').append('Related Departments<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>');
	$('#featureMasterDepartmentModal').modal('show');
	});
	});
	}

function addDepartmentName(userId,count){
	var selectedOrganizationId=$('#selectOrganizationName option:selected').val();
	var selectedOrganizationName=$('#selectOrganizationName option:selected').text();
    var selectedDepartmentId=$('#selectDepartmentName option:selected').val();
    var selectedDepartmentName=$('#selectDepartmentName option:selected').text();
    var departmentContains=$.inArray(selectedDepartmentId,departmentIds);
    var organizationContains=$.inArray(selectedOrganizationId,selectedOranizationIds);
    console.log("organizationIds"+selectedOrganizationId+"List"+departmentIds);
    console.log("departmentIds"+selectedDepartmentId+"List"+selectedOranizationIds);
    if(selectedOrganizationId==0 || selectedDepartmentId == 0 || selectedDepartmentId == undefined){
		alert("please select Organization and Department");
	}else if((organizationContains==-1) || (organizationContains!=-1 && departmentContains==-1)){
	departmentIds.push(selectedDepartmentId);
	selectedOranizationIds.push(selectedOrganizationId)
		count=count+1;  
		var html="";
		html+='<input type="hidden" value="'+selectedOrganizationId+'" id="selectedOranization_'+selectedOrganizationId+'" class="abc">';
		html+='<input type="hidden" value="'+selectedDepartmentId+'" id="selectedOranization_'+selectedDepartmentId+'" class="abc">';
		html+='<label id="organizationName_'+selectedDepartmentId+'" name="selectedOrganizationNameList" class="SelectedOrganizationName" value="'+selectedOrganizationId+'">Organization:&nbsp;&nbsp;&nbsp;'+selectedOrganizationName+'&nbsp;&nbsp;&nbsp;Department:&nbsp;&nbsp;'+selectedDepartmentName+'';
		html+="<button type='button' id='departmentType"+count+"' style='margin-left: 531px;margin-top: -32px;' onclick=deleteDepartmentAddedNewly('"+selectedOrganizationId+"','"+selectedDepartmentId+"') class='btn btn-default btn-sm'><i class='glyphicon glyphicon-trash'></i>";
		html+='</button><hr style="margin-top: 10px;width: 600px;margin-bottom: -3px;border: 0;border-top: 1px solid #000;"></label>';
		$("#addDepartment").append(html);
	}else{
		alert("Department Already exist");
	}	
}

function deleteDepartmentLabelData(userId,roleId,departmentId,organizationId){
	if(confirm("Are you sure you want to delete selected item(s)?")){
	$.get("../adminUser/deleteUserOrganizationDepartmentMapping.htm?userId="+userId+"&organizationId="+organizationId+"&departmentId="+departmentId,function(data){
		console.log(data);
		if(data.status=="SUCCESS"){
		$("#organizationName_"+departmentId).remove();
		departmentIds=jQuery.grep(departmentIds, function(value){
			return value != departmentId;
		});
		console.log(selectedOranizationIds);
		var index = $.inArray(organizationId, selectedOranizationIds);
		selectedOranizationIds.splice(index, 1);
		}
	});
	}
}

function deleteDepartmentAddedNewly(organizationId,departmentId){
	$("#organizationName_"+departmentId).remove();
	departmentIds=jQuery.grep(departmentIds, function(value){
		return value != departmentId;
	});
	var index = $.inArray(organizationId, selectedOranizationIds);
	selectedOranizationIds.splice(index, 1);
	/*selectedOranizationIds=jQuery.grep(selectedOranizationIds, function(value){
		return value != organizationId;
	console.log(departmentIds);
   });*/
 }

function saveOrganizationDepartmentMapping(userId){
	console.log(selectedOranizationIds);
	console.log(departmentIds);
	if(departmentIds.length>0){
	var userOrganizationDepartmentMappingObject = {
			userId:userId,
			departmentIds:departmentIds,
			organizationIds:selectedOranizationIds
         };
	console.log(userOrganizationDepartmentMappingObject);
		$.ajax({
		url:"../adminUser/saveUserOrganizationDepartmentMapping.htm",
		type:"POST",
		data:JSON.stringify(userOrganizationDepartmentMappingObject),
		contentType:"application/json",
		dataType: "json",
		success:function(response){
		console.log(response);
		if(response.status=="SAVE_SUCCESS"){
			unload();
			$('#featureMasterDepartmentModal').modal('hide');
			$('#featureMasterSuccessModal').modal('show');
			$('#page-wrapper').unmask();
		}else{
			console.log("Some thing went wrong in saveOrganizationUserMapping metod");
			$('#page-wrapping').unmask();
		}			
	    }});
     	}else{
     		$('#featureMasterDepartmentModal').modal('hide');
			$('#featureMasterSuccessModal').modal('show');
			$('#page-wrapper').unmask();	
     	}
}

function listClientOrganizationGroup(){
	$('#page-wrapper').mask('Loading...');
	$('#listOrganizationTab').html('');
	$.get("../adminUser/listAllClientOrgGroup.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			clientOrganizationGroupList=response;
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function clientModal(loginId,userName,role,userId,roleId){
	clientOrganizationGroupIds = [];
	clientOrganizationIds = [];
	var response=clientOrganizationGroupList.successObject.organizationGroupListForClient;
	$('#featureMasterClientModal').hide();
	$('#featureMasterClientModalTitle').html('');
	$('#featureMasterClientModalBody').html('');
	$('#featureMasterClientMappingFooter').html('');
	$.get("../adminUser/clientOrganizationListByUserId.htm?userId="+userId,function(data){
		console.log(data);
	data=data.successObject.organizationGroupListByUserId;
	var html="";
	html+='<p id="featureMasterModalText" class="warning"></p>';
	html+='<div class="row mt10">';
	html+='&nbsp;&nbsp;&nbsp;Login-Id:<B>'+loginId+'</B><br>&nbsp;&nbsp;&nbsp;UserName:<B>'+userName+'</B><br>&nbsp;&nbsp;&nbsp;Role:<B>'+role+'</B><br><hr>';
	
	if(data.length!=0){
		html+='<div id="addClient" class="col-xs-15">';
		for(var i=0;i<data.length;i++){
			clientOrganizationGroupIds.push(''+data[i].organizationGroupId+'');
			clientOrganizationIds.push(''+data[i].id+'');
		html+='<input type="hidden" value="'+data[i].organizationGroupId+'" id="selectedOranizationGroup_'+data[i].organizationGroupId+'"">';
		html+='<input type="hidden" value="'+data[i].id+'" id="selectedOrganizationId_'+data[i].id+'">';
		html+='<label id="organizationName_'+data[i].id+'" name="selectedOrganizationNameList" class="SelectedOrganizationName" value="'+data[i].id+'">Org Group:&nbsp;&nbsp;&nbsp;'+data[i].organizationGroupName+'&nbsp;&nbsp;&nbsp;Organization:&nbsp;&nbsp;'+data[i].organizationFullName+'';
		html+="<button type='button' id='departmentType"+count+"' style='margin-left: 531px;margin-top: -32px;' onclick=deleteClientOrganizationLabelData('"+userId+"','"+roleId+"','"+data[i].id+"','"+data[i].organizationGroupId+"') class='btn btn-default btn-sm'><i class='glyphicon glyphicon-trash'></i>";
		html+='</button><hr style="margin-top: 10px;width: 600px;margin-bottom: -3px;border: 0;border-top: 1px solid #000;"></label>';
		}
		html+='</div>';
	}else{
		html += '<div id="addClient" class="col-xs-15">';
		html += '</div>';
	}
	
	html += '<div id="organizationType"  class="col-sm-12">';
	html += '<div class="SubHeading addAdminForm col-xs-14 row">';
	html += '<div class="col-sm-12 Action_heading"><h5><B>Add Client Organization(competitors are added automatically)</B></h5>';
	html += '</div>';
	html += '<form class="col-sm-12 row" role="form" id="addOrganizationTypeForm">';
	html += '<div class="col-sm-6">';
	html += 'Select Org Group:<select id="selectOrganizationGroupName" onChange="selectedClientOrganizationNameList()" class="form-control">';
	html += '<option value="0">All</option>';
	for(var i=0;i<response.length;i++){
	html += '<option value="'+response[i].id+'">'+response[i].organizationGroupName+'</option>';
	}
	html += '</select>';
	html += '</div>';
	html += '<div class="col-sm-6">';
	html += 'Select Org:<select id="selectClientOrganizationName" class="form-control">';
	html += '<option value="0">All</option>';
	html += '</select>';
	html += '</div>';
	html += '</form>';
	html +='<div class="form-group input-group">';
	html += '<button id="organizationNameType"style=" margin-left: 455px;margin-top: 5px" onclick="addClientOrganizationName()" class="btn btn-primary" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span><B>Add</B></button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$('#featureMasterClientMappingFooter').append('<button type="button" class="btn btn-primary" onclick="saveClientorganization('+userId+','+roleId+')">Done</button>&nbsp;&nbsp;<button class="btn btn-default" aria-hidden="true" data-dismiss="modal" type="button">Cancel</button>');
	$('#featureMasterClientModalBody').append(html);
	$('#featureMasterClientModalTitle').append('Related Client Organizations<button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>');
	$('#featureMasterClientModal').modal('show');
	});
	}

function selectedClientOrganizationNameList(){
	$('#selectClientOrganizationName').html('');
	var organizationGroupId=$('#selectOrganizationGroupName option:selected').val();
	$.get("../adminUser/listClientOrganization.htm?organizationGroupId="+organizationGroupId,function(data){
		data=data.successObject.listByGroupIdList;
		console.log(data);
		for(var k=0;k<data.length;k++){
			var html="";
			html += '<option value="'+data[k].id+'">'+data[k].organizationFullName+'</option>';
			html += '</select>';
			$('#selectClientOrganizationName').append(html).show();
		}});
}

function addClientOrganizationName(){
	console.log(clientOrganizationGroupIds);
	console.log(clientOrganizationIds);
	var selectedOrganizationGroupId=$('#selectOrganizationGroupName option:selected').val();
	var selectedOrganizationGroupName=$('#selectOrganizationGroupName option:selected').text();
    var selectedClientOrganizationId=$('#selectClientOrganizationName option:selected').val();
    var selectedClientOrganizationName=$('#selectClientOrganizationName option:selected').text();
    var organizationGroupContains=$.inArray(selectedOrganizationGroupId,clientOrganizationGroupIds);
    var organizationClientContains=$.inArray(selectedClientOrganizationId,clientOrganizationIds);
    console.log("organizationIds"+selectedOrganizationGroupId+"List"+departmentIds);
    console.log("departmentIds"+selectedClientOrganizationId+"List"+selectedOranizationIds);
    if(selectedOrganizationGroupId==0 || selectedClientOrganizationId == 0 || selectedClientOrganizationId == undefined){
		alert("please select Organization Group and Organization");
	}else if((organizationGroupContains==-1) || (organizationGroupContains!=-1 && organizationClientContains==-1)){
		clientOrganizationGroupIds.push(selectedOrganizationGroupId);
		clientOrganizationIds.push(selectedClientOrganizationId);
		count=count+1;  
		var html="";
		html+='<input type="hidden" value="'+selectedOrganizationGroupId+'" id="selectedOranization_'+selectedOrganizationGroupId+'" class="abc">';
		html+='<input type="hidden" value="'+selectedClientOrganizationId+'" id="selectedOranization_'+selectedClientOrganizationId+'" class="abc">';
		html+='<label id="organizationName_'+selectedClientOrganizationId+'" name="selectedOrganizationNameList" class="SelectedOrganizationName" value="'+selectedOrganizationGroupId+'">Org Group:&nbsp;&nbsp;&nbsp;'+selectedOrganizationGroupName+'&nbsp;&nbsp;&nbsp;Organization:&nbsp;&nbsp;'+selectedClientOrganizationName+'';
		html+="<button type='button' id='departmentType"+count+"' style='margin-left: 531px;margin-top: -32px;' onclick=deleteClientAddedNewly('"+selectedOrganizationGroupId+"','"+selectedClientOrganizationId+"') class='btn btn-default btn-sm'><i class='glyphicon glyphicon-trash'></i>";
		html+='</button><hr style="margin-top: 10px;width: 600px;margin-bottom: -3px;border: 0;border-top: 1px solid #000;"></label>';
		$("#addClient").append(html);
	}else{
		alert("client Organization Already exist");
	}	
}

function deleteClientAddedNewly(organizationGroupId,organizationId){
	$("#organizationName_"+organizationId).remove();
	var index = $.inArray(organizationGroupId, clientOrganizationGroupIds);
	clientOrganizationGroupIds.splice(index, 1);
	clientOrganizationIds=jQuery.grep(clientOrganizationIds, function(value){
		return value != organizationId;
	console.log(clientOrganizationIds);
   });
}

function deleteClientOrganizationLabelData(userId,roleId,clientOrganizationId,organizationGroupId){
	if(confirm("Are you sure you want to delete selected item(s)?")){
	$.get("../adminUser/deleteUserOrganization.htm?userId="+userId+"&organizationId="+clientOrganizationId,function(data){
		console.log(data);
		$("#organizationName_"+clientOrganizationId).remove();
		var index = $.inArray(organizationGroupId, clientOrganizationGroupIds);
		clientOrganizationGroupIds.splice(index, 1);
		clientOrganizationIds=jQuery.grep(clientOrganizationIds, function(value){
			return value != clientOrganizationId;
		});
	});
	}
}

function saveClientorganization(userId,roleId){
	console.log(clientOrganizationGroupIds);
	console.log(clientOrganizationIds);
	if(clientOrganizationIds.length>0){
	var userClientOrganizationMappingObject = {
			userId:userId,
			organizationIds:clientOrganizationIds,
         };
	console.log(userClientOrganizationMappingObject);
		$.ajax({
		url:"../adminUser/saveUserOrganizationMapping.htm",
		type:"POST",
		data:JSON.stringify(userClientOrganizationMappingObject),
		contentType:"application/json",
		dataType: "json",
		success:function(response){
		console.log(response);
		if(response.status=="SAVE_SUCCESS"){
			unload();
			$('#featureMasterClientModal').modal('hide');
			$('#featureMasterSuccessModal').modal('show');
			$('#page-wrapper').unmask();
		}else{
			console.log("Some thing went wrong in saveOrganizationUserMapping metod");
			$('#page-wrapping').unmask();
		}			
	    }});
     	}else{
     		$('#featureMasterClientModal').modal('hide');
			$('#featureMasterSuccessModal').modal('show');
			$('#page-wrapper').unmask();	
     	}
  }
