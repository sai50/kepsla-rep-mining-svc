<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editAmenityRatePlanModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editAmenityRatePlan" class="form-horizontal" id="editAmenityRatePlanForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editAmenityRatePlanLabel">Edit Amenity Rate Plan</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
				<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorAmenityRatePlanDiv" >
				<strong><spring:message code="label.globalError"/></strong>
				</div>
				<!-- -------------------AmenityRatePlan Name-------------------------------------- -->
					<div class="form-group" id="Edit-AmenityRatePlanName-Error">
						<label><spring:message code="label.AmenityRatePlanName"/></label>
						<span style="color: #a94442" id="Edit-amenityRatePlanName-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="editedamenityRatePlanType" name="amenityRatePlanType" placeholder="Amenity Rate Plan Name" maxlength="50" value="${editAmenityRatePlan.ratePlanName}"> 
					</div>
				<!-- ----------------AmenityRatePlan Type Description------------------------------->
					<div class="form-group" id="Edit-AmenityRatePlanTypeDesc-Error">
						<label><spring:message code="label.amenityRatePlanDescription"/></label> 
						<textarea class="form-control"  rows="3" name="amenityRatePlanTypeDescription" id="editedAmenityRatePlanTypeDescription" maxlength="100" placeholder="Amenity Rate Plan Description">${editAmenityRatePlan.planDescription}</textarea>
					</div>
					<input type="hidden" value="${editAmenityRatePlan.id}" id="editedAmenityRatePlanId">
				<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-primary" id="editAmenityRatePlanType" style="margin-left: -14px;"><spring:message code="label.update"/></button>
					<button type="button" class="btn btn-default" data-dismiss="modal"><spring:message code="label.close"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
</body>
 <script src="../resources/js/amenityRatePlan.js"></script>
</html>