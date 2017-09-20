$(document).ready(function() {
	$.ajaxSetup({
		cache : false
	});
});
var sourceMasterUrl = "../sourceMasterList/";
var selectedSourceMasterIds = [];

// *****Source Master Variables***************//
var sourceMasterDataDiv = $('#sourceMasterDataDiv');
// var sourceMasterTableId = $('#sourceMasterListTable');

// ************************************************List source
// Master**********************************//

function sourceMasterList() {
	$.ajaxSetup({
		cache : false
	});
	//$('#addSourceMasterSuccessDiv').html('');
	$('#addAndEditSourceMasterDiv').hide();
	$('#page-wrapper').mask('Loading...');
	sourceMasterDataDiv.html('');
	var selectedsourceType = $('#selectedSourceType').val();
	console.log(selectedsourceType);
	$.get(
			sourceMasterUrl + "listAll.htm?sourceType=" + selectedsourceType,
			function(response) {
				console.log("in response....");
				if (response.status == "LIST_SUCCESS") {
					var html = listSourceMasterHtml(response);
					sourceMasterDataDiv.append(html);
					$('#sourceMasterListTable').dataTable();
					$('#page-wrapper').unmask();
				} else {
					$('#page-wrapper').append(
							'<font style="color:red">' + response.errorMessage
									+ '</font>');
				}

			}, 'json').fail(
			function(response) {
				$('#page-wrapper').mask(
						response.status + "**********" + response.statusText);
			});
	return false;

}
function listSourceMasterHtml(response) {
	var sourceMasterList = response.successObject.sourceMasterList;
	console.log(sourceMasterList);
	var html = "";
	html += '<form id="sourceMasterListForm">';
	html += '<div class="alert alert-success" style="display:none;"id="addSourceMasterSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Group(s) Deleted Successfully</div>';
	html += '<div class="alert alert-success" style="display:none;"id="deleteSourceMasterSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Group(s) Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteSourceMasterErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='sourceMasterListTable'>";
	html += "<thead>";
	html += "<tr>";
	html += '<th><input type="checkbox" id="checkAllSourceMasterCheckBox" style="margin-left: 0px;"></th>';
	html += '<th>Source Name</th>';
	html += '<th>Source Base Url</th>';
	html += '<th>Source Type</th>';
	html += '<th>Source Popularity</th>';
	html += '<th>Max_Overall_Rating</th>';
	html += '<th>ReplyToReview</th>';
	html += '<th></th>';
	html += "</tr>";
	html += "</thead>";
	html += '<tbody>';
	for (var i = 0; i < sourceMasterList.length; i++) {
		var id = sourceMasterList[i].id;
		var sourceName = sourceMasterList[i].sourceName;
		var sourceBaseUrl = sourceMasterList[i].sourceBaseUrl;
		var sourceType = sourceMasterList[i].sourceType;
		var sourcePopularity = sourceMasterList[i].sourcePopularity;
		var maxOveralRatting = sourceMasterList[i].maxOverallRating;
		html += '<tr>';
		html += '<td><input type="checkBox" class="sourceMasterCheckBox" value='+ id + '></td>';
		html += '<td>' + sourceName + '</td>';
		html += '<td>' + sourceBaseUrl + '</td>';
		html += '<td>' + sourceType + '</td>';
		html += '<td>' + sourcePopularity + '</td>';
		html += '<td>' + maxOveralRatting + '</td>';
		if(sourceMasterList[i].directReplyFlag == 'Y'){
			html += '<td><input	type="checkbox" style="width: 20%" class="messageCheckbox"  checked/></td>';
		}else{
			html += '<td><input	type="checkbox" style="width: 20%" class="messageCheckbox"/></td>';
		}
		html += '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editSourceMaster('+ id+ ')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html += '</tr>';
	}
	html += '</tbody>';
	html += '</table>';
	html += '</form>';
	html += '<div id="addAndEditSourceMasterDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>';
	return html;
}
/*******************************************************************************
 * Add Source Master *
 ******************************************************************************/
