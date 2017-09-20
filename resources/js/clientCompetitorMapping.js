$(document).ready(function() {
	  $.ajaxSetup({ cache: false });
	});

var count=0;
var countComp=0;
var clientCompetitorMappingUrl = "../clientCompetitorMapping/";

//*****client Competitor Mapping Variables***************//
var clientCompetitorMappingDataDiv = $('#clientCompetitorMappingDataDiv');
var clientCompetitorMappingTableId = $('#clientCompetitorMappingTableId');
var selectedClientCompetitorMappingIds = [];


/**************************************************************************************************************************
 *                     List CLient Competitor Mapping                                                                         *
 **************************************************************************************************************************/
function viewList() {
	$('#editClientCompetitorMappingSuccessDiv').hide();
	$.ajaxSetup({
		cache : false
	});
	$('#page-wrapper').mask('Loading...');
	clientCompetitorMappingDataDiv.html('');
	$('#clientCompetitorMappingTabButtons').html('');
	$('#addClientCompetitorMappingSuccessDiv').hide();
	$('#addAndEditClientCompetitorMappingDiv').hide();
	$.get(
			clientCompetitorMappingUrl + "listTab.htm",
			function(response) {
				if (response.status == "LIST_SUCCESS") {
					var html = listViewMapping(response);
					$('#clientCompetitorMappingTabButtons').append(html);
					$('#page-wrapper').unmask();
				} else {
					$('#clientCompetitorMappingDataDiv').append(
							'<font style="color:red">' + response.errorMessage
									+ '</font>');
				}
			}, 'json').fail(
			function(response) {
				clientCompetitorMappingDataDiv.mask(response.status
						+ "**********" + response.statusText);
			});
	return false;

}

function listViewMapping(response) {
	// var clientCompetitorMappingMasterList =
	// response.successObject.listClientCompetitorMapping;
	var organizationIdList = response.successObject.listOfOrganizationId;
	var competitorIdList = response.successObject.competitorIdList;
	var html = "";
	html += '<div class="tab-pane fade in active" id="drops">';
	html += '<div class="row" style="margin-top: 10px">';
	html += '<label id="orgId" class="control-label col-xs-4" for="OrgId">OrgId <select id="selectedOrgIdType"	class="form-control input-sm" onchange="getOrgID()" style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
	html += '<option value="0">ALL</option>';
	for (var i = 0; i < organizationIdList.length; i++) {
		html += '<option value=' + organizationIdList[i].organizationId + '>'
				+ organizationIdList[i].organizationId + '</option>';
	}
	html += '</select></label>';

	html += '<label id="orgName" class="control-label col-xs-4"	for="OrganizationName">Org Name <select class="form-control input-sm" id="selectedOrgNameType" onchange="getOrgNames()"  style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
	html += '<option value="0">ALL</option>';
	for (var i = 0; i < organizationIdList.length; i++) {
		html += '<option value=' + organizationIdList[i].organizationId + '>'
				+ organizationIdList[i].clientName + '</option>';
	}
	
	html += '</select>';
	html += '</label>';
	html += '</div>';

	html += '<div class="row" style="margin-top: 10px">';
	html += '<label id="compOrgId" class="control-label col-xs-4"	for="CompOrgId">CompOrgId <select id="selectedCompOrgIdType" class="form-control input-sm" onchange="getCompOrgID()" style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
	html += '<option value="0">ALL</option>';
	for (var i = 0; i < competitorIdList.length; i++) {
		html += '<option value=' + competitorIdList[i].competitor + '>'
				+ competitorIdList[i].competitor + '</option>';
	}
	html += '</select></label>';

	html += '<label id="compOrgName" class="control-label col-xs-4" for="CompOrganizationName">Comp Org Name <select class="form-control input-sm"  onchange="getCompOrgNames()" id="selectedCompOrgNameType" style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
	html += '<option value="0">ALL</option>';
	for (var i = 0; i < competitorIdList.length; i++) {
		html += '<option value=' + competitorIdList[i].competitor + '>'
				+ competitorIdList[i].competitorName + '</option>';
	}
	html += '</select>';
	html += '</label>';

	html += '<label id="dropView" class="control-label col-xs-4" for=""> <a onclick="filterclientCompetitorMappingList()" class="btn btn-primary" type="button">View</a> </label>';

	html += '</div>';

	html += '</div>';

	html += '<div class="form-group float-right"> <button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteClientCompetitorMapping()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
	html += '<a onclick="addClientCompetitorMapping()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
	html += ' </div>';
	return html;

}

