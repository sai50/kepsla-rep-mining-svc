var sessionSelectedOrganizationId=0;

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
	//setDefaults();
	 poplateOrganizations(function(selectedOrgId) {
	 showRepufactScoreAndChange(selectedOrgId);
	 getReviewCount(selectedOrgId);
	 populateReviewCountValues(selectedOrgId);
	 getReviewCountReferences(selectedOrgId);
	 populateSentimentCountValues(selectedOrgId);
	 getOrganizationKpis(selectedOrgId);
	 tradeSorceData(selectedOrgId);
	 getSocialMentions(selectedOrgId);
	 shwoRepufactorTargetPercentage(selectedOrgId);
	 getDepartmentPerformanceIndicators(selectedOrgId);
	 });
	});
});

$("#applyFilterBtn").click(function(e){
	saveSessionDatas();
	var organizationId = $('#organizationName option:selected').val();
	showRepufactScoreAndChange(organizationId);
	getReviewCount(organizationId);
	populateReviewCountValues(organizationId);
	getReviewCountReferences(organizationId);
	populateSentimentCountValues(organizationId);
	getOrganizationKpis(organizationId);
	tradeSorceData(organizationId);
	getSocialMentions(organizationId);
	shwoRepufactorTargetPercentage(organizationId);
	getDepartmentPerformanceIndicators(organizationId);
});
function setDefaults(){
				$("#from").datepicker("setDate","-1y");
				$("#to").datepicker("setDate",new Date());
}

function showRepufactScoreAndChange(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getCompetitorsWithRanking.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
		/*if(response.change>0){
				$("#targetChange").html('<span class="PositiveChangeLeftAlign">'+response.change+'</span>');
			}
		else if(response.change<0){
				$("#targetChange").html('<span class="NegativeChangeLeftAlign">'+response.change+'</span>');
			}
		else{
				$("#targetChange").html('<span class="NoChangeLeftAlign">'+response.change+'</span>');
			}*/
		
		//$("#targetChange").text(response.change);
		if(response.length>0){
		for(var i=0; i<response.length; i++){
			if(response[i].competitor==organizationId){
				var competitionRank = i+1;
				$(".SummaryRepufactorPercentage").text(response[i].totalRepufactScore);
				$("#competitionRanking").text(ordinal_suffix_of(competitionRank));
			}
		}
		}
	}
	});
	
}
function poplateOrganizations(callback){
	commonOrgPopulation(callback,'organizationName');
};
	
	function getReviewCount(organizationId){
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewSummary/getAllReviews.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
			$("#reviewTotalCount").text(response);
			}
		});
	}
	//rajesh
	function populateReviewCountValues(organizationId){
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewSummary/getReviewTotalCounts.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
				console.log("response :"+response.totalReferences);
				setChartWidth();
				$('#ReviewCount').highcharts({
					credits: {
						enabled: false
					},
					chart: {
						backgroundColor: 'transparent',
			            type: 'column',
						showPrintMenuItem:'0',
						style: {
			                    overflow: 'visible'
			                },
			                skipClone: true
			        },
					 plotOptions: {
			                column: {
			                    colorByPoint: true
			                }
			        },
					colors: ['#72d9be', '#f4c947', '#ef3f3f'],
					title : {
						text : null
					},
			        subtitle: {
			            text: null
			        },
			        xAxis: {
						lineWidth: 0, // Hide gridline
						minorGridLineWidth: 0,
						lineColor: 'transparent',
						minorTickLength: 0,
						tickLength: 0,
			            type: null,
			            labels: {
							enabled: false,
			            }
			        },
			        yAxis: {
			            lineWidth: 0,
						minorGridLineWidth: 0,
						lineColor: 'transparent',
						minorTickLength: 0,
						tickLength: 0,
			            title: {
			                text: null
			            },
			            labels: {
							enabled: false,
			            }
			        },
			        legend: {
			            enabled: false
			        },
			        tooltip: {
			            pointFormat: '<b>{point.y:.0f}%</b>'
			        },
					
					series : [{
						name : 'Polarity',
						data : 
					 	[['positiveReview', response.positive],
			                ['neutralReview', response.neutral],
			                ['negativeReview', response.negative],],
					}]
				});
				$("#positiveReview").text(response.positive);
				$("#negativeReview").text(response.negative);
				$("#neutralReview").text(response.neutral);
			}
		});
	}
	
	function getReviewCountReferences(organizationId){
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewSummary/getSentimentTotalCounts.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
			var positive=	response.positive;
			var negative=	response.negative;
			var neutral=	response.neutral;
			var totalReferences=positive+negative+neutral;
			$("#totalReferences").text(totalReferences);
			}
		});
	}
	
	
	function populateSentimentCountValues(organizationId){
		var fromDate = $("#altFromDate").datepicker().val();
		var toDate = $("#altToDate").datepicker().val();
		$.ajax({
			type:"POST",
			url:"../reviewSummary/getSentimentTotalCounts.htm",
			contentType:"application/json",
			data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
			success:function(response){
				$('#SentimentCount').highcharts({
					credits: {
						enabled: false
					},
					chart: {
						backgroundColor: 'transparent',
			            type: 'column',
						showPrintMenuItem:'0',
						style: {
			                    overflow: 'visible'
			                },
			                skipClone: true
			        },
					 plotOptions: {
			                column: {
			                    colorByPoint: true
			                }
			        },
					colors: ['#72d9be', '#f4c947', '#ef3f3f'],
					title : {
						text : null
					},
			        subtitle: {
			            text: null
			        },
			        xAxis: {
						lineWidth: 0, // Hide gridline
						minorGridLineWidth: 0,
						lineColor: 'transparent',
						minorTickLength: 0,
						tickLength: 0,
			            type: null,
			            labels: {
							enabled: false,
			            }
			        },
			        yAxis: {
			            lineWidth: 0,
						minorGridLineWidth: 0,
						lineColor: 'transparent',
						minorTickLength: 0,
						tickLength: 0,
			            title: {
			                text: null
			            },
			            labels: {
							enabled: false,
			            }
			        },
			        legend: {
			            enabled: false
			        },
			        tooltip: {
			            pointFormat: '<b>{point.y:.0f}%</b>'
			        },
					
					series : [{
						name : 'Polarity',
						data : 
					 	[['Positive', response.positive],
			                ['Neutral', response.neutral],
			                ['Negative', response.negative],],
					}]
				});
				
				$("#positive").text(response.positive);
				$("#negative").text(response.negative);
				$("#neutral").text(response.neutral);
			}
		});
	}
	

