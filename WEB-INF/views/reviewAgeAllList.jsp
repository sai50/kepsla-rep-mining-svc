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

	<div class="container">
			<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
				<li id="OrganizationListView"><a data-toggle="tab"
					onclick="organization()" href="#"><h1>
							<label><spring:message
									code="label.heddining.configuration"></spring:message></label>
						</h1></a><br></li>
			</ul>
			<ul class="nav nav-tabs nav-justified">
				<li role="presentation" class="active"><a href="#">Review
						Age</a></li>
				<li role="presentation"><a onclick="reviewAgeAllList()" href="#">Organization
						Volume</a></li>
				<li role="presentation"><a href="#">Source Popularity</a></li>
				<li role="presentation"><a href="#">Source Volume</a></li>
				<li role="presentation"><a href="#">Language</a></li>
				<li role="presentation"><a href="#">Semantic</a></li>
			</ul>
			<ul class="nav nav-tabs nav-justified">
				<li role="presentation"><a href="#">Home</a></li>
				<li role=""><a href="#">Profile</a></li>
				<li role="presentation"><a href="#">Messages</a></li>
				<li role="presentation"><a href="#">Home</a></li>
				<li role="presentation"><a href="#">Profile</a></li>
				<li role="presentation"><a href="#">Messages</a></li>
			</ul>
		<div>
		<div class="alert alert-success" style="display: none;"	id="deleteReviewAgeSuccess">
					<strong><spring:message code="label.deleteCountry.success"/></strong>
		</div>
		<div class="alert alert-danger alert-error" style="display: none;"	id="deleteReviewAgeError">
		</div>
		</div>	
			<!-- --------------------List All Review Age------------------------------------------ -->
		<div id="listOfReviewAge">
		</div>
	</div>
</div>	
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/listReviewAge.js"></script>
</html>