function getOrgID() {
	$('#page-wrapper').mask('Loading...'); 
	$("#orgName").html('');
	var selectedOrgIdTypes = $("#selectedOrgIdType option:selected").val();
	console.log("selectedOrgIdTypes ============ "+selectedOrgIdTypes);
	$
			.ajax({
				type : "GET",
				url : "../clientCompetitorMapping/listTab.htm",
				dataType : "json",
				success : function(data) {
					var organizationIdList = data.successObject.listOfOrganizationId;
					//console.log("data " + organizationIdList);
					var html = "";
					var setOrgName='';
					var selectOrgId;
					for (var i = 0; i < organizationIdList.length; i++) {
						if(organizationIdList[i].organizationId == selectedOrgIdTypes){
							setOrgName=organizationIdList[i].clientName;
							selectOrgId=organizationIdList[i].organizationId;
						}
						if(selectedOrgIdTypes == 0){
							setOrgName='ALL';
							selectOrgId=0;
						}
						
					}
					html += 'Org Name <select class="form-control input-sm" id="selectedOrgNameType" onchange="getOrgNames()"  style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
					if(selectOrgId>0){
						html += '<option style="display: none;" value='+selectOrgId+' >'+setOrgName+'</option>';
					}
					html += '<option value="0">ALL</option>';
					for (var i = 0; i < organizationIdList.length; i++) {
						html += '<option value=' + organizationIdList[i].organizationId
								+ '>' + organizationIdList[i].clientName
								+ '</option>';
					}
					html += '</select>';
				
					$("#orgName").append(html);
					$("#orgName").show();
					$('#page-wrapper').unmask();
				}
			});
}

function getOrgNames() {
	$('#page-wrapper').mask('Loading...'); 
	$("#orgId").html('');
	var selectedOrgNameypes = $("#selectedOrgNameType option:selected").val();
	console.log("selectedOrgNameType "+selectedOrgNameypes);
	$
			.ajax({
				type : "GET",
				url : "../clientCompetitorMapping/listTab.htm",
				dataType : "json",
				success : function(data) {
					var organizationIdList = data.successObject.listOfOrganizationId;
					//console.log("organizationIdList " + organizationIdList);
					var html = "";
					var setOrgId='';
					var selectOrgId;
					for (var i = 0; i < organizationIdList.length; i++) {
						if(organizationIdList[i].organizationId == selectedOrgNameypes){
							setOrgId=organizationIdList[i].organizationId;
							selectOrgId=organizationIdList[i].organizationId;
						}
						if(selectedOrgNameypes == 0){
							setOrgId='ALL';
							selectOrgId=0;
						}
					}
					html += 'orgId <select class="form-control input-sm" id="selectedOrgIdType" onchange="getOrgID()" style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
					if(selectOrgId>0){
						html += '<option style="display: none;" value='+selectOrgId+' >'+setOrgId+'</option>';
					}
					
					html += '<option value="0">ALL</option>';
					for (var i = 0; i < organizationIdList.length; i++) {
						
						//console.log("data  check "+ organizationIdList[i].organizationId);
						html += '<option value=' + organizationIdList[i].organizationId
								+ '>' + organizationIdList[i].organizationId
								+ '</option>';
					}
					html += '</select>';
					$("#orgId").append(html);
					$("#orgId").show();
					$('#page-wrapper').unmask();
				}
			});
}


function getCompOrgID() {
	$('#page-wrapper').mask('Loading...'); 
	$("#compOrgName").html('');
	var selectedCompIdTypes = $("#selectedCompOrgIdType option:selected").val();
	console.log("selectedCompIdTypes:- " + selectedCompIdTypes);
	$
			.ajax({
				type : "GET",
				url : "../clientCompetitorMapping/listTab.htm",
				dataType : "json",
				success : function(data) {
					var competitorIdList = data.successObject.competitorIdList;
					var html = "";
					var setCompId='';
					var selectCompetiorId;
					for (var i = 0; i < competitorIdList.length; i++) {
						if(competitorIdList[i].competitor == selectedCompIdTypes){
							setCompId=competitorIdList[i].competitorName;
							selectCompetiorId=competitorIdList[i].competitor;
						}
						if(selectedCompIdTypes == 0){
							setCompId='ALL';
							selectCompetiorId=0;
						}
					}
					html += 'Comp Org Name <select class="form-control input-sm" id="selectedCompOrgNameType" onchange="getCompOrgNames()" style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
					if(selectCompetiorId>0){
						html += '<option style="display: none;" value='+selectCompetiorId+' >'+setCompId+'</option>';
					}
					html += '<option value="0">ALL</option>';
					for (var i = 0; i < competitorIdList.length; i++) {
						html += '<option value=' + competitorIdList[i].competitor + '>'
								+ competitorIdList[i].competitorName + '</option>';
					}
					//html += '<option value="0">ALL</option>';
					html += '</select>';
					$("#compOrgName").append(html);
					$("#compOrgName").show();
					$('#page-wrapper').unmask();
				}
			});
}


function getCompOrgNames() {
	$('#page-wrapper').mask('Loading...'); 
	$("#compOrgId").html('');
	var selectedCompNameTypes = $("#selectedCompOrgNameType option:selected").val();
	console.log("selectedCompNameTypes:- " + selectedCompNameTypes);
	$
			.ajax({
				type : "GET",
				url : "../clientCompetitorMapping/listTab.htm",
				dataType : "json",
				success : function(data) {
					var competitorIdList = data.successObject.competitorIdList;
					//console.log("competitorIdList " + competitorIdList);
					var html = "";
					var setCompName='';
					var selectCompetitorName;
					for (var i = 0; i < competitorIdList.length; i++) {
						if(competitorIdList[i].competitor == selectedCompNameTypes){
							setCompName=competitorIdList[i].competitor;
							selectCompetitorName=competitorIdList[i].competitor;
						}
						if(selectedCompNameTypes == 0){
							setCompName='ALL';
							selectCompetitorName=0;
						}
					}
					html += 'CompOrgId <select class="form-control input-sm" id="selectedCompOrgIdType" onchange="getCompOrgID()" style="width: 150px; float: right; margin-right: 15px; margin-top: -5px;">';
				if(selectCompetitorName>0){
					html += '<option style="display: none;" value='+selectCompetitorName+' >'+setCompName+'</option>';
				}
				html += '<option value="0">ALL</option>';
					for (var i = 0; i < competitorIdList.length; i++) {
						html += '<option value=' + competitorIdList[i].competitor + '>'
								+ competitorIdList[i].competitor + '</option>';
					}
					//html += '<option value="0">ALL</option>';
					html += '</select>';
					$("#compOrgId").append(html);
					$("#compOrgId").show();
					$('#page-wrapper').unmask();
				}
			});
}

