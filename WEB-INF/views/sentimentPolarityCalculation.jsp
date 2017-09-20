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
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
<title><spring:message code="label.ghn"/></title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
		<div id="kpiTab" class="tab-content">
		<br>
			<hr>
			<!-- --------------------General KPI----------------------------------------- -->
			<div class="tab-pane active" id="listGeneralKpiTab">
				<hr>
				<form role="form" id="listGeneralKpiForm">
					<table class='table table-striped table-bordered' id='listGeneralKpiTable'>
						<thead>
							<tr>
								<th>Value</th>
								<th>Polarity</th>
							</tr>
						</thead>
						<tbody>
						<c:forEach items="${list}" var="entry">
							<tr>
							<td>${entry.value}</td>
							<td>${entry.polarity}</td>
						</c:forEach>
						</tbody>
					</table>
				</form>
			</div>
			
		</div>
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