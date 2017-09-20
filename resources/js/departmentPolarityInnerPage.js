var reviewsForInnerPage;
var innerPageReviewResponse;
var reviewList=[];
var innerPageReviewFilterResponse;
var innerPageDepartmentChartSummaryResponse;
var departmentInnerPageBarChartId = "DepartmentFactorColumnSummaryStacked";
var kpiInnerPageStartPage= 0;
var departmentInnerPageEndPage = 10;
var departmentInnerPage = 1;
var departmentSearchText = "";
$(document).ready(function(){
	var organizationId=$('#organizationName').val();
	loadingForDashBoard();
	getSentimentPolarityList();
	listDepartmentInnerPageReviews(organizationId);
	//departmentInnerPageChart();
	return false;
});
var departmentInnerPageFromDate = "departmentInnerPageFromDate";
var departmentInnerPageToDate = "departmentInnerPageToDate";
var departmentApplyButton = "departmentInnerPageApply";
$("#departmentInnerPageFromDate").datepicker({
	defaultDate : "+1w",
	changeMonth : true,
	numberOfMonths : 1,
	dateFormat:'d M yy',
	altField: "#altFromDate",
	altFormat: "yy-mm-dd",
	maxDate: new Date,
	onClose : function(selectedDate) {
		$("#departmentInnerPageToDate").datepicker("option", "minDate", selectedDate);
		dateValidation(departmentInnerPageFromDate,departmentInnerPageToDate,departmentApplyButton);
	}
});

$("#departmentInnerPageToDate").datepicker({
	defaultDate : "+1w",
	changeMonth : true,
	numberOfMonths : 1,
	dateFormat:'d M yy',
	altField: "#altToDate",
	altFormat: "yy-mm-dd",
	maxDate: new Date,
	onClose : function(selectedDate) {
	$("#departmentInnerPageFromDate").datepicker("option", "maxDate", selectedDate);
	dateValidation(departmentInnerPageFromDate,departmentInnerPageToDate,departmentApplyButton);
	}

});
function filterDepartmentInnerPage(departmentName){
	loadingForDashBoard();
	getSentimentPolarityList();
	var fromDate = $('#altFromDate').val();
	var toDate = $('#altToDate').val();
	var organizationId = $('#organizationName option:selected').val();
	var departmentId  = 0;
	var isBreadCrumb = $('#innerPageDepartmentBreadCrumb').val();
	var isDashBoard = $('#isDashBoardForDepartmentInnerPage').val();
	$.ajax({
		type:"POST",
		url:"../PolarityInnerPage/departmentName.htm",
		data:JSON.stringify({'departmentName':departmentName,'organizationId':organizationId}),
		contentType:"application/json",
		success:function(response){
			departmentId = response.id;
			$('#innerPageKpiSummaryDepartmentId').val(departmentId);
			window.location.href = "../PolarityInnerPage/page.htm?organizationId="+organizationId+"&fromDate="+fromDate+"&toDate="+toDate+"&isBreadCrumb="+isBreadCrumb+"&departmentId="+departmentId+"&isDashBoard="+isDashBoard;
			unloadingForDashBoard();
		},error:function(response){
			alert("Unable to get department Id");
		}
	});
	return false;
}


function departmentInnerPageChart(){
	loadingForDashBoard();
	var departmentId = $('#innerPageDepartmentSummaryId').val();
	console.log("departmentId............."+departmentId);
	$.ajax({
		type:"POST",
		url:"../PolarityInnerPage/innerChart.htm",
		contentType:"application/json",
		data:JSON.stringify({'departmentId':departmentId}),
		success:function(response){
			var datesArray = new Array();
			var positiveArray = new Array();
			var negativeArray = new Array();
			var neutralArray = new Array();
			var positiveReferenceArray = new Array();
			var negativeReferenceArray = new Array();
			var neautralReferenceArray = new Array();
			
			var list = response.successObject.list;
			innerPageDepartmentChartSummaryResponse = list;
			listLength = list.length;
			if(listLength<=10){
				$('#innerPageDepartmentSummaryNextButton').prop('disabled',true);
				//$('#innerPageDepartmentSummaryNextButton').css('background-color','red');
			}
			if(listLength>0){
				for(var i=0;i<list.length;i++){
					
				var date = list[i].date;
				var positiveCount = parseInt(list[i].polarityCounts.positive);
				var negativeCount = parseInt(list[i].polarityCounts.negative);
				var neautralCount = parseInt(list[i].polarityCounts.neutral);
				var x = positiveCount+negativeCount+neautralCount;
				var departmentRepufact = list[i].departmentRepufact;
				departmentRepufact = parseFloat(departmentRepufact);
				x = departmentRepufact/x;
				
				var positiveValue = (x*positiveCount).toFixed(2);
				var negativeValue = (x*negativeCount).toFixed(2);
				var neautralValue = (x*neautralCount).toFixed(2);
				if(isNaN(positiveValue)){
					positiveValue = 0;
				}
				if(isNaN(negativeValue)){
					negativeValue = 0;
				}
				if(isNaN(neautralValue)){
					neautralValue = 0;
				}
				datesArray.push(date);
				positiveArray.push(parseFloat(positiveValue));
				negativeArray.push(parseFloat(negativeValue));
				neutralArray.push(parseFloat(neautralValue));
				positiveReferenceArray.push(positiveCount);
				negativeReferenceArray.push(negativeCount);
				neautralReferenceArray.push(neautralCount);
			  }
			}
			datesArray = datesArray.slice(kpiInnerPageStartPage,departmentInnerPageEndPage);
			positiveArray = positiveArray.slice(kpiInnerPageStartPage,departmentInnerPageEndPage);
			negativeArray = negativeArray.slice(kpiInnerPageStartPage,departmentInnerPageEndPage);
			neutralArray = neutralArray.slice(kpiInnerPageStartPage,departmentInnerPageEndPage);
			positiveReferenceArray  = positiveReferenceArray.slice(kpiInnerPageStartPage,departmentInnerPageEndPage);
			negativeReferenceArray = negativeReferenceArray.slice(kpiInnerPageStartPage,departmentInnerPageEndPage);
			neautralReferenceArray  = neautralReferenceArray.slice(kpiInnerPageStartPage,departmentInnerPageEndPage);
			var m = $('#innerPageDepartmentSummaryDepartmentName').text();
			var dp = "Department Score for "+m;
			//dp = "'"+dp+"'";
			populateBarChartForDepartment(departmentInnerPageBarChartId,datesArray,positiveArray,negativeArray,neutralArray,dp,positiveReferenceArray,negativeReferenceArray,neautralReferenceArray);
			unloadingForDashBoard();
		},error:function(response){
			alert("Unable to generate chart ");
		}
		
	});
	return false;
	
}

function nextInnerPageDepartmentSummaryChart(){
	kpiInnerPageStartPage=kpiInnerPageStartPage+10;
	departmentInnerPageEndPage=departmentInnerPageEndPage+10;
	departmentInnerPageSummaryPagination(kpiInnerPageStartPage,kpiInnerPageStartPage);
}
function previousInnerPageDepartmentSummaryChart(){
	kpiInnerPageStartPage=kpiInnerPageStartPage-10;
	departmentInnerPageEndPage=departmentInnerPageEndPage-10;
	departmentInnerPageSummaryPagination(kpiInnerPageStartPage,kpiInnerPageStartPage);
}


