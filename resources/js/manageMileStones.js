var mileStoneUrl = "../manageMileStones/";
var departmentCollapsableDivId = "DepartmentMilestone";
var kpiCollapsableDivId = "KpiMilestone";
var sourceCollapsableDivId = "SourceMilestone";
var organizationCollapsableDivId = "OrganizationMilestone";
var departmentModule = "Department";
var kpiModule = "Kpi";
var sourceModule = "Source";
var organizationMoudle = "Organization";
var all = "---ALL---";
$(document).ready(function(){
	getSessionData();
});

function manageMileStoneForOrganization(){
	loadingForDashBoard();
	saveSessionDataForMilestone();
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $('#altFromDate').val();
	var toDate = $('#altToDate').val();
	var milestoneSetFromDate=$('#altMileStoneOrganizationFromDate').val();
	var milestoneSetToDate=$('#altMileStoneOrganizationToDate').val();
	window.location.href = mileStoneUrl+"list.htm?organizationId="+organizationId+"&fromDate="+fromDate+"&toDate="+toDate;
	return false;
}
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDate",
		altFormat: "yy-mm-dd",
		maxDate: new Date,
		onClose : function(selectedDate) {
			$("#to").datepicker("option", "minDate", selectedDate);
			 dateValidationForm();
		}
	});

	$("#to").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altToDate",
		altFormat: "yy-mm-dd",
		maxDate: new Date,
		onClose : function(selectedDate) {
		$("#from").datepicker("option", "maxDate", selectedDate);
		 dateValidationForm(); 
		}

});

$( "#mileStoneDepartmentFromDate" ).datepicker({
	dateFormat:'d M yy',
	altField: "#altMileStoneDepartmentFromDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y', 
	minDate:'0',
});
$( "#mileStoneDepartmentToDate" ).datepicker({
	minDate:'0',
	dateFormat:'d M yy',
	altField: "#altMileStoneDepartmentToDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y', 
});
$( "#mileStoneKpiFromDate" ).datepicker({
	dateFormat:'d M yy',
	altField: "#altMileStoneKpiFromDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y', 
	minDate:'0',
});
$( "#mileStoneKpiToDate" ).datepicker({
	minDate:'0',
	dateFormat:'d M yy',
	altField: "#altMileStoneKpiToDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y', 
});
$( "#mileStoneSourceFromDate" ).datepicker({
	dateFormat:'d M yy',
	altField: "#altMileStoneSourceFromDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y',
	minDate:'0',
});
$( "#mileStoneSourceToDate" ).datepicker({
	minDate:'0',
	dateFormat:'d M yy',
	altField: "#altMileStoneSourceToDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y', 
});
$( "#mileStoneOrganizationFromDate" ).datepicker({
	dateFormat:'d M yy',
	altField: "#altMileStoneOrganizationFromDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y', 
	minDate:'0',
});
$( "#mileStoneOrganizationToDate" ).datepicker({
	minDate:'0',
	dateFormat:'d M yy',
	altField: "#altMileStoneOrganizationToDate",
	altFormat: "yy-mm-dd",
	maxDate: '+20Y', 
});

function addDatePickers(id,moduleId){
	var fromDateId = "editMileStone"+moduleId+"FromDate_"+id;
	var toDateId = "editMileStone"+moduleId+"ToDate_"+id;
	var altFromDateId = "#altEditMileStone"+moduleId+"FromDate_"+id;
	var altToDateId = "#altEditMileStone"+moduleId+"ToDate_"+id;
	$("#"+fromDateId).datepicker({
		dateFormat:'d M yy',
		altField: altFromDateId,
		altFormat: "yy-mm-dd",
		maxDate: '+20Y', 
	});
	$("#"+toDateId).datepicker({
		minDate:'0',
		dateFormat:'d M yy',
		altField: altToDateId,
		altFormat: "yy-mm-dd",
		maxDate: '+20Y', 
	});
}

function addMilestoneFormHide(){
	$('#addDepartmentMileStoneDivId').hide();
	$('#addKpiMileStoneDivId').hide();
	$('#addSourceMileStoneDivId').hide();
	$('#addOrganizationMileStoneDivId').hide();
	$('#editDepartmentMileStoneSuccessDiv').hide();
	$('#editOrganizationMileStoneSuccessDiv').hide();
	$('#addKpiMileStoneSuccessDiv').hide();
	$('#editKpiMileStoneSuccessDiv').hide();
	$('#editSourceMileStoneSuccessDiv').hide();
}

function showAddMileStoneForm(divId,successDivId,errorDivId,formId,dataDivId){
	$('#editDepartmentMileStoneSuccessDiv').hide();
	$('#addDepartmentMileStonesForm').trigger('reset');
	$('#'+divId).show();
	clearErrorDivs(successDivId,errorDivId,formId);//Passing Error And Success Div Id's For Clearing Errors.
	$('#'+dataDivId).removeClass('panel-collapse collapse');
	$('#'+dataDivId).addClass('panel-collapse collapse in');
	$('#'+dataDivId).css('height','');
}

function hideForm(divId){
	$('#'+divId).hide(600);
}
/****************************************************************************************************************************************
 *******************************************************Add Department MileStone*********************************************************
 ****************************************************************************************************************************************/
