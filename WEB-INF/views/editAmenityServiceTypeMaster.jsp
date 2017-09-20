<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editAmenityServiceTypeMasterModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editAmenityServiceTypeMaster" class="form-horizontal" id="editAmenityServiceTypeMasterForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editAmenityServiceTypeMasterLabel">Edit AmenityServiceTypeMaster</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorAmenityServiceTypeMasterDiv" >
				<strong><spring:message code="label.globalError"/></strong>
				</div>
				
				
				<!-- -------------------Industry AMENITY Type NAME-------------------------------------- -->
					  <div class="form-group" id="amenityServiceTypeMasterType-Error">
			      <label><spring:message code="label.amenityManagementName"/></label>
			      <div  id="editamenityServiceTypeNameList"></div>
			      </div>
				
				<!-- -------------------AmenityServiceTypeMaster Type-------------------------------------- -->
					<div class="form-group" id="Edit-AmenityServiceTypeMasterType-Error">
						<label><spring:message code="label.AmenityServiceTypeName"/></label>
						<span style="color: #a94442" id="Edit-amenityServiceTypeName-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="editedamenityServiceTypeMasterType" name="amenityServiceTypeMasterType" placeholder="AmenityServiceTypeMaster Type" maxlength="50" value="${editAmenityServiceTypeMaster.amenityServiceTypeName}"> 
					</div>
				<!-- ----------------AmenityServiceTypeMaster Type Description------------------------------->
					<div class="form-group" id="Edit-AmenityServiceTypeMasterTypeDesc-Error">
						<label><spring:message code="label.AmenityServiceTypeDescription"/></label> 
						<textarea class="form-control"  rows="3" name="amenityServiceTypeMasterTypeDescription" id="editedAmenityServiceTypeMasterTypeDescription" maxlength="100" placeholder="AmenityServiceTypeMaster Type Description">${editAmenityServiceTypeMaster.amenityTypeDescription}</textarea>
					</div>
					
					<input type="hidden" value="${editAmenityServiceTypeMaster.id}" id="editedAmenityServiceTypeMasterId">
			
				<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-primary" id="editAmenityServiceTypeMaster" style="margin-left: -14px;"><spring:message code="label.update"/></button>
					<button type="button" class="btn btn-default" data-dismiss="modal"><spring:message code="label.close"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
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
   		success: function(response){console.log(response);
	 var html="";
	 var list = response.successObject.listAllAmenityManagement;
	 html+="<select id='amenityManagementType' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].id+"'>"+list[i].amenityName+"</option>";
	 }
	html+="</select> "; 
	$("#editamenityServiceTypeNameList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }


</script>

</html>