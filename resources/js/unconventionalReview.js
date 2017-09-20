var pageNo = 1;
var searchText = "";
var listOfMentions;
var filterResponse;
var MentionsSearchContentList = [];
var sessionSelectedOrganizationId=0;
$(document).ready(function() {
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDate",
		altFormat: "mm/dd/yy",
		
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
		onClose : function(selectedDate) {
			$("#from").datepicker("option", "maxDate", selectedDate);
			 dateValidationForm();
		}
	});
	getSessionData().then(function(){
	poplateOrganizations(function(selectedOrgId) {
		showUnconventionalReviews(selectedOrgId);
	});
	})
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showUnconventionalReviews(organizationId);
	saveSessionDatas();
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
var unconventionalReviewList = [];
function showUnconventionalReviews(organizationId){
	loadingForDashBoard();
	$("#dashboardUnconventionalReview").html('');
	$('#page-selection').html('');
	//$('#wrapper').mask('Loading...');
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../review/list.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			console.log(response);
			unloadingForDashBoard();
			if(response.length>0){
				for(var i=0;i<response.length;i++){
					if(((response[i].reviewTitle !=null)&&(response[i].reviewContent !=null))||((response[i].reviewTitle==null)&&(response[i].reviewContent !=null))||((response[i].reviewTitle !=null)&&(response[i].reviewContent==null))){
						unconventionalReviewList.push(response[i]);
					}
				}
				if(unconventionalReviewList.length>0){
					//listOfMentions = JSON.parse(JSON.stringify(unconventionalReviewList));
					listOfMentions =unconventionalReviewList;
					console.log(listOfMentions);
					filterResponse = null;
					var noOfPages = 0;
					if(listOfMentions.length%10  == 0 && listOfMentions.length >0){
						noOfPages = listOfMentions.length/10;
					}else{
						noOfPages = (listOfMentions.length/10)+1;
					}
					begin = 0;
					end = 10;
					/*if(listOfMentions.length<10){
						noOfPages = listOfMentions.length;
						end = listOfMentions.length;
					}*/
					if(end > listOfMentions.legth){
			    		end = listOfMentions.length;
			    	}
			    	
				    $('#page-selection').bootpag({
				        total: noOfPages,
				        page: 1,
				        maxVisible: 10
				    }).on("page", function(event,num){
				    	begin = ((num-1)*10);
				    	end=(num)*10;
				    	if(end > listOfMentions.legth){
				    		end = listOfMentions.length;
				    	}
				    	getMentionsPerPage(begin, end);
				    });
				    getMentionsPerPage(begin, end);
				}
				//store it in a variable metions
				//calculate number of pages
				//getMentionsPerPage(pagenum, limit);
				//start = (1-1)*10+1;
				//end = 1*10;
			}else{
				$('#unconventionalReviewSearchId').html('');
				$('#filterBar').html('');
				$('#dashboardUnconventionalReview').html('<h4><font color="red">No data found!!!</font></h4>');
			}
			$('#wrapper').unmask();	
		},
		error: function(jqXHR, exception) {
			unloadingForDashBoard();
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
function getMentionsPerPage(begin, end){
	var sublist = [];
	for(var i=begin;i<end;i++){
		sublist.push(listOfMentions[i]);
		console.log(sublist);
	}
	$("#dashboardUnconventionalReview").html('');
	for(var j=0; j<sublist.length; j++){
		if(sublist[j]!=undefined)
		{
			var html = "";
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
			if(sublist[j].sourceName!=null && sublist[j].sourceName!="")
			{
				html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+sublist[j].sourceName+'</div>';
				
			}else{
				html += '<div class="reviewerName"></div>';
			}
			console.log(sublist[j].sourceName);
			html += '<div class="reviewDetails row">';
			if(sublist[j].reviewerName!=null && sublist[j].reviewerName!=""){
				html += '<div class="reviewerName">by <span>'+sublist[j].reviewerName+'</span></div>';
			}else{
				html += '<div class="reviewerName">by Anonymous</div>';
			}
			if(sublist[j].reviewLocation!=null && sublist[j].reviewLocation!=""){
				html += '<div class="reviewerDetail">from <span>'+sublist[j].reviewLocation+'</span></div>';
			}else{
				html += '<div class="reviewerDetail">Unknown Location</div>';
			}
			html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
			html += '</span> '+$.datepicker.formatDate('d M yy',new Date(sublist[j].reviewTime))+'</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			if(sublist[j].reviewTitle!=null){
				html += '<h3 class="SingleReviewHeader">'+sublist[j].reviewTitle+'</h3>';
			}else{
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
			html += '<p>'+sublist[j].reviewContent+'</p>';
			
			
			
			
			
			// star review rating from Review content site table
			if(sublist[j].reviewOverallRating!=null && sublist[j].reviewOverallRating!="")
				{
				
				html += '<div class="SourceRating col-xs-12">';
				html += '<span>Source Rating </span><span data-review-rating="'
						+ sublist[j].reviewOverallRating
						+ '" data-maximum-rating="'
						+ sublist[j].maxOverallRatting
						+ '" class="stars">'
						+ sublist[j].reviewOverallRating
						+ '</span><span>'
						+ sublist[j].reviewOverallRating
						+ '/'
						+ sublist[j].maxOverallRatting + '</span>';
						
				html += '</div>';
				
				}else{
					
				}
			
			//error message div
			html += '<div class="">';
			html += ' <div id="selectedSocilaMentionsFiltersDiv" class="col-lg-12 SubHeading">';
			if(sublist[j].errorMessage!=null){
			html += ' <span class="fa fa-exclamation-circle" style="color:red">  <span style="font-size:15px">'+sublist[j].errorMessage+'</span> </span>';
			}else{
				html += '<h4 class="SingleReviewHeader" ></h3>';	
			}
			html += ' </div>';
			html += '</div>';
			
			
			html += '</div>';
			html += '</div>';
			
			$("#dashboardUnconventionalReview").append(html).show();
			$('span.stars').stars();
			
		}
		
	
	}
}
var stoppedTyping;
function SearchUnconventionalReview(){
	if (stoppedTyping) clearTimeout(stoppedTyping);
	stoppedTyping = setTimeout(function(){
		
		/*loadingForDashBoard();
		$('#wrapper').mask('Loading');*/
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		$('#leftNavigation,#wrapper,#header').unmask();	
		
		var searchKey = $("#searchInputValue").val();
		if ($.trim(searchKey) == "" || searchKey == null) {
			searchKey="";
		}
		var response;
		var resultListMentions = [];
		if(filterResponse==null){
			response = JSON.parse(JSON.stringify(listOfMentions));
			for (var i = 0;i<response.length; i++) {
				var item = response[i];
				if (item.reviewContent == null)
					item.reviewContent = "";
				if (item.reviewTitle == null)
					item.reviewTitle = "";
				if (searchKey!="" && ( item.reviewContent.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.reviewContent = item.reviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.reviewTitle = item.reviewTitle.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					resultListMentions.push(item);
				}else{
					if(searchKey==""){
						resultListMentions.push(item);
					}
				}
			}
		}else{
			response = JSON.parse(JSON.stringify(filterResponse));
			for (var i = 0;i<response.length; i++) {
				var item = response[i];
				if (item.reviewContent == null)
					item.reviewContent = "";
				if (item.reviewTitle == null)
					item.reviewTitle = "";
				if (searchKey!="" && ( item.reviewContent.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.reviewContent = item.reviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.reviewTitle = item.reviewTitle.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					resultListMentions.push(item);
				}else{
					if(searchKey==""){
						resultListMentions.push(item);
					}
				}
			}
		}
		var successObjectTemp = resultListMentions;
		response = successObjectTemp;
		var totalMentions = response;
		var noOfPages = 0;
		if (totalMentions.length % 10 == 0
				&& totalMentions.length > 0) {
			noOfPages = totalMentions.length / 10;
		} else {
			noOfPages = (totalMentions.length / 10) + 1;
		}
		begin = 0;
		end = 10;
		if (end > totalMentions.legth) {
			end = totalMentions.length;
		}

		$('#page-selection')
				.bootpag({
					total : noOfPages
				}).on("page",function(event,num) {
							begin = ((num - 1) * 10);
							end = (num) * 10;
							if (end > totalMentions.legth) {
								end = totalMentions.length;
							}
							var successObject = response.slice(begin, end);
							
							var response2 = successObject;

							var tempHtml = listsearchedMentionsResponse(
									response2, searchText);
							$('#dashboardSocialMentions').append(tempHtml);
							$('span.stars').stars();
							
			});
		
		var successObject = response.slice(0,10);
		var response2 = successObject;
		var tempHtml = listsearchedMentionsResponse(response2, searchText);
		$('#dashboardUnconventionalReview').append(tempHtml);
		$('span.stars').stars();
		
	},300);
}

function listsearchedMentionsResponse(resultListMentions, searchText) {
	$('#dashboardUnconventionalReview').html('');
	var html = "";
	if (resultListMentions.length > 0) {
		for (var j = 0; j < resultListMentions.length; j++) {
			var reviewTitle = "";
			var reviewContent = "";
			reviewTitle = resultListMentions[j].reviewTitle;
			reviewContent = resultListMentions[j].reviewContent;
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
			html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+resultListMentions[j].sourceName+'</div>';
			html += '<div class="reviewDetails row">';
			if(resultListMentions[j].reviewerName!=null && resultListMentions[j].reviewerName!=""){
				html += '<div class="reviewerName">by <span>'+resultListMentions[j].reviewerName+'</span></div>';
			}else{
				html += '<div class="reviewerName">by Annonymus</div>';
			}
				
			if(resultListMentions[j].reviewLocation!=null && resultListMentions[j].reviewLocation!=""){
				html += '<div class="reviewerDetail">from <span>'+resultListMentions[j].reviewLocation+'</span></div>';
			}else{
				html += '<div class="reviewerDetail">Unknown Location</div>';
			}
			html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
			html += '</span> '+$.datepicker.formatDate('d M yy',new Date(resultListMentions[j].reviewTime))+'</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			if(reviewTitle!=null && reviewTitle!=""){
				html += '<h3 class="SingleReviewHeader">'+reviewTitle+'</h3>';
			}else{
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
			html += '<p>'+reviewContent+'</p>';
			//html += '</div>';
			//html += '</div>';
			
			
			
			
			
			// star review rating from Review content site table
			if(resultListMentions[j].reviewOverallRating!=null && resultListMentions[j].reviewOverallRating!="")
			{
				html += '<div class="SourceRating col-xs-12">';
				html += '<span>Source Rating </span><span data-review-rating="'
						+ resultListMentions[j].reviewOverallRating
						+ '" data-maximum-rating="'
						+ resultListMentions[j].maxOverallRatting
						+ '" class="stars">'
						+ resultListMentions[j].reviewOverallRating
						+ '</span><span>'
						+ resultListMentions[j].reviewOverallRating
						+ '/'
						+ resultListMentions[j].maxOverallRatting + '</span>';
						
				html += '</div>';
			}else {
				
			}
			
			//error message div
			html += '<div class="">';
			html += ' <div id="selectedSocilaMentionsFiltersDiv" class="col-lg-12 SubHeading">';
			if(resultListMentions[j].errorMessage!=null){
			html += ' <span class="fa fa-exclamation-circle" style="color:red">  <span style="font-size:15px">'+resultListMentions[j].errorMessage+'</span> </span>';
			}else{
				html += '<h4 class="SingleReviewHeader" ></h3>';	
			}
			html += ' </div>';
			html += '</div>';
			
			
			html += '</div>';
			html += '</div>';
			
			
			//html += '</div>';
			html += '</div>';
						
			
			
		} 
		//$('#dashboardUnconventionalReview').empty();
	}else {
		html += '<font style="color:red">No Mentions Found </font>';
	}
	return html;
}
function highlightMentionsSearchText(searchText,highlightedSearchText){
	var term = searchText;
	term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
	var pattern = new RegExp("("+term+")", "gi");
	highlightedSearchText = highlightedSearchText.replace(pattern, "<mark>$1</mark>");
	highlightedSearchText = highlightedSearchText.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
	return highlightedSearchText;
}
function filterUnconventionalReview(pageNo){
	//$('#unconventionalfilterModal').html('');
	var sources = [];
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var organizationId = $('#organizationName option:selected').val();
	
	/*$('.unconventionalReviewMentions:checked').each(function() {
		//sources.push($(this).val());
		sources.push($(this).attr("id"));
		
    });
	*/
	
	$('input:checkbox.unconventionalReviewMentions').each(function () {
	       var sThisVal = (this.checked ? $(this).attr("id") : "");
	      if(sThisVal!=""){
	    	  alert(sThisVal);
	       sources.push(sThisVal);
	      }
	  });
	
	console.log("coming inside filter sources length:  "+sources.length);
	var socialMentionsFilterUI = {
			'sources' : sources,
			'organizationId' : organizationId,
			'fromDate' : fromDate,
			'toDate' : toDate,
		};
	console.log(socialMentionsFilterUI);
	$.ajax({
		type:"POST",
		url:"../review/getFilterUnconventionalReview.htm",
		contentType:"application/json",
		data:JSON.stringify(socialMentionsFilterUI),
		success:function(response){
			//var v=response;
			//console.log(response);
			//console.log("comming");
			//$('#dashboardUnconventionalReview').html('');
			$('#unconventionalReviewsSourcesDiv').html('');
			if(response.length>0){
				var filteredMentionsList = [];
				for(var j=0;j<response.length;j++){
					if(((response[j].reviewTitle !=null)&&(response[j].reviewContent !=null))||((response[j].reviewTitle==null)&&(response[j].reviewContent !=null))||((response[j].reviewTitle !=null)&&(response[j].reviewContent==null))){
						filteredMentionsList.push(response[j]);
					}
				}
				if(filteredMentionsList.length>0){
					filterResponse = JSON.parse(JSON.stringify(filteredMentionsList));
					var totalFilteredMentions = filteredMentionsList;
					var noOfPages = 0;
					if(totalFilteredMentions.length%10  == 0 && totalFilteredMentions.length >0){
						noOfPages = totalFilteredMentions.length / 10;
					}else{
						noOfPages = (totalFilteredMentions.length / 10) + 1;
					}
					begin = 0;
					end = 10;
					if(end > totalFilteredMentions.legth){
			    		end = totalFilteredMentions.length;
			    	}
					$('#page-selection')
					.bootpag({
						total : noOfPages
					})
					.on("page",function(event,  page /*number here num*/) {
								begin = ((num - 1) * 10);
								end = (num) * 10;
								console.log("inside page function....");
								if (end > totalFilteredMentions.legth) {
									end = totalFilteredMentions.length;
								}
								var successObject = filteredMentionsList.slice(begin, end);
								var response2 = successObject;
								var tempHtml = listFilteredMentionsResponse(response2, searchText);
								$('#dashboardUnconventionalReview').append(tempHtml);
					});
					var successObject = filteredMentionsList.slice(0, 10);
					var response2 = successObject;
					var tempHtml = listFilteredMentionsResponse(response2, searchText);
					$('#dashboardUnconventionalReview').append(tempHtml);
					$('span.stars').stars();
				}
			}
		}
	});
}
function listFilteredMentionsResponse(FilteredtMentions, searchText) {
	$('#dashboardUnconventionalReview').html('');
	var html = "";
	console.log("inside listFilteredMentionsResponse()......");
	if (FilteredtMentions.length > 0) {
		for (var j = 0; j < FilteredtMentions.length; j++) {
			console.log("hiii....");
			//console.log(filteredMentionsList);
			var reviewTitle = "";
			var reviewContent = "";
			/*if (searchText != "") {
				reviewTitle = highlightMentionsSearchText(searchText,resultListMentions[j].reviewTitle);
				reviewContent = highlightMentionsSearchText(searchText,resultListMentions[j].reviewContent);
			} else {
				reviewTitle = resultListMentions[j].reviewTitle;
				reviewContent = resultListMentions[j].reviewContent;
			}*/
			reviewTitle = FilteredtMentions[j].reviewTitle;
			reviewContent = FilteredtMentions[j].reviewContent;
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
			html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+FilteredtMentions[j].sourceName+'</div>';
			html += '<div class="reviewDetails row">';
			if(FilteredtMentions[j].reviewerName!=null && FilteredtMentions[j].reviewerName!="")
			{
				html += '<div class="reviewerName">by <span>'+FilteredtMentions[j].reviewerName+'</span></div>';
			}else{
				html += '<div class="reviewerName">by Anonymous</div>';
				
				}
			
			if(FilteredtMentions[j].reviewLocation!=null && FilteredtMentions[j].reviewLocation!=""){
				html += '<div class="reviewerDetail">from <span>'+FilteredtMentions[j].reviewLocation+'</span></div>';
			}else{
				html += '<div class="reviewerDetail">Unknown Location</div>';
			}
			html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
			html += '</span> '+$.datepicker.formatDate('d M yy',new Date(FilteredtMentions[j].reviewTime))+'</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			if(reviewTitle!=null){
				html += '<h3 class="SingleReviewHeader">'+reviewTitle+'</h3>';
			}else{
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
			html += '<p>'+reviewContent+'</p>';
			//html += ' </div>';
			
			
			
			

			// star review rating from Review content site table
			
			if(FilteredtMentions[j].reviewOverallRating!=null && FilteredtMentions[j].reviewOverallRating!="")
			{
				html += '<div class="SourceRating col-xs-12">';
				html += '<span>Source Rating </span><span data-review-rating="'
						+ FilteredtMentions[j].reviewOverallRating
						+ '" data-maximum-rating="'
						+ FilteredtMentions[j].maxOverallRatting
						+ '" class="stars">'
						+ FilteredtMentions[j].reviewOverallRating
						+ '</span><span>'
						+ FilteredtMentions[j].reviewOverallRating
						+ '/'
						+ FilteredtMentions[j].maxOverallRatting + '</span>';
						
				html += '</div>';
			
			}else{
				
			}
			
			//error message div
			html += '<div class="">';
			html += ' <div id="selectedSocilaMentionsFiltersDiv" class="col-lg-12 SubHeading">';
			if(FilteredtMentions[j].errorMessage!=null){
			html += ' <span class="fa fa-exclamation-circle" style="color:red">  <span style="font-size:15px">'+FilteredtMentions[j].errorMessage+'</span> </span>';
			}else{
				html += '<h4 class="SingleReviewHeader" ></h3>';	
			}
			html += ' </div>';
			html += '</div>';
			
			
			html += '</div>';
			html += '</div>';
			
			
			
			
			
			
			//html += '</div>';
			//html += '</div>';
		} 
		$('#dashboardUnconventionalReview').empty();
	}else {
		html += '<font style="color:red">No Mentions Found </font>';
	}
	return html;
}
function loadUnconventionalReviewFilterData(){
	$('#unconventionalReviewsSourcesDiv').html('');
	//$('#unconventionalfilterModal').html();
	console.log("coming inside load filter data");
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var organizationId = $('#organizationName option:selected').val();
	$.ajax({
		type : "POST",
		url : "../review/getFilterUnconventionalSource.htm",
		contentType : "application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success : function(response) {
			var sourceList = response;
			console.log("in side getFilterUnconventionalSource");
			console.log(sourceList);
			var htmlCode = '';
			for (var i = 0; i < sourceList.length; i++) {
				htmlCode += '<label class="col-sm-4" style="margin-top:10px">';
				console.log(sourceList[i].sourceName.toLowerCase() + 'SourceSpan');
				if(document.getElementById(sourceList[i].contentSourceId )!=null){	
					console.log('if part');
					htmlCode += '<input checked id="' + sourceList[i].contentSourceId + '" onclick="source(this)" class="unconventionalReviewMentions" type="checkbox" value="' + sourceList[i].sourceName + '">';
				}else{
					console.log('else part');
					htmlCode += '<input  id="' + sourceList[i].contentSourceId + '" onclick="source(this)" class="unconventionalReviewMentions" type="checkbox" value="' + sourceList[i].sourceName + '">';
				}
				htmlCode += '' + sourceList[i].sourceName + '';
				htmlCode += '</label>';
				
			}
			$('#unconventionalReviewsSourcesDiv').html(htmlCode);
		},
		error : function(response) {
			return false;
		}
});
}
function source(obj){
	console.log(obj);
	
	var id=$(obj).attr("id");
	var sourceName=$(obj).val();
	//console.log("source name:"+sourceName);
	var chkId=sourceName+"Chk";
	//console.log(chkId);
	var spanId=sourceName+"Span";
	console.log(spanId);
	var sourceName=sourceName.substring(0, spanId.length - 4);
	console.log(sourceName);
    if($(obj).prop('checked')){
        var htmlCode='<span id="'+id+'" class="ReviewFilterOutput">'+sourceName+'<button onclick="removeTag(\''+id+'\')" class="btn">x</button></span>';
       // console.log(htmlCode);
        $('#selectedSocilaMentionsFiltersDiv').prepend(htmlCode);
    }else{
    	$('#'+chkId).attr('checked', false);
        $('#'+id).remove();
        
       /* $('#unconventionalfilterModal').modal({
            show: 'false'
        });*/
        
        //loadUnconventionalReviewFilterData();
        
        //filter(pageNo);
    }
}



function removeTag(id){console.log(id);
	$('#'+id).attr('checked', false);
	console.log("inside remove.............");
	console.log($('#'+id).attr('checked', false));
	$('#'+id).remove();
    
    console.log(id);
    
   /* $('#unconventionalfilterModal').modal({
        show: 'false'
    });*/
    
    $.ajax({
    	   url: loadUnconventionalReviewFilterData(),
    	   success:function(){
    		   filterUnconventionalReview(pageNo);
    	}
    });
   
    
  
    
    
    
  
}