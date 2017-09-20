var sourceFactorColumnChartStart=0;
var sourceFactorColumnChartEnd = 10;
var socialMediaSourcesColumnChartStart=0;
var socialMediaSourcesColumnChartEnd=10;
var sourceFactorColumnChartResponse;
var socialMediaSourcesColumnChartResponse;
var sessionSelectedOrganizationId=0;
$(document).ready(function() {
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
		}
	});
	getSessionData().then(function(){
	poplateOrganizations(function(selectedOrgId) {
		$('#outerPageSourceFactorColumnChartPrevious').prop('disabled',true);
		$('#outerPageSourceSocialSourceColumnChartPrevious').prop('disabled',true);
		showReviewSourceAnalysis(selectedOrgId);
		showTotalReferences(selectedOrgId);
		shwoTrendChange(selectedOrgId);
		showTotalReviews(selectedOrgId);
		getSourceFactorsSparkLineChartData(selectedOrgId);
		getSoicalMediaSourcesColumnChartData(selectedOrgId);
		getSocialMediaSourcesSparkLineChartData(selectedOrgId);
	});
	})
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showReviewSourceAnalysis(organizationId);
	showTotalReferences(organizationId);
	shwoTrendChange(organizationId);
	showTotalReviews(organizationId);
	getSourceFactorsSparkLineChartData(organizationId);
	getSoicalMediaSourcesColumnChartData(organizationId);
	getSocialMediaSourcesSparkLineChartData(organizationId);
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

