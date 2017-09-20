<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%-- <%@include file="includeCssFiles.jsp"%> --%>
<html>
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWQVXW');</script>
<!-- End Google Tag Manager -->
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title><spring:message code="label.manage.milestone.history" /></title>

 <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Repufact Customer Dashboard">
    <meta name="author" content="Bishav.n.r">
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
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
	<div id="wrapper">
		<%-- <%@include file="adminDashboard.jsp"%> --%>
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
				   <a style="padding: 5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
            </div>
            <!-- /.navbar-header -->

<!-------------ORGANIZATION SELECTION & DATE PICKET----------------------------->
             <ul class="nav navbar-top-links navbar-right">
                <li><div class="OrganizationIcon"></div>
					<div class="SelectOrganizationTitle">Organization</div> 
                	<select id="milestoneHistoryOrganization" name="mySelect" class="dropdown SelectOrganization">
                		<c:forEach items="${organizationsForUser}" var="organization">
                			<option value="${organization.id}" <c:if test="${organization.id eq organizationId}">selected="selected"</c:if>>${organization.organizationFullName}</option>
                		</c:forEach>
                	</select>
                </li>
                <!-- /.dropdown -->
				<li class="dropdown ">
					<div class="dropdown-toggle SelectDate">
						<div class="DateIcon"></div>
						<div class="FromDate">From</div>
						<span class="DatePickerInputs">
							<input type="text" id="milestoneHistoryFromDate" name="from" value="${fromDateForFilter}">
							<input type="hidden" id="altMilestoneHistoryFromDate" value="${hiddenFromDate}">
							<span class="ToDate">To</span>
							<input type="text" id="milestoneHistoryToDate" name="to" value="${toDateForFilter}">
							<input type="hidden" id="altMilestoneHistoryToDate" value="${hiddenToDate}">
						</span>
					</div>
				</li>
                <!-- /.dropdown -->
                <li>
                	<button type="submit" class="btn btn-primary TopSetButton" onclick="filterMilestoneHistory()" id="milestoneHistoryApply">Apply</button>
                	<!-- <button type="submit" class="btn btn-primary" id="applyFilterBtn">Apply</button>
	   				<button type="submit" class="btn btn-default" id="clearBtn">Cancel</button> -->
                </li>
            </ul>
            <!-- /.navbar-top-links -->
