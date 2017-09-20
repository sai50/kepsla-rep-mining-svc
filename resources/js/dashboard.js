var sessionSelectedOrganizationId=0;
var start=0;
var end=12;
var nextChartData=[];
var nextReviewCountChartData=[];
var nextPositiveSentimentChartData=[];
var nextNegativeSentimentChartData=[];
var nextNeutralSentimentChartData=[];
var tradeSourceChartData=[];
var socialMentionChartData=[];
var failedRepliesResponse = {};

$(document).ready(function() {
	//loadingForDashBoard();
	 $.ajaxSetup({ cache: false }); 
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDate",
		altFormat: "mm/dd/yy",
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
		altFormat: "mm/dd/yy",
		maxDate: new Date,
		onClose : function(selectedDate) {
		$("#from").datepicker("option", "maxDate", selectedDate);
		 dateValidationForm(); 
		}
	
	});
	  getSessionData().then(function(){
		  
		  //	  if ($("#altFromDate").datepicker().val() != undefined || $("#altFromDate").datepicker().val() != ''){
	   poplateOrganizations(function(selectedOrgId) {
		applyFilter(selectedOrgId);
		reviewCountPerDayList(selectedOrgId);
		populateSentimentValues(selectedOrgId);
		getDepartmentFactors(selectedOrgId);
		showKpiPolaritycount(selectedOrgId);
		tradeSorceData(selectedOrgId);
		clientCompetitorList(selectedOrgId);
		socialMentionData(selectedOrgId);
		reviewAlertsData(selectedOrgId);
	   		});
	  })
});
$('#repufactorDiv').click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showRepufactorPopup(organizationId);
});

$("#possitiveSentimentDiv").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showPositiveSentimentPopup(organizationId);
});

$("#negativeSentimentDiv").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	
	showNegativeSentimentPopup(organizationId);
});
	
$("#neutralSentimentDiv").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showNeutralSentimentPopup(organizationId);
});

$("#reviewCountPopupDiv").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showReviewCountPopup(organizationId);
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	applyFilter(organizationId);
	populateSentimentValues(organizationId);
	getDepartmentFactors(organizationId);
	tradeSorceData(organizationId);
	reviewCountPerDayList(organizationId);
	socialMentionData(organizationId);
	clientCompetitorList(organizationId);
	showKpiPolaritycount(organizationId);
	reviewAlertsData(organizationId);
});
function setDefaults(){
		$("#from").datepicker("setDate","-1y");
		$("#to").datepicker("setDate",new Date());
		
		
}

/**************************************************************************************************************************
 *                     Show Rating Score Index and Change                                                          				*
 *************************************************************************************************************************/
function applyFilter(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	
	$.ajax({
		type:"POST",
		url:"../dashboard/getRepufactorScore.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			if(response.status=="REPUFACT_SUCCESS"){
				var currentRepufactor = response.successObject.repufactorMap.currentRepufactor;
				var sentimentCounts= response.successObject.sentiments;
				var organizationName=response.successObject.repufactorMap.organizationFullName;
				
				for (var p = 0; p < sentimentCounts.length; p++) {
					if (parseInt(currentRepufactor) >= sentimentCounts[p].minPercentage
							&& parseInt(currentRepufactor) <= sentimentCounts[p].maxPercentage
							&& sentimentCounts[p].sentimentName == "positive") {
						 $("#dashboardSentimentFinder").html('<div class="col-xs-12 dashboardPositive"><div id="ratinScoreIndex" class="rsiHeading">Rating Score Index</div></div>');
						break;
					}
					if (parseInt(currentRepufactor) >= sentimentCounts[p].minPercentage
							&& parseInt(currentRepufactor) <= sentimentCounts[p].maxPercentage
							&& sentimentCounts[p].sentimentName == "neutral") {
						$("#dashboardSentimentFinder").html( '<div class="col-xs-12 dashboardNeutral"><div id="ratinScoreIndex" class="rsiHeading">Rating Score Index</div></div>');
						break;
					}
					if (parseInt(currentRepufactor) >= sentimentCounts[p].minPercentage
							&& parseInt(currentRepufactor) <= sentimentCounts[p].maxPercentage
							&& sentimentCounts[p].sentimentName == "negative") {
						$("#dashboardSentimentFinder").html('<div class="col-xs-12 dashboardNegative"><div id="ratinScoreIndex" class="rsiHeading">Rating Score Index</div></div>');
						break;
					}
				}
						
				var scoreHelpIndicator = '<span id="randomid" class="fa-stack" style="font-size: 9px;margin: 0 0 11px 5px;">' + 
				  '<i class="fa fa-circle-o fa-stack-2x"></i>' +
				  '<i class="fa fa-question fa-stack-1x"></i></span>' +
				
					'<div class="tooltiptext"><ul class="leftPad">' + 
				  '<li>Hotel&#39;s overall score based on a 7 step scoring methodology</li>' +
				  '<li>Smiley & colour highlight health of hotel&#39;s guest sentiments</li>' +
				  '<li>Change percentage between current selected period & previous same period</li>' +
				 '</ul></div>';
				$("#ratinScoreIndex").append(scoreHelpIndicator);
				
				  $('#randomid').each(function() {
				         $(this).qtip({
				             content: {
				                 text: $(this).next('.tooltiptext')
				             },
				          position: {
				        	  my: 'bottom center',  
					          at: 'top center', 
				             target: $('#randomid') 
				         },
				         style: {
				             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
				         }
				         });
				     });
				var change = response.successObject.repufactorMap.change;
				$(".DashboardRepufactorPercentage").text(currentRepufactor);	
				if(change>0){
					$('#repufactChange').html('<span class="PositiveChange">'+change+'%</span>');
				}else if(change<0){
						$('#repufactChange').html('<span class="NegativeChange">'+change+'%</span>');
				}else if(change==0){
						$('#repufactChange').html('<span class="NoChange">'+change+'%</span>');
				}
			}else{
				$(".DashboardRepufactorPercentage").append('<h4 style="color:red">'+response.errorMessage+'</h4>');
			}
			
		}
	});
}

/**************************************************************************************************************************
 *                     Show Department Factors                                                             *
 **************************************************************************************************************************/
