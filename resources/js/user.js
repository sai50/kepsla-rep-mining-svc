
/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllUserCheckBox",function(){
    $('.userCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".userCheckBox",function(){
    if($('.userCheckBox:checked').length == $('.userCheckBox').length) {
      $('#checkAllUserCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllUserCheckBox').prop('checked', false);
    }
});
function deleteUser(){
	var ids = selectedIds('userCheckBox');//Pass Check Box Class
	if(ids.length>0){
	if(confirm("Do you want to delete selected record(s)?")){
		$('#page-wrapping').mask('Loading...');
		$('#deleteUserSuccessDiv').hide();
		$('#deleteUserErrorDiv').hide();
		$.ajax({
			type:"POST",
			url:"../user/delete.htm",
			contentType:"application/json",
			data:JSON.stringify(ids),
			success:function(response){
				if(response.status=="DELETE_SUCCESS"){
					var html = listUserHtml(response);
					$('#userDataDiv').html(html);
					$('#deleteUserSuccessDiv').show(600);
					$('#userListTable').dataTable();
					$('#page-wrapping').unmask();
				}else{
					console.log(response);
					$('#deleteUserErrorDiv').html('');
					var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
					$('#deleteUserErrorDiv').append(errorMessage);
					$('#deleteUserErrorDiv').show(600);
					$('input:checkbox').removeAttr('checked');
					$('#page-wrapping').unmask();
				}
			},error:function(response){
				$('#page-wrapping').mask(response.status+"*********"+response.statusText);
			}
		});
		return false;
	}
	}else{
		alert("Please select row");
		return false;
		
	}
}
function addUser(){
	$('#page-wrapping').mask('Loading...');
	var divId = $('#'+getDivId("UserMaster"));
	$.get("../user/add.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = addUserFormHtml(response);
			appendUserManagementAddOrEditForm(divId,html);
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"********"+response.errorMessage);
	});
	return false;
}

