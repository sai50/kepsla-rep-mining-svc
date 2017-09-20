$(document).ready(function() {
	listAgents();
});

/*******************************************************************************
 * List of records for particular agent *
 ******************************************************************************/
function listAgents() {
	$('#userDataDiv').html('');
	var responseObject = [];
	$.get("../mozenda/listOfAgentJobLog.htm",function(response) {
				console.log(response);
				responseObject = response.agentReportList;
				if (responseObject.length > 0) {
					console.log(responseObject);
					var agentList = responseObject;
					var _mozendaStatus = false;
					for (var i = 0; i < agentList.length; i++) {
						if (agentList[i].mozendaStatus == 1
								|| agentList[i].mozendaStatus == 2
								|| agentList[i].mozendaStatus == 3
								|| agentList[i].mozendaStatus == 4
								|| agentList[i].mozendaStatus == 5
								|| agentList[i].mozendaStatus == 6
								| agentList[i].mozendaStatus == 7) {
							_mozendaStatus = true;
							break;
						}
					}
					var html = listAgentHtml(responseObject);
					$('#userDataDiv').append(html);
					$('#userListTable').dataTable();
					$('#userDataDiv').show();
				} else {
					console.log("elese..part");

				}

			}, 'json').fail(function(response) {
		console.log("fail..part");

	});
	return false;
}

