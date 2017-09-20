<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<%@include file="includeHeaders.jsp" %>
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
	<!-- Fixed navbar -->
	
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	<div class="container">
		<div class="row">
			<h2 style="color: black;">Manage POI Data
			</h2>
			<hr>
		</div>
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addPOIData" data-toggle="tab" onclick="addPOIData();">Add New POI Data</a>
			</li>
			<li id="list"><a href="#listOfPOIData" data-toggle="tab" onclick="listOfPOIData()">List Of POI Data</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New Industry Type------------------------------------------ -->
			<div class="tab-pane active" id="newPOIData">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successPOIDataDiv">
					<strong>POI Created Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="errorPOIDataDiv">
					<strong>Errors Occured.</strong>
				</div>
				<form role="form" id="addPOIDataForm">
					<div class="form-group" id="POIType-Error">
						<label><spring:message code="label.IndustryTypeDesc"/></label> 
						</div>
						  <div id="IndustryList" class="form-group">
						  </div>
					<div class="form-group" id="POIName-Error">
						<label><spring:message code="label.POIName"/></label> 
						<input type="text" class="form-control"  id="poiName" maxlength="100" placeholder="Place of Interest Name" required></input>
					</div>
					<div class="form-group" id="POIDesc-Error">
						<label><spring:message code="label.POIDescription"/></label> 
						<textarea class="form-control" rows="3"  id="poiDescription" maxlength="100" placeholder="Description"></textarea>
					</div>
					<div class="form-group" id="POICity-Error">
						<label><spring:message code="label.POICity"/></label> 
						<input type="text" class="form-control" id="poiCity" maxlength="100" placeholder="City"></input>
					</div>
					<div class="form-group" id="POILocalName-Error">
						<label><spring:message code="label.LocalName"/></label> 
						<input type="text" class="form-control"  id="poiLocalName" maxlength="100" placeholder="Local Name"></input>
					</div>
					<div class="form-group" id="POIAddress-Error">
						<label><spring:message code="label.POIAddress"/></label> 
						<textarea class="form-control" rows="3"  id="poiAddress" maxlength="100" placeholder="Address"></textarea>
					</div>
					<div class="form-group" id="POILatitude-Error">
						<label><spring:message code="label.Latitude"/></label> 
						<input type="text" class="form-control" id="geoLatitude" maxlength="100" placeholder="Please enter the Latitude"></input>
					</div>
					<div class="form-group" id="POILongitude-Error">
						<label><spring:message code="label.Longitude"/></label> 
						<input type="text" class="form-control" id="geoLongitude" maxlength="100" placeholder="Please enter the Longitude"></input>
					</div>
					
					<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-default" id="savePOIData">Submit</button>
				</form>
			</div>
			<div class="tab-pane" id="listOfPOIData">
			</div>
		</div>
	</div>
	<div class="modal fade" id="editPOIDataModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editPOIDataLabel">Edit POI Data</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;" id="poiDataBody">
					</div>
			</div>
		</div>
	</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>


<script>
var selectedCheckBoxes=new Array();


function listOfIndustryTypes(){
	$("#newIndustryType").hide();
	 $("#listOfIndustryTypes").empty();
	$.ajax({
	url:'../IndustryTypes/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='poiType'class='form-group'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].industryType+"'>"+data[i].industryType+"</option>";
	 }
	html+="</select> "; 
	 $("#IndustryList").append(html);
    },error:function(url,status,er) { 
     	alert("error: "+url+" status: "+status+" er:"+er);
    }
    });
}

function listOfPlaceOfInterest(){
	$("#newIndustryType").hide();
	 $("#listOfIndustryTypes").empty();
	$.ajax({
	url:'../placeOfInterest/list.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
	 var list = response.successObject.listAllPlaceOfInterest;
	 html+="<select id='poiType'class='form-group'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].id+"'>"+list[i].poiType+"</option>";
	 }
	html+="</select> "; 
	$("#associatedWith").append(html);
    },error:function(response){
    	console.log(data);
    }
    });
    }

function addPOIData(){
	$("#listOfPOIData").hide();
	$('#addPOIDataForm').trigger("reset");
	$("#newPOIData").show();
}