function getDepartmentFactors(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	console.log("toDate:::",toDate);
	var repufactValues=[];
	$.ajax({
		type:"POST",
		url:"../dashboard/getDepartmentFactors.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			unloadingForDashBoard();
		if(response.length>0){
			$('#socialMentionSparklineChartDataDiv').html('');
			$("#departmentFactors").html('');
			for(var i=0; i<response.length; i++){
				var repufactValues=[];
				var departmentFactorChange = parseFloat(response[i].departmentFactorChange);
				departmentFactorChange = departmentFactorChange.toFixed(2);
				var departmentFactor = parseFloat(response[i].departmentFactor);
				var repufactorValues=response[i].repufactorValue;
				
				for(var j=0; j<repufactorValues.length; j++){
				repufactValues.push(" "+repufactorValues[j].toFixed(2));
				}
				
				//repufactValues.push(repufactorValues+" ");
				departmentFactor = departmentFactor.toFixed(2);
				var departmentImage=response[i].image;
				var html = "";
				var isBreadCrumb = "NO";
				var isDashboard = "YES";
				isBreadCrumb = "'"+isBreadCrumb+"'";
				isDashboard = "'"+isDashboard+"'";
				html += '<div class="col-xs-12 DashboardDepartmentRow" onclick=departmentInnerPage('+response[i].id+','+isBreadCrumb+','+isDashboard+')>';
				html += 	'<div class="col-lg-5 col-xs-12">';
				html +=         '<img src="../resources/images/'+response[i].departmentName+'.jpg" alt="" height="25" width="25" style="margin-right: 6px; margin-top: -4px; margin-bottom:4px;">';
				html += 		'<span class="DashboardDepartmentFactorName">'+response[i].departmentName+'</span>';
				if(departmentFactorChange>0){
					html +=          '<span class="PositiveChange">'+departmentFactorChange+'%</span>';
			    }else if(departmentFactorChange<0){
			    	html +=          '<span class="NegativeChange">'+departmentFactorChange+'%</span>';
			    }else{
			    	html +=          '<span class="NoChange">'+departmentFactorChange+'%</span>';
			    }
				html +=		'</div>';
				html += 	'<div class="col-lg-7 col-xs-12">';	
				html += 		'<div class="DepartmentCalcualtionChart col-xs-8 row" data-sparkline="'+repufactValues+'" style="height:30px; margin-left: 0; margin-right: 0; padding: 0; margin-bottom: -10px;"></div>';
				html += 		'<div class="DashboardDepartmentFactor col-xs-4 row text-right">'+departmentFactor+'%</div>';
				html += 	'</div>';
				html += '</div>';
				$("#departmentFactors").append(html).show();
			}
			//CHART FOR DEPARTMENT FACTOR
			$(function () {
			    /**
			     * Create a constructor for sparklines that takes some sensible defaults and merges in the individual
			     * chart options. This function is also available from the jQuery plugin as $(element).highcharts('SparkLine').
			     */
			    Highcharts.SparkLine = function (options, callback) {
			        var defaultOptions = {
			            chart: {
			                renderTo: (options.chart && options.chart.renderTo) || this,
			                backgroundColor: null,
			                borderWidth: 0,
			                type: 'area',
			                margin: [0, 0, 0, 0],
			                //width: 200,
			                //height: 20,
			                style: {
			                    overflow: 'visible'
			                },
			                skipClone: true
			            },
			            title: {
			                text: ''
			            },
			            credits: {
			                enabled: false
			            },
			            xAxis: {
			                labels: {
			                    enabled: false
			                },
			                title: {
			                    text: null
			                },
			                startOnTick: false,
			                endOnTick: false,
			                tickPositions: []
			            },
			            yAxis: {
			                endOnTick: false,
			                startOnTick: false,
			                labels: {
			                    enabled: false
			                },
			                title: {
			                    text: null
			                },
			                tickPositions: [0]
			            },
			            legend: {
			                enabled: false
			            },
			            tooltip: {
			                backgroundColor: null,
			                borderWidth: 0,
			                shadow: false,
			                useHTML: true,
			                hideDelay: 0,
			                shared: true,
			                padding: 0,
			                positioner: function (w, h, point) {
			                    return { x: point.plotX - w / 2, y: point.plotY - h};
			                }
			            },
			            plotOptions: {
			                series: {
			                    animation: false,
			                    lineWidth: 1,
			                    shadow: false,
			                    states: {
			                        hover: {
			                            lineWidth: 1
			                        }
			                    },
			                    marker: {
			                        radius: 1,
			                        states: {
			                            hover: {
			                                radius: 2
			                            }
			                        }
			                    },
			                    fillOpacity: 0.25
			                },
			                column: {
			                    negativeColor: '#910000',
			                    borderColor: 'silver'
			                }
			            }
			        };
			        options = Highcharts.merge(defaultOptions, options);

			        return new Highcharts.Chart(options, callback);
			    };

			    var start = +new Date(),
			        $tds = $("div[data-sparkline]"),
			        fullLen = $tds.length,
			        n = 0;

			    // Creating 153 sparkline charts is quite fast in modern browsers, but IE8 and mobile
			    // can take some seconds, so we split the input into chunks and apply them in timeouts
			    // in order avoid locking up the browser process and allow interaction.
			    function doChunk() {
			        var time = +new Date(),
			            i,
			            len = $tds.length,
			            $td,
			            stringdata,
			            arr,
			            data,
			            chart;

			        for (i = 0; i < len; i += 1) {
			            $td = $($tds[i]);
			            stringdata = $td.data('sparkline');
			            arr = stringdata.split('; ');
			            data = $.map(arr[0].split(', '), parseFloat);
			            chart = {};

			            if (arr[1]) {
			                chart.type = arr[1];
			            }
			            $td.highcharts('SparkLine', {
			                series: [{
			                    data: data,
			                    pointStart: 1
			                }],
			                tooltip: {
			                    headerFormat: '<span style="font-size: 10px">Value</span><br/>',
			                    pointFormat: '<b>{point.y}</b>%'
			                },
			                chart: chart
			            });

			            n += 1;

			            // If the process takes too much time, run a timeout to allow interaction with the browser
			            if (new Date() - time > 500) {
			                $tds.splice(0, i + 1);
			                setTimeout(doChunk, 0);
			                break;
			            }

			            // Print a feedback on the performance
			            if (n === fullLen) {
			                $('#result').html('Generated ' + fullLen + ' sparklines in ' + (new Date() - start) + ' ms');
			            }
			        }
			    }
			    doChunk();
				navigation: {			
			            buttonOptions: {
			                enabled: false;
			            }
			        }
				//unloadingForDashBoard();
			});
			
	//END OF DEPARTMENT FACTOR CHART		
			
	}else{
			$('#departmentFactors').html('');
		 	$('#departmentFactors').append('<h5><font color="red">No Data Found</font></h5>');
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
    
	}});

}



