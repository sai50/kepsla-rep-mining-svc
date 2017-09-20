<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>

<body>
	<div class="modal fade" id="editDepartmentModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="department" class="form-horizontal" id="editDepartmentForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title">Edit Department Name</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="editDepartmentErrorDiv">
				</div>
					<div class="form-group">
						<label>Organization Name </label> 
						<select class="form-control" disabled="disabled">
							<option value="${department.organizationFullName.organizationFullName}">${department.organizationFullName.organizationFullName}</option>
						</select>
					</div>
					<div class="form-group">
					<label class="control-label"><spring:message code="label.departmentType"/></label>
					<select class="form-control" disabled="disabled" id="add-department-departmentTypeId" onchange="getDepartmentAttributes()" >
						<c:forEach items="${departmentCategories}" var="departmentType" >
							<option value="${departmentType.id}">${departmentType.departmentType}</option>
						</c:forEach>
					</select>
					</div>
					<div class="form-group" id="Edit-departmentName-Error">
						<label>Department Name<font style="color: red">*</font></label> 
						<span style="color: #a94442" id="Edit-departmentName-span-Error" class="help-inline"></span>
						<textarea class="form-control"  rows="1" name="departmentName" id="editedDepartmentName" maxlength="100" placeholder="Department Name">${department.departmentName}</textarea>
					</div>
					<div>
					<input type="hidden" id="attributesLength" value="${fn:length(attributesValue)}">
	   	  					<c:forEach items="${attributesValue}" var="attribute"  varStatus="loop">
	   	  					  <div class="form-group"><label>${attribute.attributeKey}</label>
	   	  						<input style="width: 50%" type="text" value ="${attribute.attributeValue}" class="form-control" maxlength="50" id="attributeKeyValue_${loop.index}">
	   	  					 	<input type="hidden" id="attributeKeyId_${loop.index}" value="${attribute.id}">
	   	  					  </div>
	   	  					</c:forEach>
	   	  			</div>
					<div class="form-group" style="height: 50px;">
					     <div class=""> 
							   <select name="selectfrom" id="editeddepartmentKpis" multiple size="5" style="width:300px; float:left;">
								<c:forEach items="${departmentKPIs}" var="kpi">
								<option value="${kpi.id}">${kpi.kpiName}</option>
							</c:forEach>
							   </select>
							    <a href="JavaScript:void(0);" id="btn-add-Update">Add &raquo;</a>
							    <a href="JavaScript:void(0);" id="btn-remove-Update">&laquo; Remove</a>
							   <select name="selectto" id="editedSelectedDepartmentKpis" multiple size="5" style="width:300px; float:right;">
							    <c:forEach var="h" items="${departmentKPIs1}">
	               			  			<option value="${h.id}">${h.kpiName}</option>
	               			    </c:forEach>
							   </select>
						</div>	
           			</div>
           			<br><br>
					<input type="hidden" value="${department.id}" id="editedDepartmentId">
					<button type="submit" class="btn btn-primary" style="margin-left: -14px;"><spring:message code="label.update"/></button>
					<button type="button" class="btn btn-default" data-dismiss="modal"><spring:message code="label.close"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
 <script src="../resources/js/organization.js"></script>
</body>
