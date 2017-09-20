<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editPlaceOfInterestModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editPlaceOfInterest" class="form-horizontal" id="editPoiForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editPlaceOfInterestLabel">Edit Place Of Interest</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="editPoiErrorDiv">
					<strong><spring:message code="label.globalError"/></strong>
				</div>
				<!-- -------------------POI Type-------------------------------------- -->
					<div class="form-group" id="Edit-PoiType-Error">
						<label><spring:message code="label.poiType"/><font style="color: red">*</font></label> 
						<span style="color: #a94442" id="Edit-poiType-span-Error" class="help-inline"></span>
						<input	type="text" class="form-control" id="editedpoiType" name="poiType" placeholder="Poi Type" maxlength="50" value="${editPlaceOfInterest.poiType}"> 
					</div>
				<!-- -----------------POI Type Description------------------------------->
					<div class="form-group" id="Edit-PoiTypeDesc-Error">
						<label><spring:message code="label.poiTypeDesc"/></label> 
						<textarea class="form-control"  rows="3" name="poiTypeDescription" id="editedPoiTypeDescription" maxlength="100" placeholder="Poi Type Description">${editPlaceOfInterest.poiTypeDescription}</textarea>
					</div>
					<input type="hidden" value="${editPlaceOfInterest.id}" id="editedPoiId">
				<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-primary" id="editPoiType" style="margin-left: -14px;"><spring:message code="label.update"/></button>
					<button type="button" class="btn btn-default" data-dismiss="modal"><spring:message code="label.close"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
</body>
 <script src="../resources/js/placeOfInterest.js"></script>
</html>