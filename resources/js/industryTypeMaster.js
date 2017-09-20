var $addAndEditIndustryMasterDiv = $("#addAndEditIndustryMasterDiv");
var selectedCheckBoxes=new Array();
var count=0;
var trCount = 0;

/********************************************************************************************************************************************
 ************************** Add Form ************************************************************************************************************
 **********************************************************************************************************************************************/

function addSegment()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group input-group" id="myTable">'
		+'<input type="text" class="form-control input-sm" name="segmentses" placeholder="segment" maxlength="50" id="segmentCategory_'+count+'">'
		+'<span class="input-group-btn">'
		+'<button type="button" id="IndustryType'+count+'" onclick="deleteTextBox('+count+')" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-trash"></i>'
		+'</button>'
		+'</span>'
		+'</div>';
	$("#addSegment").append(html);
}

function deleteTextBox(count)
{
	$("#segmentCategory_"+count).parent().remove();
	count--;
}

/********************************************************************************************************************************************
 ************************** Add Industry Segment Form ************************************************************************************************************
 **********************************************************************************************************************************************/
function addIndustry(){
	$("#listGeneralDepartmentAttributeTab").html('');
	$("#industryDropDown").html('');
	$("#newIndustryType").html('');
	$("#editIndustryTypeDiv").html('');
	$('#successIndustryTypeDiv').hide();
	$('#errorIndustryTypeDiv').hide();
	$('.help-inline').html('');
	$('#industryType-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#SegmentCategory-Error').removeClass('has-error has-feedback');
	$("#datas").html('');
	$("#newIndustryTypeOrganization").html('');
	$("#btnView").show();
	$("#industryType").html('');
	var html="";
	var divId = $('#newIndustryType');
	var divIdToHide = "newIndustryType";
	divIdToHide = "'"+divIdToHide+"'";
	appendDivId = "page-wrapper";
	appendDivId = "'"+appendDivId+"'";

		//Alerts and error messages
		html+='<div id="newIndustryType"  class="col-sm-12">'
			+'<div class="alert alert-success" style="display: none;"	id="successIndustryTypeDiv">'
			+'<img alt="../" src="../resources/images/done.png">Industry Segment Type(s) Created Successfully'
			+'</div>'
			+'<div class="alert alert-danger alert-error" style="display: none;" id="errorIndustryTypeDiv">'
			+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check'
			+'</div>'
			
			+'<div class="SubHeading addAdminForm col-xs-14 row">'
		    +'<div class="col-sm-12 Action_heading">'
		    +'<h4>Add Industry</h4>'
		    +'</div>';

		html+='<form class="col-md-9" role="form" id="addIndustryTypeForm">'
		+'<div class="col-sm-6" id="Add-industryType-Error">'
		+'<label class="control-label">Industry Type<font style="color: #a94442">*</font></label>'
		+'<span style="color: #a94442" id="industryType-span-Error" class="help-inline"></span>'
		+'<input type="text" class="form-control input-sm" id="industryType" name="IndustryType" placeholder="Industry Type" maxlength="50">' 
		+'<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="industryTypeError">Error</span>'
		+'</div>'

		//add Segment
		+'<div  id="Add-segmentCategory-Error" class="col-sm-5 col-sm-offset-1">'
		+'<div>'
		+'<label>Segment Category<font style="color: #a94442">*</font></label>'
		+'<span style="color: #a94442" id="segmentCategory-span-Error" class="help-inline"></span>'
		+ '<input type="text" name="segmentses" class="form-control input-sm" id="segmentCategory_0" placeholder="segment" maxlength="50" style="margin-bottom: 7px;"/>'
		+ '<div id="addSegment">'
		+'</div>'
		
		//ADD segment Button
			+'<div class="form-group input-group">'
			//+'<input type="button" class="btn btn-default btn-xs" id="IndustryType" onclick="addSegment()" value="Add Another Segment Category" style="margin-bottom: 13px;"/>'
			+'<button id="IndustryType" onclick="addSegment()" class="btn btn-default btn-xs" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Segment Category</button>'	
			+'</div>'
			//ADD Submit Industry creation
				+'<button type="button" class="btn btn-primary" id="saveIndustryType" onclick="save()">Save</button>'
				+'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
			+'</div>'
		+'</div>'

		+'</div>'
		+'</form>'
		+'</div>'
		+'</div>'
		+'</div>';
			
	$("#newIndustryType").append(html);
	$("#newIndustryType").show();
	scrollDown(divId);
	scrollTop(divId);

}

/********************************************************************************************************************************************
 ************************** S a v e I N D U S T R Y************************************************************************************************************
 **********************************************************************************************************************************************/

function save(){
	var divId = $('#newIndustryType');
	//on save dropdown values should reset
	$('#drops').find('option:first').attr('selected', 'selected');
	$('#drop').find('option:first').attr('selected', 'selected');

	var industryType = $.trim($('#industryType').val());
	$('#successIndustryTypeDiv').hide();
	$('#errorIndustryTypeDiv').hide();
	$('.help-inline').html('');
	$('#Add-industryType-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#Add-segmentCategory-Error').removeClass('has-error has-feedback');

	var segmentCategorys=new Array();
	$('input[name="segmentses"]').each(function() {
		segmentCategorys.push($(this).val());
	});

	var IndustryTypes={'industryType':industryType,'listOfSegments':segmentCategorys};
	$.ajax({
		url: "../industryTypeMaster/saveIndustryType.htm", 
		type: 'POST', 
		data: JSON.stringify(IndustryTypes),
		contentType:'application/json',
		success:function(validationResponse){
			if(validationResponse.status=="SAVE_SUCCESS" ){
				//rajesh
				var listIndustry = validationResponse.successObject.listOfIndustry;
				$('#selectedIndustryType').html('');
				$('#selectedIndustryType').append($('<option>', {
				    value: 0,
				    text: 'ALL'
				}));
				$.each(listIndustry, function (i, listIndustry) {
					var industry = listIndustry.industryType;
					industry = industry.replace("amp;","");
				    $('#selectedIndustryType').append($('<option>', { 
				        value: listIndustry.id,
				        text : industry
				    }));
				});
				
				//end
				$('#errorIndustryTypeDiv').hide();
				$('#successIndustryTypeDiv').show(600);
				//$('#successIndustryDiv').show(600);
				$('#addIndustryTypeForm').trigger("reset");
				hideForm('newIndustryType','page-wrapper');
				getvals();
			}else if(validationResponse.status=="SAVE_ERROR" || validationResponse.status=="EMPTY_INDUSTRY" || validationResponse.status=="EMPTY_SEGMENT" || validationResponse.status=="DUPLICATE_INDUSTRY"){	
				$('#errorIndustryTypeDiv').show(600);
				for(var i=0;i<validationResponse.errorMessageList.length;i++){console.log(validationResponse.errorMessageList.length);
					var fieldName = validationResponse.errorMessageList[i].fieldName;
					var errorMessage = validationResponse.errorMessageList[i].message;
					$('#'+fieldName+'-span-Error').html(errorMessage);
					$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#page-wrapper').unmask();
					scrollDown(divId);
				}}}
	}); 
	}

/********************************************************************************************************************************************
 ************************** On Load Second Drop ************************************************************************************************************
 **********************************************************************************************************************************************/
function industryTypeList()
{
	$("#industryTable_length").hide('');//added by manoj
	$("#industryTable_filter").html('');//added by manoj
	$("#industryTable").html('');//added by manoj
	$("#industryTable_info").html('');//added by manoj
	$("#industryTable_paginate").html('');
	$("#addOrganizationDropDown").html('');
	$("#uploadExcel").html('');
	$("#editDepartmentAttributes").html('');
	$("#drop").show();
	//old tab div
	$("#dataTabOrg").html('');
	$("#editOrganizationType").html('');
	$("#datas").html('');
	$('#listGeneralOrganizationTab').html('');
	//Third Tab Data
	$("#departmentAttributeTypes").html('');
	$("#organizationAttributeType").html('');
	$("#dataTableOrganizationAttribute").html('');
	$("#addOrganizationAttributes").html('');
	$("#addOrganizationAttribute").html('');
	$("#addDepartmentAttributes").html('');
	$("#addDepartmentAttribute").html('');
	$("#editOrganizationAttributeType").html('');
	$("#editDepartmentAttributeType").html('');
	$('#listGeneralAttributeTab').html('');
	$("#newIndustryTypeOrganization").hide();
	$("#listOfIndustryTypes").html('');
	$("#listOfIndustryTypes").empty();
	$("#industryDropDown").html('');
	$('#exportIndustryMasterTab').html('');
	$('#datas').html('');
	$('#viewList').html('');
	$('#viewButton').html('');
	$("#listGeneralDepartmentAttributeTab").html('');
	$("#subHeadingFormName").hide();
	
	    selectedIndustryCheckBox=[];
	    var checkBoxDeleteValue=$("#selectedCheckBoxes").val();
	    selectedIndustryCheckBox.push(checkBoxDeleteValue);
	
	$('#page-wrapper').mask('Loading...');
	$('#deleteSuccessIndustryTypeDiv').hide();  //rajesh
	$('#deleteErrorIndustryTypeDiv').hide();
	$('#successIndustryDiv').hide(); //rajesh
	$('#updateSuccessIndustryTypeDiv').hide();  //rajesh
	$.ajax({
		type : "GET",
		url : "../industryTypeMaster/list.htm",
		dataType : "json",
		success : function(data) {
			$('#page-wrapper').unmask();
			var html = "";
			html +='<div class="tab-pane fade in active" id="drops">';
			html += '<form  class="form-inline col-xs-12 SubHeading AdminMainActivity">';
			html += '<label class="control-label" for="Industry">Industry Type<select id="selectedIndustryType" class="form-control input-sm" onchange="getval()"></label>';
			html += '<option  value="0">ALL</option>';
			for (var i = 0; i < data.length; i++) {
				html += '<option value='+data[i].id+'>'
						+ data[i].industryType
						+ '</option>';
			}
			html += '</select>';
			html +='</label>';
			html += '<label id="drop" class="control-label" for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategory">';
			html += '<option value="0">ALL</option>';
			html += '</select>';
			html +='</label>';
			html += '<input type="button" class="btn btn-default btn-sm" id="viewList" onclick="industryTypeMasterListView()" value="View" style="margin-bottom:-5px;" />';	
			html += '<div class="form-group float-right">';
			html += '<button type="button" class="btn btn-primary AdminDeleteButton float-right" onclick="deleteIndustryTypes('+selectedCheckBoxes+''+selectedCheckBoxes+')">';
			html += '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>';
			html += '</button>';
			html += '<div class="AdminMultiAdd btn-group float-right">';
			html +=  '<button id="dLabel" class="btn btn-primary AdminAddButton" type="button" onclick="adminAddToggleButton()" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
			html += '+</button>';
			html += '<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dLabel">';
			html +=' <div class="add-arrow-up"></div>';
			html += '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addIndustry()">Add Industry</a></li>';
			html += '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addSegmentCategory()">Add Segment</a></li>';
			html += '</ul>';
			html += '</div>';
			html += '</div>';			
			html += '</div>';
			html += '</form>';			

			$("#drop").append(html);
			$("#drop").show();
			$("#listOfIndustryTypes").append(html);
			$("#listOfIndustryTypes").show();
			$("#industryTable").dataTable();
			//industryTypeMasterListView();//commented by manoj
		}
		
	});

}

/********************************************************************************************************************************************
 ************************** First Drop Down ************************************************************************************************************
 **********************************************************************************************************************************************/

function industryTypeMasterListView() {
	$('#page-wrapper').mask('Loading...');
	var selectedSegmentCategory=$("#selectedSegmentCategory").val();
	var selectedIndustryType=$("#selectedIndustryType").val();
	$("#industryDropDown").html('');
	$("#newIndustryType").hide();
	$("#datas").empty();
	$('#successIndustryDiv').html('');
	
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listIndustryTypes.htm?id="+selectedSegmentCategory+"&iid="+selectedIndustryType,
		dataType: "json",
		success: function(data){ 
			if(data.status=="LIST_SUCCESS"){
				var tempHtml = listGeneralIndustryResponse(data);
				$('#listGeneralIndustryTab').append(tempHtml);
				$('#industryTable').dataTable();
				$('#page-wrapper').unmask();
				
			}else{
				$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
			}
		}},'json').fail(function(response){
			$('#page-wrapper').append(response.status+"*****************"+response.statusText);
		});

	return false;
}	


function getval() {
	$('#page-wrapper').mask('Loading...');
	$("#btnView").empty();
	$("#drop").empty();
	$("#drop").html('');
	$('#newIndustryType').hide();
	var selectedIndustryType=$("#selectedIndustryType").val();

	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/lists.htm?id="+selectedIndustryType,
		dataType: "json",
		success: function(data){ 

			var html="";
			html+=	'<label id="drop" class="control-label" style="margin-bottom:10px"; for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategory" style="margin-bottom:5px;">';
			html+=	'<option value="0">ALL</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].segmentCategory+'</option>';
			}
			html+='</select>';	
			html+='</label>';	
			$("#drop").append(html);
			$("#drop").show();
			$("#drops").show();//uncommented by manoj
			$('#page-wrapper').unmask();

		}
	});
}

/********************************************************************************************************************************************
 ************************** SHOW LIST VIEW ************************************************************************************************************
 **********************************************************************************************************************************************/

function getvals() {
	$('#page-wrapper').mask('Loading...');
	var selectedSegmentCategory=$("#selectedSegmentCategory").val();
	var selectedIndustryType=$("#selectedIndustryType").val();
	$("#industryDropDown").html('');
	$("#newIndustryType").hide();
	$("#datas").empty();
	$('#successIndustryDiv').html('');
	$('#updateSuccessIndustryTypeDiv').html('');
	
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listIndustryTypes.htm?id="+selectedSegmentCategory+"&iid="+selectedIndustryType,
		dataType: "json",
		success: function(data){ 
			if(data.status=="LIST_SUCCESS"){
				var tempHtml = listGeneralIndustryResponse(data);
				$('#listGeneralIndustryTab').append(tempHtml);
				$('#industryTable').dataTable();
				$('#page-wrapper').unmask();
				$('#successIndustryDiv').show(600);
				
			}else{
				$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
			}
		}},'json').fail(function(response){
			$('#page-wrapper').append(response.status+"*****************"+response.statusText);
		});

	return false;
}	


function updatedIndustryList() {
	$('#page-wrapper').mask('Loading...');
	var selectedSegmentCategory=$("#selectedSegmentCategory").val();
	var selectedIndustryType=$("#selectedIndustryType").val();
	$("#industryDropDown").html('');
	$("#newIndustryType").hide();
	$("#datas").empty();
	$('#updateSuccessIndustryTypeDiv').html('');
	
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listIndustryTypes.htm?id="+selectedSegmentCategory+"&iid="+selectedIndustryType,
		dataType: "json",
		success: function(data){ 
			if(data.status=="LIST_SUCCESS"){
				var tempHtml = listGeneralIndustryResponse(data);
				$('#listGeneralIndustryTab').append(tempHtml);
				$('#industryTable').dataTable();
				$('#page-wrapper').unmask();
				$('#updateSuccessIndustryTypeDiv').show(600);
			}else{
				$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
			}
		}},'json').fail(function(response){
			$('#page-wrapper').append(response.status+"*****************"+response.statusText);
		});
	return false;
}	


function listGeneralIndustryResponse(response){
   $('#listGeneralIndustryTab').html('');
   $('#successIndustryDiv').html('');
   $('#updateSuccessIndustryTypeDiv').html('');
   $('#deleteSuccessIndustryTypeDiv').html('');
   $('#addSegmentCategoryTypeDiv').html('');
    selectedCheckBoxes=[];
    var checkBoxMultipleDelete=$("#selectedCheckBoxes").val();
    selectedCheckBoxes.push(checkBoxMultipleDelete);
    var generalIndustryList=response.successObject.listIndustryGeneralMaster;
    var tempHtml="";
        tempHtml+="<div id='datas'>";
        tempHtml+= "<input type='hidden' class='btn btn-danger'  onclick='deleteIndustryTypes("+selectedCheckBoxes+""+selectedCheckBoxes+")' value='Delete'>";
        tempHtml+='<div class="alert   alert-success" style="display: none;" id="deleteSuccessIndustryTypeDiv">';
        tempHtml+='<img alt="../" src="../resources/images/done.png">Segment Category Deleted Successfully';
        tempHtml+='</div>';
        
        tempHtml+='<div class="alert   alert-danger alert-error" style="display: none;" id="deleteErrorIndustryTypeDiv">';
        tempHtml+='Record already in Use You cannot delete selected records.';
        tempHtml+='</div>';
        
        //Industry Type add success
        tempHtml+='<div class="alert alert-success" style="display: none;"	id="successIndustryDiv">';
        tempHtml+='<img alt="../" src="../resources/images/done.png">Industry Segment Type(s) Created Successfully';
        tempHtml+='</div>';
        
        //Industry Type edit success
        tempHtml+='<div class="alert alert-success" style="display: none;"	id="updateSuccessIndustryTypeDiv">';
        tempHtml+='<img alt="../" src="../resources/images/done.png">Updated Successfully';
        tempHtml+='</div>';
        
        //segment type add success
        tempHtml+='<div class="alert alert-success" style="display: none;" id="addSegmentCategoryTypeDiv">';
        tempHtml+='<img alt="../" src="../resources/images/done.png">Saved Successfully';
        tempHtml+='</div>';
        
        tempHtml+='<div class="alert alert-danger alert-error" style="display: none;" id="errorSegmentTypeDiv">';
        tempHtml+='Error occured please check';
        tempHtml+="</div>";
	    tempHtml+="<form id='dataTab' >";
          tempHtml+= "<table class='table table-striped dataTable no-footer' id='industryTable'>";
          tempHtml+=		"<thead>";
          tempHtml+=		"<tr>";
          tempHtml+=				"<th><input type='checkbox' id='selectAllIndustryChkBox'/></th>";
          tempHtml+=				"<th>Industry Type</th>";
          tempHtml+=				"<th>Segment Category</th>";
          tempHtml+=               "<th></th>";
          tempHtml+=			"</tr>";
          tempHtml+= 		"</thead>";
          tempHtml+=			"<tbody>";
for(var i=0;i<generalIndustryList.length;i++){ 
	tempHtml+=			"<tr>";
	tempHtml+=		"<td><input type='checkbox' id='selectedCheckBoxes' class='industryChkBox' value='"+generalIndustryList[i].industryTypeId+","+generalIndustryList[i].id+"'/></td>";	 
	tempHtml+=			"<td>"+generalIndustryList[i].industryType+"</td>";	  
	tempHtml+=			"<td>"+generalIndustryList[i].segmentCategory+"</td>";
	tempHtml+=          "<td class='text-right'><span><button type='button' class='btn btn-xs AdminInList' title='Edit'  onclick='editIndustryType("+generalIndustryList[i].industryTypeId+")'><span aria-hidden='true' class='glyphicon glyphicon-pencil'></span></button></span></td>";	
	tempHtml+=			"</tr>";
}
tempHtml+=	"</tbody>";
tempHtml+= "</table>";
tempHtml+="</form>";
tempHtml+="</div>";
//tempHtml+=	'<div id="addAndEditIndustryTypeMasterDiv"  class="SubHeading addAdminForm col-xs-12" style="display:none;"></div>';
return tempHtml;
}


/********************************************************************************************************************************************
 ************************** D e l e t e ************************************************************************************************************
 **********************************************************************************************************************************************/

