//var selectedOrganizationId;
var selectedDepartmetsArray = {};
var organizationsList;
$(document).ready(function() {
	listOrganizationGroup();
});
function listOrganizationGroup(){
	$.ajax({
		type:"GET",
		url:"../manageUsers/listOrganizationGroup.htm",
		dataType: "json",
		success:function(response){
			//console.log(response);
			if(response.length>0){
				$("#listUsers").html("");
				var html = "";
				html+='<div id="drops" class="tab-pane fade in active">';
				html+=	'<form  class="form-inline col-xs-12 SubHeading AdminMainActivity">';
				html+=	'<label class="control-label " for="OrganizationGroup">Select Hotel Chain/Group <select id="selectedOrganizationGroup" class="form-control input-sm" onchange="getOrganizationsForGroup()" style="min-width: 200px;">';
				//html+=	'<option value="0">ALL</option>';
						for(var i=0;i<response.length;i++){
							html+=	'<option value='+response[i].id+'>'+response[i].organizationGroupName+'</option>';
						}
				html+='</select>';
				html+='</label>';

				html+='<label id="drop" for="Organization">Select Hotel <select class="form-control input-sm" id="selectedOrganization" style="min-width: 200px;">';
				//html+='<option value="0">ALL</option>';
				html+='</select>';
				html +='</label>';
				html += '<input type="button" class="btn btn-primary" onclick="listUsers()" value="View User(s)" />';
				//add and delete buttons start
				html += '<div class="form-group float-right">';
				html += '<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteuser()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
				html += '<a onclick="addUser()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
				html += '</div>';		
				//add and delete buttons end
				html += '</form>';
				html += '</div>';
				$("#listUsers").append(html).show();
				getOrganizationsForGroup();
			}
			
		},error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                // alert('Not connect.\n Verify Network.');
             } else if (jqXHR.status == 404) {
                // alert('Requested page not found. [404]');
             } else if (jqXHR.status == 500) {
                // alert('Internal Server Error [500].');
             } else if (exception === 'parsererror') {
                 //alert('Requested JSON parse failed.');
             }
         
 		}
	});
}
function getOrganizationsForGroup(){
	$("#addAndEditManagerUserDiv").hide();
	var selectedOrganizationGroupId = $('#selectedOrganizationGroup option:selected').val();
	$("#drop").empty();
	$.ajax({
		type: "GET",
		url: "../manageUsers/listsOrganizations.htm?organizationGroupId="+selectedOrganizationGroupId,
		dataType: "json",
		success: function(response){
			organizationsList = response;
			//$('#selectedOrganization').val("ALL");
			//console.log(response);
			var html="";
			html+=	'<label for="Organization">Select Hotel <select class="form-control input-sm" id="selectedOrganization" style="min-width: 200px;">';
			//html+=	'<option value="0">ALL</option>';
			for(var i=0;i<response.length;i++){
				html+=	'<option value='+response[i].id+'>'+response[i].organizationFullName+'</option>';
			}
			html+='</select>';
			html+='</label>';
			$("#drop").append(html);
		}
	});
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
function addUser(){
	$('#listUsersDiv').hide();
	selectedDepartmetsArray = {};
	departmentsArray = [];
	var divId = $('#'+getDivId("ManagerUser"));
	$.get("../manageUsers/addUser.htm",function(response){
		var html = createUserFormHtml(response);
		appendUserManagementAddOrEditForm(divId,html);
		getDepartments();
		$('#featureListTable').dataTable();
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"********"+response.errorMessage);
	});
	return false;
}
function createUserFormHtml(response){
	var allRoles = response.successObject.allRoles;
	var featureList = response.successObject.featureList;
	var roleName = response.successObject.roleName;
	var mappedOrganizationList = organizationsList;
	var html = "";
	html +='<div id="createUser">';
	html+=	 addFormHeading("Create Internal User Account");
	html+=	'<form class="col-sm-12" id="createUserForm">';
	
	/** ***********************************Roles DropDown******************************************************** */
	
	if(roleName=="GHN_ADMIN"){
	html += '<div class="form-group" style="width:300px;" id="create-userName-Error">';
	html += '<label>Roles<font style="color: red">*</font></label>';
	html +='<select id="selectedRolesDropDown" style="min-width: 200px;">';
	for(var i=0;i<allRoles.length;i++){
	html += '<option value='+allRoles[i].id+'>'+allRoles[i].role+'</option>';
	}
	html += '</select>';
	}
	html += '</div>';
	/** ***********************************Roles DropDown******************************************************** */
	
	
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;" id="userCreateSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png">User Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="createUserErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	
	/** ************************************User Name***************************************************** */
	html += '<div class="form-group" style="width:300px;" id="create-userName-Error">';
	html += '<label>Login Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442"class="help-inline" id="create-userName-span-Error"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userName" placeholder="Enter Your Login Id" maxlength="50">';
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
	html += '<span style="color: #a94442"class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userLastName" placeholder="Enter Your Last Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Password***************************************************** */
	html += '<div class="form-group" id="create-password-Error" style="width:300px;">';
	html += '<label>Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-password-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm" id="userPassword" placeholder="Enter Your pasword." maxlength="50">';
	html += '</div>';
	
	/** ************************************Confirm Password***************************************************** */
	html += '<div class="form-group" id="create-confirmPassword-Error" style="width:300px;">';
	html += '<label>Re-type Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-confirmPassword-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm" id="userConfirmPassword" placeholder="Retype your password again." maxlength="50">';
	html += '</div>';
	
	/** ************************************Designation***************************************************** */
	html += '<div class="form-group"  style="width:300px;">';
	html += '<label>Designation</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="userDesignation" placeholder="Enter Your Designation" maxlength="50">';
	html += '</div>';
	
	
	/** ************************************Email Enabled Check Box***************************************************** */
	html += '<div>';
	html += '<label>Email Enabled<font style="color: red"></font></label>&nbsp  ';
	html += '<input	type="checkbox" id="userEmailCheckBox">';
	html += '</div><hr>';
	/********************************************************************************************************************
	
	/** ************************************Departments***************************************************** */
	html += '<div class="form-group" style="width:300px;" id="create-selectedDepartments-Error">';
	html += '<label>Department Selection<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442"class="help-inline" id="create-selectedDepartments-span-Error"></span>';
	/*html += '<div class="row">';
	html += '<div class="col-xs-3"><h5>Department Selection</h5></div>';
	html += '</div>';*/
	
	html += '<div id="departmentSeletion">';
	html += '<table class="table table-striped">';
	html +='<thead><tr id="headerRow"><th>Hotel</th><th>Department</th></tr></thead>';
	html +='<tbody>';
	html +='<tr>';
	html +='<td>';
	html +='<select id="selectedOrganizationDropDown" style="min-width: 200px;" onchange="getDepartments()">';
	//html += '<option value="0">ALL</option>';
	for(var i=0;i<mappedOrganizationList.length;i++){
		html += '<option value='+mappedOrganizationList[i].id+'>'+mappedOrganizationList[i].organizationFullName+'</option>';
	}
	html += '</select>';
	html +='</td>';
	html +='<td>';
	html +='<select id="departmentListDropDown" style="min-width: 200px;">';
	html +='</select>';
	html +='</td>';
	html += '<td>';
	html += '<span><button class="btn btn-primary AdminAddButton float-right" onclick="return addDepartment(this);">+<span aria-hidden="true" class="glyphicon"></span></button></span>';
	html += '</td>';
	html +='</tr>';
	html +='</tbody>';
	html += '</table>';
	html +='</div>';
	
	html += '</div>';
	/** ************************************Mobile***************************************************** */
	html += '<div class="form-group" id="create-mobile-Error" style="width:300px;">';
	html += '<label>Mobile<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-mobile-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="userMobileNumber" placeholder="Enter Your User Mobile Number" maxlength="50">';
	html += '</div>';
	
	/** ************************************Land Line Number***************************************************** */
	html += '<div class="row">';
	html += '<div class="form-group col-lg-3" id="Add-LandLine-Number-Error" style="width:200px;">';
	html += '<label>LandLine Number</label>';
	html += '<span style="color: #a94442" id="Add-LandLine-Number-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="userLandLineNumber" placeholder="Enter Land Line Number" maxlength="15">';
	html += '</div>';
	/** ************************************Extension***************************************************** */
	html += '<div class="form-group col-lg-3" id="Add-Extension-Error" style="width:150px;">';
	html += '<label>Extn</label>';
	html += '<span style="color: #a94442" id="Add-Extension-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" class="form-control input-sm" id="extension" placeholder="Extension" maxlength="5">';
	html += '</div>';
	html += '</div>';
	
	/** ************************************Feature Mapping***************************************************** */
	html += '<div><h5>Featue Mapping</h5>';
	html += '<table id="featureListTable" class="table table table-striped">';
	html += '<thead>';
	html += '<tr>';
	html += '<th><input type="checkbox" id="checkAllFeaturesCheckBox" style="margin-left: 0px;"></th>';
	html += '<th>Features</th>';
	html += '</thead>';
	html += '</tr>';
	html += '<tbody>';
	for(var i=0;i<featureList.length;i++){
		html += '<tr>';
		html += '<td><input type="checkbox" id="selectedFetureIds" value="' + featureList[i].id + '" class="featureChkBox"></td>';
		html += '<td>'+featureList[i].feature+'</td>';
	}
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';
	html += '</div>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="createUser()">';
	html+=	appendCancelButton(getDivId("ManagerUser"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	html += '</div>';
	return html;
}
function createUser(){
	loadingForDashBoard();
	var divId = $('#'+getDivId("ManagerUser"));
	scrollDown(divId);
	$('#userCreateSuccessDiv').hide();
	$('#createUserErrorDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	if($('#userEmailCheckBox').is(':checked')){
		emailChecked = 1;
	};
	var firstName = $('#userFirstName').val();
	var lastName = $('#userLastName').val();
	var designation = $('#userDesignation').val();
	var mobileNumber = $('#userMobileNumber').val();
	var landLineNumber = $('#userLandLineNumber').val();
	var extension = $('#extension').val();
	var userName = $('#userName').val();
	var password = $('#userPassword').val();
	var confirmPassword = $('#userConfirmPassword').val();
	var emailChecked=emailChecked;
	var roleId = $('#selectedRolesDropDown option:selected').val();
	var featureIds = selectedIds('featureChkBox');

	var selectedFeatureIds = [];
	for(var i=0;i<featureIds.length;i++){
		selectedFeatureIds.push(parseInt(featureIds[i]));
	}
	var selectedFeatureIdsArryList = '';
	var selectedFeatureIdListLenth = selectedFeatureIds.length;
	for(var i=0;i<selectedFeatureIds.length;i++){
		selectedFeatureIdsArryList += selectedFeatureIds[i];
		if(selectedFeatureIdListLenth!=(i+1)){
			selectedFeatureIdsArryList += ',';
		}
	}

	
	var testLimit=new Array();
	if(jQuery.isEmptyObject(selectedDepartmetsArray)==false){
		for (var key in selectedDepartmetsArray) { 
			var organizationId = 0;
			var departmentIds = new Array();
			var deptIds = selectedDepartmetsArray[key];
			organizationId = parseInt(key);
			if(deptIds!=null&&deptIds.length>0){
				for(var i=0;i<deptIds.length;i++){
					departmentIds.push(parseInt(deptIds[i]));
				}
			}
			testLimit.push({id:organizationId,departmentIds:departmentIds});
		}
	}
	if(selectedFeatureIds.length>0){
	var userObject = {
						userFirstName:firstName,
						userLastName:lastName,
						designation:designation,
						mobile:mobileNumber,
						landlineNumber:landLineNumber,
						extension:extension,
						userName:userName,
						password:password,
						confirmPassword:confirmPassword,
						mappedFeatureIds:featureIds,
						selectedDepartments:testLimit,
						selectedRoleId:roleId,
						emailChecked:emailChecked
	};
	$.ajax({
		url:"../manageUsers/addUser.htm",
		type:"POST",
		data:JSON.stringify(userObject),
		contentType:"application/json",
		success:function(response){
			if(response.status=="SAVE_SUCCESS"){
				unloadingForDashBoard();
				$("#userCreateSuccessDiv").text("User Created Successfully. An Email with activation link is sent to this mail id:"+userName).show(600);
				$('#userFirstName').val("");
				$('#userLastName').val("");
				$('#userDesignation').val("");
				$('#userMobileNumber').val("");
				$('#userLandLineNumber').val("");
				//$('#userEmailId').val("");
				$('#userName').val("");
				$('#userPassword').val("");
				$('#userConfirmPassword').val("");
				$('#selectedOrganizationDropDown').val(" ");
				$('#departmentListDropDown').val(" ");
				$('#organizationEmailCheckBox').val("");
				listUsers();
			}else if(response.status=="SAVE_ERROR"){
				unloadingForDashBoard();
				$('#createUserErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#create-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#create-'+fieldName+'-span-Error').html(errorMessage);
				}
			}
		},error:function(response){
			$('#page-wrapping').mask(response.errorMessage);
		}
	});
	}else{
		alert("Select at lease one department and map features");
		unloadingForDashBoard();
	}
}
function getDepartments(){
	$('#departmentListDropDown').html("");
	var selectedOrganizationGroupId = $('#selectedOrganizationDropDown option:selected').val();
	$.get("../manageUsers/listDepartments.htm?selectedOrganizationId="+selectedOrganizationGroupId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var mappedDepartmentList = response.successObject.mappedDepartmentList;
			for(var i=0;i<mappedDepartmentList.length;i++){
				$('#departmentListDropDown').append("<option value='"+mappedDepartmentList[i].id+"'>"+mappedDepartmentList[i].departmentName+"</option>");
			}
		}else{
			$('#page-wrapping').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"********"+response.errorMessage);
	});
}
var departmentsArray = new Array();
function addDepartment(id){
	//console.log(selectedDepartmetsArray);
	var orgIdExists = false;
	var deptIdExists = false;
	var organizationId = $('#selectedOrganizationDropDown').find('option:selected').val();
	var departmentId = $('#departmentListDropDown').find('option:selected').val();
	if(jQuery.isEmptyObject(selectedDepartmetsArray)==true){
		
		//alert("first time");
		var html = "";
		//html += '<table>';
		html += '<tr>';
		html +='<td>';
		html += '<option value='+organizationId+'>'+$('#selectedOrganizationDropDown').find('option:selected').text()+'</option>';
		html += '</td>';
		html +='<td>';
		html += '<option value='+departmentId+'>'+$('#departmentListDropDown').find('option:selected').text()+'</option>';
		html +='<td><button type="button" onclick="deleteSelectedDepartment(this)" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-trash"></i></button></td>';
		html += '</td>';
		html += '</tr>';
		//html += '</table>';
		$(id ).closest( "tr" ).after(html);
		departmentsArray.push(parseInt(departmentId));
		selectedDepartmetsArray[parseInt(organizationId)] = departmentsArray;
		return false;
	}else{
		
		var html = "";
		//html += '<table>';
		html += '<tr>';
		html +='<td>';
		html += '<option value='+organizationId+'>'+$('#selectedOrganizationDropDown').find('option:selected').text()+'</option>';
		html += '</td>';
		html +='<td>';
		html += '<option value='+departmentId+'>'+$('#departmentListDropDown').find('option:selected').text()+'</option>';
		html +='<td><button type="button" onclick="deleteSelectedDepartment(this)" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-trash"></i></button></td>';
		html += '</td>';
		html += '</tr>';
		//html += '</table>';
		$(id ).closest( "tr" ).after(html);
		departmentsArray.push(parseInt(departmentId));
		selectedDepartmetsArray[parseInt(organizationId)] = departmentsArray;
		return false;
		
		var deptIds = [];
		for (var key in selectedDepartmetsArray) { 
			if(key==organizationId){
				orgIdExists = true;
				deptIds = selectedDepartmetsArray[key];
				if(deptIds!=null&&deptIds.length>0){
					for(var i=0;i<deptIds.length;i++){
						if(deptIds[i]==departmentId){
							deptIdExists = true;
						}
					}
				}
			}
		}
		if(orgIdExists==false&&deptIdExists==false){
			var departments = new Array();
			//alert("not exist");
			var html = "";
			html += '<tr>';
			html +='<td>';
			html += '<option value='+organizationId+'>'+$('#selectedOrganizationDropDown').find('option:selected').text()+'</option>';
			html += '</td>';
			html +='<td>';
			html += '<option value='+departmentId+'>'+$('#departmentListDropDown').find('option:selected').text()+'</option>';
			html += '</td>';
			html += '</tr>';
			$(id ).closest( "tr" ).after(html);
			departments.push(parseInt(departmentId));
			selectedDepartmetsArray[parseInt(organizationId)] = departments;
			return false;
		}else if(orgIdExists==true&&deptIdExists==false){
			//alert("org Exist dept not exist");
			var html = "";
			html += '<tr>';
			html +='<td>';
			html += '<option value='+organizationId+'>'+$('#selectedOrganizationDropDown').find('option:selected').text()+'</option>';
			html += '</td>';
			html +='<td>';
			html += '<option value='+departmentId+'>'+$('#departmentListDropDown').find('option:selected').text()+'</option>';
			html += '</td>';
			html += '</tr>';
			$(id ).closest( "tr" ).after(html);
			deptIds.push(departmentId);
			return false;
		}else{
			//alert("exist");
			return false;
		}
	}
}

