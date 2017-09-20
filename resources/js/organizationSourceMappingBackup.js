var count=0;
$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});
var organizationSourceMappingUrl = "../organizationSourceMapping/";

//*****organization Source Mapping Variables***************//
var organizationSourceMappingDataDiv = $('#organizationSourceMappingDataDiv');
var organizationSourceMappingTableId = $('#organizationSourceMappingTableId');
var selectedOrganizationSourceMappingIds = [];


/**************************************************************************************************************************
 *                     List Organization Source Mapping                                                                         *
 **************************************************************************************************************************/
function organizationSourceMappingList(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	organizationSourceMappingDataDiv.html('');
	$.get(organizationSourceMappingUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = listOrganizationSourceMappingHtml(response);
			organizationSourceMappingDataDiv.append(html);
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
	var html = "";
	html += '<form id="organizationSourceMappingListForm">';
	
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteOrganizationSourceMappingSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;organizationSourceMapping Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationSourceMappingErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='organizationSourceMappingListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllOrganizationSourceMappingCheckBox" style="margin-left: -7px;"></th>';
	html +=	"<th>Organization Scraping Name</th>";
	html +=	"<th>Source Name</th>";
	html +=	"<th>Organization Full Name</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<organizationSourceMappingMasterList.length;i++){
		var id = organizationSourceMappingMasterList[i].id;
		var OrganizationScrapingName = organizationSourceMappingMasterList[i].organizationScrapingName;
		var SourceName = organizationSourceMappingMasterList[i].sourceName;
		var OrganizationFullName = organizationSourceMappingMasterList[i].organizationFullName;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" value='+id+'></td>';
		html+=	'<td>'+OrganizationScrapingName+'</td>';
		html+=	'<td>'+SourceName+'</td>';
		html+=	'<td>'+OrganizationFullName+'</td>';
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
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$.get(organizationSourceMappingUrl + "add.htm", function(response) {
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
	var sourceNameList = response.successObject.sourceNameList;
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
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
		html+=	'<option value="0">----SELECT----</option>';
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
		html += '<div class="form-group">';
		html += '<label>Source Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm" id="sourceNameId" onchange="onChangeSourceName('+count+')">';
		html+=	'<option value="0">----SELECT----</option>';
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
	

	/** ************************************organization Scraping Name ***************************************************** */
	html += '<div class="form-group" id="Add-organizationScrapingName-Error">';
	html += '<label>Organization Scraping Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="organizationScrapingName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationScrapingName" placeholder="Enter Organization Scraping Name" maxlength="150">';
	html += '</div>';
	
	html += '<div id="sourceNameClerDiv">';
	
	html += '<input type="button" class="btn btn-primary" value="Add" disabled="disabled">';
	/** ************************************Api Key***************************************************** */
	/*html += '<div class="form-group" id="Add-ApiKey-Error">';
	html += '<label>Api Key</label>';
	html += '<span style="color: #a94442" id="apiKey-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="apiKey" placeholder="Enter Api Key" maxlength="50">';
	html += '</div>';*/
	/** ************************************Secret Key***************************************************** */
	/*html += '<div class="form-group" id="Add-SecretKey-Error">';
	html += '<label>Secret Key</label>';
	html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="secretKey" placeholder="Enter Secret Key" maxlength="50">';
	html += '</div>';*/
	
	
	/** ************************************Button***************************************************** */
	
	/*var selectedOrganizationIdValue=$('#organizationFullNameId').val();
	var selectedSourceIdValue=$('#sourceNameId').val();
	
	if(organizationNameList.length>0 && selectedOrganizationIdValue==0 && selectedSourceIdValue==0){
		html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrganizationSourceMapping()">';
	}else{
		html += '<input type="button" class="btn btn-primary" value="Add" disabled="disabled">';
	}
	html+=	appendCancelButton(getDivId("OrganizationSourceMapping"));
	html +='</div>';
	html += '</form>';*/
	return html;
}


/*******onChange Source Name Method ***************************************************************************/
 function onChangeSourceName(countValue){
	var selectedOrganizationIdValues=$('#organizationFullNameId').val();
	var selectedSourceIdValues=$("#sourceNameId"+countValue).val(); 
	if(selectedOrganizationIdValues!=0 && selectedSourceIdValues!=0){
		selectedSourceIdName=$('#sourceNameId').text();alert(selectedSourceIdName);
		var html='';
		$('#sourceNameClerDiv').html('');
		if(selectedSourceIdName=="Facebook"){
		/** ************************************Api Key***************************************************** */
		html += '<div class="form-group" id="Add-ApiKey-Error">';
		html += '<label>API Key</label>';
		html += '<span style="color: #a94442" id="apiKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="apiKey" placeholder="Enter Api Key" maxlength="50">';
		html += '</div>';
		/** ************************************Secret Key***************************************************** */
		html += '<div class="form-group" id="Add-SecretKey-Error">';
		html += '<label>Secret Key</label>';
		html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control input-sm" id="secretKey" placeholder="Enter Secret Key" maxlength="50">';
		html += '</div>';
		
		
		/** ************************************Button***************************************************** */
		
		var selectedOrganizationIdValue=$('#organizationFullNameId').val();
		var selectedSourceIdValue=$('#sourceNameId').val();
		
		if( selectedOrganizationIdValue==0 && selectedSourceIdValue==0){
			html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrganizationSourceMapping()">';
		}else{
			html += '<input type="button" class="btn btn-primary" value="Add" disabled="disabled">';
		}
		html +='</div>';
		html += '</form>';
		$('#sourceNameClerDiv').append(html).show(600);
		}else if(selectedSourceIdName=="Twitter"){
			/** ************************************Api Key***************************************************** */
			html += '<div class="form-group" id="Add-ApiKey-Error">';
			html += '<label>Token Key</label>';
			html += '<span style="color: #a94442" id="apiKey-span-Error" class="help-inline"></span>';
			html += '<input	type="text" class="form-control input-sm" id="apiKey" placeholder="Enter Api Key" maxlength="50">';
			html += '</div>';
			/** ************************************Secret Key***************************************************** */
			html += '<div class="form-group" id="Add-SecretKey-Error">';
			html += '<label>Token Access Key</label>';
			html += '<span style="color: #a94442" id="secretKey-span-Error" class="help-inline"></span>';
			html += '<input	type="text" class="form-control input-sm" id="secretKey" placeholder="Enter Secret Key" maxlength="50">';
			html += '</div>';
			
			
			/** ************************************Button***************************************************** */
			
			var selectedOrganizationIdValue=$('#organizationFullNameId').val();
			var selectedSourceIdValue=$('#sourceNameId').val();
			
			if( selectedOrganizationIdValue==0 && selectedSourceIdValue==0){
				html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrganizationSourceMapping()">';
			}else{
				html += '<input type="button" class="btn btn-primary" value="Add" disabled="disabled">';
			}
			html +='</div>';
			html += '</form>';
			$('#sourceNameClerDiv').append(html).show(600);
		}
	}else{
		alert("select organization name");
	}
	 
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
	var apiKey = $.trim($('#apiKey').val());
	var secretKey = $.trim($('#secretKey').val());
	var organizationScrapingName = $.trim($('#organizationScrapingName').val());
	var JSONObject = {};
	JSONObject['organizationId'] = organizationId;
	JSONObject['sourceId'] = sourceId;
	JSONObject['apiKey'] = apiKey;
	JSONObject['secretKey'] = secretKey;
	JSONObject['organizationScrapingName'] = organizationScrapingName;

	$.post(organizationSourceMappingUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addOrganizationSourceMappingSuccessDiv').show(600);
			organizationSourceMappingList();
			$('#page-wrapper').unmask();
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
}

/**************************************************************************************************************************
 *                    Edit Organization SOurce Mapping		                                                                              *
 **************************************************************************************************************************/

function organizationSourceMappingEditFormHtml(response,id){
	var organizationFullNameList = response.successObject.organizationFullNameList;
	var sourceNameList = response.successObject.sourceNameList;
	var organizationScrapingNameList = response.successObject.organizationSourceMappingList;
	
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html +=	'<h4>Edit organization Source Mapping</h4>';
	html+=	'</div>';
	html += '<form class="col-sm-5" id="editOrganizationSourceMappingForm">';
	/** ***********************************Sucess Div******************************************************** *//*
	html += '<div class="alert alert-success" style="display: none;"	id="editOrganizationSourceMappingSuccessDiv">';
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
	for(var i=0;i<organizationFullNameList.length;i++){
		var organizationFullName = organizationFullNameList[i].organizationFullName;
		var organizationId =  organizationFullNameList[i].organizationId;
		var organizationSelectedId=organizationFullNameList[i].id;
		if(id==organizationSelectedId){
			html+=	'<option value='+organizationId+'>'+organizationFullName+'</option>';
			break;
		}	
	}
	html +=	'</select>';
	html += '</div>';
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control input-sm" id="editedSourceNameId" disabled="disabled">';
	for(var i=0;i<sourceNameList.length;i++){
		var sourceName = sourceNameList[i].sourceName;
		var sourceId = sourceNameList[i].sourceId;
		var sourceSelectedId=sourceNameList[i].id;
		if(id==sourceSelectedId){
			html+=	'<option value='+sourceId+'>'+sourceName+'</option>';
			break;
		}
	}
	html +=	'</select>';
	html += '</div>';
	/** ************************************Organization Scraping Name***************************************************** */
	html += '<div class="form-group" id="Edit-organizationScrapingName-Error">';
	html += '<label>Organization Scraping Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-organizationScrapingName-span-Error" class="help-inline"></span>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationScrapingName = organizationScrapingNameList[i].organizationScrapingName;
		var id = organizationScrapingNameList[i].id;
	html += '<input	type="text" value="'+organizationScrapingName+'" class="form-control input-sm" id="editedOrganizationScrapingName" placeholder="Enter organization Scraping Name" maxlength="150">';
	html += '<input	type="hidden" value="'+id+'" class="form-control input-sm" id="hiddenId">';
	
	}
	html += '</div>';	
	
	/** ************************************ Api Key***************************************************** */
	html += '<div class="form-group" id="Edit-apiKey-Error">';
	html += '<label>Api Key</label>';
	html += '<span style="color: #a94442" id="edit-apiKey-span-Error" class="help-inline"></span>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationApiKey = organizationScrapingNameList[i].apiKey;
	html += '<input	type="text" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Api key" maxlength="50">';
	}
	html += '</div>';	
	
	/** ************************************ Secret Key***************************************************** */
	html += '<div class="form-group" id="Edit-secretKey-Error">';
	html += '<label>Secret Key</label>';
	html += '<span style="color: #a94442" id="edit-secretKey-span-Error" class="help-inline"></span>';
	for(var i=0;i<organizationScrapingNameList.length;i++){
		var organizationSecretKey = organizationScrapingNameList[i].secretKey;
	html += '<input	type="text" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Secret Key" maxlength="50">';
	}
	html += '</div>';	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganizationSourceMapping('+organizationScrapingNameList.id+')">';
	html+=	appendCancelButton(getDivId("OrganizationSourceMapping"));
	html +=	'</form>';
	return html;
}

function updateOrganizationSourceMapping(id){	
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("OrganizationSourceMapping"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editOrganizationSourceMappingSuccessDiv').hide();
	$('#editOrganizationSourceMappingErrorDiv').hide();
	var ids = $.trim($('#hiddenId').val());
	var editedOrganizationScrapingName = $.trim($('#editedOrganizationScrapingName').val());
	var editOrganizationNameId = $('#editOrganizationName').val();
	var editedSourceNameId = $('#editedSourceNameId').val();
	var editedApiKey = $('#editedApiKey').val();
	var editedSecretKey = $('#editedSecretKey').val();
	var JSONObject = {};
	JSONObject['organizationId'] = editOrganizationNameId;
	JSONObject['sourceId'] = editedSourceNameId;
	JSONObject['organizationScrapingName'] = editedOrganizationScrapingName;
	JSONObject['apiKey'] = editedApiKey;
	JSONObject['secretKey'] = editedSecretKey;
	JSONObject['id'] = ids;
	$.post(organizationSourceMappingUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editOrganizationSourceMappingSuccessDiv').show(600);
			organizationSourceMappingList();
			$('#page-wrapper').unmask();
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
		alert("Please select a record");
		return false;
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