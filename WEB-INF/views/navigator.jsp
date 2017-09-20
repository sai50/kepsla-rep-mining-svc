<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	
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
				  <a style="padding:5px;" href="index.html"><img src="${logoImageUrl}"></a>
				  </c:otherwise>
				</c:choose>
            </div>
            <!-- /.navbar-header -->

			<!-------------ORGANIZATION SELECTION & DATE PICKET----------------------------->
            <ul class="nav navbar-top-links navbar-right">
                <li>
                	<select id="mySelect" name="mySelect" class="dropdown">
                	<option value="13">Fortune Park JP Celestial</option></select>
                </li>
                <!-- /.dropdown -->
				<li class="dropdown ">
					<div class="dropdown-toggle SelectDate">
						<div class="DateIcon"></div>
						<div class="FromDate">From</div>
						<span class="DatePickerInputs">
							<input class="hasDatepicker" id="from" name="from" type="text">
							<span class="ToDate">To</span>
							<input class="hasDatepicker" id="to" name="to" type="text">
						</span>
					</div>
				</li>
                <!-- /.dropdown -->
                <li>
                	<button type="submit" class="btn btn-primary" id="applyFilterBtn">Apply</button>
	   				<button type="submit" class="btn btn-default" id="clearBtn">Cancel</button>
                </li>
            </ul>
            <!-- /.navbar-top-links -->
			<!-------------END of ORGANIZATION SELECTION & DATE PICKET----------------------------->


            <div class="navbar-default sidebar" role="navigation">
                <div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <li>
                            <a class="active" href="../main/dashboard.htm"><i class="glyphicon glyphicon-dashboard"></i> Dashboard</a>
                        </li>
                        <li>
                            <a href="#"><i class="glyphicon glyphicon-list-alt"></i> Reviews<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level collapse">
                                <li>
                                    <a href="flot.html">Trade Reviews</a>
                                </li>
                                <li>
                                    <a href="morris.html">Social Mentions</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
						<li>
                            <a href="#"><i class="glyphicon glyphicon-tasks"></i> Review Analysis<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level collapse">
                                <li>
                                    <a href="../reviewSummary/showReviewSummary.htm">Summary</a>
                                </li>
                                <li>
                                    <a href="morris.html">KPI &amp; Department</a>
                                </li>
								<li>
                                    <a href="morris.html">Source</a>
                                </li>
								 <li>
                                    <a href="morris.html">Geography &amp; Language</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
						<li>
                            <a href="#"><i class="glyphicon glyphicon-stats"></i> Comparative Analysis<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level collapse">
                                <li>
                                    <a href="flot.html">Competitive analysis</a>
                                </li>
                                <li>
                                    <a href="morris.html">Introspective analysis</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
                        <li>
                            <a href="tables.html"><i class="glyphicon glyphicon-flag"></i> Milestones</a>
                        </li>
                        <li>
                            <a href="forms.html"><i class="glyphicon glyphicon-bell"></i> Notification</a>
                        </li>
						<li>
                            <a href="#"><i class="glyphicon glyphicon-wrench"></i> Manage<span class="fa arrow"></span></a>
                            <ul class="nav nav-second-level collapse">
                                <li>
                                    <a href="flot.html">Feedback</a>
                                </li>
                                <li>
                                    <a href="morris.html">Marketing</a>
                                </li>
								<li>
                                    <a href="morris.html">Users</a>
                                </li>
								<li>
                                    <a href="morris.html">My Account</a>
                                </li>
								<li>
                                    <a href="morris.html">Reports &amp; BI Data</a>
                                </li>
                            </ul>
                            <!-- /.nav-second-level -->
                        </li>
						<li>
                            <a href="../main/sessionExpired.htm"><i class="glyphicon glyphicon-log-out"></i> Logout</a>
                        </li>
                    </ul>
                </div>
                <!-- /.sidebar-collapse -->
            </div>
            <!-- /.navbar-static-side -->
        
</body>
</html>