function listAgentHtml(response) {

	var agentList = response;
	var _mozendaStatus = false;
	for (var i = 0; i < agentList.length; i++) {
		if (agentList[i].mozendaStatus == 1) {
			_mozendaStatus = true;
			break;
		}
	}
	var html = "";
	html += '<form id="listAgentForm">';
	html +='<a href="../mozenda/list.htm" data-toggle="tab" onclick=redirectView("../mozenda/list.htm")>Go back to Source Mapping</a>';
	/**
	 * ***********************************Sucess
	 * Div********************************************************
	 */
	html += '<div class="alert alert-success" style="display: none;">';
	html += '</div>';

	html += '<div class="alert alert-success" style="display: none;">';
	html += '</div>';

	html += '<div class="alert alert-danger alert-error" style="display: none;"	id="deleteOrganizationGroupErrorDiv">';
	html += '</div>';
	html += "<table class='table table-striped table-bordered' id='userListTable'>";
	html += "<thead>";
	html += "<h3><center><font face='Trebuchet MS, Verdana, Arial, sans-serif' color='D62F0C' size='5'><b><u>AGENT JOB LOG REPORT</u></b></font></center></h3>";
	html += "<tr>";
	html += '<th>JOB_ID</th>';
	html += '<th>AGENT_ID</th>';
	html += '<th>AGENT_NAME</th>';
	html += '<th>START_TIME</th>';
	html += '<th>END_TIME</th>';
	html += '<th>MOZENDA_STATUS</th>';
	html += '<th></th>';
	html += "</tr>";
	html += "</thead>";
	html += '<tbody>';

	for (var i = 0; i < agentList.length; i++) {

		var jobId = $.trim(agentList[i].jobId);
		var id = agentList[i].id;
		var agentId = agentList[i].agentId;
		var startTime = agentList[i].startTime;
		var endTime = agentList[i].endTime;
		var agentName = agentList[i].agentName;
		var mozendaStatus = agentList[i].mozendaStatus;
		html += '<tr>';
		// html += '<td><input type="checkBox" class="userCheckBox" value=' +
		// id+ '></td>';
		html += '<td><span id=jobId_'+i+'>' + jobId + '</span></td>';
		html += '<td><span id=agentId_'+i+'>' + agentId + '</td>';
		html += '<td><span id=agentName_'+i+'>' + agentName + '</td>';
		html += '<td  class="startTime"><span class="glyphicon glyphicon-time"> '
				+ moment(agentList[i].startTime).format("YYYY MM DD HH:mm:ss")
				+ '</span></td>';
		html += '<td  class="endTime"><span class="glyphicon glyphicon-time"> '
				+ moment(agentList[i].endTime).format("YYYY MM DD HH:mm:ss")
				+ '</span></td>';
	

		if (agentList[i].mozendaStatus == 0) {
			html += '<td>' + mozendaStatus + ' [agent stopd by mozenda] ',
					'</td>'
		} else {
			var status = agentList[i].mozendaStatus;
			var mozendaStatus = '';
			switch (status) {
			case 1:
				if (status = 1)
					mozendaStatus = 'XML file in our server ';
				break;
			case 2:
				if (status = 2)
					mozendaStatus = ' Data Loaded Successfully... ';
				break;
			case 3:
				if (status = 3)
					mozendaStatus = ' Data Loading is failed...';
				break;
			case 4:
				if (status = 4)
					mozendaStatus = ' Semantriya processed successfully...';
				break;
			case 5:
				if (status = 5)
					mozendaStatus = ' Semantriya processesing is failed...';

			case 6:
				if (status = 6)
					mozendaStatus = ' Score Calculation is  Success...';
				break;
			case 7:
				if (status = 7)
					mozendaStatus = ' Score Calculation is  Failed...';

			}
			html += '<td id="status_' + i + '">' + mozendaStatus + '</td>';
		}
		if (agentList[i].mozendaStatus == 0) {
			html += '<td><input id="runTomozendaButton_" class="runmozendaclass" type="button" class="btn btn-primary" value="Resume Mozenda" onclick="resumeJob('
					+ i + ')"  style="float: right;"></td>'
		}

		var statuss = agentList[i].mozendaStatus;
		var mozendaStatuss = '';
		switch (statuss) {

		case 1:
			if (statuss = 1)
				mozendaStatuss = '<input id="loadToDbButton_'
						+ i
						+ '" type="button" class="btn btn-primary" value="Load To DB" onclick="LoadToDB('+ i+ ',' + agentId + ')" style="float: right;" />';

			break;

		case 2:
			if (statuss = 2)

				mozendaStatuss = '<input id="loadToDbButton_'
						+ i
						+ '"  type="button" class="btn btn-primary" value="RunSemantriya" onclick="RunSemantriya('
						+ i + ',' + agentId + ')" style="float: right;" />';
			break;
		case 3:
			if (statuss = 3)
				mozendaStatuss = '<input id="loadToDbButton_'
						+ i
						+ '"   type="button" class="btn btn-primary" value="Reload" onclick="LoadToDB('+i+',' + agentId + ')" style="float: right;" />';
			break;
		case 4:
			if (statuss = 4)

				mozendaStatuss = '<input id="loadToDbButton_'
						+ i
						+ '"   type="button" class="btn btn-primary" value="RunScoreCalculation" onclick="RunScoreCalculation('
						+ i + ',' + agentId + ')"float: right;" />';
			break;
		case 5:
			if (statuss = 5)
				mozendaStatuss = '<input id="loadToDbButton_'
						+ i
						+ '"   type="button" class="btn btn-primary" value="Run Semantriya" onclick="RunSemantriya('
						+ i + ',' + agentId + ')"float: right;" />';
			break;

		case 6:
			if (statuss = 6)
				mozendaStatuss = '<input id="loadToDbButton_'
						+ i
						+ '"   type="button" class="btn btn-primary" value="RunScoreCalculation" onclick="RunScoreCalculation('
						+ i + ',' + agentId + ')"float: right;" />';
			break;

		case 7:
			if (statuss = 7)
				mozendaStatuss = '<input id="loadToDbButton_'
						+ i
						+ '"   type="button" class="btn btn-primary" value="RunScoreCalculation" onclick="RunScoreCalculation('
						+ i + ',' + agentId + ')"float: right;" />';
			break;
		}
		html += '<td>' + mozendaStatuss + '</td>';
		html += '</tr>';
		// alert("_mozendaStatus "+_mozendaStatus);

	}

	html += '</tbody>';
	html += '</table>';
	html += '</form>';
	return html;
}
/*******************************************************************************
 * Resume Mozenda *
 ******************************************************************************/
