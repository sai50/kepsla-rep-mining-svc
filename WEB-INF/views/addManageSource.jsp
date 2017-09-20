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
			<li class="active"><a href="#addManageSource" data-toggle="tab">Add New ManageSource Type</a>
			</li>
			<li><a href="#listManageSource" data-toggle="tab" onclick="listAllManageSource()">List Of ManageSource Types</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New ManageSource------------------------------------------ -->
			<div class="tab-pane active" id="addManageSource">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successManageSourceDiv">
					<strong>ManageSource Type Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error"	id="errorManageSourceDiv" style="display: none;">
				<strong><spring:message code="label.globalError"/></strong>
				</div>
				
				
				<form role="form" id="addManageSourceForm">
					<!-- -------------------ManageSource Name-------------------------------------- -->
					<div class="form-group" id="manageSourceType-Error">
						<label><spring:message code="label.manageSourceName"/><font style="color: red">*</font></label> 
						<span style="color: #a94442" id="manageSourceName-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="manageSourceName" name="manageSourceName" placeholder="Source Name" maxlength="50"> 
					</div>
					
					
					<!-- -----------------ManageSource Base Url Description------------------------------->
					<div class="form-group" id="manageSourceTypeDesc-Error">
						<label><spring:message code="label.manageSourceBaseUrl"/><font style="color: red">*</font></label> 
						<span style="color: #a94442" id="manageSourceUrl-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control"  name="manageSourceTypeDescription" id="manageSourceUrl" maxlength="200" placeholder="Source Base Url"></input>
					</div>
					
					<!-- -----------------Manage Source Type Description------------------------------->
					<div class="form-group" id="manageSourceTypeDesc-Error">
						<label><spring:message code="label.manageSourceType"/></label> 
					 <select class="form-control" id="manageSourceType" name="manageSourceTypeDescription"> 
						<option value="Blog">Blog</option>
						<option value="ReviewSite">Review Site</option>
                        <option value="SocialNetworkingSite">Social Networking Site</option>
                        <option value="OtherInformationSite">Other Information Site</option>
   
                       </select>
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="manageSourceTypeDesc-Error"></span>
					</div>
					
					<!--------------------- Button --------------------------------------------->
					<%-- <input type="button" class="btn btn-primary"  onclick="saveManageSourceType()" value="<spring:message code="label.save"/>"> --%>
					<button type="submit" class="btn btn-primary" id="saveManageSourceType"><spring:message code="label.save"/></button>

				</form>
			</div>
			<!-- --------------------List All ManageSource Types------------------------------------------ -->
			<div class="tab-pane" id="listManageSource">
			</div>
		</div>
	</div>
	<div id="editManageSourceDiv"></div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/manageSource.js"></script>
</html>