var comparitiveAnalysisUrl = "../comparativeAnalysis/";
var requestDataForComparativeResults;
var competitorsListForResult = [];
var overAllData= "";
var selectedOrganizationForResult = "";
var selectedOrganizationsArrayForComparision = [];
var comparativeAnalysisSelectedOrganizationNames = [];
var comparativeAnalysisSelectedDepartmentArray = [];
var comparativeAnalysisSelectedKpiArray = [];
var comparativeAnalysisSelectedLanguageArray = [];
var comparativeAnalysisSelectedSourceArray = [];
var departmentComparisionStartPage= 0;
var departmentComparisionEndPage = 10;
var reviewsListForSearch = "";
var sentimentPolarityListForSearch  = "";
var responseForSearch = "";
var chartDataForComparision = "";
var kpiChartData = "";
var sourceChartData = "";
var languageChartData = "";
var JSONObjectForInnerPageFilter = "";
	$("#fromDateForFilter").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDateComparativeAnalysis",
		altFormat: "yy-mm-dd",
		maxDate: new Date,
		onClose : function(selectedDate) {
			$("#toDateForFilter").datepicker("option", "minDate", selectedDate);
			dateValidation("fromDateForFilter","toDateForFilter","filterComparativeAnalysisButton");
		}
	});

	$("#toDateForFilter").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altToDateComparativeAnalysis",
		altFormat: "yy-mm-dd",
		maxDate: new Date,
		onClose : function(selectedDate) {
		$("#fromDateForFilter").datepicker("option", "maxDate", selectedDate);
		dateValidation("fromDateForFilter","toDateForFilter","filterComparativeAnalysisButton");
		}
});
$(document).ready(function() {
	loadingForDashBoard();
	$.ajaxSetup({ cache: false });
	filterDataForComparativeAnalysis();
	
});

function filterDataForComparativeAnalysis(){
	loadingForDashBoard();
	var organizationId = $('#selectedOrganizationIdForComparativeAnalysis option:selected').val();
	var organizationName = $('#selectedOrganizationIdForComparativeAnalysis option:selected').text();
	var fromDate = $('#altFromDateComparativeAnalysis').val();
	var toDate = $('#altToDateComparativeAnalysis').val();
	var JSONObject = {'organizationId':organizationId,'organizationName':organizationName,'fromDate':fromDate,'toDate':toDate};
	$.ajax({
		type:"POST",
		url:comparitiveAnalysisUrl+"comparision.htm",
		contentType:"application/json",
		data:JSON.stringify(JSONObject),
		success:function(response){
			var html = "";
			$('#comparitiveAnalysisFirstPageDiv').html('');
			$('#comparitiveAnalysisFirstPageDiv').append(comparativeAnalysisTable(response));
			unloadingForDashBoard();
		},error:function(response){
			jqueryPostError(response);
		}
	});
	return false;
}

