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
<link rel="shortcut icon" href="../resources/images/favicon.ico"
	type="image/x-icon">
<title><spring:message code="label.organization.source.mapping" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
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
					<h1 class="page-header">Source Login Credentials</h1>
				</div>
				<div class="panel panel-admin">
					<div class="panel-body">
						<!-- Nav tabs -->
						<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
							<li class="active" style="float: left;"><a
								href="#listOrganizationSourceMappingTab" data-toggle="tab"
								onclick="organizationSourceMappingClick()">Source Login Credentials</a></li>
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
						
						<div id="organizationSourceMappingDataDiv">
								</div>
						
						
						
						<div id="addAndEditOrganizationSourceMappingDiv"
										class="SubHeading addAdminForm col-xs-12"
										style="display: none;"></div>
										
						<a href="#" onclick="scrollDown($('#wrapper'))"
							style="float: right;"><img alt="no Image Found"
							src="../resources/images/scrollTop.png"></a>
					</div>
				</div>
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
<script type="text/javascript">
	//start
	   $(document).ready(function organizationSourceMappingClick(){
	       $("#organizationGroupTabButtons").hide();
	 console.log("inside listOrganizationGroupButtonClick() in jsp");
		$('#page-wrapper').mask('Loading...');
		$.get("../organizationSourceMapping/listOrg.htm?sourceMasterFilter=filter",function(response){
			if(response.status=="LIST_SUCCESS"){
			 	var listOrgIdAndName = response.successObject.listOrgIdAndName; 
			 	var sourceList = response.successObject.sourceList; 
			 	
		var html="";
		html+=	'<div id="orgGroupFilterButtons">';
		html+=	'<form id="listOrganizationSourceMappingForm" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
		
		html+= '<label id="selectOrgID" class="control-label" style="width:21%" for="selectOrgID">OrgID <select id="selectOrgId" onchange="orgNameList()" class="form-control input-sm"   style="width: 130px;">';
		html+= '<option value="0">All</option>';
		 for(var i=0;i<listOrgIdAndName.length;i++){
				html+='<option value="'+listOrgIdAndName[i].id+'">'+$.trim(listOrgIdAndName[i].id)+'</option>';
				}
		html+= '</select>';
		html+= '</label>';
		
		html+=' <label id="selectOrgName" class="control-label" style="width:30%" for="selectOrgName">OrgName <select id="selectOrgNameId" onchange="orgIdList()" class="form-control input-sm"  style="width: 207px;">';
		html+='<option value="0">All</option>';
		for(var i=0;i<listOrgIdAndName.length;i++){
			html+='<option value="'+listOrgIdAndName[i].id+'">'+$.trim(listOrgIdAndName[i].organizationFullName)+'</option>';
			}
		html+= '</select>';
		html+= '</label>';
		
		/**************for source name only************/
		 
		html+=' <label id="selectSourceName" class="control-label" style="width:24%" for="selectSourceName">SourceName <select id="selectSourceNameId" class="form-control input-sm"  disabled style="width: 130px;" onchange="clearMessage()">';
		html+='<option value="0">All</option>';
		for(var i=0;i<sourceList.length;i++){
			html+='<option value="'+sourceList[i].sourceName+'">'+$.trim(sourceList[i].sourceName)+'</option>';
		 }
		html+= '</select>';
		html+= '</label>';

		html+='<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="organizationSourceMappingList()" value="View">';
		
		
		html+=		'<div class="form-group float-right">';
		html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteOrganizationSourceMapping()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
		html+=			'<a onclick="addOrganizationSourceMapping()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
		html+=		'</div>';
		html+=		'</form>';
		html+=	'</div>';
		$('#page-wrapper').unmask();
		$("#organizationSourceMappingButtonsDiv").append(html);
			 } else{
				$('#organizationGroupDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
			}  
		
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		});
		  });  
	
	//end
	

</script>
<script src="${pageContext.request.contextPath}/resources/js/sourceCredentials.js"></script>
</html>