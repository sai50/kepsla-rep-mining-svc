<!DOCTYPE html>

<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<!-- Note there is no responsive meta tag here -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
 <title><spring:message code="label.quality.control" /></title>
<%@include file="includeCssFiles.jsp"%>
<link href="<%= request.getContextPath() %>/resources/bootstrap/grid.css" rel="stylesheet">
<link href="<%= request.getContextPath() %>/resources/css/jquery.tinytooltip.css" rel="stylesheet">

<style type="text/css">

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
</head>
<body>
<div id="wrapper">
<%@include file="qcManagementDashboard.jsp" %>
<div id="page-wrapper" >
	
	<div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header-small">
						<form role="form">
							<label class="inline">
							  Quality Check for: 
							</label>
							<div id="radioOrgsDiv" class="inline">
							</div>
						</form>
					</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
	
	<div id="filterBar">
		<div class="row">
		    <div id="selectedFiltersDiv" class="col-lg-12 SubHeading">
				<!-- <span class="ReviewFilterOutput">All<button class="btn">×</button></span> -->
				<a type="button" onclick="loadFilterUI()" class="filterButton" data-toggle="modal" data-target=".FilterLightBox"><span class="glyphicon glyphicon-filter"></span>Filter</a>
		   		<hr><input type="button" class="btn btn-info btn-xs" onclick=exportLogs() value="Export Logs">	
		    </div>
	    </div>
	</div>
	
			<div class="row qcSupHeader">
				<div class="col-xs-12 form-inline">
					 <div class="form-group float-left">
						 <div class="checkbox">
							<label>
							  <input id="selectAllChk" onclick="selectAll()" type="checkbox"> Select All
							</label>
						  </div>
						  <button type="button" onclick="approveAll()" class="btn btn-sm">Approve Selected</button>
					</div>	
						<select class="form-control float-right" name="sortSelectOption" id="sortSelectOption" onchange="sortReview()" >
								Sort by: 
								<!-- <option selected disabled>--------Select--------</option> -->
								<option value="Default"> Default </option>
								<option value="Date Ascending"> Date Ascending </option>
								<option value="Date Descending"> Date Descending </option>
						</select>
						<div class="form-group float-right">
							<div class="input-group SearchIcon">
							  <label class="sr-only" for="SearchItem">Review Search</label>
							  <div class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></div>
							  <input class="form-control" id="searchInput" onkeyup="clientSearchReview()"  placeholder="Review Search" type="search">
							</div>
					  </div>
				</div>
			</div>
	
	<div class="row">
				<!-- <form id="reviewsListForm" class="form-inline col-xs-12 AdminMainActivity"> -->
				<!-- <form id="reviewsListForm" > -->
            	
				<div id="reviewSitesContentListDiv">
				</div>
				
					</div>
				
				<div id="page-selection"></div>
				
					<div class="col-xs-12 form-inline">
						 <div class="form-group float-left">
							 <div class="checkbox">
								<label>
								  <input id="selectAllChk" onclick="selectAll()" type="checkbox"> Select All
								</label>
							  </div>
							  <button type="button" onclick="approveAll()" class="btn btn-sm">Approve Selected</button>
						</div>	
					</div>
					
				<!-- </form> -->
		<a href="#" id="back-to-top" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	
	</div>
	</div>
			
	
	           <!--    <div class="modal fade FilterLightBox" id="filterModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
					  <div class="modal-dialog modal-lg">
					    <div class="modal-content">
					      <div class="modal-header">
					         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span></button>
					         <h4 id="myLargeModalLabel" class="modal-title">Filter Reviews</h4>
					      </div>
							<div id="filterChkBoxes" class="modal-body row">
								<div class="col-sm-4 FirstRowFilterOptions">
									<div class="row">Review Type
										<h4 class="col-xs-12">Review Type</h4>
										<div id="reviewTypeChkDiv" >
											<label class="col-xs-12">
											<input type="checkbox" id="allChk" name="allChk" value="All">
												All
											</label>
											<label class="col-xs-12">
												<input type="checkbox" id="newChk" name="newChk" value="NEW">
												New
											</label>
											<label class="col-xs-12">
												<input type="checkbox" id="approvedChk" name="approvedChk" value="APPROVED">
												Approved
											</label>
											<label class="col-xs-12">
												<input type="checkbox" id="pendingChk" name="pendingChk" value="PENDING">
												Pending
											</label>
										</div>
									</div>END Review Type
									<div id="sourcesDiv" class="row">Review Source
										<h4 class="col-xs-12">Review Source</h4>
											<div id="" class="col-xs-8">
												<select id="sourceFilterOption" class="form-control input-sm">
													  <option>All</option>
													  <option>Expedia</option>
													  <option>Makemytrip</option>
													  <option>Yatra</option>
												</select>
											</div>
									</div>END Review Source
									
								</div>
								<div class="col-sm-4 OtherFilterOptions">
									<div class="row">Review Language
										<h4 class="col-xs-12">Other Filter Options</h4>
										<label class="col-xs-12 OtherFilterFilterOptionGroup">
											Flag
										</label>
										<div id="flagsDiv" class="col-xs-12">
											<label class="col-xs-12">
												<input type="checkbox"  id="allFlagChk" name="allFlagChk" value="All Flagged Reviews">
												All Flagged Reviews
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="duplicateFlagChk" name="duplicateFlagChk" value="Duplicate Review">
												Duplicated review 
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="languageFlagChk" id="languageFlagChk" value="Language not correct">
												Language not correct
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="deletedFlagChk" name="deletedFlagChk" value="Review deleted from source">
												Review deleted from source 
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="otherFlagChk" name="otherFlagChk" value="Other">
												Others 
											</label>
										</div>
									</div>END Review Language
									
									<div id="" class="row">Review Source
										<h4 class="col-xs-12">Select Date</h4>
											<div id="filterDateDiv" class="col-xs-8">
												<label class="col-xs-12 OtherFilterFilterOptionGroup">
													From
												</label>
												<input class="form-control input-sm" id="filterFromDate"></input>
												<label class="col-xs-12 OtherFilterFilterOptionGroup">
													To
												</label>
												<input class="form-control input-sm" id="filterToDate"></input>
											</div>
									</div>END Review Source
									
								</div>
								<div class="col-sm-4 SaveFilterOptions">
									<div>
										<button id="" onclick="filter()" data-dismiss="modal" class="btn btn-primary col-xs-12 BtnDone" type="submit">Done</button>
									</div>
								</div>
					        </div>
					    </div>
					  </div>
				</div> -->
				
				
									<!------------------------------------------------------------------------------>	
					<!-------------------------- Filter LightBox ----------------------------------->
					<!------------------------------------------------------------------------------>	
					 <div id="filterModal" class="modal fade FilterLightBox" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
					  <div class="modal-dialog modal-sm">
					    <div class="modal-content">
					      <div class="modal-header">
					         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">&#215;</span></button>
					         <h4 id="myLargeModalLabel" class="modal-title">Filter Reviews</h4>
					      </div>
							<div id="filterChkBoxes" class="modal-body row">
								<div class="col-sm-12 FirstRowFilterOptions">
									<div class="row"><!--Review Type-->
										<h4 class="col-xs-12">Review Type</h4>
										<div id="reviewTypeChkDiv" >
											<!-- <label class="col-xs-12">
											<input type="checkbox" id="allChk" name="allChk" value="All">
												All
											</label> -->
											<label class="col-xs-12">
												<input type="checkbox" id="newChk" name="newChk" value="NEW">
												New
											</label>
											<label class="col-xs-12">
												<input type="checkbox" id="approvedChk" name="approvedChk" value="APPROVED">
												Approved
											</label>
											<label class="col-xs-12">
												<input type="checkbox" id="pendingChk" name="pendingChk" value="PENDING">
												Pending
											</label>
										</div>
									</div><!--END Review Type-->
									<div id="sourcesDiv" class="row"><!--Review Source-->
										<h4 class="col-xs-12">Sources</h4>
										<div class="col-xs-8">
												<select id="sourceFilterOption" class="form-control input-sm">
													  <option>All</option>
													  <option>Expedia</option>
													  <option>Makemytrip</option>
													  <option>Yatra</option>
												</select>
										</div>
									</div><!--END Review Source-->
									<div class="row"><!--Review Flags-->
										<h4 class="col-xs-12">Flagged Reviews</h4>
										<div id="flagsDiv" class="col-xs-12">
											<label class="col-xs-12">
												<input type="checkbox"  id="allFlagChk" name="allFlagChk" value="All Flagged Reviews">
												All Flagged Reviews
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="duplicateFlagChk" name="duplicateFlagChk" value="Duplicate Review">
												Duplicated review 
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="languageFlagChk" id="languageFlagChk" value="Language not correct">
												Language not correct
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="deletedFlagChk" name="deletedFlagChk" value="Review deleted from source">
												Review deleted from source 
											</label>
											<label class="col-xs-12">
												<input type="checkbox"  id="otherFlagChk" name="otherFlagChk" value="Other">
												Others 
											</label>
										</div>
									</div><!--END Review Flags-->
									<div class="row">
									<h4 class="col-xs-12"></h4>
										<div class="col-xs-12">
											<button id="" onclick="filter()" data-dismiss="modal" class="btn btn-primary col-xs-12 BtnDone" type="submit">Done</button>
											<!-- <button id="" class="btn btn-primary col-xs-12 BtnDone" onclick="filter()" type="submit">Done</button> -->
										</div>
									</div>
								</div>
					        </div>
					    </div>
					  </div>
					</div>
					<!------------------------------------------------------------------------------>	
					<!-----------------------END Of Filter LightBox -------------------------------->
					<!------------------------------------------------------------------------------>
				
				<!-- --------------------Phrase Flag Modal--------------------------------------------------------------- -->
		<div id="flagPhraseModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title">Flag Phrase</h4>
		            </div>
		            <div class="modal-body" id="flagPhraseModalBody">
		            </div>
		            <div class="modal-footer" id="flagPhraseModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	  <!-- --------------------View All Phrases Modal--------------------------------------------------------------- -->
		<div id="listAllPhrasesModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title">All Phrases</h4>
		            </div>
		            <div class="modal-body" id="listAllPhrasesModalBody">
		            </div>
		            <div class="modal-footer" id="listAllPhrasesModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	  <!-- --------------------Add New Phrase Modal--------------------------------------------------------------- -->
		<div id="addNewPhraseModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="addNewPhraseHedaer">Add Phrase </h4>
		            </div>
		            <div class="modal-body" id="addNewPhraseModalBody">
		            </div>
		            <div class="modal-footer" id="addNewPhraseModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	  <!-- --------------------Add New polarity Modal--------------------------------------------------------------- -->
		<div id="addNewPolarityModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="addNewPolarityHedaer">Add Polarity </h4>
		            </div>
		            <div class="modal-body" align="center" id="addNewPolarityModalBody">
		            </div>
		            <div class="modal-footer" id="addNewPolarityModalFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div>
	  </div>
	   <!-- --------------------Reject Phrase Modal--------------------------------------------------------------- -->
		<div id="rejectPhraseModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="rejectPhraseHedaer">Reject Phrase </h4>
		            </div>
		            <div class="modal-body" align="center" id="rejectPhraseModalBody">
		            </div>
		            <div class="modal-footer" id="rejectPhraseModalFooter">
		            </div>
		        </div>
		    </div>
	  </div>
	  <!-- --------------------Add Phrase Comment--------------------------------------------------------------- -->
		<div id="addNewPhraseCommentModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title">Create Phrase</h4>
		            </div>
		            <div class="modal-body" id="addNewPhraseCommentModalBody">
		            </div>
		            <div class="modal-footer" id="addNewPhraseCommentModalFooter">

		            </div>
		        </div>
		    </div>
	  </div>
