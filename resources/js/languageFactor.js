var languageFactorColumnChartResponse;
var languageFactorColumnChartStart=0;
var languageFactorColumnChartEnd=10;
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
		$('#languageFactorOuterPagePrevious').prop('disabled',true);
		showTotalReferences(selectedOrgId);
		shwoTrendChange(selectedOrgId);
		showTotalReviews(selectedOrgId);
		showLanguageFactorsColumnChart(selectedOrgId);
		showLanguageFactorSparklineChart(selectedOrgId);
	});
	});
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showTotalReferences(organizationId);
	shwoTrendChange(organizationId);
	showTotalReviews(organizationId);
	showLanguageFactorsColumnChart(organizationId);
	showLanguageFactorSparklineChart(organizationId);
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
		positeivePercentage = (positive/totalReferences)*100;
		neutralPercentage = (neutral/totalReferences)*100;
		negativePercentage = (negative/totalReferences)*100;
		$("#language_Factor_TotalReferencesCount").text(totalReferences);
		$("#language_Factor_PositiveCount").text(positive);
		$("#language_Factor_NegativeCount").text(negative);
		$("#language_Factor_NeutralCount").text(neutral);
		$("#language_Factor_PositivePercentage").text(Math.round(positeivePercentage)+'%');
		$("#language_Factor_NeutralPercentage").text(Math.round(neutralPercentage)+'%');
		var positeivePercentageRoundedVal = Math.round(positeivePercentage);
		var neutralPercentageRoundedVal = Math.round(neutralPercentage);
		var negativePercentageRoundedVal = 100-(positeivePercentageRoundedVal+neutralPercentageRoundedVal);
		$("#language_Factor_NegativePercentage").text(negativePercentageRoundedVal+'%');
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
		success:function(response){console.log(response);
			var change =0;
			if(response.successObject.repufactorMap.change!=null){
				change = response.successObject.repufactorMap.change;
			}
		if(change>0){
			$('#language_Factor_TrendChange').html('<span class="PositiveChangeLeftAlign">'+change+'%</span>');
		}else if(change<0){
				$('#language_Factor_TrendChange').html('<span class="NegativeChangeLeftAlign">'+change+'%</span>');
		}else if(change==0){
				$('#language_Factor_TrendChange').html('<span class="NoChangeLeftAlign">'+change+'%</span>');
		}
		}
	});
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
		$("#language_Factor_TotalReviewCount").text(response);
		}
	});
}
function showLanguageFactorsColumnChart(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../languageFactor/showLanguageFactorsColumnChartData.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			var languageList=new Array();
			var languagePolarityList=new Array();
			var languageFactorList=new Array();
			languageFactorColumnChartResponse = response;
			if(response.length<=10){
				$('#languageFactorOuterPageNext').prop('disabled',true);
			}else{
				$('#languageFactorOuterPageNext').prop('disabled',false);
			}
			if(response.length>0){
				for(var i=0;i<response.length;i++){
					languageList.push(response[i].languageFullName);
					languagePolarityList.push(response[i].polarityCounts);
					languageFactorList.push(response[i].languageVolume);
				}
				populateLanguageFactorColumnChartValues(languageList.slice(languageFactorColumnChartStart, languageFactorColumnChartEnd),languagePolarityList.slice(languageFactorColumnChartStart, languageFactorColumnChartEnd),languageFactorList.slice(languageFactorColumnChartStart, languageFactorColumnChartEnd));
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
function populateLanguageFactorColumnChartValues(languageList,languagePolarityList,languageFactorList){
	var totalReviewCount = parseInt($('#language_Factor_TotalReviewCount').text());
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
	var neutralReferencesArray = new Array();
	for(var j=0;j<languagePolarityList.length;j++){
		var positive=languagePolarityList[j].positive;
		var negative=languagePolarityList[j].negative;
		var neutral=languagePolarityList[j].neutral;
		var total = positive+negative+neutral;
		if(total > 0){
			var languageVolume = languageFactorList[j];
			var percentage = parseFloat((languageVolume/totalReviewCount)*100);
			percentage = percentage.toFixed(2);
			positiveArray.push((percentage/total)*positive);
			negativeArray.push((percentage/total)*negative);
			neutralArray.push((percentage/total)*neutral);
			positiveReferencesArray.push(positive);
			negativeReferencesArray.push(negative);
			neutralReferencesArray.push(neutral);
		}else{
			var languageVolume = languageFactorList[j];
			var percentage = parseFloat((languageVolume/totalReviewCount)*100);
			percentage = percentage.toFixed(2);
			positiveArray.push(positive); /*((percentage)*positive)*/
			negativeArray.push(negative);
			neutralArray.push(neutral);
			positiveReferencesArray.push(positive);
			negativeReferencesArray.push(negative);
			neutralReferencesArray.push(neutral);
		}
	}
		 $('#languageFactorColumnStacked').highcharts({
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
		         categories: languageList
		     },
		     yAxis: {
		         min: 0,
		         title: {
		             text: 'Language Score (Trade Reviews)',
		             fontWeight: 'bold'
		         },
		         labels: {
		             formatter: function () {
		            	 return this.value;
		             }
		         },
		         stackLabels: {
		             enabled: true,
		             style: {
		                 fontWeight: 'bold',
		                 color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
		             },formatter: function() {
		            	 var index = this.x;
		            	 var languageReviewCount = languageFactorList[index];
		            	 var percentage = parseFloat((languageReviewCount/totalReviewCount)*100);
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
							return '<b>'+name+ 'Reference(s): '+neutralReferencesArray[index];
						}else if(name=="Positive"){
							return '<b>'+name+ 'Reference(s): '+positiveReferencesArray[index];
						}else if(name=="Negative"){
							return '<b>'+name+ 'Reference(s): '+negativeReferencesArray[index];
						}
								
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
function showLanguageFactorSparklineChart(organizationId){
	loadingForDashBoard();
	var count=0;
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../languageFactor/showLanguageFactorsColumnChartData.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			unloadingForDashBoard();
			console.log(response);
			$('#repufactLanguageVolume').html('');
			if(response.length>0){
				console.log(response);
				var totalReferences = 0;
				for(var i=0;i<response.length;i++){
					var languagePolarityCounts = response[i].polarityCounts;
					totalReferences = languagePolarityCounts.positive + languagePolarityCounts.neutral + languagePolarityCounts.negative;
					var positeivePercentage=0.0;
					var neutralPercentage=0.0;
					var negativePercentage=0.0;
					positeivePercentage = (languagePolarityCounts.positive/totalReferences)*100;
					neutralPercentage = (languagePolarityCounts.neutral/totalReferences)*100;
					negativePercentage = (languagePolarityCounts.negative/totalReferences)*100; 
					count=count+1;
					var html = "";
					html += '<div class="panel-body"><div class="col-md-1">';
					html +='<div class="row">';
					html +='<div>';
					html +='<div class="MediumBoldGreyContent">'+response[i].languageFullName;
					html +='</div>';
					html +='<div><a class="SmallLightDarkBlueContentLink" id="viewDetailsLangScore" href="#" onclick=redirectView("../languageFactor/showLanguageFactorDetails.htm?language='+response[i].languageName+'")>View Details</a></div>';
					html +='</div>';
					html +='</div>';
					html +='</div>';
					
					//language factor
					html +='<div class="col-md-2">';
					html +='<div>';
					html +='<div class="VerySmallGreyContent">Language Score</div>';
					html +='<div>';
					html +='<div class="PositiveChangeLeftAlign">'+response[i].languageFactor+'%</div>';
					html +='</div>';
					html +='</div>';
					html +='</div>';
					
					
					
					html +='<div class="col-md-1">';
					html +='<div>';
					html +='<div class="VerySmallGreyContent">TrendChange</div>';
					html +='<div>';
					html +='<div class="PositiveChangeLeftAlign">'+response[i].languageFactorTrendChange+'%</div>';
					html +='</div>';
					html +='</div>';
					html +='</div>';
					html +='<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">';
					html +='<div class="VerySmallGreyContent">Total Review(s)</div>';
					html +='<div class="MediumBoldGreyContent" id="language_Factor_TotalReviewCount">'+response[i].languageVolume+'</div>';
					html +='</div>';
					html +='<div class="col-md-2">';
					html +='<div class="">';
					html +='<div class="SmallBoldGreyContent">Total References(s)</div>';
					html +='<div class="MediumBoldDarkBlueContent">'+totalReferences+'</div>';
					html +='</div>';
					html +='</div>';
					/*html +='<div class="col-md-3">';
					html +='<div class="row">';*/
					/*html +='<div class="col-xs-5">';
					html +='<div id="languageSentimentCount'+count+'" style="margin: -10px 0px 0px -4px; height: 70px; padding-bottom:-30px;"></div>';
					html +='</div>';*/
					/*html +='<div class="col-xs-7 text-right">';
					html +='<div class="SmallDarkGreyHeader"><span class="PositiveSentimentCount">'+response[i].polarityCounts.positive+' </span>Positive</div>';
					html +='<div class="SmallDarkGreyHeader"><span class="NeutralSentimentCount">'+response[i].polarityCounts.neutral+' </span>Neutral</div>';
					html +='<div class="SmallDarkGreyHeader"><span class="NegativeSentimentCount">'+response[i].polarityCounts.negative+' </span>Negative</div>';
					html +='</div>';*/
					
					html += '<div class="col-md-4 row">';
					html += '<div class="col-xs-12">';
					html += '<div class="SmallHappyCountIcon col-xs-4">';
					html += '<div class="TineyGreyContent">'+languagePolarityCounts.positive+'</div>';
					html += '<div class="VerySmallBoldGreyContent">'+Math.round(positeivePercentage * 100) / 100+'%</div>';
					html += '</div>';
					html += '<div class="SmallNormalCountIcon col-xs-4">';
					html += '<div class="TineyGreyContent">'+languagePolarityCounts.neutral+'</div>';
					html += '<div class="VerySmallBoldGreyContent">'+Math.round(neutralPercentage * 100) / 100+'%</div>';
					html += '</div>';
					html += '<div class="SmallSadCountIcon col-xs-4">';
					html += '<div class="TineyGreyContent">'+languagePolarityCounts.negative+'</div>';
					html += '<div class="VerySmallBoldGreyContent">'+Math.round(negativePercentage * 100) / 100+'%</div>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html +='</div>';
					html +='</div>';
					$("#repufactLanguageVolume").append(html).show();
					//languageSentimentChart(languagePolarityCounts,count);
				}
				//populateLanguageFactorColumnChartValues(languageList,languagePolarityList,languageFactorList);
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
function languageSentimentChart(languagePolarityCounts,count){
	count = parseInt(count);
	$("#languageSentimentCount"+count).highcharts({
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
                ['Positive', languagePolarityCounts.positive],
                ['Neutral', languagePolarityCounts.neutral],
                ['Negative', languagePolarityCounts.negative],
            ],
        }],
		navigation: {			
				buttonOptions: {
					enabled: false
				}	
        } 
    });
}
function showLanguageFactorOuterPageChartPrevious(){
	languageFactorColumnChartStart = languageFactorColumnChartStart-10;
	languageFactorColumnChartEnd = languageFactorColumnChartEnd-10;
	/*languageFactorValuesInnerPageChart(languageFactorColumnChartStart,languageFactorColumnChartEnd);*/
	languageFactorValuesOuterPageChart(languageFactorColumnChartStart,languageFactorColumnChartEnd);
}
function showLanguageFactorOuterPageChartNext(){
	languageFactorColumnChartStart = languageFactorColumnChartStart+10;
	languageFactorColumnChartEnd = languageFactorColumnChartEnd+10;
	languageFactorValuesOuterPageChart(languageFactorColumnChartStart,languageFactorColumnChartEnd);
}
function languageFactorValuesOuterPageChart(languageFactorColumnChartStart,languageFactorColumnChartEnd){
	$('#languageFactorColumnStacked').html('');
	var languageList=new Array();
	var languagePolarityList=new Array();
	var languageFactorList=new Array();
	if(languageFactorColumnChartResponse.length>0){
		for(var i=0;i<languageFactorColumnChartResponse.length;i++){  /* innerPageLanguageFactorColumnChartResponse*/
			languageList.push(languageFactorColumnChartResponse[i].languageFullName);
			languagePolarityList.push(languageFactorColumnChartResponse[i].polarityCounts);
			languageFactorList.push(languageFactorColumnChartResponse[i].languageVolume);
		} 
	}
	languageList = languageList.slice(languageFactorColumnChartStart,languageFactorColumnChartEnd);
	languagePolarityList = languagePolarityList.slice(languageFactorColumnChartStart,languageFactorColumnChartEnd);
	languageFactorList = languageFactorList.slice(languageFactorColumnChartStart,languageFactorColumnChartEnd);
	if(languageFactorColumnChartEnd>=languageFactorColumnChartResponse.length){
		$('#languageFactorOuterPageNext').prop('disabled',true);
	}else{
		$('#languageFactorOuterPageNext').prop('disabled',false);
	}
	
	if(languageFactorColumnChartStart<=0){
		$('#languageFactorOuterPagePrevious').prop('disabled',true);
	}else{
		$('#languageFactorOuterPagePrevious').prop('disabled',false);
	}
	populateLanguageFactorColumnChartValues(languageList,languagePolarityList,languageFactorList);
}
