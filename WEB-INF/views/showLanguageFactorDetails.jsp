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
<title>Language Score</title>

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

	<!-- Date Time Picker CSS -->
<link	href="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.css"	rel="stylesheet">

<!-- Date Picker CSS -->
<link
	href="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.css"
	rel="stylesheet">
	
		<link href="<%= request.getContextPath() %>/resources/css/jquery.multiselect.css" rel="stylesheet">
		
	<link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">
	<script type="text/javascript">
		var positeiveSentimentCounts = "${polarityCounts.positive}";
		var neutralSentimentConts = "${polarityCounts.neutral}";
		var negativeSentimentCounts = "${polarityCounts.negative}";
		var languageFctorchange = "${languageFctorchange}";
		var language = "${language}";
	</script>
</head>

<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
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
                    <h1 class="page-header">Language Score</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<div class="row" id="languageFactorBredCrumb">
                <div class="col-lg-12 SubHeading SmallDarkGreyHeader">
					<span> <a href="../languageFactor/showLanguageFctors.htm">Language</a></span>
					<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>
					<span>${languageFullName}</span>
					<input type="hidden" id="languageFactorName" value="${language}"></input>
					<input type="hidden" id="languageFactorFullName" value="${languageFullName}"></input>
					
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<!-- End of header -->
	
	<!-------------------------------------------->
	<!------------ InnerSource Top ---------------->
	<!-------------------------------------------->
	<div class="row KPIDepartmentFactorTop" id="languageFactorTop">
		<!-- <h2 class="topic-header">Scores Card</h2> -->
		<%--<div class="col-sm-4 col-md-2 SmallDarkGreyHeader">
			 <div class="VerySmallGreyContent">
				Language Score  
				<div class="MediumBoldDarkBlueContent" id="innerPageLanguageFactor">${currentLanguagefactor}%</div>
			</div> 
		</div>--%>
		<div class="col-sm-4 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Trend Change  
				<div id="languageFactorInnerPageTrendChange">
				<c:if test="${languageFctorchange gt 0}">
					<span class="PositiveChangeLeftAlign">${languageFctorchange}%</span>
				</c:if>
				<c:if test="${languageFctorchange lt 0}">
					<span class="NegativeChangeLeftAlign">${languageFctorchange}%</span>
				</c:if>
				<c:if test="${languageFctorchange eq 0}">
					<span class="NoChangeLeftAlign">${languageFctorchange}%</span>
				</c:if>
				</div>
			</div>
		</div>
		<div class="col-sm-4 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Total Review(s)</div>
			<div class="MediumBoldGreyContent" id="languageFactorInnerPageTotalReviews">${languageVolume}</div>
			<input type="hidden" id="reviewsCount" value="${languageVolume}">
		</div>
		<%-- <div class="col-xs-12 col-md-3">
			<div class="row">
				<div class="col-xs-5">
					<div id="SentimentCountLanguageFactor" style="margin: -10px 0px 0px -4px; height: 70px; padding-bottom:-30px;"></div>
				</div>
				<div class="col-xs-7 text-right">
					<div class="SmallDarkGreyHeader"><span class="PositiveSentimentCount">${polarityCounts.positive} </span>Positive</div>
					<div class="SmallDarkGreyHeader"><span class="NeutralSentimentCount">${polarityCounts.neutral} </span>Neutral</div>
					<div class="SmallDarkGreyHeader"><span class="NegativeSentimentCount">${polarityCounts.negative} </span>Negative</div>
				</div>
			</div>
		</div> --%>
		<div class="col-xs-12 col-md-6 SmallDarkGreyHeader">
			<div class="HappyCountIcon col-xs-4">
				<div class="VerySmallGreyContent" id="positiveCountInnerPageLanguageFactor">${polarityCounts.positive}</div>
				<div class="VerySmallBoldGreyContent" id="positivePercentageInnerPageLanguageFactor"><fmt:formatNumber type="number" 
            maxIntegerDigits="2" maxFractionDigits="2" value="${(polarityCounts.positive/polarityCounts.totalReferences)*100}" />%</div>
			</div>
			<div class="NormalCountIcon col-xs-4">
				<div class="VerySmallGreyContent" id="neutralCountInnerPageLanguageFactor">${polarityCounts.neutral}</div>
				<div class="VerySmallBoldGreyContent" id="neutralPercentagInnerPageLanguageFactor"><fmt:formatNumber type="number" 
            maxIntegerDigits="2" maxFractionDigits="2" value="${(polarityCounts.neutral/polarityCounts.totalReferences)*100}"/>%</div>
			</div>
			<div class="SadCountIcon col-xs-4">
				<div class="VerySmallGreyContent" id="negativeCountInnerPageLanguageFactor">${polarityCounts.negative}</div>
				<div class="VerySmallBoldGreyContent" id="negativePercentageInnerPageLanguageFactor"><fmt:formatNumber type="number" 
            maxIntegerDigits="2" maxFractionDigits="2" value="${(polarityCounts.negative/polarityCounts.totalReferences)*100}"/>%</div>
			</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!--------- END InnerSource Top --------------->
	<!-------------------------------------------->
	
	
	
	<!----------------------------------------------->
	<!------------ Source Factor Chart -------------->
	<!----------------------------------------------->
	<div class="row" id="innerPageLanguageFactorDiv" style="display: none;">
		<div class="chartBox col-xs-12">
			 <!-- <h2 class="topic-header">Scores Card</h2> -->
			<button id="innerPageLanguageFactorColumnChartPrevious" onclick="previsousInnerPageLanguageFactor()" class="chartPreviousBtn"></button>
			<div id="innerPageLanguageFactorColumnStacked" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
			<button id="innerPageLanguageFactorColumnChartNext" onclick="nextInnerPageLanguageFactor()" class="chartNextBtn"></button>
		</div>
    </div>
	<!-------------------------------------------->
	<!---------- END Department Chart ------------>
	<!-------------------------------------------->
 
 
 
 	<!----------------------------------------------->
	<!------------ Source Factor Chart -------------->
	<!----------------------------------------------->
	<div class="row" id="languageFactorReviewVolumeChart">
		<div class="chartBox col-xs-12">
			 <h2 class="topic-header">Review Volume</h2>
			<button id="innerPageLanguageVolumePrevious" onclick="showinnerPageLanguageVolumePrevious()" class="chartPreviousBtn"></button>
			<div id="languageVolumeInnerPageColumnChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
			<button id="innerPageLanguageVolumeNext" onclick="showinnerPageLanguageVolumeNext()" class="chartNextBtn"></button>
		</div>
    </div>
    
	<!-------------------------------------------->
	<!---------- END Department Chart ------------>
	<!-------------------------------------------->
 
 
 
  
 <!--------------------------------------Seperator--------------------------------->
	<div class="row lineShadawSeperation" id="languageFactorLineShadowSeperation"></div> 
  <!------------------------------------END Seperator------------------------------>
 
 
 
	<!-------------------------------------------->
	<!---------------- Reviews Top---------------->
	<!-------------------------------------------->
	<div class="row TopReviewSource" id="reveiwLanguageFactorSearchDiv">
		<div class="col-md-9">
			<h2 class="topic-header">Reviews</h2>
		</div>
		<div class="col-md-3">
			<div class="input-group SearchIcon">
				<label for="SearchItem" class="sr-only">Review Search</label>
				<div class="input-group-addon"><span aria-hidden="true" class="glyphicon glyphicon-search"></span></div>
				<input type="search" id="languageFactorInnerPageReviewSearch" onkeyup="languageFactorInnerPageSearch()" placeholder="Review Search" class="form-control">
			</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!-------------- End Reviews Top-------------->
	<!-------------------------------------------->

	
