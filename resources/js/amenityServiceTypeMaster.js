/********************************************************************************************************************************************
***************************** A d d/S a v e***************************************************************************************************
**********************************************************************************************************************************************/
var selectedCheckBoxes = [];
var editedAmenityManagementId = "";
$('#addAmenityServiceTypeMasterForm').unbind('submit').bind('submit',function() {
	$('#loadMaskDiv').mask("Loading...");
	 $('#errorAmenityServiceTypeMasterDiv').hide();
	 $('#successAmenityServiceTypeMasterDiv').hide();
	 $('.help-inline').html('');
	 $('#amenityServiceTypeName-span-Error').removeClass('has-error has-feedback');
	 var JSONObject = {};
	JSONObject['industryAmenityName'] = $.trim($('#amenityManagementType').val());
	JSONObject['amenityServiceTypeName'] = $.trim($('#amenityServiceTypeMasterType').val());
	JSONObject['amenityTypeDescription'] = $.trim($('#amenityServiceTypeMasterTypeDescription').val());

	 $.post("../amenityServiceTypeMaster/save.htm",JSONObject,function(response){
		 
		 if(response.status=="SAVE_SUCCESS"){
			 $('#errorAmenityServiceTypeMasterDiv').hide();
			 $('#successAmenityServiceTypeMasterDiv').show(600);
			 $('#addAmenityServiceTypeMasterForm').trigger("reset");
		 
		 } else if(response.status=="SAVE_ERROR"){
				 $('#successAmenityServiceTypeMasterDiv').hide();
				 $('#errorAmenityServiceTypeMasterDiv').show(600);
				 $('#amenityServiceTypeMasterType-Error').addClass('has-error has-feedback');
				 $('#amenityServiceTypeName-span-Error').html(response.errorMessage);
		
		 }else{
			 alert(response.status);
		 }
		 $('#loadMaskDiv').unmask();
	 },'json').fail(function(response){
	    	alert(response.statusText+"********"+response.status);
	    });
	 $('#saveAmenityServiceTypeMasterType').removeAttr('disabled');
	    return false; 
});			 
			 
			 
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/

