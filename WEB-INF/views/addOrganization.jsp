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
		<div class="container">
			<div class="alert alert-success" style="display: none;"	id="addOrganizationSuccessDiv">
					<strong><spring:message code="label.organization.done"></spring:message></strong>
			</div>
			<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="addOrganizationErrorDiv">
					<strong><spring:message code="label.globalError"/></strong>
			</div>
			<h1>Add Organization</h1>
			<form id="addOrganizationForm">
			<h3>Organizational Grouping <font style="color: red">*</font></h3><hr>
				<!----------------------------------Organization Groups DropDown ----------------------------------------->
				<c:choose>
					<c:when test="${ORGANIZATION_GROUPS eq 'EMPTY'}">
						<div class="form-group has-error" id="organizationGroupDropDownDiv">
							<label><spring:message code="label.OrgGroup" /><font style="color: red">*</font></label>
							<select class="form-control" disabled="disabled" id="addOrganization-organizationGroupId" style="width: 50%" onchange=""><!-- Go to Line Number 36 in addOrganization.js -->
								<option>No Organization Groups Found</option>
							</select>
						</div>
					</c:when>
					<c:otherwise>
						<div class="form-group" id="organizationGroupDropDownDiv">
							<label><spring:message code="label.OrgGroup" /><font style="color: red">*</font></label>
							<select class="form-control" id="addOrganization-organizationGroupId" style="width: 50%" onchange="()"><!-- Go to Line Number 36 in addOrganization.js -->
								<c:forEach items="${organizationGroups}" var="organizationGroup">
									<option value="${organizationGroup.id}">${organizationGroup.organizationGroupName}</option>
								</c:forEach>
							</select>
						</div>
					</c:otherwise>
				</c:choose>
				<!----------------------------------Organization Brands DropDown ----------------------------------------->
				<c:choose>
					<c:when test="${ORGANIZATION_BRANDS eq 'EMPTY'}">
						<div class="form-group has-error" id="organizationBrandDropDownDiv">
							<label><spring:message code="label.OrgBrand" /><font style="color: red">*</font></label>
							<select class="form-control" disabled="disabled" id="addOrganization-organizationBrandId" style="width: 50%">
								<option>No Organization Brands Found</option>
							</select>
						</div>
					</c:when>
					<c:otherwise>
						<div class="form-group" id="organizationBrandDropDownDiv">
							<label><spring:message code="label.OrgBrand" /><font style="color: red">*</font></label>
							<select class="form-control" id="addOrganization-organizationBrandId" style="width: 50%">
								<c:forEach items="${organizationBrands}" var="organizationBrand">
									<option value="${organizationBrand.id}">${organizationBrand.organizationBrandName}</option>
								</c:forEach>
							</select>
						</div>
					</c:otherwise>
				</c:choose>
			<!----------------------------------Organization Full name ---------------------------------------------------->
			<div class="form-group" id="Add-organizationDisplayName-Error">
				<label><spring:message code="label.organizationName"/><font style="color: #a94442">*</font></label> 
				<span style="color: #a94442" id="organizationFullName-span-Error" class="help-inline"></span>
				<input	type="text" class="form-control" id="organizationFullName"  placeholder="Enter Organization Name" maxlength="50" > 
			</div>
			<!-- ----------------------------Classification------------------------------------------------------------------ -->
			<h3>Classification <font style="color: red">*</font></h3><hr>
			<!----------------------------------Industry DropDown ----------------------------------------->
				<c:choose>
					<c:when test="${INDUSTRY_TYPES eq 'EMPTY'}">
						<div class="form-group has-error" id="addOrganization-industryType-DropDownDiv">
							<label><spring:message code="label.industry" /><font style="color: red">*</font></label>
							<select class="form-control" disabled="disabled" id="addOrganization-industryTypeId" style="width: 50%" onchange="getSegmentCategory()"><!-- Go to Line Number 71 in addOrganization.js -->
								<option><spring:message code="empty.industryType"/></option>
							</select>
						</div>
					</c:when>
					<c:otherwise>
						<div class="form-group" id="addOrganization-industryType-DropDownDiv">
							<label><spring:message code="label.industry" /><font style="color: red">*</font></label>
							<select class="form-control" id="addOrganization-industryTypeId" style="width: 50%" onchange="getSegmentCategory()"><!-- Go to Line Number 71 in addOrganization.js -->
								<c:forEach items="${industryTypes}" var="industryType">
									<option value="${industryType.id}">${industryType.industryType}</option>
								</c:forEach>
							</select>
						</div>
					</c:otherwise>
				</c:choose>
			<!----------------------------------Segment Category DropDown ----------------------------------------->
				<c:choose>
					<c:when test="${SEGMENT_CATEGORIES eq 'EMPTY'}">
						<div class="form-group has-error" id="addOrganization-segmentCategory-DropDownDiv">
							<label><spring:message code="label.segementCategory" /><font style="color: red">*</font></label>
							<select class="form-control" disabled="disabled" id="addOrganization-segmentCategoryId" style="width: 50%" onchange="getOrganizationCategory()"><!-- Go to Line Number 116 in addOrganization.js -->
								<option><spring:message code="empty.segmentCategory"/></option>
							</select>
						</div>
					</c:when>
					<c:otherwise>
						<div class="form-group" id="addOrganization-segmentCategory-DropDownDiv">
							<label><spring:message code="label.segementCategory" /><font style="color: red">*</font></label>
							<select class="form-control" id="addOrganization-segmentCategoryId" style="width: 50%" onchange="getOrganizationCategory()"><!-- Go to Line Number 116 in addOrganization.js -->
								<c:forEach items="${segmentCategories}" var="segmentCategory">
									<option value="${segmentCategory.id}">${segmentCategory.segmentCategory}</option>
								</c:forEach>
							</select>
						</div>
					</c:otherwise>
				</c:choose>
				<!----------------------------------Organization Type DropDown ----------------------------------------->
				<c:choose>
					<c:when test="${ORGANIZATION_TYPES eq 'EMPTY'}">
						<div class="form-group has-error" id="addOrganization-organizationType-DropDownDiv">
							<label><spring:message code="label.organizationCategory" /><font style="color: red">*</font></label>
							<select class="form-control" disabled="disabled" id="addOrganization-organizationCategoryId" style="width: 100%" onchange="getDepartmentTypes()">
								<option><spring:message code="empty.organizationCategory"/></option>
							</select>
						</div>
					</c:when>
					<c:otherwise>
						<div class="form-group" id="addOrganization-organizationType-DropDownDiv">
							<label><spring:message code="label.organizationCategory" /><font style="color: red">*</font></label>
							<select class="form-control" id="addOrganization-organizationCategoryId" style="width: 50%" onchange="getDepartmentTypes()">
								<c:forEach items="${organizationTypes}" var="organizationType">
									<option value="${organizationType.id}">${organizationType.organizationType}</option>
								</c:forEach>
							</select>
						</div>
					</c:otherwise>
				</c:choose>
			<!----------------------------------Organization Geo Location(s) ----------------------------------------->	
			<h3>Organization Geo Locations <font style="color: red">*</font></h3><hr>
				<!-- -----------------------------Country DropDown-------------------------------------------------------- -->
					<c:choose>
						<c:when test="${COUNTRY_LIST_EMPTY eq 'TRUE'}">
							<div class="form-group has-error" id="organizationCitiesDropDownDiv">
								<label class="control-label"><spring:message code="label.Country"/></label>
								<select class="form-control" disabled="disabled" id="add-organization-CountryId" style="width: 50%" onchange="getCities()">
									<option>No Countries Found</option>
								</select>
							</div>
						</c:when>
						<c:otherwise>
							<div class="form-group" id="organizationCitiesDropDownDiv">
							<label class="control-label"><spring:message code="label.Country"/><font style="color: red">*</font></label>
								<select class="form-control" id="add-organization-CountryId" style="width: 50%" onchange="getCities()">
									<c:forEach items="${listCountries}" var="country">
										<option value="${country.id}">${country.geoCountryName}</option>
									</c:forEach>
								</select>
							</div>
						</c:otherwise>
					</c:choose>
			<!-- -----------------------------Cities DropDown-------------------------------------------------------- -->
					<c:choose>
						<c:when test="${CITIES_LIST_EMPTY eq 'TRUE'}">
							<div class="form-group has-error" id="organizationCitiesDropDownDiv">
								<label class="control-label"><spring:message code="label.City"/><font style="color: red">*</font></label>
								<select class="form-control" disabled="disabled" id="add-organization-CityId" style="width: 50%" onchange="getAreas()">
									<option>No Cities Found</option>
								</select>
							</div>
						</c:when>
						<c:otherwise>
							<div class="form-group" id="organizationCitiesDropDownDiv">
							<label class="control-label"><spring:message code="label.City"/><font style="color: red">*</font></label>
								<select class="form-control" id="add-organization-CityId" style="width: 50%" onchange="getAreas()">
									<c:forEach items="${listCities}" var="city">
										<option value="${city.id}">${city.geoCityName}</option>
									</c:forEach>
								</select>
							</div>
						</c:otherwise>
					</c:choose>
			<!-- -----------------------------Area DropDown-------------------------------------------------------- -->
					<c:choose>
						<c:when test="${AREA_LIST_EMPTY eq 'TRUE'}">
							<div class="form-group has-error" id="organizationAreasDropDownDiv">
								<label class="control-label"><spring:message code="label.Area"/><font style="color: red">*</font></label>
								<select class="form-control" disabled="disabled" id="add-organization-AreaId" style="width: 50%" onchange="locationsByAreaId()">
									<option>No Areas Found</option>
								</select>
							</div>
						</c:when>
						<c:otherwise>
							<div class="form-group" id="organizationAreasDropDownDiv">
							<label class="control-label"><spring:message code="label.Area"/><font style="color: red">*</font></label>
								<select class="form-control" id="add-organization-AreaId" style="width: 50%" onchange="locationsByAreaId()">
									<c:forEach items="${listAreas}" var="area">
										<option value="${area.id}">${area.geoAreaName}</option>
									</c:forEach>
								</select>
							</div>
						</c:otherwise>
						</c:choose>	
			<!-- -----------------------------Select Near By Locations-------------------------------------------------------- -->	
			<div>
				<h3><spring:message code="label.selectNearByLocations"/><font style="color: red">*</font></h3>
				<a href="#" onclick="geoLocation()">Click here to Go to GEO	Master</a><hr>
				<div id="organizationSearchLocationsDiv">
				<label><spring:message code="label.searchLocations"/></label><br> 
				<c:choose>
					<c:when test="${LOCATIONS eq 'EMPTY' }">
						<font style="color: red"><b><spring:message code="empty.area.locations"/></b></font>
					</c:when>
					<c:otherwise>
						<input type=text list="organizationLocations">
						<datalist id="organizationLocations">
							<c:forEach items="${locationsList}" var="location">
								<option value="${location.geoName}">${location.id}</option>
							</c:forEach>
						</datalist>
					</c:otherwise>
				</c:choose>
			<hr>
		  <!-- -----------------Locations MultiSelect DropDown--------------------------------------------------------------------->
		  <c:choose>
		  	<c:when test="${LOCATIONS eq 'EMPTY' }">
		  	</c:when>
		  	<c:otherwise>
		  		<div class="form-group">
					<div>
						<select id="organizationAreaLocations" multiple size="5" style="width: 300px; float: left;">
							<c:forEach items="${locationsList}" var="location">
								<option value="${location.id}">${location.geoName}</option>
							</c:forEach>
						</select>&nbsp;
						<a href="JavaScript:void(0);" id="add-locations">Add&raquo;</a> 
						<a href="JavaScript:void(0);" id="remove-added-locations">&laquo;Remove</a> 
						<select	 id="selectedOrganizationAreaLocations" multiple size="5" style="width: 300px; float: right;margin-right: 225px;">
						</select>
					</div>
				</div><br> <br> <br> <br>
		  	</c:otherwise>
		  </c:choose>
		  </div>
		  </div>	
		  <div id="organizationEmptyLocationsDiv" style="display: none;">
		  		<font style="color: red"><b><spring:message code="empty.area.locations"/></b></font>
		  </div>
		  <!-- ----------------------------Select Associated KPIS----------------------------------------------------------------->	
		  <div>
		  	<h3><spring:message code="label.selectAssociatedkpis"/></h3>
		  	<a href="#" onclick="">Click here to Go to GEO Master</a><hr>
		  	<div id="organizationSearchKpisDiv">
		  	<label><spring:message code="label.searchKPI"/></label><br> 
				<c:choose>
					<c:when test="${KPIS eq 'EMPTY' }">
						<font style="color: red"><b><spring:message code="empty.kpis"/></b></font>
					</c:when>
					<c:otherwise>
						<input type=text list="organizationKpisDataList">
						<datalist id="organizationKpisDataList">
							<c:forEach items="${industryKPIs}" var="kpi">
								<option value="${kpi.kpiName}">${kpi.id}</option>
							</c:forEach>
						</datalist>
					</c:otherwise>
				</c:choose>
		   <!-- -----------------KPIS MultiSelect DropDown--------------------------------------------------------------------->
		  <c:choose>
		  	<c:when test="${KPIS eq 'EMPTY' }">
		  	</c:when>
		  	<c:otherwise>
		  		<div class="form-group">
					<div>
						<select id="organizationKpis" multiple size="5" style="width: 300px; float: left;">
							<c:forEach items="${industryKPIs}" var="kpi">
								<option value="${kpi.id}">${kpi.kpiName}</option>
							</c:forEach>
						</select>&nbsp;
						<a href="JavaScript:void(0);" id="add-kpis">Add&raquo;</a> 
						<a href="JavaScript:void(0);" id="remove-added-apis">&laquo;Remove</a> 
						<select	id="selectedOrganizationKpis" multiple size="5" style="width: 300px; float: right;margin-right: 225px;">
						</select>
					</div>
				</div><br> <br> <br> <br>
		  	</c:otherwise>
		  </c:choose>
		  </div>
		  </div>
		   <div id="organizationEmptyKpisDiv" style="display: none;">
		  		<font style="color: red"><b><spring:message code="empty.kpis"/></b></font>
		  </div>
		   <!-- -----------------Organization Attribute Values--------------------------------------------------------------------->
		   <div>
		   	  <h3><spring:message code="label.organizationAttributeValues"/></h3>
		   	  <hr>
		   <!-- -----------------------------Department Type Dropdown-------------------------------------------------------- -->
					<%-- <c:choose>
						<c:when test="${DEPARTMENTS_CATEGORIES eq 'EMPTY'}">
							<div class="form-group has-error" id="organizationDepartmentTypeDropDownDiv">
								<label class="control-label"><spring:message code="label.departmentType"/></label>
								<select class="form-control" disabled="disabled" id="add-organization-departmentTypeId" style="width: 100%">
									<option><spring:message code="empty.departmentTypes"/></option>
								</select>
							</div>
						</c:when>
						<c:otherwise>
							<div class="form-group" id="organizationDepartmentTypeDropDownDiv">
							<label class="control-label"><spring:message code="label.departmentType"/></label>
								<select class="form-control" id="add-organization-departmentTypeId" style="width: 50%">
									<c:forEach items="${departmentCategories}" var="departmentType">
										<option value="${departmentType.id}">${departmentType.departmentType}</option>
									</c:forEach>
								</select>
							</div>
						</c:otherwise>
					</c:choose> --%>
			</div>
		   	<!-- -----------------------------Attributes----------------------------------------------------------------------- -->  
		   	 <div id="attributesDiv">
	   	  			<c:choose>
	   	  				<c:when test="${ATTRIBUTES eq 'EMPTY' }">
	   	  						<font style="color: red;"><b><spring:message code="empty.attributes"/></b></font><br>
	   	  				</c:when>
	   	  				<c:otherwise>
	   	  				<input type="hidden" id="attributesLength" value="${fn:length(attributes)}">
	   	  					<c:forEach items="${attributes}" var="attribute"  varStatus="loop">
	   	  					  <div class="form-group">
	   	  							<label>${attribute.attributeKey}</label> 
	   	  						<input type="text" placeholder="Please Enter ${attribute.attributeKey}" class="form-control" maxlength="50" id="attributeKeyValue_${loop.index}">
	   	  					 	<input type="hidden" id="attributeKeyId_${loop.index}" value="${attribute.id}">
	   	  					  </div>
	   	  					</c:forEach>
	   	  				</c:otherwise>
	   	  			</c:choose>
		   	  	</div>
		   	  	<div id="attributesEmptyDiv" style="display: none;">
	   	  			<font style="color: red;"><b><spring:message code="empty.attributes"/></b></font><br>
	   	  		</div>
			<!-- ---------------------------------Button-------------------------------------------------------------------------->		
			<c:choose>
				<c:when test="${ORGANIZATION_GROUPS eq 'EMPTY' || ORGANIZATION_BRANDS eq 'EMPTY'|| ORGANIZATION_TYPES eq 'EMPTY' || SEGMENT_CATEGORIES eq 'EMPTY' || INDUSTRY_TYPES eq 'EMPTY' }">
					<button type="submit" class="btn btn-default" disabled="disabled">Submit</button>
				</c:when>
				<c:otherwise>
					<button type="submit" class="btn btn-default">Submit</button><!-- Go To Line Number 455 In addOrganization.js -->
				</c:otherwise>
			</c:choose>
			</form>
		</div>
	</div>
</body>
<script  src="../resources/js/addOrganization.js"></script>
</html>	