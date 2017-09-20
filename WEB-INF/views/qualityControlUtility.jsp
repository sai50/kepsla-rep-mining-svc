<style type="text/css">
    ula{
        padding: 0;
        list-style: none;
    }
    ula lia{
        float: left;
        width: 100px;
        text-align: center;
        line-height: 21px;
    }
    ula lia a{
        display: block;
        padding: 0px 10px;
        color: #333;
        background: #f2f2f2;
        text-decoration: none;
    }
    ula lia a:hover{
        color: #fff;
        background: #939393;
    }
    ula lia ula{
        display: none;
    }
    ula lia:hover ula{
        display: block; /* display the dropdown */
    }
    
.disabledbutton {
    pointer-events: none;
    opacity: 0.4;
}

#back-to-top {
    position: fixed;
    bottom: 40px;
    right: 40px;
    z-index: 9999;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 30px;
    background: #f5f5f5;
    color: #444;
    cursor: pointer;
    border: 0;
    border-radius: 2px;
    text-decoration: none;
    transition: opacity 0.2s ease-out;
    opacity: 0;
}
#back-to-top:hover {
    background: #e9ebec;
}
#back-to-top.show {
    opacity: 1;
}
</style>

	<!-- --------------------Flag Modal--------------------------------------------------------------- -->
		<div id="flagModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="flagModalHeader"></h4>
		            </div>
		            <div class="modal-body" id="flagModalBody">
		            </div>
		            <div class="modal-footer" id="flagModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	  <!-- --------------------Review Flag Modal--------------------------------------------------------------- -->
	  <div id="reviewFlagModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title">Review Flag</h4>
		            </div>
		            <br>
		            <div class="alert alert-danger alert-error" style="display:none" id="reviewFlagCommentErrorDiv">
						&nbsp;<img alt="../" src="../resources/images/error.jpg"> Please Select Reason
					</div>
		            <div class="modal-body" id="reviewFlagModalBody" style="height: 150px;">
		            </div>
		            <div class="modal-footer" id="reviewFlagModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	   <!-- --------------------Restoring QC Flag Modal--------------------------------------------------------------- -->
				<div class="modal fade"  tabindex="-1" role="dialog" id="restoreQcModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="restoreQcModalTitle">Success</h4>
							</div>
							
							<div id="restoreQcModalBody"   align="center" class="modal-body">
							 	<!-- <p id="changeReferenceModalText" class="warning">Review broadcasted successfully !</p>
							 	<div class="row mt10">
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Save</button>
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Cancel</button>
								</div>
								 -->
							</div>
						</div>
					</div>
				</div>
				
					<!--Success Message Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="successModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="successModalTitle">Success</h4>
							</div>
							
							<div id="body2"   align="center" class="modal-body">
							 	<p id="successModalText" class="warning">Review broadcasted successfully !</p>
							 	<div class="row mt10">
								 	
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
								</div>
							</div>
							
							
						</div>
					</div>
				</div>
				<!-- End of Success Message Modal --> 
				
				<!--Change Reference Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="changeReferenceModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="changeReferenceModalTitle">Success</h4>
							</div>
							
							<div id="changeReferenceModalBody"   align="center" class="modal-body">
							 	<!-- <p id="changeReferenceModalText" class="warning">Review broadcasted successfully !</p>
							 	<div class="row mt10">
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Save</button>
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Cancel</button>
								</div>
								 -->
							</div>
							
							
						</div>
					</div>
				</div>
				<!-- End of Change Reference Modal --> 
				
				<!--add qc Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="addQcModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="addQcModalTitle">Success</h4>
							</div>
							
							<div id="addQcModalBody"   align="center" class="modal-body">
							 	<!-- <p id="changeReferenceModalText" class="warning">Review broadcasted successfully !</p>
							 	<div class="row mt10">
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Save</button>
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Cancel</button>
								</div>
								 -->
							</div>
						</div>
					</div>
				</div>
				<!-- End of add qc Modal --> 
				<!-- End of restore qc Modal -->
				
	<!-- --------------------Add Qc Keyword--------------------------------------------------------------- -->
		<div id="addQcKeywordModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="addQcKeywordHeader"></h4>
		            </div>
		            <div class="modal-body" id="addQcKeywordModalBody">
		            </div>
		            <div class="modal-footer" id="addQcKeywordModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	   
 <!-- --------------------Delete Qc Comment--------------------------------------------------------------- -->
		<div id="deleteQcCommentModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="deleteQcCommentModalTitle"></h4>
		            </div>
		            <div class="modal-body" id="deleteQcCommentModalBody">
		            </div>
		            <div class="modal-footer" id="deleteQcCommentModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	  
	  <!-- --------------------Restore Review Reason--------------------------------------------------------------- -->
		<div id="restoreReviewReasonModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title">Enter Reason</h4>
		            </div>
		            <div class="modal-body" id="restoreReviewReasonModalBody">
		            </div>
		            <div class="modal-footer" id="restoreReviewReasonModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	   <!-- --------------------Delete  Keyword Reason--------------------------------------------------------------- -->
		<div id="removeKeywordReasonModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 id="modalTitle" class="modal-title">Enter Reason</h4>
		            </div>
		            <div class="modal-body" id="removeKeywordReasonModalBody">
		            </div>
		            <div class="modal-footer" id="removeKeywordReasonModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	  
	  
	<!--   shravan -->
	
	<!-- --------------------Delete Qc Comment--------------------------------------------------------------- -->
		<div id="deleteQcReviewModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="deleteQcReviewModalTitle"></h4>
		            </div>
		            <div class="modal-body" id="deleteQcReviewModalBody">
		            </div>
		            <div class="modal-footer" id="deleteQcReviewModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>