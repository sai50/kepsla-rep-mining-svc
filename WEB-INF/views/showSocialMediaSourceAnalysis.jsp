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
<title>Social Media Source Analysis</title>

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
	<script type="text/javascript">
		var sourceId = "${sourceId}";
		var soureName = "${sourceName}";
	</script>
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
							<button type="submit" class="btn btn-default TopSetButton" id="clearBtn">Cancel</button>
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
                    <h1 class="page-header">Source</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<div class="row">
                <div class="col-lg-12 SubHeading SmallDarkGreyHeader">
					<span> <a href="../reviewSourceAnalysis/showReviewSourceAnalysis.htm">Source</a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span>${sourceName}</span>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<!-- End of header -->
	
	<!-------------------------------------------->
	<!------------ InnerSource Top ---------------->
	<!-------------------------------------------->
	<div class="row KPIDepartmentFactorTop">
		<!-- <h2 class="topic-header">Scores Card</h2> -->
		<!-- <div class="col-xs-12 col-md-3 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Trend Change
				<div>
				<span class="NegativeChangeLeftAlign" id="trendChangeInnerPage">-2%</span>
				</div>
			</div>
		</div> -->
		<div class="col-xs-12 col-md-3 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Total Mentions(s)</div>
			<div class="MediumBoldGreyContent" id="totalMentionsInnerPage">2127</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!--------- END InnerSource Top --------------->
	<!-------------------------------------------->
 
 
 
 	<!----------------------------------------------->
	<!------------ Source Volume Chart -------------->
	<!----------------------------------------------->
	<div class="row">
		<div class="chartBox col-xs-12">
			 <h2 class="topic-header">Mentions Volume</h2>
			<button id="innerPageSocialMentionsColumnChartPrevious" onclick="showInnerPageSocialMentionsColumnChartPreviousValues()" class="chartPreviousBtn"></button>
			<div id="SourceVolumeInnerPageCount" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
			<button id="innerPageSocialMentionsColumnChartNext" onclick="showInnerPageSocialMentionsColumnChartNextValues()" class="chartNextBtn"></button>
		</div>
    </div>
    
	<!-------------------------------------------->
	<!---------- END Department Chart ------------>
	<!-------------------------------------------->
 
 
 
  
 <!--------------------------------------Seperator--------------------------------->
	<div class="row lineShadawSeperation"></div> 
  <!------------------------------------END Seperator------------------------------>
 
 
 
	<!-------------------------------------------->
	<!---------------- Reviews Top---------------->
	<!-------------------------------------------->
	<div class="row TopReviewSource">
		<div class="col-md-9">
			<h2 class="topic-header">Social Mentions</h2>
		</div>
		<div class="col-md-3">
			<div class="input-group SearchIcon">
				<label for="SearchItem" class="sr-only">Review Search</label>
				<div class="input-group-addon"><span aria-hidden="true" class="glyphicon glyphicon-search"></span></div>
				<input type="search" placeholder="Search" id="searchString" onkeyup="searchSocialMediaSourcesInnerPage()" class="form-control">
			</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!-------------- End Reviews Top-------------->
	<!-------------------------------------------->

	
	
<!---------------------------------------------------------------------->	
<!-------------------------- Reviews ----------------------------------->
<!---------------------------------------------------------------------->
			<div class="row" id="reviewDetailsForSocialMediaSource" style="display: none;">	
				<div class="col-xs-12 SingleReviewList">
					<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">
						<div class="BlueSentimentReview row"><div class="arrow-left"></div>Yatra</div>
						<div class="reviewDetails row">
							<div class="reviewerName">by <span>Bishav Narshing Rajbhandari</span></div>
							<div class="reviewerDetail">from <span>Bangalore, India</span></div>
							<div class="revieweTime"><span class="glyphicon glyphicon-time">
								</span> 12 September 2014</span>
							</div>
						</div>
					</div>
					<div class="col-xs-12 col-sm-9 col-lg-10">
						<h3 class="SingleReviewHeader">This is a review title</h3>
						<p>
						Nunc euismod ex non urna commodo, id sagittis dui tempus. Ut eget dui ac tortor posuere egestas in sed nunc. Nam ultrices convallis lectus sit amet dictum. Nunc dapibus tempor nunc in sagittis. Nam at quam ac massa ullamcorper laoreet. In at ultricies lacus. Curabitur vestibulum erat non quam tincidunt pellentesque.
						</p>
						<div class="sentimentKeywordResult">
							<a class="SmallLightDarkBlueContentLink">View Review</a>
						</div>
					</div>
				</div>
			</div>
			<div id="content"></div>
			<div id="page-selection"></div>
			<!---------------------------------------------------------------------->	
			<!------------------------ Edit Reviews -------------------------------->
			<!---------------------------------------------------------------------->
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
	<script
		src="<%=request.getContextPath()%>/resources/js/util.js"></script>
	<!-- Charts-->
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/highcharts.js"></script>
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/exporting.js"></script>

	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	<!-- Script For Social Mentions -->
	
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>

	<script src="<%=request.getContextPath()%>/resources/js/showSocialMediaSourceAnalysis.js"></script>
<!----------------------------------------------->
<!----- SocialSourceLanding Graph---------------->
<!----------------------------------------------->
<!-- <script>
$(function () {
    $('#SourceVolumeInnerPageCount').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
            categories: ['1-7 Jan 15', '8-14 Jan 15', '15-21 Jan 15', '1-7 Jan 15', '8-14 Jan 15', '15-21 Jan 15', '1-7 Jan 15', '8-14 Jan 15', '15-21 Jan 15', '1-7 Jan 15', '8-14 Jan 15', '15-21 Jan 15'],
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'No of references for Facebook'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Total references: <b>{point.y:.1f}</b>'
        },
        series: [{
            name: 'References',
            data: [
                {y: 3121}, 
                {y: 3243}, 
                {y: 2021}, 
                {y: 2123},
                {y: 1034},
                {y: 2123},
                {y: 3121}],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
    });
});
</script> -->
<!----------------------------------------------->
<!-------- END SocialSourceLanding Graph--------->
<!----------------------------------------------->	

	
</body>

</html>
