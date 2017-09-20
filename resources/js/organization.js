var organizationGroupUrl = "../organizationGroup/";
var trCount = 1;
var geoCountryUrl = "../geoCountry/";
var geoCityUrl = "../geoCity/";
var geoAreaUrl = "../geoArea/";
var geoLocationTypeUrl = "../geoLocationType/";
var geoLocationUrl = "../geoLocation/";
var counter = 1;
var orgBrandData;

/*************Start of Design For filter buttons**********manoj************* */

function listOrganizationGroupButtonClick(){
		$('#page-wrapper').mask('Loading...');
		 $("#orgGroupFilterButtons").html('');
		 $("#organizationGroupDataDiv").html('');
		   $(".alert").hide();
		   
		   $("#addAndEditOrganizationGroupDiv").hide();
			$("#addAndEditDepartmentDiv").hide();
			$("#addAndEditOrganizationDiv").hide();
			
			$("#departmentListTable_wrapper").hide();
			$("#organizationListTable_wrapper").hide();
			$("#organizationGroupListTable_wrapper").hide();
		
		 
		 $("#dropsDiv").hide();
		 $("#drops").hide();
		 $("#orgGroupFilterButtons").show();
		 

		
		$.get(organizationGroupUrl+"selectOrgGroup.htm",function(response){
			if(response.status=="LIST_SUCCESS"){
				var organizationGroupList = response.successObject.organizationGroupList;
				
		var html="";
		//html+=	'<div id="orgGroupFilterButtons">';
		html+=	'<form id="listOrganizationGroupForm" class="form-inline col-xs-12 SubHeading AdminMainActivity">';
		html+= '<div>';
		html+= '<label id="selectOrgGroupName" class="control-label" style="width:355px" for="selectOrgGroupName">OrgGroupName <select id="selectOrgGroupNameId" onchange="orgBrandNameList()"  class="form-control input-sm" style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;" >';
		html+= '<option value="0">All</option>';
		for(var i=0;i<organizationGroupList.length;i++){
			html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationGroupName)+'</option>';
			
			} 
		html+= '</select>';
		html+= '</label>';
		
		html+=' <label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" disabled  class="form-control input-sm"  style="width:  220px; float: right; margin-right: 40px; margin-top: -5px;">';
		html+='<option value="0">All</option>';
		html+= '</select>';
		html+= '</label>';
		html+= '</div>';
		html+= '</br>';
		
		html+=' <label id="orgGroupID" class="control-label" style="width:355px" for="orgGroupID">OrgGroupID &nbsp;&nbsp;<select id="selectOrgGroupId" onchange="orgGroupNameList()" class="form-control input-sm"  style="width:  220px; float: right; margin-right: 40px; margin-top: -5px;">';
		html+='<option value="0">All</option>';
		for(var i=0;i<organizationGroupList.length;i++){
			html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
			} 
		html+= '</select>';
		html+= '</label>';
		html+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId" disabled class="form-control input-sm"  style="width:  220px; float: right; margin-right: 40px; margin-top: -5px;">';
		html+='<option value="0">All</option>';
		html+= '</select>';
		html+= '</label>';
		
		html+='<input type="button" class="btn btn-primary btn-sm" id="viewList" onclick="listOrganizationGroupTabClick()" value="View">';
		
		
		html+=		'<div class="form-group float-right">';
		html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteOrganizationGroup()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
		html+=			'<a onclick="addOrganizationGroup()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
		html+=		'</div>';
		html+=		'</form>';
		//html+=	'</div>';
		$('#page-wrapper').unmask();
		$("#orgGroupFilterButtons").append(html);
			}else{
				$('#organizationGroupDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
			}
		
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		});
		 }

/*manoj*/
function orgBrandNameList(){
	$('#page-wrapper').mask('Loading...');
	var orgGroupNameId=$('#selectOrgGroupNameId option:selected').val();
	//var orgBrandNameId=$('#selectOrgBrandNameId option:selected').val();
	//var orgBrandId=$('#selectOrgBrandId option:selected').val();
	var orgGroupId=$('#selectOrgGroupId option:selected').val();
	
	$.ajaxSetup({ cache: false });
	$('#selectOrgBrandName').html('');
	$('#orgGroupID').html('');
	$('#orgBrandID').html('');
	
	$.get("../organizationGroup/brandList.htm?orgGroupNameId="+orgGroupNameId+"&orgBrandNameId="+orgGroupId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var organizationGroupList = response.successObject.organizationGroupList;
			var html='';
			$.get(organizationGroupUrl+"selectOrgGroup.htm",function(response){
				if(response.status=="LIST_SUCCESS"){
					var organizationGroupList = response.successObject.organizationGroupList;
					if(orgGroupNameId==0){
						html+='<label id="orgGroupID" class="control-label" style="width:355px" for="orgGroupID">OrgGroupID <select id="selectOrgGroupId" onchange="orgGroupNameList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
						html+='<option value="0">All</option>';	
						for(var i=0;i<organizationGroupList.length;i++){
							html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
							}
						html+= '</select>';
						html+= '</label>';
						$('#orgGroupID').append(html);
						 $('#page-wrapper').unmask();
					}else{
			            html+='<label id="orgGroupID" class="control-label" style="width:355px" for="orgGroupID">OrgGroupID <select id="selectOrgGroupId" onchange="orgGroupNameList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
			            html+='<option value="'+orgGroupNameId+'">'+$.trim(orgGroupNameId)+'</option>';
			                for(var i=0;i<organizationGroupList.length;i++){
			                	var id=organizationGroupList[i].id;
			                	if(id == orgGroupNameId){
			                		organizationGroupList.splice(i,1);
			                	}
					    html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
			        		} 
			           html+='<option value="0">All</option>';	
			           html+= '</select>';
			           html+= '</label>';
			         $('#orgGroupID').append(html);
			         $('#page-wrapper').unmask();
			         }
				}else{
					$('#organizationGroupDataDiv').append('<font style="color:red">'+response.errorMessage+'</font>');
				}
			});
			var html1='';
			html1+='<label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" onchange="orgBrandIdList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
			html1+='<option value="0">All</option>';
			for(var i=0;i<organizationGroupList.length;i++){
				html1+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationBrandName)+'</option>';
				}
			html1+='</select>';
			html1+='</label>';	
			$('#selectOrgBrandName').append(html1);
			
			var html2='';
			html2+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId" onchange="orgBrandNameOnId()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
			html2+='<option value="0">All</option>';
			for(var i=0;i<organizationGroupList.length;i++){
				html2+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
				}
			html2+= '</select>';
			html2+= '</label>';
			$('#orgBrandID').append(html2);	
			//$('#page-wrapper').unmask();
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}
/*manoj*/
function orgBrandIdList(){
	$('#page-wrapper').mask('Loading...');
	//var orgGroupNameId=$('#selectOrgGroupNameId option:selected').val();
	var orgBrandNameId=$('#selectOrgBrandNameId option:selected').val();
	var orgBrandId=$('#selectOrgBrandId option:selected').val();
	var orgGroupId=$('#selectOrgGroupId option:selected').val();
	
	$.ajaxSetup({ cache: false });
	$('#orgBrandID').html('');
	$('#selectOrgBrandName').html('');
	$.get("../organizationGroup/brandList.htm?orgGroupNameId="+orgGroupId+"&orgBrandNameId="+orgBrandId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var organizationGroupList = response.successObject.organizationGroupList;
			console.log(organizationGroupList);
			var html='';
			//For all the four elements orgBrandName, orgBrandID
			for(var i=0;i<organizationGroupList.length;i++){
				html='';
				if(orgBrandNameId==organizationGroupList[i].id){
					var orgBrandName=organizationGroupList[i].organizationBrandName;
					html+='<label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" onchange="orgBrandIdList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
					html+='<option value="'+orgBrandName+'">'+$.trim(orgBrandName)+'</option>';
						for(var j=0;j<organizationGroupList.length;j++){
							 var brandName=organizationGroupList[j].organizationBrandName;
			                	if(brandName == orgBrandName){
			                		continue;
			                	}
				    html+='<option value="'+organizationGroupList[j].id+'">'+$.trim(organizationGroupList[j].organizationBrandName)+'</option>';
						}
					html+='<option value="0">All</option>';
					html+='</select>';
					html+='</label>';	
					$('#selectOrgBrandName').append(html);
					
					var html1='';
					html1+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId" onchange="orgBrandNameOnId()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
					html1+='<option value="'+orgBrandNameId+'">'+$.trim(orgBrandNameId)+'</option>';
				         for(var i=0;i<organizationGroupList.length;i++){
				        	 var brandId=organizationGroupList[i].id;
			                	if(brandId == orgBrandNameId){
			                		continue;
			                	}
					      html1+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
					}
				    html1+='<option value="0">All</option>';
				    html1+= '</select>';
				    html1+= '</label>';
				    $('#orgBrandID').append(html1);
				
				}else if(orgBrandNameId==0){
					var html1='';
					html1+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId"  onchange="orgBrandNameOnId()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
					html1+='<option value="0">All</option>';
					for(var i=0;i<organizationGroupList.length;i++){
						html1+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
						}
					html1+= '</select>';
					html+= '</label>';
					$('#orgBrandID').append(html1);	
					
					var html='';
					html+='<label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" onchange="orgBrandIdList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
					html+='<option value="0">All</option>';
						for(var i=0;i<organizationGroupList.length;i++){
						html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationBrandName)+'</option>';
						}
					
					html+='</select>';
					html+='</label>';	
					
					$('#page-wrapper').unmask('Loading...');
					$('#selectOrgBrandName').append(html);
				}
				   $('#page-wrapper').unmask('Loading...');
				}
				
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}

function orgGroupNameList(){
	$('#page-wrapper').mask('Loading...');
	var orgGroupId=$('#selectOrgGroupId option:selected').val();
	//var orgGroupNameId=$('#selectOrgGroupNameId option:selected').val();
	$.ajaxSetup({ cache: false });
	$('#selectOrgBrandName').html('');
	$('#selectOrgGroupName').html('');
	$('#orgGroupID').html('');
	$('#orgBrandID').html('');
	
	$.get(organizationGroupUrl+"selectOrgGroup.htm",function(response){
		$('#orgGroupID').html('');
		$('#selectOrgGroupName').html('');
		if(response.status=="LIST_SUCCESS"){
			var organizationGroupList = response.successObject.organizationGroupList;
				var html='';
				var orgGroupNameTwo='';
				         for(var i=0;i<organizationGroupList.length;i++){
					        if(orgGroupId==organizationGroupList[i].id){
					        	orgGroupNameTwo=organizationGroupList[i].organizationGroupName;
					        	
					        	  html+= '<label id="selectOrgGroupName" class="control-label" style="width:355px" for="selectOrgGroupName">OrgGroupName <select id="selectOrgGroupNameId" onchange="orgBrandNameList()"  class="form-control input-sm" style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;" >';
								  html+='<option value="'+orgGroupNameTwo+'">'+$.trim(orgGroupNameTwo)+'</option>';
								//html+='<option value="'+organizationGroupList[i].organizationGroupName+'">'+$.trim(organizationGroupList[i].organizationGroupName)+'</option>';
								           for(var i=0;i<organizationGroupList.length;i++){
								        	   var orgGroupName=organizationGroupList[i].organizationGroupName;
							                	if(orgGroupName == orgGroupNameTwo){
							                		organizationGroupList.splice(i,1);
							                	}
												html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationGroupName)+'</option>';
												}
							   
								 html+= '<option value="0">All</option>';
								 html+= '</select>';
								 html+= '</label>';
								$('#selectOrgGroupName').append(html);
							
							    var html1='';
							    
							    html1+='<label id="orgGroupID" class="control-label" style="width:355px" for="orgGroupID">OrgGroupID <select id="selectOrgGroupId" onchange="orgGroupNameList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
							    html1+='<option value="'+orgGroupId+'">'+$.trim(orgGroupId)+'</option>';
								for(var i=0;i<organizationGroupList.length;i++){
									html1+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
									}
								html1+='<option value="0">All</option>';	
								html1+= '</select>';
								html1+= '</label>';
								$('#orgGroupID').append(html1);
								
								brandNameOnGroupId(orgGroupId);
								
					        }else if(orgGroupId==0){
					        	
					        	var html='';
					        	html+= '<label id="selectOrgGroupName" class="control-label" style="width:355px" for="selectOrgGroupName">OrgGroupName <select id="selectOrgGroupNameId" onchange="orgBrandNameList()"  class="form-control input-sm" style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;" >';
					        	html+= '<option value="0">All</option>';       
					        	for(var i=0;i<organizationGroupList.length;i++){
											html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationGroupName)+'</option>';
											}
							    html+= '</select>';
							    html+= '</label>';
							    $('#selectOrgGroupName').append(html);
						
						    var html1='';
						    
						    html1+='<label id="orgGroupID" class="control-label" style="width:355px" for="orgGroupID">OrgGroupID <select id="selectOrgGroupId" onchange="orgGroupNameList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
						    html1+='<option value="0">All</option>';
							for(var i=0;i<organizationGroupList.length;i++){
								html1+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
								}
								
							html1+= '</select>';
							html1+= '</label>';
							
							$('#page-wrapper').unmask('Loading...');
							$('#orgGroupID').append(html1);
							
							onChangeAll(orgGroupId);

					        }
					      
				         }

		}else{
				$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
			}
		
		
	});
	  
}




/* manoj*/
function onChangeAll(orgGroupId){
	
	$('#page-wrapper').mask('Loading...');
	$.get("../organizationGroup/allBrandList.htm",function(response){
		
		if(response.status=="LIST_SUCCESS"){
			var organizationBrandList = response.successObject.organizationBrandList;
			orgBrandData=response.successObject.organizationGroupList;
				/**********for Brand name and Brand Id****************************************/
				var html='';
				html+='<label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" onchange="orgBrandIdList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
				html+='<option value="0">All</option>';
				for(var i=0;i<organizationBrandList.length;i++){
					html+='<option value="'+organizationBrandList[i].id+'">'+$.trim(organizationBrandList[i].organizationBrandName)+'</option>';
					}
				html+='</select>';
				html+='</label>';	
				$('#selectOrgBrandName').append(html);
				
				var html1='';
				html1+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId" onchange="orgBrandNameOnId()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
				html1+='<option value="0">All</option>';
				for(var i=0;i<organizationBrandList.length;i++){
					html1+='<option value="'+organizationBrandList[i].id+'">'+$.trim(organizationBrandList[i].id)+'</option>';
					}
				html1+= '</select>';
				html1+= '</label>';
				$('#page-wrapper').unmask('Loading...');
				$('#orgBrandID').append(html1);	
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	});
	
}

function orgBrandNameOnId(){
	$('#page-wrapper').mask('Loading...');
	/*var orgGroupNameId=$('#selectOrgGroupNameId option:selected').val();
	var orgBrandNameId=$('#selectOrgBrandNameId option:selected').val();
	var orgBrandId=$('#selectOrgBrandId option:selected').val();*/
	var orgBrandId=$('#selectOrgBrandId option:selected').val();
	var orgGroupId=$('#selectOrgGroupId option:selected').val();
	
	$.ajaxSetup({ cache: false });
	$('#selectOrgBrandName').html('');
	$('#orgBrandID').html('');
	$('#selectOrgBrandName').html('');
	
	$.get("../organizationGroup/brandList.htm?orgGroupNameId="+orgGroupId+"&orgBrandNameId="+orgBrandId,function(response){
		if(response.status=="LIST_SUCCESS"){
			var organizationGroupList = response.successObject.organizationGroupList;
			console.log(organizationGroupList);
			var html='';
			            
		            	for(var i=0;i<organizationGroupList.length;i++){
		            		html='';
				           if(orgBrandId==organizationGroupList[i].id){
				        	   orgBrandName =organizationGroupList[i].organizationBrandName;
				        	   html+='<label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" onchange="orgBrandIdList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
				        	   html+='<option value="'+orgBrandName+'">'+$.trim(orgBrandName)+'</option>';
				        	   var flag=false;
				        	   for(var i=0;i<organizationGroupList.length;i++){
				        		   var brandName=organizationGroupList[i].organizationBrandName;
				                	if(brandName == orgBrandName){
				                		continue;
				                		/*organizationGroupList.splice(i,1);
				                		flag=true;*/
				                	}
				                	/*if(flag && i>0) { 
				                		i = i-1;
				                	} 
					                if(flag)*/ 
				                	html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationBrandName)+'</option>';
								 }
				            	 
							  html+='<option value="0">All</option>';
			                  html+='</select>';
			                  html+='</label>';	
			                    $('#selectOrgBrandName').append(html);
			                    
			                    var html1='';
			                  html1+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId" onchange="orgBrandNameOnId()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
			                  html1+='<option value="'+orgBrandId+'">'+$.trim(orgBrandId)+'</option>';
			                        for(var i=0;i<organizationGroupList.length;i++){
			                        	var brandId = organizationGroupList[i].id;
			                        	if(brandId ==orgBrandId ){
			                        		//organizationGroupList.splice(i,1);
			                        		continue;
			                        	}
			                        	html1+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
				                    }
			                   html1+='<option value="0">All</option>';
		                       html1+= '</select>';
			                   html1+= '</label>';
			                   $('#page-wrapper').unmask('Loading...');
			                   $('#orgBrandID').append(html1);
			                   
				           }else if(orgBrandId==0){
				        	  
				        	   brandNameOnGroupId(orgGroupId);
				        	   
				           }
				           
				           }
				          
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
		
	});
	return false;
}

/*manoj 12-02-16*/
function brandNameOnGroupId(orgGroupId){
	$('#page-wrapper').mask('Loading...');
	var orgGroupId=$('#selectOrgGroupId option:selected').val();
	/*var orgGroupNameId=$('#selectOrgGroupNameId option:selected').val();
	var orgBrandId=$('#selectOrgBrandId option:selected').val();*/
	 
	$.get("../organizationGroup/brandList.htm?orgGroupNameId="+orgGroupId+"&orgBrandNameId="+orgGroupId,function(response){
		$('#selectOrgBrandName').html('');
		$('#orgBrandID').html('');
		
		if(response.status=="LIST_SUCCESS"){
			var organizationGroupList = response.successObject.organizationGroupList;
			orgBrandData=response.successObject.organizationGroupList;
				/**********for Brand name and Brand Id****************************************/
				var html='';
				html+='<label id="selectOrgBrandName" class="control-label" style="width:355px" for="selectOrgBrandName">OrgBrandName <select id="selectOrgBrandNameId" onchange="orgBrandIdList()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
				html+='<option value="0">All</option>';
				for(var i=0;i<organizationGroupList.length;i++){
					html+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].organizationBrandName)+'</option>';
					}
				html+='</select>';
				html+='</label>';	
				$('#selectOrgBrandName').append(html);
				
				var html1='';
				html1+=' <label id="orgBrandID" class="control-label" style="width:355px" for="orgBrandID">OrgBrandID <select id="selectOrgBrandId" onchange="orgBrandNameOnId()" class="form-control input-sm"  style="width: 220px; float: right; margin-right: 40px; margin-top: -5px;">';
				html1+='<option value="0">All</option>';
				for(var i=0;i<organizationGroupList.length;i++){
					html1+='<option value="'+organizationGroupList[i].id+'">'+$.trim(organizationGroupList[i].id)+'</option>';
					}
				html1+= '</select>';
				html1+= '</label>';
				$('#page-wrapper').unmask('Loading...');
				$('#orgBrandID').append(html1);	
		}else{
			$('#listAgentTab').append('<font style="color:red">'+response.errorMessage+'</font>');
		}
	});
	
}
/******************end of Design For filter buttons*******manoj**************** */

function listOrganizationGroupTabClick(){
	$('#addAndEditOrganizationGroupDiv').hide();
	$('#editOrganizationGroupSuccessDiv').hide();
	//clearOrganizationGroupMessageDivs();
	listOrganizationGroup();
}