function showReviewSourceAnalysis(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/populateTradeSourceFactors.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			var sourceNameList=new Array();
			var sourcePolarityList=new Array();
			var sourceFactors=new Array();
			var sourceReviewsCountArray  = new Array();
			sourceFactorColumnChartResponse = response;
			if(response.length<=10){
				$('#outerPageSourceFactorColumnChartNext').prop('disabled',true);
			}
			if(response.length>0){
				for(var i=0; i<response.length; i++){
					var sourceName= response[i].sourceName;
					var polarityCounts = response[i].polarityCounts;
					var sourceFactor=response[i].sourceFactor;
					var sourceReviewCount = response[i].totalReviewCount;
					sourceFactors.push(sourceFactor);
					sourcePolarityList.push(polarityCounts);
					sourceNameList.push(sourceName);
					sourceReviewsCountArray.push(sourceReviewCount);
				}
				sourceNameList =   sourceNameList.slice(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);
				sourcePolarityList =  sourcePolarityList.slice(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);
				sourceReviewsCountArray = sourceReviewsCountArray.slice(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);
				populateSourceFactors(sourceNameList,sourcePolarityList,sourceReviewsCountArray);
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

//source factors chart
function populateSourceFactors(sourceNameList,sourcePolarityList,sourceReviewsCount){
	var totalReviewCount = $('#totalReviewCount').text();
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
		})(Highcharts) 
		
	var positiveArray=new Array();
	var negativeArray=new Array();	
	var neutralArray=new Array();	
	var positiveReferencesArray = new Array();
	var negativeReferencesArray = new Array();
	var neautralReferencesArray = new Array();
	for(var j=0;j<sourcePolarityList.length;j++){
		var positive=sourcePolarityList[j].positive;
		var negative=sourcePolarityList[j].negative;
		var neutral=sourcePolarityList[j].neutral;
		var total = positive+negative+neutral;
		var sourceFactor = parseFloat((sourceReviewsCount[j]/totalReviewCount)*100);
		sourceFactor = sourceFactor.toFixed(2);
		var positiveValue=(positive*sourceFactor)/total;
		var negativeValue=(negative*sourceFactor)/total;
		var neutralValue=(neutral*sourceFactor)/total;
		positiveArray.push(positiveValue);
		negativeArray.push(negativeValue);
		neutralArray.push(neutralValue);
		positiveReferencesArray.push(positive);
		negativeReferencesArray.push(negative);
		neautralReferencesArray.push(neutral);
		    	
	}

     $('#SourceFactorColumnStacked').highcharts({
	 credits: {
		enabled: false
	},
     chart: {
         type: 'column'
     },
     title: {
         text: null
     },
     xAxis: {
         categories: sourceNameList
     },
     yAxis: {
         min: 0,
         labels: {
             formatter: function () {
            	 return this.value;
            	 
             }
         },

         title: {
             text: 'Source Volume (Trade Reviews)',
             fontWeight: 'bold'
         },
         stackLabels: {
             enabled: true,
             style: {
                 fontWeight: 'bold',
                 color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
             },formatter: function() {
            	 var index = this.x;
            	 var sourceReviewCount = sourceReviewsCount[index];
            	 var percentage = parseFloat((sourceReviewCount/totalReviewCount)*100);
            	 percentage = percentage.toFixed(2);
                 return percentage+"%";
             }
         }
     },
     legend: {
    	 enabled: false
     },
     tooltip: {
    	 
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
         /*formatter: function () {
             return '<b>'  +
                 this.series.name + ' Reference(s): ' + this.y + '</b><br/>';
                 //'Source factor for ' + this.x + ': ' + this.point.stackTotal;
         }*/
     },
     plotOptions: {
         column: {
             stacking: 'normal',
             dataLabels: {
                 enabled: false,
                 color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                 style: {
                     textShadow: '0 0 3px black'
                 }
             }
         }
     },
     series: [{
         name: 'Positive',
         color: '#007d32',
         data: positiveArray
     }, {
         name: 'Neutral',
         color: '#ffc85a',
         data: neutralArray
     }, {
         name: 'Negative',
         color: '#db0703',
         data: negativeArray
     }]});
     
}
function showTotalReviews(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSummary/getAllReviews.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
		$("#totalReviewCount").text(response);
		}
	});

}
function shwoTrendChange(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../dashboard/getRepufactorScore.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			var change =0;
			if(response.successObject.repufactorMap.change!=null){
				change = response.successObject.repufactorMap.change;
			}
		if(change>0){
			$('#trendChange').html('<span class="PositiveChangeLeftAlign">'+change+'%</span>');
		}else if(change<0){
				$('#trendChange').html('<span class="NegativeChangeLeftAlign">'+change+'%</span>');
		}else if(change==0){
				$('#trendChange').html('<span class="NoChangeLeftAlign">'+change+'%</span>');
		}
		}
	});
}
function showTotalReferences(organizationId){
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
		var positeivePercentage=0.0;
		var neutralPercentage=0.0;
		var negativePercentage=0.0;
		positeivePercentage = (positive/totalReferences)*100;
		neutralPercentage = (neutral/totalReferences)*100;
		negativePercentage = (negative/totalReferences)*100;
		$("#totalReferencesCount").text(totalReferences);
		$("#positiveCount").text(positive);
		$("#negativeCount").text(negative);
		$("#neutralCount").text(neutral);
		$("#positivePercentage").text(Math.round(positeivePercentage)+'%');
		$("#neutralPercentage").text(Math.round(neutralPercentage)+'%');
		var positeivePercentageRoundedVal = Math.round(positeivePercentage);
		var neutralPercentageRoundedVal = Math.round(neutralPercentage);
		var negativePercentageRoundedVal = 100-(positeivePercentageRoundedVal+neutralPercentageRoundedVal);
		$("#negativePercentage").text(negativePercentageRoundedVal+'%');
		}
	});
}
function getSourceFactorsSparkLineChartData(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var sourcefactValues=[];
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/getSourceFactorsSparkLineChartData.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			console.log(response);
			unloadingForDashBoard();
			var count = 0;
			$('#sourceFactorSparklineChartDataDiv').html('');
			if(response.length>0){ 
				for(var i=0;i<response.length;i++){
					count = count+1;
					var sourceFactorsSparkLineData = response[i].sourceFactors;
					var polarityCounts = response[i].polarityCounts;
					var totalReferences = polarityCounts.positive+polarityCounts.neutral+polarityCounts.negative;
					var milestone = response[i].milestone;
					var milestonTarget = milestone.setPercentage;
					var positeivePercentage=0.0;
					var neutralPercentage=0.0;
					var negativePercentage=0.0;
					positeivePercentage = (polarityCounts.positive/totalReferences)*100;
					neutralPercentage = (polarityCounts.neutral/totalReferences)*100;
					negativePercentage = (polarityCounts.negative/totalReferences)*100;
					
					for(var j=0; j<sourceFactorsSparkLineData.length; j++){
						sourcefactValues.push(" "+sourceFactorsSparkLineData[j].toFixed(2));
						}
					
					var html = "";
					html += '<div class="panel-body KPIDepartmentFactorTableBody" >';
					html += '<div class="row">';
					html += '<div class="col-md-6">';
					html += '<div class="row">';
					html += '<div class="col-xs-6">';
					html += '<div class="MediumBoldGreyContent" >'+response[i].sourceName+'</div>';
					html += '</div>';
					html += '<div class="col-xs-6 text-right">';
					html += '<div class="VerySmallGreyContent float-left">Trend Change</div>';
					if(response[i].sourceFactorChange>0){
						html += '<div class="PositiveChangeLeftAlign">'+response[i].sourceFactorChange+'%</div>';
					}else if(response[i].sourceFactorChange<0){
						html += '<div class="NegativeChangeLeftAlign">'+response[i].sourceFactorChange+'%</div>';
					}else if(response[i].sourceFactorChange==0){
						html += '<div class="NoChangeLeftAlign">'+response[i].sourceFactorChange+'%</div>';
					}
					html += '</div>';
					html += '</div>';
					html += '<div class="sourceSmallLineGraph">';
					html += '<div class="SourceCalcualtionChart col-xs-6" data-sparkline="'+sourcefactValues+'" style="height:30px; margin-left: 0; margin-right: 0; padding: 0; margin-bottom: -10px; margin-top:7px">';
					html += '</div>';
					html += '<div class="col-xs-6">';
					html += '<div class="TineyGreyContent">Source Score</div>';
					html += '<div class="SourceFactorScore" id="sourceFactorValue">'+response[i].sourceFactor+'%</div>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html += '<div class="col-md-6 row">';
					html += '<div class="col-lg-5">';
					html += '<div class="">';
					if(milestonTarget>0){
						html += '<div class="SmallBoldGreyContent">Milestone <span class="MediumBoldDarkBlueContent"> '+milestonTarget+'%</span></div>';
					}else {
						html += '<div class="SmallBoldGreyContent">Milestone <span class="MediumBoldDarkBlueContent"> NA</span></div>';
					}
					html += '</div>';
					if(milestone.setFromDate!=null&&milestone.setToDate){
						html += '<div class="TineyGreyContent SourceMilestoneDate">From '+moment(milestone.setFromDate).format("DD-MMMM-YYYY")+' To '+moment(milestone.setToDate).format("DD-MMMM-YYYY")+'</div>';
					}else {
						html += '<div class="TineyGreyContent SourceMilestoneDate">From  To </div>';
					}
					html += '<div class="">';
					html += '<div class="SmallBoldGreyContent">Total Reviews</div>';
					html += '<div class="MediumBoldDarkBlueContent">'+response[i].totalReviewCount+'</div>';
					html += '</div>';
					html += '</div>';
					html += '<div class="col-lg-7">';
					html += '<div class="row" style="margin-bottom:20px;">';
					html += '<div class="SmallHappyCountIcon col-xs-4" >';
					html += '<div class="TineyGreyContent">'+polarityCounts.positive+'</div>';
					var positivePercentages=Math.round(positeivePercentage * 100) / 100;
					if( positivePercentages == NaN ){
						html += '<div class="VerySmallBoldGreyContent">0%</div>';	
					}else{
					html += '<div class="VerySmallBoldGreyContent">'+Math.round(positeivePercentage * 100) / 100+'%</div>';
					}
					html += '</div>';
					html += '<div class="SmallNormalCountIcon col-xs-4">';
					html += '<div class="TineyGreyContent">'+polarityCounts.neutral+'</div>';
					var neutralPercentages=Math.round(neutralPercentage * 100) / 100;
					if(neutralPercentages == NaN){
						html += '<div class="VerySmallBoldGreyContent">0%</div>';
					}else{
					html += '<div class="VerySmallBoldGreyContent">'+Math.round(neutralPercentage * 100) / 100+'%</div>';
					}
					html += '</div>';
					html += '<div class="SmallSadCountIcon col-xs-4">';
					html += '<div class="TineyGreyContent">'+polarityCounts.negative+'</div>';
					var negativePercentages=Math.round(negativePercentage * 100) / 100;
					if(negativePercentages == 'NaN' || negativePercentages == 'undefined' ||  negativePercentages == 'null'){
						html += '<div class="VerySmallBoldGreyContent">0%</div>';
					}else{
					html += '<div class="VerySmallBoldGreyContent">'+Math.round(negativePercentage * 100) / 100+'%</div>';
					}
					html += '</div>';
					html += '</div>';
					html += '<div class="row">';
					html += '<div class="col-xs-7">';
					html += '<div class="TineyGreyContent">Total References(s)</div>';
					html += '<div class="MediumBoldDarkBlueContent">'+totalReferences+'</div>';
					html += '</div>';
					html += '<div class="col-xs-5">';
					html += '<a class="SmallLightDarkBlueContentLink " href="../reviewSourceAnalysis/showReviewSiteAnalysis.htm?sourceId='+response[i].id+'">View Details</a>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					$("#sourceFactorSparklineChartDataDiv").append(html).show();
					sentimentPolarityChart(polarityCounts,count);
					//SOURCE FACTOR SPARKLINE CHART
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
					                    pointFormat: '<b>{point.y}</b>'
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
					});
					
			//END OF SPARK LINE  CHART		
				}
			}
		},
		error:function(){
			
		}
	});
}
function sentimentPolarityChart(polarityCounts,count){
	count = parseInt(count);
	$("#SentimentCountSource"+count).highcharts({
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

function getSoicalMediaSourcesColumnChartData(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/getSocialMediaSourcesColumnChartData.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			var counts = new Array();
			var names = new Array();
			var totalMentions=0;
			socialMediaSourcesColumnChartResponse = response;
			if(socialMediaSourcesColumnChartResponse.length<10){
				$('#outerPageSourceSocialSourceColumnChartNext').prop('disabled',true);
			}
			if(response.length>0){
				$('#outerPageSocialSourcesColumnChartDiv').show();
				for(var i=0;i<response.length;i++){
					names.push(response[i].sourceName);
					counts.push(response[i].mentionsCount);
					totalMentions+=response[i].mentionsCount;
				}
				populateSocialMediaSourcesColumnChart(names.slice(socialMediaSourcesColumnChartStart,socialMediaSourcesColumnChartEnd),
													  counts.slice(socialMediaSourcesColumnChartStart,socialMediaSourcesColumnChartEnd));
			}else{
				$('#outerPageSocialSourcesColumnChartDiv').hide();
			}
			if(totalMentions>0){
				$("#totalReviewSocialMentions").text(totalMentions);
			}else{
				$("#totalReviewSocialMentions").text(0);
			}
		}
	});
}

