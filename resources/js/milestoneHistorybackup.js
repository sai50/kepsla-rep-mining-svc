var sessionSelectedOrganizationId=0;
var mileStoneUrl = "../milestoneHistory/";
var departmentCollapsableDivId = "DepartmentMilestone";
var kpiCollapsableDivId = "KpiMilestone";
var sourceCollapsableDivId = "SourceMilestone";
var organizationCollapsableDivId = "OrganizationMilestone";
var departmentModule = "Department";
var kpiModule = "Kpi";
var sourceModule = "Source";
var organizationMoudle = "Organization";
var all = "---ALL---";



var milestoneHistoryFromDate = "milestoneHistoryFromDate";
var milestoneHistoryToDate = "milestoneHistoryToDate";
var milestoneHistoryApplyButton = "milestoneHistoryApply";
$("#milestoneHistoryFromDate").datepicker({
	defaultDate : "+1w",
	changeMonth : true,
	numberOfMonths : 1,
	dateFormat:'d M yy',
	altField: "#altMilestoneHistoryFromDate",
	altFormat: "yy-mm-dd",
	maxDate: new Date,
	onClose : function(selectedDate) {
		$("#milestoneHistoryToDate").datepicker("option", "minDate", selectedDate);
		dateValidation(milestoneHistoryFromDate,milestoneHistoryToDate,milestoneHistoryApplyButton);
	}
});

$("#milestoneHistoryToDate").datepicker({
	defaultDate : "+1w",
	changeMonth : true,
	numberOfMonths : 1,
	dateFormat:'d M yy',
	altField: "#altMilestoneHistoryToDate",
	altFormat: "yy-mm-dd",
	maxDate: new Date,
	onClose : function(selectedDate) {
	$("#milestoneHistoryFromDate").datepicker("option", "maxDate", selectedDate);
	dateValidation(milestoneHistoryFromDate,milestoneHistoryToDate,milestoneHistoryApplyButton);
	}

});


