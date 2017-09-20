<%@include file="includeTagLibs.jsp"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<sec:authentication var="user" property="principal" />
<!DOCTYPE html>
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
	<link
	href="<%=request.getContextPath()%>/resources/jquery-ui/jquery.qtip.css"
	rel="stylesheet">

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
<style>
.tooltiptext{
    display: none;
}
</style>
</head>

<body ng-app="clientDashBoard">

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
					<h1 class="page-header">Dashboard</h1>
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
			<!-------------------------- /.row TOP Pannel ----------------------------------->
			<div class="row">
				<!---------------------- /.Repufactor Pannel ---------------------->
				<div class="col-lg-4 col-md-12">
					<div class="panel DarkBlue">
					
						<div class="panel-heading">
						<!-- <div >Sample link</div>
						<div class="tooltiptext" style="dispay:none">Complex <b>inline</b> <i>HTML</i> in your <u>config</u></div> -->
							<div id="dashboardSentimentFinder" class="row">
							
								<div id="polarityDiv" class="col-xs-12">
								<div class="rsiHeading">Rating Score Index</div>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-9">
									<div id="repufactorDiv" id="DashboardRepufactorPercentageScore" class="DashboardRepufactorPercentage">
										<div class="col-xs-3 DashboardRepufactorChange text-right">
										<div class="row SmallWhiteHeader"></div>
										<div  class="row">
											<div id="repufactChange">
											<span></span>
											</div>
										</div>
                                </div>
									</div>

									<!-- Modal -->
									<div class="modal fade" id="myModalRepufactor" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabelRepufactor"
										aria-hidden="true">
										<div class="modal-dialog modal-md">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal">
														<span aria-hidden="true">&times;</span><span
															class="sr-only">Close</span>
													</button>
													<h4 class="modal-title" id="myModalLabel">Rating Score Index
														Analysis</h4>
												</div>
												<div class="modal-body modal-md" style="margin-left:-1px; padding:0px;">
												 <button id="previousRepufactorChartDiv" class="chartPreviousBtn" style="margin-left:-1px;" onclick="previousRepuFactorData()" ></button> 
													<div id="repufactorVStime" style="height: auto; margin: 0 auto"></div>
            										<button id="nextRepufactorChartDiv" class="chartNextBtn" onclick="nextRepuFactorData()"></button>
												</div>
											</div>
										</div>
									</div>
									<div class="modal fade" id="socialMentionsModal" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabel"
										aria-hidden="true">
									</div>
								</div>
								<div class="col-xs-3 DashboardRepufactorChange text-right">
									<div class="row SmallWhiteHeader">Change</div>
									<div class="row">
									<div id="repufactChange">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!---------------------- /.End of Repufactor Pannel --------------->


				<!---------------------- /.ReviewCount Pannel --------------->
			<div id="reviewCountPopupDiv">
			
				<div id="helpTooltip" class="col-lg-4 col-md-6">
					<div  class="panel LightBlue cursorPointer">
						<div class="panel-heading">
							<div class="row">
								<div class="col-xs-6">
									<div class="col-xs-12 ReiviewCountHeader row" id="reviewCountDiv">Reviews
									<span id="reviewsId" class="fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 5px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>
									<div class="tooltiptext">
									<ul class="leftPad">
									  <li>Total review volume for the selected date range</li>
									  <li>Hotel References mentioned from all review sources</li>
									  <li>Change percentage between current selected reviews & previous same period</li>
									</ul></div>
									</div>
									<div id="totalReviewCount" class="col-xs-12 ReiviewCountResult row"></div>
								</div>
								<div class="col-xs-6 text-right">
									<div class="row SmallWhiteHeader">Total References</div>
									<div class="row">
										<span id="totalReferenceValue"></span>
									</div>
								</div>
							</div>
						</div>
						<div class="panel-heading">
							<div class="row ReviewCountGraph">
								<div class="col-xs-9">
									<div id="reviewCount" style="margin: 0 auto; height:90px; padding-bottom:-30px;"></div>
								</div>
								<div class="col-xs-3 text-right">
									<div class="row SmallWhiteHeader">Change</div>
									<div class="row">
										<div id="changeReviewCount">
										<span id="reviewCountChange"></span></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
				</div>
					<!-- <div class="tooltiptext">
						<ul>
						  <li>The total number of references are segregated for each sentiments polarity and are shown with the respective colors.</li>
						</ul><!--- </ul>  Complex <b>inline</b> <i>HTML</i> in your <u>config</u>
						</div> --> 
			</div>
				<!---------------------- /.END ReviewCount Pannel -------------



				<!---------------------- /.Sentiment Count-------------------->
				<div class="col-lg-4 col-md-6">
					<div id="helpTooltip1" class="panel LightGreyColor">
						<div class="panel-heading">
							<div class="row">
								<div class="col-xs-5">
									<div class="col-xs-12 row ReiviewSentimentHeader">Sentiment 
									<span id="sentimentId" class="fa-stack" style="" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>
									
									<div class="tooltiptext">
										 References as segregated by sentiment polarity using KePSLA&#39;s proprietary engine  
									</div></div>
									<div class="row ReiviewSentimentCounts">
										<div class="col-xs-12" id="possitiveSentimentDiv">
											Positive  <span class="PositiveSentimentCount" id="possitive">
											</span>
										</div>
										<div class="col-xs-12" id="neutralSentimentDiv">
											Neutral  <span class="NeutralSentimentCount" id="neutral">
											</span>
										</div>
										<div class="col-xs-12" id="negativeSentimentDiv">
											Negative  <span class="NegativeSentimentCount" id="negative">
											</span>
										</div>
									</div>
								</div>
								<div class="col-xs-7 text-right">
									
                                    <div id="SentimentCount" style="margin: 0 auto; height:120px; padding-bottom:-30px;"></div>
                                    
								</div>
							</div>
						</div>
					</div>
									
				</div>
				<!---------------------- /.END Sentiment Count--------------->
			</div>
			<!-------------------------- /.END row TOP Pannel ----------------------------------->

			<!--   Alert dash board for the Reply to review -->
			<c:if test="${user.username=='sales@repufact.com' || user.username=='operations@repufact.com'}">
				<div class="row">
	                <div class="col-lg-12 SubHeading">
	                <label class="reply2reviewsAlerts"> Reply to Review Alerts </label>
	                </div>
	                <!-- /.col-lg-12 -->
	            </div>
	
				<div class="row" ng-controller="dashboardController">
	
					<div class="col-lg-4 col-md-12" >
						<div class="panel LightGreen">
							<div class="panel-heading">
								<div id="processedReviews" class="row">
									<div id="polarityDiv" class="col-xs-12">
										<div class="rsiHeading">Processed</div>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-9">
										<div id="totalProcessedReviews" class="DashboardAlerts"></div>
	
										<!-- Modal -->
	
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-md-6" ng-click="showpopup()">
						<div class="panel DarkRed">
							<div class="panel-heading">
								<div id="failedReviews" class="row">
									<div id="polarityDiv" class="col-xs-12">
										<div class="rsiHeading">Failed</div>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-9">
										<div id="totalFailedReviews" class="DashboardAlerts"></div>
	
										<!-- Modal -->
	
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-md-6">
						<div class="panel DarkYellow">
							<div class="panel-heading">
								<div id="retryReviews" class="row">
									<div id="polarityDiv" class="col-xs-12">
										<div class="rsiHeading">Retry</div>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-9">
										<div id="totalRetryReviews" class="DashboardAlerts"></div>
	
										<!-- Modal -->
	
									</div>
								</div>
							</div>
						</div>
					</div>
					<!---------------------- /.END Sentiment Count--------------->
					<div id="alertdashmodal" class="modal fade RespondToReviews in"
						tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
						aria-hidden="false">
						<div class="modal-dialog modal-lg">
							<div class="modal-content">
								<div class="modal-header">
									<button aria-label="Close" data-dismiss="modal" class="close"
										type="button">
										<span aria-hidden="true">x</span>
									</button>
									<h4 id="respondModalLabel_581472" class="modal-title">Failed Queue Items</h4>
									
								</div>
								<div class="modal-body row">
									<div class="row col-xs-12 SingleReviewList">
										<div class="col-xs-12 col-sm-9 col-lg-12">
											<div class="table-responsive">
												<table class="table borderless" ng-if ="showmodal">
													<thead>
														<tr>
															<th ng-repeat="header in apiKeyHeaders">{{header}}</th>
														</tr>
													</thead>
													<tbody>
														<tr ng-repeat="failedItem in failedItems">
															<td>{{failedItem.sourceName}}</td>
															<td>{{failedItem.reviewId}}</td>
															<td>{{failedItem.reviewSubject}}</td>
															<td>{{failedItem.reviewText}}</td>
															<td>{{failedItem.reviewReplyText}}</td>
															<td>{{failedItem.failedReason}}</td>
															<td>{{failedItem.exceptionStackTrace}}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</c:if>

			<!--end of    Alert dash board for the Reply to review -->

			<!-------------------------- /.row Department Factor & KPI----------------------------------->
			<div class="row">
				<!----------- /.Department Factor-------------->
				<div id="helpTooltip2" class="col-lg-8 col-md-12">
					<div class="panel panel-default">
						<div class="panel-heading">Department Score
							<span id="deptScoreId" class="fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 5px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>
								<div class="tooltiptext">
									Top 5 departments score & the trend change for the selected date range
								</div>		
						</div>
						<!-- END panel-heading -->
						<div class="panel-body" id="departmentFactors" style="display: none;">
							<div class="col-xs-12 DashboardDepartmentRow">
								
							</div>
							<!-- END Department 1 -->
						</div>
						<!-- END.panel-body -->
						<div class="panel-footer">
							<a href="../reviewKpiAndDepartment/showReviewKpiAndDepartment.htm">view all</a>
						</div>
					</div>
					<!-- /.row -->
				</div>
				
				<!----------- /.END Department Factor-------------->
				
				<!---------------------------- /Test---------------------------------------------------->				
				  <div id="kpiPopup">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            KPI
                            
                            
                        </div>
                        <div class="panel-body">
						<div class="col-xs-12 DashboardKPIReport" id="KPITEST" style="min-width: 310px; max-width: 800px; height: 260px; margin: 0 auto"></div>
						</div>
						<div class="panel-footer"><a href="../reviewKpiAndDepartment/showReviewKpiAndDepartment.htm">view all</a></div>
					</div>
				</div> 
			</div>
