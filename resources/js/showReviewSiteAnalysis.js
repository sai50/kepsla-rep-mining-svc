var reviewList = [];
var searchText = "";
var innerPageSourceFctorColumnChartStart=0;
var innerPageSourceFctorColumnChartEnd = 10;
var innerPageReviewVolumeColumnChartStart = 0;
var innerPageReviewVolumeColimnChartEnd = 10;
var innerPageSourceFctorColumnChartResponse;
var innerPageReviewVolumeColumnChartResponse;
var sessionSelectedOrganizationId=0;
var innerPageReviewFilterResponse;

/*****************start of nitesh**********************/
var sentimentPolarityList;
var departmentList = [];
/*****************end of nitesh**********************/

var tradeSource = '';
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
	tradeSource = sourceName;
	getSessionData().then(function(){
	poplateOrganizations(function(selectedOrgId) {
		$('#innerPageSourceFacotorColumnChartPrevious').prop('disabled',true);
		$('#sourceInnerPageReviewVolumeColumnChartPrevious').prop('disabled',true);
		populateSourceFactorColumnStacked(selectedOrgId,sourceId);
		populateReviewVolumes(selectedOrgId,sourceId,sourceName);
		showReviewDetailsForSource(selectedOrgId,sourceId);
		
		/**********************Start of Nitesh******************/
		getSentimentPolarityList();
		listDepartment(selectedOrgId);
		/**********************end Of Nitesh******************/
	});
	})
});



$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	saveSessionDatas();
	showTotalReferences(organizationId);
	getSourceFactorWithChange(organizationId);
	showTotalReviews(organizationId);
	populateSourceFactorColumnStacked(organizationId,sourceId);
	populateReviewVolumes(organizationId,sourceId,tradeSource);
	showReviewDetailsForSource(organizationId,sourceId);
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

