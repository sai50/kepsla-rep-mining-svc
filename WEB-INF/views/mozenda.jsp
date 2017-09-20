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
    <title><spring:message code="label.mozenda" /></title>
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
            <h1 class="page-header">Agent</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
             <!-- Nav tabs -->
            	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
					<li class="active"><a href="#listAgentTab" data-toggle="tab" onclick="sourceNameList()"><spring:message code="label.Agent"/></a>
					</li>
				</ul>
		<div id="kpiTab" class="tab-content">
		<div class="tab-pane active" id="AgentTabDiv">
		<div>
			<form id="editAgentForm" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			
			<!-- Source Name dropdown --> 
			<label id="selectSourceName" class="control-label" style="width:355px" for="selectSourceName">Source Name :<select id="selectSourceNameId" class="form-control input-sm"  style="width: 250px;">
	        <option value="0">All</option>
			</select>
			</label>	
			<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="listAgent()" value="View">
			<!-- Source Name dropdown -->
			
			<!-- add delete button --> 
			<div class="form-group float-right"><!-- New CHange -->
				<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteAgentMaster()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 			<a id="addAgentMasterButton" onClick="addAgentMaster()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
				</div>	
			<!-- add delete button -->
				
			</form>
			
		<!-- Agent table-->
		 <div class="alert alert-success" style="display:none;"id="updateAgentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Agent Data Updated Successfully</div>
	    <div id="listAgentTab"></div>
	    <!-- Agent table-->
	    
			</div> 
			<div id="addAndEditAgentDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
	    
	    <!-- --------------------Add/Edit KPI Div------------------------------------------ -->
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
		sourceNameList();
	});
</script> 
<script src="../resources/js/mozenda.js"></script>
</html>