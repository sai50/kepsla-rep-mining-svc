<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editManageSourceModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editManageSource" class="form-horizontal" id="editManageSourceForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editManageSourceLabel">Edit Manage Source</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorManageSourceDiv" >
				   </div>
						
					<!-- -------------------Manage Source Name -------------------------------------- -->
					<div class="form-group" id="Edit-ManageSourceName-Error">
						<label><spring:message code="label.manageSourceName"/></label>
						<input	type="text" class="form-control" id="editedManageSourceName" name="manageSourceName" placeholder="Manage Source Name" maxlength="50" value="${editManageSource.sourceName}"> 
					</div>	
						
						
						<!-- -------------------Manage Source Type-------------------------------------- -->
					<div class="form-group" id="Edit-ManageSourceUrl-Error">
						<label><spring:message code="label.manageSourceType"/></label>
						<input	type="text" class="form-control" id="editedManageSourceUrl" name="manageSourceUrl" placeholder="Manage Source Url" maxlength="50" value="${editManageSource.sourceUrl}"> 
					</div>
					
					
					<!-- -----------------Manage Source Type Description------------------------------->
					<div class="form-group" id="manageSourceTypeDesc-Error">
						<label><spring:message code="label.manageSourceType"/></label> 
					 <select class="form-control" id="editedManageSourceType" name="manageSourceTypeDescription"> 
						<option value="Blog">Blog</option>
						<option value="ReviewSite">Review Site</option>
                        <option value="SocialNetworkingSite">Social Networking Site</option>
                        <option value="OtherInformationSite">Other Information Site</option>
   
                       </select>
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="manageSourceTypeDesc-Error"></span>
					</div>
					
					
					<input type="hidden" value="${editManageSource.id}" id="editedManageSourceId">
					<!--------------------- Button --------------------------------------------->
					<%-- <input type="button" value="<spring:message code="label.update"/>" class="btn btn-primary" onclick="editManageSource()" style="margin-left: -14px;" > --%>
					<button type="submit" class="btn btn-primary" id="editManageSourceType"><spring:message code="label.update"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
</body>
 <script src="../resources/js/manageSource.js"></script>
</html>