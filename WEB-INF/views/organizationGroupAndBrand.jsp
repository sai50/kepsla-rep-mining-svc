<%@include file="includeTagLibs.jsp"%>
<%@include file="adminDashboard.jsp" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <%@include file="includeCssFiles.jsp" %>
    </head>
    <body>
    <div id="loadMaskDiv" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

	<div class="container">
		
		<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
			<li id="addCountry"><a href="#" data-toggle="tab" onclick="orgGroupAndBrand()"><spring:message code="label.OrganizationGroupAndBrand"/></a>
			</li>
			<li ><a href="#" onclick="organization()" data-toggle="tab"><spring:message code="label.Organization"/></a>
			</li>
		</ul>
		<div>
		<div class="form-group" id="Group-Error">
						<label><spring:message code="label.OrgGroup"/></label> 
						<div id="orgGroupList"></div>
					</div>
		<div class="form-group" id="Brand-Error">
						<label><spring:message code="label.OrgBrand"/></label> 
						<div id="geoCity">
						<select id="orgBrand"  class="form-control">
						<option></option>
						</select>
						</div>
						<div id="orgBrandList"></div>
		</div>	
		</div>
		
		<div id="listOfGeoLocation">
		</div>
	</div>
</div>	
</body>
<%@include file="includeJsFiles.jsp" %>
<script src="../resources/js/geoMasterCommons.js"></script>
<script>
$(document).ready(function(){
	orgGroupList();
});

function orgGroupList(){
	$.ajax({
		url:'../Organization/list.htm',	
		type: 'GET',
	    success: function(response){ 
		var list = response.successObject.listAllCountries;
		console.log(list);
		if(list.length<0 ||list==[]){
			 var html="Error in getting List";
		}else{
			 var html="";
				html+="<select id='orgGroup' name='orgGroup' onChange='changeBrand()' class='form-control'>"
					+"<option> Please Select Country Name </option>";
		for(var i=0;i<list.length;i++){
				 html+="<option value='"+list[i].geoCountryName+"'>"+list[i].geoCountryName+"</option>";
			 }
				html+="</select> "; 
			}
			$("#OrgGroupList").append(html);
		}
	    });
	}







function geoLocationList(){
	 $("#listOfGeoLocation").empty();
	$.ajax({
	url:'../GeoLocation/listOfGeoLocation.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
		html+="<hr>"
				+"<form class='form-horizontal'>"
				+"<div>"
				+"<button class='btn' data-toggle='tab' id='Add' onclick='addGeoLocation()'>Add</button> &nbsp&nbsp&nbsp;"
				+"<button class='btn' onclick='deleteSelected()'>Delete</button>"
				+"</div><br>"
				+ "<table class='table table-striped table-bordered' id='geoLocationTable'>"
				+ 		"<thead>"
				+ 			"<tr>"
				+				"<th style='width:60px;'><input type='checkbox' id='selectAllChkBox' style='margin-left:24px;'/></th>"
				+				"<th>Location</th>"
				+				"<th>Area</th>"
				+				"<th>City</th>"
				+				"<th>Country</th>"
				+				"<th>Location Type</th>"
				+			"</tr>"
				+ 		"</thead>"
				+		"<tbody>";
			var list = response.successObject.listAllGeoLocation;
			for(var i=0;i<list.length;i++){
			html+=			"<tr>"
				+			"<td align='center'><input type='checkbox' class='chkBox' value='"+list[i].id+"'/></td>"	
				+			"<td>"+list[i].geoName+" </td>"
				+			"<td>"+list[i].geoAreaName+" </td>"
				+			"<td>"+list[i].geoCityName+" </td>"
				+			"<td>"+list[i].geoCountryName+" </td>"
				+			"<td>"+list[i].geoLocationTypeNames+"   &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type='button' class='btn btn-danger'  onclick='deleteGeoLocationType()' value='Delete'>&nbsp"
			    +           " <input type='button' class='btn btn-success'   onclick='editGeoLocationType("+list[i].id+")' value='Edit'/> </td>"	
				+			"</tr>";
				}
			html+=	"</tbody>"
				+ "</table>"
				+"</form>";
	 $("#listOfGeoLocation").append(html);
	 $("#listOfGeoLocation").show();
	 $("#geoLocationTable").dataTable();
    },error:function(url,status,er) { 
     	alert("error: "+url+" status: "+status+" er:"+er);
    }
    });
}

function editGeoLocationType(id){
	window.location.href="../GeoLocation/edit.htm?id="+id+" "  ;
}
var selectedCheckBoxes=new Array();

function addGeoLocation(){
	window.location.href="../GeoLocation/add.htm"	
}

function deleteGeoLocationType(id){
	var ids=new Array();
	ids.push(id);
 if(ids.length>0){
	if(confirm("Do you want to delete this record?")){
		  $.get("../GeoLocationType/delete.htm?ids="+selectedCheckBoxes,function(response){
				   selectedCheckBoxes.pop(selectedCheckBoxes);
				   geoLocationTypesList();
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


function deleteSelected(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $.get("../GeoLocationType/delete.htm?ids="+selectedCheckBoxes,function(response){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   geoLocationTypesList();
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


$(document).on('click',"#selectAllChkBox",function(){
        $('.chkBox').prop('checked', $(this).is(':checked'));
      });

 $(document).on('click',".chkBox",function(){
        if($('.chkBox:checked').length == $('.chkBox').length) {
          $('.selectAllChkBox').prop('checked', true);
        }
        else {
          $('.selectAllChkBox').prop('checked', false);
        }
 });
  
function checkBoxLength(){
    	if($('.chkBox:checked').length) {
    		selectedCheckBoxes =[];
            $('.chkBox:checked').each(function() {
              selectedCheckBoxes.push($(this).val());
            });
          }
    	return false;
    }

</script>

</html>