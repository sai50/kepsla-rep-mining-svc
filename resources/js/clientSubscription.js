/********************************************************************************************************************************************
***************************** A d d/S a v e***************************************************************************************************
**********************************************************************************************************************************************/
var selectedCheckBoxes = [];
var editedClientSubscriptionId = "";
$('#addClientSubscriptionForm').unbind('submit').bind('submit',function() {
	$('#loadMaskDiv').mask("Loading...");
	 $('#errorClientSubscriptionDiv').hide();
	 $('#errorClientSubscriptionDiv').html('');
	 $('#successClientSubscriptionDiv').hide();
	 var JSONObject = {};
	 JSONObject['subscriptionName'] = $.trim($('#clientSubscriptionName').val());
	 JSONObject['subscriptionDescription'] = $.trim($('#clientSubscriptionDescription').val());
	 JSONObject['maxNumberOfUsers'] = $.trim($('#clientSubscriptionUsers').val());
	 JSONObject['discountFee'] = $.trim($('#clientSubscriptiondiscountFee').val());
	 JSONObject['subscriptionFee'] = $.trim($('#clientSubscriptionTotalFee').val());
	
	 $.post("../clientSubscription/save.htm",JSONObject,function(response){
		 alert(response);
		 if(response.status=="SAVE_ERROR"){
			 $('#successClientSubscriptionDiv').hide();
			 $('#errorClientSubscriptionDiv').append('<strong>'+response.errorMessage+'</strong>');
			 $('#errorClientSubscriptionDiv').show(600);
			 $('#clientSubscriptionType-Error').addClass('has-error has-feedback');
		 }else if(response.status=="SAVE_SUCCESS"){
			 $('#errorClientSubscriptionDiv').hide();
			 $('#successClientSubscriptionDiv').show(600);
			 $('#clientSubscriptionType-Error').removeClass('has-error has-feedback');
			 $('#addClientSubscriptionForm').trigger("reset");
		 }else{
			 alert(response.status);
		 }
		 $('#loadMaskDiv').unmask();
	 },'json').fail(function(response){
	    	alert(response.statusText+"********"+response.status);
	    });
	 $('#saveClientSubscriptionType').removeAttr('disabled');
	    return false; 
});
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/

