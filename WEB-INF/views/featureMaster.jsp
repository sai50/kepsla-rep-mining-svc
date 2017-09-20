<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title><spring:message code="label.feature.master" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<div id="wrapper">
<%@include file="adminDashboard.jsp" %>
<div id="page-wrapper">
<div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">Feature Master</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#featureMasterTab" data-toggle="tab" onclick="featureMasterList()"><spring:message code="label.feature"/></a></li>
			<li><a href="#roleFeatureTab" data-toggle="tab" onclick="roleFeatureList()"><spring:message code="label.roleFeature"/></a></li>
			<li ><a href="#roleTab" data-toggle="tab" onclick="roleList()"><spring:message code="label.roles"/></a></li>
		</ul>
		<div id="featureTab" class="tab-content">
			<!-- --------------------Feature----------------------------------------- -->
			<div class="tab-pane active" id="featureMasterTab">
				<div>
					<%-- <span style="float: left: "><a href="#" onclick="addFeatureMaster()"><img alt="" src="${pageContext.request.contextPath}/resources/images/add-icon.jpg"></a></span>&nbsp;
					<span style="float: left: "><a href="#" onclick="featureMasterList()"><img alt="" src="${pageContext.request.contextPath}/resources/images/list-icon.jpg"></a></span>&nbsp;
					<span style="float: left: "><a href="#" onclick="deleteFeatureMaster()"><img alt="" src="${pageContext.request.contextPath}/resources/images/delete.jpg"></a></span> --%>
					<form id="FeatureMasterTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
						<div class="form-group float-right"><!-- New CHange -->
							<input type="button" class="btn btn-default" value="Enable Selected" onclick ="enableAll()">
							<input type="button" class="btn btn-default" value="Disable Selected" onclick ="disableAll()">
						 </div>
					</form>
				</div>
				<div id="featureMasterDataDiv">
					<form id="featureMasterListForm">
						<div class="alert alert-success" style="display: none;"	id="deleteFeatureMasterSuccessDiv">
							<strong><spring:message code="label.deleteFeature.success"/></strong>
						</div>
						<div class="alert alert-danger alert-error" style="display: none;"	id="deleteFeatureMasterErrorDiv">
						</div>
						<table class='table table-striped dataTable no-footer' id='featureMasterListTable'>
							<thead>
								<tr>
									<th><input type="checkbox" id="checkAllFeatureCheckBox" style="margin-left: -7px;"></th>
									<th><spring:message code="label.feature.feature"/></th>
									<th><spring:message code="label.feature.featureDescription"/></th>
									<th><spring:message code="label.feature.featureAssociatedUrl"/></th>
									<th><spring:message code="label.feature.status"/></th>
									<th><spring:message code="label.feature.price"/></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<c:forEach items="${featureMasterList}" var="feature">
									<tr>
										<td><input type="checkbox" value="${feature.id}" class="featureCheckBox"></td>
										<td>${feature.feature}</td>
										<td>${feature.featureDescription}</td>
										<td>${feature.featureAssociatedUrl}</td>
										<c:if test="${feature.status eq false}">
											<td>disabled</td>
										</c:if>
										<c:if test="${feature.status eq true}">
											<td>enabled</td>
										</c:if>
										<td>${feature.price}</td>
										<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editFeatureMasterForm(${feature.id})"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</form>
				</div>
			</div>
			<!-- --------------------Feature Role Tab------------------------------------------ -->
			<div class="tab-pane" id="roleFeatureTab">
			</div>
			
			<!-- --------------------Role Tab------------------------------------------ -->
			<div class="tab-pane" id="roleTab">
			</div>
		</div>
			<a href="#" onclick="scrollDown($('#page-wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	</div>
	</div>
	</div>
	<script src="../resources/js/featureMaster.js"></script>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	$(document).ready(function(){
		$('#featureMasterListTable').dataTable();
	});
</script>

</html>