function diaplyingAddView(){
	$('#page-wrapper').mask('Loading...'); 
	var orgId = 0;
	var orgName =0;
	var compOrgId = 0;
	var compOrgName =0;
	var sendClientInfo = {
		orgId : orgId,
		orgName : orgName,
		compOrgId : compOrgId,
		compOrgName : compOrgName,
	};
	$.ajaxSetup({
		cache : false
	});
	$('#clientCompetitorMappingTabButtons').hide();
	$('#addAndEditClientCompetitorMappingDiv').hide();
	$('#page-wrapper').mask('Loading...');
	clientCompetitorMappingDataDiv.html('');
	$('#clientCompetitorMappingDataDiv').html('');

	$.get(
			clientCompetitorMappingUrl + "fileterClientList.htm",
			sendClientInfo,
			function(response) {
				if (response.status == "LIST_SUCCESS") {
					var html = "";
					
					
					$("#orgId").show();
					$("#orgName").show();
					$("#compOrgId").show();
					$("#compOrgName").show();
					$("#drops").append(html);

					$('#selectedOrgIdType').val("0");
					$('#selectedOrgNameType').val("0");
					$('#selectedCompOrgIdType').val("0");
					$('#selectedCompOrgNameType').val("0");
					
					var html = listClientCompetitorMappingHtml(response);
					$('#clientCompetitorMappingTabButtons').show();
					clientCompetitorMappingDataDiv.append(html);
					$('#clientCompetitorMappingListTable').dataTable();
					$('#page-wrapper').unmask();
				} else {
					$('#clientCompetitorMappingDataDiv').append(
							'<font style="color:red">' + response.errorMessage
									+ '</font>');
				}

			}, 'json').fail(
			function(response) {
				clientCompetitorMappingDataDiv.mask(response.status
						+ "**********" + response.statusText);
			});
	return false;

}


function filterclientCompetitorMappingList() {
	var orgId = $("#selectedOrgIdType").val();
	var orgName = $("#selectedOrgNameType").val();
	var compOrgId = $("#selectedCompOrgIdType").val();
	var compOrgName = $("#selectedCompOrgNameType").val();
	var sendClientInfo = {
		orgId : orgId,
		orgName : orgName,
		compOrgId : compOrgId,
		compOrgName : compOrgName,
	};
	$.ajaxSetup({
		cache : false
	});
	$('#clientCompetitorMappingTabButtons').hide();
	$('#addAndEditClientCompetitorMappingDiv').hide();
	$('#page-wrapper').mask('Loading...');
	clientCompetitorMappingDataDiv.html('');
	$('#clientCompetitorMappingDataDiv').html('');
	console.log("sendClientInfo "+orgId+" "+orgName+" "+compOrgId+" "+compOrgName);
	$.get(
			clientCompetitorMappingUrl + "fileterClientList.htm",
			sendClientInfo,
			function(response) {
				if (response.status == "LIST_SUCCESS") {
					var html = "";
					/*$('#selectedOrgIdType').val(orgId);
					$('#selectedOrgNameType').val(orgName);
					$('#selectedCompOrgIdType').val(compOrgId);
					$('#selectedCompOrgNameType').val(compOrgName);*/
					
					$("#orgId").show();
					$("#orgName").show();
					$("#compOrgId").show();
					$("#compOrgName").show();
					$("#drops").append(html);

					/*	$('#selectedOrgIdType').val("0");
					$('#selectedOrgNameType').val("0");
					$('#selectedOrgNameType').prop("disabled", true);
					$('#selectedCompOrgIdType').val("0");
					$('#selectedCompOrgNameType').val("0");
					$('#selectedCompOrgNameType').prop("disabled", true);*/
					
					var html = listClientCompetitorMappingHtml(response);
					$('#clientCompetitorMappingTabButtons').show();
					clientCompetitorMappingDataDiv.append(html);
					$('#clientCompetitorMappingListTable').dataTable();
					$('#page-wrapper').unmask();
				} else {
					$('#clientCompetitorMappingDataDiv').append(
							'<font style="color:red">' + response.errorMessage
									+ '</font>');
				}

			}, 'json').fail(
			function(response) {
				clientCompetitorMappingDataDiv.mask(response.status
						+ "**********" + response.statusText);
			});
	return false;
}