function populateSocialMediaSourcesColumnChart(names,counts){
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
		})(Highcharts) 
	$('#SocialSourceLanding').highcharts({
    	credits: {
    		enabled: false
    	},
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
            categories: names,
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'No of Mentions'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Total Mentions: <b>{point.y:.1f}</b>'
        },
        series: [{
            name: 'References',
            data: counts,
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

function showSourceFactorPopup(sourceId){
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	sourceId  = parseInt(sourceId);
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/showSourceFactorPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId, sourceId:sourceId}),
		success:function(response){
			if(response.length>0){
			var sourcePolarityList = new Array();
			var sourcePolarityDateList = new Array();
			var sourceFactorList = new Array();
			var sourceName='';
			for(var i=0;i<response.length;i++){
				sourcePolarityList.push(response[i].polarityCounts);
				sourcePolarityDateList.push([moment(date).format("DD MM YYYY"),response[i].date]);
				sourceFactorList.push(response[i].sourceFactor);
				sourceName = response[0].sourceName;
			} 
			
			sourceFactorPopupChart(sourcePolarityList,sourcePolarityDateList,sourceFactorList,sourceName);
			$('#sourceFactorModel').modal('show');
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
function sourceFactorPopupChart(sourcePolarityList,sourcePolarityDateList,sourceFactorList,sourceName){
	$('#DepartmentFactorRoom').html('');
	var positiveArray=new Array();
	var negativeArray=new Array();	
	var neutralArray=new Array();	

	for(var i=0;i<sourceFactorList.length;i++){
		var positiveCount = sourcePolarityList[i].positive;
		var negativeCount = sourcePolarityList[i].negative;
		var neutralCount = sourcePolarityList[i].neutral;
		var x1 = sourceFactorList[i]/(positiveCount+negativeCount+neutralCount);
		if(x1>0){
			positiveArray.push(Math.round(x1*(positiveCount) * 100) / 100);
			negativeArray.push(Math.round(x1*(negativeCount) * 100) / 100);
			negativeArray.push(Math.round(x1*(neutralCount) * 100) / 100);
		}
	}
	$('#DepartmentFactorRoom').highcharts({
		credits: {
		enabled: false
	},
    chart: {
        type: 'column'
    },
    title: {
        text: null
    },
    xAxis: {
        categories: sourcePolarityDateList
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Source Score for '+sourceName,
            fontWeight: 'bold'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        }
    },
    legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        formatter: function () {
            return '<b>'  +
                this.series.name + ' Reference(s): ' + this.y + '</b><br/>' +
                'Source Score for ' + this.x + ': ' + this.point.stackTotal;
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: false,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                style: {
                    textShadow: '0 0 3px black'
                }
            }
        }
    },
    series: [{
        name: 'Neutral',
        color: '#ffc85a',
        data: neutralArray
    }, {
        name: 'Positive',
        color: '#007d32',
        data: positiveArray
    }, {
        name: 'Negative',
        color: '#db0703',
        data: negativeArray
    }]});
}

function getSocialMediaSourcesSparkLineChartData(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var socialMentionCountList=[];
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/getSocialMediaSourcesSparkLineChartData.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			console.log(response);
		$('#socialMentionSparklineChartDataDiv').html('');
		if(response.length>0){ 
			for(var i=0;i<response.length;i++){
				var sourceName = response[i].sourceName;
				var mentionsCounts=response[i].mentionsCounts;
				var totalReferences = 0;
				for(var j=0;j<response[i].mentionsCounts.length;j++){
					totalReferences+=parseInt(response[i].mentionsCounts[j]);
				}
				for(var k=0;k<mentionsCounts.length;k++){
					socialMentionCountList.push(" "+mentionsCounts[k]);
				}
				var html = "";
				html += '<div class="panel-body KPIDepartmentFactorTableBody" >';
				html += '<div class="row">';
				html += '<div class="col-md-6">';
				html += '<div class="row">';
				html += '<div class="col-xs-6">';
				html += '<div class="MediumBoldGreyContent"><span><img src="../resources/images/'+sourceName+'.png" alt='+sourceName+' height="55" width="55"/></span> '+sourceName+'</div>';
				html += '</div>';
				html += '<div class="col-xs-6 text-right">';
				html += '<div data-sparkline="'+socialMentionCountList+'" style="height:30px; margin-left: 0; margin-right: 0; padding: 0; margin-bottom: -10px; margin-top:7px">';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '<div class="col-md-6">';
				html += '<div class="col-md-4">';
				html += '<div class="SmallBoldGreyContent">Total References(s)</div>';
				html += '<div class="MediumBoldDarkBlueContent">'+totalReferences+'</div>';
				html += '</div>';
				html += '<div class="col-md-4 text-right">';
				html += '<div class="VerySmallGreyContent float-left">Trend Change</div>';
				if(response[i].trendChange>0){
					html += '<div class="PositiveChangeLeftAlign">'+response[i].trendChange+'</div>';
				}else if(response[i].trendChange<0){
					html += '<div class="NegativeChangeLeftAlign">'+response[i].trendChange+'</div>';
				}else if(response[i].trendChange==0){
					html += '<div class="NoChange">'+response[i].trendChange+'</div>';
				}
				html += '</div>';
				html += '<div class="col-md-4 text-right">';
				html += '<a class="SmallLightDarkBlueContentLink" id="viewDetailsSourceScore" href="../reviewSourceAnalysis/showSocialMediaSourceAnalysis.htm?sourceId='+response[i].sourceId+'">View Details</a>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				$("#socialMentionSparklineChartDataDiv").append(html).show();
				//SOCIAL MENTIONS FACTOR SPARKLINE CHART
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
				                    pointFormat: '<b>{point.y}</b>'
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
				});
				
		//END OF SPARK LINE  CHART		
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
function showNextSourceFactorValues(){
	sourceFactorColumnChartStart=sourceFactorColumnChartStart+10;
	sourceFactorColumnChartEnd=sourceFactorColumnChartEnd+10;
	sorceFactorValuesOuterPageChart(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);

}
function showPreviousSourceFactorValues(){
	sourceFactorColumnChartStart=sourceFactorColumnChartStart-10;
	sourceFactorColumnChartEnd=sourceFactorColumnChartEnd-10;
	sorceFactorValuesOuterPageChart(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);
}
function sorceFactorValuesOuterPageChart(sourceFactorColumnChartStart,sourceFactorColumnChartEnd){
	if(sourceFactorColumnChartResponse.length>0){
		var sourceNameList=new Array();
		var sourcePolarityList=new Array();
		var sourceReviewsCount = new Array();
		for(var i=0; i<sourceFactorColumnChartResponse.length; i++){
			var sourceName= sourceFactorColumnChartResponse[i].sourceName;
			var polarityCounts = sourceFactorColumnChartResponse[i].polarityCounts;
			var reviewCount = sourceFactorColumnChartResponse[i].totalReviewCount;
			sourcePolarityList.push(polarityCounts);
			sourceNameList.push(sourceName);
			sourceReviewsCount.push(reviewCount);
		}
		sourceNameList = sourceNameList.slice(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);
		sourcePolarityList = sourcePolarityList.slice(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);
		sourceReviewsCount = sourceReviewsCount.slice(sourceFactorColumnChartStart,sourceFactorColumnChartEnd);
		if(sourceFactorColumnChartEnd>=sourceFactorColumnChartResponse.length){
			$('#outerPageSourceFactorColumnChartNext').prop('disabled',true);
		}else{
			$('#outerPageSourceFactorColumnChartNext').prop('disabled',false);
		}
		
		if(sourceFactorColumnChartStart<=0){
			$('#outerPageSourceFactorColumnChartPrevious').prop('disabled',true);
		}else{
			$('#outerPageSourceFactorColumnChartPrevious').prop('disabled',false);

		}
		populateSourceFactors(sourceNameList,sourcePolarityList,sourceReviewsCount);
	}
}
function showNextSocialSourceValues(){
	socialMediaSourcesColumnChartStart=socialMediaSourcesColumnChartStart+10;
	socialMediaSourcesColumnChartEnd=socialMediaSourcesColumnChartEnd+10;
	socialSoureceValuesOuterPageChart(socialMediaSourcesColumnChartStart,socialMediaSourcesColumnChartEnd);

}
function showPreviousSocialSourceValues(){
	socialMediaSourcesColumnChartStart=socialMediaSourcesColumnChartStart-10;
	socialMediaSourcesColumnChartEnd=socialMediaSourcesColumnChartEnd-10;
	socialSoureceValuesOuterPageChart(socialMediaSourcesColumnChartStart,socialMediaSourcesColumnChartEnd);
}
function socialSoureceValuesOuterPageChart(socialMediaSourcesColumnChartStart,socialMediaSourcesColumnChartEnd){
	if(socialMediaSourcesColumnChartResponse.length>0){
		var counts = new Array();
		var names = new Array();
		if(socialMediaSourcesColumnChartResponse.length>0){
			for(var i=0;i<socialMediaSourcesColumnChartResponse.length;i++){
				names.push(socialMediaSourcesColumnChartResponse[i].sourceName);
				counts.push(socialMediaSourcesColumnChartResponse[i].mentionsCount);
			}
			counts = counts.slice(socialMediaSourcesColumnChartStart,socialMediaSourcesColumnChartEnd);
			names = names.slice(socialMediaSourcesColumnChartStart,socialMediaSourcesColumnChartEnd);
			if(socialMediaSourcesColumnChartEnd>=socialMediaSourcesColumnChartResponse.length){
				$('#outerPageSourceSocialSourceColumnChartNext').prop('disabled',true);
			}else{
				$('#outerPageSourceSocialSourceColumnChartNext').prop('disabled',false);
			}
			
			if(socialMediaSourcesColumnChartStart<=0){
				$('#outerPageSourceSocialSourceColumnChartPrevious').prop('disabled',true);
			}else{
				$('#outerPageSourceSocialSourceColumnChartPrevious').prop('disabled',false);

			}
			populateSocialMediaSourcesColumnChart(names,counts);
		}
		
	}
}
function showSocialMediaSourcesPopUp(sourceId){
	var organizationId = $('#organizationName option:selected').val();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	sourceId  = parseInt(sourceId);
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/showSocialMediaSourcesPopUp.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId, sourceId:sourceId}),
		success:function(response){
			//if(response.length>0){}

			var sourcePolarityList = new Array();
			var sourcePolarityDateList = new Array();
			var sourceFactorList = new Array();
			var sourceName='';
			for(var i=0;i<response.length;i++){
				sourcePolarityList.push(response[i].polarityCounts);
				sourcePolarityDateList.push(response[i].date);
				sourceFactorList.push(response[i].sourceFactor);
				sourceName = response[0].sourceName;
			} 
			
			socialMentionsPopUpChart(sourcePolarityList,sourcePolarityDateList,sourceFactorList,sourceName);
			$('#sourceFactorModel').modal('show');
		
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
function socialMentionsPopUpChart(sourcePolarityList,sourcePolarityDateList,sourceFactorList,sourceName){
	$('#sourceName').html(sourceName);
	$('#DepartmentFactorRoom').html('');
	var positiveArray=new Array();
	var negativeArray=new Array();	
	var neutralArray=new Array();	

	for(var i=0;i<sourceFactorList.length;i++){
		var positiveCount = sourcePolarityList[i].positive;
		var negativeCount = sourcePolarityList[i].negative;
		var neutralCount = sourcePolarityList[i].neutral;
		var x1 = sourceFactorList[i]/(positiveCount+negativeCount+neutralCount);
		if(x1>0){
			positiveArray.push(Math.round(x1*(positiveCount) * 100) / 100);
			negativeArray.push(Math.round(x1*(negativeCount) * 100) / 100);
			negativeArray.push(Math.round(x1*(neutralCount) * 100) / 100);
		}
	}
	$('#DepartmentFactorRoom').highcharts({
		credits: {
		enabled: false
	},
    chart: {
        type: 'column'
    },
    title: {
        text: null
    },
    xAxis: {
        categories: sourcePolarityDateList
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Source Score for '+sourceName,
            fontWeight: 'bold'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        }
    },
    legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        formatter: function () {
            return '<b>'  +
                this.series.name + ' Reference(s): ' + this.y + '</b><br/>' +
                'Source Score for ' + this.x + ': ' + this.point.stackTotal;
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: false,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                style: {
                    textShadow: '0 0 3px black'
                }
            }
        }
    },
    series: [{
        name: 'Neutral',
        color: '#ffc85a',
        data: neutralArray
    }, {
        name: 'Positive',
        color: '#007d32',
        data: positiveArray
    }, {
        name: 'Negative',
        color: '#db0703',
        data: negativeArray
    }]});
}
