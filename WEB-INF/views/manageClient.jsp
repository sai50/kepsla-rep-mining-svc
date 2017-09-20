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

	<div class="container">
		
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addClient" data-toggle="tab" onclick="addClient();">Create Client</a>
			</li>
			<li id="list"><a href="#listOfClient" data-toggle="tab" onclick="listOfClient()">List Of Clients</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<div class="tab-pane active" id="newClient">
			
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successClientDiv">
					<strong>Client Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="errorClientDiv">
					<strong>Errors Occured.</strong>
				</div>
				<form role="form" id="addClientForm">
					<div class="form-group" id="Client-Error">
						<label><spring:message code="label.ClientOrganizationName"/></label> 
						<div id="organizationList"></div>
					</div>
					<div class="form-group" id="AccountManager-Error">
						<label><spring:message code="label.AccountManager"/></label> 
						<div id="accountManager"></div>
					</div>
					<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-default" id="saveClient">Submit</button>
				</form>
			</div>
			<!-- --------------------List All Industry Types------------------------------------------ -->
			<div class="tab-pane" id="listOfClients">
			</div>
		</div>
</div>	
</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script>
function listOfOrganization(){
	$.ajax({
		url:'../ManageOrganization/list.htm',	
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
		 var html="";
		 html+="<select id='organizationId' class='form-control'>";
		 for(var i=0;i<data.length;i++){
			 html+="<option value='"+data[i].organizationFullName+"'>"+data[i].organizationFullName+"</option>";
		 }
		html+="</select> "; 
		$("#organizationList").append(html);
	    },error:function(data){
	    	console.log(data);
	    }
	    });	
}

</script>
</html>