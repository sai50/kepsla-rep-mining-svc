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

<body>
	<h2 style="margin-left: 250px; color: green;"><spring:message code="label.ghn"/></h2>
	<form class="form-horizontal" action="../main/login.htm" method="post">
	
		<div class="form-group" style="margin-top: 100px;">
			<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.newPassword"/></label>
			<div class="col-sm-3">
				<input type="password" class="form-control" name="newPassword" placeholder="New Password">
			</div>
		</div>
		
		<div class="form-group" style="margin-top: 100px;">
			<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.confirmNewPassword"/></label>
			<div class="col-sm-3">
				<input type="password" class="form-control" name="confirmNewPassword" placeholder="Confirm New Password">
			</div>
		</div>
		
		
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="submit" class="btn btn-primary"><spring:message code="label.goToLogin"/></button>
				<a class="btn btn-primary" href="../main/login.htm"><spring:message code="label.goToLogin"/></a>
				<button type="submit" class="btn btn-primary"><spring:message code="label.save"/></button>
			</div>
			
		</div>
	</form>
</body>
<%@include file="includeJsFiles.jsp"%></html>