//***********************Dileep edited in below method*******************//
function listClientCompetitorMappingHtml(response) {
	console.log(response);
	// featching filter list
	// var clientCompetitorMappingMasterList =
	// response.successObject.listClientCompetitorMapping;
	var clientCompetitorMappingMasterList = response.successObject.clienFiltertList;
	var html = "";
	html += '<form id="clientCompetitorMappingListForm">';
	html += '<div class="alert alert-success" style="display:none;"id="deleteClientCompetitorMappingSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;<strong> clientCompetitorMapping Deleted Successfully</strong></div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteClientCompetitorMappingErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='clientCompetitorMappingListTable'>";
	html += "<thead>";
	html += "<tr>";
	html += '<th><input type="checkbox" id="checkAllClientCompetitorMappingCheckBox"></th>';
	html += "<th>OrgId</th>";
	html += "<th>Client</th>";
	html += "<th>CompOrgId</th>";
	html += "<th>Competitor</th>";
	html += "<th></th>";
	html += "</tr>";
	html += "</thead>";
	html += "<tbody>";
	for (var i = 0; i < clientCompetitorMappingMasterList.length; i++) {
		var clientId = clientCompetitorMappingMasterList[i].clientId;
		var clientName = clientCompetitorMappingMasterList[i].clientName;
		var competitorList = clientCompetitorMappingMasterList[i].clientCompetitorList;
		// console.log("competitorList "+competitorList);
		var competitorId = '';
		var competitorName = '';
		var clientCompetitorMappingCheckBoxValue = '';
		var editButton = '';
		for (var j = 0; j < competitorList.length; j++) {
			//console.log("clientCompet--- id-- " + competitorList[j].clientId);
			competitorId += competitorList[j].competitor + '<html></br></html>';
			competitorName += competitorList[j].competitorName
					+ '<html></br></html>';
			editButton = competitorList[j].clientId;
			clientCompetitorMappingCheckBoxValue += competitorList[j].id
								+ " | ";
			//console.log("clientCompetitorMappingCheckBoxValue "+clientCompetitorMappingCheckBoxValue);
		}
		html += '<tr>';
		html += '<td><input type="checkBox" class="clientCompetitorMappingCheckBox" value='
				+ clientId + '></td>';
		html += '<td>' + clientId + '</td>';
		html += '<td>' + clientName + '</td>';
		html += '<td>' + competitorId + '</td>';
		html += '<td>' + competitorName + '</td>';
		html += '<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editClientCompetitorMapping('
				+ editButton
				+ ')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html += '</tr>';
	}
	html += "</tbody>";
	html += "</table>";
	html += '</form>';
	html += addDiv("ClientCompetitorMapping");
	return html;
}

//*****************old method not used****************//
function clientCompetitorMappingList() {
	$.ajaxSetup({
		cache : false
	});
	$('#clientCompetitorMappingTabButtons').hide();
	$('#page-wrapper').mask('Loading...');
	clientCompetitorMappingDataDiv.html('');
	$('#clientCompetitorMappingDataDiv').html('');
	$.get(
			clientCompetitorMappingUrl + "listTab.htm",
			function(response) {
				if (response.status == "LIST_SUCCESS") {
					$('#selectedOrgIdType').val("0");
					$('#selectedOrgNameType').val("0");
					$('#selectedOrgNameType').prop("disabled", true);
					$('#selectedCompOrgIdType').val("0");
					$('#selectedCompOrgNameType').val("0");
					$('#selectedCompOrgNameType').prop("disabled", true);
					var html = listClientCompetitorMappingHtml(response);
					// $('#clientCompetitorMappingTabButtons').show();
					clientCompetitorMappingDataDiv.append(html);
					$('#clientCompetitorMappingListTable').dataTable();
					$('#page-wrapper').unmask();
				} else {
					$('#clientCompetitorMappingDataDiv').append(
							'<font style="color:red">' + response.errorMessage
									+ '</font>');
				}
			}, 'json').fail(
			function(response) {
				clientCompetitorMappingDataDiv.mask(response.status
						+ "**********" + response.statusText);
			});
	return false;
}

/**************************************************************************************************************************
 *                      Add Client Source Mapping                                                                             *
 **************************************************************************************************************************/
function addClientCompetitorMapping() {
	$.ajaxSetup({
		cache : false
	});
	$('#page-wrapper').mask('Loading...');
	$.get(clientCompetitorMappingUrl + "add.htm", function(response) {
		console.log(response);
		var html = addClientCompetitorMappingFormHtml(response);
		var divId = $('#' + getDivId("ClientCompetitorMapping"));
		appendClientCompetitorMappingAddOrEditForm(divId, html);
		$('#page-wrapper').unmask();
	}, 'json').fail(
			function(response) {
				$('#page-wrapper')
						.append(
								response.status + "*************"
										+ response.statusText);
			});
	return false;
}

