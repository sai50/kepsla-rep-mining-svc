<!DOCTYPE html>
<%@include file="includeTagLibs.jsp"%>
<html lang="en">
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
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Repufact Cuatomer Dashboard">
<meta name="author" content="Bishav.n.r">
 <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
 <title><spring:message code="label.unconventionalReview.mentions" /></title>

<!-- Bootstrap Core CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.css"
	rel="stylesheet">

<!-- MetisMenu CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.css"
	rel="stylesheet">


<!-- Main CSS -->
<link href="<%=request.getContextPath()%>/resources/css/main.css"
	rel="stylesheet">

<!-- Morris Charts CSS -->
<link
	href="<%=request.getContextPath()%>/resources/bootstrap/plugins/morris/morris.css"
	rel="stylesheet">

<!-- Custom Fonts -->
<link
	href="<%=request.getContextPath()%>/resources/fonts/font-awesome-4.1.0/css/font-awesome.min.css"
	rel="stylesheet" type="text/css">

<!-- Date Picker CSS -->
<link
	href="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.css"
	rel="stylesheet">
	
	<link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">
	
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

<!-------------ORGANIZATION SELECTION & DATE PICKET----------------------------->
            <ul class="nav navbar-top-links navbar-right">
				<li><div class="OrganizationIcon"></div>
					<div class="SelectOrganizationTitle">Organization</div> 
					<select class="dropdown SelectOrganization" name="organizationName" id="organizationName">
					</select>
				</li>
				<!-- /.dropdown -->
				<li class="dropdown ">
					<div class="dropdown-toggle SelectDate">
						<div class="DateIcon"></div>
						<div class="FromDate">From</div>
						<span class="DatePickerInputs">
							<input type="text" id="from" name="from">
							<input type="hidden" id="altFromDate">
					    <span class="ToDate">To</span>
					     	<input type="text" id="to" name="to">
					     	<input type="hidden" id="altToDate">
						</span>
					</div>
				</li>
				<!-- /.dropdown -->
				<li>
					<button type="submit" class="btn btn-primary TopSetButton" id="applyFilterBtn">Apply</button>
					<!-- <button type="submit" class="btn btn-default TopSetButton" id="clearBtn">Cancel</button> -->
				</li>
			</ul>
            <!-- /.navbar-top-links -->
<!-------------END of ORGANIZATION SELECTION & DATE PICKET----------------------------->
		<%@include file="leftNavigation.jsp"%>
        </nav>
 <!-------------------------------------- END of MAIN NAVIGATION  ------------------------------------>
        <div id="page-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Unconventional Review</h1>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col-lg-12 SubHeading">
					<span class="ReviewFilterOutput">Facebook<button class="btn">×</button></span>
					<span class="ReviewFilterOutput">Twitter<button class="btn">×</button></span>
					<a type="button" onclick="loadSocilaMentionsFilterData()" class="filterButton" data-toggle="modal" data-target=".FilterLightBox"><span class="glyphicon glyphicon-filter"></span>Filter</a>
                </div>
                <select id="example-getting-started" multiple="multiple">
			    <option value="cheese">Cheese</option>
			    <option value="tomatoes">Tomatoes</option>
			    <option value="mozarella">Mozzarella</option>
			    <option value="mushrooms">Mushrooms</option>
			    <option value="pepperoni">Pepperoni</option>
			    <option value="onions">Onions</option>
			</select>
			
            </div> -->
             <div id="filterBar">
	            <div class="row">
	            
	                <div id="selectedSocilaMentionsFiltersDiv" class="col-lg-12 SubHeading">
							 <!--  <span class="ReviewFilterOutput"><button class="btn"></button></span> -->
						<a type="button" onclick="loadUnconventionalReviewFilterData()" class="filterButton" data-toggle="modal" data-target=".FilterLightBox"><span class="glyphicon glyphicon-filter"></span>Filter</a>
	                </div>
	                
	            </div>
            </div> 
            <div class="row" id="unconventionalReviewSearchId">
				<div class="form-group">
					<div class="input-group SearchIcon">
					  <label class="sr-only" for="SearchItem">Search Unconventional Review</label>
					  <div class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></div>
					  <input type="search" class="form-control" id="searchInputValue" onkeyup="SearchUnconventionalReview()" placeholder="Search Unconventional Review">
					</div>
			  </div>
			</div>
			<!-- <select id="selectedSources" multiple size="5" class="col-xs-12"></select> -->
			<!-------------------------- Mentions ----------------------------------->
			<div class="row" id="dashboardUnconventionalReview">
				<div class="row col-xs-12 SingleReviewList">
				</div>
			</div>
			 <div id="content"></div>
			<div id="page-selection"></div>
		</div>
 </div>
 <!------------------------------------------------------------------------------>	
