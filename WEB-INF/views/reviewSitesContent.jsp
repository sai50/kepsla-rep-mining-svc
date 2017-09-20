<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">

<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWQVXW');</script>
<!-- End Google Tag Manager -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Repufact Cuatomer Dashboard">
    <meta name="author" content="Bishav.n.r">
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title>Trade Reviews</title>
	
   <!-- Bootstrap Core CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.css" rel="stylesheet">

<!-- MetisMenu CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.css" rel="stylesheet">


<!-- Main CSS -->
<link href="<%=request.getContextPath()%>/resources/css/main.css"
	rel="stylesheet">

<!-- Morris Charts CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/plugins/morris/morris.css"
	rel="stylesheet">

<!-- Custom Fonts -->
<link
	href="<%=request.getContextPath()%>/resources/fonts/font-awesome-4.1.0/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">

<!-- Date Picker CSS -->
<link
	href="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.css"
	rel="stylesheet">
	
	<link
	href="<%=request.getContextPath()%>/resources/jquery-ui/jquery.qtip.css"
	rel="stylesheet">
	
	
	<!-- Date Time Picker CSS -->
	<link href="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.css" rel="stylesheet">
	<link href="<%= request.getContextPath() %>/resources/css/jquery.multiselect.css" rel="stylesheet">
	<link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">
	
	
	
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    
<style>
.highlight {
    color: red;
    background: yellow;
}
</style>
</head>

<body >
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5W4FN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
    <div id="wrapper">
			
			<!-- <input type="button" onclick="highlightKeywords()" value="Execute Highlight Service Test"><input type="text" id="reviewIdInput"> -->
<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" id="hSend for broadcasteader" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <c:choose>
				  <c:when test="${logoImageUrl == ''}">
				  </c:when>
				  <c:otherwise>
				   <a style="padding:5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
            </div>
            <!-- /.navbar-header -->

<!-------------ORGANIZATION SELECTION & DATE PICKET----------------------------->
            <ul class="nav navbar-top-links navbar-right">
                <li><div class="OrganizationIcon"></div>
               		<div class="SelectOrganizationTitle">Organization</div> 
					<select class="dropdown SelectOrganization" id="organizationName" name="organizationName">
					<c:forEach items="${organizations}" var="organization" >
						<option value="${organization.id}">${organization.organizationFullName}</option>
					</c:forEach>
					</select>
				</li>
				
                <!-- /.dropdown -->
				<li class="dropdown ">
					<div class="dropdown-toggle SelectDate">
						<div class="DateIcon"></div>
						<div class="FromDate">From</div>
							<span class="DatePickerInputs">
							<input type="text" id="fromDate" name="fromDate">
							<input type="hidden" id="altFromDate">
						<span class="ToDate">To</span>
							<input type="text" id="toDate" name="toDate">
							<input type="hidden" id="altToDate">
						</span>
					</div>
				</li>
				<!-- /.dropdown -->
				<li>
					<button type="submit" class="btn btn-primary TopSetButton" id="searchDates">Apply</button>
					<!-- <button type="submit" class="btn btn-default TopSetButton" id="clearDates">Cancel</button> -->
				</li>
                
            </ul>
            <!-- /.navbar-top-links -->
