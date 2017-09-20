var organizationId;
var reviewsDuplicateResponseObject;
var sentimentPolarityList=[];
var searchText = "";
$(document).ready(function(){
	
	$.ajax({
		url : getUrlParameter("organizationId"),
		success : function(response) {
			getSentimentPolarity();
			getBroadcastedReviews(organizationId);
		}
	});
	
});

function getSentimentPolarity(){
	
	$.ajax({
		type : "GET",
		url : "../public/sentimentPolarityList.htm",
		contentType : "application/json",
		success : function(response) {
			sentimentPolarityList = response.successObject.sentimentPolarityList;
		},
		error : function(response) {
			return false;
		}
	});
	
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
           /* return sParameterName[1];*/
        	organizationId=sParameterName[1];
        }
    }
}

function getBroadcastedReviews(organizationId){
	$.ajax({
		type : "GET",
		url : "../public/broadcastedReviewsJSON.htm?organizationId="+organizationId,
		contentType : "application/json",
		success : function(response) {

			if (response.status == "LIST_ERROR") {
				$('#public-page-wrapper').mask(response.errorMessage);
			} else {
				reviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));

				var totalReviews = response.successObject.listAll;

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
							total : noOfPages
						})
						.on(
								"page",
								function(event, /* page number here */
										num) {
									begin = ((num - 1) * 5);
									end = (num) * 5;
									if (end > totalReviews.legth) {
										end = totalReviews.length;
									}
									/* getMentionsPerPage(begin, end); */
									var successObject = {
										'listAll' : response.successObject.listAll
												.slice(begin, end)
									};
									var response2 = {
										'successObject' : successObject
									};

									var tempHtml = listReviewsStatusResponse(response2, searchText);
									$('#hotelReviewsDivId').html(tempHtml);

									// function for star
									$('span.stars').stars();

									$('.ShowSemanticPolarity').click(function() {
											/*$('.active').removeClass('active');
											$('.OnSeleceActive').removeClass('OnSeleceActive');
											$(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');*/
										 var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
										 console.log(keywordDivId+" 1");
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

								});
				/* getMentionsPerPage(begin, end); */
				var successObject = {
					'listAll' : response.successObject.listAll.slice(0,
							5)
				};
				var response2 = {
					'successObject' : successObject
				};

				var tempHtml = listReviewsStatusResponse(response2,searchText);
				$('#hotelReviewsDivId').html(tempHtml);

				// function for star
				$('span.stars').stars();

				/*$('.ShowSemanticPolarity').click(function() {
							$('.active').removeClass('active');
							$('.OnSeleceActive').removeClass(
									'OnSeleceActive');
							$(this).next(".col-xs-12").children(
									'.TradeReviewKpiDepartmentFactor')
									.addClass('OnSeleceActive');
				});*/
				$('.ShowSemanticPolarity').click(function() {
					/*$('.active').removeClass('active');
					$('.OnSeleceActive').removeClass('OnSeleceActive');
					$(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');*/
					 var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
					 console.log(keywordDivId+" 1");
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

				/*$('#leftNavigation,#wrapper,#header').unmask();	*/
				$('#public-page-wrapper').unmask();
			}
		},
		error : function(response) {
			alert("Something went wrong contact admin !");
		}
	});
}

