/**
* Navbar Controller
*/
(function(angular){
var app=angular.module('clientDashBoard.controllers',[]);
app.controller('dashboardController', function($scope,$http,$rootScope) {
       
       $scope.apiKeyHeaders  = ["Source","Review Id","Review Subject","Review Text","Review Reply Text","Failed Reason","Error Stack"];
       $scope.showmodal = false;
       $scope.showpopup= function() {
              $scope.showmodal = true;
              if(undefined !== failedRepliesResponse.successObject && failedRepliesResponse.status=="SAVE_SUCCESS"){
                     $rootScope.failedItems = failedRepliesResponse.successObject.failedItems;
              }else{
                     
              }
              $('#alertdashmodal').modal('show');
       };
     
});
    

})(angular);

