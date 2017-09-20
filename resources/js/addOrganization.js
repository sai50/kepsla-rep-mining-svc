	
/***********************************************************************************************
 * 				Organization Brand Values
 ************************************************************************************************/
	function getOrganizationBrand(){
		$('#loadMaskDiv').mask('Loading...');
		var selectedOrganizationGroupId = $('#addOrganization-organizationGroupId option:selected').val();
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
		$('#addOrganizationForm').find('#organizationBrandDropDownDiv').removeClass('has-error has-feedback');
		$('#addOrganization-organizationBrandId').prop('disabled',false);
		$.ajax({
			type:"POST",
			url:"../organization/getOrganizationBrandList.htm",
			contentType:"application/json",
			data:JSON.stringify(selectedOrganizationGroupId),
			success:function(response){
				$('#addOrganization-organizationBrandId').html('');//Clearing Dependent Dropdown Values
				if(response.status=="ORGANIZATION_BRANDS_LIST_SUCCESS"){
					var organizationBrands = response.successObject.organizationBrands;
					for(var i=0;i<organizationBrands.length;i++){
						$('#addOrganization-organizationBrandId').append('<option value='+organizationBrands[i].id+'>'+organizationBrands[i].organizationBrandName+'</option>');
					}
					disableButton();
					$('#loadMaskDiv').unmask();
				}else if(response.status=="EXCEPTION_ERROR"){
					$('#loadMaskDiv').mask(response.errorMessage);
				}else{
					$('#addOrganizationForm').find('#organizationBrandDropDownDiv').addClass('has-error has-feedback');
					var message = '<font style="color:red">No Organization Brands Found</font>';
					$('#addOrganization-organizationBrandId').append('<option value="0">'+message+'</option>');
					$('#addOrganization-organizationBrandId').prop('disabled',true);//Disable Dependent DropDown
					$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
					$('#loadMaskDiv').unmask();
					
				}
				
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
			}
		});
	}
/***********************************************************************************************
	 * 				Segment  Category Values 
 ************************************************************************************************/
	function getSegmentCategory(){
		$('#loadMaskDiv').mask('Loading...');
		var selectedIndustryTypeId = $('#addOrganization-industryTypeId option:selected').val();
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
		$('#addOrganizationForm').find('#addOrganization-segmentCategory-DropDownDiv,#addOrganization-organizationType-DropDownDiv').removeClass('has-error has-feedback');
		$('#addOrganization-segmentCategoryId').prop('disabled',false);//Enabling Segment Category DropDown
		$('#addOrganization-organizationCategoryId').prop('disabled',false);//Enabling Organization Category DropDown
		$.ajax({
			type:"POST",
			url:"../organization/getSegmentCategoryList.htm",
			contentType:"application/json",
			data:JSON.stringify(selectedIndustryTypeId),
			success:function(response){
				$('#addOrganization-segmentCategoryId').html('');
				$('#addOrganization-organizationCategoryId').html('');
				if(response.status=="SEGMENT_CATEGORIES_LIST_SUCCESS"){
					var segmentCategoires = response.successObject.segmentCategoires;
					for(var i=0;i<segmentCategoires.length;i++){
						$('#addOrganization-segmentCategoryId').append('<option value='+segmentCategoires[i].id+'>'+segmentCategoires[i].segmentCategory+'</option>');
					}
					getOrganizationCategory();//Getting Organization Category DropDown Values
					disableButton();
					getKpis();
					$('#loadMaskDiv').unmask();
					
				}else if(response.status=="EXCEPTION_ERROR"){
						$('#loadMaskDiv').mask(response.errorMessage);
				}else{
					$('#addOrganizationForm').find('#addOrganization-segmentCategory-DropDownDiv,#addOrganization-organizationType-DropDownDiv').addClass('has-error has-feedback');
					var message = '<font style="color:red">No Segment Categories Found</font>';
					var emptyOrganizationCategory = '<font style="color:red">No Organization Categories Found</font>';
					$('#addOrganization-segmentCategoryId').append('<option>'+message+'</option>');
					$('#addOrganization-organizationCategoryId').append('<option value="0">'+emptyOrganizationCategory+'</option>');
					$('#addOrganization-segmentCategoryId,#addOrganization-organizationCategoryId').prop('disabled',true);
					$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
					getKpis();//Getting Associated KPIS
					getAttributes();//Getting Attributes
					$('#loadMaskDiv').unmask();
				}
				
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
			}
		});
	}
