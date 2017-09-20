<!DOCTYPE html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<html lang="en">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWQVXW');</script>
<!-- End Google Tag Manager -->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="resources/images/greensmiley.ico" type="image/x-icon">
<title>KePSLA</title>
<!-- Bootstrap -->
<link href="<%= request.getContextPath() %>/resources/bootstrap/bootstrap.min.css" rel="stylesheet">
<link href="<%= request.getContextPath() %>/resources/bootstrap/bootstrap.css"	rel="stylesheet">
<link rel="import" href="iframe.html" />


<!-- MetisMenu CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.css"
	rel="stylesheet">


<!-- Main CSS -->
<link href="<%=request.getContextPath()%>/resources/css/main.css"
	rel="stylesheet">

<!-- Morris Charts CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/plugins/morris/morris.css"
	rel="stylesheet">

<!-- Custom Fonts -->
<link
	href="<%=request.getContextPath()%>/resources/fonts/font-awesome-4.1.0/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">

<!-- Date Picker CSS -->
<link
	href="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.css"
	rel="stylesheet">
	
</head>

<body class="login-page-wrapper">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<!-- background image -->

 <div id="canvasBackground">
   	<img alt="" src="<%= request.getContextPath() %>/resources/images/loginBg.png">
 </div>



<%-- <c:if test="${ERROR eq 'TRUE'}">
	<div class="alert alert-danger alert-error col-sm-12" style="margin-top: -40px;">
		<strong><spring:message code="label.badCredentials"/></strong>
	</div>
</c:if>
<c:if test="${SESSION_EXPIRED eq 'TRUE' }">
	<div class="row">
		<div class="alert alert-danger alert-error" style="margin-top: -40px;">
			<strong><spring:message code="label.sessionExpired"/></strong>
		</div>
	</div>
</c:if> 
<div class="container">
	<div class="row" style="margin:10px;">
		<img src="<%= request.getContextPath() %>/resources/images/logo.png" alt="Kepsla">
	</div>
	<form class="form-horizontal row" action="<c:url value='/j_spring_security_check' />" method="post">
		<div class="form-group" style="margin-top: 50px;">
			<label for="inputEmail3" class="col-sm-2 control-label">Email Address</label>
			<div class="col-sm-3">
				<input type="text" class="form-control" name="j_username" placeholder="Email Address">
			</div>
		</div>
		
		<div class="form-group">
			<label for="inputPassword3" class="col-sm-2 control-label">Password</label>
			<div class="col-sm-3">
				<input type="password" class="form-control" id="inputPassword3"	name="j_password" placeholder="Password">
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<a href="${pageContext.request.contextPath}/main/forgot.htm">Forgot Password</a>
				<button type="submit" class="btn btn-primary right" style="margin-left: 38px;">Sign In</button>
			</div>
		</div>
	</form>
</div> --%>

		<div class="col-sm-4 col-sm-offset-4 col-md-3">
			<div class="row LoginContainer">
				<div class="col-xs-12 text-right Login-logo">
					<img src="<%= request.getContextPath() %>/resources/images/Repufact-logo.png" alt="Kepsla" />
				</div>
				<div class="col-xs-12 error-on-form">
					<c:if test="${ERROR eq 'TRUE'}">
						<spring:message code="label.badCredentials"/>
					</c:if>
					<c:if test="${SESSION_EXPIRED eq 'TRUE' }">
							<spring:message code="label.sessionExpired"/>
					</c:if>
				</div>
				<form class="col-xs-12 form-horizontal" action="<c:url value='/j_spring_security_check' />" method="post">
					<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
				  <div class="form-group">
					<div class="col-sm-12">
					  <input type="text" class="form-control" name="j_username" placeholder="Email Address">
					</div>
				  </div>
				  <div class="form-group">
					<div class="col-sm-12">
					  <input type="password" class="form-control" id="inputPassword3"	name="j_password" placeholder="Password">
					</div>
				  </div>
				  <div class="form-group">
					<div class="col-sm-12">
					  <div class="checkbox">
						<label>
						  <input name="_spring_security_remember_me" type="checkbox"> Remember me on this computer
						</label>
					  </div>
					</div>
				  </div>
				  <div class="form-group">
					<div class="col-sm-12">
						<div class="float-left">
							<a href="${pageContext.request.contextPath}/main/forgot.htm" class="SmallLightDarkBlueContentLink">Forgot password?</a>
						</div>
						<div class="float-right">
							<button type="submit" class="btn btn-primary btn-sm">Login</button>
						</div>
					</div>
				  </div>
				</form>
			</div>	
			
			<!-- Footer -->
			 <div class="SmallDarkGreyHeader">
                               <div>&copy; 2016 RepRecom Solutions Pvt. Ltd.</div>
                               <div>All rights reserved</div>                                
                       </div>
			<!-- Footer -->
		</div>
		
</body>
 <script	src="${pageContext.request.contextPath}/resources/jquery/jquery-1.11.0.js"></script>
<script	src="${pageContext.request.contextPath}/resources/jquery-ui/jquery-ui.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/bootstrap.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/jquery.dataTables.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/dataTables.bootstrap.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/plugins/metisMenu/metisMenu.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/main.js"></script> 
</html>