function industryExcelUpload()
{
	 $('#listGeneralAttributeTab').html('');
	
	$('#exportIndustryMasterTab').html('');
	$("#uploadExcel").html('');
	 $("#drop").html('');	
	 $("#listOfIndustryTypes").html('');

	//old tab div
	$("#dataTabOrg").html('');
	$("#editOrganizationType").html('');
	
	//Third Tab Data
	$("#organizationAttributeType").html('');
	$("#dataTableOrganizationAttribute").html('');
	$("#addOrganizationAttributes").html('');
    $("#addOrganizationAttribute").html('');
    $("#addDepartmentAttributes").html('');
    $("#addDepartmentAttribute").html('');
    $("#editOrganizationAttributeType").html('');
    $("#editDepartmentAttributeType").html('');
	
    $("#add").html('');
	$("#dataTab").html('');
	$("#newIndustryType").html('');
	$("#listOfIndustryType").html('');
	$("#editIndustryType").html('');
	
	var html="";
	html+='<hr>';
	html+=	'<div class="col-sm-6">';
	html+=	'<h4 style="color: green;">Upload Industry Master</h4><hr>';
	html+='<div class="form-group" id="EditIndustry-Error">';
	html+='<div class="form-group"></div>';
	html+='<form id="uploadIndustryMaster" action="POST"  enctype="multipart/form-data">';
	
		/******************Success Div********************************/
	html+=	'<div class="alert alert-success" style="display: none;"	id="uploadIndustryMasterSuccessDiv">';
	html+=		'<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Industry Master Uploaded Successfully</strong>';
	html+=	'</div>';
	
	html+=	'<div class="alert alert-danger alert-error" style="display: none;"	id="errorMessage">';
	html+=	'</div>';
	
	
	html+=	'<input type="button" class="btn btn-info btn-xs" id="downloadIndustryMasters" onclick="downloadIndustryMaster()" value="Download Template"><br>';
	html+=	 '<span id="uploadIndustryMasterSpanError"></span><br>';
	html+=	 '<span id="uploadIndustryMasterSpanButton"></span><br>';
	html+=	'<p style="color:green">The system only accepts .xlsx and .xls extension</p>';
	html+=	'<input type="file" id="file" name="file"><br><input type="button" class="btn btn-primary btn-sm" value="Upload File..." onclick="uploadIndustryMasterExcel()"></input><br>';
	html+=	'</form>';
	html+=	'</div>';
	html+=	'</div>';
	html+=	'</div>';
	
   /* +'<input type="submit" value="Upload">'	*/

$("#uploadExcel").append(html);
$("#uploadExcel").show();

}



var uploadedIndustryMasterFilePath = "";
function uploadIndustryMasterExcel(){

	$('#loadMaskDiv').mask('Loading...');
	  var industryUploadForm = new FormData();
	  industryUploadForm.append("file", file.files[0]);
	  $('#uploadIndustryMasterSpanError').empty();
	  $('#uploadIndustryMasterSpanButton').empty();
	  $('#uploadIndustryMasterSuccessDiv').hide();
	  $('#errorMessage').hide();
	 
	  $.ajax({
	    url: '../industryTypeMaster/uploadFile.htm',
	    data: industryUploadForm,
	    dataType: 'json',
	    processData: false,
	    contentType: false,
	    type: 'POST',
	    success: function(response){
		console.log(response);
		$("#fileData").val("");
		$('#loadMaskDiv').unmask();
		$('#errorMessage').html('');
		$('#downloadIndustryMasters').removeAttr('disabled');
		
		if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' || response.status=="DUPLICATE" || response.status=="INVALID_EXCEL" || response.status=="EXCEL_DUPLICATE_ERROR"){
    		var html = '<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'</strong>';
    		$('#errorMessage').append(html);
    		$('#errorMessage').show(600);
    		if(response.status=="DUPLICATE" || response.status=="EXCEL_DUPLICATE_ERROR" || response.status=="UPLOAD_INDUSTRY_MASTER_EXCEL_ERROR"){
    			alert("hi");
    			$('#downloadIndustryMasters').attr('disabled','disabled');
    			uploadedIndustryMasterFilePath = response.successObject.uploadedFilePath;
	    		var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryMasterErrorsExcelButton" onclick="downloadIndustryMasterErrorsExcel()" value="Download Excel"><br>';
	    		$('#uploadIndustryMasterSpanButton').html(html);
	    		$('#downloadGeneralIndustryMaster').removeAttr('disabled');
    		}
    	}else if(response.status=="UPLOAD_SUCCESS"){
    		$('#uploadIndustryMasterSuccessDiv').show(600);
    	}
    	else if(response.status=="EXCEPTION_ERROR"){
    		$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
    	}
    	
    },error:function(response){
    	$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
    }
  });
return false;	
	  
	    }
	  


function downloadIndustryMaster(){
	window.location.href = "../industryTypeMaster/downloadIndustryMaster.htm";
	return false;
}




/***************************************************************************************************************************
 *********************************Export Excel******************************************************************************
 **************************************************************************************************************************/
function exportIndustryMaster(){
	$("#uploadExcel").hide();
	 $("#drop").hide();	
	 $("#listOfIndustryTypes").hide();

	//old tab div
	$("#dataTabOrg").hide();
	$("#editOrganizationType").hide();
	
	//Third Tab Data
	$("#organizationAttributeType").hide();
	$("#dataTableOrganizationAttribute").hide();
	$("#addOrganizationAttributes").hide();
   $("#addOrganizationAttribute").hide();
   $("#addDepartmentAttributes").hide();
   $("#addDepartmentAttribute").hide();
   $("#editOrganizationAttributeType").hide();
   $("#editDepartmentAttributeType").hide();
   
   $('#listGeneralAttributeTab').html('');
	
   $("#add").hide();
	$("#dataTab").hide();
	$("#newIndustryType").hide();
	$("#listOfIndustryType").hide();
	$("#editIndustryType").hide();
	$('#exportIndustryMasterTab').html('');
	
	var exportGeneralIndustryMasterButton = '<hr><input type="button" class="btn btn-info btn-xs" onclick=exportIndustryMasterLink() value="Export Industry Master">';
	$('#exportIndustryMasterTab').append(exportGeneralIndustryMasterButton,"<hr>");
}

function exportIndustryMasterLink(){
	window.location.href = "../industryTypeMaster/exportIndustryMasterList.htm";
	return false;
}


/***************************************************************************************************************************
 *********************************Upload Excel******************************************************************************
 **************************************************************************************************************************/

function downloadIndustryMasterErrorsExcel(){
	window.location.href = uploadedIndustryMasterFilePath;
}