function listOrganizationGroup(){
	
	$("#addAndEditOrganizationGroupDiv").hide();//hide the add edit design error

	$('#page-wrapper').mask('Loading');
	var orgGroupNameId=$('#selectOrgGroupId option:selected').val();
	var orgBrandNameId=$('#selectOrgBrandId option:selected').val();
	var orgGroupId=$('#selectOrgGroupId option:selected').val();
	var orgBrandId=$('#selectOrgBrandId option:selected').val();
	$('#organizationGroupDataDiv').html('');//commented by manoj
	
	console.log("inside listOrganizationGroup()"+orgGroupNameId+" "+orgBrandNameId+" "+orgGroupId+" "+orgBrandId);
	
	$.get(organizationGroupUrl+"viewTable.htm?orgGroupNameId="+orgGroupNameId+"&orgBrandNameId="+orgBrandNameId+"&orgGroupId="+orgGroupId+"&orgBrandId=+"+orgBrandId,function(response){
		console.log(response);
		if(response.status=="LIST_SUCCESS"){
			var html = listOrganizationGroupHtml(response);
			$('#organizationGroupDataDiv').append(html);
			$('#organizationGroupListTable').dataTable();
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function listOrganizationGroupHtml(response){
	var organizationGroupList = response.successObject.organizationGroupList;
	var html = "";
	html+=	'<form id="listOrganizationGroupForm">';
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteOrganizationGroupSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Group(s) Deleted Successfully</div>';
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationGroupErrorDiv">';
	html += '</div>';
	html+=		"<table class='table table-striped dataTable no-footer' id='organizationGroupListTable'>";
	html+=		"<thead>";
	html+=			"<tr>";
	html+=				'<th><input type="checkbox" id="checkAllOrganizationGroupCheckBox" style="margin-left: 0px;"></th>';
	html+=				'<th>OrgGroupID</th>';
	html+=				'<th>Organization Group</th>';
	html+=				'<th>OrgBrandID</th>';
	html+=				'<th>Organization Brand</th>';
	html+=				'<th></th>';
	html+=			"</tr>";
	html+=		"</thead>";
	html+=		'<tbody>';
	for(var i=0;i<organizationGroupList.length;i++){
		var id = organizationGroupList[i].id;
		var organizationGroupId = organizationGroupList[i].organizationGroupId;
		var organizationGroupName = organizationGroupList[i].organizationGroupName;
		var organizationBrandId= organizationGroupList[i].id;
		var organizationBrandName = organizationGroupList[i].organizationBrandName;
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationGroupCheckBox" value='+id+'></td>';
		html+=	'<td>'+organizationGroupId+'</td>';
		html+=	'<td>'+organizationGroupName+'</td>';
		html+=	'<td>'+organizationBrandId+'</td>';
		html+=	'<td>'+organizationBrandName+'</td>';
		html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editOrganizationGroupForm('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html+=		'</tbody>';
	html+=		'</table>';
	html+=	'</form>';
	html+=	addDiv("OrganizationGroup");
	return html;
	
}

function addOrganizationGroup(){
	//$('#organizationGroupDataDiv').html('');
	clearOrganizationGroupMessageDivs();//by rajesh
	$('#page-wrapper').mask('Loading...');
	
	var divId = $('#'+getDivId("OrganizationGroup"));
	console.log("inside addOrganizationGroup...... "+divId);  
	appendOrganizationAddOrEditForm(divId, addOrganizationGroupForm());
	return false;
}

function addOrganizationGroupForm(){
	var html = "";
	html+= addFormHeading("Add Organization Group");
	html+=	'<form class="col-sm-5" id="addOrganizationGroupForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addOrganizationGroupErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Group***************************************************** */
	html += '<div class="form-group" id="Add-organizationGroupName-Error">';
	html += '<label>Organization Group Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="organizationGroupName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationGroupName" placeholder="Enter Organization Group Name" maxlength="50">';
	html += '</div>';
	/** ************************************Organization Brand***************************************************** */
	html+=	'<table id="organizationBrandTable" style="width:354px;">';
	html+=		'<tbody>';
	html+=			'<tr>';
	html+=			'<td>';
	html += 			'<div class="form-group" id="Add-organizationBrandName_0-Error">';
	html += 				'<label>Organization Brand<font style="color: red">*</font></label>';
	html += 				'<span style="color: #a94442" id="organizationBrandName_0-span-Error" class="help-inline"></span>';
	html += 				'<input	type="text" class="form-control input-sm" id="organizationBrandName" placeholder="Enter Organization Brand Name" maxlength="50">';
	html += 			'</div></td>';
	html +=			'</tr>';
	html+=		'</tbody>';
	html +=	'</table>';
	html+='<div class="form-group input-group">';
	html+='<button id="Add_Another_Catogery" onclick="addOrganizationBrand()" class="btn btn-default btn-xs" type="button"> <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Organization Brand</button>';
	html+='</div>';
	//html+=	'<input type="button" class="btn btn-sm btn-default" onclick="addOrganizationBrand()" value="Add Another Organization Brand"><br><br>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Add" onclick ="saveOrganizationGroup()">';
	html+=	appendCancelButton(getDivId("OrganizationGroup"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function addOrganizationBrand(){
	var organizationBrandTableLength  =  $('#organizationBrandTable tbody tr').length;
	$('#organizationBrandTable tbody ').append(appendOrganizationBrand(organizationBrandTableLength));
	return false;
}
function appendOrganizationBrand(trId){
	var html = "";
	html+=	'<tr>';
	html+=	'<td>';
	html+= 		'<div class="form-group input-group" id="Add-organizationBrandName-Error">';
	html+= 			'<span style="color: #a94442" id="organizationBrandName-span-Error" class="help-inline"></span>';
	html+= 			'<input	type="text"  class="form-control input-sm" id="organizationBrandName" placeholder="Enter Organization Brand Name" maxlength="50">';
	html+=			'<span class="input-group-btn"><button type="button" onclick="deleteOrganizationGroupTr(this)" class="btn btn-default btn-sm"><i class="glyphicon glyphicon-trash"></i></span>';
	html+= 		'</div></td>';
	//html +=	'<td><button type="button"  class="btn btn-default" style="margin-bottom:15px;margin-left:10px;" onclick="deleteOrganizationGroupTr(this)">X</button></td>';
	html+=	'</tr>';
	return html;
}
function deleteOrganizationGroupTr(id){
	$(id).closest('tr').remove();
	counter = counter-1;
	//updateRowIndex();
}
function updateRowIndex(){
    $("#organizationBrandTable tr").each(function(){
     $( this ).find( "td" ).first().html( $(this).index() + 1 );
    });
}
/********************************************************************************************************************************************************/
/*******************************************Save Organization Group***************************************************************************************/
/********************************************************************************************************************************************************/
function saveOrganizationGroup(){
	$('#page-wrapper').mask('Loading');
	var organizationBrands = [];
	var divId = $('#'+getDivId("OrganizationGroup"));
	$('#addOrganizationGroupSuccessDiv').hide();
	$('#addOrganizationGroupErrorDiv').hide();
	//$('#addAndEditOrganizationGroupDiv').hide();manoj
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	var organizationGroupName = $.trim($('#organizationGroupName').val());
	 $("table#organizationBrandTable > tbody > tr >td").each(function(){
		 var organizationBrandName=$(this).find("input#organizationBrandName").val();
		 if(organizationBrandName!=""){
			 organizationBrands.push({'organizationBrandName':organizationBrandName});
		 }
	 });
	 var JSONObject = {'organizationGroupName':organizationGroupName,'organizationBrands':organizationBrands};
	 $.ajax({
		 type:"POST",
		 url:organizationGroupUrl+"save.htm",
		 contentType:"application/json",
		 data:JSON.stringify(JSONObject),
		 success:function(response){
			 if(response.status=="SAVE_SUCCESS"){
				 $('#addOrganizationGroupSuccessDiv').show(600);
				 $('#addOrganizationGroupForm').trigger("reset");
				 listOrganizationGroup();
				 scrollDown("organizationGroupDataDiv");
				 $('#page-wrapper').unmask();
			 }else if(response.status=="SAVE_ERROR"){
				 scrollDown(divId);
				 //$('#organizationGroupErrorEmpty').show(600);
				 //scrollDown("organizationGroupDataDiv");
				$('#addOrganizationGroupErrorDiv').show(600);
				for(var i=0;i<response.errorMessageList.length;i++){
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage  = response.errorMessageList[i].message;
					$('#Add-'+fieldName+'-Error').addClass('has-error has-feedback');
					$('#'+fieldName+'-span-Error').html(errorMessage);
				}
				$('#page-wrapper').unmask();
			}else if(response.status=="EXCEPTION_ERROR"){
			 $('#page-wrapper').mask(response.errorMessage);
		 }
			 
		 },error:function(response){
			 $('#page-wrapper').mask(response.status+"***********"+response.statusText);
		 }
	 });
}

/********************************************************************************************************************************************************/
/*******************************************Update Organization Group***************************************************************************************/
/********************************************************************************************************************************************************/

function editOrganizationGroupForm(id){
	$('#page-wrapper').mask('Loading...');
	clearOrganizationGroupMessageDivs();//rajesh
	$.get(organizationGroupUrl+"updateForm.htm?id="+id,function(response){
		if(response.status=="UPDATE_VIEW_SUCCESS"){
			var html = updateOrganizationGroupFormHtml(response);
			var divId = $('#'+getDivId("OrganizationGroup"));
			appendOrganizationAddOrEditForm(divId, html);
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"*********"+response.statusText);
	});
}
function updateOrganizationGroupFormHtml(response){
	var html = "";
	var organizationGroup = response.successObject.organizationGroup;
	var organizationGroupId = organizationGroup.id;
	var organizationGroupName = organizationGroup.organizationGroupName;
	var organizationBrandName = organizationGroup.organizationBrandName;
	var organizationBrandId = organizationGroup.organizationBrandId;
	html+= addFormHeading("Edit Organization Group");
	html+=	'<form class="col-sm-5" id="editOrganizationGroupForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editOrganizationGroupErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/** ************************************Organization Group***************************************************** */
	html += '<div class="form-group" id="Edit-organizationGroupName-Error">';
	html += '<label>Organization Group Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-organizationGroupName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" disabled="disabled" class="form-control input-sm" value="'+organizationGroupName+'" id="editedOrganizationGroupName" placeholder="Enter Organization Group Name" maxlength="50">';
	html += '</div>';
	/** ************************************Organization Brand***************************************************** */
	html += '<div class="form-group" id="Edit-organizationBrandName_0-Error">';
	html += '<label>Organization Brand<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="edit-organizationBrandName-span-Error" class="help-inline"></span>';
	html += '<input	type="text"  class="form-control input-sm" value="'+organizationBrandName+'" id="editedOrganizationBrandName" placeholder="Enter Organization Brand Name" maxlength="50">';
	html += '</div>';
	/** ************************************Button***************************************************** */
	html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganizationGroup('+organizationGroupId+','+organizationBrandId+')">';
	html+=	appendCancelButton(getDivId("OrganizationGroup"),"page-wrapper");//Adding Cancel Button
	html += '</form>';
	return html;
}

function updateOrganizationGroup(organizationGroupId,organizationBrandId){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("OrganizationGroup"));
	$('#editOrganizationGroupSuccessDiv').hide();
	$('#editOrganizationGroupErrorDiv').hide();
	var organizationGroupName = $.trim($('#editedOrganizationGroupName').val());
	var organizationBrandName = $.trim($('#editedOrganizationBrandName').val());
	
	var JSONObject = {'id':organizationGroupId,'organizationBrandId':organizationBrandId,'organizationGroupName':organizationGroupName,'organizationBrandName':organizationBrandName};
	
	$.post(organizationGroupUrl+"/update.htm",JSONObject,function(response){
		if(response.status=="UPDATE_SUCCESS"){
			$('#editOrganizationGroupSuccessDiv').show(600);
			listOrganizationGroup();
			scrollDown("organizationGroupDataDiv");
			$('#page-wrapper').unmask();
		}else if(response.status=="UPDATE_ERROR"){
			scrollDown(divId);
			$('#editOrganizationGroupErrorDiv').show(600);
			for(var i=0;i<response.errorMessageList.length;i++){
				var fieldName = response.errorMessageList[i].fieldName;
				var errorMessage  = response.errorMessageList[i].message;
				$('#Edit-'+fieldName+'-Error').addClass('has-error has-feedback');
				$('#edit-'+fieldName+'-span-Error').html(errorMessage);
			}
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(jqXHR, textStatus, errorThrown){
		var exceptionVO = jQuery.parseJSON(jqXHR.responseText);
		console.log(exceptionVO);
		$('#page-wrapper').mask(jqXHR.status+"***********"+jqXHR.statusText);
	});
}
/********************************************************************************************************************************************************/
/*******************************************Delete Organization Group***************************************************************************************/
/********************************************************************************************************************************************************/
//mark by manoj
function deleteOrganizationGroup(){
	clearOrganizationGroupMessageDivs();//rajesh
	var ids = selectedIds('organizationGroupCheckBox');//Pass Check Box Class
	if(ids.length>0){
	if(confirm("Do you want to delete selected record(s)?")){
		$('#page-wrapper').mask('Loading...');
		clearOrganizationGroupMessageDivs();
		$.ajax({
			type:"POST",
			url:organizationGroupUrl+"/delete.htm",
			contentType:"application/json",
			data:JSON.stringify(ids),
			success:function(response){
				if(response.status=="DELETE_SUCCESS"){
					var html = listOrganizationGroupHtml(response);
					$('#orgGroupFilterButtons').show();
					$('#organizationGroupDataDiv').html(html);
					$('#deleteOrganizationGroupSuccessDiv').show(600);
					$('#organizationGroupListTable').dataTable();
					$('#page-wrapper').unmask();
				}else{
					console.log(response);
					$('#deleteOrganizationGroupErrorDiv').html('');
					var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
					$('#deleteOrganizationGroupErrorDiv').append("Record already in Use You cannot delete selected records.");
					$('#deleteOrganizationGroupErrorDiv').show(600);
					$('input:checkbox').removeAttr('checked');
					$('#page-wrapper').unmask();
				}
			},error:function(response){
				$('#page-wrapper').mask(response.status+"*********"+response.statusText);
			}
		});
		return false;
	}
	}else{
		alert("Please select row");
		return false;
		
	}
}
/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllOrganizationGroupCheckBox",function(){
    $('.organizationGroupCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".organizationGroupCheckBox",function(){
    if($('.organizationGroupCheckBox:checked').length == $('.organizationGroupCheckBox').length) {
      $('#checkAllOrganizationGroupCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllOrganizationGroupCheckBox').prop('checked', false);
    }
});

/**end of manoj pasted code**/

/********************************************************************************************************************************************
 **********************Organization Tab******************************************************************************************************
 **********************************************************************************************************************************************/
//***********************************Dileep Start *****************************//
var organizationUrl = "../organization/";

function listOrganizationGroupName(){
	$('#page-wrapper').mask('Loading...');
	
	$(".alert").hide();
	
	$("#addAndEditOrganizationGroupDiv").hide();
	$("#addAndEditDepartmentDiv").hide();
	$("#addAndEditOrganizationDiv").hide();
	
	$("#departmentListTable_wrapper").hide();
	$("#organizationListTable_wrapper").hide();
	$("#organizationGroupListTable_wrapper").hide();
	/*clearOrganizationMessageDivs();
	clearDepartmentMessageDivs();
	clearOrganizationGroupMessageDivs();*/
	
	$("#dropsDiv").show();//organization view
	$("#drops").hide();//department view
	$("#orgGroupFilterButtons").hide();
	$("#organizationFilterButtons").html('');
	
	//$('#listOrganizationTab').html('');//mark
	$.get(organizationUrl+"getOrgGroupName.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = listOrganizationGroupTabFormHtml(response);
			//listOrganization();
			$('#organizationFilterButtons').append(html);
					/*Dileep:-hide the table*/
			//$('#organizationListTable').dataTable(); 
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});
	return false;
}

function listOrganizationGroupTabFormHtml(response){
	$('#page-wrapper').mask('Loading...');
	var organizationList = response.successObject.organizationGroupNameList;
	var orgCountryList = response.successObject.orgCountryList;
	var html = "";
	//html+=	addHeaderButtons("addOrganization", "deleteOrganization","organizationTabButtons"); commented by Dileep.
	//html+=		'<form id="addOrganization" class="form-inline col-xs-12 SubHeading AdminMainActivity" >';
	/*	Dileep:-coded for drop down org group name start*/
	html +='<div class="tab-pane fade in active"  id="dropsDiv">';
	html += '<form id="organizationViewTabButtons"  class="form-inline col-xs-12 SubHeading AdminMainActivity" style="padding-top:20px; padding-bottom:10px;">';
	html += '<div class="row" style="margin-top:10px">';
	html += '<label class="control-label col-xs-4" for="OrganizationGroupName">Org Group Name <select id="selectedOrgGroupNameType" class="form-control input-sm" onchange="getOrgBrandName()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
			for (var i = 0; i < organizationList.length; i++) {
				html += '<option value='+organizationList[i].id+'>'
						+ organizationList[i].organizationGroupName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';

			html += '<label id="dropBrandName" class="control-label col-xs-4" for="OrganizationBrandName">Org Brand Name <select disabled  class="form-control input-sm" id="selectedOrgBrandNameType" style="width:150px; float:right; margin-right:15px; margin-top:-5px;"  >';
			html += '<option value="0">ALL</option>';
			html += '</select>';
			html +='</label>';

			html += '<label id="dropOrgName" class="control-label col-xs-4" for="OrganizationName">Org Name <select disabled class="form-control input-sm" id="selectedOrgNameType" style="width:150px; float:right; margin-right:15px; margin-top:-5px;">';
			html += '<option value="0">ALL</option>';
			html += '</select>';
			html +='</label>';
			html +='</div>';

			html += '<div class="row" style="margin-top:10px">';
		    html += '<label id="dropCountryLbId" class="control-label col-xs-4" for="Country">Country<select class="form-control input-sm" id="selectedCountryTypeForOrg" onchange="getCity()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;">';
			html += '<option value="0">ALL</option>';
			for (var i = 0; i < orgCountryList.length; i++) {
				html += '<option value='+orgCountryList[i].id+'>'
						+ orgCountryList[i].geoCountryName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';
	
	    	html += '<label id="dropCityLbId" class="control-label col-xs-4" for="City">City<select disabled class="form-control input-sm" id="selectedCityTypeForOrg" style="width:150px; float:right; margin-right:15px; margin-top:-5px;">';
			html += '<option value="0">ALL</option>';
			html += '</select>';
			html +='</label>';	
	    
			html += '<label id="dropAreaLbId" class="control-label col-xs-4" for="Area">Area<select disabled class="form-control input-sm" id="selectedAreaTypeForOrg" style="width:150px; float:right; margin-right:15px; margin-top:-5px;">';
			html += '<option value="0">ALL</option>';
			html += '</select>';
			html +='</label>';	
			html +='</div>';
			
			html += '<div class="row" style="margin-top:10px">';
		    html += '<label id="dropClientLbId" class="control-label col-xs-4" for="Client">Client <input type="checkbox" name="" value="" id="selectedClientIDs" style="margin: 0px 5px; box-shadow: none;">';
			html +='</label>';	
			
			html += '<label id="dropOrgNameId" class="control-label col-xs-4" for="Org Name ID">Org Name ID<select disabled class="form-control input-sm" id="selectedOrgNameIdType" style="width:150px; float:right; margin-right:15px; margin-top:-5px;">';
			html += '<option value="0">ALL</option>';
			html += '</select>';
			html +='</label>';	
		
			html += '<label id="dropView" class="control-label col-xs-4" for=""> <a onclick="listOrganization()" class="btn btn-primary btn-sm" type="button">View</a>';
			html +='</label>';
			html +='</div>';
			    	
			    	
		
		/*	Dileep:-coded for drop down org group name end*/
					
	html+=		'<div class="form-group float-right">';
	html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteOrganization()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
	//check below line for add organization organizationTabButtons() method not present
    //html+='<a onclick="organizationTabButtons()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
	html += '<a onclick="addOrganization()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
	html+=		'</div>';
	html+=		'</form>';
	html+=	'</div>';
	//html+=	addDiv("Organization");
	return html;
}

function getOrgBrandName(){ 
	$('#page-wrapper').mask('Loading...');
	$("#dropBrandName").html('');
	var selectedOrgGroupNameTypes=$("#selectedOrgGroupNameType").val();
	console.log("selectedOrgGroupNameType:- "+selectedOrgGroupNameTypes);
		$.ajax({
		type: "GET",
		url: "../organization/lists.htm?id="+selectedOrgGroupNameTypes,
		dataType: "json",
		success: function(data){ 
			$('#selectedOrgNameType').val("0");
			$('#selectedOrgNameType').prop("disabled",true);
			$('#selectedOrgNameIdType').val("0");
			$('#selectedOrgNameIdType').prop("disabled",true);
			var html="";
			if($("#selectedOrgGroupNameType").val() == 0){
				html+=	'OrgBrand Name <select class="form-control input-sm" id="selectedOrgBrandNameType"  disabled onchange="getvalOrgBrandNameType()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
				html+=	'<option value="0">ALL</option>';
				html+='</select>';
			}else{ 
				html+=	'OrgBrand Name <select class="form-control input-sm" id="selectedOrgBrandNameType"  onchange="getvalOrgBrandNameType()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
				html+=	'<option value="0">ALL</option>';
				for(var i=0;i<data.length;i++){
					html+=	'<option value='+data[i].id+'>'+data[i].organizationBrandName+'</option>';
				}
				html+='</select>';	
			}
			$("#dropBrandName").append(html);
			$("#dropBrandName").show();
			$("#dropOrgName").show();
			$("#dropCountryLbId").show();
			$("#dropCityLbId").show();
			$("#dropAreaLbId").show();
			$("#dropClientLbId").show();
			$("#dropsDiv").show();
			$('#page-wrapper').unmask();
		}
	});
}




function getvalOrgBrandNameType() {
	$('#page-wrapper').mask('Loading...');
	$("#dropOrgName").html('');
	var selectedOrgBrandNameTypes = $('#selectedOrgBrandNameType').val();
	console.log("selectedOrgBrandNameTypes:- " + selectedOrgBrandNameTypes);
	$.ajax({
				type : "GET",
				url : "../organization/getOrgFullName.htm?id="+ selectedOrgBrandNameTypes,
				dataType : "json",
				success : function(data) {
					$('#selectedOrgNameIdType').val("0");
					$('#selectedOrgNameIdType').prop("disabled",true);
					var html = "";
					if($("#selectedOrgBrandNameType").val() == 0){
						html += 'Org  Name<select class="form-control input-sm" id="selectedOrgNameType" disabled onchange="getvalOrgNameId()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
						html += '<option value="0">ALL</option>';
						html += '</select>';
					}else{
					html += 'Org  Name<select class="form-control input-sm" id="selectedOrgNameType" onchange="getvalOrgNameId()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
					html += '<option value="0">ALL</option>';
					for (var i = 0; i < data.length; i++) {
						html += '<option value=' + data[i].id + '>'
								+ data[i].organizationFullName + '</option>';
					}
					html += '</select>';
					}
					$("#dropOrgName").append(html);
					$("#dropOrgName").show();
					$("#dropCountryLbId").show();
					$("#dropCityLbId").show();
					$("#dropAreaLbId").show();
					$("#dropClientLbId").show();
					$("#dropsDiv").show();
					$('#page-wrapper').unmask();
				}
			});
}


function getvalOrgNameId() {
	$('#page-wrapper').mask('Loading...');
	var selectedOrgNameIds = $('#selectedOrgNameType').val();
	$("#dropOrgNameId").empty();
	var html = "";
	if($('#selectedOrgNameType').val()==0){
		html += 'Org  Name Id<select class="form-control input-sm" id="selectedOrgNameIdType" disabled style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
		html += '<option value=""></option>';
		html += '</select>';
	}else{
	html += 'Org  Name Id<select class="form-control input-sm" id="selectedOrgNameIdType"  style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
	html += '<option value=' + selectedOrgNameIds + '>' + selectedOrgNameIds
			+ '</option>';
	html += '</select>';
	}
	$("#dropOrgNameId").append(html);
	$("#dropOrgNameId").show();
	$("#dropCountryLbId").show();
	$("#dropCityLbId").show();
	$("#dropAreaLbId").show();
	$("#dropClientLbId").show();
	$("#dropsDiv").show();
	$('#page-wrapper').unmask();
}




function getCity() {
	$('#page-wrapper').mask('Loading...');
	$("#dropCityLbId").html('');
	var selectedCountryTypeForOrgs = $("#selectedCountryTypeForOrg").val();
	console.log("selectedCountryTypeForOrg:- " + selectedCountryTypeForOrgs);
	$.ajax({
				type : "GET",
				url : "../organization/getCountry.htm?id="
						+ selectedCountryTypeForOrgs,
				dataType : "json",
				success : function(data) {
					$('#selectedAreaTypeForOrg').val("0");
					$('#selectedAreaTypeForOrg').prop("disabled",true);
					
					var html = "";
					if($("#selectedCountryTypeForOrg").val()==0){
						html += 'City <select class="form-control input-sm" id="selectedCityTypeForOrg" disabled  onchange="getAreaNameType()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
						html += '<option value="0">ALL</option>';
						html += '</select>';
						
					}else{ 
					html += 'City <select class="form-control input-sm" id="selectedCityTypeForOrg"  onchange="getAreaNameType()" style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
					html += '<option value="0">ALL</option>';
					for (var i = 0; i < data.length; i++) {
						html += '<option value=' + data[i].id + '>'
								+ data[i].geoCityName + '</option>';
					}
					html += '</select>';
					}
					$("#dropCityLbId").append(html);
					$("#dropCountryLbId").show();
					$("#dropCityLbId").show();
					$("#dropAreaLbId").show();
					$("#dropClientLbId").show();
					$("#dropsDiv").show();
					$('#page-wrapper').unmask();
				}
			});
}

function getAreaNameType(){ 
	$('#page-wrapper').mask('Loading...');
	var selectedCityNameTypes=$('#selectedCityTypeForOrg').val();
	$("#dropAreaLbId").html('');
	console.log("selectedCityNameTypes:- "+selectedCityNameTypes);
	$.ajax({
		type: "GET",
		url: "../organization/getAreaName.htm?id="+selectedCityNameTypes,
		dataType: "json",
		success: function(data){ 
			var html="";
			if($('#selectedCityTypeForOrg').val()==0){
				html+=	'Area<select class="form-control input-sm" id="selectedAreaTypeForOrg" disabled style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
				html+=	'<option value="0">ALL</option>';
				html+='</select>';
			}else{ 
			html+=	'Area<select class="form-control input-sm" id="selectedAreaTypeForOrg" style="width:150px; float:right; margin-right:15px; margin-top:-5px;" >';
			html+=	'<option value="0">ALL</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].geoAreaName+'</option>';
			}
			html+='</select>';	
			}
			$("#dropAreaLbId").append(html);
			$("#dropAreaLbId").show();
			$("#dropClientLbId").show();
			$("#dropsDiv").show();
			$('#page-wrapper').unmask();
		}
	});
}



function listOrganization() {

	$("#addAndEditOrganizationDiv").hide();
	
	$('#page-wrapper').mask('Loading...');
	var orgGroup = $("#selectedOrgGroupNameType").val();
	var orgBrand = $("#selectedOrgBrandNameType").val();
	var orgName = $("#selectedOrgNameType").val();
	var country = $("#selectedCountryTypeForOrg").val();
	var city = $("#selectedCityTypeForOrg").val();
	var area = $("#selectedAreaTypeForOrg").val();
	var client = $("#selectedClientIDs").is(':checked') ? 1 : 0;
	var clientId= $("#")
	//var orgId = $("#selectedOrgNameIdType").val(); //mark
	var orgId = $("#selectedOrgNameType").val();
	var html = "";
	//listOrganizationGroupName();//mark
    $("#organizationDataDiv").html('');
    console.log("Chesk--------------------------------------"+country+" "+city+" "+area);
	
	console.log(orgGroup+" "+orgBrand+" "+orgName+" "+country+" "+city+" "+area+" "+client+" "+orgId);
	var id = [];
	var sendOrgInfo = {
		'orgGroup' : orgGroup,
		'orgBrand' : orgBrand,
		'orgName' : orgName,
		'country' : country,
		'city' : city,
		'area' : area,
		'client' : client,
		'orgid' : orgId,
		'ids' :id
	};
	//
	 $.ajax({
			type:"POST",
			url:organizationUrl+"/listAllOrganizationFilter.htm",
			contentType:"application/json",
			data:JSON.stringify(sendOrgInfo),
			success:function(response){
				if(response.status=="LIST_SUCCESS"){
					//$('#page-wrapper').unmask();
					console.log(response);
					 html = listOrganizationFormHtml(response);
					$('#organizationDataDiv').append(html);
							/*Dileep:-hide the table*/
					$('#organizationListTable').dataTable(); 
					$('#page-wrapper').unmask();
				}else{
					$('#page-wrapper').mask(response.errorMessage);
				}
			},error:function(response){
				$('#page-wrapper').mask(response.status+"**********"+response.statusText);
			}
		});

	
	//
/*	
	$.get(organizationUrl+"listAllOrganizationFilter.htm",sendOrgInfo,function(response){
		if(response.status=="LIST_SUCCESS"){
			//$('#page-wrapper').unmask();
			console.log(response);
			 html = listOrganizationFormHtml(response);
			$('#organizationDataDiv').append(html);
					Dileep:-hide the table
			$('#organizationListTable').dataTable(); 
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});*/
	return false;
}


function listOrganizationFormHtml(response){
	
	var organizationList = response.successObject.organizationList;
	console.log("organizationList "+organizationList.length);
	var html = "";
	//html+=	addHeaderButtons("addOrganization", "deleteOrganization","organizationTabButtons"); commented by Dileep.

	
	//html+=	'<div id="organizationDataDiv">';
	html+=	'<form id="organizationListForm">';
	
	//** ****************************************Add Organization Success Div**************************************************** *//*
	html+=	'<div class="alert alert-success" style="display:none;"id="addOrganizationSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Added Successfully</div>';
	//** ****************************************Edit Organization Success Div**************************************************** *//*
	html+=	'<div class="alert alert-success" style="display:none;"id="editOrganizationSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization Updated Successfully</div>';
	//** ****************************************Delete Organization Success Div**************************************************** *//*
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteOrganizationSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Organization(s) Deleted Successfully</div>';
	//** ****************************************Delete Organization Error Div**************************************************** *//*
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationErrorDiv">';
	html += '</div>';
	//** ****************************************Selected CLient  Div**************************************************** *//*
	html+=	'<div class="alert alert-success" style="display:none;"id="selectClientSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Client Added Successfully</div>';
	
	

	html += "<table class='table table-striped dataTable no-footer' id='organizationListTable' >";
	html += "<thead>";
	html +=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllOrganizationCheckBox" style="margin-left: 0px;"></th>';
	html +=	"<th>Id</th>";
	html +=	"<th>Organization Group Name</th>";
	html +=	"<th>Organization Brand Name</th>";
	html +=	"<th>Organization Name</th>";
	html +=	"<th>Country </th>";
	html +=	"<th>City</th>";
	html +=	"<th>Area</th>";
	html +=	"<th>Client</th>";
	html +=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	for(var i=0;i<organizationList.length;i++){
		var list = organizationList[i];
		var id = list.id;
		var organizationGroupName = list.organizationGroupName;
		var organizationBrandName = list.organizationBrandName;
		var organizationName = list.organizationFullName;
		var country=list.geoCounrtyName;
		var city=list.geoCityName;
		var area=list.geoAreaName;
		var countryId=list.geoCounrtyId;
		var cityId=list.geoCityId;
		var areaId=list.geoAreaId;
		var client=list.clientId;
		console.log("countryID: "+list.geoCounrtyId+" cityId: "+list.geoCityId+" arearId: "+list.geoAreaId);
		html+=	'<tr>';
		html+=	'<td><input type="checkBox" class="organizationCheckBox" value='+id+'></td>';
		html+=	'<td>'+id+'</td>';
		html+=	'<td>'+organizationGroupName+'</td>';
		html+=	'<td>'+organizationBrandName+'</td>';
		html+=	'<td>'+organizationName+'</td>';
		if(country!=null){
			html+=	'<td>'+country+'</td>';
			}else{
			html+=	'<td></td>';
			}
			if(city!=null){
				html+=	'<td>'+city+'</td>';
			}else{
				html+=	'<td></td>';
			}
			if(area!=null){
				html+=	'<td>'+area+'</td>';
			}else{
				html+=	'<td></td>';
			}
		
		if(client!=null){
			html+=	'<td><input type="checkbox"  checked disabled></td>';
		}else{
			html+=	'<td><input type="checkbox" id="selectedClientId_'+id+'" onchange= "selectAsClient('+id+')"></td>';
		}
		html+='<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editOrganization('+id+',\'' + countryId + '\',\''+ cityId +'\',\''+areaId+'\')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
		html+=	'</tr>';
	}
	html +=	"</tbody>";
	html +=	"</table>";
	html += '</form>';
	html+=	addDiv("Organization");
	//html+=	'</div>';
	return html;
}

function selectAsClient(orgId) {
	//$('#page-wrapper').mask("Loading...");
	clearOrganizationMessageDivs();
	var id = $("#selectedClientId_" + orgId).is(':checked') ? 1 : 0;
	console.log("Select as clientnext: " + id);
	if (id == 1) {
		if (confirm("Confirm as Client")) {
			$('#page-wrapper').mask("Loading...");
			console.log("go to db: " + orgId);
			$.ajax({
				type: "GET",
				url: "../organization/saveClient.htm?id="+orgId,
				dataType: "json",
				success: function(response){ 
					if(response.status=="SAVE_SUCCESS"){
						var tabButtonsId = $('#organizationTabButtons');
						var dataDivId = $('#organizationDataDiv');
						var successDivId = "selectClientSuccessDiv"
						var tableId = "organizationListTable";
						var html = listOrganizationFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						//listOrganization();
					/*	$("#organizationDataDiv").show();
						scrollDown($('#organizationDataDiv'));
						$("#selectClientSuccessDiv").show();*/
						$('#page-wrapper').unmask();
					}else{
						$('#page-wrapper').mask(response.errorMessage);
					}
				}
			});
			
		} else {
			// set check box as uncheck
			console.log("set check box as uncheck: " + id);
			$('#selectedClientId_' + orgId).prop('checked', false);
			$('#page-wrapper').unmask();
		}
	} else {
		console.log("id == " + id)
	}
}

function addOrganization(){
	$('#page-wrapper').mask('Loading...');
	$('#editOrganizationSuccessDiv').hide();
	$.get(organizationUrl+"add.htm",function(response){
		if(response.status=="EXCEPTION_ERROR"){
			$('#page-wrapper').mask(response.errorMessage);
		}else{
			var html = addOrganizationFormHtml(response);
			var divId = $('#'+getDivId("Organization"));
			//addAndEditOrganizationDiv
			appendOrganizationAddOrEditForm(divId, html);
			
			$('#page-wrapper').unmask();
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"********"+response.errorMessage);
	});
	return false;
}

function addOrganizationFormHtml(response){
	console.log(response);
	var organizationAttributeList = response.successObject.organizationAttributeList;
	var organizationGroupList = response.successObject.organizationGroupList;
	var organizationBrandList = response.successObject.organizationBrandList;
	var industryTypesList = response.successObject.industryTypesList;
	var segmentCategoryList = response.successObject.segmentCategoryList;
	var organizationTypeList = response.successObject.organizationTypeList;
	var departmentCategoryList = response.successObject.departmentCategoryList;
	var geoCountriesList = response.successObject.geoCountriesList;
	var geoCitiesList = response.successObject.geoCitiesList;
	var geoAreasList = response.successObject.geoAreasList;
	var geoLocationsList = response.successObject.geoLocationsList;
	var kpiList = response.successObject.kpiList;

	console.log("geoCountriesList.length "+geoCountriesList.length+" geoCitiesList.length "+geoCitiesList.length+" geoAreasList.length "+geoAreasList.length);
	
	var html = "";
	html+=	addFormHeading("Add Organization");
	html+=	'<form class="col-sm-12" id="addOrganizationForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addOrganizationErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	/********************************************************************************************************************
	 *									Organization Group
	 *********************************************************************************************************************/
	html+=	'<h4>Organizational Grouping <font style="color: red">*</font></h4><hr>';
	/** ************************************Organization Group Dropdown***************************************************** */
	if(organizationGroupList.length>0){
		html += '<div class="form-group" id="Add-organizationGroupId-Error">';
		html += '<label>Organization Group<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="organizationGroupId-span-Error" class="help-inline"></span>'
		html +=	'<select class="form-control" id="addOrganization-organizationGroupId" style="width: 50%" onchange="getOrganizationBrands()">';
		html+=	'<option value="0">Select</option>';
		for(var i=0;i<organizationGroupList.length;i++){
			var id = organizationGroupList[i].id;
			var organizationGroupName = organizationGroupList[i].organizationGroupName;
			html+=	'<option value='+id+'>'+organizationGroupName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-organizationGroupId-Error">';
		html += '<label>Organization Group<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled"><option>No Organization Groups Found</option></select>';
		html += '<option  value="0">Select</option>';
		html += '</div>';
	}
	
	/** ************************************Organization Brand Dropdown***************************************************** */
	if(organizationBrandList.length>0 && organizationGroupList.length>0){
		html += '<div class="form-group" id="Add-organizationBrandId-Error">';
		html += '<label>Organization Brand<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="organizationBrandId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="addOrganization-organizationBrandId" style="width: 50%">';
		html+=	'<option value="0">Select</option>';
		/*for(var i=0;i<organizationBrandList.length;i++){
			var id = organizationBrandList[i].id;
			var organizationBrandName = organizationBrandList[i].organizationBrandName;
			html+=	'<option value='+id+'>'+organizationBrandName+'</option>';
		}*/
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-organizationBrandId-Error">';
		html += '<label>Organization Brand<font style="color: red">*</font></label>';
		html +=	'<select class="form-control input-sm" disabled="disabled" id="addOrganization-organizationBrandId"><option>No Organization Brands Found</option></select>';
		html+=	'<option value="0">Select</option>';
		html += '</div>';
	}
	/** ************************************Organization Name***************************************************** */
	html += '<div class="form-group" id="Add-organizationFullName-Error">';
	html += '<label>Organization Name<font style="color: red">*</font></label>';
	html += '<span style="color: #a94442" id="organizationFullName-span-Error" class="help-inline"></span>';
	html += '<input	type="text" class="form-control input-sm" id="organizationFullName" placeholder="Enter Organization Name" maxlength="50">';
	html += '</div>';

	/** ************************************Client Check Box***************************************************** */
	html += '<div>';
	html += '<label>Client<font style="color: red"></font></label>&nbsp  ';
	html += '<input	type="checkbox" id="organizationClientCheckBox">';
	html += '</div><hr>';
	
	/** ************************************Organization Check Box***************************************************** */
	html += '<div>';
	html += '<label>Organization<font style="color: red"></font></label>&nbsp  ';
	html += '<input	type="checkbox" id="organizationClientCheckBox">';
	html += '</div><hr>';
	
	/** ************************************Email Enabled Check Box***************************************************** */
	html += '<div>';
	html += '<label>emailEnabled<font style="color: red"></font></label>&nbsp  ';
	html += '<input	type="checkbox" id="organizationCheckBox">';
	html += '</div><hr>';
	/******************************************************************************************************************** */
	
	/**									Classification
	 *********************************************************************************************************************/
	html+=	'<h4>Classification <font style="color: red">*</font></h4><hr>';
	/*************************************Industry Dropdown***************************************************************/
	if(industryTypesList.length>0){
		html += '<div class="form-group" id="Add-industryTypeId-Error">';
		html += '<label>Industry<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="industryTypeId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="addOrganization-industryTypeId" style="width: 50%" onchange="getSegmentCategory()">';
		html+=	'<option value="0">Select</option>';
		for(var i=0;i<industryTypesList.length;i++){
			var id = industryTypesList[i].id;
			var industryType = industryTypesList[i].industryType;
			html+=	'<option value='+id+'>'+industryType+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-industryTypeId-Error" >';
		html += '<label>Industry<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="addOrganization-industryTypeId" onchange="getSegmentCategory()"><option>No Industry Types Found</option></select>';
		html+=	'<option value="0">Select</option>';
		html += '</div>';
	}
	/*************************************Segment Category Dropdown***************************************************************/
	
	if(segmentCategoryList.length>0 || industryTypesList.length>0){
		html += '<div class="form-group" id="Add-segmentCategoryId-Error">';
		html += '<label>Segment Category<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="segmentCategoryId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="addOrganization-segmentCategoryId" style="width: 50%" onchange="getOrganizationCategory()">';
		html+=	'<option value="0">Select</option>';
		/*for(var i=0;i<segmentCategoryList.length;i++){
			var id = segmentCategoryList[i].id;
			var segmentCategory = segmentCategoryList[i].segmentCategory;
			html+=	'<option value='+id+'>'+segmentCategory+'</option>';
		}*/
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-segmentCategoryId-Error" >';
		html += '<label>Segment Category<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="addOrganization-segmentCategoryId" style="width: 50%" onchange="getOrganizationCategory()"><option>No Segment Categories Found</option></select>';
		html+=	'<option value="0">Select</option>';
		html += '</div>';
	}
	/*************************************Organization Type Dropdown***************************************************************/
	console.log("check segmentCategoryList length: "+segmentCategoryList.length +" industryTypesList.length  "+ industryTypesList.length);
	console.log("length organizationTypeList "+organizationTypeList.length);
	if(segmentCategoryList.length>0 || industryTypesList.length>0 || organizationTypeList.length>0){
		html += '<div class="form-group" id="Add-organizationTypeId-Error">';
		html += '<label>Organization Type<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="organizationTypeId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="addOrganization-organizationTypeId" style="width: 50%" onchange="getDepartmentTypes()">';
		html+=	'<option value="0">Select</option>';
	/*	for(var i=0;i<organizationTypeList.length;i++){
			var id = organizationTypeList[i].id;
			var organizationType = organizationTypeList[i].organizationType;
			html+=	'<option value='+id+'>'+organizationType+'</option>';
		}*/
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-organizationTypeId-Error" >';
		html += '<label>Organization Type<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="addOrganization-organizationTypeId" style="width: 50%" onchange="getDepartmentTypes()"><option>No Organization Types Found</option></select>';
		html+=	'<option value="0">Select</option>';
		html += '</div>';
	}
	/********************************************************************************************************************
	 *				Organization Geo Locations
	 *********************************************************************************************************************/
	html+=	'<h4>Organization Geo Locations<font style="color: red">*</font></h4><hr>';
	
	/*************************************Country Dropdown***************************************************************/
	if(geoCountriesList.length>0){
		html += '<div class="form-group" id="Add-geoCounrtyId-Error">';
		html += '<label>Country<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="geoCounrtyId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="add-organization-geoCounrtyId" style="width: 50%" onchange="getCities()">';
		html+=	'<option value="0">Select</option>';
		for(var i=0;i<geoCountriesList.length;i++){
			var id = geoCountriesList[i].id;
			var countryName = geoCountriesList[i].geoCountryName;
			html+=	'<option value='+id+'>'+countryName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-geoCounrtyId-Error">';
		html += '<label>Country<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="add-organization-geoCounrtyId" onchange="getCities()"><option>No Countries Found</option></select>';
		html+=	'<option value="0">Select</option>';
		html += '</div>';
	}
	/*************************************City Dropdown***************************************************************/
	if(geoCountriesList.length>0 && geoCitiesList.length>0){
		html += '<div class="form-group" id="Add-geoCityId-Error">';
		html += '<label>City<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="geoCityId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="add-organization-CityId" style="width: 50%" onchange="getAreas()">';
		html+=	'<option value="0">Select</option>';
	/*	for(var i=0;i<geoCitiesList.length;i++){
			var id = geoCitiesList[i].id;
			var cityName = geoCitiesList[i].geoCityName;
			html+=	'<option value='+id+'>'+cityName+'</option>';
		}*/
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error">';
		html += '<label>City<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="add-organization-geoCounrtyId" onchange="getAreas()"><option>No Cities Found</option></select>';
		html+=	'<option value="0">Select</option>';
		html += '</div>';
	}
	/*************************************Area Dropdown***************************************************************/
	
	if(geoCountriesList.length>0 && geoCitiesList.length>0 && geoAreasList.length>0){
		html += '<div class="form-group" id="Add-geoAreaId-Error">';
		html += '<label>Area<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="geoAreaId-span-Error" class="help-inline"></span>';
		html +=	'<select class="form-control" id="add-organization-AreaId" style="width: 50%" onchange="locationsByAreaId()">';
		html+=	'<option value="0">Select</option>';
		/*for(var i=0;i<geoAreasList.length;i++){
			var id = geoAreasList[i].id;
			var areaName = geoAreasList[i].geoAreaName;
			html+=	'<option value='+id+'>'+areaName+'</option>';
		}*/
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="Add-geoAreaId-Error">';
		html += '<label>Area<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="add-organization-AreaId" onchange="locationsByAreaId()"><option>No Areas Found</option></select>';
		html+=	'<option value="0">Select</option>';
		html += '</div>';
	}
	/*************************************Select Location ***************************************************************/
	html+= '<div>';
	/*if(geoLocationsList.length>0)*/
	{
	html+=	'<div id="organizationSearchLocationsDiv">';
	html+=		'<label>Search Locations</label><br>';
	/*if(geoLocationsList.length>0)*/
	{
		html+=	'<input type=text list="organizationLocations">';
		html+=	'<datalist id="organizationLocations">';
		for(var i=0;i<geoLocationsList.length;i++){
			html+=	'<option value='+geoLocationsList[i].geoName+'>'+geoLocationsList[i].id+'</option>';
		}
		html+=	'</datalist>';
	}
	/*else{
		html+=	'<font style="color: red"><b>No Locations Found For Selected Area</b></font>';
	}*/
	html+=	'<hr>';
	html+=	'<div class="form-group">';
	html+=	'<div>';
	html+=	'<select id="organizationAreaLocations" multiple size="5" class="col-xs-3">';
	if(geoLocationsList.length>0){
		for(var i=0;i<geoLocationsList.length;i++)
		html+=	'<option value='+geoLocationsList[i].id+'>'+geoLocationsList[i].geoName+'</option>';
	}
	html+=	'</select> &nbsp;';
	html+=	'<a href="JavaScript:void(0);" id="add-locations" onclick="addLocations()" class="col-xs-1">Add&raquo;</a>';
	html+=	'<a href="JavaScript:void(0);" id="remove-added-locations" onclick="removeLocations()" class="col-xs-2">&laquo;Remove</a>';
	html+=	'<select id="selectedOrganizationAreaLocations" multiple size="5" class="col-xs-3">';
	html+=	'</select>';
	html+=	'</div>';
	html+=	'</div><br> <br> <br> <br>';
	/****************************************Locations MultiSelect DropDown**********************************************/
	html+=	'</div>';
	html+=	'</div>';
	}
	/*else{
		html+=	'<div id="organizationEmptyLocationsDiv" style="display: none;">';
		html+=	'<font style="color:red"><b>No Locations Found For Selected Area</b></font>';
		html+=	'</div>';
	}*/
	html+=	'</div>';
	/*************************************Select KPIS ***************************************************************/
	html+= '<div>';
	/*if(kpiList.length>0)*/
	{
		html+=	'<div id="organizationSearchKpisDiv">';
		html+=		'<label>Search Kpis</label><br>';
		html+=	'<input type=text list="organizationKpisDataList">';
		html+=	'<datalist id="organizationKpisDataList">';
		if(kpiList.length>0){
			for(var i=0;i<kpiList.length;i++){
				html+=	'<option value='+kpiList[i].kpiName+'>'+kpiList[i].id+'</option>';
			}
		}else{
			html+=	'<font style="color: red"><b>No KPIS Found For Selected Segment Type</b></font>';
		}
		html+=	'</datalist>';
		html+=	'<hr>';
		html+=	'<div class="form-group">';
		html+=	'<div>';
		html+=	'<select id="organizationKpis" multiple size="5" class="col-xs-3">';
		if(kpiList.length>0){
			for(var i=0;i<kpiList.length;i++)
			html+=	'<option value='+kpiList[i].id+'>'+kpiList[i].kpiName+'</option>';
		}
		html+=	'</select> &nbsp;';
		html+=	'<a href="JavaScript:void(0);" id="add-kpis" onclick="addKpis()" class="col-xs-1">Add&raquo;</a>';
		html+=	'<a href="JavaScript:void(0);" id="remove-added-kpis" onclick="removeAddedKpis()" class="col-xs-2">&laquo;Remove</a>';
		html+=	'<select id="selectedOrganizationKpis" multiple size="5" class="col-xs-3">';
		html+=	'</select>';
		html+=	'</div>';
		html+=	'</div><br> <br> <br> <br>';
		/****************************************KPIS MultiSelect DropDown**********************************************/
		html+=	'</div>';
		html+=	'</div>';
	}
	/*else{
		html+=	'<div id="organizationEmptyKpisDiv">';
		html+=	'<font style="color:red"><b>No KPIS Found For Selected Segment Type</b></font>';
		html+=	'</div>';
	}*/
	html+=	'</div>';
	
	/****************************************Organization Attribute Values**********************************************/
	html+=	'<div>';
	html+=		'<h4>Organization Attribute Values</h4><hr>';
	html+=	'</div>';
   	/******************Attributes*****************************************************************/
	html+=	'<div id="attributesDiv">';
	if(organizationAttributeList.length>0)
	{
		for(var i=0;i<organizationAttributeList.length;i++){
			html+=	'<div class="form-group">';
			html+=	'<label>'+organizationAttributeList[i].attributeKey+'</label>';
			html+=	'<input type="text" placeholder="Please Enter "'+organizationAttributeList[i].attributeKey+'"" class="form-control" maxlength="50" id="attributeKeyValue_"'+i+'>';
			html+=	'<input type="hidden" id="attributeKeyId_'+i+'" value='+organizationAttributeList[i].id+'>';
			html+=	'</div>';
		}
	}
	else{
		html+=	'<font style="color: red;"><b>No Attributes Found For Selected Organization Type,Please Select Organization Type</b></font><br>';
	}
	html+=	'</div>';
	
	html+=	'<div id="attributesEmptyDiv" style="display: none;">';
	html+=	'<font style="color: red;"><b>No Attributes Found For Selected Organization Type,Please Select Organization Type</b></font><br>';
	html+=	'</div>';
	
   /*if(organizationGroupList.length==0 || organizationBrandList.length==0 || organizationTypeList.length==0 || segmentCategoryList.length==0 || industryTypesList.length==0){
		
		html+= '<br><input type="button" class="btn btn-primary" value="Add" disabled="disabled" onclick ="saveOrganization()">';
	
	}else{
		*//** ************************************Button***************************************************** *//*
		html+= '<br><input type="button" class="btn btn-primary" value="Add" onclick ="saveOrganization()">';
		html+=	appendCancelButton(getDivId("Organization"),"page-wrapper");//Adding Cancel Button
	}*/
	
	/** ************************************Button***************************************************** */
	
	html+= '<br><input type="button" class="btn btn-primary" value="Add"  onclick ="saveOrganization()">';
	html+=	appendCancelButton(getDivId("Organization"),"page-wrapper");//Adding Cancel Button
	
	html+= '</form>';
	return html;
}


/***********************************************************************************************
 * 				      Disable for Add Button Dileep                                               *
 ************************************************************************************************/

/*function disableAddButton(){
	var orgGroupType=$('#addOrganization-organizationGroupId option:selected').val();
	var orgBrandType=$('#addOrganization-organizationBrandId option:selected').val();
	var industryType=$('#addOrganization-industryTypeId option:selected').val();
	var segmentCategoryType=$('#addOrganization-segmentCategoryId option:selected').val();
	var organizationType=$('#addOrganization-organizationTypeId option:selected').val();
	var countryType=$('#addOrganization-CountryId option:selected').val();
	var cityType=$('#addOrganization-CityId option:selected').val();
	var areaType=$('#addOrganization-AreaId option:selected').val();
	html ="";
	console.log(orgGroupType,orgBrandType,industryType);
	if(orgGroupType==undefined || orgBrandType==undefined ||industryType==undefined ||segmentCategoryType==undefined || organizationType==undefined || countryType==undefined || cityType==undefined || areaType==undefined){
		html+= '<br><input type="button" class="btn btn-primary" value="Add" disabled="disabled" onclick ="saveOrganization()">';
		html+=	appendCancelButton(getDivId("Organization"),"page-wrapper");//Adding Cancel Button
    }else{
    	html+= '<br><input type="button" class="btn btn-primary" value="Add" onclick ="saveOrganization()">';
    	html+=	appendCancelButton(getDivId("Organization"),"page-wrapper");//Adding Cancel Button
    }
	return html;
}*/

/***********************************************************************************************
 * 				      Organization Brand Values                                                *
 ************************************************************************************************/
function getOrganizationBrands(){
	var selectedOrganizationGroupId = $('#addOrganization-organizationGroupId option:selected').val();
	if(selectedOrganizationGroupId==undefined){
		selectedOrganizationGroupId = 0;
	}
/*	if(selectedOrganizationGroupId == 0){
		console.log("comming inside....");
		$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
	}*/
	$('#page-wrapper').mask('Loading...');
	$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
	$('#addOrganization-organizationBrandId').prop('disabled',false);
	$('#addOrganizationForm').find('#Add-organizationBrandId-Error').removeClass('has-error has-feedback');
	$('#addOrganization-organizationBrandId').prop('disabled',false);
	
	$.get(organizationUrl+"getBrandByGroupId.htm?organizationGroupId="+selectedOrganizationGroupId,function(response){
		$('#addOrganization-organizationBrandId').html('');//Clearing Dependent Dropdown Values
		var organizationBrandList = response.successObject.organizationBrandList;
		if(organizationBrandList.length>0){
			$('#addOrganization-organizationBrandId').append("<option value='0'>Select</option>");
			for(var i=0;i<organizationBrandList.length;i++){
				$('#addOrganization-organizationBrandId').append("<option value="+organizationBrandList[i].id+">"+organizationBrandList[i].organizationBrandName+"</option>");
			}
		}else{
			$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
			$('#addOrganizationForm').find('#Add-organizationBrandId-Error').addClass('has-error has-feedback');
			var message = '<font style="color:red">Select</font>';
			$('#addOrganization-organizationBrandId').append('<option>'+message+'</option>');
			$('#addOrganization-organizationBrandId').prop('disabled',true);
		}
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"***************"+response.statusText);
	});
	return false;
}

/***********************************************************************************************
 * 				Segment  Category Values 
************************************************************************************************/
function getSegmentCategory(){
	$('#page-wrapper').mask('Loading...');
	var selectedIndustryTypeId = $('#addOrganization-industryTypeId option:selected').val();
	if(selectedIndustryTypeId==undefined){
		selectedIndustryTypeId = 0;
	}
	$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
	$('#addOrganizationForm').find('#Add-segmentCategoryId-Error,#Add-organizationTypeId-Error').removeClass('has-error has-feedback');
	$('#addOrganization-segmentCategoryId').prop('disabled',false);//Enabling Segment Category DropDown
	$('#addOrganization-organizationTypeId').prop('disabled',false);//Enabling Organization Category DropDown
	$.ajax({
		type:"POST",
		url:organizationUrl+"getSegmentCategoryList.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedIndustryTypeId),
		success:function(response){
			$('#addOrganization-segmentCategoryId').html('');
			$('#addOrganization-organizationTypeId').html('');
			if(response.status=="SEGMENT_CATEGORIES_LIST_SUCCESS"){
				var segmentCategoires = response.successObject.segmentCategoires;
				console.log("segmentCategoires "+segmentCategoires.length);
				$('#addOrganization-segmentCategoryId').append("<option value='0'>Select</option>");
				for(var i=0;i<segmentCategoires.length;i++){
					$('#addOrganization-segmentCategoryId').append('<option value='+segmentCategoires[i].id+'>'+segmentCategoires[i].segmentCategory+'</option>');
				}
				$('#addOrganization-organizationTypeId').append("<option value='0'>Select</option>");
				//getOrganizationCategory();//Getting Organization Category DropDown Values
				disableButton();
				getKpis();
				$('#page-wrapper').unmask();
				
			}else if(response.status=="EXCEPTION_ERROR"){
					$('#page-wrapper').mask(response.errorMessage);
			}else{
				$('#addOrganizationForm').find('#Add-segmentCategoryId-Error,#Add-organizationTypeId-Error').addClass('has-error has-feedback');
				var message = '<font style="color:red">Select</font>';
				var emptyOrganizationCategory = '<font style="color:red">Select</font>';
				$('#addOrganization-segmentCategoryId').append('<option>'+message+'</option>');
				$('#addOrganization-organizationTypeId').append('<option value="0">'+emptyOrganizationCategory+'</option>');
				$('#addOrganization-segmentCategoryId,#addOrganization-organizationTypeId').prop('disabled',true);
				$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
				getKpis();//Getting Associated KPIS
				getAttributes();//Getting Attributes
				$('#page-wrapper').unmask();
			}
			
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*************"+response.statusText);
		}
	});
}
/***********************************************************************************************
 * 				Organization  Category Values 
************************************************************************************************/
function getOrganizationCategory(){
	$('#page-wrapper').mask('Loading...');
	var selectedSegementCategoryId = $('#addOrganization-segmentCategoryId option:selected').val();
	if(selectedSegementCategoryId==undefined){
		selectedSegementCategoryId = 0;
	}
	$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
	$('#addOrganizationForm').find('#Add-organizationTypeId-Error').removeClass('has-error has-feedback');
	$('#addOrganization-organizationTypeId').prop('disabled',false);//Enabling Organization Category DropDown
	$.ajax({
		type:"POST",
		url:organizationUrl+"getOrganizationTypeList.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedSegementCategoryId),
		success:function(response){
			$('#addOrganization-organizationTypeId').html('');//Clearing Organization Category DropDown Value
			if(response.status=="ORGANIZATION_TYPES_LIST_SUCCESS"){
				var organizationTypes = response.successObject.organizationTypes;
				$('#addOrganization-organizationTypeId').append("<option value='0'>Select</option>");
				for(var i=0;i<organizationTypes.length;i++){
					$('#addOrganization-organizationTypeId').append('<option value='+organizationTypes[i].id+'>'+organizationTypes[i].organizationType+'</option>');
				}
				disableButton();
				getDepartmentTypes();//Get Department Types
				getAttributes();//Getting Attributes
				$('#page-wrapper').unmask();
			}else if(response.status=="ORGANIZATION_TYPES_LIST_EMPTY"){
				$('#addOrganizationForm').find('#Add-organizationTypeId-Error').addClass('has-error has-feedback');
				var emptyOrganizationCategory = '<font style="color:red">Select</font>';
				$('#addOrganization-organizationTypeId').append('<option value="0">'+emptyOrganizationCategory+'</option>');
				$('#addOrganization-organizationTypeId').prop('disabled',true);
				$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
				$('#page-wrapper').unmask();
				getDepartmentTypes();//Get Department Types
				getAttributes();//Getting Attributes
			}else{
				$('#page-wrapper').mask(response.errorMessage);
			}
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*************"+response.statusText);
		}
	});
}
/***********************************************************************************************
 * 				City  DropDown Values
***********************************************************************************************/	
function getCities(){
	$('#page-wrapper').mask('Loading...');
	var selectedOrganizationCountryId = $('#add-organization-geoCounrtyId option:selected').val();
	if(selectedOrganizationCountryId==undefined){
		selectedOrganizationCountryId = 0;
	}
	$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
	$('#addOrganizationForm').find('#Add-geoCityId-Error,#Add-geoAreaId-Error').removeClass('has-error has-feedback');
	$('#add-organization-CityId').prop('disabled',false);
	$('#add-organization-AreaId').prop('disabled',false);
	$.ajax({
		type:"POST",
		url:geoAreaUrl+"getCitiesByCountryId.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedOrganizationCountryId),
		success:function(response){
			$('#add-organization-CityId').html('');
			$('#add-organization-AreaId').html('');
			if(response.status=="LIST_CITIES_SUCCESS"){
				var listCities = response.successObject.listCities;
				$("#add-organization-CityId").append("<option value='0'>Select</option>");
				for(var i=0;i<listCities.length;i++){
					$("#add-organization-CityId").append("<option value="+listCities[i].id+">"+listCities[i].geoCityName+"</option>");
				}
				$("#add-organization-AreaId").append("<option value='0'>Select</option>");
				//getAreas();
				disableButton();
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}else{
				$('#addOrganizationForm').find('#Add-geoCityId-Error','#Add-geoAreaId-Error').addClass('has-error has-feedback');
				var message = '<font style="color:red">Select</font>';
				var emptyAreaMessage = '<font style="color:red">Select</font>';
				$('#add-organization-AreaId').append('<option value="0">'+emptyAreaMessage+'</option>');
				$('#add-organization-CityId').append('<option value="0">'+message+'</option>');
				$('#add-organization-AreaId,#add-organization-CityId').prop('disabled',true);
				$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
				locationsByAreaId();
			}
			$('#page-wrapper').unmask();
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*************"+response.statusText);
		}
	});
}
/***********************************************************************************************
 * 				Area DropDown Values
***********************************************************************************************/
function getAreas(){
	$('#page-wrapper').mask('Loading...');
	var selectedOrganizationGeoAreaId = $('#add-organization-CityId option:selected').val();
	console.log("selectedOrganizationGeoAreaId---------- "+selectedOrganizationGeoAreaId);
	if(selectedOrganizationGeoAreaId==undefined){
		selectedOrganizationGeoAreaId = 0;
	}
	$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
	$('#addOrganizationForm').find('#Add-geoAreaId-Error').removeClass('has-error has-feedback');
	$('#add-organization-AreaId').prop('disabled',false);
	$.ajax({
		type:"POST",
		url:geoLocationUrl+"getAreasByCityId.htm",
		contentType:"application/json",
		data:JSON.stringify(selectedOrganizationGeoAreaId),
		success:function(response){
			$('#add-organization-AreaId').html('');
			if(response.status=="AREAS_LIST_SUCCESS"){
				var listAreas = response.successObject.listAreas;
				$("#add-organization-AreaId").append("<option value='0'>Select</option>");
				for(var i=0;i<listAreas.length;i++){
					$("#add-organization-AreaId").append("<option value="+listAreas[i].id+">"+listAreas[i].geoAreaName+"</option>");
					$('#page-wrapper').unmask();
				}
				disableButton();
				//locationsByAreaId();//Adding Data To Search Locations
			}else if(response.status=="EXCEPTION_ERROR"){
				$('#page-wrapper').mask(response.errorMessage);
			}else{
				$('#addOrganizationForm').find('#Add-geoAreaId-Error').addClass('has-error has-feedback');
				var message = '<font style="color:red">No Area Found</font>';
				$('#add-organization-AreaId').append('<option value="0">'+message+'</option>');
				/*$('#Add-geoAreaId-Error').append(' <font style="color:red"> No Area Found </font>');*/
				$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
				$('#add-organization-AreaId').prop('disabled',true);
				locationsByAreaId();
			}
			$('#page-wrapper').unmask();
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"*************"+response.statusText);
		}
	});

}
/***********************************************************************************************
 * 				Search Locations 
***********************************************************************************************/	
function locationsByAreaId(){
var selectedOrganizationAreaId = $('#add-organization-AreaId option:selected').val();
if(selectedOrganizationAreaId==undefined){
	selectedOrganizationAreaId = 0;
}
$('#page-wrapper').mask('Loading...');
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
				console.log("locations[i].geoName "+locations[i].geoName+" locations[i].id "+locations[i].id);
				$('#organizationLocations').append('<option value='+locations[i].geoName+'>'+locations[i].id+'</option>');
				$('#organizationAreaLocations').append('<option value='+locations[i].id+'>'+locations[i].geoName+'</option>');
				$('#organizationSearchLocationsDiv').show(600);
			}
			$('#page-wrapper').unmask();
		}else if(response.status=="LOCATIONS_EMPTY"){
			$('#organizationLocations').append('<option>No Locations Found</option>');
			$('#organizationAreaLocations').append('<option>No Locations Found</option>');
			$('#organizationSearchLocationsDiv').hide(600);
			$('#organizationEmptyLocationsDiv').show(600);
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},error:function(response){
		$('#page-wrapper').mask(response.status+"**************"+response.statusText);
	}
});
return false;
}
/***********************************************************************************************
* 				Search KPI(s) 
***********************************************************************************************/	
function getKpis(){
$('#organizationEmptyKpisDiv').hide();
var selectedIndustryTypeId = $('#addOrganization-industryTypeId option:selected').val();
if(selectedIndustryTypeId==undefined){
	selectedIndustryTypeId = 0;
}
$('#page-wrapper').mask('Loading...');
$.ajax({
	type:"POST",
	url:organizationUrl+"getKpisByIndustryTypeId.htm",
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
			$('#page-wrapper').unmask();
		}else if(response.status=="KPI_LIST_EMPTY"){
			$('#organizationSearchKpisDiv').hide(600);
			$('#organizationEmptyKpisDiv').show(600);
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},error:function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
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
var selectedOrganizationCategoryId = $('#addOrganization-organizationTypeId option:selected').val();
var selectedCityId = $('#add-organization-CityId option:selected').val();
var selectedAreaId = $('#add-organization-AreaId option:selected').val();
//@d
/*if(selectedOrganizationBrandId==0 ||selectedSegmentCategoryId==0 ||selectedOrganizationCategoryId==0 ||selectedCityId==0|| selectedAreaId==0){
	$('input[type=button]', $('#addOrganizationForm')).prop('disabled', true);
}else{
	$('input[type=button]', $('#addOrganizationForm')).prop('disabled', false);
}*/

}	
/***********************************************************************************************
* 				DepartmentType & AttriButes 
***********************************************************************************************/
function getDepartmentTypes(){
var selectedOrganizationTypeId = $('#addOrganization-organizationTypeId option:selected').val();
$('#page-wrapper').mask('Loading...');
$('#add-organization-departmentTypeId').prop('disabled',false);
$('#addOrganizationForm').find('#organizationDepartmentTypeDropDownDiv').removeClass('has-error has-feedback');
if(selectedOrganizationTypeId==undefined){
	selectedOrganizationTypeId = 0;
}
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
			$('#page-wrapper').unmask();
			getAttributes();
		}else if(response.status=="DEPARTMENTS_LIST_SUCCESS"){
			var departmentTypes = response.successObject.departmentCategories;
			for(var i=0;i<departmentTypes.length;i++){
				$('#add-organization-departmentTypeId').append('<option value='+departmentTypes[i].id+'>'+departmentTypes[i].departmentType+'</option>');
			}
			getAttributes();
			$('#page-wrapper').unmask();
		}
		else{
			$('#page-wrapper').mask(response.errorMessage);
		}
		
	},error:function(response){
		$('#page-wrapper').mask(response.status+"************"+response.statusText);
	}
	
});
return false;
}
/***********************************************************************************************
* 				AttriButes 
***********************************************************************************************/
function getAttributes(){
var selectedOrganizationTypeId = $('#addOrganization-organizationTypeId option:selected').val();
if(selectedOrganizationTypeId==undefined){
	selectedOrganizationTypeId = 0;
}
$('#page-wrapper').mask('Loading...');
$.ajax({
	type:"POST",
	url:organizationUrl+"getAttributes.htm",
	contentType:"application/json",
	data:JSON.stringify(selectedOrganizationTypeId),
	success:function(response){
		if(response.status=="ATTRIBUTES_LIST_SUCCESS"){
			$('#page-wrapper').unmask();
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
			$('#page-wrapper').unmask();
		}
	},error:function(response){
		$('#page-wrapper').mask(response.status+"*************"+response.statusText);
	}
});
return false;
}
/***********************************************************************************************
* 				Multi Select Location
***********************************************************************************************/
function addLocations(){
	$('#organizationAreaLocations option:selected').each( function() {
	        $('#selectedOrganizationAreaLocations').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}
function removeLocations(){
	$('#selectedOrganizationAreaLocations option:selected').each( function() {
	    $('#organizationAreaLocations').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}

/***********************************************************************************************
* 				Multi KPI(s)
***********************************************************************************************/
function addKpis(){
	$('#organizationKpis option:selected').each( function() {
	        $('#selectedOrganizationKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}
function removeAddedKpis(){
	$('#selectedOrganizationKpis option:selected').each( function() {
	    $('#organizationKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	    $(this).remove();
	});

}

/***********************************************************************************************
* 				Save Organization
***********************************************************************************************/
function saveOrganization(){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("Organization"));
	$('#addOrganizationErrorDiv').hide();
	$('#addOrganizationSuccessDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	var organizationGroupId= $('#addOrganization-organizationGroupId option:selected').val();
	var organizationBrandId = $('#addOrganization-organizationBrandId option:selected').val();
	var organizationFullName = $.trim($('#organizationFullName').val());
	
	var industryTypeId = $('#addOrganization-industryTypeId option:selected').val();
	var segmentTypeId = $('#addOrganization-segmentCategoryId option:selected').val();
	var organizationTypeId = $('#addOrganization-organizationTypeId option:selected').val();
	
	var geoCounrtyId = $('#add-organization-geoCounrtyId option:selected').val();
	var geoCityId = $('#add-organization-CityId option:selected').val();
	var geoAreaId = $('#add-organization-AreaId option:selected').val();
	
	var selectedLocations = $('#selectedOrganizationAreaLocations > option').length;
	var selectedKpis = $('#selectedOrganizationKpis > option').length;
	var attributesLength = $('#attributesLength').val();
	
	console.log();
	var organizationAttributes = [];
	var organizationKPIs = [];
	var geoLocations = [];
	var clientChecked = 0;
	var emailChecked = 0;
	var organizationChecked=0;
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
	console.log(attributesLength);
	if(attributesLength>0){
		for(var i=0;i<attributesLength;i++){
			var attributeKeyId = $('#attributeKeyId_'+i).val();
			var attributeKeyValue = $('#attributeKeyValue_'+i).val();
			organizationAttributes.push({'attributeKeyId':attributeKeyId,'attributeValue':attributeKeyValue});
		}
	}
	
	if($('#organizationClientCheckBox').is(':checked')){
		clientChecked = 1;
	};
	if($('#organizationEmailCheckBox').is(':checked')){
		emailChecked = 1;
	};
	if($('#organizationCheckBox').is(':checked')){
		organizationChecked = 1;
	};
	var organizationJSONObject = {'organizationChecked':organizationChecked,'emailChecked':emailChecked,'clientChecked':clientChecked,'organizationFullName':organizationFullName,'organizationGroupId':organizationGroupId,'organizationTypeId':organizationTypeId,'organizationBrandId':organizationBrandId,'industryTypeId':industryTypeId,
			                     'segmentTypeId':segmentTypeId,'geoCounrtyId':geoCounrtyId,'geoCityId':geoCityId,'geoAreaId':geoAreaId,'organizationKPIs':organizationKPIs,'organizationAttributes':organizationAttributes,'geoLocations':geoLocations};
	console.log(organizationJSONObject);
	var orgGroup = $("#selectedOrgGroupNameType").val();
	var orgBrand = $("#selectedOrgBrandNameType").val();
	var orgName = $("#selectedOrgNameType").val();
	var country = $("#selectedCountryTypeForOrg").val();
	var city = $("#selectedCityTypeForOrg").val();
	var area = $("#selectedAreaTypeForOrg").val();
	var client = $("#selectedClientIDs").is(':checked') ? 1 : 0;
	var clientId= $("#")
	var orgId = $("#selectedOrgNameType").val();
	
	var id = [];
	var sendOrgInfo = {
		'orgGroup' : orgGroup,
		'orgBrand' : orgBrand,
		'orgName' : orgName,
		'country' : country,
		'city' : city,
		'area' : area,
		'client' : client,
		'orgid' : orgId,
		'ids' :id
	};
	 $.ajax({
		type:"POST",
		url:organizationUrl+"save.htm?sendOrgInfo="+JSON.stringify(sendOrgInfo),
		contentType:"application/json",
		data:JSON.stringify(organizationJSONObject),
		success:function(response){
			if(response.status=="SAVE_ERROR" || response.status == "EMPTY_BRAND_NAME" || response.status == "EMPTY_GROUP_NAME"||response.status=="EMPTY_ORGFULL_NAME"||
					response.status=="ORGFULLNAME_LENGTH"||response.status == "ORGFULLNAME_EXIST" || response.status == "EMPTY_INDUSTRY_TYPEID" || response.status == "EMPTY_SEGMENT_TYPEID" ||
					response.status=="EMPTY_ORGANIZATION_TYPEID"||response.status=="EMPTY_COUNTRY_TYPEID"|| response.status=="EMPTY_CITY_TYPEID" || response.status=="EMPTY_AREA_TYPEID"
					
			){
				//
				scrollDown(divId);
				$('#addOrganizationErrorDiv').show(600);
				for (var i = 0; i < response.errorMessageList.length; i++) {
					var fieldName = response.errorMessageList[i].fieldName;
					var errorMessage = response.errorMessageList[i].message;
					$('#Add-' + fieldName + '-Error').addClass('has-error has-feedback');
					$('#' + fieldName + '-span-Error').html(errorMessage);
				}
				//
			/*	scrollDown(divId);
				$('#addOrganizationErrorDiv').show(600);
				$('#Add-organizationDisplayName-Error').addClass('has-error has-feedback');
				$('#organizationFullName-span-Error').html(response.errorMessage);*/
				
				$('#page-wrapper').unmask();
			}else if(response.status=="SAVE_SUCCESS"){
				if($('#organizationListTable_wrapper').length == 0){
					var tabButtonsId = $('#organizationTabButtons');
					var dataDivId = $('#addAndEditOrganizationDiv');
					//var dataDivId = $('#organizationDataDiv');
					var successDivId = "addOrganizationSuccessDiv"
					var tableId = "organizationListTable";
					var html = listOrganizationFormHtml(response);
					generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				}else{
					var tabButtonsId = $('#organizationTabButtons');
					var dataDivId = $('#organizationDataDiv');
					var successDivId = "addOrganizationSuccessDiv"
					var tableId = "organizationListTable";
					var html = listOrganizationFormHtml(response);
					generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				}
				$('#page-wrapper').unmask();
				
			}else{
				$('#page-wrapper').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;
}
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

/**************************************************************************************************************************
 *                     Update Organization Form                                                                       *
 **************************************************************************************************************************/
function editOrganization(id,country,city,area){
	if(country=='null' && city=='null'&& city=='null'){
		country=0;
		city=0;
		area=0;
	}else{

	}
	$('selectClientSuccessDiv').hide();
	$('#editOrganizationSuccessDiv').hide();
	$('#selectClientSuccessDiv').hide();
	$('#page-wrapper').mask('Loading...');
	$.get(organizationUrl+"updateForm.htm?id="+id+"&country="+country+"&city="+city+"&area="+area,function(response){
		if(response.status=="UPDATE_FORM_SUCCESS"){
			var html = updateOrganizationFormHtml(response);
			var divId = $('#'+getDivId("Organization"));
			appendOrganizationAddOrEditForm(divId, html);
		}else{
			$('#page-wrapper').append('<font style="color:red">Error In Update Organization Form</font>');
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"***************"+response.statusText);
	});
	return false;
}


function updateOrganizationFormHtml(response){
	console.log(response);
	var selectedLocationsList = response.successObject.listSelectedLocations;
	var listLocationsForOrganization = response.successObject.listLocationsForOrganization;
	var listSelectedKpis = response.successObject.listSelectedKpis;
	var listKpisForOrganization = response.successObject.listKpisForOrganization;
	var organizationAttributesList = response.successObject.organizationAttributesList;
	var organizationAttributeList = response.successObject.organizationAttributeList;
	var organization = response.successObject.organization;
	var isClientEnabled  = response.successObject.isClientEnabled;
	/*var isEmailEnabled = response.successObject.isEmailEnabled;*/
	var isEmailEnabled = organization.emailTrigEnabled;
	var isOrganizationEnabled=organization.enabled;
	var listOfCountryNames = response.successObject.listOfCountryList;
	var listOfCityNames =response.successObject.listOfCityList;
	var listOfAreaNames =response.successObject.listOfAreaList
	var getCountryCityAreaNames= response.successObject.countryCityAreaName;
	var countryName;
	var cityName;
	var areaName;
	for(var i=0;i<getCountryCityAreaNames.length;i++){
		countryName=getCountryCityAreaNames[i].geoCountryName;
		cityName=getCountryCityAreaNames[i].geoCityName;
		areaName=getCountryCityAreaNames[i].geoAreaName;
	}
	console.log("country: "+countryName+" city: "+cityName+" area: "+areaName);
	var html = "";
	html+=	addFormHeading("Edit Organization");
		html+=	'<form class="col-sm-12" id="updateOrganizationForm">';
		/** ****************************************Error Div**************************************************** */
		html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editOrganizationErrorDiv">';
		html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
		html += '</div>';
		/** ************************************Organization Name***************************************************** */
		html += '<div class="form-group" id="Edit-organizationFullName-Error">';
		html += '<label>Organization Name<font style="color: red">*</font></label>';
		html += '<span style="color: #a94442" id="edit-organizationFullName-span-Error" class="help-inline"></span>';
		html += '<input	type="text" value="'+organization.organizationFullName+'" class="form-control input-sm" id="editedOrganizationFullName" placeholder="Enter Organization Name" maxlength="50">';
		html += '</div>';
		/** ************************************Client Check Box***************************************************** */
		html += '<div>';
		html += '<label>Client<font style="color: red"></font></label>&nbsp  ';
		if(isClientEnabled==true){
			html += '<input	type="checkbox" id="organizationUpdatedClientCheckBox" checked="checked">';
		}else{
			html += '<input	type="checkbox" id="organizationUpdatedClientCheckBox">';
		}
		html += '</div><hr>';

		html += '<div>';
		html += '<label>Organization<font style="color: red"></font></label>&nbsp  ';
		if(isOrganizationEnabled==true){
			html += '<input	type="checkbox" id="organizationUpdatedCheckBox" checked="checked">';
		}else{
			html += '<input	type="checkbox" id="organizationUpdatedCheckBox">';
		}
		html += '</div><hr>';
		
		html += '<div>';
		html += '<label>Email Trigger<font style="color: red"></font></label>&nbsp  ';
		if(isEmailEnabled==true){
			html += '<input	type="checkbox" id="organizationUpdatedEmailCheckBox" checked="checked">';
		}else{
			html += '<input	type="checkbox" id="organizationUpdatedEmailCheckBox">';
		}
		html += '</div><hr>';
		
		//dileep added for edit 
		html += '<div class="form-group" id="Edit-getGeoCounrtyId-Error">';
		if(countryName == null ){
			html += '<label id="CountryLbId" for="Country">Country <font style="color: red">*</font> ';
			html += '<span style="color: #a94442" id="edit-getGeoCounrtyId-span-Error" class="help-inline"></span>';
			html += '<select class="form-control input-sm" id="selectedCountryTypeForEditOrg"  onchange="getCityEdit()" >';
			html += '<option value="0">Select</option>';
			for (var i = 0; i < listOfCountryNames.length; i++) {
				html += '<option value='+listOfCountryNames[i].id+'>'
						+ listOfCountryNames[i].geoCountryName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';
		}else{
			html += '<label id="CountryLbId" for="Country">Country <font style="color: red">*</font> ';
			html += '<span style="color: #a94442" id="edit-getGeoCounrtyId-span-Error" class="help-inline"></span>';
			html += '<select class="form-control input-sm" id="selectedCountryTypeForEditOrg" onchange="getCityEdit()" >';
			html += '<option value="0">'+countryName+'</option>';
			for (var i = 0; i < listOfCountryNames.length; i++) {
				html += '<option value='+listOfCountryNames[i].id+'>'
						+ listOfCountryNames[i].geoCountryName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';
		}
		html+='</div>';
		
		html += '<div class="form-group" id="Edit-getGeoCityId-Error" >';
		if(cityName == null){
			html += '<label id="CityLbId"  for="City">City<font style="color: red">*</font>';
			html += '<span style="color: #a94442" id="edit-getGeoCityId-span-Error" class="help-inline"></span>';
			html +='<select disabled   class="form-control input-sm"  id="selectedCityTypeForEditOrg" onchange="getAreaNameEdit()">';
			html += '<option value="0">Select</option>';
			for (var i = 0; i < listOfCityNames.length; i++) {
				html += '<option value='+listOfCityNames[i].id+'>'
						+ listOfCityNames[i].geoCityName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';
		}else{
			html += '<label id="CityLbId"  for="City">City<font style="color: red">*</font>';
			html += '<span style="color: #a94442" id="edit-getGeoCityId-span-Error" class="help-inline"></span>';
			html+= '<select  class="form-control input-sm"  id="selectedCityTypeForEditOrg" onchange="getAreaNameEdit()">';
			html += '<option value="0">'+cityName+'</option>';
			for (var i = 0; i < listOfCityNames.length; i++) {
				html += '<option value='+listOfCityNames[i].id+'>'
						+ listOfCityNames[i].geoCityName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';
		}
		html += '</div>';
		
		html += '<div class="form-group" id="Edit-geoAreaId-Error">';
		if (areaName == null) {
			html += '<label id="AreaLbId"  for="Area">Area<font style="color: red">*</font>';
			html += '<span style="color: #a94442" id="edit-geoAreaId-span-Error" class="help-inline"></span>';
			html+='<select disabled class="form-control input-sm" id="selectedAreaTypeForEditOrg">';
			html += '<option value="0">Select</option>';
			for (var i = 0; i < listOfAreaNames.length; i++) {
				html += '<option value='+listOfAreaNames[i].id+'>'
						+ listOfAreaNames[i].geoAreaName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';
		} else {
			html += '<label id="AreaLbId"  for="Area">Area<font style="color: red">*</font>';
			html += '<span style="color: #a94442" id="edit-geoAreaId-span-Error" class="help-inline"></span>';
			html+='<select  class="form-control input-sm" id="selectedAreaTypeForEditOrg">';
			html += '<option value="0">'+areaName+'</option>';
			for (var i = 0; i < listOfAreaNames.length; i++) {
				html += '<option value='+listOfAreaNames[i].id+'>'
						+ listOfAreaNames[i].geoAreaName
						+ '</option>';
			} 
			html += '</select>';
			html +='</label>';
		}
		
		
	    html += '</div>';
	    //dileep ended
	/** ************************************Locations***************************************************** */
		html+=	'<div>';
		html+=	'<div style="height:115px;">';
		html+=		'<label>Select Locations</label><br>';
		html += '<div class="form-group" style="height:50px;">';
		html +=	'<select name="selectfrom" id="edit-organizationLocations" multiple size="5" class="col-xs-3">';
		for(var i=0;i<listLocationsForOrganization.length;i++){
			html+=	'<option value='+listLocationsForOrganization[i].id+'>'+listLocationsForOrganization[i].geoName+'</option>';
		}
		html +=	'</select>';
		html+=	'&nbsp;<a href="JavaScript:void(0);"  onclick ="updateOrganizationLocations()" class="col-xs-1">Add &raquo;</a>';
		html+=	'<a href="JavaScript:void(0);" onclick ="removeUpdateOrganizationLocations()" class="col-xs-2">&laquo; Remove</a>';
		html+=	'<select name="selectto" id="selectedOrganizationLocations" multiple size="5" class="col-xs-3">';
		for(var i=0;i<selectedLocationsList.length;i++){
			html+=	'<option value='+selectedLocationsList[i].id+'>'+selectedLocationsList[i].geoName+'</option>';
		}
		html+=	'</select>';
		html+=	'</div>';
		html+=	'</div>';
		html+=	'</div>';
		
		/** ************************************KPIS***************************************************** */
		html+=	'<div>';
		html+=	'<div style="height:125px;">';
		html+=		'<label>Select KPI(s)</label><br>';
		html += '<div class="form-group" style="height:50px;">';
		html +=	'<select name="selectfrom" id="edit-organizationKpis" multiple size="5" class="col-xs-3">';
		console.log("listKpisForOrganization-----"+listKpisForOrganization.length);
		for(var i=0;i<listKpisForOrganization.length;i++){
			html+=	'<option value='+listKpisForOrganization[i].id+'>'+listKpisForOrganization[i].kpiName+'</option>';
		}
		html +=	'</select>';
		html+=	'&nbsp;<a href="JavaScript:void(0);"  onclick ="updateOrganizationKpis()" class="col-xs-1">Add &raquo;</a>';
		html+=	'<a href="JavaScript:void(0);" onclick ="removeUpdateOrganizationKpis()" class="col-xs-2">&laquo; Remove</a>';
		html+=	'<select name="selectto" id="updatedOrganizationKpis" multiple size="5" class="col-xs-3">';
		console.log("listSelectedKpis-----"+listSelectedKpis.length);
		for(var i=0;i<listSelectedKpis.length;i++){
			html+=	'<option value='+listSelectedKpis[i].id+'>'+listSelectedKpis[i].kpiName+'</option>';
		}
		html+=	'</select>';
		html+=	'</div>';
		html+=	'</div>';
		html+=	'</div>';
		/** ************************************Organization Attributes***************************************************** */
		html+=	'<div id="attributesUpdateDiv">';
		if(organizationAttributeList.length>0){
			for(var i=0;i<organizationAttributeList.length;i++){
				html+=	'<div class="form-group">';
				html+=	'<label>'+organizationAttributeList[i].attributeKey+'</label>';
				if(organizationAttributesList.length>0){
				html+=	'<input type="hidden" value="'+organizationAttributeList.length+'" id="updatedAttributesLength">';
				if(organizationAttributesList[i] != null){
				html+=	'<input type="text" value="'+organizationAttributesList[i].attributeValue+'" class="form-control" maxlength="50" id="attributeKeyUpdatedValue_'+i+'">';
				html+=	'<input type="hidden" id="attributeKeyUpdatedId_'+i+'" value='+organizationAttributesList[i].id+'>';
				}else{
					html+=	'<input type="text" value="" class="form-control" maxlength="50" id="attributeKeyUpdatedValue_'+i+'">';	
					html+=	'<input type="hidden" id="attributeKeyUpdatedId_'+i+'" value="'+organizationAttributeList[i].id+'">';
					html+=	'<input type="hidden" value="'+organizationAttributeList.length+'" id="updatedAttributesLength">';
				}}else{
					html+=	'<input type="text" value="" class="form-control" maxlength="50" id="attributeKeyUpdatedValue_'+i+'">';	
					html+=	'<input type="hidden" id="attributeKeyUpdatedId_'+i+'" value="'+organizationAttributeList[i].id+'">';
					html+=	'<input type="hidden" value="'+organizationAttributeList.length+'" id="updatedAttributesLength">';
				}
				html+=	'</div>';
			}
		}else{
			html+=	'<font style="color: red;"><b>No Attributes Found For Selected Organization Type</b></font><br>';
		}
		html+=	'</div>';
		/** ************************************Button***************************************************** */
		html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateOrganization('+organization.id+')">';
		html+=	appendCancelButton(getDivId("Organization"),"page-wrapper");//Adding Cancel Button
		html+=	'</form>';
		return html;
}

function getCityEdit(){
	$("#CityLbId").html('');
	var selectedCountryTypeForEditOrgs = $("#selectedCountryTypeForEditOrg").val();
	console.log("selectedCountryTypeForEditOrg:- " + selectedCountryTypeForEditOrgs);
	var html = "";
	$.ajax({
				type : "GET",
				url : "../organization/getCountry.htm?id="
						+ selectedCountryTypeForEditOrgs,
				dataType : "json",
				success : function(data) {
					$('#selectedAreaTypeForEditOrg').val("0");
					$('#selectedAreaTypeForEditOrg').prop("disabled",true);
					if($("#selectedCountryTypeForEditOrg").val()==0){
						html += 'City <font style="color: red">*</font>';
						html += '<span style="color: #a94442" id="edit-getGeoCityId-span-Error" class="help-inline"></span>';
						html+='<select class="form-control input-sm" id="selectedCityTypeForEditOrg" disabled  onchange="getAreaNameEdit()" >';
						html += '<option value="0">ALL</option>';
						html += '</select>';
					}else{ 
						html += 'City <font style="color: red">*</font>';
						html += '<span style="color: #a94442" id="edit-getGeoCityId-span-Error" class="help-inline"></span>';
						html+='<select class="form-control input-sm" id="selectedCityTypeForEditOrg"  onchange="getAreaNameEdit()"  >';
					html += '<option value="0">ALL</option>';
					for (var i = 0; i < data.length; i++) {
						html += '<option value=' + data[i].id + '>'
								+ data[i].geoCityName + '</option>';
					}
					html += '</select>';
					}
					$("#CityLbId").append(html);
					$("#CountryLbId").show();
					$("#CityLbId").show();
					$("#AreaLbId").show();
				}
			});
	
}
function getAreaNameEdit(){
	$("#AreaLbId").html(''); 
	var selectedCityNameEditTypes=$('#selectedCityTypeForEditOrg').val();
    console.log("selectedCityNameEditTypes--"+selectedCityNameEditTypes);	
	$.ajax({
		type: "GET",
		url: "../organization/getAreaName.htm?id="+selectedCityNameEditTypes,
		dataType: "json",
		success: function(data){ 
			var html="";
			if($('#selectedCityTypeForEditOrg').val()==0){
				html+=	'Area <font style="color: red">*</font>';
				//html += '<span style="color: #a94442" id="edit-geoAreaId-span-Error" class="help-inline"></span>';
				html+='<select class="form-control input-sm" id="selectedAreaTypeForEditOrg" disabled  >';
				html+=	'<option value="0">ALL</option>';
				html+='</select>';
			}else{ 
			html+=	'Area <font style="color: red">*</font>';
			html += '<span style="color: #a94442" id="edit-geoAreaId-span-Error" class="help-inline"></span>';
			html+='<select class="form-control input-sm" id="selectedAreaTypeForEditOrg" >';
			html+=	'<option value="0">ALL</option>';
			for(var i=0;i<data.length;i++){
				html+=	'<option value='+data[i].id+'>'+data[i].geoAreaName+'</option>';
			}
			html+='</select>';	
			}
			$("#AreaLbId").append(html);
			$("#AreaLbId").show();
		}
	});

	
}


function updateOrganizationLocations(){
	$('#edit-organizationLocations option:selected').each( function() {
        $('#selectedOrganizationLocations').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
});
}

function removeUpdateOrganizationLocations(){
	$('#selectedOrganizationLocations option:selected').each( function() {
        $('#edit-organizationLocations').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
});

}

function updateOrganizationKpis(){
	$('#edit-organizationKpis option:selected').each( function() {
        $('#updatedOrganizationKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
});
}

function removeUpdateOrganizationKpis(){
	$('#updatedOrganizationKpis option:selected').each( function() {
        $('#edit-organizationKpis').append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
        $(this).remove();
});

}
function updateOrganization(id){
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("Organization"));
	$('#editOrganizationSuccessDiv').hide();
	$('#editOrganizationErrorDiv').hide();
	var organizationFullName = $.trim($('#editedOrganizationFullName').val());
	//dileep added
	var geoCounrtyId =$('#selectedCountryTypeForEditOrg').val();
	var geoCityId =$('#selectedCityTypeForEditOrg').val();
	var geoAreaId =$('#selectedAreaTypeForEditOrg').val();
	var selectedLocations = $('#selectedOrganizationLocations > option').length;
	var selectedKpis = $('#updatedOrganizationKpis > option').length;
	var attributesLength = $('#updatedAttributesLength').val();
	var organizationAttributes = [];
	var organizationKPIs = [];
	var geoLocations = [];
	var clientChecked = 0;
	var emailChecked = 0;
	var organizationChecked = 0;
	if(selectedLocations>0){
		$('#selectedOrganizationLocations option').each(function(){
			var geoNameId = $(this).val();
			geoLocations.push({'geoNameId':geoNameId});
		});
	}
	console.log("selectedKpis in update-- "+selectedKpis);
	if(selectedKpis>0){
		$('#updatedOrganizationKpis option').each(function() { 
			var kpiId = $(this).val();
			organizationKPIs.push({'kpiId':kpiId});
			console.log("organizationKPIs in kpiIds------------------------------------------------------ "+kpiId);
		});
	}
	for(var i=0;i<organizationKPIs.length;i++){
		console.log("organizationKPIs in update-- "+organizationKPIs[i].kpiId);
	}
	if(attributesLength>0){
		for(var i=0;i<attributesLength;i++){
			var attributeKeyId = $('#attributeKeyUpdatedId_'+i).val();
			var attributeKeyValue = $('#attributeKeyUpdatedValue_'+i).val();
			organizationAttributes.push({'attributeKeyId':attributeKeyId,'attributeValue':attributeKeyValue});
		}
	}
	if($('#organizationUpdatedClientCheckBox').is(':checked')){
		clientChecked = 1;
	}
	if($('#organizationUpdatedEmailCheckBox').is(':checked')){
		emailChecked = 1;
	}
	if($('#organizationUpdatedCheckBox').is(':checked')){
		organizationChecked = 1;
	}
	
	var organizationJSONObject = {'organizationChecked':organizationChecked,'emailChecked':emailChecked,'clientChecked':clientChecked,'id':id,'organizationFullName':organizationFullName,
			  'organizationKPIs':organizationKPIs,'organizationAttributes':organizationAttributes,'geoLocations':geoLocations,
			  'geoCounrtyId':geoCounrtyId,'geoCityId':geoCityId,'geoAreaId':geoAreaId};
	
	$.ajax({
		type:"POST",
		url:organizationUrl+"update.htm",
		contentType:"application/json",
		data:JSON.stringify(organizationJSONObject),
		success:function(response){
			if(response.status=="UPDATE_ERROR"){
				scrollDown(divId);
				$('#editOrganizationErrorDiv').show(600);
				$('#Edit-organizationDisplayName-Error').addClass('has-error has-feedback');
				$('#edit-organizationFullName-span-Error').html(response.errorMessage);
				$('#page-wrapper').unmask();
			}else if(response.status=="UPDATE_COUNTRY_ERROR"){
				scrollDown(divId);
				$('#editOrganizationErrorDiv').show(600);
				$('#edit-geoAreaId-span-Error').html('');
				$('#Edit-getGeoCityId-Error').addClass('has-error has-feedback');
				$('#edit-getGeoCityId-span-Error').html(response.errorMessage);
				$('#page-wrapper').unmask();
			}else if(response.status=="UPDATE_CITY_ERROR"){
				scrollDown(divId);
				$('#editOrganizationErrorDiv').show(600);
				$('#edit-getGeoCityId-span-Error').html('');
				//$('#edit-getGeoCityId-span-Error').removeClass('has-error has-feedback');
				$('#Edit-geoAreaId-Error').addClass('has-error has-feedback');
				$('#edit-geoAreaId-span-Error').html(response.errorMessage);
				$('#page-wrapper').unmask();
			}else if(response.status=="UPDATE_SUCCESS"){
				var tabButtonsId = $('#organizationTabButtons');
				var dataDivId = $('#organizationDataDiv');
				var successDivId = "editOrganizationSuccessDiv"
				var tableId = "organizationListTable";
				var html = listOrganizationFormHtml(response);
				generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
				//listOrganization();
				$('#addAndEditOrganizationDiv').hide();
			}else{
				$('#page-wrapper').mask(response.errorMessage);
			}
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;
	
}

function deleteOrganization(){
	var ids = selectedIds('organizationCheckBox');//Pass Check Box Class
	if(ids.length>0){
		if(confirm("Do you want to delete selected record(s)?")){
			$('#page-wrapper').mask('Loading...');
			clearOrganizationMessageDivs();
			$.ajax({
				type:"POST",
				url:organizationUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(ids),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						var tabButtonsId = $('#organizationTabButtons');
						var dataDivId = $('#organizationDataDiv');
						//var dataDivId = $('#addAndEditOrganizationDiv');
						var successDivId = "deleteOrganizationSuccessDiv"
						var tableId = "organizationListTable";
						var html = listOrganizationFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
						//$('#organizationDataDiv').html('');
						//scrollDown($('#organizationDataDiv'));
					}else{
						$('#deleteOrganizationErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteOrganizationErrorDiv').append(errorMessage);
						$('#deleteOrganizationErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
	}else{
		alert("Please select a record");
		return false;
	}
}


/********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllOrganizationCheckBox",function(){
    $('.organizationCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".organizationCheckBox",function(){
    if($('.organizationCheckBox:checked').length == $('.organizationCheckBox').length) {
      $('#checkAllOrganizationCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllOrganizationCheckBox').prop('checked', false);
    }
});





/********************************************************************************************************************************************
 **********************Department Tab******************************************************************************************************
 **********************************************************************************************************************************************/
/******************************************************Rajesh*******************************************************************************/
var departmentUrl = "../department/";
var listData = {};
function orgGroupName(){
	$('#page-wrapper').mask('Loading...');
	$(".alert").hide();
	
	$("#addAndEditOrganizationGroupDiv").hide();
	$("#addAndEditDepartmentDiv").hide();
	$("#addAndEditOrganizationDiv").hide();
	
	$("#departmentListTable_wrapper").hide();
	$("#organizationListTable_wrapper").hide();
	$("#organizationGroupListTable_wrapper").hide();
	
	$("#dropsDiv").hide();
	$("#drops").show();
	$("#orgGroupFilterButtons").hide();
	 

	 
	$('#listDepartmentTab').html('');
	$('#departmentListTable').html('');
	$('#departmentListTable_length').html('');
	$('#departmentListTable_info').html('');
	$('#departmentListTable_filter').html('');
	$('#departmentListTable_paginate').html('');
	$('#addAndEditOrganizationGroupDiv').html('');
	$('#addAndEditDepartmentDiv').hide();
	$.get(departmentUrl+"listOrgGroupName.htm",function(response){
		if(response.status=="LIST_SUCCESS"){
			var html = listDepartmentGroupNameHtml(response);
			$('#listDepartmentTab').append(html);
			$('#page-wrapper').unmask();
		}else{
			$('#page-wrapper').mask(response.errorMessage);
		}
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**********"+response.statusText);
	});
	return false;
}
function listDepartmentGroupNameHtml(response){
 var html = "";
 var result=response.successObject.orgGroupList;
 var countryResult=response.successObject.countryList;
	html+=	'<div id="drops" class="tab-pane fade in active">';
	html+=		'<form id="filterDepartmentForm" class="form-inline col-xs-12 SubHeading AdminMainActivity" style="padding-top:20px; padding-bottom:10px;">';
	html += '<div class="row">';
	html += '<label class="control-label col-xs-4" for="orgGroup">Org Group Name<select id="selectedGroupType" class="form-control input-sm" onchange="getOrgBrandList()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
	for (var i = 0; i < result.length; i++) {
		html += '<option value='+result[i].id+'>'
				+ result[i].organizationGroupName
				+ '</option>';
	}
	html += '</select>';
	html += '</label>';
	
	html += '<label class="control-label col-xs-4" for="orgBrand" id="drop">Org Brand Name<select id="selectedBrandType" disabled class="form-control input-sm" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
	html += '</select>';
	html += '</label>';
	
	html += '<label class="control-label col-xs-4" for="orgName" id="dropOrganization">Org Name <select id="selectedOrgType" disabled class="form-control input-sm" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
	html += '</select>';
	html += '</label>';
	html += '</div>';
	
	html += '<div class="row" style="margin-top:10px">';
	html += '<label class="control-label col-xs-4" for="country" id="dropCountry">country<select id="selectedCountryType" class="form-control input-sm" onchange="getCityList()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
	for (var i = 0; i < countryResult.length; i++) {
		html += '<option value='+countryResult[i].id+'>'
				+ countryResult[i].geoCountryName
				+ '</option>';
	}
	html += '</select>';
	html += '</label>';
	
	html += '<label class="control-label col-xs-4" for="city" id="dropCity">city<select id="selectedCityType" disabled class="form-control input-sm" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
	html += '</select>';
	html += '</label>';
	
	html += '<label class="control-label col-xs-4" for="area" id="dropArea">Area<select id="selectedAreaType" disabled class="form-control input-sm" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
	html += '</select>';
	html += '</label>';
	
	html += '</div>';
	
	html += '<div class="row" style="margin-top:10px">';
	html += '<label class="control-label col-xs-4" for="orgNameId" id="dropOrgId">Org Name ID<select id="selectedOrgIdType" disabled class="form-control input-sm" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
	html += '<option  value="0">ALL</option>';
	html += '</select>';
	html += '</label>';
	
	html += '<div class="control-label col-xs-4">';
	html += 		'<label class="control-label" for="client" id="dropClient" style="float:left">client<input type="checkbox"  id="selectedClientType" class="form-control input-sm" style="margin: 0px 5px; box-shadow: none;"/></label>';
	html += 	'<div style="float:right; margin-right:50px;">';
	html += 		'<input type="button" class="btn btn-sm btn-primary" id="viewList" onclick="listDepartment()" value="View"/>';
	html += 	'</div>';
	html += '</div>';
	
	html+=		'<div class="form-group col-xs-4">';
	html+=			'<button class="btn btn-primary AdminDeleteButton float-right" type="button" style="margin-right:50px;" onclick="deleteDepartment()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button>';
	html+=			'<a onclick="addDepartment()" class="btn btn-primary AdminAddButton float-right" type="button">+</a>';
	html+=		'</div>';
	html += '</div>';
	html+=	'</form>';
	html+=	'</div>';
	return html;
}
function getOrgBrandList()
{
	$('#page-wrapper').mask('Loading...');
 var selectedGroupId = $('#selectedGroupType').val();
 //console.log(selectedGroupId);
 var html = "";
 $("#drop").empty();
 $.ajax({
		type: "GET",
		url: "../department/brandList.htm?id="+selectedGroupId,
		dataType: "json",
		success: function(response){ 
			//new 2016-04-05
			$('#page-wrapper').unmask();
			//$('#selectedBrandType').val("ALL");
			//$('#selectedOrgType').val("0");
			$('#selectedBrandType').val("0");//new
			$('#selectedBrandType').prop("disabled", true);//new 
			$('#selectedOrgType').val("0");
			$('#selectedOrgType').prop("disabled", true);
			$('#selectedOrgIdType').val("0");
			$('#selectedOrgIdType').prop("disabled", true);
			
			var result=response.successObject.orgBrandList;
			if($('#selectedGroupType').val() == 0){
				html+=	'Org Brand Name<select class="form-control input-sm" id="selectedBrandType" disabled onchange="getOrganizationTypes()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
				html+=	'<option value="0">ALL</option>';
				html+='</select>';
			}else{
			html+=	'Org Brand Name<select class="form-control input-sm" id="selectedBrandType" onchange="getOrganizationTypes()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
			html+=	'<option value="0">ALL</option>';
			for (var i = 0; i < result.length; i++) {
				html += '<option value='+result[i].id+'>'
						+ result[i].organizationBrandName
						+ '</option>';
			}
			html+='</select>';
			}
			$('#drop').append(html);
			$("#drop").show();
			$("#drops").show(); 
			$("#dropOrganization").show(); 
			//$("#dropCountry").show();
			//$("#dropCity").show();
			//$("#dropArea").show();
			$("#dropClient").show();
			$("#dropOrgId").show();
			$("#viewList").show();
		}
	});
}
function getOrganizationTypes(){
 var selectedBrandId = $('#selectedBrandType').val();
 var html = "";
 $("#dropOrganization").empty();
 $('#page-wrapper').mask('Loading...');
 $.ajax({
		type: "GET",
		url: "../department/orgList.htm?id="+selectedBrandId,
		dataType: "json",
		success: function(response){ 
			$('#page-wrapper').unmask();
			$('#selectedOrgType').val("ALL");
			$('#selectedOrgIdType').val("0");
			$('#selectedOrgIdType').prop("disabled", true);
			var result=response.successObject.orgList;
			if($('#selectedBrandType').val() == 0){
				html+=	'Org Name<select class="form-control input-sm" id="selectedOrgType" disabled onchange="getOrgId()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
				html+=	'<option value="0">ALL</option>';
				html+='</select>';
			}else{
			html+=	'Org Name<select class="form-control input-sm" id="selectedOrgType" onchange="getOrgId()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
			html+=	'<option value="0">ALL</option>';
			for (var i = 0; i < result.length; i++) { 
				html += '<option value='+result[i].id+'>'
						+ result[i].organizationFullName
						+ '</option>';
			}
			html+='</select>';
		}
			$('#dropOrganization').append(html);
			$("#dropOrganization").show();
			$("#drops").show(); 
			$("#dropClient").show();
			$("#dropOrgId").show();
			$("#viewList").show();
		}
	});
}
function getCityList(){
	$('#page-wrapper').mask('Loading...');
	 var selectedCountryId = $('#selectedCountryType').val();
	 var html = "";
	 $("#dropCity").empty();
	 $.ajax({
			type: "GET",
			url: "../department/cityList.htm?id="+selectedCountryId,
			dataType: "json",
			success: function(response){ 
				$('#page-wrapper').unmask();
				$('#selectedCityType').val("ALL");
				$('#selectedAreaType').val("0");
				$('#selectedAreaType').prop("disabled", true);
				var result=response.successObject.cityList;
				if($('#selectedCountryType').val() == 0){
					html+=	'city<select class="form-control input-sm" id="selectedCityType" disabled onchange="getAreaTypes()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
					html+=	'<option value="0">ALL</option>';
					html+='</select>';
				}else{
					html+=	'city<select class="form-control input-sm" id="selectedCityType" onchange="getAreaTypes()" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
					html+=	'<option value="0">ALL</option>';
					for (var i = 0; i < result.length; i++) {
						html += '<option value='+result[i].id+'>'
								+ result[i].geoCityName
								+ '</option>';
					}
					html+='</select>';
				}
				$('#dropCity').append(html);
				$("#dropCity").show();
				$("#drops").show(); 
				$("#dropArea").show();
				//$("#dropClient").show();
				//$("#dropOrgId").show();
				$("#viewList").show();
			}
		});
}
function getAreaTypes(){
	$('#page-wrapper').mask('Loading...');
	 var selectedCityId = $('#selectedCityType').val();
	 var html = "";
	 $("#dropArea").empty();
	 $.ajax({
			type: "GET",
			url: "../department/areaList.htm?id="+selectedCityId,
			dataType: "json",
			success: function(response){ 
				$('#page-wrapper').unmask();
				$('#selectedAreaType').val("ALL");
				var result=response.successObject.cityList;
				if($('#selectedCityType').val() == 0){
					html+=	'Area<select class="form-control input-sm" id="selectedAreaType" disabled style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
					html+=	'<option value="0">ALL</option>';
					html+='</select>';
				}else{
					html+=	'Area<select class="form-control input-sm" id="selectedAreaType" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
					html+=	'<option value="0">ALL</option>';
					for (var i = 0; i < result.length; i++) {
						html += '<option value='+result[i].id+'>'
								+ result[i].geoAreaName
								+ '</option>';
					}
					html+='</select>';
				}
				$('#dropArea').append(html);
				$("#dropArea").show();
				$("#drops").show(); 
				//$("#dropClient").show();
				//$("#dropOrgId").show();
				$("#viewList").show();
			}
		});
}
function getOrgId(){
	 $("#dropOrgId").empty();
	var html="";
	var selectedCityId = $('#selectedOrgType').val();
	$('#selectedOrgIdType').val("ALL");
	if($('#selectedOrgType').val() == 0){
		html+=	'Org Name ID<select class="form-control input-sm" id="selectedOrgIdType" disabled style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
		html+=	'<option value="0">ALL</option>';
		html+='</select>';
	}else{
		html+=	'Org Name ID<select class="form-control input-sm" id="selectedOrgIdType" style="width:150px; float:right; margin-right:50px; margin-top:-5px;">';
		html+=	'<option value="0">ALL</option>';
			html += '<option value='+selectedCityId+'>'
					+ selectedCityId
					+ '</option>';
		html+='</select>';
	}
	$('#dropOrgId').append(html);
	$("#dropOrgId").show();
	$("#drops").show();
	$("#viewList").show();
}

//**************************************List Departments *********************************************//
function listDepartment(){

	$("#addAndEditDepartmentDiv").hide();

	$.ajaxSetup({
		cache : false
	});
	$('#page-wrapper').mask('Loading...');
	$('#departmentListTable').html('');
	$('#departmentListData').html('');
	$('#departmentDataDiv').html('');
	$('#departmentDataDiv').html('');
	$('#addAndEditDepartmentDiv').html('');
	$('#editDepartmentMappingTable').html('');
	$('#editDepartmentMappingDiv').html('');
	//print value
	var orgGroup=$('#selectedGroupType').val();
	var orgBrand=$('#selectedBrandType').val();
	var orgName=$('#selectedOrgType').val();
	var country=$('#selectedCountryType').val();
	var city=$('#selectedCityType').val();
	var area=$('#selectedAreaType').val();
	var orgid=$('#selectedOrgIdType').val();
	var client=$("#selectedClientType").is(':checked') ? 1 : 0;
//	console.log("client data: "+client);
	var id = [];
	 listData={
			'orgGroup':orgGroup,
			'orgBrand':orgBrand,
			'orgName':orgName,
			'country':country,
			'city':city,
			'area':area,
			'orgid':orgid,
			'client':client,
			'ids':id
	}
	 
	 $.ajax({
			type:"POST",
			url:departmentUrl+"/list.htm",
			contentType:"application/json",
			data:JSON.stringify(listData),
			success:function(response){
				if(response.status=="LIST_SUCCESS"){
					var html = listDepartmentFormHtml(response);
					$('#departmentListData').append(html);
					$('#departmentListTable').dataTable();
					$('#departmentListData').show();
					$('#listDepartmentTab').show();
					$('#page-wrapper').unmask();
				}else{
					$('#page-wrapper').mask(response.errorMessage);
				}
			},error:function(response){
				$('#page-wrapper').mask(response.status+"**********"+response.statusText);
			}
		});

	return false;
}

function listDepartmentFormHtml(response){
	$.ajaxSetup({
		cache : false
	});
	$('#departmentListData').html('');
	$('#departmentListTable').html('');
	$('#departmentListData').html('');
	$('#departmentDataDiv').html('');
	$('#departmentListForm').html('');
	$('#editDepartmentMappingTable').html('');
	$('#editDepartmentMappingDiv').html('');
	$('#page-wrapper').mask('Loading...');
	$('#editDepartmentMappingDiv').html('');
	var deptEmptyMessage = '<h5 style="color:red">No Department Map</h5>';
	var list = response.successObject.departmentList;
	var html = "";
	html+=	'<div id="departmentDataDiv">';
	html+=	'<form id="departmentListForm">';
	/******************************************Department Add Success Div*************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addDepartmentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Department Added Successfully</div>';
	/******************************************Department Edit Success Div*************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="editDepartmentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Department Updated Successfully</div>';
	/******************************************Department Delete Success Div*************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="deleteDepartmentSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Department(s) Deleted Successfully</div>';
	/******************************************Department Delete Error Div*************************************************/
	html+= '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteDepartmentErrorDiv">';
	/******************************************Department Attribute sucess Div*************************************************/
	html+=	'<div class="alert alert-success" style="display:none;"id="addDepartmentAttributeSuccessDiv"><img alt="" src="../resources/images/done.png" style="margin-left: 8px;">&nbsp; Department(s) Attribute Added Successfully</div>';
	
	html+= '</div>';
	
	html+= "<table class='table table-striped dataTable no-footer' id='departmentListTable'>";
	html+= "<thead>";
	html+=	"<tr>";
	html+=	'<th><input type="checkbox" id="checkAllDepartmentCheckBox" style="margin-left: 0px;"></th>';
	html+=	"<th>Id</th>";
	html+=	"<th>Organization Group Name</th>";
	html+=	"<th>Organization Brand Name</th>";
	html+=	"<th>Organization Name</th>";
	html+=	"<th>Departmet Name</th>";
	html+=	"<th></th>";
	html +=	"</tr>";
	html +=	"</thead>";
	html +=	"<tbody>";
	
	for(var i=0;i<list.length;i++){
		//var list = departmentList[i];
		//console.log(list.id);
		var id = list[i].id;
		var group=list[i].organizationGroupName;
		var brand=list[i].organizationBrandName;
		var deptName = list[i].departmentId;
		var organizationName = list[i].organizationFullName;
		var dept='';
		for(var j=0;j<deptName.length;j++){
			if(deptName[j].departmentName!=null){
				dept+= deptName[j].departmentName+" | ";
			}else{
				dept= '';
			}
			
		}
		/*if(dept == ''){
			dept = deptEmptyMessage;
		}*/
		//console.log(dept);
		var deptt = dept.substring(0, dept.length-2); //deleting last pipe symbol
		console.log(deptt);
		dept = '';
		console.log("deptt : "+deptt);
		if(deptt == ''){
			deptt = deptEmptyMessage;
			html+=	'<tr>';
			html+=	'<td><input type="checkBox" class="departmentCheckBox" value='+id+' disabled></td>';
			html+=	'<td disabled>'+id+'</td>';
			html+=	'<td disabled>'+group+'</td>';
			html+=	'<td disabled>'+brand+'</td>';
			html+=	'<td disabled>'+organizationName+'</td>';
			html+= '<td disabled>'+deptt+'</td>';
			html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editDepartment('+id+')" disabled><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
			html+=	'</tr>';
		}else{
			html+=	'<tr>';
			html+=	'<td><input type="checkBox" class="departmentCheckBox" value='+id+'></td>';
			html+=	'<td>'+id+'</td>';
			html+=	'<td>'+group+'</td>';
			html+=	'<td>'+brand+'</td>';
			html+=	'<td>'+organizationName+'</td>';
			html+= '<td>'+deptt+'</td>';
			html+=	'<td class="text-right"><span><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editDepartment('+id+')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
			html+=	'</tr>';
		}
		
	}
	html+=	"</tbody>";
	html+=	"</table>";
	html+= '</form>';
	html+=	addDiv("Department");
	html+=	'</div>';
	return html;
}

//********************************************ADD DEPARTMENT **********************************************//
function addDepartment(){
	$.ajaxSetup({
		cache : false
	});
	$('#page-wrapper').mask('Loading...');
	clearDepartmentMessageDivs();
	$('#addAndEditDepartmentDiv').html('');
	$.get(departmentUrl+"add.htm",function(response){
		if(response.status=="ADD_SUCCESS"){
			var html = addDepartmentFormHtml(response);
			var divId = $('#'+getDivId("Department"));
			appendOrganizationAddOrEditForm(divId, html);
		}else{
			var errorMessage = '<h4 style="color:red">Something Went Wrong.Please Contact Admin</h4>';
			$('#departmentDataDiv').append(errorMessage);
			$('#page-wrapper').unmask();
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**************"+response.statusText);
	});
	return false;

}

function addDepartmentFormHtml(response){
	$.ajaxSetup({
		cache : false
	});
	
	var organizationGroupList = response.successObject.organizationGroupList;
	var html = "";
	html+=	addFormHeading("Department Details");
	html+=	'<form class="col-sm-12" id="addDepartmentForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="addDepartmentErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	html+=	'<h4>Organizational Selection <font style="color: red">*</font></h4><hr>';
	/** ************************************Organization Group Dropdown***************************************************** */
	if(organizationGroupList.length>0){
		html += '<div class="form-group" id="addDepartment-organizationGroupName-DropDownDiv">';
		html += '<label>Organization Group<font style="color: red">*</font></label>';
		html +=	'<select class="form-control"  style="width: 50%" id="addDepartment-organizationGroupId" onchange="getOrganizationBrand()">';
		html += '<option  value="0">Select</option>';
		for(var i=0;i<organizationGroupList.length;i++){
			var id = organizationGroupList[i].id;
			var organizationGroupName = organizationGroupList[i].organizationGroupName;
			html+=	'<option value='+id+'>'+organizationGroupName+'</option>';
		}
		html +=	'</select>';
		html += '</div>';
	}else{
		html += '<div class="form-group has-error" id="addDepartment-organizationGroupName-DropDownDiv">';
		html += '<label>Organization Group<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" disabled="disabled" id="addDepartment-organizationGroupId"  onchange="getOrganizationBrand()"><option>No Organization Groups Found</option></select>';
		html += '</div>';
	}
	/** ************************************Organization Brand Dropdown***************************************************** */
		html += '<div class="form-group" id="addDepartment-organizationBrandName-DropDownDiv">';
		html += '<label>Organization Brand<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="addDepartment-organizationBrandId" style="width: 50%" onchange="getOrganizationName()">';
		html += '<option  value="0">Select</option>';
		html +=	'</select>';
		html += '</div>';
	/** ************************************Organization Dropdown***************************************************** */
		html += '<div class="form-group" id="addDepartment-organizationFullName-DropDownDiv">';
		html += '<label>Organization<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="addDepartment-organizationNameId" style="width: 50%" onchange="getDepartmentMappingForm()">';
		html += '<option  value="0">Select</option>';
		html +=	'</select>';
		html += '</div>';
		html += '<div id = "cancelId">';
		html += appendCancelButton(getDivId("Department"),"page-wrapper");//Adding Cancel Button
		html += '</div>';
	html += '<div id="departmentMappingDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;"></div>';
	//****************************Rajesh*****************************//
	
	html+=	'</form>';
	
	return html;
}

/*------------------------- Getting the Organization group and organization bands List-------------------------------->*/
function getOrganizationBrand() {
	var selectedOrganizationGroupId = $('#addDepartment-organizationGroupId option:selected').val();
	if(selectedOrganizationGroupId==undefined){
		selectedOrganizationGroupId = 0;
	}
	$('#page-wrapper').mask('Loading...');
	$('#departmentMappingDiv').html('');
	$('#departmentMappingTable').html('');
	$('input[type=button]', $('#addDepartmentForm')).prop('disabled', false);
	$('#addDepartmentForm').find('#addDepartment-organizationBrandName-DropDownDiv').removeClass('has-error has-feedback');
	$('#addDepartment-organizationBrandId').prop('disabled',false);
	$('#addDepartment-organizationNameId').prop('disabled',false);
	$.get(organizationUrl+"getBrandByGroupId.htm?organizationGroupId="+selectedOrganizationGroupId,function(response){
		$('#addDepartment-organizationBrandId').html('');//Clearing Dependent Dropdown Values
		$('#addDepartment-organizationNameId').html('');
		var organizationBrandList = response.successObject.organizationBrandList;
		$('#addDepartment-organizationBrandId').append("<option value='0'>Select</option>");
		$('#addDepartment-organizationNameId').append("<option value='0'>Select</option>");
		if(organizationBrandList.length>0){
			for(var i=0;i<organizationBrandList.length;i++){
				$('#addDepartment-organizationBrandId').append("<option value="+organizationBrandList[i].id+">"+organizationBrandList[i].organizationBrandName+"</option>");
			}
			//getOrganizationName();
			//disableButton();
		}else{
			$('input[type=button]', $('#addDepartmentForm')).prop('disabled', true);
			$('#addDepartment-organizationBrandId').prop('disabled',true);
			$('#addDepartment-organizationNameId').prop('disabled',true);
			$('#cancelId').show();//new added
			//$('#addDepartmentForm').find('#addDepartment-organizationBrandName-DropDownDiv').addClass('has-error has-feedback');
			/*var message = '<font style="color:red">No Organization Brand Found</font>';*/
			var message = 'Select';
			$('#addDepartment-organizationBrandId').append('<option>'+message+'</option>');
			$('#addDepartment-organizationNameId').append('<option>'+message+'</option>');
		}
		$('#page-wrapper').unmask();
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"***************"+response.statusText);
	});
	return false;
}
	
	/* 	Getting Organization Name drop down Values --------------------------------------------------------------------->*/
	function getOrganizationName(){
		var selectedOrganizationBrandId = $('#addDepartment-organizationBrandId option:selected').val();
		if(selectedOrganizationBrandId==undefined){
			selectedOrganizationBrandId = 0;
		}
		$('#page-wrapper').mask('Loading...');
		$('#departmentMappingDiv').html('');
		$('#departmentMappingTable').html('');
		$('input[type=button]', $('#addDepartmentForm')).prop('disabled', false);
		$('#addDepartmentForm').find('#addDepartment-organizationFullName-DropDownDiv').removeClass('has-error has-feedback');
		$('#addDepartment-organizationNameId').prop('disabled',false);//Enabling organization name DropDown
		$.ajax({
			type:"POST",
			url:departmentUrl+"getOrganizationNameList.htm",
			contentType:"application/json",
			data:JSON.stringify(selectedOrganizationBrandId),
			success:function(response){
				$('#addDepartment-organizationNameId').html('');//Clearing Organization Name DropDown Value
				if(response.status=="ORGANIZATION_NAMES_LIST_SUCCESS"){
					var organizationNames = response.successObject.organizations;
					$('#addDepartment-organizationNameId').append("<option value='0'>Select</option>");
					for(var i=0;i<organizationNames.length;i++){
						$('#addDepartment-organizationNameId').append('<option value='+organizationNames[i].id+'>'+organizationNames[i].organizationFullName+'</option>');
					}
					disableButton();
					//getDepartmentTypesForDepartment();//Get Department Types
					//getDepartmentMappingForm();
					$('#page-wrapper').unmask();
				}else if(response.status=="ORGANIZATION_NAMES_LIST_EMPTY"){
					//$('#addDepartmentForm').find('#addDepartment-organizationFullName-DropDownDiv').addClass('has-error has-feedback');
					/*var emptyOrganizationNames = '<font style="color:red">No Organization Names Found</font>';*/
					$('#cancelId').show();//new added
					var emptyOrganizationNames = '<font style="color:red">Select</font>';
					$('#addDepartment-organizationNameId').append('<option value="0">'+emptyOrganizationNames+'</option>');
					$('#addDepartment-organizationNameId').prop('disabled',true);
					$('input[type=button]', $('#addDepartmentForm')).prop('disabled', true);
					$('#departmentAttributesEmptyDiv').show(600);
					$('#departmentAttributesDiv').hide(600);
					$('#departmentSearchKpisDiv').hide(600);
					$('#departmentEmptyKpisDiv').show(600);
					$('#page-wrapper').unmask();
					disableButton();
					//getDepartmentTypes();//Get Department Types
				}else{
					$('#page-wrapper').mask(response.errorMessage);
				}
			},error:function(response){
				$('#page-wrapper').mask(response.status+"*************"+response.statusText);
			}
		});
	}

	
	function getDepartmentMappingForm(){
		$.ajaxSetup({
			cache : false
		});
		$('#page-wrapper').mask('Loading...');
		clearDepartmentMessageDivs();
		$('#departmentMappingDiv').html('');
		$('#departmentMappingTable').html('');
		var selectedOrganizationNameId = $('#addDepartment-organizationNameId option:selected').val();
		if(selectedOrganizationNameId == 0){
			$('#departmentMappingDiv').hide();
			$('#departmentMappingTable').hide();
			$('#cancelId').show();
			$('#page-wrapper').unmask();
		}else{
			if(selectedOrganizationNameId==undefined){
				selectedOrganizationNameId = 0;
			}else{
				$('#cancelId').hide();
				$.get(departmentUrl+"getDepartmentMapping.htm?selectedOrganizationNameId="+selectedOrganizationNameId,function(response){
					if(response.status=="LIST_SUCCESS"){
						var html = listOrganizationDepartmentMapping(response,selectedOrganizationNameId);
						$('#departmentMappingDiv').append(html);
						$('#departmentMappingTable').dataTable();
						$('#departmentMappingDiv').show(600);
						$('#departmentMappingTable_length').html('');
						$('#departmentMappingTable_info').html('');
						$('#departmentMappingTable_filter').html('');
						$('#departmentMappingTable_paginate').html('');
						$('#page-wrapper').unmask();
					}else{
						$('#page-wrapper').mask(response.errorMessage);
					}
				},'json').fail(function(response){
					$('#page-wrapper').mask(response.status+"**********"+response.statusText);
				});
			}
		}
		return false;
		
	}

	
function listOrganizationDepartmentMapping(response,selectedOrganizationNameId){
	$.ajaxSetup({
			cache : false
		});
		var html="";
		$('#departmentMappingDiv').html('');
		$('#departmentMappingTable').html('');
		 var departmentType=response.successObject.departmentType;
		 var department=response.successObject.filterDept;
		 var departmentTypeIdss = [];
		 for(var i=0;i<department.length;i++){
			 departmentTypeIdss.push(department[i].departmentTypeId);
		 }
		// department = '';
		 var filter = [];
		 for(var i=0;i<departmentType.length;i++){
			 for(var k=0;k<department.length;k++){
				 if(departmentType[i].id == department[k].departmentTypeId){
					 departmentType[i]["headname"] = department[k].departmentHeadName;
					 departmentType[i]["designation"] = department[k].designation;
					 departmentType[i]["mobile"] = department[k].mobile;
					 departmentType[i]["email"] = department[k].email;
				 }
			 }
		 }
		 
		// console.log("after pushing :"+JSON.stringify(departmentType));
//		 console.log("selected department array departmentTypeIdss : "+departmentTypeIdss);
			html+= '<div class="alert alert-danger alert-error" style="display: none;"	id="tableDataErrorDiv"></div>';
			html+=	'<h4><b>Select Department Settings</b>(Please Note:To add additonal department go to Department type Master or Contact Your Admin)</h4>';
			html+= "<table class='table table-striped dataTable no-footer' border='1px' id='departmentMappingTable'>";
			html+= "<thead>";
			html+=	"<tr>";
			html+=	"<th>DepartmentName</th>";
			html+=	"<th>Is Applicable</th>";
			html+=	"<th>Department Head Name</th>";
			html+=	"<th>Designation</th>";
			html+=	"<th>Email ID</th>";
			html+=	"<th>Mobile Number</th>";
			html+=	"<th></th>";
			html +=	"</tr>";
			html +=	"</thead>";
			html +=	"<tbody>";
			var j=1;
			for(var i=0;i<departmentType.length;i++){
				var deptTypeId = departmentType[i].id;
				var departmentTypeName=departmentType[i].departmentType;
				html+=	'<tr>';
				html+= '<td><label class="control-label col-xs-4" for="deptType" id="departmentLable_'+j+'">'+departmentTypeName+'</lable></td>';
				var contains=$.inArray(deptTypeId, departmentTypeIdss);
				if(contains!= -1){
					var headName = departmentType[i].headname;
					var designation = departmentType[i].designation;
					var email = departmentType[i].email;
					var mobile = departmentType[i].mobile;
					
					html+=	'<td><select id="selectedType_'+j+'" class="form-control input-sm" style="width:100px;" onchange="changeApplicable('+j+')">';
					html+= '<option  value="YES" selected>YES</option>';
					html+= '<option  value="NO">NO</option>';
					html+= '</select> </td>';
					html+=	' <input type="hidden" value="'+deptTypeId+'"  id="deptTYPE_'+j+'" >';
					if(headName !=null && designation !=null && email !=null && mobile !=null){
						html+=	'<td> <input type="text" value="'+departmentType[i].headname+'" class="form-control" id="departmentHeadName_'+j+'" style="width: 105%" placeholder="Dept Head Name"></td>';
						
						html+=	'<td> <input type="text" class="form-control" value="'+departmentType[i].designation+'" id="designation_'+j+'" style="width: 100%" placeholder="Designation"></td>';
						
						html+=	'<td> <input type="text" class="form-control" value="'+departmentType[i].email+'" id="EmailID_'+j+'" style="width: 100%" placeholder="Email ID"></td>';
						
						html+=	'<td> <input type="text" class="form-control" value="'+departmentType[i].mobile+'" id="MobileNumber_'+j+'" style="width: 100%" placeholder="Mobile Number"></td>';
					}else{
						html+=	'<td> <input type="text" class="form-control" id="departmentHeadName_'+j+'" style="width: 105%" placeholder="Dept Head Name"></td>';
						
						html+=	'<td> <input type="text" class="form-control"  id="designation_'+j+'" style="width: 100%" placeholder="Designation"></td>';
						
						html+=	'<td> <input type="text" class="form-control"  id="EmailID_'+j+'" style="width: 100%" placeholder="Email ID"></td>';
						
						html+=	'<td> <input type="text" class="form-control"  id="MobileNumber_'+j+'" style="width: 100%" placeholder="Mobile Number"></td>';
					}
					
					
					html+=	'<td class="text-right"><span><button type="button" id="editMappingId_'+j+'" class="btn btn-xs AdminInList" title="Edit" onclick="editDepartmentMapping('+deptTypeId+',\''+ departmentTypeName +'\')"  ><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
				}else{
					html+=	'<td><select id="selectedType_'+j+'" class="form-control input-sm" style="width:100px;" onchange="changeApplicable('+j+')">';
					html+= '<option  value="NO" selected>NO</option>';
					html+= '<option  value="YES">YES</option>';
					html+= '</select> </td>';
					
					html+=	' <input type="hidden" value="'+deptTypeId+'"  id="deptTYPE_'+j+'" >';
					
					html+=	'<td> <input type="text" class="form-control" id="departmentHeadName_'+j+'" style="width: 105%" placeholder="Dept Head Name" disabled></td>';
					html+=	'<td> <input type="text" class="form-control" id="designation_'+j+'" style="width: 100%" placeholder="Designation" disabled></td>';
					html+=	'<td> <input type="text" class="form-control" id="EmailID_'+j+'" style="width: 100%" placeholder="Email ID" disabled></td>';
					html+=	'<td> <input type="text" class="form-control" id="MobileNumber_'+j+'" style="width: 100%" placeholder="Mobile Number" disabled></td>';
					html+=	'<td class="text-right"><span><button type="button" id="editMappingId_'+deptTypeId+'" class="btn btn-xs AdminInList" title="Edit" onclick="editDepartmentMapping('+deptTypeId+',\''+ departmentTypeName +'\')"  disabled ><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
				}
				html+=	'</tr>';
				j++;
				
			}
			html+=	"</tbody>";
			html+=	"</table>";
			/* *****************  Add Button ********************** */
			html += '<input type="button" class="btn btn-primary" value="Save" onclick ="saveDepartmentMapping('+selectedOrganizationNameId+')">';
			html+=	appendCancelButton(getDivId("Department"),"page-wrapper");//Adding Cancel Button
			return html;
	}


function changeApplicable(deptTypeId){
	console.log("function calling");
	//$('#editDepartmentMappingTable').html('');//new change 2016-04-21
	var selectedType=$('#selectedType_'+deptTypeId).val();
	//console.log("selected departmentType:"+ selectedType);
	var NO="NO";
	var YES="YES";
	if(selectedType == NO){
		$('#departmentHeadName_'+deptTypeId).prop('disabled',true);
		$('#designation_'+deptTypeId).prop('disabled',true);
		$('#EmailID_'+deptTypeId).prop('disabled',true);
		$('#MobileNumber_'+deptTypeId).prop('disabled',true);
		$('#editMappingId_'+deptTypeId).prop('disabled',true);
	}
	if(selectedType == YES){
		$('#departmentHeadName_'+deptTypeId).prop('disabled',false);
		$('#designation_'+deptTypeId).prop('disabled',false);
		$('#EmailID_'+deptTypeId).prop('disabled',false);
		$('#MobileNumber_'+deptTypeId).prop('disabled',false);
		$('#editMappingId_'+deptTypeId).prop('disabled',false);
	}
}

function saveDepartmentMapping(orgId){
	$.ajaxSetup({
		cache : false
	});
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("Department"));
	$('#addDepartmentErrorDiv').hide();
	$('#addDepartmentSuccessDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#page-wrapper').mask('Loading...');
	//var selectedOrganizationNameId = $('#addDepartment-organizationNameId option:selected').val();
	var selectedOrganizationNameId = orgId;
	//alert(selectedOrganizationNameId);
	//console.log("org_id: "+selectedOrganizationNameId);
	var table = $('#departmentMappingTable').DataTable();
	var data = table.rows().data();
	console.log("total length :"+data.length);
	var j = 1;
	var jsonObject = [];
	for(var i=0;i<data.length;i++){
		var data1 = table.rows(i).data();
		var selectedType = $('#selectedType_'+j).val();
		if(selectedType == 'YES'){
			var deptHeadName = $('#departmentHeadName_'+j).val();
			//console.log("head name :"+deptHeadName);
			var designation = $('#designation_'+j).val();
			//console.log("designation :"+designation);
			var EmailID = $('#EmailID_'+j).val();
			//console.log("EmailID :"+EmailID);
			var MobileNumber = $('#MobileNumber_'+j).val();
			//console.log("MobileNumber :"+MobileNumber);
			var departmentName = $('#departmentLable_'+j).text();
		//	console.log("department name :"+departmentName);
			var iid = $('#deptTYPE_'+j).val();
			obj = {
					'departmentName':departmentName,
			        'departmentHeadName': deptHeadName,
			        'designation': designation,
			        'email' : EmailID,
			        'mobile' :MobileNumber,
			        'organizationId':selectedOrganizationNameId,
			        'departmentTypeId':iid
			        
			    };
			jsonObject.push(obj);
		}
		
		j++;
	}
	var orgGroup=$('#selectedGroupType').val();
	var orgBrand=$('#selectedBrandType').val();
	var orgName=$('#selectedOrgType').val();
	var country=$('#selectedCountryType').val();
	var city=$('#selectedCityType').val();
	var area=$('#selectedAreaType').val();
	var orgid=$('#selectedOrgIdType').val();
	var client=$("#selectedClientType").is(':checked') ? 1 : 0;
//	console.log("client data: "+client);
	var id = [];
	 listData={
			'orgGroup':orgGroup,
			'orgBrand':orgBrand,
			'orgName':orgName,
			'country':country,
			'city':city,
			'area':area,
			'orgid':orgid,
			'client':client,
			'ids':id
	}
	 
	 var jsonListData = JSON.stringify(listData);
	//console.log("array :"+jsonObject);
	var jsonString = JSON.stringify(jsonObject);
	//console.log("department going to save :"+jsonString);
	$.ajax({
		type:"POST",
		url:departmentUrl+"save.htm?orgid="+selectedOrganizationNameId+"&listData="+jsonListData,
		contentType:"application/json",
		data:jsonString,
		success:function(response){
			console.log("response "+response.status);
				var errorMessage= "";
				if(response.status=="SAVE_SUCCESS"){
				//$('#filterDepartmentForm').trigger("reset");
				$('#addAndEditDepartmentDiv').hide();
				var html = listDepartmentFormHtml(response);
				$('#departmentListData').append(html);
				$('#departmentListTable').dataTable();
				$('#departmentListData').show();
				$('#listDepartmentTab').show();
				$('#addDepartmentSuccessDiv').show(600);
				$('#page-wrapper').unmask();
				//new 2016-04-05
				
				//listDepartment();
				//end
				//generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			}else if(response.status=="EMPTY_DATA"){
				scrollDown(divId);
				$('#addDepartmentErrorDiv').show(600);
				$('#Add-departmentName-Error').addClass('has-error has-feedback');
				 errorMessage = response.errorMessage;
				$('#tableDataErrorDiv').html(errorMessage);
				$('#tableDataErrorDiv').show(600);
				$('#page-wrapper').unmask();
			}else if(response.status=="INVALID_MOBILE"){
				scrollDown(divId);
				$('#addDepartmentErrorDiv').show(600);
				$('#Add-departmentName-Error').addClass('has-error has-feedback');
				errorMessage = response.errorMessage;
				$('#tableDataErrorDiv').html(errorMessage);
				$('#tableDataErrorDiv').show(600);
				$('#page-wrapper').unmask();
			}else if(response.status=="INVALID_EMAIL"){
				scrollDown(divId);
				$('#addDepartmentErrorDiv').show(600);
				$('#Add-departmentName-Error').addClass('has-error has-feedback');
				errorMessage = response.errorMessage;
				$('#tableDataErrorDiv').html(errorMessage);
				$('#tableDataErrorDiv').show(600);
				$('#page-wrapper').unmask();
			}
			else{
				$('#page-wrapper').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;
	
	
}
//********************************************  END  ******************************************************//	

/********************************************************************************************************************************************************/
/*******************************************Edit Departments***************************************************************************************/
/********************************************************************************************************************************************************/
function editDepartment(id){
	clearDepartmentMessageDivs();
	$('#editDepartmentMappingDiv').html('');
	$('#editDepartmentMappingTable').html('');
	$.ajaxSetup({
		cache : false
	});
	//alert("id :"+id);
	console.log("id is :"+id);
	$('#page-wrapper').mask('Loading...');
	$.get(departmentUrl+"updateForm.htm?id="+id,function(response){
		console.log("respose in edit department:"+JSON.stringify(response))
		if(response.status=="UPDATE_VIEW_SUCCESS"){
			var html = updateDepartmentFormHtml(response,id);
			var divId = $('#'+getDivId("Department"));
			console.log("div id: "+divId);
			appendOrganizationAddOrEditForm(divId, html);
			$('#editDepartmentMappingTable').dataTable();
			$('#editDepartmentMappingDiv').show();
			$('#editDepartmentMappingTable_length').hide();
			$('#editDepartmentMappingTable_info').hide();
			$('#editDepartmentMappingTable_filter').hide();
			$('#editDepartmentMappingTable_paginate').hide();
		}else{
			var errorMessage = '<h4 style="color:red">Error In Update Department Form</h4>';
			$('#departmentDataDiv').append(errorMessage);
			$('#page-wrapper').unmask();
		}
		
	},'json').fail(function(response){
		$('#page-wrapper').mask(response.status+"**************"+response.statusText);
	});
	return false;
}

function updateDepartmentFormHtml(response,id){
	
	$.ajaxSetup({
		cache : false
	});
	var organizationGroup = response.successObject.organizationGroup;
	var organizationBrandList = response.successObject.organizationBrands;
	var organization = response.successObject.organization;
	var editdepartmentlist = response.successObject.editdepartmentlist;
	console.log("group :"+organizationGroup.organizationGroupName);
	var html = "";
	html+=	addFormHeading("Edit Department");
	html += '<div id="editDepartmentMappingDiv" class="SubHeading addAdminForm col-xs-12">';
	html+=	'<form class="col-sm-12" id="updateDepartmentForm">';
	/** ****************************************Error Div**************************************************** */
	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="editDepartmentErrorDiv">';
	html+=	'&nbsp;<img alt="../" src="../resources/images/error.jpg"> Errors Occured.Please Check';
	html += '</div>';
	
	
		var organizationGroupName = organizationGroup.organizationGroupName;
		html += '<div class="form-group" id="addDepartment-organizationGroupName-DropDownDiv">';
		html += '<label>Organization Group<font style="color: red">*</font></label>';
		html +=	'<select class="form-control"  style="width: 50%" id="editDepartment-organizationGroupId" disabled>';
		html += '<option  value="0">'+organizationGroupName+'</option>';
		html +=	'</select>';
		html += '</div>';
	
	/** ************************************Organization Brand Dropdown***************************************************** */
		var organizationBrandName = organizationBrandList.organizationBrandName;
		html += '<div class="form-group" id="editDepartment-organizationBrandName-DropDownDiv">';
		html += '<label>Organization Brand<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="editDepartment-organizationBrandId" style="width: 50%" disabled>';
		html += '<option  value="0">'+organizationBrandName+'</option>';
		html +=	'</select>';
		html += '</div>';
	/** ************************************Organization Dropdown***************************************************** */
		var organization = organization.organizationFullName;
		html += '<div class="form-group" id="editDepartment-organizationFullName-DropDownDiv">';
		html += '<label>Organization<font style="color: red">*</font></label>';
		html +=	'<select class="form-control" id="editDepartment-organizationNameId" style="width: 50%" disabled>';
		html += '<option  value="0">'+organization+'</option>';
		html +=	'</select>';
		html += '</div>';
		
		
	/** ********************************Edit Department mapping from************************************ **/	
		html+= '<div class="alert alert-danger alert-error" style="display: none;"	id="EditTableDataErrorDiv"></div>';
		html+=	'<h4><b>Select Department Settings</b>(Please Note:To add additonal department go to Department type Master or Contact Your Admin)</h4>';
		html+= "<table class='table table-striped dataTable no-footer' border='1px' id='editDepartmentMappingTable'>";
		html+= "<thead>";
		html+=	"<tr>";
		html+=	"<th>DepartmentName</th>";
		html+=	"<th>Is Applicable</th>";
		html+=	"<th>Department Head Name</th>";
		html+=	"<th>Designation</th>";
		html+=	"<th>Email ID</th>";
		html+=	"<th>Mobile Number</th>";
		html+=	"<th></th>";
		html +=	"</tr>";
		html +=	"</thead>";
		html +=	"<tbody>";
		var j=1;
		for(var i=0;i<editdepartmentlist.length;i++){
			//var list = departmentList[i];
			//console.log(list.id);
			var departmentId = editdepartmentlist[i].id;
			var designation = editdepartmentlist[i].designation;
			var departmentName = editdepartmentlist[i].departmentName;
			var departmentHeadName = editdepartmentlist[i].departmentHeadName;
			var mobile = editdepartmentlist[i].mobile;
			var email = editdepartmentlist[i].email;
			var departmentTypeId = editdepartmentlist[i].departmentTypeId;
			var status = editdepartmentlist[i].status;
			html+=	'<tr>';
				html+= '<td><label class="control-label col-xs-4" for="deptType" id="departmentLable_'+j+'">'+departmentName+'</lable></td>';
				html+=	'<td><select id="selectedType_'+j+'" class="form-control input-sm" style="width:100%;" onchange="changeApplicable('+j+')">';
				if(status==1){
				html+= '<option  value="YES" selected>YES</option>';
				html+= '<option  value="NO">NO</option>';
				}else{
				html+= '<option  value="YES">YES</option>';
				html+= '<option  value="NO" selected>NO</option>';
				}
				html+= '</select> </td>';
				html+= '<input type="hidden" id="departmentId_'+j+'" value="'+departmentId+'">';
				if(departmentHeadName!=null && designation!=null && mobile!=null && email!=null){
					if(status==1){
					html+=	'<td> <input type="text" class="form-control" id="departmentHeadName_'+j+'" style="width: 105%" placeholder="Dept Head Name" value="'+departmentHeadName+'"></td>';
					html+=	'<td> <input type="text" class="form-control" id="designation_'+j+'" style="width: 100%" placeholder="Designation" value="'+designation+'"></td>';
					html+=	'<td> <input type="text" class="form-control" id="EmailID_'+j+'" style="width: 100%" placeholder="Email ID" value="'+email+'"></td>';
					html+=	'<td> <input type="text" class="form-control" id="MobileNumber_'+j+'" style="width: 107%" placeholder="Mobile Number" value="'+mobile+'"></td>';
					}else{
						html+=	'<td> <input type="text" class="form-control" id="departmentHeadName_'+j+'" style="width: 105%" placeholder="Dept Head Name" value="'+departmentHeadName+'" disabled></td>';
						html+=	'<td> <input type="text" class="form-control" id="designation_'+j+'" style="width: 100%" placeholder="Designation" value="'+designation+'" disabled></td>';
						html+=	'<td> <input type="text" class="form-control" id="EmailID_'+j+'" style="width: 100%" placeholder="Email ID" value="'+email+'" disabled></td>';
						html+=	'<td> <input type="text" class="form-control" id="MobileNumber_'+j+'" style="width: 107%" placeholder="Mobile Number" value="'+mobile+'" disabled></td>';
					}
					}else{
					html+=	'<td> <input type="text" class="form-control" id="departmentHeadName_'+j+'" style="width: 105%" placeholder="Dept Head Name" value=""></td>';
					html+=	'<td> <input type="text" class="form-control" id="designation_'+j+'" style="width: 100%" placeholder="Designation" value=""></td>';
					html+=	'<td> <input type="text" class="form-control" id="EmailID_'+j+'" style="width: 100%" placeholder="Email ID" value=""></td>';
					html+=	'<td> <input type="text" class="form-control" id="MobileNumber_'+j+'" style="width: 107%" placeholder="Mobile Number" value=""></td>';
				}
				
			
			html+=	'<td class="text-right"><span><button type="button" id="editMappingId_'+j+'" class="btn btn-xs AdminInList" title="Edit" onclick="editDepartmentMapping('+departmentTypeId+',\''+ departmentName +'\')"  ><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></td>';
			html+=	'</tr>';
			j++;
		}
		html+=	"</tbody>";
		html+=	"</table>";
	html+=	'</div>';
	html+=	'</div>';
	
	
	/** ************************************Button***************************************************** */
	/*html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateDepartment('+id+')">';*/
	if(editdepartmentlist = null || editdepartmentlist == undefined || editdepartmentlist == ""){
		
		html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateDepartment('+id+')" disabled>';
	}else{
		html += '<input type="button" class="btn btn-primary" value="Update" onclick ="updateDepartment('+id+')">';
	}
	html+=	appendCancelButton(getDivId("Department"),"page-wrapper");//Adding Cancel Button
	html+=	'</form>';
	html+=	'</div>';
	return html;
}

function updateDepartment(id){
	$.ajaxSetup({
		cache : false
	});
	/*$('#editDepartmentMappingTable').html('');
	$('#editDepartmentMappingDiv').html('');*/
	var noVal = [];
	console.log("in update depatment orgiD: "+id);
	$('#page-wrapper').mask('Loading...');
	var divId = $('#'+getDivId("Department"));
	$('#editDepartmentErrorDiv').hide();
	$('#editDepartmentSuccessDiv').hide();
	$('.help-inline').empty();
	$('.form-group').removeClass('has-error has-feedback');
	$('#page-wrapper').mask('Loading...');
	
	var table = $('#editDepartmentMappingTable').DataTable();
	var data = table.rows().data();
	console.log("total length :"+data.length);
	console.log("table data: "+data);
	var j = 1;
	var jsonObject = [];
	for(var i=0;i<data.length;i++){
		console.log("inside for loop");
		var data1 = table.rows(i).data();
		var selectedType = $('#selectedType_'+j).val();
		if(selectedType == 'YES'){
			var deptHeadName = $('#departmentHeadName_'+j).val();
//			console.log("deptHeadName :"+deptHeadName);
			var designation = $('#designation_'+j).val();
			var EmailID = $('#EmailID_'+j).val();
			var MobileNumber = $('#MobileNumber_'+j).val();
			var departmentName = $('#departmentLable_'+j).text();
			var departmentId = $('#departmentId_'+j).val();
	//		console.log("department id:"+departmentId);
		//	console.log("department name :"+departmentName);
			obj = {
					'id':departmentId,
					'departmentName':departmentName,
					'organizationId':id,
			        'departmentHeadName': deptHeadName,
			        'designation': designation,
			        'email' : EmailID,
			        'mobile' :MobileNumber
			    };
			jsonObject.push(obj);
		
		j++;
	}else{
		var departmentId = $('#departmentId_'+j).val();
		noVal.push(departmentId);
		j++;
	}
}
	var jsonString = JSON.stringify(jsonObject);
	console.log("no selected dept id :"+noVal);
	//console.log("json object to update:"+jsonString);
	
	//var departmentJSONObject = {'departmentName':departmentName,'id':id,'attributeMappings':departmentAttributes,'departmentKPIs':departmentKPIs};
	$.ajax({
		type:"POST",
		url:departmentUrl+"update.htm?ids="+noVal,    
		contentType:"application/json",
		data:jsonString,
		success:function(response){
			
			if(response.status=="UPDATE_SUCCESS"){
				var html = listDepartmentFormHtml(response);
				$('#departmentListData').append(html);
				$('#departmentListTable').dataTable();
				$('#departmentListData').show();
				$('#listDepartmentTab').show();
				$('#editDepartmentSuccessDiv').show(600);
				$('#page-wrapper').unmask();  
				//new 2016-04-05
				/*console.log("");
				listDepartment();
				$('#editDepartmentSuccessDiv').show();
				$('#page-wrapper').unmask();*/
				//
				//generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);
			}else if(response.status=="EMPTY_DATA"){
				scrollDown(divId);
				$('#editDepartmentErrorDiv').show(600);
				$('#Edit-departmentName-Error').addClass('has-error has-feedback');
				 errorMessage = response.errorMessage;
				 console.log("error mesage : "+errorMessage);
				$('#EditTableDataErrorDiv').html(errorMessage);
				$('#EditTableDataErrorDiv').show(600);
				$('#page-wrapper').unmask();
			}else if(response.status=="INVALID_MOBILE"){
				scrollDown(divId);
				$('#editDepartmentErrorDiv').show(600);
				$('#Edit-departmentName-Error').addClass('has-error has-feedback');
				errorMessage = response.errorMessage;
				console.log("error mesage : "+errorMessage);
				$('#EditTableDataErrorDiv').html(errorMessage);
				$('#EditTableDataErrorDiv').show(600);
				$('#page-wrapper').unmask();
			}else if(response.status=="INVALID_EMAIL"){
				scrollDown(divId);
				$('#editDepartmentErrorDiv').show(600);
				$('#Edit-departmentName-Error').addClass('has-error has-feedback');
				errorMessage = response.errorMessage;
				console.log("error mesage : "+errorMessage);
				$('#EditTableDataErrorDiv').html(errorMessage);
				$('#EditTableDataErrorDiv').show(600);
				$('#page-wrapper').unmask();
			}
			else{
				$('#page-wrapper').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;
}


/************************************************END***********************************************************************************/


/************************************************EDIT DEPARTMENT MAPPING MODAL *******************************************************/

function editDepartmentMapping(id,departmentTypeName){
	$.ajaxSetup({
		cache : false
	});
		var departmentTypeId = id;
		var infoModal = $('#editDepaertmentMapping');
		$('#AddDepartmentMOdalError').html('');
		$('#AddDepartmentModalSucess').html('');
		var title = "";
		var html = "";
		var nameTitle = "";
		title+=	'Additional Department Attributes';
		nameTitle = '<br>&nbsp;&nbsp;&nbsp;&nbsp; <b>'+departmentTypeName+' </b> (Add more department attribute from department type or contact your admin)<b><hr></b>';
		
		$.get(departmentUrl+"getEditDepartmentMappingModal.htm?departmentTypeId="+departmentTypeId,function(response){
			console.log("first"+response.status);
			if(response.status=="SUCESS"){
				html = editDepartmentMappingModal(response);
				$('#AddDepartmentMOdalError').hide();
				infoModal.find('#modal-title').html(title);
				infoModal.find('#departmentTitle').html(nameTitle);
				infoModal.find('#editDepartmentMappingDiv').html(html);
				infoModal.find('#editDepartmentMappingDiv').show();
				infoModal.find('#save').prop("disabled",false);
				infoModal.modal('show');
			}else if(response.status=="EMPTY_DEPARTMENT_ATTRIBUTE"){
				infoModal.find('#editDepartmentMappingDiv').hide();
				infoModal.find('#modal-title').html(title);
				infoModal.find('#departmentTitle').html(nameTitle);
				$('#AddDepartmentMOdalError').html('');
				$('#AddDepartmentMOdalError').append("<h5>&nbsp;&nbsp;&nbsp;&nbsp;No attribute map to department type!</h5>");
				infoModal.find('#save').prop("disabled",true);
				$('#AddDepartmentMOdalError').show();
				infoModal.modal('show');
			}else if(response.status=="EMPTY_DEPARTMENT_ATTRIBUTE_MAPPING"){
				infoModal.find('#editDepartmentMappingDiv').hide();
				infoModal.find('#modal-title').html(title);
				infoModal.find('#departmentTitle').html(nameTitle);
				$('#AddDepartmentMOdalError').html('');
				$('#AddDepartmentMOdalError').append("<h5>&nbsp;&nbsp;&nbsp;&nbsp;No attribute map to department type!</h5>");
				infoModal.find('#save').prop("disabled",true);
				$('#AddDepartmentMOdalError').show();
				infoModal.modal('show');
			}
			else{
				$('#page-wrapper').mask(response.errorMessage);
			}
		},'json').fail(function(response){
			$('#page-wrapper').mask(response.status+"**********"+response.statusText);
		});
		return false;	
}
var length;
function editDepartmentMappingModal(response){
	var departmentAttribute = response.successObject.departmentAttribute;
	var departmentAttributeMapping = response.successObject.departmentAttributeMapping;
	var html = "";
	length = departmentAttribute.length;
	html+='<form class="form-inline">';
	for(var i=0;i<departmentAttribute.length;i++){
		var attributeKey=departmentAttribute[i].attributeKey;
		var id = departmentAttributeMapping[i].id;
		var attributeValue = departmentAttributeMapping[i].attributeValue;
		var attributeKeyId = departmentAttributeMapping[i].attributeKeyId;
		html+='<br>';
		html+='<label for="'+attributeKey+'" style="width:140px" "attributeKey'+i+'">'+attributeKey+'</label>';
		html+='<input type="hidden" id="id'+i+'" value="'+id+'">';
		html+='<input type="hidden" id="attributekeyId'+i+'" value="'+attributeKeyId+'">';
		if(attributeValue != null){
			html+='<input type="text" class="form-control input-sm" value="'+attributeValue+'" style="width:250px;" id="attributevalue'+i+'"><br><br>';
		}else{
			attributeValue = '';
			html+='<input type="text" class="form-control input-sm" value="'+attributeValue+'" style="width:250px;" id="attributevalue'+i+'"><br><br>';
		}
	}
	html+='</form">';
	return html;
}
function saveDepartmentAttribute(){
	clearDepartmentMessageDivs();
	$('#AddDepartmentMOdalError').html('');
	$('#AddDepartmentModalSucess').html('');
	$('#page-wrapper').mask();
	var attributeObject = [];
	for(var v=0;v<length;v++){
		var id = $('#id'+v).val();
		var attributeKeyId = $('#attributekeyId'+v).val();
		var attributeValue = $('#attributevalue'+v).val();
		obj = {
				'attributeKeyId':attributeKeyId,
				'attributeValue':attributeValue,
				'id':id
		    };
		attributeObject.push(obj);
	}
	//console.log("json object :"+JSON.stringify(attributeObject));
	$.ajax({
		type:"POST",
		url:departmentUrl+"saveDepartmentAttribute.htm",
		contentType:"application/json",
		data:JSON.stringify(attributeObject),
		success:function(response){
				var errorMessage= "";
				if(response.status=="SAVE_SUCCESS"){
				/*$('#editDepaertmentMapping').modal('hide');*/
				$('#AddDepartmentMOdalError').html('');
				$('#AddDepartmentModalSucess').html('');
				$('#AddDepartmentModalSucess').append("<h5>&nbsp;&nbsp;&nbsp;Department(s) Attribute Added Successfully</h5>");
				$('#AddDepartmentModalSucess').show();
				$('#editDepaertmentMapping').modal('show')
				/*var html = listDepartmentFormHtml(response);
				$('#departmentListData').append(html);
				$('#departmentListTable').dataTable();
				$('#departmentListData').show();
				$('#listDepartmentTab').show();
				$('#addDepartmentAttributeSuccessDiv').show(600);*/
				$('#page-wrapper').unmask();
			}else if(response.status=="EMPTY_ATTRIBUTE_VALUE"){
				$('#AddDepartmentModalSucess').html('');
				$('#AddDepartmentMOdalError').html('');
				$('#AddDepartmentMOdalError').append("<h5>&nbsp;&nbsp;&nbsp;Attribute value can't be empty!Required</h5>");
				$('#AddDepartmentMOdalError').show();
			}else if(response.status=="INVALID_ATTRIBUTE_VALUE"){
				$('#AddDepartmentModalSucess').html('');
				$('#AddDepartmentMOdalError').html('');
				$('#AddDepartmentMOdalError').append("<h5>&nbsp;&nbsp;&nbsp;Invalid Attribute Value!</h5>");
				$('#AddDepartmentMOdalError').show();
			}
			else{
				$('#page-wrapper').mask(response.errorMessage);
			}
			
		},error:function(response){
			$('#page-wrapper').mask(response.status+"***********"+response.statusText);
		}
	});
	return false;
}
/************************************************* END *******************************************************************************/

/********************************************************************************************************************************************************/
/*******************************************Delete Departments***************************************************************************************/
/********************************************************************************************************************************************************/
function deleteDepartment(){
	var ids = selectedIds('departmentCheckBox');//Pass Check Box Class
	
	listData.ids = ids;
	//console.log("filter data :"+JSON.stringify(listData));
	clearDepartmentMessageDivs();
	if(ids.length>0){
		listData.ids = ids;
		if(confirm("Are you sure you want to delete selected item(s)?")){
			$('#page-wrapper').mask('Loading...');
			clearDepartmentMessageDivs();
			$.ajax({
				type:"POST",
				url:departmentUrl+"/delete.htm",
				contentType:"application/json",
				data:JSON.stringify(listData),
				success:function(response){
					if(response.status=="DELETE_SUCCESS"){
						/*var tabButtonsId = $('#departmentTabButtons');
						var dataDivId = $('#departmentDataDiv');
						var successDivId = "deleteDepartmentSuccessDiv"
						var tableId = "departmentListTable";
						var html = listDepartmentFormHtml(response);
						generateList(tabButtonsId, dataDivId, successDivId, tableId, maskId, html);*/
						
						var html = listDepartmentFormHtml(response);
						$('#departmentListData').append(html);
						$('#departmentListTable').dataTable();
						$('#departmentListData').show();
						$('#listDepartmentTab').show();
						$('#deleteDepartmentSuccessDiv').show(600);
						$('#page-wrapper').unmask();
					}else{
						$('#deleteDepartmentErrorDiv').html('');
						var errorMessage = '&nbsp;<img alt="../" src="../resources/images/error.jpg"> '+response.errorMessage+'';
						$('#deleteDepartmentErrorDiv').append(errorMessage);
						$('#deleteDepartmentErrorDiv').show(600);
						$('input:checkbox').removeAttr('checked');
						$('#page-wrapper').unmask();
					}
				},error:function(response){
					$('#page-wrapper').mask(response.status+"*********"+response.statusText);
				}
			});
			return false;
		}
		}else{
			alert("Please select record");
			return false;
		}

}
/*********************************************************RAJESH END *********************************************//********************************************************************************************************************************************
 **********************C h e c k B o x********************************************************************************************************
 **********************************************************************************************************************************************/ 
//Check All Check Box
$(document).on('click',"#checkAllDepartmentCheckBox",function(){
    $('.departmentCheckBox').prop('checked', $(this).is(':checked'));
  });
//Individual Check Box
$(document).on('click',".departmentCheckBox",function(){
    if($('.departmentCheckBox:checked').length == $('.departmentCheckBox').length) {
      $('#checkAllDepartmentCheckBox').prop('checked', true);
    }
    else {
      $('#checkAllDepartmentCheckBox').prop('checked', false);
    }
});
function confirmCheckBox(){
	$( "#dialog-confirm" ).dialog({
	      resizable: false,
	      height:140,
	      modal: true,
	      buttons: {
	        "Delete all items": function() {
	         // $( this ).dialog( "close" );
	        },
	        Cancel: function() {
	          $( this ).dialog( "close" );
	        }
	      }
	    });
}
function appendOrganizationAddOrEditForm(divId,method){
	divId.html('');
	divId.append(method);
	divId.show(600);
	scrollDown(divId);
	//clearOrganizationGroupMessageDivs();//Clearing Geo Country Error/Sucess Message Div
	//clearOrganizationMessageDivs();
	//clearDepartmentMessageDivs();
	maskId.unmask();
}

/*function clearOrganizationGroupMessageDivs(){
	$('#addOrganizationGroupSuccessDiv,#editOrganizationGroupSuccessDiv,#deleteOrganizationGroupSuccessDiv,#deleteOrganizationGroupErrorDiv,#orgGroupFilterButtons').hide();
}*/ 
function clearOrganizationGroupMessageDivs(){
	$('#addOrganizationGroupSuccessDiv,#editOrganizationGroupSuccessDiv,#deleteOrganizationGroupSuccessDiv,#deleteOrganizationGroupErrorDiv').hide();
}
function clearOrganizationMessageDivs(){
	$('#addOrganizationSuccessDiv,#editOrganizationSuccessDiv,#deleteOrganizationSuccessDiv,#deleteOrganizationErrorDiv,#drops').hide();
}
function clearDepartmentMessageDivs(){
	$("#addDepartmentSuccessDiv,#editDepartmentSuccessDiv,#deleteDepartmentSuccessDiv,#deleteDepartmentErrorDiv,#dropsDiv,#addDepartmentAttributeSuccessDiv").hide();
}