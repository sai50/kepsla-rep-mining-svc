$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});
var geoCountryUrl = "../geoCountry/";
var geoCityUrl = "../geoCity/";
var geoAreaUrl = "../geoArea/";
var geoLocationTypeUrl = "../geoLocationType/";
var geoLocationUrl = "../geoLocation/";
var geoMasterUploadFileUrl = "../geoMaster/";

//*****Geo Country Variables***************//
var geoCountryDataDiv = $('#geoCountryDataDiv');
var geoCountryTableId = $('#geoCountryListTable');
var selectedGeoCountryIds = [];

//*****Geo City Variables**********************//
var selectedGeoCityIds = [];

//*****Geo Area Variables**********************//
var selectedGeoAreaIds = [];

//*****Geo Location Type Variables**********************//
var selectedGeoLocationTypeIds = [];

//*****Geo Location Variables**********************//
var selectedGeoLocationIds = [];
/**************************************************************************************************************************
 *                     List Geo Country                                                                         *
 **************************************************************************************************************************/
function geoCountryListTab(){
	$('#addAndEditGeoCityDiv').hide();
	$('#addAndEditGeoAreaDiv').hide();
	$('#geoAreaMasterTabButtons').hide();
	$('#geoAreaListTable_wrapper').hide();
	$('#addAndEditGeoCountryDiv').hide();
	clearGeoCountryMessages();
	geoCountryList();
}

