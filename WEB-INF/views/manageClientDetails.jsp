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

<div class="collapse navbar-collapse bs-example-js-navbar-collapse">
					 <ul class="nav navbar-nav">
					   	<li class="dropdown">
					     <a id="drop1" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown">Dropdown <span class="caret"></span></a>
					    	 <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
								<li role='presentation'><a href='#' onclick="listOfClientPOSDataMapping(); return false;">POS Mapping</a></li>
			  					<li role='presentation'><a href='#' onclick="listOfClientAmenityMapping(); return false;">Amenity Mapping</a></li>
			  					<li role='presentation'><a href='#' onclick="listOfClientPOIDataMapping(); return false;">Place of Interest Data Mapping</a></li>
			  					<li role='presentation'><a href='#' onclick="listOfClientContentSourceMapping(); return false;">Source Mapping</a></li>
					   		 	<li role='presentation'><a href='#' onclick="listOfClientCompetitorMapping(); return false;">Client Competitor Mapping</a></li>
					   		 
					   		 </ul>
						 </li>
						</ul>
</div>
<div style="display:none" ><input id="organizationId" value="${organization.id}"/></div>
	<div id="clientPOIDataMapping">
	<div id="clientPOIDataMappingBody"></div>
	</div>
	<div id="clientEventMapping">
	<div id="clientEventMappingBody"></div>
	</div>
	<div id="clientSourceMapping">
	<div id="clientSourceMappingBody"></div>
	</div>
	<div id="clientCompetitorMapping" >
	<div id="clientCompetitorMappingBody"></div>
	</div>
	<div id="clientAmenityMapping" >
	<div id="clientAmenityMappingBody"></div>
	</div>
	<div id="clientPOSMapping" >
	<div id="clientPOSMappingBody"></div>
	</div>
	<div id="createOrganization" class="modal fade">
	<div class="modal-dialog" style="width:900px;">
	<div class="modal-content">
	<div class="modal-body" style="margin-left: 10px;" id="createOrganizationBody">
	</div>
	</div>
	</div>
	</div>	
</div>	
</body>
<%@include file="includeJsFiles.jsp"%>
<script>
$(document).ready(function(){
	listOfClientPOSDataMapping();
	$('.dropdown-toggle').dropdown();
});
function clearDivs(){
	 $("#clientAmenityMappingBody").empty();
	 $("#clientSourceMappingBody").empty();	
	 $("#clientAmenityMappingBody").empty();
	 $("#clientCompetitorMappingBody").empty();
	 $("#clientPOSMappingBody").empty();
	 $("#clientPOIDataMappingBody").empty();
}

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

function listOfClientAmenityMapping(){
	clearDivs();
	var orgId=$("#organizationId").val();
	 $("#clientAmenityMappingBody").empty();	
	$.ajax({
		url:'../Client/clientAmenitylist.htm?id='+orgId+'',		
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
		 var html="";
			html+="<hr>"
					+"<form class='form-horizontal'>"
					+"<div>"
					+"<input type='button' class='btn btn-danger' value='Cancel'/>&nbsp"
					+"<input type='button' class='btn btn-success'   onclick='editAmenityMapping()' value='Save Changes'/>"
					+"</div><br>"
					+ "<table class='table table-striped table-bordered' id='amenityTable'>"
					+ 		"<thead>"
					+ 			"<tr>"
					+				"<th style='width:60px;'><input type='checkbox' id='selectAllAmenityChkBox' style='margin-left:24px;'/></th>"
					+				"<th>Amenity Name</th>"
					+				"<th>Amenity Type</th>"
					+			"</tr>"
					+ 		"</thead>"
					+			"<tbody>";
				for(var i=0;i<data.length;i++){
				html+=			"<tr>"
					+			"<td align='center'><input type='checkbox' class='amenityChkBox' value='"+data[i].id+"'/></td>"	
					+			"<td id='amenityName"+data[i].amenityName+"'>"+data[i].amenityName+"</td>"	
					+			"<td id='amenityType"+data[i].amenityType+"'>"+data[i].amenityType+"</td>"
					+			"</tr>";
				}
				html+=	"</tbody>"
					+ "</table>"
					+"</form>";
		 $("#clientAmenityMappingBody").append(html);
		 $("#clientAmenityMapping").show();
		 $("#amenityTable").dataTable();
}
	});
}
//select all for client source mapping
$(document).on('click',"#selectAllAmenityChkBox",function(){
    $('.amenityChkBox').prop('checked', $(this).is(':checked'));
  });