function populateSourceFactorColumnStacked(selectedOrgId,sourceId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/showSourceFactorPopup.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:selectedOrgId, sourceId:sourceId}),
		success:function(response){
			console.log(response.successObject.sourceFactorList);
			var sourceFactorListResponse = response.successObject.sourceFactorList;
			var sourcePolarityList = new Array();
			var sourcePolarityDateList = new Array();
			var sourceFactorList = new Array();
			var sourceName='';
			innerPageSourceFctorColumnChartResponse = sourceFactorListResponse;
			if(sourceFactorListResponse.length<=10){
				//$('#sourceInnerPageReviewVolumeColumnChartNext').prop('disabled',true);
				$('#innerPageSourceFacotorColumnChartNext').prop('disabled',true);
			}
			if(sourceFactorListResponse.length>0){
				for(var i=0;i<sourceFactorListResponse.length;i++){
					sourcePolarityList.push(sourceFactorListResponse[i].polarityCounts);
					sourcePolarityDateList.push(sourceFactorListResponse[i].date);
					sourceFactorList.push(sourceFactorListResponse[i].sourceFactor);
					sourceName = sourceFactorListResponse[0].sourceName;
				} 
				SourceFactorColumnStackChart(sourcePolarityList.slice(innerPageSourceFctorColumnChartStart, 
											innerPageSourceFctorColumnChartEnd),
											sourcePolarityDateList.slice(innerPageSourceFctorColumnChartStart, 
											innerPageSourceFctorColumnChartEnd),sourceFactorList,sourceName);
				unloadingForDashBoard();
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

function SourceFactorColumnStackChart(sourcePolarityList,sourcePolarityDateList,sourceFactorList,sourceName){
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
	$('#SourceFactorColumnStacked').html(" ");
	var positiveArray=new Array();
	var negativeArray=new Array();	
	var neutralArray=new Array();	
	var positiveReferencesArray = new Array();
	var negativeReferencesArray = new Array();
	var neautralReferencesArray = new Array();
	for(var i=0;i<sourcePolarityList.length;i++){
		var positiveCount = sourcePolarityList[i].positive;
		var negativeCount = sourcePolarityList[i].negative;
		var neutralCount = sourcePolarityList[i].neutral;
		var totalCount =  positiveCount+negativeCount+neutralCount;
		var positiveValue = (sourceFactorList[i]/totalCount)*positiveCount;
		var negativeValue = (sourceFactorList[i]/totalCount)*negativeCount;
		var neautralValue = (sourceFactorList[i]/totalCount)*neutralCount;
		positiveArray.push(positiveValue);
		negativeArray.push(negativeValue);
		neutralArray.push(neautralValue);
		
		positiveReferencesArray.push(positiveCount);
		negativeReferencesArray.push(negativeCount);
		neautralReferencesArray.push(neutralCount);
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
            },
            formatter: function() {
				var index  =this.x;
				var percentage = sourceFactorList[index];
				return percentage+"%";
	            }
        }
    }, 
    legend: {
        enabled: false
    },
    tooltip: {
        formatter: function () {var index  = this.point.index;
		var name = this.series.name;
		if(name=="Neutral"){
			return '<b>'+name+ 'Reference(s): '+neautralReferencesArray[index];
		}else if(name=="Positive"){
			return '<b>'+name+ 'Reference(s): '+positiveReferencesArray[index];
		}else if(name=="Negative"){
			return '<b>'+name+ 'Reference(s): '+negativeReferencesArray[index];
		}}
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
function populateReviewVolumes(selectedOrgId,sourceId,sourceName){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/populateReviewVolumes.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:selectedOrgId, sourceId:sourceId}),
		success:function(response){
			var totalReviews = $('#sourceReviews').val();
			var dateList = new Array();
			var reviewVolumeList = new Array();
			var sourceVolumeList = new Array();
			innerPageReviewVolumeColumnChartResponse = response;
			if(response.length<=10){
				$('#sourceInnerPageReviewVolumeColumnChartNext').prop('disabled',true);
			}
			if(response.length>0){
				for(var i=0;i<response.length;i++){
					$.each(response[i], function( date, volume){
						dateList.push(moment(date).format("MMM YY"));
						reviewVolumeList.push(volume);
						var percentage = parseFloat((volume/totalReviews)*100);
						sourceVolumeList.push(percentage);
					});
				} 
				dateList = dateList.slice(innerPageReviewVolumeColumnChartStart, innerPageReviewVolumeColimnChartEnd);
				reviewVolumeList = reviewVolumeList.slice(innerPageReviewVolumeColumnChartStart, innerPageReviewVolumeColimnChartEnd);
				sourceVolumeList = sourceVolumeList.slice(innerPageReviewVolumeColumnChartStart, innerPageReviewVolumeColimnChartEnd);
				SourceVolumeInnerPageCountChart(dateList,reviewVolumeList,sourceVolumeList,sourceName);
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

function SourceVolumeInnerPageCountChart(dateList,reviewVolumeList,sourceVolumeList,sourceName){
	var updatedSourceVolumeList = [];
	$.each(sourceVolumeList,function(index,value){
		var updatedSourceVolume = value.toFixed(2);
		updatedSourceVolume = parseFloat(updatedSourceVolume);
		updatedSourceVolumeList.push(updatedSourceVolume);
	});
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
    $('#SourceVolumeInnerPageCount').highcharts({
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
        categories: dateList,
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
            text: 'Source Volume for '+sourceName
        },
        stackLabels : {
			enabled : true,
			style : {
				fontWeight : 'bold',
				color : (Highcharts.theme && Highcharts.theme.textColor)
						|| 'gray'
			},formatter: function() {
				var index  =this.x;
				var percentage = updatedSourceVolumeList[index];
				return percentage+"%";
	            }
			
		}, 
    },
    legend: {
        enabled: false
    },
    tooltip: {
        //pointFormat: 'Volume: <b>{point.y:.1f}</b>'
    	formatter:function(){
    		var index  = this.point.index;
    		return 'Volume:<b>'+ reviewVolumeList[index]+'</b>';
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
    series: [{
        name: 'References',
        data: updatedSourceVolumeList,
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
            },formatter:function(){
            	var index = this.point.index;
            	return reviewVolumeList[index];
            }
        }
    }]
    });
}
function showReviewDetailsForSource(selectedOrgId,sourceId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/showReviewDetailsForSource.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:selectedOrgId, sourceId:sourceId}),
		success:function(response){
			unloadingForDashBoard();
			if(response.length>0){
				reviewList = response;
				innerPageReviewFilterResponse = null;
				var noOfPages = 0;
				if(reviewList.length%5  == 0 && reviewList.length >0){
					noOfPages = reviewList.length/5;
				}else{
					noOfPages = (reviewList.length/5)+1;
				}
				begin = 0;
				end = 5;
				/*if(reviewList.length<5){
					//noOfPages = reviewList.length;
					end = noOfPages.length;
				}*/
				if(end > reviewList.legth){
		    		end = reviewList.length;
		    	}
		    	
			    $('#page-selection').bootpag({
			        total: noOfPages,
			        page: 1,
			        maxVisible: 5 
			    }).on("page", function(event, /* page number here */ num){
			    	begin = ((num-1)*5);
			    	end=(num)*5;
			    	if(end > reviewList.legth){
			    		end = reviewList.length;
			    	}
			    	getReviewsPerPage(begin, end);
			    });
			    getReviewsPerPage(begin, end);
			
			}else{
				("#page-selection").html(" ");
				("#reveiwSourceSearchDiv").html(" ");
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
function getReviewsPerPage(begin, end){
	var sublist = [];
	for(var i=begin;i<end;i++){
		sublist.push(reviewList[i]);
	}
	$('#reviewDetailsForSource').html('');
	for(var i=0;i<sublist.length;i++){
		if(sublist[i]!=undefined){
		var html = "";
		html += '<div class="col-xs-12 SingleReviewList">';
		html += '<div data-reviewid="'+sublist[i].id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
		for (var p = 0; p < sentimentPolarityList.length; p++) {
			if (parseInt(sublist[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
					&& parseInt(sublist[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
					&& sentimentPolarityList[p].sentimentName == "positive") {
				html += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ sublist[i].repufactorScore.toFixed(2)
						+ '%</span> </div>';
				break;
			}
			if (parseInt(sublist[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
					&& parseInt(sublist[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
					&& sentimentPolarityList[p].sentimentName == "neutral") {
				html += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ sublist[i].repufactorScore.toFixed(2)
						+ '%</span> </div>';
				break;
			}
			if (parseInt(sublist[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
					&& parseInt(sublist[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
					&& sentimentPolarityList[p].sentimentName == "negative") {
				html += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ sublist[i].repufactorScore.toFixed(2)
						+ '%</span> </div>';
				break;
			}
		}
		html += '<div class="reviewDetails row">';
		html += '<div class="reviewSource">'+sublist[i].sourceName+'</div>';
		html += '<div class="reviewerName">by <span>'+sublist[i].reviewerName+'</span></div>';
		if(sublist[i].reviewLocation!=null){
			html += '<div class="reviewerDetail">from <span>'+sublist[i].reviewLocation+'</span></div>';
		}else{
			html += '<div class="reviewerDetail">from <span>NA</span></div>';
		}
		html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
		html += '</span> '+moment(sublist[i].reviewTime).format("DD MMMM YYYY");
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';																
		html+='<div style="float:right;">';
		html += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+ sublist[i].id + ')" /> ';
		html+='</div>';
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
		if(sublist[i].reviewTitle!=null){
			html += '<h3 class="SingleReviewHeader">'+sublist[i].reviewTitle+'</h3>';
		}else {
			html += '<h3 class="SingleReviewHeader"></h3>';
		}
		html += '<p>'+sublist[i].highlightedReviewContent+'</p>';
		
		if(sublist[i].highlightedReviewContent!=null && sublist[i].highlightedReviewContent!="" && sublist[i].reviewLanguage!="Unknown" && sublist[i].reviewLanguage!="N/A" && sublist[i].reviewLanguage!=null && sublist[i].reviewLanguage!="" && sublist[i].reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
			//original review
			html += '<p id="originalReview_'+sublist[i].id+'" style="display:none">' + sublist[i].reviewContent + '</p>';
		}
		
		
		/*html += '<div class="SourceRating col-xs-12">';
		html += '<span>Source Rating </span><span data-review-rating="'
				+ sublist[i].reviewOverallRating
				+ '" data-maximum-rating="'
				+ sublist[i].maxOverallRating
				+ '" class="stars">'
				+ sublist[i].reviewOverallRating
				+ '</span><span>'
				+ sublist[i].reviewOverallRating
				+ '/'
				+ sublist[i].maxOverallRating + '</span>';
				
		if(sublist[i].highlightedReviewContent!=null && sublist[i].highlightedReviewContent!="" && sublist[i].reviewLanguage!="Unknown" && sublist[i].reviewLanguage!="N/A" && sublist[i].reviewLanguage!=null && sublist[i].reviewLanguage!="" && sublist[i].reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
			html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+sublist[i].id+')" href="javascript:void(0)">Original Review</a></span>';
		}
		
		html += '</div>';*/
		
		// star review rating from Review content site table
		if(sublist[i].sourceName.toLowerCase()=="tripadvisor" && sublist[i].fromApi==true){
				 html += '<div class="SourceRating col-xs-12">';
					html += '<span>Source Rating </span><span data-review-rating="'
							+ sublist[i].reviewOverallRating
							+ '" data-maximum-rating="'
							+ sublist[i].maxOverallRating
							+ '" class="starsTA">'
							+ sublist[i].reviewOverallRating
							+ '</span><span style="margin-left:5px; margin-right:35px;">'
							+ sublist[i].reviewOverallRating
							+ '/'
							+ sublist[i].maxOverallRating + '</span>'
							
							+ '<span><a target="_blank" href='+sublist[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
							
							if(sublist[i].highlightedReviewContent!=null && sublist[i].highlightedReviewContent!="" && sublist[i].reviewLanguage!="Unknown" && sublist[i].reviewLanguage!="N/A" && sublist[i].reviewLanguage!=null && sublist[i].reviewLanguage!="" && sublist[i].reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
								html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+sublist[i].id+')" href="javascript:void(0)">Original Review</a></span>';
							}
			
							/*if(sublist[i].respondStatus==true){
								html += '<span style="float:right;color:red;"><a onclick="getResponds('+sublist[i].id+')" href="#">Replied To Review</a></span>';
							}else{
								html += '<span id="repliedToReview_'+sublist[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+sublist[i].id+')" href="#">Replied To Review</a></span>';
							}*/
							
				html += '</div>';
		}else{
			if(sublist[i].sourceName.toLowerCase()=="holidayiq" && sublist[i].fromApi==true){
				html += '<div class="SourceRating col-xs-12">';
					html += '<span>Source Rating </span><span data-review-rating="'
							+ sublist[i].reviewOverallRating
							+ '" data-maximum-rating="'
							+ sublist[i].maxOverallRating
							+ '" class="starsHIQ">'
							+ sublist[i].reviewOverallRating
							+ '</span><span style="margin-left:5px; margin-right:35px;">'
							+ sublist[i].reviewOverallRating
							+ '/'
							+ sublist[i].maxOverallRating + '</span>'
							
							+ '<span><a target="_blank" href='+sublist[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
							
							if(sublist[i].highlightedReviewContent!=null && sublist[i].highlightedReviewContent!="" && sublist[i].reviewLanguage!="Unknown" && sublist[i].reviewLanguage!="N/A" && sublist[i].reviewLanguage!=null && sublist[i].reviewLanguage!="" && sublist[i].reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
								html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+sublist[i].id+')" href="javascript:void(0)">Original Review</a></span>';
							}
			
							/*if(sublist[i].respondStatus==true){
								html += '<span style="float:right;color:red;"><a onclick="getResponds('+sublist[i].id+')" href="#">Replied To Review</a></span>';
							}else{
								html += '<span id="repliedToReview_'+sublist[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+sublist[i].id+')" href="#">Replied To Review</a></span>';
							}*/
				html += '</div>';
			}else{
					html += '<div class="SourceRating col-xs-12">';
							html += '<span>Source Rating </span><span data-review-rating="'
									+ sublist[i].reviewOverallRating
									+ '" data-maximum-rating="'
									+ sublist[i].maxOverallRating
									+ '" class="stars">'
									+ sublist[i].reviewOverallRating
									+ '</span><span>'
									+ sublist[i].reviewOverallRating
									+ '/'
									+ sublist[i].maxOverallRating + '</span>';
									
									if(sublist[i].highlightedReviewContent!=null && sublist[i].highlightedReviewContent!="" && sublist[i].reviewLanguage!="Unknown" && sublist[i].reviewLanguage!="N/A" && sublist[i].reviewLanguage!=null && sublist[i].reviewLanguage!="" && sublist[i].reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
										html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+sublist[i].id+')" href="javascript:void(0)">Original Review</a></span>';
									}
					
									/*if(sublist[i].respondStatus==true){
										html += '<span style="float:right;color:red;"><a onclick="getResponds('+sublist[i].id+')" href="#">Replied To Review</a></span>';
									}else{
										html += '<span id="repliedToReview_'+sublist[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+sublist[i].id+')" href="#">Replied To Review</a></span>';
									}*/
									html += '</div>';
				}
		}
		
		/*html += '<div class="SourceKPIRating col-xs-12">';
		for (var h = 0; h < sublist[i].kpiIndustryMasterUiList.length; h++) {
			html += '<div class="KPIRating col-xs-4">'
					+ sublist[i].kpiIndustryMasterUiList[h].kpiSourceName
					+ ' <span> '
					+ sublist[i].kpiIndustryMasterUiList[h].sourceKpiScore
					+ '/'
					+ sublist[i].kpiIndustryMasterUiList[h].maxRatingValue
					+ '</span></div>';
		}
		html += '</div>';*/
		html += '<div class="SourceKPIRating col-xs-12">';
		for (var h = 0; h < sublist[i].kpiIndustryMasterUiList.length; h++) {
			html += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
				 + sublist[i].kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
					
			if(sublist[i].sourceName.toLowerCase()=="tripadvisor" && sublist[i].fromApi==true){
				html +='<span  style="float:left;" data-review-rating="' + sublist[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + sublist[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
			}
			if(sublist[i].sourceName.toLowerCase()=="holidayiq" && sublist[i].fromApi==true){
				html +='<span  style="float:left;" data-review-rating="' + sublist[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + sublist[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
			}
			html+=' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
					+ sublist[i].kpiIndustryMasterUiList[h].sourceKpiScore
					+ '/'
					+ sublist[i].kpiIndustryMasterUiList[h].maxRatingValue
					+ '</span></div>';
		}
		html += '</div>';
		
		
		if(sublist[i].keywordList.length>0){
			html += '<div id="keywordAndScore_'+sublist[i].id+'" class="TradeReviewKpiDepartmentFactor col-xs-12 "><div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
			for (var h = 0; h < sublist[i].keywordList.length; h++) {
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						html +='<div class="KPIScore col-xs-4"><span class="PositiveSentimentCount">  '+sublist[i].keywordList[h].nlpQueryName+' </span></div>';
						break;
					}
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						html +='<div class="KPIScore col-xs-4"><span class="NeutralSentimentCount">  '+sublist[i].keywordList[h].nlpQueryName+' </span></div>';
						break;
					}
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						html +='<div class="KPIScore col-xs-4"> <span class="NegativeSentimentCount"> '+sublist[i].keywordList[h].nlpQueryName+' </span></div>';
						break;
					}
				}
			}
			html +='</div>';
		}
		$("#reviewDetailsForSource").append(html).show();
	}}
	
	if($("span.stars")!==undefined){
		$('span.stars').stars();
	}
	if($("span.starsTA")!==undefined){
		$('span.starsTA').stars();
	}
	if($("span.starsHIQ")!==undefined){
		$('span.starsHIQ').stars();
	}
	$('.ShowSemanticPolarity').click(function() {
		var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		console.log(keywordDivId+" 4");
		if($("#"+keywordDivId).hasClass("OnSeleceActive")){
	             $("#"+keywordDivId).removeClass("OnSeleceActive");
	    }else{
	           $("#"+keywordDivId).addClass("OnSeleceActive");
	    }
	});
}
function showInnerPageNextSourceFactorValues(){
	innerPageSourceFctorColumnChartStart=innerPageSourceFctorColumnChartStart+10;
	innerPageSourceFctorColumnChartEnd=innerPageSourceFctorColumnChartEnd+10;
	sorceFactorValuesInnerPageChart(innerPageSourceFctorColumnChartStart,innerPageSourceFctorColumnChartEnd);

}
function showInnerPagePreviousSourceFactorValues(){
	innerPageSourceFctorColumnChartStart=innerPageSourceFctorColumnChartStart-10;
	innerPageSourceFctorColumnChartEnd=innerPageSourceFctorColumnChartEnd-10;
	sorceFactorValuesInnerPageChart(innerPageSourceFctorColumnChartStart,innerPageSourceFctorColumnChartEnd);
}
function sorceFactorValuesInnerPageChart(innerPageSourceFctorStart,innerPageSourceFctorEnd){
	if(innerPageSourceFctorColumnChartResponse.length>0){
		var sourcePolarityList = new Array();
		var sourcePolarityDateList = new Array();
		var sourceFactorList = new Array();
		var sourceName='';
		for(var i=0;i<innerPageSourceFctorColumnChartResponse.length;i++){
			sourcePolarityList.push(innerPageSourceFctorColumnChartResponse[i].polarityCounts);
			sourcePolarityDateList.push(innerPageSourceFctorColumnChartResponse[i].date);
			sourceFactorList.push(innerPageSourceFctorColumnChartResponse[i].sourceFactor);
			sourceName = innerPageSourceFctorColumnChartResponse[0].sourceName;
		} 
		sourcePolarityList = sourcePolarityList.slice(innerPageSourceFctorColumnChartStart, innerPageSourceFctorColumnChartEnd);
		sourcePolarityDateList = sourcePolarityDateList.slice(innerPageSourceFctorColumnChartStart, innerPageSourceFctorColumnChartEnd);
		sourceFactorList = sourceFactorList.slice(innerPageSourceFctorColumnChartStart, innerPageSourceFctorColumnChartEnd);
		if(innerPageSourceFctorColumnChartEnd>=innerPageSourceFctorColumnChartResponse.length){
			$('#innerPageSourceFacotorColumnChartNext').prop('disabled',true);
		}else{
			$('#innerPageSourceFacotorColumnChartNext').prop('disabled',false);
		}
		
		if(innerPageSourceFctorColumnChartStart<=0){
			$('#innerPageSourceFacotorColumnChartPrevious').prop('disabled',true);
		}else{
			$('#innerPageSourceFacotorColumnChartPrevious').prop('disabled',false);

		}
		SourceFactorColumnStackChart(sourcePolarityList,sourcePolarityDateList,sourceFactorList,sourceName);
	}
}
function showInnerPageNextSocialSourceValues(){
	innerPageSocialSourcesStart=innerPageSocialSourcesStart+10;
	innerPageSocialSourcesEnd=innerPageSocialSourcesEnd+10;
	socialMediaSourcesInnerPageChart(innerPageSocialSourcesStart,innerPageSocialSourcesEnd);

}
function showInnerPagePreviousSocialSourceValues(){
	innerPageSocialSourcesStart=innerPageSocialSourcesStart-10;
	innerPageSocialSourcesEnd=innerPageSocialSourcesEnd-10;
	socialMediaSourcesInnerPageChart(innerPageSocialSourcesStart,innerPageSocialSourcesEnd);
}
var stoppedTyping;
function innerPageReviewSearch(){
	if (stoppedTyping) clearTimeout(stoppedTyping);
	stoppedTyping = setTimeout(function(){
		
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		$('#leftNavigation,#wrapper,#header').unmask();	
		
		var searchKey = $("#innerPageReviewSearch").val();
		if ($.trim(searchKey) == "" || searchKey == null) {
			searchKey="";
		}
		var response;
		var resultListReviews = [];
		if(innerPageReviewFilterResponse==null){
			response = JSON.parse(JSON.stringify(reviewList));
			for (var i = 0;i<response.length; i++) {
				var item = response[i];
				if (item.highlightedReviewContent == null)
					item.highlightedReviewContent = "";
				if (item.reviewTitle == null)
					item.reviewTitle = "";
				if (searchKey!="" && ( item.highlightedReviewContent.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.highlightedReviewContent = item.highlightedReviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.reviewTitle = item.reviewTitle.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					resultListReviews.push(item);
				}else{
					if(searchKey==""){
						resultListReviews.push(item);
					}
				}
			}
		}else{
			response = JSON.parse(JSON.stringify(innerPageReviewFilterResponse));
			for (var i = 0;i<response.length; i++) {
				var item = response[i];
				if (item.highlightedReviewContent == null)
					item.highlightedReviewContent = "";
				if (item.reviewTitle == null)
					item.reviewTitle = "";
				if (searchKey!="" && ( item.highlightedReviewContent.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.highlightedReviewContent = item.highlightedReviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.title = item.reviewTitle.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					resultListReviews.push(item);
				}else{
					if(searchKey==""){
						resultListReviews.push(item);
					}
				}
			}
		}
		var successObjectTemp = resultListReviews;
		response = successObjectTemp;
		var totalReviews = response;
		var noOfPages = 0;
		if (totalReviews.length % 5 == 0
				&& totalReviews.length > 0) {
			noOfPages = totalReviews.length / 5;
		} else {
			noOfPages = (totalReviews.length / 5) + 1;
		}
		begin = 0;
		end = 5;
		if (end > totalReviews.legth) {
			end = totalReviews.length;
		}

		$('#page-selection')
				.bootpag({
					total : noOfPages,
					page: 1,
			        maxVisible: 5
				}).on("page",function(event,num) {
							begin = ((num - 1) * 5);
							end = (num) * 5;
							if (end > totalReviews.legth) {
								end = totalReviews.length;
							}
							var successObject = response.slice(begin, end);
							
							var response2 = successObject;

							var tempHtml = listsearchedReviewsResponse(
									response2, searchText);
							console.log(response2);
							$('#reviewDetailsForSource').append(tempHtml);
							if($("span.stars")!==undefined){
								$('span.stars').stars();
							}
							if($("span.starsTA")!==undefined){
								$('span.starsTA').stars();
							}
							if($("span.starsHIQ")!==undefined){
								$('span.starsHIQ').stars();
							}
							
							$('.ShowSemanticPolarity').click(function() {
								var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
								console.log(keywordDivId+" 2");
								if($("#"+keywordDivId).hasClass("OnSeleceActive")){
							             $("#"+keywordDivId).removeClass("OnSeleceActive");
							    }else{
							           $("#"+keywordDivId).addClass("OnSeleceActive");
							    }
							});
							
			});
		
		var successObject = response.slice(0,5);
		var response2 = successObject;
		var tempHtml = listsearchedReviewsResponse(response2, searchText);
		$('#reviewDetailsForSource').append(tempHtml);
		
		$('.ShowSemanticPolarity').click(function() {
			var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
			console.log(keywordDivId+" 1");
			if($("#"+keywordDivId).hasClass("OnSeleceActive")){
		             $("#"+keywordDivId).removeClass("OnSeleceActive");
		    }else{
		           $("#"+keywordDivId).addClass("OnSeleceActive");
		    }
		});
		if($("span.stars")!==undefined){
			$('span.stars').stars();
		}
		if($("span.starsTA")!==undefined){
			$('span.starsTA').stars();
		}
		if($("span.starsHIQ")!==undefined){
			$('span.starsHIQ').stars();
		}
	},300);
}

function listsearchedReviewsResponse(resultListReviews, searchText) {
	$('#reviewDetailsForSource').html('');
	var html = "";
	if (resultListReviews.length > 0) {
		for (var j = 0; j < resultListReviews.length; j++) {
			var title = "";
			var content = "";
			title = resultListReviews[j].reviewTitle;
			content = resultListReviews[j].highlightedReviewContent;
			html += '<div class="col-xs-12 SingleReviewList">';
			html += '<div data-reviewid="'+resultListReviews[j].id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
			for (var p = 0; p < sentimentPolarityList.length; p++) {
				if (parseInt(resultListReviews[j].repufactorScore) >= sentimentPolarityList[p].minPercentage
						&& parseInt(resultListReviews[j].repufactorScore) <= sentimentPolarityList[p].maxPercentage
						&& sentimentPolarityList[p].sentimentName == "positive") {
					html += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
							+ resultListReviews[j].repufactorScore.toFixed(2)
							+ '%</span> </div>';
					break;
				}
				if (parseInt(resultListReviews[j].repufactorScore) >= sentimentPolarityList[p].minPercentage
						&& parseInt(resultListReviews[j].repufactorScore) <= sentimentPolarityList[p].maxPercentage
						&& sentimentPolarityList[p].sentimentName == "neutral") {
					html += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
							+ resultListReviews[j].repufactorScore.toFixed(2)
							+ '%</span> </div>';
					break;
				}
				if (parseInt(resultListReviews[j].repufactorScore) >= sentimentPolarityList[p].minPercentage
						&& parseInt(resultListReviews[j].repufactorScore) <= sentimentPolarityList[p].maxPercentage
						&& sentimentPolarityList[p].sentimentName == "negative") {
					html += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
							+ resultListReviews[j].repufactorScore.toFixed(2)
							+ '%</span> </div>';
					break;
				}
			}
			html += '<div class="reviewDetails row">';
			html += '<div class="reviewSource">'+resultListReviews[j].sourceName+'</div>';
			html += '<div class="reviewerName">by <span>'+resultListReviews[j].reviewerName+'</span></div>';
			if(resultListReviews[j].reviewLocation!=null){
				html += '<div class="reviewerDetail">from <span>'+resultListReviews[j].reviewLocation+'</span></div>';
			}else{
				html += '<div class="reviewerDetail">from <span>NA</span></div>';
			}
			html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
			html += '</span> '+moment(resultListReviews[j].reviewTime).format("DD MMMM YYYY");
			html += '</div>';
			html += '</div>';
			html += '</div>';
			
			//shravan
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';																
			html+='<div style="float:right;">';
			html += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+resultListReviews[j].id+')" /> ';
			html+='</div>';
			html+='</div>';
			
			
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			if(title!=null){
				html += '<h3 class="SingleReviewHeader">'+title+'</h3>';
			}else {
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
			html += '<p>'+content+'</p>';
			if(content!=null && content!="" && resultListReviews[j].reviewLanguage!="Unknown" && resultListReviews[j].reviewLanguage!="N/A" && resultListReviews[j].reviewLanguage!=null && resultListReviews[j].reviewLanguage!="" && resultListReviews[j].reviewLanguage.toUpperCase()!="ENGLISH" && resultListReviews[j].reviewLanguage.toUpperCase()!="EN"){
				//original review
				html += '<p id="originalReview_'+resultListReviews[j].id+'" style="display:none">' + resultListReviews[j].reviewContent + '</p>';
			}
			
			/*html += '<div class="SourceRating col-xs-12">';
			html += '<span>Source Rating </span><span data-review-rating="'
					+ resultListReviews[j].reviewOverallRating
					+ '" data-maximum-rating="'
					+ resultListReviews[j].maxOverallRating
					+ '" class="stars">'
					+ resultListReviews[j].reviewOverallRating
					+ '</span><span>'
					+ resultListReviews[j].reviewOverallRating
					+ '/'
					+ resultListReviews[j].maxOverallRating + '</span>';
				
			if(content!=null && content!="" &&  resultListReviews[j].reviewLanguage!="Unknown" && resultListReviews[j].reviewLanguage!="N/A" && resultListReviews[j].reviewLanguage!=null && resultListReviews[j].reviewLanguage!="" && resultListReviews[j].reviewLanguage.toUpperCase()!="ENGLISH" && resultListReviews[j].reviewLanguage.toUpperCase()!="EN"){
				html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+resultListReviews[j].id+')" href="javascript:void(0)">Original Review</a></span>';
			}
			
			html += '</div>';*/
			// star review rating from Review content site table
			if(resultListReviews[j].sourceName.toLowerCase()=="tripadvisor" && resultListReviews[j].fromApi==true){
					 html += '<div class="SourceRating col-xs-12">';
						html += '<span>Source Rating </span><span data-review-rating="'
								+ resultListReviews[j].reviewOverallRating
								+ '" data-maximum-rating="'
								+ resultListReviews[j].maxOverallRating
								+ '" class="starsTA">'
								+ resultListReviews[j].reviewOverallRating
								+ '</span><span style="margin-left:5px; margin-right:35px;">'
								+ resultListReviews[j].reviewOverallRating
								+ '/'
								+ resultListReviews[j].maxOverallRating + '</span>'
								
								+ '<span><a target="_blank" href='+resultListReviews[j].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
								
								if(resultListReviews[j].highlightedReviewContent!=null && resultListReviews[j].highlightedReviewContent!="" && resultListReviews[j].reviewLanguage!="Unknown" && resultListReviews[j].reviewLanguage!="N/A" && resultListReviews[j].reviewLanguage!=null && resultListReviews[j].reviewLanguage!="" && resultListReviews[j].reviewLanguage.toUpperCase()!="ENGLISH" && resultListReviews[j].reviewLanguage.toUpperCase()!="EN"){
									html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+resultListReviews[j].id+')" href="javascript:void(0)">Original Review</a></span>';
								}
				
								/*if(resultListReviews[j].respondStatus==true){
									html += '<span style="float:right;color:red;"><a onclick="getResponds('+resultListReviews[j].id+')" href="#">Replied To Review</a></span>';
								}else{
									html += '<span id="repliedToReview_'+resultListReviews[j].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+resultListReviews[j].id+')" href="#">Replied To Review</a></span>';
								}*/
					html += '</div>';
			}else{
				if(resultListReviews[j].sourceName.toLowerCase()=="holidayiq" && resultListReviews[j].fromApi==true){
					html += '<div class="SourceRating col-xs-12">';
						html += '<span>Source Rating </span><span data-review-rating="'
								+ resultListReviews[j].reviewOverallRating
								+ '" data-maximum-rating="'
								+ resultListReviews[j].maxOverallRating
								+ '" class="starsHIQ">'
								+ resultListReviews[j].reviewOverallRating
								+ '</span><span style="margin-left:5px; margin-right:35px;">'
								+ resultListReviews[j].reviewOverallRating
								+ '/'
								+ resultListReviews[j].maxOverallRating + '</span>'
								
								+ '<span><a target="_blank" href='+resultListReviews[j].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
								
								if(resultListReviews[j].highlightedReviewContent!=null && resultListReviews[j].highlightedReviewContent!="" && resultListReviews[j].reviewLanguage!="Unknown" && resultListReviews[j].reviewLanguage!="N/A" && resultListReviews[j].reviewLanguage!=null && resultListReviews[j].reviewLanguage!="" && resultListReviews[j].reviewLanguage.toUpperCase()!="ENGLISH" && resultListReviews[j].reviewLanguage.toUpperCase()!="EN"){
									html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+resultListReviews[j].id+')" href="javascript:void(0)">Original Review</a></span>';
								}
				
								/*if(resultListReviews[j].respondStatus==true){
									html += '<span style="float:right;color:red;"><a onclick="getResponds('+resultListReviews[j].id+')" href="#">Replied To Review</a></span>';
								}else{
									html += '<span id="repliedToReview_'+resultListReviews[j].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+resultListReviews[j].id+')" href="#">Replied To Review</a></span>';
								}*/
					html += '</div>';
				}else{
						html += '<div class="SourceRating col-xs-12">';
								html += '<span>Source Rating </span><span data-review-rating="'
										+ resultListReviews[j].reviewOverallRating
										+ '" data-maximum-rating="'
										+ resultListReviews[j].maxOverallRating
										+ '" class="stars">'
										+ resultListReviews[j].reviewOverallRating
										+ '</span><span>'
										+ resultListReviews[j].reviewOverallRating
										+ '/'
										+ resultListReviews[j].maxOverallRating + '</span>';
										
										if(resultListReviews[j].highlightedReviewContent!=null && resultListReviews[j].highlightedReviewContent!="" && resultListReviews[j].reviewLanguage!="Unknown" && resultListReviews[j].reviewLanguage!="N/A" && resultListReviews[j].reviewLanguage!=null && resultListReviews[j].reviewLanguage!="" && resultListReviews[j].reviewLanguage.toUpperCase()!="ENGLISH" && resultListReviews[j].reviewLanguage.toUpperCase()!="EN"){
											html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+resultListReviews[j].id+')" href="javascript:void(0)">Original Review</a></span>';
										}
						
										/*if(resultListReviews[j].respondStatus==true){
											html += '<span style="float:right;color:red;"><a onclick="getResponds('+resultListReviews[j].id+')" href="#">Replied To Review</a></span>';
										}else{
											html += '<span id="repliedToReview_'+resultListReviews[j].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+resultListReviews[j].id+')" href="#">Replied To Review</a></span>';
										}*/
										html += '</div>';
					}
			}
			
			/*html += '<div class="SourceKPIRating col-xs-12">';
			for (var h = 0; h < resultListReviews[j].kpiIndustryMasterUiList.length; h++) {
				html += '<div class="KPIRating col-xs-4">'
						+ resultListReviews[j].kpiIndustryMasterUiList[h].kpiSourceName
						+ ' <span> '
						+ resultListReviews[j].kpiIndustryMasterUiList[h].sourceKpiScore
						+ '/'
						+ resultListReviews[j].kpiIndustryMasterUiList[h].maxRatingValue
						+ '</span></div>';
			}
			html += '</div>';*/
			html += '<div class="SourceKPIRating col-xs-12">';
			for (var h = 0; h < resultListReviews[j].kpiIndustryMasterUiList.length; h++) {
				html += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
					 + resultListReviews[j].kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
						
				if(resultListReviews[j].sourceName.toLowerCase()=="tripadvisor" && resultListReviews[j].fromApi==true){
					html +='<span  style="float:left;" data-review-rating="' + resultListReviews[j].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + resultListReviews[j].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
				}
				if(resultListReviews[j].sourceName.toLowerCase()=="holidayiq" && resultListReviews[j].fromApi==true){
					html +='<span  style="float:left;" data-review-rating="' + resultListReviews[j].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + resultListReviews[j].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
				}
				html+=' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
						+ resultListReviews[j].kpiIndustryMasterUiList[h].sourceKpiScore
						+ '/'
						+ resultListReviews[j].kpiIndustryMasterUiList[h].maxRatingValue
						+ '</span></div>';
			}
			html += '</div>';
			
			if(resultListReviews[j].keywordList.length>0){
				html += '<div id="keywordAndScore_'+resultListReviews[j].id+'" class="TradeReviewKpiDepartmentFactor col-xs-12"><div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
				for (var h = 0; h < resultListReviews[j].keywordList.length; h++) {
					for (var p = 0; p < sentimentPolarityList.length; p++) {
						if (parseInt(resultListReviews[j].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(resultListReviews[j].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "positive") {
							html +='<div class="KPIScore col-xs-4"> <span class="PositiveSentimentCount"> '+resultListReviews[j].keywordList[h].nlpQueryName+' </span></div>';
							break;
						}
						if (parseInt(resultListReviews[j].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(resultListReviews[j].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "neutral") {
							html +='<div class="KPIScore col-xs-4">  <span class="NeutralSentimentCount">'+resultListReviews[j].keywordList[h].nlpQueryName+'</span></div>';
							break;
						}
						if (parseInt(resultListReviews[j].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(resultListReviews[j].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "negative") {
							html +='<div class="KPIScore col-xs-4">  <span class="NegativeSentimentCount">'+resultListReviews[j].keywordList[h].nlpQueryName+'</span></div>';
							break;
						}
					}
				}
				html +='</div>';
			}
			html += '</div>';
			html += '</div>';
		} 
		$('#reviewDetailsForSource').empty();
	}else {
		html += '<font style="color:red">No Reviews Found </font>';
		$('#page-selection').html(" ");
	}
	return html;
}
function highlightReviesSearchText(searchText,highlightedSearchText){
	var term = searchText;
	term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
	var pattern = new RegExp("("+term+")", "gi");
	highlightedSearchText = highlightedSearchText.replace(pattern, "<mark>$1</mark>");
	highlightedSearchText = highlightedSearchText.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
	return highlightedSearchText;
}
function showSourceinnerPageReviewVolumeNextValues(){
	innerPageReviewVolumeColumnChartStart=innerPageReviewVolumeColumnChartStart+10;
	innerPageReviewVolumeColimnChartEnd=innerPageReviewVolumeColimnChartEnd+10;
	innerPageReviewVolumeChart(innerPageReviewVolumeColumnChartStart,innerPageReviewVolumeColimnChartEnd);
}
function showSourceinnerPageReviewVolumePreviousValues(){
	innerPageReviewVolumeColumnChartStart=innerPageReviewVolumeColumnChartStart-10;
	innerPageReviewVolumeColimnChartEnd=innerPageReviewVolumeColimnChartEnd-10;
	innerPageReviewVolumeChart(innerPageReviewVolumeColumnChartStart,innerPageReviewVolumeColimnChartEnd);
}
function innerPageReviewVolumeChart(innerPageReviewVolumeStart,innerPageReviewVolumeEnd){
	if(innerPageReviewVolumeColumnChartResponse.length>0){
		var totalReviews = $('#sourceReviews').val();
		//var chartData = new Array();
		var dateList = new Array();
		var reviewVolumeList = new Array();
		var sourceVolumeList = new Array();
		for(var i=0;i<innerPageReviewVolumeColumnChartResponse.length;i++){
			$.each(innerPageReviewVolumeColumnChartResponse[i], function( date, volume){
				if(volume>0){
					//chartData.push([date, volume]);
					dateList.push(moment(date).format("MMM YY"));
					reviewVolumeList.push(volume);
					var percentage = parseFloat((volume/totalReviews)*100);
					sourceVolumeList.push(percentage);
				}
			});
		} 
		dateList = dateList.slice(innerPageReviewVolumeStart,innerPageReviewVolumeEnd);
		reviewVolumeList = reviewVolumeList.slice(innerPageReviewVolumeStart,innerPageReviewVolumeEnd);
		sourceVolumeList = sourceVolumeList.slice(innerPageReviewVolumeStart,innerPageReviewVolumeEnd);
		
		if(innerPageReviewVolumeEnd>=innerPageReviewVolumeColumnChartResponse.length){
			$('#sourceInnerPageReviewVolumeColumnChartNext').prop('disabled',true);
		}else{
			$('#sourceInnerPageReviewVolumeColumnChartNext').prop('disabled',false);
		}
		
		if(innerPageReviewVolumeStart<=0){
			$('#sourceInnerPageReviewVolumeColumnChartPrevious').prop('disabled',true);
		}else{
			$('#sourceInnerPageReviewVolumeColumnChartPrevious').prop('disabled',false);

		}
		SourceVolumeInnerPageCountChart(dateList,reviewVolumeList,sourceVolumeList,tradeSource);
	}
}
function getSentimentPolarityList(){
	$.ajax({
		type : "GET",
		url : "../sentimentPolarityConfig/list.htm",
		contentType : "application/json",
		success : function(response) {
			sentimentPolarityList = response.successObject.sentimentPolarityList;
		},
		error : function(response) {
			return false;
		}
	});
}

function showTotalReferences(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$("#positiveCountInnerPageSourceFactor").html(" ");
	$("#negativeCountInnerPageSourceFactor").html(" ");
	$("#neutralCountInnerPageSourceFactor").html(" ");
	$("#positivePercentageInnerPageSourceFactor").html(" ");
	$("#neutralPercentagInnerPageSourceFactore").html(" ");
	$("#negativePercentageInnerPageSourceFactor").html(" ");
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
		//var negativePercentage=0.0;
		positeivePercentage = (positive/totalReferences)*100;
		neutralPercentage = (neutral/totalReferences)*100;
		negativePercentage = (negative/totalReferences)*100;
		//$("#totalReferencesCount").text(totalReferences);
		$("#positiveCountInnerPageSourceFactor").text(positive);
		$("#negativeCountInnerPageSourceFactor").text(negative);
		$("#neutralCountInnerPageSourceFactor").text(neutral);
		$("#positivePercentageInnerPageSourceFactor").text(Math.round(positeivePercentage)+'%');
		$("#neutralPercentagInnerPageSourceFactore").text(Math.round(neutralPercentage)+'%');
		var positeivePercentageRoundedVal = Math.round(positeivePercentage);
		var neutralPercentageRoundedVal = Math.round(neutralPercentage);
		var negativePercentageRoundedVal = 100-(positeivePercentageRoundedVal+neutralPercentageRoundedVal);
		$("#negativePercentageInnerPageSourceFactor").text(negativePercentageRoundedVal+'%');
		}
	});
}
function getSourceFactorWithChange(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$("#trendChngeDiv").html(" ");
	$("#innerPageSourceFactor").html(" ");
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/getSourceFactorWithChange.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId,sourceId:sourceId}),
		success:function(response){
			var change =0;
			var sourceFactor = 0.0;
			if(response.change!=null){
				change = response.change;
			}
			if(response.currentSourceFactor!=null){
				sourceFactor = response.currentSourceFactor;
			}
			$("#innerPageSourceFactor").text(sourceFactor);
			if(change>0){
				$('#trendChngeDiv').html('<span class="PositiveChangeLeftAlign">'+change+'%</span>');
			}else if(change<0){
					$('#trendChngeDiv').html('<span class="NegativeChangeLeftAlign">'+change+'%</span>');
			}else if(change==0){
					$('#trendChngeDiv').html('<span class="NoChangeLeftAlign">'+change+'%</span>');
			}
		}
	});
}
function showTotalReviews(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$("#totalReviewsInnerPage").html("");
	$.ajax({
		type:"POST",
		url:"../reviewSummary/getAllReviews.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
		$("#totalReviewsInnerPage").text(response);
		}
	});

}
/**********************Start of Nitesh******************/
var reviewForViewDetail;
var restoreHotelReviewsDivIdHtml = '';
var restoreFilterBarHtml='';
function viewDetails(reviewId) {
	$("#sourceFactorInnerPageViewDetailsDiv").hide();
	$("#sourceFactorInnerPageReviewVolumeDiv").hide();
	$("#sourceFactorInnerPageHeaderDiv").hide();
	$("#sourceFactorInnerPageBredcrumb").hide();
	$("#reveiwSourceSearchDiv").hide();
	$("#lineSeperator").removeClass("lineShadawSeperation");
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				reviewForViewDetail=response.successObject.review;
							
					
				        var htmlCode = "";
					htmlCode += '<div class="row">';
					htmlCode += '<div class="row col-xs-12 SingleReviewList" style="border:none;">';
					htmlCode += '<div data-reviewid="'+reviewForViewDetail.id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';

					for (var p = 0; p < sentimentPolarityList.length; p++) {
								if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
										&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "positive") {
							htmlCode += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
											+ reviewForViewDetail.repufactorScore
													.toFixed(2) + '%</span> </div>';
							break;
						}
								if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
										&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "neutral") {
							htmlCode += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
											+ reviewForViewDetail.repufactorScore
													.toFixed(2) + '%</span> </div>';
							break;
						}
								if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
										&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "negative") {
							htmlCode += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
											+ reviewForViewDetail.repufactorScore
													.toFixed(2) + '%</span> </div>';
							break;
						}
					}
					htmlCode += '<div class="reviewDetails row">';
							htmlCode += '<div class="reviewSource">'
									+ reviewForViewDetail.sourceName + '</div>';
					htmlCode += '<div class="reviewerName">by <span>';
							if (reviewForViewDetail.reviewerName != null
									|| $.trim(reviewForViewDetail.reviewerName) == ""
									|| $.trim(reviewForViewDetail.reviewerName)
											.indexOf('\"\"') != -1) {
								htmlCode += '' + reviewForViewDetail.reviewerName
										+ '';
						}else{
							htmlCode+= 'Not Available';
						}
					htmlCode+= '</span></div>';
					htmlCode += '<div class="reviewerDetail">from <span>';
							if (reviewForViewDetail.reviewLocation == null
									|| reviewForViewDetail.reviewLocation == "") {
						htmlCode += ' Not Available </span></div>';
							} else {
								htmlCode += '' + reviewForViewDetail.reviewLocation
										+ '</span></div>';
					}
					htmlCode += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
							htmlCode += '</span>'+ moment(reviewForViewDetail.reviewTime).format("DD MMMM YYYY") + '</span>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';

					if(reviewForViewDetail.reviewTitle!=null){
								htmlCode += '<h3 class="SingleReviewHeader">'
										+ reviewForViewDetail.reviewTitle + '</h3>';
					}
					htmlCode += '<p>';
					htmlCode += reviewForViewDetail.highlightedReviewContent;
					htmlCode += '</p>';
					
							if(reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
						//original review
						htmlCode += '<p id="originalReview_'+reviewForViewDetail.id+'" style="display:none">' + reviewForViewDetail.reviewContent + '</p>';
					}
							if(reviewForViewDetail.sourceName.toLowerCase()=="tripadvisor" && reviewForViewDetail.fromApi==true){
					htmlCode += '<div class="row SourceRating col-xs-12">';
							htmlCode += '<span>Source Rating </span><span data-review-rating="'
										+ reviewForViewDetail.reviewOverallRating
										+ '" data-maximum-rating="'
										+ reviewForViewDetail.maxOverallRating
										+ '" class="starsTA">'
										+ reviewForViewDetail.reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ reviewForViewDetail.reviewOverallRating
										+ '/'
											+ reviewForViewDetail.maxOverallRating
											+ '</span>'
										
										+ '<span><a target="_blank" href='+reviewForViewDetail.redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
										
											if(reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
												htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review | </a></span>';
										}
						
										if(reviewForViewDetail.respondStatus==true){
												htmlCode += '<span style="float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
										}else{
												htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
											}
											if(reviewForViewDetail.markRead==true){
												htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',false)" href="#">Mark as Unread | </a></span>';
											}else{
												htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',true)" href="#">Mark as Read | </a></span>';
											}
									
						htmlCode += '</div>';
					}else{
						if(reviewForViewDetail.sourceName.toLowerCase()=="holidayiq" && reviewForViewDetail.fromApi==true){
										htmlCode += '<div class="row SourceRating col-xs-12">';
							htmlCode += '<span>Source Rating </span><span data-review-rating="'
										+ reviewForViewDetail.reviewOverallRating
										+ '" data-maximum-rating="'
										+ reviewForViewDetail.maxOverallRating
										+ '" class="starsHIQ">'
										+ reviewForViewDetail.reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ reviewForViewDetail.reviewOverallRating
										+ '/'
												+ reviewForViewDetail.maxOverallRating
												+ '</span>'
										
												+ '<span><a target="_blank" href='+reviewForViewDetail.redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
										
												if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
													htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review | </a></span>';
										}
						
										if(reviewForViewDetail.respondStatus==true){
													htmlCode += '<span style="float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
										}else{
													htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
												}
												if(reviewForViewDetail.markRead==true){
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',false)" href="#">Mark as Unread | </a></span>';
												}else{
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',true)" href="#">Mark as Read | </a></span>';
												}
										
						htmlCode += '</div>';
						}else{
												htmlCode += '<div class="row SourceRating col-xs-12">';
								htmlCode += '<span>Source Rating </span><span data-review-rating="'
												+ reviewForViewDetail.reviewOverallRating
												+ '" data-maximum-rating="'
												+ reviewForViewDetail.maxOverallRating
												+ '" class="stars">'
												+ reviewForViewDetail.reviewOverallRating
												+ '</span><span>'
												+ reviewForViewDetail.reviewOverallRating
												+ '/'
												+ reviewForViewDetail.maxOverallRating
												+ '</span>';
												
												if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
													htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review | </a></span>';
												}
								
												if(reviewForViewDetail.respondStatus==true){
													htmlCode += '<span style="float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
												}else{
													htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
												}
												if(reviewForViewDetail.markRead==true){
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',false)" href="#">Mark as Unread | </a></span>';
												}else{
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',true)" href="#">Mark as Read | </a></span>';
												}
												htmlCode += '</div>';
							}
					}
							/*htmlCode += '<div class="row SourceKPIRating col-xs-12">';
					for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
						htmlCode += '<div class="KPIRating col-xs-4">'
										+ reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName
										+ ' <span> '
										+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore
										+ '/'
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
								+ '</span></div>';
					}
							htmlCode += '</div>';*/

					htmlCode += '<div class="SourceKPIRating col-xs-12">';
					for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
						htmlCode += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
							 + reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
								
						if(reviewForViewDetail.sourceName.toLowerCase()=="tripadvisor" && reviewForViewDetail.fromApi==true){
							htmlCode +='<span  style="float:left;" data-review-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
						}
						if(reviewForViewDetail.sourceName.toLowerCase()=="holidayiq" && reviewForViewDetail.fromApi==true){
							htmlCode +='<span  style="float:left;" data-review-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
						}
						htmlCode+=' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore
								+ '/'
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
								+ '</span></div>';
					}
					htmlCode += '</div>';
							/*
							 * if(reviewForViewDetail.kpiTagSentimentAnalysisUIList.length>0){
							 * htmlCode += '<div
							 * class="TradeReviewKpiDepartmentFactor col-xs-12 "
							 * style="display:block;">' + '<div
							 * class="KPIScoreHeader SmallBoldGreyContent
							 * col-xs-12">KPI Polarity Score</div>';
							 * 
							 * 
							 * for (var h = 0; h <
							 * reviewForViewDetail.kpiTagSentimentAnalysisUIList.length;
							 * h++) { htmlCode +='<div class="KPIScore col-xs-4">
							 * '+reviewForViewDetail.kpiTagSentimentAnalysisUIList[h].kpiName+'
							 * <span
							 * class="PositiveSentimentCount">'+reviewForViewDetail.kpiTagSentimentAnalysisUIList[h].kpiFactorScore+'%</span></div>'; }
							 * 
							 * htmlCode +='</div>'; }
							 */
					if(reviewForViewDetail.keywordList.length>0){
								htmlCode += '<div id="keywordAndScore_'
										+ reviewForViewDetail.id
										+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
						for (var h = 0; h < reviewForViewDetail.keywordList.length; h++) {
							for (var p = 0; p < sentimentPolarityList.length; p++) {
										if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "positive") {
											htmlCode += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="PositiveSentimentCount"> '
													+ reviewForViewDetail.keywordList[h].nlpQueryName
													+ '</span></div>';
									break;
								}
										if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "neutral") {
											htmlCode += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="NeutralSentimentCount"> '
													+ reviewForViewDetail.keywordList[h].nlpQueryName
													+ '</span></div>';
									break;
								}
										if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "negative") {
											htmlCode += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="NegativeSentimentCount"> '
													+ reviewForViewDetail.keywordList[h].nlpQueryName
													+ '</span></div>';
									break;
								}
							}
						}
						htmlCode +='</div>';
					}
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
							/* <!------------------------------------------------------------------------------> */
							/*
					 * <!--------------------------------Share
					 * --------------------------------------->
							 */
							/* <!------------------------------------------------------------------------------> */
							/*htmlCode += '<div class="row">';
					htmlCode += '<div class="col-xs-12 ">';
					htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
					htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
							htmlCode += '<div id="shareCountSpan'
									+ reviewForViewDetail.id
									+ '"class="ShareReviewIcon" style="height: 20px; margin-top: 5px; padding-left: 25px;">Share('
									+ reviewForViewDetail.sourceMasterUIList.length
									+ ')</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="SubHeading col-xs-12">';
					htmlCode += '<div class="SmallNormalGreyContent col-xs-12">Share On:</div>';
							htmlCode += '<div id="shareDiv'
									+ reviewForViewDetail.id
							+ '" class="form-group col-xs-10 row">';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 row">';
					htmlCode += '<div class="form-group input-group col-xs-12 footerButtons">';
							htmlCode += '<button id="Save" onclick="saveShare('
									+ reviewForViewDetail.id
									+ ')" class="btn btn-primary btn-sm" type="button"> Save</button>';
							
							 * htmlCode += '<button id="Cancel" class="btn
							 * btn-default btn-sm" type="button"> Clear</button>';
							 
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>	';
							htmlCode += '</div>';*/
							/*
					 * <!------------------------------------------------------------------------------>
					 * <!-----------------------------Quick Note
					 * ------------------------------------->
					 * <!------------------------------------------------------------------------------>
							 */
					htmlCode += '<div class="row">';
					htmlCode += '<div class="col-xs-12 ">';
					htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
					htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
					htmlCode += '<div class="ReviewNoteIcon" style="height: 20px; padding-left: 25px;">Quick Note</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="SubHeading col-xs-12">';
					htmlCode += '<div style="display:none" id="notesForReviewSiteContentId_'
							+ reviewForViewDetail.id + '">';
					htmlCode += '</div>';
					htmlCode += '<p style="display:none ; color:red" class="has-error" id="errorForReviewSiteContentId_'
							+ reviewForViewDetail.id + '"></p>';
					htmlCode += '<div class="col-xs-12">';
					htmlCode += '<div class="form-group input-group col-xs-12">';
					htmlCode += '<label>Enter your note <span class="mandatoryField">*</span></label>';
					htmlCode += '<textarea id="noteForReviewSiteContentId_'
							+ reviewForViewDetail.id
							+ '" class="form-control input-sm" ></textarea>';
					htmlCode += '</div>';
					htmlCode += '<div class="row ">';
					htmlCode += '<div class="form-group col-xs-6">';
					htmlCode += '<label class="">Share with a department</label>';
					htmlCode += '<div class="">';
							htmlCode += '<select id="departmentForReviewSiteContentId_'
									+ reviewForViewDetail.id
							+ '"  class="form-control input-sm">';
							htmlCode += '<option data-email="" value="" selected disabled>Select a Department</option>';
					for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
					}
					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group col-xs-6">';
					htmlCode += '<label class="">Share via email</label>';
					htmlCode += '<div class="">';
							htmlCode += '<input id="emailForReviewSiteContentId_'+ reviewForViewDetail.id + '" class="form-control input-sm" placeholder="Enter Email Address">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<button id="Save" onclick="saveNote('
							+ reviewForViewDetail.id
							+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel" class="btn
							 * btn-default btn-sm float-right" type="button"> Clear</button>';
							 */
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
							/*
					 * <!------------------------------------------------------------------------------>
					 * <!-----------------------------Quick Note
					 * ------------------------------------->
					 * <!------------------------------------------------------------------------------>
							 */
					htmlCode += '<div class="row">';
					htmlCode += '<div class="col-xs-12 ">';
					htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
					htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
					htmlCode += '<div class="ReviewActionIcon" style="height: 20px; padding-left: 25px;">Action</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="SubHeading col-xs-12">';
					htmlCode += '<div class="panel-body row">';
					htmlCode += '<ul class="nav nav-pills">';
							/*htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" href="#Task-pills'
									+ reviewForViewDetail.id
									+ '"  data-actiontype="Task" onclick="getComments('
									+ reviewForViewDetail.id + ','
									+ $('#organizationName option:selected').val()
									+ ',this)" >';
					htmlCode += 'Assign a task';
					htmlCode += '</a>';
							htmlCode += '</li>';*/
					htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" href="#Ticket-pills'
									+ reviewForViewDetail.id
									+ '" data-actiontype="Ticket" onclick="getComments('
									+ reviewForViewDetail.id + ','
									+ $('#organizationName option:selected').val()
									+ ',this)" >';
					htmlCode += 'Raise a ticket';
					htmlCode += '</a>';
					htmlCode += '</li>';
							/*htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" href="#Notify-pills'
									+ reviewForViewDetail.id
									+ '" data-actiontype="Notify" onclick="getComments('
									+ reviewForViewDetail.id + ','
									+ $('#organizationName option:selected').val()
									+ ',this)" >';
					htmlCode += 'Notify';
					htmlCode += '</a>';
							htmlCode += '</li>';*/
					htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" style="display: none;" href="#General-pills'
									+ reviewForViewDetail.id
									+ '" data-actiontype="General" onclick="getComments('
									+ reviewForViewDetail.id
									+ ','
									+ $('#organizationName option:selected').val()
									+ ',this)">';
					htmlCode += 'General';
					htmlCode += '</a>';
					htmlCode += '</li>';
							
						/*	htmlCode += '<li class="">';
					htmlCode += '<a type="button" class="filterButton" data-toggle="modal" data-target=".RespondToReviews">Respond to reviews</a>';
							htmlCode += '</li>';*/
					
					htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" onclick="loadFlags('
									+ reviewForViewDetail.id
									+ ')" href="#Flag-pills'
									+ reviewForViewDetail.id + '">';
					htmlCode += '<span class="glyphicon glyphicon"> </span>';
					htmlCode += 'Flag' + '</a>' + '</li>';
					htmlCode += '</ul>';
							htmlCode += '<div class="Actiontitles" style="display:none" id="notesForTask_'
									+ reviewForViewDetail.id
									+ '">'
									+ '</div>'
									+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
									+ reviewForViewDetail.id
									+ '">'
									+ '</div>'
									+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
									+ reviewForViewDetail.id
									+ '">'
									+ '</div>'
									+ '<div  class="Actiontitles"style="display:none" id="notesForGeneral_'
									+ reviewForViewDetail.id + '">' + '</div>';
					htmlCode += '<div class="tab-content">';
							htmlCode += '<div id="Flag-pills'
									+ reviewForViewDetail.id
									+ '" class="row  tab-pane ">';
					htmlCode+='<div class="Actiontitles">';
						htmlCode+='<div class="col-xs-12 form-horizontal">';
							htmlCode += '<div id="flagChkDiv_'
									+ reviewForViewDetail.id
									+ '" class="form-group col-xs-10 row">';
										if ('DUPLICATE_REVIEW' in reviewForViewDetail.flags) {
											htmlCode += '<div class="col-xs-6"><label><input checked value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
													+ reviewForViewDetail.id
													+ '" type="checkbox"> Duplicate Review</label></div>';
										} else {
											htmlCode += '<div class="col-xs-6"><label><input value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
													+ reviewForViewDetail.id
													+ '" type="checkbox"> Duplicate Review</label></div>';
										}
										if ('DELETED_REVIEW' in reviewForViewDetail.flags) {
											htmlCode += '<div class="col-xs-6"><label><input checked value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
													+ reviewForViewDetail.id
													+ '" type="checkbox"> Review deleted from source</label></div>';
										} else {
											htmlCode += '<div class="col-xs-6"><label><input value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
													+ reviewForViewDetail.id
													+ '" type="checkbox"> Review deleted from source</label></div>';
										}
										if ('INCORRECT_LANGUAGE' in reviewForViewDetail.flags) {
											htmlCode += '<div class="col-xs-6"><label><input checked value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
													+ reviewForViewDetail.id
													+ '" type="checkbox"> Language not correct</label></div>';
										} else {
											htmlCode += '<div class="col-xs-6"><label><input value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
													+ reviewForViewDetail.id
													+ '" type="checkbox"> Language not correct</label></div>';
										}
										if ('OTHER' in reviewForViewDetail.flags) {
											htmlCode += '<div class="col-xs-6"><label><input checked value="OTHER" id="OTHER_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Other</label></div>';
										} else {
											htmlCode += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Other</label></div>';
										}
								htmlCode+='</div>';
								htmlCode+='<div class="form-group">';
							/*
							 * htmlCode+='<label class="col-xs-3
							 * control-label">Comment<span class="mandatoryField">*</span></label>';
							 */
								htmlCode+='<div class=" col-xs-12">';
									htmlCode+='<div class="">';
										htmlCode+='<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
										htmlCode+='</div>';
									htmlCode+='</div>';
								htmlCode+='</div>';
						htmlCode+='<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<button onclick="saveFlag('
									+ reviewForViewDetail.id
									+ ')" id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
							/*
							 * htmlCode+='<button onclick="cancelFlag(' +
							 * reviewForViewDetail.id + ')" id="Cancel" class="btn
							 * btn-default btn-sm float-right" type="button"> Cancel</button>';
							 */
						htmlCode+='</div>';
					htmlCode+='</div>';
					htmlCode+='</div>';
				htmlCode+='</div>';
							htmlCode += '<div id="Task-pills'
									+ reviewForViewDetail.id
							+ '" class="row tab-pane">';
					htmlCode += '<div class="col-xs-12 form-horizontal">';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class=" col-xs-9">';
					htmlCode += '<div class="">';
							htmlCode += '<input id="noteForTask_'
									+ reviewForViewDetail.id
							+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-4">';
					htmlCode += '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
									+ reviewForViewDetail.id
							+ '" class="form-control input-sm">';
							htmlCode += '<option data-email=""  value="" selected disabled>Select a Department</option>';
							for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
							}
					htmlCode += '</select>';
					htmlCode += '</div>';
							
							htmlCode += '<div id="employeeDivForTask_'	+ reviewForViewDetail.id + '" class="col-xs-3">';   //5
								htmlCode += '<select id="employeeForTask_'	+ reviewForViewDetail.id + '" class="form-control input-sm">';
									htmlCode += '<option value="" >Select Employee</option>';
							htmlCode += '</select>';
							htmlCode += '</div>';
							
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-9">';
					htmlCode += '<input id="datetimepickerForTask_'
							+ reviewForViewDetail.id
							+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTask('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
							htmlCode += '<div id="Ticket-pills'
									+ reviewForViewDetail.id
							+ '" class="row tab-pane fade">';
					htmlCode += '<div class="col-xs-12 form-horizontal">';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class=" col-xs-9">';
					htmlCode += '<div class="">';
							htmlCode += '<input id="noteForTicket_'
									+ reviewForViewDetail.id
							+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
							
							
					htmlCode += '<div class="form-group">';
							
							htmlCode += '<label class="col-xs-3 control-label">Priority<span class="mandatoryField">*</span></label>';
							htmlCode += '<div id="ticketPriorityDiv_' + reviewForViewDetail.id + '" class="col-xs-2">';
							htmlCode += '<select id="ticketPriorityOption_'	+ reviewForViewDetail.id + '" class="form-control input-sm">';
								htmlCode += '<option value="High" >High Priority</option>';
								htmlCode += '<option value="Medium" >Medium Priority</option>';
								htmlCode += '<option value="Low" >Low Priority</option>';
							htmlCode += '</select>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							
							
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">For</label>';
					htmlCode += '<div class="col-xs-4">';
					htmlCode += '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option data-email=""  value="" selected disabled>Select a Department</option>';
					for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
								+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
					}
					htmlCode += '</select>';
					htmlCode += '</div>';
							
							htmlCode += '<div id="employeeDivForTicket_' + reviewForViewDetail.id + '" class="col-xs-3">'; //5
								htmlCode += '<select multiple id="employeeForTicket_' + reviewForViewDetail.id + '" class="form-control input-sm employeeoption">';
									/*htmlCode += '<option value="" >Select Employee</option>';*/
					htmlCode += '</select>';
					htmlCode += '</div>';
							
							
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-9">';
					htmlCode += '<input id="datetimepickerForTicket_'
							+ reviewForViewDetail.id
							+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
					htmlCode += '</div>';
					htmlCode += '</div>';
							
							
							htmlCode +='<div id="emailForTicketDiv_'+ reviewForViewDetail.id + '" class="form-group">';
								htmlCode +='<label class="col-xs-3 control-label">Share via email<span class="mandatoryField">*</span></label>';
									htmlCode +='<div class="col-xs-9">';
										htmlCode +='<input id="emailForTicket_'	+ reviewForViewDetail.id + '" class="form-control input-sm" placeholder="Enter Email Address">';
										htmlCode +='</div>';
							htmlCode +='</div>';
							
							
							htmlCode += '<div class="form-group">';
								htmlCode += '<label class="col-xs-3 control-label">CC</label>';
									htmlCode += '<div class="col-xs-9">';
										htmlCode += '<input id="ccEmailsForTicket_'	+ reviewForViewDetail.id + '" class="form-control input-sm" placeholder="Enter CC Emails with comma seperated">';
									htmlCode += '</div>';
							htmlCode += '</div>';
							
							
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div id="Notify-pills' + reviewForViewDetail.id
							+ '" class="tab-pane fade">';
					htmlCode += '<div class="col-xs-12 form-horizontal">';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class=" col-xs-9">';
					htmlCode += '<div class="">';
							htmlCode += '<input id="noteForNotify_'
									+ reviewForViewDetail.id
							+ '"  class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-4">';
					htmlCode += '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option data-email=""  value="" selected disabled>Select a Department</option>';
					for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
								+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
					}
					htmlCode += '</select>';
					htmlCode += '</div>';
							htmlCode += '<div id="employeeDivForNotify_'
									+ reviewForViewDetail.id
							+ '" class="col-xs-5">';
							htmlCode += '<select id="employeeForNotify_'
									+ reviewForViewDetail.id
							+ '" class="form-control input-sm">';
							htmlCode += '<option value="" >Select Employee</option>';
					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-9">';
					htmlCode += '<input id="datetimepickerForNotify_'
							+ reviewForViewDetail.id
							+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotify('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div style="display: none;" id="General-pills' + reviewForViewDetail.id
							+ '" class="tab-pane fade">';
					htmlCode += '<div class="col-xs-12 form-horizontal">';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class=" col-xs-9">';
					htmlCode += '<div class="">';
							htmlCode += '<input id="noteForGeneral_'
									+ reviewForViewDetail.id
							+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-4">';
							htmlCode += '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option data-email="" value="" selected disabled>Select a Department</option>';
					for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
					}
					htmlCode += '</select>';
					htmlCode += '</div>';
							htmlCode += '<div id="employeeDivForGeneral_'
									+ reviewForViewDetail.id
							+ '" class="col-xs-5">';
							htmlCode += '<select id="employeeForGeneral_'
									+ reviewForViewDetail.id
							+ '" class="form-control input-sm">';
							htmlCode += '<option value="" >Select Employee</option>';
					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-9">';
					htmlCode += '<input id="datetimepickerForGeneral_'
							+ reviewForViewDetail.id
							+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<button id="SaveGeneral" data-actiontype="General" onclick="saveNoteForGeneral('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';

					
							
							/*******************************respond to review*****************************************/
							htmlCode += '<div class="row">';
								htmlCode += '<div class="col-xs-12 ">';
									htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
									htmlCode += '</div>';
									htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
										htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
											htmlCode += '<div class="ReplyToReview" style="height: 30px; padding-left: 25px;">Reply to review</div>';
										htmlCode += '</div>';
										htmlCode += '<div class="SubHeading col-xs-12">';
											htmlCode += '<div class="panel-body row">';
												htmlCode += '<ul class="nav nav-pills">';
													htmlCode += '<li class="">';
														htmlCode += '<a  class="filterButton" onclick="respondToDirect('+reviewForViewDetail.id+')" href="//'+reviewForViewDetail.sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
													htmlCode += '</li>';
											
													htmlCode += '<li class="">';
														htmlCode += '<a type="button" onclick="showRespondModal('+reviewForViewDetail.id+',\'reviewer\')" class="filterButton" >Direct Respond to Reviewer</a>';
													htmlCode += '</li>';
										
													htmlCode += '<li class="">';
														htmlCode += '<a type="button" class="filterButton" onclick="showRespondModal('+reviewForViewDetail.id+',\'reviewSource\')" >Respond by email to Review Source</a>';
													htmlCode += '</li>';
												htmlCode += '</ul>';
							
												htmlCode += '<div class="tab-content">';
												htmlCode += '</div>';
											htmlCode += '</div>';
										htmlCode += '</div>'; //sub head
									htmlCode += '</div>'; //con-10
								htmlCode += '</div>';//col-12
							htmlCode += '</div>';//row
							
							
							/*
					 * <!------------------------------------------------------------------------------>
					 * <!--------------------------------Broadcast
					 * --------------------------------------->
					 * <!------------------------------------------------------------------------------>
							 */
							/*htmlCode += '<div class="row">';
					htmlCode += '<div class="col-xs-12 ">';
					htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
					htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
					htmlCode += '<div class="BroadcastIcon" style="height: 35px; margin-top: 0; padding-left: 30px; padding-top: 3px;">Broadcast</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="SubHeading col-xs-12">';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<label>';
					if (reviewForViewDetail.broadcastStatus == true) {
								htmlCode += '<input type="checkbox" name="broadcastChk'
										+ reviewForViewDetail.id
										+ '" id="broadcastChk'
										+ reviewForViewDetail.id
								+ '" checked>Tag reviews to hotel website.';
					} else {
								htmlCode += '<input type="checkbox" name="broadcastChk'
										+ reviewForViewDetail.id
										+ '" id="broadcastChk'
										+ reviewForViewDetail.id
										+ '"> Tag reviews to hotel website.';
					}
					htmlCode += '</label>';
					htmlCode += '<button id="Save" onclick="saveBroadcast('
							+ reviewForViewDetail.id
									+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';*/
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeBroadcast(' + reviewForViewDetail.id+
							 * ')" class="btn btn-default btn-sm float-right"
							 * type="button"> Cancel</button>';
							 */
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
							/*
					 * <!------------------------------------------------------------------------------>
							 * <!-----------------------Respond by email to review source LightBox
					 * --------------------------->
					 * <!------------------------------------------------------------------------------>
							 */
					 
							$("#respondModal_"+ reviewForViewDetail.id).remove(); 
					if(!document.getElementById("respondModalLabel_"+ reviewForViewDetail.id)){
							htmlCode += '<div id="respondModal_'+ reviewForViewDetail.id+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
					htmlCode += '<div class="modal-dialog modal-lg">';
					htmlCode += '<div class="modal-content">';
					htmlCode += '<div class="modal-header">';
					htmlCode += '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>';
											htmlCode += '<h4 id="respondModalLabel_'+ reviewForViewDetail.id+ '" class="modal-title">Respond by email to Review Source</h4>';
											htmlCode += '<h4 id="respondsModalLabel_'+ reviewForViewDetail.id+ '" style="display:none" class="modal-title">Responds</h4>';
										htmlCode += '</div>'; //modal heaer
										
					htmlCode += '<div class="modal-body row">';
					htmlCode += '<div class="row col-xs-12 SingleReviewList">';
												htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
												for (var p = 0; p < sentimentPolarityList.length; p++) {
													if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
														htmlCode += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+ reviewForViewDetail.repufactorScore.toFixed(2) + '%</span> </div>';
														break;
													}
													if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
														htmlCode += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">' + reviewForViewDetail.repufactorScore.toFixed(2) + '%</span> </div>';
														break;
													}
													if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
														htmlCode += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+reviewForViewDetail.repufactorScore.toFixed(2) + '%</span> </div>';
														break;
													}
												}
												
												htmlCode += '<div class="reviewDetails row">';
												htmlCode += '<div class="reviewSource">' + reviewForViewDetail.sourceName
														+ '</div>';
												htmlCode += '<div class="reviewerName">by <span>';
												if (reviewForViewDetail.reviewerName != null
														|| $.trim(reviewForViewDetail.reviewerName) == ""
														|| $.trim(reviewForViewDetail.reviewerName).indexOf('\"\"') != -1) {
													htmlCode += '' + reviewForViewDetail.reviewerName + '';
												} else {
													htmlCode += 'Not Available';
												}
												htmlCode += '</span></div>';
												htmlCode += '<div class="reviewerDetail">from <span>';
												if (reviewForViewDetail.reviewLocation == null
														|| reviewForViewDetail.reviewLocation == "") {
													htmlCode += ' Not Available </span></div>';
												} else {
													htmlCode += '' + reviewForViewDetail.reviewLocation + '</span></div>';
												}
												htmlCode += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
														+ moment(reviewForViewDetail.reviewTime).format("DD MMMM YYYY")
														+ '</span>';
					htmlCode += '</div>';
												htmlCode += '</div>';
												
												
												htmlCode += '</div>'; //light blue
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
					if (reviewForViewDetail.reviewTitle != null) {
																	htmlCode += '<h3 class="SingleReviewHeader">'+ reviewForViewDetail.reviewTitle + '</h3>';
																}
																htmlCode += '<p>' + reviewForViewDetail.reviewContent+ '</p>';
																
																if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
																	//original review
																	htmlCode += '<p id="originalReview_'+reviewForViewDetail.id+'" style="display:none">' + reviewForViewDetail.reviewContent + '</p>';
																}
																
																// star review rating from Review content site table
																htmlCode += '<div class="SourceRating col-xs-12">';
																htmlCode += '<span>Source Rating </span><span data-review-rating="'
																		+ reviewForViewDetail.reviewOverallRating
																		+ '" data-maximum-rating="'
																		+ reviewForViewDetail.maxOverallRating
																		+ '" class="stars">'
																		+ reviewForViewDetail.reviewOverallRating
																		+ '</span><span>'
																		+ reviewForViewDetail.reviewOverallRating
																		+ '/'
																		+ reviewForViewDetail.maxOverallRating
																		+ '</span>';
																		
																	if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
																		htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review</a></span>';
																	}
																
																		/*if(reviewForViewDetail.respondStatus==true){
																			htmlCode += '<span  style="float:right;color:red;">Replied To Review</span>';
																		}else{
																			htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
																		}*/
																		
																		
																htmlCode += '</div>';
																
																/*	htmlCode += '<div id="sourceKPIRating'+reviewForViewDetail.id+'" class="SourceKPIRating col-xs-12">';
																for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
																	htmlCode += '<div class="KPIRating col-xs-4">'
																			+ reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName
																			+ ' <span> '
																			+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore
																			+ '/'
																			+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
																			+ '</span></div>';
																}
																htmlCode += '</div>';
																
																
																if (reviewForViewDetail.keywordList.length > 0) {
																	htmlCode += '<div id="keywordAndScoreModal_'
																			+ reviewForViewDetail.id
																			+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
																			+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
																	for (var h = 0; h < reviewForViewDetail.keywordList.length; h++) {
																		for (var p = 0; p < sentimentPolarityList.length; p++) {
																			if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "positive") {
																				htmlCode += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="PositiveSentimentCount"> '
																						+ reviewForViewDetail.keywordList[h].nlpQueryName + '</span></div>';
																				break;
																			}
																			if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "neutral") {
																				htmlCode += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="NeutralSentimentCount"> '
																						+ reviewForViewDetail.keywordList[h].nlpQueryName + '</span></div>';
																				break;
																			}
																			if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "negative") {
																				htmlCode += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="NegativeSentimentCount"> '
																						+ reviewForViewDetail.keywordList[h].nlpQueryName +'</span></div>';
																				break;
																			}
																		}
																	}
																	htmlCode += '</div>';
																}*/
																
					htmlCode += '<div class="form-group input-group col-xs-12">';
																	htmlCode += '<div class="form-group input-group col-xs-12">';
																		htmlCode += '<input type="email" id="reviewerEmail_'+reviewForViewDetail.id+'" class="form-control input-sm" placeholder="Enter Reviewer Email Address">';
																	htmlCode += '</div>';
																	htmlCode += '<textarea id="respond_'+ reviewForViewDetail.id+ '"placeholder="Enter your response here" style="width: 704px; height: 145px;" maxlength="1000" class="form-control input-sm"></textarea>';
																	htmlCode+='<span id="responds_'+ reviewForViewDetail.id + '" style="display:none"></span>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
																	htmlCode += '<div id="validationMessageDiv_'+ reviewForViewDetail.id + '" ></div>';
																		htmlCode += '<button id="save_'+ reviewForViewDetail.id+ '"  onclick="respondToReview('+ reviewForViewDetail.id+ ','	+ reviewForViewDetail.sourceId+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
																		htmlCode += '<button id="cancel_'+ reviewForViewDetail.id+ '" onclick="resetRespond('+ reviewForViewDetail.id+ ')" data-dismiss="modal" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
																		htmlCode += '<button data-dismiss="modal" id="ok_'+reviewForViewDetail.id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>';
																htmlCode += '</div>'; //form-inline col-xs-12 closed
												htmlCode += '</div>'; //col-lg-10 closed
											htmlCode += '</div>'; //SingleReviewList
										htmlCode += '</div>';//modal-body row
									htmlCode += '</div>'; //modal-content
								htmlCode += '</div>';//modal-dialog modal-lg
							htmlCode += '</div>'; //respondModal_
					}
					$('#hotelReviewsDivId').hide();
					$("#page-selection").hide();
					$("#searchBar").hide();

					restoreHotelReviewsDivIdHtml = $('#reviewDetailsForSource').html();
					restoreFilterBarHtml = $('#filterBar').html();
					

					$('#reviewDetailsForSource').html(htmlCode);
					if($("span.stars")!==undefined){
							$('span.stars').stars();
					}
				    if($("span.starsTA")!==undefined){
							$('span.starsTA').stars();
					}
					if($("span.starsHIQ")!==undefined){
							$('span.starsHIQ').stars();
					}
					
					var barHtmlCode = '<div class="row">'
							+ '<div class="col-lg-12 SubHeading SmallDarkGreyHeader">'
							+ '<span> <a onclick="restore()">Source </a></span>'
							+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
							+ '<span>Review</span>' + '</div>' + '</div>';

					$('#filterBar').html(barHtmlCode);
					$('#reviewDetailsForSource').prepend(barHtmlCode);
					$('#reviewDetailsForSource').show(600);

					getMappedSourcesForReview(reviewForViewDetail.id);
					var organizationId = $('#organizationName option:selected').val();
					getNotes(reviewForViewDetail.id, organizationId);
					// function for star
					if($("span.stars")!==undefined){
						$('span.stars').stars();
					}
					if($("span.starsTA")!==undefined){
						$('span.starsTA').stars();
					}
					if($("span.starsHIQ")!==undefined){
						$('span.starsHIQ').stars();
					}
							$('.btn-flag').click(
									function() {
						$('.active').removeClass('active');
										$('.OnSeleceActive').removeClass(
												'OnSeleceActive');
										$(this).next('.flagOptions').addClass(
												'OnSeleceActive');
					});
							$('.CancelReviewFlag').click(
									function() {
										$(this).parents('.flagOptions')
												.removeClass('OnSeleceActive');
					});
							$('.SaveReviewFlag').click(
									function() {
										$(this).parents('.flagOptions')
												.removeClass('OnSeleceActive');
					});
							$('.ShowSemanticPolarity').click(
									function() {
										/*
										 * $('.active').removeClass('active');
										 * $('.OnSeleceActive').removeClass('OnSeleceActive');
										 * $(this).next(".col-xs-12").children(
										 * '.TradeReviewKpiDepartmentFactor').addClass(
										 * 'OnSeleceActive');
										 */
										var keywordDivId = "keywordAndScore_"
												+ $(this).data('reviewid');
										/*console.log(keywordDivId + " 7");*/
										if ($("#" + keywordDivId).hasClass(
												"OnSeleceActive")) {
											$("#" + keywordDivId).removeClass(
													"OnSeleceActive");
					    }else{
					           $("#"+keywordDivId).addClass("OnSeleceActive");
					    }
					});
					$('.userPrimeAction').click(function() {
						$('.active').removeClass('active');
						$('.OnSeleceActive').removeClass('OnSeleceActive');
					});
			}
		},
		error : function(response) {
			return false;
		}
	});
}
function restore() {
	//var divId = $('#'+$('#reviewDetailsForSource').attr('id'));
	//console.log(divId);
	//scrollDown(divId);
	$("#sourceFactorInnerPageViewDetailsDiv").show();
	$("#sourceFactorInnerPageReviewVolumeDiv").show();
	$("#sourceFactorInnerPageHeaderDiv").show();
	$("#sourceFactorInnerPageBredcrumb").show();
	$("#reveiwSourceSearchDiv").show();
	$("#lineSeperator").addClass("lineShadawSeperation");
	
	$("#searchBar").show();

	
	$('#filterBar').html(restoreFilterBarHtml);
	$('#reviewDetailsForSource').hide();
	$('#reviewDetailsForSource').html(restoreHotelReviewsDivIdHtml);
	$("#page-selection").show();
	$('#reviewDetailsForSource').show(600);

	if($("span.stars")!==undefined){
		$('span.stars').stars();
	}
	if($("span.starsTA")!==undefined){
		$('span.starsTA').stars();
	}
	if($("span.starsHIQ")!==undefined){
		$('span.starsHIQ').stars();
	}
	

	$('.btn-flag').click(function() {
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
		$(this).next('.flagOptions').addClass('OnSeleceActive');
	});
	$('.CancelReviewFlag').click(function() {
		$(this).parents('.flagOptions').removeClass('OnSeleceActive');
	});
	$('.SaveReviewFlag').click(function() {
		$(this).parents('.flagOptions').removeClass('OnSeleceActive');
	});

	$('.ShowSemanticPolarity').click(function() {
		var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		console.log(keywordDivId+" 3");
		if($("#"+keywordDivId).hasClass("OnSeleceActive")){
	             $("#"+keywordDivId).removeClass("OnSeleceActive");
	    }else{
	           $("#"+keywordDivId).addClass("OnSeleceActive");
	    }
	});

	$('.userPrimeAction').click(function() {
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
}
function loadFlags(reviewId){
	$("#notesForTask_"+reviewId).hide();
	$("#notesForTicket_"+reviewId).hide();
	$("#notesForNotify_"+reviewId).hide();
	$("#notesForGeneral_"+reviewId).hide();
	
}
function closeBroadcast(reviewId){
	document.getElementById('Broadcast-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane fade" );
}

function openBroadcast(reviewId){
	document.getElementById('Broadcast-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane active" );
}

function closeShare(reviewId){
	document.getElementById('Share-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane fade" );
}

function openShare(reviewId){
	getMappedSourcesForReview(reviewId);
	document.getElementById('Share-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane active" );
}
function closeNote(reviewId){
	document.getElementById('Note-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane fade" );
}

function openNote(reviewId,organizationId){
	getNotes(reviewId,organizationId);
	document.getElementById('Note-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane active" );
}

/*function closeAction(reviewId){
	document.getElementById('Action-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane fade" );
}*/

function openAction(reviewId){
	document.getElementById('Action-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane active" );
}
/*function respondToReview(reviewId,sourceId){
	

	var reviewId=""+reviewForViewDetail.id;
	var sourceId=""+reviewForViewDetail.sourceId;
	
	var organizationId = $('#organizationName option:selected').val();
	var respond=$('#respond').val();
	if($('#respond').val()==null ||$('#respond').val()==""){
		
		var htmlCode='<p><font size="3" color="red">Please Enter Response to reviewForViewDetail.</font></p>';
		$('#validationMessageDiv').html(htmlCode);
		
	}else{
		var JSONObj={'organizationId':organizationId,'reviewId':reviewId,'reviewContent':reviewForViewDetail.highlightedReviewContent,'response':respond,'sourceId':sourceId};
		
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/respondToreviewForViewDetail.htm",
			url : "../reviewSitesContent/respondToReview.htm",
			contentType : "application/json",
			data : JSON.stringify(JSONObj),
			success : function(response) {
				if (response.status == "SAVE_SUCCESS") {
					$('#broadcastSuccessModalTitle').text("Success");
					$('#broadcastSuccessModalText').text(
							"Respond successfully has been mailed !");
					$('#broadcastSuccessModal').modal('show');
					$('#respond_' + reviewId).val('');
					$('#validationMessageDiv_' + reviewId).hide();
				} else {
					if (response.status == "SAVE_ERROR") {
						$('#broadcastSuccessModalTitle').text("Error");
						$('#broadcastSuccessModalText').text(
								response.errorMessage);
						$('#broadcastSuccessModal').modal('show');
						if (response.errorMessage == "Email adress not found for selected source, Please contact admin ! ") {
							$('#validationMessageDiv_' + reviewId)
									.hide();
						}
					}
				}
			},
			error : function(response) {
				$('#broadcastSuccessModalTitle').text("Error");
				$('#broadcastSuccessModalText')
						.text(
								"Something went wrong , please contact admin !");
				$('#broadcastSuccessModal').modal('show');
			}
		});
	}
}*/
/*function saveFlag(reviewId) {
	var flagChkId = 'flagChkDiv_' + reviewId;

	var anyChecked = false;
	var flagStatus = "";
	$('#' + flagChkId).find(':checkbox').each(function() {
		if ($(this).is(':checked')) {
			anyChecked = true;
			flagStatus += $(this).val() + ",";
		}
	});

	flagStatus = flagStatus.slice(0, -1);

	if (anyChecked == false) {
		alert("Please Select one reason");
		return false;
	}

	var organizationId = $('#organizationName option:selected').val();
	var comment = $('#flagCommentTxt').val();

	var JSONObject = {
		'reviewId' : reviewId,
		'organizationId' : organizationId,
		'flagStatus' : flagStatus,
		'flagComment':comment
	};


	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveFlag.htm",
		contentType : "application/json",
		data : JSON.stringify(JSONObject),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				alert("Flag Sent Successfully");
				closeAction(reviewId);
				return false;
			}
		},
		error : function(response) {
		}
	});
	return false;
}*/
/*function getComments(reviewSiteContentId, organizationId, obj) {
	actionType = $(obj).data('actiontype');

	$("#notesForTask_" + reviewSiteContentId).hide();
	$("#notesForTicket_" + reviewSiteContentId).hide();
	$("#notesForNotify_" + reviewSiteContentId).hide();
	$("#notesForGeneral_" + reviewSiteContentId).hide();

	$("#notesFor" + actionType + "_" + reviewSiteContentId).hide();
	$("#notesFor" + actionType + "_" + reviewSiteContentId).html('');
	 $("#errorFor"+actionType+"_"+reviewSiteContentId).html(''); 

	if (actionType == "Ticket") {
		actionType = "Raise a Ticket";
	}
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getComments.htm?organizationId="
						+ organizationId + "&reviewSiteContentId="
						+ reviewSiteContentId + "&actionType=" + actionType,
				contentType : "application/json",
				success : function(response) {
					commentsList = response.successObject.listComments;
					var htmlCode = '';
					for (var i = 0; i < commentsList.length; i++) {
						htmlCode += '<div>';
						if (commentsList[i].actionType == "Task") {
							
							 * htmlCode+='Task '+ (i + 1) +'. '+'Completion By
							 * '+commentsList[i].completionDate+'</br>';
							 * htmlCode+=commentsList[i].comment+'<br>';
							 * htmlCode+='By '+commentsList[i].commentedBy+' For
							 * '+commentsList[i].commentedFor+' at
							 * '+commentsList[i].departmentName+'<br>';
							 * htmlCode+=commentsList[i].createdDate+'<br>';
							 
							htmlCode += '<div class="row ActionReports ReviewActionIcon">'
									+ '<div class="col-xs-5 SmallBoldGreyContent">'
									+ 'Task'
									+ '</div>'
									+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
									+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
									+ commentsList[i].completionDate
									+ '</span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ commentsList[i].comment
									+ '</div>'
									+ '<div class="col-xs-12 SmallDarkGreyHeader">'
									+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
									+ commentsList[i].commentedBy
									+ '</span>'
									+ '<span>For <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].commentedFor
									+ '</span>at <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].departmentName
									+ '</span></span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
									+ commentsList[i].createdDate
									+ '</div>'
									+ '</div>' + '</div>';
						}
						if (commentsList[i].actionType == "Raise a Ticket") {
							htmlCode += '<div class="row ActionReports ReviewActionIcon">'
									+ '<div class="col-xs-5 SmallBoldGreyContent">'
									+ 'Ticket'
									+ '</div>'
									+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
									+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
									+ commentsList[i].completionDate
									+ '</span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ commentsList[i].comment
									+ '</div>'
									+ '<div class="col-xs-12 SmallDarkGreyHeader">'
									+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
									+ commentsList[i].commentedBy
									+ '</span>'
									+ '<span>For <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].commentedFor
									+ '</span>at <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].departmentName
									+ '</span></span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
									+ commentsList[i].createdDate
									+ '</div>'
									+ '</div>' + '</div>';
							
							 * htmlCode+='Ticket '+ (i + 1) +'. '+'Completion By
							 * '+commentsList[i].completionDate+'</br>';
							 * htmlCode+=commentsList[i].comment+'<br>';
							 * htmlCode+='By '+commentsList[i].commentedBy+' For
							 * '+commentsList[i].commentedFor+' at
							 * '+commentsList[i].departmentName+'<br>';
							 * htmlCode+=commentsList[i].createdDate+'<br>';
							 
						}
						if (commentsList[i].actionType == "Notify") {
							htmlCode += '<div class="row ActionReports ReviewActionIcon">'
									+ '<div class="col-xs-5 SmallBoldGreyContent">'
									+ 'Notify'
									+ '</div>'
									+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
									+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
									+ commentsList[i].completionDate
									+ '</span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ commentsList[i].comment
									+ '</div>'
									+ '<div class="col-xs-12 SmallDarkGreyHeader">'
									+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
									+ commentsList[i].commentedBy
									+ '</span>'
									+ '<span>For <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].commentedFor
									+ '</span>at <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].departmentName
									+ '</span></span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
									+ commentsList[i].createdDate
									+ '</div>'
									+ '</div>' + '</div>';
							
							 * htmlCode+='Notify '+ (i + 1) +'. '+'Completion By
							 * '+commentsList[i].completionDate+'</br>';
							 * htmlCode+=commentsList[i].comment+'<br>';
							 * htmlCode+='By '+commentsList[i].commentedBy+' For
							 * '+commentsList[i].commentedFor+' at
							 * '+commentsList[i].departmentName+'<br>';
							 * htmlCode+=commentsList[i].createdDate+'<br>';
							 
						}
						if (commentsList[i].actionType == "General") {
							htmlCode += '<div class="row ActionReports ReviewActionIcon">'
									+ '<div class="col-xs-5 SmallBoldGreyContent">'
									+ 'General'
									+ '</div>'
									+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
									+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
									+ commentsList[i].completionDate
									+ '</span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ commentsList[i].comment
									+ '</div>'
									+ '<div class="col-xs-12 SmallDarkGreyHeader">'
									+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
									+ commentsList[i].commentedBy
									+ '</span>'
									+ '<span>For <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].commentedFor
									+ '</span>at <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].departmentName
									+ '</span></span>'
									+ '</div>'
									+ '<div class="col-xs-12">'
									+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
									+ commentsList[i].createdDate
									+ '</div>'
									+ '</div>' + '</div>';
							
							 * htmlCode+='General '+ (i + 1) +'. '+'Completion
							 * By '+commentsList[i].completionDate+'</br>';
							 * htmlCode+=commentsList[i].comment+'<br>';
							 * htmlCode+='By '+commentsList[i].commentedBy+' For
							 * '+commentsList[i].commentedFor+' at
							 * '+commentsList[i].departmentName+'<br>';
							 * htmlCode+=commentsList[i].createdDate+'<br>';
							 
						}

						 +'Email(s):'+noteList[i].externalEmail+'</br>'; 
						htmlCode += '</div>';

					}
					if (actionType == "Raise a Ticket") {
						actionType = "Ticket";
					}

					$("#notesFor" + actionType + "_" + reviewSiteContentId)
							.html('');
					$("#notesFor" + actionType + "_" + reviewSiteContentId)
							.html(htmlCode);
					$("#notesFor" + actionType + "_" + reviewSiteContentId)
							.show();
				},
				error : function(response) {
				}
			});
}*/
function activateDatetimepicker(obj) {
	var dateTimePickerId = $(obj).attr('id');
	$('#' + dateTimePickerId).datetimepicker();

}
function populateEmployeesForTask(obj) {
	var organizationId = $('#organizationName option:selected').val();
	var departmentId = $(obj).val();
	var selected = $(obj).find('option:selected');
	var reviewId = selected.data('reviewid');
	$.ajaxSetup({
		cache : false
	});
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getMappedUsersForDepartment.htm?organizationId="
						+ organizationId + "&departmentId=" + departmentId,
				contentType : "application/json",
				success : function(response) {
					var tempHtml = '';
					userList = response.successObject.users;
					tempHtml += '<select id="employeeForTask_' + reviewId
							+ '"  class="form-control input-sm">';
					tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
					if( userList.length==0){
						tempHtml += '<option disabled>No Employee Found For Selected Department</option>';
					}
					tempHtml += '</select>';

					$("#employeeDivForTask_" + reviewId).html(tempHtml);
				},
				error : function(response) {
					return false;
				}
			});
}
/*function populateEmployeesForTicket(obj) {
	var organizationId = $('#organizationName option:selected').val();
	var departmentId = $(obj).val();
	var selected = $(obj).find('option:selected');
	var reviewId = selected.data('reviewid');
	$.ajaxSetup({
		cache : false
	});
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getMappedUsersForDepartment.htm?organizationId="
						+ organizationId + "&departmentId=" + departmentId,
				contentType : "application/json",
				success : function(response) {
					var tempHtml = '';
					userList = response.successObject.users;
					tempHtml += '<select id="employeeForTicket_' + reviewId
							+ '"  class="form-control input-sm">';
					tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
					if( userList.length==0){
						tempHtml += '<option disabled>No Employee Found For Selected Department</option>';
					}
					tempHtml += '</select>';

					$("#employeeDivForTicket_" + reviewId).html(tempHtml);
				},
				error : function(response) {
					return false;
				}
			});
}*/

function populateEmployeesForNotify(obj) {
	var organizationId = $('#organizationName option:selected').val();
	var departmentId = $(obj).val();
	var selected = $(obj).find('option:selected');
	var reviewId = selected.data('reviewid');
	$.ajaxSetup({
		cache : false
	});
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getMappedUsersForDepartment.htm?organizationId="
						+ organizationId + "&departmentId=" + departmentId,
				contentType : "application/json",
				success : function(response) {
					var tempHtml = '';
					userList = response.successObject.users;
					tempHtml += '<select id="employeeForNotify_' + reviewId
							+ '"  class="form-control input-sm">';
					tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
					if( userList.length==0){
						tempHtml += '<option disabled>No Employee Found For Selected Department</option>';
					}
					tempHtml += '</select>';

					$("#employeeDivForNotify_" + reviewId).html(tempHtml);
				},
				error : function(response) {
					return false;
				}
			});
}
function populateEmployeesForGeneral(obj) {
	var organizationId = $('#organizationName option:selected').val();
	var departmentId = $(obj).val();
	var selected = $(obj).find('option:selected');
	var reviewId = selected.data('reviewid');
	$.ajaxSetup({
		cache : false
	});
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getMappedUsersForDepartment.htm?organizationId="
						+ organizationId + "&departmentId=" + departmentId,
				contentType : "application/json",
				success : function(response) {
					var tempHtml = '';
					userList = response.successObject.users;
					tempHtml += '<select id="employeeForGeneral_' + reviewId
							+ '"  class="form-control input-sm">';
					tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
					if( userList.length==0){
						tempHtml += '<option disabled>No Employee Found For Selected Department</option>';
					}
					tempHtml += '</select>';

					$("#employeeDivForGeneral_" + reviewId).html(tempHtml);
				},
				error : function(response) {
					return false;
				}
			});
}

function saveShare(reviewId) {
	
	var reviewContent = null;
	
	for (var i = 0; i < reviewList.length; i++) {
		if (reviewList[i].id == reviewId) {
			reviewContent = reviewList[i].highlightedReviewContent;
			break;
		}
	}
	var organizationId = $('#organizationName option:selected').val();
	
	var reviewSourceMapping = [];
	var shareDivId = "shareDiv" + reviewId;
	$('#' + shareDivId + ' input:checked').each(function() {
		
		reviewSourceMapping.push({
			'sourceId' : $(this).attr('value'),
			'sourceName':$(this).data('sourcename'),
			'reviewId' : reviewId,
			'organizationId':organizationId,
			'reviewContent':reviewContent
		});
	});

	if (reviewSourceMapping.length == 0) {
		reviewSourceMapping = [];
		reviewSourceMapping.push({
			'reviewId' : reviewId,
			'sourceId' : null
		});
		document.getElementById("shareCountSpan" + reviewId).innerHTML = 'Share(0)';
	}
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveReviewSourceMapping.htm",
		contentType : "application/json",
		data : JSON.stringify(reviewSourceMapping),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				$('#broadcastSuccessModalTitle').text("Success");
				$('#broadcastSuccessModalText').text(
						"Review Shared Successfully !");
				$('#broadcastSuccessModal').modal('show');
				document.getElementById("shareCountSpan" + reviewId).innerHTML = 'Share'
						+ '(' + reviewSourceMapping.length + ')';
			} else {
				if (response.status == "SAVE_ERROR") {
					$('#broadcastSuccessModalTitle').text("Error");
					$('#broadcastSuccessModalText').text(
							response.errorMessage);
					$('#broadcastSuccessModal').modal('show');
				}
			}
		},
		error : function(response) {
			$('#broadcastSuccessModalTitle').text("Error");
			$('#broadcastSuccessModalText').text(
					"Something went wrong, Please contact admin ");
			$('#broadcastSuccessModal').modal('show');
		}
	});
}

