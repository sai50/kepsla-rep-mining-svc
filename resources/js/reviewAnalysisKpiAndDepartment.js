var sessionSelectedOrganizationId=0;
var start=0;
var end=10;
var count=0;
var startkpi=0;
var endkpi=10;
var keywordResponse;
var departmentResponse;
var kpiFactorResponse;

$(document).ready(function() {
	 $.ajaxSetup({ cache: false });
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
	
	poplateOrganizationForKpiDepartment(function(selectedOrgId) {
		showRepufactScoreAndChange(selectedOrgId);
		getReviewCountKpiAndDepartment(selectedOrgId);
		getReviewCountReferencesKpiAndDepartment(selectedOrgId);
		getDepartmentPerformanceIndicatorForKpiDepartment(selectedOrgId);
		showKpiPolaritycount(selectedOrgId);
//		kpiPolaritycount(selectedOrgId);
		departmentKeywordAnalysis(selectedOrgId);
 });
	})
});



$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showRepufactScoreAndChange(organizationId);
	getReviewCountKpiAndDepartment(organizationId);
	getReviewCountReferencesKpiAndDepartment(organizationId);
	getDepartmentPerformanceIndicatorForKpiDepartment(organizationId);
	showKpiPolaritycount(organizationId);
//	kpiPolaritycount(organizationId);
    departmentKeywordAnalysis(organizationId);
  
});
function setDefaults(){
	$("#from").datepicker("setDate","-1m");
	$("#to").datepicker("setDate",new Date());
}


/**************************************************************************************************************************
 *                     Show Organization Repufactor and Change                                                          				*
 **************************************************************************************************************************/

function showRepufactScoreAndChange(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getRepufactorScore.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			var organizationRepuFactor=response.successObject.currentRepufactor;
			var organizationRepufactChange=response.successObject.repufactorMap.change;
			getReviewCountReferencesKpiAndDepartment(organizationId,organizationRepuFactor,organizationRepufactChange);
		if(organizationRepufactChange>0){
		  $("#targetChangeValue").html('<span class="PositiveChangeLeftAlign">'+organizationRepufactChange+'</span>');
		  $("#kpiTargetChangeValue").html('<span class="PositiveChangeLeftAlign">'+organizationRepufactChange+'</span>');
		}
		else if(organizationRepufactChange<0){
		$("#targetChangeValue").html('<span class="NegativeChangeLeftAlign">'+organizationRepufactChange+'</span>');
		$("#kpiTargetChangeValue").html('<span class="NegativeChangeLeftAlign">'+organizationRepufactChange+'</span>');
			}
		else{
		$("#targetChangeValue").html('<span class="NoChangeLeftAlign">'+organizationRepufactChange+'</span>');
		$("#kpiTargetChangeValue").html('<span class="NoChangeLeftAlign">'+organizationRepufactChange+'</span>');	
			}
		}
	});
}
		
/**************************************************************************************************************************
 *                     Show Kpi Repufactor and Change                                                          				*
 **************************************************************************************************************************/
function applyFilter(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewKpiAndDepartment/getKpiRepucatScore.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
		if(response.length>0){
		for(var i=0;i<response.length;i++){
		$("#kpiFactor").text(response.currentKpiRepufactor);	
			if(response.change>0){
				$('#repufactChange').html('<span class="PositiveChange">'+response.change+'%</span>');
				}else if(response.change<0){
					$('#repufactChange').html('<span class="NegativeChange">'+response.change+'%</span>');
				}else{
					$('#repufactChange').html('<span class="NoChange">'+response.change+'%</span>');
				}
		}}else{
			
		}
		}
	});
}

