/* Function for all tabs

function reviewAge() {
		window.location.href = "../configuration/addReviewAge.htm";
	}

===================First Tab===================Save Review Age============================================

$('#reviewAgeForm').unbind().bind('submit',function(){
	$.ajaxSetup({ cache: false });
	$('#newReviewAge').mask('Loading...');
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#reviewAgeSuccessDiv').hide();
	$('#reviewAgeErrorDiv').hide();
	
	var name = $.trim($('#reviewName').val());
	var startDay = $.trim($('#reviewStartDay').val());
	var endDay = $.trim($('#reviewEndDay').val());
	var value = $.trim($('#reviewValue').val());
	
	var JSONObject = {'name':name,'startDay':startDay,'endDay':endDay,'value':value};
	console.log(JSONObject);
	$.post("../configuration/saveReviewAge.htm",JSONObject,function(response){
		if(response.status=="SAVE_SUCCESS"){
			$('#reviewAgeSuccessDiv').show(600);
			$('#addCountryForm').trigger("reset");
			$('#reviewAgeErrorDiv').unmask();
		}else if(response.status=="SAVE_ERROR"){
			$('#reviewAgeErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#newReviewAge').unmask();
		}else if(response.status=="EXCEPTION_ERROR"){
			$('#newReviewAge').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#newReviewAge').mask(response.status+"*************"+response.statusText);
	});
	return false;
});


var count=0;
function addAnotherReviewAge()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group col-sm-12" id="myTable" border="1">'
	+'<div id="review_'+count+'">'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.name"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text" id = "eewe_'+count+'"'
	+'		class="form-control" placeholder="name" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.max"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="greater key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.mini"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text"'
	+'		class="form-control" placeholder="less key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.value"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="value" />'
	+'</div>'
	+'</div>'
	+'<div class="col-sm-2">'
	+' <input type="button" class="btn btn-default" onclick="deleteReviewAge()" value="X" />'
	+'</div>'
	+'</div>'
	+'</div>';
	$("#review").append(html);
}

function deleteReviewAge()
{
	$("#review_"+count).remove();
	$("#removeBox"+count).remove();
	count--;
}

function addAnotherOrganizationVolume()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group col-sm-12" id="myTable" border="1">'
	+'<div id="organizationVolume_'+count+'">'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.name"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text"'
	+'		class="form-control" placeholder="name" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.max"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="greater key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.mini"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text"'
	+'		class="form-control" placeholder="less key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.value"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="value" />'
	+'</div>'
	+'</div>'
	+'<div class="col-sm-2">'
	+' <input type="button" class="btn btn-default" onclick="deleteOrganizationVolume()" value="X" />'
	+'</div>'
	+'</div>'
	+'</div>';
	$("#organizationVolume").append(html);
}

function deleteOrganizationVolume()
{
	$("#organizationVolume_"+count).remove();
	$("#removeBox"+count).remove();
	count--;
}

function addAnotherSourcePopularity()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group col-sm-12" id="myTable" border="1">'
	+'<div id="sourcePopularity_'+count+'">'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.name"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text"'
	+'		class="form-control" placeholder="name" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.max"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="greater key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.mini"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text"'
	+'		class="form-control" placeholder="less key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.value"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="value" />'
	+'</div>'
	+'</div>'
	+'<div class="col-sm-2">'
	+' <input type="button" class="btn btn-default" onclick="deleteSourcePopularity()" value="X" />'
	+'</div>'
	+'</div>'
	+'</div>';
	$("#sourcePopularity").append(html);
}

function deleteSourcePopularity()
{
	$("#sourcePopularity_"+count).remove();
	$("#removeBox"+count).remove();
	count--;
}

function addAnotherSourceVolume()
{
	count=count+1;  
	var html="";
	html+='<div class="form-group col-sm-12" id="myTable" border="1">'
	+'<div id="sourceVolume_'+count+'">'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.name"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text"'
	+'		class="form-control" placeholder="name" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.max"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="greater key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<div class="left-inner-addon">'
	+'	<label><spring:message code="label.configuration.mini"></spring:message></label>'
	+'	<i class="icon-user"></i> <input type="text"'
	+'		class="form-control" placeholder="less key" />'
	+'</div>'
	+'</div>'
	+'<div class="col-xs-3">'
	+'<label><spring:message code="label.configuration.value"></spring:message></label>'
	+'<div class="right-inner-addon">'
	+'	<i class="icon-text"></i> <input type="text"'
	+'		class="form-control" placeholder="value" />'
	+'</div>'
	+'</div>'
	+'<div class="col-sm-2">'
	+' <input type="button" class="btn btn-default"  onclick="deleteSourceVolume()" value="X" />'
	+'</div>'
	+'</div>'
	+'</div>';
	$("#sourceVolume").append(html);
}

function deleteSourceVolume()
{
	$("#sourceVolume_"+count).remove();
	$("#removeBox"+count).remove();
	count--;
}*/