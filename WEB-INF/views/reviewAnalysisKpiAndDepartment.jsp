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
   <title><spring:message code="label.kpi.department" /></title>
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

<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5W4FN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
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
                    <h1 class="page-header">KPI & Department</h1>
                </div>
                <!-- /.col-lg-12 -->
            </div>
			<div class="row">
                <div class="col-lg-12 SubHeading">
				An analytical review on KPI and departments.
                </div>
                <!-- /.col-lg-12 -->
            </div>
			
	<!-------------------------------------------->
	<!------------ Department Top ---------------->
	<!-------------------------------------------->
	<div class="row KPIDepartmentFactorTop">
		<h2 class="topic-header">Department Score</h2>
		
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
		    <div class="VerySmallGreyContent">Total Review(s)</div>
		    <div class="MediumBoldGreyContent" id="reviewTotalCount"></div>	
		</div>
		
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Trend Change
				<div>
				<span id="targetChangeValue"></span>
				</div>
			</div>
		</div>			
	
	<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Total References
			</div>
			<div>
			  <span id="totalReferencesCount" class="NoChangeLeftAlign"></span>
			</div>
   </div>
						
	<div class="col-xs-12 col-md-offset-1 col-md-5 SmallDarkGreyHeader">
		<div class="HappyCountIcon col-xs-4">
			<div id="positive" class="VerySmallGreyContent">							
			</div>
				<div class="VerySmallBoldGreyContent" id="positiveDepartmentPercentageCount">
				</div>
			</div>
			
       <div class="NormalCountIcon col-xs-4">
				<div  id="neutral" class="VerySmallGreyContent">
				</div>
				<div class="VerySmallBoldGreyContent" id="neutralDepartmentPercentageCount">
					
				</div>	
       </div>
			
			<div class="SadCountIcon col-xs-4">
				<div  id="negative" class="VerySmallGreyContent">
				</div>
				<div class="VerySmallBoldGreyContent" id="negativeDepartmentPercentageCount">
					
				</div>
			</div>
			</div>
	</div>
	<!-------------------------------------------->
	<!--------- END Department Top --------------->
	<!-------------------------------------------->
			
			
   <!-------------------------------------------->
	<!------------ Department Chart -------------->
	<!-------------------------------------------->
	<div class="row">
		<div class="chartBox col-xs-12">
			 <button id="previousChartDiv" class="chartPreviousBtn" onclick="previousDepartmentFactor()" ></button> 
			<div id="departmentFactorChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
            
            <button id="nextChartDiv" class="chartNextBtn" onclick="nextDepartmentFactor()"></button>
		</div>
    </div>
	<!-------------------------------------------->
	<!---------- END Department Chart ------------>
	<!-------------------------------------------->
			
  
  	<!-------------------------------------------->
	<!---------------- Department Factor --------->
	<!-------------------------------------------->
	<div class="row">
		<div class="panel panel-default KPIDepartmentFactorTable">
			<div class="panel-heading"> Department Score</div>
			<div class="hidden-xs hidden-sm panel-body KPIDepartmentFactorTableTopics">
				<div class="row">
					<div class="col-xs-12 col-md-2">
						Department
					</div>
					<div class="col-xs-12 col-md-1">
						References 
					</div>
					<div class="col-xs-12 col-md-4 center_align">
						Sentiments
					</div>
					<div class="col-xs-12 col-md-1">
						Trend Change
					</div>
					<div class="col-xs-12 col-md-2">
						Department Score
					</div>
					<div class="col-xs-12 col-md-1">
						Milestone
					</div>
					<div class="col-xs-12 col-md-1">
						Target Change
					</div>
				</div>
			</div>
			<div id="departmentFactorDivs">
          <div data-toggle="modal" data-target=".DepartmentLightBox">
				<div class="row">
					<div class="col-xs-12 col-md-2">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Department </div>
						<div id="departmentName" class="MediumBoldGreyContent"></div>
					</div>
					<div class="col-xs-12 col-md-1">
						<div class="hidden-md hidden-lg VerySmallGreyContent">References </div>
						<div id="totalReviewReference" class="SmallBoldGreyContent"></div>
					</div>
					<div class="col-xs-12 col-md-4">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Sentiments </div>
						<div class="HappyCountIcon col-xs-4">
							<div id="positive" class="VerySmallGreyContent">
								
							</div>
							<div class="VerySmallBoldGreyContent" >
								
							</div>
						</div>
						<div class="NormalCountIcon col-xs-4">
							<div id="neutral" class="VerySmallGreyContent">
								
							</div>
							<div class="VerySmallBoldGreyContent">
								
							</div>
						</div>	
						<div class="SadCountIcon col-xs-4">
							<div id="negative" class="VerySmallGreyContent">
								
							</div>
							<div class="VerySmallBoldGreyContent">
								
							</div>
						</div>
					</div>
					<div class="col-xs-12 col-md-1">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Trend Change  </div>
						<div>
							<span id="trendChange" ></span>
						</div>
					</div>
					<div class="col-xs-12 col-md-2">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Department Factor  </div>
						<div id="departmentFactor" class="MediumBoldDarkBlueContent"></div>
					</div>
					<div class="col-xs-12 col-md-2">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Milestone</div>
						<div>
						<span id="milestoneSetPercentage" class="MilestoneBlue"></span>
						<span id="milestoneTrajectoryChange" class="NeutralChange"></span>
						</div>
					</div>
				</div>
			</div>
			</div>
			</div>
			</div>
			<!----End Of one Department----->
			
	<!-------------------------------------------->
	<!------------- END Department Factor -------->
	<!-------------------------------------------->
	
	<!--------------------------------------Seperator--------------------------------->
	<div class="row lineShadawSeperation"></div> 
  <!------------------------------------END Seperator------------------------------>
 
			
	<!-------------------------------------------->
	<!----------------- KPI Top ------------------>
	<!-------------------------------------------->
	<div class="row KPIDepartmentFactorTop">
		<h2 class="topic-header">KPI Score</h2>	
		
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">Total Review(s)</div>
			<div id="kpiReviewTotalCount" class="MediumBoldGreyContent"></div>
		</div>

		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Trend Change
				<div>
				<span id="kpiTargetChangeValue"></span>
				</div>
			</div>
		</div>
		
		<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">
			<div class="VerySmallGreyContent">
				Total References
			</div>
			<div>
				<span id="kpiTotalReferencesCount" class="NoChangeLeftAlign"></span>
			</div>
		</div>
		
		<div class="col-xs-12 col-md-offset-1 col-md-5 SmallDarkGreyHeader">
			<div class="HappyCountIcon col-xs-4">
				<div id="kpiPositive" class="VerySmallGreyContent">	
				</div>
				<div  class="VerySmallBoldGreyContent" id="positiveKpiPercentageCount">	
				</div>
			</div>
			
			<div class="NormalCountIcon col-xs-4">
				<div id="kpiNeutral" class="VerySmallGreyContent">
				</div>
				<div class="VerySmallBoldGreyContent" id="neutralKpiPercentageCount">	
				</div>
			</div>
			
			<div class="SadCountIcon col-xs-4">
				<div id="kpiNegative" class="VerySmallGreyContent">	
				</div>
				<div class="VerySmallBoldGreyContent" id="negativeKpiPercentageCount">	
				</div>
			</div>
		</div>	
	</div>
	<!-------------------------------------------->
	<!-------------- END KPI Top ----------------->
	<!-------------------------------------------->
		
		
		
	<!-------------------------------------------->
	<!--------------- KPI Chart ------------------>
	<!-------------------------------------------->
	<div class="row">
		<div class="chartBox col-xs-12">
			 <button id="previousKpiFactorDiv" class="chartPreviousBtn"  onclick="previousKpiFactor()"></button> 
			 <div id="kpiFactorChart" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
            <button id="nextKpiFactorDiv" class="chartNextBtn" onclick="nextKpiFactor()"></button>
		</div>
    </div>
	<!-------------------------------------------->
	<!----------------- END KPI Chart ------------>
	<!-------------------------------------------->	
	
	
	<!-------------------------------------------->
	<!---------------- KPI Factor ---------------->
	<!-------------------------------------------->
	<div class="row">
		<div class="panel panel-default KPIDepartmentFactorTable">
			<div class="panel-heading"> Key Performance Indicator Score</div>
			<div class="hidden-xs hidden-sm panel-body KPIDepartmentFactorTableTopics">
				<div class="row">
					<div class="col-xs-12 col-md-2">
						KPI
					</div>
					<div class="col-xs-12 col-md-1">
						References 
					</div>
					<div class="col-xs-12 col-md-4 center_align">
						Sentiments
					</div>
					<div class="col-xs-12 col-md-1">
						Trend Change
					</div>
					<div class="col-xs-12 col-md-2">
						KPI Score
					</div>
					<div class="col-xs-12 col-md-1">
						Milestone
					</div>
					<div class="col-xs-12 col-md-1">
						Target Change
					</div>
				</div>
			</div>
			<div id="reviewSummaryKpiFactorDiv"  data-toggle="modal" data-target=".KPILightBox">
				<div class="row">
					<div class="col-xs-12 col-md-2">
						<div class="hidden-md hidden-lg VerySmallGreyContent">KPI </div>
						<div id="kpiName" class="MediumBoldGreyContent"></div>
					</div>
					<div class="col-xs-12 col-md-1">
						<div class="hidden-md hidden-lg VerySmallGreyContent">References </div>
						<div id="totalReviewReference" class="SmallBoldGreyContent"></div>
					</div>
					<div class="col-xs-12 col-md-4">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Sentiments </div>
						<div class="HappyCountIcon col-xs-4">
							<div id="kpiPositive" class="VerySmallGreyContent">
							</div>
							<div class="VerySmallBoldGreyContent">
								
							</div>
						</div>
						<div class="NormalCountIcon col-xs-4">
							<div id="kpiNeutral" class="VerySmallGreyContent">
								
							</div>
							<div class="VerySmallBoldGreyContent">
							</div>
						</div>	
						<div class="SadCountIcon col-xs-4">
							<div id="kpiNegative" class="VerySmallGreyContent">
							</div>
							<div class="VerySmallBoldGreyContent">
								
							</div>
						</div>
					</div>
					<div class="col-xs-12 col-md-1">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Trend Change </div>
						<div>
							<span id="trendChange" class="PositiveChangeLeftAlign"></span>
						</div>
					</div>
					<div class="col-xs-12 col-md-2">
						<div class="hidden-md hidden-lg VerySmallGreyContent">KPI Score  </div>
						<div id="kpiFactor" class="MediumBoldDarkBlueContent"></div>
					</div>
					<div class="col-xs-12 col-md-2">
						<div class="hidden-md hidden-lg VerySmallGreyContent">Milestone </div>
						<div>
						<span  id="kpiMilestoneSetPercentage" class="MilestoneBlue"></span>
						<span id="kpiMilestoneTrajectoryChange" class="NeutralChange"></span>
						</div>
					</div>
				</div>
				</div>
				</div>
			</div><!----End Of one KPI----->
			
	<!-------------------------------------------->
	<!-------------- END KPI Factor -------------->
	<!-------------------------------------------->
			
    <!--------------------------------------Seperator--------------------------------->
	<div class="row lineShadawSeperation"></div> 
	<!------------------------------------END Seperator------------------------------>
    
    
    <!----------------------------------------------->
	<!--- Department > KPI > Keyword Analysis Top --->
	<!----------------------------------------------->
	<div class="row KPIDepartmentFactorTop">
		<div class="col-xs-12 col-md-6">
			<h2 class="topic-header"> Department > KPI > Keyword Analysis</h2>
		</div>
		
		<!---Search --->
		 <div class="col-xs-12 col-md-3">
			<div class="input-group SearchIcon">
				<label class="sr-only" for="SearchItem">Keyword Search</label>
				<div class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></div>
				<input type="search" class="form-control" id="search" placeholder="Keyword Search">
			</div>
		</div><!---End Search --->
		
		<div class="col-xs-12 col-md-3">
			<div class="form-group">
				<button id="Open_All" class="btn btn-primary btn-sm float-left" onClick="openAll()" type="button">Open All</button>
				<button id="Close_All" class="btn btn-default btn-sm float-left" onClick="closeAll()" type="button">Close All</button>
			</div>
		</div><!---Buttons --->
	</div>
	<!--------------------------------------------------->
	<!--- END Department > KPI > Keyword Analysis Top --->
	<!--------------------------------------------------->
	
	
	<!----------------------------------------------------->
	<!--- Department > KPI > Keyword Analysis COntainer --->
	<!-----------------------------------------------------> 
    <div class="panel-group KeywordSelection" id="accordion"></div>
								
						
	<!-------------------------------------------------------->
	<!---END Department > KPI > Keyword Analysis COntainer --->
	<!-------------------------------------------------------->

	