<!-------------------------- Filter LightBox ----------------------------------->
<!------------------------------------------------------------------------------>	
 <div class="modal fade FilterLightBox" id="unconventionalfilterModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="light">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
         <button aria-label="Close" data-dismiss="modal" class="close" type="button"><span aria-hidden="true">×</span></button>
         <h4 id="myLargeModalLabel" class="modal-title">Filter Social Mentions</h4>
      </div>
		<div class="modal-body row">
			<div class="FirstRowFilterOptions">
				<div id="unconventionalReviewsSourcesDiv" class="col-xs-12"><!--Review Source--> 
					<h4 class="col-xs-12">Social Media Source</h4>
					<!-- <div class="row">
						<label class="col-sm-4">
							<input type="checkbox" class="unconventionalReviewMentions">
						</label>
						<label class="col-sm-4">
							<input type="checkbox" class="unconventionalReviewMentions">
						</label>
						<label class="col-sm-4">
							<input type="checkbox" class="unconventionalReviewMentions">
						</label>
						<label class="col-sm-4">
							<input type="checkbox" class="unconventionalReviewMentions">
						</label>
					</div> -->
				</div><!--END Review Source-->
				<div class="col-xs-4 col-xs-offset-4" style="padding:15px 10px;">
					<button id="" data-dismiss="modal"  onclick="filterUnconventionalReview(pageNo)" class="btn btn-primary col-xs-12 BtnDone" type="submit" style="width: 200px;">Done</button>
				</div>
			</div>
		<!-- 	<div class="col-sm-4 SaveFilterOptions">
				<div>
					<button id="" data-dismiss="modal"  onclick="filterSocialMentions()" class="btn btn-primary col-xs-12 BtnDone" type="submit">Done</button>
				</div>
				<div class="row">Save Filter
					<h4 class="col-xs-12">Filter Setting</h4>
					 <div class="col-xs-12">
						<div class="input-group">
						  <input type="text" class="form-control input-sm" placeholder="Save filter as">
						  <span class="input-group-btn">
							<button class="btn btn-default btn-sm btn-green" type="button">Save</button>
						  </span>
						</div>/input-group
					 </div>
					 <div class="col-xs-12 SavedFilter">
						<button class="btn btn-default btn-xs btn-green">×</button>
							<a>Saved filter name</a>
					 </div>
					 <div class="col-xs-12 SavedFilter">
						<button class="btn btn-default btn-xs btn-green">×</button>
							<a>Saved filter name2</a>
					 </div>
				</div>END Save Filter
				<div class="row">Save Search
					<h4 class="col-xs-12">Search Setting</h4>
					 <div class="col-xs-12">
						<button id="" class="btn col-xs-12 btn-sm btn-green" type="submit">Save Search Result</button>
					 </div>
					 <div class="col-xs-12 SavedFilter">
						<button class="btn btn-default btn-xs btn-green">×</button>
							<a>Saved Search name 1</a>
					 </div>
					 <div class="col-xs-12 SavedFilter">
						<button class="btn btn-default btn-xs btn-green">×</button>
							<a>Saved Search name 2</a>
					 </div>
				</div>END Save Search
			</div> -->
        </div>
    </div>
  </div>
</div>



<!------------------------------------------------------------------------------>	
<!-----------------------END Of Filter LightBox -------------------------------->
<!------------------------------------------------------------------------------>	
	<!-- jQuery Version 1.11.0 -->
	<%@include file="includeJsFiles.jsp"%>
	<script
		src="<%=request.getContextPath()%>/resources/jquery/jquery-1.11.0.js"></script>

	<!-- Bootstrap Core JavaScript -->
	<script
		src="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.min.js"></script>

	<!-- Metis Menu Plugin JavaScript -->
	<script
		src="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.js"></script>

	<!-- Custom Theme JavaScript -->
	<script src="<%=request.getContextPath()%>/resources/bootstrap/main.js"></script>

	<!-- Bootstrap jqueryUI JavaScript For Date Picker-->
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>

	<!-- Charts-->
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/highcharts.js"></script>
	<script
		src="<%=request.getContextPath()%>/resources/highcharts/exporting.js"></script>

	<!-- Script For Moment -->
	<script src="<%=request.getContextPath()%>/resources/js/moment.min.js"></script>
	
	<!-- Script For Social Mentions -->
	<script src="<%=request.getContextPath()%>/resources/js/unconventionalReview.js"></script>
	
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	
	<script src="<%=request.getContextPath()%>/resources/js/datePickerCommon.js"></script>
		
	<script src="<%=request.getContextPath()%>/resources/js/util.js"></script>
	
	<script>
	
		$.fn.stars = function() {
		return $(this).each(function() {
			// Get the value
			var maximumRating = $(this).data("maximumRating");
			var reviewRating = $(this).data("reviewRating");
			//var val = parseFloat($(this).html());
			var val=reviewRating*(5/maximumRating);
			// Make sure that the value is in 0 - 5 range, multiply to get width
			var size = Math.max(0, (Math.min(5, val))) * 16;
			// Create stars holder
			var $span = $('<span />').width(size);
			// Replace the numerical value with stars
			$(this).html($span);
		});
	}
		
</script>
	
	<!-- <script type="text/javascript">
	    $(document).ready(function() {
	        $('#example-getting-started').multiselect();
	    });
	</script> -->
</body>

</html>