/*$(document).ready(function() {
	
	// $.ajaxSetup({ cache: false }); 
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
	getSessionData();
	poplateOrganizations(function(selectedOrgId) {
		//getMilestoneHistory(selectedOrgId);
	});
	   
});*/
function filterMilestoneHistory(){
	loadingForDashBoard();
	var organizationId = $('#milestoneHistoryOrganization option:selected').val();
  	var fromDate = $("#altMilestoneHistoryFromDate").datepicker().val();
  	var toDate = $("#altMilestoneHistoryToDate").datepicker().val();
	window.location.href = mileStoneUrl+"milestoneHistoryData.htm";
	return false;
}
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
			loadingForDashBoard();
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
				unloadingForDashBoard();
			},'json').fail(function(response){
				jqueryPostError(response);
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
							'<div class="ActualScoreForMilestone">'+currentRepufactor+'%</div>'+
							'</div>'+
							'<div class="col-sm-3">'+
							'<div class="MilestoneBlue">Milestone '+mileStonePercentage+'%</div>'+
							'</div>'+
							'<div class="col-sm-2 SmallDarkGreyHeader">'+
								'<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">';
									if(trajectoryChange>0.0){
										html+=	'Target Change <br><br><span class="PositiveChangeLeftAlign">'+trajectoryChange+'%</span>';
									}else if(trajectoryChange==0.0){
										html+=	'Target Change <br><br><span class="NoChangeLeftAlign">'+trajectoryChange+'%</span>';
									}else if(trajectoryChange<0.0){
										html+=	'Target Change <br><br><span class="NegativeChangeLeftAlign">'+trajectoryChange+'%</span>';
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
	  
	  
	  
	  //shravan
	  
	  

	  /*function getMilestoneHistory(organizationId){
	  	var fromDate = $("#altFromDate").datepicker().val();
	  	var toDate = $("#altToDate").datepicker().val();
	  	$.ajax({
	  		type:"POST",
	  		url:"../milestoneHistory/exportMilestoneHistory.htm",
	  		contentType:"application/json",
	  		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
	  		success:function(response){
	  			if(response.length>0){
	  				var orgName = response[0].organizationName;
	  				$('#orgName').text(orgName);
	  				$('#exortoToExcel').show();
	  				$('#milestoneHistoryDiv').html('');
	  				
	  				var map ={};
	  				map['id'] = 6;
	  				map['name'] ="dsafa";
	  				targetList.push(map);
	  				
	  				for(var i=0; i< response.length; i++){
	  					var targetList=new Array();
	  					var placeholder=null;
	  					if(response[i].repufactor!=null){
	  						//alert("repLen: "+response[i].repufactor.length);
	  						placeholder = "Repufactor";
	  						var repufactorList = response[i].repufactor;
	  						//console.log(repufactorList);
	  						for(var k=0;k<repufactorList.length;k++){
	  							targetList.push(repufactorList[k]);
	  						}
	  						//console.log(targetList);
	  					}
	  					else if(response[i].sourceFactor!=null){
	  						//alert("sourceLen: "+response[i].sourceFactor.length);
	  						placeholder = "Source";
	  						var sourceList = response[i].sourceFactor;
	  						for(var k=0;k<sourceList.length;k++){
	  							targetList.push(sourceList[k]);
	  						}
	  					}
	  					else if(response[i].departmentFactor!=null){
	  						alert("depLen: "+response[i].departmentFactor.length);
	  						placeholder = "Department";
	  						var depList = response[i].departmentFactor;
	  						for(var k=0;k<depList.length;k++){
	  							targetList.push(depList[k]);
	  						}
	  					}
	  					else if(response[i].kpiFactor!=null){
	  						
	  						//alert("kpiLen: "+response[i].kpiFactor.length);
	  						placeholder = "KPI";
	  						var kpiList = response[i].kpiFactor;
	  						for(var k=0;k<kpiList.length;k++){
	  							targetList.push(kpiList[k]);
	  						}
	  					}
	  					//console.log(targetList);
	  					var html = "";
	  					html += '<div class="col-lg-12">';
	  					html += '<div class="panel panel-default MilestoneHistoryMonthTimer">';
	  					html +='<div class="panel-heading"> '+response[i].date+' </div>';
	  					html +='<div class="panel-body">';
	                      html +='<div class="panel-group MilestoneHistory" id="accordion">';
	  					html +='<div class="panel panel-default">';
	                      html +='<div class="panel-heading">';
	                      html+='<div class="panel-title">';
	                      html +='<a data-toggle="collapse" data-parent="#accordion" href="#DepartmentMilestone'+i+'">'+placeholder+'</a>';
	                      html +='</div>';
	                      html +='</div>';
	                      html +='<div id="DepartmentMilestone'+i+'" class="panel-collapse collapse in">';
	                      for(var j=0;j<targetList.length;j++){
	                      	html +='<div class="panel-body">';
	  						html +='<div class="row">';
	  						html +='<div class="col-xs-12 MediumBoldGreyContent">'+targetList[j].name+'</div>';
	  						html +='</div>';
	  						html +='<div class="row MilestoneValues">';
	  						html +='<div class="col-sm-2 SmallDarkGreyHeader">';
	  						html +='From <span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(targetList[j].setFromDate))+'</span>';
	  						html +='<div>To <span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(targetList[j].setToDate))+'</span></div>';
	  						html +='</div>';
	  						html +='<div class="col-sm-3 SmallDarkGreyHeader">';
	  						html +='<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">Trajectory Change';
	  						html +='<span class="PositiveChangeLeftAlign">'+targetList[j].trajectoryChange+'%</span>';
	  						html +='</div>';
	  						html +='</div>';
	  						html +='<div class="col-sm-2 SmallDarkGreyHeader">';
	  						html +='<span class="PositiveChangeLeftAlign">'+targetList[j].milestoneStatus+'</span>';
	  						html +='</div>';
	  						html +='<div class="col-sm-3">';
	  						html +='<div class="MilestoneBlue">';
	  						html +='Milestone '+targetList[j].actualPercentageValue+'%';
	  						html +='</div>';
	  						html +='</div>';
	  						html +='<div class="col-sm-2 repufactor">';
	  						html +='<div class="ActualScoreForMilestone">'+targetList[j].setPercentage+'%</div>';
	  						html +='</div>';
	  						html +='</div>';
	  						html +='</div>';
	                      }
	                      html +='</div>';	//DepartmentMilestone
	                      html +='</div>';     //panel-default
	                      html +='</div>';     //panel-group
	                      html +='</div>';     //panel-body
	                      html +='</div>';     
	                      html +='</div>';     //col-lg-12
	  						
	                      $('#milestoneHistoryDiv').append(html).show();
	  				}
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
	  */
	  
	  //based on date range data should show
	  
	  function getMilestoneHistory(organizationId){
		  	var fromDate = $("#altFromDate").datepicker().val();
		  	var toDate = $("#altToDate").datepicker().val();
		  	$.ajax({
		  		type:"POST",
		  		url:"../milestoneHistory/milestoneHistoryData.htm",
		  		contentType:"application/json",
		  		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		  		success:function(response){
		  			if(response.length>0){
		  				var orgName = response[0].organizationName;
		  				$('#orgName').text(orgName);
		  				$('#exortoToExcel').show();
		  				$('#milestoneHistoryDiv').html('');
		  				
		  				var map ={};
		  				map['id'] = 6;
		  				map['name'] ="dsafa";
		  				targetList.push(map);
		  				
		  				for(var i=0; i< response.length; i++){
		  					var targetList=new Array();
		  					var placeholder=null;
		  					if(response[i].repufactor!=null){
		  						//alert("repLen: "+response[i].repufactor.length);
		  						placeholder = "Repufactor";
		  						var repufactorList = response[i].repufactor;
		  						//console.log(repufactorList);
		  						for(var k=0;k<repufactorList.length;k++){
		  							targetList.push(repufactorList[k]);
		  						}
		  						//console.log(targetList);
		  					}
		  					else if(response[i].sourceFactor!=null){
		  						//alert("sourceLen: "+response[i].sourceFactor.length);
		  						placeholder = "Source";
		  						var sourceList = response[i].sourceFactor;
		  						for(var k=0;k<sourceList.length;k++){
		  							targetList.push(sourceList[k]);
		  						}
		  					}
		  					else if(response[i].departmentFactor!=null){
		  						alert("depLen: "+response[i].departmentFactor.length);
		  						placeholder = "Department";
		  						var depList = response[i].departmentFactor;
		  						for(var k=0;k<depList.length;k++){
		  							targetList.push(depList[k]);
		  						}
		  					}
		  					else if(response[i].kpiFactor!=null){
		  						
		  						//alert("kpiLen: "+response[i].kpiFactor.length);
		  						placeholder = "KPI";
		  						var kpiList = response[i].kpiFactor;
		  						for(var k=0;k<kpiList.length;k++){
		  							targetList.push(kpiList[k]);
		  						}
		  					}
		  					//console.log(targetList);
		  					var html = "";
		  					html += '<div class="col-lg-12">';
		  					html += '<div class="panel panel-default MilestoneHistoryMonthTimer">';
		  					html +='<div class="panel-heading"> '+response[i].date+' </div>';
		  					html +='<div class="panel-body">';
		                      html +='<div class="panel-group MilestoneHistory" id="accordion">';
		  					html +='<div class="panel panel-default">';
		                      html +='<div class="panel-heading">';
		                      html+='<div class="panel-title">';
		                      html +='<a data-toggle="collapse" data-parent="#accordion" href="#DepartmentMilestone'+i+'">'+placeholder+'</a>';
		                      html +='</div>';
		                      html +='</div>';
		                      html +='<div id="DepartmentMilestone'+i+'" class="panel-collapse collapse in">';
		                      for(var j=0;j<targetList.length;j++){
		                      	html +='<div class="panel-body">';
		  						html +='<div class="row">';
		  						html +='<div class="col-xs-12 MediumBoldGreyContent">'+targetList[j].name+'</div>';
		  						html +='</div>';
		  						html +='<div class="row MilestoneValues">';
		  						html +='<div class="col-sm-2 SmallDarkGreyHeader">';
		  						html +='From <span class="VerySmallBoldGreyContent marginRight5">'+$.datepicker.formatDate('d M yy',new Date(targetList[j].setFromDate))+'</span>';
		  						html +='<div>To <span class="VerySmallBoldGreyContent">'+$.datepicker.formatDate('d M yy',new Date(targetList[j].setToDate))+'</span></div>';
		  						html +='</div>';
		  						html +='<div class="col-sm-3 SmallDarkGreyHeader">';
		  						html +='<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">Trajectory Change';
		  						html +='<span class="PositiveChangeLeftAlign">'+targetList[j].trajectoryChange+'%</span>';
		  						html +='</div>';
		  						html +='</div>';
		  						html +='<div class="col-sm-2 SmallDarkGreyHeader">';
		  						html +='<span class="PositiveChangeLeftAlign">'+targetList[j].milestoneStatus+'</span>';
		  						html +='</div>';
		  						html +='<div class="col-sm-3">';
		  						html +='<div class="MilestoneBlue">';
		  						html +='Milestone '+targetList[j].actualPercentageValue+'%';
		  						html +='</div>';
		  						html +='</div>';
		  						html +='<div class="col-sm-2 repufactor">';
		  						html +='<div class="ActualScoreForMilestone">'+targetList[j].setPercentage+'%</div>';
		  						html +='</div>';
		  						html +='</div>';
		  						html +='</div>';
		                      }
		                      html +='</div>';	//DepartmentMilestone
		                      html +='</div>';     //panel-default
		                      html +='</div>';     //panel-group
		                      html +='</div>';     //panel-body
		                      html +='</div>';     
		                      html +='</div>';     //col-lg-12
		  						
		                      $('#milestoneHistoryDiv').append(html).show();
		  				}
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
	  
	  $(".filterButton").click(function(e){
	  	var organizationId = $('#organizationName option:selected').val();
	  	var fromDate = $("#altFromDate").datepicker().val();
	  	var toDate = $("#altToDate").datepicker().val();
	  	//getMilestoneHistory(organizationId);
	  	window.location.href = "../milestoneHistory/exportMilestoneHistory.htm?organizationId="+organizationId+"&fromDate="+fromDate+"&toDate="+toDate;
	  });