$('#savePOIData').click(function(){
	 $('#successPOIDataDiv').hide();
	 $('#errorPOIDataDiv').hide();
	var poiType = $.trim($('#poiType').val());
	var poiName= $.trim($('#poiName').val());
	var poiDesc = $.trim($('#poiDescription').val());
	var poiCity= $.trim($('#poiCity').val());
	var poiLocalName= $.trim($('#poiLocalName').val());
	var poiAddress=  $.trim($('#poiAddress').val());
	var geoLatitude= $.trim($('#geoLatitude').val());
	var geoLongitude= $.trim($('#geoLongitude').val());
	
	var POIData={'poiMasterType':poiType,'poiName':poiName,'poiDescription':poiDesc,'poiCity':poiCity,'poiAddress':poiAddress,'geoLatitude':geoLatitude,'geoLongitude':geoLongitude};
	console.log(POIData);
	if(poiType==""&&poiName==""){
	alert("Please enter Industry Type")	;
	}else{ $.ajax({ 
	        url: "../POI/save.htm", 
	        type: 'POST', 
	        data: JSON.stringify(POIData), 
	        contentType: 'application/json',
	        success: function(data) { 
			 $('#errorPOIDataDiv').hide();
			 $('#successPOIDataDiv').show(600);
			 $('#addPOIDataForm').trigger("reset");
			 $('#IndustryTypeType-Error').removeClass('has-error has-feedback');
			 $('#IndustryTypeTypeError').hide();
			 },
	 		error:function(data) { 
         	alert("error: "+data);
    		 }
	 });
	}
	});


function listOfPOIData(){
	 $("#listOfPOIData").empty();
	$.ajax({
	url:'../POI/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
		html+="<hr>"
				+"<form class='form-horizontal'>"
				+"<div>"
				+"<input type='button' class='btn btn-success'  onclick='editPOIData()' value='Edit'>&nbsp"
				+" <input type='button' class='btn btn-danger'  onclick='deletePOIData()' value='Delete'>"
				+"</div><br>"
				+ "<table class='table table-striped table-bordered' id='industryTable'>"
				+ 		"<thead>"
				+ 			"<tr>"
				+				"<th style='width:60px;'><input type='checkbox' id='selectAllPoiChkBox' style='margin-left:24px;'/></th>"
				+				"<th>POI Name</th>"
				+				"<th>POI Type</th>"
				+				"<th>POI Address</th>"
				+			"</tr>"
				+ 		"</thead>"
				+		"<tbody>";
			for(var i=0;i<data.length;i++){
			html+=			"<tr>"
				+			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+data[i].id+"'/></td>"	
				+			"<td>"+data[i].poiName+"</td>"	
				+			"<td>"+data[i].poiMasterType+"</td>"
				+			"<td>"+data[i].poiAddress+"</td>"
				+			"</tr>";
			}
			html+=	"</tbody>"
				+ "</table>"
				+"</form>";
	 $("#listOfPOIData").append(html);
	 $("#listOfPOIData").show();
	 $("#listTable").dataTable();
    },error:function(url,status,er) { 
     	alert("error: "+url+" status: "+status+" er:"+er);
    }
    });
}

