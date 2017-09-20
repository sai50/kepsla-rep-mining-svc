var roleFeatureSelectAllChkBox = [];
function addNewRole(){
	var $form = $('#addRoleForm');
	$form.trigger("reset");
	$form.find('.form-group').removeClass('has-error has-feedback');
	$form.find('.help-inline').empty();
	$('#addUserErrorDiv').hide();
	$('#addRoleSuccessDiv').hide();
	return false;
}
/**************************************************************************************************************************
*********************************Next Button*******************************************************************************
***************************************************************************************************************************/
$('#addRoleForm').unbind('submit').bind('submit',function() {
	$('input:checkbox').removeAttr('checked');
	$.ajaxSetup({ cache: false });
	$('#loadMaskDiv').mask('Loading...');
	var roleId = $('#roleId').val();
	var roleName = $.trim($('#role').val());
	var roleDescription = $.trim($('#description').val());
	var JSONObject = {};
	JSONObject['id'] = roleId;
	JSONObject['description'] = roleDescription;
	JSONObject['role'] = roleName;
	$.post("../roleFeature/addFeatures.htm",JSONObject,function(response){
		$('#addRoleErrorDiv').hide();
		var $form = $('#addRoleForm');
		$form.find('.form-group').removeClass('has-error has-feedback');
		$form.find('.help-inline').empty();
		if(response.status=="SAVE_SUCCESS"){
			var tempHtml = addFeatures(response);	
   			$('#addFeaturesDiv').append(tempHtml);
   			$('#addRoleModal').modal('hide');
   			$('#addFeatureModal').modal('show');
   			$('#loadMaskDiv').unmask();
		}else{
			if(response.errorMessageList.length>0){
				$('#addRoleErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage = response.errorMessageList[i].message;
					$('#'+fieldName+'-Error').html(errorMessage);
					$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#loadMaskDiv').unmask();
				}
			}
		}
		
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);

	});
	return false;
});

