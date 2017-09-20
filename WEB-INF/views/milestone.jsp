<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<html>
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
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
<title><spring:message code="label.ghn"/></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active" style="float: right;"><a href="#milestoneTab" data-toggle="tab" ><spring:message code="label.milestones"/></a>
			</li>
		</ul>
		<div id="milestoneTab" class="tab-content">
		<br>
			<form id="milestoneForm">
				
				<div class="alert alert-success" style="display: none;"	id="saveMilestoneSuccessDiv">
					<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Milestone Added Successfully</strong>
				</div>
				
				<div class="alert alert-danger alert-error" style="display: none;"	id="saveMilestoneSuccessErrorDiv">
					<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>
				</div>
				
				<div class="alert alert-success" style="display: none;"	id="deleteMilestoneSuccessDiv">
							<strong><spring:message code="label.deleteMilestone.success"/></strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="deleteMilestoneErrorDiv">
				</div>
					
				<div class="row form-group col-sm-12">
					
					<select onchange="getMilestones()" class="form-control col-sm-4" style="width:auto" name="organizationName" id="organizationName">
						<option disabled selected>Select Organization</option>
						<c:forEach items="${organizations}" var="organization" >
							<option value="${organization.id}">${organization.organizationFullName}</option>
						</c:forEach>
					</select>
					
					<div class="form-group" id="save-repufactor-error">
					<span style="color: #a94442" id="repufactor-span-error" class="help-inline"></span>
						<div class="col-sm-3">
							<select id="repuFactorSelect" onchange="getMilestones()" name="repuFactorSelect"  class="form-control" style="width:auto" >
								<option selected disabled>Select Organization Repufactor</option>
								<option ><spring:message code="label.milestones.milestoneFor.departmentFactor"/></option>
								<%-- <option ><spring:message code="label.milestones.milestoneFor.languageFactor"/></option> --%>
								<option ><spring:message code="label.milestones.milestoneFor.kpiFactor"/></option>
								<option ><spring:message code="label.milestones.milestoneFor.sourceFactor"/></option>
								<option ><spring:message code="label.milestones.milestoneFor.repufactor"/></option>
							</select>
						</div>
					</div>
					
					<!-- <div class="col-sm-1" style="padding-top:0px;">
						<input type="button" class="btn btn-primary" value="Set Milestone" id="setMilestoneBtn" onclick ="showAddMilestone()">
					</div>  -->
					
					<div class='row' id='generalKpiTabButtons'>"
						<span style='float: left: '><a href='#' title='Add' id='setMilestoneBtn' onclick='showAddMilestone()'><img title='Add' alt='' src='../resources/images/add-icon.jpg'></a></span>&nbsp
						<span style='float: left: '><a href='#' title='List' onclick='getMilestones()'><img alt='' src='../resources/images/list-icon.jpg'></a></span>&nbsp
						<span style='float: left: '><a href='#' title='Delete' onclick='deleteMilestone()'><img alt='' src='../resources/images/delete.jpg'></a></span>
					</div>
					
				</div>
				
				<div class="row" id="milestoneTblDiv">
				
				</div>
				
			</form>
			</div>
			
			
			<!--Add New Repufactor Milestone Module-->
			<div class="modal fade" id="AddRepufactorMilestone" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog modalSmallWidth">
					<div class="modal-content moduleSmall-content">
						<div class="modal-header">
							<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
							<h1 class="modal-title" id="myModalLabel">Add Repufactor Milestone</h1>
						</div>
						<div class="modal-body">
							
							<span class="help-block mt10">Set Percentage<span class="mandatoryInput">*</span></span>
							<input type="text" class="form-control" placeholder="Enter Percentage" id="percentageRepufactorInput">
							
							<span class="help-block mt10">Set From Date<span class="mandatoryInput">*</span></span>
							<input id="setFromDateRepufactorInput" name="setFromDateRepufactorInput" type="date" class="form-control" placeholder="Set From Date">
							<span class="help-block mt10" >Set To Date<span class="mandatoryInput">*</span></span>
							<input id="setToDateRepufactorInput" name="setToDateRepufactorInput" type="date" class="form-control" placeholder="Set To Date">
							
						</div>
						<div class="modal-footer">
							<button class="btn btn-default PrimeBtn" type="button" data-dismiss="modal">Cancel</button>
							<button type="button" onclick="saveRepufactorMilestone()" class="btn btn-default PrimeBtn">Save</button>
						</div>
					</div>
				</div>
			</div>
		<!-- End of Add New Repufactor milestone Modal -->
		
		<!--Add New Department Milestone Module-->
			<div class="modal fade" id="AddDepartmentMilestone" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog modalSmallWidth">
					<div class="modal-content moduleSmall-content">
						<div class="modal-header">
							<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
							<h1 class="modal-title" id="myModalLabel">Add Department Milestone</h1>
						</div>
						<div id="departmentMilestoneModalBody" class="modal-body">
							
						</div>
						<div class="modal-footer">
							<button class="btn btn-default PrimeBtn" type="button" data-dismiss="modal">Cancel</button>
							<button type="button" onclick="saveDepartmentMilestone()" class="btn btn-default PrimeBtn">Save</button>
						</div>
					</div>
				</div>
			</div>
		<!-- End of Add New Department  milestone Modal -->
		
		<!--Add New kpi Milestone Module-->
			<div class="modal fade" id="AddKpiMilestone" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog modalSmallWidth">
					<div class="modal-content moduleSmall-content">
						<div class="modal-header">
							<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
							<h1 class="modal-title" id="myModalLabel">Add KPI Milestone</h1>
						</div>
						<div id="kpiMilestoneModalBody" class="modal-body">
							
						</div>
						<div class="modal-footer">
							<button class="btn btn-default PrimeBtn" type="button" data-dismiss="modal">Cancel</button>
							<button type="button" onclick="saveKpiMilestone()" class="btn btn-default PrimeBtn">Save</button>
						</div>
					</div>
				</div>
			</div>
		<!-- End of Add New Kpi  milestone Modal -->
		
		<!--Add New Source Milestone Module-->
			<div class="modal fade" id="AddSourceMilestone" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog modalSmallWidth">
					<div class="modal-content moduleSmall-content">
						<div class="modal-header">
							<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
							<h1 class="modal-title" id="myModalLabel">Add Source Milestone</h1>
						</div>
						<div id="sourceMilestoneModalBody" class="modal-body">
							
						</div>
						<div class="modal-footer">
							<button class="btn btn-default PrimeBtn" type="button" data-dismiss="modal">Cancel</button>
							<button type="button" onclick="saveSourceMilestone()" class="btn btn-default PrimeBtn">Save</button>
						</div>
					</div>
				</div>
			</div>
		<!-- End of Add New Source  milestone Modal -->
		
		
		
			<!-- <div id="generalKpiTabButtons">
				<span style="float: left: "><a href="#" title="Add" id="addGenerealKpiButton"><img title="Add" alt="" src="../resources/images/add-icon.jpg"></a></span>&nbsp;
				<span style="float: left: "><a href="#" title="List" onclick="listGeneralKpi()"><img alt="" src="../resources/images/list-icon.jpg"></a></span>&nbsp;
				<span style="float: left: "><a href="#" title="Delete" onclick="deleteGeneralKpi()"><img alt="" src="../resources/images/delete.jpg"></a></span>
			</div>
			<hr> -->
			<!-- --------------------General KPI----------------------------------------- -->
			<%-- <div class="tab-pane active" id="listGeneralKpiTab">
				<hr>
				<form role="form" id="listGeneralKpiForm">
					<table class='table table-striped table-bordered' id='listGeneralKpiTable'>
						<thead>
							<tr>
								<th><input type="checkbox" id="checkAllGeneralKpiCheckBox" style="margin-left: -7px;"></th>
								<th><spring:message code="label.kpi"/></th>
								<!-- <th><span style="float: right;"><a href="#" id="deleteAllGeneralKpiButton"><img alt="" src="../resources/images/delete-icon.png"></a></span></th> -->
							</tr>
						</thead>
						<tbody>
							<c:forEach items="${listKpiGeneralMaster}" var="generalKpi">
								<tr>
									<td><input type="checkbox" value="${generalKpi.id}" class="generalKpiCheckBox"></td>
									<td>${generalKpi.kpiName}</td>
<!-- 									<td><span style="float: right;"><a href="#"><img alt="" src="../resources/images/delete-icon.png"></a></span></td>
 -->								</tr>
							</c:forEach>
						</tbody>
					</table>
				</form>
			</div> --%>
			
		</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<!-- <script type="text/javascript">
	$(document).ready(function(){
		$('#listGeneralKpiTable').dataTable();
	});

</script> -->
<script src="../resources/js/milestone.js"></script>
<script src="../resources/js/moment.min.js"></script>
</html>