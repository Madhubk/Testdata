(function(){
    "use strict";

    angular
         .module("Application")
         .controller("OutwardCrossdockController",OutwardCrossdockController);

    OutwardCrossdockController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "outwardConfig", "helperService", "toastr"];

    function OutwardCrossdockController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, outwardConfig, helperService, toastr){

        var OutwardCrossdockCtrl = this;
        
        function Init(){

            var currentOutward = OutwardCrossdockCtrl.currentOutward[OutwardCrossdockCtrl.currentOutward.label].ePage.Entities;

            OutwardCrossdockCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Continer",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward,
            };

            
            OutwardCrossdockCtrl.ePage.Masters.List = ["1"];

            //Function
            OutwardCrossdockCtrl.ePage.Masters.AddRow = AddRow;
            OutwardCrossdockCtrl.ePage.Masters.RemoveRow = RemoveRow;

        }

        function AddRow(){
            OutwardCrossdockCtrl.ePage.Masters.List.push([""]);
        }

        function RemoveRow(item){
            var index = OutwardCrossdockCtrl.ePage.Masters.List.indexOf(item);
            OutwardCrossdockCtrl.ePage.Masters.List.splice(index, 1);
        }

       

        Init();
    }

})();