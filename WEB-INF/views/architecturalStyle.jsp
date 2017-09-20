<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<%@include file="includeHeaders.jsp"%>
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
	<!-- Fixed navbar -->
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	<div class="container">
		<div class="row">
			<h2 style="color: green;">
			</h2>
			<hr>
		</div>
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addArchitecturalStyle" data-toggle="tab" onclick="addArchitecturalStyle();">Add New Architectural Style </a>
			</li>
			<li id="list"><a href="#listOfArchitecturalStyles" data-toggle="tab" onclick="listOfArchitecturalStyles()">List Of Architectural Styles </a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New Industry Type------------------------------------------ -->
			<div class="tab-pane active" id="newArchitecturalStyle">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successArchitecturalStyleDiv">
					<strong>Architectural Style Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="errorArchitecturalStyleDiv">
					<strong>Errors Occured.</strong>
				</div>
				<form role="form" id="addArchitecturalStyleForm">
					<div class="form-group" id="ArchitecturalStyle-Error">
						<label><spring:message code="label.ArchitecturalStyle"/></label> 
						<input	type="text" class="form-control" id="ArchitecturalStyle" placeholder="Architectural Style" maxlength="50"> 
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="architecturalStyleError"></span>
					</div>
					<div class="form-group" id="starTypeDesc-Error">
						<label><spring:message code="label.ArchitecturalDescription"/></label> 
						<textarea class="form-control" rows="3" id="ArchitecturalDesc" placeholder="Architectural Description" maxlength="50"></textarea>
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="architecturalDescError"></span>
					</div>
					<button type="submit" class="btn btn-default" id="saveArchitecturalStyle">Submit</button>
				</form>
			</div>
			<!-- --------------------List All Industry Types------------------------------------------ -->
			<div class="tab-pane" id="listOfArchitecturalStyles">
			</div>
		</div>
	</div>
	<div class="modal fade" id="editArchitecturalStyleModal"  style="margin-top: 120px;margin-left: 170px;">
		<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editArchitecturalStyle">Edit Architectural Style</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;" id="architecturalStyleBody">
					</div>
			</div>
		</div>
</div>
</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">

function addArchitecturalStyle(){
	$("#listOfArchitecturalStyles").hide();
	$("#newArchitecturalStyle").show();
}

$('#saveArchitecturalStyle').click(function(){
	 $('#successArchitecturalStyleDiv').hide();
	 $('#errorArchitecturalStyleDiv').hide();
	var architecturalStyle = $.trim($('#ArchitecturalStyle').val());
	var architecturalDesc = $.trim($('#ArchitecturalDesc').val());
	var ArchitecturalStyle={'architecturalStyle':architecturalStyle,'architecturalDescription':architecturalDesc};
	console.log(ArchitecturalStyle);
	 $.ajax({ 
	        url: "../ArchitecturalStyle/save.htm", 
	        type: 'POST', 
	        data: JSON.stringify(ArchitecturalStyle), 
	        contentType: 'application/json',
	        success: function(response) {
	        if(response.status=="SUCCESS"){ 
			 $('#errorArchitecturalStyleDiv').hide();
			 $('#successArchitecturalStyleDiv').show(600);
			 $('#addArchitecturalStyleForm').trigger("reset");
			 $('#ArchitecturalStyle-Error').removeClass('has-error has-feedback');
			 $('#ArchitecturalStyleOrganizationTypeError').hide();
	        }else if(response.status=="SAVE_ERROR"){
	        	 $('#errorArchitecturalStyleDiv').show();
	        	 $('#errorArchitecturalStyleDiv').append('<strong>'+response.errorMessage+'</strong>');
	        }
			 },
	 		error:function(url,status,er) { 
         	alert("error: "+url+" status: "+status+" er:"+er);
    		 }
	 });
});