function poplateOrganizationForKpiDepartment(callback){
	commonOrgPopulation(callback,'organizationName');
};
	
	function getReviewCountKpiAndDepartment(organizationId){
		//loadingForDashBoard();
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/getAllReviews.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
			$("#reviewTotalCount").text(response);
			$("#kpiReviewTotalCount").text(response);
			}
		});
	}
	
	//finding total reviews for organization
	function getReviewCountReferencesKpiAndDepartment(organizationId,organizationRepuFactor){
		//loadingForDashBoard();
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/getSentimentTotalCounts.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
			var positive=	response.positive;
			var negative=	response.negative;
			var neutral=	response.neutral;
			var totalReferences=positive+negative+neutral;
			$("#totalReferencesCount").text(totalReferences);
			$("#kpiTotalReferencesCount").text(totalReferences);
			$("#positive").text(positive);
			$("#negative").text(negative);
			$("#neutral").text(neutral);
			$("#kpiPositive").text(positive);
			$("#kpiNegative").text(negative);
			$("#kpiNeutral").text(neutral);
			//calculating sentiments
			var totalCount=positive+negative+neutral;
			var xvalue=organizationRepuFactor/totalCount;
			//var positiveValue=positive*xvalue;
			//var negativeValue=negative*xvalue;
			//var neutralValue=neutral*xvalue;
			
			var positiveValue=(positive/totalCount)*100;
			var negativeValue=(negative/totalCount)*100;
			var neutralValue=(neutral/totalCount)*100;
			
			$("#positiveDepartmentPercentageCount").text(positiveValue.toFixed(2)+"%");
			$("#negativeDepartmentPercentageCount").text(negativeValue.toFixed(2)+"%");
			$("#neutralDepartmentPercentageCount").text(neutralValue.toFixed(2)+"%");
			$("#positiveKpiPercentageCount").text(positiveValue.toFixed(2)+"%");
			$("#negativeKpiPercentageCount").text(negativeValue.toFixed(2)+"%");
			$("#neutralKpiPercentageCount").text(neutralValue.toFixed(2)+"%");
			
			}
		});
	}


	//department factor whole list.
	function getDepartmentPerformanceIndicatorForKpiDepartment(organizationId){
		loadingForDashBoard();
		var milestonePercentage=0;
		var trajectoryChanges=0;
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/getDepartmentPerformanceIndicators.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
			departmentResponse=response;
			var departmentNameLists=new Array();
			var departmentPolarityLists=new Array();
			var departmentFactorLists=new Array();
			var positiveArray=new Array();
			var negativeArray=new Array();
			var neutralArray=new Array();
			var positiveReferencesArray = new Array();
			var negativeReferencesArray = new Array();
			var neautralReferencesArray = new Array();
			$("#departmentFactorDivs").html('');
				if(response.length>0){
				for(var i=0; i<response.length; i++){
					var html = "";
					//graph
					var departmentName= response[i].departmentName.trim();
					var departmentNames = departmentName.replace(/ +/g, "");
					var polarityCounts = response[i].polarityCounts;
					departmentNameLists.push(departmentNames);
					departmentPolarityLists.push(polarityCounts);
					//departmentDiv
					var departmentFactor = Math.round((response[i].departmentFactor) * 100) / 100;
					departmentFactorLists.push(departmentFactor);
					var departmentFactorChange = Math.round((response[i].departmentFactorChange) * 100) / 100;
					var totalReferences=polarityCounts.positive+polarityCounts.neutral+polarityCounts.negative;
					//calculating sentiments
					var totalCount=polarityCounts.positive+polarityCounts.negative+polarityCounts.neutral;
    				var positive=polarityCounts.positive;
                    var negetive=polarityCounts.negative;
                    var neutral=polarityCounts.neutral;
					var positiveValue=((positive/totalCount)*100).toFixed(2);
					var negativeValue=((negetive/totalCount)*100).toFixed(2);
					var neutralValue=((neutral/totalCount)*100).toFixed(2);
					var departmentMilestoneGoal=response[i].milestoneSetPercentage;
					
					for(var j=0;j<departmentMilestoneGoal.length;j++){
						milestonePercentage=departmentMilestoneGoal[j].setPercentage;
						trajectoryChanges=departmentMilestoneGoal[j].trajectoryChange;
					}
					
					html+='<div id="departmentFactorDivs"  onClick=showDepartmentFactorPopUp('+organizationId+','+response[i].id+',\'' + departmentNames + '\')>'
					+'<div class="panel-body KPIDepartmentFactorTableBody" data-toggle="modal" data-target=".DepartmentLightBox">'
					+'<div class="row">'
						+'<div class="col-xs-12 col-md-2">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Department </div>'
							+'<div id="departmentName" class="MediumBoldGreyContent">'+departmentName+'</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-1">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">References </div>'
							+'<div id="totalReviewReference" class="SmallBoldGreyContent">'+totalReferences+'</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-4">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Sentiments </div>'
							+'<div class="HappyCountIcon col-xs-4">'
								+'<div id="positive" class="VerySmallGreyContent">'+polarityCounts.positive+''
								+'</div>';
								if(positiveValue=="NaN" || positiveValue=="undefined"){
								html += '<div class="VerySmallBoldGreyContent">0.00%';
								}else{
								html += '<div class="VerySmallBoldGreyContent">'+positiveValue+'%';	
								}
								html += '</div>'
							+'</div>'
							+'<div class="NormalCountIcon col-xs-4">'
								+'<div id="neutral" class="VerySmallGreyContent">'+polarityCounts.neutral+''
								+'</div>';
								if(neutralValue=="NaN" || neutralValue=="undefined"){
									html += '<div class="VerySmallBoldGreyContent">0.00%';
								}else{
									html += '<div class="VerySmallBoldGreyContent">'+neutralValue+'%';
								}
								html += '</div>'
							+'</div>'	
							+'<div class="SadCountIcon col-xs-4">'
								+'<div id="negative" class="VerySmallGreyContent">'+polarityCounts.negative+''
								+'</div>';
								if(neutralValue=="NaN" || neutralValue=="undefined"){
									html += '<div class="VerySmallBoldGreyContent">0.00%';
								}else{
									html += '<div class="VerySmallBoldGreyContent">'+negativeValue+'%';
								}
								html += '</div>'
								
							+'</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-1">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Trend Change </div>'
							+'<div>';
							if(departmentFactorChange>0){
						html	+='<span id="trendChange" class="PositiveChangeLeftAlign">'+departmentFactorChange+'</span>';
							}else if(departmentFactorChange<0){
						html	+='<span id="trendChange" class="NegativeChangeLeftAlign">'+departmentFactorChange+'</span>';
							}else{
						html    +='<span id="trendChange" class="NoChangeLeftAlign">0.00</span>';
							}
						html	+='</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-2">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Department Score  </div>'
							+'<div id="departmentFactor" class="MediumBoldDarkBlueContent" value='+departmentFactor+'>'+departmentFactor.toFixed(2)+'%</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-2">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Milestone</div>'
							+'<div>';
						//html+='<span id="milestoneTrajectoryChange" class="MilestoneBlue">NA</span>';
					    if(departmentMilestoneGoal == null || departmentMilestoneGoal == "" || trajectoryChanges==null ){
					    	html+='<span id="milestoneTrajectoryChange" class="NoChange">NA</span>';
					    }else if(trajectoryChanges>0){
						    html+='<span id="milestoneTrajectoryChange" class="PositiveChange">'+trajectoryChanges+'</span>';
						    }else if(trajectoryChanges<0){
						    	 html+='<span id="milestoneTrajectoryChange" class="NegativeChange">'+trajectoryChanges+'</span>';
									}else{
										html+='<span id="milestoneTrajectoryChange" class="NoChange">NA</span>';
									}
					    if(departmentMilestoneGoal == null || departmentMilestoneGoal == "" ){
					    	html+=	'<span id="milestoneSetPercentage" class="MilestoneBlue">NA</span>';
							}else{
							html+='<span id="milestoneSetPercentage" class="MilestoneBlue">'+milestonePercentage+'%</span>';
							}
							html+='</div>'
						+'</div>'
					+'</div>'
				  +'</div>'
				+'</div>';
				var totalCount=polarityCounts.positive+polarityCounts.negative+polarityCounts.neutral;
				var positiveReferences = polarityCounts.positive;
				var negativeReferences = polarityCounts.negative;
				var neautralReferences  = polarityCounts.neutral;
				var xvalue=departmentFactor/totalCount;
				var positiveValue=(polarityCounts.positive*xvalue).toFixed(2);
				var negativeValue=(polarityCounts.negative*xvalue).toFixed(2);
				var neutralValue=(polarityCounts.neutral*xvalue).toFixed(2);
				positiveArray.push(parseFloat(positiveValue));
				negativeArray.push(parseFloat(negativeValue));
				neutralArray.push(parseFloat(neutralValue));
				positiveReferencesArray.push(positiveReferences);
				negativeReferencesArray.push(negativeReferences);
				neautralReferencesArray.push(neautralReferences);
				$("#departmentFactorDivs").append(html).show();
				}
				departmentFactorChartGraphs(departmentNameLists,departmentPolarityLists,departmentFactorLists,positiveArray,negativeArray,neutralArray,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
				 
				}else{
					$('#departmentFactorDivs').html('');
				 	$('#departmentFactorDivs').append('<h5><font color="red">No Data Found</font></h5>');
				}
			}
			
		});
		//unloadingForDashBoard();
	}

	
	function nextDepartmentFactor(){
		start=start+10;
		end=end+10;
		var departmentNameLists=new Array();
		var departmentPolarityLists=new Array();
		var departmentFactorLists=new Array();
		var positiveArray=new Array();
		var negativeArray=new Array();
		var neutralArray=new Array();
		var positiveReferencesArray = new Array();
		var negativeReferencesArray = new Array();
		var neautralReferencesArray = new Array();
		for(var i=0; i<departmentResponse.length; i++){
			//graph
			var departmentName= departmentResponse[i].departmentName;
			var polarityCounts = departmentResponse[i].polarityCounts;
			departmentNameLists.push(departmentName);
			departmentPolarityLists.push(polarityCounts);
			//departmentDiv
			var departmentFactor = Math.round((departmentResponse[i].departmentFactor) * 100) / 100;
			departmentFactorLists.push(departmentFactor);
			var totalCount=polarityCounts.positive+polarityCounts.negative+polarityCounts.neutral;
			var xvalue=departmentFactor/totalCount;
			var positiveValue=polarityCounts.positive*xvalue;
			var negativeValue=polarityCounts.negative*xvalue;
			var neutralValue=polarityCounts.neutral*xvalue;
			positiveArray.push(positiveValue);
			negativeArray.push(negativeValue);
			neutralArray.push(neutralValue);
			positiveReferencesArray.push(polarityCounts.positive);
			negativeReferencesArray.push(polarityCounts.negative);
			neautralReferencesArray.push(polarityCounts.neutral);
		}
		departmentFactorChartGraphs(departmentNameLists,departmentPolarityLists,departmentFactorLists,positiveArray,negativeArray,neutralArray,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
		
	}
	
	
	function previousDepartmentFactor(){
		start=start-10;
		end=end-10;
		var departmentNameLists=new Array();
		var departmentPolarityLists=new Array();
		var departmentFactorLists=new Array();
		var positiveArray=new Array();
		var negativeArray=new Array();
		var neutralArray=new Array();
		var positiveReferencesArray = new Array();
		var negativeReferencesArray = new Array();
		var neautralReferencesArray = new Array();
		for(var i=0; i<departmentResponse.length; i++){
			//graph
			var departmentName= departmentResponse[i].departmentName;
			var polarityCounts = departmentResponse[i].polarityCounts;
			departmentNameLists.push(departmentName);
			departmentPolarityLists.push(polarityCounts);
			//departmentDiv
			var departmentFactor = Math.round((departmentResponse[i].departmentFactor) * 100) / 100;
			departmentFactorLists.push(departmentFactor);
		var totalCount=polarityCounts.positive+polarityCounts.negative+polarityCounts.neutral;
		var xvalue=departmentFactor/totalCount;
		var positiveValue=Math.round(polarityCounts.positive*xvalue);
		var negativeValue=Math.round(polarityCounts.negative*xvalue);
		var neutralValue=Math.round(polarityCounts.neutral*xvalue);
		positiveArray.push(positiveValue);
		negativeArray.push(negativeValue);
		neutralArray.push(neutralValue);
		positiveReferencesArray.push(polarityCounts.positive);
		negativeReferencesArray.push(polarityCounts.negative);
		neautralReferencesArray.push(polarityCounts.neutral);
		}
		departmentFactorChartGraphs(departmentNameLists,departmentPolarityLists,departmentFactorLists,positiveArray,negativeArray,neutralArray,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
	}
	
	
	//department factor chart
	function departmentFactorChartGraphs(departmentNameLists,departmentPolarityLists,departmentFactorLists,positiveArrays,negativeArrays,neutralArrays,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray){
		//loadingForDashBoard();
		(function(H) {
			var each = H.each;
			H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function(proceed) {
			var series = this;
			if(series.data.length > 0 ){
			var width = series.barW > 40 ? 40 : series.barW;
			each(this.data, function(point) {
			point.shapeArgs.x += (point.shapeArgs.width - width) / 2;
			point.shapeArgs.width = width;
			});
			}
			proceed.call(this);
			})
			})(Highcharts);
		
		if(departmentNameLists.length<=10)
		{
		$('#nextChartDiv').prop('disabled',true);
		//$('#nextChartDiv').css('background-color','red');
		}
		if(end>=departmentNameLists.length){
			$('#nextChartDiv').prop('disabled',true);
		}else{
			$('#nextChartDiv').prop('disabled',false);
		}
		if(start<=0){
			$('#previousChartDiv').prop('disabled',true);
		}else{
			$('#previousChartDiv').prop('disabled',false);
		}
	var departmentOuterPageBarChartId="departmentFactorChart";
	var datesArray = new Array();
	var positiveArray=new Array();
	var negativeArray=new Array();	
	var neutralArray=new Array();
	
	var chartDatas=new Array();
	
	chartDatas.push(departmentNameLists,departmentPolarityLists);
	
	for(var j=0;j<departmentPolarityLists.length;j++)
		    	{
		    	var positive=departmentPolarityLists[j].positive;
		    	positiveArray.push(positive);
		    	var negative=departmentPolarityLists[j].negative;
		    	negativeArray.push(negative);
		    	var neutral=departmentPolarityLists[j].neutral;
		    	neutralArray.push(neutral);
		    	}
	
	datesArray = departmentNameLists.slice(start,end);
	positiveArray = positiveArrays.slice(start,end);
	negativeArray = negativeArrays.slice(start,end);
	neutralArray = neutralArrays.slice(start,end);
	positiveReferencesArray  = positiveReferencesArray.slice(start,end);
	negativeReferencesArray = negativeReferencesArray.slice(start,end);
	neautralReferencesArray = neautralReferencesArray.slice(start,end);
	populateBarChartForDepartments(departmentOuterPageBarChartId,datesArray,positiveArray,negativeArray,neutralArray,"Department Score",positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
	}
	
	/*--------------------------------------------
	------- END Department Chart Script --------
	--------------------------------------------*/
										
	function showDepartmentFactorPopUp(organizationId,depId,departmentName){
		//loadingForDashBoard();
		var orgId = organizationId.toString();
		var departmentId = depId.toString();

		//graph header
		$("#myModalLabel").html('');
		$("#myModalLabel").text("Department Score-"+departmentName+"");
		
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/showDepartmentFactorValues.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:orgId,departmentId:departmentId }),
			success:function(response){
				//unloadingForDashBoard();
				if(response.length>0){
				var chartData = new Array();
				for(var i=0;i<response.length;i++){
					
					$.each(response[i], function( date, departmentFactor){
				        chartData.push([moment(date).format("DD MMM YYYY"), departmentFactor]);                            
					});
				}
				populateChart(chartData, 'Department Score Vs Time', 'Department Score in %', 'Department Score');
				$('#myPopUp').modal('show');
			}
			
			},
			error: function(jqXHR, exception) {
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
	        }
		});
		
	}
	
	
	function populateChart(chartData, title, yAxisTitle, seriesName){
		console.log(chartData);
		//loadingForDashBoard();
		$('#repufactorVStime').html('');
		$('#repufactorVStime').highcharts({
			credits : {
				enabled : false
			},
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: title
	        },
	        xAxis: {
	            type: 'category',
	            labels: {
	                rotation: -45,
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, sans-serif'
	                }
	            }
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: yAxisTitle
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        tooltip: {
	            pointFormat: null
	        },
	        series: [{
	            name: seriesName,
	            data: chartData,
	            dataLabels: {
	                enabled: true,
	                rotation: -90,
	                color: '#FFFFFF',
	                align: 'right',
	                x: 4,
	                y: 10,
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, sans-serif',
	                    textShadow: '0 0 3px black'
	                }
	            }
	        }]
	    });
		//unloadingForDashBoard();
	}

	
	//kpi Factor whole div
	function kpiPolaritycount(organizationId){
		loadingForDashBoard();
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		var count=0;
		count=count+1;
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/getKpiPolarities.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
				//unloadingForDashBoard();
				var data=response.successObject.organizationKpiPolarities;
				if(data.length>0){
				var kpiNameList=[];
				var positivePolarity=[];
				var neutralPolarity=[];
				var negativePolarity=[];
				for(var i=0; i<data.length; i++){
					var kpi=data[i].kpiName;	
					kpiNameList.push(kpi);
					var positiveSentimentValue=data[i].positivePolarity;
					 positivePolarity.push(positiveSentimentValue);
					var neutralSentimentValue=data[i].neutralPolarity;
					neutralPolarity.push(neutralSentimentValue);
					var negativeSentimentValue=data[i].negativePolarity;
					negativePolarity.push(negativeSentimentValue);
					
					var html = "";
					$('#kpiPopup').html('');
					html += '<div id="kpiPopup">';
					html += '<div class="col-lg-4 col-md-12">';
					html += '<div class="panel panel-default">';
					html += '<div class="panel-heading"> KPI';
	                html += '</div>';
	                html += '<div class="panel-body">';                             
	                html += '<div class="col-xs-12 DashboardKPIReport" onclick=showKpiPolarityPopup('+data[i].kpiId+') id="KPITEST" style="min-width: 310px; max-width: 800px; height: 260px; margin: 0 auto"></div>';
	                html += '</div>';
	                html += '<div class="panel-footer"><a>view all</a></div>';
	                html += '</div>';
	                html += '</div>'; 
	                html += '</div>';
	            	$("#kpiPopup").append(html).show();
				}
				}}
			});
		}

	//kpi factor polarity count
	function showKpiPolaritycount(organizationId){
		loadingForDashBoard();
		var kpiMilestonePercentages=0;
		var kpiMilestonePercentagesChange=0;
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		var count=0;
		count=count+1;
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/getKpiPolarities.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){	
			var data=response.successObject.organizationKpiPolarities;
				if(data.length>0){
				var kpiNameList=[];
				var positivePolarity=[];
				var neutralPolarity=[];
				var negativePolarity=[];
				for(var i=0; i<data.length; i++){
					var kpi=data[i].kpiName;	
					kpiNameList.push(kpi);
					var positiveSentimentValue=data[i].positivePolarity;
					 positivePolarity.push(positiveSentimentValue);
					var neutralSentimentValue=data[i].neutralPolarity;
					neutralPolarity.push(neutralSentimentValue);
					var negativeSentimentValue=data[i].negativePolarity;
					negativePolarity.push(negativeSentimentValue);
					
					var html = "";
					$('#kpiPopup').html('');
					html += '<div id="kpiPopup">';
					html += '<div class="col-lg-4 col-md-12">';
					html += '<div class="panel panel-default">';
					html += '<div class="panel-heading"> KPI';
	                html += '</div>';
	                html += '<div class="panel-body">';                             
	                html += '<div class="col-xs-12 DashboardKPIReport" onclick=showKpiPolarityPopup('+data[i].kpiId+') id="KPITEST" style="min-width: 310px; max-width: 800px; height: 260px; margin: 0 auto"></div>';
	                html += '</div>';
	                html += '<div class="panel-footer"><a>view all</a></div>';
	                html += '</div>';
	                html += '</div>'; 
	                html += '</div>';
	            	$("#kpiPopup").append(html).show();
				}
				}
			var data=response.successObject.organizationKpiPolarities;
			  kpiFactorResponse=data;
				if(data.length>0){
				var kpiNameList=[];
				var positivePolarity=[];
				var neutralPolarity=[];
				var negativePolarity=[];
				var positiveReferencesArray = new Array();
				var negativeReferencesArray = new Array();
				var neautralReferencesArray = new Array();
				
				$("#reviewSummaryKpiFactorDiv").html('');
				for(var i=0; i<data.length; i++){
					var kpi=data[i].kpiName; 	
					var kpiNames = kpi.replace(/ +/g, "");	
					var kpiRepufactValue=data[i].kpiFactor;
					kpiNameList.push(kpi);
					
					var totalCount=data[i].positivePolarity+data[i].neutralPolarity+data[i].negativePolarity;
					var xvalue=kpiRepufactValue/totalCount;
					var positiveSentimentValue=(data[i].positivePolarity*xvalue).toFixed(2);
					 positivePolarity.push(parseFloat(positiveSentimentValue));
					var neutralSentimentValue=(data[i].neutralPolarity*xvalue).toFixed(2);
					neutralPolarity.push(parseFloat(neutralSentimentValue));
					var negativeSentimentValue=(data[i].negativePolarity*xvalue).toFixed(2);
					negativePolarity.push(parseFloat(negativeSentimentValue));
					positiveReferencesArray.push(data[i].positivePolarity);
					negativeReferencesArray.push(data[i].negativePolarity);
					neautralReferencesArray.push(data[i].neutralPolarity);
					
					var kpiId=data[i].kpiId;
					var kpiChange=data[i].kpiFactorChange;
					var totalReferences=data[i].neutralPolarity+data[i].positivePolarity+data[i].negativePolarity;
					var positiveCounts=((data[i].positivePolarity/totalReferences)*100).toFixed(2);
					var negativeCounts=((data[i].negativePolarity/totalReferences)*100).toFixed(2);
					var neutralCounts=((data[i].neutralPolarity/totalReferences)*100).toFixed(2);
				    var kpiMilestoneGoal=data[i].milestoneSetPercentage;
				    if(kpiMilestoneGoal.length>0){
				    for(var k=0;k<kpiMilestoneGoal.length;k++){
				    	kpiMilestonePercentages=kpiMilestoneGoal[k].setPercentage;
				    	kpiMilestonePercentagesChange=kpiMilestoneGoal[k].trajectoryChange;
				    }}else{
				    	kpiMilestonePercentages=0;
				    	kpiMilestonePercentagesChange=0;
				    }
					var html='';
					html+='<div class="panel-body KPIDepartmentFactorTableBody" onClick=showKpiFactorPolarityPopup('+organizationId+','+kpiId+',\'' + kpiNames + '\') id="reviewSummaryKpiFactorDiv" data-toggle="modal" data-target=".KPILightBox">'
					+'<div class="row">'
						+'<div class="col-xs-12 col-md-2">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">KPI </div>'
							+'<div class="MediumBoldGreyContent">'+kpi+'</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-1">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">References </div>'
							+'<div class="SmallBoldGreyContent">'+totalCount+'</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-4">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Sentiments </div>'
							+'<div class="HappyCountIcon col-xs-4">'
								+'<div class="VerySmallGreyContent">'+data[i].positivePolarity+'</div>';
								
								if(positiveCounts=="NaN" || positiveCounts=="undefined"){
									html += '<div class="VerySmallBoldGreyContent">0.0%';
								}else{
									html += '<div class="VerySmallBoldGreyContent">'+positiveCounts+'%';
								}
								html += '</div>'
							+'</div>'
							+'<div class="NormalCountIcon col-xs-4">'
								+'<div class="VerySmallGreyContent">'+data[i].neutralPolarity+'</div>';
								if(neutralCounts=="NaN" || neutralCounts=="undefined"){
									html += '<div class="VerySmallBoldGreyContent">0.0%';
								}else{
									html += '<div class="VerySmallBoldGreyContent">'+neutralCounts+'%';
								}
								html += '</div>'
							+'</div>'
							+'<div class="SadCountIcon col-xs-4">'
								+'<div class="VerySmallGreyContent">'+data[i].negativePolarity+'</div>';
								if(negativeCounts=="NaN" || negativeCounts=="undefined"){
									html += '<div class="VerySmallBoldGreyContent">0.0%';
								}else{
									html += '<div class="VerySmallBoldGreyContent">'+negativeCounts+'%';
								}
								html += '</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-1">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Trend Change </div>'
							+'<div>';
							if(kpiChange>0){
							html+='<span class="PositiveChangeLeftAlign">'+kpiChange.toFixed(2)+'</span>';
							}else if(kpiChange<0){
							html+='<span class="NegativeChangeLeftAlign">'+kpiChange.toFixed(2)+'</span>';	
							}else{
							html+='<span class="NoChangeLeftAlign">'+kpiChange.toFixed(2)+'</span>';	
							}
						html+='</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-2">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">KPI Score  </div>'
							+'<div class="MediumBoldDarkBlueContent">'+kpiRepufactValue.toFixed(2)+'%</div>'
						+'</div>'
						+'<div class="col-xs-12 col-md-2">'
							+'<div class="hidden-md hidden-lg VerySmallGreyContent">Milestone</div>'
							+'<div>';
							  if(kpiMilestonePercentages==null || kpiMilestonePercentages=="undefined" || kpiMilestonePercentages==0){
								  html+='<span id="kpiMilestoneSetPercentage" class="MilestoneBlue">NA</span>';
							  }else{
								html+='<span id="kpiMilestoneSetPercentage" class="MilestoneBlue">'+kpiMilestonePercentages+'%</span>';
									}
							  if(kpiMilestonePercentages==null ||kpiMilestonePercentages==" " || kpiMilestonePercentagesChange==null){
								  html+='<span id="kpiMilestoneTrajectoryChange" class="NoChange">NA</span>';
							      }else if(kpiMilestonePercentagesChange>0){
								    html+='<span id="kpiMilestoneTrajectoryChange" class="PositiveChange">'+kpiMilestonePercentagesChange.toFixed(2)+'</span>';
								    }else if(kpiMilestonePercentagesChange<0){
								    html+='<span id="kpiMilestoneTrajectoryChange" class="NegativeChange">'+kpiMilestonePercentagesChange.toFixed(2)+'</span>';
									}else{
									html+='<span id="kpiMilestoneTrajectoryChange" class="NoChange">NA</span>';
								}
							+'</div>'
							+'</div>'
							+'</div>'
							+'</div>'
				    +'</div>';
			$("#reviewSummaryKpiFactorDiv").append(html).show();	
				}
				kpiFactorChartGraphs(positivePolarity,neutralPolarity,negativePolarity,kpiNameList,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
				}else{
					$('#reviewSummaryKpiFactorDiv').html('');
				 	$('#reviewSummaryKpiFactorDiv').append('<h5><font color="red">No Data Found</font></h5>');
				}}
				});
		}
	
	
	function nextKpiFactor()
	{
		startkpi=startkpi+10;
		endkpi=endkpi+10;	
		var kpiNameList=[];
		var positivePolarity=[];
		var neutralPolarity=[];
		var negativePolarity=[]
		var positiveReferencesArray = [];
		var negativeReferencesArray = [];
		var neautralReferencesArray = [];
		if(kpiFactorResponse.length>0){
		for(var i=0;i<kpiFactorResponse.length;i++){
		var kpi=kpiFactorResponse[i].kpiName; 
		var kpiRepufactValue=kpiFactorResponse[i].kpiFactor;
		kpiNameList.push(kpi);
		
		var totalCount=kpiFactorResponse[i].positivePolarity+kpiFactorResponse[i].neutralPolarity+kpiFactorResponse[i].negativePolarity;
		var xvalue=kpiRepufactValue/totalCount;
		var positiveSentimentValue=(kpiFactorResponse[i].positivePolarity*xvalue).toFixed(2);
		 positivePolarity.push(parseFloat(positiveSentimentValue));
		var neutralSentimentValue=(kpiFactorResponse[i].neutralPolarity*xvalue).toFixed(2);
		neutralPolarity.push(parseFloat(neutralSentimentValue));
		var negativeSentimentValue=(kpiFactorResponse[i].negativePolarity*xvalue).toFixed(2);
		negativePolarity.push(parseFloat(negativeSentimentValue));
		positiveReferencesArray.push(kpiFactorResponse[i].positivePolarity);
		negativeReferencesArray.push(kpiFactorResponse[i].negativePolarity);
		neautralReferencesArray.push(kpiFactorResponse[i].neutralPolarity);
		}}	
	kpiFactorChartGraphs(positivePolarity,neutralPolarity,negativePolarity,kpiNameList,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
	}
	
	
	function previousKpiFactor()
	{
		startkpi=startkpi-10;
		endkpi=endkpi-10;
		var kpiNameList=new Array();
		var positivePolarity=new Array();
		var neutralPolarity=new Array();
		var negativePolarity=new Array();
		var positiveReferencesArray = [];
		var negativeReferencesArray = [];
		var neautralReferencesArray = [];
		for(var i=0;i<kpiFactorResponse.length;i++){
		var kpi=kpiFactorResponse[i].kpiName; 
		var kpiRepufactValue=kpiFactorResponse[i].kpiFactor;
		kpiNameList.push(kpi);
		
		var totalCount=kpiFactorResponse[i].positivePolarity+kpiFactorResponse[i].neutralPolarity+kpiFactorResponse[i].negativePolarity;
		var xvalue=kpiRepufactValue/totalCount;
		var positiveSentimentValue=(kpiFactorResponse[i].positivePolarity*xvalue).toFixed(2);
		 positivePolarity.push(parseFloat(positiveSentimentValue));
		var neutralSentimentValue=(kpiFactorResponse[i].neutralPolarity*xvalue).toFixed(2);
		neutralPolarity.push(parseFloat(neutralSentimentValue));
		var negativeSentimentValue=(kpiFactorResponse[i].negativePolarity*xvalue).toFixed(2);
		negativePolarity.push(parseFloat(negativeSentimentValue));
		positiveReferencesArray.push(kpiFactorResponse[i].positivePolarity);
		negativeReferencesArray.push(kpiFactorResponse[i].negativePolarity);
		neautralReferencesArray.push(kpiFactorResponse[i].neutralPolarity);
		}	
		kpiFactorChartGraphs(positivePolarity,neutralPolarity,negativePolarity,kpiNameList,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
	}
	
	/*<!-------------------------------------------->
	<!------------ KPI Chart Script -------------->
	<!-------------------------------------------->*/
	function kpiFactorChartGraphs(positivePolarity,neutralPolarity,negativePolarity,kpiNameList,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray){
		$('#kpiOuterPageBarChartIdkpiFactorChart').html('');
		loadingForDashBoard();
		(function(H) {
			var each = H.each;
			H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function(proceed) {
			var series = this;
			if(series.data.length > 0 ){
			var width = series.barW > 40 ? 40 : series.barW;
			each(this.data, function(point) {
			point.shapeArgs.x += (point.shapeArgs.width - width) / 2;
			point.shapeArgs.width = width;
			});
			}
			proceed.call(this);
			})
			})(Highcharts);
		if(kpiNameList.length<=10);
		{
		$('#nextKpiFactorDiv').prop('disabled',true);
		//$('#nextChartDiv').css('background-color','red');
		}
		if(endkpi>=kpiNameList.length){
			$('#nextKpiFactorDiv').prop('disabled',true);
			//$('#innerPageKpiSummaryNextButton').css('background-color','red');
		}else{
			$('#nextKpiFactorDiv').prop('disabled',false);
			//$('#innerPageKpiSummaryNextButton').css('background-color','white');
		}
		if(startkpi<=0){
			$('#previousKpiFactorDiv').prop('disabled',true);
		//	$('#innerPageKpiSummaryPreviousButton').css('background-color','red');
		}else{
			$('#previousKpiFactorDiv').prop('disabled',false);
		//	$('#innerPageKpiSummaryPreviousButton').css('background-color','white');
		}
	var kpiOuterPageBarChartId="kpiFactorChart";
	var datesArray = new Array();
	var positiveArray=new Array();
	var negativeArray=new Array();	
	var neutralArray=new Array();
	
	positiveArray = positivePolarity.slice(startkpi,endkpi);
	negativeArray = negativePolarity.slice(startkpi,endkpi);
	neutralArray = neutralPolarity.slice(startkpi,endkpi);
	kpiNameList = kpiNameList.slice(startkpi,endkpi);
	positiveReferencesArray = positiveReferencesArray.slice(startkpi,endkpi);
	negativeReferencesArray = negativeReferencesArray.slice(startkpi,endkpi);
	neautralReferencesArray = neautralReferencesArray.slice(startkpi,endkpi);
	populateBarChartForDepartment(kpiOuterPageBarChartId,kpiNameList,positiveArray,negativeArray,neutralArray,"KPI Score",positiveReferencesArray,negativeReferencesArray,neautralReferencesArray);
	}
		
		
	/*<!-------------------------------------------->
	<!--------- END KPI Chart Script ------------->
	<!-------------------------------------------->	*/
	
	
	function showKpiFactorPolarityPopup(organizationId,kpiId,kpiName){
		//loadingForDashBoard();
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		var orgId=organizationId.toString();
		var kpiIds=kpiId.toString();
		$("#myModalLabel").html('');
		$("#myModalLabel").text("KPI Score-"+kpiName+"");
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/kpiFactorPolarityPopup.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:orgId,kpiId:kpiIds}),
			success:function(response){
				//unloadingForDashBoard();
				console.log(response);
				if(response.length>0){
					console.log(response);
				var chartData = new Array();
				for(var i=0;i<response.length;i++){
					$.each(response[i], function( date, sentiment){
				        chartData.push([moment(date).format("DD MMM YYYY"), sentiment]);                            
					});
				}
				populateChart(chartData, 'KPI Polarity Count Vs Time', 'Polarity Count', 'Polarity Count');
				$('#myPopUp').modal('show');
			}},
			error: function(jqXHR, exception) {
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
	        }
		});
	}
	
	
	
	/*function showKpiFactorPolarityPopup(organizationId,kpiId,kpiName){
		//loadingForDashBoard();
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		var orgId=organizationId.toString();
		var kpiIds=kpiId.toString();
		$("#myModalLabel").html('');
		$("#myModalLabel").text("KPI Factor-"+kpiName+"");
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/showKpiFactorPolarityPopup.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:orgId,kpiId:kpiIds}),
			success:function(response){
				//unloadingForDashBoard();
				console.log(response);
				if(response.length>0){
					console.log(response);
				var chartData = new Array();
				for(var i=0;i<response.length;i++){
					$.each(response[i], function( date, sentiment){
						console.log(date);
						console.log(sentiment);
				        chartData.push([moment(date).format("DD MMM YYYY"), sentiment]);                            
					});
				}
				populateChart(chartData, 'Kpi Polarity Count Vs Time', 'Polarity Count', 'Polarity Count');
				$('#myPopUp').modal('show');
			}},
			error: function(jqXHR, exception) {
	            if (jqXHR.status === 0) {
	               // alert('Not connect.\n Verify Network.');
	            } else if (jqXHR.status == 404) {
	               // alert('Requested page not found. [404]');
	            } else if (jqXHR.status == 500) {
	               // alert('Internal Server Error [500].');
	            } else if (exception === 'parsererror') {
	                //alert('Requested JSON parse failed.');
	            } else if (exception === 'timeout') {
	               // alert('Time out error.');
	            } else if (exception === 'abort') {
	                //alert('Ajax request aborted.');
	            } else {
	                //alert('Uncaught Error.\n' + jqXHR.responseText);
	            }
	        }
		});
	}
	*/
	
	/*<!-------------------------------------------------------->
	<!--------- Department > KPI > Keyword Analysis ------------->
	<!------------------------------------------------------->	*/

	departmentListGlobal=[];
	function departmentKeywordAnalysis(orgId){
		loadingForDashBoard();		
		var organizationId=orgId.toString();
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewKpiAndDepartment/getDepartmentKeywordAnalysis.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
			departmentListGlobal=response;
			unloadingForDashBoard();
			$('#accordion').html('');
			var html = '';
			var isBreadCrumb = "YES";
			isBreadCrumb = "'"+isBreadCrumb+"'";
			var isDashBoard = "NO";
			isDashBoard = "'"+isDashBoard+"'";
			//rajesh
			var positive = 0;
			var negative = -1;
			var neutral = 1;
			for(var i=0;i<response.length;i++){
				var department = response[i];
				var departmentName = department.departmentName;
				departmentName = "'"+departmentName+"'";
				var departmentId = department.id;
				var organizationId = department.organizationId;
				var departmentFactor = response[i].departmentFactor;
				var positiveDepartment = response[i].polarityCount.positive;
				var negativeDepartment = response[i].polarityCount.negative;
				var neutralDepartment = response[i].polarityCount.neutral;
				
				var positiveValue=0.00;
				var neutralValue=0.00;
				var negativeValue=0.00;
				//calculating sentiments
				var totalCount=negativeDepartment+positiveDepartment+neutralDepartment;
				if(totalCount!=0){
				if(totalCount==0){
					 positiveValue=0.00;
					 negativeValue=0.00;
					 neutralValue=0.00;	
				}else{
					 positiveValue=((positiveDepartment/totalCount)*100).toFixed(2);
					 negativeValue=((negativeDepartment/totalCount)*100).toFixed(2);
					 neutralValue=((neutralDepartment/totalCount)*100).toFixed(2);
				}
				count=count+1;
				html += '<div class="panel panel-default">';
				html += 	'<div class="panel-heading row">';
				html +=			'<div class="col-xs-12 col-md-4">';
				html +=				'<a data-toggle="collapse" data-parent="#accordion" id='+departmentId+' href="#collapseOne_'+departmentId+'">'+department.departmentName+'</a>';
				html += 			'<span class="VerySmallGreyContent">('+totalCount+' References)</span>';
				html += 		'</div>';
				html += 		'<div class="col-xs-12 col-md-6">';
				html +=				'<div class="HappyCountIcon col-xs-4" id="positiveID" onclick="departmentPolarityInnerPage('+departmentId+','+positive+','+isBreadCrumb+','+isDashBoard+','+positiveDepartment+')">';
				html += 				'<div class="VerySmallGreyContent">'+positiveDepartment+'</div><div class="VerySmallBoldGreyContent">'+positiveValue+'%</div>';
				html +=				'</div>';
				html +=				'<div class="NormalCountIcon col-xs-4" onclick="departmentPolarityInnerPage('+departmentId+','+neutral+','+isBreadCrumb+','+isDashBoard+','+neutralDepartment+')">';
				html += 				'<div class="VerySmallGreyContent">'+neutralDepartment+'</div>';
				html +=					'<div class="VerySmallBoldGreyContent">'+neutralValue+'%</div>';		
				html +=				'</div>';
				html +=				'<div class="SadCountIcon col-xs-4" onclick="departmentPolarityInnerPage('+departmentId+','+negative+','+isBreadCrumb+','+isDashBoard+','+negativeDepartment+')"><div class="VerySmallGreyContent">'+negativeDepartment+'</div>';
				html += 				'<div class="VerySmallBoldGreyContent">'+negativeValue+'%</div>';
				html +=				'</div>';
				html += 		'</div>';	
				html += 		'<div class="col-xs-12 col-md-2">';
				if(totalCount==0)
				{
				html +=				'<a class="SmallLightDarkBlueContentLink"></a>';
					}else{
				html +=				'<a class="SmallLightDarkBlueContentLink" onclick="departmentInnerPage('+departmentId+','+isBreadCrumb+','+isDashBoard+')">View More</a>';	
					}
				html += 		'</div>';
				html += 	'</div>';
				var kpiList = department.kpiList;
				
				html += '<div id="collapseOne_'+departmentId+'" class="row panel-collapse collapse">';
				for(var j=0;j<kpiList.length;j++){
					var kpi = kpiList[j];
					var kpiPositive=kpi.kpiPolarityCount.positive;
					var kpiNegative=kpi.kpiPolarityCount.negative;
					var kpiNeutral=kpi.kpiPolarityCount.neutral;
					var kpiId = kpi.id;
					var kpiFactor=kpi.kpiFactor;
					
					var positiveValues=0;
					var negativeValues=0;
					var neutralValues=0;
					//calculating sentiments
					var totalCounts=kpiPositive+kpiNegative+kpiNeutral;
					if(totalCounts!=0){
					if(totalCounts==0){
						positiveValues=0;
						negativeValues=0;
						neutralValues=0;
					}else{
						positiveValues=((kpiPositive/totalCounts)*100).toFixed(2);
						negativeValues=((kpiNegative/totalCounts)*100).toFixed(2);
					    neutralValues=((kpiNeutral/totalCounts)*100).toFixed(2);
					}
					html +=	'<div class="panel-body kpiHeading">';
					html +=		'<div class="col-xs-12 col-md-4"><a id="kpi_'+kpiId+'_'+departmentId+'" class="SelectKPI" >'+kpi.kpiName+'</a>';
					html +=			'<span class="VerySmallGreyContent">('+totalCounts+' References)</span>';
					html += 	'</div>';
					html += 	'<div class="col-xs-12 col-md-6">';
					html +=			'<div class="HappyCountIcon col-xs-4" onclick="kpiPolarityInnerPage('+kpiId+','+departmentId+','+isBreadCrumb+','+organizationId+','+positive+')">';
					html += 			'<div class="VerySmallGreyContent">'+kpiPositive+'</div>';
					html += 			'<div class="VerySmallBoldGreyContent">'+positiveValues+'%</div>';
					html +=			'</div>';
					html +=			'<div class="NormalCountIcon col-xs-4" onclick="kpiPolarityInnerPage('+kpiId+','+departmentId+','+isBreadCrumb+','+organizationId+','+neutral+')">';
					html +=				'<div class="VerySmallGreyContent">'+kpiNeutral+'</div>';
					html +=				'<div class="VerySmallBoldGreyContent">'+neutralValues+'%</div>';
					html += 		'</div>';
					html +=			'<div class="SadCountIcon col-xs-4" onclick="kpiPolarityInnerPage('+kpiId+','+departmentId+','+isBreadCrumb+','+organizationId+','+negative+')">';
					html += 			'<div class="VerySmallGreyContent">'+kpiNegative+'</div>';
					html += 			'<div class="VerySmallBoldGreyContent">'+negativeValues+'%</div>';
					html +=			'</div>';
					html += 	'</div>';
					html += 	'<div class="col-xs-12 col-md-2">';
					html +=	 		'<a class="SmallLightDarkBlueContentLink" onclick="kpiInnerPage('+kpiId+','+departmentId+','+isBreadCrumb+','+organizationId+')">View More</a>';		
					html += 	'</div>';
					}else{
						html +=	'<div>';
						html +=		'<div><a id="kpi_'+kpiId+'_'+departmentId+'" class="SelectKPI" ></a>';
						html += 	'</div>';
					}
					var keywords = kpi.keywords;
					var positiveValueCountPercentage=0;
					var negativeValueCountPercentage=0;
					var neutralValueCountPercentage=0;
					html += '<div class="col-xs-12">';
					for(var k=0;k<keywords.length;k++){
						var keyword = keywords[k];
						var keywordId = keywords[k].id;
						var positiveKeyword=keyword.keywordPolarityCount.positive;
						var negativeKeyword=keyword.keywordPolarityCount.negative;
						var neutralKeyword=keyword.keywordPolarityCount.neutral;
						var totalCountKeyword=positiveKeyword+neutralKeyword+negativeKeyword;
						//var totalCountPolarityCount=positiveKeyword+negativeKeyword+neutralKeyword;
						if(totalCountKeyword==0){
							positiveValueCountPercentage=0;
							negativeValueCountPercentage=0;
							neutralValueCountPercentage=0;
						}else{
							positiveValueCountPercentage=((positiveKeyword/totalCountKeyword)*100).toFixed(2);
						    negativeValueCountPercentage=((negativeKeyword/totalCountKeyword)*100).toFixed(2);
							neutralValueCountPercentage=((neutralKeyword/totalCountKeyword)*100).toFixed(2);
						}
						if(totalCountKeyword!=0){
						html += '<div class="keywordClass col-xs-4">';
						html += 	'<div  class="keywordbox kpi_'+kpiId+'_'+departmentId+'">';
						html +=			'<div class="col-xs-6 SmallBoldGreyContent">'+keyword.nlpQueryName+'</div>';	
						html +=			'<a class="col-xs-6 text-right SmallLightDarkBlueContentLink" onclick="keywordInnerPage('+kpiId+','+departmentId+','+keywordId+','+isBreadCrumb+')">View More</a>';	
						html +=			'<div class="col-xs-12">';
						html +=				'<div class="SmallHappyCountIcon col-sm-4" onclick="keywordPolarityInnerPage('+kpiId+','+departmentId+','+keywordId+','+isBreadCrumb+','+positive+')">';
						html += 				'<div class="TineyGreyContent">'+positiveKeyword+'</div>';
						html += 				'<div class="VerySmallBoldGreyContent">'+positiveValueCountPercentage+'%</div>';
						html +=				'</div>';
						html += 			'<div class="SmallNormalCountIcon col-sm-4" onclick="keywordPolarityInnerPage('+kpiId+','+departmentId+','+keywordId+','+isBreadCrumb+','+neutral+')">';
						html += 				'<div class="TineyGreyContent">'+neutralKeyword+'</div>';
						html += 				'<div class="VerySmallBoldGreyContent">'+neutralValueCountPercentage+'%</div>';
						html +=				'</div>';
						html +=				'<div class="SmallSadCountIcon col-sm-4" onclick="keywordPolarityInnerPage('+kpiId+','+departmentId+','+keywordId+','+isBreadCrumb+','+negative+')">';
						html +=					'<div class="TineyGreyContent">'+negativeKeyword+'</div>';
						html += 				'<div class="VerySmallBoldGreyContent">'+negativeValueCountPercentage+'%</div>';
						html += 			'</div>';
						html += 		'</div>';
						html += 	'</div>';
						html += '</div>';
					}	}		
					html +=	'</div>';//End of row panel-collapse collapse
					html +=	'</div>';
				}
				html +=	'</div>';
				html +=	'</div>';
			}}
			
			//html +=	'</div>';
			$('#accordion').append(html);
			
			$('.SelectKPI').click(function(){
				var keywordBoxClass=$(this).attr('id');
				if ($("." + keywordBoxClass).hasClass("OnSeleceActive")) {
					$("." + keywordBoxClass).removeClass("OnSeleceActive");
				} else {
					$("." + keywordBoxClass).addClass("OnSeleceActive");
				}
			});
			
	}
		});
	}
		

		