<!---------------------------------------------------------------------->	
<!-------------------------- Reviews ----------------------------------->
<!---------------------------------------------------------------------->
<div class="row" id="reviewDetailsForLanguage">	
</div>
<div id="content"></div>
<div id="page-selection"></div>
<!---------------------------------------------------------------------->	
<!------------------------ Edit Reviews -------------------------------->
<!---------------------------------------------------------------------->

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
 	<%@include file="includeJsFiles.jsp"%>
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

	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	<!-- Script For Social Mentions -->
	
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.js"></script>
		<script src="<%=request.getContextPath()%>/resources/jquery/jquery.multiselect.min.js"></script>
			<script	src="<%=request.getContextPath()%>/resources/js/util.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/showLanguageFactorDetails.js"></script>
	
	

	<!-------------------------------------------->
	<!---------- Source Polarity Count ----------->
	<!-------------------------------------------->	
<script>
	$(function () {
		var sumTotalCount = parseInt(positeiveSentimentCounts)+parseInt(neutralSentimentConts)+parseInt(negativeSentimentCounts);
		var positivePercentage = (positeiveSentimentCounts/sumTotalCount)*100;
		var neutralPercentage = (neutralSentimentConts/sumTotalCount)*100;
		var negativePercentage = (negativeSentimentCounts/sumTotalCount)*100;
    $('#SentimentCountLanguageFactor').highcharts({
        credits: {
			enabled: false
		},
		chart: {
			backgroundColor: 'transparent',
            type: 'column',
			showPrintMenuItem:'0',
			style: {
                    overflow: 'visible'
                },
                skipClone: true
        },
		 plotOptions: {
                column: {
                    colorByPoint: true
                }
        },
		colors: ['#72d9be', '#f4c947', '#ef3f3f'],
       	title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
			lineWidth: 0, // Hide gridline
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			minorTickLength: 0,
			tickLength: 0,
            type: null,
            labels: {
				enabled: false,
            }
        },
        yAxis: {
            lineWidth: 0,
			minorGridLineWidth: 0,
			lineColor: 'transparent',
			minorTickLength: 0,
			tickLength: 0,
            title: {
                text: null
            },
            labels: {
				enabled: false,
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<b>{point.y:.1f}%</b>'
        },
		
        series: [{
            name: 'Polarity',
            data: [
                ['Positive', positivePercentage],
                ['Neutral', neutralPercentage],
                ['Negative', negativePercentage],
            ],
        }],
		navigation: {			
				buttonOptions: {
					enabled: false
				}	
        } 
    });
});
</script>	
	<!-------------------------------------------->
	<!-------- End Source Polarity Count --------->
	<!-------------------------------------------->	

<!-- <!----------------------------------------------->


<script>
	
<!-- To display TradeReviewKpiDepartmentFactor item-->	
$('.ShowSemanticPolarity').click(function(){
	$('.active').removeClass('active');
	$('.OnSeleceActive').removeClass('OnSeleceActive');
	$(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');
});

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
