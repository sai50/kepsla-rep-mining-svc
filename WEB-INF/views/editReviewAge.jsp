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
<title><spring:message code="label.ghn" /></title>
<%@include file="includeCssFiles.jsp"%>
<link href="<%=request.getContextPath()%>/resources/bootstrap/grid.css"
	rel="stylesheet">
</head>
<body>
	<div id="loadMaskDiv"
		class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
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
				<li role="presentation"><a onclick="reviewAge()" href="#">Organization
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
			<div id = "editReviewAge">
			<div class="alert alert-success" style="display: none;"
				id="reviewAgeSuccessDiv">
				<strong><spring:message code="label.configuration.success"></spring:message></strong>
			</div>
			<div class="alert alert-danger alert-error"
				style="display: none; margin-left: -13px;" id="reviewAgeErrorDiv">
				<strong><spring:message code="label.globalError" /></strong>
			</div>
			<form role="from" id="reviewAgeForm">
				<h4>Review Age</h4>
				<br> <br>
				<div class="form-group form-group-sm">
					<label class="col-sm-2 control-label" for="formGroupInputSmall"><spring:message
							code="label.configuration.name"></spring:message></label>
					<div class="col-sm-10">
						<input class="form-control" type="text" id="reviewName"
							placeholder="Enter Name"> <br>
					</div>
				</div>

				<div class="form-group form-group-sm">
					<label class="col-sm-2 control-label" for="formGroupInputSmall"><spring:message
							code="label.review.start"></spring:message></label>
					<div class="col-sm-10">
						<input class="form-control" type="text" id="reviewStartDay"
							placeholder="Enter Start Day"> <br>
					</div>
				</div>

				<div class="form-group form-group-sm">
					<label class="col-sm-2 control-label" for="formGroupInputSmall"><spring:message
							code="label.review.end"></spring:message></label>
					<div class="col-sm-10">
						<input class="form-control" type="text" id="reviewEndDay"
							placeholder="Enter End Day"> <br>
					</div>
				</div>


				<div class="form-group form-group-sm">
					<label class="col-sm-2 control-label" for="formGroupInputSmall"><spring:message
							code="label.configuration.value"></spring:message></label>
					<div class="col-sm-10">
						<input class="form-control" type="text" id="reviewValue"
							placeholder="Enter Value"> <br>
					</div>
				</div>
				<br><Br>
				<div align="center">
				<button type="submit" class="btn btn-primary"><spring:message code="label.save"/></button>
				<button type="submit" class="btn btn-primary">Cancel</button>
				</div>
			</form>
		</div>
		</div>
	</div>
</body>
<script src="../resources/js/configuration.js"></script>
</html>