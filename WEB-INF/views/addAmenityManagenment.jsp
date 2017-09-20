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
	<!-- Fixed navbar -->
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addAmenityManagement" data-toggle="tab">Add New Amenity Management Type</a>
			</li>
			<li><a href="#listAmenityManagement" data-toggle="tab" onclick="listAllAmenityManagement()">List Of Amenity Management Types</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New Amenity Management------------------------------------------ -->
			<div class="tab-pane active" id="addAmenityManagement">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successAmenityManagementDiv">
					<strong>Amenity Management Type Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error"	id="errorAmenityManagementDiv" style="display: none;">
				<strong><spring:message code="label.globalError"/></strong>
				</div>
				<form role="form" id="addAmenityManagementForm">
				
				
				<!-- -------------------Industry Type-------------------------------------- -->
					  <div class="form-group" id="amenityManagementTypes-Error">
			      <label><spring:message code="label.IndustryType"/></label>
			      <div  id="amenityIndustryTypeList"></div>
			      </div>
					
					
					<!-- -------------------Amenity Management Type-------------------------------------- -->
					<div class="form-group" id="amenityManagementType-Error">
						<label><spring:message code="label.amenityManagementName"/><font style="color: #a94442">*</font></label> 
						<span style="color: #a94442" id="amenityManagementType-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="amenityManagementType" name="amenityManagementNameType" placeholder="amenity Name " maxlength="50"> 
					</div>
					<!-- -----------------amenity Management Name Type Description------------------------------->
					<div class="form-group" id="amenityManagementTypeDesc-Error">
						<label><spring:message code="label.amenityManagementTypeDesc"/></label> 
						<textarea class="form-control" rows="3" name="amenityManagementTypeDescription" id="amenityManagementTypeDescription" maxlength="100" placeholder="Amenity Type Description"></textarea>
					</div>
					
					
					
					
					<!--------------------- Button --------------------------------------------->
					<%-- <input type="button" class="btn btn-primary"  onclick="savePoiType()" value="<spring:message code="label.save"/>"> --%>
					<button type="submit" class="btn btn-primary" id="saveAmenityManagementType"><spring:message code="label.save"/></button>

				</form>
			</div>
			<!-- --------------------List All amenity Management Name------------------------------------------ -->
			<div class="tab-pane" id="listAmenityManagement">
			</div>
		</div>
	</div>
	<div id="editAmenityManagementDiv"></div>
	
</body>
<%@include file="includeJsFiles.jsp"%>
<%@include file="includeHeaders.jsp"%>
<script src="../resources/js/amenityManagement.js"></script>



<script>
$(document).ready(function(){
	listOfIndustryTypes();
	
	$('.dropdown-toggle').dropdown();
	});
var selectedCheckBoxes=new Array();

function listOfIndustryTypes(){
	$("#newIndustryType").hide();
	 $("#listOfIndustryTypes").empty();
	$.ajax({
	url:'../IndustryTypes/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='industryType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].industryType+"'>"+data[i].industryType+"</option>";
	 }
	html+="</select> "; 
	$("#amenityIndustryTypeList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }


</script>

</html>