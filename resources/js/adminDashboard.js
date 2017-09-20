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
	getSessionData().then(function(){
	poplateOrganizations(function(selectedOrgId) {
		   saveSessionData();
		   //showDashboardRepufactor(selectedOrgId);
	});
	})
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
				console.log("error");
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
				console.log("error");
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
	commonOrgPopulation(callback,'organizationName');
}


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
