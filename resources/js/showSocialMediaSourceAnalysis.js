var searchText = "";
var innerPageSocialSourcesStart = 0;
var innerPageSocialSourcesEnd =10;
var innerPageSocialSourcesColumnChartResponse;
var mentionsList;
var sessionSelectedOrganizationId=0;
var socialMediaSourceName = '';
var filterResponse;
$(document).ready(function() {
	// $.ajaxSetup({ cache: false }); 
	$("#from").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altFromDate",
		altFormat: "mm/dd/yy",
		
		onClose : function(selectedDate) {
			$("#to").datepicker("option", "minDate", selectedDate);
		}
	});
	$("#to").datepicker({
		defaultDate : "+1w",
		changeMonth : true,
		numberOfMonths : 1,
		dateFormat:'d M yy',
		altField: "#altToDate",
		altFormat: "mm/dd/yy",
		onClose : function(selectedDate) {
			$("#from").datepicker("option", "maxDate", selectedDate);
		}
	});
	socialMediaSourceName = soureName;
	getSessionData().then(function(){
	poplateOrganizations(function(selectedOrgId) {
		showTotalMentionsAndTrendChange(selectedOrgId,sourceId);
		$('#innerPageSocialMentionsColumnChartPrevious').prop('disabled',true);
		showSocialMentionsInnerPageColumnChart(selectedOrgId,sourceId);
		showReviewDetailsForSocialMediaSource(selectedOrgId,sourceId,soureName);
	});
	})
});
$("#applyFilterBtn").click(function(e){
	var organizationId = $('#organizationName option:selected').val();
	showTotalMentionsAndTrendChange(organizationId,sourceId);
	showSocialMentionsInnerPageColumnChart(organizationId,sourceId);
	showReviewDetailsForSocialMediaSource(organizationId,sourceId,socialMediaSourceName);
});
function setDefaults(){
	$("#from").datepicker("setDate","-1y");
	$("#to").datepicker("setDate",new Date());
}

/************************************************************************************
 *				Populate Organizations												* 
 ************************************************************************************/
function poplateOrganizations(callback){
	commonOrgPopulation(callback,'organizationName');
}