var listForUpdatingClients = [];
function addClientCompetitorMappingFormHtml(response) {
	var competitorNameList = response.successObject.competitorNameList;
	var clientNameList = response.successObject.clientNameList;
	var clientCompetitorList = response.successObject.clienFiltertList;
	listForUpdatingClients = competitorNameList;
	var selectedClientId = 0;
	if (clientNameList.length > 0) {
		selectedClientId = clientNameList[0].clientId;
	}

	// var clientId = response.successObject.clientId;console.log(clientId);
	var html = "";


	html += '<div class="col-sm-12 Action_heading">';
	html += '<h4>Add Client Competitor Mapping</h4>';
	html += '</div>';
	html += '<form id="addClientCompetitorMappingForm">';

	/**
	 * ***********Sucess Div**************
	 */
	html += '<div class="alert alert-success" style="display: none;"	id="addClientCompetitorMappingSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png">Client Competitor Mapping Added Successfully';
	html += '</div>';
	/**
	 * ******Error Div*******************
	 */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addClientCompetitorMappingErrorDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	/**
	 * ******Error Div*******************
	 */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="dropdownCompetitorMappingErrorDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg">please select a client</strong>';
	html += '</div>';
	
	/**
	 * ******Error Div*******************
	 */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="noCompetitorErrorDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Their Is No Competitors For Selected Client</strong>';
	html += '</div>';
	
	
	/**
	 * **********Client Name*******************
	 */
	html += '<div class="form-group" id="addClientNameDiv">';
	html += '<label id="addClientNameTypeId"><strong>Client Name<font style="color: red">*</font></strong></label>';
	html += '<select class="form-control input-sm" id="addClientName" style="width: 50%" onchange="showCompetitors()" >';
	html += '<option value="0">ALL</option>';
	for (var i = 0; i < clientNameList.length; i++) {
		var clientName = clientNameList[i].organizationFullName;
		var id = clientNameList[i].id;
		//console.log("clientName check "+clientName+" id"+id);
		html += '<option value=' + clientNameList[i].id + '>' + clientName
				+ '</option>';
	}
	html += '</select>';
	html += '</div>';

	/**
	 * ************Competitor Name**********
	 */
	html += '<div class="form-group" id="AddComperitorDiv">';
	html += '<label id="addCompetitorNameTypeId_" style=" background-color: #fff;  border: solid 1px #aaa; padding: 10px 20px; border-radius: 3px; display:none">';
	//html += '<input type="text" class="form-control input-sm"   maxlength="50" style="width: 80%" id="updateClients_" disabled>';
	html += '</label>';
	html += '</div>';

	html += '<div id="addCompetitor" style="width: 50%">';
	html += '</div>';

	html += '<div class="form-group">';
	html += '<button id="CompitiorType" onclick="addCompitior()" class="btn btn-default btn-xs" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Competitor</button>';
	html += '</div>';

	/** ************************************Button***************************************************** */
    html += '<input type="button" class="btn btn-primary" value="View" onclick ="dispalyOrganizationSourceMapping()">';
	html += appendCancelButton(getDivId("ClientCompetitorMapping"));
	html += '</form>';
	return html;
}

function dispalyOrganizationSourceMapping(){
	viewList();
	 diaplyingAddView();
	$("#addAndEditClientCompetitorMappingDiv").hide();
}

var listOfCompetitors = [];
function showCompetitors() {
	$('#page-wrapper').mask('Loading...');
	listOfCompetitors = [];
	$("#addCompetitorNameTypeId_").html('');
	console.log("count--- "+count);
	
	var selectedClientIdTypes = $("#addClientName option:selected").val();
	console.log("selectedClientIdTypes:- " + selectedClientIdTypes);
	$
			.ajax({
				type : "GET",
				url : "../clientCompetitorMapping/getSelectedCompetitor.htm?id="
						+ selectedClientIdTypes,
				dataType : "json",
				success : function(data) {
					var html = "";
					if (data.length == 0 && selectedClientIdTypes>0 ) {
						//$('#dropdownCompetitorMappingErrorDiv').hide();
						//$('#noCompetitorErrorDiv').show();
						alert(" Their Is No Competitors For Selected Client");
						$('#AddComperitorDiv').hide();
						$('#page-wrapper').unmask();
					}
					else if(selectedClientIdTypes==0){
						//$('#dropdownCompetitorMappingErrorDiv').show();
						//$('#noCompetitorErrorDiv').hide();
						alert(" Please select a Client");
						$('#AddComperitorDiv').hide();
						$('#page-wrapper').unmask();
					}else{
						//$('#dropdownCompetitorMappingErrorDiv').hide();
						//$('#noCompetitorErrorDiv').hide();
						html += '<label id="addClientNameTypeId_'
							+ count
							+ '"><strong>Competitor<font style="color: red">*</font></strong> </label>';
					html += '<div class="form-group input-group " id="myTable">';
					for (var i = 0; i < data.length; i++) {
						console.log("data " + data);
						count = count + 1;
						listOfCompetitors.push(data[i].competitor);
						html += '<input type="text" class="form-control input-sm" value="'
								+ data[i].competitorName
								+ '"  maxlength="50" id="updateClients_'
								+ data[i].competitor + '" style="width:80%">';
						html += '<button class="form-group input-group" 	type="button" id="competitorType'
								+ data[i].competitor
								+ '" onclick="deleteCompetitoTextBox('
								+ data[i].competitor
								+ ')"  > <span> <i class="glyphicon glyphicon-trash"></i></span></button>';
					}
					html += '</div>';
					
					$('#AddComperitorDiv').show();
					$("#addCompetitorNameTypeId_").append(html);
					$("#addCompetitorNameTypeId_").show();
					$('#page-wrapper').unmask();
					}
					$('#page-wrapper').unmask();
				}
			
			
			});
}

