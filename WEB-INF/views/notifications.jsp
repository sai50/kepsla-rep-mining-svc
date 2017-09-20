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
    <title><spring:message code="label.notifications" /></title>

<title>Notifications</title>

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
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5W4FN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
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
						<span class="DatePickerInputs">
							<input type="hidden" id="from" name="from">
							<input type="hidden" id="altFromDate">
					    <span class="ToDate">To</span>
					     	<input type="hidden" id="to" name="to">
					     	<input type="hidden" id="altToDate">
						</span>
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
                    <h1 class="page-header">Notifications</h1>
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
			<!-- End of header -->

	
		<div class="row">
			<div class="panel panel-default notificationLandingPanel">
				<div class="panel-heading">New Notifications(past log-in)</div>
					<!-- <div class="panel-body">
						<div class="col-md-12">
							<div><a class="SmallLightDarkBlueContentLink">New Message From Repufact.com</a></div>
						</div>
					</div> -->
				<div id="notificationsDiv">
					<div class="panel-body" id="notificationReviewsDiv"  style="display: none;"> 
						<div class="col-md-12">
							<div><a class="SmallLightDarkBlueContentLink" href="#" onclick="redirectView('../notifications/getReviewsForNotifications.htm')" id="NotificationReviews" style="display: none;"></a></div>
						</div>
					</div>
					<div class="panel-body" id="notificationReviewActionsDiv"  style="display: none;">
						<div class="col-md-12">
							<div><a class="SmallLightDarkBlueContentLink" href="#" onclick="redirectView('../notifications/reviewNotificationActions.htm')" id="NotificationReviewActions" style="display: none;"></a></div>
						</div>
					</div>
					<div class="panel-body" id="notificatinReiewNotesDiv"  style="display: none;">
						<div class="col-md-12">
							<div><a class="SmallLightDarkBlueContentLink" href="#" onclick="redirectView('../notifications/getNotificationReviewNotes.htm')" id="NotificatinReiewNotes" style="display: none;"></a></div>
						</div>
					</div>
					<div class="panel-body" id="responedFlaggedReviewsDiv"  style="display: none;">
						<div class="col-md-12">
							<div><a class="SmallLightDarkBlueContentLink" href="#" onclick="redirectView('../notifications/responseFlaggedReviewsFromAdmin.htm')" id="ResponedFlaggedReviews" style="display: none;"></a></div>
						</div>
					</div>
					<div class="panel-body" id="adminReviewActionsDiv"  style="display: none;">
						<div class="col-md-12">
							<div><a class="SmallLightDarkBlueContentLink" href="#" onclick="redirectView('../notifications/adminReviewActions.htm')" id="adminReviewActions" style="display: none;"></a></div>
						</div>
					</div>
					<div class="panel-body" id="userReviewActionsDiv"  style="display: none;">
						<div class="col-md-12">
							<div><a class="SmallLightDarkBlueContentLink" href="#" onclick="redirectView('../notifications/userNotificationReviewActions.htm')" id="userReviewActions" style="display: none;"></a></div>
						</div>
					</div>
				</div>
				<div id="notificationMessage"></div>
			</div>
		</div>
	</div>
</div>
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
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>

	<!-- Charts-->
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/highcharts.js"></script>
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/exporting.js"></script>
		
	<script
		src="<%=request.getContextPath()%>/resources/js/util.js"></script>

	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	<!-- Script For Social Mentions -->
	<script src="<%=request.getContextPath()%>/resources/js/notifications.js"></script>
	
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>

</body>

</html>