/**************************************************************************************************************************
 *                     List  Review Count Per Day                                                                  			*
 **************************************************************************************************************************/
var reviewCountPerDayListUrl = "../dashboard/";
var reviewCountChangeArray = [];
function reviewCountPerDayList(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	console.log(fromDate);
	console.log(toDate);
$.ajax({
	type:"POST",
	url:"../dashboard/getAllReviewsPerDay.htm",
	contentType:"application/json",
	data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
	success:function(response){
		//unloadingForDashBoard();
		if(response.length>0){
			var reviewCountChange=response[0].reviewCountChange;
			$("#totalReviewCount").text(response[0].totalReviewCount);
			var reviewCountTotalReferences = response[0].reviewCountPerDay[0].totalReferences.totalReferences;
			$("#totalReferenceValue").html('<span id="totalReferenceValue" class="NoChange">'+reviewCountTotalReferences+'</span>');
			
			if(reviewCountChange>0){
				$('#changeReviewCount').html('<span class="PositiveChange">'+reviewCountChange+'%</span>');
				}else if(reviewCountChange<0){
					$('#changeReviewCount').html('<span class="NegativeChange">'+reviewCountChange+'%</span>');
				}else{
					$('#changeReviewCount').html('<span class="NoChange">0%</span>');
				}
			
			var reviewCountList = response[0].reviewCountPerDay;
			for(var i=0;i<reviewCountList.length;i++){
				 var chartData=$.map( reviewCountList, function( obj,i){
					 
				        return [[obj.reviewDate,obj.count]];                            
				});
				reveiwCountChart(chartData);
			}
			
		}/*else{
			$('#reviewCount').html("");
			$('#changeReviewCount').html('<span class="NoChange">'+0+'%</span>');
			$(".ReiviewCountResult").text(0);
			$(".NoChange").text(0);
		}*/
	}
});

}
/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	commonOrgPopulation(callback,'organizationName');
}



/************************************************************************************
 *							Show TradeSource Data										* 
 ************************************************************************************/
function tradeSorceData(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getTradeSources.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			//unloadingForDashBoard();
			if(response.length>0){
			//alert("response: "+"length:+"+response.length+"sourceCount:"+response[0].sourceCount);
			$('#tradeSourceData').html('');
			for(var i=0; i<response.length; i++){
				var html = "";
			    html += '<div class="col-xs-6"><div class="DashboardTrageSorceCount">'+response[i].sourceName+'<div class="">'+response[i].sourceCount+'</div></div></div>';
			    $("#tradeSourceData").append(html).show();
			}
		    var chartData = new Array();
			for(var i=0;i<response.length;i++){
				var sourcePercentageValue = convertToPercentage(response[i].sourceCount,response);
				//alert("actual Count: "+response[i].sourceCount +" sourcePercentageValue: "+sourcePercentageValue+" sourceName: "+response[i].sourceName);
		        chartData.push([response[i].sourceName, sourcePercentageValue]);     
			}
		    drawTradeSourceChart(chartData);
		}else{
			$('#sourceData').html('');
			//$('#tradeSourceData').html('');
			//$('#TradeSource').html('');
		 	//$('#tradeSourceData').append('<h4><font color="red">Trade Source are not mapped for this Organization</font></h4>');
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

/**************************************************************************************************************************
 *                     List  Social Mentions                                                                  *
 **************************************************************************************************************************/

function socialMentionData(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getSocialMentions.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			//unloadingForDashBoard();
			$('#socialMentionData').html('');
			$('#SocialMentions').html('');
			if(response.length > 0){
				for(var i=0; i<response.length; i++){
					var html = "";
				    html += '<div class="col-xs-6"><div class="DashboardSocialMentionCount">';
				    	html += '<img src="../resources/images/'+response[i].sourceName+'.png" alt='+response[i].sourceName+' height="55" width="55"/>';
				    	html += '<div>'+response[i].sourceName;
				    		html += '<div class="CountNumber">'+response[i].mentionsCount+'</div>';
				    	html += '</div>';
				    html +='</div></div>';
				    $("#socialMentionData").append(html).show();
				}
				//preparing data for chart
				var chartData = new Array();
				var sumMentionsCount = 0;
				for(var i=0; i<response.length; i++){
					sumMentionsCount += response[i].mentionsCount;
				}
				for(var i=0;i<response.length;i++){
					var mentionCount = response[i].mentionsCount;
					var sourceCountPercent = 0;
					sourceCountPercent = (mentionCount/sumMentionsCount)*100;
					
			        chartData.push([response[i].sourceName, sourceCountPercent]);
			   }
			   drawSocialMentionChart(chartData);
			}else{
				$('#socialData').html('');
				$('#socialMentionData').html('');
			 	//$('#socialMentionData').append('<h4><font color="red">Social Mentions are Not Mapped for this organization</font></h4>');
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
            }}
	});
	
}

/**************************************************************************************************************************
 *                     Show kpi polarity Count                                                          				*
 **************************************************************************************************************************/