/***********************************************************************************************
	 * 				Organization  Category Values 
 ************************************************************************************************/
	function getOrganizationCategory(){
		$('#loadMaskDiv').mask('Loading...');
		var selectedSegementCategoryId = $('#addOrganization-segmentCategoryId option:selected').val();
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
		$('#addOrganizationForm').find('#addOrganization-organizationType-DropDownDiv').removeClass('has-error has-feedback');
		$('#addOrganization-organizationCategoryId').prop('disabled',false);//Enabling Organization Category DropDown
		$.ajax({
			type:"POST",
			url:"../organization/getOrganizationTypeList.htm",
			contentType:"application/json",
			data:JSON.stringify(selectedSegementCategoryId),
			success:function(response){
				$('#addOrganization-organizationCategoryId').html('');//Clearing Organization Category DropDown Value
				if(response.status=="ORGANIZATION_TYPES_LIST_SUCCESS"){
					var organizationTypes = response.successObject.organizationTypes;
					for(var i=0;i<organizationTypes.length;i++){
						$('#addOrganization-organizationCategoryId').append('<option value='+organizationTypes[i].id+'>'+organizationTypes[i].organizationType+'</option>');
					}
					disableButton();
					getDepartmentTypes();//Get Department Types
					getAttributes();//Getting Attributes
					$('#loadMaskDiv').unmask();
				}else if(response.status=="ORGANIZATION_TYPES_LIST_EMPTY"){
					$('#addOrganizationForm').find('#addOrganization-organizationType-DropDownDiv').addClass('has-error has-feedback');
					var emptyOrganizationCategory = '<font style="color:red">No Organization Categories Found</font>';
					$('#addOrganization-organizationCategoryId').append('<option value="0">'+emptyOrganizationCategory+'</option>');
					$('#addOrganization-organizationCategoryId').prop('disabled',true);
					$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
					$('#loadMaskDiv').unmask();
					getDepartmentTypes();//Get Department Types
					getAttributes();//Getting Attributes
				}else{
					$('#loadMaskDiv').mask(response.errorMessage);
				}
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
			}
		});
	}
/***********************************************************************************************
	 * 				City  DropDown Values
 ***********************************************************************************************/	
	function getCities(){
		$('#loadMaskDiv').mask('Loading...');
		var selectedOrganizationCountryId = $('#add-organization-CountryId option:selected').val();
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
		$('#addOrganizationForm').find('#organizationCitiesDropDownDiv,#organizationAreasDropDownDiv').removeClass('has-error has-feedback');
		$('#add-organization-CityId').prop('disabled',false);
		$('#add-organization-AreaId').prop('disabled',false);
		$.ajax({
			type:"POST",
			url:"../GeoArea/getCitiesByCountryId.htm",
			contentType:"application/json",
			data:JSON.stringify(selectedOrganizationCountryId),
			success:function(response){
				$('#add-organization-CityId').html('');
				$('#add-organization-AreaId').html('');
				if(response.status=="LIST_CITIES_SUCCESS"){
					var listCities = response.successObject.listCities;
					for(var i=0;i<listCities.length;i++){
						$("#add-organization-CityId").append("<option value="+listCities[i].id+">"+listCities[i].geoCityName+"</option>");
					}
					getAreas();
					disableButton();
				}else if(response.status=="EXCEPTION_ERROR"){
					$('#loadMaskDiv').mask(response.errorMessage);
				}else{
					$('#addOrganizationForm').find('#organizationCitiesDropDownDiv','#organizationAreasDropDownDiv').addClass('has-error has-feedback');
					var message = '<font style="color:red">No Cities Found</font>';
					var emptyAreaMessage = '<font style="color:red">No Areas Found</font>';
					$('#add-organization-AreaId').append('<option value="0">'+emptyAreaMessage+'</option>');
					$('#add-organization-CityId').append('<option value="0">'+message+'</option>');
					$('#add-organization-AreaId,#add-organization-CityId').prop('disabled',true);
					$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
					locationsByAreaId();
				}
				$('#loadMaskDiv').unmask();
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
			}
		});
	}
