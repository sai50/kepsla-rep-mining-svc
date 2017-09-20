<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
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
				<div class="alert alert-success" style="display: none;"
					id="addDepartmentSuccessDiv">
					<strong><spring:message code="label.addDepartment.success"></spring:message></strong>
				</div>
				<div class="alert alert-danger alert-error"
					style="display: none; margin-left: -13px;"
					id="addDepartmentErrorDiv">
					<strong><spring:message code="label.globalError" /></strong>
				</div>
				<h1>Add Department</h1>
				<form id="addDepartmentForm">
					<h3>
						Organizational Grouping <font style="color: red">*</font>
					</h3>
					<hr>
					
<!----------------------------------Organization Groups DropDown ----------------------------------------->
					<c:choose>
						<c:when test="${ORGANIZATION_GROUPS eq 'EMPTY'}">
							<div class="form-group has-error"
								id="addDepartment-organizationGroupName-DropDownDiv">
								<label><spring:message code="label.OrgGroup" /><font
									style="color: red">*</font></label> <select class="form-control"
									disabled="disabled" id="addDepartment-organizationGroupId"
									style="width: 50%" onchange="getOrganizationBrand()">
									<option>No Organization Groups Found</option>
								</select>
							</div>
						</c:when>
						<c:otherwise>
							<div class="form-group" id="addDepartment-organizationGroupName-DropDownDiv">
								<label><spring:message code="label.OrgGroup" /><font
									style="color: red">*</font></label> <select class="form-control"
									id="addDepartment-organizationGroupId" style="width: 50%"
									onchange="getOrganizationBrand()">
									<c:forEach items="${organizationGroups}"
										var="organizationGroup">
										<option value="${organizationGroup.id}">${organizationGroup.organizationGroupName}</option>
									</c:forEach>
								</select>
							</div>
						</c:otherwise>
					</c:choose>
					
<!----------------------------------Organization Brands DropDown ----------------------------------------->
					<c:choose>
						<c:when test="${ORGANIZATION_BRANDS eq 'EMPTY'}">
							<div class="form-group has-error"
								id="addDepartment-organizationBrandName-DropDownDiv">
								<label><spring:message code="label.OrgBrand" /><font
									style="color: red">*</font></label> <select class="form-control"
									disabled="disabled" id="addDepartment-organizationBrandId"
									style="width: 50%" onchange="getOrganizationName()">
									<option>No Organization Brands Found</option>
								</select>
							</div>
						</c:when>
						<c:otherwise>
							<div class="form-group" id="addDepartment-organizationBrandName-DropDownDiv">
								<label><spring:message code="label.OrgBrand" /><font
									style="color: red">*</font></label><select class="form-control"
									id="addDepartment-organizationBrandId" style="width: 50%"onchange="getOrganizationName()">
									<c:forEach items="${organizationBrands}"
										var="organizationBrand">
										<option value="${organizationBrand.id}">${organizationBrand.organizationBrandName}</option>
									</c:forEach>
								</select>
							</div>
						</c:otherwise>
					</c:choose>
					
<!----------------------------------Organization Full name ---------------------------------------------------->
					<c:choose>
						<c:when test="${ORGANIZATION_NAME eq 'EMPTY'}">
							<div class="form-group has-error"
								id="addDepartment-organizationFullName-DropDownDiv">
								<label><spring:message code="label.organizationName" /><font
									style="color: red">*</font></label> <select class="form-control"
									disabled="disabled" id="addDepartment-organizationNameId"
									style="width: 50%" onchange="getDepartmentTypes()">
									<option>No Organization Name(s) Found</option>
								</select>
							</div>
						</c:when>
						<c:otherwise>
							<div class="form-group" id="addDepartment-organizationFullName-DropDownDiv">
								<label><spring:message code="label.organizationName" /><font
									style="color: red">*</font></label> <select class="form-control"
									id="addDepartment-organizationNameId" style="width: 50%" onchange="getDepartmentTypes()">
									<c:forEach items="${organizations}"
										var="organizationFullName">
										<option value="${organizationFullName.id}">${organizationFullName.organizationFullName}</option>
									</c:forEach>
								</select>
							</div>
						</c:otherwise>
					</c:choose>
					
<!-- ----------------------------Department Category-------------------------------------------------------- -->
				<h3>Department Category <font style="color: red">*</font></h3><hr>	
