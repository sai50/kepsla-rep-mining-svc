<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<meta name="_csrf" content="${_csrf.token}" />
<!-- default header name is X-CSRF-TOKEN -->
<meta name="_csrf_header" content="${_csrf.headerName}" />
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
<link rel="shortcut icon" href="../resources/images/greensmiley.ico"
	type="image/x-icon">
<title>Organization Uploads</title>

<%@include file="includeCssFiles.jsp"%>
<style type="text/css">
.foo {
	padding-right: 20px;
	background-color: #3CBC8D;
	color: white;
}
</style>
</head>
<body>
	<div id="wrapper">
		<%@include file="adminDashboard.jsp"%>
		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
					<h1 class="page-header">Bulk Excel Upload</h1>
				</div>
			</div>

			<form:form id="frmRight1" modelAttribute="fileBean"
				class="form-inline col-xs-12 SubHeading AdminMainActivity"
				action="../organizationGroup/bulkExcelUpload.htm?${_csrf.parameterName}=${_csrf.token}"
				method="post" enctype="multipart/form-data">
				<input type="hidden" name="${_csrf.parameterName}"value="${_csrf.token}" />
				<input type="hidden" id="csrfKey" value="${_csrf.parameterName}" />
				<input type="hidden" id="csrfValue" value="${_csrf.token}" />
				<input type="hidden" id='industryTypeId' name="industryType" value="$('#selectedIndustryType').val()" />
				<input type="hidden" id='segmentTypeId' name="segmentCategory" value="$('#selectedSegmentCategory').val()" />
				<input type="hidden" id='organizationTypeId' name="organizationType" value="$('#selectedOrganization').val()" />
				<div id="mandatory" style=""></div>
				<div id="listOfIndustryTypes"></div>
				<form:input path="fileData" name="excelFile" type="file" />
				<input id="submitBtn" type="submit" name="Upload" value="Upload" />
				<!--  onclick="disableIt()"  -->
			</form:form>
	 		<c:if test="${ result  eq 'failed'}">
				<h3><font size="5" color="red">Excel upload failed , please <a href="javascript:downloadExcel();"><font size="6" color="blue">download</font></a> excel for errors. </font></h3>
    		</c:if>
    		<c:if test="${ result  eq 'success'}">
        		<h3><font size="5" color="green">Excel uploaded successfully.</font></h3>
    		</c:if>
    		<c:if test="${ result  eq 'invalidFile'}">
	    		<h3><font size="5" color="red">Error !! Received file does not have a standard excel extension.</font></h3>
    		</c:if>
    		<c:if test="${ result  eq 'invalidTemplate'}">
		    	<h3><font size="5" color="red">Error !! Invalid template format.</font></h3>
    		</c:if>
    		<c:if test="${ result  eq 'customError'}">
			   <h3><font size="5" color="red">${errorMessage}</font></h3>
    		</c:if>
    		
		</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/industryTypeMaster.js">	
</script>
<script>
	$(document).ready(function industryType() {
		                $('#page-wrapper').mask('Loading...');
		                $("#addOrganizationDropDown").html('');
		                $("#dataTabOrg").html('');
						$("#listOfIndustryTypes").html('');
						$("#listOfIndustryTypes").empty();
						         $.ajax({
									type : "GET",
									url : "../industryTypeMaster/list.htm",
									dataType : "json",
									success : function(data) {
										console.log(data);
										var html = "";
										html +='<div class="tab-pane fade in active" id="drops">';
										html += '<form  class="form-inline col-xs-12 SubHeading AdminMainActivity">';
										html+='<font style="color: red">*</font>';
										html += '<label class="control-label" for="Industry">Industry Type<select id="selectedIndustryType" class="form-control input-sm"  onchange="getSegmentCategoriese()" style="width: 200px; float: right; margin-right: 10px; margin-top: -4px;">';
										html += '<option  value="0">--- SELECT ---</option>';
										for (var i = 0; i < data.length; i++) {
											html += '<option value='+data[i].id+'>'
													+ data[i].industryType
													+ '</option>';
										}
										html += '</select>';
										html += '</label>';
										html+='<font style="color: red">*</font>';
										html += '<label id="drop" class="control-label" for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategory" style="width: 200px; float: right; margin-right: 10px; margin-top: -4px;">';
										html += '<option value="0">--- SELECT ---</option>';
										html += '</select>';
										html += '</label>';
										html+='<font style="color: red">*</font>';
										html+=	'<label id="dropOrganization" for="OrganizationCategory">Organization Type<select class="form-control input-sm" id="selectedOrganization" style="width: 200px; float: right; margin-right: 10px; margin-top: -4px;">';
										html+=	'<option value="0">--- SELECT ---</option>';
										html+='</select>';
										html+='</label>';
										html += '</div>';
										html += '</form>';
																
										$("#drop").append(html);
										$("#drop").show();
										$("#listOfIndustryTypes").append(html);
										$("#listOfIndustryTypes").show();
										 $('#page-wrapper').unmask('Loading...');
									}								
								});
					});
