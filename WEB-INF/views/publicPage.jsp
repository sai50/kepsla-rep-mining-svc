<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="shortcut icon" href="../resources/images/greensmiley.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Repufact Cuatomer Dashboard">
    <meta name="author" content="Bishav.n.r">

    <title>Hotel Reviews</title>

   <!-- Bootstrap Core CSS -->
	<link href="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.css" rel="stylesheet">

	<!-- MetisMenu CSS -->
	<link href="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.css" rel="stylesheet">

	<!-- Main CSS -->
	<link href="<%=request.getContextPath()%>/resources/css/main.css" rel="stylesheet">

	<!-- Morris Charts CSS -->
	<link href="<%=request.getContextPath()%>/resources/bootstrap/plugins/morris/morris.css" rel="stylesheet">

	<!-- Custom Fonts -->
	<link href="<%=request.getContextPath()%>/resources/fonts/font-awesome-4.1.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">

	<!-- UI CSS -->
	<link href="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.css" rel="stylesheet">
	
	<link href="<%= request.getContextPath() %>/resources/jquery/jquery.loadmask.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
        <div class="public-page-wrapper">
			<div class="row">
				<div class="company-banner-header">
						<img src="<%=request.getContextPath()%>/resources/images/${organizationHeader}"/>
				</div>
			</div>
		
		
			<div class="row">
				<div class="public-page-sub-header">
					<div class="public-repufact-logo">
						<c:choose>
						  <c:when test="${logoImageUrl == ''}">
						  </c:when>
						  <c:otherwise>
						   <img src="${logoImageUrl}"/>
						  </c:otherwise>
						</c:choose>
					</div>
				</div>
			</div>
			
			<!-------------------------- Reviews ----------------------------------->
            <div class="row">
            	<div id="hotelReviewsDivId">
				</div>
				<div id="page-selection"></div>
			</div>					
		</div>	
		<div class="public-page-footer">
			<div class="row">
				<img src="<%=request.getContextPath()%>/resources/images/Powered-by.png"/>
				<span class="public-page-company-footer">
				<img src="<%=request.getContextPath()%>/resources/images/${organizationFooter}"/>
				</span>
			</div>
		</div>
            <!-------------------------- END Reviews ----------------------------------->
	
	<!-- jQuery Version 1.11.0 -->
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
	<script		src="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.js"></script>
	<script src="<%=request.getContextPath()%>/resources/jquery-ui/jquery.bootpag.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/jquery.loadmask.js"></script>
	<script	src="${pageContext.request.contextPath}/resources/jquery/moment.js"></script>
	<script src="<%=request.getContextPath()%>/resources/js/publicPage.js"></script>

<script>

/* To display TradeReviewKpiDepartmentFactor item */
$('.ShowSemanticPolarity').click(function(){
	$('.active').removeClass('active');
	$('.OnSeleceActive').removeClass('OnSeleceActive');
	$(this).next(".col-xs-12").children('.TradeReviewKpiDepartmentFactor').addClass('OnSeleceActive');
});
/* END FLAG To display TradeReviewKpiDepartmentFactor item */

/* Hide items for all actions */
$('.userPrimeAction').click(function(){
	$('.active').removeClass('active');
	$('.OnSeleceActive').removeClass('OnSeleceActive');
});

/* Script Star rting	 */
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
/*  END Script Star rting */ 
</script>
</body>
</html>
