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
    <title><spring:message code="label.user.master" /></title>
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
				   <a style="padding:5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
            </div>
			<%@include file="leftNavigation.jsp" %>
 </nav>
 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>

<div id="page-wrapper">
<div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">User Management</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
            <%-- <ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#userManagementTab" data-toggle="tab" onclick="listUsers()"><spring:message code="label.user.management"/></a>
			</li>
		</ul> --%>
		<div id="userMasterTab" class="tab-content">
			<!-- ------------------------------------------------------------- -->
			<div class="tab-pane active" id="userManagementTab">
			<div>
			<form id="userMasterTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			<div class="form-group float-right"><!-- New CHange -->
				<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteUser()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
					<a onclick="addUser()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
			 </div>
			</form>
			</div>
				<div id="userDataDiv">
				<form role="form" id="listUserForm">
				<div class="alert alert-success" style="display: none;"	id="deleteUserSuccessDiv">
					<spring:message code="label.delete.user.success"/>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="deleteUserErrorDiv">
				</div>
					<table class='table table-striped dataTable no-footer' id='userListTable'>
						<thead>
							<tr>
								<th><input type="checkbox" id="checkAllUserCheckBox" style="margin-left: 0px;"></th>
								<th><spring:message code="label.user.userName"/></th>
								<th><spring:message code="label.user.email"/></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<c:forEach items="${listUser}" var="user">
								<tr>
									<td><input type="checkbox" value="${user.id}" class="userCheckBox"></td>
									<td>${user.userName}</td>
									<td>${user.primaryEmail}</td>
									<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editUserForm(${user.id})"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
				</form>
				<div id="addAndEditUserMasterDiv"  class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
			</div>
			</div>
		</div>
		<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	</div>
	</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	$(document).ready(function(){
		$('#userListTable').dataTable();
	});
</script>
<script src="../resources/js/user.js"></script>
</html>