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
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addAmenityRatePlan" data-toggle="tab">Add Amenity Rate Plan</a>
			</li>
			<li><a href="#listAmenityRatePlan" data-toggle="tab" onclick="listAllAmenityRatePlan()">List Of Amenity Rate Plan</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New AmenityRatePlan Name------------------------------------------ -->
			<div class="tab-pane active" id="addAmenityRatePlan">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successAmenityRatePlanDiv">
					<strong>AmenityRatePlan Created Successfully</strong>
				</div>
				
				
				<%-- <c:choose>
					<c:when test="${RATEPLANNAME_EMPTY eq 'TRUE'}">
						<div class="alert alert-danger alert-error" style="margin-left: -13px;">
							<strong><spring:message code="empty.custom.roles"/></strong>
						</div>
					</c:when>
					<c:otherwise>
						<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="errorAmenityRatePlanDiv">
							<strong><spring:message code="label.globalError"/></strong>
						</div>
					</c:otherwise>
				</c:choose>	 --%>
				
			 <div class="alert alert-danger alert-error"	id="addAmenityRatePlanDiv" style="display: none;">
				<strong><spring:message code="label.globalError"/></strong>
				</div> 
				<form role="form" id="addAmenityRatePlanForm">
					<!-- -------------------AmenityRatePlan Name-------------------------------------- -->
					<div class="form-group" id="ratePlanType-Error">
						<label><spring:message code="label.AmenityRatePlanName"/><font style="color: #a94442">*</font></label> 
						<span style="color: #a94442" id="amenityRatePlanName-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="amenityRatePlanName" name="amenityRatePlanType" placeholder="Rate Plan Name" maxlength="50"> 
					</div>
					<!-- -----------------AmenityRatePlan Type Description------------------------------->
					<div class="form-group" id="amenityRatePlanTypeDesc-Error">
						<label><spring:message code="label.amenityRatePlanDescription"/></label> 
						<textarea class="form-control" rows="3" name="amenityRatePlanTypeDescription" id="amenityRatePlanTypeDescription" maxlength="100" placeholder="Amenity Rate Plan Description"></textarea>
					</div>
					<!--------------------- Button --------------------------------------------->
					<%-- <input type="button" class="btn btn-primary"  onclick="savePoiType()" value="<spring:message code="label.save"/>"> --%>
					<button type="submit" class="btn btn-primary" id="saveAmenityRatePlanType"><spring:message code="label.save"/></button>

				</form>
			</div>
			<!-- --------------------List All Place Of Interest Types------------------------------------------ -->
			<div class="tab-pane" id="listAmenityRatePlan">
			</div>
		</div>
	</div>
	<div id="editAmenityRatePlanDiv"></div>
	
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/amenityRatePlan.js"></script>
</html>