function deleteIndustryTypes()
{
	var selectedCheckBoxes=[];
	var checkBoxes = document.getElementsByTagName('input');
	var param = "";
	for (var counter=1; counter < checkBoxes.length; counter++) {
		if (checkBoxes[counter].type.toUpperCase()=='CHECKBOX' && checkBoxes[counter].checked == true) {
			if(counter==1 || counter==checkBoxes.length){
				param+=checkBoxes[counter].value;
			}else{
				param=param+","+checkBoxes[counter].value;
			}
		}
	}
	var params=(param.slice(1, param.length));
	selectedCheckBoxes.push(params);
	checkBoxLength();
	if(params.length>0)
	{
		if(confirm("Do you want to delete selected record(s) It will delete all associated data?"))
		{
			$('#newIndustryType').hide(600);
			$.post("../industryTypeMaster/delete.htm?ids="+selectedCheckBoxes,function(response){console.log(response);
			if(response.status=="DELETE_SUCCESS")
			{
				//rajesh
				var listIndustry = response.successObject.listOfIndustry;
				$('#selectedIndustryType').html('');
				$('#selectedIndustryType').append($('<option>', {
				    value: 0,
				    text: 'ALL'
				}));
				$.each(listIndustry, function (i, listIndustry) {
					var industry = listIndustry.industryType;
					industry = industry.replace("amp;","");
				    $('#selectedIndustryType').append($('<option>', { 
				        value: listIndustry.id,
				        text : industry
				    }));
				});
				
				//end
				//industryTypeList();
				selectedCheckBoxes=[];
				var tempHtml = listGeneralIndustryResponse(response);
				$('#listGeneralIndustryTab').append(tempHtml);
				$('#industryTable').dataTable({responsive:true});
				$('#page-wrapper').unmask();
				$('#deleteErrorIndustryTypeDiv').hide();
				$('#deleteSuccessIndustryTypeDiv').show(600);
				
			}else if (response.status="DELETE_ERROR"){
				$('#deleteSuccessIndustryTypeDiv').hide();
				$('#deleteErrorIndustryTypeDiv').show(600);
			}else{
				$('#page-wrapper').mask('<font style="color:red;">'+response.errorMessage+'</font>');
			}
			return false;
			});
		}
	}else{
		alert("Please select atleast one item");
	}
}

/********************************************************************************************************************************************
 ************************** E d i t Segment Dynamicaly ************************************************************************************************************
 **********************************************************************************************************************************************/
function editSegment()
{
	count=count+1;  
	var html="";
	html+='<table id="myTable" border="1">'
		+'<div class="form-group" id="segment-Error">'
		+'<tr>'
		+'<input type="text"  id="segmentCategory_'+count+'" name="segment" placeholder="segment" maxlength="50">'
		+' <input type="button" class="btn btn-default btn-xs" id="IndustryType" onclick="#" value="delete" />'
		+'</tr>'
		+' </div>';
	+'</table>';
	$("#editsegment").append(html);
}

/********************************************************************************************************************************************
 ************************** E d i t ************************************************************************************************************
 **********************************************************************************************************************************************/
function editIndustryType(id){
	$('#page-wrapper').mask('Loading...');
	selectedCheckBoxes = [];
	//$('#listGeneralIndustryTab').html('');
	$("#editIndustryType").html('');
	$("#industryDropDown").html('');
	$('#updateErrorIndustryTypeDiv').hide();
	$("#editIndustryTypeDiv").html('');
	$("#datas").html('');
	$('#updateErrorIndustryTypeDiv').hide();
	$('#updateSuccessIndustryTypeDiv').hide();
	
	var divId = $("#editIndustryType");
	var divIdToHide = "editIndustryType";
	divIdToHide = "'"+divIdToHide+"'";
	appendDivId="page-wrapper";
	appendDivId = "'"+appendDivId+"'";

	selectedCheckBoxes.pop(id);
	selectedCheckBoxes.push(id);
	checkBoxLength();
	if(selectedCheckBoxes.length>1){
		alert("You can edit only one record at a time");
		return false;
	}else if(selectedCheckBoxes.length==0){
		alert("Please select a record");
		return false;
	}else{
		$.ajax({
			type: "GET",
			url: "../industryTypeMaster/getEditData.htm?id="+selectedCheckBoxes,
			dataType: "json",
			success: function(data){console.log(data);
			$('#page-wrapper').unmask();
			var html="";
			html+=' <div  id="editIndustryTypeDiv" class="col-sm-12">' 
				/*+'<div class="alert alert-success" style="display: none;"	id="updateSuccessIndustryTypeDiv">'
				+'<img alt="../" src="../resources/images/done.png">Updated Successfully'
				+'</div>'*/
				+'<div class="alert alert-danger alert-error" style="display: none;"	id="updateErrorIndustryTypeDiv">'
				+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Errors Occured.'
				+'</div>'
				
				+'<div class="SubHeading addAdminForm col-xs-14 row">'
			    +'<div class="col-sm-12 Action_heading">'
			    +'<h4>Edit Industry Type</h4>'
			    +'</div>'
				
				+'<form role="form" id="editIndustryTypeForm">'
				+'<div class="col-sm-6" id="editIndustryType-Error">'
				+'<label class="control-label">Industry Type<font style="color: #a94442">*</font></label>'
				+'<span style="color: #a94442" id="editIndustryType-span-Error" class="help-inline"></span>';
			for(var j=0;j<1;j++)
			{
				html +=	'<input type="hidden" value='+data[j].industryTypeId+' id="hiddenIndustryId">'; 
				html +='<input type="text" class="form-control input-sm" editIds='+data[j].industryTypeId+'  id="editIndustryTypes" name="IndustryType" value="'+data[j].industryType+'" placeholder="Industry Type" maxlength="50">' ;
			}
			html +='<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="editIndustryTypeError">Error</span>'
				+'</div>'
				+'<div  id="segment-Error" class="col-sm-5 col-sm-offset-1">'
				+'<div>';
			html+='<label>Segment Category<font style="color: #a94442">*</font></label>'
				+'<span style="color: #a94442" id="editSegmentCategory-span-Error" class="help-inline"></span>';
			for(var i=0;i<data.length;i++)
			{
				html +=	'<input type="hidden" name="segmentCategoryId" value='+data[i].id+' id="hiddenSegmentId">';      
				html +='<input type="text" name="segmentCategory" class="form-control input-sm" editId='+data[i].id+' id="editSegmentCategory_'+i+'" placeholder="segment" value="'+data[i].segmentCategory+'" maxlength="50" />';
			}
			html+='<div id="editsegment">'
				+'</div>'
				+'</div>'
				+'<div class="form-group input-group">'
				+'</div>'
				+'<button type="button" class="btn btn-primary" id="updateIndustrySegmentType" onclick="updateIndustryType()">Update</button>'
				+'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
				+'</form>'
				+'</div>'
				+'</div>'
				+'</div>';
			
			$("#editIndustryType").append(html);
			$("#editIndustryType").show();
			scrollDown(divId);
			},error:function(url,status,er) { 
				console.log("error: "+url+" status: "+status+" er:"+er);
				var html="Error in getting data.";
				$("#editIndustryType").append(html);
			}
		});
		
	}
}

/********************************************************************************************************************************************
 ************************** U p d a t e ************************************************************************************************************
 **********************************************************************************************************************************************/

function updateIndustryType(){
	//$('#listGeneralIndustryTab').html('');
	$('#updateErrorIndustryTypeDiv').hide();
	$('#editIndustryType-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#editSegmentCategory-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	var industryType=$("#editIndustryTypes").val();
	var industryId = $("#hiddenIndustryId").val();
	var segmentCategorys=new Array();
	var segmentCategoryIds = new Array();
	$('input[name="segmentCategory"]').each(function() {
		segmentCategorys.push($(this).val());
	});

	$('input[name="segmentCategoryId"]').each(function() {
		segmentCategoryIds.push($(this).val());
	});
	var IndustryType={'industryTypeId': industryId, 'industryType':industryType,'segmentCategory':segmentCategorys, 'segmentCategoryIds': segmentCategoryIds};

	$.ajax({
		url: "../industryTypeMaster/postEditIndustry.htm", 
		type: 'POST', 
		data: JSON.stringify(IndustryType), 
		contentType: 'application/json',
		success: function(validationResponse) { console.log(validationResponse);
		if(validationResponse.status=="UPDATE_SUCCESS"){
			$('#updateErrorIndustryTypeDiv').hide();
			$('#updateSuccessIndustryTypeDiv').show(600);
			$('#updateSuccessSegmentTypeDiv').show(600);
			$('#updateAddIndustryTypeForm').trigger("reset");
			hideForm('editIndustryType','page-wrapper');
			updatedIndustryList();
	
		}
		else if(validationResponse.status=="UPDATE_ERROR"){
			$('#updateErrorIndustryTypeDiv').show(600);
			$('#updateSuccessIndustryTypeDiv').hide();
			for(var i=0;i<validationResponse.errorMessageList.length;i++){
				var fieldName = validationResponse.errorMessageList[i].fieldName;
				var errorMessage = validationResponse.errorMessageList[i].message;
				$('#'+fieldName+'-span-Error').html(errorMessage);
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#page-wrapper').unmask();
			}
		}else{
			if(validationResponse.status==null){
				$('#updateErrorIndustryTypeDiv').show();
			}
		}
		},
		error:function(url,status,er) { 
			alert("error: "+url+" status: "+status+" er:"+er);
		}}   
	);
};

/********************************************************************************************************************************************
 ************************** A D D SEGMENT TYPE ************************************************************************************************************
 **********************************************************************************************************************************************/

function addSegmentCategory()
{ 
	$("#editIndustryTypeDiv").html('');
	$("#newIndustryType").html('');
	$("#segments").html('');
	$("#datas").html('');
	$("#industryDropDown").html('');
	$("#listGeneralDepartmentAttributeTab").html('');
	var divId = $('#newIndustryType');
	var divIdToHide = "newIndustryType";
	divIdToHide = "'"+divIdToHide+"'";
	appendDivId = "page-wrapper";
	appendDivId = "'"+appendDivId+"'";
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/list.htm",
		dataType: "json",
		success: function(data){ 
			var html="";
			
			//Alerts and error messages
			html+='<div  id="newIndustryType" class=" col-sm-12">'
				+'<div class="alert alert-success" style="display: none;" id="addSegmentCategoryTypeDiv">'
				+'<img alt="../" src="../resources/images/done.png">Saved Successfully'
				+'</div>'
				+'<div class="alert alert-danger alert-error" style="display: none;" id="addErrorSegmentCategoryTypeDiv">'
				+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please check'
				+'</div>'
			
			    +'<div class="SubHeading addAdminForm col-xs-14 row">'
		        +'<div class="col-sm-12 Action_heading">'
		        +'<h4>Add Segment</h4>'
		        +'</div>';

			//Industry Dropdown
			html+='<form class="col-md-9" role="form" id="addSegmentTypeForm">'
			    +'<div class="col-sm-6">'
				+'<label class="control-label" for="Industry">Industry Type<font style="color: #a94442">*</font></label>'
				+'<select id="selectedIndustrySegmentTypes" class="form-control input-sm">';
			for(var i=0;i<data.length;i++)
			{
				html+=	'<option value='+data[i].id+'>'+data[i].industryType+'</option>';
			}
			html+=	'</select>'
				+'</div>';

			//Adding Segment
			html+='<div  id="Add-SegmentCategorys-Error" class="col-sm-5 col-sm-offset-1">'
				+'<div>'
				+'<label>Segment Category<font style="color: #a94442">*</font></label>'
				+'<span style="color: #a94442" id="SegmentCategorys-span-Error" class="help-inline"></span>'
				+'<input type="text" class="form-control input-sm " name="segmentses" id="segmentCategorys_0" placeholder="segment" maxlength="50" style="margin-bottom: 7px;"/>'
				//+'<div id="addSegment">'//Just for count
				+'</div>'
				//Div is appending #segment
				+'<div id="segments"></div>'

				//Buttons
				+'<div class="form-group input-group">'
				+'<button id="IndustryTypes" onclick="addSegmentsType()" class="btn btn-default btn-xs" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Segment Category</button>'	
				+'</div>'
				+'<div>'
			    +'<button type="button" class="btn btn-primary" id="saveSegment" onclick="saveSegmentType()">Save</button>'
			    +'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
		        +'</div>'
				+'</div>'
				+'</form>'
				+ '</div>' 
				+ '</div>'; 

			$("#newIndustryType").append(html);
			$("#newIndustryType").show();
			$("#segments").show();
			scrollDown(divId);
		}});}


function addSegmentsType()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group input-group"" id="myTable">'
		+'<input type="text" class="form-control input-sm" id="segmentCategorys_'+count+'" name="segmentses" placeholder="segment" maxlength="50">'
		+'<span class="input-group-btn">'
		+'<button type="button"  class="btn btn-default btn-sm" id="IndustryTypes'+count+'" onclick="deleteTextBoxses('+count+')"><i class="glyphicon glyphicon-trash"></i>'
		+'</button>'
		+'</span>'
		+'</div>';
	$("#segments").append(html);
}

function deleteTextBoxses(count)
{
	$("#segmentCategorys_"+count).parent().remove();
	count--;
}

/********************************************************************************************************************************************
 ************************** S A V E SEGMENT TYPE ************************************************************************************************************
 **********************************************************************************************************************************************/
function saveSegmentType()
{
	$('#listGeneralIndustryTab').html('');
	$('#addErrorSegmentCategoryTypeDiv').hide();
	$('#addSegmentCategoryTypeDiv').hide();
	$('#industryType-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');

	var selectedIndustryId=$("#selectedIndustrySegmentTypes option:selected").val();

	var segmentCategoryArray=new Array();
	$('input[name="segmentses"]').each(function() {
		segmentCategoryArray.push($(this).val());
	});

	var SegmentTypeMaster={'industryTypeId':selectedIndustryId,'listOfSegments':segmentCategoryArray};
	
	$.ajax({
		url: "../industryTypeMaster/saveSegmentType.htm", 
		type: 'POST', 
		data: JSON.stringify(SegmentTypeMaster),
		contentType:'application/json',
		success:function(validationResponse){console.log(validationResponse);
		if(validationResponse.status=="SAVE_SUCCESS"){
			$('#addErrorSegmentCategoryTypeDiv').hide();
			$('#addSegmentCategoryTypeDiv').show(600);
			$('#addIndustryTypeForm').trigger("reset");
			hideForm('newIndustryType','page-wrapper');
			getvals();
		}else if(validationResponse.status=="SAVE_ERROR"){
			$('#addErrorSegmentCategoryTypeDiv').show(600);
			$('#addSegmentCategoryTypeDiv').hide();
			$('#SegmentCategorys-Error').addClass('has-error has-feedback');
			$('#SegmentCategorys-span-Error').html(validationResponse.errorMessage);
		}
		}
	}); }

/********************************************************************************************************************************************
 ************************** C h e c k B o x ************************************************************************************************************
 **********************************************************************************************************************************************/

$(document).on('click',"#selectAllIndustryChkBox",function(){
	$('.industryChkBox').prop('checked', $(this).is(':checked'));
});

$(document).on('click',".industryChkBox",function(){
	if($('.industryChkBox:checked').length == $('.industryChkBox').length) {
		$('.selectAllIndustryChkBox').prop('checked', true);
	}
	else {
		$('.selectAllIndustryChkBox').prop('checked', false);
	}
});

function checkBoxLength(){
	if($('.industryChkBox:checked').length) {
		selectedCheckBoxes =[];
		$('.industryChkBox:checked').each(function() {
			selectedCheckBoxes.push($(this).val());
		});
	}
	return false;
}


/********************************************************************************************************************************************
 **************************2nd Tab Data Add Form ************************************************************************************************************
 **********************************************************************************************************************************************/
function addDepartment()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group input-group" id="myTable">'
		//+'<div class="col-sm-10">'
		+'<input type="text" class="form-control input-sm" id="department_'+count+'" name="departmentOrganization" placeholder="department" maxlength="50">'
		+'<span class="input-group-btn">'
		//+'</div>'
		+'<button type="button" id="Departments'+count+'" onclick="deleteDepartmentText('+count+')" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-trash"></i>'
		+'</button>'
		+'</span>'
		//+'<div class="col-sm-2">'
		//+' <input type="button" class="btn btn-default" id="Departments'+count+'" onclick="deleteDepartmentText('+count+')" value="X"/>'
		+' </div>';
	$("#addDepartment").append(html);
}

function deleteDepartmentText(count){
	$("#department_"+count).parent().remove();
	count--;
}

/********************************************************************************************************************************************
 ************************** Add Form ************************************************************************************************************
 **********************************************************************************************************************************************/
function addOrganizations(){
	$("#addOrganizationDropDown").html('');
	$("#updateOrganizationType").html('');
	$("#addOrganizationIndustryDropDown").html('');
	$("#addOrganizationSegmentDropDown").html('');
	$("#newIndustryTypeOrganization").html('');
	showIndustrySegmentCategory();
	getSegmentDropDown();
	
	var divId=$("#newIndustryTypeOrganization");
	var divIdToHide = "newIndustryTypeOrganization";
	divIdToHide = "'"+divIdToHide+"'";
	appendDivId = "page-wrapper";
	appendDivId = "'"+appendDivId+"'";

	var html="";
	html+='<div class="col-sm-12">'
	    +'<div class="alert alert-success" style="display: none;" id="successOrganizationTypeDivs">'
		+'<img alt="../" src="../resources/images/done.png">Organization Department Type Created Successfully'
		+'</div>'
		+'<div class="alert alert-danger alert-error" style="display: none;" id="errorOrganizationTypeDivs">'
		+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check'
		+'</div>'
		
		+'<div class="SubHeading addAdminForm col-xs-14 row">'
	    +'<div class="col-sm-12 Action_heading">'
	    +'<h4>Add Organization</h4>'
	    +'</div>'
		
		+'<div  id="addOrganizationIndustryDropDown" ></div>'
		+'<div  id="addOrganizationSegmentDropDown" class="row" ></div>'

		//add organization
		+'<form class="col-md-12 row" role="form" id="newIndustryTypeOrganization">'
		+'<div class="col-sm-5" id="Add-organizationType-Error" class="row col-sm-4">'
		+'<label>Organization Type<font style="color: #a94442">*</font></label>' 
		+'<span style="color: #a94442" id="organizationType-span-Error" class="help-inline"></span>'
		+'<input type="text" class="form-control input-sm" id="organizationType" name="organizationType" placeholder="Organization Category" maxlength="50">' 
		+'</div>'
		
		//add department
		+'<div  id="Add-departmentType-Error" class="col-sm-5 col-sm-offset-1">'
		+'<div>'
		+'<label>Department Type<font style="color: #a94442">*</font></label>' 
		+'<span style="color: #a94442" id="departmentType-span-Error" class="help-inline"></span>'
		+'<input type="text" class="form-control input-sm" id="department_0" name="departmentOrganization" placeholder="department" maxlength="50" style="margin-bottom: 13px;" />'
		+'<div id="addDepartment"></div>'
		
		//add department
		//+'<div id="department"></table>'
		
		//button
		+'<div class="form-group input-group">'
		+'<button id="OrganizationType" onclick="addDepartment()" class="btn btn-default btn-xs" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Department</button>'
		+'</div>'
		+'<button type="button" class="btn btn-primary input-sm" id="saveorganizationType" onclick="saveOrganization()">Save</button>'
		+'&nbsp;<input type="button" class="btn btn-default input-sm" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
	    +'</div>'
        +'</div>'
		+'</div>'
	    +'</div>'
	    +'</form>'
	    +'</div>'
	    +'</div>';
	
	$("#newIndustryTypeOrganization").append(html);
	$("#newIndustryTypeOrganization").show();
	
	scrollDown(divId);
}

/********************************************************************************************************************************************
 ************************** S a v e ************************************************************************************************************
 **********************************************************************************************************************************************/
