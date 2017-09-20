/********************************************************************************************************************************************
***************************** A d d/S a v e***************************************************************************************************
**********************************************************************************************************************************************/
var selectedCheckBoxes = [];
var editedAmenityManagementId = "";
$('#addAmenityManagementForm').unbind('submit').bind('submit',function() {
	$('#loadMaskDiv').mask("Loading...");
	 $('#errorAmenityManagementDiv').hide();
	 $('#successAmenityManagementDiv').hide();
	 $('.help-inline').html('');
	 $('#amenityManagementType-Error').removeClass('has-error has-feedback');
	 var JSONObject = {};
	 JSONObject['AmenityName'] = $.trim($('#amenityManagementType').val());
	JSONObject['AmenityDescription'] = $.trim($('#amenityManagementTypeDescription').val());
	JSONObject['IndustryType'] = $.trim($('#industryType').val());

	 $.post("../amenityManagement/save.htm",JSONObject,function(response){
		 
		 if(response.status=="SAVE_SUCCESS"){
			 $('#errorAmenityManagementDiv').hide();
			 $('#successAmenityManagementDiv').show(600);
			 $('#addAmenityManagementForm').trigger("reset");
		 
		 } else if(response.status=="SAVE_ERROR"){
				 $('#successAmenityManagementDiv').hide();
				 $('#errorAmenityManagementDiv').show(600);
				 $('#amenityManagementType-Error').addClass('has-error has-feedback');
				 $('#amenityManagementType-span-Error').html(response.errorMessage);
		 }else{
			 alert(response.status);
		 }
		 $('#loadMaskDiv').unmask();
	 },'json').fail(function(response){
	    	alert(response.statusText+"********"+response.status);
	    });
	 $('#saveAmenityManagementType').removeAttr('disabled');
	    return false; 
});			 
			 
			 
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/

