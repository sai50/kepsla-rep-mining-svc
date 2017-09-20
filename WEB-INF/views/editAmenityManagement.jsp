<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editAmenityManagementModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editAmenityManagement" class="form-horizontal" id="editAmenityManagementForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editAmenityManagementLabel">Edit Amenity Management</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorAmenityManagementDiv" >
				<strong><spring:message code="label.globalError"/></strong>
				</div>
					
					
					 <!-- -------------------Industry Type-------------------------------------- -->	
						 <div class="form-group" id="amenityManagementType-Error">
			      <label><spring:message code="label.IndustryType"/></label>
			      
			         <div  id="editAmenityIndustryTypeList" ></div>
			      
			   </div>
						
							<!-- -------------------Amenity Management Name-------------------------------------- -->
					<div class="form-group" id="Edit-AmenityManagementType-Error">
						<label><spring:message code="label.amenityManagementName"/></label>
						<span style="color: #a94442" id="Edit-AmenityManagementType-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="editedamenityManagementType" name="amenityManagementType" placeholder="AmenityManagement Type" maxlength="50" value="${editAmenityManagement.amenityName}"> 
					</div>
					<!-- -----------------Amenity Management Description------------------------------->
					<div class="form-group" id="Edit-AmenityManagementTypeDesc-Error">
						<label><spring:message code="label.amenityManagementTypeDesc"/></label> 
						<textarea class="form-control"  rows="3" name="amenityManagementTypeDescription" id="editedAmenityManagementTypeDescription" maxlength="100" placeholder="Amenity Management  Description">${editAmenityManagement.amenityDescription}</textarea>
					</div>
					
					 <!-- -------------------Industry Type-------------------------------------- -->
				<!--	<div class="form-group" id="amenityManagementType-Error">
					<select class="form-control" id="amenityManagementType-Error" name="amenityManagementType-Error"> 
						<option id="amenityIndustryType" value="Area Specific ">Travel</option>
						<option value="District Location">Finance</option>
					</select>
					</div> -->
					
					<input type="hidden" value="${editAmenityManagement.id}" id="editedAmenityManagementId">
					<!--------------------- Button --------------------------------------------->
					<%-- <input type="button" value="<spring:message code="label.update"/>" class="btn btn-primary" onclick="editPoi()" style="margin-left: -14px;" > --%>
					<button type="submit" class="btn btn-primary" id="editAmenityManagementType"><spring:message code="label.update"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
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
	 html+="<select id='editIndustryType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].industryType+"'>"+data[i].industryType+"</option>";
	 }
	html+="</select> "; 
	$("#editAmenityIndustryTypeList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }


</script>
 
</html>