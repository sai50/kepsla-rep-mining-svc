<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
  <title><spring:message code="label.industry.master" /></title>
</head>
<body>
<div id="wrapper">
<%@include file="adminDashboard.jsp" %> 
<div id="page-wrapper">
<div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">Industry Type Master</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
			<ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
				<li class="active"><a href="" data-toggle="tab" onclick="industryTypeList()">Industry & Segment Category</a></li>
				<li><a href="#" data-toggle="tab" onclick="industryTypes()">Organization & Department Category</a></li>
				<li><a href="#" data-toggle="tab" onclick="ShowALLAttributeDropDown()">Organization & Department Attributes</a></li>
				<li><a href="#" data-toggle="tab" onclick="industryExcelUpload()"><span class="glyphicon glyphicon-export" aria-hidden="true"></span></a></li>
				<li><a href="#" data-toggle="tab" onclick="exportIndustryMaster()"><span class="glyphicon glyphicon-import" aria-hidden="true"></span></a></li>
			</ul>
		
			  <div id="my-tab-content" class="tab-content">
			  <div id="listOfIndustryTypes"></div>     
			  <div id="organizationAttributeType"></div>
			  <div id="dataTableOrganizationAttribute"></div>
			  <div id="listGeneralAttributeTab"></div>
			  <div id="dataTableDepartmentAttribute"></div>
			  <div id="listGeneralDepartmentAttributeTab"></div>
			  <div id="listOfOrganizationTypes"></div>
			  <div id="successSegmentTypeDiv"></div>		
			  <div id="datas"></div>
			  <div id="listGeneralIndustryTab"></div>
              <div id="listGeneralOrganizationTab"></div>
              <div id="listGeneralDepartmentAttributeTab"></div>
			  <div id="dataTabOrg"></div>
			  </div>

		<div id="newIndustryType"></div>

		<div id="AddSegmentCategoryTextBox"></div>

		<div id="industryDropDown"></div>

		<div id="newIndustryTypeOrganization"></div>

		<div id="addOrganizationIndustryDropDown"></div>

		<div id="addOrganizationSegmentDropDown"></div>

		<div id="addOrganizationDropDown"></div>

		<div id="addOrganizationAttribute"></div> 

		<div id="editIndustryType"></div>

		<div id="editOrganizationAttributeType"></div>
		
		<div id="editDepartmentAttributeKeys"></div>
		 
		 <div id="showAttributesData"> </div> 
		 
		 <div id="addDepartmentAttribute"></div>
		
		
		<!-- <div id="departmentAttributeTypes"></div> -->

		<div id="editDepartmentAttributeType"></div>

		<div id="editOrganizationType"></div>

		<div id="saveDepartmentAttributeTypes"></div> 
		
		<div id="uploadExcel"></div>
		
		<div id="exportIndustryMasterTab"></div>
	</div>
	<!-- <div id="addAndEditIndustryTypeMasterDiv"  class="SubHeading addAdminForm col-xs-12" style="display: none;"></div> -->
	</div>
		<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	</div>
	</div>
	</div>
</body>
<%@include file="includeJsFiles.jsp"%>
<script src="../resources/js/industryTypeMaster.js">	
</script>
 <script>
	$(document).ready(function industryType() {
		                  $('#orgAndDate').hide();
		                  $('#listGeneralIndustryTab').html('');
		                  $("#addOrganizationDropDown").html('');
		                  $("#uploadExcel").html('');
						//old tab div
		                  $("#dataTabOrg").html('');

						//Third Tab Data
						$("#organizationAttributeType").html('');
						$("#dataTableOrganizationAttribute").html('');
						$("#addOrganizationAttributes").html('');
						$("#addOrganizationAttribute").html('');
						$("#addDepartmentAttributes").html('');
						$("#addDepartmentAttribute").html('');
						$("#editIndustryType").html('');
						$("#newIndustryType").hide();
						$("#listOfIndustryTypes").html('');
						$("#listOfIndustryTypes").empty();
						$("#newIndustryType").hide();
						$('#exportIndustryMasterTab').html('');
						$("#subHeadingFormName").html('');
						
						$('#page-wrapper').mask('Loading...');
						
						    //using for delete 
						    selectedIndustryCheckBox=[];
						    var checkBoxDeleteValue=$("#selectedCheckBoxes").val();
						    selectedIndustryCheckBox.push(checkBoxDeleteValue);

						         $.ajax({
									type : "GET",
									url : "../industryTypeMaster/list.htm",
									dataType : "json",
									success : function(data) {
										console.log(data);
										
										$('#page-wrapper').unmask();

										var html = "";
										html +='<div class="tab-pane fade in active" id="drops">';
										html += '<form  class="form-inline col-xs-12 SubHeading AdminMainActivity">';
										html += '<label class="control-label" for="Industry">Industry Type<select id="selectedIndustryType" class="form-control input-sm" onchange="getval()">';
										html += '<option  value="0">ALL</option>';
										for (var i = 0; i < data.length; i++) {
											html += '<option value='+data[i].id+'>'
													+ data[i].industryType
													+ '</option>';
										}
										html += '</select>';
										html += '</label>';
										html += '<label id="drop" class="control-label" for="SegmentCategory">Segment Category<select class="form-control input-sm" id="selectedSegmentCategory">';
										html += '<option value="0">ALL</option>';
										html += '</select>';
										html += '</label>';
										html += '<input type="button" class="btn btn-default btn-sm" id="viewList" onclick="industryTypeMasterList()" value="View" style="margin-bottom:-5px"/>';								
										
										//add and delete buttons start
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
										//add and delete buttons end
										
										html += '</div>';
										html += '</form>';
																
										$("#drop").append(html);
										$("#drop").show();
										$("#listOfIndustryTypes").append(html);
										$("#listOfIndustryTypes").show();
										$("#industryTable").dataTable();
										//industryTypeMasterList();//commented by manoj
									}								
								});
					});
	
	
/********************************************************************************************************************************************
************************** SHOW LIST VIEW ************************************************************************************************************
**********************************************************************************************************************************************/

	function industryTypeMasterList() {
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
				console.log(data);
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

</script>
</html>