<!---------------------------- /Test---------------------------------------------------->
				
				
				
				<!----------- /.KPI-------------->
			<!-- 	<div class="col-lg-4 col-md-12">
					<div class="panel panel-default">
						<div class="panel-heading">KPI</div>
						<div class="panel-body" id="kpiPolarities" style="display: :none;">
							<div class="col-xs-12 DashboardKPIReport">
								<div class="col-lg-6 col-xs-12">
									<span>Location</span>
								</div>
								<div class="col-lg-6 col-xs-12">
									<div class="row">
										<div class="PositiveSentimentCount" id="positivePolarityCount"></div>
										<div class="NeutralSentimentCount" id="neutralPolarityCount"></div>
										<div class="NegativeSentimentCount" id="negativePolarityCount"></div>
									</div>
									<div class="col-xs-7 row">
										<div data-sparkline="70, 20, 10; bar" style="height:50px; margin-left: 0; margin-right: 0; padding: 0; margin-bottom: -10px;"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="panel-footer">
							<a>view all</a>
						</div>
					</div>
				</div>
			</div> -->
	<!----------- END KPI-------------->
			
			
			<!-------------------------- /.row Competitor Factor ----------------------------------->
			<div class="row">
				<div class="col-lg-12">
					<div class="panel panel-default">
						<div class="panel-heading">Competitor Score 
						 <span id="competitorScoreId" class="fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 5px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>
							<div class="tooltiptext">
									Competitor ranking & scores
								</div>	
						</div>
						<!-- /.panel-heading -->
						<div class="panel-body" id="competitorList">
							<!-- <div class="col-lg-6 col-md-12">
								<div class="DashboardCompetitor DashboardCompetitorRank1 SelectedOrganizationRank">
									<div class="row" id="competitor"></div>
									<div class="row SmallDarkGreyHeader">Rank Change <span class="PositiveChange" id="competitorChange"></span></div>
									<div class="DashboardCompetitorFactorScore text-right" id="competitorRepufactorScore"></div>
								</div>
							</div> -->
						</div>
					</div>
					<!-- /.panel-body -->
				</div>
				<!-- /.row -->
			</div>

			<!-------------------------- /.END Competitor Factor----------------------------------->

			<div class="row">
				<div class="col-lg-12">
					<div class="panel panel-default" id="sourceData">
						<div class="panel-heading">Sources</div>
						<div class="panel-body">
							<a class="col-xs-12" href="../reviewSitesContent/list.htm">Trade Source
							<span id="reviewSourceId" class="fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 8px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>
							<div class="tooltiptext">
									Volume from all review sources
								</div>	</a>
							<div class="col-lg-4 col-md-12" id="tradeSourceData" style="display: :none;"></div>
							<div class="col-lg-8 col-md-12 col-xs-12" id="TradeSource"></div>
						</div>

						<div class="panel-body">
						<a class="col-xs-12" id="socialData" href="../dashboard/socialMentions.htm">Social Mentions
						<span id="socialMentionsId" class="fa-stack" style="position:absolute;font-size: 9px;margin: 0 0 11px 8px;" data-hasqtip="2" aria-describedby="qtip-2"><i class="fa fa-circle-o fa-stack-2x"></i><i class="fa fa-question fa-stack-1x"></i></span>
							<div class="tooltiptext">
									Number & source of Public mentions in Social Media
								</div>	</a>
							<div class="col-lg-4 col-md-12" id="socialMentionData" style="display: :none;"></div>
							<div class="col-lg-8 col-md-12 col-xs-12" id="SocialMentions" style="display: :none;"></div>
						</div>
						<!-- /Social Mentions -->
				</div>
				</div>
			</div>
			<!-------------------------- /.END Sources----------------------------------->


		</div>
	</div>
	</div>