function saveOrganization(){
	//on save dropdown values should reset
	$('#drops').find('option:first').attr('selected', 'selected');
	$('#drop').find('option:first').attr('selected', 'selected');

	var selectIndustry = $('#selectedOrganizationIndustryType').val();
	var selectSegment = $('#selectedOrganizationSegmentType').val();

	if(selectIndustry=="0" || selectSegment=="0")
	{
		alert("Please select both Industry Type And Segment Category DropDowns");
	}else{
		var organizationType = $.trim($('#organizationType').val());
		$('#successOrganizationTypeDivs').hide();
		$('#errorOrganizationTypeDivs').hide();
		$('.help-inline').html('');
		$('#Add-organizationType-Error').removeClass('has-error has-feedback');
		$('.help-inline').html('');
		$('#Add-departmentType-Error').removeClass('has-error has-feedback');

		var departmentTypes=new Array();
		$('input[name="departmentOrganization"]').each(function() {
			departmentTypes.push($(this).val());
		});

		var OrganizationCategory={'organizationType':organizationType,'listOfDepartments':departmentTypes,'segmentTypeId':selectSegment};
		$.ajax({
			url: "../industryTypeMaster/saveOrganization.htm", 
			type: 'POST', 
			data: JSON.stringify(OrganizationCategory),
			contentType:'application/json',
			success:function(validationResponse){
				if(validationResponse.status=="SAVE_SUCCESS"){
					$('#addOrganizationIndustryDropDown').find('option:first').attr('selected', 'selected');
					$('#addOrganizationSegmentDropDown').find('option:first').attr('selected', 'selected');
					$('#errorOrganizationTypeDiv').hide();
					$('#successOrganizationTypeDivs').show(600);
					$('#addOrganizationTypeForm').trigger("reset");
					hideForm('newIndustryTypeOrganization','page-wrapper');
					organizationSaveList();

				}else if(validationResponse.status=="SAVE_ERROR" ||  validationResponse.status=="EMPTY_ORGANIZATION" || validationResponse.status=="DUPLICATE_ORGANIZATION" || validationResponse.status=="EMPTY_DEPARTMENT" || validationResponse.status=="DUPLICATE_DEPARTMENTLIST"){
					$('#errorOrganizationTypeDivs').show(600);
					for(var i=0;i<validationResponse.errorMessageList.length;i++){
						var fieldName = validationResponse.errorMessageList[i].fieldName;
						var errorMessage = validationResponse.errorMessageList[i].message;
						$('#'+fieldName+'-span-Error').html(errorMessage);
						$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
						$('#page-wrapper').unmask();
					}	

				}}
		}); }}


/********************************************************************************************************************************************
 ************************** On Load Segment Drop ************************************************************************************************************
 **********************************************************************************************************************************************/
function industryTypes(){
	
	$("#organizationTable").html('');//added by manoj
	$("#organizationTable_length").html('');//added by manoj
	$("#organizationTable_filter").html('');//added by manoj
	$("#organizationTable_info").html('');//added by manoj
	$("#organizationTable_paginate").html('');//added by manoj

	//first Tab Data
	$("#industryDropDown").html('');
	$("#add").html('');
	$("#dataTab").html('');
	$("#newIndustryType").html('');
	$("#listOfIndustryType").html('');
	$("#editIndustryType").html('');
	$("editIndustryType").html('');
	$('#listGeneralIndustryTab').html('');

	//Third Tab Data
	$("#departmentAttributeTypes").html('');
	$("#organizationAttributeType").html('');
	$("#dataTableOrganizationAttribute").html('');
	$("#addOrganizationAttributes").html('');
	$("#addOrganizationAttribute").html('');
	$("#addDepartmentAttributes").html('');
	$("#addDepartmentAttribute").html('');
	$("#editOrganizationAttributeType").html('');
	$("#editDepartmentAttributeType").html('');
	$('#listGeneralAttributeTab').html('');

	//Fourth Tab Data
	$("#uploadExcel").html('');
	$('#exportIndustryMasterTab').html('');
	$("#listOfIndustryTypes").html('');
	$("#listOfIndustryTypes").empty(); 
	$("#editDepartmentAttributes").html('');
	$("#listGeneralDepartmentAttributeTab").html('');
	$("#subHeadingFormName").hide();
	$("#dropOrganization").html('');
	$("#dropDepartment").html('');
	
	$('#page-wrapper').mask('Loading...');
	 selectedOrganizationCheckBox=[];
	    var checkBoxDeleteValue=$("#multipleDeleteIds").val();
	    selectedOrganizationCheckBox.push(checkBoxDeleteValue);
	
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/list.htm",
		dataType: "json",
		success: function(data){ 
			$('#page-wrapper').unmask();
			var html="";
			html+='<div id="drops" class="tab-pane fade in active">';
			html+=	'<form  class="form-inline col-xs-12 SubHeading AdminMainActivity">';
			html+=	'<label class="control-label " for="Industry">Industry Type <select id="selectedIndustryType" class="form-control input-sm" onchange="getSegmentCategories()">';
			html+=	'<option value="0">ALL</option>';
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].industryType+'</option>';
					}
			html+='</select>';
			html+='</label>';
			html+='<label id="drop" for="SegmentCategory">Segment Category<select class="form-control input-sm"  id="selectedSegmentCategory">';
			html+='<option value="0">ALL</option>';
			html+='</select>';
			html +='</label>';
			html+=	'<label id="dropOrganization" for="OrganizationCategory">Organization Type<select class="form-control input-sm" id="selectedOrganization">';
			html+=	'<option value="0">ALL</option>';
			html+='</select>';
			html+='</label>';
			html+=	'<label id="dropDepartments" for="Department Type">Department Type<select class="form-control input-sm" id="selectedDepartment">';
			html+=	'<option value="0">ALL</option>';
			html+= '</select>';
			html+= '</label>';
			html += '<input type="button" class="btn btn-default input-sm" id="btnView" onclick="getvalsList()" value="View" />';
			//add and delete buttons start
			html += '<div class="form-group float-right">';
			html += '<button type="button" class="btn btn-primary AdminDeleteButton float-right" onclick="deleteOrganizationTypes('+selectedOrganizationCheckBox+''+selectedOrganizationCheckBox+')">';
			html += '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>';
			html += '</button>';
			html += '<div class="AdminMultiAdd btn-group float-right">';
			html +=  '<button id="dLabel" class="btn btn-primary AdminAddButton" type="button" onclick="adminAddToggleButton()" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
			html += '+</button>';
			html += '<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dLabel">';
			html +=' <div class="add-arrow-up"></div>';
			html += '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addOrganizations()">Add organization</a></li>';
			html += '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="showAddDepartment()">Add Department</a></li>';
			html += '</ul>';
			html += '</div>';
			html += '</div>';			
			//add and delete buttons end
			html +='</form>';
			html += '</div>';
			$("#dropOrganization").append(html);
			$("#dropOrganization").show();
			$("#dropDepartment").append(html);
			$("#dropDepartment").show();
			$("#drop").append(html);
			$("#drop").show();
			$("#listOfIndustryTypes").append(html);
			$("#listOfIndustryTypes").show();
			//$("#industryTable").dataTable();
			//getvalsList();//by manoj
		}
	});
	}

function getSegmentCategories() {
	$('#page-wrapper').mask('Loading...');
	$('#successOrganizationTypeDivs').hide();
	$("#drop").empty();
	var selectedIndustryType = $('#selectedIndustryType').val();
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/lists.htm?id="+selectedIndustryType,
		dataType: "json",
		success: function(data){ 
			$('#selectedSegmentCategory').val("ALL");
			$('#selectedOrganization').val("0");
			$('#selectedOrganization') .prop("disabled", true);
			$('#selectedDepartment').val("0");
			$('#selectedDepartment') .prop("disabled", true);

			var html="";
			html+=	'<label id="drop" for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategory" onchange="getOrganizationTypes()">';
			html+=	'<option value="0">ALL</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].segmentCategory+'</option>';
			}
			html+='</select>';
			html+='</label>';
			
			$("#drop").append(html);
			$("#drop").show();
			$("#drops").show(); 
			$("#dropOrganization").show();
			$('#page-wrapper').unmask();
		}
	});
	}


function getOrganizationTypes()
{$('#page-wrapper').mask('Loading...');
	var selectedSegmentType = $('#selectedSegmentCategory').val();
	$("#dropOrganization").empty();
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listOrganization.htm?id="+selectedSegmentType,
		dataType: "json",
		success: function(data){ 
			$('#selectedDepartment').val("0");
			$('#selectedDepartment') .prop("disabled", true);

			var html="";
			html+=	'<label id="dropOrganizations" for="Organization">Organization Type<select id="selectedOrganization" class="form-control input-sm" onchange="getvalDepartment()"></label>';
			html+=	'<option  value="0">ALL</option>';
			for(var i=0;i<data.length;i++){

				html+=	'<option value='+data[i].id+'>'+data[i].organizationType+'</option>';
			}
			html+=	'</select>';
			html+=	'</label>';
		
			$("#dropOrganization").append(html);
			$("#dropOrganization").show();
			$("#dropDeparment").hide();
			$("#dropDeparment").empty();
			$("#dropDeparment").html('');
			$('#page-wrapper').unmask();
		}
		});
	}

/********************************************************************************************************************************************
 ************************** First Drop Down ************************************************************************************************************
 **********************************************************************************************************************************************/

function getvalDepartment() {
	$('#page-wrapper').mask('Loading...');
	var organizationType=$('#selectedOrganization').val();
	$("#dropDepartments").html("");

	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listDepartment.htm?id="+organizationType,
		dataType: "json",
		success: function(data){ 

			var html="";
			html+=	'<label id="dropDepartments" for="Department Type">Department Type<select class="form-control input-sm" id="selectedDepartment">';
			html+=	'<option value="0">ALL</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value="'+data[i].id+'">'+data[i].departmentType+'</option>';	 
			}

			html+=	'</select>';
			html+='</label>';
			$("#dropDepartments").append(html);
			$("#selectedDepartment").val(0);
			$("#selectedDepartment").prop("disabled", false);
			$("#dropDepartments").show();
			$('#page-wrapper').unmask();

		}});}

/********************************************************************************************************************************************
 ************************** L i s t V i e w ************************************************************************************************************
 **********************************************************************************************************************************************/

function getvalsList() {
	var selectedIndustryType = $('#selectedIndustryType').val();
	var selectedSegmentType = $('#selectedSegmentCategory').val();
	var selectedOrganizationType = $('#selectedOrganization').val();
	var selectedDepartmentType = $('#selectedDepartment').val();
	
	$('#page-wrapper').mask('Loading...');
	$("#editOrganizationType").html('');
	$("#newIndustryTypeOrganization").hide();	
	$("#addOrganizationDropDown").html('');
	$("#dataTabOrg").empty();

	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listAll.htm?iid="+selectedIndustryType+"&sid="+selectedSegmentType+"&oid="+selectedOrganizationType+"&did="+selectedDepartmentType,
		dataType: "json",
		success: function(data){ 

			if(data.status=="LIST_SUCCESS"){
				var tempHtml = listGeneralOrganizationResponse(data);
				$('#listGeneralOrganizationTab').append(tempHtml);
				$('#organizationTable').dataTable();
				$('#page-wrapper').unmask();
			
			}else{
				$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
			}
		}},'json').fail(function(response){
			$('#page-wrapper').append(response.status+"*****************"+response.statusText);
		});

	return false;
}	

function organizationSaveList() {
	var selectedIndustryType = $('#selectedIndustryType').val();
	var selectedSegmentType = $('#selectedSegmentCategory').val();
	var selectedOrganizationType = $('#selectedOrganization').val();
	var selectedDepartmentType = $('#selectedDepartment').val();
	
	$('#page-wrapper').mask('Loading...');
	$("#editOrganizationType").html('');
	$("#newIndustryTypeOrganization").hide();	
	$("#addOrganizationDropDown").html('');
	$("#dataTabOrg").empty();

	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listAll.htm?iid="+selectedIndustryType+"&sid="+selectedSegmentType+"&oid="+selectedOrganizationType+"&did="+selectedDepartmentType,
		dataType: "json",
		success: function(data){ 

			if(data.status=="LIST_SUCCESS"){
				var tempHtml = listGeneralOrganizationResponse(data);
				$('#listGeneralOrganizationTab').append(tempHtml);
				$('#organizationTable').dataTable();
				$('#page-wrapper').unmask();
			    $('#successOrganizationTypeDivs').show(600);
			}else{
				$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
			}
		}},'json').fail(function(response){
			$('#page-wrapper').append(response.status+"*****************"+response.statusText);
		});

	return false;
}	


function updateOrganizationSuccessList() {
	var selectedIndustryType = $('#selectedIndustryType').val();
	var selectedSegmentType = $('#selectedSegmentCategory').val();
	var selectedOrganizationType = $('#selectedOrganization').val();
	var selectedDepartmentType = $('#selectedDepartment').val();
	
	$('#page-wrapper').mask('Loading...');
	$("#editOrganizationType").html('');
	$("#newIndustryTypeOrganization").hide();	
	$("#addOrganizationDropDown").html('');
	$("#dataTabOrg").empty();

	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listAll.htm?iid="+selectedIndustryType+"&sid="+selectedSegmentType+"&oid="+selectedOrganizationType+"&did="+selectedDepartmentType,
		dataType: "json",
		success: function(data){ 

			if(data.status=="LIST_SUCCESS"){
				var tempHtml = listGeneralOrganizationResponse(data);
				$('#listGeneralOrganizationTab').append(tempHtml);
				$('#organizationTable').dataTable();
				$('#page-wrapper').unmask();
			    $('#updateSuccessOrganizationTypeDiv').show(600);
			}else{
				$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
			}
		}},'json').fail(function(response){
			$('#page-wrapper').append(response.status+"*****************"+response.statusText);
		});

	return false;
}	


function listGeneralOrganizationResponse(response){
$('#listGeneralOrganizationTab').html('');
var generalOrganizationList = response.successObject.listOrganizationGeneralMaster;
var multipleDeleteAll=[];
var multipleIds=$("#multipleDeleteIds").val();
multipleDeleteAll.push(multipleIds);

 	var tempHtml="";
 	tempHtml+=	'<div id="dataTabOrg">';
 	tempHtml+="<input type='hidden' class='btn btn-danger'  onclick='deleteOrganizationTypes("+multipleDeleteAll+")' value='Delete'>";
 	//delete organization success
 	tempHtml+='<div class="alert alert-success" style="display: none;" id="deleteSuccessOrganizationTypeDivss">';
 	tempHtml+='<img alt="../" src="../resources/images/done.png">Department Type Deleted Successfully';
 	tempHtml+='</div>';
 	
 	tempHtml+='<div class="alert alert-danger alert-error" style="display: none;" id="deleteErrorOrganizationTypeDivss">';
 	tempHtml+='Record already in Use You cannot delete selected records.';
 	tempHtml+='</div>';
 	//add organization success
 	tempHtml+='<div class="alert alert-success" style="display: none;" id="successOrganizationTypeDivs">';
 	tempHtml+='<img alt="../" src="../resources/images/done.png">Organization Department Type(s) Created Successfully';
 	tempHtml+='</div>';
 	//update organization success
 	tempHtml+='<div class="alert alert-success" style="display: none;"	id="updateSuccessOrganizationTypeDiv">';
 	tempHtml+='<strong><img alt="../" src="../resources/images/done.png">Updated Successfully</strong>';
 	tempHtml+='</div>';
 	
 	tempHtml+='<div class="alert alert-danger alert-error" style="display: none;" id="errorOrganizationTypeDivss">';
 	tempHtml+='Error occured please check'; 
 	tempHtml+="</div>";
 	tempHtml+="<form>";
 	tempHtml+= "<table class='table table-striped dataTable no-footer' id='organizationTable'>";
 	tempHtml+= 		"<thead>";
 	tempHtml+= 			"<tr>";
 	tempHtml+=				"<th><input type='checkbox' id='selectAllIndustryDepartmentChkBox' style='margin-left:24px;'/></th>";
 	tempHtml+=                "<th>Industry Type</th>";
 	tempHtml+=                "<th>Segment Category</th>";
 	tempHtml+=				"<th>Organization Type</th>";
 	tempHtml+=				"<th>Department Type</th>";
 	tempHtml+=                "<th></th>";
 	tempHtml+=			"</tr>";
 	tempHtml+=		"</thead>";
 	tempHtml+=			"<tbody>";
for(var i=0;i<generalOrganizationList.length;i++){ 
	tempHtml+=			"<tr>";
	tempHtml+=			"<td align='center'><input type='checkbox' id='multipleDeleteIds' class='industryDepartmentChkBox' value='"+generalOrganizationList[i].id+","+generalOrganizationList[i].organizationTypeId+"'/></td>";	
	tempHtml+=				"<td>"+generalOrganizationList[i].industryType+"</td>";
	tempHtml+=				"<td>"+generalOrganizationList[i].segmentCategory+"</td>";
	tempHtml+=				"<td>"+generalOrganizationList[i].organizationType+"</td>";
	tempHtml+=				"<td>"+generalOrganizationList[i].departmentType+"</td>";
	tempHtml+=	           "<td class='text-right'><span><button type='button' class='btn btn-xs AdminInList' title='Edit'   onclick='editOrganizationType("+generalOrganizationList[i].organizationTypeId+")'><span aria-hidden='true' class='glyphicon glyphicon-pencil'></span></button></span></td>";	
	tempHtml+=				"</tr>";
}
	tempHtml+=	"</tbody>";
	tempHtml+= "</table>";
	tempHtml+="</form>";
	tempHtml+=	'<div id="newOrganizationType">';
	tempHtml+='</div>';
	tempHtml+='</div>';
	return tempHtml;
}

/********************************************************************************************************************************************
 ************************** C h e c k B o x ************************************************************************************************************
 **********************************************************************************************************************************************/

$(document).on('click',"#selectAllIndustryDepartmentChkBox",function(){
	$('.industryDepartmentChkBox').prop('checked', $(this).is(':checked'));
});

$(document).on('click',".industryDepartmentChkBox",function(){
	if($('.industryDepartmentChkBox:checked').length == $('.industryDepartmentChkBox').length) {
		$('.selectAllIndustryDepartmentChkBox').prop('checked', true);
	}
	else {
		$('.selectAllIndustryDepartmentChkBox').prop('checked', false);
	}
});

function checkBoxLength(){
	if($('.industryDepartmentChkBox:checked').length) {
		selectedCheckBoxes =[];
		$('.industryDepartmentChkBox:checked').each(function() {
			selectedCheckBoxes.push($(this).val());
		});
	}
	return false;
}

/********************************************************************************************************************************************
 ************************** D e l e t e ************************************************************************************************************
 **********************************************************************************************************************************************/

function deleteOrganizationTypes(id,organizationTypeId)
{
	var selectedCheckBoxes=[];
	var checkBoxes = document.getElementsByTagName('input');
	var param = "";
	for (var counter=1; counter < checkBoxes.length; counter++) {
		if (checkBoxes[counter].type.toUpperCase()=='CHECKBOX' && checkBoxes[counter].checked == true) {
			if(counter==1 || counter==checkBoxes.length){
				param+=checkBoxes[counter].value;
			}else{
				param=param+","+checkBoxes[counter].value;
			}}}

	var params=(param.slice(1, param.length));
	selectedCheckBoxes.push(params);
	checkBoxLength();
	if(params.length>0)
	{
		if(confirm("Do you want to delete selected record(s) It will delete all associated data?"))
		{
			$.get("../industryTypeMaster/deleteDepartment.htm?ids="+selectedCheckBoxes,function(response){
				console.log(response);
				if(response.status=="DELETE_SUCCESS")
				{
					selectedCheckBoxes=[];
					var tempHtml = listGeneralOrganizationResponse(response);
					$('#listGeneralOrganizationTab').append(tempHtml);
					$('#organizationTable').dataTable({responsive:true});
					$('#deleteErrorOrganizationTypeDivss').hide();
					$('#deleteSuccessOrganizationTypeDivss').show(600);
					$('#page-wrapper').unmask();	
					//industryTypes();
				}else if(response.status=="DELETE_ERROR"){
					$('#deleteSuccessOrganizationTypeDivss').hide();
					$('#deleteErrorOrganizationTypeDivss').show(600);
				}
				else{
					$('#page-wrapper').mask('<font style="color:red;">'+response.errorMessage+'</font>');
				}
				return false;
			});
		}
	}else{
		alert("Please Select at least one item");
	}
}

/********************************************************************************************************************************************
 ************************** E d i t ************************************************************************************************************
 **********************************************************************************************************************************************/