<%@include file="qualityControlUtility.jsp" %>

<script>

function scrollDown(divId){
	$('html, body').animate({
        scrollTop: divId.offset().top
    },1000);
}

function scrollTop(){
	$(window).scrollTop(0);
}

/* <!-- To display Flag item-->	 */
$('.btn-flag').click(function(){
	$('.active').removeClass('active');
	$('.OnSeleceActive').removeClass('OnSeleceActive');
	$(this).next('.flagOptions').addClass('OnSeleceActive');
});
$('.CancelReviewFlag').click(function(){
	$(this).parents('.flagOptions').removeClass('OnSeleceActive');
});
$('.SaveReviewFlag').click(function(){
	$(this).parents('.flagOptions').removeClass('OnSeleceActive');
});
/* <!-- END FLAG To display Flag item-->

<!-- To display TradeReviewKpiDepartmentFactor item-->	 */
$('.ShowSemanticPolarity').click(function(){
	$('.active').removeClass('active');
	$('.OnSeleceActive').removeClass('OnSeleceActive');
	$(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');
});
/* <!-- END FLAG To display TradeReviewKpiDepartmentFactor item-->

<!-- Hide items for all actions--> */
$('.userPrimeAction').click(function(){
	$('.active').removeClass('active');
	$('.OnSeleceActive').removeClass('OnSeleceActive');
});


	
	
/* <!-- Sidebar Colaps  --> */
var flaggleftnav=1;
$('.toggleSideBar').click(function(){
	if(flaggleftnav==1){
	$('.sidebar').css('background','none');
	$("#page-wrapper").animate({'marginLeft': '0px'}, 300);
	$('.sidebar-nav').hide("slide", { direction: "left" }, 300);
	$('.toggleSideBar').animate({'float': 'left'}, 300);
	$('.toggleSideBar').html( "&#187;" );
	  flaggleftnav=0;
	  }else{
			$("#page-wrapper").animate({'marginLeft': '250px'}, 300);
			$('.sidebar-nav').show("slide", { direction: "left" }, 300);
			$('.sidebar').css({'background':'#f8f8f8'}, 300);
			$('.toggleSideBar').css('float','right');
			$('.toggleSideBar').html( "&#171;" );
			flaggleftnav=1;
	  }
});
</script>
</body>
  <%@include file="includeJsFiles.jsp" %>
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery-1.11.0.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/bootstrap.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/jquery.dataTables.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/dataTables.bootstrap.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.dataTables.min.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/ie-emulation-modes-warning.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/ie10-viewport-bug-workaround.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/docs.min.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/moment.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery-ui/jquery-ui.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/html2canvas.min.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/js/datePickerCommon.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/plugins/metisMenu/metisMenu.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/main.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/hashtable.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.tinytooltip.min.js"></script>
	<script src="../resources/js/qcManagement.js"></script>
</html>