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
<title>Source Score Analysis</title>

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

<link href="<%= request.getContextPath() %>/resources/css/jquery.multiselect.css" rel="stylesheet">
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
                    <h1 class="page-header">Source Score Analysis</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<div class="row">
                <div class="col-lg-12 SubHeading">
				An analytical review for Trade review sources.
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<!-- End of header -->
	
	<!-------------------------------------------->
	<!--------- Source Factor Top ---------------->
	<!-------------------------------------------->
	<div class="row KPIDepartmentFactorTop">
		<h2 class="topic-header">Source Score (Trade Reviews)</h2>
		
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Total Review(s)</div>
			<div class="MediumBoldGreyContent" id="totalReviewCount"></div>
		</div>

		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Trend Change
				<div id="trendChange">
				</div>
			</div>
		</div>
		
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Total References
			</div>
			<div>
				<span class="NoChangeLeftAlign" id="totalReferencesCount"></span>
			</div>
		</div>
		
		<div class="col-xs-12 col-md-offset-1 col-md-5 SmallDarkGreyHeader">
			<div class="HappyCountIcon col-xs-4">
				<div class="VerySmallGreyContent" id="positiveCount"></div>
				<div class="VerySmallBoldGreyContent" id="positivePercentage"></div>
			</div>
			
			<div class="NormalCountIcon col-xs-4">
				<div class="VerySmallGreyContent" id="neutralCount"></div>
				<div class="VerySmallBoldGreyContent" id="neutralPercentage"></div>
			</div>
			
			<div class="SadCountIcon col-xs-4">
				<div class="VerySmallGreyContent" id="negativeCount"></div>
				<div class="VerySmallBoldGreyContent" id="negativePercentage"></div>
			</div>
		</div>	
	</div>
	<!-------------------------------------------->
	<!------- END Source Factor Top -------------->
	<!-------------------------------------------->
	
	
	
	<!-------------------------------------------->
	<!------------- Source Chart ----------------->
	<!-------------------------------------------->
	<div class="row">
		<div class="chartBox col-xs-12">
			<button id="outerPageSourceFactorColumnChartPrevious" onclick="showPreviousSourceFactorValues()" class="chartPreviousBtn"></button>
			<div id="SourceFactorColumnStacked" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
			<button id="outerPageSourceFactorColumnChartNext" onclick="showNextSourceFactorValues()" class="chartNextBtn"></button>
		</div>
    </div>
	<!-------------------------------------------->
	<!------------ END Source Chart -------------->
	<!-------------------------------------------->
 
 
	<!-------------------------------------------->
	<!---------------- Source Factor ------------->
	<!-------------------------------------------->
	<div class="row">
		<div class="panel panel-default KPIDepartmentFactorTable">
			<div class="panel-heading">Source Score (Trade Reviews)</div>
			<!----Source One----->
			<div id="sourceFactorSparklineChartDataDiv" style="display: none;">
			</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!--------------- END Source Factor ---------->
	<!-------------------------------------------->
	
 
  
 <!--------------------------------------Seperator--------------------------------->
	<div class="row lineShadawSeperation"></div> 
  <!------------------------------------END Seperator------------------------------>
 
 
 
	<!-------------------------------------------->
	<!------------- Social Chart ----------------->
	<!-------------------------------------------->
	<div class="row KPIDepartmentFactorTop">
		<h2 class="topic-header">Social Media Sources</h2>
		<div class="SmallDarkGreyHeader col-xs-12">
			<div class="VerySmallGreyContent float-left">Total Mention(s)</div>
			<div class="MediumBoldGreyContent float-left" id="totalReviewSocialMentions"></div>
		</div>
	</div>
	<div class="row" id="outerPageSocialSourcesColumnChartDiv" style="display: none;">
		<div class="chartBox col-xs-12">
			<button id="outerPageSourceSocialSourceColumnChartPrevious" onclick="showPreviousSocialSourceValues()" class="chartPreviousBtn"></button>
			<div id="SocialSourceLanding" style="min-width: 500px; height: 400px; margin: 0 auto"></div>
			<button id="outerPageSourceSocialSourceColumnChartNext" onclick="showNextSocialSourceValues()" class="chartNextBtn"></button>
		</div>
    </div>
    
	<!-------------------------------------------->
	<!------------ END Social Chart -------------->
	<!-------------------------------------------->

	
	
	<!-------------------------------------------->
	<!---------------- Social Factor ------------->
	<!-------------------------------------------->
	<div class="row">
		<div class="panel panel-default KPIDepartmentFactorTable">
			<div class="panel-heading">Social Mentions</div>
			<div id="socialMentionSparklineChartDataDiv" style="display: none;">
				<div class="panel-body KPIDepartmentFactorTableBody" data-toggle="modal" data-target=".DepartmentLightBox">
				<div class="row">
					<div class="col-md-6">
						<div class="row">
							<div class="col-xs-6">
								<div class="MediumBoldGreyContent">Facebook</div>
							</div>
							<div class="col-xs-6 text-right">
								<div data-sparkline="71, 78, 39, 66, 32, 23, 23, 100 "style="height:30px; margin-left: 0; margin-right: 0; padding: 0; margin-bottom: -10px; margin-top:7px">
								</div>
                           </div>
						</div>
					</div>
					<div class="col-md-6">
						<div class="col-md-4">
							<div class="SmallBoldGreyContent">Total Mentions(s)</div>
							<div class="MediumBoldDarkBlueContent"></div>
						</div>
						<div class="col-md-4 text-right">
							<div class="VerySmallGreyContent float-left">Trend Change</div>
							<div class="PositiveChangeLeftAlign"></div>
						</div>
						<div class="col-md-4 text-right">
							<a class="SmallLightDarkBlueContentLink">View Details</a>
						</div>
					</div>
				</div>
			</div>
			</div>
		</div>
	</div>
	<!-------------------------------------------->
	<!--------------- END Social Factor ---------->
	<!-------------------------------------------->
	
