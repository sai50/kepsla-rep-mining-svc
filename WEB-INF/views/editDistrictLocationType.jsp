<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editLocationTypeModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editLocationType" class="form-horizontal" id="editLocationTypeModalForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editLocationTypeModalLabel">Edit District Location Type</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorLocationTypeDiv" >
				</div>
						<!-- -------------------POI Type-------------------------------------- -->
					<div class="form-group" id="Edit-PoiType-Error">
						<label><spring:message code="label.locationType"/></label>
						<input	type="text" class="form-control" id="editedlocationType" name="locationType" placeholder="Location Type" maxlength="50"  value="${editDistrictLocationType.districtLoc}"> 
					</div>
					<!-- -----------------POI Type Description------------------------------->
					<div class="form-group" id="Edit-PoiTypeDesc-Error">
						<label><spring:message code="label.locationTypeDesc"/></label> 
						<textarea class="form-control"  rows="3" name="locationTypeDescription" id="editedlocationTypeDescription" maxlength="100" placeholder="Location Type Description">${editDistrictLocationType.districtLocDescription}</textarea>
					</div>
					<input type="hidden" value="${editDistrictLocationType.id}" id="locationTypeById">
					<!--------------------- Button --------------------------------------------->
					<input type="button" value="<spring:message code="label.update"/>" class="btn btn-success" onclick="editDistrictLocation()" style="margin-left: -14px;" >
					</div>
				</form:form>
			</div>
		</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/locationTypes.js"></script>
</html>