<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="includeHeaders.jsp"%>
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
	<!-- Fixed navbar -->
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	<div class="container">
		<div class="row">
			<h2 style="color: green;">
			</h2>
			<hr>
		</div>
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addOrganization" data-toggle="tab" onclick="addOrganization();">Add New Organization Type</a>
			</li>
			<li id="list"><a href="#listOfOrganizationTypes" data-toggle="tab" onclick="listOfOrganizationTypes()">List Of Organization Types</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<div class="tab-pane active" id="newOrganizationType">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successOrganizationTypeDiv">
					<strong>Organization Type Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="errorOrganizationTypeDiv">
					<strong>Errors Occured.</strong>
				</div>
				<form role="form" id="addOrganizationTypeForm">
					<div class="form-group" id="OrganizationType-Error">
						<label><spring:message code="label.OrganizationType"/></label> 
						<input	type="text" class="form-control" id="organizationType" name="OrganizationType" placeholder="Organization Type" maxlength="50"> 
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="organizationTypeError"></span>
					</div>
					<div class="form-group" id="mappedIndianType-Error">
						<label><spring:message code="label.MappedIndianType"/></label> 
						<input type="text" class="form-control" id="MappedIndianType"  placeholder="Mapped Indian Type"></input>
					</div>
					<div class="form-group" id="organizationTypeDesc-Error">
						<label><spring:message code="label.OrganizationTypeDesc"/></label> 
						<textarea class="form-control" rows="3" name="OrganizationTypeDescription" id="OrganizationTypeDescription" maxlength="100" placeholder="Organization Type Description"></textarea>
					</div>
					<button type="submit" class="btn btn-default" id="saveOrganizationType">Submit</button>
				</form>
			</div>
			<div class="tab-pane" id="listOfOrganizationTypes">
			</div>
		</div>
	</div>
<div class="modal fade" id="editOrganizationTypesModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="editOrganizationType">Edit Organization Type</h4>
				</div>
				<div class="modal-body" style="margin-left: 10px;" id="organizationTypesBody">
				</div>
			</div>
</div>
</div>
</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/organizationTypes.js"></script>
</html>