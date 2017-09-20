<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">

<!-- Note there is no responsive meta tag here -->

<link rel="shortcut icon" href="../resources/images/ipl-icon.jpg">
<title>Exception</title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
	<!-- Fixed navbar -->
	<br>
	<div class="navbar navbar-default navbar-fixed-top">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#"><spring:message code="label.ghn"/></a>
			</div>

			<div class="navbar-collapse collapse">
				<ul class="nav navbar-nav navbar-right">
					<li><a href="<c:url value="/j_spring_security_logout"/>"> LogOut</a></li>
				</ul>
			</div>

		</div>
	</div>

	<div class="container">
		<div class="row">
			<h2 style="margin-left: 100px; color: purple;">Something Went Wrong.Please Contact Admin</h2>
		</div>
	</div>
	<div id="sravan"></div>
	<div id="listAllTeamsDiv"></div>


</body>
</html>