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
    <title><spring:message code="label.user.manage" /></title>
<%@include file="includeCssFiles.jsp"%>
<style type="text/css">

table1     { display: table }
tr1        { display: table-row }
thead1     { display: table-header-group }
tbody1     { display: table-row-group }
tfoot1     { display: table-footer-group }
col1       { display: table-column }
colgroup1  { display: table-column-group }
td1, th1    { display: table-cell }
caption1   { display: table-caption }

#caption1 {caption-side: top}
#caption1 {caption-side: bottom}

#table1 {display: table;}
.row1 {display: table-row;}
.cell1 {display: table-cell;}

</style>
</head>
<body>
	<div id="wrapper">
	<%@include file="adminDashboard.jsp" %>
		<div id="page-wrapper" >
			<div class="row">
				<div class="col-lg-12">
		            <h1 class="page-header">Organization Information</h1>
		        </div>
					<div class="panel panel-admin">
						<div class="panel-body">
							<div class="tab-content">
								<form class="form-inline col-xs-12 SubHeading AdminMainActivity">
									<label class="control-label" for="Industry">Select hotel chain/group
										<select id="organizationGroupId" class="form-control input-sm" style="width: auto;" >
											   <option value="0" selected disabled="disabled">--- Select ---</option>
											    <c:forEach var="organizationGroup" items="${organizationGroupMap}">
				     									 <option id="${organizationGroup.key}" value="${organizationGroup.key}">${organizationGroup.value}</option>   
				  									</c:forEach>
										</select>
									</label> 
									<input class="btn btn-primary" id="viewList" onclick="populateOrgTable()" value="View Organization(s)" style="margin-bottom:-5px;" type="button">
								</form> 
								<div class="" id="tblDiv"></div>
							</div>
					        <div class="" style="display:none" id="container">
					        	<div id="" class="col-sm-12">
					        		<div class="SubHeading addAdminForm col-xs-14 row">
					        			<div class="col-sm-12 Action_heading">
					        				<h4>Organization Information Details</h4>
					        			</div>
					        			<div class="" id="viewDetailDiv">
					        			</div>
					        		</div>
					        	</div>
					        </div>	
					    </div>
					 </div>
			    
			    <a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
		    </div>
		</div>
	</div>
	
	
	<!--edit Brand Modal-->
	<div class="modal fade"  tabindex="-1" role="dialog" id="editBrandModal" aria-labelledby="" aria-hidden="true">
		<div class="modal-dialog modalSmallWidth">
			<div class="modal-content moduleSmall-content">
				<div class="modal-header">
					<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
					<h4 class="modal-title" id="broadcastSuccessModalTitle">Edit</h4>
				</div>
				<div id="body2"   align="center" class="modal-body">
				 	<!-- <p id="broadcastSuccessModalText" class="warning">Review broadcasted successfully !</p> -->
				 	<label>Organization Brand<font style="color: red">*</font></label>
				 	<input type="text" value="" id="brandNameInput" />
				 	
				 	<span id="brandUpdateErrorSpan" style="display:none" > hello</span>
				 	<input type="hidden" id="brandIdInput" />
				 	<div class="row mt10">
						<button class="btn btn-primary" aria-hidden="true" onclick="updateBrand()" type="button">Update</button>
						<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- End of edit brand Modal -->
	
	
	<!--Success Message Modal-->
				<div class="modal fade"  tabindex="-1" role="dialog" id="alertModal" aria-labelledby="" aria-hidden="true">
					<div class="modal-dialog modalSmallWidth">
						<div class="modal-content moduleSmall-content">
							<div class="modal-header">
								<!-- <button class="ButtonWhiteClose right" type="button" data-dismiss="modal" aria-hidden="true"></button> -->
								<h4 class="modal-title" id="updateSuccessModalTitle">Alert</h4>
							</div>
							
							<div id="body2"   align="center" class="modal-body">
							 	<p id="updateSuccessModalText" class="warning">Please Select Organization Group</p>
							 	<div class="row mt10">
								 	
									<button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">OK</button>
								</div>
							</div>
							
							
						</div>
					</div>
				</div>
				<!-- End of Success Message Modal -->  
				
	<script
		src="<%=request.getContextPath()%>/resources/jquery/jquery-1.11.0.js"></script>

	<!-- Bootstrap Core JavaScript -->
	<script
		src="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.min.js"></script>

	<!-- Metis Menu Plugin JavaScript -->
	<script
		src="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.js"></script>

	<!-- Custom Theme JavaScript -->
	<script
		src="<%=request.getContextPath()%>/resources/bootstrap/main.js"></script>

	<!-- Bootstrap jqueryUI JavaScript For Date Picker-->
	<script	src="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.js"></script>
	
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/jquery.dataTables.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/bootstrap/dataTables.bootstrap.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.dataTables.min.js"></script>
<script>
$(document).ready(function(){
	
	$("#id").prop("selectedIndex", 1).change();
	
});

