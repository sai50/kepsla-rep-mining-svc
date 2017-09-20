var keywordMasterList;
/*var keywordsList;*/
var sessionSelectedOrganizationId=0;
var sessionFromDate = null;
var sessionToDate = null;
var runOnce=false;
/* for search purpose */
var sentimentPolarityList = [];

var filteredReviewsDuplicateResponseObject;
var normalReviewsDuplicateResponseObject;
var sortedReviewsDuplicateResponseObject;
var searchedReviewTitle = null;
var searchedHighlightedReviewContent = null;
var qcPolarityList=[];
var departmentTypesForOrganization=[];
var reviewIds = [];
var departmentFlag = "DEPARTMENT";
var kpiFlag = "KPI";
var mentionCategoryFlag = "MENTIONCATEGORY";
var mentionFlag = "MENTION";
var flagForDepartment = convertToString("Department");
var flagForKpi = convertToString("Kpi");
var flagForMentionCategory = convertToString("MentionCategory");
var flagForMention = convertToString("Mention");
function poplateOrganizations(){
		$.ajax({
			type:"GET",
			url:"../qualityControl/getClientOrganizations.htm",
			contentType:"application/json",
			success:function(response){
			if(response.length==0){
				$('#organizationName').append('<option>No Organization Mapped</option>');
				return false;
			}else{
			    // Get select
			    var select = document.getElementById('organizationName');
				$(select).empty();
				if(sessionSelectedOrganizationId!=0){
					 // Add options
					for (var i in response) {
						if(response[i].id==sessionSelectedOrganizationId){
							$(select).append('<option data-client-id=' + response[i].clientId + ' value=' + response[i].id + ' selected="selected">' + response[i].organizationFullName + '</option>');
						}else{
							$(select).append('<option data-client-id=' + response[i].clientId + ' value=' + response[i].id + '>' + response[i].organizationFullName + '</option>');
						}
					}
				}else{
					for (var i in response) {
						if(i==0){
							$(select).append('<option data-client-id=' + response[i].clientId + ' value=' + response[i].id + ' selected="selected">' + response[i].organizationFullName + '</option>');
						}else{
							$(select).append('<option data-client-id=' + response[i].clientId + ' value=' + response[i].id + '>' + response[i].organizationFullName + '</option>');
						}
					}
				}
				if(runOnce==false){
					getSessionData();
					runOnce=true;
				}
				getCompetitors();
				
			}}
		});
}

function getSessionData(){
	if(runOnce==false){
		 $.ajax({
				type:"GET",
				url:"../adminDashboard/getSessionDataMap.htm",
				contentType:"application/json",
				success:function(response){
					if (response.status == "SUCCESS") {
						var fromDateStr = response.successObject.dateRange.fromDate;
						var toDateStr = response.successObject.dateRange.toDate;
	
						sessionFromDate = new Date(fromDateStr);
						sessionToDate = new Date(toDateStr);
	
						sessionSelectedOrganizationId = response.successObject.organizationId;
	
					} else {
						$("#from").datepicker({
							maxDate : '0',
							defaultDate : '-1y',
							dateFormat : 'd M yy',
							altField : "#altFromDate",
							altFormat : "yy-mm-dd",
						});
						$("#to").datepicker({
							maxDate : '0',
							dateFormat : 'd M yy',
							altField : "#altToDate",
							altFormat : "yy-mm-dd",
						});
					}
	
					if (sessionSelectedOrganizationId != 0) {
						$("#from").datepicker({
							maxDate : '0',
							defaultDate : '-1y',
							dateFormat : 'd M yy',
							altField : "#altFromDate",
							altFormat : "yy-mm-dd",
						});
						$("#to").datepicker({
							maxDate : '0',
							dateFormat : 'd M yy',
							altField : "#altToDate",
							altFormat : "yy-mm-dd",
						});
						$('[name=organizationName]').val(sessionSelectedOrganizationId);
						$("#from").datepicker("setDate",sessionFromDate);
						$("#to").datepicker("setDate",sessionToDate);
	
					}
				},error:function(response){
					alert("error");	
				}
		});
		runOnce=true;
	}
}

$( document ).ready(function() {
	
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
			type:"GET",
			url:"../qualityControl/getQcPolarity.htm",
			contentType:"application/json",
			success:function(response){
				qcPolarityList=response.successObject.qcPolarityList;
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});
	
	if(runOnce==false){
		poplateOrganizations();
	 runOnce=true;
	}
	/*$('#reviewsListForm').hide();
	 $.ajax({
			type:"POST",
			url:"../qualityControl/ListKpiIndustryMaster.htm",
			contentType:"application/json",
			success:function(response){
				kpiIndustryMasterList=response.successObject.kpiIndustryMasterList;
				
				
				$("#applyFilterBtn").trigger("click");
				
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});*/
	
	$('#reviewsListForm').hide();
	 $.ajax({
			type:"POST",
			url:"../qualityControl/ListKeywordMaster.htm",
			contentType:"application/json",
			success:function(response){
				keywordMasterList=response.successObject.keywordMasterList;
				$("#applyFilterBtn").trigger("click");
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});
	 /*$.ajax({
			type:"GET",
			url:"../qualityControl/listKeywords.htm",
			contentType:"application/json",
			success:function(response){
				keywordsList=response;
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});*/
	 $('#reviewsListForm').hide();
});

$("#applyFilterBtn").click(function(){
	//$('#page-header').empty();
	/*if($('#radioOrgsDiv').is(':empty')){
		getCompetitors();
	}
	*/
	var orgIdRadio=$("input[name=orgRadio]:checked").val();
	if(orgIdRadio==null || orgIdRadio==0 || orgIdRadio==undefined){
		orgIdRadio=0;
	}
	if(orgIdRadio!=0){
		viewReviewSitesContent(orgIdRadio);
	}
	/*var organizationName=$('#organizationName option:selected').text();
	var htmlCode='<span style="color:black">Quality Check For :</span><span style="color:blue"><u>'+organizationName+'<u></span>';
	$('#page-header').html(htmlCode);*/
});

function triggerRadio(){
	$("#applyFilterBtn").trigger('click');
}