function showKpiPolaritycount(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var count=0;
	count=count+1;
	$.ajax({
		type:"POST",
		url:"../dashboard/getKpiPolarities.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){ 
		//unloadingForDashBoard();
			var list = response.successObject.organizationKpiPolarities;
			if(list.length>0){
			var kpiNameList=[];
			var positivePolarity=[];
			var neutralPolarity=[];
			var negativePolarity=[];
			for(var i=0; i<list.length; i++){
				var kpi=list[i].kpiName; 	
				kpiNameList.push(kpi);
				var positiveSentimentValue=list[i].positivePolarity;
				positivePolarity.push(positiveSentimentValue);
				
				var neutralSentimentValue=list[i].neutralPolarity;
				neutralPolarity.push(neutralSentimentValue);
				
				var negativeSentimentValue=list[i].negativePolarity;
				negativePolarity.push(negativeSentimentValue);
				var html = "";
				$('#kpiPopup').html('');
				html += '<div id="kpiPopup">';
				html += '<div class="col-lg-4 col-md-12">';
				html += '<div class="panel panel-default">';
				html += '<div class="panel-heading"> KPI <span id="kpiId" class="fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 5px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span><div class="tooltiptext">Top 5 KPI scores & References as segregated by sentiment polarity for the selected date range</div>	';
                html += '</div>';
                html += '<div class="panel-body">';                             
                html += '<div class="col-xs-12 DashboardKPIReport" onclick=showKpiPolarityPopup('+list[i].kpiId+')  id="KPITEST" style="min-width: 310px; max-width: 800px; height: 260px; margin: 0 auto"></div>';
                html += '</div>';
                html += '<div class="panel-footer"><a href="../reviewKpiAndDepartment/showReviewKpiAndDepartment.htm">view all</a></div>';
                html += '</div>';
                html += '</div>'; 
                html += '</div>';
            	$("#kpiPopup").append(html).show();
            	
            	$('#kpiId').each(function() {
   		         $(this).qtip({
   		             content: {
   		                 text: $(this).next('.tooltiptext')
   		             },
   		          position: {
   		        	  my: 'bottom center',  
   			          at: 'top center', 
   		             target: $('#kpiId') // my target
   		         },
   		         style: {
   		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
   		         }
   		         });
   		     });
            	
				//Test FOR KPI
				$(function () {
					$("#KPITEST").html('');
					$('#KPITEST').highcharts({
				        chart: {
				            type: 'bar'
				        },
				        title: {
				            text: null,
				        },
				        subtitle: {
				            text: null,
				        },
				        xAxis: {
				        	
				        	categories: kpiNameList,
				        	
				            title: {
				                text: null
				            }				
				        },
				        yAxis: {
				            min: 0,
				            title: {
				                text: null
				            },
				            labels: {
				                overflow: 'justify'
				            }
				        },
				        tooltip: {
				            valueSuffix: 'Mention(s)'
				        },
				        plotOptions: {
				            bar: {
				                dataLabels: {
				                    enabled: true
				                }
				            }
				        },
				        legend: {
							layout: 'horizontal', // default
							verticalAlign: 'top',
				            itemDistance: 5,
				            align: 'right',
				            floating: true,
				            borderWidth: 0,
				            shadow: false,
							backgroundColor: null,
				            margin: [0, 0, 0, 0],
							y:-15,
							itemStyle: {
				                color: '#999',
				                fontWeight: 'normal',
				                fontSize: '11',
				            }
				        },
				        credits: {
				            enabled: false
				        },
						colors: ['#72d9be', '#f4c947', '#ef3f3f'],
				        series: [{
				            name: 'Positive',
				            data: positivePolarity
				        }, {
							name: 'Neutral',
				            data: neutralPolarity
				        }, {
				            name: 'Negative',
				            data: negativePolarity
				        }]
				    });
				});		
			}
		}
			else{
				$('#KPITEST').html('');
			 	$('#KPITEST').append('<h5><font color="red">No Data Found</font></h5>');
			}
		}
	});
}

/**************************************************************************************************************************
 *                     						Chart for Sentiment Values                                                     *
 **************************************************************************************************************************/
function populateSentimentValues(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getSentimentCounts.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			var sentimentCount = response.successObject;
			var negative = sentimentCount.negative;
			var positive = sentimentCount.positive;
			var neutral= sentimentCount.neutral;
			var totalReferences = sentimentCount.totalReferences;
			// Create the chart
			if(response.status="SENTIMENT_COUNT_SUCCESS"){
				$('#SentimentCount').highcharts({
					credits: {
						enabled: false
					},
					chart: {
			            renderTo: 'SentimentCount',
			            type: 'column',
			            showAxes: false,
			            backgroundColor: 'transparent'
			        },
			        credits: {enabled: false},
			        title: {text: null},
			        tooltip: {enabled: false},
			        exporting:{enabled: false},
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
						gridLineColor: '#ffffff',
						maxPadding: 0.5,
			            title: {
			                text: null
			            },
			            labels: {
							enabled: false,
			            }
			        },
			        colors: ['#72d9be', '#f4c947', '#ef3f3f'],
			        legend: {enabled: false},
			        plotOptions: {
			                column: {
			                    colorByPoint: true
			                }
			        },
					tooltip: {
			            pointFormat: '<b>{point.y:.0f} sentiment(s)</b>'
			        },
			        
					series : [{
						name : 'Polarity',
						data : 
					 	[['Positive', positive],
			                ['Neutral',neutral],
			                ['Negative', negative],],
					}]
				},
				function(chart) {

			        var imgWidth = 24;
			        var imgHeight = 24;

			       
			        $.each(chart.series[0].data, function(i, point) {
			            
						
						if(i==0){
			            var img = chart.renderer.image('../resources/css/HappyIcon.png', point.plotX - (imgWidth/8), chart.options.chart.height - 24 - imgHeight, imgWidth, imgHeight).attr({zIndex: 3}).add();
						}else if(i==1){
						var img = chart.renderer.image('../resources/css/NormalIcon.png', point.plotX - (imgWidth/8), chart.options.chart.height - 24 - imgHeight, imgWidth, imgHeight).attr({zIndex: 3}).add();
						}else {
						var img = chart.renderer.image('../resources/css/SadIcon.png', point.plotX - (imgWidth/8), chart.options.chart.height - 24 - imgHeight, imgWidth, imgHeight).attr({zIndex: 3}).add();
						}
						
			            img.animate({
			                y: point.plotY - imgHeight + 8
			            },{
			                duration: 1000
			            });
			            
			            var labelColor = (i+1) % 3 == 0 ? 'black' : 'white';
			           
			            
			            setTimeout(function() {
			            	if(point.dataLabel){
				                point.dataLabel.css({color: labelColor});
				                point.dataLabel.animate({
				                    opacity: 1
				                },{
				                    duration: 1000
				                });
			            	}
			            }, 1000);
			        });      
			    }
				);
				
				$("#possitive").text(positive);
				$("#neutral").text(neutral);
				$("#negative").text(negative);
			}else{
				var errorMessage = response.errorMessage;
				$("#possitive").text(errorMessage);
				$("#neutral").text(errorMessage);
				$("#negative").text(errorMessage);
			}
		
		}
	});
}


