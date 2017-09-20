var mozendaMappingUrl = "../mozenda/";
var $addAndEditAgentDiv = $("#addAndEditAgentDiv");
var selectedAgentMasterCheckBoxArray = [];
/***************************************************************************************************************************
 * ********************************General KPI******************************************************************************
 * *************************************************************************************************************************/
function listMozendaTab(){
	clearAllSuccessDivs();
	listAgent();
}

function listAgent(){
	var selectedSourceId=$('#selectSourceNameId option:selected').val();
	$('#loadMaskDiv').mask('Loading...');
	$('#mozendaTabDiv').show();
	$('#addAndEditAgentDiv').hide();
	$('#updateAgentSuccessDiv').hide();
	$('#agentSourceTabButtons').hide();
	$('#addAgentSourceSuccessDiv,editAgentSourceSuccessDiv').hide();
	$('#listAgentTab').html('');
	$.get("../mozenda/listAgentTab.htm?sourceId="+selectedSourceId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var tempHtml = listAgentResponse(response);
			$('#listAgentTab').append(tempHtml);
			$('#listAgentTable').dataTable();
			$('#loadMaskDiv').unmask();
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}	

function listAgentResponse(response){
	$('#listAgentTab').html('');
	var agentList = response.successObject.listAgentMaster;
	var tempHtml = "";
	tempHtml+=	'<div id="listAgentFormDiv">';
	tempHtml+=	'<form ="form" id="listAgentForm">';
	tempHtml+=	'<div class="alert alert-success" style="display:none;"id="saveAgentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Agent Data Saved Successfully</div>';
	tempHtml+=	'<div class="alert alert-success" style="display:none;"id="deleteAgentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Agent Data Deleted Successfully</div>';
	tempHtml+=	'<div class="alert alert-success" style="display:none;"id="updateAgentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Agent Data Updated Successfully</div>';
	tempHtml+=	"<table class='table table-striped dataTable no-footer' id='listAgentTable'>";
	tempHtml+=		'<thead>';
	tempHtml+=			'<tr>';
	tempHtml+=				'<th><input type="checkbox" id="checkAllAgentCheckBox" style="margin-left: 0px;"></th>';
	tempHtml+=				'<th>Agent Name</th>';
	tempHtml+=				'<th>Mozenda Id</th>';
	tempHtml+=				'<th>Source Name</th>';
	tempHtml+=				'<th>Collection Id</th>';
	tempHtml+=				'<th>Frequency</th>';
	tempHtml+=				'<th>Agent Organization Mapping</th>';
	tempHtml+=				'<th>Mozenda Data Loading</th>';
	tempHtml+=				'<th>Test</th>';
	tempHtml+=				'<th></th>';
	tempHtml+=			'</tr>';
	tempHtml+=		'</thead>';
	tempHtml+=		'<tbody>';
	for(var i=0;i<agentList.length;i++){
		tempHtml+=		'<tr>';
		tempHtml+=			'<td><input type="checkbox" class="AgentCheckBox" value="'+agentList[i].id+'"></td>';
		tempHtml+=			'<td>'+agentList[i].agentName+'</td>';
		if(agentList[i].mozendaAgentId!=null){
		tempHtml+=			'<td>'+agentList[i].mozendaAgentId+'</td>';
		}else{
		tempHtml+=			'<td></td>';
		}
		tempHtml+=			'<td>'+agentList[i].sourceName+'</td>';
		if(agentList[i].collectionId!=null){
		tempHtml+=			'<td>'+agentList[i].collectionId+'</td>';
		}else{
			tempHtml+=			'<td></td>';
		}
		if(agentList[i].frequency!=null){
		tempHtml+=			'<td>'+agentList[i].frequency+'</td>';
		}else{
			tempHtml+=			'<td></td>';
		}
		tempHtml+=			'<td><button type="button" class="btn btn-success" onclick=redirectView("../mozenda/listAgentOrganizationMappingTab.htm?agentId='+agentList[i].id+'")> Agent Organization Mapping</button></td>';	
		tempHtml+=			'<td><button type="button" class="btn btn-success" onclick=redirectView("../mozenda/mozendaDataLoading.htm")> Mozenda Data Loading</button></td>';	
		tempHtml+=          '<td><span><button type="button" class="btn btn-xs AdminInList" title="Edit"   onclick="editAgentMaster('+agentList[i].id+')"><span class="glyphicon glyphicon-pencil"></span></button></span></span></td>';
		tempHtml+=          '<td><button type="button" class="btn btn-success" onclick="testSchedularMethod('+agentList[i].mozendaAgentId+','+agentList[i].collectionId+','+agentList[i].id+')" id="test'+agentList[i].id+'"> Test</button></td>';
		tempHtml+=		'</tr>';
	}
	tempHtml+=		'</tbody>';
	tempHtml+=	'</table>';
	tempHtml+=	'</form>';
	tempHtml+=	'<div id="addAndEditAgentDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>';
	tempHtml+=	'</div>';
	return tempHtml;
	
}

function testSchedularMethod(mozendaAgentId,collectionID,id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	//$('#page-wrapper').mask('Loading...');
	$('#test'+id).prop('disabled', true);
	$('#test'+id).html('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addCountrySuccessDiv').hide();
	$('#addCountryErrorDiv').hide();
	var id=id;
	var mozendaId=mozendaAgentId;
	var collectionId=collectionID;
	var JSONObject = {'id':id,'mozendaAgentId':mozendaId,'collectionId':collectionId};
	$.post(mozendaMappingUrl+"testAgentSchedular.htm",JSONObject,function(response){
		if(response.status=="SUCCESS"){
			$('#test'+id).prop('disabled', false);
			$('#test'+id).html('DONE');
			//$('#page-wrapper').unmask();
			//redirectView("../mozenda/mozendaDataLoading.htm");
		}else if(response.status=="ERROR"){
			$('#test'+id).prop('disabled', false);
			$('#test'+id).html('FAILED');
			//$('#page-wrapper').unmask();
			//redirectView("../mozenda/mozendaDataLoading.htm")
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#test'+id).html('FAILED');
			$('#test'+id).prop('disabled', false);
			//$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#test'+id).prop('disabled', false);
		//$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
	
}

function listAgentOrganizationMapping(id){
	$('#loadMaskDiv').mask('Loading...');
	$('#mozendaTabDiv').show();
	$('#agentSourceMappingTabButtons').hide();
	$('#addAgentOrganizationMappingSuccessDiv,editAgentOrganizationMappingSuccessDiv').hide();
	$('#listAgentTab').html('');
	$.get(mozendaMappingUrl+"listAgentOrganizationMappingTab.htm?agentId="+id,function(response){
		console.log(response);
		if(response.status=="LIST_SUCCESS"){
			var tempHtml = listAgentOrganizationMappingResponse(response);
			$('#listAgentOrganizationMappingTab').append(tempHtml);
			$('#listAgentOrganizationMappingTable').dataTable();
			$addAndEditAgentDiv.hide();
			$('#loadMaskDiv').unmask();
		}else{
			$('#loadMaskDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		alert(response.status);
		$('#loadMaskDiv').append(response.status+"*****************"+response.statusText);
	});
	return false;
}


function listAgentOrganizationMappingResponse(response){
	console.log(response);
	$('#listAgentTab').html('');
	var agentOrganizationMappingList = response.successObject.listAgentOrganizationMapping;
	var tempHtml = "";
	tempHtml+=	'<div id="listAgentOrganizationMappingFormDiv">';
	tempHtml+=	'<form ="form" id="listAgentOrganizationMappingForm">';
	tempHtml+=	'<div class="alert alert-success" style="display:none;"id="deleteAgentOrganizationMappingSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; KPI(s) Deleted Successfully</div>';
	tempHtml+=	"<table class='table table-striped dataTable no-footer' id='listAgentOrganizationMappingTable'>";
	tempHtml+=		'<thead>';
	tempHtml+=			'<tr>';
	tempHtml+=				'<th><input type="checkbox" id="checkAllAgentOrganizationMappingCheckBox" style="margin-left: 0px;"></th>';
	tempHtml+=				'<th>Agent Name</th>';
	tempHtml+=				'<th>Organization Name</th>';
	//tempHtml+=				'<th><span style="float: right;"><a href="#" id="deleteAllAgentButton"><img alt="" src="../resources/images/delete-icon.png"></a></span></th>';
	tempHtml+=			'</tr>';
	tempHtml+=		'</thead>';
	tempHtml+=		'<tbody>';
	for(var i=0;i<agentOrganizationMappingList.length;i++){
		tempHtml+=		'<tr>';
		tempHtml+=			'<td><input type="checkbox" class="AgentOrganizationMappingCheckBox" value="'+agentOrganizationMappingList[i].id+'"></td>';
		tempHtml+=			'<td>'+agentOrganizationMappingList[i].agentName+'</td>';
		tempHtml+=			'<td>'+agentOrganizationMappingList[i].organizationName+'</td>';
		//tempHtml+=			'<td><span style="float: right;"><a href="#"><img alt="" src="../resources/images/delete-icon.png"></a></span></td>';	
		tempHtml+=		'</tr>';
	}
	tempHtml+=		'</tbody>';
	tempHtml+=	'</table>';
	tempHtml+=	'</form>';
	tempHtml+=	'<div id="addAndEditAgentOrganizationMappingDiv" class="SubHeading" style="display: none;"></div>';
	tempHtml+=	'</div>';
	return tempHtml;
	
}

function sourceNameList(){
	$("#listAgentTab").html('');
	$("#selectSourceName").html('');
	$.ajax({
		type: "GET",
		url: "../mozenda/listSourceMaster.htm",
		dataType: "json",
		success: function(data){ 
			console.log(data);
			var response = data.successObject.listSourceMaster;
			var html="";
			html+='<label id="selectSourceName" class="control-label" style="width:355px" for="selectSourceName">Source Name :<select id="selectSourceNameId" class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			for(var i=0;i<response.length;i++){
			html+='<option value="'+response[i].id+'">'+$.trim(response[i].sourceName)+'</option>';
			}
			html+='</select>';
			html+='</label>';	
			
	$("#selectSourceName").append(html);
	$("#selectSourceName").show();
		}
	});
}

function selectedAgentMasterCheckBoxLength(){
	if($('.AgentCheckBox:checked').length){
		selectedAgentMasterCheckBoxArray = [];
		$('.AgentCheckBox:checked').each(function(){
			selectedAgentMasterCheckBoxArray.push($(this).val());
		});
	}
	return false;
}


function appendAgentMasterAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	maskId.unmask();
}

function deleteAgentMaster(){
	$('#addAndEditAgentDiv').hide();
	$('#deleteAgentSuccessDiv').hide();
	selectedAgentMasterCheckBoxLength();
	if(selectedAgentMasterCheckBoxArray.length>0){
		if(confirm("Are you sure you want to delete selected item(s)?")){
			$('#loadMaskDiv').mask('Loading...');
			$('#addAgentManagerSuccessDiv').hide(600);
			$.ajax({
				url:mozendaMappingUrl+"delete.htm",
				type:"POST",
				data:JSON.stringify(selectedAgentMasterCheckBoxArray),
				contentType:"application/json",
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						selectedAgentMasterCheckBoxArray = [];
						var html = listAgentResponse(response);
						$('#listAgentFormDiv').html('');
						$('#listAgentForm').html('');
						$('#listAgentTab').append(html);
						$('#listAgentTable').dataTable({ responsive: true});
						$('#deleteAgentSuccessDiv').show(600);
						$('#loadMaskDiv').unmask();
					}else{
						$('#loadMaskDiv').mask('<font>'+response.errorMessage+'</font>');
					}
				},error:function(response){
					$('#loadMaskDiv').response(response.status+"***************"+response.statusText);
					return false;
				}
				
			});
		}
	}else{
		alert("Please select atleast one item");
		
	}
	return false;
}

function addAgentMaster(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditAgentDiv');
	$.get(mozendaMappingUrl+"listSourceMaster.htm",function(response){
	var addMethod  = addAgentMasterForm(response);
	appendAgentMasterAddOrEditForm(divId,addMethod);//Method To Generate Add/Edit Form
	$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function addAgentMasterForm(response){
	console.log(response);
	var data = response.successObject.listSourceMaster;
	var html = "";
	html+=	addFormHeading("Add Agent Master");
	html+=	'<form class="col-sm-5" id="addAgentForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addAgentErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Agent Name***************************************************** */
	html += '<div class="form-group" id="Add-agentName-Error">';
	html += '<label>Priority<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="agentName-span-Error" class="help-inline"></span>';
	//html += '<input	type="text" class="form-control input-sm" id="addAgentName" placeholder="Enter Agent Name" maxlength="50">';
	html+='<select id="addAgentName" class="form-control input-sm"  style="width: 365px;">';
	html+='<option value="HIGH">HIGH</option>';
	html+='<option value="MEDIUM">MEDIUM</option>';
	html+='<option value="LOW">LOW</option>';
	html+='</select>';
	html += '</div>';
	/** ************************************Mozenda  ID***************************************************** */
	html += '<div class="form-group" id="Add-mozendaAgentId-Error">';
	html += '<label>Mozenda Agent Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="mozendaAgentId-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="addMozendaId" placeholder="Enter Mozenda Id" maxlength="50">';
	html += '</div>';
	
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group" id="Add-sourceName-Error">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="add-sourceName-span-Error" class="help-inline"></span>';
	html+='<select id="selectedSourceName" class="form-control input-sm"  style="width: 365px;">';
	for(var i=0;i<data.length;i++){
	html+='<option value='+data[i].id+'>'+$.trim(data[i].sourceName)+'</option>';
	}
	html+='</select>';
	html += '</div>';
	
	/** ************************************Collection  ID***************************************************** */
	html += '<div class="form-group" id="Add-collectionId-Error">';
	html += '<label>Collection Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="collectionId-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="addCollectionId" placeholder="Enter Collection Id" maxlength="50">';
	html += '</div>';
	
	/** ************************************Frequency***************************************************** */
	html += '<div class="form-group" id="Add-frequency-Error">';
	html += '<label>Frequency(In Days)</label>';
	html += '<span style="color: #a94442" id="add-frequency-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="addFrequency" placeholder="Enter Frequency" maxlength="50">';
	html += '</div>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Save" onclick ="saveAgentMaster()">';
	html+=	appendCancelButton(getDivId("Agent"),"page-wrapper");//Adding Cancel Button
	html+=	'</form>';
	return html;
}

function saveAgentMaster(){
	var addAndEditGeoCountryDiv = $('#addAndEditGeoCountryDiv');
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addCountrySuccessDiv').hide();
	$('#addCountryErrorDiv').hide();
	var agentName=$('#addAgentName').val();
	var sourceName=$('#selectedSourceName option:selected').text();
	agentName=sourceName+"-"+agentName+"-"+1;
	var sourceId=$('#selectedSourceName option:selected').val();
	var mozendaId=$('#addMozendaId').val();
	var collectionId=$('#addCollectionId').val();
	var frequency=$('#addFrequency').val();
	var JSONObject = {'agentName':agentName,'sourceId':sourceId,'mozendaAgentId':mozendaId,'collectionId':collectionId,'frequency':frequency};
	$.post(mozendaMappingUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			var tempHtml=listAgentResponse(response);
			$('#listAgentTab').append(tempHtml);
			$('#listAgentTable').dataTable();
			$('#saveAgentSuccessDiv').show(600);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			//scrollDown(addAndEditAgentDiv);
			$('#addAgentErrorDiv').show(600);
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

function editAgentMaster(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditAgentDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(mozendaMappingUrl+"edit.htm?id="+id,function(response){
		var html = editAgentMasterForm(response);
		appendAgentMasterAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function editAgentMasterForm(response){
	var agentMaster = response.successObject.agentMaster;
	console.log(agentMaster);
	var id = agentMaster.id;
	var agentName = agentMaster.agentName;
	var sourceName = agentMaster.sourceName;
	var mozendaId = agentMaster.mozendaAgentId;
	var sourceId = agentMaster.sourceId;
	var frequency = agentMaster.frequency;
	var collectionId = agentMaster.collectionId;
	var html = "";
	html+=	addFormHeading("Edit Agent Master");
	html+=	'<form class="col-sm-5" id="editAgentForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editAgentErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Agent Name***************************************************** */
	html += '<div class="form-group" id="Edit-agentName-Error">';
	html += '<label>Agent Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-agentName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="editAgentName" value="'+agentName+'"  placeholder="Enter Agent Name" maxlength="50">';
	html += '</div>';
	/** ************************************Mozenda Id ***************************************************** */
	html += '<div class="form-group" id="Edit-mozendaAgentId-Error">';
	html += '<label>Mozenda Agent Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-mozendaAgentId-span-Error" class="help-inline"></span>';
	if(mozendaId!=null){
	html += '<input	type="text" class="form-control input-sm" id="editMozendaId" value="'+mozendaId+'"  placeholder="Enter Mozenda Id" maxlength="50">';
	}else{
		html += '<input	type="text" class="form-control input-sm" id="editMozendaId"   placeholder="Enter Mozenda Id" maxlength="50">';
	}
	html += '</div>';
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group" id="Edit-sourceName-Error">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourceName-span-Error" class="help-inline"></span>';
	//html += '<input	type="text" class="form-control input-sm" id="editSourceName" value="'+sourceName+'" placeholder="Enter Source Name" maxlength="50">';
	html+='<select id="editSelectSourceNameId" class="form-control input-sm"  disabled style="width: 365px;">';
	html+='<option value='+sourceId+'>'+sourceName+'</option>';
	html +=	'<input type="hidden" value='+sourceId+' id="editedSourceNameId">';
	html +=	'<input type="hidden" value='+id+' id="editedId">';
	html += '</div>';
	
	/** ************************************Collection  ID***************************************************** */
	html += '<div class="form-group" id="Edit-collectionId-Error">';
	html += '<label>Collection Id<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-collectionId-span-Error" class="help-inline"></span>';
	if(collectionId!=null){
	html += '<input	type="text" class="form-control input-sm" id="editCollectionId" value="'+collectionId+'" placeholder="Enter Collection Id" maxlength="50">';
	}else{
		html += '<input	type="text" class="form-control input-sm" id="editCollectionId"  placeholder="Enter Collection Id" maxlength="50">';
	}
	html += '</div>';
	
	/** ************************************Frequency***************************************************** */
	html += '<div class="form-group" id="Edit-frequency-Error">';
	html += '<label>Frequency(In Days)</label>';
	html += '<span style="color: #a94442" id="edit-frequency-span-Error" class="help-inline"></span>';
	if(frequency!=null){
	html += '<input	type="text" class="form-control input-sm" id="editFrequency" value="'+frequency+'" placeholder="Enter Frequency" maxlength="50">';
	}else{
		html += '<input	type="text" class="form-control input-sm" id="editFrequency"  placeholder="Enter Frequency" maxlength="50">';
	}
	html += '</div>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateAgentMaster()">';
	html+=	appendCancelButton(getDivId("Agent"),"page-wrapper");//Adding Cancel Button
	html+=	'</form>';
	return html;
}


function updateAgentMaster(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editAgentSuccessDiv').hide();
	$('#editAgentErrorDiv').hide();
	var editedAgentName = $.trim($('#editAgentName').val());
	var editedSourceId = $('#editedSourceNameId').val();
	var editedCollectionId = $('#editCollectionId').val();
	var editedFrequency = $('#editFrequency').val();
	var editedId = $('#editedId').val();
	var editMozendaId=$.trim($('#editMozendaId').val());
	var JSONObject = {};
	JSONObject['id'] = editedId;
	JSONObject['agentName'] = editedAgentName;
	JSONObject['mozendaAgentId'] = editMozendaId;
	JSONObject['sourceId'] = editedSourceId;
	JSONObject['collectionId'] = editedCollectionId;
	JSONObject['frequency'] = editedFrequency;
	console.log(JSONObject);
	$.post(mozendaMappingUrl+"/update.htm",JSONObject,function(response){
		console.log(response);
		if(response.status=="UPDATE_SUCCESS"){
			$('#editAgentSuccessDiv').show(600);
			//listAgent();//Recall List Method
			var html=listAgentResponse(response);
			$('#listAgentFormDiv').html('');
			$('#listAgentForm').html('');
			$('#listAgentTab').append(html);
			$('#listAgentTable').dataTable({ responsive: true});
			$('#updateAgentSuccessDiv').show(600);
			$('#loadMaskDiv').unmask();
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			$('#editAgentErrorDiv').show(600);
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
		$('#editCountryDiv').mask(response.status+"************"+response.statusText);
	});
	return false;
}