function kpiDepartmentKeywordAnalysis(orgId){
	loadingForDashBoard();
var organizationId=orgId.toString();
var fromDate = $("#altFromDate").datepicker().val();
var toDate = $("#altToDate").datepicker().val();
$.ajax({
	type:"POST",
	url:"../reviewKpiAndDepartment/getKeywordAnalysis.htm",
	contentType:"application/json",
	data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
	success:function(response){
	//unloadingForDashBoard();
	keywordResponse=response;
	departmentKeywordAnalysis(orgId,keywordResponse);
	}
	});
}

	//openAll
	//toggle button for view
function openAll(){
		$( ".panel-collapse" ).addClass("in");	
		for(var i=0;i<departmentListGlobal.length;i++){
			var departmentId=departmentListGlobal[i].id;
			var kpiList=departmentListGlobal[i].kpiList;
			for(var j=0;j<kpiList.length;j++){
				var keywordBoxClass="kpi_"+kpiList[j].id+"_"+departmentId;
				$("." + keywordBoxClass).addClass("OnSeleceActive");
			}
		}
		
}
	//closeAll

	//toggle button for view
function closeAll(){
	
	$( ".panel-collapse" ).removeClass("in");
	for(var i=0;i<departmentListGlobal.length;i++){
		var departmentId=departmentListGlobal[i].id;
		var kpiList=departmentListGlobal[i].kpiList;
		for(var j=0;j<kpiList.length;j++){
			var keywordBoxClass="kpi_"+kpiList[j].id+"_"+departmentId;
			$("." + keywordBoxClass).removeClass("OnSeleceActive");
		}
	}
}