<!------------------------------------------------------------------------------>	
<!---------------------- Department Graph Ligntbox ----------------------------->
<!------------------------------------------------------------------------------>	
 <!-- <div class="modal fade DepartmentLightBox" id="myPopUp" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class=" modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span></button>
         <h4 id="myLargeModalLabel" class="modal-title">Room</h4>
      </div>
		<div class="modal-body row ">
			<div class=" col-xs-12">
			<button style="position:absolute; z-index:10; margin-top:190px; margin-left:-12px;"><</button>
			<div id="repufactorVStime" class="center_align" style="width: auto; height: 400px; margin: 0 auto"></div>
			<button style="right:0px;margin-right: -2px;margin-top: -210px;position: absolute;z-index: 10; ">></button>
			</div>
        </div>
    </div>
  </div>
</div>
</div>
</div> -->
<!------------------------------------------------------------------------------>	
<!--------------------- END Department Graph Lightbox--------------------------->
<!------------------------------------------------------------------------------>

<!-- Modal -->
<div class="modal fade" id="myPopUp" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
<div class="modal-dialog modal-md">
<div class="modal-content">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal">
<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
</button>
<h4 class="modal-title" id="myModalLabel">Rating Score Index Analysis</h4>
</div>
<div class="modal-body modal-md row" style="margin-left:-1px; padding:0px;">
<div id="repufactorVStime" style="height: auto;"></div>
</div>
</div>
</div>
</div> 
<!-- Modal -->
<!-- wrapper -->
</div>
</div>
			
	<!-- </div>
	</div> -->
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
	<script src="<%= request.getContextPath() %>/resources/jquery-ui/jquery-ui.min.js"></script>

	<!-- Charts-->
	<script src="<%= request.getContextPath() %>/resources/highcharts/highcharts.js"></script>
	<script src="<%= request.getContextPath() %>/resources/highcharts/exporting.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/js/datePickerCommon.js"></script>
	
	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	    <script	src="${pageContext.request.contextPath}/resources/js/util.js"></script>
    <!-- Script For Dashboard -->	
    <script src="<%= request.getContextPath() %>/resources/js/reviewAnalysisKpiAndDepartment.js"></script>	
    
    <script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
      
     <%-- <%--  <script src="<%= request.getContextPath() %>/resources/js/kpiInnerPage.js"></script>	
      
      <script src="<%= request.getContextPath() %>/resources/js/departmentInnerPage.js"></script> --%> 
    
    

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
	
		
	<script>
	<!-- To display Flag item $(this).parentsUntil('.panel-body').children('.keywordbox').addClass('OnSeleceActive');-->	
	$('.SelectKPI').click(function(){
		$('.OnSeleceActive').removeClass('OnSeleceActive');
		$('.keywordbox').addClass('OnSeleceActive');
	});
	</script>
	
    <script>
	$( document ).ready(function() {
	$('#search').keyup(function(){
			   // $('.panel-heading').hide();
			    $('.kpiHeading').hide();
			    $('.keywordClass').hide();
			   // $('.panel-body').hide();
			    var txt = $('#search').val();
			    $('.panel-heading,.kpiHeading,.keywordClass').each(function(){
			    	$( ".panel-collapse" ).addClass("in");
			       if($(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1){
			    	   $( ".panel-collapse" ).removeClass("in");
			           $(this).show();
			       //    $('.panel-body').show();
			       }
			    });
			});
		});
	</script> 
</body>
</html>
