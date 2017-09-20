/********************************************************************************************************************************************
***************************** A d d/S a v e***************************************************************************************************
**********************************************************************************************************************************************/
var selectedCheckBoxes = [];
var editedAmenityRatePlanId = "";
$('#addAmenityRatePlanForm').unbind('submit').bind('submit',function() {
	//$('#loadMaskDiv').mask("Loading...");
	 $('#errorAmenityRatePlanDiv').hide();
	 $('#errorAmenityRatePlanDiv').html('');
	 $('#successAmenityRatePlanDiv').hide();
	 $('.help-inline').html('');
	 $('#amenityRatePlanName-Error').removeClass('has-error has-feedback');
	 var JSONObject = {};
	 JSONObject['ratePlanName'] = $.trim($('#amenityRatePlanName').val());
	 JSONObject['planDescription'] = $.trim($('#amenityRatePlanTypeDescription').val());
	 $.post("../amenityRatePlan/save.htm",JSONObject,function(response){
		 
		// $('#amenityRatePlanType-Error').hide();
		// $('#loadMaskDiv').scrollTop("0");
		// $form.find('.form-group').removeClass('has-error has-feedback');
		//	$form.find('.help-inline').empty();
			if(response.status=="SAVE_ERROR"){
				 $('#successAmenityRatePlanDiv').hide;
				 $('#addAmenityRatePlanDiv').show(600);
				 $('#amenityRatePlanName-Error').addClass('has-error has-feedback');
				 $('#amenityRatePlanName-span-Error').html(response.errorMessage);
				// $('#addAmenityRatePlanForm').trigger("reset");
				 
			}else if(response.status=="SAVE_SUCCESS"){
				 $('#addAmenityRatePlanDiv').hide();
				 $('#successAmenityRatePlanDiv').show(600);
				 $('#addAmenityRatePlanForm').trigger("reset");
		 
		 }else{
			 alert(response.status);
		 }
		 $('#loadMaskDiv').unmask();
	 },'json').fail(function(response){
	    	alert(response.statusText+"********"+response.status);
	    });
	 $('#saveAmenityRatePlanType').removeAttr('disabled');
	    return false; 
});
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/

