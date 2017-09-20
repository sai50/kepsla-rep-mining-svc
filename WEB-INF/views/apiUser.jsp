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
    <title><spring:message code="label.api.user" /></title>
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
            <h1 class="page-header">API Users</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
             <!-- Nav tabs -->
            	<%-- <ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
					<li class="active"><a href="#listApiUserTab" data-toggle="tab" onclick="listApiUserTab()"><spring:message code="label.user"/></a>
					</li>
				</ul> --%>
		<div id="kpiTab" class="tab-content">
	 <div class="tab-pane active" id="apiUserTabDiv">
			<form id="apiUserTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			<spring:message code="label.heading"/>
			<div class="form-group float-right"><!-- New CHange -->
				<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteApiUser()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 			<a id="addApiUserButton" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
				</div>			
			</form>
		</div> 
		
			<!-- --------------------Add General KPI Success Div----------------------------------------- -->
			<div class="alert alert-success" id="addApiUserSuccessDiv" style="display: none;">
				<spring:message code="label.add.kpi.success"/>
			</div>
			<!-- --------------------Edit General KPI Success Div----------------------------------------- -->
			<div class="alert alert-success" id="editIndustryKpiSuccessDiv" style="display: none;">
				<spring:message code="label.edit.kpi.success"/>
			</div>
			<!-- --------------------General KPI----------------------------------------- -->
			<div class="tab-pane active" id="listApiUserTab">
				<form id="listApiUserForm">
					<table class='table table-striped dataTable no-footer' id='listApiUserTable' style="table-layout:auto;">
						<thead>
							<tr>
								<th><input type="checkbox" id="checkAllApiUserCheckBox"></th>
								 <th><spring:message code="label.api.username"/></th>
								 <th>password</th>
								<th><spring:message code="label.status"/></th>
								 <th>clientCount</th>
								 <th>clientId & clientSecret</th>
								<th><spring:message code="label.settings"/></th>
							</tr>
						</thead>
						<tbody>
							<c:forEach items="${apiUserList}" var="apiUser">
								<tr>
									<td><input type="checkbox" value="${apiUser.userId}" class="apiUserCheckBox"></td>
									 <td>${apiUser.userName}</td>
									 <td>${apiUser.plainPassword}</td>
									<td>
									<c:choose>
                                      <c:when test="${apiUser.userEnabled=='true'}">
                                      enabled 
                                     </c:when>    
                                     <c:otherwise>
                                       disabled 
                                      </c:otherwise>
                                       </c:choose></td>
                                       <td>${apiUser.organizationCount}</td> 
                                     <td style="word-break:break-word;">${apiUser.clientId}</td>
									<td><span style="margin-left: -2px;"><span><button type='button' class='btn btn-xs AdminInList' title='Edit' onclick='editApiUser(${apiUser.userId})'><span class='glyphicon glyphicon-pencil'></span></button></span>
									<span><button type='button' style="right=-1px;" class='btn btn-xs AdminInList' title='Settings'   onclick='editSettingApiUser(${apiUser.userId})'><span class='glyphicon glyphicon-cog'></span></button></span></span></td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
				</form>
			</div>
			<!-- --------------------Add/Edit KPI Div------------------------------------------ -->
			<div id="addAndEditApiUserDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;">
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
<script src="../resources/js/jquery.ui.widget.js"></script>
<script src="../resources/js/jquery.iframe-transport.min.js"></script>
<script  src="../resources/js/jquery.fileupload.js"></script>
<script  src="../resources/js/jquery.MultiFile.js"></script>
<script src="../resources/js/apiUser.js"></script>
<script type="text/javascript">
	$(document).ready(function(){
		$('#listApiUserTable').dataTable({
		});
	});

</script>

</html>