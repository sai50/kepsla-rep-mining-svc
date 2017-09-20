<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
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
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
<link rel="shortcut icon" href="../resources/images/greensmiley.ico"
	type="image/x-icon">
<title><spring:message code="label.agent.master" /></title>
<%@include file="includeCssFiles.jsp"%>

</head>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5W4FN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<body>
	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->
	<div id="wrapper">
		<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
		<nav class="navbar navbar-default navbar-static-top" role="navigation"
			style="margin-bottom: 0">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse"
					data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span
						class="icon-bar"></span> <span class="icon-bar"></span> <span
						class="icon-bar"></span>
				</button>
				<c:choose>
				  <c:when test="${logoImageUrl == ''}">
				  </c:when>
				  <c:otherwise>
				   <a style="padding: 5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
			</div>
			<%@include file="leftNavigation.jsp"%>
		</nav>
		<!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
					<h3>
						<font face='Trebuchet MS, Verdana, Arial, sans-serif'
							color='D62F0C' size='5'><b>AUTOMAT MOZENDA APPLICATION</b></font>
					</h3>
					<P>
						<font face='Trebuchet MS, Verdana, Arial, sans-serif'
							color='D62F0C' size='2'><b> The time on the server is
								${serverTime}.</b></font>
					</P>
				</div>
				<div class="panel panel-admin">
					<div class="panel-body"></div>
					<div class="panel panel-admin">
						<div class="panel-body">
							<div id="kpiTab" class="tab-content">
								<div class="tab-pane active" id="apiUserTabDiv">
									<div id="test"></div>
									<div id="userDataDiv"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/agentLogReport.js"></script>
<script type="text/javascript">
	/*    $(document).ready(function(){
		$('#AgentListTable').dataTable();
	});  */
</script>
<script type="text/javascript">
	
</script>
</html>