function editOrganization(){
	$("#editIndustryTypeOrganization").html('');
	$("#addOrganizationDropDown").html('');
	$("#organizationTable").hide();
	//$("#listOfOrganizationTypes").hide();
	var html="";
	html+='<div  id="editIndustryTypeOrganization">'
		+'<hr>'
		+'<div class="alert alert-success" style="display: none;" id="editSuccessOrganizationTypeDiv">'
		+'<strong><img alt="../" src="../resources/images/done.png">Organization Department Type Created Successfully</strong>'
		+'</div>'
		+'<div class="alert alert-danger alert-error" style="display: none;" id="editErrorOrganizationTypeDiv">'
		+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check'
		+'</div>'
		+'<div class="form-group" id="Add-editOrganizationType-Error">'
		+'<label>Organization Type<font style="color: #a94442">*</font></label>'
		+'<span style="color: #a94442" id="organizationType-span-Error" class="help-inline"></span>'
		+'<input type="text" class="form-control" id="organizationType" name="organizationType" placeholder="Organization Category" maxlength="50" >' 
		+'</div>'
		+'<div  id="Add-editDepartmentType-Error">'
		+'<label>Department Type<font style="color: #a94442">*</font></label>' 
		+'<span style="color: #a94442" id="departmentType-span-Error" class="help-inline"></span>'
		+'<input type="text" class="form-control" id="department_0" placeholder="department" vale="abc" maxlength="50"/>'
		+'<div id="editDepartment">'
		+'</div>'
		+'</div>'
		+'<table id="departments">'
		+'</table>'
		+'<div class="form-group">'
		//+'<input type="button" class="btn btn-primary" id="OrganizationType" onclick="editDepartment()" value="Add Another Department"/>'
		+'</div>'
		+'<button type="button" class="btn btn-default" id="updateOrganizationType" onclick="saveOrganization()">Submit</button>'
		+'</div>';
	$("#editIndustryTypeOrganization").append(html);
	$("#editIndustryTypeOrganization").show();
}


/********************************************************************************************************************************************
 ************************** Edit Form ************************************************************************************************************
 **********************************************************************************************************************************************/
function editDepartment()
{
	count=count+1;  
	var html="";
	html+='<table id="myTable" border="1">'
		+'<div class="form-group" id="editDepartment-Error">'
		+'<tr>'
		+'<input type="text"  id="department_'+count+'" name="department" placeholder="department" maxlength="50">'
		+' <input type="button" class="btn btn-default btn-xs" id="departments" onclick="#" value="delete" />'
		+'</tr>'
		+' </div>';
	+'</table>';
	$("#departments").append(html);
}


function editOrganizationType(id){
	$('#page-wrapper').mask('Loading...');
	selectedCheckBoxes = [];
	$("#addOrganizationDropDown").html('');
	$("#newIndustryTypeOrganization").html('');
	var divId = $("#editOrganizationType");
	var divIdToHide = "editOrganizationType";
	divIdToHide = "'"+divIdToHide+"'";
	appendDivId="page-wrapper";
	appendDivId = "'"+appendDivId+"'";
	selectedCheckBoxes.pop(id);	
	selectedCheckBoxes.push(id);
	checkBoxLength();

	if(selectedCheckBoxes.length>1){
		alert("You can edit only one record at a time");
		return false;
	}else if(selectedCheckBoxes.length==0){
		alert("Please select a record");
		return false;
	}else{
		$.ajax({
			type: "GET",
			url: "../industryTypeMaster/getEditDataOrganization.htm?id="+selectedCheckBoxes,
			dataType: "json",
			success: function(data){console.log(data);
			$("#editOrganizationType").empty();
			$('#page-wrapper').unmask();
			
			var html="";
			html+=' <div  id="updateOrganizationType">'
				+'<div class="alert alert-success" style="display: none;"	id="updateSuccessOrganizationTypeDiv">'
				+'<strong><img alt="../" src="../resources/images/done.png">Updated Successfully</strong>'
				+'</div>'
				+'<div class="alert alert-danger alert-error" style="display: none;"	id="updateErrorOrganizationTypeDiv">'
				+'<strong><img alt="../" src="../resources/images/error.jpg">Errors Occured.</strong>'
				+'</div>'
				
				+'<div class="SubHeading addAdminForm col-xs-14 row">'
			    +'<div class="col-sm-12 Action_heading">'
			    +'<h4>Edit Organization Type</h4>'
			    +'</div>'
				
				+'<form:form role="form" id="editOrganizationTypeForm">'
				+'<div class="form-group" id="editOrganizationType-Error">'
				+'<label>Organization Type<font style="color: #a94442">*</font></label>'
				+'<span style="color: #a94442" id="editOrganizationType-span-Error" class="help-inline"></span>';
			for(var j=0;j<1;j++)
			{
				html +='<input type="hidden" value='+data[j].organizationTypeId+' id="organizationIdss" >';
				html +='<input type="text" name="organizationTypeId" class="form-control input-sm" id="editOrganizationTypes" name="OrganizationType" value="'+data[j].organizationType+'" placeholder="Organization Type" maxlength="50">' ;
			}
			html +='<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="editOrganizationTypeError">Error</span>'
				+'</div>'
				+'<div  id="department-Error">';
			html+='<label>Department Type<font style="color: #a94442">*</font></label>'
				+'<span style="color: #a94442" id="editDepartmentType-span-Error" class="help-inline"></span>';
			for(var i=0;i<data.length;i++)
			{
				html +='<input type="hidden" value='+data[i].id+' name="departmentId">';	
				html +='<input type="text" name="department" class="form-control input-sm" id="department_'+i+'" placeholder="department" value="'+data[i].departmentType+'" maxlength="50"/>';

			}
			html+='<div id="addDepartment">'
				+'</div>'
				+'</div>'
				+'<div class="form-group input-group">'
				+'</div>'
				+'<button type="button" class="btn btn-primary" id="updateOrganizationType" onclick="updateOrganizationType()">Update</button>'
				+'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
				+'</form:form>'
				+'</div>'
				+'</div>';
			$("#editOrganizationType").append(html);
			$("#editOrganizationType").show();
			scrollDown(divId);
			},error:function(url,status,er) { 
				console.log("error: "+url+" status: "+status+" er:"+er);
				var html="Error in getting data.";
				$("#editOrganizationType").append(html);
			}
		});
	}
}

/********************************************************************************************************************************************
 ************************** U p d a t e ************************************************************************************************************
 **********************************************************************************************************************************************/

function updateOrganizationType(){
	$('#updateErrorOrganizationTypeDiv').hide();
	$('#updateSuccessOrganizationTypeDiv').hide();
	$('.help-inline').html('');
	$('#editOrganizationType-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	$('#editDepartmentType-Error').removeClass('has-error has-feedback');
	var organizationType=$("#editOrganizationTypes").val();
	var organizationTypeIds = $("#organizationIdss").val();
	var departments=new Array();
	var departmentIds = new Array();

	$('input[name="department"]').each(function() {
		departments.push($(this).val());
	});
	$('input[name="departmentId"]').each(function() {
		departmentIds.push($(this).val());
	});
	var OrganizationType={'organizationId': organizationTypeIds, 'organizationType':organizationType,'department':departments, 'departmentIds': departmentIds};

	$.ajax({
		url: "../industryTypeMaster/postEditOrganization.htm", 
		type: 'POST', 
		data: JSON.stringify(OrganizationType), 
		contentType: 'application/json',
		success: function(validationResponse) { console.log(validationResponse);
		if(validationResponse.status=="UPDATE_SUCCESS"){
			$('#updateErrorOrganizationTypeDiv').hide();
			$('#updateSuccessOrganizationTypeDiv').show(600);
			$('#updateOrganizationType').trigger("reset");
			hideForm('editOrganizationType','page-wrapper');
			updateOrganizationSuccessList();

		}else if(validationResponse.status=="UPDATE_ERROR"){
			$('#updateErrorOrganizationTypeDiv').show(600);
			for(var i=0;i<validationResponse.errorMessageList.length;i++){
				var fieldName = validationResponse.errorMessageList[i].fieldName;
				var errorMessage = validationResponse.errorMessageList[i].message;
				$('#'+fieldName+'-span-Error').html(errorMessage);
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#page-wrapper').unmask();
			}
		}}});
};

/********************************************************************************************************************************************
 ************************** Add New Departments ************************************************************************************************************
 **********************************************************************************************************************************************/
function showAddDepartment()
{
	$("#newIndustryTypeOrganization").html('');
	$("#editIndustryTypeOrganization").html('');
	$("#editOrganizationType").html('');
	$("#departments").html('');
	$("#addOrganizationDropDown").html('');
	
	var divId = $('#addOrganizationDropDown');
	var divIdToHide = "addOrganizationDropDown";
	divIdToHide = "'"+divIdToHide+"'";
	appendDivId = "page-wrapper";
	appendDivId = "'"+appendDivId+"'";

	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listAllIndustryType.htm",
		dataType: "json",
		success: function(data){ 
			var html="";
			//Alerts and error messages
			html+='<div  id="addOrganizationDropDown" class=" col-sm-12">'
				+'<div class="alert alert-success" style="display: none;"	id="addDepartmentTypeDiv">'
				+'<img alt="../" src="../resources/images/done.png">Saved Successfully'
				+'</div>'
				+'<div class="alert alert-danger alert-error" style="display: none;" id="addErrorDepartmentTypeDiv">'
				+'<strong><img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please check</strong>'
				+'</div>'
			
			    +'<div class="SubHeading addAdminForm col-xs-14 row">'
		        +'<div class="col-sm-12 Action_heading">'
		        +'<h4>Add Deaprtment</h4>'
		        +'</div>';

			//Organization Dropdown
			html+='<div class="form-group col-sm-4">'
				+'<label for="OrganizationCategory">Organization Type</label>'
				+'<select id="selectedOrganizationDepartmentType" class="form-control input-sm">';
			for(var i=0;i<data.length;i++){

				html+=	'<option value='+data[i].id+'>'+data[i].organizationType+'</option>';
			}
			html+='</select>';
			html+='</div>';

			//Adding Department
			html+='<div  id="Add-Departments-Error" class="col-sm-5 col-sm-offset-1">'
				+'<div>'
				+'<label>Department Type<font style="color: #a94442">*</font></label>'   
				+'<span style="color: #a94442" id="Department-span-Error" class="help-inline"></span>'
				+'<input type="text" class="form-control input-sm" name="departmentses" id="departmentss_0" placeholder="departments" maxlength="50" style="margin-bottom: 7px;"/>'
				+'</div>'
				//Div is appending #department
				+'<div id="departments"></div>'
				//Buttons
				+'<div class="form-group input-group">'
				+'<button type="button" class="btn btn-default btn-xs" id="IndustryTypes" onclick="addDepartmentsType()"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Department</button>'
				+'</div>'
				+'<div>'
				+'<button type="button" class="btn btn-primary" id="saveSegment" onclick="saveDepartmentType()">Save</button>'
			    +'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
		        +'</div>'
				+'</div>'
				+'</div>'//end of Add SegmentDepartment 
				+ '</div>' //end of Department 
				+ '</div>'; //end of Pannel	 
			$("#addOrganizationDropDown").append(html);
			$("#addOrganizationDropDown").show();
			$("#departments").show();
			scrollDown(divId);

		}});}


function addDepartmentsType()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group input-group" id="myTable">'
		+'<input class="form-control input-sm" type="text"  id="departments_'+count+'" name="departmentses" placeholder="department" maxlength="50" style="margin-bottom: -15px;">&nbsp&nbsp'
		+'<span class="input-group-btn">'
		+' <button type="button" class="btn btn-default btn-sm" id="DepartmentsTypes'+count+'" onclick="deleteTextBoxDepartment('+count+')"><i class="glyphicon glyphicon-trash"></i>'
		+'</button>'
		+'</span>'
		+'</div>';
	$("#departments").append(html);
}

function deleteTextBoxDepartment(count)
{
	$("#departments_"+count).parent().remove();
	count--;
}

/********************************************************************************************************************************************
 ************************** S A V E Department TYPE ************************************************************************************************************
 **********************************************************************************************************************************************/

function saveDepartmentType()
{
	$('#addErrorDepartmentTypeDiv').hide();
	$('#addDepartmentTypeDiv').hide();
	$('#Department-span-Error').removeClass('has-error has-feedback');
	$('.help-inline').html('');
	var selectedOrganizationId=$("#selectedOrganizationDepartmentType").val();
	var departmentsArray=new Array();
	$('input[name="departmentses"]').each(function() {
		departmentsArray.push($(this).val());
	});
	var DepartmentType={'organizationTypeId':selectedOrganizationId,'department':departmentsArray};
	$.ajax({
		url: "../industryTypeMaster/saveDepartmentType.htm", 
		type: 'POST', 
		data: JSON.stringify(DepartmentType),
		contentType:'application/json',
		success:function(validationResponse){console.log(validationResponse);
		if(validationResponse.status=="SAVE_SUCCESS"){
			$('#addErrorDepartmentTypeDiv').hide();
			//$('#addDepartmentTypeDiv').show(600);
			$('#AddDepartmentCategoryTextBox').trigger("reset");
			$('#successOrganizationTypeDivs').show(600);
			hideForm('addOrganizationDropDown','page-wrapper');
			organizationSaveList();

		}else if(validationResponse.status=="SAVE_ERROR"){
			$('#addErrorDepartmentTypeDiv').show(600);
			$('#addDepartmentTypeDiv').hide();
			$('#Add-Departments-Error').addClass('has-error has-feedback');
			$('#Department-span-Error').html(validationResponse.errorMessage);
		}}});
	}

/********************************************************************************************************************************************
 ************************** Drop DOwm For Organization Industry************************************************************************************************************
 **********************************************************************************************************************************************/
function showIndustrySegmentCategory()
{
	$('#addOrganizationIndustryDropDown').html('');

	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/list.htm",
		dataType: "json",
		success: function(data){ 
			var html="";
			html+='<div id="addOrganizationIndustryDropDown" class="form-group">';
			html+='<div class="col-sm-2">';
			html+=	'<label for="Industry">Industry Type<select id="selectedOrganizationIndustryType" class="form-control input-sm" onchange="getSegmentDropDown()"></label>';
			html+=	'<option value="0">ALL</option>';
			for(var i=0;i<data.length;i++){

				html+=	'<option value='+data[i].id+'>'+data[i].industryType+'</option>';
			}
			html+='</select>';
			html+='</div>';
			html+='</div>';
			html+='<div id="addOrganizationSegmentDropDown" class="form-group">';
			html+='<div class="col-sm-3">';
			html+=	'<label for="SegmentCategory">Segment Category';
			html+=	'<select class="form-control input-sm"  id="selectedSegmentCategory">';
			html+=	'<option value="0">ALL</option>';
			html+='</select>';
			html+='</div>';
			html+='</div>';
			$('#addOrganizationIndustryDropDown').append(html);
			$('#addOrganizationIndustryDropDown').show();

		}});};


/********************************************************************************************************************************************
************************* Drop DOwm For Organization ************************************************************************************************************
**********************************************************************************************************************************************/

		function getSegmentDropDown()
		{
			$('#addOrganizationSegmentDropDown').html('');
			$('#addOrganizationSegmentDropDown').hide();
			var selectedOrganizationIndustryType = $('#selectedOrganizationIndustryType').val();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/lists.htm?id="+selectedOrganizationIndustryType,
				dataType: "json",
				success: function(data){ 
					var html="";
					html+='<div id="addOrganizationSegmentDropDown" class="form-group">';
					html+='<div class="col-sm-3">';
					html+=	'<label for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedOrganizationSegmentType">';
					html+=	'<option value="0">ALL</option>';
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].segmentCategory+'</option>';
					}
					html+='</select>';
					html+='</div>';

					$('#addOrganizationSegmentDropDown').append(html);
					$('#addOrganizationSegmentDropDown').show();
					$('#addOrganizationIndustryDropDown').show();


				}});}


/********************************************************************************************************************************************
**************************3rd Tab SHOW ALL DROPDOWN ************************************************************************************************************
**********************************************************************************************************************************************/
		function ShowALLAttributeDropDown()
		{
			//first Tab Data
			$("#industryDropDown").html('');
			$("#editOrganizationType-Error").html('');//@m
			$("#editOrganizationAttribute").html('');//@m
			$("#addDepartmentAttribute").html('');//@m
			$("#editOrganizationAttribute").html('');//@m
			$("#add").html('');
			$("#dataTab").html('');
			$("#newIndustryType").html('');
			$("#listOfIndustryType").html('');
			$("#editIndustryType").html('');

			//second tab data
			$("#addOrganizationDropDown").html('');
			$("#listOfIndustryTypes").html('');
			$("#dataTabOrg").html('');
			$("#editOrganizationType").html('');
			$("#addOrganizationAttributes").html('');
			$("#addOrganizationAttribute").html('');
			$("#newIndustryTypeOrganization").html('');
			$('#listGeneralOrganizationTab').html('');

			//Fourth tab data
			$("#uploadExcel").html('');
			$('#exportIndustryMasterTab').html('');
			$("#organizationAttributeType").html('');
			$("#organizationAttributeType").empty();
			$('#listGeneralAttributeTab').html('');
			$("#editDepartmentAttributes").html('');
			$('#listGeneralIndustryTab').html('');
			$("#dropDown").html('');
			$('industryDropDown').html('');
			$("#listGeneralDepartmentAttributeTab").html('');
			$("#subHeadingFormName").hide();
			$("#organizationAttributeType").html();
			$('#page-wrapper').mask('Loading...');
			
			//using for delete For OrganizationTypeAttribute
		    selectedOrganizationAttributeCheckBox=[];
		    var checkBoxDeleteSelectedItem=$("#selectedAllorganizationAttributeIds").val();
		    selectedOrganizationAttributeCheckBox.push(checkBoxDeleteSelectedItem);
		    
		  //using for delete for DepartmentTypeAttribute
		    selectedDepartmentAttributeCheckBox=[];
		    var checkBoxDeleteItem=$("#selectedAllDepartmentAttributeIds").val();
		    selectedDepartmentAttributeCheckBox.push(checkBoxDeleteItem);

			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllIndustryType.htm",
				dataType: "json",
				success: function(data){ 
					$('#page-wrapper').unmask();
					var html="";
					html+='<div class="tab-pane fade in active" id="organizationType" class="form-group">';
					html += '<form  class="form-inline col-xs-12 SubHeading AdminMainActivity">';
					html+=	'<label class="control-label" for="OrganizationCategory">Organization Type<select id="selectedOrganizationType" class="form-control input-sm" onchange="getDepartmentType()">';
					html+=	'<option value="0">ALL</option>';
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].organizationType+'</option>';
					}
					html+='</select>';
					html+='</label>';
					html+='<label id="departmentType" for="DepartmentCategory">Department Type<select class="form-control input-sm"  id="selectedDepartmentType">';
					html+='<option value="0">ALL</option>';
					html+='</select>';
					html+='</label>';
					
					html+='<div class="AdminMultiView btn-group">';
					html+='<button class="btn btn-default btn-sm dropdown-toggle" type="button" onclick="toggleButtonView()" data-toggle="dropdown" aria-expanded="false">View <span class="caret"></span>';
					html+='</button>';
					html+='<ul class="dropdown-menu dropdown-menu-right" role="menu">';
					html+='<li>';
				    html+='<a  id="selectedOrganizationAttributeType" value="1" onclick="showListOfAttributes()" type="button">Organization Attribute List</a>';
					html+='</li>';
					html+='<li>';
					html+='<a id=selectedDepartmentTypeAttributeValue" value="2" onclick="listAllDepartmentAttribute()" type="button">Department Attribute List</a>';
			        html+='</li>';
					html+=' </ul>';
					html+='</div>';
											
											
					//add and delete buttons start
					html += '<div class="form-group float-right">';
					html += '<button type="button" class="btn btn-primary AdminDeleteButton float-right" onclick="deleteOrganizationAttributeTypes()">';
					//html += '<button type="button" class="btn btn-primary AdminDeleteButton float-right" onclick="deleteDepartmentAttributeTypes()">';
					html += '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>';
					html += '</button>';
					html += '<div class="AdminMultiAdd btn-group float-right">';
					html +=  '<button id="dLabel" class="btn btn-primary AdminAddButton" type="button" onclick="adminAddToggleButton()" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">';
					html += '+</button>';
					html += '<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dLabel">';
					html +=' <div class="add-arrow-up"></div>';
					html += '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addOrganization()">Add Organization Attributes</a></li>';
					html += '<li role="presentation"><a role="menuitem" tabindex="-1" onclick="addDepartments()">Add Department Attributes</a></li>';
					html += '</ul>';
					html += '</div>';
					html += '</div>';
					
					html += '</form>';
					html += '</div>';

					$("#organizationAttributeType").append(html);
					$("#organizationAttributeType").show();
					//showListOfAttributes();//commented by manoj
				}});}

	
