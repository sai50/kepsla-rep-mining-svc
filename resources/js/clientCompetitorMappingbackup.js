$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});
var clientCompetitorMappingUrl = "../clientCompetitorMapping/";

//*****client Competitor Mapping Variables***************//
var clientCompetitorMappingDataDiv = $('#clientCompetitorMappingDataDiv');
var clientCompetitorMappingTableId = $('#clientCompetitorMappingTableId');
var selectedClientCompetitorMappingIds = [];


/**************************************************************************************************************************
 *                     List CLient Competitor Mapping                                                                         *
 **************************************************************************************************************************/
function clientCompetitorMappingList(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	clientCompetitorMappingDataDiv.html('');
	$('#clientCompetitorMappingDataDiv').html('');
	$.get(clientCompetitorMappingUrl+"listTab.htm",function(response){
		console.log(response);
		if(response.status=="LIST_SUCCESS"){
			var html = listClientCompetitorMappingHtml(response);
			console.log(response);
			clientCompetitorMappingDataDiv.append(html);
			$('#clientCompetitorMappingListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#clientCompetitorMappingDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	},'json').fail(function(response){
		clientCompetitorMappingDataDiv.mask(response.status+"**********"+response.statusText);
	});
	return false;
}
function listClientCompetitorMappingHtml(response) {
	var clientCompetitorMappingMasterList = response.successObject.listClientCompetitorMapping;
	var html = "";
	html += '<form id="clientCompetitorMappingListForm">';
	
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteClientCompetitorMappingSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong> organizationSourceMapping Deleted Successfully</strong></div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteClientCompetitorMappingErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='clientCompetitorMappingListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllClientCompetitorMappingCheckBox"></th>';
	html +=	"<th>Client</th>";
	html +=	"<th>Competitor</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<clientCompetitorMappingMasterList.length;i++){
		var clientId = clientCompetitorMappingMasterList[i].clientId;
		var clientName = clientCompetitorMappingMasterList[i].clientName;
		var competitorName =  clientCompetitorMappingMasterList[i].competitorName;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" value='+clientId+'></td>';
		if(competitorName=="" || competitorName==null){
			html+=	'<td>'+clientName+'</td>';
			html+=	'<td>'+competitorName+'</td>';
		}else{
			html+=	'<td>'+clientName+'</td>';
			html+=	'<td>'+competitorName+'</td>';
		}
		html+='<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editClientCompetitorMapping('+clientId+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+='</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("ClientCompetitorMapping");
	return html;
}
/**************************************************************************************************************************
 *                      Add Client Source Mapping                                                                             *
 **************************************************************************************************************************/
function addClientCompetitorMapping(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$.get(clientCompetitorMappingUrl + "add.htm", function(response) {console.log(response);
		var html = addClientCompetitorMappingFormHtml(response);
		var divId = $('#'+getDivId("ClientCompetitorMapping"));
		appendClientCompetitorMappingAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"*************"+response.statusText);
	});
	return false;
}
var listForUpdatingClients = [];
function addClientCompetitorMappingFormHtml(response){
	var competitorNameList = response.successObject.competitorNameList;
	var clientNameList = response.successObject.clientNameList;
	listForUpdatingClients = competitorNameList;
	var selectedClientId = 0;
	if(clientNameList.length>0){
		selectedClientId = clientNameList[0].clientId;
	}
	//var clientId = response.successObject.clientId;console.log(clientId);
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html +=	'<h4>Add Client Competitor Mapping</h4>';
	html+=	'</div>';
	html += '<form id="addClientCompetitorMappingForm">';
	
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;"	id="addClientCompetitorMappingSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Client Competitor Mapping Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addClientCompetitorMappingErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label><strong>Client Name<font style="color: red">*</font></strong></label>';
	html +=	'<select class="form-control input-sm" id="addClientName" style="width: 50%" onchange="updateCompetitors()" >';
	
	for(var i=0;i<clientNameList.length;i++){
		var clientName = clientNameList[i].organizationFullName;
		var id = clientNameList[i].clientId;
		//if(clientId.id==id){
			html+=	'<option value='+id+'>'+clientName+'</option>';
	}
	//}
	html +=	'</select>';
	html += '</div>';
	
	
	/** ************************************Competitor Name***************************************************** */
	html += '<div class="form-group" id="Add-comperitor-Error">';
	html += '<label><strong>Competitor Name</strong></label>';
	html +='<table id="clientsTable">';
	for(var i=0;i<competitorNameList.length;i++){
		var organizationFullName = competitorNameList[i].organizationFullName;
		var id  = competitorNameList[i].id;
		if(selectedClientId!=id){
			html +='<tr>';
			html+=	'<td><input type="checkBox" class="addOrganizationSourceMappingCheckBox" value='+id+'></td>';
			html +='<td>'+organizationFullName+'</td>';
			html +='</tr>';
		}
	}
	html +='</table>';
    html += '</div>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Save" onclick ="saveOrganizationSourceMapping()">';
	html+=	appendCancelButton(getDivId("ClientCompetitorMapping"));
	html +=	'</form>';
	return html;
}
function updateCompetitors(){
	var competitorNameList = listForUpdatingClients;
	var selectedClientId = $('#addClientName option:selected').val();
	$('#clientsTable').html('');
	var html = "";
	for(var i=0;i<competitorNameList.length;i++){
		var organizationFullName = competitorNameList[i].organizationFullName;
		var id  = competitorNameList[i].id;
		if(id!=selectedClientId){
			html +='<tr>';
			html+=	'<td><input type="checkBox" class="addOrganizationSourceMappingCheckBox" value='+id+'></td>';
			html +='<td>'+organizationFullName+'</td>';
			html +='</tr>';
		}
		
	}
	$('#clientsTable').append(html);
	return false;
}

function saveOrganizationSourceMapping(){
	 $.ajaxSetup({ cache: false });
	 var divId = getDivId("ClientCompetitorMapping");
	 selectedClientCompetitorMappingCheckBoxLength();
	 var clientId=$('#addClientName').val();
		var competitorIds=selectedIds('addOrganizationSourceMappingCheckBox');	
		var JSONObject = {'clientId':clientId,'competitorIds':competitorIds};
		console.log(JSONObject);
		
	if(competitorIds.length>0){
			$('#page-wrapper').mask('Loading...');
			$('#addClientCompetitorSuccessDiv').hide();
			$('#addClientCompetitorErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:clientCompetitorMappingUrl+"save.htm",
				contentType:"application/json",
				data:JSON.stringify(JSONObject),
				success:function(response){console.log(response);
					if(response.status=="SAVE_SUCCESS"){
						/*$('#addClientCompetitorMappingSuccessDiv').show(600);
						$('#clientCompetitorTabButtons').show();
						$('#clientCompetitorListTable').dataTable();
						$('#page-wrapper').unmask();*/
						$('#addClientCompetitorMappingSuccessDiv').show(600);
						clientCompetitorMappingList();
						listForUpdatingClients = [];
					}else if(response.status=="SAVE_ERROR"){
						scrollDown(divId);
						$('#addClientCompetitorErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#addClientCompetitorErrorDiv').append(errorMessage);
						$('#addClientCompetitorErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedClientCompetitorIds = [];
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}else{
		alert("Please select a record");
		return false;
	}	
}
/**************************************************************************************************************************
 *                    Edit Client Competitor Mapping	                                                                              *
 **************************************************************************************************************************/
function editClientCompetitorMapping(id){
	$('#page-wrapper').mask('Loading...');
	$.get(clientCompetitorMappingUrl+"edit.htm?id="+id,function(response){
		var html = clientCompetitorMappingEditFormHtml(response);
		var divId = $('#'+getDivId("ClientCompetitorMapping"));
		appendClientCompetitorMappingAddOrEditForm(divId, html);
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function clientCompetitorMappingEditFormHtml(response){
	var selectedClientIds = [];
	var competitorNameList = response.successObject.competitorNameList;
	var clientNameList = response.successObject.clientNameList;
	var clientId = response.successObject.clientId;
	
	var listOfSelectedIds = response.successObject.listAllSelectedIds;
	
	for(var i=0;i<listOfSelectedIds.length;i++){
		var selectedClientId = listOfSelectedIds[i].competitor;
		selectedClientIds.push(selectedClientId);
	}
	console.log(selectedClientIds);
	
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html +=	'<h4>Edit Client Competitor Mapping</h4>';
	html+=	'</div>';
	html += '<form id="editClientCompetitorMappingForm">';
	
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;"	id="editClientCompetitorMappingSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Client Competitor Mapping Updated Successfully</strong>';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editClientCompetitorMappingErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label><strong>Client Name<font style="color: red">*</font></strong></label>';
	html +=	'<select class="form-control input-sm" disabled="disabled" id="editedClientName" style="width: 50%" >';
	
	for(var i=0;i<clientNameList.length;i++){
		var clientName = clientNameList[i].clientName;
		var id = clientNameList[i].clientId;
		if(clientId.id==id){
			html+=	'<option value='+id+'>'+clientName+'</option>';
	}}
	html +=	'</select>';
	html += '</div>';
	
	
	/** ************************************Competitor Name***************************************************** */
	html += '<div class="form-group" id="Add-comperitor-Error">';
	html += '<label><strong>Competitor Name<strong></label>';
	html +='<table>';
	for(var i=0;i<competitorNameList.length;i++){
		var organizationFullName = competitorNameList[i].organizationFullName;
		var id  = competitorNameList[i].id;
		html +='<tr>';
		if(selectedClientIds.indexOf(id)>-1){
			html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" checked="checked" value='+id+'></td>';
		}else{
			html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" value='+id+'></td>';
		}
		html +='<td>'+organizationFullName+'</td>';
		html +='</tr>';
	}
	
	html +='</table>';
    html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganizationSourceMapping()">';
	html +=	appendCancelButton(getDivId("ClientCompetitorMapping"));
	html +=	'</form>';
	return html;
}


function updateOrganizationSourceMapping(){
		 $.ajaxSetup({ cache: false });
		 var divId = $('#'+getDivId("ClientCompetitorMapping"));
		 selectedClientCompetitorMappingCheckBoxLength();
		 var id=$('#editedClientName').val();
			var ids=selectedIds('organizationSourceMappingCheckBox');
			var JSONObject = {'clientId':id,'competitorIds':ids};
		if(ids.length>0){
				$('#page-wrapper').mask('Loading...');
				$('#deleteClientCompetitorSuccessDiv').hide();
				$('#deleteClientCompetitorErrorDiv').hide();
				$.ajax({
					type:"POST",
					url:clientCompetitorMappingUrl+"update.htm",
					contentType:"application/json",
					data:JSON.stringify(JSONObject),
					success:function(response){console.log(response);
						if(response.status=="UPDATE_SUCCESS"){
							$('#editClientCompetitorMappingSuccessDiv').show(600);
							clientCompetitorMappingList();
						}else if(response.status=="DELETE_ERROR"){
							scrollDown(divId);
							$('#deleteClientCompetitorErrorDiv').html('');
							var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
							$('#editClientCompetitorMappingErrorDiv').append(errorMessage);
							$('#editClientCompetitorMappingErrorDiv').show(600);
							$('input:checkbox').removeAttr('checked');
							selectedClientCompetitorIds = [];
							$('#page-wrapper').unmask();
						}
					},error:function(response){
						$('#page-wrapper').mask(response.status+"*********"+response.statusText);
					}
				});
				return false;
		}else{
			alert("Please select a Competitor");
			return false;
		}
		
	}

/**************************************************************************************************************************
 *                     Delete client Competitor Mapping  Master                                                                        *
 **************************************************************************************************************************/
function deleteClientCompetitorMapping(){
	 $.ajaxSetup({ cache: false });
	selectedClientCompetitorMappingCheckBoxLength();
	if(selectedClientCompetitorMappingIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteClientCompetitorMappingSuccessDiv').hide();
			$('#deleteClientCompetitorMappingErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:clientCompetitorMappingUrl+"delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedClientCompetitorMappingIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#clientCompetitorMappingTabButtons').hide();
						var html = listClientCompetitorMappingHtml(response);
						clientCompetitorMappingDataDiv.html(html);
						$('#deleteClientCompetitorMappingSuccessDiv').show(600);
						$('#clientCompetitorMappingTabButtons').show();
						$('#clientCompetitorMappingListTable').dataTable();
						$('#page-wrapper').unmask();
						selectedClientCompetitorMappingIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteClientCompetitorMappingErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteClientCompetitorMappingErrorDiv').append(errorMessage);
						$('#deleteClientCompetitorMappingErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedClientCompetitorMappingIds = [];
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		alert("Please select a Competitor");
		return false;
	}
	
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllClientCompetitorMappingCheckBox",function(){
    $('.clientCompetitorMappingCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".clientCompetitorMappingCheckBox",function(){
    if($('.clientCompetitorMappingCheckBox:checked').length == $('.clientCompetitorMappingCheckBox').length) {
      $('#checkAllClientCompetitorMappingCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllClientCompetitorMappingCheckBox').prop('checked', false);
    }
});

function selectedClientCompetitorMappingCheckBoxLength() {
	if ($('.clientCompetitorMappingCheckBox:checked').length) {
		selectedGeoCountryIds = [];
		$('.clientCompetitorCheckBox:checked').each(function() {
			selectedClientCompetitorMappingIds.push($(this).val());
		});
	}
	return false;
}



function appendClientCompetitorMappingAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearClientCompetitorMappingMessageDiv();
	maskId.unmask();
}
function clearClientCompetitorMappingMessageDiv(){
	$('#addClientCompetitorMappingSuccessDiv,#editClientCompetitorMappingSuccessDiv,#editClientCompetitorMappingSuccessDiv,#deleteClientCompetitorMappingSuccessDiv,#deleteClientCompetitorMappingErrorDiv').hide(600);
}