function geoCountryList(){
	$('#addAndEditGeoCountryDiv').hide();
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	geoCountryDataDiv.html('');
	$.get(geoCountryUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = listGeoCountryHtml(response);
			geoCountryDataDiv.append(html);
			$('#geoCountryListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#geoCountryDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	},'json').fail(function(response){
		geoCountryDataDiv.mask(response.status+"**********"+response.statusText);
	});
	return false;
}
function listGeoCountryHtml(response) {
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var html = "";
	html += '<form id="geoCountryListForm">';
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteGeoCountriesSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;Country/Countries Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteGeoCountriesErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='geoCountryListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllGeoCountyCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Country Name</th>";
	html +=	"<th>Country Code</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<geoCountryMasterList.length;i++){
		var id = geoCountryMasterList[i].id;
		var countryName = geoCountryMasterList[i].geoCountryName;
		var countryCode = geoCountryMasterList[i].geoCountryCode;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="geoCountryCheckBox" value='+id+'></td>';
		html+=	'<td>'+countryName+'</td>';
		html+=	'<td>'+countryCode+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editGeoCountry('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	'<div id="addAndEditGeoCountryDiv"  class="SubHeading addAdminForm col-xs-12" style="display:none;"></div>';
	return html;
}

/**************************************************************************************************************************
 *                      Add GeoCountry                                                                             *
 **************************************************************************************************************************/
function addGeoCountry(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditGeoCountryDiv');
	var addMethod  = addGeoCountryFormHtml();
	appendGeoMasterAddOrEditForm(divId,addMethod);//Method To Generate Add/Edit Form
	$('#page-wrapper').unmask();
	return false;
}

function addGeoCountryFormHtml(){
	var html = "";
	html+=	addFormHeading("Add Country");
	html+=	'<form class="col-sm-5" id="addGeoCountryForm">';
	var divId = $("#addAndEditGeoCountryDiv");
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addCountryErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country Name***************************************************** */
	html += '<div class="form-group" id="Add-geoCountryName-Error">';
	html += '<label>Country Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoCountryName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="geoCountry" placeholder="Enter Country Name" maxlength="50">';
	html += '</div>';
	/** ************************************Country Code***************************************************** */
	html += '<div class="form-group" id="Add-geoCountryCode-Error">';
	html += '<label>Country Code<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoCountryCode-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="geoCountryCode" placeholder="Enter Country Code" maxlength="3">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeoCountry()">&nbsp';
	html+=	appendCancelButton(getDivId("GeoCountry"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}
function saveGeoCountry(){
	var addAndEditGeoCountryDiv = $('#addAndEditGeoCountryDiv');
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addCountrySuccessDiv').hide();
	$('#addCountryErrorDiv').hide();
	var countryName = $.trim($('#geoCountry').val());
	var countryCode = $.trim($('#geoCountryCode').val());
	var JSONObject = {'geoCountryName':countryName,'geoCountryCode':countryCode};
	$.post(geoCountryUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#addCountrySuccessDiv').show(600);
			$('#addGeoCountryForm').trigger("reset");
			geoCountryList();//Regenerating List
			$('#addAndEditGeoCountryDiv').hide();
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			//scrollDown(addAndEditGeoCountryDiv);
			$('#addCountryErrorDiv').show(600);
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
 *                     Edit Geo Country                                                                         *
 **************************************************************************************************************************/

function editGeoCountry(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditGeoCountryDiv');//Declaring Add/Edit Form Div
	$.ajaxSetup({ cache: false });
	$.get(geoCountryUrl+"edit.htm?id="+id,function(response){
		var html = editGeoCountryFormHtml(response);
		appendGeoMasterAddOrEditForm(divId, html);//This Method Append Edit Form
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
	return false;
}


function editGeoCountryFormHtml(response){
	var geoCountryMaster = response.successObject.geoCountryMaster;
	var id = geoCountryMaster.id;
	var countryName = geoCountryMaster.geoCountryName;
	var countryCode = geoCountryMaster.geoCountryCode;
	var html = "";
	html+=	addFormHeading("Edit Country");
	html+=	'<form class="col-sm-5" id="editGeoCountryForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editCountryErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country Name***************************************************** */
	html += '<div class="form-group" id="Edit-geoCountryName-Error">';
	html += '<label>Country Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoCountryName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="editGeoCountryName" value="'+countryName+'"  placeholder="Enter Country Name" maxlength="50">';
	html += '</div>';
	/** ************************************Country Code***************************************************** */
	html += '<div class="form-group" id="Edit-geoCountryCode-Error">';
	html += '<label>Country Code<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoCountryCode-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="editGeoCountryCode" value="'+countryCode+'" placeholder="Enter Country Code" maxlength="3">';
	html +=	'<input type="hidden" value='+id+' id="editedCountryId">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateGeoCountry()">';
	html+=	appendCancelButton(getDivId("GeoCountry"),"page-wrapper");//Adding Cancel Button
	html+=	'</form>';
	return html;
}

function updateGeoCountry(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editCountrySuccessDiv').hide();
	$('#editCountryErrorDiv').hide();
	
	var editedCountryName = $.trim($('#editGeoCountryName').val());
	var editedCountryCode = $.trim($('#editGeoCountryCode').val());
	var editedCountryId = $('#editedCountryId').val();
	var JSONObject = {};
	JSONObject['id'] = editedCountryId;
	JSONObject['geoCountryName'] = editedCountryName;
	JSONObject['geoCountryCode'] = editedCountryCode;
	$.post(geoCountryUrl+"/update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editCountrySuccessDiv').show(600);
			geoCountryList();//Recall List Method
			$('#addAndEditGeoCountryDiv').hide();
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			$('#editCountryErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
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
/**************************************************************************************************************************
 *                     Delete Geo Country                                                                         *
 **************************************************************************************************************************/
function deleteGeoCountries(){
	 $.ajaxSetup({ cache: false });
	selectedGeoCountryCheckBoxLength();
	if(selectedGeoCountryIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			/**********************New Div Changes****************************/
			$('#addAndEditGeoCountryDiv').hide();//Hiding Add/Edit Form
			clearGeoCountryMessages();//Clearing All Error/Success Message Divs
			/**********************New Div Changes****************************/
			$.ajax({
				type:"POST",
				url:geoCountryUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedGeoCountryIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#geoCountryTabButtons').hide();
						var html = listGeoCountryHtml(response);
						geoCountryDataDiv.html(html);
						$('#deleteGeoCountriesSuccessDiv').show(600);
						//$('#geoCountryTabButtons').show();
						$('#geoCountryListTable').dataTable();
						$('#page-wrapper').unmask();
						selectedGeoCountryIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteGeoCountriesErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteGeoCountriesErrorDiv').append(errorMessage);
						$('#deleteGeoCountriesErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedGeoCountryIds = [];
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

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllGeoCountyCheckBox",function(){
    $('.geoCountryCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".geoCountryCheckBox",function(){
    if($('.geoCountryCheckBox:checked').length == $('.geoCountryCheckBox').length) {
      $('#checkAllGeoCountyCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllGeoCountyCheckBox').prop('checked', false);
    }
});

function selectedGeoCountryCheckBoxLength() {
	if ($('.geoCountryCheckBox:checked').length) {
		selectedGeoCountryIds = [];
		$('.geoCountryCheckBox:checked').each(function() {
			selectedGeoCountryIds.push($(this).val());
		});
	}
	return false;
}
/**************************************************************************************************************************
 *                     List Geo Cities                                                                         *
 **************************************************************************************************************************/
//written some new code by manoj
function geoCityList(){
	$.ajaxSetup({ cache: false });
	$('#geoCityDivId').html('');
	$('#geoCityTab').html('');
	$('#addAndEditGeoCityDiv').hide();
	$('#addAndEditGeoAreaDiv').hide();
	$('#geoAreaListTable_wrapper').hide();
	$('#page-wrapper').mask('Loading...');
	$.get(geoCountryUrl+"listTab.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var geoCountryMasterList = response.successObject.geoCountryMasterList;
			var html="";
			
			html+=	'<div id="geoCityDivId">';
			html+= '<form id="geoCityMasterTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
			
			
			html+='<label id="selectCountryName" class="control-label" style="width:355px" for="selectCountryName">GEO Country :<select id="selectCountryNameId" onchange="geoCityNameList()" class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			for(var i=0;i<geoCountryMasterList.length;i++){
			html+='<option value="'+geoCountryMasterList[i].id+'">'+$.trim(geoCountryMasterList[i].geoCountryName)+'</option>';
			}
			html+='</select>';
			html+='</label>';	
			
			html+='<label id="selectCityName" class="control-label" style="width:355px" for="selectCityName">GEO City :<select id="selectCityNameId" disabled class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			html+='</select>';
			html+='</label>';	
			
			
			html+='<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="geoCityListTable()" value="View">';
			
			
			html+=		'<div class="form-group float-right">';
			html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteGeoCities()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
			html+=			'<a onclick="addGeoCity()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
			html+=		'</div>';
			html+=		'</form>';
			html+=	'</div>';
			$('#page-wrapper').unmask();
			$("#geoCityDivId").append(html);
			$('#geoAreaMasterTabButtons').hide();
		}else{
			$('#geoCityDivId').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	},'json').fail(function(response){
		geoCountryDataDiv.mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function geoCityNameList(){
	$('#page-wrapper').mask('Loading...');
	var countryId=$('#selectCountryNameId option:selected').val();
	$.ajaxSetup({ cache: false });
	$('#selectCityName').html('');
	
	$.get("../geoCity/listOfCities.htm?geoCountryId="+countryId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var geoCityMasterList = response.successObject.citylist;
			var html='';
			html+='<label id="selectCityName" class="control-label" style="width:355px" for="selectCityName">GEO City :<select id="selectCityNameId"  class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			for(var i=0;i<geoCityMasterList.length;i++){
				html+='<option value="'+geoCityMasterList[i].id+'">'+$.trim(geoCityMasterList[i].geoCityName)+'</option>';
				}
			html+='</select>';
			html+='</label>';	
			$('#selectCityName').append(html);
			$('#page-wrapper').unmask();
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}


//dileep added
function geoCityListTable(){
	$('#addAndEditGeoCityDiv').hide();
	var geoCountryId=$('#selectCountryNameId').val();
	var id=$('#selectCityNameId').val();
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#geoCityTab').html('');
	$('#geoCityDivId').show();
	var sendCityInfo = {
			'id' :id,
			'geoCountryId':geoCountryId
	};
	 $.ajax({
			type:"POST",
			url:geoCityUrl+"/list.htm",
			contentType:"application/json",
			data:JSON.stringify(sendCityInfo),
			success:function(response){
				var html = listGeoCitiesHtml(response);
				$('#geoCityTab').append(html);
				$('#geoCityListTable').dataTable();
				$('#page-wrapper').unmask();
			},error:function(response){
				$('#page-wrapper').mask(response.status+"**********"+response.statusText);
			}
		});
	 return false;
}

function listGeoCitiesHtml(response){
	var geoCitiesList = response.successObject.geoCitiesList;
	var html = "";
	//html+=	addHeaderButtons("addGeoCity", "deleteGeoCities","geoCityMasterTabButtons");
	html+=	'<div id="geoCityDataDiv">';
	html+=	'<form id="geoCityListForm">';
	/**************************Add Geo City Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addGeoCitySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; City Added Successfully</div>';
	/**************************Edit Geo City Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editGeoCitySuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; City Updated Successfully</div>';
	/**************************Delete Geo City Success Div*********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteGeoCitiesSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; City/Cities Deleted Successfully</div>';
	/**************************Delete Geo City Error Div*********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteGeoCitiesErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='geoCityListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllGeoCityCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>City Name</th>";
	html +=	"<th>Country Name</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<geoCitiesList.length;i++){
		var id = geoCitiesList[i].id;
		var cityName = geoCitiesList[i].geoCityName;
		var countryName = geoCitiesList[i].geoCountryName;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="geoCityCheckBox" value='+id+'></td>';
		html+=	'<td>'+cityName+'</td>';
		html+=	'<td>'+countryName+'</td>';
		html+=	 '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editGeoCity('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	'<div id="addAndEditGeoCityDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>';
	//html+=	addDiv("GeoCity");
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                    Add Geo City		                                                                              *
 **************************************************************************************************************************/
function addGeoCity(){
	$.ajaxSetup({ cache: false });
	var divId = $('#addAndEditGeoCityDiv');
	$('#page-wrapper').mask('Loading...');
	$.get(geoCityUrl + "add.htm", function(response) {
		var html = addGeoCityFormHtml(response);
		appendGeoMasterAddOrEditForm(divId, html);//Adding Form To Div
		$('#geoCityMasterTabButtons').show();//added by manoj
		$('#addGeoCityForm').show();
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"*************"+response.statusText);
	});
	return false;
	
}
function addGeoCityFormHtml(response){
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var html = "";
	html+=	addFormHeading("Add City");
	html+=	'<form class="col-sm-5" id="addGeoCityForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addGeoCityErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country Name***************************************************** */
	if(geoCountryMasterList.length>0){
		html += '<div class="form-group" id="Add-geoCountryId-Error">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="geoCountryId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="geoCountryId" style="width: 50%">';
		html+=	'<option value="0">Select</option>';
		for(var i=0;i<geoCountryMasterList.length;i++){
			var id = geoCountryMasterList[i].id;
			var countryName = geoCountryMasterList[i].geoCountryName;
			html+=	'<option value='+id+'>'+countryName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled"><option>No Countries Found</option></select>';
		html += '</div>';
	}
	
	/** ************************************City Name***************************************************** */
	html += '<div class="form-group" id="Add-geoCityName-Error">';
	html += '<label>City Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoCityName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="geoCityName" placeholder="Enter City Name" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	if(geoCountryMasterList.length>0){
		html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeoCity()">';
	}else{
		html += '<input type="button" class="btn btn-primary" value="Add" disabled="disabled">';
	}
	html+=	appendCancelButton(getDivId("GeoCity"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function saveGeoCity(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditGeoCityDiv');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addGeoCitySuccessDiv').hide();
	$('#addGeoCityErrorDiv').hide();
	var gCountryId=$('#selectCountryNameId').val();
	var gCityName=$('#selectCityNameId').val();
	var geoCountryId = $('#geoCountryId option:selected').val();
	var geoCityName = $.trim($('#geoCityName').val());
	var id=$('#selectCityNameId').val();
	var geoCityMasterJson = {
			'id':id,
			'geoCountryId':geoCountryId,
			'geoCityName':geoCityName
	};
	var sendCityInfo = {
			'id':id,
			'geoCountryId':gCountryId,
			'geoCityName':gCityName
	};
	
	$.ajax({
		type:"POST",
		url:geoCityUrl+"save.htm?sendCityInfo="+JSON.stringify(sendCityInfo),
		contentType:"application/json",
		data:JSON.stringify(geoCityMasterJson),
		success:function(response){
			if(response.status=="SAVE_SUCCESS"){
				if($('#geoCityListTable_wrapper').length == 0){
					var tabButtonsId = $('#geoCityMasterTabButtons');
					var dataDivId = $('#addAndEditGeoCityDiv');
					var successDivId = "addGeoCitySuccessDiv"
					var tableId = "geoCityListTable";
					var html = listGeoCitiesHtml(response);
					generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				}else{
					var tabButtonsId = $('#geoCityMasterTabButtons');
					var dataDivId = $('#geoCityDataDiv');
					var successDivId = "addGeoCitySuccessDiv"
					var tableId = "geoCityListTable";
					var html = listGeoCitiesHtml(response);
					generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				}
				$('#geoCityMasterTabButtons').show();//added by manoj
				$('#page-wrapper').unmask();
			}else if(response.status=="SAVE_ERROR"){
				//scrollDown(divId);//reached manoj
				$('#addGeoCityErrorDiv').show(600);
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
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;

}
/**************************************************************************************************************************
 *                    Edit Geo City		                                                                              *
 **************************************************************************************************************************/
function editGeoCity(id){
	var id1=id;
	$('#page-wrapper').mask('Loading...');
	var divId = $('#addAndEditGeoCityDiv');
	$.get(geoCityUrl+"edit.htm?id="+id1,function(response){
		var html = geoCityEditFormHtml(response);
		appendGeoMasterAddOrEditForm(divId, html);
		$('#geoCityMasterTabButtons').show();//added by manoj
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function geoCityEditFormHtml(response){
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var geoCityMaster = response.successObject.geoCityMaster;
	var html = "";
	html+=	addFormHeading("Edit City");
	html += '<form class="col-sm-5" id="editGeoCityForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editGeoCityErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Country Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control" id="editedGeoCountryId" style="width: 50%" disabled="disabled">';
	for(var i=0;i<geoCountryMasterList.length;i++){
		var id = geoCountryMasterList[i].id;
		if(id==geoCityMaster.geoCountryId){
			var countryName = geoCountryMasterList[i].geoCountryName;
			html+=	'<option value='+id+'>'+countryName+'</option>';
		}
	}
	html +=	'</select>';
	html += '</div>';
	/** ************************************City Name***************************************************** */
	html += '<div class="form-group" id="Edit-geoCityName-Error">';
	html += '<label>City Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoCityName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+geoCityMaster.geoCityName+'" class="form-control input-sm" id="editedGeoCityName" placeholder="Enter City Name" maxlength="50">';
	html += '</div>';	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateGeoCity('+geoCityMaster.id+')">';
	html+=	appendCancelButton(getDivId("GeoCity"),"page-wrapper");//Adding Cancel Button
	html +=	'</form>';
	return html;
}
function updateGeoCity(id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editGeoCitySuccessDiv').hide();
	$('#editGeoCityErrorDiv').hide();
	var geoCountryId = $('#editedGeoCountryId option:selected').val();
	var geoCityName = $.trim($('#editedGeoCityName').val());
		var sendCityInfo = {
			'id' :id,
			'geoCountryId':geoCountryId,
			'geoCityName':geoCityName
	};

	$.ajax({
		type:"POST",
		url:geoCityUrl+"update.htm",
		contentType:"application/json",
		data:JSON.stringify(sendCityInfo),
		success:function(response){
			if(response.status=="UPDATE_SUCCESS"){
				var tabButtonsId = $('#geoCityMasterTabButtons');
				var dataDivId = $('#geoCityDataDiv');
				var successDivId = "editGeoCitySuccessDiv"
				var tableId = "geoCityListTable";
				var html = listGeoCitiesHtml(response);
				generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				$('#geoCityMasterTabButtons').show();//added by manoj
			}else if(response.status=="UPDATE_ERROR"){
				$('#editGeoCityErrorDiv').show(600);
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
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;

}
/**************************************************************************************************************************
 *                    Delete Geo Cities	                                                                              *
 **************************************************************************************************************************/
function deleteGeoCities(){
	$.ajaxSetup({ cache: false });
	selectedGeoCityCheckBoxLength();
	if(selectedGeoCityIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			clearGeoCityMessages();
			$.ajax({
				type:"POST",
				url:geoCityUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedGeoCityIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#geoCityMasterTabButtons');
						var dataDivId = $('#geoCityDataDiv');
						var successDivId = "deleteGeoCitiesSuccessDiv"
						var tableId = "geoCityListTable";
						var html = listGeoCitiesHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#geoCityMasterTabButtons').show();//added by manoj
						selectedGeoCityIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteGeoCitiesErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteGeoCitiesErrorDiv').append(errorMessage);
						$('#deleteGeoCitiesErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedGeoCityIds = [];
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


/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllGeoCityCheckBox",function(){
    $('.geoCityCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".geoCityCheckBox",function(){
    if($('.geoCityCheckBox:checked').length == $('.geoCityCheckBox').length) {
      $('#checkAllGeoCityCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllGeoCityCheckBox').prop('checked', false);
    }
});

function selectedGeoCityCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.geoCityCheckBox:checked').length) {
		selectedGeoCityIds = [];
		$('.geoCityCheckBox:checked').each(function() {
			selectedGeoCityIds.push($(this).val());
		});
	}
	return false;
}


/**************************************************************************************************************************
 *                     List Geo Areas                                                                         *
 **************************************************************************************************************************/

function geoAreaList(){
	$.ajaxSetup({ cache: false });
	$('#geoAreaDivId').html('');
	$('#addAndEditGeoCityDiv').hide();//added by manoj
	$('#addAndEditGeoAreaDiv').hide();//added by manoj
	$('#geoAreaTab').html('');
	$('#geoAreaListTable_wrapper').hide();
	$('#page-wrapper').mask('Loading...');
	$.get(geoAreaUrl+"geoArea.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
		var geoAreaMasterList = response.successObject.getAreaMasterList;
		//var html = listGeoAreasHtml(response); commented by manoj
		var html="";
		html+=	'<div id="geoAreaDivId">';
		html+= '<form id="geoAreaMasterTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
		html+='<label id="selectCountryNamee" class="control-label" style="width:355px" for="selectCountryNamee">GEO Country :<select id="selectCountryNameIdd" onchange="geoCityNameListt()" class="form-control input-sm"  style="width: 250px;">';
		html+='<option value="0">All</option>';
		for(var i=0;i<geoAreaMasterList.length;i++){
			html+='<option value="'+geoAreaMasterList[i].id+'">'+$.trim(geoAreaMasterList[i].geoCountryName)+'</option>';
			}
			html+='</select>';
			html+='</label>';	
			
			html+='<label id="selectCityNamee" class="control-label" style="width:355px" for="selectCityNamee">GEO City :<select id="selectCityNameIdd" disabled class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			html+='</select>';
			html+='</label>';	
			
			
			html+='<input type="button" style="width: 100px;" class="btn btn-default btn-sm" id="viewList" onclick="geoAreaListTable()" value="View">';
			
			
			html+=		'<div class="form-group float-right">';
			html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteGeoAreas()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
			html+=			'<a onclick="addGeoArea()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
			html+=		'</div>';
			html+=		'</form>';
			html+=	'</div>';
			$('#page-wrapper').unmask();
			$("#geoAreaDivId").append(html);
		    $('#geoCityMasterTabButtons').hide();//added by manoj
		}else{
			$('#geoCountryDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"***********"+response.statusText);
	});
	return false;
}
/*******************by manoj***************************************/
//satrt
function geoCityNameListt(){
	$('#page-wrapper').mask('Loading...');
	var countryId=$('#selectCountryNameIdd option:selected').val();
	//alert(countryId);//commented by manoj
	$.ajaxSetup({ cache: false });
	$('#selectCityNamee').html('');
	
	$.get("../geoCity/listOfCities.htm?geoCountryId="+countryId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var geoCityMasterList = response.successObject.citylist;
			var html='';
			html+='<label id="selectCityNamee" class="control-label" style="width:355px" for="selectCityNamee">GEO City :<select id="selectCityNameIdd"  class="form-control input-sm"  style="width: 250px;">';
			html+='<option value="0">All</option>';
			for(var i=0;i<geoCityMasterList.length;i++){
				html+='<option value="'+geoCityMasterList[i].id+'">'+$.trim(geoCityMasterList[i].geoCityName)+'</option>';
				}
			html+='</select>';
			html+='</label>';	
			$('#selectCityNamee').append(html);	
			$('#selectCityNamee').show();
			$('#page-wrapper').unmask();
			
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}
//end

//start
/***********************************by manoj**************************************/

function geoAreaListTable(){
	$('#addAndEditGeoAreaDiv').hide();
	var selectCountryNameId=$('#selectCountryNameIdd').val();
	var selectCityNameId=$('#selectCityNameIdd').val();
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#geoAreaTab').html('');
	$('#geoCityTab').html('');
	$('#geoCityDivId').show();
	
	var sendAreaInfo = {
			'geoCountryId' :selectCountryNameId,
			'geoCityId':selectCityNameId
	};
	 $.ajax({
			type:"POST",
			url:geoAreaUrl+"/list.htm",
			contentType:"application/json",
			data:JSON.stringify(sendAreaInfo),
			success:function(response){
				var result=response;
				var html = listGeoAreasHtml(result);
				$('#geoAreaTab').append(html);
				$('#geoAreaListTable').dataTable();
				$('#page-wrapper').unmask();
			},error:function(response){
				$('#page-wrapper').mask(response.status+"**********"+response.statusText);
			}
		});
	 return false;


	//
	
	/*$.get(geoAreaUrl+"list.htm?geoCountryId="+selectCountryNameId+"&geoCityId="+selectCityNameId,function(response){
		var result=response;
		var html = listGeoAreasHtml(result);
		$('#geoAreaTab').append(html);
		$('#geoAreaListTable').dataTable();
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"***********"+response.statusText);
	});
	return false;*/
}
//end
function listGeoAreasHtml(response){
	var geoAreasList = response.successObject.geoAreaMasterList;
	var html = "";
	/*********************************Header*********************************************************************/
	//html+=	addHeaderButtons("addGeoArea", "deleteGeoAreas","geoAreaMasterTabButtons");//Pass AddMethod,DeleteMethod,TabId
	html+=	'<div id="geoAreaDataDiv">';
	html+=	'<form id="geoAreaListForm">';
	/******************************Geo Area Add Success Div***********************************************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addGeoAreaSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Area Added Successfully</div>';
	/******************************Geo Area Edit Success Div***********************************************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editGeoAreaSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;  Area Updated  Successfully</div>';
	/******************************Geo Area Delete Success Div***********************************************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteGeoAreasSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Area(s) Deleted Successfully</div>';
	/******************************Geo Area Delete Error Div***********************************************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteGeoAreasErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='geoAreaListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllGeoAreaCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Country Name</th>";
	html +=	"<th>City Name</th>";
	html +=	"<th>Area Name</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<geoAreasList.length; i++){
		var id = geoAreasList[i].id;
		var cityName = geoAreasList[i].geoCityName;
		var countryName = geoAreasList[i].geoCountryName;
		var areaName = geoAreasList[i].geoAreaName;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="geoAreaCheckBox" value='+id+'></td>';
		html+=	'<td>'+countryName+'</td>';
		html+=	'<td>'+cityName+'</td>';
		html+=	'<td>'+areaName+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editGeoArea('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	//html+=	'<div id="addAndEditGeoCountryDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>';
	html+=	addDiv("GeoArea");//Appending Div
	html+=	'</div>';
	return html;
}

function addGeoArea(){
	
	$.ajaxSetup({ cache: false });
	var divId = $('#'+ getDivId("GeoArea"));//Getting Add/Edit Form Div
	$('#page-wrapper').unmask('Loading...');
	$.get(geoAreaUrl + "add.htm", function(response) {
		var html = addGeoAreaFormHtml(response);
		appendGeoMasterAddOrEditForm(divId, html);//Appending Form
		$('#geoAreaMasterTabButtons').show();//added by manoj
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"*************"+response.statusText);
	});
	return false;
	
}
function addGeoAreaFormHtml(response){
	
	$('#geoAreaMasterTabButtons').show();//added by manoj
	
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var geoCityMasterList = response.successObject.geoCityMasterList;
	var html = "";
	html+=	addFormHeading("Add Area");
	html+=	'<form class="col-sm-5" id="addGeoAreaForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addGeoAreaErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country DropDown***************************************************** */
	if(geoCountryMasterList.length>0){
		html += '<div class="form-group" id="Add-geoAreaCountryId-Error">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="geoAreaCountryId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="geoAreaCountryId" style="width: 50%" onchange="getCitiesByAreaCountryId()">';
		html+=	'<option value="0">Select</option>';
		for(var i=0;i<geoCountryMasterList.length;i++){
			var id = geoCountryMasterList[i].id;
			var countryName = geoCountryMasterList[i].geoCountryName;
			html+=	'<option value='+id+'>'+countryName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="geoAreaCountryId"><option>No Countries Found</option></select>';
		html += '</div>';
	}
	/** ************************************City DropDown***************************************************** */
	if(geoCityMasterList.length>0){
		html += '<div class="form-group" id="Add-geoAreaCityId-Error">';
		html += '<label>City Name<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="geoAreaCityId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="geoAreaCityId" style="width: 50%">';
		html+=	'<option value="0">Select</option>';
		for(var i=0;i<geoCityMasterList.length;i++){
			var id = geoCityMasterList[i].id;
			var cityName = geoCityMasterList[i].geoCityName;
			html+=	'<option value='+id+'>'+cityName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-geoAreaCityId-Error">';
		html += '<label>City Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled"><option>No Cities Found</option></select>';
		html += '</div>';
	}
	/** ************************************Area Name***************************************************** */
	html += '<div class="form-group" id="Add-geoAreaName-Error">';
	html += '<label>Area Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoAreaName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control" id="geoAreaName" placeholder="Enter Area Name" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeoArea()">';
	html+=	appendCancelButton(getDivId("GeoArea"),"page-wrapper");//Cancel Button
	html += '</form>';
	return html;
}
function getCitiesByAreaCountryId(){
	$('#page-wrapper').mask("Loading...");
	var selectedGeoCountryId = $('#geoAreaCountryId option:selected').val();
	$('input[type=button]', $('#addGeoAreaForm')).prop('disabled', false);
	$('#addGeoAreaForm').find('#Add-geoAreaCityId-Error').removeClass('has-error has-feedback');
	$('#geoAreaCityId').prop('disabled',false);
	$.ajax({
		type:"POST",
		url:geoAreaUrl+"getCitiesByCountryId.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedGeoCountryId),
		success:function(response){
			$('#geoAreaCityId').html('');
			if(response.status=="LIST_CITIES_SUCCESS"){
				var listCities = response.successObject.listCities;
				$('#geoAreaCityId').append("<option value='0'>Select</option>");
				for(var i=0;i<listCities.length;i++){
					$("#geoAreaCityId").append("<option value="+listCities[i].id+">"+listCities[i].geoCityName+"</option>");
				}
			}else{
				$('input[type=button]', $('#addGeoAreaForm')).prop('disabled', true);
				$('#addGeoAreaForm').find('#Add-geoAreaCityId-Error').addClass('has-error has-feedback');
				var message = '<font style="color:red">No Cities Found</font>';
				$('#geoAreaCityId').append('<option>'+message+'</option>');
				$('#geoAreaCityId').prop('disabled',true);
			}
			$('#page-wrapper').unmask();
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*************"+response.statusText);
		}
	});
}

function saveGeoArea(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+ getDivId("GeoArea"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addGeoAreaSuccessDiv').hide();
	$('#addGeoAreaErrorDiv').hide();
	var selectCountryNameId=$('#selectCountryNameIdd').val();
	var selectCityNameId=$('#selectCityNameIdd').val();

	var geoCountryId = $('#geoAreaCountryId option:selected').val();
	var geoCityId = $('#geoAreaCityId option:selected').val();
	var geoAreaName = $.trim($('#geoAreaName').val());
	
/*	var JSONObject = {};
	JSONObject['geoCountryId'] = geoCountryId;
	JSONObject['geoCityId'] = geoCityId;
	JSONObject['geoAreaName'] = geoAreaName;

	$.post(geoAreaUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			if($('#geoAreaListTable_wrapper').length == 0){
				var tabButtonsId = $('#geoAreaMasterTabButtons');
				//var dataDivId = $('#geoAreaDataDiv');
				var dataDivId = $('#addAndEditGeoAreaDiv');
				var successDivId = "addGeoAreaSuccessDiv"
				var tableId = "geoAreaListTable";
				var html = listGeoAreasHtml(response);
				generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				
			}else{
				var tabButtonsId = $('#geoAreaMasterTabButtons');
				//var dataDivId = $('#addAndEditGeoCountryDiv');
				var dataDivId = $('#geoAreaDataDiv');
				var successDivId = "addGeoAreaSuccessDiv"
				var tableId = "geoAreaListTable";
				var html = listGeoAreasHtml(response);
				generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			}
			$('#geoAreaMasterTabButtons').show();//added by manoj
			$('#page-wrapper').unmask();
		}else if(response.status=="SAVE_ERROR"){
			//scrollDown(divId);
			$('#addGeoAreaErrorDiv').show(600);
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

	*/
	
	var geoAreaMasterJson = {
			'geoCountryId':geoCountryId,
			'geoCityId':geoCityId,
			'geoAreaName':geoAreaName
	};
	var sendAreaInfo = {
			'geoCountryId':selectCountryNameId,
			'geoCityId':selectCityNameId,
			'geoAreaName':geoAreaName
	};
	
	$.ajax({
		type:"POST",
		url:geoAreaUrl+"save.htm?sendAreaInfo="+JSON.stringify(sendAreaInfo),
		contentType:"application/json",
		data:JSON.stringify(geoAreaMasterJson),
		success:function(response){
			if(response.status=="SAVE_SUCCESS"){
				if($('#geoAreaListTable_wrapper').length == 0){
					var tabButtonsId = $('#geoAreaMasterTabButtons');
					//var dataDivId = $('#geoAreaDataDiv');
					var dataDivId = $('#addAndEditGeoAreaDiv');
					var successDivId = "addGeoAreaSuccessDiv"
					var tableId = "geoAreaListTable";
					var html = listGeoAreasHtml(response);
					generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
					
				}else{
					var tabButtonsId = $('#geoAreaMasterTabButtons');
					//var dataDivId = $('#addAndEditGeoCountryDiv');
					var dataDivId = $('#geoAreaDataDiv');
					var successDivId = "addGeoAreaSuccessDiv"
					var tableId = "geoAreaListTable";
					var html = listGeoAreasHtml(response);
					generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				}
				$('#geoAreaMasterTabButtons').show();//added by manoj
				$('#page-wrapper').unmask();
			}else if(response.status=="SAVE_ERROR"){
				//scrollDown(divId);
				$('#addGeoAreaErrorDiv').show(600);
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
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;

}
/**************************************************************************************************************************
 *                    Edit Geo Area		                                                                              *
 **************************************************************************************************************************/
function editGeoArea(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("GeoArea"));
	$.get(geoAreaUrl+"edit.htm?id="+id,function(response){
		var html = geoAreaEditFormHtml(response);
		appendGeoMasterAddOrEditForm(divId, html);
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function geoAreaEditFormHtml(response){
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var geoCityMasterList = response.successObject.geoCityMasterList;
	var geoAreaMaster = response.successObject.geoAreaMaster;
	var html = "";
	html+=	addFormHeading("Edit Area");
	html += '<form class="col-sm-5" id="editGeoAreaForm">';
	/** ***********************************Sucess Div******************************************************** *//*
	html += '<div class="alert alert-success" style="display: none;"	id="editGeoAreaSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Area Updated Successfully';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editGeoAreaErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Country Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control" id="editCountryName" style="width: 50%" disabled="disabled">';
	for(var i=0;i<geoCountryMasterList.length;i++){
		var geoCountryName = geoCountryMasterList[i].geoCountryName;
		var geoCountryId =  geoCountryMasterList[i].id;
		if(geoCountryName==geoAreaMaster.geoCountryName){
			html+=	'<option value='+geoCountryId+'>'+geoCountryName+'</option>';
		}
	}
	html +=	'</select>';
	html += '</div>';
	/** ************************************City Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>City Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control" id="editedGeoAreaCityId" style="width: 50%" disabled="disabled">';
	for(var i=0;i<geoCityMasterList.length;i++){
		var geoCityName = geoCityMasterList[i].geoCityName;
		var geoCityId = geoCityMasterList[i].id;
		if(geoCityName==geoAreaMaster.geoCityName){
			html+=	'<option value='+geoCityId+'>'+geoCityName+'</option>';
		}
	}
	html +=	'</select>';
	html += '</div>';
	/** ************************************Area Name***************************************************** */
	html += '<div class="form-group" id="Edit-geoAreaName-Error">';
	html += '<label>Area Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoAreaName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+geoAreaMaster.geoAreaName+'" class="form-control input-sm" id="editedGeoAreaName" placeholder="Enter Area Name" maxlength="50">';
	html += '</div>';	
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateGeoArea('+geoAreaMaster.id+')">';
	html+=	appendCancelButton(getDivId("GeoArea"),"page-wrapper");//Adding Cancel Button
	html +=	'</form>';
	return html;
}
function updateGeoArea(id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("GeoArea"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editGeoAreaSuccessDiv').hide();
	$('#editGeoAreaErrorDiv').hide();
	var editedGeoAreaName = $.trim($('#editedGeoAreaName').val());
	var editedGeoAreaCityId = $('#editedGeoAreaCityId').val();
	
	/*var JSONObject = {};
	JSONObject['geoCityId'] = editedGeoAreaCityId;
	JSONObject['geoAreaName'] = editedGeoAreaName;
	JSONObject['id'] = id;
	$.post(geoAreaUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#geoAreaMasterTabButtons');
			var dataDivId = $('#geoAreaDataDiv');
			var successDivId = "editGeoAreaSuccessDiv"
			var tableId = "geoAreaListTable";
			var html = listGeoAreasHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			$('#geoAreaMasterTabButtons').show();//added by manoj
		}else if(response.status=="UPDATE_ERROR"){
			//scrollDown(divId);
			$('#editGeoAreaErrorDiv').show(600);
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
	return false;*/
	
	
	
	//
	
	var sendAreaInfo = {
			'geoCityId' :editedGeoAreaCityId,
			'geoAreaName':editedGeoAreaName,
			'id':id
	};

	$.ajax({
		type:"POST",
		url:geoAreaUrl+"update.htm",
		contentType:"application/json",
		data:JSON.stringify(sendAreaInfo),
		success:function(response){
			if(response.status=="UPDATE_SUCCESS"){
				var tabButtonsId = $('#geoAreaMasterTabButtons');
				var dataDivId = $('#geoAreaDataDiv');
				var successDivId = "editGeoAreaSuccessDiv"
				var tableId = "geoAreaListTable";
				var html = listGeoAreasHtml(response);
				generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				$('#geoAreaMasterTabButtons').show();//added by manoj
			}else if(response.status=="UPDATE_ERROR"){
				//scrollDown(divId);
				$('#editGeoAreaErrorDiv').show(600);
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
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;

}
/**************************************************************************************************************************
 *                    Delete Geo Areas	                                                                              *
 **************************************************************************************************************************/
function deleteGeoAreas(){
	$.ajaxSetup({ cache: false });
	selectedGeoAreaCheckBoxLength();
	if(selectedGeoAreaIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			clearGeoAreaMessages();
			$.ajax({
				type:"POST",
				url:geoAreaUrl+"delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedGeoAreaIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#geoAreaMasterTabButtons');
						var dataDivId = $('#geoAreaDataDiv');
						var successDivId = "deleteGeoAreasSuccessDiv"
						var tableId = "geoAreaListTable";
						var html = listGeoAreasHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						$('#geoAreaMasterTabButtons').show();//added by manoj
						selectedGeoAreaIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteGeoAreasErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteGeoAreasErrorDiv').append(errorMessage);
						$('#deleteGeoAreasErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedGeoAreaIds = [];
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
/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllGeoAreaCheckBox",function(){
    $('.geoAreaCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".geoAreaCheckBox",function(){
    if($('.geoAreaCheckBox:checked').length == $('.geoAreaCheckBox').length) {
      $('#checkAllGeoAreaCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllGeoAreaCheckBox').prop('checked', false);
    }
});

function selectedGeoAreaCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.geoAreaCheckBox:checked').length) {
		selectedGeoAreaIds = [];
		$('.geoAreaCheckBox:checked').each(function() {
			selectedGeoAreaIds.push($(this).val());
		});
	}
	return false;
}

/**************************************************************************************************************************
 *                     List Geo Location Types                                                                         *
 **************************************************************************************************************************/
function geoLocationTypeList(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').unmask('Loading...');
	$('#geoLocationTypeTab').html('');
	$('#addAndEditGeoAreaDiv').hide();
	$('#geoAreaListTable_wrapper').hide();
	$.get(geoLocationTypeUrl+"list.htm",function(response){
		var html = listGeoLocationTypesHtml(response);
		$('#geoLocationTypeTab').append(html);
		$('#geoLocationTypeListTable').dataTable();
		$('#geoCityMasterTabButtons').hide();//by manoj
		$('#geoAreaMasterTabButtons').hide();//by manoj
		$('#geoLocationTypeMasterTabButtons').show();//by manoj
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"***********"+response.statusText);
		//$('#page-wrapper').unmask('Loading...');//by manoj
	});
	return false;
}
function listGeoLocationTypesHtml(response){
	var geoLocationTypeMasterList = response.successObject.geoLocationTypeMasterList;
	var html = "";
	html+=	addHeaderButtons("addGeoLocationType", "deleteGeoLocationTypes", "geoLocationTypeMasterTabButtons");
	html+=	'<div id="geoLocationTypeDataDiv">';
	html+=	'<form id="geoLocationTypeListForm">';
	/*******************************Add Geo Location Type Success Div**********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addGeoLocationTypeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;Location Type Added Successfully</div>';
	/*******************************Edit Geo Location Type Success Div**********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editGeoLocationTypeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;Location Type Updated Successfully</div>';
	/*******************************Delete Geo Location Type Success Div**********************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteGeoLocationTypesSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;Location Type(s) Deleted Successfully</div>';
	/*******************************Delete Geo Location Type Error Div**********************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteGeoLocationTypesErrorDiv">';
	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='geoLocationTypeListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllGeoLocationTypeCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Location Type Name</th>";
	html +=	"<th>Location Type Description</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<geoLocationTypeMasterList.length;i++){
		var id = geoLocationTypeMasterList[i].id;
		var geoType = geoLocationTypeMasterList[i].geoType;
		var geoTypeDescription = geoLocationTypeMasterList[i].geoTypeDescription;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="geoLocationTypeCheckBox" value='+id+'></td>';
		html+=	'<td>'+geoType+'</td>';
		html+=	'<td>'+geoTypeDescription+'</td>';
		html+=   '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editGeoLocationType('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("GeoLocationType");//Appending Div
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Geo Location Type                                                                     *
 **************************************************************************************************************************/
function addGeoLocationType(){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+ getDivId("GeoLocationType"));//Getting Add/Edit Form Div
	appendGeoMasterAddOrEditForm(divId, addGeoLocationTypeFormHtml());
}

function addGeoLocationTypeFormHtml(){
	var html = "";
	html+=	addFormHeading("Add Location Type");
	html+=	'<form class="col-sm-5" id="addGeoLocationTypeForm">';
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;"	id="addGeoLocationTypeSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> Location Type Added Successfully';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addGeoLocationTypeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Location Type***************************************************** */
	html += '<div class="form-group" id="Add-geoType-Error">';
	html += '<label>Location Type Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoType-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="geoType" placeholder="Enter Location Type" maxlength="50">';
	html += '</div>';
	/** ************************************Location Type Description***************************************************** */
	html += '<div class="form-group" id="Add-geoTypeDescription-Error">';
	html += '<label>Location Type Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoTypeDescription-span-Error" class="help-inline"></span>';
	html += '<textarea class="form-control" rows="3" id="geoTypeDescription" maxlength="100" placeholder="Location Type Description"></textarea>';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeoLocationType()">';
	html+=	appendCancelButton(getDivId("GeoLocationType"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function saveGeoLocationType(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("GeoLocationType"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addGeoLocationTypeSuccessDiv').hide();
	$('#addGeoLocationTypeErrorDiv').hide();
	var geoLocationType = $.trim($('#geoType').val());
	var geoLocationTypeDescription = $.trim($('#geoTypeDescription').val());
	var JSONObject = {};
	JSONObject['geoType'] = geoLocationType;
	JSONObject['geoTypeDescription'] = geoLocationTypeDescription;
	$.post(geoLocationTypeUrl+"save.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			var tabButtonsId = $('#geoLocationTypeMasterTabButtons');
			var dataDivId = $('#geoLocationTypeDataDiv');
			var successDivId = "addGeoLocationTypeSuccessDiv"
			var tableId = "geoLocationTypeListTable";
			var html = listGeoLocationTypesHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
		}else if(response.status=="SAVE_ERROR"){
			//scrollDown(divId);
			$('#addGeoLocationTypeErrorDiv').show(600);
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
 *                     Edit Geo Location Type                                                                     *
 **************************************************************************************************************************/
function editGeoLocationType(id){
	$('#page-wrapper').mask('Loading');
	var divId = $('#'+getDivId("GeoLocationType"));
	$.get(geoLocationTypeUrl+"edit.htm?id="+id,function(response){
		if(response.status=="SUCCESS"){
			var html = geoLocationTypeEditFormHtml(response);
			appendGeoMasterAddOrEditForm(divId, html);
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**************"+response.statusText);
	});
}

function geoLocationTypeEditFormHtml(response){
	var geoLocationTypeMaster = response.successObject.geoLocationTypeMaster;
	var id = geoLocationTypeMaster.id;
	var geoType = geoLocationTypeMaster.geoType;
	var geoTypeDescription = geoLocationTypeMaster.geoTypeDescription;
	var html = "";
	html+=	addFormHeading("Edit Geo Location Type");
	html+=	'<form id="editGeoLocationTypeForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editGeoLocationTypeErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Location Type***************************************************** */
	html += '<div class="form-group" id="Edit-geoType-Error">';
	html += '<label>Location Type Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoType-span-Error" class="help-inline"></span>';
	html += '<input	type="text" value="'+geoType+'" class="form-control" id="editedGeoType" placeholder="Enter Location Type" maxlength="50">';
	html += '</div>';
	/** ************************************Location Type Description***************************************************** */
	html += '<div class="form-group" id="Edit-geoTypeDescription-Error">';
	html += '<label>Location Type Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoTypeDescription-span-Error" class="help-inline"></span>';
	html += '<textarea class="form-control"  rows="3" id="editedGeoTypeDescription" maxlength="100" placeholder="Location Type Description">'+geoTypeDescription+'</textarea>';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateGeoLocationType('+id+')">';
	html+=	appendCancelButton(getDivId("GeoLocationType"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function updateGeoLocationType(id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("GeoLocationType"));
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editGeoLocationTypeSuccessDiv').hide();
	$('#editGeoLocationTypeErrorDiv').hide();
	var editedGeoLocationType = $.trim($('#editedGeoType').val());
	var editedGeoLocationTypeDescription = $.trim($('#editedGeoTypeDescription').val());
	var JSONObject = {};
	JSONObject['geoType'] = editedGeoLocationType;
	JSONObject['geoTypeDescription'] = editedGeoLocationTypeDescription;
	JSONObject['id'] = id;
	$.post(geoLocationTypeUrl+"update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			var tabButtonsId = $('#geoLocationTypeMasterTabButtons');
			var dataDivId = $('#geoLocationTypeDataDiv');
			var successDivId = "editGeoLocationTypeSuccessDiv"
			var tableId = "geoLocationTypeListTable";
			var html = listGeoLocationTypesHtml(response);
			generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
		}else if(response.status=="UPDATE_ERROR"){
			//scrollDown(divId);
			$('#editGeoLocationTypeErrorDiv').show(600);
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

/**************************************************************************************************************************
 *                    Delete Geo Location Types	                                                                              *
 **************************************************************************************************************************/
function deleteGeoLocationTypes(){
	$.ajaxSetup({ cache: false });
	selectedGeoLocationTypeCheckBoxLength();
	if(selectedGeoLocationTypeIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			clearGeoLocationTypeMessages();
			$.ajax({
				type:"POST",
				url:geoLocationTypeUrl+"delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedGeoLocationTypeIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#geoLocationTypeMasterTabButtons');
						var dataDivId = $('#geoLocationTypeDataDiv');
						var successDivId = "deleteGeoLocationTypesSuccessDiv"
						var tableId = "geoLocationTypeListTable";
						var html = listGeoLocationTypesHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						selectedGeoLocationTypeIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteGeoLocationTypesErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteGeoLocationTypesErrorDiv').append(errorMessage);
						$('#deleteGeoLocationTypesErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedGeoLocationTypeIds = [];
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
/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllGeoLocationTypeCheckBox",function(){
    $('.geoLocationTypeCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".geoLocationTypeCheckBox",function(){
    if($('.geoLocationTypeCheckBox:checked').length == $('.geoLocationTypeCheckBox').length) {
      $('#checkAllGeoLocationTypeCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllGeoLocationTypeCheckBox').prop('checked', false);
    }
});

function selectedGeoLocationTypeCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.geoLocationTypeCheckBox:checked').length) {
		selectedGeoLocationTypeIds = [];
		$('.geoLocationTypeCheckBox:checked').each(function() {
			selectedGeoLocationTypeIds.push($(this).val());
		});
	}
	return false;
}

/**************************************************************************************************************************
 *                     List Geo Locations                                                                         *
 **************************************************************************************************************************/
function geoLocationList(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#geoLocationTab').html('');
	$('#geoCityMasterTabButtons').hide();//added by manoj
	$('#geoAreaMasterTabButtons').hide();//added by manoj
	$('#geoAreaListTable_wrapper').hide();
	$.get(geoLocationUrl+"list.htm",function(response){
		var html = listGeoLocationsHtml(response);
		$('#geoLocationTab').append(html);
		$('#geoLocationsListTable').dataTable();
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').append(response.status+"***********"+response.statusText);
	});
	return false;
}
function listGeoLocationsHtml(response){
	var geoLocationMasterList = response.successObject.geoLocationList;
	var html = "";
	html+=	addHeaderButtons("addGeoLocation", "deleteGeoLocations", "geoLocationTabButtons");
	html+=	'<div id="geoLocationDataDiv">';
	html+=	'<form id="geoLocationListForm">';
	/*****************************Geo Location Add Success Div************************************************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addGeoLocationSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;Location Added Successfully</div>';
	/*****************************Geo Location Edit Success Div************************************************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editGeoLocationSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;Location Updated Successfully</div>';
	/*****************************Geo Location Delete Success Div************************************************************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteGeoLocationsSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;Location(s) Deleted Successfully</div>';
	/*****************************Geo Location Delete Error Div************************************************************************************************/
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteGeoLocationsErrorDiv">';

	html += '</div>';
	
	html += "<table class='table table-striped dataTable no-footer' id='geoLocationsListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllGeoLocationsCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Location</th>";
	html +=	"<th>Area</th>";
	html +=	"<th>City</th>";
	html +=	"<th>Country</th>";
	html +=	"<th>Location Type</th>";
	html+=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<geoLocationMasterList.length;i++){
		var id = geoLocationMasterList[i].id;
		var geoName = geoLocationMasterList[i].geoName;
		var city = geoLocationMasterList[i].geoType;
		var area = geoLocationMasterList[i].geoAreaName;
		var city = geoLocationMasterList[i].geoCityName;
		var country = geoLocationMasterList[i].geoCountryName;
		var geoTypeName = geoLocationMasterList[i].geoTypeName;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="geoLocationCheckBox" value='+id+'></td>';
		html+=	'<td>'+geoName+'</td>';
		html+=	'<td>'+area+'</td>';
		html+=	'<td>'+city+'</td>';
		html+=	'<td>'+country+'</td>';
		html+=	'<td>'+geoTypeName+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editGeoLocation('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("GeoLocation");
	html+=	'</div>';
	return html;
}
/**************************************************************************************************************************
 *                     Add Geo Location                                                                     *
 **************************************************************************************************************************/
function addGeoLocation(){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("GeoLocation"));
	$.get("../geoLocation/add.htm",function(response){
		var html = addGeoLocationFormHtml(response);
		appendGeoMasterAddOrEditForm(divId, html);
	}).fail(function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	});
	return false;
}

function addGeoLocationFormHtml(response){
	var geoCountryMasterList = response.successObject.geoCountriesList;
	var geoCityMasterList = response.successObject.listCities;
	var geoAreasList = response.successObject.listAreas;
	var geoLocationTypeMasterList = response.successObject.geoLocationTypeMasterList;
	
	var html = "";
	html+= addFormHeading("Add Location");
	html+=	'<form class="col-sm-12" id="addGeoLocationForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addGeoLocationErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country DropDown***************************************************** */
	if(geoCountryMasterList.length>0){
		html += '<div class="form-group">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="geoLocationCountryId" style="width: 50%" onchange="getCitiesByLocationCountryId()">';
		for(var i=0;i<geoCountryMasterList.length;i++){
			var id = geoCountryMasterList[i].id;
			var countryName = geoCountryMasterList[i].geoCountryName;
			html+=	'<option value='+id+'>'+countryName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled"><option>No Countries Found</option></select>';
		html += '</div>';
	}
	/** ************************************City DropDown***************************************************** */
	if(geoCityMasterList.length>0){
		html += '<div class="form-group" id="locationCitiesDropDownDiv">';
		html += '<label>City Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="geoLocationCityId" style="width: 50%" onchange="getAreasByCityId()">';
		for(var i=0;i<geoCityMasterList.length;i++){
			var id = geoCityMasterList[i].id;
			var cityName = geoCityMasterList[i].geoCityName;
			html+=	'<option value='+id+'>'+cityName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="locationCitiesDropDownDiv">';
		html += '<label>City Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="geoLocationCityId" style="width: 50%" onchange="getAreasByCityId()"><option>No Cities Found</option></select>';
		html += '</div>';
	}
	/** ************************************Area DropDown***************************************************** */
	if(geoAreasList.length>0){
		html += '<div class="form-group" id="locationAreasDropDownDiv">';
		html += '<label>Area Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="geoLocationAreaId" style="width: 50%">';
		for(var i=0;i<geoAreasList.length;i++){
			var id = geoAreasList[i].id;
			var areaName = geoAreasList[i].geoAreaName;
			html+=	'<option value='+id+'>'+areaName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error"  id="locationAreasDropDownDiv">';
		html += '<label>Area Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="geoLocationAreaId" style="width: 50%"><option>No Areas Found</option></select>';
		html += '</div><br><br>';
	}
	/** ************************************Location Type DropDown***************************************************** */
	html+=	'<div style="height:100px;">';
	html += '<div class="form-group">';
	html +=	'<select name="selectfrom" id="locationTypes" multiple size="5" class="col-xs-3">';
	for(var i=0;i<geoLocationTypeMasterList.length;i++){
		html+=	'<option value='+geoLocationTypeMasterList[i].id+'>'+geoLocationTypeMasterList[i].geoType+'</option>';
	}
	html +=	'</select>';
	html+=	'&nbsp;<a href="JavaScript:void(0);" id="btn-add-locationType" onclick ="appendLocationTypes()" class="col-xs-1">Add &raquo;</a>';
	html+=	'<a href="JavaScript:void(0);" id="btn-remove-locationType" onclick ="removeLocationTypes()" class="col-xs-2">&laquo; Remove</a>';
	html+=	'<select name="selectto" id="selectedLocationTypes" multiple size="5" class="col-xs-3"></select>';
	html+=	'</div>';
	html+=	'</div>';
	/** ************************************Location Name***************************************************** */
	html += '<div class="form-group" id="Add-geoName-Error">';
	html += '<label>Location Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoName-span-Error" class="help-inline"></span>';
	html += '<input type="text" class="form-control input-sm" id="geoName" maxlength="100" placeholder="Enter Location Name">';
	html += '</div>';
	
	/** ************************************Location Name Description***************************************************** */
	html += '<div class="form-group" id="Add-geoDescription-Error">';
	html += '<label>Location Name Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="geoDescription-span-Error" class="help-inline"></span>';
	html += '<textarea class="form-control"  rows="3" id="geoDescription" maxlength="100" placeholder="Enter Location Name Description"></textarea>';
	html += '</div>';
	/** ************************************Address Description***************************************************** */
	html += '<div class="form-group" id="Add-geoAddress-Error">';
	html += '<label>Address<font style="color: red"></font></label>';
	html += '<span style="color: #a94442" id="geoAddress-span-Error" class="help-inline"></span>';
	html += '<textarea class="form-control"  rows="3" id="geoAddress" maxlength="100" placeholder="Enter Address"></textarea>';
	html += '</div>';
	/** ************************************Latitude***************************************************** */
	html += '<div class="form-group" id="Add-geoLatitude-Error">';
	html += '<label>Latitude<font style="color: red"></font></label>';
	html += '<span style="color: #a94442" id="geoLatitude-span-Error" class="help-inline-float"></span>';
	html += '<input type="text" class="form-control input-sm" id="geoLatitude" maxlength="100" placeholder="Enter Latitude" onkeyup="geoLatitudeAddFloatValidation()">';
	html += '</div>';
	/** ************************************Longitude***************************************************** */
	html += '<div class="form-group" id="Add-geoLongitude-Error">';
	html += '<label>Longitude<font style="color: red"></font></label>';
	html += '<span style="color: #a94442" id="geoLongitude-span-Error" class="help-inline-float"></span>';
	html += '<input type="text" class="form-control input-sm" id="geoLongitude" maxlength="100" placeholder="Enter Longitude" onkeyup="geoLongitudeAddFloatValidation()">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	if(geoCountryMasterList.length==0 || geoCityMasterList.length==0 ||geoAreasList.length==0 ||geoLocationTypeMasterList.length==0){
		html += '<input type="button" class="btn btn-primary" value="Add"  disabled="disabled">';
	}else{
		html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveGeoLocation()">';
	}
	html+=	appendCancelButton(getDivId("GeoLocation"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function getCitiesByLocationCountryId(){
	$('#page-wrapper').mask('Loading...');
	var selectedLocationGeoCountryId = $('#geoLocationCountryId option:selected').val();
	$('input[type=button]', $('#addGeoLocationForm')).prop('disabled', false);
	$('#addGeoLocationForm').find('#locationCitiesDropDownDiv,#locationAreasDropDownDiv').removeClass('has-error has-feedback');
	$('#geoLocationCityId').prop('disabled',false);
	$('#geoLocationAreaId').prop('disabled',false);
	$.ajax({
		type:"POST",
		url:geoAreaUrl+"getCitiesByCountryId.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedLocationGeoCountryId),
		success:function(response){
			$('#geoLocationCityId').html('');
			$('#geoLocationAreaId').html('');
			if(response.status=="LIST_CITIES_SUCCESS"){
				var listCities = response.successObject.listCities;
				for(var i=0;i<listCities.length;i++){
					$("#geoLocationCityId").append("<option value="+listCities[i].id+">"+listCities[i].geoCityName+"</option>");
				}
				getAreasByCityId();
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}else{
				$('#addGeoLocationForm').find('#locationCitiesDropDownDiv','#locationAreasDropDownDiv').addClass('has-error has-feedback');
				var message = '<font style="color:red">No Cities Found</font>';
				var emptyAreaMessage = '<font style="color:red">No Areas Found</font>';
				$('#geoLocationAreaId').append('<option>'+emptyAreaMessage+'</option>');
				$('#geoLocationCityId').append('<option>'+message+'</option>');
				$('#geoLocationAreaId,#geoLocationCityId').prop('disabled',true);
				$('input[type=button]', $('#addGeoLocationForm')).prop('disabled', true);
			}
			$('#page-wrapper').unmask();
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*************"+response.statusText);
		}
	});

}

function getAreasByCityId(){
	$('#page-wrapper').mask('Loading...');
	var selectedLocationGeoAreaId = $('#geoLocationCityId option:selected').val();
	$('input[type=button]', $('#addGeoLocationForm')).prop('disabled', false);
	$('#addGeoLocationForm').find('#locationAreasDropDownDiv').removeClass('has-error has-feedback');
	$('#geoLocationAreaId').prop('disabled',false);
	$.ajax({
		type:"POST",
		url:geoLocationUrl+"getAreasByCityId.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedLocationGeoAreaId),
		success:function(response){
			$('#geoLocationAreaId').html('');
			if(response.status=="AREAS_LIST_SUCCESS"){
				var listAreas = response.successObject.listAreas;
				for(var i=0;i<listAreas.length;i++){
					$("#geoLocationAreaId").append("<option value="+listAreas[i].id+">"+listAreas[i].geoAreaName+"</option>");
					$('#page-wrapper').unmask();
				}
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}else{
				$('#addGeoLocationForm').find('#locationAreasDropDownDiv').addClass('has-error has-feedback');
				var message = '<font style="color:red">No Areas Found</font>';
				$('#geoLocationAreaId').append('<option>'+message+'</option>');
				$('input[type=button]', $('#addGeoLocationForm')).prop('disabled', true);
				$('#geoLocationAreaId').prop('disabled',true);
			}
			$('#page-wrapper').unmask();
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*************"+response.statusText);
		}
	});

}
function appendLocationTypes(){
	 $('#locationTypes option:selected').each( function() {
         $('#selectedLocationTypes').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
     $(this).remove();
 });
}
function removeLocationTypes(){
	 $('#selectedLocationTypes option:selected').each( function() {
         $('#locationTypes').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
         $(this).remove();
     });
}

function updateLocationTypes(){
	$('#editedLocationTypes option:selected').each( function() {
        $('#editedSelectedLocationTypes').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
});
}
function removeUpdatedLocationTypes(){
	$('#editedSelectedLocationTypes option:selected').each( function() {
        $('#editedLocationTypes').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
});
}

function resetSelectedLocationTypes(){
	$('#selectedLocationTypes option').each(function(){
		$('#locationTypes').append('<option value="'+$(this).val()+'">'+$(this).text()+'</option>');
		$(this).remove();
	});
}
function saveGeoLocation(){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	var divId = $('#'+getDivId("GeoLocation"));
	$('#page-wrapper').mask('Loading...');
	var $form = $('#addGeoLocationForm');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#addGeoLocationSuccessDiv').hide();
	$('#addGeoLocationErrorDiv').hide();
	var locationTypeIds = [];
	var addedLocationTypesLength = $('#selectedLocationTypes > option').length;
	if(addedLocationTypesLength>0){
		$('#selectedLocationTypes option').each(function() { 
			  var value = $(this).val();
			  locationTypeIds.push(value);
		  });
		var geoLocationCountryId = $('#geoLocationAreaId option:selected').val();
		var geoLocationCityId = $('#geoLocationCityId option:selected').val();
		var geoLocationAreaId = $('#geoLocationAreaId option:selected').val();
		var geoName = $.trim($('#geoName').val());
		var geoDescription = $.trim($('#geoDescription').val());
		var geoAddress  = $.trim($('#geoAddress').val());
		var geoLatitude = $.trim($('#geoLatitude').val());
		var geoLongitude = $.trim($('#geoLongitude').val());
		if(geoLatitude==""){
			geoLatitude = 0.0;
		}if(geoLongitude==""){
			geoLongitude = 0.0;
		}
		
		var JSONObject = {};
		JSONObject['geoName'] = geoName;
		JSONObject['geoDescription'] = geoDescription;
		JSONObject['geoAddress'] = geoAddress;
		JSONObject['geoLatitude'] = geoLatitude;
		JSONObject['geoLongitude'] = geoLongitude;
		JSONObject['geoAreaId'] = geoLocationAreaId;
		var locationTypeIdsLength = locationTypeIds.length;
		  var locatinTypeIdsArrayList = '';
		  for(var i=0; i<locationTypeIdsLength; i++){
		    locatinTypeIdsArrayList += locationTypeIds[i];
		    if(locationTypeIdsLength != (i+1))
		      locatinTypeIdsArrayList += ',';
		  }
		JSONObject['geoTypeIds'] =  locatinTypeIdsArrayList;
		$.post(geoLocationUrl+"save.htm",JSONObject,function(response){
			if(response.status=="SAVE_SUCCESS"){
				var tabButtonsId = $('#geoLocationTabButtons');
				var dataDivId = $('#geoLocationDataDiv');
				var successDivId = "addGeoLocationSuccessDiv";
				var tableId = "geoLocationsListTable";
				var html = listGeoLocationsHtml(response);
				generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			}else if(response.status=="SAVE_ERROR"){
				//scrollDown(divId);
				$('#addGeoLocationErrorDiv').show(600);
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
			$('#page-wrapper').mask(response.status+"**************"+response.statusText);
		});
	}else{
		alert("Please Add atleast one location type");
		$('#page-wrapper').unmask();
	}
	return false;
}
/**************************************************************************************************************************
 *                     Edit Geo Location                                                                     *
 **************************************************************************************************************************/
function editGeoLocation(id){
	$('#page-wrapper').mask('Loading');
	var divId = $('#'+getDivId("GeoLocation"));
	$.get(geoLocationUrl+"edit.htm?id="+id,function(response){
		if(response.status=="SUCCESS"){
			var html = geoLocationEditFormHtml(response);
			appendGeoMasterAddOrEditForm(divId, html);
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**************"+response.statusText);
	});
}


function geoLocationEditFormHtml(response){
	var geoLocation = response.successObject.geoLocation;
	var geoCountryMasterList = response.successObject.geoCountryMasterList;
	var geoCityMasterList = response.successObject.geoCityMasterList;
	var selectedGeoLocationTypesList = response.successObject.selectedGeoLocationTypesList;
	var geoLocationTypesList = response.successObject.geoLocationTypesList;
	var html = "";
	html+=	addFormHeading("Edit Location");
	html+=	'<form class="col-sm-12" id="editGeoLocationForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editGeoLocationErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Country DropDown***************************************************** */
		html += '<div class="form-group">';
		html += '<label>Country Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control"  style="width: 50%" disabled="disabled">';
		for(var i=0;i<geoCountryMasterList.length;i++){
			var id = geoCountryMasterList[i].id;
			var countryName = geoCountryMasterList[i].geoCountryName;
			if(countryName == geoLocation.geoCountryName){
				html+=	'<option value='+id+'>'+countryName+'</option>';
			}
		}
		html +=	'</select>';
		html += '</div>';
	/** ************************************City DropDown***************************************************** */
		html += '<div class="form-group">';
		html += '<label>City Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control"  style="width: 50%" disabled="disabled">';
		for(var i=0;i<geoCityMasterList.length;i++){
			var id = geoCityMasterList[i].id;
			var cityName = geoCityMasterList[i].geoCityName;
			if(cityName == geoLocation.geoCityName){
				html+=	'<option value='+id+'>'+cityName+'</option>';
			}
		}
		html +=	'</select>';
		html += '</div>';
	/** ************************************Area DropDown***************************************************** */
		html += '<div class="form-group">';
		html += '<label>Area Name<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" style="width: 50%" disabled="disabled">';
		html+=	'<option>'+geoLocation.geoAreaName+'</option>';
		html +=	'</select>';
		html += '</div>';

	/** ************************************Location Type DropDown***************************************************** */
	html+=	'<div style="height:100px;">';
	html += '<div class="form-group">';
	html +=	'<select name="selectfrom" id="editedLocationTypes" multiple size="5" class="col-xs-3">';
	for(var i=0;i<geoLocationTypesList.length;i++){
		html+=	'<option value='+geoLocationTypesList[i].id+'>'+geoLocationTypesList[i].geoType+'</option>';
	}
	html +=	'</select>';
	html+=	'&nbsp;<a href="JavaScript:void(0);" id="btn-add-locationType" onclick ="updateLocationTypes()" class="col-xs-1">Add &raquo;</a>';
	html+=	'<a href="JavaScript:void(0);" id="btn-remove-locationType" onclick ="removeUpdatedLocationTypes()" class="col-xs-2">&laquo; Remove</a>';
	html+=	'<select name="selectto" id="editedSelectedLocationTypes" multiple size="5" class="col-xs-3"">';
	for(var i=0;i<selectedGeoLocationTypesList.length;i++){
		html+=	'<option value='+selectedGeoLocationTypesList[i].id+'>'+selectedGeoLocationTypesList[i].geoType+'</option>';
	}
	html+=	'</select>';
	html+=	'</div>';
	html+=	'</div>';
	/** ************************************Location Name***************************************************** */
	html += '<div class="form-group" id="Edit-geoName-Error">';
	html += '<label>Location Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoName-span-Error" class="help-inline"></span>';
	html += '<input type="text" value="'+geoLocation.geoName+'" class="form-control" id="editedGeoName" maxlength="100" placeholder="Enter Location Name">';
	html += '</div>';
	
	/** ************************************Location Name Description***************************************************** */
	html += '<div class="form-group" id="Edit-geoDescription-Error">';
	html += '<label>Location Name Description<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-geoDescription-span-Error" class="help-inline"></span>';
	html += '<textarea class="form-control"  rows="3" id="editedGeoDescription" maxlength="100" placeholder="Enter Location Name Description">'+geoLocation.geoDescription+'</textarea>';
	html += '</div>';
	/** ************************************Address Description***************************************************** */
	html += '<div class="form-group" id="Edit-geoAddress-Error">';
	html += '<label>Address<font style="color: red"></font></label>';
	html += '<span style="color: #a94442" id="edit-geoAddress-span-Error" class="help-inline"></span>';
	html += '<textarea class="form-control"  rows="3" id="editedGeoAddress" maxlength="100" placeholder="Enter Address">'+geoLocation.geoAddress+'</textarea>';
	html += '</div>';
	/** ************************************Latitude***************************************************** */
	html += '<div class="form-group" id="Edit-geoLatitude-Error">';
	html += '<label>Latitude<font style="color: red"></font></label>';
	html += '<span style="color: #a94442" id="edit-geoLatitude-span-Error" class="help-inline-float"></span>';
	html += '<input type="text" value="'+geoLocation.geoLatitude+'" class="form-control" id="editedGeoLatitude" maxlength="100" placeholder="Enter Latitude" onkeyup="geoLatitudeEditFloatValidation()">';
	html += '</div>';
	/** ************************************Longitude***************************************************** */
	html += '<div class="form-group" id="Edit-geoLongitude-Error">';
	html += '<label>Longitude<font style="color: red"></font></label>';
	html += '<span style="color: #a94442" id="edit-geoLongitude-span-Error" class="help-inline-float"></span>';
	html += '<input type="text" value="'+geoLocation.geoLongitude+'" class="form-control" id="editedGeoLongitude" maxlength="100" placeholder="Enter Longitude" onkeyup="geoLongitudeEditFloatValidation()">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateGeoLocation('+geoLocation.id+')">';
	html+=	appendCancelButton(getDivId("GeoLocation"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
	
}
function updateGeoLocation(id){
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("GeoLocation"));
	var $form = $('#editGeoLocationForm');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#editGeoLocationSuccessDiv').hide();
	$('#editGeoLocationErrorDiv').hide();
	var editedLocationTypeIds = [];
	var JSONObject = {};
	var editedLocationTypeIdsLength = $('#editedSelectedLocationTypes > option').length;
	if(editedLocationTypeIdsLength>0){
		$('#editedSelectedLocationTypes option').each(function() { 
			  var value = $(this).val();
			  editedLocationTypeIds.push(value);
		  });
		var editedGeoName = $.trim($('#editedGeoName').val());
		var editedGeoDescription = $.trim($('#editedGeoDescription').val());
		var editedGeoAddress  = $.trim($('#editedGeoAddress').val());
		var editedGeoLatitude = $.trim($('#editedGeoLatitude').val());
		var editedGeoLongitude = $.trim($('#editedGeoLongitude').val());
		if(editedGeoLatitude==""){
			editedGeoLatitude = 0.0;
		}if(editedGeoLongitude==""){
			editedGeoLongitude = 0.0;
		}
		var updatedLocationTypeIdsLength = editedLocationTypeIds.length;
		//Converting Array to ArrayList
		  var editedLocationTypeIdsArrayList = '';
		  for(i=0; i<updatedLocationTypeIdsLength; i++){
		    editedLocationTypeIdsArrayList += editedLocationTypeIds[i];
		    if(updatedLocationTypeIdsLength != (i+1))
		      editedLocationTypeIdsArrayList += ',';
		  }
		JSONObject['geoTypeIds'] =  editedLocationTypeIdsArrayList;
		JSONObject['geoName'] = editedGeoName;
		JSONObject['geoDescription'] = editedGeoDescription;
		JSONObject['geoAddress'] = editedGeoAddress;
		JSONObject['geoLatitude'] = editedGeoLatitude;
		JSONObject['geoLongitude'] = editedGeoLongitude;
		JSONObject['id'] = id;
		$.post(geoLocationUrl+"update.htm",JSONObject,function(response){
			if(response.status=="UPDATE_SUCCESS"){
				var tabButtonsId = $('#geoLocationTabButtons');
				var dataDivId = $('#geoLocationDataDiv');
				var successDivId = "editGeoLocationSuccessDiv";
				var tableId = "geoLocationsListTable";
				var html = listGeoLocationsHtml(response);
				generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			}else if(response.status=="UPDATE_ERROR"){
				//scrollDown(divId);
				$('#editGeoLocationErrorDiv').show(600);
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
			$('#page-wrapper').mask(response.status+"**************"+response.statusText);
		});
	}else{
		alert("Please Add atleast one location type");
		$('#page-wrapper').unmask();
	}
	
	return false;

}
/**************************************************************************************************************************
 *                    Delete Geo Locations	                                                                              *
 **************************************************************************************************************************/
function deleteGeoLocations(){
	$.ajaxSetup({ cache: false });
	selectedGeoLocationCheckBoxLength();
	if(selectedGeoLocationIds.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			clearGeoLocationMessages();
			$.ajax({
				type:"POST",
				url:geoLocationUrl+"delete.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedGeoLocationIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#geoLocationTabButtons');
						var dataDivId = $('#geoLocationDataDiv');
						var successDivId = "deleteGeoLocationsSuccessDiv";
						var tableId = "geoLocationsListTable";
						var html = listGeoLocationsHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						selectedGeoLocationIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteGeoLocationsErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteGeoLocationsErrorDiv').append(errorMessage);
						$('#deleteGeoLocationsErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedGeoLocationIds = [];
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
/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllGeoLocationsCheckBox",function(){
    $('.geoLocationCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".geoLocationCheckBox",function(){
    if($('.geoLocationCheckBox:checked').length == $('.geoLocationCheckBox').length) {
      $('#checkAllGeoLocationsCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllGeoLocationsCheckBox').prop('checked', false);
    }
});

function selectedGeoLocationCheckBoxLength() {
	$.ajaxSetup({ cache: false });//Clear Browser Cache
	if ($('.geoLocationCheckBox:checked').length) {
		selectedGeoLocationIds = [];
		$('.geoLocationCheckBox:checked').each(function() {
			selectedGeoLocationIds.push($(this).val());
		});
	}
	return false;
}

/**************************************************************************************************************************
 *                     Upload File			                                                                              *
 **************************************************************************************************************************/
var uploadedGeoMasterFilePath = "";
function geoMasterUploadFile(){
	$('#geoMasterUploadFileTab').html('');
	$('#geoCityMasterTabButtons').hide();//by manoj
	$('#geoAreaMasterTabButtons').hide();//by manoj
	$('#geoAreaListTable_wrapper').hide();
	//$('#geoLocationTabButtons').show();//by manoj
	/********************Upload GeoMaster File *******************************/
	var html = "";
	html+=	'<div>';
	html+=	'<h4 style="color: green;">Upload GeoMaster File</h4><hr>';
	html+=	'<form action="POST" encypte="multipart/form-data" id="uploadGeoMasterFileForm">';
	/******************Success Div********************************/
	html+=	'<div class="alert alert-success" style="display: none;"	id="uploadGeoMasterFileSuccessDiv">';
	html+=		'&nbsp;<img alt="../" src="../resources/images/done.png">File Uploaded Successfully';
	html+=	'</div>';
	/******************Error Div********************************/
	html+=	'<div class="alert alert-danger alert-error" style="display: none;"	id="uploadGeoMasterFileErrorDiv">';
	html+=	'</div>';
	html+=	'<br>';
	html+=	'<input type="button" class="btn btn-info btn-xs" id="downloadGeoMasterTemplateButton" onclick="downloadGeoMasterTemplate()" value="Download Template"><br>';
	html+=	 '<span id="uploadGeoMasterFileSpanError"></span><br>';
	html+=	 '<span id="uploadGeoMasterFileSpanButton"></span><br>';
	html+=	 '<span id="errorIndicationSpanId"></span>';
	html+=	'<p style="color:green">The system only accepts .xlsx and .xls extension</p>';
	html+=	'<input type="file" id="geoMasterFileData" name="geoMasterFileData"><br><input type="button" class="btn btn-primary btn-sm" value="Upload File..." onclick="uploadGeoMasterFile()"></input><br>';
	html+=	'</form>';
	html+=	'</div>';
	
	$('#geoMasterUploadFileTab').append(html);
	return false;
}
function downloadGeoMasterTemplate(){
	redirectView("../geoMaster/downloadGeoMaster.htm");
	return false;
}

function uploadGeoMasterFile(){
	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#uploadGeoMasterFileErrorDiv').hide();
	 var geoMasterUploadedFile = new FormData();
	 geoMasterUploadedFile.append("file", geoMasterFileData.files[0]);
	 $.ajax({
		    url: geoMasterUploadFileUrl+'importGeoMasterFile.htm',
		    data: geoMasterUploadedFile,
		    dataType: 'json',
		    processData: false,
		    contentType: false,
		    type: 'POST',
		    success: function(response){
		    	$("#geoMasterFileData").val(""); 
		    	$('#page-wrapper').unmask();
		    	$('#uploadGeoMasterFileErrorDiv').html('');
		    	$('#downloadGeoMasterTemplateButton').removeAttr('disabled');
		    	if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' ||  response.status=="INVALID_EXCEL" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
		    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
		    		$('#uploadGeoMasterFileErrorDiv').append(html);
		    		$('#uploadGeoMasterFileErrorDiv').show(600);
		    		if(response.status=="EXCEL_UPLOAD_ERROR"){
		    			$('#downloadGeoMasterTemplateButton').attr('disabled','disabled');
		    			uploadedGeoMasterFilePath = response.successObject.geoCountryErrorsExcelPath;
			    		var html = 	'<br><input type="button" class="btn btn-info btn-xs" onclick="downloadGeoMasterErrorsExcel()" value="Download Excel"><br>';
			    		$('#uploadGeoMasterFileSpanButton').html(html);
			    		$('#uploadGeoMasterFileInfoDiv').show(600);
			    		$('#uploadGeoMasterFileInfoDiv').show(600);
		    		}
		    	}else if(response.status=="UPLOAD_SUCCESS"){
		    		$('#uploadGeoMasterFileSuccessDiv').show(600);
		    		$('#downloadGeoMasterTemplateButton').removeAttr('disabled');
		    	}
		    	else if(response.status=="EXCEPTION_ERROR"){
		    		var html = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
		    		$('#uploadGeoMasterFileErrorDiv').append(html);
		    		$('#uploadGeoMasterFileErrorDiv').show(600);
		    		$('#page-wrapper').unmask();
		    	}
		    	
		    
		    },error:function(response){
		    	$('#page-wrapper').mask(response.status+"***************"+response.statusText);
		    }
	 });
	 return false;
}

function downloadGeoMasterErrorsExcel(){
	redirectView(uploadedGeoMasterFilePath);
}

function appendGeoMasterAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearGeoCountryMessages();//Clearing Geo Country Error/Sucess Message Div
	clearGeoCityMessages();//
	clearGeoAreaMessages();
	clearGeoLocationTypeMessages();
	clearGeoLocationMessages();
	maskId.unmask();
}
function clearGeoCountryMessages(){
	$('#addCountrySuccessDiv,#editCountrySuccessDiv,#deleteGeoCountriesSuccessDiv,#deleteGeoCountriesErrorDiv,#geoCityMasterTabButtons').hide();//change by manoj
}
function clearGeoCityMessages(){
	$('#addGeoCitySuccessDiv,#editGeoCitySuccessDiv,#deleteGeoCitiesSuccessDiv,#deleteGeoCitiesErrorDiv').hide();
}
function clearGeoAreaMessages(){
	$('#addGeoAreaSuccessDiv,#editGeoAreaSuccessDiv,#deleteGeoAreasSuccessDiv,#deleteGeoAreasErrorDiv').hide();
}
function clearGeoLocationTypeMessages(){
	$('#addGeoLocationTypeSuccessDiv,#editGeoLocationTypeSuccessDiv,#deleteGeoLocationTypesSuccessDiv,#deleteGeoLocationTypesErrorDiv').hide();

}
function clearGeoLocationMessages(){
	$('#addGeoLocationSuccessDiv,#editGeoLocationSuccessDiv,#deleteGeoLocationsSuccessDiv,#deleteGeoLocationsErrorDiv').hide();

}