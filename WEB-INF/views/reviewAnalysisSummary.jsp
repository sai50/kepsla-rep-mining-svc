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
    <title><spring:message code="label.summary.analysis" /></title>

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
                	<select id="organizationName" name="organizationName" class="dropdown SelectOrganization">
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
                	<!-- <button type="submit" class="btn btn-primary" id="applyFilterBtn">Apply</button>
	   				<button type="submit" class="btn btn-default" id="clearBtn">Cancel</button> -->
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
                    <h1 class="page-header">Summary</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<div class="row">
                <div class="col-lg-12 SubHeading">
				An overall analytical overview of the system 
                </div>
                <!-- /.col-lg-12 -->
            </div>
			
            <!-------------------------- Overall Organization Score----------------------------------->
            <div class="row panel SummaryOverallOrganizationScoreboard">
				<h2 class="topic-header">Overall Organization Score</h2>
				<!---------------------- /.Repufactor ---------------------->
                <div class="col-lg-3 col-md-6 col-xs-12">
					<div class="DarkBlue repufact">
                            <div class="row Repufactlogo">
								<div class="col-xs-12">
									<div class="rsiHeading" style="font-size: inherit;">	Rating Score Index</div>
								</div>
							</div>
                            <div class="row">       
                                    <div class="SummaryRepufactorPercentage"></div>
                            </div>
                    </div>
				</div>
				<!---------------------- /.End of Repufactor--------------->
				<!----------- Ranking, Review-Count, Mentions, Sentimet-Score---------->
                <div class="col-lg-3 col-md-6 col-xs-12">
                    <div class="SummaryCompetitionRanking row"><!------/.Organization Competitor Ranking----->
						<span class="MediumBoldGreyContent">Competition Ranking</span>
						<span class="LargeBoldDarkBlueContent" id="competitionRanking"></span>
						<sup class="SmallBoldGreyContent"></sup>
                    </div>
					<div class="SummaryTotalReviews row"><!------/.Organization Total Reviews----->
						<div class="MediumBoldGreyContent">Total Review(s)</div>
						<div id="reviewTotalCount"></div>
                    </div>
                   <!--  Added by Rajesh -->
                    <div class="SummaryTotalReviewsCount row"> <!----/.Organization Total ReviewCount--->
						<div class="col-xs-5">
                            <div id="ReviewCount" style="margin: 0px 0px 0px -27px; height: 70px; padding-bottom:-30px;"></div>
                        </div>
						<div class="col-xs-7 row">
							<div class="SmallDarkGreyHeader"><span class="PositiveSentimentCount" id="positiveReview"></span>&nbsp;  Positive</div>
							<div class="SmallDarkGreyHeader"><span class="NeutralSentimentCount" id="neutralReview"></span>&nbsp;Neutral</div>
							<div class="SmallDarkGreyHeader"><span class="NegativeSentimentCount" id="negativeReview"></span>&nbsp;Negative</div>
                        </div>
                    </div>
                    
                    <!-- Rajesh End -->
                    
					<div class="SummaryTotalReferences row"><!------/.Organization Total References----->
						<div class="SmallDarkGreyHeader">Total Reference(s)</div>
						<div id="totalReferences"></div>
                    </div>
					<div class="SummaryTotalSentimence row"><!------/.Organization Total Sentimence----->
						<div class="col-xs-5">
                            <div id="SentimentCount" style="margin: 0px 0px 0px -27px; height: 70px; padding-bottom:-30px;"></div>
                        </div>
						<div class="col-xs-7 row">
							<div class="SmallDarkGreyHeader"><span class="PositiveSentimentCount" id="positive"></span>&nbsp;  Positive</div>
							<div class="SmallDarkGreyHeader"><span class="NeutralSentimentCount" id="neutral"></span>&nbsp;Neutral</div>
							<div class="SmallDarkGreyHeader"><span class="NegativeSentimentCount" id="negative"></span>&nbsp;Negative</div>
                        </div>
                    </div>
                </div>
				<!----------- END Ranking, Review-Count, Mentions, Sentimet-Score---------->
				<!----------- Top panel left column---------->
                <div class="col-lg-6 col-md-12">
                    <div class="SummaryTargtAndChange row">
                    <!------Repufact Target and target change----->
						<div class="SummaryTarget col-xs-12">
						<!------Target----->
							<span class="MediumBoldGreyContent">Milestone</span>
						</div>
						<div class="SummaryTarget col-sm-4"><!------Target----->
							<span class="SummaryTarget SmallBoldGreyContent">Target</span>
							<span class="MediumBoldDarkBlueContent" id="targetPercentage"></span>
						</div>
						<div class="SummaryTarget col-sm-4"><!------Target----->
							<span class="SummaryTarget SmallBoldGreyContent">Target Change</span>
							<span class="MediumBoldDarkBlueContent" id="targetChange"></span>
						</div>
						<!-- <div class="SummaryTargetChange col-sm-8">----target change---
								<span class="MediumBoldGreyContent float-left"> &nbsp;Milestone&nbsp;Target&nbsp;Change</span>
								<span id="targetChange"></span>
						</div> -->
						<!-- <div class="">From 18-Jan-2015 To 18-Dec-2015</div> -->
						<div class="SmallDarkGreyHeader col-xs-12">
							<span class="SmallDarkGreyHeader" id="targetFromDate">From &nbsp;</span>
							<span class="SmallDarkGreyHeader" id="targetToDate">To &nbsp;</span>
						</div>
                    </div><!------END Repufact Target and target change----->
					
					<div class="SummaryKPISource row"><!------KPI and Sources----->
						<div class="SummaryKPI col-sm-4">
							<div class="SmallBoldGreyContent">KPI(s)</div>
							<div id="kpiPolarities" style="display: :none;" class="LightGreyColor SummaryScoreForKPI"><!------KPI----->
								<div class="SmallDarkGreyHeader col-xs-12"></div>
							</div>
						</div>
							
						<div class="SummarySources col-sm-8 row"><!------Source----->
							<div class="MediumBoldGreyContent">Source(s)</div>
							<div class="LightGreyColor row">
								
								<div class="col-sm-6">
									<div class="SmallBoldGreyContent">Target Source</div>
									<div id="tradeSourceData">
										<div class="SmallDarkGreyHeader"></div>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="SmallBoldGreyContent">Social Source</div>
									<div id="socialMentionsData">
										<div class="SmallDarkGreyHeader"></div>
									</div>
								</div>
							</div>
						</div>
                    </div>
                </div>
				<!----------- END Top panel left column--------->
            </div>
            <!-------------------------- End Overall Organization Scoreboard ----------------------------------->
			<div class="row lineShadawSeperation"></div>
			
			<!-------------------------- /Summary Department Factor----------------------------------->
			<h2 class="topic-header">Department Score(s)</h2>
             <div class="row" id="departmentKPIFactor" style="display: none;"> 
				
				<!----------- /.Department 1-------------->
                <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 SummaryDepartmentFactor">
                    <div class="panel">
                        <div class="panel-body" >
                        <div class="row">
								<div class="LargeMediumBoldGreyContent center_align"></div>
							</div>
							<div class="row">
								<div class="LightGreyColor SummaryDepartmentrepufact center_align">
									<div class="row Repufactlogo">     
										<div class="Departmentfactorpercentage"><div style="font-size: 14px;">Department Score</div></div>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="SmallBoldGreyContent col-xs-8"></div>
								<div class="col-xs-4"><span class="DepartmentfactorChangeLeft NegativeChange"></span></div>
							</div>
							<div class="row">
								<div class="SmallBoldGreyContent col-xs-8">Target</div>
								<div class="col-xs-4 text-right"><span class="MediumBoldDarkBlueContent" style="margin-right:0px"></span></div>
								<div class="SmallDarkGreyHeader col-xs-12"></div>
							</div>
							<div class="row">
								<div class="SmallBoldGreyContent col-xs-8">Competition Ranking</div>
								<div class="col-xs-4 text-right">
									<span class="MediumBoldDarkBlueContent"></span>
									<sup class="SmallDarkGreyHeader"></sup>
								</div>
							</div>
							<div class="row">
								<div class="SmallBoldGreyContent col-xs-8"></div>
								<div class="col-xs-4 text-right">
									<span class="MediumLightDarkBlueContent"></span>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-5">
									<div id="SentimentCountDep" style="margin: -10px 0px 0px -4px; height: 70px; padding-bottom:-30px;"></div>
								</div>
								<div class="col-xs-7 text-right">
									<div class="SmallDarkGreyHeader"><span class="PositiveSentimentCount"></span>&nbsp; Positive</div>
									<div class="SmallDarkGreyHeader"><span class="NeutralSentimentCount"></span>&nbsp; Neutral</div>
									<div class="SmallDarkGreyHeader"><span class="NegativeSentimentCount"></span> &nbsp; Negative</div>
								</div>
							</div>
							<div class="col-xs-12">
								<div class="SmallBoldGreyContent">KPI(s)</div>
									<div class="SmallDarkGreyHeader"></div>
									<div class="SmallDarkGreyHeader"></div>
									<div class="SmallDarkGreyHeader"></div>
									<div class="SmallDarkGreyHeader"></div>
									<div class="SmallDarkGreyHeader"></div>
							</div>
                        </div>
                        <!-- END.panel-body -->
					</div>
					<!-- /.row -->
				</div>
				<!-----------END Department 1-------------->
                
			</div>
			<!-------------------------- /Summary Department Factor----------------------------------->
			
	</div>
	</div>