function deleteCompetitoTextBox(competitorID) {
	var index = 0;
	console.log("listOfCompetitors  = " + listOfCompetitors)
	for (var i = 0; i < listOfCompetitors.length; i++) {
		if (competitorID == listOfCompetitors[i]) {
			console.log(listOfCompetitors[i])
			index = listOfCompetitors.indexOf(listOfCompetitors[i]);
		}
	}
	console.log("listOfCompetitors next " + listOfCompetitors)
	var clientId = $('#addClientName').val();
	var competitorIds = competitorID;
	// console.log("competitorID "+competitorID+" clientId "+clientId);
	var sendClientCompetitorInfo = {
		clientId : clientId,
		competitorIds : competitorIds,
	};
	if (confirm("Do you want to delete selected competitor?")) {
		$.get(
				clientCompetitorMappingUrl + "deleteCompetitor.htm",
				sendClientCompetitorInfo,
				function(response) {
					if (response.status == "DELETE_SUCCESS") {
						if (index > -1) {
							listOfCompetitors.splice(index, 1);
						}
						console.log("listOfCompetitors next next-- "
								+ listOfCompetitors)
								if(listOfCompetitors == 0){
									$('#AddComperitorDiv').hide();
									$('addClientNameTypeId_'+competitorID).hide();
								}
						$("#updateClients_" + competitorID).remove();
						$("#competitorType" + competitorID).remove();
						$("addAndEditClientCompetitorMappingDiv").show();
					} else {
						$('#clientCompetitorMappingDataDiv').append(
								'<font style="color:red">'
										+ response.errorMessage + '</font>');
					}
				}, 'json').fail(
				function(response) {
					clientCompetitorMappingDataDiv.mask(response.status
							+ "**********" + response.statusText);
				});
	}
}

function addCompitior() {
	countComp = countComp + 1;
	var html = "";
	html += '<label id="addClientNameTypeId_'
			+ countComp
			+ '"><strong>Select Organization and Add to Competitor Container</strong> </label>';
	html += '<div class="form-group input-group" id="addCompetitorTable_'
			+ countComp + '">';
	html += '<select class="form-control input-sm" id="addCompetitor_'
			+ countComp + '" style="width: 50%"  >';
	for (var i = 0; i < listForUpdatingClients.length; i++) {
		html += '<option value="' + listForUpdatingClients[i].id + '" >'
				+ listForUpdatingClients[i].organizationFullName + '</option>';
	}
	html += '</select>';
	html += '<input type="button" class="btn btn-primary" value="Add to Container" onclick ="saveClientCompetitor('
			+ countComp + ')">';
	html += '</div>';
	$("#addCompetitor").append(html);
}

function saveClientCompetitor(countComp) {
	$('#addCompetitorTable_'+ countComp).hide();
	$('#addClientNameTypeId_'+ countComp).hide();
	$.ajaxSetup({
		cache : false
	});
	if($('#addClientName').val() == 0){
		alert("Plese, select the Clint Name");
		$("addAndEditClientCompetitorMappingDiv").show();
		return false;
	}else{
	var competitorId = $('#addCompetitor_' + countComp).val();
	for (var i = 0; i < listOfCompetitors.length; i++) {
		console.log("inside   for  -");
		if (listOfCompetitors[i] == competitorId) {
			alert("Selected Competitor Alredy Exist,Please Select Other Competitor");
			$("addAndEditClientCompetitorMappingDiv").show();
			return false;
		}
	}
	listOfCompetitors.push(competitorId);
	// console.log("listOfCompetitors next"+listOfCompetitors);
	var competitorIds = listOfCompetitors;
	var clientId = $('#addClientName').val();
	if(clientId == 0){
		//alert("Plese, select the Clint Name");
	}else{
	
	var JSONObject = {
		'clientId' : clientId,
		'competitorIds' : competitorIds
	};
	
	if (clientId != competitorId) {
	
		if (competitorIds.length > 0) {
			console.log("check-----3");
			$('#page-wrapper').mask('Loading...');
			$
					.ajax({
						type : "POST",
						url : clientCompetitorMappingUrl
								+ "saveClientCompetitors.htm",
						contentType : "application/json",
						data : JSON.stringify(JSONObject),
						
						success : function(response) {
							//console.log(response);
							console.log("JSONObject "+JSONObject);
							if (response.status == "SAVE_SUCCESS") {
								
								showCompetitors();
								$("addClientCompetitorMappingSuccessDiv").show();
								$("#addCompetitorNameTypeId_").show();
								$("addAndEditClientCompetitorMappingDiv")
										.show();
								$("addAndEditClientCompetitorMappingDiv")
										.show();
								$('#page-wrapper').unmask();
							} else if (response.status == "SAVE_ERROR") {
								scrollDown(divId);
								$('#addClientCompetitorErrorDiv').html('');
								var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'
										+ response.errorMessage + '</strong>';
								$('#addClientCompetitorErrorDiv').append(
										errorMessage);
								$('#addClientCompetitorErrorDiv').show(600);
								$('input:checkbox').removeAttr('checked');
								selectedClientCompetitorIds = [];
								$('#page-wrapper').unmask();
							}
						},
						error : function(response) {
							$('#page-wrapper').mask(
									response.status + "*********"
											+ response.statusText);
						}
					});
			return false;
		} else {
			$('#clientCompetitorMappingSuccessModalTitle').text("Alert");
			$('#clientCompetitorMappingSuccessModalText').text(
					"please select a record !");
			$('#clientCompetitorMappingSuccessModal').modal('show');
			return false;
		}

	} else {
		alert(" Client and Competitor not to be Same");
		showCompetitors();
		//$("#addCompetitorNameTypeId_").append(html);
		$("#addCompetitorNameTypeId_").show();
		$("addAndEditClientCompetitorMappingDiv").show();
		$("addAndEditClientCompetitorMappingDiv").show();
		$('#page-wrapper').unmask();
	}
	
}
	}
}

