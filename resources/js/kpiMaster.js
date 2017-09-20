
var kpiMasterMappingUrl = "../kpiMaster/";
var $addAndEditGeneralKpiDiv = $("#addAndEditGeneralKpiDiv");
/***************************************************************************************************************************
 * ********************************General KPI******************************************************************************
 * *************************************************************************************************************************/
function listGeneralKpiTab(){
	$('#industryKpiTabFilterButtons').hide();//added by manoj
	$('#addAndEditIndustryKpiDiv').hide();//added by manoj
	clearAllSuccessDivs();
	listGeneralKpi();
}

function listGeneralKpi(){
	$('#loadMaskDiv').mask('Loading...');
	$('#generalKpiTabDiv').show();
	$('#industryKpiTabButtons').hide();
	$('#addIndustryKpiSuccessDiv,editIndustryKpiSuccessDiv').hide();
	$('#listGeneralKpiTab').html('');
	$.get(kpiMasterMappingUrl+"listGeneralKPITab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var tempHtml = listGeneralKpiResponse(response);
			$('#listGeneralKpiTab').append(tempHtml);
			$('#listGeneralKpiTable').dataTable();
			$addAndEditGeneralKpiDiv.hide();
			$('#loadMaskDiv').unmask();
		}else{
			$('#loadMaskDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('#loadMaskDiv').append(response.status+"*****************"+response.statusText);
	});
	return false;
}	

function listGeneralKpiResponse(response){
	$('#listGeneralKpiTab').html('');
	var generalKpiList = response.successObject.listKpiGeneralMaster;
	var tempHtml = "";
	tempHtml+=	'<div id="listGeneralKpiFormDiv">';
	tempHtml+=	'<form ="form" id="listGeneralKpiForm">';
	tempHtml+=	'<div class="alert alert-success" style="display:none;"id="deleteGeneralKpiSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; KPI(s) Deleted Successfully</div>';
	tempHtml+=	"<table class='table table-striped dataTable no-footer' id='listGeneralKpiTable'>";
	tempHtml+=		'<thead>';
	tempHtml+=			'<tr>';
	tempHtml+=				'<th><input type="checkbox" id="checkAllGeneralKpiCheckBox" style="margin-left: 0px;"></th>';
	tempHtml+=				'<th>KPI<span style="float: right;"></th>';
	//tempHtml+=				'<th><span style="float: right;"><a href="#" id="deleteAllGeneralKpiButton"><img alt="" src="../resources/images/delete-icon.png"></a></span></th>';
	tempHtml+=			'</tr>';
	tempHtml+=		'</thead>';
	tempHtml+=		'<tbody>';
	for(var i=0;i<generalKpiList.length;i++){
		tempHtml+=		'<tr>';
		tempHtml+=			'<td><input type="checkbox" class="generalKpiCheckBox" value="'+generalKpiList[i].id+'"></td>';
		tempHtml+=			'<td>'+generalKpiList[i].kpiName+'</td>';
		//tempHtml+=			'<td><span style="float: right;"><a href="#"><img alt="" src="../resources/images/delete-icon.png"></a></span></td>';	
		tempHtml+=		'</tr>';
	}
	tempHtml+=		'</tbody>';
	tempHtml+=	'</table>';
	tempHtml+=	'</form>';
	tempHtml+=	'<div id="addAndEditGeneralKpiDiv" class="SubHeading" style="display: none;"></div>';
	tempHtml+=	'</div>';
	return tempHtml;
	
}

$('a#addGenerealKpiButton').click(function() {
	$.ajaxSetup({cache : false});
	$('#loadMaskDiv').mask('Loading...');
	$addAndEditGeneralKpiDiv.html('');
	$('#addGeneralKpiForm').trigger('reset');//Making All Values Empty
	clearAddGeneralKpiForm();//Clearing All Errors
	var tempHtml = addGeneralKpiForm();
	$addAndEditGeneralKpiDiv.append(tempHtml);
	$addAndEditGeneralKpiDiv.show(600);
	scrollDown($addAndEditGeneralKpiDiv);//Scrolling To Add Page(Down)
	$('#loadMaskDiv').unmask();
	return false;
});

