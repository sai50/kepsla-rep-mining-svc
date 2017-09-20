<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<!-- Google Tag Manager -->
<script>
	(function(w, d, s, l, i) {
		w[l] = w[l] || [];
		w[l].push({
			'gtm.start' : new Date().getTime(),
			event : 'gtm.js'
		});
		var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l='
				+ l
				: '';
		j.async = true;
		j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
		f.parentNode.insertBefore(j, f);
	})(window, document, 'script', 'dataLayer', 'GTM-KWQVXW');
</script>
<!-- End Google Tag Manager -->

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<link rel="shortcut icon" href="../resources/images/greensmiley.ico"
	type="image/x-icon">
<title><spring:message code="label.organization.source.mapping" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body onload="loadAllHotels()">
	<!-- Google Tag Manager (noscript) -->
	<noscript>
		<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
			height="0" width="0" style="display: none; visibility: hidden"></iframe>
	</noscript>
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
				   <a style="padding:5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
			</div>
			<%@include file="leftNavigation.jsp"%>
		</nav>
		<!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">Organization Source Mapping</h1>
				</div>
				<div class="panel panel-admin">
					<div class="panel-body">
					
						<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
							<li class="active" style="float: left;"><a
								href="#listOrganizationSourceMappingTab" data-toggle="tab"><spring:message
										code="label.organizationSourceMappingTab" /></a></li>
						</ul>
						<div class="tab-pane active" id="organizationSourceMappingTab">
							<div id="organizationSourceMappingTab" class="tab-content">
								<div class="container-fluid">
									<div class="row">
										<form id="listOrganizationSourceMappingForm"
											class="form-inline col-xs-12 SubHeading AdminMainActivity">
											<div class="col-md-3 col-lg-2 col-xs-12 col-sm-4" style="display:inline-flex">
												<label id="searchByLabel" class="control-label"
														for="searchOption">Search</label>
													<select id="searchBySelectId"
														onchange="showTextOrIdField()"
														class="form-control input-sm" style="width: 95px">
														
														<option value="searchByIdOption" id="searchByIdOptID">By ID</option>
														<option value="searchByTextOption" selected="selected" id="searchByTextOptID">By Name</option>
													</select>
											</div>

											<div id="ShowTextOrIdFieldBox"
												class="col-md-3 col-lg-3 col-xs-12 col-sm-4" style="display:inline-flex">
											 <input type="text" id="searchByText"  name="searchByText" placeholder="enter name" class="autoComplete">
											  <input type="number" min="0" onkeyup="enableSourceTab()" onmouseup="enableSourceTab()" hidden="true" id="searchByOrgId" name="searchById" placeholder="enter id">
											</div>

											<div id="ShowSourceField"
												class="col-md-3 col-lg-4 col-xs-12 col-sm-12" style="display:inline-flex">
												<label id="selectSourceName" class="control-label"
														 for="selectSourceName">SourceName</label>
												
												<div id="appendSourceFieldNames" ></div>
										
											</div>
											<div id="ShowTextOrIdFieldBox1"
												class="col-md-3 col-lg-1 col-xs-12 col-sm-4" style="display:inline-flex">

												<input type="button" 
													class="btn btn-default btn-sm" id="viewList"
													onclick="organizationSourceMappingList()" disabled="disabled" value="View">
											</div>
											<div class="form-group float-right">
												<button
													class="btn btn-primary AdminDeleteButton float-right" id="deleteOrgButton"
													type="button"  onclick="deleteOrganizationSourceMapping()">
													<span aria-hidden="true" class="glyphicon glyphicon-trash"></span>
												</button>
												<button onclick="addOrganizationSourceMapping()"
												id="addOrgButton" class="btn btn-primary AdminAddButton float-right"
													type="button">+</button>
											</div>
										</form>
									</div>
								</div>

							</div>
						</div>
						<ul id="tabs" class="nav nav-tabs">
						</ul>
						<div id="organizationSourceMappingTab" class="tab-content">
						
							<!-- --------------------organization Source Mapping----------------------------------------- -->
							<div class="tab-pane active" id="organizationSourceMappingTab">
							<div id="organizationSourceMappingButtonsDiv"></div>
						
								<!-- --------------------Add  Success Div----------------------------------------- -->
								<div class="alert alert-success" style="display: none;"
									id="addOrganizationSourceMappingSuccessDiv">
									<spring:message
										code="label.addOrganizationSourceMapping.success" />
								</div>
								<!-- --------------------Edit  Success Div----------------------------------------- -->
								<div class="alert alert-success" style="display: none;"
									id="editOrganizationSourceMappingSuccessDiv">
									<strong><spring:message
											code="label.editOrganizationSourceMapping.success" /></strong>
								</div> 
								
							</div>
						</div>
				<div id="addAndEditOrganizationSourceMappingDiv"
			class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
		

					</div>
				</div>
				
				<div id="organizationSourceMappingDataDiv"></div>
				<a href="#" onclick="scrollDown($('#wrapper'))"
					style="float: right;"><img alt="no Image Found"
					src="../resources/images/scrollTop.png"></a>
			</div>
			
		</div>



		<!--Success Message Modal-->
		<div class="modal fade" tabindex="-1" role="dialog"
			id="organizationSourceMappingSuccessModal" aria-labelledby=""
			aria-hidden="true">
			<div class="modal-dialog modalSmallWidth">
				<div class="modal-content moduleSmall-content">
					<div class="modal-header">
						<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
						<h4 class="modal-title"
							id="organizationSourceMappingSuccessModalTitle">Success</h4>
					</div>

					<div id="body2" align="center" class="modal-body">
						<p id="organizationSourceMappingSuccessModalText" class="warning"></p>
						<div class="row mt10">

							<button class="btn btn-default" aria-hidden="true"
								data-dismiss="modal" type="button">OK</button>
						</div>
					</div>


				</div>
			</div>
		</div>
		



		
		<!-- End of Success Message Modal -->



	</div>

	<div id="editOrganizationSourceMappingDiv"></div>
	<div id="editOrganizationSourceMappingSuccessDiv"></div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-autocomplete/1.0.7/jquery.auto-complete.min.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/organizationSourceMapping.js"></script>
<script type="text/javascript"
	src="../resources/js/OrganizationSourceMappingSearch.js"></script>
</html>