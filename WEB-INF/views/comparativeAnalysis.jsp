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

<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title><spring:message code="label.comparative.analysis" /></title>
 <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Repufact Customer Dashboard">
    <meta name="author" content="Bishav.n.r">
    <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <!-- Bootstrap Core CSS -->
    <link href="<%= request.getContextPath() %>/resources/bootstrap/bootstrap.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="<%= request.getContextPath() %>/resources/bootstrap/plugins/metisMenu/metisMenu.min.css" rel="stylesheet">

    <!-- Main CSS -->
    <link href="<%= request.getContextPath() %>/resources/css/main.css" rel="stylesheet">
	
	<!-- Morris Charts CSS -->
    <link href="<%= request.getContextPath() %>/resources/bootstrap/plugins/morris/morris.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="<%= request.getContextPath() %>/resources/fonts/font-awesome-4.1.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	
	<!-- Date Picker CSS -->
    <link href="<%= request.getContextPath() %>/resources/jquery-ui/jquery-ui.css" rel="stylesheet">
    
    <link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">
    
    <!-- Date Time Picker CSS -->
   <link href="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

    <div id="wrapper">
		<%-- <%@include file="adminDashboard.jsp"%> --%>
		<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0" id="header">
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
				   <a style="padding: 5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
            </div>
            <!-- /.navbar-header -->

