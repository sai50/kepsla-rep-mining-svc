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
	getSessionData();
	poplateOrganizations(function(selectedOrgId) {
		showDashboardSocialMentionsQC(selectedOrgId);
	});
});
$("#applyFilterBtn").click(function(e){
	resetFilterBar();
	var organizationId = $('#organizationName option:selected').val();
	showDashboardSocialMentionsQC(organizationId);
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
	$.ajaxSetup({ cache: false });
	var selectedOrgId = 0;
	$.ajax({
		type:"GET",
		url:"../dashboard/getOrganizationsBasicAndAdminQc.htm",
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
function getPublicMentions(){
	$.ajaxSetup({ cache: false });
	resetFilterBar();
	$("#pageTypeHidden").val("public");
	var orgId = $('#organizationName option:selected').val();
	showDashboardSocialMentionsQC(orgId);
	/*resetFilterBar();*/
}
function getPrivateMentions(){
	$.ajaxSetup({ cache: false });
	resetFilterBar();
	$("#pageTypeHidden").val("private");
	var orgId = $('#organizationName option:selected').val();
	showDashboardSocialMentionsQC(orgId);
	/*resetFilterBar();*/
}

var totalTweet=[];
var totalFacebook=[];
var totalFourSquare=[];
var totalFbLikes=0;
window['sourceList']=[];
function showDashboardSocialMentionsQC(organizationId){
	$.ajaxSetup({ cache: false });
	loadingForDashBoard();
	$("#dashboardSocialMentions").html('');
	$('#page-selection').html('');
	//$('#wrapper').mask('Loading...');
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var pageType=$("#pageTypeHidden").val();
	
	if(window['sourceList'].length==0){
			$.ajax({
				type : "POST",
				url : "../dashboard/getMappedSocialMediaSourcesForOrganization.htm",
				contentType : "application/json",
				data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
				success : function(response) {
					window['sourceList'] = response;
			
					var htmlCode = '';
					for (var i = 0; i < window['sourceList'].length; i++) {
						var spanId=window['sourceList'][i].sourceName.toLowerCase()+"SourceSpan";
						if(window['sourceList'][i].sourceName.toLowerCase()=="facebook" && pageType=="public"){
				        	htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social1.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions  <span id="totalFacebook" style="margin-right:25px;">0</span>Total Numbers of likes  <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span id="totalFbLikes" style="color:#000;">0</span></div>';
				        }else{
				        	if(window['sourceList'][i].sourceName.toLowerCase()=="twitter" && pageType=="public"){
				        		htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social2.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions <span id="totalTweet">0</span></div>';
				        	}else{
				        		if(window['sourceList'][i].sourceName.toLowerCase()=="foursquare" && pageType=="public"){
				        			htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social4.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions <span id="totalFourSquare">0</span></div>';
				        		}else{
				        			if(window['sourceList'][i].sourceName.toLowerCase()=="facebook" && pageType=="private"){
				    		        	htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social1.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions  <span id="totalFacebook" style="margin-right:25px;">0</span></div>';
				    		        }
				        		}
				        		
				        		/*else{
				        			htmlCode='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><b style="margin-right:10px;">'+sourceList[i].sourceName+':</b></div>';
				        		}*/
				        	}	
				        }
					}
					$('#selectedSocilaMentionsFiltersDiv').prepend(htmlCode);
					
					$('#totalFacebook').text(totalFacebook.length);
					$('#totalFbLikes').text(totalFbLikes);
					$('#totalTweet').text(totalTweet.length);
					$('#totalFourSquare').text(totalFourSquare.length);
					if(pageType=="private" && totalFacebook.length==0){
						$('#facebookSourceSpan').remove();
					}
					/*var sources = [];
					$('.selectedSocialMentions:checked').each(function() {
						sources.push($(this).val());
				    });*/
					
				},
				error : function(response) {
					return false;
				}
			});
	}else{
		var htmlCode = '';
		for (var i = 0; i < window['sourceList'].length; i++) {
			var spanId=window['sourceList'][i].sourceName.toLowerCase()+"SourceSpan";
			if(window['sourceList'][i].sourceName.toLowerCase()=="facebook" && pageType=="public"){
	        	htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social1.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions  <span id="totalFacebook" style="margin-right:25px;">0</span>Total Numbers of likes  <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span id="totalFbLikes" style="color:#000;">0</span></div>';
	        }else{
	        	if(window['sourceList'][i].sourceName.toLowerCase()=="twitter" && pageType=="public"){
	        		htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social2.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions <span id="totalTweet">0</span></div>';
	        	}else{
	        		if(window['sourceList'][i].sourceName.toLowerCase()=="foursquare" && pageType=="public"){
	        			htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social4.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions <span id="totalFourSquare">0</span></div>';
	        		}else{
	        			if(window['sourceList'][i].sourceName.toLowerCase()=="facebook" && pageType=="private"){
	    		        	htmlCode+='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social1.png"><b style="margin-right:10px;">'+window['sourceList'][i].sourceName+':</b>   Total Mentions  <span id="totalFacebook" style="margin-right:25px;">0</span></div>';
	    		        }
	        		}
	        		
	        		/*else{
	        			htmlCode='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><b style="margin-right:10px;">'+sourceList[i].sourceName+':</b></div>';
	        		}*/
	        	}	
	        }
		}
		$('#selectedSocilaMentionsFiltersDiv').prepend(htmlCode);
		
		$('#totalFacebook').text(totalFacebook.length);
		$('#totalFbLikes').text(totalFbLikes);
		$('#totalTweet').text(totalTweet.length);
		$('#totalFourSquare').text(totalFourSquare.length);
		if(pageType=="private" && totalFacebook.length==0){
			$('#facebookSourceSpan').remove();
		}
	}
	
	
	$.ajax({
		type:"POST",
		url:"../dashboard/showDashboardSocialMentionsQC.htm",
		contentType:"application/json",
		data:JSON.stringify({'fromDate':fromDate, 'toDate':toDate, 'organizationId':organizationId,'pageType':pageType}),
		success:function(response){
			filteredMentionsList=[];
			MentionsSearchContentList = []
			console.log(response);
			 
			
			 totalFourSquare=[];
			 totalTweet=[];
			 totalTweet = $(response).filter(function(index,value) {

				 return response[index].mentionType == "TWEET" ;

			 });
			 $('#totalTweet').text(totalTweet.length);
			 totalFacebook=[];
			 if(pageType=="public"){
				 
				 totalFourSquare = $(response).filter(function(index,value) {

					 return response[index].mentionType == "TIP" ;

				 });
				 $('#totalFourSquare').text(totalFourSquare.length);
				
				 totalFacebook = $(response).filter(function(index,value) {
						 return response[index].mentionType == "POST" &&  response[index].sourceName=="Facebook";
	
				 });
				 totalFbLikes=0;
				 for(var k=0;k<totalFacebook.length;k++){
					 totalFbLikes+=totalFacebook[k].likesCount;
				 }
			 }
			 if(pageType=="private"){
				 totalFacebook = $(response).filter(function(index,value) {
						 return response[index].mentionType == "REVIEW" &&  response[index].sourceName=="Facebook";
	
				 });
			 }
			 $('#totalFacebook').text(totalFacebook.length);
			 $('#totalFbLikes').text(totalFbLikes);
			 if(pageType=="private" && totalFacebook.length==0){
					$('#facebookSourceSpan').remove();
			 }
			 
			 /*var sources = [];
			 $('.selectedSocialMentions:checked').each(function() {
				sources.push($(this).val());
		     });*/
				
			 
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
				/*$('#socialMentionsSearchDiv').html('');
				$('#filterBar').html('');*/
				$('#dashboardSocialMentions').html('<h4><font color="red">No data found!!!</font></h4>');
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


//dileep added
function updatedShowDashboardSocialMentionsQC(organizationId){
	$.ajaxSetup({ cache: false });
	console.log("showDashboardSocialMentionsQC ****************************************()"+organizationId);
	loadingForDashBoard();
	$("#dashboardSocialMentions").html('');
	$('#page-selection').html('');
	//$('#wrapper').mask('Loading...');
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var pageType=$("#pageTypeHidden").val();
	
	$.ajax({
		type:"POST",
		url:"../dashboard/updatedshowDashboardSocialMentionsQC.htm",
		contentType:"application/json",
		data:JSON.stringify({'fromDate':fromDate, 'toDate':toDate, 'organizationId':organizationId,'pageType':pageType}),
		success:function(response){filteredMentionsList=[];
		MentionsSearchContentList = []
		console.log(response);
		 
		
		 totalFourSquare=[];
		 totalTweet=[];
		 totalTweet = $(response).filter(function(index,value) {

			 return response[index].mentionType == "TWEET" ;

		 });
		 $('#totalTweet').text(totalTweet.length);
		 totalFacebook=[];
		 if(pageType=="public"){
			 
			 totalFourSquare = $(response).filter(function(index,value) {

				 return response[index].mentionType == "TIP" ;

			 });
			 $('#totalFourSquare').text(totalFourSquare.length);
			
			 totalFacebook = $(response).filter(function(index,value) {
					 return response[index].mentionType == "POST" &&  response[index].sourceName=="Facebook";

			 });
			 totalFbLikes=0;
			 for(var k=0;k<totalFacebook.length;k++){
				 totalFbLikes+=totalFacebook[k].likesCount;
			 }
		 }
		 if(pageType=="private"){
			 totalFacebook = $(response).filter(function(index,value) {
					 return response[index].mentionType == "REVIEW" &&  response[index].sourceName=="Facebook";

			 });
		 }
		 $('#totalFacebook').text(totalFacebook.length);
		 $('#totalFbLikes').text(totalFbLikes);
		 if(pageType=="private" && totalFacebook.length==0){
				$('#facebookSourceSpan').remove();
		 }
		 
		 /*var sources = [];
		 $('.selectedSocialMentions:checked').each(function() {
			sources.push($(this).val());
	     });*/
			
		 
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
		
		}else{
			$('#dashboardSocialMentions').html('<h4><font color="red">No data found!!!</font></h4>');
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
	$.ajaxSetup({ cache: false });
	var _orgId = $('#organizationName option:selected').val();
	
	var sublist = [];
	/*for(var i=begin;i<end;i++){
		sublist.push(listOfMentions[i]);
	}*/
	
	if(listOfMentions.length<11){
		for(var i=begin;i<listOfMentions.length;i++){
			sublist.push(listOfMentions[i]);
		}
	}else{
		for(var i=begin;i<end;i++){
			sublist.push(listOfMentions[i]);
		}
	}
	
	
	$("#dashboardSocialMentions").html('');
	for(var j=0; j<sublist.length; j++){
		var html = "";
		html += '<div class="row col-xs-12 SingleReviewList">';
		html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
		html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+sublist[j].sourceName+'</div>';
		html += '<div class="reviewDetails row">';
		if(sublist[j].mentionType!=null){
			html += '<div class="reviewerName">Type <span>'+sublist[j].mentionType+'</span></div>';
		}else{
			html += '<div class="reviewerName">Type <span>NA</span></div>';
		}
		if(sublist[j].username!=null ){
			html += '<div class="reviewerDetail">by <span>'+sublist[j].username+'</span></div>';
		}else{
			html += '<div class="reviewerDetail"></div>';
		}
		html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
		html += '</span> '+$.datepicker.formatDate('d M yy',new Date(sublist[j].postDate))+'</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
		console.log("sublist[j].flagStatus "+sublist[j].flagStatus);
		// dileep added
		if(sublist[j].status == 0 ){
			if(sublist[j].flagStatus == '0'){
			html +='<div class="float-left" style="margin-top: 6px;color: red;margin-left:12px;">';
			html +=	'<label>This record has been removed from social mention client page.</label>';
			html +='</div>';
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='</div>';
				
			}else{
				html +='<div class="flagFunction" style="float:right;">';
				html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
				html +='<div class="flagOptions " id="flagToggle">';
				html +='<div class="checkbox">';
				html +='<div class="Review-page-arrow-up"></div>';
				html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
				console.log("sublist[j].reasionForRejection-------------check1-------------------------"+sublist[j].reasionForRejection);
				if(sublist[j].reasionForRejection!=null){
				if(sublist[j].reasionForRejection.includes("1-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
					html +='</label>';
				}
				if(sublist[j].reasionForRejection.includes( "2-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
					html +='</label>';
				}
				if(sublist[j].reasionForRejection.includes("3-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}
				if(sublist[j].reasionForRejection.includes("4-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="othersId'+sublist[j].id+'"> Others';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
					html +='</label>';
				}
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
					html +='</label>';
				}
				
				html +='<div class="form-group input-group col-xs-12">';
				html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+sublist[j].id+')"> Done</button>';
				html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
				html +='</div>';
				
				html +='</div>';
				html +='</div>';
				html +='</div>';
			}
		}else{
			if(sublist[j].flagStatus == '2' ){
				html +='<div class="float-left" style="margin-top: 6px;margin-left:12px;">'; 
				html +=	'<label style="color: red;">Admin has rejected this record for reason:</label>&nbsp;&nbsp;<label style="color: #130F0F;">'+sublist[j].reasionForRejection+'</label>';
				html +='</div>';
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right " type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='<div class="checkbox">';
			html +='<div class="Review-page-arrow-up"></div>';
			html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
			console.log("check1----"+sublist[j].id+"reasion "+sublist[j].reasionForRejection);
			if(sublist[j].reasionForRejection!=null){
			if(sublist[j].reasionForRejection.includes("1-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("2-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("3-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}
			
			if(sublist[j].reasionForRejection.includes("4-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}
			}else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}
			html +='<div class="form-group input-group col-xs-12">';
			html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+sublist[j].id+')"> Done</button>';
			html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
			html +='</div>';
			
			html +='</div>';
			html +='</div>';
			html +='</div>';
				
			
		}else{
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right " type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='<div class="checkbox">';
			html +='<div class="Review-page-arrow-up"></div>';
			html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
			console.log("check2----"+sublist[j].id+"reasion "+sublist[j].reasionForRejection);
			if(sublist[j].reasionForRejection!=null){
			if(sublist[j].reasionForRejection.includes("1-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("2-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("3-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}
			
			if(sublist[j].reasionForRejection.includes("4-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			 }
			
			
			}//if ended for not noull
			else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}
			
			html +='<div class="form-group input-group col-xs-12">';
			html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+sublist[j].id+')"> Done</button>';
			html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
			html +='</div>';
			
			html +='</div>';
			html +='</div>';
			html +='</div>';
			
		   }
		}	
		
  //dileep ended
		
		if(sublist[j].title!=null){
			html += '<h3 class="SingleReviewHeader">'+sublist[j].title+'</h3>';
		}else{
			html += '<h3 class="SingleReviewHeader"></h3>';
		}
	    if(sublist[j].videoLink!=null && sublist[j].videoLink!=""){		
	    	html +='<div class="col-xs-12"><b>Link:</b> <a class="socialLinks"  href="javascript:void(0)" onclick="javascript:window.open(\''+sublist[j].videoLink+'\')" style="color:#0000ff;">'+sublist[j].videoLink+'</a></div>';
	    }
		html += '<div class="col-xs-12"><p>'+sublist[j].content+'</p></div>';
	if(sublist[j].mentionType.toLowerCase()=="review"){	
		html += '<div class="SourceRating col-xs-12">';
		html += '<span>Rating </span><span data-review-rating="'
				+ sublist[j].rating
				+ '" data-maximum-rating="5" class="stars">'
				+ sublist[j].rating
				/*+ '</span><span>'
				+ sublist[j].rating + '</span>'*/;
		html += '</div>';
	}
		html += '<div class="SourceKPIRating col-xs-12"></div>';
		
		html += '<div class="OnReviewActions col-xs-12">'
					+'<div class="panel-body row">'
						+'<ul class="nav nav-pills">';
						if(sublist[j].sourceName.toLowerCase()=="facebook" && sublist[j].mentionType.toLowerCase()=="post" && sublist[j].comments.length){
					html+=	 '<li class="">'
								+'<a href="#Note-pills'+sublist[j].id+'" data-toggle="tab" onclick="openNote('+sublist[j].id+')" class="userPrimeAction">'
									+'<div class=""> '
										+'<span style="color:black">Comments</span>'
									+' <span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span style="color:black">'+sublist[j].comments.length+'</span></div>'
								+'</a>'
							+'</li>';
						}
						if(sublist[j].sourceName.toLowerCase()=="foursquare" || sublist[j].sourceName.toLowerCase()=="facebook" && sublist[j].mentionType.toLowerCase()=="post" && sublist[j].likesCount>0){	
					html+=	 '<li>'
								+'<div href="#Share-pills72220" data-toggle="tab" onclick="closeNote('+sublist[j].id+')" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
									+'<div class="" id="shareCountSpan72220" > '
										+'<span style="color:black">Likes</span> <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span style="color:black;">'+sublist[j].likesCount
									+'</span></div>'
								+'</div>'
							+'</li>'
						}
							if(sublist[j].sourceName.toLowerCase()=="twitter" && sublist[j].likesCount>0){
					html+=		'<li>'
									+'<div href="#Retweet-pills72220" data-toggle="tab" onclick="openShare(72220)" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
										+'<div class="" id="shareCountSpan72220"> '
											+'Retweet <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span style="color:black;">'+sublist[j].likesCount
										+'</span></div>'
									+'</div>'
								+'</li>';
								}
				html+=	'</ul>';
					if(sublist[j].sourceName.toLowerCase()=="facebook" && sublist[j].mentionType.toLowerCase()=="post"){	
				html+=	 '<div class="tab-content">'
							+'<div class="row SubHeading tab-pane" id="Note-pills'+sublist[j].id+'">'
								+'<div id="notesForMentionId_'+sublist[j].id+'" style="">'
								+'</div>'
							+'</div>'
						+'</div>';
					}
				
		html += '</div>';
		html += '</div>';
		
		$("#dashboardSocialMentions").append(html).show();
		$('span.stars').stars();
		//dileep added
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
	
	}
}

//dileep added
function saveReview(id){
	$.ajaxSetup({ cache: false });
	$('#wrapper').mask('Loading...');
	var duplicateReview = $("#duplicateReviewId"+id).is(':checked') ? 1 : 0;
	var languageNotCorrect = $("#languageNotCorrectId"+id).is(':checked') ? 1 : 0;
	var reviewdeleted = $("#reviewDeletedId"+id).is(':checked') ? 1 : 0;
	var others = $("#othersId"+id).is(':checked') ? 1 : 0;
	console.log("duplicateReview "+duplicateReview +" languageNotCorrect "+languageNotCorrect+" reviewdeleted  "+reviewdeleted +" others "+others);
	var reasionForRejection=[];
	if(duplicateReview == 1){
		reasionForRejection.push("1-"+id);	
		}
	if(languageNotCorrect == 1){
		reasionForRejection.push("2-"+id);	
		}
	if(reviewdeleted == 1){
		reasionForRejection.push("3-"+id);	
		}
	if(others == 1){
		reasionForRejection.push("4-"+id);	
		}

	if(duplicateReview == 0 && languageNotCorrect == 0 &&  reviewdeleted == 0 && others == 0){
		reasionForRejection.push("");	
		}
	
	console.log("reasionForRejection : "+reasionForRejection)
	if(reasionForRejection.length == 0){
		console.log("no reasions");
	}
	$.ajax({
		type:"POST",
		url:"../dashboard/updateSocialMentionsQC.htm",
		contentType:"application/json",
		data:JSON.stringify({'id':id, 'reasionForRejection':reasionForRejection}),
		success:function(response){
			if(response.status=="FLAG_SET"){
				var organizationId = $('#organizationName option:selected').val();
				updatedShowDashboardSocialMentionsQC(organizationId);
			}else{
				
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
            }}
	});
	
}

var stoppedTyping;
function SearchSocialMentions(){
	$.ajaxSetup({ cache: false });
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
							//dileep added
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
						
							
			});
		
		var successObject = response.slice(0,10);
		var response2 = successObject;
		var tempHtml = listsearchedMentionsResponse(response2, searchText);
		$('#dashboardSocialMentions').append(tempHtml);
		$('span.stars').stars();
		//dileep added
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
	
		
	},300);
}

function listsearchedMentionsResponse(resultListMentions, searchText) {
	$.ajaxSetup({ cache: false });
	console.log("listsearchedMentionsResponse------------------------------------------------------------------()")
	$('#dashboardSocialMentions').html('');
	var html = "";
	if (resultListMentions.length > 0) {
		for (var j = 0; j < resultListMentions.length; j++) {
			
			html += '<div class="row col-xs-12 SingleReviewList">';
				html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
					html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+resultListMentions[j].sourceName+'</div>';
					html += '<div class="reviewDetails row">';
					if(resultListMentions[j].mentionType!=null){
						html += '<div class="reviewerName">Type <span>'+resultListMentions[j].mentionType+'</span></div>';
					}else{
						html += '<div class="reviewerName">Type <span>NA</span></div>';
					}
					if(resultListMentions[j].username!=null  ){
						html += '<div class="reviewerDetail">by <span>'+resultListMentions[j].username+'</span></div>';
					}else{
						html += '<div class="reviewerDetail"></div>';
					}
						html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
							html += '</span> '+$.datepicker.formatDate('d M yy',new Date(resultListMentions[j].postDate))+'</span>';
						html += '</div>';
					html += '</div>'; //row dertail
			html += '</div>';
			
			
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			//dileep added
			console.log("resultListMentions[j].flagStatus "+resultListMentions[j].flagStatus);
			// dileep added
			if(resultListMentions[j].status == 0 ){
				if(resultListMentions[j].flagStatus == '0' ){
				html +='<div class="float-left" style="margin-top: 6px;color: red;margin-left:12px;">';
				html +=	'<label>This record has been removed from social mention client page.</label>';
				html +='</div>';
				html +='<div class="flagFunction" style="float:right;">';
				html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
				html +='<div class="flagOptions " id="flagToggle">';
				html +='</div>';
					
				}else{
					html +='<div class="flagFunction" style="float:right;">';
					html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
					html +='<div class="flagOptions " id="flagToggle">';
					html +='<div class="checkbox">';
					html +='<div class="Review-page-arrow-up"></div>';
					html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
					console.log("resultListMentions[j].reasionForRejection-----------------------------()"+resultListMentions[j].reasionForRejection);
					if(resultListMentions[j].reasionForRejection!=null){
					if(resultListMentions[j].reasionForRejection.includes("1-"+resultListMentions[j].id)){
						html +='<label>';
						html +='<input type="checkbox" checked  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
						html +='</label>';
					}else{
						html +='<label>';
						html +='<input type="checkbox"  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
						html +='</label>';
					}
					if(resultListMentions[j].reasionForRejection.includes("2-"+resultListMentions[j].id)){
						html +='<label>';
						html +='<input type="checkbox" checked id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
						html +='</label>';
					}else{
						html +='<label>';
						html +='<input type="checkbox" id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
						html +='</label>';
					}
					if(resultListMentions[j].reasionForRejection.includes("3-"+resultListMentions[j].id)){
						html +='<label>';
						html +='<input type="checkbox" checked id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
						html +='</label>';
					}else{
						html +='<label>';
						html +='<input type="checkbox" id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
						html +='</label>';
					}
					if(resultListMentions[j].reasionForRejection.includes("4-"+resultListMentions[j].id)){
						html +='<label>';
						html +='<input type="checkbox" checked id="othersId'+resultListMentions[j].id+'"> Others';
						html +='</label>';
					}else{
						html +='<label>';
						html +='<input type="checkbox" id="othersId'+resultListMentions[j].id+'"> Others';
						html +='</label>';
					}
					}else{
						html +='<label>';
						html +='<input type="checkbox"  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
						html +='</label>';
						html +='<label>';
						html +='<input type="checkbox" id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
						html +='</label>';
						html +='<label>';
						html +='<input type="checkbox" id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
						html +='</label>';
						html +='<label>';
						html +='<input type="checkbox" id="othersId'+resultListMentions[j].id+'"> Others';
						html +='</label>';
						
					}
					
					html +='<div class="form-group input-group col-xs-12">';
					html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+resultListMentions[j].id+')"> Done</button>';
					html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
					html +='</div>';
					
					html +='</div>';
					html +='</div>';
					html +='</div>';
				}
			}else{
				if(resultListMentions[j].flagStatus == "2" ){
					html +='<div class="float-left" style="margin-top: 6px;margin-left:12px;">';
					html +=	'<label style="color: red;">Admin has rejected this record for reason:</label>&nbsp;&nbsp;<label style="color: #130F0F;">'+resultListMentions[j].reasionForRejection+'</label>';
					html +='</div>';
				html +='<div class="flagFunction" style="float:right;">';
				html +='<button class="btn btn-flag float-right " type="button"> </button>';
				html +='<div class="flagOptions " id="flagToggle">';
				html +='<div class="checkbox">';
				html +='<div class="Review-page-arrow-up"></div>';
				html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
				console.log("check1----"+resultListMentions[j].id+"reasion "+resultListMentions[j].reasionForRejection);
				if(resultListMentions[j].reasionForRejection!=null){
				if(resultListMentions[j].reasionForRejection.includes("1-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
					html +='</label>';
				}
				if(resultListMentions[j].reasionForRejection.includes("2-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
					html +='</label>';
					
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
					html +='</label>';
				}
				if(resultListMentions[j].reasionForRejection.includes("3-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}
				
				if(resultListMentions[j].reasionForRejection.includes("4-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="othersId'+resultListMentions[j].id+'"> Others';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+resultListMentions[j].id+'"> Others';
					html +='</label>';
				}
				
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+resultListMentions[j].id+'"> Others';
					html +='</label>';
				}
				html +='<div class="form-group input-group col-xs-12">';
				html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+resultListMentions[j].id+')"> Done</button>';
				html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
				html +='</div>';
				
				html +='</div>';
				html +='</div>';
				html +='</div>';
					
				
			}else{
				html +='<div class="flagFunction" style="float:right;">';
				html +='<button class="btn btn-flag float-right " type="button"> </button>';
				html +='<div class="flagOptions " id="flagToggle">';
				html +='<div class="checkbox">';
				html +='<div class="Review-page-arrow-up"></div>';
				html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
				console.log("check2----"+resultListMentions[j].id+"reasion "+resultListMentions[j].reasionForRejection);
				if(resultListMentions[j].reasionForRejection!=null){
				if(resultListMentions[j].reasionForRejection.includes("1-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
					html +='</label>';
				}
				if(resultListMentions[j].reasionForRejection.includes("2-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
					html +='</label>';
					
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
					html +='</label>';
				}
				if(resultListMentions[j].reasionForRejection.includes("3-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}
				
				if(resultListMentions[j].reasionForRejection.includes("4-"+resultListMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="othersId'+resultListMentions[j].id+'"> Others';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+resultListMentions[j].id+'"> Others';
					html +='</label>';
				}
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+resultListMentions[j].id+'"> Duplicated review';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+resultListMentions[j].id+'" > Language not correct';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+resultListMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+resultListMentions[j].id+'"> Others';
					html +='</label>';
				}
				html +='<div class="form-group input-group col-xs-12">';
				html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+resultListMentions[j].id+')"> Done</button>';
				html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
				html +='</div>';
				
				html +='</div>';
				html +='</div>';
				html +='</div>';
				
			   }
			}	
			
	  		//dileep ended
			
			if(resultListMentions[j].title!=null){
				html += '<h3 class="SingleReviewHeader">'+resultListMentions[j].title+'</h3>';
			}else{
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
	    if(resultListMentions[j].videoLink!=null && resultListMentions[j].videoLink!=""){		
	    	html +='<div class="col-xs-12"><b>Link:</b> <a class="socialLinks" href="javascript:void(0)" onclick="javascript:window.open(\''+resultListMentions[j].videoLink+'\')" style="color:#0000ff;">'+resultListMentions[j].videoLink+'</a></div>';
	    }
			html += '<div class="col-xs-12"> <p>'+resultListMentions[j].content+'</p></div>';
		if(resultListMentions[j].mentionType.toLowerCase()=="review"){	
			html += '<div class="SourceRating col-xs-12">';
				html += '<span>Rating </span><span data-review-rating="'
						+ resultListMentions[j].rating
						+ '" data-maximum-rating="5" class="stars">'
						+ resultListMentions[j].rating
						+ '</span><span>'
						+ sublist[j].rating + '</span>';
			html += '</div>';
		}
			html += '<div class="SourceKPIRating col-xs-12"></div>';
			
			html += '<div class="OnReviewActions col-xs-12">'
						+'<div class="panel-body row">'
							+'<ul class="nav nav-pills">';
							if(resultListMentions[j].sourceName.toLowerCase()=="facebook" && resultListMentions[j].mentionType.toLowerCase()=="post" && resultListMentions[j].comments.length){
						html+=	 '<li class="">'
									+'<a href="#Note-pills'+resultListMentions[j].id+'" data-toggle="tab" onclick="openNote('+resultListMentions[j].id+')" class="userPrimeAction">'
										+'<div class=""> '
											+'<span style="color:black">Comments</span>'
										+' <span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span style="color:black">'+resultListMentions[j].comments.length+'</span></div>'
									+'</a>'
								+'</li>';
							}
							if(resultListMentions[j].sourceName.toLowerCase()=="foursquare" || resultListMentions[j].sourceName.toLowerCase()=="facebook" && resultListMentions[j].mentionType.toLowerCase()=="post" && resultListMentions[j].likesCount>0){	
						html+=	 '<li>'
									+'<div href="#Share-pills72220" data-toggle="tab" onclick="closeNote('+resultListMentions[j].id+')" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
										+'<div class="" id="shareCountSpan72220" > '
											+'<span style="color:black">Likes</span> <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span style="color:black;">'+resultListMentions[j].likesCount
										+'</span></div>'
									+'</div>'
								+'</li>'
							}
								if(resultListMentions[j].sourceName.toLowerCase()=="twitter" && resultListMentions[j].likesCount>0){
						html+=		'<li>'
										+'<div href="#Retweet-pills72220" data-toggle="tab" onclick="openShare(72220)" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
											+'<div class="" id="shareCountSpan72220"> '
												+'Retweet <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span class="color:black;">'+resultListMentions[j].likesCount
											+'</span></div>'
										+'</div>'
									+'</li>';
									}
					html+=	'</ul>';
						if(resultListMentions[j].sourceName.toLowerCase()=="facebook" && resultListMentions[j].mentionType.toLowerCase()=="post"){	
					html+=	 '<div class="tab-content">'
								+'<div class="row SubHeading tab-pane" id="Note-pills'+resultListMentions[j].id+'">'
									+'<div id="notesForMentionId_'+resultListMentions[j].id+'" style="">'
									+'</div>'
								+'</div>'
							+'</div>';
						}
					
			html += '</div>';
			html += '</div>';
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
	$.ajaxSetup({ cache: false });
	var sources = [];
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	var organizationId = $('#organizationName option:selected').val();
	var pageType=$("#pageTypeHidden").val();
	$('.selectedSocialMentions:checked').each(function() {
		sources.push($(this).val());
    });
	
	console.log("coming inside filter sources length:  "+sources.length);
	var socialMentionsFilterUI = {
			'sources' : sources,
			'organizationId' : organizationId,
			'fromDate' : fromDate,
			'toDate' : toDate,
			'pageType':pageType
		};
	$.ajax({
		type:"POST",
		url:"../dashboard/getFilteredSocialMentions.htm",
		contentType:"application/json",
		data:JSON.stringify(socialMentionsFilterUI),
		success:function(response){
			
			
			 totalFourSquare=[];
			 totalTweet=[];
			 totalTweet = $(response).filter(function(index,value) {

				 return response[index].mentionType == "TWEET" ;

			 });
			 $('#totalTweet').text(totalTweet.length);
			 totalFacebook=[];
			 if(pageType=="public"){
				 
				 totalFourSquare = $(response).filter(function(index,value) {

					 return response[index].mentionType == "TIP" ;

				 });
				 $('#totalFourSquare').text(totalFourSquare.length);
				
				 totalFacebook = $(response).filter(function(index,value) {
						 return response[index].mentionType == "POST" &&  response[index].sourceName=="Facebook";
	
				 });
				 totalFbLikes=0;
				 for(var k=0;k<totalFacebook.length;k++){
					 totalFbLikes+=totalFacebook[k].likesCount;
				 }
			 }
			 if(pageType=="private"){
				 totalFacebook = $(response).filter(function(index,value) {
						 return response[index].mentionType == "REVIEW" &&  response[index].sourceName=="Facebook";
	
				 });
			 }
			 $('#totalFacebook').text(totalFacebook.length);
			
			 $('#totalFbLikes').text(totalFbLikes);
			 
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
						total : noOfPages
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
								$('span.stars').stars();
								//dileep added
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
							
					});
					var successObject = filteredMentionsList.slice(0, 10);
					var response2 = successObject;
					var tempHtml = listFilteredMentionsResponse(response2, searchText);
					$('#dashboardSocialMentions').append(tempHtml);
					$('span.stars').stars();
					//dileep added
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
				
				}
			}else{
				$('#dashboardSocialMentions').html('<h4><font color="red">No data found!!!</font></h4>');
				$('#page-selection').empty('');
			}
		}
	});
}
function listFilteredMentionsResponse(FilteredtMentions, searchText) {
	$.ajaxSetup({ cache: false });
	$('#dashboardSocialMentions').html('');
	var html = "";
	if (FilteredtMentions.length > 0) {
		for (var j = 0; j < FilteredtMentions.length; j++) {
			/*var title = "";
			var content = "";
			if (searchText != "") {
				title = highlightMentionsSearchText(searchText,resultListMentions[j].title);
				content = highlightMentionsSearchText(searchText,resultListMentions[j].content);
			} else {
				title = resultListMentions[j].title;
				content = resultListMentions[j].content;
			}
			ttitle = FilteredtMentions[j].title;
			content = FilteredtMentions[j].content;
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
			html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+FilteredtMentions[j].sourceName+'</div>';
			html += '<div class="reviewDetails row">';
			html += '<div class="reviewerName">by <span>'+FilteredtMentions[j].username+'</span></div>';
			if(FilteredtMentions[j].location!=null){
				html += '<div class="reviewerDetail">from <span>'+FilteredtMentions[j].location+'</span></div>';
			}else{
				html += '<div class="reviewerDetail"></div>';
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
			html += '<div class="col-xs-12"><p>'+content+'</p></div>';
			html += '</div>';
			html += '</div>';*/
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
				html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+FilteredtMentions[j].sourceName+'</div>';
				html += '<div class="reviewDetails row">';
				if(FilteredtMentions[j].mentionType!=null){
					html += '<div class="reviewerName">Type <span>'+FilteredtMentions[j].mentionType+'</span></div>';
				}else{
					html += '<div class="reviewerName">Type <span>NA</span></div>';
				}
				if(FilteredtMentions[j].username!=null  ){
					html += '<div class="reviewerDetail">by <span>'+FilteredtMentions[j].username+'</span></div>';
				}else{
					html += '<div class="reviewerDetail"></div>';
				}
					html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
						html += '</span> '+$.datepicker.formatDate('d M yy',new Date(FilteredtMentions[j].postDate))+'</span>';
					html += '</div>';
				html += '</div>'; //row dertail
		html += '</div>';
		
		
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
		//dileep added
		console.log("FilteredtMentions[j].flagStatus "+FilteredtMentions[j].flagStatus);
		// dileep added
		if(FilteredtMentions[j].status == 0 ){
			if(FilteredtMentions[j].flagStatus=='0' ){
			html +='<div class="float-left" style="margin-top: 6px;color: red;margin-left:12px;">';
			html +=	'<label>This record has been removed from social mention client page.</label>';
			html +='</div>';
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='</div>';
				
			}else{
				html +='<div class="flagFunction" style="float:right;">';
				html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
				html +='<div class="flagOptions " id="flagToggle">';
				html +='<div class="checkbox">';
				html +='<div class="Review-page-arrow-up"></div>';
				html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
				if(FilteredtMentions[j].reasionForRejection!=null){
				if(FilteredtMentions[j].reasionForRejection.includes("1-"+FilteredtMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
					html +='</label>';
				}
				if(FilteredtMentions[j].reasionForRejection.includes("2-"+FilteredtMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
					html +='</label>';
				}
				if(FilteredtMentions[j].reasionForRejection.includes("3-"+FilteredtMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}
				if(FilteredtMentions[j].reasionForRejection.includes("4-"+FilteredtMentions[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="othersId'+FilteredtMentions[j].id+'"> Others';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+FilteredtMentions[j].id+'"> Others';
					html +='</label>';
				}
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+FilteredtMentions[j].id+'"> Others';
					html +='</label>';
				}
				
				html +='<div class="form-group input-group col-xs-12">';
				html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+FilteredtMentions[j].id+')"> Done</button>';
				html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
				html +='</div>';
				
				html +='</div>';
				html +='</div>';
				html +='</div>';
			}
		}else{
			if(FilteredtMentions[j].flagStatus=='2' ){
				html +='<div class="float-left" style="margin-top: 6px;margin-left:12px;">';
				html +=	'<label style="color: red;">Admin has rejected this record for reason:</label> &nbsp;&nbsp;<label style="color: #130F0F;">'+FilteredtMentions[j].reasionForRejection+'</label>';
				html +='</div>';
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right " type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='<div class="checkbox">';
			html +='<div class="Review-page-arrow-up"></div>';
			html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
			console.log("check1----"+FilteredtMentions[j].id+"reasion "+FilteredtMentions[j].reasionForRejection);
			
			if(FilteredtMentions[j].reasionForRejection!=null){
			if(FilteredtMentions[j].reasionForRejection.includes("1-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
				html +='</label>';
			}
			if(FilteredtMentions[j].reasionForRejection.includes("2-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
				html +='</label>';
				
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
				html +='</label>';
			}
			if(FilteredtMentions[j].reasionForRejection.includes("3-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}
			
			if(FilteredtMentions[j].reasionForRejection.includes("4-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="othersId'+FilteredtMentions[j].id+'"> Others';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+FilteredtMentions[j].id+'"> Others';
				html +='</label>';
			}
			}
			else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+FilteredtMentions[j].id+'"> Others';
				html +='</label>';
			}
			
			html +='<div class="form-group input-group col-xs-12">';
			html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+FilteredtMentions[j].id+')"> Done</button>';
			html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
			html +='</div>';
			
			html +='</div>';
			html +='</div>';
			html +='</div>';
				
			
		}else{
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right " type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='<div class="checkbox">';
			html +='<div class="Review-page-arrow-up"></div>';
			html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
			console.log("check2----"+FilteredtMentions[j].id+"reasion "+FilteredtMentions[j].reasionForRejection);
			
			if(FilteredtMentions[j].reasionForRejection!=null){
			if(FilteredtMentions[j].reasionForRejection.includes("1-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
				html +='</label>';
			}
			if(FilteredtMentions[j].reasionForRejection.includes("2-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
				html +='</label>';
				
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
				html +='</label>';
			}
			if(FilteredtMentions[j].reasionForRejection.includes("3-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}
			
			if(FilteredtMentions[j].reasionForRejection.includes("4-"+FilteredtMentions[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="othersId'+FilteredtMentions[j].id+'"> Others';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+FilteredtMentions[j].id+'"> Others';
				html +='</label>';
			}
			}
			else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+FilteredtMentions[j].id+'"> Duplicated review';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+FilteredtMentions[j].id+'" > Language not correct';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+FilteredtMentions[j].id+'"> Review Deleted From Source';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+FilteredtMentions[j].id+'"> Others';
				html +='</label>';
			}
			html +='<div class="form-group input-group col-xs-12">';
			html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+FilteredtMentions[j].id+')"> Done</button>';
			html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
			html +='</div>';
			
			html +='</div>';
			html +='</div>';
			html +='</div>';
			
		   }
		}	
		
		
		
		//dileep ended
		
		
		if(FilteredtMentions[j].title!=null){
			html += '<h3 class="SingleReviewHeader">'+FilteredtMentions[j].title+'</h3>';
		}else{
			html += '<h3 class="SingleReviewHeader"></h3>';
		}
    if(FilteredtMentions[j].videoLink!=null && FilteredtMentions[j].videoLink!=""){		
    	html +='<div class="col-xs-12"><b>Link:</b> <a class="socialLinks" href="javascript:void(0)" onclick="javascript:window.open(\''+FilteredtMentions[j].videoLink+'\')" style="color:#0000ff;">'+FilteredtMentions[j].videoLink+'</a></div>';
    }
		html += '<div class="col-xs-12"> <p>'+FilteredtMentions[j].content+'</p></div>';
	if(FilteredtMentions[j].mentionType.toLowerCase()=="review"){	
		html += '<div class="SourceRating col-xs-12">';
			html += '<span>Rating </span><span data-review-rating="'
					+ FilteredtMentions[j].rating
					+ '" data-maximum-rating="5" class="stars">'
					+ FilteredtMentions[j].rating
					+ '</span><span>'
					+ FilteredtMentions[j].rating + '</span>';
		html += '</div>';
	}
		html += '<div class="SourceKPIRating col-xs-12"></div>';
		
		html += '<div class="OnReviewActions col-xs-12">'
					+'<div class="panel-body row">'
						+'<ul class="nav nav-pills">';
						if(FilteredtMentions[j].sourceName.toLowerCase()=="facebook" && FilteredtMentions[j].mentionType.toLowerCase()=="post" && FilteredtMentions[j].comments.length){
					html+=	 '<li class="">'
								+'<a href="#Note-pills'+FilteredtMentions[j].id+'" data-toggle="tab" onclick="openNote('+FilteredtMentions[j].id+')" class="userPrimeAction">'
									+'<div class=""> '
										+'<span style="color:black">Comments</span>'
									+' <span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span style="color:black">'+FilteredtMentions[j].comments.length+'</span></div>'
								+'</a>'
							+'</li>';
						}
						if(FilteredtMentions[j].sourceName.toLowerCase()=="foursquare" || FilteredtMentions[j].sourceName.toLowerCase()=="facebook" && FilteredtMentions[j].mentionType.toLowerCase()=="post" && FilteredtMentions[j].likesCount>0){	
					html+=	 '<li>'
								+'<div href="#Share-pills72220" data-toggle="tab" onclick="closeNote('+FilteredtMentions[j].id+')" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
									+'<div class="" id="shareCountSpan72220" > '
										+'<span style="color:black">Likes</span> <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span style="color:#000">'+FilteredtMentions[j].likesCount+'</span>'
									+'</div>'
								+'</div>'
							+'</li>'
						}
							if(FilteredtMentions[j].sourceName.toLowerCase()=="twitter" && FilteredtMentions[j].likesCount>0){
					html+=		'<li>'
									+'<div href="#Retweet-pills72220" data-toggle="tab" onclick="openShare(72220)" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
										+'<div class="" id="shareCountSpan72220"> '
											+'Retweet <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span style="color:#000">'+FilteredtMentions[j].likesCount+'</span>'
										+'</div>'
									+'</div>'
								+'</li>';
								}
				html+=	'</ul>';
					if(FilteredtMentions[j].sourceName.toLowerCase()=="facebook" && FilteredtMentions[j].mentionType.toLowerCase()=="post"){	
				html+=	 '<div class="tab-content">'
							+'<div class="row SubHeading tab-pane" id="Note-pills'+FilteredtMentions[j].id+'">'
								+'<div id="notesForMentionId_'+FilteredtMentions[j].id+'" style="">'
								+'</div>'
							+'</div>'
						+'</div>';
					}
				
		html += '</div>';
		html += '</div>';
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
	$.ajaxSetup({ cache: false });
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
					htmlCode += ' <input checked id="' + sourceList[i].sourceName.toLowerCase() + 'Source" onclick="source(this)" class="selectedSocialMentions" style="margin-right:10px" type="checkbox" value=" ' + sourceList[i].sourceName + '">';
				}
				else{
					htmlCode += ' <input  id="' + sourceList[i].sourceName.toLowerCase() + 'Source" onclick="source(this)" class="selectedSocialMentions" style="margin-right:10px" type="checkbox" value=" ' + sourceList[i].sourceName + '">';
					/*htmlCode += ' <input  checked id="' + sourceList[i].sourceName.toLowerCase() + 'Source" onclick="source(this)" class="selectedSocialMentions" style="margin-right:10px" type="checkbox" value=" ' + sourceList[i].sourceName + '">';*/
				}
				htmlCode += '' + sourceList[i].sourceName + '';
				htmlCode += '</label>';
				
			}
			$('#socialMediaSourcesDiv').html(htmlCode);
			/*var arrayChk=document.getElementsByClassName("selectedSocialMentions");*/
			/*$(".selectedSocialMentions").attr('checked', checked);*/
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
	console.log(id,sourceName+" source(obj)");
	 
    if($(obj).prop('checked')){
    	
    	var htmlCode="";
        if(sourceName.toLowerCase()=="facebook"){
        	htmlCode='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social1.png"><b style="margin-right:10px;">'+sourceName+':</b>   Total Mentions  <span id="totalFacebook" style="margin-right:25px;">0</span>Total Numbers of likes  <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span id="totalFbLikes" style="color:#000;">0</span></div>';
        }else{
        	if(sourceName.toLowerCase()=="twitter"){
        		htmlCode='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social2.png"><b style="margin-right:10px;">'+sourceName+':</b>   Total Mentions <span id="totalTweet">0</span></div>';
        	}else{
        		if(sourceName.toLowerCase()=="foursquare"){
        			htmlCode='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><img height="21px" wight="21px" style="margin-right:5px" src="../resources/images/Social4.png"><b style="margin-right:10px;">'+sourceName+':</b>   Total Mentions <span id="totalFourSquare">0</span></div>';
        		}else{
        			htmlCode='<div id="'+spanId+'" class="ReviewFilterOutput" style="padding: 5px; text-transform: capitalize;"><button onclick="removeTag(\''+spanId+'\')" class="btn" style="margin-right:10px">x</button><b style="margin-right:10px;">'+sourceName+':</b></div>';
        		}
        	}	
        }
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

function hideMore(mentionId) {
	/*
	 * var obj=document.getElementsByClassName('extraNoteDivId');
	 * obj.style.display = 'block';
	 */
	$('#hideMoreHrefId' + mentionId).hide();
	$('#viewMoreHrefId' + mentionId).show();
	$(".extraNoteDivId" + mentionId).hide(300);
}
function showMore(mentionId) {
	/*
	 * var obj=document.getElementsByClassName('extraNoteDivId');
	 * obj.style.display = 'block';
	 */
	$('#viewMoreHrefId' + mentionId).hide();
	$('#hideMoreHrefId' + mentionId).show();
	$(".extraNoteDivId" + mentionId).show(300);
}

function removeTag(id){
	$.ajaxSetup({ cache: false });
	$('#'+id).attr('checked', false);
    $('#'+id).remove();
    
    console.log(id+" id removeTag(id)");
    
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

function closeNote(mentionId) {
	document.getElementById('Note-pills' + mentionId).setAttribute("class",
			"row SubHeading tab-pane fade");
	//$("#departmentForReviewSiteContentId_" + reviewId).prop("selectedIndex", 0);
}
function openNote(mentionId) {
	getNotes(mentionId);
	document.getElementById('Note-pills' + mentionId).setAttribute("class",
			"row SubHeading tab-pane active");
}
function getNotes(mentionId) {
	$.ajaxSetup({ cache: false });
	$("#" + "notesForMentionId_" + mentionId).hide();
	$("#notesForMentionId_" + mentionId).html('');
	$("#errorForMentionId_" + mentionId).html('');
	$
			.ajax({
				type : "GET",
				url : "../dashboard/getComments.htm?mentionId="
						+ mentionId,
				contentType : "application/json",
				success : function(response) {
					noteList = response.successObject.listComments;
					var htmlCode = '';
					for (var i = 0; i < noteList.length; i++) {
						if (i > 1) {
							htmlCode += '<div style="display: none" class="extraNoteDivId'
									+ mentionId + '">';
						}
						htmlCode += '<div class="row ActionReports ">';
						    if(noteList[i].videoLink!=null && noteList[i].videoLink!=""){		
						    	htmlCode +='<div class="col-xs-12"><b>Link:</b> '
						    				 +'<div class="col-xs-12"><b>Link:</b> <a class="socialLinks" href="javascript:void(0)" onclick="javascript:window.open(\''+noteList[i].videoLink+'\')" style="color:#0000ff;">'+noteList[i].videoLink+'</a></div>';
										  +'</div>';
						    }	
						htmlCode += '<div class="col-xs-12"><b>Comment :</b> '
									+ noteList[i].postedComment
								+ '</div>'
								+ '<div class="col-xs-12 SmallDarkGreyHeader" style="margin-top: 6px; margin-bottom: 6px;">';
									if(noteList[i].postDate!=null ){	
										htmlCode+= '<span class="marginRight20"><span class="glyphicon glyphicon-time"></span> '
										+ '' + moment(noteList[i].postDate).format("DD MMMM YYYY  hh:mm") + '</span>';
									}
									if(noteList[i].userName!=null ){	
										htmlCode+= '<span class="glyphicon glyphicon-user" aria-hidden="true"></span> <span class="marginRight20">'
											+ noteList[i].userName 
									    + '</span> ';
									}
								   if(noteList[i].likesCount!=null && noteList[i].likesCount!=0){		   
									   htmlCode+='<span aria-hidden="true" class="glyphicon glyphicon-heart"></span><span><span style="color:black"><span style="color:black">Likes</span></span> '
											+ '<span style="color:black;">'+noteList[i].likesCount+'</span>'
									   +'</span>';
								   }
						htmlCode += '</div>'
									+'</div>'
								+ '<div class="col-xs-12">';
						if (i == noteList.length - 1 && noteList.length > 2) {
							htmlCode += '<a id="hideMoreHrefId'
									+ mentionId
									+ '" href="javascript:void(0)" onclick="hideMore('
									+ mentionId + ')">Hide</a>';
						}
						if (i == 1 && noteList.length > 2) {
							htmlCode += '<a id="viewMoreHrefId'
									+ mentionId
									+ '" href="javascript:void(0)" onclick="showMore('
									+ mentionId + ')">View More</a>';
						}
						htmlCode += '</div>';
						if (i > 1) {
							htmlCode += '</div>';
						}
					}
					$("#notesForMentionId_" + mentionId)
							.html('');
					$("#notesForMentionId_" + mentionId)
							.html(htmlCode);
					$(
							"#" + "notesForMentionId_"
									+ mentionId).show();
				},
				error : function(response) {
					$('#loadMaskDiv')
							.mask(
									response.status + "*********"
											+ response.statusText);
				}
			});
}


function sortSocialMention(){
	$.ajaxSetup({ cache: false });
	if(filterResponse==null || filterResponse.length==0){
		
			var sortByParam = $('#sortSelectOption option:selected').val();
			if(sortByParam=="Date Latest"){
				listOfMentions.sort(function(a,b){
					  	  return new Date(a.postDate) - new Date(b.postDate);
					});
			}
			if(sortByParam=="Date Oldest"){
				listOfMentions.sort(function(a,b){
					  	  return new Date(b.postDate) - new Date(a.postDate);
					});
			}
			if(sortByParam=="Likes Max"){
				listOfMentions.sort(function(a,b){
						 return b.likesCount - a.likesCount;
					});
			}
			if(sortByParam=="Likes Least"){
				listOfMentions.sort(function(a,b){
					     return a.likesCount - b.likesCount;
					});
			}
			if(sortByParam=="Comments Max"){
				listOfMentions.sort(function(a,b){
						  return b.comments.length -a.comments.length;
					});
			}
			if(sortByParam=="Comments Least"){
				listOfMentions.sort(function(a,b){
					 	  return a.comments.length - b.comments.length;
					});
			}
			if(listOfMentions.length>0){
				var noOfPages = 0;
				if(listOfMentions.length%10  == 0 && listOfMentions.length >0){
					noOfPages = listOfMentions.length/10;
				}else{
					noOfPages = (listOfMentions.length/10)+1;
				}
				begin = 0;
				end = 10;
			
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
			    getMentionsPerPage(begin, end );
			}
	}else{
			
		var sortByParam = $('#sortSelectOption option:selected').val();
		if(sortByParam=="Date Latest"){
			filterResponse.sort(function(a,b){
				  	  return new Date(a.postDate) - new Date(b.postDate);
				});
		}
		if(sortByParam=="Date Oldest"){
			filterResponse.sort(function(a,b){
				  	  return new Date(b.postDate) - new Date(a.postDate);
				});
		}
		if(sortByParam=="Likes Max"){
			filterResponse.sort(function(a,b){
					 return b.likesCount - a.likesCount;
				});
		}
		if(sortByParam=="Likes Least"){
			filterResponse.sort(function(a,b){
				     return a.likesCount - b.likesCount;
				});
		}
		if(sortByParam=="Comments Max"){
			filterResponse.sort(function(a,b){
					  return b.comments.length -a.comments.length;
				});
		}
		if(sortByParam=="Comments Least"){
			filterResponse.sort(function(a,b){
				 	  return a.comments.length - b.comments.length;
				});
		}
		if(filterResponse.length>0){
			var noOfPages = 0;
			if(filterResponse.length%10  == 0 && filterResponse.length >0){
				noOfPages = filterResponse.length/10;
			}else{
				noOfPages = (filterResponse.length/10)+1;
			}
			begin = 0;
			end = 10;
		
			if(end > filterResponse.legth){
	    		end = filterResponse.length;
	    	}
	    	
		    $('#page-selection').bootpag({
		        total: noOfPages,
		        page: 1,
		        maxVisible: 10
		    }).on("page", function(event,num){
		    	begin = ((num-1)*10);
		    	end=(num)*10;
		    	if(end > filterResponse.legth){
		    		end = filterResponse.length;
		    	}
		    	getMentionsPerPageForSort(begin, end ,filterResponse);
		    });
		    getMentionsPerPageForSort(begin, end ,filterResponse);
		}
	}
}

function getMentionsPerPageForSort(begin, end ,filterResponse){
	var _orgId = $('#organizationName option:selected').val();
	
	//alert(" filterResponse.length :"+filterResponse.length)
	var sublist = [];
//	alert(" begin "+begin+" end "+end);
	if(filterResponse.length<11){
		for(var i=begin;i<filterResponse.length;i++){
			sublist.push(filterResponse[i]);
		}
	}else{
		for(var i=begin;i<end;i++){
			sublist.push(filterResponse[i]);
		}
	}
	//alert(" sublist.length :"+sublist.length)
	
	$("#dashboardSocialMentions").html('');
	for(var j=0; j<sublist.length; j++){
		var html = "";
		html += '<div class="row col-xs-12 SingleReviewList">';
		html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
		html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+sublist[j].sourceName+'</div>';
		html += '<div class="reviewDetails row">';
		if(sublist[j].mentionType!=null){
			html += '<div class="reviewerName">Type <span>'+sublist[j].mentionType+'</span></div>';
		}else{
			html += '<div class="reviewerName">Type <span>NA</span></div>';
		}
		if(sublist[j].username!=null ){
			html += '<div class="reviewerDetail">by <span>'+sublist[j].username+'</span></div>';
		}else{
			html += '<div class="reviewerDetail"></div>';
		}
		html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
		html += '</span> '+$.datepicker.formatDate('d M yy',new Date(sublist[j].postDate))+'</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
		console.log("sublist[j].flagStatus "+sublist[j].flagStatus);
		// dileep added
		if(sublist[j].status == 0 ){
			if(sublist[j].flagStatus=='0' ){
			html +='<div class="float-left" style="margin-top: 6px;color: red;margin-left:12px;">';
			html +=	'<label>This record has been removed from social mention client page.</label>';
			html +='</div>';
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='</div>';
				
			}else{
				html +='<div class="flagFunction" style="float:right;">';
				html +='<button class="btn btn-flag float-right flagedReview" type="button"> </button>';
				html +='<div class="flagOptions " id="flagToggle">';
				html +='<div class="checkbox">';
				html +='<div class="Review-page-arrow-up"></div>';
				html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
				if(sublist[j].reasionForRejection!=null){
				if(sublist[j].reasionForRejection.includes("1-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
					html +='</label>';
				}
				if(sublist[j].reasionForRejection.includes("2-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
					html +='</label>';
				}
				if(sublist[j].reasionForRejection.includes("3-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
					html +='</label>';
				}
				if(sublist[j].reasionForRejection.includes("4-"+sublist[j].id)){
					html +='<label>';
					html +='<input type="checkbox" checked id="othersId'+sublist[j].id+'"> Others';
					html +='</label>';
				}else{
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
					html +='</label>';
				}
				}
				else{
					html +='<label>';
					html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
					html +='</label>';
					html +='<label>';
					html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
					html +='</label>';
				}
				html +='<div class="form-group input-group col-xs-12">';
				html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+sublist[j].id+')"> Done</button>';
				html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
				html +='</div>';
				
				html +='</div>';
				html +='</div>';
				html +='</div>';
			}
		}else{
			if(sublist[j].flagStatus=='2' ){
				html +='<div class="float-left" style="margin-top: 6px;margin-left:12px;">'; 
				html +=	'<label style="color: red;">Admin has rejected this record for reason:</label>&nbsp;&nbsp;<label style="color: #130F0F;">'+sublist[j].reasionForRejection+'</label>';
				html +='</div>';
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right " type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='<div class="checkbox">';
			html +='<div class="Review-page-arrow-up"></div>';
			html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
			console.log("check1----"+sublist[j].id+"reasion "+sublist[j].reasionForRejection);
			if(sublist[j].reasionForRejection!=null){
			if(sublist[j].reasionForRejection.includes("1-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("2-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("3-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}
			
			if(sublist[j].reasionForRejection.includes("4-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}
			}
			else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}
			html +='<div class="form-group input-group col-xs-12">';
			html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+sublist[j].id+')"> Done</button>';
			html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
			html +='</div>';
			
			html +='</div>';
			html +='</div>';
			html +='</div>';
				
			
		}else{
			html +='<div class="flagFunction" style="float:right;">';
			html +='<button class="btn btn-flag float-right " type="button"> </button>';
			html +='<div class="flagOptions " id="flagToggle">';
			html +='<div class="checkbox">';
			html +='<div class="Review-page-arrow-up"></div>';
			html +='<div class="SmallNormalLightGreyContent">Reason for flagging:</div>';
			console.log("check2----"+sublist[j].id+"reasion "+sublist[j].reasionForRejection);
			if(sublist[j].reasionForRejection!=null){
			if(sublist[j].reasionForRejection.includes("1-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("2-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
			}
			if(sublist[j].reasionForRejection.includes("3-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
			}
			
			if(sublist[j].reasionForRejection.includes("4-"+sublist[j].id)){
				html +='<label>';
				html +='<input type="checkbox" checked id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}else{
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';
			}
			}
			else{
				html +='<label>';
				html +='<input type="checkbox"  id="duplicateReviewId'+sublist[j].id+'"> Duplicated review';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="languageNotCorrectId'+sublist[j].id+'" > Language not correct';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="reviewDeletedId'+sublist[j].id+'"> Review Deleted From Source';
				html +='</label>';
				html +='<label>';
				html +='<input type="checkbox" id="othersId'+sublist[j].id+'"> Others';
				html +='</label>';


			}
			html +='<div class="form-group input-group col-xs-12">';
			html +='<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button" onclick="saveReview('+sublist[j].id+')"> Done</button>';
			html +='<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>';
			html +='</div>';
			
			html +='</div>';
			html +='</div>';
			html +='</div>';
			
		   }
		}	
		
  //dileep ended
		
		
		if(sublist[j].title!=null){
			html += '<h3 class="SingleReviewHeader">'+sublist[j].title+'</h3>';
		}else{
			html += '<h3 class="SingleReviewHeader"></h3>';
		}
	    if(sublist[j].videoLink!=null && sublist[j].videoLink!=""){		
	    	html +='<div class="col-xs-12"><b>Link:</b> <a class="socialLinks"  href="javascript:void(0)" onclick="javascript:window.open(\''+sublist[j].videoLink+'\')" style="color:#0000ff;">'+sublist[j].videoLink+'</a></div>';
	    }
		html += '<div class="col-xs-12"><p>'+sublist[j].content+'</p></div>';
	if(sublist[j].mentionType.toLowerCase()=="review"){	
		html += '<div class="SourceRating col-xs-12">';
		html += '<span>Rating </span><span data-review-rating="'
				+ sublist[j].rating
				+ '" data-maximum-rating="5" class="stars">'
				+ sublist[j].rating
				/*+ '</span><span>'
				+ sublist[j].rating + '</span>'*/;
		html += '</div>';
	}
		html += '<div class="SourceKPIRating col-xs-12"></div>';
		
		html += '<div class="OnReviewActions col-xs-12">'
					+'<div class="panel-body row">'
						+'<ul class="nav nav-pills">';
						if(sublist[j].sourceName.toLowerCase()=="facebook" && sublist[j].mentionType.toLowerCase()=="post" && sublist[j].comments.length){
					html+=	 '<li class="">'
								+'<a href="#Note-pills'+sublist[j].id+'" data-toggle="tab" onclick="openNote('+sublist[j].id+')" class="userPrimeAction">'
									+'<div class=""> '
										+'<span style="color:black">Comments</span>'
									+' <span class="glyphicon glyphicon-comment" aria-hidden="true"></span> <span style="color:black">'+sublist[j].comments.length+'</span></div>'
								+'</a>'
							+'</li>';
						}
						if(sublist[j].sourceName.toLowerCase()=="foursquare" || sublist[j].sourceName.toLowerCase()=="facebook" && sublist[j].mentionType.toLowerCase()=="post" && sublist[j].likesCount>0){	
					html+=	 '<li>'
								+'<div href="#Share-pills72220" data-toggle="tab" onclick="closeNote('+sublist[j].id+')" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
									+'<div class="" id="shareCountSpan72220" > '
										+'<span style="color:black">Likes</span> <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span style="color:black;">'+sublist[j].likesCount
									+'</span></div>'
								+'</div>'
							+'</li>'
						}
							if(sublist[j].sourceName.toLowerCase()=="twitter" && sublist[j].likesCount>0){
					html+=		'<li>'
									+'<div href="#Retweet-pills72220" data-toggle="tab" onclick="openShare(72220)" class="userPrimeAction" style="border-bottom: medium none; position: relative; display: block; padding: 10px 15px; text-decoration: none; background: transparent none repeat scroll 0% 0%; border-radius: 0px; color: #D9533D;">'
										+'<div class="" id="shareCountSpan72220"> '
											+'Retweet <span aria-hidden="true" class="glyphicon glyphicon-heart"></span> <span style="color:black;">'+sublist[j].likesCount
										+'</span></div>'
									+'</div>'
								+'</li>';
								}
				html+=	'</ul>';
					if(sublist[j].sourceName.toLowerCase()=="facebook" && sublist[j].mentionType.toLowerCase()=="post"){	
				html+=	 '<div class="tab-content">'
							+'<div class="row SubHeading tab-pane" id="Note-pills'+sublist[j].id+'">'
								+'<div id="notesForMentionId_'+sublist[j].id+'" style="">'
								+'</div>'
							+'</div>'
						+'</div>';
					}
				
		html += '</div>';
		html += '</div>';
		$("#dashboardSocialMentions").append(html).show();
		$('span.stars').stars();
		//dileep added
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
	
	
	}
}

function resetFilterBar(){
		var html="";
		html+='<a data-target=".FilterLightBox" data-toggle="modal" class="filterButton" onclick="loadSocilaMentionsFilterData()" type="button"><span class="glyphicon glyphicon-filter"></span>Filter</a>';
		html+='<select class="filterButton" onchange="sortSocialMention()" id="sortSelectOption" name="sortSelectOption" style="margin-right:15px;margin-top:-2px; float:right;">';
			html+='<option disabled="" selected="">Sort By</option>';
			html+='<option value="Date Latest"> Oldest Date</option>';
			html+='<option value="Date Oldest"> Latest Date </option>';
			html+='<option value="Likes Max"> Max Likes </option>';
			html+='<option value="Likes Least"> Least Likes</option>';
			html+='<option value="Comments Max"> Max Comments </option>';
			html+='<option value="Comments Least"> Least Comments </option>';
		html+='</select>';
		
	$('#selectedSocilaMentionsFiltersDiv').html(html);
}