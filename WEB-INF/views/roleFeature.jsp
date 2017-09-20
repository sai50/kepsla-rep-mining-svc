<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<html>
<head>
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
	<!-- Fixed navbar -->
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addRole" data-toggle="tab" onclick="addNewRole()"">Add New Role</a>
			</li>
			<li><a href="#listAllRoleFeatures" data-toggle="tab" onclick="listCustomRoles()">List All Role Features</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
		<!-- --------------------Add New Role------------------------------------------ -->
		<div class="tab-pane active" id="addRole">
		<hr>
			<form class="form-horizontal" id="addRoleForm">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Create New Role</h4>
				</div>
				<div class="modal-body" style="margin-left: 10px;">
				<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="addRoleErrorDiv">
					<strong><spring:message code="label.globalError"/></strong>
				</div>
				<!-- -------------------Primary Role-------------------------------------- -->
				<div class="form-group" id="Add-primaryRole-Error">
					<label><spring:message code="label.primaryParentRole"/></label>
					<select class="form-control" id="roleId">
					<c:forEach items="${listAllRoles}" var="role">
						<option value="${role.id}">${role.role}</option>
					</c:forEach>
					</select>
				</div>
		 	 <!-- -------------------Role Name-------------------------------------- -->
				<div class="form-group" id="Add-role-Error">
					<label><spring:message code="label.roleName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="role-Error" class="help-inline"></span>
					<input	type="text" class="form-control" id="role" name="role" placeholder="Role" maxlength="50"> 
				</div>
			<!-- -----------------Role Description------------------------------->
				<div class="form-group" id="Add-description-Error">
					<label><spring:message code="label.roleDesc"/><font style="color: #a94442">*</font></label> 
					<span style="color: #a94442" id="description-Error" class="help-inline"></span>
					<textarea class="form-control"  rows="3" name="description" id="description" maxlength="100" placeholder="Description"></textarea>
				</div>
			<!--------------------- Button --------------------------------------------->
				<button type="submit" class="btn btn-primary" id="nextRoleFeatureButton" style="margin-left: -14px;"><spring:message code="label.next"/></button>
				</div>
			</form>
		</div>
		<!-- --------------------List All CustomRoles------------------------------------------ -->
		<div class="tab-pane" id="listAllRoleFeatures"></div>
	</div>
	<!-- ------------------Add Role Feature Div------------------------------------------------- -->
	<div id="addFeaturesDiv"></div>
	<!-- ------------------Edit Role Feature Div------------------------------------------------- -->
	<div id="editRoleFeatureDiv"></div>
	<!-- ------------------Show Role Feature Div------------------------------------------------- -->
	<div id="showRoleFeatureDiv"></div>
	<!-- ------------------Map Feature Div------------------------------------------------- -->
	<div id="mapRoleFeatureDiv"></div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/roleFeature.js"></script>
</html>