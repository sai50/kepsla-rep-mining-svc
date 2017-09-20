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
			<h2 style="color: Black;">Manage Events
			</h2>
			<hr>
		</div>
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li class="active"><a href="#addEvent" data-toggle="tab" onclick="addEvent();">Add New Event</a>
			</li>
			<li id="list"><a href="#listOfManagedEvent" data-toggle="tab" onclick="listOfManagedEvents()">List Of Managed Events</a>
			</li>
		</ul>
		<div id="my-tab-content" class="tab-content">
			<div class="tab-pane active" id="newEvent">
				<hr>
				<div class="alert alert-success" style="display: none;"	id="successEventDiv">
					<strong><spring:message code="label.EventCreated"/></strong>
				</div>
				<div class="alert alert-danger alert-error" style="display: none;"	id="errorEventDiv">
					<strong><spring:message code="label.EventError"/></strong>
				</div>
			<form class="form-horizontal" role="form"  id="addEventForm">
			   <div class="form-group">
			      <label class="col-sm-2 control-label"><spring:message code="label.EventName"/></label>
			      <div class="col-sm-10">
			         <input type="text" class="form-control" id="eventName"  placeholder="Enter Event Name ">
			      </div>
			   </div>
			   <div class="form-group">
			     <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.EventDateType"/></label>
	         		<div class="col-sm-10">
			         <select id="eventDateType" class="btn-group dropup">
					 <option value="One Time Event">One Time Event</option>
					 <option value="Daily">Daily</option>
					 <option value="Weekly">Weekly</option>
					 <option value="Monthly">Monthly</option>
					 <option value="Quaterly">Quaterly</option>
					 <option value="Half yearly">Half yearly</option>
					 <option value="Annually">Annually</option>
					 </select>
					</div>
			   </div>
			   <div class="form-group">
			      <label  class="col-sm-2 control-label"><spring:message code="label.EventDescription"/></label>
			      <div class="col-sm-10">
			         <textarea rows="3" class="form-control" id="eventDesc"></textarea>
			      </div>
			   </div>
			   <div class="form-group">
			      <label  class="col-sm-2 control-label"><spring:message code="label.EventStartDate"/></label>
			      <div class="col-sm-10">
			         <input type="date" class="form-control" id="eventStartDate">
			      </div>
			   </div>
			   <div class="form-group">
			      <label class="col-sm-2 control-label"><spring:message code="label.EventEndDate"/></label>
			      <div class="col-sm-10">
			        <input type="date" class="form-control" id="eventEndDate">
			      </div>
			   </div>
			   <div class="form-group row">
	        	 <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.EventAssocaited"/></label>
	         	<div class="col-sm-10">
		         <select id="eventAssociated" class="btn-group dropup" onchange="changeEvent()">
				 <option>Select</option>
				 <option value="City">City</option>
				 <option value="POI Data">POI Data</option>
				 <option value="Organization">Organization</option>
				 </select>
				 </div>
		         </div>
		         <div class="form-group row">
		         <div id="associatedWith"></div>
		         </div>
					<!--------------------- Button --------------------------------------------->
					<button type="submit" class="btn btn-default" id="saveEvent">Submit</button>
				</form>
			</div>
			<div class="tab-pane" id="listOfEvents">
			</div>
		</div>
	</div>
	<div class="modal fade" id="editEventModal"  style="margin-top: 120px;margin-left: 170px;">
	<div class="modal-dialog" style="width:900px;">
			<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="editEventLabel">Edit Event</h4>
					</div>
					<div class="modal-body" style="margin-left: 10px;" id="eventBody">
					</div>
			</div>
		</div>
		</div>
</div>	
</body>
<%@include file="includeJsFiles.jsp"%>


<script>
var selectedCheckBoxes=new Array();