function listAllAmenityRatePlan(){
	$('#addAmenityRatePlan').html();
	$('#listAmenityRatePlan').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../amenityRatePlan/list.htm",
        dataType: "json",
   		success: function(response){
   			$('#successAmenityRatePlanDiv').hide();
   			$('#errorAmenityRatePlanDiv').hide();
   			$('#amenityRatePlanType-Error').removeClass('has-error has-feedback');
   			$('#addAmenityRatePlanForm').trigger("reset");
   			var tempHtml = listAmenityRatePlanResponse(response);	
   			$('#listAmenityRatePlan').append(tempHtml);
   			$('#listAmenityRatePlanTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listAmenityRatePlanResponse(response){
	$('#listAmenityRatePlan').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllAmenityRatePlanForm">';
		html+='<div class ="table-responsive">';
		html+='<input type="button" class="btn btn-success"  onclick="editAmenityRatePlan()" value="Edit">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deleteAmenityRatePlans()" value="Delete">';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessAmenityRatePlan"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong>Record(s) Deleted Successfully</strong></div>';
		html+= "<table class='table table-striped table-bordered' id='listAmenityRatePlanTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllAmenityRatePlanChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Rate Plan Name</th>";
		html+=				"<th>Plan Description</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listAllAmenityRatePlan;
		console.log(list);
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='amenityRatePlanChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].ratePlanName+"</td>";	
				html+=			"<td>"+list[i].planDescription+"</td>";	
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listAmenityRatePlan').empty();
		return html;
}


/********************************************************************************************************************************************
 ****************************D e l e t e******************************************************************************************************
 **********************************************************************************************************************************************/   
 function deleteAmenityRatePlans(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $('#loadMaskDiv').mask("Loading...");
			  $.get("../amenityRatePlan/delete.htm?ids="+selectedCheckBoxes,function(response){
				  if(response.status=="DELETE_SUCCESS"){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   var tempHtml = listAmenityRatePlanResponse(response);
					   $('#listAmenityRatePlan').append(tempHtml);
			   		   $('#listAmenityRatePlanTable').dataTable({ responsive: true});
			   		   $('#deleteSuccessAmenityRatePlan').show(600);
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
 $(document).on('click',"#selectAllAmenityRatePlanChkBox",function(){
       $('.amenityRatePlanChkBox').prop('checked', $(this).is(':checked'));
     });

 $(document).on('click',".amenityRatePlanChkBox",function(){
       if($('.amenityRatePlanChkBox:checked').length == $('.amenityRatePlanChkBox').length) {
         $('#selectAllAmenityRatePlanChkBox').prop('checked', true);
       }
       else {
         $('#selectAllAmenityRatePlanChkBox').prop('checked', false);
       }
 });
 
 
 
 function checkBoxLength(){
   	if($('.amenityRatePlanChkBox:checked').length) {
   		selectedCheckBoxes =[];
           $('.amenityRatePlanChkBox:checked').each(function() {
             selectedCheckBoxes.push($(this).val());
           });
         }
   	return false;
   }
 
 
 /********************************************************************************************************************************************
 **********************E d i t****************************************************************************************************************
 **********************************************************************************************************************************************/    
   function editAmenityRatePlan(){
 	$('#editAmenityRatePlanDiv').html('');
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
   		 $('#deleteSuccessAmenityRatePlan').hide(600);
   		 $.get("../amenityRatePlan/edit.htm?id="+selectedCheckBoxes,function(response){
   			 $('#editAmenityRatePlanDiv').append(response);
 				$('#editAmenityRatePlanModal').modal('show');
 				$('#successAmenityRatePlanDiv').hide();
 	   			$('#errorAmenityRatePlanDiv').hide();
 	   			$('#amenityRatePlanType-Error').removeClass('has-error has-feedback');
 	   			$('#addAmenityRatePlanForm').trigger("reset");
 				selectedCheckBoxes.pop(selectedCheckBoxes);
 				$('#loadMaskDiv').unmask();
   		 }).fail(function(response){
   			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
   		 });
   	
   		}
   		
   }
   $('#editAmenityRatePlanForm').unbind('submit').bind('submit',function() {
 	  $('#loadMaskDiv').mask('Loading...');
 		$('#updateErrorAmenityRatePlanDiv').hide();
 		$('#Edit-AmenityRatePlanName-Error').removeClass('has-error has-feedback');
 		//$('#updateErrorAmenityRatePlanDiv').html('');
 		$('.help-inline').html('');
 		var editedamenityRatePlanType = $.trim($('#editedamenityRatePlanType').val());
 		var editedAmenityRatePlanTypeDescription = $.trim($('#editedAmenityRatePlanTypeDescription').val());
 		var JSONObject = {};
 		JSONObject['ratePlanName'] = editedamenityRatePlanType;
 		JSONObject['planDescription'] = editedAmenityRatePlanTypeDescription;
 		JSONObject['id'] = $('#editedAmenityRatePlanId').val();
 		$.post("../amenityRatePlan/update.htm",JSONObject,function(response){
 			if(response.status=="UPDATE_ERROR"){
 				 $('#updateErrorAmenityRatePlanDiv').show(600); 
 				$('#Edit-AmenityRatePlanName-Error').addClass('has-error has-feedback');
 				  $('#Edit-amenityRatePlanName-span-Error').html(response.errorMessage);
 				 $('#loadMaskDiv').unmask();
 			}else if(response.status=="UPDATE_SUCCESS"){
 				 $('#Edit-AmenityRatePlanName-Error').removeClass('has-error has-feedback');
 				 alert("Record updated successfully");
 				 $('#editAmenityRatePlanModal').modal('hide');
 				listAllAmenityRatePlan();
 			}
 			
 		},'json').fail(function(response){
 			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
 			return false;
 		});
 		return false;
 	
   });