/**********************toggle button for view*************************************************/
 function toggleButtonView(){
	$( ".AdminMultiView" ).toggleClass("open");	
 }		 
		 
//toggle button for view
 function adminAddToggleButton(){
$( ".AdminMultiAdd" ).toggleClass("open");	
 }
 /**********************toggle button for view*************************************************/
 
 
       function getDepartmentType()
           {
    	   $('#page-wrapper').mask('Loading...');
			var selectedOrganizationType = $('#selectedOrganizationType').val();
			$("#departmentType").empty();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllDepartmentType.htm?id="+selectedOrganizationType,
				dataType: "json",
				success: function(data){ 
					var html="";
					html+=	'<label id="departmentType" for="DepartmentCategory">Department Type<select class="form-control input-sm" id="selectedDepartmentType">';
					html+=	'<option value="0">ALL</option>';
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].departmentType+'</option>';
					}
					html+='</select>';
					html+='</label>';
					$("#departmentType").append(html);
					$("#departmentType").show();
					$('#page-wrapper').unmask();
				}}
			);}


/********************************************************************************************************************************************
************************** SHOW ORGANIZATION ATTRIBUTE LIST VIEW ************************************************************************************************************
**********************************************************************************************************************************************/

       function updateOrganizationAttributeList(){
    	   $("#uploadExcel").html('');
			$('#exportIndustryMasterTab').html('');
			$('#industryDropDown').html('');
			$('#page-wrapper').mask('Loading...');
			$("#showAttributesData").html('');
			$("#departmentAttributeTypes").html('');
			$("#editOrganizationAttributeType").html('');
			$("#editDepartmentAttributeType").html('');
			$("#addOrganizationAttributes").html(''); 
			$("#addOrganizationAttribute").html('');
			$("#departmentTypeAttributes").html('');
			$("#addDepartmentAttribute").html('');
			$("#dataTableOrganizationAttribute").html('');
			$("#listGeneralDepartmentAttributeTab").html('');
			
			var selectedOrganizationType = $('#selectedOrganizationType').val();
			var selectedDepartmentType = $('#selectedDepartmentType').val();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllAttribute.htm?id="+selectedOrganizationType+"&iid="+selectedDepartmentType,
				dataType: "json",
				success: function(data){ 
					if(data.status=="LIST_SUCCESS"){
						var tempHtml = listGeneralAttributeResponse(data);
						$('#listGeneralAttributeTab').append(tempHtml);
						$('#organizationTables').dataTable();
						$('#page-wrapper').unmask();
						$('#editSuccessDepartmentAttribute').show(600);
						
					}else{
						$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
					}
				}},'json').fail(function(response){
					$('#page-wrapper').append(response.status+"*****************"+response.statusText);
				});

			return false;
		}	   
       
 /********************************************************************************************************************************************
 ************************** SAVE ORGANIZATION ATTRIBUTE LIST VIEW ************************************************************************************************************
**********************************************************************************************************************************************/
      
       function organizationAttributeSaveList()
		{
			$("#uploadExcel").html('');
			$('#exportIndustryMasterTab').html('');
			$('#industryDropDown').html('');
			$('#page-wrapper').mask('Loading...');
			$("#showAttributesData").html('');
			$("#departmentAttributeTypes").html('');
			$("#editOrganizationAttributeType").html('');
			$("#editDepartmentAttributeType").html('');
			$("#addOrganizationAttributes").html(''); 
			$("#addOrganizationAttribute").html('');
			$("#departmentTypeAttributes").html('');
			$("#addDepartmentAttribute").html('');
			$("#dataTableOrganizationAttribute").html('');
			$("#listGeneralDepartmentAttributeTab").html('');
			
			var selectedOrganizationType = $('#selectedOrganizationType').val();
			var selectedDepartmentType = $('#selectedDepartmentType').val();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllAttribute.htm?id="+selectedOrganizationType+"&iid="+selectedDepartmentType,
				dataType: "json",
				success: function(data){ 

					if(data.status=="LIST_SUCCESS"){
						var tempHtml = listGeneralAttributeResponse(data);
						$('#listGeneralAttributeTab').append(tempHtml);
						$('#organizationTables').dataTable();
						$('#page-wrapper').unmask();
						$('#addSuccessOrganizationAttribute').show(600);
						
					}else{
						$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
					}
				}},'json').fail(function(response){
					$('#page-wrapper').append(response.status+"*****************"+response.statusText);
				});

			return false;
		}	 
       
       
       
       
		function showListOfAttributes()
		{
			$("#uploadExcel").html('');
			$('#exportIndustryMasterTab').html('');
			$('#industryDropDown').html('');
			$('#page-wrapper').mask('Loading...');
			$("#showAttributesData").html('');
			$("#departmentAttributeTypes").html('');
			$("#editOrganizationAttributeType").html('');
			$("#editDepartmentAttributeType").html('');
			$("#addOrganizationAttributes").html(''); 
			$("#addOrganizationAttribute").html('');
			$("#departmentTypeAttributes").html('');
			$("#addDepartmentAttribute").html('');
			$("#dataTableOrganizationAttribute").html('');
			$("#listGeneralDepartmentAttributeTab").html('');
			
			var selectedOrganizationType = $('#selectedOrganizationType').val();
			var selectedDepartmentType = $('#selectedDepartmentType').val(); 
			//alert("ID:"+selectedOrganizationType+"IID:"+selectedDepartmentType);
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllAttribute.htm?id="+selectedOrganizationType+"&iid="+selectedDepartmentType,
				dataType: "json",
				success: function(data){ 

					if(data.status=="LIST_SUCCESS"){
						var tempHtml = listGeneralAttributeResponse(data);
						$('#listGeneralAttributeTab').append(tempHtml);
						$('#organizationTables').dataTable();
						$('#page-wrapper').unmask();
					}else{
						$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
					}
				}},'json').fail(function(response){
					$('#page-wrapper').append(response.status+"*****************"+response.statusText);
				});

			return false;
		}	 


	function listGeneralAttributeResponse(response){	
		$('#listGeneralAttributeTab').html('');
		$('#exportIndustryMasterTab').html('');
		$("#uploadExcel").html('');

		var generalAttributeList = response.successObject["OrganizationAttributes"];
		var generalAttributeLists = response.successObject["DepartmentAttributes"];
		
		var organizationAttributeDeleteAll=[];
		var deleteAllOrganizationAttributes=$("#selectedAllorganizationAttributeIds").val();
		organizationAttributeDeleteAll.push(deleteAllOrganizationAttributes);
		
		var departmentAttributeDeleteAll=[];
		var deleteAlldepartmentAttributes=$("#selectedAllDepartmentAttributeIds").val();
		departmentAttributeDeleteAll.push(deleteAlldepartmentAttributes);

		var tempHtml="";
		tempHtml+='<div id="dataTableOrganizationAttribute">';
	    tempHtml+="<input type='hidden' class='btn btn-danger'  onclick='deleteOrganizationAttributeTypes("+organizationAttributeDeleteAll+""+organizationAttributeDeleteAll+")' value='Delete'>&nbsp";
		//delete success
	    tempHtml+='<div class="alert alert-success" style="display: none;" id="deleteSuccessAttributeDivs">';
		tempHtml+='<img alt="../" src="../resources/images/done.png">Deleted Successfully';
		tempHtml+='</div>';
		//save success
		tempHtml+= '<div class="alert alert-success" style="display: none;" id="addSuccessOrganizationAttribute">';
		tempHtml+= '<img alt="../" src="../resources/images/done.png">Organization Attribute Type Created Successfully';
		tempHtml+= '</div>';
		//update success
		tempHtml+= '<div class="alert alert-success" style="display: none;" id="editSuccessDepartmentAttribute">';
		tempHtml+= '<img alt="../" src="../resources/images/done.png">Updated Successfully';
		tempHtml+= '</div>';
		
		tempHtml+= 	'<div class="alert alert-danger alert-error" style="display: none;" id="errorAttributeDiv">';
		tempHtml+=	'<strong>Error occured</strong>' ;
		tempHtml+=	"</div>";
		tempHtml+=	"<form>";
		tempHtml+= "<table class='table table-striped dataTable no-footer' id='organizationTables'>";
		tempHtml+=		"<thead>";
		tempHtml+= 			"<tr>";
		tempHtml+=			"<th><input type='checkbox' id='selectAllIndustryAttributeChkBox'/></th>";
		tempHtml+=				"<th>Organization Type</th>";
		tempHtml+=				"<th>Organization Attributes</th>";
		tempHtml+=              "<th></th>";
		tempHtml+=		"</tr>";
		tempHtml+= 		"</thead>";
		tempHtml+=			"<tbody>";
		for(var i=0;i<generalAttributeList.length;i++){ 
			
			tempHtml+=			"<tr>";
			/*tempHtml+=		"<td><input type='checkbox' name='organization' id='selectedAllorganizationAttributeIds' class='industryAttributeChkBox' value='"+generalAttributeList[i].id+","+generalAttributeList[i].organizationTypeId+"'/></td>";*/	
			tempHtml+=		"<td><input type='checkbox' name='organization' id='selectedAllorganizationAttributeIds' class='industryAttributeChkBox' value='"+generalAttributeList[i].id+'org'+generalAttributeList[i].organizationTypeId+"'/></td>";
			tempHtml+=			"<td>"+generalAttributeList[i].organizationType+"</td>"; 
			tempHtml+=			"<td>"+generalAttributeList[i].attributeKey+"</td>";
			tempHtml+=          "<td class='text-right'><span><button type='button' class='btn btn-xs AdminInList' title='Edit' onclick='editOrganizationAttribute("+generalAttributeList[i].organizationTypeId+")'><span aria-hidden='true' class='glyphicon glyphicon-pencil'></span></button></span></td>";	
			tempHtml+=		"</tr>";
		}
		tempHtml+=	"</tbody>";
		tempHtml+= "</table>";
		tempHtml+="</form>";
		/*tempHtml+=	'<div id="dataTableOrganizationAttribute">';
		tempHtml+='</div>';*/
		tempHtml+='</div>';
		return tempHtml;
		}
		  

/*******************************************************************************************************************************************
************************** SHOW DEPARTMENT ATTRIBUTE LIST VIEW ************************************************************************************************************
**********************************************************************************************************************************************/		
		
	function updateSuccessDepartmentAttributeList(){
			$("#uploadExcel").html('');
			$('#exportIndustryMasterTab').html('');
			$('#industryDropDown').html('');
			$('#page-wrapper').mask('Loading...');
			$("#showAttributesData").html('');
			$("#departmentAttributeTypes").html('');
			$("#editOrganizationAttributeType").html('');
			$("#editDepartmentAttributeType").html('');
			$("#addOrganizationAttributes").html(''); 
			$("#addOrganizationAttribute").html('');
			$("#departmentTypeAttributes").html('');
			$("#addDepartmentAttribute").html('');
			$("#dataTableOrganizationAttribute").html('');
			$("#dataTableDepartmentAttribute").html('');
			$("#listGeneralDepartmentAttributeTab").html('');
			$("#listGeneralAttributeTab").html('');

			var selectedOrganizationType = $('#selectedOrganizationType').val();
			var selectedDepartmentType = $('#selectedDepartmentType').val();

			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllAttribute.htm?id="+selectedOrganizationType+"&iid="+selectedDepartmentType,
				dataType: "json",
				success: function(data){ 

					if(data.status=="LIST_SUCCESS"){
						var tempHtml = listGeneralDepartmentAttributeResponse(data);
						$('#listGeneralDepartmentAttributeTab').append(tempHtml);
						$('#departmentTable').dataTable();
						$('#page-wrapper').unmask();
						$('#editSuccessDepartmentAttribute').show(600);
					}else{
						$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
					}
				}},'json').fail(function(response){
					$('#page-wrapper').append(response.status+"*****************"+response.statusText);
				});

			return false;
	}
	
	
	
	function saveDepartmentAttributelistAll()
	{
		$("#uploadExcel").html('');
		$('#exportIndustryMasterTab').html('');
		$('#industryDropDown').html('');
		$('#page-wrapper').mask('Loading...');
		$("#showAttributesData").html('');
		$("#departmentAttributeTypes").html('');
		$("#editOrganizationAttributeType").html('');
		$("#editDepartmentAttributeType").html('');
		$("#addOrganizationAttributes").html(''); 
		$("#addOrganizationAttribute").html('');
		$("#departmentTypeAttributes").html('');
		$("#addDepartmentAttribute").html('');
		$("#dataTableOrganizationAttribute").html('');
		$("#dataTableDepartmentAttribute").html('');
		$("#listGeneralDepartmentAttributeTab").html('');
		$("#listGeneralAttributeTab").html('');

		var selectedOrganizationType = $('#selectedOrganizationType').val();
		var selectedDepartmentType = $('#selectedDepartmentType').val();

		$.ajax({
			type: "GET",
			url: "../industryTypeMaster/listAllAttribute.htm?id="+selectedOrganizationType+"&iid="+selectedDepartmentType,
			dataType: "json",
			success: function(data){ 

				if(data.status=="LIST_SUCCESS"){
					var tempHtml = listGeneralDepartmentAttributeResponse(data);
					$('#listGeneralDepartmentAttributeTab').append(tempHtml);
					$('#departmentTable').dataTable();
					$('#page-wrapper').unmask();
					$('#addSuccessDepartmentAttribute').show(600);
				}else{
					$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
				}
			}},'json').fail(function(response){
				$('#page-wrapper').append(response.status+"*****************"+response.statusText);
			});

		return false;
	}	 
	
	
	
	
		function listAllDepartmentAttribute()
		{
			$("#uploadExcel").html('');
			$('#exportIndustryMasterTab').html('');
			$('#industryDropDown').html('');
			$('#page-wrapper').mask('Loading...');
			$("#showAttributesData").html('');
			$("#departmentAttributeTypes").html('');
			$("#editOrganizationAttributeType").html('');
			$("#editDepartmentAttributeType").html('');
			$("#addOrganizationAttributes").html(''); 
			$("#addOrganizationAttribute").html('');
			$("#departmentTypeAttributes").html('');
			$("#addDepartmentAttribute").html('');
			$("#dataTableOrganizationAttribute").html('');
			$("#dataTableDepartmentAttribute").html('');
			$("#listGeneralDepartmentAttributeTab").html('');
			$("#listGeneralAttributeTab").html('');

			var selectedOrganizationType = $('#selectedOrganizationType').val();
			var selectedDepartmentType = $('#selectedDepartmentType').val();

			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllAttribute.htm?id="+selectedOrganizationType+"&iid="+selectedDepartmentType,
				dataType: "json",
				success: function(data){ 

					if(data.status=="LIST_SUCCESS"){
						var tempHtml = listGeneralDepartmentAttributeResponse(data);
						$('#listGeneralDepartmentAttributeTab').append(tempHtml);
						$('#departmentTable').dataTable();
						$('#page-wrapper').unmask();
					}else{
						$('#page-wrapper').append('<font style="color:red">'+data.errorMessage+'</font>');
					}
				}},'json').fail(function(response){
					$('#page-wrapper').append(response.status+"*****************"+response.statusText);
				});

			return false;
		}	 
		
		function listGeneralDepartmentAttributeResponse(response){	
			$('#listGeneralDepartmentAttributeTab').html('');
			$('#exportIndustryMasterTab').html('');
			$("#uploadExcel").html('');

			var generalAttributeList = response.successObject["OrganizationAttributes"];
			var generalAttributeLists = response.successObject["DepartmentAttributes"];
			var organizationAttributeDeleteAll=[];
			var deleteAllOrganizationAttributes=$("#selectedAllorganizationAttributeIds").val();
			organizationAttributeDeleteAll.push(deleteAllOrganizationAttributes);
			var departmentAttributeDeleteAll=[];
			var deleteAlldepartmentAttributes=$("#selectedAllDepartmentAttributeIds").val();
			departmentAttributeDeleteAll.push(deleteAlldepartmentAttributes);

		var tempHtml="";
		tempHtml+='<div id="dataTableDepartmentAttribute">';
	    tempHtml+="<input type='hidden' class='btn btn-danger'  onclick='deleteDepartmentAttributeTypes("+departmentAttributeDeleteAll+""+departmentAttributeDeleteAll+")' value='Delete'>&nbsp";
		//save success
	    tempHtml+='<div class="alert alert-success" style="display: none;" id="addSuccessDepartmentAttribute">';
	    tempHtml+='<img alt="../" src="../resources/images/done.png">Department Attribute Type Created Successfully';
	    tempHtml+='</div>';
	    //update success
	    tempHtml+='<div class="alert alert-success" style="display: none;" id="editSuccessDepartmentAttribute">';
	    tempHtml+='<img alt="../" src="../resources/images/done.png">Updated Successfully';
	    tempHtml+='</div>';
	    
	    tempHtml+='<div class="alert alert-success" style="display: none;" id="deleteSuccessDepartmentAttributeDivs">';
		tempHtml+='<img alt="../" src="../resources/images/done.png">Deleted Successfully';
		tempHtml+='</div>';
		tempHtml+= 	'<div class="alert alert-danger alert-error" style="display: none;" id="errorDepartmentAttributeDiv">';
		tempHtml+=	'Error occured' ;
		tempHtml+=	"</div>";
		tempHtml+=	"<form>";
		tempHtml+= "<table class='table table-striped dataTable no-footer' id='departmentTable'>";
		tempHtml+=		"<thead>";
		tempHtml+= 			"<tr>";
		tempHtml+=				"<th><input type='checkbox' id='selectAllDepartmentAttributeChkBox'/></th>";
		tempHtml+=				"<th>Department Type</th>";
		tempHtml+=				"<th>Department Attributes</th>";
		tempHtml+=              "<th></th>";
		tempHtml+=			"</tr>";
		tempHtml+=		"</thead>";
		tempHtml+=			"<tbody>";
		
		for(var j=0;j<generalAttributeLists.length;j++){ 
			tempHtml+=			"<tr>";
			/*tempHtml+=		"<td><input type='checkbox' id='selectedAllDepartmentAttributeIds' class='departmentAttributeChkBox' value='"+generalAttributeLists[j].id+","+generalAttributeLists[j].departmentTypeId+"'/></td>";*/	
			tempHtml+=		"<td><input type='checkbox' id='selectedAllDepartmentAttributeIds' class='departmentAttributeChkBox' value='"+generalAttributeLists[j].id+'dept'+generalAttributeLists[j].departmentTypeId+"'/></td>";
			tempHtml+=			"<td>"+generalAttributeLists[j].departmentType+"</td>"; 
			tempHtml+=			"<td>"+generalAttributeLists[j].attributeKey+"</td>" ;
			tempHtml+=           "<td> <button type='button' class='btn btn-xs AdminInList' title='Edit' onclick='editDepartmentAttributeKeys("+generalAttributeLists[j].departmentTypeId+")'><span aria-hidden='true' class='glyphicon glyphicon-pencil'></span></button></span></td>";	
			tempHtml+=			"</tr>";
		}
		tempHtml+=	"</tbody>";
		tempHtml+= "</table>";
		tempHtml+="</form>";
		tempHtml+='<div id="dataTableDepartmentAttribute">';
		tempHtml+='</div>';
		tempHtml+='</div>';
		return tempHtml;
		}



