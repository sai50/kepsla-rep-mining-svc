var count=0;
var sessionSelectedOrganizationId=0;
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
	      poplateOrganizations(function(selectedOrgId) {
		   //getAllRespondedFlagsList(selectedOrgId);
	    	  getAllOnChangeRespondedFlagsList();
	   });
	   
});

/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	var selectedOrgId = 0;
	$.ajax({
		type:"GET",
		url:"../responedToFlaggedReviews/getOrganizations.htm",
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
						$(select).append('<option value=' + response[i].id + ' >' + response[i].organizationFullName + '</option>');
					}
				}
				
			}else{
				 // Add options
				for (var i in response) {
					if(i==1){
						$(select).append('<option value=' + response[i].id + ' selected="selected" >' + response[i].organizationFullName + '</option>');
					}else{
						$(select).append('<option value=' + response[i].id + ' >' + response[i].organizationFullName + '</option>');
					}
				}
			}
			selectedOrgId=$('#organizationName option:selected').val();
			callback(selectedOrgId.toString());
		}}
	});
	
}


function getAllOnChangeRespondedFlagsList(){
var organizationId=$('#organizationName option:selected').val();
	$.ajax({
		type:"POST",
		url:"../responedToFlaggedReviews/getOnChangeResponededFlags.htm",
		contentType:"application/json",
		data:JSON.stringify({organizationId:organizationId}),
		success:function(response){
			if(response.length>0){
		var reviewList = new Array();	
		for(var i=0;i<response.length;i++){
		 if(((response[i].reviewTitle !=null)&&(response[i].reviewContent !=null))||((response[i].reviewTitle ==null)&&(response[i].reviewContent !=null))||((response[i].reviewTitle !=null)&&(response[i].reviewContent==null))){
			 reviewList.push(response[i]);
		 }
		}
		$('#noReviews').hide();
		$("#responseReviewFlaggedDiv").html('');
		var html = '';
		for(var j=0;j<reviewList.length;j++){
			    var reviewId=reviewList[j].id;
				var reviewTitle=reviewList[j].reviewTitle;
				var sourceName = reviewList[j].sourceName;
				var reviewContent =reviewList[j].reviewContent;
				var reviewTime=reviewList[j].reviewTime;
				var flagStatus=reviewList[j].flagStatus;
				var reviewLanguage=reviewList[j].reviewLanguage;
				var reviewerName=reviewList[j].reviewerName;
				var reviewOverallRating=reviewList[j].reviewOverallRating;
				var reviewApproved=reviewList[j].flagApproved;
				var reviewFlagComment=reviewList[j].flagComment;
				var reviewCreatedDate=reviewList[j].createdDate;
				
				$("commentBox_"+reviewId).html('');
				
			html='<div class="row col-xs-12 SingleReviewList">'
					+'<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">'
						+'<div  class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">20%</span> </div>'
						+'<div class="reviewDetails row">'
							+'<div class="reviewSource">'+sourceName+'</div>'
							+'<div class="reviewerName">by <span>'+reviewerName+'</span></div>'
							+'<div class="reviewerDetail">from <span>Bangalore, India</span></div>'
							+'<div class="revieweTime"><span class="glyphicon glyphicon-time">'
								+'</span> '+moment(reviewTime).format("DD MMMM YYYY")+'</span>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div class="col-xs-12 col-sm-9 col-lg-10">'
						+'<h3 class="SingleReviewHeader">'+reviewTitle+'</h3>'
						+'<p>'+reviewContent+'</p>'
						
						//this is for comment display
						+'<div class="SubHeading col-xs-12">'
						+'<div class="row" style="border:none;">'
						+'<div class="col-xs-12"></div>'
						+'<div class="col-xs-12 SmallDarkGreyHeader">';
						if(reviewApproved==1){
					    html +='<div><img src="../resources/images/correct.png"><font color="green">Your request has been Approved.This review has been Deleted from Repufact.</font></div>'; 
						}else if(reviewFlagComment=="" || reviewFlagComment==null){console.log(reviewFlagComment);
						html +='<div></div>'; 
						}else{
							html +='<div><img src="../resources/images/wrong.jpg"><font color="red">Your request has been rejected due to : </font>'+reviewFlagComment+'</div>'; 
						}
					    html+='<div class="VerySmallBoldGreyContent marginRight20 float-left">Reason For Flagging :</div>'
						+'<div class="float-left" id="">'+flagStatus+' </div>'
						+'</div><div class="col-xs-12"><div class="revieweTime"><span class="glyphicon glyphicon-time"> </span><span>'+moment(reviewCreatedDate).format("DD MMMM YYYY")+'</span>'
						+'</div></div></div></div>'
						//end of comment display
                                
						//Flag Status Save
                        +' <div class="checkbox">'
                        +' <div class="SmallNormalLightGreyContent">Flag Status:</div>'
                        +' <label style="margin-bottom: 9px;">'
                        +' <input type="radio" id="selectedApprovedChechBox" name="option" onclick="respondedFlagsApproved('+reviewId+')" value="Approved">Approve'
                        +' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="option" class="isRejectCheckBoxSelected" id="isRejectCheckBoxSelected_'+reviewId+'" onclick="respondedFlagsReject('+reviewId+')"  value="Rejected">Reject'
                        +' </label>'
                        
                       //dynamic comment box div
                        +' <div id ="commentBox_'+reviewId+'" class="form-group" style="display: none">'
                        +'<input id="flagNotesReasonForReject_'+reviewId+'" class="form-control input-sm" placeholder="Please Enter Reason For Reject" style="margin-bottom: 9px;">'
                        +' <button id="saveRejectedFlags_'+reviewId+'" class="btn btn-primary btn-sm SaveReviewFlag" onclick="saveRespondedRejectFlags('+reviewId+')" type="button" > Save</button>'
                        +'</div>'
                       
                        +' <div class="form-group input-group col-xs-12" style="margin-bottom: 9px;">';
                        
                        if(reviewApproved==1){
                        html += ' <button id="saveApprovedFlags_'+reviewId+'" class="btn btn-primary btn-sm SaveReviewFlag" onclick="saveRespondedApprovedFlags('+reviewId+')" type="button" > Save</button>';
                        }else{
                        html += ' <button id="saveApprovedFlags_'+reviewId+'" class="btn btn-primary btn-sm SaveReviewFlag" onclick="saveRespondedApprovedFlags('+reviewId+')" type="button" > Save</button>';
                        }
                       html+=' </div>'
                        +' </div>'
            
                       //Flag Status Save
						+'</div>'
                        +'</div>';
			$("#responseReviewFlaggedDiv").append(html).show();

			}
		}else{
			$('#noReviews').html('');
		 	$('#noReviews').append('<h4><font color="red">No responded Flagged reviews for this Organization</font></h4>').show(400);
		 	$("#responseReviewFlaggedDiv").html('');
		}
		}
	    });
		}

