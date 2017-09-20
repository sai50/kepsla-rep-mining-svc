var referenceMatrixUrl = "../basicReferenceMatrix/";
var $addAndEditReviewReferenceMatrixDiv = $("#addAndEditReviewReferenceMatrixDiv");
var nearByList=[];

$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: "../basicReferenceMatrix/prefixDistance.htm",
		dataType: "json",
		success: function(data){ 
			nearByList=data;
			console.log(nearByList);
		}
	});
 });

function listReferenceMatrixTab(){
	listReviewReferenceMatrix();
}

function clearAddReviewReferenceMatrixForm(){
	$('#addReviewReferenceMatrixSuccessDiv').hide();
	$('#addReviewReferenceMatrixErrorDiv').hide();
	$('.help-inline').html('');
	$('#Add-userName-Error').removeClass('has-error has-feedback');
}

//add
$('a#addReviewMatrixAttribute').click(function() {
	$.ajaxSetup({cache : false});
	$('#loadMaskDiv').mask('Loading...');
	$addAndEditReviewReferenceMatrixDiv.html('');
	$('#addReviewMatrixAttributeForm').trigger('reset');//Making All Values Empty
	clearAddReviewReferenceMatrixForm();//Clearing All Errors
	var tempHtml = addReviewReferenceMatrix();
	$addAndEditReviewReferenceMatrixDiv.append(tempHtml);
	$addAndEditReviewReferenceMatrixDiv.show(600);
	scrollDown($addAndEditReviewReferenceMatrixDiv);//Scrolling To Add Page(Down)
	$('#loadMaskDiv').unmask();
	return false;
});

var responseIndustry=[];
function addReviewReferenceMatrix(){
	$.ajax({
		type : "GET",
		url : "../industryTypeMaster/list.htm",
		dataType : "json",
		success : function(data) {
			responseIndustry=data;
			console.log(responseIndustry);
		     
			$('#page-wrapper').unmask();
			var html = "";
			html+= addFormHeading("Add New Reference Matrix");
			html+='<form class="form-inline">';
			/** ****************Error Div******************************* */
			html += '<div class="alert alert-danger alert-error" style="display: none;margin-top: 65px;" id="addReviewReferenceMatrixErrorDiv">';
			html +='<img alt="../" src="../resources/images/error.jpg">&nbsp;Error Occured Please Check';
			html += '</div>';
			/** ****************Success Div******************************* */
			html += '<div class="alert alert-success alert-error" style="display: none;"	id="addReviewReferenceMatrixSuccessDiv">';
			html +='<img alt="../" src="../resources/images/done.png">&nbsp;Successfully created';
			html += '</div>';
			
			html+='<div id="industryType" class="form-group">';
			html+='<label class="control-label" style="width:400px" for="IndustryType">Industry<font style="color: red">*</font>';
			html+='<select id="selectIndustryType" style="width: 250px;float: right;" class="form-control input-sm"  onchange="segmentType()">';
			html+='<option value="0">Select</option>';
			console.log(responseIndustry);
			for(var i=0;i<responseIndustry.length;i++){
				html+=	'<option value='+responseIndustry[i].id+'>'+responseIndustry[i].industryType+'</option>';
			}
			html+='</select>';
			html+='</label><br>';
			
			//segment
			html+='<br><label id="segmentType" style="width:400px" for="SegmentType">Segment<font style="color: red">*</font> <select class="form-control input-sm"  style="width: 250px;float: right;" id="selectedSegmentType" disabled>';
			html+='<option disabled value="0">Select</option>';
			html+='</select>';
			html+='</label><br>';
			
			//organization
			html+='<br><label id="organizationType" style="width:400px" for="Organizationtype">Organization Type<font style="color: red">*</font> <select class="form-control input-sm" disabled style="width: 250px;float: right;" id="selectedOrganizationType" disabled>';
			html+='<option  disabled value="0">Select</option>';
			html+='</select>';
			html+='</label><br>';
			
			//department
			html+='<div id="Add-departmentType-Error">';
			html += '<span style="color: #a94442" id="departmentType-span-Error" class="help-inline"></span><br>';
			html += '<label id="departmentType" style="width:400px" for="DepartmentCategory">Department Type<font style="color: red">*</font> <select class="form-control input-sm" style="width: 250px;float: right;" id="selectedDepartmentType" disabled>';
			html+='<option value="0">Select</option>';
			html+='</select>';
			html+='</label>';
			html+='</div>';
			
			//kpi
			html+='<div id="Add-kpi-Error">';
			html += '<span style="color: #a94442" id="kpi-span-Error" class="help-inline"></span><br>';
			html+='<label id="kpiType" style="width:400px" for="kpiType">KPI<font style="color: red">*</font> <select class="form-control input-sm" style="width: 250px;float: right;" id="selectedKpi"disabled >';
			html+=	'<option value="0">Select</option>';
			html+='</select>';
			html+='</label></div>';
			
			//reference Category
			html+='<div class="ui-widget" id="Add-referenceCategory-Error">';
			html += '<span style="color: #a94442" id="referenceCategory-span-Error" class="help-inline"></span><br>';
			html+=' <label for="referenceCategory" style="width:140px">Reference Category<font style="color: red">*</font></label>';
			html+='<input type="text" class="form-control input-sm" style="width:250px;" id="referenceCategory" onkeydown="autoSearch()" >';
			html+='</div>';
			
			//reference
			html+='<div class="ui-widget" id="Add-reference-Error">';
			html += '<span style="color: #a94442" id="reference-span-Error" class="help-inline"></span><br>';
			html+=' <label for="reference" style="width:140px">Reference<font style="color: red">*</font> </label>';
			html+='<input type="text" class="form-control input-sm" id="reference" style="width:250px;" onkeydown="autoSearchReference()" >';
			html+='</div><br>';
			
			//QueryName
			html+=' <label style="margin-top: 33px;margin-bottom: 0px;"><B>NLP Query</B></label>';
			html+='<div class="col-xs-12">';
			html+='<div class="ui-widget col-xs-4" id="Add-nlpQueryName-Error">';
			html += '<span style="color: #a94442" id="nlpQueryName-span-Error" class="help-inline"></span><br>';
			html+=' <label for="nlpQueryName">Query Name<font style="color: red">*</font></label>';
			html+='<input type="text" class="form-control input-sm" style="width:100%" id="nlpQueryName" onkeydown="autoSearchQueryName()" >';
			html+='</div>';
			
			//Query Syntax
			html+='<div class="ui-widget col-xs-4" style="margin-top: 17px;">';
			html+=' <label for="querySyntax">Query Syntax</label>';
			html+='<textarea class="form-control input-sm" id="querySyntax" onkeydown="autoSearchKeyword()" style="width: 300px;"></textarea>';
			html+='</div>';
			html+='</div><br>';
			
			//Keywords prefix
			html+=' <label style=" margin-top: 33px;"><B>Keywords</B></label>';
			html+='<div class="col-xs-12">';
			html+='<div class="ui-widget col-xs-3">';
			html+=' <label for="keywordsPrefix" class="col-xs-12 row">Keywords Prefix</label>';
			html+='<input type="text" style="width:100%" class="form-control input-sm" id="keywordsPrefix" onkeydown="autoSearchKeywordsPrefix()">';
			html+='</div>';
			
			//Prefix Distance
			html+='<div class="col-xs-2" id="prefixDistances">';
			html+='<label id="prefixDistances" for="prefixDistances" class="col-xs-12 row">Prefix Distance</label>';
			html+='<select class="form-control input-sm" style="width: 120px;" id="prefixDistance" >';
			html+=	'<option value="0">Select</option>';
			html+='</select>';
			html+='</div>';
			
			//keywords
			html+='<div class="ui-widget col-xs-3">';
			html+=' <label for="keywords" class="col-xs-12 row">Keywords</label>';
			html+='<input type="text" class="form-control input-sm" style="width:100%" id="keywords" onkeydown="autoSearchKeywords()" >';
			html+='</div>';
			html+='</div>';
					
			html += '</form>';
			html += '</div><br/><br/>';
    
	        html += '<input type="button" class="btn btn-primary" value="Submit for Approval" onclick ="saveReviewReferenceMatrix()">';
	        html+=	appendCancelButton(getDivId("ReviewReferenceMatrix"),"page-wrapper");//Adding Cancel Button
	        html += '</form>';
	
	$("#addAndEditReviewReferenceMatrixDiv").append(html);
	$("#addAndEditReviewReferenceMatrixDiv").show();
	}});
		}
	


