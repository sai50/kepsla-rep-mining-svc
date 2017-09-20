var sessionSelectedOrganizationId=0;
var actionWithReviewDetailResponse;
var sentimentPolarityList;
var departmentList = [];
var noteList = [];
$(document).ready(function() {
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
	   poplateOrganizations(function(selectedOrgId) {
		   getSentimentPolarityList();
		   listDepartment(selectedOrgId);
		   getUserReviewActions(selectedOrgId);
	   });
	   });
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	   getSentimentPolarityList();
	   listDepartment(organizationId);
	   getUserReviewActions(organizationId);
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



function getUserReviewActions(selectedOrgId){
	loadingForDashBoard();
	$('#reviewActionsBredcrumb').show();
	 $.ajax({
			type:"GET",
			url:"../notifications/getReachedDeadLineReviewActions.htm?organizationId="+selectedOrgId,
			contentType:"application/json",
			success:function(response){
				unloadingForDashBoard();
				if(response.length>0){
					actionWithReviewDetailResponse = response;
					var noOfPages = 0;
					if(response.length%5  == 0 && response.length >0){
						noOfPages = response.length/5;
					}else{
						noOfPages = (response.length/5)+1;
					}
					var begin = 0;
					var end = 5;
					var length = response.length;
					if(end > length){
			    		end = length;
			    	}
			    	
				    $('#reviewActionReachedDeadlineDiv').bootpag({
				        total: noOfPages,
				        page: 1,
				        maxVisible: 5
				    }).on("page", function(event, /* page number here */ num){
				    	begin = ((num-1)*5);
				    	end=(num)*5;
				    	if(end > response.legth){
				    		end = response.length;
				    	}
				    	getReviewsPerPage(begin, end);
				    });
				    getReviewsPerPage(begin, end);
				
				}else{
					$("#reviewActionReachedDeadlineDiv").html(" ");
					$("#userReviewActions").html("<h4><font color='red'>No New Reviews Found!!</font></h4>").show();
				}
			},error:function(response){
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
	    var response = [];
	    for(var i=begin;i<end;i++){
		response.push(actionWithReviewDetailResponse[i]);
	    }
					$('#userReviewActions').html('');
					for(var i=0;i<response.length;i++){
						if(response[i]!=undefined){
					var reviewDetailForAction = response[i].review;
					var tempHtml = "";
					tempHtml +='<div class="row col-xs-12 SingleReviewList">';
					tempHtml +='<div data-reviewid="'+reviewDetailForAction.id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
					console.log(reviewDetailForAction);
					for (var p = 0; p < sentimentPolarityList.length; p++) {
						if (parseInt(reviewDetailForAction.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewDetailForAction.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "positive") {
							tempHtml += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewDetailForAction.repufactorScore.toFixed(1)
									+ '%</span> </div>';
							break;
						}
						if (parseInt(reviewDetailForAction.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewDetailForAction.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "neutral") {
							tempHtml += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewDetailForAction.repufactorScore.toFixed(1)
									+ '%</span> </div>';
							break;
						}
						if (parseInt(reviewDetailForAction.repufactorScore) >= sentimentPolarityList[p].minPercentage
								&& parseInt(reviewDetailForAction.repufactorScore) <= sentimentPolarityList[p].maxPercentage
								&& sentimentPolarityList[p].sentimentName == "negative") {
							tempHtml += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
									+ reviewDetailForAction.repufactorScore.toFixed(1)
									+ '%</span> </div>';
							break;
						}
					}
					tempHtml += '<div class="reviewDetails row">';
					tempHtml += '<div class="reviewSource">' + reviewDetailForAction.sourceName + '</div>';
					tempHtml += '<div class="reviewerName">by <span>';
						if(reviewDetailForAction.reviewerName!=null || $.trim(reviewDetailForAction.reviewerName)=="" || $.trim(reviewDetailForAction.reviewerName).indexOf('\"\"')!=-1){
							tempHtml+= ''+reviewDetailForAction.reviewerName + '';
						}else{
							tempHtml+='Not Available';
						}
					tempHtml+='</span></div>';
							
					tempHtml += '<div class="reviewerDetail">from <span>';
					
					if(reviewDetailForAction.reviewLocation==null || reviewDetailForAction.reviewLocation==""){	
						tempHtml += ' Not Available </span></div>';
					}
					else{
						tempHtml += ''+reviewDetailForAction.reviewLocation + '</span></div>';
					}
							
					tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
							+ moment(reviewDetailForAction.reviewTime).format("DD MMMM YYYY")
							+ '</span>';
					tempHtml += '</div>';
					tempHtml += '</div>';//end review details
					tempHtml += '</div>';//end ShowSemanticPolarity  
					tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';																
					tempHtml+='<div style="float:right;">';
					tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetail('+ reviewDetailForAction.id + ')" /> ';
					tempHtml+='</div>';
					tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';	
						if (reviewDetailForAction.reviewTitle != null) {
							tempHtml += '<h3 class="SingleReviewHeader" >'
									+ reviewDetailForAction.reviewTitle + '</h3>';
						}
						tempHtml += '<p>' + reviewDetailForAction.highlightedReviewContent + '</p>';
						
						if(reviewDetailForAction.keywordList.length>0){
							tempHtml += '<div id="keywordAndScore_'+reviewDetailForAction.id+'" class="TradeReviewKpiDepartmentFactor col-xs-12">'
									+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
							for (var h = 0; h < reviewDetailForAction.keywordList.length; h++) {
								for (var p = 0; p < sentimentPolarityList.length; p++) {
									if (parseInt(reviewDetailForAction.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
											&& parseInt(reviewDetailForAction.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
											&& sentimentPolarityList[p].sentimentName == "positive") {
										tempHtml +='<div class="KPIScore col-xs-4">  <span class="PositiveSentimentCount"> '+reviewDetailForAction.keywordList[h].nlpQueryName+'</span></div>';
										break;
									}
									if (parseInt(reviewDetailForAction.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
											&& parseInt(reviewDetailForAction.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
											&& sentimentPolarityList[p].sentimentName == "neutral") {
										tempHtml +='<div class="KPIScore col-xs-4"> <span class="NeutralSentimentCount"> '+reviewDetailForAction.keywordList[h].nlpQueryName+' </span></div>';
										break;
									}
									if (parseInt(reviewDetailForAction.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
											&& parseInt(reviewDetailForAction.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
											&& sentimentPolarityList[p].sentimentName == "negative") {
										tempHtml +='<div class="KPIScore col-xs-4">  <span class="NegativeSentimentCount">'+reviewDetailForAction.keywordList[h].nlpQueryName+'</span></div>';
										break;
									}
								}
							}
							tempHtml +='</div>';
						}

						tempHtml +='<div class="SubHeading col-xs-12">';
							tempHtml +='<div class="row SubHeading ActionReports ReviewActionIcon" style="border:none;">';
								tempHtml +='<div class="col-xs-5 SmallBoldGreyContent">Task</div>';
								tempHtml +='<div class="col-xs-7 text-right SmallDarkGreyHeader">Completion by <span class="SmallRedHeader">';
										tempHtml +='<span class="glyphicon glyphicon-bell"></span>'+response[i].completionDate+'</span>';
								tempHtml += '</div>';
								tempHtml +='<div class="col-xs-12">'+response[i].actionType+'</div>';
								tempHtml +='<div class="col-xs-12 SmallDarkGreyHeader">by <span class="VerySmallBoldGreyContent marginRight20">'+response[i].commentedBy+' </span>';
										tempHtml +='<span>For <span class="VerySmallBoldGreyContent">'+response[i].commentedFor+' </span>at <span class="VerySmallBoldGreyContent">'+response[i].departmentName+'</span>';
								tempHtml +='</span></div>';
								tempHtml +='<div class="col-xs-12">';
									tempHtml +='<div class="revieweTime"><span class="glyphicon glyphicon-time">'+response[i].createdDate+'</span>';
								tempHtml +='</div>'; 
							tempHtml +='</div>'; //END ActionReports
						tempHtml +='</div>'; //END SubHeading col-xs-12
					tempHtml +='</div>'; //END col-xs-12 col-sm-9 col-lg-10
					tempHtml += '</div>';
					tempHtml +='</div>';
					$('#userReviewActions').append(tempHtml).show();
					
					}}
				$('.ShowSemanticPolarity').click(function() {
						var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
						console.log(keywordDivId+" 333");
					    if($("#"+keywordDivId).hasClass("OnSeleceActive")){
					             $("#"+keywordDivId).removeClass("OnSeleceActive");
					    }else{
					           $("#"+keywordDivId).addClass("OnSeleceActive");
					    }
				   });
				  }
			


function fetchReviewDetailsForAction(reviewId,revieDetailCallback){
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				var reviewDetailForAction=response.successObject.review;
				revieDetailCallback(reviewDetailForAction);
			}
		}
	});
}


function getRepufactorScoreForReview(reviewId,revieDetailCallback){
	var organizationId =$('#organizationName option:selected').val();
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId+"&&organizationId="+organizationId,
		contentType : "application/json",
		success : function(response) {
			revieDetailCallback(response);
		}
	});
}



//////view Details
var reviewForViewDetail;
var restoreHotelReviewsDivIdHtml = '';
/*function viewDetail(reviewId) {
	 $('#reviewActionReachedDeadlineDiv').hide();
	$('#reviewActionsBredcrumb').html(" ");
	var actionDetails = '';
	for(var i=0;i<actionWithReviewDetailResponse.length;i++){
		if(actionWithReviewDetailResponse[i].review.id==reviewId){
			actionDetails = actionWithReviewDetailResponse[i];
		}
	}
	$('#reviewsBredcrumb').html(" ");
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				reviewForViewDetail=response.successObject.review;
				console.log(reviewForViewDetail);
				   var htmlCode = "";
					htmlCode += '<div>';
					htmlCode += '<div class="col-xs-12 SingleReviewList" style="border:none;">';
					htmlCode += '<div data-reviewid="'+reviewForViewDetail.id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';

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
					htmlCode += '<div class="reviewerName">by <span>';
						if(reviewForViewDetail.reviewerName!=null || $.trim(reviewForViewDetail.reviewerName)=="" || $.trim(reviewForViewDetail.reviewerName).indexOf('\"\"')!=-1){
							htmlCode+= ''+reviewForViewDetail.reviewerName + '';
						}else{
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
					
					htmlCode += '<div class="row SourceRating col-xs-12">';
					htmlCode += '<span>Source Rating </span><span data-review-rating="'
							+ reviewForViewDetail.reviewOverallRating + '" data-maximum-rating="'
							+ reviewForViewDetail.maxOverallRating + '" class="stars">'
							+ reviewForViewDetail.reviewOverallRating + '</span><span>'
							+ reviewForViewDetail.reviewOverallRating + '/' + reviewForViewDetail.maxOverallRating
							+ '</span>';
					htmlCode += '</div>';
					//actions
					htmlCode +='<div class="SubHeading col-xs-12">';
					htmlCode +='<div class="row ActionReports ReviewActionIcon" style="border:none;">';
					htmlCode +='<div class="col-xs-5 SmallBoldGreyContent">Task</div>';
					htmlCode +='<div class="col-xs-7 text-right SmallDarkGreyHeader">Completion by <span class="SmallRedHeader">';console.log(actionDetails);
					htmlCode +='<span class="glyphicon glyphicon-bell"></span>'+actionDetails.completionDate+'</span>';
					htmlCode += '</div>';
					htmlCode +='<div class="col-xs-12">'+actionDetails.actionType+'</div>';
					htmlCode +='<div class="col-xs-12 SmallDarkGreyHeader">by <span class="VerySmallBoldGreyContent marginRight20">'+actionDetails.commentedBy+' </span>';
					htmlCode +='<span>For <span class="VerySmallBoldGreyContent">'+actionDetails.commentedFor+' </span>at <span class="VerySmallBoldGreyContent">'+actionDetails.departmentName+'</span>';
					htmlCode +='</span></div>';
					htmlCode +='<div class="col-xs-12">';
					htmlCode +='<div class="revieweTime"><span class="glyphicon glyphicon-time">'+actionDetails.createdDate+'</span>';
					htmlCode +='</div>'; 
					htmlCode +='</div>'; //END ActionReports
					htmlCode +='</div>'; //END SubHeading col-xs-12
					
					htmlCode += '<div class="row SourceKPIRating col-xs-12">';
					for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
						htmlCode += '<div class="KPIRating col-xs-4">'
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName + ' <span> '
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore + '/'
								+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
								+ '</span></div>';
					}

					htmlCode += '</div>';
					htmlCode += '</div>';
					
					if(reviewForViewDetail.keywordList.length>0){
						htmlCode += '<div class="TradeReviewKpiDepartmentFactor col-xs-12 " style="display:block;">'
							+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
							
						for (var h = 0; h < reviewForViewDetail.keywordList.length; h++) {
							for (var p = 0; p < sentimentPolarityList.length; p++) {
								if (parseInt(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
										&& parseInt(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "positive") {
									htmlCode +='<div class="KPIScore col-xs-4">  <span class="PositiveSentimentCount">'+reviewForViewDetail.keywordList[h].nlpQueryName+'</span></div>';
									break;
								}
								if (parseInt(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
										&& parseInt(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "neutral") {
									htmlCode +='<div class="KPIScore col-xs-4">  <span class="NeutralSentimentCount"> '+reviewForViewDetail.keywordList[h].nlpQueryName+'</span></div>';
									break;
								}
								if (parseInt(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
										&& parseInt(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "negative") {
									htmlCode +='<div class="KPIScore col-xs-4"> <span class="NegativeSentimentCount"> '+reviewForViewDetail.keywordList[h].nlpQueryName+' </span></div>';
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
					htmlCode += '<button id="Save" onclick="saveShares(' + reviewForViewDetail.id	+ ')" class="btn btn-primary btn-sm" type="button"> Save</button>';
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
							+ '" class="form-control input-sm" ></textarea>';
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
							htmlCode+='<button onclick="saveFlag(' + reviewForViewDetail.id + ')" id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
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
					htmlCode += '<button id="Cancel" onclick="closeAction('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
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
					htmlCode += '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
							+ reviewForViewDetail.id
							+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" onclick="closeAction('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
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
					htmlCode += '<button id="Cancel" onclick="closeAction('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
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
					htmlCode += '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_' + reviewForViewDetail.id + '" class="form-control input-sm">';
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
					htmlCode += '<button id="Cancel" onclick="closeAction('+reviewForViewDetail.id+')" class="btn btn-default btn-sm float-right" type="button"> Clear</button>';
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
					htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
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
					htmlCode += '<button id="Save"  onclick="respondToReview('+reviewForViewDetail.id+','+reviewForViewDetail.sourceId+')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
					htmlCode += '<button id="Cancel" data-dismiss="modal" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';
					htmlCode += '</div>';

					restoreHotelReviewsDivIdHtml = $('#userReviewActions').html();
					restoreFilterBarHtml = $('#filterBar').html();
					

					$('#userReviewActions').html(htmlCode);
					
					
					var barHtmlCode = '<div class="row">'
							+ '<div class="col-lg-12 SubHeading SmallDarkGreyHeader"><span> <a href="../notifications/showNotifications.htm">Notifications</a></span>'
							+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
							+ '<span> <a onclick="restores()">ReviewActions </a></span>'
							+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
							+ '<span>Review Action</span>' + '</div>' + '</div>';

					$('#filterBar').html(barHtmlCode);
					$('#userReviewActions').prepend(barHtmlCode);
					$('#userReviewActions').show(600);

					getMappedSourcesForReview(reviewForViewDetail.id);
					var organizationId = $('#organizationName option:selected').val();
					getNote(reviewForViewDetail.id, organizationId);
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
		}
	});
}*/
function viewDetail(reviewId) {
	 $('#reviewActionReachedDeadlineDiv').hide();
	$('#reviewActionsBredcrumb').html(" ");
	var actionDetails = '';
	for(var i=0;i<actionWithReviewDetailResponse.length;i++){
		if(actionWithReviewDetailResponse[i].review.id==reviewId){
			actionDetails = actionWithReviewDetailResponse[i];
		}
	}
	$('#reviewsBredcrumb').html(" ");
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
							
							
							//actions
							htmlCode +='<div class="SubHeading col-xs-12">';
							htmlCode +='<div class="row ActionReports ReviewActionIcon" style="border:none;">';
							htmlCode +='<div class="col-xs-5 SmallBoldGreyContent">Task</div>';
							htmlCode +='<div class="col-xs-7 text-right SmallDarkGreyHeader">Completion by <span class="SmallRedHeader">';console.log(actionDetails);
							htmlCode +='<span class="glyphicon glyphicon-bell"></span>'+actionDetails.completionDate+'</span>';
							htmlCode += '</div>';
							htmlCode +='<div class="col-xs-12">'+actionDetails.actionType+'</div>';
							htmlCode +='<div class="col-xs-12 SmallDarkGreyHeader">by <span class="VerySmallBoldGreyContent marginRight20">'+actionDetails.commentedBy+' </span>';
							htmlCode +='<span>For <span class="VerySmallBoldGreyContent">'+actionDetails.commentedFor+' </span>at <span class="VerySmallBoldGreyContent">'+actionDetails.departmentName+'</span>';
							htmlCode +='</span></div>';
							htmlCode +='<div class="col-xs-12">';
							htmlCode +='<div class="revieweTime"><span class="glyphicon glyphicon-time">'+actionDetails.createdDate+'</span>';
							htmlCode +='</div>'; 
							htmlCode +='</div>'; //END ActionReports
							htmlCode +='</div>'; //END SubHeading col-xs-12
							
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
														htmlCode += '<a  class="filterButton" onclick="respondToDirect('+reviewForViewDetail.id+')" href="http://'+reviewForViewDetail.sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
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

					restoreHotelReviewsDivIdHtml = $('#userReviewActions').html();
					restoreFilterBarHtml = $('#filterBar').html();
					

					$('#userReviewActions').html(htmlCode);
					
					
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
							+ '<div class="col-lg-12 SubHeading SmallDarkGreyHeader"><span> <a href="../notifications/showNotifications.htm">Notifications</a></span>'
							+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
							+ '<span> <a onclick="restores()">ReviewActions </a></span>'
							+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
							+ '<span>Review Action</span>' + '</div>' + '</div>';

					$('#filterBar').html(barHtmlCode);
					$('#userReviewActions').prepend(barHtmlCode);
					$('#userReviewActions').show(600);

					getMappedSourcesForReview(reviewForViewDetail.id);
					var organizationId = $('#organizationName option:selected').val();
					getNote(reviewForViewDetail.id, organizationId);
					// function for star
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


function getMappedSourcesForOrganization(reviewId, mappedSourceList) {
	var orgId = $('#organizationName option:selected').val();
	$.ajax({
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
					alert("Respond successfully has been mailed !");
					$('#respond').val('');
				}else{
					if (response.status == "SAVE_ERROR") {
						alert(response.errorMessage);
					}
				}
			},
			error : function(response) {
				alert("something went wrong");
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
				saveFlag
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
function restores() {
	$("#searchBar").show();
	$('#filterBar').html(restoreFilterBarHtml);
	$('#userReviewActions').hide();
	$('#userReviewActions').html(restoreHotelReviewsDivIdHtml);
	$("#notificationsBredcrumb").remove();
	$("#reviewActionReachedDeadlineDiv").show();
	var barHtmlCode = '<div class="row" id="notificationsBredcrumb">'
		+ '<div class="col-lg-12 SubHeading SmallDarkGreyHeader"><span> <a href="../notifications/showNotifications.htm">Notifications</a></span>'
		+ ' <span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span><span>Review Actions</span></div>' + '</div>';
	$('#reviewActionsBredcrumb').hide();
	$('#userReviewActions').prepend(barHtmlCode).show();
	$('#userReviewActions').show();

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
		console.log(keywordDivId+" 333");
	    if($("#"+keywordDivId).hasClass("OnSeleceActive")){
	             $("#"+keywordDivId).removeClass("OnSeleceActive");
	    }else{
	           $("#"+keywordDivId).addClass("OnSeleceActive");
	    }
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
	getNote(reviewId,organizationId);
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
					alert("Respond successfully has been mailed !");
					$('#respond').val('');
				}else{
					if (response.status == "SAVE_ERROR") {
						alert(response.errorMessage);
					}
				}
			},
			error : function(response) {
				alert("something went wrong");
			}
		});
	}
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
									+ moment(commentsList[i].completionDate).format("ddd, DD MMM YYYY h:mm:ss a")
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
									+moment(commentsList[i].completionDate).format("ddd, DD MMM YYYY h:mm:ss a")
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
									+ moment(commentsList[i].completionDate).format("ddd, DD MMM YYYY h:mm:ss a")
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
									+ moment(commentsList[i].completionDate).format("ddd, DD MMM YYYY h:mm:ss a")
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
					alert(userList.length);
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

function saveShares(reviewId) {
	
	var reviewContent = null;
	
	for (var i = 0; i < actionWithReviewDetailResponse.length; i++) {
		if (actionWithReviewDetailResponse[i].id == reviewId) {
			reviewContent = actionWithReviewDetailResponse[i].highlightedReviewContent;
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
				$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Success");
				$('#notificationReachedDeadlineReviewsSuccessModalText').text("Posted Successfully!");
				$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
				document.getElementById("shareCountSpan" + reviewId).innerHTML = 'Share'
					+ '(' + reviewSourceMapping.length + ')';
			}else{
				if(response.status == "SAVE_ERROR"){
					$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Error");
					$('#notificationReachedDeadlineReviewsSuccessModalText').text("Some thing went wrong please contact admin!");
					$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
				}
			}
		},
		error : function(response) {
			$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Error");
			$('#notificationReachedDeadlineReviewsSuccessModalText').text("Some thing went wrong please contact admin!");
			$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
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
		success : function(response) {
			if (response.status == "SAVE_SUCCESS") {
				$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Success");
				$('#notificationReachedDeadlineReviewsSuccessModalText').text("Broadcast set Successfully!");
				$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
			}else{
				$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Success");
				$('#notificationReachedDeadlineReviewsSuccessModalText').text("Broadcast set Successfully!");
				$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
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
function getNote(reviewSiteContentId, organizationId) {console.log(reviewSiteContentId, organizationId);
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
				success : function(response) {console.log(response);
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

function saveNoteForTasks(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForTask_" + reviewId).val());
	var departmentOptionValue = $("#departmentForTask_" + reviewId).val();
	var employeeOptionValue = $("#employeeForTask_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForTask_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Alert");
		$('#notificationReachedDeadlineReviewsSuccessModalText').text("Mandatory fileds(*) are required !");
		$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
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
			$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Error");
			$('#notificationReachedDeadlineReviewsSuccessModalText').text("Something went wrong , please contact admin !");
			$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
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
		$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Alert");
		$('#notificationReachedDeadlineReviewsSuccessModalText').text("Mandatory fileds(*) are required !");
		$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
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
			$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Error");
			$('#notificationReachedDeadlineReviewsSuccessModalText').text("Something went wrong , please contact admin !");
			$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
		}
	});
}*/

function saveNoteForNotifys(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForNotify_" + reviewId).val());
	var departmentOptionValue = $("#departmentForNotify_" + reviewId).val();
	var employeeOptionValue = $("#employeeForNotify_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForNotify_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Alert");
		$('#notificationReachedDeadlineReviewsSuccessModalText').text("Mandatory fileds(*) are required !");
		$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
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
			$('#notificationReachedDeadlineReviewsSuccessModalTitle').text("Error");
			$('#notificationReachedDeadlineReviewsSuccessModalText').text("Something went wrong , please contact admin !");
			$('#notificationReachedDeadlineReviewsSuccessModal').modal('show');
		}
	});
}