function tradeSorceData(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getTradeSources.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			$('#tradeSourceData').html('');
			for(var i=0; i<response.length; i++){
				var html = "";
			    html += '<div class="SmallDarkGreyHeader">'+response[i].sourceName+" "+ '('+response[i].sourceCount+')</div>';
			    $("#tradeSourceData").append(html).show();
			}
		},
		/*error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
                //alert("here");
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
            	alert("error");
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }*/
	});
}
function getSocialMentions(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getSocialMentions.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			$('#socialMentionsData').html('');
			for(var i=0; i<response.length; i++){
				var html = "";
			    html += '<div class="SmallDarkGreyHeader">'+response[i].sourceName+" "+ '('+response[i].mentionsCount+')</div>';
			    $("#socialMentionsData").append(html).show();
			}
		},
		/*error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
                //alert("here");
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
            	//alert("error");
                //alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }*/
	});
}
function shwoRepufactorTargetPercentage(organizationId){
	$.ajax({
		type:"GET",
		url:"../reviewSummary/getRepufactorTargetPercentage.htm?organizationId="+organizationId,
		contentType:"application/json",
		success:function(response){console.log(response);
			$('#targetFromDate,#targetToDate').html('');
			$('#targetFromDate').append('From ');
			$('#targetToDate').append('To ');
			if(response.status=="SUCCESS"){
				console.log(response);
				var milestonePercentage = parseFloat(response.successObject.mileStoneData.setPercentage);
				var targetChange = parseFloat(response.successObject.mileStoneData.trajectoryChange);
				var fromDate  = response.successObject.mileStoneData.setFromDate;
				var toDate = response.successObject.mileStoneData.setToDate;
				targetChange = targetChange.toFixed(2);
				milestonePercentage = milestonePercentage.toFixed("2");
				milestonePercentage = convertFloat(milestonePercentage);
				$("#targetPercentage").text(milestonePercentage);
				if(targetChange>0){
					$("#targetChange").html('<span class="PositiveChangeLeftAlign">'+targetChange+'</span>');
				}
				else if(targetChange<0){
					$("#targetChange").html('<span class="NegativeChangeLeftAlign">'+targetChange+'</span>');
				}
				else{
					$("#targetChange").html('<span class="NoChangeLeftAlign">'+targetChange+'</span>');
				}
			}else{
				$('#targetPercentage,#targetChange').text("NA");
			}
			if(fromDate==null ||toDate==null ){
				/*$('#targetFromDate').append('-');
				$('#targetToDate').append('-');*/
				$('#targetFromDate,#targetToDate').html('');
			}else{
				
				fromDate = convertedDate(fromDate);
				toDate = convertedDate(toDate);
				$('#targetFromDate').append(fromDate);
				$('#targetToDate').append(toDate);
			}
			
		}
	});
}