function segmentType(){
	var selectedIndustryType=$("#selectIndustryType").val();
	$("#segmentType").html('');
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/lists.htm?id="+selectedIndustryType,
		dataType: "json",
		success: function(data){ 
			console.log(data);

			var html="";
			html+=	'<label id="segmentType" class="control-label" style="width:400px"; for="SegmentCategory">Segment<font style="color: red">*</font> <select class="form-control input-sm" id="selectSegmentType" style="width: 250px;float: right;" margin-left: 100px;" onchange="organizationType()">';
			html+=	'<option value="0">ALL</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].segmentCategory+'</option>';
			}
			html+='</select>';	
			html+='</label>';	
	
	$("#segmentType").append(html);
	$("#segmentType").show();
		}
	});
}

function organizationType() {
	var selectedSegmentType=$("#selectSegmentType").val();
	console.log(selectedSegmentType);
	$("#organizationType").html('');
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listOrganization.htm?id="+selectedSegmentType,
		dataType: "json",
		success: function(data){ 
			console.log(data);
			$('#page-wrapper').unmask();
			var html="";
			html+='<label id="organizationType" style="width: 400px;" class="control-label" for="OrganizationType">Organization Type <font style="color: red">*</font>  ';
			html+='<select id="selectOrganizationType" class="form-control input-sm" style="width: 250px;float: right;" onchange="departmentType()">';
			html+='<option value="0">Select</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].organizationType+'</option>';
			}
			html+='</select>';
			html+='</label><br>';
			
			$("#organizationType").append(html);
			$("#organizationType").show();
		}});
        }