function saveSessionData(){
	 var f = $('#altFromDateComparativeAnalysis').val().split(/[.,\/ -]/);
	 var fromDate=f[2]+"-"+f[0]+"-"+f[1];
	 var t = $('#altToDateComparativeAnalysis').val().split(/[.,\/ -]/);
	 var toDate=t[2]+"-"+t[0]+"-"+t[1];
	var orgId = $('#selectedOrganizationIdForComparativeAnalysis option:selected').val();
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


function comparativeAnalysisTable(response){
	var html = "";
	/***********************Select Organization***************************************/
	html+= appendCompetitorAndClientTable(response);
	
	html+=	 '<div class="panel-group manageMilestone" id="accordion">';//Main Div
	
	/**********************Appending Department Table**********************************/
	html+=	appendDepartmentTable(response);
	
	/**********************Appending Kpi Table**********************************/
	html+=	appendKpiTable(response);
	
	/**********************Appending Source Table**********************************/
	html+=	appendSourceTable(response);
	
	/**********************Appending Language Table**********************************/
	html+=	appendLanguageTable(response);
	
	/**********************Compare Button*********************************************/
	html+=	'<br>';
	html+=	'<input type="button" class="btn btn-primary" id="ComparitiveAnalysisCompare" value="Compare" onclick="compare(departmentComparativeAnalysisForm,kpiComparativeAnalysisForm,sourceComparativeAnalysisForm,languageComparativeAnalysisForm,selectOrganizationsForm)" style="float: right;">';
	html+=	 '</div>';//End Of accordion
	return html;
}

function appendDepartmentTable(response){
	var html = "";
	html+=	appendCollpasableHeaderDiv("department","YES");//Header For Department
	html+=	appendTableData(response,"department");
	return html;
}

function appendKpiTable(response){
	var html = "";
	html+=	appendCollpasableHeaderDiv("kpi","YES");//Header For Kpi
	html+=	appendTableData(response,"kpi");
	return html;
}

function appendSourceTable(response){
	var html = "";
	html+=	appendCollpasableHeaderDiv("source","YES");//Header For Source
	html+=	appendTableData(response,"source");
	return html;
}

function appendLanguageTable(response){
	var html = "";
	html+=	appendCollpasableHeaderDiv("language","YES");//Header For Language
	html+=	appendTableData(response,"language");
	return html;
}


function appendTableData(response,moduleId){
	var html = "";
	var kpiList = "";
	var departmentComparativeAnalysisList = "";
	var kpiComparativeAnalysisList = "";
	var sourceComparativeAnalysisList = "";
	var languageComparativeAnalysisList = "";
	var kpiList = "";
	var sourceList = "";
	var languageList = "";
	var competitors = response.successObject.competitorsList;
	var organizationName = response.successObject.organizationName;
	
	html+=	 '<div id="'+moduleId+'ComparativeAnalysis" class="panel-collapse collapse">';
	html+=	 '<div class="panel-body">';
	html+=	 '<div class="panel-heading">';
	
	html+=		'<form id="'+moduleId+'ComparativeAnalysisForm">';
	html+=		'<table class="table table-bordered dataTable no-footer">';
	html+=			'<thead>';
	html+=				'<tr>';
	html+=					'<th>'+convertFirstLetterToUpperCase(moduleId)+'</th>';
	html+=	getCompetitorsAndClient(competitors,organizationName);
	html+=				'</tr>';
	html+=			'</thead>';
	html+=			'<tbody>';
	/*************************************Department Comparision For Competitors And Client**************************************/
	if(moduleId=="department"){
		kpiList = response.successObject.departmentList;
		departmentComparativeAnalysisList = response.successObject.departmentComparativeAnalysisList;
		html+=	departmentComparisionList(kpiList,departmentComparativeAnalysisList,"department");
	}
	
	/*************************************Kpi Comparision For Competitors And Client**************************************/
	if(moduleId=="kpi"){
		kpiList = response.successObject.kpiList;
		kpiComparativeAnalysisList = response.successObject.kpiComparativeAnalysisList;
		html+=	kpiComparisionList(kpiList,kpiComparativeAnalysisList,"kpi");
	}
	
	/*************************************Source Comparision For Competitors And Client**************************************/
	if(moduleId=="source"){
		sourceList = response.successObject.sourceList;
		sourceComparativeAnalysisList = response.successObject.sourceComparativeAnalysisList;
		html+=	sourceComparisionList(sourceList,sourceComparativeAnalysisList,"source");
	}
	
	
	/*************************************Language Comparision For Competitors And Client**************************************/
	if(moduleId=="language"){
		languageList = response.successObject.languageList;
		languageComparativeAnalysisList = response.successObject.languageComparativeAnalysisList;
		html+=	languageComparisionList(languageList,languageComparativeAnalysisList,"language");
	}
	
	html+=			'</tbody>';
	html+=		'</table>';
	html+=		'</form>';
	html+=		'</div>';//End Of panel panel-default
	html+=	 '</div>';//End Of panel-heading
	html+=	 '</div>';//End Of panel-body
	html+=	 '</div>';//End Of panel-collapse collapse
	return html;
}

function departmentComparisionList(departmentList,departmentComparativeAnalysisList,moduleId) {
	var html = "";
	$.each(departmentList, function(departmentIndex, value) {
		var departmentName = value.departmentName;
		var departmentId = value.id;
		var departmentTypeId = value.departmentTypeId;
		var checkBoxClass = moduleId + "ComparativeCheckBox";
		var parameter = "'" + checkBoxClass + "'";
		html += '<tr>';

		html += '<td class="SmallBoldGreyContent" id="' + moduleId + 'Name_'+ departmentTypeId + '">';
		html += '<input type="checkbox" value="' + departmentTypeId + '" class='
				+ checkBoxClass + ' onclick="individualCheckOrUncheck('+ parameter + ')" style="margin: 2px 0 0;"> ' + departmentName;
		html += '</td>';
		$.each(departmentComparativeAnalysisList, function(index, value) {
			var imagePath = value.imagePath;
			var departmentIdForComparision = value.departmentId;
			if (departmentId == departmentIdForComparision) {
				html += '<td align="center">';
				html += '<img src="' + imagePath + '"></img>';
				html += '</td>';
			}
		});
		html += '</tr>';

	});
	return html;
}

function kpiComparisionList(kpiList,kpiComparativeAnalysisList,moduleId) {
	var html = "";
	$.each(kpiList, function(departmentIndex, value) {
		var kpiName = value.kpiName;
		var kpiId = value.id;
		var checkBoxClass = moduleId + "ComparativeCheckBox";
		var parameter = "'" + checkBoxClass + "'";
		html += '<tr>';

		html += '<td class="SmallBoldGreyContent" id="' + moduleId + 'Name_'
				+ kpiId + '">';
		html += '<input type="checkbox" value="' + kpiId + '" class='
				+ checkBoxClass + ' onclick="individualCheckOrUncheck('
				+ parameter + ')" style="margin: 2px 0 0;"> ' + kpiName;
		html += '</td>';
		$.each(kpiComparativeAnalysisList, function(index, value) {
			var imagePath = value.imagePath;
			var kpiIdForComparision = value.kpiId;
			if (kpiId == kpiIdForComparision) {
				html += '<td align="center">';
				html += '<img src="' + imagePath + '"></img>';
				html += '</td>';
			}
		});
		html += '</tr>';
	});
	return html;
}

function sourceComparisionList(sourceList,sourceComparativeAnalysisList,moduleId) {
	var html = "";
	$.each(sourceList, function(sourceIndex, value) {
		var sourceName = value.sourceName;
		var sourceId = value.id;
		var checkBoxClass = moduleId + "ComparativeCheckBox";
		var parameter = "'" + checkBoxClass + "'";
		html += '<tr>';

		html += '<td class="SmallBoldGreyContent" id="' + moduleId + 'Name_'
				+ sourceId + '">';
		html += '<input type="checkbox" value="' + sourceId + '" class='
				+ checkBoxClass + ' onclick="individualCheckOrUncheck('
				+ parameter + ')" style="margin: 2px 0 0;"> ' + sourceName;
		html += '</td>';
		$.each(sourceComparativeAnalysisList, function(index, value) {
			var imagePath = value.imagePath;
			var sourceIdForComparision = value.sourceId;
			if (sourceId == sourceIdForComparision) {
				html += '<td align="center">';
				html += '<img src="' + imagePath + '"></img>';
				html += '</td>';
			}
		});
		html += '</tr>';
	});
	return html;
}

function languageComparisionList(languageList,languageComparativeAnalysisList,moduleId) {
	var html = "";
	$.each(languageList, function(languageIndex, value) {
		var languageName = value.languageName;
		var languageCode = value.language;
		var languageId = value.id;
		var checkBoxClass = moduleId + "ComparativeCheckBox";
		var parameter = "'" + checkBoxClass + "'";
		html += '<tr>';

		html += '<td class="SmallBoldGreyContent" id="' + moduleId + '_'+ languageId + '">';
		html += '<input type="checkbox" placeholder="' + languageCode + '" value="' + languageId + '" class='
				+ checkBoxClass + ' onclick="individualCheckOrUncheck('
				+ parameter + ')" style="margin: 2px 0 0;"> ' + languageName;
		html += '</td>';
		$.each(languageComparativeAnalysisList, function(index, value) {
			var imagePath = value.imagePath;
			var languageIdForComparision = value.languageId;
			if (languageId == languageIdForComparision) {
				html += '<td align="center">';
				html += '<img src="' + imagePath + '"></img>';
				html += '</td>';
			}
		});
		html += '</tr>';
	});
	return html;
}

function appendCompetitorAndClientTable(response){
	var competitorList = response.successObject.competitorsList;
	var organizationName = response.successObject.organizationName;
	var organizationId = response.successObject.organizationId;
	var html = "";
	html+= '<div class="row">';
	html+=	'<div class="col-lg-12 SubHeading">';
	html+=		'<form id="selectOrganizationsForm">';
	html+=			'<table id="competitorsAndClientTable">';
	html+=				'<thead>';
	html+=					'<tr>';
	html+=						'<th>Select Organization</th>';
	html+=					'</tr>';
	html+=				'</thead>';
	html+=	'<tbody>';
	if(competitorList.length>0){
		$.each(competitorList,function(index,value){
			var competitorName = value.competitorName;
			var competitorId = value.competitor;
			html+=	'<tr>';
			html+=		'<th style="color:red" id="comparision_'+competitorId+'">';
			html+=			'<input type="checkbox" value="'+competitorId+'"  onclick="selectedCheckBoxesArray(selectOrganizationsForm)"> '+competitorName;
			html+=		'</th>';
			html+=	'</tr>';
		});
	}
	html+= '<tr><th style="color:green" id="comparision_'+organizationId+'"><input type="checkbox" value="'+organizationId+'"  onclick="selectedCheckBoxesArray(selectOrganizationsForm)"> '+organizationName+'</th></tr>';
	html+=	'</tbody>';
	html+=	'</table>';
	html+=	'</form>';
	html+=	'</div>';
	html+=	'</div>';
	
	return html;
}

/****************************************************************************************************************************************************
 * **********************************************************Second Page (RESULT)*******************************************************************
 * **************************************************************************************************************************************************/

function compare(departmentComparativeAnalysisForm,kpiComparativeAnalysisForm,sourceComparativeAnalysisForm,languageComparativeAnalysisForm,selectedOrganizationsForm){
	
	selectedOrganizationsArrayForComparision = [];
	comparativeAnalysisSelectedOrganizationNames = [];
	comparativeAnalysisSelectedOrganizationNames = selectedCheckBoxesArray(selectedOrganizationsForm, "comparision");
	if(comparativeAnalysisSelectedOrganizationNames.length==0){
		comparativeAnalysisSelectedOrganizationNames = unselectedCheckBoxesArray(selectedOrganizationsForm, "comparision");
		$.each(comparativeAnalysisSelectedOrganizationNames,function(index,value){
			var id = value.id;
			selectedOrganizationsArrayForComparision.push(id);
		});
	}else{
		$.each(comparativeAnalysisSelectedOrganizationNames,function(index,value){
			var id = value.id;
			selectedOrganizationsArrayForComparision.push(id);
		});
	}
	
	
	comparativeAnalysisSelectedDepartmentArray = [];
	comparativeAnalysisSelectedKpiArray = [];
	comparativeAnalysisSelectedSourceArray = [];
	comparativeAnalysisSelectedLanguageArray = [];


	comparativeAnalysisSelectedDepartmentArray = selectedCheckBoxesArray(departmentComparativeAnalysisForm,"departmentName");//Pass Form Id,factor Name Returns DepartmentId,DepartmentName
	comparativeAnalysisSelectedKpiArray = selectedCheckBoxesArray(kpiComparativeAnalysisForm,"kpiName");
	comparativeAnalysisSelectedSourceArray = selectedCheckBoxesArray(sourceComparativeAnalysisForm,"sourceName");
	comparativeAnalysisSelectedLanguageArray = selectedCheckBoxesArray(languageComparativeAnalysisForm,"language");

	
	var selectedCheckboxesLength = comparativeAnalysisSelectedDepartmentArray.length+comparativeAnalysisSelectedKpiArray.length+
									comparativeAnalysisSelectedSourceArray.length+comparativeAnalysisSelectedLanguageArray.length;
	
	if(selectedCheckboxesLength==0){
		comparativeAnalysisSelectedDepartmentArray = unselectedCheckBoxesArray(departmentComparativeAnalysisForm,"departmentName");
		comparativeAnalysisSelectedKpiArray = unselectedCheckBoxesArray(kpiComparativeAnalysisForm,"kpiName");
		comparativeAnalysisSelectedSourceArray = unselectedCheckBoxesArray(sourceComparativeAnalysisForm,"sourceName");
		comparativeAnalysisSelectedLanguageArray = unselectedCheckBoxesArray(languageComparativeAnalysisForm,"language");
	}
	
	getComparativeAnalysisResultData(comparativeAnalysisSelectedDepartmentArray,comparativeAnalysisSelectedKpiArray,comparativeAnalysisSelectedSourceArray,comparativeAnalysisSelectedLanguageArray,selectedOrganizationsArrayForComparision);
	
}

function getComparativeAnalysisResultData(departmentArray,kpiArray,sourceArray,languageArray,selectedOrganizationsArray){
	requestDataForComparativeResults = {};
	var selectedOrganizationId = $('#selectedOrganizationIdForComparativeAnalysis option:selected').val();
	var fromDate = $('#altFromDateComparativeAnalysis').val();
	var toDate = $('#altToDateComparativeAnalysis').val();
	var url = comparitiveAnalysisUrl+"result.htm";
	var JSONObject = {'departments':departmentArray,'kpis':kpiArray,'sources':sourceArray,'languages':languageArray,'organizationId':selectedOrganizationId,'organizationIds':selectedOrganizationsArray,'fromDate':fromDate,'toDate':toDate};
	requestDataForComparativeResults = JSONObject;
	loadingForDashBoard();
		$.ajax({
			type:"POST",
			url:url,
			contentType:"application/json",
			data:JSON.stringify(JSONObject),
			success:function(response){
				$('#comparativeAnalysisSecondPageDiv').html('');
				var html = comparativeAnalysisOverAllPage(response);
				$('#comparativeAnalysisSecondPageDiv').append(html);
				$('#comparitiveAnalysisFirstPageDiv').hide(600);
				$('#comparativeAnalysisSecondPageDiv').show(600);
				$('#filterComparativeAnalysisButton,#comparativeAnalysisInnerPageButton').hide();
				$('#filterResultButton').show();//Showing Result Page Apply Button
				unloadingForDashBoard();
			},error:function(response){
				jqueryPostError(response);
			}
		});
	
	
}

/***********************Overall Div*******************************************/
function comparativeAnalysisOverAllPage(response){
	
	$('.navbar-top-links').hide();
	
	var repufactScores = response.successObject.repufactScores; 
	var repufactRankings = response.successObject.repufactRankings;
	var organizationReviews = response.successObject.organizationReviews;
	var overAllReviews = response.successObject.overallReviews;
	var organizationName = response.successObject.organizationName;
	var competitors = response.successObject.competitors;
	var competitorsLength = competitors.length;
	var tableName = "overAllTable";
	tableName = "'"+tableName+"'";
	var excelName = "ece";
	excelName = "'"+excelName+"'";
	var html = "";
	
	html+=	'<div class="row">';
	html+=	' <div class="col-lg-12 SubHeading SmallDarkGreyHeader">';
	html+=		'<span><a onclick="goToComparativeAnalysisPage()">Comparative Analysis</a></span>' ;
	html+=		' <span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>';
	html+=		'<span> Result </span>';
	/*html+=		'<span style="float:right" onclick="tableToExcel('+tableName+','+excelName+')"> Export To Excel</span>';
	html+=		'<span style="float:right" onclick="exportEs()"> Export To Excel</span>';*/
	html += '<a data-target=".FilterLightBox" data-togg	le="modal" class="filterButton" type="button" onclick="exportComparativeAnalysisData()"><span class="glyphicon glyphicon-download-alt"></span> Export to excel</a>';
	html+=	'</div>';//End Of 58th Line Div
	html+=	'</div>';//End Of 57th Line Div
	/*********************Collpasable OverAll Div**********************************************************/
	html+=	'<div class="panel-group manageMilestone" id="accordion">';
	/***************************OverAll********************************************************************/
	html+=	appendCollpasableHeaderDiv("overall");
	
	html+=	'<div id="overall" class="panel-collapse collapse">';
	html+=	'<div class="panel-body">';
	html+=	'<div class="page-heading">';
	html+=		'<form>';
	html+=			'<table class="table table-bordered dataTable no-footer" id="overallTable">';
	html+=				'<thead>';
	html+=					'<tr>';
	html+=						'<th></th>';
	html+=	getCompetitorsAndClientForInnerPage(0,"overall","");
	html+=					'</tr>';
	html+=				'</thead>';
	html+=				'<tbody>';
	/***********************Repufact Score**********************************/
	html+=					'<tr><th>Rating Score Index</th>';
	var repufactScoresArray = [];
	var organizationRankingMap = [];
	if(repufactScores.length>0){
		$.each(repufactScores,function(index,value){
			repufactScoresArray.push(value);
			if(value=="-1"){
				html+=	showWrongImage();
			}else{
				html+=		'<th>'+value+'</th>';
			}
				
		});
		organizationRankingMap = rankingsMap(repufactScoresArray);
	}else{
		html+=			'<td>-<td>';
	}
	html+=					'</tr>';
	/*********************Ranking****************************************/
	html+=					'<tr><th>Ranking</th>';
	html+= getRanking(repufactRankings);
	html+=					'</tr>';
	/*******************Reviews******************************/
	html+=					'<tr><th>Reviews</th>';
	if(overAllReviews.length>0){
		html+= getPolarityData(overAllReviews);
	}else{
		html+=				'<th>-</th>';
	}
	html+=					'</tr>';
	/*******************Mentions******************************/
	html+=					'<tr><th>Mentions</th>';
	if(organizationReviews.length>0){
		html+= getPolarityData(organizationReviews);
	}else{
		html+=			'<td>-</td>';
	}
	html+=					'</tr>';
	
	
	html+=				'</tbody>';
	html+=			'</table>';
	html+=		'</form>';
	html+=	'</div>';//End Of 75th Line Div
	html+=	'</div>';//End Of 73rd Line Div
	html+=	'</div>';//End Of 67th Line Div
	html+=	'</div>';//End Of OverAll Div
	
	
	
	/************************************Department****************************************************/
	html+=	getDepartmentComparativeAnalysisDetails(response, competitorsLength,organizationName);
	
	/************************************Kpi****************************************************/
	html+=	getKpiComparativeAnalysisDetails(response, competitorsLength,organizationName);
	
	/************************************Source****************************************************/
	html+=	getSourceComparativeAnalysisDetails(response, competitorsLength,organizationName);
	
	/************************************Language****************************************************/
	html+=	getLanguageComparativeAnalysisDetails(response, competitorsLength,organizationName);
	
	/************************End Of collpasble div*********************************************************/
	html+=	'</div>';
	return html;
}


function getDepartmentComparativeAnalysisDetails(response,competitorsLength,organizationName){
	var departmentsSize = response.successObject.departmentsSize;
	var html = "";
	html+=	appendCollpasableHeaderDiv("department");
	html+=	'<div id="department" class="panel-collapse collapse">';
	html+=	'<div class="panel-body">';
	html+=	'<div class="page-heading">';
	/**********************This Should Be Dynamic Based On Department Id***************************************/
	if(departmentsSize==0){
		html+=	emptyResultTable();
	}else{
		var departmentRepufactorsAndRankingList = response.successObject.departmentRepufactorsAndRankingList;
		var competitors = response.successObject.competitors;
		if(departmentRepufactorsAndRankingList.length==0){
			html+=	emptyResultTable();
		}else{
		$.each(departmentRepufactorsAndRankingList,function(departmentIndex,value){
			var departmentFactors = departmentRepufactorsAndRankingList[departmentIndex].departmentFactors;
			var departmentRankings = departmentRepufactorsAndRankingList[departmentIndex].departmentRankings;
			var departmentName = departmentRepufactorsAndRankingList[departmentIndex].departmentName;
			var departmentIds = departmentRepufactorsAndRankingList[departmentIndex].departmentIds;
			var departmentReviewsPolarityList = response.successObject.departmentReviews[departmentIndex].polarityList;
			var departmentMentionsList = response.successObject.departmentMentions[departmentIndex].polarityList;
		html+=		'<form id="departmentComaprativeAnalysisForm_'+departmentIndex+'">';
		html+=			'<table class="table table-bordered dataTable no-footer" id="departmentTable_'+departmentIndex+'">';
		html+=				'<thead>';
		html+=					'<tr>';
		html+=						'<th style="color:blue;">'+departmentName+'</th>';
		html+=  getCompetitorsAndClientForInnerPageForDepartment(departmentIds,"department",departmentName);
		html+=					'</tr>';
		html+=				'</thead>';
		html+=				'<tbody>';
		/***********************Repufact Score**********************************/
		html+=					'<tr><th>Department Score</th>';
		var departmentfactScoresArray = [];
		var departmentRankingMap = [];
		if(departmentFactors.length>0){
			$.each(departmentFactors,function(index,value){
				departmentfactScoresArray.push(value);
				if(value=="-1"){
					html+=		showWrongImage();
				}else{
					html+=		'<th>'+value+'</th>';
				}
			});
			departmentRankingMap = rankingsMap(departmentfactScoresArray);
		}else{
			html+=			'<td>-<td>';
		}
		html+=					'</tr>';
		/*********************Ranking****************************************/
		html+=					'<tr><th>Ranking</th>';
		html+= getRanking(departmentRankings);
		html+=					'</tr>';
		/*******************Reviews******************************/
		html+=					'<tr><th>Reviews</th>';
		if(departmentReviewsPolarityList.length>0){
			html+=	getPolarityData(departmentReviewsPolarityList);
		}else{
			html+= '<th>-</th>';
		}
		
		html+=					'</tr>';
		
		/*******************Mentions******************************/
		html+=					'<tr><th>Mentions</th>';
		if(departmentMentionsList.length>0){
			html+= getPolarityData(departmentMentionsList);
		}else{
			html+=			'<th>-</th>';
		}
		html+=					'</tr>';
		html+=				'</tbody>';
		html+=			'</table>';
		html+=		'</form>';
	});
	}
	}

	
	html+=	'</div>';//End Of Page-heading
	html+=	'</div>';//End Of Panel-body
	html+=	'</div>';//End Of panel-collapse collapse
	html+=	'</div>';//panel-collapse collapse
	
	return html;
	
}


function getKpiComparativeAnalysisDetails(response,competitorsLength,organizationName){
	var kpisSize = response.successObject.kpisSize;
	var html = "";
	html+=	appendCollpasableHeaderDiv("kpi");
	html+=	'<div id="kpi" class="panel-collapse collapse">';
	html+=	'<div class="panel-body">';
	html+=	'<div class="page-heading">';
	/**********************This Should Be Dynamic Based On Kpi Id***************************************/
	if(kpisSize==0){
		html+=	emptyResultTable();
	}else{
		var kpiFactorsAndRankingList = response.successObject.kpiFactorsAndRankingList;
		var competitors = response.successObject.competitors;
		if(kpiFactorsAndRankingList.length==0){
			html+=	emptyResultTable();
		}else{
		$.each(kpiFactorsAndRankingList,function(kpiIndex,value){
			var kpiFactors = kpiFactorsAndRankingList[kpiIndex].kpiFactors;
			var kpiRankings = kpiFactorsAndRankingList[kpiIndex].kpiRankings;
			var kpiName = kpiFactorsAndRankingList[kpiIndex].kpiName;
			var kpiId = kpiFactorsAndRankingList[kpiIndex].kpiId;
			var kpiReviews = response.successObject.kpiReviews[kpiIndex].polarityList;
			var kpiMentionsList = response.successObject.kpiMentions[kpiIndex].polarityList;
		html+=		'<form id="kpiComaprativeAnalysisForm_'+kpiIndex+'">';
		html+=			'<table class="table table-bordered dataTable no-footer" id="kpiTable_'+kpiIndex+'">';
		html+=				'<thead>';
		html+=					'<tr>';
		html+=						'<th style="color:blue;">'+kpiName+'</th>';
		html+= getCompetitorsAndClientForInnerPage(kpiId,"kpi",kpiName);
		html+=					'</tr>';
		html+=				'</thead>';
		html+=				'<tbody>';
		/***********************Repufact Score**********************************/
		html+=					'<tr><th>KPI Score</th>';
		var kpifactScoresArray = [];
		var kpiRankingMap = [];
		if(kpiFactors.length>0){
			$.each(kpiFactors,function(index,value){
				kpifactScoresArray.push(value);
				if(value=="-1"){
					html+=		showWrongImage();
				}else{
					html+=		'<th>'+value+'</th>';
				}
			});
			kpiRankingMap = rankingsMap(kpifactScoresArray);
			
		}else{
			html+=			'<td>-<td>';
		}
		html+=					'</tr>';
		/*********************Ranking****************************************/
		html+=					'<tr><th>Ranking</th>';
		html+= getRanking(kpiRankings);
		html+=					'</tr>';
		/*******************Reviews******************************/
		html+=					'<tr><th>Reviews</th>';
		if(kpiReviews.length>0){
			html+=	getPolarityData(kpiReviews);
		}else{
			html+= '<th>-</th>';
		}
		
		html+=					'</tr>';
		
		/*******************Mentions******************************/
		html+=					'<tr><th>Mentions</th>';
		if(kpiMentionsList.length>0){
			html+= getPolarityData(kpiMentionsList);
		}else{
			html+=			'<th>-</th>';
		}
		html+=					'</tr>';
		html+=				'</tbody>';
		html+=			'</table>';
		html+=		'</form>';
	});
		}
		
	}

	html+=	'</div>';//End Of Page-heading
	html+=	'</div>';//End Of Panel-body
	html+=	'</div>';//End Of panel-collapse collapse
	html+=	'</div>';//panel-collapse collapse
	
	return html;
	
}

function getSourceComparativeAnalysisDetails(response,competitorsLength,organizationName){
	var sourcesSize = response.successObject.sourcesSize;
	var html = "";
	html+=	appendCollpasableHeaderDiv("source");
	html+=	'<div id="source" class="panel-collapse collapse">';
	html+=	'<div class="panel-body">';
	html+=	'<div class="page-heading">';
	/**********************This Should Be Dynamic Based On Source Id***************************************/
	if(sourcesSize==0){
		html+=	emptyResultTable();
	}else{
		var sourceFactorsAndRankingList = response.successObject.sourceFactorsAndRankingList;
		var competitors = response.successObject.competitors;
		if(sourceFactorsAndRankingList.length==0){
			html+=	emptyResultTable();
		}else{
		$.each(sourceFactorsAndRankingList,function(sourceIndex,value){
			var sourceFactors = sourceFactorsAndRankingList[sourceIndex].sourceFactors;
			var sourceRankings = sourceFactorsAndRankingList[sourceIndex].sourceRankings;
			var sourceName = sourceFactorsAndRankingList[sourceIndex].sourceName;
			var sourceId = sourceFactorsAndRankingList[sourceIndex].sourceId;
			var sourceReviews = response.successObject.sourceReviews[sourceIndex].polarityList;
			var sourceMentionsList = response.successObject.sourceMentions[sourceIndex].polarityList;
		html+=		'<form id="sourceComaprativeAnalysisForm_'+sourceIndex+'">';
		html+=			'<table class="table table-bordered dataTable no-footer" id="sourceTable_'+sourceIndex+'">';
		html+=				'<thead>';
		html+=					'<tr>';
		html+=						'<th style="color:blue;">'+sourceName+'</th>';
		html+= getCompetitorsAndClientForInnerPage(sourceId,"source",sourceName);
		html+=					'</tr>';
		html+=				'</thead>';
		html+=				'<tbody>';
		/***********************Repufact Score**********************************/
		html+=					'<tr><th>Source Score</th>';
		var sourcefactScoresArray = [];
		var sourceRankingMap = [];
		if(sourceFactors.length>0){
			$.each(sourceFactors,function(index,value){
				sourcefactScoresArray.push(value);
				if(value=="-1"){
					html+=		showWrongImage();
				}else{
					html+=		'<th>'+value+'</th>';
				}
			});
			sourceRankingMap = rankingsMap(sourcefactScoresArray);
		}else{
			html+=			'<td>-<td>';
		}
		html+=					'</tr>';
		/*********************Ranking****************************************/
		html+=					'<tr><th>Ranking</th>';
		html+= getRanking(sourceRankings);
		html+=					'</tr>';
		/*******************Reviews******************************/
		html+=					'<tr><th>Reviews</th>';
		if(sourceReviews.length>0){
			html+=	getPolarityData(sourceReviews);
		}else{
			html+= '<th>-</th>';
		}
		
		html+=					'</tr>';
		
		/*******************Mentions******************************/
		html+=					'<tr><th>Mentions</th>';
		if(sourceMentionsList.length>0){
			html+= getPolarityData(sourceMentionsList);
		}else{
			html+=			'<th>-</th>';
		}
		html+=					'</tr>';
		html+=				'</tbody>';
		html+=			'</table>';
		html+=		'</form>';
	});
		}
	}
	html+=	'</div>';//End Of Page-heading
	html+=	'</div>';//End Of Panel-body
	html+=	'</div>';//End Of panel-collapse collapse
	html+=	'</div>';//panel-collapse collapse
	
	return html;
	
}

function getLanguageComparativeAnalysisDetails(response,competitorsLength,organizationName){
	var languagesSize = response.successObject.languagesSize;
	var html = "";
	/***************Appending Header*************************************/
	
	html+=	appendCollpasableHeaderDiv("language");
	
	html+=	'<div id="language" class="panel-collapse collapse">';
	html+=	'<div class="panel-body">';
	html+=	'<div class="page-heading">';
	var languageFactorsAndRankingList = response.successObject.languageFactorsAndRankingList;
	var competitors = response.successObject.competitors;
	if(languagesSize==0){
		html+=	emptyResultTable();
	}else{
		var languageFactorsAndRankingList = response.successObject.languageFactorsAndRankingList;
		var competitors = response.successObject.competitors;
		if(languageFactorsAndRankingList.length==0){
			html+=	emptyResultTable();
		}else{
			$.each(languageFactorsAndRankingList,function(languageIndex,value){
				var languageFactors = languageFactorsAndRankingList[languageIndex].languageFactors;
				var languageRankings = languageFactorsAndRankingList[languageIndex].languageRankings;
				var languageName = languageFactorsAndRankingList[languageIndex].languageName;
				var languageId = languageFactorsAndRankingList[languageIndex].languageId;
				var languageReviews = response.successObject.languageReviews[languageIndex].polarityList;
				var languageMentionsList = response.successObject.languageMentions[languageIndex].polarityList;
			html+=		'<form id="languageComaprativeAnalysisForm_'+languageIndex+'">';
			html+=			'<table class="table table-bordered dataTable no-footer" id="languageTable_'+languageIndex+'">';
			html+=				'<thead>';
			html+=					'<tr>';
			html+=						'<th style="color:blue;">'+languageName+'</th>';
			html+= getCompetitorsAndClientForInnerPage(languageId,"language",languageName);
			html+=					'</tr>';
			html+=				'</thead>';
			html+=				'<tbody>';
			/***********************Repufact Score**********************************/
			html+=					'<tr><th>Language Source</th>';
			var languagefactScoresArray = [];
			var languageRankingMap = [];
			if(languageFactors.length>0){
				$.each(languageFactors,function(index,value){
					languagefactScoresArray.push(value);
					if(value=="-1"){
						html+=		showWrongImage();
					}else{
						html+=		'<th>'+value+'</th>';
					}
				});
				languageRankingMap = rankingsMap(languagefactScoresArray);
			}else{
				html+=			'<td>-<td>';
			}
			html+=					'</tr>';
			/*********************Ranking****************************************/
			html+=					'<tr><th>Ranking</th>';
			html+= getRanking(languageRankings);
			html+=					'</tr>';
			/*******************Reviews******************************/
			html+=					'<tr><th>Reviews</th>';
			if(languageReviews.length>0){
				html+=	getPolarityData(languageReviews);
			}else{
				html+= '<th>-</th>';
			}
			
			html+=					'</tr>';
			
			/*******************Mentions******************************/
			html+=					'<tr><th>Mentions</th>';
			if(languageMentionsList.length>0){
				html+= getPolarityData(languageMentionsList);
			}else{
				html+=			'<th>-</th>';
			}
			html+=					'</tr>';
			html+=				'</tbody>';
			html+=			'</table>';
			html+=		'</form>';
		});
		}
	}
	html+=	'</div>';//End Of Page-heading
	html+=	'</div>';//End Of Panel-body
	html+=	'</div>';//End Of panel-collapse collapse
	html+=	'</div>';//panel-collapse collapse
	
	return html;
	
}

function getPolarityData(list){
	var html= "";
	$.each(list,function(index,value){
		var positive = value.positive;
		var negative = value.negative;
		var neutral = value.neutral;
		var totalReferences =value.totalReferences;
		html+=		'<th align="center">';
		html+=		'<div>'+totalReferences+'</div><br>';
		html+=		'<div><img alt="" src="../resources/css/HappyIcon.png"><font style="color:green"> '+positive+'</font></div><br>';
		html+=		'<div><img alt="" src="../resources/css/NormalIcon.png"><font style="color:orange"> '+neutral+'</div><br>';
		html+=		'<div><img alt="" src="../resources/css/SadIcon.png"><font style="color:red"> '+negative+'</div><br>';
		html+=		'</th>';
	});
	return html;
}
function getCompetitorsAndClient(competitors,organizationName){
	var html = "";
	if(comparativeAnalysisSelectedOrganizationNames.length==0){
		for(var i=0;i<competitors.length;i++){
			var competitorName = competitors[i].competitorName;
			var competitorId = competitors[i].competitor;
			html+=					'<th style="color:red">'+competitorName+'</th>';
		}
		html+=						'<th style="color:green">'+organizationName+'</th>';
	}else{
		$.each(comparativeAnalysisSelectedOrganizationNames,function(index,value){
			var organizationName = value.organizationName;
			var selectedOrganizationNameFromDropDown = $('#selectedOrganizationIdForComparativeAnalysis option:selected').text();
			if(organizationName==selectedOrganizationNameFromDropDown){
				html+=			'<th style="color:green">'+organizationName+'</th>';
			}else{
				html+=			'<th style="color:red">'+organizationName+'</th>';
			}
		});
	}
	
	return html;
}

function getCompetitorsAndClientForInnerPage(id,moduleName,name){
	var convertedmoduleName = "'"+moduleName+"'";
	if(name!=""){
		name = "'"+name+"'";
	}
	
	var html = "";
		$.each(comparativeAnalysisSelectedOrganizationNames,function(index,value){
			var organizationName = value.organizationName;
			var competitorAndOrganizationId = value.id;
			var selectedOrganizationId = $('#selectedOrganizationIdForComparativeAnalysis option:selected').val();
			if(moduleName=="overall"){
				var convertedOrganizationName = "'"+organizationName+"'";
				if(competitorAndOrganizationId==selectedOrganizationId){
					html+=			'<th><a style="color:red;" onclick="comparativeAnalysisInnerPage('+competitorAndOrganizationId+','+id+','+convertedmoduleName+','+convertedOrganizationName+')">'+organizationName+'</a></th>';
				}else{
					html+=			'<th><a style="color:green;" onclick="comparativeAnalysisInnerPage('+competitorAndOrganizationId+','+id+','+convertedmoduleName+','+convertedOrganizationName+')">'+organizationName+'</a></th>';
				}
			}else{
				if(competitorAndOrganizationId==selectedOrganizationId){
					html+=			'<th><a style="color:red;" onclick="comparativeAnalysisInnerPage('+competitorAndOrganizationId+','+id+','+convertedmoduleName+','+name+')">'+organizationName+'</a></th>';
				}else{
					html+=			'<th><a style="color:green;" onclick="comparativeAnalysisInnerPage('+competitorAndOrganizationId+','+id+','+convertedmoduleName+','+name+')">'+organizationName+'</a></th>';
				}
			}
		});
	return html;
}

function getCompetitorsAndClientForInnerPageForDepartment(departmentIds,moduleName,name){
	moduleName = "'"+moduleName+"'";
	name = "'"+name+"'";
	var html = "";
		$.each(comparativeAnalysisSelectedOrganizationNames,function(index,value){
			var id = departmentIds[index];
			var organizationName = value.organizationName;
			var competitorAndOrganizationId = value.id;
			var selectedOrganizationId = $('#selectedOrganizationIdForComparativeAnalysis option:selected').val();
			if(competitorAndOrganizationId==selectedOrganizationId){
				html+=			'<th><a style="color:red;" onclick="comparativeAnalysisInnerPage('+competitorAndOrganizationId+','+id+','+moduleName+','+name+')">'+organizationName+'</a></th>';
			}else{
				html+=			'<th><a style="color:green;" onclick="comparativeAnalysisInnerPage('+competitorAndOrganizationId+','+id+','+moduleName+','+name+')">'+organizationName+'</a></th>';
			}
		});
	return html;

	
}

/***********************************Inner Page**********************************************************************/
	   
function comparativeAnalysisInnerPage(organizationId,id,moduleName,name){
	$('#FactorComparisionColumnSummaryStacked').html('');
	JSONObjectForInnerPageFilter = "";
	 $('#page-selection').show();
	loadingForDashBoard();
	$('#comparativeAnalysisSecondPageDiv').hide(600);
	var fromDate = $('#altFromDateComparativeAnalysis').val();
	var toDate = $('#altToDateComparativeAnalysis').val();
	var JSONObject = {};
	JSONObject['fromDate'] = fromDate;
	JSONObject['toDate'] = toDate;
	JSONObject['moduleId']  = moduleName;
	JSONObject['organizationId'] = organizationId;
	
	if(moduleName=="department"){
		JSONObject['departmentId'] = id;
		JSONObject['departmentName'] = name;
	}else if(moduleName=="kpi"){
		JSONObject['kpiId']  = id;
		JSONObject['kpiName'] = name;
	}else if(moduleName=="source"){
		JSONObject['sourceId']  = id;
		JSONObject['sourceName'] = name;
	}else if(moduleName=="language"){
		JSONObject['languageId']  = id;
		JSONObject['languageName'] = name;
	}else if(moduleName=="overall"){
		JSONObject['organizationName'] = name;
	}
	JSONObjectForInnerPageFilter = JSONObject;
	$.ajax({
		type:"POST",
		url:comparitiveAnalysisUrl+"innerPage.htm",
		data:JSON.stringify(JSONObject),
		contentType:"application/json",
		success:function(response){
			$('#filterResultButton').hide();//Hiding Result Page Apply Button
			$('#comparativeAnalysisInnerPageButton').show(600);//Showing Inner Page Apply Button
			$('#comparativeAnalysisThirdPageDiv').html('');
			reviewsListForSearch = "";
			responseForSearch = "";
			sentimentPolarityListForSearch = "";
			chartDataForComparision = "";
			departmentComparisionStartPage = 0;
			departmentComparisionEndPage = 10;
			var list = "";
			
			var moduleName = response.successObject.moduleName;
			list = response.successObject.reviews;
			reviewsListForSearch = list;
			
			var sentimentPolarityList = response.successObject.sentimentPolarityList;
			sentimentPolarityListForSearch = sentimentPolarityList;
			responseForSearch  = response;//Setting response for Search
			
			var noOfPages = 0;
			if(list.length%10  == 0 && list.length >0){
				noOfPages = list.length/10;
			}else{
				noOfPages = (list.length/10)+1;
			}
			begin = 0;
			end = 10;
			if(end > list.legth){
	    		end = list.length;
	    	}
			 $('#page-selection').bootpag({
		            total: noOfPages,
			        page: 1,
			        maxVisible: 10
		        }).on("page", function(event, /* page number here */ num){
		        	$('#comparativeAnalysisThirdPageDiv').html('');
		        	begin = ((num-1)*10);
			    	end=(num)*10;
			    	if(end > list.legth){
			    		end = list.length;
			    	}
			    	$('#comparativeAnalysisThirdPageDiv').append(appendInnerPage(response));
				 	appendChart(response,departmentComparisionStartPage,departmentComparisionEndPage);//This will append bar chart.
				 	var reviewsHtml = appendReviews(response, moduleName, begin, end);//Append Reviews
			    	$('#comparativeAnalysisThirdPageDiv').append(reviewsHtml);
			    	//scrollDown($('#seperation'));

		        });
			 
			 	$('#comparativeAnalysisThirdPageDiv').append(appendInnerPage(response));
			 	$('#comparativeAnalysisThirdPageDiv').append(appendReviews(response, moduleName, begin, end));
			 	appendChart(response,departmentComparisionStartPage,departmentComparisionEndPage);//This will append bar chart.
			 	$('#comparativeAnalysisThirdPageDiv').show(600);
			 	
			unloadingForDashBoard();
		},error:function(response){
			jqueryPostError(response);
			
		}
	});
	return false;
	
}	

function appendInnerPage(response){
	chartDataForComparision = response;
	var positive = 0;
	var negative = 0;
	var neutral = 0;
	var totalReferences = 0;
	var name = response.successObject.name;
	var moduleName = response.successObject.moduleName;
	var factorScore = response.successObject.factorScore;
	var trendChange = response.successObject.trendChange;
	trendChange = parseInt(trendChange);
	if(moduleName=="department" || moduleName=="source" || moduleName=="language" || moduleName=="overall"){
		 positive = parseInt(response.successObject.polarityCounts.positive);
		 negative = parseInt(response.successObject.polarityCounts.negative);
		 neutral = parseInt(response.successObject.polarityCounts.neutral);
		 totalReferences = positive+negative+neutral;
	}else if(moduleName=="kpi"){
		 positive = parseInt(response.successObject.polarityCounts.positivePolarity);
		 negative = parseInt(response.successObject.polarityCounts.negativePolarity);
		 neutral = parseInt(response.successObject.polarityCounts.neutralPolarity);
		 totalReferences = positive+negative+neutral;
	}
	
	var reviewsSize = response.successObject.reviewsSize;
	var html = "";
	html+=	'<div class="row">';
	html+=	' <div class="col-lg-12 SubHeading SmallDarkGreyHeader">';
	html+=		'<span><a onclick="goToComparativeAnalysisPage()">Comparative Analysis </a></span> ' ;
	html+=		'<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span> ';
	html+=		'<span><a onclick="gotoResultPage()"> Result </a></span> ' ;
	html+=		'<span class="glyphicon glyphicon-chevron-right TineyGreyContent" aria-hidden="true"></span>  ';
	html+=		'<span> <b>'+name+'</b>('+response.status+')</span>';
	html+=	'</div>';//End Of 58th Line Div
	html+=	'</div>';//End Of 57th Line Div
	/******************************Top Div For Showing Scores****************************************************/
	html+=	'<div class="row KPIDepartmentFactorTop">';
	html+=	'<h2 class="topic-header"></h2>';
	
	/**********************Department Factor************************************/
	html+=	'<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">';
	if(moduleName=="overall"){
		html+=	'<div class="VerySmallGreyContent">Rating Score Index</div>';
	}else{
		html+=	'<div class="VerySmallGreyContent">'+convertFirstLetterToUpperCase(moduleName)+' Factor</div>';
	}
	html+=	'<div class="MediumBoldGreyContent">'+factorScore+'</div>';
	html+=	'</div>';
	/***********************Trend Change****************************************/
	html+=	'<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">';
	html+=	'<div class="VerySmallGreyContent">';
	html+=		'Trend Change';
	html+=	'<div>';
	if(trendChange>0){
		html+= '<span class="PositiveChangeLeftAlign">'+trendChange+'</span>';
	}else if(trendChange<0){
		html+=	'<span class="NegativeChangeLeftAlign">'+trendChange+'</span>';
	}else{
		html+=	'<span class="NoChangeLeftAlign">'+trendChange+'</span>';
	}
	html+=	'</div>';
	html+=	'</div>';
	html+=	'</div>';
	/*********************Total References**************************************/
	html+=	'<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">';
	html+=		'<div class="VerySmallGreyContent">Total Reference(s)</div>';
	html+=		'<div class="MediumBoldGreyContent">'+totalReferences+'</div>';
	html+=	'</div>';
	/***********************Total Reviews*****************************************/
	html+=	'<div class="col-xs-12 col-md-2 SmallDarkGreyHeader">';
	html+=	'<div class="VerySmallGreyContent">Total Review(s)</div>';
	html+= '<div class="MediumBoldGreyContent">'+reviewsSize+'</div>';
	html+=	'</div>';
	/**************************Sentiment Count**************************************/
	html+= '<div class="col-xs-12 col-md-3">';
	html+= 		'<div class="row">';
	html+=       	'<img alt="" src="../resources/css/HappyIcon.png"> '+positive;
	html+=    		' <img alt="" src="../resources/css/NormalIcon.png"> '+neutral;
	html+=     		' <img alt="" src="../resources/css/SadIcon.png"> '+negative;
	html+=    '</div>';
	html+=         '</div>';
	/*********************************End Of row KPIDepartmentFactorTop**************************************/
	html+=	'</div>';
	
	/**********************************Chart Div***********************************************************/
	html+= '<div class="row">';
	html+= '<div class="chartBox col-xs-12">';
	html+= '<button class="chartPreviousBtn" id="innerPageDepartmentComparisionSummaryPreviousButton" disabled="disabled" style="position:absolute; z-index:10; margin-top:190px; margin-left:-12px;" onclick="previousInnerPageDepartmentComparisionSummaryChart()"></button>';
	html+= '<div id="FactorComparisionColumnSummaryStacked" style="min-width: 310px; height: 400px; margin: 0 auto">';
	html+=	'</div>';
	html+= '<button class="chartNextBtn" id="innerPageDepartmentComparisionSummaryNextButton" style="right:0px;margin-right: -2px;margin-top: -210px;position: absolute;z-index: 10; " onclick="nextInnerPageDepartmentComparisionSummaryChart()"></button>';
	html+= '</div>';
	html+= '</div>';
	
	/**********************************Reviews*******************************************************************/
	html+= '<div class="row lineShadawSeperation" id="seperation"></div>';
	html+= 	'<div class="row TopReviewSource">';
	html+= 	'<div class="col-md-9">';
	html+= 	'<h2 class="topic-header">Reviews</h2>';
	html+= 	'</div>';
	html+= 	'<div class="col-md-3">';
	html+= 	'<div class="input-group SearchIcon">';
	html+= 		'<label for="SearchItem" class="sr-only">Review Search</label>';
	html+= 	'<div class="input-group-addon"><span aria-hidden="true" class="glyphicon glyphicon-search"></span></div>';
	html+= 		'<input type="search" placeholder="Review Search" id="comparisionReviewSearchText" class="form-control" onkeyup="comparisionReviewSearch()">';
	html+= 	'</div>';
	html+= 	'</div>';
	html+= 	'</div>';
	/**********************************Body******************************************************************/
	/************************End Of departmentComparisionInnerPageSummaryReviews Div******************************/
	html+=	'</div>';
	
	return html;	
	
}

function previousInnerPageDepartmentComparisionSummaryChart(){
	departmentComparisionStartPage = departmentComparisionStartPage-10;
	departmentComparisionEndPage = departmentComparisionEndPage-10;
	appendChart(chartDataForComparision, departmentComparisionStartPage, departmentComparisionEndPage);
	
}

function nextInnerPageDepartmentComparisionSummaryChart(){
	departmentComparisionStartPage = departmentComparisionStartPage+10;
	departmentComparisionEndPage = departmentComparisionEndPage+10;
	appendChart(chartDataForComparision, departmentComparisionStartPage, departmentComparisionEndPage);
}

function appendChart(response,departmentComparisionStartPage,departmentComparisionEndPage){
	loadingForDashBoard();
	var datesArray = new Array();
	var positiveArray = new Array();
	var negativeArray = new Array();
	var neutralArray = new Array();
	var positiveReference=new Array();
	var negativeReference=new Array();
	var neutralReference=new Array();
	var barChartData = response.successObject.barChartData;
	var name = response.successObject.name;
	var moduleName = response.successObject.moduleName;
	if(barChartData.length<=10){
		$('#innerPageDepartmentComparisionSummaryNextButton').prop('disabled',true);
	}
	if(barChartData.length>0){
		$.each(barChartData,function(index,value){
			var positiveCount = 0;
			var negativeCount = 0;
			var neurtalCount = 0;
			var totalReferences = 0;
			var date = value.date;
			var factorScore = parseFloat(value.repufactByRange);
			if(moduleName=="department" || moduleName=="source" || moduleName=="language" || moduleName=="overall"){
				 positiveCount = parseInt(value.polarityCountsByRange.positive);
				 negativeCount = parseInt(value.polarityCountsByRange.negative);
				 neutralCount = parseInt(value.polarityCountsByRange.neutral);
				 totalReferences = positiveCount+negativeCount+neutralCount;
				 totalReferences = (factorScore/totalReferences).toFixed(2);
			}else if(moduleName=="kpi"){
				 positiveCount = parseInt(value.polarityCountsByRange.positivePolarity);
				 negativeCount = parseInt(value.polarityCountsByRange.negativePolarity);
				 neutralCount = parseInt(value.polarityCountsByRange.neutralPolarity);
				 totalReferences = positiveCount+negativeCount+neutralCount;
				 totalReferences = (factorScore/totalReferences).toFixed(2);
			}
			
			//shravan
			positiveReference.push(positiveCount);
			negativeReference.push(negativeCount);
			neutralReference.push(neutralCount);
			
			
			
			var positiveValue = parseFloat(totalReferences*positiveCount);
			var negativeValue = parseFloat(totalReferences*negativeCount);
			var neautralValue = parseFloat(totalReferences*neutralCount);
			if(isNaN(positiveValue)){
				positiveValue = 0;
			}
			if(isNaN(negativeValue)){
				negativeValue = 0;
			}
			if(isNaN(neautralValue)){
				neautralValue = 0;
			}
			datesArray.push(date);
			positiveArray.push(positiveValue);
			negativeArray.push(negativeValue);
			neutralArray.push(neautralValue);
		});
	}
	datesArray = datesArray.slice(departmentComparisionStartPage,departmentComparisionEndPage);
	positiveArray = positiveArray.slice(departmentComparisionStartPage,departmentComparisionEndPage);
	negativeArray = negativeArray.slice(departmentComparisionStartPage,departmentComparisionEndPage);
	neutralArray = neutralArray.slice(departmentComparisionStartPage,departmentComparisionEndPage);
	
	//shravan
	positiveReference=positiveReference.slice(departmentComparisionStartPage,departmentComparisionEndPage);
	negativeReference=negativeReference.slice(departmentComparisionStartPage,departmentComparisionEndPage);
	neutralReference=neutralReference.slice(departmentComparisionStartPage,departmentComparisionEndPage);
	
	
	if(departmentComparisionEndPage>=barChartData.length){
		$('#innerPageDepartmentComparisionSummaryNextButton').prop('disabled',true);
	}else{
		$('#innerPageDepartmentComparisionSummaryNextButton').prop('disabled',false);
	}
	
	if(departmentComparisionStartPage<=0){
		$('#innerPageDepartmentComparisionSummaryPreviousButton').prop('disabled',true);
	}else{
		$('#innerPageDepartmentComparisionSummaryPreviousButton').prop('disabled',false);

	}
	if(moduleName=="department"){
		var dp = "Department Score for "+name;
		populateBarChart("FactorComparisionColumnSummaryStacked",datesArray,positiveArray,negativeArray,neutralArray,dp,positiveReference,negativeReference,neutralReference);
	}else if(moduleName=="kpi"){
		var dp = "KPI Score for "+name;
		populateBarChart("FactorComparisionColumnSummaryStacked",datesArray,positiveArray,negativeArray,neutralArray,dp,positiveReference,negativeReference,neutralReference);
	}else if(moduleName=="source"){
		var dp = "Source Score for "+name;
		populateBarChart("FactorComparisionColumnSummaryStacked",datesArray,positiveArray,negativeArray,neutralArray,dp,positiveReference,negativeReference,neutralReference);
	}else if(moduleName=="language"){
		var dp = "Language Score for "+name;
		populateBarChart("FactorComparisionColumnSummaryStacked",datesArray,positiveArray,negativeArray,neutralArray,dp,positiveReference,negativeReference,neutralReference);
	}else if(moduleName=="overall"){
		var dp = "Rating Score Index "+name;
		populateBarChart("FactorComparisionColumnSummaryStacked",datesArray,positiveArray,negativeArray,neutralArray,dp,positiveReference,negativeReference,neutralReference);
	}
	unloadingForDashBoard();
	return false;
}


function appendReviews(response,moduleName,begin,end){
	var reviews = response.successObject.reviews;
	var sentimentPolarityList = response.successObject.sentimentPolarityList;
	var name = response.successObject.name;
	reviews = reviews.slice(begin,end);
	return reviewsList(reviews,sentimentPolarityList,name,moduleName,"");
}

function reviewsList(reviewsList,sentimentPolarityList,departmentName,moduleName,searchText){
	var html = "";
	html+=	'<div  id="comparativeAnalysisInnerPageReviews">';
	if(reviewsList.length>0){
		var selectedOrganizationId = $('#selectedOrganizationIdForComparativeAnalysis option:selected').val();
		$.each(reviewsList,function(index,value){
			var reviewId = value.id;
			var reviewerName  = value.reviewerName;
			var departmentRepufactScore = value.repufactorScore;
			var sourceName = value.sourceName;
			var reviewerLocation = value.reviewLocation;
			var reviewTime = convertedDate(value.reviewTime);
			var reviewTitle = value.reviewTitle;
			var reviewContent = value.highlightedReviewContent;
			var normalizedRating = parseFloat(value.normalizedRating);
			normalizedRating = normalizedRating.toFixed(2);
			var repufactorScore = value.repufactorScore;
			var kpiTagSentimentList  = value.keywordList;
			var organizationId = value.organizationId;
			html+=	'<div class="col-xs-12 SingleReviewList" id="departmentInnerPageReviews_'+reviewId+'">';
			/*************************Left Side Div******************************************************************/
			html+=	'<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity" onclick="expandInnerPageKpiFactors('+reviewId+')">';
			if(sentimentPolarityList.length>0){
			//html+= getSentimentColor(sentimentPolarityList,repufactorScore);
				$.each(sentimentPolarityList,function(index,value){
					var minPercentage = value.minPercentage;
					var maxPercentage = value.maxPercentage;
					var sentimentName = value.sentimentName;
					if (parseInt(repufactorScore) >= minPercentage && parseInt(repufactorScore) <= maxPercentage && sentimentName == "positive") {
						html+= '<div class="PositiveSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
								+ repufactorScore
								+ '%</span> </div>';
					}
					if (parseInt(repufactorScore) >= minPercentage && parseInt(repufactorScore) <= maxPercentage && sentimentName == "neutral") {
						html+= '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
								+ repufactorScore
								+ '%</span> </div>';
					}
					if (parseInt(repufactorScore) >= minPercentage && parseInt(repufactorScore) <= maxPercentage && sentimentName == "negative") {
						html+= '<div class="NegativeSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'
								+ repufactorScore
								+ '%</span> </div>';
					}
				});
			}else{
				html+= '<div class="NeutralSentimentReview row"><div class="arrow-left"></div>Review Score: <span class="score">'+repufactorScore+'%</span> </div>';
			}
			html+=		  '<div class="reviewDetails row">';
			html+=        '<div class="reviewSource">'+convertNullToString(sourceName)+'</div>';
			html+=        '<div class="reviewerName">by <span>'+convertNullToString(reviewerName)+'</span></div>';
			html+=        '<div class="reviewerDetail">from <span>'+convertNullToString(reviewerLocation)+'</span></div>';
			html+=        '<div class="revieweTime"><span class="glyphicon glyphicon-time"> '+reviewTime+'</span></div>';
			html+=		'</div>';//End Of 1181 reviewDetails row
			html+=		'</div>';//End Of Expand 1179;
			/**********************************Right Side Div************************************************************/
			html+=	'<div class="col-xs-12 col-sm-9 col-lg-10">';
			html+='<div style="float:right;">';
			if(selectedOrganizationId==organizationId){
				html += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetailsInnerReviews('+ reviewId + ')" /> ';
			}else{
				//html += '<input type="button" class="btn btn-ViewReviewDetails" onclick="viewDetailsInnerReviews('+ reviewId + ')" /> ';
			}
			html+='</div>';
			if(searchText==""){
				html+=		'<h3 class="SingleReviewHeader">'+convertNullToString(reviewTitle)+'</h3>';
				html+=		'<p>'+convertNullToString(reviewContent)+'</p>';
				
			}else{
				html+=		'<h3 class="SingleReviewHeader">'+highlightSearchText(searchText, convertNullToString(reviewTitle))+'</h3>';
				html+=		'<p>'+highlightSearchText(searchText, convertNullToString(reviewContent))+'</p>';
				
			}
			/*************************Normalized Rating***********************************************************/
			html+=		'<div class="LightGreyColor col-xs-12 sentimentKeywordResult">';
			if(normalizedRating>5){
				html+=	'<div class="VerySmallGreyContent">This review was rated <b>'+normalizedRating+'/10</b> for <b>'+departmentName+'</b> by <b>'+sourceName+'</b></div>';
			}else{
				html+=	'<div class="VerySmallGreyContent">This review was rated <b>'+normalizedRating+'/5</b> for <b>'+departmentName+'</b> by <b>'+sourceName+'</b></div>';
			}
			html+=		'</div>';
			/********************************KPI Details Data************************************************/
			html+= '<div class="sentimentKeywordResult">';
			html+=	'</div>';
			
			html+=	'<div  class="TradeReviewKpiDepartmentFactor col-xs-12 OnSeleceActive" id="InnerPageKpiScores_'+reviewId+'" style="margin:0px;display:none;">';
			html+=	'<div class="KPIScoreHeader SmallBoldGreyContent col-xs-12">Keywords</div>';
			for (var h = 0; h < kpiTagSentimentList.length; h++) {
				for (var p = 0; p < sentimentPolarityList.length; p++) {
					if (parseInt(kpiTagSentimentList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(kpiTagSentimentList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "positive") {
						html += '<div class="KPIScore col-xs-4"> '
								+ ' <span class="PositiveSentimentCount"> '
								+ kpiTagSentimentList[h].nlpQueryName
								+ '</span></div>';
						break;
					}
					if (parseInt(kpiTagSentimentList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(kpiTagSentimentList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "neutral") {
						html += '<div class="KPIScore col-xs-4"> '
								+ ' <span class="NeutralSentimentCount"> '
								+ kpiTagSentimentList[h].nlpQueryName
								+ '</span></div>';
						break;
					}
					if (parseInt(kpiTagSentimentList[h].sentimentScore) >= sentimentPolarityList[p].minPercentage
							&& parseInt(kpiTagSentimentList[h].sentimentScore) <= sentimentPolarityList[p].maxPercentage
							&& sentimentPolarityList[p].sentimentName == "negative") {
						html += '<div class="KPIScore col-xs-4"> '
								+ ' <span class="NegativeSentimentCount"> '
								+ kpiTagSentimentList[h].nlpQueryName
								+ '</span></div>';
						break;
					}
				}
			}
			html += '</div>';
			/*$.each(kpiTagSentimentList,function(index,value){
				var kpiName = value.kpiName;
				var kpiFactor  = value.kpiFactorScore;
				html+='<div class="KPIScore col-xs-4"><span class="PositiveSentimentCount"> '+kpiName+'</span></div>';
			});*/
			html+=	'</div>';//End of departmentComparisionInnerPageKpiScores_
			html+=	'<div id="InnerPageReviewViewDetails_'+reviewId+'" style="margin-left: -169px;"></div>';
			html+=	'</div>';//End Of col-xs-12 col-sm-9 col-lg-10
			/******************************End Od Department Inner Page Reviews*********************************************/	
			html+=	'</div>';//End Of departmentInnerPageReviews_$ 1177
			});
	}else{
		html+=	'<h4>No Reviews Found</h4>';
	}
	html+=	'<div id="page-selection"></div>';
	
	html+=	'</div>';//End Of comparativeAnalysisInnerPageReviews.
	return html;
}


function hideDetailsInnerReviews(id){
	$('#InnerPageReviewViewDetails_'+id).hide(600);
	$('#departmentComparisionViewDetails_'+id).show();
	$('#departmentComparisionHideDetails_'+id).hide(600);


}
function expandInnerPageKpiFactors(id){
	$('#InnerPageKpiScores_'+id).toggle();
}
/*********************************************************************************************************************************************
 * ************************************************Search*************************************************************************************
 * ******************************************************************************************************************************************/

var isTextStopped;
function comparisionReviewSearch(){
	
	if (isTextStopped) clearTimeout(isTextStopped);
	isTextStopped = setTimeout(function(){
	var searchedReviewsList = [];
	var searchText = $.trim($('#comparisionReviewSearchText').val());
	$('#comparativeAnalysisThirdPageDiv').html('');
	$('#comparisionReviewSearchText').val(searchText);
	if(searchText==null || searchText==""){
		searchText = "";
	}
		$.each(reviewsListForSearch,function(index,value){
			loadingForDashBoard();
			var reviewTitle = value.reviewTitle;
			var reviewContent = value.highlightedReviewContent;
			if(reviewTitle==null){
				reviewTitle = "";
			}
			if(reviewContent==null){
				reviewContent = "";
			}
			
			if (searchText!="" && ( reviewContent.toLowerCase().indexOf(searchText.toLowerCase())!=-1 || (reviewTitle.toLowerCase().indexOf(searchText.toLowerCase()))!=-1)) {
				var hightedText = '<span style="background-color: #FFFF00">'+ searchText + '</span>';
				reviewContent = reviewContent.toLowerCase().split(searchText.toLowerCase()).join(hightedText);
				reviewTitle = reviewTitle.toLowerCase().split(searchText.toLowerCase()).join(hightedText);
				searchedReviewsList.push(reviewsListForSearch[index]);
			}else{
				if(searchText==""){
					$('#comparativeAnalysisThirdPageDiv').html('');
					searchedReviewsList.push(reviewsListForSearch[index]);
					//scrollDown($('#seperation'));
				}
			}
		});
		var noOfPages = 0;
		if(searchedReviewsList.length%10  == 0 && searchedReviewsList.length >0){
			noOfPages = searchedReviewsList.length/10;
		}else{
			noOfPages = (searchedReviewsList.length/10)+1;
		}
		begin = 0;
		end = 10;
		if(end > searchedReviewsList.legth){
    		end = searchedReviewsList.length;
    	}
		 $('#page-selection').bootpag({
	            total: noOfPages,
	            page: 1,
		        maxVisible: 10
	        }).on("page", function(event, /* page number here */ num){
	        	loadingForDashBoard();
		    	$('#comparativeAnalysisThirdPageDiv').html('');
	        	begin = ((num-1)*10);
		    	end=(num)*10;
		    	if(end > searchedReviewsList.legth){
		    		end = searchedReviewsList.length;
		    	}
		    	$('#comparativeAnalysisThirdPageDiv').append(appendInnerPage(responseForSearch));
			 	appendChart(responseForSearch,departmentComparisionStartPage,departmentComparisionEndPage);//This will append bar chart.
			 	$('#comparisionReviewSearchText').val(searchText);
		    	var reviewsHtml = reviewsList(searchedReviewsList.slice(begin, end), sentimentPolarityListForSearch, responseForSearch.name, responseForSearch.departmentName, searchText);
				$('#comparativeAnalysisThirdPageDiv').append(reviewsHtml);
				scrollDown($('#seperation'));
				unloadingForDashBoard();
		    	
	        });
		 	loadingForDashBoard();
			$('#comparativeAnalysisThirdPageDiv').append(appendInnerPage(responseForSearch));
		 	appendChart(responseForSearch,departmentComparisionStartPage,departmentComparisionEndPage);//This will append bar chart.
			var reviewsHtml = reviewsList(searchedReviewsList.slice(0,10), sentimentPolarityListForSearch, responseForSearch.name, responseForSearch.departmentName, searchText);
			$('#comparativeAnalysisThirdPageDiv').append(reviewsHtml);
			$('#comparisionReviewSearchText').val(searchText);
			scrollDown($('#seperation'));
			unloadingForDashBoard();
	},500);
}
/**************************Bread Crumbe************************************************************/
/***********************Going TO First Page***************************************************/
function goToComparativeAnalysisPage(){
	$('.navbar-top-links').show();
	$('#comparitiveAnalysisFirstPageDiv').find('input[type=checkbox]:checked').removeAttr('checked');
	 $('#page-selection').css("display", "none");
	$('#comparativeAnalysisSecondPageDiv').hide(600);
	$('#comparativeAnalysisThirdPageDiv').hide(600);
	$('#comparitiveAnalysisFirstPageDiv').show(600);
	$('#filterResultButton,#comparativeAnalysisInnerPageButton').hide();//Hiding Result,Inner  Page Buttons
	$('#filterComparativeAnalysisButton').show(600);
}
/************************Going TO Second Page********************************************/
function gotoResultPage(){
	$('#comparativeAnalysisThirdPageDiv').html('');
	 $('#page-selection').css("display", "none");
	 reviewsListForSearch = "";
	 sentimentPolarityListForSearch  = "";
	 responseForSearch = "";
	$('#comparativeAnalysisThirdPageDiv').hide(600);
	$('#comparativeAnalysisSecondPageDiv').show(600);
	$('#filterResultButton').show();//Showing Result Page Apply Button
	$('#comparativeAnalysisInnerPageButton').hide();//Hiding Inner Page Apply Button
}

/***********************Filter Result(Second Page Filter)*******************************/
function filterResult(){
	loadingForDashBoard();
	getSessionData();
	getComparativeAnalysisResultData(comparativeAnalysisSelectedDepartmentArray,comparativeAnalysisSelectedKpiArray,comparativeAnalysisSelectedSourceArray,comparativeAnalysisSelectedLanguageArray,selectedOrganizationsArrayForComparision);
}
/***********************Filter Inner Page(Third Page Filter)*******************************/
function filterInnerPage(){
	loadingForDashBoard();
	getSessionData();
	unloadingForDashBoard();
	var id = 0;
	var name = ""
	var organizationId = JSONObjectForInnerPageFilter.organizationId;
	var moduleName = JSONObjectForInnerPageFilter.moduleId;
	if(moduleName=="department"){
		id = JSONObjectForInnerPageFilter.departmentId;
		name = JSONObjectForInnerPageFilter.departmentName;
	}else if(moduleName=="kpi"){
		id = JSONObjectForInnerPageFilter.departmentId;
		name = JSONObjectForInnerPageFilter.kpiName;
	}else if(moduleName=="source"){
		id = JSONObjectForInnerPageFilter.sourceId;
		name = JSONObjectForInnerPageFilter.sourceName;
	}else if(moduleName=="language"){
		id = JSONObjectForInnerPageFilter.languageId;
		name = JSONObjectForInnerPageFilter.languageName;
	}else if(moduleName=="overall"){
		id = organizationId;
		name = JSONObjectForInnerPageFilter.organizationName;
	}
	comparativeAnalysisInnerPage(organizationId,id,moduleName,name);
}
function exportComparativeAnalysisData(){
	loadingForDashBoard();
	$.ajax({
		type:"POST",
		url:comparitiveAnalysisUrl+"exportComparativeAnalysisData.htm",
		contentType:"application/json",
		data:JSON.stringify(requestDataForComparativeResults),
		success:function(data){
			unloadingForDashBoard();
			//window.location.href = data.filePath;
			download(data.filePath);
			/*$.fileDownload(data.filePath)
		    .done(function () { alert('File download a success!'); })
		    .fail(function () { alert('File download failed!'); });*/
		 
		},error:function(xhr,err){
			 alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
			    alert("responseText: "+xhr.responseText);
			    alert(err);
			//jqueryPostError(response);
		}
	});
}
function download(filePath){
	redirectView(comparitiveAnalysisUrl+"downloadComparativeAnalysisData.htm?filePath="+filePath);
}