/*function LoadToDB1(){
	alert("hee");
}*/
function resumeJob(index) {
	loading();
	var agentId = $('#agentId_'+index).html();
	var jobId = $('#jobId_'+index).html();
	var agentName = $('#agentName_'+index).html();
	console.log(agentId);
	console.log(jobId);
	console.log(agentName);
	$.get("..//mozenda/resumeJob.htm?jobId="+jobId+"&agentId="+agentId+"&agentName="+agentName, function(response) {
		unload();
		console.log(response);
		if (response.status == "Success") { 
			console.log("loaded ...successfully");
			alert("success");
			$('#loadToDbButton_' + index).val("ScoreCalculation");
			window.location.reload();
		} else {
			$('#loadToDbButton_' + index).val("Reload");
		}

	}, 'json').fail(function(response) {
		alert("fail");

	});
}

/*******************************************************************************
 * Load agent data *
 ******************************************************************************/

function LoadToDB(i , agentId) {
	//var jobId=$("#jobId_"+i).val();
	//alert("agentID"+agentId);
	console.log("here"+agentId);
	console.log(i);
 var jobId=document.getElementById("jobId_"+i).innerHTML;
    console.log(jobId)
		$.get("..//mozenda/loadData.htm?agentId=" + agentId+" &jobId=" + jobId, function(response) {
		console.log(response);
		if (response.status == "Load_Success") { 
			console.log("loaded ...successfully");
			$('#loadToDbButton_' + i).val("RunSemantriya");
			window.location.reload();
		} else {
			$('#loadToDbButton_' + i).val("Reload");
		}

	}, 'json').fail(function(response) {
		console.log(response.statusText);

	});
	return false;

}

function Reload(rowIndex , agentId) {
	console.log("here"+jobId);
	$.get("../mozenda/loadData.htm?agentId=" + agentId+" &jobId=" + jobId, function(response) {
		console.log(response);
		if (response.status == "Load_Success") {
			console.log("Reloaded ...successfully");

		} else {
			console.log("data loadig is failed ..try again");
		}
	});
}

/*******************************************************************************
 * Run Semnatriya of partiuclar agent *
 ******************************************************************************/
function RunSemantriya(i , agentId) {
	console.log(i);
	console.log("simantriya");
   console.log("agentID..."+agentId);
	
	 var jobId=document.getElementById("jobId_"+i).innerHTML;
	    console.log(jobId)
	$.get("../mozenda/runSemantriya.htm?agentId=" + agentId+" &jobId=" + jobId, function(response) {
		console.log(response);
		if (response.status == "Load_Success") {
			console.log("Simantriya processed ...successfully");
			window.location.reload();
			$('#loadToDbButton_' + i).val("RunScoreCalculation");
		} else {
			console.log("semantriya process is failured");
			window.location.reload();
			$('#loadToDbButton_' + i).val("RunSemantriya");

		}
	});
}

/*******************************************************************************
 * Run Score calculation of partiuclar agent *
 ******************************************************************************/
function RunScoreCalculation(i,agentId) {
	console.log("RunScorecalculation");
	console.log(i);
	console.log(agentId);
	 var jobId=document.getElementById("jobId_"+i).innerHTML;
	    console.log(jobId)
	$.get("../mozenda/runScorecalculation.htm?agentId=" + agentId +" &jobId=" + jobId, function(
			response) {
		console.log(response);
		if (response.status == "Load_Success") {
			console.log("Scorecalculation processed ...successfully");
			window.location.reload();
		} else {
			console.log("score calculation  process is failured");
			window.location.reload();
			$('#loadToDbButton_' + i).val("Reload");

		}

	});

	/*function resumeJob() {
	    document.getElementById("runTomozendaButton_").disabled = true;
	}*/
}