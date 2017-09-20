<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
<title><spring:message code="label.ghn"/></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

	<div class="container">
<div class="tab-pane active" id="newOrganization">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successOrganizationDiv">
					<strong>Organization Data Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="errorOrganizationDiv">
					<strong>Errors Occured.</strong>
				</div>
			<form class="form-horizontal" role="form"  id="addOrganizationForm">
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationFullName"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="organizationFullName" 
			            placeholder="Enter Organization Full Name ">
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationDisplayName"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="organizationDisplayName" 
			            placeholder="Enter Organization Display Name ">
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.PrimaryEmailId"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="primaryEmailId" 
			            placeholder="Enter Primary Email Id ">
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.IndustryType"/></label>
			      <div class="col-sm-10">
			         <div  id="industryTypeList"></div>
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.OrganizationType"/></label>
			      <div class="col-sm-10">
			         <div id="organizationTypeList"></div>
			      </div>
			   </div>
			   <div class="form-group">
			      <label  class="col-sm-2 control-label"><spring:message code="label.ArchitecturalStyle"/></label>
			      <div class="col-sm-10">
			         <div  id="architecturalStyleList"></div>
			      </div>
			   </div>
			    <div class="form-group">
			      <label  class="col-sm-2 control-label"><spring:message code="label.ParentOrganization"/></label>
			      <div class="col-sm-10">
			         <div  id="parentOrganizationList"></div>
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.SelfRatingType"/></label>
			      <div class="col-sm-10">
			         <div  id="selfRatingList"></div>
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label" for="inputfile"><spring:message code="label.UploadOrganizationLogo"/></label>
			      <div class="col-sm-10">
			         <input type="file" class="form-control"  id="uploadOrganizationLogo" 
			            placeholder="upload Organization Log">
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.UploadOrganizationBanner"/></label>
			      <div class="col-sm-10">
			         <input type="file" class="form-control"  id="uploadOrganizationBanner" 
			            placeholder="upload Organization Banner ">
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizatinAddress"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="organizationAddress1" 
			            placeholder="Enter Organization Primary Address">
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationAddress"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="organizationAddress2" 
			            placeholder="Enter Organization Secondary Address ">
			      </div>
			   </div>
				 <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.Country"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="organizationCountry"  placeholder="Enter Country ">
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.State"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="organizationState" 
			            placeholder="Enter State ">
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.City"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="organizationCity" 
			            placeholder="Enter City ">
			   	 </div>
			   </div>
			   <div class="form-group">
			      <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.SpecificLocation"/></label>
			      <div class="col-sm-10">
			         <div id="specificLocationList"></div>
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.LocationDistrict"/></label>
			      <div class="col-sm-10">
			         <div id="locationDistrictList"></div>
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.AreaLocation"/></label>
			      <div class="col-sm-10">
			         <div  id="areaLocationList"></div>
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.GeoLatitude"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="geoLatitude" 
			            placeholder="Enter Latitude ">
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.GeoLongitude"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="geoLongitude" 
			            placeholder="Enter Longitude ">
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactEmail"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="contactEmail" 
			            placeholder="Enter Contact Email ">
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="primaryNumber" 
			            placeholder="Enter Primary Number ">
			      </div>
			   </div>
			    <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="secondaryNumber" 
			            placeholder="Enter Secondary Number ">
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="pincode" 
			            placeholder="Enter Pincode ">
			      </div>
			   </div>
			   <div class="form-group">
			      <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.Fax"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="fax" 
			            placeholder="Enter Fax Number ">
			      </div>
			   </div>
				
					<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-default" id="saveOrganization">Submit</button>
				</form>
			</div>
		</div>
	</div>		
</body>
<%@include file="includeJsFiles.jsp"%>
<%@include file="includeHeaders.jsp"%>
<script src="../resources/js/createOrganization.js"> </script>
</html>