function addFeatures(response){
	$('#addFeaturesForm').trigger("reset");
	var featuresList = response.successObject.listAllFeatures;
	var urls = [];
	var updatedUrls = [];
	for(var i =0;i<featuresList.length;i++){
		urls.push(featuresList[i].featureAssociatedUrl);
	}
	urls = $.unique(urls);
    for (var i = 0; i < urls.length; i++) {
      updatedUrls.push(urls[i]);
    }
	$('#addFeaturesDiv').html('');
	var html = "";
	html+='<div class="modal fade" id="addFeatureModal"  style="margin-top: 10px;margin-left: 170px;">';
	html+=	'<div class="modal-dialog" style="width:900px;">';
	html+=	'<div class="modal-content">';
	html+=		'<form role="form" class="form-horizontal" id="addFeaturesForm">';
	html+=			'<div class="modal-header">';
	html+=			    '<button type="button" class="close" data-dismiss="modal">&times;</button>';
	html+=			    '<h4 class="modal-title">Assign Features To User</h4>';
	html+=			'</div>';
	html+='<div class="modal-body" style="margin-left: 10px;">';
	html+='<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="addFeaturesErrorDiv">';
	html+=		'<strong>Assign Atleast One Feature To User</strong>';
	html+='</div>';
	html+= '<div id="featuresDiv">';
	for(var j=0;j<updatedUrls.length;j++){
		getFeatures(updatedUrls[j]);
	}
	html+=	'</div>';
	html+='<input type="button" class="btn btn-primary" id="saveFeatureButton" style="margin-left: 1px;" onclick="saveRoleFeatures(addFeaturesForm)" value="Save">&nbsp';
	html+='<button type="button" class="btn btn-warning" id="backToRoleButton" onclick="backToRoleModal()">Back</button>&nbsp';
	html+='</div>';
	html+='</form>';
	html+='</div>';
	html+='</div>';
	html+='</div>';
	return html;
	
}
function getFeatures(featureUrl){
	$('#featuresDiv').html('');
	var JSONObject = {};
	JSONObject['roleId'] = $('#roleId').val();
	JSONObject['featureAssociatedUrl'] = featureUrl;
	var convertedFeatureUrl = featureUrl.replace(/ /g,'_');
	convertedFeatureUrl = convertedFeatureUrl.replace(/\//g,'_');
	var html = "";
	$.post("../roleFeature/getFeatures.htm",JSONObject,function(response){
		if(response.status=="LIST_SUCCESS"){
			var featureMaster = response.successObject.listFeaturesByUrl;
			html+= '<table class="table table-striped table-bordered" id="featureTable">';
			html+=	'<tr>';
			html+=		'<th><input type="checkbox" id="selectAll_'+convertedFeatureUrl+'_ChkBox" style="margin-left:24px;" onclick="selectAll(this)">&nbsp;'+featureUrl+'</th>';
			html+='</tr>';
			for(var j=0;j<featureMaster.length;j++){
				var feature = featureMaster[j].feature;
				var id = featureMaster[j].id;
				var featureAssociatedUrl = featureMaster[j].featureAssociatedUrl.replace(/ /g,'_');
				featureAssociatedUrl = featureAssociatedUrl.replace(/\//g,'_');
				html+= '<tr><td><input type="checkbox" style="margin-left:24px;" id="'+featureAssociatedUrl+'_ChkBox" class="'+featureAssociatedUrl+'_ChkBox" value="'+id+'" onclick="selectCheckBox(this)">&nbsp;'+feature+'</td></tr>';
			}
			html+=	'</table>';
			$('#featuresDiv').append(html);
		}else{
			$('#loadMaskDiv').mask(response.status);
		}
		
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	});
	return false;
}

function backToRoleModal(){
	$.ajaxSetup({ cache: false });
	$('#addFeaturesForm').trigger("reset");
	$('#addFeatureModal').modal('hide');
}


/********************************************************************************************************************************************
**********************E d i t****************************************************************************************************************
**********************************************************************************************************************************************/    
  function editRoleFeatue(){
	$('#editRoleFeatureDiv').html('');
	roleFeatureSelectAllChkBox = [];
	RoleFeaturecheckBoxLength();
  	if(roleFeatureSelectAllChkBox.length>1){
  		alert("You can edit only one record at a time");
  		return false;
  	}else if(roleFeatureSelectAllChkBox.length==0){
  		alert("Please select a record");
  		return false;
  	}else{
  		 $('#loadMaskDiv').mask('Loading...');
  		 $('#deleteSuccessPoi').hide(600);
  		 $.get("../roleFeature/edit.htm?id="+roleFeatureSelectAllChkBox,function(response){
  			$('input:checkbox').removeAttr('checked');
  			 	$('#editRoleFeatureDiv').append(response);
				$('#editRoleFeatureModal').modal('show');
				roleFeatureSelectAllChkBox.pop(roleFeatureSelectAllChkBox);
				$('#loadMaskDiv').unmask();
  		 }).fail(function(response){
  			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
  		 });
  	
  		}
  }
  
  $('#editRoleFeatureForm').unbind('submit').bind('submit',function() {
	  $('#loadMaskDiv').mask('Loading...');
		$('#updateRoleFeatureErrorDiv').hide();
		var $form = $('#editRoleFeatureForm');
		$form.find('.form-group').removeClass('has-error has-feedback');
		$form.find('.help-inline').empty();
		var updatedId = $('#updatedRoleId').val();
		var updatedRole = $.trim($('#updatedRole').val());
		var updatedRoleDescription = $.trim($('#updatedDescription').val());
		var JSONObject = {};
		JSONObject['id'] = updatedId;
		JSONObject['role'] = updatedRole;
		JSONObject['description'] = updatedRoleDescription;
		$.post("../roleFeature/update.htm",JSONObject,function(response){
			if(response.status=="UPDATE_FAIL"){
				if(response.errorMessageList.length>0){
					$('#updateRoleFeatureErrorDiv').show(600);
					for(var i=0;i<response.errorMessageList.length;i++){
						var fieldName = response.errorMessageList[i].fieldName;
						var errorMessage = response.errorMessageList[i].message;
						$('#update-'+fieldName+'-Error').html(errorMessage);
						$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
						$('#loadMaskDiv').unmask();
					}
				}
			}else if(response.status=="UPDATE_SUCCESS"){
				 alert("Record updated successfully");
				 $('#editRoleFeatureModal').modal('hide');
				listCustomRoles();
			}
			
		},'json').fail(function(response){
			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
			return false;
		});
		return false;
	
  });
  /********************************************************************************************************************************************
  **********************M a p F e a t u r e s**************************************************************************************************
  **********************************************************************************************************************************************/  
  function mapFeatures(){
	  roleFeatureSelectAllChkBox = [];
		RoleFeaturecheckBoxLength();
	  	if(roleFeatureSelectAllChkBox.length>1){
	  		alert("You can map only one record at a time");
	  		return false;
	  	}else if(roleFeatureSelectAllChkBox.length==0){
	  		alert("Please select a record");
	  		return false;
	  	}else{
	  		var parentRole = $('.parentRole_'+roleFeatureSelectAllChkBox).text();
	  		$.get("../roleFeature/viewFeatures.htm?parentRole="+parentRole+"&id="+roleFeatureSelectAllChkBox,function(response){
	  			var tempHtml = editMapRoleFeatures(response);
	  			$('#mapRoleFeatureDiv').append(tempHtml);
	  			$('#mapRoleFeatureModal').modal('show');
	  			$('input:checkbox').removeAttr('checked');
	  			
	  		},'json').fail(function(response){
	  			$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	  		});
	  		
	  	}
  }
  
  function editMapRoleFeatures(response){
		$('#mapRoleFeaturesForm').trigger("reset");
		var featuresList = response.successObject.listFeatureUrls;
		var parentRoleId = response.successObject.parentRoleId;
		var featureIdsToUpdate = response.successObject.featureIds;
		var roleId = response.successObject.roleId;
		var urls = [];
		var updatedUrls = [];
		for(var i =0;i<featuresList.length;i++){
			urls.push(featuresList[i]);
		}
		urls = $.unique(urls);
	    for (var i = 0; i < urls.length; i++) {
	      updatedUrls.push(urls[i]);
	    }
		$('#mapRoleFeatureDiv').html('');
		var html = "";
		html+='<div class="modal fade" id="mapRoleFeatureModal"  style="margin-top: 10px;margin-left: 170px;">';
		html+=	'<div class="modal-dialog" style="width:900px;">';
		html+=	'<div class="modal-content">';
		html+=			'<div class="modal-header">';
		html+=			    '<button type="button" class="close" data-dismiss="modal">&times;</button>';
		html+=			    '<h4 class="modal-title">Assign Features To User</h4>';
		html+=			'</div>';
		html+=	'<form role="form" class="form-horizontal" id="mapRoleFeaturesForm">';
		html+='<div class="modal-body" style="margin-left: 10px;">';
		html+='<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="mapFeaturesErrorDiv">';
		html+=		'<strong>Assign Atleast One Feature To User</strong>';
		html+='</div>';
		html+= '<div id="editFeaturesDiv">';
		for(var j=0;j<updatedUrls.length;j++){
			getFeaturesToUpdate(updatedUrls[j],parentRoleId,featureIdsToUpdate,roleId);
		}
		html+=	'</div>';
		html+='<input type="button" class="btn btn-primary"  style="margin-left: 1px;" onclick="updateRoleFeatures(mapRoleFeaturesForm)" value="Update">&nbsp';
		html+= '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
		html+='</div>';
		html+=	'</form>';
		html+='</div>';
		html+='</div>';
		html+='</div>';
		return html;
		
	}
	function getFeaturesToUpdate(featureUrl,parentRoleId,featureIdsToUpdate,roleId){
		$('#editFeaturesDiv').html('');
		var JSONObject = {};
		JSONObject['roleId'] = parentRoleId;
		JSONObject['featureAssociatedUrl'] = featureUrl;
		var convertedFeatureUrl = featureUrl.replace(/ /g,'_');
		convertedFeatureUrl = convertedFeatureUrl.replace(/\//g,'_');
		var html = "";
		$.post("../roleFeature/getFeatures.htm",JSONObject,function(response){
			if(response.status=="LIST_SUCCESS"){
				var featureMaster = response.successObject.listFeaturesByUrl;
				html+= '<table class="table table-striped table-bordered" id="mapfeatureTable">';
				html+=	'<tr>';
				html+=		'<th><input type="checkbox" id="'+convertedFeatureUrl+'_ChkBox_map_SelectAll"  style="margin-left:24px;"  onclick="mapSelectAll(this)">&nbsp;'+featureUrl+'</th>';
				html+='</tr>';
				for(var j=0;j<featureMaster.length;j++){
					var feature = featureMaster[j].feature;
					var id = featureMaster[j].id;
					var featureAssociatedUrl = featureMaster[j].featureAssociatedUrl.replace(/ /g,'_');
					featureAssociatedUrl = featureAssociatedUrl.replace(/\//g,'_');
					if(featureIdsToUpdate.indexOf(id)>-1){
						html+= '<tr><td><input type="checkbox" style="margin-left:24px;" id="map_'+featureAssociatedUrl+'_ChkBox" class="map_'+featureAssociatedUrl+'_ChkBox" value="'+id+'" onclick="mapSelectCheckBox(this)" checked>&nbsp;'+feature+'</td></tr>';
					}else{
						html+= '<tr><td><input type="checkbox" style="margin-left:24px;" id="map_'+featureAssociatedUrl+'_ChkBox" class="map_'+featureAssociatedUrl+'_ChkBox" value="'+id+'" onclick="mapSelectCheckBox(this)">&nbsp;'+feature+'</td></tr>';
					}
						html+=	'<input type="hidden"  id="roleIdToUpdate" value="'+roleId+'"/>';
						html+=	'<input type="hidden"  id="parentRoleId" value="'+parentRoleId+'"/>';
				}
				html+=	'</table>';
				$('#editFeaturesDiv').append(html);
				
			}else{
				$('#loadMaskDiv').mask(response.status);
			}
			
		},'json').fail(function(response){
			$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
		});
		return false;
	}

  
  function updateRoleFeatures(form){
	  $('#mapFeaturesErrorDiv').hide();
	  var f = form.length;
	  var count = 0;
		var arr = [];
		while (f--) {
			if (form[f].type == "checkbox" && form[f].checked) {
				if(form[f].value!="on")
					arr.push(form[f].value);
				count = count + 1;
			}
		}
		
		var roleJsonObject = {"roleId":$('#roleIdToUpdate').val(),"parentRoleId":$('#parentRoleId').val()};
				$.ajax({
				type:"POST",
				url:"../roleFeature/mapFeatures.htm?featureIds="+arr,
				contentType:"application/json",
				data:JSON.stringify(roleJsonObject),
				success:function(response){
				if(response.status=="MAP_FEATURES_FAILURE"){
					$('#mapRoleFeatureModal').scrollTop("0");
					$('#mapFeaturesErrorDiv').show(600);
				}else if(response.status="MAP_FEATURES_SUCCESS"){
					alert("Features Updated Successfully");
					$('#mapRoleFeatureModal').modal('hide');
					$('#listAllRoleFeatureTable').dataTable({ responsive: true});
				}else{
					$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
				}
				
				},error:function(response){
				$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
				}
				
				});
				return false;
				}
		
  function mapSelectAll(checkBox){
		 var checkBoxId = checkBox.id;
		 $(document).on('click',"#"+checkBoxId,function(){
			 checkBoxId = checkBoxId.replace('_map_SelectAll','');
		       $('.map_'+checkBoxId).prop('checked', $(this).is(':checked'));
		     });
	}
	function mapSelectCheckBox(checkBoxId){
		var id = checkBoxId.id;
		$(document).on('click','.'+id,function(){
		       if($('.'+id+':checked').length == $('.'+id).length) {
		    	   id = id.replace('map_','');
		         $('#'+id+'_map_SelectAll').prop('checked', true);
		       }
		       else {
		    	   id = id.replace('map_','');
		    	   $('#'+id+'_map_SelectAll').prop('checked', false);
		       }
		 });
	}


/********************************************************************************************************************************************
 **********************Save Role Feature*****************************************************************************************************
 **********************************************************************************************************************************************/ 
 
function saveRoleFeatures(form){
	$('.modal-content').mask('Loading');
	$('#addFeaturesErrorDiv').hide();
	var f = form.length;
	var count = 0;
	var arr = [];
	while (f--) {
		if (form[f].type == "checkbox" && form[f].checked) {
			if(form[f].value!="on")
				arr.push(form[f].value);
			count = count + 1;
		}
	}
	var roleJsonObject = {"parentRole":$('#roleId option:selected').text(),"role":$.trim($('#role').val()),
							"description":$.trim($('#description').val())};
	$.ajax({
		type:"POST",
		url:"../roleFeature/save.htm?featureIds="+arr,
		contentType:"application/json",
		data:JSON.stringify(roleJsonObject),
		success:function(response){
			if(response.status=="SAVE_ERROR"){
				$('#addFeatureModal').scrollTop("0");
				$('#addFeaturesErrorDiv').show(600);
				$('.modal-content').unmask();
			}else if(response.status=="SAVE_SUCCESS"){
				alert("Features Added Successfully");
				$('#addFeatureModal').modal('hide');
				$('#listAllRoleFeatureTable').dataTable({ responsive: true});
				$('#addRoleForm').trigger("reset");
				$('.modal-content').unmask();
			}else if(response.status=="EXCEPTION_ERROR"){
				$('.modal-content').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('.modal-content').mask(response.status+"****************"+response.statusText);
		}
		
	});
	return false;
}

  

  /********************************************************************************************************************************************
  **********************V i e w ****************************************************************************************************************
  **********************************************************************************************************************************************/
  function showRoleFeature(){
		roleFeatureSelectAllChkBox = [];
		RoleFeaturecheckBoxLength();
	  	if(roleFeatureSelectAllChkBox.length>1){
	  		alert("You can show only one record at a time");
	  		return false;
	  	}else if(roleFeatureSelectAllChkBox.length==0){
	  		alert("Please select a record");
	  		return false;
	  	}else{
	  		 $('#loadMaskDiv').mask('Loading...');
	  		 $.get("../roleFeature/show.htm?id="+roleFeatureSelectAllChkBox,function(response){
	  			$('input:checkbox').removeAttr('checked');
	  			 	var tempHtml = showRoleFeatureResponse(response);
	  			 	$('#showRoleFeatureDiv').append(tempHtml);
					$('#showRoleFeatureModal').modal('show');
					roleFeatureSelectAllChkBox.pop(roleFeatureSelectAllChkBox);
					$('#loadMaskDiv').unmask();
	  		 }).fail(function(response){
	  			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
	  		 });
	  	
	  		}
  }
  
  function showRoleFeatureResponse(response){
	  var role = response.successObject.showRole;
	  $('#showRoleFeatureDiv').html('');
	  var html = "";
		html+= '<div class="modal fade" id="showRoleFeatureModal"  style="margin-top: 120px;margin-left: 170px;">';
		html+=	'<div class="modal-dialog" style="width:900px;">';
		html+=	'<div class="modal-content">';
		html+=		'<div class="modal-header">';
		html+=			'<button type="button" class="close" data-dismiss="modal">&times;</button>';
		html+=			'<h4 class="modal-title">View Details</h4>';
		html+=	   '</div>';//modal-header
		html+= '<div class="modal-body" style="margin-left: 10px;">';
		html+= '<table class="table table-striped table-bordered">';
		html+=	'<thead>';
		html+= 		'<tr>';
		html+=        '<th>Role Name</th>';
		html+=			'<td>'+role.role+'</td>';
		html+= 		'</tr>';
		html+= 		'<tr>';
		html+=        '<th>Primay Role</th>';
		html+=			'<td>'+role.parentRole+'</td>';
		html+=		'</tr>';
		html+=	'</thead>';
		html+=	'<tbody>';
		html+=		'<tr>';
		html+=			'<th>Role Description</th>';
		html+=			'<td>'+role.description+'</td>';
		html+=      '</tr>';
		html+=	'</tbody>';
		html+= '</table>';
		html+= '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
		html+= '</div>';//modal-body
		html+= '</div>';//modal-header
		html+= '</div>';
		html+= '</div>';
		return html;
  }
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/
function listCustomRoles(){
	$('#listAllRoleFeatures').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../roleFeature/list.htm",
        dataType: "json",
   		success: function(response){
   			var tempHtml = listCustomRolesResponse(response);	
   			$('#listAllRoleFeatures').append(tempHtml);
   			$('#listCustomRolesTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listCustomRolesResponse(response){
	$('#listAllRoleFeatures').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllPoiForm">';
		html+='<div class ="table-responsive">';
		html+='<input type="button" class="btn btn-success"  onclick="editRoleFeatue()" value="Edit">&nbsp';
		html+='<input type="button" class="btn btn-success"  onclick="showRoleFeature()" value="View Details">&nbsp';
		html+='<input type="button" class="btn btn-success"  onclick="mapFeatures()" value="Map Features">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deleteRoleFeatues()" value="Delete">';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessRole"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong>Record(s) Deleted Successfully</strong></div>';
		html+= "<table class='table table-striped table-bordered' id='listCustomRolesTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllRoleFeatureChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Role</th>";
		html+=				"<th>Parent Role</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listCustomRoles;
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='roleFeatureChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].role+"</td>";	
				html+=			"<td class=parentRole_"+list[i].id+">"+list[i].parentRole+"</td>";	
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listAllRoleFeatures').empty();
		return html;
}
/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
 function selectAll(checkBox){
	 var checkBoxId = checkBox.id;
	 $(document).on('click',"#"+checkBoxId,function(){
		 checkBoxId = checkBoxId.replace('selectAll_','');
	       $('.'+checkBoxId).prop('checked', $(this).is(':checked'));
	     });
 }
function selectCheckBox(checkBoxId){
	var id = checkBoxId.id;
	$(document).on('click',"."+id,function(){
	       if($('.'+id+':checked').length == $('.'+id).length) {
	         $('#selectAll_'+id).prop('checked', true);
	       }
	       else {
	    	   $('#selectAll_'+id).prop('checked', false);
	       }
	 });
}

$(document).on('click',"#selectAllRoleFeatureChkBox",function(){
    $('.roleFeatureChkBox').prop('checked', $(this).is(':checked'));
  });

$(document).on('click',".roleFeatureChkBox",function(){
    if($('.roleFeatureChkBox:checked').length == $('.roleFeatureChkBox').length) {
      $('#selectAllRoleFeatureChkBox').prop('checked', true);
    }
    else {
      $('#selectAllRoleFeatureChkBox').prop('checked', false);
    }
});

function RoleFeaturecheckBoxLength(){
	if($('.roleFeatureChkBox:checked').length) {
		roleFeatureSelectAllChkBox =[];
        $('.roleFeatureChkBox:checked').each(function() {
        roleFeatureSelectAllChkBox.push($(this).val());
        });
      }
	return false;
}
/********************************************************************************************************************************************
 ****************************D e l e t e******************************************************************************************************
 **********************************************************************************************************************************************/   
 function deleteRoleFeatues(){
	 RoleFeaturecheckBoxLength();
	  if(roleFeatureSelectAllChkBox.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $('#loadMaskDiv').mask("Loading...");
			  $.get("../roleFeature/delete.htm?ids="+roleFeatureSelectAllChkBox,function(response){
				  if(response.status=="DELETE_SUCCESS"){
					  roleFeatureSelectAllChkBox.pop(roleFeatureSelectAllChkBox);
					   var tempHtml = listCustomRolesResponse(response);
					   $('#listAllRoleFeatures').append(tempHtml);
			   		   $('#listCustomRolesTable').dataTable({ responsive: true});
			   		   $('#deleteSuccessRole').show(600);
			   		   $('#loadMaskDiv').unmask();
				  } 
			  },'json').fail(function(response){
				  $('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
			  }); 
		  }
	  }else{
		  alert("Please select a record");
	  }
	  return false;
 }
 