/********************************************************************************************************************************************
************************** C h e c k B o x **************************************************************************************************
**********************************************************************************************************************************************/

		$(document).on('click',"#selectAllDepartmentAttributeChkBox",function(){
			$('.departmentAttributeChkBox').prop('checked', $(this).is(':checked'));
		});

		$(document).on('click',".industryAttributeChkBox",function(){
			if($('.departmentAttributeChkBox:checked').length == $('.industryAttributeChkBox').length) {
				$('.selectAllDepartmentAttributeChkBox').prop('checked', true);
			}
			else {
				$('.selectAllDepartmentAttributeChkBox').prop('checked', false);
			}
		});

		function checkBoxLength(){
			if($('.departmentAttributeChkBox:checked').length) {
				selectedCheckBoxes =[];
				$('.departmentAttributeChkBox:checked').each(function() {
					selectedCheckBoxes.push($(this).val());
				});
			}
			return false;
		}

/********************************************************************************************************************************************
************************** C h e c k B o x **************************************************************************************************
**********************************************************************************************************************************************/

				$(document).on('click',"#selectAllIndustryAttributeChkBox",function(){
					$('.industryAttributeChkBox').prop('checked', $(this).is(':checked'));
				});

				$(document).on('click',".industryAttributeChkBox",function(){
					if($('.industryAttributeChkBox:checked').length == $('.industryAttributeChkBox').length) {
						$('.selectAllIndustryAttributeChkBox').prop('checked', true);
					}
					else {
						$('.selectAllIndustryAttributeChkBox').prop('checked', false);
					}
				});

				function checkBoxLength(){
					if($('.industryAttributeChkBox:checked').length) {
						selectedCheckBoxes =[];
						$('.industryAttributeChkBox:checked').each(function() {
							selectedCheckBoxes.push($(this).val());
						});
					}
					return false;
				}
	
/********************************************************************************************************************************************
************************** A D D ATTRIBUTES Organization Drop Down ************************************************************************************************************
**********************************************************************************************************************************************/
		function addOrganizationAttributes(organizationId){
			$('#industryDropDown').html('');
			$("#addDepartmentAttribute").hide();
			$("#departmentAttributeTypes").hide();
			$("#addOrganizationAttributes").empty();
			$('#listGeneralDepartmentAttributeTab').html('');
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listAllIndustryType.htm",
				dataType: "json",
				success: function(data){ 

					var html="";
					html+='<div id="addOrganizationAttributes" class="form-group col-sm-6">';
					html+='<div class="col-sm-8">';
					html+=	'<label for="OrganizationCategory">Organization Type</label><select id="selectedOrganizationAttributes" disabled="disabled" class="form-control">';
					
					for(var i=0;i<data.length;i++){
						var attributeId=data[i].id;
						var organizationName=data[i].organizationType;
						if(attributeId==organizationId){
							html+=	'<option value='+attributeId+'>'+organizationName+'</option>';
							break;
						}
			        }
					html+='</select>';
					html+='</div>';
					html+='</div>';

					$("#addOrganizationAttributes").append(html);
					$("#addOrganizationAttributes").show(); 

				}});

		}

/********************************************************************************************************************************************
************************** A D D ATTRIBUTES Dynamic Fields **********************************************************************************
**********************************************************************************************************************************************/

		function addOrganizationAttribute()
		{
			count=count+1;  
			var html="";
			html+='<div class="form-group input-group col-sm-12" id="department-Error">'
				+'<div class="col-sm-5">'
				+'<input type="text" name="addOrganizationAttributeKeyArray" class="form-control input-sm" id="attributeKey_'+count+'" placeholder="Attribute Key" maxlength="50">'
				+'<span class="input-group-btn">'
				+'</div>'
				+'<div class="row col-sm-5" id="addOrganizationAttributeKeys">'
				+'<select class="form-control input-sm" name="addOrganizationAttributeKeys"  id="attributeKeyType_'+count+'">'
				+'<option value="Numeric">Numeric</option>'
				+'<option value="Alphabetic">Alphabetic</option>'
				+'<option value="MediaType">MediaType</option>'
				+'</select>'
				+'</div>'
				+'<button type="button" class="btn btn-default btn-sm" id="OrganizationTypeDelete'+count+'" onclick="deleteOrganizationTextBox('+count+')"><i class="glyphicon glyphicon-trash"></i>'
				+'</button>'
				+'</span>'
				+' </div>';
			$("#organization").append(html);       
		}


		function deleteOrganizationTextBox(count)
		{
			$("#attributeKey_"+count).parent().remove();
			$("#attributeKeyType_"+count).parent().remove();
			$("#OrganizationTypeDelete"+count).parent().remove();
			count--;
		}


/********************************************************************************************************************************************
************************** A D D ATTRIBUTES Organization Onclick************************************************************************************************************
**********************************************************************************************************************************************/

		function addOrganization(){
			$('#industryDropDown').html('');
			$('#subHeadingFormName').hide();
			$('#editSuccessDepartmentAttribute').hide();
			$("#editOrganizationAttributeType").hide();
			$("#editDepartmentAttributeType").hide();
			$("#addDepartmentAttribute").hide();
			$("#departmentAttributeTypes").hide();
			//subHeadingFormName
			$("#addOrganizationAttribute").html('');
			$("#addSuccessOrganizationAttribute").hide();
			$("#addOrganizationAttributes").hide();
			$("#listGeneralDepartmentAttributeTab").html('');

			var divId = $('#addOrganizationAttribute');
			var divIdToHide = "addOrganizationAttribute";
			divIdToHide = "'"+divIdToHide+"'";
			
			appendDivId = "page-wrapper";
			appendDivId = "'"+appendDivId+"'";
			
			allDropDown();
			var html="";
			html+='<div id="addOrganizationAttribute"  class="col-sm-12">'
			/*	+'<div class="alert alert-success" style="display: none;" id="addSuccessOrganizationAttribute">'
				+'<img alt="../" src="../resources/images/done.png">Organization Attribute Type Created Successfully'
				+'</div>'*/
				+'<div class="alert alert-danger" style="display: none;" id="addErrorOrganizationAttribute">'
				+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check it'
				+'</div>'
			
			+'<div class="SubHeading addAdminForm col-xs-14 row">'
		    +'<div class="col-sm-12 Action_heading">'
		    +'<h4>Add Organization Attribute</h4>'
		    +'</div>';
			
			html+='<div  id="industrySegmentDropDown">'
				+'</div>'
				+'<div  id="segmentCategoryDrop">'
				+'</div>'
				+'<div  id="organizationDropDown">'
				+'</div>'
				
				//Add Organization Static Single value
				+'<form class="col-md-9 row" role="form">'
				+'<div class="col-sm-5" id="Add-attributeKey-Error">'
				//+'<div class="col-sm-3">'
				+'<label class="control-label" for="Attribute Key">Attribute Key<font style="color: #a94442">*</font></label>'
				+'<span style="color: #a94442" id="attributeKey-span-Error" class="help-inline"></span>'
				+'<input type="text" class="form-control input-sm" name="addOrganizationAttributeKeyArray" id="attributeKey_'+count+'" placeholder="Attribute Key" maxlength="50">'
				//+'<span class="glyphicon glyphicon-remove form-control-feedback" style="display: none;" id="attributeKeyError">Error</span>'
				+'</div>'
				
				+'<div class="form-group input-group col-sm-5 col-sm-offset-1" id="addOrganizationAttributeKeys">'
				+'<div>'
				+'<label for="Attribute Key Type">Attribute Key Type</label>'
				+'<select class="form-control input-sm col-sm-3" name="OrganizationAttributeKey" id="attributeKeyType_'+count+'">'
				+'<option value="Numeric">Numeric</option>'
				+'<option value="Alphabetic">Alphabetic</option>'
				+'<option value="MediaType">MediaType</option>'
				+'</select>'
				+'</div>'
				+'</div>'

				//to Append table
				+'<div id="organization"></div>'

				+'<div class="form-group input-group col-sm-12" style="margin-left: 15px;">'
				+'<button type="button" class="btn btn-default btn-xs float-left" id="OrganizationType" onclick="addOrganizationAttribute()"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Organization Attribute</button>'
				+'</div>'
				
				+'<button type="button" class="btn btn-primary" id="saveorganizationType" onclick="saveOrganizationAttribute()" style="margin-left: 15px;">Save</button>'
				+'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
			    
			    +'</form>'
			    +'</div>'
				+'</div>';
			$("#addOrganizationAttribute").append(html);
			$("#addOrganizationAttribute").show();
			scrollDown(divId);
		}

/****************************************************************************************************************************************************
***************************** Industry Segment DropDown***************************************************************************************************
*****************************************************************************************************************************************************/

		function allDropDown()
		{
			$("#industrySegmentDropDown").html('');
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/list.htm",
				dataType: "json",
				success: function(data){ 

					var html="";

					html+='<div id="industryTypeDrop" class="form-group">';
					html+='<div class="col-sm-2">';
					//html+=' <input type="button" class="btn btn-default btn-xs" id="viewList" onclick="getvals()" value="View" />';
					html+=	'<br>';
					html+=	'<label for="Industry">Industry Type<select id="selectedIndustryTypeDrop" class="form-control input-sm" onchange="getSegmentDrop()">';
					html+=	'<option value="0">ALL</option>';

					for(var i=0;i<data.length;i++)
					{
						html+='<option value='+data[i].id+'>'+data[i].industryType+'</option>';
					}

					html+=	'</select>';
					html+=	'</div>';

					html+='<div id="segmentCategorydrop" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="SegmentCategory">Segment Category<select class="form-control input-sm id="selectedSegmentCategoryDrop">';
					html+=	'<option value="0">ALL</option>';
					html+='</select>';
					html+=	'</div>';
					html+='</div>';

					html+='<div id="organizationDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="OrganizationCategory">Organization Type<select class="form-control input-sm" id="selectedOrganizations">';
					html+=	'<option value="0">ALL</option>';
					html+='</select>';
					html+='</div>';
					html+='</div>';

					$("#industrySegmentDropDown").append(html);
					$("#industrySegmentDropDown").show();

				}});}

		function getSegmentDrop()
		{	
			$("#segmentCategorydrop").empty();
			var selectedIndustryType=$("#selectedIndustryTypeDrop").val();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/lists.htm?id="+selectedIndustryType,
				dataType: "json",
				success: function(data){ 

					$('#selectedOrganizations').val("0");
					$('#selectedOrganizations') .prop("disabled", true);

					var html="";
					html+='<div id="segmentCategorydrop" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategoryValue" onchange="getOrganization()">';
					html+=	'<option value="0">ALL</option>';
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].segmentCategory+'</option>';
					}
					html+='</select>';
					html+='</div>';
					html+='</div>';

					$("#segmentCategorydrop").append(html);
					$("#segmentCategorydrop").show();

				}});
		}

		function getOrganization()
		{
			$("#organizationDropDown").html('');

			var selectedSegmentTypeId = $('#selectedSegmentCategoryValue').val();
			$("#organizationDropDown").empty();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listOrganization.htm?id="+selectedSegmentTypeId,
				dataType: "json",
				success: function(data){ 
					var html="";

					html+='<div id="organizationDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="Organization">Organization Type<select id="selectedOrganizations" class="form-control input-sm"></label>';
					html+=	'<option  value="0">ALL</option>';
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].organizationType+'</option>';
					}
					html+=	'</select>';
					html+=	'</div>';
					html+=	'</div>';
					$("#organizationDropDown").append(html);
					$("#organizationDropDown").show();
				}

			});}


/********************************************************************************************************************************************
***************************** A d d/S a v e***************************************************************************************************
**********************************************************************************************************************************************/
		function saveOrganizationAttribute()
		{
			var attributeKey=[];
			var attributeKeyType=[];
			$('#Add-attributeKey-Error').removeClass('has-error has-feedback');
			$('.help-inline').html('');
			$('#addSuccessOrganizationAttribute').hide();
			$('input[name="addOrganizationAttributeKeyArray"]').each(function() {
				attributeKey.push($(this).val());
			});
			var count = 0;
			$('#addOrganizationAttributeKeys select').each(function(){
				$('#attributeKeyTypes_'+count+' option:selected').val();
				attributeKeyType.push($(this).val());
				count++;
			});
			var selectedIndustryId=$('#selectedIndustryTypeDrop').val();
			var selectedSegmentId=$('#selectedSegmentCategoryValue').val();
			var selectedOrganizationId=$('#selectedOrganizations').val();

			$('.help-inline').html('');
			$('#OrganizationType-Error').removeClass('has-error has-feedback');
			if(selectedIndustryId==0 || selectedSegmentId==0 || selectedOrganizationId==0 )
			{
				alert("please select Industry Type,Segment Category & Organization Type DropDown");
				return false;
			}else{

				var JSONObject = {};
				JSONObject['organizationTypeId'] = $('#selectedOrganizations option:selected').val();

				$.post("../industryTypeMaster/saveOrganizationAttribute.htm?listOfAttribute="+attributeKey+"&listOfAttributeType="+attributeKeyType,JSONObject,function(response){console.log(response);
				if(response.status=="SAVE_ERROR"){
					$('#addErrorOrganizationAttribute').show(600);
					for(var i=0;i<response.errorMessageList.length;i++){
						var fieldName = response.errorMessageList[i].fieldName;
						var errorMessage = response.errorMessageList[i].message;
						$('#'+fieldName+'-span-Error').html(errorMessage);
						$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
						$('#page-wrapper').unmask();
					}	
				}else if(response.status=="SAVE_SUCCESS"){
					$('#addErrorOrganizationAttribute').hide();
					hideForm('newIndustryTypeOrganization','page-wrapper');
					organizationAttributeSaveList();
					$('#addSuccessOrganizationAttribute').show(600);
					$('#addPoiForm').trigger("reset");
					
				}else{
				}
				$('#page-wrapper').unmask();
				},'json').fail(function(response){
					alert(response.statusText+"********"+response.status);
				});
				$('#addOrganizationAttributes').removeAttr('disabled');
				return false; 

			}}

/********************************************************************************************************************************************
*************************** Edit Form FOR ORGANIZATION ATTRIBUTE ************************************************************************************************************
**********************************************************************************************************************************************/

		function editAddOrganizationAttribute(){
			count=count+1;  
			var html="";
			html+='<div class="form-group row" id="editdepartment-Error">'
				+'<div class="col-sm-3">'
				+'<input type="text"  id="attributeKeys_'+count+'" name="editOrganization" placeholder="Attribute Key" maxlength="50">&nbsp&nbsp&nbsp'
				+'</div>'
				+'<div class="row col-sm-3">'
				//+'<label for="Attribute Key Type">Attribute Key Type'
				+'<select class="form-control input-sm" name="organizationsType"  id="attributeKeyTypes_'+count+'">'
				+'<option  value="Numeric">Numeric</option>'
				+'<option  value="Alphabetic">Alphabetic</option>'
				+'<option  value="MediaType">MediaType</option>'
				+'</select>'

				//+'<input type="text"  id="attributeKeyTypes_'+count+'" name="department" placeholder="Attribute Key Type" maxlength="50">'
				+' </div>'
				+' </div>';
			+'</table>';
			$("#editDepartments").append(html);    
		}

/********************************************************************************************************************************************
************************** E d i t ORGANIZATION ATTRIBUTE************************************************************************************************************
**********************************************************************************************************************************************/

		function editOrganizationAttribute(id){
			$('#page-wrapper').mask('Loading...');
			selectedCheckBoxes = [];
			$('#industryDropDown').html('');
			$('#editSuccessDepartmentAttribute').hide();//@m
			$('#addSuccessOrganizationAttribute').hide();//@m
			
			$("#addOrganizationAttributes").html(''); 
			$("#addOrganizationAttribute").html('');
			$("editOrganizationType-Error").html('');
			$("#editOrganizationAttributeType").empty();
			$("#dataTableOrganizationAttribute").hide();
			var divId = $("#editOrganizationAttributeType");
			var divIdToHide = "editOrganizationAttributeType";
			divIdToHide = "'"+divIdToHide+"'";
			var appendDivId = "page-wrapper";
			appendDivId = "'"+appendDivId+"'";
			selectedCheckBoxes.pop(id);
			selectedCheckBoxes.push(id);
			checkBoxLength();

			if(selectedCheckBoxes.length>1){
				alert("You can edit only one record at a time");
				return false;
			}else if(selectedCheckBoxes.length==0){
				alert("Please select a record");
				return false;
			}else{
				$.ajax({
					type: "GET",
					url: "../industryTypeMaster/getEditDataOrganizationAttribute.htm?id="+selectedCheckBoxes,
					dataType: "json",
					success: function(data){console.log(data);
					$('#page-wrapper').unmask();
					
					var html="";
					html+='<div  id="editOrganizationAttributeType" class="row">'
						+'<div class="alert alert-danger" style="display: none;"	id="editErrorDepartmentAttributeDiv">'
						+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check'
						+'</div>';
						addOrganizationAttributes(id);

			   html +='<div class="SubHeading addAdminForm col-xs-14 row" id="editOrganizationAttribute">'  //@r
				    +'<div class="col-sm-12 Action_heading" id="editHeaderMessage">'
				    +'<h4>Edit Organization Attribute</h4>'
				    +'</div>'
					+'<div id="addOrganizationAttributes"></div>';	
					html +='<div class="form-group col-xs-12" id="editOrganizationType-Error" style="margin-top:-10px">';
					for(var i=0;i<data.length;i++)
					{
						html +='<input type="hidden" value='+data[i].id+' name="editOrganizationHiddenIds" id="editOrganizationHiddenId" >';
						html+='<div class="col-sx-12">';
						html+='<div class="col-sm-4">';
						html+=	'<label for="Attribute Key">Attribute Key<font style="color: #a94442">*</font></label>';
						html+=	'<span style="color: #a94442" id="editOrganizationType-span-Error" class="help-inline"></span>';
						html+=	'<input type="text" class="form-control input-sm" name="editOrganization"  id="attributeKeys_'+i+'" placeholder="Attribute Key" value="'+data[i].attributeKey+'" maxlength="50" style="width:100%">';
						html+='</div>';
						
						html+='<div class="col-sm-6">';
						html+='<label for="Attribute Key Type">Attribute Key Type'						
						+	'<select class="form-control input-sm" name="organizationsType" value="'+data[i].attributeKeyType+'"  id="attributeKeyTypes_'+i+'"  style="width:100%">'
						+			'<option  value="Numeric">Numeric</option>'
						+			'<option value="Alphabetic">Alphabetic</option>'
						+  			'<option  value="MediaType">MediaType</option>'
						+		'</select>'
						+	'</label>'
						+'</div>';
					}

					html+='<div id="editDepartments">'
						+'</div>'
						+'</div>'
						+'</div>'
						+'<div class="form-group col-sm-4" style="margin-left:15px">'
						+'<button type="button" class="btn btn-primary"  id="editDepartmentType" onclick="updateOrganizationAttributeType()" style="margin-right:10px">Update</button>'
						+'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')" style="margin-right:10px">'
						+'</div>'
					+'</div>'
					+'</div>';
					
					$("#editOrganizationAttributeType").append(html);
					$("#editOrganizationAttributeType").show();
					scrollDown(divId);
					},error:function(url,status,er) { 
						console.log("error: "+url+" status: "+status+" er:"+er);
						var html="Error in getting data.";
						$("#editOrganizationAttributeType").append(html);
					}
				});
			}
		}

/********************************************************************************************************************************************
************************** Edit Form FOR Department ATTRIBUTE ************************************************************************************************************
**********************************************************************************************************************************************/

		function editAddDepartmentAttribute(){
			count=count+1;  
			var html="";
			html+='<table id="myTable" border="1">'
				+'<div class="form-group" id="editAddDepartment-Error">'
				+'<div class="col-lg-3">'
				+'<tr>'
				+'<input type="text"  id="attributeKeys_'+count+'" name="department" placeholder="Attribute Key" maxlength="50">&nbsp&nbsp&nbsp'
				+'<label for="Attribute Key Type">Attribute Key Type<select class="form-control" name="editDepartments"  id="attributeKeyTypes_'+count+'">'
				+'<option  value="Numeric">Numeric</option>'
				+'<option value="Alphabetic">Alphabetic</option>'
				+'<option value="MediaType">MediaType</option>'
				+'</select>'
				+'</tr>'
				+' </div>'
				+' </div>';
			+'</table>';
			$("#editDepartmentss").append(html);    
		}

