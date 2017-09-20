$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});
var sourceMasterUrl = "../sourceMaster/";

//*****Source Master Variables***************//
var sourceMasterDataDiv = $('#sourceMasterDataDiv');
var sourceMasterTableId = $('#sourceMasterListTable');
var selectedSourceMasterIds = [];

/**************************************************************************************************************************
 *                     List Source Master                                                                         *
 **************************************************************************************************************************/
function sourceMasterListTab(){
	clearSourceMasterMessages();
	sourceMasterList();
}

function sourceMasterList(){
	$.ajaxSetup({ cache: false });
	$('#loadMaskDiv').mask('Loading...');
	sourceMasterDataDiv.html('');
	$.get(sourceMasterUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = listSourceMasterHtml(response);
			sourceMasterDataDiv.append(html);
			$('#sourceMasterListTable').dataTable();
			$('#loadMaskDiv').unmask();
		}else{
			$('#sourceMasterDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	},'json').fail(function(response){
		sourceMasterDataDiv.mask(response.status+"**********"+response.statusText);
	});
	return false;
}
function listSourceMasterHtml(response) {
	var sourceMasterList = response.successObject.sourceMasterList;
	var html = "";
	html += '<form id="sourceMasterListForm">';
	
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteSourceMasterSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong> Source(s) Deleted Successfully</strong></div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteSourceMasterErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped table-bordered' id='sourceMasterListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllSourceMasterCheckBox" style="margin-left: -7px;"></th>';
	html +=	"<th>Source Name</th>";
	html +=	"<th>Source Base Url</th>";
	html +=	"<th>Source Type</th>";
	html +=	"<th>Source Popularity</th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<sourceMasterList.length;i++){
		var id = sourceMasterList[i].id;
		var sourceName = sourceMasterList[i].sourceName;
		var sourceBaseUrl = sourceMasterList[i].sourceBaseUrl;
		var sourceType = sourceMasterList[i].sourceType;
		var sourcePopularity = sourceMasterList[i].sourcePopularity;
		
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="sourceMasterCheckBox" value='+id+'></td>';
		html+=	'<td>'+sourceName+'</td>';
		html+=	'<td>'+sourceBaseUrl+'</td>';
		html+=	'<td>'+sourceType+'</td>';
		html+=	'<td>'+sourcePopularity+'<span style="float: right;"><a href="#" onclick="editSourceMaster('+id+')"><img src="../resources/images/edit-icon.jpg"></a></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	'<div id="addAndEditSourceMasterDiv"></div>';
	return html;
}

/**************************************************************************************************************************
 *                      Add Source Master                                                                             *
 **************************************************************************************************************************/
