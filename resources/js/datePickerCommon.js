$(document).ready(function dateValidation() {
	$("#from").datepicker("setDate","-1y");
	$("#to").datepicker("setDate",new Date());
    var fromDate = $("#from").datepicker('getDate');
	var toDate = $("#to").datepicker('getDate');
	var differenceDate=1;
	differenceDate = differenceDate + Math.floor((fromDate - toDate) / 86400000);
});

function dateValidationForm() {
var fromDate = $("#from").datepicker('getDate');
	var toDate = $("#to").datepicker('getDate');
	var differenceDate=1;
	differenceDate = differenceDate + Math.floor((toDate-fromDate) / 86400000);
	if(differenceDate>7){
		$('#applyFilterBtn').prop('disabled',false);
	return true;
	}else{
		alert("This date range is insufficient to show Data");
		$('#applyFilterBtn').prop('disabled',true);
		return false;
	}
}

function dateValidation(fromDateId,toDateId,buttonId){
	var fromDate = $("#"+fromDateId).datepicker('getDate');
	var toDate = $("#"+toDateId).datepicker('getDate');
	var differenceDate=1;
	differenceDate = differenceDate + Math.floor((toDate-fromDate) / 86400000);
	if(differenceDate>7){
		$('#'+buttonId).prop('disabled',false);
	return true;
	}else{
		alert("This date range is insufficient to show Data");
		$('#'+buttonId).prop('disabled',true);
		return false;
	}
}
	
