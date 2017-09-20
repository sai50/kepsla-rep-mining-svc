
var sourceData=[];
var idValue;
var organizationFullNameForUpdate;
var sourceNameForUpdate;
var sourceTypeForUpdate;
var orgNameAndIdList=[]

function organizationSourceMappingList(){
	
	if($("#searchByOrgId").val().length!==0){
		idValue=$("#searchByOrgId").val();
	}
//	var orgId=$('#selectOrgId option:selected').val();
	var sourceNameId=$('#selectSourceNameId option:selected').val();
	$("#editOrganizationSourceMappingSuccessDiv").hide();
	$("#addOrganizationSourceMappingSuccessDiv").hide();
	$("#addAndEditOrganizationSourceMappingDiv").hide();

	$.ajaxSetup({ cache: false });
	$('#page-wrapper').mask('Loading...');
	$('#organizationSourceMappingDataDiv').html('');
	$.get(organizationSourceMappingUrl+"viewTable.htm?orgId="+idValue+"&sourceNameId="+sourceNameId+"&sourceMasterFilter=",function(response){
		if(response.status=="LIST_SUCCESS"){
			
			var html = listOrganizationSourceMappingHtml(response);
			$('#organizationSourceMappingDataDiv').append(html);
			$('#organizationSourceMappingDataDiv').show();
			$('#organizationSourceMappingListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#organizationSourceMappingDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	},'json').fail(function(response){
		organizationSourceMappingDataDiv.mask(response.status+"**********"+response.statusText);
	});
	return false;
}
function editOrganizationSourceMappingWithoutAJAX(index){
	var organizationSourceMappingMasterObject = organizationSourceMappingMasterList[index];
	$('#page-wrapper').mask('Loading...');
	$('#addAndEditOrganizationSourceMappingDiv').hide();
	$("#organizationSourceMappingDataDiv").hide();
	var html = organizationSourceMappingEditFormWithoutAJAX(organizationSourceMappingMasterObject);
	var divId = $('#'+getDivId("OrganizationSourceMapping"));
	appendOrganizationSourceMappingAddOrEditForm(divId, html);
}
function listOrganizationSourceMappingHtml(response) {
	organizationSourceMappingMasterList = response.successObject.listOrganizationSourceMapping;
	//var listOrgIdAndName = response.successObject.listOrgIdAndName;
	
	var html = "";
	html += '<form id="organizationSourceMappingListForm">';
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteOrganizationSourceMappingSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp;organizationSourceMapping Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationSourceMappingErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped dataTable no-footer' id='organizationSourceMappingListTable'>";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllOrganizationSourceMappingCheckBox" style="margin-left: -7px;"></th>';
	html +=	"<th>OrgID</th>";
	html +=	"<th>OrganizationFullName</th>";
	html +=	"<th>Source Type</th>";
	html +=	"<th>Source Name</th>";
	html +=	"<th>Source Priority</th>";
	html +=	"<th>Source Mapping Attribute</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<organizationSourceMappingMasterList.length;i++){
		var id = organizationSourceMappingMasterList[i].id;
		var organizationId = organizationSourceMappingMasterList[i].organizationId;
		var OrganizationFullName = organizationSourceMappingMasterList[i].organizationFullName;
		var SourceType = organizationSourceMappingMasterList[i].sourceType;
		var sourceName = organizationSourceMappingMasterList[i].sourceName;
		var SourcePriority = organizationSourceMappingMasterList[i].priority;
		if(SourcePriority==null){
			SourcePriority="";
		}
		var organizationSourceLink="";
		
		if(organizationSourceMappingMasterList[i].organizationSourceLink!==null && organizationSourceMappingMasterList[i].organizationSourceLink!=='null'
			&& organizationSourceMappingMasterList[i].organizationSourceLink!=='NULL' ){
			organizationSourceLink=	organizationSourceMappingMasterList[i].organizationSourceLink.replace(/KePsLa/g,"%");
		}
		//var organizationSourceLink = organizationSourceMappingMasterList[i].organizationSourceLink;
		var apiKey = organizationSourceMappingMasterList[i].apiKey;
		if(apiKey==null || apiKey=='NULL' || apiKey=='null'|| apiKey=='Null'){
			apiKey="";
		}
		
		if(organizationSourceLink==null || organizationSourceLink=='NULL' || organizationSourceLink=='null'|| organizationSourceLink=='Null'){
			organizationSourceLink="";
		}
		var temp="";
		
		if(organizationSourceLink != "" && apiKey!="")
			temp = temp+"|"+apiKey;
		if(organizationSourceLink != "")
			temp = organizationSourceLink;
		if(apiKey != "")
			temp = apiKey;
		if(organizationSourceLink == "" && apiKey == "")
			temp = ""
		
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationSourceMappingCheckBox" value='+id+'></td>';
		html+=	'<td>'+organizationId+'</td>';
		html+=	'<td>'+OrganizationFullName+'</td>';
		html+=	'<td>'+SourceType+'</td>';
		html+=	'<td>'+sourceName+'</td>';
		html+=	'<td>'+SourcePriority+'</td>';
		html+=	'<td>'+temp+'</td>';
		html+=	'<td><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editOrganizationSourceMappingWithoutAJAX('+ i +')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("OrganizationSourceMapping");
	return html;

}
function enableSourceTab(){
	var orgIdEnable=$("#searchByOrgId").val();
	if(orgIdEnable.length!==0){
		$("#selectSourceNameId").prop("disabled",false);
		$("#viewList").prop("disabled",false);
		$("#addOrgButton").prop("disabled",false);
		//$("#deleteOrgButton").prop("disabled",false);
		
	}else if(orgIdEnable.length==0){
		$("#selectSourceNameId").prop("disabled",true);
		$("#viewList").prop("disabled",true);
		$("#addOrgButton").prop("disabled",true);
	//	$("#deleteOrgButton").prop("disabled",true);
	}
}
function loadAllHotels(){
	loadSources();
if(sessionStorage.getItem("orgListandIds")!==undefined && sessionStorage.getItem("orgListandIds")!==null){
	var data=sessionStorage.getItem("orgListandIds");
	callAutocomplete(JSON.parse(data));
}
else{	
	$.ajax({
		url:"../organizationSourceMapping/loadOrgs.htm",
		dataType:"json",
		success:function(data){
			sessionStorage.setItem("orgListandIds",JSON.stringify(data));
			callAutocomplete(data)
		}
	})
}
}
function callAutocomplete(data){
	$("#searchByText").autocomplete({
		maxShowItems:5,
		minLength:2,
		autoFocus: true,
		source:data,
		select:function(event,ui){
			$("#selectSourceNameId").prop("disabled",false);	
			$("#viewList").prop("disabled",false);
			$("#addOrgButton").prop("disabled",false);
		//	$("#deleteOrgButton").prop("disabled",false);
			idValue=ui.item.idValue;
		}


});
}
function loadSources(){

	$.ajax({
		url:"../organizationSourceMapping/loadSources.htm",
		dataType:"json",
		success:function(data){
			sourceData=data;
			sessionStorage.setItem("listSources",JSON.stringify(data));
			loadSourceNames(data);
		}
	})
}
function loadSourceNames(sourceDataLocal){
	var html='	<select id="selectSourceNameId" class="form-control input-sm" disabled="disabled" style="width: 100px;" onchange="clearMessage()">';
	html+='<option selected="selected" value="0">All</option>'
		for (var i = 0; i < sourceDataLocal.length; i++) {
			html += '<option value="'+sourceDataLocal[i].label+'">'
			+ $
			.trim(sourceDataLocal[i].value)
			+ '</option>';
		}
	html+='</select>';
	$("#appendSourceFieldNames").append(html)
}


function showTextOrIdField(){
	var orgType=$('#searchBySelectId option:selected').val();
	$("#selectSourceNameId").prop("disabled",true);
	$("#viewList").prop("disabled",true);
	$("#addOrgButton").prop("disabled",true);
	//$("#deleteOrgButton").prop("disabled",true);
	if(orgType=='searchByIdOption'){
		$("#searchByText").hide();
		$("#searchByText").val('');
		$("#searchByOrgId").show();
	}else if(orgType=='searchByTextOption'){
		$("#searchByOrgId").hide();
		$("#searchByOrgId").val('');
		$("#searchByText").show();
	}else{
		$("#searchByOrgId").hide();
		$("#searchByOrgId").val('');
		$("#searchByText").val('');
		$("#searchByText").hide();
	}
}



function appendOrganizationSourceMappingAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	clearOrganizationSourceMappingMessagesDiv();
	maskId.unmask();
}
function clearOrganizationSourceMappingMessagesDiv(){
	$('#addOrganizationSourceMappingSuccessDiv,#editOrganizationSourceMappingSuccessDiv,#deleteOrganizationSourceMappingSuccessDiv,#deleteOrganizationSourceMappingErrorDiv').hide(600);
}
function organizationSourceMappingEditFormWithoutAJAX(organizationSourceMappingMasterObject){

	//var organizationScrapingNameList = response.successObject.organizationSourceMappingEditRecord;
	organizationFullNameForUpdate=organizationSourceMappingMasterObject.organizationFullName;
	sourceNameForUpdate=organizationSourceMappingMasterObject.sourceName;
	sourceTypeForUpdate=organizationSourceMappingMasterObject.sourceType;
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading">';
	html +=	'<h4>Edit organization Source Mapping</h4>';
	html+=	'</div>';
	html += '<form class="col-sm-5" id="editOrganizationSourceMappingForm">';
	/** ***********************************Sucess Div******************************************************** */
	/*html += '<div class="alert alert-success" style="display: none;"	id="editOrganizationSourceMappingSuccessDiv">';
	html += '&nbsp;<img alt="../" src="../resources/images/done.png"> organization Source Mapping Updated Successfully';
	html += '</div>';*/
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editOrganizationSourceMappingErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Organization Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control input-sm" id="editOrganizationName" disabled="disabled">';
	
		var organizationFullName = organizationSourceMappingMasterObject.organizationFullName;
		var organizationId =  organizationSourceMappingMasterObject.organizationId;
		var organizationSelectedId=organizationSourceMappingMasterObject.id;
		html+=	'<option value='+organizationId+'>'+organizationFullName+'</option>';
		/*if(id==organizationSelectedId){
			html+=	'<option value='+organizationId+'>'+organizationFullName+'</option>';
			break;
		}	*/
	
	html +=	'</select>';
	html += '</div>';
	/** ************************************Source Name***************************************************** */
	html += '<div class="form-group">';
	html += '<label>Source Name<font style="color: red">*</font></label>';
	html +=	'<select class="form-control input-sm" id="editedSourceNameId" disabled="disabled">';
	
		var sourceName = organizationSourceMappingMasterObject.sourceName;
		var sourceId = organizationSourceMappingMasterObject.sourceId;
		var sourceSelectedId=organizationSourceMappingMasterObject.id;
		html+=	'<option value='+sourceId+'>'+sourceName+'</option>';
		organizationSourceName=sourceName;
		/*if(id==sourceSelectedId){
			html+=	'<option value='+sourceId+'>'+sourceName+'</option>';
			organizationSourceName=sourceName;
			break;
		}*/
	
	html +=	'</select>';
	html += '</div>';
	
	//@m edit
	/** ************************************ Priority***************************************************** */
	html += '<div class="form-group" id="Edit-priority-Error">';
	html += '<label>Priority<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-priority-span-Error" class="help-inline"></span>';
	html +=	'<select class="form-control input-sm" id="editedPriority">';
	//html += '<option  value="0"></option>';
	
		var id = organizationSourceMappingMasterObject.id;
		var priority = organizationSourceMappingMasterObject.priority;
	
		if(priority == null || priority ==''){
		html += '<option  value="0">--------SELECT--------</option>';
		html+=	'<option value="HIGH">HIGH</option>';
		html+=	'<option value="MEDIUM">MEDIUM</option>';
		html+=	'<option value="LOW">LOW</option>';
		}else{
			html+=	'<option value='+priority+'>'+priority+'</option>';
			html+=	'<option value="HIGH">HIGH</option>';
			html+=	'<option value="MEDIUM">MEDIUM</option>';
			html+=	'<option value="LOW">LOW</option>';

		}
		
	html +=	'</select>';
	html += '</div>';
	
	/** ************************************Organization Scraping Name***************************************************** */
	html += '<div class="form-group" id="Edit-organizationScrapingName-Error">';
	html += '<label>Search Key String<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-organizationScrapingName-span-Error" class="help-inline"></span>';
	
		var organizationScrapingName = organizationSourceMappingMasterObject.organizationScrapingName;
		var id = organizationSourceMappingMasterObject.id;
	html += '<input	type="text" value="'+organizationScrapingName+'" class="form-control input-sm" id="editedOrganizationScrapingName" placeholder="Enter organization Scraping Name" maxlength="150">';
	html += '<input	type="hidden" value="'+id+'" class="form-control input-sm" id="hiddenId">';
	
	
	html += '</div>';	
	
	
	/** ************************************Organization Scrapping Source URL***************************************************** */
	html += '<div class="form-group" id="Edit-organizationSourceLink-Error">';
	html += '<label>Organization Source Scrapping URL</label>';
	html += '<span style="color: #a94442" id="edit-organizationSourceLink-span-Error" class="help-inline"></span>';
	
		var organizationSourceLink = organizationSourceMappingMasterObject.organizationSourceLink;
		if(organizationSourceLink==null)
		{
			organizationSourceLink="";
			html += '<input	type="text" value="'+organizationSourceLink+'" class="form-control input-sm" id="editedOrganizationSourceLink" placeholder="Enter Source URL" maxlength="200">';
		}else{
			organizationSourceLink=	organizationSourceLink.replace(/KePsLa/g,"%");
			html += '<input	type="text" value="'+organizationSourceLink+'" class="form-control input-sm" id="editedOrganizationSourceLink" placeholder="Enter Source URL" maxlength="200">';

		}
		
	
	html += '</div>';	
	
	
	/** ************************************Username***************************************************** */
	html += '<div class="form-group" id="Edit-organizationUsername-Error">';
	html += '<label>Username</label>';
	html += '<span style="color: #a94442" id="edit-organizationUsername-span-Error" class="help-inline"></span>';
	
		var organizationUsername = organizationSourceMappingMasterObject.sourceLogin;
		if(organizationUsername==null)
		{
			organizationUsername="";
			html += '<input	type="text" value="'+organizationUsername+'" class="form-control input-sm" id="editedOrganizationUsername" placeholder="Enter Username" maxlength="50">';
		}else{
			html += '<input	type="text" value="'+organizationUsername+'" class="form-control input-sm" id="editedOrganizationUsername" placeholder="Enter Username" maxlength="50">';

		}
		
	
	html += '</div>';
	
	
	/** ************************************Password***************************************************** */
	html += '<div class="form-group" id="Edit-organizationPassword-Error">';
	html += '<label>Password</label>';
	html += '<span style="color: #a94442" id="edit-organizationPassword-span-Error" class="help-inline"></span>';
	
		var organizationPassword = organizationSourceMappingMasterObject.sourcePass;
		if(organizationPassword==null)
		{
			organizationPassword="";
			html += '<input	type="text" value="'+organizationPassword+'" class="form-control input-sm" id="editedOrganizationPassword" placeholder="Enter Password" maxlength="50">';
		}else{
			html += '<input	type="text" value="'+organizationPassword+'" class="form-control input-sm" id="editedOrganizationPassword" placeholder="Enter Password" maxlength="50">';

		}
		
	
	html += '</div>';
	/** ************************************Source URL(ReplyToReview)***************************************************** */
	html += '<div class="form-group" id="Edit-sourceUrl-Error">';
	html += '<label>Source URL(ReplyToReview)</label>';
	html += '<span style="color: #a94442" id="edit-sourceUrl-span-Error" class="help-inline"></span>';
	
		var sourceUrl = organizationSourceMappingMasterObject.sourceUrl;
		if(sourceUrl==null)
		{
			sourceUrl="";
			html += '<input	type="text" value="'+sourceUrl+'" class="form-control input-sm" id="editedOrganizationSourceUrl" placeholder="Enter Source URL(ReplyToReview)" maxlength="200">';
		}else{
			html += '<input	type="text" value="'+sourceUrl+'" class="form-control input-sm" id="editedOrganizationSourceUrl" placeholder="Enter Source URL(ReplyToReview)" maxlength="200">';

		}
		
	
	html += '</div>';
	/** ************************************Source URL(ReplyToReview) END***************************************************** */
	

	
	/************************************** For Twitter******************************************************/
	
	if(organizationSourceName=="Twitter"){
		html += '<div class="form-group" id="Edit-apiKey-Error">';
		html += '<label>Consumer Key</label>';
		html += '<span style="color: #a94442" id="edit-apiKey-span-Error" class="help-inline"></span>';
		
			var organizationApiKey = organizationSourceMappingMasterObject.apiKey;
			if(organizationApiKey==null){
				organizationApiKey="";
				html += '<input	type="text" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Consumer key" maxlength="50">';

			}else{
				
				html += '<input	type="text" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Consumer key" maxlength="50">';
			}
		
		html += '</div>';	
		/** ************************************ Secret Key***************************************************** */
		html += '<div class="form-group" id="Edit-secretKey-Error">';
		html += '<label>Consumer Secret Key</label>';
		html += '<span style="color: #a94442" id="edit-secretKey-span-Error" class="help-inline"></span>';
		
			var organizationSecretKey = organizationSourceMappingMasterObject.secretKey;
			if(organizationSecretKey==null){
				organizationSecretKey="";
				html += '<input	type="text" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Consumer Secret Key" maxlength="50">';

			}else{
				
				html += '<input	type="text" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Consumer Secret Key" maxlength="50">';
			}
		
		html += '</div>';
		
		/** ************************************ Access Token Key***************************************************** */
		
		html += '<div class="form-group" id="Edit-accessToken-Error">';
		html += '<label>accessToken</label>';
		html += '<span style="color: #a94442" id="edit-accessToken-span-Error" class="help-inline"></span>';
		
			var organizationacessTokenSecretKey = organizationSourceMappingMasterObject.accessToken;
			if (organizationacessTokenSecretKey==null) {
				organizationacessTokenSecretKey="";
				html += '<input	type="text" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessToken" placeholder="Enter access Token" maxlength="50">';

			} else {

				html += '<input	type="text" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessToken" placeholder="Enter access Token" maxlength="50">';
			}
		
		html += '</div>';
		
		/** ************************************ Access Token Secret Key***************************************************** */
		
		html += '<div class="form-group" id="Edit-accessTokenSecret-Error">';
		html += '<label>Access Token Secret</label>';
		html += '<span style="color: #a94442" id="edit-accessTokenSecret-span-Error" class="help-inline"></span>';
		console.log(organizationScrapingNameList);
			var organizationacessTokenSecretKey = organizationSourceMappingMasterObject.accessTokenSecret;
			if (organizationacessTokenSecretKey==null) {
				organizationacessTokenSecretKey="";
				html += '<input	type="text" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Access Token Secret" maxlength="50">';

			} else {

				html += '<input	type="text" value="'+organizationacessTokenSecretKey+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Access Token Secret" maxlength="50">';
			}
		
		html += '</div>';
		}else{
	
	/** ************************************ Api Key***************************************************** */
	html += '<div class="form-group" id="Edit-apiKey-Error">';
	html += '<label>Api Key</label>';
	html += '<span style="color: #a94442" id="edit-apiKey-span-Error" class="help-inline"></span>';

		var organizationApiKey = organizationSourceMappingMasterObject.apiKey;
		
		if (organizationApiKey==null) {
			organizationApiKey="";
			html += '<input	type="text" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Api key" maxlength="50">';

		} else {
			html += '<input	type="text" value="'+organizationApiKey+'" class="form-control input-sm" id="editedApiKey" placeholder="Enter Api key" maxlength="50">';

		}
	
	html += '</div>';	
	
	/** ************************************ Secret Key***************************************************** */
	html += '<div class="form-group" id="Edit-secretKey-Error">';
	html += '<label>App Secret Key</label>';
	html += '<span style="color: #a94442" id="edit-secretKey-span-Error" class="help-inline"></span>';
	
		var organizationSecretKey = organizationSourceMappingMasterObject.secretKey;
		if (organizationSecretKey==null) {
			organizationSecretKey="";
			html += '<input	type="text" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Secret Key" maxlength="50">';

		} else {

			html += '<input	type="text" value="'+organizationSecretKey+'" class="form-control input-sm" id="editedSecretKey" placeholder="Enter Secret Key" maxlength="50">';
		}
	
	html += '</div>';
	/** ************************************ PAGE ID***************************************************** */
	html += '<div class="form-group" id="Edit-secretKey-Error">';
	html += '<label>Page ID</label>';
	html += '<span style="color: #a94442" id="edit-secretKey-span-Error" class="help-inline"></span>';
	
		var pageId = organizationSourceMappingMasterObject.pageId;
			if (pageId==null) {
				pageId="";
				html += '<input	type="text" value="'+pageId+'" class="form-control input-sm" id="editedPageId" placeholder="Enter Secret Key" maxlength="50">';

			} else {

				html += '<input	type="text" value="'+pageId+'" class="form-control input-sm" id="editedPageId" placeholder="Enter Secret Key" maxlength="50">';
			}
	
	html += '</div>';
	
	/** ************************************ Token Secret Key***************************************************** */
	html += '<div class="form-group" id="Edit-secretKey-Error">';
	html += '<label>Token Secret Key</label>';
	html += '<span style="color: #a94442" id="edit-secretKey-span-Error" class="help-inline"></span>';
	
		var accessTokenSecret = organizationSourceMappingMasterObject.accessTokenSecret;
		if (accessTokenSecret==null) {
			accessTokenSecret="";
			html += '<input	type="text" value="'+accessTokenSecret+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Secret Key" maxlength="50">';
		} else {

			html += '<input	type="text" value="'+accessTokenSecret+'" class="form-control input-sm" id="editedAccessTokenSecret" placeholder="Enter Secret Key" maxlength="50">';
		}
	
	html += '</div>';
	
	/** ************************************Data Extraction Period ***************************************************** */
	html += '<div class="form-group" id="Edit-organizationUsername-Error">';
	html += '<label>Data Exraction Period(In Days)</label>';
	html += '<span style="color: #a94442" id="edit-organizationUsername-span-Error" class="help-inline"></span>';
	
		var dataExtractionPeriod = organizationSourceMappingMasterObject.dataExtractionPeriod;
		if(dataExtractionPeriod==null)
		{
			dataExtractionPeriod="";
			html += '<input	type="text" value="'+dataExtractionPeriod+'" class="form-control input-sm" id="editedDataExtractionPeriod" placeholder="Enter No Of Days" maxlength="50">';
		}else{
			html += '<input	type="text" value="'+dataExtractionPeriod+'" class="form-control input-sm" id="editedDataExtractionPeriod" placeholder="Enter No Of Days" maxlength="50">';

		}
		
	
	html += '</div>';
		}
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganizationSourceMapping('+organizationSourceMappingMasterObject.id+')">';
	html+=	appendCancelButton(getDivId("OrganizationSourceMapping"));
	html +=	'</form>';
	return html;	
}