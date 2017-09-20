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
 <title><spring:message code="label.organization.master" /></title>
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
            <h1 class="page-header">Organization</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
             <!-- Nav tabs -->
            	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
            		<li class="active"><a href="#listOrganizationGroupTab" data-toggle="tab" onclick="listOrganizationGroupButtonClick()"><spring:message code="label.OrgGroup"/></a>
					</li>
					<li><a href="#listOrganizationTab" data-toggle="tab" onclick="listOrganizationGroupName()"><spring:message code="label.Organization"/></a>
					</li>
					<li><a href="#listDepartmentTab" data-toggle="tab" onclick="orgGroupName()"><spring:message code="label.ticketDepartment"/></a>
					</li>
				</ul>
		<div id="organizationModuleTab" class="tab-content">
			<div class="tab-pane active" id="listOrganizationGroupTab">
				<div id="orgGroupFilterButtons"></div> 
				<!-- --------------------Add Organization Group Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="addOrganizationGroupSuccessDiv">
					<spring:message code="label.addOrganizationGroup.success"/>
				</div>
				<!-- --------------------Edit Organization Group Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="editOrganizationGroupSuccessDiv">
					<strong><spring:message code="label.editOrganizationGroup.success"/></strong>
				</div>
	
				<div id="organizationGroupDataDiv">
				</div>
			
		
			<!-- --------------------Organization Tab------------------------------------------ -->
			<div class="tab-pane" id="listOrganizationTab">
			<div id="organizationFilterButtons"></div> 
			<div id="organizationDataDiv"></div> 
			
			</div>
			<!-- --------------------Department Tab------------------------------------------ -->
			<div class="tab-pane " id="listDepartmentTab">
			</div>
			<!-- ---------------Department List Tab Rajesh -->
			<div class="tab-pane " id="departmentListData">
			</div>
		
			
      </div>
				
	
			<div id="addAndEditOrganizationGroupDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
			
		
		   <div id="addAndEditOrganizationDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>  
			<!--added rajesh-->			
       <div id="addAndEditDepartmentDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
			<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	
	<!-- ------Edit Department Modal----- --><!-- Rajesh -->
	
	 <div class="modal fade FilterLightBox" id="editDepaertmentMapping" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span></button>
         <h4 class="modal-title" id="modal-title"></h4>
      </div>
		<div class="modal-body row">
			<div class="FirstRowFilterOptions">
				<p id="departmentTitle"></p>
				<p id="AddDepartmentMOdalError" style="display: none;color : red">
				</p>
				<p id="AddDepartmentModalSucess" style="display: none;color : green">
				</p>
				<div id="editDepartmentMappingDiv" class="col-xs-12">
				</div>
				<hr>
				<div class="col-xs-4 col-xs-offset-4" class="modal-footer" id ="addCloseDiv" style="padding:15px 10px;">
					 <button id="save"   onclick="saveDepartmentAttribute()" class="btn btn-primary" type="submit">Save</button>
					<button type="button" class="btn btn-default" data-dismiss="modal" id = "close">Cancel</button> 
				</div>
				</div>
			</div>
        </div>
    </div>
  </div> 
  <!--Rajesh end  -->
	
	
	
	</div>
	</div>
	</div>
	</div>
	
</div>
	
	<!-- End -->
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
<!-- manoj -->
	$(document).ready(function listOrganizationGroupButtonClick(){
	 $("#organizationGroupTabButtons").hide();
	 $("#addAndEditOrganizationGroupDiv").hide();
	 console.log("inside listOrganizationGroupButtonClick() in jsp");
		$('#page-wrapper').mask('Loading...');
		$.get("../organizationGroup/selectOrgGroup.htm",function(response){
			if(response.status=="LIST_SUCCESS"){
				var organizationGroupList = response.successObject.organizationGroupList;
			
		var html="";
		//html+=	'<div id="orgGroupFilterButtons">';
		html+=	'<form id="listOrganizationGroupForm" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
		html+= '<div>';
		html+= '<label id="selectOrgGroupName" class="control-label" style="width:355px" for="selectOrgGroupName">OrgGroupName <select id="selectOrgGroupNameId" onchange="orgBrandNameList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
		html+= '<option value="0">All</option>';
		for(var i=0;i<organizationGroupList.length;i++){
			html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationGroupName)+'</option>';
			}  
		html+= '</select>';
		html+= '</label>';
		
		html+=' <label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" disabled class="form-control input-sm" style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
		html+='<option value="0">All</option>';
		html+= '</select>';
		html+= '</label>';
		html+= '</div>';
		html+= '</br>';
		
		html+=' <label id="orgGroupID" class="control-label" style="width:355px" for="orgGroupID">OrgGroupID &nbsp;&nbsp;<select id="selectOrgGroupId" onchange="orgGroupNameList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
		html+='<option value="0">All</option>';
		for(var i=0;i<organizationGroupList.length;i++){
			html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
			} 
		html+= '</select>';
		html+= '</label>';
		html+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId" disabled class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
		html+='<option value="0">All</option>';
		html+= '</select>';
		html+= '</label>';
		
		html+='<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="listOrganizationGroupTabClick()" value="View">';
		
		
		html+=		'<div class="form-group float-right">';
		html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteOrganizationGroup()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
		html+=			'<a onclick="addOrganizationGroup()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
		html+=		'</div>';
		html+=		'</form>';
		//html+=	'</div>';
		$('#page-wrapper').unmask();
		$("#orgGroupFilterButtons").append(html);
			}else{
				$('#organizationGroupDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
			}
		
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		});
		 });
</script>
<script src="../resources/js/organization.js"></script>
</html>