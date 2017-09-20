<!DOCTYPE html>
<%@include file="includeTagLibs.jsp" %>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<%-- <link rel="shortcut icon" href="<%= request.getContextPath() %>/resources/images/ipl-icon.jpg"> --%>
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title><spring:message code="label.ghn"/></title>
<%-- <%@include file="includeCssFiles.jsp"%> --%>
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
	
	<link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">
</head>

<%--
<c:if test="${ERROR eq 'TRUE'}">
	<div class="alert alert-danger alert-error col-sm-12" style="margin-top: -40px;">
		<strong><spring:message code="label.badCredentials"/></strong>
	</div>
</c:if>
<c:if test="${not empty SPRING_SECURITY_LAST_EXCEPTION}">
	Your login attempt was not successful due to <br/><br/>
	<c:if test="${fn:containsIgnoreCase(SPRING_SECURITY_LAST_EXCEPTION.message, 'SELECT USER_NAME')}">
		Unable to Login Due to Internal Error...Please Contact Admin.
	<%-- </c:if> --%>
	<c:if test="${not fn:containsIgnoreCase(SPRING_SECURITY_LAST_EXCEPTION.message, 'SELECT USER_NAME')}">
		<c:out value="${SPRING_SECURITY_LAST_EXCEPTION.message}"/>
	</c:if>
<%-- </c:if> --%>

<body class="login-page-wrapper">
<!-- background image -->

 <div id="canvasBackground">
   	<img alt="" src="../resources/images/loginBg.png">
 </div>

<%-- <div class="container">
	<div class="row">
		<img src="<%= request.getContextPath() %>/resources/images/logo.png" alt="Kepsla">
	</div>
	
	<form class="form-horizontal row" action="<c:url value='/j_spring_security_check' />" method="post">
	
		<div class="form-group" style="margin-top: 50px;">
			<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.emailAddress"/></label>
			<div class="col-sm-3">
				<input type="text" class="form-control" name="j_username" placeholder="Email Address">
			</div>
		</div>
		
		<div class="form-group">
			<label for="inputPassword3" class="col-sm-2 control-label"><spring:message code="label.password"/></label>
			<div class="col-sm-3">
				<input type="password" class="form-control" id="inputPassword3"	name="j_password" placeholder="Password">
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<a href="../main/forgot.htm"><spring:message code="label.forgotPassword"/></a>
				<button type="submit" class="btn btn-primary right" style="margin-left: 38px;"><spring:message code="label.signIn"/></button>
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

				<c:if test="${not empty SPRING_SECURITY_LAST_EXCEPTION}">
				        Your login attempt was not successful due to <br/><br/>
				        <c:out value="${SPRING_SECURITY_LAST_EXCEPTION.message}"/>.
				</c:if>

					<c:if test="${ERROR eq 'TRUE'}">
						<spring:message code="label.badCredentials"/>
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