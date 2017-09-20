<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
 <title><spring:message code="label.source.factor" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#sourceMasterTab" data-toggle="tab" onclick="sourceMasterListTab()"><spring:message code="label.source"/></a></li>
			<li><a href="#sourceKpiMappingTab" data-toggle="tab" onclick="sourceKpiList()"><spring:message code="label.sourceKpiMapping"/></a></li>
		</ul>
		<div id="masterTab" class="tab-content">
		<hr>
			<!-- --------------------Source Master Tab----------------------------------------- -->
			<div class="tab-pane active" id="sourceMasterTab">
				<div id="sourceMasterTabButtons">
					<span style="float: left: "><a href="#" onclick="addSourceMaster()"><img alt="" title="Add" src="${pageContext.request.contextPath}/resources/images/add-icon.jpg"></a></span>&nbsp;
					<span style="float: left: "><a href="#" onclick="sourceMasterListTab()"><img alt=""  title="List" src="${pageContext.request.contextPath}/resources/images/list-icon.jpg"></a></span>&nbsp;
					<span style="float: left: "><a href="#" onclick="deleteSourceMaster()"><img alt="" title="Delete" src="${pageContext.request.contextPath}/resources/images/delete.jpg"></a></span>
				</div>
				<hr>
				
				<!-- --------------------Add Source Master Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="addSourceMasterSuccessDiv">
					<strong><spring:message code="label.addSource.success"/></strong>
				</div>
				<!-- --------------------Edit Source Master Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="editSourceMasterSuccessDiv">
					<strong><spring:message code="label.updateSource.success"/></strong>
				</div>
				
				<div id="sourceMasterDataDiv">
					<form id="sourceMasterListForm">
						<div class="alert alert-success" style="display: none;"	id="deleteSourceMasterSuccessDiv">
							<strong><spring:message code="label.deleteSource.success"/></strong>
						</div>
						<div class="alert alert-danger alert-error" style="display: none;"	id="deleteSourceMasterErrorDiv">
						</div>
						
						<table class='table table-striped table-bordered' id='sourceMasterListTable'>
							<thead>
								<tr>
									<th><input type="checkbox" id="checkAllSourceMasterCheckBox" style="margin-left: -7px;"></th>
									<th><spring:message code="label.source.name"/></th>
									<th><spring:message code="label.source.sourceBaseUrl"/></th>
									<th><spring:message code="label.source.sourceType"/></th>
									<th><spring:message code="label.source.sourcePopularity"/></th>
								</tr>
							</thead>
							<tbody>
								<c:forEach items="${sourceMasterList}" var="sourceMaster">
									<tr>
										<td><input type="checkbox" value="${sourceMaster.id}" class="sourceMasterCheckBox"></td>
										<td>${sourceMaster.sourceName}</td>
										<td>${sourceMaster.sourceBaseUrl}</td>
										<td>${sourceMaster.sourceType}</td>
										<td>${sourceMaster.sourcePopularity}<span style="float: right;"><a href="#" onclick="editSourceMaster(${sourceMaster.id})"><img src="../resources/images/edit-icon.jpg"></a></span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</form>
					<div id="addAndEditSourceMasterDiv"></div>
				</div>
			</div>
			<!-- --------------------SOURCE KPI MAPPING------------------------------------------ -->
			<div class="tab-pane" id="sourceKpiMappingTab">
			</div>
			
		</div>
	</div>
	
	<a href="#" onclick="scrollDown($('#loadMaskDiv'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	
	<div id="editIndustryKpiDiv"></div>
	<div id="editIndustryKpiSuccessDiv"></div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	$(document).ready(function(){
		$('#sourceMasterListTable').dataTable();
	});
</script>
<script src="${pageContext.request.contextPath}/resources/js/sourceMaster.js"></script>
<script src="../resources/js/util.js"></script>
</html>