function editChangeEvent(){
	alert("ds");
	var value=$.trim($("#editedEventAssociated").val());
	if(value=="POI Data"){
		editListOfPOIData();
	}else if(value=="City"){
		editListOfCity();
	}else if(value=="Organization"){
		editlistOfOrganizationTypes();
	}else{
		alert("Please Select any one option");
	}
	}

	function editListOfCity(){
		$("#editAssociatedWith").empty();
		var html="<div class='col-sm-10'>"
	  			+" <input type='text' class='form-control' placeholder='Enter The city Name'  id='editedEnteredValue'>"
	 			+"</div>";
	 			$("#editAssociatedWith").append(html);
	}

	function editListOfPOIData(){
		$("#editAssociatedWith").empty();
		$.ajax({
			url:'../POI/list.htm',	
			type: 'GET',
		    success: function(data){ 
			 console.log(data);
				$("#editAssociatedWith").empty();
			 var html="";
			 html+="<div class='col-sm-10'>"
				 +"<select id='EditednteredValue' class='form-control'>";
			 for(var i=0;i<data.length;i++){
				 html+="<option value='"+data[i].id+"'>"+data[i].poiName+"</option>";
			 }
			html+="</select></div>"; 
			$("#editAssociatedWith").append(html);
		    },error:function(data){
		    	console.log(data);
		    }
		    });
	}

	function editListOfOrganizationTypes(){
		$.ajax({
		url:'../Organization/list.htm',	
		type: 'GET',
	    success: function(data){ 
			$("#editAssociatedWith").empty();
		 var html="";
		 html+="<div class='col-sm-10'>"
			 +"<select id='editedEnteredValue' class='form-control'>";
		 for(var i=0;i<data.length;i++){
			 html+="<option value='"+data[i].id+"'>"+data[i].organizationType+"</option>";
		 }
		html+="</select></div> "; 
		$("#editAssociatedWith").append(html);
	    },error:function(data){
	    	console.log(data);
	    }
	    });
		}


function changeEvent(){
var value=$.trim($("#eventAssociated").val());
if(value=="POI Data"){
	listOfPOIData();
}else if(value=="City"){
	listOfCity();
}else if(value=="Organization"){
	listOfOrganizationTypes();
}else{
	alert("Please Select any one option");
}
}

function listOfCity(){
	$("#associatedWith").empty();
	var html="<div class='col-sm-10'>"
  			+" <input type='text' class='form-control' placeholder='Enter The city Name'  id='enteredValue'>"
 			+"</div>";
	$("#associatedWith").append(html);
}

function listOfPOIData(){
	$("#associatedWith").empty();
	$.ajax({
		url:'../POI/list.htm',	
		type: 'GET',
	    success: function(data){ 
		 console.log(data);
			$("#associatedWith").empty();
		 var html="";
		 html+="<div class='col-sm-10'>"
			 +"<select id='enteredValue' class='form-control'>";
		 for(var i=0;i<data.length;i++){
			 html+="<option value='"+data[i].id+"'>"+data[i].poiName+"</option>";
		 }
		html+="</select></div>"; 
		$("#associatedWith").append(html);
	    },error:function(data){
	    	console.log(data);
	    }
	    });
}

