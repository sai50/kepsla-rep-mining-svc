$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	  $('#orgAndDate').hide();
});
/**************************************************************************************************************************
 *                     Review Age Tab method                                                                      *
**************************************************************************************************************************/

var reviewAgeUrl = "../reviewAgeConfig/";
var reviewAgeDataDiv = $('#reviewAgeDataDiv');
var reviewAgeTableId = $('#reviewAgeListTable');
var selectedReviewAgeIds = [];
/**************************************************************************************************************************
 *                     List Review Age                                                                         *
 **************************************************************************************************************************/
function reviewAgeListTab(){
	clearReviewAgeMessages();
	reviewAgeList();
}

function reviewAgeList(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('loading....');
	reviewAgeDataDiv.html('');
	$.get(reviewAgeUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = reviewAgeListFormHtml(response);
			reviewAgeDataDiv.append(html);
			$('#reviewAgeListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#reviewAgeDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		reviewAgeDataDiv.mask(response.status+"*********"+response.stautsText);
	});
	return false;
}
function reviewAgeListFormHtml(response){
	var reviewAgeList = response.successObject.reviewAgeList;
	var html = "";
	html += '<form id="reviewAgeListForm">';
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteReviewAgeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Review Age(s) Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteReviewAgeErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='reviewAgeListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllReviewAgeCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Name</th>";
	html +=	"<th>Minimum Percentage</th>";
	html +=	"<th>Maximum Percentage</th>";
	html +=	"<th>Value</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<reviewAgeList.length;i++){
		var id = reviewAgeList[i].id;
		var reviewName = reviewAgeList[i].reviewName;
		var minPercentage = reviewAgeList[i].minPercentage;
		var maxPercentage = reviewAgeList[i].maxPercentage;
		var reviewValue = reviewAgeList[i].reviewValue;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="reviewAgeCheckBox" value='+id+'></td>';
		html+=	'<td>'+reviewName+'</td>';
		html+=	'<td>'+minPercentage+'</td>';
		html+=	'<td>'+maxPercentage+'</td>';
		html+=	'<td>'+reviewValue+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editReviewAgeForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+= addDiv("ReviewAge");
	//html+=	'<div id="addAndEditReviewAgeDiv" class="SubHeading" style="display: none;"></div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Review Age                                                                         *
 **************************************************************************************************************************/
function addReviewAge(){
	  $.ajaxSetup({ cache: false });
	  $('#page-wrapper').mask('Loading...');
	  var divId = $('#addAndEditReviewAgeDiv');
	  var addMethod  = addReviewAgeFormHtml();
	  appendFormulaCalculationAddOrEditForm(divId,addMethod);//Method To Generate Add/Edit Form
	  $('#page-wrapper').unmask();
	  return false;
}
function addReviewAgeFormHtml(){
	var divId = "addAndEditReviewAgeDiv";
	var html = "";
	var formId = "addReviewAgeForm";
	html+= 	addFormHeading("Add Review Age");
	html+=	'<form class="col-sm-5" id="'+formId+'">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addReviewAgeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Review Name***************************************************** */
	html += '<div class="form-group" id="Add-reviewName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="reviewName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="reviewName" placeholder="Enter Review Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="minPercentage"   placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="maxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Review Value***************************************************** */
	html += '<div class="form-group" id="Add-reviewValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="reviewValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="reviewValue" placeholder="Enter Review Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveReviewAge()">';
	html+= appendCancelButton(getDivId("ReviewAge"),"page-wrapper");
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Review Age                                                                         *
 **************************************************************************************************************************/
function saveReviewAge(){
	var addAndEditReviewAgeDiv = $('#addAndEditReviewAgeDiv');
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addReviewAgeSuccessDiv').hide();
	$('#addReviewAgeErrorDiv').hide();
	var reviewName = $.trim($('#reviewName').val());
	var minPercentage = $.trim($('#minPercentage').val());
	var maxPercentage = $.trim($('#maxPercentage').val());
	var reviewValue  = $.trim($('#reviewValue').val());
	if(minPercentage==""){
		minPercentage = 0;
	}if(maxPercentage==""){
		maxPercentage = 0;
	}if(reviewValue==""){
		reviewValue=0;
	}
	var JSONObject = {'reviewName':reviewName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'reviewValue':reviewValue};
	$.post(reviewAgeUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addReviewAgeSuccessDiv').show(600);
			$('#addReviewAgeForm').trigger("reset");
			reviewAgeList();
			scrollDown(addAndEditReviewAgeDiv);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(addAndEditReviewAgeDiv);
			$('#addReviewAgeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Edit Review Age                                                                         *
 **************************************************************************************************************************/
function editReviewAgeForm(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditReviewAgeDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(reviewAgeUrl+"updateForm.htm?id="+id,function(response){
		var html = reviewAgeUpdateFormHtml(response);
		appendFormulaCalculationAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}

function updateReviewAge(id){
	var divId = $('#'+getDivId("ReviewAge"));
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editReviewAgeSuccessDiv').hide();
	$('#editReviewAgeErrorDiv').hide();
	var reviewName = $.trim($('#editedReviewName').val());
	var minPercentage = $.trim($('#editedMinPercentage').val());
	var maxPercentage = $.trim($('#editedMaxPercentage').val());
	var reviewValue  = $.trim($('#editedReviewValue').val());
	if(minPercentage==""){
		minPercentage = 0;
	}if(maxPercentage==""){
		maxPercentage = 0;
	}if(reviewValue==""){
		reviewValue=0;
	}
	var JSONObject = {'id':id,'reviewName':reviewName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'reviewValue':reviewValue};
	$.post(reviewAgeUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editReviewAgeSuccessDiv').show(600);
			reviewAgeList();//Recall List Method
			scrollDown(divId);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editReviewAgeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

function reviewAgeUpdateFormHtml(response){
	var reviewAge = response.successObject.reviewAge;
	var id = reviewAge.id;
	var reviewName = reviewAge.reviewName;
	var minPercentage = reviewAge.minPercentage;
	var maxPercentage = reviewAge.maxPercentage;
	var reviewValue = reviewAge.reviewValue;
	var html = "";
	html+=	addFormHeading("Edit Review Age");
	html+=	'<form class="col-sm-5" id="editReviewAgeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editReviewAgeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Review Name***************************************************** */
	html += '<div class="form-group" id="Edit-reviewName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-reviewName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+reviewName+'"  class="form-control input-sm" id="editedReviewName" placeholder="Enter Review Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+minPercentage+'" class="form-control input-sm" id="editedMinPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+maxPercentage+'" class="form-control input-sm" id="editedMaxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Review Value***************************************************** */
	html += '<div class="form-group" id="Edit-reviewValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-reviewValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+reviewValue+'" class="form-control input-sm" id="editedReviewValue" placeholder="Enter Review Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateReviewAge('+id+')">';
	html+= appendCancelButton(getDivId("ReviewAge"),"page-wrapper");
	html += '</form>';
	return html;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllReviewAgeCheckBox",function(){
    $('.reviewAgeCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".reviewAgeCheckBox",function(){
    if($('.reviewAgeCheckBox:checked').length == $('.reviewAgeCheckBox').length) {
      $('#checkAllReviewAgeCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllReviewAgeCheckBox').prop('checked', false);
    }
});
/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteReviewAge(){
	var ids = selectedIds('reviewAgeCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			/**********************New Div Changes****************************/
			$('#addAndEditReviewAgeDiv').hide();//Hiding Add/Edit Form
			clearReviewAgeMessages();//Clearing All Error/Success Message Divs
			/**********************New Div Changes****************************/
			$.ajax({
				type:"POST",
				url:reviewAgeUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						//$('#reviewAgeTabButtons').hide();
						var html = reviewAgeListFormHtml(response);
						reviewAgeDataDiv.html(html);
						$('#deleteReviewAgeSuccessDiv').show(600);
						$('#reviewAgeListTable').dataTable();
						$('#page-wrapper').unmask();
						selectedReviewAgeIds = [];
						
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteReviewAgeErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteReviewAgeErrorDiv').append(errorMessage);
						$('#deleteReviewAgeErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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


/**************************************************************************************************************************
 *                     Organization Volume Tab                                                                         *
**************************************************************************************************************************/
var organizationVolumeUrl = "../organizationVolumeConfig/";
var selectedOrganizationVolumeIds = [];
/**************************************************************************************************************************
 *                     List Organization Volume                                                                         *
 **************************************************************************************************************************/
function organizationVolumeListTab(){
	clearorganizationVolumeMessages();
	organizationVolumeList();
}

function organizationVolumeList(){
	$('#page-wrapper').mask('loading....');
	$('#organizationVolumeTab').html('');
	$.get(organizationVolumeUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = organizationVolumeListFormHtml(response);
			$('#organizationVolumeTab').append(html);
			$('#organizationVolumeListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.stautsText);
	});
	return false;
}

function organizationVolumeListFormHtml(response){
	var organizationVolumeList = response.successObject.organizationVolumeList;
	var html = "";
	html+=	addHeaderButtons("addOrganizationVolume", "deleteOrganizationVolume", "organizationVolumeTabButtons")
	html+=	'<div id="organizationVolumeDataDiv">';
	html += '<form id="organizationVolumeListForm">';
	/**************************Add Geo City Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addOrganizationVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Volume Added Successfully</div>';
	/**************************Edit Geo City Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editOrganizationVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Volume Updated Successfully</div>';
	/**************************Delete Geo City Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteOrganizationVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Volume Deleted Successfully</div>';
	/**************************Delete Geo City Error Div*********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationVolumeErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='organizationVolumeListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllOrganizationVolumeCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Name</th>";
	html +=	"<th>Minimum Percentage</th>";
	html +=	"<th>Maximum Percentage</th>";
	html +=	"<th>Value</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<organizationVolumeList.length;i++){
		var id = organizationVolumeList[i].id;
		var organizationVolumeName = organizationVolumeList[i].volumeName;
		var minPercentage = organizationVolumeList[i].minPercentage;
		var maxPercentage = organizationVolumeList[i].maxPercentage;
		var organizationVolumeValue = organizationVolumeList[i].volumeValue;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationVolumeCheckBox" value='+id+'></td>';
		html+=	'<td>'+organizationVolumeName+'</td>';
		html+=	'<td>'+minPercentage+'</td>';
		html+=	'<td>'+maxPercentage+'</td>';
		html+=	'<td>'+organizationVolumeValue+'</td>';
		html+=	 '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editOrganizationVolumeForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("OrganizationVolume");//Appending Div
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Organization Volume                                                                     *
 **************************************************************************************************************************/
function addOrganizationVolume(){
	  $.ajaxSetup({ cache: false });
	  var divId = $('#addAndEditOrganizationVolumeDiv');
	  $('#page-wrapper').mask('Loading...');
	  var html = addOrganizationVolumeFormHtml();
	  appendOrganizationVolumeAddOrEditForm(divId, html);//Adding Form To Div
	  $('#page-wrapper').unmask();
	  return false;
}
function addOrganizationVolumeFormHtml(){
	var html = "";
	html+=	addFormHeading("Add Organization Volume");
	html+=	'<form class="col-sm-5" id="addOrganizationVolumeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addOrganizationVolumeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Volume Name***************************************************** */
	html += '<div class="form-group" id="Add-OrganizationVolume-volumeName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="OrganizationVolume-volumeName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationVolumeName" placeholder="Enter Organization Volume Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-OrganizationVolume-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="OrganizationVolume-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="minPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-OrganizationVolume-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="OrganizationVolume-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="maxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Review Value***************************************************** */
	html += '<div class="form-group" id="Add-OrganizationVolume-volumeValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="OrganizationVolume-volumeValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationVolumeValue" placeholder="Enter Organization Volume Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrganizationVolume()">';
	html+=	appendCancelButton(getDivId("OrganizationVolume"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Organization Volume                                                                         *
 **************************************************************************************************************************/
function saveOrganizationVolume(){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+ getDivId("OrganizationVolume"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addOrganizationVolumeSuccessDiv').hide();
	$('#addOrganizationVolumeErrorDiv').hide();
	var name = $.trim($('#organizationVolumeName').val());
	var minPercentage = convertToZero($.trim($('#minPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#maxPercentage').val()));
	var value = convertToZero($.trim($('#organizationVolumeValue').val()));
	
	var JSONObject = {'volumeName':name,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'volumeValue':value};
	console.log(JSONObject);
	$.post(organizationVolumeUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addOrganizationVolumeSuccessDiv').show(600);
			var tabButtonsId = $('#organizationVolumeTabButtons');
			var dataDivId = $('#organizationVolumeDataDiv');
			var successDivId = "addOrganizationVolumeSuccessDiv";
			var tableId = "organizationVolumeListTable";
			var html = organizationVolumeListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(divId);
			$('#addOrganizationVolumeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-OrganizationVolume-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#OrganizationVolume-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Edit Organization Volume                                                                         *
 **************************************************************************************************************************/
function editOrganizationVolumeForm(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditOrganizationVolumeDiv');
	$.get(organizationVolumeUrl+"updateForm.htm?id="+id,function(response){
		var html = organizationVolumeUpdateFormHtml(response);
		appendOrganizationVolumeAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function organizationVolumeUpdateFormHtml(response){
	var organizationVolume = response.successObject.organizationVolume;
	var id = organizationVolume.id;
	var volumeName = organizationVolume.volumeName;
	var minPercentage = organizationVolume.minPercentage;
	var maxPercentage = organizationVolume.maxPercentage;
	var volumeValue = organizationVolume.volumeValue;
	var html = "";
	html+=	addFormHeading("Edit Organization Volume");
	html+=	'<form class="col-sm-5" id="editOrganizationVolumeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editOrganizationVolumeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Volume Name***************************************************** */
	html += '<div class="form-group" id="Edit-OrganizationVolume-volumeName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-OrganizationVolume-volumeName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+volumeName+'"  class="form-control input-sm" id="editedOrganizationVolumeName" placeholder="Enter Organization Volume Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-OrganizationVolume-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-OrganizationVolume-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+minPercentage+'" class="form-control input-sm" id="editedMinPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-OrganizationVolume-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-OrganizationVolume-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+maxPercentage+'" class="form-control input-sm" id="editedMaxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Organization Volume Value***************************************************** */
	html += '<div class="form-group" id="Edit-OrganizationVolume-volumeValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-OrganizationVolume-volumeValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+volumeValue+'" class="form-control input-sm" id="editedOrganizationVolumeValue" placeholder="Enter Organization Volume Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganizationVolume('+id+')">';
	html+=	appendCancelButton(getDivId("OrganizationVolume"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}

function updateOrganizationVolume(id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+ getDivId("OrganizationVolume"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editOrganizationVolumeSuccessDiv').hide();
	$('#editOrganizationVolumeErrorDiv').hide();
	var name = convertToZero($.trim($('#editedOrganizationVolumeName').val()));
	var minPercentage = convertToZero($.trim($('#editedMinPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#editedMaxPercentage').val()));
	var value = convertToZero($.trim($('#editedOrganizationVolumeValue').val()));
	var JSONObject = {'id':id,'volumeName':name,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'volumeValue':value};
	$.post(organizationVolumeUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#organizationVolumeTabButtons');
			var dataDivId = $('#organizationVolumeDataDiv');
			var successDivId = "editOrganizationVolumeSuccessDiv";
			var tableId= "organizationVolumeListTable";
			var html = organizationVolumeListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editOrganizationVolumeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-OrganizationVolume-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-OrganizationVolume-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllOrganizationVolumeCheckBox",function(){
    $('.organizationVolumeCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".organizationVolumeCheckBox",function(){
    if($('.organizationVolumeCheckBox:checked').length == $('.organizationVolumeCheckBox').length) {
      $('#checkAllOrganizationVolumeCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllOrganizationVolumeCheckBox').prop('checked', false);
    }
});
/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteOrganizationVolume(){
	var ids = selectedIds('organizationVolumeCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteOrganizationVolumeSuccessDiv').hide();
			$('#deleteOrganizationVolumeErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:organizationVolumeUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#organizationVolumeTabButtons');
						var dataDivId = $('#organizationVolumeDataDiv');
						var successDivId = "deleteOrganizationVolumeSuccessDiv";
						var tableId= "organizationVolumeListTable";
						var html = organizationVolumeListFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#page-wrapper').unmask();
						selectedOrganizationVolumeIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteOrganizationVolumeErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteOrganizationVolumeErrorDiv').append(errorMessage);
						$('#deleteOrganizationVolumeErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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
function appendOrganizationVolumeAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearOrganizationVolumeMessages();//Clearing Role Error/Sucess Message Div
}

function selectedOrganizationVolumeCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.organizationVolumeCheckBox:checked').length) {
		selectedOrganizationVolumeIds = [];
		$('.organizationVolumeCheckBox:checked').each(function() {
			selectedOrganizationVolumeIds.push($(this).val());
		});
	}
	return false;
}
/**************************************************************************************************************************
 *                     Source Popularity Tab                                                                         *
**************************************************************************************************************************/
function sourcePopularityListTab(){
	clearSourcePopularityMessages();
	sourcePopularityList();
}
var sourcePopularityUrl = "../sourcePopularityConfig/";
var selectedSourcePopularityIds = [];
/**************************************************************************************************************************
 *                     List Source Popularity                                                                         *
 **************************************************************************************************************************/
function sourcePopularityList(){
	$('#page-wrapper').mask('loading....');
	$('#sourcePopularityTab').html('');
	$.get(sourcePopularityUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = sourcePopularityListFormHtml(response);
			$('#sourcePopularityTab').append(html);
			$('#sourcePopularityListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.stautsText);
	});
	return false;
}

function sourcePopularityListFormHtml(response){
	console.log(response);
	var sourcePopularityList = response.successObject.sourcePopularityList;
	
	var html = "";
	html+= addHeaderButtons("addSourcePopularity", "deleteSourcePopularity", "sourcePopularityTabButtons");
	
	html+=	'<div id="sourcePopularityDataDiv">';
	html += '<form id="sourcePopularityListForm">';
	
	/**************************Add Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addSourcePopularitySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Source Popularity Added Successfully</div>';
	/**************************Edit Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editSourcePopularitySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Source Popularity Updated Successfully</div>';
	/**************************Delete Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteSourcePopularitySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Source Popularity/Popularities Deleted Successfully</div>';
	/**************************Delete Role Error Div*********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteSourcePopularityErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='sourcePopularityListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllSourcePopularityCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Name</th>";
	html +=	"<th>Minimum Percentage</th>";
	html +=	"<th>Maximum Percentage</th>";
	html +=	"<th>Value</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<sourcePopularityList.length;i++){
		var id = sourcePopularityList[i].id;
		var sourceName = sourcePopularityList[i].sourceName;
		var minPercentage = sourcePopularityList[i].minPercentage;
		var maxPercentage = sourcePopularityList[i].maxPercentage;
		var sourceValue = sourcePopularityList[i].sourceValue;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="sourcePopularityCheckBox" value='+id+'></td>';
		html+=	'<td>'+sourceName+'</td>';
		html+=	'<td>'+minPercentage+'</td>';
		html+=	'<td>'+maxPercentage+'</td>';
		html+=	'<td>'+sourceValue+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editSourcePopularityForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("SourcePopularity");
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Source Popularity                                                                     *
 **************************************************************************************************************************/
function addSourcePopularity(){
	  $.ajaxSetup({ cache: false });
		var divId = $('#addAndEditSourcePopularityDiv');
		$('#page-wrapper').mask('Loading...');
		var html = addSourcePopularityFormHtml();
		appendSourcePopularityAddOrEditForm(divId, html);//Adding Form To Div
		$('#page-wrapper').unmask();
		return false;
}
function addSourcePopularityFormHtml(){
	var html = "";
	html+=	addFormHeading("Add Source Popularity");
	html+=	'<form class="col-sm-5" id="addSourcePopularityForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addSourcePopularityErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Source Popularity Name***************************************************** */
	html += '<div class="form-group" id="Add-SourcePopularity-sourceName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourcePopularity-sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sourcePopularityName" placeholder="Enter Source Popularity Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-SourcePopularity-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourcePopularity-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="minPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-SourcePopularity-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourcePopularity-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="maxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Source Popularity Value***************************************************** */
	html += '<div class="form-group" id="Add-SourcePopularity-sourceValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourcePopularity-sourceValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sourcePopularityValue" placeholder="Enter Source Popularity Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveSourcePopularity()">';
	html+=	appendCancelButton(getDivId("SourcePopularity"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Source Popularity                                                                         *
 **************************************************************************************************************************/
function saveSourcePopularity(){
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	var divId = $('#'+getDivId("SourcePopularity"));
	$('.form-group').removeClass('has-error has-feedback');
	$('#addSourcePopularitySuccessDiv').hide();
	$('#addSourcePopularityErrorDiv').hide();
	var sourceName = $.trim($('#sourcePopularityName').val());
	var minPercentage = convertToZero($.trim($('#minPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#maxPercentage').val()));
	var sourceValue = convertToZero($.trim($('#sourcePopularityValue').val()));
	var JSONObject = {'sourceName':sourceName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'sourceValue':sourceValue};
	$.post(sourcePopularityUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			var tabButtonsId = $('#sourcePopularityTabButtons');
			var dataDivId = $('#sourcePopularityDataDiv');
			var successDivId = "addSourcePopularitySuccessDiv";
			var tableId = "sourcePopularityListTable";
			var html = sourcePopularityListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(divId);
			$('#addSourcePopularityErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-SourcePopularity-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#SourcePopularity-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Edit Source Popularity                                                                        *
 **************************************************************************************************************************/
function editSourcePopularityForm(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditSourcePopularityDiv');
	$.get(sourcePopularityUrl+"updateForm.htm?id="+id,function(response){
		var html = sourcePopularityUpdateFormHtml(response);
		appendSourcePopularityAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function sourcePopularityUpdateFormHtml(response){
	var sourcePopularity = response.successObject.sourcePopularity;
	var id = sourcePopularity.id;
	var sourceName = sourcePopularity.sourceName;
	var minPercentage = sourcePopularity.minPercentage;
	var maxPercentage = sourcePopularity.maxPercentage;
	var sourceValue = sourcePopularity.sourceValue;
	var html = "";
	html+=	addFormHeading("Edit Source Popularity");
	html+=	'<form class="col-sm-5" id="editSourcePopularityForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editSourcePopularityErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Source Popularity Name***************************************************** */
	html += '<div class="form-group" id="Edit-SourcePopularity-sourceName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourcePopularity-sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+sourceName+'"  class="form-control input-sm" id="editedSourcePopularityName" placeholder="Enter Source Popularity Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-SourcePopularity-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourcePopularity-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+minPercentage+'" class="form-control input-sm" id="editedMinPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-SourcePopularity-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourcePopularity-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+maxPercentage+'" class="form-control input-sm" id="editedMaxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Source Popularity Value***************************************************** */
	html += '<div class="form-group" id="Edit-SourcePopularity-sourceValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourcePopularity-sourceValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+sourceValue+'" class="form-control input-sm" id="editedSourcePopularityValue" placeholder="Enter Source Popularity Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateSourcePopularity('+id+')">';
	html+=	appendCancelButton(getDivId("SourcePopularity"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}

function updateSourcePopularity(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("SourcePopularity"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editSourcePopularitySuccessDiv').hide();
	$('#editSourcePopularityErrorDiv').hide();
	var sourceName = $.trim($('#editedSourcePopularityName').val());
	var minPercentage = convertToZero($.trim($('#editedMinPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#editedMaxPercentage').val()));
	var sourceValue = convertToZero($.trim($('#editedSourcePopularityValue').val()));
	var JSONObject = {'id':id,'sourceName':sourceName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'sourceValue':sourceValue};
	console.log(JSONObject);
	$.post(sourcePopularityUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#sourcePopularityTabButtons');
			var dataDivId = $('#sourcePopularityDataDiv');
			var successDivId = "editSourcePopularitySuccessDiv";
			var tableId = "sourcePopularityListTable";
			var html = sourcePopularityListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editSourcePopularityErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				console.log(fieldName+"*****************"+errorMessage);
				$('#Edit-SourcePopularity-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-SourcePopularity-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllSourcePopularityCheckBox",function(){
    $('.sourcePopularityCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".sourcePopularityCheckBox",function(){
    if($('.sourcePopularityCheckBox:checked').length == $('.sourcePopularityCheckBox').length) {
      $('#checkAllSourcePopularityCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllSourcePopularityCheckBox').prop('checked', false);
    }
});
/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteSourcePopularity(){
	var ids = selectedIds('sourcePopularityCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteSourcePopularitySuccessDiv').hide();
			$('#deleteSourcePopularityErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:sourcePopularityUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#sourcePopularityTabButtons');
						var dataDivId = $('#sourcePopularityDataDiv');
						var successDivId = "deleteSourcePopularitySuccessDiv";
						var tableId = "sourcePopularityListTable";
						var html = sourcePopularityListFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#page-wrapper').unmask();
						selectedSourcePopularityIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteSourcePopularityErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteSourcePopularityErrorDiv').append(errorMessage);
						$('#deleteSourcePopularityErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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

function appendSourcePopularityAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearSourcePopularityMessages();//Clearing Role Error/Sucess Message Div
}
function clearSourcePopularityMessages(){
	$('#addSourcePopularitySuccessDiv,#editSourcePopularitySuccessDiv,#deleteSourcePopularitySuccessDiv,#deleteSourcePopularityErrorDiv').hide();
}

function selectedSourcePopularityCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.sourcePopularityCheckBox:checked').length) {
		selectedSourcePopularityIds = [];
		$('.roleCheckBox:checked').each(function() {
			selectedSourcePopularityIds.push($(this).val());
		});
	}
	return false;
}
/**************************************************************************************************************************
 *                     Source Volume Tab                                                                         *
**************************************************************************************************************************/

var sourceVolumeUrl = "../sourceVolumeConfig/";
var selectedSourceVolumeIds = [];
/**************************************************************************************************************************
 *                     List Source Volume                                                                         *
 **************************************************************************************************************************/
function appendSourceVolumeAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearSourceVolumeMessages();//Clearing Role Error/Sucess Message Div
}
function clearSourceVolumeMessages(){
	$('#addSourceVolumeSuccessDiv,#editSourceVolumeSuccessDiv,#deleteSourceVolumeSuccessDiv,#deleteSourceVolumeErrorDiv').hide();
}

function selectedSourceVolumeCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.sourceVolumeCheckBox:checked').length) {
		selectedSourceVolumeIds = [];
		$('.sourceVolumeCheckBox:checked').each(function() {
			selectedSourceVolumeIds.push($(this).val());
		});
	}
	return false;
}

function sourceVolumeListTab(){
	clearSourceVolumeMessages();
	sourceVolumeList();
}

function sourceVolumeList(){
	$('#page-wrapper').mask('loading....');
	$('#sourceVolumeTab').html('');
	$.get(sourceVolumeUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = sourceVolumeListFormHtml(response);
			$('#sourceVolumeTab').append(html);
			$('#sourceVolumeListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.stautsText);
	});
	return false;
}

function sourceVolumeListFormHtml(response){
	var sourceVolumeList = response.successObject.sourceVolumeList;
	var html = "";
	html+=	addHeaderButtons("addSourceVolume", "deleteSourceVolume", "sourceVolumeTabButtons");
	html+=	'<div id="sourceVolumeDataDiv">';
	html += '<form id="sourceVolumeListForm">';
	/**************************Add Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addSourceVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; sourceVolume Added Successfully</div>';
	/**************************Edit Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editSourceVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; sourceVolume Updated Successfully</div>';
	/**************************Delete Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteSourceVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; sourceVolume(s) Deleted Successfully</div>';
	/**************************Delete Role Error Div*********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteSourceVolumeErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='sourceVolumeListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllSourceVolumeCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Name</th>";
	html +=	"<th>Minimum Percentage</th>";
	html +=	"<th>Maximum Percentage</th>";
	html +=	"<th>Value</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<sourceVolumeList.length;i++){
		var id = sourceVolumeList[i].id;
		var sourceVolumeName = sourceVolumeList[i].sourceName;
		var minPercentage = sourceVolumeList[i].minPercentage;
		var maxPercentage = sourceVolumeList[i].maxPercentage;
		var sourceVolumeValue = sourceVolumeList[i].sourceValue;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="sourceVolumeCheckBox" value='+id+'></td>';
		html+=	'<td>'+sourceVolumeName+'</td>';
		html+=	'<td>'+minPercentage+'</td>';
		html+=	'<td>'+maxPercentage+'</td>';
		html+=	'<td>'+sourceVolumeValue+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editSourceVolumeForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+= addDiv("SourceVolume");
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Source Volume                                                                     *
 **************************************************************************************************************************/
function addSourceVolume(){
	$.ajaxSetup({ cache: false });
	var divId = $('#addAndEditSourceVolumeDiv');
	$('#page-wrapper').mask('Loading...');
	var html = addSourceVolumeFormHtml();
	appendSourceVolumeAddOrEditForm(divId, html);//Adding Form To Div
	$('#page-wrapper').unmask();
	return false;
}
function addSourceVolumeFormHtml(){
	var html = "";
	html+= addFormHeading("Add Source Volume");
	html+=	'<form class="col-sm-5" id="addSourceVolumeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addSourceVolumeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Source Volume Name***************************************************** */
	html += '<div class="form-group" id="Add-SourceVolume-sourceName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourceVolume-sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sourceVolumeName" placeholder="Enter Source Volume Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-SourceVolume-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourceVolume-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="minPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-SourceVolume-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourceVolume-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="maxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Source Volume Value***************************************************** */
	html += '<div class="form-group" id="Add-SourceVolume-sourceValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SourceVolume-sourceValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sourceVolumeValue" placeholder="Enter Source Volume Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveSourceVolume()">';
	html+=	appendCancelButton(getDivId("SourceVolume"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Source Volume                                                                         *
 **************************************************************************************************************************/
function saveSourceVolume(){
	$('#page-wrapper').mask('Loading...');
	var divId = $("#"+getDivId("SourceVolume"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addSourceVolumeSuccessDiv').hide();
	$('#addSourceVolumeErrorDiv').hide();
	var sourceName = $.trim($('#sourceVolumeName').val());
	var minPercentage = convertToZero($.trim($('#minPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#maxPercentage').val()));
	var sourceValue = convertToZero($.trim($('#sourceVolumeValue').val()));
	
	var JSONObject = {'sourceName':sourceName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'sourceValue':sourceValue};
	
	$.post(sourceVolumeUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			var tabButtonsId = $('#sourceVolumeTabButtons');
			var dataDivId = $('#sourceVolumeDataDiv');
			var successDivId = "addSourceVolumeSuccessDiv";
			var tableId = "sourceVolumeListTable";
			var html = sourceVolumeListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(divId);
			$('#addSourceVolumeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				console.log(fieldName+"************************************"+errorMessage);
				$('#Add-SourceVolume-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#SourceVolume-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Edit Source Volume                                                                        *
 **************************************************************************************************************************/
function editSourceVolumeForm(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditSourceVolumeDiv');
	$.get(sourceVolumeUrl+"updateForm.htm?id="+id,function(response){
		var html = sourceVolumeUpdateFormHtml(response);
		appendSourceVolumeAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function sourceVolumeUpdateFormHtml(response){
	var sourceVolume = response.successObject.sourceVolume;
	var id = sourceVolume.id;
	var sourceName = sourceVolume.sourceName;
	var minPercentage = sourceVolume.minPercentage;
	var maxPercentage = sourceVolume.maxPercentage;
	var sourceValue = sourceVolume.sourceValue;
	var html = "";
	html+=	addFormHeading("Edit Source Volume");
	html+=	'<form class="col-sm-5" id="editSourceVolumeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editSourceVolumeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Source Volume Name***************************************************** */
	html += '<div class="form-group" id="Edit-SourceVolume-sourceName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourceVolume-sourceName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+sourceName+'"  class="form-control input-sm" id="editedSourceVolumeName" placeholder="Enter Source Volume Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-SourceVolume-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourceVolume-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+minPercentage+'" class="form-control input-sm" id="editedMinPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-SourceVolume-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourceVolume-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+maxPercentage+'" class="form-control input-sm" id="editedMaxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Source Volume Value***************************************************** */
	html += '<div class="form-group" id="Edit-SourceVolume-sourceValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SourceVolume-sourceValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+sourceValue+'" class="form-control input-sm" id="editedSourceVolumeValue" placeholder="Enter Source Volume Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateSourceVolume('+id+')">';
	html+=	appendCancelButton(getDivId("SourceVolume"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}

function updateSourceVolume(id){
	var $form = $('#editSourceVolumeForm');
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("SourceVolume"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editSourceVolumeSuccessDiv').hide();
	$('#editSourceVolumeErrorDiv').hide();
	var sourceName = $.trim($('#editedSourceVolumeName').val());
	var minPercentage = convertToZero($.trim($('#editedMinPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#editedMaxPercentage').val()));
	var sourceValue = convertToZero($.trim($('#editedSourceVolumeValue').val()));
	var JSONObject = {'id':id,'sourceName':sourceName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'sourceValue':sourceValue};
	$.post(sourceVolumeUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#sourceVolumeTabButtons');
			var dataDivId = $('#sourceVolumeDataDiv');
			var successDivId = "editSourceVolumeSuccessDiv";
			var tableId = "sourceVolumeListTable";
			var html = sourceVolumeListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			console.log(response);
			$('#editSourceVolumeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				console.log(fieldName+"*******************************************"+errorMessage);
				$('#Edit-SourceVolume-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-SourceVolume-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllSourceVolumeCheckBox",function(){
    $('.sourceVolumeCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".sourceVolumeCheckBox",function(){
    if($('.sourceVolumeCheckBox:checked').length == $('.sourceVolumeCheckBox').length) {
      $('#checkAllSourceVolumeCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllSourceVolumeCheckBox').prop('checked', false);
    }
});
/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteSourceVolume(){
	var ids = selectedIds('sourceVolumeCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteSourceVolumeSuccessDiv').hide();
			$('#deleteSourceVolumeErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:sourceVolumeUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#sourceVolumeTabButtons');
						var dataDivId = $('#sourceVolumeDataDiv');
						var successDivId = "deleteSourceVolumeSuccessDiv";
						var tableId = "sourceVolumeListTable";
						var html = sourceVolumeListFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#page-wrapper').unmask();
						selectedSourceVolumeIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteSourceVolumeErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteSourceVolumeErrorDiv').append(errorMessage);
						$('#deleteSourceVolumeErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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
/**************************************************************************************************************************
 *                     Language Volume Tab                                                                         *
**************************************************************************************************************************/

function languageVolumeListTab(){
	clearLanguageVolumeMessages();
	languageVolumeList();
}

var languageVolumeUrl = "../languageVolumeConfig/";
var selectedLanguageVolumeIds = [];
/**************************************************************************************************************************
 *                     List Language Volume                                                                         *
 **************************************************************************************************************************/
function languageVolumeList(){
	$('#page-wrapper').mask('loading....');
	$('#languageVolumeTab').html('');
	$.get(languageVolumeUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = languageVolumeListFormHtml(response);
			$('#languageVolumeTab').append(html);
			$('#languageVolumeListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.stautsText);
	});
	return false;
}

function languageVolumeListFormHtml(response){
	
	var languageVolumeList = response.successObject.languageVolumeList;
	
	var html = "";
	html+=	addHeaderButtons("addLanguageVolume", "deleteLanguageVolume", "languageVolumeTabButtons");
	html+=	'<div id="languageVolumeDataDiv">';
	html += '<form id="languageVolumeListForm">';
	/**************************Add individual review Score success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addIndividualReviewScoreSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Individual Review Score Added Successfully</div>';
	
	/**************************Add Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addLanguageVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; LanguageVolume Added Successfully</div>';
	/**************************Edit Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editLanguageVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; LanguageVolume Updated Successfully</div>';
	/**************************Delete Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteLanguageVolumeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; LanguageVolume(s) Deleted Successfully</div>';
	/**************************Delete Role Error Div*********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteLanguageVolumeErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='languageVolumeListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllLanguageVolumeCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Name</th>";
	html +=	"<th>Minimum Percentage</th>";
	html +=	"<th>Maximum Percentage</th>";
	html +=	"<th>Value</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<languageVolumeList.length;i++){
		var id = languageVolumeList[i].id;
		var languageName = languageVolumeList[i].languageName;
		var minPercentage = languageVolumeList[i].minPercentage;
		var maxPercentage = languageVolumeList[i].maxPercentage;
		var languageValue = languageVolumeList[i].languageValue;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="languageVolumeCheckBox" value='+id+'></td>';
		html+=	'<td>'+languageName+'</td>';
		html+=	'<td>'+minPercentage+'</td>';
		html+=	'<td>'+maxPercentage+'</td>';
		html+=  '<td>'+languageValue+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editLanguageVolumeForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("LanguageVolume");
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Language Volume                                                                     *
 **************************************************************************************************************************/
function addLanguageVolume(){
	$.ajaxSetup({ cache: false });
	var divId = $('#addAndEditLanguageVolumeDiv');
	$('#page-wrapper').mask('Loading...');
	var html = addLanguageVolumeFormHtml();
	appendLanguageVolumeAddOrEditForm(divId, html);//Adding Form To Div
	$('#page-wrapper').unmask();
	return false;
}
function addLanguageVolumeFormHtml(){
	var html = "";
	html+= addFormHeading("Add Language Volume");
	html+=	'<form class="col-sm-5" id="addLanguageVolumeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addLanguageVolumeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Language Volume Name***************************************************** */
	html += '<div class="form-group" id="Add-LanguageVolume-languageName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="LanguageVolume-languageName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="languageVolumeName" placeholder="Enter Language Volume Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-LanguageVolume-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="LanguageVolume-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="minPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-LanguageVolume-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="LanguageVolume-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="maxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Language Volume Value***************************************************** */
	html += '<div class="form-group" id="Add-languageVolume-languageValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="LanguageVolume-languageValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="languageVolumeValue" placeholder="Enter Language Volume Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveLanguageVolume()">';
	html+=	appendCancelButton(getDivId("LanguageVolume"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Language Volume                                                                         *
 **************************************************************************************************************************/
function saveLanguageVolume(){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("LanguageVolume"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addLanguageVolumeSuccessDiv').hide();
	$('#addLanguageVolumeErrorDiv').hide();
	var languageName = $.trim($('#languageVolumeName').val());
	var minPercentage = convertToZero($.trim($('#minPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#maxPercentage').val()));
	var languageValue = convertToZero($.trim($('#languageVolumeValue').val()));
	var JSONObject = {'languageName':languageName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'languageValue':languageValue};
	console.log(JSONObject);
	$.post(languageVolumeUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			var tabButtonsId = $('#languageVolumeTabButtons');
			var dataDivId = $('#languageVolumeDataDiv');
			var successDivId = "addLanguageVolumeSuccessDiv";
			var tableId = "languageVolumeListTable";
			var html = languageVolumeListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(divId);
			$('#addLanguageVolumeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				console.log(fieldName+"***********************"+errorMessage);
				$('#Add-LanguageVolume-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#LanguageVolume-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Edit Language Volume                                                                        *
 **************************************************************************************************************************/
function editLanguageVolumeForm(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditLanguageVolumeDiv');
	$.get(languageVolumeUrl+"updateForm.htm?id="+id,function(response){
		var html = languageVolumeUpdateFormHtml(response);
		appendLanguageVolumeAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
	
}
function languageVolumeUpdateFormHtml(response){
	var languageVolume = response.successObject.languageVolume;
	var id = languageVolume.id;
	var languageName = languageVolume.languageName;
	var minPercentage = languageVolume.minPercentage;
	var maxPercentage = languageVolume.maxPercentage;
	var languageValue = languageVolume.languageValue;
	var html = "";
	html+=	addFormHeading("Edit Language Volume");
	html+=	'<form class="col-sm-5" id="editLanguageVolumeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editLanguageVolumeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Language Volume Name***************************************************** */
	html += '<div class="form-group" id="Edit-LanguageVolume-languageName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-LanguageVolume-languageName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+languageName+'"  class="form-control input-sm" id="editedLanguageVolumeName" placeholder="Enter Language Volume Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-LanguageVolume-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-LanguageVolume-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+minPercentage+'" class="form-control input-sm" id="editedMinPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-LanguageVolume-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-LanguageVolume-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+maxPercentage+'" class="form-control input-sm" id="editedMaxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Language Volume Value***************************************************** */
	html += '<div class="form-group" id="Edit-LanguageVolume-languageValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-LanguageVolume-languageValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+languageValue+'" class="form-control input-sm" id="editedLanguageVolumeValue" placeholder="Enter Language Volume Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateLanguageVolume('+id+')">';
	html+=	appendCancelButton(getDivId("LanguageVolume"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function updateLanguageVolume(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("LanguageVolume"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editLanguageVolumeSuccessDiv').hide();
	$('#editLanguageVolumeErrorDiv').hide();
	var languageName = $.trim($('#editedLanguageVolumeName').val());
	var minPercentage = $.trim($('#editedMinPercentage').val());
	var maxPercentage = $.trim($('#editedMaxPercentage').val());
	var languageValue = $.trim($('#editedLanguageVolumeValue').val());
	var JSONObject = {'id':id,'languageName':languageName,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'languageValue':languageValue};
	$.post(languageVolumeUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#languageVolumeTabButtons');
			var dataDivId = $('#languageVolumeDataDiv');
			var successDivId = "editLanguageVolumeSuccessDiv";
			var tableId = "languageVolumeListTable";
			var html = languageVolumeListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editLanguageVolumeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-LanguageVolume-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-LanguageVolume-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllLanguageVolumeCheckBox",function(){
    $('.languageVolumeCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".languageVolumeCheckBox",function(){
    if($('.languageVolumeCheckBox:checked').length == $('.languageVolumeCheckBox').length) {
      $('#checkAllLanguageVolumeCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllLanguageVolumeCheckBox').prop('checked', false);
    }
});
/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteLanguageVolume(){
	var ids = selectedIds('languageVolumeCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteLanguageVolumeSuccessDiv').hide();
			$('#deleteLanguageVolumeErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:languageVolumeUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#languageVolumeTabButtons');
						var dataDivId = $('#languageVolumeDataDiv');
						var successDivId = "deleteLanguageVolumeSuccessDiv";
						var tableId = "languageVolumeListTable";
						var html = languageVolumeListFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#page-wrapper').unmask();
						selectedLanguageVolumeIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteLanguageVolumeErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteLanguageVolumeErrorDiv').append(errorMessage);
						$('#deleteLanguageVolumeErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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

function appendLanguageVolumeAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearLanguageVolumeMessages();//Clearing Role Error/Sucess Message Div
}
function clearLanguageVolumeMessages(){
	$('#addLanguageVolumeSuccessDiv,#editLanguageVolumeSuccessDiv,#deleteLanguageVolumeSuccessDiv,#deleteLanguageVolumeErrorDiv').hide();
}

function selectedLanguageVolumeCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.languageVolumeCheckBox:checked').length) {
		selectedLanguageVolumeIds = [];
		$('.languageVolumeCheckBox:checked').each(function() {
			selectedLanguageVolumeIds.push($(this).val());
		});
	}
	return false;
}

/**************************************************************************************************************************
 *                     Sentiment Polarity Tab                                                                         *
**************************************************************************************************************************/
function sentimentPolarityListTab(){
	clearSentimentPolarityMessages();
	sentimentPolarityList();
}

var sentimentPolarityUrl = "../sentimentPolarityConfig/";
var selectedSentimentPolarityIds = [];
/**************************************************************************************************************************
 *                     List Sentiment Polarity                                                                         *
 **************************************************************************************************************************/
function sentimentPolarityList(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#sentimentPolarityTab').html('');
	$.get(sentimentPolarityUrl+"listTab.htm",function(response){
		var html = sentimentPolarityListFormHtml(response);
		$('#sentimentPolarityTab').append(html);
		$('#sentimentPolarityListTable').dataTable();
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"***********"+response.statusText);
	});
	return false;
}

function sentimentPolarityListFormHtml(response){
	var sentimentPolarityList = response.successObject.sentimentPolarityList;
	var html = "";
	html+=	addHeaderButtons("addSentimentPolarity", "deleteSentimentPolarity", "sentimentPolarityTabButtons");
	html+=	'<div id="sentimentPolarityDataDiv">';
	html += '<form id="sentimentPolarityListForm">';
	/**************************Add Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addSentimentPolaritySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; SentimentPolarity Added Successfully</div>';
	/**************************Edit Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editSentimentPolaritySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; SentimentPolarity Updated Successfully</div>';
	/**************************Delete Role Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteSentimentPolaritySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; SentimentPolarity(s) Deleted Successfully</div>';
	/**************************Delete Role Error Div*********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteSentimentPolarityErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='sentimentPolarityListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllSentimentPolarityCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Name</th>";
	html +=	"<th>Minimum Percentage</th>";
	html +=	"<th>Maximum Percentage</th>";
	html +=	"<th>Value</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<sentimentPolarityList.length;i++){
		var id = sentimentPolarityList[i].id;
		var sentimentPolarityName = sentimentPolarityList[i].sentimentName;
		var minPercentage = sentimentPolarityList[i].minPercentage;
		var maxPercentage = sentimentPolarityList[i].maxPercentage;
		var sentimentPolarityValue = sentimentPolarityList[i].sentimentValue;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="sentimentPolarityCheckBox" value='+id+'></td>';
		html+=	'<td>'+sentimentPolarityName+'</td>';
		html+=	'<td>'+minPercentage+'</td>';
		html+=	'<td>'+maxPercentage+'</td>';
		html+=	'<td>'+sentimentPolarityValue+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editSentimentPolarityForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("SentimentPolarity");
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Sentiment Polarity                                                                     *
 **************************************************************************************************************************/
function addSentimentPolarity(){
	$.ajaxSetup({ cache: false });
	var divId = $('#addAndEditSentimentPolarityDiv');
	$('#page-wrapper').mask('Loading...');
	var html = addSentimentPolarityFormHtml();
	appendSentimentPolarityAddOrEditForm(divId, html);//Adding Form To Div
	$('#page-wrapper').unmask();
	return false;
}
function addSentimentPolarityFormHtml(){
	var html = "";
	html+=	addFormHeading("Add Sentiment Polarity");
	html+=	'<form class="col-sm-5" id="addSentimentPolarityForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addSentimentPolarityErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Sentiment Polarity Name***************************************************** */
	html += '<div class="form-group" id="Add-SentimentPolarity-sentimentName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SentimentPolarity-sentimentName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sentimentPolarityName" placeholder="Enter Sentiment Polarity Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-SentimentPolarity-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SentimentPolarity-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="minPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Add-SentimentPolarity-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SentimentPolarity-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="maxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Sentiment Polarity Value***************************************************** */
	html += '<div class="form-group" id="Add-SentimentPolarity-sentimentValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="SentimentPolarity-sentimentValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="sentimentPolarityValue" placeholder="Enter Sentiment Polarity Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveSentimentPolarity()">';
	html+=	appendCancelButton(getDivId("SentimentPolarity"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}
/**************************************************************************************************************************
 *                     Save Sentiment Polarity                                                                         *
 **************************************************************************************************************************/
function saveSentimentPolarity(){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+ getDivId("SentimentPolarity"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addSentimentPolaritySuccessDiv').hide();
	$('#addSentimentPolarityErrorDiv').hide();
	var name = $.trim($('#sentimentPolarityName').val());
	var minPercentage = convertToZero($.trim($('#minPercentage').val()));
	var maxPercentage = convertToZero($.trim($('#maxPercentage').val()));
	var value = convertToZero($.trim($('#sentimentPolarityValue').val()));
	
	var JSONObject = {'sentimentName':name,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'sentimentValue':value};
	
	$.post(sentimentPolarityUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			var tabButtonsId = $('#sentimentPolarityTabButtons');
			var dataDivId = $('#sentimentPolarityDataDiv');
			var successDivId = "addSentimentPolaritySuccessDiv";
			var tableId = "sentimentPolarityListTable";
			var html = sentimentPolarityListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			scrollDown(divId);
			$('#addSentimentPolarityErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				console.log(fieldName+"::::::::::::::::::::::::::::::::"+errorMessage);
				$('#Add-SentimentPolarity-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#SentimentPolarity-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}
/**************************************************************************************************************************
 *                     Edit Sentiment Polarity                                                                        *
 **************************************************************************************************************************/
function editSentimentPolarityForm(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditSentimentPolarityDiv');
	$.get(sentimentPolarityUrl+"updateForm.htm?id="+id,function(response){
		var html = sentimentPolarityUpdateFormHtml(response);
		appendSentimentPolarityAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function sentimentPolarityUpdateFormHtml(response){
	var sentimentPolarity = response.successObject.sentimentPolarity;
	var id = sentimentPolarity.id;
	var sentimentName = sentimentPolarity.sentimentName;
	var minPercentage = sentimentPolarity.minPercentage;
	var maxPercentage = sentimentPolarity.maxPercentage;
	var sentimentValue = sentimentPolarity.sentimentValue;
	var html = "";
	html+=	addFormHeading("Edit Sentiment Polarity");
	html+=	'<form class="col-sm-5" id="editSentimentPolarityForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editSentimentPolarityErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Sentiment Polarity Name***************************************************** */
	html += '<div class="form-group" id="Edit-SentimentPolarity-sentimentName-Error">';
	html += '<label>Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SentimentPolarity-sentimentName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+sentimentName+'"  class="form-control input-sm" id="editedSentimentPolarityName" placeholder="Enter Sentiment Polarity Name" maxlength="50">';
	html += '</div>';
	/** ************************************Minimum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-SentimentPolarity-minPercentage-Error">';
	html += '<label>Min Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SentimentPolarity-minPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+minPercentage+'" class="form-control input-sm" id="editedMinPercentage" placeholder="Enter Minimum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Maximum Percentage***************************************************** */
	html += '<div class="form-group" id="Edit-SentimentPolarity-maxPercentage-Error">';
	html += '<label>Max Percentage<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SentimentPolarity-maxPercentage-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+maxPercentage+'" class="form-control input-sm" id="editedMaxPercentage" placeholder="Enter Maximum Percentage" maxlength="50">';
	html += '</div>';
	/** ************************************Sentiment Polarity Value***************************************************** */
	html += '<div class="form-group" id="Edit-SentimentPolarity-sentimentValue-Error">';
	html += '<label>Volume<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-SentimentPolarity-sentimentValue-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+sentimentValue+'" class="form-control input-sm" id="editedSentimentPolarityValue" placeholder="Enter Sentiment Polarity Value" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateSentimentPolarity('+id+')">';
	html+=	appendCancelButton(getDivId("SentimentPolarity"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function updateSentimentPolarity(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("SentimentPolarity"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editSentimentPolaritySuccessDiv').hide();
	$('#editSentimentPolarityErrorDiv').hide();
	var name = $.trim($('#editedSentimentPolarityName').val());
	var minPercentage = $.trim($('#editedMinPercentage').val());
	var maxPercentage = $.trim($('#editedMaxPercentage').val());
	var value = $.trim($('#editedSentimentPolarityValue').val());
	var JSONObject = {'id':id,'sentimentName':name,'minPercentage':minPercentage,'maxPercentage':maxPercentage,'sentimentValue':value};
	$.post(sentimentPolarityUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#sentimentPolarityTabButtons');
			var dataDivId = $('#sentimentPolarityDataDiv');
			var successDivId = "editSentimentPolaritySuccessDiv";
			var tableId = "sentimentPolarityListTable";
			var html = sentimentPolarityListFormHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editSentimentPolarityErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				console.log(fieldName+"::::::::::::::::::::::"+errorMessage);
				$('#Edit-SentimentPolarity-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-SentimentPolarity-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllSentimentPolarityCheckBox",function(){
    $('.sentimentPolarityCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".sentimentPolarityCheckBox",function(){
    if($('.sentimentPolarityCheckBox:checked').length == $('.sentimentPolarityCheckBox').length) {
      $('#checkAllSentimentPolarityCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllSentimentPolarityCheckBox').prop('checked', false);
    }
});
/********************************************************************************************************************************************
 **********************D e l e t e************************************************************************************************************
 **********************************************************************************************************************************************/
function deleteSentimentPolarity(){
	var ids = selectedIds('sentimentPolarityCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#deleteSentimentPolaritySuccessDiv').hide();
			$('#deleteSentimentPolarityErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:sentimentPolarityUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#sentimentPolarityTabButtons');
						var dataDivId = $('#sentimentPolarityDataDiv');
						var successDivId = "deleteSentimentPolaritySuccessDiv";
						var tableId = "sentimentPolarityListTable";
						var html = sentimentPolarityListFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#page-wrapper').unmask();
						selectedSentimentPolarityIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteSentimentPolarityErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteSentimentPolarityErrorDiv').append(errorMessage);
						$('#deleteSentimentPolarityErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
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

function appendSentimentPolarityAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearSentimentPolarityMessages();//Clearing Role Error/Sucess Message Div
}
function clearSentimentPolarityMessages(){
	$('#addSentimentPolaritySuccessDiv,#editSentimentPolaritySuccessDiv,#deleteSentimentPolaritySuccessDiv,#deleteSentimentPolarityErrorDiv').hide();
}

function selectedSentimentPolarityCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.geoSentimentPolarityCheckBox:checked').length) {
		selectedSentimentPolarityIds = [];
		$('.roleCheckBox:checked').each(function() {
			selectedSentimentPolarityIds.push($(this).val());
		});
	}
	return false;
}


/**************************************************************************************************************************
 *******************************************************Sravan*************************************************************
 **************************************************************************************************************************/
function reputationFactorIndicatorList(){
	var id = "reputationFactor";
	var url = "../configReputationFactor/";
	getList(id, url,"NO");
}

function languageFactorIndicatorList(){
	var id = "languageFactor";
	var url = "../configLanguageFactor/";
	getList(id, url,"NO");
}


function sourceFactorIndicatorList(){
	var id = "sourceFactor";
	var url = "../configSourceFactor/";
	getList(id, url,"NO");
}

function deptPerformanceIndicatorList(){
	var id = "departmentPerformanceFactor";
	var url = "../configDepartmentPerformanceFactor/";
	getList(id, url,"NO");
}

function keyPerformanceIndicatorList(){
	var id = "keyPerformanceFactor";
	var url = "../configKeyPerformanceFactor/";
	getList(id, url,"NO");
}

function individualReviewScoreList(){
	var id = "individualReviewScore";
	var url = "../configIndividuvalReviewScoreFactor/";
	//getIndividualReviewScoreList(id, url,"NO");
	$.get(url+"/list.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			getIndividualReviewScoreList(response,id);
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	
}


function getIndividualReviewScoreList(response,id){
	var length = response.successObject.configIndividualReviewScoreFactorList.length;
	var object = "";
	if(length>0){
		object=response.successObject.configIndividualReviewScoreFactorList[0];
	}
	//$('#page-wrapper').mask('Loading');
	$('#'+id+'IndicatorTab').html('');
	console.log('#'+id+'IndicatorTab');
	var html="";
	html += '<div class="alert alert-success" style="display: none;" id="addIndividualSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Individual Review Score Added Successfully';
	html += '</div>';
	html += '<div class="alert alert-warning" style="display: none;" id="IndividualReviewErroDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Source Polarity value shoudl be greater than 0 and less than 100';
	html += '</div>';
	html += '<div class="alert alert-warning" style="display: none;" id="IndividualReviewOccured">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Scource Polarity Should Not be Blank';
	html += '</div>';
	html += '<div class="alert alert-warning" style="display: none;" id="IndividualReviewErorString">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Scource Polarity Should be Numbers Only';
	html += '</div>';
	html += '<div class="alert alert-warning" style="display: none;" id="IndividualReviewErorForInt">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Scource Polarity value Should be Integer only';
	html += '</div>';
	html += '<div class="col-xs-12" >';
		html += '<div class="form-group col-xs-4" id="Add-scourcePolarity-Error">';
			html += '<label>Semantria Score</label>';
			html += '<span style="color: #a94442" id="scourcePolarity-span-Error" class="help-inline"></span>';
			if(length>0){
				html += '<input	type="text" class="form-control input-sm" value="'+object.semantriaScore+'"  id="scourcePolarity" placeholder="Enter Scource Polyrity"  maxlength="50" onkeyup="scourcePolytityCalulation()">';
			}else{
				html += '<input	type="text" class="form-control input-sm"  id="scourcePolarity" placeholder="Enter Scource Polyrity"  maxlength="50" onkeyup="scourcePolytityCalulation()">';
				//html += '<input	type="text" class="form-control input-sm"  id="scourcePolarity" placeholder="Enter Scource Polyrity"  maxlength="50" >';
			}
		html += '</div>';
		html += '<div class="form-group col-xs-4">';
			html += '<label>Source KPI Score</label>';
			if(length>0){
				html += '<input	type="text" class="form-control input-sm"  value="'+object.sourceKpiScore+'" id="kpiScore" placeholder="Enter KPI Score" maxlength="50" readonly>';
			}else{
				html += '<input	type="text" class="form-control input-sm"   id="kpiScore" placeholder="Enter KPI Score" maxlength="50" readonly>';
			}
		html += '</div>';
		html +='<input type="button" class="btn btn-primary btn-sm" value="Update" onclick="saveIndividualReviewScore()" style="margin-left: 28px;">';
	html += '</div>';
		$('#'+id+'IndicatorTab').append(html);
	
}



function scourcePolytityCalulation(){
	 var sourcePolyrityValue = document.getElementById("scourcePolarity");
	 if(sourcePolyrityValue.value % 1 === 0){
	 if(sourcePolyrityValue.value == ""){
	 document.getElementById("kpiScore").value=sourcePolyrityValue.value;
	 }else{
	 if(sourcePolyrityValue.value>=0 && sourcePolyrityValue.value <=100){
	 var res=100-sourcePolyrityValue.value;
	 document.getElementById("kpiScore").value=res;
	 $('#IndividualReviewErroDiv').hide();
	 $('#IndividualReviewErorString').hide();
	 $('#IndividualReviewOccured').hide();
	 $('#IndividualReviewErorForInt').hide();
	 }
	 else{
	 document.getElementById("scourcePolarity").value="";
	 document.getElementById("kpiScore").value="";
	 $('#addIndividualSuccessDiv').hide();
	 $('#IndividualReviewErroDiv').show();
	 $('#IndividualReviewOccured').hide();
	  //alert("value shoudl be greater than 0 and less than 100 ");
	 }
	 }
	 
	 }else{
		 $('#IndividualReviewErorForInt').show();
		 $('#addIndividualSuccessDiv').hide();
		 $('#IndividualReviewErroDiv').hide();
		 $('#IndividualReviewOccured').hide();
		 document.getElementById("scourcePolarity").value="";
		 document.getElementById("kpiScore").value="";
		 
	 }
	 
	 
	
}


function saveIndividualReviewScore(){
	$('#page-wrapper').mask('Loading...');
	var scorePolyrity = $.trim($('#scourcePolarity').val());
	var kpiScore = $.trim($('#kpiScore').val());
	var JSONObject = {'semantriaScore':scorePolyrity,'sourceKpiScore':kpiScore};
	console.log(JSONObject);
	$.post("../configIndividuvalReviewScoreFactor/save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			 $('#addIndividualSuccessDiv').show();
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			$('#IndividualReviewOccured').show();
			 $('#IndividualReviewErroDiv').hide();
			 $('#addIndividualSuccessDiv').hide();
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				console.log(fieldName+"***********************"+errorMessage);
				/*$('#Add-LanguageVolume-'+fieldName+'-Error').addClass('has-error has-feedback');*/
				$('#scourcePolarity-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}




function getList(id,url,isAddOrUpdate){
	$('#page-wrapper').mask('Loading');
	$('#'+id+'IndicatorTab').html('');
	$.get(url+"/list.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = getListHtml(response,id,url,isAddOrUpdate);
			$('#'+id+'IndicatorTab').append(html);
			var convertedId = id[0].toUpperCase() + id.slice(1);//Converting First Letter To UpperCase
			if(isAddOrUpdate=="Add"){
				$('#add'+convertedId+"SuccessDiv").show(600);
			}else if(isAddOrUpdate=="Update"){
				$('#edit'+convertedId+"SuccessDiv").show(600);
			}
			$('#'+id+'ListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	
}
function getListHtml(response,moduleId,url,isAddOrUpdate){
	var listObject = "";
	var convertedId = moduleId[0].toUpperCase() + moduleId.slice(1);//Converting First Letter To UpperCase
	var listId = moduleId+"List";
	var successObjectId = "config"+convertedId+"List";
	if(successObjectId =="configReputationFactorList"){
		listObject = response.successObject.configReputationFactorList;
	}else if(successObjectId=="configLanguageFactorList"){
		listObject = response.successObject.configLanguageFactorList;
	}else if(successObjectId=="configSourceFactorList"){
		listObject = response.successObject.configSourceFactorList;
	}else if(successObjectId=="configDepartmentPerformanceFactorList"){
		listObject = response.successObject.configDepartmentPerformanceFactorList;
	}else{
		listObject = response.successObject.configKeyPerformanceFactorList;
	}
	console.log(listObject);
		var html = "";
		var convertedModuleId = "'"+moduleId+"'";
		var convertedUrl = "'"+url+"'";
		var listParameters = convertedModuleId+","+convertedUrl;
		var addParamertes = convertedModuleId+","+convertedUrl+","+0+",'add'";
		var deleteParameters = convertedModuleId+","+convertedUrl;
		if(isAddOrUpdate!="delete"){
			html+=	addHeaderButtonsForReviewCalculation(addParamertes, deleteParameters, moduleId);
		}
		/** ***********************************Sucess Div******************************************************** */
		html+=	'<div id="'+moduleId+'DataDiv">';
		html+=	'<form id="'+moduleId+'ListForm">';
			html += '<div class="alert alert-success" style="display: none;"	id="add'+convertedId+'SuccessDiv">';
			html += '&nbsp;<img alt="../" src="../resources/images/done.png"> '+convertedId+' Added Successfully';
			html += '</div>';
			html += '<div class="alert alert-success" style="display: none;"	id="edit'+convertedId+'SuccessDiv">';
			html += '&nbsp;<img alt="../" src="../resources/images/done.png"> '+convertedId+' Updated Successfully';
			html += '</div>';
	

		html+=	'<div class="alert alert-success" style="display:none;"id="delete'+moduleId+'SuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; '+convertedId+' Deleted Successfully</div>';
		html += '<div class="alert alert-danger alert-error" style="display: none;"	id="delete'+moduleId+'ErrorDiv">';
		html += '</div>';
		
		html += '<table class="table table-striped dataTable no-footer" id="'+moduleId+'ListTable">';
		html += "<thead>";
		html +=	"<tr>";
		html+=	'<th><input type="checkbox" id="checkAll'+convertedId+'CheckBox" style="margin-left: 0px;"></th>';
		html +=	"<th>Name</th>";
		html +=	"<th>KeyName</th>";
		html +=	"<th>Weightage</th>";
		html +=	"<th></th>";
		html +=	"</tr>";
		html +=	"</thead>";
		html +=	"<tbody>";
		for(var i=0;i<listObject.length;i++){
			var id = listObject[i].id;
			var name = listObject[i].name;
			var keyName = listObject[i].keyName;
			var weightage = listObject[i].weightage;
			var editParameters = convertedModuleId+","+convertedUrl+","+id+",'edit'";;
			html+=	'<tr>';
			html+=	'<td><input type="checkBox" class="'+moduleId+'CheckBox" value='+id+'></td>';
			html+=	'<td>'+name+'</td>';
			html+=	'<td>'+keyName+'</td>';
			html+=	'<td>'+weightage+'</td>';
			html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="addOrUpdateForm('+editParameters+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
			html+=	'</tr>';
		}
		html +=	"</tbody>";
		html +=	"</table>";
		
		html += '</form>';
		html+=	addDiv(convertedId);//Appending Div
		html+=	'</div>';
		return html;
	
}

function addOrUpdateForm(moduleId,url,editId,functionality){
	var object = "";
	var formId = "";
	var convertedUrl = "'"+url+"'";
	//$('#'+moduleId+'DataDiv').html('');
	var convertedId = moduleId[0].toUpperCase() + moduleId.slice(1);//Converting First Letter To UpperCase
	var divId = $('#addAndEdit'+convertedId+"Div");
	var convertedFunctionality = functionality[0].toUpperCase() + functionality.slice(1);
	var convertedModuleId = "'"+moduleId+"'";
	var fieldIdPrepender = convertedFunctionality+"-"+moduleId;
	if(functionality=="add"){
		formId = functionality+convertedId+"Form";
		formId = "'"+formId+"'";
	}else{
		formId = functionality+convertedId+"Form";
		formId = "'"+formId+"'";
	}
	var floatValidationParams = convertedModuleId+","+formId+","+"'"+fieldIdPrepender+'-weightage'+"'";
	var saveParameters = convertedModuleId+","+convertedUrl+","+"'"+convertedFunctionality+"',"+editId;
	var html = "";
	if(functionality=="add"){
		html+=	 addFormHeading("Add "+convertedId);
		html+=	'<form class="col-sm-5" id="add'+convertedId+'Form">';
	}else if(functionality="edit"){
		html+=	 addFormHeading("Edit "+convertedId);
		html+=	'<form class="col-sm-5" id="edit'+convertedId+'Form">';
	}
	if(editId!=0){
		var updateUrl = url+"updateForm.htm?id=";
		$.get(updateUrl+editId,function(response){
			if(response.status=="UPDATE_VIEW_SUCCESS"){
				if(moduleId=="reputationFactor"){
					object =  response.successObject.configReputationFactor;
				}else if(moduleId=="languageFactor"){
					object =  response.successObject.configLanguageFactor;
				}else if(moduleId=="sourceFactor"){
					object =  response.successObject.configSourceFactor;
				}else if(moduleId=="departmentPerformanceFactor"){
					object =  response.successObject.configDepartmentPerformanceFactor;
				}else if(moduleId=="keyPerformanceFactor"){
					object =  response.successObject.configKeyPerformanceFactor;
				}
					var keyName = object.keyName;
					keyName = keyName.replace(/\s/g,"");
					/** ****************************************Error Div**************************************************** */
					html += '<div class="alert alert-danger alert-error" style="display: none;"	id="'+convertedFunctionality+convertedId+'ErrorDiv">';
					html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
					html += '</div>';
					/** ************************************Name***************************************************** */
					html += '<div class="form-group" id="'+fieldIdPrepender+'-name-Error">';
					html += '<label>Name<font style="color: red">*</font></label>';
					html += '<span style="color: #a94442" id="edit-'+moduleId+'-name-span-Error" class="help-inline"></span>';
					html += '<input	type="text" value="'+object.name+'" class="form-control input-sm" id="'+fieldIdPrepender+'-name" placeholder="Enter Name" maxlength="50">';
					html += '</div>';
					/** ************************************KeyName***************************************************** */
					html += '<div class="form-group">';
					html += '<label>KeyName<font style="color: red">*</font></label>';
					html +=	'<select class="form-control" id="'+fieldIdPrepender+'-keyName" style="width: 50%">';
					if(keyName=="ReviewAge"){
						html+=	'<option value="ReviewAge" selected="selected">Review Age</option>';
						html+=	'<option value="OrganizationVolume">Organization Volume</option>';
						html+=	'<option value="SourcePopularity">Source Popularity</option>';
						html+=	'<option value="SourceVolume">Source Volume</option>';
						html+=	'<option value="LanguageVolume">Language Volume</option>';
						html+=	'<option value="Sentiment">Sentiment</option>';
						html+=	'<option value="OccupancyVolume">Occupancy Volume</option>';
						
					}else if(keyName=="OrganizationVolume"){
						html+=	'<option value="ReviewAge">Review Age</option>';
						html+=	'<option value="OrganizationVolume" selected="selected">Organization Volume</option>';
						html+=	'<option value="SourcePopularity">Source Popularity</option>';
						html+=	'<option value="SourceVolume">Source Volume</option>';
						html+=	'<option value="LanguageVolume">Language Volume</option>';
						html+=	'<option value="Sentiment">Sentiment</option>';
						html+=	'<option value="OccupancyVolume">Occupancy Volume</option>';
					}else if(keyName=="SourcePopularity"){
						html+=	'<option value="ReviewAge">Review Age</option>';
						html+=	'<option value="OrganizationVolume">Organization Volume</option>';
						html+=	'<option value="SourcePopularity" selected="selected">Source Popularity</option>';
						html+=	'<option value="SourceVolume">Source Volume</option>';
						html+=	'<option value="LanguageVolume">Language Volume</option>';
						html+=	'<option value="Sentiment">Sentiment</option>';
						html+=	'<option value="OccupancyVolume">Occupancy Volume</option>';
					}else if(keyName=="SourceVolume"){
						html+=	'<option value="ReviewAge">Review Age</option>';
						html+=	'<option value="OrganizationVolume">Organization Volume</option>';
						html+=	'<option value="SourcePopularity">Source Popularity</option>';
						html+=	'<option value="SourceVolume" selected="selected">Source Volume</option>';
						html+=	'<option value="LanguageVolume">Language Volume</option>';
						html+=	'<option value="Sentiment">Sentiment</option>';
						html+=	'<option value="OccupancyVolume" >Occupancy Volume</option>';
					}else if(keyName=="LanguageVolume"){
						html+=	'<option value="ReviewAge">Review Age</option>';
						html+=	'<option value="OrganizationVolume">Organization Volume</option>';
						html+=	'<option value="SourcePopularity">Source Popularity</option>';
						html+=	'<option value="SourceVolume">Source Volume</option>';
						html+=	'<option value="LanguageVolume" selected="selected">Language Volume</option>';
						html+=	'<option value="Sentiment">Sentiment</option>';
						html+=	'<option value="OccupancyVolume" >Occupancy Volume</option>';
					}else if(keyName=="Sentiment"){
						html+=	'<option value="ReviewAge">Review Age</option>';
						html+=	'<option value="OrganizationVolume">Organization Volume</option>';
						html+=	'<option value="SourcePopularity">Source Popularity</option>';
						html+=	'<option value="SourceVolume">Source Volume</option>';
						html+=	'<option value="LanguageVolume">Language Volume</option>';
						html+=	'<option value="Sentiment" selected="selected">Sentiment</option>';
						html+=	'<option value="OccupancyVolume" >Occupancy Volume</option>';
					}
					else if(keyName=="OccupancyVolume"){
						html+=	'<option value="ReviewAge">Review Age</option>';
						html+=	'<option value="OrganizationVolume">Organization Volume</option>';
						html+=	'<option value="SourcePopularity">Source Popularity</option>';
						html+=	'<option value="SourceVolume">Source Volume</option>';
						html+=	'<option value="LanguageVolume">Language Volume</option>';
						html+=	'<option value="Sentiment">Sentiment</option>';
						html+=	'<option value="OccupancyVolume" selected="selected">Occupancy Volume</option>';
					}
					html +=	'</select>';
					html += '</div>';
					/** ************************************Weightage***************************************************** */
					html += '<div class="form-group" id="'+fieldIdPrepender+'-weightage-Error">';
					html += '<label>Weightage<font style="color: red">*</font></label>';
					html += '<span style="color: #a94442" id="'+moduleId+'-weightage-span-Error" class="help-inline-float"></span>';
					html += '<input	type="text" value ="'+object.weightage+'"class="form-control input-sm" id="'+fieldIdPrepender+'-weightage" onkeyup="floatValidation('+floatValidationParams+')" placeholder="Enter Weightage" maxlength="50">';
					html += '</div>';
					/** ************************************Button***************************************************** */
					if(functionality=="add"){
						html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrUpdate('+saveParameters+')">';
					}else{
						html += '<input type="button" class="btn btn-primary" value="Update" onclick ="saveOrUpdate('+saveParameters+')">';
					}
					html+=	appendCancelButton(getDivId(convertedId),"page-wrapper");//Adding Cancel Button
					html += '</form>';
					$('#delete'+moduleId+"SuccessDiv").hide();
					$('#add'+convertedId+"SuccessDiv").hide();
					$('#edit'+convertedId+'SuccessDiv').hide();
					divId.html('');
					divId.append(html);
					divId.show(600);
					scrollDown(divId);
					maskId.unmask();
				}
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"*******"+response.statusText);
		});
	}else{
		/** ****************************************Error Div**************************************************** */
		html += '<div class="alert alert-danger alert-error" style="display: none;"	id="'+convertedFunctionality+convertedId+'ErrorDiv">';
		html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
		html += '</div>';
		/** ************************************Name***************************************************** */
		html += '<div class="form-group" id="'+fieldIdPrepender+'-name-Error">';
		html += '<label>Name<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="'+moduleId+'-name-span-Error" class="help-inline"></span>';
		html += '<input	type="text" class="form-control" id="'+fieldIdPrepender+'-name" placeholder="Enter Name" maxlength="50">';
		html += '</div>';
		/** ************************************KeyName***************************************************** */
		html += '<div class="form-group">';
		html += '<label>KeyName<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="'+fieldIdPrepender+'-keyName" style="width: 50%">';
				html+=	'<option value="ReviewAge">Review Age</option>';
				html+=	'<option value="OrganizationVolume">Organization Volume</option>';
				html+=	'<option value="SourcePopularity">Source Popularity</option>';
				html+=	'<option value="SourceVolume">Source Volume</option>';
				html+=	'<option value="LanguageVolume">Language Volume</option>';
				html+=	'<option value="Sentiment">Sentiment</option>';
				html+=	'<option value="OccupancyVolume">Occupancy Volume</option>';
		html +=	'</select>';
		html += '</div>';
		/** ************************************Weightage***************************************************** */
		html += '<div class="form-group" id="'+fieldIdPrepender+'-weightage-Error">';
		html += '<label>Weightage<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="'+moduleId+'-weightage-span-Error" class="help-inline-float"></span>';
		html += '<input	type="text" class="form-control" id="'+fieldIdPrepender+'-weightage" onkeyup="floatValidation('+floatValidationParams+')" placeholder="Enter Weightage" maxlength="50">';
		html += '</div>';
		/** ************************************Button***************************************************** */
		if(functionality=="add"){
			html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrUpdate('+saveParameters+')">';
		}else{
			html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrUpdate('+saveParameters+')">';
		}
		html+=	appendCancelButton(getDivId(convertedId),"page-wrapper");//Adding Cancel Button
		html += '</form>';
		$('#delete'+moduleId+"SuccessDiv").hide();
		$('#add'+convertedId+"SuccessDiv").hide();
		$('#edit'+convertedId+'SuccessDiv').hide();
		divId.html('');
		divId.append(html);
		divId.show(600);
		scrollDown(divId);
		maskId.unmask();
	}
}

function saveOrUpdate(moduleId,url,functionality,editId){
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#page-wrapper').mask('Loading....');
	var convertedModuleId = moduleId[0].toUpperCase() + moduleId.slice(1);//Converting First Letter To UpperCase
	$('#'+functionality+convertedModuleId+"ErrorDiv").hide();
	var divId = getDivId(convertedModuleId);
	var dataDivId = $('#'+moduleId+"DataDiv");
	var name = $.trim($('#'+functionality+'-'+moduleId+'-name').val());
	var keyName = $('#'+functionality+'-'+moduleId+'-keyName option:selected').val();
	var weightage = $('#'+functionality+'-'+moduleId+'-weightage').val();
	if(weightage==""){
		weightage = 0.0;
	}
	if(functionality=="Add"){
		var JSONObject ={'name':name,'keyName':keyName,'weightage':weightage};
	}else{
		var JSONObject ={'id':editId,'name':name,'keyName':keyName,'weightage':weightage};

	}
	if(functionality=="Add"){
		$.post(url+"save.htm",JSONObject,function(response){
			if(response.status=="SAVE_SUCCESS"){
				$('#'+divId).hide(600);
				getList(moduleId, url,"Add");
				$('#page-wrapper').unmask();
			}else{
				scrollDown($('#'+divId));
				$('#'+functionality+convertedModuleId+"ErrorDiv").show(600);
				$('#Add-'+moduleId+'-name').addClass('has-error has-feedback');
				$('#'+moduleId+"-name-span-Error").html(response.errorMessage);
				$('#page-wrapper').unmask();
			}
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		});
	}else{
		$('#edit'+convertedModuleId+'SuccessDiv').hide();
		$.post(url+"update.htm",JSONObject,function(response){
			if(response.status=="UPDATE_SUCCESS"){
				getList(moduleId, url,"Update");
				$('#'+divId).hide(600);
				$('#page-wrapper').unmask();
				$('#edit'+convertedModuleId+'SuccessDiv').show(600);
				$('#page-wrapper').unmask();
			}else{
				scrollDown($('#'+divId));
				$('#'+functionality+convertedModuleId+"ErrorDiv").show(600);
				$('#Edit-'+moduleId+'-name').addClass('has-error has-feedback');
				$('#edit-'+moduleId+"-name-span-Error").html(response.errorMessage);
				$('#page-wrapper').unmask();
			}
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		});
	}
	return false;
}
function deleteFormulas(moduleId,url){
	var ids = selectedIds(moduleId+'CheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			$('#delete'+moduleId+'SuccessDiv').hide();
			$('#delete'+moduleId+'ErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:url+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var html = getListHtml(response,moduleId,url,"delete");
						$('#'+moduleId+'DataDiv').html(html);
						$('#delete'+moduleId+'SuccessDiv').show(600);
						$('#'+moduleId+'ListTable').dataTable();
						$('#page-wrapper').unmask();
					}else if(response.status=="DELETE_ERROR"){/*
						$('#delete'+moduleId+'ErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteReviewAgeErrorDiv').append(errorMessage);
						$('#deleteReviewAgeErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						$('#page-wrapper').unmask();
					*/}else{
						$('#page-wrapper').mask(response.errorMessage);
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

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllReputationFactorCheckBox",function(){
    $('.reputationFactorCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".reputationFactorCheckBox",function(){
    if($('.reputationFactorCheckBox:checked').length == $('.reputationFactorCheckBox').length) {
      $('#checkAllReputationFactorCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllReputationFactorCheckBox').prop('checked', false);
    }
});

//Check All Check Box
$(document).on('click',"#checkAllSourceFactorCheckBox",function(){
    $('.sourceFactorCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".sourceFactorCheckBox",function(){
    if($('.sourceFactorCheckBox:checked').length == $('.sourceFactorCheckBox').length) {
      $('#checkAllSourceFactorCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllSourceFactorCheckBox').prop('checked', false);
    }
});

$(document).on('click',"#checkAllKeyPerformanceFactorCheckBox",function(){
    $('.keyPerformanceFactorCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".keyPerformanceFactorCheckBox",function(){
    if($('.keyPerformanceFactorCheckBox:checked').length == $('.keyPerformanceFactorCheckBox').length) {
      $('#checkAllKeyPerformanceFactorCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllKeyPerformanceFactorCheckBox').prop('checked', false);
    }
});

$(document).on('click',"#checkAllLanguageFactorCheckBox",function(){
    $('.languageFactorCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".languageFactorCheckBox",function(){
    if($('.languageFactorCheckBox:checked').length == $('.languageFactorCheckBox').length) {
      $('#checkAllLanguageFactorCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllLanguageFactorCheckBox').prop('checked', false);
    }
});


$(document).on('click',"#checkAllDepartmentPerformanceFactorCheckBox",function(){
    $('.departmentPerformanceFactorCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".departmentPerformanceFactorCheckBox",function(){
    if($('.departmentPerformanceFactorCheckBox:checked').length == $('.departmentPerformanceFactorCheckBox').length) {
      $('#checkAllDepartmentPerformanceFactorCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllDepartmentPerformanceFactorCheckBox').prop('checked', false);
    }
});



function appendFormulaCalculationAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearReviewAgeMessages();//Clearing Review Age
	clearOrganizationVolumeMessages();
}
function clearReviewAgeMessages(){
	$('#addReviewAgeSuccessDiv,#editReviewAgeSuccessDiv,#deleteReviewAgeSuccessDiv,#deleteReviewAgeErrorDiv').hide();
}
function clearOrganizationVolumeMessages(){
	$('#addOrganizationVolumeSuccessDiv,#editOrganizationVolumeSuccessDiv,#deleteOrganizationVolumeSuccessDiv,#deleteOrganizationVolumeErrorDiv').hide();
}