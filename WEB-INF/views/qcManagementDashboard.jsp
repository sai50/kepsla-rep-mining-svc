<!DOCTYPE html>
<%@include file="includeAdminCssFiles.jsp" %>
<%@include file="includeTagLibs.jsp" %>
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
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title>KepSLA Dashboard</title>
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
  <body>
  <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
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
            <!-------------ORGANIZATION SELECTION & DATE PICKET----------------------------->
			<ul id="orgAndDate" class="nav navbar-top-links navbar-right">
				<li><div class="OrganizationIcon"></div>
					<div class="SelectOrganizationTitle">Organization Name</div> 
					<select class="dropdown SelectOrganization" onchange="getCompetitors()" name="organizationName" id="organizationName">
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
            
			<%@include file="leftNavigation.jsp" %>
 </nav>
 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>

  </div>		

    <!-- Bootstrap core JavaScript
    ================================================== -->
  </body>
  <%@include file="includeJsFiles.jsp" %>
   <script src="../resources/js/roleFeature.js"></script>
    <script src="../resources/js/qcManagementDashboard.js"></script>
</html>