function listReviewReferenceMatrix(){
	$('#loadMaskDiv').mask('Loading...');
	$('#addReviewReferenceMatrixSuccessDiv,editReviewReferenceMatrixSuccessDiv').hide();
	$('#listApiUserTabMatrix').html('');
	$.get("../basicReferenceMatrix/referenceMatrixList.htm",function(response){
		console.log(response);
		if(response.status=="LIST_SUCCESS"){
			var tempHtml = listReviewReferenceMatrixResponse(response);
			$('#listApiUserTabMatrix').append(tempHtml);
			$('#listApiUserTableMatrix').dataTable().columnFilter({"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ] });
			$("#listApiUserTableMatrix_filter").hide();
			//$("#listApiUserTableMatrix_length").hide();     
			$addAndEditReviewReferenceMatrixDiv.hide();
			$('#listApiUserTabMatrix').show();
			$('#loadMaskDiv').unmask();
		}else{
			$('#loadMaskDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	},'json').fail(function(response){
		$('#loadMaskDiv').append(response.status+"*****************"+response.statusText);
	});
	return false;
}	

function listReviewReferenceMatrixResponse(response){
	console.log(response);
	var data=response.successObject.referenceKpiMappingListAll;
	console.log(data);
	var html="";
	html += '<div class="alert alert-success alert-error"	style="margin-top: 55px;" id="addReviewReferenceMatrixSuccessDiv">';
	html +='<img alt="../" src="../resources/images/done.png">&nbsp;Successfully Updated';
	html += '</div>';
	html += '<div class="alert alert-success alert-error" style="display: none;"	id="deleteReviewReferenceMatrixSuccessDiv">';
	html +='<img alt="../" src="../resources/images/done.png">&nbsp;Successfully deleted';
	html += '</div>';
	html+='<div id="listMatrixFormDiv">';
	html+='<form="form" id="listApiUserFormMatrix">';
	html+='<table class="table table-striped dataTable no-footer" id="listApiUserTableMatrix" style="table-layout:auto">';
	html+='<thead>';
	html+='<tr>';
	html+='<th></th>';
	html+='<th></th>';
	html+='<th></th>';
	html+='<th></th>';
	html+='<th></th>';
	html+='<th></th>';
	html+='<th></th>';
	html+='<th></th>';
	html+='<th></th>';
	html+='	</tr>';
	html+='<tr>';
	html+='<th>Department</th>';
	html+='<th>KPI</th>';
	html+='<th>Reference Category</th>';
	html+='<th>Reference</th>';
	html+='<th>Keywords</th>';
	html+='<th>Query Names</th>';
	html+='<th>Query Syntax</th>';
	html+='<th>Status</th>';
	html+='<th>Action</th>';
	html+='</tr>';
	html+='</thead>';
	html+='<tbody>';
	for(var i=0;i<data.length;i++){
	html+='<tr>';
	html+='<td>'+data[i].departmentType+'</td>';
	html+='<td style="word-break:break-all;">'+data[i].kpiName+'</td>';
	html+='<td style="word-break:break-all;">'+data[i].referenceCategory+'</td>';
	html+='<td style="word-break:break-all;">'+data[i].reference+'</td>';
	if(data[i].nearByKeyword!=null && data[i].keywords!=null && data[i].nearByKeyword!="" && data[i].keywords!=""){
		html+='<td style="word-break:break-all;">('+data[i].nearByKeyword+')Near/'+data[i].nearBy+'('+data[i].keywords+')</td>';
		}else if(data[i].nearByKeyword!=null && data[i].nearByKeyword!=""){
			html+='<td style="word-break:break-all;">('+data[i].keywords+')</td>';
		}else{
			html+='<td></td>';
		}
	html+='<td style="word-break:break-all;">'+data[i].nlpQueryName+'</td>';
	if(data[i].nlpQuery!=null){
	html+='<td>'+data[i].nlpQuery+'</td>';
	}else{
	html+='<td></td>';
	}
	html+='<td>'+data[i].status+'</td>';
	
	html+='<td>';
	html+='<div style="margin-bottom:10px">';
	html+='<button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editReviewReferenceMatrixData('+data[i].id+')"><span class="glyphicon glyphicon-pencil"></span></button></span>';
	html+='<span><button type="button" style="right=-1px;" class="btn btn-xs AdminInList" title="Delete" id="deleteReferenceMatrixDataId"  onclick="deleteReviewReferenceMatrixModal('+data[i].id+')"><span class="glyphicon glyphicon-trash"></span></button></span>';
	html+='</div>';
	html+='<div>';
	if(data[i].status!="IN USE"){
    html+='<button type="button" style="right=-1px;" class="btn btn-xs AdminInList" title="Approved"   onclick="approved('+data[i].id+')"><span class="glyphicon glyphicon-ok" style="color:green"></span></button>';
	html+='<button type="button" style="right=-1px;" class="btn btn-xs AdminInList" title="Rejected"   onclick="rejected('+data[i].id+')"><span class="glyphicon glyphicon-remove" style="color:red"></span></button>';
	}
	html+='</div>';
	html+='</td>';
	html+='</tr>';
	}
	html+='</tbody>';
	html+='</table>';
	html+='</form>';
	html+='</div>';
	return html;
}

 function departmentType()
  {
	var selectedOrganizationType = $('#selectOrganizationType').val();
	$("#departmentType").empty();
	$.ajax({
		type: "GET",
		url: "../industryTypeMaster/listAllDepartmentType.htm?id="+selectedOrganizationType,
		dataType: "json",
		success: function(data){ 
			console.log(data);

			var html="";
			html += '<div class="form-group">';
			html+='<label id="departmentType" style="width: 400px;" for="DepartmentCategory">Department<font style="color: red">*</font>';
			html += '<select class="form-control input-sm" style="width: 250px;float: right;" id="selectedDepartmentType" onchange="kpi()">';
			html+=	'<option value="0">Select</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].departmentType+'</option>';
			}
			html+='</select>';
			html+='</label>';
			html+='</div>';
			$("#departmentType").append(html);
			$("#departmentType").show();
		}}
	);
	}
 
 function kpi()
 {
	var selectedOrganizationType = $('#selectOrganizationType').val();
	$("#kpiType").empty();
	$.ajax({
		type: "GET",
		url: "../reviewMatrixAttributes/listOfKpi.htm?id="+selectedOrganizationType,
		dataType: "json",
		success: function(data){ 
			console.log(data);

			var html="";
			html+='<label id="kpiType" style="width: 400px;" for="kpiType">KPI<font style="color: red">*</font> <select class="form-control input-sm" style="width: 250px;float: right;" id="selectedKpiId" onchange="queryKeyword()">';
			html+=	'<option value="0">Select</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].kpiName+'</option>';
			}
			html+='</select>';
			html+='</label>';
			$("#kpiType").append(html);
			$("#kpiType").show();
		}}
	);
	}
 
 function queryKeyword()
 {
	 $("#prefixDistances").empty();
	$.ajax({
		type: "GET",
		url: "../basicReferenceMatrix/prefixDistance.htm",
		dataType: "json",
		success: function(data){ 
			console.log(data);
			var html="";
			html+='<label id="prefixDistances" for="prefixDistance" class="col-xs-12 row">PrefixDistance</label>';
			html+='<select class="form-control input-sm" style="width: 120px;" id="prefixDistance" >';
			html+=	'<option value="0">Select</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].nearBy+'</option>';
			}
			html+='</select>';
			//html+='</label>';
			//html+='</div>';
			$("#prefixDistances").append(html);
			$("#prefixDistances").show();
		}}
	);
	}
 
 
 function autoSearch() {
	var keywordNames=[];
		$.ajax({
			type: "GET",
			url: "../reviewMatrixAttributes/listOfKeyword.htm",
			dataType: "json",
			success: function(data){ 
				console.log(data);
				for(var i=0;i<data.length;i++){
					keywordNames.push(data[i].keywordName);
					tempArr(keywordNames);
				}		
			}});
	 $( "#referenceCategory").autocomplete({source:keywordNames});
 }
 
 function autoSearchReference() {
		var mentions=[];
			$.ajax({
				type: "GET",
				url: "../reviewMatrixAttributes/listOfKeyword.htm",
				dataType: "json",
				success: function(data){ 
					console.log(data);
					for(var i=0;i<data.length;i++){
						mentions.push(data[i].mention);
						 tempArr(mentions);
					}		
				}});
		 $( "#reference").autocomplete({source:mentions});
	 }
 
 function autoSearchQueryName() {
		var nlpQueryname=[];
			$.ajax({
				type: "GET",
				url: "../reviewMatrixAttributes/listOfKeyword.htm",
				dataType: "json",
				success: function(data){ 
					console.log(data);
					for(var i=0;i<data.length;i++){
						nlpQueryname.push(data[i].nlpQueryName);
						 tempArr(nlpQueryname);
					}		
				}});
		 $( "#nlpQueryName").autocomplete({source:nlpQueryname});
	 }
 
 function autoSearchKeyword() {
		var keyword=[];
			$.ajax({
				type: "GET",
				url: "../reviewMatrixAttributes/listOfKeyword.htm",
				dataType: "json",
				success: function(data){ 
					console.log(data);
					for(var i=0;i<data.length;i++){
						keyword.push(data[i].nlpQuery);
						 tempArr(keyword);
					}		
				}});
		 $( "#querySyntax").autocomplete({source:keyword});
	 }
 
 function autoSearchKeywordsPrefix() {
		var keywordPrefix=[];
			$.ajax({
				type: "GET",
				url: "../basicReferenceMatrix/queryKeywordList.htm",
				dataType: "json",
				success: function(data){ 
					for(var i=0;i<data.length;i++){
						if(data[i].keywords!=null){
						keywordPrefix.push(data[i].keywords);
					     }
						 tempArr(keywordPrefix);
					}		
				}});
		 $( "#keywordsPrefix").autocomplete({source:keywordPrefix});
	 }
 
 function editAutoSearchKeywordsPrefix() {
		var keywordPrefix=[];
			$.ajax({
				type: "GET",
				url: "../basicReferenceMatrix/queryKeywordList.htm",
				dataType: "json",
				success: function(data){ 
					for(var i=0;i<data.length;i++){
						if(data[i].nearByKeyword!=null){
						keywordPrefix.push(data[i].nearByKeyword);
						}
						tempArr(keywordPrefix);
					}		
				}});
		 $( "#editKeywordsPrefix").autocomplete({source:keywordPrefix});
	 }

 
 function autoSearchKeywords() {
		var keywords=[];
			$.ajax({
				type: "GET",
				url: "../basicReferenceMatrix/queryKeywordList.htm",
				dataType: "json",
				success: function(data){ 
					for(var i=0;i<data.length;i++){
						if(data[i].nearByKeyword!=null){
						keywords.push(data[i].nearByKeyword);
						}
						 tempArr(keywords);
					}		
				}});
		 $( "#keywords").autocomplete({source:keywords});
	 }
 
 function editAutoSearch() {
		var keywordNames=[];
			$.ajax({
				type: "GET",
				url: "../reviewMatrixAttributes/listOfKeyword.htm",
				dataType: "json",
				success: function(data){ 
					console.log(data);
					for(var i=0;i<data.length;i++){
						keywordNames.push(data[i].keywordName);
						tempArr(keywordNames);
					}		
				}});
		 $( "#editReferenceCategory").autocomplete({source:keywordNames});
	 }

function editAutoSearchReference() {
		var mentions=[];
			$.ajax({
				type: "GET",
				url: "../reviewMatrixAttributes/listOfKeyword.htm",
				dataType: "json",
				success: function(data){ 
					console.log(data);
					for(var i=0;i<data.length;i++){
						mentions.push(data[i].mention);
						 tempArr(mentions);
					}		
				}});
		 $( "#editReference").autocomplete({source:mentions});
	 }

function editAutoSearchQueryName() {
	var nlpQueryname=[];
		$.ajax({
			type: "GET",
			url: "../reviewMatrixAttributes/listOfKeyword.htm",
			dataType: "json",
			success: function(data){ 
				console.log(data);
				for(var i=0;i<data.length;i++){
					nlpQueryname.push(data[i].nlpQueryName);
					 tempArr(nlpQueryname);
				}		
			}});
	 $( "#editNlpQueryName").autocomplete({source:nlpQueryname});
 }

function editAutoSearchKeywords() {
	var keywords=[];
		$.ajax({
			type: "GET",
			url: "../basicReferenceMatrix/queryKeywordList.htm",
			dataType: "json",
			success: function(data){ 
				for(var i=0;i<data.length;i++){
					keywords.push(data[i].keywords);
					 tempArr(keywords);
				}		
			}});
	 $( "#editKeywords").autocomplete({source:keywords});
 }
 
 function tempArr(arr) {
     newArr = new Array();
     for (var i = 0; i < arr.length; i++) {
         if (!duplValuescheck(newArr, arr[i])) {
             newArr.length += 1;
             newArr[newArr.length - 1] = arr[i];
         }
     }
 }
 function duplValuescheck(arr, e) {
     for (var j = 0; j < arr.length; j++) if (arr[j] == e) return true;
     return false;
 }
 
 function editAutoSearchKeyword() {
		var keyword=[];
			$.ajax({
				type: "GET",
				url: "../reviewMatrixAttributes/listOfKeyword.htm",
				dataType: "json",
				success: function(data){ 
					console.log(data);
					for(var i=0;i<data.length;i++){
						keyword.push(data[i].nlpQuery);
						 tempArr(keyword);
					}		
				}});
		 $( "#editQuerySyntax").autocomplete({source:keyword});
	 }
 
 function deleteReviewReferenceMatrixModal(id){
	 $('#deleteReferenceModalNew').html('');
	 var html="";
	 html+='<div id="deleteReferenceModal" class="modal fade">';
	 html+='<div class="modal-dialog">';
     html+='<div class="modal-content">';
     html+='<div class="modal-header">';
     html+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
     html+='<h4 class="modal-title" id="addNewPhraseHedaer">Delete</h4>';
     html+='</div>';
     html+='<div class="modal-body" id="addNewPhraseModalBody">Are you sure want to delete current mapping? This would mean that all your old records need to be removed,which may take more time</div>';
     html+='<div class="modal-footer" id="addNewPhraseModalFooter">';
     html+='<button class="btn btn-primary" aria-hidden="true" onClick="deleteReviewReferenceMatrixData('+id+')"  type="button">Approve</button>';
     html+='<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
     html+='</div>';
     html+='</div>';
    html+='</div>';
    $('#deleteReferenceModalNew').append(html);
    $('#deleteReferenceModal').modal('show');
 } 
 
 function deleteReviewReferenceMatrixData(id){
	 //$('#deleteReferenceModal').modal('show');
	 //if(confirm("Are you sure want to delete selected item?")){
			$.post("../basicReferenceMatrix/delete.htm?id="+id,function(response){
				if(response.status=="DELETE_SUCCESS"){
					listReviewReferenceMatrix();
					$('#deleteReviewReferenceMatrixSuccessDiv').show(600);
					 $('#deleteReferenceModal').modal('hide');
					//$('#geoCountryTabButtons').show();
					$('#listApiUserTableMatrix').dataTable().columnFilter({"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ]});
					$("#listApiUserTableMatrix_filter").hide();
					//$("#listApiUserTableMatrix_length").hide();     
					$addAndEditReviewReferenceMatrixDiv.hide();
					$('#listApiUserTabMatrix').show();
					$('#loadMaskDiv').unmask();
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
			});
		return false;
	//}
 }
 
 function editReviewReferenceMatrixData(id){
		$('#page-wrapper').mask('Loading');
		var divId = $('#'+getDivId("ReviewReferenceMatrix"));
		$.get(referenceMatrixUrl+"edit.htm?id="+id,function(response){
			console.log(response);
			if(response.status=="SUCCESS"){
				var html = referenceMatrixEditFormHtml(response);
				appendReferenceMatrixAddOrEditForm(divId, html);
			}else{
				$('#page-wrapper').mask(response.errorMessage);
			}
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**************"+response.statusText);
		});
	}

function appendReferenceMatrixAddOrEditForm(divId,method){
		divId.html('');
		divId.append(method);
		divId.show(600);
		scrollDown(divId);
		maskId.unmask();
	}

 function referenceMatrixEditFormHtml(response){
		var editReferenceKpiMappingUI = response.successObject.editReferenceKpiMappingUI;
		var html = "";
		html+=	addFormHeading("Edit Reference Matrix");
		html+=	'<form id="editReferenceMatrixForm">';
		/** ****************************************Error Div**************************************************** */
		html += '<div class="alert alert-danger alert-error" style="display: none;margin-top: 65px;"	id="editReferenceMatrixErrorDiv">';
		html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
		html += '</div>';
		/** ****************Success Div******************************* */
		html += '<div class="alert alert-success alert-success" style="display: none;margin-top: 36px;" id="editReferenceMatrixSuccessDiv">';
		html +='<img alt="../" src="../resources/images/done.png">&nbsp;Successfully created';
		html += '</div>';
		/** ************************************Location Type***************************************************** */
		html+='<input type="hidden" class="form-control input-sm" id="editId" value="'+editReferenceKpiMappingUI.id+'" >';
		//department
		html+='<br>';
		html+='<div id="Edit-editDepartmentType-Error" class="form-group">';
		html += '<span style="color: #a94442" id="editDepartmentType-span-Error" class="help-inline"></span><br>';
		html += '<label id="editDepartmentType" style="width:400px" for="EditDepartmentCategory">Department<font style="color: red">*</font> <select class="form-control input-sm" style="width: 250px;float: right;" id="editSelectedDepartmentType" disabled>';
		html+='<option value="'+editReferenceKpiMappingUI.departmentTypeId+'">'+editReferenceKpiMappingUI.departmentType+'</option>';
		html+='</select>';
		html+='</label>';
		html+='</div>';
		
		//kpi
		html+='<div id="Edit-editKpi-Error" class="form-group">';
		html += '<span style="color: #a94442" id="editKpi-span-Error" class="help-inline"></span><br>';
		html+='<label id="editKpiType" style="width:400px" for="editKpiType">KPI<font style="color: red">*</font> <select class="form-control input-sm" style="width: 250px;float: right;" id="editSelectedKpi"disabled >';
		html+=	'<option value="'+editReferenceKpiMappingUI.kpiId+'">'+editReferenceKpiMappingUI.kpiName+'</option>';
		html+='</select>';
		html+='</label></div>';
		
		//reference Category
		html+='<div class="ui-widget" id="Edit-editReferenceCategory-Error">';
		html += '<span style="color: #a94442" id="editReferenceCategory-span-Error" class="help-inline"></span><br>';
		html+=' <label for="editReferenceCategory" style="width: 169px;" class="col-xs-12 row">Reference Category<font style="color: red">*</font></label>';
		html+='<input type="text" class="form-control input-sm" style="width:250px;" id="editReferenceCategory" value="'+editReferenceKpiMappingUI.reference+'" onkeydown="editAutoSearch()" >';
		html+='</div><br>';
		
		//reference
		html+='<div class="ui-widget" id="Edit-editReference-Error">';
		html += '<span style="color: #a94442" id="editReference-span-Error" class="help-inline"></span><br>';
		html+=' <label for="editReference" style="width: 169px;" class="col-xs-12 row">Reference<font style="color: red">*</font> </label>';
		html+='<input type="text" class="form-control input-sm" style="width:250px;" id="editReference" value="'+editReferenceKpiMappingUI.referenceCategory+'"  onkeydown="editAutoSearchReference()" >';
		html+='</div>';
		
		//QueryName
		html+=' <label style="margin-top: 33px;margin-bottom: 0px;"><B>NLP Query</B></label>';
		html+='<div class="col-xs-12">';
		html+='<div class="ui-widget col-xs-4" id="Edit-editNlpQueryName-Error">';
		html += '<span style="color: #a94442" id="editNlpQueryName-span-Error" class="help-inline"></span><br>';
		html+=' <label for="editNlpQueryName">Query Name<font style="color: red">*</font></label>';
		html+='<input type="text" class="form-control input-sm" style="width: 100%;" id="editNlpQueryName" value="'+editReferenceKpiMappingUI.nlpQueryName+'" onkeydown="editAutoSearchQueryName()" >';
		html+='</div>';
		
		//Query Syntax
		html+='<div class="ui-widget col-xs-4">';
		html+=' <label for="editQuerySyntax">Query Syntax</label>';
		if(editReferenceKpiMappingUI.nlpQuery==null){
		html+='<textarea class="form-control input-sm" id="editQuerySyntax" onkeydown="editAutoSearchKeyword()" style="width: 300px;"></textarea>';
		}else{
			html+='<textarea class="form-control input-sm" id="editQuerySyntax" onkeydown="editAutoSearchKeyword()" style="width: 300px;">'+editReferenceKpiMappingUI.nlpQuery+'</textarea>';
		}
		html+='</div>';
		html+='</div><br>';
		
		//Keywords prefix
		html+=' <label style=" margin-top: 15px;"><B>Keywords</B></label>';
		html+='<div class="col-xs-12">';
		html+='<div class="ui-widget col-xs-3">';
		html+=' <label for="editKeywordsPrefix" class="col-xs-12 row">Keywords Prefix</label>';
		if(editReferenceKpiMappingUI.nearByKeyword!=null ){
		html+='<input type="text" class="form-control input-sm" id="editKeywordsPrefix" value="'+editReferenceKpiMappingUI.nearByKeyword+'" onkeydown="editAutoSearchKeywordsPrefix()">';
		}else{
			html+='<input type="text" class="form-control input-sm" id="editKeywordsPrefix" onkeydown="editAutoSearchKeywordsPrefix()"  value="" >';
		}
		html+='</div>';
		
		//Prefix Distance
		html+='<div class="col-xs-2">';
		html+='<label id="editPrefixDistances" for="editPrefixDistance" class="col-xs-12 row">Prefix Distance</label>';
		html+='<select class="form-control input-sm" style="width: 120px;" id="editPrefixDistance" >';
		for(var i=0;i<nearByList.length;i++){
			if(editReferenceKpiMappingUI.nearBy==nearByList[i].nearBy){
			html+=	'<option selected value="'+editReferenceKpiMappingUI.nearBy+'">'+editReferenceKpiMappingUI.nearBy+'</option>';
			}else{
				html+=	'<option value="'+nearByList[i].id+'">'+nearByList[i].nearBy+'</option>';
			}
		}
		html+='</select>';
		html+='</label><br>';
		html+='</div>';
		
		//keywords
		html+='<div class="ui-widget col-xs-3">';
		html+=' <label for="editKeywords">Keywords</label>';
		if(editReferenceKpiMappingUI.keywords!=null){
		html+='<input type="text" class="form-control input-sm" id="editKeywords" value="'+editReferenceKpiMappingUI.keywords+'"  onkeydown="editAutoSearchKeywords()">';
        }else{
        	html+='<input type="text" class="form-control input-sm" id="editKeywords" value=""  onkeydown="editAutoSearchKeywords()" >';
        }
		html+='<br></div>';
		html+='</div><br>';
		html+='<input type="hidden" class="form-control input-sm" id="editStatus" value="'+editReferenceKpiMappingUI.status+'">';
		html+='<input type="hidden" class="form-control input-sm" id="editReferenceCategoryId" value="'+editReferenceKpiMappingUI.referenceCategoryId+'">';
		html+='<input type="hidden" class="form-control input-sm" id="editIndustryTypeId" value="'+editReferenceKpiMappingUI.industryTypeId+'">';
		html+='<input type="hidden" class="form-control input-sm" id="editReferenceId" value="'+editReferenceKpiMappingUI.referenceId+'">';
				
		html+=	'<div class="form-group">';
		html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateReferenceMatrix('+editReferenceKpiMappingUI.id+')">';
		html+=	appendCancelButton(getDivId("ReviewReferenceMatrix"),"page-wrapper");//Adding Cancel Button
		html+=	'</div><br>';
		html += '</form>';
		return html;
	}
 
 function updateReferenceMatrix(id){
		$.ajaxSetup({ cache: false });//Clear Browser Cache
		$('#page-wrapper').mask('Loading...');
		$('.help-inline').empty();
		$('.form-group').removeClass('has-error has-feedback');
		$('#editReferenceMatrixSuccessDiv').hide();
		$('#editReferenceMatrixErrorDiv').hide();
		var departmentTypeId=$('#editSelectedDepartmentType option:selected').val();
		var kpiId=$('#editSelectedKpi option:selected').val();
		var referenceCategory=$.trim($('#editReferenceCategory').val());
		var reference=$.trim($('#editReference').val());
		var nlpQueryName=$.trim($('#editNlpQueryName').val());
		var querySyntax=$('textarea').val();
		var keywordsPrefix=$.trim($('#editKeywordsPrefix').val());
		var prefixDistance=$('#editPrefixDistance option:selected').text();
		var keywords=$.trim($('#editKeywords').val());
		var nearBy=$('#editPrefixDistance option:selected').text();
		var status=$.trim($('#editStatus').val());
		var editReferenceCategoryId=$('#editReferenceCategoryId').val();
		var editIndustryTypeId=$('#editIndustryTypeId').val();
		var referenceId=$('#editReferenceId').val();
		
		var JSONObject = {};
		JSONObject['id'] = id;
		JSONObject['referenceCategory'] = referenceCategory;
		JSONObject['reference'] = reference;
		JSONObject['nlpQueryName'] = nlpQueryName;
		JSONObject['querySyntax'] = querySyntax;
		JSONObject['keywordsPrefix'] = keywordsPrefix;
		JSONObject['prefixDistance'] = prefixDistance;
		JSONObject['keywords'] = keywords;
		JSONObject['kpiId'] = kpiId;
		JSONObject['departmentTypeId'] = departmentTypeId;
		JSONObject['nlpQuery'] = querySyntax;
		JSONObject['nearBy'] = nearBy;
		JSONObject['status'] = status;
		JSONObject['referenceCategoryId'] = editReferenceCategoryId;
		JSONObject['industryTypeId'] = editIndustryTypeId;
		JSONObject['referenceId'] = referenceId;
		console.log(JSONObject);
		$.post(referenceMatrixUrl+"update.htm",JSONObject,function(response){
			console.log(response);
			if(response.status=="UPDATE_SUCCESS"){
				$addAndEditReviewReferenceMatrixDiv.hide();
				listReviewReferenceMatrix();
				$('#page-wrapper').unmask();
			}else if(response.status=="UPDATE_ERROR"){
				console.log(response);
				$('#editReferenceMatrixErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-Error').html(errorMessage);
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
 
 function saveReviewReferenceMatrix(){
	 $('#page-wrapper').mask('Loading');
	 $('#addReviewReferenceMatrixSuccessDiv').hide();
	 $('#addReviewReferenceMatrixErrorDiv').hide();
	 $('#departmentType-span-Error').removeClass('has-error has-feedback');
	 $('.help-inline').html('');
	 $('#kpi-span-Error').removeClass('has-error has-feedback');
	 $('.help-inline').html('');
	 $('#referenceCategory-span-Error').removeClass('has-error has-feedback');
	 $('.help-inline').html('');
	 $('#reference-span-Error').removeClass('has-error has-feedback');
	 $('.help-inline').html('');
	 $('#nlpQueryName-span-Error').removeClass('has-error has-feedback');
	 $('.help-inline').html('');
	 $('#Add-departmentType-Error').removeClass('has-error has-feedback');
	 $('#Add-kpi-Error').removeClass('has-error has-feedback');
	 $('#Add-referenceCategory-Error').removeClass('has-error has-feedback');
	 $('#Add-reference-Error').removeClass('has-error has-feedback');
	 $('#Add-nlpQueryName-Error').removeClass('has-error has-feedback');
	var industryTypeId=$('#selectIndustryType option:selected').val();
	var segmentTypeId=$('#selectSegmentType option:selected').val();
	var departmentTypeId= $('#selectedDepartmentType option:selected').val();
	var kpiId= $('#selectedKpiId option:selected').val();
	var referenceCategory=$('#referenceCategory').val();
	var reference=$('#reference').val();
	var nlpQueryName=$('#nlpQueryName').val();
	var querySyntax=$('textarea').val();
	var keywordsPrefix=$('#keywordsPrefix').val();
	var prefixDistance=$('#prefixDistance option:selected').text();
	var keywords=$('#keywords').val();
	var nearBy=$('#prefixDistance option:selected').text();
	
	if(kpiId==undefined){
		kpiId="0";
	}
	if(segmentTypeId==undefined){
		segmentTypeId="0";
	}
	if(prefixDistance=="Select"){
		prefixDistance=0;
	}
	if(nearBy=="Select"){
		nearBy=0;
	}
	
		var JSONObject = {};
		JSONObject['referenceCategory'] = referenceCategory;
		JSONObject['reference'] = reference;
		JSONObject['nlpQueryName'] = nlpQueryName;
		JSONObject['querySyntax'] = querySyntax;
		JSONObject['nlpQuery'] = querySyntax;
		JSONObject['keywordsPrefix'] = keywordsPrefix;
		JSONObject['prefixDistance'] = prefixDistance;
		JSONObject['keywords'] = keywords;
		JSONObject['kpiId'] = kpiId;
		JSONObject['departmentTypeId'] = departmentTypeId;
		JSONObject['industryTypeId'] = industryTypeId;
		JSONObject['segmentTypeId'] = segmentTypeId;
		JSONObject['nearBy'] = nearBy;
		console.log(JSONObject);
		$.post("../basicReferenceMatrix/save.htm",JSONObject,function(response){
			console.log(response);
			$('#loadMaskDiv').unmask();
			if(response.status=="SAVE_ERROR"){
				$('#page-wrapper').unmask();
					$('#addReviewReferenceMatrixErrorDiv').show(600);
					for(var i=0;i<response.errorMessageList.length;i++){
						var fieldName = response.errorMessageList[i].fieldName;
						var errorMessage = response.errorMessageList[i].message;
						$('#'+fieldName+'-span-Error').html(errorMessage);
						$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
						//scrollDown(divId);
					}
			}else if(response.status=="SAVE_SUCCESS"){
				$('#page-wrapper').unmask();
				$addAndEditReviewReferenceMatrixDiv.hide();
				listReferenceMatrixTab();
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask('<font style="color:red">'+response.errorMessage+'</font>');
			}
		},'json').fail(function(response){
			$('#loadMaskDiv').mask(response.status+"***************"+response.statusText);
		});
		return false;
	}
 
 //approved
 function approved(id){
	 if(confirm("Are you sure want to Approve selected item?")){
			$.post("../reviewMatrixAttributes/approve.htm?id="+id,function(response){
				alert("selected item approved successfully");
				redirectView("../reviewMatrixAttributes/list.htm");
		});
 }}
 
//rejected
 function rejected(id){
	 if(confirm("Are you sure want to reject selected item?")){
			$.post("../reviewMatrixAttributes/reject.htm?id="+id,function(response){
				alert("selected item rejected successfully");
				redirectView("../reviewMatrixAttributes/list.htm");
		}); 
 }}
