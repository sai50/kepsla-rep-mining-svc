 var currentClass = "";
 var loggedInUserRole = $('#loggedInUserRole').val();
 var flagForDepartment = convertToString("Department");
	var flagForKpi = convertToString("Kpi");
	var flagForMentionCategory = convertToString("MentionCategory");
	var flagForMention = convertToString("Mention");

 /************************************************************************************************************************
 ************************************************S r a v a n*************************************************************
 **************************************************************************************************************************/
 function addFlag(flagFor,qcId,test){
	 currentClass = test;
	 loadingForDashBoard();
	 $('#flagModalBody,#flagModalFooter').html('');
	 $.get("../qualityControlForUser/isFlagAvailable.htm?qcId="+qcId+"&flaggedFor="+flagFor,function(response){
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
			 $('#flagModalFooter').append('<button type="button" class="btn btn-primary" onclick="removeFlag('+id+')">Remove</button>');
	     }
		 $('#flagModalFooter').append('<button type="button" class="btn btn-primary" onclick="saveFlag('+convertToString(flagFor)+','+convertToString(qcId)+')">Save</button>');
		 $('#flagModal').modal('show');
		 unloadingForDashBoard();
	 },'json').fail(function(response){
		 jqueryPostError(response);
	 });
	 
 }
 
 function saveFlag(flagFor,qcId){
	 loadingForDashBoard();
	 $('#flagCommentErrorDiv').hide();
	 $('#flagCommentSuccessDiv').hide();
	 var flagComment = $.trim($('#'+flagFor+'_Comment').val());
	 if(flagComment==""){
		$('#flagCommentErrorDiv').show(600);
		unloadingForDashBoard();
	 }else{
		 var JSONObject = {'qcId':qcId,'flagComment':flagComment,'flaggedFor':flagFor};
		 $.ajax({
			 type:"POST",
			 url:"../qualityControlForUser/saveFlagFor.htm",
			 contentType:"application/json",
			 data:JSON.stringify(JSONObject),
			 success:function(response){
				 if(response.status=="SUCCESS"){
					 $('#flagModal').modal('hide');
					 $(currentClass).css('color','red');
					 unloadingForDashBoard();
					 alert("Flag Added Successfully");
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
 
 function removeFlag(id){
	 if(window.confirm("Do you want to remove flag?")){
		 $.get("../qualityControlForUser/removeFlag.htm?id="+id,function(response){
			 if(response.status=="SUCCESS"){
				 $(currentClass).css('color','green');
				 $('#flagModal').modal('hide');
				 alert("Flag Removed Successfully");
				 return false;
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
	 $.get("../qualityControlForUser/reviewFlag.htm?reviewId="+id,function(response){
		 var flagStatus = response.successObject.review.flagStatus;
		 var comment  = response.successObject.review.flagComment;
		 var flagStatusArray = "";
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
		 if(flagStatusArray.indexOf('INCORRECT_LANGUAGE')>=0){
			 html+=	'<label><input  type="checkbox" value="DUPLICATE_REVIEW" checked> Duplicate Review</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="DUPLICATE_REVIEW"> Duplicate Review</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		 if(flagStatusArray.indexOf('DELETED_REVIEW')>=0){
			 html+=	'<label><input  type="checkbox" value="DELETED_REVIEW" checked> Review deleted from source</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="DELETED_REVIEW"> Review deleted from source</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		 if(flagStatusArray.indexOf('INCORRECT_LANGUAGE')>=0){
			 html+=	'<label><input  type="checkbox" value="INCORRECT_LANGUAGE" checked> Language not correct</label>';
		 }else{
			 html+=	'<label><input  type="checkbox" value="INCORRECT_LANGUAGE"> Language not correct</label>';
		 }
		 html+=	'</div>';
		 
		 html+=	'<div class="col-xs-6">';
		 if(flagStatusArray.indexOf('OTHER')>=0){
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
		 $.post("../qualityControlForUser/updateReviewFlag.htm",JSONObject,function(response){
			 if(response.status=="SUCCESS"){
				 $('#reviewFlagModal').modal('hide');
				 alert("Flag Added Successfully");
				 unloadingForDashBoard();
			 }else{
				 jqueryPostError(response);
			 }
		 },'json').fail(function(response){
			 jqueryPostError(response);
		 });
		 return false;
	 }
	 
 }
 function showMentionModal(qcId,keywordId,reviewId){
		
		$('#changeReferenceModalTitle').text("Change Reference for QC ID :"+qcId);
		var htmlCode='';
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
	var changedMentionsSetToUpdate=new Hashtable();
	function pushChangedMention(qcId,reviewId){
		var qcKpiTag=null;
		if (!$("input[name='mentionRadio']:checked").val()) {
		   alert('Please select option !');
		}
		else {
			var radioValue=$("input[name=mentionRadio]:checked").val();
			if(radioValue=='oldMention'){
				var keywordId=$('#oldMentionOption option:selected').val();
				var mention=$('#oldMentionOption option:selected').text();
				
				qcKpiTag={'id':qcId,'keywordId':keywordId,'reviewSiteContentId':reviewId};
				changedMentionsSetToUpdate.put(qcId,qcKpiTag);
				
				/*var tempHtml='<a  style="color: rgb(0,0,255)" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')">'+mention+'</a>';
				$('#mention_'+qcId).html(tempHtml);
				*/
				//Sravan
				var tempHtml=  '<ula>';
				tempHtml+= 		'<lia>';
				tempHtml+= 			'<a href="#" style="color:green;">'+mention+'</a>';
				tempHtml+=			'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_updatedKeywordId'+'"   value='+keywordId+'>';
				tempHtml+= 		'<ula>';
				tempHtml+= 			' <lia><a  style="color: green;" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')">Mention Reference</a></lia>';
				tempHtml+=  		' <lia><a  style="color:green;" onclick="addFlag('+flagForMention+','+qcId+',this)">Mention</a></lia>';
				tempHtml+=  	'</ula>';
				tempHtml+= 		'</lia>';
				tempHtml+= '</ula>';
				$('#mention_'+qcId).html(tempHtml);

				//console.log(changedMentionsSetToUpdate.values());
			}
			else{
				var mention=$('#newMentionInput').val();
				if($.trim(mention)==""){
					alert("Please Enter Reference name !");
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
							keywordMasterList.push({'id':keywordId,'mention':mention,'nlpQueryName':nlpQueryName});
							/*var tempHtml='<a  style="color: rgb(0,0,255)" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')">'+mention+'</a>';
							$('#mention_'+qcId).html(tempHtml);*/
							//Sravan
							var tempHtml=  '<ula>';
							tempHtml+= 		'<lia>';
							tempHtml+= 			'<a href="#" style="color:green;">'+mention+'</a>';
							tempHtml+=			'<input type="hidden" id="qcDiv_'+qcId+'_'+reviewId+'_updatedKeywordId'+'"  value='+keywordId+'>';
							tempHtml+= 		'<ula>';
							tempHtml+= 			' <lia><a  style="color: green;" onclick="showMentionModal('+qcId+','+keywordId+','+reviewId+')">Mention Reference</a></lia>';
							tempHtml+=  		' <lia><a  style="color:green;" onclick="addFlag('+flagForMention+','+qcId+',this)">Mention</a></lia>';
							tempHtml+=  	'</ula>';
							tempHtml+= 		'</lia>';
							tempHtml+= '</ula>';
							$('#mention_'+qcId).html(tempHtml);
						}else{
							alert(response.errorMessage);
						}
						//console.log(changedMentionsSetToUpdate.values());
					},error:function(response){
						$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
					}
				});
			}
			$('#changeReferenceModal').modal('hide');
		}
	}
	
	function showRestoreQcModal(qcId,reviewId){
		
		$('#restoreQcModalTitle').text("Restore QC Data");
		var htmlCode='Are you sure you want to restore QC ID: '+qcId;
		
		htmlCode+='<div id="restoreChkDiv">';
			htmlCode+='<div class="row mt10">';
				htmlCode+='<label class="col-xs-12">';
					htmlCode+='<input type="checkbox" id="restorePolarity" name="restorePolarity" value="polarity">';
					htmlCode+='Restore Sentiment Polarity';
				htmlCode+='</label>';
				
				htmlCode+='<label class="col-xs-12">';
					htmlCode+='<input type="checkbox" id="restoreKeywords" name="restoreKeywords" value="keywords">';
					htmlCode+='Restore Keywords';
				htmlCode+='</label>';
			
			htmlCode+='<label class="col-xs-12">';
				htmlCode+='<input type="checkbox" id="restoreRef" name="restoreRef" value="reference">';
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
		/*$('#changeReferenceModalText').text("Something went wrong , please contact admin !");*/
		$('#restoreQcModal').modal('show');
	}
	
	/**********On Change DropDown********************/
	var qcPolaritySetToUpdate=new Hashtable();
	function pushNewPolarity(obj,qcId){
		var polarity=$(obj).val().toLowerCase();
		var percentage=$(obj).find(':selected').data('percentage');
		var reviewSiteContentId=$(obj).find(':selected').data('reviewsitecontentid');
		
		qcPolaritySetToUpdate.put(qcId,{'id':qcId,'reviewSiteContentId':reviewSiteContentId,'polarity':polarity,'sentimentScore':percentage});
		
		var txt="Score:"+percentage+"%";
		$('#newPolarityScoreSpan_'+qcId+'').html(txt);
	}

	function updatePolarity(reviewSiteContentId){
		 $('#wrapper').mask('Loading...');
		 $('#leftNavigation,#header').mask();
		 
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
			 $('#leftNavigation,#wrapper,#header').unmask();
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
							$('#leftNavigation,#wrapper,#header').unmask();
						}else{
							alert("update polarity failed");
						}
						
					},error:function(response){
						$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
					}
			});
		 }
	}
	
	function updateQcReview(reviewIds){
		loadingForDashBoard();
		var organizationId = $('#organizationName option:selected').val();
		var reviewList = [];
		for(var r=0;r<reviewIds.length;r++){
			var reviewId = reviewIds[r];
			reviewList.push({'reviewSiteContentId':reviewId,'organizationId':organizationId});
		}
		console.log(reviewList);
		$.ajax({
			type:"POST",
			url:"../qualityControlForUser/listAllQc.htm",
			contentType:"application/json",
			data:JSON.stringify(reviewList),
			success:function(response){
				alert("Check Repose");
				console.log(response);
				var qcList = response.successObject.listQc;
				var updatedQcList = [];
				$.each(qcList,function(index,value){
					for(var i=0;i<reviewIds.length;i++){
						if(value.reviewId == reviewIds[i]){
							var qcId = value.id;
							var updatedPolarity = $('#qcDiv_'+qcId+"_"+reviewId+"_polarity option:selected").val();
							var updatedScore = $('#qcDiv_'+qcId+"_"+reviewId+"_sentimentScore").val();
							var updatedKeywordId = $('#qcDiv_'+qcId+"_"+reviewId+"_updatedKeywordId").val();
							updatedQcList.push({'polarity':updatedPolarity,'reviewSiteContentId':reviewId,'id':qcId,'keywordId':updatedKeywordId,'sentimentScore':updatedScore});
						}
						
					}
				});
				console.log(updatedQcList);
				//updateQcStaging(updatedQcList);
				unloadingForDashBoard();
			},error:function(response){
				jqueryPostError(response);
			}
			
		});
		
		
		/*var JSONObject = {'reviewSiteContentId':reviewId,'organizationId':organizationId};
		$.post("../qualityControlForUser/listAllQc.htm",JSONObject,function(response){
			var qcList = response.successObject.listQc;
			var updatedQcList = [];
			$.each(qcList,function(index,value){
				for(var i=0;i<reviewIds.length;i++){
					if(value.reviewId == reviewIds[i]){
						var qcId = value.id;
						var updatedPolarity = $('#qcDiv_'+qcId+"_"+reviewId+"_polarity option:selected").val();
						var updatedScore = $('#qcDiv_'+qcId+"_"+reviewId+"_sentimentScore").val();
						var updatedKeywordId = $('#qcDiv_'+qcId+"_"+reviewId+"_updatedKeywordId").val();
						updatedQcList.push({'polarity':updatedPolarity,'reviewSiteContentId':reviewId,'id':qcId,'keywordId':updatedKeywordId,'sentimentScore':updatedScore});
					}
					
				}
				

			});
			console.log(updatedQcList);
			updateQcStaging(updatedQcList);
			unloadingForDashBoard();
			
		},'json').fail(function(response){
			jqueryPostError(response);
		});
		return false;
		*/
		
	}
	 
	
	function updateQcStaging(updatedQcList){
		$.ajax({
			type:"POST",
			url:"../qualityControlForUser/updateQc.htm",
			contentType:"application/json",
			data:JSON.stringify(updatedQcList),
			success:function(response){
				if(response.status=="LIST_SUCCESS"){
					alert("Updated Successfully");
				}
			},error:function(response){
				jqueryPostError(response);
			}
		});
		return false;
		
	}
	
	
	/************************************************************************************************************************
	 ************************************************Nitesh*************************************************************
	 **************************************************************************************************************************/
	/****************************************************************************************************************************/	
	var kpiTagSentimentAnalysisListToDelete=[];
	 function pushQcForDelete(selectedQcId,reviewSiteContentId){
		 //$('#qcDiv_'+selectedQcId+'_'+reviewSiteContentId).hide();
		 kpiTagSentimentAnalysisListToDelete.push({'id':selectedQcId,'reviewSiteContentId':reviewSiteContentId});
		 $('#qcDiv_'+selectedQcId+'_'+reviewSiteContentId).addClass("disabledbutton");
		 var _kpiTagSentimentAnalysisListToDelete=[];
		 _kpiTagSentimentAnalysisListToDelete.push({'id':selectedQcId,'reviewSiteContentId':reviewSiteContentId});
		 $.ajax({
				type:"POST",
				url:"../qualityControl/deleteStagingQc.htm",
				contentType:"application/json",
				data:JSON.stringify(_kpiTagSentimentAnalysisListToDelete),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						
					}else{
						alert("delete staging qc failed");
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }
	 function deleteQc(reviewSiteContentId){
		
		 $('#wrapper').mask('Loading...');
		 $('#leftNavigation,#header').mask();
		 
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
			 $('#leftNavigation,#wrapper,#header').unmask();
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
							$('#leftNavigation,#wrapper,#header').unmask();
						}else{
							alert("delete qc failed");
						}
					},error:function(response){
						$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
					}
			});
		 }
	 }
	 jQuery(document ).on( "keyup", ".sentimentPointInput", function(){ 
		 if($(this).val()>2 || $(this).val()<-2){
			 $(this).val('');
		 }
	});

	function viewReviewSitesContent(){
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
		 var clientId = selected.data('clientId');
		 
		 $('#loadMaskDiv').mask();
		 $.post( '../qualityControl/listReviewSitesContentUI.htm',{'clientId':clientId,'startDate':startDate,'endDate':endDate,'organizationId':organizationId}, function( response ) {
			 $('#loadMaskDiv').unmask();
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
		 var clientId = selected.data('clientId');
		 var sortBy = $('#sortSelectOption option:selected').val();
		 $('#loadMaskDiv').mask();
		 $.post( '../qualityControl/listSortedReviewSitesContentUI.htm',{'sortBy':sortBy,'clientId':clientId,'startDate':startDate,'endDate':endDate,'organizationId':organizationId}, function( response ) {
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
			  maxVisible: 10
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
					    		'qcList':response.successObject.qcList
								};
					    var response2 = {'successObject' : successObject };
					    html = listReviewStatusResponse(response2);
					    $('#'+divId).html(html);
					    $('#reviewsListForm').show();
					    
			 	});
			
				/*****************************initializatio of pagination*****************************/
				var successObject = {
					'reviewSitesContentUIList' : response.successObject.reviewSitesContentUIList.slice(0,4),
					'qcList':response.successObject.qcList
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

	function listReviewStatusResponse(response) {
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
					 var reviewContent=reviewSitesContentList[i].reviewContent;
					 var id=reviewSitesContentList[i].id;
					 var sourceName=reviewSitesContentList[i].sourceName;
					 var reviewTime=reviewSitesContentList[i].reviewTime;
					 var reviewStatus=reviewSitesContentList[i].reviewStatus;
					 var sourceId=reviewSitesContentList[i].contentSourceId;
					 var kpiTagSentimentAnalysisUIList=reviewSitesContentList[i].kpiTagSentimentAnalysisUIList;
					 /****************Hidden Value for review status*********************************************/
					 tempHtml+=	'<input type="hidden" value='+reviewStatus+'  id="review_'+id+'">';
					    if(reviewStatus=="DELETED"){
					    	tempHtml+=	'<div id="reviewContentDiv_'+id+'" class="row disabledbutton" style="margin-left: 10px;">';
					    }
					    else{
					    	tempHtml+=	'<div id="reviewContentDiv_'+id+'" class="row" style="margin-left: 10px;">';
					    }
					    if(reviewStatus=="NEW" || reviewStatus=="PENDING"){
					    	 tempHtml+=	'<input type="checkbox"  onclick="pushReviewForBulk('+id+',this)">';
					    }
					    
					    if(reviewSitesContentList[i].hId!=null && reviewSitesContentList[i].hId!=""){
					    	 tempHtml+=	'<p style="">Review Id :'+reviewSitesContentList[i].hId+' Source :'+sourceName+' Date :'+ moment(reviewTime).format("DD MMMM YYYY")+' ';
					    }else{
					    	tempHtml+=	'<p style="">Review Id :'+id+' Source :'+sourceName+' Date :'+ moment(reviewTime).format("DD MMMM YYYY")+' ';
					    }
					    if(reviewStatus=='PENDING'){
					    	 tempHtml+=	'<span style="color:red;float:top">PENDING</span>';
					    }
					    if(reviewStatus=='APPROVED'){
					    	 tempHtml+=	'<span style="color:blue;float:top">APPROVED</span>';
					    }
					    if(reviewStatus=='DELETED'){
					    	 tempHtml+=	'<span style="color:red;float:top">DELETED</span>';
					    }
					    if(reviewStatus=='NEW'){
					    	 tempHtml+=	'<span style="color:green;float:top">New</span>';
					    }
						if(reviewTitle!=null){	
					    	tempHtml+=	'<h4 style="color:blue;float:top">'+reviewTitle+'</h4>';
						}
						tempHtml+=	'</p>';
						tempHtml+=	'<p>'+reviewContent+'</p>';
						
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
								tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="row form-group col-sm-12" >';
								               
								var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
										tempHtml+=returnHtml;
								tempHtml+='</div>';
							}else{
								tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="row form-group col-sm-12 disabledbutton" >';
								var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
										tempHtml+=returnHtml;
								tempHtml+='</div>';
							}
							
							tempHtml+='<div class="col-sm-1">';
								tempHtml+='<input class="btn btn-primary"  onclick ="showRestoreQcModal('+qcId+','+id+')" value="R" type="button">';
							tempHtml+='</div>';
						}

						tempHtml+='<div class="form-group row col-sm-12">';
							/*tempHtml+='<input class="btn btn-primary" id="addOrganizationType" onclick ="process('+id+')" value="Process" type="button">';
							tempHtml+='<input class="btn btn-primary" id="addDepartmentType" onclick ="addKpi('+id+')" value="Add KPI"  type="button">';*/
						if(reviewStatus!="APPROVED"){
							if(loggedInUserRole!="GHN_ADMIN"){
								tempHtml+='<input class="btn btn-primary" id="" onclick ="updateQcReview('+id+')" value="Update"  type="button">';
							}
						}
						if(loggedInUserRole=="GHN_ADMIN"){
							tempHtml+='<input class="btn btn-primary" id="" onclick ="restoreStagingForReview('+id+')" value="Restore Review"  type="button">';
							tempHtml+='<input class="btn btn-primary" id="" onclick ="showAddQCModal('+id+','+sourceId+','+reviewTime+')" value="Add a new mapping"  type="button">';
							tempHtml+='<input class="btn btn-primary" id="" onclick ="deleteReview('+id+')" value="Delete"  type="button">';
							tempHtml+='<input class="btn btn-primary" id="" onclick ="approve('+id+')" value="Approve"  type="button">';
						}
						
						tempHtml+='</div>';
						
						tempHtml+='<div id="errorDiv_'+id+'" class="row form-group col-sm-12">';
						tempHtml+='</div>';
						
						
						tempHtml+='</div>';
						tempHtml+='<hr>';
				 }
			} else {
				tempHtml += '<font style="color:red">No Records Found </font>';
			}
			return tempHtml;
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
		//console.log(reviewSetForBulk.values());
	}
	function approveAll(){
		var reviewListToApprove=reviewSetForBulk.values();
		console.log(reviewListToApprove);
		for(var i=0;i<reviewListToApprove.length;i++){
			approve(reviewListToApprove[i].id);
			if(reviewListToApprove.length-1==i){
				reviewSetForBulk.clear();
			}
		}
	}
	function paintReviewDiv(review){
		var tempHtml="";
		
		 var reviewTitle=review.reviewTitle;
		 var reviewContent=review.reviewContent;
		 var id=review.id;
		 var sourceName=review.sourceName;
		 var reviewTime=review.reviewTime;
		 var reviewStatus=review.reviewStatus;
		 
		var sourceId=review.contentSourceId;
		 
		 var kpiTagSentimentAnalysisUIList=review.kpiTagSentimentAnalysisUIList;

		 	
		  	if(reviewStatus=="NEW" || reviewStatus=="PENDING"){
		    	 tempHtml+=	'<input type="checkbox"  onclick="pushReviewForBulk('+id+',this)">';
		    }
		    if(review.hId!=null && review.hId!=""){
		    	 tempHtml+=	'<p style="">Review Id :'+review.hId+' Source :'+sourceName+' Date :'+ moment(reviewTime).format("DD MMMM YYYY")+' ';
		    }else{
		    	tempHtml+=	'<p style="">Review Id :'+id+' Source :'+sourceName+' Date :'+ moment(reviewTime).format("DD MMMM YYYY")+' ';
		    }
		    if(reviewStatus=='PENDING'){
		    	 tempHtml+=	'<span style="color:red;float:top">PENDING</span>';
		    }
		    if(reviewStatus=='APPROVED'){
		    	 tempHtml+=	'<span style="color:blue;float:top">APPROVED</span>';
		    }
		    if(reviewStatus=='DELETED'){
		    	 tempHtml+=	'<span style="color:red;float:top">DELETED</span>';
		    }
		    if(reviewStatus=='NEW'){
		    	 tempHtml+=	'<span style="color:green;float:top">New</span>';
		    }
			if(reviewTitle!=null){	
		    	tempHtml+=	'<h4 style="color:blue;float:top">'+reviewTitle+'</h4>';
			}
			tempHtml+=	'</p>';
			tempHtml+=	'<p>'+reviewContent+'</p>';
			
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
				var map = [];
				/*tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="row form-group col-sm-12" >';
				
				var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
				tempHtml+=returnHtml;
				tempHtml+='</div>';*/
				
				if(deletedStatus==false){
					tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="row form-group col-sm-12" >';
					
					var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
							tempHtml+=returnHtml;
					tempHtml+='</div>';
				}else{
					tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="row form-group col-sm-12 disabledbutton" >';
					var returnHtml=paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId);
							tempHtml+=returnHtml;
					tempHtml+='</div>';
				}
				
				tempHtml+='<div class="col-sm-1">';
					tempHtml+='<input class="btn btn-primary"  onclick ="showRestoreQcModal('+qcId+','+id+')" value="R" type="button">';
				tempHtml+='</div>';
				
			}

			tempHtml+='<div class="form-group row col-sm-12">';
			
			if(loggedInUserRole!="GHN_ADMIN"){
				if(reviewStatus!="APPROVED"){
					tempHtml+='<input class="btn btn-primary" id="" onclick ="updateQcReview('+array+')" value="Update"  type="button">';
					tempHtml+='<input class="btn btn-primary" id="" onclick ="deleteReview('+id+')" value="Delete"  type="button">';
				}else{
					
				}
			}
			if(loggedInUserRole=="GHN_ADMIN"){
				tempHtml+='<input class="btn btn-primary" id="" onclick ="deleteReview('+id+')" value="Delete"  type="button">';
				tempHtml+='<input class="btn btn-primary" id="" onclick ="approve('+id+')" value="Approve"  type="button">';
				tempHtml+='<input class="btn btn-primary" id="" onclick ="restoreStagingForReview('+id+')" value="Restore Review"  type="button">';
				tempHtml+='<input class="btn btn-primary" id="" onclick ="showAddQCModal('+id+','+sourceId+','+reviewTime+')" value="Add a new mapping"  type="button">';
			}
			tempHtml+='</div>';
			tempHtml+='<div id="errorDiv_'+id+'" class="row form-group col-sm-12">';
			tempHtml+='</div>';
			
		return tempHtml;
	}
	function deleteReview(reviewId){
		 var organizationId=$('#organizationName option:selected').val();
		 var organizationIdInt=parseInt(organizationId);
		 reviewSitesContent={'id':reviewId,'reviewStatus':'DELETED','organizationId':organizationIdInt};
		 $.ajax({
				type:"POST",
				url:"../qualityControl/deleteReview.htm",
				contentType:"application/json",
				data:JSON.stringify(reviewSitesContent),
				success:function(response){
					if(response.status="UPDATE_SUCCESS"){
						var updatedReview=response.successObject.updatedReview;
						var returnHtml=paintReviewDiv(updatedReview);
						$("#reviewContentDiv_"+reviewId).html(returnHtml);
						if(updatedReview.reviewStatus=="DELETED"){
							$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
						}
						$('#leftNavigation,#wrapper,#header').unmask();
						//alert("review has been approved successfully.");
					}else{
						alert("review deletefalied.");
					}
					
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	}
	function selectAll(){
		$("#reviewSitesContentListDiv :checkbox").each(function () {
		      //do it here
		      /*if (!this.checked){*/
		          this.click();
		});
	}
	function paintQcDiv(qcId,id,kpiTagSentimentAnalysisUI,departmentName,kpiName,keywordName,keywordId,map,departmentId,kpiId,sourceId){
		var flagForDepartment = convertToString("DEPARTMENT");
		var flagForKpi = convertToString("KPI");
		var flagForMentionCategory = convertToString("MENTIONCATEGORY");
		var flagForMention = convertToString("MENTION");
			var tempHtml="";
			/*tempHtml+=	'<div id="qcDiv_'+qcId+'_'+id+'" class="row form-group col-sm-12" >';*/
			tempHtml+=	'<div class="col-sm-1">';
			if(kpiTagSentimentAnalysisUI.qId!=null && kpiTagSentimentAnalysisUI.qId!=""){
				tempHtml+='<p>QC ID '+kpiTagSentimentAnalysisUI.qId+'</p>';
			}else{
				tempHtml+='<p>QC ID '+qcId+'</p>';
			}
			tempHtml+=	'</div>';
		
			tempHtml+=	'<div class="col-sm-1" id="'+qcId+'">';
			
			var tempQcId = 0;
			$.each(map,function(index,value){
				if(value.qcId==qcId && value.flaggedFor=="DEPARTMENT"&& value.flagComment!=null){
					tempQcId = value.qcId;
					tempHtml+='<a style="color:red;" onclick="addFlag('+flagForDepartment+','+qcId+',this)"><p>'+departmentName+'</p></a>';
				}
			});
			if(tempQcId!=qcId){
				tempHtml+='<a style="color:green;" onclick="addFlag('+flagForDepartment+','+qcId+',this)"><p>'+departmentName+'</p></a>';
			}
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+id+'_department_id'+'" value='+departmentId+'>';
			tempHtml+=	'</div>';
			
			tempHtml+=	'<div class="col-sm-1">';
			tempQcId = 0;
			$.each(map,function(index,value){
				if(value.qcId==qcId && value.flaggedFor=="KPI"&& value.flagComment!=null){
					tempQcId = value.qcId;
					tempHtml+='<a style="color:red;" onclick="addFlag('+flagForKpi+','+qcId+',this)"><p>'+kpiName+'</p></a>';
				}
			});
			if(tempQcId!=qcId){
				tempHtml+='<a style="color:green;" onclick="addFlag('+flagForKpi+','+qcId+',this)"><p>'+kpiName+'</p></a>';
			}
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+id+'_kpi_id'+'" value='+kpiId+'>';
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+id+'_sourceId'+'" value='+sourceId+'>';
			tempHtml+=	'</div>';
		
			
			tempHtml+=	'<div class="col-sm-1">';
			tempQcId = 0;
			$.each(map,function(index,value){
				if(value.qcId==qcId && value.flaggedFor=="MENTIONCATEGORY"&& value.flagComment!=null){
					tempQcId = value.qcId;
					tempHtml+='<a style="color:red;" onclick="addFlag('+flagForMentionCategory+','+qcId+',this)"><span>'+keywordName+'</span></a>';
					
				}
			});
			
			if(tempQcId!=qcId){
				tempHtml+='<a style="color:green;" onclick="addFlag('+flagForMentionCategory+','+qcId+',this)"><span>'+keywordName+'</span></a>';
			}
			tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+id+'_updatedKeywordId'+'" value='+keywordId+'>';
			tempHtml+='</div>';
			
			tempHtml+=	'<div class="col-sm-1"   id="mention_'+qcId+'">';
			tempHtml+=  '<ula>';
			tempHtml+= 		'<lia>';
			tempQcId = 0;
			$.each(map,function(index,value){
				if(value.qcId==qcId && value.flaggedFor=="MENTION"&& value.flagComment!=null){
					tempQcId = value.qcId;
					tempHtml+= 			'<a href="#" style="color:red;">'+kpiTagSentimentAnalysisUI.mention+'</a>';
					tempHtml+= 		'<ula>';
					tempHtml+= 			' <lia><a  style="color: green;" onclick="showMentionModal('+qcId+','+keywordId+','+id+')">Mention Reference</a></lia>';
					tempHtml+=  		' <lia><a  style="color:red;" onclick="addFlag('+flagForMention+','+qcId+',this)">Flag</a></lia>';
				}
			});
			if(tempQcId!=qcId){
				tempHtml+= 			'<a href="#" style="color:green;">'+kpiTagSentimentAnalysisUI.mention+'</a>';
				tempHtml+= 		'<ula>';
				tempHtml+= 			' <lia><a  style="color: green;" onclick="showMentionModal('+qcId+','+keywordId+','+id+')">Mention Reference</a></lia>';
				tempHtml+=  		' <lia><a  style="color:green;" onclick="addFlag('+flagForMention+','+qcId+',this)">Flag</a></lia>';

			}
			
			tempHtml+=  	'</ula>';
			tempHtml+= 		'</lia>';
			tempHtml+= '</ula>';
			
			tempHtml+='</div>';
		
			tempHtml+=	'<div class="col-sm-2">';
				tempHtml+='<span>{ '+kpiTagSentimentAnalysisUI.subKeywords+' }</span>';
			tempHtml+='</div>';
		
			tempHtml+=	'<div class="col-sm-1">';
				if(kpiTagSentimentAnalysisUI.sentimentScoreStr!=null){
					tempHtml+='<span id="newPolarityScoreSpan_'+qcId+'">Score:'+kpiTagSentimentAnalysisUI.sentimentScoreStr+'%</span>';
					tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+id+'_sentimentScore'+'" value='+kpiTagSentimentAnalysisUI.sentimentScoreStr+'>';
				}else{
					tempHtml+='<span id="newPolarityScoreSpan_'+qcId+'">Score:'+kpiTagSentimentAnalysisUI.sentimentScore.toFixed(0)+'%</span>';
					tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+id+'_sentimentScore'+'" value='+kpiTagSentimentAnalysisUI.sentimentScore.toFixed(0)+'>';
					tempHtml+=	'<input type="hidden" id="qcDiv_'+qcId+'_'+id+'_updatedKeywordId'+'" value='+keywordId+'>';
				}
			tempHtml+='</div>';
		
			tempHtml+=	'<div class="col-sm-2">';
				tempHtml+='<select  class="form-control input-sm" onchange="pushNewPolarity(this,\''+qcId+'\')" id="qcDiv_'+qcId+'_'+id+'_polarity'+'">';
				
				for(var q=0;q<qcPolarityList.length;q++){
					if(kpiTagSentimentAnalysisUI.polarity.toLowerCase()==qcPolarityList[q].polarity.toLowerCase()){
						tempHtml+='<option data-reviewsitecontentid="'+id+'" data-percentage="'+qcPolarityList[q].percentage+'" selected value="'+qcPolarityList[q].polarity+'">'+qcPolarityList[q].polarity+'</option>';
					}else{
						tempHtml+='<option data-reviewsitecontentid="'+id+'" data-percentage="'+qcPolarityList[q].percentage+'" value="'+qcPolarityList[q].polarity+'">'+qcPolarityList[q].polarity+'</option>';
					}
				}
					
				tempHtml+='</select>';
			tempHtml+='</div>';
		
			tempHtml+='<div class="col-sm-1">';
				if(kpiTagSentimentAnalysisUI.originalScore==0){
					tempHtml+='<span>Original Score: NA </span>';
				}else{
					tempHtml+='<span>Original Score:'+kpiTagSentimentAnalysisUI.originalScore.toFixed(0)+'%</span>';
				}
			tempHtml+='</div>';
			
			tempHtml+='<div class="col-sm-1" style="padding-top:0px;">';
			var reviewStatus = $('#review_'+id).val();
			if(loggedInUserRole!="GHN_ADMIN" && reviewStatus=="APPROVED"){
			}else{
				tempHtml+='	<input class="btn btn-default" onclick="pushQcForDelete('+qcId+','+id+')" value="x" type="button">';
			}
			tempHtml+='</div>';
		/*
			tempHtml+=	'<div class="col-sm-1">';
				tempHtml+='<input class="btn btn-primary"  onclick ="showRestoreQcModal('+qcId+','+id+')" value="R" type="button">';
			tempHtml+='</div>';
		
		/*tempHtml+='</div>';*/
		return tempHtml;
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
								htmlCode+='<option  value="'+departmentTypesForOrganization[i].id+'">'+departmentTypesForOrganization[i].departmentName+'</option>';
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
		
		if (!$("input[name='mentionRadio']:checked").val()) {
			  alert('Please select option !');
		}
		else {
			var radioValue=$("input[name=mentionRadio]:checked").val();
			if(radioValue=='oldMention'){
				keywordId=$('#oldMentionOption option:selected').val();
				mention=$('#oldMentionOption option:selected').text();
			}
			else{
				mention=$('#newMentionInput').val();
				if($.trim(mention)==""){
					alert("Please Enter Reference name !");
					return;
				}
			}
		}
		var newQC={'mention':mention,'keywordName':keywordName,'reviewDateStr':reviewDate,'polarity':polarity,'sentimentScore':sentimentScore,'organizationId':organizationId,'reviewSiteContentId':reviewId,'sourceId':sourceId,'departmentId':departmentId,'kpiId':kpiId,'keywordId':keywordId};
		if(departmentId==""|| kpiId=="" || keywordId=="" || mention=="" || keywordName==""||departmentId=="noData"|| kpiId=="noData" || keywordId=="noData" || mention=="noData" || keywordName=="No Data Found"){
			alert("Please select all mandatory fields.");
			return ;
		}
		$.ajax({
			type:"POST",
			url:"../qualityControl/saveStagingQC.htm",
			contentType:"application/json",
			data:JSON.stringify(newQC),
			success:function(response){
				if(response.status=="SAVE_SUCCESS"){
					var review=response.successObject.review;
					var returnHtml=paintReviewDiv(review);
					$("#reviewContentDiv_"+reviewId).html(returnHtml);
					if(review.reviewStatus=="DELETED"){
						$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
					}
					$('#leftNavigation,#wrapper,#header').unmask();
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
		var departmentTypeId=$('#departmentTypeOption option:selected').val();
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
									htmlCode+='<option value="'+distinctKeywords[i].id+'">'+distinctKeywords[i].mention+'</option>';
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
	/*function showRestoreQcModal(qcId,reviewId){
		
		$('#restoreQcModalTitle').text("Restore QC Data");
		var htmlCode='Are you sure you want to restore QC ID: '+qcId;
		
		htmlCode+='<div id="restoreChkDiv">';
			htmlCode+='<div class="row mt10">';
				htmlCode+='<label class="col-xs-12">';
					htmlCode+='<input type="checkbox" id="restorePolarity" name="restorePolarity" value="polarity">';
					htmlCode+='Restore Sentiment Polarity';
				htmlCode+='</label>';
				
				htmlCode+='<label class="col-xs-12">';
					htmlCode+='<input type="checkbox" id="restoreKeywords" name="restoreKeywords" value="keywords">';
					htmlCode+='Restore Keywords';
				htmlCode+='</label>';
			
			htmlCode+='<label class="col-xs-12">';
				htmlCode+='<input type="checkbox" id="restoreRef" name="restoreRef" value="reference">';
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
		$('#changeReferenceModalText').text("Something went wrong , please contact admin !");
		$('#restoreQcModal').modal('show');
	}
	*/
	var reviewSetToRestore=new Hashtable();
	function restoreStagingForReview(reviewId){
		 var organizationId=parseInt($("#organizationName").val());
		var reviewSitesContent={'id':reviewId,'organizationId':organizationId}; 
		reviewSetToRestore.put(reviewId,reviewSitesContent);
		/*console.log(reviewSetToRestore.values());*/
		var reviewSitesContentTemp=reviewSetToRestore.get(reviewId);
		//console.log(reviewSitesContentTemp);
		$.ajax({
				type:"POST",
				url:"../qualityControl/restoreStagingForReview.htm",
				contentType:"application/json",
				data:JSON.stringify(reviewSitesContentTemp),
				success:function(response){
					if(response.status=="UPDATE_SUCCESS"){
						var originalReview=response.successObject.originalReview;
						var returnHtml=paintReviewDiv(originalReview);
						$("#reviewContentDiv_"+reviewId).html(returnHtml);
						if(originalReview.reviewStatus=="DELETED"){
							$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
						}
						$('#leftNavigation,#wrapper,#header').unmask();
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	}

	function restoreQcForReview(reviewSiteContentId){
		 $('#wrapper').mask('Loading...');
		 $('#leftNavigation,#header').mask();
		 
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
				$('#leftNavigation,#wrapper,#header').unmask();
		 }else{
			 $.ajax({
					type:"POST",
					url:"../qualityControl/restoreQcForReview.htm",
					contentType:"application/json",
					data:JSON.stringify(reviewSitesContentTemp),
					success:function(response){
						if(response.status=="UPDATE_SUCCESS"){
							approveReview(reviewSiteContentId);
							$('#leftNavigation,#wrapper,#header').unmask();
						}else{
							var htmlCode="<span style='color:rgb(255,0,0)'>Errors : "+response.errorMessage+"</span>";
							$("#errorDiv_"+reviewSiteContentId).html(htmlCode);
							alert("restore qc failed");
						}
					},error:function(response){
						$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
					}
			});
		 }
	}

	function approve(reviewId){
		 updatePolarity(reviewId);
		 //updateMention(reviewId);
		 //deleteQc(reviewId);
		//restoreQcForReview(reviewId);
		 //approveReview(reviewId);
	}

	var kpiTagSentimentAnalysisSetToRestore=new Hashtable();
	function restoreStagingQc(qcId,reviewId){
		var restoringReason=$('#restoringReasonId').val();
		if(restoringReason==""){
			alert("Please Enter reason for restoring.");
			return;
		}
		
		var selected = [];
		$('#restoreChkDiv input:checked').each(function() {
		    selected.push($(this).attr('value'));
		});
		
		var kpiTagSentimentAnalysis={'id':qcId,'reviewSiteContentId':reviewId,'restorePoints':selected,'restoringReason':restoringReason}; 
		kpiTagSentimentAnalysisSetToRestore.put(qcId,kpiTagSentimentAnalysis);
		//console.log(kpiTagSentimentAnalysis);
		
		$.ajax({
				type:"POST",
				url:"../qualityControl/restoreStagingQcForAdmin.htm",
				contentType:"application/json",
				data:JSON.stringify(kpiTagSentimentAnalysis),
				success:function(response){
					if(response.status=="UPDATE_SUCCESS"){
						$('#restoreQcModal').modal('hide');
						var originalkpiTagSentimentAnalysis=response.successObject.originalKpiTagSentimentAnalysis;
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
						$('#qcDiv_'+qcId+'_'+reviewSitesContentId).removeClass("disabledbutton");
						$('#leftNavigation,#wrapper,#header').unmask();
					}
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	}
	function restoreQc(reviewSiteContentId){
		 $('#wrapper').mask('Loading...');
		 $('#leftNavigation,#header').mask();
		 
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
			 $('#leftNavigation,#wrapper,#header').unmask();
		 }else{
			 $.ajax({
					type:"POST",
					url:"../qualityControl/restoreQcForAdmin.htm",
					contentType:"application/json",
					data:JSON.stringify(kpiTagSentimentAnalysisListToRestoreTemp),
					success:function(response){
						if(response.status=="UPDATE_SUCCESS"){
							deleteQc(reviewSiteContentId);
							$('#leftNavigation,#wrapper,#header').unmask();
						}else{
							var htmlCode="<span style='color:rgb(255,0,0)'>Errors : "+response.errorMessage+"</span>";
							$("#errorDiv_"+reviewSiteContentId).html(htmlCode);
							alert("delete qc failed");
						}
					},error:function(response){
						$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
					}
			});
		 }
	}

	function updateMention(reviewSiteContentId){
		 $('#wrapper').mask('Loading...');
		 $('#leftNavigation,#header').mask();
		 
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
			 $('#leftNavigation,#wrapper,#header').unmask();
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
							$('#leftNavigation,#wrapper,#header').unmask();
						}else{
							var htmlCode="<span style='color:rgb(255,0,0)'>Errors : "+response.errorMessage+"</span>";
							$("#errorDiv_"+reviewSiteContentId).html(htmlCode);
							alert("restore qc update failed ");
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
						var returnHtml=paintReviewDiv(updatedReview);
						$("#reviewContentDiv_"+reviewId).html(returnHtml);
						if(updatedReview.reviewStatus=="DELETED"){
							$("#reviewContentDiv_"+reviewId).addClass("disabledbutton");
						}
						$('#leftNavigation,#wrapper,#header').unmask();
						alert("review(s) has been approved successfully.");
					}else{
						alert("review approval falied.");
					}
					
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
	 }
	 function getSentimentPoint(id){
		 dropdownId="reviewSitesContentId_"+id+"_Kpi_Dropdown";
		 sentimentInputId="reviewSitesContentId_"+id+"_SentimentPointinput";
		 $('#'+sentimentInputId).val($('#'+dropdownId).val());
	 }

	function loadFilterUI(){
		alert("hrere");
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
		
		var orgId = $("#organizationName").val();
		
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
			var fromDate = $('#filterFromDate').val();
			var toDate = $('#filterToDate').val();
			var organizationId = $('#organizationName option:selected').val();
			 var selected = $('#organizationName').find('option:selected');
			var clientId = selected.data('clientId');
			 
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
			
			var reviewFilterUI = {
				'reviewTypes' : reviewTypes,
				'sources' : sources,
				'flags' : flags,
				'organizationId' : organizationId,
				'fromDate' : fromDate,
				'toDate' : toDate,
				'clientId':clientId
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
							$('#broadcastSuccessModalTitle').text("Error");
							$('#broadcastSuccessModalText').text(
									"Something went wrong , please contact admin !");
							$('#broadcastSuccessModal').modal('show');
						}
				});
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
						response = JSON.parse(JSON.stringify(normalReviewsDuplicateResponseObject));
						for (var i = 0; i < response.successObject.reviewSitesContentUIList.length; i++) {
							var item = response.successObject.reviewSitesContentUIList[i];
							if (item.reviewContent == null)
								item.reviewContent = "";
							if (item.reviewTitle == null)
								item.reviewTitle = "";
							
							var qcIds=[];
							var sentimentScores=[];
							var departments=[];
							var kpiNames=[];
							var keywordNames=[];
							var mentions=[];
							var subKeywordsNames=[];
							if(item.kpiTagSentimentAnalysisUIList!=null && item.kpiTagSentimentAnalysisUIList.length>0){
								
								for(var m=0;m<item.kpiTagSentimentAnalysisUIList.length;m++){
									qcIds.push(item.kpiTagSentimentAnalysisUIList[m].id);
									sentimentScores.push(item.kpiTagSentimentAnalysisUIList[m].sentimentScore.toFixed(0));
									departments.push(item.kpiTagSentimentAnalysisUIList[m].departmentName.toLowerCase());
									kpiNames.push(item.kpiTagSentimentAnalysisUIList[m].kpiName.toLowerCase());
									keywordNames.push(item.kpiTagSentimentAnalysisUIList[m].keywordName.toLowerCase());
									mentions.push(item.kpiTagSentimentAnalysisUIList[m].mention.toLowerCase());
									subKeywordsNames.push(item.kpiTagSentimentAnalysisUIList[m].subKeywords.toLowerCase());
								}
							}
							
							if (searchKey != ""	
								&& (item.reviewContent.toLowerCase().indexOf(searchKey.toLowerCase()) != -1
								|| (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
								|| (qcIds.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
								|| (sentimentScores.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
								|| (departments.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (kpiNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (mentions.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (subKeywordsNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (keywordNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (item.id.toString().indexOf(searchKey.toString())) != -1)) {
								var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';
								item.reviewContent = item.reviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
								item.reviewTitle = item.reviewTitle.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
								
								item.hId = item.id.toString().split(searchKey.toString()).join(hightedText);
								searchedReviewTitle = item.reviewTitle;
								searchedReviewContent = item.reviewContent;
								
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
										if(item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
											item.kpiTagSentimentAnalysisUIList[j].subKeywords = item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
										}
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
							if (item.reviewContent == null)
								item.reviewContent = "";
							if (item.reviewTitle == null)
								item.reviewTitle = "";
							var qcIds=[];
							var sentimentScores=[];
							var departments=[];
							var kpiNames=[];
							var keywordNames=[];
							var subKeywordsNames=[];
							var mentions=[];
							if(item.kpiTagSentimentAnalysisUIList!=null && item.kpiTagSentimentAnalysisUIList.length>0){
								
								for(var m=0;m<item.kpiTagSentimentAnalysisUIList.length;m++){
									sentimentScores.push(item.kpiTagSentimentAnalysisUIList[m].sentimentScore.toFixed(0));
									qcIds.push(item.kpiTagSentimentAnalysisUIList[m].id);
									departments.push(item.kpiTagSentimentAnalysisUIList[m].departmentName.toLowerCase());
									kpiNames.push(item.kpiTagSentimentAnalysisUIList[m].kpiName.toLowerCase());
									keywordNames.push(item.kpiTagSentimentAnalysisUIList[m].keywordName.toLowerCase());
									mentions.push(item.kpiTagSentimentAnalysisUIList[m].mention.toLowerCase());
									subKeywordsNames.push(item.kpiTagSentimentAnalysisUIList[m].subKeywords.toLowerCase());
								}
							}
							
							if (searchKey != ""	
								&& (item.reviewContent.toLowerCase().indexOf(searchKey.toLowerCase()) != -1
								|| (item.reviewTitle.toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
								|| (qcIds.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
								|| (sentimentScores.join(',').toLowerCase().indexOf(searchKey.toLowerCase())) != -1 
								|| (departments.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (mentions.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (keywordNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (kpiNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (subKeywordsNames.join(',').indexOf(searchKey.toLowerCase())) != -1 
								|| (item.id.toString().indexOf(searchKey.toString())) != -1)) {
								var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';
								item.reviewContent = item.reviewContent.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
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
										if(item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().indexOf(searchKey.toString().toLowerCase()) != -1){
											item.kpiTagSentimentAnalysisUIList[j].subKeywords = item.kpiTagSentimentAnalysisUIList[j].subKeywords.toLowerCase().split(searchKey.toString().toLowerCase()).join(hightedText);
										}
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
					var successObjectTemp = {'reviewSitesContentUIList' : resultListReviews};
					response = {'successObject' : successObjectTemp};
					var totalReviews = response.successObject.reviewSitesContentUIList;
					
					var divId="reviewSitesContentListDiv";
					pagination(totalReviews,4,divId,response);
					//paginationSearched(totalReviews, 4, hotelReviewsDivId, response);
					/*
					 * unloadingForDashBoard(); /*$('#wrapper').unmask();
					 */
					$('#leftNavigation,#wrapper,#header').unmask();
				}, 300);
	}
