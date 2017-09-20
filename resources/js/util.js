var maskId = $('#page-wrapper');
var sessionSelectedOrganizationId = 0;


function key(keyword){
	$("#highlight-content").keywordHighlight({
	    keyword: 'expectation',
	    caseSensitive: 'false',  
	    highlightClass: 'highlight'
	});
}

function showWrongImage(){
	var html = "";
	html+=		'<th><img src="../resources/images/wrong.jpg"></th>';
	return html;
}

function selectedCheckBoxesArray(form,factorName){
	var f = form.length;
	var count = 0;
	var array = [];
	while(f--){
		if(form[f].type=="checkbox" && form[f].checked){
			//Checked Ids Array
			array = addIds(form, factorName,f,count,array);
		}
	}
	
	return array;
}

function unselectedCheckBoxesArray(form,factorName){
	var f = form.length;
	var count = 0;
	var array = [];
	while(f--){
		array = addIds(form, factorName,f,count,array);
	}
	return array;

}

function addIds(form, factorName,f,count,array){
	if(form[f].value!="on"){
		var id = form[f].value;
		var name = $.trim($('#'+factorName+"_"+id).text());
		//var color = getColorCode(id,name);
		if(factorName=="departmentName"){
			array.push({'id':id,'departmentName':name});
		}else if(factorName=="kpiName"){
			array.push({'id':id,'kpiName':name});
		}else if(factorName=="sourceName"){
			array.push({'id':id,'sourceName':name});
		}else if(factorName=="language"){
			array.push({'id':id,'language':form[f].placeholder,'languageName':name});
		}else if(factorName=="comparision"){
			array.push({'id':id,'organizationName':name});
		}
		count = count++;
	}
	array = array.reverse();
	return array;
}

