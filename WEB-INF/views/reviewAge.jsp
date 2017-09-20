<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
 <title><spring:message code="label.formula.configration" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<div id="wrapper">
<%@include file="adminDashboard.jsp" %>
<div id="page-wrapper">
<div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">Review Configuration</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
			<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
				<li class="active"><a href="#reviewAgeTab" data-toggle="tab" onclick="reviewAgeListTab()"><spring:message code="label.reviewAge"/></a></li>
				<li><a href="#organizationVolumeTab" data-toggle="tab" onclick="organizationVolumeList()"><spring:message code="label.organizationVolume"/></a></li>
				<li><a href="#sourcePopularityTab" data-toggle="tab" onclick="sourcePopularityList()"><spring:message code="label.sourcePopularity"/></a></li>
				<li><a href="#sourceVolumeTab" data-toggle="tab" onclick="sourceVolumeList()"><spring:message code="label.sourceVolume"/></a></li>
				<li><a href="#languageVolumeTab" data-toggle="tab" onclick="languageVolumeList()"><spring:message code="label.languageVolume"/></a></li>
				<li><a href="#sentimentPolarityTab" data-toggle="tab" onclick="sentimentPolarityList()"><spring:message code="label.sentimentPolarity"/></a></li>
				<li><a href="#reputationFactorIndicatorTab" data-toggle="tab" onclick="reputationFactorIndicatorList()"><spring:message code="label.reputactionFactorIndicator"/></a></li>
				<li><a href="#sourceFactorIndicatorTab" data-toggle="tab" onclick="sourceFactorIndicatorList()"><spring:message code="label.sourceFactorIndicator"/></a></li>
				<li><a href="#keyPerformanceFactorIndicatorTab" data-toggle="tab" onclick="keyPerformanceIndicatorList()"><spring:message code="label.keyPerformanceIndicator"/></a></li>
				<li><a href="#languageFactorIndicatorTab" data-toggle="tab" onclick="languageFactorIndicatorList()"><spring:message code="label.languageFactorIndicator"/></a></li>
				<li><a href="#departmentPerformanceFactorIndicatorTab" data-toggle="tab" onclick="deptPerformanceIndicatorList()"><spring:message code="label.deptPerformanceIndicator"/></a></li>
				<li><a href="#individualReviewScoreIndicatorTab" data-toggle="tab" onclick="individualReviewScoreList()"><spring:message code="label.individualReviewScore"/></a></li>
				
			</ul>
		<div id="formulaTab" class="tab-content">
			<!-- --------------------Review Age----------------------------------------- -->
			<div class="tab-pane active" id="reviewAgeTab">
			<div>
				<form id="reviewAgeTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
					<div class="form-group float-right"><!-- New CHange -->
						<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteReviewAge()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
							<a onclick="addReviewAge()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
					 </div>
				</form>
				</div>
				<!-- --------------------Add Review Age Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="addReviewAgeSuccessDiv">
					<spring:message code="label.addReviewAge.success"/>
				</div>
				<!-- --------------------Edit Review Age Success Div----------------------------------------- -->
				<div class="alert alert-success" style="display: none;" id="editReviewAgeSuccessDiv">
					<spring:message code="label.updateReviewAge.success"/>
				</div>
				
				<div id="reviewAgeDataDiv">
					<form id="reviewAgeListForm">
						<div class="alert alert-success" style="display: none;"	id="deleteReviewAgeSuccessDiv">
							<spring:message code="label.deleteCountry.success"/>
						</div>
						<div class="alert alert-danger alert-error" style="display: none;"	id="deleteReviewAgeErrorDiv">
						</div>
						<table class='table table-striped dataTable no-footer' id='reviewAgeListTable'>
							<thead>
								<tr>
									<th><input type="checkbox" id="checkAllReviewAgeCheckBox" style="margin-left: 0px;"></th>
									<th><spring:message code="label.configuration.name"/></th>
									<th><spring:message code="label.minPercentage"/></th>
									<th><spring:message code="label.maxPercentage"/></th>
									<th><spring:message code="label.configuration.value"/></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<c:forEach items="${reviewAgeList}" var="reviewAge">
									<tr>
										<td><input type="checkbox" value="${reviewAge.id}" class="reviewAgeCheckBox"></td>
										<td>${reviewAge.reviewName}</td>
										<td>${reviewAge.minPercentage}</td>
										<td>${reviewAge.maxPercentage}</td>
										<td>${reviewAge.reviewValue}</td>
										<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editReviewAgeForm(${reviewAge.id})"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</form>
					<div id="addAndEditReviewAgeDiv" class="SubHeading addAdminForm col-xs-12" style="display:none;"></div>
				</div>
			</div>
			<!-- --------------------Organization Volume Tab------------------------------------------ -->
			<div class="tab-pane" id="organizationVolumeTab">
			</div>
			<!-- --------------------Source Popularity Tab------------------------------------------ -->
			<div class="tab-pane " id="sourcePopularityTab">
			</div>
			<!-- --------------------Source Volume Tab------------------------------------------ -->
			<div class="tab-pane " id="sourceVolumeTab">
			</div>
			<!-- --------------------Language Volume Tab------------------------------------------ -->
			<div class="tab-pane" id="languageVolumeTab">
			</div>
			<!-- --------------------Sentiment Polarity Tab------------------------------------------ -->
			<div class="tab-pane" id="sentimentPolarityTab">
			</div>
			<!-- --------------------Reputaction Factor Indicator Tab------------------------------------------ -->
			<div class="tab-pane" id="reputationFactorIndicatorTab">
			</div>
			<!-- --------------------Source Factor Indicator Tab------------------------------------------ -->
			<div class="tab-pane" id="sourceFactorIndicatorTab">
			</div>
			<!-- --------------------Key Performance Indicator Tab------------------------------------------ -->
			<div class="tab-pane" id="keyPerformanceFactorIndicatorTab">
			</div>
			<!-- --------------------Language Factor Indicator Tab------------------------------------------ -->
			<div class="tab-pane" id="languageFactorIndicatorTab">
			</div>
			<!-- --------------------Dept Performance Indicator Tab------------------------------------------ -->
			<div class="tab-pane" id="departmentPerformanceFactorIndicatorTab">
			</div>
			<!-- --------------------Individual Review Scorce Indicator Tab------------------------------------------ -->
			<div class="tab-pane form-inline col-xs-12 SubHeading AdminMainActivity" id="individualReviewScoreIndicatorTab" style="padding-bottom:10px">
			</div>
		
			
		</div>
			<a href="#" onclick="scrollDown($('#page-wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	</div>
	</div>
	</div>
	<script src="../resources/js/reviewAge.js"></script>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	$(document).ready(function(){
		$('#reviewAgeListTable').dataTable();
	});
</script>

</html>