<!-------------ORGANIZATION SELECTION & DATE PICKET----------------------------->
            <ul class="nav navbar-top-links navbar-right">
                <li><div class="OrganizationIcon"></div>
					<div class="SelectOrganizationTitle">Organization</div>
                	<select id="selectedOrganizationIdForComparativeAnalysis" name="" class="dropdown SelectOrganization">
                	<c:forEach items="${organizationsForUser}" var="organization">
                		<option value="${organization.id}" <c:if test="${organization.id eq organizationId}">selected="selected"</c:if>>${organization.organizationFullName}</option>
                	</c:forEach>
                	</select>
                </li>
                <!-- /.dropdown -->
				<li class="dropdown ">
					<div class="dropdown-toggle SelectDate">
						<div class="DateIcon"></div>
						<div class="FromDate">From</div>
							<span class="DatePickerInputs">
								<input type="text" id="fromDateForFilter" name="from" value="${fromDateForFilter}">
								<input type="hidden" id="altFromDateComparativeAnalysis" value="${hiddenFromDate}">
								<span class="ToDate">To</span>
								<input type="text" id="toDateForFilter" name="to" value="${toDateForFilter}">
								<input type="hidden" id="altToDateComparativeAnalysis" value="${hiddenToDate}">
							</span>
					</div>
				</li>
                <!-- /.dropdown -->
                <li>
                	<button type="submit" class="btn btn-primary TopSetButton" onclick="filterDataForComparativeAnalysis()" id="filterComparativeAnalysisButton">Apply</button>
                	<button type="submit" class="btn btn-primary TopSetButton" onclick="filterResult()" id="filterResultButton" style="display: none;" disabled="disabled">Apply</button>
                	<button type="submit" class="btn btn-primary TopSetButton" onclick="filterInnerPage()" id="comparativeAnalysisInnerPageButton" style="display: none;" disabled="disabled">Apply</button>
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
                    <h1 class="page-header">Comparative Analysis</h1>
                </div>
            </div>
            <div id="comparitiveAnalysisFirstPageDiv"></div>
			<div id="comparativeAnalysisSecondPageDiv"></div>
			<div id="comparativeAnalysisThirdPageDiv"></div>
			
			<!-- View Detail Review shravan -->
			
			<div class="row" id="reviewsBredcrumb" style="display: none;">
                <div class="col-lg-12 SubHeading SmallDarkGreyHeader">
					<span> <a onclick="restoreComparativeAnalysis()">Comparative Reviews</a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span>Comparative Reviews Detail</span>
                </div>
            </div>
        <!-------------------------- Reviews ----------------------------------->
        <div  id="comparativeAnalysisReviews" style="display: none;">
        	<div class="col-xs-12 SingleReviewList">
					<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">
						<div class="PositiveSentimentReview row"><div class="arrow-left"></div> <span class="score"></span> </div>
						<div class="reviewDetails row">
							<div class="reviewSource"></div>
							<div class="reviewerName"> <span></span></div>
							<div class="reviewerDetail"> <span></span></div>
							<div class="revieweTime"><span class="glyphicon glyphicon-time">
								</span></span>
							</div>
						</div>
					</div>
					<div class="col-xs-12 col-sm-9 col-lg-10">
						<div class="flagFunction" style="float:right;">
							<button class="btn btn-flag float-right" type="button"></button>
							<div class="flagOptions" id='flagToggle'>
								<div class="checkbox">
									<div class="Review-page-arrow-up"></div>
									<div class="SmallNormalLightGreyContent">Reason for flagging:</div>
									<label>
									   <input type="checkbox"> 
									</label>
									<label>
									   <input type="checkbox"> 
									</label>
									<label>
									   <input type="checkbox">
									</label>
									<label>
									   <input type="checkbox"> 
									</label>
									<div class="form-group input-group col-xs-12">
											<button id="SaveReviewFlag" class="btn btn-primary btn-sm SaveReviewFlag" type="button"onclick="toggleflagOptions()"> Save</button>
											<button id="CancelReviewFlag" class="btn btn-default btn-sm CancelReviewFlag" type="button" onclick="toggleflagOptions()"> Cancel</button>
									</div>
								</div>
							</div>
						</div>
						<h3 class="SingleReviewHeader"></h3>
						<p>
						
						</p>
						<div class="SourceRating col-xs-12">
							<span> </span><span class="stars"></span><span></span>
						</div>
						<div class="SourceKPIRating col-xs-12">
							<div class="KPIRating col-xs-4"> <span></span></div>
							<div class="KPIRating col-xs-4"> <span></span></div>
							<div class="KPIRating col-xs-4"> <span></span></div>
							<div class="KPIRating col-xs-4"> <span></span></div>
							<div class="KPIRating col-xs-4"> <span></span></div>
						</div>
						<div class="TradeReviewKpiDepartmentFactor col-xs-12">
							<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12"></div>
							<div class="KPIScore col-xs-4">  <span class="PositiveSentimentCount"></span></div>
							<div class="KPIScore col-xs-4">  <span class="NegativeSentimentCount"></span></div>
							<div class="KPIScore col-xs-4"><span class="PositiveSentimentCount"></span></div>
							<div class="KPIScore col-xs-4"><span class="NeutralSentimentCount"></span></div>
							<div class="KPIScore col-xs-4">- <span class="NegativeSentimentCount"></span></div>
							<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12"></div>
							<div class="KPIScore col-xs-4"> <span class="PositiveSentimentCount"></span></div>
							<div class="KPIScore col-xs-4"> <span class="NegativeSentimentCount"></span></div>
							<div class="KPIScore col-xs-4"> <span class="PositiveSentimentCount"></span></div>
						</div>
						<div class="OnReviewActions col-xs-12">
							<div class="panel-body row">
                            <!-- Nav tabs -->
                            <ul class="nav nav-pills">
                                <li class="">
									<a data-toggle="tab" href="#Share-pills" class="userPrimeAction">
										<span class="glyphicon glyphicon-share"> </span> 
									</a>
                                </li>
                                <li class="">
									<a data-toggle="tab" href="#Note-pills" class="userPrimeAction">
										<span class="glyphicon glyphicon-edit"> </span>  
									</a>
                                </li>
                                <li class="">
									<a data-toggle="tab" href="#Action-pills" class="userPrimeAction">
										<span class="glyphicon glyphicon-hand-up"> </span> 
									</a>
                                </li>
                                <li class="">
									<a data-toggle="tab" href="#Broadcast-pills" class="userPrimeAction">
										<span class="glyphicon glyphicon-bullhorn"> </span> 
									</a>
                                </li>
                            </ul>

                            <!-- Tab panes -->
                            <div class="tab-content">
                                <div id="Share-pills" class="row SubHeading tab-pane fade">
                                    <div class="MediumNormalGreyContent col-xs-2">Share On:</div>
                                    <div class="form-group col-xs-10 row">
                                            <div class="col-xs-4">
                                                <label>
                                                    <input type="checkbox" value=""> 
                                                </label>
                                            </div>
                                            <div class="col-xs-4">
                                                <label>
                                                    <input type="checkbox" value=""> 
                                                </label>
                                            </div>
                                            <div class="col-xs-4">
                                                <label>
                                                    <input type="checkbox" value=""> 
                                                </label>
                                            </div>	
                                     </div>
									 <div class="col-xs-10 col-xs-offset-2 row">
										<div class="form-group input-group col-xs-12 footerButtons">
											<button id="Save" class="btn btn-primary btn-sm" type="button">Save </button>
											<button id="Cancel" class="btn btn-default btn-sm" type="button">Cancel </button>
										</div>
									 </div>
                                </div>
								
                                <div id="Note-pills" class="row SubHeading tab-pane fade">
									<div class="row ActionReports">
											<div class="col-xs-12">
												
											</div>
											<div class="col-xs-12 SmallDarkGreyHeader">
												by <span class="VerySmallBoldGreyContent marginRight20"></span>
												<span> <span class="VerySmallBoldGreyContent"></span></span>
											</div>
											<div class="col-xs-12">
												<div class="revieweTime"><span class="glyphicon glyphicon-time">
												</span>
												</div>
											</div>
										</div>
									<div class="col-xs-12">
										<div class="form-group input-group col-xs-12">
											<label>Enter your note <span class="mandatoryField">*</span></label>
											<textarea class="form-control input-sm" placeholder="Maximum 250 char"></textarea>
										 </div>
										 <div class="row ">
											 <div class="form-group col-xs-6">
												<label class=""></label>
												<div class="">
													<select class="form-control input-sm">
															<option></option>
															<option> </option>
															<option> </option>
															<option> </option>
													</select>
												</div>
											</div>
											<div class="form-group col-xs-6">
												<label class="">Share via email</label>
												<div class="">
													<input class="form-control input-sm" placeholder="Enter Email Address">
												</div>
											</div>
										</div>
										<div class="form-group input-group form-inline col-xs-12">
											<button id="Save" class="btn btn-primary btn-sm float-right" type="button"> Send</button>
											<button id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>
										</div>
									</div>
								</div>
                                <div id="Action-pills" class="SubHeading tab-pane fade">
									<div class="panel-body row">
										<div class="row ActionReports">
											<div class="col-xs-5 SmallBoldGreyContent">
												
											</div>
											<div class="col-xs-7 text-right SmallDarkGreyHeader">
												 <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span> </span>
											</div>
											<div class="col-xs-12">
												
											</div>
											<div class="col-xs-12 SmallDarkGreyHeader">
												 <span class="VerySmallBoldGreyContent marginRight20"></span>
												<span> <span class="VerySmallBoldGreyContent"> </span> <span class="VerySmallBoldGreyContent"></span></span>
											</div>
											<div class="col-xs-12">
												<div class="revieweTime"><span class="glyphicon glyphicon-time">
												</span> 
												</div>
											</div>
										</div>
										<div class="row ActionReports">
											<div class="col-xs-5 SmallBoldGreyContent">
											
											</div>
											<div class="col-xs-7 text-right SmallDarkGreyHeader">
											 <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span> </span>
											</div>
											<div class="col-xs-12">
												
											</div>
											<div class="col-xs-12 SmallDarkGreyHeader">
												by <span class="VerySmallBoldGreyContent marginRight20"></span>
												<span>For <span class="VerySmallBoldGreyContent"> </span>at <span class="VerySmallBoldGreyContent"></span></span>
											</div>
											<div class="col-xs-12">
												<div class="revieweTime"><span class="glyphicon glyphicon-time">
												</span> 
												</div>
											</div>
										</div>
										<ul class="nav nav-pills">
											<li class="">
												<a data-toggle="tab" href="#Assign-a-task-pills" >
													
												</a>
											</li>
											<li class="">
												<a data-toggle="tab" href="#Raise-a-ticket-pills" >
													
												</a>
											</li>
											<li class="">
												<a data-toggle="tab" href="#Notify-pills" >
													
												</a>
											</li>
											<li class="">
												<a data-toggle="tab" href="#General-pills">
												</a>
											</li>
											<li class="">		
												<a type="button" class="filterButton" data-toggle="modal" data-target=".RespondToReviews">Respond to reviews</a>
											</li>
										</ul>

                            <!-- Tab panes -->
										<div class="tab-content">
											<div id="Assign-a-task-pills" class="row Actiontitles tab-pane fade">
												<div class="col-xs-12 form-horizontal">
													<div class="form-group">
														 <label class="col-xs-3 control-label"><span class="mandatoryField">*</span></label>
														 <div class=" col-xs-9">
															<div class="">
																<input class="form-control input-sm" placeholder="Comment here..">
															</div>
														</div>
													</div>
													 <div class="form-group">
															<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>
															<div class="col-xs-4">
																<select class="form-control input-sm">
																		<option></option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
															<div class="col-xs-5">
																<select class="form-control input-sm">
																		<option></option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
													</div>
													<div class="form-group">
															<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>
															<div class="col-xs-9">
																<input class="form-control input-sm" placeholder="Select Date and time">
															</div>
													</div>
													<div class="form-group input-group form-inline col-xs-12">
														<button id="Save" class="btn btn-primary btn-sm float-right" type="button"> Send</button>
														<button id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>
													</div>
												</div>
											</div>											
											<div id="Raise-a-ticket-pills" class="row Actiontitles tab-pane fade">
												<div class="col-xs-12 form-horizontal">
													<div class="form-group">
														 <label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>
														 <div class=" col-xs-9">
															<div class="">
																<input class="form-control input-sm" placeholder="Comment here..">
															</div>
														</div>
													</div>
													 <div class="form-group">
															<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>
															<div class="col-xs-4">
																<select class="form-control input-sm">
																		<option></option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
															<div class="col-xs-5">
																<select class="form-control input-sm">
																		<option>Select</option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
													</div>
													<div class="form-group">
															<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>
															<div class="col-xs-9">
																<input class="form-control input-sm" placeholder="Select Date and time">
															</div>
													</div>
													<div class="form-group input-group form-inline col-xs-12">
														<button id="Save" class="btn btn-primary btn-sm float-right" type="button"> Send</button>
														<button id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>
													</div>
												</div>
											</div>
											<div id="Notify-pills" class="Actiontitles tab-pane fade">
												<div class="col-xs-12 form-horizontal">
													<div class="form-group">
														 <label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>
														 <div class=" col-xs-9">
															<div class="">
																<input class="form-control input-sm" placeholder="Comment here..">
															</div>
														</div>
													</div>
													 <div class="form-group">
															<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>
															<div class="col-xs-4">
																<select class="form-control input-sm">
																		<option>Select a Department</option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
															<div class="col-xs-5">
																<select class="form-control input-sm">
																		<option></option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
													</div>
													<div class="form-group">
															<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>
															<div class="col-xs-9">
																<input class="form-control input-sm" placeholder="Select Date and time">
															</div>
													</div>
													<div class="form-group input-group form-inline col-xs-12">
														<button id="Save" class="btn btn-primary btn-sm float-right" type="button"> Send</button>
														<button id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>
													</div>
												</div>
											</div>
											<div id="General-pills" class="Actiontitles tab-pane fade">
												<div class="col-xs-12 form-horizontal">
													<div class="form-group">
														 <label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>
														 <div class=" col-xs-9">
															<div class="">
																<input class="form-control input-sm" placeholder="Comment here..">
															</div>
														</div>
													</div>
													 <div class="form-group">
															<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>
															<div class="col-xs-4">
																<select class="form-control input-sm">
																		<option></option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
															<div class="col-xs-5">
																<select class="form-control input-sm">
																		<option></option>
																		<option></option>
																		<option></option>
																		<option></option>
																</select>
															</div>
													</div>
													<div class="form-group">
															<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>
															<div class="col-xs-9">
																<input class="form-control input-sm" placeholder="Select Date and time">
															</div>
													</div>
													<div class="form-group input-group form-inline col-xs-12">
														<button id="Save" class="btn btn-primary btn-sm float-right" type="button"> Send</button>
														<button id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>
													</div>
												</div>
											</div>	
										</div>
									</div>
                                 
                                </div>
                                <div id="Broadcast-pills" class="SubHeading tab-pane fade">
									<div class="form-group input-group form-inline col-xs-12">
										<label>
											<input type="checkbox" value="">
											
										</label>
										<button id="Save" class="btn btn-primary btn-sm float-right" type="button"> Send</button>
										<button id="Cancel" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>
									</div>
                                </div>
								
                            </div>
                        </div>
						</div>
					</div>
				</div>
         </div>
       <div id="page-selection"></div>
  	 </div><!-- End Of Page-Wrapper -->
  </div><!-- End Of Wrapper -->    
 <%@include file="includeJsFiles.jsp"%>
</body>
<script type="text/javascript" src="../resources/js/comparativeAnalysis.js"></script>
<script type="text/javascript" src="../resources/js/innerReviews.js"></script>
<script src="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.js"></script>
<script src="<%=request.getContextPath()%>/resources/jquery/jquery.fileDownload.js"></script>
<!-- Charts-->
	<script src="<%= request.getContextPath() %>/resources/highcharts/highcharts.js"></script>
	<script src="<%= request.getContextPath() %>/resources/highcharts/exporting.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>
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
</html>
