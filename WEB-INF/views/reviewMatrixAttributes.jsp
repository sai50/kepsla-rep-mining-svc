<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html>
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWQVXW');</script>
<!-- End Google Tag Manager -->
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<!-- Note there is no responsive meta tag here -->
<!-- <link rel="shortcut icon" href="../resources/images/ipl-icon.jpg"> -->
<link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
<title>Admin Reference Matrix</title>
 <%@include file="includeCssFiles.jsp"%>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWQVXW"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<div id="wrapper">
<!------------------MAIN NAVIGATION ------------------------------------------------------------------------------->
		        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
		            <div class="navbar-header">
		                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		                    <span class="sr-only">Toggle navigation</span>
		                    <span class="icon-bar"></span>
		                    <span class="icon-bar"></span>
		                    <span class="icon-bar"></span>
		                </button>
		                <c:choose>
				  <c:when test="${logoImageUrl == ''}">
				  </c:when>
				  <c:otherwise>
				   <a style="padding:5px;" href="../main/dashboard.htm"><img src="${logoImageUrl}"/></a>
				  </c:otherwise>
				</c:choose>
		            </div>
		            <!-- /.navbar-header -->
				<%@include file="leftNavigation.jsp"%>
		        </nav>
		 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
	<div id="page-wrapper">
 <div class="row">
		<div class="col-lg-12">
            <h1 class="page-header">Admin Reference Matrix</h1>
        </div>
        <div class="panel panel-admin">
        	<div class="panel-body">
			<!-- <ul id="tabs" class="nav nav-tabs" data-tabs="tabs">
				<li class="active"><a href="" data-toggle="tab" onclick="organizationType()">Add</a></li>
				</ul> -->
				</div>
				
				<!-- TEST -->				
				
	<div id="kpiTab" class="tab-content">
		<div class="tab-pane active" id="apiUserTabDiv">
			<form id="apiUserTabButtons" class="form-inline col-xs-12 SubHeading AdminMainActivity">
			 <spring:message code="label.heading.matrix"/> 
			<div class="form-group float-right"><!-- New CHange -->
				<!-- <button class="btn btn-primary AdminDeleteButton float-right" type="button" onclick="deleteApiUser()"><span aria-hidden="true" class="glyphicon glyphicon-trash"></span></button> -->
	 			<a id="addReviewMatrixAttribute" Title="Add" class="btn btn-primary AdminAddButton float-right" type="button">+</a>
				</div>			
			</form>
		</div>
		
			<!-- --------------------Add General KPI Success Div----------------------------------------- -->
			<div class="alert alert-success" id="addApiUserSuccessDiv" style="display: none;">
				<spring:message code="label.add.kpi.success"/>
			</div>
			<!-- --------------------Edit General KPI Success Div----------------------------------------- -->
			<div class="alert alert-success" id="editIndustryKpiSuccessDiv" style="display: none;">
				<spring:message code="label.edit.kpi.success"/>
			</div>
			<!-- --------------------General KPI----------------------------------------- -->
			<div class="tab-pane active" id="listApiUserTabMatrix">
				<form role="form" id="listApiUserFormMatrix">
					<table class='table table-striped dataTable no-footer' id='listApiUserTableMatrix' style="table-layout:auto; display:none" >
					 <thead>
							<tr>
								 <th></th>
								 <th></th>
								<th></th>
								 <th></th>
								 <th></th>
								 <th></th>
								  <th></th>
								  <th></th>
								  <th></th>
							</tr>
						    <tr>
				                 <th>Department</th>
								 <th>KPI</th>
								 <th>Reference Category</th>
								 <th>Reference</th>
								 <th>Keywords</th>
								 <th>Query Names</th>
								 <th>Query Syntax</th>
								 <th>Status</th>
								 <th>Action</th>
				            </tr>
				            </thead>
 
						<tbody>
							<c:forEach items="${keywordListForMatrix}" var="keywordListForMatrix">
								<tr>
									<%-- <td><input type="checkbox" value="${keywordListForMatrix.kpiName}" class="apiUserCheckBox"></td> --%>
									<td>${keywordListForMatrix.departmentType}</td>
                                    <td style="word-break:break-all;">${keywordListForMatrix.kpiName}</td> 
                                    <td style="word-break:break-all;">${keywordListForMatrix.referenceCategory} </td>
									<td style="word-break:break-all;">${keywordListForMatrix.reference} </td>
									<c:choose>
                                    <c:when test="${not empty keywordListForMatrix.nearByKeyword  && not empty keywordListForMatrix.keywords}">
                                    <td style="word-break:break-all;">(${keywordListForMatrix.nearByKeyword})Near/${keywordListForMatrix.nearBy}(${keywordListForMatrix.keywords})</td>
                                    </c:when>
                                    <c:when test="${not empty keywordListForMatrix.nearByKeyword}">
                                    <td style="word-break:break-all;">(${keywordListForMatrix.nearByKeyword})</td>
                                    </c:when>
                                    <c:otherwise>
                                    <td></td>
                                    </c:otherwise>
                                    </c:choose>
									<td style="word-break:break-all;">${keywordListForMatrix.nlpQueryName} </td>
									<td style="word-break:break-all;">${keywordListForMatrix.nlpQuery} </td>
									<td>${keywordListForMatrix.status}</td>
									<td>
									<div style="margin-bottom:10px">
										<button type='button' class='btn btn-xs AdminInList' title='Edit' onclick='editReviewReferenceMatrixData(${keywordListForMatrix.id})'><span class='glyphicon glyphicon-pencil'></span></button></span>
										<span><button type='button' style="right=-1px;" class='btn btn-xs AdminInList' title='Delete' id="deleteReferenceMatrixDataId"  onclick='deleteReviewReferenceMatrixModal(${keywordListForMatrix.id})'><span class='glyphicon glyphicon-trash'></span></button></span>
									</div>
									<div>	
										<c:if test="${keywordListForMatrix.status!='IN USE'}">
										<button type='button' style="right=-1px;" class='btn btn-xs AdminInList' title='Approved'   onclick='approved(${keywordListForMatrix.id})'><span class='glyphicon glyphicon-ok' style='color:green'></span></button>
										<button type='button' style="right=-1px;" class='btn btn-xs AdminInList' title='Rejected'   onclick='rejected(${keywordListForMatrix.id})'><span class='glyphicon glyphicon-remove' style='color:red'></span></button>
										</c:if>
									</div>
									</td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
				</form>
			</div>
			<!-- --------------------Add/Edit KPI Div------------------------------------------ -->
			<div id="addAndEditReviewReferenceMatrixDiv" class="SubHeading addAdminForm col-xs-12" style="display: none;">
			</div>
			
		</div>
		</div><!-- -Tab Pane -->
			<a href="#" onclick="scrollDown($('#wrapper'))" style="float: right;"><img alt="no Image Found" src="../resources/images/scrollTop.png"></a>
	 </div><!-- row -->
 </div><!-- page-wrapper -->
