var all = "---ALL---";
var departmentModule = "Department";
var kpiModule = "Kpi";
var sourceModule = "Source";
var organizationMoudle = "Organization";
var departmentCollapsableDivId = "DepartmentMilestone";
var kpiCollapsableDivId = "KpiMilestone";
var sourceCollapsableDivId = "SourceMilestone";
var organizationCollapsableDivId = "OrganizationMilestone";
var departmentNameList = new Array();
var kpiNameList = new Array();
var sourceNameList = new Array();
var sessionSelectedOrganizationId=0;
$(document).ready(function() {
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDate",
		altFormat: "mm/dd/yy",
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
		altFormat: "mm/dd/yy",
		onClose : function(selectedDate) {
		$("#from").datepicker("option", "maxDate", selectedDate);
		dateValidationForm();
		}
	});
	getSessionData().then(function(){
	poplateOrganizations(function(selectedOrgId) {
	    	getMilestoneHistory(selectedOrgId);
	});
	})  
});
$("#applyFilterBtn").click(function(e){
	saveSessionDatas();
	var organizationId = $('#organizationName option:selected').val();
	getMilestoneHistory(organizationId);
});
function setDefaults(){
		$("#from").datepicker("setDate","-1y");
		$("#to").datepicker("setDate",new Date());
}