<!-------------END of ORGANIZATION SELECTION & DATE PICKET----------------------------->
			<%@include file="leftNavigation.jsp" %>	
        </nav>
 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
 
 
        <div id="page-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Trade Reviews</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<!-- <div class="row">
                <div class="col-lg-12 SubHeading">
					<span class="ReviewFilterOutput">All<button class="btn">x</button></span>
					<a data-target="#filterModal" data-toggle="modal" onclick="loadFilterUI()" class="filterOption"><span class="glyphicon glyphicon-filter"></span>Filter</a>
					<span>You can view your reviews based on the above date range and selected organization.</span>
                </div>
                /.col-lg-12
            </div> -->
            <div id="filterBar">
	            <div class="row">
	                <div id="selectedFiltersDiv" class="col-lg-12 SubHeading">
							<!-- <span class="ReviewFilterOutput">All<button class="btn">×</button></span> -->
					
						<a type="button" onclick="loadFilterUI()" class="filterButton" data-toggle="modal" data-target=".FilterLightBox"><span class="glyphicon glyphicon-filter"></span>Filter</a>
	                	<select name="sortSelectOption" id="sortSelectOption" onchange="filter(1)" class="filterButton">
								<option selected disabled>Sort By</option>
								<option value="Date Ascending"> Date Ascending </option>
								<option value="Date Descending"> Date Descending </option>
								<option value="Repufactor Ascending"> Review Score Ascending </option>
								<option value="Repufactor Descending"> Review Score Descending</option>
						</select>
						<a type="button" onclick="markAll()" class="filterButton" ><span class=""></span>Mark</a>
						<select name="markReadSelectOption" id="markReadSelectOption" onchange="" class="filterButton">
								<option value="read">Read All</option>
								<option value="unread">Unread All</option>
						</select>
						
	                </div>
	                <!-- /.col-lg-12 -->
	            </div>
            </div>
            <!-------------------------- /.row TOP Pannel ----------------------------------->
            
            
             <div class="modal fade FilterLightBox" id="filterModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span></button>
         <h4 id="myLargeModalLabel" class="modal-title">Filter Reviews</h4>
      </div>
		<div id="filterChkBoxes" class="modal-body row">
			<div class="col-sm-4 FirstRowFilterOptions">
				<div class="row"><!--Review Rating-->
					<h4 class="col-xs-12">Review Rating</h4>
					<div id="polarityChkDiv">
						<label class="col-xs-12">
							<input type="checkbox" id="positiveChk" name="positiveChk" value="Positive">
							Positive <span id="positive_reviews_countSpan"></span>
						</label>
						<label class="col-xs-12">
							<input type="checkbox" id="neutralChk" name="neutralChk" value="Neutral">
							Neutral <span id="neutral_reviews_countSpan"></span>
						</label>
						<label class="col-xs-12">
							<input type="checkbox" id="negativeChk" name="NegativeChk" value="Negative">
							Negative <span id="negative_reviews_countSpan"></span>
						</label>
					</div>
					
				</div><!--END Review Rating-->
				<div class="row"><!--Review Type-->
					<h4 class="col-xs-12">Review Type</h4>
					<div id="reviewTypeChkDiv" >
						<label class="col-xs-12">
						<input type="checkbox" id="textChk" name="textChk" value="Text">
							Text
						</label>
						<label class="col-xs-12">
							<input type="checkbox" id="audioChk" name="audioChk" value="Audio">
							Audio
						</label>
						<label class="col-xs-12">
							<input type="checkbox" id="videoChk" name="videoChk" value="Video">
							Video
						</label>
						<label class="col-xs-12">
							<input type="checkbox" id="pictorialChk" name="pictorialChk" value="Pictorial">
							Pictorial
						</label>
					</div>
				</div><!--END Review Type-->
				<div class="row"><!--Review Language-->
					<h4 class="col-xs-12">Language</h4>
					<div id="languageDiv" class="col-xs-8">
					<select class="form-control input-sm">
					  <option>All</option>
					  <option>English</option>
					  <option>French</option>
					  <option>Italian</option>
					</select>
					</div>
				</div><!--END Review Language-->
				<div id="sourcesDiv" class="row"><!--Review Source-->
					<h4 class="col-xs-12">Review Source</h4>
					<label class="col-xs-12">
						<input type="checkbox">
						View All
					</label>
					<label class="col-xs-12">
						<input type="checkbox">
						Repufact
					</label>
					<label class="col-xs-12">
						<input type="checkbox">
						Expedia
					</label>
					<label class="col-xs-12">
						<input type="checkbox">
						Makemytrip
					</label>
				</div><!--END Review Source-->
			</div>
			<div class="col-sm-4 OtherFilterOptions">
				<div class="row"><!--Review Language-->
					<h4 class="col-xs-12">Other Filter Options</h4>
					<!-- <div id="sharedChkDiv">
						<label class="col-xs-12 OtherFilterFilterOptionGroup">
							<input type="checkbox"  id="sharedChk" name="sharedChk" value="Shared">
							Shared
						</label>
					</div> -->
					<div id="noteChkDiv">
						<label class="col-xs-12 OtherFilterFilterOptionGroup">
							<input type="checkbox"  id="noteChk" name="noteChk" value="Quick Notes">
							Quick Note
						</label>
					</div>
					<label class="col-xs-12 OtherFilterFilterOptionGroup">
						Actions
					</label>
					<div id="actionChkDiv" class="col-xs-12">
						<label class="col-xs-12">
							<input type="checkbox" id="ticketChk" name="ticketChk" value="Raise a Ticket">
							Raise a ticket
						</label>
						<!-- <label class="col-xs-12">
							<input type="checkbox"  id="taskChk" name="taskChk" value="Assign a Task">
							Assign a task
						</label>
						<label class="col-xs-12">
							<input type="checkbox"  id="notifyChk" name="notifyChk" value="Notify">
							Notify
						</label>
						<label class="col-xs-12">
							<input type="checkbox"  id="generalChk" name="generalChk" value="General">
							General
						</label> -->
					</div>
					<!--<div id="broadcastChkDiv">
						 <label class="col-xs-12 OtherFilterFilterOptionGroup">
							<input type="checkbox" id="broadcastChk" name="broadcastChk" value="Broadcasted">
							Broadcast
						</label> 
					</div>-->
					<label class="col-xs-12 OtherFilterFilterOptionGroup">
						Flag
					</label>
					<div id="flagsDiv" class="col-xs-12">
						<!-- <label class="col-xs-12">
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
						</label> -->
					</div>
					
					<label class="col-xs-12 OtherFilterFilterOptionGroup">
						Replied To Review
					</label>
					<div id="respondChkDiv" class="col-xs-12">
					</div>
					<label class="col-xs-12 OtherFilterFilterOptionGroup">
						Mark Read Review
					</label>
					<div id="markReadChkDiv" class="col-xs-12" id="">
						<label class="col-xs-12">
							<input type="checkbox" value="read" name="readChk" id="readChk" data-name="read" onclick="markRead(this)">
								<span id="">Read</span>
						</label>
						<label class="col-xs-12">
							<input type="checkbox" value="unread" name="unreadChk" id="unreadChk" data-name="unread" onclick="markRead(this)">
								<span id="">Unread</span>
						</label>
					</div>
				</div><!--END Review Language-->
			</div>
			<div class="col-sm-4 SaveFilterOptions">
				<div>
					<button id="applyFilterForReviews" onclick="filter(pageNo)" data-dismiss="modal" class="btn btn-primary col-xs-12 BtnDone" type="submit">Apply</button>
				</div>
				<div>
					<button id="resetFilterForReviews" onclick="clearFliter()"  class="btn btn-primary col-xs-12 BtnDone" type="button">Reset</button>
				</div>
				<div class="row"><!--Save Filter-->
					<h4 class="col-xs-12">Filter Setting</h4>
					 <div class="col-xs-12">
						<div class="input-group">
						  <input type="text" id="filterName" class="form-control input-sm" placeholder="Save filter as">
						  <span class="input-group-btn">
							<button onclick="saveFilter()" class="btn btn-default btn-sm btn-green" type="button">Save</button>
						  </span>
						</div><!-- /input-group -->
					 </div>
					 <div id="savedFiltersDiv">
						<!--  <div class="col-xs-12 SavedFilter">
							<button class="btn btn-default btn-xs btn-green">×</button>
								<a>Saved filter name</a>
						 </div> -->
					 </div>
					
				</div><!--END Save Filter-->
				<div class="row"><!--Save Search-->
					<h4 class="col-xs-12">Search Setting</h4>
					 <div class="col-xs-12">
						<button onclick="saveSearch()" class="btn col-xs-12 btn-sm btn-green" type="button">Save Search Result</button>
					 </div>
					 <div id="saveSearchErrorDiv"></div>
					  <div id="savedSearchesDiv">
						 <div class="col-xs-12 SavedFilter">
							<button class="btn btn-default btn-xs btn-green">×</button>
								<a>Saved Search name 1</a>
						 </div>
						 <div class="col-xs-12 SavedFilter">
							<button class="btn btn-default btn-xs btn-green">×</button>
								<a>Saved Search name 2</a>
						 </div>
					 </div>
				</div><!--END Save Search-->
			</div>
        </div>
    </div>
  </div>
