<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Repufact Cuatomer Dashboard">
    <meta name="author" content="Bishav.n.r">
		<!-- Favicon -->
	<link rel="shortcut icon" href="images/greensmiley.ico" type="image/x-icon">
    <title>403 - Access Denied</title>

   <!-- Bootstrap Core CSS -->
    <link href="<%=request.getContextPath()%>/resources/bootstrap/bootstrap.css" rel="stylesheet">

    <link href="<%=request.getContextPath()%>/resources/bootstrap/plugins/metisMenu/metisMenu.min.css" rel="stylesheet">


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
	
	<!-- Date Time Picker CSS -->
	<link	href="<%=request.getContextPath()%>/resources/jquery/jquery.datetimepicker.css"	rel="stylesheet">

	<!-- Date Picker CSS -->
	<link
	href="<%=request.getContextPath()%>/resources/jquery-ui/jquery-ui.css"
	rel="stylesheet">
	

	
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body>
<div id="error-page-wrapper">

	<div class="row imageErrordiv">
		<img src="${pageContext.request.contextPath}/resources/images/403image.png"/>
	</div>

	<div class="row RedStrip403">
		<div>	
			Stop! You are no authorized to view this page.
		</div>
	</div>
	
	<div class="row RedText404">	
			<div>You may contact your accout manager to know more about it.</div>
	</div>	
	<div class="row">	
		<a class="SmallLightDarkBlueContentLink" href="/ghn-web/">Please login again</a>
	</div>	
</div>	
</body>

</html>
