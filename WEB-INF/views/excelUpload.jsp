<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<meta name="_csrf" content="${_csrf.token}"/>
<!-- default header name is X-CSRF-TOKEN -->
<meta name="_csrf_header" content="${_csrf.headerName}"/>
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <title>Organization Uploads</title>
<%@include file="includeCssFiles.jsp"%>
</head>
<body>
	<div id="wrapper">
	<%@include file="adminDashboard.jsp" %>
		<div id="page-wrapper">
			<div class="row">
				<div class="col-lg-12">
		            <h1 class="page-header">Excel Upload</h1>
		        </div>
			</div>
		 	<form:form id="frmRight1" modelAttribute="fileBean" action="../organizationGroup/excelUpload.htm?${_csrf.parameterName}=${_csrf.token}" method="post" enctype="multipart/form-data"> 
		 		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
		 		<input type="hidden" id="csrfKey" value="${_csrf.parameterName}"/>
		 		<input type="hidden" id="csrfValue" value="${_csrf.token}"/>
	         	<form:label id="selectFileId" onclick="enableIt()" for="fileData" path="fileData">Select file</form:label><br/><br/>
	        	<form:input path="fileData" name="excelFile" type="file"/> 
	        	<input id="submitBtn" onclick="disableIt()" type="submit" name="Upload" value="Upload"/>
    		</form:form>
    		<c:if test="${ result  eq 'failed'}">
				<h3><font size="6" color="red">Excel upload failed , please <a href="javascript:downloadExcel();"><font size="6" color="blue">download</font></a> excel for errors. </font></h3>
    		</c:if>
    		<c:if test="${ result  eq 'success'}">
    		<h3><font size="6" color="green">Excel uploaded successfully.</font></h3>
    		</c:if>
    		<c:if test="${ result  eq 'invalidFile'}">
				<h3><font size="6" color="red">Error !! Received file does not have a standard excel extension.</font></h3>
    		</c:if>
    		<c:if test="${ result  eq 'invalidTemplate'}">
				<h3><font size="6" color="red">Error !! Invalid template format.</font></h3>
    		</c:if>
    		
		</div>
	</div>
	
</body>
<script>
function downloadExcel(){
	redirectView("../organizationGroup/downloadExcel.htm");
	
}
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
      
});

$( document ).ready(function() {
	$('input[type="submit"]').prop('disabled', true);
	$('input[type="submit"]').css('background-color','#d9533d');
	$('input[type="submit"]').css('color','#FFFFFF');
});
</script>
</html>