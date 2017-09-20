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
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title>AdminUserForm</title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
	
	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->

	<div id="wrapper">
<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
		<nav class="navbar navbar-Kepsla Black Logodefault navbar-static-top" role="navigation" style="margin-bottom: 0">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
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
					<h1 class="page-header">User Account</h1>
				</div>
				<div class="panel panel-admin">
					<div class="panel-body">
						<form id="viewDetailForm" class="form-inline col-xs-12 SubHeading AdminMainActivity">
							<!-- Role dropdown -->
							<div>
								<label id="selectedRole" class="control-label" for="selectedRole">Role <select id="selectRoleId" class="form-control input-sm" style="width: 200px; margin-bottom: 12px; margin-left: 28px" onChange="organizationGroupName()">
										<option value="0">All</option>
										<c:forEach items="${listRole}" var="roleList">
											<option value="${roleList.id}">${roleList.role}</option>
										</c:forEach>
								</select>
								</label>
							</div>

							<div>
							   <!-- ORG GROUP dropdown -->
								<label id="selectedOrgGroup" class="control-label" for="selectedOrgGroup">OrgGroup 
								<select id="selectedOrgGroupID" Disabled class="form-control input-sm" style="width: 200px; margin-bottom: 12px">
										<option value="0">All</option>
								</select>
								</label>
								<!-- ORG NAME dropdown -->
								<label id="selectedOrgName" for="selectedOrgName">OrgName
								<select id="selectedOrgNameId" Disabled class="form-control input-sm" style="width: 200px; margin-bottom: 12px">
										<option value="0">All</option>
								</select>
								</label>
								<!-- View Button -->
								<input type="button" style="width: 100px; margin-top: -14px" class="btn btn-primary btn-sm" id="viewList" onclick="listUser()" value="View User(s)">
								<!-- add delete button -->
								<div class="form-group float-right">
									<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteAdminUser()">
										<span aria-hidden="true" class="glyphicon glyphicon-trash"></span>
									</button>
									<a id="addAdminUserButton" onClick="addAdminUser()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
								</div>
								<!-- add delete button -->
							</div>
						</form>

						<!-- Admin User table-->
						<div class="alert alert-success" style="display: none;" id="updateAgentSuccessDiv">
							<img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Agent Data Updated Successfully
						</div>
						<div id="listAdminUserTab"></div>
						<!-- Admin User table-->
					</div><!-- panel body -->
					<div id="addAndEditAdminUserDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
				</div>
			</div>
		</div><!-- page-wrapper -->
		<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	
<!--Success Message Modal-->
	<div class="modal fade"  tabindex="-1" role="dialog" id="featureMasterModal" aria-labelledby="" aria-hidden="true">
			 <div class="modal-dialog modalSmallWidth">
				 <div class="modal-content moduleSmall-content">
					  <div class="modal-header">
								<h4 class="modal-title" id="featureMasterModalTitle">Success</h4>
					  </div>
				       <div id="featureMasterModalBody"   align="left" class="modal-body">
						 <p id="featureMasterModalText" class="warning"></p>
							 <div class="row mt10">
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
							 </div>
				       </div>
				        <div class="modal-footer" id="addFeatureMasterMappingFooter">
		            </div>
			     </div>
			</div> 
		</div> 
<!-- End of Success Message Modal -->  

<!--Success Message Modal-->
		<div class="modal fade"  tabindex="-1" role="dialog" id="featureMasterSuccessModal" aria-labelledby="" aria-hidden="true">
			 <div class="modal-dialog modalSmallWidth">
				 <div class="modal-content moduleSmall-content">
					  <div class="modal-header">
								<h4 class="modal-title" id="featureMasterModalTitle">Success</h4>
					  </div>
				       <div id="featureMasterModalBody"   align="center" class="modal-body">
						 <p id="featureMasterModalText" class="warning"></p>
							 <div class="row mt10">
									<button class="btn btn-default"  aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
							 </div>
				       </div>
			     </div>
			</div> 
		</div>
<!-- End of Success Message Modal --> 

<!--Success Message Modal-->
		<div class="modal fade"  tabindex="-1" role="dialog" id="featureMasterOrganizationModal" aria-labelledby="" aria-hidden="true">
			 <div class="modal-dialog modalSmallWidth">
				 <div class="modal-content moduleSmall-content">
					  <div class="modal-header">
								<h4 class="modal-title" id="featureMasterOrganizationModalTitle">Success</h4>
					  </div>
				       <div id="featureMasterOrganizationModalBody"   align="left" class="modal-body">
						 <p id="featureMasterOrganizationModalText" class="warning"></p>
							 <div class="row mt10">
									<button class="btn btn-default"  aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
							 </div>
				       </div>
				        <div class="modal-footer" id="featureMasterOrganizationMappingFooter">
		            </div>
			     </div>
			</div> 
		</div>
<!-- End of Success Message Modal --> 

<!--Success Message Modal-->
		<div class="modal fade"  tabindex="-1" role="dialog" id="featureMasterDepartmentModal" aria-labelledby="" aria-hidden="true">
			 <div class="modal-dialog modalSmallWidth">
				 <div class="modal-content moduleSmall-content">
					  <div class="modal-header">
								<h4 class="modal-title" id="featureMasterDepartmentModalTitle">Success</h4>
					  </div>
				       <div id="featureMasterDepartmentModalBody"   align="left" class="modal-body">
						 <p id="featureMasterDepartmentModalText" class="warning"></p>
							 <div class="row mt10">
									<button class="btn btn-default"  aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
							 </div>
				       </div>
				       <div class="modal-footer" id="featureMasterDepartmentMappingFooter">
		            </div>
			     </div>
			</div> 
		</div>
<!-- End of Success Message Modal --> 

<!--Success Message Modal-->
		<div class="modal fade"  tabindex="-1" role="dialog" id="featureMasterClientModal" aria-labelledby="" aria-hidden="true">
			 <div class="modal-dialog modalSmallWidth">
				 <div class="modal-content moduleSmall-content">
					  <div class="modal-header">
								<h4 class="modal-title" id="featureMasterClientModalTitle">Success</h4>
					  </div>
				       <div id="featureMasterClientModalBody"   align="left" class="modal-body">
						 <p id="featureMasterClientModalText" class="warning"></p>
							 <div class="row mt10">
									<button class="btn btn-default"  aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
							 </div>
				       </div>
				       <div class="modal-footer" id="featureMasterClientMappingFooter">
		            </div>
			     </div>
			</div> 
		</div>
<!-- End of Success Message Modal --> 
	
	</div><!-- Wrapper -->

</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/adminUser.js"></script>
<script src="../resources/js/util.js"></script>
<script src="../resources/js/tree.js"></script>
</html>