function reveiwCountChart(reviewCountList){
	
$('#reviewCount').highcharts({
	credits: {
		enabled: false
	},
    chart: {
		backgroundColor: 'transparent',
        type: 'area',
		showPrintMenuItem:'0',
		style: {
                overflow: 'visible'
            },
            skipClone: true
    },
	colors: ['#fff', '#ff0000'],
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
		title: {
            text: "Time",
			style: {
				color: '#fff',
				fontSize: '10px'
			 }  
        },
        labels: {
			enabled: false,
            formatter: function () {
                return this.value; // clean, unformatted number for days
            }
        },
		opposite: true

    },
    yAxis: {
		lineWidth: 0,
		minorGridLineWidth: 0,
		lineColor: 'transparent',
		minorTickLength: 0,
		tickLength: 0,
        title: {
            text: "Reviews",
			style: {
				color: '#fff',
				fontSize: '10px'
			 }  
        },
        labels: {
			enabled: false,
        },
		opposite: true
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: <b>{point.y}</b>'
    },
     plotOptions: {
        area: {
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, 'rgb(152, 164, 180)'],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            marker: {
                radius: .5
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },
    series: [{
		showInLegend: false,   
        name: 'Reviews On',
        data: reviewCountList
    }],
	navigation: {			
        buttonOptions: {
            enabled: false
        }
    } 
});
}

/**************************************************************************************************************************
 *                    					 Chart for  Trade Sources                                                        *
 **************************************************************************************************************************/