function getColorCode(id,factorName){
	var rgb = $('#'+factorName+"_"+id).css('color');
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {return ("0" + parseInt(x).toString(16)).slice(-2);}
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function getColorCode(id){
	var rgb = $(id).css('color');
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {return ("0" + parseInt(x).toString(16)).slice(-2);}
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


function appendCollpasableHeaderDiv(moduleId,isComparisionTable){
	var html = "";
	html+=	'<div class="panel panel-default comparativeAnalysisLandingPanel">';
	html+=		'<div class="panel-heading">';
	html+=		'<div class="panel-title">';
	if(isComparisionTable=="YES"){
		var checkBoxId = moduleId+"ComparativeCheckBox";
		var parameter = "'"+checkBoxId+"'";
		html+=	'<input type="checkbox" id='+checkBoxId+' onclick="checkOrUncheckAll('+parameter+')">';
		html+=			'<a data-toggle="collapse" data-parent="#accordion" href="#'+moduleId+'ComparativeAnalysis"> '+convertFirstLetterToUpperCase(moduleId)+'</a>';
	}else{
		html+=			'<a data-toggle="collapse" data-parent="#accordion" href="#'+moduleId+'"> '+convertFirstLetterToUpperCase(moduleId)+'</a>';
	}
	html+=		'</div>';
	html+=		'</div>';
	return html;
}

function convertFirstLetterToUpperCase(string){
	string = string[0].toUpperCase() + string.slice(1);//Converting First Letter To UpperCase
	return string;
}

function checkOrUncheckAll(checkBoxId){
	 $('.'+checkBoxId).prop('checked', $('#'+checkBoxId).is(':checked'));
}
function individualCheckOrUncheck(checkBoxId){
	if($('.'+checkBoxId+':checked').length == $('.'+checkBoxId).length){
		$('#'+checkBoxId).prop('checked',true);
	}else{
		$('#'+checkBoxId).prop('checked',false);
	}
}

function geoLatitudeAddFloatValidation(){
	 var entered_value = $('#geoLatitude').val();
     var regexPattern = /^\d{0,8}(\.\d{1,2})?$/;         
     //Allow only Number as well 0nly 2 digit after dot(.)
     if(regexPattern.test(entered_value)) {
         $(this).css('background-color', 'white');
         $('.help-inline-float').html('');
         $('input[type=button]', $('#addGeoLocationForm')).prop('disabled',false);
     } else {
         $(this).css('background-color', 'red');
         $('#geoLatitude-span-Error').html('Enter a valid Decimal Number');
         $('input[type=button]', $('#addGeoLocationForm')).prop('disabled',true);
     }
}
     
function geoLongitudeAddFloatValidation(){
    var entered_value = $('#geoLongitude').val();
    var regexPattern = /^\d{0,8}(\.\d{1,2})?$/;         
    //Allow only Number as well 0nly 2 digit after dot(.)
    if(regexPattern.test(entered_value)) {
        $(this).css('background-color', 'white');
        $('.help-inline-float').html('');
        $('input[type=button]', $('#addGeoLocationForm')).prop('disabled',false);
    } else {
        $(this).css('background-color', 'red');
        $('#geoLongitude-span-Error').html('Enter a valid Decimal Number');
        $('input[type=button]', $('#addGeoLocationForm')).prop('disabled',true);
    }
}
  
function geoLatitudeEditFloatValidation(){
    var entered_value = $('#editedGeoLatitude').val();
    var regexPattern = /^\d{0,8}(\.\d{1,2})?$/;         
    //Allow only Number as well 0nly 2 digit after dot(.)
    if(regexPattern.test(entered_value)) {
        $(this).css('background-color', 'white');
        $('.help-inline-float').html('');
        $('input[type=button]', $('#editGeoLocationForm')).prop('disabled',false);
    } else {
        $(this).css('background-color', 'red');
        $('#edit-geoLatitude-span-Error').html('Enter a valid Decimal Number');
        $('input[type=button]', $('#editGeoLocationForm')).prop('disabled',true);
    }
  
}
function geoLongitudeEditFloatValidation(){
    var entered_value = $('#editedGeoLongitude').val();
    var regexPattern = /^\d{0,8}(\.\d{1,2})?$/;         
    //Allow only Number as well 0nly 2 digit after dot(.)
    if(regexPattern.test(entered_value)) {
        $(this).css('background-color', 'white');
        $('.help-inline-float').html('');
        $('input[type=button]', $('#editGeoLocationForm')).prop('disabled',false);
    } else {
        $(this).css('background-color', 'red');
        $('#edit-geoLongitude-span-Error').html('Enter a valid Decimal Number');
        $('input[type=button]', $('#editGeoLocationForm')).prop('disabled',true);
    }
  
}

function commonOrgPopulation(callback,selectorId){
	
	var selectedOrgId = 0;
	if(sessionStorage.getItem(loggeduserID)!==undefined && sessionStorage.getItem(loggeduserID)!==null){
		organizationPopulation(JSON.parse(sessionStorage.getItem(loggeduserID)),selectorId);
		 selectedOrgId=$('#organizationName option:selected').val();
		callback(selectedOrgId.toString());
	}
	else{
	$.ajax({
		type:"GET",
		url:"../dashboard/getOrganizations.htm",
		contentType:"application/json",
		success:function(response){
			sessionStorage.setItem(loggeduserID,JSON.stringify(response));
			organizationPopulation(response,selectorId);
		   selectedOrgId=$('#organizationName option:selected').val();
			callback(selectedOrgId.toString());
			
		}
		
	});
	}	

   
}

function selectedIds(checkBoxClass) {
	var ids = [];
	if ($('.'+checkBoxClass+':checked').length) {
		$('.'+checkBoxClass+':checked').each(function() {
			ids.push($(this).val());
		});
	}
	return ids;
}

function floatValidation(id,formId,fieldId){
	 var entered_value = $('#'+fieldId).val();
	    var regexPattern = /^\d{0,8}(\.\d{1,2})?$/;         
	    //Allow only Number as well 0nly 2 digit after dot(.)
	    if(regexPattern.test(entered_value)) {
	        $(this).css('background-color', 'white');
	        $('.help-inline-float').html('');
	        $('input[type=button]', $('#'+formId)).prop('disabled',false);
	    } else {
	        $(this).css('background-color', 'red');
	        $('#'+id+'-weightage-span-Error').html('Enter a valid Decimal Number');
	        $('input[type=button]', $('#'+formId)).prop('disabled',true);
	    }
}

function floatValidationMethod(formId,fieldId,addOrUpdate){
	var entered_value = $.trim($('#'+fieldId).val());
	var regexPattern = /^\d+$/;         
		if (regexPattern.test(entered_value) || entered_value=="") {
			$(this).css('background-color', 'green');
			$('.help-inline').html('');
			$('input[type=button]', $('#'+formId)).prop('disabled', false);
	}else{
		$(this).css('background-color', 'red');
		if(addOrUpdate=="Add"){
	        $('#'+fieldId+'-span-Error').html('Enter a valid Decimal Number');
		}else{
	        $('#Edit-'+fieldId+'-span-Error').html('Enter a valid Decimal Number');
		}
        $('input[type=button]', $('#'+formId)).prop('disabled',true);
	}
}

  
function highlightSearchText(searchText,highlightedSearchText){
	var term = searchText;
	term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
	var pattern = new RegExp("("+term+")", "gi");
	highlightedSearchText = highlightedSearchText.replace(pattern, "<mark>$1</mark>");
	highlightedSearchText = highlightedSearchText.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
	return highlightedSearchText;
}
function addIcon(){
	 var html = "";
	 html+= '<img alt="" title="Add" src="../resources/images/add-icon.jpg"></a></span>&nbsp';
	 return html;
}
function listIcon(){
	var html = "";
	html+=	'<img alt="" title ="List" src="../resources/images/list-icon.jpg"></a></span>&nbsp ';
	return html;
}
function deleteIcon(){
	var html = "";
	html+=	'<img alt="" title="Delete" src="../resources/images/delete.jpg"></a></span>&nbsp ';
	return html;
}
function clearText(){
	var length = $('#searchText').val().length;
	if(length==0){
		clearSearch();
	}
	return false;
	
}
function scrollDown(divId){
	console.log(divId);
	$('html, body').animate({
        scrollTop: divId.offset().top
    },1000);
}

function scrollTop(){
	$(window).scrollTop(0);
}

function generateList(tabButtonsId,dataDivId,successDivId,tableId,maskId,response){
	tabButtonsId.hide();
	dataDivId.html(response);
	$('#'+successDivId).show(600);
	$('#'+tableId).dataTable();
	scrollDown(dataDivId);
	maskId.unmask();
}

function addDiv(id){
	var html= "";
	var divId = "addAndEdit"+id+"Div";
	html+=	'<div id='+divId+'  style="display:none" class="SubHeading addAdminForm col-xs-12"></div>';
	return html;
}
function getDivId(id){
	var divId = "addAndEdit"+id+"Div";
	return divId;
}
function appendCancelButton(formDivId,appendDivId){
	var html = "";
	formDivId = $('#'+formDivId);
	formDivId = formDivId.closest('div').attr('id');
	formDivId = "'"+formDivId+"'";
	appendDivId = "'"+appendDivId+"'";
	html += '&nbsp;<button type="button" class="btn btn-default"  onclick ="hideForm('+formDivId+','+appendDivId+')">Cancel</button>';
	return html;
}
function hideForm(formDivId,appendDivId){
	if(formDivId=="addAndEditOrganizationGroupDiv"){
		$('#organizationBrandTable tr tbody').empty();
		counter = 1;
	}
	$("#"+formDivId).hide(600);
	appendDivId = $('#'+appendDivId);
	scrollDown(appendDivId);
}

function addHeaderButtons(addMethod,deleteMethod,tabButtonId){
	var html = "";
	html+=	'<div>';
	html+=		'<form id="'+tabButtonId+'" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
	html+=		'<div class="form-group float-right">';
	html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="'+deleteMethod+'()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
	html+=			'<a onclick="'+addMethod+'()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
	html+=		'</div>';
	html+=		'</form>';
	html+=	'</div>';
	return html;
}
function addHeaderButtonsForReviewCalculation(addParameters,deleteParameters,tabButtonId){
	var html = "";
	html+=	'<div id="headerDiv">';
	html+=		'<form id="'+tabButtonId+'" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
	html+=		'<div class="form-group float-right">';
	html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteFormulas('+deleteParameters+')"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
	html+=			'<a onclick="addOrUpdateForm('+addParameters+')" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
	html+=		'</div>';
	html+=		'</form>';
	html+=	'</div>';
	return html;
	
}
function addFormHeading(formHeadingTitle){
	var html = "";
	html+=	'<div class="col-sm-12 Action_heading row" style="margin-bottom: 30px; border-bottom: solid 2px #ddd; padding-bottom: 10px;">';
	html += 	'<h4>'+formHeadingTitle+'</h4>';
	html+=	'</div>';
	return html;
}
function convertToZero(value){
	if(value==""){
		return value=0;
	}else{
		return value;
	}
}
function jqueryPostError(response){
	$('#page-wrapper').mask(response.status+"*****************"+response.statusText);
}
function loading(){
	$('#page-wrapper').mask('Loading...');
}
function unload(){
	$('#page-wrapper').unmask();
}
function clearErrorDivs(successDivId,ErrorDivId,formId){
	$('#'+formId).find('.help-inline').empty();
	$('#'+formId).find('.form-group').removeClass('has-error has-feedback');
	$('#'+successDivId).hide();
	$('#'+ErrorDivId).hide();
}
function addErrors(errorDivId,response,addOrEdit,module){
	$('#'+errorDivId).show(600);
	for(var i=0;i<response.errorMessageList.length;i++){
		var fieldName = response.errorMessageList[i].fieldName;
		var errorMessage  = response.errorMessageList[i].message;
		if(addOrEdit=="Add"){
			$('#Add-'+module+'-'+fieldName+'-Error').addClass('has-error has-feedback');
			$('#'+module+'-'+fieldName+'-span-Error').html(errorMessage);
		}else{
			$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
			$('#edit-'+fieldName+'-span-Error').html(errorMessage);
		}
	}
	$('#page-wrapper').unmask();
}

function appendUpdateErrors(errorDivId,response,addOrEdit,id,moduleId){
	$('#'+errorDivId).show(600);
	for(var i=0;i<response.errorMessageList.length;i++){
		var fieldName = response.errorMessageList[i].fieldName;
		var errorMessage  = response.errorMessageList[i].message;
		if(addOrEdit=="Add"){
			$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
			$('#'+fieldName+'-span-Error').html(errorMessage);
		}else{
			$('#Edit-'+moduleId+'-'+fieldName+'-Error-'+id).addClass('has-error has-feedback');
			$('#edit-'+moduleId+'-'+fieldName+'-span-Error-'+id).html(errorMessage);
		}
	}
	$('#page-wrapper').unmask();
}

function resetForm(formId){
	$('#'+formId).trigger('reset');
}
function resetMileStoneForm(formId,moduleId){
	$('#'+formId).trigger('reset');
	$('#altMileStone'+moduleId+'FromDate').val('');
	$('#altMileStone'+moduleId+'ToDate').val('');
}
/********************************************************************************************************************************************************/
/*********************************************Convert Date to DATETIME***********************************************************************************/
/********************************************************************************************************************************************************/
	function getSessionData(){

	return	 $.ajax({
				type:"GET",
				url:"../dashboard/getSessionDataMap.htm",
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
						
				  }	
				},
				
		});
	}
	
	function organizationPopulation(response,selector){
		if(response.length==0)
		{
		$('#organizationName').append('<option>No Organization Mapped</option>');
		$('#page-wrapper').html('');
	 	$('#page-wrapper').append('<h4><font color="red">Organization Not mapped Please contact admin</font></h4>');
		$('#applyFilterBtn').prop('disabled',true);
		return false;
		}else{
			
		    // Get select
		    var select = document.getElementById(selector);
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
	}
	}


	function appendErrorDiv(errorDivId){
		var html = "";
		html += '<div class="alert alert-danger alert-error" style="display: none;"	id='+errorDivId+'>';
		html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
		html += '</div>';
		return html;
	}
	
	$(document).ready(function() {
		/*** To add CSRF token to all ajax requests *****/ 
		/*var token = $("meta[name='_csrf']").attr("content");
		var header = $("meta[name='_csrf_header']").attr("content");*/
		$(document).ajaxSend(function(e, xhr, options) {
			//xhr.setRequestHeader(header, token);
		});
		/**************************************************/
		 $.ajaxSetup({ cache: false });
		$("#from").datepicker({
			defaultDate : "+1w",
			changeMonth : true,
			numberOfMonths : 1,
			dateFormat:'d M yy',
			altField: "#altFromDate",
			altFormat: "mm/dd/yy",
			onClose : function(selectedDate) {
				$("#to").datepicker("option", "minDate", selectedDate);
			}
		});
		$("#to").datepicker({
			defaultDate : "+1w",
			changeMonth : true,
			numberOfMonths : 1,
			dateFormat:'d M yy',
			altField: "#altToDate",
			altFormat: "mm/dd/yy",
			onClose : function(selectedDate) {
				$("#from").datepicker("option", "maxDate", selectedDate);
			}
		});
		getSessionData();
	});
	
	
	function loadingForDashBoard(){
		$('#wrapper').mask('Loading...');
		$('button[type=submit]').prop('disabled',true);
		$('#leftNavigation').mask();
	}

	function unloadingForDashBoard(){
		$('#leftNavigation,#wrapper').unmask();	
		$('button[type=submit]').prop('disabled',false);
	}
	
	function convertedDate(date){
		var convertedDate = $.datepicker.formatDate('d M yy',new Date(date));
		return convertedDate;
	}
	
	function convertFloat(amount){
		if(amount % 1 == 0)
			 return  amount=parseInt(amount,10);
	}
	
	
	
	
	function populateSentimentChart(chartDivId,positiveCount,negativeCount,neautralCount){
		positiveCount = parseInt(positiveCount);
		negativeCount = parseInt(negativeCount);
		neautralCount = parseInt(neautralCount);
	    $('#'+chartDivId).highcharts({
	        credits: {
				enabled: false
			},
			chart: {
				backgroundColor: 'transparent',
	            type: 'column',
				showPrintMenuItem:'0',
				style: {
	                    overflow: 'visible'
	                },
	                skipClone: true
	        },
			 plotOptions: {
	                column: {
	                    colorByPoint: true
	                }
	        },
			colors: ['#72d9be', '#f4c947', '#ef3f3f'],
	       	title: {
	            text: null
	        },
	        subtitle: {
	            text: null
	        },
	        xAxis: {
				lineWidth: 0, // Hide gridline
				minorGridLineWidth: 0,
				lineColor: 'transparent',
				minorTickLength: 0,
				tickLength: 0,
	            type: null,
	            labels: {
					enabled: false,
	            }
	        },
	        yAxis: {
	            lineWidth: 0,
				minorGridLineWidth: 0,
				lineColor: 'transparent',
				minorTickLength: 0,
				tickLength: 0,
	            title: {
	                text: null
	            },
	            labels: {
					enabled: false,
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        tooltip: {
	            pointFormat: '<b>{point.y:.0f}%</b>'
	        },
			
	        series: [{
	            name: 'Polarity',
	            data: [
	                ['Positive', positiveCount],
	                ['Neutral', neautralCount],
	                ['Negative',negativeCount],
	            ],
	        }],
			navigation: {			
					buttonOptions: {
						enabled: false
					}	
	        } 
	    });
	    //unloadingForDashBoard();
	}
		
	
	function populateBarChart(barChartDivId,datesArray,positiveArray,negativeArray,neutralArray,xAxisText,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray){
		loadingForDashBoard();
		setChartWidth();
		$('#'+barChartDivId)
				.highcharts(
						{
							credits : {
								enabled : false
							},
							chart : {
								type : 'column',
								width:960
									
							},
							title : {
								text : null
							},
							xAxis : {
								categories : datesArray,
							},
							yAxis : {
								min : 0,
								title : {
									text : xAxisText,
									fontWeight : 'bold'
								},
								stackLabels : {
									enabled : true,
									style : {
										fontWeight : 'bold',
										color : (Highcharts.theme && Highcharts.theme.textColor)
												|| 'gray'
									}
								}
							},
							legend : {
								enabled: false
							},
							tooltip : {
								formatter : function() {
									var index  = this.point.index;
									var name = this.series.name;
									if(name=="Neutral"){
										return '<b>'+name+ 'Reference(s): '+(neautralReferencesArray[index]);
									}else if(name=="Positive"){
										return '<b>'+name+ 'Reference(s): '+(positiveReferencesArray[index]);
									}else if(name=="Negative"){
										return '<b>'+name+ 'Reference(s): '+(negativeReferencesArray[index]);
									}
											
								}
							},
							plotOptions : {
								column : {
									stacking : 'normal',
									dataLabels : {
										enabled : false,
										color : (Highcharts.theme && Highcharts.theme.dataLabelsColor)
												|| 'white',
										style : {
											textShadow : '0 0 3px black'
										}
									}
								}
							},
							series : [ {
								name : 'Neutral',
								color : '#ffc85a',
								data : neutralArray,
							}, {
								name : 'Positive',
								color : '#007d32',
								data : positiveArray
							}, {
								name : 'Negative',
								color : '#db0703',
								data : negativeArray
							} ]
						});
		unloadingForDashBoard();
	}
	
	function populateBarChartForDepartment(barChartDivId,datesArray,positiveArray,negativeArray,neutralArray,xAxisText,positiveReferencesArray,negativeReferencesArray,neautralReferencesArray){
		loadingForDashBoard();
		setChartWidth();
		$('#'+barChartDivId)
				.highcharts(
						{
							credits : {
								enabled : false
							},
							chart : {
								type : 'column',
								width:960
									
							},
							title : {
								text : null
							},
							xAxis : {
								categories : datesArray,
							},
							yAxis : {
								min : 0,
								title : {
									text : xAxisText,
									fontWeight : 'bold'
								},
								stackLabels : {
									enabled : true,
									style : {
										fontWeight : 'bold',
										color : (Highcharts.theme && Highcharts.theme.textColor)
												|| 'gray'
									},formatter:function(){
										var index = this.x;
										var positiveReferenceAvg = positiveArray[index];
										var negativeReferenceAvg = negativeArray[index];
										var neautralReferenceAvg = neutralArray[index];
										var total = parseFloat(positiveReferenceAvg+negativeReferenceAvg+neautralReferenceAvg);
										total = total.toFixed(2);
										return total+"%";
									},
								}
							},
							legend : {
								enabled: false
							},
							tooltip : {
								formatter : function() {
									var index  = this.point.index;
									var name = this.series.name;
									if(name=="Neutral"){
										return '<b>'+name+ 'Reference(s): '+neautralReferencesArray[index];
									}else if(name=="Positive"){
										return '<b>'+name+ 'Reference(s): '+positiveReferencesArray[index];
									}else if(name=="Negative"){
										return '<b>'+name+ 'Reference(s): '+negativeReferencesArray[index];
									}
											
								}
							},
							plotOptions : {
								column : {
									stacking : 'normal',
									dataLabels : {
										enabled : false,
										color : (Highcharts.theme && Highcharts.theme.dataLabelsColor)
												|| 'white',
										style : {
											textShadow : '0 0 3px black'
										}
									}
								}
							},
							series : [ {
								name : 'Neutral',
								color : '#ffc85a',
								data : neutralArray,
							}, {
								name : 'Positive',
								color : '#007d32',
								data : positiveArray
							}, {
								name : 'Negative',
								color : '#db0703',
								data : negativeArray
							} ]
						});
		unloadingForDashBoard();
	}

	function departmentInnerPage(departmentId,isBreadCrumb,isDashBoard){
		loadingForDashBoard();
		window.location.href = "../departmentInnerPage/page.htm?departmentId="+departmentId+"&isBreadCrumb="+isBreadCrumb+"&isDashBoard="+isDashBoard;
		
	}
	function kpiInnerPage(kpiId,departmentId,isBreadCrumb,organizationId){
		loadingForDashBoard();
		window.location.href = "../kpiInnerPage/page.htm?kpiId="+kpiId+"&departmentId="+departmentId+"&isBreadCrumb="+isBreadCrumb;
		unloadingForDashBoard();
	}

	function keywordInnerPage(kpiId,departmentId,keywordId,isBreadCrumb){
		loadingForDashBoard();
		window.location.href = "../keywordInnerPage/page.htm?kpiId="+kpiId+"&departmentId="+departmentId+"&keywordId="+keywordId+"&isBreadCrumb="+isBreadCrumb;
	}
	//***********************Rajesh*******************//
	function departmentPolarityInnerPage(departmentId,polarity,isBreadCrumb,isDashBoard,value){
			loadingForDashBoard();
			window.location.href = "../PolarityInnerPage/page.htm?departmentId="+departmentId+"&polarity="+polarity+"&isBreadCrumb="+isBreadCrumb+"&isDashBoard="+isDashBoard;
	}
	function kpiPolarityInnerPage(kpiId,departmentId,isBreadCrumb,organizationId,polarity){
			loadingForDashBoard();
			window.location.href = "../kpiPolarityInnerPage/page.htm?kpiId="+kpiId+"&departmentId="+departmentId+"&isBreadCrumb="+isBreadCrumb+"&polarity="+polarity;
			unloadingForDashBoard();
	}
	function keywordPolarityInnerPage(kpiId,departmentId,keywordId,isBreadCrumb,polarity){
			loadingForDashBoard();
			
			window.location.href = "../keywordPolarityInnerPage/page.htm?kpiId="+kpiId+"&departmentId="+departmentId+"&keywordId="+keywordId+"&isBreadCrumb="+isBreadCrumb+"&polarity="+polarity;
			unloadingForDashBoard();
	}
	//**********************End*************************//
	function firstPage(){
		window.location.href = "../reviewKpiAndDepartment/showReviewKpiAndDepartment.htm";
	}

	function postData(url,JSONObject){
		var data = "";
		$.post(url,JSONObject,function(response){
			data = response;
			/*if(response.status=="SUCCESS"){
				data = response.successObject;
			}else{
				data = response.successObject;
			}*/
		},'json').fail(function(response){
			data = jQuery.parseJSON(response.responseText);
		});
		return data;
	}
	
	function setChartWidth(){
		(function(H) {
			var each = H.each;
			H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function(proceed) {
			var series = this;
			if(series.data.length > 0 ){
			var width = series.barW > 40 ? 40 : series.barW;
			each(this.data, function(point) {
			point.shapeArgs.x += (point.shapeArgs.width - width) / 2;
			point.shapeArgs.width = width;
			});
			}
			proceed.call(this);
			})
			})(Highcharts);
	}
	
	function convertNullToString(string){
		if(string==null){
			return "";
		}else{
			return string;
		}
	}

	function getSentimentColor(sentimentPolarityList,repufactorScore){
		var html = "";
		$.each(sentimentPolarityList,function(index,value){
			var minPercentage = value.minPercentage;
			var maxPercentage = value.maxPercentage;
			var sentimentName = value.sentimentName;
			if (Math.round(repufactorScore) >= minPercentage && Math.round(repufactorScore) <= maxPercentage && sentimentName == "positive") {
				html+= '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ repufactorScore
						+ '%</span> </div>';
				return html;
			}
			if (Math.round(repufactorScore) >= minPercentage && Math.round(repufactorScore) <= maxPercentage && sentimentName == "neutral") {
				html+= '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ repufactorScore
						+ '%</span> </div>';
				return html;
			}
			if (Math.round(repufactorScore) >= minPercentage && Math.round(repufactorScore) <= maxPercentage && sentimentName == "negative") {
				html+= '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
						+ repufactorScore
						+ '%</span> </div>';
				return html;
			}
		});
	}
	
	function rankingsMap(arrayList){
		var list = [];
		arrayList.sort();//Sorting Array
		arrayList = arrayList.reverse();//Reversing Array
		$.each(arrayList,function(index,value){
			var pos = index+1;
			var value = value;
			list.push({'position':pos,'value':value,'index':index});
		});
		return list;
	}
	
	function getRanking(list){
		var html = "";
		if(list.length>0){
			$.each(list,function(index,value){
				if(value=="NA"){
					html+=	showWrongImage();
				}else{
					html+=		'<th>'+value+'</th>';
				}
					
			});
		}else{
			html+=			'<td>-<td>';
		}
		return html;
	}
	
	function unique(list) {
		  var result = [];
		  $.each(list, function(i, e) {
		    if ($.inArray(e, result) == -1) result.push(e);
		  });
		  return result;
		}
	
	
	
	function getOrdinalPosition(i){
		if(i.substr(-1)==="notFound"){
			return "NA";
		}else if(i.substr(-1)==="1"){
			return "st";
		}else if(i.substr(-1)==="2"){
			return "nd";
		}else if(i.substr(-1)==="3"){
			return "rd";
		}else{
			return "th";
		}
	}
	
	function emptyResultTable(){
		var html = "";
		html+=			'<table class="table table-bordered dataTable no-footer">';
		html+=				'<tr><th style="color:red">No Results Found</th></tr>';
		html+=			'</table>';
		return html;
	}
	function setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	function getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
	    return "";
	}
	
	function redirectView(view){
		window.location.href = "../dashboard/redirectView.htm?view="+view;
	}
	
	
	function convertToString(string){
		return "'"+string+"'";
	}
	
	function viewDetails(reviewId) {
		$.ajax({
					type : "POST",
					url : "../reviewSitesContent/fetchReview.htm?reviewId="
							+ reviewId,
					contentType : "application/json",
					success : function(response) {
						if (response.status == "LIST_SUCCESS") {
							reviewForViewDetail = response.successObject.review;
							/* responseObjectForViewDetail=response; */
							var htmlCode = "";
							htmlCode += '<div class="row">';
							htmlCode += '<div class="row col-xs-12 SingleReviewList" style="border:none;">';
							htmlCode += '<div data-reviewid="'
									+ reviewForViewDetail.id
									+ '" class="col-xs-12 col-sm-3 col-lg-2 LightBlue ">';
							for (var p = 0; p < sentimentPolarityList.length; p++) {
								if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
										&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "positive") {
									htmlCode += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
											+ reviewForViewDetail.repufactorScore
													.toFixed(2) + '%</span> </div>';
									break;
								}
								if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
										&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "neutral") {
									htmlCode += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
											+ reviewForViewDetail.repufactorScore
													.toFixed(2) + '%</span> </div>';
									break;
								}
								if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage
										&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage
										&& sentimentPolarityList[p].sentimentName == "negative") {
									htmlCode += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
											+ reviewForViewDetail.repufactorScore
													.toFixed(2) + '%</span> </div>';
									break;
								}
							}
							htmlCode += '<div class="reviewDetails row">';
							htmlCode += '<div class="reviewSource">'
									+ reviewForViewDetail.sourceName + '</div>';
							htmlCode += '<div class="reviewerName">by <span>';
							if (reviewForViewDetail.reviewerName != null
									|| $.trim(reviewForViewDetail.reviewerName) == ""
									|| $.trim(reviewForViewDetail.reviewerName)
											.indexOf('\"\"') != -1) {
								htmlCode += '' + reviewForViewDetail.reviewerName
										+ '';
							} else {
								htmlCode += 'Not Available';
							}
							htmlCode += '</span></div>';
							htmlCode += '<div class="reviewerDetail">from <span>';
							if (reviewForViewDetail.reviewLocation == null
									|| reviewForViewDetail.reviewLocation == "") {
								htmlCode += ' Not Available </span></div>';
							} else {
								htmlCode += '' + reviewForViewDetail.reviewLocation
										+ '</span></div>';
							}
							htmlCode += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
							htmlCode += '</span>'+ moment(reviewForViewDetail.reviewTime).format("DD MMMM YYYY") + '</span>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
							
							if (reviewForViewDetail.reviewTitle != null) {
								htmlCode += '<h3 class="SingleReviewHeader">'
										+ reviewForViewDetail.reviewTitle + '</h3>';
							}
							htmlCode += '<p>';
							htmlCode += reviewForViewDetail.highlightedReviewContent;
							htmlCode += '</p>';
							
							if(reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
								//original review
								htmlCode += '<p id="originalReview_'+reviewForViewDetail.id+'" style="display:none">' + reviewForViewDetail.reviewContent + '</p>';
							}
							if(reviewForViewDetail.sourceName.toLowerCase()=="tripadvisor" && reviewForViewDetail.fromApi==true){
									htmlCode += '<div class="row SourceRating col-xs-12">';
									htmlCode += '<span>Source Rating </span><span data-review-rating="'
											+ reviewForViewDetail.reviewOverallRating
											+ '" data-maximum-rating="'
											+ reviewForViewDetail.maxOverallRating
											+ '" class="starsTA">'
											+ reviewForViewDetail.reviewOverallRating
											+ '</span><span style="margin-left:5px; margin-right:35px;">'
											+ reviewForViewDetail.reviewOverallRating
											+ '/'
											+ reviewForViewDetail.maxOverallRating
											+ '</span>'
											
											+ '<span><a target="_blank" href='+reviewForViewDetail.redirectUrl+'><img src="../resources/images/TripadvisorLogo.png"></a></span>';
									
											if(reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
												htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review | </a></span>';
											}
											
											if(reviewForViewDetail.respondStatus==true){
												htmlCode += '<span style="float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
											}else{
												htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
											}
											if(reviewForViewDetail.markRead==true){
												htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',false)" href="#">Mark as Unread | </a></span>';
											}else{
												htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',true)" href="#">Mark as Read | </a></span>';
											}
									
									htmlCode += '</div>';
							}else{
									if(reviewForViewDetail.sourceName.toLowerCase()=="holidayiq" && reviewForViewDetail.fromApi==true){
										htmlCode += '<div class="row SourceRating col-xs-12">';
										htmlCode += '<span>Source Rating </span><span data-review-rating="'
												+ reviewForViewDetail.reviewOverallRating
												+ '" data-maximum-rating="'
												+ reviewForViewDetail.maxOverallRating
												+ '" class="starsHIQ">'
												+ reviewForViewDetail.reviewOverallRating
												+ '</span><span style="margin-left:5px; margin-right:35px;">'
												+ reviewForViewDetail.reviewOverallRating
												+ '/'
												+ reviewForViewDetail.maxOverallRating
												+ '</span>'
												
												+ '<span><a target="_blank" href='+reviewForViewDetail.redirectUrl+'><img src="../resources/images/holidayiqLogo.png"></a></span>';
										
												if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && sublist[i].reviewLanguage.toUpperCase()!="EN"){
													htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review | </a></span>';
												}
												
												if(reviewForViewDetail.respondStatus==true){
													htmlCode += '<span style="float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
												}else{
													htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
												}
												if(reviewForViewDetail.markRead==true){
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',false)" href="#">Mark as Unread | </a></span>';
												}else{
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',true)" href="#">Mark as Read | </a></span>';
												}
										
										htmlCode += '</div>';
									}else{
												htmlCode += '<div class="row SourceRating col-xs-12">';
												htmlCode += '<span>Source Rating </span><span data-review-rating="'
												+ reviewForViewDetail.reviewOverallRating
												+ '" data-maximum-rating="'
												+ reviewForViewDetail.maxOverallRating
												+ '" class="stars">'
												+ reviewForViewDetail.reviewOverallRating
												+ '</span><span>'
												+ reviewForViewDetail.reviewOverallRating
												+ '/'
												+ reviewForViewDetail.maxOverallRating
												+ '</span>';
										
												if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
													htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review | </a></span>';
												}
												
												if(reviewForViewDetail.respondStatus==true){
													htmlCode += '<span style="float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
												}else{
													htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;"><a onclick="getResponds('+reviewForViewDetail.id+')" href="#">Replied To Review | </a></span>';
												}
												if(reviewForViewDetail.markRead==true){
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:black;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',false)" href="#">Mark as Unread | </a></span>';
												}else{
													htmlCode += '<span  id="markReadSpan_'+reviewForViewDetail.id+'" data-name="'+reviewForViewDetail.id+'" class="markReadClass" style="float:right;color:read;"><a onclick="markReadUpdate('+reviewForViewDetail.id+',true)" href="#">Mark as Read | </a></span>';
												}
												htmlCode += '</div>';
									}
							}
							/*htmlCode += '<div class="row SourceKPIRating col-xs-12">';
							for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
								htmlCode += '<div class="KPIRating col-xs-4">'
										+ reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName
										+ ' <span> '
										+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore
										+ '/'
										+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
										+ '</span></div>';
							}
							htmlCode += '</div>';*/
							
							htmlCode += '<div class="SourceKPIRating col-xs-12">';
							for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
								htmlCode += '<div class="KPIRating col-xs-4"><span style="float:left;margin-right: 5px;">'
									 + reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName+'</span>';
											
									if(reviewForViewDetail.sourceName.toLowerCase()=="tripadvisor" && reviewForViewDetail.fromApi==true){
										htmlCode +='<span  style="float:left;" data-review-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsTA"></span>';
									}
									if(reviewForViewDetail.sourceName.toLowerCase()=="holidayiq" && reviewForViewDetail.fromApi==true){
										htmlCode +='<span  style="float:left;" data-review-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore + '" data-maximum-rating="' + reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue + '" class="starsHIQ"></span>';
									}
									htmlCode+='<span style="float:left;margin-left: 5px;margin-right:35px;" > '
										+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore
										+ '/'
										+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
										+ '</span></div>';
							}
							htmlCode += '</div>';
							/*
							 * if(reviewForViewDetail.kpiTagSentimentAnalysisUIList.length>0){
							 * htmlCode += '<div
							 * class="TradeReviewKpiDepartmentFactor col-xs-12 "
							 * style="display:block;">' + '<div
							 * class="KPIScoreHeader SmallBoldGreyContent
							 * col-xs-12">KPI Polarity Score</div>';
							 * 
							 * 
							 * for (var h = 0; h <
							 * reviewForViewDetail.kpiTagSentimentAnalysisUIList.length;
							 * h++) { htmlCode +='<div class="KPIScore col-xs-4">
							 * '+reviewForViewDetail.kpiTagSentimentAnalysisUIList[h].kpiName+'
							 * <span
							 * class="PositiveSentimentCount">'+reviewForViewDetail.kpiTagSentimentAnalysisUIList[h].kpiFactorScore+'%</span></div>'; }
							 * 
							 * htmlCode +='</div>'; }
							 */
							if (reviewForViewDetail.keywordList.length > 0) {
								htmlCode += '<div id="keywordAndScore_'
										+ reviewForViewDetail.id
										+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
										+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
								for (var h = 0; h < reviewForViewDetail.keywordList.length; h++) {
									for (var p = 0; p < sentimentPolarityList.length; p++) {
										if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "positive") {
											htmlCode += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="PositiveSentimentCount"> '
													+ reviewForViewDetail.keywordList[h].nlpQueryName
													+ '</span></div>';
											break;
										}
										if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "neutral") {
											htmlCode += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="NeutralSentimentCount"> '
													+ reviewForViewDetail.keywordList[h].nlpQueryName
													+ '</span></div>';
											break;
										}
										if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
												&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
												&& sentimentPolarityList[p].sentimentName == "negative") {
											htmlCode += '<div class="KPIScore col-xs-4"> '
													+ ' <span class="NegativeSentimentCount"> '
													+ reviewForViewDetail.keywordList[h].nlpQueryName
													+ '</span></div>';
											break;
										}
									}
								}
								htmlCode += '</div>';
							}
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							/* <!------------------------------------------------------------------------------> */
							/*
							 * <!--------------------------------Share
							 * --------------------------------------->
							 */
							/* <!------------------------------------------------------------------------------> */
							/*htmlCode += '<div class="row">';
							htmlCode += '<div class="col-xs-12 ">';
							htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
							htmlCode += '</div>';
							htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
							htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
							htmlCode += '<div id="shareCountSpan'
									+ reviewForViewDetail.id
									+ '"class="ShareReviewIcon" style="height: 20px; margin-top: 5px; padding-left: 25px;">Share('
									+ reviewForViewDetail.sourceMasterUIList.length
									+ ')</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="SubHeading col-xs-12">';
							htmlCode += '<div class="SmallNormalGreyContent col-xs-12">Share On:</div>';
							htmlCode += '<div id="shareDiv'
									+ reviewForViewDetail.id
									+ '" class="form-group col-xs-10 row">';
							htmlCode += '</div>';
							htmlCode += '<div class="col-xs-12 row">';
							htmlCode += '<div class="form-group input-group col-xs-12 footerButtons">';
							htmlCode += '<button id="Save" onclick="saveShare('
									+ reviewForViewDetail.id
									+ ')" class="btn btn-primary btn-sm" type="button"> Save</button>';
							
							 * htmlCode += '<button id="Cancel" class="btn
							 * btn-default btn-sm" type="button"> Clear</button>';
							 
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>	';
							htmlCode += '</div>';*/
							/*
							 * <!------------------------------------------------------------------------------>
							 * <!-----------------------------Quick Note
							 * ------------------------------------->
							 * <!------------------------------------------------------------------------------>
							 */
							htmlCode += '<div class="row">';
							htmlCode += '<div class="col-xs-12 ">';
							htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
							htmlCode += '</div>';
							htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
							htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
							htmlCode += '<div class="ReviewNoteIcon" style="height: 20px; padding-left: 25px;">Quick Note</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="SubHeading col-xs-12">';
							htmlCode += '<div style="display:none" id="notesForReviewSiteContentId_'
									+ reviewForViewDetail.id + '">';
							htmlCode += '</div>';
							htmlCode += '<p style="display:none ; color:red" class="has-error" id="errorForReviewSiteContentId_'
									+ reviewForViewDetail.id + '"></p>';
							htmlCode += '<div class="col-xs-12">';
							htmlCode += '<div class="form-group input-group col-xs-12">';
							htmlCode += '<label>Enter your note <span class="mandatoryField">*</span></label>';
							htmlCode += '<textarea id="noteForReviewSiteContentId_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm" ></textarea>';
							htmlCode += '</div>';
							htmlCode += '<div class="row ">';
							htmlCode += '<div class="form-group col-xs-6">';
							htmlCode += '<label class="">Share with a department</label>';
							htmlCode += '<div class="">';
							htmlCode += '<select id="departmentForReviewSiteContentId_'
									+ reviewForViewDetail.id
									+ '"  class="form-control input-sm">';
							htmlCode += '<option data-email="" value="" selected disabled>Select a Department</option>';
							for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
							}
							htmlCode += '</select>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group col-xs-6">';
							htmlCode += '<label class="">Share via email</label>';
							htmlCode += '<div class="">';
							htmlCode += '<input id="emailForReviewSiteContentId_'+ reviewForViewDetail.id + '" class="form-control input-sm" placeholder="Enter Email Address">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<button id="Save" onclick="saveNote('
									+ reviewForViewDetail.id
									+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel" class="btn
							 * btn-default btn-sm float-right" type="button"> Clear</button>';
							 */
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							/*
							 * <!------------------------------------------------------------------------------>
							 * <!-----------------------------Quick Note
							 * ------------------------------------->
							 * <!------------------------------------------------------------------------------>
							 */
							htmlCode += '<div class="row">';
							htmlCode += '<div class="col-xs-12 ">';
							htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
							htmlCode += '</div>';
							htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
							htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
							htmlCode += '<div class="ReviewActionIcon" style="height: 20px; padding-left: 25px;">Action</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="SubHeading col-xs-12">';
							htmlCode += '<div class="panel-body row">';
							htmlCode += '<ul class="nav nav-pills">';
							/*htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" href="#Task-pills'
									+ reviewForViewDetail.id
									+ '"  data-actiontype="Task" onclick="getComments('
									+ reviewForViewDetail.id + ','
									+ $('#organizationName option:selected').val()
									+ ',this)" >';
							htmlCode += 'Assign a task';
							htmlCode += '</a>';
							htmlCode += '</li>';*/
							htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" href="#Ticket-pills'
									+ reviewForViewDetail.id
									+ '" data-actiontype="Ticket" onclick="getComments('
									+ reviewForViewDetail.id + ','
									+ $('#organizationName option:selected').val()
									+ ',this)" >';
							htmlCode += 'Raise a ticket';
							htmlCode += '</a>';
							htmlCode += '</li>';
							/*htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" href="#Notify-pills'
									+ reviewForViewDetail.id
									+ '" data-actiontype="Notify" onclick="getComments('
									+ reviewForViewDetail.id + ','
									+ $('#organizationName option:selected').val()
									+ ',this)" >';
							htmlCode += 'Notify';
							htmlCode += '</a>';
							htmlCode += '</li>';*/
							htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" style="display: none;" href="#General-pills'
									+ reviewForViewDetail.id
									+ '" data-actiontype="General" onclick="getComments('
									+ reviewForViewDetail.id
									+ ','
									+ $('#organizationName option:selected').val()
									+ ',this)">';
							htmlCode += 'General';
							htmlCode += '</a>';
							htmlCode += '</li>';
							
						/*	htmlCode += '<li class="">';
							htmlCode += '<a type="button" class="filterButton" data-toggle="modal" data-target=".RespondToReviews">Respond to reviews</a>';
							htmlCode += '</li>';*/
							
							htmlCode += '<li class="">';
							htmlCode += '<a data-toggle="tab" onclick="loadFlags('
									+ reviewForViewDetail.id
									+ ')" href="#Flag-pills'
									+ reviewForViewDetail.id + '">';
							htmlCode += '<span class="glyphicon glyphicon"> </span>';
							htmlCode += 'Flag' + '</a>' + '</li>';
							htmlCode += '</ul>';
							htmlCode += '<div class="Actiontitles" style="display:none" id="notesForTask_'
									+ reviewForViewDetail.id
									+ '">'
									+ '</div>'
									+ '<div class="Actiontitles" style="display:none" id="notesForTicket_'
									+ reviewForViewDetail.id
									+ '">'
									+ '</div>'
									+ '<div class="Actiontitles" style="display:none" id="notesForNotify_'
									+ reviewForViewDetail.id
									+ '">'
									+ '</div>'
									+ '<div  class="Actiontitles"style="display:none" id="notesForGeneral_'
									+ reviewForViewDetail.id + '">' + '</div>';
							htmlCode += '<div class="tab-content">';
							htmlCode += '<div id="Flag-pills'
									+ reviewForViewDetail.id
									+ '" class="row  tab-pane ">';
							htmlCode += '<div class="Actiontitles">';
							htmlCode += '<div class="col-xs-12 form-horizontal">';
							htmlCode += '<div id="flagChkDiv_'
									+ reviewForViewDetail.id
									+ '" class="form-group col-xs-10 row">';
							if ('DUPLICATE_REVIEW' in reviewForViewDetail.flags) {
								htmlCode += '<div class="col-xs-6"><label><input checked value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Duplicate Review</label></div>';
							} else {
								htmlCode += '<div class="col-xs-6"><label><input value="DUPLICATE_REVIEW" id="DUPLICATE_REVIEW_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Duplicate Review</label></div>';
							}
							if ('DELETED_REVIEW' in reviewForViewDetail.flags) {
								htmlCode += '<div class="col-xs-6"><label><input checked value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Review deleted from source</label></div>';
							} else {
								htmlCode += '<div class="col-xs-6"><label><input value="DELETED_REVIEW" id="DELETED_REVIEW_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Review deleted from source</label></div>';
							}
							if ('INCORRECT_LANGUAGE' in reviewForViewDetail.flags) {
								htmlCode += '<div class="col-xs-6"><label><input checked value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Language not correct</label></div>';
							} else {
								htmlCode += '<div class="col-xs-6"><label><input value="INCORRECT_LANGUAGE" id="INCORRECT_LANGUAGE_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Language not correct</label></div>';
							}
							if ('OTHER' in reviewForViewDetail.flags) {
								htmlCode += '<div class="col-xs-6"><label><input checked value="OTHER" id="OTHER_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Other</label></div>';
							} else {
								htmlCode += '<div class="col-xs-6"><label><input value="OTHER" id="OTHER_REVIEWID_'
										+ reviewForViewDetail.id
										+ '" type="checkbox"> Other</label></div>';
							}
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							/*
							 * htmlCode+='<label class="col-xs-3
							 * control-label">Comment<span class="mandatoryField">*</span></label>';
							 */
							htmlCode += '<div class=" col-xs-12">';
							htmlCode += '<div class="">';
							htmlCode += '<input id="flagCommentTxt" maxlength="250" class="form-control input-sm" placeholder="Comment here..">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<button onclick="saveFlag('
									+ reviewForViewDetail.id
									+ ')" id="Save" class="btn btn-primary btn-sm float-right" type="button"> Save</button>';
							/*
							 * htmlCode+='<button onclick="cancelFlag(' +
							 * reviewForViewDetail.id + ')" id="Cancel" class="btn
							 * btn-default btn-sm float-right" type="button"> Cancel</button>';
							 */
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div id="Task-pills'
									+ reviewForViewDetail.id
									+ '" class="row tab-pane">';
							htmlCode += '<div class="col-xs-12 form-horizontal">';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class=" col-xs-9">';
							htmlCode += '<div class="">';
							htmlCode += '<input id="noteForTask_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class="col-xs-4">';
							htmlCode += '<select onchange="populateEmployeesForTask(this)" id="departmentForTask_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option data-email=""  value="" selected disabled>Select a Department</option>';
							for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
							}
							htmlCode += '</select>';
							htmlCode += '</div>';
							
							htmlCode += '<div id="employeeDivForTask_'	+ reviewForViewDetail.id + '" class="col-xs-3">';   //5
								htmlCode += '<select id="employeeForTask_'	+ reviewForViewDetail.id + '" class="form-control input-sm">';
									htmlCode += '<option value="" >Select Employee</option>';
							htmlCode += '</select>';
							htmlCode += '</div>';
							
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class="col-xs-9">';
							htmlCode += '<input id="datetimepickerForTask_'
									+ reviewForViewDetail.id
									+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<button id="SaveTask" data-actiontype="Task" onclick="saveNoteForTask('
									+ reviewForViewDetail.id
									+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div id="Ticket-pills'
									+ reviewForViewDetail.id
									+ '" class="row tab-pane fade">';
							htmlCode += '<div class="col-xs-12 form-horizontal">';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class=" col-xs-9">';
							htmlCode += '<div class="">';
							htmlCode += '<input id="noteForTicket_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							
							
							htmlCode += '<div class="form-group">';
							
							htmlCode += '<label class="col-xs-3 control-label">Priority<span class="mandatoryField">*</span></label>';
							htmlCode += '<div id="ticketPriorityDiv_' + reviewForViewDetail.id + '" class="col-xs-2">';
							htmlCode += '<select id="ticketPriorityOption_'	+ reviewForViewDetail.id + '" class="form-control input-sm">';
								htmlCode += '<option value="High" >High Priority</option>';
								htmlCode += '<option value="Medium" >Medium Priority</option>';
								htmlCode += '<option value="Low" >Low Priority</option>';
							htmlCode += '</select>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							
							
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">For</label>';
							htmlCode += '<div class="col-xs-4">';
							htmlCode += '<select onchange="populateEmployeesForTicket(this)" id="departmentForTicket_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option data-email=""  value="" selected disabled>Select a Department</option>';
							for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
							}
							htmlCode += '</select>';
							htmlCode += '</div>';
							
							htmlCode += '<div id="employeeDivForTicket_' + reviewForViewDetail.id + '" class="col-xs-3">'; //5
								htmlCode += '<select multiple id="employeeForTicket_' + reviewForViewDetail.id + '" class="form-control input-sm employeeoption">';
									/*htmlCode += '<option value="" >Select Employee</option>';*/
							htmlCode += '</select>';
							htmlCode += '</div>';
							
							
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class="col-xs-9">';
							htmlCode += '<input id="datetimepickerForTicket_'
									+ reviewForViewDetail.id
									+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							
							
							htmlCode +='<div id="emailForTicketDiv_'+ reviewForViewDetail.id + '" class="form-group">';
								htmlCode +='<label class="col-xs-3 control-label">Share via email<span class="mandatoryField">*</span></label>';
									htmlCode +='<div class="col-xs-9">';
										htmlCode +='<input id="emailForTicket_'	+ reviewForViewDetail.id + '" class="form-control input-sm" placeholder="Enter Email Address">';
										htmlCode +='</div>';
							htmlCode +='</div>';
							
							
							htmlCode += '<div class="form-group">';
								htmlCode += '<label class="col-xs-3 control-label">CC</label>';
									htmlCode += '<div class="col-xs-9">';
										htmlCode += '<input id="ccEmailsForTicket_'	+ reviewForViewDetail.id + '" class="form-control input-sm" placeholder="Enter CC Emails with comma seperated">';
									htmlCode += '</div>';
							htmlCode += '</div>';
							
							
							htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<button id="SaveTicket" data-actiontype="Ticket" onclick="saveNoteForTicket('
									+ reviewForViewDetail.id
									+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div id="Notify-pills'
									+ reviewForViewDetail.id
									+ '" class="tab-pane fade">';
							htmlCode += '<div class="col-xs-12 form-horizontal">';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class=" col-xs-9">';
							htmlCode += '<div class="">';
							htmlCode += '<input id="noteForNotify_'
									+ reviewForViewDetail.id
									+ '"  class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class="col-xs-4">';
							htmlCode += '<select onchange="populateEmployeesForNotify(this)" id="departmentForNotify_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option data-email=""  value="" selected disabled>Select a Department</option>';
							for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
							}
							htmlCode += '</select>';
							htmlCode += '</div>';
							htmlCode += '<div id="employeeDivForNotify_'
									+ reviewForViewDetail.id
									+ '" class="col-xs-5">';
							htmlCode += '<select id="employeeForNotify_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option value="" >Select Employee</option>';
							htmlCode += '</select>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class="col-xs-9">';
							htmlCode += '<input id="datetimepickerForNotify_'
									+ reviewForViewDetail.id
									+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<button id="SaveNotify" data-actiontype="Notify" onclick="saveNoteForNotify('
									+ reviewForViewDetail.id
									+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div style="display: none;" id="General-pills'
									+ reviewForViewDetail.id
									+ '" class="tab-pane fade">';
							htmlCode += '<div class="col-xs-12 form-horizontal">';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Comment<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class=" col-xs-9">';
							htmlCode += '<div class="">';
							htmlCode += '<input id="noteForGeneral_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm" placeholder="Comment here.." maxlength="250">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">For<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class="col-xs-4">';
							htmlCode += '<select onchange="populateEmployeesForGeneral(this)" id="departmentForGeneral_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option data-email="" value="" selected disabled>Select a Department</option>';
							for (var k = 0; k < departmentList.length; k++) {
								htmlCode += '<option data-email="' + departmentList[k].email + '" data-reviewid="'
										+ reviewForViewDetail.id + '" value="'
										+ departmentList[k].id + '">'
										+ departmentList[k].departmentName
										+ '</option>';
							}
							htmlCode += '</select>';
							htmlCode += '</div>';
							htmlCode += '<div id="employeeDivForGeneral_'
									+ reviewForViewDetail.id
									+ '" class="col-xs-5">';
							htmlCode += '<select id="employeeForGeneral_'
									+ reviewForViewDetail.id
									+ '" class="form-control input-sm">';
							htmlCode += '<option value="" >Select Employee</option>';
							htmlCode += '</select>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group">';
							htmlCode += '<label class="col-xs-3 control-label">Completion Date<span class="mandatoryField">*</span></label>';
							htmlCode += '<div class="col-xs-9">';
							htmlCode += '<input id="datetimepickerForGeneral_'
									+ reviewForViewDetail.id
									+ '" onmouseover="activateDatetimepicker(this)" class="form-control input-sm" placeholder="Select Date and time">';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<button id="SaveGeneral" data-actiontype="General" onclick="saveNoteForGeneral('
									+ reviewForViewDetail.id
									+ ',this)" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeAction('+reviewForViewDetail.id+')"
							 * class="btn btn-default btn-sm float-right"
							 * type="button"> Clear</button>';
							 */
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							
							
							
							/*******************************respond to review*****************************************/
							htmlCode += '<div class="row">';
								htmlCode += '<div class="col-xs-12 ">';
									htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
									htmlCode += '</div>';
									htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
										htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
											htmlCode += '<div class="ReplyToReview" style="height: 30px; padding-left: 25px;">Reply to review</div>';
										htmlCode += '</div>';
										htmlCode += '<div class="SubHeading col-xs-12">';
											htmlCode += '<div class="panel-body row">';
												htmlCode += '<ul class="nav nav-pills">';
													htmlCode += '<li class="">';
													if(reviewForViewDetail.sourceName.toLowerCase()=="tripadvisor")
														htmlCode += '<a  class="filterButton" onclick="showRespondModal('+reviewForViewDetail.id+',\'direct\')">Direct Respond to Review Source</a>';
													else
														htmlCode += '<a  class="filterButton" onclick="respondToDirect('+reviewForViewDetail.id+')" href="//'+reviewForViewDetail.sourceBaseUrl+'" target="_blank" >Direct Respond to Review Source</a>';
													
													htmlCode += '</li>';
											
													htmlCode += '<li class="">';
														htmlCode += '<a type="button" onclick="showRespondModal('+reviewForViewDetail.id+',\'reviewer\')" class="filterButton" >Direct Respond to Reviewer</a>';
													htmlCode += '</li>';
										
													htmlCode += '<li class="">';
														htmlCode += '<a type="button" class="filterButton" onclick="showRespondModal('+reviewForViewDetail.id+',\'reviewSource\')" >Respond by email to Review Source</a>';
													htmlCode += '</li>';
												htmlCode += '</ul>';
							
												htmlCode += '<div class="tab-content">';
												htmlCode += '</div>';
											htmlCode += '</div>';
										htmlCode += '</div>'; //sub head
									htmlCode += '</div>'; //con-10
								htmlCode += '</div>';//col-12
							htmlCode += '</div>';//row
							
							
							/*
							 * <!------------------------------------------------------------------------------>
							 * <!--------------------------------Broadcast
							 * --------------------------------------->
							 * <!------------------------------------------------------------------------------>
							 */
							/*htmlCode += '<div class="row">';
							htmlCode += '<div class="col-xs-12 ">';
							htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2">';
							htmlCode += '</div>';
							htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
							htmlCode += '<div class="col-xs-12 SmallBoldGreyContent">';
							htmlCode += '<div class="BroadcastIcon" style="height: 35px; margin-top: 0; padding-left: 30px; padding-top: 3px;">Broadcast</div>';
							htmlCode += '</div>';
							htmlCode += '<div class="SubHeading col-xs-12">';
							htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
							htmlCode += '<label>';
							if (reviewForViewDetail.broadcastStatus == true) {
								htmlCode += '<input type="checkbox" name="broadcastChk'
										+ reviewForViewDetail.id
										+ '" id="broadcastChk'
										+ reviewForViewDetail.id
										+ '" checked>Tag reviews to hotel website.';
							} else {
								htmlCode += '<input type="checkbox" name="broadcastChk'
										+ reviewForViewDetail.id
										+ '" id="broadcastChk'
										+ reviewForViewDetail.id
										+ '"> Tag reviews to hotel website.';
							}
							htmlCode += '</label>';
							htmlCode += '<button id="Save" onclick="saveBroadcast('
									+ reviewForViewDetail.id
									+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';*/
							/*
							 * htmlCode += '<button id="Cancel"
							 * onclick="closeBroadcast(' + reviewForViewDetail.id+
							 * ')" class="btn btn-default btn-sm float-right"
							 * type="button"> Cancel</button>';
							 */
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							htmlCode += '</div>';
							/*
							 * <!------------------------------------------------------------------------------>
							 * <!-----------------------Respond by email to review source LightBox
							 * --------------------------->
							 * <!------------------------------------------------------------------------------>
							 */
							
							$("#respondModal_"+ reviewForViewDetail.id).remove(); 
					if(!document.getElementById("respondModalLabel_"+ reviewForViewDetail.id)){
							htmlCode += '<div id="respondModal_'+ reviewForViewDetail.id+ '" class="modal fade RespondToReviews" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">';
								htmlCode += '<div class="modal-dialog modal-lg">';
									htmlCode += '<div class="modal-content">';
										htmlCode += '<div class="modal-header">';
											htmlCode += '<button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">x</span></button>';
											htmlCode += '<h4 id="respondModalLabel_'+ reviewForViewDetail.id+ '" class="modal-title">Respond by email to Review Source</h4>';
											htmlCode += '<h4 id="respondsModalLabel_'+ reviewForViewDetail.id+ '" style="display:none" class="modal-title">Responds</h4>';
										htmlCode += '</div>'; //modal heaer
										
										htmlCode += '<div class="modal-body row">';
											htmlCode += '<div class="row col-xs-12 SingleReviewList">';
												htmlCode += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue">';
												for (var p = 0; p < sentimentPolarityList.length; p++) {
													if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage	&& sentimentPolarityList[p].sentimentName == "positive") {
														htmlCode += '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+ reviewForViewDetail.repufactorScore.toFixed(2) + '%</span> </div>';
														break;
													}
													if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "neutral") {
														htmlCode += '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">' + reviewForViewDetail.repufactorScore.toFixed(2) + '%</span> </div>';
														break;
													}
													if (Math.round(reviewForViewDetail.repufactorScore) >= sentimentPolarityList[p].minPercentage	&& Math.round(reviewForViewDetail.repufactorScore) <= sentimentPolarityList[p].maxPercentage && sentimentPolarityList[p].sentimentName == "negative") {
														htmlCode += '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'	+reviewForViewDetail.repufactorScore.toFixed(2) + '%</span> </div>';
														break;
													}
												}
												
												htmlCode += '<div class="reviewDetails row">';
												htmlCode += '<div class="reviewSource">' + reviewForViewDetail.sourceName
														+ '</div>';
												htmlCode += '<div class="reviewerName">by <span>';
												if (reviewForViewDetail.reviewerName != null
														|| $.trim(reviewForViewDetail.reviewerName) == ""
														|| $.trim(reviewForViewDetail.reviewerName).indexOf('\"\"') != -1) {
													htmlCode += '' + reviewForViewDetail.reviewerName + '';
												} else {
													htmlCode += 'Not Available';
												}
												htmlCode += '</span></div>';
												htmlCode += '<div class="reviewerDetail">from <span>';
												if (reviewForViewDetail.reviewLocation == null
														|| reviewForViewDetail.reviewLocation == "") {
													htmlCode += ' Not Available </span></div>';
												} else {
													htmlCode += '' + reviewForViewDetail.reviewLocation + '</span></div>';
												}
												htmlCode += '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '
														+ moment(reviewForViewDetail.reviewTime).format("DD MMMM YYYY")
														+ '</span>';
												htmlCode += '</div>';
												htmlCode += '</div>';
												
												
												htmlCode += '</div>'; //light blue
												htmlCode += '<div class="col-xs-12 col-sm-9 col-lg-10">';
																if (reviewForViewDetail.reviewTitle != null) {
																	htmlCode += '<h3 class="SingleReviewHeader">'+ reviewForViewDetail.reviewTitle + '</h3>';
																}
																htmlCode += '<p>' + reviewForViewDetail.reviewContent+ '</p>';
																
																if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
																	//original review
																	htmlCode += '<p id="originalReview_'+reviewForViewDetail.id+'" style="display:none">' + reviewForViewDetail.reviewContent + '</p>';
																}
																
																// star review rating from Review content site table
																htmlCode += '<div class="SourceRating col-xs-12">';
																htmlCode += '<span>Source Rating </span><span data-review-rating="'
																		+ reviewForViewDetail.reviewOverallRating
																		+ '" data-maximum-rating="'
																		+ reviewForViewDetail.maxOverallRating
																		+ '" class="stars">'
																		+ reviewForViewDetail.reviewOverallRating
																		+ '</span><span>'
																		+ reviewForViewDetail.reviewOverallRating
																		+ '/'
																		+ reviewForViewDetail.maxOverallRating
																		+ '</span>';
																		
																	if(reviewForViewDetail.reviewContent!="" && reviewForViewDetail.reviewContent!=null && reviewForViewDetail.reviewLanguage!="Unknown" && reviewForViewDetail.reviewLanguage!="N/A" && reviewForViewDetail.reviewLanguage!=null && reviewForViewDetail.reviewLanguage!="" && reviewForViewDetail.reviewLanguage.toUpperCase()!="ENGLISH" && reviewForViewDetail.reviewLanguage.toUpperCase()!="EN"){
																		htmlCode += '<span  style="float:right;float:z;color:green;"><a onclick="showOriginalReview('+reviewForViewDetail.id+')" href="javascript:void(0)">Original Review</a></span>';
																	}
																
																		/*if(reviewForViewDetail.respondStatus==true){
																			htmlCode += '<span  style="float:right;color:red;">Replied To Review</span>';
																		}else{
																			htmlCode += '<span id="repliedToReview_'+reviewForViewDetail.id+'" style="display:none;float:right;color:red;">Replied To Review</span>';
																		}*/
																		
																		
																htmlCode += '</div>';
																
																/*	htmlCode += '<div id="sourceKPIRating'+reviewForViewDetail.id+'" class="SourceKPIRating col-xs-12">';
																for (var h = 0; h < reviewForViewDetail.kpiIndustryMasterUiList.length; h++) {
																	htmlCode += '<div class="KPIRating col-xs-4">'
																			+ reviewForViewDetail.kpiIndustryMasterUiList[h].kpiSourceName
																			+ ' <span> '
																			+ reviewForViewDetail.kpiIndustryMasterUiList[h].sourceKpiScore
																			+ '/'
																			+ reviewForViewDetail.kpiIndustryMasterUiList[h].maxRatingValue
																			+ '</span></div>';
																}
																htmlCode += '</div>';
																
																
																if (reviewForViewDetail.keywordList.length > 0) {
																	htmlCode += '<div id="keywordAndScoreModal_'
																			+ reviewForViewDetail.id
																			+ '" class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive">'
																			+ '<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
																	for (var h = 0; h < reviewForViewDetail.keywordList.length; h++) {
																		for (var p = 0; p < sentimentPolarityList.length; p++) {
																			if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "positive") {
																				htmlCode += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="PositiveSentimentCount"> '
																						+ reviewForViewDetail.keywordList[h].nlpQueryName + '</span></div>';
																				break;
																			}
																			if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "neutral") {
																				htmlCode += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="NeutralSentimentCount"> '
																						+ reviewForViewDetail.keywordList[h].nlpQueryName + '</span></div>';
																				break;
																			}
																			if (Math.round(reviewForViewDetail.keywordList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
																					&& Math.round(reviewForViewDetail.keywordList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
																					&& sentimentPolarityList[p].sentimentName == "negative") {
																				htmlCode += '<div class="KPIScore col-xs-4"> '
																						+ ' <span class="NegativeSentimentCount"> '
																						+ reviewForViewDetail.keywordList[h].nlpQueryName +'</span></div>';
																				break;
																			}
																		}
																	}
																	htmlCode += '</div>';
																}*/
																
																htmlCode += '<div class="form-group input-group col-xs-12">';
																	htmlCode += '<div class="form-group input-group col-xs-12">';
																		htmlCode += '<input type="email" id="reviewerEmail_'+reviewForViewDetail.id+'" class="form-control input-sm" placeholder="Enter Reviewer Email Address">';
																	htmlCode += '</div>';
																	htmlCode += '<textarea id="respond_'+ reviewForViewDetail.id+ '"placeholder="Enter your response here" style="width: 704px; height: 145px;" maxlength="1000" class="form-control input-sm"></textarea>';
																	htmlCode+='<span id="responds_'+ reviewForViewDetail.id + '" style="display:none"></span>';
																htmlCode += '</div>';
																htmlCode += '<div class="form-group input-group form-inline col-xs-12">';
																	htmlCode += '<div id="validationMessageDiv_'+ reviewForViewDetail.id + '" ></div>';
																		htmlCode += '<button id="save_'+ reviewForViewDetail.id+ '"  onclick="respondToReview('+ reviewForViewDetail.id+ ','	+ reviewForViewDetail.sourceId+ ')" class="btn btn-primary btn-sm float-right" type="button"> Send</button>';
																		htmlCode += '<button id="cancel_'+ reviewForViewDetail.id+ '" onclick="resetRespond('+ reviewForViewDetail.id+ ')" data-dismiss="modal" class="btn btn-default btn-sm float-right" type="button"> Cancel</button>';
																		htmlCode += '<button data-dismiss="modal" id="ok_'+reviewForViewDetail.id+'" style="display:none" class="btn btn-default btn-sm float-right" type="button"> Close</button>';
																htmlCode += '</div>'; //form-inline col-xs-12 closed
												htmlCode += '</div>'; //col-lg-10 closed
											htmlCode += '</div>'; //SingleReviewList
										htmlCode += '</div>';//modal-body row
									htmlCode += '</div>'; //modal-content
								htmlCode += '</div>';//modal-dialog modal-lg
							htmlCode += '</div>'; //respondModal_
					}
							$('#hotelReviewsDivId').hide();
							$("#page-selection").hide();
							$("#searchBar").hide();
							restoreHotelReviewsDivIdHtml = $('#hotelReviewsDivId').html();
							restoreFilterBarHtml = $('#filterBar').html();
							selectedSortOption=$( "#sortSelectOption option:selected" ).val();
							$('#hotelReviewsDivId').html(htmlCode);
							
							if($("span.stars")!==undefined){
								$('span.stars').stars();
							}
							if($("span.starsTA")!==undefined){
								$('span.starsTA').stars();
							}
							if($("span.starsHIQ")!==undefined){
								$('span.starsHIQ').stars();
							}
							var barHtmlCode = '<div class="row">'
									+ '<div class="col-lg-12 SubHeading SmallDarkGreyHeader">'
									+ '<span> <a onclick="restore('
									+ reviewForViewDetail.id
									+ ')">Trade Reviews </a></span>'
									+ '<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>'
									+ '<span>Review</span>' + '</div>' + '</div>';
							$('#filterBar').html(barHtmlCode);
							$('#hotelReviewsDivId').show(600);
							getMappedSourcesForReview(reviewForViewDetail.id);
							var organizationId = $(
									'#organizationName option:selected').val();
							getNotes(reviewForViewDetail.id, organizationId);
							// function for star
							if($("span.stars")!==undefined){
								$('span.stars').stars();
							}
							if($("span.starsTA")!==undefined){
								$('span.starsTA').stars();
							}
							if($("span.starsHIQ")!==undefined){
								$('span.starsHIQ').stars();
							}
							$('.btn-flag').click(
									function() {
										$('.active').removeClass('active');
										$('.OnSeleceActive').removeClass(
												'OnSeleceActive');
										$(this).next('.flagOptions').addClass(
												'OnSeleceActive');
									});
							$('.CancelReviewFlag').click(
									function() {
										$(this).parents('.flagOptions')
												.removeClass('OnSeleceActive');
									});
							$('.SaveReviewFlag').click(
									function() {
										$(this).parents('.flagOptions')
												.removeClass('OnSeleceActive');
									});
							$('.ShowSemanticPolarity').click(
									function() {
										/*
										 * $('.active').removeClass('active');
										 * $('.OnSeleceActive').removeClass('OnSeleceActive');
										 * $(this).next(".col-xs-12").children(
										 * '.TradeReviewKpiDepartmentFactor').addClass(
										 * 'OnSeleceActive');
										 */
										var keywordDivId = "keywordAndScore_"
												+ $(this).data('reviewid');
										/*console.log(keywordDivId + " 7");*/
										if ($("#" + keywordDivId).hasClass(
												"OnSeleceActive")) {
											$("#" + keywordDivId).removeClass(
													"OnSeleceActive");
										} else {
											$("#" + keywordDivId).addClass(
													"OnSeleceActive");
										}
										/*
										 * $(keywordDivId).show();
										 * console.log(keywordDivId+" 7");
										 */
									});
							$('.userPrimeAction').click(function() {
								$('.active').removeClass('active');
								$('.OnSeleceActive').removeClass('OnSeleceActive');
							});
						}
					},
					error : function(response) {
						return false;
					}
				});
	}
	
	function showRespondModal(reviewId,type) {
		
		document.getElementById("respond_"+reviewId).value = "";
		$('#respondModalLabel_'+reviewId).show();
		$('#respondsModalLabel_'+reviewId).hide();
		/*$('#sourceKPIRating'+reviewId).show();
		$('#keywordAndScoreModal_'+reviewId).show();*/
		 
		$('#reviewerEmail_'+reviewId).show();
		$('#respond_'+reviewId).show();
		$('#responds_'+reviewId).hide();
		$('#save_'+reviewId).show();
		$('#cancel_'+reviewId).show();
		$('#ok_'+reviewId).hide();
		
		
		$('#reviewerEmail_' + reviewId).val("");
		
		$('#validationMessageDiv_' + reviewId).html("");
		$("#notesForTask_" + reviewId).hide();
		$("#notesForTicket_" + reviewId).hide();
		$("#notesForNotify_" + reviewId).hide();
		$("#notesForGeneral_" + reviewId).hide();
		if(type=="reviewSource"){
			$("#reviewerEmail_" + reviewId).hide();
			$('#respondModalLabel_' + reviewId).text("Respond by email to Review Source");
		}
		if(type=="reviewer"){
			$("#reviewerEmail_" + reviewId).show();
			$('#respondModalLabel_' + reviewId).text("Direct respond to Reviewer");
		}
		if(type=="direct"){
			$("#reviewerEmail_" + reviewId).hide();
			$('#respondModalLabel_' + reviewId).text("Direct Respond to Review Source");
		}
//		if(type!="direct"){
//			$('#respondModal_' + reviewId).appendTo("body").modal('show');
//		}
		$('#respondModal_' + reviewId).appendTo("body").modal('show');
	}
	
	
	function saveSessionDatas(){
		 var f = $('#altFromDate').val().split(/[.,\/ -]/);
		 var fromDate=f[2]+"-"+f[0]+"-"+f[1];
		 
		 var t = $('#altToDate').val().split(/[.,\/ -]/);
		 var toDate=t[2]+"-"+t[0]+"-"+t[1];
		 
		var orgId = $('#organizationName option:selected').val();
		
		$.ajax({
				type:"GET",
				url:"../adminDashboard/saveSessionData.htm?organizationId="+orgId+"&fromDate="+fromDate+"&toDate="+toDate,
				contentType:"application/json",
				success:function(response){
					/*if(response.status=="SUCCESS"){
						
					}*/
				},error:function(response){
					alert("errors");	
				}
		});
	}
	
	function saveSessionDataForMilestone(){
		 var f = $('#altFromDate').val().split(/[.,\/ -]/);
		 var fromDate=f[0]+"-"+f[1]+"-"+f[2];
		 
		 var t = $('#altToDate').val().split(/[.,\/ -]/);
		 var toDate=t[0]+"-"+t[1]+"-"+t[2];
		 
		var orgId = $('#organizationName option:selected').val();
		
		$.ajax({
				type:"GET",
				url:"../adminDashboard/saveSessionDataForMilestone.htm?organizationId="+orgId+"&fromDate="+fromDate+"&toDate="+toDate,
				contentType:"application/json",
				success:function(response){
					if(response.status=="SUCCESS"){
						console.log("saved ");
					}
				},error:function(response){
					alert("errors");	
				}
		});
	}
	
	function showAlertModal(title,body){
		$('#successModalTitle').text(title);
		$('#successModalText').text(body);
		$('#successModal').modal('show');
	}
	
	function showOldMentionToolTip(qcId,reviewId){
		var oldMentionName = $('#qcDiv_'+qcId+'_'+reviewId+'_mention').val();
		$('#qcId_'+qcId+'_MENTION').tinytooltip({message:oldMentionName});
	}
	

	if ($('#back-to-top').length) {
	    var scrollTrigger = 100, // px
	        backToTop = function () {
	            var scrollTop = $(window).scrollTop();
	            if (scrollTop > scrollTrigger) {
	                $('#back-to-top').addClass('show');
	            } else {
	                $('#back-to-top').removeClass('show');
	            }
	        };
	    backToTop();
	    $(window).on('scroll', function () {
	        backToTop();
	    });
	    $('#back-to-top').on('click', function (e) {
	        e.preventDefault();
	        $('html,body').animate({
	            scrollTop: 0
	        }, 700);
	    });
	}
	
	function isEmail(email) { 
	    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(email);
	} 
	
	function showOriginalReview(reviewId){
		$('#originalReview_'+reviewId).toggle(200);
	}
	function upercaseFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}
	function lowercaseFirstLetter(string) {
	    return string.charAt(0).toLowerCase() + string.slice(1);
	}

	
	
	
	
	
	function markReadUpdate(reviewId,markRead){
		var reviews=[{"id":reviewId,"markRead":markRead}];
		markReadBatchUpdate(reviews);
	}
	function markAll(){
		var reviews=[];
		var markParam = $('#markReadSelectOption option:selected').val();
		var spans = document.getElementsByClassName("markReadClass");
		if(markParam=="read"){
			$(spans).each(function(index,value){
				var reviewId=$(this).data("name");
				var review={"id":reviewId,"markRead":true};
				reviews.push(review);
			});
		}
		if(markParam=="unread"){
			$(spans).each(function(index,value){
				var reviewId=$(this).data("name");
				var review={"id":reviewId,"markRead":false};
				reviews.push(review);
			});
		}
		markReadBatchUpdate(reviews);
	}

	function markReadBatchUpdate(reviews){
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		
		
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/updateMarkRead.htm",
			contentType : "application/json",
			data : JSON.stringify(reviews),
			success : function(response) {
				if(response.status=="SUCCESS"){
					$('#leftNavigation,#wrapper,#header').unmask();
					$(reviews).each(function(index,value){
						var htmlCode="";
						if(reviews[index].markRead==true){
							htmlCode += '<a onclick="markReadUpdate('+reviews[index].id+',false)" href="#">Mark as Unread | </a>';
						}else{
							htmlCode += '<a onclick="markReadUpdate('+reviews[index].id+',true)" href="#">Mark as Read | </a>';
						}
						$("#markReadSpan_"+reviews[index].id).html(htmlCode);
					});
					if(reviews.length>1){
						$('#broadcastSuccessModalTitle').text("Success");
						$('#broadcastSuccessModalText')
								.text("Review(s) has been marked successfully !");
						$('#broadcastSuccessModal').modal('show');
					}
			}else{
				$('#broadcastSuccessModalTitle').text("Error");
				$('#broadcastSuccessModalText')
						.text("Sorry , Error occurred contact admin !");
				$('#broadcastSuccessModal').modal('show');
			}
		}
	   });
	}
	
	function cancelRaiseTicket(reviewId){
		document.getElementById('Action-pills' + reviewId).setAttribute("class","SubHeading tab-pane fade");
		$("#departmentForTicket_" + reviewId).prop('selectedIndex', 0);
		$("#employeeForTicket_" + reviewId).prop('selectedIndex', 0);
		$("#datetimepickerForTicket_" + reviewId).val("");
		$("#ccEmailsForTicket_" + reviewId).val("");
		$("#emailForTicket_" + reviewId).val("");
		$("#noteForTicket_" + reviewId).val("");
		$("#noteForTicket_" + reviewId).val("");
		$("#employeeForTicket_" + reviewId).multiselect("uncheckAll");
	}
	function saveNoteForTicket(reviewId, obj) {
		
		$(".employeeoption").multiselect();
		
		var organizationId = $('#organizationName option:selected').val();
		var noteVale = $.trim($("#noteForTicket_" + reviewId).val());
		var departmentOptionValue = $("#departmentForTicket_" + reviewId).val();
		
		if(departmentOptionValue==null){
			departmentOptionValue=0;
		}
		var dateTimeValue = $.trim($("#datetimepickerForTicket_" + reviewId).val());
		var email = $.trim($("#emailForTicket_" + reviewId).val());
		
		var priority=$('#ticketPriorityOption_'+reviewId+' option:selected').val();
		var _ccEmails = $.trim($("#ccEmailsForTicket_" + reviewId).val());
		var temp=_ccEmails.split(",");
		var ccEmails=[];
		for(var i=0;i<temp.length;i++){
			if($.trim(temp[i])!=""){
				ccEmails.push($.trim(temp[i]));
			}
		}
		
		var users = $("#employeeForTicket_" + reviewId).multiselect("getChecked").map(function(){
			   return this.value;    
		}).get();
		//var employeeOptionValue = $("#employeeForTicket_" + reviewId).val();
		/*if (noteVale == "" || dateTimeValue == "" || departmentOptionValue == null || employeeOptionValue == null) {*/
		
		if (noteVale == "" || dateTimeValue == "" || (email=="" && users.length==0)) {
			$('#broadcastSuccessModalTitle').text("Alert");
			$('#broadcastSuccessModalText').text("Mandatory fileds(*) are required !");
			$('#broadcastSuccessModal').modal('show');
			return;
		}
		
		var result=true;
		result=vailidationForTicketMail([email]);
	    if(result==false){
	    	return;
	    }
	    
	    result=vailidationForTicketMail(ccEmails);
		if(result==false){
		   	return;
		}	
		
		var reviewActionList=[];
		if(users.length>0){
			$(users).each(function(index,value){
		reviewAction = {
						'userId':users[index],
						'priority':priority,
						'ccEmails':ccEmails,
						'email':email,
			'actionType' : 'Raise a Ticket',
			'orgId' : organizationId,
			'reviewId' : reviewId.toString(),
			'comment' : noteVale,
			'departmentId' : departmentOptionValue,
									//'userId' : employeeOptionValue,
			'completionDateStr' : dateTimeValue
		};
					reviewActionList.push(reviewAction);
			});
		}else{
			reviewAction = {
					'userId':0,
					'priority':priority,
					'ccEmails':ccEmails,
					'email':email,
					'actionType' : 'Raise a Ticket',
					'orgId' : organizationId,
					'reviewId' : reviewId.toString(),
					'comment' : noteVale,
					'departmentId' : departmentOptionValue,
					//'userId' : employeeOptionValue,
					'completionDateStr' : dateTimeValue
				};
				reviewActionList.push(reviewAction);
		}
		
		console.log(reviewActionList);

		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/saveAction.htm",
			contentType : "application/json",
			data : JSON.stringify(reviewActionList),
			success : function(response) {
				if (response.status == "SAVE_SUCCESS") {
					getComments(reviewId, organizationId, obj);
					$("#departmentForTicket_" + reviewId).prop('selectedIndex', 0);
					$("#employeeForTicket_" + reviewId).prop('selectedIndex', 0);
					$("#datetimepickerForTicket_" + reviewId).val("");
					$("#ccEmailsForTicket_" + reviewId).val("");
					$("#emailForTicket_" + reviewId).val("");
					$("#emailForTicketDiv_" + reviewId).show();
					$("#noteForTicket_" + reviewId).val("");
					$("#noteForTicket_" + reviewId).val("");
					$("#employeeForTicket_" + reviewId).multiselect("uncheckAll");
					
					$('#leftNavigation,#wrapper,#header').unmask();
				}
			},
			error : function(response) {
				$('#broadcastSuccessModalTitle').text("Error");
				$('#broadcastSuccessModalText').text(
						"Something went wrong , please contact admin !");
				$('#broadcastSuccessModal').modal('show');
			}
		});
	}

	function vailidationForTicketMail(_array){
		var result=true;
		$(_array).each(function(index,value){
			if(_array[index]!="" && !isEmail(_array[index])){
				$('#broadcastSuccessModalTitle').text("Alert");
				$('#broadcastSuccessModalText').text("Please provide valid email id !");
				$('#broadcastSuccessModal').modal('show');
				result=false;
			}
		});
		return result;
	}
	function respondToReview(reviewId, sourceId) {
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
			contentType : "application/json",
			success : function(response) {
				if(response.status=="LIST_SUCCESS"){
					var review=response.successObject.review;
					//console.log(review);
					var reviewId = "" + review.id;
					var sourceId = "" + review.sourceId;
					var organizationId = $('#organizationName option:selected').val();
					var responseType="";
					var reviewerMail="";
					var modalTitle=$('#respondModalLabel_'+reviewId).text();
					if(modalTitle.indexOf("Review Source")!=-1){
						responseType="REVIEW_SOURCE";
					}
					if(modalTitle.indexOf("Reviewer")!=-1){
						responseType="REVIEWER";
						reviewerMail=$('#reviewerEmail_'+reviewId).val();
					}
					var respond = $('#respond_' + reviewId).val();
					if ($('#respond_' + reviewId).val() == null
							|| $('#respond_' + reviewId).val() == ""
							|| $('#respond_' + reviewId).val() == " ") {
						
						var htmlCode="";
						
						if(responseType=="REVIEWER" && reviewerMail==""){
							htmlCode = '<p><font size="3" color="red">Please Enter Response And Reviewer email !</font></p>';
						}else{
							htmlCode = '<p><font size="3" color="red">Please Enter Response to review.</font></p>';
						}
						
						$('#validationMessageDiv_' + reviewId).html(htmlCode);
						$('#validationMessageDiv_' + reviewId).show();
					}else {
						
						if(responseType=="REVIEWER" && reviewerMail==""){
							var htmlCode = '<p><font size="3" color="red">Please Enter Reviewer email !</font></p>';
							$('#validationMessageDiv_' + reviewId).html(htmlCode);
							$('#validationMessageDiv_' + reviewId).show();
							return;
						}
						
						if(responseType=="REVIEWER" && !isEmail(reviewerMail)){
							var htmlCode = '<p><font size="3" color="red">Please Enter Reviewer vaild email !</font></p>';
							$('#validationMessageDiv_' + reviewId).html(htmlCode);
							$('#validationMessageDiv_' + reviewId).show();
							return;
						}
						
						var reviewResponseUI = {
							'organizationId' : organizationId,
							'reviewSiteContentId' : reviewId,
							'reviewContent' : review.reviewContent,
							'reviewerMail':reviewerMail,
							'responseType':responseType,
							'response' : respond,
							'sourceId' : sourceId
						};
						
						$('#wrapper').mask('Loading...');
						$('#leftNavigation,#header').mask();

						/* reply to review changes */
						var urldata = "../reviewSitesContent/respondToReview.htm";
                        if(modalTitle.indexOf("Direct Respond to Review Source")!=-1 && (sourceId == '2' || sourceId == '8' || sourceId == '5')) {
                            urldata = "../reviewReplyContent/saveReviewReplyContent.htm";
                            reviewResponseUI = {
                                            "reviewSubject":review.reviewTitle,
                                            "reviewContent":review.reviewContent,
                                            "reviewReplyText":respond,
                                            "sourceId":sourceId,
                                            "organizationId":organizationId,
                                            'reviewSiteContentId' : reviewId,   
                                            'reviewId' : review.reviewId                                      
                                         }                                                    
                        }
                        
						$.ajax({
									type : "POST",
									url : urldata,
									contentType : "application/json",
									data : JSON.stringify(reviewResponseUI),
									success : function(response) {
										if (response.status == "SAVE_SUCCESS") {
											$('#broadcastSuccessModalTitle').text("Success");
											if(modalTitle.indexOf("Direct Respond to Review Source")!=-1) {
												$('#broadcastSuccessModalText').text("Respond successfully Saved !");
					                        } else {
					                        	$('#broadcastSuccessModalText').text("Respond successfully has been mailed !");
											}
											$('#broadcastSuccessModal').modal('show');
											$('#respond_' + reviewId).val('');
											$('#validationMessageDiv_' + reviewId).hide();
											$('#respondModal_' + reviewId).modal('hide');
											$('#repliedToReview_'+reviewId).show();
											$('#leftNavigation,#wrapper,#header').unmask();
										} else {
											if (response.status == "SAVE_ERROR") {
												$('#leftNavigation,#wrapper,#header').unmask();
												$('#respondModal_' + reviewId).modal('hide');
												$('#broadcastSuccessModalTitle').text("Error");
												$('#broadcastSuccessModalText').text(response.errorMessage);
												$('#broadcastSuccessModal').modal('show');
												
												if (response.errorMessage == "Email adress not found for selected source, Please contact admin ! ") {
													$('#validationMessageDiv_' + reviewId).hide();
												}
											}
										}
									},
									error : function(response) {
										$('#broadcastSuccessModalTitle').text("Error");
										$('#broadcastSuccessModalText').text("Something went wrong , please contact admin !");
										$('#broadcastSuccessModal').modal('show');
									}
								});
					}
				
				}
			}
		});
	}

	function respondToDirect(reviewId) {
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/fetchReview.htm?reviewId="+reviewId,
			contentType : "application/json",
			success : function(response) {
				if(response.status=="LIST_SUCCESS"){
					var review=response.successObject.review;
					var reviewId = "" + review.id;
					var sourceId = "" + review.sourceId;
					var organizationId = $('#organizationName option:selected').val();
					var responseType="DIRECT";
					var reviewerMail="";
					var respond = "";
				
					var reviewResponseUI = {
						'organizationId' : organizationId,
						'reviewSiteContentId' : reviewId,
						'reviewContent' : review.reviewContent,
						'reviewerMail':reviewerMail,
						'responseType':responseType,
						'response' : respond,
						'sourceId' : sourceId
					};
					
					$.ajax({
								type : "POST",
								url : "../reviewSitesContent/respondToReview.htm",
								contentType : "application/json",
								data : JSON.stringify(reviewResponseUI),
								success : function(response) {
										if (response.status == "SAVE_ERROR") {
											$('#broadcastSuccessModalTitle').text("Error");
											$('#broadcastSuccessModalText').text(response.errorMessage);
											$('#broadcastSuccessModal').modal('show');
										}
										if(response.status == "SAVE_SUCCESS"){
											$('#repliedToReview_'+reviewId).show();
										}
								},
								error : function(response) {
									$('#broadcastSuccessModalTitle').text("Error");
									$('#broadcastSuccessModalText').text("Something went wrong , please contact admin !");
									$('#broadcastSuccessModal').modal('show');
								}
					});
				}
			}
		});
	}

	function getResponds(reviewId) {
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/getResponds.htm?reviewId="+reviewId,
			contentType : "application/json",
			success : function(response) {
				if(response.status=="LIST_SUCCESS"){
					var responds=response.successObject.responds;
					var respondsHtml="";
					for(var i=0;i<responds.length;i++){
						if(responds[i].replyStatus !=null && responds[i].replyStatus != '') 
							respondsHtml+='<strong>Response : </strong>'+responds[i].response+" <strong>Type : </strong>"+responds[i].responseTypeStr+" <strong>Date : </strong>"+responds[i].createdDateStr+" <strong>User : </strong>"+responds[i].userName+'<br />'+" <strong>Status : </strong>"+responds[i].replyStatus+'<br />';
						else
							respondsHtml+='<strong>Response : </strong>'+responds[i].response+" <strong>Type : </strong>"+responds[i].responseTypeStr+" <strong>Date : </strong>"+responds[i].createdDateStr+" <strong>User : </strong>"+responds[i].userName+'<br />';
					}
					$('#responds_'+reviewId).html(respondsHtml);
					showRespondModal(reviewId,'reviwer');
					$('#respondModalLabel_'+reviewId).hide();
					$('#respondsModalLabel_'+reviewId).show();
					/*$('#sourceKPIRating'+reviewId).hide();
					$('#keywordAndScoreModal_'+reviewId).hide();*/
					$('#reviewerEmail_'+reviewId).hide();
					$('#respond_'+reviewId).hide();
					$('#responds_'+reviewId).show();
					$('#save_'+reviewId).hide();
					$('#cancel_'+reviewId).hide();
					$('#ok_'+reviewId).show();
			}
		}
	   });
	}
	
	function populateEmployeesForTicket(obj) {
		
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		
		
		
		var organizationId = $('#organizationName option:selected').val();
		var departmentId = $(obj).val();
		var selected = $(obj).find('option:selected');
		var reviewId = selected.data('reviewid');
		$.ajaxSetup({
			cache : false
		});
		$
				.ajax({
					type : "GET",
					url : "../reviewSitesContent/getMappedUsersForDepartment.htm?organizationId="
							+ organizationId + "&departmentId=" + departmentId,
					contentType : "application/json",
					success : function(response) {
						var tempHtml = '';
						userList = response.successObject.users;
						
						if(userList.length>0){
							$("#emailForTicketDiv_"+reviewId).hide();
							$("#emailForTicket_"+reviewId).val("");
							$("#ccEmailsForTicket_"+reviewId).val("");
						}else{
							$("#emailForTicketDiv_"+reviewId).show();
						}
						
						tempHtml += '<select multiple id="employeeForTicket_' + reviewId
								+ '"  class="form-control input-sm employeeoption">';
						//tempHtml += '<option disabled selected>Select a Employee</option>';
						for (var k = 0; k < userList.length; k++) {
							tempHtml += '<option data-mail="' + userList[k].userName + '" value="' + userList[k].id + '">'
									+ userList[k].userFirstName + '</option>';
						}
						/*if (userList.length == 0) {
							tempHtml += '<option disabled>No Employee Found</option>';
						}*/
						tempHtml += '</select>';
						$("#employeeDivForTicket_" + reviewId).html(tempHtml);
						$(".employeeoption").multiselect();
						$('#leftNavigation,#wrapper,#header').unmask();
					},
					error : function(response) {
						return false;
					}
				});
	}
	function saveNote(reviewSiteContentId) {
		$("#" + "errorForReviewSiteContentId_" + reviewSiteContentId).hide();
		var organizationId = $('#organizationName option:selected').val();
		var note = $.trim($('#noteForReviewSiteContentId_' + reviewSiteContentId).val());
		var externalEmail = $.trim($('#emailForReviewSiteContentId_' + reviewSiteContentId).val());
		var depId = 'departmentForReviewSiteContentId_' + reviewSiteContentId;
		var departmentId = $("#" + depId + " option:selected").val();
		if (!$.isNumeric(departmentId)) {
			departmentId = 0;
		}
		var noteObj = {
			"departmentId" : departmentId,
			"organizationId" : organizationId,
			"note" : note,
			"externalEmail" : externalEmail,
			"reviewSiteContentId" : reviewSiteContentId
		};
		$
				.ajax({
					type : "POST",
					url : "../reviewSitesContent/saveNote.htm",
					contentType : "application/json",
					data : JSON.stringify(noteObj),
					success : function(response) {
						if (response.status == "SAVE_SUCCESS") {
							$("#departmentForReviewSiteContentId_" + reviewSiteContentId).prop('selectedIndex', 0);
							
							getNotes(reviewSiteContentId, organizationId);
							/* $('#'+depId).trigger('change'); */
							$('#noteForReviewSiteContentId_' + reviewSiteContentId)
									.val('');
							$('#emailForReviewSiteContentId_' + reviewSiteContentId)
									.val('');
						} else if (response.status == "SAVE_ERROR") {
							var errorInfo = "";
							for (var i = 0; i < response.errorMessageList.length; i++) {
								var fieldName = response.errorMessageList[i].fieldName;
								var errorMessage = response.errorMessageList[i].message;
								errorInfo += "<br>" + (i + 1) + ". " + fieldName
										+ " : " + errorMessage;
							}
							$(
									"#" + "errorForReviewSiteContentId_"
											+ reviewSiteContentId)
									.html(
											"Please correct following errors: "
													+ errorInfo);
							$(
									"#" + "errorForReviewSiteContentId_"
											+ reviewSiteContentId).show('slow');
						}
					},
					error : function(response) {
					}
				});
		return false;
	}
	function getComments(reviewSiteContentId, organizationId, obj) {
		actionType = $(obj).data('actiontype');
		$("#emailForTicketDiv_" + reviewSiteContentId).show();
		
		$("#notesForTask_" + reviewSiteContentId).hide();
		$("#notesForTicket_" + reviewSiteContentId).hide();
		$("#notesForNotify_" + reviewSiteContentId).hide();
		$("#notesForGeneral_" + reviewSiteContentId).hide();
		$("#notesFor" + actionType + "_" + reviewSiteContentId).hide();
		$("#notesFor" + actionType + "_" + reviewSiteContentId).html('');
		/* $("#errorFor"+actionType+"_"+reviewSiteContentId).html(''); */
		if (actionType == "Ticket") {
			actionType = "Raise a Ticket";
		}
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		
		
		$.ajax({
					type : "GET",
					url : "../reviewSitesContent/getComments.htm?organizationId="+ organizationId + "&reviewSiteContentId="+ reviewSiteContentId + "&actionType=" + actionType,
					contentType : "application/json",
					success : function(response) {
						commentsList = response.successObject.listComments;
						var htmlCode = '';
						for (var i = 0; i < commentsList.length; i++) {
							htmlCode += '<div>';
							if (commentsList[i].actionType == "Task") {
								htmlCode += '<div class="row ActionReports ReviewActionIcon">'
										+ '<div class="col-xs-5 SmallBoldGreyContent">'
										+ 'Task'
										+ '</div>'
										+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
										+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
										+ commentsList[i].completionDate
										+ '</span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ commentsList[i].comment
										+ '</div>'
										+ '<div class="col-xs-12 SmallDarkGreyHeader">'
										+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
										+ commentsList[i].commentedBy
										+ '</span>'
										+ '<span>For <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].commentedFor
										+ '</span>at <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].departmentName
										+ '</span></span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
										+ commentsList[i].createdDate
										+ '</div>'
										+ '</div>' + '</div>';
							}
							if (commentsList[i].actionType == "Raise a Ticket") {
								htmlCode += '<div class="row ActionReports ReviewActionIcon">'
										+ '<div class="col-xs-5 SmallBoldGreyContent">'
										+ 'Ticket'
										+ '</div>'
										+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
										+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
										+ commentsList[i].completionDate
										+ '</span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ commentsList[i].comment
										+ '</div>'
										+ '<div class="col-xs-12 SmallDarkGreyHeader">'
										+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
										+ commentsList[i].commentedBy
										+ '</span>'
										+ '<span>For <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].commentedFor
										+ '</span>at <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].departmentName
										+ '</span>Priority <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].priority
										+ '</span></span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
										+ commentsList[i].createdDate
										+ '</div>'
										+ '</div>' + '</div>';
							}
							if (commentsList[i].actionType == "Notify") {
								htmlCode += '<div class="row ActionReports ReviewActionIcon">'
										+ '<div class="col-xs-5 SmallBoldGreyContent">'
										+ 'Notify'
										+ '</div>'
										+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
										+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
										+ commentsList[i].completionDate
										+ '</span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ commentsList[i].comment
										+ '</div>'
										+ '<div class="col-xs-12 SmallDarkGreyHeader">'
										+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
										+ commentsList[i].commentedBy
										+ '</span>'
										+ '<span>For <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].commentedFor
										+ '</span>at <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].departmentName
										+ '</span></span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
										+ commentsList[i].createdDate
										+ '</div>'
										+ '</div>' + '</div>';
							}
							if (commentsList[i].actionType == "General") {
								htmlCode += '<div class="row ActionReports ReviewActionIcon">'
										+ '<div class="col-xs-5 SmallBoldGreyContent">'
										+ 'General'
										+ '</div>'
										+ '<div class="col-xs-7 text-right SmallDarkGreyHeader">'
										+ 'Completion by <span class="SmallRedHeader"><span class="glyphicon glyphicon-bell"></span>'
										+ commentsList[i].completionDate
										+ '</span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ commentsList[i].comment
										+ '</div>'
										+ '<div class="col-xs-12 SmallDarkGreyHeader">'
										+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
										+ commentsList[i].commentedBy
										+ '</span>'
										+ '<span>For <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].commentedFor
										+ '</span>at <span class="VerySmallBoldGreyContent">'
										+ commentsList[i].departmentName
										+ '</span></span>'
										+ '</div>'
										+ '<div class="col-xs-12">'
										+ '<div class="revieweTime"><span class="glyphicon glyphicon-time">'
										+ commentsList[i].createdDate
										+ '</div>'
										+ '</div>' + '</div>';
							}
							htmlCode += '</div>';
						}
						if (actionType == "Raise a Ticket") {
							actionType = "Ticket";
						}
						$("#notesFor" + actionType + "_" + reviewSiteContentId).html('');
						$("#notesFor" + actionType + "_" + reviewSiteContentId).html(htmlCode);
						$("#notesFor" + actionType + "_" + reviewSiteContentId).show();
						$('#leftNavigation,#wrapper,#header').unmask();
					},
					error : function(response) {
					}
				});
	}
	function resetRespond(reviewId) {
		$('#validationMessageDiv_' + reviewId).hide();
		$('#respond_' + reviewId).val('');
	}
	function saveFlag(reviewId) {
		var flagChkId = 'flagChkDiv_' + reviewId;
		var anyChecked = false;
		var flagStatus = "";
		$('#' + flagChkId).find(':checkbox').each(function() {
			if ($(this).is(':checked')) {
				anyChecked = true;
				flagStatus += $(this).val() + ",";
			}
		});
		flagStatus = flagStatus.slice(0, -1);
		if (anyChecked == false) {
			$('#broadcastSuccessModalTitle').text("Alert");
			$('#broadcastSuccessModalText').text("Please Select a reason !");
			$('#broadcastSuccessModal').modal('show');
			return false;
		}
		var organizationId = $('#organizationName option:selected').val();
		var comment = $('#flagCommentTxt').val();
		var JSONObject = {
			'reviewId' : reviewId,
			'organizationId' : organizationId,
			'flagStatus' : flagStatus,
			'flagComment' : comment
		};
		$.ajax({
			type : "POST",
			url : "../reviewSitesContent/saveFlag.htm",
			contentType : "application/json",
			data : JSON.stringify(JSONObject),
			success : function(response) {
				if (response.status == "SAVE_SUCCESS") {
					$('#broadcastSuccessModalTitle').text("Success");
					$('#broadcastSuccessModalText').text("Review has been flaged !");
					$('#broadcastSuccessModal').modal('show');
					closeAction(reviewId);
					return false;
				}
			},
			error : function(response) {
			}
		});
		return false;
	}
	
	function closeAction(reviewId) {
		if(document.getElementById('Action-pills' + reviewId)!=null || document.getElementById('Action-pills' + reviewId)!=undefined){
			document.getElementById('Action-pills' + reviewId).setAttribute("class","SubHeading tab-pane fade");
		}
	}
	
	function getNotes(reviewSiteContentId, organizationId) {
		$("#" + "notesForReviewSiteContentId_" + reviewSiteContentId).hide();
		$("#notesForReviewSiteContentId_" + reviewSiteContentId).html('');
		$("#errorForReviewSiteContentId_" + reviewSiteContentId).html('');
		$.ajax({
					type : "GET",
					url : "../reviewSitesContent/getNotes.htm?organizationId="
							+ organizationId + "&reviewSiteContentId="
							+ reviewSiteContentId,
					contentType : "application/json",
					success : function(response) {
						noteList = response.successObject.listNotes;
						var htmlCode = '';
						for (var i = 0; i < noteList.length; i++) {
							if (i > 1) {
								htmlCode += '<div style="display: none" class="extraNoteDivId'
										+ reviewSiteContentId + '">';
							}
							htmlCode += '<div class="row ActionReports ReviewNoteIcon">'
									+ '<div class="col-xs-12">'
									+ ''
									+ noteList[i].note
									+ '</div>'
									+ '<div class="col-xs-12 SmallDarkGreyHeader">'
									+ 'by <span class="VerySmallBoldGreyContent marginRight20">'
									+ noteList[i].userName + '</span>';
							if (noteList[i].externalEmail != null
									&& noteList[i].externalEmail != '') {
								htmlCode += '<span>Shared with <span class="VerySmallBoldGreyContent">'
										+ noteList[i].externalEmail
										+ '</span></span>';
							}
							htmlCode += '</div>'
									+ '<div class="col-xs-12">'
									+ '<div class="revieweTime"><span class="glyphicon glyphicon-time"></span> '
									+ '' + noteList[i].createdDate + '</div>';
							if (i == noteList.length - 1 && noteList.length > 2) {
								htmlCode += '<a id="hideMoreHrefId'
										+ reviewSiteContentId
										+ '" href="javascript:void(0)" onclick="hideMore('
										+ reviewSiteContentId + ')">Hide</a>';
							}
							if (i == 1 && noteList.length > 2) {
								htmlCode += '<a id="viewMoreHrefId'
										+ reviewSiteContentId
										+ '" href="javascript:void(0)" onclick="showMore('
										+ reviewSiteContentId + ')">View More</a>';
							}
							htmlCode += '</div>' + '</div>';
							if (i > 1) {
								htmlCode += '</div>';
							}
						}
						$("#notesForReviewSiteContentId_" + reviewSiteContentId).html('');
						$("#notesForReviewSiteContentId_" + reviewSiteContentId).html(htmlCode);
						$("#" + "notesForReviewSiteContentId_" + reviewSiteContentId).show();
					},
					error : function(response) {
						$('#loadMaskDiv').mask(response.status + "*********" + response.statusText);
					}
				});
	}
	function hideMore(reviewId) {
		/*
		 * var obj=document.getElementsByClassName('extraNoteDivId');
		 * obj.style.display = 'block';
		 */
		$('#hideMoreHrefId' + reviewId).hide();
		$('#viewMoreHrefId' + reviewId).show();
		$(".extraNoteDivId" + reviewId).hide(300);
	}
	function showMore(reviewId) {
		/*
		 * var obj=document.getElementsByClassName('extraNoteDivId');
		 * obj.style.display = 'block';
		 */
		$('#viewMoreHrefId' + reviewId).hide();
		$('#hideMoreHrefId' + reviewId).show();
		$(".extraNoteDivId" + reviewId).show(300);
	}