function listOfOrganizationTypes(){
	$.ajax({
	url:'../Organization/list.htm',	
	type: 'GET',
    success: function(data){ 
		$("#associatedWith").empty();
	 var html="";
	 html+="<div class='col-sm-10'>"
		 +"<select id='enteredValue' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].id+"'>"+data[i].organizationType+"</option>";
	 }
	html+="</select></div> "; 
	$("#associatedWith").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }


function addEvent(){
	$('#successEventDiv').hide();
	$('#errorEventDiv').hide();
	$('#addEventForm').trigger("reset");
	$("#listOfEvents").empty();
	$("#newEvent").show();
}


$('#saveEvent').click(function(){
	 $('#successEventDiv').hide();
	 $('#errorEventDiv').hide();
	var eventName = $.trim($('#eventName').val());
	var eventDateType= $.trim($('#eventDateType').val());
	var eventStartDate = $.trim($('#eventStartDate').val());
	var eventEndDate= $.trim($('#eventEndDate').val());
	var eventDesc= $.trim($('#eventDesc').val());
	var eventPOI="";
	var eventCity="";
	var organizationId="";
	var value=$.trim($("#eventAssociated").val());
	if(value=="POI Data"){
		 eventPOI=$.trim($("#enteredValue").val());
	}else if(value=="City"){
		 eventCity=$.trim($("#enteredValue").val());
	}else if(value=="Organization"){
		 organizationId=$.trim($("#enteredValue").val());
	}else{
		alert("Please Select any one option");
	}
	
	var Event={'eventPoi':eventPOI,'eventCity':eventCity,'organizationId':organizationId,'eventName':eventName,'eventDateType':eventDateType,'eventStartDate':eventStartDate,'eventEndDate':eventEndDate,'eventDescription':eventDesc}
	console.log(Event);
	if(eventName==""){
	alert("Please Enter Organization Name")	;
	}else{
		$.ajax({ 
	        url: "../ManageEvent/save.htm", 
	        type: 'POST', 
	        data: JSON.stringify(Event), 
	        contentType: 'application/json',
	        success: function(data) { 
			 $('#errorEventDiv').hide();
			 $('#successEventDiv').show(600);
			 $('#addEventForm').trigger("reset");
			 $('#Event-Error').removeClass('has-error has-feedback');
			 $('#EventError').hide();
			 },
	 		error:function(data) { 
         	alert("error: "+data);
    		 }
	 });
	}
	});


function listOfManagedEvents(){
	$("#newEvent").hide();
	 $("#listOfEvents").empty();
	$.ajax({
	url:'../ManageEvent/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
		html+="<hr>"
				+"<form class='form-horizontal'>"
				+"<div>"
				+"<input type='button' class='btn btn-success'  onclick='editEventData()' value='Edit'>&nbsp"
				+" <input type='button' class='btn btn-danger'  onclick='deleteEventData()' value='Delete'>"
				+"</div><br>"
				+ "<table class='table table-striped table-bordered' id='industryTable'>"
				+ 		"<thead>"
				+ 			"<tr>"
				+				"<th style='width:60px;'><input type='checkbox' id='selectAllPoiChkBox' style='margin-left:24px;'/></th>"
				+				"<th>Event Name</th>"
				+				"<th>Event Description</th>"
				+				"<th>Address</th>"
				+				"<th>Event Start Date</th>"
				+				"<th>Event End Date</th>"
				+			"</tr>"
				+ 		"</thead>"
				+		"<tbody>";
			for(var i=0;i<data.length;i++){
			html+=			"<tr>"
				+			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+data[i].id+"'/></td>"	
				+			"<td>"+data[i].eventName+"</td>"	
				+			"<td>"+data[i].eventDescription+"</td>"
				+			"<td>"+data[i].eventCity+"</td>"
				+			"<td>"+data[i].eventStartDate+"</td>"
				+			"<td>"+data[i].eventEndDate+"</td>"
				+			"</tr>";
			}
			html+=	"</tbody>"
				+ "</table>"
				+"</form>";
	 $("#listOfEvents").append(html);
	 $("#listOfEvents").show();
	 $("#listTable").dataTable();
    },error:function(url,status,er) { 
     	alert("error: "+url+" status: "+status+" er:"+er);
    }
    });
}

function editEventData(){
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
	    url: '../ManageEvent/getEditData.htm?id='+selectedCheckBoxes+' ',
	    type: 'GET',
	    success: function(data){ 
	    	$("#poiDataBody").empty();
		var html="";
		html+='<div class="alert alert-success" style="display: none;"	id="editSuccessEventDiv">'
			+'<strong><spring:message code="label.EventCreated"/></strong>'
			+'</div>'
			+'<div class="alert alert-danger alert-error" style="display: none;"	id="editeErrorEventDiv">'
			+'<strong><spring:message code="label.EventError"/></strong>'
			+'</div>'
			 +'<div class="form-group row">'
	    	 +'<label for="firstname" class="col-sm-4 control-label"><spring:message code="label.EventName"/></label>'
	    	 +'<div class="col-sm-10">'
	         +'<input type="text" class="form-control" id="editedEventName" placeholder="Enter Event Name" value="'+data.eventName+'" disabled>'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.EventDateType"/></label>'
	         +'<div class="col-sm-10">'
	         +'<select id="editedEventDateType" class="btn-group dropup">'
			 +'<option value="One Time Event">One Time Event</option>'
			 +'<option value="Daily">Daily</option>'
			 +'<option value="Weekly">Weekly</option>'
			 +'<option value="Monthly">Monthly</option>'
			 +'<option value="Quaterly">Quaterly</option>'
			 +'<option value="Half yearly">Half yearly</option>'
			 +'<option value="Annually">Annually</option>'
			 +'</select>'
			 +'</div>'
	         +' </div>'
	         +' <div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.EventStartDate"/></label>'
	         +'<div class="col-sm-10">'
	         +'<input type="date" class="form-control" value="'+data.eventStartDate+'" id="editedEventStartDate">'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.EventEndDate"/></label>'
	         +'<div class="col-sm-10">'
	         +'<input type="date" class="form-control" value="'+data.eventEndDate+'" id="editedEventEndDate">'
	         +'</div>'
	         +' </div>'
	         +'<div class="form-group row">'
	         +'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.EventDescription"/></label>'
	         +'<div class="col-sm-10">'
	         +'<textarea id="eventDescription" value="'+data.eventDescription+'" id="editedEventDesc">'+data.eventDescription+'</textarea>'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.EventAssocaited"/></label>'
	         +'<div class="col-sm-10">'
	         +'<select id="editedEventAssociated" class="btn-group dropup" onchange="editChangeEvent()">'
			 +'<option value="select">Select</option>'
	         +'<option value="City">City</option>'
			 +'<option value="POI Data">POI Data</option>'
			 +'<option value="Organization">Organization</option>'
			 +'</select>'
			 +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<div id="editAssociatedWith"></div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<input type="hidden" value="'+data.id+'" id="editedId">'
			+'<button type="submit" class="btn btn-primary" onclick="postEdit()"> <spring:message code="label.update"/> </button>';
			+'<input type="button" value="<spring:message code="label.update"/>" class="btn btn-success" onclick="postEdit()" style="margin-left:-14px;"/>'
			+'</div>';
		$("#eventBody").append(html);
	    },error:function(url,status,er) { 
	    	console.log("error: "+url+" status: "+status+" er:"+er);
         	var html="Error in getting data.";
         	$("#eventBody").append(html);
	    }
	});
	$("#editEventModal").modal('show');
}
}

