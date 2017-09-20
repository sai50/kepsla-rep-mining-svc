<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title><spring:message code="label.kpi.master" /></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
 <div id="wrapper">
<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <c:choose>
				  <c:when test="${logoImageUrl == ''}">
				  </c:when>
				  <c:otherwise>
				   <a style="padding: 5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
            </div>
			<%@include file="leftNavigation.jsp" %>
 </nav>
 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
<div id="page-wrapper">
	<div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">KPI Master</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
             <!-- Nav tabs -->
            	<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
					<li class="active"><a href="#listGeneralKpiTab" data-toggle="tab" onclick="listGeneralKpiTab()"><spring:message code="label.generalKpi"/></a>
					</li>
					<li><a href="#listIndustryKpiTab" data-toggle="tab" onclick="listIndustryKpiTab()"><spring:message code="label.industryKpi"/></a>
					</li>
					<li><a href="#exportKpiTab" data-toggle="tab" onclick="exportKpi()"><span class="glyphicon glyphicon-export" aria-hidden="true"></span></a></li>
					<li><a href="#uploadKpiTab" data-toggle="tab" onclick="uploadKpi()"><span class="glyphicon glyphicon-import" aria-hidden="true"></span></a></li>
					<!-- <li><a href="#exportKpiTab" data-toggle="tab" onclick="exportKpi()">Download</a>
					</li>
					<li><a href="#uploadKpiTab" data-toggle="tab" onclick="uploadKpi()">Upload</a>
					</li> -->
				</ul>
		<div id="kpiTab" class="tab-content">
		<div class="tab-pane active" id="generalKpiTabDiv">
			<form id="generalKpiTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			<div class="form-group float-right"><!-- New CHange -->
				<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteGeneralKpi()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 			<a id="addGenerealKpiButton" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
				</div>			
			</form>
		</div>
		
		<div id="industryKpiTabDiv">
			<form id="industryKpiTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity" style="display: none;">
			<div class="form-group float-right">New CHange
				<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteIndustryKpi(listIndustryKpiForm)"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>
	 			<a onclick="addIndustryKpiButton()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
			</div>	
			</form>
		</div>	
			<!-- --------------------Add General KPI Success Div----------------------------------------- -->
			<div class="alert alert-success" id="addGeneralKpiSuccessDiv" style="display: none;">
				<spring:message code="label.add.kpi.success"/>
			</div>
			<!-- --------------------Add Industry KPI Success Div----------------------------------------- -->
			<div class="alert alert-success" id="addIndustryKpiSuccessDiv" style="display: none;">
				<spring:message code="label.add.kpi.success"/>
			</div>
			<!-- --------------------Edit General KPI Success Div----------------------------------------- -->
			<div class="alert alert-success" id="editIndustryKpiSuccessDiv" style="display: none;">
				<spring:message code="label.edit.kpi.success"/>
			</div>
			<!-- --------------------General KPI----------------------------------------- -->
			<div class="tab-pane active" id="listGeneralKpiTab">
				<form role="form" id="listGeneralKpiForm">
					<table class='table table-striped dataTable no-footer' id='listGeneralKpiTable'>
						<thead>
							<tr>
								<th><input type="checkbox" id="checkAllGeneralKpiCheckBox" style="margin-left: 0px;"></th>
								<th><spring:message code="label.kpi"/></th>
								<!-- <th><span style="float: right;"><a href="#" id="deleteAllGeneralKpiButton"><img alt="" src="../resources/images/delete-icon.png"></a></span></th> -->
							</tr>
						</thead>
						<tbody>
							<c:forEach items="${listKpiGeneralMaster}" var="generalKpi">
								<tr>
									<td><input type="checkbox" value="${generalKpi.id}" class="generalKpiCheckBox"></td>
									<td>${generalKpi.kpiName}</td>
<!-- 									<td><span style="float: right;"><a href="#"><img alt="" src="../resources/images/delete-icon.png"></a></span></td>
 -->								</tr>
							</c:forEach>
						</tbody>
					</table>
				</form>
			</div>
			<!-- --------------------Add/Edit KPI Div------------------------------------------ -->
			<div id="addAndEditGeneralKpiDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;">
			</div>
			<!-- --------------------Industry KPI Tab------------------------------------------ -->
			<div id="listIndustryKpiDivId"></div>
			<div class="tab-pane" id="listIndustryKpiTab">
			</div>
			<div id="addAndEditIndustryKpiDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;">
			</div>
			<!-- --------------------Upload File Tab------------------------------------------ -->
			<div class="tab-pane " id="uploadKpiTab">
			</div>
			<!-- --------------------Download File Tab------------------------------------------ -->
			<div class="tab-pane" id="exportKpiTab">
			</div>
		</div>
		</div><!-- -Tab Pane -->
			<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	 </div><!-- row -->
 </div><!-- page-wrapper -->
</div><!-- Wrapper -->
</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">
	$(document).ready(function(){
		$('#listGeneralKpiTable').dataTable();
	});

</script>
<script src="../resources/js/kpiMaster.js"></script>
</html>