<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
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
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Repufact Cuatomer Dashboard">
<meta name="author" content="Bishav.n.r">
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title>Manage Users</title>
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
		            <!-- /.navbar-header -->
				<%@include file="leftNavigation.jsp"%>
		        </nav>
		 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
	<div id="page-wrapper">
        <!-- <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">Manage Users</h1>
            </div>
            /.col-lg-12
        </div>
        <div id="listUsers">
        </div> -->
        <div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">Manage Users</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
		<div id="userMasterTab">
			<div id="listUsers" style="display: none;">
				<form id="userMasterTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
					<label class="control-label " for="OrganizationGroup">Select Hotel Chain/Group 
						<select class="form-control input-sm">
							<option value="0">ALL</option>
						</select>
					</label>
					<label class="control-label " for="Organization">Select Hotel 
						<select class="form-control input-sm">
						</select>
					</label>
					<div class="form-group float-right">
						<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteUser()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
						<a onclick="addUser()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
						<a onclick="addUser()" class="btn btn-primary AdminAddButton float-right" type="button">Update</a>
					 </div>
				</form>
			</div>
			<div id="userDataDiv">
				<div id="listUsersDiv">
					<form role="form" id="listUserForm" style="display: none;">
				</form>
				</div>
			<div id="addAndEditManagerUserDiv"  class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
		</div>
		</div>
		<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	</div>
	</div>
</div>
	<%@include file="includeJsFiles.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/manageUsers.js"></script>
</body>

</html>
