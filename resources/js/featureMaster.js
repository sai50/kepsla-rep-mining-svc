window.parentRoleList=new Array();

function initParentRoleList(){
	$.get(roleFeatureUrl+"fetchParentRoles.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			parentRoleList=[];
			for(var i=0;i<response.successObject.parentRoleList.length;i++){
				parentRoleList.push({'id':response.successObject.parentRoleList[i].id,'role':response.successObject.parentRoleList[i].role});
			}
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.stautsText);
	});
}

$(document).ready(function() {
	  $('#orgAndDate').hide();
	  $.ajaxSetup({ cache: false });
	  featureMasterList("None");
	  initParentRoleList();
});

/**************************************************************************************************************************
 *                     Feature Master Tab                                                                         *
**************************************************************************************************************************/
var featureMasterUrl = "../featureMaster/";
var selectedFeatureMasterIds = [];
/**************************************************************************************************************************
 *                     List Feature Master                                                                         *
 **************************************************************************************************************************/
function featureMasterList(param){
	$('#page-wrapper').mask('loading....');
	$('#featureMasterDataDiv').html('');
	$.ajax({
		type:"GET",
		url:featureMasterUrl+"listTab.htm",
		 dataType: "json",
         contentType: "application/json;charset=utf-8",
		success:function(response){
			if(response.status=="LIST_SUCCESS"){
				var html = featureMasterListFormHtml(response,param);
				if(param=="update"){
					$('#editFeatureMasterSuccessDiv').show(600);
				}
				$('#featureMasterDataDiv').append(html);
				$('#featureMasterListTable').dataTable({paging: false});
				$('#page-wrapper').unmask();
			}else{
				$('#page-wrapper').mask(response.errorMessage);
			}
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*********"+response.statusText);
		}
	});
	return false;
}
function featureMasterListFormHtml(response,param){
	var featureMasterList = response.successObject.featureMasterList;
	
	var html = "";
	/*html+=	'<div id="featureMasterTabButtons">';
	html+=	'<span style="float: left: "><a href="#" onclick="addFeatureMaster()"><img alt="" src="../resources/images/add-icon.jpg"></a></span>&nbsp ';
	html+=	'<span style="float: left: "><a href="#" onclick="featureMasterList()"><img alt="" src="../resources/images/list-icon.jpg"></a></span>&nbsp ';
	html+=	'<span style="float: left: "><a href="#" onclick="deleteFeatureMaster()"><img alt="" src="../resources/images/delete.jpg"></a></span>&nbsp ';
	html+=	'</div><hr>';
	*/
	html += '<form id="featureMasterListForm">';
	html += '<div class="alert alert-success" style="display: none;"	id="editFeatureMasterSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Feature Master Updated Successfully';
	html += '</div>';
	html+=	'<div class="alert alert-success" style="display:none;"id="disableFeatureMasterSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Feature(s) disabled Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="disableFeatureMasterErrorDiv">';
	html += '</div>';
	html+=	'<div class="alert alert-success" style="display:none;"id="enableFeatureMasterSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Feature(s) enabled Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="enableFeatureMasterErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='featureMasterListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllFeatureMasterCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Feature</th>";
	html +=	"<th>Feature Description</th>";
	html +=	"<th>Feature Associated URL</th>";
	html +=	"<th>Status</th>";
	html +=	"<th>Price</th>";
	html+=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<featureMasterList.length;i++){
		var id = featureMasterList[i].id;
		var feature = featureMasterList[i].feature;
		var featureDescription = featureMasterList[i].featureDescription;
		var featureAssociatedUrl = featureMasterList[i].featureAssociatedUrl;
		var price = featureMasterList[i].price;
		var status = featureMasterList[i].status;
		
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="featureMasterCheckBox" value='+id+'></td>';
		html+=	'<td>'+feature+'</td>';
		html+=	'<td>'+featureDescription+'</td>';
		html+=	'<td>'+featureAssociatedUrl+'</td>';
		
		if(status==1){
			html+=	'<td>enabled</td>';
		}else{
			html+=	'<td>disabled</td>';
		}
		html+=	'<td>'+price+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editFeatureMasterForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("FeatureMaster");//Appending Div
	return html;
}
/**************************************************************************************************************************
 *                     Add Feature Master                                                                         *
 **************************************************************************************************************************/
