<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editRoleFeatureModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editRoleFeature" class="form-horizontal" id="editRoleFeatureForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editRoleFeatureLabel">Edit Role Feature</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateRoleFeatureErrorDiv">
					<strong><spring:message code="label.globalError"/></strong>
				</div>
				<!-- -------------------Primary Role-------------------------------------- -->
				<div class="form-group" id="Edit-primaryRole-Error">
					<label><spring:message code="label.primaryParentRole"/></label>
					<select class="form-control" disabled="disabled">
						<option>${editRoleFeature.parentRole}</option>
					</select>
				</div>
				<input type="hidden" id="updatedRoleId" value="${editRoleFeature.id}">
		 	 <!-- -------------------Role Name-------------------------------------- -->
				<div class="form-group" id="Edit-role-Error">
					<label><spring:message code="label.roleName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-role-Error" class="help-inline"></span>
					<input	type="text" class="form-control" id="updatedRole" name="role" placeholder="Role" maxlength="50" value="${editRoleFeature.role}"> 
				</div>
			<!-- -----------------Role Description------------------------------->
				<div class="form-group" id="Edit-description-Error">
					<label><spring:message code="label.roleDesc"/><font style="color: #a94442">*</font></label> 
					<span style="color: #a94442" id="update-description-Error" class="help-inline"></span>
					<textarea class="form-control"  rows="3" name="description" id="updatedDescription" maxlength="100" placeholder="Description">${editRoleFeature.description}</textarea>
				</div>
			<!--------------------- Button --------------------------------------------->
				<button type="submit" class="btn btn-primary" id="editRoleFeatureButton" style="margin-left: -14px;"><spring:message code="label.update"/></button>
					<button type="button" class="btn btn-default" data-dismiss="modal"><spring:message code="label.close"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
</body>
 <script src="../resources/js/roleFeature.js"></script>
</html>