</div><!-- Wrapper -->

<!-- --------------------Add New Phrase Modal--------------------------------------------------------------- -->
		<div id="deleteReferenceModalNew">
		   <!--  <div class="modal-dialog">
		        <div class="modal-content">
		            <div class="modal-header">
		                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                <h4 class="modal-title" id="addNewPhraseHedaer">Delete</h4>
		            </div>
		            <div class="modal-body" id="addNewPhraseModalBody">
		            </div>
		            <div class="modal-footer" id="addNewPhraseModalFooter">
		            <button class="btn btn-default" aria-hidden="true" data-dismiss="modal"  type="button">Approve</button>
		                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		            </div>
		        </div>
		    </div> -->
	  </div>
	  <!-- --------------------Add New polarity Modal--------------------------------------------------------------- -->

</body>

 <script type="text/javascript" src="../resources/js/jquery.autocomplete.js"></script>
<%@include file="includeJsFiles.jsp"%>
<script type="text/javascript" src="../resources/js/customFilter.js"></script>
<script type="text/javascript" src="../resources/js/reviewMatrixAttributes.js"></script>
<script type="text/javascript">
	 $(document).ready(function(){
		 $("#listApiUserTableMatrix").show();
		$('#listApiUserTableMatrix').dataTable({
			"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
			//"bScrollCollapse":true
			//"scrollX": true  //horizontal scroll
		}).columnFilter();
		$("#listApiUserTableMatrix_filter").hide();
		//$("#listApiUserTableMatrix_length").hide();
	});     

</script>
</html>