function addSourceMaster(){
	$.ajaxSetup({ cache: false });
	$('#loadMaskDiv').mask('Loading...');
	
	var divId = $('#addAndEditSourceMasterDiv');
	var addMethod  = addSourceMasterFormHtml();
	appendSourceMasterAddOrEditForm(divId,addMethod);//Method To Generate Add/Edit Form
	
	$('#loadMaskDiv').unmask();
	return false;
}
function addSourceMasterFormHtml(){
	var html = "";
	var divId = "addAndEditSourceMasterDiv";
	html+=	'<form id="addSourceMasterForm">';
	html += '<h4>Add Source</h4><hr>';
	/** ***********************************Sucess Div******************************************************** */
	/*html += '<div class="alert alert-success" style="display: none;"	id="addSourceMasterSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Source Added Successfully</strong>';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addSourceMasterErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group" id="Add-sourceName-Error">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="sourceName" placeholder="Enter Source Name" maxlength="50">';
	html += '</div>';
	/** ************************************Source Base Url***************************************************** */
	html += '<div class="form-group" id="Add-sourceBaseUrl-Error">';
	html += '<label>Source Base Url<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="sourceBaseUrl-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="sourceBaseUrl" placeholder="Enter Source Base Url" >';
	html += '</div>';
	/** ************************************Source Type***************************************************** */
	html += '<div class="form-group" id="Add-sourceType-Error">';
	html += '<label>Source Type<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="sourceType-span-Error" class="help-inline"></span>';
	
	
	/*html += '<input	type="text" class="form-control" id="sourceType" placeholder="Enter Source Type" maxlength="3">';
	*/
	html += '<select class="form-control" style="width:50%" name="sourceType" id="sourceType">';
	html += '<option selected value="SocialNetworkingSite">SocialNetworkingSite</option>';
	html += '<option value="Blog">Blog</option>';
	html += '<option value="ReviewSite">ReviewSite</option>';
	html += '</select>';
	
	html += '</div>';
	/** ************************************Source Popularity***************************************************** */
	html += '<div class="form-group" id="Add-sourcePopularity-Error">';
	html += '<label>Source Popularity<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="sourcePopularity-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="sourcePopularity" placeholder="Enter Source Popularity" maxlength="3">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveSourceMaster()">&nbsp';
	html += '<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divId+')">';
	
	html += '</form>';
	return html;
}
function saveSourceMaster(){
	var addAndEditSourceMasterDiv = $('#addAndEditSourceMasterDiv');
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#loadMaskDiv').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addSourceMasterSuccessDiv').hide();
	$('#addSourceMasterErrorDiv').hide();
	
	var sourceName = $.trim($('#sourceName').val());
	var sourceBaseUrl = $.trim($('#sourceBaseUrl').val());
	var sourceType = $.trim($('#sourceType').val());
	var sourcePopularity = $.trim($('#Popularity').val());
	
	var JSONObject = {'sourceName':sourceName,'sourceBaseUrl':sourceBaseUrl,'sourceType':sourceType,'sourcePopularity':sourcePopularity};
	
	$.post(sourceMasterUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addSourceMasterSuccessDiv').show(600);
			$('#addSourceMasterForm').trigger("reset");
			sourceMasterList();
			$('#loadMaskDiv').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(addAndEditSourceMasterDiv);
			$('#addSourceMasterErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#loadMaskDiv').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#loadMaskDiv').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

/**************************************************************************************************************************
 *                     Edit Source Master                                                                         *
 **************************************************************************************************************************/
function editSourceMaster(id){
	$('#loadMaskDiv').mask('Loading...');
	var divId = $('#addAndEditSourceMasterDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(sourceMasterUrl+"edit.htm?id="+id,function(response){
		var html = editSourceMasterFormHtml(response);
		appendSourceMasterAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#loadMaskDiv').unmask();
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function editSourceMasterFormHtml(response){
	var sourceMaster = response.successObject.sourceMaster;
	var id = sourceMaster.id;
	var sourceName = sourceMaster.sourceName;
	var sourceBaseUrl = sourceMaster.sourceBaseUrl;
	var sourceType = sourceMaster.sourceType;
	var sourcePopularity = sourceMaster.sourcePopularity;
	
	var html = "";
	html+=	'<form id="editSourceMasterForm">';
	html += '<h4>Edit Source Master</h4><hr>';
	/** ***********************************Sucess Div******************************************************** */
/*	html += '<div class="alert alert-success" style="display: none;"	id="editSourceMasterSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Source Master Updated Successfully</strong>';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editSourceMasterErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	/** ************************************Source Master Name***************************************************** */
	html += '<div class="form-group" id="Edit-sourceName-Error">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" disabled class="form-control" id="editSourceName" value="'+sourceName+'"  placeholder="Enter Source Name" maxlength="50">';
	html +=	'<input type="hidden" value='+id+' id="editSourceId">';
	html += '</div>';
	/** ************************************Source Base Url***************************************************** */
	html += '<div class="form-group" id="Edit-sourceBaseUrl-Error">';
	html += '<label>Source Base Url<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourceBaseUrl-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="editSourceBaseUrl" value="'+sourceBaseUrl+'" placeholder="Enter Source Base Url">';
	html += '</div>';
	
	/** ************************************Source Type***************************************************** */
	html += '<div class="form-group" id="Edit-sourceType-Error">';
	html += '<label>Source Type<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourceType-span-Error" class="help-inline"></span>';
	
	html += '<select class="form-control" style="width:50%" name="editSourceType" id="editSourceType">';
	
	if(sourceType=="SocialNetworkingSite"){
		html += '<option selected value="SocialNetworkingSite">SocialNetworkingSite</option>';
		html += '<option value="Blog">Blog</option>';
		html += '<option value="ReviewSite">ReviewSite</option>';
	}
	if(sourceType=="Blog"){
		html += '<option value="SocialNetworkingSite">SocialNetworkingSite</option>';
		html += '<option selected value="Blog">Blog</option>';
		html += '<option value="ReviewSite">ReviewSite</option>';
	}
	if(sourceType=="ReviewSite"){
		html += '<option value="SocialNetworkingSite">SocialNetworkingSite</option>';
		html += '<option  value="Blog">Blog</option>';
		html += '<option selected value="ReviewSite">ReviewSite</option>';
	}
	html += '</select>';

	html += '</div>';
	
	/** ************************************Source Popularity***************************************************** */
	html += '<div class="form-group" id="Edit-sourcePopularity-Error">';
	html += '<label>Source Popularity<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourcePopularity-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="editSourcePopularity" value="'+sourcePopularity+'" placeholder="Enter Source Popularity" maxlength="3">';
	html += '</div>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-default" value="Update" onclick ="updateSourceMaster()">';
	html+=	'</form>';
	return html;
}
function updateSourceMaster(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#loadMaskDiv').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editSourceMasterSuccessDiv').hide();
	$('#editSourceMasterErrorDiv').hide();
	
	var editSourceId = $.trim($('#editSourceId').val());
	var editSourceBaseUrl = $.trim($('#editSourceBaseUrl').val());
	var editSourceType = $.trim($('#editSourceType').val());
	var editSourcePopularity = $('#editSourcePopularity').val();
	
	var JSONObject = {};
	JSONObject['id'] = editSourceId;
	JSONObject['sourceBaseUrl'] = editSourceBaseUrl;
	JSONObject['sourceType'] = editSourceType;
	JSONObject['sourcePopularity'] = editSourcePopularity;
	
	$.post(sourceMasterUrl+"/update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editSourceMasterSuccessDiv').show(600);
			sourceMasterList();
			$('#loadMaskDiv').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			$('#editSourceMasterErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#loadMaskDiv').unmask();
		}else{
			$('#loadMaskDiv').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#editSourceMasterDiv').mask(response.status+"************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Delete Source Master                                                                         *
 **************************************************************************************************************************/
function deleteSourceMaster(){
	$.ajaxSetup({ cache: false });
	selectedSourceMasterCheckBoxLength();
	if(selectedSourceMasterIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#loadMaskDiv').mask('Loading...');
			/**********************New Div Changes****************************/
			$('#addAndEditSourceMasterDiv').hide();//Hiding Add/Edit Form
			clearSourceMasterMessages();//Clearing All Error/Success Message Divs
			/**********************New Div Changes****************************/
			$.ajax({
				type:"POST",
				url:sourceMasterUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedSourceMasterIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#SourceMasterTabButtons').hide();
						var html = listSourceMasterHtml(response);
						sourceMasterDataDiv.html(html);
						$('#deleteSourceMasterSuccessDiv').show(600);
						//$('#geoCountryTabButtons').show();
						$('#sourceMasterListTable').dataTable();
						$('#loadMaskDiv').unmask();
						selectedSourceMasterIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteSourceMasterErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteSourceMasterErrorDiv').append(errorMessage);
						$('#deleteSourceMasterErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedSourceMasterIds = [];
						$('#loadMaskDiv').unmask();
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		alert("Please select a record");
		return false;
	}
	
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllSourceMasterCheckBox",function(){
    $('.sourceMasterCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".sourceMasterCheckBox",function(){
    if($('.sourceMasterCheckBox:checked').length == $('.sourceMasterCheckBox').length) {
      $('#checkAllSourceMasterCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllSourceMasterCheckBox').prop('checked', false);
    }
});

function selectedSourceMasterCheckBoxLength() {
	if ($('.sourceMasterCheckBox:checked').length) {
		selectedSourceMasterIds = [];
		$('.sourceMasterCheckBox:checked').each(function() {
			selectedSourceMasterIds.push($(this).val());
		});
	}
	return false;
}


function appendSourceMasterAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearSourceMasterMessages();//Clearing Source Master Error/Sucess Message Div
}
function clearSourceMasterMessages(){
	$('#addSourceMasterSuccessDiv,#editSourceMasterSuccessDiv,#deleteSourceMasterSuccessDiv,#deleteSourceMasterErrorDiv').hide(600);
}

/**************************************************************************************************************************
 *                     List Geo Cities                                                                         *
 **************************************************************************************************************************//*

function geoCityList(){
	$.ajaxSetup({ cache: false });
	$('#loadMaskDiv').mask('Loading...');
	$('#geoCityTab').html('');
	$.get(geoCityUrl+"list.htm",function(response){
		var html = listGeoCitiesHtml(response);
		$('#geoCityTab').append(html);
		$('#geoCityListTable').dataTable();
		$('#loadMaskDiv').unmask();
	},'json').fail(function(response){
		$('#loadMaskDiv').append(response.status+"***********"+response.statusText);
	});
	return false;
}
function listGeoCitiesHtml(response){
	var geoCitiesList = response.successObject.geoCitiesList;
	var html = "";
	html+=	'<div id="geoCityMasterTabButtons">';
	html+=	'<span style="float: left: "><a href="#" onclick="addGeoCity()">'+addIcon();
	html+=	'<span style="float: left: "><a href="#" onclick="geoCityList()">'+listIcon();
	html+=	'<span style="float: left: "><a href="#" onclick="deleteGeoCities()">'+deleteIcon();
	html+=	'</div><hr>';
	html+=	'<div id="geoCityDataDiv">';
	html+=	'<form id="geoCityListForm">';
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteGeoCitiesSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong> Country/Countries Deleted Successfully</strong></div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteGeoCitiesErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped table-bordered' id='geoCityListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllGeoCityCheckBox" style="margin-left: -7px;"></th>';
	html +=	"<th>City Name</th>";
	html +=	"<th>Country Name</th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<geoCitiesList.length;i++){
		var id = geoCitiesList[i].id;
		var cityName = geoCitiesList[i].geoCityName;
		var countryName = geoCitiesList[i].geoCountryName;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="geoCityCheckBox" value='+id+'></td>';
		html+=	'<td>'+cityName+'</td>';
		html+=	'<td>'+countryName+'<span style="float: right;"><a href="#" onclick="editGeoCity('+id+')"><img src="../resources/images/edit-icon.jpg"></a></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	'</form>';
	html+=	'</div>';
	return html;
}*/
/**************************************************************************************************************************
 *                    Add Geo City		                                                                              *
 **************************************************************************************************************************//*
function addGeoCity(){
	$.ajaxSetup({ cache: false });
	var geoCityDataDiv = $('#geoCityDataDiv');
	$('#loadMaskDiv').mask('Loading...');
	geoCityDataDiv.html('');
	$.get(geoCityUrl + "add.htm", function(response) {
		var html = addGeoCityFormHtml(response);
		geoCityDataDiv.append(html);
		$('#loadMaskDiv').unmask();
	},'json').fail(function(response){
		$('#loadMaskDiv').append(response.status+"*************"+response.statusText);
	});
	return false;
	
}
function addGeoCityFormHtml(response){
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var html = "";
	html+=	'<form id="addGeoCityForm">';
	html += '<h4>Add City</h4><hr>';
	*//** ***********************************Sucess Div******************************************************** *//*
	html += '<div class="alert alert-success" style="display: none;"	id="addGeoCitySuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> City Added Successfully</strong>';
	html += '</div>';
	*//** ****************************************Error Div**************************************************** *//*
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addGeoCityErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	*//** ************************************Country Name***************************************************** *//*
	if(geoCountryMasterList.length>0){
		html += '<div class="form-group">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="geoCountryId" style="width: 50%">';
		for(var i=0;i<geoCountryMasterList.length;i++){
			var id = geoCountryMasterList[i].id;
			var countryName = geoCountryMasterList[i].geoCountryName;
			html+=	'<option value='+id+'>'+countryName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled"><option>No Countries Found</option></select>';
		html += '</div>';
	}
	
	*//** ************************************City Name***************************************************** *//*
	html += '<div class="form-group" id="Add-geoCityName-Error">';
	html += '<label>City Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoCityName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="geoCityName" placeholder="Enter City Name" maxlength="50">';
	html += '</div>';
	*//** ************************************Button***************************************************** *//*
	if(geoCountryMasterList.length>0){
		html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeoCity()">';
	}else{
		html += '<input type="button" class="btn btn-primary" value="Add" disabled="disabled">';
	}
	html += '</form>';
	return html;
}

function saveGeoCity(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#loadMaskDiv').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addGeoCitySuccessDiv').hide();
	$('#addGeoCityErrorDiv').hide();
	var geoCountryId = $('#geoCountryId option:selected').val();
	var geoCityName = $.trim($('#geoCityName').val());
	var JSONObject = {};
	JSONObject['geoCityName'] = geoCityName;
	JSONObject['geoCountryId'] = geoCountryId;
	$.post(geoCityUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addGeoCitySuccessDiv').show(600);
			$('#addGeoCityForm').trigger("reset");
			$('#loadMaskDiv').unmask();
		}else if(response.status=="SAVE_ERROR"){
			$('#addGeoCityErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#loadMaskDiv').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#loadMaskDiv').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
*//**************************************************************************************************************************
 *                    Edit Geo City		                                                                              *
 **************************************************************************************************************************//*
function editGeoCity(id){
	$('#loadMaskDiv').mask('Loading...');
	var geoCityDataDiv = $('#geoCityDataDiv');
	geoCityDataDiv.html('');
	$.get(geoCityUrl+"edit.htm?id="+id,function(response){
		var html = geoCityEditFormHtml(response);
		geoCityDataDiv.append(html);
		$('#loadMaskDiv').unmask();
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function geoCityEditFormHtml(response){
	console.log(response);
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var geoCityMaster = response.successObject.geoCityMaster;
	var html = "";
	html += '<form id="editGeoCityForm">';
	html +=	'<h4>Edit City</h4>';
	*//** ***********************************Sucess Div******************************************************** *//*
	html += '<div class="alert alert-success" style="display: none;"	id="editGeoCitySuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> City Updated Successfully</strong>';
	html += '</div>';
	*//** ****************************************Error Div**************************************************** *//*
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editGeoCityErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	*//** ************************************Country Name***************************************************** *//*
	html += '<div class="form-group">';
	html += '<label>Country Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control" id="editedGeoCountryId" style="width: 50%" disabled="disabled">';
	for(var i=0;i<geoCountryMasterList.length;i++){
		var id = geoCountryMasterList[i].id;
		if(id==geoCityMaster.geoCountryId){
			var countryName = geoCountryMasterList[i].geoCountryName;
			html+=	'<option value='+id+'>'+countryName+'</option>';
		}
	}
	html +=	'</select>';
	html += '</div>';
	*//** ************************************City Name***************************************************** *//*
	html += '<div class="form-group" id="Edit-geoCityName-Error">';
	html += '<label>City Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoCityName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+geoCityMaster.geoCityName+'" class="form-control" id="editedGeoCityName" placeholder="Enter City Name" maxlength="50">';
	html += '</div>';	
	*//** ************************************Button***************************************************** *//*
	html += '<input type="button" class="btn btn-default" value="Update" onclick ="updateGeoCity('+geoCityMaster.id+')">';
	html +=	'</form>';
	return html;
}
function updateGeoCity(id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#loadMaskDiv').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editGeoCitySuccessDiv').hide();
	$('#editGeoCityErrorDiv').hide();
	var editedGeoCountryId = $('#editedGeoCountryId option:selected').val();
	var editedGeoCityName = $.trim($('#editedGeoCityName').val());
	var JSONObject = {};
	JSONObject['geoCountryId'] = editedGeoCountryId;
	JSONObject['geoCityName'] = editedGeoCityName;
	JSONObject['id'] = id;
	$.post(geoCityUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editGeoCitySuccessDiv').show(600);
			$('#loadMaskDiv').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			$('#editGeoCityErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#loadMaskDiv').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#loadMaskDiv').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
*//**************************************************************************************************************************
 *                    Delete Geo Cities	                                                                              *
 **************************************************************************************************************************//*
function deleteGeoCities(){
	$.ajaxSetup({ cache: false });
	selectedGeoCityCheckBoxLength();
	if(selectedGeoCityIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#loadMaskDiv').mask('Loading...');
			$('#deleteGeoCitiesSuccessDiv').hide();
			$('#deleteGeoCitiesErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:geoCityUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedGeoCityIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#geoCityMasterTabButtons').hide();
						var html = listGeoCitiesHtml(response);
						$('#geoCityDataDiv').html(html);
						$('#deleteGeoCitiesSuccessDiv').show(600);
						//$('#geoCityMasterTabButtons').show();
						$('#geoCityListTable').dataTable();
						$('#loadMaskDiv').unmask();
						selectedGeoCityIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteGeoCitiesErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteGeoCitiesErrorDiv').append(errorMessage);
						$('#deleteGeoCitiesErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedGeoCityIds = [];
						$('#loadMaskDiv').unmask();
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		alert("Please select a record");
		return false;
	}
}
*//********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************//* 
//Check All Check Box
$(document).on('click',"#checkAllGeoCityCheckBox",function(){
    $('.geoCityCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".geoCityCheckBox",function(){
    if($('.geoCityCheckBox:checked').length == $('.geoCityCheckBox').length) {
      $('#checkAllGeoCityCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllGeoCityCheckBox').prop('checked', false);
    }
});

function selectedGeoCityCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.geoCityCheckBox:checked').length) {
		selectedGeoCityIds = [];
		$('.geoCityCheckBox:checked').each(function() {
			selectedGeoCityIds.push($(this).val());
		});
	}
	return false;
}
*/


function sourceKpiList(){
	 $.ajax({
			type:"GET",
			url:"../sourceMaster/listTab.htm",
			contentType:"application/json",
			success:function(response){
				sourceMasterList=response.successObject.sourceMasterList;
				/*
				var	htmlText='<div id="sourceKpiDataDiv">';
				htmlText+='<form id="sourceKpiListForm">';
				htmlText+='<select class="form-control">';
							for(var i=0;i<sourceMasterList.length;i++){
								
								htmlText+='<option value="'+sourceMasterList[i].id+'">'+sourceMasterList[i].sourceName+'</option>';
								
							}
							htmlText=+'</select>';
							htmlText=+'</form>';
							htmlText=+'</div>';
				
				$("#sourceKpiMappingTab").html(htmlText);*/
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});
}