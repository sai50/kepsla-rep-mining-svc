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
			<li id="list"><a href="#listOfClient" data-toggle="tab" onclick="listOfClients()">List Of Clients</a>
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
						<label><spring:message code="label.ClientOrganizationName"/>*</label> 
						<span style="color: #a94442" id="clientOrganizationName-Error" class="help-inline"></span>
						<div id="organizationList"></div>
					</div>
					<div class="form-group" id="startDate-Error">
						<label><spring:message code="label.StartTime"/>*</label> 
						<input type="date" id="startDate"/>
					</div>
					<div class="form-group" id="EndDate-Error">
						<label><spring:message code="label.EndTime"/>*</label> 
						<input type="date" id="endDate"/> 
					</div>
					<div class="form-group" id="AccountManager-Error">
						<label><spring:message code="label.AccountManager"/>*</label> 
						<span style="color: #a94442" id="accountManager-Error" class="help-inline"></span>
						<div id="accountManagerList"></div>
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
$(document).ready(function(){
	listOfOrganization();
	listOfAccountManager();
});

function addClient(){
	$('#addClientForm').trigger('reset');
	$("#listOfClients").hide();
	$('#addClientForm').show();
}
function listOfClients(){
	$('#addClientForm').hide();
	$("#listOfClients").empty();
	$.ajax({
		url:'../Client/clientList.htm',	
		type: 'GET',
	    success: function(data){ 
	    	var html="";
				html+=""
					+'<div class="container-fluid">'
					+'<div class="collapse navbar-collapse bs-example-js-navbar-collapse">'
					+' <ul class="nav navbar-nav">'
					+'   <li class="dropdown">'
					+'     <a id="drop1" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown">Dropdown <span class="caret"></span></a>'
					+'     <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">'
					+"		<li role='presentation'><a href='#' onclick='clientDetails(); return false;'>POS Mapping</a></li>"
			  		+"		<li role='presentation'><a href='#' onclick='clientDetails(); return false;'>Amenity Mapping</a></li>"
			  		+"		<li role='presentation'><a href='#' onclick='clientDetails(); return false;'>Place of Interest Data Mapping</a></li>"
			  		+"		<li role='presentation'><a href='#' onclick='clientDetails(); return false;'>Source Mapping</a></li>"
					+'    </ul>'
					+'  </li>'
					+'</ul>'
					+'</div>'
					+'</div>'
					+"<form class='form-horizontal'>"
					+ "<table class='table table-striped table-bordered' id='clientsTable'>"
					+ 		"<thead>"
					+ 			"<tr>"
					+				"<th> </th>"
					+				"<th>Organization Name</th>"
					+				"<th>Start Date</th>"
					+				"<th>End Date</th>"
					+			"</tr>"
					+ 		"</thead>"
					+			"<tbody>";
				for(var i=0;i<data.length;i++){
				html+=			"<tr>"
					+			"<td align='center'><input type='checkbox' class='clientsChkBox' value='"+data[i].organizationName+"'/></td>"	
					+			"<td>"+data[i].organizationName+"</td>"	
					+			"<td>"+moment(new Date(data[i].startDate)).format('YYYY-MM-DD HH:mm:ss')+"</td>"
					+			"<td>"+moment(new Date(data[i].expiryDate)).format('YYYY-MM-DD HH:mm:ss')+"</td>"
					+			"</tr>";
				}
				html+=	"</tbody>"
					+ "</table>"
					+"</form>";
		 $("#listOfClients").append(html);
		 $("#listOfClients").show();
		 $("#listTable").dataTable();
		 $('.dropdown-toggle').dropdown();
	    },error:function(data){
	    	console.log(data);
	    }
	    });	
}
function clientDetails(){

	if(orgName==""){
		alert("Select any one organization ");
	}else{
	window.location.href='../Client/clientDetails.htm?orgName='+orgName+'';
}
}
var orgName;
$('#saveClient').click(function(){
	 $('#successClientDiv').hide();
	 $('#errorClientDiv').hide();
	var organizationId = $.trim($('#organizationId').val());
	 var accountManagerId = $.trim($('#accountManagerId').val());
	 var expiryDate=$.trim($('#endDate').val());
	 var startDate=$.trim($('#startDate').val());
	var Client={'organizationId':organizationId,'accountManagerId':accountManagerId,'expiryDate':expiryDate,'startDate':startDate};
	console.log(Client);
	if(organizationId==""|| accountManagerId==""){
	alert("Please select the mandatory fields")	;
	}else{ 
		$.ajax({ 
	        url: "../Client/save.htm", 
	        type: 'POST', 
	        data: JSON.stringify(Client), 
	        contentType: 'application/json',
	        success: function(response) { 
	        	console.log(response);
			 $('#errorClientDiv').hide();
			 $('#successClientDiv').show(600);
			$('#addClientForm').trigger("reset");
			$('#-Error').removeClass('has-error has-feedback');
			$('#clientOrganizationName-Error').hide();
			 },
	 		error:function(jqXHR, textStatus, errorThrown) { 
	 			$('#clientOrganizationName-Error').show();
	 			console.log(jqXHR+" "+textStatus+" "+errorThrown);
	 			console.log("error: "+response);
   		 }
	 });
	}
	});


function listOfOrganization(){
	$.ajax({
		url:'../ManageOrganization/list.htm',	
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
		 var html="";
		 html+="<select id='organizationId' class='form-control'>";
		 for(var i=0;i<data.length;i++){
			 html+="<option value='"+data[i].id+"'>"+data[i].organizationFullName+"</option>";
		 }
		html+="</select> "; 
		$("#organizationList").append(html);
	    },error:function(data){
	    	console.log(data);
	    }
	    });	
}


function listOfAccountManager(){
	$.ajax({
		url:'../Client/accountManagerList.htm',	
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
		 var html="";
		 html+="<select id='accountManagerId' class='form-control'>";
		 for(var i=0;i<data.length;i++){
			 html+="<option value='"+data[i].id+"'>"+data[i].userName+"</option>";
		 }
		html+="</select> "; 
		$("#accountManagerList").append(html);
	    },error:function(data){
	    	console.log(data);
	    }
	    });	
}


$(document).on('click',".clientsChkBox",function(){
   // $('.clientsChkBox').prop('checked', $(this).is(':checked'));
 	orgName=$.trim($('.clientsChkBox:checked').val());
  });

$(document).on('click',".selectAllClientsChkBox",function(){
    if($('.clientsChkBox:checked').length == $('.poiChkBox').length) {
    	alert(" len "+$('.clientsChkBox:checked').length);
      $('.selectAllClientsChkBox').prop('checked', true);
    }
    else {
      $('.selectAllClientsChkBox').prop('checked', false);
    }
});
var selectedCheckBoxes=[];
function checkBoxLength(){
	if($('.clientsChkBox:checked').length<2) {
		alert("len"+$('.clientsChkBox:checked').length);
		selectedCheckBoxes =[];
        $('.clientsChkBox:checked').each(function() {
          selectedCheckBoxes.push($(this).val());
        });
      }
	return false;
}
</script>
</html>