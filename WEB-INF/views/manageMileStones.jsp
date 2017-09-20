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
})(window,document,'script','dataLayer','GTM-W5W4FN');</script>
<!-- End Google Tag Manager -->

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWQVXW');</script>
<!-- End Google Tag Manager -->

<title><spring:message code="label.manage.milestone" /></title>

 <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Repufact Customer Dashboard">
    <meta name="author" content="Bishav.n.r">
     <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title><spring:message code="label.manage.milestone" /></title>
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
				   <a style="padding:5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
                
            </div>
            <!-- /.navbar-header -->

<!-------------ORGANIZATION SELECTION & DATE PICKET----------------------------->
            <ul class="nav navbar-top-links navbar-right">
                <li><div class="OrganizationIcon"></div>
					<div class="SelectOrganizationTitle">Organization</div>
                	<select id="organizationName" name="mySelect" class="dropdown SelectOrganization">
                	<c:forEach items="${organizationsForMilestone}" var="organization">
                		<option value="${organization.id}" <c:if test="${organization.id eq selectedMilestoneOrganizationId}">selected="selected"</c:if>>${organization.organizationFullName}</option>
                	</c:forEach>
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
                	<button type="submit" class="btn btn-primary TopSetButton" id="manageMilestoneForOrganisation" onclick="manageMileStoneForOrganization()">Apply</button>
					<!-- <button type="submit" class="btn btn-default TopSetButton" id="clearBtn">Cancel</button> -->
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
					<h1 class="page-header">Manage Milestone</h1>
				</div>
				<!-- /.col-lg-12 -->
			</div>
			<div class="row">
				<c:choose>
					<c:when test="${ORGANIZATION_NAME eq 'EMPTY' }">
						<div class="col-lg-12 SubHeading"><spring:message code="label.noOrganization"/></div>
					</c:when>
					<c:otherwise>
						<div class="col-lg-12 SubHeading">Milestone for ${organizationForMileStone.organizationFullName}</div>
					</c:otherwise>
				</c:choose>
				<!-- /.col-lg-12 -->
			</div>
			<div class="panel-group manageMilestone" id="accordion">
				<!------------------ Organization -------------------------------------------------->
			<div class="panel panel-default">
					<div class="panel-heading">
						<div class="panel-title">
							<a data-toggle="collapse" data-parent="#accordion"  href="#OrganizationMilestone" onclick="addMilestoneFormHide()">Organization</a>
							<!-- <div class="form-group float-right">
								<input class="form-control input-sm searchMilestone" placeholder="Search">
							</div> -->
							<div class="form-group float-right" style="margin-right: 146px;">
								<c:choose>
									<c:when test="${fn:length(listOrganizationMileStones) gt 0}">
										<button id="organizationAddMileStoneButton" disabled="disabled" data-toggle="collapse" data-parent="#accordion"	onclick="showAddMileStoneForm('addOrganizationMileStoneDivId','addOrganizationMileStoneErrorDiv','addOrganizationMileStoneSuccessDiv','addOrganizationMileStonesForm','OrganizationMilestone')"	class="btn btn-primary btn-xs btnAddDepartmentMilestone">Add Milestone</button>
									</c:when>
									<c:otherwise>
										<button id="organizationAddMileStoneButton"  data-toggle="collapse" data-parent="#accordion" onclick="showAddMileStoneForm('addOrganizationMileStoneDivId','addOrganizationMileStoneErrorDiv','addOrganizationMileStoneSuccessDiv','addOrganizationMileStonesForm','OrganizationMilestone')"	class="btn btn-primary btn-xs btnAddDepartmentMilestone">Add Milestone</button>								
									</c:otherwise>
								</c:choose>
							</div>
						</div>
					</div>
					<!-- ----------------Success Div----------------------------------------------------------------- -->
					<div class="alert alert-success" style="display:none;"id="editOrganizationMileStoneSuccessDiv">
						<spring:message code="label.edit.mileStone.success"/>
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
								<%-- 	<c:choose>
										<c:when test="${ORGANIZATION_NAME eq 'EMPTY' }">
											<div class="form-group has-error has-feedback" id="Add-Organization-organizationId-Error">
												<label class="col-xs-3 control-label">KPI<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneOrganizationId" disabled="disabled">
														<option value="0">No Organization Found</option>
													</select>
													<span style="color: #a94442" id="Organization-orgId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:when>
										<c:otherwise>
											<div class="form-group" id="Add-Organization-organizationId-Error">
												<label class="col-xs-3 control-label">KPI<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneOrganizationId" disabled="disabled">
														<option value="${organizationForMileStone.id}">${organizationForMileStone.organizationFullName}</option>
													</select>
													<span style="color: #a94442" id="Organization-orgId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:otherwise>
									</c:choose> --%>
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
									<div class="ActualScoreForAddMilestone">Rating Score Index</div>
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
											<div class="col-xs-12 MediumBoldGreyContent" id="organization-milestoneList-${organizationMileStones.id}_organizationName">${organizationMileStones.organizationFullName}</div>
										</div>
										<div class="row MilestoneValues">
										<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5" id="organization-milestoneList-${organizationMileStones.id}_fromDate"><fmt:formatDate value="${organizationMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent" id="organization-milestoneList-${organizationMileStones.id}_toDate"><fmt:formatDate value="${organizationMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											
										<!-- --------------------------Repufactor------------------------------------------------ -->
										<div class="col-sm-2 repufactor">
												<div class="ActualScoreForMilestone" ><fmt:formatNumber type="number" maxFractionDigits="2" value="${organizationMileStones.repufactor}"/>%</div>
												<input type="hidden" value="${organizationMileStones.repufactor}" id="organization-milestoneList-${organizationMileStones.id}_repufactor">
										</div>
										<!-- --------------------------Milestone Target Set------------------------------------------------ -->
										<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${organizationMileStones.setPercentage}"/>%</div>
												<input type="hidden" value="${organizationMileStones.setPercentage}" id="organization-milestoneList-${organizationMileStones.id}_mileStonePercentage">
										</div>	
										<!-- --------------------------Target Change------------------------------------------------ -->
										<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change
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
											<div class="col-sm-1">
												<button type="button" class="btn btn-xs editMilestoneButton" onclick="editOrganizationMileStone(${organizationMileStones.id})">
													<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>
												</button>
											</div>
										</div>
										<div class="panel-body addMilestone" id="editOrganizationMileStoneDivId_${organizationMileStones.id}" style="display: none;"></div>
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
							<a data-toggle="collapse" data-parent="#accordion"	href="#DepartmentMilestone" onclick="addMilestoneFormHide()">Department</a>
							<div class="form-group float-right">
								<input id="departmentMileStoneSearch" class="form-control input-sm searchMilestone" placeholder="Search">
							</div>
							<div class="form-group float-right">
								<button data-toggle="collapse" id="deptAddMilestoneBtn" data-parent="#accordion"	onclick="showAddMileStoneForm('addDepartmentMileStoneDivId','addDepartmentMileStoneErrorDiv','addDepartmentMileStoneSuccessDiv','addDepartmentMileStonesForm','DepartmentMilestone')"	class="btn btn-primary btn-xs btnAddDepartmentMilestone">Add Milestone</button>
							</div>
						</div>
					</div>
					<!-- ----------------Success Div----------------------------------------------------------------- -->
					<div class="alert alert-success" style="display:none;"id="editDepartmentMileStoneSuccessDiv">
						<spring:message code="label.edit.mileStone.success"/>
					</div>
					<div id="DepartmentMilestone" class="panel-collapse collapse">
						<!------------------------------------Add milestone------------------------------------------------------>
						<div class="panel-body addMilestone" id="addDepartmentMileStoneDivId" style="display: none;">
							<div class="row">
								<div class="col-xs-6 form-horizontal">
								<!-- -------------Add MileStone For Department-------------------------------------------------- -->
								<form id="addDepartmentMileStonesForm">
									<!-- ----------------Error Div----------------------------------------------------------------- -->
									<div class="alert alert-danger alert-error" style="display: none;"	id="addDepartmentMileStoneErrorDiv">
										<spring:message code="label.globalError"/>
									</div>
									<!-- ----------------Success Div----------------------------------------------------------------- -->
									<div class="alert alert-success" style="display:none;"id="addDepartmentMileStoneSuccessDiv">
										<spring:message code="label.add.mileStone.success"/>
									</div>
									<!-- --------------------Department-------------------------------------------------------------- -->
									<c:choose>
										<c:when test="${DEPARTMENTS_SIZE eq 'EMPTY' }">
											<div class="form-group has-error has-feedback" id="Add-Department-departmentId-Error">
												<label class="col-xs-3 control-label">Department<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneDepartmentId" disabled="disabled">
														<option value="0">No Departments Found</option>
													</select>
													<span style="color: #a94442" id="Department-departmentId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:when>
										<c:otherwise>
											<div class="form-group" id="Add-Department-departmentId-Error">
												<label class="col-xs-3 control-label">Department<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneDepartmentId" onchange="calculateDepartmentRepufact()">
														<option value="0">Select a Department</option>
														<c:forEach  items="${departments}" var="department">
			      											<option value="${department.id}">${department.departmentName}</option>
			      										</c:forEach>												
													</select>
													<span style="color: #a94442" id="Department-departmentId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:otherwise>
									</c:choose>
									<!-- --------------------From Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Department-setFromDate-Error">
										<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneDepartmentFromDate">
												<span style="color: #a94442" id="Department-setFromDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneDepartmentFromDate">
											</div>
										</div>
									</div>
									<!-- --------------------To Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Department-setToDate-Error">
										<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneDepartmentToDate">
												<span style="color: #a94442" id="Department-setToDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneDepartmentToDate">
											</div>
										</div>
									</div>
									<!-- --------------------Set MileStone-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Department-setPercentage-Error">
										<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Milestone in %" class="form-control input-sm" value="0.0" id="mileStoneForDepartment">
												<span style="color: #a94442" id="Department-setPercentage-span-Error"  class="help-inline"></span>
											</div>
										</div>
									</div>
									<!-- --------------------Buttons-------------------------------------------------------------- -->
									<div class="col-xs-offset-3 col-xs-9">
										<c:choose>
											<c:when test="${DEPARTMENTS_SIZE eq 'EMPTY'}">
												<input type="submit" class="btn btn-default btn-xs btn-red" value="Add MileStone" disabled="disabled">
											</c:when>
											<c:otherwise>
												<input type="submit" class="btn btn-default btn-xs btn-blue" value="Add MileStone">
											</c:otherwise>
										</c:choose>
										<button class="btn btn-xs" type="button" onclick="hideForm('addDepartmentMileStoneDivId')">Cancel</button>
									</div>
								</form>	
								<!-- -----------------End Of Add MileStone Form---------------------------------------------------------- -->
								</div>
								<div class="col-xs-offset-2 col-xs-4">
									<div class="MediumBoldDarkBlueContent"><div style="font-size: 14px;">Department Score</div></div>
									<div class="SmallDarkGreyHeader yourRepufactor" id="DepartmentActualScoreForAddMilestone"></div>
									<div class="SmallDarkGreyHeader" id="DepartmentActualScoreForAddMilestoneForCompetitors"></div>
								</div>
							</div>
						</div>
						<!-- ----------------------Added MileStones List For Department -------------------------->
						<div id="DepartmentMileStonesList">
						<c:choose>
							<c:when test="${fn:length(listDepartmentMileStones) gt 0}">
								<c:forEach items="${listDepartmentMileStones}" var="departmentMileStones">
									<div class="panel-body" id="department-milestoneList-${departmentMileStones.id}">
										<div class="row">
											<div class="col-xs-12 MediumBoldGreyContent" id="department-milestoneList-${departmentMileStones.id}_departmentName">${departmentMileStones.departmentName}</div>
										</div>
										<div class="row MilestoneValues">
											<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5" id="department-milestoneList-${departmentMileStones.id}_fromDate"><fmt:formatDate value="${departmentMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent" id="department-milestoneList-${departmentMileStones.id}_toDate"><fmt:formatDate value="${departmentMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											<div class="col-sm-2 repufactor">
												<div class="MediumBoldDarkBlueContent"><div style="font-size: 14px;">Department Score</div><fmt:formatNumber type="number" maxFractionDigits="2" value="${departmentMileStones.departmentRepufact}"/>%</div>
												<input type="hidden" value="${departmentMileStones.departmentRepufact}" id="department-milestoneList-${departmentMileStones.id}_departmentRepufact">
											</div>
											<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${departmentMileStones.setPercentage}"/>%</div>
												<input type="hidden" value="${departmentMileStones.setPercentage}" id="department-milestoneList-${departmentMileStones.id}_mileStonePercentage">
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change
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
											
											<div class="col-sm-1">
												<button type="button" class="btn btn-xs editMilestoneButton" onclick="editDepartmentMileStone(${departmentMileStones.id})">
													<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>
												</button>
											</div>
										</div>
										<div class="panel-body addMilestone" id="editDepartmentMileStoneDivId_${departmentMileStones.id}" style="display: none;"></div>
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
							<a data-toggle="collapse" data-parent="#accordion"	href="#KpiMilestone" onclick="addMilestoneFormHide()">KPI</a>
							<div class="form-group float-right">
								<input id="kpiMileStoneSearch" class="form-control input-sm searchMilestone" placeholder="Search">
							</div>
							<div class="form-group float-right">
								<button data-toggle="collapse" data-parent="#accordion"	id="kpiAddMilestoneBtn" onclick="showAddMileStoneForm('addKpiMileStoneDivId','addKpiMileStoneErrorDiv','addKpiMileStoneSuccessDiv','addKpiMileStonesForm','KpiMilestone')"	class="btn btn-primary btn-xs btnAddDepartmentMilestone">Add Milestone</button>
							</div>
						</div>
					</div>
					<!-- ----------------Success Div----------------------------------------------------------------- -->
					<div class="alert alert-success" style="display:none;"id="editKpiMileStoneSuccessDiv">
						<spring:message code="label.edit.mileStone.success"/>
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
									<div class="SmallBoldGreyContent"><div style="font-size: 14px;">KPI Score</div></div>
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
											<div class="col-xs-12 MediumBoldGreyContent" id="kpi-milestoneList-${kpiMileStones.id}_kpiName">${kpiMileStones.kpiName}</div>
										</div>
										<div class="row MilestoneValues">
											<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5" id="kpi-milestoneList-${kpiMileStones.id}_fromDate"><fmt:formatDate value="${kpiMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent" id="kpi-milestoneList-${kpiMileStones.id}_toDate"><fmt:formatDate value="${kpiMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											<div class="col-sm-2 repufactor">
												<div class="SmallBoldGreyContent"><div style="font-size: 14px;">KPI Score</div><fmt:formatNumber type="number" maxFractionDigits="2" value="${kpiMileStones.kpiRepufact}"/>%</div>
												<input type="hidden" value="${kpiMileStones.kpiRepufact}" id="kpi-milestoneList-${kpiMileStones.id}_kpiRepufact">
											</div>
											<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${kpiMileStones.setPercentage}"/>%</div>
												<input type="hidden" value="${kpiMileStones.setPercentage}" id="kpi-milestoneList-${kpiMileStones.id}_mileStonePercentage">
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change
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
											
											
											<div class="col-sm-1">
												<button type="button" class="btn btn-xs editMilestoneButton" onclick="editKpiMileStone(${kpiMileStones.id})">
													<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>
												</button>
											</div>
										</div>
										<div class="panel-body addMilestone" id="editKpiMileStoneDivId_${kpiMileStones.id}" style="display: none;"></div>
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
							<a data-toggle="collapse" data-parent="#accordion"	href="#SourceMilestone" onclick="addMilestoneFormHide()">Source</a>
							<div class="form-group float-right">
								<input id="sourceMileStoneSearch" class="form-control input-sm searchMilestone" placeholder="Search">
							</div>
							<div class="form-group float-right">
								<button data-toggle="collapse" data-parent="#accordion" id="sourceAddMilestoneBtn"	onclick="showAddMileStoneForm('addSourceMileStoneDivId','addSourceMileStoneErrorDiv','addSourceMileStoneSuccessDiv','addSourceMileStonesForm','SourceMilestone')"	class="btn btn-primary btn-xs btnAddDepartmentMilestone">Add Milestone</button>
							</div>
						</div>
					</div>
					<!-- ----------------Success Div----------------------------------------------------------------- -->
					<div class="alert alert-success" style="display:none;"id="editSourceMileStoneSuccessDiv">
						<spring:message code="label.edit.mileStone.success"/>
					</div>
					<div id="SourceMilestone" class="panel-collapse collapse">
						<!------------------------------------Add milestone------------------------------------------------------>
						<div class="panel-body addMilestone" id="addSourceMileStoneDivId" style="display: none;">
							<div class="row">
								<div class="col-xs-6 form-horizontal">
								<!-- -------------Add MileStone For Department-------------------------------------------------- -->
								<form id="addSourceMileStonesForm">
									<!-- ----------------Error Div----------------------------------------------------------------- -->
									<div class="alert alert-danger alert-error" style="display: none;"	id="addSourceMileStoneErrorDiv">
										<spring:message code="label.globalError"/>
									</div>
									<!-- ----------------Success Div----------------------------------------------------------------- -->
									<div class="alert alert-success" style="display:none;"id="addSourceMileStoneSuccessDiv">
										<spring:message code="label.add.mileStone.success"/>
									</div>
									<!-- --------------------Source-------------------------------------------------------------- -->
									<c:choose>
										<c:when test="${SOURCE_SIZE eq 'EMPTY' }">
											<div class="form-group has-error has-feedback" id="Add-Source-sourceId-Error">
												<label class="col-xs-3 control-label">Source<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneSourceId" disabled="disabled">
														<option value="0">No Sources Found</option>
													</select>
													<span style="color: #a94442" id="Source-sourceId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:when>
										<c:otherwise>
											<div class="form-group" id="Add-Source-sourceId-Error">
												<label class="col-xs-3 control-label">Source<span class="mandatoryField">*</span></label>
												<div class=" col-xs-9">
													<select class="form-control input-sm" id="mileStoneSourceId" onchange="calculateSourceRepufact()">
														<option value="0">Select a Source</option>
														<c:forEach  items="${sources}" var="source">
			      											<option value="${source.id}">${source.sourceName}</option>
			      										</c:forEach>												
													</select>
													<span style="color: #a94442" id="Source-sourceId-span-Error" class="help-inline"></span>
												</div>
											</div>
										</c:otherwise>
									</c:choose>
									<!-- --------------------From Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Source-setFromDate-Error">
										<label class="col-xs-3 control-label">From<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneSourceFromDate">
												<span style="color: #a94442" id="Source-setFromDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneSourceFromDate">
											</div>
										</div>
									</div>
									<!-- --------------------To Date-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Source-setToDate-Error">
										<label class="col-xs-3 control-label">To<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Select Date" class="form-control-sm" id="mileStoneSourceToDate">
												<span style="color: #a94442" id="Source-setToDate-span-Error" class="help-inline"></span>
												<input type="hidden" id="altMileStoneSourceToDate">
											</div>
										</div>
									</div>
									<!-- --------------------Set MileStone-------------------------------------------------------------- -->
									<div class="form-group" id="Add-Source-setPercentage-Error">
										<label class="col-xs-3 control-label">Set Milestone<span class="mandatoryField">*</span></label>
										<div class=" col-xs-9">
											<div class="">
												<input placeholder="Milestone in %" class="form-control input-sm" value="0.0" id="sourceSetPercentage">
												<span style="color: #a94442" id="Source-setPercentage-span-Error"  class="help-inline"></span>
											</div>
										</div>
									</div>
									<!-- --------------------Buttons-------------------------------------------------------------- -->
									<div class="col-xs-offset-3 col-xs-9">
										<c:choose>
											<c:when test="${SOURCE_SIZE eq 'EMPTY'}">
												<input type="submit" class="btn btn-default btn-xs btn-red" value="Add MileStone" disabled="disabled">
											</c:when>
											<c:otherwise>
												<input type="submit" class="btn btn-default btn-xs btn-blue" value="Add MileStone">
											</c:otherwise>
										</c:choose>
										<button class="btn btn-xs" type="button" onclick="hideForm('addSourceMileStoneDivId')">Cancel</button>
									</div>
								</form>	
								<!-- -----------------End Of Add MileStone Form---------------------------------------------------------- -->
								</div>
								<div class="col-xs-offset-2 col-xs-4">
									<div class="SmallBoldGreyContent"><div style="font-size: 14px;">Source Score</div></div>
									<div class="SmallDarkGreyHeader yourRepufactor" id="SourceActualScoreForAddMilestone"></div>
									<div class="SmallDarkGreyHeader" id="SourceActualScoreForAddMilestoneForCompetitors"></div>
								</div>
							</div>
						</div>
						<!-- ----------------------Added MileStones List For Source -------------------------->
						<div id="SourceMileStonesList">
						<c:choose>
							<c:when test="${fn:length(listSourceMileStones) gt 0}">
								<c:forEach items="${listSourceMileStones}" var="sourceMileStones">
									<div class="panel-body" id="source-milestoneList-${sourceMileStones.id}">
										<div class="row">
											<div class="col-xs-12 MediumBoldGreyContent" id="source-milestoneList-${sourceMileStones.id}_sourceName">${sourceMileStones.sourceName}</div>
										</div>
										<div class="row MilestoneValues">
											<div class="col-sm-2 SmallDarkGreyHeader">
												From <span class="VerySmallBoldGreyContent marginRight5" id="source-milestoneList-${sourceMileStones.id}_fromDate"><fmt:formatDate value="${sourceMileStones.setFromDate}" pattern="dd MMM yyyy"/></span>
												<div>
													To <span class="VerySmallBoldGreyContent" id="source-milestoneList-${sourceMileStones.id}_toDate"><fmt:formatDate value="${sourceMileStones.setToDate}" pattern="dd MMM yyyy"/></span>
												</div>
											</div>
											<div class="col-sm-2 repufactor">
												<div class="SmallBoldGreyContent"><div style="font-size: 14px;">Source Score</div><fmt:formatNumber type="number" value="${sourceMileStones.sourceRepufact}" maxFractionDigits="2"/>%</div>
												<input type="hidden" value="${sourceMileStones.sourceRepufact}" id="source-milestoneList-${sourceMileStones.id}_sourceRepufact">
											</div>
											<div class="col-sm-3">
												<div class="MilestoneBlue">Milestone <fmt:formatNumber type="number" maxFractionDigits="2" value="${sourceMileStones.setPercentage}"/>%</div>
												<input type="hidden" value="${sourceMileStones.setPercentage}" id="source-milestoneList-${sourceMileStones.id}_mileStonePercentage">
											</div>
											<div class="col-sm-2 SmallDarkGreyHeader">
												<div class="VerySmallBoldGreyContent MilestoneTrajectoryChange">
													Target Change
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
												<div class="SmallBoldGreyContent">${sourceMileStones.daysRemaining}</div>
											</div>
											
											<div class="col-sm-1">
												<button type="button" class="btn btn-xs editMilestoneButton" onclick="editSourceMileStone(${sourceMileStones.id})">
													<span aria-hidden="true" class="glyphicon glyphicon-pencil"></span>
												</button>
											</div>
										</div>
										<div class="panel-body addMilestone" id="editSourceMileStoneDivId_${sourceMileStones.id}" style="display: none;"></div>
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
		<div id="editManageMileStoneModal" class="modal fade">
		    <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="editManageMileStoneModalHeader"></h4>
		            </div>
		            <div class="modal-body" id="editManageMileStoneModalBody">
		            </div>
		           <!--  <div class="modal-footer" id="editManageMileStoneFooter">
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div> -->
		        </div>
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
<script src="../resources/js/manageMileStones.js"></script>
<script src="../resources/js/datePickerCommon.js"></script>
</html>