$(document).ready(function(){
	listOfIndustryTypes();
	listOfOrganizationTypes();
	listOfParentOrganization();
	listOfSelfRatingTypes();
	listOfSpecificLocation();
	listOfDistrictLocation();
	listOfAreaLocation();
	listOfCity();
	$('.dropdown-toggle').dropdown();
	});
var selectedCheckBoxes=new Array();

function listOfIndustryTypes(){
	$("#newIndustryType").hide();
	 $("#listOfIndustryTypes").empty();
	$.ajax({
	url:'../IndustryTypes/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='industryType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].industryType+"'>"+data[i].industryType+"</option>";
	 }
	html+="</select> "; 
	$("#industryTypeList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }
    
function listOfOrganizationTypes(){
	$.ajax({
	url:'../Organization/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='organizationType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].organizationType+"'>"+data[i].organizationType+"</option>";
	 }
	html+="</select> "; 
	$("#organizationTypeList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }

function listOfParentOrganization(){
	$.ajax({
	url:'../ManageOrganization/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='parentOrganizationName'class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].organizationFullName+"'>"+data[i].organizationFullName+"</option>";
	 }
	html+="</select> "; 
	$("#parentOrganizationList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }

function listOfSelfRatingTypes(){
	$.ajax({
	url:'../Organization/listOfOrgSelfRatings.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='selfRatingType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].id+"'>"+data[i].ratingType+"</option>";
	 }
	html+="</select> "; 
	$("#selfRatingList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }
    
function listOfSpecificLocation(){
	$.ajax({
	url:'../LocationTypes/listSpecific.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
	var list = response.successObject.listAllLocationType; 
	html+="<select id='specificLocationType' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].specificLoc+"'>"+list[i].specificLoc+"</option>";
	 }
	html+="</select> "; 
	$("#specificLocationList").append(html);
    },error:function(response){
    	console.log(response);
    }
    });
    }

function listOfDistrictLocation(){
	$.ajax({
	url:'../LocationTypes/listDistrict.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
	var list = response.successObject.listAllLocationType;
	 html+="<select id='districtLocationType' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].districtLoc+"'>"+list[i].districtLoc+"</option>";
	 }
	html+="</select> "; 
	$("#locationDistrictList").append(html);
    },error:function(response){
    	console.log(reponse);
    }
    });
    }

function listOfCity(){
	$.ajax({
	url:'../cityMaster/list.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
	var list = response.successObject.listAllLocationType;
	 html+="<select id='cityName' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].cityName+"'>"+list[i].cityName+"</option>";
	 }
	html+="</select> "; 
	$("#cityList").append(html);
    },error:function(response){
    	console.log(response);
    }
    });
    }


	function listOfArchitecturalStyles(){
		$("#newArchitecturalStyle").hide();
			 $.ajax({
				    url: '../ArchitecturalStyle/list.htm',
				    type: 'GET',
				    success: function(data){ 
		 console.log(data);
		 var html="";
		 html+="<select id='architecturalStyle' class='form-control'>";
		 for(var i=0;i<data.length;i++){
			 html+="<option value='"+data[i].architecturalStyle+"'>"+data[i].architecturalStyle+"</option>";
		 }
		html+="</select> "; 
		$("#architecturalStyleList").append(html);
	    },error:function(response){
	    	console.log(response);
	    }
	    });
 }

function addOrganization(){
	 $('#addOrganizationForm').trigger("reset");
	$("#newOrganization").show();
	 $("#listOfOrganizationData").hide();
	 $("#organizationDataBody").empty();
}

$('#saveOrganization').click(function(){
	 $('#successOrganizationDiv').hide();
	 $('#errorOrganizationDiv').hide();
	var orgFullName = $.trim($('#organizationFullName').val());
	var orgDisplayName= $.trim($('#organizationDisplayName').val());
	var industryType= $.trim($('#industryType').val());
	var orgType= $.trim($('#organizationType').val());
	var parentOrgName=  $.trim($('#parentOrganizationName').val());
	var selfRatingType= $.trim($('#selfRatingType').val());
	var orgAddress1= $.trim($('#organizationAddress1').val());
	var orgAddress2= $.trim($('#organizationAddress2').val());
	var orgCountry= $.trim($('#organizationCountry').val());
	var orgCity= $.trim($('#organizationCity').val());
	var orgState= $.trim($('#organizationState').val());
	var orgPincode= $.trim($('#organizationPincode').val());
	var orgSpecificLocation= $.trim($('#specificLocationType').val());
	var orgLocationDistrict= $.trim($('#districtLocationType').val());
	var areaLocation=$.trim($('#areaLocationType').val());
	var primaryNumber=$.trim($('#primaryNumber').val());
	var secondaryNumber= $.trim($('#secondaryNumber').val());
	var fax= $.trim($('#fax').val());
	var architecturalStyle=$.trim($('#architecturalStyle').val());
	var geoLatitude= $.trim($('#geoLatitude').val());
	var geoLongitude= $.trim($('#geoLongitude').val());
	
	var ManageOrganization={'organizationFullName':orgFullName,'architecturalStyle':architecturalStyle,'organizationDisplayName':orgDisplayName,'industryType':industryType
			,'organizationType':orgType,'parentOrganization':parentOrgName,'organizationAddress1':orgAddress1,'organizationAddress2':orgAddress2,
			'country':orgCountry,'state':orgState,'city':orgCity, 'pincode':orgPincode,'specificLocation':orgSpecificLocation,'locationDistrict':orgLocationDistrict,
			'selfRatingType':selfRatingType,'areaLocation':areaLocation,'primaryNumber':primaryNumber,'secondaryNumber':secondaryNumber,'fax':fax,'geoLatitude':geoLatitude,'geoLongitude':geoLongitude};
	console.log(ManageOrganization);
	if(orgFullName==""){
	alert("Please Enter Organization Name")	;
	}else{ $.ajax({ 
	        url: "../ManageOrganization/save.htm", 
	        type: 'POST', 
	        data: JSON.stringify(ManageOrganization), 
	        contentType: 'application/json',
	        success: function(data) { 
	        	alert("success");
			 $('#errorOrganizationDataDiv').hide();
			 $('#successOrganizationDiv').show(600);
			 $('#addOrganizationForm').trigger("reset");
			 $('#IndustryTypeType-Error').removeClass('has-error has-feedback');
			 $('#IndustryTypeTypeError').hide();
			 },
	 		error:function(data) { 
         	alert("error: "+data);
    		 }
	 });
	}
	});


function listOfManagedOrganization(){
	$("#newOrganization").hide();
	$("#organizationDataBody").empty();
	 $("#listOfOrganizationData").empty();
	$.ajax({
	url:'../ManageOrganization/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
		html+="<hr>"
				+"<form class='form-horizontal'>"
				+"<div>"
				+"<input type='button' class='btn btn-success'  onclick='editOrganizationData()' value='Edit'>&nbsp"
				+" <input type='button' class='btn btn-danger'  onclick='deleteOrganizationData()' value='Delete'>"
				+"</div><br>"
				+ "<table class='table table-striped table-bordered' id='ListTable'>"
				+ 		"<thead>"
				+ 			"<tr>"
				+				"<th style='width:60px;'><input type='checkbox' id='selectAllPoiChkBox' style='margin-left:24px;'/></th>"
				+				"<th>Parent Organization</th>"
				+				"<th>Organization Dispay Name</th>"
				+				"<th>Address</th>"
				+			"</tr>"
				+ 		"</thead>"
				+		"<tbody>";
			for(var i=0;i<data.length;i++){
			html+=			"<tr>"
				+			"<td align='center'><input type='checkbox' class='poiChkBox' value='"+data[i].id+"'/></td>"	
				+			"<td>"+data[i].parentOrganization+"</td>"	
				+			"<td>"+data[i].organizationDisplayName+"</td>"
				+			"<td>"+data[i].organizationAddress1+"</td>"
				+			"</tr>";
			}
			html+=	"</tbody>"
				+ "</table>"
				+"</form>";
	 $("#listOfOrganizationData").append(html);
	 $("#listOfOrganizationData").show();
	 $("#listTable").dataTable();
    },error:function(url,status,er) { 
     	alert("error: "+url+" status: "+status+" er:"+er);
    }
    });
}

function editOrganizationData(){
	checkBoxLength();
	console.log(selectedCheckBoxes);
 	if(selectedCheckBoxes.length>1){
  		alert("You can edit only one record at a time");
  		return false;
  	}else if(selectedCheckBoxes.length==0){
  		alert("Please select a record");
  		return false;
  	}else{
	$.ajax({
	    url: '../ManageOrganization/getEditData.htm?id='+selectedCheckBoxes+' ',
	    type: 'GET',
	    success: function(data){ 
	    	$("#poiDataBody").empty();
		var html="";
		html+='<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;" id="editSuccessOrganizationDiv" >'
			 +'</div>'
			 +'<div class="alert alert-danger alert-error" style="display: none;margin-left: -13px;"id="editEditOrganizationDiv" >'
			 +'</div>'
			 +'<div class="form-group row">'
	    	 +'<label for="firstname" class="col-sm-4 control-label"><spring:message code="label.OrganizationFullName"/></label>'
	    	 +'<div class="col-sm-10">'
	         +'<input type="text" class="form-control" id="editOrganizationFullName" placeholder="Enter Organization Full Name" value="'+data.organizationFullName+'">'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationDisplayName"/></label>'
	         +'<div class="col-sm-10">'
	         +'<input type="text" class="form-control" id="editOrganizationDisplayName"  placeholder="Enter Organization Display Name" value="'+data.organizationDisplayName+'">'
	         +'</div>'
	         +' </div>'
	         +'<div class="form-group row">'
	         +'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.IndustryType"/></label>'
	         +'<div class="col-sm-10">'
	         +'<div  id="editIndustryTypeList"></div>'
	         +'</div>'
	         +' </div>'
	         +'<div class="form-group row">'
	         +'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.OrganizationType"/></label>'
	         +'<div class="col-sm-10">'
	         +'<div id="editOrganizationTypeList"></div>'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label  class="col-sm-2 control-label"><spring:message code="label.ParentOrganization"/></label>'
	         +'<div class="col-sm-10">'
	         +'<div id="editParentOrganizationList"></div>'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.SelfRatingType"/></label>'
	         +'<div class="col-sm-10">'
	         +'<div  id="editSelfRatingTypeList"></div>'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group">'
		     +'<label  class="col-sm-2 control-label"><spring:message code="label.ArchitecturalStyle"/></label>'
		     +'<div class="col-sm-10">'
		     +' <div id="editArchitecturalStyleList"></div>'
		     +'</div>'
		   	 +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.UploadOrganizationLogo"/></label>'
	         +'<div class="col-sm-6">'
	         +'<input type="file" class="form-control" id="editUploadOrganizationLogo">'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.UploadOrganizationBanner"/></label>'
	         +'<div class="col-sm-6">'
	         +'<input type="file" class="form-control" id="editUploadOrganizationBanner" >'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'  <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizatinAddress"/></label>'
	         +'<div class="col-sm-10">'
	         +' <input type="text" class="form-control" id="editOrganizationAddress1"  placeholder="Enter Organization Primary Address" value="'+data.organizationAddress1+'">'
	         +'</div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.OrganizationAddress"/></label>'
	         +' <div class="col-sm-10">'
	         +'   <input type="text" class="form-control" id="editOrganizationAddress2"  placeholder="Enter Organization Secondary Address" value="'+data.organizationAddress2+'">'
	         +'  </div>'
	         +'</div>'
	         +' <div class="form-group row">'
	         +'   <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.Country"/></label>'
	         +'  <div class="col-sm-10">'
	         +'    <input type="text" class="form-control" id="editOrganizationCountry"  placeholder="Enter Country" value="'+data.country+'">'
	         +'  </div>'
	         +' </div>'
	         +'  <div class="form-group row">'
	         +'   <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.State"/></label>'
	         +'   <div class="col-sm-10">'
	         +'     <input type="text" class="form-control" id="editOrganizationState"  placeholder="Enter State" value="'+data.state+'">'
	         +' </div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="firstname" class="col-sm-2 control-label"><spring:message code="label.City"/></label>'
	         +'<div class="col-sm-10">'
	         +'<input type="text" class="form-control" id="editOrganizationCity" placeholder="Enter City" value="'+data.city+'">'
	         +' </div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.SpecificLocation"/></label>'
	         +'<div class="col-sm-10">'
	         +'<div id="editSpecificLocationList"></div>'
	         +' </div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'<label for="lastname" class="col-sm-2 control-label"><spring:message code="label.LocationDistrict"/></label>'
	         +'<div class="col-sm-10">'
	         +' <div id="editLocationDistrictList"></div>'
	         +'</div>'
	         +'</div>'
	         +' <div class="form-group row">'
	         +'    <label for="lastname" class="col-sm-2 control-label"><spring:message code="label.AreaLocation"/></label>'
	         +'    <div class="col-sm-10">'
	         +'      <div id="editAreaLocationList"></div>'
	         +'  </div>'
	         +'</div>'
	         +'<div class="form-group row">'
	         +'   <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.GeoLatitude"/></label>'
	         +'   <div class="col-sm-10">'
	         +'      <input type="text" class="form-control" id="editGeoLatitude"  placeholder="Enter Latitude" value="'+data.geoLatitude+'">'
	         +'</div>'
	         +'  </div>'
	         +' <div class="form-group row">'
	         +'     <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.GeoLongitude"/></label>'
	         +'    <div class="col-sm-10">'
	         +'      <input type="text" class="form-control" id="editGeoLongitude" placeholder="Enter Longitude" value="'+data.geoLongitude+'">'
	         +' </div>'
	         +' </div>'
	         +' <div class="form-group row">'
	         +'   <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactEmail"/></label>'
	         +'   <div class="col-sm-10">'
	         +'     <input type="text" class="form-control" id="editContactEmail" placeholder="Enter Contact Email" value="'+data.contactEmail+'">'
	         +'  </div>'
	         +'</div>'
	         +' <div class="form-group row">'
	         +'   <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>'
	         +'   <div class="col-sm-10">'
	         +'    <input type="text" class="form-control" id="editPrimaryNumber"  placeholder="Enter Primary Number" value="'+data.primaryNumber+'">'
	         +' </div>'
	         +' </div>'
	         +'  <div class="form-group row">'
	         +'   <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.ContactNumber"/></label>'
	         +'   <div class="col-sm-10">'
	         +'    <input type="text" class="form-control" id="editSecondaryNumber" placeholder="Enter Secondary Number" value="'+data.secondaryNumber+'">'
	         +' </div>'
	         +' </div>'
	         +' <div class="form-group row">'
	         +'   <label for="firstname" class="col-sm-2 control-label"><spring:message code="label.Fax"/></label>'
	         +'   <div class="col-sm-10">'
	         +'   <input type="text" class="form-control" id="editFax" placeholder="Enter Fax Number" value="'+data.fax+'">'
	         +' </div>'
	         +' </div>'
	         +'<div class="form-group row">'
	         +'<input type="hidden" value="'+data.id+'" id="editedId">'
			+'<button type="submit" class="btn btn-primary" onclick="postEdit()"> <spring:message code="label.update"/> </button>';
			+'<input type="button" value="<spring:message code="label.update"/>" class="btn btn-success" onclick="postEdit()" style="margin-left:-14px;"/>'
			+'</div>';
		$("#organizationDataBody").append(html);
	    },error:function(url,status,er) { 
	    	console.log("error: "+url+" status: "+status+" er:"+er);
         	var html="Error in getting data.";
         	$("#organizationDataBody").append(html);
	    }
	});
	$("#editOrganizationModal").modal('show');
	editlistOfIndustryTypes();
	editlistOfOrganizationTypes();
	editlistOfParentOrganization();
	editlistOfSelfRatingTypes();
	editlistOfSpecificLocation();
	editlistOfDistrictLocation();
	editlistOfAreaLocation();
	editlistOfArchitecturalStyles();
	$('.dropdown-toggle').dropdown();
	 /* 	console.log($("#id").data("IndustryType",industryType)); */
}
}

function editlistOfIndustryTypes(){
	$.ajax({
	url:'../IndustryTypes/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='editIndustryType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].industryType+"'>"+data[i].industryType+"</option>";
	 }
	html+="</select> "; 
	$("#editIndustryTypeList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }
    
function editlistOfOrganizationTypes(){
	$.ajax({
	url:'../Organization/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='editOrganizationType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].organizationType+"'>"+data[i].organizationType+"</option>";
	 }
	html+="</select> "; 
	$("#editOrganizationTypeList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }

function editlistOfParentOrganization(){
	$.ajax({
	url:'../ManageOrganization/list.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='editParentOrganization'class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].organizationFullName+"'>"+data[i].organizationFullName+"</option>";
	 }
	html+="</select> "; 
	$("#editParentOrganizationList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }

function editlistOfSelfRatingTypes(){
	$.ajax({
	url:'../Organization/listOfOrgSelfRatings.htm',	
	type: 'GET',
    success: function(data){ 
	 console.log(data);
	 var html="";
	 html+="<select id='editSelfRatingType' class='form-control'>";
	 for(var i=0;i<data.length;i++){
		 html+="<option value='"+data[i].id+"'>"+data[i].ratingType+"</option>";
	 }
	html+="</select> "; 
	$("#editSelfRatingTypeList").append(html);
    },error:function(data){
    	console.log(data);
    }
    });
    }
    
function editlistOfSpecificLocation(){
	$.ajax({
	url:'../LocationTypes/list2.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
	var list = response.successObject.listAllLocationType; 
	html+="<select id='editSpecificLocationType' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].specificLoc+"'>"+list[i].specificLoc+"</option>";
	 }
	html+="</select> "; 
	$("#editSpecificLocationList").append(html);
    },error:function(response){
    	console.log(response);
    }
    });
    }

function editlistOfDistrictLocation(){
	$.ajax({
	url:'../LocationTypes/list1.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
	var list = response.successObject.listAllLocationType;
	 html+="<select id='editDistrictLocationType' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].districtLoc+"'>"+list[i].districtLoc+"</option>";
	 }
	html+="</select> "; 
	$("#editLocationDistrictList").append(html);
    },error:function(response){
    	console.log(reponse);
    }
    });
 }

function editlistOfAreaLocation(){
	$.ajax({
	url:'../LocationTypes/list.htm',	
	type: 'GET',
    success: function(response){ 
	 console.log(response);
	 var html="";
	var list = response.successObject.listAllLocationType;
	 html+="<select id='editAreaLocationType' class='form-control'>";
	 for(var i=0;i<list.length;i++){
		 html+="<option value='"+list[i].areaLoc+"'>"+list[i].areaLoc+"</option>";
	 }
	html+="</select> "; 
	$("#editAreaLocationList").append(html);
    },error:function(response){
    	console.log(response);
    }
    });
  }


function editlistOfArchitecturalStyles(){
		$("#newArchitecturalStyle").hide();
			 $.ajax({
				    url: '../ArchitecturalStyle/list.htm',
				    type: 'GET',
				    success: function(data){ 
		 console.log(data);
		 var html="";
		 html+="<select id='editArchitecturalStyle' class='form-control'>";
		 for(var i=0;i<data.length;i++){
			 html+="<option value='"+data[i].architecturalStyle+"'>"+data[i].architecturalStyle+"</option>";
		 }
		html+="</select> "; 
		$("#editArchitecturalStyleList").append(html);
	    },error:function(response){
	    	console.log(response);
	    }
	    });
 }

function postEdit(){
	 $('#editSuccessOrganizationDiv').hide();
	 $('#editErrorOrganizationDiv').hide();
		var orgFullName = $.trim($('#editOrganizationFullName').val());
		var orgDisplayName= $.trim($('#editOrganizationDisplayName').val());
		var industryType= $.trim($('#editIndustryType').val());
		var orgType= $.trim($('#editOrganizationType').val());
		var parentOrgName=  $.trim($('#editParentOrganization').val());
		var selfRatingType= $.trim($('#editSelfRatingType').val());
		var orgAddress1= $.trim($('#editOrganizationAddress1').val());
		var orgAddress2= $.trim($('#editOrganizationAddress2').val());
		var orgCountry= $.trim($('#editOrganizationCountry').val());
		var orgCity= $.trim($('#editOrganizationCity').val());
		var orgState= $.trim($('#editOrganizationState').val());
		var orgPincode= $.trim($('#editOrganizationPincode').val());
		var orgSpecificLocation= $.trim($('#editSpecificLocationType').val());
		var orgLocationDistrict= $.trim($('#editDistrictLocationType').val());
		var areaLocation=$.trim($('#editAreaLocationType').val());
		var primaryNumber=$.trim($('#editPrimaryNumber').val());
		var secondaryNumber= $.trim($('#editSecondaryNumber').val());
		var fax= $.trim($('#editFax').val());
		var architecturalStyle=$.trim($('#editArchitecturalStyle').val());
		var geoLatitude= $.trim($('#editGeoLatitude').val());
		var geoLongitude= $.trim($('#editGeoLongitude').val());
		
		var ManageOrganization={'organizationFullName':orgFullName,'architecturalStyle':architecturalStyle,'organizationDisplayName':orgDisplayName,'industryType':industryType
				,'organizationType':orgType,'parentOrganization':parentOrgName,'organizationAddress1':orgAddress1,'organizationAddress2':orgAddress2,
				'country':orgCountry,'state':orgState,'city':orgCity, 'pincode':orgPincode,'specificLocation':orgSpecificLocation,'locationDistrict':orgLocationDistrict,
				'selfRatingType':selfRatingType,'areaLocation':areaLocation,'primaryNumber':primaryNumber,'secondaryNumber':secondaryNumber,'fax':fax,'geoLatitude':geoLatitude,'geoLongitude':geoLongitude};
		console.log(ManageOrganization);
	if(orgFullName==""){
	alert("Please enter Organization Name")	;
	}else{
	$.ajax({
		   url: "../ManageOrganization/postEdit.htm", 
	        type: 'POST', 
	        data: JSON.stringify(ManageOrganization), 
	        contentType: 'application/json',
	        success: function(data) { 
	        $("#editOrganizationModal").modal('hide');
	        listOfManagedOrganization();
	        },
	        error:function(url,status,er) { 
	        	 $('#editErrorOrganizationDiv').show();
	         	alert("error: "+url+" status: "+status+" er:"+er);
	        }
	});
}
}

function deletePOIData(){
	  checkBoxLength();
	  if(selectedCheckBoxes.length>0){
		  if(confirm("Do you want to delete selected record(s)?")){
			  $.get("../IndustryTypes/delete.htm?ids="+selectedCheckBoxes,function(response){
					   selectedCheckBoxes.pop(selectedCheckBoxes);
					   listOfIndustryTypes();
			  })
			  .fail(function(response) {
			  alert("error"+response);
			  });
			  }
	  }else{
		  alert("Please select a record");
	  }
	  return false;
  }


$(document).on('click',"#selectAllPoiChkBox",function(){
        $('.poiChkBox').prop('checked', $(this).is(':checked'));
      });

 $(document).on('click',".poiChkBox",function(){
        if($('.poiChkBox:checked').length == $('.poiChkBox').length) {
          $('.selectAllPoiChkBox').prop('checked', true);
        }
        else {
          $('.selectAllPoiChkBox').prop('checked', false);
        }
 });
  
function checkBoxLength(){
    	if($('.poiChkBox:checked').length) {
    		selectedCheckBoxes =[];
            $('.poiChkBox:checked').each(function() {
              selectedCheckBoxes.push($(this).val());
            });
          }
    	return false;
    }
   