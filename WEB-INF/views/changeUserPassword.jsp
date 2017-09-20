<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title><spring:message code="label.user.manage" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
	<div id="wrapper">
	<%@include file="adminDashboard.jsp" %>
		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
		            <h1 class="page-header">Change Password</h1>
		        </div>
			</div>
			<div class="SubHeading">	
				<form:form method="POST" modelAttribute="user">
				
					<div class="form-group" style="width:300px;">
						<label>Enter new password<font style="color: red">*</font></label>
						<form:password class="form-control input-sm" placeholder="" maxlength="100" path="password" required="required" showPassword="true"/>
						<form:errors path="password" cssStyle="color: #a94442;"/>
					</div>
					
					<div class="form-group" style="width:300px;">
						<label>Confirm new password<font style="color: red">*</font></label>
						<form:password class="form-control input-sm" placeholder="" maxlength="100" path="confirmPassword" required="required" showPassword="true"/>
						<form:errors path="confirmPassword" cssStyle="color: #a94442;"/>
					</div>

			        <input class="btn btn-primary" type="submit" name="submit" value="Save">
			        <button type="button" class="btn btn-default" >Cancel</button>
			        
		    	</form:form>
		    	</div>
		</div>
	</div>
	
</body>
</html>