<!-------------------------- Review Count Modal----------------------------------->	 
                             
                               <!-- Modal -->
									<div class="modal fade" id="myModalReviewCount" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabelReviewCount"
										aria-hidden="true">
										<div class="modal-dialog modal-md">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal">
														<span aria-hidden="true">&times;</span><span
															class="sr-only">Close</span>
													</button>
													<h4 class="modal-title" id="myModalLabel">Rating Score Index
														Analysis</h4>
												</div>
												<div class="modal-body modal-md" style="margin-left:-1px; padding:0px;">
												 <button id="previousReviewCountChartDiv" class="chartPreviousBtn" style="margin-left:-1px;" onclick="previousReviewCountData()" ></button> 
													<div id="reviewCountVStime" style="height: auto; margin: 0 auto"></div>
            										<button id="nextReviewCountChartDiv" class="chartNextBtn" onclick="nextReviewCountData()"></button>
												</div>
											</div>
										</div>
									</div>

	<!-------------------------- /.END Sources----------------------------------->
	
	

<!-------------------------- Positive Count Modal----------------------------------->	 
                             
                               <!-- Modal -->
									<div class="modal fade" id="myModalPositiveCount" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabelPositiveCount"
										aria-hidden="true">
										<div class="modal-dialog modal-md">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal">
														<span aria-hidden="true">&times;</span><span
															class="sr-only">Close</span>
													</button>
													<h4 class="modal-title" id="myModalLabelPositive">Repufactor
														Analysis</h4>
												</div>
												<div class="modal-body modal-md" style="margin-left:-1px; padding:0px;">
												 <button id="previousPositiveCountChartDiv" class="chartPreviousBtn" style="margin-left:-1px;" onclick="previousPositiveCountData()" ></button> 
													<div id="positiveCountVStime" style="height: auto; margin: 0 auto"></div>
            										<button id="nextPositiveCountChartDiv" class="chartNextBtn" onclick="nextPositiveCountData()"></button>
												</div>
											</div>
										</div>
									</div>

	<!-------------------------- /.END Sources----------------------------------->
	
	
	
