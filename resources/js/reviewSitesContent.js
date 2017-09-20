var pageNo = 1;
var sourceIdsArray = [];
var searchText = "";
var today = new Date();
var checkedFlagsArray = [];
var isNoteFilter = false;
var actionFilterArray = [];
var flagFilterArray = [];
var sentimentPolarityList = [];
var departmentList = [];
var noteList = [];
var sessionSelectedOrganizationId = 0;
var sessionFromDate = null;
var sessionToDate = null;
/* for search purpose */
var filteredReviewsDuplicateResponseObject;
var normalReviewsDuplicateResponseObject;
var sortedReviewsDuplicateResponseObject;
var searchedReviewTitle = null;
var searchedReviewContent = null;
$(document).ready(function() {
	/*** To add CSRF token to all ajax requests *****/ 
	/*var token = $("meta[name='_csrf']").attr("content");
	var header = $("meta[name='_csrf_header']").attr("content");*/
	$(document).ajaxSend(function(e, xhr, options) {
		//xhr.setRequestHeader(header, token);
	});
	/**************************************************/
		$.ajaxSetup({
			cache : false
		});
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
					$.ajax({
								type : "GET",
								url : "../dashboard/getSessionDataMap.htm",
								contentType : "application/json",
								success : function(response) {
									if (response.status == "SUCCESS") {
										var fromDateStr = response.successObject.dateRange.fromDate;
										var toDateStr = response.successObject.dateRange.toDate;
										sessionFromDate = new Date(fromDateStr);
										sessionToDate = new Date(toDateStr);
										sessionSelectedOrganizationId = response.successObject.organizationId;
									} else {
										$("#fromDate").datepicker({
											maxDate : '0',
											defaultDate : '-1y',
											dateFormat : 'd M yy',
											altField : "#altFromDate",
											altFormat : "yy-mm-dd",
										});
										$("#toDate").datepicker({
											maxDate : '0',
											dateFormat : 'd M yy',
											altField : "#altToDate",
											altFormat : "yy-mm-dd",
										});
										$("#searchDates").trigger("click");
									}
									if (sessionSelectedOrganizationId != 0) {
										$("#fromDate").datepicker({
											maxDate : '0',
											defaultDate : '-1y',
											dateFormat : 'd M yy',
											altField : "#altFromDate",
											altFormat : "yy-mm-dd",
										});
										$("#toDate").datepicker({
											maxDate : '0',
											dateFormat : 'd M yy',
											altField : "#altToDate",
											altFormat : "yy-mm-dd",
										});
										$('[name=organizationName]').val(
												sessionSelectedOrganizationId);
										$("#fromDate").datepicker("setDate",
												sessionFromDate);
										$("#toDate").datepicker("setDate",
												sessionToDate);
										$("#searchDates").trigger("click");
									}
								},
								error : function(response) {
									alert("error");
								}
							});
					var orgId = $('#organizationName option:selected').val();
					$.ajax({
								type : "POST",
								url : "../reviewSitesContent/listDepartmentsForOrg.htm?organizationId="
										+ orgId,
								contentType : "application/json",
								success : function(response) {
									departmentList = response.successObject.listDepartments;
								},
								error : function(response) {
									$('#loadMaskDiv').mask(
											response.status + "*********"
													+ response.statusText);
								}
							});
				});
/*******************************************************************************
 * *********************************Organization On
 * Change****************************************************************
 ******************************************************************************/
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
function getMappedSourcesForOrganization(reviewId, mappedSourceList) {
	/*var orgId = $('#organizationName option:selected').val();
	$.ajax({
				type : "GET",
				url : "../reviewSitesContent/getMappedSourceForOrganization.htm?organizationId="
						+ orgId,
				contentType : "application/json",
				success : function(response) {
					var sourceList = response.successObject.sources;*/
					var sourceList = window['sources'];
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
			/*	},
				error : function(response) {
					return false;
				}
			});*/
}
function listReviewStatus(pageNo) {
	$('#wrapper').mask('Loading...');
	$('#leftNavigation,#header').mask();
	
	
	var fromDate = $('#altFromDate').val();
	var toDate = $('#altToDate').val();
	var orgId = $('#organizationName option:selected').val();
	seachText = $.trim(searchText);
	$('#hotelReviewsDivId').html('');
	var reviewFilterSearch = {
		"fromDate" : fromDate,
		"toDate" : toDate,
		"organizationId" : orgId,
		"searchText" : searchText,
		"isNoteFilter" : isNoteFilter,
		"sourceId" : sourceIdsArray,
		"page" : pageNo,
		"actionType" : actionFilterArray,
		"flags" : flagFilterArray
	};
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/getReview.htm",
		data : JSON.stringify(reviewFilterSearch),
		contentType : "application/json",
		success : function(response) {
			//console.log(response);
			window['countsMap'] = response.successObject.countsMap;
			window['languages'] = response.successObject.languages;
			window['sources'] = response.successObject.sources;
			
			if (response.status == "EXCEPTION_ERROR") {
				$('.container').mask(response.errorMessage);
			} else {
				$('#searchedTextDiv').html('');
				$('#filterDiv').html('');
				/* for search purpose */
				normalReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));
				filteredReviewsDuplicateResponseObject = null;
				var totalReviews = response.successObject.listAll;
				var totalReviewCount = response.successObject.totalReviewCount
				
				/*window['positive_reviews_count'] = response.successObject.countsMap.positive_reviews_count;
				window['negative_reviews_count'] = response.successObject.countsMap.negative_reviews_count;
				window['neutral_reviews_count'] = response.successObject.countsMap.neutral_reviews_count;*/
				
				
				pagination(totalReviewCount, 4, hotelReviewsDivId, response);
				$('#leftNavigation,#wrapper,#header').unmask();
			}
			return false;
		},
		error : function(response) {
			$('.container').mask(
					response.status + "**************" + response.statusText);
			return false;
		}
	});
}
function pagination(reviewsCount, countPerPage, divId, response) {
	var pages = 0;
	if (reviewsCount % countPerPage == 0 && reviewsCount > 0) {
		pages = reviewsCount / countPerPage;
	} else {
		pages = reviewsCount / countPerPage + 1;
	}
	$('#page-selection').bootpag({
		total : pages,
		page : 1,
		maxVisible : 10
	}).on('page', function(event, num) {
		var start = (num - 1) * countPerPage;
		var end = num * countPerPage;
		if (end > reviewsCount) {
			end = reviewsCount;
		}
		// paint reviews
		var html = "";
		/*
		 * for(var i=start;i<end;i++){ html = html+reviews[i]+"<br/>"; }
		 */
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		var fromDate = $('#altFromDate').val();
		var toDate = $('#altToDate').val();
		var orgId = $('#organizationName option:selected').val();
		seachText = $.trim(searchText);
		$('#hotelReviewsDivId').html('');
		var reviewFilterSearch = {
			"fromDate" : fromDate,
			"toDate" : toDate,
			"organizationId" : orgId,
			"searchText" : searchText,
			"isNoteFilter" : isNoteFilter,
			"sourceId" : sourceIdsArray,
			"page" : num,
			"actionType" : actionFilterArray,
			"flags" : flagFilterArray
		};
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/getReview.htm",
			data : JSON.stringify(reviewFilterSearch),
			contentType : "application/json",
			success : function(response) {
				//console.log(response);
				window['countsMap'] = response.successObject.countsMap;
				window['languages'] = response.successObject.languages;
				window['sources'] = response.successObject.sources;
				if (response.status == "EXCEPTION_ERROR") {
					$('.container').mask(response.errorMessage);
				} else {
					$('#searchedTextDiv').html('');
					$('#filterDiv').html('');
					/* for search purpose */
					normalReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));
					filteredReviewsDuplicateResponseObject = null;
					var totalReviews = response.successObject.listAll;
					/*window['positive_reviews_count'] = response.successObject.countsMap.positive_reviews_count;
					window['negative_reviews_count'] = response.successObject.countsMap.negative_reviews_count;
					window['neutral_reviews_count'] = response.successObject.countsMap.neutral_reviews_count;*/
		var successObject = {
							'listAll' : response.successObject.listAll,
			'DEPARTMENTS' : response.successObject.DEPARTMENTS,
			'USERS' : response.successObject.USERS
		};
		var response2 = {
			'successObject' : successObject
		};
		html = listReviewStatusResponse(response2, searchText);
		$(divId).html(html);
		
		$('.ratingScore').each(function() {
	         $(this).qtip({
	             content: {
	                 text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
	             },
	          position: {
	        	  my: 'bottom center',  
		          at: 'top center', 
	         },
	         style: {
	             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	         }
	         });
	     });
		
		$('.ReviewNoteIcon').each(function() {
	         $(this).qtip({
	             content: {
	                 text: 'Internal communication workflow '
	             },
	          position: {
	        	  my: 'bottom center',  
		          at: 'top center', 
	         },
	         style: {
	             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	         }
	         });
	     });
		
		$('.ReplyToReview').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Single platform to reply to reviews '
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
	    });
		
		$('.keywords ').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Identified keywords & their polarities'
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
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
			/*
			 * $('.active').removeClass('active');
			 * $('.OnSeleceActive').removeClass('OnSeleceActive');
			 */
			/* $(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive'); */
			var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
			/*console.log(keywordDivId + " 1");*/
			if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
				$("#" + keywordDivId).removeClass("OnSeleceActive");
			} else {
				$("#" + keywordDivId).addClass("OnSeleceActive");
			}
			/*
			 * $(keywordDivId).show(); console.log(keywordDivId+" 1");
			 */
		});
		$('.userPrimeAction').click(function() {
			$('.active').removeClass('active');
			$('.OnSeleceActive').removeClass('OnSeleceActive');
						});
					$('#leftNavigation,#wrapper,#header').unmask();
				}
				return false;
			},
			error : function(response) {
				$('.container').mask(
						response.status + "**************" + response.statusText);
				return false;
			}
		});
	});
	/**
	 * ***************************initializatio of
	 * pagination****************************
	 */
	var successObject = {
		'listAll' : response.successObject.listAll.slice(0, 4),
		'DEPARTMENTS' : response.successObject.DEPARTMENTS,
		'USERS' : response.successObject.USERS
	};
	var response2 = {
		'successObject' : successObject
	};
	var html = listReviewStatusResponse(response2, searchText);
	$('#hotelReviewsDivId').html(html);
	
	$('.ratingScore').each(function() {
        $(this).qtip({
            content: {
                text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.ReviewNoteIcon').each(function() {
        $(this).qtip({
            content: {
                text: 'Internal communication workflow'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.ReplyToReview').each(function() {
        $(this).qtip({
            content: {
                text: 'Single platform to reply to reviews '
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.keywords ').each(function() {
        $(this).qtip({
            content: {
                text: 'Identified keywords & their polarities'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$(".employeeoption").multiselect();
	
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
		/*
		 * $('.active').removeClass('active'); $('.OnSeleceActive').removeClass(
		 * 'OnSeleceActive'); $(this).next(".col-xs-12").children(
		 * '.TradeReviewKpiDepartmentFactor') .addClass('OnSeleceActive');
		 */
		var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
		/*console.log(keywordDivId + " 2");*/
		if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
			$("#" + keywordDivId).removeClass("OnSeleceActive");
		} else {
			$("#" + keywordDivId).addClass("OnSeleceActive");
		}
		/*
		 * $(keywordDivId).show(); console.log(keywordDivId+" 2");
		 */
	});
	$('.userPrimeAction').click(function() {
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
	/**
	 * *************************end of
	 * initialization***********************************
	 */
}
function listReviewStatusResponse(response, searchText) {
	$('#hotelReviewsDivId').html('');
	var tempHtml = "";
	if (response.successObject.LIST_EMPTY == "TRUE") {
		tempHtml = "<font style='margin-left:25px;color:red'>  No Reviews Found</font>";
		$("#page-selection").hide();
	} else {
		$("#page-selection").show();
		var list = response.successObject.listAll;
		if (list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				var reviewTitle = "";
				var highlightedReviewContent = "";
				if (searchText != "") {
					reviewTitle = highlightSearchText(searchText,
							list[i].reviewTitle);
					highlightedReviewContent = highlightSearchText(searchText,
							list[i].highlightedReviewContent);
				} else {
					reviewTitle = list[i].reviewTitle;
					highlightedReviewContent = list[i].highlightedReviewContent;
				}
				var reviewedOn = $.datepicker.formatDate('d M yy', new Date(
						list[i].reviewTime));
				tempHtml += '<div class="row" >';
				tempHtml += '<div id="reviewContentDiv_' + list[i].id + '" class="row col-xs-12 SingleReviewList">';
				tempHtml += '<div data-reviewid="'+ list[i].id + '"class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
						tempHtml += '<div class="ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
						tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
						tempHtml += '<div class=" ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
						break;
					}

				}
				tempHtml += '<div class="reviewDetails row">';
				tempHtml += '<div class="reviewSource">' + list[i].sourceName
						+ '</div>';
				tempHtml += '<div class="reviewerName">by <span>';
				if (list[i].reviewerName != null
						|| $.trim(list[i].reviewerName) == ""
						|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
					tempHtml += '' + list[i].reviewerName + '';
				} else {
					tempHtml += 'Not Available';
				}
				tempHtml += '</span></div>';
				tempHtml += '<div class="reviewerDetail">from <span>';
				if (list[i].reviewLocation == null
						|| list[i].reviewLocation == "") {
					tempHtml += ' Not Available </span></div>';
				} else {
					tempHtml += '' + list[i].reviewLocation + '</span></div>';
				}
				tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
						+ moment(list[i].reviewTime).format("DD MMMM YYYY")
						+ '</span>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';// Reciew
				// Starts
				// Here
				tempHtml += '<div style="float:right;">';
					tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+ list[i].id + ')" /> ';
				tempHtml += '</div>';
				if (reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader" >'
							+ reviewTitle + '</h3>';
				}
				tempHtml += '<p>' + highlightedReviewContent + '</p>';
				
				if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
					//original review
					tempHtml += '<p id="originalReview_'+list[i].id+'" style="display:none">' + list[i].reviewContent + '</p>';
				}
				// star review rating from Review content site table
				if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
						tempHtml += '<div class="SourceRating col-xs-12">';
							tempHtml += '<span>Source Rating </span><span data-review-rating="'
									+ list[i].reviewOverallRating
									+ '" data-maximum-rating="'
									+ list[i].maxOverallRating
									+ '" class="starsTA">'
									+ list[i].reviewOverallRating
									+ '</span><span style="margin-left:5px; margin-right:35px;">'
									+ list[i].reviewOverallRating
									+ '/'
									+ list[i].maxOverallRating + '</span>'
									
									+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
									
									if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
										tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
									}
					
									if(list[i].respondStatus==true){
										tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}else{
										tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}
									if(list[i].markRead==true){
										tempHtml += '<span id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass"  style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
									}else{
										tempHtml += '<span id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
									}
						tempHtml += '</div>';
				}else{
					if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
						tempHtml += '<div class="SourceRating col-xs-12">';
							tempHtml += '<span>Source Rating </span><span data-review-rating="'
									+ list[i].reviewOverallRating
									+ '" data-maximum-rating="'
									+ list[i].maxOverallRating
									+ '" class="starsHIQ">'
									+ list[i].reviewOverallRating
									+ '</span><span style="margin-left:5px; margin-right:35px;">'
									+ list[i].reviewOverallRating
									+ '/'
									+ list[i].maxOverallRating + '</span>'
									
									+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
									
									if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
										tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
									}
					
									if(list[i].respondStatus==true){
										tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}else{
										tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}
									if(list[i].markRead==true){
										tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
									}else{
										tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
									}
						tempHtml += '</div>';
					}else{
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
											
											if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
												tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
											}
							
											if(list[i].respondStatus==true){
												tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
											}else{
												tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
											}
											if(list[i].markRead==true){
												tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
											}else{
												tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
											}
									tempHtml += '</div>';
						}
				}
				tempHtml += '<div class="SourceKPIRating col-xs-12">';
				for (var h = 0; h < list[i].kpiIndustryMasterUiList.length; h++) {
					tempHtml += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
						 + list[i].kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
							
					if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
						tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
					}
					if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
						tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
					}
					tempHtml+=' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
							+ list[i].kpiIndustryMasterUiList[h].sourceKpiScore
							+ '/'
							+ list[i].kpiIndustryMasterUiList[h].maxRatingValue
							+ '</span></div>';
				}
				tempHtml += '</div>';
				
				if (list[i].keywordList.length > 0) {
					tempHtml += '<div id="keywordAndScore_'
							+ list[i].id
							+ '" class="TradeReviewKpiDepartmentFactor col-xs-12">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords <span class="keywords fa-stack " style="position:absolute;font-size: 9px;margin: 0 0 11px 8px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span></div>';
					for (var h = 0; h < list[i].keywordList.length; h++) {
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="PositiveSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName + '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NeutralSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName+ '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NegativeSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName+ '</span></div>';
								break;
							}
						}
					}
					tempHtml += '</div>';
				}
				tempHtml += '<div class="OnReviewActions col-xs-12">';
				tempHtml += '<div class="panel-body row">';
				tempHtml += '<ul class="nav nav-pills">';
				tempHtml += '<li style="display:none">';
				tempHtml += '<a class="userPrimeAction" onclick="openShare('
						+ list[i].id
						+ ')" data-toggle="tab" href="#Share-pills'
						+ list[i].id + '">';
				tempHtml += '<div id="shareCountSpan' + list[i].id
						+ '" class="ShareReviewIcon">Share('
						+ list[i].sourceMasterUIList.length + ')</div>';
				tempHtml += '</a>';
				tempHtml += '</li>';
				tempHtml += '<li>';
				if (response.successObject.DEPARTMENTS.length == 0) {
					tempHtml += '<a class="userPrimeAction" data-toggle="tab" onclick="return false;" href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a class="userPrimeAction" onclick="openNote('
							+ list[i].id + ','
							+ $('#organizationName option:selected').val()
							+ ')" data-toggle="tab" href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li >';
				if (response.successObject.DEPARTMENTS.length == 0
						|| response.successObject.USERS.length == 0) {
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task"  onclick="return false;" href="#Action-pills'	+ list[i].id + '">';
					//tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task" onclick="getComments('	+ list[i].id+ ','+ $('#organizationName option:selected').val()	+ ',this)" onclick="return false;" href="#Action-pills'	+ list[i].id + '">';
					tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#Action-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li style="display:none">';
				tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="openBroadcast('
						+ list[i].id
						+ ')" href="#Broadcast-pills'
						+ list[i].id
						+ '">';
				tempHtml += '<div class="BroadcastIcon">Broadcast</div>';
				tempHtml += '</a>';
				tempHtml += '</li>';
				
				/*****************************respond to review pill2*************************************/
				tempHtml += '<li >';
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#ReplyToReview-pills'+ list[i].id + '">';
						tempHtml += '<div id="ReplyToReviewTabInReviews" class="ReplyToReview">Reply to review</div>';
					tempHtml += '</a>';
				tempHtml += '</li>';
				
				/*****************************respond to review pill*************************************/
				tempHtml += '</ul>';
				tempHtml += '<div class="tab-content">';
				
				//start reply
				tempHtml += '<div id="ReplyToReview-pills' + list[i].id+ '" class="SubHeading tab-pane fade">';
					tempHtml += '<div class="panel-body row">';
						tempHtml += '<ul class="nav nav-pills">';
						if(list[i].sourceBaseUrl){
							tempHtml += '<li class="">';
							if(((list[i].sourceName.toLowerCase()=="tripadvisor" 
									|| list[i].sourceName.toLowerCase()=="booking") 
									&& (list[i].sourceLogin != null && list[i].sourceLogin !='')  
									&&  (list[i].sourcePass != null  && list[i].sourcePass!='') 
									&& (list[i].sourceUrl != null && list[i].sourceUrl != '')) 
									|| (list[i].sourceName.toLowerCase()=="holidayiq" && list[i].reviewId != null && list[i].reviewId != '') )
								tempHtml += '<a  class="filterButton" onclick="showRespondModal('+list[i].id+',\'direct\')" >Direct Respond to Review Source</a>';
							else
								tempHtml += '<a  class="filterButton" id="DirectRespondReviewSource" onclick="respondToDirect('+list[i].id+')" href="//'+list[i].sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';

							tempHtml += '</li>';
						}
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" id="DirectRespondReviewer" onclick="showRespondModal('+list[i].id+',\'reviewer\')" class="filterButton" >Direct Respond to Reviewer</a>';
							tempHtml += '</li>';
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" id="RespondByMailToReviewSource" onclick="showRespondModal('+list[i].id+',\'reviewSource\')" >Respond by email to Review Source</a>';
							tempHtml += '</li>';
						tempHtml += '</ul>';
							tempHtml += '<div class="tab-content">';
							tempHtml += '</div>';
					tempHtml += '</div>';
				tempHtml += '</div>';
				//end reply
				
				tempHtml += '<div id="Broadcast-pills' + list[i].id+ '" class="SubHeading tab-pane fade">';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				if (list[i].broadcastStatus == true) {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '" checked>Tag reviews to hotel website.';
				} else {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '"> Tag reviews to hotel website.';
				}
				tempHtml += '<button id="Save" onclick="saveBroadcast('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Done</button>';
				tempHtml += '<button onclick="closeBroadcast('
						+ list[i].id
						+ ')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Share-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div class="MediumNormalGreyContent col-xs-2">Share On:</div>'
						+ '<div id="shareDiv'
						+ list[i].id
						+ '" class="form-group col-xs-10 row">'
						+ '</div>'
						+ '<div class="col-xs-10 col-xs-offset-2 row">'
						+ '<div class="form-group input-group col-xs-12 footerButtons">'
						+ '<button id="Save" onclick="saveShare('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm" type="button"> Done</button>'
						+ '<button id="Cancel" onclick="closeShare('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of Share
				// END of Share
				
				
				tempHtml += '<div id="Action-pills'
						+ list[i].id
						+ '" class="SubHeading tab-pane fade">'
						+ '<div class="panel-body row">'
						+ '<ul class="nav nav-pills">'
					/*	+ '<li class="active">'
						+ '<a data-toggle="tab" href="#Task-pills'
						+ list[i].id
						+ '"  data-actiontype="Task" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)" >'
						+ '<span class="glyphicon glyphicon"></span>'
						+ 'Assign a task'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="active">'
						+ '<a data-toggle="tab" id="RaiseTicketlink" href="#Ticket-pills'
						+ list[i].id
						+ '" data-actiontype="Ticket" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span  class="glyphicon glyphicon"></span>'
						+ 'Raise a ticket'
						+ '</a>'
						+ '</li>'
						/*+ '<li class="">'
						+ '<a data-toggle="tab" href="#Notify-pills'
						+ list[i].id
						+ '" data-actiontype="Notify" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Notify'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="">'
						+ '<a data-toggle="tab" style="display: none;" href="#General-pills'
						+ list[i].id + '" data-actiontype="General" onclick="getComments('+ list[i].id + ','+ $('#organizationName option:selected').val()	+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'General' + '</a>' + '</li>'
						/*+ '<li class="">'
						+ '<a data-toggle="tab" onclick="showRespondModal('+ list[i].id + ')" href="#Respond-pills' + list[i].id+ '">' + '<span class="glyphicon glyphicon"> </span>'
						+ 'Respond to reviews' + '</a>' + '</li>'*/
						+ '<li class="">'
						+ '<a data-toggle="tab" id="FlagLink" onclick="loadFlags('
						+ list[i].id + ')" href="#Flag-pills' + list[i].id
						+ '">' + '<span class="glyphicon glyphicon"> </span>'
						+ 'Flag' + '</a>' + '</li>' + '</ul>';
				tempHtml += '<div class="Actiontitles" style="display:none" id="notesForTask_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForGeneral_'
						+ list[i].id + '">' + '</div>';
				tempHtml += '<div class="tab-content">';
				tempHtml += '<div id="Flag-pills' + list[i].id
						+ '" class="row  tab-pane ">';
				tempHtml += '<div class="Actiontitles">';
				tempHtml += '<div class="col-xs-12 form-horizontal">';
				tempHtml += '<div id="flagChkDiv_' + list[i].id
						+ '" class="form-group col-xs-10 row">';
				if ('DUPLICATE_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				}
				if ('DELETED_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				}
				if ('INCORRECT_LANGUAGE' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				}
				if ('OTHER' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				}
				tempHtml += '</div>';
				tempHtml += '<div class="form-group">';
				/*
				 * tempHtml+='<label class="col-xs-3 control-label">Comment<span
				 * class="mandatoryField">*</span></label>';
				 */
				tempHtml += '<div class=" col-xs-12">';
				tempHtml += '<div class="">';
				tempHtml += '<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				tempHtml += '<button onclick="saveFlag('
						+ list[i].id
						+ ')"  id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
				tempHtml += '<button onclick="cancelFlag('
						+ list[i].id
						+ ')"  id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Task-pills' + list[i].id
						+ '" class="row  tab-pane active">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTask_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTask_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForTask_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForTask_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTask('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTask" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Task Pill
				tempHtml += '<div id="Ticket-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Priority<span class="mandatoryField">*</span></label>'
							 + '<div id="ticketPriorityDiv_' + list[i].id + '" class="col-xs-2">'
							 + '<select id="ticketPriorityOption_'	+ list[i].id + '" class="form-control input-sm">'
								 + '<option value="High" >High Priority</option>'
								 + '<option value="Medium" >Medium Priority</option>'
								 + '<option value="Low" >Low Priority</option>'
							 + '</select>'
							 + '</div>'
							 + '</div>'
						 
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For</label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTicket_'
						+ list[i].id
						+ '" class="col-xs-3">'
						+ '<select multiple id="employeeForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm employeeoption">'
						/*+ '<option value="" >Select Employee</option>'*/
						+ '</select>'
						+ '</div>'
						
					
						 
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForTicket_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						
						+ '<div id="emailForTicketDiv_'	+ list[i].id + '" class="form-group">'
						+ '<label class="col-xs-3 control-label">Share via email<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
							+ '<input id="emailForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter Email Address">'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">CC</label>'
						+ '<div class="col-xs-9">'
							+ '<input id="ccEmailsForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter CC Emails with comma seperated">'
						+ '</div>'
						+ '</div>'
						
						
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTicket" onclick="cancelRaiseTicket('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Ticket Pill
				tempHtml += '<div id="Notify-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForNotify_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForNotify_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotify('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelNotify" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Notify Pill
				tempHtml += '<div style="display: none;" id="General-pills'
						+ list[i].id
						+ '" class="row  tab-pane">'
						+ '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForGeneral_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForGeneral_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveGeneral" data-actiontype="General" onclick="saveNoteForGeneral('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelGeneral" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of General Pill
				$("#respondModal_"+ list[i].id).remove(); 
		if(!document.getElementById("respondModalLabel_"+ list[i].id)){			
				tempHtml += ' <div id="Respond-pills' + list[i].id
						+ '" class="row Actiontitles tab-pane">';
				tempHtml += '<div id="respondModal_'
						+ list[i].id
						+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
						+ '<div class="modal-dialog modal-lg">'
						+ '<div class="modal-content">'
						+ '<div class="modal-header">'
						+ '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>'
							+ '<h4 id="respondModalLabel_'+ list[i].id+ '" class="modal-title">Respond by email to Review Source</h4>'
							+ '<h4 id="respondsModalLabel_'+ list[i].id+ '" style="display:none" class="modal-title">Responds</h4>'
						+ '</div>'
						+ '<div class="modal-body row">'
						+ '<div class="row col-xs-12 SingleReviewList">'
						+ '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
								
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class=" ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
						}
						
						tempHtml += '<div class="reviewDetails row">';
						tempHtml += '<div class="reviewSource">' + list[i].sourceName
								+ '</div>';
						tempHtml += '<div class="reviewerName">by <span>';
						if (list[i].reviewerName != null
								|| $.trim(list[i].reviewerName) == ""
								|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
							tempHtml += '' + list[i].reviewerName + '';
						} else {
							tempHtml += 'Not Available';
						}
						tempHtml += '</span></div>';
						tempHtml += '<div class="reviewerDetail">from <span>';
						if (list[i].reviewLocation == null
								|| list[i].reviewLocation == "") {
							tempHtml += ' Not Available </span></div>';
						} else {
							tempHtml += '' + list[i].reviewLocation + '</span></div>';
						}
						tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
								+ moment(list[i].reviewTime).format("DD MMMM YYYY")
								+ '</span>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						
						
						
						
						
							/*+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Rating Score: <span class="score">'+ list[i].repufactorScore.toFixed(2) + '%</span> </div>'*/
			   tempHtml +='</div>'
						+ '<div class="col-xs-12 col-sm-9 col-lg-10">';
				if (list[i].reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader">'
							+ list[i].reviewTitle + '</h3>';
				}
				tempHtml += '<p>'+ list[i].highlightedReviewContent	+ '</p>';
				
								// star review rating from Review content site table
								if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
									tempHtml += '<div class="SourceRating col-xs-12">';
									tempHtml += '<span>Source Rating </span><span data-review-rating="'
											+ list[i].reviewOverallRating
											+ '" data-maximum-rating="'
											+ list[i].maxOverallRating
											+ '" class="starsTA">'
											+ list[i].reviewOverallRating
											+ '</span><span style="margin-left:5px; margin-right:35px;">'
											+ list[i].reviewOverallRating
											+ '/'
											+ list[i].maxOverallRating
											+ '</span>'
											
											+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
											/*if(list[i].respondStatus==true){
												tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
											}else{
												tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
											}*/
									tempHtml += '</div>';
								}else{
									if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
										tempHtml += '<div class="SourceRating col-xs-12">';
										tempHtml += '<span>Source Rating </span><span data-review-rating="'
												+ list[i].reviewOverallRating
												+ '" data-maximum-rating="'
												+ list[i].maxOverallRating
												+ '" class="starsHIQ">'
												+ list[i].reviewOverallRating
												+ '</span><span style="margin-left:5px; margin-right:35px;">'
												+ list[i].reviewOverallRating
												+ '/'
												+ list[i].maxOverallRating
												+ '</span>'
												
												+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
												/*if(list[i].respondStatus==true){
													tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
												}else{
													tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
												}*/
										tempHtml += '</div>';
									}else{
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
														+ list[i].maxOverallRating
														+ '</span>';
														
														/*if(list[i].respondStatus==true){
															tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
														}else{
															tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
														}*/
												tempHtml += '</div>';
									}
								}
							/*	tempHtml += '<div id="sourceKPIRating'+list[i].id+'" class="SourceKPIRating col-xs-12">';
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
								
								if (list[i].keywordList.length > 0) {
									tempHtml += '<div id="keywordAndScoreModal_'
											+ list[i].id
											+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
											+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
									for (var h = 0; h < list[i].keywordList.length; h++) {
										for (var p = 0; p < sentimentPolarityList.length; p++) {
											if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
													&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
													&& sentimentPolarityList[p].sentimentName == "positive") {
												tempHtml += '<div class="KPIScore col-xs-4"> '
														+ ' <span class="PositiveSentimentCount"> '
														+ list[i].keywordList[h].nlpQueryName + '</span></div>';
												break;
											}
											if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
													&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
													&& sentimentPolarityList[p].sentimentName == "neutral") {
												tempHtml += '<div class="KPIScore col-xs-4"> '
														+ ' <span class="NeutralSentimentCount"> '
														+ list[i].keywordList[h].nlpQueryName + '</span></div>';
												break;
											}
											if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
													&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
													&& sentimentPolarityList[p].sentimentName == "negative") {
												tempHtml += '<div class="KPIScore col-xs-4"> '
														+ ' <span class="NegativeSentimentCount"> '
														+ list[i].keywordList[h].nlpQueryName +'</span></div>';
												break;
											}
										}
									}
									tempHtml += '</div>';
								}*/
				
			  tempHtml+= '<div class="form-group input-group col-xs-12">'
						
						+'<div class="form-group input-group col-xs-12">'
							+'<input type="email" id="reviewerEmail_'+list[i].id+'" class="form-control input-sm" placeholder="Enter Reviewer Email Address">'
						+'</div>'
					
						+ '<textarea id="respond_'
						+ list[i].id
						+ '" placeholder="Enter your response here" style="width: 704px; height: 145px;" maxlength="1000" class="form-control input-sm"></textarea>'
							+'<span id="responds_'+ list[i].id + '" style="display:none"></span>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<div id="validationMessageDiv_'
						+ list[i].id
						+ '" ></div>'
						+ '<button id="save_'+list[i].id+'" onclick="respondToReview('
						+ list[i].id
						+ ','
						+ list[i].sourceId
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button data-dismiss="modal" onclick="resetRespond('
						+ list[i].id
						+ ')" id="cancel_'+list[i].id+'" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '<button data-dismiss="modal" id="ok_'+list[i].id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>'
						+ '</div>' + '</div>' + '</div>' + '</div>' + '</div>'
						+ '</div>' + '</div>';
				tempHtml += ' </div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
		}
				tempHtml += '<div id="Note-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div style="display:none" id="notesForReviewSiteContentId_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<p style="display:none ; color:red" class="has-error" id="errorForReviewSiteContentId_'
						+ list[i].id
						+ '"></p>'
						+ '<div class="col-xs-12">'
						+ '<div class="form-group input-group col-xs-12">'
						+ '<label>Enter your note <span class="mandatoryField">*</span></label>'
						+ '<textarea id="noteForReviewSiteContentId_'
						+ list[i].id
						+ '" class="form-control input-sm" ></textarea>'
						+ '</div>'
						+ '<div class="row ">'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share with a department</label>'
						+ '<div class="">'
						+ '<select id="departmentForReviewSiteContentId_'
						+ list[i].id
						+ '"  class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share via email</label>'
						+ '<div class="">'
						+ '<input id="emailForReviewSiteContentId_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Enter Email Address">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="Save" onclick="saveNote('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="Cancel" onclick="closeNote('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of QuickNote
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';// END of On action
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
			}// End Of for Loop
			$('#hotelReviewsDivId').empty();
			$('#page-selection').show();
		} else {
			tempHtml += '<font style="color:red">No Records Found </font>';
			$('#page-selection').hide();
		}
	}
	return tempHtml;
}

function activateDatetimepicker(obj) {
	var dateTimePickerId = $(obj).attr('id');
	$('#' + dateTimePickerId).datetimepicker({minDate: 0});
}
/*function showRespondModal(reviewId) {
	
	$('#reviewerEmail_' + reviewId).val("");
	
	$('#validationMessageDiv_' + reviewId).html("");
	$("#notesForTask_" + reviewId).hide();
	$("#notesForTicket_" + reviewId).hide();
	$("#notesForNotify_" + reviewId).hide();
	$("#notesForGeneral_" + reviewId).hide();
	
	if(type=="reviewSource"){
		$("#reviewerEmail_" + reviewId).hide();
		$('#respondModalLabel_' + reviewId).text("Respond by email to Review Source");
	}
	if(type=="reviewer"){
		$("#reviewerEmail_" + reviewId).show();
		$('#respondModalLabel_' + reviewId).text("Direct respond to Reviewer");
	}
	
	$('#respondModal_' + reviewId).appendTo("body").modal('show');
	
}*/

/*function showRespondModal(reviewId,type) {
	
	$('#respondModalLabel_'+reviewId).show();
	$('#respondsModalLabel_'+reviewId).hide();
	$('#sourceKPIRating'+reviewId).show();
	$('#keywordAndScoreModal_'+reviewId).show();
	$('#reviewerEmail_'+reviewId).show();
	$('#respond_'+reviewId).show();
	$('#responds_'+reviewId).hide();
	$('#save_'+reviewId).show();
	$('#cancel_'+reviewId).show();
	$('#ok_'+reviewId).hide();
	
	$('#reviewerEmail_' + reviewId).val("");
	
	$('#validationMessageDiv_' + reviewId).html("");
	$("#notesForTask_" + reviewId).hide();
	$("#notesForTicket_" + reviewId).hide();
	$("#notesForNotify_" + reviewId).hide();
	$("#notesForGeneral_" + reviewId).hide();
	if(type=="reviewSource"){
		$("#reviewerEmail_" + reviewId).hide();
		$('#respondModalLabel_' + reviewId).text("Respond by email to Review Source");
	}
	if(type=="reviewer"){
		$("#reviewerEmail_" + reviewId).show();
		$('#respondModalLabel_' + reviewId).text("Direct respond to Reviewer");
	}
	if(type!="direct"){
		$('#respondModal_' + reviewId).appendTo("body").modal('show');
	}
}*/

function saveNoteForNotify(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForNotify_" + reviewId).val());
	var departmentOptionValue = $("#departmentForNotify_" + reviewId).val();
	var employeeOptionValue = $("#employeeForNotify_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForNotify_" + reviewId).val());
	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		$('#broadcastSuccessModalTitle').text("Alert");
		$('#broadcastSuccessModalText').text(
				"Mandatory fileds(*) are required !");
		$('#broadcastSuccessModal').modal('show');
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
			$('#broadcastSuccessModalTitle').text("Error");
			$('#broadcastSuccessModalText').text(
					"Something went wrong , please contact admin !");
			$('#broadcastSuccessModal').modal('show');
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
		$('#broadcastSuccessModalTitle').text("Alert");
		$('#broadcastSuccessModalText').text(
				"Mandatory fileds(*) are required !");
		$('#broadcastSuccessModal').modal('show');
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
					$('#broadcastSuccessModalTitle').text("Error");
					$('#broadcastSuccessModalText').text(
							"Something went wrong , please contact admin !");
					$('#broadcastSuccessModal').modal('show');
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
		$('#broadcastSuccessModalTitle').text("Alert");
		$('#broadcastSuccessModalText').text(
				"Mandatory fileds(*) are required !");
		$('#broadcastSuccessModal').modal('show');
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
			$('#broadcastSuccessModalTitle').text("Error");
			$('#broadcastSuccessModalText').text(
					"Something went wrong , please contact admin !");
			$('#broadcastSuccessModal').modal('show');
		}
	});
}