/********************************************************************************************************************************************
************************** U p d a t e Organization Attribute Type************************************************************************************************************
**********************************************************************************************************************************************/
		function updateOrganizationAttributeType(){
			$('#page-wrapper').mask();//@m
			$('#editSuccessDepartmentAttribute').hide();
			$('#editErrorDepartmentAttributeDiv').hide();
			$('.help-inline').html('');
			$('#editOrganizationType-Error').removeClass('has-error has-feedback');
			var organizationTypeId = $("#selectedOrganizationAttributes").val();
			var editAttributeKeysOrganization=[];
			var editAttributeTypesOrganization= [];
			var editDepartmentTypeIdsOrganization=[];
			//listOfOrganizationIds
			$('input[name="editOrganizationHiddenIds"]').each(function() {	
				editDepartmentTypeIdsOrganization.push($(this).val());
			});
			//attribute keys
			$('input[name="editOrganization"]').each(function() {
				editAttributeKeysOrganization.push($(this).val());
			});
			//attribute Key Type
			var count = 0;
			$('#editOrganizationAttributeType select').each(function(){
				$('#attributeKeyTypes_'+count+' option:selected').val();
				editAttributeTypesOrganization.push($(this).val());
				count++;
			});

			if(organizationTypeId==0)
			{
				alert("please select Organization Type");
				return false;
			}else{

				var JSONObject = {};
				JSONObject['organizationTypeId'] = organizationTypeId;

				var organizationAttribute={'listOfOrganizationIds':editDepartmentTypeIdsOrganization,'organizationTypeId':organizationTypeId,'listOfAttribute':editAttributeKeysOrganization,'listOfAttributeType':editAttributeTypesOrganization};
				$.ajax({
					url: "../industryTypeMaster/postEditOrganizationAttribute.htm", 
					type: 'POST', 
					data: JSON.stringify(organizationAttribute), 
					contentType: 'application/json',
					success: function(validationResponse) { 

						if(validationResponse.status=="UPDATE_SUCCESS"){
							$('#editErrorDepartmentAttributeDiv').hide();
							$('#editSuccessDepartmentAttribute').show(600);
							hideForm('editOrganizationAttributeType','page-wrapper');
							$('#editOrganizationAttributeType').trigger("reset");
							updateOrganizationAttributeList();

						}else if(validationResponse.status=="UPDATE_ERROR"){
							$('#editErrorDepartmentAttributeDiv').show(600);
							for(var i=0;i<validationResponse.errorMessageList.length;i++){
								var fieldName = validationResponse.errorMessageList[i].fieldName;
								var errorMessage = validationResponse.errorMessageList[i].message;
								$('#'+fieldName+'-span-Error').html(errorMessage);
								$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
								$('#page-wrapper').unmask();
							}	

						}}
				}); }}

/********************************************************************************************************************************************
************************** DELETE ATTRIBUTES Organizatiuon ********** **************************************************************************************************
**********************************************************************************************************************************************/
		function deleteOrganizationAttributeTypes(){
			$('#errorAttributeDiv').hide();
			$('#successAttributeDiv').hide();
			$('#editSuccessDepartmentAttribute').hide();
			$('#addSuccessOrganizationAttribute').hide();
			$('#deleteSuccessDepartmentAttributeDivs').hide();
			var selectedCheckBox=[];
			var checkBoxes = document.getElementsByTagName('input');
			var param = "";
			for (var counter=1; counter < checkBoxes.length; counter++) {

				if (checkBoxes[counter].type.toUpperCase()=='CHECKBOX' && checkBoxes[counter].checked == true) {
					if(counter==1 || counter==checkBoxes.length){
						param+=checkBoxes[counter].value;
					}else{
						param=param+","+checkBoxes[counter].value;
					}}
			        }

			var params=(param.slice(1, param.length));
			selectedCheckBox.push(params);
			checkBoxLength();
			
			if(params.length>0){
				if(confirm("Do you want to delete selected record(s) It will delete all associated data?"))
				{
					
						var org = params.search("org");
						var ids = [];
						params = params.split(",");
						if(!(org<=-1)){
							for(var i=0;i<params.length;i++){
								ids.push(params[i].replace("org",","));
							}
							$.get("../industryTypeMaster/deleteOrganizationAttribute.htm?ids="+ids,function(response){
								
								if(response.status=="DELETE_SUCCESS"){  
									selectedCheckBoxes=[];
									var tempHtml = listGeneralAttributeResponse(response);
									$('#listGeneralAttributeTab').append(tempHtml);
									$('#organizationTables').dataTable({responsive:true});
									$('#deleteSuccessAttributeDivs').show(600);
									$('#page-wrapper').unmask();
									var selectedOrganizationValue=$('#selectedOrganizationType').val();
									var selectedDepartmentValue=$('#selectedDepartmentType').val();
									if(selectedOrganizationValue==0 || selectedDepartmentValue==0){
										$("#selectedOrganizationType option:first").attr("selected", true);
										$("#selectedDepartmentType option:first").attr("selected", true);
									}else{
										$('#organizationType option:selected').remove();
										$('#departmentType option:selected').remove();
										$("#selectedOrganizationType option:first").attr("selected", true);
										$("#selectedDepartmentType option:first").attr("selected", true);
									}
								}
								else{
									$('#page-wrapper').mask('<font style="color:red;">'+response.errorMessage+'</font>');
								}
								return false;
							});
							
						}else{
							for(var i=0;i<params.length;i++){
								ids.push(params[i].replace("dept",","));
							}
							
							$.get("../industryTypeMaster/deleteDepartmentAttribute.htm?ids="+ids,function(response){
								if(response.status=="DELETE_DEPARTMENT_SUCCESS"){
									selectedCheckBoxes=[];
									$('#listGeneralAttributeTab').html('');
									$('#listGeneralDepartmentAttributeTab').html('');
									var tempHtml = listGeneralDepartmentAttributeResponse(response);
									$('#listGeneralDepartmentAttributeTab').append(tempHtml);
									$('#departmentTable').dataTable({responsive:true});
									$('#deleteSuccessDepartmentAttributeDivs').show(600);
									$('#addDepartmentTypeForm').trigger("reset");
									$('#organizationTables_wrapper').hide('');//@m
								}
								else if(response.status=="DELETE_ERROR")
								{
									$('#errorAttributeDiv').show(600);
									$('#successAttributeDiv').hide;
									$('#addDepartmentTypeForm').trigger("reset");
									$('#departmentTypeError').removeClass('has-error has-feedback');
									$('#DepartmentTypeTypeError').hide();				  
								}else{
									// alert(response.status);
								}
								return false;
							});
						
						}
						
					/*$.get("../industryTypeMaster/deleteOrganizationAttribute.htm?ids="+ids,function(response){
							
						if(response.status=="DELETE_SUCCESS"){  
							selectedCheckBoxes=[];
							var tempHtml = listGeneralAttributeResponse(response);
							$('#listGeneralAttributeTab').append(tempHtml);
							$('#organizationTables').dataTable({responsive:true});
							$('#deleteSuccessAttributeDivs').show(600);
							$('#page-wrapper').unmask();
							var selectedOrganizationValue=$('#selectedOrganizationType').val();
							var selectedDepartmentValue=$('#selectedDepartmentType').val();
							if(selectedOrganizationValue==0 || selectedDepartmentValue==0){
								$("#selectedOrganizationType option:first").attr("selected", true);
								$("#selectedDepartmentType option:first").attr("selected", true);
							}else{
								$('#organizationType option:selected').remove();
								$('#departmentType option:selected').remove();
								$("#selectedOrganizationType option:first").attr("selected", true);
								$("#selectedDepartmentType option:first").attr("selected", true);
							}
						}
						else{
							$('#page-wrapper').mask('<font style="color:red;">'+response.errorMessage+'</font>');
						}
						return false;
					});*/
				} 
			}else{
				$('#editSuccessDepartmentAttribute').hide();
				$('#addSuccessOrganizationAttribute').hide();
				$('#deleteSuccessDepartmentAttributeDivs').hide();
				alert("Please Select at least one item");
			}
		}

/********************************************************************************************************************************************
************************** A D D ATTRIBUTES Department Dropdown********** **************************************************************************************************
**********************************************************************************************************************************************/
		function addDepartmentAttributes(departmentId){
			var selectedOrganizationType=$('#selectedOrganizationType').val();
			$('#listGeneralAttributeTab').html('');
			$("#addOrganizationAttribute").hide();
			$("#addOrganizationAttributes").hide();
			$("#dataTableOrganizationAttribute").hide();
			$("#departmentAttributeTypes").html('');

			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listDepartment.htm?id="+selectedOrganizationType,
				dataType: "json",
				success: function(data){ 
					var html="";
					html+='<div id="departmentAttributeTypes" class="col-sm-4">';
					html+='<div id="addDepartmentAttribute" class="form-group">';
					html+=	'<label for="DepartmentCategory">Department Type<select disabled="disabled" class="form-control" id="selectedDepartmentAttribute">';				
					//alert(departmentId);
					for(var i=0;i<data.length;i++){
						var attributeId=data[i].id;
						var departmentName=data[i].departmentType;
						if(attributeId==departmentId){
						html+=	'<option value='+attributeId+'>'+departmentName+'</option>';
						break;
						}
					}
					html+='</select>';
					html+='</div>';

					$("#addDepartmentAttribute").append(html);
					$("#addDepartmentAttribute").show();
				}}
			);}

		function addDepartmentAttribute(){
			count=count+1;  
			var html="";
			html+= '<div class="form-group input-group col-sm-4" id="department-Error">'
				+'<div class="col-sm-7">'
				+'<input type="text" class="form-control input-sm"  id="attributeKeyses_'+count+'" name="addAttributeKeyArray" placeholder="Attribute Key" maxlength="50">'
				+'<span class="input-group-btn">'
				+'</div>'
				+'<div class="row col-sm-4">'
				+'<select class="form-control input-sm" name="addAttributeKeyTypeArray"  id="attributeKeyTypeses_'+count+'">'
				+'<option name="addAttributeKeyTypeArray" value="Numeric">Numeric</option>'
				+'<option name="addAttributeKeyTypeArray" value="Alphabetic">Alphabetic</option>'
				+'<option name="addAttributeKeyTypeArray" value="MediaType">MediaType</option>'
				+'</select>'
				+'</div>'

				+'<button type="button" class="btn btn-default btn-sm" id="DepartmentTypeDelete'+count+'" onclick="deleteDepartmentTextBox('+count+')"><i class="glyphicon glyphicon-trash"></i>'
				+'</button>'
				+'</span>'
				+' </div>';
			$("#departments").append(html);    
		}

		function deleteDepartmentTextBox(count)
		{
			$("#attributeKeyses_"+count).parent().remove();
			$("#attributeKeyTypeses_"+count).parent().remove();
			$("#DepartmentTypeDelete"+count).parent().remove();
			count--;
		}

/********************************************************************************************************************************************
************************** ADD ATTRIBUTES Department Dropdown********** **************************************************************************************************
**********************************************************************************************************************************************/
		function addDepartments()
		{
			$('#listGeneralAttributeTab').html('');
			$('#subHeadingFormName').html('');
			$('#editSuccessDepartmentAttribute').hide();
			$('#showAttributesData').html('');
			$("#addOrganizationAttribute").html('');
			$("#addOrganizationAttributes").html('');
			$("#uploadExcel").html('');
			$("#editOrganizationAttribute").html('');
			$("#editDepartmentAttribute").html('');
			$("#editDepartmentAttributeType").html('');
			$("#addDepartmentAttribute").html('');
			showAllDropDown();
			var divId = $('#addDepartmentAttribute');
			var divIdToHide = "addDepartmentAttribute";
			divIdToHide = "'"+divIdToHide+"'";
			appendDivId = "page-wrapper";
			appendDivId = "'"+appendDivId+"'";
			var html="";
			//Add Organization Static Single value
			html+='<div id="addDepartmentAttribute"  class="col-sm-12">'
				+'<div class="alert alert-danger" style="display: none;" id="addDepartmentErrorDiv" style="margin-bottom:50px;">'
				+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check It'
				+'</div>'
               /* +'<div class="alert alert-success" style="display: none;" id="addSuccessDepartmentAttribute">'
				+'<img alt="../" src="../resources/images/done.png">Department Attribute Type Created Successfully'
				+'</div>'*/
                
                +'<div class="SubHeading addAdminForm col-xs-14 row">'
    		    +'<div class="col-sm-12 Action_heading">'
    		    +'<h4>Add Department Attribute</h4>'
    		    +'</div>';
    		    
    	 html+='<div  id="industryMasterDropDown">'
				+'</div>'

			    +'<form class="col-sm-14 row" role="form">'
			    +'<div class="col-sm-12" id="OrganizationType-Error">'
				+'<div class="col-sm-5" id="Add-attributeKey-Error">'
				+'<label class="control-label" for="Attribute Key">Attribute Key<font style="color: #a94442">*</font></label>'
				+'<span style="color: #a94442" id="attributeKey-span-Error" class="help-inline"></span>'
				
				+'<input type="text" class="form-control input-sm" name="addAttributeKeyArray" id="attributeKeyses_'+count+'" placeholder="Attribute Key" maxlength="50">'
				+'</div>'
				
				+'<div class="form-group input-group col-sm-4 col-sm-offset-1">'
				+'<div>'
				+'<label for="Attribute Key Type">Attribute Key Type</label>'
				+'<select class="form-control input-sm col-sm-3" name="addAttributeKeyTypeArray"  id="attributeKeyTypeses_'+count+'">'
				+'<option name="addAttributeKeyTypeArray" value="Numeric">Numeric</option>'
				+'<option name="addAttributeKeyTypeArray" value="Alphabetic">Alphabetic</option>'
				+'<option name="addAttributeKeyTypeArray" value="MediaType">MediaType</option>'
				+'</select>'

				+'</div>'
				+'</div>'

				//append table
				+'<div id="departments"></div>'
				+'<div class="form-group input-group col-sm-12" style="margin-left: 15px;">'
				+'<button type="button" class="btn btn-default btn-xs float-left" id="DepartmentType" onclick="addDepartmentAttribute()" value="Add Another Department Attribute"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Organization Attribute</button>'
				+'</div>'
				/*+'<div class="form-group col-sm-12">'
				+'<input type="button" class="btn btn-primary col-sm-6"  onclick="saveDepartmentAttribute()" value="Save">';
			    +'</div>'*/
				+'<button type="button" class="btn btn-primary" onclick="saveDepartmentAttribute()" style="margin-left: 15px;">Save</button>'
				+'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
			    
			    +'</form>'
			    +'</div>'
			    +'</div>'
				+'</div>';
			
			$("#addDepartmentAttribute").append(html);
			$("#addDepartmentAttribute").show();	
			scrollDown(divId);
		}

		function showAllDropDown()
		{
			$("#industryMasterDropDown").html('');	

			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/list.htm",
				dataType: "json",
				success: function(data){ 

					var html="";

					html+='<div id="industryDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					//html+=' <input type="button" class="btn btn-default btn-xs" id="viewList" onclick="getvals()" value="View" />';
					html+=	'<br>';
					html+=	'<label for="Industry">Industry Type<select id="selectedIndustryDropDownType" class="form-control input-sm" onchange="segmentDropDown()">';
					html+=	'<option value="0">ALL</option>';
					for(var i=0;i<data.length;i++)
					{
						html+=	'<option value='+data[i].id+'>'+data[i].industryType+'</option>';
					}
					html+=	'</select>';
					html+=	'</div>';

					html+='<div id="segmentCategoryDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategoryDropDown">';
					html+=	'<option value="0">ALL</option>';
					html+='</select>';
					html+=	'</div>';
					html+='</div>';


					html+='<div id="organizationDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="OrganizationCategory">Organization Type<select class="form-control input-sm" id="selectedOrganizationTypeDropDown">';
					html+=	'<option value="0">ALL</option>';
					html+='</select>';
					html+='</div>';
					html+='</div>';


					html+='<div id="departmentDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="DepartmentType">Department Type<select class="form-control input-sm" id="selectedDepartmentTypeDropDown">';
					html+=	'<option value="0">ALL</option>';
					html+='</select>';
					html+='</div>';
					html+='</div>';

					$("#industryMasterDropDown").append(html);
					$("#industryMasterDropDown").show();

				}});}

		function segmentDropDown()
		{	
			$("#segmentCategoryDropDown").empty();
			$("#segmentCategoryDropDown").html('');

			var selectedIndustryType=$("#selectedIndustryDropDownType").val();

			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/lists.htm?id="+selectedIndustryType,
				dataType: "json",
				success: function(data){ 

					$('#selectedDepartmentTypeDropDown').val("0");
					$('#selectedDepartmentTypeDropDown') .prop("disabled", true);
					$('#selectedOrganizationDropDown').val("0");
					$('#selectedOrganizationDropDown') .prop("disabled", true);

					var html="";
					html+='<div id="segmentCategoryDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategoryDropDown" onchange="organizationTypeDropDown()">';
					html+=	'<option value="0">ALL</option>';
					
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].segmentCategory+'</option>';
					}

					html+='</select>';
					html+='</div>';
					html+='</div>';

					$("#segmentCategoryDropDown").append(html);
					$("#segmentCategoryDropDown").show();
					$("#industryDropDown").show();

				}});
		}

		function organizationTypeDropDown()
		{

			$('#organizationDropDown').html('');

			var selectedSegmentTypeId = $('#selectedSegmentCategoryDropDown').val();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listOrganization.htm?id="+selectedSegmentTypeId,
				dataType: "json",
				success: function(data){ 
					var html="";
					html+='<div id="organizationDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="Organization">Organization Type<select id="selectedOrganizationDropDown" class="form-control input-sm" onchange="departmentTypeDropDown()"></label>';
					html+=	'<option  value="0">ALL</option>';
					for(var i=0;i<data.length;i++){

						html+=	'<option value='+data[i].id+'>'+data[i].organizationType+'</option>';
					}
					html+=	'</select>';
					html+=	'</div>';
					html+=	'</div>';
					$("#organizationDropDown").append(html);
					$("#organizationDropDown").show();

				}});}

		function departmentTypeDropDown()
		{
			$("#departmentDropDown").empty();
			$("departmentDropDown").html('');
			var selectedOrganizationId=$("#selectedOrganizationDropDown").val();

			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listDepartment.htm?id="+selectedOrganizationId,
				dataType: "json",
				success: function(data){ 

					var html="";

					html+='<div id="departmentDropDown" class="form-group">';
					html+='<div class="col-sm-2">';
					html+=	'<br>';
					html+=	'<label for="DepartmentType">Department Type<select class="form-control input-sm" id="selectedDepartmentTypeDropDown">';
					html+=	'<option value="0">ALL</option>';
					for(var i=0;i<data.length;i++){

						html+=	'<option value='+data[i].id+'>'+data[i].departmentType+'</option>';
					}
					html+='</select>';
					html+='</div>';
					html+='</div>';

					$("#departmentDropDown").append(html);
					$("#departmentDropDown").show();
				}}
			);}

