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
			<ul class="nav nav-tabs nav-justified">
				<li role="presentation"><a href="#">Home</a></li>
				<li role="presentation"><a href="#">Profile</a></li>
				<li role="presentation"><a href="#">Messages</a></li>
				<li role="presentation" class="active"><a href="#">Home</a></li>
				<li role="presentation"><a href="#">Profile</a></li>
				<li role="presentation"><a href="#">Messages</a></li>
			</ul>
			<ul class="nav nav-tabs nav-justified">
				<li role="presentation"><a href="#">Home</a></li>
				<li role=""><a href="#">Profile</a></li>
				<li role="presentation"><a href="#">Messages</a></li>
				<li role="presentation"><a href="#">Home</a></li>
				<li role="presentation"><a href="#">Profile</a></li>
				<li role="presentation"><a href="#">Messages</a></li>
			</ul>
			<div class="alert alert-success" style="display: none;"
				id="configurationSuccessDiv">
				<strong><spring:message code="label.configuration.success"></spring:message></strong>
			</div>
			<div class="alert alert-danger alert-error"
				style="display: none; margin-left: -13px;"
				id="configurationErrorDiv">
				<strong><spring:message code="label.globalError" /></strong>
			</div>
			<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
				<li id="OrganizationListView"><a data-toggle="tab"
					onclick="organization()" href="#"><h1>
							<label><spring:message
									code="label.heddining.configuration"></spring:message></label>
						</h1></a></li>
			</ul>
			<form id="formulaConfiguration">

				<!--=============================Review Age=====================================  -->
				<div id="reviewAge">
					<div style="overflow: auto;">
						<div>
							<h4>
								<label><spring:message code="lable.reviewAge"></spring:message></label>
							</h4>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.name"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="name" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.max"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="greater key" />
								</div>
							</div>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.mini"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="less key" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.value"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="value" />
								</div>
							</div>
						</div>
						<br> <input class="btn btn-default col-sm-2" id="reviewAdd"
							onclick="addAnotherReviewAge()" value="Add" type="button">
						<div id="review"></div>
					</div>
				</div>
				<hr>
				<!--=============================organization Volume=====================================  -->

				<div>
					<div style="overflow: auto;">
						<div>
							<h4>
								<label><spring:message code="lable.organizationVolume"></spring:message></label>
							</h4>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.name"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="name" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.max"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="greater key" />
								</div>
							</div>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.mini"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="less key" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.value"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="value" />
								</div>
							</div>
						</div>
						<br> <input class="btn btn-default col-sm-2"
							id="organizationVolumeAdd"
							onclick="addAnotherOrganizationVolume()" value="Add"
							type="button">
						<div id="organizationVolume"></div>
					</div>
				</div>
				<hr>
				<!--=============================source Popularity=====================================  -->
				<div>
					<div style="overflow: auto;">
						<div>
							<h4>
								<label><spring:message code="lable.sourcePopularity"></spring:message></label>
							</h4>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.name"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="name" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.max"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="greater key" />
								</div>
							</div>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.mini"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="less key" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.value"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="value" />
								</div>
							</div>
						</div>
						<br> <input class="btn btn-default col-sm-2"
							id="sourcePopularityAdd" onclick="addAnotherSourcePopularity()"
							value="Add" type="button">
						<div id="sourcePopularity"></div>
					</div>
				</div>
				<hr>
				<!--=============================source Volume=====================================  -->
				<div>
					<div style="overflow: auto;">
						<div>
							<h4>
								<label><spring:message code="lable.sourceVolume"></spring:message></label>
							</h4>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.name"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="name" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.max"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="greater key" />
								</div>
							</div>
							<div class="col-xs-3">
								<div class="left-inner-addon">
									<label><spring:message code="label.configuration.mini"></spring:message></label>
									<i class="icon-user"></i> <input type="text"
										class="form-control" placeholder="less key" />
								</div>
							</div>
							<div class="col-xs-3">
								<label><spring:message code="label.configuration.value"></spring:message></label>
								<div class="right-inner-addon">
									<i class="icon-text"></i> <input type="text"
										class="form-control" placeholder="value" />
								</div>
							</div>
						</div>
						<br> <input class="btn btn-default col-sm-2"
							id="configuratinAdd" onclick="addAnotherSourceVolume()"
							value="Add" type="button">
						<div id="sourceVolume"></div>
					</div>
				</div>
				<hr>
			</form>
		</div>
	</div>
</body>
<script src="../resources/js/configuration.js"></script>
</html>