</div>
 
</div>
<!------------------------------------------------------------------------------>	
<!---------------------- Department Graph Ligntbox ----------------------------->
<!------------------------------------------------------------------------------>	
 <div class="modal fade DepartmentLightBox " tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="sourceFactorModel">
  <div class=" modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span></button>
         <h4 id="myLargeModalLabel" class="modal-title" id="sourceName">Room</h4>
      </div>
		<div class="modal-body row ">
			<div class=" col-xs-12">
			<button style="position:absolute; z-index:10; margin-top:190px; margin-left:-12px;"><</button>
			<div id="DepartmentFactorRoom" class="center_align" style="width: auto; height: 400px; margin: 0 auto"></div>
			<button style="right:0px;margin-right: -2px;margin-top: -210px;position: absolute;z-index: 10; ">></button>
			</div>
        </div>
    </div>
  </div>
</div>
</div>
<!------------------------------------------------------------------------------>	
<!--------------------- END Department Graph Lightbox--------------------------->
<!------------------------------------------------------------------------------>
<!-- <div id="reviewSiteAnalysisDiv"></div> -->
 
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
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>

	<!-- Charts-->
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/highcharts.js"></script>
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/exporting.js"></script>
	
	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery/jquery.multiselect.min.js"></script>
	<script	src="<%=request.getContextPath()%>/resources/js/util.js"></script>
	
	<!-- Script For Social Mentions -->
	<script src="<%=request.getContextPath()%>/resources/js/reviewSourceAnalysis.js"></script>
	
	