function populateOrgName(){
	var orgId=$('#id option:selected').val();
	$.ajax({
		type : "GET",
		url : "../user/getUserDepartmentsByOrgId.htm?orgId="+orgId,
		contentType : "application/json",
		success : function(response) {
			var departments = response.successObject.departments;
			var departmentsSelectHtml='<select onchange="departmentOnChange();" id="department" name="department">';
			departmentsSelectHtml+='<option disabled selected value="0">--- Select ---</option>'; 
			for(var i=0;i<departments.length;i++){
				departmentsSelectHtml+='<option value="'+departments[i].id+'">'+departments[i].departmentName+'</option>';
			}
			departmentsSelectHtml+='</select>';
			$('#departmentsSelectDiv').html(departmentsSelectHtml);
			$("#department").prop("selectedIndex", 1).change();
			
			if($('#department option:selected').val()!="--- Select ---"){
				$('#departmentName').val($('#department option:selected').text());
				$('#departmentId').val($('#department option:selected').val());
			}
			
		},
		error : function(response) {
			return false;
		}
	});
	
	if($('#id option:selected').val()!="--- Select ---"){
		$('#organizationFullName').val($('#id option:selected').text());
		$('#organizationId').val($('#organization option:selected').val());
	}
}
function departmentOnChange(){
	if($('#department option:selected').val()!="--- Select ---"){
		$('#departmentName').val($('#department option:selected').text());
		$('#departmentId').val($('#department option:selected').val());
	}
}

$('INPUT[type="file"]').change(function () {
    var ext = this.value.match(/\.(.+)$/)[1];
    switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            $('#uploadButton').attr('disabled', false);
            break;
        default:
            alert('This is not an allowed file type.');
            this.value = '';
    }
});
var organizationList;
function populateOrgTable(){
	$('#container').hide();
	var orgGroupId=$('#organizationGroupId option:selected').val();
	
	if(orgGroupId==0){
		$('#alertModal').modal('show');
		return;
		
	}
	$.ajax({
		type : "GET",
		url : "../user/getOrgsByOrgGroupId.htm?orgGroupId="+orgGroupId,
		contentType : "application/json",
		success : function(response) {
			organizationList=response.successObject.organizations;
		var	html = "<table class='table table-striped dataTable no-footer' id='organizationListTable'>";
			html += "<thead>";
			html +=	"<tr>";
			html +=	"<th>Organization Names</th>";
			html +=	"<th>Organization Brand</th>";
			html +=	"<th></th>";
			html +=	"</tr>";
			html +=	"</thead>";
			html +=	"<tbody>";
			for(var i=0;i<organizationList.length;i++){
				var orgId = organizationList[i].id;
				var organizationFullName = organizationList[i].organizationFullName;
				var organizationBrandName = organizationList[i].organizationBrandName;
				html+=	'<tr>';
				html+=	'<td>'+organizationFullName+'</td>';
				html+=	'<td>'+organizationBrandName+'</td>';
				html+=	'<td class="text-right"><button onclick="viewDetail('+i+')" type="button" class="btn btn-xs AdminInList" >View Details</button></td>';
				html+=	'</tr>';
			}
			html +=	"</tbody>";
			html +=	"</table>";

			$('#tblDiv').html(html);
			$('#organizationListTable').dataTable();
			
		},
		error : function(response) {
			return false;
		}
	});
	
}