function saveBroadcast(reviewId) {
	var organizationId = $('#organizationName option:selected').val();
	var reviewSitesContent = {};
	var chkId = "broadcastChk" + reviewId;
	if ($('#' + chkId).prop('checked')) {
		reviewSitesContent = {
			'broadcastStatus' : true,
			'id' : reviewId,
			'organizationId':organizationId
		};
	} else {
		reviewSitesContent = {
			'broadcastStatus' : false,
			'id' : reviewId,
			'organizationId':organizationId
		};
	}

	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveBroadcast.htm",
		contentType : "application/json",
		data : JSON.stringify(reviewSitesContent),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				$('#broadcastSuccessModalTitle').text("Success");
				$('#broadcastSuccessModalText').text("Broadcast status set successfully !");
				$('#broadcastSuccessModal').modal('show');
			}else{
				if (response.status == "SAVE_ERROR") {
					
					$('#broadcastSuccessModalTitle').text("Error");
					$('#broadcastSuccessModalText').text(response.errorMessage);
					$('#broadcastSuccessModal').modal('show');
				}
			}
		},
		error : function(response) {
			alert("something went wrong");
		}
	});
}
function getMappedSourcesForOrganization(reviewId, mappedSourceList) {

	var orgId = $('#organizationName option:selected').val();
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getMappedSourceForOrganization.htm?organizationId="
						+ orgId,
				contentType : "application/json",
				success : function(response) {
					var sourceList = response.successObject.sources;
					var htmlCode = '<div class="form-group col-xs-10 row">';

					for (var i = 0; i < sourceList.length; i++) {
						for (var j = 0; j < mappedSourceList.length; j++) {
							if (mappedSourceList[j].id == sourceList[i].id) {
								htmlCode += '<div class="col-xs-4">';
								htmlCode += '<label><input data-sourcename="'+ sourceList[i].sourceName + '" type="checkbox" checked value="'
										+ sourceList[i].id
										+ '"> '
										+ sourceList[i].sourceName + '</label>';
								htmlCode += '</div>';
								sourceList.splice(i, 1);
							}
						}
					}
					for (var i = 0; i < sourceList.length; i++) {
						htmlCode += '<div class="col-xs-4">';
						htmlCode += '<label><input data-sourcename="'+ sourceList[i].sourceName + '" type="checkbox" value="'+ sourceList[i].id + '"> '
								+ sourceList[i].sourceName + '</label>';
						htmlCode += '</div>';
					}

					htmlCode += '</div>';
					$('#shareDiv' + reviewId).html(htmlCode);
				},
				error : function(response) {
					return false;
				}
			});
}
/*function getNotes(reviewSiteContentId, organizationId) {
	$("#" + "notesForReviewSiteContentId_" + reviewSiteContentId).hide();
	$("#notesForReviewSiteContentId_" + reviewSiteContentId).html('');
	$("#errorForReviewSiteContentId_" + reviewSiteContentId).html('');

	$.ajax({
				type : "GET",
				url : "../reviewSitesContent/getNotes.htm?organizationId="
						+ organizationId + "&reviewSiteContentId="
						+ reviewSiteContentId,
				contentType : "application/json",
				success : function(response) {
					noteList = response.successObject.listNotes;
					var htmlCode = '';
					for (var i = 0; i < noteList.length; i++) {
						if(i>1){
							htmlCode += '<div style="display: none" class="extraNoteDivId'+reviewSiteContentId+'">';
						}
						htmlCode += '<div class="row ActionReports ReviewNoteIcon">'
										+ '<div class="col-xs-12">'
											+ ''
											+ noteList[i].note
										+ '</div>'
										+ '<div class="col-xs-12 SmallDarkGreyHeader">'
											+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
											+ noteList[i].userName + '</span>';
						if (noteList[i].externalEmail != null
								&& noteList[i].externalEmail != '') {
							htmlCode += '<span>Shared with <span class="VerySmallBoldGreyContent">'
											+ noteList[i].externalEmail
									  + '</span></span>';
						}
						htmlCode += '</div>'
								+ '<div class="col-xs-12">'
								+ '<div class="revieweTime"><span class="glyphicon glyphicon-time"></span> '
								+ '' + noteList[i].createdDate + '</div>';
								
								if(i==noteList.length-1 && noteList.length>2){
									htmlCode +='<a id="hideMoreHrefId'+reviewSiteContentId+'" href="javascript:void(0)" onclick="hideMore('+reviewSiteContentId+')">Hide More</a>' ;
								}
								if(i==1 && noteList.length>2){
									htmlCode +='<a id="viewMoreHrefId'+reviewSiteContentId+'" href="javascript:void(0)" onclick="showMore('+reviewSiteContentId+')">View More</a>' ;
								}
								
						htmlCode += '</div>' + '</div>';
						
						if(i>1){
							htmlCode += '</div>';
						}
					}
					$("#notesForReviewSiteContentId_" + reviewSiteContentId)
							.html('');
					$("#notesForReviewSiteContentId_" + reviewSiteContentId)
							.html(htmlCode);
					$(
							"#" + "notesForReviewSiteContentId_"
									+ reviewSiteContentId).show();
				},
				error : function(response) {
					$('#loadMaskDiv')
							.mask(
									response.status + "*********"
											+ response.statusText);
				}
			});
}
function hideMore(reviewId){
	  var obj=document.getElementsByClassName('extraNoteDivId');
	  obj.style.display = 'block';
	$('#hideMoreHrefId'+reviewId).hide();
	$('#viewMoreHrefId'+reviewId).show();
	$(".extraNoteDivId"+reviewId).hide(300);
}
function showMore(reviewId){
	  var obj=document.getElementsByClassName('extraNoteDivId');
	  obj.style.display = 'block';
	$('#viewMoreHrefId'+reviewId).hide();
	$('#hideMoreHrefId'+reviewId).show();
	$(".extraNoteDivId"+reviewId).show(300);
}*/
function getMappedSourcesForReview(reviewId) {
	var mappedSourceList = [];
	$.ajax({
		type : "GET",
		url : "../reviewSitesContent/getMappedSourceForReview.htm?reviewId="
				+ reviewId,
		contentType : "application/json",
		success : function(response) {
			mappedSourceList = response.successObject.sources;
			getMappedSourcesForOrganization(reviewId, mappedSourceList);
		},
		error : function(response) {
			return false;
		}
	});
}
$('#organizationName').on('change',function() {
	var orgId = $('#organizationName option:selected').val();
	$.ajax({
				type : "POST",
				url : "../reviewSourceAnalysis/listDepartments.htm?organizationId="+ orgId,
				contentType : "application/json",
				success : function(response) {
					departmentList = response.successObject.listDepartments;
				},
				error : function(response) {
					$('#loadMaskDiv').mask(response.status + "*********"+ response.statusText);
				}
	});
});
function listDepartment(selectedOrgId){
	$.ajax({
		type : "POST",
		url : "../reviewSourceAnalysis/listDepartments.htm?organizationId="
				+ selectedOrgId,
		contentType : "application/json",
		success : function(response) {
			departmentList = response.successObject.listDepartments;
			/* console.log(departmentList); */
		},
		error : function(response) {
			$('#loadMaskDiv').mask(response.status + "*********"+ response.statusText);
		}
	});
}
function saveNoteForNotify(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForNotify_" + reviewId).val());
	var departmentOptionValue = $("#departmentForNotify_" + reviewId).val();
	var employeeOptionValue = $("#employeeForNotify_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForNotify_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		alert("Mandatory fields(*) are required !");
		return;
	}
	reviewAction = {
		'actionType' : 'Notify',
		'orgId' : organizationId,
		'reviewId' : reviewId.toString(),
		'comment' : noteVale,
		'departmentId' : departmentOptionValue,
		'userId' : employeeOptionValue,
		'completionDateStr' : dateTimeValue
	};
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveAction.htm",
		contentType : "application/json",
		data : JSON.stringify(reviewAction),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				getComments(reviewId, organizationId, obj);
				$("#departmentForNotify_" + reviewId).prop('selectedIndex', 0);
				$("#employeeForNotify_" + reviewId).prop('selectedIndex', 0);
				$("#datetimepickerForNotify_" + reviewId).val("");
				$("#noteForNotify_" + reviewId).val("");
			}
		},
		error : function(response) {
			alert("Something went wrong contact admin !");
		}
	});
}
function saveNoteForGeneral(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForGeneral_" + reviewId).val());
	var departmentOptionValue = $("#departmentForGeneral_" + reviewId).val();
	var employeeOptionValue = $("#employeeForGeneral_" + reviewId).val();
	var dateTimeValue = $
			.trim($("#datetimepickerForGeneral_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		alert("Mandatory fields(*) are required !");
		return;
	}
	reviewAction = {
		'actionType' : 'General',
		'orgId' : organizationId,
		'reviewId' : reviewId.toString(),
		'comment' : noteVale,
		'departmentId' : departmentOptionValue,
		'userId' : employeeOptionValue,
		'completionDateStr' : dateTimeValue
	};

	$
			.ajax({
				type : "POST",
				url : "../reviewSitesContent/saveAction.htm",
				contentType : "application/json",
				data : JSON.stringify(reviewAction),
				success : function(response) {
					if (response.status == "SAVE_SUCCESS") {
						getComments(reviewId, organizationId, obj);
						$("#departmentForGeneral_" + reviewId).prop(
								'selectedIndex', 0);
						$("#employeeForGeneral_" + reviewId).prop(
								'selectedIndex', 0);
						$("#datetimepickerForGeneral_" + reviewId).val("");
						$("#noteForGeneral_" + reviewId).val("");
					}
				},
				error : function(response) {
					alert("Something went wrong contact admin !");
				}
			});
}
function saveNoteForTask(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForTask_" + reviewId).val());
	var departmentOptionValue = $("#departmentForTask_" + reviewId).val();
	var employeeOptionValue = $("#employeeForTask_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForTask_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		alert("Mandatory fields(*) are required !");
		return;
	}

	reviewAction = {
		'actionType' : 'Task',
		'orgId' : organizationId,
		'reviewId' : reviewId.toString(),
		'comment' : noteVale,
		'departmentId' : departmentOptionValue,
		'userId' : employeeOptionValue,
		'completionDateStr' : dateTimeValue
	};

	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveAction.htm",
		contentType : "application/json",
		data : JSON.stringify(reviewAction),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				getComments(reviewId, organizationId, obj);
				$("#departmentForTask_" + reviewId).prop('selectedIndex', 0);
				$("#employeeForTask_" + reviewId).prop('selectedIndex', 0);
				$("#datetimepickerForTask_" + reviewId).val("");
				$("#noteForTask_" + reviewId).val("");
			}
		},
		error : function(response) {
			alert("Something went wrong contact admin !");
		}
	});
}
/*function saveNoteForTicket(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForTicket_" + reviewId).val());
	var departmentOptionValue = $("#departmentForTicket_" + reviewId).val();
	var employeeOptionValue = $("#employeeForTicket_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForTicket_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		alert("Mandatory fields(*) are required !");
		return;
	}

	reviewAction = {
		'actionType' : 'Raise a Ticket',
		'orgId' : organizationId,
		'reviewId' : reviewId.toString(),
		'comment' : noteVale,
		'departmentId' : departmentOptionValue,
		'userId' : employeeOptionValue,
		'completionDateStr' : dateTimeValue
	};

	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveAction.htm",
		contentType : "application/json",
		data : JSON.stringify(reviewAction),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				getComments(reviewId, organizationId, obj);
				$("#departmentForTicket_" + reviewId).prop('selectedIndex', 0);
				$("#employeeForTicket_" + reviewId).prop('selectedIndex', 0);
				$("#datetimepickerForTicket_" + reviewId).val("");
				$("#noteForTicket_" + reviewId).val("");
			}
		},
		error : function(response) {
			alert("Something went wrong contact admin !");
		}
	});
}*/
/*function saveNote(reviewSiteContentId) {
	$("#" + "errorForReviewSiteContentId_" + reviewSiteContentId).hide();

	var organizationId = $('#organizationName option:selected').val();
	var note = $.trim($('#noteForReviewSiteContentId_' + reviewSiteContentId)
			.val());
	var externalEmail = $.trim($(
			'#emailForReviewSiteContentId_' + reviewSiteContentId).val());
	var depId = 'departmentForReviewSiteContentId_' + reviewSiteContentId;
	var departmentId = $("#" + depId + " option:selected").val();

	if (!$.isNumeric(departmentId)) {
		departmentId = 0;
	}

	var noteObj = {
		"departmentId" : departmentId,
		"organizationId" : organizationId,
		"note" : note,
		"externalEmail" : externalEmail,
		"reviewSiteContentId" : reviewSiteContentId
	};

	$
			.ajax({
				type : "POST",
				url : "../reviewSitesContent/saveNote.htm",
				contentType : "application/json",
				data : JSON.stringify(noteObj),
				success : function(response) {

					if (response.status == "SAVE_SUCCESS") {
						getNotes(reviewSiteContentId, organizationId);
						 $('#'+depId).trigger('change'); 
						$('#noteForReviewSiteContentId_' + reviewSiteContentId)
								.val('');
						$('#emailForReviewSiteContentId_' + reviewSiteContentId)
								.val('');
					} else if (response.status == "SAVE_ERROR") {

						var errorInfo = "";
						for (var i = 0; i < response.errorMessageList.length; i++) {
							var fieldName = response.errorMessageList[i].fieldName;
							var errorMessage = response.errorMessageList[i].message;

							errorInfo += "<br>" + (i + 1) + ". " + fieldName
									+ " : " + errorMessage;
						}

						$(
								"#" + "errorForReviewSiteContentId_"
										+ reviewSiteContentId)
								.html(
										"Please correct following errors: "
												+ errorInfo);
						$(
								"#" + "errorForReviewSiteContentId_"
										+ reviewSiteContentId).show('slow');
					}

				},
				error : function(response) {

				}
			});
	return false;
}*/
/********************** End Of Nitesh******************/
function showOriginalReview(reviewId){
	$('#originalReview_'+reviewId).toggle(200);
}