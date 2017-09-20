/* Getting the Organization group and organization bands List------------------------------------------------------------>*/
function getOrganizationBrand() {
		$('#loadMaskDiv').mask('Loading...');
		var selectedOrganizationGroupId = $('#addDepartment-organizationGroupId option:selected').val();
		$('button[type=submit]', $('#addDepartmentForm')).prop('disabled',false);
		$('#addDepartmentForm').find('#addDepartment-organizationBrandName-DropDownDiv').removeClass('has-error has-feedback');
		$('#addDepartmentForm').find('#addDepartment-organizationFullName-DropDownDiv').removeClass('has-error has-feedback');
		$('#addDepartmentForm').find('#addDepartment-departmentType-DropDownDiv').removeClass('has-error has-feedback');
		$('#addDepartment-organizationBrandId').prop('disabled', false);// enabling dependent drop down
		$('#addDepartment-organizationNameId').prop('disabled', false);
		$('#add-department-departmentTypeId').prop('disabled', false);
		$.ajax({
					type : "POST",
					url : "../organization/getOrganizationBrandList.htm",
					contentType : "application/json",
					data : JSON.stringify(selectedOrganizationGroupId),
					success : function(response) {
						$('#addDepartment-organizationBrandId').html('');//Clearing Dependent Dropdown Values
						$('#addDepartment-organizationNameId').html('');
						$('#add-department-departmentTypeId').html('');
						if (response.status == "ORGANIZATION_BRANDS_LIST_SUCCESS") {
							var organizationBrands = response.successObject.organizationBrands;
							for (var i = 0; i < organizationBrands.length; i++) {
								$('#addDepartment-organizationBrandId').append(
										'<option value='+organizationBrands[i].id+'>'+ organizationBrands[i].organizationBrandName
									  + '</option>');
							}
							getOrganizationName();
							disableButton();
							$('#loadMaskDiv').unmask();
						} else if (response.status == "EXCEPTION_ERROR") {
							$('#loadMaskDiv').mask(response.errorMessage);
						} else {
							$('#addDepartmentForm').find('#addDepartment-organizationBrandName-DropDownDiv').addClass('has-error has-feedback');
							var message = '<font style="color:red">No Organization Brands Found</font>';
							$('#addDepartment-organizationBrandId').append('<option value="0">' + message+ '</option>');
							$('#addDepartmentForm').find('#addDepartment-organizationBrandName-DropDownDiv').addClass('has-error has-feedback');
							
							var message1 = '<font style="color:red">No Organization Names found</font>';
							$('#addDepartment-organizationNameId').append('<option value="0">' + message1+ '</option>');
							$('#addDepartmentForm').find('#addDepartment-organizationFullName-DropDownDiv').addClass('has-error has-feedback');
							
							$('#addDepartmentForm').find('#departmentDepartmentTypeDropDownDiv').addClass('has-error has-feedback');
							var message2 = 'No Department Types Found For Selected Organization Name</font>';
							$('#add-department-departmentTypeId').append('<option value="0">'+message2+'</option>');
							
							$('#departmentAttributesEmptyDiv').show(600);
							$('#departmentAttributesDiv').hide(600);
							$('#departmentSearchKpisDiv').hide(600);
							$('#departmentEmptyKpisDiv').show(600);
							
							$('#addDepartment-organizationBrandId,#addDepartment-organizationNameId,#add-department-departmentTypeId').prop('disabled', true);// disabling dependent drop down
							$('button[type=submit]', $('#addDepartmentForm')).prop('disabled', true);
							$('#loadMaskDiv').unmask();
						}
					},
					error : function(response) {
						$('#loadMaskDiv').mask(
								response.status + "*************"
										+ response.statusText);
					}
				});
	}
	
	/* 	Getting Organization Name drop down Values --------------------------------------------------------------------->*/
	function getOrganizationName(){
		$('#loadMaskDiv').mask('Loading...');
		var selectedOrganizationBrandId = $('#addDepartment-organizationBrandId option:selected').val();
		$('button[type=submit]', $('#addDepartmentForm')).prop('disabled', false);
		$('#addDepartmentForm').find('#addDepartment-organizationFullName-DropDownDiv').removeClass('has-error has-feedback');
		$('#addDepartment-organizationNameId').prop('disabled',false);//Enabling organization name DropDown
		$.ajax({
			type:"POST",
			url:"../organization/getOrganizationNameList.htm",
			contentType:"application/json",
			data:JSON.stringify(selectedOrganizationBrandId),
			success:function(response){
				$('#addDepartment-organizationNameId').html('');//Clearing Organization Name DropDown Value
				if(response.status=="ORGANIZATION_NAMES_LIST_SUCCESS"){
					var organizationNames = response.successObject.organizations;
					for(var i=0;i<organizationNames.length;i++){
						$('#addDepartment-organizationNameId').append('<option value='+organizationNames[i].id+'>'+organizationNames[i].organizationFullName+'</option>');
					}
					disableButton();
					getDepartmentTypes();//Get Department Types
					$('#loadMaskDiv').unmask();
				}else if(response.status=="ORGANIZATION_NAMES_LIST_EMPTY"){
					$('#addDepartmentForm').find('#addDepartment-organizationFullName-DropDownDiv').addClass('has-error has-feedback');
					var emptyOrganizationNames = '<font style="color:red">No Organization Names Found</font>';
					$('#addDepartment-organizationNameId').append('<option value="0">'+emptyOrganizationNames+'</option>');
					$('#addDepartment-organizationNameId').prop('disabled',true);
					$('button[type=submit]', $('#addDepartmentForm')).prop('disabled', true);
					$('#departmentAttributesEmptyDiv').show(600);
					$('#departmentAttributesDiv').hide(600);
					$('#departmentSearchKpisDiv').hide(600);
					$('#departmentEmptyKpisDiv').show(600);
					$('#loadMaskDiv').unmask();
					disableButton();
					getDepartmentTypes();//Get Department Types
				}else{
					$('#loadMaskDiv').mask(response.errorMessage);
				}
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
			}
		});
	}