function showSocialMentionsInnerPageColumnChart(selectedOrgId,sourceId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/showSocialMentionsInnerPageColumnChart.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:selectedOrgId, sourceId:sourceId}),
		success:function(response){
			var dateList = new Array();
			var mentionCountList = new Array();
			innerPageSocialSourcesColumnChartResponse = response;
			if(response.length<=10){
				$('#innerPageSocialMentionsColumnChartNext').prop('disabled',true);
			}
			if(response.length>0){
				for(var i=0;i<response.length;i++){
					dateList.push(moment(response[i].date).format("DD-MMM-YYYY"));
					mentionCountList.push(response[i].mentionsCount);
				}
				populateSocialMentionsInnerPageColumnChart(socialMediaSourceName,dateList.slice(innerPageSocialSourcesStart,innerPageSocialSourcesEnd),mentionCountList.slice(innerPageSocialSourcesStart,innerPageSocialSourcesEnd));
			}
		},
		error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
               // alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
               // alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               // alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                //alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
               // alert('Time out error.');
            } else if (exception === 'abort') {
                //alert('Ajax request aborted.');
            } else {
                //alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
	});
}
function populateSocialMentionsInnerPageColumnChart(socialMediaSourceName,dateList,mentionCountList){
	(function(H) {
		var each = H.each;
		H.wrap(H.seriesTypes.column.prototype, 'drawPoints', function(proceed) {
		var series = this;
		if(series.data.length > 0 ){
		var width = series.barW > 40 ? 40 : series.barW;
		each(this.data, function(point) {
		point.shapeArgs.x += (point.shapeArgs.width - width) / 2;
		point.shapeArgs.width = width;
		});
		}
		proceed.call(this);
		})
		})(Highcharts) 
	
	$('#SourceVolumeInnerPageCount').highcharts({
		credits: {
			enabled: false
		},
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        xAxis: {
            categories: dateList,
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'No of Mentions for '+socialMediaSourceName
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Total Mentions: <b>{point.y}</b>'
        },
        series: [{
            name: 'References',
            data: mentionCountList,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            },
        }]
    });
}
function showReviewDetailsForSocialMediaSource(selectedOrgId,sourceId,soureName){
	loadingForDashBoard();
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/showReviewDetailsForSocialMediaSource.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:selectedOrgId, sourceId:sourceId}),
		success:function(response){
			unloadingForDashBoard();
			if(response.length>0){
				var mentions = [];
				for(var i=0;i<response.length;i++){
					mentions.push(response[i]);
				}
				if(mentions.length>0){
					mentionsList = mentions;
					var noOfPages = 0;
					if(mentionsList.length%5  == 0 && mentionsList.length >0){
						noOfPages = mentionsList.length/5;
					}else{
						noOfPages = (mentionsList.length/5)+1;
					}
					begin = 0;
					end = 5;
					if(end > mentionsList.legth){
			    		end = mentionsList.length;
			    	}
			    	
				    $('#page-selection').bootpag({
				        total: noOfPages,
				        page: 1,
				        maxVisible: 5
				    }).on("page", function(event, /* page number here */ num){
				    	begin = ((num-1)*5);
				    	end=(num)*5;
				    	if(end > mentionsList.legth){
				    		end = mentionsList.length;
				    	}
				    	getMentionsPerPage(begin, end,soureName);
				    });
				    getMentionsPerPage(begin, end,soureName);
				}
			}},
		error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
               // alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
               // alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               // alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                //alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
               // alert('Time out error.');
            } else if (exception === 'abort') {
                //alert('Ajax request aborted.');
            } else {
                //alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
	});
}
function getMentionsPerPage(begin, end,socialMediaSourceName){
	var sublist = [];
	for(var i=begin;i<end;i++){
		sublist.push(mentionsList[i]);
	}
	$("#reviewDetailsForSocialMediaSource").html('');
	for(var i=0;i<sublist.length;i++){
		if(((sublist[i].title !=null)&&(sublist[i].content !=null))||((sublist[i].title==null)&&(sublist[i].content !=null))||((sublist[i].title !=null)&&(sublist[i].content==null))){
		var html = "";
		html += '<div class="col-xs-12 SingleReviewList">';
		html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
		html += '<div class="BlueSentimentReview row"><div class="arrow-left"></div>'+soureName+'</div>';
		html += '<div class="reviewDetails row">';
		if(sublist[i].username!=null){
			html += '<div class="reviewerName">by <span>'+sublist[i].username+'</span></div>';
		}else{
			html += '<div class="reviewerName">by <span>NA</span></div>';
		}
		if(sublist[i].location!=null){
			html += '<div class="reviewerDetail">from <span>'+sublist[i].location+'</span></div>';
		}else {
			html += '<div class="reviewerDetail"> <span></span></div>';
		}
		html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
		html += '</span> '+moment(sublist[i].postDate).format("DD-MMMM-YYYY")+'</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
		if(sublist[i].title!=null){
			html += '<h3 class="SingleReviewHeader">'+sublist[i].title+'</h3>';
		}else {
			html += '<h3 class="SingleReviewHeader"></h3>';
		}
		html += '<p>'+sublist[i].content+'</p>';
		html += '<div class="sentimentKeywordResult">';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		$("#reviewDetailsForSocialMediaSource").append(html).show();
		}
	}
}

function showInnerPageSocialMentionsColumnChartNextValues(){
	innerPageSocialSourcesStart=innerPageSocialSourcesStart+10;
	innerPageSocialSourcesEnd=innerPageSocialSourcesEnd+10;
	socialMediaSourcesInnerPageChart(innerPageSocialSourcesStart,innerPageSocialSourcesEnd);

}
function showInnerPageSocialMentionsColumnChartPreviousValues(){
	innerPageSocialSourcesStart=innerPageSocialSourcesStart-10;
	innerPageSocialSourcesEnd=innerPageSocialSourcesEnd-10;
	socialMediaSourcesInnerPageChart(innerPageSocialSourcesStart,innerPageSocialSourcesEnd);
}
function socialMediaSourcesInnerPageChart(innerPageSocialSourcesStart,innerPageSocialSourcesEnd){
	if(innerPageSocialSourcesColumnChartResponse.length>0){
		var dateList = new Array();
		var mentionCountList = new Array();
		for(var i=0;i<innerPageSocialSourcesColumnChartResponse.length;i++){
			dateList.push(moment(innerPageSocialSourcesColumnChartResponse[i].date).format("DD-MMMM-YYYY"));
			mentionCountList.push(innerPageSocialSourcesColumnChartResponse[i].mentionsCount);
		} 
		dateList = dateList.slice(innerPageSocialSourcesStart,innerPageSocialSourcesEnd);
		mentionCountList = mentionCountList.slice(innerPageSocialSourcesStart,innerPageSocialSourcesEnd);
		if(innerPageSocialSourcesEnd>=innerPageSocialSourcesColumnChartResponse.length){
			$('#innerPageSocialMentionsColumnChartNext').prop('disabled',true);
		}else{
			$('#innerPageSocialMentionsColumnChartNext').prop('disabled',false);
		}
		
		if(innerPageSocialSourcesStart<=0){
			$('#innerPageSocialMentionsColumnChartPrevious').prop('disabled',true);
		}else{
			$('#innerPageSocialMentionsColumnChartPrevious').prop('disabled',false);

		}
		populateSocialMentionsInnerPageColumnChart(socialMediaSourceName,dateList,mentionCountList);
	}
}