function cancelFlag(reviewSiteContentId) {
	$('#DELETED_REVIEW_REVIEWID_' + reviewSiteContentId).prop('checked', false);
	$('#INCORRECT_LANGUAGE_REVIEWID_' + reviewSiteContentId).prop('checked',
			false);
	$('#DUPLICATE_REVIEW_REVIEWID_' + reviewSiteContentId).prop('checked',
			false);
	$('#OTHER_REVIEWID_' + reviewSiteContentId).prop('checked', false);
	var organizationId = $('#organizationName option:selected').val();
	$.ajax({
		type : "GET",
		url : "../reviewSitesContent/fetchReview.htm?organizationId="
				+ organizationId + "&reviewSiteContentId="
				+ reviewSiteContentId,
		contentType : "application/json",
		success : function(response) {
			var reviewId = response.successObject.reviewSiteContentUI.id;
			var flagChkId = 'flagChkDiv_' + reviewId;
			var flags = response.successObject.reviewSiteContentUI.flags;
			for ( var key in flags) {
				var chkId = key + "_REVIEWID_" + reviewId;
				$('#' + chkId).prop('checked', true);
			}
			closeAction(reviewSiteContentId);
		},
		error : function(response) {
		}
	});
}
/*function getNotes(reviewSiteContentId, organizationId) {
	$("#" + "notesForReviewSiteContentId_" + reviewSiteContentId).hide();
	$("#notesForReviewSiteContentId_" + reviewSiteContentId).html('');
	$("#errorForReviewSiteContentId_" + reviewSiteContentId).html('');
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getNotes.htm?organizationId="
						+ organizationId + "&reviewSiteContentId="
						+ reviewSiteContentId,
				contentType : "application/json",
				success : function(response) {
					noteList = response.successObject.listNotes;
					var htmlCode = '';
					for (var i = 0; i < noteList.length; i++) {
						if (i > 1) {
							htmlCode += '<div style="display: none" class="extraNoteDivId'
									+ reviewSiteContentId + '">';
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
						if (i == noteList.length - 1 && noteList.length > 2) {
							htmlCode += '<a id="hideMoreHrefId'
									+ reviewSiteContentId
									+ '" href="javascript:void(0)" onclick="hideMore('
									+ reviewSiteContentId + ')">Hide</a>';
						}
						if (i == 1 && noteList.length > 2) {
							htmlCode += '<a id="viewMoreHrefId'
									+ reviewSiteContentId
									+ '" href="javascript:void(0)" onclick="showMore('
									+ reviewSiteContentId + ')">View More</a>';
						}
						htmlCode += '</div>' + '</div>';
						if (i > 1) {
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
function hideMore(reviewId) {
	
	 * var obj=document.getElementsByClassName('extraNoteDivId');
	 * obj.style.display = 'block';
	 
	$('#hideMoreHrefId' + reviewId).hide();
	$('#viewMoreHrefId' + reviewId).show();
	$(".extraNoteDivId" + reviewId).hide(300);
}
function showMore(reviewId) {
	
	 * var obj=document.getElementsByClassName('extraNoteDivId');
	 * obj.style.display = 'block';
	 
	$('#viewMoreHrefId' + reviewId).hide();
	$('#hideMoreHrefId' + reviewId).show();
	$(".extraNoteDivId" + reviewId).show(300);
}*/
/*function getComments(reviewSiteContentId, organizationId, obj) {
	actionType = $(obj).data('actiontype');
	$("#emailForTicketDiv_" + reviewSiteContentId).show();
	
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
	$('#wrapper').mask('Loading...');
	$('#leftNavigation,#header').mask();
	
	
	$.ajax({
				type : "GET",
				url : "../reviewSitesContent/getComments.htm?organizationId="+ organizationId + "&reviewSiteContentId="+ reviewSiteContentId + "&actionType=" + actionType,
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
									+ '</span>Priority <span class="VerySmallBoldGreyContent">'
									+ commentsList[i].priority
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
					$("#notesFor" + actionType + "_" + reviewSiteContentId).html('');
					$("#notesFor" + actionType + "_" + reviewSiteContentId).html(htmlCode);
					$("#notesFor" + actionType + "_" + reviewSiteContentId).show();
					$('#leftNavigation,#wrapper,#header').unmask();
				},
				error : function(response) {
				}
			});
}*/
/*******************************************************************************
 * ********************************* Check Box
 * ***************************************************************************
 ******************************************************************************/
function sourceIdsCheckBoxLength() {
	if ($('.sourceId:checked').length) {
		sourceIdsArray = [];
		$('.sourceId:checked').each(function() {
			sourceIdsArray.push($(this).val());
		});
	} else {
		sourceIdsArray = [];
	}
	return false;
}
function checkSavedFiltersCheckBox(sourceIdsArray) {
	var filterIdsArray = sourceIdsArray.split(',');
	for (var i = 0; i < filterIdsArray.length; i++) {
		$('#filterCheckBox_' + filterIdsArray[i]).prop('checked', true);
	}
}
/*******************************************************************************
 * ********************************Search
 * Functionality*******************************************************************
 ******************************************************************************/
$('#reviewsListForm').unbind('submit').bind('submit', function() {
	searchText = $.trim($('#searchText').val());
	filter(pageNo);
	return false;
});
$('#searchText').on('keyup', function() {
	searchText = $(this).val();
	return false;
});
/*******************************************************************************
 * ********************************Clear
 * Seach****************************************************************************
 ******************************************************************************/
function clearSearch() {
	$('#searchText').val('');
	searchText = "";
	$('#searchesDiv').show();
	filter(pageNo);
	return false;
}
/*******************************************************************************
 * ********************************Clear
 * Filter***************************************************************************
 ******************************************************************************/
function clearFilters() {
	$('.sourceId').prop('checked', false);
	sourceIdsArray = [];
	$('#searchesDiv').show();
	filter(pageNo);
}
function saveSearch() {
	$('.modal-content').mask("Loading...");
	var JSONObject = {};
	JSONObject['searchText'] = $.trim($('#searchText').val());
	JSONObject['searchTitle'] = $.trim($('#searchTitle').val());
	JSONObject['orgId'] = $('#organizationName option:selected').val();
	$
			.post(
					"../reviewSitesContent/saveSearch.htm",
					JSONObject,
					function(response) {
						if (response.status == "SAVE_ERROR") {
							$('#searchTitle-span-Error').html(
									response.errorMessage);
							$('.modal-content').unmask();
						} else if (response.status == "DUPLICATE_EXISTS") {
							$('#searchTitle-span-Error').html(
									response.errorMessage);
							$('.modal-content').unmask();
						} else if (response.status == "SAVE_SUCCESS") {
							var lastSavedSearch = response.successObject.lastSavedSearch;
							var html = "";
							html += '<tr id="tableRow" title='
									+ lastSavedSearch.searchText + '>';
							html += '<th><a href="#"  id="selectedSavedSearch">'
									+ lastSavedSearch.searchTitle + '</a></th>';
							html += '<th><span onclick="removeSearch(this,'
									+ lastSavedSearch.id
									+ ')">&nbsp;&nbsp;&nbsp;<img alt="" src="../resources/images/delete.png"></span></th>';
							html += '</tr>';
							$('#savedSearchTable tbody').append(html);
							$('#emptySearch').closest('tr').remove();
							clearSearch();
							alert("Search Saved Successfully");
							$('#saveSearchModal').modal('hide');
							$('.modal-content').unmask();
						} else {
							$('.modal-content').mask(
									"Something Wrong.Please Contact Admin");
						}
					}, 'json').fail(
					function(response) {
						$('.modal-content').mask(
								response.status + "*************"
										+ response.statusText);
					});
	return false;
}
	
function saveSearch() {
	var orgId = $('#organizationName option:selected').val();
	var searchTitle = $("#searchInput").val();
	savedSearches = {
		'orgId' : orgId,
		'searchText' : searchTitle,
		'searchTitle' : searchTitle
	};
	$
			.ajax({
				type : "POST",
				url : "../reviewSitesContent/saveSearch.htm",
				contentType : "application/json",
				data : JSON.stringify(savedSearches),
				success : function(response) {
					var htmlCode = '';
					if (response.status == "SAVE_SUCCESS") {
						savedSearches = response.successObject.savedSearches;
						for (var k = 0; k < savedSearches.length; k++) {
							htmlCode += '<div class="col-xs-12 SavedFilter">';
							htmlCode += '<button onclick="deleteSearch(\''
									+ savedSearches[k].id
									+ '\')" class="btn btn-default btn-xs btn-green">x</button>';
							htmlCode += '<a onclick="openSearch(\''
									+ savedSearches[k].searchText + '\')">'
									+ savedSearches[k].searchText + '</a>';
							htmlCode += '</div>';
						}
						$('#savedSearchesDiv').html(htmlCode);
						$("#searchInput").val('');
					} else {
						if (response.status == "SAVE_ERROR") {
							var htmlCode = '<div class="col-xs-12 SavedFilter"><font style="color: red">'
									+ response.errorMessage + ' !</font></div>';
							$('#saveSearchErrorDiv').html(htmlCode);
							$("#saveSearchErrorDiv").show();
						} else {
							if (response.status == "DUPLICATE_EXISTS") {
								var htmlCode = '<div class="col-xs-12 SavedFilter"><font style="color: red">'
										+ response.errorMessage
										+ ' !</font></div>';
								$('#saveSearchErrorDiv').html(htmlCode);
								$("#saveSearchErrorDiv").show();
							}
						}
					}
				},
				error : function(response) {
					$('#broadcastSuccessModalTitle').text("Error");
					$('#broadcastSuccessModalText').text(
							"Something went wrong , please contact admin !");
					$('#broadcastSuccessModal').modal('show');
				}
			});
}
/*******************************************************************************
 * ********************************Add
 * Note*******************************************************************************
 ******************************************************************************//*
function addNote(id) {
	$('.container').mask('Loading...');
	var organizationId = $('#organizationName option:selected').val();
	$.ajax({
		type : "GET",
		url : "../reviewSitesContent/addNote.htm?organizationId="
				+ organizationId,
		success : function(response) {
			$('#addNoteDiv').html('');
			$('#addNoteDiv').append(response);
			$('#reviewSiteContentId').val(id);
			$('#addNoteModal').modal('show');
			$('.container').unmask();
		},
		error : function(response) {
			$('.container').mask(
					response.status + "**************" + response.statusText);
		}
	});
	return false;
}*/
/*******************************************************************************
 * ********************************Flag***********************************************************************************
 ******************************************************************************/
function addFlag(id) {
	$('.container').mask('Loading...');
	var organizationId = $('#organizationName option:selected').val();
	var JSONObject = {
		'id' : id,
		'organizationId' : organizationId
	};
	$.ajax({
		type : "GET",
		url : "../reviewSitesContent/viewFlag.htm?id=" + id
				+ "&organizationId=" + organizationId,
		success : function(response) {
			$('#flagDiv').html('');
			$('#flagDiv').append(response);
			$('#reviewSiteContentIdForFlag').val(id);
			$('#flagModal').modal('show');
			$('.container').unmask();
		},
		error : function(response) {
			$('.container').mask(
					response.status + "**********" + response.statusText);
		}
	});
	return false;
}
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
		$('#broadcastSuccessModalTitle').text("Alert");
		$('#broadcastSuccessModalText').text("Please Select a reason !");
		$('#broadcastSuccessModal').modal('show');
		return false;
	}
	var organizationId = $('#organizationName option:selected').val();
	var comment = $('#flagCommentTxt').val();
	var JSONObject = {
		'reviewId' : reviewId,
		'organizationId' : organizationId,
		'flagStatus' : flagStatus,
		'flagComment' : comment
	};
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveFlag.htm",
		contentType : "application/json",
		data : JSON.stringify(JSONObject),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				$('#broadcastSuccessModalTitle').text("Success");
				$('#broadcastSuccessModalText')
						.text("Review has been flaged !");
				$('#broadcastSuccessModal').modal('show');
				closeAction(reviewId);
				return false;
			}
		},
		error : function(response) {
		}
	});
	return false;
}
function saveNote(reviewSiteContentId) {
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
// ***************************************************************************************************************//
// ***************************************Flag*****************************************************************//
function showFlag(reviewId) {
	var organizatonId = $('#organizationName option:selected').val();
	var JSONObject = {
		'id' : reviewId,
		'organizationId' : organizatonId
	};
	$('#viewDetailsFlagDiv').html('');
	$
			.ajax({
				type : "POST",
				url : "../reviewSitesContent/listFlag.htm",
				data : JSON.stringify(JSONObject),
				contentType : "application/json",
				success : function(response) {
					if (response.status == "FLAG_SUCCESS") {
						var listFlags = flagResponse(response);
						$('#viewDetailsFlagDiv').append(listFlags);
					} else if (response.status == "FLAG_EMPTY") {
						$('#viewDetailsFlagDiv')
								.append(
										'<h4 style="color:red" id="emptyFlag">No Flag Found</h4>');
						addFlagForViewDetails();
					} else {
						$('.container').mask(
								'<font style="color:red;">'
										+ response.errorMessage + '</font>');
					}
				},
				error : function(response) {
					$('.container').mask(
							response.status + "************"
									+ response.statusText);
				}
			});
}
function saveFlagForViewDetails() {
	$('#viewDetailsAddeFlagSuccessDiv').hide();
	$('#viewDetailsAddeFlagErrorDiv').hide();
	var flagStatus = "";
	if ($('#viewDetailsflagForm input[type=checkbox]:checked').length == 0) {
		$('#viewDetailsAddeFlagErrorDiv').show(600);
		return false;
	} else {
		$('#viewDetailsflagForm input[type=checkbox]:checked').each(function() {
			var value = $(this).val().replace(/_/g, ' ');// Replacing
			// UnderScore with
			// Space
			flagStatus = flagStatus + value + ",";
		});
	}
	/* $('.container').mask('Loading'); */
	var reviewId = $('#viewDetailsReviewId').val();
	var organizationId = $('#organizationName option:selected').val();
	flagStatus = flagStatus.substring(0, flagStatus.length - 1);
	var JSONObject = {
		'reviewId' : reviewId,
		'organizationId' : organizationId,
		'flagStatus' : flagStatus
	};
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/saveFlag.htm",
		contentType : "application/json",
		data : JSON.stringify(JSONObject),
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				$('#viewDetailsAddeFlagSuccessDiv').show(600);
				$('.container').unmask();
				showFlag(reviewId);
				// $('input:checkbox').removeAttr('checked');
				return false;
			} else {
				$('.container').mask(response.errorMessage);
			}
		},
		error : function(response) {
			$('.container').mask(
					response.status + "************" + response.statusText);
		}
	});
	return false;
}
function checkedFlags() {
	checkedFlagsArray = [];
	var rows = $('#flaggedValuesTable tr').length;
	for (var i = 0; i < rows; i++) {
		var checkedFlag = $('#flagValue_' + i).text();
		checkedFlag = checkedFlag.replace(/ /g, '_');
		checkedFlagsArray.push(checkedFlag);
	}
}
/*******************************************************************************
 * ********************************Back To
 * Reviews************************************************************************
 ******************************************************************************/
function backToReviews() {
	/* $('.container').mask('Loading...'); */
	$('#viewDetailsDiv').hide(600);
	$('#viewDetailsAddNoteForm,#viewDetailsAddActionForm').find('.form-group')
			.removeClass('has-error has-feedback');
	$('#viewDetailsAddNoteForm,#viewDetailsAddActionForm').find('.help-inline')
			.empty();
	$('#leftSideDiv').show(600);
	$('#hotelReviewsDivId').show(600);
	$('#organizationName').prop('disabled', false);
	$('#searchesDiv').show(600);
	$('.container').unmask('');
	addFlagButtonCounter = 0;
	addActionButtonCounter = 0;
	addNoteButtonCounter = 0;
	return false;
}
/*******************************************************************************
 * ********************************Clear Form
 * Values************************************************************************
 ******************************************************************************/
function clearForm(formId) {
	$("#" + formId + " input[type=text], textarea").val("");
	$('#' + formId).find('option:first').attr('selected', 'selected');
}
/*******************************************************************************
 * *********************************Notes
 * Filter**************************************************************************
 ******************************************************************************/
$('#filterNoteCheckBox').click(
		function() {
			$('#filterActionsCheckBoxDiv').find('input[type=checkbox]:checked')
					.removeAttr('checked');
			actionFilterArray = [];// Removing All Action Filter
			if ($(this).prop("checked") == true) {
				isNoteFilter = true;
				filter(pageNo);
			} else if ($(this).prop("checked") == false) {
				isNoteFilter = false;
				filter(pageNo);
			}
		});
/*******************************************************************************
 * *********************************Actions
 * Filter**************************************************************************
 ******************************************************************************/
$(document).on('click', "#selectAllActionFilterChkBox", function() {
	$('.actionFilterCheckBox').prop('checked', $(this).is(':checked'));
	actionFiltersCheckBoxLength();
	filter(pageNo);
});
$(document)
		.on(
				'click',
				".actionFilterCheckBox",
				function() {
					var actionFiltercheckBoxLength = $('.actionFilterCheckBox:checked').length;
					if ($('.actionFilterCheckBox:checked').length == $('.actionFilterCheckBox').length) {
						$('#selectAllActionFilterChkBox').prop('checked', true);
					} else {
						$('#selectAllActionFilterChkBox')
								.prop('checked', false);
					}
					if (actionFiltercheckBoxLength != 0) {
						actionFiltersCheckBoxLength();
						filter(pageNo);
					} else {
						actionFilterArray = [];
						filter(pageNo);
					}
				});
function actionFiltersCheckBoxLength() {
	// isNoteFilter = false;
	$('#filterNoteCheckBox').prop('checked', false);// Removing Notes Filter
	if ($('.actionFilterCheckBox:checked').length) {
		actionFilterArray = [];
		$('.actionFilterCheckBox:checked').each(function() {
			var actionType = '"' + $(this).val() + '"';
			actionFilterArray.push(actionType);
		});
	} else {
		actionFilterArray = [];
	}
	return false;
}
/*******************************************************************************
 * *********************************Flag
 * Filter**************************************************************************
 ******************************************************************************/
$(document).on('click', "#selectAllFlagFilterChkBox", function() {
	$('input[name="flag"]').prop('checked', $(this).is(':checked'));
	flagFiltersCheckBoxLength();
	filter(pageNo);
});
$(document)
		.on(
				'click',
				"input[name='flag']",
				function() {
					var flagFiltercheckBoxLength = $('input[name="flag"]:checked').length;
					if ($('input[name="flag"]:checked').length == $('input[name="flag"]').length) {
						$('#selectAllFlagFilterChkBox').prop('checked', true);
					} else {
						$('#selectAllFlagFilterChkBox').prop('checked', false);
					}
					if (flagFiltercheckBoxLength != 0) {
						flagFiltersCheckBoxLength();
						filter(pageNo);
					} else {
						flagFilterArray = [];
						filter(pageNo);
					}
				});
