function enterPasswordFormClick(){
	$('#editAmenityManagementDiv').html('');
	$("#clientSubscritionFeatureMapping").modal('show');
	
	 $.ajax({
   		type: "get",
   		url: "../abc/sendEmail/add.htm",
        dataType: "json",
   		success: function(response){
   			$('#passAmenityManagementModal').modal('show');
   			var tempHtml = listPoiResponse(response);	
   			$('#editAmenityManagementDiv').append(tempHtml);
   			return false;
	   	},
        error: function(response){
        	alert(response.status+","+response.statusText);
        	return false;
           }
     });
}

function listPoiResponse(response){
	$('#editAmenityManagementDiv').html('');
		var html = "";
		html+="<hr>";
		html+='<input type="button" class="btn btn-success"  onclick="editPlaceOfInterest()" value="Edit">&nbsp';
		html+=' <input type="button" class="btn btn-danger"  onclick="deletePlaceOfInterests()" value="Delete">';
		html+='</div><br>';
		html+= 		"<thead>";
		html+= 			"<tr>";
		html+=			"</tr>";
		html+= 		"</thead>";
		html+=			"<tbody>";
		
		html+=			"</tbody>";
		html+= "</table>";
		html+="</form>";
		$('#editAmenityManagementDiv').empty();
		return html;
}






/*function enterPasswordFormClick(){alert("stage1");
 	$('#editAmenityManagementDiv').html('');
   		
   		 $.get("../abc/sendEmail/add.htm",function(response){console.log(response);
   			 $('#editAmenityManagementDiv').append(response);
 				$('#passAmenityManagementModal').modal('show');
 				$('#successAmenityManagementDiv').hide();
 	   			$('#errorAmenityManagementDiv').hide();
 	   			$('#amenityManagementType-Error').removeClass('has-error has-feedback');
 	   			$('#addAmenityManagementForm').trigger("reset");
 	   		$('#passAmenityManagementModal').modal('show');
 				
   		 }).fail(function(response){
   			 $('#loadMaskDiv').html(response.status+"***********"+response.statusText);alert("@2");
   		 });
   	
   		}
   		
   */