function editPOIData(){
	checkBoxLength();
	console.log(selectedCheckBoxes);
 	if(selectedCheckBoxes.length>1){
  		alert("You can edit only one record at a time");
  		return false;
  	}else if(selectedCheckBoxes.length==0){
  		alert("Please select a record");
  		return false;
  	}else{
	$.ajax({
	    url: '../POI/getEditData.htm?id='+selectedCheckBoxes+' ',
	    type: 'GET',
	    success: function(data){ 
	    	$("#poiDataBody").empty();
	    	console.log(data);
		var html="";
		html+=' <div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorIndTypesDiv" >'
				+'</div>'
				+'	<div class="form-group" id="POIName-Error">'
				+'<label><spring:message code="label.POIName"/></label> '
				+'<input type="text" class="form-control"  id="editedPOIName" maxlength="100" value="'+data.poiName+'" disabled></input>'
				+'	</div>'
				+'<div class="form-group" id="POIDesc-Error">'
				+'<label><spring:message code="label.POIDescription"/></label> '
				+'<textarea class="form-control" rows="3"  id="editedPOIDescription" maxlength="100" value="'+data.poiTypeDescription+'"></textarea>'
				+'</div>'
				+'<div class="form-group" id="POICity-Error">'
				+'<label><spring:message code="label.POICity"/></label> '
				+'<input type="text" class="form-control" id="editedPOICity" maxlength="100" value="'+data.poiCity+'" placeholder="City"></input>'
				+'	</div>'
				+'<div class="form-group" id="POILocalName-Error">'
				+'<label><spring:message code="label.LocalName"/></label> '
				+'<input type="text" class="form-control"  id="editedPOILocalName" maxlength="100" value="'+data.poiCity+'" placeholder="Local Name"></input>'
				+'</div>'
				+'<div class="form-group" id="POIAddress-Error">'
				+'<label><spring:message code="label.POIAddress"/></label> '
				+'<textarea class="form-control" rows="3"  id="editedPOIAddress" maxlength="100" value="'+data.poiAddress+'" placeholder="Address"></textarea>'
				+'</div>'
				+'	<div class="form-group" id="POILatitude-Error">'
				+'<label><spring:message code="label.Latitude"/></label> '
				+'<input type="text" class="form-control" id="editedGeoLatitude" maxlength="100" value="'+data.geoLatitude+'" placeholder="Please enter the Latitude"></input>'
				+'</div>'
				+'<div class="form-group" id="POILongitude-Error">'
				+'	<label><spring:message code="label.Longitude"/></label> '
				+'<input type="text" class="form-control" id="editedGeoLongitude" maxlength="100" value="'+data.geoLongitude+'" placeholder="Please enter the Longitude"></input>'
				+'</div>'
				+'<input type="hidden" value="'+data.id+'" id="editedId">'
				+'<button type="submit" class="btn btn-primary" onclick="postEdit()"> <spring:message code="label.update"/></button>';
				+'<input type="button" value="<spring:message code="label.update"/>" class="btn btn-success" onclick="postEdit()" style="margin-left:-14px;"/>'
				+'</div>';
		$("#poiDataBody").append(html);
	    },error:function(url,status,er) { 
	    	console.log("error: "+url+" status: "+status+" er:"+er);
         	var html="Error in getting data.";
         	$("#poiDataBody").append(html);
	    }
	});
	$("#editPOIDataModal").modal('show');
	 /* 	console.log($("#id").data("IndustryType",industryType)); */
}
}

function postEdit(){
	var poiType = $.trim($('#editedPOIType').val());
	var poiName= $.trim($('#editedPOIName').val());
	var poiDesc = $.trim($('#editedPOIDescription').val());
	var poiCity= $.trim($('#editedPOICity').val());
	var poiLocalName= $.trim($('#editedPOILocalName').val());
	var poiAddress=  $.trim($('#editedPOIAddress').val());
	var geoLatitude= $.trim($('#editedGeoLatitude').val());
	var geoLongitude= $.trim($('#editedGeoLongitude').val());
	
	var POIData={'poiType':poiType,'poiName':poiName,'poiDescription':poiDesc,'poiCity':poiCity,'poiAddress':poiAddress,'geoLatitude':geoLatitude,'geoLongitude':geoLongitude};
	console.log(POIData);
	
	$.ajax({
		   url: "../POI/postEdit.htm", 
	        type: 'POST', 
	        data: JSON.stringify(POIData), 
	        contentType: 'application/json',
	        success: function(data) { 
	        $("#editPOIDataModal").modal('hide');
	        listOfPOIData();
	        },
	        error:function(url,status,er) { 
	         	alert("error: "+url+" status: "+status+" er:"+er);
	        }
	});
}

function deletePOIData(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $.get("../POIData/delete.htm?ids="+selectedCheckBoxes,function(response){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   listOfPOIData();
			  })
			  .fail(function(response) {
			  alert("error"+response);
			  });
			  }
	  }else{
		  alert("Please select a record");
	  }
	  return false;
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
    
    
$(document).ready(function(){
	listOfPlaceOfInterest();
	listOfIndustryTypes();
$('.dropdown-toggle').dropdown();
});
</script>
</html>