
<%@include file="includeTagLibs.jsp"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<meta name="_csrf" content="${_csrf.token}"/>
<!-- default header name is X-CSRF-TOKEN -->
<meta name="_csrf_header" content="${_csrf.headerName}"/>
<div class="navbar-default sidebar" role="navigation" id="leftNavigation">
 <sec:authorize access="hasAnyRole('GHN_ADMIN','GHN_BASIC_QC','GHN_Basic_QC')">
<div class="toggleSideBar" style="float: right;">«</div>
</sec:authorize>
 
	<div class="sidebar-nav navbar-collapse">
		<ul class="nav" id="side-menu">
			<c:forEach items="${featureUrls}" var="feature">
				<c:if test="${empty feature.subFeatures}">
					<c:if test="${feature.featureAssociatedUrl ne '#'}">
						<%-- <li>
							<a href="${feature.featureAssociatedUrl}">
							<i class="${feature.image}"></i>&nbsp;${feature.featureDescription}</a>
						</li> --%>
					<c:choose>
						<c:when test="${feature.featureAssociatedUrl eq currentActiveUrl}">
							<li style="background-color: #eeeeee;">
								<a href="${feature.featureAssociatedUrl}" >
								 <i class="${feature.featureIcon}"></i>&nbsp;${feature.featureDescription}</a>
							</li>
						</c:when>
						<c:otherwise>
							<li>
								<a href="${feature.featureAssociatedUrl}">
								 <i class="${feature.featureIcon}"></i>&nbsp;${feature.featureDescription}</a>
							</li>
						</c:otherwise>
					</c:choose>
					</c:if>
				</c:if>
				<c:if test="${not empty feature.subFeatures}">
				<c:if test="${feature.featureAssociatedUrl ne '##'}">
						<c:choose>
							<c:when test="${feature.featureDescription eq currentFeatureDescription}">
								<li class="active">
									<a><i class="${feature.featureIcon}">&nbsp;</i>${feature.featureDescription}<span class="fa arrow"></span></a>
									<ul class="nav nav-second-level collapse in">
										<c:forEach items="${feature.subFeatures}" var="subFeature">
											<c:if test="${subFeature.featureAssociatedUrl ne '#'}">
												<c:choose>
													<c:when test="${subFeature.featureAssociatedUrl eq currentActiveUrl}">
														<li style="background-color: #eeeeee;">
															<a class="" href="${subFeature.featureAssociatedUrl}" ><%-- <img src="${feature.image}"/> --%>${subFeature.featureDescription}</a>
														</li>
													</c:when>
													<c:otherwise>	
														<li>
															<a href="${subFeature.featureAssociatedUrl}" class="" ><%-- <img src="${feature.image}"/> --%>${subFeature.featureDescription}</a>
														</li>
													</c:otherwise>
												</c:choose>
											</c:if>
									</c:forEach>
									</ul>
								</li>
							</c:when>
							<c:otherwise>
								<li>
									<a><i class="${feature.featureIcon}">&nbsp;</i>${feature.featureDescription}<span class="fa arrow"></span></a>
									<ul class="nav nav-second-level collapse">
										<c:forEach items="${feature.subFeatures}" var="subFeature">
											<c:if test="${subFeature.featureAssociatedUrl ne '#'}">
												<li>
													<a href="${subFeature.featureAssociatedUrl}"><%-- <img src="${feature.image}"/> --%>${subFeature.featureDescription}</a>
												</li>
											</c:if>
									</c:forEach>
									</ul>
								</li>
							</c:otherwise>
						</c:choose>
				</c:if>
				</c:if>
			</c:forEach>
			<c:choose>
			  <c:when test="${hideLogout}">
			  	<span><img src="../resources/images/PoweredbyKepsla.png" style="height: 80px;margin-top: 60px;margin-left: 15px;"></span>
			  </c:when>
			  <c:otherwise>
			   <li><a href="<c:url value="../j_spring_security_logout" />"   onclick="clearCacheAndLogout()"><i class="glyphicon glyphicon-log-out">&nbsp;</i> LogOut</a>
			  </c:otherwise>
			</c:choose>
			<!-- <li><a href="#" onclick="document.forms['logoutForm'].submit(); return false;"><i class="glyphicon glyphicon-log-out">&nbsp;</i> LogOut</a> -->

			



		</ul>
	</div>
	<!-- 
	<c:url var="logoutUrl" value="/j_spring_security_logout" />
	<form action="${logoutUrl}" method="post" name="logoutForm">
		<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
	</form>
	 -->
</div>


	<%
	Integer logedId=(Integer) session.getAttribute("loggedUserId");
  	
	%>	

<script>
loggeduserID=<%=logedId %>


function clearCacheAndLogout(){
	sessionStorage.clear();
}
</script>