function postEdit(){
	 $('#editSuccessEventDiv').hide();
	 $('#editErrorEventDiv').hide();
	var eventName = $.trim($('#editedEventName').val());
	var eventDateType= $.trim($('#editedEventDateType').val());
	var eventStartDate = $.trim($('#editedEventStartDate').val());
	var eventEndDate= $.trim($('#editedEventEndDate').val());
	var eventDesc= $.trim($('#editedEventDesc').val());
	var id=$.trim($('#editedId').val());
	var eventPOI="";
	var eventCity="";
	var organizationId="";
	var value=$.trim($("#editedEventAssociated").val());
	if(value=="POI Data"){
		 eventPOI=$.trim($("#editedEnteredValue").val());
	}else if(value=="City"){
		 eventCity=$.trim($("#editedEnteredValue").val());
	}else if(value=="Organization"){
		 organizationId=$.trim($("#editedEnteredValue").val());
	}else{
		alert("Please Select any one option");
	}
	
	var Event={'id':id,'eventPoi':eventPOI,'eventCity':eventCity,'organizationId':organizationId,'eventName':eventName,'eventDateType':eventDateType,'eventStartDate':eventStartDate,'eventEndDate':eventEndDate,'eventDescription':eventDesc};
	console.log(Event);
	if(eventName==""){
	alert("Please enter Event name")	;
	}else{
		$.ajax({
		   url: "../ManageEvent/postEdit.htm", 
	        type: 'POST', 
	        data: JSON.stringify(Event), 
	        contentType: 'application/json',
	        success: function(data) { 
	        $('#editSuccessEventDiv').show();
	        $("#editEventModal").modal('hide');
	        listOfManagedEvents();
	        },
	        error:function(url,status,er) { 
	        	$('#editSuccessEventDiv').hide();
	        	$('#editErrorEventDiv').show();
	        	alert("error: "+url+" status: "+status+" er:"+er);
	        }
	});
}
}

function deleteEventData(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $.get("../ManageEvent/delete.htm?ids="+selectedCheckBoxes,function(response){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   listOfManagedEvents();
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
$('.dropdown-toggle').dropdown();
});
</script>
</html>