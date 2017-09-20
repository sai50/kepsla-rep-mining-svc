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
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addAmenityServiceTypeMaster" data-toggle="tab">Add New Amenity Service Type Master</a>
			</li>
			<li><a href="#listAmenityServiceTypeMaster" data-toggle="tab" onclick="listAllAmenityServiceTypeMaster()">List Of Amenity Service Type Master</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New AmenityServiceTypeMaster------------------------------------------ -->
			<div class="tab-pane active" id="addAmenityServiceTypeMaster">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successAmenityServiceTypeMasterDiv">
					<strong>Amenity Service Type Master Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error"	id="errorAmenityServiceTypeMasterDiv" style="display: none;">
				<strong><spring:message code="label.globalError"/></strong>
				</div>
				<form role="form" id="addAmenityServiceTypeMasterForm">
				
				
				<!-- -------------------Industry AMENITY Type NAME-------------------------------------- -->
					  <div class="form-group" id="amenityServiceTypeMasterTypes-Error">
			      <label><spring:message code="label.amenityManagementName"/></label>
			      <div  id="amenityServiceTypeNameList"></div>
			      </div>
				
				
					<!-- -------------------AmenityServiceTypeMaster Type-------------------------------------- -->
					<div class="form-group" id="amenityServiceTypeMasterType-Error">
						<label><spring:message code="label.AmenityServiceTypeName"/><font style="color: red">*</font></label> 
						<span style="color: #a94442" id="amenityServiceTypeName-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="amenityServiceTypeMasterType" name="amenityServiceTypeMasterType" placeholder="Amenity Service Type Name" maxlength="50"> 
					</div>
					
					
					<!-- -----------------AmenityServiceTypeMaster Type Description------------------------------->
					<div class="form-group" id="amenityServiceTypeMasterTypeDesc-Error">
						<label><spring:message code="label.AmenityServiceTypeDescription"/></label> 
						<textarea class="form-control" rows="3" name="amenityServiceTypeMasterTypeDescription" id="amenityServiceTypeMasterTypeDescription" maxlength="100" placeholder="Amenity Service Type Description"></textarea>
					</div>
					
					
					<!--------------------- Button --------------------------------------------->
					<%-- <input type="button" class="btn btn-primary"  onclick="savePoiType()" value="<spring:message code="label.save"/>"> --%>
					<button type="submit" class="btn btn-primary" id="saveAmenityServiceTypeMasterType"><spring:message code="label.save"/></button>

				</form>
			</div>
			
			
			<!-- --------------------List All Place Of Interest Types------------------------------------------ -->
			<div class="tab-pane" id="listAmenityServiceTypeMaster">
			</div>
		</div>
	</div>
	<div id="editAmenityServiceTypeMasterDiv"></div>
	
</body>
<%@include file="includeJsFiles.jsp"%>
<%@include file="includeHeaders.jsp"%>
<script src="../resources/js/amenityServiceTypeMaster.js"></script>




<script>
$(document).ready(function(){
listAllAmenityManagement();
	
	$('.dropdown-toggle').dropdown();
	});
var selectedCheckBoxes=new Array();

function listAllAmenityManagement(){
	 $.ajax({
   		type: "get",
   		url: "../amenityManagement/list.htm",
        dataType: "json",
   		success: function(response){
	 var html="";
	 var list = response.successObject.listAllAmenityManagement;
	 html+="<select id='amenityManagementType' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].id+"'>"+list[i].amenityName+"</option>";
	 }
	html+="</select> "; 
	$("#amenityServiceTypeNameList").append(html);
    },error:function(data){
    	
    }
    });
    }


</script>

</html>