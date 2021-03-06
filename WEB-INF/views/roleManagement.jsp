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
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
 <title><spring:message code="label.role.management" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div id="wrapper">
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
<div id="page-wrapper">
<div class="row">
<div class="col-lg-12">
            <h1 class="page-header">Role Management</h1>
        </div>
	<div class="panel panel-admin">
	<div class="panel-body">
	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#RoleManagementTab" data-toggle="tab" onclick=""><spring:message code="label.roleManagemet"/></a></li>
		</ul>
		
			  <div class="tab-pane active" id="RoleManagementTab"> 
			 	<div>
			<form id="RoleManagementTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			<div class="row">
				<label class="control-label col-xs-4" for="parentType">Parent Role &nbsp;&nbsp;&nbsp;<select id="selectedParentRole" class="form-control input-sm" >
				<option  value="0">ALL</option>
					 <c:forEach items="${parentRole}" var="parentRole">
						<option  value="${parentRole.id}">${parentRole.role }</option>
					</c:forEach> 	
				</select>
			</label>
			<input type="button" class="btn btn-default btn-sm btn-primary .btn-large" id="viewList" onclick="RoleManagementList()" value="View Roles"/>
		</div>
			<div class="form-group float-right"><!-- New CHange -->
				<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteRoleManagemet()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 			<a onclick="addRoleManagemet()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
		    </div>
				</form>
			</div>
			
				
				 <!-- --------------------Add Role Management Success Div----------------------------------------- -->
				 <div class="alert alert-success" style="display: none;" id="addRoleManagementSuccessDiv">
					<strong><spring:message code="label.addRoleManagement.success"/></strong>
				</div>
				<!-- --------------------Edit Role Managemet Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="editRoleManagementSuccessDiv">
					<strong><spring:message code="label.updateRoleManagement.success"/></strong>
				</div>  
				<div class="alert alert-success" style="display: none;" id="deleteRoleManagementSuccessDiv">
					<strong><spring:message code="label.deleteRoleManagement.success"/></strong>
				</div>
				<div class="alert alert-success" style="display: none;" id="editRoleFeatureSuccessDiv">
					<strong><spring:message code="label.addRoleFeature.success"/></strong>
				</div>			
				<div class="alert alert-danger alert-error" style="display: none;"	id="deleteRoleManagementErrorDiv">
				</div>				
			<!-- --------------------SOURCE MASTER------------------------------------------ -->
			<div class="tab-pane" id="RoleManagementDataDiv">
			</div>
			<div id="addAndEditRoleManagementDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
		</div>
		<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	</div>
	</div>
	</div>
		<!-- ------Edit Feature mapping Modal----- -->
	
	 <div class="modal fade FilterLightBox" id="editRoleFeature" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">�</span></button>
         <h4 class="modal-title" id="modal-title"></h4>
      </div>
		<div class="modal-body row">
				 <p id="editRoleFeaturetModalError" class="alert alert-danger alert-error" style="display: none;"> </p>
				&nbsp;&nbsp;&nbsp;&nbsp;
				<p id="nameTitle"></p>
				<div id="editRoleFeatureDiv" class="col-xs-12">
				</div>
				<div class="modal-footer" id ="addCloseDiv" style="padding:15px 10px;">
				</div>
			</div>
        </div>
    </div>
  </div>
 </body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
</script>
<script src="${pageContext.request.contextPath}/resources/js/roleManagement.js"></script>
<script src="../resources/js/util.js"></script>
<script src="../resources/js/tree.js"></script>
</html>