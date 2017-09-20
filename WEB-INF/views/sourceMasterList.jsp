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
 <title><spring:message code="label.source.factor" /></title>
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
            <h1 class="page-header">Source Master</h1>
        </div>
	<div class="panel panel-admin">
	<div class="panel-body">
	<!-- <div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main"> -->
	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#sourceMasterTab" data-toggle="tab" onclick="sourcePage()"><spring:message code="label.source"/></a></li>
		</ul>
		
			  <div class="tab-pane active" id="sourceMasterTab"> 
			 	<div>
			<form id="sourceTypeTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			<div class="row">
				<label class="control-label col-xs-4" for="sourceType">Source Type<select id="selectedSourceType" class="form-control input-sm" >
				<option  value="0">ALL</option>
					<c:forEach items="${sourceMasterType}" var="sourceMasterType">
						<option  value="${sourceMasterType.sourceType}">${sourceMasterType.sourceType }</option>
					</c:forEach>	
					<option  value="other">Other</option>
				</select>
				<%-- <c:set var="sourceList" value="${sourceMasterType}" scope="request"></c:set> --%>
			</label>
			<input type="button" class="btn btn-default btn-sm btn-primary" id="viewList" onclick="sourceMasterList()" value="View"/>
		</div>
			<div class="form-group float-right"><!-- New CHange -->
				<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteSourceMaster()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 			<a onclick="addSourceMaster()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
		    </div>
				</form>
			</div>
			
				
				 <!-- --------------------Add Source Master Success Div----------------------------------------- -->
				 <div class="alert alert-success" style="display: none;" id="addSourceMasterSuccessDiv">
					<strong><spring:message code="label.addSource.success"/></strong>
				</div>
				<!-- --------------------Edit Source Master Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="editSourceMasterSuccessDiv">
					<strong><spring:message code="label.updateSource.success"/></strong>
				</div>  
		<div class="alert alert-success" style="display: none;" id="deleteSourceMasterSuccessDiv">
					<strong><spring:message code="label.deleteSource.success"/></strong>
		</div>		
		<div class="alert alert-danger alert-error" style="display: none;"	id="deleteSourceMasterErrorDiv">
		</div>		
				
			<!-- --------------------SOURCE MASTER------------------------------------------ -->
			<div class="tab-pane" id="sourceMasterDataDiv">
			</div>
			<div id="addAndEditSourceMasterDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
		</div>
		<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	<!-- <div id="editIndustryKpiDiv"></div>
	<div id="editIndustryKpiSuccessDiv"></div> -->
	</div>
	</div>
	</div>
	</div>
	</div>
	<!-- </div>  -->
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	
</script>
<script src="${pageContext.request.contextPath}/resources/js/sourceMasterList.js"></script>
<script src="../resources/js/util.js"></script>
</html>