var uploadeReviewFilePath = "";
function uploadReviewExcel(){
	loading();
	  var uploadReviewExcel = new FormData();
	  uploadReviewExcel.append("file", fileData.files[0]);
	  console.log(uploadReviewExcel);
	  $('#uploadReviewSpanError').empty();
	  $('#uploadReviewSpanButton').empty();
	  $('#uploadReviewSuccessDiv').hide();
	  $('#uploadReviewErrorDiv').hide();
	  $('#uploadReviewInfoDiv').hide();
	  $.ajax({
	    url: "../uploadReviewExcel/excelUpload.htm",
	    data: uploadReviewExcel,
	    dataType: 'json',
	    processData: false,
	    contentType: false,
	    type: 'POST',
	    success: function(response){
	    	unload();
	    	$("#fileData").val(""); 
	    	$('#uploadReviewErrorDiv').html('');
	    	$('#downloadGeneralKpiMaster').removeAttr('disabled');
	    	if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' ||  response.status=="INVALID_EXCEL" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
	    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
	    		$('#uploadReviewErrorDiv').append(html);
	    		$('#uploadReviewErrorDiv').show(600);
	    		if(response.status=="EXCEL_UPLOAD_ERROR"){
	    			console.log(response);
	    			$('#uploadReviewErrorDiv').hide();
	    			$('#downloadGeneralKpiMaster').attr('disabled','disabled');
	    			uploadeReviewFilePath = response.successObject.reviewErrorsExcelPath;
		    		//var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadGeneralKpiErrorsExcelButton" onclick="downloadGeneralKpiErrorsExcel()" value="Download Excel"><br>';
	    			html = 	'<div class="alert alert-danger alert-error" style="margin-top: 48px;" id="uploadReviewErrorDiv">&nbsp;<img alt="../" src="../resources/images/error.jpg"> Excel Upload Error.<a onclick="downloadGeneralKpiErrorsExcel()">Please click here to Download Excel And Try Again</a></div>';
	    			$('#uploadReviewSpanButton').html(html);
		    		$('#uploadReviewInfoDiv').show(600);
		    		$('#uploadIndustryKpiInfoDiv').show(600);
	    		}
	    	}else if(response.status=="UPLOAD_SUCCESS"){
	    		$('#uploadReviewSuccessDiv').show(600);
	    		$('#downloadGeneralKpiMaster').removeAttr('disabled');
	    	}
	    	else if(response.status=="EXCEPTION_ERROR"){
	    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
	    		$('#uploadReviewErrorDiv').append(html);
	    		$('#uploadReviewErrorDiv').show(600);
	    		$('#loadMaskDiv').unmask();
	    	}
	    	
	    },error:function(response){
	    	$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	    	unload();
	    }
	  });
	return false;
}

function downloadGeneralKpiErrorsExcel(){
	redirectView(uploadeReviewFilePath);
}
