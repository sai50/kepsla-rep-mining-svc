var sessionSelectedOrganizationId=0;
var reviewList;
var sentimentPolarityList;
var departmentList = [];
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
		   getNotificationReviews(selectedOrgId);
		   getSentimentPolarityList();
		   listDepartment(selectedOrgId);
	   });
	   })
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	 saveSessionDatas();
	 getSentimentPolarityList();
	 getNotificationReviews(organizationId);
	   listDepartment(organizationId);
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
var rr;
function getNotificationReviews(selectedOrgId){
	loadingForDashBoard();
	$('#reviewsBredcrumb').show();
	 $.ajax({
			type:"GET",
			url:"../notifications/getReviews.htm?organizationId="+selectedOrgId,
			contentType:"application/json",
			success:function(response){
			unloadingForDashBoard();
			     rr=response;
				if(response.successObject.notificationReviews.length>0){
					reviewList = response.successObject.notificationReviews;
					var noOfPages = 0;
					if(response.successObject.notificationReviews.length%5  == 0 && response.successObject.notificationReviews.length >0){
						noOfPages = response.successObject.notificationReviews.length/5;
					}else{
						noOfPages = (response.successObject.notificationReviews.length/5)+1;
					}
					var begin = 0;
					var end = 5;
					var length = response.successObject.notificationReviews.length;
					if(end > length){
			    		end = length;
			    	}
			    	
				    $('#page-selection').bootpag({
				        total: noOfPages,
				        page: 1,
				        maxVisible: 5
				    }).on("page", function(event, /* page number here */ num){
				    	begin = ((num-1)*5);
				    	end=(num)*5;
				    	if(end > response.successObject.notificationReviews.legth){
				    		end = response.successObject.notificationReviews.length;
				    	}
				    	getReviewsPerPage(begin, end);
				    });
				    getReviewsPerPage(begin, end);
				
				}else{
					$("#page-selection").html(" ");
					$("#hotelReviewsDivId").html("<h4><font color='red'>No New Reviews Found!!</font></h4>").show();
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
	var list = [];
	for(var i=begin;i<end;i++){
		list.push(reviewList[i]);
	}
	$('#hotelReviewsDivId').html('');
	for(var i=0;i<list.length;i++){
		var tempHtml = "";
       if(list[i]!=undefined){
		tempHtml += '<div class="row col-xs-12 SingleReviewList">';
		tempHtml += '<div data-reviewid="'+list[i].id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
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
		tempHtml += '<div class="reviewDetails row">';
		tempHtml += '<div class="reviewSource">' + list[i].sourceName + '</div>';
		
			if(list[i].reviewerName==null || $.trim(list[i].reviewerName)==""){
				tempHtml += '<div class="reviewerName"><span>';
				tempHtml+='';
			}else{
				tempHtml += '<div class="reviewerName">by<span>';
				tempHtml+=list[i].reviewerName;
			}
		tempHtml+='</span></div>';
				
		if(list[i].reviewLocation==null || list[i].reviewLocation==""){	
			tempHtml += '<div class="reviewerDetail"><span>';
			tempHtml += '</span></div>';
		}
		else{
			tempHtml += '<div class="reviewerDetail">from <span>';
			tempHtml += ''+list[i].reviewLocation + '</span></div>';
		}
				
		tempHtml += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
				+ moment(list[i].reviewTime).format("DD MMMM YYYY")
				+ '</span>';
		tempHtml += '</div>';
		tempHtml += '</div>';
		tempHtml += '</div>';
		tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';																
		tempHtml+='<div style="float:right;">';
		tempHtml += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetails('+ list[i].id + ')" /> ';
		tempHtml+='</div>';
		tempHtml += '<div class="col-xs-12 col-sm-9 col-lg-10">';	
		if (list[i].reviewTitle != null) {
			tempHtml += '<h3 class="SingleReviewHeader" >'
					+ list[i].reviewTitle + '</h3>';
		}
		tempHtml += '<p>' + list[i].highlightedReviewContent + '</p>';

		// star review rating from Review content site table
		tempHtml += '<div class="SourceRating col-xs-12">';
		tempHtml += '<span>Source Rating </span><span data-review-rating="'+ list[i].reviewOverallRating+ '" data-maximum-rating="'+ list[i].maxOverallRating
				 + '" class="stars">'+ list[i].reviewOverallRating+ '</span><span>'+ list[i].reviewOverallRating+ '/'+ list[i].maxOverallRating + '</span>';
		tempHtml += '</div>';

		tempHtml += '<div class="SourceKPIRating col-xs-12">';
		for (var h = 0; h < list[i].kpiIndustryMasterUiList.length; h++) {
			tempHtml += '<div class="KPIRating col-xs-4">'+ list[i].kpiIndustryMasterUiList[h].kpiSourceName+ ' <span> '+ list[i].kpiIndustryMasterUiList[h].sourceKpiScore
					+ '/'+ list[i].kpiIndustryMasterUiList[h].maxRatingValue+ '</span></div>';
		}
		tempHtml += '</div>';
			
		if(list[i].keywordList.length>0){
			tempHtml += '<div id="keywordAndScore_'+list[i].id+'" class="TradeReviewKpiDepartmentFactor col-xs-12">'
					+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
			for (var h = 0; h < list[i].keywordList.length; h++) {
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						tempHtml +='<div class="KPIScore col-xs-4">  <span class="PositiveSentimentCount"> '+list[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
					if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						tempHtml +='<div class="KPIScore col-xs-4"> <span class="NeutralSentimentCount">  '+list[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
					if (parseInt(list[i].keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(list[i].keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						tempHtml +='<div class="KPIScore col-xs-4"> <span class="NegativeSentimentCount">  '+list[i].keywordList[h].nlpQueryName+'</span></div>';
						break;
					}
				}
			}
			tempHtml +='</div>';
		}
		
		/*tempHtml += '<div class="OnReviewActions col-xs-12">';
		tempHtml += '<div class="panel-body row">';
		tempHtml += '<ul class="nav nav-pills">';
		tempHtml += '<li>';
		tempHtml += '<a class="userPrimeAction" onclick="openShares('+ list[i].id + ')" data-toggle="tab" href="#Share-pills' + list[i].id + '">';
		tempHtml += '<div id="shareCountSpan' + list[i].id	+ '" class="ShareReviewIcon">Share('+ list[i].sourceMasterUIList.length + ')</div>';
		tempHtml += '</a>';
		tempHtml += '</li>';

		tempHtml += '<li>';
		if (departmentList.length == 0) {
			tempHtml += '<a class="userPrimeAction" data-toggle="tab" onclick="return false;" href="#Note-pills'
					+ list[i].id + '">';
			tempHtml += '<div class="ReviewNoteIcon">Quick Note</div> ';
			tempHtml += '</a>';
		} else {
			tempHtml += '<a class="userPrimeAction" onclick="openNote(' + list[i].id + ','+ $('#organizationName option:selected').val()+ ')" data-toggle="tab" href="#Note-pills'
					+ list[i].id + '">';
			tempHtml += '<div class="ReviewNoteIcon">Quick Note</div> ';
			tempHtml += '</a>';
		}
		tempHtml += '</li>';
		tempHtml += '<li >';
		if (departmentList.length == 0) {
			tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task" onclick="getComments('
					+ list[i].id
					+ ','
					+ $('#organizationName option:selected').val()
					+ ',this)" onclick="return false;" href="#Action-pills'
					+ list[i].id + '">';
			tempHtml += '<div class="ReviewActionIcon">Action</div>';
			tempHtml += '</a>';
		} else {
			tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#Action-pills'+ list[i].id + '">';
			tempHtml += '<div class="ReviewActionIcon">Action</div>';
			tempHtml += '</a>';
		}

		
		*//******************************respond to review pill3************************************//*
		tempHtml += '<li >';
			tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#ReplyToReview-pills'+ list[i].id + '">';
				tempHtml += '<div class="ReplyToReview">Reply to review</div>';
			tempHtml += '</a>';
		tempHtml += '</li>';
		*//******************************respond to review pill************************************//*
		
		tempHtml += '</li>';
		tempHtml += '<li class="">';
		tempHtml += '<a data-toggle="tab" class="userPrimeAction" onclick="openBroadcasts('+list[i].id+')" href="#Broadcast-pills'+ list[i].id + '">';
		tempHtml += '<div class="BroadcastIcon">Broadcast</div>';
		tempHtml += '</a>';
		tempHtml += '</li>';

		tempHtml += '</ul>';
		tempHtml += '<div class="tab-content">';

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
		tempHtml += '<button id="Save" onclick="saveBroadcasts('
				+ list[i].id
				+ ')" class="btn btn-primary btn-sm float-right" type="button"> Done</button>';
		tempHtml += '<button onclick="closeBroadcasts(' + list[i].id+ ')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
		tempHtml += '</div>';
		tempHtml += '</div>';

		tempHtml += '<div id="Share-pills'+ list[i].id+ '" class="row SubHeading tab-pane fade">'
				+ '<div class="MediumNormalGreyContent col-xs-2">Share On:</div>'
				+ '<div id="shareDiv'
				+ list[i].id
				+ '" class="form-group col-xs-10 row">'
				+ '</div>'

				+ '<div class="col-xs-10 col-xs-offset-2 row">'
				+ '<div class="form-group input-group col-xs-12 footerButtons">'
				+ '<button id="Save" onclick="saveShare('+ list[i].id+ ')" class="btn btn-primary btn-sm" type="button"> Done</button>'
				+ '<button id="Cancel" onclick="closeShares('+ list[i].id+')" class="btn btn-default btn-sm" type="button"> Cancel</button>'
				+ '</div>' + '</div>' + '</div>';// END of Share

		// END of Share

		tempHtml += '<div id="Action-pills' + list[i].id
				+ '" class="SubHeading tab-pane fade">';
		tempHtml += '<div class="panel-body row">';
	

		tempHtml += '<ul class="nav nav-pills">'
				+ '<li class="active">'
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

				+ '</li>'
				+ '<li class="active">'
				+ '<a data-toggle="tab" href="#Ticket-pills'
				+ list[i].id
				+ '" data-actiontype="Ticket" onclick="getComments('
				+ list[i].id
				+ ','
				+ $('#organizationName option:selected').val()
				+ ',this)">'
				+ '<span class="glyphicon glyphicon"> </span>'
				+ 'Raise a ticket'
				+ '</a>'
				+ '</li>'
				+ '<li class="">'
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
				+ '</li>'
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
				+ '<li class="">'
				+ '<a data-toggle="tab" onclick="showRespondModal('
				+ list[i].id
				+ ')" href="#Respond-pills'
				+ list[i].id
				+ '">'
				+ '<span class="glyphicon glyphicon"> </span>'
				+ 'Respond to reviews' + '</a>' + '</li>'
				
				+ '<li class="">'
				+ '<a data-toggle="tab" onclick="loadFlag('+ list[i].id + ')" href="#Flag-pills' + list[i].id + '">'
				+ '<span class="glyphicon glyphicon"> </span>'
				+ 'Flag' + '</a>' + '</li>'

				+ '</ul>';
		
		tempHtml += '<div class="Actiontitles" style="display:none" id="notesForTask_'
			+ list[i].id + '">' + '</div>'
			+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
			+ list[i].id + '">' + '</div>'
			+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
			+ list[i].id + '">' + '</div>'
			+ '<div class="Actiontitles" style="display:none" id="notesForGeneral_'
			+ list[i].id + '">' + '</div>';
		
		tempHtml += '<div class="tab-content">';
		
		tempHtml += '<div id="Flag-pills' + list[i].id + '" class="row  tab-pane ">';
		tempHtml+='<div class="Actiontitles">';
			tempHtml+='<div class="col-xs-12 form-horizontal">';
			
				
				tempHtml+='<div id="flagChkDiv_'+list[i].id+'" class="form-group col-xs-10 row">';
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
									+ list[i].id + '" type="checkbox"> Other</label></div>';
						} else {
							tempHtml += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
									+ list[i].id + '" type="checkbox"> Other</label></div>';
						}
				tempHtml+='</div>';
				
				
				tempHtml+='<div class="form-group">';
				tempHtml+='<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
				tempHtml+='<div class=" col-xs-12">';
					tempHtml+='<div class="">';
						tempHtml+='<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
					tempHtml+='</div>';
				tempHtml+='</div>';
			tempHtml+='</div>';

			tempHtml+='<div class="form-group input-group form-inline col-xs-12">';
				tempHtml+='<button onclick="saveFlag(' + list[i].id + ')"  id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
				tempHtml+='<button onclick="cancelFlag(' + list[i].id + ')"  id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
			tempHtml+='</div>';
		tempHtml+='</div>';
	
		tempHtml+='</div>';
	tempHtml+='</div>';

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
				+ list[i].id + '" class="form-control input-sm">'
				+ '<option selected disabled>Select a Department</option>';
		for (var k = 0; k < departmentList.length; k++) {
			tempHtml += '<option data-reviewid="' + list[i].id
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
				+ '<option>Select Employee</option>'
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
				+ '<button id="CancelTask" onclick="closeActions('+list[i].id+')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
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
				+ '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>'
				+ '<div class="col-xs-4">'
				+ '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
				+ list[i].id + '" class="form-control input-sm">'
				+ '<option selected disabled>Select a Department</option>';
		for (var k = 0; k < departmentList.length; k++) {
			tempHtml += '<option data-reviewid="' + list[i].id
					+ '" value="' + departmentList[k].id + '">'
					+ departmentList[k].departmentName + '</option>';
		}
		tempHtml += '</select>' + '</div>'
				+ '<div id="employeeDivForTicket_'
				+ list[i].id
				+ '" class="col-xs-5">'
				+ '<select id="employeeForTicket_'
				+ list[i].id
				+ '" class="form-control input-sm">'
				+ '<option>Select Employee</option>'
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
				+ '<div class="form-group input-group form-inline col-xs-12">'
				+ '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
				+ list[i].id
				+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
				+ '<button id="CancelTicket" onclick="closeAction('+list[i].id+')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
				+ '</div>' + '</div>';
		tempHtml += '</div>';// End Of Ticket Pill
		
		
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
		+ '<option value="" >Select Employee</option>'
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
				+ '<select onchange="populateEmployeesForNotifys(this)" id="departmentForNotify_'
				+ list[i].id + '" class="form-control input-sm">'
				+ '<option selected disabled>Select a Department</option>';
		for (var k = 0; k < departmentList.length; k++) {
			tempHtml += '<option data-reviewid="' + list[i].id
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
				+ '<option>Select Employee</option>'
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
				+ '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotifys('
				+ list[i].id
				+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
				+ '<button id="CancelNotify" onclick="closeActions('+list[i].id+')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
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
				+ '<select onchange="populateEmployeesForGenerals(this)" id="departmentForGeneral_'
				+ list[i].id + '" class="form-control input-sm">'
				+ '<option selected disabled>Select a Department</option>';
		for (var k = 0; k < departmentList.length; k++) {
			tempHtml += '<option data-reviewid="' + list[i].id
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
				+ '<option>Select Employee</option>'
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
				+ '<button id="CancelGeneral" onclick="closeActions('+list[i].id+')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
				+ '</div>' + '</div>';
		tempHtml += '</div>';// End Of General Pill

		tempHtml += ' <div id="Respond-pills' + list[i].id + '" class="row Actiontitles tab-pane">';
		tempHtml += '<div id="respondModal_'
				+ list[i].id
				+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+ '<div class="modal-dialog modal-lg">'
				+ '<div class="modal-content">'
				+ '<div class="modal-header">'
				+ '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>'
				+ '<h4 id="myLargeModalLabel" class="modal-title">Respond To Reviews</h4>'
				+ '</div>'
				+ '<div class="modal-body row">'
				+ '<div class="row col-xs-12 SingleReviewList">'
				+ '<div data-reviewid="'+list[i].id+'" class="col-xs-12 col-sm-3 col-lg-2 LightBlue">'
				+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
				+ list[i].repufactorScore.toFixed(1) + '%</span> </div>'
				+ '</div>'
				+ '<div class="col-xs-12 col-sm-9 col-lg-10">';
		if (list[i].reviewTitle != null) {
			tempHtml += '<h3 class="SingleReviewHeader">'
					+ list[i].reviewTitle + '</h3>';
		}
		tempHtml += '<p>'
				+ list[i].highlightedReviewContent
				+ +'</p>'
				+ '<div class="form-group input-group col-xs-12">'
				+ '<textarea id="respond_'+list[i].id+'" placeholder="Enter your respon here" maxlength="250" class="form-control input-sm"></textarea>'
				+ '</div>'
				+ '<div class="form-group input-group form-inline col-xs-12">'
				+ '<div id="validationMessageDiv" ></div>'
				+ '<button id="Save" onclick="respondToReview('+list[i].id+','+list[i].sourceId+')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>'
				+ '<button data-dismiss="modal" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
				+ '</div>' + '</div>' + '</div>' + '</div>' + '</div>'
				+ '</div>' + '</div>';
		tempHtml += ' </div>';

		tempHtml += '</div>';
		tempHtml += '</div>';
		tempHtml += '</div>';
		
		
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
								tempHtml += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
								tempHtml += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>';
								break;
							}
							if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
								tempHtml += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
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
						
						+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>'

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
										if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
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
										+ list[i].maxOverallRating
										+ '</span>'
										
										+ '<span><img src="../resources/images/holidayiqLogo.png"></span>';
										if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
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
										+ list[i].maxOverallRating
										+ '</span>';
										
										if(list[i].respondStatus==true){
											tempHtml += '<span style="float:right;color:red;">Replied To Review</span>';
										}else{
											tempHtml += '<span id="repliedToReview_'+list[i].id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
										}
								tempHtml += '</div>';
							}
				}
						tempHtml += '<div id="sourceKPIRating'+list[i].id+'" class="SourceKPIRating col-xs-12">';
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
						}
						
						
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
				+ list[i].id + '"  class="form-control input-sm">'
				+ '<option selected disabled>Select a Department</option>';
		for (var k = 0; k < departmentList.length; k++) {
			tempHtml += '<option value="' + departmentList[k].id + '">'
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
				+ '<button id="Cancel" onclick="closeNotes('+list[i].id+')" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
				+ '</div>' + '</div>' + '</div>';// END of QuickNote

		tempHtml += '</div>';

		tempHtml += '</div>';
		tempHtml += '</div>';// END of On action
*/
		
		
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
		if (rr.successObject.DEPARTMENTS.length == 0) {
			tempHtml += '<a class="userPrimeAction" data-toggle="tab" onclick="return false;" href="#Note-pills'
					+ list[i].id + '">';
			tempHtml += '<div class="ReviewNoteIcon">Quick Note</div> ';
			tempHtml += '</a>';
		} else {
			tempHtml += '<a class="userPrimeAction" onclick="openNote('
					+ list[i].id + ','
					+ $('#organizationName option:selected').val()
					+ ')" data-toggle="tab" href="#Note-pills'
					+ list[i].id + '">';
			tempHtml += '<div class="ReviewNoteIcon">Quick Note</div> ';
			tempHtml += '</a>';
		}
		tempHtml += '</li>';
		tempHtml += '<li >';
		if (rr.successObject.DEPARTMENTS.length == 0
				|| rr.successObject.USERS.length == 0) {
			tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task"  onclick="return false;" href="#Action-pills'	+ list[i].id + '">';
			//tempHtml += '<a data-toggle="tab" class="userPrimeAction" data-actiontype="Task" onclick="getComments('	+ list[i].id+ ','+ $('#organizationName option:selected').val()	+ ',this)" onclick="return false;" href="#Action-pills'	+ list[i].id + '">';
			tempHtml += '<div class="ReviewActionIcon">Action</div>';
			tempHtml += '</a>';
		} else {
			tempHtml += '<a data-toggle="tab" class="userPrimeAction" href="#Action-pills'
					+ list[i].id + '">';
			tempHtml += '<div class="ReviewActionIcon">Action</div>';
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
				tempHtml += '<div class="ReplyToReview">Reply to review</div>';
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
						tempHtml += '<a  class="filterButton" onclick="respondToDirect('+list[i].id+')" href="//'+list[i].sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
					tempHtml += '</li>';
				}
					tempHtml += '<li class="">';
						tempHtml += '<a type="button" onclick="showRespondModal('+list[i].id+',\'reviewer\')" class="filterButton" >Direct Respond to Reviewer</a>';
					tempHtml += '</li>';
					tempHtml += '<li class="">';
						tempHtml += '<a type="button" onclick="showRespondModal('+list[i].id+',\'reviewSource\')" >Respond by email to Review Source</a>';
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
				+ '<li class="">'
				+ '<a data-toggle="tab" href="#Ticket-pills'
				+ list[i].id
				+ '" data-actiontype="Ticket" onclick="getComments('
				+ list[i].id
				+ ','
				+ $('#organizationName option:selected').val()
				+ ',this)">'
				+ '<span class="glyphicon glyphicon"></span>'
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
				+ '<a data-toggle="tab" onclick="loadFlags('
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
				+ '" class="row  tab-pane ">';
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
						tempHtml += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
						tempHtml += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">' + list[i].repufactorScore.toFixed(2) + '%</span> </div>';
						break;
					}
					if (Math.round(list[i].repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(list[i].repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
						tempHtml += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+ list[i].repufactorScore.toFixed(2) + '%</span> </div>';
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
				
				
				
				
				
					/*+ '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'+ list[i].repufactorScore.toFixed(2) + '%</span> </div>'*/
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
		$("#hotelReviewsDivId").append(tempHtml).show();
		$('span.stars').stars();
	}}
	$('.ShowSemanticPolarity').click(function() {
		var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		console.log(keywordDivId+" 1");
		if($("#"+keywordDivId).hasClass("OnSeleceActive") ){
             $("#"+keywordDivId).removeClass("OnSeleceActive");
              
	    }else{
	           $("#"+keywordDivId).addClass("OnSeleceActive");
	    }
});
}
function getSentimentPolarityList(){
	$.ajax({
		type : "GET",
		url : "../sentimentPolarityConfig/list.htm",
		contentType : "application/json",
		success : function(response) {console.log(response);
			sentimentPolarityList = response.successObject.sentimentPolarityList;
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

function getMappedSourcesForOrganizations(reviewId, mappedSourceList) {
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
			getMappedSourcesForOrganizations(reviewId, mappedSourceList);
		},
		error : function(response) {
			return false;
		}
	});
}

function loadFlag(reviewId){
	$("#notesForTask_"+reviewId).hide();
	$("#notesForTicket_"+reviewId).hide();
	$("#notesForNotify_"+reviewId).hide();
	$("#notesForGeneral_"+reviewId).hide();
	
}
function closeBroadcasts(reviewId){
	document.getElementById('Broadcast-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane fade" );
}

function openBroadcasts(reviewId){
	document.getElementById('Broadcast-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane active" );
}

function closeShares(reviewId){
	document.getElementById('Share-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane fade" );
}

function openShares(reviewId){
	getMappedSourcesForReview(reviewId);
	document.getElementById('Share-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane active" );
}
function closeNotes(reviewId){
	document.getElementById('Note-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane fade" );
}

/*function closeActions(reviewId){
	document.getElementById('Action-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane fade" );
}*/

function openActions(reviewId){
	document.getElementById('Action-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane active" );
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
		$('#notificationReviewSuccessModalTitle').text("ALERT");
		$('#notificationReviewSuccessModalText').text("Please Select one reason!");
		$('#notificationReviewSuccessModal').modal('show');
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
				$('#notificationReviewSuccessModalTitle').text("Success");
				$('#notificationReviewSuccessModalText').text("Flag Sent Successfully!");
				$('#notificationReviewSuccessModal').modal('show');
				closeActions(reviewId);
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
	$('#hotelReviewsDivId').hide();
	$('#hotelReviewsDivId').html(restoreHotelReviewsDivIdHtml);
	$("#notificationsBredcrumb").remove();
	$("#page-selection").show();
	var barHtmlCode = '<div class="row" id="notificationsBredcrumb">'
		+ '<div class="col-lg-12 SubHeading SmallDarkGreyHeader"><span> <a href="../notifications/showNotifications.htm">Notifications</a></span>'
		+ ' <span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span><span>Reviews</span></div>' + '</div>';
	$('#reviewsBredcrumb').hide();
	$('#hotelReviewsDivId').prepend(barHtmlCode).show();
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

	$('.ShowSemanticPolarity').click(function() {
		var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		console.log(keywordDivId+" 5");
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
/*function closeBroadcast(reviewId){
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
}*/

function openNote(reviewId,organizationId){
	getNotes(reviewId,organizationId);
	document.getElementById('Note-pills'+reviewId).setAttribute( "class", "row SubHeading tab-pane active" );
}


/*function respondToReview(reviewId,sourceId){
	$.ajax({
		type : "POST",
		url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
		contentType : "application/json",
		success : function(response) {
			if(response.status=="LIST_SUCCESS"){
				var review=response.successObject.review;
				console.log(review);
				var reviewId = "" + review.id;
				var sourceId = "" + review.sourceId;
				var organizationId = $('#organizationName option:selected').val();
				var respond = $('#respond_' + reviewId).val();
				if ($('#respond_' + reviewId).val() == null
						|| $('#respond_' + reviewId).val() == ""
						|| $('#respond_' + reviewId).val() == " ") {
					var htmlCode = '<p><font size="3" color="red">Please Enter Response to review.</font></p>';
					$('#validationMessageDiv_' + reviewId).html(htmlCode);
					$('#validationMessageDiv_' + reviewId).show();
				} else {
					var reviewResponseUI = {
						'organizationId' : organizationId,
						'reviewSiteContentId' : reviewId,
						'reviewContent' : review.highlightedReviewContent,
						'response' : respond,
						'sourceId' : sourceId
					};
					$.ajax({
								type : "POST",
								url : "../reviewSitesContent/respondToReview.htm",
								contentType : "application/json",
								data : JSON.stringify(reviewResponseUI),
								success : function(response) {
									if (response.status == "SAVE_SUCCESS") {
										$('#notificationReviewSuccessModalTitle').text("Success");
										$('#notificationReviewSuccessModalText').text("Respond successfully has been mailed !");
										$('#notificationReviewSuccessModal').modal('show');
										$('#respond_' + reviewId).val('');
										$('#validationMessageDiv_' + reviewId).hide();
									} else {
										if (response.status == "SAVE_ERROR") {
											$('#notificationReviewSuccessModalTitle').text("Error");
											$('#notificationReviewSuccessModalText').text(response.errorMessage);
											$('#notificationReviewSuccessModal').modal('show');
											if (response.errorMessage == "Email adress not found for selected source, Please contact admin ! ") {
												$('#validationMessageDiv_' + reviewId).hide();
											}
										}
									}
								},
								error : function(response) {
									$('#notificationReviewSuccessModalTitle').text("Error");
									$('#notificationReviewSuccessModalText').text("Something went wrong , please contact admin !");
									$('#notificationReviewSuccessModal').modal('show');
								}
							});
				}
			
			}
		}
	});
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
									+ commentsList[i].actionType
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

function populateEmployeesForNotifys(obj) {
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
function populateEmployeesForGenerals(obj) {
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
				$('#notificationReviewSuccessModalTitle').text("Success");
				$('#notificationReviewSuccessModalText').text("Posted Successfully!");
				$('#notificationReviewSuccessModal').modal('show');
				document.getElementById("shareCountSpan" + reviewId).innerHTML = 'Share'
					+ '(' + reviewSourceMapping.length + ')';
			}else{
				if(response.status == "SAVE_ERROR"){
					$('#notificationReviewSuccessModalTitle').text("ALERT");
					$('#notificationReviewSuccessModalText').text("something went wrong please contact admin !");
					$('#notificationReviewSuccessModal').modal('show');
				}
			}
		},
		error : function(response) {
			$('#notificationReviewSuccessModalTitle').text("ALERT");
			$('#notificationReviewSuccessModalText').text("Something went wrong please contact admin!");
			$('#notificationReviewSuccessModal').modal('show');
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
				$('#notificationReviewSuccessModalTitle').text("Success");
				$('#notificationReviewSuccessModalText').text("Broadcast status set successfully!");
				$('#notificationReviewSuccessModal').modal('show');
			}else{
				$('#notificationReviewSuccessModalTitle').text("Success");
				$('#notificationReviewSuccessModalText').text("Broadcast status set successfully!");
				$('#notificationReviewSuccessModal').modal('show');
			}
		},
		error : function(response) {
			$('#notificationReviewSuccessModalTitle').text("ALERT");
			$('#notificationReviewSuccessModalText').text("something went wrong please contact admin!");
			$('#notificationReviewSuccessModal').modal('show');
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
	$.ajax({
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

function saveNoteForTask(reviewId, obj) {
	var organizationId = $('#organizationName option:selected').val();
	var noteVale = $.trim($("#noteForTask_" + reviewId).val());
	var departmentOptionValue = $("#departmentForTask_" + reviewId).val();
	var employeeOptionValue = $("#employeeForTask_" + reviewId).val();
	var dateTimeValue = $.trim($("#datetimepickerForTask_" + reviewId).val());

	if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null
			|| employeeOptionValue == null) {
		$('#notificationReviewSuccessModalTitle').text("ALERT");
		$('#notificationReviewSuccessModalText').text("Mandatory fileds(*) are required !");
		$('#notificationReviewSuccessModal').modal('show');
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
			$('#notificationReviewSuccessModalTitle').text("Error");
			$('#notificationReviewSuccessModalText').text("Something went wrong , please contact admin !");
			$('#notificationReviewSuccessModal').modal('show');
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
		
		$('#notificationReviewSuccessModalTitle').text("ALERT");
		$('#notificationReviewSuccessModalText').text("Mandatory fileds(*) are required !");
		$('#notificationReviewSuccessModal').modal('show');
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
				$('#notificationReviewSuccessModalTitle').text("ALERT");
				$('#notificationReviewSuccessModalText').text("Mandatory fileds(*) are required !");
				$('#notificationReviewSuccessModal').modal('show');
			}else{
				$('#notificationReviewSuccessModalTitle').text("Error");
				$('#notificationReviewSuccessModalText').text("Something went wrong , please contact admin !");
				$('#notificationReviewSuccessModal').modal('show');
			}
		},
		error : function(response) {
			$('#notificationReviewSuccessModalTitle').text("Error");
			$('#notificationReviewSuccessModalText').text("Something went wrong , please contact admin !");
			$('#notificationReviewSuccessModal').modal('show');
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
		$('#notificationReviewSuccessModalTitle').text("ALERT");
		$('#notificationReviewSuccessModalText').text("Mandatory fileds(*) are required !");
		$('#notificationReviewSuccessModal').modal('show');
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
				/*$("#departmentForNotify_" + reviewId).prop('selectedIndex', 0);
				$("#employeeForNotify_" + reviewId).prop('selectedIndex', 0);
				$("#datetimepickerForNotify_" + reviewId).val("");
				$("#noteForNotify_" + reviewId).val("");*/
				$('#notificationReviewSuccessModalTitle').text("Success");
				$('#notificationReviewSuccessModalText').text("Action Shared Successfully");
				$('#notificationReviewSuccessModal ').modal('show');
			}
		},
		error : function(response) {
			$('#notificationReviewSuccessModalTitle').text("Error");
			$('#notificationReviewSuccessModalText').text("Something went wrong , please contact admin !");
			$('#notificationReviewSuccessModal ').modal('show');
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
}*/

/*function showRespondModal(reviewId) {
	$("#notesForTask_" + reviewId).hide();
	$("#notesForTicket_" + reviewId).hide();
	$("#notesForNotify_" + reviewId).hide();
	$("#notesForGeneral_" + reviewId).hide();
	$('#respondModal_' + reviewId).modal('show');
}*/

/*function resetRespond(reviewId) {
	$('#validationMessageDiv_' + reviewId).hide();
	$('#respond_' + reviewId).val('');
}*/
function closeAction(reviewId) {
	
}
function saveFlag(reviewId) {
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
				$('#broadcastSuccessModalText').text("Review has been flaged !");
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