function addUserFormHtml(response){
	var roleList = response.successObject.roleList;
	var organizationList = response.successObject.organizationList;
	var html = "";
	html +='<div id="createUserDiv">';
	html+=	 addFormHeading("Add User");
	html+=	'<form class="col-sm-12" id="addUserForm">';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;" id="addUserSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png">User Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addUserErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************User Name***************************************************** */
	html += '<div class="form-group" id="Add-userName-Error" style="width:300px;">';
	html += '<label>User Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="add-userName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userName" name="userName" placeholder="Choose Your User Name" maxlength="50" required="required">';
	html += '</div>';

	/** ************************************Primary Email***************************************************** */
	html += '<div class="form-group" id="Add-primaryEmail-Error" style="width:300px;">';
	html += '<label>Primary Email<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="add-primaryEmail-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="primaryEmail" placeholder="Enter Enter Your Primary Email" maxlength="50">';
	html += '</div>';
	
	/** ************************************Confirm Primary Email***************************************************** */
	html += '<div class="form-group" id="Add-confirmPrimaryEmail-Error" style="width:300px;">';
	html += '<label>Confirm Primary Email<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="add-confirmPrimaryEmail-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="confirmPrimaryEmail" placeholder="Confirm Your Primary Email" maxlength="50" name="emailID">';
	html += '</div>';
	
	/** ************************************Mobile***************************************************** */
	html += '<div class="form-group" id="Add-mobile-Error" style="width:300px;">';
	html += '<label>Mobile<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="add-mobile-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="mobileNumberVal" placeholder="Enter Your User Mobile Number" maxlength="50">';
	html += '</div>';
	
	/** ************************************First Name***************************************************** */
	html += '<div class="form-group" id="Add-userFirstName-Error" style="width:300px;">';
	html += '<label>First Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="add-userFirstName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="firstName" placeholder="Enter Your First Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Middle Name***************************************************** **/
	html += '<div class="form-group" style="width:300px;">';
	html += '<label>Middle Name</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="middleName" placeholder="Enter Enter Your Middle Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Last Name***************************************************** */
	html += '<div class="form-group" style="width:300px;">';
	html += '<label>Last Name</label>';
	html += '<span style="color: #a94442"class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="lastName" placeholder="Enter Your Last Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Designation***************************************************** */
	html += '<div class="form-group"  style="width:300px;">';
	html += '<label>Designation</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="designation" placeholder="Enter Your Designation" maxlength="50">';
	html += '</div>';
	
	/** ************************************Secondary Email***************************************************** */
	html += '<div class="form-group" id="Add-secondaryEmail-Error" style="width:300px;">';
	html += '<label>Secondary Email</label>';
	html += '<span style="color: #a94442" id="add-secondaryEmail-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="secondaryEmail" placeholder="Enter Your Secondary Email" maxlength="50">';
	html += '</div>';
	
	/** ************************************Fax***************************************************** */
	html += '<div class="form-group" id="faxValue" style="width:300px;">';
	html += '<label>Fax</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="fax" placeholder="Enter Fax" maxlength="50">';
	html += '</div>';
	/** ************************************Role User Mapping***************************************************** */
	if(roleList.length > 0){
		html += '<div class="form-group" id="roleUserMapping">';
		html += '<label>Role<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm"  style="width: 27%" id="roleId">';
		for(var i=0;i<roleList.length;i++){
			var id = roleList[i].id;
			var roleName = roleList[i].role;
			html+=	'<option value='+id+'>'+roleName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}
	
	/** ************************************Organization User Mapping***************************************************** */
	html += '<br/><div class="form-group"><b>Organization-User-Mapping</b><div><select id="OrgUserMapping" multiple size="5" class="col-xs-3">';
	if(organizationList.length > 0){
		for(var i=0;i<organizationList.length;i++)
			html += '<option value='+organizationList[i].id+'>'+organizationList[i].organizationFullName+'</option>';
	}
	html += '</select> &nbsp;';
	html+=	'<a href="JavaScript:void(0);" onclick="addOrganization()" class="col-xs-1">Add&raquo;</a>';
	html+=	'<a href="JavaScript:void(0);" onclick="removeOrganization()" class="col-xs-2">&laquo;Remove</a>';
	html+=	'<select id="selectedOrganization" multiple size="5" class="col-xs-3">';
	html+=	'</select>';
	html+=	'</div></div>';
	
	/** ************************************Department User Mapping***************************************************** */
	html += '<br/><br/><br/><br/><div class="form-group"><b>Department-User-Mapping</b><div><select id="DepartmentUserMapping" multiple size="5" class="col-xs-3">';
	html += '</select> &nbsp;';
	html+=	'<a href="JavaScript:void(0);" onclick="addDepartment()" class="col-xs-1">Add&raquo;</a>';
	html+=	'<a href="JavaScript:void(0);"  onclick="removeDepartment()" class="col-xs-2">&laquo;Remove</a>';
	html+=	'<select id="selectedDepertments" multiple size="5" class="col-xs-3">';
	html+=	'</select>';
	html+=	'</div></div>';
	
	/** ************************************Button***************************************************** */
	html += '<br/><br/><br/><br/><input type="button" class="btn btn-primary" value="Add" onclick ="saveUser()">';
	html+=	appendCancelButton(getDivId("UserMaster"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	html += '</div>';
	return html;
}


function editUserForm(id){
	$('#page-wrapping').mask('Loading...');
	var divId = $('#'+getDivId("UserMaster"));
	//$('#userDataDiv').html('');
	$.get("../user/updateUserForm.htm?id="+id,function(response){
		if(response.status=="UPDATE_VIEW_SUCCESS"){
			var html = updateUserHtml(response);
			appendUserManagementAddOrEditForm(divId,html);
			//$("select#OrgUserMapping option[value=13]").remove();
			/*$('#userDataDiv').append(html);
			$('#page-wrapping').unmask();*/
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"*********"+response.statusText);
	});
}

function updateUserHtml(response){
	var html = "";
	var userDetails = response.successObject.userData;
	var user = userDetails.user;
	var userId = user.id;
	var primaryEmail = user.primaryEmail;
	var userName; 
	if(user.userName!=null){
		userName = user.userName;
	}else userName = '';
	var password = user.password;
	var secondaryEmail;
	if(user.secondaryEmail!=null){
		secondaryEmail = user.secondaryEmail;
	}else secondaryEmail = '';
	var userFirstName;
	if(user.userFirstName!=null){
		userFirstName = user.userFirstName;
	}else userFirstName='';
	
	var userLastName;
	if(user.userLastName!=null){
		userLastName = user.userLastName;
	}else userLastName='';
	
	var userMiddleName;
	if(user.userMiddleName!=null){
		userMiddleName = user.userMiddleName;
	}else userMiddleName ='';
	var designation;
	if(user.designation!=null){
		designation = user.designation;
	}else designation='';
	var mobile = user.mobile;
	var fax;
	if(user.fax!=null){
		fax = user.fax;
	}else fax='';
	var userRole = userDetails.userRole;
	var userOrganizationList = userDetails.userOrganizations;
	var userDepartmentList = userDetails.userDepartments;
	var roleList = userDetails.roleList;
	var organizationList = userDetails.organizationList;
	//alert("role: "+userRole+" :organizationList: "+userOrganizationList[0].organizationFullName+": departmentList: "+userDepartmentList[0].NAME);
	
	html+=	addFormHeading("Edit User");
	html+=	'<form class="col-sm-12" id="editUserForm">';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;" id="editUserSuccess">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png">User Updated Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editUserErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************userName***************************************************** */
	html += '<div class="form-group" id="Edit-userName-Error" style="width:300px;">';
	html += '<label>user Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id = "edit-userName-span-Error"class="help-inline"></span>';
	html += '<input	type="text" disabled="disabled" class="form-control input-sm" value="'+userName+'" id="editedUserName" placeholder="Enter User Name" maxlength="50">';
	html += '<input	type="hidden" value="'+password+'" id="userPassword" name="password">';
	html += '</div>';
	/** ************************************primaryEmail***************************************************** */
	html += '<div class="form-group" id="Edit-primaryEmail-Error" style="width:300px;">';
	html += '<label>Primary Email<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-primaryEmail-span-Error" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+primaryEmail+'" id="editedPrimaryEmail" placeholder="Enter Your Primary Email" maxlength="50">';
	
	/** ************************************Mobile***************************************************** */
	html += '<div class="form-group" id="Edit-mobile-Error" style="width:300px;">';
	html += '<label>Mobile<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-mobile-span-Error" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+mobile+'" id="editedUserMobile" placeholder="Enter Your Mobile" maxlength="10">';
	html += '</div>';
	
	/** ************************************userFirstName***************************************************** */
	html += '<div class="form-group" id="Edit-userFirstName-Error" style="width:300px;">';
	html += '<label>User FirstName<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-userFirstName-span-Error" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+userFirstName+'" id="editedUserFirstName" placeholder="Enter Your First Name" maxlength="50">';
	html += '</div>';
	/** ************************************userLastName***************************************************** */
	html += '<div class="form-group" id="Edit-LastNameDiv" style="width:300px;">';
	html += '<label>User LastName</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+userLastName+'" id="editeduUserLastName" placeholder="Enter Your Last Name" maxlength="50">';
	html += '</div>';
	/** ************************************userMiddleName***************************************************** */
	html += '<div class="form-group" id="Edit-MiddleNameDiv" style="width:300px;">';
	html += '<label>User MiddleName</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+userMiddleName+'" id="editedUserMiddleName" placeholder="Enter Your Middle Name" maxlength="50">';
	html += '</div>';
	/** ************************************Designation***************************************************** */
	html += '<div class="form-group" id="Edit-DesignationDiv" style="width:300px;">';
	html += '<label>designation</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+designation+'" id="editedUserDesignation" placeholder="Enter Your Designation Email" maxlength="50">';
	html += '</div>';
	
	html += '</div>';
	/** ************************************secondaryEmail***************************************************** */
	html += '<div class="form-group" id="Edit-secondaryEmail-Error" style="width:300px;">';
	html += '<label>Secondary Email</label>';
	html += '<span style="color: #a94442" id="edit-secondaryEmail-span-Error" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+secondaryEmail+'" id="editedSecondaryEmail" placeholder="Enter Your Secondary Email" maxlength="50">';
	html += '</div>';
	
	/** ************************************Fax***************************************************** */
	html += '<div class="form-group" id="Edit-faxDiv" style="width:300px;">';
	html += '<label>Fax</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+fax+'" id="editedUserFax" placeholder="Enter Your Fax" minLength = "10" maxlength="10" >';
	html += '</div>';
	/** ************************************Role User Mapping***************************************************** */
	if(roleList.length > 0){
		html += '<div class="form-group" id="roleUserMapping">';
		html += '<label>Role<font style="color: red">*</font></label>';
		html +=	'<select class="form-control"  style="width: 50%" id="editedUserRole">';
		for(var i=0;i<roleList.length;i++){
			var id = roleList[i].id;
			var roleName = roleList[i].role;
			if(roleName.localeCompare(userRole)==0){
				html+= '<option value=' + id + ' selected="selected">' + roleName + '</option>';
			}else{
				html+=	'<option value='+id+'>'+roleName+'</option>';
			}
		}
		html +=	'</select>';
		html += '</div>';
	}
	/** ************************************Organization User Mapping***************************************************** */
	html += '<br/><div class="form-group"><b>Organization-User-Mapping</b><div><select id="OrgUserMapping" multiple size="5" class="col-xs-3">';
	if(organizationList.length > 0){
		for(var i=0;i<organizationList.length;i++){
			for(var j=0;j<userOrganizationList.length;j++){
				if(userOrganizationList[j].id == organizationList[i].id){
					organizationList.splice(i, 1); 	//removing element from the list 
				}
			}
		
		}
	}
	for(var i=0; i<organizationList.length;i++){
			html += '<option value='+organizationList[i].id+'>'+organizationList[i].organizationFullName+'</option>';
	}
	html += '</select> &nbsp;';
	html+=	'<a href="JavaScript:void(0);" onclick="addOrganization()" class="col-xs-1">Add&raquo;</a>';
	html+=	'<a href="JavaScript:void(0);"  onclick="removeOrganization()" class="col-xs-2">&laquo;Remove</a>';
	html+=	'<select id="selectedOrganization" id="userSelectedOrgList" multiple size="5" class="col-xs-3">';
	if(userOrganizationList.length > 0){
		for(var i=0;i<userOrganizationList.length;i++){
			html += '<option value='+userOrganizationList[i].id+'>'+userOrganizationList[i].organizationFullName+'</option>';
			for(var j=0;j<organizationList.length;j++){
				if(userOrganizationList[i].id == organizationList[j].id){
					var idValue = organizationList[j].id;
					html += '<option value='+userOrganizationList[i].id+'>'+userOrganizationList[i].organizationFullName+'</option>';
				}
			}
		}
	}
	html+=	'</select>';
	html+=	'</div></div>';
	
	/** ************************************Department User Mapping***************************************************** */
	html += '<br/><br/><br/><br/><div class="form-group"><b>Department-User-Mapping</b><div><select id="DepartmentUserMapping" multiple size="5" class="col-xs-3">';
	for(var i=0;i<userOrganizationList.length;i++){
		var id = userOrganizationList[i].id;
		getDepartmekntsByOrgId(id);
	}
	
	html += '</select> &nbsp;';
	html+=	'<a href="JavaScript:void(0);" onclick="addDepartment()" class="col-xs-1">Add&raquo;</a>';
	html+=	'<a href="JavaScript:void(0);"  onclick="removeDepartment()" class="col-xs-2">&laquo;Remove</a>';
	html+=	'<select id="selectedDepertments" multiple size="5" class="col-xs-3">';
		if(userDepartmentList.length>0){
			for(var i=0; i<userDepartmentList.length;i++){
				html += '<option value='+userDepartmentList[i].ID+'>'+userDepartmentList[i].NAME+'</option>';
			}
		}
	html+=	'</select>';
	html+=	'</div></div><br><br><br><br><br>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateUser('+userId+')">';
	html+=	appendCancelButton(getDivId("UserMaster"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function updateUser(userId){
	var divId = $('#'+getDivId("UserMaster"));
	scrollDown(divId);
	
	$('#editUserSuccess').hide();
	$('#editUserErrorDiv').hide();
	var editedUserName = $.trim($('#editedUserName').val());
	var editedUserPrimaryEmail = $.trim($('#editedPrimaryEmail').val());
	var editedUserSecondaryEmail = $.trim($('#editedSecondaryEmail').val());
	var editedUserFirstName = $.trim($('#editedUserFirstName').val());
	var editeduUserLastName = $.trim($('#editeduUserLastName').val());
	var editedUserMiddleName = $.trim($('#editedUserMiddleName').val());
	var editedUserMobile = $.trim($('#editedUserMobile').val());
	var editedUserDesignation = $.trim($('#editedUserDesignation').val());
	var editedUserFax = $.trim($('#editedUserFax').val());
	var editedUserRole = $('#editedUserRole option:selected').val();
	
	var organizations = [];
	var departments = [];
	
	var selectedOrgnizations = 	 $('#selectedOrganization > option').length;
	if(selectedOrgnizations >0 ){
		$('#selectedOrganization option').each( function() {
			var orgId = $(this).val();
			organizations.push(parseInt(orgId));
		});
	}
	
	var selectedOrgnizationsLength = organizations.length;
	  var selectedOrgnizationsIdsArrayList = '';
	  for(var i=0; i<selectedOrgnizationsLength; i++){
		  selectedOrgnizationsIdsArrayList += organizations[i];
	    if(selectedOrgnizationsLength != (i+1))
	    	selectedOrgnizationsIdsArrayList += ',';
	  }
	var selectedDepartments = $('#selectedOrganization > option').length;
	if(selectedDepartments >0 ){
		$('#selectedDepertments option').each( function() {
			var deptId = $(this).val();
			departments.push(parseInt(deptId));
		});
	}
	var selectedDepartmentsLength = departments.length;
	  var selectedDepartmentIdsArrayList = '';
	  for(var i=0; i<selectedDepartmentsLength; i++){
		  selectedDepartmentIdsArrayList += departments[i];
	    if(selectedDepartmentsLength != (i+1))
	    	selectedDepartmentIdsArrayList += ',';
	  }
	
	var JSONObject = {id:userId,userName:editedUserName,primaryEmail:editedUserPrimaryEmail,secondaryEmail:editedUserSecondaryEmail,userFirstName:editedUserFirstName,userLastName:editeduUserLastName,userMiddleName:editedUserMiddleName,mobile:editedUserMobile,designation:editedUserDesignation,fax:editedUserFax,userRoleId:parseInt(editedUserRole),userMappedOrganizationIds:selectedOrgnizationsIdsArrayList,userMappedDepartmentIds:selectedDepartmentIdsArrayList};
	console.log(JSONObject);
	$.post("../user/update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			/*$('#editUserSuccessDiv').show(600);
			$('#page-wrapping').unmask();*/
			
			$("#editUserSuccess").text("User Updated Successfully").show();
			
			/*var dataDivId = $('#userDataDiv');
			var successDivId = "editUserSuccessDiv";
			var tableId = "userListTable";
			var html = listUserHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);*/
		}else if(response.status=="UPDATE_ERROR"){
			$('#editUserErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapping').unmask();
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"***********"+response.statusText);
	});

}

function listUsers(){
	$('#page-wrapping').mask('Loading');
	$('#userDataDiv').html('');
	$.get("../user/listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			console.log(response);
			var html = listUserHtml(response);
			$('#userDataDiv').append(html);
			$('#userListTable').dataTable();
			$('#page-wrapping').unmask();
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function listUserHtml(response){
	var userList = response.successObject.userList;
	var html = "";
	html+=	'<form id="listUserForm">';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> User Updated Successfully';
	html += '</div>';

	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> User Added Successfully';
	html += '</div>';

	html+=	'<div class="alert alert-success" style="display:none;"id="deleteOrganizationGroupSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Group(s) Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationGroupErrorDiv">';
	html += '</div>';
	html+=		"<table class='table table-striped table-bordered' id='userListTable'>";
	html+=		"<thead>";
	html+=			"<tr>";
	html+=				'<th><input type="checkbox" id="checkAllUserCheckBox" style="margin-left: 0px;"></th>';
	html+=				'<th>User Name</th>';
	html+=				'<th>Email Id</th>';
	html+=				'<th></th>';
	html+=			"</tr>";
	html+=		"</thead>";
	html+=		'<tbody>';
	for(var i=0;i<userList.length;i++){
		var id = userList[i].id;
		var userName = userList[i].userName;
		var email = userList[i].primaryEmail;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="userCheckBox" value='+id+'></td>';
		html+=	'<td>'+userName+'</td>';
		html+=	'<td>'+email+'</td>';
		html+=	 '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editUserForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html+=		'</tbody>';
	html+=		'</table>';
	html+=	'</form>';
	html+=	addDiv("UserMaster");
	return html;
	
}


function addRoles(){
	$('#roleUserMapping option:selected').each( function() {
	        $('#selectedRoles').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}
function removeRoles(){
	$('#selectedRoles option:selected').each( function() {
	    $('#roleUserMapping').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}

function addOrganization(){
	$('#OrgUserMapping option:selected').each( function() {
	    $('#selectedOrganization').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    getDepartmekntsByOrgId($(this).val());    
	    $(this).remove();
	});

}
function removeOrganization(){
	$('#selectedOrganization option:selected').each( function() {
	    $('#OrgUserMapping').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    removeDepartmekntsByOrgId($(this).val());
	    $(this).remove();
	});

}

function addDepartment(){
	$('#DepartmentUserMapping option:selected').each( function() {
	        $('#selectedDepertments').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}
function removeDepartment(){
	$('#selectedDepertments option:selected').each( function() {
	    $('#DepartmentUserMapping').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}

function getDepartmekntsByOrgId(orgId){
	$.get("../user/getUserDepartmentsByOrgId.htm?orgId="+orgId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var departments = response.successObject.departments;
			for(var i=0; i<departments.length;i++){
				 $('#DepartmentUserMapping').append("<option value='"+departments[i].id+"'>"+departments[i].departmentName+"</option>");
			}
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"********"+response.errorMessage);
	});
	return false;
}

function removeDepartmekntsByOrgId(orgId){
	$.get("../user/getUserDepartmentsByOrgId.htm?orgId="+orgId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var departments = response.successObject.departments;
			for(var i=0; i<departments.length;i++){
				 $('#DepartmentUserMapping option[value='+departments[i].id+']').remove();
				 $('#selectedDepertments option[value='+departments[i].id+']').remove();
			}
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"********"+response.errorMessage);
	});
	return false;
}
function saveUser(){
	$('#createUserDiv').mask("Saving user data...");
	var divId = $('#'+getDivId("UserMaster"));
	scrollDown(divId);
	
	$('#page-wrapping').mask('Loading');
	$('#addUserSuccessDiv').hide();
	$('#addUserErrorDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	var usreName = $('#userName').val();
	var primaryEmail = $('#primaryEmail').val();
	var confirmPrimaryEmail=$('#confirmPrimaryEmail').val();
	var secondaryEmail = $('#secondaryEmail').val();
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();
	var middleName = $('#middleName').val();
	var designation = $('#designation').val();
	var mobile = $('#mobileNumberVal').val();
	var fax = $('#fax').val();
	var roles = [];
	var organizations = [];
	var departments = [];
	var selectedRolesLength = $('#selectedRoles > option').length;
	if(selectedRolesLength>0){
		$('#selectedRoles option').each( function() {
			var roleId = $(this).val();
			roles.push(roleId);
		});
		
	}
	var role = $('#roleId option:selected').val();
	
	var selectedOrgnizations = 	 $('#selectedOrganization > option').length;
	if(selectedOrgnizations >0 ){
		$('#selectedOrganization option').each( function() {
			var orgId = $(this).val();
			organizations.push(orgId);
		});
	}
	
	var selectedOrgnizationsLength = organizations.length;
	  var selectedOrgnizationsIdsArrayList = '';
	  for(var i=0; i<selectedOrgnizationsLength; i++){
		  selectedOrgnizationsIdsArrayList += organizations[i];
	    if(selectedOrgnizationsLength != (i+1))
	    	selectedOrgnizationsIdsArrayList += ',';
	  }
	
	var selectedDepartments = $('#selectedOrganization > option').length;
	if(selectedDepartments >0 ){
		$('#selectedDepertments option').each( function() {
			var deptId = $(this).val();
			departments.push(deptId);
		});
	}
	
	var selectedDepartmentsLength = departments.length;
	  var selectedDepartmentIdsArrayList = '';
	  for(var i=0; i<selectedDepartmentsLength; i++){
		  selectedDepartmentIdsArrayList += departments[i];
	    if(selectedDepartmentsLength != (i+1))
	    	selectedDepartmentIdsArrayList += ',';
	  }
	var userObject = {id:parseInt(1),userName:usreName,primaryEmail:primaryEmail,confirmPrimaryEmail:confirmPrimaryEmail,secondaryEmail:secondaryEmail,userFirstName:firstName,userLastName:lastName,userMiddleName:middleName,designation:designation,mobile:mobile,fax:fax,userRoleId:parseInt(role),userMappedOrganizationIds:selectedOrgnizationsIdsArrayList,userMappedDepartmentIds:selectedDepartmentIdsArrayList};
	console.log(userObject);
	$.post("../user/save.htm",userObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			/*$('#editUserSuccessDiv').show(600);
			$('#page-wrapping').unmask();*/
			$('#createUserDiv').unmask();
			$("#addUserSuccessDiv").text("User Created Successfully. An Email with activation link is sent to this mail id: "+primaryEmail).show(600);
			$('#userName').val("");
			$('#primaryEmail').val("");
			$('#confirmPrimaryEmail').val("");
			$('#secondaryEmail').val("");
			$('#firstName').val("");
			$('#lastName').val("");
			$('#middleName').val("");
			$('#designation').val("");
			$('#mobileNumberVal').val("");
			$('#fax').val("");
			
			/*var dataDivId = $('#userDataDiv');
			var successDivId = "editUserSuccessDiv";
			var tableId = "userListTable";
			var html = listUserHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);*/
		}else if(response.status=="SAVE_ERROR"){
			$('#createUserDiv').unmask();
			$('#addUserErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#add-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapping').unmask();
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
	
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"***********"+response.statusText);
	});
}

function checkEmail(email){
	var id= $(email).parent().attr('id');
	if((!email.value==' ')&&(!validateEmail(email.value))) { 
		$('#'+id).find('.help-inline').text('Please Enter Proper email!').show();
	}else{
		$('#'+id).find('.help-inline').text(' ');
	}
}
function validateEmail(emailId) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  if( !re.test( emailId ) ) {
	    return false;
	  } else {
	    return true;
	  }
}
function appendUserManagementAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearUserManagementMessages();
	maskId.unmask();
}
function clearUserManagementMessages(){
	
}
function checkMobile(mobileNo){
	var id= $(mobileNo).parent().attr('id');
	if (mobileNo.value.length != 10) { 
		$('#'+id).find('.help-inline').text('Please Enter 10 digit mobile number!').show();
	}else {
		$('#'+id).find('.help-inline').text(' ');
	}
}
