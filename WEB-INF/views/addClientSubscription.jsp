<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<title><spring:message code="label.ghn"/></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	<!-- Fixed navbar -->
	
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addClientSubscription" data-toggle="tab">Add New ClientSubscription</a>
			</li>
			<li><a href="#listAllClientSubscription" data-toggle="tab" onclick="listAllClientSubscription()">List Of Client Subscription</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New Client Subscription------------------------------------------ -->
			<div class="tab-pane active" id="addClientSubscription">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successClientSubscriptionDiv">
					<strong>Client Subscription Type Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error"	id="errorClientSubscriptionDiv" style="display: none;">
				<strong>Errors Occured.</strong>
				</div>
				<form role="form" id="addClientSubscriptionForm">
					<!-- -------------------Client SubscriptionType-------------------------------------- -->
					<div class="form-group" id="ClientSubscriptionType-Error">
						<label><spring:message code="label.clientSubscriptionName"/></label> 
						<input	type="text" class="form-control" id="clientSubscriptionName" name="clientSubscriptionType" placeholder="ClientSubscription Name" maxlength="50" > 
						</div>
					<!-- -----------------Clien tSubscription Description------------------------------->
					<div class="form-group" id="clientSubscriptionTypeDesc-Error">
						<label><spring:message code="label.clientSubscriptionDescription"/></label> 
						<textarea class="form-control" rows="3" name="ClientSubscriptionTypeDescription" id="clientSubscriptionDescription" maxlength="100" placeholder="Client Subscription Description"></textarea>
					</div>
					
					<!-- -----------------Client Subscription Max Users ------------------------------->
					<div class="form-group" id="ClientSubscriptionType-Error">
						<label><spring:message code="label.clientSubscriptionUsers"/></label> 
						<input	type="text" class="form-control" id="clientSubscriptionUsers" name="clientSubscriptionTypeUsers" placeholder="ClientSubscription Users" maxlength="50"> 
					</div>
					
						<!-- ----------------Client Subscription Discouunt ------------------------------->
					<div class="form-group" id="ClientSubscriptionType-Error">
						<label><spring:message code="label.clientSubscriptionDiscouunt"/></label> 
						<input	type="text" class="form-control" id="clientSubscriptiondiscountFee" name="clientSubscriptionTypeDiscouunt" placeholder="ClientSubscription Discouunt" maxlength="50"> 
					</div>
					
					<!-- ----------------Client Subscription TOTAL SUBSCRIPTION FEE ------------------------------->
					<div class="form-group" id="ClientSubscriptionType-Error" hidden="true">
						<label><spring:message code="label.clientSubscriptionTotalFee"/></label> 
						<input	type="text" class="form-control" id="clientSubscriptionTotalFee" name="clientSubscriptionTypeDiscouunt" placeholder="ClientSubscription Discouunt" maxlength="50" hidden="true"> 
					</div>
					
					
					
				<!--------------------- Button --------------------------------------------->
		<button type="submit" class="btn btn-primary" id="addRoleForm" style="margin-left: -14px;"><spring:message code="label.save"/></button>	
				<%--  <button type="submit" class="btn btn-primary" id="saveClientSubscriptionType" onclick="PopUp()"><spring:message code="label.next"/></button>  --%>
          <%--   <button type="submit" class="btn btn-primary" id="next"  onclick="assignFeatureClientRoles()"><spring:message code="label.next"/></button> --%>
            <%-- <button type="submit"  id="addRoleFormClient"  style="margin-left: -14px;"><spring:message code="label.next"/></button> --%>
            
        <%--    <button type="submit" class="btn btn-primary" id="nextRoleFeatureButton" style="margin-left: -14px;"><spring:message code="label.next"/></button>--%>
				
				</form>
				<!----------------------------- test ---------------------------------------------------->
	 <div class="modal fade" id="clientSubscritionFeatureMapping"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editPlaceOfInterestLabel">RoleFeature</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;" id="industryTypesBody">
					</div>
			</div>
		</div>
	</div> 
			
			</div>
			<!-- --------------------List All ClientSubscription------------------------------------------ -->
			<div class="tab-pane" id="listAllClientSubscription">
			</div>
		</div>
	</div>
	<div id="editClientSubscriptionDiv"></div>
	
	<!-- ------------------Add Role Feature Div------------------------------------------------- -->
	<div id="addFeaturesDiv"></div>
	<!-- ------------------Edit Role Feature Div------------------------------------------------- -->
	<div id="editRoleFeatureDiv"></div>
	<!-- ------------------Show Role Feature Div------------------------------------------------- -->
	<div id="showRoleFeatureDiv"></div>
	<!-- ------------------Map Feature Div------------------------------------------------- -->
	<div id="mapRoleFeatureDiv"></div>
	
	</body>
<%@include file="includeJsFiles.jsp"%>
 <!--  <script src="../resources/js/clientSubscriptionRole.js"></script>   -->
   <script src="../resources/js/clientSubscription.js"></script>   
 </html>