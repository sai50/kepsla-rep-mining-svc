$(document).ready(function() {
	$.ajaxSetup({
		cache : false
	});
});
var roleManagementUrl = "../RoleManagement/";
//*****RoleManagement Variables***************//
var roleManagementDataDiv = $('#RoleManagementDataDiv');

var selectedRoleManagementIds = [];
//*****************************************List Role Management*******************************//
function RoleManagementList() {
	$.ajaxSetup({
		cache : false
	});
	console.log("function executed......");
	$('#page-wrapper').mask('Loading...');
	$('#addAndEditRoleManagementDiv').hide();
	roleManagementDataDiv.html('');
	//$('#addRoleManagementSuccessDiv').html('');
	//$('#roleManagementListTable').html('');
	var selectedParentRole = $('#selectedParentRole').val();
	//console.log(selectedParentRole);
	$.get(
			roleManagementUrl + "listAll.htm?id=" + selectedParentRole,
			function(response) {
				console.log("in response....");
				if (response.status == "LIST_SUCESS") {
					var html = listRoleManagementHtml(response);
					roleManagementDataDiv.append(html);
					$('#roleManagementListTable').dataTable();
					$('#page-wrapper').unmask();
				} else {
					$('#page-wrapper').append(
							'<font style="color:red">' + response.errorMessage
									+ '</font>');
				}

			}, 'json').fail(
			function(response) {
				$('#page-wrapper').mask(
						response.status + "**********" + response.statusText);
			});
	return false;

}