$('#addDepartmentMileStonesForm').unbind().bind('submit',function(){
	var formId = "addDepartmentMileStonesForm";
	loadingForDashBoard();
	var addOrEdit = "Add";
	var errorDivId = "addDepartmentMileStoneErrorDiv";
	var successDivId = "addDepartmentMileStoneSuccessDiv";
	clearErrorDivs(successDivId,errorDivId,"addDepartmentMileStonesForm");//Passing Error And Success Div Id's For Clearing Errors.
	var mileStoneDepartmentFromDate = $('#mileStoneDepartmentFromDate').val();
	var mileStoneDepartmentToDate = $('#mileStoneDepartmentToDate').val();
	var mileStoneDepartment = $('#mileStoneForDepartment').val();
	var fromDate = $('#altMileStoneDepartmentFromDate').val();
	var toDate = $('#altMileStoneDepartmentToDate').val();
	if(mileStoneDepartment==""){
		mileStoneDepartment = 0.0;
	}
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	var departmentId = $('#mileStoneDepartmentId option:selected').val();
	var organizationId = $('#mileStoneOrganizationId option:selected').val();
	var factorName = departmentModule;
	var JSONObject = {'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStoneDepartment,'departmentId':departmentId,'organizationId':organizationId,'factorName':factorName,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	$.post(mileStoneUrl+"add.htm",JSONObject,function(response){
		if(response.status=="SAVE_ERROR"){
			addErrors(errorDivId, response, addOrEdit,departmentModule);
			unloadingForDashBoard();
		}else if(response.status=="SAVE_SUCCESS"){
			$('#'+successDivId).show(600);
			resetMileStoneForm(formId,"Department");
			listDepartmentsForMileStones(response);
			listMileStones(response, departmentCollapsableDivId);
			unloadingForDashBoard();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
});

function listDepartmentsForMileStones(response){
	var formId = "addDepartmentMileStonesForm";
	$('#'+formId).find('#Add-departmentId-Error').removeClass('has-error has-feedback');
	$('#mileStoneDepartmentId').html('');
	var departments = response.successObject.listDepartmentsForMileStones;
	var departmentsLength = departments.length;
	if(departmentsLength>0){
		$('#mileStoneDepartmentId').append('<option value=0>Select a Department</option>');
		for(var i=0;i<departmentsLength;i++){
			var id = departments[i].id;
			var departmentName = departments[i].departmentName;
			$('#mileStoneDepartmentId').append('<option value='+id+'>'+departmentName+'</option>');
		}
	}else{
		$('input[type=submit]', $('#'+formId)).prop('disabled', false);
		$('input[type=submit]', $('#'+formId)).removeClass('btn btn-default btn-xs btn-blue');
		$('input[type=submit]', $('#'+formId)).removeClass('btn btn-default btn-xs btn-red');
		$('input[type=submit]', $('#'+formId)).prop('disabled', true);
		$('input[type=submit]', $('#'+formId)).addClass('btn btn-default btn-xs btn-red');
		$('#'+formId).find('#Add-departmentId-Error').addClass('has-error has-feedback');
		var message = '<font style="color:red">No Departments Found</font>';
		$('#mileStoneDepartmentId').prop('disabled',true);
		$('#mileStoneDepartmentId').append('<option>'+message+'</option>');
	}
	
}

function listMileStones(response,divId){
	var departmentMileStone = response.successObject.milestone;
	var currentRepufactor = response.successObject.currentRepufactor;
	$('#'+departmentCollapsableDivId+' div:eq(0)').after(appendDiv(departmentMileStone,currentRepufactor));
	$('#departmentEmptyMileStone').hide(600);//Hide Empty Div
	
}

function appendDiv(departmentMileStone,currentRepufactor){
	var html = "";
	var departmentName = departmentMileStone.departmentName;
	var fromDate = departmentMileStone.setFromDate;
	var toDate = departmentMileStone.setToDate;
	var trajectoryChange = parseFloat(departmentMileStone.trajectoryChange).toFixed(2);
	var daysRemaining = departmentMileStone.daysRemaining;
	var mileStonePercentage = parseFloat(departmentMileStone.setPercentage).toFixed(2);
	var id = departmentMileStone.id;
	currentRepufactor = parseFloat(currentRepufactor);
	currentRepufactor = currentRepufactor.toFixed(2);
	html+=	'<div id="DepartmentMileStonesList">';
	html+=	'<div class="panel-body" id="department-milestoneList-'+id+'">'+
				'<div class="row">'+
					'<div class="col-xs-12 MediumBoldGreyContent" id="department-milestoneList-'+id+'_departmentName">'+departmentName+'</div>'+
				'</div>'+
				'<div class="row MilestoneValues">'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'From<span class="VerySmallBoldGreyContent marginRight5" id="department-milestoneList-'+id+'_fromDate">'+$.datepicker.formatDate('d M yy',new Date(fromDate))+'</span>'+
						'<div>'+
							'To<span class="VerySmallBoldGreyContent" id="department-milestoneList-'+id+'_toDate">'+$.datepicker.formatDate('d M yy',new Date(toDate))+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="col-sm-2 repufactor">'+
					'<div class="MediumBoldDarkBlueContent"><div style="font-size: 14px;">Department score</div>'+currentRepufactor+'%</div>'+
					'<input type="hidden" id="department-milestoneList-'+id+'_departmentRepufact" value="'+currentRepufactor+'">'+
					'</div>'+
					'<div class="col-sm-3">'+
					'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
					'<input type="hidden" id="department-milestoneList-'+id+'_mileStonePercentage" value="'+mileStonePercentage+'">'+
					'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
							if(trajectoryChange>0.0){
								html+=	'Target Change <span class="PositiveChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange==0.0){
								html+=	'Target Change <span class="NoChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange<0.0){
								html+=	'Target Change <span class="NegativeChangeLeftAlign">'+trajectoryChange+'%</span>';
							}
	html+=		    '</div>'+
					'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent">Days Remaining</div>'+
						'<div class="MediumBoldDarkBlueContent">'+daysRemaining+'</div>'+
					'</div>'+
					
					'<div class="col-sm-1">'+
						'<button type="button" class="btn btn-xs editMilestoneButton" onclick="editDepartmentMileStone('+id+')">'+
							'<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>'+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="panel-body addMilestone" id="editDepartmentMileStoneDivId_'+id+'" style="display: none;"></div>'+
			'</div>'+
			'</div>';
		return html;	
}
/**************************************************************************************************************************
 *                     Edit Department MileStone                                                                         *
 **************************************************************************************************************************/
function editDepartmentMileStone(id){
	var headerHtml = "";
	var bodyHtml = "";
	$('#editManageMileStoneModalHeader,#editManageMileStoneModalBody').html('');
	/****************Appending Header Data***************************************************************/
	headerHtml+=	'<h4>Are you sure you want to set up a new milestone?</h4>';
	headerHtml+=	'<button type="button" class="btn btn-warning" onclick="editDeptMileStone('+id+')">Yes</button>';
	headerHtml+=	'<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
	/***********************************Appending Body****************************************************/
	var organizationName = $('#department-milestoneList-'+id+'_departmentName').text();
	var fromDate = $('#department-milestoneList-'+id+'_fromDate').text();
	var toDate = $('#department-milestoneList-'+id+'_toDate').text();
	var currentRepufactor = parseFloat($('#department-milestoneList-'+id+'_departmentRepufact').val());
	currentRepufactor = currentRepufactor.toFixed(2);
	var mileStonePercentage = parseInt($('#department-milestoneList-'+id+'_mileStonePercentage').val());
	bodyHtml+=	'<hr>';
	bodyHtml+= '<div class="row">'
	bodyHtml+= '<div class="col-xs-12 MediumBoldGreyContent">'+organizationName+'</div>';
	bodyHtml+= '</div>';
	/*****************************From Date & ToDate***********************************************************/
	bodyHtml+= '<div class="row MilestoneValues">';
	bodyHtml+= '<div class="col-sm-2 SmallDarkGreyHeader" style="width:150px;">';
	bodyHtml+= 'From <span class="VerySmallBoldGreyContent marginRight5">'+fromDate+'</span>';
	bodyHtml+= '<div>';
	bodyHtml+= 'To <span class="VerySmallBoldGreyContent">'+toDate+'</span>';
	bodyHtml+= '</div>';
	bodyHtml+= '</div>';
	/***********************MileStone Value***********************************************************************/
	bodyHtml+=	'<div class="col-sm-3">';
	bodyHtml+=	'<div class="MilestoneBlue">MileStone '+mileStonePercentage+'%</div>'
	bodyHtml+=	'</div>';
	/*************************Deparmtnet*************************************************************************/
	bodyHtml+=	'<div class="col-sm-2 repufactor">';
	bodyHtml+=	'<div class="MediumBoldDarkBlueContent"><div style="font-size: 14px;">Department score</div>'+currentRepufactor+'%</div>'
	bodyHtml+=	'</div>';
	bodyHtml+=	'</div>';//End Of row MileStoneValues
	$('#editManageMileStoneModalHeader').append(headerHtml);
	$('#editManageMileStoneModalBody').append(bodyHtml);
	$('#editManageMileStoneModal').modal('show');
	
}

function editDeptMileStone(id){
	$('#editManageMileStoneModal').modal('hide');
	loadingForDashBoard();
	var divId = $('#editDepartmentMileStoneDivId_'+id);
	$('#editDepartmentMileStoneSuccessDiv').hide();
	divId.html('');
	var JSONObject = {'id':id,'factorName':departmentModule};
	$.post(mileStoneUrl+"edit.htm",JSONObject,function(response){
		if(response.status="EDIT_SUCCESS"){
			divId.append(editDepartmentMileStoneForm(response));
			addDatePickers(id,departmentModule);
			divId.show(600);
		}else{
			divId.append('MileStone Data Not Found');
			divId.show(600);
		}
		unloadingForDashBoard();
		
	},'json').fail(function(response){
		var errorObject = jQuery.parseJSON(response.responseText);
		//$('#wrapper').mask(errorObject.errorMessage);
		$('#customExceptionModal')
		.find('.modal-header h3').html(errorObject.errorMessage).end()
		.find('.modal-body p>strong').html(errorObject.errorMessage).end()
		.find('.modal-body p>em').html(errorObject.errorMessage).end()
		.find('.modal-body p>span').html(errorObject.errorMessage).end()
		.modal('show');
		unloadingForDashBoard();

	});
	return false;
}

function editDepartmentMileStoneForm(response){
	var departmentMileStone = response.successObject.milestone;
	var competitorsList = response.successObject.departmentCompetitorsRepufact.competitorDepartmentRepufactors;
	var departmentRepufact =  response.successObject.departmentCompetitorsRepufact.repufactForOrganization;
	var departmentRepufactScore = departmentRepufact.repufactor;
	departmentRepufactScore = parseFloat(departmentRepufactScore);
	departmentRepufactScore = departmentRepufactScore.toFixed(2);
	var id = departmentMileStone.id;
	var divId = 'editDepartmentMileStoneDivId_'+id;
	divId = "'"+divId+"'";
	var errorDivId = "editDepartmentMileStoneErrorDiv_"+id;
	errorDivId = "'"+errorDivId+"'";
	var departmentName = departmentMileStone.departmentName;
	var departmentId = departmentMileStone.departmentId;
	var fromDate = $.datepicker.formatDate('d M yy',new Date(departmentMileStone.setFromDate));
	var toDate = $.datepicker.formatDate('d M yy',new Date(departmentMileStone.setToDate));
	var hiddenFromDate = $.datepicker.formatDate('yy-mm-dd',new Date(departmentMileStone.setFromDate));
	var hiddenToDate = $.datepicker.formatDate('yy-mm-dd',new Date(departmentMileStone.setToDate));
	var mileStonePercentage = departmentMileStone.setPercentage;
	var html = "";
	html+=	'<div class="row">';
	html+=	'<div class="col-xs-6 form-horizontal">';
	html+=	'<form id="editDepartmentMileStonesForm_'+id+'">';
	html+=	appendErrorDiv(errorDivId);
	html+=		'<div class="form-group" id="Edit-Department-departmentId-Error-'+id+'">';
	html+=		'<label class="col-xs-3 control-label">Department<span class="mandatoryField">*</span></label>';
	html+=			'<div class=" col-xs-9">';
	html+=				'<select class="form-control input-sm" id="editMileStoneDepartmentId_'+id+'" disabled="disabled">';
	html+=					'<option value='+departmentId+'>'+departmentName+'</option>';
	html+=				'</select>';
	html+=				'</div>';
	html+=		'</div>';
	//***********************************************From Date*************************************************//
	html+=	'<div class="form-group" id="Edit-Department-setFromDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+fromDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneDepartmentFromDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Department-setFromDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenFromDate+'" id="altEditMileStoneDepartmentFromDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+
	//***********************************************To Date*************************************************//
			'<div class="form-group" id="Edit-Department-setToDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+toDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneDepartmentToDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Department-setToDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenToDate+'" id="altEditMileStoneDepartmentToDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+	
	//******************************************Percentage*************************************************//
			'<div class="form-group" id="Edit-Department-setPercentage-Error-'+id+'">'+
			'<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>'+
				'<div class=" col-xs-9">'+
					'<div class="">'+
						'<input placeholder="Select Date" class="form-control-sm" id="editSetPercentage_'+id+'" value='+mileStonePercentage+'>'+
						'<span style="color: #a94442" id="edit-Department-setPercentage-span-Error-'+id+'" class="help-inline"></span>'+
					'</div>'+
				'</div>'+
		'</div>'+	
		'<div class="col-xs-offset-3 col-xs-9">'+
			'<input type="button" class="btn btn-default btn-xs btn-blue" value="Update MileStone" onclick="updateDepartmentMileStone('+id+')"> '+
			'<button class="btn btn-xs" type="button" onclick="hideForm('+divId+')">Cancel</button>'+
		'</div>'+
		'</form></div>'+
					'<div class="col-xs-offset-2 col-xs-4">'+
					'<div class="ActualScoreForAddMilestone">Rating Score Index</div>'+
						'<div class="SmallDarkGreyHeader yourRepufactor">'+departmentRepufact.organizationName+" "+departmentRepufact.factorName+" "+departmentRepufactScore+'</div>';
				if(competitorsList.length>0){
					for(var i=0;i<competitorsList.length;i++){
						var competitorName = competitorsList[i].organizationName;
						var competitorRepufact = competitorsList[i].repufactor;
						competitorRepufact = parseFloat(competitorRepufact);
						competitorRepufact = competitorRepufact.toFixed(2);
						html+= '<div class="SmallDarkGreyHeader">'+	competitorName+">"+departmentRepufact.factorName+" "+competitorRepufact+'<div>';
					}
				}else{
					html+='<div class="SmallDarkGreyHeader"><font style="color: red;">No competitor has been mapped to this Department</font></div>';
			
				}
				html+=	'</div>';
				html+=	'</div>';
		return html;
}


function updateDepartmentMileStone(id){
	loadingForDashBoard();
	var addOrEdit = "Edit";
	var successDivId = "editDepartmentMileStoneSuccessDiv";
	var formId = "editDepartmentMileStonesForm_"+id;
	var errorDivId = "editDepartmentMileStoneErrorDiv_"+id;
	clearErrorDivs(successDivId,errorDivId,formId);//Passing Error And Success Div Id's For Clearing Errors.
	var departmentId = $('#editMileStoneDepartmentId_'+id).val();
	var fromDate = $('#altEditMileStoneDepartmentFromDate_'+id).val();
	var toDate = $('#altEditMileStoneDepartmentToDate_'+id).val();
	var mileStonePercentage = $('#editSetPercentage_'+id).val();
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	var factorName = departmentModule;
	if(mileStonePercentage==""){
		mileStonePercentage = 0.0;
	}
	var JSONObject = {'id':id,'departmentId':departmentId,'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStonePercentage,'factorName':departmentModule,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	console.log(JSONObject);
	$.post(mileStoneUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editDepartmentMileStoneSuccessDiv').show(600);
			var divId = 'editDepartmentMileStoneDivId_'+id;
			hideForm(divId);
			$( "div" ).remove('#department-milestoneList-'+id,'slow');
			listMileStones(response, departmentCollapsableDivId);
			unloadingForDashBoard();
		}else{
			appendUpdateErrors(errorDivId, response, addOrEdit,id,departmentModule);
			unloadingForDashBoard();
		}
	}).fail(function(response){
		jqueryPostError(response);
	})
}


/****************************************************************************************************************************************
 *******************************************************Add KPI MileStone*********************************************************
 ****************************************************************************************************************************************/
$('#addKpiMileStonesForm').unbind().bind('submit',function(){
	var formId = "addKpiMileStonesForm";
	loadingForDashBoard();
	var addOrEdit = "Add";
	var errorDivId = "addKpiMileStoneErrorDiv";
	var successDivId = "addKpiMileStoneSuccessDiv";
	clearErrorDivs(successDivId,errorDivId,"addKpiMileStonesForm");//Passing Error And Success Div Id's For Clearing Errors.
	var fromDate = $('#altMileStoneKpiFromDate').val();
	var toDate = $('#altMileStoneKpiToDate').val();
	var mileStonePercentage = $('#kpiSetPercentage').val();
	if(mileStonePercentage==""){
		mileStonePercentage = 0.0;
	}
	var kpiId = $('#mileStoneKpiId option:selected').val();
	var organizationId = $('#mileStoneOrganizationId option:selected').val();
	var factorName = kpiModule;
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	var JSONObject = {'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStonePercentage,'kpiId':kpiId,'factorName':factorName,'organizationId':organizationId,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	$.post(mileStoneUrl+"add.htm",JSONObject,function(response){
		if(response.status=="SAVE_ERROR"){
			addErrors(errorDivId, response, addOrEdit,kpiModule);
			unloadingForDashBoard();
		}else if(response.status=="SAVE_SUCCESS"){
			$('#'+successDivId).show(600);
			resetMileStoneForm(formId,"Kpi");
			updateKpiDropDown(response);
			listKpiMileStones(response, kpiCollapsableDivId);
			unloadingForDashBoard();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
});
function updateKpiDropDown(response){
	var formId = "addKpiMileStonesForm";
	var kpiDropDownId = "mileStoneKpiId";
	$('#'+formId).find('#Add-Kpi-kpiId-Error').removeClass('has-error has-feedback');
	$('#'+kpiDropDownId).html('');
	var kpis = response.successObject.listKpisForMileStones;
	var kpisLength = kpis.length;
	if(kpisLength>0){
		$('#'+kpiDropDownId).append('<option value=0>Select a KPI</option>');
		for(var i=0;i<kpisLength;i++){
			var id = kpis[i].id;
			var kpiName = kpis[i].kpiName;
			$('#'+kpiDropDownId).append('<option value='+id+'>'+kpiName+'</option>');
		}
	}else{
		$('input[type=submit]', $('#'+formId)).prop('disabled', false);
		$('input[type=submit]', $('#'+formId)).removeClass('btn btn-default btn-xs btn-blue');
		$('input[type=submit]', $('#'+formId)).removeClass('btn btn-default btn-xs btn-red');
		$('input[type=submit]', $('#'+formId)).prop('disabled', true);
		$('input[type=submit]', $('#'+formId)).addClass('btn btn-default btn-xs btn-red');
		$('#'+formId).find('#Add-Kpi-kpiId-Error').addClass('has-error has-feedback');
		var message = '<font style="color:red">No KPI(s) Found</font>';
		$('#'+kpiDropDownId).prop('disabled',true);
		$('#'+kpiDropDownId).append('<option>'+message+'</option>');
	}
	
}

function listKpiMileStones(response,divId){
	var mileStone = response.successObject.milestone;
	var currentRepufactor = response.successObject.currentRepufactor;
	$('#'+kpiCollapsableDivId+' div:eq(0)').after(appendKpisDiv(mileStone,currentRepufactor));
	$('#kpiEmptyMileStone').hide(600);//Hide Empty Div
}

function appendKpisDiv(mileStone,currentRepufactor){
	var html = "";
	var kpiName = mileStone.kpiName;
	var fromDate = mileStone.setFromDate;
	var toDate = mileStone.setToDate;
	var trajectoryChange = parseFloat(mileStone.trajectoryChange).toFixed(2);
	var daysRemaining = mileStone.daysRemaining;
	var mileStonePercentage = parseFloat(mileStone.setPercentage).toFixed(2);
	var id = mileStone.id;
	currentRepufactor = parseFloat(currentRepufactor);
	currentRepufactor = currentRepufactor.toFixed(2);
	html+=	'<div id="KpiMileStonesList">';
	html+=	'<div class="panel-body" id="kpi-milestoneList-'+id+'">'+
				'<div class="row">'+
					'<div class="col-xs-12 MediumBoldGreyContent" id="kpi-milestoneList-'+id+'_kpiName">'+kpiName+'</div>'+
				'</div>'+
				'<div class="row MilestoneValues">'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'From<span class="VerySmallBoldGreyContent marginRight5" id="kpi-milestoneList-'+id+'_fromDate">'+$.datepicker.formatDate('d M yy',new Date(fromDate))+'</span>'+
						'<div>'+
							'To<span class="VerySmallBoldGreyContent" id="kpi-milestoneList-'+id+'_toDate">'+$.datepicker.formatDate('d M yy',new Date(toDate))+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="col-sm-2 repufactor">'+
					'<div class="MediumBoldDarkBlueContent"><img src="../resources/images/ComparativeAnalysisKpifactor.png">'+currentRepufactor+'%</div>'+
					'<input type="hidden" value="'+currentRepufactor+'" id="kpi-milestoneList-'+id+'_kpiRepufact">'+
				'</div>'+
				'<div class="col-sm-3">'+
				'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
				'<input type="hidden" value="'+mileStonePercentage+'" id="kpi-milestoneList-'+id+'_mileStonePercentage">'+
				'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
							if(trajectoryChange>0.0){
								html+=	'Target Change <span class="PositiveChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange==0.0){
								html+=	'Target Change <span class="NoChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange<0.0){
								html+=	'Target Change <span class="NegativeChangeLeftAlign">'+trajectoryChange+'%</span>';
							}
	html+=		    '</div>'+
					'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent">Days Remaining</div>'+
						'<div class="MediumBoldDarkBlueContent">'+daysRemaining+'</div>'+
					'</div>'+
					
				
					'<div class="col-sm-1">'+
						'<button type="button" class="btn btn-xs editMilestoneButton" onclick="editKpiMileStone('+id+')">'+
							'<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>'+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="panel-body addMilestone" id="editKpiMileStoneDivId_'+id+'" style="display: none;"></div>'+
			'</div></div>';
		return html;	
}
/**************************************************************************************************************************
 *                     Edit KPI MileStone                                                                         *
 **************************************************************************************************************************/
function editKpiMileStone(id){
	var headerHtml = "";
	var bodyHtml = "";
	$('#editManageMileStoneModalHeader,#editManageMileStoneModalBody').html('');
	/****************Appending Header Data***************************************************************/
	headerHtml+=	'<h4>Are you sure you want to set up a new milestone?</h4>';
	headerHtml+=	'<button type="button" class="btn btn-warning" onclick="editKpiMileStoneConfirm('+id+')">Yes</button>';
	headerHtml+=	'<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
	/***********************************Appending Body****************************************************/
	var organizationName = $('#kpi-milestoneList-'+id+'_kpiName').text();
	var fromDate = $('#kpi-milestoneList-'+id+'_fromDate').text();
	var toDate = $('#kpi-milestoneList-'+id+'_toDate').text();
	var currentRepufactor = parseFloat($('#kpi-milestoneList-'+id+'_kpiRepufact').val());
	currentRepufactor = currentRepufactor.toFixed(2);
	var mileStonePercentage = parseInt($('#kpi-milestoneList-'+id+'_mileStonePercentage').val());
	bodyHtml+=	'<hr>';
	bodyHtml+= '<div class="row">'
	bodyHtml+= '<div class="col-xs-12 MediumBoldGreyContent">'+organizationName+'</div>';
	bodyHtml+= '</div>';
	/*****************************From Date & ToDate***********************************************************/
	bodyHtml+= '<div class="row MilestoneValues">';
	bodyHtml+= '<div class="col-sm-2 SmallDarkGreyHeader" style="width:150px;">';
	bodyHtml+= 'From <span class="VerySmallBoldGreyContent marginRight5">'+fromDate+'</span>';
	bodyHtml+= '<div>';
	bodyHtml+= 'To <span class="VerySmallBoldGreyContent">'+toDate+'</span>';
	bodyHtml+= '</div>';
	bodyHtml+= '</div>';
	/***********************MileStone Value***********************************************************************/
	bodyHtml+=	'<div class="col-sm-3">';
	bodyHtml+=	'<div class="MilestoneBlue">MileStone '+mileStonePercentage+'%</div>'
	bodyHtml+=	'</div>';
	/*************************Repufactor*************************************************************************/
	bodyHtml+=	'<div class="col-sm-2 repufactor">';
	bodyHtml+=	'<div class="SmallBoldGreyContent"><img src="../resources/images/ComparativeAnalysisKpifactor.png"/>'+currentRepufactor+'%</div>'
	bodyHtml+=	'</div>';
	bodyHtml+=	'</div>';//End Of row MileStoneValues
	$('#editManageMileStoneModalHeader').append(headerHtml);
	$('#editManageMileStoneModalBody').append(bodyHtml);
	$('#editManageMileStoneModal').modal('show');
	
}

function editKpiMileStoneConfirm(id){
	$('#editManageMileStoneModal').modal('hide');
	loadingForDashBoard();
	var divId = $('#editKpiMileStoneDivId_'+id);
	$('#editKpiMileStoneSuccessDiv').hide();
	divId.html('');
	var JSONObject = {'id':id,'factorName':kpiModule};
	$.post(mileStoneUrl+"edit.htm",JSONObject,function(response){
		if(response.status="EDIT_SUCCESS"){
			console.log(response);
			divId.append(editKpiMileStoneForm(response));
			addDatePickers(id,kpiModule);
			divId.show(600);
		}else{
			divId.append('MileStone Data Not Found');
			divId.show(600);
		}
		unloadingForDashBoard();
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
}

function editKpiMileStoneForm(response){
	console.log(response);
	var kpiMileStone = response.successObject.milestone;
	var competitorsList = response.successObject.kpiCompetitorsRepufact.competitorKpiRepufactors;
	var kpiRepufact =  response.successObject.kpiCompetitorsRepufact.kpiRepufactCalculation;
	var kpiRepufactScore = kpiRepufact.repufactor;
	kpiRepufactScore = parseFloat(kpiRepufactScore);
	kpiRepufactScore = kpiRepufactScore.toFixed(2);
	var id = kpiMileStone.id;
	var divId = 'editKpiMileStoneDivId_'+id;
	divId = "'"+divId+"'";
	var errorDivId = "editKpiMileStoneErrorDiv_"+id;
	errorDivId = "'"+errorDivId+"'";
	var kpiName = kpiMileStone.kpiName;
	var kpiId = kpiMileStone.kpiId;
	var fromDate = $.datepicker.formatDate('d M yy',new Date(kpiMileStone.setFromDate));
	var toDate = $.datepicker.formatDate('d M yy',new Date(kpiMileStone.setToDate));
	var hiddenFromDate = $.datepicker.formatDate('yy-mm-dd',new Date(kpiMileStone.setFromDate));
	var hiddenToDate = $.datepicker.formatDate('yy-mm-dd',new Date(kpiMileStone.setToDate));
	var mileStonePercentage = kpiMileStone.setPercentage;
	var html = "";
	html+=	'<div class="row">';
	html+=	'<div class="col-xs-6 form-horizontal">';
	html+=	'<form id="editDepartmentMileStonesForm_'+id+'">';
	html+=	appendErrorDiv(errorDivId);
	html+=		'<div class="form-group" id="Edit-Kpi-kpiId-Error-'+id+'">';
	html+=		'<label class="col-xs-3 control-label">KPI<span class="mandatoryField">*</span></label>';
	html+=			'<div class=" col-xs-9">';
	html+=				'<select class="form-control input-sm" id="editMileStoneKpiId_'+id+'" disabled="disabled">';
	html+=					'<option value='+kpiId+'>'+kpiName+'</option>';
	html+=				'</select>';
	html+=				'</div>';
	html+=		'</div>';
	//***********************************************From Date*************************************************//
	html+=	'<div class="form-group" id="Edit-Kpi-setFromDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+fromDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneKpiFromDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Kpi-setFromDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenFromDate+'" id="altEditMileStoneKpiFromDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+
	//***********************************************To Date*************************************************//
			'<div class="form-group" id="Edit-Kpi-setToDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+toDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneKpiToDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Kpi-setToDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenToDate+'" id="altEditMileStoneKpiToDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+	
	//******************************************Percentage*************************************************//
			'<div class="form-group" id="Edit-Kpi-setPercentage-Error-'+id+'">'+
			'<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>'+
				'<div class=" col-xs-9">'+
					'<div class="">'+
						'<input placeholder="Select Date" class="form-control-sm" id="editKpiSetPercentage_'+id+'" value='+mileStonePercentage+'>'+
						'<span style="color: #a94442" id="edit-Kpi-setPercentage-span-Error-'+id+'" class="help-inline"></span>'+
					'</div>'+
				'</div>'+
		'</div>'+	
		'<div class="col-xs-offset-3 col-xs-9">'+
			'<input type="button" class="btn btn-default btn-xs btn-blue" value="Update MileStone" onclick="updateKpiMileStone('+id+')"> '+
			'<button class="btn btn-xs" type="button" onclick="hideForm('+divId+')">Cancel</button>'+
		'</div>'+
		'</form></div>'+
		'<div class="col-xs-offset-2 col-xs-4">'+
		'<div class="ActualScoreForAddMilestone">Rating Score Index</div>'+
			'<div class="SmallDarkGreyHeader yourRepufactor">'+kpiRepufact.organizationName+" "+kpiRepufact.factorName+" "+kpiRepufactScore+'</div>';
				if(competitorsList.length>0){
					for(var i=0;i<competitorsList.length;i++){
						var competitorName = competitorsList[i].organizationName;
						var competitorRepufact = competitorsList[i].repufactor;
						competitorRepufact = parseFloat(competitorRepufact);
						competitorRepufact = competitorRepufact.toFixed(2);
						html+= '<div class="SmallDarkGreyHeader">'+	competitorName+">"+kpiRepufact.factorName+" "+competitorRepufact+'<div>';
					}
				}else{
					html+='<div class="SmallDarkGreyHeader"><font style="color: red;">No competitor has been mapped to this KPI</font></div>';
			
				}
				html+=	'</div>';
				html+=	'</div>';
	return html;
}


function updateKpiMileStone(id){
	loadingForDashBoard();
	var addOrEdit = "Edit";
	var successDivId = "editKpiMileStoneSuccessDiv";
	var formId = "editKpiMileStonesForm_"+id;
	var errorDivId = "editKpiMileStoneErrorDiv_"+id;
	clearErrorDivs(successDivId,errorDivId,formId);//Passing Error And Success Div Id's For Clearing Errors.
	var kpiId = $('#editMileStoneKpiId_'+id).val();
	var fromDate = $('#altEditMileStoneKpiFromDate_'+id).val();
	var toDate = $('#altEditMileStoneKpiToDate_'+id).val();
	var mileStonePercentage = $('#editKpiSetPercentage_'+id).val();
	var factorName = kpiModule;
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	if(mileStonePercentage==""){
		mileStonePercentage = 0.0;
	}
	var JSONObject = {'id':id,'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStonePercentage,'kpiId':kpiId,'factorName':kpiModule,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	$.post(mileStoneUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editKpiMileStoneSuccessDiv').show(600);
			var divId = 'editKpiMileStoneDivId_'+id;
			hideForm(divId);
			$( "div" ).remove('#kpi-milestoneList-'+id,'slow');
			listKpiMileStones(response, kpiCollapsableDivId);
			unloadingForDashBoard();
		}else{
			appendUpdateErrors(errorDivId, response, addOrEdit,id,kpiModule);
			unloadingForDashBoard();
		}
	}).fail(function(response){
		jqueryPostError(response);
	})
}
/****************************************************************************************************************************************
 *******************************************************Add Source MileStone*********************************************************
 ****************************************************************************************************************************************/
$('#addSourceMileStonesForm').unbind().bind('submit',function(){
	var formId = "addSourceMileStonesForm";
	loadingForDashBoard();
	var addOrEdit = "Add";
	var errorDivId = "addSourceMileStoneErrorDiv";
	var successDivId = "addSourceMileStoneSuccessDiv";
	clearErrorDivs(successDivId,errorDivId,"addSourceMileStonesForm");//Passing Error And Success Div Id's For Clearing Errors.
	var fromDate = $('#altMileStoneSourceFromDate').val();
	var toDate = $('#altMileStoneSourceToDate').val();
	var mileStonePercentage = $('#sourceSetPercentage').val();
	if(mileStonePercentage==""){
		mileStonePercentage = 0.0;
	}
	var sourceId = $('#mileStoneSourceId option:selected').val();
	var organizationId = $('#mileStoneOrganizationId option:selected').val();
	var factorName = sourceModule;
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	var JSONObject = {'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStonePercentage,'sourceId':sourceId,'factorName':factorName,'organizationId':organizationId,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	$.post(mileStoneUrl+"add.htm",JSONObject,function(response){
		if(response.status=="SAVE_ERROR"){
			addErrors(errorDivId, response, addOrEdit,sourceModule);
			unloadingForDashBoard();
		}else if(response.status=="SAVE_SUCCESS"){
			$('#'+successDivId).show(600);
			resetMileStoneForm(formId,"Source");
			updateSourceDropDown(response);
			listSourceMileStones(response, sourceCollapsableDivId);
			unloadingForDashBoard();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
});
function updateSourceDropDown(response){
	var formId = "addSourceMileStonesForm";
	var sourceDropDownId = "mileStoneSourceId";
	$('#'+formId).find('#Add-Source-sourceId-Error').removeClass('has-error has-feedback');
	$('#'+sourceDropDownId).html('');
	var sources = response.successObject.listSourcesForMileStones;
	var sourcesLength = sources.length;
	if(sourcesLength>0){
		$('#'+sourceDropDownId).append('<option value=0>Select a Source</option>');
		for(var i=0;i<sourcesLength;i++){
			var id = sources[i].id;
			var sourceName = sources[i].sourceName;
			$('#'+sourceDropDownId).append('<option value='+id+'>'+sourceName+'</option>');
		}
	}else{
		$('input[type=submit]', $('#'+formId)).prop('disabled', false);
		$('input[type=submit]', $('#'+formId)).removeClass('btn btn-default btn-xs btn-blue');
		$('input[type=submit]', $('#'+formId)).removeClass('btn btn-default btn-xs btn-red');
		$('input[type=submit]', $('#'+formId)).prop('disabled', true);
		$('input[type=submit]', $('#'+formId)).addClass('btn btn-default btn-xs btn-red');
		$('#'+formId).find('#Add-Source-sourceId-Error').addClass('has-error has-feedback');
		var message = '<font style="color:red">No Sources Found</font>';
		$('#'+sourceDropDownId).prop('disabled',true);
		$('#'+sourceDropDownId).append('<option>'+message+'</option>');
	}
	
}

function listSourceMileStones(response,divId){
	var mileStone = response.successObject.milestone;
	var currentRepufactor = response.successObject.currentRepufactor;
	$('#'+sourceCollapsableDivId+' div:eq(0)').after(appendSourcesDiv(mileStone,currentRepufactor));
	$('#sourceEmptyMileStone').hide(600);//Hide Empty Div
}

function appendSourcesDiv(mileStone,currentRepufactor){
	var html = "";
	var sourceName = mileStone.sourceName;
	var fromDate = mileStone.setFromDate;
	var toDate = mileStone.setToDate;
	var trajectoryChange = parseFloat(mileStone.trajectoryChange).toFixed(2);
	var daysRemaining = mileStone.daysRemaining;
	var mileStonePercentage = parseFloat(mileStone.setPercentage).toFixed(2);
	var id = mileStone.id;
	currentRepufactor = parseFloat(currentRepufactor);
	currentRepufactor = currentRepufactor.toFixed(2);
	html+=	'<div id="SourceMileStonesList">';
	html+=	'<div class="panel-body" id="source-milestoneList-'+id+'">'+
				'<div class="row">'+
					'<div class="col-xs-12 MediumBoldGreyContent" id="source-milestoneList-'+id+'_sourceName">'+sourceName+'</div>'+
				'</div>'+
				'<div class="row MilestoneValues">'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'From<span class="VerySmallBoldGreyContent marginRight5" id="source-milestoneList-'+id+'_fromDate">'+$.datepicker.formatDate('d M yy',new Date(fromDate))+'</span>'+
						'<div>'+
							'To<span class="VerySmallBoldGreyContent" id="source-milestoneList-'+id+'_toDate">'+$.datepicker.formatDate('d M yy',new Date(toDate))+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="col-sm-2 repufactor">'+
					'<div class="SmallBoldGreyContent"><div style="font-size: 14px;">Source Score</div>'+currentRepufactor+'%</div>'+
					'<input type="hidden" value="'+currentRepufactor+'" id="source-milestoneList-'+id+'_kpiRepufact">'+
				'</div>'+
				'<div class="col-sm-3">'+
					'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
					'<input type="hidden" value="'+mileStonePercentage+'" id="source-milestoneList-'+id+'_mileStonePercentage">'+
				'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
							if(trajectoryChange>0.0){
								html+=	'Target Change <span class="PositiveChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange==0.0){
								html+=	'Target Change <span class="NoChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange<0.0){
								html+=	'Target Change <span class="NegativeChangeLeftAlign">'+trajectoryChange+'%</span>';
							}
	html+=		    '</div>'+
					'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent">Days Remaining</div>'+
						'<div class="MediumBoldDarkBlueContent">'+daysRemaining+'</div>'+
					'</div>'+
					'<div class="col-sm-1">'+
						'<button type="button" class="btn btn-xs editMilestoneButton" onclick="editSourceMileStone('+id+')">'+
							'<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>'+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="panel-body addMilestone" id="editSourceMileStoneDivId_'+id+'" style="display: none;"></div>'+
			'</div></div>';
		return html;	
}
/**************************************************************************************************************************
 *                     Edit Source MileStone                                                                         *
 **************************************************************************************************************************/
function editSourceMileStone(id){
	var headerHtml = "";
	var bodyHtml = "";
	$('#editManageMileStoneModalHeader,#editManageMileStoneModalBody').html('');
	/****************Appending Header Data***************************************************************/
	headerHtml+=	'<h4>Are you sure you want to set up a new milestone?</h4>';
	headerHtml+=	'<button type="button" class="btn btn-warning" onclick="editSrcMileStone('+id+')">Yes</button>';
	headerHtml+=	'<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
	/***********************************Appending Body****************************************************/
	var organizationName = $('#source-milestoneList-'+id+'_sourceName').text();
	var fromDate = $('#source-milestoneList-'+id+'_fromDate').text();
	var toDate = $('#source-milestoneList-'+id+'_toDate').text();
	var currentRepufactor = parseFloat($('#source-milestoneList-'+id+'_sourceRepufact').val());
	currentRepufactor = currentRepufactor.toFixed(2);
	var mileStonePercentage = parseInt($('#source-milestoneList-'+id+'_mileStonePercentage').val());
	bodyHtml+=	'<hr>';
	bodyHtml+= '<div class="row">'
	bodyHtml+= '<div class="col-xs-12 MediumBoldGreyContent">'+organizationName+'</div>';
	bodyHtml+= '</div>';
	/*****************************From Date & ToDate***********************************************************/
	bodyHtml+= '<div class="row MilestoneValues">';
	bodyHtml+= '<div class="col-sm-2 SmallDarkGreyHeader" style="width:150px;">';
	bodyHtml+= 'From <span class="VerySmallBoldGreyContent marginRight5">'+fromDate+'</span>';
	bodyHtml+= '<div>';
	bodyHtml+= 'To <span class="VerySmallBoldGreyContent">'+toDate+'</span>';
	bodyHtml+= '</div>';
	bodyHtml+= '</div>';
	/***********************MileStone Value***********************************************************************/
	bodyHtml+=	'<div class="col-sm-3">';
	bodyHtml+=	'<div class="MilestoneBlue">MileStone '+mileStonePercentage+'%</div>'
	bodyHtml+=	'</div>';
	/*************************Repufactor*************************************************************************/
	bodyHtml+=	'<div class="col-sm-2 repufactor">';
	bodyHtml+=	'<div class="SmallBoldGreyContent"><div style="font-size: 14px;">Source Score</div>'+currentRepufactor+'%</div>'
	bodyHtml+=	'</div>';
	bodyHtml+=	'</div>';//End Of row MileStoneValues
	$('#editManageMileStoneModalHeader').append(headerHtml);
	$('#editManageMileStoneModalBody').append(bodyHtml);
	$('#editManageMileStoneModal').modal('show');
	
}

function editSrcMileStone(id){
	$('#editManageMileStoneModal').modal('hide');
	loadingForDashBoard();
	var divId = $('#editSourceMileStoneDivId_'+id);
	$('#editSourceMileStoneSuccessDiv').hide();
	divId.html('');
	var JSONObject = {'id':id,'factorName':sourceModule};
	console.log(JSONObject);
	$.post(mileStoneUrl+"edit.htm",JSONObject,function(response){
		if(response.status="EDIT_SUCCESS"){
			divId.append(editSourceMileStoneForm(response));
			addDatePickers(id,sourceModule);
			divId.show(600);
		}else{
			divId.append('MileStone Data Not Found');
			divId.show(600);
		}
		unloadingForDashBoard();
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
}

function editSourceMileStoneForm(response){
	console.log(response);
	var sourceMileStone = response.successObject.milestone;
	var competitorsList = response.successObject.sourceCompetitorsRepufact.competitorSourceRepufactors;
	var sourceRepufact =  response.successObject.sourceCompetitorsRepufact.sourceRepufactCalculation;
	var sourceRepufactScore = sourceRepufact.repufactor;
	sourceRepufactScore = parseFloat(sourceRepufactScore);
	sourceRepufactScore = sourceRepufactScore.toFixed(2);
	var id = sourceMileStone.id;
	var divId = 'editSourceMileStoneDivId_'+id;
	divId = "'"+divId+"'";
	var errorDivId = "editSourceMileStoneErrorDiv_"+id;
	errorDivId = "'"+errorDivId+"'";
	var sourceName = sourceMileStone.sourceName;
	var sourceId = sourceMileStone.sourceId;
	var fromDate = $.datepicker.formatDate('d M yy',new Date(sourceMileStone.setFromDate));
	var toDate = $.datepicker.formatDate('d M yy',new Date(sourceMileStone.setToDate));
	var hiddenFromDate = $.datepicker.formatDate('yy-mm-dd',new Date(sourceMileStone.setFromDate));
	var hiddenToDate = $.datepicker.formatDate('yy-mm-dd',new Date(sourceMileStone.setToDate));
	var mileStonePercentage = sourceMileStone.setPercentage;
	var html = "";
	html+=	'<div class="row">';
	html+=	'<div class="col-xs-6 form-horizontal">';
	html+=	'<form id="editSourceMileStonesForm_'+id+'">';
	html+=	appendErrorDiv(errorDivId);
	html+=		'<div class="form-group" id="Edit-Source-sourceId-Error-'+id+'">';
	html+=		'<label class="col-xs-3 control-label">Source<span class="mandatoryField">*</span></label>';
	html+=			'<div class=" col-xs-9">';
	html+=				'<select class="form-control input-sm" id="editMileStoneSourceId_'+id+'" disabled="disabled">';
	html+=					'<option value='+sourceId+'>'+sourceName+'</option>';
	html+=				'</select>';
	html+=				'</div>';
	html+=		'</div>';
	//***********************************************From Date*************************************************//
	html+=	'<div class="form-group" id="Edit-Source-setFromDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+fromDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneSourceFromDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Source-setFromDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenFromDate+'" id="altEditMileStoneSourceFromDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+
	//***********************************************To Date*************************************************//
			'<div class="form-group" id="Edit-Source-setToDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+toDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneSourceToDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Source-setToDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenToDate+'" id="altEditMileStoneSourceToDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+	
	//******************************************Percentage*************************************************//
			'<div class="form-group" id="Edit-Source-setPercentage-Error-'+id+'">'+
			'<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>'+
				'<div class=" col-xs-9">'+
					'<div class="">'+
						'<input placeholder="Select Date" class="form-control-sm" id="editSourceSetPercentage_'+id+'" value='+mileStonePercentage+'>'+
						'<span style="color: #a94442" id="edit-Source-setPercentage-span-Error-'+id+'" class="help-inline"></span>'+
					'</div>'+
				'</div>'+
		'</div>'+	
		'<div class="col-xs-offset-3 col-xs-9">'+
			'<input type="button" class="btn btn-default btn-xs btn-blue" value="Update MileStone" onclick="updateSourceMileStone('+id+')"> '+
			'<button class="btn btn-xs" type="button" onclick="hideForm('+divId+')">Cancel</button>'+
		'</div>'+
		'</form></div>'+
		'<div class="col-xs-offset-2 col-xs-4">'+
		'<div class="ActualScoreForAddMilestone">Rating Score Index</div>'+
			'<div class="SmallDarkGreyHeader yourRepufactor">'+sourceRepufact.organizationName+" "+sourceRepufact.factorName+" "+sourceRepufactScore+'</div>';
				if(competitorsList.length>0){
					for(var i=0;i<competitorsList.length;i++){
						var competitorName = competitorsList[i].organizationName;
						var competitorRepufact = competitorsList[i].repufactor;
						competitorRepufact = parseFloat(competitorRepufact);
						competitorRepufact = competitorRepufact.toFixed(2);
						html+= '<div class="SmallDarkGreyHeader">'+	competitorName+">"+sourceRepufact.factorName+" "+competitorRepufact+'<div>';
					}
				}else{
					html+='<div class="SmallDarkGreyHeader"><font style="color: red;">No competitor has been mapped to this Source</font></div>';
			
				}
				html+=	'</div>';
				html+=	'</div>';
				return html;
}


function updateSourceMileStone(id){
	loadingForDashBoard();
	var addOrEdit = "Edit";
	var successDivId = "editSourceMileStoneSuccessDiv";
	var formId = "editSourceMileStonesForm_"+id;
	var errorDivId = "editSourceMileStoneErrorDiv_"+id;
	clearErrorDivs(successDivId,errorDivId,formId);//Passing Error And Success Div Id's For Clearing Errors.
	var sourceId = $('#editMileStoneSourceId_'+id).val();
	var fromDate = $('#altEditMileStoneSourceFromDate_'+id).val();
	var toDate = $('#altEditMileStoneSourceToDate_'+id).val();
	var mileStonePercentage = $('#editSourceSetPercentage_'+id).val();
	var factorName = kpiModule;
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	if(mileStonePercentage==""){
		mileStonePercentage = 0.0;
	}
	var JSONObject = {'id':id,'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStonePercentage,'sourceId':sourceId,'factorName':sourceModule,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	$.post(mileStoneUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editSourceMileStoneSuccessDiv').show(600);
			var divId = 'editSourceMileStoneDivId_'+id;
			hideForm(divId);
			$( "div" ).remove('#source-milestoneList-'+id,'slow');
			listSourceMileStones(response, kpiCollapsableDivId);
			unloadingForDashBoard();
		}else{
			appendUpdateErrors(errorDivId, response, addOrEdit,id,sourceModule);
			unloadingForDashBoard();
		}
	}).fail(function(response){
		jqueryPostError(response);
	})
}

/****************************************************************************************************************************************
 *******************************************************Add Organization MileStone*******************************************************
 ****************************************************************************************************************************************/
$('#addOrganizationMileStonesForm').unbind().bind('submit',function(){
	var formId = "addOrganizationMileStonesForm";
	loadingForDashBoard();
	var addOrEdit = "Add";
	var errorDivId = "addOrganizationMileStoneErrorDiv";
	var successDivId = "addOrganizationMileStoneSuccessDiv";
	clearErrorDivs(successDivId,errorDivId,"addOrganizationMileStonesForm");//Passing Error And Success Div Id's For Clearing Errors.
	var fromDate = $('#altMileStoneOrganizationFromDate').val();
	var toDate = $('#altMileStoneOrganizationToDate').val();
	var mileStonePercentage = $('#organizationSetPercentage').val();
	if(mileStonePercentage==""){
		mileStonePercentage = 0.0;
	}
	var organizationId = $('#mileStoneOrganizationId option:selected').val();
	var factorName = organizationMoudle;
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	var JSONObject = {'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStonePercentage,'factorName':factorName,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	$.post(mileStoneUrl+"add.htm",JSONObject,function(response){
		if(response.status=="SAVE_ERROR"){
			addErrors(errorDivId, response, addOrEdit,organizationMoudle);
			unloadingForDashBoard();
		}else if(response.status=="SAVE_SUCCESS"){
			$('#'+successDivId).show(600);
			resetForm(formId);
			$('input[type=submit]', $('#addOrganizationMileStonesForm')).prop('disabled', true);
			listOrganizationMileStones(response, organizationCollapsableDivId);
			unloadingForDashBoard();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
});


function listOrganizationMileStones(response,divId){
	var mileStone = response.successObject.milestone;
	console.log(mileStone);
	var currentRepufactor = response.successObject.currentRepufactor;
	$('#'+organizationCollapsableDivId+' div:eq(0)').after(appendOrganizationDiv(mileStone,currentRepufactor));
	$('#organizationEmptyMileStone').hide(600);//Hide Empty Div
	$('#organizationAddMileStoneButton').prop('disabled',true);
}

function appendOrganizationDiv(mileStone,currentRepufactors){
	console.log(mileStone);
	var html = "";
	var organizationFullName = mileStone.organizationFullName;
	var fromDate = mileStone.setFromDate;
	var toDate = mileStone.setToDate;
	var trajectoryChange = parseFloat(mileStone.trajectoryChange).toFixed(2);
	var daysRemaining = mileStone.daysRemaining;
	var mileStonePercentage = parseFloat(mileStone.setPercentage).toFixed(2);
	var id = mileStone.id;
	currentRepufactor = mileStone.repufactor;
	currentRepufactor = currentRepufactor.toFixed(2);
	html+=	'<div class="panel-body" id="organization-milestoneList-'+id+'">'+
				'<div class="row">'+
					'<div class="col-xs-12 MediumBoldGreyContent" id="organization-milestoneList-'+id+'_organizationName">'+organizationFullName+'</div>'+
				'</div>'+
				'<div class="row MilestoneValues">'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'From<span class="VerySmallBoldGreyContent marginRight5" id="organization-milestoneList-'+id+'_fromDate">'+$.datepicker.formatDate('d M yy',new Date(fromDate))+'</span>'+
						'<div>'+
							'To<span class="VerySmallBoldGreyContent" id="organization-milestoneList-'+id+'_toDate">'+$.datepicker.formatDate('d M yy',new Date(toDate))+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="col-sm-2 repufactor">'+
						'<div class="ActualScoreForAddMilestone" >Rating Score Index'+currentRepufactor+'%</div>'+
						'<input type="hidden" id="organization-milestoneList-'+id+'_repufactor" value='+currentRepufactor+'>'+
					'</div>'+
					'<div class="col-sm-3">'+
					'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
					'<input type="hidden" id="organization-milestoneList-'+id+'_mileStonePercentage" value='+mileStonePercentage+'>'+
				'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
							if(trajectoryChange>0.0){
								html+=	'Target Change <span class="PositiveChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange==0.0){
								html+=	'Target Change <span class="NoChangeLeftAlign">'+trajectoryChange+'%</span>';
							}else if(trajectoryChange<0.0){
								html+=	'Target Change <span class="NegativeChangeLeftAlign">'+trajectoryChange+'%</span>';
							}
	html+=		    '</div>'+
					'</div>'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'<div class="VerySmallBoldGreyContent">Days Remaining</div>'+
						'<div class="MediumBoldDarkBlueContent">'+daysRemaining+'</div>'+
					'</div>'+
					'<div class="col-sm-1">'+
						'<button type="button" class="btn btn-xs editMilestoneButton" onclick="editOrganizationMileStone('+id+')">'+
							'<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>'+
						'</button>'+
					'</div>'+
				'</div>'+
				'<div class="panel-body addMilestone" id="editOrganizationMileStoneDivId_'+id+'" style="display: none;"></div>'+
			'</div>';
		return html;	
}
/**************************************************************************************************************************
 *                     Edit Organization MileStone                                                                         *
 **************************************************************************************************************************/
function editOrganizationMileStone(id){
	var headerHtml = "";
	var bodyHtml = "";
	$('#editManageMileStoneModalHeader,#editManageMileStoneModalBody').html('');
	/****************Appending Header Data***************************************************************/
	headerHtml+=	'<h4>Are you sure you want to set up a new milestone?</h4>';
	headerHtml+=	'<button type="button" class="btn btn-warning" onclick="editOrgMileStone('+id+')">Yes</button>';
	headerHtml+=	'<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>';
	/***********************************Appending Body****************************************************/
	var organizationName = $('#organization-milestoneList-'+id+'_organizationName').text();
	var fromDate = $('#organization-milestoneList-'+id+'_fromDate').text();
	var toDate = $('#organization-milestoneList-'+id+'_toDate').text();
	var currentRepufactor = parseFloat($('#organization-milestoneList-'+id+'_repufactor').val());
	currentRepufactor = currentRepufactor.toFixed(2);
	var mileStonePercentage = parseInt($('#organization-milestoneList-'+id+'_mileStonePercentage').val());
	bodyHtml+=	'<hr>';
	bodyHtml+= '<div class="row">'
	bodyHtml+= '<div class="col-xs-12 MediumBoldGreyContent">'+organizationName+'</div>';
	bodyHtml+= '</div>';
	/*****************************From Date & ToDate***********************************************************/
	bodyHtml+= '<div class="row MilestoneValues">';
	bodyHtml+= '<div class="col-sm-2 SmallDarkGreyHeader" style="width:150px;">';
	bodyHtml+= 'From <span class="VerySmallBoldGreyContent marginRight5">'+fromDate+'</span>';
	bodyHtml+= '<div>';
	bodyHtml+= 'To <span class="VerySmallBoldGreyContent">'+toDate+'</span>';
	bodyHtml+= '</div>';
	bodyHtml+= '</div>';
	/***********************MileStone Value***********************************************************************/
	bodyHtml+=	'<div class="col-sm-3">';
	bodyHtml+=	'<div class="MilestoneBlue">MileStone '+mileStonePercentage+'%</div>'
	bodyHtml+=	'</div>';
	/*************************Repufactor*************************************************************************/
	bodyHtml+=	'<div class="col-sm-2 repufactor">';
	bodyHtml+=	'<div class="ActualScoreForMilestone">'+currentRepufactor+'%</div>'
	bodyHtml+=	'</div>';
	bodyHtml+=	'</div>';//End Of row MileStoneValues
	$('#editManageMileStoneModalHeader').append(headerHtml);
	$('#editManageMileStoneModalBody').append(bodyHtml);
	$('#editManageMileStoneModal').modal('show');
	
}

function editOrgMileStone(id){
	$('#editManageMileStoneModal').modal('hide');
	loadingForDashBoard();
	var divId = $('#editOrganizationMileStoneDivId_'+id);
	$('#editOrganizationMileStoneSuccessDiv').hide();
	divId.html('');
	var JSONObject = {'id':id,'factorName':organizationMoudle};
	$.post(mileStoneUrl+"edit.htm",JSONObject,function(response){
		if(response.status="EDIT_SUCCESS"){
			console.log(response);
			divId.append(editOrganizationMileStoneForm(response));
			addDatePickers(id,organizationMoudle);
			divId.show(600);
		}else{
			divId.append('MileStone Data Not Found');
			divId.show(600);
		}
		unloadingForDashBoard();
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
}

function editOrganizationMileStoneForm(response){
	var organizationModule = response.successObject.milestone;
	var competitorsList = response.successObject.organizationCompetitorsList;
	var organizationRepufact = response.successObject.organizationRepufact;
	organizationRepufact = parseFloat(organizationRepufact);
	organizationRepufact = organizationRepufact.toFixed(2);
	var id = organizationModule.id;
	var divId = 'editOrganizationMileStoneDivId_'+id;
	divId = "'"+divId+"'";
	var errorDivId = "editOrganizationMileStoneErrorDiv_"+id;
	errorDivId = "'"+errorDivId+"'";
	var organizationFullName = organizationModule.organizationFullName;
	var organizationId = organizationModule.organizationId;
	var fromDate = $.datepicker.formatDate('d M yy',new Date(organizationModule.setFromDate));
	var toDate = $.datepicker.formatDate('d M yy',new Date(organizationModule.setToDate));
	var hiddenFromDate = $.datepicker.formatDate('yy-mm-dd',new Date(organizationModule.setFromDate));
	var hiddenToDate = $.datepicker.formatDate('yy-mm-dd',new Date(organizationModule.setToDate));
	var mileStonePercentage = organizationModule.setPercentage;
	var html = "";
	html+=	'<div class="row">';
	html+=	'<div class="col-xs-6 form-horizontal">';
	html+=	'<form id="editOrganizationMileStonesForm_'+id+'">';
	html+=	appendErrorDiv(errorDivId);
	html+=		'<div class="form-group" id="Edit-Organization-organizationId-Error-'+id+'" style="display:none;">';
	html+=		'<label class="col-xs-3 control-label">Source<span class="mandatoryField">*</span></label>';
	html+=			'<div class=" col-xs-9">';
	html+=				'<select class="form-control input-sm" id="editMileStoneOrganizationId_'+id+'" disabled="disabled">';
	html+=					'<option value='+organizationId+'>'+organizationFullName+'</option>';
	html+=				'</select>';
	html+=				'</div>';
	html+=		'</div>';
	//***********************************************From Date*************************************************//
	html+=	'<div class="form-group" id="Edit-Organization-setFromDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+fromDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneOrganizationFromDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Organization-setFromDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenFromDate+'" id="altEditMileStoneOrganizationFromDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+
	//***********************************************To Date*************************************************//
			'<div class="form-group" id="Edit-Organization-setToDate-Error-'+id+'">'+
				'<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>'+
					'<div class=" col-xs-9">'+
						'<div class="">'+
							'<input value="'+toDate+'" placeholder="Select Date" class="form-control-sm" id="editMileStoneOrganizationToDate_'+id+'">'+
							'<span style="color: #a94442" id="edit-Organization-setToDate-span-Error-'+id+'" class="help-inline"></span>'+
							'<input type="hidden" value="'+hiddenToDate+'" id="altEditMileStoneOrganizationToDate_'+id+'">'+
						'</div>'+
					'</div>'+
			'</div>'+	
	//******************************************Percentage*************************************************//
			'<div class="form-group" id="Edit-Organization-setPercentage-Error-'+id+'">'+
			'<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>'+
				'<div class=" col-xs-9">'+
					'<div class="">'+
						'<input placeholder="Select Date" class="form-control-sm" id="editOrganizationSetPercentage_'+id+'" value='+mileStonePercentage+'>'+
						'<span style="color: #a94442" id="edit-Organization-setPercentage-span-Error-'+id+'" class="help-inline"></span>'+
					'</div>'+
				'</div>'+
		'</div>'+	
		'<div class="col-xs-offset-3 col-xs-9">'+
			'<input type="button" class="btn btn-default btn-xs btn-blue" value="Update MileStone" onclick="updateOrganizationMileStone('+id+')"> '+
			'<button class="btn btn-xs" type="button" onclick="hideForm('+divId+')">Cancel</button>'+
		'</div>'+
		'</form>'+
		'</div>'+
			'<div class="col-xs-offset-2 col-xs-4">'+
			'<div class="ActualScoreForAddMilestone">Rating Score Index</div>'+
				'<div class="SmallDarkGreyHeader yourRepufactor">'+organizationFullName+">"+organizationRepufact+'</div>';
		if(competitorsList.length>0){
			for(var i=0;i<competitorsList.length;i++){
				var competitorName = competitorsList[i].organizationName;
				var competitorRepufact = competitorsList[i].repufactor;
				competitorRepufact = parseFloat(competitorRepufact);
				competitorRepufact = competitorRepufact.toFixed(2);
				html+= '<div class="SmallDarkGreyHeader">'+	competitorName+">"+competitorRepufact+'<div>';
			}
		}else{
			html+='<div class="SmallDarkGreyHeader"><font style="color: red;">No competitor has been mapped to this Organization</font></div>';

		}
		html+=	'</div>';
		html+=	'</div>';
	return html;
}


function updateOrganizationMileStone(id){
	loadingForDashBoard();
	var addOrEdit = "Edit";
	var successDivId = "editOrganizationMileStoneSuccessDiv";
	var formId = "editOrganizationMileStonesForm_"+id;
	var errorDivId = "editOrganizationMileStoneErrorDiv_"+id;
	clearErrorDivs(successDivId,errorDivId,formId);//Passing Error And Success Div Id's For Clearing Errors.
	var organizationId = $('#editMileStoneOrganizationId_'+id).val();
	var fromDate = $('#altEditMileStoneOrganizationFromDate_'+id).val();
	var toDate = $('#altEditMileStoneOrganizationToDate_'+id).val();
	var mileStonePercentage = $('#editOrganizationSetPercentage_'+id).val();
	var dropdownFromDate = $('#altFromDate').val();
	var dropdownToDate = $('#altToDate').val();
	if(mileStonePercentage==""){
		mileStonePercentage = 0.0;
	}
	var JSONObject = {'id':id,'setFromDate':fromDate,'setToDate':toDate,'setPercentage':mileStonePercentage,'organizationId':organizationId,'factorName':organizationMoudle,'dropdownFromDate':dropdownFromDate,'dropdownToDate':dropdownToDate};
	console.log(JSONObject);
	$.post(mileStoneUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editOrganizationMileStoneSuccessDiv').show(600);
			var divId = 'editOrganizationMileStoneDivId_'+id;
			hideForm(divId);
			$( "div" ).remove('#organization-milestoneList-'+id,'slow');
			listOrganizationMileStones(response, organizationCollapsableDivId);
			unloadingForDashBoard();
		}else{
			appendUpdateErrors(errorDivId, response, addOrEdit,id,organizationMoudle);
			unloadingForDashBoard();
		}
	}).fail(function(response){
		jqueryPostError(response);
	})
}



function calculateDepartmentRepufact(){
	loadingForDashBoard();
	var html = '';
	var tempHtml = '';
	$('#DepartmentActualScoreForAddMilestone').html('');
	$('#DepartmentActualScoreForAddMilestoneForCompetitors').html('');
	var departmentId = $('#mileStoneDepartmentId option:selected').val();
	var departmentName = $('#mileStoneDepartmentId option:selected').text();
	var JSONObject = {'departmentId':departmentId,'departmentName':departmentName,'factorName':departmentModule};
	if(departmentId!=0){
	$.post(mileStoneUrl+'calculateRepufact.htm',JSONObject,function(response){
		console.log(response);
		if(response.status=="SUCCESS"){
			var obj = response.successObject.repufactForOrganization;
			var competitorDepartmentRepufactorsLength = response.successObject.competitorDepartmentRepufactors.length;
			var organizationName = obj.organizationName;
			var departmentName = obj.factorName;
			var repufactor = obj.repufactor;
			repufactor = repufactor.toFixed(2);
			html+= '<div class="SmallDarkGreyHeader yourRepufactor">'+
						organizationName+">"+departmentName+" "+repufactor+
					'<div>';
			
			if(competitorDepartmentRepufactorsLength>0){
				var competitorDepartmentRepufactor = response.successObject.competitorDepartmentRepufactors;
				for(var i=0;i<competitorDepartmentRepufactorsLength;i++){
					var organizationName = competitorDepartmentRepufactor[i].organizationName;
					var departmentName = competitorDepartmentRepufactor[i].factorName;
					var repufactor = competitorDepartmentRepufactor[i].repufactor;
					repufactor = repufactor.toFixed(2);
					tempHtml+= '<div class="SmallDarkGreyHeader">'+
									organizationName+">"+departmentName+" "+repufactor+
									'<div>';
				}
				$('#DepartmentActualScoreForAddMilestoneForCompetitors').append(tempHtml);
			}else{
				$('#DepartmentActualScoreForAddMilestoneForCompetitors').append('<font style="color:red">No competitor has been mapped to this Department</font>');
			}
			$('#DepartmentActualScoreForAddMilestone').append(html);
			unloadingForDashBoard();
		}else{
			$('#DepartmentActualScoreForAddMilestone,DepartmentActualScoreForAddMilestoneForCompetitors').append('<font>Unable to show repufact score</font>');
			unloadingForDashBoard();
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
 }else{
	 unloadingForDashBoard();
 }
}


function calculateKpiRepufact(){
	loadingForDashBoard();
	var html = '';
	var tempHtml = '';
	$('#KpiActualScoreForAddMilestone').html('');
	$('#KpiActualScoreForAddMilestoneForCompetitors').html('');
	var kpiId = $('#mileStoneKpiId option:selected').val();
	var kpiName = $('#mileStoneKpiId option:selected').text();
	var JSONObject = {'kpiId':kpiId,'kpiName':kpiName,'factorName':kpiModule};
	if(kpiId!=0){
	$.post(mileStoneUrl+'calculateKpiRepufact.htm',JSONObject,function(response){
		if(response.status=="SUCCESS"){
			var obj = response.successObject.kpiRepufactCalculation;
			var competitorKpiRepufactorsLength = response.successObject.competitorKpiRepufactors.length;
			var organizationName = obj.organizationName;
			var kpiName = obj.factorName;
			var repufactor = obj.repufactor;
			repufactor = repufactor.toFixed(2);
			html+= '<div class="SmallDarkGreyHeader yourRepufactor">'+
						organizationName+">"+kpiName+" "+repufactor+
					'<div>';
			if(competitorKpiRepufactorsLength>0){
				var competitorDepartmentRepufactor = response.successObject.competitorKpiRepufactors;
				for(var i=0;i<competitorKpiRepufactorsLength;i++){
					var organizationName = competitorDepartmentRepufactor[i].organizationName;
					var kpiName = competitorDepartmentRepufactor[i].factorName;
					var repufactor = competitorDepartmentRepufactor[i].repufactor;
					repufactor = repufactor.toFixed(2);
					tempHtml+= '<div class="SmallDarkGreyHeader">'+
									organizationName+">"+kpiName+" "+repufactor+
									'<div>';
				}
				$('#KpiActualScoreForAddMilestoneForCompetitors').append(tempHtml);
			}else{
				$('#KpiActualScoreForAddMilestoneForCompetitors').append('<font style="color:red">No competitor has been mapped to this KPI</font>');
			}
			$('#KpiActualScoreForAddMilestone').append(html);
			unloadingForDashBoard();
		}else{
			$('#KpiActualScoreForAddMilestone,KpiActualScoreForAddMilestoneForCompetitors').append('<font>Unable to show repufact score</font>');
			unloadingForDashBoard();
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
 }else{
	 unloadingForDashBoard();
 }
	
}


function calculateSourceRepufact(){
	loadingForDashBoard();
	var html = '';
	var tempHtml = '';
	$('#SourceActualScoreForAddMilestone').html('');
	$('#SourceActualScoreForAddMilestoneForCompetitors').html('');
	var sourceId = $('#mileStoneSourceId option:selected').val();
	var sourceName = $('#mileStoneSourceId option:selected').text();
	var JSONObject = {'sourceId':sourceId,'sourceName':sourceName,'factorName':kpiModule};
	if(sourceId!=0){
	$.post(mileStoneUrl+'calculateSourceRepufact.htm',JSONObject,function(response){
		if(response.status=="SUCCESS"){
			var obj = response.successObject.sourceRepufactCalculation;
			var competitorSourceRepufactorsLength = response.successObject.competitorSourceRepufactors.length;
			var organizationName = obj.organizationName;
			var sourceName = obj.factorName;
			var repufactor = obj.repufactor;
			repufactor = repufactor.toFixed(2);
			html+= '<div class="SmallDarkGreyHeader yourRepufactor">'+
						organizationName+">"+sourceName+" "+repufactor+
					'<div>';
			if(competitorSourceRepufactorsLength>0){
				var competitorSourceRepufactor = response.successObject.competitorSourceRepufactors;
				for(var i=0;i<competitorSourceRepufactorsLength;i++){
					var organizationName = competitorSourceRepufactor[i].organizationName;
					var kpiName = competitorSourceRepufactor[i].factorName;
					var repufactor = competitorSourceRepufactor[i].repufactor;
					repufactor = repufactor.toFixed(2);
					tempHtml+= '<div class="SmallDarkGreyHeader">'+
									organizationName+">"+kpiName+" "+repufactor+
									'<div>';
				}
				$('#SourceActualScoreForAddMilestoneForCompetitors').append(tempHtml);
			}else{
				$('#SourceActualScoreForAddMilestoneForCompetitors').append('<font style="color:red">No competitor has been mapped to this Source</font>');
			}
			$('#SourceActualScoreForAddMilestone').append(html);
			unloadingForDashBoard();
		}else{
			$('#SourceActualScoreForAddMilestone,SourceActualScoreForAddMilestoneForCompetitors').append('<font>Unable to show repufact score</font>');
			unloadingForDashBoard();
		}
	},'json').fail(function(response){
		jqueryPostError(response);
	});
 }else{
	 unloadingForDashBoard();
 }

}


/********************************************************************************************************************************************************/
/*********************************************Auto Search*************************************************************************************/
/********************************************************************************************************************************************************/
	  $(function() {
			  var values = [];
			  var NoResultsLabel = "No Results Found.";
			  values.push(all);
			  $('#departmentsForMileStoneSearch option').each(function() { 
				  var label = $.trim($(this).text());
				  values.push(label);
				  
			      
			  });
			  
			  $("#departmentMileStoneSearch").autocomplete({
				  	minLength: 0,
			        source: function(request, response) {
			            var results = $.ui.autocomplete.filter(values, request.term);
			            if (!results.length) {
			                results = [NoResultsLabel];
			               
			            }
			            response(results);
			        },
			        select: function (event, ui) {
			            if (ui.item.label === NoResultsLabel) {
			                event.preventDefault();
			            }else{
					           var label  = ui.item.label;
					           var factorName = departmentModule;
					           $(this).val(label);
					           searhcedList(label, factorName,departmentCollapsableDivId);
			            }
			        },
			        focus: function (event, ui) {
			            if (ui.item.label === NoResultsLabel) {
			                event.preventDefault();
			            }
			        }
			    }).focus(function() {
			        $(this).autocomplete("search", "");
			    });
		 
		  }); 
	  
	  $(function() {
		  var kpiValues = [];
		  var NoResultsLabel = "No Results Found.";
		  kpiValues.push(all);
		  $('#kpisForMileStoneSearch option').each(function() { 
			  var label = $.trim($(this).text());
			  kpiValues.push(label);
		      
		  });
		  
		  $("#kpiMileStoneSearch").autocomplete({
			  	minLength: 0,
		        source: function(request, response) {
		            var results = $.ui.autocomplete.filter(kpiValues, request.term);
		            if (!results.length) {
		                results = [NoResultsLabel];
		            }
		            response(results);
		        },
		        select: function (event, ui) {
		            if (ui.item.label === NoResultsLabel) {
		                event.preventDefault();
		            }else{
				           var label  = ui.item.label;
				           var factorName = kpiModule;
				           $(this).val(label);
				           searhcedList(label, factorName,kpiCollapsableDivId);
		            }
		        },
		        focus: function (event, ui) {
		            if (ui.item.label === NoResultsLabel) {
		                event.preventDefault();
		            }
		        }
		    }).focus(function() {
		        $(this).autocomplete("search", "");
		    });
	 
	  }); 
	  
	  
	  $(function() {
		  var sourceValues = [];
		  var NoResultsLabel = "No Results Found.";
		  sourceValues.push(all);
		  $('#sourcesForMileStoneSearch option').each(function() { 
			  var label = $.trim($(this).text());
			  sourceValues.push(label);
		      
		  });
		  
		  $("#sourceMileStoneSearch").autocomplete({
			  	minLength: 0,
		        source: function(request, response) {
		            var results = $.ui.autocomplete.filter(sourceValues, request.term);
		            if (!results.length) {
		                results = [NoResultsLabel];
		            }
		            response(results);
		        },
		        select: function (event, ui) {
		            if (ui.item.label === NoResultsLabel) {
		                event.preventDefault();
		            }else{
				           var label  = ui.item.label;
				           var factorName = sourceModule;
				           $(this).val(label);
				           searhcedList(label, factorName,sourceCollapsableDivId);
		            }
		        },
		        focus: function (event, ui) {
		            if (ui.item.label === NoResultsLabel) {
		                event.preventDefault();
		            }
		        }
		    }).focus(function() {
		        $(this).autocomplete("search", "");
		    });
	 
	  }); 
	  
	  
	  function searhcedList(searchText,factorName,dataDivId){
			//loadingForDashBoard();
			var JSONObject = {'searchText':searchText,'factorName':factorName};
			var divId = $('#'+factorName+"MileStonesList");
			divId.html('');
			$.post(mileStoneUrl+"search.htm",JSONObject,function(response){
				console.log(response);
				if(response.status=="SEARCHED_LIST_SUCCESS"){
					var currentRepufactor = response.successObject.currentRepufactor;
					var mileStone = response.successObject.searchedList[0];
					if(factorName==departmentModule){
						divId.append(appendDiv(mileStone,currentRepufactor));
					}else if(factorName==kpiModule){
						divId.append(appendKpisDiv(mileStone, currentRepufactor));
					}else if(factorName==sourceModule){
						divId.append(appendSourcesDiv(mileStone, currentRepufactor));
					}
				}else if(response.status=="CLEAR_SEARCH"){
					divId.html('');
					var currentRepufactor = response.successObject.currentRepufactor;
					if(factorName==departmentModule){
						var departmentMileStonesList = response.successObject.listDepartmentMileStones;
						var currentRepuFactor = response.successObject.currentRepufactor;
						for(var i=0;i<departmentMileStonesList.length;i++){
							var departmentMileStone = departmentMileStonesList[i];
							divId.append(appendDiv(departmentMileStone, currentRepuFactor));
						}
					}
					
					else if(factorName==kpiModule){
						var kpiMileStonesList = response.successObject.listKpiMileStones;
						var currentRepuFactor = response.successObject.currentRepufactor;
						for(var i=0;i<kpiMileStonesList.length;i++){
							var kpiMileStone = kpiMileStonesList[i];
							divId.append(appendKpisDiv(kpiMileStone, currentRepufactor));
						}
					}
					
					else if(factorName==sourceModule){
						var sourceMileStonesList = response.successObject.listSourceMileStones;
						var currentRepuFactor = response.successObject.currentRepufactor;
						for(var i=0;i<sourceMileStonesList.length;i++){
							var sourceMileStone = sourceMileStonesList[i];
							divId.append(appendSourcesDiv(sourceMileStone, currentRepufactor));
						}
					}
					
				}
				else if(response.status=="SEARCHED_LIST_EMPTY"){
					divId.append('<font style="color: red">No Results Found</font></div>');
				}
					$('#'+dataDivId).removeClass('panel-collapse collapse');
		           $('#'+dataDivId).addClass('panel-collapse collapse in');
		           $('#'+dataDivId).css('height','');
				//unloadingForDashBoard();
			},'json').fail(function(response){
				jqueryPostError(response);
			});
		}
	  
	  $( "#departmentMileStoneSearch" ).keyup(function() {
	  searhcedList("---ALL---","Department","DepartmentMilestone");
		});
	  
	  $( "#kpiMileStoneSearch" ).keyup(function() {
		  searhcedList("---ALL---","Kpi","KpiMileStone");
			});
	  
	  $( "#sourceMileStoneSearch" ).keyup(function() {
		  searhcedList("---ALL---","Source","SourceMileStone");
			});