$("#organizationName").val($("#organizationName option:first").val());
/*$(function() {
	
	$( "#from" ).datepicker();
	$( "#from" ).datepicker("setDate","-1m");

	$("#from").datepicker("option", { 
		dateFormat:"yy-mm-dd"
	});
	
	$( "#to" ).datepicker();
	$( "#to" ).datepicker("setDate",new Date());
	
	$("#to").datepicker("option", { 
		maxDate: new Date(),
		dateFormat:"yy-mm-dd"
	});
	
});*/
var stoppedTyping;
function clientSearchReview() {
	if (stoppedTyping)
		clearTimeout(stoppedTyping);
	stoppedTyping = setTimeout(
			function() {
				//loadingForDashBoard();
				var searchKey = $("#searchInput").val();
				if ($.trim(searchKey) == "" || searchKey == null) {
					searchKey = "";
				}
				var response;
				var resultListReviews = [];
				if (filteredReviewsDuplicateResponseObject == null) {
					response = JSON.parse(JSON.stringify(normalReviewsDuplicateResponseObject));
					for (var i = 0; i < response.successObject.reviewSitesContentUIList.length; i++) {
						var item = response.successObject.reviewSitesContentUIList[i];
						if (item.highlightedReviewContent == null)
							item.highlightedReviewContent = "";
						if (item.reviewTitle == null)
							item.reviewTitle = "";
						
						var qcIds=[];
						var sentimentScores=[];
						var departments=[];
						var kpiNames=[];
						var keywordNames=[];
						var mentions=[];
						/*var subKeywordsNames=[];*/
						if(item.kpiTagSentimentAnalysisUIList!=null && item.kpiTagSentimentAnalysisUIList.length>0){
							
							for(var m=0;m<item.kpiTagSentimentAnalysisUIList.length;m++){
								qcIds.push(item.kpiTagSentimentAnalysisUIList[m].id);
								sentimentScores.push(item.kpiTagSentimentAnalysisUIList[m].sentimentScore.toFixed(0));
								departments.push(item.kpiTagSentimentAnalysisUIList[m].departmentName.toLowerCase());
								kpiNames.push(item.kpiTagSentimentAnalysisUIList[m].kpiName.toLowerCase());
								keywordNames.push(item.kpiTagSentimentAnalysisUIList[m].keywordName.toLowerCase());
								mentions.push(item.kpiTagSentimentAnalysisUIList[m].mention.toLowerCase());
								/*subKeywordsNames.push(item.kpiTagSentimentAnalysisUIList[m].subKeywords.toLowerCase());*/
							}
						}
						
						if (searchKey != ""	
							&& (item.highlightedReviewContent.toLowerCase().indexOf(searchKey.toLowerCase()) != -1
							|| (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
							|| (qcIds.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
							|| (sentimentScores.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
							|| (departments.join(',').indexOf(searchKey.toLowerCase())) != -1 
							|| (kpiNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
							|| (mentions.join(',').indexOf(searchKey.toLowerCase())) != -1 
							/*|| (subKeywordsNames.join(',').indexOf(searchKey.toLowerCase())) != -1 */
							|| (keywordNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
							|| (item.id.toString().indexOf(searchKey.toString())) != -1)) {
							var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';
							item.highlightedReviewContent = item.highlightedReviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
							item.reviewTitle = item.reviewTitle.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
							
							item.hId = item.id.toString().split(searchKey.toString()).join(hightedText);
							searchedReviewTitle = item.reviewTitle;
							searchedHighlightedReviewContent = item.highlightedReviewContent;
							
							if(item.kpiTagSentimentAnalysisUIList!=null && item.kpiTagSentimentAnalysisUIList.length>0){
								for(var j=0;j<item.kpiTagSentimentAnalysisUIList.length;j++){
									if(item.kpiTagSentimentAnalysisUIList[j].id.toString().indexOf(searchKey.toString()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].qId = item.kpiTagSentimentAnalysisUIList[j].id.toString().split(searchKey.toString()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].sentimentScore.toFixed(0).toString().indexOf(searchKey.toString()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].sentimentScoreStr = item.kpiTagSentimentAnalysisUIList[j].sentimentScore.toFixed(0).toString().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].departmentName.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].departmentName = item.kpiTagSentimentAnalysisUIList[j].departmentName.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].kpiName.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].kpiName = item.kpiTagSentimentAnalysisUIList[j].kpiName.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].keywordName.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].keywordName = item.kpiTagSentimentAnalysisUIList[j].keywordName.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].mention.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].mention = item.kpiTagSentimentAnalysisUIList[j].mention.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									/*if(item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].subKeywords = item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}*/
								}
							}
							resultListReviews.push(item);
						} else {
							if (searchKey == "") {
								resultListReviews.push(item);
							}
						}
					}
				} else {
					response = JSON.parse(JSON.stringify(filteredReviewsDuplicateResponseObject));
					for (var i = 0; i < response.successObject.reviewSitesContentUIList.length; i++) {
						var item = response.successObject.reviewSitesContentUIList[i];
						if (item.highlightedReviewContent == null)
							item.highlightedReviewContent = "";
						if (item.reviewTitle == null)
							item.reviewTitle = "";
						var qcIds=[];
						var sentimentScores=[];
						var departments=[];
						var kpiNames=[];
						var keywordNames=[];
						/*var subKeywordsNames=[];*/
						var mentions=[];
						if(item.kpiTagSentimentAnalysisUIList!=null && item.kpiTagSentimentAnalysisUIList.length>0){
							
							for(var m=0;m<item.kpiTagSentimentAnalysisUIList.length;m++){
								sentimentScores.push(item.kpiTagSentimentAnalysisUIList[m].sentimentScore.toFixed(0));
								qcIds.push(item.kpiTagSentimentAnalysisUIList[m].id);
								departments.push(item.kpiTagSentimentAnalysisUIList[m].departmentName.toLowerCase());
								kpiNames.push(item.kpiTagSentimentAnalysisUIList[m].kpiName.toLowerCase());
								keywordNames.push(item.kpiTagSentimentAnalysisUIList[m].keywordName.toLowerCase());
								mentions.push(item.kpiTagSentimentAnalysisUIList[m].mention.toLowerCase());
							/*	subKeywordsNames.push(item.kpiTagSentimentAnalysisUIList[m].subKeywords.toLowerCase());*/
							}
						}
						
						if (searchKey != ""	
							&& (item.highlightedReviewContent.toLowerCase().indexOf(searchKey.toLowerCase()) != -1
							|| (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
							|| (qcIds.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
							|| (sentimentScores.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
							|| (departments.join(',').indexOf(searchKey.toLowerCase())) != -1 
							|| (mentions.join(',').indexOf(searchKey.toLowerCase())) != -1 
							|| (keywordNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
							|| (kpiNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
							/*|| (subKeywordsNames.join(',').indexOf(searchKey.toLowerCase())) != -1 */
							|| (item.id.toString().indexOf(searchKey.toString())) != -1)) {
							var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';
							item.highlightedReviewContent = item.highlightedReviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
							item.reviewTitle = item.reviewTitle.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
							item.hId = item.id.toString().split(searchKey.toString()).join(hightedText);
							
							if(item.kpiTagSentimentAnalysisUIList!=null && item.kpiTagSentimentAnalysisUIList.length>0){
								for(var j=0;j<item.kpiTagSentimentAnalysisUIList.length;j++){
									if(item.kpiTagSentimentAnalysisUIList[j].id.toString().indexOf(searchKey.toString()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].qId = item.kpiTagSentimentAnalysisUIList[j].id.toString().split(searchKey.toString()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].sentimentScore.toFixed(0).toString().indexOf(searchKey.toString()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].sentimentScoreStr = item.kpiTagSentimentAnalysisUIList[j].sentimentScore.toFixed(0).toString().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].departmentName.toLowerCase().indexOf(searchKey.toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].departmentName = item.kpiTagSentimentAnalysisUIList[j].departmentName.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].kpiName.toLowerCase().indexOf(searchKey.toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].kpiName = item.kpiTagSentimentAnalysisUIList[j].kpiName.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].keywordName.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].keywordName = item.kpiTagSentimentAnalysisUIList[j].keywordName.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									if(item.kpiTagSentimentAnalysisUIList[j].mention.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].mention = item.kpiTagSentimentAnalysisUIList[j].mention.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}
									/*if(item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
										item.kpiTagSentimentAnalysisUIList[j].subKeywords = item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
									}*/
								}
							}
							resultListReviews.push(item);
						} else {
							if (searchKey == "") {
								resultListReviews.push(item);
							}
						}
					}
				}
				var successObjectTemp = {'reviewSitesContentUIList' : resultListReviews,'qcList':response.successObject.qcList};
				
				response = {'successObject' : successObjectTemp};
				var totalReviews = response.successObject.reviewSitesContentUIList;
				
				var divId="reviewSitesContentListDiv";
				pagination(totalReviews,4,divId,response);
				//paginationSearched(totalReviews, 4, hotelReviewsDivId, response);
				//  unloadingForDashBoard(); //$('#wrapper').unmask();
			}, 300);
} 
function loadFilterUI(){
	
	var reviewTypeDivHtml = '';
	if (document.getElementById('newSpan') == null) {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" onclick="reviewType(this)" data-name="new"  id="newChk" name="newChk" value="NEW">';
		reviewTypeDivHtml += 'New';
		reviewTypeDivHtml += '</label>';
	} else {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" checked onclick="reviewType(this)" data-name="new" checked id="newChk" name="newChk" value="NEW">';
		reviewTypeDivHtml += 'New';
		reviewTypeDivHtml += '</label>';
	}
	if (document.getElementById('approvedSpan') == null) {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" onclick="reviewType(this)" data-name="approved"  id="approvedChk" name="approvedChk" value="APPROVED">';
		reviewTypeDivHtml += 'Approved';
		reviewTypeDivHtml += '</label>';
	} else {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox"  checked onclick="reviewType(this)" data-name="approved" checked id="approvedChk" name="approvedChk" value="APPROVED">';
		reviewTypeDivHtml += 'Approved';
		reviewTypeDivHtml += '</label>';
	}
	if (document.getElementById('pendingSpan') == null) {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox"  onclick="reviewType(this)" data-name="pending"  id="pendingChk" name="pendingChk" value="PENDING">';
		reviewTypeDivHtml += 'Pending';
		reviewTypeDivHtml += '</label>';
	} else {
		reviewTypeDivHtml += '<label class="col-xs-12">';
		reviewTypeDivHtml += '<input type="checkbox" checked onclick="reviewType(this)" data-name="pending" checked id="pendingChk" name="pendingChk" value="PENDING">';
		reviewTypeDivHtml += 'Pending';
		reviewTypeDivHtml += '</label>';
	}
	$('#reviewTypeChkDiv').html(reviewTypeDivHtml);
	
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
	
	//var orgId = $("#organizationName").val();
	
	var orgId=$("input[name=orgRadio]:checked").val();
	/*if(orgIdRadio==null || orgIdRadio==0 || orgIdRadio==undefined){
		orgIdRadio=0;
	}*/
	
	$.ajax({
		type : "GET",
		url : "../reviewSitesContent/getMappedSourceForOrganization.htm?organizationId="+ orgId,
		contentType : "application/json",
		success : function(response) {
			var sourceList = response.successObject.sources;
			var htmlCode = '<h4 class="col-xs-12">Review Source</h4>';
			for (var i = 0; i < sourceList.length; i++) {
				if (sourceList[i].sourceType == "ReviewSite") {
					htmlCode += '<label class="col-xs-12">';
					if (document.getElementById(sourceList[i].sourceName.toLowerCase()+ 'SourceSpan') != null) {
						htmlCode += '<input checked id="'+ sourceList[i].sourceName.toLowerCase()+ 'Source" onclick="source(this)" type="checkbox" value="'+ sourceList[i].sourceName + '">';
					} else {
						htmlCode += '<input  id="'+ sourceList[i].sourceName.toLowerCase()+ 'Source" onclick="source(this)" type="checkbox" value="'+ sourceList[i].sourceName + '">';
					}
					htmlCode += '' + sourceList[i].sourceName + '';
					htmlCode += '</label>';
				}
			}
			$('#sourcesDiv').html(htmlCode);
		},
		error : function(response) {
			return false;
		}
	});
	
	$("#filterFromDate").datepicker("setDate",sessionFromDate);
	$("#filterToDate").datepicker("setDate",sessionToDate);
}
 $(function() {
	    $( "#filterFromDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
	    $( "#filterToDate" ).datepicker({ dateFormat: 'yy-mm-dd' });
 });
 function reviewType(obj) {
		var reviewTypeName = $(obj).data('name');
		var chkId = reviewTypeName + "Chk";
		var spanId = reviewTypeName + "Span";
		if ($(obj).prop('checked')) {
			var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
					+ reviewTypeName + '<button onclick="removeTag(\'' + spanId
					+ '\')" class="btn">x</button></span>';
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
		if ($(obj).prop('checked')) {
			var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
					+ sourceName + '<button onclick="removeTag(\'' + spanId
					+ '\')" class="btn">x</button></span>';
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
				filter();
			}
		});
}
 function flag(obj) {
		var flagName = $(obj).data('name');
		var chkId = flagName + "Chk";
		var spanId = flagName + "Span";
		if ($(obj).prop('checked')) {
			var htmlCode = '<span id="' + spanId + '" class="ReviewFilterOutput">'
					+ flagName + '<button onclick="removeTag(\'' + spanId+ '\')" class="btn">x</button></span>';
			$('#selectedFiltersDiv').prepend(htmlCode);
		} else {
			$('#' + chkId).attr('checked', false);
			$('#' + spanId).remove();
			/* loadFilterUI(); */
		}
}
function filter() {
		var reviewTypes = [];
		var sources = [];
		var flags = [];
		/*var fromDate = $('#filterFromDate').val();
		var toDate = $('#filterToDate').val();*/
		
		 var f = $('#altFromDate').val().split(/[.,\/ -]/);
		 var newF=f[2]+"-"+f[0]+"-"+f[1];
		 
		 var t = $('#altToDate').val().split(/[.,\/ -]/);
		 var newT=t[2]+"-"+t[0]+"-"+t[1];
		 
		 var fromDate=""+newF;
		 var toDate=""+newT;
		 
		//var organizationId = $('#organizationName option:selected').val();
		
		var organizationId=$("input[name=orgRadio]:checked").val();
		
		 var selected = $('#organizationName').find('option:selected');
		var clientId = selected.data('clientId');
		 
		if ($('#duplicateFlagChk').prop('checked')) { // 9
			flags.push('DUPLICATE_REVIEW');
		}
		if ($('#deletedFlagChk').prop('checked')) { // 9
			flags.push('DELETED_REVIEW');
		}
		if ($('#languageFlagChk').prop('checked')) { // 9
			flags.push('INCORRECT_LANGUAGE');
		}
		if ($('#otherFlagChk').prop('checked')) { // 9
			flags.push('OTHER');
		}
		
		/*if ($('#allChk').prop('checked')) { // 2
			reviewTypes.push($('#allChk').val());
		}*/
		if ($('#newChk').prop('checked')) { // 2
			reviewTypes.push($('#newChk').val());
		}
		if ($('#approvedChk').prop('checked')) { // 2
			reviewTypes.push($('#approvedChk').val());
		}
		if ($('#pendingChk').prop('checked')) { // 2
			reviewTypes.push($('#pendingChk').val());
		}
		
		$("#sourcesDiv").find('input[type=checkbox]').each(function() { // 4
			if (this.checked == true) {
				sources.push(this.value);
			}
		});
		var sortBy = $('#sortSelectOption option:selected').val();
		var reviewFilterUI = {
			'reviewTypes' : reviewTypes,
			'sources' : sources,
			'flags' : flags,
			'organizationId' : organizationId,
			'fromDate' : fromDate,
			'toDate' : toDate,
			'clientId':organizationId,
			'sortBy':sortBy
		};
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		$.ajax({
					type : "POST",
					url : "../qualityControl/getFilteredReview.htm",
					contentType : "application/json",
					data : JSON.stringify(reviewFilterUI),
					success : function(response) {
						if (response.successObject.LIST_EMPTY == true) {
							$('#reviewSitesContentListDiv').html("<font style='margin-left:25px;color:red'>  No Reviews Found</font>");
							$('#leftNavigation,#wrapper,#header').unmask();
							return;
						}
						if (response.status == "EXCEPTION_ERROR") {
							$('.container').mask(response.errorMessage);
						} else {
							$('#searchedTextDiv').html('');
							$('#filterDiv').html('');
							// for search purpose 
							filteredReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));
							var totalFilteredReviews = response.successObject.reviewSitesContentUIList;
							//paginationFiltered(totalFilteredReviews, 4,	hotelReviewsDivId, response);
							
							 var divId="reviewSitesContentListDiv";
							 pagination(totalFilteredReviews,4,divId,response);
							$('#leftNavigation,#wrapper,#header').unmask();
						}
					},
					error : function(response) {
						$('#successModalTitle').text("Error");
						$('#successModalText').text("Something went wrong , please contact admin !");
						$('#successModal').modal('show');
					}
			});
}
var reviewSetToRestore=new Hashtable();
function restoreStagingForReview(reviewId){
	loadingForDashBoard();
	$('#restoreReviewReasonModalBody,#restoreReviewReasonModalFooter').html('');
	 var html = "";
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addRestoreReviewReasonErrorDiv">';
	 html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Reason';
	 html+=	'</div>';
	 /************************Success Div****************************************************************/
	 html+=	'<div class="form-group">';
     html+=	'<label for="message-text" class="control-label">Enter Reason</label>';
     html+=	'<textarea class="form-control" maxLength=200 id="restoreReviewReason_'+reviewId+'"></textarea>';
     html+=	'</div>';
     html+=	'</form>';
     $('#restoreReviewReasonModalBody').append(html);
     $('#restoreReviewReasonModalFooter').append('<button type="button" class="btn btn-primary" onclick="restoreReviewWithReason('+reviewId+')">Yes</button>');
     $('#restoreReviewReasonModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
     $('#restoreReviewReasonModal').modal('show');
     unloadingForDashBoard();
}




function restoreReviewWithReason(reviewId){
	loadingForDashBoard();
	 $('#addRestoreReviewReasonErrorDiv').hide();
	 $('#addRestoreReviewReasonErrorDiv').html('');
	 var restoreReviewReason = $.trim($('#restoreReviewReason_'+reviewId).val());
	 if(restoreReviewReason!=""){
		 var selectedOrganizationId = $("input[name=orgRadio]:checked").val();
		 var reviewSitesContent={'id':reviewId,'organizationId':selectedOrganizationId,'restoredReason':restoreReviewReason}; 
		 reviewSetToRestore.put(reviewId,reviewSitesContent);
		 var reviewSitesContentTemp=reviewSetToRestore.get(reviewId);
		 $.ajax({
				type:"POST",
				url:"../qualityControl/restoreStagingForReview.htm",
				contentType:"application/json",
				data:JSON.stringify(reviewSitesContentTemp),
				success:function(response){
					if(response.status=="UPDATE_SUCCESS"){
						var originalReview=response.successObject.originalReview;
						var qcList=response.successObject.qcList;
						var returnHtml=paintReviewDiv(originalReview,qcList);
						$("#reviewContentDiv_"+reviewId).html(returnHtml);
						if(originalReview.reviewStatus=="DELETED"){
							$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
						}
						$("#reviewContentDiv_"+reviewId).removeClass("disabledbutton");
						$('#restoreReviewReasonModal').modal('hide');
						unloadingForDashBoard();
						$('#successModalTitle').text("Success");
						$('#successModalText').text("Review restored successfully.");
						$('#successModal').modal('show');
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }else{
		 $('#addRestoreReviewReasonErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Reason');
		 $('#addRestoreReviewReasonErrorDiv').show(600);
		 unloadingForDashBoard();
	 }
	
}

/*function restoreStagingForReview(reviewId){
	loadingForDashBoard();
	var organizationId = $("input[name=orgRadio]:checked").val();
	var reviewSitesContent={'id':reviewId,'organizationId':organizationId}; 
	reviewSetToRestore.put(reviewId,reviewSitesContent);
	var reviewSitesContentTemp=reviewSetToRestore.get(reviewId);
	console.log(reviewSitesContentTemp);
	$.ajax({
			type:"POST",
			url:"../qualityControl/restoreStagingForReview.htm",
			contentType:"application/json",
			data:JSON.stringify(reviewSitesContentTemp),
			success:function(response){
				reviewSetToRestore.remove(reviewId); //new changes
				if(response.status=="UPDATE_SUCCESS"){
					var originalReview=response.successObject.originalReview;
					var qcList=response.successObject.qcList;
					var returnHtml=paintReviewDiv(originalReview,qcList);
					$("#reviewContentDiv_"+reviewId).html(returnHtml);
					if(originalReview.reviewStatus=="DELETED"){
						$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
					}
					$("#reviewContentDiv_"+reviewId).removeClass("disabledbutton");
					unloadingForDashBoard();
					$('#successModalTitle').text("Success");
					$('#successModalText').text("Review restored successfully.");
					$('#successModal').modal('show');
				}
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});
}*/

function restoreQcForReview(reviewSiteContentId){
	 
	 var reviewListToRestoreTemp=[];
	 var reviewListToRestore=reviewSetToRestore.values();
	 for(var i=0;i<reviewListToRestore.length;i++){
		 if(reviewListToRestore[i].id==reviewSiteContentId){
			 reviewListToRestoreTemp.push(reviewListToRestore[i]);
			 reviewSetToRestore.remove(reviewListToRestore[i].id);
		 }
	 }
	
	 var reviewSitesContentTemp=reviewListToRestoreTemp[0];
	 if(reviewSitesContentTemp==null){
		 	approveReview(reviewSiteContentId);
	 }else{
		 $.ajax({
				type:"POST",
				url:"../qualityControl/restoreQcForReview.htm",
				contentType:"application/json",
				data:JSON.stringify(reviewSitesContentTemp),
				success:function(response){
					if(response.status=="UPDATE_SUCCESS"){
						approveReview(reviewSiteContentId);
					}else{
						var htmlCode="<span style='color:rgb(255,0,0)'>Errors : "+response.errorMessage+"</span>";
						$("#errorDiv_"+reviewSiteContentId).html(htmlCode);
						/*$('#successModalTitle').text("Error");
						$('#successModalText').text("Restore QC Failed.");
						$('#successModal').modal('show');*/
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }
}

function approve(reviewId){
	 loadingForDashBoard();
	 updatePolarity(reviewId);
	 //updateMention(reviewId);
	 //deleteQc(reviewId);
	//restoreQcForReview(reviewId);
	 //approveReview(reviewId);
}

var kpiTagSentimentAnalysisSetToRestore=new Hashtable();
function restoreStagingQc(qcId,reviewId){
	var restoringReason=$('#restoringReasonId').val();
	var selectedCheckBoxLength = $('.restoreQcCheckBox:checked').length;
	if(selectedCheckBoxLength==0){
		alert("Please Select an Restore Option.");
		return false;
	}else if(restoringReason==""){
		alert("Please Enter reason for restoring.");
		return false;
	}
	loadingForDashBoard();
	var selected = [];
	$('.restoreQcCheckBox:checked').each(function() {
	    selected.push($(this).attr('value'));
	});
	
	var kpiTagSentimentAnalysis={'id':qcId,'reviewSiteContentId':reviewId,'restorePoints':selected,'restoringReason':restoringReason}; 
	kpiTagSentimentAnalysisSetToRestore.put(qcId,kpiTagSentimentAnalysis);
	console.log(kpiTagSentimentAnalysis);
	
	$.ajax({
			type:"POST",
			url:"../qualityControl/restoreStagingQcForAdmin.htm",
			contentType:"application/json",
			data:JSON.stringify(kpiTagSentimentAnalysis),
			success:function(response){
				if(response.status=="UPDATE_SUCCESS"){
					//$('#restoreQcModal').modal('hide');
					/*var originalkpiTagSentimentAnalysis=response.successObject.originalKpiTagSentimentAnalysis;
					var keywordId=originalkpiTagSentimentAnalysis.keywordId;
					var reviewSitesContentId=originalkpiTagSentimentAnalysis.reviewSiteContentId;
					var qcId=originalkpiTagSentimentAnalysis.id;
					var departmentName=originalkpiTagSentimentAnalysis.departmentName;
					var kpiName=originalkpiTagSentimentAnalysis.kpiName;
					var keywordName=originalkpiTagSentimentAnalysis.keywordName;
					var deletedStatus=originalkpiTagSentimentAnalysis.deletedStatus;
					var departmentId = originalkpiTagSentimentAnalysis.departmentId;
					var kpiId = originalkpiTagSentimentAnalysis.kpiId;
					var sourceId = originalkpiTagSentimentAnalysis.sourceId;
					var map=[];
					var returnHtml=paintQcDiv(qcId,reviewSitesContentId,originalkpiTagSentimentAnalysis,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
					$("#qcDiv_"+qcId+"_"+reviewSitesContentId).html(returnHtml);
					$('#qcDiv_'+qcId+'_'+reviewSitesContentId).removeClass("disabledbutton");*/
					var review=response.successObject.review;
					var qcList=response.successObject.qcList;
					var returnHtml=paintReviewDiv(review,qcList);
					$("#reviewContentDiv_"+reviewId).html(returnHtml);
					if(review.reviewStatus=="DELETED"){
						$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
					}
					$('#successModalTitle').text("Success");
					$('#successModalText').text("QC Has Been restored successfully.");
					$('#restoreQcModal').modal('hide');
					$('#successModal').modal('show');
					unloadingForDashBoard();
				}
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});
}
function restoreQc(reviewSiteContentId){
	 
	 var kpiTagSentimentAnalysisListToRestoreTemp=[];
	 var kpiTagSentimentAnalysisListToRestore=kpiTagSentimentAnalysisSetToRestore.values();
	 for(var i=0;i<kpiTagSentimentAnalysisListToRestore.length;i++){
		 if(kpiTagSentimentAnalysisListToRestore[i].reviewSiteContentId==reviewSiteContentId){
			 kpiTagSentimentAnalysisListToRestoreTemp.push(kpiTagSentimentAnalysisListToRestore[i]);
			 kpiTagSentimentAnalysisSetToRestore.remove(kpiTagSentimentAnalysisListToRestore[i].id);
		 }
	 }
	 //console.log(kpiTagSentimentAnalysisSetToRestore.values());
	 if(kpiTagSentimentAnalysisListToRestoreTemp.length==0){
		 deleteQc(reviewSiteContentId);
	 }else{
		 $.ajax({
				type:"POST",
				url:"../qualityControl/restoreQcForAdmin.htm",
				contentType:"application/json",
				data:JSON.stringify(kpiTagSentimentAnalysisListToRestoreTemp),
				success:function(response){
					if(response.status=="UPDATE_SUCCESS"){
						deleteQc(reviewSiteContentId);
					}else{
						var htmlCode="<span style='color:rgb(255,0,0)'>Errors : "+response.errorMessage+"</span>";
						$("#errorDiv_"+reviewSiteContentId).html(htmlCode);
					/*	$('#successModalTitle').text("Error");
						$('#successModalText').text("Delete QC Failed.");
						$('#successModal').modal('show');*/
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }
}

function updateMention(reviewSiteContentId){
	 
	 var changedMentionsListToUpdateTemp=[];
	 var changedMentionsListToUpdate=changedMentionsSetToUpdate.values();
	 for(var i=0;i<changedMentionsListToUpdate.length;i++){
		 if(changedMentionsListToUpdate[i].reviewSiteContentId==reviewSiteContentId){
			 changedMentionsListToUpdateTemp.push(changedMentionsListToUpdate[i]);
			 changedMentionsSetToUpdate.remove(changedMentionsListToUpdate[i].id);
		 }
	 }
	 //console.log(changedMentionsSetToUpdate.values());
	 if(changedMentionsListToUpdateTemp.length==0){
		 restoreQc(reviewSiteContentId);
	 }
	 else{
		 $.ajax({
				type:"POST",
				url:"../qualityControl/updateMentionsForAdmin.htm",
				contentType:"application/json",
				data:JSON.stringify(changedMentionsListToUpdateTemp),
				success:function(response){
					if(response.status=="UPDATE_SUCCESS"){
						restoreQc(reviewSiteContentId);
					}else{
						var htmlCode="<span style='color:rgb(255,0,0)'>Errors : "+response.errorMessage+"</span>";
						$("#errorDiv_"+reviewSiteContentId).html(htmlCode);
						/*$('#successModalTitle').text("Error");
						$('#successModalText').text("Restore QC Update Failed.");
						$('#successModal').modal('show');*/
					}
					
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }
}

function approveReview(reviewId){
	 var organizationId=$('#organizationName option:selected').val();
	 reviewSitesContent={'id':reviewId,'reviewStatus':'APPROVED','organizationId':organizationId};
	 $.ajax({
			type:"POST",
			url:"../qualityControl/approveReviewForAdmin.htm",
			contentType:"application/json",
			data:JSON.stringify(reviewSitesContent),
			success:function(response){
				if(response.status="UPDATE_SUCCESS"){
					var updatedReview=response.successObject.updatedReview;
					var qcList=response.successObject.qcList;
					var returnHtml=paintReviewDiv(updatedReview,qcList);
					$("#reviewContentDiv_"+reviewId).html(returnHtml);
					if(updatedReview.reviewStatus=="DELETED"){
						$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
					}
					unloadingForDashBoard();
					$('#successModalTitle').text("Success");
					$('#successModalText').text("Review(s) has been approved successfully.");
					$('#successModal').modal('show');
				}else{
					/*$('#successModalTitle').text("Error");
					$('#successModalText').text("Review approval falied.");
					$('#successModal').modal('show');*/
				}
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});
 }
 function showMentionModal(qcId,keywordId,reviewId){
		
		$('#changeReferenceModalTitle').text("Change Reference for QC ID :"+qcId);
		var htmlCode='';
		
		htmlCode += '<div class="alert alert-danger alert-error" style="display: none;"	id="addReferenceErrorDiv">';
		htmlCode += '</div>';
		
		
		htmlCode+='<input type="radio" checked name="mentionRadio" onchange="enableSelect()" value="oldMention">Select a reference fom the list<br>';
		htmlCode+='<select id="oldMentionOption" class="form-control" style="width:auto">';
		
		for(var i=0;i<keywordMasterList.length;i++){
			if(keywordId==keywordMasterList[i].id){
				htmlCode+='<option selected value="'+keywordMasterList[i].id+'">'+keywordMasterList[i].mention+'</option>';
			}else{
				htmlCode+='<option value="'+keywordMasterList[i].id+'">'+keywordMasterList[i].mention+'</option>';
			}
		}
		
		htmlCode+='</select>';
		
		htmlCode+='<input type="radio" name="mentionRadio" onchange="enableMentionInput()" value="newMention">Create a new Reference';
		htmlCode+='<input disabled id="newMentionInput" type="text" class="form-control" style="width:auto">';
		
		htmlCode+='<div class="row mt10">';
			htmlCode+='<button onclick="pushChangedMention('+qcId+','+reviewId+')" class="btn btn-default" aria-hidden="true" type="button">Save</button>';
			htmlCode+='<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Cancel</button>';
		htmlCode+='</div>';
		
		$('#changeReferenceModalBody').html(htmlCode);
		/*$('#changeReferenceModalText').text("Something went wrong , please contact admin !");*/
		$('#changeReferenceModal').modal('show');
		
	}

function enableMentionInput(){
		$('#oldMentionOption').attr('disabled',true);
	$('#newMentionInput').attr('disabled',false);
}
function enableSelect(){
	$('#oldMentionOption').attr('disabled',false);
	$('#newMentionInput').attr('disabled',true);
}


//shravan
var kpiTagSentimentAnalysisListToDelete=[];
function deleteReview(reviewId){
	 $('#addDeleteQcCommentErrorDiv').hide();
	 $('#addDeleteQcCommentErrorDiv,#deleteQcReviewModalTitle,#deleteQcReviewModalBody,#deleteQcReviewModalFooter').html('');
	 $('#deleteQcReviewModalTitle').append('Enter Reason For Review ID:'+reviewId);
	 var html = "";
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addDeleteQcCommentErrorDiv">';
	 html+=	'</div>';
    html+=	'<div class="form-group">';
    html+=	'<label for="message-text" class="control-label">Please Select Reason</label>';
    html+=  '<textarea maxLength=100 id="deleteQcReviewTextData" class="form-control"></textArea>';
    html+=	'</div>';
    html+=	'<div class="form-group" style="display:none;" id="deleteQcReasonDiv_'+reviewId+'">';
    html+=	'<label for="message-text" class="control-label">Enter Reason</label>';
    html+=	'<textarea class="form-control" maxLength=100 id="deleteQcComment_'+reviewId+'"></textarea>';
    html+=	'</div>';
    html+=	'</form>';
    $('#deleteQcReviewModalBody').append(html);
    $('#deleteQcReviewModalFooter').append('<button type="button" class="btn btn-primary" onclick="_deleteReview('+reviewId+')">Yes</button>');
    $('#deleteQcReviewModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
    $('#deleteQcReviewModal').modal('show');
}


  function _deleteReview(reviewId){
	 var deleteQcReviewTextData=$('#deleteQcReviewTextData').val();
	 if(deleteQcReviewTextData!=""){
	 var orgIdRadio=$("input[name=orgRadio]:checked").val();
	 var organizationIdInt=parseInt(orgIdRadio);
	 
	 reviewSitesContent={'id':reviewId,'reviewStatus':'DELETED','organizationId':organizationIdInt};
	 $.ajax({
			type:"POST",
			url:"../qualityControl/deleteReview.htm",
			contentType:"application/json",
			data:JSON.stringify(reviewSitesContent),
			success:function(response){
				if(response.status="UPDATE_SUCCESS"){
					var updatedReview=response.successObject.updatedReview;
					var qcList=response.successObject.qcList;
					var returnHtml=paintReviewDiv(updatedReview,qcList);
					$("#reviewContentDiv_"+reviewId).html(returnHtml);
					if(updatedReview.reviewStatus=="DELETED"){
						$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
						 $('#deleteQcReviewModal').modal('hide');
						 
						    $('#successModalTitle').text("Success");
							$('#successModalText').text("Review Deleted successfully.");
							$('#successModal').modal('show');
					}
					$('#leftNavigation,#wrapper,#header').unmask();
				}else{
				}
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
	});
	 }else{
		 alert("Please Enter Reason");
	 }
}
  
  
  
function selectAll(){
	$("#reviewSitesContentListDiv :checkbox").each(function () {
	      //do it here
	      /*if (!this.checked){*/
	          this.click();
	});
}

function addStagingQc(qcId,reviewId,reviewTime,sourceId){
	
	var departmentId=parseInt($('#departmentTypeOption option:selected').val());
	var kpiId=parseInt($('#kpiOption option:selected').val());
	var keywordId=parseInt($('#keywordOption option:selected').val());
	var organizationId=parseInt($('#organizationName option:selected').val());
	var reviewDate=moment(reviewTime).format('YYYY-MM-DD HH:mm:ss');
	var polarity=$('#newPolarityOption option:selected').text().toLowerCase();
	var sentimentScore=parseFloat($('#newPolarityOption option:selected').val());
	var keywordName=$('#keywordOption option:selected').text();
	var mention='';
	var qcKeywords=[];
	var newKeywords=$('#_newKeywords').val().split(",");
	if(newKeywords!=""){
	for(var n=0;n<newKeywords.length;n++){
		var qcKeyword={'keyword':newKeywords[n]};
		qcKeywords.push(qcKeyword);
	}}
	
	if (!$("input[name='mentionRadio']:checked").val()) {
		  $('#successModalTitle').text("Alert");
		  $('#successModalText').text("Please Select an option !");
		  $('#successModal').modal('show');
	}
	else {
		var radioValue=$("input[name=mentionRadio]:checked").val();
		if(radioValue=='oldMention'){
			keywordId=$('#oldMentionOption option:selected').val();
			mention=$('#oldMentionOption option:selected').text();
			var index = mention.indexOf("(");
			mention=mention.substring(0, index);
		}
		else{
			mention=$('#newMentionInput').val();
			if($.trim(mention)==""){
				$('#successModalTitle').text("Alert");
				$('#successModalText').text("Please enter reference name !");
				$('#successModal').appendTo("body").modal('show');
				 $("#successModal").css("z-index", "1500");
				return;
			}
		}
	}
	var newQC={'qcKeywords':qcKeywords,'mention':mention,'keywordName':keywordName,'reviewDateStr':reviewDate,'polarity':polarity,'sentimentScore':sentimentScore,'organizationId':organizationId,'reviewSiteContentId':reviewId,'sourceId':sourceId,'departmentId':departmentId,'kpiId':kpiId,'keywordId':keywordId};
	console.log("departmentId :"+departmentId+" kpiId:"+kpiId+" keywordId:"+keywordId+" mention:"+mention+" keywordName:"+keywordName+" departmentId:"+departmentId+" kpiId:"+kpiId+" keywordId:"+keywordId);
	if(departmentId==""|| kpiId=="" || keywordId=="" || mention=="" || keywordName==""||departmentId=="noData"|| kpiId=="noData" || keywordId=="noData" || mention=="noData" || keywordName=="No Data Found"){
		$('#successModalTitle').text("Alert");
		$('#successModalText').text("Please select all mandatory fields.");
		$('#successModal').modal('show');
		return ;
	}
	loadingForDashBoard();
	$.ajax({
		type:"POST",
		url:"../qualityControl/saveStagingQC.htm",
		contentType:"application/json",
		data:JSON.stringify(newQC),
		success:function(response){
			if(response.status=="SAVE_SUCCESS"){
				var review=response.successObject.review;
				var qcList=response.successObject.qcList;
				var returnHtml=paintReviewDiv(review,qcList);
				$("#reviewContentDiv_"+reviewId).html(returnHtml);
				if(review.reviewStatus=="DELETED"){
					$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
				}
				unloadingForDashBoard();
				$('#addQcModal').modal('hide');
				
				$.ajax({
						type:"POST",
						url:"../qualityControl/ListKeywordMaster.htm",
						contentType:"application/json",
						success:function(response){
							keywordMasterList=response.successObject.keywordMasterList;
						},error:function(response){
							$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
						}
			    });
				 
			}else{
				alert(response.errorMessage);
			}
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
		}
	});
}
var kpisForDepartment=[];
function mappedKpis(){
	var departmentId=$('#departmentTypeOption option:selected').val();
	var department={'id':departmentId};
	$.ajax({
		type:"POST",
		url:"../qualityControl/mappedKpisForDepartment.htm",
		data:JSON.stringify(department),
		contentType:"application/json",
		success:function(response){
			kpisForDepartment=response.successObject.kpis;
			var htmlCode='';
			
			htmlCode+='<label class="col-xs-12">KPI';
				htmlCode+='<select  onchange="mappedKeywords()" id="kpiOption" class="form-control" style="width:auto">';
				if(kpisForDepartment.length>0){
					for(var i=0;i<kpisForDepartment.length;i++){
						htmlCode+='<option value="'+kpisForDepartment[i].id+'">'+kpisForDepartment[i].kpiName+'</option>';
					}
				}else{
					htmlCode+='<option value="noData">No Data Found</option>';
				}
				htmlCode+='</select>';
			htmlCode+='</label>';
			
			$('#kpisDiv').html(htmlCode);
			$("#kpiOption").trigger("change");
		}
	});
}
function setMentionForKeyword(){
	var keywordValue=$("#keywordOption option:selected").val();
	if(keywordValue=="noData"){
		$("#oldMentionOption").val($("#oldMentionOption option:first").val());
	}else{
		$("#oldMentionOption").val(keywordValue);
	}
	
}
var keywordsForKpi=[];
function mappedKeywords(){
	var kpiId=$('#kpiOption option:selected').val();
	/*var departmentTypeId=$('#departmentTypeOption option:selected').val();*/
	var departmentTypeId=$('#departmentTypeOption option:selected').data('departmenttypeid');
	
	var kpi={'id':kpiId,'departmentTypeId':departmentTypeId};
	$.ajax({
		type:"POST",
		url:"../qualityControl/mappedKeywordsForKpi.htm",
		data:JSON.stringify(kpi),
		contentType:"application/json",
		success:function(response){
			keywordsForKpi=response.successObject.keywords;
			var htmlCode='';
			
			htmlCode+='<label class="col-xs-12">References Category';
				htmlCode+='<select  onchange="setMentionForKeyword()" id="keywordOption" class="form-control" style="width:auto">';
				if(keywordsForKpi.length>0){
					for(var i=0;i<keywordsForKpi.length;i++){
						htmlCode+='<option value="'+keywordsForKpi[i].id+'">'+keywordsForKpi[i].keywordName+'</option>';
					}
				}else{
					htmlCode+='<option value="noData">No Data Found</option>';
				}
				
				htmlCode+='</select>';
			htmlCode+='</label>';
			
			
			$.ajax({
				type:"POST",
				url:"../qualityControl/distinctKeywords.htm",
				data:JSON.stringify(kpi),
				contentType:"application/json",
				success:function(response){
					var distinctKeywords=response.successObject.distinctKeywords;
					
					htmlCode+='<input type="radio" checked name="mentionRadio" onchange="enableSelect()" value="oldMention">Select a reference fom the list<br>';
					htmlCode+='<select id="oldMentionOption" class="form-control" style="width:auto">';
					if(distinctKeywords.length>0){
						for(var i=0;i<distinctKeywords.length;i++){
								htmlCode+='<option value="'+distinctKeywords[i].id+'">'+distinctKeywords[i].mention+'('+distinctKeywords[i].keywordName+')</option>';
						}
					}else{
						htmlCode+='<option value="noData">No Data Found</option>';
					}
					htmlCode+='</select>';
						htmlCode+='<input type="radio" name="mentionRadio" onchange="enableMentionInput()" value="newMention">Create a new Reference';
						htmlCode+='<input disabled id="newMentionInput" type="text" class="form-control" style="width:auto">';
						
						htmlCode+='<select id="newPolarityOption" class="form-control input-sm" style="width:auto" onchange="">';
						if(qcPolarityList.length>0){
							for(var q=0;q<qcPolarityList.length;q++){
								htmlCode+='<option  value="'+qcPolarityList[q].percentage+'">'+qcPolarityList[q].polarity+'</option>';
							}
						}else{
							htmlCode+='<option  value="noData">No Data Found</option>';
						}
						
					htmlCode+='</select>';
					$('#keywordsDiv').html(htmlCode);
					$('#keywordOption').trigger('change');
				}
			});
			
		}
	});
}
 function getSentimentPoint(id){
	 dropdownId="reviewSitesContentId_"+id+"_Kpi_Dropdown";
	 sentimentInputId="reviewSitesContentId_"+id+"_SentimentPointinput";
	 $('#'+sentimentInputId).val($('#'+dropdownId).val());
 }
 function showAddQCModal(reviewId,sourceId,reviewTime){
		var organizationId=$('#organizationName option:selected').val();
		var organization={'id':organizationId};
		$.ajax({
			type:"POST",
			url:"../qualityControl/mappedDepartmentTypesForOrganization.htm",
			data:JSON.stringify(organization),
			contentType:"application/json",
			success:function(response){
				departmentTypesForOrganization=response.successObject.departmentTypes;
				
				var htmlCode='';
				var qcId=1;
				$('#addQcModalTitle').text("Add New QC");
				
				htmlCode+='<div id="addNewQCDiv">';
					//htmlCode+='<input type="radio" checked name="mentionRadio" onchange="enableSelect()" value="oldMention">Select a reference fom the list<br>';
					htmlCode+='<label class="col-xs-12">Department';
						htmlCode+='<select onchange="mappedKpis()" id="departmentTypeOption" class="form-control" style="width:auto">';
						
						for(var i=0;i<departmentTypesForOrganization.length;i++){
								htmlCode+='<option  data-departmenttypeid="'+departmentTypesForOrganization[i].departmentTypeId+'" value="'+departmentTypesForOrganization[i].id+'">'+departmentTypesForOrganization[i].departmentName+'</option>';
						}
						htmlCode+='</select>';
					htmlCode+='</label>';
				htmlCode+='</div>';
				
				htmlCode+='<div id="kpisDiv">';
				htmlCode+='</div>';
				
				
				htmlCode+='<div id="keywordsDiv">';
				htmlCode+='</div>';
				
				htmlCode+='<div id="mentionsDiv">';
				htmlCode+='</div>';
				
				htmlCode+='<div id="newKeywordsDiv">';
					htmlCode+='<label class="col-xs-12">You can add multiple keywords using comma separation';
						htmlCode+='<textarea class="form-control" maxlength="100" id="_newKeywords"></textarea>';
					htmlCode+='</label>';
				htmlCode+='</div>';
				
				htmlCode+='<div class="row mt10">';
					htmlCode+='<button onclick="addStagingQc('+qcId+','+reviewId+','+reviewTime+','+sourceId+')" class="btn btn-default" aria-hidden="true" type="button">Save</button>';
					htmlCode+='<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Cancel</button>';
				htmlCode+='</div>';
				
				$('#addQcModalBody').html(htmlCode);
				$('#addQcModal').modal('show');
				
				$("#departmentTypeOption").trigger("change");
				
			
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
			}
		});
	}
 var reviewSetForBulk=new Hashtable();
	function pushReviewForBulk(reviewId,obj){
		var status=$(obj).prop('checked');
		if(status==true ){
			var reviewSiteContent={'id':reviewId};
			reviewSetForBulk.put(reviewId,reviewSiteContent);
		}else{
			reviewSetForBulk.remove(reviewId);
		}
	}
	function approveAll(){
		
		var reviewListToApprove=reviewSetForBulk.values();
		if(reviewListToApprove.length>0){
			for(var i=0;i<reviewListToApprove.length;i++){
				approve(reviewListToApprove[i].id);
				if(reviewListToApprove.length-1==i){
					reviewSetForBulk.clear();
					//$('#selectAllChk').click();
				}
			}
		}else{
			$('#successModalTitle').text("Alert");
			$('#successModalText').text("Please Select Reviews.");
			$('#successModal').modal('show');
		}
}
function showRestoreQcModal(qcId,reviewId){
		
		$('#restoreQcModalTitle').text('Restore QC Data for QC ID : '+qcId+'');
		var htmlCode='Are you sure you want to restore ?';
		
		htmlCode+='<div id="restoreChkDiv">';
			htmlCode+='<div class="row mt10">';
			htmlCode+='<label class="col-xs-12">';
			htmlCode+='<input type="checkbox" id="restoreAllQcCheckBox">';
			htmlCode+='Restore All';
		    htmlCode+='</label>';
				htmlCode+='<label class="col-xs-12">';
					htmlCode+='<input type="checkbox" id="restorePolarity" name="restorePolarity" value="polarity" class="restoreQcCheckBox">';
					htmlCode+='Restore Sentiment Polarity';
				htmlCode+='</label>';
				
				htmlCode+='<label class="col-xs-12">';
					htmlCode+='<input type="checkbox" id="restoreKeywords" name="restoreKeywords" value="keywords" class="restoreQcCheckBox">';
					htmlCode+='Restore Keywords';
				htmlCode+='</label>';
			
			htmlCode+='<label class="col-xs-12">';
				htmlCode+='<input type="checkbox" id="restoreRef" name="restoreRef" value="reference" class="restoreQcCheckBox">';
				htmlCode+='Restore Changed Reference';
			htmlCode+='</label>';
			htmlCode+='</div>';
		htmlCode+='</div>';

		htmlCode+='<label>Reason for restoring QC data<span><span style="color:rgb(255,0,0)">*</label>';
		htmlCode+='<div class="row mt10">';
			htmlCode+='<textarea id="restoringReasonId" rows="4" cols="50" ></textarea>';
		htmlCode+='</div>';

		htmlCode+='<div class="row mt10">';
			htmlCode+='<button onclick="restoreStagingQc('+qcId+','+reviewId+')" class="btn btn-default" aria-hidden="true" type="button">Yes</button>';
			htmlCode+='<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">No</button>';
		htmlCode+='</div>';
		
		$('#restoreQcModalBody').html(htmlCode);
		//$('#restoreQcModalTitle').text("Something went wrong , please contact admin !");
		$('#restoreQcModal').modal('show');
	}
$(document).on('click',"#restoreAllQcCheckBox",function(){
    $('.restoreQcCheckBox').prop('checked', $(this).is(':checked'));
  });

$(document).on('click',".restoreQcCheckBox",function(){
    if($('.restoreQcCheckBox:checked').length == $('.restoreQcCheckBox').length) {
      $('#restoreAllQcCheckBox').prop('checked', true);
    }else {
      $('#restoreAllQcCheckBox').prop('checked', false);
    }
});

var qcPolaritySetToUpdate=new Hashtable();
function pushNewPolarity(obj,qcId){
	var polarity=$(obj).val().toLowerCase();
	var percentage=$(obj).find(':selected').data('percentage');
	var reviewSiteContentId=$(obj).find(':selected').data('reviewsitecontentid');
	
	qcPolaritySetToUpdate.put(qcId,{'id':qcId,'reviewSiteContentId':reviewSiteContentId,'polarity':polarity,'sentimentScore':percentage});
	
	var txt=percentage+"% ";
	$('#newPolarityScoreSpan_'+qcId+'').html(txt);
}

function updatePolarity(reviewSiteContentId){
	 
	 var qcPolarityListToUpdateTemp=[];
	 var qcPolarityListToUpdate=qcPolaritySetToUpdate.values();
	 for(var i=0;i<qcPolarityListToUpdate.length;i++){
		 if(qcPolarityListToUpdate[i].reviewSiteContentId==reviewSiteContentId){
			 qcPolarityListToUpdateTemp.push(qcPolarityListToUpdate[i]);
			 qcPolaritySetToUpdate.remove(qcPolarityListToUpdate[i].id);
		 }
	 }
	// console.log(qcPolaritySetToUpdate.values());
	 if(qcPolarityListToUpdateTemp.length==0){
		 updateMention(reviewSiteContentId);
	 }
	 else{
		 $.ajax({
				type:"POST",
				url:"../qualityControl/updatePolarityForAdmin.htm",
				contentType:"application/json",
				data:JSON.stringify(qcPolarityListToUpdateTemp),
				success:function(response){
					if(response.status="UPDATE_SUCCESS"){
						updateMention(reviewSiteContentId);
					}else{
						/*$('#successModalTitle').text("Error");
						$('#successModalText').text("Update Polarity Failed.");
						$('#successModal').modal('show');*/
					}
					
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }
}
var changedMentionsSetToUpdate=new Hashtable();
function pushChangedMention(qcId,reviewId){
	$('#addReferenceErrorDiv').html('');
	$('#addReferenceErrorDiv').hide();
	var qcKpiTag=null;
	if (!$("input[name='mentionRadio']:checked").val()) {
	   $('#successModalTitle').text("Alert");
	   $('#successModalText').text("Please select option.");
	   $('#successModal').appendTo("body").modal('show');
	   $("#successModal").css("z-index", "1500");
	}
	else {
		loadingForDashBoard();
		var radioValue=$("input[name=mentionRadio]:checked").val();
		if(radioValue=='oldMention'){
			var keywordId=$('#oldMentionOption option:selected').val();
			var mention=$('#oldMentionOption option:selected').text();
			var oldMentionName = $('#qcDiv_'+qcId+'_'+reviewId+'_mention').val();
			var JSONObject = {'tableIndex':qcId,'newValue':mention,'oldValue':oldMentionName};
			$.ajax({
				type:"POST",
				url:"../logReport/updateQcMention.htm",
				data:JSON.stringify(JSONObject),
				contentType:"application/json",
				success:function(response){
					qcKpiTag={'id':qcId,'keywordId':keywordId,'reviewSiteContentId':reviewId};
					changedMentionsSetToUpdate.put(qcId,qcKpiTag);
					var flagForMention = convertToString("MENTION");
					/*var tempHtml='<a  style="color: rgb(0,0,255)" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')">'+mention+'</a>';
					$('#mention_'+qcId).html(tempHtml);
					*/
					//Sravan
					var tempHtml= '<a id="qcId_'+qcId+'_'+mentionFlag+'" href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
					  tempHtml+=mention;
					tempHtml+= '</a>';
					
					tempHtml+= '<ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">';
						tempHtml+= '<div class="QC-page-arrow-up"></div>';
						tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')" href="javascript:void(0);">Change Reference</a></li>';
						tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addFlag('+flagForMention+','+qcId+','+keywordId+')">Flag Reference</a></li>';
					tempHtml+= '</ul>';
					
					tempHtml+='<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_updatedKeywordId'+'"   value='+keywordId+'>';
					
					$('#mention_'+qcId).html(tempHtml);
					showOldMentionToolTip(qcId,reviewId);
					$('#changeReferenceModal').modal('hide');
					unloadingForDashBoard();
				},error:function(response){
					jqueryPostError(response);
				}
			});
			return false;
			//console.log(changedMentionsSetToUpdate.values());
		}
		else{
			var mention=$('#newMentionInput').val();
			if($.trim(mention)==""){
				$('#successModalTitle').text("Alert");
				$('#successModalText').text("Please enter reference name.");
				$('#successModal').modal('show');
				unloadingForDashBoard();
				return;
			}
			keyword={'mention':mention,'qcId':qcId};
			
			$.ajax({
				type:"POST",
				url:"../qualityControl/saveMentionForAdmin.htm",
				contentType:"application/json",
				data:JSON.stringify(keyword),
				success:function(response){
					if(response.status=="SAVE_SUCCESS"){
						var newlyCreatedkeyword=response.successObject.keyword;
						var keywordId=newlyCreatedkeyword.id;
						var mention=newlyCreatedkeyword.mention;
						var nlpQueryName=newlyCreatedkeyword.nlpQueryName;
						qcKpiTag={'id':qcId,'keywordId':keywordId,'reviewSiteContentId':reviewId};
						changedMentionsSetToUpdate.put(qcId,qcKpiTag);
						//keywordMasterList.push({'id':keywordId,'mention':mention,'nlpQueryName':nlpQueryName});
						var tempHtml = "";
						var flagForMention = convertToString("MENTION");
						var tempHtml = "";
						tempHtml+=			'<a id="qcId_'+qcId+'_'+mentionFlag+'" href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">'+mention+'</a>';
						tempHtml+=				'<ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">';
						tempHtml+=					'<div class="QC-page-arrow-up"></div>';
						tempHtml+=					'<li role="presentation"><a role="menuitem" tabindex="-1"  onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')">Change Reference</a></li>';
						tempHtml+=					'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addFlag('+flagForMention+','+qcId+','+keywordId+')">Flag</a></li>';
						tempHtml+=				'</ul>';
						$('#mention_'+qcId).html(tempHtml);
						showOldMentionToolTip(qcId,reviewId);
						$('#changeReferenceModal').modal('hide');
						showAlertModal("Reference", "Reference Changed Successfully");
						unloadingForDashBoard();
					}else if(response.status=="SAVE_ERROR"){
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+keyword.mention+" "+response.errorMessage+'';
						$('#addReferenceErrorDiv').append(errorMessage);
						$('#addReferenceErrorDiv').show(600);
						unloadingForDashBoard();
					}else{
						showAlertModal("Error", "Error In Saving");
					}
					//console.log(changedMentionsSetToUpdate.values());
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
			});
		}
		//$('#changeReferenceModal').modal('hide');
	}
}
function viewReviewSitesContent(orgIdRadio){
	 $('#wrapper').mask('Loading...');
	 $('#leftNavigation,#header').mask();
	
	 var f = $('#altFromDate').val().split(/[.,\/ -]/);
	 var newF=f[2]+"-"+f[0]+"-"+f[1];
	 
	 var t = $('#altToDate').val().split(/[.,\/ -]/);
	 var newT=t[2]+"-"+t[0]+"-"+t[1];
	 
	 var startDate=""+newF;
	 var endDate=""+newT;
	 var organizationId;
	 if(orgIdRadio!=0){
		 organizationId=orgIdRadio;
	 }else{
		 organizationId=$('#organizationName').val();
	 }
	 var selected = $('#organizationName').find('option:selected');
	 var clientId = $("input[name=orgRadio]:checked").val();
	 var sortBy = $('#sortSelectOption option:selected').val();
	 $('#loadMaskDiv').mask();
	 $.post( '../qualityControl/listReviewSitesContentUI.htm',{'clientId':clientId,'startDate':startDate,'endDate':endDate,'organizationId':clientId,'sortBy':sortBy}, function( response ) {
		// $('#loadMaskDiv').unmask();
		if(response.status='LIST_SUCCESS'){
			$('#reviewSitesContentListDiv').empty();
			/* var reviewSitesContentList=response.successObject.reviewSitesContentUIList;*/
			/* for search purpose */
			normalReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));
			filteredReviewsDuplicateResponseObject = null;
			 /**************************pagination code*******************************/
			 var totalReviews = response.successObject.reviewSitesContentUIList;
			 var divId="reviewSitesContentListDiv";
			 pagination(totalReviews,4,divId,response);
			 /**************************pagination code*******************************/
		}
	 });
}
function sortReview(){
	viewSortedReviewSitesContent();
}
function viewSortedReviewSitesContent(){
	 $('#wrapper').mask('Loading...');
	 $('#leftNavigation,#header').mask();
	
	 var f = $('#altFromDate').val().split(/[.,\/ -]/);
	 var newF=f[2]+"-"+f[0]+"-"+f[1];
	 
	 var t = $('#altToDate').val().split(/[.,\/ -]/);
	 var newT=t[2]+"-"+t[0]+"-"+t[1];
	 
	 var startDate=""+newF;
	 var endDate=""+newT;
	 var organizationId=$('#organizationName').val();
	 var selected = $('#organizationName').find('option:selected');
	 //var clientId = selected.data('clientId');
	 var clientId = $("input[name=orgRadio]:checked").val();
	 var sortBy = $('#sortSelectOption option:selected').val();
	 $('#loadMaskDiv').mask();
	 $.post( '../qualityControl/listReviewSitesContentUI.htm',{'sortBy':sortBy,'clientId':clientId,'startDate':startDate,'endDate':endDate,'organizationId':clientId}, function( response ) {
		 $('#loadMaskDiv').unmask();
		if(response.status='LIST_SUCCESS'){
			$('#reviewSitesContentListDiv').empty();
			/* for search purpose */
			sortedReviewsDuplicateResponseObject = JSON.parse(JSON.stringify(response));
			 /**************************pagination code*******************************/
			 var totalReviews = response.successObject.reviewSitesContentUIList;
			 var divId="reviewSitesContentListDiv";
			 pagination(totalReviews,4,divId,response);
			 /**************************pagination code*******************************/
		}
	 });
}

function pagination(reviews, countPerPage, divId,response){
	
		var pages = 0;
		if(reviews.length % countPerPage == 0 && reviews.length > 0){
		    pages = reviews.length/countPerPage;
		}else{
		    pages = reviews.length/countPerPage+1;
		}
		
		$('#page-selection').bootpag({
		  total: pages,
		  page: 1,
		  maxVisible: 10,
		    wrapClass: 'pagination',
		    activeClass: 'active',
		    disabledClass: 'active',
		    nextClass: 'next',
		    prevClass: 'prev',
		    lastClass: 'last',
		    firstClass: 'first',
		    href: "javascript:scrollDown($('#wrapper'));"
		}).on('page', function(event, num){
			      	var start = (num-1)*countPerPage;
			      	var end = num*countPerPage;
			      	if(end > reviews.length){
			      		end = reviews.length;
			      	}
				    //paint reviews
				    var html = "";
				    /* for(var i=start;i<end;i++){
				        html = html+reviews[i]+"<br/>";
				    }   */
				    var successObject = {'reviewSitesContentUIList' : response.successObject.reviewSitesContentUIList.slice(start,end),
				    		'qcList':response.successObject.qcList,
				    		'logReports':response.successObject.logReports
							};
				    var response2 = {'successObject' : successObject };
				    html = listReviewStatusResponse(response2);
				    $('#'+divId).html(html);
				    $('#reviewsListForm').show();
				    
		 	});
		
			/*****************************initializatio of pagination*****************************/
			var successObject = {
				'reviewSitesContentUIList' : response.successObject.reviewSitesContentUIList.slice(0,4),
				'qcList':response.successObject.qcList,
				'logReports':response.successObject.logReports
			};
			var response2 = {
				'successObject' : successObject
			};
			var html = listReviewStatusResponse(response2);
			$('#reviewSitesContentListDiv').html(html);
			 $('#reviewsListForm').show();
			 $('#leftNavigation,#wrapper,#header').unmask();
			/* $(function() {
				 $( ".queries" ).autocomplete({
				 source: keywordsList
				 });
			 });*/
			/***************************end of initialization************************************/
}
/************************************************************************************************************************
 ************************************************Nitesh*************************************************************
 **************************************************************************************************************************/
/****************************************************************************************************************************/	
var kpiTagSentimentAnalysisListToDelete=[];
function pushQcForDelete(selectedQcId,reviewSiteContentId){
	 $('#addDeleteQcCommentErrorDiv').hide();
	 $('#addDeleteQcCommentErrorDiv,#deleteQcCommentModalTitle,#deleteQcCommentModalBody,#deleteQcCommentModalFooter').html('');
	 $('#deleteQcCommentModalTitle').append('Enter Reason For QC ID:'+selectedQcId);
	 var html = "";
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addDeleteQcCommentErrorDiv">';
	 html+=	'</div>';
    html+=	'<div class="form-group">';
    html+=	'<label for="message-text" class="control-label">Please Select Reason</label>';
    html+='<select id="deleteQcReasonDropDown" class="form-control" style="width:auto" onchange="selectDeleteQcReason('+selectedQcId+')">';
    html+=		'<option>Incorrect Mapping</option>';
    html+=		'<option>Other</option>';
    html+=	'</select>';
    html+=	'</div>';
    html+=	'<div class="form-group" style="display:none;" id="deleteQcReasonDiv_'+selectedQcId+'">';
    html+=	'<label for="message-text" class="control-label">Enter Reason</label>';
    html+=	'<textarea class="form-control" maxLength=100 id="deleteQcComment_'+selectedQcId+'"></textarea>';
    html+=	'</div>';
    html+=	'</form>';
    $('#deleteQcCommentModalBody').append(html);
    $('#deleteQcCommentModalFooter').append('<button type="button" class="btn btn-primary" onclick="deleteQcWithComment('+selectedQcId+","+reviewSiteContentId+')">Yes</button>');
    $('#deleteQcCommentModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
    $('#deleteQcCommentModal').modal('show');
}

function selectDeleteQcReason(qcId){
	 var value = $('#deleteQcReasonDropDown option:selected').text();
	 if(value=="Other"){
		 $('#deleteQcReasonDiv_'+qcId).show(600);
	 }else{
		 $('#deleteQcReasonDiv_'+qcId).hide(600);
		 $('#addDeleteQcCommentErrorDiv').hide();
		 $('#addDeleteQcCommentErrorDiv').html('');
	 }
	 
}
function deleteQcWithComment(selectedQcId,reviewSiteContentId){
	 $('#addDeleteQcCommentErrorDiv').hide();
	 $('#addDeleteQcCommentErrorDiv').html('');
	 loadingForDashBoard();
	 var value = $('#deleteQcReasonDropDown option:selected').text();
	 var deletedQcComment = "";
	 if(value!="Other"){
		 deletedQcComment = value;
	 }else{
		  deletedQcComment = $.trim($('#deleteQcComment_'+selectedQcId).val());
	 }
	 if(deletedQcComment!=""){
		 kpiTagSentimentAnalysisListToDelete.push({'id':selectedQcId,'reviewSiteContentId':reviewSiteContentId,'deletedReason':deletedQcComment});
		 var _kpiTagSentimentAnalysisListToDelete=[];
		 _kpiTagSentimentAnalysisListToDelete.push({'id':selectedQcId,'reviewSiteContentId':reviewSiteContentId,'deletedReason':deletedQcComment});
		 $.ajax({
				type:"POST",
				url:"../qualityControl/deleteStagingQc.htm",
				contentType:"application/json",
				data:JSON.stringify(_kpiTagSentimentAnalysisListToDelete),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#qcDiv_'+selectedQcId+'_'+reviewSiteContentId).addClass("disabledbutton");
						$('#deleteQcCommentModal').modal('hide');
						showAlertModal("Success","QC Deleted Successfully");
						unloadingForDashBoard();
					}else{
					/*	$('#successModalTitle').text("Error");
						$('#successModalText').text("Deleting staging qc failed.");
						$('#successModal').modal('show');*/
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }else{
		 $('#addDeleteQcCommentErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Reason');
		 $('#addDeleteQcCommentErrorDiv').show(600);
		 unloadingForDashBoard();
	 }
	return false;
}

 
 
 
 function deleteQc(reviewSiteContentId){
	
	 var kpiTagSentimentAnalysisListToDeleteTemp=[];
	 var kpiTagSentimentAnalysisListToDeleteDuplicate=[];
	 for(var i=0;i<kpiTagSentimentAnalysisListToDelete.length;i++){
		 if(kpiTagSentimentAnalysisListToDelete[i].reviewSiteContentId==reviewSiteContentId){
			 kpiTagSentimentAnalysisListToDeleteTemp.push(kpiTagSentimentAnalysisListToDelete[i]);
		 }else{
			 kpiTagSentimentAnalysisListToDeleteDuplicate.push(kpiTagSentimentAnalysisListToDelete[i]);
		 }
	 }
	 kpiTagSentimentAnalysisListToDelete=kpiTagSentimentAnalysisListToDeleteDuplicate;
	 
	 if(kpiTagSentimentAnalysisListToDeleteTemp.length==0){
		 restoreQcForReview(reviewSiteContentId);
	 }else{
		 $.ajax({
				type:"POST",
				url:"../qualityControl/deleteQcForAdmin.htm",
				contentType:"application/json",
				data:JSON.stringify(kpiTagSentimentAnalysisListToDeleteTemp),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						for(var i=0;i<kpiTagSentimentAnalysisListToDeleteTemp.length;i++){
							var qcId=kpiTagSentimentAnalysisListToDeleteTemp[i].id;
							 $('#qcDiv_'+qcId+'_'+reviewSiteContentId).hide();
						}
						kpiTagSentimentAnalysisListToDelete=[];
						restoreQcForReview(reviewSiteContentId);
					}else{
						/*$('#successModalTitle').text("Error");
						$('#successModalText').text("Delete Qc Failed.");
						$('#successModal').modal('show');*/
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }
 }

 function listReviewStatusResponse(response) {
	 reviewIds = [];
	 	var reviewSitesContentList=response.successObject.reviewSitesContentUIList;
	 	var qcList = response.successObject.qcList;
		var map = [];
		$.each(qcList,function(index,value){
			var qcId = value.qcId;
			var flaggedFor = value.flaggedFor;
			map.push({'qcId':qcId,'flaggedFor':flaggedFor,'flagComment':value.flagComment});
		});
	 	
		$('#reviewSitesContentListDiv').html('');
		var tempHtml = "";
		if (reviewSitesContentList.length > 0) {
			 for(var i=0;i<reviewSitesContentList.length;i++){
				 var reviewTitle=reviewSitesContentList[i].reviewTitle;
				 var flagStatus=reviewSitesContentList[i].flagStatus;
				 var highlightedReviewContent=reviewSitesContentList[i].highlightedReviewContent;
				 var id=reviewSitesContentList[i].id;
				 var sourceName=reviewSitesContentList[i].sourceName;
				 var reviewTime=reviewSitesContentList[i].reviewTime;
				 var reviewStatus=reviewSitesContentList[i].reviewStatus;
				 var sourceId=reviewSitesContentList[i].contentSourceId;
				 var kpiTagSentimentAnalysisUIList=reviewSitesContentList[i].kpiTagSentimentAnalysisUIList;
				 var phrasesList = reviewSitesContentList[i].reviewPhraseStagings;
				 /****************Hidden Value for review status*********************************************/
				 
				 
				 tempHtml+='<div class="row col-xs-12">';
				 tempHtml+=	'<input type="hidden" value='+reviewStatus+'  id="review_'+id+'">';
				    if(reviewStatus=="DELETED"){
				    	tempHtml+=	'<div id="reviewContentDiv_'+id+'" class="col-xs-12 SingleQCReviewList disabledbutton" style="margin-left: 10px;">';
				    }
				    else{
				    	tempHtml+=	'<div id="reviewContentDiv_'+id+'" class="col-xs-12 SingleQCReviewList" style="margin-left: 10px;">';
				    }
				    
					tempHtml+= '<div class="col-xs-12">';
					
					tempHtml+= '<div class="flagFunction" style="float:right;">';
						
					 	if(flagStatus!=null && flagStatus!=""){
						 	tempHtml+='<input type="button" class="btn btn-flag float-right flagedReview" onclick="reviewFlag('+id+')">';
						 }
						 else{
							 tempHtml+='<input type="button" class="btn btn-flag float-right" onclick="reviewFlag('+id+')">';
						 }
						
					tempHtml+= '</div>'; //flag function
								
					tempHtml+= '<div class="float-left marginRight5">';
					   if(reviewStatus=="NEW" || reviewStatus=="PENDING"){
					    	 tempHtml+=	'<input type="checkbox"  onclick="pushReviewForBulk('+id+',this)">';
					    }
				   tempHtml+= '</div>';
				   tempHtml+= '<div class="float-left marginRight20">';
				   		tempHtml+= '<span class="SmallDarkGreyHeader">';
				   			tempHtml+= 'Review ID:';
				   		tempHtml+= '</span>';
				   		tempHtml+= '<span class="VerySmallBoldGreyContent">';
					   		if(reviewSitesContentList[i].hId!=null && reviewSitesContentList[i].hId!=""){
						    	 tempHtml+=	reviewSitesContentList[i].hId;
						    }else{
						    	tempHtml+=id;
						    }
				   		tempHtml+= '</span>';
				   	tempHtml+= '</div>';
				   	tempHtml+= '<div class="float-left marginRight20">';
				   		tempHtml+= '<span class="SmallDarkGreyHeader">';
				   			tempHtml+= 'Source:';
				   		tempHtml+= '</span>';
				   		tempHtml+= '<span class="VerySmallBoldGreyContent">';
				   			tempHtml+= sourceName;
				   		tempHtml+= '</span>';
				   	tempHtml+= '</div>';
				   	tempHtml+= '<div class="float-left marginRight20">';
				   		tempHtml+= '<span class="SmallDarkGreyHeader">';
				   			tempHtml+= 'Review Date:';
				   		tempHtml+= '</span>';
				   		tempHtml+= '<span class="VerySmallBoldGreyContent">';
				   			tempHtml+= moment(reviewTime).format("DD MMMM YYYY");
				   		tempHtml+= '</span>';
				   	tempHtml+= '</div>';
				   	tempHtml+= '<div class="float-left marginRight20">';
				   		
					   		if(reviewStatus=='PENDING'){
					   			tempHtml+= '<span class="PendingReviews">';
						    	 tempHtml+=	'Pending';
						    	 tempHtml+= '</span>';
						    }
						    if(reviewStatus=='APPROVED'){
						    	tempHtml+= '<span class="ApprovedReviews">';
						    	 tempHtml+=	'Approved';
						    	 tempHtml+= '</span>';
						    }
						    if(reviewStatus=='DELETED'){
						    	tempHtml+= '<span class="DeletedReviews">';
						    	 tempHtml+=	'Deleted';
						    	 tempHtml+= '</span>';
						    }
						    if(reviewStatus=='NEW'){
						    	tempHtml+= '<span class="NewReviews">';
						    	 tempHtml+=	'New';
						    	 tempHtml+= '</span>';
						    }
				   		
				   	tempHtml+= '</div>';
				   tempHtml+= '</div>';
				    
					tempHtml+=	'<div class="col-xs-12">';
					if(reviewTitle!=null){	
						tempHtml+=	'<p class="MediumBoldGreyContent">'+reviewTitle+'</p>';
					}
						tempHtml+=	'<p class="MediumNormalGreyContent">';
							tempHtml+=highlightedReviewContent;
						tempHtml+=	'</p>';
					tempHtml+=	'</div>';
					
					
					for(var k=0;k<kpiTagSentimentAnalysisUIList.length;k++){
						var keywordId=kpiTagSentimentAnalysisUIList[k].keywordId;
						var qcId=kpiTagSentimentAnalysisUIList[k].id;
						var departmentName=kpiTagSentimentAnalysisUIList[k].departmentName;
						var kpiName=kpiTagSentimentAnalysisUIList[k].kpiName;
						var keywordName=kpiTagSentimentAnalysisUIList[k].keywordName;
						var kpiTagSentimentAnalysisUI=kpiTagSentimentAnalysisUIList[k];
						var deletedStatus=kpiTagSentimentAnalysisUIList[k].deletedStatus;
						var departmentId = kpiTagSentimentAnalysisUIList[k].departmentId;
						var kpiId = kpiTagSentimentAnalysisUIList[k].kpiId;
						var sourceId = kpiTagSentimentAnalysisUIList[k].sourceId;
						
						/*tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="row form-group col-sm-12" >';
							var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId);
							tempHtml+=returnHtml;
						tempHtml+='</div>';*/
						if(deletedStatus==false){
							tempHtml+= '<div class="row col-xs-12">';
								tempHtml+= '<div style="float:right">';
									tempHtml+= '<button onclick ="showRestoreQcModal('+qcId+','+id+')" type="button" class="btn btn-default btn-xs revertQC">';
										tempHtml+= ' <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Revert back';
									tempHtml+= '</button>';
									tempHtml+= '</div>';
								tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="QCMappingResults col-xs-12" >';
								var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
										tempHtml+=returnHtml;
								tempHtml+='</div>';
							tempHtml+= '</div>';
							
						}else{
							tempHtml+= '<div class="row col-xs-12">';
								tempHtml+= '<div style="float:right">';
									tempHtml+= '<button onclick ="showRestoreQcModal('+qcId+','+id+')" type="button" class="btn btn-default btn-xs revertQC">';
										tempHtml+= ' <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Revert back';
									tempHtml+= '</button>';
								tempHtml+= '</div>';
							
								tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="QCMappingResults col-xs-12 disabledbutton" >';
								var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
										tempHtml+=returnHtml;
								tempHtml+='</div>';
							tempHtml+='</div>';
						}
						
						/*tempHtml+='<div class="col-sm-1">';
							tempHtml+='<input class="btn btn-primary"  onclick ="showRestoreQcModal('+qcId+','+id+')" value="R" type="button">';
						tempHtml+='</div>';*/
					}
					tempHtml+=	appendPhrases1(phrasesList,id);
					/****************************Suggested Phrases Div***********************************************/
					tempHtml+= appendSuggestedPhrases1(phrasesList, id);
					
					
					
					tempHtml+='<div class="row col-xs-12">';
						tempHtml+='<div class="QCUpdate form-group input-group form-inline col-xs-12">';
							tempHtml+='<button id="" class="btn btn-primary btn-sm float-right" onclick ="approve('+id+')" type="button"> Approve</button>';
							tempHtml+='<button id="" class="btn btn-default btn-sm float-right" onclick ="deleteReview('+id+')" type="button"> Delete</button>';
							tempHtml+='<button id="" class="btn btn-default btn-sm float-right" onclick ="showAddQCModal('+id+','+sourceId+','+reviewTime+')" type="button"> Add New Mapping</button>';
							//tempHtml+='<button id="" class="btn btn-default btn-sm float-right" onclick ="restoreStagingForReview('+id+')" type="button"> Restore Review</button>';
						tempHtml+='</div>';
					tempHtml+='</div>';
					
					tempHtml+='</div>';   //review div closed
					
					tempHtml+='<div class="float-right">';
						tempHtml+='<button id="" class="btn btn-default btn-sm restoreStagingForReview" onclick ="restoreStagingForReview('+id+')" type="button"> Restore Review</button>';
					tempHtml+='</div>';
					 /*****************************************Log Reports**********************************************************************************/
					 tempHtml+= '<div class="QCPageLogReport col-xs-12">';
					// tempHtml+= '<div class="QCPageLogReport">';
					 tempHtml+= 	'<div class="panel panel-default">'
						 tempHtml+=		'<div class="panel-heading">';
					 		tempHtml+=		'<div class="panel-title float-left VerySmallBoldGreyContent">Log Report';
					 			  tempHtml+='</div>';
					 			tempHtml+=	'<a class="float-right"data-toggle="collapse" data-parent="#accordion" href="#collapseOne">';
					 			reviewIds.push(id);
					 				tempHtml+=	'<span class="glyphicon glyphicon-chevron-down" aria-hidden="true" onclick="showLogs('+id+')" id="logReportSpanId"></span>';
					 			tempHtml+=  '</a>';
					 		 tempHtml+='</div>';
					 		 tempHtml+='<div id="collapseOne_'+id+'" class="panel-collapse collapse">';
					 		 	tempHtml+='<div class="panel-body">';
							 		 	tempHtml+='<ul>';
											/* var logReports = response.successObject.logReports;
											 console.log(logReports);
											 $.each(logReports,function(index,log){
												 var reviewId = log.reviewId;
												 if(id==reviewId){
													 tempHtml+=	 '<li>'+log.log+'</li>';
												 }
											 });*/
									   tempHtml+='</ul>';
					           tempHtml+= '</div>';  //body panel
					       tempHtml+= '</div>';
				       tempHtml+= '</div>'; 
					tempHtml+= '</div>';   //QCPageLogReport
				tempHtml+= '</div>';   //just before above
					 
				//tempHtml+= '</div>';  //1 before review
					//tempHtml+='<hr>';
			 }
			 
			
		} else {
			tempHtml += '<font style="color:red">No Records Found </font>';
		}
		return tempHtml;
}
 
 
 function showLogs(id){
		$('#collapseOne_'+id).html('');
		var organizationId = $("input[name=orgRadio]:checked").val();
		$.get("../logReport/list.htm?reviewId="+id,function(response){
			if(response.status=="SUCCESS"){
				var logReports = response.successObject.logReports;
				var tempHtml = "";
				tempHtml+='<div class="panel-body">';
	 		 	tempHtml+='<ul>';
				 var logReports = response.successObject.logReports;
				 $.each(logReports,function(index,log){
					 var reviewId = log.reviewId;
					 if(id==reviewId){
						 tempHtml+=	 '<li>'+log.log+'</li>';
					 }
				 });
			   tempHtml+='</ul>';
            tempHtml+= '</div>';  //body panel
         $('#collapseOne_'+id).append(tempHtml);
         $('#collapseOne_'+id).toggle();
			}else{
				jqueryPostError(response);
			}
		},'json').fail(function(response){
			jqueryPostError(response);
		});
		return false;
	}
	
	


 function reviewFlag(id){
	 loadingForDashBoard();
	 $('#reviewFlagModalBody,#reviewFlagModalFooter').html('');
	 $('#reviewFlagCommentErrorDiv').hide();
	 $.get("../qualityControl/reviewFlag.htm?reviewId="+id,function(response){
		 var flagStatus = response.successObject.review.flagStatus;
		 var comment  = response.successObject.review.flagComment;
		 var flagStatusArray = [];
		 if(flagStatus!=null || flagStatus==""){
			  flagStatusArray = flagStatus.split(',');
		 }
		 var html = "";
		 html+=	'<form id="reviewFlagForm">';
		 /*********************************Error Div*********************************************************/
		 /************************Success Div****************************************************************/
		 html+=	'<div class="alert alert-success" style="display:none;"id="flagCommentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
		 html+=	'<div class="col-xs-12 form-horizontal">';
		 html+=	'<div id="flagChkDiv" class="form-group col-xs-10 row">';
		 
		 html+=	'<div class="col-xs-6">';
		
		 if(flagStatusArray.indexOf('DUPLICATE_REVIEW')!=-1){
			 html+=	'<label><input  type="checkbox" value="DUPLICATE_REVIEW" checked> Duplicate Review</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="DUPLICATE_REVIEW"> Duplicate Review</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		 
		 if(flagStatusArray.indexOf('DELETED_REVIEW')!=-1){
			 html+=	'<label><input  type="checkbox" value="DELETED_REVIEW" checked> Review deleted from source</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="DELETED_REVIEW"> Review deleted from source</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		
		 if(flagStatusArray.indexOf('INCORRECT_LANGUAGE')!=-1){
			 html+=	'<label><input  type="checkbox" value="INCORRECT_LANGUAGE" checked> Language not correct</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="INCORRECT_LANGUAGE"> Language not correct</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		
		 if(flagStatusArray.indexOf('OTHER')!=-1){
			 html+=	'<label><input type="checkbox" value="OTHER" checked> Other</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="OTHER"> Other</label>';
		 }
		
		 html+=	'</div>';
		 if(comment==null || comment==""){
			 html+=	'<input type="text" class="form-control input-sm" maxLength="250" placeholder="Enter Comment" id="reivewFlagComment">';
		 }else{
			 html+=	'<input type="text" class="form-control input-sm" maxLength="250" placeholder="Enter Comment" id="reivewFlagComment" value="'+comment+'">';
		 }
		 html+=	'</div>';
		 html+=	'</div>';
		 html+=	'</form>';
	     $('#reviewFlagModalBody').append(html);
		 $('#reviewFlagModalFooter').append('<button type="button" class="btn btn-primary" onclick="updateReviewFlag(reviewFlagForm,'+id+')">Save</button>');
		 alert("flagStatus :>"+flagStatus);
		 if(flagStatus!=null && flagStatus!=""){
			$('#reviewFlagModalFooter').append('<button type="button" class="btn btn-primary" onclick="removeReviewFlag('+id+')">Remove Flag</button>');
		 }
		 
		 $('#reviewFlagModal').modal('show');
		 unloadingForDashBoard();
	 },'json').fail(function(response){
		 jqueryPostError(response);
	 });
	 
	 return false;
	 
 }
 
 function removeReviewFlag(reviewId){
	 loadingForDashBoard();
	 var JSONObject = {'id':reviewId,'flagComment':"",'flagStatus':""};
	 $.post("../qualityControl/updateReviewFlag.htm",JSONObject,function(response){
		 if(response.status=="SUCCESS"){
			 $('#reviewFlagModal').modal('hide');
			 
			 var review=response.successObject.review;
			 var qcList=response.successObject.qcList;
			 var returnHtml=paintReviewDiv(review,qcList);
			 $("#reviewContentDiv_"+review.id).html(returnHtml);
			 if(review.reviewStatus=="DELETED"){
				$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
			 }
			 
			 unloadingForDashBoard();
			 
			 $('#successModalTitle').text("Success");
			 $('#successModalText').text("Flag removed Successfully.");
			 $('#successModal').modal('show');
		 }else{
			 jqueryPostError(response);
		 }
	 },'json').fail(function(response){
		 jqueryPostError(response);
	 });
 }
 
 function updateReviewFlag(form,reviewId){
	 loadingForDashBoard();
	 $('#reviewFlagCommentErrorDiv').hide();
	 var f = form.length;
	 var count = 0;
	 var array = [];
	 while(f--){
		if(form[f].type=="checkbox" && form[f].checked){
		if(form[f].value!="on"){
			var id = form[f].value;
			array.push(id);
		  }
		}
		count++;
	}
	 if(array.length==0){
		 $('#reviewFlagCommentErrorDiv').show(600);
		 unloadingForDashBoard();
		 return false;
	 }else{
		 var flagStatus = array.toString();
		 var reviewFlagComment = $('#reivewFlagComment').val();
		 var JSONObject = {'id':reviewId,'flagComment':reviewFlagComment,'flagStatus':flagStatus};
		 $.post("../qualityControl/updateReviewFlag.htm",JSONObject,function(response){
			 if(response.status=="SUCCESS"){
				 $('#reviewFlagModal').modal('hide');
				 
				 var review=response.successObject.review;
				 var qcList=response.successObject.qcList;
				 var returnHtml=paintReviewDiv(review,qcList);
				 $("#reviewContentDiv_"+review.id).html(returnHtml);
				 if(review.reviewStatus=="DELETED"){
					$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
				 }
				 
				 unloadingForDashBoard();
				 
				 $('#successModalTitle').text("Success");
				 $('#successModalText').text("Flag added Successfully.");
				 $('#successModal').modal('show');
			 }else{
				 jqueryPostError(response);
			 }
		 },'json').fail(function(response){
			 jqueryPostError(response);
		 });
		 return false;
	 }
	 
 }
 function paintReviewDiv(review,qcList){
		var tempHtml="";
		
		 var reviewTitle=review.reviewTitle;
		 var highlightedReviewContent=review.highlightedReviewContent;
		 var id=review.id;
		 var sourceName=review.sourceName;
		 var reviewTime=review.reviewTime;
		 var reviewStatus=review.reviewStatus;
		 var flagStatus=review.flagStatus;
		var sourceId=review.contentSourceId;
		 
		 var kpiTagSentimentAnalysisUIList=review.kpiTagSentimentAnalysisUIList;
		 var phrasesList = review.reviewPhraseStagings;

				    tempHtml+= '<div class="col-xs-12">';
					
					tempHtml+= '<div class="flagFunction" style="float:right;">';
						
					 if(flagStatus!=null && flagStatus!=""){
						 	tempHtml+='<input type="button" class="btn btn-flag float-right flagedReview" onclick="reviewFlag('+id+')">';
						 }
						 else{
							 tempHtml+='<input type="button" class="btn btn-flag float-right" onclick="reviewFlag('+id+')">';
						 }
					 
					tempHtml+= '</div>'; //flag function
								
					tempHtml+= '<div class="float-left marginRight5">';
					   if(reviewStatus=="NEW" || reviewStatus=="PENDING"){
					    	 tempHtml+=	'<input type="checkbox"  onclick="pushReviewForBulk('+id+',this)">';
					    }
				   tempHtml+= '</div>';
				   tempHtml+= '<div class="float-left marginRight20">';
				   		tempHtml+= '<span class="SmallDarkGreyHeader">';
				   			tempHtml+= 'Review ID:';
				   		tempHtml+= '</span>';
				   		tempHtml+= '<span class="VerySmallBoldGreyContent">';
					   		if(review.hId!=null && review.hId!=""){
						    	 tempHtml+=	review.hId;
						    }else{
						    	tempHtml+=id;
						    }
				   		tempHtml+= '</span>';
				   	tempHtml+= '</div>';
				   	tempHtml+= '<div class="float-left marginRight20">';
				   		tempHtml+= '<span class="SmallDarkGreyHeader">';
				   			tempHtml+= 'Source:';
				   		tempHtml+= '</span>';
				   		tempHtml+= '<span class="VerySmallBoldGreyContent">';
				   			tempHtml+= sourceName;
				   		tempHtml+= '</span>';
				   	tempHtml+= '</div>';
				   	tempHtml+= '<div class="float-left marginRight20">';
				   		tempHtml+= '<span class="SmallDarkGreyHeader">';
				   			tempHtml+= 'Review Date:';
				   		tempHtml+= '</span>';
				   		tempHtml+= '<span class="VerySmallBoldGreyContent">';
				   			tempHtml+= moment(reviewTime).format("DD MMMM YYYY");
				   		tempHtml+= '</span>';
				   	tempHtml+= '</div>';
				   	tempHtml+= '<div class="float-left marginRight20">';
				   		
					   		if(reviewStatus=='PENDING'){
					   			tempHtml+= '<span class="PendingReviews">';
						    	 tempHtml+=	'Pending';
						    	 tempHtml+= '</span>';
						    }
						    if(reviewStatus=='APPROVED'){
						    	tempHtml+= '<span class="ApprovedReviews">';
						    	 tempHtml+=	'Approved';
						    	 tempHtml+= '</span>';
						    }
						    if(reviewStatus=='DELETED'){
						    	tempHtml+= '<span class="DeletedReviews">';
						    	 tempHtml+=	'Deleted';
						    	 tempHtml+= '</span>';
						    }
						    if(reviewStatus=='NEW'){
						    	tempHtml+= '<span class="NewReviews">';
						    	 tempHtml+=	'New';
						    	 tempHtml+= '</span>';
						    }
				   		
				   	tempHtml+= '</div>';
				   tempHtml+= '</div>';
				    
					tempHtml+=	'<div class="col-xs-12">';
					if(reviewTitle!=null){	
						tempHtml+=	'<p class="MediumBoldGreyContent">'+reviewTitle+'</p>';
					}
						tempHtml+=	'<p class="MediumNormalGreyContent">';
							tempHtml+=highlightedReviewContent;
						tempHtml+=	'</p>';
					tempHtml+=	'</div>';
			
			
			var map = [];
			$.each(qcList,function(index,value){
				var qcId = value.qcId;
				var flaggedFor = value.flaggedFor;
				map.push({'qcId':qcId,'flaggedFor':flaggedFor,'flagComment':value.flagComment});
			});
			 	
			for(var k=0;k<kpiTagSentimentAnalysisUIList.length;k++){
				var keywordId=kpiTagSentimentAnalysisUIList[k].keywordId;
				var qcId=kpiTagSentimentAnalysisUIList[k].id;
				var departmentName=kpiTagSentimentAnalysisUIList[k].departmentName;
				var kpiName=kpiTagSentimentAnalysisUIList[k].kpiName;
				var keywordName=kpiTagSentimentAnalysisUIList[k].keywordName;
				var kpiTagSentimentAnalysisUI=kpiTagSentimentAnalysisUIList[k];
				var deletedStatus=kpiTagSentimentAnalysisUIList[k].deletedStatus;
				var departmentId = kpiTagSentimentAnalysisUIList[k].departmentId;
				var kpiId = kpiTagSentimentAnalysisUIList[k].kpiId;
				var sourceId = kpiTagSentimentAnalysisUIList[k].sourceId;
				/*var map = [];*/
				
				if(deletedStatus==false){
					tempHtml+= '<div class="row col-xs-12">';
						tempHtml+= '<div style="float:right">';
							tempHtml+= '<button onclick ="showRestoreQcModal('+qcId+','+id+')" type="button" class="btn btn-default btn-xs revertQC">';
								tempHtml+= ' <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Revert back';
							tempHtml+= '</button>';
							tempHtml+= '</div>';
						tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="QCMappingResults col-xs-12" >';
						var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
								tempHtml+=returnHtml;
						tempHtml+='</div>';
					tempHtml+= '</div>';
					
				}else{
					tempHtml+= '<div class="row col-xs-12">';
						tempHtml+= '<div style="float:right">';
							tempHtml+= '<button onclick ="showRestoreQcModal('+qcId+','+id+')" type="button" class="btn btn-default btn-xs revertQC">';
								tempHtml+= ' <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Revert back';
							tempHtml+= '</button>';
						tempHtml+= '</div>';
					
						tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="QCMappingResults col-xs-12 disabledbutton" >';
						var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
								tempHtml+=returnHtml;
						tempHtml+='</div>';
					tempHtml+='</div>';
				}
				
			}
			
			tempHtml+= appendPhrases1(phrasesList,id);
			/****************************Suggested Phrases Div***********************************************/
			tempHtml+= appendSuggestedPhrases1(phrasesList, id);
			
			tempHtml+='<div class="row col-xs-12">';
			tempHtml+='<div class="QCUpdate form-group input-group form-inline col-xs-12">';
				tempHtml+='<button id="" class="btn btn-primary btn-sm float-right" onclick ="approve('+id+')" type="button"> Approve</button>';
				tempHtml+='<button id="" class="btn btn-default btn-sm float-right" onclick ="deleteReview('+id+')" type="button"> Delete</button>';
				tempHtml+='<button id="" class="btn btn-default btn-sm float-right" onclick ="showAddQCModal('+id+','+sourceId+','+reviewTime+')" type="button"> Add New Mapping</button>';
			tempHtml+='</div>';
		tempHtml+='</div>';
		
		return tempHtml;
	}
 function paintQcDiv(qcId,reviewId,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId){
	 
	 	//console.log("<qcId>"+qcId+"<id>"+id+"<kpiTagSentimentAnalysisUI>"+kpiTagSentimentAnalysisUI+"<departmentName>"+departmentName+"<kpiName>"+kpiName+"<keywordName>"+keywordName+"<keywordId>"+keywordId+"<map>"+map.length+"<departmentId>"+departmentId+"<kpiId>"+kpiId+"<sourceId>"+sourceId);
	 	var flagForDepartment = convertToString("DEPARTMENT");
		var flagForKpi = convertToString("KPI");
		var flagForMentionCategory = convertToString("MENTIONCATEGORY");
		var flagForMention = convertToString("MENTION");
		var tempHtml="";
		
		tempHtml+= '<div class="QCMappingID row">';
			tempHtml+= '<div class="VerySmallBoldGreyContent float-left">';
							if(kpiTagSentimentAnalysisUI.qId!=null && kpiTagSentimentAnalysisUI.qId!=""){
								tempHtml+= 'Mapping ID:<span class="marginRight20">'+kpiTagSentimentAnalysisUI.qId+'</span>';
							}else{
								tempHtml+= 'Mapping ID:<span class="marginRight20">'+qcId+'</span>';
							}
			tempHtml+= '</div>';
			tempHtml+= '<div class="float-right">';
				/*tempHtml+= '<button onclick ="showRestoreQcModal('+qcId+','+id+')" type="button" class="btn btn-default btn-xs">';
					tempHtml+= ' <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Revert back';
				tempHtml+= '</button>';*/
				var reviewStatus = $('#review_'+reviewId).val();
				tempHtml+= '<button onclick="pushQcForDelete('+qcId+','+reviewId+')" type="button" class="btn btn-default btn-xs">';
					tempHtml+= '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete';
				tempHtml+= '</button>';
			tempHtml+= '</div>';
		tempHtml+= '</div>';
		
		tempHtml+= '<div class="QCMappingStyle">';
			tempHtml+= '<ul class="nav nav-pills" role="tablist">';
			
			//department start
			/*tempHtml+=	'<div  id="'+qcId+'">';*/
			  tempHtml+= '<li role="presentation" class="dropdown">';
					
				var tempQcId = 0;
				$.each(map,function(index,value){
					if(value.qcId==qcId && value.flaggedFor=="DEPARTMENT"&& value.flagComment!=null){
						tempQcId = value.qcId;
						tempHtml+= '<a id="qcId_'+qcId+'_'+departmentFlag+'_'+departmentId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">';
							tempHtml+=departmentName;
						tempHtml+= '</a>';
					}
				});
				if(tempQcId!=qcId){
					tempHtml+= '<a id="qcId_'+qcId+'_'+departmentFlag+'_'+departmentId+'" href="#"  class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">';
						tempHtml+=departmentName;
					tempHtml+= '</a>';
				}
				
				tempHtml+= '<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
							  tempHtml+= '<div class="QC-page-arrow-up"></div>';
							  tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1"  onclick="addFlag('+flagForDepartment+','+qcId+','+departmentId+')">Flag</a></li>';
				tempHtml+= '</ul>';
			tempHtml+= '</li>';
			
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_department_id'+'" value='+departmentId+'>';
		
		/*tempHtml+= '</div>';*/
			
			//department end
			
					
						
			//kpi start
			
			tempHtml+= '<li role="presentation" class="dropdown">';
					tempHtml+= '<i class="glyphicon glyphicon-chevron-right QCmappingArrow"></i>';
			tempHtml+= '</li>';
			tempHtml+= '<li role="presentation" class="dropdown">';
				
				tempQcId = 0;
				$.each(map,function(index,value){
					if(value.qcId==qcId && value.flaggedFor=="KPI"&& value.flagComment!=null){
						tempQcId = value.qcId;
						
						tempHtml+= '<a id="qcId_'+qcId+'_'+kpiFlag+'_'+kpiId+'"  href="#"  class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
							tempHtml+= kpiName;
						tempHtml+= '</a>';
					}
				});
				if(tempQcId!=qcId){
					tempHtml+= '<a id="qcId_'+qcId+'_'+kpiFlag+'_'+kpiId+'" href="#"  class="dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
						tempHtml+= kpiName;
					tempHtml+= '</a>';
				}
				
				tempHtml+= '<ul id="menu2" class="dropdown-menu" role="menu" aria-labelledby="drop5">';
					tempHtml+= '<div class="QC-page-arrow-up"></div>';
							  tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addFlag('+flagForKpi+','+qcId+','+kpiId+')">Flag</a></li>';
				tempHtml+= '</ul>';
			tempHtml+= '</li>';
			
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_kpi_id'+'" value='+kpiId+'>';
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_sourceId'+'" value='+sourceId+'>';
			
			//kpi end
			//start of keyword
			tempHtml+= '<li role="presentation" class="dropdown">';
				tempHtml+= '<i class="glyphicon glyphicon-chevron-right QCmappingArrow"></i>';
			 tempHtml+= '</li>';
			 tempHtml+= '<li role="presentation" class="dropdown">';
				
							tempQcId = 0;
							$.each(map,function(index,value){
								if(value.qcId==qcId && value.flaggedFor=="MENTIONCATEGORY"&& value.flagComment!=null){
									tempQcId = value.qcId;
									tempHtml+= '<a id="qcId_'+qcId+'_'+mentionCategoryFlag+'_'+keywordId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
										tempHtml+= keywordName;
									tempHtml+= '</a>';
									
								}
							});
							
							if(tempQcId!=qcId){
								tempHtml+= '<a id="qcId_'+qcId+'_'+mentionCategoryFlag+'_'+keywordId+'" href="#"  class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
									tempHtml+= keywordName;
								tempHtml+= '</a>';
							}
				
				tempHtml+= '<ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">';
							  tempHtml+= '<div class="QC-page-arrow-up"></div>';
							  tempHtml+= '<li role="presentation"><a role="menuitem" onclick="addFlag('+flagForMentionCategory+','+qcId+','+keywordId+')" tabindex="-1">Flag</a></li>';
				tempHtml+= '</ul>';
			tempHtml+= '</li>';
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_updatedKeywordId'+'" value='+keywordId+'>';
			 tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_mention'+'" value='+kpiTagSentimentAnalysisUI.mention+'>';
			
			//end of keyword
			
			// start of mention
		//tempHtml+='<span  id="mention_'+qcId+'">';
			tempHtml+= '<li role="presentation" class="dropdown">';
				tempHtml+= '<i class="glyphicon glyphicon-chevron-right QCmappingArrow"></i>';
			tempHtml+= '</li>';
			tempHtml+= '<li id="mention_'+qcId+'" role="presentation" class="dropdown">';
			
				tempQcId = 0;
				$.each(map,function(index,value){
					if(value.qcId==qcId && value.flaggedFor=="MENTION"&& value.flagComment!=null){
						tempQcId = value.qcId;
						tempHtml+= '<a a id="qcId_'+qcId+'_'+mentionFlag+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
						  tempHtml+=kpiTagSentimentAnalysisUI.mention;
						tempHtml+= '</a>';
						
						tempHtml+= '<ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">';
							tempHtml+= '<div class="QC-page-arrow-up"></div>';
							tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')" href="javascript:void(0);">Change Reference</a></li>';
							tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addFlag('+flagForMention+','+qcId+','+qcId+')">Flag Reference</a></li>';
						tempHtml+= '</ul>';
						  
					}
				});
				if(tempQcId!=qcId){
						tempHtml+= '<a id="qcId_'+qcId+'_'+mentionFlag+'" href="#" class="dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
						  tempHtml+=kpiTagSentimentAnalysisUI.mention;
						tempHtml+= '</a>';
						
						tempHtml+= '<ul id="menu3" class="dropdown-menu" role="menu" aria-labelledby="drop6">';
							tempHtml+= '<div class="QC-page-arrow-up"></div>';
							tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')" href="javascript:void(0);">Change Reference</a></li>';
							tempHtml+= '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addFlag('+flagForMention+','+qcId+','+qcId+')">Flag Reference</a></li>';
						tempHtml+= '</ul>';
					
				}
				
				
			tempHtml+= '</li>';
		//tempHtml+='</span>';
			//end of mention
			
		tempHtml+= '</ul>';   //tab ul closed
		tempHtml+= '</div>';   //qc style div closed
		
		
		/*******************************************Keywords Div******************************************************************************/
		tempHtml+=	'<div class="QCmappingKeywords" id="qc_id_'+qcId+'_keywordsDiv">';
		tempHtml+=		'<ul class="nav nav-pills tags" role="tablist">';
		tempHtml+=		'<li class="">Keywords:</li>';
		/****************************For Loop Should Stars Here*************************************************************************************/
		var qcKeywords = kpiTagSentimentAnalysisUI.qcKeywords;
	//	console.log(qcKeywords);
		$.each(qcKeywords,function(index,value){
			var keyword  = value.keyword;
			var id = value.id;
			var qcId = value.qcId;
			var updatedUserId = value.updatedUserId;
			var isDeleted  = value.deleted;
			var createdUserId = value.createdUserId;
			tempHtml+=			'<li role="presentation" class="dropdown">';
			if(updatedUserId!=null && isDeleted==true){
				tempHtml+=     		'<li  class="dropdown-toggle keywordsTags disabled" style="background:#555">'+keyword+'</li>';
			}else if(createdUserId==null){
				tempHtml+=     		'<a id="qcId_'+qcId+'_keywordId_'+id+'" href="#" class="dropdown-toggle keywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+keyword+'</a>';
			}else{
				tempHtml+=     		'<a id="qcId_'+qcId+'_keywordId_'+id+'" href="#" class="dropdown-toggle keywordsTags newkeywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+keyword+'</a>';

			}
			tempHtml+=			'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4"><div class="QC-page-arrow-up"></div> <li role="presentation"><a role="menuitem" tabindex="-1" onclick="removeQcKeyword('+id+','+qcId+','+reviewId+')">Remove</a></li>';
			tempHtml+=			'</ul>';
			
		});
		tempHtml+=		'<li role="presentation" class="dropdown">';
		tempHtml+=		'<a id="drop4" href="#" class="dropdown-toggle AddkeywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true" onclick=addNewQcKeyword('+qcId+','+reviewId+')>+</a>';
		tempHtml+=		'</li>';
		tempHtml+=      '</ul>';
		tempHtml+=			'</div>';
		/*******************************************End Of Keywords Div******************************************************************************/
		
		
		
				//	<!--Mapping Polarity--->
		tempHtml+= '<div class="QCmappingPolarity">';
			tempHtml+= '<div class="float-left">';
					tempHtml+= 'Polarity Score: ';
			tempHtml+= '</div>';
			
			tempHtml+= '<div class="VerySmallBoldGreyContent float-left">';
					if(kpiTagSentimentAnalysisUI.sentimentScoreStr!=null){
						tempHtml+='<span id="newPolarityScoreSpan_'+qcId+'">'+kpiTagSentimentAnalysisUI.sentimentScoreStr+'% </span>';
						tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_sentimentScore'+'" value='+kpiTagSentimentAnalysisUI.sentimentScoreStr+'>';
					}else{
						tempHtml+='<span id="newPolarityScoreSpan_'+qcId+'">'+((kpiTagSentimentAnalysisUI.sentimentScore.toFixed(0))-2)+'% </span>';
						tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_sentimentScore'+'" value='+kpiTagSentimentAnalysisUI.sentimentScore.toFixed(0)+'>';
						tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_updatedKeywordId'+'" value='+keywordId+'>';
					}
			tempHtml+= '</div>';
			
			tempHtml+= '<div class="float-left">';
					tempHtml+='<select  onchange="pushNewPolarity(this,\''+qcId+'\')" id="qcDiv_'+qcId+'_'+reviewId+'_polarity'+'">';
					for(var q=0;q<qcPolarityList.length;q++){
						if(kpiTagSentimentAnalysisUI.polarity.toLowerCase()==qcPolarityList[q].polarity.toLowerCase()){
							tempHtml+='<option data-reviewsitecontentid="'+reviewId+'" data-percentage="'+qcPolarityList[q].percentage+'" selected value="'+qcPolarityList[q].polarity+'">'+qcPolarityList[q].polarity+'</option>';
						}else{
							tempHtml+='<option data-reviewsitecontentid="'+reviewId+'" data-percentage="'+qcPolarityList[q].percentage+'" value="'+qcPolarityList[q].polarity+'">'+qcPolarityList[q].polarity+'</option>';
						}
					}
					tempHtml+='</select>';
			tempHtml+= '</div>';
			tempHtml+= '<div class="float-left">';
					tempHtml+= 'Original Score: ';
			tempHtml+= '</div>';
			tempHtml+= '<div class="VerySmallBoldGreyContent float-left">';
						if(kpiTagSentimentAnalysisUI.originalScore==0){
							tempHtml+='NA ';
						}else{
							tempHtml+=kpiTagSentimentAnalysisUI.originalScore.toFixed(0)+'% ';
						}
			tempHtml+= '</div>';
		tempHtml+= '</div>';
			
				
		return tempHtml;
	}


 /************************************************************************************************************************
 ************************************************S r a v a n*************************************************************
 **************************************************************************************************************************/

var currentClass = "";
var flagForDepartment = convertToString("Department");
var flagForKpi = convertToString("Kpi");
var flagForMentionCategory = convertToString("MentionCategory");
var flagForMention = convertToString("Mention");

function addFlag(flagFor,qcId,flagForId){
	loadingForDashBoard();
	 $('#flagModalBody,#flagModalFooter,#flagModalHeader').html('');
	 $('#flagModalHeader').append('Add Flag For QC ID:'+qcId);
	 $.get("../qualityControl/isFlagAvailable.htm?qcId="+qcId+"&flaggedFor="+flagFor,function(response){
		 var flagComment = "";
		 var id = 0;
		 if(response.status=="SUCCESS"){
			  flagComment = response.successObject.qualityControlFlag.flagComment;
			  id = response.successObject.qualityControlFlag.id;
			  if(flagComment==null){
				  flagComment = "";
			  }
		 }else if(response.status=="EMPTY"){
			 flagComment = "";
		 }
		 var html = "";
		 html+=	'<form>';
		 /*********************************Error Div*********************************************************/
		 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="flagCommentErrorDiv">';
		 html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Comment';
		 html+=	'</div>';
		 /************************Success Div****************************************************************/
		 html+=	'<div class="alert alert-success" style="display:none;"id="flagCommentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
	     html+=	'<div class="form-group">';
	     html+=	'<label for="message-text" class="control-label">Comment</label>';
	     html+=	'<textarea class="form-control" id="'+flagFor+'_Comment">'+flagComment+'</textarea>';
	     html+=	'</div>';
	     html+=	'</form>';
	     $('#flagModalBody').append(html);
	     if(flagComment!=""){
			 $('#flagModalFooter').append('<button type="button" class="btn btn-primary" onclick="removeFlag('+convertToString(flagFor)+','+qcId+','+flagForId+','+id+')">Remove</button>');
	     }
		 $('#flagModalFooter').append('<button type="button" class="btn btn-primary" onclick="saveFlag('+convertToString(flagFor)+','+convertToString(qcId)+')">Save</button>');
		 $('#flagModal').modal('show');
		 unloadingForDashBoard();
	 },'json').fail(function(response){
		 jqueryPostError(response);
	 });
}

function getReview(reviewId){
		
	 var orgIdRadio=$("input[name=orgRadio]:checked").val();
	 var reviewSiteContent = {'id':reviewId,'organizationId':orgIdRadio};
	 $.ajax({
		 type:"POST",
		 url:"../qualityControl/fetchReview.htm",
		 contentType:"application/json",
		 data:JSON.stringify(reviewSiteContent),
		 success:function(response){
			 if(response.status=="SUCCESS"){
				 var review=response.successObject.review;
				 var qcList=response.successObject.qcList;
				 var returnHtml=paintReviewDiv(review,qcList);
				 $("#reviewContentDiv_"+review.id).html(returnHtml);
				 if(review.reviewStatus=="DELETED"){
					$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
				 }
			 }else{
				 jqueryPostError(response);
			 }
		 },error:function(response){
			 jqueryPostError(response);
		}
	 });
}

function saveFlag(flagFor,qcId){
	
	 var reviewId=$(this).data('reviewid');
	 loadingForDashBoard();
	 $('#flagCommentErrorDiv').hide();
	 $('#flagCommentSuccessDiv').hide();
	 var flagComment = $.trim($('#'+flagFor+'_Comment').val());
	 if(flagComment==""){
		$('#flagCommentErrorDiv').show(600);
		unloadingForDashBoard();
	 }else{
		 flagFor = flagFor.toUpperCase();
		 var JSONObject = {'reviewId':reviewId,'qcId':qcId,'flagComment':flagComment,'flaggedFor':flagFor};
		 $.ajax({
			 type:"POST",
			 url:"../qualityControl/saveFlagFor.htm",
			 contentType:"application/json",
			 data:JSON.stringify(JSONObject),
			 success:function(response){
				 if(response.status=="SUCCESS"){
					 $('#flagModal').modal('hide');
					 $(currentClass).css('color','red');
					 var review=response.successObject.review;
					 var qcList=response.successObject.qcList;
					 var returnHtml=paintReviewDiv(review,qcList);
					 $("#reviewContentDiv_"+review.id).html(returnHtml);
					 if(review.reviewStatus=="DELETED"){
						$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
					 }
					 unloadingForDashBoard();
					 $('#successModalTitle').text("Success");
					 $('#successModalText').text("Flaged successfully.");
					 $('#successModal').modal('show');
					 return false;
				 }else{
					 jqueryPostError(response);
				 }
			 },error:function(response){
				 jqueryPostError(response);
			}
		 });
		 return false;
	 }
}
function removeFlag(flagFor,qcId,flagForId,id){
	 if(window.confirm("Do you want to remove flag?")){
		 $.get("../qualityControlForUser/removeFlag.htm?id="+id+"&flaggedFor="+flagFor+"&qcId="+qcId,function(response){
			 if(response.status=="SUCCESS"){

				 $('#flagModal').modal('hide');
				 if(flagFor=="MENTION"){
					 $('#qcId_'+qcId+'_'+flagFor).removeClass('dropdown-toggle QCflagged');
					 $('#qcId_'+qcId+'_'+flagFor).addClass('dropdown-toggle');
				 }else{
					 $('#qcId_'+qcId+'_'+flagFor+'_'+flagForId).removeClass('dropdown-toggle QCflagged');
					 $('#qcId_'+qcId+'_'+flagFor+'_'+flagForId).addClass('dropdown-toggle');
				 }
				 showAlertModal("Success", "Flag Removed Successfully");
				 return false;
				/* var review=response.successObject.review;
				 var qcList=response.successObject.qcList;
				 var returnHtml=paintReviewDiv(review,qcList);
				 $("#reviewContentDiv_"+review.id).html(returnHtml);
				 if(review.reviewStatus=="DELETED"){
					$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
				 }
					
				 $('#flagModal').modal('hide');
				 $('#successModalTitle').text("Success");
				 $('#successModalText').text("Flag removed successfully.");
				 $('#successModal').modal('show');
				 return false;*/
			 }else{
				 jqueryPostError(response);
			 }
			 
		 },'json').fail(function(response){
			 jqueryPostError(response);
		 });
		 return false;
	 }
}
function reviewFlag(id){
	 $('#reviewFlagModalBody,#reviewFlagModalFooter').html('');
	 $('#reviewFlagCommentErrorDiv').hide();
	 $.get("../qualityControl/reviewFlag.htm?reviewId="+id,function(response){
		 var flagStatus = response.successObject.review.flagStatus;
		 var comment  = response.successObject.review.flagComment;
		 var flagStatusArray = [];
		 if(flagStatus!=null || flagStatus==""){
			  flagStatusArray = flagStatus.split(',');
		 }
		 var html = "";
		 html+=	'<form id="reviewFlagForm">';
		 /*********************************Error Div*********************************************************/
		 /************************Success Div****************************************************************/
		 html+=	'<div class="alert alert-success" style="display:none;"id="flagCommentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
		 html+=	'<div class="col-xs-12 form-horizontal">';
		 html+=	'<div id="flagChkDiv" class="form-group col-xs-10 row">';
		 
		 html+=	'<div class="col-xs-6">';
		
		 if(flagStatusArray.indexOf('DUPLICATE_REVIEW')!=-1){
			 html+=	'<label><input  type="checkbox" value="DUPLICATE_REVIEW" checked> Duplicate Review</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="DUPLICATE_REVIEW"> Duplicate Review</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		
		 if(flagStatusArray.indexOf('DELETED_REVIEW')!=-1){
			 html+=	'<label><input  type="checkbox" value="DELETED_REVIEW" checked> Review deleted from source</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="DELETED_REVIEW"> Review deleted from source</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';

		 if(flagStatusArray.indexOf('INCORRECT_LANGUAGE')!=-1){
			 html+=	'<label><input  type="checkbox" value="INCORRECT_LANGUAGE" checked> Language not correct</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="INCORRECT_LANGUAGE"> Language not correct</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		
		 if(flagStatusArray.indexOf('OTHER')!=-1){
			 html+=	'<label><input type="checkbox" value="OTHER" checked> Other</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="OTHER"> Other</label>';
		 }
		
		 html+=	'</div>';
		 if(comment==null || comment==""){
			 html+=	'<input type="text" class="form-control input-sm" maxLength="250" placeholder="Enter Comment" id="reivewFlagComment">';
		 }else{
			 html+=	'<input type="text" class="form-control input-sm" maxLength="250" placeholder="Enter Comment" id="reivewFlagComment" value="'+comment+'">';
		 }
		 html+=	'</div>';
		 html+=	'</div>';
		 html+=	'</form>';
	     $('#reviewFlagModalBody').append(html);
		 $('#reviewFlagModalFooter').append('<button type="button" class="btn btn-primary" onclick="updateReviewFlag(reviewFlagForm,'+id+')">Save</button>');
		 if(flagStatus!=null && flagStatus!=""){
			$('#reviewFlagModalFooter').append('<button type="button" class="btn btn-primary" onclick="removeReviewFlag('+id+')">Remove Flag</button>');
		 }
		 $('#reviewFlagModal').modal('show');
	 },'json').fail(function(response){
		 jqueryPostError(response);
	 });
	 return false;
}
function updateReviewFlag(form,reviewId){
	 loadingForDashBoard();
	 $('#reviewFlagCommentErrorDiv').hide();
	 var f = form.length;
	 var count = 0;
	 var array = [];
	 while(f--){
		if(form[f].type=="checkbox" && form[f].checked){
		if(form[f].value!="on"){
			var id = form[f].value;
			array.push(id);
		  }
		}
		count++;
	}
	 if(array.length==0){
		 $('#reviewFlagCommentErrorDiv').show(600);
		 unloadingForDashBoard();
		 return false;
	 }else{
		 var flagStatus = array.toString();
		 var reviewFlagComment = $('#reivewFlagComment').val();
		 var JSONObject = {'id':reviewId,'flagComment':reviewFlagComment,'flagStatus':flagStatus};
		 $.post("../qualityControl/updateReviewFlag.htm",JSONObject,function(response){
			 if(response.status=="SUCCESS"){
				 
				 var review=response.successObject.review;
				 var qcList=response.successObject.qcList;
				 var returnHtml=paintReviewDiv(review,qcList);
				 $("#reviewContentDiv_"+review.id).html(returnHtml);
				 if(review.reviewStatus=="DELETED"){
					$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
				 }
				 unloadingForDashBoard();
				 $('#reviewFlagModal').modal('hide');
				 $('#successModalTitle').text("Success");
				 $('#successModalText').text("Flaged successfully.");
				 $('#successModal').modal('show');
				
			 }else{
				 jqueryPostError(response);
			 }
		 },'json').fail(function(response){
			 jqueryPostError(response);
		 });
		 return false;
	 }
	 
}
 jQuery(document ).on( "keyup", ".sentimentPointInput", function(){ 
	 if($(this).val()>2 || $(this).val()<-2){
		 $(this).val('');
	 }
});
	
function rejectPhraseModal(id,reviewId){
	var bodyHtml="<span style='color:red'> Are you sure ?<span>";
	$('#rejectPhraseModalBody').html(bodyHtml);
	
	var footerHtml='<button type="button" class="btn btn-primary" onclick="rejectPhrase('+id+','+reviewId+')">Yes</button>';
		footerHtml+='<button type="button" class="btn btn-default" data-dismiss="modal">No</button>';
	$('#rejectPhraseModalFooter').html(footerHtml);
	$('#rejectPhraseModal').modal('show');
}
function rejectPhrase(id,reviewId){
	var ReviewPhraseStaging = {'deleted':1,'id':id,'reviewId':reviewId};
	$.post("../qualityControl/rejectPhrase.htm",ReviewPhraseStaging,function(response){
		if(response.status=="SUCCESS"){
			var review=response.successObject.review;
			var qcList=response.successObject.qcList;
			var returnHtml=paintReviewDiv(review,qcList);
			$("#reviewContentDiv_"+review.id).html(returnHtml);
			if(review.reviewStatus=="DELETED"){
				$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
			}
			 $('#successModalTitle').text("Success");
			 $('#successModalText').text("Phrase Rejected Successfully.");
			 $('#successModal').modal('show');
			$('#rejectPhraseModal').modal('hide');
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
}

function addPolarityModal(id,reviewId){
	
	var bodyHtml="";
	bodyHtml+="<span>Select Polarity<span>";
	bodyHtml+='<select id="addPolarityOption" class="form-control input-sm" style="width:auto" onchange="">';
	if(qcPolarityList.length>0){
		for(var q=0;q<qcPolarityList.length;q++){
			bodyHtml+='<option  data-polarity="'+qcPolarityList[q].polarity+'" value="'+qcPolarityList[q].percentage+'">'+qcPolarityList[q].polarity+'('+qcPolarityList[q].percentage+'%)</option>';
		}
	}else{
		bodyHtml+='<option  value="noData">No Data Found</option>';
	}
	
	bodyHtml+='</select>';
	
	$('#addNewPolarityModalBody').html(bodyHtml);
	var footerHtml='<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
		footerHtml+='<button type="button" class="btn btn-primary" onclick="addPolarity('+id+','+reviewId+')">Save</button>';
	$('#addNewPolarityModalFooter').html(footerHtml);
	$('#addNewPolarityModal').modal('show');
}

function addPolarity(id,reviewId){
	var modifiedScore=parseFloat($('#addPolarityOption option:selected').val());
	var polarity=$('#addPolarityOption option:selected').data('polarity');
	var ReviewPhraseStaging = {'id':id,'reviewId':reviewId,'modifiedScore':modifiedScore,'polarity':polarity};
	//console.log(ReviewPhraseStaging);
	$.post("../qualityControl/addPolarity.htm",ReviewPhraseStaging,function(response){
		if(response.status=="SUCCESS"){
			/*var review=response.successObject.review;
			var qcList=response.successObject.qcList;
			var returnHtml=paintReviewDiv(review,qcList);
			$("#reviewContentDiv_"+review.id).html(returnHtml);
			if(review.reviewStatus=="DELETED"){
				$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
			}*/
			 $('#addNewPolarityModal').modal('hide');
			 $('#successModalTitle').text("Success");
			 $('#successModalText').text("Polarity added Successfully.");
			 $('#successModal').modal('show');
			
		}
	},'json').fail(function(response){
		jqueryPostError(response);
	});
}

/**************************************************************************************************************************
 * ****************************************Phrases*************************************************************************
 * ***********************************************************************************************************************/
function appendPhrases(phrasesList,reviewId){
	var html = "";
	html+=	'<div id="phrases_'+reviewId+'" class="row form-group col-sm-12">';
	html+=		'<div class="col-sm-1">';
	html+=	'Phrases:'	;
	html+=		'</div>';
	html+=		'<div class="col-sm-5" id="phrasesDiv_'+reviewId+'">';
	html+=		'{';
	$.each(phrasesList,function(index,value){
		var phrase = value.phrase;
		var id = value.id;
		var isUpdated = value.updatedByUser;
		var isSuggestedPhrase = value.suggestedPhrase;
		if(!isSuggestedPhrase){
			if(isUpdated==false){
				html+=	'<a style="color:green;" id='+id+' onclick="viewPharseFlagForm('+id+')">'+phrase+'</a>'+",";
			}else{
				html+=	'<a style="color:red;" onclick="viewPharseFlagForm('+id+')">'+phrase+'</a>'+", ";
			}
		}
		
		
	});
	html+=	'<span id="updated_phrase_'+reviewId+'"></span>';
	html+=	'<a onclick="addNewPhrase('+reviewId+')">+</a>';
	html+=	'}';
	html+=	'</div>';
	html+=	'<div class="col-sm-1">';
	html+=			'<input type="button" value="View All Phrases" onclick="viewAllPhrases('+reviewId+')">';
	html+=	'</div>';
	html+=	'</div>';
	return html;
	
}

function appendPhrases1(phrasesList,reviewId){
	console.log(phrasesList);
	var html = "";
	html+=	'<div class="row col-xs-12">';
	html+=	'<div class="QCMappingStyle QCphrases">';
	html+=	'<ul class="nav nav-pills" role="tablist" id="qcPhrase_'+reviewId+'">';
	html+=	 '<li class="QCphrasesTitle">Phrases:</li>';
	$.each(phrasesList,function(index,value){
		var phrase = value.phrase;
		var id = value.id;
		var isUpdated = value.updatedByUser;
		var isSuggestedPhrase = value.suggestedPhrase;
		var actualScore = value.actualScore;
		var createdUserId = value.createdUserId;
		if(!isSuggestedPhrase ){
			if(createdUserId!=null && isUpdated){
				html+=	' <li role="presentation" class="dropdown">';
				html+=	'<a id="qcPhrase_'+id+'_reviewId_'+reviewId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+phrase+'</a>';
				html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
				html+=	'<div class="QC-page-arrow-up"></div>';
				html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="viewPharseFlagForm('+id+','+reviewId+')">Flag</a></li>';
				if(actualScore!=""||actualScore!=null||actualScore!=undefined ){	
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addPolarityModal('+id+','+reviewId+')">Add polarity to new phrase</a></li>';
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="rejectPhraseModal('+id+','+reviewId+')">Reject the added phrase</a></li>';
				}
				html+=	'</ul>';
				html+=	'</li>';//presentation
			}else if(createdUserId!=null){
				html+=	' <li role="presentation" class="dropdown">';
				html+=	'<a id="qcPhrase_'+id+'_reviewId_'+reviewId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true"><font color="red">'+phrase+'</font></a>';
				html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
				html+=	'<div class="QC-page-arrow-up"></div>';
				html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="viewPharseFlagForm('+id+','+reviewId+')">Flag</a></li>';
				if(actualScore!=""||actualScore!=null||actualScore!=undefined ){	
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addPolarityModal('+id+','+reviewId+')">Add polarity to new phrase</a></li>';
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="rejectPhraseModal('+id+','+reviewId+')">Reject the added phrase</a></li>';
				}
				html+=	'</ul>';
				html+=	'</li>';//presentation	
			}else if(isUpdated==false){
				html+=	' <li role="presentation" class="dropdown">';
				html+=	'<a id="qcPhrase_'+id+'_reviewId_'+reviewId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+phrase+'</a>';
				html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
				html+=	'<div class="QC-page-arrow-up"></div>';
				html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="viewPharseFlagForm('+id+','+reviewId+')">Flag</a></li>';
				if(actualScore!=""||actualScore!=null||actualScore!=undefined ){	
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addPolarityModal('+id+','+reviewId+')">Add polarity to new phrase</a></li>';
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="rejectPhraseModal('+id+','+reviewId+')">Reject the added phrase</a></li>';
				}
				html+=	'</ul>';
				html+=	'</li>';//presentation	
			}else{
				
				html+=	' <li role="presentation" class="dropdown">';
				html+=	'<a id="qcPhrase_'+id+'_reviewId_'+reviewId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+phrase+'</a>';
				html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
				html+=	'<div class="QC-page-arrow-up"></div>';
				html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="viewPharseFlagForm('+id+','+reviewId+')">Flag</a></li>';
				if(actualScore!=""||actualScore!=null||actualScore!=undefined ){	
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addPolarityModal('+id+','+reviewId+')">Add polarity to new phrase</a></li>';
					html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="rejectPhraseModal('+id+','+reviewId+')">Reject the added phrase</a></li>';
				}
				html+=	'</ul>';
				html+=	'</li>';//presentation
			}
		}
	});
	html+=	' <li role="presentation" class="dropdown" id="addqcPhrase_'+reviewId+'">';
	html+=	'<a id="drop4" href="#" class="AddkeywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true" onclick="addNewPhrase('+reviewId+')">+</a>';
	html+=	'</li>';
	html+=	'</ul>';//nav nav-pills
	return html;
}


function viewAllPhrases(reviewId){
	$('#addNewPhraseModal').modal('hide');
	loadingForDashBoard();
	$('#listAllPhrasesModalBody,#listAllPhrasesModalFooter').html('');
	$.post("../qualityControl/listAllPhrases.htm?reviewId="+reviewId,function(response){
		if(response.status=="SUCCESS"){
			var phrasesList = response.successObject.listAllPhrases;
			var html = "";
			html+=	'<form>';
			html+=		'<table class="table table-bordered">';
			$.each(phrasesList,function(index,value){
				var phrase = value.phrase;
				html+=	'<tr>';
				html+=		'<th>';
				html+=	phrase;
				html+=		'</th>';
				html+=	'</tr>';
			});
			html+=		'</table>';
			html+=	'</form>';
			$('#listAllPhrasesModalBody').append(html);
			 $('#listAllPhrasesModalFooter').append('<button type="button" class="btn btn-primary" onclick="addNewPhrase('+reviewId+')">Create New Phrase</button>');
			$('#listAllPhrasesModal').modal('show');
			unloadingForDashBoard();
		}else{
			$('#listAllPhrasesModalBody').append('<p><b>Something went wrong.Please Contact Admin</b></p>');
		}
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	unloadingForDashBoard();
	return false;
}

function addNewPhrase(reviewId){
	$('#listAllPhrasesModal').modal('hide');
	$('#addNewPhraseModalBody,#addNewPhraseModalFooter').html('');
	 var html = "";
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addNewPhraseErrorDiv">';
	 html+=	'</div>';
	 /************************Success Div****************************************************************/
	 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
     html+=	'<div class="form-group">';
     html+=	'<label for="message-text" class="control-label">Enter your pharse here</label>';
     html+=	'<input type="text" maxLength=50 class="form-control input-sm" placeholder="Add New Phrase" id="newPhrase">';
     html+=	'</div>';
     html+=	'</form>';
     $('#addNewPhraseModalBody').append(html);
     $('#addNewPhraseModalFooter').append('<button type="button" class="btn btn-primary" onclick="addPhraseComment('+reviewId+')">Add</button>');
     $('#addNewPhraseModalFooter').append('<button type="button" class="btn btn-primary" onclick="viewAllPhrases('+reviewId+')">View All Phrases</button>');
     $('#addNewPhraseModal').modal('show');
}

function addPhraseComment(reviewId){
	loadingForDashBoard();
	 $('#addNewPhraseErrorDiv').hide();
	 $('#addNewPhraseErrorDiv').html('');
	var addedPhrase = $.trim($('#newPhrase').val());
	 var JSONObject = {'reviewId':reviewId,'phrase':addedPhrase};
	 $.post("../qualityControl/isPhraseExists.htm",JSONObject,function(response){
		 if(response.status=="ERROR"){
			 $('#addNewPhraseErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage);
			 $('#addNewPhraseErrorDiv').show(600);
			 unloadingForDashBoard();
		 }else{
			 $('#addNewPhraseModal').modal('hide');
				$('#addNewPhraseCommentModalBody,#addNewPhraseCommentModalFooter').html('');
				 var html = "";
				 html+=	'<form>';
				 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addNewPhraseCommentErrorDiv">';
				 html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Comment';
				 html+=	'</div>';
				 /************************Success Div****************************************************************/
				 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
				 html+=	'<font>The phrase {<b>'+addedPhrase+'</b>} does not exists do you want to add it to be informend to the Admin.<font>'
				 html+=	'<div class="form-group">';
			     html+=	'<label for="message-text" class="control-label">Enter Comment</label>';
			     html+=	'<textarea class="form-control" maxLength=100 id="newPhraseComment"></textarea>';
			     html+=	'</div>';
			     html+=	'</form>';
			     $('#addNewPhraseCommentModalBody').append(html);
			     $('#addNewPhraseCommentModalFooter').append('<button type="button" class="btn btn-primary" onclick="saveNewPhrase('+reviewId+')">Yes</button>');
			     $('#addNewPhraseCommentModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
			     $('#addNewPhraseCommentModal').modal('show');
			     unloadingForDashBoard();
		 }
		
	 },'json').fail(function(response){
		 jqueryPostError(response);
	 });
	 return false;
		
}

function saveNewPhrase(reviewId){
	loadingForDashBoard();
	$('#addNewPhraseCommentErrorDiv').hide();
	var comment = $.trim($('#newPhraseComment').val());
	var addedPhrase = $.trim($('#newPhrase').val());
	if(comment==""){
		$('#addNewPhraseCommentErrorDiv').show(600);
		unloadingForDashBoard();
	}else{
		var organizationId = $('#organizationName option:selected').val();
		var JSONObject = {'comment':comment,'phrase':addedPhrase,'reviewId':reviewId,'organizationId':organizationId};
			$.post('../qualityControl/saveNewPhrase.htm',JSONObject,function(response){
				if(response.status=="SUCCESS"){
					var id = response.successObject.phraseId;
					 $('#addNewPhraseCommentModal').modal('hide');
					 $('#addqcPhrase_'+reviewId).remove();//Removing + button
					 /*var html = "";
					    html+=	' <li role="presentation" class="dropdown">';
						html+=	'<a id="qcPhrase_'+id+'_reviewId_'+reviewId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+addedPhrase+'</a>';
						html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
						html+=	'<div class="QC-page-arrow-up"></div>';
						html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="viewPharseFlagForm('+id+','+reviewId+')">Flag</a></li>';
						html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addPolarityModal('+id+','+reviewId+')">Add polarity to new phrase</a></li>';
						html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="rejectPhraseModal('+id+','+reviewId+')">Reject the added phrase</a></li>';
						html+=	'</ul>';
						html+=	'</li>';//presentation
						html+=	' <li role="presentation" class="dropdown" id="addqcPhrase_'+reviewId+'">';
						html+=	'<a id="drop4" href="#" class="dropdown-toggle AddkeywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true" onclick="addNewPhrase('+reviewId+')">+</a>';
						html+=	'</li>';
					 $('#qcPhrase_'+reviewId).append(html);*/
					 
					 var review=response.successObject.review;
					 var qcList=response.successObject.qcList;
					 var returnHtml=paintReviewDiv(review,qcList);
					 $("#reviewContentDiv_"+review.id).html(returnHtml);
					 if(review.reviewStatus=="DELETED"){
						$("#reviewContentDiv_"+review.id).addClass("disabledbutton");
					 }
					 
					 unloadingForDashBoard();
					
					$('#successModalTitle').text("Success");
					 $('#successModalText').text("Phrases added Successfully.");
					 $('#successModal').modal('show');
				}else{
					alert("something went wrong please contact admin");
					unloadingForDashBoard();
				}
			},'json').fail(function(response){
				jqueryPostError(response);
			});
		
		return false;
	}
}
/***************************************************Suggested Phrases************************************************************/
function appendSuggestedPhrases(phrasesList,reviewId){
	var html = "";
	html+=	'<div id="phrases_'+reviewId+'" class="row form-group col-sm-12">';
	html+=		'<div class="col-sm-1">';
	html+=	'Suggested Phrases:'	;
	html+=		'</div>';
	html+=		'<div class="col-sm-5" id="suggestedPhrases_'+reviewId+'">';
	html+=		'{';
	$.each(phrasesList,function(index,value){
		var phrase = value.phrase;
		var id = value.id;
		var isUpdated = value.updatedByUser;
		var isSuggestedPhrase = value.suggestedPhrase;
		if(isSuggestedPhrase){
			if(isUpdated==false){
				html+=	'<a style="color:green;" id="suggested_phrase'+id+'" onclick="updateSuggestedPhrase('+id+','+reviewId+',this)">'+phrase+'</a>';
				if(index==phrasesList.length-1){
					html+=	" ";
				}else{
					html+=	",";
				}
			}else{
				html+=	'<a style="color:red;" id="suggested_phrase'+id+'" onclick="updateSuggestedPhrase('+id+','+reviewId+',this)">'+phrase+'</a>';
				if(index==phrasesList.length-1){
					html+=	" ";
				}else{
					html+=	",";
				}
			}
		}
		
		
	});
	html+=	'}';
	html+=	'</div>';
	html+=	'<div class="col-sm-1">';
	html+=	'</div>';
	html+=	'</div>';
	return html;
}

function appendSuggestedPhrases1(phrasesList,reviewId){
	var html = "";
	html+=	'<ul class="nav nav-pills" role="tablist">';
	html+=	'<li class="QCphrasesTitle">Suggested Phrases: </li>';
	$.each(phrasesList,function(index,value){
		var phrase = value.phrase;
		var id = value.id;
		var isUpdated = value.updatedByUser;
		var isSuggestedPhrase = value.suggestedPhrase;
		if(isSuggestedPhrase){
			if(isUpdated==false){
				html+=	'<li role="presentation" class="dropdown">';
				html+=	'<a id="qcSuggestedPhrase_'+reviewId+'_phrase_'+id+'" href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+phrase+'</a>';
				html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
				html+=	'<div class="QC-page-arrow-up"></div>';
				html+=	' <li role="presentation"><a role="menuitem" tabindex="-1"  onclick="updateSuggestedPhrase('+id+','+reviewId+')">Save As Phrase</a></li>';
				html+=	'</ul>';
				html+=	'</li>';
			}else{
				html+=	'<li role="presentation" class="dropdown">';
				html+=	'<a id="qcSuggestedPhrase_'+reviewId+'_phrase_'+id+'" href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+phrase+'</a>';
				html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
				html+=	'<div class="QC-page-arrow-up"></div>';
				html+=	' <li role="presentation"><a role="menuitem" tabindex="-1"  onclick="updateSuggestedPhrase('+id+','+reviewId+')">Save As Phrase</a></li>';
				html+=	'</ul>';
				html+=	'</li>';
			}
		}
	});
	html+=	'<li><button type="button" class="btn btn-default btn-xs" onclick="viewAllPhrases('+reviewId+')">View all phrases</button></li></ul>';
	html+=	'</div>';//QCMappingStyle
	html+=	'</div>';//QCMAppingResults
	return html;
}

function updateSuggestedPhrase(id,reviewId){
	var suggestedPhrase =  $('#qcSuggestedPhrase_'+reviewId+'_phrase_'+id).text();
	$('#addNewPhraseModalBody,#addNewPhraseModalFooter').html('');
	 var html = "";
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addNewPhraseErrorDiv">';
	 html+=	'</div>';
	 /************************Success Div****************************************************************/
	 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
     html+=	'<div class="form-group">';
     html+=	'<label for="message-text" class="control-label">Enter your pharse here</label>';
     html+=	'<input type="text" maxLength=50 class="form-control input-sm" placeholder="Add New Phrase" id="newPhrase_'+reviewId+'" value="'+suggestedPhrase+'">';
     html+=	'</div>';
     html+=	'</form>';
     $('#addNewPhraseModalBody').append(html);
     $('#addNewPhraseModalFooter').append('<button type="button" class="btn btn-primary" onclick="addSuggestedPhraseComment('+id+','+reviewId+')">Add</button>');
     $('#addNewPhraseModalFooter').append('<button type="button" class="btn btn-primary" onclick="viewAllPhrases('+reviewId+')">View All Phrases</button>');
     $('#addNewPhraseModal').modal('show');
	
}

function addSuggestedPhraseComment(id,reviewId){
	loadingForDashBoard();
	 $('#addNewPhraseErrorDiv').hide();
	 $('#addNewPhraseErrorDiv').html('');
	var addedPhrase = $.trim($('#newPhrase_'+reviewId).val());
	 var JSONObject = {'reviewId':reviewId,'phrase':addedPhrase,'id':id};
	 $.post("../qualityControl/isPhraseExists.htm",JSONObject,function(response){
		 if(response.status=="ERROR"){
			 $('#addNewPhraseErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage);
			 $('#addNewPhraseErrorDiv').show(600);
			 unloadingForDashBoard();
		 }else{
			 $('#addNewPhraseModal').modal('hide');
				$('#addNewPhraseCommentModalBody,#addNewPhraseCommentModalFooter').html('');
				 var html = "";
				 html+=	'<form>';
				 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addNewPhraseCommentErrorDiv">';
				 html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Comment';
				 html+=	'</div>';
				 /************************Success Div****************************************************************/
				 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
				 html+=	'<font>The phrase {<b>'+addedPhrase+'</b>} does not exists do you want to add it to be informend to the Admin.<font>'
				 html+=	'<div class="form-group">';
			     html+=	'<label for="message-text" class="control-label">Enter Comment</label>';
			     html+=	'<textarea class="form-control" maxLength=100 id="newPhraseComment"></textarea>';
			     html+=	'</div>';
			     html+=	'</form>';
			     $('#addNewPhraseCommentModalBody').append(html);
			     $('#addNewPhraseCommentModalFooter').append('<button type="button" class="btn btn-primary" onclick="saveAsNewPhrase('+id+','+reviewId+')">Yes</button>');
			     $('#addNewPhraseCommentModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
			     $('#addNewPhraseCommentModal').modal('show');
			     unloadingForDashBoard();
		 }
		
	 },'json').fail(function(response){
		 jqueryPostError(response);
	 });
	 return false;
		
}

function saveAsNewPhrase(id,reviewId){
	loadingForDashBoard();
	$('#addNewPhraseCommentErrorDiv').hide();
	var comment = $.trim($('#newPhraseComment').val());
	var addedPhrase = $.trim($('#newPhrase_'+reviewId).val());
	if(comment==""){
		$('#addNewPhraseCommentErrorDiv').show(600);
		unloadingForDashBoard();
	}else{
		var organizationId = $('#organizationName option:selected').val();
		var JSONObject = {'id':id,'comment':comment,'phrase':addedPhrase,'reviewId':reviewId,'organizationId':organizationId};
			$.post('../qualityControl/saveAsPhrase.htm',JSONObject,function(response){
				if(response.status=="SUCCESS"){
					$('#qcSuggestedPhrase_'+reviewId+'_phrase_'+id).remove();
					$('#addqcPhrase_'+reviewId).remove();//Removing + button
						var html = "";
					    html+=	' <li role="presentation" class="dropdown">';
						html+=	'<a id="qcPhrase_'+id+'_reviewId_'+reviewId+'" href="#" class="dropdown-toggle QCflagged" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+addedPhrase+'</a>';
						html+=	'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">';
						html+=	'<div class="QC-page-arrow-up"></div>';
						html+=	'<li role="presentation"><a role="menuitem" tabindex="-1" onclick="viewPharseFlagForm('+id+','+reviewId+')">Flag</a></li>';
						html+=	'</ul>';
						html+=	'</li>';//presentation
						html+=	' <li role="presentation" class="dropdown" id="addqcPhrase_'+reviewId+'">';
						html+=	'<a id="drop4" href="#" class="dropdown-toggle AddkeywordsTags disabled" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true" onclick="addNewPhrase('+reviewId+')">+</a>';
						html+=	'</li>';
					 $('#qcPhrase_'+reviewId).append(html);
					 $('#addNewPhraseCommentModal').modal('hide');
					 unloadingForDashBoard();
					 $('#successModalTitle').text("Success");
					 $('#successModalText').text("Saved as phrase Successfully.");
					 $('#successModal').modal('show');

				}else{
					alert("something went wrong please contact admin");
					unloadingForDashBoard();
				}
			},'json').fail(function(response){
				jqueryPostError(response);
			});
		
		return false;
	}
}

/***************************************Phrase Flag************************************************************************************/

function viewPharseFlagForm(id,reviewId){
	loadingForDashBoard();
	$('#flagPhraseModalBody,#flagPhraseModalFooter').html('');
	$.post("../qualityControl/getPharseDetails.htm?phraseId="+id,function(response){
		var reviewPhraseDetails = response.successObject.reviewPhraseStaging;
		var flagComment = reviewPhraseDetails.flagComment;
		var isUpdated = reviewPhraseDetails.updatedByUser;
		var html = "";
		 html+=	'<form>';
		 /*********************************Error Div*********************************************************/
		 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="flagPhraseCommentErrorDiv">';
		 html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Comment';
		 html+=	'</div>';
		 /************************Success Div****************************************************************/
		 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
	     html+=	'<div class="form-group">';
	     html+=	'<label for="message-text" class="control-label">Comments</label>';
	     if(flagComment==null){
	    	 flagComment = "";
	     }
	     html+=	'<textarea class="form-control" maxLength=100 id="FlagPhraseComment">'+flagComment+'</textarea>';
	     html+=	'</div>';
	     html+=	'</form>';
	     $('#flagPhraseModalBody').append(html);
		 $('#flagPhraseModalFooter').append('<button type="button" class="btn btn-primary" onclick="updateFlagPhrase('+id+','+reviewId+')">Save</button>');
		 $('#flagPhraseModal').modal('show');
		 unloadingForDashBoard();
		 
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
	 
}

function updateFlagPhrase(id,reviewId){
	loadingForDashBoard();
	$('#flagPhraseCommentErrorDiv').hide();
	var flagComment = $('#FlagPhraseComment').val();
	var JSONObject = {'flagComment':flagComment,'id':id,'reviewId':reviewId};
	$.post("../qualityControl/flagPhrase.htm",JSONObject,function(response){
		if(response.status=="ERROR"){
			$('#flagPhraseCommentErrorDiv').show(600);
			unloadingForDashBoard();
			return false;
		}else{
			unloadingForDashBoard();
			$('#qcPhrase_'+id+'_reviewId_'+reviewId).addClass('dropdown-toggle QCflagged')
			$('#flagPhraseModal').modal('hide');
			
			$('#successModalTitle').text("Success");
			 $('#successModalText').text("Flag added Successfully.");
			 $('#successModal').modal('show');
			
			return false;
			
		}
		
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
}
/*****************************************************Keyword******************************************************//*
function addNewQcKeyword(qcId){
	$('#addQcKeywordModalBody,#addQcKeywordModalFooter,#addQcKeywordHeader').html('');
	 var html = "";
	 $('#addQcKeywordHeader').append('Add Keywords to QC Id:'+qcId);
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addQcKeywordCommentErrorDiv">';
	 html+=	'</div>';
	 *//************************Success Div****************************************************************//*
	 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
	 html+=	'<font>You can add multiple sub-keywords using coma separation<font>'
	 html+=	'<div class="form-group">';
     html+=	'<textarea class="form-control" maxLength=100 id="qcKeyword_'+qcId+'"></textarea>';
     html+=	'</div>';
     html+=	'</form>';
     $('#addQcKeywordModalBody').append(html);
     $('#addQcKeywordModalFooter').append('<button type="button" class="btn btn-primary" onclick="saveQcKeyword('+qcId+')">Yes</button>');
     $('#addQcKeywordModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
     $('#addQcKeywordModal').modal('show');
	
}

function saveQcKeyword(qcId){
	loadingForDashBoard();
	$('#addQcKeywordCommentErrorDiv').hide();
	$('#addQcKeywordCommentErrorDiv').html('');
	var organizationId = $('#organizationName option:selected').val();
	var keyword = $.trim($('#qcKeyword_'+qcId).val());
	var JSONObject  ={'qcId':qcId,'keyword':keyword,'organizationId':organizationId};
	$.post("../qcKeyword/save.htm",JSONObject,function(response){
		if(response.status=="SAVE_ERROR"){
			var errorMessage  = response.errorMessageList[0].message;
			$('#addQcKeywordCommentErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+errorMessage);
			$('#addQcKeywordCommentErrorDiv').show(600);
			unloadingForDashBoard();
		}else if(response.status=="SAVE_SUCCES"){
			alert("Keyword(s) Added Successfully");
			$('#qc_keyword_'+qcId).html('');
			var qcKeywords = response.successObject.qcKeywordList;
			$('#qc_keyword_'+qcId).append(appendQcKeywords(qcKeywords));
			$('#addQcKeywordModal').modal('hide');
			unloadingForDashBoard();
		}
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
	
	function appendQcKeywords(qcKeywords){
		var tempHtml = "";
		tempHtml+=	'{';
		$.each(qcKeywords,function(index,value){
			var keyword = value.keyword;
			var id = value.id;
			var qcId = value.qcId;
			var updatedUserId  = value.updatedUserId;
			if(updatedUserId!=null){
				tempHtml+=	'<font>'+keyword+'</font> , ';
			}else{
				tempHtml+=	'<a href="#" style="color:green" onclick="removeQcKeyword('+id+')" id="qcKeyword_'+id+'" value='+id+'>'+keyword+'</a> , ';
			}
			
		});
		tempHtml+=	'<a onclick="addNewQcKeyword('+qcId+')">+</a>';
		tempHtml+=	'}';
		return tempHtml;
	}
	
}

function removeQcKeyword(id){
	if(window.confirm("do you want to remove this keyword?")){
		loadingForDashBoard();
		 $('a#qcKeyword_'+id).css('color','grey');
		 var JSONObject = {'id':id};
		 $.post("../qcKeyword/remove.htm?",JSONObject,function(response){
			 if(response.status=="SUCCESS"){
				 alert("Keyword Removed Successfully");
				 unloadingForDashBoard();
				 return false;
			 }
		 },'json').fail(function(response){
			 jqueryPostError(response);
		 });
		 return false;
	}
}
	
*//***********************************************************Sravan**************************************************************************//*
*//*****************************************************Keyword******************************************************//*
function addNewQcKeyword(qcId){
	$('#addQcKeywordModalBody,#addQcKeywordModalFooter,#addQcKeywordHeader').html('');
	 var html = "";
	 $('#addQcKeywordHeader').append('Add Keywords to QC Id:'+qcId);
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addQcKeywordCommentErrorDiv">';
	 html+=	'</div>';
	 *//************************Success Div****************************************************************//*
	 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
	 html+=	'<font>You can add multiple sub-keywords using coma separation<font>'
	 html+=	'<div class="form-group">';
     html+=	'<textarea class="form-control" maxLength=100 id="qcKeyword_'+qcId+'"></textarea>';
     html+=	'</div>';
     html+=	'</form>';
     $('#addQcKeywordModalBody').append(html);
     $('#addQcKeywordModalFooter').append('<button type="button" class="btn btn-primary" onclick="saveQcKeyword('+qcId+')">Yes</button>');
     $('#addQcKeywordModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
     $('#addQcKeywordModal').modal('show');
	
}

function saveQcKeyword(qcId){
	loadingForDashBoard();
	$('#addQcKeywordCommentErrorDiv').hide();
	$('#addQcKeywordCommentErrorDiv').html('');
	var organizationId = $('#organizationName option:selected').val();
	var keyword = $.trim($('#qcKeyword_'+qcId).val());
	var JSONObject  ={'qcId':qcId,'keyword':keyword,'organizationId':organizationId};
	$.post("../qcKeyword/save.htm",JSONObject,function(response){
		if(response.status=="SAVE_ERROR"){
			var errorMessage  = response.errorMessageList[0].message;
			$('#addQcKeywordCommentErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+errorMessage);
			$('#addQcKeywordCommentErrorDiv').show(600);
			unloadingForDashBoard();
		}else if(response.status=="SAVE_SUCCES"){
			alert("Keyword(s) Added Successfully");
			$('#qc_keyword_'+qcId).html('');
			var qcKeywords = response.successObject.qcKeywordList;
			$('#qc_keyword_'+qcId).append(appendQcKeywords(qcKeywords));
			$('#addQcKeywordModal').modal('hide');
			unloadingForDashBoard();
		}
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
	
	function appendQcKeywords(qcKeywords){
		var tempHtml = "";
		tempHtml+=	'{';
		$.each(qcKeywords,function(index,value){
			var keyword = value.keyword;
			var id = value.id;
			var qcId = value.qcId;
			var updatedUserId  = value.updatedUserId;
			if(updatedUserId!=null){
				tempHtml+=	'<font>'+keyword+'</font> , ';
			}else{
				tempHtml+=	'<a href="#" style="color:green" onclick="removeQcKeyword('+id+')" id="qcKeyword_'+id+'" value='+id+'>'+keyword+'</a> , ';
			}
			
		});
		tempHtml+=	'<a onclick="addNewQcKeyword('+qcId+')">+</a>';
		tempHtml+=	'}';
		return tempHtml;
	}
	
}

function removeQcKeyword(id){
	if(window.confirm("do you want to remove this keyword?")){
		loadingForDashBoard();
		 $('a#qcKeyword_'+id).css('color','grey');
		 var JSONObject = {'id':id};
		 $.post("../qcKeyword/remove.htm?",JSONObject,function(response){
			 if(response.status=="SUCCESS"){
				 alert("Keyword Removed Successfully");
				 unloadingForDashBoard();
				 return false;
			 }
		 },'json').fail(function(response){
			 jqueryPostError(response);
		 });
		 return false;
	}
}*/

/*****************************************************Keyword******************************************************/
function addNewQcKeyword(qcId,reviewId){
	$('#addQcKeywordModalBody,#addQcKeywordModalFooter,#addQcKeywordHeader').html('');
	 var html = "";
	 $('#addQcKeywordHeader').append('Add Keywords to QC Id:'+qcId);
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addQcKeywordCommentErrorDiv">';
	 html+=	'</div>';
	 /************************Success Div****************************************************************/
	 html+=	'<div class="alert alert-success" style="display:none;"id="flagPhraseSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Comment Added Successfully</div>';
	 html+=	'<font>You can add multiple sub-keywords using coma separation<font>'
	 html+=	'<div class="form-group">';
     html+=	'<textarea class="form-control" maxLength=100 id="qcKeyword_'+qcId+'"></textarea>';
     html+=	'</div>';
     html+=	'</form>';
     $('#addQcKeywordModalBody').append(html);
     $('#addQcKeywordModalFooter').append('<button type="button" class="btn btn-primary" onclick="saveQcKeyword('+qcId+','+reviewId+')">Yes</button>');
     $('#addQcKeywordModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
     $('#addQcKeywordModal').modal('show');
	
}

function saveQcKeyword(qcId,reviewId){
	loadingForDashBoard();
	$('#addQcKeywordCommentErrorDiv').hide();
	$('#addQcKeywordCommentErrorDiv').html('');
	var organizationId = $('#organizationName option:selected').val();
	var keyword = $.trim($('#qcKeyword_'+qcId).val());
	var JSONObject  ={'qcId':qcId,'keyword':keyword,'organizationId':organizationId};
	$.post("../qcKeyword/save.htm",JSONObject,function(response){
		if(response.status=="SAVE_ERROR"){
			var errorMessage  = response.errorMessageList[0].message;
			$('#addQcKeywordCommentErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+errorMessage);
			$('#addQcKeywordCommentErrorDiv').show(600);
			unloadingForDashBoard();
		}else if(response.status=="SAVE_SUCCES"){
			$('#qc_keyword_'+qcId).html('');
			$('#qc_id_'+qcId+'_keywordsDiv').html('');
			/*******************************Appending Added Keywords**************************************************************************/
			var tempHtml = "";
			tempHtml+=	'<div class="QCmappingKeywords" id="qc_id_'+qcId+'_keywordsDiv">';
			tempHtml+=		'<ul class="nav nav-pills tags" role="tablist">';
			tempHtml+=		'<li class="">Keywords:</li>';
			/****************************For Loop Should Stars Here*************************************************************************************/
			var qcKeywords = response.successObject.qcKeywordList;
			$.each(qcKeywords,function(index,value){
				var keyword  = value.keyword;
				var id = value.id;
				var qcId = value.qcId;
				var updatedUserId = value.updatedUserId;
				var isDeleted  = value.deleted;
				var createdUserId = value.createdUserId;
				tempHtml+=			'<li role="presentation" class="dropdown">';
				if(updatedUserId!=null && isDeleted==true){
					tempHtml+=     		'<li  href="javascript: void(0)" class="dropdown-toggle keywordsTags disabled" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+keyword+'</li>';
				}else if(createdUserId!=null){
					tempHtml+=     		'<a id="qcId_'+qcId+'_keywordId_'+id+'" href="#" class="dropdown-toggle keywordsTags newkeywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+keyword+'</a>';
				}else{
					tempHtml+=     		'<a id="qcId_'+qcId+'_keywordId_'+id+'" href="#" class="dropdown-toggle keywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true">'+keyword+'</a>';

				}
				tempHtml+=			'<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4"><div class="QC-page-arrow-up"></div> <li role="presentation"><a role="menuitem" tabindex="-1" onclick="removeQcKeyword('+id+','+qcId+','+reviewId+')">Remove</a></li>';
				tempHtml+=			'</ul>';
				
			});
			tempHtml+=		'<li role="presentation" class="dropdown">';
			tempHtml+=		'<a id="drop4" href="#" class="dropdown-toggle AddkeywordsTags" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="true" onclick=addNewQcKeyword('+qcId+','+reviewId+')>+</a>';
			tempHtml+=		'</li>';
			tempHtml+=      '</ul>';
			tempHtml+=			'</div>';
			$('#qc_id_'+qcId+'_keywordsDiv').append(tempHtml);
			$('#addQcKeywordModal').modal('hide');
			unloadingForDashBoard();
			
			/*$('#successModalTitle').text("Success");
			 $('#successModalText').text("Keyword(s) added Successfully.");
			 $('#successModal').modal('show');*/
		}
	},'json').fail(function(response){
		jqueryPostError(response);
	});
	return false;
	
	function appendQcKeywords(qcKeywords,reviewId){
		var tempHtml = "";
		tempHtml+=	'{';
		$.each(qcKeywords,function(index,value){
			var keyword = value.keyword;
			var id = value.id;
			var qcId = value.qcId;
			var updatedUserId  = value.updatedUserId;
			var isDeleted = value.deleted;
			if(updatedUserId!=null && isDeleted==true){
				tempHtml+=	'<font>'+keyword+'</font> , ';
			}else{
				tempHtml+=	'<a href="#" style="color:green" onclick="removeQcKeyword('+id+',this,'+reviewId+')" id="qcKeyword_'+id+'" value='+id+'>'+keyword+'</a> , ';
			}
			
		});
		tempHtml+=	'<a onclick="addNewQcKeyword('+qcId+','+reviewId+')">+</a>';
		tempHtml+=	'}';
		return tempHtml;
	}
	
}

function removeQcKeyword(id,qcId,reviewId){
	loadingForDashBoard();
	$('#removeKeywordReasonModalBody,#removeKeywordReasonModalFooter').html('');
	 var html = "";
	 html+=	'<form>';
	 html+=	'<div class="alert alert-danger alert-error" style="display:none" id="addRemoveKeywordReasonErrorDiv">';
	 html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Reason ';
	 html+=	'</div>';
	 /************************Success Div****************************************************************/
	 html+=	'<div class="form-group">';
     html+=	'<label for="message-text" class="control-label">Enter Reason</label>';
     html+=	'<textarea class="form-control" maxLength=200 id="removeKeywordReason_'+reviewId+'"></textarea>';
     html+=	'</div>';
     html+=	'</form>';
     $('#removeKeywordReasonModalBody').append(html);
     $('#removeKeywordReasonModalFooter').append('<button type="button" class="btn btn-primary" onclick="removeKeywordWithReason('+id+","+qcId+","+reviewId+')">Yes</button>');
     $('#modalTitle').text('Enter Reason for QC ID :'+qcId+'');
     $('#removeKeywordReasonModalFooter').append('<button type="button" class="btn btn-primary" data-dismiss="modal">No</button>');
     $('#removeKeywordReasonModal').modal('show');
     unloadingForDashBoard();
}

 function removeKeywordWithReason(id,qcId,reviewId){
		loadingForDashBoard();
		$('#addRemoveKeywordReasonErrorDiv').hide();
		 $('#addRemoveKeywordReasonErrorDiv').html('');
		var deletedReason = $.trim($('#removeKeywordReason_'+reviewId).val());
		if(deletedReason!=""){
			var JSONObject = {'id':id,'qcId':qcId,'reviewId':reviewId,'deletedReason':deletedReason};
			 $.post("../qcKeyword/remove.htm?",JSONObject,function(response){
				 if(response.status=="SUCCESS"){
					 	var review=response.successObject.review;
						var qcList=response.successObject.qcList;
						var returnHtml=paintReviewDiv(review,qcList);
						$("#reviewContentDiv_"+reviewId).html(returnHtml);
						if(review.reviewStatus=="DELETED"){
							$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
						}
					$('#qcId_'+qcId+'_keywordId_'+id).addClass('dropdown-toggle keywordsTags disabled');
					$('#removeKeywordReasonModal').modal('hide');
					 showAlertModal("Success", "Keyword removed Successfully");
					 unloadingForDashBoard();
					 return false;
				 }
			 },'json').fail(function(response){
				 jqueryPostError(response);
			 });
			 return false;
		}else{
			 $('#addRemoveKeywordReasonErrorDiv').append('&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Enter Reason');
			 $('#addRemoveKeywordReasonErrorDiv').show(600);
			 unloadingForDashBoard();
		}
 }


function exportLogs(){
	loadingForDashBoard();
	var organizationId = $("input[name=orgRadio]:checked").val();
	window.location.href = "../logReport/export.htm?organizationId="+organizationId;
	unloadingForDashBoard();
	return false;
}
$(document).on('click', function(evt) {
    if(!$(evt.target).is('#logReportSpanId')) {
        //Hide
    	$.each(reviewIds,function(index,value){
    		$('#collapseOne_'+value).hide();
    	});
    	
    }
});


$('#addNewPhraseModalBody').on('keyup keypress', function(e) {
	  var code = e.keyCode || e.which;
	  if (code == 13) { 
	    e.preventDefault();
	    return false;
	  }
});

