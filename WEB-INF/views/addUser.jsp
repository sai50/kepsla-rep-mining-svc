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
			<li class="active" style="float: right;"><a href="#addUser" data-toggle="tab" onclick="addNewUser()"><spring:message code="label.add.user"/></a>
			</li>
		</ul>
		
		<div id="my-tab-content" class="tab-content">
		
		<br>
			<div id="userTabButtons">
				<span style="float: left: "><a href="#" onclick="addNewUser()"><img alt="" src="../resources/images/add-icon.jpg"></a></span>&nbsp;
				<span style="float: left: "><a href="#" onclick="listUser()"><img alt="" src="../resources/images/list-icon.jpg"></a></span>&nbsp;
				<span style="float: left: "><a href="#" onclick="deleteUser()"><img alt="" src="../resources/images/delete.jpg"></a></span>
			</div>
		
		<!-- --------------------Add New User------------------------------------------ -->
		<div class="tab-pane active" id="addUser">
		<hr>
			<form class="form-horizontal" id="addUserForm">
				<div class="modal-body" style="margin-left: 10px;">
					<!-- -Global Error Div -->
				<c:choose>
					<c:when test="${ROLES_EMPTY eq 'TRUE'}">
						<div class="alert alert-danger alert-error" style="margin-left: -13px;width: 50%">
							<strong><spring:message code="empty.custom.roles"/></strong>
						</div>
					</c:when>
					<c:otherwise>
						<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="addUserErrorDiv">
							<strong><spring:message code="label.globalError"/></strong>
						</div>
					</c:otherwise>
				</c:choose>		
				<div class="alert alert-success" style="display: none;margin-left:-13px;width: 50%"  id="addUserSuccessDiv">
					<strong><spring:message code="label.create.user.success"></spring:message></strong>
				</div>
				<!-- -------------------User Role-------------------------------------- -->
					<c:choose>
						<c:when test="${ROLES_EMPTY eq 'TRUE' }">
						<div class="form-group has-error">
							<label class="control-label"><spring:message code="label.user.role"/></label>
							<select class="form-control" disabled="disabled" style="width: 50%">
								<option>No Roles Found</option>
							</select>
						</div>
						</c:when>
						<c:otherwise>
						<div class="form-group" id="Add-userRole-Error">
							<label><spring:message code="label.user.role"/></label>
							<select class="form-control" id="userRoleId" style="width: 50%">
							<c:forEach items="${listCustomRoles}" var="role">
								<option value="${role.parentRole}">${role.role}</option>
							</c:forEach>
						</select>
						</div>
						</c:otherwise>
					</c:choose>
			 <!-- -------------------User Name-------------------------------------- -->
				<div class="form-group" id="Add-userName-Error">
					<label><spring:message code="label.username"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442; width: 50%" id="userName-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="userName" name="userName" placeholder="User Name" maxlength="50"> 
				</div>
		 	  <!-- -------------------First Name-------------------------------------- -->
				<div class="form-group" id="Add-userFirstName-Error">
					<label><spring:message code="label.firstName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="userFirstName-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="userFirstName" name="userFirstName" placeholder="First Name" maxlength="50"> 
				</div>
				<!-- -------------------Middle Name-------------------------------------- -->
				<div class="form-group" id="Add-userMiddleName-Error">
					<label><spring:message code="label.middleName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="userMiddleName-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="userMiddleName" name="userMiddleName" placeholder="Middle Name" maxlength="50"> 
				</div>
				<!-- -------------------Last Name-------------------------------------- -->
				<div class="form-group" id="Add-userLastName-Error">
					<label><spring:message code="label.lastName"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="userLastName-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="userLastName" name="userLastName" placeholder="Last Name" maxlength="50"> 
				</div>
				<!-- -------------------Primary Email-Id-------------------------------------- -->
				<div class="form-group" id="Add-primaryEmail-Error">
					<label><spring:message code="label.primary.email.id"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="primaryEmail-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="primaryEmail" name="primaryEmail" placeholder="Primary Email-id" maxlength="50"> 
				</div>
				<!-- -------------------Confirm Primary Email-Id-------------------------------------- -->
				<div class="form-group" id="Add-confirmPrimaryEmailId-Error">
					<label><spring:message code="label.confirm.primary.email.id"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="confirmPrimaryEmailId-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="confirmPrimaryEmailId" name="primaryEmailId" placeholder="Primary Email-id" maxlength="50"> 
				</div>
				<!-- -------------------Password-------------------------------------- -->
				<div class="form-group" id="Add-password-Error">
					<label><spring:message code="label.password"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="password-Error" class="help-inline"></span>
					<input style="width: 50%"	type="password" class="form-control" id="password" name="password" placeholder="Password" maxlength="50"> 
				</div>
				<!-- -------------------Confirm Password-------------------------------------- -->
				<div class="form-group" id="Add-confirmPassword-Error">
					<label><spring:message code="label.confirm.password"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="confirmPassword-Error" class="help-inline"></span>
					<input style="width: 50%"	type="password" class="form-control" id="confirmPassword" name="ConfirmPassWord" placeholder="Confirm PassWord" maxlength="50"> 
				</div>
				<!-- -------------------Secondary Email-Id-------------------------------------- -->
				<div class="form-group" id="Add-secondaryEmail-Error">
					<label><spring:message code="label.secondary.email.id"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="secondaryEmail-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="secondaryEmail" name="secondaryEmail" placeholder="Secondary Email-id" maxlength="50"> 
				</div>
				<!-- -------------------Mobile Number-------------------------------------- -->
				<div class="form-group" id="Add-mobile-Error">
					<label><spring:message code="label.mobile.number"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="mobile-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="mobile" name="mobile" placeholder="Mobile Number" maxlength="50"> 
				</div>
				<!-- -------------------Phone Number------------------------------------- -->
				<div class="form-group" id="Add-phone-Error">
					<label><spring:message code="label.phone.number"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="phone-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="phone" name="phone" placeholder="Phone Number" maxlength="50"> 
				</div>
				<!-- -------------------Fax------------------------------------- -->
				<div class="form-group" id="Add-fax-Error">
					<label><spring:message code="label.fax"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="fax-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="fax" name="fax" placeholder="Fax" maxlength="50"> 
				</div>
				<!-- -------------------Designation------------------------------------- -->
				<div class="form-group" id="Add-designation-Error">
					<label><spring:message code="label.designation"/><font style="color: #a94442">*</font></label>
					<span style="color: #a94442" id="fax-Error" class="help-inline"></span>
					<input style="width: 50%"	type="text" class="form-control" id="fax" name="fax" placeholder="Designation" maxlength="50"> 
				</div>
			<!--------------------- Button --------------------------------------------->
			<c:choose>
				<c:when test="${ROLES_EMPTY eq 'TRUE' }">
					<button type="submit" disabled="disabled" class="btn btn-primary"  style="margin-left: -14px;"><spring:message code="label.save"/></button>
				</c:when>
				<c:otherwise>
					<button type="submit" class="btn btn-primary" id="saveUserButton" style="margin-left: -14px;"><spring:message code="label.save"/></button>
				</c:otherwise>
			</c:choose>
				</div>
			</form>
		</div>
		<!-- --------------------List Users------------------------------------------ -->
		<div class="tab-pane" id="listUsers"></div>
	</div>
	<!-- ------------------Edit User Div------------------------------------------------- -->
	<div id="editUserDiv"></div>
	<!-- ------------------Show Role Feature Div------------------------------------------------- -->
	<div id="showUserDiv"></div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/user.js"></script>
</html>