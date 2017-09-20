
function addNewUser(){
	var $form = $('#addUserForm');
	$form.trigger("reset");
	$form.find('.form-group').removeClass('has-error has-feedback');
	$form.find('.help-inline').empty();
	$('#addUserErrorDiv').hide();
	$('#addUserSuccessDiv').hide();
	return false;
}



/***************************************************************************************
 *                         Save User
 * **************************************************************************************/

$('#addUserForm').unbind('submit').bind('submit',function(){
	$('#addUserForm').mask('Loading');
	var $form = $('#addUserForm');
	var JSONObject = {};
	JSONObject['userName'] = $.trim($('#userName').val());
	JSONObject['userFirstName'] = $.trim($('#userFirstName').val());
	JSONObject['userMiddleName'] = $.trim($('#userMiddleName').val());
	JSONObject['userLastName'] = $.trim($('#userLastName').val());
	JSONObject['primaryEmail'] = $.trim($('#primaryEmail').val());
	JSONObject['password'] = $.trim($('#password').val());
	JSONObject['secondaryEmail'] = $.trim($('#secondaryEmail').val());
	JSONObject['mobile'] = $.trim($('#mobile').val());
	JSONObject['phone'] = $.trim($('#phone').val());
	JSONObject['fax'] = $.trim($('#fax').val());
	var confirmPrimaryEmailId = $.trim($('#confirmPrimaryEmailId').val());
	var confirmPassWord = $.trim($('#confirmPassword').val());
	var userRole = $('#userRoleId option:selected ').val();
	$.post("../userManagement/save.htm?confirmPassword="+confirmPassWord+"&confirmPrimaryEmailId="+confirmPrimaryEmailId+"&userRole="+userRole,JSONObject,function(response){
		$('#addUserErrorDiv').hide();
		$('#loadMaskDiv').scrollTop("0");
		$form.find('.form-group').removeClass('has-error has-feedback');
		$form.find('.help-inline').empty();
		if(response.status=="SAVE_SUCCESS"){
			$('#addUserSuccessDiv').show(600);
			$('#addUserForm').trigger("reset");
			$('#addUserForm').unmask();
		}else if(response.status=="SAVE_ERROR"){
			$('#addUserErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage = response.errorMessageList[i].message;
				$('#'+fieldName+'-Error').html(errorMessage);
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#addUserForm').unmask();
				$form.find('.control').addClass('label');
			}
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#addUserForm').mask(response.errorMessage);
		}
	
	},'json').fail(function(response){
		$('#addUserForm').mask(response.status+"***************"+response.statusText);
	});
	return false;
});
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/
function listUsers(){
	$('#listUsers').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../userManagement/list.htm",
        dataType: "json",
   		success: function(response){
   			var tempHtml = listUsersResponse(response);	
   			$('#listUsers').append(tempHtml);
   			$('#listUsersTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	$('#loadMask').mask(response.status+","+response.statusText);
        	return false;
           }
     });
}
function listUsersResponse(response){

	$('#listUsers').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllUsersForm">';
		html+='<div class ="table-responsive">';
		html+='<input type="button" class="btn btn-success"  onclick="editUser(listAllUsersForm)" value="Edit">&nbsp';
		html+='<input type="button" class="btn btn-success"  onclick="showUser(listAllUsersForm)" value="View Details">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deleteUsers(listAllUsersForm)" value="Delete">&nbsp';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessUser"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong>Record(s) Deleted Successfully</strong></div>';
		html+='<div class="alert alert-success" style="display:none;"id="blockOrUnblockSuccessUser">&nbsp;</div>';
		html+= "<table class='table table-striped table-bordered' id='listUsersTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllUserChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Username</th>";
		html+=				"<th>Role</th>";
		html+=				"<th>Primary Email-Id</th>";
		html+=				"<th>Action</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listUsers;
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='userChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].userName+"</td>";	
				html+=			"<td class=role_"+list[i].id+">"+list[i].userFirstName+"</td>";	
				html+=			"<td class=email_"+list[i].id+">"+list[i].primaryEmail+"</td>";	
				html+=			'<td><input type="button" class="btn btn-danger"  onclick="blockUser('+list[i].id+')" value="Block" id="blockUserButton_'+list[i].id+'"></td>';
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listUsers').empty();
		return html;
}
/********************************************************************************************************************************************
**********************E d i t ***************************************************************************************************************
**********************************************************************************************************************************************/

function editUser(form){
	var f = form.length;
	var count = 0;
	while (f--) {
		if (form[f].type == "checkbox" && form[f].checked) {
			if(form[f].value!="on")
				var id = form[f].value;
				var role = $('.role_'+id).text();
				count = count + 1;
		}
	}
	if(count==0){
		alert("Please select a row");
		
	}else if($(".userChkBox:checked").length == 1){
		$('#loadMaskDiv').mask('Loading...');
		var id = $(".userChkBox:checked").val();
		$.get("../userManagement/viewEditForm.htm?id="+id+"&role="+role,function(response){
			$('#editUserDiv').append(response);
			$('#editUserModal').modal('show');
			$('#loadMaskDiv').unmask();
			$('input:checkbox').removeAttr('checked');
		}).fail(function(response){
			$('#loadMaskDiv').mask(response.status+"************"+response.statusText);
		});
	}else{
		alert("You can edit only one user at a time");
	}
	return false;
}

