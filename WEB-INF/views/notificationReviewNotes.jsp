<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">

<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Repufact Cuatomer Dashboard">
<meta name="author" content="Bishav.n.r">
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
 <title><spring:message code="label.notification.review.notes" /></title>

<title>Quick Notes</title>

<!-- Bootstrap Core CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.css"
	rel="stylesheet">

<!-- MetisMenu CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.css"
	rel="stylesheet">


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
	
	<!-- Date Time Picker CSS -->
	<link href="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.css" rel="stylesheet">
	<link href="<%= request.getContextPath() %>/resources/css/jquery.multiselect.css" rel="stylesheet">
	
	<link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">

</head>

<body>

 <div id="wrapper">
		<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
		        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
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
							<select class="dropdown SelectOrganization" name="organizationName" id="organizationName">
							</select>
						</li>
						<!-- /.dropdown -->
						<li class="dropdown ">
							<div class="dropdown-toggle SelectDate">
								<div class="DateIcon"></div>
								<div class="FromDate">From</div>
								<span class="DatePickerInputs">
									<input type="text" id="from" name="from">
									<input type="hidden" id="altFromDate">
							    <span class="ToDate">To</span>
							     	<input type="text" id="to" name="to">
							     	<input type="hidden" id="altToDate">
								</span>
							</div>
						</li>
						<!-- /.dropdown -->
						<li>
							<button type="submit" class="btn btn-primary TopSetButton" id="applyFilterBtn">Apply</button>
							<!-- <button type="submit" class="btn btn-default TopSetButton" id="clearBtn">Cancel</button> -->
						</li>
					</ul>
		            <!-- /.navbar-top-links -->
		<!-------------END of ORGANIZATION SELECTION & DATE PICKET----------------------------->
				<%@include file="leftNavigation.jsp"%>
		        </nav>
		 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
 
 
	<div id="page-wrapper">
		<div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">Quick Notes</h1>
            </div>
            <!-- /.col-lg-12 -->
        </div>
        <div class="row" id="notificationReviewNotesBredcrumb">
                <div class="col-lg-12 SubHeading SmallDarkGreyHeader">
					<span> <a href="../notifications/showNotifications.htm">Notifications</a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span>Quick Notes</span>
                </div>
                <!-- /.col-lg-12 -->
            </div>
        <!-------------------------- Review Actions----------------------------------->
        <div class="row" id="notificationReviewNotes" style="display: none;">
        	<div class="row col-xs-12 SingleReviewList">
				<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">
					<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">20%</span> </div>
					<div class="reviewDetails row">
						<div class="reviewSource">Yatra</div>
						<div class="reviewerName">by <span>Bishav Narshing Rajbhandari</span></div>
						<div class="reviewerDetail">from <span>Bangalore, India</span></div>
						<div class="revieweTime"><span class="glyphicon glyphicon-time">
							</span> 12 September 2014</span>
						</div>
					</div>
				</div>
			</div>
        </div>
       <!--  pagination -->
       <div id="reviewNotesPaginationDiv"></div>  
	</div>
	
	 			<!--Success Message Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="notificationNotesSuccessModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="notificationNotesSuccessModalTitle">Success</h4>
							</div>
							
							<div id="body2"   align="center" class="modal-body">
							 	<p id="notificationNotesSuccessModalText" class="warning">Review broadcasted successfully !</p>
							 	<div class="row mt10">
								 	
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
								</div>
							</div>
							
							
						</div>
					</div>
				</div>
				<!-- End of Success Message Modal -->  
				
				
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
	<!-- jQuery Version 1.11.0 -->
	<script
		src="<%=request.getContextPath()%>/resources/jquery/jquery-1.11.0.js"></script>

	<!-- Bootstrap Core JavaScript -->
	<script
		src="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.min.js"></script>

	<!-- Metis Menu Plugin JavaScript -->
	<script
		src="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.js"></script>

	<!-- Custom Theme JavaScript -->
	<script src="<%=request.getContextPath()%>/resources/bootstrap/main.js"></script>

	<!-- Bootstrap jqueryUI JavaScript For Date Picker-->
	<script
		src="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.js"></script>

	<!-- Charts-->
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/highcharts.js"></script>
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/exporting.js"></script>

	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.js"></script>
	 <script src="<%=request.getContextPath()%>/resources/jquery/jquery.multiselect.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>
			
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/util.js"></script>
	
	<!-- Script For Social Mentions -->
	<script src="<%=request.getContextPath()%>/resources/js/notificationReviewNotes.js"></script> 
	<script>
	<!-- To display TradeReviewKpiDepartmentFactor item-->	
	/* $('.ShowSemanticPolarity').click(function(){
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
		$(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');
	});
	 */
	$('.userPrimeAction').click(function(){
		$('.active').removeClass('active');
		$('.OnSeleceActive').removeClass('OnSeleceActive');
	});
		
		$('.SelectKPI').click(function(){
			$('.OnSeleceActive').removeClass('OnSeleceActive');
			$('.keywordbox').addClass('OnSeleceActive');
		});
</script>
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
}
</script>
</body>

</html>