function listReviewsStatusResponse(response, searchText) {
	var tempHtml = "";
	if (response.status == "LIST_EMPTY") {
		tempHtml = "<font style='margin-left:25px;color:red'>  No Reviews Found</font>";
	} else {
		var list = response.successObject.listAll;
		if (list.length > 0) {
			for (var i = 0; i < list.length; i++) {
			tempHtml+='<div class="row col-xs-12 SingleReviewList" style="border:none;">'
						+'<div data-reviewid="'+list[i].id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
							
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (parseInt(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
									&& parseInt(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
										+ list[i].repufactorScore.toFixed(2)
										+ '%</span> </div>';
								break;
							}
							if (parseInt(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
									&& parseInt(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
										+ list[i].repufactorScore.toFixed(2)
										+ '%</span> </div>';
								break;
							}
							if (parseInt(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
									&& parseInt(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
										+ list[i].repufactorScore.toFixed(2)
										+ '%</span> </div>';
								break;
							}
						}
							
							
						tempHtml+='<div class="reviewDetails row">'
								+'<div class="reviewSource">' + list[i].sourceName + '</div>'
								+'<div class="reviewerName">by <span>';
										if(list[i].reviewerName!=null || $.trim(list[i].reviewerName)=="" || $.trim(list[i].reviewerName).indexOf('\"\"')!=-1){
											tempHtml+= ''+list[i].reviewerName + '';
										}else{
											tempHtml+='Not Available';
										}
										
							tempHtml+='</span>'
					            +'</div>'
								+'<div class="reviewerDetail">from <span>';
										if(list[i].reviewLocation==null || list[i].reviewLocation==""){	
											tempHtml += ' Not Available </span></div>';
										}
										else{
											tempHtml += ''+list[i].reviewLocation + '</span></div>';
										}
						tempHtml+='<div class="revieweTime"><span class="glyphicon glyphicon-time">'
									+'</span>'+ moment(list[i].reviewTime).format("DD MMMM YYYY")+'</span>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xs-12 col-sm-9 col-lg-10">';
								if (list[i].reviewTitle != null) {
									tempHtml += '<h3 class="SingleReviewHeader" >'
											+ list[i].reviewTitle + '</h3>';
								}
				   tempHtml +='<p>'
					   				 + list[i].reviewContent 
							+'</p>';
							
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

							tempHtml += '</div>';
							
							tempHtml += '<div class="SourceKPIRating col-xs-12">';
							for (var h = 0; h < list[i].kpiIndustryMasterUiList.length; h++) {
								tempHtml += '<div class="KPIRating col-xs-4">'
										+ list[i].kpiIndustryMasterUiList[h].kpiSourceName
										+ ' <span> '
										+ list[i].kpiIndustryMasterUiList[h].sourceKpiScore
										+ '/'
										+ list[i].kpiIndustryMasterUiList[h].maxRatingValue
										+ '</span></div>';
							}
							tempHtml += '</div>';
							
							if(list[i].keywordList.length>0){
								
								tempHtml += '<div id="keywordAndScore_'+list[i].id+'" class="TradeReviewKpiDepartmentFactor col-xs-12">'
										+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
										
										
										/*for (var h = 0; h < list[i].kpiTagSentimentAnalysisUIList.length; h++) {
											tempHtml +='<div class="KPIScore col-xs-4"> '+list[i].kpiTagSentimentAnalysisUIList[h].kpiName+' <span class="PositiveSentimentCount"> '+list[i].kpiTagSentimentAnalysisUIList[h].kpiFactorScore+'%</span></div>';
										}*/
								
								for (var h = 0; h < list[i].keywordList.length; h++) {
									for (var p = 0; p < sentimentPolarityList.length; p++) {
										if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage                  
												&& sentimentPolarityList[p].sentimentName == "positive") {
											tempHtml +='<div class="KPIScore col-xs-4"> '+list[i].keywordList[h].nlpQueryName+' <span class="PositiveSentimentCount"> '+list[i].keywordList[h].sentimentScore.toFixed(2)+'%</span></div>';
											break;
										}
										if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "neutral") {
											tempHtml +='<div class="KPIScore col-xs-4"> '+list[i].keywordList[h].nlpQueryName+' <span class="NeutralSentimentCount"> '+list[i].keywordList[h].sentimentScore.toFixed(2)+'%</span></div>';
											break;
										}
										if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "negative") {
											tempHtml +='<div class="KPIScore col-xs-4"> '+list[i].keywordList[h].nlpQueryName+' <span class="NegativeSentimentCount"> '+list[i].keywordList[h].sentimentScore.toFixed(2)+'%</span></div>';
											break;
										}
									}
								}
								tempHtml +='</div>';
							}
							
				tempHtml +='</div>'
				   +'</div>';
			}// End Of for Loop

		} else {
			tempHtml += '<font style="color:red">No Records Found </font>';
		}
	}
	return tempHtml;
}
