 <!DOCTYPE html>
<%@include file="includeTagLibs.jsp" %>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="<%= request.getContextPath() %>/resources/images/ipl-icon.jpg">
<title><spring:message code="label.ghn"/></title>
<%@include file="includeCssFiles.jsp"%>
</head>

<body class="login-page-wrapper">
<!-- background image -->

 <div id="canvasBackground">
   	<img alt="" src="../resources/images/loginBg.png">
 </div>

	<%-- <h2 style="margin-left: 250px; color: green;"><spring:message code="label.ghn"/></h2>
	<form class="form-horizontal" action="${pageContext.request.contextPath}/sendEmail.htm" method="GET">
		<c:choose>
			<c:when test="${EMAIL_REQUIRED eq 'TRUE' }">
				<div class="form-group has-error" style="margin-top: 100px;">
				
					<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.emailAddress"/></label>
					<div class="col-sm-3">
						<input type="text" class="form-control" name="mailTo" placeholder="Enter Email id">
					</div>
					<font style="color: red">Please Enter Email Id</font>
				</div>
					
			</c:when>
			
			
			<c:when test="${ENTER_VALID_EMAIL eq 'TRUE' }">
				<div class="form-group has-error" style="margin-top: 100px;">
					<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.emailAddress"/></label>
					<div class="col-sm-3">
						<input type="text" class="form-control" name="mailTo" placeholder="Enter Email id">
					</div>
					<font style="color: red">Please Enter Valid Email Id</font>
				</div>
				</c:when>
				
				<c:when test="${ENTERED_EMAIL_NOT_IN_DB eq 'TRUE' }">
				<div class="form-group has-error" style="margin-top: 100px;">
					<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.emailAddress"/></label>
					<div class="col-sm-3">
						<input type="text" class="form-control" name="mailTo" placeholder="Enter Email id">
					</div>
					<font style="color: red">Email Id Not registered with Application</font>
				</div>
				</c:when>
				
			<c:when test="${EMAIL_SENT eq 'TRUE'}">
			 <div class="form-group" style="margin-top: 100px;">
					<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.emailAddress"/></label>
					<div class="col-sm-3">
					<span style="color: #42a944" id="role-Error" class="help-inline"></span>
						<input type="text" class="form-control" name="mailTo" placeholder="Enter Email id">
					</div>
				<font style="color: green">Email Sent successfully please check email</font >
				</div> 
			</c:when>
		
		<c:otherwise>
		<div class="form-group" style="margin-top: 100px;">
					<label for="inputEmail3" class="col-sm-2 control-label"><spring:message code="label.emailAddress"/></label>
					<div class="col-sm-3">
					<span style="color: #42a944" id="role-Error" class="help-inline"></span>
						<input type="text" class="form-control" name="mailTo" placeholder="Enter Email id">
					</div>
				</div>
				</c:otherwise>
	</c:choose>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="submit" class="btn btn-primary" value="Send E-mail"><spring:message code="label.emailMe"/></button>
				<a class="btn btn-primary" href="${pageContext.request.contextPath}/main/login.htm"><spring:message code="label.back"/></a>
			</div>
			
		</div>
		
	</form> --%>
	
	<!-- Login -->
		<div class="col-sm-4 col-sm-offset-4 col-md-3">
			<div class="row LoginContainer">
				<div class="col-xs-12 text-right Login-logo">

					<img src="<%= request.getContextPath() %>/resources/images/Repufact-logo.png" alt="Kepsla" />

				</div>
				<div class="col-xs-12 success-on-form">
					<c:choose>
						<c:when test="${EMAIL_REQUIRED eq 'TRUE' }">
								<font style="color: red">Please Enter Email Id</font>
						</c:when>
						
						<c:when test="${ENTER_VALID_EMAIL eq 'TRUE' }">
								<font style="color: red">Please Enter Valid Email Id</font>
						</c:when>
							
						<c:when test="${ENTERED_EMAIL_NOT_IN_DB eq 'TRUE' }">
								<font style="color: red">Email Id Not registered with Application</font>
						</c:when>
							
						<c:when test="${EMAIL_SENT eq 'TRUE'}">
								<font style="color: green">Email Sent successfully please check email</font >
					   </c:when>
						<c:otherwise>
						</c:otherwise>
				</c:choose>
						
				</div>
					<form action="${pageContext.request.contextPath}/sendEmail.htm" method="GET" class="col-xs-12 form-horizontal">
					  <div class="form-group">
						<div class="col-sm-12">
						  <input type="email" name="mailTo" class="form-control" id="inputEmail3" placeholder="Enter your registered email-id">
						</div>
					  </div>
					  <div class="form-group">
						<div class="col-sm-12">
							<div class="float-left">
								<a href="${pageContext.request.contextPath}/main/login.htm" class="SmallLightDarkBlueContentLink">Back to sign-in</a>
							</div>
							<div class="float-right">
								<button type="submit" class="btn btn-primary btn-sm">Send</button>
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
			<!-- Login -->
</body>

<script	src="${pageContext.request.contextPath}/resources/jquery/jquery-1.11.0.js"></script>
<script	src="${pageContext.request.contextPath}/resources/jquery-ui/jquery-ui.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/bootstrap.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/jquery.dataTables.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/dataTables.bootstrap.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/plugins/metisMenu/metisMenu.js"></script>
<script	src="${pageContext.request.contextPath}/resources/bootstrap/main.js"></script>
</body>
 </html> 


 
 
 
 
  