$('#editUserForm').unbind('submit').bind('submit',function(){
	var $form = $('#editUserForm');
	var JSONObject = {};
	JSONObject['id'] = $('#updatedUserId').val();
	JSONObject['userName'] = $.trim($('#updatedUserName').val());
	JSONObject['userFirstName'] = $.trim($('#updatedUserFirstName').val());
	JSONObject['userMiddleName'] = $.trim($('#updatedUserMiddleName').val());
	JSONObject['userLastName'] = $.trim($('#updatedUserLastName').val());
	JSONObject['primaryEmail'] = $.trim($('#updatedPrimaryEmail').val());
	JSONObject['password'] = $.trim($('#updatedPassword').val());
	JSONObject['secondaryEmail'] = $.trim($('#updatedSecondaryEmail').val());
	JSONObject['mobile'] = $.trim($('#updatedMobile').val());
	JSONObject['phone'] = $.trim($('#updatedPhone').val());
	JSONObject['fax'] = $.trim($('#updatedFax').val());
	var updatedConfirmPrimaryEmailId = $.trim($('#updatedConfirmPrimaryEmailId').val());
	var updatedConfirmPassWord = $.trim($('#updatedConfirmPassword').val());
	$.post("../userManagement/update.htm?updatedConfirmPassWord="+updatedConfirmPassWord+"&updatedConfirmPrimaryEmailId="+updatedConfirmPrimaryEmailId,JSONObject,function(response){
		$('#editUserErrorDiv').hide();
		$('#loadMaskDiv').scrollTop("0");
		$form.find('.form-group').removeClass('has-error has-feedback');
		$form.find('.help-inline').empty();
		if(response.status=="UPDATE_SUCCESS"){
			alert("User updated successfully");
			$('#editUserModal').modal('hide');
			listUsers();
		}else if(response.errorMessageList.length>0){
			$('#editUserErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage = response.errorMessageList[i].message;
				$('#update-'+fieldName+'-Error').html(errorMessage);
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#loadMaskDiv').unmask();
				$form.find('.control').addClass('label');
			}
		}else{
			$('#loadmask').mask(response.message);
		}
	
	},'json').fail(function(response){
		$('#loadmask').mask(response.status+"***************"+response.statusText);
	});
	return false;
});


/********************************************************************************************************************************************
**********************D e l e t e************************************************************************************************************
**********************************************************************************************************************************************/

function deleteUsers(form){
	var f = form.length;
	var count = 0;
	var arr = [];
	var emailArray = [];
	while (f--) {
		if (form[f].type == "checkbox" && form[f].checked) {
			if(form[f].value!="on")
				var id = form[f].value;
				var email = $('.email_'+id).text();
				arr.push(id);
				emailArray.push(email);
				count = count + 1;
		}
	}
	
	if(count==0){
		alert("Please select a row");
		return false;
	}else if(confirm("Do you want do delete selected user(s)?")){
		$.post("../userManagement/delete.htm?ids="+arr+"&emailIds="+emailArray,function(response){
			if(response.status=="DELETE_SUCCESS"){
					var tempHtml = listUsersResponse(response);
					$('#listUsers').append(tempHtml);
					$('#listUsersTable').dataTable({ responsive: true});
		   		    $('#deleteSuccessUser').show(600);
		   		    $('#loadMaskDiv').unmask();
			}else{
				$('#loadMaskDiv').mask("Something went wrong.Please contact admin.....");
			}
			
		},'json').fail(function(response){
			$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
		});
	}
	
	return false;
}
/********************************************************************************************************************************************
**********************S h o w ***************************************************************************************************************
**********************************************************************************************************************************************/
function showUser(form){
	var f=form.length;
	var count=0;
	var role = "";
	while(f--){
		if(form[f].type=="checkbox" && form[f].checked){
			count=count+1;
		}
	}
	if(count==0){
		window.alert("Please select a row");
		return false;
	}else if($(".userChkBox:checked").length == 1){
		 var userShowId = $(".userChkBox:checked").val();
		 role = $('.role_'+userShowId).text();
		 $.get("../userManagement/show.htm?id="+userShowId,function(response){
			 if(response.status=="SHOW_SUCCESS"){
				 $('input:checkbox').removeAttr('checked');
				 var tempHtml = showUserResponse(response,role);
				 $('#showUserDiv').append(tempHtml);
				 $('#showUserModal').modal('show');
			 }else{
				 $('#loadMaskDiv').mask(response.message);
			 }
			 
		 },'json').fail(function(response){
			 $('#loadMaskDiv').mask(response.status+"************"+response.statusText);
		 });
	}else{
		alert("You can show only one user at a time");
		
	}
	
	return false;
}