/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	commonOrgPopulation(callback,'organizationName');
}
function getMilestoneHistory(organizationId){
	loadingForDashBoard();
	departmentNameList = [];
	kpiNameList = [];
	sourceNameList = [];
	var all = "---ALL---";
	var departmentModule = "Department";
	var kpiModule = "Kpi";
	var sourceModule = "Source";
	var departmentCollapsableDivId = "DepartmentMilestone";
	var kpiCollapsableDivId = "KpiMilestone";
	var sourceCollapsableDivId = "SourceMilestone";
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../milestoneHistory/getMilestoneHistory.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){console.log(response);
			unloadingForDashBoard();
			if(response!=null){
				$("exortoToExcel").show();
				$('#milestoneHistoryDiv').html('');
				var html = "";
				var orgName = response.organizationName;
				$('#orgName').html("Milestone History For "+orgName);
				var organizationMilestoneHistory  = response.organizationMilestoneHistory;
				var departmentMilestoneHistory  = response.departmentMilestoneHistory;
				var kpiMilestoneHistory  = response.kpiMilestoneHistory;
				var sourcetMilestoneHistory  = response.sourcetMilestoneHistory;
				if(departmentMilestoneHistory.length>0){
					for(var i=0;i<departmentMilestoneHistory.length;i++){
						departmentNameList.push(departmentMilestoneHistory[i].departmentName);
					}
				}
				if(kpiMilestoneHistory.length>0){
					for(var i=0;i<kpiMilestoneHistory.length;i++){
						kpiNameList.push(kpiMilestoneHistory[i].kpiName);
					}
				}
				if(sourcetMilestoneHistory.length>0){
					for(var i=0;i<sourcetMilestoneHistory.length;i++){
						sourceNameList.push(sourcetMilestoneHistory[i].sourceName);
					}
				}
				html += '<div class="panel-group manageMilestone" id="accordion">';
				/*------------------ Organization --------------------------------------------------*/
				html += '<div class="panel panel-default">';
					html += '<div class="panel-heading">';
						html += '<div class="panel-title">';
							html += '<a data-toggle="collapse" data-parent="#accordion"  href="#OrganizationMilestone">Organization</a>';
						html += '</div>';
					html += '</div>';
				/*------------------ End panel-hading --------------------------------------------------*/
				html +='<div id="OrganizationMilestone" class="panel-collapse collapse">';
				/*-- ----------------------MileStones List For Organization --------------------------*/
				if(organizationMilestoneHistory.length>0){
					for(var i=0;i<organizationMilestoneHistory.length;i++){
						html += '<div class="panel-body" id="organization-milestoneList-'+organizationMilestoneHistory[i].id+'">';
							html += '<div class="row">';
								html += '<div class="col-xs-12 MediumBoldGreyContent">'+organizationMilestoneHistory[i].organizationFullName+'</div>';
						html += '</div>';
						html += '<div class="row MilestoneValues">';
							html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += 'From <span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(organizationMilestoneHistory[i].setFromDate))+'</span>';
									html += '<div>';
										html += 'To <span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(organizationMilestoneHistory[i].setToDate))+'</span>';
									html += '</div>';
							 html += '</div>';
							/*-------------------------Repufactor------------------------------*/
							 html += '<div class="col-sm-2 repufactor">';
								 html += '<div class="ActualScoreForMilestone"><div style="font-size: 14px;">Rating Score Index</div>'+response.organizationRepufact.toFixed(2)+'%</div>';
							html += '</div>';
							/*-- --------------------------Milestone Target Set-------------------*/
							html += '<div class="col-sm-2">';
								html += '<div class="MilestoneBlue">Milestone '+organizationMilestoneHistory[i].setPercentage+'%</div>';
							html += '</div>';
							
							/*-- --------------------------Milestone Status-------------------*/
							//shravan
							html += '<div class="col-sm-2 SmallDarkGreyHeader">';
							html += '<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
								if(organizationMilestoneHistory[i].milestoneStatus=="SuccessfullyCompleted"){
									html+=	'Milestone Status <span class="PositiveChangeLeftAlign">'+organizationMilestoneHistory[i].milestoneStatus+'</span>';
								}else if(organizationMilestoneHistory[i].milestoneStatus=="Failed"){
									html+=	'Milestone Status1 <span class="NoChangeLeftAlign">'+organizationMilestoneHistory[i].milestoneStatus+'</span>';
								}else{
									html+=	'Milestone Status <span class="NegativeChangeLeftAlign">'+organizationMilestoneHistory[i].milestoneStatus+'</span>';
								}
		                 html+=  '</div>';
		                 html += '</div>';
							
							/*-- --------------------------Target Change-----------------------------------------------*/
							html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html +='<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">Target Change'; 
								var change=response.organizationRepufact-organizationMilestoneHistory[i].setPercentage;
								if(change<0){
									html +='<span class="NegativeChangeLeftAlign">'+change.toFixed(2)+'%</span>';
								}else if(change==0){
									html +='<span class="NoChangeLeftAlign">'+change.toFixed(2)+'%</span>';
								}else if(change>0){
									html +='<span class="PositiveChangeLeftAlign">'+change.toFixed(2)+'%</span>';
								}
								
								html +='</div>';
							html +='</div>';
							/*- --------------------------Days Remaining--------------------------------------------------*/
							html +='<div class="col-sm-2 SmallDarkGreyHeader">';
								html +='<div class="VerySmallBoldGreyContent">Days Remaining</div>';
								html +='<div class="MediumBoldDarkBlueContent">'+organizationMilestoneHistory[i].daysRemaining+'</div>';
							html +='</div>';
						html += '</div>';/*-- ----------------------MilestoneValues End --------------------------*/
						html += '</div>';/*-- ----------------------panel-body --------------------------*/
					}
				}else{
					html += '<div class="panel-body"><font style="color: red">No MileStones Found</font></div>';
				}
			html +='</div>';/* -------------------End Of List panel-collapse------------------------------------ */
			html +='</div>';/* -- ----------------END Organization panel-default Organization ----------------------------- */
			/* -------------------End Organization------------------------------------ */
			/* -------------------Department----------------------------------------- */
			html += '<div class="panel panel-default">';
				html += '<div class="panel-heading">';
					html += '<div class="panel-title">';
						html += '<a data-toggle="collapse" data-parent="#accordion"	href="#DepartmentMilestone">Department</a>';
						html += '<div class="form-group float-right">';
							html += '<input id="departmentMileHistoryStoneSearchBoxId" class="form-control input-sm searchMilestone" placeholder="Search">';
						html += '</div>';
					html += '</div>';
				html += '</div>';/* -- ----------------END of panel-heading----------------------------- */
				html +='<div id="DepartmentMilestone" class="panel-collapse collapse">';
				html +='<div id="DepartmentMileStonesList">';
				if(departmentMilestoneHistory.length>0){
					for(var i=0;i<departmentMilestoneHistory.length;i++){
						html += '<div class="panel-body" id="department-milestoneList-'+departmentMilestoneHistory[i].id+'">';
							html += '<div class="row">';
								html += '<div class="col-xs-12 MediumBoldGreyContent">'+departmentMilestoneHistory[i].departmentName+'</div>';
							html += '</div>';
							html +='<div class="row MilestoneValues">';
							html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += 'From <span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(departmentMilestoneHistory[i].setFromDate))+'</span>';
									html += '<div>';
										html += 'To <span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(departmentMilestoneHistory[i].setToDate))+'</span>';
									html += '</div>';
								html += '</div>';
								html += '<div class="col-sm-2 repufactor">';
									html += '<div class="MediumBoldDarkBlueContent"><div style="font-size: 14px;">Department Score</div>'+departmentMilestoneHistory[i].departmentRepufact.toFixed(2)+'%</div>';
								html += '</div>';
								html += '<div class="col-sm-2">';
									html += '<div class="MilestoneBlue">Milestone '+departmentMilestoneHistory[i].setPercentage+'%</div>';
								html += '</div>';
								
								
								//shravan
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += '<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
									if(departmentMilestoneHistory[i].milestoneStatus=="SuccessfullyCompleted"){
										html+=	'Milestone Status <span class="PositiveChangeLeftAlign">'+departmentMilestoneHistory[i].milestoneStatus+'</span>';
									}else if(departmentMilestoneHistory[i].milestoneStatus=="Failed"){
										html+=	'Milestone Status1 <span class="NoChangeLeftAlign">'+departmentMilestoneHistory[i].milestoneStatus+'</span>';
									}else{
										html+=	'Milestone Status <span class="NegativeChangeLeftAlign">'+departmentMilestoneHistory[i].milestoneStatus+'</span>';
									}
			                   html+=  '</div>';
			                   html += '</div>';
			                 
			                 
								
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += '<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
								html += 'Target Change';
								var departmentChange=departmentMilestoneHistory[i].departmentRepufact-departmentMilestoneHistory[i].setPercentage;
								if(departmentChange<0){
									html += '<span class="NegativeChangeLeftAlign">'+departmentChange.toFixed(2)+'%</span>';
								}else if(departmentChange==0){
									html += '<span class="NoChangeLeftAlign">'+departmentChange.toFixed(2)+'%</span>';
								}else if(departmentChange>0){
									html += '<span class="PositiveChangeLeftAlign">'+departmentChange.toFixed(2)+'%</span>';
								}
								html += '</div>';
								html += '</div>';
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
									html += '<div class="VerySmallBoldGreyContent">Days Remaining</div>';
									html += '<div class="MediumBoldDarkBlueContent">'+departmentMilestoneHistory[i].daysRemaining+'</div>';
								html += '</div>';
							html += '</div>';/* -- ----------------END of MilestoneValues----------------------------- */
						html += '</div>';/* -- ----------------END of panel-body----------------------------- */
					}
				}else{
					html +='<div class="panel-body"><font style="color: red">No MileStones Found</font></div>';
				}
				html +='</div>';
				html += '</div>';/* -- ----------------END of panel-collapse----------------------------- */
			html += '</div>';/* -- ----------------END of panel-default Department----------------------------- */
			/* -------------------End Department------------------------------------ */
			/* -------------------Kpi----------------------------------------- */
			html += '<div class="panel panel-default">';
				html += '<div class="panel-heading">';
					html += '<div class="panel-title">';
						html += '<a data-toggle="collapse" data-parent="#accordion"	href="#KpiMilestone">KPI</a>';
						html += '<div class="form-group float-right">';
							html += '<input id="kpiMileStoneHistorySearchBoxId" class="form-control input-sm searchMilestone" placeholder="Search">';
						html += '</div>';
					html += '</div>';
				html += '</div>';/* -- ----------------END of panel-heading----------------------------- */
				html +='<div id="KpiMilestone" class="panel-collapse collapse">';
				html +='<div id="KpiMileStonesList">';
				if(kpiMilestoneHistory.length>0){
					for(var i=0;i<kpiMilestoneHistory.length;i++){
						html += '<div class="panel-body" id="kpi-milestoneList-'+kpiMilestoneHistory[i].id+'">';
							html += '<div class="row">';
								html += '<div class="col-xs-12 MediumBoldGreyContent">'+kpiMilestoneHistory[i].kpiName+'</div>';
							html += '</div>';
							html +='<div class="row MilestoneValues">';
							html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += 'From <span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(kpiMilestoneHistory[i].setFromDate))+'</span>';
									html += '<div>';
										html += 'To <span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(kpiMilestoneHistory[i].setToDate))+'</span>';
									html += '</div>';
								html += '</div>';
								html += '<div class="col-sm-2 repufactor">';
									html += '<div class="MediumBoldDarkBlueContent"><div style="font-size: 14px;">KPI Score</div>'+kpiMilestoneHistory[i].kpiRepufact.toFixed(2)+'%</div>';
								html += '</div>';
								html += '<div class="col-sm-2">';
									html += '<div class="MilestoneBlue">Milestone '+kpiMilestoneHistory[i].setPercentage+'%</div>';
								html += '</div>';
								
								
								//shravan
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += '<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
									if(kpiMilestoneHistory[i].milestoneStatus=="SuccessfullyCompleted"){
										html+=	'Milestone Status <span class="PositiveChangeLeftAlign">'+kpiMilestoneHistory[i].milestoneStatus+'</span>';
									}else if(kpiMilestoneHistory[i].milestoneStatus=="Failed"){
										html+=	'Milestone Status1 <span class="NoChangeLeftAlign">'+kpiMilestoneHistory[i].milestoneStatus+'</span>';
									}else{
										html+=	'Milestone Status <span class="NegativeChangeLeftAlign">'+kpiMilestoneHistory[i].milestoneStatus+'</span>';
									}
			                   html+=  '</div>';
			                   html += '</div>';
								
								
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += '<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
								html += 'Target Change';
								var kpiChange=kpiMilestoneHistory[i].kpiRepufact-kpiMilestoneHistory[i].setPercentage;
								if(kpiChange<0){
									html += '<span class="NegativeChangeLeftAlign">'+kpiChange.toFixed(2)+'%</span>';
								}else if(kpiChange==0){
									html += '<span class="NoChangeLeftAlign">'+kpiChange.toFixed(2)+'%</span>';
								}else if(kpiChange>0){
									html += '<span class="PositiveChangeLeftAlign">'+kpiChange.toFixed(2)+'%</span>';
								}
								html += '</div>';
								html += '</div>';
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
									html += '<div class="VerySmallBoldGreyContent">Days Remaining</div>';
									html += '<div class="MediumBoldDarkBlueContent">'+kpiMilestoneHistory[i].daysRemaining+'</div>';
								html += '</div>';
							html += '</div>';/* -- ----------------END of MilestoneValues----------------------------- */
						html += '</div>';/* -- ----------------END of panel-body----------------------------- */
					}
				}else{
					html +='<div class="panel-body" id="departmentEmptyMileStone"><font style="color: red">No MileStones Found</font></div>';
				}
				html +='</div>';
				html += '</div>';/* -- ----------------END of panel-collapse----------------------------- */
			html += '</div>';/* -- ----------------END of panel-default kpi----------------------------- */
			/* -------------------End kpi------------------------------------ */
			/* -------------------Source----------------------------------------- */
			html += '<div class="panel panel-default">';
				html += '<div class="panel-heading">';
					html += '<div class="panel-title">';
						html += '<a data-toggle="collapse" data-parent="#accordion"	href="#SourceMilestone">Source</a>';
						html += '<div class="form-group float-right">';
							html += '<input id="sourceMileStoneHistorySearchBoxId" class="form-control input-sm searchMilestone" placeholder="Search">';
						html += '</div>';
					html += '</div>';
				html += '</div>';/* -- ----------------END of panel-heading----------------------------- */
				html +='<div id="SourceMilestone" class="panel-collapse collapse">';
				html +='<div id="SourceMileStonesList">';
				if(sourcetMilestoneHistory.length>0){
					for(var i=0;i<sourcetMilestoneHistory.length;i++){
						html += '<div class="panel-body" id="source-milestoneList-'+sourcetMilestoneHistory[i].id+'">';
							html += '<div class="row">';
								html += '<div class="col-xs-12 MediumBoldGreyContent">'+sourcetMilestoneHistory[i].sourceName+'</div>';
							html += '</div>';
							html +='<div class="row MilestoneValues">';
							html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += 'From <span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(sourcetMilestoneHistory[i].setFromDate))+'</span>';
									html += '<div>';
										html += 'To <span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(sourcetMilestoneHistory[i].setToDate))+'</span>';
									html += '</div>';
								html += '</div>';
								html += '<div class="col-sm-2 repufactor">';
									html += '<div class="SmallBoldGreyContent"><div style="font-size: 14px;">Source Score</div>'+sourcetMilestoneHistory[i].sourceRepufact.toFixed(2)+'%</div>';
								html += '</div>';
								html += '<div class="col-sm-2">';
									html += '<div class="MilestoneBlue">Milestone '+sourcetMilestoneHistory[i].setPercentage+'%</div>';
								html += '</div>';
								
								
								//shravan
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += '<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
									if(sourcetMilestoneHistory[i].milestoneStatus=="SuccessfullyCompleted"){
										html+=	'Milestone Status <span class="PositiveChangeLeftAlign">'+sourcetMilestoneHistory[i].milestoneStatus+'</span>';
									}else if(sourcetMilestoneHistory[i].milestoneStatus=="Failed"){
										html+=	'Milestone Status1 <span class="NoChangeLeftAlign">'+sourcetMilestoneHistory[i].milestoneStatus+'</span>';
									}else{
										html+=	'Milestone Status <span class="NegativeChangeLeftAlign">'+sourcetMilestoneHistory[i].milestoneStatus+'</span>';
									}
			                   html+=  '</div>';
			                   html += '</div>';
								
			                   /*-- --------------------------Target Change-----------------------------------------------*/
								
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
								html += '<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">Target Change';
								var sourceChange=sourcetMilestoneHistory[i].sourceRepufact-sourcetMilestoneHistory[i].setPercentage;
								if(sourceChange<0){
									html += '<span class="NegativeChangeLeftAlign">'+sourceChange.toFixed(2)+'%</span>';
								}else if(sourceChange==0){
									html += '<span class="NoChangeLeftAlign">'+sourceChange.toFixed(2)+'%</span>';
								}else if(sourceChange>0){
									html += '<span class="PositiveChangeLeftAlign">'+sourceChange.toFixed(2)+'%</span>';
								}
								html += '</div>';
								html += '</div>';
								
								 /*-- --------------------------Days Remaining-----------------------------------------------*/
								
								html += '<div class="col-sm-2 SmallDarkGreyHeader">';
									html += '<div class="VerySmallBoldGreyContent">Days Remaining</div>';
									html += '<div class="MediumBoldDarkBlueContent">'+sourcetMilestoneHistory[i].daysRemaining+'</div>';
								html += '</div>';
							html += '</div>';/* -- ----------------END of MilestoneValues----------------------------- */
						html += '</div>';/* -- ----------------END of panel-body----------------------------- */
					}
					html += '<select id="departmentsForMileStoneHistorySearch" style="display: none;">';
					for(var i=0;i<departmentMilestoneHistory.length;i++){
						html +='<option value= '+departmentMilestoneHistory[i].departmentId+'>'+departmentMilestoneHistory[i].departmentName+'</option>';
					}
					html += '</select>';
					html += '<select id="kpisForMileStoneHistorySearch" style="display: none;">';
					for(var i=0;i<kpiMilestoneHistory.length;i++){
						html +='<option value= '+kpiMilestoneHistory[i].kpiId+'>'+kpiMilestoneHistory[i].kpiName+'</option>';
					}
					html += '</select>';
					html += '<select id="sourcesForMileStoneHistorySearch" style="display: none;">';
					for(var i=0;i<sourcetMilestoneHistory.length;i++){
						html +='<option value= '+sourcetMilestoneHistory[i].sourceId+'>'+sourcetMilestoneHistory[i].sourceName+'</option>';
					}
					html += '</select>';
					/********************************************************************************************************************************************************/
					/*********************************************Auto Search*************************************************************************************/
					/********************************************************************************************************************************************************/
				}else{
					html +='<div class="panel-body"><font style="color: red">No MileStones Found</font></div>';
				}
				html +='</div>';
				html += '</div>';/* -- ----------------END of panel-collapse----------------------------- */
			html += '</div>';/* -- ----------------END of panel-default kpi----------------------------- */
			/* -------------------End Source------------------------------------ */
			html +='</div>';
			$('#milestoneHistoryDiv').append(html).show();
			milestoneHistoryAutoSearch("departmentsForMileStoneHistorySearch", "departmentMileHistoryStoneSearchBoxId",departmentModule,departmentCollapsableDivId,organizationId,fromDate,toDate);
			milestoneHistoryAutoSearch("kpisForMileStoneHistorySearch", "kpiMileStoneHistorySearchBoxId",kpiModule,kpiCollapsableDivId,organizationId,fromDate,toDate);
			milestoneHistoryAutoSearch("sourcesForMileStoneHistorySearch", "sourceMileStoneHistorySearchBoxId",sourceModule,sourceCollapsableDivId,organizationId,fromDate,toDate);
			 $( "#departmentMileHistoryStoneSearchBoxId" ).keyup(function() {
				  searhcedList("---ALL---","Department","DepartmentMilestone",organizationId,fromDate,toDate);
			});
			 $( "#kpiMileStoneHistorySearchBoxId" ).keyup(function() {
				  searhcedList("---ALL---","Kpi","KpiMileStone",organizationId,fromDate,toDate);
			});
				  
			 $( "#sourceMileStoneHistorySearchBoxId" ).keyup(function() {
				 searhcedList("---ALL---","Source","SourceMileStone",organizationId,fromDate,toDate);
			});
			}else {
				$('#milestoneHistoryDiv').html('<h4><font color="red">No data found!!</font></h4>');	
			}
		},error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                // alert('Not connect.\n Verify Network.');
             } else if (jqXHR.status == 404) {
                // alert('Requested page not found. [404]');
             } else if (jqXHR.status == 500) {
                // alert('Internal Server Error [500].');
             } else if (exception === 'parsererror') {
                 //alert('Requested JSON parse failed.');
             }
		}
         
	});
}
function milestoneHistoryAutoSearch(listId,searchBoxId,factorName,CollapsableDivId,organizationId,fromDate,toDate){
	var values = [];
	  var NoResultsLabel = "No Results Found.";
	  values.push(all);
	  if(factorName===departmentModule){
		  for(var i=0;i<departmentNameList.length;i++){
			  values.push(departmentNameList[i]);
		  }
	  }
	  if(factorName===kpiModule){
		  for(var i=0;i<kpiNameList.length;i++){
			  values.push(kpiNameList[i]);
		  }
	  }
	  if(factorName===sourceModule){
		  for(var i=0;i<sourceNameList.length;i++){
			  values.push(sourceNameList[i]);
		  }
	  }
	  /*$('#'+listId+' option').each(function() { 
		  var label = $.trim($(this).text());
		  values.push(label);
	  });*/
	  $("#"+searchBoxId).autocomplete({
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
			           $(this).val(label);
			           searhcedList(label, factorName,CollapsableDivId,organizationId,fromDate,toDate);
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
}
function searhcedList(searchText,factorName,dataDivId,organizationId,fromDate,toDate){
	//loadingForDashBoard();
	var JSONObject = {'searchText':searchText,'factorName':factorName,'organizationId':organizationId,'fromDate':fromDate,'toDate':toDate};
	var divId = $('#'+factorName+"MileStonesList");
	divId.html('');
	$.ajax({
		type:"POST",
		url:"../milestoneHistory/search.htm",
		contentType:"application/json",
		data:JSON.stringify(JSONObject),
		success:function(response){
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
		},error: function(error){
			jqueryPostError(response);
		}
	});
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
	var milestoneStatus=departmentMileStone.milestoneStatus;
	currentRepufactor = parseFloat(currentRepufactor);
	currentRepufactor = currentRepufactor.toFixed(2);
	html+=	'<div id="DepartmentMileStonesList">';
	html+=	'<div class="panel-body" id="department-milestoneList-'+id+'">'+
				'<div class="row">'+
					'<div class="col-xs-12 MediumBoldGreyContent">'+departmentName+'</div>'+
				'</div>'+
				'<div class="row MilestoneValues">'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'From<span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(fromDate))+'</span>'+
						'<div>'+
							'To<span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(toDate))+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="col-sm-2 repufactor">'+
					'<div class="MediumBoldDarkBlueContent"><div style="font-size: 14px;">Department Score</div>'+currentRepufactor+'%</div>'+
					'</div>'+
					'<div class="col-sm-2">'+
					'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
					'</div>'+
					
					
					//shravan
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
					'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
						if(milestoneStatus=="SuccessfullyCompleted"){
							html+=	'Milestone Status <span class="PositiveChangeLeftAlign">'+milestoneStatus+'</span>';
						}else if(milestoneStatus=="Failed"){
							html+=	'Milestone Status1 <span class="NoChangeLeftAlign">'+milestoneStatus+'</span>';
						}else{
							html+=	'Milestone Status <span class="NegativeChangeLeftAlign">'+milestoneStatus+'</span>';
						}
                 html+=  '</div>'+
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
				'</div>'+
				'<div class="panel-body addMilestone" id="editDepartmentMileStoneDivId_'+id+'" style="display: none;"></div>'+
			'</div>'+
			'</div>';
		return html;	
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
					'<div class="col-xs-12 MediumBoldGreyContent">'+sourceName+'</div>'+
				'</div>'+
				'<div class="row MilestoneValues">'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'From<span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(fromDate))+'</span>'+
						'<div>'+
							'To<span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(toDate))+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="col-sm-2 repufactor">'+
					'<div class="class="SmallBoldGreyContent"><div style="font-size: 14px;">Source Score</div>'+currentRepufactor+'%</div>'+
				'</div>'+
				'<div class="col-sm-2">'+
					'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
				'</div>'+
				
				
				
				//shravan
				'<div class="col-sm-2 SmallDarkGreyHeader">'+
				'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
					if(mileStone.milestoneStatus=="SuccessfullyCompleted"){
						html+=	'Milestone Status <span class="PositiveChangeLeftAlign">'+mileStone.milestoneStatus+'</span>';
					}else if(mileStone.milestoneStatus=="Failed"){
						html+=	'Milestone Status1 <span class="NoChangeLeftAlign">'+mileStone.milestoneStatus+'</span>';
					}else{
						html+=	'Milestone Status <span class="NegativeChangeLeftAlign">'+mileStone.milestoneStatus+'</span>';
					}
             html+=  '</div>'+
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
				'</div>'+
				'<div class="panel-body addMilestone" id="editSourceMileStoneDivId_'+id+'" style="display: none;"></div>'+
			'</div></div>';
		return html;	
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
					'<div class="col-xs-12 MediumBoldGreyContent">'+kpiName+'</div>'+
				'</div>'+
				'<div class="row MilestoneValues">'+
					'<div class="col-sm-2 SmallDarkGreyHeader">'+
						'From<span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(fromDate))+'</span>'+
						'<div>'+
							'To<span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(toDate))+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="col-sm-2 repufactor">'+
					'<div class="SmallBoldGreyContent"><div style="font-size: 14px;">KPI Score</div>'+currentRepufactor+'%</div>'+
				'</div>'+
				'<div class="col-sm-2">'+
				'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
				'</div>'+
				
				
				
				//shravan
				'<div class="col-sm-2 SmallDarkGreyHeader">'+
				'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
					if(mileStone.milestoneStatus=="SuccessfullyCompleted"){
						html+=	'Milestone Status <span class="PositiveChangeLeftAlign">'+mileStone.milestoneStatus+'</span>';
					}else if(mileStone.milestoneStatus=="Failed"){
						html+=	'Milestone Status1 <span class="NoChangeLeftAlign">'+mileStone.milestoneStatus+'</span>';
					}else{
						html+=	'Milestone Status <span class="NegativeChangeLeftAlign">'+mileStone.milestoneStatus+'</span>';
					}
             html+=  '</div>'+
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
				'</div>'+
				'<div class="panel-body addMilestone" id="editKpiMileStoneDivId_'+id+'" style="display: none;"></div>'+
			'</div></div>';
		return html;	
}
$("#exportMilestoneHistory").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	console.log(fromDate);
	redirectView("../milestoneHistory/exportMilestoneHistory.htm?organizationId="+organizationId+"&fromDate="+fromDate+"&toDate="+toDate); 
});