<!-------------END of ORGANIZATION SELECTION & DATE PICKET----------------------------->
		<%@include file="leftNavigation.jsp" %>
        </nav>
        
		<div id="page-wrapper" style="min-height: 213px;">
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">Milestone History</h1>
				</div>
				<!-- /.col-lg-12 -->
			</div>
			<div class="row">
				<c:choose>
					<c:when test="${ORGANIZATION_NAME eq 'EMPTY' }">
						<div class="col-lg-12 SubHeading"><spring:message code="label.noOrganization"/></div>
					</c:when>
					<c:otherwise>
						<div class="col-lg-12 SubHeading">Milestone History for ${organizationForMileStone.organizationFullName}<a data-target=".FilterLightBox" data-toggle="modal" class="filterButton" type="button" id="exortoToExcel"><span class="glyphicon glyphicon-download-alt"></span> Export to excel</a></div>
					</c:otherwise>
				</c:choose>
				<!-- /.col-lg-12 -->
			</div>
			<div class="panel-group manageMilestone" id="accordion">
				<!------------------ Organization -------------------------------------------------->
			<div class="panel panel-default">
					<div class="panel-heading">
						<div class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"  href="#OrganizationMilestone">Organization</a>
						</div>
					</div>
					<div id="OrganizationMilestone" class="panel-collapse collapse">
						<!------------------------------------Add milestone------------------------------------------------------>
						<div class="panel-body addMilestone" id="addOrganizationMileStoneDivId" style="display: none;">
							<div class="row">
								<div class="col-xs-6 form-horizontal">
								<!-- -------------Add MileStone For Organization-------------------------------------------------- -->
								<form id="addOrganizationMileStonesForm">
									<!-- ----------------Error Div----------------------------------------------------------------- -->
									<div class="alert alert-danger alert-error" style="display: none;"	id="addOrganizationMileStoneErrorDiv">
										<spring:message code="label.globalError"/>
									</div>
									<!-- ----------------Success Div----------------------------------------------------------------- -->
									<div class="alert alert-success" style="display:none;"id="addOrganizationMileStoneSuccessDiv">
										<spring:message code="label.add.mileStone.success"/>
									</div>
									<!-- --------------------Organization-------------------------------------------------------------- -->
									<!-- --------------------From Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Organization-setFromDate-Error">
										<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneOrganizationFromDate">
												<span style="color: #a94442" id="Organization-setFromDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneOrganizationFromDate">
											</div>
										</div>
									</div>
									<!-- --------------------To Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Organization-setToDate-Error">
										<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneOrganizationToDate">
												<span style="color: #a94442" id="Organization-setToDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneOrganizationToDate">
											</div>
										</div>
									</div>
									<!-- --------------------Set MileStone-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Organization-setPercentage-Error">
										<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Milestone in %" class="form-control input-sm" value="0.0" id="organizationSetPercentage">
												<span style="color: #a94442" id="Organization-setPercentage-span-Error"  class="help-inline"></span>
											</div>
										</div>
									</div>
									<!-- --------------------Buttons-------------------------------------------------------------- -->
									<div class="col-xs-offset-3 col-xs-9">
										<c:choose>
											<c:when test="${ORGANIZATION_NAME eq 'EMPTY'}">
												<input type="submit" class="btn btn-default btn-xs btn-red" value="Add MileStone" disabled="disabled">
											</c:when>
											<c:otherwise>
												<input type="submit" class="btn btn-default btn-xs btn-blue" value="Add MileStone">
											</c:otherwise>
										</c:choose>
										<button class="btn btn-xs" type="button" onclick="hideForm('addOrganizationMileStoneDivId')">Cancel</button>
									</div>
								</form>	
								<!-- -----------------End Of Add MileStone Form---------------------------------------------------------- -->
								</div>
								<div class="col-xs-offset-2 col-xs-4">
									<div class="ActualScoreForAddMilestone"></div>
									<div class="SmallDarkGreyHeader yourRepufactor" id="OrganizationActualScoreForAddMilestone">
										${organizationName} &gt; <fmt:formatNumber type="number" value="${organizationRepufact}" maxFractionDigits="2"/>%
									</div>
									<c:choose>
										<c:when test="${fn:length(organizationCompetitorsList) eq 0 }">
											<div class="SmallDarkGreyHeader" id="OrganizationActualScoreForAddMilestoneForCompetitors"><font style="color: red;">No competitor has been mapped to this Source</font></div>
										</c:when>
										<c:otherwise>
											<c:forEach items="${organizationCompetitorsList}" var="organizationCompetitor">
												<div class="SmallDarkGreyHeader" id="OrganizationActualScoreForAddMilestoneForCompetitors">${organizationCompetitor.organizationName} ><fmt:formatNumber type="number" maxFractionDigits="2" value="${organizationCompetitor.repufactor}"/>%</div>
											</c:forEach>
										</c:otherwise>
									</c:choose>
								</div>
							</div>
						</div>
						<!-- ----------------------Added MileStones List For Organization -------------------------->
						<c:choose>
							<c:when test="${fn:length(listOrganizationMileStones) gt 0}">
								<c:forEach items="${listOrganizationMileStones}" var="organizationMileStones">
									<div class="panel-body" id="organization-milestoneList-${organizationMileStones.id}">
										<div class="row">
											<div class="col-xs-12 MediumBoldGreyContent">${organizationMileStones.organizationFullName}</div>
										</div>
										<div class="row MilestoneValues">
										<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5"><fmt:formatDate value="${organizationMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent"><fmt:formatDate value="${organizationMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											
										<!-- --------------------------Repufactor------------------------------------------------ -->
										<div class="col-sm-2 repufactor">
												<div class="ActualScoreForMilestone"><fmt:formatNumber type="number" maxFractionDigits="2" value="${currentRepufactor}"/>%</div>
										</div>
										<!-- --------------------------Milestone Target Set------------------------------------------------ -->
										<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${organizationMileStones.setPercentage}"/>%</div>
										</div>	
										<!-- --------------------------Target Change------------------------------------------------ -->
										<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change<br><br>
													<c:if test="${organizationMileStones.trajectoryChange lt 0 }">
														<span class="NegativeChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${organizationMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${organizationMileStones.trajectoryChange eq 0 }">
														<span class="NoChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${organizationMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${organizationMileStones.trajectoryChange gt 0 }">
														<span class="PositiveChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${organizationMileStones.trajectoryChange}"/>%</span>
													</c:if>
													
												</div>
											</div>
											<!-- --------------------------Days Remaining------------------------------------------------ -->
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent">Days Remaining</div>
												<div class="MediumBoldDarkBlueContent">${organizationMileStones.daysRemaining}</div>
											</div>
										</div>
									</div>
								</c:forEach>
							</c:when>
							<c:otherwise>
								<div class="panel-body" id="organizationEmptyMileStone"><font style="color: red">No MileStones Found</font></div>
							</c:otherwise>
						</c:choose>
						<!-- -------------------End Of List------------------------------------------------------------ -->
					</div>
				</div>

				<!-- ----------------------------------------END Organization -------------------------------------------->
				<!-- --------------------------Department --------------------------------------------------->
				<div class="panel panel-default">
					<div class="panel-heading">
						<div class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"	href="#DepartmentMilestone">Department</a>
							<div class="form-group float-right">
								<input id="departmentMileStoneSearch" class="form-control input-sm searchMilestone" placeholder="Search">
							</div>
						</div>
					</div>
					<div id="DepartmentMilestone" class="panel-collapse collapse">
						<!-- ----------------------Added MileStones List For Department -------------------------->
						<div id="DepartmentMileStonesList">
						<c:choose>
							<c:when test="${fn:length(listDepartmentMileStones) gt 0}">
								<c:forEach items="${listDepartmentMileStones}" var="departmentMileStones">
									<div class="panel-body" id="department-milestoneList-${departmentMileStones.id}">
										<div class="row">
											<div class="col-xs-12 MediumBoldGreyContent">${departmentMileStones.departmentName}</div>
										</div>
										<div class="row MilestoneValues">
											<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5"><fmt:formatDate value="${departmentMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent"><fmt:formatDate value="${departmentMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											<div class="col-sm-2 repufactor">
												<div class="ActualScoreForMilestone"><fmt:formatNumber type="number" maxFractionDigits="2" value="${departmentMileStones.departmentRepufact}"/>%</div>
											</div>
											<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${departmentMileStones.setPercentage}"/>%</div>
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change<br><br>
													<c:if test="${departmentMileStones.trajectoryChange lt 0 }">
														<span class="NegativeChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${departmentMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${departmentMileStones.trajectoryChange eq 0 }">
														<span class="NoChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${departmentMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${departmentMileStones.trajectoryChange gt 0 }">
														<span class="PositiveChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${departmentMileStones.trajectoryChange}"/>%</span>
													</c:if>
													
												</div>
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent">Days Remaining</div>
												<div class="MediumBoldDarkBlueContent">${departmentMileStones.daysRemaining}</div>
											</div>
										</div>
									</div>
								</c:forEach>
							</c:when>
							<c:otherwise>
								<div class="panel-body" id="departmentEmptyMileStone"><font style="color: red">No MileStones Found</font></div>
							</c:otherwise>
						</c:choose>
						</div>
						<!-- -------------------End Of List------------------------------------------------------------ -->
					</div>
				</div>
				<!------------------------------------------------END Department--------------------------------------------->
				<!----------------------------------------------- KPI ------------------------------------------------------->
			<div class="panel panel-default">
					<div class="panel-heading">
						<div class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"	href="#KpiMilestone">KPI</a>
							<div class="form-group float-right">
								<input id="kpiMileStoneSearch" class="form-control input-sm searchMilestone" placeholder="Search">
							</div>
						</div>
					</div>
					<div id="KpiMilestone" class="panel-collapse collapse">
						<!------------------------------------Add milestone------------------------------------------------------>
						<div class="panel-body addMilestone" id="addKpiMileStoneDivId" style="display: none;">
							<div class="row">
								<div class="col-xs-6 form-horizontal">
								<!-- -------------Add MileStone For Department-------------------------------------------------- -->
								<form id="addKpiMileStonesForm">
									<!-- ----------------Error Div----------------------------------------------------------------- -->
									<div class="alert alert-danger alert-error" style="display: none;"	id="addKpiMileStoneErrorDiv">
										<spring:message code="label.globalError"/>
									</div>
									<!-- ----------------Success Div----------------------------------------------------------------- -->
									<div class="alert alert-success" style="display:none;"id="addKpiMileStoneSuccessDiv">
										<spring:message code="label.add.mileStone.success"/>
									</div>
									<!-- --------------------KPI-------------------------------------------------------------- -->
									<c:choose>
										<c:when test="${KPI_SIZE eq 'EMPTY' }">
											<div class="form-group has-error has-feedback" id="Add-Kpi-kpiId-Error">
												<label class="col-xs-3 control-label">KPI<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneKpiId" disabled="disabled">
														<option value="0">No KPI(s) Found</option>
													</select>
													<span style="color: #a94442" id="Kpi-kpiId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:when>
										<c:otherwise>
											<div class="form-group" id="Add-Kpi-kpiId-Error">
												<label class="col-xs-3 control-label">KPI<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneKpiId" onchange="calculateKpiRepufact()">
														<option value="0">Select a KPI</option>
														<c:forEach  items="${kpis}" var="kpi">
			      											<option value="${kpi.id}">${kpi.kpiName}</option>
			      										</c:forEach>												
													</select>
													<span style="color: #a94442" id="Kpi-kpiId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:otherwise>
									</c:choose>
									<!-- --------------------From Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Kpi-setFromDate-Error">
										<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneKpiFromDate">
												<span style="color: #a94442" id="Kpi-setFromDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneKpiFromDate">
											</div>
										</div>
									</div>
									<!-- --------------------To Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Kpi-setToDate-Error">
										<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneKpiToDate">
												<span style="color: #a94442" id="Kpi-setToDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneKpiToDate">
											</div>
										</div>
									</div>
									<!-- --------------------Set MileStone-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Kpi-setPercentage-Error">
										<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Milestone in %" class="form-control input-sm" value="0.0" id="kpiSetPercentage">
												<span style="color: #a94442" id="Kpi-setPercentage-span-Error"  class="help-inline"></span>
											</div>
										</div>
									</div>
									<!-- --------------------Buttons-------------------------------------------------------------- -->
									<div class="col-xs-offset-3 col-xs-9">
										<c:choose>
											<c:when test="${KPI_SIZE eq 'EMPTY'}">
												<input type="submit" class="btn btn-default btn-xs btn-red" value="Add MileStone" disabled="disabled">
											</c:when>
											<c:otherwise>
												<input type="submit" class="btn btn-default btn-xs btn-blue" value="Add MileStone">
											</c:otherwise>
										</c:choose>
										<button class="btn btn-xs" type="button" onclick="hideForm('addKpiMileStoneDivId')">Cancel</button>
									</div>
								</form>	
								<!-- -----------------End Of Add MileStone Form---------------------------------------------------------- -->
								</div>
								<div class="col-xs-offset-2 col-xs-4">
									<div class="ActualScoreForAddMilestone"></div>
									<div class="SmallDarkGreyHeader yourRepufactor" id="KpiActualScoreForAddMilestone"></div>
									<div class="SmallDarkGreyHeader" id="KpiActualScoreForAddMilestoneForCompetitors"></div>
								</div>
							</div>
						</div>
						<!-- ----------------------Added MileStones List For Kpi -------------------------->
						<div id="KpiMileStonesList">
						<c:choose>
							<c:when test="${fn:length(listKpiMileStones) gt 0}">
								<c:forEach items="${listKpiMileStones}" var="kpiMileStones">
									<div class="panel-body" id="kpi-milestoneList-${kpiMileStones.id}">
										<div class="row">
											<div class="col-xs-12 MediumBoldGreyContent">${kpiMileStones.kpiName}</div>
										</div>
										<div class="row MilestoneValues">
											<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5"><fmt:formatDate value="${kpiMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent"><fmt:formatDate value="${kpiMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											<div class="col-sm-2 repufactor">
												<div class="ActualScoreForMilestone"><fmt:formatNumber type="number" maxFractionDigits="2" value="${kpiMileStones.kpiRepufact}"/>%</div>
											</div>
											<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${kpiMileStones.setPercentage}"/>%</div>
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change<br><br>
													<c:if test="${kpiMileStones.trajectoryChange lt 0 }">
														<span class="NegativeChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${kpiMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${kpiMileStones.trajectoryChange eq 0 }">
														<span class="NoChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${kpiMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${kpiMileStones.trajectoryChange gt 0 }">
														<span class="PositiveChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${kpiMileStones.trajectoryChange}"/>%</span>
													</c:if>
													
												</div>
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent">Days Remaining</div>
												<div class="MediumBoldDarkBlueContent">${kpiMileStones.daysRemaining}</div>
											</div>
											
										</div>
									</div>
								</c:forEach>
							</c:when>
							<c:otherwise>
								<div class="panel-body" id="kpiEmptyMileStone"><font style="color: red">No MileStones Found</font></div>
							</c:otherwise>
						</c:choose>
						</div>
						<!-- -------------------End Of List------------------------------------------------------------ -->
					</div>
				</div>
				<!---------------------------------- END KPI---------------------------------------------------------------------------->
				<!-- ----------------------------------Source --------------------------------------------------------------------------->
			<div class="panel panel-default">
					<div class="panel-heading">
						<div class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"	href="#SourceMilestone">Source</a>
							<div class="form-group float-right">
								<input id="sourceMileStoneSearch" class="form-control input-sm searchMilestone" placeholder="Search">
							</div>
						</div>
					</div>
					<div id="SourceMilestone" class="panel-collapse collapse">
						<!-- ----------------------Added MileStones List For Source -------------------------->
						<div id="SourceMileStonesList">
						<c:choose>
							<c:when test="${fn:length(listSourceMileStones) gt 0}">
								<c:forEach items="${listSourceMileStones}" var="sourceMileStones">
									<div class="panel-body" id="source-milestoneList-${sourceMileStones.id}">
										<div class="row">
											<div class="col-xs-12 MediumBoldGreyContent">${sourceMileStones.sourceName}</div>
										</div>
										<div class="row MilestoneValues">
											<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5"><fmt:formatDate value="${sourceMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent"><fmt:formatDate value="${sourceMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											<div class="col-sm-2 repufactor">
												<div class="ActualScoreForMilestone"><fmt:formatNumber type="number" value="${sourceMileStones.sourceRepufact}" maxFractionDigits="2"/>%</div>
											</div>
											<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${sourceMileStones.setPercentage}"/>%</div>
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change<br><br>
													<c:if test="${sourceMileStones.trajectoryChange lt 0 }">
														<span class="NegativeChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${sourceMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${sourceMileStones.trajectoryChange eq 0 }">
														<span class="NoChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${sourceMileStones.trajectoryChange}"/>%</span>
													</c:if>
													<c:if test="${sourceMileStones.trajectoryChange gt 0 }">
														<span class="PositiveChangeLeftAlign"><fmt:formatNumber type="number" maxFractionDigits="2" value="${sourceMileStones.trajectoryChange}"/>%</span>
													</c:if>
													
												</div>
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent">Days Remaining</div>
												<div class="MediumBoldDarkBlueContent">${sourceMileStones.daysRemaining}</div>
											</div>
										</div>
									</div>
								</c:forEach>
							</c:when>
							<c:otherwise>
								<div class="panel-body" id="sourceEmptyMileStone"><font style="color: red">No MileStones Found</font></div>
							</c:otherwise>
						</c:choose>
						</div>
						<!-- -------------------End Of List------------------------------------------------------------ -->
					</div>
				</div>
				<!-- END Source -->
			</div>
			<!-- .panel-body -->
			<%@include file="customException.jsp" %>
		</div>
	</div>
	<!-- ------- -->
	<select id="departmentsForMileStoneSearch" style="display: none;">
		<c:forEach items="${listDepartmentMileStones}" var="department">
			<option value="${department.departmentId}">${department.departmentName}</option>
		</c:forEach>
	</select>
	<select id="kpisForMileStoneSearch" style="display: none;">
		<c:forEach items="${listKpiMileStones}" var="kpi">
			<option value="${kpi.kpiId}">${kpi.kpiName}</option>
		</c:forEach>
	</select>
	<select id="sourcesForMileStoneSearch" style="display: none;">
		<c:forEach items="${listSourceMileStones}" var="source">
			<option value="${source.sourceId}">${source.sourceName}</option>
		</c:forEach>
	</select>
</body>
<%@include file="includeJsFiles.jsp"%>
<!-- Script For Dashboard -->	
<script src="../resources/js/milestoneHistory.js"></script>
<script src="../resources/js/datePickerCommon.js"></script>
</html>