$(document).on('click',".amenityChkBox",function(){
    if($('.amenityChkBox:checked').length == $('.amenityChkBox').length) {
      $('.selectAllAmenityChkBox').prop('checked', true);
    }
    else {
      $('.selectAllAmenityChkBox').prop('checked', false);
    }
});


var selectedAmenityMappingArray =[];

function amenityMappingArray(){
	if($('.amenityChkBox:checked').length) {
		selectedPOIDataMappings =[];
        $('.amenityChkBox:checked').each(function() {
        	var id=$(this).val();
        	console.log(id);
    	//	var id=data[i].id*1;
			var amenityName=$("#organizationId"+id).text().trim();
			var organizationId=$("#organizationId").val();
			var orgId=parseInt(organizationId);
			selectedAmenityMappingArray.push({organizationId:orgId,poiDataId:poiDataId});
        });
        console.log(selectedAmenityMappingArray);
      }
	editAmenityMapping();
	return false;
}

function editAmenityMapping(){
	var orgId=$("#organizationId").val();
	console.log(selectedSourceMappings);
	var client={clients:selectedAmenityMappingArray};
	$.ajax({
		url:'../Client/updateClientAmenityMapping.htm',		
		type: 'POST',
		data: JSON.stringify(client),
	    success: function(data){ 
		 console.log(data);
	    	},error: function(data){
	    		consle.log(data);	
	    	}
		});
}	
	
function listOfClientContentSourceMapping(){
	clearDivs();
	
	var orgId=$("#organizationId").val();	
	 $("#clientContentSourceMappingBody").empty();	
		$.ajax({
			url:'../Client/clientContentSourcelist.htm?id='+orgId+'',		
			type: 'GET',
		    success: function(data){ 
			 console.log(data);
			 var html="";
				html+="<hr>"
						+"<form class='form-horizontal'>"
						+"<div>"
						+"<input type='button' class='btn btn-danger'    value='Cancel'/> &nbsp"
						+"<input type='button' class='btn btn-success'   onclick='sourceMappingArray()' value='Save Changes'/>"
						+"</div><br>"
						+"<div>"
						+"<div class='alert alert-success' style='display: none;'	id='successClientCompetitorDiv'>"
						+"<strong>Source Mapped Successfully</strong></div> "
						+"<div class='alert alert-danger alert-error' style='display: none;'	id='errorClientCompetitorDiv'>"
						+"<strong id='errorSource'> Error in mapping </strong></div>"
						+"</div>"
						+ "<table class='table table-striped table-bordered' id='clientContentTable'>"
						+ 		"<thead>"
						+ 			"<tr>"
						+				"<th style='width:60px;'><input type='checkbox' id='selectAllContentChkBox' style='margin-left:24px;'/></th>"
						+				"<th>Source</th>"
						+				"<th>secret key</th>"
						+				"<th>user key</th>"
						+				"<th>link</th>"
						+			"</tr>"
						+ 		"</thead>"
						+			"<tbody>";
					for(var i=0;i<data.length;i++){
					html+=			"<tr>"
						+			"<td align='center'><input type='checkbox' class='contentChkBox' value='"+data[i].id+"'/></td>"	
						+			"<td id='sourceName"+data[i].id+"'>"+data[i].sourceName+"</td>"	
						+			"<td><input type='text' id='secretKey"+data[i].id+"' value='"+data[i].secretKey+"'></td>"
						+			"<td><input type='text' id='apiKey"+data[i].id+"' value='"+data[i].apiKey+"'></td>"
						+			"<td><input type='text' id='sourceLink"+data[i].id+"' value='"+data[i].sourceLink+"'></td>"
						+			"</tr>";
					}
					html+=	"</tbody>"
						+ "</table>"
						+"</form>";
			$("#clientSourceMappingBody").append(html);
			 $("#clientSourceMapping").show();	
			 $("#clientContentTable").dataTable();
}
		});
}
//select all for client source mapping
$(document).on('click',"#selectAllContentChkBox",function(){
    $('.contentChkBox').prop('checked', $(this).is(':checked'));
  });