/***********************************************************************************************
	 * 				Area DropDown Values
 ***********************************************************************************************/
	function getAreas(){
		$('#loadMaskDiv').mask('Loading...');
		var selectedOrganizationGeoAreaId = $('#add-organization-CityId option:selected').val();
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
		$('#addOrganizationForm').find('#organizationAreasDropDownDiv').removeClass('has-error has-feedback');
		$('#add-organization-AreaId').prop('disabled',false);
		$.ajax({
			type:"POST",
			url:"../GeoLocation/getAreasByCityId.htm",
			contentType:"application/json",
			data:JSON.stringify(selectedOrganizationGeoAreaId),
			success:function(response){
				$('#add-organization-AreaId').html('');
				if(response.status=="AREAS_LIST_SUCCESS"){
					var listAreas = response.successObject.listAreas;
					for(var i=0;i<listAreas.length;i++){
						$("#add-organization-AreaId").append("<option value="+listAreas[i].id+">"+listAreas[i].geoAreaName+"</option>");
						$('#loadMaskDiv').unmask();
					}
					disableButton();
					locationsByAreaId();//Adding Data To Search Locations
				}else if(response.status=="EXCEPTION_ERROR"){
					$('#loadMaskDiv').mask(response.errorMessage);
				}else{
					$('#addOrganizationForm').find('#organizationAreasDropDownDiv').addClass('has-error has-feedback');
					var message = '<font style="color:red">No Areas Found</font>';
					$('#add-organization-AreaId').append('<option value="0">'+message+'</option>');
					$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
					$('#add-organization-AreaId').prop('disabled',true);
					locationsByAreaId();
				}
				$('#loadMaskDiv').unmask();
				
			},error:function(response){
				$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
			}
		});

	}
/***********************************************************************************************
	 * 				Search Locations 
 ***********************************************************************************************/	