function departmentInnerPageSummaryPagination(departmentInnerPageStartPage,departmentInnerPageStartPage){
	loadingForDashBoard();
	var datesArray = new Array();
	var positiveArray = new Array();
	var negativeArray = new Array();
	var neutralArray = new Array();
	var positiveReferenceArray = new Array();
	var negativeReferenceArray = new Array();
	var neautralReferenceArray = new Array();
	
	listLength = innerPageDepartmentChartSummaryResponse.length;
	if(listLength>0){
		for(var i=0;i<innerPageDepartmentChartSummaryResponse.length;i++){
		var date = innerPageDepartmentChartSummaryResponse[i].date;
		var positiveCount = parseInt(innerPageDepartmentChartSummaryResponse[i].polarityCounts.positive);
		var negativeCount = parseInt(innerPageDepartmentChartSummaryResponse[i].polarityCounts.negative);
		var neautralCount = parseInt(innerPageDepartmentChartSummaryResponse[i].polarityCounts.neutral);
		var x = positiveCount+negativeCount+neautralCount;
		var departmentRepufact = innerPageDepartmentChartSummaryResponse[i].departmentRepufact;
		departmentRepufact = parseFloat(departmentRepufact);
		x = departmentRepufact/x;
		
		var positiveValue = (x*positiveCount).toFixed(2);
		var negativeValue = (x*negativeCount).toFixed(2);
		var neautralValue = (x*neautralCount).toFixed(2);
		if(isNaN(positiveValue)){
			positiveValue = 0;
		}
		if(isNaN(negativeValue)){
			negativeValue = 0;
		}
		if(isNaN(neautralValue)){
			neautralValue = 0;
		}
		datesArray.push(date);
		positiveArray.push(parseFloat(positiveValue));
		negativeArray.push(parseFloat(negativeValue));
		neutralArray.push(parseFloat(neautralValue));
		positiveReferenceArray.push(positiveCount);
		negativeReferenceArray.push(negativeCount);
		neautralReferenceArray.push(neautralCount);
		
	  }
	}
	datesArray = datesArray.slice(departmentInnerPageStartPage,departmentInnerPageEndPage);
	positiveArray = positiveArray.slice(departmentInnerPageStartPage,departmentInnerPageEndPage);
	negativeArray = negativeArray.slice(departmentInnerPageStartPage,departmentInnerPageEndPage);
	neutralArray = neutralArray.slice(departmentInnerPageStartPage,departmentInnerPageEndPage);
	positiveReferenceArray  = positiveReferenceArray.slice(departmentInnerPageStartPage,departmentInnerPageEndPage);
	negativeReferenceArray = negativeReferenceArray.slice(departmentInnerPageStartPage,departmentInnerPageEndPage);
	neautralReferenceArray  = neautralReferenceArray.slice(departmentInnerPageStartPage,departmentInnerPageEndPage);
	if(departmentInnerPageEndPage>=innerPageDepartmentChartSummaryResponse.length){
		$('#innerPageDepartmentSummaryNextButton').prop('disabled',true);
	//	$('#innerPageDepartmentSummaryNextButton').css('background-color','red');
	}else{
		$('#innerPageDepartmentSummaryNextButton').prop('disabled',false);
	//	$('#innerPageDepartmentSummaryNextButton').css('background-color','white');
	}
	
	if(departmentInnerPageStartPage<=0){
		$('#innerPageDepartmentSummaryPreviousButton').prop('disabled',true);
		//$('#innerPageDepartmentSummaryPreviousButton').css('background-color','red');
	}else{
		$('#innerPageDepartmentSummaryPreviousButton').prop('disabled',false);
		//$('#innerPageDepartmentSummaryPreviousButton').css('background-color','white');

	}
	var m = $('#innerPageDepartmentSummaryDepartmentName').text();
	var dp = "Department Score for "+m;
	//dp = "'"+dp+"'";
	populateBarChartForDepartment(departmentInnerPageBarChartId,datesArray,positiveArray,negativeArray,neutralArray,dp,positiveReferenceArray,negativeReferenceArray,neautralReferenceArray);
	//populateBarChart(departmentInnerPageBarChartId,datesArray,positiveArray,negativeArray,neutralArray,"Department Factor",);
	unloadingForDashBoard();
}

/**************************************************************************************************************************
 *                   Reviews                                                                       *
 **************************************************************************************************************************/


function listDepartmentInnerPageReviews(organizationId){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var departmentId = $('#innerPageDepartmentSummaryId').val();
	var polarity;
	$.ajax({
		type:"POST",
		url:"../PolarityInnerPage/showReviewsForDepartments.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId, departmentId:departmentId}),
		success:function(response){
			var result = response.successObject.reviewDetailsForDeapartment;
			polarity = response.successObject.polarity;
			console.log("polarity is:"+polarity);
			var response = result;
			unloadingForDashBoard();
			$('#departmentReviewsSize').text(response.length);
			if(response.length>0){
				innerPageReviewResponse = response;
				reviewList = response;
				reviewsForInnerPage=response;
				innerPageReviewFilterResponse = null;
				var noOfPages = 0;
				if(reviewList.length%5  == 0 && reviewList.length >0){
					noOfPages = reviewList.length/5;
				}else{
					noOfPages = (reviewList.length/5)+1;
				}
				begin = 0;
				end = 5;
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
			    	getReviewsPerPage(begin, end, polarity);
			    });
			    getReviewsPerPage(begin, end, polarity);
			
			}else{
				$("#reviewHeaderId").html("");
				$("#reviewHeaderId").append("<h4 style='color:red'>No "+polarity+" Review Found !!</h4>").show();
				$("#page-selection").html(" ");
				$("#searchIconId").hide();
			}
		},
		error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
            } else if (jqXHR.status == 404) {
            } else if (jqXHR.status == 500) {
            } else if (exception === 'parsererror') {
            } else if (exception === 'timeout') {
            } else if (exception === 'abort') {
            } else {
            }
        }
		
	});
}