<!-------------------------- Negative Count Modal----------------------------------->	 
                             
                               <!-- Modal -->
									<div class="modal fade" id="myModalNegativeCount" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabelNegativeCount"
										aria-hidden="true">
										<div class="modal-dialog modal-md">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal">
														<span aria-hidden="true">&times;</span><span
															class="sr-only">Close</span>
													</button>
													<h4 class="modal-title" id="myModalLabelNegative">Repufactor
														Analysis</h4>
												</div>
												<div class="modal-body modal-md" style="margin-left:-1px; padding:0px;">
												 <button id="previousNegativeCountChartDiv" class="chartPreviousBtn" style="margin-left:-1px;" onclick="previousNegativeCountData()" ></button> 
													<div id="negativeCountVStime" style="height: auto; margin: 0 auto"></div>
            										<button id="nextNegativeCountChartDiv" class="chartNextBtn" onclick="nextNegativeCountData()"></button>
												</div>
											</div>
										</div>
									</div>

	<!-------------------------- /.END Sources----------------------------------->
	
	
<!-------------------------- Neutral Count Modal----------------------------------->	 
                             
                               <!-- Modal -->
									<div class="modal fade" id="myModalNeutralCount" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabelNeutralCount"
										aria-hidden="true">
										<div class="modal-dialog modal-md">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal">
														<span aria-hidden="true">&times;</span><span
															class="sr-only">Close</span>
													</button>
													<h4 class="modal-title" id="myModalLabelNeutral">Repufactor
														Analysis</h4>
												</div>
												<div class="modal-body modal-md" style="margin-left:-1px; padding:0px;">
												 <button id="previousNeutralCountChartDiv" class="chartPreviousBtn" style="margin-left:-1px;" onclick="previousNeutralCountData()" ></button> 
													<div id="neutralCountVStime" style="height: auto; margin: 0 auto"></div>
            										<button id="nextNeutralCountChartDiv" class="chartNextBtn" onclick="nextNeutralCountData()"></button>
												</div>
											</div>
										</div>
									</div>

	<!-------------------------- /.END Sources----------------------------------->
	
	<!-------------------------- Source Count Modal----------------------------------->	 
                             
                               <!-- Modal -->
									<div class="modal fade" id="myModalTradeSource" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabelTradeSource"
										aria-hidden="true">
										<div class="modal-dialog modal-md">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal">
														<span aria-hidden="true">&times;</span><span
															class="sr-only">Close</span>
													</button>
													<h4 class="modal-title" id="myModalLabelTradeSource">Repufactor
														Analysis</h4>
												</div>
												<div class="modal-body modal-md" style="margin-left:-1px; padding:0px;">
												 <button id="previousTradeSourceCountChartDiv" class="chartPreviousBtn" style="margin-left:-1px;" onclick="previousTradeSourceCountData()" ></button> 
													<div id="repufactorVStimeTradeSource" style="height: auto; margin: 0 auto"></div>
            										<button id="nextTradeSourceCountChartDiv" class="chartNextBtn" onclick="nextTradeSourceCountData()"></button>
												</div>
											</div>
										</div>
									</div>

	<!-------------------------- /.END Sources----------------------------------->
	
	<!-------------------------- Social Mention Modal----------------------------------->	 
                             
                               <!-- Modal -->
									<div class="modal fade" id="myModalSocialMention" tabindex="-1"
										role="dialog" aria-labelledby="myModalLabelSocialMention"
										aria-hidden="true">
										<div class="modal-dialog modal-md">
											<div class="modal-content">
												<div class="modal-header">
													<button type="button" class="close" data-dismiss="modal">
														<span aria-hidden="true">&times;</span><span
															class="sr-only">Close</span>
													</button>
													<h4 class="modal-title" id="myModalLabelSocialMention">Repufactor
														Analysis</h4>
												</div>
												<div class="modal-body modal-md" style="margin-left:-1px; padding:0px;">
												 <button id="previousSocialMentionCountChartDiv" class="chartPreviousBtn" style="margin-left:-1px;" onclick="previousSocialMentionCountData()" ></button> 
													<div id="repufactorVStimeSocialMention" style="height: auto; margin: 0 auto"></div>
            										<button id="nextSocialMentionCountChartDiv" class="chartNextBtn" onclick="nextSocialMentionCountData()"></button>
												</div>
											</div>
										</div>
									</div>

	<!-------------------------- /.END Sources----------------------------------->
	
	
	<script src="<%=request.getContextPath()%>/resources/angular/angular.min.js"></script>

	<!-- jQuery Version 1.11.0 -->
	<script
		src="<%=request.getContextPath()%>/resources/jquery/jquery-1.11.0.min.js"></script>

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
		src="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.min.js"></script>

	<!-- Charts-->
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/highcharts.js"></script>
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/exporting.js"></script>

	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	
	<!-- Script For Dashboard -->
	<script src="<%=request.getContextPath()%>/resources/js/dashboard.js"></script>
	
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/js/util.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/js/datePickerCommon.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/js/dashboardCtrl.js"></script>

	<!--Start of Tawk.to Script-->
	<script type="text/javascript">
		var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
		(function(){
			var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
			s1.async=true;
			s1.src='https://embed.tawk.to/58eb702330ab263079b5f2ea/default';
			s1.charset='UTF-8';
			s1.setAttribute('crossorigin','*');
			s0.parentNode.insertBefore(s1,s0);
		})();
	</script>
	<!--End of Tawk.to Script-->

	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.qtip.js"></script>
	<script>
	$(document).ready(function() {
		
		   
		   $('#reviewsId').each(function() {
		         $(this).qtip({
		             content: {
		                 text: $(this).next('.tooltiptext')
		             },
		          position: {
		        	  my: 'bottom center',  
			          at: 'top center', 
		             target: $('#reviewsId') // my target
		         },
		         style: {
		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
		         }
		         });
		     });
		   
		   $('#sentimentId').each(function() {
		         $(this).qtip({
		             content: {
		                 text: $(this).next('.tooltiptext')
		             },
		          position: {
		        	  my: 'bottom center',  
			          at: 'top center', 
		             target: $('#sentimentId') // my target
		         },
		         style: {
		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
		         }
		         });
		     });
		   
		   $('#deptScoreId').each(function() {
		         $(this).qtip({
		             content: {
		                 text: $(this).next('.tooltiptext')
		             },
		          position: {
		        	  my: 'bottom center',  
			          at: 'top center', 
		             target: $('#deptScoreId') // my target
		         },
		         style: {
		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
		         }
		         });
		     });
		   $('#kpiId').each(function() {
		         $(this).qtip({
		             content: {
		                 text: $(this).next('.tooltiptext')
		             },
		          position: {
		        	  my: 'bottom center',  
			          at: 'top center', 
		             target: $('#kpiId') // my target
		         },
		         style: {
		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
		         }
		         });
		     });
		   $('#competitorScoreId').each(function() {
		         $(this).qtip({
		             content: {
		                 text: $(this).next('.tooltiptext')
		             },
		          position: {
		        	  my: 'bottom center',  
			          at: 'top center', 
		             target: $('#competitorScoreId') // my target
		         },
		         style: {
		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
		         }
		         });
		     });
		   $('#reviewSourceId').each(function() {
		         $(this).qtip({
		             content: {
		                 text: $(this).next('.tooltiptext')
		             },
		          position: {
		        	  my: 'bottom center',  
			          at: 'top center', 
		             target: $('#reviewSourceId') // my target
		         },
		         style: {
		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
		         }
		         });
		     });
		   $('#socialMentionsId').each(function() {
		         $(this).qtip({
		             content: {
		                 text: $(this).next('.tooltiptext')
		             },
		          position: {
		        	  my: 'bottom center',  
			          at: 'top center', 
		             target: $('#socialMentionsId') // my target
		         },
		         style: {
		             classes: 'qtip-bootstrap qtip-shadow riHelpTooltip',
		         }
		         });
		     });
		   
		   
		   
		   
	});
	</script>

</body>

</html>



