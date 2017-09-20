<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editUserModal"  style="margin-top: 40px;margin-left: -10px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
			<form:form class="form-horizontal" id="editUserForm" modelAttribute="user">
			<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title">Edit UserManagement</h4>
			</div>
			<div class="modal-body" style="margin-left: 10px;">
					<!-- -Global Error Div -->
				<c:choose>
					<c:when test="${ROLES_EMPTY eq 'TRUE'}">
						<div class="alert alert-danger alert-error" style="margin-left: -13px;">
							<strong><spring:message code="empty.custom.roles"/></strong>
						</div>
					</c:when>
					<c:otherwise>
						<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="editUserErrorDiv">
							<strong><spring:message code="label.globalError"/></strong>
						</div>
					</c:otherwise>
				</c:choose>		
				<!-- -------------------User Role-------------------------------------- -->
				<div class="form-group" id="Edit-userRole-Error">
					<label><spring:message code="label.user.role"/></label>
					<select class="form-control" id="updatedUserRoleId" disabled="disabled">
						<option value="${role}">${role}</option>
				</select>
				</div>
			 <!-- -------------------User Name-------------------------------------- -->
				<div class="form-group" id="Edit-userName-Error">
					<label><spring:message code="label.username"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-userName-Error" class="help-inline"></span>
					<input type="text" value="${user.userName}" class="form-control" id="updatedUserName" name="userName" placeholder="User Name" maxlength="50"> 
					<input type="hidden" value="${user.id}" id="updatedUserId">
				</div>
		 	  <!-- -------------------First Name-------------------------------------- -->
				<div class="form-group" id="Edit-userFirstName-Error">
					<label><spring:message code="label.firstName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-userFirstName-Error" class="help-inline"></span>
					<input type="text" value="${user.userFirstName}" class="form-control" id="updatedUserFirstName" name="userFirstName" placeholder="First Name" maxlength="50"> 
				</div>
				<!-- -------------------Middle Name-------------------------------------- -->
				<div class="form-group" id="Edit-userMiddleName-Error">
					<label><spring:message code="label.middleName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-userMiddleName-Error" class="help-inline"></span>
					<input type="text" value="${user.userMiddleName}" class="form-control" id="updatedUserMiddleName" name="userMiddleName" placeholder="Middle Name" maxlength="50"> 
				</div>
				<!-- -------------------Last Name-------------------------------------- -->
				<div class="form-group" id="Edit-userLastName-Error">
					<label><spring:message code="label.lastName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-userLastName-Error" class="help-inline"></span>
					<input type="text" value="${user.userLastName}" class="form-control" id="updatedUserLastName" name="userLastName" placeholder="Last Name" maxlength="50"> 
				</div>
				<!-- -------------------Primary Email-Id-------------------------------------- -->
				<div class="form-group" id="Edit-primaryEmail-Error">
					<label><spring:message code="label.primary.email.id"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-primaryEmail-Error" class="help-inline"></span>
					<input type="text" value="${user.primaryEmail}" class="form-control" id="updatedPrimaryEmail" name="primaryEmail" placeholder="Primary Email-id" maxlength="50"> 
				</div>
				<!-- -------------------Confirm Primary Email-Id-------------------------------------- -->
				<div class="form-group" id="Edit-confirmPrimaryEmailId-Error">
					<label><spring:message code="label.confirm.primary.email.id"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-confirmPrimaryEmailId-Error" class="help-inline"></span>
					<input type="text" value="${user.primaryEmail}" class="form-control" id="updatedConfirmPrimaryEmailId" name="primaryEmailId" placeholder="Primary Email-id" maxlength="50"> 
				</div>
				<!-- -------------------Password-------------------------------------- -->
				<div class="form-group" id="Edit-password-Error">
					<label><spring:message code="label.password"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-password-Error" class="help-inline"></span>
					<input	type="password" value="${user.password}" class="form-control" id="updatedPassword" name="password" placeholder="Password" maxlength="50"> 
				</div>
				<!-- -------------------Confirm Password-------------------------------------- -->
				<div class="form-group" id="Edit-confirmPassword-Error">
					<label><spring:message code="label.confirm.password"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-confirmPassword-Error" class="help-inline"></span>
					<input	type="password" value="${user.password}" class="form-control" id="updatedConfirmPassword" name="ConfirmPassWord" placeholder="Confirm PassWord" maxlength="50"> 
				</div>
				<!-- -------------------Secondary Email-Id-------------------------------------- -->
				<div class="form-group" id="Edit-secondaryEmail-Error">
					<label><spring:message code="label.secondary.email.id"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-secondaryEmail-Error" class="help-inline"></span>
					<input type="text" value="${user.secondaryEmail}" class="form-control" id="updatedSecondaryEmail" name="secondaryEmail" placeholder="Secondary Email-id" maxlength="50"> 
				</div>
				<!-- -------------------Mobile Number-------------------------------------- -->
				<div class="form-group" id="Edit-mobile-Error">
					<label><spring:message code="label.mobile.number"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-mobile-Error" class="help-inline"></span>
					<input type="text" value="${user.mobile}" class="form-control" id="updatedMobile" name="mobile" placeholder="Mobile Number" maxlength="50"> 
				</div>
				<!-- -------------------Phone Number------------------------------------- -->
				<div class="form-group" id="Edit-phone-Error">
					<label><spring:message code="label.phone.number"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-phone-Error" class="help-inline"></span>
					<input type="text" value="${user.phone}" class="form-control" id="updatedPhone" name="phone" placeholder="Phone Number" maxlength="50"> 
				</div>
				<!-- -------------------Fax------------------------------------- -->
				<div class="form-group" id="Edit-fax-Error">
					<label><spring:message code="label.fax"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="update-fax-Error" class="help-inline"></span>
					<input type="text" value="${user.fax}" class="form-control" id="updatedFax" name="fax" placeholder="Fax" maxlength="50"> 
				</div>
			<!--------------------- Button --------------------------------------------->
			<c:choose>
				<c:when test="${ROLES_EMPTY eq 'TRUE' }">
					<button type="submit" disabled="disabled" class="btn btn-primary"  style="margin-left: -14px;"><spring:message code="label.update"/></button>
				</c:when>
				<c:otherwise>
					<button type="submit" class="btn btn-primary" id="updateUserButton" style="margin-left: -14px;"><spring:message code="label.update"/></button>
				</c:otherwise>
			</c:choose>
				</div>
			</form:form>
			</div>
		</div>
	</div>
</body>
 <script src="../resources/js/userManagement.js"></script>
</html>