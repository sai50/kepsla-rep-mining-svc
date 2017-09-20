var kpiMasterList=[];
var departmentList=[];
var sourceMasterList=[];

/********************************Get Old Milestone Method*********************************/
function getMilestones(){
	$('#deleteMilestoneSuccessDiv').hide();
	$('#saveMilestoneSuccessDiv').hide();
	var milestoneFor=$('#repuFactorSelect').val();
	var organizationId=$('#organizationName').val();
	
	if(milestoneFor==null || organizationId==null){
		return;
	}
	
	$.ajax({
		type:"GET",
		url:"../milestone/listMilestonesForOrganizationAndRepufactor.htm?milestoneFor="+milestoneFor+"&organizationId="+organizationId,
		contentType:"application/json",
		success:function(response){
		var milestonesList=response.successObject.milestonesList;
		var	htmlTbl = "<table class='table table-striped table-bordered' id='milestoneTable'>";
			htmlTbl += "<thead>";
			htmlTbl +=	"<tr>";
			htmlTbl +=	'<th><input type="checkbox" id="checkAllMilestoneCheckBox" style="margin-left: -7px;"></th>';
			htmlTbl +=	"<th>Milestone For</th>";
			htmlTbl +=	"<th>Percentage</th>";
			htmlTbl +=	"<th>From Date</th>";
			htmlTbl +=	"<th>To Date</th>";
			htmlTbl +=	"</tr>";
			htmlTbl +=	"</thead>";
			htmlTbl +=	"<tbody>";
			for(var i=0;i<milestonesList.length;i++){
				var id = milestonesList[i].id;
				var milestoneFor = milestonesList[i].milestoneFor;
				var setPercentage = milestonesList[i].setPercentage;
				var setFromDate = milestonesList[i].setFromDate;
				var setToDate = milestonesList[i].setToDate;
				
				htmlTbl+=	'<tr>';
				htmlTbl+=	'<td><input type="checkBox" class="milestoneCheckBox" value='+id+'></td>';
				htmlTbl+=	'<td>'+milestoneFor+'</td>';
				htmlTbl+=	'<td>'+setPercentage+'</td>';
				htmlTbl+=	'<td>'+moment(new Date(setFromDate)).format('YYYY-MM-DD HH:mm:ss')+'</td>';
				htmlTbl+=	'<td>'+moment(new Date(setToDate)).format('YYYY-MM-DD HH:mm:ss')+'</td>';
				
				htmlTbl+=	'</tr>';
			}
			htmlTbl +=	"</tbody>";
			htmlTbl +=	"</table>";
			
			if(milestonesList.length>0){
				$('#milestoneTblDiv').html(htmlTbl);
			}
			else{
				$('#milestoneTblDiv').html("<label>No Records found to show</label>");
			}
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
		}
	});
	
}
/********************************End Of Get Old Milestone Method*********************************/

