
function addOrganization(){
	$("#listOfOrganizationTypes").hide();
	$("#newOrganizationType").show();
}

$('#saveOrganizationType').click(function(){
	 $('#successOrganizationTypeDiv').hide();
	 $('#errorOrganizatioTypeDiv').hide();
	var organizationType = $.trim($('#organizationType').val());
	var organizationDesc = $.trim($('#OrganizationTypeDescription').val());
	var mappedIndianType = $.trim($('#MappedIndianType').val());
	var OrganizationType={'organizationType':organizationType,'organizationTypeDescription':organizationDesc,'mappedIndianType':mappedIndianType};
	console.log(OrganizationType);
	 $.ajax({ 
	        url: "../Organization/save.htm", 
	        type: 'POST', 
	        data: JSON.stringify(OrganizationType), 
	        contentType: 'application/json',
	        success: function(validationResponse) {
	        	if(validationResponse.status="SAVE_SUCCESS"){
			 $('#errorOrganizationTypeDiv').hide();
			 $('#successOrganizationTypeDiv').show(600);
			 $('#addOrganizationTypeForm').trigger("reset");
			 $('#OrganizationType-Error').removeClass('has-error has-feedback');
			 $('#OrganizationTypeError').hide();
	        	} if(response.status=="SAVE_ERROR"){
	        		$('#successOrganizationTypeDiv').hide();
	        		 $('#errorOrganizationTypeDiv').show();
	        	}
			 },
	 		error:function(validationResponse) { 
         	alert("error: "+ validationResponse.errorMessage);
    		 }
	 });
});


function listOfOrganizationTypes(){
	$("#organizationTypesBody").empty();
	$("#newOrganizationType").hide();
	 $("#listOfOrganizationTypes").empty();
	 $.get( '../Organization/list.htm', function( data ) {
	 console.log(data);
	 var html="";
		html+="<hr>"
				+"<form class='form-horizontal'>"
				+"<div>"
				+" <input type='button' class='btn btn-danger'  onclick='deleteOrganizationType()' value='Delete'>&nbsp"
				+" <input type='button' class='btn btn-success' onclick='editOrganizationType()' value='Edit'>"
				+"</div><br>"
				+ "<table class='table table-striped table-bordered' id='organizationTypeTable'>"
				+ 		"<thead>"
				+ 			"<tr>"
				+				"<th style='width:60px;'><input type='checkbox' id='selectAllOrgTypeChkBox' style='margin-left:24px;'/></th>"
				+				"<th>Organization Type</th>"
				+               "<th>Mapped Indian Type</th>"
				+				"<th>Organization Description</th>"
				+			"</tr>"
				+ 		"</thead>"
				+			"<tbody>";
			for(var i=0;i<data.length;i++){
			html+=			"<tr>"
				+			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+data[i].id+"'/></td>"	
				+			"<td>"+data[i].organizationType+"</td>"	
				+			"<td>"+data[i].mappedIndianType+"</td>"
				+			"<td>"+data[i].organizationTypeDescription+"</td>"
				+			"</tr>";
			}
			html+=	"</tbody>"
				+ "</table>"
				+"</form>";
	 $("#listOfOrganizationTypes").append(html);
	 $("#listTable").dataTable();
	 $("#listOfOrganizationTypes").show();
	 });
}

function editOrganizationType(){
	$("#organizationTypesBody").empty();
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
			    url: '../Organization/getEditData.htm?id='+selectedCheckBoxes+' ',
			    type: 'GET',
			    success: function(data){ 
				var html="";
				html+=' <div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="updateErrorOrgDiv" >'
					+'</div>'
						+'<div class="form-group" id="Edit-OrganizationType-Error">'
						+'	<label><spring:message code="label.OrganizationType"/></label>'
						+'	<input	type="text" class="form-control" id="editedOrganizationType" name="OrganizationType" placeholder="Organization Type" maxlength="50" value="'+data.organizationType+'"> '
						+'</div>'
						+'<div class="form-group" id="Edit-MappedIndianType-Error">'
						+'	<label><spring:message code="label.MappedIndianType"/></label> '
						+'	<input type="text" class="form-control" id="editedMappedIndianType" maxlength="50" placeholder="Mapped Indian Type" value="'+data.mappedIndianType+'">'
						+'</div>'
						+'<div class="form-group" id="Edit-OrgTypeDesc-Error">'
						+'	<label><spring:message code="label.OrganizationTypeDesc"/></label> '
						+'	<textarea class="form-control"  rows="3" name="IndustryTypeDescription" id="editedOrganizationDesc" maxlength="100" placeholder="Organization Type Description">'+data.organizationType+'</textarea>'
						+'</div>'
						+'<input type="hidden" value="'+data.id+'" id="editedId">'
						+'<button type="submit" class="btn btn-primary" onclick="postEdit()">Update</button>';
				$("#organizationTypesBody").append(html);
			    },error:function(url,status,er) { 
		         	console.log("error: "+url+" status: "+status+" er:"+er);
		         	var html="Error in getting data.";
		         	$("#organizationTypesBody").append(html);
			    }
			});
			$("#editOrganizationTypesModal").modal('show');
  		}
  	}

function postEdit(){
	var organizationType=$("#editedOrganizationType").val();
	var organizationDesc=$("#editedOrganizationDesc").val();
	var mappedIndianType=$("#editedMappedIndianType").val();
	var id=$("#editedId").val();
	var OrganizationType={'id':id,'organizationType':organizationType,'organizationTypeDescription':organizationDesc,'mappedIndianType':mappedIndianType};
	console.log(OrganizationType);
	$.ajax({
		   url: "../Organization/postEdit.htm", 
	        type: 'POST', 
	        data: JSON.stringify(OrganizationType), 
	        contentType: 'application/json',
	        success: function(data) { 
	        	  $("#editOrganizationTypesModal").modal('hide');
	  	        listOfOrganizationTypes();
	  	        },
	  	        error:function(url,status,er) { 
	  	         	alert("error: "+url+" status: "+status+" er:"+er);
	  	        }
	});
}

function deleteOrganizationTypes(){
	$("#organizationTypesBody").empty();
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $.get("../Organization/delete.htm?ids="+selectedCheckBoxes,function(response){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   listOfOrganizationTypes();
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