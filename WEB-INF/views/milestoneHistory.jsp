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
    <title>Milestone History</title>

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
				   <a style="padding: 5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
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
                    <h1 class="page-header">Milestone History</h1>
                </div>
            </div>
				<div class="row">
	                <div class="col-lg-12 SubHeading">
					<span id="orgName"></span>
						<!-- <a data-target=".FilterLightBox" data-toggle="modal" class="filterButton" type="button" id="exortoToExcel" style="display: none"><span class="glyphicon glyphicon-download-alt"></span> Export to excel</a> -->
						<a data-target=".FilterLightBox" data-togg	le="modal" class="filterButton" type="button" id=exportMilestoneHistory><span class="glyphicon glyphicon-download-alt"></span> Export to excel</a>
	                </div>
	            </div>
	            
				<div id="milestoneHistoryDiv" style="display: none;">
			
				</div>
		</div>
	<%@include file="includeJsFiles.jsp"%>
	<!-- Script For MilestoneHistory -->
	<script src="<%=request.getContextPath()%>/resources/js/milestoneHistory.js"></script>
	
	<select id="departmentsForMileStoneSearch" style="display: none;"></select>
	<select id="kpisForMileStoneSearch" style="display: none;"></select>
	<select id="sourcesForMileStoneSearch" style="display: none;"></select>
</body>
</html>