</script>
<script>

	function downloadExcel() {
		redirectView("../organizationGroup/downloadBulkOrgExcel.htm");
	}
	function disableSubmit(){
		$('input[type="submit"]').prop('disabled', true);
		$('input[type="submit"]').css('background-color', '#d9533d');
		$('input[type="submit"]').css('color', '#FFFFFF');	
	}
	
	$("#submitBtn")
			.click(
					function(event) {
						$('input[type="submit"]').css('background-color','#a5c756');
						$('input[type="submit"]').css('color', '#FFFFFF');
						var industryId = $('#selectedIndustryType').val();
						var segmentTypeId = $('#selectedSegmentCategory').val();
						var organizationTypeId = $('#selectedOrganization').val();
						var industryIds = document.getElementById('industryTypeId').value = $('#selectedIndustryType').val();
						document.getElementById('segmentTypeId').value = $('#selectedSegmentCategory').val();
						document.getElementById('organizationTypeId').value = $('#selectedOrganization').val();
						if (industryId > 0 & segmentTypeId > 0 & organizationTypeId > 0) {
							if ($('input[type=file]').val() == '') {
								var errName = $("#mandatory"); //Element selector
								errName.html("Please Select File!!"); // Put the message content inside div
								errName.addClass('alert alert-danger alert-error');
								errName.css('color', '#DC143C');
								errName.css('font-size', '16px');
								event.preventDefault();
								return false;
							}
							var elem = document.getElementById("mandatory");
							var errName = $("#mandatory"); //Element selector
							errName.html("<b>Excel File Upload In Progress...</b>"); // Put the message content inside div
							errName.addClass('alert alert-danger alert-error');
							errName.css('color', 'Green');
							errName.css('font-size', '16px');
							//$('#mandatory').hide();
							$('input[type="submit"]').css('background-color','#a5c756');
							$('input[type="submit"]').css('color', '#FFFFFF');
							return true;
						} else {
							var errName = $("#mandatory"); //Element selector
							errName.html("Please Select Industry type , Segment catogery and Organization Type!!"); // Put the message content inside div
							errName.addClass('alert alert-danger alert-error');
							errName.css('color', '#DC143C');
							errName.css('font-size', '16px');
							$('#page-wrapper').unmask('Loading...');
							$('input[type="submit"]').prop('disabled', false);
							$('input[type="submit"]').css('background-color','#d9533d');
							$('input[type="submit"]').css('color', '#FFFFFF');
							event.preventDefault();
							return false;
						}
					});

	$(document).ready(function() {
		$('#frmRight1').submit(function() {
			  $(this).find("input[type='submit']").prop('disabled',true);
			});
		//$('input[type="submit"]').prop('disabled', false);
		$('input[type="submit"]').css('background-color', '#d9533d');
		$('input[type="submit"]').css('color', '#FFFFFF');
	});
</script>
</html>

























<!-- 

function disableIt(){
	document.forms["frmRight1"].submit();
	$('input[type="submit"]').prop('disabled', true);
	$('input[type="submit"]').css('background-color','#d9533d');
	$('input[type="submit"]').css('color','#FFFFFF'); 
}
function enableIt(){
}
$('input[type="file"]').change(function(){
	 $('input[type="submit"]').css('background-color','#a5c756');
	 $('input[type="submit"]').css('color','#FFFFFF');
     $('input[type="submit"]').removeAttr('disabled');
     var industryId=$('#selectedIndustryType').val();
     var segmentTypeId=$('#selectedSegmentCategory').val();
 	if(industryId>0 | segmentTypeId>0 ){
 		 $('input[type="submit"]').css('background-color','#a5c756');
 		 $('input[type="submit"]').css('color','#FFFFFF');
 	     $('input[type="submit"]').removeAttr('disabled');
 		return;
 	}else{
 		//document.getElementById('mandatory').innerHTML="* Please Select Industry type and Segment catogery !*";
 		/* var elem = document.getElementById("mandatory");
 		elem.innerHTML = "* Please Select Industry type and Segment catogery !*";
 		elem.style.color = "Red";
 		elem.style.fontSize = "large"; */
 		//alert("Please Select Industry type and Segment categery !");
 		//	document.forms["frmRight1"].submit();
 		$('input[type="submit"]').prop('disabled', false);
 		$('input[type="submit"]').css('background-color','#d9533d');
 		$('input[type="submit"]').css('color','#FFFFFF');
 	     return
 	}
});

$( document ).ready(function() {
	$('input[type="submit"]').prop('disabled', false);
	$('input[type="submit"]').css('background-color','#d9533d');
	$('input[type="submit"]').css('color','#FFFFFF');
}); 
 		/* var elem = document.getElementById("mandatory");
 			elem.innerHTML = "<b>* Please Select Industry type , Segment catogery and Organization Type !*</b>";
 			elem.style.color = "Red";
 			elem.style.fontSize = "large";  *//* 	elem.innerHTML = " <b>Excel File Upload In Progress...<b>";
	 		elem.style.color = "Green";
	 		elem.style.fontSize = "large";  */-->