function viewDetail(orgIndex){
	$('#container').show();
	$('#viewDetailDiv').empty();
	var htmlCode = '';
	
	var organization=organizationList[orgIndex];
	var organizationGroup=$('#organizationGroupId option:selected').text();
	
	var organizationName=organization.organizationFullName;
	var organizationBrandName=organization.organizationBrandName;
	
	$('#brandIdInput').val(organization.organizationBrandId);
	
	var occupancyVolume=organization.occupancyVolume;
	var orgId=organization.id;
	$.ajax({
		type : "GET",
		url : "../user/getGeoMasterForOrgId.htm?orgId="+orgId+"&orgIndex="+orgIndex,
		contentType : "application/json",
		success : function(response) {
			var geoMaster=response.successObject.geoMaster;
			if(geoMaster.geoCountryName==null){
				geoMaster.geoCountryName="Not Available";
			}
			if(geoMaster.geoName==null){
				geoMaster.geoName="Not Available";
			}
			if(geoMaster.geoAreaName==null){
				geoMaster.geoAreaName="Not Available";
			}
			if(geoMaster.geoCityName==null){
				geoMaster.geoCityName="Not Available";
			}
			htmlCode='<div class="col-sm-6"><h4>Organization Location Details</h4>'
			+'<div id="table1">'
			  +'<div class="row1">'
			  	+'<span class="cell1">Country  : </span>'
			  	+'<span class="cell1">'+geoMaster.geoCountryName+'</span>'
			  +'</div>'
			  +'<div class="row1">'
			  	+'<span class="cell1">City : </span>'
			  	+'<span class="cell1">'+geoMaster.geoCityName+'</span>'
			  +'</div>'
			  +'<div class="row1">'
			  	+'<span class="cell1">Area : </span>'
			  	+'<span class="cell1">'+geoMaster.geoAreaName+'</span>'
			  +'</div>'
			  +'<div class="row1">'
			  	+'<span class="cell1">Near by  areas : </span>'
			  	+'<span class="cell1">'+geoMaster.geoName+'</span>'
			  +'</div>' 
			  +'</div>' 
			+'</div>';
			
			htmlCode+='<div class="col-sm-6" style="margin-top:20px"><h4>Public Page Images</h4>'
				+'<div id="table1">'
				  +'<div class="row1">'
				  	+'<span class="cell1">Public Page Header  : </span>'
				  	+'<span class="cell1"><a target="_blank" style="color: rgb(0,0,255)" href="<%=request.getContextPath()%>/resources/images/header/'+organization.header+'"  >'+organization.header+'</a></span>'
				  +'</div>'
				  +'<div class="row1">'
				  	+'<span class="cell1">Public Page Footer : </span>'
				  	+'<span class="cell1"><a target="_blank" style="color: rgb(0,0,255)" href="<%=request.getContextPath()%>/resources/images/footer/'+organization.footer+'" >'+organization.footer+'</a></span>'
				  +'</div>'
				  +'</div>'
				+'</div>';
				
			htmlCode+='<div class="col-sm-6" style="margin-top:20px"><h4>Other Information</h4>'
					+'<div id="table1">';
					var organizationAttributeList=organization.organizationAttributeList;
					
					  for(var i=0;i<organizationAttributeList.length;i++){
						  if(organizationAttributeList[i].attributeKeyType=="IMAGE"){
						  htmlCode+='<div class="row1">'
								  		+'<span class="cell1">'+organizationAttributeList[i].attributeKey+': </span>'
								  		+'<span class="cell1"><a target="_blank" style="color: rgb(0,0,255)" href="<%=request.getContextPath()%>/resources/images/footer/'+organizationAttributeList[i].attributeValue+'" >'+organizationAttributeList[i].attributeValue+'</a></span>'
					  				+'</div>';
						  }else{
							  htmlCode+='<div class="row1">'
							  		+'<span class="cell1">'+organizationAttributeList[i].attributeKey+': </span>'
							  		+'<span class="cell1">'+organizationAttributeList[i].attributeValue+'</span>'
				  				+'</div>';
						  }
					  }
					  if(organizationAttributeList.length==0){
					  htmlCode+='<div class="row1">'
					  		+'<span class="cell1">No other information available. </span>'
		  				+'</div>';
					  }
					  
			htmlCode+='</div>'		
						+'</div>';
			
			
			var departments=organization.departments;
			if(departments.length>0){
				htmlCode+='<div class="col-sm-10" style="margin-top:20px"><h4>Associated Departments</h4></div>';
			}
			for(var j=0;j<departments.length;j++){
				
				htmlCode+='<div class="col-sm-6" style="margin-top:20px">'
		    		+'<div class="panel panel-default ">'
		    			+'<div class="panel-heading">'
		    				+'<div class="panel-title">'
		    					+'<a data-toggle="collapse" onclick="openClose(\''+departments[j].id+'_'+j+'\'); return false;" data-parent="#accordion" href="#depId_'+departments[j].id+'_'+j+'">'+departments[j].departmentName+'</a>'
		    				+'</div>'
		    			+'</div>'
		    			+'<div id="depId_'+departments[j].id+'_'+j+'" class="panel-collapse collapse">'
		    				+'<div class="panel-body"><div class="panel-heading"><form><table class="table table-bordered dataTable no-footer">'
		    								+'<tbody>'
		    									+'<tr>'
		    										+'<td class="SmallBoldGreyContent" id="language_42">'
		    											+'Department Type'
		    										+'</td>'
		    										+'<td align="center">'
		    											+departments[j].departmentType
		    										+'</td>'
		    									+'</tr>'
		    									+'<tr>'
		    										+'<td class="SmallBoldGreyContent" id="language_42">'
	    												+'Department Name'
	    											+'</td>'
		    										+'<td align="center">'
		    											+departments[j].departmentName
		    										+'</td>'
		    										
		    									+'</tr>';
		    								var	departmentAttributeMappingList=departments[j].departmentAttributeMappingList;
		    								for(var k=0;k<departmentAttributeMappingList.length;k++){	
		    							htmlCode+='<tr>'
		    										+'<td class="SmallBoldGreyContent" id="language_42">'
		    											+departmentAttributeMappingList[k].attributeKey
		    										+'</td>'
		    										+'<td align="center">'
		    											+departmentAttributeMappingList[k].attributeValue
		    										+'</td>'
	    										+'</tr>';
		    								}	
		    					htmlCode+='</tbody>'
		    							+'</table>'
		    						+'</form>'
		    					+'</div>'
		    				+'</div>'
		    			+'</div>'
		    		+'</div>'
		    	+'</div>';
			}
			
		$('#viewDetailDiv').append(htmlCode);
		
		},
		error : function(response) {
			return false;
		}
	});
	
	var htmlCode='<div class="col-sm-6"><h4>Organization Basic Details</h4>'
					+'<div id="table1">'
					  +'<div class="row1">'
					  	+'<span class="cell1">Organization Group : </span>'
					  	+'<span class="cell1">'+organizationGroup+'</span>'
					  +'</div>'
					  +'<div class="row1">'
					  	+'<span class="cell1">Organization Brand : </span>'
					  	+'<span class="cell1">'+organizationBrandName+'<span style="display:none"><button type="button" class="btn btn-xs AdminInList" title="Edit" onclick="editBrand(\''+organizationBrandName+'\')"><span aria-hidden="true" class="glyphicon glyphicon-pencil"></span></button></span></span>'
					  +'</div>'
					  +'<div class="row1">'
					  	+'<span class="cell1">Organization Name : </span>'
					  	+'<span class="cell1">'+organizationName+'</span>'
					  +'</div>'
					  +'<div class="row1">'
					  	+'<span class="cell1">Occupancy Volume(annually in %) : </span>'
					  	+'<span class="cell1">'+occupancyVolume+'</span>'
					  +'</div>' 
				  +'</div>' 
				+'</div>';
	
	 $('#viewDetailDiv').append(htmlCode);
	 
	 $('#container').show();
	 
}
function openClose(divId){
	var divId2="depId_"+divId;
	 $('#'+divId2).toggle('show');
}
function updateBrand(){
	$('#brandUpdateErrorDiv').hide();
	
	var organizationBrandName=$('#brandNameInput').val();
	var organizationBrandId=$('#brandIdInput').val();
	
	var organizationBrand={'organizationBrandName':organizationBrandName,'id':organizationBrandId};
	$.ajax({
		type : "POST",
		url : "../user/updateOrganizationBrand.htm",
		contentType : "application/json",
		data : JSON.stringify(organizationBrand),
		success : function(response) {
   			if(response.status=="UPDATE_ERROR"){
   				var htmlCode='<font style="color: red">'+response.errorMessage+'</font>';
   				$("#brandUpdateErrorSpan").html(htmlCode);
   				$('#brandUpdateErrorSpan').show();
   				return;
   			}
			$.ajax({
				   url:populateOrgTable(),
				   success:function(){
					   $.ajax({
							type : "GET",
							url : "../user/getSessionData.htm",
							contentType : "application/json",
							success : function(response) {
									var orgIndex=response.successObject.orgIndex;
									viewDetail(orgIndex);
									$('#editBrandModal').modal('hide');
							}
					   });
				}
			});
		},
		error : function(response) {
		}
	});
}
function editBrand(organizationBrandName){
	$('#brandNameInput').val(organizationBrandName);
	$('#brandUpdateErrorDiv').hide();
	$('#editBrandModal').modal('show');
}

$( document ).ready(function() {
	$('#orgAndDate').hide();
	 $('#container').hide();
});
</script>		
</body>
</html>