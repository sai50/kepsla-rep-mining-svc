<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%-- <%@include file="includeCssFiles.jsp"%> --%>
<html>
<head>
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title>Department Polarity Inner Page</title>
       
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
    <link href="<%= request.getContextPath() %>/resources/css/jquery.multiselect.css" rel="stylesheet">
    
    <link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">
  
		<!-- Date Time Picker CSS -->
	<link href="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
 <style>
          .highlight
          {
              background-color:#FFFF66;
              color:#333;
              padding:2px;
          }
        </style>
        
</head>
<body>
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
							<input type="text" id="departmentInnerPageFromDate" name="from" value="${fromDateForFilter}">
							<input type="hidden" id="altFromDate" value="${hiddenFromDate}">
							<span class="ToDate">To</span>
							<input type="text" id="departmentInnerPageToDate" name="to" value="${toDateForFilter}">
							<input type="hidden" id="altToDate" value="${hiddenToDate}">
						</span>
					</div>
				</li>
                <!-- /.dropdown -->
                <li>
                	<button type="submit" class="btn btn-primary TopSetButton" onclick="filterDepartmentInnerPage('${departmentName}')" id="departmentInnerPageApply">Apply</button>
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
                	<c:choose>
                		<c:when test="${BreadCrumb eq 'YES' }">
                			 <h1 class="page-header">KPI & Department</h1>
                		</c:when>
                		<c:otherwise>
                			 <h1 class="page-header">Department Factor</h1>
                		</c:otherwise>
                	</c:choose>
                </div>
            </div> 
			<div class="row" id="departmentInnerHeaderBreadCrumb">
                <div class="col-lg-12 SubHeading SmallDarkGreyHeader">
                	<c:choose>
                		<c:when test="${BreadCrumb eq 'YES' }">
                			<span><a href="../reviewKpiAndDepartment/showReviewKpiAndDepartment.htm">KPI & Department </a></span>
                			<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
                			<span id="innerPageDepartmentSummaryDepartmentName">${departmentName}</span>
                		</c:when>
                		<c:otherwise>
                			<c:choose>
                				<c:when test="${DashBoard eq 'YES' }">
                					<span><a href="../main/dashboard.htm">DashBoard</a></span>
                				</c:when>
                				<c:otherwise>
                					<span><a href="../reviewSummary/showReviewSummary.htm">Summary </a></span>
                				</c:otherwise>
                			</c:choose>
                			<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
                			<span id="innerPageDepartmentSummaryDepartmentName">${departmentName}</span>
                		</c:otherwise>
                	</c:choose>
					
					<input type="hidden" id="innerPageDepartmentSummaryId" value="${departmentId}">
					<input type="hidden" id="innerPageDepartmentSummaryRepufact" value="${departmentRepufact}">
					<input type="hidden" id="innerPageDepartmentBreadCrumb" value="${BreadCrumb}">
					<input type="hidden" id="isDashBoardForDepartmentInnerPage" value="${DashBoard}">
					
					<!-- <span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span> <a>Checkin </a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span>Checkin Process</span> -->
                </div>
                <!-- /.col-lg-12 -->
            </div> 
			<!-- End of header -->
	
	<!-------------------------------------------->
	<!------------ Department Top ---------------->
	<!-------------------------------------------->
