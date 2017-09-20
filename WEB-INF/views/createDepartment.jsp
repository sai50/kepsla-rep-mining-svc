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
<title><spring:message code="label.ghn" /></title>
<%@include file="includeCssFiles.jsp"%>

</head>
<body onload="getChangeDepartment()">
<script src="../resources/js/addDepartment.js"></script>
	<div id="loadMaskDiv"
		class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

		<div class="container">

			<div id="createNewDepartment">
				<div class="alert alert-success" style="display: none;"
					id="successCreateDepartment">
					<strong>Updated Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"
					id="errorDepartment">
					<strong>Errors Occured.</strong>
				</div>
				<form role="form" id="createDeaprtment">

					<div>
						<h3>
							Organizational Grouping<font style="color: red">*</font>
						</h3>
						<hr>
						<div class="form-group" id="Group-Error">
							<label><spring:message code="label.OrgGroup" /></label> <select
								id="group" name="Group" class="form-control" disabled="disabled">
								<option>${orgGrpName}</option>
							</select>

						</div>
						<div class="form-group" id="Group-Error">
							<label><spring:message code="label.OrgBrand" /></label> <select
								id="brand" name="Brand" class="form-control" disabled="disabled">
								<option>${brands}</option>
							</select>

						</div>
						<div class="form-group" id="Group-Error">
							<label><spring:message code="label.OrganizationName" /></label>
							<select id="groupName" name="GroupName" class="form-control"
								disabled="disabled">
								<option>${orgName}</option>
							</select>

						</div>
						<div hidden="orgTyp1" class="form-group" id="Group-Error">
							<label>Organization Type</label>
							<select id="orgTyp1" name="OrgTyp1" class="form-control"
								disabled="disabled">
								<option>${orgType}</option>
							</select>
						</div>

						<hr>
						<div>
							<h3>Department type and Name</h3>
							<div class="form-group" id="Country-Error">
								<label>Department Type</label> 
								<div id="getDeptList"></div>
							</div>

							<div class="form-group" id="DeptName-Error">
								<label>Department Name</label> <span style="color: #a94442"
									class="help-inline"></span> <input type="text"
									class="form-control" id="departmentName"
									placeholder="Enter Department Name" maxlength="50">
							</div>

						</div>

					<!-- 	<div>
							<h3>Department Attribute Values</h3>
							<a href="tOaDitaTTriBut">Click here to edit attribute</a>
							<div class="form-group" id="RootCat-Error">
								<label>Room Category</label> <span style="color: #a94442"
									class="help-inline"></span> <input type="text"
									class="form-control" id="roomCat" placeholder="Enter room category"
									maxlength="50">
							</div>
							<div class="form-group" id="RoomLoc-Error">
								<label>Room Location</label> <span style="color: #a94442"
									class="help-inline"></span> <input type="text"
									class="form-control" id="roomLoc" placeholder="Enter room location"
									maxlength="50">
							</div>
							<div class="form-group" id="Theme-Error">
								<label>Theme</label> <span style="color: #a94442"
									class="help-inline"></span> <input type="text"
									class="form-control" id="theme" placeholder="Enter theme"
									maxlength="50">
							</div>
						</div> -->

						<hr>

						<div>
							<h3>Select Associated KPI</h3>
							<a href="gOtOkPI">Click here to go to KPI Master</a> <br>
							<div class="form-group">
								<div class="">
									<select name="selectfrom" id="select" multiple size="5"
										style="width: 300px; float: left;">
										<c:forEach var="kpiGM" items="${kpiGMDtos}">
											<option value="${kpiGM.id}">${kpiGM.kpiName}</option>
										</c:forEach>
									</select> <a href="JavaScript:void(0);" id="btn-add1">Add &raquo;</a> <a
										href="JavaScript:void(0);" id="btn-remove1">&laquo; Remove</a>
									<select name="selectto" id="selectedList" multiple size="5"
										style="width: 300px; float: right;">
									</select>
								</div>
							</div>
						</div>
					</div>
					<br> <br> <br> <br>
					<div align="center">
						<button type="submit" class="btn btn-default"
							id="createDepatmentSubmit" style="" onclick="save(event)">Save</button>
					</div>
				</form>

			</div>

		</div>


	</div>


</body>
<script type="text/javascript">

function getChangeDepartment() {
	var organizationType =document.getElementById("orgTyp1").value;
	$
			.ajax({
				url : "../Organization/getDeptTypByOrgTypId.htm?orgTyp="
						+ organizationType + "",
				type : 'POST',
				success : function(response) {
					var list = response.successObject.listOfDept;
					console.log(list);
					if (list.length < 0 || list == 'null') {
						var html = "Departmetn type is not available for selected Organization Type";
					} else {
						var html = "";
						html += "<select id='deptType' name='deptType' class='form-control'>"
								+ "<option>Please select department type</option>";
						html += "<option onclick=''>+Add New Department Type+</option>";
						for (var i = 0; i < list.length; i++) {
							html += "<option value='"+list[i].departmentType+"'>"
									+ list[i].departmentType + "</option>";
						}
						html += "</select>";
					}
					$("#getDeptList").append(html);
				}
			});
}

	$(document).ready(
			function() {
				
				$('#btn-add1').click(
						function() {
							$('#select option:selected').each(
									function() {
										$('#selectedList').append(
												"<option value='"
														+ $(this).val() + "'>"
														+ $(this).text()
														+ "</option>");
										$(this).remove();
									});
						});
				$('#btn-remove1').click(
						function() {
							$('#selectedList option:selected').each(
									function() {
										$('#select').append(
												"<option value='"
														+ $(this).val() + "'>"
														+ $(this).text()
														+ "</option>");
										$(this).remove();
									});
						});
			});
	
</script>
</html>