function showUserResponse(response,role){
	  var user = response.successObject.user;
	  $('#showUserDiv').html('');
	  var html = "";
		html+= '<div class="modal fade" id="showUserModal"  style="margin-top: 70px;margin-left: -20px;">';
		html+=	'<div class="modal-dialog" style="width:900px;">';
		html+=	'<div class="modal-content">';
		html+=		'<div class="modal-header">';
		html+=			'<button type="button" class="close" data-dismiss="modal">&times;</button>';
		html+=			'<h4 class="modal-title">View Details</h4>';
		html+=	   '</div>';//modal-header
		html+= '<div class="modal-body" style="margin-left: 10px;">';
		html+= '<table class="table table-striped table-bordered">';
		//html+=	'<thead>';
		
		html+= 		'<tr>';
		html+=        '<th>User Role</th>';
		html+=			'<td>'+role+'</td>';
		html+= 		'</tr>';
		
		html+= 		'<tr>';
		html+=        '<th>User Name</th>';
		html+=			'<td>'+user.userName+'</td>';
		html+=		'</tr>';
		
		html+=		'<tr>';
		html+=			'<th>First Name</th>';
		html+=			'<td>'+user.userFirstName+'</td>';
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Middle Name</th>';
		if(user.userMiddleName==null){
			html+=			'<td></td>';
		}else{
			html+=			'<td>'+user.userMiddleName+'</td>';
		}
		
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Last Name</th>';
		html+=			'<td>'+user.userLastName+'</td>';
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Primary Email-Id</th>';
		html+=			'<td>'+user.primaryEmail+'</td>';
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Confirm Primary Email-Id</th>';
		html+=			'<td>'+user.primaryEmail+'</td>';
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Secondary Email-Id</th>';
		if(user.secondaryEmail==null){
			html+=			'<td></td>';
		}else{
			html+=			'<td>'+user.secondaryEmail+'</td>';
		}
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Mobile Number</th>';
		html+=			'<td>'+user.mobile+'</td>';
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Phone Number</th>';
		if(user.phone==null){
			html+=			'<td></td>';
		}else{
			html+=			'<td>'+user.phone+'</td>';
		}
		
		html+=      '</tr>';
		
		html+=		'<tr>';
		html+=			'<th>Fax</th>';
		if(user.fax==null){
			html+=			'<td></td>';
		}else{
			html+=			'<td>'+user.fax+'</td>';
		}
		
		html+=      '</tr>';
		
		
		html+= '</table>';
		html+= '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
		html+= '</div>';//modal-body
		html+= '</div>';//modal-content
		html+= '</div>';//modal-dialog
		html+= '</div>';//modal-fade
		return html;
}

/********************************************************************************************************************************************
**********************B l o c k *************************************************************************************************************
**********************************************************************************************************************************************/
function blockUser(id){
	var buttonValue = $("#blockUserButton_"+id).val();
	if(confirm("Do you want to "+buttonValue+" the user?")){
		$('#blockOrUnblockSuccessUser').html('');
		$('#blockOrUnblockSuccessUser').hide();
		if(buttonValue=="Block"){
			$.get("../userManagement/blockUser.htm?id="+id,function(response){
				if(response.status=="SUCCESS"){
					$("#blockUserButton_"+id).val("Unblock");
					$("#blockUserButton_"+id).removeClass('btn btn-danger');
					$("#blockUserButton_"+id).addClass('btn btn-success');
					$('#blockOrUnblockSuccessUser').append('<img alt="" src="../resources/images/done.png" style="margin-left: 8px;"><strong>User '+buttonValue+'ed Successfully</strong>');
					$('#blockOrUnblockSuccessUser').show(600);
				}else{
					$('#loadMaskDiv').mask("Something went wrong.Please contact Admin");
				}
				
			},'json').fail(function(response){
				$('#loadMaskDiv').mask(response.status+"**************"+response.statusText);
			});
		}else{
			$.get("../userManagement/unblockUser.htm?id="+id,function(response){
				if(response.status=="SUCCESS"){
					$("#blockUserButton_"+id).val("Block");
					$("#blockUserButton_"+id).removeClass('btn btn-success');
					$("#blockUserButton_"+id).addClass('btn btn-danger');
					$('#blockOrUnblockSuccessUser').append('<img alt="" src="../resources/images/done.png" style="margin-left: 8px;"><strong>User '+buttonValue+'ed Successfully</strong>');
					$('#blockOrUnblockSuccessUser').show(600);
				}else{
					$('#loadMaskDiv').mask("Something went wrong.Please contact Admin");

				}
				
			},'json').fail(function(response){
				$('#loadMaskDiv').mask(response.status+"*****************"+response.statusText);
			});
		}
	}
	return false;
}



/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
$(document).on('click',"#selectAllUserChkBox",function(){
    $('.userChkBox').prop('checked', $(this).is(':checked'));
  });

$(document).on('click',".userChkBox",function(){
    if($('.userChkBox:checked').length == $('.userChkBox').length) {
      $('#selectAllUserChkBox').prop('checked', true);
    }
    else {
      $('#selectAllUserChkBox').prop('checked', false);
    }
});