</div>
            <!-- <div class="modal fade" id="filterModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		  		<div class="modal-dialog modalSmallWidth">
		  			<div class="modal-content moduleSmall-content">
		  				<div class="modal-header">
		  					<button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button>
		  					<h1 class="modal-title" id="myModalLabel">Filter Reviews</h1>
		  				</div>
			  			<div id="filterChkBoxes" class="modal-body">
			  				<div>
					  			<div>
					  				<label>Review Rating</label><br>
									<input type="checkbox" checked id="positiveChk" name="positiveChk" value="Positive">Positive<br>
									<input type="checkbox" checked id="neutralChk" name="neutralChk" value="Neutral">Neutral<br>
									<input type="checkbox" checked id="negativeChk" name="NegativeChk" value="Negative">Negative<br>
					  				
					  			</div>
								<div >
									<label>Review Type</label><br>
									<input type="checkbox" checked id="textChk" name="textChk" value="Text">Text<br>
									<input type="checkbox" checked id="audioChk" name="audioChk" value="Audio">Audio<br>
									<input type="checkbox" checked id="videoChk" name="videoChk" value="Video">Video<br>
									<input type="checkbox" checked id="pictorialChk" name="pictorialChk" value="Pictorial">Pictorial<br>
								</div>
								
								<div id="languageDiv">
								</div>
								
								<div id="sourcesDiv">
								</div>
							<div>
							<div id="othersDiv">
								<label>Other Filter Options</label><br>
								<div id="">
									<input type="checkbox" checked id="sharedChk" name="sharedChk" value="Shared">Shared<br>
								</div>
								
								<div id="">
									<input type="checkbox" checked id="noteChk" name="noteChk" value="Quick Notes">Quick Notes<br>
								</div>
								
								<div id="">
									<input type="checkbox" checked id="broadcastChk" name="broadcastChk" value="Broadcasted">Broadcasted<br>
								</div>
								
								<label>Actions</label><br>
								<div id="">
									<input type="checkbox" checked id="taskChk" name="taskChk" value="Assign a Task">Assign a Task<br>
									<input type="checkbox" checked id="ticketChk" name="ticketChk" value="Raise a Ticket">Raise a Ticket<br>
									<input type="checkbox" checked id="notifyChk" name="notifyChk" value="Notify">Notify<br>
									<input type="checkbox" checked id="generalChk" name="generalChk" value="General">General<br>
								</div>
								
								<label>Flagged</label><br>
								<div id="">
									<input type="checkbox" checked id="duplicateFlagChk" name="duplicateFlagChk" value="Duplicate Review">Duplicate Review<br>
									<input type="checkbox" checked id="deletedFlagChk" name="deletedFlagChk" value="Review deleted from source">Review deleted from source<br>
									<input type="checkbox" checked id="languageFlagChk" id="languageFlagChk" value="Language not correct">Language not correct<br>
									<input type="checkbox" checked id="otherFlagChk" name="otherFlagChk" value="Other">Other<br>
								</div>
							</div>
							
							<div id="">
								<label>Filter Setting</label><br>
								<input type="text" placeholder="Save Filter As" id="filterName"><button type="submit" onclick="saveFilter()" class="btn btn-primary TopSetButton" >Save</button>
							</div>
							
							<div id="savedFiltersDiv">
							</div>
							
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
							<button type="button" onclick="filter()" class="btn btn-primary" >Done</button>
						</div>
					</div>
				</div>
			</div>
				</div>
			</div> -->
            
			<!-------------------------- Search ----------------------------------->
			<div id="searchBar" class="row">
				<div class="form-group">
					<div class="input-group SearchIcon">
					  <label class="sr-only" for="SearchItem">Review Search</label>
					  <div class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></div>
					  <!-- <input onkeyup="showHideclearSearch(this)" type="search" class="form-control" id="searchInput" placeholder="Review Search"> -->
					<!--   <input  type="search" class="form-control" id="searchInput" onkeyup="clientSearchReview()" placeholder="Review Search"> -->
					  <input  type="search" class="form-control" id="searchInput"  onKeydown="Javascript: if (event.keyCode==13) filter(1)" placeholder="Review Search">
					  <!-- <div id="clearSearchDiv" style="display:none;position: absolute; z-index: 2; text-align: right; right: 16px; top: 7px;"><a onclick="clearSearch()">Clear Search Results</a></div> -->
					</div>
			  </div>
			</div>
			<!-------------------------- END Search ----------------------------------->
			
			<!-------------------------- Reviews ----------------------------------->
            <div class="row">
				<div class="row col-xs-12 SingleReviewList">
					
					<div class="col-xs-12" id="hotelReviewsDivId">
					</div>
					<div id="page-selection"></div>
				</div>
            </div>
        </div>
            <!-------------------------- END Reviews ----------------------------------->
            
            
          <!--Success Message Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="broadcastSuccessModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="broadcastSuccessModalTitle">Success</h4>
							</div>
							
							<div id="body2"   align="center" class="modal-body">
							 	<p id="broadcastSuccessModalText" class="warning">Review broadcasted successfully !</p>
							 	<div class="row mt10">
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
								</div>
							</div>
							
						</div>
					</div>
				</div>
		<!-- End of Success Message Modal -->  