function addFeatureMaster(){
	  $('#page-wrapper').mask('Loading...');
	  $('#featureMasterDataDiv').html('');
	  $('#featureMasterDataDiv').append(addFeatureMasterFormHtml());
	  $('#page-wrapper').unmask();
}
function addFeatureMasterFormHtml(){
	var html = "";
	html+=	'<form id="addFeatureMasterForm">';
	html += '<h4>Add Feature Master</h4><hr>';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;"	id="addFeatureMasterSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Feature Master Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addFeatureMasterSuccessErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Feature***************************************************** */
	html += '<div class="form-group" id="Add-feature-Error">';
	html += '<label>Feature<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="feature-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="feature" placeholder="Enter Feature" maxlength="50">';
	html += '</div>';
	/** ************************************Feature Description***************************************************** */
	html += '<div class="form-group" id="Add-featureDescription-Error">';
	html += '<label>Feature Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="featureDescription-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="featureDescription" placeholder="Enter Feature Description" maxlength="50">';
	html += '</div>';
	/** ************************************Feature Associated URL***************************************************** */
	html += '<div class="form-group" id="Add-featureAssociatedUrl-Error">';
	html += '<label>Feature Associated Url<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="featureAssociatedUrl-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="featureAssociatedUrl" placeholder="Enter Feature Associated Url" maxlength="50">';
	html += '</div>';
	/** ************************************Price***************************************************** */
	html += '<div class="form-group" id="Add-price-Error">';
	html += '<label>Price<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="price-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="price" placeholder="Enter Price" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveFeatureMaster()">';
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Feature Master                                                                         *
 **************************************************************************************************************************/
function saveFeatureMaster(){
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addFeatureMasterSuccessDiv').hide();
	$('#addFeatureMasterErrorDiv').hide();
	var feature = $.trim($('#feature').val());
	var featureDescription = $.trim($('#featureDescription').val());
	var featureAssociatedUrl = $.trim($('#featureAssociatedUrl').val());
	var price = $.trim($('#price').val());
	
	var JSONObject = {'feature':feature,'featureDescription':featureDescription,'featureAssociatedUrl':featureAssociatedUrl,'price':price};
	
	$.post(featureMasterUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addFeatureMasterSuccessDiv').show(600);
			$('#addFeatureMasterForm').trigger("reset");
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			$('#addFeatureMasterErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#'+fieldName+'-span-Error').html(errorMessage);
			}
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Edit Feature Master                                                                         *
 **************************************************************************************************************************/
function editFeatureMasterForm(id){
	$('#page-wrapper').mask('Loading...');
	//$('#featureMasterDataDiv').html('');
	var divId = $('#'+getDivId("FeatureMaster"));
	$.get(featureMasterUrl+"/updateForm.htm?id="+id,function(response){
		if(response.status=="SUCCESS"){
			var html = featureMasterUpdateFormHtml(response);
			appendRoleAddOrEditForm(divId,html);
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	}).fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
function featureMasterUpdateFormHtml(response){
	var featureMaster = response.successObject.featureMaster;
	
	var id = featureMaster.id;
	var feature = featureMaster.feature;
	var featureDescription = featureMaster.featureDescription;
	var featureAssociatedUrl = featureMaster.featureAssociatedUrl;
	var price = featureMaster.price;
	var status = featureMaster.status;
	var html = "";
	html+=	addFormHeading("Edit Feature Master");
	html+=	'<form class="col-sm-5" id="editFeatureMasterForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editFeatureMasterSuccessErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Feature***************************************************** */
	html += '<div class="form-group" id="Edit-feature-Error">';
	html += '<label>Feature<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-feature-span-Error" class="help-inline"></span>';
	html += '<input	disabled type="text" value="'+feature+'"  class="form-control input-sm" id="editedFeature" placeholder="Enter Feature" maxlength="50">';
	html += '</div>';
	/** ************************************Feature Description***************************************************** */
	html += '<div class="form-group" id="Edit-featureDescription-Error">';
	html += '<label>Feature Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-featureDescription-span-Error" class="help-inline"></span>';
	html += '<input	disabled type="text" value="'+featureDescription+'" class="form-control input-sm" id="editedFeatureDescription" placeholder="Enter Feature Description" maxlength="50">';
	html += '</div>';
	/** ************************************Feature Associated Url***************************************************** */
	html += '<div class="form-group" id="Edit-featureAssociatedUrl-Error">';
	html += '<label>Feature Associated Url<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-featureAssociatedUrl-span-Error" class="help-inline"></span>';
	html += '<input	disabled type="text" value="'+featureAssociatedUrl+'" class="form-control input-sm" id="editedFeatureAssociatedUrl" placeholder="Enter Feature Associated Url" maxlength="50">';
	html += '</div>';
	
/*	*//** ************************************Status***************************************************** *//*
	html += '<div class="form-group" id="Edit-status-Error">';
	html += '<label>Status<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-status-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+status+'" class="form-control" id="editedStatus" placeholder="Enter Status" maxlength="50">';
	html += '</div>';
*/	
	/** ************************************Price***************************************************** */
	html += '<div class="form-group" id="Edit-price-Error">';
	html += '<label>Price<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-price-span-Error" class="help-inline"></span>';
	html += '<input	onkeyup="validatePrice(this)" value="'+price+'" class="form-control input-sm" id="editedPrice" placeholder="Enter Price" type="text" >';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input  type="button" class="btn btn-primary" value="Update" onclick ="updateFeatureMaster('+id+')">';
	html+=	appendCancelButton(getDivId("FeatureMaster"),"page-wrapper");//Adding Cancel Button

	html += '</form>';
	return html;
}

function validatePrice(obj){
	 if (!isNaN(parseInt(obj.value,10))) {
	        obj.value = parseInt(obj.value);
	    } else {
	        obj.value = 0;
	    }
	    obj.value = obj.value.replace(/[^0-9]/g, '');
	    if (parseInt(obj.value,10) > 100) {
	        obj.value = 100;
	        return;
	    }
}
/*$("#editedPrice").bind("keyup paste", function(){
	 if (!isNaN(parseInt(this.value,10))) {
	        this.value = parseInt(this.value);
	    } else {
	        this.value = 0;
	    }
	    this.value = this.value.replace(/[^0-9]/g, '');
	    if (parseInt(this.value,10) > 100) {
	        this.value = 100;
	        return;
	    }
});*/



/*jQuery('#editedPrice').keyup(function () { 
	
	alert("dfgrgf");
	  if (!isNaN(parseInt(this.value,10))) {
	        this.value = parseInt(this.value);
	    } else {
	        this.value = 0;
	    }
	    this.value = this.value.replace(/[^0-9]/g, '');
	    if (parseInt(this.value,10) > 100) {
	        this.value = 100;
	        return;
	    }
	    
});*/

function updateFeatureMaster(id){
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editFeatureMasterSuccessDiv').hide();
	$('#editFeatureMasterErrorDiv').hide();
	var feature = $.trim($('#editedFeature').val());
	var featureDescription = $.trim($('#editedFeatureDescription').val());
	var featureAssociatedUrl = $.trim($('#editedFeatureAssociatedUrl').val());
	var price = $.trim($('#editedPrice').val());
	
	var JSONObject = {'id':id,'feature':feature,'featureDescription':featureDescription,'featureAssociatedUrl':featureAssociatedUrl,'price':price};
	$.post(featureMasterUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editFeatureMasterSuccessDiv').show(600);
			featureMasterList("update");			
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			$('#editFeatureMasterErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllFeatureMasterCheckBox",function(){
    $('.featureMasterCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".featureMasterCheckBox",function(){
    if($('.featureMasterCheckBox:checked').length == $('.featureMasterCheckBox').length) {
      $('#checkAllFeatureMasterCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllFeatureMasterCheckBox').prop('checked', false);
    }
});
/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteFeatureMaster(){
	var ids = selectedIds('featureMasterCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteFeatureMasterSuccessDiv').hide();
			$('#deleteFeatureMasterErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:featureMasterUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#featureMasterTabButtons').hide();
						var html = featureMasterListFormHtml(response,"delete");
						$('#featureMasterDataDiv').html(html);
						$('#featureMasterTabButtons').show();
						$('#deleteFeatureMasterSuccessDiv').show(600);
						$('#featureMasterListTable').dataTable({    paging: false});
						$('#page-wrapper').unmask();
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteFeatureMasterErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteFeatureMasterErrorDiv').append(errorMessage);
						$('#deleteFeatureMasterErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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


/**************************************************************************************************************************
 *                     Role Feature Tab                                                                         *
**************************************************************************************************************************/

var roleFeatureUrl = "../roleFeature/";
var selectedRoleFeatureIds = [];
/**************************************************************************************************************************
 *                     List Role Feature                                                                         *
 **************************************************************************************************************************/
function roleFeatureList(){
	$('#page-wrapper').mask('loading....');
	$('#roleFeatureTab').html('');
	$.get(roleFeatureUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = roleFeatureListFormHtml(response);
			$('#roleFeatureTab').append(html);
			$('#roleFeatureListTable').dataTable({paging: false});
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.stautsText);
	
	});
	return false;
}
function roleFeatureListFormHtml(response){
	console.log(response);
	var roleList = response.successObject.roleList;
	var featureMasterList = response.successObject.featureMasterList;

	var html = "";
	
	html += '<form id="roleFeatureListForm">';
	html +=	'<div class="alert alert-success" style="display:none;"id="saveRoleFeatureSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role Feature(s) mapped Successfully';
	html += '</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="saveRoleFeatureErrorDiv">';
	html += '</div>';
	
	html += '<div class="form-group" id="save-role-Error">';
	/*html += '<label>Role<font style="color: red">*</font></label>';*/
	html += '<span style="color: #a94442" id="role-span-Error" class="help-inline"></span>';
	html += '<select class="form-control col-sm-4" style="width:auto;" id="roleOption" onchange="getMappedFeatures(this)">';
	html += '<option value="none" selected disabled>Select Role</option>';
	for(var i=0;i<roleList.length;i++){
		if(roleList[i].role!="GHN_ADMIN"){
			html+= '<option value="'+roleList[i].id+'">'+roleList[i].role+'</option>';
		}
	}
	html += '</select>'
			
		+'<div class="col-sm-4"><input class="btn btn-primary" value="Save" onclick="mapRoleFeature()" type="button"></div> </div>';
	
	html += '<div class="form-group" id="save-featureMaster-Error">';
	html += "<table class='table table-striped dataTable no-footer' id='roleFeatureListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html +=	'<th><input type="checkbox" id="checkAllRoleFeatureCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Feature Description</th>";
	/*html +=	"<th>Price</th>";*/
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<featureMasterList.length;i++){
		var id = featureMasterList[i].id;
		var featureDescription = featureMasterList[i].featureDescription;
		var price = featureMasterList[i].price;
		
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="roleFeatureCheckBox" value='+id+'></td>';
		html+=	'<td>'+featureDescription+'</td>';
		/*html+=	'<td>'+price+'</td>';*/
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	
	html += '</form>';
	
  /*html += '<form id="roleFeatureListForm">'
	html +=	'<div class="alert alert-success" style="display:none;"id="saveRoleFeatureSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role Feature(s) Mapped Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="saveFeatureMasterErrorDiv"></div>';
	
	html += '<div class="form-group" id="save-role-Error">';
	html += '<label>Role<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="role-span-Error" class="help-inline"></span>';
	html += '<select style="width:auto;" id="roleOption" onchange="getMappedFeatures()">';
	html+= '	 <option  disabled selected>Select Role</option>'
	for(var i=0;i<roleList.length;i++){

		html+= '<option value="'+roleList[i].id+'">'+roleList[i].role+'</option>'
	
	}
	html += '</select></div>';
	
	html += '<div class="form-group" id="save-featureMaster-Error">';
	for(var i=0;i<featureMasterList.length;i++){
		html += '<input type="checkbox" class="featureMasterChkBoxes" value="'+featureMasterList[i].id+'" >';
		html += '<label>'+featureMasterList[i].featureDescription+'</label>';
	}
	html += '<span style="color: #a94442" id="featureMaster-span-Error" class="help-inline"></span>';
	
	html += '<input type="button" class="btn btn-primary" value="Save" onclick ="mapRoleFeature()">';
	html += '</form>';*/
	return html;
}

function getMappedFeatures(obj){
	$('#saveRoleFeatureSuccessDiv').hide();
	
	$('.roleFeatureCheckBox').prop('checked', false);
	
	var role={'id':$(obj).val()};
	
	$.ajax({ 
	    url: roleFeatureUrl+"mappedRoleFeature.htm", 
	    type: 'POST', 
	    data: JSON.stringify(role), 
	    contentType: 'application/json',
	    success: function(response) { 
	    	
	    	if(response.status=="LIST_SUCCESS"){
				/*$('#saveRoleFeatureSuccessDiv').show(600);
				$('#roleFeatureListForm').trigger("reset");
				$('#page-wrapper').unmask();*/
	    		for(var i=0;i<response.successObject.roleFeatureList.featureMasterList.length;i++){
	    			   $("input[value='" + response.successObject.roleFeatureList.featureMasterList[i].id + "']").prop('checked', true);
	    		}
	    		
			}else if(response.status=="LIST_ERROR"){
				/*$('#saveRoleFeatureErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-Error').html(errorMessage);
				}*/
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}
	    	
	    },
	    error:function(data,status,er) { 
	        alert("error: "+data+" status: "+status+" er:"+er);
	        $('#page-wrapper').mask(response.status+"*************"+response.statusText);
	    }
	});
	
	return false;
}

function disableAll(){
	$('#page-wrapper').mask('Loading...');
	
	$('#enableFeatureMasterSuccessDiv').hide();
	$('#disableFeatureMasterSuccessDiv').hide();
	
	
	var featureMasterArray=[];
	$('#featureMasterListForm' + ' input[type="checkbox"]').each(function() {
	    if ($(this).is(":checked")) {
	    	var featureId=$(this).val();
		    if($.isNumeric(featureId)==true){	
	    		var roleFeature={'id':featureId,'status':0};
		    	featureMasterArray.push(roleFeature);
		    }
		}
	});
	
	console.log(featureMasterArray);
	$.ajax({ 
	    url: featureMasterUrl+"updateStatus.htm", 
	    type: 'POST', 
	    data: JSON.stringify(featureMasterArray), 
	    contentType: 'application/json',
	    success: function(response) { 
	    	if(response.status=="UPDATE_SUCCESS"){
				$('#disableFeatureMasterSuccessDiv').show(600);
				$('#featureMasterListForm').trigger("reset");
				$('#page-wrapper').unmask();
				featureMasterList("none");
				
			}else if(response.status=="UPDATE_ERROR"){
				$('#disableFeatureMasterErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-Error').html(errorMessage);
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}
	    	
	    },
	    error:function(data,status,er) { 
	        alert("error: "+data+" status: "+status+" er:"+er);
	        $('#page-wrapper').mask(response.status+"*************"+response.statusText);
	    }
	});
	return false;
}

function enableAll(){
	$('#page-wrapper').mask('Loading...');
	$('#enableFeatureMasterSuccessDiv').hide();
	$('#disableFeatureMasterSuccessDiv').hide();
	
	var featureMasterArray=[];
	$('#featureMasterListForm' + ' input[type="checkbox"]').each(function() {
	    if ($(this).is(":checked")) {
	    	var featureId=$(this).val();
		    if($.isNumeric(featureId)==true){	
	    		var roleFeature={'id':featureId,'status':1};
		    	featureMasterArray.push(roleFeature);
		    }
		}
	});
	
	$.ajax({ 
	    url: featureMasterUrl+"updateStatus.htm", 
	    type: 'POST', 
	    data: JSON.stringify(featureMasterArray), 
	    contentType: 'application/json',
	    success: function(response) { 
	    	if(response.status=="UPDATE_SUCCESS"){
				$('#enableFeatureMasterSuccessDiv').show(600);
				$('#featureMasterListForm').trigger("reset");
				$('#page-wrapper').unmask();
				featureMasterList();
				
			}else if(response.status=="UPDATE_ERROR"){
				$('#enableFeatureMasterErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-Error').html(errorMessage);
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}
	    	
	    },
	    error:function(data,status,er) { 
	        alert("error: "+data+" status: "+status+" er:"+er);
	        $('#page-wrapper').mask(response.status+"*************"+response.statusText);
	    }
	});
	return false;
}

/**************************************************************************************************************************
 *             Creation of RoleFeature JSON Object And Save Function                                                                         
 **************************************************************************************************************************/
function mapRoleFeature(){
	
	var roleId=$('#roleOption').val();
	
	if(roleId==null){
		alert("Please Select Role !");
		return;
	}
	var featureMasterList=[];
	var featureIdList=[];
	$('#roleFeatureListForm' + ' input[type="checkbox"]').each(function() {
	    if ($(this).is(":checked")) {
	    	var featureId=$(this).val();
		    if($.isNumeric(featureId)==true){	
	    		var roleFeature={'id':featureId};
		    	featureMasterList.push(roleFeature);
		    	featureIdList.push(featureId);
		    }
		}
	});
	
	var roleFeature={'roleId':roleId,'featureMasterList':featureMasterList,'featureIdList':featureIdList};
	$.ajax({ 
	    url: roleFeatureUrl+"save.htm", 
	    type: 'POST', 
	    data: JSON.stringify(roleFeature), 
	    contentType: 'application/json',
	    success: function(response) { 
	    	if(response.status=="SAVE_SUCCESS"){
				$('#saveRoleFeatureSuccessDiv').show(600);
				$('#roleFeatureListForm').trigger("reset");
				$('#page-wrapper').unmask();
			}else if(response.status=="SAVE_ERROR"){
				$('#saveRoleFeatureErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-Error').html(errorMessage);
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}
	    	
	    },
	    error:function(data,status,er) { 
	        alert("error: "+data+" status: "+status+" er:"+er);
	        $('#page-wrapper').mask(response.status+"*************"+response.statusText);
	    }
	});
	
	return false;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllRoleFeatureCheckBox",function(){
    $('.roleFeatureCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".roleFeatureCheckBox",function(){
    if($('.roleFeatureCheckBox:checked').length == $('.roleFeatureCheckBox').length) {
      $('#checkAllroleFeatureCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllroleFeatureCheckBox').prop('checked', false);
    }
});

/*---------------------------------------------------------------------------------------------------------
--------------------------------------- Role Tab ----------------------------------------------------------
---------------------------------------------------------------------------------------------------------*/

function roleListTab(){
	clearRoleMessages();
	roleList();
}

function roleList(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#roleTab').html('');
	$.get(roleFeatureUrl+"listRole.htm",function(response){
		var html = roleListFormHtml(response);
		$('#roleTab').append(html);
		$('#roleListTable').dataTable();
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"***********"+response.statusText);
	});
	return false;
}

function roleListFormHtml(response){
	var roleList = response.successObject.roleList;

	var html = "";
	html+=	addHeaderButtons("addRole", "deleteRole","roleTabButtons");

	/*html+=	'<div id="roleTabButtons">';
	html+=	'<span style="float: left: "><a href="#" onclick="addRole()" ><img alt="" src="../resources/images/add-icon.jpg"></a></span>&nbsp ';
	html+=	'<span style="float: left: "><a href="#" onclick="roleList()" ><img alt="" src="../resources/images/list-icon.jpg"></a></span>&nbsp ';
	html+=	'<span style="float: left: "><a href="#" onclick="deleteRole()" ><img alt="" src="../resources/images/delete.jpg"></a></span>&nbsp ';
	html+=	'</div><hr>';*/
	
	html += '<div id="roleDataDiv">';
	html += '<form id="roleListForm">';
	
	/**************************Add Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addRoleSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role Added Successfully</div>';
	/**************************Edit Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editRoleSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role Updated Successfully</div>';
	/**************************Delete Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteRoleSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Role(s) Deleted Successfully</div>';
	/**************************Delete Role Error Div*********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteRoleErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='roleListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html +=	'<th><input type="checkbox" id="checkAllRoleCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Role</th>";
	html +=	"<th>Role Description</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<roleList.length;i++){
		var id = roleList[i].id;
		var role = roleList[i].role;
		var description = roleList[i].description;
		
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="roleCheckBox" value='+id+'></td>';
		html+=	'<td>'+role+'</td>';
		html+=	'<td>'+description+'</td>';
		html+=	 '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editRoleForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	'<div id="addAndEditRoleDiv" class="SubHeading" style="display: none;"></div>';
	html += '</div>';
	return html;
}


/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllRoleCheckBox",function(){
    $('.roleCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".roleCheckBox",function(){
    if($('.roleCheckBox:checked').length == $('.roleCheckBox').length) {
      $('#checkAllroleCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllroleCheckBox').prop('checked', false);
    }
});

/**************************************************************************************************************************
 *                     Add Role                                                                         *
 **************************************************************************************************************************/
function addRole(){
	$.ajaxSetup({ cache: false });
	var divId = $('#addAndEditRoleDiv');
	$('#page-wrapper').mask('Loading...');
	var html = addRoleFormHtml();
	appendRoleAddOrEditForm(divId, html);//Adding Form To Div
	$('#page-wrapper').unmask();
	return false;
}
function addRoleFormHtml(){
	
	var html = "";
	
	html+=	'<form id="addRoleForm">';
	html += '<h4>Add Role</h4><hr>';
	/** ***********************************Sucess Div******************************************************** */
/*	html += '<div class="alert alert-success" style="display: none;"	id="addRoleSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Role Added Successfully';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addRoleErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Role***************************************************** */
	html += '<div class="form-group" id="Add-role-Error">';
	html += '<label>Role<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="role-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="role" placeholder="Enter Role" maxlength="50">';
	html += '</div>';
	/** ************************************Role Description***************************************************** */
	html += '<div class="form-group" id="Add-roleDescription-Error">';
	html += '<label>Role Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="roleDescription-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="roleDescription" placeholder="Enter Role Description" maxlength="50">';
	html += '</div>';
	/** ************************************Parent Role***************************************************** */
	html += '<div class="form-group" id="Add-parent-Error">';
	html += '<label>Parent Role<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="parent-span-Error" class="help-inline"></span>';
	
	html += '<select class="form-control" style="width:auto;" id="parentOption">';
	for(var i=0;i<parentRoleList.length;i++){
		html+= '<option value="'+parentRoleList[i].id+'">'+parentRoleList[i].role+'</option>';
	}
	html += '</select>';
	
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveRole()">';
	html+=	appendCancelButton(getDivId("Role"),"page-wrapper");//Adding Cancel Button
	/*html += '<input type="button" class="btn btn-primary" value="Cancel" onclick ="hideForm('+divId+')">';*/
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Role                                                                         *
 **************************************************************************************************************************/
function saveRole(){
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addRoleSuccessDiv').hide();
	$('#addRoleErrorDiv').hide();
	var divId = $('#'+getDivId("Role"));
	var role = $.trim($('#role').val());
	var roleDescription = $.trim($('#roleDescription').val());
	var parentRole = $.trim($('#parentOption option:selected').val());
	var JSONObject = {'parentRole':parentRole,'role':role,'description':roleDescription};
	$.post(roleFeatureUrl+"saveRole.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			var tabButtonsId = $('#roleTabButtons');
			var dataDivId = $('#roleDataDiv');
			var successDivId = "addRoleSuccessDiv";
			var tableId = "roleListTable";
			var html = roleListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(divId);
			$('#addRoleErrorDiv').show(600);
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
}

function editRoleForm(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditRoleDiv');
	$.get(roleFeatureUrl+"updateRoleForm.htm?id="+id,function(response){
		var html = roleUpdateFormHtml(response);
		appendRoleAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}

function roleUpdateFormHtml(response){
	
	var roleObj = response.successObject.role;
	
	var id = roleObj.id;
	var role = roleObj.role;
	var description = roleObj.description;
	var parentRole = roleObj.parentRole;
	
	var html = "";
	
	html+=	'<form id="editRoleForm">';
	html += '<h4>Edit Role</h4><hr>';
	/** ***********************************Sucess Div******************************************************** */
	/*html += '<div class="alert alert-success" style="display: none;"	id="editRoleSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Role Updated Successfully';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editRoleErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Role***************************************************** */
	html += '<div class="form-group" id="Edit-role-Error">';
	html += '<label>Role<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-role-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+role+'"  class="form-control" id="editedRole" placeholder="Enter Role" maxlength="50">';
	html += '</div>';
	/** ************************************Role Description***************************************************** */
	html += '<div class="form-group" id="Edit-roleDescription-Error">';
	html += '<label>Role Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-roleDescription-span-Error" class="help-inline"></span>';
	html += '<input type="text" value="'+description+'" class="form-control" id="editedRoleDescription" placeholder="Enter Role Description" maxlength="50">';
	html += '</div>';

	/** ************************************Parent Role***************************************************** */
	html += '<div class="form-group" id="Edit-parent-Error">';
	html += '<label>Parent Role<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-parent-span-Error" class="help-inline"></span>';
	html += '<select class="form-control" style="width:auto;" id="editedParentOption">';
	for(var i=0;i<parentRoleList.length;i++){
		if(parentRoleList[i].id==parentRole){
			html+= '<option selected value="'+parentRoleList[i].id+'">'+parentRoleList[i].role+'</option>';
		}else{
			html+= '<option value="'+parentRoleList[i].id+'">'+parentRoleList[i].role+'</option>';
		}
	}
	html += '</select>';
	
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateRole('+id+')">';
	html+=	appendCancelButton(getDivId("Role"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function updateRole(id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editRoleSuccessDiv').hide();
	$('#editRoleErrorDiv').hide();
	var role = $.trim($('#editedRole').val());
	var roleDescription = $.trim($('#editedRoleDescription').val());
	var parentRole = $('#editedParentOption option:selected').val();
	var divId = $('#'+getDivId("Role"));
	var JSONObject = {'id':id,'role':role,'description':roleDescription,"parentRole":parentRole};
	$.post(roleFeatureUrl+"updateRole.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#roleTabButtons');
			var dataDivId = $('#roleDataDiv');
			var successDivId = "editRoleSuccessDiv";
			var tableId = "roleListTable";
			var html = roleListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editRoleErrorDiv').show(600);
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

/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteRole(){
	var ids = selectedIds('roleCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteRoleSuccessDiv').hide();
			$('#deleteRoleErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:roleFeatureUrl+"/deleteRole.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#roleTabButtons');
						var dataDivId = $('#roleDataDiv');
						var successDivId = "deleteRoleSuccessDiv";
						var tableId ="roleListTable";
						var html = roleListFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#page-wrapper').unmask();
						selectedRoleIds = [];
						
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteRoleErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteRoleErrorDiv').append(errorMessage);
						$('#deleteRoleErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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

function appendRoleAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearRoleMessages();//Clearing Role Error/Sucess Message Div
}
function clearRoleMessages(){
	$('#addRoleSuccessDiv,#editRoleSuccessDiv,#deleteRoleSuccessDiv,#deleteRoleErrorDiv').hide(600);
}

function selectedRoleCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.geoRoleCheckBox:checked').length) {
		selectedRoleIds = [];
		$('.roleCheckBox:checked').each(function() {
			selectedRoleIds.push($(this).val());
		});
	}
	return false;
}