/********************************Show Add Milestone Method*********************************/
function showAddMilestone(){
	$('#deleteMilestoneSuccessDiv').hide();
	$('#saveMilestoneSuccessDiv').hide();
	var htmlText="";
	if($('#organizationName').val()==null){
		alert("Please Select Organization");
		return;
	}
	if($('#repuFactorSelect').val()==null){
		alert("Please Select Repufactor Indicator");
		return;
	}
	
	if($('#repuFactorSelect').val()=="Repufactor"){
			$('#AddRepufactorMilestone').modal('show');
	}
	
	if($('#repuFactorSelect').val()=="Source Score"){
		var organization={'id':$('#organizationName').val()};
		$.ajax({
			type:"POST",
			url:"../milestone/listSourceForOrganization.htm",
			contentType:"application/json",
			data:JSON.stringify(organization),
			success:function(response){
				sourceMasterList=response.successObject.sourceMasterMappedList;
				if(sourceMasterList.length>0){
					for(var i=0;i<sourceMasterList.length;i++){
						htmlText+='<span class="help-block mt10">Source Name<span class="mandatoryInput">*</span></span>'
							+'<input type="text" class="form-control" disabled value="'+sourceMasterList[i].sourceName+'" >'
							
							+'<span class="help-block mt10">Set Percentage<span class="mandatoryInput">*</span></span>'
							+'<input type="text" class="form-control" placeholder="Enter Percentage" id="percentageSourceInput_'+sourceMasterList[i].sourceId+'">'
										
							+'<span class="help-block mt10">Set From Date<span class="mandatoryInput">*</span></span>'
							+'<input type="date" onclick="activateFromDatepicker(this)" id="setFromDateSourceInput_'+sourceMasterList[i].sourceId+'" class="form-control" placeholder="Set From Date">'
							+'<span class="help-block mt10" >Set To Date<span class="mandatoryInput">*</span></span>'
							+'<input type="date"  onclick="activateToDatepicker(this)" id="setToDateSourceInput_'+sourceMasterList[i].sourceId+'" class="form-control" placeholder="Set To Date">';
					}
					$('#sourceMilestoneModalBody').html(htmlText);
					$('#AddSourceMilestone').modal('show');
				}
				else{
					alert("Organization is not mapped with selected repufactor indicator Please Contact admin !");
				}
					
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
		});
	}
	if($('#repuFactorSelect').val()=="KPI Factor"){
		var organization={'id':$('#organizationName').val()};
		$.ajax({
			type:"POST",
			url:"../milestone/listKpiForOrganization.htm",
			contentType:"application/json",
			data:JSON.stringify(organization),
			success:function(response){
				kpiMasterList=response.successObject.kpiIndustryMasterMappedList;
				if(kpiMasterList.length>0){	
					for(var i=0;i<kpiMasterList.length;i++){
						htmlText+='<span class="help-block mt10">KPI Name<span class="mandatoryInput">*</span></span>'
							+'<input type="text" class="form-control" disabled value="'+kpiMasterList[i].kpiName+'" >'
							
							+'<span class="help-block mt10">Set Percentage<span class="mandatoryInput">*</span></span>'
							+'<input type="text" class="form-control" placeholder="Enter Percentage" id="percentageKpiInput_'+kpiMasterList[i].kpiId+'">'
										
							+'<span class="help-block mt10">Set From Date<span class="mandatoryInput">*</span></span>'
							+'<input type="date"  onclick="activateFromDatepicker(this)" id="setFromDateKpiInput_'+kpiMasterList[i].kpiId+'" class="form-control" placeholder="Set From Date">'
							+'<span class="help-block mt10" >Set To Date<span class="mandatoryInput">*</span></span>'
							+'<input type="date" onclick="activateToDatepicker(this)" id="setToDateKpiInput_'+kpiMasterList[i].kpiId+'" class="form-control" placeholder="Set To Date">';
					}
					$('#kpiMilestoneModalBody').html(htmlText);
					$('#AddKpiMilestone').modal('show');
				}
				else{
					alert("Organization is not mapped with selected repufactor indicator Please Contact admin !");
				}
					
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
		});
	}
	if($('#repuFactorSelect').val()=="Department Factor"){
		var organization={'id':$('#organizationName').val()};
		$.ajax({
			type:"POST",
			url:"../milestone/listDepartmentForOrganization.htm",
			contentType:"application/json",
			data:JSON.stringify(organization),
			success:function(response){
				departmentList=response.successObject.departmentMappedList;
				if(departmentList.length>0){
						for(var i=0;i<departmentList.length;i++){
							htmlText+='<span class="help-block mt10">Department Name<span class="mandatoryInput">*</span></span>'
								+'<input type="text" class="form-control" disabled value="'+departmentList[i].departmentName+'" >'
								
								+'<span class="help-block mt10">Set Percentage<span class="mandatoryInput">*</span></span>'
								+'<input type="text" class="form-control" placeholder="Enter Percentage" id="percentageDepartmentInput_'+departmentList[i].id+'">'
											
								+'<span class="help-block mt10">Set From Date<span class="mandatoryInput">*</span></span>'
								+'<input type="date" onclick="activateFromDatepicker(this)" id="setFromDateDepartmentInput_'+departmentList[i].id+'" class="form-control" placeholder="Set From Date">'
								+'<span class="help-block mt10" >Set To Date<span class="mandatoryInput">*</span></span>'
								+'<input type="date" onclick="activateToDatepicker(this)" id="setToDateDepartmentInput_'+departmentList[i].id+'" class="form-control" placeholder="Set To Date">';
						}
						$('#departmentMilestoneModalBody').html(htmlText);
						$('#AddDepartmentMilestone').modal('show');
				}
				else{
					alert("Organization is not mapped with selected repufactor indicator Please Contact admin !");
				}	
					
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
		});
	}
}
/********************************End Add Milestone Method*********************************/
/********************************Save KPI Milestone Method*********************************/
function saveKpiMilestone(){
	$('#loadMaskDiv').mask('loading....');
	var milestones=new Array();
	/*console.log(sourceMasterList);*/
	for(var i=0;i<kpiMasterList.length;i++){
		var organizationId=$('#organizationName').val();
		var milestoneFor=$("#repuFactorSelect").val();
		var setPercentage=$("#"+"percentageKpiInput_"+kpiMasterList[i].kpiId).val();
		var setFromDate=$("#"+"setFromDateKpiInput_"+kpiMasterList[i].kpiId).val();
		var setToDate=$("#"+"setToDateKpiInput_"+kpiMasterList[i].kpiId).val();
		var kpiId=kpiMasterList[i].kpiId;
		var milestone={'kpiId':kpiId,'organizationId':organizationId,'milestoneFor':milestoneFor,'setPercentage':setPercentage,'setFromDate':setFromDate,'setToDate':setToDate};
		milestones.push(milestone);
	}
	
	console.log(milestones);
	$.ajax({
		type:"POST",
		url:"../milestone/saveMilestone.htm",
		contentType:"application/json",
		data:JSON.stringify(milestones),
		success:function(response){
			
			if(response.status=="SAVE_SUCCESS"){
				getMilestones();
				$('#saveMilestoneSuccessDiv').show(600);
				
				$('#loadMaskDiv').unmask();
				$('#AddKpiMilestone').modal('hide');
				
			}else if(response.status=="SAVE_ERROR"){
				$('#saveMilestoneErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-error').html(errorMessage);
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
		}
	});
}
/********************************End of Save Kpi Milestone*********************************/

/********************************Save Department Milestone Method*********************************/
function saveDepartmentMilestone(){
	$('#loadMaskDiv').mask('loading....');
	var milestones=new Array();
	/*console.log(sourceMasterList);*/
	for(var i=0;i<departmentList.length;i++){
		var organizationId=$('#organizationName').val();
		var milestoneFor=$("#repuFactorSelect").val();
		var setPercentage=$("#"+"percentageDepartmentInput_"+departmentList[i].id).val();
		var setFromDate=$("#"+"setFromDateDepartmentInput_"+departmentList[i].id).val();
		var setToDate=$("#"+"setToDateDepartmentInput_"+departmentList[i].id).val();
		var id=departmentList[i].id;
		var milestone={'departmentId':id,'organizationId':organizationId,'milestoneFor':milestoneFor,'setPercentage':setPercentage,'setFromDate':setFromDate,'setToDate':setToDate};
		milestones.push(milestone);
	}
	console.log(milestones);
	$.ajax({
		type:"POST",
		url:"../milestone/saveMilestone.htm",
		contentType:"application/json",
		data:JSON.stringify(milestones),
		success:function(response){
			
			if(response.status=="SAVE_SUCCESS"){
				getMilestones();
				$('#saveMilestoneSuccessDiv').show(600);
				
				$('#loadMaskDiv').unmask();
				
				$('#AddDepartmentMilestone').modal('hide');
			}else if(response.status=="SAVE_ERROR"){
				$('#saveMilestoneErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-error').html(errorMessage);
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
		}
	});
}
/********************************End of Save Department Milestone*********************************/


/********************************Save Source Milestone Method*********************************/
function saveSourceMilestone(){
	$('#loadMaskDiv').mask('loading....');
	var milestones=new Array();
	/*console.log(sourceMasterList);*/
	for(var i=0;i<sourceMasterList.length;i++){
		var organizationId=$('#organizationName').val();
		var milestoneFor=$("#repuFactorSelect").val();
		var setPercentage=$("#"+"percentageSourceInput_"+sourceMasterList[i].sourceId).val();
		var setFromDate=$("#"+"setFromDateSourceInput_"+sourceMasterList[i].sourceId).val();
		var setToDate=$("#"+"setToDateSourceInput_"+sourceMasterList[i].sourceId).val();
		var sourceId=sourceMasterList[i].sourceId;
		var milestone={'sourceId':sourceId,'organizationId':organizationId,'milestoneFor':milestoneFor,'setPercentage':setPercentage,'setFromDate':setFromDate,'setToDate':setToDate};
		milestones.push(milestone);
	}
	
	console.log(milestones);
	$.ajax({
		type:"POST",
		url:"../milestone/saveMilestone.htm",
		contentType:"application/json",
		data:JSON.stringify(milestones),
		success:function(response){
			
			if(response.status=="SAVE_SUCCESS"){
				getMilestones();
				$('#saveMilestoneSuccessDiv').show(600);
				
				$('#loadMaskDiv').unmask();
				
				$('#AddSourceMilestone').modal('hide');
			}else if(response.status=="SAVE_ERROR"){
				$('#saveMilestoneErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-error').html(errorMessage);
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
		}
	});
}
/********************************End of Save Source Milestone*********************************/


/********************************Save Repufactor Milestone Method*********************************/
function saveRepufactorMilestone(){
	$('#loadMaskDiv').mask('loading....');
	
	var organizationId=$('#organizationName').val();
	var milestoneFor=$("#repuFactorSelect").val();
	var setPercentage=$("#percentageRepufactorInput").val();
	var setFromDate=$("#setFromDateRepufactorInput").val();
	var setToDate=$("#setToDateRepufactorInput").val();
	
	var milestone={'organizationId':organizationId,'milestoneFor':milestoneFor,'setPercentage':setPercentage,'setFromDate':setFromDate,'setToDate':setToDate};
	var milestones=new Array();
	milestones.push(milestone);
	$.ajax({
		type:"POST",
		url:"../milestone/saveMilestone.htm",
		contentType:"application/json",
		data:JSON.stringify(milestones),
		success:function(response){
			
			if(response.status=="SAVE_SUCCESS"){
				getMilestones();
				$('#saveMilestoneSuccessDiv').show(600);
				
				$('#loadMaskDiv').unmask();
				
				$('#AddRepufactorMilestone').modal('hide');
			}else if(response.status=="SAVE_ERROR"){
				$('#saveMilestoneErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#save-'+fieldName+'-error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-error').html(errorMessage);
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
		}
	});
}
/********************************End of Save Repufactor Factor Milestone*********************************/

/******************************** Repufactor Datepicker*********************************/
$(function() {
	$( "#setFromDateRepufactorInput" ).datepicker();
	$( "#setFromDateRepufactorInput" ).datepicker("setDate","-1m");

	$("#setFromDateRepufactorInput").datepicker("option", { 
		minDate: new Date(),
		dateFormat:"yy-mm-dd"
	});
	
	$( "#setToDateRepufactorInput" ).datepicker();
	$( "#setToDateRepufactorInput" ).datepicker("setDate","+1m");
	
	$("#setToDateRepufactorInput").datepicker("option", { 
		minDate: new Date(),
		dateFormat:"yy-mm-dd"
	});
});

function activateFromDatepicker(obj){
	$( "#"+obj.id ).datepicker();
	$( "#"+obj.id ).datepicker("setDate","-1m");

	$("#"+obj.id).datepicker("option", { 
		minDate: new Date(),
		dateFormat:"yy-mm-dd"
	});
	
	
	$("#"+obj.id).datepicker("show");
	
}

function activateToDatepicker(obj){
	$( "#"+obj.id ).datepicker();
	$( "#"+obj.id).datepicker("setDate","+1m");
	
	$("#"+obj.id).datepicker("option", { 
		minDate: new Date(),
		dateFormat:"yy-mm-dd"
	});
	
	$("#"+obj.id).datepicker("show");
}
/********************************End Of Repufactor Datepicker*********************************/

/******************************** Source Datepicker*********************************/
$(function() {
	$( "#setFromDateSourceInput" ).datepicker();
	$( "#setFromDateSourceInput" ).datepicker("setDate","-1m");

	$("#setFromDateSourceInput").datepicker("option", { 
		dateFormat:"yy-mm-dd"
	});
	
	$( "#setToDateSourceInput" ).datepicker();
	$( "#setToDateSourceInput" ).datepicker("setDate",new Date());
	
	$("#setToDateSourceInput").datepicker("option", { 
		maxDate: new Date(),
		dateFormat:"yy-mm-dd"
	});
});
/********************************End Of Source Datepicker*********************************/

/*
var kpiMasterMappingUrl = "../kpiMaster/";
*//***************************************************************************************************************************
 * ********************************General KPI******************************************************************************
 * *************************************************************************************************************************//*
$('a#addGenerealKpiButton').click(function(){
	$('#addGeneralKpiForm').trigger('reset');
	$('#listGeneralKpiTab').html('');
	clearAddGeneralKpiForm();
	$('#listGeneralKpiForm').hide(600);
	var tempHtml = addGeneralKpiForm();
	$('#listGeneralKpiTab').append(tempHtml);
	return false;
});

function addGeneralKpiForm() {
	var html = "";
	html += '<form role="form" id="addGeneralKpiForm">';
	html += '<h4>Add KPI</h4><hr>';
	*//** ***********Sucess Div*********************************** *//*
	html += '<div class="alert alert-success" style="display: none;"	id="addGeneralKpiSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> KPI(s) Added Successfully</strong>';
	html += '</div>';
	*//** ****************Error Div******************************* *//*
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addGeneralKpiErrorDiv">';
	html += '</div>';
	*//** *********************Add KPI(s)************************* *//*
	html += '<div class="form-group" id="Add-kpiName-Error">';
	html += '<label>KPI(s)<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="kpiName-Error" class="help-inline"></span>';
	html += '<textarea class="form-control" rows="3" name="kpiName" id="kpiName" maxlength="100" placeholder="Add multiple KPIs using commas (,)"></textarea>';
	html += '</div>';
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeneralKpi()">';
	html += '</form>';
	return html;
}
function saveGeneralKpi(){
	$('#loadMaskDiv').mask('Loading...');
	clearAddGeneralKpiForm();
	$('#addGeneralKpiErrorDiv').html('');
	var kpiName = $.trim($('#kpiName').val());
	var JSONObject = {'kpiName':kpiName};
	var generalKpiArray = kpiName.split(',');
	var generalKpis = [];
	for(var i=0;i<generalKpiArray.length;i++){
		generalKpis.push({'kpiName':generalKpiArray[i]});
	}
	$.ajax({
		type:"POST",
		data:JSON.stringify(JSONObject),
		url:kpiMasterMappingUrl+"saveGeneralKPI.htm",
		contentType:"application/json",
		success:function(response){
			$('#loadMaskDiv').unmask();
			if(response.status=="SAVE_ERROR"){
				var errorMessage = '<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'</strong>';
				$('#addGeneralKpiErrorDiv').append(errorMessage);
				$('#addGeneralKpiErrorDiv').show(600);
				$('#Add-kpiName-Error').addClass('has-error has-feedback');
				//$('#kpiName-Error').html(response.errorMessage);
			}else if(response.status=="SAVE_SUCCESS"){
				$('#addGeneralKpiSuccessDiv').show(600);
				$('#addGeneralKpiForm').trigger("reset");
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"**************"+response.statusText);
		}
	});
	return false;
}

function listGeneralKpi(){
	$('#loadMaskDiv').mask('Loading...');
	$('#generalKpiTabButtons').show();
	$('#industryKpiTabButtons').hide();
	$('#addGeneralKpiForm').hide(600);
	$('#listGeneralKpiTab').html('');
	$.get(kpiMasterMappingUrl+"listGeneralKPITab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var tempHtml = listGeneralKpiResponse(response);
			$('#listGeneralKpiTab').append(tempHtml);
			$('#listGeneralKpiTable').dataTable();
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
	tempHtml+=	'<form role="form" id="listGeneralKpiForm">';
	tempHtml+=	'<div class="alert alert-success" style="display:none;"id="deleteGeneralKpiSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong> KPI(s) Deleted Successfully</strong></div>';
	tempHtml+=	"<table class='table table-striped table-bordered' id='listGeneralKpiTable'>";
	tempHtml+=		'<thead>';
	tempHtml+=			'<tr>';
	tempHtml+=				'<th><input type="checkbox" id="checkAllGeneralKpiCheckBox" style="margin-left: -7px;"></th>';
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
	tempHtml+=	'</div>';
	return tempHtml;
	
}
*//**********************************************************************************************************************************************
 **********************D e l e t e*************************************************************************************************************
 **********************************************************************************************************************************************//* 

function deleteGeneralKpi(){
	selectedGeneralKpiCheckBoxLength();
	if(selectedGeneralKpiCheckBoxArray.length>0){
		if(confirm("Are you sure you want to delete selected item(s)?")){
			$('#loadMaskDiv').mask('Loading...');
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



*//********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************//* 
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

$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
});*/



/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllMilestoneCheckBox",function(){
    $('.milestoneCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".milestoneCheckBox",function(){
    if($('.milestoneCheckBox:checked').length == $('.milestoneCheckBox').length) {
      $('#checkAllMilestoneCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllMilestoneCheckBox').prop('checked', false);
    }
});

/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteMilestone(){
	var ids = selectedIds('milestoneCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#loadMaskDiv').mask('Loading...');
			$('#deleteMilestoneSuccessDiv').hide();
			$('#deleteMilestoneErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:"../milestone/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						/*$('#reviewAgeTabButtons').hide();
						var html = reviewAgeListFormHtml(response);
						$('#reviewAgeDataDiv').html(html);
						$('#reviewAgeTabButtons').show();*/
						$('#deleteMilestoneSuccessDiv').show(600);
						getMilestones();
						/*$('#milestoneTable').dataTable();*/
						$('#loadMaskDiv').unmask();
					}else if(response.status=="DELETE_ERROR"){
						/*$('#deleteReviewAgeErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteReviewAgeErrorDiv').append(errorMessage);
						$('#deleteReviewAgeErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');*/
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

function exportMilestoneHistory(){
	alert("coming");
}