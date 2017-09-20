/********************************************************************************************************************************************
***************************** A d d/S a v e***************************************************************************************************
**********************************************************************************************************************************************/
var selectedCheckBoxes = [];
var editedManageSourceId = "";
$('#addManageSourceForm').unbind('submit').bind('submit',function() {
	$('#loadMaskDiv').mask("Loading...");
	 $('#errorManageSourceDiv').hide();
	 $('#successManageSourceDiv').hide();
	 $('#manageSourceName-Error').removeClass('has-error has-feedback');
	 $('#manageSourceUrl-Error').removeClass('has-error has-feedback');
	 var JSONObject = {};
	 JSONObject['sourceName'] = $.trim($('#manageSourceName').val());
	 JSONObject['sourceUrl'] = $.trim($('#manageSourceUrl').val());
	 JSONObject['sourceType'] = $.trim($('#manageSourceType').val());
	 $.post("../manageSource/save.htm",JSONObject,function(response){
		 if(response.status=="SAVE_ERROR"){
			 $('#successManageSourceDiv').hide();
			 $('#errorManageSourceDiv').show(600);
			 $('#manageSourceName-Error').addClass('has-error has-feedback');
			 $('#manageSourceName-span-Error').html(response.errorMessage);
			 $('#manageSourceUrl-span-Error').html(response.errorMessage);
			 
			 
		 }else if(response.status=="SAVE_SUCCESS"){
			 $('#errorManageSourceDiv').hide();
			 $('#successManageSourceDiv').show(600);
			 $('#addManageSourceForm').trigger("reset");
		 }else{
			 alert(response.status);
		 }
		 $('#loadMaskDiv').unmask();
	 },'json').fail(function(response){
	    	alert(response.statusText+"********"+response.status);
	    });
	 $('#saveManageSourceType').removeAttr('disabled');
	    return false; 
});
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/

function listAllManageSource(){
	$('#addManageSource').html();
	$('#listManageSource').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../manageSource/list.htm",
        dataType: "json",
   		success: function(response){
   			$('#successManageSourceDiv').hide();
   			$('#errorManageSourceDiv').hide();
   			$('#manageSourceType-Error').removeClass('has-error has-feedback');
   			$('#addManageSourceForm').trigger("reset");
   			var tempHtml = listManageSourceResponse(response);	
   			$('#listManageSource').append(tempHtml);
   			$('#listManageSourceTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listManageSourceResponse(response){
	$('#listManageSource').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllManageSourceForm">';
		html+='<div>';
		html+='<input type="button" class="btn btn-success"  onclick="editManageSource()" value="Edit">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deleteManageSource()" value="Delete">';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessManageSource"><strong>Record(s) Deleted Successfully</strong></div>';
		html+= "<table class='table table-striped table-bordered' id='listManageSourceTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllManageSourceChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Source Name</th>";
		html+=				"<th>Source Base Url</th>";
		html+=				"<th>Source Type</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listAllManageSource;
		if(list.length>0){
				
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='manageSourceChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].sourceName+"</td>";	
				html+=			"<td>"+list[i].sourceUrl+"</td>";	
				html+=			"<td>"+list[i].sourceType+"</td>";
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listManageSource').empty();
		return html;
}


/********************************************************************************************************************************************
 ****************************D e l e t e******************************************************************************************************
 **********************************************************************************************************************************************/   
 function deleteManageSource(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $('#loadMaskDiv').mask("Loading...");
			  $.get("../manageSource/delete.htm?ids="+selectedCheckBoxes,function(response){
				  if(response.status=="DELETE_SUCCESS"){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   var tempHtml = listManageSourceResponse(response);
					   $('#listManageSource').append(tempHtml);
			   		   $('#listManageSourceTable').dataTable({ responsive: true});
			   		   $('#deleteSuccessManageSource').show(600);
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
 $(document).on('click',"#selectAllManageSourceChkBox",function(){
       $('.manageSourceChkBox').prop('checked', $(this).is(':checked'));
     });

 $(document).on('click',".manageSourceChkBox",function(){
       if($('.manageSourceChkBox:checked').length == $('.manageSourceChkBox').length) {
         $('.selectAllManageSourceChkBox').prop('checked', true);
       }
       else {
         $('.selectAllManageSourceChkBox').prop('checked', false);
       }
 });
 function checkBoxLength(){
   	if($('.manageSourceChkBox:checked').length) {
   		selectedCheckBoxes =[];
           $('.manageSourceChkBox:checked').each(function() {
             selectedCheckBoxes.push($(this).val());
           });
         }
   	return false;
   }
 
 
 /********************************************************************************************************************************************
 **********************E d i t****************************************************************************************************************
 **********************************************************************************************************************************************/    
   function editManageSource(){
 	$('#editManageSourceDiv').html('');
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
   		 $('#deleteSuccessManageSource').hide(600);
   		 $.get("../manageSource/edit.htm?id="+selectedCheckBoxes,function(response){
   			 $('#editManageSourceDiv').append(response);
 				$('#editManageSourceModal').modal('show');
 				$('#successManageSourceDiv').hide();
 	   			$('#errorManageSourceDiv').hide();
 	   			$('#manageSourceType-Error').removeClass('has-error has-feedback');
 	   			$('#addManageSourceForm').trigger("reset");
 				selectedCheckBoxes.pop(selectedCheckBoxes);
 				$('#loadMaskDiv').unmask();
   		 }).fail(function(response){
   			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
   		 });
   	
   		}
   		
   }
   $('#editManageSourceForm').unbind('submit').bind('submit',function() {
	   alert("hi");
 	  $('#loadMaskDiv').mask('Loading...');
 		$('#updateErrorManageSourceDiv').hide();
 		$('#updateErrorManageSourceDiv').html('');
 		var editedManageSourceName = $.trim($('#editedManageSourceName').val());
 		var editedManageSourceUrl = $.trim($('#editedManageSourceUrl').val());
 		var editedManageSourceType = $.trim($('#editedManageSourceType').val());
 		var JSONObject = {};
 		JSONObject['sourceName'] = editedManageSourceName;
 		JSONObject['sourceUrl'] = editedManageSourceUrl;
 		JSONObject['sourceType'] = editedManageSourceType;
 		JSONObject['id'] = $('#editedManageSourceId').val();
 		
 		$.post("../manageSource/update.htm",JSONObject,function(response){
 			if(response.status=="UPDATE_ERROR"){
 				 $('#updateErrorManageSourceDiv').append('<strong>'+response.errorMessage+'</strong>');
 				 $('#updateErrorManageSourceDiv').show(600);
 				 $('#Edit-ManageSourceType-Error').addClass('has-error has-feedback');
 				 $('#loadMaskDiv').unmask();
 			}else if(response.status=="UPDATE_SUCCESS"){
 				 $('#Edit-ManageSourceType-Error').removeClass('has-error has-feedback');
 				 alert("Record updated successfully");
 				 $('#editManageSourceModal').modal('hide');
 				listAllManageSource();
 			}
 			
 		},'json').fail(function(response){
 			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
 			return false;
 		});
 		return false;
 	
   });