function listOfArchitecturalStyles(){
	$("#newArchitecturalStyle").hide();
		 $.ajax({
			    url: '../ArchitecturalStyle/list.htm',
			    type: 'GET',
			    success: function(data){ 
	 console.log(data);
	 var html="";
		html+="<hr>"
				+"<form class='form-horizontal'>"
				+"<div>"
				+" <input type='button' class='btn btn-danger'  onclick='deleteArchitecturalStyle()' value='Delete'>&nbsp"
				+"<input type='button' class='btn btn-success'  onclick='editArchitecturalStyle()' value='Edit'/>"

				+"</div><br>"
				+ "<table class='table table-striped table-bordered' id='architecturalStyleTable'>"
				+ 		"<thead>"
				+ 			"<tr>"
				+				"<th style='width:60px;'><input type='checkbox' id='selectAllPoiChkBox' style='margin-left:24px;'/></th>"
				+				"<th>Architectural Style</th>"
				+				"<th>Architectural Description</th>"
				+			"</tr>"
				+ 		"</thead>"
				+			"<tbody>";
			for(var i=0;i<data.length;i++){
			html+=			"<tr>"
				+			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+data[i].id+"'/></td>"	
				+			"<td>"+data[i].architecturalStyle+"</td>"	
				+			"<td>"+data[i].architecturalDescription+"</td>"
				+			"</tr>";
			}
			html+=	"</tbody>"
				+ "</table>"
				+"</form>";
	 $("#listOfArchitecturalStyles").append(html);
	 $("#listOfArchitecturalStyles").show();
	 $("#architecturalStyleTable").dataTable();
	 },error:function(url,status,er) { 
      	console.log("error: "+url+" status: "+status+" er:"+er);
     	var html="Error in getting data.";
     	 $("#listOfArchitecturalStyles").append(html);
     	$("#listOfArchitecturalStyles").show();
     	 $("#architecturalStyleTable").dataTable();
    }
	 });
}

 function editArchitecturalStyle(){
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
		    url: '../ArchitecturalStyle/getEditData.htm?id='+selectedCheckBoxes+' ',
		    type: 'GET',
		    success: function(data){ 
		    	$("#architecturalStyleBody").empty();
			var html="";
			html+=' <div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorRatingDiv" >'
				+'</div>'
					+'<div class="form-group" id="Edit-IndustryType-Error">'
					+'	<label><spring:message code="label.ArchitecturalStyle"/></label>'
					+'	<input	type="text" class="form-control" id="editedArchitecturalType" placeholder="Architectural Type" maxlength="50" value="'+data.architecturalStyle+'"> '
					+'</div>'
					+'<div class="form-group" id="Edit-RatingTypeDesc-Error">'
					+'	<label><spring:message code="label.ArchitecturalDescription"/></label> '
					+'	<textarea class="form-control" rows="3" id="editedArchitecturalDesc" placeholder="Architectural Description">'+data.architecturalDescription+'</textarea>'
					+'</div>'
					+'<input type="hidden" value="'+data.id+'" id="editedId">'
					+'<button type="submit" class="btn btn-primary" onclick="postEdit()"> <spring:message code="label.update"/></button>';
			$("#architecturalStyleBody").append(html);
		    },error:function(url,status,er) { 
	         	console.log("error: "+url+" status: "+status+" er:"+er);
	         	var html="Error in getting data.";
	         	$("#architecturalStyleBody").append(html);
		    }
		});
	  	} 
		$("#editArchitecturalStyleModal").modal('show');
 }
 
function postEdit(){
	var architecturalStyle=$("#editArchitecturalStyle").val();
	var architecturalDesc=$("#editArchitecturalDesc").val();
	
	var ArchitecturalStyle={'architecturalStyle':architecturalStyle,'architecturalDescription':architecturalDesc};
	$.ajax({
		  	url: "../ArchitecturalStyle/postEdit.htm", 
	        type: 'POST', 
	        data: JSON.stringify(ArchitecturalStyle), 
	        contentType: 'application/json',
	        success: function(data) { 
	        alert("success");
	        },error:function(response,status,error){
	        	alert(response);
	        }
		});
} 

function deleteArchitecturalStyle(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $.get("../architecturalStyle/delete.htm?ids="+selectedCheckBoxes,function(response){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   listOfArchitecturalStyles();
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
</script>
</html>