<!-------------------------- /.END Sources----------------------------------->
				
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
	
	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
    <!-- Script For Dashboard -->	
    <script src="<%= request.getContextPath() %>/resources/js/reviewAnalysisSummary.js"></script>	
    <script src="<%= request.getContextPath() %>/resources/js/util.js"></script>	
    
    <script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
    
    <script src="<%=request.getContextPath()%>/resources/js/datePickerCommon.js"></script>
    

	<!-- Script For Date Picker -->	
	<script>
		$( document ).ready(function() {
			 $( "#from" ).datepicker({
			  defaultDate: "+1w",
			  changeMonth: true,
			  numberOfMonths: 1,
			  onClose: function( selectedDate ) {
				$( "#to" ).datepicker( "option", "minDate", selectedDate );
			  }
			});
			$( "#to" ).datepicker({
			  defaultDate: "+1w",
			  changeMonth: true,
			  numberOfMonths: 1,
			  onClose: function( selectedDate ) {
				$( "#from" ).datepicker( "option", "maxDate", selectedDate );
			  }
			});
		});
	</script>
	
	
	<!--------------- Charts for Review Count-------------------------->
<!-- 	<script>
	$(function () {
    $('#ReviewCount').highcharts({
		credits: {
			enabled: false
		},
        chart: {
			backgroundColor: 'transparent',
            type: 'area',
			showPrintMenuItem:'0',
			style: {
                    overflow: 'visible'
                },
                skipClone: true
        },
		colors: ['#98a4b4', '#98a4b4'],
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
            labels: {
				enabled: false,
                formatter: function () {
                    return this.value; // clean, unformatted number for days
                }
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
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: <b>{point.y:.2f}</b>'
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 1,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
			showInLegend: false,   
            name: 'Review per day',
            data: [    
                 [Date.UTC(1970,  9, 18), 0   ],
                [Date.UTC(1970,  9, 26), 0.2 ],
                [Date.UTC(1970, 11,  1), 0.47],
                [Date.UTC(1970, 11, 11), 0.55],
                [Date.UTC(1970, 11, 25), 1.38],
                [Date.UTC(1971,  0,  8), 1.38],
                [Date.UTC(1971,  0, 15), 1.38],
                [Date.UTC(1971,  1,  1), 1.38],
                [Date.UTC(1971,  1,  8), 1.48],
                [Date.UTC(1971,  1, 21), 1.5 ],
                [Date.UTC(1971,  2, 12), 1.89],
                [Date.UTC(1971,  2, 25), 2.0 ],
                [Date.UTC(1971,  3,  4), 1.94],
                [Date.UTC(1971,  3,  9), 1.91],
                [Date.UTC(1971,  3, 13), 1.75],
                [Date.UTC(1971,  3, 19), 1.6 ],
                [Date.UTC(1971,  4, 25), 1.94],
                [Date.UTC(1971,  4, 31), 1.89],
                [Date.UTC(1971,  5,  7), 1.4] 
            ]
        }],
		navigation: {			
            buttonOptions: {
                enabled: false
            }
        } 
    });
});
</script> -->
<script>
$(function () {
    $('#ReviewCount').highcharts({
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
                ['Positive', 23.7],
                ['Neutral', 16.1],
                ['Negative', 14.2],
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
	<!---------------------- Charts for SentimentCount--------------------------->
<script>
	$(function () {
    $('#SentimentCount').highcharts({
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
                ['Positive', 23.7],
                ['Neutral', 16.1],
                ['Negative', 14.2],
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
	
	
	<!--------------- Charts for Department Claculation-------------------------->
	<script>
	$(function () {
    $('#DepartmentCalcualtionChart').highcharts({
		credits: {
			enabled: false
		},
        chart: {
			backgroundColor: 'transparent',
            type: 'area',
			showPrintMenuItem:'0',
			style: {
                    overflow: 'visible'
                },
                skipClone: true
        },
		colors: ['#16a9e8', '#98a4b4'],
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
            labels: {
				enabled: false,
                formatter: function () {
                    return this.value; // clean, unformatted number for days
                }
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
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: <b>{point.y:.2f}</b>'
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 1,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
			showInLegend: false,   
            name: 'Review per day',
            data: [    <!--Data-->
                [Date.UTC(1970,  9, 18), 0   ],
                [Date.UTC(1970,  9, 26), 0.2 ],
                [Date.UTC(1970, 11,  1), 0.47],
                [Date.UTC(1970, 11, 11), 0.55],
                [Date.UTC(1970, 11, 25), 1.38],
                [Date.UTC(1971,  0,  8), 1.38],
                [Date.UTC(1971,  0, 15), 1.38],
                [Date.UTC(1971,  1,  1), 1.38],
                [Date.UTC(1971,  1,  8), 1.48],
                [Date.UTC(1971,  1, 21), 1.5 ],
                [Date.UTC(1971,  2, 12), 1.89],
                [Date.UTC(1971,  2, 25), 2.0 ],
                [Date.UTC(1971,  3,  4), 1.94],
                [Date.UTC(1971,  3,  9), 1.91],
                [Date.UTC(1971,  3, 13), 1.75],
                [Date.UTC(1971,  3, 19), 1.6 ],
                [Date.UTC(1971,  4, 25), 1.94],
                [Date.UTC(1971,  4, 31), 1.89],
                [Date.UTC(1971,  5,  7), 1.4]
            ]
        }],
		navigation: {			
            buttonOptions: {
                enabled: false
            }
        } 
    });
});
</script>

<!--------------- Charts for Social Mentions-------------------------->
<script>
$(function () {
    $('#SocialMentions').highcharts({
		credits: {
			enabled: false
		},
        chart: {
			backgroundColor: 'transparent',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Social Mentions',
            data: [
                ['Facebook ',   45.0],
                ['Twitter',       26.8],
                {
                    name: 'FourSquare',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Google Plus',    8.5],
                ['LinkedIn',     6.2],
                ['Others',   0.7]
            ]
        }],
		navigation: {		
            buttonOptions: {
                enabled: false
            }
        } 
    });
});
</script>
<!--------------- Charts for Trage Source-------------------------->
<script>
$(function () {
    $('#TradeSource').highcharts({
		credits: {
			enabled: false
		},
        chart: {
			backgroundColor: 'transparent',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
		borderColor: '#ff0000',
		borderWidth: 2,
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
				borderWidth: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Trade Sources',
            data: [
                ['Tripadvisor ',   45.0],
                ['Yatra',       26.8],
                {
                    name: 'Travel Guru',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['MakemyTrip',    8.5],
                ['HolidayIQ',     6.2],
                ['Others',   0.7]
            ]
        }],
		navigation: {
            buttonOptions: {
                enabled: false
            }
        } 
    });
});
</script>
</body>
</html>