function addGeneralKpiForm() {
	var html = "";
	html+= addFormHeading("Add KPI")
	html += '<form class="col-sm-5" id="addGeneralKpiForm">';
	/** ****************Error Div******************************* */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addGeneralKpiErrorDiv">';
	html += '</div>';
	/** *********************Add KPI(s)************************* */
	html += '<div class="form-group" id="Add-kpiName-Error">';
	html += '<label>KPI(s)<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="kpiName-Error" class="help-inline"></span>';
	html += '<textarea class="form-control" rows="3" name="kpiName" id="kpiName" maxlength="100" placeholder="Add multiple KPIs using commas (,)"></textarea>';
	html += '</div>';
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeneralKpi()">';
	html+=	appendCancelButton(getDivId("GeneralKpi"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}
function saveGeneralKpi(){
	$('#loadMaskDiv').mask('Loading...');
	clearAddGeneralKpiForm();
	$('#addGeneralKpiErrorDiv').html('');
	var kpiName = $.trim($('#kpiName').val());
	console.log(kpiName);
	var JSONObject = {'kpiName':kpiName};
	$.ajax({
		type:"POST",
		data:JSON.stringify(JSONObject),
		url:kpiMasterMappingUrl+"saveGeneralKPI.htm",
		contentType:"application/json",
		success:function(response){
			$('#loadMaskDiv').unmask();
			if(response.status=="SAVE_ERROR"){
				var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
				$('#addGeneralKpiErrorDiv').append(errorMessage);
				$('#addGeneralKpiErrorDiv').show(600);
				$('#Add-kpiName-Error').addClass('has-error has-feedback');
				//$('#kpiName-Error').html(response.errorMessage);
			}else if(response.status=="SAVE_SUCCESS"){
				$('#addGeneralKpiSuccessDiv').show(600);
				$('#addGeneralKpiForm').trigger("reset");
				listGeneralKpi();
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"**************"+response.statusText);
		}
	});
	return false;
}


/**********************************************************************************************************************************************
 **********************D e l e t e*************************************************************************************************************
 **********************************************************************************************************************************************/ 

function deleteGeneralKpi(){
	$('#addAndEditGeneralKpiDiv').hide();
	selectedGeneralKpiCheckBoxLength();
	if(selectedGeneralKpiCheckBoxArray.length>0){
		if(confirm("Are you sure you want to delete selected item(s)?")){
			$('#loadMaskDiv').mask('Loading...');
			$('#addGeneralKpiSuccessDiv').hide(600);
			$.ajax({
				url:kpiMasterMappingUrl+"deleteGeneralKPI.htm",
				type:"POST",
				data:JSON.stringify(selectedGeneralKpiCheckBoxArray),
				contentType:"application/json",
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						selectedGeneralKpiCheckBoxArray = [];
						var tempHtml = listGeneralKpiResponse(response);
						$('#listGeneralKpiTab').append(tempHtml);
						$('#listGeneralKpiTable').dataTable({ responsive: true});
						$('#deleteGeneralKpiSuccessDiv').show(600);
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



/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllGeneralKpiCheckBox",function(){
    $('.generalKpiCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".generalKpiCheckBox",function(){
    if($('.generalKpiCheckBox:checked').length == $('.generalKpiCheckBox').length) {
      $('#checkAllGeneralKpiCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllGeneralKpiCheckBox').prop('checked', false);
    }
});

//Check All Check Box
$(document).on('click',"#checkAllIndustryKpiCheckBox",function(){
    $('.industryKpiCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".industryKpiCheckBox",function(){
    if($('.industryKpiCheckBox:checked').length == $('.industryKpiCheckBox').length) {
      $('#checkAllIndustryKpiCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllIndustryKpiCheckBox').prop('checked', false);
    }
});

var selectedGeneralKpiCheckBoxArray = [];
function selectedGeneralKpiCheckBoxLength(){
		if($('.generalKpiCheckBox:checked').length){
			selectedGeneralKpiCheckBoxArray = [];
			$('.generalKpiCheckBox:checked').each(function(){
				selectedGeneralKpiCheckBoxArray.push($(this).val());
			});
		}
		return false;
}
function clearAddGeneralKpiForm(){
	$('#addGeneralKpiSuccessDiv').hide();
	$('#addGeneralKpiErrorDiv').hide();
	$('.help-inline').html('');
	$('#Add-kpiName-Error').removeClass('has-error has-feedback');
}

/***************************************************************************************************************************
 *********************************Industry KPI******************************************************************************
 **************************************************************************************************************************/

function listIndustryKpiTab(){
	clearAllSuccessDivs();
	listIndustryKpi();
}
/****************************manoj started working*******05-01****************************/
function listIndustryKpi(){
	$('#loadMaskDiv').mask('Loading...');
	$('#generalKpiTabDiv').hide();
	//$('#addIndustryKpiSuccessDiv').hide();
	$('#addAndEditIndustryKpiDiv').hide();
	$('#addAndEditGeneralKpiDiv').hide();
	$('#listIndustryKpiTab').html('');
	$('#listIndustryKpiDivId').html('');
	$('#addGeneralKpiSuccessDiv').hide();
	$('addAndEditGeneralKpiDiv').hide();
	$('#industryKpiTabDiv').show();
	//$('#industryKpiTabButtons').show();//COMMENTED BY MANOJ
	//$('#listIndustryKpiTab').html('');//added by manoj
	$.get(kpiMasterMappingUrl+"listIndustryKPI.htm",function(response){
		
		//start
		if(response.status=="LIST_SUCCESS"){
			var listKpiIndustryMaster = response.successObject.listKpiIndustryMaster;
			var html="";
			
			html+=	'<div id="listIndustryKpiDivId">';
			html+= '<form id="industryKpiTabFilterButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
			html+='<label id="selectIndustryName" class="control-label" style="width:355px" for="selectIndustryName">Industry Type <select id="selectIndustryNameId" onchange="kpiNameList()" class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			for(var i=0;i<listKpiIndustryMaster.length;i++){
			html+='<option value="'+listKpiIndustryMaster[i].id+'">'+$.trim(listKpiIndustryMaster[i].industryType)+'</option>';
			}
			html+='</select>';
			html+='</label>';	
			
			html+='<label id="selectKpiName" class="control-label" style="width:355px" for="selectKpiName">KPIs <select id="selectKpiNameId" disabled class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			html+='</select>';
			html+='</label>';	
			
			
			html+='<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="industryKpiListTable()" value="View">';
			
			
			html+=		'<div class="form-group float-right">';
			html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteIndustryKpi(industryKpiTabFilterButtons)"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
			html+=			'<a onclick="addIndustryKpiButton()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
			html+=		'</div>';
			html+=		'</form>';
			html+=	'</div>';
			$('#page-wrapper').unmask();
			$("#listIndustryKpiDivId").append(html);
			$('#industryKpiTabButtons').hide();//added by manoj
		}else{
			$('#geoCountryDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		//end
		/******************commented by manoj**************************/
		/*var tempHtml = listIndustryKpiResponse(response);
		$('#listIndustryKpiTab').append(tempHtml);
		$('#listIndustryKpiTable').dataTable({responsive:true});
		//$('#addAndEditIndustryKpiDiv').hide(600);
		
*/		
		//$('#listIndustryKpiTable').dataTable({responsive:true});
		$('#loadMaskDiv').unmask();
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"******************"+response.statusText);
	});
	return false;
}

//start
/******************new function by manoj**************************/

function kpiNameList(){
	$('#page-wrapper').mask('Loading...');
	var industryId=$('#selectIndustryNameId option:selected').val();
	//alert(industryId);//commented by manoj
	$.ajaxSetup({ cache: false });
	$('#selectKpiName').html('');
	
	$.get("../kpiMaster/listOfKpis.htm?industryId="+industryId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var listAllKpiMaster = response.successObject.listAllKpiMaster;
			var html='';
			html+='<label id="selectKpiName" class="control-label" style="width:355px" for="selectKpiName">KPIs :<select id="selectKpiNameId"  class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			for(var i=0;i<listAllKpiMaster.length;i++){
				html+='<option value="'+listAllKpiMaster[i].id+'">'+$.trim(listAllKpiMaster[i].kpiName)+'</option>';
				}
			html+='</select>';
			html+='</label>';	
			$('#selectKpiName').append(html);	
			$('#page-wrapper').unmask();
			
			
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}
//end

/******************new function by manoj**************************/
//start
function industryKpiListTable(){
	$('#listIndustryKpiTab').html('');
	$('#addAndEditIndustryKpiDiv').hide();
	var selectCountryNameId=$('#selectIndustryNameId').val();
	var selectCityNameId=$('#selectKpiNameId').val();
	//alert(selectCountryNameId);//commented by manoj
	//alert(selectCityNameId);//commented by manoj
	
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#geoCityTab').html('');
	$('#geoCityDivId').show();
	$.get(kpiMasterMappingUrl+"tableOfKpis.htm?selectIndustryNameId="+selectCountryNameId+"&selectKpiNameId="+selectCityNameId,function(response){
		var html = listIndustryKpiResponse(response);
		//$('#listIndustryKpiTab').html('');
		$('#listIndustryKpiTab').append(html);
		$('#listIndustryKpiTab').show();
		$('#listIndustryKpiTable').dataTable();
		$('#industryKpiTabFilterButtons').show();
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"***********"+response.statusText);
	});
	return false;
}
//end

/****************modified by manoj***********************/
function listIndustryKpiResponse(response){
	//$('#listIndustryKpiTab').html('');
	var listAllKpiMaster = response.successObject.listAllKpiMaster;
	var html = '';
	html+=	'<form class="" id="listIndustryKpiForm">';
	html+=	'<div class="alert alert-success" style="display:none;" id="deleteIndustryKpiSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; KPI(s) Deleted Successfully</div>';
	html+=		'<div class ="table-responsive">';
	html+=			'<table class="table table-striped dataTable no-footer" id="listIndustryKpiTable">';
	html+=				'<thead>';
	html+=					'<tr>';
	html+=						'<th><input type="checkbox" id="checkAllIndustryKpiCheckBox" style="margin-left: 0px;"></th>';
	html+=						'<th>KPI</th>';
	html+=						'<th>Industry Type</th>';
	html+=						'<th></th>';
	html+=					'</tr>';
	html+=				'</thead>';
	html+=				'<tbody>';
	for(var i=0;i<listAllKpiMaster.length;i++){
		html+=				'<tr>';
		html+=					'<td><input type="checkBox" class="industryKpiCheckBox" value='+listAllKpiMaster[i].id+'></td>';
		html+=					'<td>'+listAllKpiMaster[i].kpiName+'</td>';
		html+=					'<td>'+listAllKpiMaster[i].industryType+'</td>';
		html+=					'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editIndustryKpiIcon('+listAllKpiMaster[i].id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
	//								'<span style="float:right"><a href="#" onclick="editIndustryKpiIcon('+kpiIndustryTypeList[i].id+')"><img src="../resources/images/edit-icon.jpg"></a></img> &nbsp;';
		html+=				'</tr>';
	}
	html+=				'</tbody>';
	html+=			'</table>';
	html+=		'</div>';
	html+=	'</form><hr>';
	html+=	'<div id="addAndEditIndustryKpiDiv" class="SubHeading addAdminForm col-xs-12" style="display:none"></div>';
	return html;
}

function addIndustryKpiButton(){
	var $addAndEditIndustryKpiDiv = $('#addAndEditIndustryKpiDiv');
	$.ajax({
		type:"GET",
		url:kpiMasterMappingUrl+"addIndustryKPI.htm",
		success:function(response){
			$('#addIndustryKpiForm').trigger('reset');
			clearAddIndustryKpiForm();
			if(response.status=="ADD_INDUSTRY_KPI_SUCCESS"){
				var tempHtml = addIndustryKpiForm(response);
				$addAndEditIndustryKpiDiv.html('');
				$addAndEditIndustryKpiDiv.append(tempHtml);
				$addAndEditIndustryKpiDiv.show(600);
				scrollDown($addAndEditIndustryKpiDiv);
			}else{
				$('#loadMaskDiv').mask('<font>'+response.errorMessage+'</font>');
			}
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
		}
	});
	return false;
}

function clearAddIndustryKpiForm(){
	$('#addIndustryKpiSuccessDiv').hide();
	$('#addIndustryKpiErrorDiv').hide();
	$('.help-inline').html('');
	$('#Add-Industry-kpiName-Error').removeClass('has-error has-feedback');
}
function addIndustryKpiForm(response){
	var industryTypes = response.successObject.listIndustryType;
	var html = "";
	html+= addFormHeading("Add KPI")
	html+=		'<form class="col-sm-5" id="addIndustryKpiForm">';
	/******************Error Div********************************/
	html+=			'<div class="alert alert-danger alert-error" style="display: none;"	id="addIndustryKpiErrorDiv">';
	html+=			'</div>';
	/*****************Industry Type*****************************/
	if(industryTypes.length>0){
		html+=			'<div class="form-group">';
		html+=				'<label>Industry Type</label>';
		html+=				'<select class="form-control" id="industryTypeForKpi">';
		for(var i=0;i<industryTypes.length;i++){
			html+=				'<option value='+industryTypes[i].id+'>'+industryTypes[i].industryType+'</option>';
		}
		html+=				'</select>';
		html+=			'</div>';
	}else{
		html+=			'<div class="form-group has-error">';
		html+=				'<label>Industry Type</label>';
		html+=				'<select class="form-control" disabled="disabled">';
		html+=				'<option>No Industry Types Found</option>';
		html+=				'</select>';
		html+=			'</div>';
	}
	
	/***********************Add KPI(s)**************************/
	html+=			'<div class="form-group" id="Add-Industry-kpiName-Error">';
	html+=				'<label>KPI(s)<font style="color: red">*</font></label>';
	html+=				'<span style="color: #a94442" id="industry-kpiName-Error" class="help-inline"></span><br>';
	html+=				'<textarea class="form-control"   name="kpiName" id="industryTypeKpiName" maxlength="200" placeholder="Add multiple KPIs using commas (,)" rows="3"></textarea>';
	html+=			'</div>';
	if(industryTypes.length>0){
		html+=			'<input type="button" class="btn btn-primary" value="Add" onclick ="saveIndustryKpi()">';
	}else{
		html+=			'<input type="button" class="btn btn-primary" value="Add" disabled="disabled">';
	}
	html+=	appendCancelButton(getDivId("IndustryKpi"),"page-wrapper");//Adding Cancel Button
	html+=		'</form>';
	return html;
}

function saveIndustryKpi(){
	$('#loadMaskDiv').mask('Loading...');
	var kpiName = $.trim($('#industryTypeKpiName').val());
	var selectedIndustryTypeId = $('#industryTypeForKpi option:selected').val();
	$('#addIndustryKpiErrorDiv').html('');
	var JSONObject = {};
	JSONObject['kpiName'] = kpiName;
	JSONObject['industryTypeId'] = selectedIndustryTypeId;
	clearAddIndustryKpiForm();
	$.post(kpiMasterMappingUrl+"saveIndustryKPI.htm",JSONObject,function(response){
		$('#loadMaskDiv').unmask();
		if(response.status=="SAVE_ERROR"){
			var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
			$('#addIndustryKpiErrorDiv').append(errorMessage);
			$('#addIndustryKpiErrorDiv').show(600);
			$('#Add-Industry-kpiName-Error').addClass('has-error has-feedback');
			//$('#industry-kpiName-Error').html(response.errorMessage);
		}else if(response.status=="SAVE_SUCCESS"){
			$('#addIndustryKpiSuccessDiv').show(600);
			$('#addIndustryKpiForm').trigger("reset");
			$('#addAndEditIndustryKpiDiv').hide(600);
			scrollTop();
			//listIndustryKpi();//old commenetd by manoj
			industryKpiListTable();

			$('#loadMaskDiv').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	});
	return false;
}




function editIndustryKpiIcon(id){
	var $addAndEditIndustryKpiDiv = $('#addAndEditIndustryKpiDiv');
	$('#loadMaskDiv').mask('Loading...');
	clearAllSuccessDivs();
	$.get(kpiMasterMappingUrl+"editIndustryKPI.htm?id="+id,function(response){
		$('#addAndEditIndustryKpiDiv').html('');
		var tempHtml = editIndustryKpiForm(response);
		$addAndEditIndustryKpiDiv.append(tempHtml);
		$addAndEditIndustryKpiDiv.show(600);
		scrollDown($addAndEditIndustryKpiDiv);
		$('#loadMaskDiv').unmask();
	}).fail(function(response){
		$('#loadMaskDiv').mask(response.status+"************"+response.statusText);
	});
}


function editIndustryKpiForm(response){
	var kpiIndustryMaster = response.successObject.kpiIndustryMaster;
	var id = kpiIndustryMaster.id;
	var html = "";
	html+= addFormHeading("Edit KPI");
	html+=		'<form class="col-sm-5" id="editKpiIndustryForm">';
	/*************Sucess Div************************************//*
	html+=			'<div class="alert alert-success" style="display: none;"	id="addIndustryKpiSuccessDiv">';
	html+=				'&nbsp;<img alt="../" src="../resources/images/done.png"> KPI(s) Added Successfully';
	html+=			'</div>';*/
	/******************Error Div********************************/
	html+=			'<div class="alert alert-danger alert-error" style="display: none;"	id="editKpiIndustryErrorDiv">';
	html+=			'</div>';
	/*****************Industry Type*****************************/
	html+=	'<div class="form-group">';
	html+=	'<label>Industry</label>';
	html+=	'<select class="form-control" disabled="disabled">';
	html+=		'<option value="'+kpiIndustryMaster.industryType+'">'+kpiIndustryMaster.industryType+'</option>';
	html+=	'</select>';
	html+=	'</div>';
	/***********************KPI**************************/
	html+=			'<div class="form-group" id="Edit-kpiName-Error">';
	html+=				'<label>KPI<font style="color: red">*</font></label>';
	html+=				'<span style="color: #a94442" id="Edit-kpiName-span-Error" class="help-inline"></span><br>';
	html+=				'<textarea class="form-control" name="kpiName" id="editedIndustryTypeKpiName" maxlength="100" placeholder="KPI Name" rows="3">'+kpiIndustryMaster.kpiName+'</textarea>';
	html+=			'</div>';
	html+=			'<input type="button" class="btn btn-primary" value="Update" onclick ="updateIndustryKpi('+id+')">';
	html+=			appendCancelButton(getDivId("IndustryKpi"),"page-wrapper");//Adding Cancel Button
	html+=		'</form>';
	return html;

	
}

function updateIndustryKpi(id){
	$('.modal-content').mask('Loading...');
	$('#editKpiIndustryErrorDiv').hide();
	$('#editKpiIndustryErrorDiv').html('');
	$('#Edit-kpiName-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	var kpiName = $.trim($('#editedIndustryTypeKpiName').val());
	var JSONObject = {};
	JSONObject['id'] = id;
	JSONObject['kpiName'] = kpiName;
	$.post(kpiMasterMappingUrl+"updateIndustryKPI.htm",JSONObject,function(response){
		if(response.status=="UPDATE_ERROR"){
				var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
				$('#editKpiIndustryErrorDiv').append(errorMessage);
				$('#editKpiIndustryErrorDiv').show(600);
				$('#Edit-kpiName-Error').addClass('has-error has-feedback');
				//$('#Edit-kpiName-span-Error').html(response.errorMessage);
				$('.modal-content').unmask();
		}else if(response.status=="UPDATE_SUCCESS"){
			$('#addAndEditIndustryKpiDiv').hide(600);
			$('#editIndustryKpiSuccessDiv').show(600);
			scrollTop();
			listIndustryKpi();
			$('.modal-content').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('.modal-content').mask('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('.modal-content').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

//old code commented by osso
/*function deleteIndustryKpi(form){
	console.log("calling........"+form);
	selectedGeoCityCheckBoxLength();
	var f = form.length;
	//console.log("length "+f);
	var count = 0;
	var arr = [];
	while (f--) {
		if (form[f].type == "checkbox" && form[f].checked) {
			if(form[f].value!="on")
				var id = form[f].value;
				console.log("id is "+id);
				arr.push(id);
				count = count + 1;
		}
	}
	
	if(count==0){
		alert("Please select atleast one item");
	}else if(confirm("Are you sure you want do delete selected item(s)?")){
		clearAllSuccessDivs();
		$('#loadMaskDiv').mask('Loading...'); 
		console.log("array value: "+arr);
		deleteIndustryKpiMethod(arr);
		
	}
	return false;
}
*/

/****************************manoj start**********************/
selectedData = [];
function selectedIndustryKpiCheckBoxLength() {
	console.log("check box method caling");
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.industryKpiCheckBox:checked').length) {
		$('.industryKpiCheckBox:checked').each(function() {
			selectedData.push($(this).val());
			console.log("selected item: "+selectedData);
		});
		
	}
	return false;
}
function deleteIndustryKpi(form){
	console.log("calling........"+form);
	selectedIndustryKpiCheckBoxLength();
	if(selectedData.length<=0){
		alert("Please select atleast one item");
	}else if(confirm("Are you sure you want do delete selected item(s)?")){
		clearAllSuccessDivs();
		$('#loadMaskDiv').mask('Loading...'); 
		deleteIndustryKpiMethod(selectedData);
	}
	return false;
}
/******************end******************************************/


function deleteIndustryKpiIcon(id){
	if(confirm("Are you sure you want do delete selected item?")){
		$('#loadMaskDiv').mask('Loading...');
		var arr = [];
		arr.push(id);
		deleteIndustryKpiMethod(arr);
	}
}
function deleteIndustryKpiMethod(arr){
	/*$('#listIndustryKpiTab').hide();*/
	$('#listIndustryKpiTab').html('');
	$('#listIndustryKpiTable').html('');
	$.ajax({
		url:kpiMasterMappingUrl+"deleteIndustryKPI.htm",
		type:"POST",
		contentType:"application/json",
		data:JSON.stringify(arr),
		success:function(response){
			if(response.status=="DELETE_SUCCESS"){
				var tempHtml = listIndustryKpiResponse(response);//old code
				//var tempHtml = industryKpiListTable(response);//by manoj
				$('#listIndustryKpiTab').append(tempHtml);
				$('#listIndustryKpiTab').show();
				$('#listIndustryKpiTable').dataTable({responsive:true});
				$('#deleteIndustryKpiSuccessDiv').show(600);
				$('#loadMaskDiv').unmask();
			}else{
				$('#loadMaskDiv').mask('<font style="color:red;">'+response.errorMessage+'</font>');
			}
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
		}
	});
}

/***************************************************************************************************************************
 *********************************Export Excel******************************************************************************
 **************************************************************************************************************************/
function exportKpi(){
	$('#generalKpiTabDiv').hide();
	$('#industryKpiTabDiv').hide();
	$('#industryKpiTabFilterButtons').hide();
	clearAllSuccessDivs();
	$('#exportKpiTab').html('');
	var exportGeneralKpiButton = '<hr><input type="button" class="btn btn-info btn-xs" onclick=exportGeneralKpi() value="Export General KPI">';
	var exportIndustryKpiButton = '<input type="button" class="btn btn-info btn-xs" onclick=exportIndustryKpi() value="Export Industry KPI">';
	$('#exportKpiTab').append(exportGeneralKpiButton+"&nbsp; "+exportIndustryKpiButton+"<hr>");
}

function exportGeneralKpi(){
	redirectView("../kpiMaster/exportGeneralKpi.htm");
	return false;
}function exportIndustryKpi(){
	redirectView("../kpiMaster/exportIndustryKpi.htm");
	return false;
}


/***************************************************************************************************************************
 *********************************Upload Excel******************************************************************************
 **************************************************************************************************************************/
function uploadKpi(){
	$('#generalKpiTabDiv').hide();
	$('#industryKpiTabDiv').hide();
	clearAllSuccessDivs();
	$('#uploadKpiTab').html('');
	/********************Upload General KPI*******************************/
	var html = "";
	html+=	'<hr><div class="col-sm-6">';
	html+=	'<h4 style="color: green;">Upload General KPI</h4><hr>';
	html+=	'<form action="POST" encypte="multipart/form-data" id="uploadGeneralKpiForm">';
	/******************Success Div********************************/
	html+=	'<div class="alert alert-success" style="display: none;"	id="uploadGeneralKpiSuccessDiv">';
	html+=		'&nbsp;<img alt="../" src="../resources/images/done.png"> General KPI(s) Uploaded Successfully';
	html+=	'</div>';
	/******************Error Div********************************/
	html+=	'<div class="alert alert-danger alert-error" style="display: none;"	id="uploadGeneralKpiErrorDiv">';
	html+=	'</div>';
	html+=	'<br>';
	html+=	'<input type="button" class="btn btn-info btn-xs" id="downloadGeneralKpiMaster" onclick="downloadGeneralKpiExcel()" value="Download Template"><br>';
	html+=	 '<span id="uploadGeneralKpiSpanError"></span><br>';
	html+=	 '<span id="uploadGeneralKpiSpanButton"></span><br>';
	html+=	 '<span id="errorIndicationSpanId"></span>';
	html+=	'<p style="color:green">The system only accepts .xlsx and .xls extension</p>';
	html+=	'<input type="file" id="fileData" name="fileData"><br><input type="button" class="btn btn-primary btn-sm" value="Upload File..." onclick="uploadGeneralKpiExcel()"></input><br>';
	html+=	'</form>';
	html+=	'</div>';
	
	
	/********************************Upload Industry KPI***************************/
	html+=	'<div class="col-sm-6" style="border">';
	html+=	'<h4 style="color: green;">Upload Industry KPI</h4><hr>';
	html+=	'<form action="POST" encypte="multipart/form-data" id="uploadIndustryKpiForm">';
	/******************Success Div********************************/
	html+=	'<div class="alert alert-success" style="display: none;"	id="uploadIndustryKpiSuccessDiv">';
	html+=		'&nbsp;<img alt="../" src="../resources/images/done.png"> Industry KPI(s) Uploaded Successfully';
	html+=	'</div>';
	/******************Error Div********************************/
	html+=	'<div class="alert alert-danger alert-error" style="display: none;"	id="uploadIndustryKpiErrorDiv">';
	html+=	'</div>';
	html+=	'<br>';
	html+=	'<input type="button" class="btn btn-info btn-xs" id="downloadIndustryKpiMasterButton" onclick="downloadIndustryKpiExcel()" value="Download Template"><br>';
	html+=	 '<span id="uploadIndustryKpiExcelSpanError"></span><br>';
	html+=	 '<span id="downloadIndustryKpiExcelSpan"></span><br>';
	html+=	'<p style="color:green">The system only accepts .xlsx and .xls extension</p>';
	html+=	'<input type="file" id="fileDataIndustryKpi" name="fileDataIndustryKpi"><br><input type="button" class="btn btn-primary btn-sm" value="Upload File..." onclick="uploadIndustryKpiExcel()"></input>';
	html+=	'</form>';
	html+=	'</div>';
	
	$('#uploadKpiTab').append(html);
	return false;
}
var uploadedGeneralKpiFilePath = "";
var uploadedIndustryKpiFilePath = "";

/*****************************************Upload General Kpi Excel*******************************************/
function uploadGeneralKpiExcel(){
	$('#loadMaskDiv').mask('Loading...');
	  var generalKpiExcel = new FormData();
	  generalKpiExcel.append("file", fileData.files[0]);
	  $('#uploadGeneralKpiSpanError').empty();
	  $('#uploadGeneralKpiSpanButton').empty();
	  $('#uploadGeneralKpiSuccessDiv').hide();
	  $('#uploadGeneralKpiErrorDiv').hide();
	  $('#uploadGeneralKpiInfoDiv').hide();
	  $.ajax({
	    url: kpiMasterMappingUrl+'importGeneralKpiExcel.htm',
	    data: generalKpiExcel,
	    dataType: 'json',
	    processData: false,
	    contentType: false,
	    type: 'POST',
	    success: function(response){
	    	$("#fileData").val(""); 
	    	$('#loadMaskDiv').unmask();
	    	$('#uploadGeneralKpiErrorDiv').html('');
	    	$('#downloadGeneralKpiMaster').removeAttr('disabled');
	    	if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' ||  response.status=="INVALID_EXCEL" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
	    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
	    		$('#uploadGeneralKpiErrorDiv').append(html);
	    		$('#uploadGeneralKpiErrorDiv').show(600);
	    		if(response.status=="EXCEL_UPLOAD_ERROR"){
	    			$('#downloadGeneralKpiMaster').attr('disabled','disabled');
	    			uploadedGeneralKpiFilePath = response.successObject.generalKpiErrorsExcelPath;
		    		var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadGeneralKpiErrorsExcelButton" onclick="downloadGeneralKpiErrorsExcel()" value="Download Excel"><br>';
		    		$('#uploadGeneralKpiSpanButton').html(html);
		    		$('#uploadGeneralKpiInfoDiv').show(600);
		    		$('#uploadIndustryKpiInfoDiv').show(600);
	    		}
	    	}else if(response.status=="UPLOAD_SUCCESS"){
	    		$('#uploadGeneralKpiSuccessDiv').show(600);
	    		$('#downloadGeneralKpiMaster').removeAttr('disabled');
	    	}
	    	else if(response.status=="EXCEPTION_ERROR"){
	    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
	    		$('#uploadGeneralKpiErrorDiv').append(html);
	    		$('#uploadGeneralKpiErrorDiv').show(600);
	    		$('#loadMaskDiv').unmask();
	    	}
	    	
	    },error:function(response){
	    	$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	    }
	  });
	return false;
}


function downloadGeneralKpiErrorsExcel(){
	redirectView(uploadedGeneralKpiFilePath);
}

function downloadGeneralKpiExcel(){
	redirectView(kpiMasterMappingUrl+"downloadGeneralKpiMaster.htm");
	return false;
}
/*****************************************Upload Industry Kpi Excel*******************************************/
function uploadIndustryKpiExcel(){
	$('#loadMaskDiv').mask('Loading...');
	var industryKpiUploadForm = new FormData();
	industryKpiUploadForm.append("file", fileDataIndustryKpi.files[0]);
	  $('#uploadIndustryKpiExcelSpanError').empty();
	  $('#downloadIndustryKpiExcelSpan').empty();
	  $('#uploadIndustryKpiSuccessDiv').hide();
	  $('#uploadIndustryKpiErrorDiv').hide();
	  $('#uploadIndustryKpiInfoDiv').hide();
	  $.ajax({
	    url: kpiMasterMappingUrl+'importIndustryKpiExcel.htm',
	    data: industryKpiUploadForm,
	    dataType: 'json',
	    processData: false,
	    contentType: false,
	    type: 'POST',
	    success: function(response){
	    	console.log(response);
	    	$('#loadMaskDiv').unmask();
	    	$("#fileDataIndustryKpi").val(""); 
	    	$('#loadMaskDiv').unmask();
	    	$('#uploadIndustryKpiErrorDiv').html('');
	    	$('#downloadIndustryKpiMasterButton').removeAttr('disabled');
	    	if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' ||  response.status=="INVALID_EXCEL" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
	    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
	    		$('#uploadIndustryKpiErrorDiv').append(html);
	    		$('#uploadIndustryKpiErrorDiv').show(600);
	    		if(response.status=="EXCEL_UPLOAD_ERROR"){
	    			$('#downloadIndustryKpiMasterButton').attr('disabled','disabled');
	    			uploadedIndustryKpiFilePath = response.successObject.industryKpiErrorsExcelPath;
		    		var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryKpiErrorsExcelButton" onclick="downloadIndustryKpiErrorsExcel()" value="Download Excel"><br>';
		    		$('#downloadIndustryKpiExcelSpan').html(html);
		    		$('#uploadIndustryKpiInfoDiv').show(600);
	    		}
	    	}
	    	else if(response.status=="UPLOAD_SUCCESS"){
	    		$('#uploadIndustryKpiSuccessDiv').show(600);
	    		$('#downloadIndustryKpiMaster').removeAttr('disabled');
	    	}
	    	else if(response.status=="EXCEPTION_ERROR"){
	    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
	    		$('#uploadIndustryKpiErrorDiv').append(html);
	    		$('#uploadIndustryKpiErrorDiv').show(600);
	    		$('#loadMaskDiv').unmask();
	    	}
	    	
	    },error:function(response){
	    	$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	    }
	  });
	return false;
}
function downloadIndustryKpiErrorsExcel(){
	redirectView(uploadedIndustryKpiFilePath);
}

function downloadIndustryKpiExcel(){
	redirectView(kpiMasterMappingUrl+"downloadIndustryKpiMaster.htm");
	return false;
}
$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});

function clearAllSuccessDivs(){
	$('#addGeneralKpiSuccessDiv,#addIndustryKpiSuccessDiv,#editIndustryKpiSuccessDiv').hide();
}