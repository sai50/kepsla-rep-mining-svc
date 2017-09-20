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
			
			<h3><font size="2" color="green"><spring:message code="label.pwd.success" /></font></h3>
		</div>
	</div>
	
</body>
</html>