$(document).on('click',".contentChkBox",function(){
    if($('.contentChkBox:checked').length == $('.contentChkBox').length) {
      $('.selectAllContentChkBox').prop('checked', true);
    }
    else {
      $('.selectAllContentChkBox').prop('checked', false);
    }
});

var selectedSourceMappings =[];
// pushing selected sources into array
function sourceMappingArray(){
	var orgId=$("#organizationId").val();
	if($('.contentChkBox:checked').length) {
		selectedSourceMappings =[];
        $('.contentChkBox:checked').each(function() {
        	var id=$(this).val();
        	console.log(id);
    	//	var id=data[i].id*1;
			var sourceName=$("#sourceName"+id).text().trim();
			var secretKey =$("#secretKey"+id).val();
			var apiKey=$("#apiKey"+id).val();
			var sourceLink=$("#sourceLink"+id).val();
        	selectedSourceMappings.push({organizationId:orgId,sourceName:sourceName,secretKey:secretKey,apiKey:apiKey,sourceLink:sourceLink,id:id});
        });
      }
	editClientsourceMapping();
	return false;
}
//save client source Mapping 
function editClientSourceMapping(){
	var orgId=$("#organizationId").val();
	console.log(selectedSourceMappings);
	var client={clients:selectedSourceMappings};
				$.ajax({ 
			        url: "../Client/updateClientSourceMapping.htm", 
			        type: 'POST', 
			        data: JSON.stringify(client),
			        contentType:'application/json',
			        success:function(validationResponse){
			        	console.log(validationResponse.status);
					 if(validationResponse.status=="SAVE_SUCCESS"){
							$('#errorClientCompetitorDiv').hide();
							$('#successClientCompetitorDiv').show(600);
							listOfClientContentSourceMapping();
					}
							if(validationResponse.status==null){
								alert("Error in saving data or duplicate entry");
								$('#errorIndustryTypeDiv').show();
							} 
				},fail:function(validationResponse){
					alert("error"+validationResponse.status);
				}
				});
	   	 } 

// list of POI Data

function listOfClientPOIDataMapping(){
	clearDivs();
	var orgId=$("#organizationId").val();
	$("#clientAmenityMappingBody").empty();	
	$.ajax({
		url:'../Client/clientPOIDatalist.htm?id='+orgId+'',		
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
		 var html="";
			html+="<hr>"
					+"<form class='form-horizontal'>"
					+"<div>"
					+"<input type='button' class='btn btn-success'    value='Cancel'/>"
					+"<input type='button' class='btn btn-success'   onclick='POIDataMappingArray()' value='Save Changes'/>"
					+"</div></br>"
					+"<div>"
					+"<div class='alert alert-success' style='display: none;' id='successPOIDataDiv'>"
					+"<strong>Place Of Interest Mapped Successfully</strong></div> "
					+"<div class='alert alert-danger alert-error' style='display: none;' id='errorPOIDataDiv'>"
					+"<strong id='errorSource'> Error in mapping </strong></div>"
					+"</div></br>"
					+ "<table class='table table-striped table-bordered' id='poiDataTable'>"
					+ 		"<thead>"
					+ 			"<tr>"
					+				"<th style='width:60px;'><input type='checkbox' id='selectAllPoiDataChkBox' style='margin-left:24px;'/></th>"
					+				"<th>Place Of Interest Name</th>"
					+				"<th>POI Type</th>"
					+			"</tr>"
					+ 		"</thead>"
					+			"<tbody>";
				for(var i=0;i<data.length;i++){
				html+=			"<tr>"
					+			"<td align='center'><input type='checkbox' class='poiDataChkBox' value='"+data[i].id+"'/></td>"	
					+			"<td id='organizationName"+data[i].id+"'>"+data[i].organizationName+"</td>"	
					+			"<td>"+data[i].organizationType+"</td>"
					+			"<td style='display:block;' id='organizationId"+data[i].id+"'>"+data[i].organizationId+"</td>"
					+			"</tr>";
				}
				html+=	"</tbody>"
					+ "</table>"
					+"</form>";
		 $("#clientAmenityMappingBody").append(html);
		 $("#clientAmenityMapping").show();
		 $("#poiDataTable").dataTable();
}
	});
}
$(document).on('click',"#selectAllPoiDataChkBox",function(){
    $('.poiDataChkBox').prop('checked', $(this).is(':checked'));
  });