function listRoleManagementHtml(response) {
	var listAllRoles = response.successObject.allRole;
	var filterFeature='';
	var filter='';
	var html = "";
	html += '<form id="roleManagementListForm">';
	html += '<div class="alert alert-success" style="display:none;"id="addRoleManagementSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role(s) Added Successfully</div>';
	html += '<div class="alert alert-success" style="display:none;"id="deleteRoleManagementSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role(s) Deleted Successfully</div>';
	html += '<div class="alert alert-success" style="display:none;"id="editRoleManagementSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role(s) Update Successfully</div>';
	html += '<div class="alert alert-success" style="display:none;"id="editRoleFeatureSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role(s) Feature Added Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteRoleManagementErrorDiv">';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editRoleManagementFeatureErrorDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; NO Feature Map to parent</div>';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='roleManagementListTable'>";
	html += "<thead>";
	html += "<tr>";
	html += '<th><input type="checkbox" id="checkAllRoleManagementCheckBox" style="margin-left: 0px;"></th>';
	html += '<th>Role</th>';
	html += '<th>Parent Role</th>';
	html += '<th>Features</th>';
	html += '<th></th>';
	html += '<th></th>';
	html += "</tr>";
	html += "</thead>";
	html += '<tbody>';
	for (var i = 0; i < listAllRoles.length; i++) {
		var id = listAllRoles[i].id;
		var role = listAllRoles[i].role;
		var parentRole = listAllRoles[i].parentRole;
		var parentRoleName = listAllRoles[i].parentRoleName;
		var features = listAllRoles[i].featureMasters;
		if(features!=null){
			for(var j=0;j<features.length;j++){
				filterFeature+= features[j]+" | ";
			}
		}else{
			filterFeature = '';
		}
		filter = filterFeature.substring(0, filterFeature.length-2); //deleting last pipe symbol
		filterFeature = '';
		//console.log("list feature +"+filterFeature);
		html += '<tr>';
		html += '<td><input type="checkBox" class="roleManagementCheckBox" value='+ id + '></td>';
		html += '<td>' + role + '</td>';
		if(parentRoleName == null){
		    parentRoleName = "";
			html += '<td>' + parentRoleName + '</td>';
		}else{
			html += '<td>' + parentRoleName + '</td>';
		}
		html += '<td>' + filter + '</td>';
		html += '<td class="text-right"><span><button type="button"  class="btn btn-xs AdminInList" title="Features" onclick="editRoleFeature(' + id + ',\'' + role + '\',\''+ parentRoleName +'\',\''+parentRole+'\',\''+ features+'\')"><span aria-hidden="true" class="glyphicon glyphicon-pencil">&nbsp;Features</span></button></span></td>';
		html += '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editRoleManagement('+ id+ ')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html += '</tr>';
	}
	html += '</tbody>';
	html += '</table>';
	html += '</form>';
	html += '<div id="addAndEditRoleManagementDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>';
	return html;
}
function addRoleManagemet(){
	$.ajaxSetup({
		cache : false
	});
	clearRoleManagementMessages();
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditRoleManagementDiv');
	$.get(roleManagementUrl+"add.htm",function(response){
		if(response.status == "LIST_SUCESS"){
			var addMethod = addRoleManagementFormHtml(response);
			appendRoleManagementAddOrEditForm(divId, addMethod);// Method To Generate
			$('#page-wrapper').unmask();
		}
		else {
			$('#page-wrapper').append(
					'<font style="color:red">' + response.errorMessage
							+ '</font>');
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function addRoleManagementFormHtml(response){
	var html = "";
	var divId = "addAndEditRoleManagementDiv";
	divId = "'" + divId + "'";
	appendDivId = "page-wrapper";
	appendDivId = "'" + appendDivId + "'";
	html += addFormHeading("Add Role");
	var role = response.successObject.allRole;
	console.log("parent role"+role);
	html += '<form class="col-sm-12" id="addRoleManagementForm">';

	/**
	 * ****************************************Error * Div****************************************************
	 */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addRoleManagementErrorDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/**
	 * ************************************Role  Name*****************************************************
	 */
	html += '<div class="form-group" id="Add-role-Error">';
	html += '<label>Role Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="role-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="role"  style="width: 50%" placeholder="Enter Role Name">';
	html += '</div>';

	/**
	 * ************************************Parent Role*****************************************************
	 */
	html += '<div class="form-group" id="Add-parentRole-Error">';
	html += '<label>Parent Type<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="parentRole-span-Error" class="help-inline"></span>';
	html += '<select class="form-control" style="width:50%" name="parentRole" id="parentRole">';
	for (var i = 0; i < role.length; i++) {
		//console.log("role name :"+parentRole[i].parentRoleName+" "+"role id:"+parentRole[i].parentRole);
		html += '<option value='+role[i].id+'>'
				+ role[i].role
				+ '</option>';
	}
	html += '</select>';
	html += '</div>';

	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveRoleManagement()">&nbsp';
	html += '<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+ divId + ',' + appendDivId + ')">';
	html += '</form>';
	return html;
}
function saveRoleManagement(){
	var addAndEditRoleManagementDiv = $('#addAndEditRoleManagementDiv');
	$.ajaxSetup({
		cache : false
	});// Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addRoleManagementSuccessDiv').hide();
	$('#addRoleManagementErrorDiv').hide();
	var role = $.trim($('#role').val());
	var parentRole = $.trim($('#parentRole').val());
	var customRole = 1;
	var listData={
			'role':role,
			'parentRole':parentRole,
			'customRole':customRole
	}
	 console.log("json data : "+JSON.stringify(listData));
	$.ajax({dataType : 'json',
		url : roleManagementUrl+"save.htm",
		data : listData,
		type : "POST",
		success : function(response) {
					console.log("rajesh.....");
			    	console.log(response.status);
			    	if (response.status == "SAVE_SUCESS" ) {
						$('#addRoleManagementForm').trigger("reset");
						RoleManagementList();
						console.log("after function executed......");
						$('#addRoleManagementSuccessDiv').show(600);
						$('#addAndEditRoleManagementDiv').hide();
						$('#page-wrapper').unmask();
					} else if (response.status == "SAVE_ERROR") {
						scrollDown(addAndEditRoleManagementDiv);
						$('#addRoleManagementErrorDiv').show(600);
						for (var i = 0; i < response.errorMessageList.length; i++) {
							var fieldName = response.errorMessageList[i].fieldName;
							var errorMessage = response.errorMessageList[i].message;
							$('#Add-' + fieldName + '-Error').addClass('has-error has-feedback');
							$('#' + fieldName + '-span-Error').html(errorMessage);
						}
						$('#page-wrapper').unmask();
					} else if (response.status == "EXCEPTION_ERROR") {
						$('#page-wrapper').mask(response.errorMessage);
					}
			}});
		return false;
}

function editRoleManagement(id){
	clearRoleManagementMessages();
	$('#page-wrapper').mask('Loading...');
//	console.log("id is "+id);
	var divId = $('#addAndEditRoleManagementDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(roleManagementUrl+"edit.htm?id="+id,function(response){
		var html = editRoleManagementFormHtml(response);
		appendRoleManagementAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function editRoleManagementFormHtml(response){
	clearRoleManagementMessages();
	var roleManagement = response.successObject.roleManagement;
	var id = roleManagement.id;
	var role = roleManagement.role;
	var parentRole = roleManagement.parentRole;
	var parentRoleName = roleManagement.parentRoleName;
	var allRole = response.successObject.roleUI;
	var html = "";
	
	var divId = "addAndEditRoleManagementDiv";
	divId = "'" + divId + "'";
	appendDivId = "page-wrapper";
	appendDivId = "'" + appendDivId + "'";
	html+=	'<form id="editRoleManagementForm">';
	html += '<h4>Edit RoleManagement</h4><hr>';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;"	id="editRoleManagementSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Role Updated Successfully</strong>';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editRoleManagementErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	/** ************************************Role Name***************************************************** */
	html += '<div class="form-group" id="Edit-role-Error">';
	html += '<label>Role<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-role-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" style="width:50%" id="editRole" value="'+role+'"  placeholder="Enter Role Name" maxlength="50" disabled>';
	html +=	'<input type="hidden" value='+id+' id="editRoleId">';
	html += '</div>';
	
	/** ************************************Source Type***************************************************** */
	html += '<div class="form-group" id="Edit-parentRole-Error">';
	html += '<label>Parent Role<font style="color: red">*</font></label>';
	html += '<select class="form-control" style="width:50%" name="editParenRole" id="editParenRole">';
	for(var i=0;i<allRole.length;i++){
		
		if(allRole[i].parentRoleName == parentRoleName && allRole[i].parentRoleName!=null && parentRoleName!=null){
			console.log("parent role :"+parentRoleName);
			html += '<option value='+allRole[i].id+' selected>'
			+ allRole[i].parentRoleName
			+ '</option>';
		}else{
			html += '<option value='+allRole[i].id+'>'
			+ allRole[i].role
			+ '</option>';
		}
	}
	html += '</select>';

	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateRoleManagement()">';
	html += '<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+ divId + ',' + appendDivId + ')">';
	html+=	'</form>';
	return html;
}
function updateRoleManagement(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editRoleManagementSuccessDiv').hide();
	$('#editRoleManagementErrorDiv').hide();
	
	var editRoleId = $.trim($('#editRoleId').val());
	var editRole = $.trim($('#editRole').val());
	var editParentRole = $.trim($('#editParenRole').val());
	var customRole = 1;
	var JSONObject = {};
	JSONObject['id'] = editRoleId;
	//JSONObject['role'] = editRole;
	JSONObject['parentRole'] = editParentRole;
	JSONObject['customRole'] = customRole;
	console.log("final object :"+JSON.stringify(JSONObject));
	$.post(roleManagementUrl+"/update.htm",JSONObject,function(response){
		console.log("response :"+response.status);
		if(response.status=="UPDATE_SUCCESS"){
			$('#editRoleManagementSuccessDiv').show(600);
			RoleManagementList();
			$('#loadMaskDiv').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			$('#editRoleManagementErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
/******************************Edit Role Feature ***********************************************/
function editRoleFeature(id,role,parentRole,parentRoleId,features){
	$('#editRoleFeatureSuccessDiv').hide();
	//console.log("function calling............")
	//console.log("id :"+id+" "+"role :"+role+" parentRole "+parentRoleId);
	var infoModal = $('#editRoleFeature');
	htmlAddClose = '';
	var title = 'Related Role Feature Mapping';
	var nameTitle = '&nbsp;&nbsp;&nbsp;&nbsp;Role Name : <b>'+role+' </b><br>'+'&nbsp;&nbsp;&nbsp;&nbsp;Parent Role  : <b>'+parentRole+'</b>';
	//nameTitle +='<hr>';
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
	/*if(childID.length == 0){
	}
*/	//console.log("filtered id :"+childID);
	//var contains=$.inArray(featureMasterList[i].id, featureArrayList);
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

function saveEditRoleFeature(roleid){
	/*alert("Do you want to save this changes !");*/
	$.ajaxSetup({ cache: false });
	var id = selectedIds('checkRoleFeature');
	var parent=[];
	var child=[];
	var searchText = "parent";
	for(var i=0;i<id.length;i++){
		if ( id[i].indexOf(searchText) > -1 ) {
			var parent_id = id[i].substring(6);
			parent.push(parent_id);
		}else{
			var child_id = id[i].substring(5);
			child.push(child_id);
		}
	}
	/*console.log("selected ids value :"+id);
	console.log("parent ids :"+parent);
	console.log("child ids :"+child);*/
	if(id.length>0){
		if(confirm("Do you want to save this changes(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#editRoleFeatureSuccessDiv').hide();
			$.get(roleManagementUrl+"saveRoleFeature.htm?parent_Ids="+parent+"&childIds="+child+"&roleId="+roleid,function(response){
				console.log("status "+response.status);
				if(response.status=="SAVE_SUCCESS"){
					$('#editRoleFeature').modal('hide');
					$('#editRoleFeatureSuccessDiv').show(600);
					RoleManagementList();
					$('#page-wrapper').unmask();
					id = [];
				}else if(response.status=="SAVE_ERROR"){
					console.log("inside save error");
				}
			},'json').fail(function(response){
				$('#page-wrapper').mask(response.status+"**********"+response.statusText);
			});
			return false;
		}
	}else{
		alert("select feature");
		return false;
	}
	
}
/******************************* End ************************************************************/


/**************************** Delete Role Management ********************/
function deleteRoleManagemet(){
	$.ajaxSetup({ cache: false });
	selectedRoleManagementCheckBoxLength();
	if(selectedRoleManagementIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			/**********************New Div Changes****************************/
			$('#addAndEditRoleManagementDiv').hide();//Hiding Add/Edit Form
			$('#deleteRoleManagementSuccessDiv').hide();
			$('#deleteRoleManagementErrorDiv').hide();
			clearRoleManagementMessages();//Clearing All Error/Success Message Divs
			/**********************New Div Changes****************************/
			$.ajax({
				type:"POST",
				url:roleManagementUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedRoleManagementIds),
				success:function(response){
					console.log("status "+response.status);
					if(response.status=="DELETE_SUCCESS"){
						//$('#RoleManagementTabButtons').hide();
						$('#deleteRoleManagementSuccessDiv').show(600);
						RoleManagementList();
						/*roleManagementDataDiv.show();*/
						/*$('#roleManagementListTable').dataTable();*/
						$('#page-wrapper').unmask();
						selectedRoleManagementIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteRoleManagementErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteRoleManagementErrorDiv').append(errorMessage);
						$('#deleteRoleManagementErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedRoleManagementIds = [];
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		alert("Please select a record");
		return false;
	}
	
}


/************************************** End *******************************/
function appendRoleManagementAddOrEditForm(divId, method) {
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearRoleManagementMessages();// Clearing Role Management Error/Sucess Message
								// Div
}
function clearRoleManagementMessages() {
	$(
			'#addRoleManagementSuccessDiv,#editRoleManagementSuccessDiv,#deleteRoleManagementSuccessDiv,#deleteRoleManagementErrorDiv,#editRoleFeatureSuccessDiv')
			.hide(600);
}

function hideForm(divId) {
	$("#" + divId).hide(600);
	// appendDivId = $('#'+appendDivId);
	// scrollDown(appendDivId);
}

function selectedRoleManagementCheckBoxLength() {
	if ($('.roleManagementCheckBox:checked').length) {
		selectedRoleManagementIds = [];
		$('.roleManagementCheckBox:checked').each(function() {
			selectedRoleManagementIds.push($(this).val());
		});
	}
	return false;
}