/*Getting the deartment type list------------------------------------------------------------------------------------>*/	
function getDepartmentTypes(){
	var selectedOrganizationNameId = $('#addDepartment-organizationNameId option:selected').val();
	$('#loadMaskDiv').mask('Loading...');
	$('#add-department-departmentTypeId').prop('disabled',false);
	$('#addDepartmentForm').find('#departmentDepartmentTypeDropDownDiv').removeClass('has-error has-feedback');
	$.ajax({
		type:"POST",
		url:"../organization/getDepartmentTypesForDepartment.htm",
		data:JSON.stringify(selectedOrganizationNameId),
		contentType:"application/json",
		success:function(response){
			$('#add-department-departmentTypeId').html('');
			if(response.status=="DEPARTMENTS_LIST_EMPTY"){
				$('#addDepartmentForm').find('#departmentDepartmentTypeDropDownDiv').addClass('has-error has-feedback');
				var message2 = '<font style="color:red">No Department Types Found For Selected Organization Name</font>';
				$('#add-department-departmentTypeId').append('<option value="0">'+message2+'</option>');
				$('#add-department-departmentTypeId').prop('disabled',true);
				$('#departmentAttributesEmptyDiv').show(600);
				$('#departmentAttributesDiv').hide(600);
				$('#departmentSearchKpisDiv').hide(600);
				$('#departmentEmptyKpisDiv').show(600);
				$('#loadMaskDiv').unmask();
			}else if(response.status=="DEPARTMENTS_LIST_SUCCESS"){
				var departmentTypes = response.successObject.departmentTypes;
				for(var i=0;i<departmentTypes.length;i++){
					$('#add-department-departmentTypeId').append('<option value='+departmentTypes[i].id+'>'+departmentTypes[i].departmentType+'</option>');
				}
				disableButton();
				getDepartmentAttributes();
				getKpis();//Getting Kpis
				$('#loadMaskDiv').unmask();
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#loadMaskDiv').mask(response.errorMessage);
			}else { 
				$('#addDepartmentForm').find('#departmentDepartmentTypeDropDownDiv').addClass('has-error has-feedback');
				var message = '<font style="color:red">No Department Types Found For Selected Organization Name</font>';
				$('#add-department-departmentTypeId').append('<option value="0">'+message+'</option>');
			$('#add-department-departmentTypeId').prop('disabled',true);
			$('button[type=submit]', $('#addDepartmentForm')).prop('disabled', true);
			getDepartmentAttributes();
			getKpis();//Getting Associated KPIS
			$('#loadMaskDiv').unmask();
			}
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"************"+response.statusText);
		}
		
	});
}
function getDepartmentAttributes(){
	var selectedDepartmentTypeId = $('#add-department-departmentTypeId option:selected').val();
	$('#loadMaskDiv').mask('Loading...');
	$.ajax({
		type:"POST",
		url:"../organization/getDepartmentAttributes.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedDepartmentTypeId),
		success:function(response){
			if(response.status=="ATTRIBUTES_LIST_SUCCESS"){
				$('#loadMaskDiv').unmask();
				$('#departmentAttributesEmptyDiv').hide(600);
				$('#departmentAttributesDiv').html('');
				var attribute = response.successObject.attributes;
				var html = "";
				html+=	'<input type="hidden" id="attributesLength" value='+attribute.length+'>';
				for(var i=0;i<attribute.length;i++){
					html+=	'<div class="form-group">';
					html+=	'<label>'+attribute[i].attributeKey+'</label>';
					html+=	'<input type="text" style="width: 50%" class="form-control" placeholder = "Enter '+attribute[i].attributeKey+'" maxLentgh=50 id=attributeKeyValue_'+i+'>';
					html+=	'<input type="hidden" id="attributeKeyId_'+i+'" value="'+attribute[i].id+'">';
				}
				$('#departmentAttributesDiv').append(html);
				$('#departmentAttributesDiv').show(600);
			}else if(response.status=="ATTRIBUTES_LIST_EMPTY"){
				$('#departmentAttributesDiv').hide(600);
				$('#departmentAttributesEmptyDiv').show(600);
				$('#loadMaskDiv').unmask();
			}
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
		}
	});
	return false;
}
	/* Getting Search KPI(s) ---------------------------------------------------------------->*/	
	function getKpis(){
		var selectedDepartmentTypeId = $('#add-department-departmentTypeId option:selected').val();
		$('#loadMaskDiv').mask('Loading...');
		$.ajax({
			type:"POST",
			url:"../organization/getKpisByDepartmentId.htm",
			data:JSON.stringify(selectedDepartmentTypeId),
			contentType:"application/json",
			success:function(response){
				$('#departmentKpisDataList').html('');
				$('#departmentKpis').html('');
				$('#selectedDepartmentKpis').html('');
				if(response.status=="KPI_LIST_SUCCESS"){
					$('#departmentEmptyKpisDiv').hide(600);
					$('#departmentSearchKpisDiv').show(600);
					var kpis = response.successObject.kpiLists;
					for(var i=0;i<kpis.length;i++){
						$('#departmentKpisDataList').append('<option value='+kpis[i].kpiName+'>'+kpis[i].id+'</option>');
						$('#departmentKpis').append('<option value='+kpis[i].id+'>'+kpis[i].kpiName+'</option>');
					}
					$('#loadMaskDiv').unmask();
				}else if(response.status=="KPI_LIST_EMPTY"){
					$('#departmentSearchKpisDiv').hide(600);
					$('#departmentEmptyKpisDiv').show(600);
					$('#loadMaskDiv').unmask();
				}else{
					$('#loadMaskDiv').mask(response.errorMessage);
				}
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"************"+response.statusText);
			}
		});
		return false;
		
	}
	
	/*Getting KPI(s) by department type---------------------------------------------------------------------->*/
	$('#add-kpis').click(function(){
	    $('#departmentKpis option:selected').each( function() {
	            $('#selectedDepartmentKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	        $(this).remove();
	    });
	});
	$('#remove-added-kpis').click(function(){
	    $('#selectedDepartmentKpis option:selected').each( function() {
	        $('#departmentKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	        $(this).remove();
	    });
	});
	
	function resetDepartmentKpis(){
		$('#selectedDepartmentKpis option').each(function(){
			$('#departmentKpis').append('<option value="'+$(this).val()+'">'+$(this).text()+'</option>');
			$(this).remove();
		});
	}
	/*Disabling Button------------------------------------------------------------------------------>*/	
	function disableButton(){
		var selectedOrganizationBrandId = $('#addOrganization-organizationBrandId option:selected').val();
		var selectedOrganizationNameId = $('#addDepartment-organizationNameId option:selected').val();
		var selectedDepartmentTypeId = $('#add-department-departmentTypeId option:selected').val();
		if(selectedOrganizationBrandId==0 ||selectedOrganizationNameId==0 ||selectedDepartmentTypeId==0){
			$('button[type=submit]', $('#addDepartmentForm')).prop('disabled', true);
		}else{
			$('button[type=submit]', $('#addDepartmentForm')).prop('disabled', false);
		}
	}
	/* Save Department----------------- GHN_DEPARTMENT---------------------------------------->*/
	$('#addDepartmentForm').unbind('submit').bind('submit',function(){
		$('#addDepartmentErrorDiv').hide();
		$('#addDepartmentSuccessDiv').hide();
		$('.help-inline').empty();
		$('.form-group').removeClass('has-error has-feedback');
		$('#loadMaskDiv').mask('Loading...');
		var departmentName = $.trim($('#departmentName').val());
		var organizationNameId = $('#addDepartment-organizationNameId option:selected').val();
		var departmentTypeId = $('#add-department-departmentTypeId option:selected').val();
		var selectedKpis = $('#selectedDepartmentKpis > option').length;
		var attributesLength = $('#attributesLength').val();
		var departmentAttributes = [];
		var departmentKPIs = [];
		if(selectedKpis>0){
			$('#selectedDepartmentKpis option').each(function() { 
				var kpiId = $(this).val();
				departmentKPIs.push({'kpiIds':kpiId});
			});
		}
		if(attributesLength>0){
			for(var i=0;i<attributesLength;i++){
				var attributeKeyId = $('#attributeKeyId_'+i).val();
				var attributeKeyValue = $('#attributeKeyValue_'+i).val();
				departmentAttributes.push({'attributeKeyId':attributeKeyId,'attributeValue':attributeKeyValue});
			}
		}
		var departmentJSONObject = {'departmentName':departmentName,'organizationId':organizationNameId,'departmentTypeId':departmentTypeId,'attributeMappings':departmentAttributes,'departmentKPIs':departmentKPIs};
					
		console.log(departmentJSONObject);
		$.ajax({
			type:"POST",
			url:"../organization/saveAddDepartment.htm",
			contentType:"application/json",
			data:JSON.stringify(departmentJSONObject),
			success:function(response){
				if(response.status=="SAVE_ERROR"){
					$('#loadMaskDiv').scrollTop("0");
					$('#addDepartmentErrorDiv').show(600);
					$('#Add-departmentName-Error').addClass('has-error has-feedback');
					$('#departmentName-span-Error').html(response.errorMessage);
					$('#loadMaskDiv').unmask();
				}else if(response.status=="SAVE_SUCCESS"){
					console.log(departmentJSONObject);
					$('#addDepartmentSuccessDiv').show(600);
					resetDepartmentKpis();
					$('#addDepartmentForm').trigger("reset");
					$('#loadMaskDiv').unmask();
				}else{
					$('#loadMaskDiv').mask(response.errorMessage);
				}
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"***********"+response.statusText);
			}
		});
		return false;
	});
