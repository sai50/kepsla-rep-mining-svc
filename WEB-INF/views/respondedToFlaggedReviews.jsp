<!DOCTYPE html>
<html lang="en">
<%@include file="includeTagLibs.jsp"%>
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
<title><spring:message code="label.responded.flagged.reviews" /></title>

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
	
	<link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">
	

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body >
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
	<div id="wrapper">
		<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
		<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0" id="header">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
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
					<select class="dropdown SelectOrganization" onChange="getAllOnChangeRespondedFlagsList()" name="organizationName" id="organizationName">
					<c:forEach items="${organizations}" var="organization">
                		<option value="${organization.organizationId}" <c:if test="${organization.id eq organizationId}">selected="selected"</c:if>>${organization.organizationFullName}</option>
                	</c:forEach>
					</select>
				</li>
				<!-- /.dropdown -->
				<!-- <li class="dropdown ">
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
				</li> -->
				<!-- /.dropdown -->
				<!-- <li>
					<button type="submit" class="btn btn-primary TopSetButton" id="applyFilterBtn">Apply</button>
					<button type="submit" class="btn btn-default TopSetButton" id="clearBtn">Cancel</button> 
				</li> -->
			</ul>
			<!-- /.navbar-top-links -->
			<!-------------END of ORGANIZATION SELECTION & DATE PICKET----------------------------->

			<%@include file="leftNavigation.jsp"%>
		</nav>
		<!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>

		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">Responded Flags</h1>
				</div>
				<!-- /.col-lg-12 -->
			</div>
			<div class="row">
                <div class="col-lg-12 SubHeading">
               <input type="hidden"  value="<%= session.getAttribute("lastLoggedInDate") %>"/> 
				 Last logged-in at <%= session.getAttribute("lastLoggedInDate") %>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            
            
            <div id="noReviews"></div>
            
            <!-------------------------- Reviews ----------------------------------->
            <div id="responseReviewFlaggedDiv" class="row" style="display: none;">
				<div class="row col-xs-12 SingleReviewList">
					<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">
						<div  class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">20%</span> </div>
						<div class="reviewDetails row">
							<div class="reviewSource">Yatra</div>
							<div class="reviewerName">by <span>Bishav Narshing Rajbhandari</span></div>
							<div class="reviewerDetail">from <span>Bangalore, India</span></div>
							<div class="revieweTime"><span class="glyphicon glyphicon-time">
								</span> 12 September 2014</span>
							</div>
						</div>
					</div>
					<div class="col-xs-12 col-sm-9 col-lg-10">
						<h3 class="SingleReviewHeader"></h3>
						<p>
						Nunc euismod ex non urna commodo, id sagittis dui tempus. Ut eget dui ac tortor posuere egestas in sed nunc. Nam ultrices convallis lectus sit amet dictum. Nunc dapibus tempor nunc in sagittis. Nam at quam ac massa ullamcorper laoreet. In at ultricies lacus. Curabitur vestibulum erat non quam tincidunt pellentesque.
						</p>
								
                            </div>
                        </div>
						</div>
					</div>
				</div>
         <!-------------------------- END Reviews ----------------------------------->      
            
	</div>
	</div>



	<!-------------------------- /.END Sources----------------------------------->

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
	
	
	<!-- Script For Dashboard -->
	<script src="<%=request.getContextPath()%>/resources/js/respondedToFlaggedReviews.js"></script>
	
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/js/util.js"></script>

	
</body>

</html>