function deleteSelectedDepartment(id){
	$(id).closest('tr').remove();
	departmentsArray.pop();
	addDepartment();
}

function removeSelected(element){
	$(element).closest('div').remove();
	 return false;
}

//Check All Check Box
$(document).on('click',"#checkAllFeaturesCheckBox",function(){
    $('.featureChkBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".featureChkBox",function(){
    if($('.featureChkBox:checked').length == $('.featureChkBox').length) {
      $('#checkAllFeaturesCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllFeaturesCheckBox').prop('checked', false);
    }
});


function deleteuser(){
	var selectedOrganizationId = $('#selectedOrganization option:selected').val();
	var ids = selectedIds('userChkBox');//Pass Check Box Class
	var users=[];
	for(var i=0;i<ids.length;i++){
		var id=ids[i];
		var user={'id':id};
		users.push(user);
	}
	
	console.log(users);
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#deleteManageUserSuccessDiv').hide();
			$('#deleteManagerUserErrorDiv').hide();
		
			$.ajax({
				type:"POST",
				url:"../manageUsers/delete.htm?organizationId="+selectedOrganizationId,
				contentType:"application/json",
				data:JSON.stringify(users),
				success:function(response){
					console.log(response);
					if(response.status=="DELETE_SUCCESS"){
						var html = listUserHtml(response);
						$('#listUsersDiv').append(html);
						$('#manageUserListTable').dataTable({responsive:true});
						$('#deleteManageUserSuccessDiv').show();
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
	}
}

function listUsers() {
	$('#page-wrapper').mask('Loading...');
	$('#listUsersDiv').html('');
	$('#deleteManageUserSuccessDiv').hide(1000);
	var selectedOrganizationId = $('#selectedOrganization option:selected').val();
	//var divId = $('#'+getDivId("ManagerUser"));
	$.ajax({
		type: "GET",
		url: "../manageUsers/listUsers.htm?organizationId="+selectedOrganizationId,
		dataType: "json",
		success: function(response){ 
			console.log(response);
			users=response;
			if(response.status=="LIST_SUCCESS"){
				/*var html = listUserHtml(response);
				$('#listUsersDiv').append(html);
				$('#manageUserListTable').dataTable();
				$('#page-wrapper').unmask();*/
				
				var html = listUserHtml(response);
				$('#listUsersDiv').html(html);
				
				$('#listUsersDiv').show();
				
				$('#manageUserListTable').dataTable({responsive:true});
				//$('#deleteManageUserSuccessDiv').show(600);
				$('#page-wrapper').unmask();
				
				
				
				//$('#deleteManageUserSuccessDiv').show(600);
			}else{
				$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
			}
		}},'json').fail(function(response){
			$('#page-wrapper').append(response.status+"*****************"+response.statusText);
		});

	return false;
}	

function listUserHtml(response){
	//console.log("coming");
	 response=response.successObject.listUserMaster;
	//var divId = $('#'+getDivId("ManagerUser"));
	$('#listUsersDiv').html('');
	hideForm('addAndEditManagerUserDiv','page-wrapper');
	var html = "";
	html += '<div class="alert alert-success" style="display: none;"	id="deleteManageUserSuccessDiv">';
	html += '<spring:message code="label.delete.user.success"/>';
	html += '</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteManagerUserErrorDiv">';
	html += '</div>';
	html += '<form>';
	html += '<table class="table table-striped dataTable no-footer" id="manageUserListTable">';
	html += '<thead>';
	html += '<tr>';
	html += '<th><input type="checkbox" id="checkAllUserCheckBox" style="margin-left: 0px;"></th>';
	html += '<th>Login Id</th>';
	html += '<th>User Name</th>';
	html += '<th></th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	for(var i=0;i<response.length;i++){
		html += '<tr>';
		html += '<td><input type="checkbox" value='+response[i].id+' class="userChkBox"></td>';
		html += '<td>'+response[i].userName+'</td>';
		html += '<td>'+response[i].userFirstName+'</td>';
		html += '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editUserForm('+response[i].id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html += '</tr>';
	}
	html += '</tbody>';
	html += '</table></form>';
	//html+=	appendCancelButton(getDivId("ManagerUser"),"page-wrapper");
	//appendUserManagementAddOrEditForm(divId,html);
	return html;
}


/*var users=new Array();
function listUsers(){
	var selectedOrganizationId = $('#selectedOrganization option:selected').val();
	var divId = $('#'+getDivId("ManagerUser"));
	$.ajax({
		type: "GET",
		url: "../manageUsers/listUsers.htm?organizationId="+selectedOrganizationId,
		dataType: "json",
		success: function(response){
			users=response;
			$('#listUsersDiv').html("");
			var html = "";
			html += '<form><div class="alert alert-success" style="display: none;"	id="deleteManageUserSuccessDiv">';
			html += '<spring:message code="label.delete.user.success"/>';
			html += '</div>';
			html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteManagerUserErrorDiv">';
			html += '</div>';
			html += '<table class="table table-striped dataTable no-footer" id="manageUserListTable">';
			html += '<thead>';
			html += '<tr>';
			html += '<th><input type="checkbox" id="checkAllUserCheckBox" style="margin-left: 0px;"></th>';
			html += '<th>Login Id</th>';
			html += '<th>User Name</th>';
			html += '<th></th>';
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
			for(var i=0;i<response.length;i++){
				html += '<tr>';
				html += '<td><input type="checkbox" value='+response[i].id+' class="userChkBox"></td>';
				html += '<td>'+response[i].userName+'</td>';
				html += '<td>'+response[i].userFirstName+'</td>';
				html += '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editUserForm('+response[i].id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
				html += '</tr>';
			}
			html += '</tbody>';
			html += '</table></form>';
			html+=	appendCancelButton(getDivId("ManagerUser"),"page-wrapper");
			appendUserManagementAddOrEditForm(divId,html);
			$('#manageUserListTable').dataTable();
		}
	});
}*/

/*function listUserHtml(response){
	var divId = $('#'+getDivId("ManagerUser"));
	$('#listUsersDiv').html("");
	var html = "";
	html += '<form><div class="alert alert-success" style="display: none;"	id="deleteManageUserSuccessDiv">';
	html += '<spring:message code="label.delete.user.success"/>';
	html += '</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteManagerUserErrorDiv">';
	html += '</div>';
	html += '<table class="table table-striped dataTable no-footer" id="manageUserListTable">';
	html += '<thead>';
	html += '<tr>';
	html += '<th><input type="checkbox" id="checkAllUserCheckBox" style="margin-left: 0px;"></th>';
	html += '<th>Login Id</th>';
	html += '<th>User Name</th>';
	html += '<th></th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	for(var i=0;i<response.length;i++){
		html += '<tr>';
		html += '<td><input type="checkbox" value='+response[i].id+' class="userChkBox"></td>';
		html += '<td>'+response[i].userName+'</td>';
		html += '<td>'+response[i].userFirstName+'</td>';
		html += '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editUserForm('+response[i].id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html += '</tr>';
	}
	html += '</tbody>';
	html += '</table></form>';
	html+=	appendCancelButton(getDivId("ManagerUser"),"page-wrapper");
	appendUserManagementAddOrEditForm(divId,html);
	return html;
}*/
function editUserForm(id){
	$("AdminInList").attr("disabled","disabled");
	var user=null;
	var userList = users.successObject.listUserMaster;
    for(var i=0;i<userList.length;i++){
            if(userList[i].id==id){
                    user=userList[i];
                    break;
            }
            
                    
    }
	var mappedFeature=new Array();
	$.get("../manageUsers/fetchMappedFeatures.htm",{"id":id},function(response){
		mappedFeature=response.successObject.featureList;
	
		var divId = $('#'+getDivId("ManagerUser"));
		$.get("../manageUsers/addUser.htm",function(response){
			var html = updateUserFormHtml(response,mappedFeature,user,id);
			appendUserManagementAddOrEditForm(divId,html);
			getDepartments();
			$('#featureListTable').dataTable();
		},'json').fail(function(response){
			$('#page-wrapping').mask(response.status+"********"+response.errorMessage);
		});
		
	},'json').fail(function(response){
		$('#page-wrapping').mask(response.status+"********"+response.errorMessage);
	});
	
	return false;
}
function updateUserFormHtml(response,mappedFeature,user,id){
	console.log(user);
	var selectedFeatureIds=new Array(); 
	for(var i=0;i<mappedFeature.length;i++){
		selectedFeatureIds.push(mappedFeature[i].id);
	}
	
	var isEmailEnabled = user.emailTrigEnabled;
	if(isEmailEnabled == 1){
		isEmailEnabled=true;
	}
	
	var featureList = response.successObject.featureList;
	var mappedOrganizationList = organizationsList;
	var html = "";
	html +='<div id="createUser">';
	html+=	 addFormHeading("Update Internal User Account");
	html+=	'<form class="col-sm-12" id="createUserForm">';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;" id="userCreateSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png">User Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="createUserErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	
	/** ************************************User Id***************************************************** */
	html += '<input	type="hidden" value="'+user.id+'" class="form-control input-sm" id="userId" placeholder="Enter Your Login Id" maxlength="50">';
	
	/** ************************************User Name***************************************************** */
	html += '<div class="form-group" style="width:300px;" id="create-userName-Error">';
	html += '<label>Login Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442"class="help-inline" id="create-userName-span-Error"></span>';
	html += '<input	type="text" value="'+user.userName+'" class="form-control input-sm" id="userName" placeholder="Enter Your Login Id" maxlength="50">';
	html += '</div>';
	
	/** ************************************First Name***************************************************** */
	html += '<div class="form-group" id="create-userFirstName-Error" style="width:300px;">';
	html += '<label>First Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-userFirstName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+user.userFirstName+'"class="form-control input-sm" id="userFirstName" placeholder="Enter Your First Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Last Name***************************************************** */
	html += '<div class="form-group" style="width:300px;">';
	html += '<label>Last Name</label>';
	html += '<span style="color: #a94442"class="help-inline"></span>';
	html += '<input	type="text" value="'+user.userLastName+'" class="form-control input-sm" id="userLastName" placeholder="Enter Your Last Name" maxlength="50">';
	html += '</div>';
	
	/** ************************************Password***************************************************** */
	html += '<div class="form-group" id="create-password-Error" style="width:300px;">';
	html += '<label>Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-password-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm" id="userPassword" placeholder="Enter Your pasword." maxlength="50">';
	html += '</div>';
	
	/** ************************************Confirm Password***************************************************** */
	html += '<div class="form-group" id="create-confirmPassword-Error" style="width:300px;">';
	html += '<label>Re-type Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-confirmPassword-span-Error" class="help-inline"></span>';
	html += '<input	type="password" class="form-control input-sm" id="userConfirmPassword" placeholder="Retype your password again." maxlength="50">';
	html += '</div>';
	
	/** ************************************Designation***************************************************** */
	html += '<div class="form-group"  style="width:300px;">';
	html += '<label>Designation</label>';
	html += '<span style="color: #a94442" class="help-inline"></span>';
	html += '<input	type="text" value="'+user.designation+'" class="form-control input-sm" id="userDesignation" placeholder="Enter Your Designation" maxlength="50">';
	html += '</div>';
	
	html += '<div>';
	html += '<label>emailEnabled<font style="color: red"></font></label>&nbsp  ';
	if(isEmailEnabled==true){
		html += '<input	type="checkbox" id="userUpdatedEmailCheckBox" checked="checked">';
	}else{
		html += '<input	type="checkbox" id="userUpdatedEmailCheckBox">';
	}
	html += '</div><hr>';
	
	/** ************************************Departments***************************************************** */
	
	html += '<div class="form-group" style="width:300px;" id="create-selectedDepartments-Error">';
	html += '<span style="color: #a94442"class="help-inline" id="create-selectedDepartments-span-Error"></span>';
		html += '<div class="row">';
		html += '<div class="col-xs-3"><h5>Department Selection<font style="color: red">*</font></h5></div>';
		html += '</div>';
	html += '</div>';
	
	
	
	html += '<div id="departmentSeletion">';
	html += '<table class="table table-striped">';
	html +='<thead><tr id="headerRow"><th>Hotel</th><th>Department</th></tr></thead>';
	html +='<tbody>';
	html +='<tr>';
	html +='<td>';
	html +='<select id="selectedOrganizationDropDown" style="min-width: 200px;" onchange="getDepartments()">';
	//html += '<option value="0">ALL</option>';
	for(var i=0;i<mappedOrganizationList.length;i++){
		html += '<option value='+mappedOrganizationList[i].id+'>'+mappedOrganizationList[i].organizationFullName+'</option>';
	}
	html += '</select>';
	html +='</td>';
	html +='<td>';
	html +='<select id="departmentListDropDown" style="min-width: 200px;">';
	html +='</select>';
	html +='</td>';
	html += '<td>';
	html += '<span><button class="btn btn-primary AdminAddButton float-right" onclick="return addDepartment(this);">+<span aria-hidden="true" class="glyphicon"></span></button></span>';
	html += '</td>';
	html +='</tr>';
	html +='</tbody>';
	html += '</table>';
	html +='</div>';
	
	/** ************************************Mobile***************************************************** */
	html += '<div class="form-group" id="create-mobile-Error" style="width:300px;">';
	html += '<label>Mobile<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="create-mobile-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" value="'+user.mobile+'" class="form-control input-sm" id="userMobileNumber" placeholder="Enter Your User Mobile Number" maxlength="50">';
	html += '</div>';
	
	/** ************************************Land Line Number***************************************************** */
	html += '<div class="row">';
	html += '<div class="form-group col-lg-3" id="Add-LandLine-Number-Error" style="width:200px;">';
	html += '<label>LandLine Number</label>';
	html += '<span style="color: #a94442" id="Add-LandLine-Number-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" value="'+user.landlineNumber+'" class="form-control input-sm" id="userLandLineNumber" placeholder="Enter Land Line Number" maxlength="15">';
	html += '</div>';
	/** ************************************Extension***************************************************** */
	html += '<div class="form-group col-lg-3" id="Add-Extension-Error" style="width:150px;">';
	html += '<label>Extn</label>';
	html += '<span style="color: #a94442" id="Add-Extension-span-Error" class="help-inline"></span>';
	html += '<input	type="tel" value="'+user.extension+'" class="form-control input-sm" id="extension" placeholder="Extension" maxlength="5">';
	html += '</div>';
	html += '</div>';
	
	/** ************************************Feature Mapping***************************************************** */
	html += '<div><h5>Featuer Mapping</h5>';
	html += '<table id="featureListTable" class="table table table-striped">';
	html += '<thead>';
	html += '<tr>';
	html += '<th><input type="checkbox" id="checkAllFeaturesCheckBox" style="margin-left: 0px;"></th>';
	html += '<th>Features</th>';
	html += '</thead>';
	html += '</tr>';
	html += '<tbody>';
	
	label1:
		for(var i=0;i<featureList.length;i++){
			html += '<tr>';
			var featureId=featureList[i].id;
			
			for(var j=0; j<selectedFeatureIds.length;j++){
				var selectedFeatureId=selectedFeatureIds[j];
				
				if(featureId==selectedFeatureId){
					html += '<td><input type="checkbox" checked value="' + featureList[i].id + '" class="featureChkBox"></td>';
					html += '<td>'+featureList[i].feature+'</td>';
					continue label1;
				}
			}
			
			html += '<td><input type="checkbox" value="' + featureList[i].id + '" class="featureChkBox"></td>';
			
			html += '<td>'+featureList[i].feature+'</td>';
		}

	html += '</tr>';
	html += '</tbody>';
	html += '</table>';
	html += '</div>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateUser()">';
	html+=	appendCancelButton(getDivId("ManagerUser"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	html += '</div>';
	return html;
}
function updateUser(){
	loadingForDashBoard();
	var divId = $('#'+getDivId("ManagerUser"));
	scrollDown(divId);
	$('#userCreateSuccessDiv').hide();
	$('#createUserErrorDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	//console.log(selectedDepartmetsArray);
	var userId = $('#userId').val();
	var firstName = $('#userFirstName').val();
	var lastName = $('#userLastName').val();
	var designation = $('#userDesignation').val();
	var mobileNumber = $('#userMobileNumber').val();
	var landLineNumber = $('#userLandLineNumber').val();
	var extension = $('#extension').val();
	//var emailId = $('#userEmailId').val();
	var userName = $('#userName').val();
	var password = $('#userPassword').val();
	var confirmPassword = $('#userConfirmPassword').val();
	var featureIds = selectedIds('featureChkBox');
	var emailChecked=0;
	var selectedFeatureIds = [];
	for(var i=0;i<featureIds.length;i++){
		selectedFeatureIds.push(parseInt(featureIds[i]));
	}
	var selectedFeatureIdsArryList = '';
	var selectedFeatureIdListLenth = selectedFeatureIds.length;
	for(var i=0;i<selectedFeatureIds.length;i++){
		selectedFeatureIdsArryList += selectedFeatureIds[i];
		if(selectedFeatureIdListLenth!=(i+1)){
			selectedFeatureIdsArryList += ',';
		}
	}
	var userMappedOrganizationIds=new Array();
	var userMappedDepartmentIds=new Array();
	var testLimit=new Array();
	if(jQuery.isEmptyObject(selectedDepartmetsArray)==false){
		for (var key in selectedDepartmetsArray) { 
			var organizationId = 0;
			var departmentIds = new Array();
			var deptIds = selectedDepartmetsArray[key];
			organizationId = parseInt(key);
			if(deptIds!=null&&deptIds.length>0){
				for(var i=0;i<deptIds.length;i++){
					departmentIds.push(parseInt(deptIds[i]));
					userMappedDepartmentIds.push(parseInt(deptIds[i]));
				}
			}
			
			userMappedOrganizationIds.push(organizationId);
			testLimit.push({id:organizationId,departmentIds:departmentIds});
		}
	}
	
	if($('#userUpdatedEmailCheckBox').is(':checked')){
		emailChecked = 1;
	}
	var user = {
						id:userId,
			       		userFirstName:firstName,
						userLastName:lastName,
						designation:designation,
						mobile:mobileNumber,
						landlineNumber:landLineNumber,
						extension:extension,
						userName:userName,
						password:password,
						confirmPassword:confirmPassword,
						mappedFeatureIds:featureIds,
						selectedDepartments:testLimit,
						userMappedOrganizationIds:userMappedOrganizationIds,
						userMappedDepartmentIds:userMappedDepartmentIds,
						emailChecked:emailChecked
						
	};
	console.log(user);
	$.ajax({
		url:"../manageUsers/updateUser.htm",
		type:"POST",
		data:JSON.stringify(user),
		contentType:"application/json",
		success:function(response){console.log(response);
			if(response.status=="UPDATE_SUCCESS"){
				unloadingForDashBoard();
				$("#userCreateSuccessDiv").text("User Created Successfully. An Email with activation link is sent to this mail id: "+userName).show(600);
				$('#userFirstName').val("");
				$('#userLastName').val("");
				$('#userDesignation').val("");
				$('#userMobileNumber').val("");
				$('#userLandLineNumber').val("");
				$('#userEmailId').val("");
				$('#userName').val("");
				$('#userPassword').val("");
				$('#userConfirmPassword').val("");
				$('#selectedOrganizationDropDown').val(" ");
				$('#departmentListDropDown').val(" ");
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
		},error:function(response){
			$('#page-wrapping').mask(response.errorMessage);
		}
	});
}