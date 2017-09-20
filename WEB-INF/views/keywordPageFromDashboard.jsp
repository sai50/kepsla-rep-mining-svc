
<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%-- <%@include file="includeCssFiles.jsp"%> --%>
<html>
<head>

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWQVXW');</script>
<!-- End Google Tag Manager -->
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title>KPI & Department</title>

 <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Repufact Customer Dashboard">
    <meta name="author" content="Bishav.n.r">
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
    
    <link href="<%= request.getContextPath() %>/resources/css/jquery.multiselect.css" rel="stylesheet">
    
    <link
	href="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.css"
	rel="stylesheet">

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
                	<select id="organizationName" name="mySelect" class="dropdown SelectOrganization">
                	
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
							<input type="text" id="altFromDate" name="from" value="${fromDateForFilter}">
							<input type="hidden" id="altKeywordInnerPageFromDate" value="${hiddenFromDate}">
							<span class="ToDate">To</span>
							<input type="text" id="altToDate" name="to" value="${toDateForFilter}">
							<input type="hidden" id="altKeywordInnerPageToDate" value="${hiddenToDate}">
						</span>
					</div>
				</li>
                <!-- /.dropdown -->
                <li>
                	<button type="submit" class="btn btn-primary TopSetButton" onclick="filterKpiInnerPage()" id="kpiInnerPageApply">Apply</button>
                	<!-- <button type="submit" class="btn btn-primary" id="applyFilterBtn">Apply</button>
	   				<button type="submit" class="btn btn-default" id="clearBtn">Cancel</button> -->
                </li>
            </ul>
            <!-- /.navbar-top-links -->
<!-------------END of ORGANIZATION SELECTION & DATE PICKET----------------------------->
		<%@include file="leftNavigation.jsp" %>
        </nav>
 
<div id="page-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">KPI & Department</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<div class="row" id="keywordInnerPageBreadCrumb">
                <div class="col-lg-12 SubHeading SmallDarkGreyHeader">
                
               		<span><a href="../reviewKpiAndDepartment/showReviewKpiAndDepartment.htm">KPI & Department </a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span> <a onclick="departmentInnerPage(${departmentId},'YES')">${departmentName}</a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span> <a onclick="kpiInnerPage(${kpiId},${departmentId},'YES')">${kpiName}</a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span id="innerPageKeywordSummaryKeywordName">${keywordName}</span>
					<!-- --Hidden Ids-------------------------------------------------- -->
					<input type="hidden" id="innerPageKeywordSummaryKpiId" value="${kpiId}">
					<input type="hidden" id="innerPageKeywordSummaryKeywordId" value="${keywordId}">
					<input type="hidden" id="innerPageKeywordSummaryDepartmentId" value="${departmentId}">
					<input type="hidden" id="innerPageKeywordSummaryRepufact" value="${keywordRepufact}">
					<input type="hidden" id="innerPageKeywordBreadCrumb" value="${BreadCrumb}">
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<!-- End of header -->
	
	<!-------------------------------------------->
	<!------------ Department Top ---------------->
	<!-------------------------------------------->
	<div class="row KPIDepartmentFactorTop" id="keywordInnerFactorTop">
		<h2 class="topic-header"></h2>
		<div class="col-xs-12 col-md-3 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Trend Change
				<div>
					<c:choose>
						<c:when test="${keywordTrendChange gt 0 }">
							<span class="PositiveChangeLeftAlign">${keywordTrendChange}%</span>
						</c:when>
						<c:when test="${keywordTrendChange lt 0 }">
							<span class="NegativeChangeLeftAlign">${keywordTrendChange}%</span>
						</c:when>
						<c:otherwise>
							<span class="NoChangeLeftAlign">${keywordTrendChange}%</span>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-md-3 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Total Review(s)</div>
			<div id="keywordTotalReviewCount" class="MediumBoldGreyContent"></div>
		</div>
		<div class="col-xs-12 col-md-3">
			<div class="row">
			<img alt="" src="../resources/css/HappyIcon.png">&nbsp;${keywordPolarity.positive}&nbsp;
			<img alt="" src="../resources/css/NormalIcon.png">&nbsp;${keywordPolarity.neutral}&nbsp;
			<img alt="" src="../resources/css/SadIcon.png">&nbsp;${keywordPolarity.negative}&nbsp;
			</div>
		</div>
		
	</div>
	<!-------------------------------------------->
	<!--------- END Department Top --------------->
	<!-------------------------------------------->
 
  <!--------------------------------------Seperator--------------------------------->
	<div class="row lineShadawSeperation" id="keywordLineSeparator"></div> 
  <!------------------------------------END Seperator------------------------------>
 
	<!-------------------------------------------->
	<!---------------- Reviews Top---------------->
	<!-------------------------------------------->
	<div class="row TopReviewSource" id="keywordReviewsSearch">
		<div class="col-md-9">
			<h2 class="topic-header">Reviews</h2>
		</div>
		<div class="col-md-3">
			<div class="input-group SearchIcon">
				<label for="SearchItem" class="sr-only">Review Search</label>
				<div class="input-group-addon"><span aria-hidden="true" class="glyphicon glyphicon-search"></span></div>
				<input type="search" placeholder="Review Search" id="keywordInnerPageSummaryReviewsSearch" onkeyup="keywordInnerPageSearch()" class="form-control">
			</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!-------------- End Reviews Top-------------->
	<!-------------------------------------------->
	
<!---------------------------------------------------------------------->	
<!-------------------------- Reviews ----------------------------------->
<!---------------------------------------------------------------------->
			<div id="keywordInnerPageSummaryReviews">	
			</div>
<!---------------------------------------------------------------------->	
<!------------------------ Edit Reviews -------------------------------->
<!---------------------------------------------------------------------->
	
	<div id="page-selection"></div>
	</div>

     <!--Success Message Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="keywordInnerPageSuccessModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="keywordInnerPageSuccessModalTitle">Success</h4>
							</div>
							
							<div id="body2"   align="center" class="modal-body">
							 	<p id="keywordInnerPageSuccessModalText" class="warning">Review broadcasted successfully !</p>
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
</body>
<%@include file="includeJsFiles.jsp"%>
<!-- jQuery Version 1.11.0 -->
    <script src="<%= request.getContextPath() %>/resources/jquery/jquery-1.11.0.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="<%= request.getContextPath() %>/resources/bootstrap/bootstrap.min.js"></script>

    <!-- Metis Menu Plugin JavaScript -->
    <script src="<%= request.getContextPath() %>/resources/bootstrap/plugins/metisMenu/metisMenu.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="<%= request.getContextPath() %>/resources/bootstrap/main.js"></script>
	
	<!-- Bootstrap jqueryUI JavaScript For Date Picker-->
	<script src="<%= request.getContextPath() %>/resources/jquery-ui/jquery-ui.js"></script>

	<!-- Charts-->
	<script src="<%= request.getContextPath() %>/resources/highcharts/highcharts.js"></script>
	<script src="<%= request.getContextPath() %>/resources/highcharts/exporting.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.multiselect.min.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.js"></script>
	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	<script src="<%= request.getContextPath() %>/resources/js/util.js"></script>
    <!-- Script For Dashboard -->	
    <script src="<%= request.getContextPath() %>/resources/js/keywordInnerPage.js"></script>	
     <script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>
    <script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
<!-- Script For Dashboard -->	

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
		}
		</script>
		
</html>