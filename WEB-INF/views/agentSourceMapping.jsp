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
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title>Agent Organization Mapping</title>
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
            <h1 class="page-header">Agent Organization Mapping</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
             <!-- Nav tabs -->
            	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
					<li class="active"><a href="#listGeneralKpiTab" data-toggle="tab" onclick="listAgentOrganizationMapping(0)">Agent Organization Mapping</a>
					</li>
				</ul>
		<div id="agentSourceMappingTab" class="tab-content">
		<div class="tab-pane active" id="agentSourceMappingTabDiv">
			<form id="agentSourceMappingTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			<a href="../mozenda/list.htm" data-toggle="tab" onclick="redirectView('../mozenda/list.htm')">Go back to Source Mapping</a>
			<div class="form-group float-right"><!-- New CHange -->
				<!-- <button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteAgentOrganizationMapping()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 			<a id="addAgentOrganizationMappingButton" class="btn btn-primary AdminAddButton float-right" type="button">+</a> -->
				</div>			
			</form>
		</div>
			<!-- --------------------Add Agent Organization Mapping Success Div----------------------------------------- -->
			<div class="alert alert-success" id="addAgentOrganizationMappingSuccessDiv" style="display: none;">
				Agent organization mapping created successfully
			</div>
			<!-- --------------------Agent Organization Mapping ----------------------------------------- -->
			<div class="tab-pane active" id="listAgentOrganizationMappingTab">
				<form role="form" id="listAgentOrganizationMappingForm">
					<table class='table table-striped dataTable no-footer' id='listAgentOrganizationMappingTable'>
						<thead>
							<tr>
								<!-- <th><input type="checkbox" id="checkAllAgentOrganizationMappingCheckBox" style="margin-left: 0px;"></th> -->
								<th>Agent Name</th>
								<th>Organization Name</th>
								<!-- <th></th> -->
							</tr>
						</thead>
						<tbody>
							<c:forEach items="${listAgentOrganizationMapping}" var="agentOrganizationMapping">
								<tr>
									<%-- <td><input type="checkbox" value="${agentOrganizationMapping.id}" class="agentSourceMappingCheckBox"></td> --%>
									<td>${agentOrganizationMapping.agentName}</td>
									<td>${agentOrganizationMapping.organizationName}</td>
									<!-- <td><button type="button" class="btn btn-xs AdminInList" title="Edit"   onclick="editAgentMaster('+agentList[i].id+')"><span class="glyphicon glyphicon-pencil"></span></button></td> -->
							</c:forEach>
						</tbody>
					</table>
				</form>
			</div>
			<!-- --------------------Add/Edit KPI Div------------------------------------------ -->
			<div id="addAndEditAgentOrganizationMappingDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;">
			</div>
		</div>
		</div><!-- -Tab Pane -->
			<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	 </div><!-- row -->
 </div><!-- page-wrapper -->
</div><!-- Wrapper -->
</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	$(document).ready(function(){
		$('#listAgentOrganizationMappingTable').dataTable();
	});

</script>
<script src="../resources/js/mozenda.js"></script>
</html>