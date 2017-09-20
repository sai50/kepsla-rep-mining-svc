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
					<!-- -------------------Industry Type-------------------------------------- -->
					<div class="form-group" id="IndustryType-Error">
						<label><spring:message code="label.IndustryType"/></label> 
						<input	type="text" class="form-control" id="industryType" name="IndustryType" placeholder="Industry Type" maxlength="50" value="${editLocationType.industryType}"> 
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="industryTypeError">Error</span>
					</div>
					
					
					<div  id="segment-Error">
					<label><spring:message code="label.segment"/></label> 
                    <input type="text" class="form-control" id="segmentCategory_0" placeholder="segment" value="${editLocationType.segmentCategory}" />
                    <div id="addSegment">
                    </div></div>
                    
                    
                    <table id="segment">
                    </table>
                    
         
				<div class="form-group">
					<input type="button" class="btn btn-primary" id="IndustryType" onclick="addSegment()" value="Add Another Segment Category" />
					</div>
					<input type="hidden" value="${editLocationType.id}" id="editedLocationTypeId">
					<!--------------------- Button --------------------------------------------->
					<input type="button" value="<spring:message code="label.update"/>" class="btn btn-success" onclick="editLocation()" style="margin-left: -14px;" >
				</form:form>
			</div>
		</div>
		</div>
	
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/industryTypes.js"></script>
</html>