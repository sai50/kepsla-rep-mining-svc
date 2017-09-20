var pageNo = 1;
var searchText = "";
var listOfMentions;
var filterResponse;
var MentionsSearchContentList = [];
var sessionSelectedOrganizationId=0;
var runOnce=false;
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
	/*if(runOnce==false){
		getSessionData();
		runOnce=true;
	}*/
	poplateOrganizations(function(selectedOrgId) {
		showDashboardSocialMentions(selectedOrgId);
	});
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showDashboardSocialMentions(organizationId);
});
function setDefaults(){
		$("#from").datepicker("setDate","-1y");
		$("#to").datepicker("setDate",new Date());
}

/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	var selectedOrgId = 0;
	$.ajax({
		type:"GET",
		url:"../adminDashboard/getOrganizations.htm",
		contentType:"application/json",
		success:function(response){
		if(response.length==0)
		{
		$('#organizationName').append('<option>No Organization Mapped</option>');
		$('#page-wrapper').html('');
	 	$('#page-wrapper').append('<h4><font color="red">Organization Not mapped Please contact admin</font></h4>');
		$('#applyFilterBtn').prop('disabled',true);
		return false;
		}else{
		    // Get select
		    var select = document.getElementById('organizationName');
			
			if(sessionSelectedOrganizationId!=0){
				 // Add options
				for (var i in response) {
					if(response[i].id==sessionSelectedOrganizationId){
						$(select).append('<option value=' + response[i].id + ' selected="selected">' + response[i].organizationFullName + '</option>');
					}else{
						$(select).append('<option value=' + response[i].id + '>' + response[i].organizationFullName + '</option>');
					}
				}
				
			}else{
				 // Add options
				for (var i in response) {
					if(i==1){
						$(select).append('<option value=' + response[i].id + ' selected="selected">' + response[i].organizationFullName + '</option>');
					}else{
						$(select).append('<option value=' + response[i].id + '>' + response[i].organizationFullName + '</option>');
					}
				}
			}
			selectedOrgId=$('#organizationName option:selected').val();
			callback(selectedOrgId.toString());
		}}
	});
	
}
function showDashboardSocialMentions(organizationId){
	loadingForDashBoard();
	//$('#wrapper').mask('Loading...');
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../qualityControl/showDashboardSocialMentions.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){
			unloadingForDashBoard();
			if(response.length>0){
				var mentionsList = [];
				for(var i=0;i<response.length;i++){
					if(((response[i].title !=null)&&(response[i].content !=null))||((response[i].title==null)&&(response[i].content !=null))||((response[i].title !=null)&&(response[i].content==null))){
						mentionsList.push(response[i]);
					}
				}
				if(mentionsList.length>0){
					listOfMentions = JSON.parse(JSON.stringify(mentionsList));
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
						end = noOfPages.length;
					}*/
					if(end > listOfMentions.legth){
			    		end = listOfMentions.length;
			    	}
			    	
				    $('#page-selection').bootpag({
				        total: noOfPages,
				        page: 1,
				        maxVisible: 10 
				    }).on("page", function(event, /* page number here */ num){
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
				var tempHtml = '<font style="color:red">No Records Found </font>';
				

				var htmlCode='<ul class="pagination bootpag">'
								+'<li data-lp="1" class="prev disabled">'
									+'<a href="javascript:void(0);"><</a>'
								+'</li>'
								+'<li class="disabled" data-lp="1">'
									+'<a href="javascript:void(0);">1</a>'
								+'</li>'
								+'<li data-lp="1" class="next disabled">'
									+'<a href="javascript:void(0);">></a>'
								+'</li>'
							+'</ul>';
				
				$("#page-selection").html(htmlCode).show();
				$("#dashboardSocialMentions").html(tempHtml).show();
			}
			$('#wrapper').unmask();	
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
            }}
	});
}
function getMentionsPerPage(begin, end){
	var sublist = [];
	for(var i=begin;i<end;i++){
		sublist.push(listOfMentions[i]);
	}
	$("#dashboardSocialMentions").html('');
	console.log(" sublist "+sublist.length);
	for(var j=0; j<sublist.length; j++){
		var html = "";
		html += '<div class="row col-xs-12 SingleReviewList">';
		html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ">';
		html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+sublist[j].sourceName+'</div>';
		html += '<div class="reviewDetails row">';
		if(sublist[j].username!=null){
			html += '<div class="reviewerName">by <span>'+sublist[j].username+'</span></div>';
		}else{
			html += '<div class="reviewerName">by <span>NA</span></div>';
		}
		if(sublist[j].location!=null){
			html += '<div class="reviewerDetail">from <span>'+sublist[j].location+'</span></div>';
		}else{
			html += '<div class="reviewerDetail">from <span></span></div>';
		}
		html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
		html += '</span> '+$.datepicker.formatDate('d M yy',new Date(sublist[j].postDate))+'</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
		if(sublist[j].title!=null){
			html += '<h3 class="SingleReviewHeader">'+sublist[j].title+'</h3>';
		}else{
			html += '<h3 class="SingleReviewHeader"></h3>';
		}
		html += '<p>'+sublist[j].content+'</p>';
		
		html+='<div class="OnReviewActions col-xs-12">'
			+'<div class="panel-body row">'
				+'<ul class="nav nav-pills">'
					+'<li class="">'
						+'<a data-toggle="tab" class="userPrimeAction" onclick="openTag('+sublist[j].id+')" href="#Tag-pills'+sublist[j].id+'">';
							if(sublist[j].tag!="" && sublist[j].tag!=null){
								var tagName="";
								if(sublist[j].tag=="INVALID_MENTION"){
									tagName="Invalid Mention";
								}
								if(sublist[j].tag=="COMMENT"){
									tagName="Comment";
								}
								if(sublist[j].tag=="REVIEW"){
									tagName="Review";
								}
								if(sublist[j].tag=="EVENT"){
									tagName="Event";
								}
								html+='<div id="tagLbl_'+sublist[j].id+'"class="ReviewActionIcon">Tagged As ('+tagName+')</div>';
							}else{
								html+='<div id="tagLbl_'+sublist[j].id+'"class="ReviewActionIcon">Tag As</div>';
							}
				  html+='</a>'
					+'</li>'
				+'</ul>'
				+'<div class="tab-content">'
					+'<div id="Tag-pills'+sublist[j].id+'" class="SubHeading tab-pane fade">'
						+'<div class="form-group input-group form-inline col-xs-12">'
						
						+'<div class="row ">'
							+'<div class="form-group col-xs-6">'
								+'<label class="">tag as</label>'
								+'<div class="">'
									+'<select id="tagForReviewSiteContentId_'+sublist[j].id+'" class="form-control input-sm">'
											+'<option selected="" disabled="">Select a tag</option>'
											+'<option value="EVENT">Event</option>'
											+'<option value="REVIEW">Review</option>'
											+'<option value="COMMENT">Comment</option>'
											+'<option value="INVALID_MENTION">Invalid Mention</option>'
									+'</select>'
								+'</div>'
							+'</div>'
						+'</div>'
							+'<button id="Save" onclick="saveTag('+sublist[j].id+')" class="btn btn-primary btn-sm float-right" type="button"> Update</button>'
							+'<button onclick="closeTag('+sublist[j].id+')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			  +'</div>'
			+'</div>';
		
		html += '</div>';
		
		html += '</div>';
		$("#dashboardSocialMentions").append(html).show();
	
	}
}
function openTag(reviewId){
	
}
var stoppedTyping;
function SearchSocialMentions(){
	if (stoppedTyping) clearTimeout(stoppedTyping);
	stoppedTyping = setTimeout(function(){
		
		/*loadingForDashBoard();*/
		/*$('#wrapper').mask('Loading');*/
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
				if (item.content == null)
					item.content = "";
				if (item.title == null)
					item.title = "";
				if (searchKey!="" && ( item.content.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.title.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.content = item.content.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.title = item.title.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
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
				if (item.content == null)
					item.content = "";
				if (item.title == null)
					item.title = "";
				if (searchKey!="" && ( item.content.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.title.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.content = item.content.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.title = item.title.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
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
					total : noOfPages,
				        page: 1,
				        maxVisible: 10 
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
							
			});
		
		var successObject = response.slice(0,10);
		var response2 = successObject;
		var tempHtml = listsearchedMentionsResponse(response2, searchText);
		$('#dashboardSocialMentions').append(tempHtml);
		
	},300);
}

/*document.getElementById("searchInputValue").addEventListener("keydown",function(e) {
	var keyCode = e.keyCode || e.which;
	if (keyCode === 13) {
	var searchKey = $("#searchInputValue").val();
	if ($.trim(searchKey) == "" || searchKey == null) {
		searchKey="";
	}
	var resultListMentions = [];
	var targetList = [];
	if(filterResponse==null){
		targetList = response = JSON.parse(JSON.stringify(listOfMentions));
		for (var i = 0;i<targetList.length; i++) {
			var item = targetList[i];
			if (item.content == null)
				item.content = "";
			if (item.title == null)
				item.title = "";
			if (searchKey!="" && ( item.content.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.title.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
				var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

				item.content = item.content.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
				item.title = item.title.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
				resultListMentions.push(item);
			}else{
				if(searchKey==""){
					resultListMentions.push(item);
				}
			}
		}
	}else{
		targetList = response = JSON.parse(JSON.stringify(filterResponse));
		for (var i = 0;i<targetList.length; i++) {
			var item = targetList[i];
			if (item.content == null)
				item.content = "";
			if (item.title == null)
				item.title = "";
			if (searchKey!="" && ( item.content.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.title.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
				var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

				item.content = item.content.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
				item.title = item.title.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
				resultListMentions.push(item);
			}else{
				if(searchKey==""){
					resultListMentions.push(item);
				}
			}
		}
	}
	var totalMentions = resultListMentions;
	var noOfPages = 0;
	if (totalMentions.length % 5 == 0
			&& totalMentions.length > 0) {
		noOfPages = totalMentions.length / 5;
	} else {
		noOfPages = (totalMentions.length / 5) + 1;
	}
	begin = 0;
	end = 5;
	if (end > totalMentions.legth) {
		end = totalMentions.length;
	}

	$('#page-selection')
			.bootpag({
				total : noOfPages
			})
			.on(
					"page",
					function(event,  page number here 
							num) {
						begin = ((num - 1) * 5);
						end = (num) * 5;
						if (end > totalMentions.legth) {
							end = totalMentions.length;
						}
						var response2 = totalMentions;

						var tempHtml = listsearchedReviewStatusResponse(
								response2, searchText);
						$('#dashboardSocialMentions').append(tempHtml);
						
		});
	
	var tempList = resultListMentions;
	var tempHtml = listsearchedMentionsResponse(tempList, searchKey);
	$('#dashboardSocialMentions').append(tempHtml);
	}
}, false);*/

function listsearchedMentionsResponse(resultListMentions, searchText) {
	$('#dashboardSocialMentions').html('');
	var html = "";
	if (resultListMentions.length > 0) {
		for (var j = 0; j < resultListMentions.length; j++) {
			var title = "";
			var content = "";
			/*if (searchText != "") {
				title = highlightMentionsSearchText(searchText,resultListMentions[j].title);
				content = highlightMentionsSearchText(searchText,resultListMentions[j].content);
			} else {
				title = resultListMentions[j].title;
				content = resultListMentions[j].content;
			}
			t*/title = resultListMentions[j].title;
			content = resultListMentions[j].content;
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ">';
			html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+resultListMentions[j].sourceName+'</div>';
			html += '<div class="reviewDetails row">';
			html += '<div class="reviewerName">by <span>'+resultListMentions[j].username+'</span></div>';
			if(resultListMentions[j].location!=null){
				html += '<div class="reviewerDetail">from <span>'+resultListMentions[j].location+'</span></div>';
			}else{
				html += '<div class="reviewerDetail">from <span></span></div>';
			}
			html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
			html += '</span> '+$.datepicker.formatDate('d M yy',new Date(resultListMentions[j].postDate))+'</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			if(title!=null){
				html += '<h3 class="SingleReviewHeader">'+title+'</h3>';
			}else{
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
			html += '<p>'+content+'</p>';
			
			html+='<div class="OnReviewActions col-xs-12">'
				+'<div class="panel-body row">'
					+'<ul class="nav nav-pills">'
						+'<li class="">'
							+'<a data-toggle="tab" class="userPrimeAction" onclick="openTag('+resultListMentions[j].id+')" href="#Tag-pills'+resultListMentions[j].id+'">';
								if(resultListMentions[j].tag!="" && resultListMentions[j].tag!=null){
									var tagName="";
									if(resultListMentions[j].tag=="INVALID_MENTION"){
										tagName="Invalid Mention";
									}
									if(resultListMentions[j].tag=="COMMENT"){
										tagName="Comment";
									}
									if(resultListMentions[j].tag=="REVIEW"){
										tagName="Review";
									}
									if(resultListMentions[j].tag=="EVENT"){
										tagName="Event";
									}
									html+='<div id="tagLbl_'+resultListMentions[j].id+'"class="ReviewActionIcon">Tagged As ('+tagName+')</div>';
								}else{
									html+='<div id="tagLbl_'+resultListMentions[j].id+'"class="ReviewActionIcon">Tag As</div>';
								}
					  html+='</a>'
						+'</li>'
					+'</ul>'
					+'<div class="tab-content">'
						+'<div id="Tag-pills'+resultListMentions[j].id+'" class="SubHeading tab-pane fade">'
							+'<div class="form-group input-group form-inline col-xs-12">'
							
							+'<div class="row ">'
								+'<div class="form-group col-xs-6">'
									+'<label class="">tag as</label>'
									+'<div class="">'
										+'<select id="tagForReviewSiteContentId_'+resultListMentions[j].id+'" class="form-control input-sm">'
												+'<option selected="" disabled="">Select a tag</option>'
												+'<option value="EVENT">Event</option>'
												+'<option value="REVIEW">Review</option>'
												+'<option value="COMMENT">Comment</option>'
												+'<option value="INVALID_MENTION">Invalid Mention</option>'
										+'</select>'
									+'</div>'
								+'</div>'
							+'</div>'
								+'<button id="Save" onclick="saveTag('+resultListMentions[j].id+')" class="btn btn-primary btn-sm float-right" type="button"> Update</button>'
								+'<button onclick="closeTag('+resultListMentions[j].id+')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
							+'</div>'
						+'</div>'
					+'</div>'
				  +'</div>'
				+'</div>';
			
			html += '</div>';
			html += '</div>';
		} 
		$('#dashboardSocialMentions').empty();
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
function filterSocialMentions(pageNo){
	var sources = [];
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var organizationId = $('#organizationName option:selected').val();
	$("#socialMediaSourcesDiv").find('input[type=checkbox]').each(function() {
		if (this.checked == true) {
			sources.push(this.value);
		}
	});
	console.log("coming inside filter sources length:  "+sources.length);
	var socialMentionsFilterUI = {
			'sources' : sources,
			'organizationId' : organizationId,
			'fromDate' : fromDate,
			'toDate' : toDate,
		};
	$.ajax({
		type:"POST",
		url:"../qualityControl/getFilteredSocialMentions.htm",
		contentType:"application/json",
		data:JSON.stringify(socialMentionsFilterUI),
		success:function(response){
			$("#socialMediaSourcesDiv").html(" ");
			if(response.length>0){
				var filteredMentionsList = [];
				for(var j=0;j<response.length;j++){
					if(((response[j].title !=null)&&(response[j].content !=null))||((response[j].title==null)&&(response[j].content !=null))||((response[j].title !=null)&&(response[j].content==null))){
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
						total : noOfPages,
						
					        page: 1,
					        maxVisible: 10 
					})
					.on("page",function(event, /* page number here */
									num) {
								begin = ((num - 1) * 10);
								end = (num) * 10;
								if (end > totalFilteredMentions.legth) {
									end = totalFilteredMentions.length;
								}
								var successObject = filteredMentionsList.slice(begin, end);
								var response2 = successObject;
								var tempHtml = listFilteredMentionsResponse(response2, searchText);
								$('#dashboardSocialMentions').append(tempHtml);
					});
					var successObject = filteredMentionsList.slice(0, 10);
					var response2 = successObject;
					var tempHtml = listFilteredMentionsResponse(response2, searchText);
					$('#dashboardSocialMentions').append(tempHtml);
				}
			}
		}
	});
}
function saveTag(reviewId){
	var selectId="tagForReviewSiteContentId_"+reviewId;
	var tagValue=$('#'+selectId+' option:selected').val();
	var tagName=$('#'+selectId+' option:selected').text();
	var socialMention={'id':reviewId,'tag':tagValue};
	
	$.ajax({
		type:"POST",
		url:"../qualityControl/saveTag.htm",
		contentType:"application/json",
		data:JSON.stringify(socialMention),
		success:function(response){
			if(response.status=="SAVE_SUCCESS"){
				document.getElementById('Tag-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane fade" );
				$('#updateSuccessModal').modal('show');
				tagName="Tagged As ("+tagName+")";
				$('#tagLbl_'+reviewId).text(tagName);
			}
		}
	});
}
function openTag(reviewId){
	document.getElementById('Tag-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane active" );
	
	$.ajax({
		type:"GET",
		url:"../qualityControl/getTag.htm?id="+reviewId,
		contentType:"application/json",
		success:function(response){
			if(response.successObject.socialMention.tag!=null && response.successObject.socialMention.tag!=""){
				$('#tagForReviewSiteContentId_'+reviewId).val(response.successObject.socialMention.tag).trigger('click');
			}
		}
	});
}
function closeTag(reviewId){
	console.log(reviewId);
	$.ajax({
		type:"GET",
		url:"../qualityControl/getTag.htm?id="+reviewId,
		contentType:"application/json",
		success:function(response){
			if(response.successObject.socialMention.tag!=null && response.successObject.socialMention.tag!=""){
				$('#tagForReviewSiteContentId_'+reviewId).val(response.successObject.socialMention.tag).trigger('click');
			}else{
				$("#tagForReviewSiteContentId_"+reviewId).prop("selectedIndex", 0);
			}
		}
	});
	document.getElementById('Tag-pills'+reviewId).setAttribute( "class", "SubHeading tab-pane fade" );
}
function listFilteredMentionsResponse(FilteredtMentions, searchText) {
	$('#dashboardSocialMentions').html('');
	var html = "";
	if (FilteredtMentions.length > 0) {
		for (var j = 0; j < FilteredtMentions.length; j++) {
			var title = "";
			var content = "";
			/*if (searchText != "") {
				title = highlightMentionsSearchText(searchText,resultListMentions[j].title);
				content = highlightMentionsSearchText(searchText,resultListMentions[j].content);
			} else {
				title = resultListMentions[j].title;
				content = resultListMentions[j].content;
			}
			t*/title = FilteredtMentions[j].title;
			content = FilteredtMentions[j].content;
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ">';
			html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+FilteredtMentions[j].sourceName+'</div>';
			html += '<div class="reviewDetails row">';
			html += '<div class="reviewerName">by <span>'+FilteredtMentions[j].username+'</span></div>';
			if(FilteredtMentions[j].location!=null){
				html += '<div class="reviewerDetail">from <span>'+FilteredtMentions[j].location+'</span></div>';
			}else{
				html += '<div class="reviewerDetail">from <span></span></div>';
			}
			html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
			html += '</span> '+$.datepicker.formatDate('d M yy',new Date(FilteredtMentions[j].postDate))+'</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			if(title!=null){
				html += '<h3 class="SingleReviewHeader">'+title+'</h3>';
			}else{
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
			html += '<p>'+content+'</p>';
			
			html+='<div class="OnReviewActions col-xs-12">'
				+'<div class="panel-body row">'
					+'<ul class="nav nav-pills">'
						+'<li class="">'
							+'<a data-toggle="tab" class="userPrimeAction" onclick="openTag('+FilteredtMentions[j].id+')" href="#Tag-pills'+FilteredtMentions[j].id+'">';
								if(FilteredtMentions[j].tag!="" && FilteredtMentions[j].tag!=null){
									var tagName="";
									if(FilteredtMentions[j].tag=="INVALID_MENTION"){
										tagName="Invalid Mention";
									}
									if(FilteredtMentions[j].tag=="COMMENT"){
										tagName="Comment";
									}
									if(FilteredtMentions[j].tag=="REVIEW"){
										tagName="Review";
									}
									if(FilteredtMentions[j].tag=="EVENT"){
										tagName="Event";
									}
									html+='<div id="tagLbl_'+FilteredtMentions[j].id+'"class="ReviewActionIcon">Tagged As ('+tagName+')</div>';
								}else{
									html+='<div id="tagLbl_'+FilteredtMentions[j].id+'"class="ReviewActionIcon">Tag As</div>';
								}
					  html+='</a>'
						+'</li>'
					+'</ul>'
					+'<div class="tab-content">'
						+'<div id="Tag-pills'+FilteredtMentions[j].id+'" class="SubHeading tab-pane fade">'
							+'<div class="form-group input-group form-inline col-xs-12">'
								
							+'<div class="row ">'
							+'<div class="form-group col-xs-6">'
								+'<label class="">tag as</label>'
								+'<div class="">'
									+'<select id="tagForReviewSiteContentId_'+FilteredtMentions[j].id+'" class="form-control input-sm">'
											+'<option selected="" disabled="">Select a tag</option>'
											+'<option value="EVENT">Event</option>'
											+'<option value="REVIEW">Review</option>'
											+'<option value="COMMENT">Comment</option>'
											+'<option value="INVALID_MENTION">Invalid Mention</option>'
									+'</select>'
								+'</div>'
							+'</div>'
						+'</div>'
							
								+'<button id="Save" onclick="saveTag('+FilteredtMentions[j].id+')" class="btn btn-primary btn-sm float-right" type="button"> Update</button>'
								+'<button onclick="closeTag('+FilteredtMentions[j].id+')" id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
					  
			html += '</div>';
			
			html += '</div>';
		} 
		$('#dashboardSocialMentions').empty();
	}else {
		html += '<font style="color:red">No Mentions Found </font>';
	}
	return html;
}
function loadSocilaMentionsFilterData(){
	console.log("coming inside load filter data");
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var organizationId = $('#organizationName option:selected').val();
	$.ajax({
		type : "POST",
		url : "../dashboard/getMappedSocialMediaSourcesForOrganization.htm",
		contentType : "application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success : function(response) {
			var sourceList = response;

			var htmlCode = '';
			for (var i = 0; i < sourceList.length; i++) {
				htmlCode += '<label class="col-sm-4" style="margin-top:10px">';
				if(document.getElementById(sourceList[i].sourceName.toLowerCase() + 'SourceSpan')!=null){	
					htmlCode += '<input checked id="' + sourceList[i].sourceName.toLowerCase() + 'Source" onclick="source(this)" type="checkbox" value="' + sourceList[i].sourceName + '">';
				}
				else{
					htmlCode += '<input  id="' + sourceList[i].sourceName.toLowerCase() + 'Source" onclick="source(this)" type="checkbox" value="' + sourceList[i].sourceName + '">';
				}
				htmlCode += '' + sourceList[i].sourceName + '';
				htmlCode += '</label>';
				
			}
			$('#socialMediaSourcesDiv').html(htmlCode);
		},
		error : function(response) {
			return false;
		}
});
}
function source(obj){
	var id=$(obj).attr("id");
	var chkId=id+"Chk";
	var spanId=id+"Span";
	var sourceName=id.substring(0, id.length - 6);
	 
    if($(obj).prop('checked')){
        var htmlCode='<span id="'+spanId+'" class="ReviewFilterOutput">'+sourceName+'<button onclick="removeTag(\''+spanId+'\')" class="btn">x</button></span>';
        $('#selectedSocilaMentionsFiltersDiv').prepend(htmlCode);
    }else{
    	$('#'+chkId).attr('checked', false);
        $('#'+spanId).remove();
        
        /*$('#filterModal').modal({
            show: 'false'
        });*/
        
        //loadSocilaMentionsFilterData();
        
        /*filter(pageNo);*/
    }
}

function removeTag(id){
	$('#'+id).attr('checked', false);
    $('#'+id).remove();
    
   /* $('#filterModal').modal({
        show: 'false'
    });*/
    
    $.ajax({
    	   url: loadSocilaMentionsFilterData(),
    	   success:function(){
    		   filterSocialMentions(pageNo);
    	}
    });
  
}