function getDepartmentPerformanceIndicators(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var count=0;
	$.ajax({
		type:"POST",
		url:"../reviewSummary/getDepartmentPerformanceIndicators.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			console.log(response);
			var departmentFactors = response.successObject.departmentFactors;
			if(departmentFactors.length>0){
			$("#departmentKPIFactor").html(' ');
			for(var i=0; i<departmentFactors.length; i++){
				console.log(departmentFactors);
				count=count+1;
				var html = "";
				var departmentName= departmentFactors[i].departmentName;
				var departmentId = departmentFactors[i].id;
				var departmentFactor = Math.round((departmentFactors[i].departmentFactor) * 100) / 100;
				var departmentFactorChange = Math.round((departmentFactors[i].departmentFactorChange) * 100) / 100;
				var milestonTarget = departmentFactors[i].milestone.setPercentage;
				if(milestonTarget==0.0){
					milestonTarget = "NA";
				}
				var mileStoneToDate = departmentFactors[i].milestone.setToDate;
				var mileStoneFromDate = departmentFactors[i].milestone.setFromDate;
				//var totalReviewCountReference = response[i].totalReviewCountReference;
				var polarityCounts = departmentFactors[i].polarityCounts;
				var kpiPolarities =  departmentFactors[i].kpiPolarities;
				var totalReferences=polarityCounts.positive+polarityCounts.neutral+polarityCounts.negative;
				var departmentParam = "'"+departmentName+"'";
				departmentParam = departmentParam.replace(/ /g, "_");
				var isBreadCrumb = "NO";
				var isDashboard = "NO";
				isDashboard = "'"+isDashboard+"'";
				isBreadCrumb = "'"+isBreadCrumb+"'";
				html += '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 SummaryDepartmentFactor">';
					html += '<div class="panel">';
						html += '<div class="panel-body">';
							html += '<div class="row">';
								html +=	'<div class="LargeMediumBoldGreyContent center_align">'+departmentName+'</div>';
								html+=	'<input type="hidden" value='+departmentId+' id="reviewSummaryDepartmentId">';
							html += '</div>';
							html += '<div class="row">';
								html += '<div class="LightGreyColor SummaryDepartmentrepufact center_align">';
									html += '<div class="row Repufactlogo">';
										html += '<div class="Departmentfactorpercentage"><div style="font-size: 14px;">Department Score</div>'+departmentFactor+'%</div>';
									html += '</div>';
								html += '</div>';
							html += '</div>';
							html += '<div class="row">';
								html += '<div class="SmallBoldGreyContent col-xs-8">Trend Change</div>';
								html += '<div class="col-xs-4">';
								if(departmentFactorChange>0){
									html +='<span class="DepartmentfactorChangeLeft PositiveChange">'+departmentFactorChange+'%</span>';
									}else if(departmentFactorChange<0){
									html +='<span class="DepartmentfactorChangeLeft NegativeChange">'+departmentFactorChange+'%</span>';
									}else{
									html +='<span class="DepartmentfactorChangeLeft NoChange">'+departmentFactorChange+'%</span>';
									}
								
								//html += '<div class="col-xs-4"><span class="DepartmentfactorChangeLeft PositiveChange">'+departmentFactorChange+'%</span></div>';
								html += '</div>';
								html += '</div>';
							
							html  += '<div class="row">';
								html += '<div class="SmallBoldGreyContent col-xs-8">Target</div>';
								if(milestonTarget=="NA"){
									html += '<div class="col-xs-4 text-right"><span class="MediumBoldDarkBlueContent" style="margin-right:0px">'+milestonTarget+'</span></div>';
								}else{
									html += '<div class="col-xs-4 text-right"><span class="MediumBoldDarkBlueContent" style="margin-right:0px">'+milestonTarget+'%</span></div>';
								}
								if(mileStoneFromDate==null || mileStoneToDate==null){
									mileStoneFromDate = "-";
									mileStoneToDate = "-";
									html += '<div class="SmallDarkGreyHeader col-xs-12">from '+mileStoneFromDate+'</div>';
									html += '<div class="SmallDarkGreyHeader col-xs-12">To '+mileStoneToDate+'</div>';
								}else{
									mileStoneFromDate = convertedDate(mileStoneFromDate);
									mileStoneToDate = convertedDate(mileStoneToDate);
									html += '<div class="SmallDarkGreyHeader col-xs-12">from '+mileStoneFromDate+'</div>';
									html += '<div class="SmallDarkGreyHeader col-xs-12">To '+mileStoneToDate+'</div>';
								}
							html += '</div>';
							/**************************Competition Ranking***********************************************************/
							html += '<div class="row">';
							html += '<div class="SmallBoldGreyContent col-xs-8">Competition Ranking</div>';
							html += '<div class="col-xs-4 text-right"><span class="MediumLightDarkBlueContent" id="competitionRanking">'+departmentFactors[i].competitorRanking+'</span></div>';
							html += '</div>';
							/**************************************************************************************************************/
							
							html += '<div class="row">';
								html += '<div class="SmallBoldGreyContent col-xs-8">Total Reference(s)</div>';
								html += '<div class="col-xs-4 text-right"><span class="MediumLightDarkBlueContent" id="totalReferences">'+totalReferences+'</span></div>';
							html += '</div>';
							
							html += '<div class="row">';
								html += '<div class="col-xs-5">';
								html += '<div id="SentimentCountDep'+count+'" style="margin: -10px 0px 0px -4px; height: 80px; padding-bottom:-30px; width: 100px;"></div>';
								html += '</div>';
								html += '<div class="col-xs-7 text-right">';
									html += '<div class="SmallDarkGreyHeader"><span class="PositiveSentimentCount">'+polarityCounts.positive+' </span> Positive</div>';
									html += '<div class="SmallDarkGreyHeader"><span class="NeutralSentimentCount">'+polarityCounts.neutral+' </span> Neutral</div>';
									html += '<div class="SmallDarkGreyHeader"><span class="NegativeSentimentCount">'+polarityCounts.negative+' </span> Negative</div>';
								html+= '</div>';
							html += '</div>';
							
							html += '<div class="col-xs-12">';
							html += '<div class="SmallBoldGreyContent">KPI(s)</div>';
				for(var j=0; j<kpiPolarities.length; j++){
					var kpiId = kpiPolarities[j].kpiId;
					//var totalKpiPolarityCount = kpiPolarities[j].positivePolarity+kpiPolarities[j].neutralPolarity+kpiPolarities[j].negativePolarity;
					
					if(kpiPolarities[j].totalCount>0){
						html += '<div ><div class="SmallDarkGreyHeader"><a onclick="kpiInnerPage('+kpiId+','+departmentId+','+isBreadCrumb+')">'+kpiPolarities[j].kpiName+'</a>'+" "+ '('+kpiPolarities[j].totalCount+')</div></div>';
					}
				}
				html += '</div>';//End of Department KPI list
				html += '</div>';//End of panel body
				html+=	'<div class="col-xs-12">'+
				'<a class="SmallLightDarkBlueContentLink" onclick="departmentInnerPage('+departmentId+','+isBreadCrumb+','+isDashboard+')">View Details</a>'+
				'</div>';
				html+=	'</div>';
				html+=	'</div>';
				$("#departmentKPIFactor").append(html).show();
				sentimentChart(polarityCounts,count);
				
			}
			}else{
				//alert("No Departments Found");
				//$("#departmentKPIFactor").append('<h4>No Departments Found</h4>');
			}
			unloadingForDashBoard();
		
		},	
	});
}