function respondedFlagsReject(id){
	 if($("#isRejectCheckBoxSelected_"+id).is(':checked')==true){
			$("#saveApprovedFlags_"+id).hide();
	     	$("#commentBox_"+id).show(300);
	     	}else{
	     		$("#commentBox_"+id).hide();
	     		$("#saveApprovedFlags_"+id).show();
	     	}
}

function respondedFlagsApproved(id){
	 if($("#isRejectCheckBoxSelected_"+id).is(':checked')==true){
			$("#saveApprovedFlags_"+id).show();
	     	$("#commentBox_"+id).hide();
	 }else{
		 $("#commentBox_"+id).hide();
  		$("#saveApprovedFlags_"+id).show();
	 }
	     	
}
  
  function saveRespondedApprovedFlags(id){
	  $.ajaxSetup({ cache: false });//Clear Browser Cache
		$('#page-wrapper').mask('Loading...');
		var JSONObject = {};
		JSONObject['id'] = id;
		$.post("../responedToFlaggedReviews/saveApprovedReview.htm",JSONObject,function(response){console.log(response);
			if(response.status=="SAVE_SUCCESS"){
				alert("saved successfully");
				
			}else if(response.status=="SAVE_ERROR"){
				alert("error in save method");
				}
				$('#page-wrapper').unmask();
		},'json').fail(function(response){
		});
		return false;
  }
  
  
  function saveRespondedRejectFlags(id){
	  var flagComment = $('#flagNotesReasonForReject_'+id).val();
	  if(flagComment=="" || flagComment==null){
		  alert("Please Enter reason for reject");
	  }else{
	  
	  $.ajaxSetup({ cache: false });//Clear Browser Cache
		$('#page-wrapper').mask('Loading...');
		var JSONObject = {};
		JSONObject['id'] = id;
		JSONObject['flagComment'] = flagComment;
		$.post("../responedToFlaggedReviews/saveRejectedFlaggedReview.htm",JSONObject,function(response){console.log(response);
			if(response.status=="SAVE_SUCCESS"){
				alert("saved successfully");
			}else if(response.status=="SAVE_ERROR"){
				alert("error in save method");
				}
				$('#page-wrapper').unmask();
		},'json').fail(function(response){
		});
		return false;
	       }}
	  