function drawTradeSourceChart(series){
	setChartWidth();
/*	Highcharts.setOptions({
	     colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263',      '#6AF9C4']
	    });*/
	$("#TradeSource").highcharts({
		credits: {
			enabled: false
		},
        chart: {
			backgroundColor: 'transparent',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
		borderColor: '#ff0000',
		borderWidth: 2,
        title: {
            text: null
        },
        colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263',      '#6AF9C4'],
        tooltip: {
        	 pointFormat: '{series.name}: <b>{point.percentage:.1f}%'
        },
        plotOptions: {
            pie: {
				borderWidth: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                        	//alert('The name is ' + this.name +' and the identifier is ' + this.options.id);
                        	showTradeSourceDataPopup(this.name);
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                   // connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name:'Trade Sources',
            data:series
        }],
        navigation: {			
        buttonOptions: {
            enabled: false
        }
    } 
	});
}

/**************************************************************************************************************************
 *                    					 Chart for  Social Mentions                                                        *
 **************************************************************************************************************************/
function drawSocialMentionChart(series){
	setChartWidth();
	$("#SocialMentions").highcharts({
		credits: {
			enabled: false
		},
        chart: {
			backgroundColor: 'transparent',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
		borderColor: '#ff0000',
		borderWidth: 2,
        title: {
            text: null
        },
        colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263',      '#6AF9C4'],
        tooltip: {
        	 pointFormat: '{series.name}: <b>{point.percentage:.1f}%'
        },
        plotOptions: {
            pie: {
				borderWidth: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                        	//alert('The name is ' + this.name +' and the identifier is ' + this.options.id);
                        	socialMentionsPopUp(this.name);
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                   // connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name:'Trade Sources',
            data:series
        }],
        navigation: {			
        buttonOptions: {
            enabled: false
        }
    } 
	});
}



/**************************************************************************************************************************
*                     List CLient Competitor Mapping                                                                         *
**************************************************************************************************************************/
var dashboardClientCompetitorMappingUrl = "../dashboard/";

function clientCompetitorList(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
    var organizationId =$('#organizationName option:selected').val();

    
    
$.ajax({
	type:"POST",
	url:"../dashboard/getCompetitorsWithRanking.htm",
	contentType:"application/json",
	data:JSON.stringify({fromDate:fromDate, toDate:toDate,organizationId:organizationId}),
	success:function(response){

		//unloadingForDashBoard();
		if(response.length>0){
			
			//bubble sort to changing ranking of competitor
			/*for (var p = (response.length - 1); p >= 0; p--)
		    {
		       for (var q = 1; q <= p; q++)
		       {
		          if (response[q-1].totalRepufactScore < response[q].totalRepufactScore)
		          {
		               var tempScore = response[q-1].totalRepufactScore;
		 	            var tempOrg = response[q-1].competitorName;
		 	           var tempChange = response[q-1].changeValue;
		 	           
		 	          response[q-1].totalRepufactScore = response[q].totalRepufactScore;
		 	         response[q-1].competitorName = response[q].competitorName;
		 	        response[q-1].changeValue = response[q].changeValue;
		 	          
		 	       response[q].totalRepufactScore = tempScore;
		 	      response[q].competitorName = tempOrg;
		 	     response[q].changeValue = tempChange;
		    } }}*/
			
			
			
	$("#competitorList").html('');
	var html = "";
	//console.log("Response :"+JSON.stringify(response));
	for(var i=0; i<response.length; i++){
		//console.log("organizationId :"+organizationId);
		if(response[i].competitor==organizationId){		//condition check for selected organization id
			console.log("competitor :"+response[i].competitor);
			var selectedOrganization = response[i];
			html += '<div class="col-lg-6 col-md-12">';
			html += '<div class="DashboardCompetitor DashboardCompetitorRank'+(i+1)+' SelectedOrganizationRank">';
			html += '<div class="row trimTextLength" title="'+selectedOrganization.clientName+'">'+selectedOrganization.clientName+'</div>';
			/*if(selectedOrganization.changeValue>0){
				html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="PositiveChange">'+selectedOrganization.changeValue+'</span></div>';
			    }else if(selectedOrganization.changeValue<0){
			    	html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="NegativeChange">'+selectedOrganization.changeValue+'</span></div>';
			    }else{
			    	html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="NoChange">'+seleChange">'+selectedOrganization.rank+'</span></div>';
			    }else if(selectedOrganization.rank<0){
			    	html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span clectedOrganization.changeValue+'</span></div>';
			    }*/
			 if(selectedOrganization.rank>0){
				 html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="PositiveChange">'+selectedOrganization.rank+'</span></div>';
				//html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="Positivass="NegativeChange">'+selectedOrganization.rank+'</span></div>';
			    }else if(selectedOrganization.rank<0){
			    	html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="NegativeChange">'+Math.abs(selectedOrganization.rank)+'</span></div>';
			    }else{
			    	html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="NoChange">'+selectedOrganization.rank+'</span></div>';
			    }
			html += '<div class="DashboardCompetitorFactorScore text-right"><div style="font-size: 12px;color: #194b7d;">Rating Score Index</div>'+selectedOrganization.totalRepufactScore+'</div>';
			html += '</div></div>';
			
			
		}else{
			var selectedOrganization = response[i];
			//console.log("competitor :"+response[i].competitor);
			//console.log("competitor :"+response[i].competitorName);
			html += '<div class="col-lg-6 col-md-12">';
			html += '<div class="DashboardCompetitor DashboardCompetitorRank'+(i+1)+'">';
			html += '<div class="row trimTextLength" title="'+response[i].competitorName+'">'+response[i].competitorName+'</div>';
			//html += '<div class="row SmallDarkGreyHeader">Rank Change <span class="PositiveChange">'+response[i].changeValue+'</span></div>';
			/*if(response[i].changeValue>0){
				html += '<div class="row SmallDarkGreyHeader">Rank Change <span class="PositiveChange">'+response[i].changeValue+'</span></div>';
			    }else if(response[i].changeValue<0){
			    	html += '<div class="row SmallDarkGreyHeader">Rank Change <span class="NegativeChange">'+response[i].changeValue+'</span></div>';
			    }else{
			    	html += '<div class="row SmallDarkGreyHeader">Rank Change <span class="NoChange">'+response[i].changeValue+'</span></div>';
			    }*/
			if(selectedOrganization.rank>0){
				html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="PositiveChange">'+selectedOrganization.rank+'</span></div>';
			    }else if(selectedOrganization.rank<0){
			    	html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="NegativeChange">'+Math.abs(selectedOrganization.rank)+'</span></div>';
			    }else{
			    	html += '<div class="row SmallDarkGreyHeader" id="organizationRankChange">Rank Change <span class="NoChange">'+selectedOrganization.rank+'</span></div>';
			    }
			html += '<div class="DashboardCompetitorFactorScore text-right"><div style="font-size: 12px;color: #194b7d;">Rating Score Index</div>'+response[i].totalRepufactScore+'</div>';
			html += '</div></div>';
			
		}
	}
	$("#competitorList").append(html).show();
		}else{
			$('#competitorList').html('');
		 	$('#competitorList').append('<h4><font color="red">Competitors are Not Mapped for this organization</font></h4>');
		}
	}});
}

function showRepufactorPopup(organizationId){
	nextChartData=[];
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getRepufactorValuesForPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
		var repufactorChartData = new Array();
			if(response.length>0){
			var organizationFullName="";
			for(var i=0;i<response.length;i++){
				organizationFullName=response[i].organizationFullName;
				
				$.each(response[i], function(date, repufactor){
					if(repufactor>0){
						var fixedRepufactorValue = Math.round(repufactor * 100) / 100;
						repufactorChartData.push([moment(date).format("DD MMM YYYY"), fixedRepufactorValue]); 
						nextChartData.push([moment(date).format("DD MMM YYYY"), fixedRepufactorValue]);
					}
				});
			}
			repufactorPopulateChart(repufactorChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');
			$('#myModalLabelRepufactor').html('');
			$('#myModalLabelRepufactor').html("Rating Score Index For-"+organizationFullName);
			$('#myModalRepufactor').modal('show');
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

function nextRepuFactorData(){
	
	start=start+12;
	end=end+12;
	repufactorPopulateChart(nextChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}

function previousRepuFactorData(){
	
	start=start-12;
	end=end-12;
	repufactorPopulateChart(nextChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}


function repufactorPopulateChart(chartData, title, yAxisTitle, seriesName){
	
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
	
	
	
	
	var _chartData = new Array();
	_chartData=chartData;
	
	chartData=chartData.slice(start,end);
	
	//disable next and previous button
	if(_chartData.length<12)
	{
	$('#previousRepufactorChartDiv').prop('disabled',false);
	}
	if(end>=_chartData.length){
		$('#nextRepufactorChartDiv').prop('disabled',true);
	}else{
		$('#nextRepufactorChartDiv').prop('disabled',false);
	}
	if(start<=0){
		$('#previousRepufactorChartDiv').prop('disabled',true);
	}else{
		$('#previousRepufactorChartDiv').prop('disabled',false);
	}
	
	
	$('#repufactorVStime').html('');
	$('#repufactorVStime').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}


function showReviewCountPopup(organizationId){
	nextReviewCountChartData=[];
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	
	$.ajax({
		type:"POST",
		url:"../dashboard/showReviewCountPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			if(response.length>0){
			var chartData = new Array();
			for(var i=0;i<response.length;i++){
				$.each(response[i], function( date, sentiment){
			        chartData.push([moment(date).format("DD MMM YYYY"), sentiment]);      
			        nextReviewCountChartData.push([moment(date).format("DD MMM YYYY"), sentiment]);    
				});
			}
			reviewCountPopulateChart(chartData, 'Review Volume Vs Time', 'Review Count', 'Trade Reviews Count');
			$('#myModalLabelReviewCount').html('');
			$('#myModalLabelReviewCount').html("Reviews");
			$('#myModalReviewCount').modal('show');
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

function nextReviewCountData(){
	
	start=start+12;
	end=end+12;
	reviewCountPopulateChart(nextReviewCountChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}

function previousReviewCountData(){
	
	start=start-12;
	end=end-12;
	reviewCountPopulateChart(nextReviewCountChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}


function reviewCountPopulateChart(chartData, title, yAxisTitle, seriesName){
	
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
	
	
	
	
	var _chartData = new Array();
	_chartData=chartData;
	
	chartData=chartData.slice(start,end);
	
	//disable next and previous button
	if(_chartData.length<12)
	{
	$('#previousReviewCountChartDiv').prop('disabled',false);
	}
	if(end>=_chartData.length){
		$('#nextReviewCountChartDiv').prop('disabled',true);
	}else{
		$('#nextReviewCountChartDiv').prop('disabled',false);
	}
	if(start<=0){
		$('#previousReviewCountChartDiv').prop('disabled',true);
	}else{
		$('#previousReviewCountChartDiv').prop('disabled',false);
	}
	
	
	$('#reviewCountVStime').html('');
	$('#reviewCountVStime').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}



function showPositiveSentimentPopup(organizationId){
	nextPositiveSentimentChartData=[];
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();

	$.ajax({
		type:"POST",
		url:"../dashboard/showPositiveSentimentPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			if(response.length>0){
			var chartData = new Array();
			var organizationFullName="";
			for(var i=0;i<response.length;i++){
			organizationFullName=response[i].organizationFullName;
				$.each(response[i], function( date, sentiment){
			        chartData.push([moment(date).format("DD MMM YYYY"), sentiment]);       
			        nextPositiveSentimentChartData.push([moment(date).format("DD MMM YYYY"), sentiment]);
				});
			}
			populatePositiveSentimentChart(chartData, 'Sentiment Values Vs Time', 'Positive Sentiment', 'Positive Sentiment');
			$('#myModalLabelPositive').html('');
			$('#myModalLabelPositive').html("Positive Sentiment");
			$('#myModalPositiveCount').modal('show');
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

function nextPositiveCountData(){
	
	start=start+12;
	end=end+12;
	populatePositiveSentimentChart(nextPositiveSentimentChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}

function previousPositiveCountData(){
	
	start=start-12;
	end=end-12;
	populatePositiveSentimentChart(nextPositiveSentimentChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}


function populatePositiveSentimentChart(chartData, title, yAxisTitle, seriesName){
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
	
	
	
	
	var _chartData = new Array();
	_chartData=chartData;
	
	chartData=chartData.slice(start,end);
	
	//disable next and previous button
	if(_chartData.length<12)
	{
	$('#previousPositiveCountChartDiv').prop('disabled',false);
	}
	if(end>=_chartData.length){
		$('#nextPositiveCountChartDiv').prop('disabled',true);
	}else{
		$('#nextPositiveCountChartDiv').prop('disabled',false);
	}
	if(start<=0){
		$('#previousPositiveCountChartDiv').prop('disabled',true);
	}else{
		$('#previousPositiveCountChartDiv').prop('disabled',false);
	}
	
	$('#positiveCountVStime').html('');
	$('#positiveCountVStime').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}

function showNegativeSentimentPopup(organizationId){
	
	nextNegativeSentimentChartData=[];
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	
	$.ajax({
		type:"POST",
		url:"../dashboard/showNegativeSentimentPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			if(response.length>0){
			var chartData = new Array();
			for(var i=0;i<response.length;i++){
				$.each(response[i], function( date, sentiment){
			        chartData.push([moment(date).format("DD MMM YYYY"), sentiment]);    
			        nextNegativeSentimentChartData.push([moment(date).format("DD MMM YYYY"), sentiment]); 
				});
			}
			populateNegativeSentimentChart(chartData, 'Sentiment Values Vs Time', 'Negative Sentiment', 'Negative Sentiment');
			$('#myModalLabelNegative').html('');
			$('#myModalLabelNegative').html("Negative Sentiment");
			$('#myModalNegativeCount').modal('show');
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


function nextNegativeCountData(){
	
	start=start+12;
	end=end+12;
	populateNegativeSentimentChart(nextNegativeSentimentChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}

function previousNegativeCountData(){
	
	start=start-12;
	end=end-12;
	populateNegativeSentimentChart(nextNegativeSentimentChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}


function populateNegativeSentimentChart(chartData, title, yAxisTitle, seriesName){
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
	
	
	
	var _chartData = new Array();
	_chartData=chartData;
	chartData=chartData.slice(start,end);
	
	//disable next and previous button
	if(_chartData.length<12)
	{
	$('#previousNegativeCountChartDiv').prop('disabled',false);
	}
	if(end>=_chartData.length){
		$('#nextNegativeCountChartDiv').prop('disabled',true);
	}else{
		$('#nextNegativeCountChartDiv').prop('disabled',false);
	}
	if(start<=0){
		$('#previousNegativeCountChartDiv').prop('disabled',true);
	}else{
		$('#previousNegativeCountChartDiv').prop('disabled',false);
	}
	
	$('#negativeCountVStime').html('');
	$('#negativeCountVStime').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}

function showNeutralSentimentPopup(organizationId){
	
	nextNeutralSentimentChartData=[];
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/showNeutralSentimentPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			if(response.length>0){
			var chartData = new Array();
			for(var i=0;i<response.length;i++){
				$.each(response[i], function( date, sentiment){
			        chartData.push([moment(date).format("DD MMM YYYY"), sentiment]);      
			        nextNeutralSentimentChartData.push([moment(date).format("DD MMM YYYY"), sentiment]);  
				});
			}
			populateNeutralSentimentChart(chartData, 'Sentiment Values Vs Time', 'Neutral Sentiment', 'Neutral Sentiment');
			$('#myModalLabelNeutral').html('');
			$('#myModalLabelNeutral').html("Neutral Sentiment");
			$('#myModalNeutralCount').modal('show');
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

function nextNeutralCountData(){
	
	start=start+12;
	end=end+12;
	populateNeutralSentimentChart(nextNeutralSentimentChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}

function previousNeutralCountData(){
	
	start=start-12;
	end=end-12;
	populateNeutralSentimentChart(nextNeutralSentimentChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}


function populateNeutralSentimentChart(chartData, title, yAxisTitle, seriesName){
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
	
	
	
	
	var _chartData = new Array();
	_chartData=chartData;
	
	chartData=chartData.slice(start,end);
	
	//disable next and previous button
	if(_chartData.length<12)
	{
	$('#previousNeutralCountChartDiv').prop('disabled',false);
	}
	if(end>=_chartData.length){
		$('#nextNeutralCountChartDiv').prop('disabled',true);
	}else{
		$('#nextNeutralCountChartDiv').prop('disabled',false);
	}
	if(start<=0){
		$('#previousNeutralCountChartDiv').prop('disabled',true);
	}else{
		$('#previousNeutralCountChartDiv').prop('disabled',false);
	}
	$('#neutralCountVStime').html('');
	$('#neutralCountVStime').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}

function showTradeSourceDataPopup(tradeSource){
	
	tradeSourceChartData=[];
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	
	$.ajax({
		type:"POST",
		url:"../dashboard/showTradeSourcePopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId,tradeSource:tradeSource}),
		success:function(response){
			if(response.length>0){
			var chartData = new Array();
			for(var i=0;i<response.length;i++){
				chartData.push([moment(response[i].tradeSourceCountDate).format("DD MMM YYYY"), response[i].sourceCount]); 
				tradeSourceChartData.push([moment(response[i].tradeSourceCountDate).format("DD MMM YYYY"), response[i].sourceCount]);
			}
		
			tradeSourcepopulateChart(chartData, 'Review Volume Vs Time', 'Trade Reviews Count', 'Trade Review Count');
			$('#myModalLabelTradeSource').html("Trade Reviews-"+tradeSource);
			$('#myModalTradeSource').modal('show');
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

function nextTradeSourceCountData(){
	
	start=start+12;
	end=end+12;
	tradeSourcepopulateChart(tradeSourceChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}

function previousTradeSourceCountData(){
	
	start=start-12;
	end=end-12;
	tradeSourcepopulateChart(tradeSourceChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}


function tradeSourcepopulateChart(chartData, title, yAxisTitle, seriesName){
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
	
	
	
	
	var _chartData = new Array();
	_chartData=chartData;
	
	chartData=chartData.slice(start,end);
	
	//disable next and previous button
	if(_chartData.length<12)
	{
	$('#previousTradeSourceCountChartDiv').prop('disabled',false);
	}
	if(end>=_chartData.length){
		$('#nextTradeSourceCountChartDiv').prop('disabled',true);
	}else{
		$('#nextTradeSourceCountChartDiv').prop('disabled',false);
	}
	if(start<=0){
		$('#previousTradeSourceCountChartDiv').prop('disabled',true);
	}else{
		$('#previousTradeSourceCountChartDiv').prop('disabled',false);
	}
	$('#repufactorVStimeTradeSource').html('');
	$('#repufactorVStimeTradeSource').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}


function populateChart(chartData, title, yAxisTitle, seriesName){
	
	$('#repufactorVStime').html('');
	$('#repufactorVStime').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}


function showKpiPolarityPopup(kpiId){
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/showKpiPolarityPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId,kpiId:kpiId}),
		success:function(response){
			if(response.length>0){
			var chartData = new Array();
			for(var i=0;i<response.length;i++){
				$.each(response[i], function( date, sentiment){
			        chartData.push([moment(date).format("DD MMM YYYY"), sentiment]);              
			        nextChartData.push([moment(date).format("DD MMM YYYY"), sentiment]);             
				});
			}
			populateChart(chartData, 'KPI Polarity Count Vs Time', 'Polarity Count', 'Polarity Count');
			$('#myModal').modal('show');
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


function socialMentionsPopUp(sourceName){
	socialMentionChartData=[];
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/socialMentionsPopUp.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId,sourceName:sourceName}),
		success:function(response){
			if(response.length>0){
				var chartData = new Array();
				for(var i=0;i<response.length;i++){
					chartData.push([moment(response[i].date).format("DD MMM YYYY"), response[i].mentionsCount]); 
					socialMentionChartData.push([moment(response[i].date).format("DD MMM YYYY"), response[i].mentionsCount]);
				}
				populateSocialMentionChart(chartData, 'Mentions Volume Vs Time', 'Social Mentions Count', 'Social Mentions Count');
				$('#myModalLabelSocialMention').html("Social Mentions-"+sourceName);
				$('#myModalSocialMention').modal('show');
			}else{
				$('#repufactorVStimeSocialMention').html('');
				$('#myModalLabelSocialMention').html("No Data Available!");
				$('#myModalSocialMention').modal('show');
			}
		},
		error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
	});

}


function nextSocialMentionCountData(){
	
	start=start+12;
	end=end+12;
	populateSocialMentionChart(socialMentionChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}

function previousSocialMentionCountData(){
	
	start=start-12;
	end=end-12;
	populateSocialMentionChart(socialMentionChartData, 'Rating Score Index Vs Time', 'Rating Score Index in %', 'Repufact');	
}


function populateSocialMentionChart(chartData, title, yAxisTitle, seriesName){
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
	
	
	
	
	var _chartData = new Array();
	_chartData=chartData;
	
	chartData=chartData.slice(start,end);
	
	//disable next and previous button
	if(_chartData.length<12)
	{
	$('#previousSocialMentionCountChartDiv').prop('disabled',false);
	}
	if(end>=_chartData.length){
		$('#nextSocialMentionCountChartDiv').prop('disabled',true);
	}else{
		$('#nextSocialMentionCountChartDiv').prop('disabled',false);
	}
	if(start<=0){
		$('#previousSocialMentionCountChartDiv').prop('disabled',true);
	}else{
		$('#previousSocialMentionCountChartDiv').prop('disabled',false);
	}
	$('#repufactorVStimeSocialMention').html('');
	$('#repufactorVStimeSocialMention').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: null
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
}


function convertToPercentage(sourceCountValue, response){
	var sumSourceCount = 0;
	var sourceCountPercent;
	for(var i=0; i<response.length; i++){
		sumSourceCount += response[i].sourceCount;
	}
	sourceCountPercent = (sourceCountValue/sumSourceCount)*100;
	return sourceCountPercent;
}


/**************************************************************************************************************************
 *                     Show Review Alerts Data                                                         				*
 *************************************************************************************************************************/
function reviewAlertsData(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"GET",
		url:"../reviewReplyAlert/getAlertsData.htm?organizationId="+organizationId,
		contentType:"application/json",
		//data:JSON.stringify({organizationId:organizationId}),
		success:function(response){
			if(undefined !== response.successObject && response.status=="SAVE_SUCCESS"){
				var failedCount = response.successObject.failedCount;
				var processedCount= response.successObject.processedCount;
				var retryCount=response.successObject.retryCount;
				
						
				$("#totalProcessedReviews").text(processedCount);
				$("#totalFailedReviews").text(failedCount);
				$("#totalRetryReviews").text(retryCount);
			}else{
				$("#totalProcessedReviews").text(response.errorMessage);
				$("#totalFailedReviews").text(response.errorMessage);
				$("#totalRetryReviews").text(response.errorMessage);
				
			}
			
		}
	});
	
	       $.ajax({
              type:"GET",
              url:"../reviewReplyAlert/getFullDetailsOfFailedItems.htm?organizationId="+organizationId,
              contentType:"application/json",
              success:function(response){
                     failedRepliesResponse = response;
              },
              error:function(response){
                     failedRepliesResponse = response;
              }
});

}
/**************************************************************************************************************************
 *                      Show Review Alerts Data                                                       				*
 *************************************************************************************************************************/



(function(angular){

	'use strict';

	var app = angular.module('clientDashBoard', ['clientDashBoard.controllers']);

	})(angular);