/********************************************************************************************************************************************
***************************** A d d/S a v e***************************************************************************************************
**********************************************************************************************************************************************/
var selectedCheckBoxes = [];
var editedPoiId = "";
$('#addPoiForm').unbind('submit').bind('submit',function() {
	$('#loadMaskDiv').mask("Loading...");
	 $('#addPoiErrorDiv').hide();
	 $('#successPoiDiv').hide();
	 $('.help-inline').html('');
	 $('#poiType-Error').removeClass('has-error has-feedback');
	 var JSONObject = {};
	 JSONObject['poiType'] = $.trim($('#poiType').val());
	 JSONObject['poiTypeDescription'] = $.trim($('#poiTypeDescription').val());
	 $.post("../placeOfInterest/save.htm",JSONObject,function(response){
		 if(response.status=="SAVE_ERROR"){
			 $('#successPoiDiv').hide();
			 $('#addPoiErrorDiv').show(600);
			 $('#poiType-Error').addClass('has-error has-feedback');
			 $('#poiType-span-Error').html(response.errorMessage);
		 }else if(response.status=="SAVE_SUCCESS"){
			 $('#addPoiErrorDiv').hide();
			 $('#successPoiDiv').show(600);
			 $('#addPoiForm').trigger("reset");
		 }else{
			 alert(response.status);
		 }
		 $('#loadMaskDiv').unmask();
	 },'json').fail(function(response){
	    	alert(response.statusText+"********"+response.status);
	    });
	 $('#savePoiType').removeAttr('disabled');
	    return false; 
});
/********************************************************************************************************************************************
**************************L i s t************************************************************************************************************
**********************************************************************************************************************************************/

function listAllPOI(){
	$('#addPoi').html();
	$('#listPoi').html('');
	$('#loadMaskDiv').mask('Loading...');
	 $.ajax({
   		type: "get",
   		url: "../placeOfInterest/list.htm",
        dataType: "json",
   		success: function(response){
   			$('#successPoiDiv').hide();
   			$('#errorPoiDiv').hide();
   			$('#poiType-Error').removeClass('has-error has-feedback');
   			$('#addPoiForm').trigger("reset");
   			var tempHtml = listPoiResponse(response);	
   			$('#listPoi').append(tempHtml);
   			$('#listPoiTable').dataTable({ responsive: true});
   			$('#loadMaskDiv').unmask();
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listPoiResponse(response){
	$('#listPoi').html('');
		var html = "";
		html+="<hr>";
		html+='<form class="form-horizontal" id="listAllPoiForm">';
		html+='<div class ="table-responsive">';
		html+='<input type="button" class="btn btn-success"  onclick="editPlaceOfInterest()" value="Edit">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deletePlaceOfInterests()" value="Delete">';
		html+='</div><br>';
		html+='<div class="alert alert-success" style="display:none;"id="deleteSuccessPoi"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong>Record(s) Deleted Successfully</strong></div>';
		html+= "<table class='table table-striped table-bordered' id='listPoiTable'>";
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=				"<th style='width:60px;'><input type='checkbox' id='selectAllPoiChkBox' style='margin-left:24px;'/></th>";
		html+=				"<th>Poi Type</th>";
		html+=				"<th>Poi Description</th>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		var list = response.successObject.listAllPlaceOfInterest;
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				html+=			"<tr>";
				html+=			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+list[i].id+"'/></td>";	
				html+=			"<td>"+list[i].poiType+"</td>";	
				html+=			"<td>"+list[i].poiTypeDescription+"</td>";	
				html+=			"</tr>";
				}
		}else{
			
		}
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#listPoi').empty();
		return html;
}
/********************************************************************************************************************************************
**********************E d i t****************************************************************************************************************
**********************************************************************************************************************************************/    
  function editPlaceOfInterest(){
	$('#editPlaceOfInterestDiv').html('');
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
  		 $('#deleteSuccessPoi').hide(600);
  		 $.get("../placeOfInterest/edit.htm?id="+selectedCheckBoxes,function(response){
  			 $('#editPlaceOfInterestDiv').append(response);
				$('#editPlaceOfInterestModal').modal('show');
				$('#successPoiDiv').hide();
	   			$('#errorPoiDiv').hide();
	   			$('#poiType-Error').removeClass('has-error has-feedback');
	   			$('#addPoiForm').trigger("reset");
				selectedCheckBoxes.pop(selectedCheckBoxes);
				$('#loadMaskDiv').unmask();
  		 }).fail(function(response){
  			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);
  		 });
  	
  		}
  		
  }
  $('#editPoiForm').unbind('submit').bind('submit',function() {
	  $('#loadMaskDiv').mask('Loading...');
		$('#editPoiErrorDiv').hide();
		$('#Edit-PoiType-Error').removeClass('has-error has-feedback');
		$('.help-inline').html('');
		var editedPoiType = $.trim($('#editedpoiType').val());
		var editedPoiTypeDescription = $.trim($('#editedPoiTypeDescription').val());
		var JSONObject = {};
		JSONObject['poiType'] = editedPoiType;
		JSONObject['poiTypeDescription'] = editedPoiTypeDescription;
		JSONObject['id'] = $('#editedPoiId').val();
		$.post("../placeOfInterest/update.htm",JSONObject,function(response){
			if(response.status=="UPDATE_ERROR"){
				 $('#editPoiErrorDiv').show(600);
				 $('#Edit-PoiType-Error').addClass('has-error has-feedback');
				 $('#Edit-poiType-span-Error').html(response.errorMessage);
				 $('#loadMaskDiv').unmask();
			}else if(response.status=="UPDATE_SUCCESS"){
				 alert("Record updated successfully");
				 $('#editPlaceOfInterestModal').modal('hide');
				listAllPOI();
			}
			
		},'json').fail(function(response){
			$('#loadMaskDiv').mask(response.status+"****************"+response.statusText);
			return false;
		});
		return false;
	
  });
  /********************************************************************************************************************************************
  ****************************D e l e t e******************************************************************************************************
  **********************************************************************************************************************************************/   
  function deletePlaceOfInterests(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $('#loadMaskDiv').mask("Loading...");
			  $.get("../placeOfInterest/delete.htm?ids="+selectedCheckBoxes,function(response){
				  if(response.status=="DELETE_SUCCESS"){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   var tempHtml = listPoiResponse(response);
					   $('#listPoi').append(tempHtml);
			   		   $('#listPoiTable').dataTable({ responsive: true});
			   		   $('#deleteSuccessPoi').show(600);
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
  $(document).on('click',"#selectAllPoiChkBox",function(){
        $('.poiChkBox').prop('checked', $(this).is(':checked'));
      });

  $(document).on('click',".poiChkBox",function(){
        if($('.poiChkBox:checked').length == $('.poiChkBox').length) {
          $('#selectAllPoiChkBox').prop('checked', true);
        }
        else {
          $('#selectAllPoiChkBox').prop('checked', false);
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
