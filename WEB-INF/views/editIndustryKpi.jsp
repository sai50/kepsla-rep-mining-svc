<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editKpiIndustryModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="kpiIndustryMaster" class="form-horizontal" id="editKpiIndustryForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title">Edit KPI</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="editKpiIndustryErrorDiv">
				</div>
				<!-- -------------------Industry Type-------------------------------------- -->
					<div class="form-group">
						<label>Industry</label> 
						<select class="form-control" disabled="disabled">
							<option value="${kpiIndustryMaster.industryType}">${kpiIndustryMaster.industryType}</option>
						</select>
					</div>
				<!-- -----------------KPI------------------------------->
					<div class="form-group" id="Edit-kpiName-Error">
						<label><spring:message code="label.kpi"/><font style="color: red">*</font></label> 
						<span style="color: #a94442" id="Edit-kpiName-span-Error" class="help-inline"></span>
						<textarea class="form-control"  rows="3" name="kpiName" id="editedIndustryTypeKpiName" maxlength="100" placeholder="KPI Name">${kpiIndustryMaster.kpiName}</textarea>
					</div>
					<input type="hidden" value="${kpiIndustryMaster.id}" id="editedKpiIndustryId">
				<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-primary" style="margin-left: -14px;"><spring:message code="label.update"/></button>
					<button type="button" class="btn btn-default" data-dismiss="modal"><spring:message code="label.close"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
</body>
 <script src="../resources/js/kpiMaster.js"></script>
</html>