function listAllClientSubscription(){
	
	$('#addClientSubscription').html();
	$('#listAllClientSubscription').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../clientSubscription/list.htm",
        dataType: "json",
   		success: function(response){
   			$('#successClientSubscriptionDiv').hide();
   			$('#errorClientSubscriptionDiv').hide();
   			$('#ClientSubscriptionType-Error').removeClass('has-error has-feedback');
   			$('#addClientSubscriptionForm').trigger("reset");
   			var tempHtml = listClientSubscriptionResponse(response);	
   			$('#listAllClientSubscription').append(tempHtml);
   			$('#listClientSubscriptionTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listClientSubscriptionResponse(response){
	$('#listClientSubscription').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllClientSubscriptionForm">';
		html+='<div class ="table-responsive">';
		html+='<input type="button" class="btn btn-success"  onclick="editClientSubscription()" value="Edit">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deleteClientSubscription()" value="Delete">';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessClientSubscription"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong>Record(s) Deleted Successfully</strong></div>';
		html+= "<table class='table table-striped table-bordered' id='listClientSubscriptionTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllClientSubscriptionChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Subscription Type Name</th>";
		html+=				"<th>TotalCost</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listAllClientSubscription;

		if(list.length>0){
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='clientSubscriptionChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].subscriptionName+"</td>";	
				html+=			"<td>"+list[i].discountFee+"</td>";	
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listClientSubscription').empty();
		return html;
}

/********************************************************************************************************************************************
 ****************************D e l e t e******************************************************************************************************
 **********************************************************************************************************************************************/   
 function deleteClientSubscription(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $('#loadMaskDiv').mask("Loading...");
			  $.get("../clientSubscription/delete.htm?ids="+selectedCheckBoxes,function(response){
				  if(response.status=="DELETE_SUCCESS"){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   var tempHtml = listClientSubscriptionResponse(response);
					   $('#listClientSubscription').append(tempHtml);
			   		   $('#listClientSubscriptionTable').dataTable({ responsive: true});
			   		   $('#deleteSuccessClientSubscription').show(600);
			   		  $('#loadMaskDiv').unmask();
			   		listAllClientSubscription();
			   		
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
 $(document).on('click',"#selectAllClientSubscriptionChkBox",function(){
       $('.clientSubscriptionChkBox').prop('checked', $(this).is(':checked'));
     });

 $(document).on('click',".clientSubscriptionChkBox",function(){
       if($('.clientSubscriptionChkBox:checked').length == $('.clientSubscriptionChkBox').length) {
         $('#selectAllClientSubscriptionChkBox').prop('checked', true);
       }
       else {
         $('#selectAllClientSubscriptionChkBox').prop('checked', false);
       }
 });
 
 
 
 function checkBoxLength(){
   	if($('.clientSubscriptionChkBox:checked').length) {
   		selectedCheckBoxes =[];
           $('.clientSubscriptionChkBox:checked').each(function() {
             selectedCheckBoxes.push($(this).val());
           });
         }
   	return false;
   }
 
 
 /********************************************************************************************************************************************
 **********************E d i t****************************************************************************************************************
 **********************************************************************************************************************************************/    
   function editClientSubscription(){
 	$('#editClientSubscriptionDiv').html('');
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
   		 $('#deleteSuccessClientSubscription').hide(600);
   		 $.get("../clientSubscription/edit.htm?id="+selectedCheckBoxes,function(response){
   			 $('#editClientSubscriptionDiv').append(response);
 				$('#editClientSubscriptionModal').modal('show');
 				$('#successClientSubscriptionDiv').hide();
 	   			$('#errorClientSubscriptionDiv').hide();
 	   			$('#clientSubscriptionType-Error').removeClass('has-error has-feedback');
 	   			$('#addClientSubscriptionForm').trigger("reset");
 				selectedCheckBoxes.pop(selectedCheckBoxes);
 				$('#loadMaskDiv').unmask();
   		 }).fail(function(response){
   			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
   		 });
   	
   		}
   		
   }
   $('#editClientSubscriptionForm').unbind('submit').bind('submit',function() {
 	  $('#loadMaskDiv').mask('Loading...');
 		$('#updateErrorClientSubscriptionDiv').hide();
 		$('#updateErrorClientSubscriptionDiv').html('');
 		var editedClientSubscriptionType = $.trim($('#editedClientSubscriptionType').val());
 		var editedclientSubscriptiondiscountFee = $.trim($('#editedclientSubscriptiondiscountFee').val());
 		var JSONObject = {};
 		JSONObject['subscriptionName'] = editedClientSubscriptionType;
 		JSONObject['discountFee'] = editedclientSubscriptiondiscountFee;
 		JSONObject['id'] = $('#editedClientSubscriptionId').val();
 		$.post("../clientSubscription/update.htm",JSONObject,function(response){
 			if(response.status=="UPDATE_ERROR"){
 				 $('#updateErrorClientSubscriptionDiv').append('<strong>'+response.errorMessage+'</strong>');
 				 $('#updateErrorClientSubscriptionDiv').show(600);
 				 $('#Edit-ClientSubscriptionType-Error').addClass('has-error has-feedback');
 				 $('#loadMaskDiv').unmask();
 			}else if(response.status=="UPDATE_SUCCESS"){
 				 $('#Edit-ClientSubscriptionType-Error').removeClass('has-error has-feedback');
 				 alert("Record updated successfully");
 				 $('#editClientSubscriptionModal').modal('hide');
 				listAllClientSubscription();
 			}
 			
 		},'json').fail(function(response){
 			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
 			return false;
 		});
 		return false;
 	
   });