<%-- 	<div class="row KPIDepartmentFactorTop" id="departmentInnerPageRepufact">
		<h2 class="topic-header"></h2>
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Department Factor</div>
			<div class="MediumBoldGreyContent"><fmt:formatNumber type="number" value="${departmentRepufact}" maxFractionDigits="2"/></div>
		</div>
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Trend Change
				<div>
					<c:choose>
						<c:when test="${departmentTrendChange gt 0 }">
							<span class="PositiveChangeLeftAlign">${departmentTrendChange}%</span>
						</c:when>
						<c:when test="${departmentTrendChange lt 0 }">
							<span class="NegativeChangeLeftAlign">${departmentTrendChange}%</span>
						</c:when>
						<c:otherwise>
							<span class="NoChangeLeftAlign">${departmentTrendChange}%</span>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Total Reference(s)</div> 
			<div class="MediumBoldGreyContent">${polarityCounts.positive+polarityCounts.negative+polarityCounts.neutral}</div>
		</div>
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Total Review(s)</div> 
			<div class="MediumBoldGreyContent" id="departmentReviewsSize"></div>
		</div>
		
		<div class="col-xs-12 col-md-3">
			<div class="row">
			<img alt="" src="../resources/css/HappyIcon.png">&nbsp;${polarityCounts.positive}&nbsp;
			<img alt="" src="../resources/css/NormalIcon.png">&nbsp;${polarityCounts.neutral}&nbsp;
			<img alt="" src="../resources/css/SadIcon.png">&nbsp;${polarityCounts.negative}&nbsp;
			</div>
		</div>
	</div> --%>
	<!-------------------------------------------->
	<!--------- END Department Top --------------->
	<!-------------------------------------------->
	
	
	
	<!-------------------------------------------->
	<!------------ Department Chart -------------->
	<!-------------------------------------------->
	<!-- <div class="row" id="departmentInnerPageChart">
		<div class="chartBox col-xs-12">
			<button class="chartPreviousBtn" id="innerPageDepartmentSummaryPreviousButton" disabled="disabled" style="position:absolute; z-index:10; margin-top:190px; margin-left:-12px;" onclick="previousInnerPageDepartmentSummaryChart()"></button>
			<div id="DepartmentFactorColumnSummaryStacked" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
			<button class="chartNextBtn" id="innerPageDepartmentSummaryNextButton" style="right:0px;margin-right: -2px;margin-top: -210px;position: absolute;z-index: 10; " onclick="nextInnerPageDepartmentSummaryChart()"></button>
		</div>
    </div> -->
	<!-------------------------------------------->
	<!---------- END Department Chart ------------>
	<!-------------------------------------------->
 
 
 
  
 <!--------------------------------------Seperator--------------------------------->
	<!-- <div class="row lineShadawSeperation" id="departmentInnerPageLineShadow"></div>  -->
  <!------------------------------------END Seperator------------------------------>
 
 
 
	<!-------------------------------------------->
	<!---------------- Reviews Top---------------->
	<!-------------------------------------------->
	<div class="row TopReviewSource" id="reviewHeaderName">
		<div class="col-md-9">
			<h2 class="topic-header" id="reviewHeaderId">${polarity}&nbsp;Reviews</h2>
		</div>
		<div class="col-md-3">
			<div class="input-group SearchIcon" id="searchIconId">
				<label for="SearchItem" class="sr-only">Review Search</label>
				<div class="input-group-addon"><span aria-hidden="true" class="glyphicon glyphicon-search"></span></div>
				<input type="search" placeholder="Review Search" onkeyup="departmentInnerPageReviewSearch()" id="departmentInnerPageSummaryReviewsSearch" class="form-control">
			</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!-------------- End Reviews Top-------------->
	<!-------------------------------------------->

	
<!---------------------------------------------------------------------->	
<!-------------------------- Reviews ----------------------------------->
<!---------------------------------------------------------------------->
			<div id="hotelReviewsDivId">	
			</div>
<!---------------------------------------------------------------------->	
<!------------------------ Edit Reviews -------------------------------->
<!---------------------------------------------------------------------->
			<div id="page-selection"></div>
		</div>

 <!--Success Message Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="departmentInnerPageSuccessModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="departmentInnerPageSuccessModalTitle">Success</h4>
							</div>
							
							<div id="body2"   align="center" class="modal-body">
							 	<p id="departmentInnerPageSuccessModalText" class="warning">Review broadcasted successfully !</p>
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
	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	<script src="<%= request.getContextPath() %>/resources/js/util.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.js"></script>
		<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>
	
    <!-- Script For Dashboard -->	
    <script src="<%= request.getContextPath() %>/resources/js/departmentPolarityInnerPage.js"></script>	
    
    <script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
    <script	src="${pageContext.request.contextPath}/resources/jquery/jquery-keyword-highlight.js"></script>
    
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
	 
	$('.ShowSemanticPolarity').click(function() {
		var keywordDivId="keywordAndScore_"+$(this).data('reviewid');
		console.log(keywordDivId+" 8");
	    if($("#"+keywordDivId).hasClass("OnSeleceActive")){
	         $("#"+keywordDivId).removeClass("OnSeleceActive");
	              
	    }else{
	         $("#"+keywordDivId).addClass("OnSeleceActive");

	    };
	});  
	</script>
<!-- Script For Dashboard -->	
</html>