function populateBarChartForDepartments(barChartDivId,datesArray,positiveArray,negativeArray,neutralArray,xAxisText,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray){
	loadingForDashBoard();
	setChartWidth();
	$('#'+barChartDivId)
			.highcharts(
					{
						credits : {
							enabled : false
						},
						chart : {
							type : 'column',
							width:960
								
						},
						title : {
							text : null
						},
						xAxis : {
							categories : datesArray,
						},
						yAxis : {
							min : 0,
							title : {
								text : xAxisText,
								fontWeight : 'bold'
							},
							stackLabels : {
								enabled : true,
								style : {
									fontWeight : 'bold',
									color : (Highcharts.theme && Highcharts.theme.textColor)
											|| 'gray'
								},formatter:function(){
									var index = this.x;
									var positiveReferenceAvg = positiveArray[index];
									var negativeReferenceAvg = negativeArray[index];
									var neautralReferenceAvg = neutralArray[index];
									var total = parseFloat(positiveReferenceAvg+negativeReferenceAvg+neautralReferenceAvg);
									total = total.toFixed(2);
									return total+"%";
								},
							}
						},
						legend : {
							enabled: false
						},
						tooltip : {
							formatter : function() {
								var index  = this.point.index;
								var name = this.series.name;
								if(name=="Neutral"){
									return '<b>'+name+ 'Reference(s): '+neautralReferencesArray[index];
								}else if(name=="Positive"){
									return '<b>'+name+ 'Reference(s): '+positiveReferencesArray[index];
								}else if(name=="Negative"){
									return '<b>'+name+ 'Reference(s): '+negativeReferencesArray[index];
								}
										
							}
						},
						plotOptions : {
							column : {
								stacking : 'normal',
								dataLabels : {
									enabled : false,
									color : (Highcharts.theme && Highcharts.theme.dataLabelsColor)
											|| 'white',
									style : {
										textShadow : '0 0 3px black'
									}
								}
							}
						},
						series : [ {
							name : 'Neutral',
							color : '#ffc85a',
							data : neutralArray,
						}, {
							name : 'Positive',
							color : '#007d32',
							data : positiveArray
						}, {
							name : 'Negative',
							color : '#db0703',
							data : negativeArray
						} ]
					});
	unloadingForDashBoard();
}

function showOriginalReview(reviewId){
	$('#originalReview_'+reviewId).toggle(200);
}
//***********************Rajesh*******************//
/*function departmentPolarityInnerPage(departmentId,polarity,isBreadCrumb,isDashBoard,value){
	console.log("calling....");
	console.log("value :"+value);
	alert("value is :"+value)
	loadingForDashBoard();
	window.location.href = "../PolarityInnerPage/page.htm?departmentId="+departmentId+"&polarity="+polarity+"&isBreadCrumb="+isBreadCrumb+"&isDashBoard="+isDashBoard;
}*/
//**********************End*************************//
					
