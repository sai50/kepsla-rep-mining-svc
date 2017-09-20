<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W5W4FN');</script>
<!-- End Google Tag Manager -->
<head lang="en">
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
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title><spring:message code="label.client.competitor.mapping" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div id="wrapper">
<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <c:choose>
				  <c:when test="${logoImageUrl == ''}">
				  </c:when>
				  <c:otherwise>
				   <a style="padding: 5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
            </div>
			<%@include file="leftNavigation.jsp" %>
 </nav>
 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
<div id="page-wrapper">
<div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">Client Competitor Mapping</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
             <!-- Nav tabs -->
            	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
					<%-- <li class="active" style="float: left;"><a href="#listClientCompetitorMappingTab" data-toggle="tab" onclick="clientCompetitorMappingList()"><spring:message code="label.clientCompitatorMappingTab"/></a>
					</li> --%>
					<li class="active"><a href="" data-toggle="tab" onclick="viewList()"><spring:message code="label.clientCompitatorMappingTab"/></a></li>
				
				</ul>
		<div id="clientCompetitorMappingTab" class="tab-content">
		<!-- --------------------Client Competitor Mapping----------------------------------------- -->
			<div class="tab-pane active" id="clientCompetitorMappingTab">
			<div>
			<form id="clientCompetitorMappingTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
										
										<div class="tab-pane fade in active" id="drops">
											<div class="row" style="margin-top: 10px">
												<label id="orgId" class="control-label col-xs-4" for="OrgId">OrgId
													<select id="selectedOrgIdType"
													class="form-control input-sm" onchange="getOrgID()"
													style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">
														<option value="0">ALL</option>
													
														
												 <c:forEach items="${orgnizationIdList}" var="clientCompetitorMapping">
														<option value="${clientCompetitorMapping.organizationId}">${clientCompetitorMapping.organizationId}
														</option>
														</c:forEach> 

												</select>
												</label> 
												
												
												<label id="orgName" class="control-label col-xs-4"
													for="OrganizationName">Org Name <select
													class="form-control input-sm"  onchange="getOrgNames()"
													id="selectedOrgNameType"
													style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">
														<option value="0">ALL</option>
												 <c:forEach items="${orgnizationIdList}" var="clientCompetitorMapping">
														<option value="${clientCompetitorMapping.organizationId}">${clientCompetitorMapping.clientName}
														</option>
														</c:forEach> 
														
												</select>
												</label> 
												
												
											</div>

											<div class="row" style="margin-top: 10px">
												<label id="compOrgId" class="control-label col-xs-4"
													for="CompOrgId">CompOrgId <select
													id="selectedCompOrgIdType" class="form-control input-sm"
													onchange="getCompOrgID()"
													style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">
														<option value="0">ALL</option>
														
														 <c:forEach items="${competitorIdList}" var="clientCompetitorMapping">
														<option value="${clientCompetitorMapping.competitor}">${clientCompetitorMapping.competitor}
														</option>
														</c:forEach> 
														

												</select>
												</label> 
												
												
												<label id="compOrgName" class="control-label col-xs-4"
													for="CompOrganizationName">Comp Org Name <select
													class="form-control input-sm" onchange="getCompOrgNames()"
													id="selectedCompOrgNameType"
													style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">
														<option value="0">ALL</option>
														
														<c:forEach items="${competitorIdList}" var="clientCompetitorMapping">
														<option value="${clientCompetitorMapping.competitor}">${clientCompetitorMapping.competitorName}
														</option>
														</c:forEach>  
														
												</select>
												</label> 
												
												
												<label id="dropView" class="control-label col-xs-4" for="">
													<a onclick="filterclientCompetitorMappingList()" class="btn btn-primary"
													type="button">View</a>
												</label>
												
												
											</div>
										</div>

										<div class="form-group float-right"><!-- New CHange -->
			 <button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteClientCompetitorMapping()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 					<a onclick="addClientCompetitorMapping()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
						 </div>
			</form>
			</div>
				
			<!-- --------------------Add Client Competitor Mapping Success Div----------------------------------------- -->
			<div class="alert alert-success" style="display: none;" id="addClientCompetitorMappingSuccessDiv">
				<strong><spring:message code="label.addClientCompitatorMapping.success"/></strong>
			</div>
			<!-- --------------------Edit Client Competitor Mapping Success Div----------------------------------------- -->
			<div class="alert alert-success" style="display: none;" id="editClientCompetitorMappingSuccessDiv">
				<strong><spring:message code="label.editClientCompitaorMapping.success"/></strong>
			</div>
				
			 <div id="clientCompetitorMappingDataDiv">
			</div> 
				
				<div id="addAndEditClientCompetitorMappingDiv"  style="display:none" class="SubHeading addAdminForm col-xs-12"></div> 
	
			</div>
			
		</div><!-- End Of Tab Content -->
		<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	<div id="editClientCompetitorMappingDiv"></div>
	<div id="editClientCompetitorMappingSuccessDiv"></div>
	</div>
	</div>
	
	
 <!--Success Message Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="clientCompetitorMappingSuccessModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="clientCompetitorMappingSuccessModalTitle">Success</h4>
							</div>
							
							<div id="body2"   align="center" class="modal-body">
							 	<p id="clientCompetitorMappingSuccessModalText" class="warning"></p>
							 	<div class="row mt10">
								 	
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
								</div>
							</div>
						</div>
					</div>
				</div>
<!-- End of Success Message Modal -->  
	
	
	
	
	</div>
</body>
 <%@include file="includeJsFiles.jsp"%> 
 
<script src="${pageContext.request.contextPath}/resources/js/clientCompetitorMapping.js"></script>
</html>