$(document).on('click',".poiDataChkBox",function(){
    if($('.poiDataChkBox:checked').length == $('.contentChkBox').length) {
      $('.selectAllPoiDataChkBox').prop('checked', true);
    }
    else {
      $('.selectAllPoiDataChkBox').prop('checked', false);
    }
});

var selectedPOIDataMappings =[];

function POIDataMappingArray(){
	var organizationId=$("#organizationId").val();
	if($('.poiDataChkBox:checked').length) {
		selectedPOIDataMappings =[];
        $('.poiDataChkBox:checked').each(function() {
        	var id=$(this).val();
        	console.log(id);
    	//	var id=data[i].id*1;
			var poiId=$("#organizationId"+id).text().trim();
			var poiDataId=parseInt(poiId);
			var orgId=parseInt(organizationId);
			selectedPOIDataMappings.push({organizationId:orgId,poiDataId:poiDataId});
        });
        console.log(selectedPOIDataMappings);
      }
	editPOIDataMapping();
	return false;
}

function editPOIDataMapping(){
	var orgId=$("#organizationId").val();
	console.log(selectedPOIDataMappings);
	var clients={clients:selectedPOIDataMappings};
				$.ajax({ 
			        url: "../Client/updatePOIDataMapping.htm", 
			        type: 'POST', 
			        data: JSON.stringify(clients),
			        contentType:'application/json',
			        success:function(validationResponse){
			        	console.log(validationResponse.status);
					 if(validationResponse.status=="SAVE_SUCCESS"){
							$('#errorPOIDataDiv').hide();
							$('#successPOIDataDiv').show(600);
							listOfClientPOIDataMapping();
					}
							if(validationResponse.status==null){
								alert("Error in saving data or duplicate entry");
								$('#errorPOIDataDiv').show();
							} 
				},fail:function(validationResponse){
					alert("error"+validationResponse.status);
				}
				});
}

function editClientCompetitorMapping(){
	$.ajax({
		url:'../Client/updateClientCompetitorMapping.htm?id='+orgId+'',		
		type: 'POST',
	    success: function(data){ 
		 console.log(data);
	    	},error: function(data){
	    		consle.log(data);	
	    	}
		});
}

function listOfClientCompetitorMapping(){
	clearDivs();
	var orgId=$("#organizationId").val();
	$.ajax({
		url:'../Client/clientCompetitorlist.htm?id='+orgId+'',		
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
		 var html="";
			html+="<hr>"
					+"<form class='form-horizontal'>"
					+"<div>"
					+"<input type='button' class='btn btn-success'    value='Cancel'/>"
					+"<input type='button' class='btn btn-success'   onclick='editClientCompetitorMapping()' value='Save Changes'/>"
					+"</div><br>"
					+ "<table class='table table-striped table-bordered' id='competitorTable'>"
					+ 		"<thead>"
					+ 			"<tr>"
					+				"<th style='width:60px;'><input type='checkbox' id='selectAllChkBox' style='margin-left:24px;'/></th>"
					+				"<th>Organization Name</th>"
					+				"<th>Parent Organization Name</th>"
					+				"<th>Organization Type</th>"
					+			"</tr>"
					+ 		"</thead>"
					+			"<tbody>";
				for(var i=0;i<data.length;i++){
				html+=			"<tr>"
					+			"<td align='center'><input type='checkbox' class='dataChkBox' value='"+data[i].id+"'/></td>"	
					+			"<td>"+data[i].competitorName+"</td>"	
					+			"<td>"+data[i].parentOrganizationName+"</td>"
					+			"<td>"+data[i].competitorType+"</td>"
					+			"</tr>";
				}
				html+=	"</tbody>"
					+ "</table>"
					+"</form>";
		 $("#clientCompetitorMappingBody").append(html);
		 $("#clientCompetitorMapping").show();
		 $("#competitorTable").dataTable();
		}
	});
}

