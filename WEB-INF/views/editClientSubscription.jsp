<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label.ghn}</title>
</head>
<body>
	<div class="modal fade" id="editClientSubscriptionModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
				<form:form modelAttribute="editClientSubscription" class="form-horizontal" id="editClientSubscriptionForm">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editClientSubscriptionLabel">Edit Client Subscription</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;">
					<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorClientSubscriptionDiv" >
				</div>
						<!-- -------------------Client Subscription Name-------------------------------------- -->
					<div class="form-group" id="Edit-ClientSubscriptionType-Error">
						<label><spring:message code="label.clientSubscriptionName"/></label>
						<input	type="text" class="form-control" id="editedClientSubscriptionType" name="ClientSubscriptionType" placeholder="ClientSubscription Type" maxlength="50" value="${editClientSubscription.subscriptionName}"> 
					</div>
					<!-- -----------------Client Subscription TotalCost------------------------------->
					<div class="form-group" id="ClientSubscriptionType-Error">
						<label><spring:message code="label.clientSubscriptionDiscouunt"/></label> 
						<input	type="text" class="form-control" id="editedclientSubscriptiondiscountFee" name="clientSubscriptionTypeDiscouunt" placeholder="ClientSubscription Discouunt" maxlength="50" value="${editClientSubscription.discountFee}"> 
					</div>
					
					<!-- ----------------Client Subscription TOTAL SUBSCRIPTION FEE ------------------------------->
					<div class="form-group" id="ClientSubscriptionType-Error" hidden="true">
						<label><spring:message code="label.clientSubscriptionTotalFee"/></label> 
						<input	type="text" class="form-control" id="clientSubscriptionTotalFee" name="clientSubscriptionTypeDiscouunt" placeholder="ClientSubscription Discouunt" maxlength="50" hidden="true" value="10" > 
					</div>
					
					
					<input type="hidden" value="${editClientSubscription.id}" id="editedClientSubscriptionId">
					<!--------------------- Button --------------------------------------------->
					<%-- <input type="button" value="<spring:message code="label.update"/>" class="btn btn-primary" onclick="editPoi()" style="margin-left: -14px;" > --%>
					<button type="submit" class="btn btn-primary" id="editClientSubscriptionType"><spring:message code="label.update"/></button>
					</div>
				</form:form>
			</div>
		</div>
	</div>
</body>
 <script src="../resources/js/clientSubscription.js"></script>
</html>