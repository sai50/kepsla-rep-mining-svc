
var apiUserMappingUrl = "../apiUser/";
var $addAndEditApiUserDiv = $("#addAndEditApiUserDiv");
/***************************************************************************************************************************
 * ********************************General KPI******************************************************************************
 * *************************************************************************************************************************/
function listApiUserTab(){
	clearAllSuccessDivs();
	listApiUser();
}

function clearAddApiUserForm(){
	$('#addApiUserSuccessDiv').hide();
	$('#addApiUserErrorDiv').hide();
	$('.help-inline').html('');
	$('#Add-userName-Error').removeClass('has-error has-feedback');
}

function listApiUser(){
	$('#loadMaskDiv').mask('Loading...');
	$('#apiUserTabDiv').show();
	$('#addApiUserSuccessDiv,editApiUserSuccessDiv').hide();
	$('#listApiUserTab').html('');
	$.get(apiUserMappingUrl+"listTab.htm",function(response){
		console.log(response);
		if(response.status=="LIST_SUCCESS"){
			var tempHtml = listApiUserResponse(response);
			$('#listApiUserTab').append(tempHtml);
			$('#listApiUserTable').dataTable({"scrollX": true});
			$addAndEditApiUserDiv.hide();
			$('#listApiUserTab').show();
			$('#loadMaskDiv').unmask();
		}else{
			$('#loadMaskDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('#loadMaskDiv').append(response.status+"*****************"+response.statusText);
	});
	return false;
}	


function listApiUserResponse(response){
	var data=response.successObject.listApiUser;
	var html="";
	html+='<div id="listApiUserFormDiv">';
	html+='<form id="listApiUserForm">';
	html+='<div class="alert alert-success" style="margin-top: 49px" id="deleteApiUserSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; User Api Data Deleted Successfully</div>';
	html+='<table class="table table-striped dataTable no-footer" id="listApiUserTable" style="table-layout:auto;">';
	html+='<thead>';
	html+='<tr>';
	html+='<th><input type="checkbox" id="checkAllApiUserCheckBox"></th>';
	html+='<th>LoginId</th>';
	html+='<th>Password</th>';
	html+='<th>Status</th>';
	html+='<th>ClientCount</th>';
	html+='<th>ClientId & ClientSecret</th>';
	html+='<th>Settings</th>';
	html+='</tr>';
	html+='</thead>';
	html+='<tbody>';
	for(var i=0;i<data.length;i++){
	html+='	<tr>';
	html+='	<td><input type="checkbox" value='+data[i].userId+' class="apiUserCheckBox"></td>';
	html+='	<td>'+data[i].userName+'</td>';
	html+='	<td>'+data[i].plainPassword+'</td>';
	if(data[i].userEnabled==true){
	html+='	<td>enabled</td>';
	}else{
	html+='	<td>disabled</td>';
	}
	html+='<td>'+data[i].organizationCount+'</td>';		
	html+='<td style="word-break:break-word;">'+data[i].clientId+'</td>';	
	html+='	<td><span style="margin-left: -2px;"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editApiUser('+data[i].userId+')"><span class="glyphicon glyphicon-pencil"></span></button></span>';
	html+='	<span><button type="button" class="btn btn-xs AdminInList" title="Settings"   onclick="editSettingApiUser('+data[i].userId+')"><span class="glyphicon glyphicon-cog"></span></button></span></span></td>';
	html+='</tr>';
	}
	html+='</tbody>';
	html+='</table>';
	html+='</form>';
	html+='</div>';
	return html;
}


//add
$('a#addApiUserButton').click(function() {
	$.ajaxSetup({cache : false});
	$('#loadMaskDiv').mask('Loading...');
	$addAndEditApiUserDiv.html('');
	$('#addApiUserForm').trigger('reset');//Making All Values Empty
	clearAddApiUserForm();//Clearing All Errors
	var tempHtml = addApiUserForm();
	$addAndEditApiUserDiv.append(tempHtml);
	$addAndEditApiUserDiv.show(600);
	scrollDown($addAndEditApiUserDiv);//Scrolling To Add Page(Down)
	$('#loadMaskDiv').unmask();
	return false;
});


function addApiUserForm() {
	var html = "";
	html+= addFormHeading("Add User");
	html += '<form name="myform" class="col-sm-5" id="addApiUserForm">';
	/** ****************Error Div******************************* */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addApiUserErrorDiv">';
	html +='<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check';
	html += '</div>';
	/** ****************Success Div******************************* */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addApiUserSuccessDiv">';
	html +='<img alt="../" src="../resources/images/done.png">&nbsp;Successfully created';
	html += '</div>';
	/** *********************Add API USERS(s)************************* */
	html += '<div class="form-group" id="Add-userName-Error">';
	html += '<label>User Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="userName-span-Error" class="help-inline"></span>';
	html += '<input type="text" class="form-control" name="userName" id="apiUserName" maxlength="100" placeholder="Enter User Name"></input>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-password-Error">';
	html += '<label>Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="password-span-Error" class="help-inline"></span>';
	html += '<input type="password" class="form-control" name="password" id="apiPassword" maxlength="100" placeholder="Enter password"></input>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-confirmPassword-Error">';
	html += '<label>Confirm Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="confirmPassword-span-Error" class="help-inline"></span>';
	html += '<input type="password" class="form-control" name="confirmPassword" id="apiConfirmPassword" maxlength="100" placeholder="Enter Confirm Password"></input>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-userStatus-Error">';
	html += '<label>User Status<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="userStatus-span-Error" class="help-inline"></span><br>';
	html += '<label for="Enabled">Enabled:<input type="radio" required name="userStatusSelected" id="apiUserEnabled" checked="checked" value="1" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="Disabled">Disabled:<input type="radio" name="userStatusSelected" id="apiUserDisabled"  value="0" /></label>';
	html += '</div>';
	
	html += ' <input type="hidden" name="length" value="10">';
	html += '<div class="form-group" id="Add-userStatus-Error">';
	html += '<label>Client Id:<font style="color: red">*</font></label>';
	html +='<input name="row_password1" id="clientId" disabled class="form-control" type="text" size="20">';
	html += '<label>Client Secret:<font style="color: red">*</font></label>';
	html +='<input name="row_password2" id="clientSecret" class="form-control" disabled type="text" size="20">&nbsp;<input type="button" class="btn btn-primary" value="Generate" onClick="generateClientId();" tabindex="2">';
    html += '</div>';
    
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveApiUser()">';
	html+=	appendCancelButton(getDivId("ApiUser"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}


function saveApiUser(){
	$('#addApiUserErrorDiv').hide();
	$('#addApiUserSuccessDiv').hide();
	$('#userName-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#password-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#confirmPassword-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#Add-userName-Error').removeClass('has-error has-feedback');
	$('#Add-password-Error').removeClass('has-error has-feedback');
	$('#Add-confirmPassword-Error').removeClass('has-error has-feedback');
	var selected = $("input[type='radio'][name='userStatusSelected']:checked");
	var userName = $.trim($('#apiUserName').val());
	var password = $.trim($('#apiPassword').val());
	var clientId = $.trim($('#clientId').val());
	var clientSecret = $.trim($('#clientSecret').val());
	var confirmPassword = $.trim($('#apiConfirmPassword').val());
	var userEnabled = selected.val();
	//$('#addApiUserForm').html('');
	if(clientId!=""){
	var JSONObject = {};
	JSONObject['userName'] = userName;
	JSONObject['password'] = password;
	JSONObject['confirmPassword'] = confirmPassword;
	JSONObject['userEnabled'] = userEnabled;
	JSONObject['clientId'] = clientId;
	JSONObject['clientSecret'] = clientSecret;
	console.log(JSONObject);
	$.post(apiUserMappingUrl+"save.htm",JSONObject,function(response){
		console.log(response);
		console.log(response.userId);
		$('#loadMaskDiv').unmask();
		if(response.status=="SAVE_ERROR" || response.status=="EMPTY_USERNAME" || response.status=="DUPLICATE_USERNAME" || response.status=="EMPTY_PASSWORD" || response.status=="CONFORM_PASSWORD_MISMATCH"){
				$('#addApiUserErrorDiv').show(600);
				console.log(response.id);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage = response.errorMessageList[i].message;
					$('#'+fieldName+'-span-Error').html(errorMessage);
					$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#page-wrapper').unmask();
					//scrollDown(divId);
				}
		}else if(response.status=="SAVE_SUCCESS"){
			console.log(response.userId);
			settingApiUser(response.userId);
			//$('#addApiUserSuccessDiv').show(600);
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	});
	return false;
}else{
	alert("please click on generate button to generate clientId");
	}
}


function editApiUser(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditApiUserDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(apiUserMappingUrl+"edit.htm?id="+id,function(response){
		var html = editApiUserForm(response);
		appendApiUserAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}



function editApiUserForm(response) {
	response=response.successObject.apiUser;
	console.log(response.userName);
	var userName=$.trim(response.userName);
	console.log(userName);
	$('#deleteApiUserSuccessDiv').hide();
	var html = "";
	html+= addFormHeading("Edit User");
	html += '<input type="hidden" class="form-control"  id="editApiUserId" value='+response.id+' ></input>';
	html += '<form class="col-sm-5" id="editApiUserForm">';
	/** ****************Error Div******************************* */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editApiUserErrorDiv">';
	html +='<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check';
	html += '</div>';
	/** ****************Success Div******************************* */
	html += '<div class="alert alert-success alert-error" style="display: none;"	id="eddApiUserSuccessDiv">';
	html +='<img alt="../" src="../resources/images/done.png">&nbsp;Successfully updated';
	html += '</div>';
	/** *********************Edit API USERS(s)************************* */
	html += '<div class="form-group" id="Edit-userName-Error">';
	html += '<label>User Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="userName-span-Error" class="help-inline"></span>';
	html += '<input type="text" class="form-control" name="userName" id="editApiUserName" maxlength="100" value="'+userName+'"></input>';
	html += '</div>';
	
	html += '<div class="form-group" id="Edit-password-Error">';
	html += '<label>New Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="password-span-Error" class="help-inline"></span>';
	html += '<input type="password" class="form-control" name="password" id="editApiPassword" maxlength="100" value=""></input>';
	html += '</div>';
	
	html += '<div class="form-group" id="Edit-confirmPassword-Error">';
	html += '<label>New Confirm Password<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="confirmPassword-span-Error" class="help-inline"></span>';
	html += '<input type="password" class="form-control" name="confirmPassword" id="editApiConfirmPassword" maxlength="100" value=""></input>';
	html += '</div>';
	
	html += '<div class="form-group" id="Edit-userStatus-Error">';
	html += '<label>User Status<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="userStatus-span-Error" class="help-inline"></span><br>';
	html += '<label for="Enabled">Enabled:<input type="radio" required name="edituserStatusSelected" id="editApiUserEnabled" checked="checked" value="1" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="Disabled">Disabled:<input type="radio" name="edituserStatusSelected" id="editApiUserDisabled"  value="0" /></label>';
	html += '</div>';
	
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateApiUser()">';
	html+=	appendCancelButton(getDivId("ApiUser"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function generateClientId(){
	var userName=$('#apiUserName').val();
	$('#clientId').html('');
	$('#clientSecret').html('');
	var JSONObject = {};
	JSONObject['userName'] = userName;
	console.log(JSONObject);
	$.post(apiUserMappingUrl+"generateClienId.htm",JSONObject,function(response){
		console.log(response);
		if(response.status=="SAVE_SUCCESS"){
			$('#clientId').val(response.successObject.clientId);
			$('#clientSecret').val(response.successObject.clientId);
			$('#loadMaskDiv').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
	});
	return false;
}

function updateApiUser(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('#userName-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#confirmPassword-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#password-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	
	$('#Edit-userName-Error').removeClass('has-error has-feedback');
	$('#Edit-confirmPassword-Error').removeClass('has-error has-feedback');
	$('#Edit-password-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	
	$('#editApiUserSuccessDiv').hide();
	$('#editApiUserErrorDiv').hide();
	var JSONObject = {};
	var editUserName = $.trim($('#editApiUserName').val());
	var editPassword = $.trim($('#editApiPassword').val());
	var editConfirmPassword = $.trim($('#editApiConfirmPassword').val());
	var selected = $("input[type='radio'][name='edituserStatusSelected']:checked");
	var editUserEnabled = selected.val();
	var editApiUserId = $('#editApiUserId').val();

	JSONObject['id'] = editApiUserId;
	JSONObject['userName'] = editUserName;
	JSONObject['password'] = editPassword;
	JSONObject['confirmPassword'] = editConfirmPassword;
	JSONObject['userEnabled'] = editUserEnabled;
	$.post(apiUserMappingUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#eddApiUserSuccessDiv').show(600);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			$('#eddApiUserSuccessDiv').hide();
			$('#editApiUserErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#'+fieldName+'-span-Error').html(errorMessage);
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
			}
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#editCountryDiv').mask(response.status+"************"+response.statusText);
	});
	return false;
}


function apiUserSettingsForm(userId) {
	var html = "";
	$("#listApiUserTab").hide();
	$("#addApiUserForm").hide();
	$("#apiUserTabDiv").hide();
	
	html+='<div class="row" id="notificationsBredcrumb">';
	html+= '<div class="col-lg-12 SubHeading SmallDarkGreyHeader"><span> <a href="../apiUser/list.htm">Api Users</a></span>';
	html+=' <span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span><span>Settings</span></div>' + '</div>';

	html+= addFormHeading("Settings");
	html += '<form class="col-sm-5" id="addApiSettingsForm">';
	/** ****************Error Div******************************* */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addApiSettingsErrorDiv">';
	html +='<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check';
	html += '</div>';
	/** ****************Excel Error Div******************************* */
	html+=	'<div class="alert alert-danger alert-error" style="display: none;"	id="uploadIndustryKpiErrorDiv">';
	html+=	'</div>';
	/** ****************Success Div******************************* */
	html += '<div class="alert alert-success alert-error" style="display: none;"	id="addApiSettingsSuccessDiv">';
	html +='<img alt="../" src="../resources/images/done.png">&nbsp;Successfully Created';
	html += '</div>';
	
	//hidden UserId
	html += '<input type="hidden" class="form-control" style="width: 100px;"  id="hiddenUserId" value="'+userId+'" />';
	
	html += '<div class="form-group" id="Add-tradeReviews-Error">';
	html += '<label><B>Show Trade Review</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="tradeReviews-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="tradeReviews" id="tradeReviews" checked="checked" value="true" onClick="yesOrNoSaveTradeReviews();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="tradeReviews" id="tradeReviews" value="false" onClick="yesOrNoSaveTradeReviews();"/></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-maxNumberOfTradeReviews-Error">';
	html += '<label><B>Maximum Number Of Reviews</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="maxNumberOfTradeReviews-span-Error" class="help-inline"></span><br>';
	html += '<input type="text"  style="width: 100px;" class="form-control" name="maxNumberOfTradeReviews" id="maxNumberOfTradeReviews" value="" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-showOriginalScores-Error">';
	html += '<label><B>Show Original Scores</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="showOriginalScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="showOriginalScores" id="showOriginalScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="showOriginalScores" id="showOriginalScores"  value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-showSocialMentions-Error">';
	html += '<label><B>Show Social Mentions</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="showSocialMentions-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="showSocialMentions" id="showSocialMentions" onClick="yesOrNoSaveSocialMentions();" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="showSocialMentions" id="showSocialMentions"  onClick="yesOrNoSaveSocialMentions();" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-maxNumberOfMentions-Error">';
	html += '<label><B>Maximum Number Of Mentions</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="maxNumberOfMentions-span-Error" class="help-inline"></span><br>';
	html += '<input type="text" class="form-control" style="width: 100px;" name="maxNumberOfMentions" id="maxNumberOfMentions" value="" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-maximumCompetitorPerHotel-Error">';
	html += '<label><B>Maximum Number Of Competitors</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="maximumCompetitorPerHotel-span-Error" class="help-inline"></span><br>';
	html += '<input type="text" class="form-control" style="width: 100px;" name="maximumCompetitorPerHotel" id="maximumCompetitorPerHotel" value="" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-repufactor-Error">';
	html += '<label><B>Repufactor Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="repufactor-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="repufactor" id="repufactor" checked="checked" value="true" onclick="yesOrNoSavePartRepufactor();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="repufactor" id="repufactor"  value="false" onclick="yesOrNoSavePartRepufactor();" /></label>';
	html += '</div>';
	
	html += '<div id="repufactDisabled" style="float: right;width: 347px;">';
	/*html += '<div class="form-group" id="Add-scores-Error">';
	html += '<label><B>Scores Enabled</B></label>';
	html += '<span style="color: #a94442" id="scores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="scores" class="second" id="scores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="scores" id="scores" class="second" value="false" /></label>';
	html += '</div>';*/
	
	html += '<div class="form-group" id="Add-showOverallReviewVolumeCount-Error">';
	html += '<label><B>Trade Review Count</B></label>';
	html += '<span style="color: #a94442" id="showOverallReviewVolumeCount-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio"  name="showOverallReviewVolumeCount" class="second" id="showOverallReviewVolumeCount" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="showOverallReviewVolumeCount" class="second" id="showOverallReviewVolumeCount"  value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-kpiScores-Error">';
	html += '<label><B>KPI Scores</B></label>';
	html += '<span style="color: #a94442" id="kpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="kpiScores" id="kpiScores" class="second"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="kpiScores" id="kpiScores" class="second" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-showOverallReferenceVolumeCount-Error">';
	html += '<label><B>Reference Count<B></label>';
	html += '<span style="color: #a94442" id="showOverallReferenceVolumeCount-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" required name="showOverallReferenceVolumeCount" class="second" id="showOverallReferenceVolumeCount" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="showOverallReferenceVolumeCount" class="second" id="showOverallReferenceVolumeCount"  value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-department-Error">';
	html += '<label><B>Department Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="department-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="department" id="department" checked="checked" value="true" onclick="yesOrNoSaveDepartment();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="department" id="department"  value="false" onclick="yesOrNoSaveDepartment();" /></label>';
	html += '</div>';
	
	html += '<div id="departmentDisabled" style="float: right;width: 347px;">';
	html += '<div class="form-group" id="Add-departmentScores-Error">';
	html += '<label><B>Reference Count</B></label>';
	html += '<span style="color: #a94442" id="departmentScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="departmentScores" class="third" id="scores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="departmentScores" id="departmentScores" class="third" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-departmentKpiScores-Error">';
	html += '<label><B>KPI Scores</B></label>';
	html += '<span style="color: #a94442" id="departmentKpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="departmentKpiScores" id="departmentKpiScores" class="third"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="departmentKpiScores" id="departmentKpiScores" class="third" value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-source-Error">';
	html += '<label><B>Source Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="source-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="source" id="source" checked="checked" value="true" onclick="yesOrNoSaveSource();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="source" id="source"  value="false" onclick="yesOrNoSaveSource();" /></label>';
	html += '</div>';
	
	html += '<div id="sourceDisabled" style="float: right;width: 347px;">';
	html += '<div class="form-group" id="Add-sourceScores-Error">';
	html += '<label><B>Source Count</B></label>';
	html += '<span style="color: #a94442" id="sourceScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="sourceScores" class="four" id="scores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="sourceScores" id="sourceScores" class="four" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-sourceKpiScores-Error">';
	html += '<label><B>Reference Per Source Count</B></label>';
	html += '<span style="color: #a94442" id="sourceKpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="sourceKpiScores" id="sourceKpiScores" class="four"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="sourceKpiScores" id="sourceKpiScores" class="four" value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-language-Error">';
	html += '<label><B>Language Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="language-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="language" id="language" checked="checked" value="true" onclick="yesOrNoSaveLanguage();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="language" id="language"  value="false" onclick="yesOrNoSaveLanguage();" /></label>';
	html += '</div>';
	
	html += '<div id="languageDisabled" style="float: right;width: 347px;">';
	html += '<div class="form-group" id="Add-languageScores-Error">';
	html += '<label><B>Language Count</B></label>';
	html += '<span style="color: #a94442" id="languageScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="languageScores" class="five" id="languageScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="languageScores" id="languageScores" class="five" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-languageKpiScores-Error">';
	html += '<label><B>Reference per Language Count</B></label>';
	html += '<span style="color: #a94442" id="languageKpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="languageKpiScores" id="languageKpiScores" class="five"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="languageKpiScores" id="languageKpiScores" class="five" value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	
	html += '<div class="form-group" id="Add-competitorRepufactor-Error">';
	html += '<label><B>Competitor Repufactor Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="competitorRepufactor-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorRepufactor" id="competitorRepufactor" checked="checked" value="true" onclick="yesOrNoSaveCompetitorRepufactor();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorRepufactor" id="competitorRepufactor"  value="false" onclick="yesOrNoSaveCompetitorRepufactor();" /></label>';
	html += '</div>';
	
	html += '<div id="competitorRepufactorDisabled" style="float: right;width: 347px;">';
	html += '<div class="form-group" id="Add-scores-Error">';
	html += '<label><B>Competitor Trade Review Count</B></label>';
	html += '<span style="color: #a94442" id="competitorScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorScores" class="six" id="competitorScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorScores" id="competitorScores" class="six" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-competitorKpiScores-Error">';
	html += '<label><B>Competitor KPI Scores</B></label>';
	html += '<span style="color: #a94442" id="competitorKpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorKpiScores" id="competitorKpiScores" class="six"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorKpiScores" id="competitorKpiScores" class="six" value="false" /></label>';
	html += '</div>';
	
	//new added
	html += '<div class="form-group" id="Add-competitorReferenceCount-Error">';
	html += '<label><B>Competitor Reference Count</B></label>';
	html += '<span style="color: #a94442" id="competitorReferenceCount-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorReferenceCount" id="competitorReferenceCount" class="six"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorReferenceCount" id="competitorReferenceCount" class="six" value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-competitorDepartment-Error">';
	html += '<label><B>Competitor Department Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="competitorDepartment-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorDepartment" id="competitorDepartment" checked="checked" value="true" onclick="yesOrNoSaveCompetitorDepartment();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorDepartment" id="competitorDepartment"  value="false" onclick="yesOrNoSaveCompetitorDepartment();" /></label>';
	html += '</div>';
	
	html += '<div id="competitorDepartmentDisabled" style="float: right;width: 347px;">';
	html += '<div class="form-group" id="Add-competitorDepartmentScores-Error">';
	html += '<label><B>Competitor Reference Count</B></label>';
	html += '<span style="color: #a94442" id="competitorDepartmentScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorDepartmentScores" class="seven" id="competitorDepartmentScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorDepartmentScores" id="competitorDepartmentScores" class="seven" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-competitorDepartmentKpiScores-Error">';
	html += '<label><B>Competitor Department KPI Scores</B></label>';
	html += '<span style="color: #a94442" id="competitorDepartmentKpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorDepartmentKpiScores" id="competitorDepartmentKpiScores" class="seven"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorDepartmentKpiScores" id="competitorDepartmentKpiScores" class="seven" value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-competitorSource-Error">';
	html += '<label><B>Competitor source Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="competitorSource-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorSource" id="competitorSource" checked="checked" value="true" onclick="yesOrNoSaveCompetitorSource();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorSource" id="competitorSource"  value="false" onclick="yesOrNoSaveCompetitorSource();" /></label>';
	html += '</div>';
	
	html += '<div id="competitorSourceDisabled" style="float: right;width: 347px;">';
	html += '<div class="form-group" id="Add-competitorSourceScores-Error">';
	html += '<label><B>Competitor Source Count</B></label>';
	html += '<span style="color: #a94442" id="competitorSourceScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorSourceScores" class="eight" id="competitorSourceScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorSourceScores" id="competitorSourceScores" class="eight" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-competitorSourceKpiScores-Error">';
	html += '<label><B>Competitor Reference Per Source Count</B></label>';
	html += '<span style="color: #a94442" id="competitorSourceKpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorSourceKpiScores" id="competitorSourceKpiScores" class="eight"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorSourceKpiScores" id="competitorSourceKpiScores" class="eight" value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-competitorLanguage-Error">';
	html += '<label><B>Competitor Language Api Scores Enabled</B><font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="competitorLanguage-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorLanguage" id="competitorLanguage" checked="checked" value="true" onclick="yesOrNoSaveCompetitorLanguage();" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorLanguage" id="competitorLanguage"  value="false" onclick="yesOrNoSaveCompetitorLanguage();" /></label>';
	html += '</div>';
	
	html += '<div id="competitorLanguageDisabled" style="float: right;width: 347px;">';
	html += '<div class="form-group" id="Add-competitorLanguageScores-Error">';
	html += '<label><B>Competitor Language Count</B></label>';
	html += '<span style="color: #a94442" id="competitorLanguageScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorLanguageScores" class="nine" id="competitorLanguageScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorLanguageScores" id="competitorLanguageScores" class="nine" value="false" /></label>';
	html += '</div>';
	
	html += '<div class="form-group" id="Add-competitorLanguageKpiScores-Error">';
	html += '<label><B>Competitor Reference Per Language Count</B></label>';
	html += '<span style="color: #a94442" id="competitorLanguageKpiScores-span-Error" class="help-inline"></span><br>';
	html += '<label for="Yes">YES:<input type="radio" name="competitorLanguageKpiScores" id="competitorLanguageKpiScores" class="nine"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	html += '<label for="No">NO:<input type="radio" name="competitorLanguageKpiScores" id="competitorLanguageKpiScores" class="nine" value="false" /></label>';
	html += '</div>';
	html += '</div>';
	
	html += '<div class="form-group">';
	html += '<label><B>Excel Download</B></label>';
	html +='<br>';
	html +='<input type="button" class="btn btn-info btn-xs" onclick="exportClientDeatails('+userId+')" value="Export Client Data">';
	html += '</div>';
	
	//export excel
	html += '<div class="form-group" id="Add-files-Error">';
	html += '<div style="display: none;" id="editFilesErrorDiv"><p style="color:red">Error In excel please download excel</p>';
  	html += '</div>';
	html+=	 '<span id="uploadIndustryKpiExcelSpanError"></span>';
	html+=	 '<span id="downloadIndustryKpiExcelSpan"></span>';
	html += '<label><B>Excel Upload</B></label>';
	html+=	'<p style="color:green">The system only accepts .xlsx and .xls extension</p>';
	html += '<span style="color: #a94442" id="files-span-Error" class="help-inline"></span>';
	html+=	'<input type="file" name="files" id="files" multiple="multiple"><br>';
	html+='</div>';
	html += '<input type="button" id="subbutton5" class="btn btn-primary" value="Save" onClick="saveSettings()">';
	html += '<input type="button" id="cancels" class="btn btn-default" onClick="deleteUserDeatails('+userId+')" value="Cancel">';
	html += '</form>';
	return html;
}

function yesOrNoExcelUpload(){
	var selected = $("input[type='radio'][name='organizationExcelYesOrNo']:checked");
	var selectedExcel = selected.val();
	if (selectedExcel=="false") {
		$("#excelUploadHiddenDiv").hide();
	}else{
		$("#excelUploadHiddenDiv").show(600);
	}
}

function downloadIndustryKpiExcel(){
	redirectView(apiUserMappingUrl+"downloadIndustryKpiMaster.htm");
	return false;
}

function saveSettings(){
	$('#editFilesErrorDiv').hide();
	$('#downloadIndustryKpiErrorsExcelButton').hide();
	$('#addApiSettingsErrorDiv').hide();
	$('#addApiSettingsSuccessDiv').hide();
	$('#uploadIndustryKpiErrorDiv').hide();
	$('#files-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#Add-files-Error').removeClass('has-error has-feedback');
	$('#maxNumberOfTradeReviews-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#Add-maxNumberOfTradeReviews-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#maxNumberOfMentions-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#Add-maxNumberOfMentions-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#maximumCompetitorPerHotel-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#Add-maximumCompetitorPerHotel-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	
	var userId=$("#hiddenUserId").val();
	var maxCompetitorPerHotels=$("#maximumCompetitorPerHotel").val();
	var selected1 = $("input[type='radio'][name='tradeReviews']:checked");
	var tradeReviews = selected1.val();
	/*var selected2 = $("input[type='radio'][name='reviewScores']:checked");
	var reviewScores = selected2.val();*/
	var selected3 = $("input[type='radio'][name='showOriginalScores']:checked");
	var showOriginalScores = selected3.val();
	/*var selected4 = $("input[type='radio'][name='sentimentReviewValue']:checked");
	var sentimentReviewValue = selected4.val();*/
	var selected5 = $("input[type='radio'][name='showSocialMentions']:checked");
	var showSocialMentions = selected5.val();
	var selected6 = $("input[type='radio'][name='showOverallReviewVolumeCount']:checked");
	var showOverallReviewVolumeCount = selected6.val();
	var selected7 = $("input[type='radio'][name='showOverallReferenceVolumeCount']:checked");
	var showOverallReferenceVolumeCount = selected7.val();
	var maxNumberOfTradeReviews = $.trim($('#maxNumberOfTradeReviews').val());
	var maxNumberOfMentions = $.trim($('#maxNumberOfMentions').val());
	var selected8 = $("input[type='radio'][name='repufactor']:checked");
	var repufactor = selected8.val();
	var selected9 = $("input[type='radio'][name='scores']:checked");
	var scores = selected9.val();
	var selected10 = $("input[type='radio'][name='kpiScores']:checked");
	var kpiScores = selected10.val();
	var selected11 = $("input[type='radio'][name='department']:checked");
	var department = selected11.val();
	var selected12 = $("input[type='radio'][name='departmentScores']:checked");
	var departmentScores = selected12.val();
	var selected13 = $("input[type='radio'][name='departmentKpiScores']:checked");
	var departmentKpiScores = selected13.val();
	var selected14 = $("input[type='radio'][name='source']:checked");
	var source = selected14.val();
	var selected15 = $("input[type='radio'][name='sourceScores']:checked");
	var sourceScores = selected15.val();
	var selected16 = $("input[type='radio'][name='sourceKpiScores']:checked");
	var sourceKpiScores = selected16.val();
	var selected17 = $("input[type='radio'][name='language']:checked");
	var language = selected17.val();
	var selected18 = $("input[type='radio'][name='languageScores']:checked");
	var languageScores = selected18.val();
	var selected19 = $("input[type='radio'][name='languageKpiScores']:checked");
	var languageKpiScores = selected19.val();
	
	//competitor
	var selected20 = $("input[type='radio'][name='competitorRepufactor']:checked");
	var competitorRepufactor = selected20.val();
	var selected21 = $("input[type='radio'][name='competitorScores']:checked");
	var competitorScores = selected21.val();
	var selected22 = $("input[type='radio'][name='competitorKpiScores']:checked");
	var competitorKpiScores = selected22.val();
	var selected32 = $("input[type='radio'][name='competitorReferenceCount']:checked");
	var competitorReferenceCount = selected32.val();
	var selected23 = $("input[type='radio'][name='competitorDepartment']:checked");
	var competitorDepartment = selected23.val();
	var selected24 = $("input[type='radio'][name='competitorDepartmentScores']:checked");
	var competitorDepartmentScores = selected24.val();
	var selected25 = $("input[type='radio'][name='competitorDepartmentKpiScores']:checked");
	var competitorDepartmentKpiScores = selected25.val();
	var selected26 = $("input[type='radio'][name='competitorSource']:checked");
	var competitorSource = selected26.val();
	var selected27 = $("input[type='radio'][name='competitorSourceScores']:checked");
	var competitorSourceScores = selected27.val();
	var selected28 = $("input[type='radio'][name='competitorSourceKpiScores']:checked");
	var competitorSourceKpiScores = selected28.val();
	var selected29 = $("input[type='radio'][name='competitorLanguage']:checked");
	var competitorLanguage = selected29.val();
	var selected30 = $("input[type='radio'][name='competitorLanguageScores']:checked");
	var competitorLanguageScores = selected30.val();
	var selected31 = $("input[type='radio'][name='competitorLanguageKpiScores']:checked");
	var competitorLanguageKpiScores = selected31.val();
	
	if(maxCompetitorPerHotels==""){
		maxCompetitorPerHotels = 0;
	}
	if(tradeReviews==false){
		maxNumberOfTradeReviews = 0;
	}
	if(maxNumberOfTradeReviews==""){
		maxNumberOfTradeReviews = 0;
	}if(maxNumberOfMentions==""){
		maxNumberOfMentions = 0;
	}
	console.log("fileupload clicked");
	var oMyForm = new FormData();
	oMyForm.append("file", files.files[0]);
	oMyForm.append("value",JSON.stringify({
		"userId":userId,
		"maximumCompetitorPerHotel":maxCompetitorPerHotels,
	    "tradeReviews" : tradeReviews,
	    "socialMentions" : showSocialMentions,
		"originalLanguage" : showOriginalScores,
		"reviewScore" : false,
		"repufactorScore" : false,
		"reviewVolumeCount" : showOverallReviewVolumeCount,
		"referenceValumeCount" : showOverallReferenceVolumeCount,
		"maximumTradeReviewsLimit" : maxNumberOfTradeReviews,
		"maximumSocialMentionLimit" : maxNumberOfMentions,
		"repufactor":repufactor,
		"scores":scores,
		"kpiScores":kpiScores,
		"department":department,
		"departmentScores":departmentScores,
		"departmentKpiScores":departmentKpiScores,
		"language":language,
		"languageScores":languageScores,
		"languageKpiScores":languageKpiScores,
		"source":source,
		"sourceScores":sourceScores,
		"sourceKpiScores":sourceKpiScores,
		"competitorRepufactor":competitorRepufactor,
		"competitorScores":competitorScores,
		"competitorKpiScores":competitorKpiScores,
		"competitorReferenceCount":competitorReferenceCount,
		"competitorDepartment":competitorDepartment,
		"competitorDepartmentScores":competitorDepartmentScores,
		"competitorDepartmentKpiScores":competitorDepartmentKpiScores,
		"competitorLanguage":competitorLanguage,
		"competitorLanguageScores":competitorLanguageScores,
		"competitorLanguageKpiScores":competitorLanguageKpiScores,
		"competitorSource":competitorSource,
		"competitorSourceScores":competitorSourceScores,
		"competitorSourceKpiScores":competitorSourceKpiScores
		
	}));
	console.log(oMyForm);
	$.ajax({dataType : 'json',
	url : apiUserMappingUrl+"saveApiUserSettings.htm",
	data : oMyForm,
	type : "POST",
	enctype: 'application/x-www-form-urlencoded',
	processData: false, 
	contentType:false,
	success : function(response) {
		    	console.log(response);
		    	$('#loadMaskDiv').unmask();
		    	$('#uploadIndustryKpiErrorDiv').html('');
		    	$('#downloadIndustryKpiMasterButton').removeAttr('disabled');
		    	if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' ||  response.status=="INVALID_EXCEL" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
		    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
		    		$('#uploadIndustryKpiErrorDiv').append(html);
		    		$('#uploadIndustryKpiErrorDiv').show(600);
		            } else if(response.status=="SAVE_ERROR" || response.status=="EMPTY_TRADE_REVIEWS" || response.status=="EMPTY_COMPETITOR" || response.status=="EMPTY_SOCIAL_MENTIONS"){
						console.log(response);
						if(response.errorMessage=="Excel Upload Error.Please Download Excel And Try Again"){
							$('#downloadIndustryKpiMasterButton').attr('disabled','disabled');
			    			uploadedIndustryKpiFilePath = response.successObject.industryKpiErrorsExcelPath;
				    		var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryKpiErrorsExcelButton" onclick="downloadIndustryKpiErrorsExcel()" value="Download Excel"><br>';
				    		$('#downloadIndustryKpiExcelSpan').html(html);
				    		$('#uploadIndustryKpiInfoDiv').show(600);
				    		$('#editFilesErrorDiv').show(600);
						}else{
						$('#addApiSettingsErrorDiv').show(600);
						for(var i=0;i<response.errorMessageList.length;i++){
							var fieldName = response.errorMessageList[i].fieldName;
							var errorMessage = response.errorMessageList[i].message;
							$('#'+fieldName+'-span-Error').html(errorMessage);
							$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
							$('#page-wrapper').unmask();
							//scrollDown(divId);\
						}}
				        }else if(response.status=="EXCEL_UPLOAD_ERROR"){
			    			$('#downloadIndustryKpiMasterButton').attr('disabled','disabled');
			    			uploadedIndustryKpiFilePath = response.successObject.industryKpiErrorsExcelPath;
				    		var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryKpiErrorsExcelButton" onclick="downloadIndustryKpiErrorsExcel()" value="Download Excel"><br>';
				    		$('#downloadIndustryKpiExcelSpan').html(html);
				    		$('#uploadIndustryKpiInfoDiv').show(600);
				    		$('#editFilesErrorDiv').show(600);
			    		}
			    	else if(response.status=="UPLOAD_SUCCESS"){
			    		$('#uploadIndustryKpiSuccessDiv').show(600);
			    		$('#downloadIndustryKpiMaster').removeAttr('disabled');
			    	}
			    	else if(response.status=="EXCEPTION_ERROR"){
			    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
			    		$('#uploadIndustryKpiErrorDiv').append(html);
			    		$('#uploadIndustryKpiErrorDiv').show(600);
			    		$('#editFilesErrorDiv').show(600);
			    		$('#loadMaskDiv').unmask();
		
			    	}else if(response.status=="SAVE_SUCCESS"){
						$('#addApiSettingsSuccessDiv').show(600);
						//$('#addIndustryKpiForm').trigger("reset");
						//$('#addAndEditIndustryKpiDiv').hide(600);
						scrollTop();
						//listIndustryKpi();
					}else if(response.status=="EXCEPTION_ERROR"){
						$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
					}}});
	return false;
	 }

function downloadIndustryKpiErrorsExcel(){
	redirectView(uploadedIndustryKpiFilePath);
}

function exportClientDeatails(userId){
	redirectView("../apiUser/exportClientName.htm?userId="+userId);
	return false;
}


function appendApiUserAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	maskId.unmask();
}



function settingApiUser(userId){
	var divId = $('#addAndEditApiUserDiv');//Declaring Add/Edit Form Div
		var html = apiUserSettingsForm(userId);
		appendApiUserAddOrEditForm(divId, html);//This Method Append Edit Form
		//yesOrNoRepufactor();
		$('#page-wrapper').unmask();
}

function editSettingApiUser(userId){	
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditApiUserDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(apiUserMappingUrl+"editApiSettings.htm?id="+userId,function(response){
		var html = editApiUserSettingsForm(response);
		appendApiUserAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

 function yesOrNoSavePartRepufactor(){
	var selected8 = $("input[type='radio'][name='repufactor']:checked");
	var repufactor = selected8.val();
	if (repufactor=="false") {
		$(".second").attr('checked', false);
		$(".second").attr('disabled', true);
		$("#competitorRepufactorDisabled").attr('disabled', true);
	}else{
		$(".second").attr('disabled', false);
		$("#competitorRepufactorDisabled").attr('disabled', false);
	}
}

  function yesOrNoSaveDepartment(){
	var selected9 = $("input[type='radio'][name='department']:checked");
	var department = selected9.val();
	if (department=="false") {
		$(".third").attr('checked', false);
		$(".third").attr('disabled', true);
	}else{
		$(".third").attr('disabled', false);
	}
}
  
  function yesOrNoSaveSource(){
		var selected = $("input[type='radio'][name='source']:checked");
		var source = selected.val();
		if (source=="false") {
			$(".four").attr('checked', false);
			$(".four").attr('disabled', true);
		}else{
			$(".four").attr('disabled', false);
		}
	}
  
  function yesOrNoSaveLanguage(){
		var selected9 = $("input[type='radio'][name='language']:checked");
		var language = selected9.val();
		if (language=="false") {
			$(".five").attr('checked', false);
			$(".five").attr('disabled', true);
		}else{
			$(".five").attr('disabled', false);
		}
	}
  
  function yesOrNoSaveCompetitorRepufactor(){
		var selected8 = $("input[type='radio'][name='competitorRepufactor']:checked");
		var competitorRepufactor = selected8.val();
		if (competitorRepufactor=="false") {
			$(".six").attr('checked', false);
			$(".six").attr('disabled', true);
		}else{
			$(".six").attr('disabled', false);
		}
	}

	  function yesOrNoSaveCompetitorDepartment(){
		var selected9 = $("input[type='radio'][name='competitorDepartment']:checked");
		var competitorDepartment = selected9.val();
		if (competitorDepartment=="false") {
			$(".seven").attr('checked', false);
			$(".seven").attr('disabled', true);
		}else{
			$(".seven").attr('disabled', false);
		}
	}
	  
	  function yesOrNoSaveCompetitorSource(){
			var selected = $("input[type='radio'][name='competitorSource']:checked");
			var competitorSource = selected.val();
			if (competitorSource=="false") {
				$(".eight").attr('checked', false);
				$(".eight").attr('disabled', true);
			}else{
				$(".eight").attr('disabled', false);
			}
		}
	  
	  function yesOrNoSaveCompetitorLanguage(){
			var selected9 = $("input[type='radio'][name='competitorLanguage']:checked");
			var competitorLanguage = selected9.val();
			if (competitorLanguage=="false") {
				$(".nine").attr('checked', false);
				$(".nine").attr('disabled', true);
			}else{
				$(".nine").attr('disabled', false);
			}
		}
	  
	  
	  function yesOrNoRepufactor(){
			var selected8 = $("input[type='radio'][name='editrepufactor']:checked");
			var repufactor = selected8.val();
			if (repufactor=="false") {
				$(".second").attr('checked', false);
				$(".second").attr('disabled', true);
				$("#competitorRepufactorDisabled").attr('disabled', true);
			}else{
				$(".second").attr('disabled', false);
				$("#competitorRepufactorDisabled").attr('disabled', false);
			}
		}

		  function yesOrNoDepartment(){
			var selected9 = $("input[type='radio'][name='editdepartment']:checked");
			var department = selected9.val();
			if (department=="false") {
				$(".third").attr('checked', false);
				$(".third").attr('disabled', true);
			}else{
				$(".third").attr('disabled', false);
			}
		}
		  
		  function yesOrNoSource(){
				var selected = $("input[type='radio'][name='editsource']:checked");
				var source = selected.val();
				if (source=="false") {
					$(".four").attr('checked', false);
					$(".four").attr('disabled', true);
				}else{
					$(".four").attr('disabled', false);
				}
			}
		  
		  function yesOrNoLanguage(){
				var selected9 = $("input[type='radio'][name='editlanguage']:checked");
				var language = selected9.val();
				if (language=="false") {
					$(".five").attr('checked', false);
					$(".five").attr('disabled', true);
				}else{
					$(".five").attr('disabled', false);
				}
			}
		  
		  function yesOrNoCompetitorRepufactor(){
				var selected8 = $("input[type='radio'][name='editcompetitorRepufactor']:checked");
				var competitorRepufactor = selected8.val();
				if (competitorRepufactor=="false") {
					$(".six").attr('checked', false);
					$(".six").attr('disabled', true);
				}else{
					$(".six").attr('disabled', false);
				}
			}

			  function yesOrNoCompetitorDepartment(){
				var selected9 = $("input[type='radio'][name='editcompetitorDepartment']:checked");
				var competitorDepartment = selected9.val();
				if (competitorDepartment=="false") {
					$(".seven").attr('checked', false);
					$(".seven").attr('disabled', true);
				}else{
					$(".seven").attr('disabled', false);
				}
			}
			  
			  function yesOrNoCompetitorSource(){
					var selected = $("input[type='radio'][name='editcompetitorSource']:checked");
					var competitorSource = selected.val();
					if (competitorSource=="false") {
						$(".eight").attr('checked', false);
						$(".eight").attr('disabled', true);
					}else{
						$(".eight").attr('disabled', false);
					}
				}
			  
			  function yesOrNoCompetitorLanguage(){
					var selected9 = $("input[type='radio'][name='editcompetitorLanguage']:checked");
					var competitorLanguage = selected9.val();
					if (competitorLanguage=="false") {
						$(".nine").attr('checked', false);
						$(".nine").attr('disabled', true);
					}else{
						$(".nine").attr('disabled', false);
					}
				}
			  
			  function yesOrNoTradeReviews(){
					var selected10 = $("input[type='radio'][name='edittradeReviews']:checked");
					var tradeReviews = selected10.val();
					if (tradeReviews=="false") {
						$("#editmaxNumberOfTradeReviews").attr('checked', false);
						$("#editmaxNumberOfTradeReviews").attr('disabled', true);
						tradeReviews=0;
					}else{
						$("#editmaxNumberOfTradeReviews").attr('disabled', false);
					}
				}
			  
			  function yesOrNoSaveTradeReviews(){
					var selected10 = $("input[type='radio'][name='tradeReviews']:checked");
					var tradeReviews = selected10.val();
					if (tradeReviews=="false") {
						$("#maxNumberOfTradeReviews").attr('checked', false);
						$("#maxNumberOfTradeReviews").attr('disabled', true);
					}else{
						$("#maxNumberOfTradeReviews").attr('disabled', false);
					}
				}
			  
			  function yesOrNoSaveSocialMentions(){
					var selected10 = $("input[type='radio'][name='showSocialMentions']:checked");
					var tradeReviews = selected10.val();
					if (tradeReviews=="false") {
						$("#maxNumberOfMentions").attr('checked', false);
						$("#maxNumberOfMentions").attr('disabled', true);
					}else{
						$("#maxNumberOfMentions").attr('disabled', false);
					}
				}
			  
			  function yesOrNoEditSocialMentions(){
					var selected10 = $("input[type='radio'][name='editshowSocialMentions']:checked");
					var tradeReviews = selected10.val();
					if (tradeReviews=="false") {
						$("#editmaxNumberOfMentions").attr('checked', false);
						$("#editmaxNumberOfMentions").attr('disabled', true);
					}else{
						$("#editmaxNumberOfMentions").attr('disabled', false);
					}
				}

  function editApiUserSettingsForm(response) {
	  response=response.successObject.apiUserOrganizationConfigList;
	  console.log(response);
	  	var html = "";
		$('#listApiUserFormDiv').hide();
		$('#listApiUserForm').hide();
	  	$("#listApiUserTab").hide();
	  	$("#addApiUserForm").hide();
	  	$("#apiUserTabDiv").hide();
	  	html+='<div class="row" id="notificationsBredcrumb">';
	  	html+= '<div class="col-lg-12 SubHeading SmallDarkGreyHeader"><span> <a href="../apiUser/list.htm">Api Users</a></span>';
	  	html+=' <span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span><span>Settings</span></div>' + '</div>';

	  	html+= addFormHeading("Settings");
	  	html += '<form class="col-sm-5" id="editApiSettingsForm">';
	  	/** ****************Error Div******************************* */
	  	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editApiSettingsErrorDiv">';
	  	html +='<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check';
	  	html += '</div>';
	  	/** ****************Excel Error Div******************************* */
		html+=	'<div class="alert alert-danger alert-error" style="display: none;"	id="uploadIndustryKpiErrorDiv">';
		html+=	'</div>';
	  	/** ****************Success Div******************************* */
	  	html += '<div class="alert alert-success alert-error" style="display: none;"	id="editApiSettingsSuccessDiv">';
	  	html +='<img alt="../" src="../resources/images/done.png">&nbsp;Updated Successfully';
	  	html += '</div>';
	  	//hidden UserId
	  	html += '<input type="hidden" class="form-control" style="width: 100px;"  id="edithiddenUserId" value="'+response.apiUserId+'" />';
	  	html += '<div class="form-group" id="Add-edittradeReviews-Error">';
	  	html += '<label><B>Show Trade Review</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="edittradeReviews-span-Error" class="help-inline"></span><br>';
	  	if(response.tradeReviews==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="edittradeReviews" id="edittradeReviews" checked="checked" value="true" onclick="yesOrNoTradeReviews();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="edittradeReviews" id="edittradeReviews" value="false" onclick="yesOrNoTradeReviews();" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="edittradeReviews" id="edittradeReviews" value="true" onclick="yesOrNoTradeReviews();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="edittradeReviews" id="edittradeReviews" checked="checked" value="false" onclick="yesOrNoTradeReviews();" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editmaxNumberOfTradeReviews-Error">';
	  	html += '<label><B>Maximum Number Of Reviews</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editmaxNumberOfTradeReviews-span-Error" class="help-inline"></span><br>';
	  	if(response.tradeReviews==true){
	  	html += '<input type="text"  style="width: 100px;" class="form-control" name="editmaxNumberOfTradeReviews" id="editmaxNumberOfTradeReviews" value="'+response.maximumTradeReviewsLimit+'" /></label>';
	  	}else{
	  		html += '<input type="text"  style="width: 100px;" class="form-control" name="editmaxNumberOfTradeReviews" Disabled id="editmaxNumberOfTradeReviews" value="" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editshowOriginalScores-Error">';
	  	html += '<label><B>Show Original Scores</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editshowOriginalScores-span-Error" class="help-inline"></span><br>';
	  	if(response.originalLanguage==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editshowOriginalScores" id="editshowOriginalScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editshowOriginalScores" id="editshowOriginalScores"  value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editshowOriginalScores" id="editshowOriginalScores"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editshowOriginalScores" id="editshowOriginalScores" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<hr>';
	  	
	  	html += '<div class="form-group" id="Add-editshowSocialMentions-Error">';
	  	html += '<label><B>Show Social Mentions</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editshowSocialMentions-span-Error" class="help-inline"></span><br>';
	  	if(response.socialMentions==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editshowSocialMentions" id="editshowSocialMentions" checked="checked"  onclick="yesOrNoEditSocialMentions();" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editshowSocialMentions" id="editshowSocialMentions"  onclick="yesOrNoEditSocialMentions();" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editshowSocialMentions" id="editshowSocialMentions"  onclick="yesOrNoEditSocialMentions();" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editshowSocialMentions" id="editshowSocialMentions"   onclick="yesOrNoEditSocialMentions();" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editmaxNumberOfMentions-Error">';
	  	html += '<label><B>Maximum Number Of Mentions</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editmaxNumberOfMentions-span-Error" class="help-inline"></span><br>';
	  	if(response.socialMentions==true){
	  	html += '<input type="text" class="form-control" style="width: 100px;" name="editmaxNumberOfMentions" id="editmaxNumberOfMentions" value="'+response.maximumSocialMentionLimit+'" /></label>';
	  	}else{
	  		html += '<input type="text" class="form-control" style="width: 100px;" name="editmaxNumberOfMentions" Disabled id="editmaxNumberOfMentions" value="" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editmaximumCompetitorPerHotel-Error">';
		html += '<label><B>Maximum Number Of Competitors</B><font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="editmaximumCompetitorPerHotel-span-Error" class="help-inline"></span><br>';
		html += '<input type="text" class="form-control" style="width: 100px;" name="editmaximumCompetitorPerHotel" id="editmaximumCompetitorPerHotel" value='+response.maximumCompetitorPerHotel+' /></label>';
		html += '</div>';
	  	html += '<hr>';
	  	
	  	html += '<div class="form-group" id="Add-editrepufactor-Error">';
	  	html += '<label><B>Repufactor Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editrepufactor-span-Error" class="help-inline"></span><br>';
	    if(response.repufactor==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editrepufactor" id="editrepufactor" checked="checked" value="true" onclick="yesOrNoRepufactor();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editrepufactor" id="editrepufactor"  value="false" onclick="yesOrNoRepufactor();" /></label>';
	    }else{
	    	html += '<label for="Yes">YES:<input type="radio" name="editrepufactor" id="editrepufactor"  value="true" onclick="yesOrNoRepufactor();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editrepufactor" id="editrepufactor" checked="checked" value="false" onclick="yesOrNoRepufactor();" /></label>';
	    }
	  	html += '</div>';
	  	
	  	/*html += '<div id="editrepufactDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-editscores-Error">';
	  	html += '<label><B>Scores Enabled</B></label>';
	  	html += '<span style="color: #a94442" id="editscores-span-Error" class="help-inline"></span><br>';
	  	if(response.scores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editscores" class="second" id="editscores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editscores" id="editscores" class="second" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editscores" class="second" id="editscores"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editscores" id="editscores" class="second" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';*/
	  	html += '<div id="editrepufactDisabled" style="float: right;width: 347px;">';
		html += '<div class="form-group" id="Add-editshowOverallReviewVolumeCount-Error">';
	  	html += '<label><B>Review count</B></label>';
	  	html += '<span style="color: #a94442" id="editshowOverallReviewVolumeCount-span-Error" class="help-inline"></span><br>';
	  	if(response.reviewVolumeCount==true){
	  	html += '<label for="Yes">YES:<input type="radio"  name="editshowOverallReviewVolumeCount" class="second" id="editshowOverallReviewVolumeCount" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editshowOverallReviewVolumeCount" class="second" id="editshowOverallReviewVolumeCount"  value="false" /></label>';
        }else{
        	html += '<label for="Yes">YES:<input type="radio"  name="editshowOverallReviewVolumeCount" class="second" id="editshowOverallReviewVolumeCount"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
    	  	html += '<label for="No">NO:<input type="radio" name="editshowOverallReviewVolumeCount" class="second" id="editshowOverallReviewVolumeCount" checked="checked" value="false" /></label>';
        }
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editkpiScores-Error">';
	  	html += '<label><B>KPI Scores</B></label>';
	  	html += '<span style="color: #a94442" id="editkpiScores-span-Error" class="help-inline"></span><br>';
		if(response.kpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editkpiScores" id="editkpiScores" class="second"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editkpiScores" id="editkpiScores" class="second" value="false" /></label>';
		}else{
			html += '<label for="Yes">YES:<input type="radio" name="editkpiScores" id="editkpiScores" class="second" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editkpiScores" id="editkpiScores" class="second" checked="checked" value="false" /></label>';
		}
	  	html += '</div>';
	  	
		html += '<div class="form-group" id="Add-editshowOverallReferenceVolumeCount-Error">';
	  	html += '<label><B>Reference Count</B></label>';
	  	html += '<span style="color: #a94442" id="editshowOverallReferenceVolumeCount-span-Error" class="help-inline"></span><br>';
	  	if(response.referenceValumeCount==true){
	  	html += '<label for="Yes">YES:<input type="radio" required name="editshowOverallReferenceVolumeCount" class="second" id="editshowOverallReferenceVolumeCount" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editshowOverallReferenceVolumeCount" class="second" id="editshowOverallReferenceVolumeCount"  value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" required name="editshowOverallReferenceVolumeCount" id="editshowOverallReferenceVolumeCount"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editshowOverallReferenceVolumeCount" id="editshowOverallReferenceVolumeCount" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editdepartment-Error">';
	  	html += '<label><B>Department Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editdepartment-span-Error" class="help-inline"></span><br>';
	    if(response.department==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editdepartment" id="editdepartment" checked="checked" value="true" onclick="yesOrNoDepartment();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editdepartment" id="editdepartment"  value="false" onclick="yesOrNoDepartment();" /></label>';
	    }else{
	    	html += '<label for="Yes">YES:<input type="radio" name="editdepartment" id="editdepartment"  value="true" onclick="yesOrNoDepartment();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editdepartment" id="editdepartment" checked="checked" value="false" onclick="yesOrNoDepartment();" /></label>';
	    }
	  	html += '</div>';
	  	
	  	html += '<div id="editdepartmentDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-editdepartmentScores-Error">';
	  	html += '<label><B>Scores Enabled</B></label>';
	  	html += '<span style="color: #a94442" id="editdepartmentScores-span-Error" class="help-inline"></span><br>';
	  	 if(response.departmentScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editdepartmentScores" class="third" id="editdepartmentScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editdepartmentScores" id="editdepartmentScores" class="third" value="false" /></label>';
	  	 }else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editdepartmentScores" class="third" id="editdepartmentScores"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editdepartmentScores" id="editdepartmentScores" class="third" checked="checked" value="false" /></label>';
	  	 }
	  	 html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editdepartmentKpiScores-Error">';
	  	html += '<label><B>KPI Scores</B></label>';
	  	html += '<span style="color: #a94442" id="editdepartmentKpiScores-span-Error" class="help-inline"></span><br>';
	  	 if(response.departmentKpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editdepartmentKpiScores" id="editdepartmentKpiScores" class="third"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editdepartmentKpiScores" id="editdepartmentKpiScores" class="third" value="false" /></label>';
	  	 }else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editdepartmentKpiScores" id="editdepartmentKpiScores" class="third" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editdepartmentKpiScores" id="editdepartmentKpiScores" class="third" checked="checked" value="false" /></label>';
		  		 
	  	 }
	  	html += '</div>';
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editsource-Error">';
	  	html += '<label><B>Source Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editsource-span-Error" class="help-inline"></span><br>';
	  	 if(response.source==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editsource" id="editsource" checked="checked" value="true" onclick="yesOrNoSource();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editsource" id="editsource"  value="false" onclick="yesOrNoSource();" /></label>';
	  	 }else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editsource" id="editsource"  value="true" onclick="yesOrNoSource();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editsource" id="editsource" checked="checked" value="false" onclick="yesOrNoSource();" /></label>';
	  	 }
	  	html += '</div>';
	  	
	  	html += '<div id="editsourceDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-editsourceScores-Error">';
	  	html += '<label><B>Scores Enabled</B></label>';
	  	html += '<span style="color: #a94442" id="editsourceScores-span-Error" class="help-inline"></span><br>';
	  	 if(response.sourceScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editsourceScores" class="four" id="editsourceScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editsourceScores" id="editsourceScores" class="four" value="false" /></label>';
	  	 }else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editsourceScores" class="four" id="editsourceScores" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editsourceScores" id="editsourceScores" class="four"  checked="checked" value="false" /></label>';
	  	 }
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editsourceKpiScores-Error">';
	  	html += '<label><B>Source Scores</B></label>';
	  	html += '<span style="color: #a94442" id="editsourceKpiScores-span-Error" class="help-inline"></span><br>';
	  	if(response.sourceKpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editsourceKpiScores" id="editsourceKpiScores" class="four"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editsourceKpiScores" id="editsourceKpiScores" class="four" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editsourceKpiScores" id="editsourceKpiScores" class="four" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editsourceKpiScores" id="editsourceKpiScores" class="four" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editlanguage-Error">';
	  	html += '<label><B>Language Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editlanguage-span-Error" class="help-inline"></span><br>';
	  	if(response.language==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editlanguage" id="editlanguage" checked="checked" value="true" onclick="yesOrNoLanguage();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editlanguage" id="editlanguage"  value="false" onclick="yesOrNoLanguage();" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editlanguage" id="editlanguage" value="true" onclick="yesOrNoLanguage();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editlanguage" id="editlanguage" checked="checked" value="false" onclick="yesOrNoLanguage();" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div id="editlanguageDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-editlanguageScores-Error">';
	  	html += '<label><B>language Enabled</B></label>';
	  	html += '<span style="color: #a94442" id="editlanguageScores-span-Error" class="help-inline"></span><br>';
	  	if(response.languageScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editlanguageScores" class="five" id="editlanguageScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editlanguageScores" id="editlanguageScores" class="five" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editlanguageScores" class="five" id="editlanguageScores" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editlanguageScores" id="editlanguageScores" class="five" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editlanguageKpiScores-Error">';
	  	html += '<label><B>Language Scores</B></label>';
	  	html += '<span style="color: #a94442" id="editlanguageKpiScores-span-Error" class="help-inline"></span><br>';
		if(response.languageKpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editlanguageKpiScores" id="editlanguageKpiScores" class="five"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editlanguageKpiScores" id="editlanguageKpiScores" class="five" value="false" /></label>';
		}else{
			html += '<label for="Yes">YES:<input type="radio" name="editlanguageKpiScores" id="editlanguageKpiScores" class="five"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editlanguageKpiScores" id="editlanguageKpiScores" class="five" checked="checked" value="false" /></label>';
		}
	  	html += '</div>';
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorRepufactor-Error">';
	  	html += '<label><B>Competitor Repufactor Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorRepufactor-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorRepufactor==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorRepufactor" id="editcompetitorRepufactor" checked="checked" value="true" onclick="yesOrNoCompetitorRepufactor();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorRepufactor" id="editcompetitorRepufactor"  value="false" onclick="yesOrNoCompetitorRepufactor();" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorRepufactor" id="editcompetitorRepufactor" value="true" onclick="yesOrNoCompetitorRepufactor();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorRepufactor" id="editcompetitorRepufactor" checked="checked" value="false" onclick="yesOrNoCompetitorRepufactor();" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div id="editcompetitorRepufactorDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-scores-Error">';
	  	html += '<label><B>Competitor Review Count</B></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorScores-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorScores" class="six" id="editcompetitorScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorScores" id="editcompetitorScores" class="six" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorScores" class="six" id="editcompetitorScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorScores" id="editcompetitorScores" class="six" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	
	    //new added
		html += '<div class="form-group" id="Add-editcompetitorReferenceCount-Error">';
		html += '<label><B>Competitor Reference Count</B></label>';
		html += '<span style="color: #a94442" id="editcompetitorReferenceCount-span-Error" class="help-inline"></span><br>';
		if(response.competitorReferenceCount==true){
		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorReferenceCount" id="editcompetitorReferenceCount" class="six"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		html += '<label for="No">NO:<input type="radio" name="editcompetitorReferenceCount" id="editcompetitorReferenceCount" class="six" value="false" /></label>';
		}else{
			html += '<label for="Yes">YES:<input type="radio" name="editcompetitorReferenceCount" id="editcompetitorReferenceCount" class="six" value="true" /></label>&nbsp;&nbsp;&nbsp;';
			html += '<label for="No">NO:<input type="radio" name="editcompetitorReferenceCount" id="editcompetitorReferenceCount" class="six"  checked="checked" value="false" /></label>';
		}
		html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorKpiScores-Error">';
	  	html += '<label><B>Competitor KPI Scores</B></label>';
	  	html += '<span style="color: #a94442" id="competitorKpiScores-span-Error" class="help-inline"></span><br>';
		if(response.competitorKpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorKpiScores" id="editcompetitorKpiScores" class="six"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorKpiScores" id="editcompetitorKpiScores" class="six" value="false" /></label>';
		}else{
			html += '<label for="Yes">YES:<input type="radio" name="editcompetitorKpiScores" id="editcompetitorKpiScores" class="six" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorKpiScores" id="editcompetitorKpiScores" class="six" checked="checked" value="false" /></label>';
		}
	  	html += '</div>';
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorDepartment-Error">';
	  	html += '<label><B>Competitor Department Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorDepartment-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorDepartment==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorDepartment" id="editcompetitorDepartment" checked="checked" value="true" onclick="yesOrNoCompetitorDepartment();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorDepartment" id="editcompetitorDepartment"  value="false" onclick="yesOrNoCompetitorDepartment();" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorDepartment" id="editcompetitorDepartment" value="true" onclick="yesOrNoCompetitorDepartment();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorDepartment" id="editcompetitorDepartment" checked="checked" value="false" onclick="yesOrNoCompetitorDepartment();" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div id="editcompetitorDepartmentDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-editcompetitorDepartmentScores-Error">';
	  	html += '<label><B>Competitor Scores Enabled</B></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorDepartmentScores-span-Error" class="help-inline"></span><br>';
		if(response.competitorDepartmentScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorDepartmentScores" class="seven" id="editcompetitorDepartmentScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorDepartmentScores" id="editcompetitorDepartmentScores" class="seven" value="false" /></label>';
		}else{
			html += '<label for="Yes">YES:<input type="radio" name="editcompetitorDepartmentScores" class="seven" id="editcompetitorDepartmentScores" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorDepartmentScores" id="editcompetitorDepartmentScores" class="seven" checked="checked" value="false" /></label>';
		}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorDepartmentKpiScores-Error">';
	  	html += '<label><B>Competitor Department KPI Scores</B></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorDepartmentKpiScores-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorDepartmentKpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorDepartmentKpiScores" id="editcompetitorDepartmentKpiScores" class="seven"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorDepartmentKpiScores" id="editcompetitorDepartmentKpiScores" class="seven" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorDepartmentKpiScores" id="editcompetitorDepartmentKpiScores" class="seven" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorDepartmentKpiScores" id="editcompetitorDepartmentKpiScores" class="seven" checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorSource-Error">';
	  	html += '<label><B>Competitor source Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorSource-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorSource==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorSource" id="editcompetitorSource" checked="checked" value="true" onclick="yesOrNoCompetitorSource();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorSource" id="editcompetitorSource"  value="false" onclick="yesOrNoCompetitorSource();" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorSource" id="editcompetitorSource" value="true" onclick="yesOrNoCompetitorSource();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorSource" id="editcompetitorSource" checked="checked" value="false" onclick="yesOrNoCompetitorSource();" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div id="competitorSourceDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-editcompetitorSourceScores-Error">';
	  	html += '<label><B>Competitor Scores Enabled</B></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorSourceScores-span-Error" class="help-inline"></span><br>';
		if(response.competitorSourceScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorSourceScores" class="eight" id="editcompetitorSourceScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorSourceScores" id="editcompetitorSourceScores" class="eight" value="false" /></label>';
		}else{
			html += '<label for="Yes">YES:<input type="radio" name="editcompetitorSourceScores" class="eight" id="editcompetitorSourceScores" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorSourceScores" id="editcompetitorSourceScores" class="eight" checked="checked" value="false" /></label>';
		}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorSourceKpiScores-Error">';
	  	html += '<label><B>Competitor Source Scores</B></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorSourceKpiScores-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorSourceKpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorSourceKpiScores" id="editcompetitorSourceKpiScores" class="eight"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorSourceKpiScores" id="editcompetitorSourceKpiScores" class="eight" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorSourceKpiScores" id="editcompetitorSourceKpiScores" class="eight" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorSourceKpiScores" id="editcompetitorSourceKpiScores" class="eight"  checked="checked" value="false" /></label>';
	  	}
	  	html += '</div>';
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorLanguage-Error">';
	  	html += '<label><B>Competitor Language Api Scores Enabled</B><font style="color: red">*</font></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorLanguage-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorLanguage==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorLanguage" id="editcompetitorLanguage" checked="checked" value="true" onclick="yesOrNoCompetitorLanguage();" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorLanguage" id="editcompetitorLanguage"  value="false" onclick="yesOrNoCompetitorLanguage();" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorLanguage" id="editcompetitorLanguage" value="true" onclick="yesOrNoCompetitorLanguage();" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorLanguage" id="editcompetitorLanguage" checked="checked" value="false" onclick="yesOrNoCompetitorLanguage();" /></label>';
	  	}
	  	html += '</div>';
	  	
	  	html += '<div id="editcompetitorLanguageDisabled" style="float: right;width: 347px;">';
	  	html += '<div class="form-group" id="Add-editcompetitorLanguageScores-Error">';
	  	html += '<label><B>Competitor language Enabled</B></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorLanguageScores-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorLanguageScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorLanguageScores" class="nine" id="editcompetitorLanguageScores" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorLanguageScores" id="editcompetitorLanguageScores" class="nine" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorLanguageScores" class="nine" id="editcompetitorLanguageScores"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorLanguageScores" id="editcompetitorLanguageScores" class="nine" checked="checked" value="false" /></label>';
		  
	  	}
	  	html += '</div>';
	  	
	  	html += '<div class="form-group" id="Add-editcompetitorLanguageKpiScores-Error">';
	  	html += '<label><B>Competitor Language Scores</B></label>';
	  	html += '<span style="color: #a94442" id="editcompetitorLanguageKpiScores-span-Error" class="help-inline"></span><br>';
	  	if(response.competitorLanguageKpiScores==true){
	  	html += '<label for="Yes">YES:<input type="radio" name="editcompetitorLanguageKpiScores" id="editcompetitorLanguageKpiScores" class="nine"  checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
	  	html += '<label for="No">NO:<input type="radio" name="editcompetitorLanguageKpiScores" id="editcompetitorLanguageKpiScores" class="nine" value="false" /></label>';
	  	}else{
	  		html += '<label for="Yes">YES:<input type="radio" name="editcompetitorLanguageKpiScores" id="editcompetitorLanguageKpiScores" class="nine"  value="true" /></label>&nbsp;&nbsp;&nbsp;';
		  	html += '<label for="No">NO:<input type="radio" name="editcompetitorLanguageKpiScores" id="editcompetitorLanguageKpiScores" class="nine" checked="checked"  value="false" /></label>';
	  	}
	  	html += '</div>';
	  	html += '</div>';
	  	
		html += '<div class="form-group" id="Add-downloadExcel-Error">';
		html += '<label><B>Download Excel</B></label><br>';
	  	html +='<input type="button" class="btn btn-info btn-xs" onclick="exportClientDeatails('+response.apiUserId+')" value="Export Client Data">';
	  	html +='<br>';
	  	html += '</div>';
	  	
	  	 //export excel
	    //excel hidden
		html += '<label><B>You want to upload organization</B></label><br>';
		html += '<label for="Yes">YES:<input type="radio" name="organizationExcelYesOrNo" id="organizationExcelYesOrNo" onclick="yesOrNoExcelUpload()" checked="checked" value="true" /></label>&nbsp;&nbsp;&nbsp;';
		html += '<label for="No">NO:<input type="radio" name="organizationExcelYesOrNo" id="organizationExcelYesOrNo" onclick="yesOrNoExcelUpload()" value="false" /></label>';
		
	  	html += '<div id="excelUploadHiddenDiv">';
	  	
	  	html += '<div class="form-group" id="Add-files-Error">';
		html += '<div style="display: none;" id="editFileErrorDiv"><p style="color:red">Error In excel please download excel</p>';
	  	html += '</div>';
	  	html+=	 '<span id="uploadIndustryKpiExcelSpanError"></span>';
		html+=	 '<span id="downloadIndustryKpiExcelSpan"></span>';
	  	html += '<label><B>Upload Excel</B></label><br>';
	  	html+=	'<p style="color:green">The system only accepts .xlsx and .xls extension</p>';
	  	html += '<span style="color: #a94442" id="files-span-Error" class="help-inline"></span>';
	  	html+=	'<input type="file" name="files" id="files" multiple="multiple">';
	  	html+='</div>';
	 	//excel close div
	  	html+='</div><br>';
	  	
	  	html += '<input type="button" id="editsubbutton5" class="btn btn-primary" value="Update" onClick="updateSettings()">';
	  	html+=	'<input type="button" id="editCancel" class="btn btn-default" value="Cancel" onClick=redirectView("../apiUser/list.htm")>';
	  	html += '</form>';
	  	return html;
	  }
  
  
  function updateSettings(){
	    $('#editFileErrorDiv').hide();
	    $('#downloadIndustryKpiErrorsExcelButton').hide();
		$('#editApiSettingsErrorDiv').hide();
		$('#editApiSettingsSuccessDiv').hide();
		$('#files-span-Error').removeClass('has-error has-feedback');
		$('.help-inline').html('');
		$('#Add-files-Error').removeClass('has-error has-feedback');
		$('#editmaxNumberOfTradeReviews-span-Error').removeClass('has-error has-feedback');
		$('.help-inline').html('');
		$('#Add-editmaxNumberOfTradeReviews-Error').removeClass('has-error has-feedback');
		$('#editmaxNumberOfMentions-span-Error').removeClass('has-error has-feedback');
		$('.help-inline').html('');
		$('#Add-editmaxNumberOfMentions-Error').removeClass('has-error has-feedback');
		
		var userId=$("#edithiddenUserId").val();
		var maxCompetitorPerHotels=$("#editmaximumCompetitorPerHotel").val();
		var selected1 = $("input[type='radio'][name='edittradeReviews']:checked");
		var tradeReviews = selected1.val();
		/*var selected2 = $("input[type='radio'][name='editreviewScores']:checked");
		var reviewScores = selected2.val();*/
		var selected3 = $("input[type='radio'][name='editshowOriginalScores']:checked");
		var showOriginalScores = selected3.val();
		/*var selected4 = $("input[type='radio'][name='editsentimentReviewValue']:checked");
		var sentimentReviewValue = selected4.val();*/
		var selected5 = $("input[type='radio'][name='editshowSocialMentions']:checked");
		var showSocialMentions = selected5.val();
		var selected6 = $("input[type='radio'][name='editshowOverallReviewVolumeCount']:checked");
		var showOverallReviewVolumeCount = selected6.val();
		var selected7 = $("input[type='radio'][name='editshowOverallReferenceVolumeCount']:checked");
		var showOverallReferenceVolumeCount = selected7.val();
		var maxNumberOfTradeReviews = $.trim($('#editmaxNumberOfTradeReviews').val());
		var maxNumberOfMentions = $.trim($('#editmaxNumberOfMentions').val());
		var selected8 = $("input[type='radio'][name='editrepufactor']:checked");
		var repufactor = selected8.val();
		var selected9 = $("input[type='radio'][name='editscores']:checked");
		var scores = selected9.val();
		var selected10 = $("input[type='radio'][name='editkpiScores']:checked");
		var kpiScores = selected10.val();
		var selected11 = $("input[type='radio'][name='editdepartment']:checked");
		var department = selected11.val();
		var selected12 = $("input[type='radio'][name='editdepartmentScores']:checked");
		var departmentScores = selected12.val();
		var selected13 = $("input[type='radio'][name='editdepartmentKpiScores']:checked");
		var departmentKpiScores = selected13.val();
		var selected14 = $("input[type='radio'][name='editsource']:checked");
		var source = selected14.val();
		var selected15 = $("input[type='radio'][name='editsourceScores']:checked");
		var sourceScores = selected15.val();
		var selected16 = $("input[type='radio'][name='editsourceKpiScores']:checked");
		var sourceKpiScores = selected16.val();
		var selected17 = $("input[type='radio'][name='editlanguage']:checked");
		var language = selected17.val();
		var selected18 = $("input[type='radio'][name='editlanguageScores']:checked");
		var languageScores = selected18.val();
		var selected19 = $("input[type='radio'][name='editlanguageKpiScores']:checked");
		var languageKpiScores = selected19.val();
		
		//competitor
		var selected20 = $("input[type='radio'][name='editcompetitorRepufactor']:checked");
		var competitorRepufactor = selected20.val();
		var selected21 = $("input[type='radio'][name='editcompetitorScores']:checked");
		var competitorScores = selected21.val();
		var selected32=$("input[type='radio'][name='editcompetitorReferenceCount']:checked");
		var competitorReferenceCount = selected32.val();
		var selected22 = $("input[type='radio'][name='editcompetitorKpiScores']:checked");
		var competitorKpiScores = selected22.val();
		var selected23 = $("input[type='radio'][name='editcompetitorDepartment']:checked");
		var competitorDepartment = selected23.val();
		var selected24 = $("input[type='radio'][name='editcompetitorDepartmentScores']:checked");
		var competitorDepartmentScores = selected24.val();
		var selected25 = $("input[type='radio'][name='editcompetitorDepartmentKpiScores']:checked");
		var competitorDepartmentKpiScores = selected25.val();
		var selected26 = $("input[type='radio'][name='editcompetitorSource']:checked");
		var competitorSource = selected26.val();
		var selected27 = $("input[type='radio'][name='editcompetitorSourceScores']:checked");
		var competitorSourceScores = selected27.val();
		var selected28 = $("input[type='radio'][name='editcompetitorSourceKpiScores']:checked");
		var competitorSourceKpiScores = selected28.val();
		var selected29 = $("input[type='radio'][name='editcompetitorLanguage']:checked");
		var competitorLanguage = selected29.val();
		var selected30 = $("input[type='radio'][name='editcompetitorLanguageScores']:checked");
		var competitorLanguageScores = selected30.val();
		var selected31 = $("input[type='radio'][name='editcompetitorLanguageKpiScores']:checked");
		var competitorLanguageKpiScores = selected31.val();
		
		var selected32 = $("input[type='radio'][name='organizationExcelYesOrNo']:checked");
		var excelupload = selected32.val();
		
		if(maxCompetitorPerHotels==""){
			maxCompetitorPerHotels = 0;
		}
		if(maxNumberOfTradeReviews==""){
			maxNumberOfTradeReviews = 0;
		}if(maxNumberOfMentions==""){
			maxNumberOfMentions = 0;
		}
		console.log("fileupload clicked");
		var oMyForm = new FormData();
		oMyForm.append("file", files.files[0]);
		oMyForm.append("value",JSON.stringify({
			"userId":userId,
			"maximumCompetitorPerHotel":maxCompetitorPerHotels,
		    "tradeReviews" : tradeReviews,
		    "socialMentions" : showSocialMentions,
			"originalLanguage" : showOriginalScores,
			"reviewScore" : false,
			"repufactorScore" : false,
			"reviewVolumeCount" : showOverallReviewVolumeCount,
			"referenceValumeCount" : showOverallReferenceVolumeCount,
			"maximumTradeReviewsLimit" : maxNumberOfTradeReviews,
			"maximumSocialMentionLimit" : maxNumberOfMentions,
			"repufactor":repufactor,
			"scores":false,
			"kpiScores":kpiScores,
			"department":department,
			"departmentScores":departmentScores,
			"departmentKpiScores":departmentKpiScores,
			"language":language,
			"languageScores":languageScores,
			"languageKpiScores":languageKpiScores,
			"source":source,
			"sourceScores":sourceScores,
			"sourceKpiScores":sourceKpiScores,
			"competitorRepufactor":competitorRepufactor,
			"competitorScores":competitorScores,
			"competitorReferenceCount":competitorReferenceCount,
			"competitorKpiScores":competitorKpiScores,
			"competitorDepartment":competitorDepartment,
			"competitorDepartmentScores":competitorDepartmentScores,
			"competitorDepartmentKpiScores":competitorDepartmentKpiScores,
			"competitorLanguage":competitorLanguage,
			"competitorLanguageScores":competitorLanguageScores,
			"competitorLanguageKpiScores":competitorLanguageKpiScores,
			"competitorSource":competitorSource,
			"competitorSourceScores":competitorSourceScores,
			"competitorSourceKpiScores":competitorSourceKpiScores,
			"organizationExcelUpload":excelupload
		}));
		console.log(oMyForm);
		$.ajax({dataType : 'json',
		url : apiUserMappingUrl+"updateApiUserSettings.htm",
		data : oMyForm,
		type : "POST",
		enctype: 'application/x-www-form-urlencoded',
		processData: false, 
		contentType:false,
		success : function(response) {
			    	console.log(response);
			$('#loadMaskDiv').unmask();
	    	$('#uploadIndustryKpiErrorDiv').html('');
	    	$('#downloadIndustryKpiMasterButton').removeAttr('disabled');
	    	if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' ||  response.status=="INVALID_EXCEL" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
	    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
	    		$('#uploadIndustryKpiErrorDiv').append(html);
	    		$('#uploadIndustryKpiErrorDiv').show(600);
	            }else if(response.status=="SAVE_ERROR" || response.status=="EMPTY_TRADE_REVIEWS" || response.status=="EMPTY_COMPETITOR" || response.status=="EMPTY_SOCIAL_MENTIONS"){
					$('#editApiSettingsErrorDiv').show(600);
					console.log(response);
					if(response.errorMessage=="Excel Upload Error.Please Download Excel And Try Again"){
						$('#downloadIndustryKpiMasterButton').attr('disabled','disabled');
		    			uploadedIndustryKpiFilePath = response.successObject.industryKpiErrorsExcelPath;
			    		var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryKpiErrorsExcelButton" onclick="downloadIndustryKpiErrorsExcel()" value="Download Excel"><br>';
			    		$('#downloadIndustryKpiExcelSpan').html(html);
			    		$('#uploadIndustryKpiInfoDiv').show(600);
			    		$('#editFileErrorDiv').show(600);
					}else{
					$('#addApiSettingsErrorDiv').show(600);
					for(var i=0;i<response.errorMessageList.length;i++){
						var fieldName = response.errorMessageList[i].fieldName;
						var errorMessage = response.errorMessageList[i].message;
						$('#'+fieldName+'-span-Error').html(errorMessage);
						$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
						$('#page-wrapper').unmask();
						//scrollDown(divId);\
					}}
			        }else if( response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' ||  response.status=="INVALID_EXCEL" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
			        	$('#downloadIndustryKpiMasterButton').attr('disabled','disabled');
		    			uploadedIndustryKpiFilePath = response.successObject.industryKpiErrorsExcelPath;
			    		var html ='<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryKpiErrorsExcelButton" onclick="downloadIndustryKpiErrorsExcel()" value="Download Excel"><br>';
			    		$('#downloadIndustryKpiExcelSpan').html(html);
			    		$('#uploadIndustryKpiInfoDiv').show(600);
			    		$('#editFileErrorDiv').show(600);
		    		
			        }else if(response.status=="EXCEL_UPLOAD_ERROR"){
		    			$('#downloadIndustryKpiMasterButton').attr('disabled','disabled');
		    			uploadedIndustryKpiFilePath = response.successObject.industryKpiErrorsExcelPath;
			    		var html ='<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryKpiErrorsExcelButton" onclick="downloadIndustryKpiErrorsExcel()" value="Download Excel"><br>';
			    		$('#downloadIndustryKpiExcelSpan').html(html);
			    		$('#uploadIndustryKpiInfoDiv').show(600);
			    		$('#editFileErrorDiv').show(600);
		    		}
		    	else if(response.status=="UPLOAD_SUCCESS"){
		    		$('#uploadIndustryKpiSuccessDiv').show(600);
		    		$('#downloadIndustryKpiMaster').removeAttr('disabled');
		    	}
		    	else if(response.status=="EXCEPTION_ERROR"){
		    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
		    		$('#uploadIndustryKpiErrorDiv').append(html);
		    		$('#uploadIndustryKpiErrorDiv').show(600);
		    		$('#loadMaskDiv').unmask();
	
		    	}else if(response.status=="SAVE_SUCCESS"){
					$('#editApiSettingsSuccessDiv').show(600);
					scrollTop();
				}else if(response.status=="EXCEPTION_ERROR"){
					$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
				}}});
		return false;
		 }


function deleteApiUser(){
	$('#addAndEditApiUserDiv').hide();
	$('#deleteApiUserSuccessDiv').hide();
	selectedApiUserCheckBoxLength();
	if(selectedApiUserCheckBoxArray.length>0){
		if(confirm("Are you sure you want to delete selected item(s)?")){
			$('#loadMaskDiv').mask('Loading...');
			$('#addApiUserSuccessDiv').hide(600);
			$.ajax({
				url:apiUserMappingUrl+"delete.htm",
				type:"POST",
				data:JSON.stringify(selectedApiUserCheckBoxArray),
				contentType:"application/json",
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						selectedApiUserCheckBoxArray = [];
						var html = listApiUserResponse(response);
						$('#listApiUserFormDiv').html('');
						$('#listApiUserForm').html('');
						$('#listApiUserTab').append(html);
						$('#listApiUserTable').dataTable({ responsive: true});
						$('#deleteApiUserSuccessDiv').show(600);
						$('#loadMaskDiv').unmask();
					}else{
						$('#loadMaskDiv').mask('<font>'+response.errorMessage+'</font>');
					}
				},error:function(response){
					$('#loadMaskDiv').response(response.status+"***************"+response.statusText);
					return false;
				}
				
			});
		}
	}else{
		alert("Please select atleast one item");
		
	}
	return false;
}


var selectedApiUserCheckBoxArray = [];
function selectedApiUserCheckBoxLength(){
		if($('.apiUserCheckBox:checked').length){
			selectedApiUserCheckBoxArray = [];
			$('.apiUserCheckBox:checked').each(function(){
				selectedApiUserCheckBoxArray.push($(this).val());
			});
		}
		return false;
}

function deleteUserDeatails(userId){
	if(confirm("Are you sure user details will be deleted?")){
		$.post("../apiUser/deleteUserDetails.htm?ids="+userId,function(response){
			redirectView("../apiUser/list.htm");
	});
		}
}



//Check All Check Box
$(document).on('click',"#checkAllApiUserCheckBox",function(){
    $('.apiUserCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".apiUserCheckBox",function(){
    if($('.apiUserCheckBox:checked').length == $('.apiUserCheckBox').length) {
      $('#checkAllApiUserCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllApiUserCheckBox').prop('checked', false);
    }
});



