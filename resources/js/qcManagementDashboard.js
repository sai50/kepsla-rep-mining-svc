var sessionSelectedOrganizationId=0;
$(document).ready(function() {
	 $.ajaxSetup({ cache: false }); 
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDate",
		altFormat: "mm/dd/yy",
		maxDate: new Date,
		onClose : function(selectedDate) {
			$("#to").datepicker("option", "minDate", selectedDate);
			 dateValidationForm();
		}
	});
	
	$("#to").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altToDate",
		altFormat: "mm/dd/yy",
		maxDate: new Date,
		onClose : function(selectedDate) {
		$("#from").datepicker("option", "maxDate", selectedDate);
		 dateValidationForm(); 
		}
	
	});
	
	getSessionData();
	
	poplateOrganizations(function(selectedOrgId) {
		   saveSessionData();
		   //showDashboardRepufactor(selectedOrgId);
	});
	
});
$("#applyFilterBtn").click(function(e){
	saveSessionData();
});
function saveSessionData(){
	
	 var f = $('#altFromDate').val().split(/[.,\/ -]/);
	 var fromDate=f[2]+"-"+f[0]+"-"+f[1];
	 
	 var t = $('#altToDate').val().split(/[.,\/ -]/);
	 var toDate=t[2]+"-"+t[0]+"-"+t[1];
	 
	var orgId = $('#organizationName option:selected').val();
	console.log("<fromDate>"+fromDate+"<toDate>"+toDate+"<orgId>"+orgId);
	$.ajax({
			type:"GET",
			url:"../adminDashboard/saveSessionData.htm?organizationId="+orgId+"&fromDate="+fromDate+"&toDate="+toDate,
			contentType:"application/json",
			success:function(response){
				if(response.status=="SUCCESS"){
					console.log("saved ");
				}
			},error:function(response){
				alert("error");	
			}
	});
}
function getCompetitors(){
	var selectedOrgId=$('#organizationName option:selected').val();
	var orgName=$('#organizationName option:selected').text();
	var organization={'id':selectedOrgId};
	console.log(organization)
	$.ajax({
		type:"POST",
		url:"../qualityControl/competitorOrganizationsForOrganization.htm",
		contentType:"application/json",
		data:JSON.stringify(organization),
		success:function(response){
			var organizations=response.successObject.organizations;
			var htmlCode='<label class="radio-inline">';
				htmlCode+='<input name="orgRadio" checked="checked" onclick="triggerRadio()"  type="radio" value="'+selectedOrgId+'">'+orgName;
			htmlCode+='</label>';
			
			for(var i=0;i<organizations.length;i++){
				htmlCode+='<label class="radio-inline">';
				htmlCode+='<input name="orgRadio" onclick="triggerRadio()" type="radio" value="'+organizations[i].id+'">'+organizations[i].organizationFullName;
				htmlCode+='</label>';
			}
			$('#radioOrgsDiv').html(htmlCode);
			
			$("#applyFilterBtn").trigger('click');
		
		}
	});
}
function getSessionData(){
	 $.ajax({
			type:"GET",
			url:"../adminDashboard/getSessionDataMap.htm",
			contentType:"application/json",
			success:function(response){
				if(response.status=="SUCCESS"){
					var organizationId=response.successObject.organizationId;
					var fromDateStr=response.successObject.dateRange.fromDate;
					var toDateStr=response.successObject.dateRange.toDate;
					
					var fromDate = new Date(fromDateStr);
					var toDate = new Date(toDateStr);
					$("#from").datepicker("setDate",fromDate);
					$("#to").datepicker("setDate",toDate);
					sessionSelectedOrganizationId=response.successObject.organizationId;
					
				}else{
					setDefaults();
				}
			},error:function(response){
				alert("error");	
			}
	});
}

function setDefaults(){
	$("#from").datepicker("setDate","-1y");
	$("#to").datepicker("setDate",new Date());
}


/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	var selectedOrgId = 0;
	$.ajax({
		type:"GET",
		url:"../adminDashboard/getOrganizations.htm",
		contentType:"application/json",
		success:function(response){
			if(response.length==0){
				$('#organizationName').append('<option>No Organization Mapped</option>');
				$('#page-wrapper').html('');
			 	$('#page-wrapper').append('<h4><font color="red">Organization Not mapped Please contact admin</font></h4>');
				$('#applyFilterBtn').prop('disabled',true);
				return false;
			}else{
				// Get select
				var select = document.getElementById('organizationName');
			
				if(sessionSelectedOrganizationId!=0){
					 // Add options
					for (var i in response) {
						if(response[i].id==sessionSelectedOrganizationId){
							$(select).append('<option value=' + response[i].id + ' selected="selected">' + response[i].organizationFullName + '</option>');
						}else{
							$(select).append('<option value=' + response[i].id + '>' + response[i].organizationFullName + '</option>');
						}
					}
					
				}else{
					 // Add options
					for (var i in response) {
						if(i==0){
							$(select).append('<option value=' + response[i].id + ' selected="selected">' + response[i].organizationFullName + '</option>');
						}else{
							$(select).append('<option value=' + response[i].id + '>' + response[i].organizationFullName + '</option>');
						}
					}
				}
				selectedOrgId=$('#organizationName option:selected').val();
				callback(selectedOrgId.toString());
		}}
	});
}

/************************************************************************************
 *				Populate Organization Groups												* 
 ************************************************************************************/
/*function poplateOrganizationGroups(){
	$.ajax({
		type:"POST",
		url:"../qualityControl/organizationGroups.htm",
		contentType:"application/json",
		success:function(response){
			if(response.successObject.organizationGroups.length==0){
				$('#organizationGroupName').append('<option>No Organization Group Found</option>');
				$('#page-wrapper').html('');
			 	$('#page-wrapper').append('<h4><font color="red">Organization Group Not found Please contact admin</font></h4>');
				//$('#applyFilterBtn').prop('disabled',true);
				return false;
			}else{
				// Get select
				var select = document.getElementById('organizationGroupName');
					 // Add options
				for (var i in response.successObject.organizationGroups) {
					if(i==0){
						$(select).append('<option value=' + response.successObject.organizationGroups[i].id + ' selected="selected">' + response.successObject.organizationGroups[i].organizationGroupName + '</option>');
					}else{
						$(select).append('<option value=' + response.successObject.organizationGroups[i].id + '>' + response.successObject.organizationGroups[i].organizationGroupName + '</option>');
					}
				}
				$('#organizationGroupName').trigger('click');
				//selectedOrgId=$('#organizationGroupName option:selected').val();
				//callback(selectedOrgId.toString());
		}}
	});
}*/
/*function getOrganizations(obj){
	var groupId=$('#organizationName option:selected ').val();
	var organizationGroup={'id':groupId};
	$.ajax({
		 type:"POST",
		 url:"../qualityControl/organizationsForGroup.htm",
		 contentType:"application/json",
		 data:JSON.stringify(organizationGroup),
		 success:function(response){
			 console.log(response.successObject.organizations);
		 },error:function(response){
			 jqueryPostError(response);
		}
	 });
	 
}*/
/**************************************************************************************************************************
 *                     Show Repufactor and Change                                                          				*
 **************************************************************************************************************************/
function applyFilter(organizationId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	
	$.ajax({
		type:"POST",
		url:"../adminDashboard/getRepufactorScore.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:organizationId}),
		success:function(response){console.log(response);
		}
		});
}