function locationsByAreaId(){
	var selectedOrganizationAreaId = $('#add-organization-AreaId option:selected').val();
	$('#loadMaskDiv').mask('Loading...');
	$.ajax({
		type:"POST",
		url:"../organization/getLocationsByAreaId.htm",
		data:JSON.stringify(selectedOrganizationAreaId),
		contentType:"application/json",
		success:function(response){
			$('#organizationLocations').html('');
			$('#organizationAreaLocations').html('');
			$('#selectedOrganizationAreaLocations').html('');
			if(response.status=="LOCATIONS_LIST_SUCCESS"){
				$('#organizationEmptyLocationsDiv').hide(600);
				var locations = response.successObject.locations;
				for(var i=0;i<locations.length;i++){
					$('#organizationLocations').append('<option value='+locations[i].geoName+'>'+locations[i].id+'</option>');
					$('#organizationAreaLocations').append('<option value='+locations[i].id+'>'+locations[i].geoName+'</option>');
					$('#organizationSearchLocationsDiv').show(600);
				}
				$('#loadMaskDiv').unmask();
			}else if(response.status=="LOCATIONS_EMPTY"){
				$('#organizationLocations').append('<option>No Locations Found</option>');
				$('#organizationAreaLocations').append('<option>No Locations Found</option>');
				$('#organizationSearchLocationsDiv').hide(600);
				$('#organizationEmptyLocationsDiv').show(600);
				$('#loadMaskDiv').unmask();
			}else{
				$('#loadMaskDiv').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"**************"+response.statusText);
		}
	});
	return false;
}
/***********************************************************************************************
 * 				Search KPI(s) 
***********************************************************************************************/	
function getKpis(){
	var selectedIndustryTypeId = $('#addOrganization-industryTypeId option:selected').val();
	$('#loadMaskDiv').mask('Loading...');
	$.ajax({
		type:"POST",
		url:"../organization/getKpisByIndustryTypeId.htm",
		data:JSON.stringify(selectedIndustryTypeId),
		contentType:"application/json",
		success:function(response){
			$('#organizationKpisDataList').html('');
			$('#organizationKpis').html('');
			$('#selectedOrganizationKpis').html('');
			if(response.status=="KPI_LIST_SUCCESS"){
				$('#organizationEmptyKpisDiv').hide(600);
				$('#organizationSearchKpisDiv').show(600);
				var kpis = response.successObject.kpiList;
				for(var i=0;i<kpis.length;i++){
					$('#organizationKpisDataList').append('<option value='+kpis[i].kpiName+'>'+kpis[i].id+'</option>');
					$('#organizationKpis').append('<option value='+kpis[i].id+'>'+kpis[i].kpiName+'</option>');
				}
				$('#loadMaskDiv').unmask();
			}else if(response.status=="KPI_LIST_EMPTY"){
				$('#organizationSearchKpisDiv').hide(600);
				$('#organizationEmptyKpisDiv').show(600);
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


/***********************************************************************************************
 * 				Disable Button 
***********************************************************************************************/	
function disableButton(){
	var selectedOrganizationBrandId = $('#addOrganization-organizationBrandId option:selected').val();
	var selectedSegmentCategoryId = $('#addOrganization-segmentCategoryId option:selected').val();
	var selectedOrganizationCategoryId = $('#addOrganization-organizationCategoryId option:selected').val();
	var selectedCityId = $('#add-organization-CityId option:selected').val();
	var selectedAreaId = $('#add-organization-AreaId option:selected').val();
	if(selectedOrganizationBrandId==0 ||selectedSegmentCategoryId==0 ||selectedOrganizationCategoryId==0 ||selectedCityId==0|| selectedAreaId==0){
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
	}else{
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
	}
	
}	
/***********************************************************************************************
 * 				DepartmentType & AttriButes 
***********************************************************************************************/
function getDepartmentTypes(){
	var selectedOrganizationTypeId = $('#addOrganization-organizationCategoryId option:selected').val();
	$('#loadMaskDiv').mask('Loading...');
	$('#add-organization-departmentTypeId').prop('disabled',false);
	$('#addOrganizationForm').find('#organizationDepartmentTypeDropDownDiv').removeClass('has-error has-feedback');
	$.ajax({
		type:"POST",
		url:"../organization/getDepartmentTypes.htm",
		data:JSON.stringify(selectedOrganizationTypeId),
		contentType:"application/json",
		success:function(response){
			$('#add-organization-departmentTypeId').html('');
			if(response.status=="DEPARTMENTS_LIST_EMPTY"){
				$('#addOrganizationForm').find('#organizationDepartmentTypeDropDownDiv').addClass('has-error has-feedback');
				var message = '<font style="color:red">No Department Types Found For Selected Organization Type</font>';
				$('#add-organization-departmentTypeId').append('<option value="0">'+message+'</option>');
				$('#add-organization-departmentTypeId').prop('disabled',true);
				$('#loadMaskDiv').unmask();
				getAttributes();
			}else if(response.status=="DEPARTMENTS_LIST_SUCCESS"){
				var departmentTypes = response.successObject.departmentCategories;
				for(var i=0;i<departmentTypes.length;i++){
					$('#add-organization-departmentTypeId').append('<option value='+departmentTypes[i].id+'>'+departmentTypes[i].departmentType+'</option>');
				}
				getAttributes();
				$('#loadMaskDiv').unmask();
			}
			else{
				$('#loadMaskDiv').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"************"+response.statusText);
		}
		
	});
	return false;
}
/***********************************************************************************************
 * 				AttriButes 
***********************************************************************************************/
function getAttributes(){
	var selectedOrganizationTypeId = $('#addOrganization-organizationCategoryId option:selected').val();
	$('#loadMaskDiv').mask('Loading...');
	$.ajax({
		type:"POST",
		url:"../organization/getAttributes.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedOrganizationTypeId),
		success:function(response){
			if(response.status=="ATTRIBUTES_LIST_SUCCESS"){
				$('#loadMaskDiv').unmask();
				$('#attributesEmptyDiv').hide(600);
				$('#attributesDiv').html('');
				var attributes = response.successObject.attributes;
				var html = "";
				html+=	'<input type="hidden" id="attributesLength" value='+attributes.length+'>';
				for(var i=0;i<attributes.length;i++){
					html+=	'<div class="form-group">';
					html+=	'<label>'+attributes[i].attributeKey+'</label>';
					html+=	'<input type="text" class="form-control" placeholder = "Enter '+attributes[i].attributeKey+'" maxLentgh=50 id=attributeKeyValue_'+i+'>';
					html+=	'<input type="hidden" id="attributeKeyId_'+i+'" value="'+attributes[i].id+'">';
				}
				$('#attributesDiv').append(html);
				$('#attributesDiv').show(600);
			}else if(response.status=="ATTRIBUTES_LIST_EMPTY"){
				$('#attributesDiv').hide(600);
				$('#attributesEmptyDiv').show(600);
				$('#loadMaskDiv').unmask();
			}
		},error:function(response){
			$('#loadMaskDiv').mask(response.status+"*************"+response.statusText);
		}
	});
	return false;
}
/***********************************************************************************************
 * 				Multi Select Location
***********************************************************************************************/
$('#add-locations').click(function(){
    $('#organizationAreaLocations option:selected').each( function() {
            $('#selectedOrganizationAreaLocations').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
    });
});
$('#remove-added-locations').click(function(){
    $('#selectedOrganizationAreaLocations option:selected').each( function() {
        $('#organizationAreaLocations').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
    });
});
/***********************************************************************************************
 * 				Multi KPI(s)
***********************************************************************************************/
$('#add-kpis').click(function(){
    $('#organizationKpis option:selected').each( function() {
            $('#selectedOrganizationKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
    });
});
$('#remove-added-apis').click(function(){
    $('#selectedOrganizationKpis option:selected').each( function() {
        $('#organizationKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
    });
});
/***********************************************************************************************
 * 				Save Organization
***********************************************************************************************/
$('#addOrganizationForm').unbind('submit').bind('submit',function(){
	$('#addOrganizationErrorDiv').hide();
	$('#addOrganizationSuccessDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#loadMaskDiv').mask('Loading...');
	var organizationFullName = $.trim($('#organizationFullName').val());
	var organizationTypeId = $('#addOrganization-organizationCategoryId option:selected').val();
	var organizationBrandId = $('#addOrganization-organizationBrandId option:selected').val();
	var geoAreaId = $('#add-organization-AreaId option:selected').val();
	var industryTypeId = $('#addOrganization-industryTypeId option:selected').val();
	var selectedLocations = $('#selectedOrganizationAreaLocations > option').length;
	var selectedKpis = $('#selectedOrganizationKpis > option').length;
	var attributesLength = $('#attributesLength').val();
	var organizationAttributes = [];
	var organizationKPIs = [];
	var geoLocations = [];
	if(selectedLocations>0){
		$('#selectedOrganizationAreaLocations option').each(function(){
			var geoNameId = $(this).val();
			geoLocations.push({'geoNameId':geoNameId});
		});
	}
	if(selectedKpis>0){
		$('#selectedOrganizationKpis option').each(function() { 
			var kpiId = $(this).val();
			organizationKPIs.push({'kpiId':kpiId});
		});
	}
	
	if(attributesLength>0){
		for(var i=0;i<attributesLength;i++){
			var attributeKeyId = $('#attributeKeyId_'+i).val();
			var attributeKeyValue = $('#attributeKeyValue_'+i).val();
			organizationAttributes.push({'attributeKeyId':attributeKeyId,'attributeValue':attributeKeyValue});
		}
	}
	
	var organizationJSONObject = {'organizationFullName':organizationFullName,'organizationTypeId':organizationTypeId,'organizationBrandId':organizationBrandId,'industryTypeId':industryTypeId,
								  'geoAreaId':geoAreaId,'organizationKPIs':organizationKPIs,'organizationAttributes':organizationAttributes,'geoLocations':geoLocations};
				
	
	console.log(organizationJSONObject);
	$.ajax({
		type:"POST",
		url:"../organization/saveOrganization.htm",
		contentType:"application/json",
		data:JSON.stringify(organizationJSONObject),
		success:function(response){
			if(response.status=="SAVE_ERROR"){
				$('#loadMaskDiv').scrollTop("0");
				$('#addOrganizationErrorDiv').show(600);
				$('#Add-organizationDisplayName-Error').addClass('has-error has-feedback');
				$('#organizationFullName-span-Error').html(response.errorMessage);
				$('#loadMaskDiv').unmask();
			}else if(response.status=="SAVE_SUCCESS"){
				$('#addOrganizationSuccessDiv').show(600);
				resetOrganizationKpis();
				resetOrganizationLocations();
				$('#addOrganizationForm').trigger("reset");
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

function resetOrganizationLocations(){
	$('#selectedOrganizationKpis option').each(function(){
		$('#organizationAreaLocations').append('<option value="'+$(this).val()+'">'+$(this).text()+'</option>');
		$(this).remove();
	});
}
function resetOrganizationKpis(){
	$('#selectedOrganizationAreaLocations option').each(function(){
		$('#locationTypes').append('<option value="'+$(this).val()+'">'+$(this).text()+'</option>');
		$(this).remove();
	});
}