function sentimentChart(polarityCounts,count){
	count = parseInt(count);
	$("#SentimentCountDep"+count).highcharts({
        credits: {
			enabled: false
		},
		chart: {
			backgroundColor: 'transparent',
            type: 'column',
			showPrintMenuItem:'0',
			style: {
                    overflow: 'visible'
                },
                skipClone: true
        },
		 plotOptions: {
                column: {
                    colorByPoint: true
                }
        },
		colors: ['#72d9be', '#f4c947', '#ef3f3f'],
       	title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
			lineWidth: 0, // Hide gridline
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			minorTickLength: 0,
			tickLength: 0,
            type: null,
            labels: {
				enabled: false,
            }
        },
        yAxis: {
            lineWidth: 0,
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			minorTickLength: 0,
			tickLength: 0,
            title: {
                text: null
            },
            labels: {
				enabled: false,
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<b>{point.y} Mentions</b>'
        },
		
        series: [{
            name: 'Polarity',
            data: [
                ['Positive', polarityCounts.positive],
                ['Neutral', polarityCounts.neutral],
                ['Negative', polarityCounts.negative],
            ],
        }],
		navigation: {			
				buttonOptions: {
					enabled: false
				}	
        } 
    });

}
function getOrganizationKpis(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSummary/getOrganizationKpis.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			$('#kpiPolarities').html('');
			if(response.length>0){
				for(var i=0; i<response.length; i++){
					var html = "";
					var kpiName = response[i].kpiName;
					var totalCount = response[i].totalCount;
					html += '<div class="SmallDarkGreyHeader col-xs-12">'+kpiName+" "+ '('+totalCount+')</div>';
					$("#kpiPolarities").append(html).show();
				}
			}
		}
	});
}
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function departmentInnerPage(departmentId){
	loadingForDashBoard();
	window.location.href = "../departmentInnerPage/page.htm?departmentId="+departmentId;
	
}
function kpiInnerPage(kpiId,departmentId){
	loadingForDashBoard();
	window.location.href = "../kpiInnerPage/page.htm?kpiId="+kpiId+"&departmentId="+departmentId;
}