/********************************************************************************************************************************************
************************** A D D ATTRIBUTES DEPARTMENT ATTRIBUTE********** **************************************************************************************************
**********************************************************************************************************************************************/
		function saveDepartmentAttribute(){
			var attributeKeys=[];
			var attributeTypes= [];
			//$('#addSuccessDepartmentAttribute').html('');
			$('.help-inline').html('');
			$('#DepartmentType-Error').removeClass('has-error has-feedback');

			var selectedindustryType=$('#selectedIndustryDropDown').val();
			var selectedSegmentType=$('#selectedSegmentCategoryDropDown').val();
			var selectedOrganizationType=$('#selectedOrganizationDropDown').val();
			var selectedDepartmentType=$('#selectedDepartmentTypeDropDown').val();

			$('input[name="addAttributeKeyArray"]').each(function() {
				attributeKeys.push($(this).val());
			});
			var count = 0;
			$('#addDepartmentAttribute select').each(function(){
				$('#attributeKeyTypes_'+count+' option:selected').val();
				attributeTypes.push($(this).val());
				count++;
			});
			if(selectedindustryType==0 || selectedSegmentType==0 || selectedOrganizationType==0 || selectedDepartmentType==0 ){
				alert("Please select industryType,SegmentType,organizationType & DepartmentType");
				return false;
			}else{
				var departmentTypeId=$('#selectedDepartmentTypeDropDown option:selected').val();
				var JSONObject = {};
				JSONObject['orgnizationTypeId'] = selectedDepartmentType;
				JSONObject['departmentTypeId'] = departmentTypeId;
				$.post("../industryTypeMaster/saveDepartmentAttribute.htm?listOfAttribute="+attributeKeys+"&listOfAttributeType="+attributeTypes,JSONObject,function(validationResponse){console.log(validationResponse);
				if(validationResponse.status=="SAVE_ERROR"){
					$('#addDepartmentErrorDiv').show(600);
					for(var i=0;i<validationResponse.errorMessageList.length;i++){
						var fieldName = validationResponse.errorMessageList[i].fieldName;
						var errorMessage = validationResponse.errorMessageList[i].message;
						$('#'+fieldName+'-span-Error').html(errorMessage);
						$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
						$('#page-wrapper').unmask();
				}}else if(validationResponse.status=="SAVE_SUCCESS"){
					$('#addDepartmentErrorDiv').hide();
					$('#addSuccessDepartmentAttribute').show(600);
					hideForm('addDepartmentAttribute','page-wrapper');
					saveDepartmentAttributelistAll();
					$('#addDepartmentForm').trigger("reset");
					
				}else{
					//alert(validationResponse.status);
				}
				$('#page-wrapper').unmask();
				},'json').fail(function(validationResponse){
					$('#page-wrapper').mask(validationResponse.status+"**************"+validationResponse.statusText);
				});
				return false;

			}

		}//End Of Method

/********************************************************************************************************************************************
************************** DELETE ATTRIBUTES Department ********* **************************************************************************************************
**********************************************************************************************************************************************/
		function deleteDepartmentAttributeTypes()
		{
			$('#errorAttributeDiv').hide();
			$('#successAttributeDiv').hide();
			$('#addSuccessOrganizationAttribute').hide();
			$('#editSuccessDepartmentAttribute').hide();
			$('#deleteSuccessDepartmentAttributeDivs').hide();
			var selectedCheckBoxes=[];
			var checkBoxes = document.getElementsByTagName('input');
			var param = "";
			for (var counter=1; counter < checkBoxes.length; counter++) {

				if (checkBoxes[counter].type.toUpperCase()=='CHECKBOX' && checkBoxes[counter].checked == true) {
					if(counter==1 || counter==checkBoxes.length){
						param+=checkBoxes[counter].value;
					}else{
						param=param+","+checkBoxes[counter].value;
					}
				}}

			var params=(param.slice(1, param.length));

			selectedCheckBoxes.push(params);
			checkBoxLength();
			if(params.length>0)
			{
				
				
				if(confirm("Do you want to delete selected record(s) It will delete all associated data?"))
				{
					$.get("../industryTypeMaster/deleteDepartmentAttribute.htm?ids="+selectedCheckBoxes,function(response){
						if(response.status=="DELETE_DEPARTMENT_SUCCESS"){
							selectedCheckBoxes=[];
							$('#listGeneralAttributeTab').html('');
							$('#listGeneralDepartmentAttributeTab').html('');
							var tempHtml = listGeneralDepartmentAttributeResponse(response);
							$('#listGeneralDepartmentAttributeTab').append(tempHtml);
							$('#departmentTable').dataTable({responsive:true});
							$('#deleteSuccessDepartmentAttributeDivs').show(600);
							$('#addDepartmentTypeForm').trigger("reset");
							$('#organizationTables_wrapper').hide('');//@m
						}
						else if(response.status=="DELETE_ERROR")
						{
							$('#errorAttributeDiv').show(600);
							$('#successAttributeDiv').hide;
							$('#addDepartmentTypeForm').trigger("reset");
							$('#departmentTypeError').removeClass('has-error has-feedback');
							$('#DepartmentTypeTypeError').hide();				  
						}else{
							// alert(response.status);
						}
						return false;
					});
				}
			} else{
				$('#addSuccessOrganizationAttribute').hide();
				$('#editSuccessDepartmentAttribute').hide();
				$('#deleteSuccessDepartmentAttributeDivs').hide();
				alert("Please select at least one item");
			}
		}


/********************************************************************************************************************************************
************************** E d i t Department ATTRIBUTE************************************************************************************************************
**********************************************************************************************************************************************/

		function editDepartmentAttributeKeys(id){
			
			$('#page-wrapper').mask('Loading...');
			selectedCheckBoxes = [];
			$('#listGeneralAttributeTab').html('');
			$('#editSuccessDepartmentAttribute').hide();//@m
			$("#addDepartmentAttribute").html('');
			$("#editDepartmentAttributeType").html('');
			$("#dataTableOrganizationAttribute").html('');
			$("#departmentAttributeTypes").html('');
			$("#showAttributesData").html('');
			$("#subHeadingFormName").html('');
			var divId = $("#showAttributesData");
			var divIdToHide = "showAttributesData";
			divIdToHide = "'"+divIdToHide+"'";
			var appendDivId = "page-wrapper";
			appendDivId = "'"+appendDivId+"'";
			selectedCheckBoxes.pop(id);
			selectedCheckBoxes.push(id);
			checkBoxLength();
			if(selectedCheckBoxes.length>1){
				alert("You can edit only one record at a time");
				return false;
			}else if(selectedCheckBoxes.length==0){
				alert("Please select a record");
				return false;
			}else{
				$.ajax({
					type: "GET",
					url: "../industryTypeMaster/getEditDataDepartmentAttribute.htm?id="+selectedCheckBoxes,
					dataType: "json",
					success: function(data){console.log(data);
					
					$('#page-wrapper').unmask();
					
					var html="";
					html+='<div id="showAttributesData" class="row">'							
						+'<div class="alert alert-success" style="display: none;"	id="editSuccessDepartmentAttribute">'
						+'<img alt="../" src="../resources/images/done.png">Updated Successfully'
						+'</div>'

						+'<div class="alert alert-danger" style="display: none;"	id="editDepartmentAttributeTypeDiv">'
						+'<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check'
						+'</div>';
						addDepartmentAttributes(id);
					
					html+='<div id="subHeadingFormName" class="SubHeading addAdminForm col-xs-12 row">'
				    +'<div class="col-sm-12 Action_heading">'
				    +'<h4>Edit Department Attribute</h4>'
				    +'</div>'
				    
				    +'<div  id="addDepartmentAttribute"></div>';
				    
					html+='<div class="form-group col-xs-12" id="departmentAttributeTypes">';
					
					for(var i=0;i<data.length;i++)
					{
						html +='<input type="hidden" name="listOfDepartmentIds" value='+data[i].id+' id="editDepartmentHiddenId" >';
						html+='<div class="col-sx-12">';
						html+='<div class="col-sm-4">';
						html+='<label for="Attribute Key">Attribute Key<font style="color: #a94442">*</font></label>';
						html +='<span style="color: #a94442" id="DepartmentTypeAttribute-span-Error" class="help-inline"></span>';
						html+='<input type="text" class="form-control input-sm" name="editDepartments" id="attributeKeys_'+i+'" placeholder="Attribute Key" value="'+data[i].attributeKey+'" maxlength="50">';
						html+='</div>';
						
						html+='<div class="col-sm-6" id="attributekeyTypeArrays">'
							+'<label for="Attribute Key Type">Attribute Key Type'
							+'<select class="form-control input-sm" name="editDepartmentsKeysType"  id="attributeKeyTypes_'+i+'" value="'+data[i].attributeKeyType+'" >'
							+'<option value="Numeric">Numeric</option>'
							+'<option value="Alphabetic">Alphabetic</option>'
							+'<option value="MediaType">MediaType</option>'
							+'</select>'
							+'</label>'
							+'</div>';
							
					}

					    html+='<div id="editDepartmentss">'
						+'</div>'	
					    +'<div class="form-group col-sm-6">'
					    +'<button type="button" class="btn btn-primary" id="editDepartmentType" onclick="updateDepartmentAttributeType()">Update</button>'
						+'&nbsp;<input type="button" class="btn btn-default" value="Cancel" onclick ="hideForm('+divIdToHide+','+appendDivId+')">'
						+'</div>'
						+'</div>'
						+'</div>'
						+'</div>'
						+'</div>';
					
					$("#showAttributesData").append(html);
					$("#showAttributesData").show();

					scrollDown(divId);

					},error:function(url,status,er) { 
						console.log("error: "+url+" status: "+status+" er:"+er);
						var html="Error in getting data.";
						$("#showAttributesData").append(html);
					}
				});
			}
		}


/********************************************************************************************************************************************
************************** U p d a t e Department Attribute Type************************************************************************************************************
***********************************************************************************************************************************************/

		function updateDepartmentAttributeType()
		{
			$('#editDepartmentAttributeTypeDiv').hide();
			$('.help-inline').html('');
			$('#editOrganizationType-Error').removeClass('has-error has-feedback');

			var editAttributeKeys=[];
			var editAttributeTypes= [];
			var editDepartmentTypeIds=[];

			$('#editSuccessDepartmentAttribute').hide();
			var departmentTypeId = $("#selectedDepartmentAttribute").val();

			$('input[name="listOfDepartmentIds"]').each(function() {	
				editDepartmentTypeIds.push($(this).val());
			});

			$('input[name="editDepartments"]').each(function() {
				editAttributeKeys.push($(this).val());
			});


			var count = 0;
			$('#attributekeyTypeArrays select').each(function(){
				$('#attributeKeyTypes_'+count+' option:selected').val();
				editAttributeTypes.push($(this).val());
				count++;
			});

			if(departmentTypeId==0)
			{
				alert("please select Department Type");
			}else{	        	

				var JSONObject = {};
				JSONObject['organizationTypeId'] = departmentTypeId;

				var DepartmentAttributeType={'listOfDepartmentIds':	editDepartmentTypeIds,'departmentTypeId':departmentTypeId,'listOfAttribute':editAttributeKeys,'listOfAttributeType':editAttributeTypes};

				$.ajax({
					url: "../industryTypeMaster/postEditDepartmentAttribute.htm", 
					type: 'POST', 
					data: JSON.stringify(DepartmentAttributeType), 
					contentType: 'application/json',
					success: function(validationResponse) { 
						if(validationResponse.status=="UPDATE_SUCCESS"){
							$('#editSuccessDepartmentAttribute').show(600);
							$('#editDepartmentAttributeTypeDiv').hide();
							hideForm('showAttributesData','page-wrapper');
							updateSuccessDepartmentAttributeList();
							$('#departmentAttributeTypes').trigger("reset");
						}else if(validationResponse.status=="UPDATE_ERROR"){
							$('#editDepartmentAttributeTypeDiv').show(600);
							for(var i=0;i<validationResponse.errorMessageList.length;i++){
								var fieldName = validationResponse.errorMessageList[i].fieldName;
								var errorMessage = validationResponse.errorMessageList[i].message;
								$('#'+fieldName+'-span-Error').html(errorMessage);
								$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
								$('#page-wrapper').unmask();
							}

						}else{
							//alert(validationResponse.status);
						}
						$('#page-wrapper').unmask();
						return false;
					}
				});}}//End Of Method


/********************************************************************************************************************************************
************************** //4th Tab************************************************************************************************************
***********************************************************************************************************************************************/
		function industryExcelUpload()
		{
			$('#industryDropDown').html('');
			$('#listGeneralAttributeTab').html('');
			$('#exportIndustryMasterTab').html('');
			$("#uploadExcel").html('');
			 $("#drop").html('');
			 $("#subHeadingFormName").hide();//@m
			 
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
		    $("#listGeneralDepartmentAttributeTab").html('');
		    $("#add").html('');
			$("#dataTab").html('');
			$("#newIndustryType").html('');
			$("#listOfIndustryType").html('');
			$("#editIndustryType").html('');
			$("#editDepartmentAttributes").html('');
			$('#listGeneralIndustryTab').html('');
			$("#dropDown").html('');
			
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
		$("#uploadExcel").append(html);
		$("#uploadExcel").show();

		}
		
/********************************************************************************************************************************************
************************** industry Excel Upload************************************************************************************************************
***********************************************************************************************************************************************/
		var uploadedIndustryMasterFilePath = "";
		function uploadIndustryMasterExcel(){
			$('#page-wrapper').mask('Loading...');
			  var industryUploadForm = new FormData();
			  industryUploadForm.append("file", file.files[0]);
			  $('#uploadIndustryMasterSpanError').empty();
			  $('#uploadIndustryMasterSpanButton').empty();
			  $('#uploadIndustryMasterSuccessDiv').hide();
			  $('#errorMessage').hide();
			  $.ajax({
			    url: '../industryTypeMaster/importIndustryMasterFile.htm',
			    data: industryUploadForm,
			    dataType: 'json',
			    processData: false,
			    contentType: false,
			    type: 'POST',
			    success: function(response){
			    	console.log(response);
				$("#fileData").val("");
				$('#page-wrapper').unmask();
				$('#errorMessage').html('');
				$('#downloadIndustryMasters').removeAttr('disabled');
				if(response.status=='FILE_EMPTY' || response.status=='FILE_TYPE_ERROR' || response.status=="DUPLICATE" || response.status=="INVALID_EXCEL" || response.status=="EXCEL_DUPLICATE_ERROR" ||  response.status=="FILE_SIZE_ERROR" || response.status=="EXCEL_UPLOAD_ERROR"){
		    		var html = '<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'</strong>';
		    		$('#errorMessage').append(html);
		    		$('#errorMessage').show(600);
		    		if( response.status=="UPLOAD_INDUSTRY_MASTER_EXCEL_ERROR" || response.status=="EXCEL_UPLOAD_ERROR" || response.status=="INDUSTRY_TYPE_MASTER" || response.status=="EXCEPTION_ERROR"){
		    			console.log(response);
		    			$('#downloadIndustryMasters').attr('disabled','disabled');
		    			uploadedIndustryMasterFilePath = response.errorSuccessObject.industryErrorsExcelPath;
		    			var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryMasterErrorsExcelButton" onclick="downloadIndustryMasterErrorsExcel()" value="Download Excel"><br>';
			    		$('#uploadIndustryMasterSpanButton').html(html);
			    		$('#downloadGeneralIndustryMaster').removeAttr('disabled');
		    		}
		    	}else if(response.status=="UPLOAD_SUCCESS"){
		    		console.log(response.errorSuccessObject.industryErrorsExcelPath);
		    		$('#uploadIndustryMasterSuccessDiv').show(600);
		    		$('#downloadIndustryMasters').attr('disabled','disabled');
	    			uploadedIndustryMasterFilePath = response.errorSuccessObject.industryErrorsExcelPath;
	    			var html = 	'<br><input type="button" class="btn btn-info btn-xs" id="downloadIndustryMasterErrorsExcelButton" onclick="downloadIndustryMasterErrorsExcel()" value="Download Excel"><br>';
		    		$('#uploadIndustryMasterSpanButton').html(html);
		    		$('#downloadGeneralIndustryMaster').removeAttr('disabled');
		    	}
		    	else if(response.status=="EXCEPTION_ERROR"){
		    		var html = '<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'</strong>';
		    		$('#errorMessage').append(html);
		    		$('#errorMessage').show(600);
		    		$('#page-wrapper').unmask();
		    	}
		    	
		    },error:function(response){
		    	$('#page-wrapper').mask(response.status+"***************"+response.statusText);
		    }
		  });
		return false;	
			    }

		function downloadIndustryMaster(){
			redirectView("../industryTypeMaster/downloadIndustryMaster.htm");
			return false;
		}

/***************************************************************************************************************************
*********************************Export Excel******************************************************************************
**************************************************************************************************************************/
		function exportIndustryMaster(){
			$('#industryDropDown').html('');
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
		   $('#listGeneralIndustryTab').html('');
		   $("#add").hide();
			$("#dataTab").hide();
			$("#newIndustryType").hide();
			$("#listOfIndustryType").hide();
			$("#editIndustryType").hide();
			$('#exportIndustryMasterTab').html('');
           $("#editDepartmentAttributes").html('');
			$("#dropDown").html('');
			var exportGeneralIndustryMasterButton = '<hr><input type="button" class="btn btn-info btn-xs" onclick=exportIndustryMasterLink() value="Export Industry Master">';
			$('#exportIndustryMasterTab').append(exportGeneralIndustryMasterButton,"<hr>");
		}

		function exportIndustryMasterLink(){
			redirectView("../industryTypeMaster/exportIndustryMasterList.htm");
			return false;
		}
		/***************************************************************************************************************************
		 *********************************Upload Excel******************************************************************************
		 **************************************************************************************************************************/

		function downloadIndustryMasterErrorsExcel(){
			redirectView(uploadedIndustryMasterFilePath);
			return false;
		}
		
/*************************************************************************BULK_EXCEl-UPLOAD****************************************************************************/
		
		function getSegmentCategoriese() {
		 
			$('#page-wrapper').mask('Loading...');
			$('#successOrganizationTypeDivs').hide();
			$("#drop").empty();
			var selectedIndustryType = $('#selectedIndustryType').val();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/lists.htm?id="+selectedIndustryType,
				dataType: "json",
				success: function(data){ 
					$('#selectedSegmentCategory').val("SELECT");
					$('#selectedOrganization').val("0");
					$('#selectedOrganization') .prop("disabled", true);
					$('#selectedDepartment').val("0");
					$('#selectedDepartment') .prop("disabled", true);

					var html="";
					html+=	'<label id="drop" for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategory" onchange="getOrganizationTypese()">';
					html+=	'<option value="0">SELECT</option>';
					for(var i=0;i<data.length;i++){
						html+=	'<option value='+data[i].id+'>'+data[i].segmentCategory+'</option>';
					}
					html+='</select>';
					//html+='<font style="color: red">*</font>';
					html+='</label>';
					
					$("#drop").append(html);
					$("#drop").show();
					$("#drops").show(); 
					$("#dropOrganization").show();
					$('#page-wrapper').unmask();
				}
			});
			}


		function getOrganizationTypese()
		{
			 $('input[type="submit"]').css('background-color','#a5c756');
	 		 $('input[type="submit"]').css('color','#FFFFFF');
	 	     $('input[type="submit"]').removeAttr('disabled');
			$('#page-wrapper').mask('Loading...');
			var selectedSegmentType = $('#selectedSegmentCategory').val();
			$("#dropOrganization").empty();
			$.ajax({
				type: "GET",
				url: "../industryTypeMaster/listOrganization.htm?id="+selectedSegmentType,
				dataType: "json",
				success: function(data){ 
					$('#selectedDepartment').val("0");
					$('#selectedDepartment') .prop("disabled", true);

					var html="";
					html+=	'<label id="dropOrganizations" for="Organization">Organization Type<select id="selectedOrganization" class="form-control input-sm" onchange="getvalDepartment()"></label>';
					html+=	'<option  value="0">SELECT</option>';
					for(var i=0;i<data.length;i++){

						html+=	'<option value='+data[i].id+'>'+data[i].organizationType+'</option>';
					}
					html+=	'</select>';
					html+=	'</label>';
				
					$("#dropOrganization").append(html);
					$("#dropOrganization").show();
					$("#dropDeparment").hide();
					$("#dropDeparment").empty();
					$("#dropDeparment").html('');
					$('#page-wrapper').unmask();
				}
				});
			}