function listAllAmenityServiceTypeMaster(){
	$('#addAmenityServiceTypeMaster').html();
	$('#listAmenityServiceTypeMaster').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../amenityServiceTypeMaster/list.htm",
        dataType: "json",
   		success: function(response){
   			$('#successAmenityServiceTypeMasterDiv').hide();
   			$('#errorAmenityServiceTypeMasterDiv').hide();
   			$('#amenityServiceTypeMasterType-Error').removeClass('has-error has-feedback');
   			$('#addAmenityServiceTypeMasterForm').trigger("reset");
   			var tempHtml = listAmenityServiceTypeMasterResponse(response);	
   			$('#listAmenityServiceTypeMaster').append(tempHtml);
   			$('#listAmenityServiceTypeMasterTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listAmenityServiceTypeMasterResponse(response){
	$('#listAmenityServiceTypeMaster').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllAmenityServiceTypeMasterForm">';
		html+='<div>';
		html+='<input type="button" class="btn btn-success"  onclick="editAmenityServiceTypeMaster()" value="Edit">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deleteAmenityServiceTypeMaster()" value="Delete">';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessAmenityServiceTypeMaster"><strong>Record(s) Deleted Successfully</strong></div>';
		html+= "<table class='table table-striped table-bordered' id='listAmenityServiceTypeMasterTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllAmenityServiceTypeMasterChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Industry Amenity Id</th>";
		html+=				"<th>Amenity Source Type Name</th>";
		html+=				"<th>Amenity Description</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listAllAmenityServiceTypeMaster;
		if(list.length>0){console.log(list);
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='amenityServiceTypeMasterChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].industryAmenityName+"</td>";	
				html+=			"<td>"+list[i].amenityServiceTypeName+"</td>";	
				html+=			"<td>"+list[i].amenityTypeDescription+"</td>";
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listAmenityServiceTypeMaster').empty();
		return html;
}

/********************************************************************************************************************************************
 ****************************D e l e t e******************************************************************************************************
 **********************************************************************************************************************************************/   
 function deleteAmenityServiceTypeMaster(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $('#loadMaskDiv').mask("Loading...");
			  $.get("../amenityServiceTypeMaster/delete.htm?ids="+selectedCheckBoxes,function(response){
				  if(response.status=="DELETE_SUCCESS"){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   var tempHtml = listAmenityServiceTypeMasterResponse(response);
					   $('#listAmenityServiceTypeMaster').append(tempHtml);
			   		   $('#listAmenityServiceTypeMasterTable').dataTable({ responsive: true});
			   		   $('#deleteSuccessAmenityServiceTypeMaster').show(600);
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
 $(document).on('click',"#selectAllAmenityServiceTypeMasterChkBox",function(){
       $('.amenityServiceTypeMasterChkBox').prop('checked', $(this).is(':checked'));
     });

 $(document).on('click',".amenityServiceTypeMasterChkBox",function(){
       if($('.amenityServiceTypeMasterChkBox:checked').length == $('.amenityServiceTypeMasterChkBox').length) {
         $('#selectAllAmenityServiceTypeMasterChkBox').prop('checked', true);
       }
       else {
         $('#selectAllAmenityServiceTypeMasterChkBox').prop('checked', false);
       }
 });
 
 
 
 function checkBoxLength(){
   	if($('.amenityServiceTypeMasterChkBox:checked').length) {
   		selectedCheckBoxes =[];
           $('.amenityServiceTypeMasterChkBox:checked').each(function() {
             selectedCheckBoxes.push($(this).val());
           });
         }
   	return false;
   }

 
 /********************************************************************************************************************************************
 **********************E d i t****************************************************************************************************************
 **********************************************************************************************************************************************/    
  function editAmenityServiceTypeMaster(){
 	$('#editAmenityServiceTypeMasterDiv').html('');
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
   		 $('#deleteSuccessAmenityServiceTypeMaster').hide(600);
   		 $.get("../amenityServiceTypeMaster/edit.htm?id="+selectedCheckBoxes,function(response){
   			 $('#editAmenityServiceTypeMasterDiv').append(response);
 				$('#editAmenityServiceTypeMasterModal').modal('show');
 				$('#successAmenityServiceTypeMasterDiv').hide();
 	   			$('#errorAmenityServiceTypeMasterDiv').hide();
 	   			$('#amenityServiceTypeMasterType-Error').removeClass('has-error has-feedback');
 	   			$('#addAmenityServiceTypeMasterForm').trigger("reset");
 				selectedCheckBoxes.pop(selectedCheckBoxes);
 				$('#loadMaskDiv').unmask();
   		 }).fail(function(response){
   			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
   		 });
   	
   		}
   		
   }
   $('#editAmenityServiceTypeMasterForm').unbind('submit').bind('submit',function() {
 	  $('#loadMaskDiv').mask('Loading...');
 		$('#updateErrorAmenityServiceTypeMasterDiv').hide();
 		$('#Edit-PoiType-Error').removeClass('has-error has-feedback');
		$('.help-inline').html('');
		var editamenityServiceTypeNameList = $.trim($('#editamenityServiceTypeNameList').val());
 		var editedamenityServiceTypeMasterType = $.trim($('#editedamenityServiceTypeMasterType').val());
 		var editedAmenityServiceTypeMasterTypeDescription = $.trim($('#editedAmenityServiceTypeMasterTypeDescription').val());
 		var JSONObject = {};
 		//JSONObject['industryAmenityName'] = editamenityServiceTypeNameList;
 		JSONObject['amenityServiceTypeName'] = editedamenityServiceTypeMasterType;
 		JSONObject['amenityTypeDescription'] = editedAmenityServiceTypeMasterTypeDescription;
 		JSONObject['id'] = $('#editedAmenityServiceTypeMasterId').val();
 		$.post("../amenityServiceTypeMaster/update.htm",JSONObject,function(response){console.log(response);
 			if(response.status=="UPDATE_ERROR"){
 				 $('#updateErrorAmenityServiceTypeMasterDiv').show(600);
 				 $('#Edit-AmenityServiceTypeMasterType-Error').addClass('has-error has-feedback');
 				 $('#Edit-amenityServiceTypeName-span-Error').html(response.errorMessage);
 				 $('#loadMaskDiv').unmask();
 			}else if(response.status=="UPDATE_SUCCESS"){
 				 alert("Record updated successfully");
 				 $('#editAmenityServiceTypeMasterModal').modal('hide');
 				listAllAmenityServiceTypeMaster();
 			}
 			
 		},'json').fail(function(response){
 			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
 			return false;
 		});
 		return false;
 	
   });
