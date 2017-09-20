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
		
<div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
	<div class="container">
		<div class="row">
			<h2 style="color: green;">
			</h2>
			<hr>
		</div>
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addOrganizationSelfRating" data-toggle="tab" onclick="addOrganizationSelfRating();">Rate Organization </a>
			</li>
			<li id="list"><a href="#listOfOrganizationSelfRatings" data-toggle="tab" onclick="listOfOrganizationSelfRatings()">List Of Organization Ratings</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<!-- --------------------Add New Industry Type------------------------------------------ -->
			<div class="tab-pane active" id="newOrganizationSelfRating">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successOrganizationSelfRatingDiv">
					<strong>Organization Rated Successfully</strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="errorOrganizationSelfRatingDiv">
					<strong>Errors Occured.</strong>
				</div>
				<form role="form" id="addOrganizationSelfRatingForm">
					<div class="form-group" id="OrganizationRating-Error">
						<label><spring:message code="label.StarRating"/></label> 
						<input	type="text" class="form-control" id="starRating" name="StarRating" placeholder="Star Rating" maxlength="50"> 
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="starRatingError"></span>
					</div>
					<div class="form-group" id="ratingType-Error">
						<label><spring:message code="label.RatingType"/></label> 
						<input type="text" class="form-control"  name="Rating Type" id="RatingType" placeholder="Rating Type" maxlength="50"></input>
						<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="ratingTypeError"></span>
					</div>
					<button type="submit" class="btn btn-default" id="saveOrganizationSelfRating">Submit</button>
				</form>
			</div>
			<!-- --------------------List All Industry Types------------------------------------------ -->
			<div class="tab-pane" id="listOfOrganizationSelfRating">
			</div>
		</div>
	</div>
</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript">

function addOrganizationSelfRating(){
	$("#listOfOrganizationSelfRating").hide();
	$("#newOrganizationSelfRating").show();
}

$('#saveOrganizationSelfRating').click(function(e){
	e.preventDefault();
	 $('#successOrganizationSelfRatingDiv').hide();
	 $('#errorOrganizationSelfRatingDiv').hide();
	var starRating = $.trim($('#starRating').val()*1);
	var ratingType = $.trim($('#RatingType').val()*1);
	var OrganizationRating={'starRating':starRating,'ratingType':ratingType};
	console.log(OrganizationRating);
	 $.ajax({ 
	        url: "../Organization/saveRating.htm", 
	        type: 'POST', 
	        data: JSON.stringify(OrganizationRating), 
	        contentType: 'application/json',
	        success: function(validationResponse){
	        	console.log(validationResponse.status);
				 if(validationResponse.status=="SAVE_SUCCESS"){
			 $('#errorOrganizationSelfRatingDiv').hide();
			 $('#successOrganizationSelfRatingDiv').show(600);
			 $('#addOrganizationSelfRatingForm').trigger("reset");
			 $('#OrganizationSelfRating-Error').removeClass('has-error has-feedback');
			 $('#OrganizationSelfRatingError').hide();
				}
				 if(validationResponse.status==null){
						alert("Error in saving data or duplicate entry");
						$('#errorOrganizationSelfRatingDiv').show();
				 } 
			 },	error:function(validationResponse) { 
	 			 if(validationResponse.status=="ERROR"){
	 				$('#errorOrganizationSelfRatingDiv').append(validationResponse.errorMessage);
	 				$('#errorOrganizationSelfRatingDiv').show();
	 			 }else{
	 		 		$('#errorOrganizationSelfRatingDiv').append(validationResponse.errorMessage);
	 				$('#errorOrganizationSelfRatingDiv').show();
	 			 }
    		 }
	 });
});


function listOfOrganizationSelfRatings(){
	$("#newOrganizationSelfRating").hide();
	$("#listOfOrganizationSelfRating").empty();
	 $.ajax({
			url:'../Organization/listOfOrgSelfRatings.htm',	
			type: 'GET',
		    success: function(data){ 
	 var html="";
		html+="<hr>"
				+"<form class='form-horizontal'>"
				+"<div>"
				+" <input type='button' class='btn btn-danger'  onclick='deleteOrganizationSelfRating()' value='Delete'>"
				+"</div><br>"
				+ "<table class='table table-striped table-bordered' id='ListTable'>"
				+ 		"<thead>"
				+ 			"<tr>"
				+				"<th style='width:60px;'><input type='checkbox' id='selectAllOrgTypeChkBox' style='margin-left:24px;'/></th>"
				+				"<th>Star Rating</th>"
				+				"<th>Rating Type</th>"
				+			"</tr>"
				+ 		"</thead>"
				+			"<tbody>";
			for(var i=0;i<data.length;i++){
			html+=			"<tr>"
				+			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+data[i].id+"'/></td>"	
				+			"<td>"+data[i].starRating+"</td>"	
				+			"<td>"+data[i].ratingType+"</td>"
				+			"</tr>";
			}
			html+=	"</tbody>"
				+ "</table>"
				+"</form>";
	 $("#listOfOrganizationSelfRating").append(html);
	 $("#listOfOrganizationSelfRating").show();
	 $("#ListTable").dataTable();
	 },error:function(url,status,er) { 
	     	alert("error: "+url+" status: "+status+" er:"+er);
	    }
	 });
}

function deleteOrganizationSelfRating(){
	  checkBoxLength();
	  console.log(selectedCheckBoxes);
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $.get("../Organization/deleteRating.htm?ids="+selectedCheckBoxes,function(response){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   listOfOrganizationSelfRatings();
			  })
			  .fail(function(validationResponse) {
			  alert("error"+validationResponse.status);
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