<!-- -----------------------------Department Type Dropdown-------------------------------------------------------- -->
		<c:choose>
			<c:when test="${DEPARTMENTS_CATEGORIES eq 'EMPTY'}">
				<div class="form-group has-error" id="departmentDepartmentTypeDropDownDiv">
					<label class="control-label"><spring:message code="label.departmentType"/></label>
					<select class="form-control" disabled="disabled" id="add-department-departmentTypeId" style="width: 50%" onchange="getDepartmentAttributes()">
						<option><spring:message code="empty.departmentTypes"/></option>
					</select>
				</div>
			</c:when>
			<c:otherwise>
				<div class="form-group" id="departmentDepartmentTypeDropDownDiv">
				<label class="control-label"><spring:message code="label.departmentType"/></label>
					<select class="form-control" id="add-department-departmentTypeId" style="width: 50%"onchange="getDepartmentAttributes()" >
						<c:forEach items="${departmentCategories}" var="departmentType" >
							<option value="${departmentType.id}">${departmentType.departmentType}</option>
						</c:forEach>
					</select>
				</div>
			</c:otherwise>
		</c:choose>
			
<!----------------------------------departmentName name ---------------------------------------------------->
					<div class="form-group" id="Add-departmentName-Error">
						<label><spring:message code="label.departmentName"/><font style="color: #a94442" >*</font></label> 
						<span style="color: #a94442" id="departmentName-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="departmentName" style="width: 50%"  placeholder="Enter departmentName Name" maxlength="50" > 
					</div>

<!-- -----------------------------Department Attributes----------------------------------------------------------------------- -->  
		 		<div id = "departmentAttributess">
		 			 <h3>
						Associated Attributes <font style="color: red">*</font>
					</h3>
				</div>
					<hr> 	 
				<div id="departmentAttributesDiv">
	   	  			<c:choose>
	   	  				<c:when test="${ATTRIBUTES eq 'EMPTY' }">
	   	  						<font style="color: red;"><b><spring:message code="empty.departmentAttributes"/></b></font><br>
	   	  				</c:when>
	   	  				<c:otherwise>
	   	  				<input type="hidden" id="attributesLength" value="${fn:length(attributes)}">
	   	  					<c:forEach items="${attributes}" var="attributes"  varStatus="loop">
	   	  					  <div class="form-group">
	   	  							<label>${attributes.attributeKey}</label> 
	   	  						<input style="width: 50%" type="text" placeholder="Please Enter ${attributes.attributeKey}" class="form-control" maxlength="50" id="attributeKeyValue_${loop.index}">
	   	  					 	<input type="hidden" id="attributeKeyId_${loop.index}" value="${attributes.id}">
	   	  					  </div>
	   	  					</c:forEach>
	   	  				</c:otherwise>
	   	  			</c:choose>
		   	  	</div>
		   	  	<div id="departmentAttributesEmptyDiv" style="display: none;">
	   	  			<font style="color: red;"><b><spring:message code="empty.departmentAttributes"/></b></font><br>
	   	  		</div>
	   	  		
<!-- ----------------------------Select Associated KPIS----------------------------------------------------------------->	
		  <div>
		  	<h3><spring:message code="label.selectAssociatedkpis"/></h3>
		  	<a href="#" onclick="">Click here to Go to KPI Master</a><hr>
		  	<div id="departmentSearchKpisDiv">
		  	<label><spring:message code="label.searchKPI"/></label><br> 
				<c:choose>
					<c:when test="${KPIS eq 'EMPTY' }">
						<font style="color: red"><b><spring:message code="empty.departmentKpis"/></b></font>
					</c:when>
					<c:otherwise>
						<input type=text list="departmentKpisDataList">
						<datalist id="departmentKpisDataList">
							<c:forEach items="${departmentKPIs}" var="kpi">
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
						<select id="departmentKpis" multiple size="5" style="width: 300px; float: left;">
							<c:forEach items="${kpiList}" var="kpi">
								<option value="${kpi.id}">${kpi.kpiName}</option>
							</c:forEach>
						</select>&nbsp;
						<a href="JavaScript:void(0);" id="add-kpis">Add&raquo;</a> 
						<a href="JavaScript:void(0);" id="remove-added-apis">&laquo;Remove</a> 
						<select	id="selectedDepartmentKpis" multiple size="5" style="width: 300px; float: right;margin-right: 225px;">
						</select>
					</div>
				</div><br> <br> <br> <br>
		  	</c:otherwise>
		  </c:choose>
		  </div>
		  </div>
		   <div id="departmentEmptyKpisDiv" style="display: none;">
		  		<font style="color: red"><b><spring:message code="empty.departmentKpis"/></b></font>
		  </div>
					
			<c:choose>
				<c:when test="${ORGANIZATION_GROUPS eq 'EMPTY' || ORGANIZATION_BRANDS eq 'EMPTY'|| ORGANIZATION_NAME eq 'EMPTY'}">
					<button type="submit" class="btn btn-default" disabled="disabled">Submit</button>
				</c:when>
				<c:otherwise>
					<button type="submit" class="btn btn-primary col-sm-3"id="createDepatmentSubmit">Save</button><!-- Go To Line Number 455 In addOrganization.js -->
				</c:otherwise>
			</c:choose>
		</form>
	</div>
</div>
</body>
<script src="../resources/js/addDepartment.js"></script>
</html>