function flagFiltersCheckBoxLength() {
	if ($('input[name="flag"]:checked').length) {
		flagFilterArray = [];
		$('input[name="flag"]:checked').each(function() {
			var value = $(this).val().replace(/_/g, " ");// Replace
			// UnderScore With
			// Space
			flagFilterArray.push(value);
		});
	} else {
		flagFilterArray = [];
	}
	return false;
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
					//tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option data-mail="' + userList[k].userName + '" value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
				/*	if (userList.length == 0) {
						tempHtml += '<option disabled>No Employee Found</option>';
					}*/
					tempHtml += '</select>';
					$("#employeeDivForTask_" + reviewId).html(tempHtml);
				},
				error : function(response) {
					return false;
				}
			});
}
/*function populateEmployeesForTicket(obj) {
	
	$('#wrapper').mask('Loading...');
	$('#leftNavigation,#header').mask();
	
	
	
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
					
					if(userList.length>0){
						$("#emailForTicketDiv_"+reviewId).hide();
						$("#emailForTicket_"+reviewId).val("");
						$("#ccEmailsForTicket_"+reviewId).val("");
					}else{
						$("#emailForTicketDiv_"+reviewId).show();
					}
					
					tempHtml += '<select multiple id="employeeForTicket_' + reviewId
							+ '"  class="form-control input-sm employeeoption">';
					//tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option data-mail="' + userList[k].userName + '" value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
					if (userList.length == 0) {
						tempHtml += '<option disabled>No Employee Found</option>';
					}
					tempHtml += '</select>';
					$("#employeeDivForTicket_" + reviewId).html(tempHtml);
					$(".employeeoption").multiselect();
					$('#leftNavigation,#wrapper,#header').unmask();
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
	$.ajax({
				type : "GET",
				url : "../reviewSitesContent/getMappedUsersForDepartment.htm?organizationId="
						+ organizationId + "&departmentId=" + departmentId,
				contentType : "application/json",
				success : function(response) {
					var tempHtml = '';
					userList = response.successObject.users;
					tempHtml += '<select multiple id="employeeForNotify_' + reviewId
							+ '"  class="form-control input-sm employeeoption">';
					//tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option data-mail="' + userList[k].userName + '" value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
					/*if (userList.length == 0) {
						tempHtml += '<option disabled>No Employee Found</option>';
					}*/
					tempHtml += '</select>';
					$("#employeeDivForNotify_" + reviewId).html(tempHtml);
					$(".employeeoption").multiselect();
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
					//tempHtml += '<option disabled selected>Select a Employee</option>';
					for (var k = 0; k < userList.length; k++) {
						tempHtml += '<option data-mail="' + userList[k].userName + '" value="' + userList[k].id + '">'
								+ userList[k].userFirstName + '</option>';
					}
				/*	if (userList.length == 0) {
						tempHtml += '<option disabled>No Employee Found</option>';
					}*/
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
	if (filteredReviewsDuplicateResponseObject == null) {
		for (var i = 0; i < normalReviewsDuplicateResponseObject.successObject.listAll.length; i++) {
			if (normalReviewsDuplicateResponseObject.successObject.listAll[i].id == reviewId) {
				reviewContent = normalReviewsDuplicateResponseObject.successObject.listAll[i].reviewContent;
				break;
			}
		}
	} else {
		for (var i = 0; i < normalReviewsDuplicateResponseObject.successObject.listAll.length; i++) {
			if (normalReviewsDuplicateResponseObject.successObject.listAll[i].id == reviewId) {
				reviewContent = filteredReviewsDuplicateResponseObject.successObject.listAll[i].reviewContent;
				break;
			}
		}
	}
	var organizationId = $('#organizationName option:selected').val();
	var reviewSourceMapping = [];
	var shareDivId = "shareDiv" + reviewId;
	$('#' + shareDivId + ' input:checked').each(function() {
		reviewSourceMapping.push({
			'sourceId' : $(this).attr('value'),
			'sourceName' : $(this).data('sourcename'),
			'reviewId' : reviewId,
			'organizationId' : organizationId,
			'reviewContent' : reviewContent
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
	$
			.ajax({
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
			'organizationId' : organizationId
		};
	} else {
		reviewSitesContent = {
			'broadcastStatus' : false,
			'id' : reviewId,
			'organizationId' : organizationId
		};
	}
	$
			.ajax({
				type : "POST",
				url : "../reviewSitesContent/saveBroadcast.htm",
				contentType : "application/json",
				data : JSON.stringify(reviewSitesContent),
				success : function(response) {
					if (response.status == "SAVE_SUCCESS") {
						$('#broadcastSuccessModalTitle').text("Success");
						$('#broadcastSuccessModalText').text(
								"Broadcast status set successfully !");
						$('#broadcastSuccessModal').modal('show');
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
							"Something went wrong , please contact admin !");
					$('#broadcastSuccessModal').modal('show');
				}
			});
}
function loadFilterUI() {
	$("#saveSearchErrorDiv").hide();
	var flagsDivHtml = '';
	if (document.getElementById('duplicateFlagSpan') == null) {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input type="checkbox"  onclick="flag(this)" data-name="duplicateFlag" id="duplicateFlagChk" name="duplicateFlagChk" value="Duplicate Review">';
		flagsDivHtml += 'Duplicated review ';
		flagsDivHtml += '</label>';
	} else {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input checked type="checkbox" onclick="flag(this)" data-name="duplicateFlag"  id="duplicateFlagChk" name="duplicateFlagChk" value="Duplicate Review">';
		flagsDivHtml += 'Duplicated review ';
		flagsDivHtml += '</label>';
	}
	if (document.getElementById('languageFlagSpan') == null) {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input type="checkbox"  onclick="flag(this)" data-name="languageFlag" id="languageFlagChk" id="languageFlagChk" value="Language not correct">';
		flagsDivHtml += 'Language not correct';
		flagsDivHtml += '</label>';
	} else {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input type="checkbox"  onclick="flag(this)" data-name="languageFlag" checked id="languageFlagChk" id="languageFlagChk" value="Language not correct">';
		flagsDivHtml += 'Language not correct';
		flagsDivHtml += '</label>';
	}
	if (document.getElementById('deletedFlagSpan') == null) {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input type="checkbox"  onclick="flag(this)" data-name="deletedFlag" id="deletedFlagChk" name="deletedFlagChk" value="Review deleted from source">';
		flagsDivHtml += 'Review deleted from source ';
		flagsDivHtml += '</label>';
	} else {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input type="checkbox" onclick="flag(this)" data-name="deletedFlag" checked id="deletedFlagChk" name="deletedFlagChk" value="Review deleted from source">';
		flagsDivHtml += 'Review deleted from source ';
		flagsDivHtml += '</label>';
	}
	if (document.getElementById('otherFlagSpan') == null) {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input type="checkbox"  onclick="flag(this)" data-name="otherFlag" id="otherFlagChk" name="otherFlagChk" value="Other">';
		flagsDivHtml += 'Others';
		flagsDivHtml += '</label>';
	} else {
		flagsDivHtml += '<label class="col-xs-12">';
		flagsDivHtml += '<input type="checkbox" onclick="flag(this)" data-name="otherFlag" checked id="otherFlagChk" name="otherFlagChk" value="Other">';
		flagsDivHtml += 'Others';
		flagsDivHtml += '</label>';
	}
	$('#flagsDiv').html(flagsDivHtml);
	var broadcastDivHtml = '';
	if (document.getElementById('broadcastSpan') == null) {
		broadcastDivHtml += '<label class="col-xs-12 OtherFilterFilterOptionGroup">';
		broadcastDivHtml += '<input onclick="broadcast(this)" data-name="broadcast" type="checkbox" id="broadcastChk" name="broadcastChk" value="Broadcasted">';
		broadcastDivHtml += 'Broadcast';
		broadcastDivHtml += '</label>';
	} else {
		broadcastDivHtml += '<label class="col-xs-12 OtherFilterFilterOptionGroup">';
		broadcastDivHtml += '<input onclick="broadcast(this)" checked data-name="broadcast" type="checkbox" id="broadcastChk" name="broadcastChk" value="Broadcasted">';
		broadcastDivHtml += 'Broadcast';
		broadcastDivHtml += '</label>';
	}
	$('#broadcastChkDiv').html(broadcastDivHtml);
	
	/*************************respond to review new filter option code********************************************************/
	var respondFilterDivHtml = '';
	if (document.getElementById('respondedSpan') == null) {
		respondFilterDivHtml += '<label class="col-xs-12">';
		respondFilterDivHtml += '<input type="checkbox"  onclick="responded(this)" data-name="responded" id="respondedChk" name="respondedChk" value="responded">';
		respondFilterDivHtml += '<span id="respondedLbl">Yes</span>';
		respondFilterDivHtml += '</label>';
	} else {
		respondFilterDivHtml += '<label class="col-xs-12">';
		respondFilterDivHtml += '<input type="checkbox"  checked onclick="responded(this)" data-name="responded" checked id="respondedChk" name="respondedChk" value="responded">';
		respondFilterDivHtml += '<span id="respondedLbl">Yes</span>';
		respondFilterDivHtml += '</label>';
	}
	if (document.getElementById('notRespondedSpan') == null) {
		respondFilterDivHtml += '<label class="col-xs-12">';
		respondFilterDivHtml += '<input type="checkbox" onclick="responded(this)" data-name="notResponded"  id="notRespondedChk" name="notRespondedChk" value="notResponded">';
		respondFilterDivHtml += '<span id="notRespondedLbl">No</span>';
		respondFilterDivHtml += '</label>';
	} else {
		respondFilterDivHtml += '<label class="col-xs-12">';
		respondFilterDivHtml += '<input type="checkbox" checked onclick="responded(this)" data-name="notResponded" checked id="notRespondedChk" name="notRespondedChk" value="notResponded">';
		respondFilterDivHtml += '<span id="notRespondedLbl">No</span>';
		respondFilterDivHtml += '</label>';
	}
	$('#respondChkDiv').html(respondFilterDivHtml);
	
	/*******************************mark read to review new filter option code**************************************************/
	var markReadFilterDivHtml = '';
	if (document.getElementById('readSpan') == null) {
		markReadFilterDivHtml += '<label class="col-xs-12">';
		markReadFilterDivHtml += '<input type="checkbox" value="read" name="readChk" id="readChk" data-name="read" onclick="markRead(this)">';
		markReadFilterDivHtml += '<span id="respondedLbl">Read</span>';
		markReadFilterDivHtml += '</label>';
	} else {
		markReadFilterDivHtml += '<label class="col-xs-12">';
		markReadFilterDivHtml += '<input type="checkbox" checked value="read" name="readChk" id="readChk" data-name="read" onclick="markRead(this)">';
		
		markReadFilterDivHtml += '<span id="respondedLbl">Read</span>';
		markReadFilterDivHtml += '</label>';
	}
	if (document.getElementById('unreadSpan') == null) {
		markReadFilterDivHtml += '<label class="col-xs-12">';
		markReadFilterDivHtml += '<input type="checkbox" value="unread" name="unreadChk" id="unreadChk" data-name="unread" onclick="markRead(this)">';
		markReadFilterDivHtml += '<span id="notRespondedLbl">Unread</span>';
		markReadFilterDivHtml += '</label>';
	} else {
		markReadFilterDivHtml += '<label class="col-xs-12">';
		markReadFilterDivHtml += '<input type="checkbox" checked value="unread" name="unreadChk" id="unreadChk" data-name="unread" onclick="markRead(this)">';
		markReadFilterDivHtml += '<span id="notRespondedLbl">Unread</span>';
		markReadFilterDivHtml += '</label>';
	}
	$('#markReadChkDiv').html(markReadFilterDivHtml);
	/*********************************************************************************/
	
	var sharedDivHtml = '';
	if (document.getElementById('sharedSpan') == null) {
		sharedDivHtml += '<label class="col-xs-12 OtherFilterFilterOptionGroup">';
		sharedDivHtml += '<input onclick="shared(this)" data-name="shared" type="checkbox"  id="sharedChk" name="sharedChk" value="Shared">';
		sharedDivHtml += 'Shared';
		sharedDivHtml += '</label>';
	} else {
		sharedDivHtml += '<label class="col-xs-12 OtherFilterFilterOptionGroup">';
		sharedDivHtml += '<input checked onclick="shared(this)" data-name="shared" type="checkbox"  id="sharedChk" name="sharedChk" value="Shared">';
		sharedDivHtml += 'Shared';
		sharedDivHtml += '</label>';
	}
	$('#sharedChkDiv').html(sharedDivHtml);
	var noteDivHtml = '';
	if (document.getElementById('noteSpan') == null) {
		noteDivHtml += '<label class="col-xs-12 OtherFilterFilterOptionGroup">';
		noteDivHtml += '<input type="checkbox"  onclick="note(this)" data-name="note" id="noteChk" name="noteChk" value="Quick Notes">';
		noteDivHtml += 'Quick Note';
		noteDivHtml += '</label>';
	} else {
		noteDivHtml += '<label class="col-xs-12 OtherFilterFilterOptionGroup">';
		noteDivHtml += '<input type="checkbox" checked  onclick="note(this)" data-name="note" id="noteChk" name="noteChk" value="Quick Notes">';
		noteDivHtml += 'Quick Note';
		noteDivHtml += '</label>';
	}
	$('#noteChkDiv').html(noteDivHtml);
	var actionDivHtml = '';
	if (document.getElementById('ticketSpan') == null) {
		actionDivHtml += '<label class="col-xs-12">';
		actionDivHtml += '<input type="checkbox" onclick="action(this)" data-name="ticket" id="ticketChk" name="ticketChk" value="Raise a Ticket">';
		actionDivHtml += 'Raise a ticket';
		actionDivHtml += '</label>';
	} else {
		actionDivHtml += '<label class="col-xs-12">';
		actionDivHtml += '<input type="checkbox" onclick="action(this)" data-name="ticket" checked id="ticketChk" name="ticketChk" value="Raise a Ticket">';
		actionDivHtml += 'Raise a ticket';
		actionDivHtml += '</label>';
	}
	$('#actionChkDiv').html(actionDivHtml);
	var reviewTypeDivHtml = '';
	if (document.getElementById('textSpan') == null) {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox"  onclick="reviewType(this)" data-name="text" id="textChk" name="textChk" value="Text">';
		reviewTypeDivHtml += 'Text';
		reviewTypeDivHtml += '</label>';
	} else {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox"  checked onclick="reviewType(this)" data-name="text" checked id="textChk" name="textChk" value="Text">';
		reviewTypeDivHtml += 'Text';
		reviewTypeDivHtml += '</label>';
	}
	if (document.getElementById('audioSpan') == null) {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" onclick="reviewType(this)" data-name="audio"  id="audioChk" name="audioChk" value="audio">';
		reviewTypeDivHtml += 'Audio';
		reviewTypeDivHtml += '</label>';
	} else {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" checked onclick="reviewType(this)" data-name="audio" checked id="audioChk" name="audioChk" value="audio">';
		reviewTypeDivHtml += 'Audio';
		reviewTypeDivHtml += '</label>';
	}
	if (document.getElementById('videoSpan') == null) {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" onclick="reviewType(this)" data-name="video"  id="videoChk" name="videoChk" value="video">';
		reviewTypeDivHtml += 'Video';
		reviewTypeDivHtml += '</label>';
	} else {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox"  checked onclick="reviewType(this)" data-name="video" checked id="videoChk" name="videoChk" value="video">';
		reviewTypeDivHtml += 'Video';
		reviewTypeDivHtml += '</label>';
	}
	if (document.getElementById('pictorialSpan') == null) {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox"  onclick="reviewType(this)" data-name="pictorial"  id="pictorialChk" name="pictorialChk" value="pictorial">';
		reviewTypeDivHtml += 'Pictorial';
		reviewTypeDivHtml += '</label>';
	} else {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" checked onclick="reviewType(this)" data-name="pictorial" checked id="pictorialChk" name="pictorialChk" value="pictorial">';
		reviewTypeDivHtml += 'Pictorial';
		reviewTypeDivHtml += '</label>';
	}
	$('#reviewTypeChkDiv').html(reviewTypeDivHtml);
	var polarityDivHtml = '';
	if (document.getElementById('positiveSpan') == null) {
		polarityDivHtml += '<label class="col-xs-12">';
		polarityDivHtml += '<input type="checkbox"  onclick="polarity(this)" data-name="positive" id="positiveChk" name="positiveChk" value="positive">';
		polarityDivHtml += 'Positive <span id="positive_reviews_countSpan"></span>';
		polarityDivHtml += '</label>';
	} else {
		polarityDivHtml += '<label class="col-xs-12">';
		polarityDivHtml += '<input type="checkbox"  checked onclick="polarity(this)" data-name="positive" checked id="positiveChk" name="positiveChk" value="positive">';
		polarityDivHtml += 'Positive <span id="positive_reviews_countSpan"></span>';
		polarityDivHtml += '</label>';
	}
	if (document.getElementById('negativeSpan') == null) {
		polarityDivHtml += '<label class="col-xs-12">';
		polarityDivHtml += '<input type="checkbox" onclick="polarity(this)" data-name="negative"  id="negativeChk" name="negativeChk" value="negative">';
		polarityDivHtml += 'Negative <span id="negative_reviews_countSpan"></span>';
		polarityDivHtml += '</label>';
	} else {
		polarityDivHtml += '<label class="col-xs-12">';
		polarityDivHtml += '<input type="checkbox" checked onclick="polarity(this)" data-name="negative" checked id="negativeChk" name="negativeChk" value="negative">';
		polarityDivHtml += 'Negative <span id="negative_reviews_countSpan"></span>';
		polarityDivHtml += '</label>';
	}
	if (document.getElementById('neutralSpan') == null) {
		polarityDivHtml += '<label class="col-xs-12">';
		polarityDivHtml += '<input type="checkbox" onclick="polarity(this)" data-name="neutral"  id="neutralChk" name="neutralChk" value="neutral">';
		polarityDivHtml += 'Neutral <span id="neutral_reviews_countSpan"></span>';
		polarityDivHtml += '</label>';
	} else {
		polarityDivHtml += '<label class="col-xs-12">';
		polarityDivHtml += '<input type="checkbox"  checked onclick="polarity(this)" data-name="neutral" checked id="neutralChk" name="neutralChk" value="neutral">';
		polarityDivHtml += 'Neutral <span id="neutral_reviews_countSpan"></span>';
		polarityDivHtml += '</label>';
	}
	$('#polarityChkDiv').html(polarityDivHtml);
	var orgId = $('#organizationName option:selected').val();
	if(document.getElementById("languageOption")==undefined){
					languagesList = window['languages'];
					var htmlCode = '<select id="languageOption" class="form-control input-sm" name="languageOption" multiple>';
					//htmlCode += '<option selected>All</option>';
					for (var i = 0; i < languagesList.length; i++) {
						htmlCode += '<option value="'+ languagesList[i].languageName
						+ '">'	+ languagesList[i].languageName + '</option>';
					}
					htmlCode += '</select>';
					$('#languageDiv').html(htmlCode);
					$("#languageOption").multiselect(
							{click: function(event, ui){
								var languageName = ui.value;
								//var chkId = languageName + "Chk".replace("/","_");
								var spanId = languageName + "Span";
								spanId=spanId.replace("/","_");
								if (ui.checked) {
										var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'+ languageName; 
										var updatedOpt="";
										for( var key in window['countsMap'].language_count){
											key=key.replace("/","_");
											var spanId2=key+"Span";
											//alert("spanId2 "+spanId2+" spanId "+spanId);
											if(spanId2==spanId){
												updatedOpt=' <font color="red">'+$(window['countsMap'].language_count).prop(key.replace("_","/"))+'</font> ';
											}
										}
										htmlCode+=updatedOpt;
										htmlCode+='</span> ';
//										htmlCode+='<button onclick="removeLanguage(\'' + spanId	+ '\')" class="btn">x</button></span> ';
										$('#selectedFiltersDiv').prepend(htmlCode);
								} else {
									//$('#' + chkId).attr('checked', false);
									$('#' + spanId).remove();
									/* loadFilterUI(); */
								}
							}
						}
					);
			/*	},
				error : function(response) {
					return false;
				}
		});*/
	}else{
			for( var key in window['countsMap'].language_count){
				var _value=$(window['countsMap'].language_count).prop(key);
				var updatedOpt=key+"<font color='red'> ("+_value+")</font>";
				$('select[name="languageOption"] option[value="'+_value+'"]').html(" "+updatedOpt);
				
				$('ul[class="ui-multiselect-checkboxes ui-helper-reset"] li span').map(function(){
						var oldCount=$(this).text().split(" ");
					    if(key==oldCount[1]){
					    	$(this).html(" "+updatedOpt);
					    }
			});
			}
	}
	
	
	
					var sourceList = window['sources'];
					var htmlCode = '<h4 class="col-xs-12">Review Source</h4>';
					for (var i = 0; i < sourceList.length; i++) {
						if (sourceList[i].sourceType == "ReviewSite") {
							htmlCode += '<label class="col-xs-12">';
							if (document.getElementById(sourceList[i].sourceName.toLowerCase()+ 'SourceSpan') != null) {
								htmlCode += '<input checked id="' + sourceList[i].sourceName.toLowerCase() + 'Source" onclick="source(this)" type="checkbox" value="' + sourceList[i].sourceName + '">';
							} else {
								htmlCode += '<input  id="' + sourceList[i].sourceName.toLowerCase() + 'Source" onclick="source(this)" type="checkbox" value="' + sourceList[i].sourceName + '">';
							}
							htmlCode += '' + sourceList[i].sourceName + '<span id='+sourceList[i].sourceName+'Span></span>';
							htmlCode += '</label>';
						}
					}
					$('#sourcesDiv').html(htmlCode);
					
				/*	for (var i = 0; i < window['countsMap'].length; i++) {
						$('#'+sourceList[i].sourceName+'Span').text('('+window[sourceList[i].sourceName]+')');
					}*/
					for( var key in window['countsMap'].polarity_count){
						$('#'+key+'Span').text('');
						var updatedOpt='<font color="red">('+$(window['countsMap'].polarity_count).prop(key)+')</font>';
						$('#'+key.trim()+'Span').html(" "+updatedOpt);
					}
					for( var key in window['countsMap'].sources_count){
						$('#'+key+'Span').text('');
						var updatedOpt='<font color="red">('+$(window['countsMap'].sources_count).prop(key)+')</font>';
						$('#'+key.trim()+'Span').html(" "+updatedOpt);
					}
					
					for( var key in window['countsMap'].language_count){
						var _value=$(window['countsMap'].language_count).prop(key);
						var updatedOpt=key+"<font color='red'> ("+_value+")</font>";
						$('select[name="languageOption"] option[value="'+_value+'"]').html(" "+updatedOpt);
						
						$('ul[class="ui-multiselect-checkboxes ui-helper-reset"] li span').map(function(){
							    if(key==$(this).text()){
							    	$(this).html(" "+updatedOpt);
							    }
						});
					}
			/*	},
				error : function(response) {
					return false;
				}
			});*/
	
			$.ajax({
				type : "GET",
				url : "../reviewSitesContent/getsavedFilters.htm?organizationId="
						+ orgId,
				contentType : "application/json",
				success : function(response) {
					var htmlCode = '';
					var savedFilters = response.successObject.savedFilters;
					for (var k = 0; k < savedFilters.length; k++) {
						htmlCode += '<div class="col-xs-12 SavedFilter">';
						htmlCode += '<button onclick="deleteFilter(\''
								+ savedFilters[k].id
								+ '\')" class="btn btn-default btn-xs btn-green">x</button>';
						htmlCode += '<a onclick="openFilter(\''
								+ savedFilters[k].filters + '\')">'
								+ savedFilters[k].filterName + '</a>';
						htmlCode += '</div>';
					}
					$('#savedFiltersDiv').html(htmlCode);
				},
				error : function(response) {
					return false;
				}
			});
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/getSavedSearches.htm?organizationId="
						+ orgId,
				contentType : "application/json",
				success : function(response) {
					var htmlCode = '';
					var savedSearches = response.successObject.savedSearches;
					for (var k = 0; k < savedSearches.length; k++) {
						htmlCode += '<div class="col-xs-12 SavedFilter">';
						htmlCode += '<button onclick="deleteSearch(\''
								+ savedSearches[k].id
								+ '\')" class="btn btn-default btn-xs btn-green">x</button>';
						htmlCode += '<a onclick="openSearch(\''
								+ savedSearches[k].searchText + '\')">'
								+ savedSearches[k].searchText + '</a>';
						htmlCode += '</div>';
					}
					$('#savedSearchesDiv').html(htmlCode);
				},
				error : function(response) {
					return false;
				}
			});
	
	$("#respondedLbl").html("Yes("+$(window['countsMap'].replied_count).prop("yes")+")");
	$("#notRespondedLbl").html("No("+$(window['countsMap'].replied_count).prop("no")+")");
	
/*	var formattedFromDate = getFormattedDate(sessionFromDate);
	var formattedToDate =  getFormattedDate(sessionToDate);
	$.ajax({
		type : "GET",
		url : "../reviewSitesContent/getAllCountForFilter.htm?organizationId="
				+ orgId+"&from="+formattedFromDate+"&to="+formattedToDate,
		contentType : "application/json",
		success : function(response) {
			var totalCount = parseInt(response.successObject.totalReviewCount);
			var respondedCount = parseInt(response.successObject.respondedCount);
			$("#respondedLbl").html("Yes("+respondedCount+")");
			$("#notRespondedLbl").html("No("+(totalCount-respondedCount)+")");
		},
		error : function(response) {
			return false;
		}
	});*/
	
	/*$('#positive_reviews_count_span').text('');
	$('#negative_reviews_count_span').text('');
	$('#neutral_reviews_count_span').text('');
	
	$('#positive_reviews_count_span').text('('+positive_reviews_count+')');
	$('#negative_reviews_count_span').text('('+negative_reviews_count+')');
	$('#neutral_reviews_count_span').text('('+neutral_reviews_count+')');*/
}

function getFormattedDate(date) {
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	return year + '-' + month + '-' + day;
}

function saveFilter() {
	var selected = "";
	$('#filterChkBoxes input:checked').each(function() {
		selected += $(this).attr('value') + "|";
	});
	/*$('#languageOption input:checked').each(function() {
		selected += $(this).attr('text') + "|";
	});*/
	

	    $('#languageOption option:selected').each(function(){
	    	selected +=this.value+"|" ;
	    });

	    selected=selected.substring(0, selected.length - 1);
	//selected += $("#languageOption option:selected").text();
	var orgId = $('#organizationName option:selected').val();
	var filterName = $("#filterName").val();
	if (filterName == "" || filterName == null) {
		$('#broadcastSuccessModalTitle').text("Alert");
		$('#broadcastSuccessModalText').text("Please enter filter name");
		$('#broadcastSuccessModal').modal('show');
		return;
	}
	savedFilters = {
		'filters' : selected,
		'filterName' : filterName,
		'orgId' : orgId
	};
	//console.log(savedFilters);
	$.ajax({
				type : "POST",
				url : "../reviewSitesContent/saveFilter.htm",
				contentType : "application/json",
				data : JSON.stringify(savedFilters),
				success : function(response) {
					var htmlCode = '';
					if (response.status == "SAVE_SUCCESS") {
						savedFiltersForOrganization = response.successObject.savedFiltersForOrganization;
						for (var k = 0; k < savedFiltersForOrganization.length; k++) {
							htmlCode += '<div class="col-xs-12 SavedFilter">';
							htmlCode += '<button onclick="deleteFilter(\''
									+ savedFiltersForOrganization[k].id
									+ '\')" class="btn btn-default btn-xs btn-green">x</button>';
							htmlCode += '<a onclick="openFilter(\''
									+ savedFiltersForOrganization[k].filters
									+ '\')">'
									+ savedFiltersForOrganization[k].filterName
									+ '</a>';
							htmlCode += '</div>';
						}
						$('#savedFiltersDiv').html(htmlCode);
						$("#filterName").val('');
						$("#filterChkBoxes").find('input[type=checkbox]').each(
								function() {
									this.checked = false;
								});
						$('#languageOption').prop('selectedIndex', 0);
					}
				},
				error : function(response) {
					$('#broadcastSuccessModalTitle').text("Error");
					$('#broadcastSuccessModalText').text(
							"Something went wrong , please contact admin !");
					$('#broadcastSuccessModal').modal('show');
				}
			});
}
function openFilter(filters) {
	$("#filterChkBoxes").find('input[type=checkbox]').each(function() {
		/* this.checked = false; */
		/* $(this).prop('checked', false); */
		$(this).attr('checked', false).triggerHandler('click');
	});
	var filtersArray = filters.split('|');
	$("#filterChkBoxes").find('input[type=checkbox]').each(function() {
		for (var i = 0; i < filtersArray.length; i++) {
			if (filtersArray[i] == this.value) {
				/* this.checked = true; */
				/* $(this).prop('checked', true); */
				$(this).trigger('click');
			}
		}
	});
	var languageOptionValue = filtersArray[filtersArray.length - 1];
	$("#languageOption > option").each(function() {
		if (languageOptionValue == this.value) {
			$('[name=languageOption]').val(this.value);
		}
	});
}
function openSearch(searchText) {
	$('#searchInput').val(searchText);
	$('#searchInput').keyup();
	$('#filterModal').modal('hide');
}
function deleteFilter(filterId) {
	var orgId = $('#organizationName option:selected').val();
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/deleteFilter.htm?filterId="
						+ filterId + "&organizationId=" + orgId,
				contentType : "application/json",
				success : function(response) {
					var htmlCode = '';
					var savedFilters = response.successObject.savedFilters;
					for (var k = 0; k < savedFilters.length; k++) {
						htmlCode += '<div class="col-xs-12 SavedFilter">';
						htmlCode += '<button onclick="deleteFilter(\''
								+ savedFilters[k].id
								+ '\')" class="btn btn-default btn-xs btn-green">x</button>';
						htmlCode += '<a onclick="openFilter(\''
								+ savedFilters[k].filters + '\')">'
								+ savedFilters[k].filterName + '</a>';
						htmlCode += '</div>';
					}
					$('#savedFiltersDiv').html(htmlCode);
				},
				error : function(response) {
					return false;
				}
			});
}
function deleteSearch(id) {
	var orgId = $('#organizationName option:selected').val();
	$
			.ajax({
				type : "GET",
				url : "../reviewSitesContent/deleteSearch.htm?id=" + id
						+ "&organizationId=" + orgId,
				contentType : "application/json",
				success : function(response) {
					var htmlCode = '';
					var savedSearches = response.successObject.savedSearches;
					for (var k = 0; k < savedSearches.length; k++) {
						htmlCode += '<div class="col-xs-12 SavedFilter">';
						htmlCode += '<button onclick="deleteSearch(\''
								+ savedSearches[k].id
								+ '\')" class="btn btn-default btn-xs btn-green">x</button>';
						htmlCode += '<a onclick="openFilter(\''
								+ savedSearches[k].searchText + '\')">'
								+ savedSearches[k].searchText + '</a>';
						htmlCode += '</div>';
					}
					$('#savedSearchesDiv').html(htmlCode);
				},
				error : function(response) {
					return false;
				}
			});
}
function polarity(obj) {
	var polarityName = $(obj).data('name');
	var chkId = polarityName + "Chk";
	var spanId = polarityName + "Span";
	if ($(obj).prop('checked')) {
		var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
							+ polarityName+" <font color='red'> "+$(window['countsMap'].polarity_count).prop(polarityName+"_reviews_count")
					 + '</font></span>';
		/* + '</font> <button onclick="removeTag(\'' + spanId+ '\')" class="btn">x</button></span>';*/
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
	
	for( var key in window['countsMap']){
		$('#'+key+'Span').text('');
		var updatedOpt='<font color="red">('+$(window['countsMap'].polarity_count).prop(key)+')</font>';
		$('#'+key.trim()+'Span').html(" "+updatedOpt);
	}
	
}
function responded(obj) {
	var respondName = $(obj).data('name');
	var chkId = respondName + "Chk";
	var spanId = respondName + "Span";
	if ($(obj).prop('checked')) {
		var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
				+ respondName 
//				+ '<button onclick="removeTag(\'' + spanId + '\')" class="btn">x</button></span>';
				+ '</span>';
		
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function markRead(obj) {
	var markReadName = $(obj).data('name');
	var chkId = markReadName + "Chk";
	var spanId = markReadName + "Span";
	if ($(obj).prop('checked')) {
		var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
//				+ markReadName + '<button onclick="removeTag(\'' + spanId + '\')" class="btn">x</button></span>';
		+ markReadName + '</span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function broadcast(obj) {
	var name = $(obj).data('name');
	var chkId = name + "Chk";
	var spanId = name + "Span";
	if ($(obj).prop('checked')) {
//		var htmlCode = '<span id="broadcastSpan" class="ReviewFilterOutput">Broadcast<button onclick="removeTag(\'broadcastSpan\')" class="btn">x</button></span>';
		var htmlCode = '<span id="broadcastSpan" class="ReviewFilterOutput">Broadcast</span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}

function shared(obj) {
	var name = $(obj).data('name');
	var chkId = name + "Chk";
	var spanId = name + "Span";
	if ($(obj).prop('checked')) {
//		var htmlCode = '<span id="sharedSpan" class="ReviewFilterOutput">Shared<button onclick="removeTag(\'sharedSpan\')" class="btn">x</button></span>';
		var htmlCode = '<span id="sharedSpan" class="ReviewFilterOutput">Shared</span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function note(obj) {
	var name = $(obj).data('name');
	var chkId = name + "Chk";
	var spanId = name + "Span";
	if ($(obj).prop('checked')) {
//		var htmlCode = '<span id="noteSpan" class="ReviewFilterOutput">Note<button onclick="removeTag(\'noteSpan\')" class="btn">x</button></span>';
		var htmlCode = '<span id="noteSpan" class="ReviewFilterOutput">Note</span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function reviewType(obj) {
	var reviewTypeName = $(obj).data('name');
	var chkId = reviewTypeName + "Chk";
	var spanId = reviewTypeName + "Span";
	if ($(obj).prop('checked')) {
		var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
//				+ reviewTypeName + '<button onclick="removeTag(\'' + spanId + '\')" class="btn">x</button></span>';
		+ reviewTypeName + '</span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function action(obj) {
	var actionName = $(obj).data('name');
	var chkId = actionName + "Chk";
	var spanId = actionName + "Span";
	if ($(obj).prop('checked')) {
		var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
//				+ actionName + '<button onclick="removeTag(\'' + spanId + '\')" class="btn">x</button></span>';
		+ actionName + '</span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function flag(obj) {
	var flagName = $(obj).data('name');
	var chkId = flagName + "Chk";
	var spanId = flagName + "Span";
	if ($(obj).prop('checked')) {
		var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
				+ flagName + '</span>';
//		+ flagName + '<button onclick="removeTag(\'' + spanId + '\')" class="btn">x</button></span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function source(obj) {
	var id = $(obj).attr("id");
	var chkId = id + "Chk";
	var spanId = id + "Span";
	var sourceName = id.substring(0, id.length - 6);
	var key = $(obj).attr("value");
	
	if ($(obj).prop('checked')) {
		var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
				+ sourceName +"<font color='red'> "+$(window['countsMap'].sources_count).prop(key)+'</font> </span>';
//		+ sourceName +"<font color='red'> "+$(window['countsMap'].sources_count).prop(key)+'</font> <button onclick="removeTag(\'' + spanId + '\')" class="btn">x</button></span>';
		$('#selectedFiltersDiv').prepend(htmlCode);
	} else {
		$('#' + chkId).attr('checked', false);
		$('#' + spanId).remove();
		/* loadFilterUI(); */
	}
}
function removeTag(id) {
	$('#' + id).attr('checked', false);
	$('#' + id).remove();
	$.ajax({
		url : loadFilterUI(),
		success : function() {
			filter(pageNo);
		}
	});
}
function removeLanguage(spanId){
	 $('ul[class="ui-multiselect-checkboxes ui-helper-reset"] li input[type=checkbox]').map(function(){
		 	var spanId2=$(this).attr("value")+"Span";
		 	spanId2=spanId2.replace("/","_");
			if(spanId==spanId2){
			   this.click();
				$.ajax({
					url : loadFilterUI(),
					success : function() {
						filter(pageNo);
					}
				});
		   }
	 });
}
function filter(pageNo) {
	var polarities = [];
	var responds = [];
	var respondStatus=null;
	var reads = [];
	var markReadStatus=null;
	var reviewTypes = [];
	var languages = [];
	var sources = [];
	var actions = [];
	var flags = [];
	var broadcast = false;
	var shared = false;
	var quicknote = false;
	//language = $('#languageOption option:selected').val(); // 3
	var fromDate = $('#altFromDate').val();
	var searchText = $('#searchInput').val();
	var toDate = $('#altToDate').val();
	var organizationId = $('#organizationName option:selected').val();
	if ($('#textChk').prop('checked')) { // 2
		reviewTypes.push($('#textChk').val());
	}
	if ($('#audioChk').prop('checked')) { // 2
		reviewTypes.push($('#audioChk').val());
	}
	if ($('#videoChk').prop('checked')) { // 2
		reviewTypes.push($('#videoChk').val());
	}
	if ($('#pictorialChk').prop('checked')) { // 2
		reviewTypes.push($('#pictorialChk').val());
	}
	if ($('#generalChk').prop('checked')) { // 7
		/* actions.push($('#generalChk').val()); */
		actions.push("General");
	}
	if ($('#ticketChk').prop('checked')) { // 7
		/* actions.push($('#ticketChk').val()); */
		actions.push("Ticket");
	}
	if ($('#taskChk').prop('checked')) { // 7
		/* actions.push($('#taskChk').val()); */
		actions.push("Task");
	}
	if ($('#notifyChk').prop('checked')) { // 7
		/* actions.push($('#notifyChk').val()); */
		actions.push("Notify");
	}
	if ($('#duplicateFlagChk').prop('checked')) { // 9
		flags.push('DUPLICATE_REVIEW');
	}
	if ($('#deletedFlagChk').prop('checked')) { // 9
		flags.push('DELETED_REVIEW');
	}
	if ($('#languageFlagChk').prop('checked')) { // 9
		flags.push('LANGUAGE_NOT_CORRECT_REVIEW');
	}
	if ($('#otherFlagChk').prop('checked')) { // 9
		flags.push('OTHER_REVIEW');
	}
	if ($('#positiveChk').prop('checked')) { // 1
		polarities.push($('#positiveChk').val());
	}
	if ($('#neutralChk').prop('checked')) { // 1
		polarities.push($('#neutralChk').val());
	}
	if ($('#negativeChk').prop('checked')) { // 1
		polarities.push($('#negativeChk').val());
	}
	
	if ($('#respondedChk').prop('checked')) { // 1
		responds.push($('#respondedChk').val());
	}
	if ($('#notRespondedChk').prop('checked')) { // 1
		responds.push($('#notRespondedChk').val());
	}
	
	if(responds!=null && responds.length<2){
		if(responds[0]=="notResponded"){
			respondStatus=false;
		}
		if(responds[0]=="responded"){
			respondStatus=true;
		}
	}
	
	if ($('#readChk').prop('checked')) { // 1
		reads.push($('#readChk').val());
	}
	if ($('#unreadChk').prop('checked')) { // 1
		reads.push($('#unreadChk').val());
	}
	
	if(reads!=null && reads.length<2){
		if(reads[0]=="unread"){
			markReadStatus=false;
		}
		if(reads[0]=="read"){
			markReadStatus=true;
		}
	}
	
	if ($('#sharedChk').prop('checked')) { // 5
		shared = true;
	}
	if ($('#noteChk').prop('checked')) { // 6
		quicknote = true;
	}
	if ($('#broadcastChk').prop('checked')) { // 8
		broadcast = true;
	}
	$("#sourcesDiv").find('input[type=checkbox]').each(function() { // 4
		if (this.checked == true) {
			sources.push(this.value);
		}
	});
	
	var languages = $("#languageOption").val();
	if(languages==null){
		languages=[];
	}
	var sortByParam = $('#sortSelectOption option:selected').val();
	//console.log(languages);
	var reviewFilterUI = {
		'markReadStatus':markReadStatus,
		'respondStatus':respondStatus,
		'polarities' : polarities,
		'reviewTypes' : reviewTypes,
		'languages' : languages,
		'sources' : sources,
		'actions' : actions,
		'flags' : flags,
		'shared' : shared,
		'quicknote' : quicknote,
		'broadcast' : broadcast,
		'organizationId' : organizationId,
		'fromDate' : fromDate,
		'toDate' : toDate,
		'pageNo' : pageNo,
		'sortBy' : sortByParam,
		'searchText' : searchText
	};
	$('#wrapper').mask('Loading...');
	$('#leftNavigation,#header').mask();
	$.ajax({
				type : "POST",
				url : "../reviewSitesContent/getFilteredReview.htm",
				contentType : "application/json",
				data : JSON.stringify(reviewFilterUI),
				success : function(response) {
					
					window['countsMap'] = response.successObject.countsMap;
					window['languages'] = response.successObject.languages;
					window['sources'] = response.successObject.sources;
					
					//count for filtered reviews 
					for( var key in window['countsMap'].language_count){
						var _value=$(window['countsMap'].language_count).prop(key);
						var updatedOpt=key+"<font color='red'> ("+_value+")</font>";
						$('select[name="languageOption"] option[value="'+_value+'"]').html(" "+updatedOpt);
						
						$('ul[class="ui-multiselect-checkboxes ui-helper-reset"] li span').map(function(){
								var oldCount=$(this).text().split(" ");
							    if(key==oldCount[1]){
							    	$(this).html(" "+updatedOpt);
							    	var spanId=key.replace("/","_")+"Span";
							    	$("span[id='"+spanId+"'] font").text(_value);
							    }
						});
					}
					
					for( var key in window['countsMap'].polarity_count){
						var tempArray=key.split("_");
						var spanId=tempArray[0]+'Span';
						if($('#'+spanId)!=undefined){
							$("span[id='"+spanId+"'] font").text($(window['countsMap'].polarity_count).prop(key));
						}
					}
					for( var key in window['countsMap'].sources_count){
						var spanId=lowercaseFirstLetter(key)+'SourceSpan';
						if($('#'+spanId)!=undefined){
							$("span[id='"+spanId+"'] font").text(" "+$(window['countsMap'].sources_count).prop(key)+" ");
						}
					}
					if (response.successObject.LIST_EMPTY == true) {
						$("#page-selection").hide();
						$('#hotelReviewsDivId').html("<font style='margin-left:25px;color:red'>  No Reviews Found</font>");
						$('#page-selection').html('<ul class="pagination bootpag"><li data-lp="1" class="prev disabled"><a href="javascript:void(0);">&laquo;</a></li><li class="disabled" data-lp="1"><a href="javascript:void(0);">1</a></li><li data-lp="1" class="next disabled"><a href="javascript:void(0);">&raquo;</a></li></ul>');
						$('#leftNavigation,#wrapper,#header').unmask();
						return;
					}
					if (response.status == "EXCEPTION_ERROR") {
						$('.container').mask(response.errorMessage);
					} else {
						$("#page-selection").show();
						$('#searchedTextDiv').html('');
						$('#filterDiv').html('');
						
						// for search purpose 
						filteredReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));
						var totalFilteredReviews = response.successObject.listAll;
						var totalReviewCount = response.successObject.totalReviewCount;
						paginationFiltered(totalReviewCount, 4,
								hotelReviewsDivId, response);
						$('#leftNavigation,#wrapper,#header').unmask();
						
					}
				},
				error : function(response) {
					$('#broadcastSuccessModalTitle').text("Error");
					$('#broadcastSuccessModalText').text(
							"Something went wrong , please contact admin !");
					$('#broadcastSuccessModal').modal('show');
				}
			});
}
function paginationFiltered(totalReviewCount, countPerPage, divId, response) {
	var pages = 0;
	if (totalReviewCount % countPerPage == 0 && totalReviewCount > 0) {
		pages = totalReviewCount / countPerPage;
	} else {
		pages = totalReviewCount / countPerPage + 1;
	}
	$('#page-selection').bootpag({
		total : pages,
		page : 1,
		maxVisible : 10
	}).on('page', function(event, num) {
		var start = (num - 1) * countPerPage;
		var end = num * countPerPage;
		if (end > totalReviewCount) {
			end = totalReviewCount;
		}
		// paint reviews
		var html = "";
		/*
		 * for(var i=start;i<end;i++){ html = html+reviews[i]+"<br/>"; }
		 */
		/*staaaart*/
		var polarities = [];
		var responds = [];
		var respondStatus=null;
		var reads = [];
		var markReadStatus=null;
		var reviewTypes = [];
		var languages = [];
		var sources = [];
		var actions = [];
		var flags = [];
		var broadcast = false;
		var shared = false;
		var quicknote = false;
		//language = $('#languageOption option:selected').val(); // 3
		var fromDate = $('#altFromDate').val();
		var toDate = $('#altToDate').val();
		var searchText = $('#searchInput').val();
		var organizationId = $('#organizationName option:selected').val();
		if ($('#textChk').prop('checked')) { // 2
			reviewTypes.push($('#textChk').val());
		}
		if ($('#audioChk').prop('checked')) { // 2
			reviewTypes.push($('#audioChk').val());
		}
		if ($('#videoChk').prop('checked')) { // 2
			reviewTypes.push($('#videoChk').val());
		}
		if ($('#pictorialChk').prop('checked')) { // 2
			reviewTypes.push($('#pictorialChk').val());
		}
		if ($('#generalChk').prop('checked')) { // 7
			/* actions.push($('#generalChk').val()); */
			actions.push("General");
		}
		if ($('#ticketChk').prop('checked')) { // 7
			/* actions.push($('#ticketChk').val()); */
			actions.push("Ticket");
		}
		if ($('#taskChk').prop('checked')) { // 7
			/* actions.push($('#taskChk').val()); */
			actions.push("Task");
		}
		if ($('#notifyChk').prop('checked')) { // 7
			/* actions.push($('#notifyChk').val()); */
			actions.push("Notify");
		}
		if ($('#duplicateFlagChk').prop('checked')) { // 9
			flags.push('DUPLICATE_REVIEW');
		}
		if ($('#deletedFlagChk').prop('checked')) { // 9
			flags.push('DELETED_REVIEW');
		}
		if ($('#languageFlagChk').prop('checked')) { // 9
			flags.push('LANGUAGE_NOT_CORRECT_REVIEW');
		}
		if ($('#otherFlagChk').prop('checked')) { // 9
			flags.push('OTHER_REVIEW');
		}
		if ($('#positiveChk').prop('checked')) { // 1
			polarities.push($('#positiveChk').val());
		}
		if ($('#neutralChk').prop('checked')) { // 1
			polarities.push($('#neutralChk').val());
		}
		if ($('#negativeChk').prop('checked')) { // 1
			polarities.push($('#negativeChk').val());
		}
		if ($('#respondedChk').prop('checked')) { // 1
			responds.push($('#respondedChk').val());
		}
		if ($('#notRespondedChk').prop('checked')) { // 1
			responds.push($('#notRespondedChk').val());
		}
		if(responds!=null && responds.length<2){
			if(responds[0]=="notResponded"){
				respondStatus=false;
			}
			if(responds[0]=="responded"){
				respondStatus=true;
			}
		}
		if ($('#readChk').prop('checked')) { // 1
			reads.push($('#readChk').val());
		}
		if ($('#unreadChk').prop('checked')) { // 1
			reads.push($('#unreadChk').val());
		}
		if(reads!=null && reads.length<2){
			if(reads[0]=="unread"){
				markReadStatus=false;
			}
			if(reads[0]=="read"){
				markReadStatus=true;
			}
		}
		if ($('#sharedChk').prop('checked')) { // 5
			shared = true;
		}
		if ($('#noteChk').prop('checked')) { // 6
			quicknote = true;
		}
		if ($('#broadcastChk').prop('checked')) { // 8
			broadcast = true;
		}
		$("#sourcesDiv").find('input[type=checkbox]').each(function() { // 4
			if (this.checked == true) {
				sources.push(this.value);
			}
		});
		var languages = $("#languageOption").val();
		if(languages==null){
			languages=[];
		}
		var sortByParam = $('#sortSelectOption option:selected').val();
		//console.log(languages);
		var reviewFilterUI = {
			'markReadStatus':markReadStatus,
			'respondStatus':respondStatus,
			'polarities' : polarities,
			'reviewTypes' : reviewTypes,
			'languages' : languages,
			'sources' : sources,
			'actions' : actions,
			'flags' : flags,
			'shared' : shared,
			'quicknote' : quicknote,
			'broadcast' : broadcast,
			'organizationId' : organizationId,
			'fromDate' : fromDate,
			'toDate' : toDate,
			'pageNo' : num,
			'sortBy' : sortByParam,
			'searchText' : searchText
		};
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		$.ajax({
					type : "POST",
					url : "../reviewSitesContent/getFilteredReview.htm",
					contentType : "application/json",
					data : JSON.stringify(reviewFilterUI),
					success : function(response) {
						window['countsMap'] = response.successObject.countsMap;
						window['languages'] = response.successObject.languages;
						window['sources'] = response.successObject.sources;
						//count for filtered reviews 
						for( var key in window['countsMap'].language_count){
							var _value=$(window['countsMap'].language_count).prop(key);
							var updatedOpt=key+"<font color='red'> ("+_value+")</font>";
							$('select[name="languageOption"] option[value="'+_value+'"]').html(" "+updatedOpt);
							$('ul[class="ui-multiselect-checkboxes ui-helper-reset"] li span').map(function(){
									var oldCount=$(this).text().split(" ");
								    if(key==oldCount[1]){
								    	$(this).html(" "+updatedOpt);
								    	var spanId=key.replace("/","_")+"Span";
								    	$("span[id='"+spanId+"'] font").text(_value);
								    }
							});
						}
						for( var key in window['countsMap'].polarity_count){
							var tempArray=key.split("_");
							var spanId=tempArray[0]+'Span';
							if($('#'+spanId)!=undefined){
								$("span[id='"+spanId+"'] font").text($(window['countsMap'].polarity_count).prop(key));
							}
						}
						for( var key in window['countsMap'].sources_count){
							var spanId=lowercaseFirstLetter(key)+'SourceSpan';
							if($('#'+spanId)!=undefined){
								$("span[id='"+spanId+"'] font").text(" "+$(window['countsMap'].sources_count).prop(key)+" ");
							}
						}
						if (response.successObject.LIST_EMPTY == true) {
							$("#page-selection").hide();
							$('#hotelReviewsDivId').html("<font style='margin-left:25px;color:red'>  No Reviews Found</font>");
							$('#page-selection').html('<ul class="pagination bootpag"><li data-lp="1" class="prev disabled"><a href="javascript:void(0);">&laquo;</a></li><li class="disabled" data-lp="1"><a href="javascript:void(0);">1</a></li><li data-lp="1" class="next disabled"><a href="javascript:void(0);">&raquo;</a></li></ul>');
							$('#leftNavigation,#wrapper,#header').unmask();
							return;
						}
						if (response.status == "EXCEPTION_ERROR") {
							$('.container').mask(response.errorMessage);
						} else {
							$("#page-selection").show();
							$('#searchedTextDiv').html('');
							$('#filterDiv').html('');
							// for search purpose 
							filteredReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));
							var totalFilteredReviews = response.successObject.listAll;
		var successObject = {
									'listAll' : response.successObject.listAll,
			'DEPARTMENTS' : response.successObject.DEPARTMENTS,
			'USERS' : response.successObject.USERS
		};
		var response2 = {
			'successObject' : successObject
		};
		html = listFilteredReviewStatusResponse(response2, searchText);
		$(divId).html(html);
		
		$('.ratingScore').each(function() {
	         $(this).qtip({
	             content: {
	                 text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
	             },
	          position: {
	        	  my: 'bottom center',  
		          at: 'top center',
		          //target :'#ratingScore'
	         },
	         style: {
	             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	         }
	         });
	     });

		
		$('.ReviewNoteIcon').each(function() {
	         $(this).qtip({
	             content: {
	            	 text: 'Internal communication workflow',
	             },
	          position: {
	        	  my: 'bottom center',  
		          at: 'top center', 
	             //target: $('#QuickNotesTabInReviews') // my target
	         },
	         style: {
	             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	         }
	         });
	     });
		
		$('.ReplyToReview').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Single platform to reply to reviews  '
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
	    });
		
		$('.keywords ').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Identified keywords & their polarities'
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
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
			var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
			/*console.log(keywordDivId + " 3");*/
			if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
				$("#" + keywordDivId).removeClass("OnSeleceActive");
			} else {
				$("#" + keywordDivId).addClass("OnSeleceActive");
			}
		});
		$('.userPrimeAction').click(function() {
			$('.active').removeClass('active');
			$('.OnSeleceActive').removeClass('OnSeleceActive');
		});
							/*paginationFiltered(totalFilteredReviews, 4,
									hotelReviewsDivId, response);*/
							$('#leftNavigation,#wrapper,#header').unmask();
						}
					},
					error : function(response) {
						$('#broadcastSuccessModalTitle').text("Error");
						$('#broadcastSuccessModalText').text(
								"Something went wrong , please contact admin !");
						$('#broadcastSuccessModal').modal('show');
					}
				});
		/*staaaart*/
	});
	/**
	 * ***************************initializatio of
	 * pagination****************************
	 */
	var successObject = {
		'listAll' : response.successObject.listAll.slice(0, 4),
		'DEPARTMENTS' : response.successObject.DEPARTMENTS,
		'USERS' : response.successObject.USERS
	};
	var response2 = {
		'successObject' : successObject
	};
	var searchText = $('#searchInput').val();
	var html = listFilteredReviewStatusResponse(response2, searchText);
	$('#hotelReviewsDivId').html(html);
	
	$('.ratingScore').each(function() {
        $(this).qtip({
            content: {
                text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
	         
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });

	
	$('.ReviewNoteIcon').each(function() {
        $(this).qtip({
            content: {
            	 text: 'Internal communication workflow '
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
           // target: $('#QuickNotesTabInReviews') // my target
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.ReplyToReview').each(function() {
        $(this).qtip({
            content: {
                text: 'Single platform to reply to reviews '
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });

	$('.keywords ').each(function() {
        $(this).qtip({
            content: {
                text: 'Identified keywords & their polarities'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$(".employeeoption").multiselect();
	
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
		/*
		 * $('.active').removeClass('active'); $('.OnSeleceActive').removeClass(
		 * 'OnSeleceActive'); $(this).next(".col-xs-12").children(
		 * '.TradeReviewKpiDepartmentFactor') .addClass('OnSeleceActive');
		 */
		var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
		/*console.log(keywordDivId + " 4");*/
		if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
			$("#" + keywordDivId).removeClass("OnSeleceActive");
		} else {
			$("#" + keywordDivId).addClass("OnSeleceActive");
		}
		/*
		 * $(keywordDivId).show(); console.log(keywordDivId+" 4");
		 */
	});
	$('.userPrimeAction').click(function() {
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
	/**
	 * *************************end of
	 * initialization***********************************
	 */
}
function listFilteredReviewStatusResponse(response, searchText) {
	$('#hotelReviewsDivId').html('');
	var tempHtml = "";
	if (response.successObject.LIST_EMPTY == "TRUE") {
		tempHtml = "<font style='margin-left:25px;color:red'>  No Reviews Found</font>";
		$('#page-selection').html('<ul class="pagination bootpag"><li data-lp="1" class="prev disabled"><a href="javascript:void(0);">&laquo;</a></li><li class="disabled" data-lp="1"><a href="javascript:void(0);">1</a></li><li data-lp="1" class="next disabled"><a href="javascript:void(0);">&raquo;</a></li></ul>');
		$("#page-selection").hide();
	} else {
		$("#page-selection").show();
		var list = response.successObject.listAll;
		filteredReviewsDuplicateResponse = response;
		if (list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				var reviewTitle = "";
				var highlightedReviewContent = "";
				if (searchText != "") {
					if (null !== list[i].reviewTitle) {
						reviewTitle = highlightSearchText(searchText,
								list[i].reviewTitle);
					}
					if (null !== list[i].highlightedReviewContent) {
						highlightedReviewContent = highlightSearchText(searchText,
								list[i].highlightedReviewContent);
					}
					highlightedReviewContent = highlightSearchText(searchText,
							list[i].highlightedReviewContent);
				} else {
					reviewTitle = list[i].reviewTitle;
					highlightedReviewContent = list[i].highlightedReviewContent;
				}
				var reviewedOn = $.datepicker.formatDate('d M yy', new Date(
						list[i].reviewTime));
				tempHtml += '<div class="row" >';
				tempHtml += '<div id="reviewContentDiv_' + list[i].id
						+ '" class="row col-xs-12 SingleReviewList">';
				tempHtml += '<div data-reviewid="'
						+ list[i].id
						+ '" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						tempHtml += '<div class=" ratingScoreClass PositiveSentimentReview row"> <div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						tempHtml += '<div class=" ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div> <span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span> Rating Score: <span class="neutralPadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						tempHtml += '<div class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span> Rating Score: <span class="negativePadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
				}
				tempHtml += '<div class="reviewDetails row">';
				tempHtml += '<div class="reviewSource">' + list[i].sourceName
						+ '</div>';
				tempHtml += '<div class="reviewerName">by <span>';
				if (list[i].reviewerName != null
						|| $.trim(list[i].reviewerName) == ""
						|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
					tempHtml += '' + list[i].reviewerName + '';
				} else {
					tempHtml += 'Not Available';
				}
				tempHtml += '</span></div>';
				tempHtml += '<div class="reviewerDetail">from <span>';
				if (list[i].reviewLocation == null
						|| list[i].reviewLocation == "") {
					tempHtml += ' Not Available </span></div>';
				} else {
					tempHtml += '' + list[i].reviewLocation + '</span></div>';
				}
				tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
						+ moment(list[i].reviewTime).format("DD MMMM YYYY")
						+ '</span>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';// Reciew
				// Starts
				// Here
				tempHtml += '<div style="float:right;">';
					tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+ list[i].id + ')" /> ';
				tempHtml += '</div>';
				if (reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader" >'
							+ reviewTitle + '</h3>';
				}
				tempHtml += '<p>' + highlightedReviewContent + '</p>';
				
				if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
					//original review
					tempHtml += '<p id="originalReview_'+list[i].id+'" style="display:none">' + list[i].reviewContent + '</p>';
				}
				
				// star review rating from Review content site table
				if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
						tempHtml += '<div class="SourceRating col-xs-12">';
						tempHtml += '<span>Source Rating </span><span data-review-rating="'
								+ list[i].reviewOverallRating
								+ '" data-maximum-rating="'
								+ list[i].maxOverallRating
								+ '" class="starsTA">'
								+ list[i].reviewOverallRating
								+ '</span><span style="margin-left:5px; margin-right:35px;">'
								+ list[i].reviewOverallRating
								+ '/'
								+ list[i].maxOverallRating + '</span>'
						
								+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
								
						
								if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
									tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
								}
				
								if(list[i].respondStatus==true){
									tempHtml += '<span  style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
								}else{
									tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
								}
								if(list[i].markRead==true){
									tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
								}else{
									tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
								}
						tempHtml += '</div>';
				}
				else{
							if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
								tempHtml += '<div class="SourceRating col-xs-12">';
								tempHtml += '<span>Source Rating </span><span data-review-rating="'
										+ list[i].reviewOverallRating
										+ '" data-maximum-rating="'
										+ list[i].maxOverallRating
										+ '" class="starsHIQ">'
										+ list[i].reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ list[i].reviewOverallRating
										+ '/'
										+ list[i].maxOverallRating + '</span>'
								
										+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
										
								
										if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
											tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
										}
						
										if(list[i].respondStatus==true){
											tempHtml += '<span  style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}
										if(list[i].markRead==true){
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
										}else{
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
										}
								tempHtml += '</div>';
						}else{
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
										
										if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
											tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
										}
						
										if(list[i].respondStatus==true){
											tempHtml += '<span  style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}
										if(list[i].markRead==true){
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
										}else{
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
										}
								tempHtml += '</div>';
						}
				}
				tempHtml += '<div class="SourceKPIRating col-xs-12">';
				for (var h = 0; h < list[i].kpiIndustryMasterUiList.length; h++) {
					tempHtml += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
						 + list[i].kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
								
						if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
							tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
						}
						if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
							tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
						}
					tempHtml+='<span style="float:left;margin-left: 5px;margin-right:35px;" > '
							+ list[i].kpiIndustryMasterUiList[h].sourceKpiScore
							+ '/'
							+ list[i].kpiIndustryMasterUiList[h].maxRatingValue
							+ '</span></div>';
				}
				tempHtml += '</div>';
				/*
				 * if(list[i].kpiTagSentimentAnalysisUIList.length>0){ tempHtml += '<div
				 * class="TradeReviewKpiDepartmentFactor col-xs-12">' + '<div
				 * class="KPIScoreHeader SmallBoldGreyContent col-xs-12">KPI
				 * Polarity Score</div>';
				 * 
				 * 
				 * for (var h = 0; h <
				 * list[i].kpiTagSentimentAnalysisUIList.length; h++) { tempHtml
				 * +='<div class="KPIScore col-xs-4">
				 * '+list[i].kpiTagSentimentAnalysisUIList[h].kpiName+' <span
				 * class="PositiveSentimentCount">'+list[i].kpiTagSentimentAnalysisUIList[h].kpiFactorScore+'%</span></div>'; }
				 * 
				 * tempHtml +='</div>'; }
				 */
				if (list[i].keywordList.length > 0) {
					tempHtml += '<div id="keywordAndScore_'
							+ list[i].id
							+ '" class="TradeReviewKpiDepartmentFactor col-xs-12">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords <span class="keywords fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 8px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span></div>';
					for (var h = 0; h < list[i].keywordList.length; h++) {
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="PositiveSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName + '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NeutralSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName + '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NegativeSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName +'</span></div>';
								break;
							}
						}
					}
					tempHtml += '</div>';
				}
				tempHtml += '<div class="OnReviewActions col-xs-12">';
				tempHtml += '<div class="panel-body row">';
				tempHtml += '<ul class="nav nav-pills">';
				tempHtml += '<li style="display:none">';
				tempHtml += '<a class="userPrimeAction" onclick="openShare('
						+ list[i].id
						+ ')" data-toggle="tab" href="#Share-pills'
						+ list[i].id + '">';
				tempHtml += '<div id="shareCountSpan' + list[i].id
						+ '" class="ShareReviewIcon">Share('
						+ list[i].sourceMasterUIList.length + ')</div>';
				tempHtml += '</a>';
				tempHtml += '</li>';
				tempHtml += '<li>';
				if (response.successObject.DEPARTMENTS.length == 0) {
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="return false;" href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a class="userPrimeAction" onclick="openNote('
							+ list[i].id + ','
							+ $('#organizationName option:selected').val()
							+ ')" data-toggle="tab" href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li >';
				if (response.successObject.DEPARTMENTS.length == 0
						|| response.successObject.USERS.length == 0) {
//					tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task" onclick="getComments('	+ list[i].id+ ','+ $('#organizationName option:selected').val()	+ ',this)" onclick="return false;" href="#Action-pills'	+ list[i].id + '">';
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task"  onclick="return false;" href="#Action-pills'	+ list[i].id + '">';
					tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#Action-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li style="display:none">';
				tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="openBroadcast('
						+ list[i].id
						+ ')" href="#Broadcast-pills'
						+ list[i].id
						+ '">';
				tempHtml += '<div class="BroadcastIcon">Broadcast</div>';
				tempHtml += '</a>';
				tempHtml += '</li>';
				/******************************respond to review pill3************************************/
				tempHtml += '<li >';
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#ReplyToReview-pills'+ list[i].id + '">';
						tempHtml += '<div id="ReplyToReviewTabInReviews" class="ReplyToReview">Reply to review</div>';
					tempHtml += '</a>';
				tempHtml += '</li>';
				/******************************respond to review pill************************************/
				
				tempHtml += '</ul>';
				tempHtml += '<div class="tab-content">';
				
				//start reply
				tempHtml += '<div id="ReplyToReview-pills' + list[i].id+ '" class="SubHeading tab-pane fade">';
					tempHtml += '<div class="panel-body row">';
						tempHtml += '<ul class="nav nav-pills">';
						if(list[i].sourceBaseUrl){
							tempHtml += '<li class="">';
							if(((list[i].sourceName.toLowerCase()=="tripadvisor" 
								|| list[i].sourceName.toLowerCase()=="booking") 
								&& (list[i].sourceLogin != null && list[i].sourceLogin !='')  
								&&  (list[i].sourcePass != null  && list[i].sourcePass!='') 
								&& (list[i].sourceUrl != null && list[i].sourceUrl != '')) 
								|| (list[i].sourceName.toLowerCase()=="holidayiq" && list[i].reviewId != null && list[i].reviewId != '') )
								tempHtml += '<a  class="filterButton" onclick="showRespondModal('+list[i].id+',\'direct\')" >Direct Respond to Review Source</a>';
							else
								tempHtml += '<a  class="filterButton" id="DirectRespondReviewSource" onclick="respondToDirect('+list[i].id+')" href="//'+list[i].sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
							tempHtml += '</li>';
						}
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" id="DirectRespondReviewer" onclick="showRespondModal('+list[i].id+',\'reviewer\')" class="filterButton" >Direct Respond to Reviewer</a>';
							tempHtml += '</li>';
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" id="RespondByMailToReviewSource" onclick="showRespondModal('+list[i].id+',\'reviewSource\')" >Respond by email to Review Source</a>';
							tempHtml += '</li>';
						tempHtml += '</ul>';
							tempHtml += '<div class="tab-content">';
							tempHtml += '</div>';
					tempHtml += '</div>';
				tempHtml += '</div>';
				//end reply
				
				tempHtml += '<div id="Broadcast-pills' + list[i].id
						+ '" class="SubHeading tab-pane fade">';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				if (list[i].broadcastStatus == true) {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '" checked>Tag reviews to hotel website.';
				} else {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '">Tag reviews to hotel website.';
				}
				tempHtml += '<button id="Save" onclick="saveBroadcast('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Done</button>';
				tempHtml += '<button id="Cancel" onclick="closeBroadcast('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Share-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div class="MediumNormalGreyContent col-xs-2">Share On:</div>'
						+ '<div id="shareDiv'
						+ list[i].id
						+ '" class="form-group col-xs-10 row">'
						+ '</div>'
						+ '<div class="col-xs-10 col-xs-offset-2 row">'
						+ '<div class="form-group input-group col-xs-12 footerButtons">'
						+ '<button id="Save" onclick="saveShare('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm" type="button"> Done</button>'
						+ '<button id="Cancel" onclick="closeShare('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of Share
				
				
				tempHtml += '<div id="Action-pills' + list[i].id+ '" class="SubHeading tab-pane fade">';
				tempHtml += '<div class="panel-body row">';
				tempHtml += '<ul class="nav nav-pills">'
						/*+ '<li class="active">'
						+ '<a data-toggle="tab" href="#Task-pills'
						+ list[i].id
						+ '"  data-actiontype="Task" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)" >'
								+ '<span class="glyphicon glyphicon"></span>'
								+ 'Assign a task'
							+ '</a>'
						+ '</li>'*/
						+ '<li class="active">'
						+ '<a data-toggle="tab" id="RaiseTicketlink" href="#Ticket-pills'
						+ list[i].id
						+ '" data-actiontype="Ticket"  onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
								+ '<span class="glyphicon glyphicon" > </span>'
								+ 'Raise a ticket'
								+ '</a>'
						+ '</li>'
						/*+ '<li class="">'
						+ '<a data-toggle="tab" href="#Notify-pills'
						+ list[i].id
						+ '" data-actiontype="Notify" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Notify'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="">'
						+ '<a data-toggle="tab" style="display: none;" href="#General-pills'
						+ list[i].id
						+ '" data-actiontype="General" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'General'
						+ '</a>'
						+ '</li>'
						/*+ '<li class="">'
						+ '<a data-toggle="tab" onclick="showRespondModal('
						+ list[i].id
						+ ')" href="#Respond-pills'
						+ list[i].id
						+ '">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Respond to reviews'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="">'
						+ '<a data-toggle="tab" id="FlagLink" onclick="loadFlags('
						+ list[i].id
						+ ')" href="#Flag-pills'
						+ list[i].id
						+ '">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Flag' + '</a>' + '</li>' + '</ul>';
				tempHtml += '<div class="Actiontitles" style="display:none" id="notesForTask_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForGeneral_'
						+ list[i].id + '">' + '</div>';
				tempHtml += '<div class="tab-content">';
				tempHtml += '<div id="Flag-pills' + list[i].id
						+ '" class="row  tab-pane ">';
				tempHtml += '<div class="Actiontitles">';
				tempHtml += '<div class="col-xs-12 form-horizontal">';
				tempHtml += '<div id="flagChkDiv_' + list[i].id
						+ '" class="form-group col-xs-10 row">';
				if ('DUPLICATE_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				}
				if ('DELETED_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				}
				if ('INCORRECT_LANGUAGE' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				}
				if ('OTHER' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				}
				tempHtml += '</div>';
				tempHtml += '<div class="form-group">';
				tempHtml += '<div class=" col-xs-12">';
				tempHtml += '<div class="">';
				tempHtml += '<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				tempHtml += '<button onclick="saveFlag('
						+ list[i].id
						+ ')" id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
				tempHtml += '<button onclick="cancelFlag('
						+ list[i].id
						+ ')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Task-pills' + list[i].id
						+ '" class="row tab-pane active">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTask_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTask_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForTask_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForTask_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTask('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTask" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Task Pill
				tempHtml += '<div id="Ticket-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Priority<span class="mandatoryField">*</span></label>'
							 + '<div id="ticketPriorityDiv_' + list[i].id + '" class="col-xs-2">'
							 + '<select id="ticketPriorityOption_'	+ list[i].id + '" class="form-control input-sm">'
								 + '<option value="High" >High Priority</option>'
								 + '<option value="Medium" >Medium Priority</option>'
								 + '<option value="Low" >Low Priority</option>'
							 + '</select>'
							 + '</div>'
							 + '</div>'
						 
						+ '<div class="form-group">'
						/*+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'*/
						+ '<label class="col-xs-3 control-label">For</label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTicket_'+ list[i].id+ '" class="col-xs-3">'
							+ '<select multiple id="employeeForTicket_'+ list[i].id	+ '" class="form-control input-sm employeeoption">'
								/*+ '<option value="" >Select Employee</option>'*/
						+ '</select>'
						+ '</div>'
						
						 
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
									+ '<input id="datetimepickerForTicket_'	+ list[i].id + '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						
						
						+ '<div id="emailForTicketDiv_'	+ list[i].id + '" class="form-group">'
							+ '<label class="col-xs-3 control-label">Share via email<span class="mandatoryField">*</span></label>'
							+ '<div class="col-xs-9">'
								+ '<input id="emailForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter Email Address">'
							+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">CC</label>'
						+ '<div class="col-xs-9">'
							+ '<input id="ccEmailsForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter CC Emails with comma seperated">'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTicket" onclick="cancelRaiseTicket('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Ticket Pill
				tempHtml += '<div id="Notify-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForNotify_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForNotify_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotify('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelNotify" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Notify Pill
				tempHtml += '<div style="display: none;" id="General-pills'
						+ list[i].id
						+ '" class="row tab-pane">'
						+ '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForGeneral_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForGeneral_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveGeneral" data-actiontype="General" onclick="saveNoteForGeneral('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelGeneral" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of General Pill
				$("#respondModal_"+ list[i].id).remove(); 
		if(!document.getElementById("respondModalLabel_"+ list[i].id)){		
				tempHtml += ' <div id="Respond-pills' + list[i].id + '" class="row tab-pane">';
				tempHtml += '<div id="respondModal_'+ list[i].id
						+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
						+ '<div class="modal-dialog modal-lg">'
						+ '<div class="modal-content">'
						+ '<div class="modal-header">'
						+ '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>'
							+ '<h4 id="respondModalLabel_'+ list[i].id+ '" class="modal-title">Respond by email to Review Source</h4>'
							+ '<h4 id="respondsModalLabel_'+ list[i].id+ '" style="display:none" class="modal-title">Responds</h4>'
						+ '</div>'
						+ '<div class="modal-body row">'
						+ '<div class="row col-xs-12 SingleReviewList">'
						+ '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
						
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span> Rating Score: <span class="positivePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span> Rating Score: <span class="neutralPadding score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div  class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span> Rating Score: <span class="negativePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
						}
						
						tempHtml += '<div class="reviewDetails row">';
						tempHtml += '<div class="reviewSource">' + list[i].sourceName
								+ '</div>';
						tempHtml += '<div class="reviewerName">by <span>';
						if (list[i].reviewerName != null
								|| $.trim(list[i].reviewerName) == ""
								|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
							tempHtml += '' + list[i].reviewerName + '';
						} else {
							tempHtml += 'Not Available';
						}
						tempHtml += '</span></div>';
						tempHtml += '<div class="reviewerDetail">from <span>';
						if (list[i].reviewLocation == null
								|| list[i].reviewLocation == "") {
							tempHtml += ' Not Available </span></div>';
						} else {
							tempHtml += '' + list[i].reviewLocation + '</span></div>';
						}
						tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
								+ moment(list[i].reviewTime).format("DD MMMM YYYY")
								+ '</span>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						
						/*+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Rating Score: <span class="score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>'*/

				tempHtml+='</div>'
						+ '<div class="col-xs-12 col-sm-9 col-lg-10">';
				if (list[i].reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader">'
							+ list[i].reviewTitle + '</h3>';
				}
				tempHtml += '<p>'+ list[i].highlightedReviewContent	+ '</p>';
								
						// star review rating from Review content site table
				if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
								tempHtml += '<div class="SourceRating col-xs-12">';
								tempHtml += '<span>Source Rating </span><span data-review-rating="'
										+ list[i].reviewOverallRating
										+ '" data-maximum-rating="'
										+ list[i].maxOverallRating
										+ '" class="starsTA">'
										+ list[i].reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ list[i].reviewOverallRating
										+ '/'
										+ list[i].maxOverallRating
										+ '</span>'
										
										+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
										/*if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
										}*/
								tempHtml += '</div>';
				}else{
							if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
								tempHtml += '<div class="SourceRating col-xs-12">';
								tempHtml += '<span>Source Rating </span><span data-review-rating="'
										+ list[i].reviewOverallRating
										+ '" data-maximum-rating="'
										+ list[i].maxOverallRating
										+ '" class="starsHIQ">'
										+ list[i].reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ list[i].reviewOverallRating
										+ '/'
										+ list[i].maxOverallRating
										+ '</span>'
										
										+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
										/*if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
										}*/
								tempHtml += '</div>';
							}else{
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
										+ list[i].maxOverallRating
										+ '</span>';
										
										/*if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
										}*/
								tempHtml += '</div>';
							}
				}
						/*tempHtml += '<div id="sourceKPIRating'+list[i].id+'" class="SourceKPIRating col-xs-12">';
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
						
						if (list[i].keywordList.length > 0) {
							tempHtml += '<div id="keywordAndScoreModal_'
									+ list[i].id
									+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
									+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
							for (var h = 0; h < list[i].keywordList.length; h++) {
								for (var p = 0; p < sentimentPolarityList.length; p++) {
									if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
											&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
											&& sentimentPolarityList[p].sentimentName == "positive") {
										tempHtml += '<div class="KPIScore col-xs-4"> '
												+ ' <span class="PositiveSentimentCount"> '
												+ list[i].keywordList[h].nlpQueryName + '</span></div>';
										break;
									}
									if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
											&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
											&& sentimentPolarityList[p].sentimentName == "neutral") {
										tempHtml += '<div class="KPIScore col-xs-4"> '
												+ ' <span class="NeutralSentimentCount"> '
												+ list[i].keywordList[h].nlpQueryName + '</span></div>';
										break;
									}
									if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
											&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
											&& sentimentPolarityList[p].sentimentName == "negative") {
										tempHtml += '<div class="KPIScore col-xs-4"> '
												+ ' <span class="NegativeSentimentCount"> '
												+ list[i].keywordList[h].nlpQueryName +'</span></div>';
										break;
									}
								}
							}
							tempHtml += '</div>';
						}*/
						
						
				 tempHtml+= '<div class="form-group input-group col-xs-12">'
						
						
						+'<div class="form-group input-group col-xs-12">'
							+'<input type="email" id="reviewerEmail_'+list[i].id+'" class="form-control input-sm" placeholder="Enter Reviewer Email Address">'
					    +'</div>'
					
						+ '<textarea id="respond_'
						+ list[i].id
						+ '" placeholder="Enter your response here" style="width: 704px; height: 145px;" maxlength="1000" class="form-control input-sm"></textarea>'
							+'<span id="responds_'+ list[i].id + '" style="display:none"></span>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<div id="validationMessageDiv_'
						+ list[i].id
						+ '" ></div>'
						+ '<button onclick="respondToReview('
						+ list[i].id
						+ ','
						+ list[i].sourceId
						+ ')" id="save_'+list[i].id+'" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button data-dismiss="modal" id="cancel_'+list[i].id+'" onclick="resetRespond('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '<button data-dismiss="modal" id="ok_'+list[i].id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>'
						+ '</div>' + '</div>' + '</div>' + '</div>' + '</div>'
						+ '</div>' + '</div>';
				tempHtml += ' </div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
		}
				
				tempHtml += '<div id="Note-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div style="display:none" id="notesForReviewSiteContentId_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<p style="display:none ; color:red" class="has-error" id="errorForReviewSiteContentId_'
						+ list[i].id
						+ '"></p>'
						+ '<div class="col-xs-12">'
						+ '<div class="form-group input-group col-xs-12">'
						+ '<label>Enter your note <span class="mandatoryField">*</span></label>'
						+ '<textarea id="noteForReviewSiteContentId_'
						+ list[i].id
						+ '" class="form-control input-sm" ></textarea>'
						+ '</div>'
						+ '<div class="row ">'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share with a department</label>'
						+ '<div class="">'
						+ '<select id="departmentForReviewSiteContentId_'
						+ list[i].id
						+ '"  class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share via email</label>'
						+ '<div class="">'
								+ '<input id="emailForReviewSiteContentId_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter Email Address">'
						+ '</div>'
						+ '</div>'
						
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="Save" onclick="saveNote('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="Cancel" onclick="closeNote('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of QuickNote
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';// END of On action
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
			}// End Of for Loop
			$('#hotelReviewsDivId').empty();
		} else {
			tempHtml += '<font style="color:red">No Records Found </font>';
			$('#page-selection').hide();
		}
	}
	return tempHtml;
}
var stoppedTyping;
function clientSearchReview() {
	if (stoppedTyping)
		clearTimeout(stoppedTyping);
	stoppedTyping = setTimeout(
			function() {
				/* loadingForDashBoard(); */
				/* $('#wrapper').mask('Loading'); */
				$('#wrapper').mask('Loading...');
				$('#leftNavigation,#header').mask();
				var searchKey = $("#searchInput").val();
				if ($.trim(searchKey) == "" || searchKey == null) {
					searchKey = "";
				}
				/* ajaxLoader(".SearchInput"); */
				var response;
				var resultListReviews = [];
				if (filteredReviewsDuplicateResponseObject == null) {
					response = JSON.parse(JSON
							.stringify(normalReviewsDuplicateResponseObject));
					for (var i = 0; i < response.successObject.listAll.length; i++) {
						var item = response.successObject.listAll[i];
						if (item.highlightedReviewContent == null)
							item.highlightedReviewContent = "";
						if (item.reviewTitle == null)
							item.reviewTitle = "";
						if (searchKey != ""
								&& (item.highlightedReviewContent.toLowerCase().indexOf(
										searchKey.toLowerCase()) != -1 || (item.reviewTitle
										.toLowerCase().indexOf(searchKey
										.toLowerCase())) != -1)) {
							var hightedText = '<span style="background-color: #FFFF00">'
									+ searchKey + '</span>';
							item.highlightedReviewContent = item.highlightedReviewContent
									.toLowerCase().split(
											searchKey.toLowerCase()).join(
											hightedText);
							item.reviewTitle = item.reviewTitle.toLowerCase()
									.split(searchKey.toLowerCase()).join(
											hightedText);
							searchedReviewTitle = item.reviewTitle;
							searchedReviewContent = item.highlightedReviewContent;
							resultListReviews.push(item);
						} else {
							if (searchKey == "") {
								resultListReviews.push(item);
							}
						}
					}
				} else {
					response = JSON.parse(JSON
							.stringify(filteredReviewsDuplicateResponseObject));
					for (var i = 0; i < response.successObject.listAll.length; i++) {
						var item = response.successObject.listAll[i];
						if (item.reviewContent == null)
							item.reviewContent = "";
						if (item.reviewTitle == null)
							item.reviewTitle = "";
						if (searchKey != ""
								&& (item.reviewContent.toLowerCase().indexOf(
										searchKey.toLowerCase()) != -1 || (item.reviewTitle
										.toLowerCase().indexOf(searchKey
										.toLowerCase())) != -1)) {
							var hightedText = '<span style="background-color: #FFFF00">'
									+ searchKey + '</span>';
							item.reviewContent = item.reviewContent
									.toLowerCase().split(
											searchKey.toLowerCase()).join(
											hightedText);
							item.reviewTitle = item.reviewTitle.toLowerCase()
									.split(searchKey.toLowerCase()).join(
											hightedText);
							resultListReviews.push(item);
						} else {
							if (searchKey == "") {
								resultListReviews.push(item);
							}
						}
					}
				}
				var totalReviewCount = response.successObject.totalReviewCount;
				var successObjectTemp = {
					'listAll' : resultListReviews,
					'DEPARTMENTS' : response.successObject.DEPARTMENTS,
					'USERS' : response.successObject.USERS
				};
				response = {
					'successObject' : successObjectTemp
				};
				var totalReviews = response.successObject.listAll;
				paginationSearched(totalReviewCount, 4, hotelReviewsDivId, response);
				/*
				 * unloadingForDashBoard(); /*$('#wrapper').unmask();
				 */
				$('#leftNavigation,#wrapper,#header').unmask();
			}, 300);
}
function paginationSearched(reviewsCount, countPerPage, divId, response) {
	var pages = 0;
	if (reviewsCount % countPerPage == 0 && reviewsCount > 0) {
		pages = reviewsCount / countPerPage;
	} else {
		pages = reviewsCount / countPerPage + 1;
	}
	$('#page-selection').bootpag({
		total : pages,
		page : 1,
		maxVisible : 10
	}).on('page', function(event, num) {
		var start = (num - 1) * countPerPage;
		var end = num * countPerPage;
		if (end > reviewsCount) {
			end = reviewsCount;
		}
		// paint reviews
		var html = "";
		/*
		 * for(var i=start;i<end;i++){ html = html+reviews[i]+"<br/>"; }
		 */
		var successObject = {
			'listAll' : response.successObject.listAll.slice(start, end),
			'DEPARTMENTS' : response.successObject.DEPARTMENTS,
			'USERS' : response.successObject.USERS
		};
		var response2 = {
			'successObject' : successObject
		};
		html = listsearchedReviewStatusResponse(response2, searchText);
		$(divId).html(html);
		
		$('.ratingScore').each(function() {
	         $(this).qtip({
	             content: {
	                 text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
	             },
	          position: {
	        	  my: 'bottom center',  
		          at: 'top center', 
	         },
	         style: {
	             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	         }
	         });
	     });
		
		$('.ReviewNoteIcon').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Internal communication workflow '
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	           // target: $('#QuickNotesTabInReviews') // my target
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
	    });
		
		$('.ReplyToReview').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Single platform to reply to reviews '
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
	    });
		
		$('.keywords ').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Identified keywords & their polarities'
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
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
			/*
			 * $('.active').removeClass('active');
			 * $('.OnSeleceActive').removeClass('OnSeleceActive');
			 * $(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');
			 */
			var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
			/*console.log(keywordDivId + " 5");*/
			if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
				$("#" + keywordDivId).removeClass("OnSeleceActive");
			} else {
				$("#" + keywordDivId).addClass("OnSeleceActive");
			}
			/*
			 * $(keywordDivId).show(); console.log(keywordDivId+" 5");
			 */
			console.log(keywordDivId+" 5");
		});
		$('.userPrimeAction').click(function() {
			$('.active').removeClass('active');
			$('.OnSeleceActive').removeClass('OnSeleceActive');
		});
	});
	/**
	 * ***************************initializatio of
	 * pagination****************************
	 */
	var successObject = {
		'listAll' : response.successObject.listAll.slice(0, 4),
		'DEPARTMENTS' : response.successObject.DEPARTMENTS,
		'USERS' : response.successObject.USERS
	};
	var response2 = {
		'successObject' : successObject
	};
	var html = listsearchedReviewStatusResponse(response2, searchText);
	$('#hotelReviewsDivId').html(html);
	
	$('.ratingScore').each(function() {
        $(this).qtip({
            content: {
                text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center',  
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.ReviewNoteIcon').each(function() {
        $(this).qtip({
            content: {
                text: 'Internal communication workflow '
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
          //  target: $('#QuickNotesTabInReviews') // my target
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.ReplyToReview').each(function() {
        $(this).qtip({
            content: {
                text: 'Single platform to reply to reviews '
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.keywords ').each(function() {
        $(this).qtip({
            content: {
                text: 'Identified keywords & their polarities'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$(".employeeoption").multiselect();
	
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
		/*
		 * $('.active').removeClass('active'); $('.OnSeleceActive').removeClass(
		 * 'OnSeleceActive'); $(this).next(".col-xs-12").children(
		 * '.TradeReviewKpiDepartmentFactor') .addClass('OnSeleceActive');
		 */
		var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
		/*console.log(keywordDivId + " 6");*/
		if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
			$("#" + keywordDivId).removeClass("OnSeleceActive");
		} else {
			$("#" + keywordDivId).addClass("OnSeleceActive");
		}
		/*
		 * $(keywordDivId).show(); 
		 */
		console.log(keywordDivId+" 6");
	});
	$('.userPrimeAction').click(function() {
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
	/**
	 * *************************end of
	 * initialization***********************************
	 */
}
function listsearchedReviewStatusResponse(response, searchText) {
	$('#hotelReviewsDivId').html('');
	var tempHtml = "";
	if (response.successObject.LIST_EMPTY == "TRUE") {
		tempHtml = "<font style='margin-left:25px;color:red'>  No Reviews Found</font>";
		$("#page-selection").hide();
	} else {
		$("#page-selection").show();
		var list = response.successObject.listAll;
		if (list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				var reviewTitle = "";
				var highlightedReviewContent = "";
				if (searchText != "") {
					reviewTitle = highlightSearchText(searchText,
							list[i].reviewTitle);
					highlightedReviewContent = highlightSearchText(searchText,
							list[i].highlightedReviewContent);
				} else {
					reviewTitle = list[i].reviewTitle;
					highlightedReviewContent = list[i].highlightedReviewContent;
				}
				var reviewedOn = $.datepicker.formatDate('d M yy', new Date(
						list[i].reviewTime));
				tempHtml += '<div class="row" >';
				tempHtml += '<div id="reviewContentDiv_' + list[i].id
						+ '" class="row col-xs-12 SingleReviewList">';
				tempHtml += '<div data-reviewid="'
						+ list[i].id
						+ '" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						tempHtml += '<div class=" ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						tempHtml += '<div class=" ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
				}
				tempHtml += '<div class="reviewDetails row">';
				tempHtml += '<div class="reviewSource">' + list[i].sourceName
						+ '</div>';
				tempHtml += '<div class="reviewerName">by <span>';
				if (list[i].reviewerName != null
						|| $.trim(list[i].reviewerName) == ""
						|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
					tempHtml += '' + list[i].reviewerName + '';
				} else {
					tempHtml += 'Not Available';
				}
				tempHtml += '</span></div>';
				tempHtml += '<div class="reviewerDetail">from <span>';
				if (list[i].reviewLocation == null
						|| list[i].reviewLocation == "") {
					tempHtml += ' Not Available </span></div>';
				} else {
					tempHtml += '' + list[i].reviewLocation + '</span></div>';
				}
				tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
						+ moment(list[i].reviewTime).format("DD MMMM YYYY")
						+ '</span>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';// Reciew
				// Starts
				// Here
				tempHtml += '<div style="float:right;">';
					tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+ list[i].id + ')"  /> ';
				tempHtml += '</div>';
				if (reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader" >'
							+ reviewTitle + '</h3>';
				}
				tempHtml += '<p>' + highlightedReviewContent + '</p>';
				
				if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
					//original review
					tempHtml += '<p id="originalReview_'+list[i].id+'" style="display:none">' + list[i].reviewContent + '</p>';
				}
				// star review rating from Review content site table
				if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
							tempHtml += '<div class="SourceRating col-xs-12">';
							tempHtml += '<span>Source Rating </span><span data-review-rating="'
									+ list[i].reviewOverallRating
									+ '" data-maximum-rating="'
									+ list[i].maxOverallRating
									+ '" class="starsTA">'
									+ list[i].reviewOverallRating
									+ '</span><span style="margin-left:5px; margin-right:35px;">'
									+ list[i].reviewOverallRating
									+ '/'
									+ list[i].maxOverallRating + '</span>'
									
									+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
									
									if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
										tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
									}
					
									if(list[i].respondStatus==true){
										tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}else{
										tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}
									if(list[i].markRead==true){
										tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
									}else{
										tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
									}
							tempHtml += '</div>';
				}else{
							if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
								tempHtml += '<div class="SourceRating col-xs-12">';
								tempHtml += '<span>Source Rating </span><span data-review-rating="'
										+ list[i].reviewOverallRating
										+ '" data-maximum-rating="'
										+ list[i].maxOverallRating
										+ '" class="starsHIQ">'
										+ list[i].reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ list[i].reviewOverallRating
										+ '/'
										+ list[i].maxOverallRating + '</span>'
										
										+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
										
										if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
											tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
										}
						
										if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}
										if(list[i].markRead==true){
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
										}else{
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
										}
								tempHtml += '</div>';
							}else{
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
										
										if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
											tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
										}
						
										if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}
										if(list[i].markRead==true){
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
										}else{
											tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
										}
								tempHtml += '</div>';
							}
				}
				tempHtml += '<div class="SourceKPIRating col-xs-12">';
				for (var h = 0; h < list[i].kpiIndustryMasterUiList.length; h++) {
					tempHtml += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
						 + list[i].kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
									
					if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
						tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
					}
					if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
						tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
					}
					
					tempHtml+=' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
							+ list[i].kpiIndustryMasterUiList[h].sourceKpiScore
							+ '/'
							+ list[i].kpiIndustryMasterUiList[h].maxRatingValue
							+ '</span></div>';
				}
				tempHtml += '</div>';
				if (list[i].keywordList.length > 0) {
					tempHtml += '<div id="keywordAndScore_'
							+ list[i].id
							+ '" class="TradeReviewKpiDepartmentFactor col-xs-12">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords <span class="keywords fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 8px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span> </div>';
					for (var h = 0; h < list[i].keywordList.length; h++) {
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="PositiveSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName+ '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NeutralSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName + '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NegativeSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName +'</span></div>';
								break;
							}
						}
					}
					tempHtml += '</div>';
				}
				tempHtml += '<div class="OnReviewActions col-xs-12">';
				tempHtml += '<div class="panel-body row">';
				tempHtml += '<ul class="nav nav-pills">';
				tempHtml += '<li style="display:none">';
				tempHtml += '<a class="userPrimeAction" onclick="openShare('
						+ list[i].id
						+ ')" data-toggle="tab"  href="#Share-pills'
						+ list[i].id + '">';
				/*
				 * tempHtml += '<span id="shareCountSpan' + list[i].id + '"
				 * class="glyphicon glyphicon-edit">Share('+
				 * list[i].sourceMasterUIList.length + ')</span>';
				 */
				tempHtml += '<div id="shareCountSpan' + list[i].id
						+ '" class="ShareReviewIcon">Share('
						+ list[i].sourceMasterUIList.length + ')</div>';
				tempHtml += '</a>';
				tempHtml += '</li>';
				tempHtml += '<li>';
				if (response.successObject.DEPARTMENTS.length == 0) {
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="return false;" href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div>';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a onclick="openNote('
							+ list[i].id
							+ ','
							+ $('#organizationName option:selected').val()
							+ ')" data-toggle="tab" class="userPrimeAction"href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div>';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li >';
				if (response.successObject.DEPARTMENTS.length == 0
						|| response.successObject.USERS.length == 0) {
					tempHtml += '<a data-toggle="tab" data-actiontype="Task" class="userPrimeAction"  onclick="return false;" href="#Action-pills'+ list[i].id + '">';
					//tempHtml += '<a data-toggle="tab" data-actiontype="Task" class="userPrimeAction" onclick="getComments('	+ list[i].id+ ','+ $('#organizationName option:selected').val()+ ',this)" onclick="return false;" href="#Action-pills'+ list[i].id + '">';
					tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#Action-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li class="" style="display:none">';
				tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="openBroadcast('
						+ list[i].id
						+ ')" href="#Broadcast-pills'
						+ list[i].id
						+ '">';
				tempHtml += '<div class="BroadcastIcon">Broadcast</div>';
				
				tempHtml += '</a>';
				tempHtml += '</li>';
				
				/****************************respond to review4************************************/
				tempHtml += '<li >';
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#ReplyToReview-pills'+ list[i].id + '">';
						tempHtml += '<div id="ReplyToReviewTabInReviews" class="ReplyToReview">Reply to review</div>';
					tempHtml += '</a>';
				tempHtml += '</li>';
				/****************************respond to review************************************/
				
				tempHtml += '</ul>';
				tempHtml += '<div class="tab-content">';
				
				
				//start reply
				tempHtml += '<div id="ReplyToReview-pills' + list[i].id+ '" class="SubHeading tab-pane fade">';
					tempHtml += '<div class="panel-body row">';
						tempHtml += '<ul class="nav nav-pills">';
						if(list[i].sourceBaseUrl){
							tempHtml += '<li class="">';
							if(((list[i].sourceName.toLowerCase()=="tripadvisor" 
								|| list[i].sourceName.toLowerCase()=="booking") 
								&& (list[i].sourceLogin != null && list[i].sourceLogin !='')  
								&&  (list[i].sourcePass != null  && list[i].sourcePass!='') 
								&& (list[i].sourceUrl != null && list[i].sourceUrl != '')) 
								|| (list[i].sourceName.toLowerCase()=="holidayiq" && list[i].reviewId != null && list[i].reviewId != '') )
								tempHtml += '<a  class="filterButton" onclick="showRespondModal('+list[i].id+',\'direct\')" >Direct Respond to Review Source</a>';
							else
								tempHtml += '<a  class="filterButton" id="DirectRespondReviewSource" onclick="respondToDirect('+list[i].id+')" href="//'+list[i].sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
							tempHtml += '</li>';
						}
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" id="DirectRespondReviewer" onclick="showRespondModal('+list[i].id+',\'reviewer\')"  class="filterButton" >Direct Respond to Reviewer</a>';
							tempHtml += '</li>';
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" id="RespondByMailToReviewSource" onclick="showRespondModal('+list[i].id+',\'reviewSource\')" >Respond by email to Review Source</a>';
							tempHtml += '</li>';
						tempHtml += '</ul>';
							tempHtml += '<div class="tab-content">';
							tempHtml += '</div>';
					tempHtml += '</div>';
				tempHtml += '</div>';
				//end reply
				
				
				tempHtml += '<div id="Broadcast-pills' + list[i].id
						+ '" class="SubHeading tab-pane fade">';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				if (list[i].broadcastStatus == true) {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '" checked>Tag reviews to hotel website.';
				} else {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '">Tag reviews to hotel website.';
				}
				tempHtml += '<button id="Save" onclick="saveBroadcast('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Done</button>';
				tempHtml += '<button id="Cancel" onclick="closeBroadcast('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Share-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div class="MediumNormalGreyContent col-xs-2">Share On:</div>'
						+ '<div id="shareDiv'
						+ list[i].id
						+ '" class="form-group col-xs-10 row">'
						+ '</div>'
						+ '<div class="col-xs-10 col-xs-offset-2 row">'
						+ '<div class="form-group input-group col-xs-12 footerButtons">'
						+ '<button id="Save" onclick="saveShare('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm" type="button"> Done</button>'
						+ '<button id="Cancel" onclick="closeShare('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of Share
				
				
				tempHtml += '<div id="Action-pills' + list[i].id
						+ '" class="SubHeading tab-pane fade">';
				tempHtml += '<div class="panel-body row">';
				tempHtml += '<ul class="nav nav-pills">'
						/*+ '<li class="active">'
						+ '<a data-toggle="tab" href="#Task-pills'
						+ list[i].id
						+ '"  data-actiontype="Task" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)" >'
						+ '<span class="glyphicon glyphicon"></span>'
						+ 'Assign a task'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="active">'
						+ '<a data-toggle="tab" id="RaiseTicketlink" href="#Ticket-pills'
						+ list[i].id
						+ '" data-actiontype="Ticket" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span  class="glyphicon glyphicon"> </span>'
						+ 'Raise a ticket'
						+ '</a>'
						+ '</li>'
					/*	+ '<li class="">'
						+ '<a data-toggle="tab" href="#Notify-pills'
						+ list[i].id
						+ '" data-actiontype="Notify" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Notify'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="">'
						+ '<a style="display: none;" data-toggle="tab" href="#General-pills'
						+ list[i].id
						+ '" data-actiontype="General" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'General'
						+ '</a>'
						+ '</li>'
					/*	+ '<li class="">'
						+ '<a data-toggle="tab" onclick="showRespondModal('
						+ list[i].id
						+ ')" href="#Respond-pills'
						+ list[i].id
						+ '">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Respond to reviews'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="">'
						+ '<a data-toggle="tab" id="FlagLink" onclick="loadFlags('
						+ list[i].id
						+ ')" href="#Flag-pills'
						+ list[i].id
						+ '">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Flag' + '</a>' + '</li>' + '</ul>';
				tempHtml += '<div class="Actiontitles" style="display:none" id="notesForTask_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForGeneral_'
						+ list[i].id + '">' + '</div>';
				
				tempHtml += '<div class="tab-content">';
				tempHtml += '<div id="Flag-pills' + list[i].id
						+ '" class="row  tab-pane ">';
				tempHtml += '<div class="Actiontitles">';
				tempHtml += '<div class="col-xs-12 form-horizontal">';
				tempHtml += '<div id="flagChkDiv_' + list[i].id
						+ '" class="form-group col-xs-10 row">';
				if ('DUPLICATE_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				}
				if ('DELETED_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				}
				if ('INCORRECT_LANGUAGE' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				}
				if ('OTHER' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				}
				tempHtml += '</div>';
				tempHtml += '<div class="form-group">';
				/*
				 * tempHtml+='<label class="col-xs-3 control-label">Comment<span
				 * class="mandatoryField">*</span></label>';
				 */
				tempHtml += '<div class=" col-xs-12">';
				tempHtml += '<div class="">';
				tempHtml += '<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				tempHtml += '<button onclick="saveFlag('
						+ list[i].id
						+ ')" id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
				/*
				 * tempHtml+='<button onclick="cancelFlag(' + list[i].id+ ')"
				 * id="Cancel" class="btn btn-default btn-sm float-right"
				 * type="button"> Cancel</button>';
				 */
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Task-pills' + list[i].id
						+ '" class="row tab-pane active">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTask_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
						+ list[i].id + '" class="form-control input-sm">'
						+ '<option value="" data-email="">Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTask_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForTask_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForTask_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTask('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTask" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Task Pill
				tempHtml += '<div id="Ticket-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group">'
							+ '<label class="col-xs-3 control-label">Priority<span class="mandatoryField">*</span></label>'
							 + '<div id="ticketPriorityDiv_' + list[i].id + '" class="col-xs-2">'
							 + '<select id="ticketPriorityOption_'	+ list[i].id + '" class="form-control input-sm">'
								 + '<option value="High" >High Priority</option>'
								 + '<option value="Medium" >Medium Priority</option>'
								 + '<option value="Low" >Low Priority</option>'
							 + '</select>'
							 + '</div>'
							 + '</div>'
						 
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For</label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
						+ list[i].id + '" class="form-control input-sm">'
						+ '<option value="" data-email="">Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTicket_'	+ list[i].id+ '" class="col-xs-3">'
							+ '<select multiple id="employeeForTicket_' + list[i].id 	+ '" class="form-control input-sm employeeoption">'
								/*+ '<option value="" >Select Employee</option>'*/
						+ '</select>'
						+ '</div>'
						
						
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForTicket_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						
						+ '<div id="emailForTicketDiv_'	+ list[i].id + '" class="form-group">'
						+ '<label class="col-xs-3 control-label">Share via email<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
							+ '<input id="emailForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter Email Address">'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">CC</label>'
						+ '<div class="col-xs-9">'
							+ '<input id="ccEmailsForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter CC Emails with comma seperated">'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTicket" onclick="cancelRaiseTicket('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Ticket Pill
				tempHtml += '<div id="Notify-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
						+ list[i].id + '" class="form-control input-sm">'
						+ '<option value="" data-email="">Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForNotify_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForNotify_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotify('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelNotify" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Notify Pill
				tempHtml += '<div style="display: none;" id="General-pills'
						+ list[i].id
						+ '" class="row tab-pane">'
						+ '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_'
						+ list[i].id + '" class="form-control input-sm">'
						+ '<option value="" data-email="">Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForGeneral_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForGeneral_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveGeneral" data-actiontype="General" onclick="saveNoteForGeneral('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelGeneral" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of General Pill
				$("#respondModal_"+ list[i].id).remove(); 
		if(!document.getElementById("respondModalLabel_"+ list[i].id)){			
				tempHtml += ' <div id="Respond-pills' + list[i].id
						+ '" class="row Actiontitles tab-pane">';
				tempHtml += '<div id="respondModal_'
						+ list[i].id
						+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
						+ '<div class="modal-dialog modal-lg">'
						+ '<div class="modal-content">'
						+ '<div class="modal-header">'
						+ '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>'
							+ '<h4 id="respondModalLabel_'+ list[i].id+ '" class="modal-title">Respond by email to Review Source</h4>'
							+ '<h4 id="respondsModalLabel_'+ list[i].id+ '" style="display:none" class="modal-title">Responds</h4>'
						+ '</div>'
						+ '<div class="modal-body row">'
						+ '<div class="row col-xs-12 SingleReviewList">'
						+ '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
							
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class=" ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
						}
						
						tempHtml += '<div class="reviewDetails row">';
						tempHtml += '<div class="reviewSource">' + list[i].sourceName
								+ '</div>';
						tempHtml += '<div class="reviewerName">by <span>';
						if (list[i].reviewerName != null
								|| $.trim(list[i].reviewerName) == ""
								|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
							tempHtml += '' + list[i].reviewerName + '';
						} else {
							tempHtml += 'Not Available';
						}
						tempHtml += '</span></div>';
						tempHtml += '<div class="reviewerDetail">from <span>';
						if (list[i].reviewLocation == null
								|| list[i].reviewLocation == "") {
							tempHtml += ' Not Available </span></div>';
						} else {
							tempHtml += '' + list[i].reviewLocation + '</span></div>';
						}
						tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
								+ moment(list[i].reviewTime).format("DD MMMM YYYY")
								+ '</span>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						/*+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Rating Score: <span class="score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>'*/

			    tempHtml+='</div>'
						+ '<div class="col-xs-12 col-sm-9 col-lg-10">';
				if (list[i].reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader">'
							+ list[i].reviewTitle + '</h3>';
				}
				tempHtml += '<p>'+ list[i].highlightedReviewContent	+ '</p>';
							// star review rating from Review content site table
				if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
										tempHtml += '<div class="SourceRating col-xs-12">';
										tempHtml += '<span>Source Rating </span><span data-review-rating="'
												+ list[i].reviewOverallRating
												+ '" data-maximum-rating="'
												+ list[i].maxOverallRating
												+ '" class="starsTA">'
												+ list[i].reviewOverallRating
												+ '</span><span style="margin-left:5px; margin-right:35px;">'
												+ list[i].reviewOverallRating
												+ '/'
												+ list[i].maxOverallRating
												+ '</span>'
												
												+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
										
												/*if(list[i].respondStatus==true){
													tempHtml += '<span  style="float:right;color:red;">Replied To Review</span>';
												}else{
													tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
												}*/
										tempHtml += '</div>';
				}else{
							if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
								tempHtml += '<div class="SourceRating col-xs-12">';
								tempHtml += '<span>Source Rating </span><span data-review-rating="'
										+ list[i].reviewOverallRating
										+ '" data-maximum-rating="'
										+ list[i].maxOverallRating
										+ '" class="starsHIQ">'
										+ list[i].reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ list[i].reviewOverallRating
										+ '/'
										+ list[i].maxOverallRating
										+ '</span>'
										
										+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
								
										/*if(list[i].respondStatus==true){
											tempHtml += '<span  style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
										}*/
								tempHtml += '</div>';
							}else{
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
											+ list[i].maxOverallRating
											+ '</span>';
											
											/*if(list[i].respondStatus==true){
												tempHtml += '<span  style="float:right;color:red;">Replied To Review</span>';
											}else{
												tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
											}*/
									tempHtml += '</div>';
							}
				}			
							
							/*tempHtml += '<div id="sourceKPIRating'+list[i].id+'" class="SourceKPIRating col-xs-12">';
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
							
							if (list[i].keywordList.length > 0) {
								tempHtml += '<div id="keywordAndScoreModal_'
										+ list[i].id
										+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
										+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
								for (var h = 0; h < list[i].keywordList.length; h++) {
									for (var p = 0; p < sentimentPolarityList.length; p++) {
										if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "positive") {
											tempHtml += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="PositiveSentimentCount"> '
													+ list[i].keywordList[h].nlpQueryName + '</span></div>';
											break;
										}
										if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "neutral") {
											tempHtml += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="NeutralSentimentCount"> '
													+ list[i].keywordList[h].nlpQueryName + '</span></div>';
											break;
										}
										if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "negative") {
											tempHtml += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="NegativeSentimentCount"> '
													+ list[i].keywordList[h].nlpQueryName +'</span></div>';
											break;
										}
									}
								}
								tempHtml += '</div>';
							}*/
							
						
			  tempHtml+= '<div class="form-group input-group col-xs-12">'
						
						+'<div class="form-group input-group col-xs-12">'
							+'<input type="email" id="reviewerEmail_'+list[i].id+'" class="form-control input-sm" placeholder="Enter Reviewer Email Address">'
						+'</div>'
					
						+ '<textarea id="respond_'
						+ list[i].id
						+ '" placeholder="Enter your response here" style="width: 704px; height: 145px;" maxlength="1000" class="form-control input-sm"></textarea>'
							+'<span id="responds_'+ list[i].id + '" style="display:none"></span>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<div id="validationMessageDiv_'
						+ list[i].id
						+ '" ></div>'
						+ '<button  onclick="respondToReview('
						+ list[i].id
						+ ','
						+ list[i].sourceId
						+ ')" id="save_'+list[i].id+'" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button data-dismiss="modal" id="cancel_'+list[i].id+'" onclick="resetRespond('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '<button data-dismiss="modal" id="ok_'+list[i].id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>'
						+ '</div>' + '</div>' + '</div>' + '</div>' + '</div>'
						+ '</div>' + '</div>';
				tempHtml += ' </div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
		}
				tempHtml += '<div id="Note-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div style="display:none" id="notesForReviewSiteContentId_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<p style="display:none ; color:red" class="has-error" id="errorForReviewSiteContentId_'
						+ list[i].id
						+ '"></p>'
						+ '<div class="col-xs-12">'
						+ '<div class="form-group input-group col-xs-12">'
						+ '<label>Enter your note <span class="mandatoryField">*</span></label>'
						+ '<textarea id="noteForReviewSiteContentId_'
						+ list[i].id
						+ '" class="form-control input-sm" ></textarea>'
						+ '</div>' + '<div class="row ">'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share with a department</label>'
						+ '<div class="">'
						+ '<select id="departmentForReviewSiteContentId_'
						+ list[i].id + '"  class="form-control input-sm">'
						+ '<option data-email="" value="" selected>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share via email</label>'
						+ '<div class="">'
						+ '<input id="emailForReviewSiteContentId_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Enter Email Address">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="Save" onclick="saveNote('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="Cancel" onclick="closeNote('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of QuickNote
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';// END of On action
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
			}// End Of for Loop
			$('#hotelReviewsDivId').empty();
			$('#page-selection').show();
		} else {
			tempHtml += '<font style="color:red">No Records Found </font>';
			$('#page-selection').hide();
		}
	}
	return tempHtml;
}
var restoreHotelReviewsDivIdHtml = '';
var restoreFilterBarHtml = '';
selectedSortOption='';

function restore(reviewId) {
	$("#searchBar").show();
	$('#filterBar').html(restoreFilterBarHtml);
	
	


	$('#sortSelectOption').val(selectedSortOption);


	
	$('#hotelReviewsDivId').hide();
	$('#hotelReviewsDivId').html(restoreHotelReviewsDivIdHtml);
	$("#page-selection").show();
	$('#hotelReviewsDivId').show(600);
	overwriteUpdatedReview(reviewId);
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
		/*
		 * $('.active').removeClass('active');
		 * $('.OnSeleceActive').removeClass('OnSeleceActive');
		 * $(this).next(".col-xs-12").children(
		 * '.TradeReviewKpiDepartmentFactor').addClass( 'OnSeleceActive');
		 */
		/*
		 * var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		 * console.log("keywordDivId :>"+keywordDivId+"<resoter");
		 * if($("#"+keywordDivId).hasClass("OnSeleceActive")){
		 * console.log("removing");
		 * $("#"+keywordDivId).removeClass("OnSeleceActive"); }else{
		 * console.log("adding ");
		 * $("#"+keywordDivId).addClass("OnSeleceActive"); }
		 */
	});
	$('.userPrimeAction').click(function() {
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
	
	var highlighted=selectedSortOption;
	$(function () {
	    $('#sortSelectOption').change(function() {
	        if(highlighted!="")
	            $('select option:contains(' + highlighted+ ')').removeClass('highlight');
	        highlighted=$(this).val();
	        $('select option:contains(' + $(this).val() + ')').addClass('highlight');
	    });
	});
}
function closeBroadcast(reviewId) {
	document.getElementById('Broadcast-pills' + reviewId).setAttribute("class",
			"SubHeading tab-pane fade");
}
function openBroadcast(reviewId) {
	document.getElementById('Broadcast-pills' + reviewId).setAttribute("class",
			"SubHeading tab-pane active");
}
function closeShare(reviewId) {
	document.getElementById('Share-pills' + reviewId).setAttribute("class",
			"row SubHeading tab-pane fade");
}
function openShare(reviewId) {
	getMappedSourcesForReview(reviewId);
	document.getElementById('Share-pills' + reviewId).setAttribute("class",
			"row SubHeading tab-pane active");
}
function closeNote(reviewId) {
	document.getElementById('Note-pills' + reviewId).setAttribute("class",
			"row SubHeading tab-pane fade");
	$("#departmentForReviewSiteContentId_" + reviewId).prop("selectedIndex", 0);
}
function openNote(reviewId, organizationId) {
	getNotes(reviewId, organizationId);
	document.getElementById('Note-pills' + reviewId).setAttribute("class",
			"row SubHeading tab-pane active");
}
/*function closeAction(reviewId) {
	document.getElementById('Action-pills' + reviewId).setAttribute("class","SubHeading tab-pane fade");
}*/
function openAction(reviewId) {
	document.getElementById('Action-pills' + reviewId).setAttribute("class",
			"SubHeading tab-pane active");
}
/*function respondToReview(reviewId, sourceId) {
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				var review=response.successObject.review;
				//console.log(review);
				var reviewId = "" + review.id;
				var sourceId = "" + review.sourceId;
				var organizationId = $('#organizationName option:selected').val();
				var responseType="";
				var reviewerMail="";
				var modalTitle=$('#respondModalLabel_'+reviewId).text();
				if(modalTitle.indexOf("Review Source")!=-1){
					responseType="REVIEW_SOURCE";
				}
				if(modalTitle.indexOf("Reviewer")!=-1){
					responseType="REVIEWER";
					reviewerMail=$('#reviewerEmail_'+reviewId).val();
				}
				var respond = $('#respond_' + reviewId).val();
				if ($('#respond_' + reviewId).val() == null
						|| $('#respond_' + reviewId).val() == ""
						|| $('#respond_' + reviewId).val() == " ") {
					
					var htmlCode="";
					
					if(responseType=="REVIEWER" && reviewerMail==""){
						htmlCode = '<p><font size="3" color="red">Please Enter Response And Reviewer email !</font></p>';
					}else{
						htmlCode = '<p><font size="3" color="red">Please Enter Response to review.</font></p>';
					}
					
					$('#validationMessageDiv_' + reviewId).html(htmlCode);
					$('#validationMessageDiv_' + reviewId).show();
				}else {
					
					if(responseType=="REVIEWER" && reviewerMail==""){
						var htmlCode = '<p><font size="3" color="red">Please Enter Reviewer email !</font></p>';
						$('#validationMessageDiv_' + reviewId).html(htmlCode);
						$('#validationMessageDiv_' + reviewId).show();
						return;
					}
					
					if(responseType=="REVIEWER" && !isEmail(reviewerMail)){
						var htmlCode = '<p><font size="3" color="red">Please Enter Reviewer vaild email !</font></p>';
						$('#validationMessageDiv_' + reviewId).html(htmlCode);
						$('#validationMessageDiv_' + reviewId).show();
						return;
					}
					
					var reviewResponseUI = {
						'organizationId' : organizationId,
						'reviewSiteContentId' : reviewId,
						'reviewContent' : review.reviewContent,
						'reviewerMail':reviewerMail,
						'responseType':responseType,
						'response' : respond,
						'sourceId' : sourceId
					};
					
					$('#wrapper').mask('Loading...');
					$('#leftNavigation,#header').mask();
					
					$.ajax({
								type : "POST",
								url : "../reviewSitesContent/respondToReview.htm",
								contentType : "application/json",
								data : JSON.stringify(reviewResponseUI),
								success : function(response) {
									if (response.status == "SAVE_SUCCESS") {
										$('#broadcastSuccessModalTitle').text("Success");
										$('#broadcastSuccessModalText').text("Respond successfully has been mailed !");
										$('#broadcastSuccessModal').modal('show');
										$('#respond_' + reviewId).val('');
										$('#validationMessageDiv_' + reviewId).hide();
										$('#respondModal_' + reviewId).modal('hide');
										$('#repliedToReview_'+reviewId).show();
										$('#leftNavigation,#wrapper,#header').unmask();
									} else {
										if (response.status == "SAVE_ERROR") {
											$('#broadcastSuccessModalTitle').text("Error");
											$('#broadcastSuccessModalText').text(response.errorMessage);
											$('#broadcastSuccessModal').modal('show');
											if (response.errorMessage == "Email adress not found for selected source, Please contact admin ! ") {
												$('#validationMessageDiv_' + reviewId).hide();
											}
										}
									}
								},
								error : function(response) {
									$('#broadcastSuccessModalTitle').text("Error");
									$('#broadcastSuccessModalText').text("Something went wrong , please contact admin !");
									$('#broadcastSuccessModal').modal('show');
								}
							});
				}
			
			}
		}
	});
}

function respondToDirect(reviewId) {
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				var review=response.successObject.review;
				var reviewId = "" + review.id;
				var sourceId = "" + review.sourceId;
				var organizationId = $('#organizationName option:selected').val();
				var responseType="DIRECT";
				var reviewerMail="";
				var respond = "";
			
				var reviewResponseUI = {
					'organizationId' : organizationId,
					'reviewSiteContentId' : reviewId,
					'reviewContent' : review.reviewContent,
					'reviewerMail':reviewerMail,
					'responseType':responseType,
					'response' : respond,
					'sourceId' : sourceId
				};
				
				$.ajax({
							type : "POST",
							url : "../reviewSitesContent/respondToReview.htm",
							contentType : "application/json",
							data : JSON.stringify(reviewResponseUI),
							success : function(response) {
									if (response.status == "SAVE_ERROR") {
										$('#broadcastSuccessModalTitle').text("Error");
										$('#broadcastSuccessModalText').text(response.errorMessage);
										$('#broadcastSuccessModal').modal('show');
									}
									if(response.status == "SAVE_SUCCESS"){
										$('#repliedToReview_'+reviewId).show();
									}
							},
							error : function(response) {
								$('#broadcastSuccessModalTitle').text("Error");
								$('#broadcastSuccessModalText').text("Something went wrong , please contact admin !");
								$('#broadcastSuccessModal').modal('show');
							}
				});
			}
		}
	});
}

function getResponds(reviewId) {
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/getResponds.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				var responds=response.successObject.responds;
				var respondsHtml="";
				for(var i=0;i<responds.length;i++){
					respondsHtml+='<strong>Response : </strong>'+responds[i].response+" <strong>Type : </strong>"+responds[i].responseTypeStr+" <strong>Date : </strong>"+responds[i].createdDateStr+" <strong>User : </strong>"+responds[i].userName+'<br />';
				}
				$('#responds_'+reviewId).html(respondsHtml);
				showRespondModal(reviewId,'reviwer');
				$('#respondModalLabel_'+reviewId).hide();
				$('#respondsModalLabel_'+reviewId).show();
				$('#sourceKPIRating'+reviewId).hide();
				$('#keywordAndScoreModal_'+reviewId).hide();
				$('#reviewerEmail_'+reviewId).hide();
				$('#respond_'+reviewId).hide();
				$('#responds_'+reviewId).show();
				$('#save_'+reviewId).hide();
				$('#cancel_'+reviewId).hide();
				$('#ok_'+reviewId).show();
		}
	}
   });
}*/
/*function markReadUpdate(reviewId,markRead){
	var reviews=[{"id":reviewId,"markRead":markRead}];
	markReadBatchUpdate(reviews);
}
function markAll(){
	var reviews=[];
	var markParam = $('#markReadSelectOption option:selected').val();
	var spans = document.getElementsByClassName("markReadClass");
	if(markParam=="read"){
		$(spans).each(function(index,value){
			var reviewId=$(this).data("name");
			var review={"id":reviewId,"markRead":true};
			reviews.push(review);
		});
	}
	if(markParam=="unread"){
		$(spans).each(function(index,value){
			var reviewId=$(this).data("name");
			var review={"id":reviewId,"markRead":false};
			reviews.push(review);
		});
	}
	markReadBatchUpdate(reviews);
}

function markReadBatchUpdate(reviews){
	$('#wrapper').mask('Loading...');
	$('#leftNavigation,#header').mask();
	
	
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/updateMarkRead.htm",
		contentType : "application/json",
		data : JSON.stringify(reviews),
		success : function(response) {
			if(response.status=="SUCCESS"){
				$('#leftNavigation,#wrapper,#header').unmask();
				$(reviews).each(function(index,value){
					var htmlCode="";
					if(reviews[index].markRead==true){
						htmlCode += '<a onclick="markReadUpdate('+reviews[index].id+',false)" href="#">Mark as Unread | </a>';
					}else{
						htmlCode += '<a onclick="markReadUpdate('+reviews[index].id+',true)" href="#">Mark as Read | </a>';
					}
					$("#markReadSpan_"+reviews[index].id).html(htmlCode);
				});
				if(reviews.length>1){
					$('#broadcastSuccessModalTitle').text("Success");
					$('#broadcastSuccessModalText')
							.text("Review(s) has been marked successfully !");
					$('#broadcastSuccessModal').modal('show');
				}
		}else{
			$('#broadcastSuccessModalTitle').text("Error");
			$('#broadcastSuccessModalText')
					.text("Sorry , Error occurred contact admin !");
			$('#broadcastSuccessModal').modal('show');
		}
	}
   });
}*/
function loadFlags(reviewId) {
	$("#notesForTask_" + reviewId).hide();
	$("#notesForTicket_" + reviewId).hide();
	$("#notesForNotify_" + reviewId).hide();
	$("#notesForGeneral_" + reviewId).hide();
}
function paginationSorted(reviews, countPerPage, divId, response) {
	var pages = 0;
	if (reviews.length % countPerPage == 0 && reviews.length > 0) {
		pages = reviews.length / countPerPage;
	} else {
		pages = reviews.length / countPerPage + 1;
	}
	$('#page-selection').bootpag({
		total : pages,
		page : 1,
		maxVisible : 10
	}).on('page', function(event, num) {
		var start = (num - 1) * countPerPage;
		var end = num * countPerPage;
		if (end > reviews.length) {
			end = reviews.length;
		}
		// paint reviews
		var html = "";
		/*
		 * for(var i=start;i<end;i++){ html = html+reviews[i]+"<br/>"; }
		 */
		var successObject = {
			'listAll' : response.successObject.listAll.slice(start, end),
			'DEPARTMENTS' : response.successObject.DEPARTMENTS,
			'USERS' : response.successObject.USERS
		};
		var response2 = {
			'successObject' : successObject
		};
		html = listSortedReviewsStatusResponse(response2, searchText);
		$(divId).html(html);
		
		$('.ratingScore').each(function() {
	         $(this).qtip({
	             content: {
	                 text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
	             },
	          position: {
	        	  my: 'bottom center',  
		          at: 'top center', 
	         },
	         style: {
	             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	         }
	         });
	     });
		
		$('.ReviewNoteIcon').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Internal communication workflow '
	            },
	         position: {
       	  		my: 'bottom center',  
		          at: 'top center', 
	            //target: $('#QuickNotesTabInReviews') // my target
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
	    });
		
		$('.ReplyToReview').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Single platform to reply to reviews  '
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
	    });
		
		$('.keywords ').each(function() {
	        $(this).qtip({
	            content: {
	                text: 'Identified keywords & their polarities'
	            },
	         position: {
	       	  my: 'bottom center',  
		          at: 'top center', 
	        },
	        style: {
	            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
	        }
	        });
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
			/*
			 * $('.active').removeClass('active');
			 * $('.OnSeleceActive').removeClass('OnSeleceActive');
			 * $(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');
			 */
			var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
			/*console.log(keywordDivId + " 9");*/
			if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
				$("#" + keywordDivId).removeClass("OnSeleceActive");
			} else {
				$("#" + keywordDivId).addClass("OnSeleceActive");
			}
			/*
			 * $(keywordDivId).show(); console.log(keywordDivId+" 9");
			 */
		});
		$('.userPrimeAction').click(function() {
			$('.active').removeClass('active');
			$('.OnSeleceActive').removeClass('OnSeleceActive');
		});
	});
	/**
	 * ***************************initializatio of
	 * pagination****************************
	 */
	var successObject = {
		'listAll' : response.successObject.listAll.slice(0, 4),
		'DEPARTMENTS' : response.successObject.DEPARTMENTS,
		'USERS' : response.successObject.USERS
	};
	var response2 = {
		'successObject' : successObject
	};
	var html = listSortedReviewsStatusResponse(response2, searchText);
	$('#hotelReviewsDivId').html(html);
	
	$('.ratingScore').each(function() {
        $(this).qtip({
            content: {
                text: 'Review specific score based on KePSLA&#39;s weightage & parameters'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center',  
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.ReviewNoteIcon').each(function() {
        $(this).qtip({
            content: {
                text: 'Internal communication workflow '
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
            //target: $('#QuickNotesTabInReviews') // my target
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.ReplyToReview').each(function() {
        $(this).qtip({
            content: {
                text: 'Single platform to reply to reviews '
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$('.keywords ').each(function() {
        $(this).qtip({
            content: {
                text: 'Identified keywords & their polarities'
            },
         position: {
       	  my: 'bottom center',  
	          at: 'top center', 
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
        }
        });
    });
	
	$(".employeeoption").multiselect();
	
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
		/*
		 * $('.active').removeClass('active'); $('.OnSeleceActive').removeClass(
		 * 'OnSeleceActive'); $(this).next(".col-xs-12").children(
		 * '.TradeReviewKpiDepartmentFactor') .addClass('OnSeleceActive');
		 */
		var keywordDivId = "keywordAndScore_" + $(this).data('reviewid');
		/*console.log(keywordDivId + " 10");*/
		if ($("#" + keywordDivId).hasClass("OnSeleceActive")) {
			$("#" + keywordDivId).removeClass("OnSeleceActive");
		} else {
			$("#" + keywordDivId).addClass("OnSeleceActive");
		}
		/*
		 * $(keywordDivId).show(); console.log(keywordDivId+" 10");
		 */
	});
	$('.userPrimeAction').click(function() {
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
	/**
	 * *************************end of
	 * initialization***********************************
	 */
}
function sortReview() {
	$('#wrapper').mask('Loading...');
	$('#leftNavigation,#header').mask();
	
	var sortByParam = $('#sortSelectOption option:selected').val();
/*	var organizationParam = $('#organizationName option:selected').val();
	var fromDate = $('#altFromDate').val();
	var toDate = $('#altToDate').val();*/
	
	if(filteredReviewsDuplicateResponseObject==null){
		
		$('#selectedFiltersDiv').find('span').remove();
		if(sortByParam=="Date Ascending"){
			normalReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
				  	  return new Date(a.reviewTime) - new Date(b.reviewTime);
				});
		}
		if(sortByParam=="Date Descending"){
			normalReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
				  	  return new Date(b.reviewTime) - new Date(a.reviewTime);
				});
		}
		if(sortByParam=="Repufactor Ascending"){
			normalReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
					 return b.repufactorScore - a.repufactorScore;
				});
		}
		if(sortByParam=="Repufactor Descending"){
			normalReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
				     return a.repufactorScore - b.repufactorScore;
				});
		}
		
		/* for search purpose */
		sortedReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(normalReviewsDuplicateResponseObject));
		var totalReviews = normalReviewsDuplicateResponseObject.successObject.listAll;
		paginationSorted(totalReviews, 4, hotelReviewsDivId, normalReviewsDuplicateResponseObject);
		$('#leftNavigation,#wrapper,#header').unmask();
		
	}else{
		
		if(sortByParam=="Date Ascending"){
			filteredReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
				  	  return new Date(a.reviewTime) - new Date(b.reviewTime);
				});
		}
		if(sortByParam=="Date Descending"){
			filteredReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
				  	  return new Date(b.reviewTime) - new Date(a.reviewTime);
				});
		}
		if(sortByParam=="Repufactor Ascending"){
			filteredReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
					 return b.repufactorScore - a.repufactorScore;
				});
		}
		if(sortByParam=="Repufactor Descending"){
			filteredReviewsDuplicateResponseObject.successObject.listAll.sort(function(a,b){
				     return a.repufactorScore - b.repufactorScore;
				});
		}
		
		/* for search purpose */
		sortedReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(filteredReviewsDuplicateResponseObject));
		var totalReviews = filteredReviewsDuplicateResponseObject.successObject.listAll;
		paginationSorted(totalReviews, 4, hotelReviewsDivId, filteredReviewsDuplicateResponseObject);
		$('#leftNavigation,#wrapper,#header').unmask();
	}
}
function listSortedReviewsStatusResponse(response, searchText) {
	var tempHtml = "";
	if (response.status == "LIST_EMPTY") {
		tempHtml = "<font style='margin-left:25px;color:red'>  No Reviews Found</font>";
		$("#page-selection").hide();
	} else {
		$("#page-selection").show();
		var list = response.successObject.listAll;
		/*console.log(list);*/
		if (list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				var reviewTitle = "";
				var highlightedReviewContent = "";
				if (searchText != "") {
					reviewTitle = highlightSearchText(searchText,
							list[i].reviewTitle);
					highlightedReviewContent = highlightSearchText(searchText,
							list[i].highlightedReviewContent);
				} else {
					reviewTitle = list[i].reviewTitle;
					highlightedReviewContent = list[i].highlightedReviewContent;
				}
				var reviewedOn = $.datepicker.formatDate('d M yy', new Date(
						list[i].reviewTime));
				tempHtml += '<div class="row" >';
				tempHtml += '<div id="reviewContentDiv_' + list[i].id
						+ '" class="row col-xs-12 SingleReviewList">';
				tempHtml += '<div data-reviewid="'
						+ list[i].id
						+ '" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						tempHtml += '<div class=" ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage
							&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						tempHtml += '<div class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'
								+ list[i].repufactorScore.toFixed(2)
								+ '%</span> </div>';
						break;
					}
				}
				tempHtml += '<div class="reviewDetails row">';
				tempHtml += '<div class="reviewSource">' + list[i].sourceName
						+ '</div>';
				tempHtml += '<div class="reviewerName">by <span>';
				if (list[i].reviewerName != null
						|| $.trim(list[i].reviewerName) == ""
						|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
					tempHtml += '' + list[i].reviewerName + '';
				} else {
					tempHtml += 'Not Available';
				}
				tempHtml += '</span></div>';
				tempHtml += '<div class="reviewerDetail">from <span>';
				if (list[i].reviewLocation == null
						|| list[i].reviewLocation == "") {
					tempHtml += ' Not Available </span></div>';
				} else {
					tempHtml += '' + list[i].reviewLocation + '</span></div>';
				}
				tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
						+ moment(list[i].reviewTime).format("DD MMMM YYYY")
						+ '</span>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';// Reciew
				// Starts
				// Here
				tempHtml += '<div style="float:right;">';
					tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+ list[i].id + ')" /> ';
				tempHtml += '</div>';
				if (reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader" >'
							+ reviewTitle + '</h3>';
				}
				tempHtml += '<p>' + highlightedReviewContent + '</p>';
				
				if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
					//original review
					tempHtml += '<p id="originalReview_'+list[i].id+'" style="display:none">' + list[i].reviewContent + '</p>';
				}
				// star review rating from Review content site table
				if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
									tempHtml += '<div class="SourceRating col-xs-12">';
									tempHtml += '<span>Source Rating </span><span data-review-rating="'
											+ list[i].reviewOverallRating
											+ '" data-maximum-rating="'
											+ list[i].maxOverallRating
											+ '" class="starsTA">'
											+ list[i].reviewOverallRating
											+ '</span><span style="margin-left:5px; margin-right:35px;">'
											+ list[i].reviewOverallRating
											+ '/'
											+ list[i].maxOverallRating + '</span>'
											+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
											
											if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
												tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
											}
							
											if(list[i].respondStatus==true){
												tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
											}else{
												tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
											}
											if(list[i].markRead==true){
												tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
											}else{
												tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
											}
											
									tempHtml += '</div>';
				}else{
						if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
							tempHtml += '<div class="SourceRating col-xs-12">';
							tempHtml += '<span>Source Rating </span><span data-review-rating="'
									+ list[i].reviewOverallRating
									+ '" data-maximum-rating="'
									+ list[i].maxOverallRating
									+ '" class="starsHIQ">'
									+ list[i].reviewOverallRating
									+ '</span><span style="margin-left:5px; margin-right:35px;">'
									+ list[i].reviewOverallRating
									+ '/'
									+ list[i].maxOverallRating + '</span>'
									+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
									
									if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
										tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
									}
					
									if(list[i].respondStatus==true){
										tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}else{
										tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
									}
									if(list[i].markRead==true){
										tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
									}else{
										tempHtml += '<span  id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
									}
									
							tempHtml += '</div>';
						}else{
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
										
										if(highlightedReviewContent!=null && highlightedReviewContent!="" && list[i].reviewLanguage!="Unknown" && list[i].reviewLanguage!="N/A" && list[i].reviewLanguage!=null && list[i].reviewLanguage!="" && list[i].reviewLanguage.toUpperCase()!="ENGLISH" && list[i].reviewLanguage.toUpperCase()!="EN"){
											tempHtml += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+list[i].id+')" href="javascript:void(0)">Original Review | </a></span>';
										}
						
										if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+list[i].id+')" href="#">Replied To Review | </a></span>';
										}
										if(list[i].markRead==true){
											tempHtml += '<span id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+list[i].id+',false)" href="#">Mark as Unread | </a></span>';
										}else{
											tempHtml += '<span id="markReadSpan_'+list[i].id+'" data-name="'+list[i].id+'" class="markReadClass"  style="float:right;color:read;"><a onclick="markReadUpdate('+list[i].id+',true)" href="#">Mark as Read | </a></span>';
										}
										
								tempHtml += '</div>';
						}
				}
				tempHtml += '<div class="SourceKPIRating col-xs-12">';
				for (var h = 0; h < list[i].kpiIndustryMasterUiList.length; h++) {
					tempHtml += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
						 + list[i].kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
								
					if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
						tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
					}
					if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
						tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
					}
					
				    tempHtml+= ' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
							+ list[i].kpiIndustryMasterUiList[h].sourceKpiScore
							+ '/'
							+ list[i].kpiIndustryMasterUiList[h].maxRatingValue
							+ '</span></div>';
				}
				tempHtml += '</div>';
				/*
				 * if(list[i].kpiTagSentimentAnalysisUIList.length>0){
				 * 
				 * tempHtml += '<div class="TradeReviewKpiDepartmentFactor
				 * col-xs-12">' + '<div class="KPIScoreHeader
				 * SmallBoldGreyContent col-xs-12">KPI Polarity Score</div>';
				 * 
				 * 
				 * for (var h = 0; h <
				 * list[i].kpiTagSentimentAnalysisUIList.length; h++) { tempHtml
				 * +='<div class="KPIScore col-xs-4">
				 * '+list[i].kpiTagSentimentAnalysisUIList[h].kpiName+' <span
				 * class="PositiveSentimentCount">
				 * '+list[i].kpiTagSentimentAnalysisUIList[h].kpiFactorScore+'%</span></div>'; }
				 * 
				 * tempHtml +='</div>';
				 *  }
				 */
				if (list[i].keywordList.length > 0) {
					tempHtml += '<div id="keywordAndScore_'
							+ list[i].id
							+ '" class="TradeReviewKpiDepartmentFactor col-xs-12">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords<span class="keywords fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 8px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span></div>';
					for (var h = 0; h < list[i].keywordList.length; h++) {
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="PositiveSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName+ '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NeutralSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName +'</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NegativeSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName + '</span></div>';
								break;
							}
						}
					}
					tempHtml += '</div>';
				}
				tempHtml += '<div class="OnReviewActions col-xs-12">';
				tempHtml += '<div class="panel-body row">';
				tempHtml += '<ul class="nav nav-pills">';
				tempHtml += '<li style="display:none">';
				tempHtml += '<a class="userPrimeAction" onclick="openShare('
						+ list[i].id
						+ ')" data-toggle="tab" href="#Share-pills'
						+ list[i].id + '">';
				tempHtml += '<div id="shareCountSpan' + list[i].id
						+ '" class="ShareReviewIcon">Share('
						+ list[i].sourceMasterUIList.length + ')</div>';
				tempHtml += '</a>';
				tempHtml += '</li>';
				tempHtml += '<li>';
				if (response.successObject.DEPARTMENTS.length == 0) {
					tempHtml += '<a class="userPrimeAction" data-toggle="tab" onclick="return false;" href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a class="userPrimeAction" onclick="openNote('
							+ list[i].id + ','
							+ $('#organizationName option:selected').val()
							+ ')" data-toggle="tab" href="#Note-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li >';
				if (response.successObject.DEPARTMENTS.length == 0
						|| response.successObject.USERS.length == 0) {
					//tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task" onclick="getComments('	+ list[i].id+ ','+ $('#organizationName option:selected').val()+ ',this)" onclick="return false;" href="#Action-pills'+ list[i].id + '">';
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task"  onclick="return false;" href="#Action-pills'+ list[i].id + '">';
					tempHtml += '<div  id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				} else {
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#Action-pills'
							+ list[i].id + '">';
					tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
					tempHtml += '</a>';
				}
				tempHtml += '</li>';
				tempHtml += '<li class="" style="display:none">';
				tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="openBroadcast('
						+ list[i].id
						+ ')" href="#Broadcast-pills'
						+ list[i].id
						+ '">';
				tempHtml += '<div class="BroadcastIcon">Broadcast</div>';
				tempHtml += '</a>';
				tempHtml += '</li>';
				/*********************respond to review pill5*****************************************/
				tempHtml += '<li >';
					tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#ReplyToReview-pills'+ list[i].id + '">';
						tempHtml += '<div id="ReplyToReviewTabInReviews" class="ReplyToReview">Reply to review</div>';
					tempHtml += '</a>';
				tempHtml += '</li>';
				
				/*********************respond to review pill*****************************************/
				tempHtml += '</ul>';
				tempHtml += '<div class="tab-content">';
				
				//start reply
				tempHtml += '<div id="ReplyToReview-pills' + list[i].id+ '" class="SubHeading tab-pane fade">';
					tempHtml += '<div class="panel-body row">';
						tempHtml += '<ul class="nav nav-pills">';
						if(list[i].sourceBaseUrl){
							tempHtml += '<li class="">';
							if(((list[i].sourceName.toLowerCase()=="tripadvisor" 
								|| list[i].sourceName.toLowerCase()=="booking") 
								&& (list[i].sourceLogin != null && list[i].sourceLogin !='')  
								&&  (list[i].sourcePass != null  && list[i].sourcePass!='') 
								&& (list[i].sourceUrl != null && list[i].sourceUrl != '')) 
								|| (list[i].sourceName.toLowerCase()=="holidayiq" && list[i].reviewId != null && list[i].reviewId != '') )
								tempHtml += '<a  class="filterButton" onclick="showRespondModal('+list[i].id+',\'direct\')" >Direct Respond to Review Source</a>';
							else
								tempHtml += '<a  class="filterButton" id="DirectRespondReviewSource" onclick="respondToDirect('+list[i].id+')" href="//'+list[i].sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
							tempHtml += '</li>';
						}
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" class="filterButton" id="DirectRespondReviewer" onclick="showRespondModal('+list[i].id+',\'reviewer\')" >Direct Respond to Reviewer</a>';
							tempHtml += '</li>';
							tempHtml += '<li class="">';
								tempHtml += '<a type="button" id="RespondByMailToReviewSource" onclick="showRespondModal('+list[i].id+',\'reviewSource\')" >Respond by email to Review Source</a>';
							tempHtml += '</li>';
						tempHtml += '</ul>';
							tempHtml += '<div class="tab-content">';
							tempHtml += '</div>';
					tempHtml += '</div>';
				tempHtml += '</div>';
				//end reply
				
				tempHtml += '<div id="Broadcast-pills' + list[i].id
						+ '" class="SubHeading tab-pane fade">';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				if (list[i].broadcastStatus == true) {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '" checked>Tag reviews to hotel website.';
				} else {
					tempHtml += '<input type="checkbox" name="broadcastChk'
							+ list[i].id + '" id="broadcastChk' + list[i].id
							+ '"> Tag reviews to hotel website.';
				}
				tempHtml += '<button id="Save" onclick="saveBroadcast('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Done</button>';
				tempHtml += '<button onclick="closeBroadcast('
						+ list[i].id
						+ ')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Share-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div class="MediumNormalGreyContent col-xs-2">Share On:</div>'
						+ '<div id="shareDiv'
						+ list[i].id
						+ '" class="form-group col-xs-10 row">'
						+ '</div>'
						+ '<div class="col-xs-10 col-xs-offset-2 row">'
						+ '<div class="form-group input-group col-xs-12 footerButtons">'
						+ '<button id="Save" onclick="saveShare('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm" type="button"> Done</button>'
						+ '<button id="Cancel" onclick="closeShare('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of Share
				// END of Share
			
				
				tempHtml += '<div id="Action-pills' + list[i].id
						+ '" class="SubHeading tab-pane fade">';
				tempHtml += '<div class="panel-body row">';
				tempHtml += '<ul class="nav nav-pills">'
					/*	+ '<li class="active">'
						+ '<a data-toggle="tab" href="#Task-pills'
						+ list[i].id
						+ '"  data-actiontype="Task" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)" >'
						+ '<span class="glyphicon glyphicon"></span>'
						+ 'Assign a task'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="active">'
						+ '<a data-toggle="tab" id="RaiseTicketlink" href="#Ticket-pills'
						+ list[i].id
						+ '" data-actiontype="Ticket" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span  class="glyphicon glyphicon"> </span>'
						+ 'Raise a ticket'
						+ '</a>'
						+ '</li>'
					/*	+ '<li class="">'
						+ '<a data-toggle="tab" href="#Notify-pills'
						+ list[i].id
						+ '" data-actiontype="Notify" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Notify'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="">'
						+ '<a data-toggle="tab" style="display: none;" href="#General-pills'
						+ list[i].id
						+ '" data-actiontype="General" onclick="getComments('
						+ list[i].id
						+ ','
						+ $('#organizationName option:selected').val()
						+ ',this)">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'General'
						+ '</a>'
						+ '</li>'
						/*+ '<li class="">'
						+ '<a data-toggle="tab" onclick="showRespondModal('
						+ list[i].id
						+ ')" href="#Respond-pills'
						+ list[i].id
						+ '">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Respond to reviews'
						+ '</a>'
						+ '</li>'*/
						+ '<li class="">'
						+ '<a data-toggle="tab" id="FlagLink" onclick="loadFlags('
						+ list[i].id
						+ ')" href="#Flag-pills'
						+ list[i].id
						+ '">'
						+ '<span class="glyphicon glyphicon"> </span>'
						+ 'Flag' + '</a>' + '</li>' + '</ul>';
				tempHtml += '<div class="Actiontitles" style="display:none" id="notesForTask_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<div class="Actiontitles" style="display:none" id="notesForGeneral_'
						+ list[i].id + '">' + '</div>';
				
				
				
				tempHtml += '<div class="tab-content">';
				tempHtml += '<div id="Flag-pills' + list[i].id
						+ '" class="row  tab-pane ">';
				tempHtml += '<div class="Actiontitles">';
				tempHtml += '<div class="col-xs-12 form-horizontal">';
				tempHtml += '<div id="flagChkDiv_' + list[i].id
						+ '" class="form-group col-xs-10 row">';
				if ('DUPLICATE_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Duplicate Review</label></div>';
				}
				if ('DELETED_REVIEW' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Review deleted from source</label></div>';
				}
				if ('INCORRECT_LANGUAGE' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Language not correct</label></div>';
				}
				if ('OTHER' in list[i].flags) {
					tempHtml += '<div class="col-xs-6"><label><input checked value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				} else {
					tempHtml += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
							+ list[i].id
							+ '" type="checkbox"> Other</label></div>';
				}
				tempHtml += '</div>';
				tempHtml += '<div class="form-group">';
				/*
				 * tempHtml+='<label class="col-xs-3 control-label">Comment<span
				 * class="mandatoryField">*</span></label>';
				 */
				tempHtml += '<div class=" col-xs-12">';
				tempHtml += '<div class="">';
				tempHtml += '<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
				tempHtml += '<button onclick="saveFlag('
						+ list[i].id
						+ ')"  id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
				tempHtml += '<button onclick="cancelFlag('
						+ list[i].id
						+ ')"  id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '<div id="Task-pills' + list[i].id
						+ '" class="row  tab-pane active">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTask_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTask_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForTask_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForTask_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTask('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTask" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Task Pill
				tempHtml += '<div id="Ticket-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group">'
							+ '<label class="col-xs-3 control-label">Priority<span class="mandatoryField">*</span></label>'
						 + '<div id="ticketPriorityDiv_' + list[i].id + '" class="col-xs-2">'
						 + '<select id="ticketPriorityOption_'	+ list[i].id + '" class="form-control input-sm">'
							 + '<option value="High" >High Priority</option>'
							 + '<option value="Medium" >Medium Priority</option>'
							 + '<option value="Low" >Low Priority</option>'
						 + '</select>'
						 + '</div>'
						 + '</div>'
						 
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For</label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForTicket_'	+ list[i].id + '" class="col-xs-3">'
							+ '<select multiple id="employeeForTicket_' + list[i].id	+ '" class="form-control input-sm employeeoption">'
								/*+ '<option value="" >Select Employee</option>'*/
						+ '</select>'
						+ '</div>'
						
						
						 
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForTicket_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						
						+ '<div id="emailForTicketDiv_'	+ list[i].id + '" class="form-group">'
						+ '<label class="col-xs-3 control-label">Share via email<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
							+ '<input id="emailForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter Email Address">'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">CC</label>'
						+ '<div class="col-xs-9">'
							+ '<input id="ccEmailsForTicket_'	+ list[i].id + '" class="form-control input-sm" placeholder="Enter CC Emails with comma seperated">'
						+ '</div>'
						+ '</div>'
						
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelTicket" onclick="cancelRaiseTicket('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Ticket Pill
				tempHtml += '<div id="Notify-pills' + list[i].id
						+ '" class="row tab-pane">';
				tempHtml += '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForNotify_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForNotify_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForNotify_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotify('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelNotify" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of Notify Pill
				tempHtml += '<div style="display: none;" id="General-pills'
						+ list[i].id
						+ '" class="row  tab-pane">'
						+ '<div class="col-xs-12 form-horizontal">'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
						+ '<div class=" col-xs-9">'
						+ '<div class="">'
						+ '<input id="noteForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-4">'
						+ '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="' + list[i].id
							+ '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>' + '</div>'
						+ '<div id="employeeDivForGeneral_'
						+ list[i].id
						+ '" class="col-xs-5">'
						+ '<select id="employeeForGeneral_'
						+ list[i].id
						+ '" class="form-control input-sm">'
						+ '<option value="" >Select Employee</option>'
						+ '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group">'
						+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
						+ '<div class="col-xs-9">'
						+ '<input id="datetimepickerForGeneral_'
						+ list[i].id
						+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="SaveGeneral" data-actiontype="General" onclick="saveNoteForGeneral('
						+ list[i].id
						+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="CancelGeneral" onclick="closeAction('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>';
				tempHtml += '</div>';// End Of General Pill
				$("#respondModal_"+ list[i].id).remove(); 
		if(!document.getElementById("respondModalLabel_"+ list[i].id)){		
				tempHtml += ' <div id="Respond-pills' + list[i].id
						+ '" class="row Actiontitles tab-pane">';
				tempHtml += '<div id="respondModal_'
						+ list[i].id
						+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
						+ '<div class="modal-dialog modal-lg">'
						+ '<div class="modal-content">'
						+ '<div class="modal-header">'
						+ '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>'
							+ '<h4 id="respondModalLabel_'+ list[i].id+ '" class="modal-title">Respond by email to Review Source</h4>'
							+ '<h4 id="respondsModalLabel_'+ list[i].id+ '" style="display:none" class="modal-title">Responds</h4>'
						+ '</div>'
						+ '<div class="modal-body row">'
						+ '<div class="row col-xs-12 SingleReviewList">'
						+ '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
						
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div  class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
						}
						
						tempHtml += '<div class="reviewDetails row">';
						tempHtml += '<div class="reviewSource">' + list[i].sourceName
								+ '</div>';
						tempHtml += '<div class="reviewerName">by <span>';
						if (list[i].reviewerName != null
								|| $.trim(list[i].reviewerName) == ""
								|| $.trim(list[i].reviewerName).indexOf('\"\"') != -1) {
							tempHtml += '' + list[i].reviewerName + '';
						} else {
							tempHtml += 'Not Available';
						}
						tempHtml += '</span></div>';
						tempHtml += '<div class="reviewerDetail">from <span>';
						if (list[i].reviewLocation == null
								|| list[i].reviewLocation == "") {
							tempHtml += ' Not Available </span></div>';
						} else {
							tempHtml += '' + list[i].reviewLocation + '</span></div>';
						}
						tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
								+ moment(list[i].reviewTime).format("DD MMMM YYYY")
								+ '</span>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						
						
						/*+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Rating Score: <span class="score">'+ list[i].repufactorScore.toFixed(2)+ '%</span> </div>'*/
				tempHtml+='</div>'
						+ '<div class="col-xs-12 col-sm-9 col-lg-10">';
				if (list[i].reviewTitle != null) {
					tempHtml += '<h3 class="SingleReviewHeader">'
							+ list[i].reviewTitle + '</h3>';
				}
				tempHtml += '<p>'+ list[i].highlightedReviewContent+ '</p>';
				// star review rating from Review content site table
				if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
								tempHtml += '<div class="SourceRating col-xs-12">';
								tempHtml += '<span>Source Rating </span><span data-review-rating="'
										+ list[i].reviewOverallRating
										+ '" data-maximum-rating="'
										+ list[i].maxOverallRating
										+ '" class="starsTA">'
										+ list[i].reviewOverallRating
										+ '</span><span style="margin-left:5px; margin-right:35px;">'
										+ list[i].reviewOverallRating
										+ '/'
										+ list[i].maxOverallRating
										+ '</span>'
										+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
										
										/*if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
										}*/
								tempHtml += '</div>';
				}
				else{
						if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
							tempHtml += '<div class="SourceRating col-xs-12">';
							tempHtml += '<span>Source Rating </span><span data-review-rating="'
									+ list[i].reviewOverallRating
									+ '" data-maximum-rating="'
									+ list[i].maxOverallRating
									+ '" class="starsHIQ">'
									+ list[i].reviewOverallRating
									+ '</span><span style="margin-left:5px; margin-right:35px;">'
									+ list[i].reviewOverallRating
									+ '/'
									+ list[i].maxOverallRating
									+ '</span>'
									+ '<span><a target="_blank" href='+list[i].redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
									
									/*if(list[i].respondStatus==true){
										tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
									}else{
										tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
									}*/
							tempHtml += '</div>';
						}else{
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
									+ list[i].maxOverallRating
									+ '</span>';
									
									/*if(list[i].respondStatus==true){
										tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
									}else{
										tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
									}*/
							tempHtml += '</div>';
						}
				}
				tempHtml += '<div id="sourceKPIRating'+list[i].id+'" class="SourceKPIRating col-xs-12">';
				for (var h = 0; h < list[i].kpiIndustryMasterUiList.length; h++) {
					tempHtml += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
						 + list[i].kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
							
							if(list[i].sourceName.toLowerCase()=="tripadvisor" && list[i].fromApi==true){
								tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
							}
							if(list[i].sourceName.toLowerCase()=="holidayiq" && list[i].fromApi==true){
								tempHtml +='<span  style="float:left;" data-review-rating="' + list[i].kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + list[i].kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
							}
							
				   tempHtml +=' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
							+ list[i].kpiIndustryMasterUiList[h].sourceKpiScore
							+ '/'
							+ list[i].kpiIndustryMasterUiList[h].maxRatingValue
							+ '</span></div>';
				}
				tempHtml += '</div>';
				
				/*tempHtml += '<div id="SourceKPIRating'+list[i].id+'" class="SourceKPIRating col-xs-12">';
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
				
				
				if (list[i].keywordList.length > 0) {
					tempHtml += '<div id="keywordAndScoreModal_'
							+ list[i].id
							+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
					for (var h = 0; h < list[i].keywordList.length; h++) {
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="PositiveSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName + '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NeutralSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName + '</span></div>';
								break;
							}
							if (Math.round(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="NegativeSentimentCount"> '
										+ list[i].keywordList[h].nlpQueryName +'</span></div>';
								break;
							}
						}
					}
					tempHtml += '</div>';
				}*/
				
				 tempHtml+='<div class="form-group input-group col-xs-12">'
						
						+'<div class="form-group input-group col-xs-12">'
							+'<input type="email" id="reviewerEmail_'+list[i].id+'" class="form-control input-sm" placeholder="Enter Reviewer Email Address">'
						+'</div>'
					
						+ '<textarea id="respond_'+ list[i].id + '" placeholder="Enter your response here" style="width: 704px; height: 145px;" maxlength="1000" class="form-control input-sm"></textarea>'
							+'<span id="responds_'+ list[i].id + '" style="display:none"></span>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<div id="validationMessageDiv_'
						+ list[i].id
						+ '" ></div>'
						+ '<button id="save_'+list[i].id+'" onclick="respondToReview('+ list[i].id + ','	+ list[i].sourceId + ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button data-dismiss="modal" onclick="resetRespond('	+ list[i].id + ')" id="cancel_'+list[i].id+'" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '<button data-dismiss="modal" id="ok_'+list[i].id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>'
						+ '</div>' + '</div>' + '</div>' + '</div>' + '</div>'
						+ '</div>' + '</div>';
				tempHtml += ' </div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
		}
				tempHtml += '<div id="Note-pills'
						+ list[i].id
						+ '" class="row SubHeading tab-pane fade">'
						+ '<div style="display:none" id="notesForReviewSiteContentId_'
						+ list[i].id
						+ '">'
						+ '</div>'
						+ '<p style="display:none ; color:red" class="has-error" id="errorForReviewSiteContentId_'
						+ list[i].id
						+ '"></p>'
						+ '<div class="col-xs-12">'
						+ '<div class="form-group input-group col-xs-12">'
						+ '<label>Enter your note <span class="mandatoryField">*</span></label>'
						+ '<textarea id="noteForReviewSiteContentId_'
						+ list[i].id
						+ '" class="form-control input-sm" ></textarea>'
						+ '</div>'
						+ '<div class="row ">'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share with a department</label>'
						+ '<div class="">'
						+ '<select id="departmentForReviewSiteContentId_'
						+ list[i].id
						+ '"  class="form-control input-sm">'
						+ '<option data-email="" value="" selected disabled>Select a Department</option>';
				for (var k = 0; k < departmentList.length; k++) {
					tempHtml += '<option data-email="' + departmentList[k].email + '" value="' + departmentList[k].id + '">'
							+ departmentList[k].departmentName + '</option>';
				}
				tempHtml += '</select>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group col-xs-6">'
						+ '<label class="">Share via email</label>'
						+ '<div class="">'
						+ '<input id="emailForReviewSiteContentId_'
						+ list[i].id
						+ '" class="form-control input-sm" placeholder="Enter Email Address">'
						+ '</div>'
						+ '</div>'
						+ '</div>'
						+ '<div class="form-group input-group form-inline col-xs-12">'
						+ '<button id="Save" onclick="saveNote('
						+ list[i].id
						+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
						+ '<button id="Cancel" onclick="closeNote('
						+ list[i].id
						+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+ '</div>' + '</div>' + '</div>';// END of QuickNote
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';// END of On action
				tempHtml += '</div>';
				tempHtml += '</div>';
				tempHtml += '</div>';
			}// End Of for Loop
			$('#page-selection').show();
		} else {
			tempHtml += '<font style="color:red">No Records Found </font>';
			$('#page-selection').hide();
		}
	}
	return tempHtml;
}
var reviewUpdated;
var responseObjectForUpdatedReview;
function overwriteUpdatedReview(reviewId) {
	$
			.ajax({
				type : "POST",
				url : "../reviewSitesContent/fetchReview.htm?reviewId="
						+ reviewId,
				contentType : "application/json",
				success : function(response) {
					if (response.status == "LIST_SUCCESS") {
						reviewUpdated = response.successObject.review;
						responseObjectForUpdatedReview = response;
						if (filteredReviewsDuplicateResponseObject == null) {
							for (var i = 0; i < normalReviewsDuplicateResponseObject.successObject.listAll.length; i++) {
								if (normalReviewsDuplicateResponseObject.successObject.listAll[i].id == reviewId) {
									normalReviewsDuplicateResponseObject.successObject.listAll[i] = reviewUpdated;
									break;
								}
							}
						} else {
							for (var i = 0; i < normalReviewsDuplicateResponseObject.successObject.listAll.length; i++) {
								if (normalReviewsDuplicateResponseObject.successObject.listAll[i].id == reviewId) {
									filteredReviewsDuplicateResponseObject.successObject.listAll[i] = reviewUpdated;
									break;
								}
							}
						}
						var reviewTitle = "";
						var reviewContent = "";
						/*
						 * if (searchedReviewTitle !=null &&
						 * searchedReviewContent !=null) { reviewTitle
						 * =searchedReviewTitle; reviewContent =
						 * searchedReviewContent; } else {
						 */
						reviewTitle = responseObjectForUpdatedReview.successObject.review.reviewTitle;
						reviewContent = responseObjectForUpdatedReview.successObject.review.highlightedReviewContent;
						/* } */
						var reviewedOn = $.datepicker
								.formatDate(
										'd M yy',
										new Date(
												responseObjectForUpdatedReview.successObject.review.reviewTime));
						var tempHtml = '<div data-reviewid="'
								+ responseObjectForUpdatedReview.id
								+ '" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
						for (var p = 0; p < sentimentPolarityList.length; p++) {
							if (Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "positive") {
								tempHtml += '<div class=" ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'
										+ responseObjectForUpdatedReview.successObject.review.repufactorScore
												.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">'
										+ responseObjectForUpdatedReview.successObject.review.repufactorScore
												.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) >= sentimentPolarityList[p].minPercentage
									&& Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) <= sentimentPolarityList[p].maxPercentage
									&& sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'
										+ responseObjectForUpdatedReview.successObject.review.repufactorScore
												.toFixed(2) + '%</span> </div>';
								break;
							}
						}
						tempHtml += '<div class="reviewDetails row">';
						tempHtml += '<div class="reviewSource">'
								+ responseObjectForUpdatedReview.successObject.review.sourceName
								+ '</div>';
						tempHtml += '<div class="reviewerName">by <span>';
						if (responseObjectForUpdatedReview.successObject.review.reviewerName != null
								|| $
										.trim(responseObjectForUpdatedReview.successObject.review.reviewerName) == ""
								|| $
										.trim(
												responseObjectForUpdatedReview.successObject.review.reviewerName)
										.indexOf('\"\"') != -1) {
							tempHtml += ''
									+ responseObjectForUpdatedReview.successObject.review.reviewerName
									+ '';
						} else {
							tempHtml += 'Not Available';
						}
						tempHtml += '</span></div>';
						tempHtml += '<div class="reviewerDetail">from <span>';
						if (responseObjectForUpdatedReview.successObject.review.reviewLocation == null
								|| responseObjectForUpdatedReview.successObject.review.reviewLocation == "") {
							tempHtml += ' Not Available </span></div>';
						} else {
							tempHtml += ''
									+ responseObjectForUpdatedReview.successObject.review.reviewLocation
									+ '</span></div>';
						}
						tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
								+ moment(
										responseObjectForUpdatedReview.successObject.review.reviewTime)
										.format("DD MMMM YYYY") + '</span>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';// Reciew
						// Starts
						// Here
						tempHtml += '<div style="float:right;">';
							tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+ responseObjectForUpdatedReview.successObject.review.id+ ')" /> ';
						tempHtml += '</div>';
						if (reviewTitle != null) {
							tempHtml += '<h3 class="SingleReviewHeader" >'
									+ reviewTitle + '</h3>';
						}
						tempHtml += '<p>' + reviewContent + '</p>';
						// star review rating from Review content site table
						if(responseObjectForUpdatedReview.successObject.review.sourceName.toLowerCase()=="tripadvisor" && responseObjectForUpdatedReview.successObject.review.fromApi==true){
									tempHtml += '<div class="SourceRating col-xs-12">';
									tempHtml += '<span>Source Rating </span><span data-review-rating="'
											+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
											+ '" data-maximum-rating="'
											+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
											+ '" class="starsTA">'
											+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
											+ '</span><span style="margin-left:5px; margin-right:35px;">'
											+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
											+ '/'
											+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
											+ '</span>'
											
											+ '<span><a target="_blank" href='+responseObjectForUpdatedReview.successObject.review.redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
											
											if(responseObjectForUpdatedReview.successObject.review.respondStatus==true){
												tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+responseObjectForUpdatedReview.successObject.review.id+')" href="#">Replied To Review</a></span>';
											}else{
												tempHtml += '<span id="repliedToReview_'+responseObjectForUpdatedReview.successObject.review.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+responseObjectForUpdatedReview.successObject.review.id+')" href="#">Replied To Review</a></span>';
											}
											if(responseObjectForUpdatedReview.successObject.review.markRead==true){
												tempHtml += '<span  id="markReadSpan_'+responseObjectForUpdatedReview.successObject.review.id+'" data-name="'+responseObjectForUpdatedReview.successObject.review.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+responseObjectForUpdatedReview.successObject.review.id+',false)" href="#">Mark as Unread | </a></span>';
											}else{
												tempHtml += '<span  id="markReadSpan_'+responseObjectForUpdatedReview.successObject.review.id+'" data-name="'+responseObjectForUpdatedReview.successObject.review.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+responseObjectForUpdatedReview.successObject.review.id+',true)" href="#">Mark as Read | </a></span>';
											}
									tempHtml += '</div>';
						}
						else{
								if(responseObjectForUpdatedReview.successObject.review.sourceName.toLowerCase()=="holidayiq" && responseObjectForUpdatedReview.successObject.review.fromApi==true){
									tempHtml += '<div class="SourceRating col-xs-12">';
									tempHtml += '<span>Source Rating </span><span data-review-rating="'
											+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
											+ '" data-maximum-rating="'
											+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
											+ '" class="starsHIQ">'
											+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
											+ '</span><span style="margin-left:5px; margin-right:35px;">'
											+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
											+ '/'
											+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
											+ '</span>'
											
											+ '<span><a target="_blank" href='+responseObjectForUpdatedReview.successObject.review.redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
											
											if(responseObjectForUpdatedReview.successObject.review.respondStatus==true){
												tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+responseObjectForUpdatedReview.successObject.review.id+')" href="#">Replied To Review</a></span>';
											}else{
												tempHtml += '<span id="repliedToReview_'+responseObjectForUpdatedReview.successObject.review.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+responseObjectForUpdatedReview.successObject.review.id+')" href="#">Replied To Review</a></span>';
											}
											if(responseObjectForUpdatedReview.successObject.review.markRead==true){
												tempHtml += '<span  id="markReadSpan_'+responseObjectForUpdatedReview.successObject.review.id+'" data-name="'+responseObjectForUpdatedReview.successObject.review.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+responseObjectForUpdatedReview.successObject.review.id+',false)" href="#">Mark as Unread | </a></span>';
											}else{
												tempHtml += '<span  id="markReadSpan_'+responseObjectForUpdatedReview.successObject.review.id+'" data-name="'+responseObjectForUpdatedReview.successObject.review.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+responseObjectForUpdatedReview.successObject.review.id+',true)" href="#">Mark as Read | </a></span>';
											}
									tempHtml += '</div>';
								}else{
										tempHtml += '<div class="SourceRating col-xs-12">';
										tempHtml += '<span>Source Rating </span><span data-review-rating="'
												+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
												+ '" data-maximum-rating="'
												+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
												+ '" class="stars">'
												+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
												+ '</span><span>'
												+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
												+ '/'
												+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
												+ '</span>';
												
												if(responseObjectForUpdatedReview.successObject.review.respondStatus==true){
													tempHtml += '<span style="float:right;color:red;"><a onclick="getResponds('+responseObjectForUpdatedReview.successObject.review.id+')" href="#">Replied To Review</a></span>';
												}else{
													tempHtml += '<span id="repliedToReview_'+responseObjectForUpdatedReview.successObject.review.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+responseObjectForUpdatedReview.successObject.review.id+')" href="#">Replied To Review</a></span>';
												}
												if(responseObjectForUpdatedReview.successObject.review.markRead==true){
													tempHtml += '<span  id="markReadSpan_'+responseObjectForUpdatedReview.successObject.review.id+'" data-name="'+responseObjectForUpdatedReview.successObject.review.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+responseObjectForUpdatedReview.successObject.review.id+',false)" href="#">Mark as Unread | </a></span>';
												}else{
													tempHtml += '<span  id="markReadSpan_'+responseObjectForUpdatedReview.successObject.review.id+'" data-name="'+responseObjectForUpdatedReview.successObject.review.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+responseObjectForUpdatedReview.successObject.review.id+',true)" href="#">Mark as Read | </a></span>';
												}
										tempHtml += '</div>';
								}
						}
						tempHtml += '<div class="SourceKPIRating col-xs-12">';
						for (var h = 0; h < responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList.length; h++) {
							tempHtml += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
									+ responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
									
							if(responseObjectForUpdatedReview.successObject.review.sourceName.toLowerCase()=="tripadvisor" && responseObjectForUpdatedReview.successObject.review.fromApi==true){
								tempHtml +='<span  data-review-rating="' + responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
							}
							if(responseObjectForUpdatedReview.successObject.review.sourceName.toLowerCase()=="holidayiq" && responseObjectForUpdatedReview.successObject.review.fromApi==true){
								tempHtml +='<span  data-review-rating="' + responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
							}
							
						   tempHtml +=' <span style="float:left;margin-left: 5px;margin-right:35px;"> '
									+ responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].sourceKpiScore
									+ '/'
									+ responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].maxRatingValue
									+ '</span></div>';
						}
						tempHtml += '</div>';
						if (responseObjectForUpdatedReview.successObject.review.keywordList.length > 0) {
							tempHtml += '<div id="keywordAndScore_'
									+ responseObjectForUpdatedReview.id
									+ '" class="TradeReviewKpiDepartmentFactor col-xs-12">'
									+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords <span class="keywords fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 8px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span></div>';
							for (var h = 0; h < responseObjectForUpdatedReview.successObject.review.keywordList.length; h++) {
								tempHtml += '<div class="KPIScore col-xs-4"> '
										+ ' <span class="PositiveSentimentCount"> '
										+ responseObjectForUpdatedReview.successObject.review.keywordList[h].nlpQueryName + '</span></div>';
							}
							tempHtml += '</div>';
						}
						tempHtml += '<div class="OnReviewActions col-xs-12">';
						tempHtml += '<div class="panel-body row">';
						tempHtml += '<ul class="nav nav-pills">';
						tempHtml += '<li style="display:none">';
						tempHtml += '<a class="userPrimeAction" onclick="openShare('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" data-toggle="tab" href="#Share-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">';
						tempHtml += '<div id="shareCountSpan'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="ShareReviewIcon">Share('
								+ responseObjectForUpdatedReview.successObject.review.sourceMasterUIList.length
								+ ')</div>';
						tempHtml += '</a>';
						tempHtml += '</li>';
						tempHtml += '<li>';
						if (responseObjectForUpdatedReview.successObject.DEPARTMENTS.length == 0) {
							tempHtml += '<a class="userPrimeAction" data-toggle="tab" onclick="return false;" href="#Note-pills'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '">';
							tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
							tempHtml += '</a>';
						} else {
							tempHtml += '<a class="userPrimeAction" onclick="openNote('
									+ responseObjectForUpdatedReview.successObject.review.id
									+ ','
									+ $('#organizationName option:selected')
											.val()
									+ ')" data-toggle="tab" href="#Note-pills'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '">';
							tempHtml += '<div id="QuickNotesTabInReviews" class="ReviewNoteIcon">Quick Note</div> ';
							tempHtml += '</a>';
						}
						tempHtml += '</li>';
						tempHtml += '<li >';
						if (responseObjectForUpdatedReview.successObject.DEPARTMENTS.length == 0
								|| responseObjectForUpdatedReview.successObject.USERS.length == 0) {
							//tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task" onclick="getComments('+ responseObjectForUpdatedReview.successObject.review.id+ ','+ $('#organizationName option:selected').val()	+ ',this)" onclick="return false;" href="#Action-pills'	+ responseObjectForUpdatedReview.successObject.review.id+ '">';
							tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task" onclick="return false;" href="#Action-pills'	+ responseObjectForUpdatedReview.successObject.review.id+ '">';
							tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
							tempHtml += '</a>';
						} else {
							tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#Action-pills'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '">';
							tempHtml += '<div id="ActionTabInReviews" class="ReviewActionIcon">Action</div>';
							tempHtml += '</a>';
						}
						tempHtml += '</li>';
						tempHtml += '<li class="" style="display:none">';
						tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="openBroadcast('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" href="#Broadcast-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">';
						tempHtml += '<div class="BroadcastIcon">Broadcast</div>';
						tempHtml += '</a>';
						tempHtml += '</li>';
						/********************respond to review1******************************************/
						
						tempHtml += '<li >';
							tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#ReplyToReview-pills'+ responseObjectForUpdatedReview.successObject.review.id+ '">';
								tempHtml += '<div id="ReplyToReviewTabInReviews" class="ReplyToReview">Reply to review</div>';
							tempHtml += '</a>';
						tempHtml += '</li>';
						
						/********************respond to review******************************************/
						
						tempHtml += '</ul>';
						tempHtml += '<div class="tab-content">';
						
						//start reply
						tempHtml += '<div id="ReplyToReview-pills' + responseObjectForUpdatedReview.successObject.review.id+ '" class="SubHeading tab-pane fade">';
							tempHtml += '<div class="panel-body row">';
								tempHtml += '<ul class="nav nav-pills">';
								if(responseObjectForUpdatedReview.successObject.review.sourceBaseUrl){
									tempHtml += '<li class="">';
									if(((list[i].sourceName.toLowerCase()=="tripadvisor" 
										|| list[i].sourceName.toLowerCase()=="booking") 
										&& (list[i].sourceLogin != null && list[i].sourceLogin !='')  
										&&  (list[i].sourcePass != null  && list[i].sourcePass!='') 
										&& (list[i].sourceUrl != null && list[i].sourceUrl != '')) 
										|| (list[i].sourceName.toLowerCase()=="holidayiq" && list[i].reviewId != null && list[i].reviewId != '') )
										tempHtml += '<a  class="filterButton" onclick="showRespondModal('+list[i].id+',\'direct\')" >Direct Respond to Review Source</a>';
									else
										tempHtml += '<a  class="filterButton" id="DirectRespondReviewSource" onclick="respondToDirect('+responseObjectForUpdatedReview.successObject.review.id+')" href="//'+responseObjectForUpdatedReview.successObject.review.sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
									tempHtml += '</li>';
								}
									tempHtml += '<li class="">';
										tempHtml += '<a type="button" class="filterButton" id="DirectRespondReviewer" onclick="showRespondModal('+responseObjectForUpdatedReview.successObject.review.id+',\'reviewer\')" >Direct Respond to Reviewer</a>';
									tempHtml += '</li>';
									tempHtml += '<li class="">';
										tempHtml += '<a id="RespondByMailToReviewSource" onclick="showRespondModal('+responseObjectForUpdatedReview.successObject.review.id+',\'reviewSource\')">Respond by email to Review Source</a>';
									tempHtml += '</li>';
								tempHtml += '</ul>';
									tempHtml += '<div class="tab-content">';
									tempHtml += '</div>';
							tempHtml += '</div>';
						tempHtml += '</div>';
						//end reply
						
						tempHtml += '<div id="Broadcast-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="SubHeading tab-pane fade">';
						tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
						if (responseObjectForUpdatedReview.successObject.review.broadcastStatus == true) {
							tempHtml += '<input type="checkbox" name="broadcastChk'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" id="broadcastChk'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" checked>Tag reviews to hotel website.';
						} else {
							tempHtml += '<input type="checkbox" name="broadcastChk'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" id="broadcastChk'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '"> Tag reviews to hotel website.';
						}
						tempHtml += '<button id="Save" onclick="saveBroadcast('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-primary btn-sm float-right" type="button"> Done</button>';
						tempHtml += '<button onclick="closeBroadcast('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '<div id="Share-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="row SubHeading tab-pane fade">'
								+ '<div class="MediumNormalGreyContent col-xs-2">Share On:</div>'
								+ '<div id="shareDiv'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-group col-xs-10 row">'
								+ '</div>'
								+ '<div class="col-xs-10 col-xs-offset-2 row">'
								+ '<div class="form-group input-group col-xs-12 footerButtons">'
								+ '<button id="Save" onclick="saveShare('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-primary btn-sm" type="button"> Done</button>'
								+ '<button id="Cancel" onclick="closeShare('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-default btn-sm" type="button"> Cancel</button>'
								+ '</div>' + '</div>' + '</div>';// END of
																	// Share
						// END of Share
						
						tempHtml += '<div id="Action-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="SubHeading tab-pane fade">';
						tempHtml += '<div class="panel-body row">';
						tempHtml += '<ul class="nav nav-pills">'
								/*+ '<li class="active">'
								+ '<a data-toggle="tab" href="#Task-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '"  data-actiontype="Task" onclick="getComments('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ','
								+ $('#organizationName option:selected').val()
								+ ',this)" >'
								+ '<span class="glyphicon glyphicon"></span>'
								+ 'Assign a task'
								+ '</a>'
								+ '</li>'*/
								+ '<li class="active">'
								+ '<a data-toggle="tab" href="#Ticket-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" data-actiontype="Ticket" onclick="getComments('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ','
								+ $('#organizationName option:selected').val()
								+ ',this)">'
								+ '<span class="glyphicon glyphicon"> </span>'
								+ 'Raise a ticket'
								+ '</a>'
								+ '</li>'
								/*+ '<li class="">'
								+ '<a data-toggle="tab" href="#Notify-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" data-actiontype="Notify" onclick="getComments('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ','
								+ $('#organizationName option:selected').val()
								+ ',this)">'
								+ '<span class="glyphicon glyphicon"> </span>'
								+ 'Notify'
								+ '</a>'
								+ '</li>'*/
								+ '<li class="">'
								+ '<a data-toggle="tab" style="display: none;" href="#General-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" data-actiontype="General" onclick="getComments('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ','
								+ $('#organizationName option:selected').val()
								+ ',this)">'
								+ '<span class="glyphicon glyphicon"> </span>'
								+ 'General'
								+ '</a>'
								+ '</li>'
							/*	+ '<li class="">'
								+ '<a data-toggle="tab" onclick="showRespondModal('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" href="#Respond-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">'
								+ '<span class="glyphicon glyphicon"> </span>'
								+ 'Respond to reviews'
								+ '</a>'
								+ '</li>'*/
								+ '<li class="">'
								+ '<a data-toggle="tab" onclick="loadFlags('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" href="#Flag-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">'
								+ '<span class="glyphicon glyphicon"> </span>'
								+ 'Flag' + '</a>' + '</li>' + '</ul>';
						tempHtml += '<div class="Actiontitles" style="display:none" id="notesForTask_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">'
								+ '</div>'
								+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">'
								+ '</div>'
								+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">'
								+ '</div>'
								+ '<div class="Actiontitles" style="display:none" id="notesForGeneral_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">' + '</div>';
						
						tempHtml += '<div class="tab-content">';
						tempHtml += '<div id="Flag-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="row  tab-pane ">';
						tempHtml += '<div class="Actiontitles">';
						tempHtml += '<div class="col-xs-12 form-horizontal">';
						tempHtml += '<div id="flagChkDiv_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-group col-xs-10 row">';
						if ('DUPLICATE_REVIEW' in responseObjectForUpdatedReview.successObject.review.flags) {
							tempHtml += '<div class="col-xs-6"><label><input checked value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Duplicate Review</label></div>';
						} else {
							tempHtml += '<div class="col-xs-6"><label><input value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Duplicate Review</label></div>';
						}
						if ('DELETED_REVIEW' in responseObjectForUpdatedReview.successObject.review.flags) {
							tempHtml += '<div class="col-xs-6"><label><input checked value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Review deleted from source</label></div>';
						} else {
							tempHtml += '<div class="col-xs-6"><label><input value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Review deleted from source</label></div>';
						}
						if ('INCORRECT_LANGUAGE' in responseObjectForUpdatedReview.successObject.review.flags) {
							tempHtml += '<div class="col-xs-6"><label><input checked value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Language not correct</label></div>';
						} else {
							tempHtml += '<div class="col-xs-6"><label><input value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Language not correct</label></div>';
						}
						if ('OTHER' in responseObjectForUpdatedReview.successObject.review.flags) {
							tempHtml += '<div class="col-xs-6"><label><input checked value="OTHER" id="OTHER_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Other</label></div>';
						} else {
							tempHtml += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" type="checkbox"> Other</label></div>';
						}
						tempHtml += '</div>';
						tempHtml += '<div class="form-group">';
						/*
						 * tempHtml+='<label class="col-xs-3
						 * control-label">Comment<span class="mandatoryField">*</span></label>';
						 */
						tempHtml += '<div class=" col-xs-12">';
						tempHtml += '<div class="">';
						tempHtml += '<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '<div class="form-group input-group form-inline col-xs-12">';
						tempHtml += '<button onclick="saveFlag('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')"  id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
						tempHtml += '<button onclick="cancelFlag('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')"  id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '<div id="Task-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="row  tab-pane active">';
						tempHtml += '<div class="col-xs-12 form-horizontal">'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
								+ '<div class=" col-xs-9">'
								+ '<div class="">'
								+ '<input id="noteForTask_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
								+ '</div>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-4">'
								+ '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm">'
								+ '<option data-email="" value="" selected disabled>Select a Department</option>';
						for (var k = 0; k < departmentList.length; k++) {
							tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" value="' + departmentList[k].id + '">'
									+ departmentList[k].departmentName
									+ '</option>';
						}
						tempHtml += '</select>' + '</div>'
								+ '<div id="employeeDivForTask_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="col-xs-5">'
								+ '<select id="employeeForTask_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm">'
								+ '<option value="" >Select Employee</option>'
								+ '</select>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-9">'
								+ '<input id="datetimepickerForTask_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group input-group form-inline col-xs-12">'
								+ '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTask('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
								+ '<button id="CancelTask" onclick="closeAction('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
								+ '</div>' + '</div>';
						tempHtml += '</div>';// End Of Task Pill
						tempHtml += '<div id="Ticket-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="row tab-pane">';
						tempHtml += '<div class="col-xs-12 form-horizontal">'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
								+ '<div class=" col-xs-9">'
								+ '<div class="">'
								+ '<input id="noteForTicket_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
								+ '</div>'
								+ '</div>'
								+ '</div>'
								
								+ '<div class="form-group">'
                                 + '<label class="col-xs-3 control-label">Priority<span class="mandatoryField">*</span></label>'
								 + '<div id="ticketPriorityDiv_' + responseObjectForUpdatedReview.successObject.review.id + '" class="col-xs-2">'
								 + '<select id="ticketPriorityOption_'	+ responseObjectForUpdatedReview.successObject.review.id + '" class="form-control input-sm">'
									 + '<option value="High" >High Priority</option>'
									 + '<option value="Medium" >Medium Priority</option>'
									 + '<option value="Low" >Low Priority</option>'
								 + '</select>'
								 + '</div>'
								 + '</div>'
								 
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">For</label>'
								+ '<div class="col-xs-4">'
								+ '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm">'
								+ '<option data-email="" value="" selected disabled>Select a Department</option>';
						for (var k = 0; k < departmentList.length; k++) {
							tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" value="' + departmentList[k].id + '">'
									+ departmentList[k].departmentName
									+ '</option>';
						}
						tempHtml += '</select>' + '</div>'
								+ '<div id="employeeDivForTicket_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="col-xs-3">'
								+ '<select multiple id="employeeForTicket_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm employeeoption">'
								/*+ '<option value="" >Select Employee</option>'*/
								+ '</select>'
								+ '</div>'
								
							
								 
								+ '</div>'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-9">'
								+ '<input id="datetimepickerForTicket_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
								+ '</div>'
								+ '</div>'
								
								+ '<div id="emailForTicketDiv_'	+ responseObjectForUpdatedReview.successObject.review.id + '" class="form-group">'
								+ '<label class="col-xs-3 control-label">Share via email<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-9">'
									+ '<input id="emailForTicket_'	+ responseObjectForUpdatedReview.successObject.review.id + '" class="form-control input-sm" placeholder="Enter Email Address">'
								+ '</div>'
								+ '</div>'
								
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">CC</label>'
								+ '<div class="col-xs-9">'
									+ '<input id="ccEmailsForTicket_'	+ responseObjectForUpdatedReview.successObject.review.id + '" class="form-control input-sm" placeholder="Enter CC Emails with comma seperated">'
								+ '</div>'
								+ '</div>'
								
								+ '<div class="form-group input-group form-inline col-xs-12">'
								+ '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
								+ '<button id="CancelTicket" onclick="cancelRaiseTicket('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
								+ '</div>' + '</div>';
						tempHtml += '</div>';// End Of Ticket Pill
						tempHtml += '<div id="Notify-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="row tab-pane">';
						tempHtml += '<div class="col-xs-12 form-horizontal">'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
								+ '<div class=" col-xs-9">'
								+ '<div class="">'
								+ '<input id="noteForNotify_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
								+ '</div>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-4">'
								+ '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm">'
								+ '<option data-email="" value="" selected disabled>Select a Department</option>';
						for (var k = 0; k < departmentList.length; k++) {
							tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" value="' + departmentList[k].id + '">'
									+ departmentList[k].departmentName
									+ '</option>';
						}
						tempHtml += '</select>' + '</div>'
								+ '<div id="employeeDivForNotify_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="col-xs-5">'
								+ '<select id="employeeForNotify_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm">'
								+ '<option value="" >Select Employee</option>'
								+ '</select>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-9">'
								+ '<input id="datetimepickerForNotify_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group input-group form-inline col-xs-12">'
								+ '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotify('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
								+ '<button id="CancelNotify" onclick="closeAction('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
								+ '</div>' + '</div>';
						tempHtml += '</div>';// End Of Notify Pill
						tempHtml += '<div style="display: none;" id="General-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="row  tab-pane">'
								+ '<div class="col-xs-12 form-horizontal">'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>'
								+ '<div class=" col-xs-9">'
								+ '<div class="">'
								+ '<input id="noteForGeneral_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">'
								+ '</div>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-4">'
								+ '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm">'
								+ '<option data-email="" value="" selected disabled>Select a Department</option>';
						for (var k = 0; k < departmentList.length; k++) {
							tempHtml += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
									+ responseObjectForUpdatedReview.successObject.review.id
									+ '" value="' + departmentList[k].id + '">'
									+ departmentList[k].departmentName
									+ '</option>';
						}
						tempHtml += '</select>' + '</div>'
								+ '<div id="employeeDivForGeneral_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="col-xs-5">'
								+ '<select id="employeeForGeneral_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm">'
								+ '<option value="" >Select Employee</option>'
								+ '</select>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group">'
								+ '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>'
								+ '<div class="col-xs-9">'
								+ '<input id="datetimepickerForGeneral_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group input-group form-inline col-xs-12">'
								+ '<button id="SaveGeneral" data-actiontype="General" onclick="saveNoteForGeneral('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
								+ '<button id="CancelGeneral" onclick="closeAction('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
								+ '</div>' + '</div>';
						tempHtml += '</div>';// End Of General Pill
						$("#respondModal_"+ responseObjectForUpdatedReview.successObject.review.id).remove(); 
				if(!document.getElementById("respondModalLabel_"+ responseObjectForUpdatedReview.successObject.review.id)){	
						tempHtml += ' <div id="Respond-pills'+ responseObjectForUpdatedReview.successObject.review.id + '" class="row Actiontitles tab-pane">';
							tempHtml += '<div id="respondModal_'+ responseObjectForUpdatedReview.successObject.review.id+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
										+ '<div class="modal-dialog modal-lg">'
											+ '<div class="modal-content">'
												+ '<div class="modal-header">'
													+ '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>'
														+ '<h4 id="respondModalLabel_'+ responseObjectForUpdatedReview.successObject.review.id+ '" class="modal-title">Respond by email to Review Source</h4>'
														+ '<h4 id="respondsModalLabel_'+ responseObjectForUpdatedReview.successObject.review.id+ '" style="display:none" class="modal-title">Responds</h4>'
												+ '</div>'
												+ '<div class="modal-body row">'
													+ '<div class="row col-xs-12 SingleReviewList">'
														+ '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
														for (var p = 0; p < sentimentPolarityList.length; p++) {
															if (Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
																tempHtml += '<div class="ratingScoreClass PositiveSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="positivePadding score">'	+ responseObjectForUpdatedReview.successObject.review.repufactorScore.toFixed(2) + '%</span> </div>';
																break;
															}
															if (Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
																tempHtml += '<div class="ratingScoreClass NeutralSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="neutralPadding score">' + responseObjectForUpdatedReview.successObject.review.repufactorScore.toFixed(2) + '%</span> </div>';
																break;
															}
															if (Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(responseObjectForUpdatedReview.successObject.review.repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
																tempHtml += '<div class="ratingScoreClass NegativeSentimentReview row"><div class="arrow-left"></div><span class="ratingScore fa-stack" style="position:relative;font-size: 9px;margin: 0 3px 0 -3px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>Rating Score: <span class="negativePadding score">'	+ responseObjectForUpdatedReview.successObject.review.repufactorScore.toFixed(2) + '%</span> </div>';
																break;
															}
														}
														
														tempHtml += '<div class="reviewDetails row">';
														tempHtml += '<div class="reviewSource">' + responseObjectForUpdatedReview.successObject.review.sourceName
																+ '</div>';
														tempHtml += '<div class="reviewerName">by <span>';
														if (responseObjectForUpdatedReview.successObject.review.reviewerName != null
																|| $.trim(responseObjectForUpdatedReview.successObject.review.reviewerName) == ""
																|| $.trim(responseObjectForUpdatedReview.successObject.review.reviewerName).indexOf('\"\"') != -1) {
															tempHtml += '' + responseObjectForUpdatedReview.successObject.review.reviewerName + '';
														} else {
															tempHtml += 'Not Available';
														}
														tempHtml += '</span></div>';
														tempHtml += '<div class="reviewerDetail">from <span>';
														if (responseObjectForUpdatedReview.successObject.review.reviewLocation == null
																|| responseObjectForUpdatedReview.successObject.review.reviewLocation == "") {
															tempHtml += ' Not Available </span></div>';
														} else {
															tempHtml += '' + responseObjectForUpdatedReview.successObject.review.reviewLocation + '</span></div>';
														}
														tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
																+ moment(responseObjectForUpdatedReview.successObject.review.reviewTime).format("DD MMMM YYYY")
																+ '</span>';
														tempHtml += '</div>';
														tempHtml += '</div>';
														
															/*+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Rating Score: <span class="score">'+ responseObjectForUpdatedReview.successObject.review.repufactorScore.toFixed(2) + '%</span> </div>'*/
															
															tempHtml+='</div>'
															+ '<div class="col-xs-12 col-sm-9 col-lg-10">';
														if (responseObjectForUpdatedReview.successObject.review.reviewTitle != null) {
															tempHtml += '<h3 class="SingleReviewHeader">'
																		+ responseObjectForUpdatedReview.successObject.review.reviewTitle
																	  + '</h3>';
														}
														tempHtml += '<p>'+ responseObjectForUpdatedReview.successObject.review.reviewContent + '</p>';
														
																// star review rating from Review content site table
															if(responseObjectForUpdatedReview.successObject.review.sourceName.toLowerCase()=="tripadvisor" && responseObjectForUpdatedReview.successObject.review.fromApi==true){
																			tempHtml += '<div class="SourceRating col-xs-12">';
																			tempHtml += '<span>Source Rating </span><span data-review-rating="'
																					+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																					+ '" data-maximum-rating="'
																					+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
																					+ '" class="starsTA">'
																					+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																					+ '</span><span style="margin-left:5px; margin-right:35px;">'
																					+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																					+ '/'
																					+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
																					+ '</span>'
																					+ '<span><a target="_blank" href='+responseObjectForUpdatedReview.successObject.review.redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
																					
																					/*if(responseObjectForUpdatedReview.successObject.review.respondStatus==true){
																						tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
																					}else{
																						tempHtml += '<span id="repliedToReview_'+responseObjectForUpdatedReview.successObject.review.id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
																					}*/
																			tempHtml += '</div>';
															}else{
																if(responseObjectForUpdatedReview.successObject.review.sourceName.toLowerCase()=="holidayiq" && responseObjectForUpdatedReview.successObject.review.fromApi==true){
																	tempHtml += '<div class="SourceRating col-xs-12">';
																	tempHtml += '<span>Source Rating </span><span data-review-rating="'
																			+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																			+ '" data-maximum-rating="'
																			+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
																			+ '" class="starsHIQ">'
																			+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																			+ '</span><span style="margin-left:5px; margin-right:35px;">'
																			+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																			+ '/'
																			+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
																			+ '</span>'
																			+ '<span><a target="_blank" href='+responseObjectForUpdatedReview.successObject.review.redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
																			
																			/*if(responseObjectForUpdatedReview.successObject.review.respondStatus==true){
																				tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
																			}else{
																				tempHtml += '<span id="repliedToReview_'+responseObjectForUpdatedReview.successObject.review.id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
																			}*/
																	tempHtml += '</div>';
																}else{
																			tempHtml += '<div class="SourceRating col-xs-12">';
																			tempHtml += '<span>Source Rating </span><span data-review-rating="'
																					+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																					+ '" data-maximum-rating="'
																					+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
																					+ '" class="stars">'
																					+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																					+ '</span><span>'
																					+ responseObjectForUpdatedReview.successObject.review.reviewOverallRating
																					+ '/'
																					+ responseObjectForUpdatedReview.successObject.review.maxOverallRating
																					+ '</span>';
																					
																					/*if(responseObjectForUpdatedReview.successObject.review.respondStatus==true){
																						tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
																					}else{
																						tempHtml += '<span id="repliedToReview_'+responseObjectForUpdatedReview.successObject.review.id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
																					}*/
																			tempHtml += '</div>';
																}
																
															}			
																/*tempHtml += '<div id="sourceKPIRating'+responseObjectForUpdatedReview.successObject.review.id+'" class="SourceKPIRating col-xs-12">';
																for (var h = 0; h < responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList.length; h++) {
																	tempHtml += '<div class="KPIRating col-xs-4">'
																			+ responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].kpiSourceName
																			+ ' <span> '
																			+ responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].sourceKpiScore
																			+ '/'
																			+ responseObjectForUpdatedReview.successObject.review.kpiIndustryMasterUiList[h].maxRatingValue
																			+ '</span></div>';
																}
																tempHtml += '</div>';
																
																
																if (responseObjectForUpdatedReview.successObject.review.keywordList.length > 0) {
																	tempHtml += '<div id="keywordAndScore_'
																			+ responseObjectForUpdatedReview.successObject.review.id
																			+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
																			+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
																	for (var h = 0; h < responseObjectForUpdatedReview.successObject.review.keywordList.length; h++) {
																		for (var p = 0; p < sentimentPolarityList.length; p++) {
																			if (Math.round(responseObjectForUpdatedReview.successObject.review.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(responseObjectForUpdatedReview.successObject.review.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "positive") {
																				tempHtml += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="PositiveSentimentCount"> '
																						+ responseObjectForUpdatedReview.successObject.review.keywordList[h].nlpQueryName + '</span></div>';
																				break;
																			}
																			if (Math.round(responseObjectForUpdatedReview.successObject.review.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(responseObjectForUpdatedReview.successObject.review.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "neutral") {
																				tempHtml += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="NeutralSentimentCount"> '
																						+ responseObjectForUpdatedReview.successObject.review.keywordList[h].nlpQueryName + '</span></div>';
																				break;
																			}
																			if (Math.round(responseObjectForUpdatedReview.successObject.review.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(responseObjectForUpdatedReview.successObject.review.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "negative") {
																				tempHtml += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="NegativeSentimentCount"> '
																						+ responseObjectForUpdatedReview.successObject.review.keywordList[h].nlpQueryName +'</span></div>';
																				break;
																			}
																		}
																	}
																	tempHtml += '</div>';
																}*/
																
													  tempHtml +='<div class="form-group input-group col-xs-12">'
																
																+'<div class="form-group input-group col-xs-12">'
																	+'<input type="email" id="reviewerEmail_'+responseObjectForUpdatedReview.successObject.review.id+'" class="form-control input-sm" placeholder="Enter Reviewer Email Address">'
																+'</div>'
																	+ '<textarea id="respond_'+ responseObjectForUpdatedReview.successObject.review.id	+ '" placeholder="Enter your response here" style="width: 704px; height: 145px;" maxlength="1000" class="form-control input-sm"></textarea>'
																		+'<span id="responds_'+ responseObjectForUpdatedReview.successObject.review.id + '" style="display:none"></span>'
																+ '</div>'
								+ '<div class="form-group input-group form-inline col-xs-12">'
								+ '<div id="validationMessageDiv_'+ responseObjectForUpdatedReview.successObject.review.id+ '" ></div>'
								+ '<button id="save_'+responseObjectForUpdatedReview.successObject.review.id+'" onclick="respondToReview('	+ responseObjectForUpdatedReview.successObject.review.id+ ','+ responseObjectForUpdatedReview.successObject.review.sourceId	+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
								+ '<button data-dismiss="modal" onclick="resetRespond('	+ responseObjectForUpdatedReview.successObject.review.id+ ')" id="cancel_'+responseObjectForUpdatedReview.successObject.review.id+'" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
								+ '<button data-dismiss="modal" id="ok_'+responseObjectForUpdatedReview.successObject.review.id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>'
								+ '</div>' + '</div>' + '</div>' + '</div>'
								+ '</div>' + '</div>' + '</div>';
						tempHtml += ' </div>';
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '</div>';
				}
						tempHtml += '<div id="Note-pills'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="row SubHeading tab-pane fade">'
								+ '<div style="display:none" id="notesForReviewSiteContentId_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '">'
								+ '</div>'
								+ '<p style="display:none ; color:red" class="has-error" id="errorForReviewSiteContentId_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '"></p>'
								+ '<div class="col-xs-12">'
								+ '<div class="form-group input-group col-xs-12">'
								+ '<label>Enter your note <span class="mandatoryField">*</span></label>'
								+ '<textarea id="noteForReviewSiteContentId_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm" ></textarea>'
								+ '</div>'
								+ '<div class="row ">'
								+ '<div class="form-group col-xs-6">'
								+ '<label class="">Share with a department</label>'
								+ '<div class="">'
								+ '<select id="departmentForReviewSiteContentId_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '"  class="form-control input-sm">'
								+ '<option data-email="" value="" selected disabled>Select a Department</option>';
						for (var k = 0; k < departmentList.length; k++) {
							tempHtml += '<option data-email="' + departmentList[k].email + '" value="'
									+ departmentList[k].id + '">'
									+ departmentList[k].departmentName
									+ '</option>';
						}
						tempHtml += '</select>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group col-xs-6">'
								+ '<label class="">Share via email</label>'
								+ '<div class="">'
								+ '<input id="emailForReviewSiteContentId_'
								+ responseObjectForUpdatedReview.successObject.review.id
								+ '" class="form-control input-sm" placeholder="Enter Email Address">'
								+ '</div>'
								+ '</div>'
								+ '</div>'
								+ '<div class="form-group input-group form-inline col-xs-12">'
								+ '<button id="Save" onclick="saveNote('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
								+ '<button id="Cancel" onclick="closeNote('
								+ responseObjectForUpdatedReview.successObject.review.id
								+ ')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
								+ '</div>' + '</div>' + '</div>';// END of
																	// QuickNote
						tempHtml += '</div>';
						tempHtml += '</div>';
						tempHtml += '</div>';// END of On action
						
						
						tempHtml += '</div>';
						$('#reviewContentDiv_' + reviewId).html(tempHtml);
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
									 * $(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');
									 */
									var keywordDivId = "keywordAndScore_"
											+ $(this).data('reviewid');
									/*console.log(keywordDivId + " 12");*/
									if ($("#" + keywordDivId).hasClass(
											"OnSeleceActive")) {
										$("#" + keywordDivId).removeClass(
												"OnSeleceActive");
									} else {
										$("#" + keywordDivId).addClass(
												"OnSeleceActive");
									}
									/*
									 * $(keywordDivId).show();
									 * console.log(keywordDivId+" 12");
									 */
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
$('#searchDates').on('click', function() {
	$("#languageOption").multiselect("uncheckAll");
	
	$('#selectedFiltersDiv').find('span').remove();
	var fromDate = $('#altFromDate').val();
	var toDate = $('#altToDate').val();
	if (fromDate > toDate) {
		alert("Invalid Date Range");
		return false;
	} else {
		filter(pageNo);
	}
	return false;
});

function showOriginalReview(reviewId){
	$('#originalReview_'+reviewId).toggle(200);
}
function redirectUrl(url){
	if(url!=null && url!=""){
		window.open(url);
	}else{
		$('#broadcastSuccessModalTitle').text("Error");
		$('#broadcastSuccessModalText').text("URL not found , please contact admin !");
		$('#broadcastSuccessModal').modal('show');
	}

}
function clearFliter(){
	$('#filterChkBoxes input:checked').each(function() {
		$(this).attr('checked', false).triggerHandler('click');
	});
	/*$('#filterBar span').each(function() {
		$(this).remove();
	});*/
	$('#filterBar').find('span').remove();
    filter(1);
}