var stoppedTyping;
function searchSocialMediaSourcesInnerPage(){
	if (stoppedTyping) clearTimeout(stoppedTyping);
	stoppedTyping = setTimeout(function(){
		
		/*loadingForDashBoard();*/
		/*$('#wrapper').mask('Loading');*/
		$('#wrapper').mask('Loading...');
		$('#leftNavigation,#header').mask();
		$('#leftNavigation,#wrapper,#header').unmask();	
		
		var searchKey = $("#searchString").val();
		if ($.trim(searchKey) == "" || searchKey == null) {
			searchKey="";
		}
		var response;
		var resultListMentions = [];
		if(filterResponse==null){
			response = JSON.parse(JSON.stringify(mentionsList));
			for (var i = 0;i<response.length; i++) {
				var item = response[i];
				if (item.content == null)
					item.content = "";
				if (item.title == null)
					item.title = "";
				if (searchKey!="" && ( item.content.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.title.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.content = item.content.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.title = item.title.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					resultListMentions.push(item);
				}else{
					if(searchKey==""){
						resultListMentions.push(item);
					}
				}
			}
		}else{
			response = JSON.parse(JSON.stringify(filterResponse));
			for (var i = 0;i<response.length; i++) {
				var item = response[i];
				if (item.content == null)
					item.content = "";
				if (item.title == null)
					item.title = "";
				if (searchKey!="" && ( item.content.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.title.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
					var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

					item.content = item.content.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					item.title = item.title.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
					resultListMentions.push(item);
				}else{
					if(searchKey==""){
						resultListMentions.push(item);
					}
				}
			}
		}
		var successObjectTemp = resultListMentions;
		response = successObjectTemp;
		var totalMentions = response;
		var noOfPages = 0;
		if (totalMentions.length % 5 == 0
				&& totalMentions.length > 0) {
			noOfPages = totalMentions.length / 5;
		} else {
			noOfPages = (totalMentions.length / 5) + 1;
		}
		begin = 0;
		end = 5;
		if (end > totalMentions.legth) {
			end = totalMentions.length;
		}

		$('#page-selection')
				.bootpag({
					total : noOfPages,
					page: 1,
			        maxVisible: 5
				}).on("page",function(event,num) {
							begin = ((num - 1) * 5);
							end = (num) * 5;
							if (end > totalMentions.legth) {
								end = totalMentions.length;
							}
							var successObject = response.slice(begin, end);
							
							var response2 = successObject;

							var tempHtml = listsearchedMentionsResponse(
									response2, searchText);
							$('#reviewDetailsForSocialMediaSource').append(tempHtml);
							
			});
		
		var successObject = response.slice(0,10);
		var response2 = successObject;
		var tempHtml = listsearchedMentionsResponse(response2, searchText);
		$('#reviewDetailsForSocialMediaSource').append(tempHtml);
		
	},300);
}
/*document.getElementById("searchSocialMediaInnerPage").addEventListener("keydown",function(e) {
	var keyCode = e.keyCode || e.which;
	if (keyCode === 13) {
	var searchKey = $("#searchSocialMediaInnerPage").val();
	if ($.trim(searchKey) == "" || searchKey == null) {
		searchKey="";
	}
	var resultListMentions = [];
	var targetList = [];
	targetList = response = JSON.parse(JSON.stringify(mentionsList));
	console.log(targetList);
	for (var i = 0;i<targetList.length; i++) {
		var item = targetList[i];
		if (item.content == null)
			item.content = "";
		if (item.title == null)
			item.title = "";
		if (searchKey!="" && ( item.content.toLowerCase().indexOf(searchKey.toLowerCase())!=-1 || (item.title.toLowerCase().indexOf(searchKey.toLowerCase()))!=-1)) {
			var hightedText = '<span style="background-color: #FFFF00">'+ searchKey + '</span>';

			item.content = item.content.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
			item.title = item.title.toLowerCase().split(searchKey.toLowerCase()).join(hightedText);
			resultListMentions.push(item);
		}else{
			if(searchKey==""){
				resultListMentions.push(item);
			}
		}
	}
	var totalMentions = resultListMentions;
	var noOfPages = 0;
	if (totalMentions.length % 5 == 0
			&& totalMentions.length > 0) {
		noOfPages = totalMentions.length / 5;
	} else {
		noOfPages = (totalMentions.length / 5) + 1;
	}
	begin = 0;
	end = 5;
	if (end > totalMentions.legth) {
		end = totalMentions.length;
	}

	$('#page-selection')
			.bootpag({
				total : noOfPages
			})
			.on(
					"page",
					function(event,  page number here 
							num) {
						begin = ((num - 1) * 5);
						end = (num) * 5;
						if (end > totalMentions.legth) {
							end = totalMentions.length;
						}
						var response2 = totalMentions;

						var tempHtml = listsearchedMentionsResponse(
								response2, searchText);
						$('#reviewDetailsForSocialMediaSource').append(tempHtml);
						
		});
	var tempHtml = listsearchedMentionsResponse(resultListMentions, searchKey);
	$('#reviewDetailsForSocialMediaSource').append(tempHtml);
	}
}, false);*/
function listsearchedMentionsResponse(resultListMentions, searchText) {
	$('#reviewDetailsForSocialMediaSource').html('');
	var html = "";
	if (resultListMentions.length > 0) {
		for (var j = 0; j < resultListMentions.length; j++) {
			var title = "";
			var content = "";
			/*if (searchText != "") {
				title = highlightInnerPageMentionsSearchText(searchText,resultListMentions[j].title);
				content = highlightInnerPageMentionsSearchText(searchText,resultListMentions[j].content);
			} else {
				title = resultListMentions[j].title;
				content = resultListMentions[j].content;
			}*/
			title = resultListMentions[j].title;
			content = resultListMentions[j].content;
			html += '<div class="row col-xs-12 SingleReviewList">';
			html += '<div class="col-xs-12 col-sm-3 col-lg-2 LightBlue ShowSemanticPolarity">';
			html += '<div class="reviewDetails row">';
			html += '<div class="reviewSource"></div>';
			html += '<div class="reviewerName">by <span>'+resultListMentions[j].username+'</span></div>';
			if(resultListMentions[j].location!=null){
				html += '<div class="reviewerDetail">from <span>'+resultListMentions[j].location+'</span></div>';
			}else{
				html += '<div class="reviewerDetail">from <span></span></div>';
			}
			html += '<div class="revieweTime"><span class="glyphicon glyphicon-time">';
			html += '</span> '+$.datepicker.formatDate('d M yy',new Date(resultListMentions[j].postDate))+'</span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="col-xs-12 col-sm-9 col-lg-10">';
			if(title!=null){
				html += '<h3 class="SingleReviewHeader">'+title+'</h3>';
			}else{
				html += '<h3 class="SingleReviewHeader"></h3>';
			}
			html += '<p>'+content+'</p>';
			html += '</div>';
			html += '</div>';
		} 
		$('#reviewDetailsForSocialMediaSource').empty();
	}else {
		html += '<font style="color:red">No Mentions Found </font>';
		$('#page-selection').html(" ");
	}
	return html;
}
function highlightInnerPageMentionsSearchText(searchText,highlightedSearchText){
	var term = searchText;
	term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
	var pattern = new RegExp("("+term+")", "gi");
	highlightedSearchText = highlightedSearchText.replace(pattern, "<mark>$1</mark>");
	highlightedSearchText = highlightedSearchText.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
	return highlightedSearchText;
}
function showTotalMentionsAndTrendChange(selectedOrgId,sourceId){
	var fromDate = $("#altFromDate").datepicker().val();
	var toDate = $("#altToDate").datepicker().val();
	$.ajax({
		type:"POST",
		url:"../reviewSourceAnalysis/showTotalMentionsAndTrendChange.htm",
		contentType:"application/json",
		data:JSON.stringify({fromDate:fromDate, toDate:toDate, organizationId:selectedOrgId, sourceId:sourceId}),
		success:function(response){
			//$("#trendChangeInnerPage").text(response.trendChange);
			$("#totalMentionsInnerPage").text(response.totalMentions);
		},
		error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
               // alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
               // alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
               // alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                //alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
               // alert('Time out error.');
            } else if (exception === 'abort') {
                //alert('Ajax request aborted.');
            } else {
                //alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
	});
}