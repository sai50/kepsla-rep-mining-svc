<!DOCTYPE html>
<%@include file="includeTagLibs.jsp" %>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<%-- <link rel="shortcut icon" href="<%= request.getContextPath() %>/resources/images/ipl-icon.jpg"> --%>
<title><spring:message code="label.ghn"/></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<c:if test="${ERROR eq 'TRUE'}">
	<div class="alert alert-danger alert-error col-sm-12" style="margin-top: -40px;">
		<strong><spring:message code="label.badCredentials"/></strong>
	</div>
</c:if>
<c:if test="${not empty SPRING_SECURITY_LAST_EXCEPTION}">
      <font color="red">
        Your login attempt was not successful due to <br/><br/>
        <c:out value="${SPRING_SECURITY_LAST_EXCEPTION.message}"/>.
      </font>
</c:if>
<body style="width: 1200px;">
<div class="container">
	<div class="row">
		<img src="<%= request.getContextPath() %>/resources/images/logo.png" alt="Kepsla">
	</div>
	
	<form:form class="form-horizontal row" action="../user/activateForgotPassword.htm" method="post" modelAttribute="userPasswordUI">
	
		<div class="form-group" style="margin-top: 50px;">
			<label for="inputPassword3" class="col-sm-2 control-label">Current Password</label>
			<div class="col-sm-3">
				<form:input type="password" path="currentPassword"  class="form-control"  placeholder="Current Password"></form:input>
			</div>
			<div class="col-sm-3">
				<form:errors path="currentPassword" style="color: red;"></form:errors>
			 </div>
		</div>
		
		<div class="form-group">
			<label for="inputPassword3" class="col-sm-2 control-label">New Password</label>
			<div class="col-sm-3">
				<form:input type = "password" path="newPassword" class="form-control" id="inputPassword3"	placeholder="New Password"></form:input>
				<form:errors path="newPassword" style="color: red;"></form:errors>
			</div>
		</div>
		<div class="form-group">
			<label for="inputPassword3" class="col-sm-2 control-label">Confirm Password</label>
			<div class="col-sm-3">
				<form:input type="password" path="confirmPassword" class="form-control" id="inputPassword3"	placeholder="Confirm Password"></form:input>
			</div>
			<div class="col-sm-3">
				<form:errors path="confirmPassword" style="color: red;"></form:errors>
			</div>
		</div>
		<input type="hidden" value="${name}" name="userName"></input>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="submit" class="btn btn-primary right">Submit</button>
			</div>
			
		</div>
	</form:form>
	
</div>
</body>
<%@include file="includeJsFiles.jsp"%>
</html>