function listAllAmenityManagement(){
	$('#addAmenityManagement').html();
	$('#listAmenityManagement').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../amenityManagement/list.htm",
        dataType: "json",
   		success: function(response){
   			$('#successAmenityManagementDiv').hide();
   			$('#errorAmenityManagementDiv').hide();
   			$('#amenityManagementType-Error').removeClass('has-error has-feedback');
   			$('#addAmenityManagementForm').trigger("reset");
   			var tempHtml = listAmenityManagementResponse(response);	
   			$('#listAmenityManagement').append(tempHtml);
   			$('#listAmenityManagementTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listAmenityManagementResponse(response){
	$('#listAmenityManagement').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllAmenityManagementForm">';
		html+='<div>';
		html+='<input type="button" class="btn btn-success"  onclick="editAmenityManagement()" value="Edit">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deleteAmenityManagement()" value="Delete">';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessAmenityManagement"><strong>Record(s) Deleted Successfully</strong></div>';
		html+= "<table class='table table-striped table-bordered' id='listAmenityManagementTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllAmenityManagementChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Amenity Name</th>";
		html+=				"<th>Amenity Description</th>";
		html+=				"<th>Industry Type</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listAllAmenityManagement;
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='amenityManagementChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].amenityName+"</td>";	
				html+=			"<td>"+list[i].amenityDescription+"</td>";	
				html+=			"<td>"+list[i].industryType+"</td>";
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listAmenityManagement').empty();
		return html;
}

/********************************************************************************************************************************************
 ****************************D e l e t e******************************************************************************************************
 **********************************************************************************************************************************************/   
 function deleteAmenityManagement(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $('#loadMaskDiv').mask("Loading...");
			  $.get("../amenityManagement/delete.htm?ids="+selectedCheckBoxes,function(response){
				  if(response.status=="DELETE_SUCCESS"){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   var tempHtml = listAmenityManagementResponse(response);
					   $('#listAmenityManagement').append(tempHtml);
			   		   $('#listAmenityManagementTable').dataTable({ responsive: true});
			   		   $('#deleteSuccessAmenityManagement').show(600);
			   		   $('#loadMaskDiv').unmask();
				  } 
			  },'json').fail(function(response){
				  $('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
			  }); 
		  }
	  }else{
		  alert("Please select a record");
	  }
	  return false;
 }
 /********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
 $(document).on('click',"#selectAllAmenityManagementChkBox",function(){
       $('.amenityManagementChkBox').prop('checked', $(this).is(':checked'));
     });

 $(document).on('click',".amenityManagementChkBox",function(){
       if($('.amenityManagementChkBox:checked').length == $('.amenityManagementChkBox').length) {
         $('.selectAllAmenityManagementChkBox').prop('checked', true);
       }
       else {
         $('.selectAllAmenityManagementChkBox').prop('checked', false);
       }
 });
 function checkBoxLength(){
   	if($('.amenityManagementChkBox:checked').length) {
   		selectedCheckBoxes =[];
           $('.amenityManagementChkBox:checked').each(function() {
             selectedCheckBoxes.push($(this).val());
           });
         }
   	return false;
   }
 
 
 /********************************************************************************************************************************************
 **********************E d i t****************************************************************************************************************
 **********************************************************************************************************************************************/    
   function editAmenityManagement(){
 	$('#editAmenityManagementDiv').html('');
 	selectedCheckBoxes = [];
   	checkBoxLength();
   	if(selectedCheckBoxes.length>1){
   		alert("You can edit only one record at a time");
   		return false;
   	}else if(selectedCheckBoxes.length==0){
   		alert("Please select a record");
   		return false;
   	}else{
   		 $('#loadMaskDiv').mask('Loading...');
   		 $('#deleteSuccessAmenityManagement').hide(600);
   		 $.get("../amenityManagement/edit.htm?id="+selectedCheckBoxes,function(response){
   			 $('#editAmenityManagementDiv').append(response);
 				$('#editAmenityManagementModal').modal('show');
 				$('#successAmenityManagementDiv').hide();
 	   			$('#errorAmenityManagementDiv').hide();
 	   			$('#amenityManagementType-Error').removeClass('has-error has-feedback');
 	   			$('#addAmenityManagementForm').trigger("reset");
 				selectedCheckBoxes.pop(selectedCheckBoxes);
 				$('#loadMaskDiv').unmask();
   		 }).fail(function(response){
   			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
   		 });
   	
   		}
   		
   }
   $('#editAmenityManagementForm').unbind('submit').bind('submit',function() {
 	  $('#loadMaskDiv').mask('Loading...');
 		$('#updateErrorAmenityManagementDiv').hide();
 		$('#Edit-AmenityManagementType-Error').removeClass('has-error has-feedback');
		$('.help-inline').html('');
 		var editedAmenityManagementType = $.trim($('#editedamenityManagementType').val());
 		var editedAmenityManagementTypeDescription = $.trim($('#editedAmenityManagementTypeDescription').val());
 		var editAmenityIndustryTypeList = $.trim($('#editIndustryType').val());
 		
 		var JSONObject = {};
 		JSONObject['AmenityName'] = editedAmenityManagementType;
 		JSONObject['AmenityDescription'] = editedAmenityManagementTypeDescription;
 		JSONObject['IndustryType'] = editAmenityIndustryTypeList;
 		JSONObject['id'] = $('#editedAmenityManagementId').val();
 		$.post("../amenityManagement/update.htm",JSONObject,function(response){
 			if(response.status=="UPDATE_ERROR"){
 				
 				 $('#updateErrorAmenityManagementDiv').show(600);
 				 $('#Edit-AmenityManagementType-Error').addClass('has-error has-feedback');
 				 $('#Edit-AmenityManagementType-span-Error').html(response.errorMessage);
 				 $('#loadMaskDiv').unmask();
 			}else if(response.status=="UPDATE_SUCCESS"){
 				 $('#Edit-AmenityManagementType-Error').removeClass('has-error has-feedback');
 				 alert("Record updated successfully");
 				 $('#editAmenityManagementModal').modal('hide');
 				listAllAmenityManagement();
 			}
 			
 		},'json').fail(function(response){
 			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
 			return false;
 		});
 		return false;
 	
   });