function deleteTextBox(countComp) {
	$("#addClientNameTypeId_" + countComp).html('');
	$("#addCompetitor_" + countComp).parent().remove();
	countComp--;
}

function saveOrganizationSourceMapping(){
	 $.ajaxSetup({ cache: false });
	 var divId = getDivId("ClientCompetitorMapping");
	 selectedClientCompetitorMappingCheckBoxLength();
	 var clientId=$('#addClientName').val();
		var competitorIds=selectedIds('addOrganizationSourceMappingCheckBox');	
		var JSONObject = {'clientId':clientId,'competitorIds':competitorIds};
		console.log(JSONObject);
	if(competitorIds.length>0){
			$('#page-wrapper').mask('Loading...');
			$('#addClientCompetitorSuccessDiv').hide();
			$('#addClientCompetitorErrorDiv').hide();
			$.ajax({
				type:"POST",
				url:clientCompetitorMappingUrl+"save.htm",
				contentType:"application/json",
				data:JSON.stringify(JSONObject),
				success:function(response){console.log(response);
					if(response.status=="SAVE_SUCCESS"){
						$('#addClientCompetitorMappingSuccessDiv').show(600);
						//clientCompetitorMappingList();
						filterclientCompetitorMappingList();
						listForUpdatingClients = [];
					}else if(response.status=="SAVE_ERROR"){
						scrollDown(divId);
						$('#addClientCompetitorErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#addClientCompetitorErrorDiv').append(errorMessage);
						$('#addClientCompetitorErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedClientCompetitorIds = [];
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}else{
			$('#clientCompetitorMappingSuccessModalTitle').text("Alert");
			$('#clientCompetitorMappingSuccessModalText').text("please select a record !");
			$('#clientCompetitorMappingSuccessModal').modal('show');
		return false;
	}	
}

/**************************************************************************************************************************
 *                    Edit Client Competitor Mapping	                                                                              *
 **************************************************************************************************************************/
function editClientCompetitorMapping(id){
	$('#page-wrapper').mask('Loading...');
	console.log("edited id:---"+id);
	$.get(clientCompetitorMappingUrl+"edit.htm?id="+id,function(response){
		var html = clientCompetitorMappingEditFormHtml(response);
		var divId = $('#'+getDivId("ClientCompetitorMapping"));
		appendClientCompetitorMappingAddOrEditForm(divId, html);
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	});
	return false;
}
function clientCompetitorMappingEditFormHtml(response){
	var selectedClientIds = [];
	var competitorNameList = response.successObject.competitorNameList;
	var clientNameList = response.successObject.clientNameList;
	var clientId = response.successObject.clientId;
	
	var listOfSelectedIds = response.successObject.listAllSelectedIds;
	
	for(var i=0;i<listOfSelectedIds.length;i++){
		var selectedClientId = listOfSelectedIds[i].competitor;
		selectedClientIds.push(selectedClientId);
	}
	console.log(selectedClientIds);
	
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html +=	'<h4>Edit Client Competitor Mapping</h4>';
	html+=	'</div>';
	html += '<form id="editClientCompetitorMappingForm">';
	
	/** ***********************************Sucess Div******************************************************** */
	html += '<div class="alert alert-success" style="display: none;"	id="editClientCompetitorMappingSuccessDiv">';
	html += '<strong>&nbsp;<img alt="../" src="../resources/images/done.png"> Client Competitor Mapping Updated Successfully</strong>';
	html += '</div>';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editClientCompetitorMappingErrorDiv">';
	html+=	'<strong>&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check</strong>';
	html += '</div>';
	
	/** ************************************Client Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label><strong>Client Name<font style="color: red">*</font></strong></label>';
	html +=	'<select class="form-control input-sm" disabled="disabled" id="editedClientName" style="width: 50%" >';
	var clientNameForcompare;
	for(var i=0;i<clientNameList.length;i++){
		var clientName = clientNameList[i].clientName;
		var id = clientNameList[i].clientId;
		if(clientId.id==id){
			clientNameForcompare=clientName;
			html+=	'<option value='+id+'>'+clientName+'</option>';
	}}
	html +=	'</select>';
	html += '</div>';
	
	
	/** ************************************Competitor Name***************************************************** */
	html += '<div class="form-group" id="Add-comperitor-Error">';
	html += '<label><strong>Competitor Name<strong></label>';
	html +='<table>';
	for(var i=0;i<competitorNameList.length;i++){
		var organizationFullName = competitorNameList[i].organizationFullName;
		var id  = competitorNameList[i].id;
		html +='<tr>';
		if(selectedClientIds.indexOf(id)>-1){
			html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" checked="checked" value='+id+'></td>';
		}else if(clientId.id!=id){
			if(organizationFullName==clientNameForcompare){
				html+=	'<td></td>';
			}else{
				html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" value='+id+'></td>';
			}

		}if(clientId.id!=id){
			if(organizationFullName==clientNameForcompare){
				html +='<td></td>';
			}else{
				html +='<td>'+organizationFullName+'</td>';
			}
		}
		html +='</tr>';
	}
	
	html +='</table>';
    html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganizationSourceMapping()">';
	html +=	appendCancelButton(getDivId("ClientCompetitorMapping"));
	html +=	'</form>';
	return html;
}


function updateOrganizationSourceMapping(){
		 $.ajaxSetup({ cache: false });
		 var divId = $('#'+getDivId("ClientCompetitorMapping"));
		 selectedClientCompetitorMappingCheckBoxLength();
		 var id=$('#editedClientName').val();
			var ids=selectedIds('organizationSourceMappingCheckBox');
			var JSONObject = {'clientId':id,'competitorIds':ids};
		if(ids.length>0){
				$('#page-wrapper').mask('Loading...');
				$('#deleteClientCompetitorSuccessDiv').hide();
				$('#deleteClientCompetitorErrorDiv').hide();
				$.ajax({
					type:"POST",
					url:clientCompetitorMappingUrl+"update.htm",
					contentType:"application/json",
					data:JSON.stringify(JSONObject),
					success:function(response){console.log(response);
						if(response.status=="UPDATE_SUCCESS"){
							$('#editClientCompetitorMappingSuccessDiv').show(600);
							//clientCompetitorMappingList();
							//**********Dileep Changed method Name**************//
							filterclientCompetitorMappingList();
						}else if(response.status=="DELETE_ERROR"){
							scrollDown(divId);
							$('#deleteClientCompetitorErrorDiv').html('');
							var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
							$('#editClientCompetitorMappingErrorDiv').append(errorMessage);
							$('#editClientCompetitorMappingErrorDiv').show(600);
							$('input:checkbox').removeAttr('checked');
							selectedClientCompetitorIds = [];
							$('#page-wrapper').unmask();
						}
					},error:function(response){
						$('#page-wrapper').mask(response.status+"*********"+response.statusText);
					}
				});
				return false;
		}else{
			$('#clientCompetitorMappingSuccessModalTitle').text("Alert");
			$('#clientCompetitorMappingSuccessModalText').text("Please select a Competitor!");
			$('#clientCompetitorMappingSuccessModal').modal('show');
			return false;
		}
		
	}

/**************************************************************************************************************************
 *                     Delete client Competitor Mapping  Master                                                                        *
 **************************************************************************************************************************/
function deleteClientCompetitorMapping(){
	selectedClientCompetitorMappingIds=[];
	 $.ajaxSetup({ cache: false });
	 selectedClientCompetitorMappingCheckBoxLength();
	if(selectedClientCompetitorMappingIds.length>0){
		console.log("selectedClientCompetitorMappingIds"+selectedClientCompetitorMappingIds);
		if(confirm("Do you want to delete selected record(s) for client and competitor?, If you want to delete respective Competitor please, go through Edit option")){
			$('#page-wrapper').mask('Loading...');
			clearClientCompetitorMappingMessageDiv();
			$.ajax({
				type:"POST",
				url:clientCompetitorMappingUrl+"deleteClientCompetitor.htm",
				contentType:"application/json",
				data:JSON.stringify(selectedClientCompetitorMappingIds),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						$('#clientCompetitorMappingTabButtons').hide();
						var html = listClientCompetitorMappingHtml(response);
						clientCompetitorMappingDataDiv.html(html);
						$('#deleteClientCompetitorMappingSuccessDiv').show(600);
						$('#clientCompetitorMappingTabButtons').show();
						$('#clientCompetitorMappingListTable').dataTable();
						$('#page-wrapper').unmask();
						selectedClientCompetitorMappingIds = [];
					}else if(response.status=="DELETE_ERROR"){
						$('#deleteClientCompetitorMappingErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> <strong>'+response.errorMessage+'</strong>';
						$('#deleteClientCompetitorMappingErrorDiv').append(errorMessage);
						$('#deleteClientCompetitorMappingErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						selectedClientCompetitorMappingIds = [];
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		$('#clientCompetitorMappingSuccessModalTitle').text("Alert");
		$('#clientCompetitorMappingSuccessModalText').text("please select a record !");
		$('#clientCompetitorMappingSuccessModal').modal('show');
		return;
	}
	
}

/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllClientCompetitorMappingCheckBox",function(){
    $('.clientCompetitorMappingCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".clientCompetitorMappingCheckBox",function(){
    if($('.clientCompetitorMappingCheckBox:checked').length == $('.clientCompetitorMappingCheckBox').length) {
      $('#checkAllClientCompetitorMappingCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllClientCompetitorMappingCheckBox').prop('checked', false);
    }
});

function selectedClientCompetitorMappingCheckBoxLength() {
	if ($('.clientCompetitorMappingCheckBox:checked').length) {
		selectedGeoCountryIds = [];
		$('.clientCompetitorMappingCheckBox:checked').each(function() {
			selectedClientCompetitorMappingIds.push($(this).val());
		});
	}
	return false;
}



function appendClientCompetitorMappingAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearClientCompetitorMappingMessageDiv();
	maskId.unmask();
}
function clearClientCompetitorMappingMessageDiv(){
	$('#addClientCompetitorMappingSuccessDiv,#editClientCompetitorMappingSuccessDiv,#editClientCompetitorMappingSuccessDiv,#deleteClientCompetitorMappingSuccessDiv,#deleteClientCompetitorMappingErrorDiv').hide(600);
}