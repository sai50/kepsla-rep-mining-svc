<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<%@include file="includeCssFiles.jsp"%>
</head>
<body>
	<div id="loadMaskDiv"
		class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

		<div class="container">
			<div>
				<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
					<li id="OrganizationListView"><a data-toggle="tab"
						onclick="organization()" href="#"><h1>Edit Organization</h1></a></li>
				</ul>

			</div>
			<div id="editOrganization">
				<h3>Organization Group</h3>
				<div class="alert alert-success" style="display: none;"
					id="editOrganizationSuccessDiv">
					<strong><spring:message
							code="label.updateOrganization.success"></spring:message></strong>
				</div>
				<div class="alert alert-danger alert-error"
					style="display: none; margin-left: -13px;"
					id="editOrganizationErrorDiv">
					<strong><spring:message code="label.globalError" /></strong>
				</div>
				<form role="form" id="editOrganizationForm">
					<div class="form-group">
						<label><spring:message code="label.OrgBrand" /></label> <select
							id="editOrganizationBrand" class="form-control"
							disabled="disabled">
							<option value="${organizationBrand.organizationBrandName}">${organizationBrand.organizationBrandName}</option>
						</select>
					</div>
					<div class="form-group" id="Add-organizationDisplayName-Error">
						<label><spring:message code="label.organizationName" /></label> <span
							style="color: #a94442" id="organizationFullName-span-Error"
							class="help-inline"></span> <input type="text"
							class="form-control" id="editedOrganizationFullName"
							value="${organization.organizationFullName}"
							placeholder="Enter Organization Name" maxlength="50">
					</div>
					<hr>
					<div>
						<h3>Industry Group</h3>
						<div class="form-group">
							<label><spring:message code="label.industry" /></label> <select
								id="editIndustryType" class="form-control" disabled="disabled">
								<option value="${industryTypeMaster.industryType}">${industryTypeMaster.industryType}</option>
							</select>
						</div>
						<div class="form-group" style="height: 50px;">
							<h4>
								Associated Industry KPI(s)
							</h4>
							<select name="selectfrom" id="editedOrganizationKpis" multiple
								size="5" style="width: 300px; float: left;">
								<c:forEach items="${industryKPIs}" var="kpi">
									<option value="${kpi.id}">${kpi.kpiName}</option>
								</c:forEach>
							</select> <a href="JavaScript:void(0);" id="btn-add-Update">Add
								&raquo;</a> <a href="JavaScript:void(0);" id="btn-remove-Update">&laquo;
								Remove</a> <select name="selectto" id="editedSelectedOrganizationKpis"
								multiple size="5" style="width: 300px; float: right;">
								<c:forEach var="h" items="${industryKPIs}">
									<option value="${h.id}">${h.kpiName}</option>
								</c:forEach>
							</select>
						</div>
						<br> <br> <br>
						<div>
							<h4>Associated Organization Attribute</h4>
							<input type="hidden" id="attributesLength" value="${fn:length(attributesValue)}">
	   	  					<c:forEach items="${attributesValue}" var="attribute"  varStatus="loop">
	   	  					  <div class="form-group"><label>${attribute.attributeKey}</label>
	   	  						<input style="width: 50%" type="text" value ="${attribute.attributeValue}" class="form-control" maxlength="50" id="attributeKeyValue_${loop.index}">
	   	  					 	<input type="hidden" id="attributeKeyId_${loop.index}" value="${attribute.id}">
	   	  					  </div>
	   	  					</c:forEach>
						</div>
					</div>
					<div>
					<hr>
						<h3>Geo Location</h3>
						<div class="form-group">
							<label>Area Name</label> <select id="editGeoArea"
								class="form-control" disabled="disabled">
								<option value="${geoArea.geoAreaName}">${geoArea.geoAreaName}</option>
							</select>
						</div>

						<div class="form-group" style="height: 50px;">
						
								<select name="selectfrom" id="editedLocationTypes" multiple
									size="5" style="width: 300px; float: left;">
									<c:forEach var="geoTypesList" items="${geoTypes}">
										<option value="${geoTypesList.id}">${geoTypesList.geoType}</option>
									</c:forEach>
								</select> <a href="JavaScript:void(0);" id="btn-add-Update">Add
									&raquo;</a> <a href="JavaScript:void(0);" id="btn-remove-Update">&laquo;
									Remove</a> <select name="selectto" id="editedSelectedLocationTypes"
									multiple size="5" style="width: 300px; float: right;">
									 <c:forEach var="geoTypes" items="${geoTypes}">
	               			  			<option value="${geoTypes.id}">${geoTypes.geoType}</option>
	               			    </c:forEach> 
								</select>
							</div>
						</div><br> <br> <br> <br>
						<input type="hidden" id="editedOrganizationId" value="${organization.id}"/>
						<button type="submit" class="btn btn-primary">Update</button>
				</form>
			</div>
			<br> <br> <br> <br>
		</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/organization.js"></script>
</html>