function getReviewsPerPage(begin, end, polarity){
	var sublist = [];
	var polarities;
	if(polarity == "positive"){
		polarities = "Positive";
	}else if(polarity == "negative"){
		polarities = "Negative";
	}else{
		polarities = "Neutral";
	}
	for(var i=begin;i<end;i++){
		sublist.push(reviewList[i]);
	}
	console.log("review object : "+JSON.stringify(sublist));
	$('#hotelReviewsDivId').html('');
	for(var i=0;i<sublist.length;i++){
		if(sublist[i]!=undefined && sublist[i].id != 0){
		var html = "";
		html += '<div class="col-xs-12 SingleReviewList">';
		html += '<div  data-reviewid="'+sublist[i].id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
		html += '<div class="'+polarities+'SentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
			+ sublist[i].repufactorScore.toFixed(1)
			+ '%</span> </div>';
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
		html += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetailsDepartment('+ sublist[i].id + ')" /> ';
		html+='</div>';
		html+='</div>';
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
		if(sublist[i].reviewTitle!=null){
			html += '<h3 class="SingleReviewHeader">'+sublist[i].reviewTitle+'</h3>';
		}else {
			html += '<h3 class="SingleReviewHeader"></h3>';
		}
		html += '<p>'+sublist[i].highlightedReviewContent+'</p>';
		
		if(sublist[i].reviewLanguage!=null && sublist[i].reviewLanguage!="" && sublist[i].reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
			//original review
			html += '<p id="originalReview_'+sublist[i].id+'" style="display:none">' + sublist[i].reviewContent + '</p>';
		}
		
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
		
		if(sublist[i].reviewLanguage!=null && sublist[i].reviewLanguage!="" && sublist[i].reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
			html += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+sublist[i].id+')" href="javascript:void(0)">Original Review</a></span>';
		}

		html += '</div>';
		
		if(sublist[i].keywordList.length>0){
			html += '<div id="keywordAndScore_'+sublist[i].id+'" class="TradeReviewKpiDepartmentFactor col-xs-12 "><div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
			for (var h = 0; h < sublist[i].keywordList.length; h++) {
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						html +='<div class="KPIScore col-xs-4"> <span class="'+polarities+'SentimentCount"> '+sublist[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						html +='<div class="KPIScore col-xs-4"> <span class="NeutralSentimentCount"> '+sublist[i].keywordList[h].nlpQueryName+'</span></div>';
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
		
		if(sublist[i].keywordList.length>0){
			html += '<div id="keywordAndScore_'+sublist[i].id+'" class="TradeReviewKpiDepartmentFactor col-xs-12"><div class="KPIScoreHeader SmallBoldGreyContent col-xs-12" >Keywords</div>';
			for (var h = 0; h < sublist[i].keywordList.length; h++) {
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						html +='<div class="KPIScore col-xs-4">  <span class="'+polarities+'SentimentCount"> '+sublist[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						html +='<div class="KPIScore col-xs-4"> <span class="NeutralSentimentCount">'+sublist[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
					if (parseInt(sublist[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(sublist[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						html +='<div class="KPIScore col-xs-4">  <span class="NegativeSentimentCount"> '+sublist[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
				}
			}
			html +='</div>';
		}
		htmlData = "";
		$("#hotelReviewsDivId").append(html).show();
		$('span.stars').stars();
	}
}
	$('.ShowSemanticPolarity').click(function() {
		var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		console.log(keywordDivId+" 123321");
	    if($("#"+keywordDivId).hasClass("OnSeleceActive")){
	             $("#"+keywordDivId).removeClass("OnSeleceActive");
	    }else{
	           $("#"+keywordDivId).addClass("OnSeleceActive");
	    }
	});
	
}


var stoppedTyping;
function departmentInnerPageReviewSearch(){
	if (stoppedTyping) clearTimeout(stoppedTyping);
	stoppedTyping = setTimeout(function(){
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		$('#leftNavigation,#wrapper,#header').unmask();	
		
		var searchKey = $("#departmentInnerPageSummaryReviewsSearch").val();
		if ($.trim(searchKey) == "" || searchKey == null) {
			searchKey="";
		}
		var response;
		var resultListReviews = [];
		console.log(innerPageReviewResponse);
			response = JSON.parse(JSON.stringify(innerPageReviewResponse));
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

							var tempHtml = listDepartmentInnerPageReviewsResponse(response2, searchKey);
							console.log(response2);
							$('#hotelReviewsDivId').append(tempHtml);
							$('span.stars').stars();	
							$('.ShowSemanticPolarity').click(function() {
								var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
								console.log(keywordDivId+" 1");
								if($("#"+keywordDivId).hasClass("OnSeleceActive")){
							             $("#"+keywordDivId).removeClass("OnSeleceActive");
							    }else{
							           $("#"+keywordDivId).addClass("OnSeleceActive");
							    }
							});
							
			});
		
		var successObject = response.slice(0,5);
		var response2 = successObject;
		var tempHtml = listDepartmentInnerPageReviewsResponse(response2, searchKey);
		$('#hotelReviewsDivId').append(tempHtml);
		$('span.stars').stars();	
		$('.ShowSemanticPolarity').click(function() {
			var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
			console.log(keywordDivId+" 1");
			if($("#"+keywordDivId).hasClass("OnSeleceActive")){
		             $("#"+keywordDivId).removeClass("OnSeleceActive");
		    }else{
		           $("#"+keywordDivId).addClass("OnSeleceActive");
		    }
		});
	},300);
}


function listDepartmentInnerPageReviewsResponse(response,searchTextVal){
	console.log(response);
	$('#hotelReviewsDivId').html('');
	var tempHtml = "";
	var list = response;
	if (list.length > 0) {
	for(var i=0;i<list.length;i++){
		var reviewerName = list[i].reviewerName;
		var reviewTitle = list[i].reviewTitle;
		if(reviewTitle==null){
			reviewTitle = "";
		}
		var id = list[i].id;
		var reviewContent = list[i].highlightedReviewContent;
		var reviewTime = list[i].reviewTime;
		var reviewLocation = list[i].reviewLocation;
		var sourceName  = list[i].sourceName;
		var repufactorScore = list[i].repufactorScore;
		repufactorScore = parseFloat(repufactorScore);
		repufactorScore = repufactorScore.toFixed(2);
		var normalizedRating = parseFloat(list[i].normalizedRating);
		normalizedRating = normalizedRating.toFixed(2);
		if(normalizedRating>5){
			totalRating = 10;
		}else{
			totalRating = normalizedRating;
		}
		tempHtml+=	'<div class="col-xs-12 SingleReviewList" >';
		tempHtml+='<div data-reviewid="'+id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity" >';
		
		for (var p = 0; p < sentimentPolarityList.length; p++) {
			if (parseInt(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
					&& parseInt(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
					&& sentimentPolarityList[p].sentimentName == "positive") {
				tempHtml += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ list[i].repufactorScore.toFixed(1)
						+ '%</span> </div>';
				break;
			}
			if (parseInt(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
					&& parseInt(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
					&& sentimentPolarityList[p].sentimentName == "neutral") {
				tempHtml += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ list[i].repufactorScore.toFixed(1)
						+ '%</span> </div>';
				break;
			}
			if (parseInt(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
					&& parseInt(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
					&& sentimentPolarityList[p].sentimentName == "negative") {
				tempHtml += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ list[i].repufactorScore.toFixed(1)
						+ '%</span> </div>';
				break;
			}
		}
		
		tempHtml+='<div class="reviewDetails row">';
			tempHtml+='<div class="reviewSource">'+sourceName+'</div>';
				tempHtml+='<div class="reviewerName">by <span>'+reviewerName+'</span></div>';
				tempHtml+='<div class="reviewerDetail">from <span>'+reviewLocation+'</span></div>';
				tempHtml+='<div class="revieweTime"><span class="glyphicon glyphicon-time"></span>';
		tempHtml+=	'<span>'+$.datepicker.formatDate('d M yy',new Date(reviewTime))+'</span>';
		tempHtml+= '</div>';
		tempHtml+=	'</div>';
		tempHtml+= '</div>';
		//shravan
		tempHtml+= '<div class="col-xs-12 col-sm-9 col-lg-10" id="highlight-content">';
		tempHtml += '<div style="float:right;">';
		tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetailsDepartment('+ id + ')" /> ';
		tempHtml += '</div>';
		if(reviewTitle!=null){
			tempHtml += '<h3 class="SingleReviewHeader">'+reviewTitle+'</h3>';
		}else {
			tempHtml += '<h3 class="SingleReviewHeader"></h3>';
		}
		tempHtml += '<p>'+reviewContent+'</p>';
		
		if(list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
			//original review
			tempHtml += '<p id="originalReview_'+list[i].id+'" style="display:none">' + list[i].reviewContent + '</p>';
		}
		
		tempHtml += '<div class="SourceRating col-xs-12">';
		
		
		
   tempHtml += '<span>Source Rating </span><span data-review-rating="'
			+ list[i].reviewOverallRating
			+ '" data-maximum-rating="'
			+ list[i].maxOverallRating
			+ '" class="stars">'
			+ list[i].reviewOverallRating
			+ '</span><span>'
			+ list[i].reviewOverallRating
			+ '/'
			+ list[i].maxOverallRating + '</span>';
   
	if(list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
		tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review</a></span>';
	}

      tempHtml += '</div>';
		
		if(list[i].keywordList.length>0){
			tempHtml += '<div id="keywordAndScore_'+list[i].id+'" class="TradeReviewKpiDepartmentFactor col-xs-12 "><div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
			for (var h = 0; h < list[i].keywordList.length; h++) {
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						tempHtml +='<div class="KPIScore col-xs-4"> <span class="PositiveSentimentCount"> '+list[i].keywordList[h].nlpQueryName+' </span></div>';
						break;
					}
					if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						tempHtml +='<div class="KPIScore col-xs-4">  <span class="NeutralSentimentCount"> '+list[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
					if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						tempHtml +='<div class="KPIScore col-xs-4"> <span class="NegativeSentimentCount"> '+list[i].keywordList[h].nlpQueryName+' </span></div>';
						break;
					}
				}
			}				
			tempHtml +='</div>';
		}
		tempHtml += '</div>';
		tempHtml += '</div>';
		$('#page-selection').show();
	} 
	$('#hotelReviewsDivId').empty();
}else {
	tempHtml += '<font style="color:red">No Reviews Found </font>';
	$('#page-selection').html(" ");
}
return tempHtml;
     }


function expandDepartmentFactorsForKpiInnerPage(reviewId){
	var keywordDivId="keywordAndScore_"+reviewId;
	console.log(keywordDivId+" 5");
	console.log(keywordDivId+" 5");
    if($("#"+keywordDivId).hasClass("OnSeleceActive")){
    	 $('#keywordAndScore_'+reviewId).show(600);
    	 $("#"+keywordDivId).removeClass("OnSeleceActive");
    	 $('#kpiInnerPageKpiScores_'+reviewId).hide();
              
    }else{
    	 $("#"+keywordDivId).addClass("OnSeleceActive");
    	 $('#keywordAndScore_'+reviewId).show(600);
    	
    	
    }
}




/*******************************************************************************************************************************
 * ***************************************************View Details**************************************************************
 ******************************************************************************************************************************/
var reviewList = [];
var sessionSelectedOrganizationId=0;
/*****************start of nitesh**********************/
var sentimentPolarityList;
var departmentList = [];
/*****************end of nitesh**********************/

var tradeSource = '';
$(document).ready(function() {
	getSentimentPolarityList();
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
	tradeSource = '';
	getSessionData().then(function(){
	poplateOrganizations(function(selectedOrgId) {
		$('#innerPageSourceFacotorColumnChartPrevious').prop('disabled',true);
		$('#innerPageReviewVolumeColumnChartPrevious').prop('disabled',true);
		getSentimentPolarityList();
		/**********************Start of Nitesh******************/
		var orgId = $('#organizationName option:selected').val();
		listDepartment(orgId);
		/**********************end Of Nitesh******************/
	});
	})
});



$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	populateSourceFactorColumnStacked(organizationId,sourceId);
	populateReviewVolumes(organizationId,sourceId,tradeSource);
	showkeywordInnerPageViewDetails(organizationId,sourceId);
});
function setDefaults(){
	$("#from").datepicker("setDate","-1y");
	$("#to").datepicker("setDate",new Date());
}

/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	commonOrgPopulation(callback,'mySelect');
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
			var sourcePolarityList = new Array();
			var sourcePolarityDateList = new Array();
			var sourceFactorList = new Array();
			var sourceName='';
			innerPageSourceFctorColumnChartResponse = response;
			if(response.length<=10){
				$('#innerPageSourceFacotorColumnChartNext').prop('disabled',true);
			}
			if(response.length>0){
				for(var i=0;i<response.length;i++){
					sourcePolarityList.push(response[i].polarityCounts);
					sourcePolarityDateList.push(response[i].date);
					sourceFactorList.push(response[i].sourceFactor);
					sourceName = response[0].sourceName;
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

function populateReviewVolumes(selectedOrgId,sourceId,sourceName){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/populateReviewVolumes.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:selectedOrgId, sourceId:sourceId}),
		success:function(response){
			var dateList = new Array();
			var reviewVolumeList = new Array();
			if(reviewVolumeList.length<=10){
				$('#innerPageReviewVolumeColumnChartNext').prop('disabled',true);
			}
			if(response.length>0){
				innerPageReviewVolumeColumnChartResponse = response;
				for(var i=0;i<response.length;i++){
					$.each(response[i], function( date, volume){
						if(volume>0){
							//chartData.push([date, volume]);
							dateList.push(moment(date).format("MMM YY"));
							reviewVolumeList.push(volume);
						}
					});
				} 
				SourceVolumeInnerPageCountChart(dateList.slice(innerPageReviewVolumeColumnChartStart, innerPageReviewVolumeColimnChartEnd),
												reviewVolumeList.slice(innerPageReviewVolumeColumnChartStart, innerPageReviewVolumeColimnChartEnd),
												sourceName);
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

function highlightReviesSearchText(searchText,highlightedSearchText){
	var term = searchText;
	term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
	var pattern = new RegExp("("+term+")", "gi");
	highlightedSearchText = highlightedSearchText.replace(pattern, "<mark>$1</mark>");
	highlightedSearchText = highlightedSearchText.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
	return highlightedSearchText;
}
function showinnerPageReviewVolumeNextValues(){
	innerPageReviewVolumeColumnChartStart=innerPageReviewVolumeColumnChartStart+10;
	innerPageReviewVolumeColimnChartEnd=innerPageReviewVolumeColimnChartEnd+10;
	innerPageReviewVolumeChart(innerPageReviewVolumeColumnChartStart,innerPageReviewVolumeColimnChartEnd);
}
function showinnerPageReviewVolumePreviousValues(){
	innerPageReviewVolumeColumnChartStart=innerPageReviewVolumeColumnChartStart-10;
	innerPageReviewVolumeColimnChartEnd=innerPageReviewVolumeColimnChartEnd-10;
	innerPageReviewVolumeChart(innerPageReviewVolumeColumnChartStart,innerPageReviewVolumeColimnChartEnd);
}
function innerPageReviewVolumeChart(innerPageReviewVolumeStart,innerPageReviewVolumeEnd){
	if(innerPageReviewVolumeColumnChartResponse.length>0){
		//var chartData = new Array();
		var dateList = new Array();
		var reviewVolumeList = new Array();
		for(var i=0;i<innerPageReviewVolumeColumnChartResponse.length;i++){
			$.each(innerPageReviewVolumeColumnChartResponse[i], function( date, volume){
				if(volume>0){
					//chartData.push([date, volume]);
					dateList.push(moment(date).format("MMM YY"));
					reviewVolumeList.push(volume);
				}
			});
		} 
		dateList = dateList.slice(innerPageReviewVolumeStart,innerPageReviewVolumeEnd);
		reviewVolumeList = reviewVolumeList.slice(innerPageReviewVolumeStart,innerPageReviewVolumeEnd);
		if(innerPageReviewVolumeEnd>=innerPageReviewVolumeColumnChartResponse.length){
			$('#innerPageReviewVolumeColumnChartNext').prop('disabled',true);
		}else{
			$('#innerPageReviewVolumeColumnChartNext').prop('disabled',false);
		}
		
		if(innerPageReviewVolumeStart<=0){
			$('#innerPageReviewVolumeColumnChartPrevious').prop('disabled',true);
		}else{
			$('#innerPageReviewVolumeColumnChartPrevious').prop('disabled',false);

		}
		SourceVolumeInnerPageCountChart(dateList,reviewVolumeList,tradeSource);
	}
}
function getSentimentPolarityList(){
	$.ajax({
		type : "GET",
		url : "../sentimentPolarityConfig/list.htm",
		contentType : "application/json",
		success : function(response) {
			sentimentPolarityList = response.successObject.sentimentPolarityList;
			console.log(sentimentPolarityList);
		},
		error : function(response) {
			return false;
		}
	});
}


/**********************Start of Nitesh******************/
var reviewForViewDetail;
function fetchReview(reviewId){
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				reviewForViewDetail=response.successObject.review;
			}
		},
		error : function(response) {
			return false;
		}
	});
}
var restoreHotelReviewsDivIdHtml = '';
var restoreFilterBarHtml='';
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
		var JSONObj={'organizationId':organizationId,'reviewId':reviewId,'reviewContent':reviewForViewDetail.highlightedReviewContent,'respond':respond,'sourceId':sourceId};
		
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/respondToreviewForViewDetail.htm",
			url : "../reviewSitesContent/respondToReview.htm",
			contentType : "application/json",
			data : JSON.stringify(JSONObj),
			success : function(response) {
				if (response.status == "SAVE_SUCCESS") {
					$('#departmentInnerPageSuccessModalTitle').text("Success");
					$('#departmentInnerPageSuccessModalText').text("Respond successfully has been mailed !!");
					$('#departmentInnerPageSuccessModal').modal('show');
					$('#respond').val('');
				}else{
					if (response.status == "SAVE_ERROR") {
						$('#departmentInnerPageSuccessModalTitle').text("Error");
						$('#departmentInnerPageSuccessModalText').text(response.errorMessage);
						$('#departmentInnerPageSuccessModal').modal('show');
					}
				}
			},
			error : function(response) {
				$('#departmentInnerPageSuccessModalTitle').text("Error");
				$('#departmentInnerPageSuccessModalText').text("something went wrong Please contact admin");
				$('#departmentInnerPageSuccessModal').modal('show');
			}
		});
	}
}*/
/*function saveFlags(reviewId) {
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
		$('#departmentInnerPageSuccessModalTitle').text("Alert");
		$('#departmentInnerPageSuccessModalText').text("Please Select one reason");
		$('#departmentInnerPageSuccessModal').modal('show');
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
				$('#departmentInnerPageSuccessModalTitle').text("Success");
				$('#departmentInnerPageSuccessModalText').text("Flag Sent Successfully");
				$('#departmentInnerPageSuccessModal').modal('show');
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
						}
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

	document.getElementById("shareCountSpan" + reviewId).innerHTML = 'Share'
			+ '(' + reviewSourceMapping.length + ')';

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
				$('#departmentInnerPageSuccessModalTitle').text("Success");
				$('#departmentInnerPageSuccessModalText').text("Posted Successfully !!");
				$('#departmentInnerPageSuccessModal').modal('show');
			}else{
				if(response.status == "SAVE_ERROR"){
					$('#departmentInnerPageSuccessModalTitle').text("Error");
					$('#departmentInnerPageSuccessModalText').text(response.errorMessage);
					$('#departmentInnerPageSuccessModal').modal('show');
				}
			}
		},
		error : function(response) {
			$('#departmentInnerPageSuccessModalTitle').text("Error");
			$('#departmentInnerPageSuccessModalText').text("something went wrong");
			$('#departmentInnerPageSuccessModal').modal('show');
		}
	});
}

function saveBroadcasts(reviewId) {
	var reviewSitesContent = {};
	var chkId = "broadcastChk" + reviewId;
	if ($('#' + chkId).prop('checked')) {
		reviewSitesContent = {
			'broadcastStatus' : true,
			'id' : reviewId
		};
	} else {
		reviewSitesContent = {
			'broadcastStatus' : false,
			'id' : reviewId
		};
	}

	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveBroadcast.htm",
		contentType : "application/json",
		data : JSON.stringify(reviewSitesContent),
		success : function(response) {console.log(response.status);
			if (response.status == "SAVE_SUCCESS") {
				$('#departmentInnerPageSuccessModalTitle').text("Success");
				$('#departmentInnerPageSuccessModalText').text("Broadcast status set successfully !");
				$('#departmentInnerPageSuccessModal').modal('show');
			}else{
				$('#departmentInnerPageSuccessModalTitle').text("Alert");
				$('#departmentInnerPageSuccessModalText').text("Broadcast status set successfully !");
				$('#departmentInnerPageSuccessModal').modal('show');
			}
		},
		error : function(response) {
			$('#departmentInnerPageSuccessModalTitle').text("Error");
			$('#departmentInnerPageSuccessModalText').text(response.errorMessage);
			$('#departmentInnerPageSuccessModal').modal('show');
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
				success : function(response) {console.log(response);
					var sourceList = response.successObject.sources;
					var htmlCode = '<div class="form-group col-xs-10 row">';
					for (var i = 0; i < sourceList.length; i++) {
						for (var j = 0; j < mappedSourceList.length; j++) {
							if (mappedSourceList[j].id == sourceList[i].id) {
								htmlCode += '<div class="col-xs-4">';
								htmlCode += '<label><input data-sourcename="'
										+ sourceList[i].sourceName
										+ '" type="checkbox" checked value="'
										+ sourceList[i].id + '"> '
										+ sourceList[i].sourceName + '</label>';
								htmlCode += '</div>';
								sourceList.splice(i, 1);
							}
						}
					}
					for (var i = 0; i < sourceList.length; i++) {
						htmlCode += '<div class="col-xs-4">';
						htmlCode += '<label><input data-sourcename="'
								+ sourceList[i].sourceName
								+ '" type="checkbox" value="'
								+ sourceList[i].id + '"> '
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
function getNotes(reviewSiteContentId, organizationId) {
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
								+ '' + noteList[i].createdDate + '</div>'
								+ '</div>' + '</div>';

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
	unloadingForDashBoard();
	
	$('a#departmentViewDetails_'+reviewSiteContentId).hide();
	$('a#departmentHideDetails_'+reviewSiteContentId).show();
}
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
function saveNoteForNotifys(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForNotify_" + reviewId).val());
	var departmentOptionValue = $("#departmentForNotify_" + reviewId).val();
	var employeeOptionValue = $("#employeeForNotify_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForNotify_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		$('#departmentInnerPageSuccessModalTitle').text("Alert");
		$('#departmentInnerPageSuccessModalText').text("Mandatory fields(*) are required !!");
		$('#departmentInnerPageSuccessModal').modal('show');
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
			$('#departmentInnerPageSuccessModalTitle').text("Error");
			$('#departmentInnerPageSuccessModalText').text("Something went wrong contact admin !");
			$('#departmentInnerPageSuccessModal').modal('show');
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
		$('#departmentInnerPageSuccessModalTitle').text("Alert");
		$('#departmentInnerPageSuccessModalText').text("Mandatory fields(*) are required !!");
		$('#departmentInnerPageSuccessModal').modal('show');
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
					$('#departmentInnerPageSuccessModalTitle').text("Error");
					$('#departmentInnerPageSuccessModalText').text("Something went wrong contact admin !");
					$('#departmentInnerPageSuccessModal').modal('show');
				}
			});
}
function saveNoteForTasks(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForTask_" + reviewId).val());
	var departmentOptionValue = $("#departmentForTask_" + reviewId).val();
	var employeeOptionValue = $("#employeeForTask_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForTask_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		$('#departmentInnerPageSuccessModalTitle').text("Alert");
		$('#departmentInnerPageSuccessModalText').text("Mandatory fields(*) are required !!");
		$('#departmentInnerPageSuccessModal').modal('show');
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
			$('#departmentInnerPageSuccessModalTitle').text("Error");
			$('#departmentInnerPageSuccessModalText').text("Something went wrong contact admin !");
			$('#departmentInnerPageSuccessModal').modal('show');
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
		$('#departmentInnerPageSuccessModalTitle').text("Alert");
		$('#departmentInnerPageSuccessModalText').text("Mandatory fields(*) are required !!");
		$('#departmentInnerPageSuccessModal').modal('show');
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
			$('#departmentInnerPageSuccessModalTitle').text("Error");
			$('#departmentInnerPageSuccessModalText').text("Something went wrong contact admin !");
			$('#departmentInnerPageSuccessModal').modal('show');
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

function hideDepartmentDetails(id){
	$('#departmentInnerPageViewDetails_'+id).hide(600);
	$('#departmentHideDetails_'+id).hide();
	$('#departmentViewDetails_'+id).show();
}



//////view Details
var reviewForViewDetail;
var restoreHotelReviewsDivIdHtml = '';
/*function viewDetailsDepartment(reviewId) {
	$('#reviewsBredcrumb').html(" ");
	$("#page-selection").hide();
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				reviewForViewDetail=response.successObject.review;
				console.log(reviewForViewDetail);
				   var htmlCode = "";
					htmlCode += '<div class="row">';
					htmlCode += '<div class="row col-xs-12 SingleReviewList" style="border:none;">';
					htmlCode += '<div data-reviewid="'+reviewForViewDetail.id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
					console.log(sentimentPolarityList);
					for (var p = 0; p < sentimentPolarityList.length; p++) {
						if (parseInt(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "positive") {
							htmlCode += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewForViewDetail.repufactorScore.toFixed(1) + '%</span> </div>';
							break;
						}
						if (parseInt(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "neutral") {
							htmlCode += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewForViewDetail.repufactorScore.toFixed(1) + '%</span> </div>';
							break;
						}
						if (parseInt(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "negative") {
							htmlCode += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewForViewDetail.repufactorScore.toFixed(1) + '%</span> </div>';
							break;
						}
					}

					htmlCode += '<div class="reviewDetails row">';
					htmlCode += '<div class="reviewSource">' + reviewForViewDetail.sourceName + '</div>';
					
						if(reviewForViewDetail.reviewerName!=null || $.trim(reviewForViewDetail.reviewerName)=="" || $.trim(reviewForViewDetail.reviewerName).indexOf('\"\"')!=-1){
							
							htmlCode += '<div class="reviewerName">by<span>';console.log(reviewForViewDetail.reviewerName);
							htmlCode+= ''+reviewForViewDetail.reviewerName + '';
						}else{console.log(reviewForViewDetail.reviewerName);
							htmlCode += '<div class="reviewerName"><span>';
							htmlCode+= 'Not Available';
						}
					htmlCode+= '</span></div>';
					
					
					htmlCode += '<div class="reviewerDetail">from <span>';
					if(reviewForViewDetail.reviewLocation==null || reviewForViewDetail.reviewLocation==""){	
						htmlCode += ' Not Available </span></div>';
					}
					else{
						htmlCode += ''+reviewForViewDetail.reviewLocation + '</span></div>';
					}
					htmlCode += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
					htmlCode += '</span>' + moment(reviewForViewDetail.reviewTime).format("DD MMMM YYYY")
							+ '</span>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';

					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';


					if(reviewForViewDetail.reviewTitle!=null){
						htmlCode += '<h3 class="SingleReviewHeader">' + reviewForViewDetail.reviewTitle+ '</h3>';
					}
					htmlCode += '<p>';
					htmlCode += reviewForViewDetail.highlightedReviewContent;
					htmlCode += '</p>';
					
					if(reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
						//original review
						htmlCode += '<p id="originalReview_'+reviewForViewDetail.id+'" style="display:none">' + reviewForViewDetail.reviewContent + '</p>';
					}
					
					htmlCode += '<div class="row SourceRating col-xs-12">';
					htmlCode += '<span>Source Rating </span><span data-review-rating="'
							+ reviewForViewDetail.reviewOverallRating + '" data-maximum-rating="'
							+ reviewForViewDetail.maxOverallRating + '" class="stars">'
							+ reviewForViewDetail.reviewOverallRating + '</span><span>'
							+ reviewForViewDetail.reviewOverallRating + '/' + reviewForViewDetail.maxOverallRating
							+ '</span>';
					
					if(reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
						htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review</a></span>';
					}
					
					
					htmlCode += '</div>';
					htmlCode += '<div class="row SourceKPIRating col-xs-12">';
					for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
						htmlCode += '<div class="KPIRating col-xs-4">'
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName + ' <span> '
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore + '/'
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
								+ '</span></div>';
					}

					htmlCode += '</div>';
					
					if(reviewForViewDetail.keywordList.length>0){
						htmlCode += '<div id="keywordAndScore_'+reviewForViewDetail.keywordList.id+'" class="TradeReviewKpiDepartmentFactor col-xs-12 " style="display:block;">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
							
						for (var h = 0; h < reviewForViewDetail.keywordList.length; h++) {
							for (var p = 0; p < sentimentPolarityList.length; p++) {
								if (parseInt(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
										&& parseInt(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "positive") {
									htmlCode +='<div class="KPIScore col-xs-4"> <span class="PositiveSentimentCount">  '+reviewForViewDetail.keywordList[h].nlpQueryName+'</span></div>';
									break;
								}
								if (parseInt(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
										&& parseInt(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "neutral") {
									htmlCode +='<div class="KPIScore col-xs-4">  <span class="NeutralSentimentCount">'+reviewForViewDetail.keywordList[h].nlpQueryName+'</span></div>';
									break;
								}
								if (parseInt(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
										&& parseInt(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "negative") {
									htmlCode +='<div class="KPIScore col-xs-4">  <span class="NegativeSentimentCount">'+reviewForViewDetail.keywordList[h].nlpQueryName+'</span></div>';
									break;
								}
							}
						}
					
						htmlCode +='</div>';
					}
					
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					 <!------------------------------------------------------------------------------> 
					
					 * <!--------------------------------Share
					 * --------------------------------------->
					 
					 <!------------------------------------------------------------------------------> 
					htmlCode += '<div class="row">';
					htmlCode += '<div class="col-xs-12 ">';
					htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
					htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
					htmlCode += '<div id="shareCountSpan' + reviewForViewDetail.id + '"class="ShareReviewIcon" style="height: 20px; margin-top: 5px; padding-left: 25px;">Share('+ reviewForViewDetail.sourceMasterUIList.length + ')</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="SubHeading col-xs-12">';
					htmlCode += '<div class="SmallNormalGreyContent col-xs-12">Share On:</div>';

					htmlCode += '<div id="shareDiv' + reviewForViewDetail.id
							+ '" class="form-group col-xs-10 row">';

					htmlCode += '</div>';

					htmlCode += '<div class="col-xs-12 row">';
					htmlCode += '<div class="form-group input-group col-xs-12 footerButtons">';
					htmlCode += '<button id="Save" onclick="saveShare(' + reviewForViewDetail.id	+ ')" class="btn btn-primary btn-sm" type="button"> Save</button>';
					htmlCode += '<button id="Cancel" class="btn btn-default btn-sm" type="button"> Clear</button>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>	';
					htmlCode += '</div>';

					
					 * <!------------------------------------------------------------------------------>
					 * <!-----------------------------Quick Note
					 * ------------------------------------->
					 * <!------------------------------------------------------------------------------>
					 

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
							+ '" class="form-control input-sm" placeholder="Maximum 250 chars" maxlength="250"></textarea>';
					htmlCode += '</div>';
					htmlCode += '<div class="row ">';
					htmlCode += '<div class="form-group col-xs-6">';
					htmlCode += '<label class="">Share with a department</label>';
					htmlCode += '<div class="">';
					htmlCode += '<select id="departmentForReviewSiteContentId_' + reviewForViewDetail.id
							+ '"  class="form-control input-sm">';
					htmlCode += '<option selected disabled>Select a Department</option>';
                    for (var k = 0; k < departmentList.length; k++) {
						htmlCode += '<option value="' + departmentList[k].id + '">'
								+ departmentList[k].departmentName + '</option>';
					}
					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group col-xs-6">';
					htmlCode += '<label class="">Share via email</label>';
					htmlCode += '<div class="">';
					htmlCode += '<input id="emailForReviewSiteContentId_'
							+ reviewForViewDetail.id
							+ '" class="form-control input-sm" placeholder="Enter Email Address">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<button id="Save" onclick="saveNote('
							+ reviewForViewDetail.id
							+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';

					
					 * <!------------------------------------------------------------------------------>
					 * <!-----------------------------Quick Note
					 * ------------------------------------->
					 * <!------------------------------------------------------------------------------>
					 
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
					htmlCode += '<li class="">';
					htmlCode += '<a data-toggle="tab" href="#Task-pills' + reviewForViewDetail.id
							+ '"  data-actiontype="Task" onclick="getComments(' + reviewForViewDetail.id	+ ',' + $('#organizationName option:selected').val() + ',this)" >';
					htmlCode += 'Assign a task';
					htmlCode += '</a>';
					htmlCode += '</li>';
					htmlCode += '<li class="">';
					htmlCode += '<a data-toggle="tab" href="#Ticket-pills' + reviewForViewDetail.id
							+ '" data-actiontype="Ticket" onclick="getComments(' + reviewForViewDetail.id+ ',' + $('#organizationName option:selected').val() + ',this)" >';
					htmlCode += 'Raise a ticket';
					htmlCode += '</a>';
					htmlCode += '</li>';
					htmlCode += '<li class="">';
					htmlCode += '<a data-toggle="tab" href="#Notify-pills' + reviewForViewDetail.id
							+ '" data-actiontype="Notify" onclick="getComments(' + reviewForViewDetail.id+ ',' + $('#organizationName option:selected').val() + ',this)" >';
					htmlCode += 'Notify';
					htmlCode += '</a>';
					htmlCode += '</li>';
					htmlCode += '<li class="">';
					htmlCode += '<a data-toggle="tab" style="display: none;" href="#General-pills' + reviewForViewDetail.id
							+ '" data-actiontype="General" onclick="getComments(' + reviewForViewDetail.id+ ',' + $('#organizationName option:selected').val() + ',this)">';
					htmlCode += 'General';
					htmlCode += '</a>';
					htmlCode += '</li>';
					htmlCode += '<li class="">';
					htmlCode += '<a type="button" class="filterButton" data-toggle="modal" data-target=".RespondToReviews">Respond to reviews</a>';
					htmlCode += '</li>';
					
					htmlCode += '<li class="">';
					htmlCode += '<a data-toggle="tab" onclick="loadFlags('+ reviewForViewDetail.id + ')" href="#Flag-pills' + reviewForViewDetail.id + '">';
					htmlCode += '<span class="glyphicon glyphicon"> </span>';
					htmlCode += 'Flag' + '</a>' + '</li>';
					
					htmlCode += '</ul>';
					
					htmlCode += '<div class="Actiontitles" style="display:none" id="notesForTask_' + reviewForViewDetail.id + '">' + '</div>' + '<div class="Actiontitles" style="display:none" id="notesForTicket_'
					+ reviewForViewDetail.id + '">' + '</div>'
					+ '<div class="Actiontitles" style="display:none" id="notesForNotify_' + reviewForViewDetail.id
					+ '">' + '</div>'
					+ '<div  class="Actiontitles"style="display:none" id="notesForGeneral_' + reviewForViewDetail.id
					+ '">' + '</div>';
					
					htmlCode += '<div class="tab-content">';
					
					htmlCode += '<div id="Flag-pills' + reviewForViewDetail.id + '" class="row  tab-pane ">';
					htmlCode+='<div class="Actiontitles">';
						htmlCode+='<div class="col-xs-12 form-horizontal">';
						
								htmlCode+='<div id="flagChkDiv_'+reviewForViewDetail.id+'" class="form-group col-xs-10 row">';
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
													+ reviewForViewDetail.id + '" type="checkbox"> Other</label></div>';
										} else {
											htmlCode += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
													+ reviewForViewDetail.id + '" type="checkbox"> Other</label></div>';
										}
								
								htmlCode+='</div>';
								
								htmlCode+='<div class="form-group">';
								htmlCode+='<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
								htmlCode+='<div class=" col-xs-12">';
									htmlCode+='<div class="">';
										htmlCode+='<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
										htmlCode+='</div>';
									htmlCode+='</div>';
								htmlCode+='</div>';

						htmlCode+='<div class="form-group input-group form-inline col-xs-12">';
							htmlCode+='<button onclick="saveFlags(' + reviewForViewDetail.id + ')" id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
							htmlCode+='<button onclick="cancelFlag(' + reviewForViewDetail.id + ')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
						htmlCode+='</div>';
					htmlCode+='</div>';

					htmlCode+='</div>';
				htmlCode+='</div>';
					
					htmlCode += '<div id="Task-pills' + reviewForViewDetail.id
							+ '" class="row tab-pane">';
					htmlCode += '<div class="col-xs-12 form-horizontal">';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class=" col-xs-9">';
					htmlCode += '<div class="">';
					htmlCode += '<input id="noteForTask_' + reviewForViewDetail.id
							+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-4">';
					htmlCode += '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
							+ reviewForViewDetail.id + '" class="form-control input-sm">';
					htmlCode += '<option selected disabled>Select a Department</option>';

					for (var k = 0; k < departmentList.length; k++) {
						htmlCode += '<option data-reviewid="' + reviewForViewDetail.id + '" value="'
								+ departmentList[k].id + '">'
								+ departmentList[k].departmentName + '</option>';
					}

					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '<div id="employeeDivForTask_' + reviewForViewDetail.id
							+ '" class="col-xs-5">';
					htmlCode += '<select id="employeeForTask_' + reviewForViewDetail.id
							+ '" class="form-control input-sm">';
					htmlCode += '<option>Select Employee</option>';
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
					htmlCode += '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTasks('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" onclick="closeActions('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div id="Ticket-pills' + reviewForViewDetail.id
							+ '" class="row tab-pane fade">';
					htmlCode += '<div class="col-xs-12 form-horizontal">';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class=" col-xs-9">';
					htmlCode += '<div class="">';
					htmlCode += '<input id="noteForTicket_' + reviewForViewDetail.id
							+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-4">';
					htmlCode += '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
							+ reviewForViewDetail.id + '" class="form-control input-sm">';
					htmlCode += '<option selected disabled>Select a Department</option>';
					for (var k = 0; k < departmentList.length; k++) {
						htmlCode += '<option data-reviewid="' + reviewForViewDetail.id + '" value="'
								+ departmentList[k].id + '">'
								+ departmentList[k].departmentName + '</option>';
					}
					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '<div id="employeeDivForTicket_' + reviewForViewDetail.id
							+ '" class="col-xs-5">';
					htmlCode += '<select id="employeeForTicket_' + reviewForViewDetail.id
							+ '" class="form-control input-sm">';
					htmlCode += '<option>Select Employee</option>';
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
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTickets('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" onclick="closeActions('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
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
					htmlCode += '<input id="noteForNotify_' + reviewForViewDetail.id
							+ '"  class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-4">';
					htmlCode += '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
							+ reviewForViewDetail.id + '" class="form-control input-sm">';
					htmlCode += '<option selected disabled>Select a Department</option>';
					for (var k = 0; k < departmentList.length; k++) {
						htmlCode += '<option data-reviewid="' + reviewForViewDetail.id + '" value="'
								+ departmentList[k].id + '">'
								+ departmentList[k].departmentName + '</option>';
					}

					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '<div id="employeeDivForNotify_' + reviewForViewDetail.id
							+ '" class="col-xs-5">';
					htmlCode += '<select id="employeeForNotify_' + reviewForViewDetail.id
							+ '" class="form-control input-sm">';
					htmlCode += '<option>Select Employee</option>';
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
					htmlCode += '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotifys('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" onclick="closeActions('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
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
					htmlCode += '<input id="noteForGeneral_' + reviewForViewDetail.id
							+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group">';
					htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
					htmlCode += '<div class="col-xs-4">';
					htmlCode += '<select onchange="populateEmployeesForGenerals(this)" id="departmentForGeneral_' + reviewForViewDetail.id + '" class="form-control input-sm">';
					htmlCode += '<option selected disabled>Select a Department</option>';
					for (var k = 0; k < departmentList.length; k++) {
						htmlCode += '<option data-reviewid="' + reviewForViewDetail.id + '" value="'	+ departmentList[k].id + '">'
								+ departmentList[k].departmentName + '</option>';
					}
					htmlCode += '</select>';
					htmlCode += '</div>';
					htmlCode += '<div id="employeeDivForGeneral_' + reviewForViewDetail.id
							+ '" class="col-xs-5">';
					htmlCode += '<select id="employeeForGeneral_' + reviewForViewDetail.id
							+ '" class="form-control input-sm">';
					htmlCode += '<option>Select Employee</option>';
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
					htmlCode += '<button id="Cancel" onclick="closeActions('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';

					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';

					
					 * <!------------------------------------------------------------------------------>
					 * <!--------------------------------Broadcast
					 * --------------------------------------->
					 * <!------------------------------------------------------------------------------>
					 
					htmlCode += '<div class="row">';
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
						htmlCode += '<input type="checkbox" name="broadcastChk' + reviewForViewDetail.id
								+ '" id="broadcastChk' + reviewForViewDetail.id
								+ '" checked>Tag reviews to hotel website.';
					} else {
						htmlCode += '<input type="checkbox" name="broadcastChk' + reviewForViewDetail.id
								+ '" id="broadcastChk' + reviewForViewDetail.id + '"> Tag reviews to hotel website.';
					}

					htmlCode += '</label>';
					htmlCode += '<button id="Save" onclick="saveBroadcasts('
							+ reviewForViewDetail.id
							+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" onclick="closeBroadcast(' + reviewForViewDetail.id+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';

					
					 * <!------------------------------------------------------------------------------>
					 * <!-----------------------Respond to reviews LightBox
					 * --------------------------->
					 * <!------------------------------------------------------------------------------>
					 
					htmlCode += '<div id="respondModal_'
							+ reviewForViewDetail.id
							+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
					htmlCode += '<div class="modal-dialog modal-lg">';
					htmlCode += '<div class="modal-content">';
					htmlCode += '<div class="modal-header">';
					htmlCode += '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>';
					htmlCode += '<h4 id="myLargeModalLabel" class="modal-title">Respond To Reviews</h4>';
					htmlCode += '</div>';
					htmlCode += '<div class="modal-body row">';
					htmlCode += '<div class="row col-xs-12 SingleReviewList">';
					htmlCode += '<div data-reviewid="'+reviewForViewDetail.id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
					htmlCode += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
							+ reviewForViewDetail.repufactorScore.toFixed(1) + '%</span> </div>';
					htmlCode += '</div>';
					htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
					if (reviewForViewDetail.reviewTitle != null) {
						htmlCode += '<h3 class="SingleReviewHeader">' + reviewForViewDetail.reviewTitle
								+ '</h3>';
					}
					htmlCode += '<p>' + reviewForViewDetail.highlightedReviewContent + +'</p>';
					htmlCode += '<div class="form-group input-group col-xs-12">';
					htmlCode += '<textarea id="respond"placeholder="Enter your respon here" maxlength="250" class="form-control input-sm"></textarea>';
					htmlCode += '</div>';
					htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
					htmlCode += '<div id="validationMessageDiv" ></div>';
					htmlCode += '<button id="Save"  onclick="respondToReviews('+reviewForViewDetail.id+','+reviewForViewDetail.sourceId+')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" data-dismiss="modal" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					console.log(reviewForViewDetail);

					restoreHotelReviewsDivIdHtml = $('#hotelReviewsDivId').html();
					restoreFilterBarHtml = $('#filterBar').html();
					
					$('#reviewHeaderName').hide();
					//$('#departmentInnerHeaderBreadCrumb').hide();
					$('#departmentInnerPageLineShadow').hide();
					$('#departmentInnerPageRepufact').hide();
					$('#departmentInnerPageChart').hide();
					$('#hotelReviewsDivId').html(htmlCode);
					
					var departmentName=$("#innerPageDepartmentSummaryDepartmentName").text();
					
					var barHtmlCode = '<div class="row">'
							+ '<div class="col-lg-12 SubHeading SmallDarkGreyHeader">'
							+ '<span> <a onclick="restores()">'+departmentName+'</a></span>'
							+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
							+ '<span>Department Detail</span>' + '</div>' + '</div>';

					$('#filterBar').html(barHtmlCode);
					$('#reviewHeaderName').hide();
					$('#departmentInnerHeaderBreadCrumb').hide();
					$('#departmentInnerPageLineShadow').hide();
					$('#departmentInnerPageChart').hide();
					$('#departmentInnerPageRepufact').hide();
					$('#hotelReviewsDivId').prepend(barHtmlCode);
					$('#hotelReviewsDivId').show(600);

					getMappedSourcesForReviews(reviewForViewDetail.id);
					// function for star
					$('span.stars').stars();

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

					$('.userPrimeAction').click(function() {
						$('.active').removeClass('active');
						$('.OnSeleceActive').removeClass('OnSeleceActive');
					});
				
			}
		},
		error : function(response) {
			return false;
			}}
	);
}*/
function viewDetailsDepartment(reviewId) {
	$('#reviewsBredcrumb').html(" ");
	$("#page-selection").hide();
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
					htmlCode += '<div data-reviewid="'+reviewForViewDetail.id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
					console.log(sentimentPolarityList);
					for (var p = 0; p < sentimentPolarityList.length; p++) {
						if (parseInt(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "positive") {
							htmlCode += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewForViewDetail.repufactorScore.toFixed(1) + '%</span> </div>';
							break;
						}
						if (parseInt(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "neutral") {
							htmlCode += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewForViewDetail.repufactorScore.toFixed(1) + '%</span> </div>';
							break;
						}
						if (parseInt(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "negative") {
							htmlCode += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewForViewDetail.repufactorScore.toFixed(1) + '%</span> </div>';
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
							} else {
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
										
												if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
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
									htmlCode+='<span style="float:left;margin-left: 5px;margin-right:35px;" > '
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
					/*if(!document.getElementById("respondModalLabel_"+ reviewForViewDetail.id)){
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
																			htmlCode += '</span>';
															htmlCode += '</div>';
															htmlCode += '<div class="reviewerDetail">from <span>';
														if (reviewForViewDetail.reviewLocation == null
																|| reviewForViewDetail.reviewLocation == "") {
															htmlCode += ' Not Available </span>';
															htmlCode += '</div>';
														} else {
															htmlCode += '' + reviewForViewDetail.reviewLocation + '</span>';
															htmlCode += reviewForViewDetail.reviewLocation;
															htmlCode += '</div>';
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
																				if(reviewForViewDetail.respondStatus==true){
																					htmlCode += '<span  style="float:right;color:red;">Replied To Review</span>';
																				}else{
																					htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
																				}
																htmlCode += '</div>';  //class="SourceRating col-xs-12"
																htmlCode += '<div class="form-group input-group col-xs-12">';
																	htmlCode += '<textarea id="respond_'+ reviewForViewDetail.id+ '" placeholder="Enter your respon here" maxlength="250" class="form-control input-sm"></textarea>';
																htmlCode += '</div>';
																htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
																	htmlCode += '<div id="validationMessageDiv_'+ reviewForViewDetail.id + '" >';
																	htmlCode += '</div>';
																		htmlCode += '<button id="save_'+ reviewForViewDetail.id+ '"  onclick="respondToReview('+ reviewForViewDetail.id+ ','	+ reviewForViewDetail.sourceId+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
																		htmlCode += '<button id="cancel_'+ reviewForViewDetail.id+ '" onclick="resetRespond('+ reviewForViewDetail.id+ ')" data-dismiss="modal" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
																		htmlCode += '<button data-dismiss="modal" id="ok_'+reviewForViewDetail.id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>';
																htmlCode += '</div>'; //form-inline col-xs-12 closed
														htmlCode += '</div>'; //col-lg-10 closed
													htmlCode += '</div>'; //   class="row col-xs-12 SingleReviewList
										htmlCode += '</div>';//modal-body row
									htmlCode += '</div>'; //modal-content
								htmlCode += '</div>';//modal-dialog modal-lg
							htmlCode += '</div>'; //respondModal_
					}*/
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
					console.log(reviewForViewDetail);

					restoreHotelReviewsDivIdHtml = $('#hotelReviewsDivId').html();
					restoreFilterBarHtml = $('#filterBar').html();
					
					$('#reviewHeaderName').hide();
					//$('#departmentInnerHeaderBreadCrumb').hide();
					$('#departmentInnerPageLineShadow').hide();
					$('#departmentInnerPageRepufact').hide();
					$('#departmentInnerPageChart').hide();
					$('#hotelReviewsDivId').html(htmlCode);
					
					var departmentName=$("#innerPageDepartmentSummaryDepartmentName").text();
					
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
							+ '<span> <a onclick="restores()">'+departmentName+'</a></span>'
							+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
							+ '<span>Department Detail</span>' + '</div>' + '</div>';

					/*$('#filterBar').html(barHtmlCode);*/
					$('#reviewHeaderName').hide();
					$('#departmentInnerHeaderBreadCrumb').hide();
					$('#departmentInnerPageLineShadow').hide();
					$('#departmentInnerPageChart').hide();
					$('#departmentInnerPageRepufact').hide();
					$('#hotelReviewsDivId').prepend(barHtmlCode);
					$('#hotelReviewsDivId').show(600);

					getMappedSourcesForReviews(reviewForViewDetail.id);
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
										} else {
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
function getMappedSourcesForReviews(reviewId) {
	var mappedSourceList = [];
	$.ajax({
		type : "GET",
		url : "../reviewSitesContent/getMappedSourceForReview.htm?reviewId="
				+ reviewId,
		contentType : "application/json",
		success : function(response) {
			mappedSourceList = response.successObject.sources;
			getMappedSourcesForReview(reviewId);
		},
		error : function(response) {
			return false;
		}
	});
}
	
	function restores() {
		$("#searchBar").show();
		$('#filterBar').html(restoreFilterBarHtml);
		$('#hotelReviewsDivId').hide();
		$('#hotelReviewsDivId').html(restoreHotelReviewsDivIdHtml);
		//$("#notificationsBredcrumb").remove();
		$("#page-selection").show();
		$('#reviewHeaderName').show();
		$('#departmentInnerHeaderBreadCrumb').show();
		$('#departmentInnerPageLineShadow').show();
		$('#departmentInnerPageChart').show();
		$('#departmentInnerPageRepufact').show();
		$('#hotelReviewsDivId').show();

		$('span.stars').stars();

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

		$('.userPrimeAction').click(function() {
			$('.active').removeClass('active');
			$('.OnSeleceActive').removeClass('OnSeleceActive');
		});
		$('.ShowSemanticPolarity').click(function() {
			var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
			console.log(keywordDivId+" 1");
			if($("#"+keywordDivId).hasClass("OnSeleceActive")){
		             $("#"+keywordDivId).removeClass("OnSeleceActive");
		    }else{
		           $("#"+keywordDivId).addClass("OnSeleceActive");
		    }
		});
	}
	function showOriginalReview(reviewId){
		$('#originalReview_'+reviewId).toggle(200);
	}

	
	
	