</div>
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
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.multiselect.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/util.js"></script>
	<script	src="<%=request.getContextPath()%>/resources/jquery/jquery.qtip.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/reviewSitesContent.js"></script>
	
	
	<script>
	
	
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

	$('.ShowSemanticPolarity').click(function(){
		/* $('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
		$(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive'); */
		 var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		 if($("#"+keywordDivId).hasClass("OnSeleceActive")){
			 console.log("removing");
             $("#"+keywordDivId).removeClass("OnSeleceActive");
		 }else{
			 console.log("adding ");
             $("#"+keywordDivId).addClass("OnSeleceActive");
		 }
	});

	$('.userPrimeAction').click(function(){
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
	</script>
	
	<!-- Script Star rting -->	
	<script>
$.fn.stars = function() {
				return $(this).each(function() {
					// Get the value
					var maximumRating = $(this).data("maximumRating");
					var reviewRating = $(this).data("reviewRating");
					//var val = parseFloat($(this).html());
					var val=reviewRating*(5/maximumRating);
					// Make sure that the value is in 0 - 5 range, multiply to get width
					var size = Math.max(0, (Math.min(5, val))) * 16;
					// Create stars holder
					var $span = $('<span />').width(size);
					// Replace the numerical value with stars
					$(this).html($span);
				});
			};
				
var highlighted="";
$(function () {
    $('#sortSelectOption').change(function () {
        if(highlighted!="")
            $('select option:contains(' + highlighted+ ')').removeClass('highlight');
           highlighted=$(this).val();
        $('select option:contains(' + $(this).val() + ')').addClass('highlight');
    })
})
		
		/// test highlight service
function highlightKeywords(){
		 loadingForDashBoard();
		 var reviewId=$('#reviewIdInput').val();
		 if(reviewId==""||reviewId==" "||reviewId==0||reviewId==undefined){
			 reviewId=0;
		 }
		 $.ajax({
				type:"GET",
				url:"../reviewSitesContent/highlightKeywords.htm?reviewId="+reviewId,
				contentType:"application/json",
				
				success:function(response){
					unloadingForDashBoard();
					alert(response.status);
					
				},error:function(response){
					$('#loadMaskDiv').mask(response.status+"*********"+response.statusText);
				}
		});
			 
}
</script>
</body>
</html>