function listOfClientPOSDataMapping(){
	clearDivs();
	var orgId=$("#organizationId").val();
	$.ajax({
		url:'../Client/clientPOSDatalist.htm?id='+orgId+' ',		
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
		 var html="";
			html+="<hr>"
					+"<form class='form-horizontal'>"
					+"<div>"
					+" <input type='button' class='btn btn-danger'  onclick='createPOS()' value='Add POS'>"
					+"</div><br>"
					+ "<table class='table table-striped table-bordered' id='posTable'>"
					+ 		"<thead>"
					+ 			"<tr>"
					+				"<th style='width:60px;'><input type='checkbox' id='selectAllPoiChkBox' style='margin-left:24px;'/></th>"
					+				"<th>POS Organization Name</th>"
					+				"<th></th>"
					+			"</tr>"
					+ 		"</thead>"
					+		"<tbody>";
				for(var i=0;i<data.length;i++){
				html+=			"<tr>"
					+			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+data[i].id+"'/></td>"	
					+			"<td>"+data[i].organizationDisplayName+"</td>"
					+			"<td><button value='"+data.id+"' onclick='removePOS("+data[i].id+")'>Remove</button></td>"
					+			"</tr>";
				}
				html+=	"</tbody>"
					+ "</table>"
					+"</form>";
		 $("#clientPOSMappingBody").append(html);
		 $("#clientPOSMapping").show();
		 $("#posTable").dataTable();
		}
	});
}
function removePOS(id){
	$.ajax({
		url:'../Client/removePOS.htm?id='+id+' ',		
		type: 'POST',
		contentType:'application/json',
	    success: function(validationResponse){ 
		 console.log(data);
		 listOfClientPOSDataMapping();
	    },error: function(validationResponse){
	    	alert("error occured");
	    }
	    });
}

	
function createPOS(){
	clearDivs();
	var html="";
	html=+'<div class="tab-pane active" id="newOrganization">'
	+'<hr>'
	+'<div class="alert alert-success" style="display: none;"	id="successOrganizationDiv">'
	+'	<strong>Organization Data Created Successfully</strong>'
	+'</div>'
	+'<div class="alert alert-danger alert-error" style="display: none;"	id="errorOrganizationDiv">'
	+'	<strong>Errors Occured.</strong>'
	+'	</div>'
	+'<form class="form-horizontal" role="form"  id="addOrganizationForm">'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationFullName"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="organizationFullName"   placeholder="Enter Organization Full Name ">'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationDisplayName"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="organizationDisplayName"  placeholder="Enter Organization Display Name ">'
	+' </div>'
	+' </div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.PrimaryEmailId"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="primaryEmailId"  placeholder="Enter Primary Email Id ">'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.IndustryType"/></label>'
	+' <div class="col-sm-10">'
	+'    <div  id="industryTypeList"></div>'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.OrganizationType"/></label>'
	+' <div class="col-sm-10">'
	+'    <div id="organizationTypeList"></div>'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label  class="col-sm-2 control-label"><spring:message code="label.ArchitecturalStyle"/></label>'
	+' <div class="col-sm-10">'
	+'    <div  id="architecturalStyleList"></div>'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label  class="col-sm-2 control-label"><spring:message code="label.ParentOrganization"/></label>'
	+' <div class="col-sm-10">'
	+'    <div  id="parentOrganizationList"></div>'
	+' </div>'
	+' </div>'
	+' <div class="form-group">'
	+' <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.SelfRatingType"/></label>'
	+' <div class="col-sm-10">'
	+'    <div  id="selfRatingList"></div>'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label" for="inputfile"><spring:message code="label.UploadOrganizationLogo"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="file" class="form-control"  id="uploadOrganizationLogo" placeholder="upload Organization Log">'
	+'  </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.UploadOrganizationBanner"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="file" class="form-control"  id="uploadOrganizationBanner"  placeholder="upload Organization Banner ">'
	+'  </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizatinAddress"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="organizationAddress1" placeholder="Enter Organization Primary Address">'
	+'  </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationAddress"/></label>'
	+'<div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="organizationAddress2" placeholder="Enter Organization Secondary Address ">'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.Country"/></label>'
	+'<div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="organizationCountry"  placeholder="Enter Country ">'
	+'</div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.State"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="organizationState"  placeholder="Enter State ">'
	+'  </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.City"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="organizationCity" placeholder="Enter City ">'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+'  <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.SpecificLocation"/></label>'
	+'<div class="col-sm-10">'
	+'   <div id="specificLocationList"></div>'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.LocationDistrict"/></label>'
	+'<div class="col-sm-10">'
	+'   <div id="locationDistrictList"></div>'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.AreaLocation"/></label>'
	+'<div class="col-sm-10">'
	+'    <div  id="areaLocationList"></div>'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.GeoLatitude"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="geoLatitude"  placeholder="Enter Latitude ">'
	+' </div>'
	+' </div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.GeoLongitude"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="geoLongitude" placeholder="Enter Longitude ">'
	+'  </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactEmail"/></label>'
	+'<div class="col-sm-10">'
	+'   <input type="text" class="form-control" id="contactEmail" placeholder="Enter Contact Email ">'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="primaryNumber" placeholder="Enter Primary Number ">'
	+' </div>'
	+'</div>'
	+'<div class="form-group">'
	+'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="secondaryNumber" placeholder="Enter Secondary Number ">'
	+' </div>'
	+' </div>'
	+'<div class="form-group">'
	+' <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>'
	+'<div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="pincode" placeholder="Enter Pincode ">'
	+'</div>'
	+'</div>'
	+'<div class="form-group">'
	+'  <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.Fax"/></label>'
	+' <div class="col-sm-10">'
	+'    <input type="text" class="form-control" id="fax" placeholder="Enter Fax Number ">'
	+' </div>'
	+'</div>'
	+'		<button type="submit" class="btn btn-default" id="saveOrganization">Submit</button>'
	+'</form>'
	+'</div>';
	
	$("#createOrganizationBody").append(html);
	 $("#createOrganization").modal('show');
	 listOfIndustryTypes();
		listOfOrganizationTypes();
		listOfParentOrganization();
		listOfSelfRatingTypes();
		listOfSpecificLocation();
		listOfDistrictLocation();
		listOfAreaLocation();
		listOfArchitecturalStyles();
		$('.dropdown-toggle').dropdown();
}	

$(document).on('click',"#selectAllPoiChkBox",function(){
    $('.poiChkBox').prop('checked', $(this).is(':checked'));
  });

$(document).on('click',".poiChkBox",function(){
    if($('.poiChkBox:checked').length == $('.poiChkBox').length) {
      $('.selectAllPoiChkBox').prop('checked', true);
    }
    else {
      $('.selectAllPoiChkBox').prop('checked', false);
    }
});

function checkBoxLength(){
	if($('.poiChkBox:checked').length) {
		selectedCheckBoxes =[];
        $('.poiChkBox:checked').each(function() {
          selectedCheckBoxes.push($(this).val());
        });
      }
	return false;
}


</script>
<script src="../resources/js/createOrganization.js"> </script>
</html>