<script>	
$(function () {
    /**
     * Create a constructor for sparklines that takes some sensible defaults and merges in the individual
     * chart options. This function is also available from the jQuery plugin as $(element).highcharts('SparkLine').
     */
    Highcharts.SparkLine = function (options, callback) {
        var defaultOptions = {
            chart: {
                renderTo: (options.chart && options.chart.renderTo) || this,
                backgroundColor: null,
                borderWidth: 0,
                type: 'area',
                margin: [0, 0, 0, 0],
                //width: 200,
                //height: 20,
                style: {
                    overflow: 'visible'
                },
                skipClone: true
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                startOnTick: false,
                endOnTick: false,
                tickPositions: []
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickPositions: [0]
            },
            legend: {
                enabled: false
            },
            tooltip: {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                hideDelay: 0,
                shared: true,
                padding: 0,
                positioner: function (w, h, point) {
                    return { x: point.plotX - w / 2, y: point.plotY - h};
                }
            },
            plotOptions: {
                series: {
                    animation: false,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        radius: 1,
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    fillOpacity: 0.25
                },
                column: {
                    negativeColor: '#910000',
                    borderColor: 'silver'
                },
				bar: {											//Bishav's Code
					colors: ['#72d9be', '#f4c947', '#ef3f3f']
                }
            }
        };
        options = Highcharts.merge(defaultOptions, options);

        return new Highcharts.Chart(options, callback);
    };

    var start = +new Date(),
        $tds = $("div[data-sparkline]"),
        fullLen = $tds.length,
        n = 0;

    // Creating 153 sparkline charts is quite fast in modern browsers, but IE8 and mobile
    // can take some seconds, so we split the input into chunks and apply them in timeouts
    // in order avoid locking up the browser process and allow interaction.
    function doChunk() {
        var time = +new Date(),
            i,
            len = $tds.length,
            $td,
            stringdata,
            arr,
            data,
            chart;

        for (i = 0; i < len; i += 1) {
            $td = $($tds[i]);
            stringdata = $td.data('sparkline');
            arr = stringdata.split('; ');
            data = $.map(arr[0].split(', '), parseFloat);
            chart = {};

            if (arr[1]) {
                chart.type = arr[1];
            }
            $td.highcharts('SparkLine', {
                series: [{
                    data: data,
                    pointStart: 1,
                }],
                tooltip: {
                    headerFormat: '<span style="font-size: 10px">Value</span><br/>',
                    pointFormat: '<b>{point.y}.00</b>%'
                },
                chart: chart
            });

            n += 1;

            // If the process takes too much time, run a timeout to allow interaction with the browser
            if (new Date() - time > 500) {
                $tds.splice(0, i + 1);
                setTimeout(doChunk, 0);
                break;
            }

            // Print a feedback on the performance
            if (n === fullLen) {
                $('#result').html('Generated ' + fullLen + ' sparklines in ' + (new Date() - start) + ' ms');
            }
        }
    }
    doChunk();
	navigation: {			
            buttonOptions: {
                enabled: false
            }
        }

});

$(function () {
    $('#KPITEST').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: null,
        },
        subtitle: {
            text: null,
        },
        xAxis: {
            categories: ['Room View', 'Food', 'Check-in', 'Pool', 'Housekeeping'],
            title: {
                text: null
            }				
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: 'Mention(s)'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: null,
            align: 'right',
            verticalAlign: 'top',
            floating: true,
            borderWidth: 0,
			margin:0,
            shadow: true,
			backgroundColor: '#fff',
            margin: [0, 0, 0, 0],
        },
        credits: {
            enabled: false
        },
		colors: ['#72d9be', '#f4c947', '#ef3f3f'],
        series: [{
            name: 'Positive',
            data: [107, 31, 635, 203, 2]
        }, {
			name: 'Neutral',
            data: [973, 914, 20, 732, 107]
        }, {
            name: 'Negative',
            data: [133, 156, 947, 408, 156]
        }]
    });
});
</script>
<!-------------------------------------------->
<!--------- END Source Line Graph ------------>
<!-------------------------------------------->	

<!----------------------------------------------->
<!-------- END SocialSourceLanding Graph--------->
<!----------------------------------------------->	
	
	
	<script>
	<!-- To display Flag item $(this).parentsUntil('.panel-body').children('.keywordbox').addClass('OnSeleceActive');-->	
	$('.SelectKPI').click(function(){
		$('.OnSeleceActive').removeClass('OnSeleceActive');
		$('.keywordbox').addClass('OnSeleceActive');
	});
</script>
	
</body>

</html>
