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
    <title><spring:message code="label.geo.master" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W5W4FN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
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
            <h1 class="page-header">Geo Master</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
             <!-- Nav tabs -->
            	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
					<li class="active"><a href="#geoCountryTab" data-toggle="tab" onclick="geoCountryListTab()"><spring:message code="label.geoCountry"/></a></li>
					<li><a href="#geoCityTab" data-toggle="tab" onclick="geoCityList()"><spring:message code="label.geoCity"/></a></li>
					<li><a href="#geoAreaTab" data-toggle="tab" onclick="geoAreaList()"><spring:message code="label.geoArea"/></a></li>
					<li><a href="#geoLocationTypeTab" data-toggle="tab" onclick="geoLocationTypeList()"><spring:message code="label.geoLocationType"/></a></li>
					<li><a href="#geoLocationTab" data-toggle="tab" onclick="geoLocationList()"><spring:message code="label.geoLocation"/></a></li>
					<li><a href="#geoMasterUploadFileTab" data-toggle="tab" onclick="geoMasterUploadFile()"><spring:message code="label.uploadFile"/></a></li>
				</ul>
		<div id="geoMasterTab" class="tab-content">	
			<!-- --------------------Geo Country Tab----------------------------------------- -->
			<div class="tab-pane active" id="geoCountryTab">
				<div>
					<form id="geoCountryMasterTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
						<div class="form-group float-right"><!-- New CHange -->
							<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteGeoCountries()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 						<a onclick="addGeoCountry()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
						 </div>
					</form>
				</div>
				<!-- --------------------Add Country Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="addCountrySuccessDiv">
					<spring:message code="label.addCountry.success"/>
				</div>
				<!-- --------------------Edit Country Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="editCountrySuccessDiv">
					<spring:message code="label.updateCountry.success"/>
				</div>
				<!-- ------------List County--------------------------------------------------------------- -->
				<div id="geoCountryDataDiv">
					<form id="geoCountryListForm">
						<div class="alert alert-success" style="display: none;"	id="deleteGeoCountriesSuccessDiv">
							<strong><spring:message code="label.deleteCountry.success"/></strong>
						</div>
						<div class="alert alert-danger alert-error" style="display: none;"	id="deleteGeoCountriesErrorDiv">
						</div>
						
						<table class='table table-striped dataTable no-footer' id='geoCountryListTable'>
							<thead>
								<tr>
									<th><input type="checkbox" id="checkAllGeoCountyCheckBox" style="margin-left: 0px;"></th>
									<th><spring:message code="label.geoCountry.name"/></th>
									<th><spring:message code="label.geoCountry.code"/></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<c:forEach items="${geoCountryMasterList}" var="geoCountryMaster">
									<tr>
										<td><input type="checkbox" value="${geoCountryMaster.id}" class="geoCountryCheckBox"></td>
										<td>${geoCountryMaster.geoCountryName}</td>
										<td>${geoCountryMaster.geoCountryCode}</td>
										<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editGeoCountry(${geoCountryMaster.id})"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</form>
						</div>
			</div>
			<div id="addAndEditGeoCountryDiv"  class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
			
			<!-- --------------------Geo City Tab------------------------------------------ -->
		    <div id="geoCityDivId">
			<div id="geoCityDataDiv"></div>
			</div>
			<div class="tab-pane" id="geoCityTab">
			</div> 
			<div id="addAndEditGeoCityDiv"  class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>
			
			<!-- --------------------Geo Area Tab------------------------------------------ -->
			<div id="geoAreaDivId">
			<div id="geoAreaDataDiv"></div> 
			</div>
			<div class="tab-pane " id="geoAreaTab">
			</div>
			<div id="addAndEditGeoAreaDiv"  class="SubHeading addAdminForm col-xs-12" style="display: none;"></div> 
			<!-- --------------------Geo Location Types Tab------------------------------------------ -->
			<div class="tab-pane" id="geoLocationTypeTab">
			</div>
			<!-- --------------------Geo Location  Tab------------------------------------------ -->
			<div class="tab-pane" id="geoLocationTab">
			</div>
			<!-- --------------------Upload File Tab------------------------------------------ -->
			<div class="tab-pane" id="geoMasterUploadFileTab">
			</div>
		</div><!--END PANEL BODY  -->
		</div><!-- End Of Tab Content -->
			<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	$(document).ready(function(){
		$('#geoCountryListTable').dataTable();
	});
</script>
<script src="${pageContext.request.contextPath}/resources/js/geoMaster.js"></script>
</html>