function addSourceMaster() {
	$.ajaxSetup({
		cache : false
	});
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditSourceMasterDiv');
	$.get(sourceMasterUrl+"listSource.htm",function(response){
		//console.log("sourceTYpe list :"+JSON.stringify(response));
		var addMethod = addSourceMasterFormHtml(response);
		appendSourceMasterAddOrEditForm(divId, addMethod);// Method To Generate
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}
function addSourceMasterFormHtml(response) {
	var html = "";
	var divId = "addAndEditSourceMasterDiv";
	divId = "'" + divId + "'";
	appendDivId = "page-wrapper";
	appendDivId = "'" + appendDivId + "'";
	html += addFormHeading("Add Source");
	var sourceMaster = response.successObject.sourceTypeList;
	html += '<form class="col-sm-12" id="addSourceMasterForm">';

	/**
	 * ****************************************Error * Div****************************************************
	 */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addSourceMasterErrorDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/**
	 * ************************************Source  Name*****************************************************
	 */
	html += '<div class="form-group" id="Add-sourceName-Error">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="sourceName"  style="width: 50%" placeholder="Enter Source Name">';
	html += '</div>';

	/**
	 * ************************************Source Base Url*****************************************************
	 */
	html += '<div class="form-group" id="Add-sourceBaseUrl-Error">';
	html += '<label>Source Base Url<font style="color: red">* (http:// or https://)</font></label>';
	html += '<span style="color: #a94442" id="sourceBaseUrl-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" style="width: 50%" id="sourceBaseUrl" placeholder="Enter Source Base Url" >';
	html += '</div>';
	/**
	 * ************************************Source Type*****************************************************
	 */
	html += '<div class="form-group" id="Add-sourceType-Error">';
	html += '<label>Source Type<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="sourceType-span-Error" class="help-inline"></span>';
	html += '<select class="form-control" style="width:50%" name="sourceType" id="sourceType">';
	html += '<option value="">Select</option>';
	for (var i = 0; i < sourceMaster.length; i++) {
		html += '<option value='+sourceMaster[i].sourceType+'>'
				+ sourceMaster[i].sourceType
				+ '</option>';
	}
	html += '<option value="other">Other</option>';
	html += '</select>';
	html += '</div>';
	/**
	 * ************************************Source Popularity*****************************************************
	 */
	html += '<div class="form-group" id="Add-sourcePopularity-Error">';
	html += '<label>Source Popularity<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="sourcePopularity-span-Error" class="help-inline"></span>';
	html += '<span id="errorData" style="color: #a94442; display: none"> Invalid</span>';
	html += '<input	type="text" class="form-control" id="sourcePopularity" style="width: 50%" placeholder="Enter Source Popularity" maxlength="3" onkeypress="return IsNumeric(event);" ondrop="return false;" onpaste="return false;">';
	html += '</div>';

	/**
	 * ************************************Source max_overall_rating*****************************************************
	 */
	html += '<div class="form-group" id="Add-maxOverallRating-Error">';
	html += '<label>Source Max_Overall_Ratting<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="maxOverallRating-span-Error" class="help-inline"></span>';
	html += '<span id="errorData1" style="color: #a94442; display: none"> Invalid</span>';
	html += '<input	type="text" class="form-control" id="maxOverallRating" style="width: 50%" placeholder="Enter Source Maximum Overall Ratinng" maxlength="3" onkeypress="return IsNumeric1(event);" ondrop="return false;" onpaste="return false;">';
	html += '</div>';
	
	/**
	 * ************************************Respond to Review*****************************************************
	 */
	html += '<div class="form-group" id="Add-respondToReview-Error">';
	html += '<label>Respond to Review   </label>';
	html += '<span style="color: #a94442" id="respondToReview-span-Error" class="help-inline"></span>';
	html += '<span id="errorData1" style="color: #a94442; display: none"> Invalid</span>';
	html += '<input class="messageCheckbox" class="form-control" style="width: 20%" id="respondToReview" type="checkbox" value="true" name="respondToReview">'
	html += '</div>';
	
	/** **************************************Source Logo****************************************** */
	html += '<div class="form-group" id="Add-sourceLogo-Error">';
	html += '<label>Source Logo<font style="color: red">* 50(h) * 100(w)</font></label>';
	html += '<span style="color: #a94442" id="sourceLogo-span-Error" class="help-inline"></span>';
	html += '<input	type="file" name="files" id="files">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveSourceMaster()">&nbsp';
	html += '<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+ divId + ',' + appendDivId + ')">';
	html += '</form>';
	return html;
}
/**
 * *************************************SAVE SOURCE
 * MASTER*****************************
 */
function saveSourceMaster() {
	var addAndEditSourceMasterDiv = $('#addAndEditSourceMasterDiv');
	$.ajaxSetup({
		cache : false
	});// Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addSourceMasterSuccessDiv').hide();
	$('#addSourceMasterErrorDiv').hide();
	var other = "other";
	var sourceName = $.trim($('#sourceName').val());
	var sourceBaseUrl = $.trim($('#sourceBaseUrl').val());
	var sourceType = $.trim($('#sourceType').val());
	/*if (sourceType == "other") {
		sourceType = "";
	}*/
	console.log("source type:"+sourceType);
	var sourcePopularity = $.trim($('#sourcePopularity').val());
	//console.log("source polarity: "+sourcePopularity);
	var maxOverallRating = $.trim($('#maxOverallRating').val());
	var respondToReview ;
	
	if($('#respondToReview').is(":checked")){
		respondToReview = 'Y';
	}else{
		respondToReview = 'N';
	}
	
	var filename = files.files[0];
	//console.log("file data :"+filename);
	var formData = new FormData();
	formData.append("file",files.files[0]);
	formData.append("value",JSON.stringify({
		'sourceName' : sourceName,
		'sourceBaseUrl' : sourceBaseUrl,
		'sourceType' : sourceType,
		'sourcePopularity' : sourcePopularity,
		'maxOverallRating' : maxOverallRating,
		'directReplyFlag' : respondToReview
		
	}));
	console.log(formData);
	
	
	$.ajax({dataType : 'json',
		url : sourceMasterUrl+"save.htm",
		data : formData,
		type : "POST",
		enctype: 'application/x-www-form-urlencoded',
		processData: false, 
		contentType:false,
		success : function(response) {
			    	console.log(response);
			    	if (response.status == "SAVE_SUCCESS" ) {
						$('#addSourceMasterForm').trigger("reset");
						sourceMasterList();
						$('#addSourceMasterSuccessDiv').show(600);
						$('#addAndEditSourceMasterDiv').hide();
						$('#page-wrapper').unmask();
					} else if (response.status == "SAVE_ERROR" || response.status == "EMPTY_SOURCE_NAME" || response.status == "DUPLICATE_SOURCE_NAME" || response.status ==  "EMPTY_SOURCE_BASE_URL" || response.status ==  "INVALID_SOURCE_BASE_URL" ||  response.status == "EMPTY_SOURCE_SOURCELOGO" || response.status == "INVALID_SOURCELOGO" || response.status == "INVALID_SOURCELOGO_SIZE" || response.status == "EMPTY_SOURCE_TYPE") {
						scrollDown(addAndEditSourceMasterDiv);
						$('#addSourceMasterErrorDiv').show(600);
						for (var i = 0; i < response.errorMessageList.length; i++) {
							var fieldName = response.errorMessageList[i].fieldName;
							var errorMessage = response.errorMessageList[i].message;
							$('#Add-' + fieldName + '-Error').addClass('has-error has-feedback');
							$('#' + fieldName + '-span-Error').html(errorMessage);
						}
						$('#page-wrapper').unmask();
					} else if (response.status == "EXCEPTION_ERROR") {
						$('#page-wrapper').mask(response.errorMessage);
					}
			}});
		return false;
	
}

/********************** Edit Source****************************/
function editSourceMaster(id){
	$('#page-wrapper').mask('Loading...');
	console.log("id is "+id);
	var divId = $('#addAndEditSourceMasterDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(sourceMasterUrl+"edit.htm?id="+id,function(response){
		var html = editSourceMasterFormHtml(response);
		appendSourceMasterAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function editSourceMasterFormHtml(response){
	var sourceMaster = response.successObject.sourceMaster;
	var id = sourceMaster.id;
	var sourceName = sourceMaster.sourceName;
	var sourceBaseUrl = sourceMaster.sourceBaseUrl;
	var sourceType = sourceMaster.sourceType;
	var sourcePopularity = sourceMaster.sourcePopularity;
	var maxOverallRating = sourceMaster.maxOverallRating;
	var sourceLogoPath = sourceMaster.sourceLogoPath;
	console.log("source logo path ... "+sourceLogoPath);
	if(sourceLogoPath.indexOf("null") >= 0){
		sourceLogoPath = null;
	}else{
		var logoName = sourceLogoPath.split("/").pop();
		console.log("source logo  :"+sourceLogoPath);
	}
	var sourceList = response.successObject.sourceTypeList;
	var allSourceType = [];
	for(var i=0;i<sourceList.length;i++){
		allSourceType.push(sourceList[i].sourceType);
	}
	allSourceType.push("Other");
	if(sourceType == ""){
		allSourceType.pop("Other");
	}else{
		for(var i = allSourceType.length-1; i--;){
			if (allSourceType[i] === sourceType) allSourceType.splice(i, 1);
		}
	}
	
	console.log("filter array  :"+allSourceType);
	console.log("source type:"+sourceType);
	var html = "";
	
	var divId = "addAndEditSourceMasterDiv";
	divId = "'" + divId + "'";
	appendDivId = "page-wrapper";
	appendDivId = "'" + appendDivId + "'";
	html+=	'<form id="editSourceMasterForm">';
	html += '<h4>Edit Source Master</h4><hr>';
	/** ***********************************Sucess Div******************************************************** */
/*	html += '<div class="alert alert-success" style="display: none;"	id="editSourceMasterSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Source Master Updated Successfully</strong>';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editSourceMasterErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	/** ************************************Source Master Name***************************************************** */
	html += '<div class="form-group" id="Edit-sourceName-Error">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" disabled class="form-control" id="editSourceName" value="'+sourceName+'"  placeholder="Enter Source Name" maxlength="50" style="width: 50%">';
	html +=	'<input type="hidden" value='+id+' id="editSourceId">';
	html += '</div>';
	/** ************************************Source Base Url***************************************************** */
	html += '<div class="form-group" id="Edit-sourceBaseUrl-Error">';
	html += '<label>Source Base Url<font style="color: red">* (http:// or https://)</font></label>';
	html += '<span style="color: #a94442" id="edit-sourceBaseUrl-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="editSourceBaseUrl" value="'+sourceBaseUrl+'" placeholder="Enter Source Base Url" style="width: 50%">';
	html += '</div>';
	
	/** ************************************Source Type***************************************************** */
	html += '<div class="form-group" id="Edit-sourceType-Error">';
	html += '<label>Source Type<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourceType-span-Error" class="help-inline"></span>';
	
	html += '<select class="form-control" style="width:50%" name="editSourceType" id="editSourceType" style="width: 50%">';
	
	if(sourceType!==""){
		html += '<option selected value="'+sourceType+'">'+ sourceType+ '</option>';
		for (var i = 0; i < allSourceType.length; i++) {
			html += '<option value='+allSourceType[i]+' >'
			+ allSourceType[i]
			+ '</option>';
	}
	}else{
		html += '<option value="other" selected>other</option>';
		for (var i = 0; i < allSourceType.length; i++) {
			html += '<option value='+allSourceType[i]+' >'
			+ allSourceType[i]
			+ '</option>';
		}
			
	}
	
	html += '</select>';

	html += '</div>';
	
	/** ************************************Source Popularity***************************************************** */
	html += '<div class="form-group" id="Edit-sourcePopularity-Error">';
	html += '<label>Source Popularity<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-sourcePopularity-span-Error" class="help-inline"></span>';
	html += '<span id="errorData" style="color: #a94442; display: none"> Invalid</span>';
	html += '<input	type="text" class="form-control" id="editSourcePopularity" value="'+sourcePopularity+'" placeholder="Enter Source Popularity" onkeypress="return IsNumeric(event);" maxlength="3" onkeypress="return IsNumeric1(event);" ondrop="return false;" onpaste="return false;" style="width: 50%">';
	html += '</div>';
	
	/** ****************************************maxoveralRatting****************************************************** */
	html += '<div class="form-group" id="Edit-maxOverallRating-Error">';
	html += '<label>maxOverallRating<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-maxOverallRating-span-Error" class="help-inline"></span>';
	html += '<span id="errorData1" style="color: #a94442; display: none"> Invalid</span>';
	html += '<input	type="text" class="form-control" id="editmaxOverallRating" value="'+maxOverallRating+'" placeholder="Enter Max Overall Rating" maxlength="3" onkeypress="return IsNumeric1(event);" ondrop="return false;" onpaste="return false;" style="width: 50%">';
	html += '</div>';
	
	
	/**
	 * ************************************Respond to Review*****************************************************
	 */
	html += '<div class="form-group" id="Edit-respondToReview-Error">';
	html += '<label>Respond to Review<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-respondToReview-span-Error" class="help-inline"></span>';
	html += '<span id="errorData1" style="color: #a94442; display: none"> Invalid</span>';
	if(sourceMaster.directReplyFlag == 'Y'){
		html += '<input	type="checkbox" style="width: 20%" class="messageCheckbox" id="editrespondToReview" checked/>';
	}else{
		html += '<input	type="checkbox" style="width: 20%" class="messageCheckbox" id="editrespondToReview"/>';
	}

	html += '</div>';
	
	/** **************************************Source Logo****************************************** */
	html += '<div class="form-group" id="Edit-sourceLogo-Error">';
	html += '<label>Source Logo<font style="color: red">* 50(h) * 100(w) </font></label>';
	html += '<span style="color: #a94442" id="edit-sourceLogo-span-Error" class="help-inline"></span>';
	html += '<input	type="file" name="files"  id="file" style="color:transparent;" onchange="changeColor()"></input>';
	if(sourceLogoPath != null){
		html += '<img src="'+sourceLogoPath+'" style="width:100px;height:50px;">';
		html +=	'<input type="hidden" value='+sourceLogoPath+' id="sourceLogoPathId" >';
		html += '<span style="color: #a94442" id="" name="logoName" class="help-inline">'+logoName+'</span>';
	}
	html += '</div>';
	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateSourceMaster()">';
	html += '<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+ divId + ',' + appendDivId + ')">';
	html+=	'</form>';
	return html;
}
function changeColor(){
	$('#file').css("color", "black");
}
//************************************* update sourceMaster *******************************//
function updateSourceMaster(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editSourceMasterSuccessDiv').hide();
	$('#editSourceMasterErrorDiv').hide();
	
	var id = $.trim($('#editSourceId').val());
	var sourceBaseUrl = $.trim($('#editSourceBaseUrl').val());
	var sourceType = $.trim($('#editSourceType').val());
	var sourcePopularity = $('#editSourcePopularity').val();
	var maxOveralRating = $('#editmaxOverallRating').val();
	var sourceLogoPath = $('#sourceLogoPathId').val();
	var respondToReview;
	if($('#editrespondToReview').is(":checked")){
		respondToReview = 'Y';
	}else{
		respondToReview = 'N';
	}
	
	var filename = file.files[0];
	console.log("file :"+filename);
	var formData = new FormData();
	formData.append("file",file.files[0]);
	formData.append("value",JSON.stringify({
		'id' : id,
		'sourceBaseUrl' : sourceBaseUrl,
		'sourceType' : sourceType,
		'sourcePopularity' : sourcePopularity,
		'maxOverallRating' : maxOveralRating,
		'sourceLogoPath' : sourceLogoPath,
		'directReplyFlag' : respondToReview
		
	}));
	console.log("form data:"+formData);	
	
	$.ajax({dataType : 'json',
		url : sourceMasterUrl+"/update.htm",
		data : formData,
		type : "POST",
		enctype: 'application/x-www-form-urlencoded',
		processData: false, 
		contentType:false,
		success : function(response) {
			    	console.log(response);
			    	if(response.status=="UPDATE_SUCCESS"){
						$('#editSourceMasterSuccessDiv').show(600);
						sourceMasterList();
						$('#loadMaskDiv').unmask();
					} else if (response.status == "UPDATE_ERROR" ||  response.status ==  "EMPTY_SOURCE_BASE_URL" || response.status ==  "INVALID_SOURCE_BASE_URL" ||  response.status == "EMPTY_SOURCE_SOURCELOGO" || response.status == "INVALID_SOURCELOGO" || response.status == "INVALID_SOURCELOGO_SIZE" || response.status == "EMPTY_SOURCE_TYPE") {
						$('#editSourceMasterErrorDiv').show(600);
						for(var i=0;i<response.errorMessageList.length;i++){
							var fieldName = response.errorMessageList[i].fieldName;
							var errorMessage  = response.errorMessageList[i].message;
							console.log("fieldName :"+fieldName+" errorMessage"+errorMessage);
							$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
							$('#edit-'+fieldName+'-span-Error').html(errorMessage);
						}
						$('#page-wrapper').unmask();
					} else {
						$('#page-wrapper').mask(response.errorMessage);
					}
			}});
		return false;
	
}

/*********************** End *************************/

/**************************** Delete Source Master ********************/
function deleteSourceMaster(){
	$.ajaxSetup({ cache: false });
	var name="";
	selectedSourceMasterCheckBoxLength();
	if(selectedSourceMasterIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			/**********************New Div Changes****************************/
			$('#addAndEditSourceMasterDiv').hide();//Hiding Add/Edit Form
			$('#deleteSourceMasterSuccessDiv').hide();
			$('#deleteSourceMasterErrorDiv').hide();
			clearSourceMasterMessages();//Clearing All Error/Success Message Divs
			/**********************New Div Changes****************************/
			$.ajax({
				type:"POST",
				url:sourceMasterUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedSourceMasterIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#SourceMasterTabButtons').hide();
						var html = listSourceMasterHtml(response);
						sourceMasterDataDiv.html(html);
						$('#deleteSourceMasterSuccessDiv').show(600);
						//$('#geoCountryTabButtons').show();
						$('#sourceMasterListTable').dataTable();
						$('#page-wrapper').unmask();
						selectedSourceMasterIds = [];
					}else if (response.status=="SOURCE_EXIST") {
						var result = response.successObject.sourceList;
						for(var i=0;i<result.length;i++){
							name += result[i].sourceName+",";
						}
						var namee = name.substring(0, name.length-1); //deleting last comma symbol
						console.log("name :"+name);
						alert(namee+" sources are already in used !can't delete this record please check for unused record only");
						$('#page-wrapper').unmask();
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteSourceMasterErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteSourceMasterErrorDiv').append(errorMessage);
						$('#deleteSourceMasterErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedSourceMasterIds = [];
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		alert("Please select a record");
		return false;
	}
	
}

/************************************** End *******************************/

function appendSourceMasterAddOrEditForm(divId, method) {
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearSourceMasterMessages();// Clearing Source Master Error/Sucess Message
								// Div
}
function clearSourceMasterMessages() {
	$(
			'#addSourceMasterSuccessDiv,#editSourceMasterSuccessDiv,#deleteSourceMasterSuccessDiv,#deleteSourceMasterErrorDiv')
			.hide(600);
}
function hideForm(divId) {
	$("#" + divId).hide(600);
	// appendDivId = $('#'+appendDivId);
	// scrollDown(appendDivId);
}

function selectedSourceMasterCheckBoxLength() {
	if ($('.sourceMasterCheckBox:checked').length) {
		selectedSourceMasterIds = [];
		$('.sourceMasterCheckBox:checked').each(function() {
			selectedSourceMasterIds.push($(this).val());
		});
	}
	return false;
}

var specialKeys = new Array();
specialKeys.push(8); //Backspace
function IsNumeric(e) {
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
    document.getElementById("errorData").style.display = ret ? "none" : "inline";
    return ret;
}
function IsNumeric1(e) {
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
    document.getElementById("errorData1").style.display = ret ? "none" : "inline";
    return ret;
}
