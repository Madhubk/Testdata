(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardLineController", InwardLineController);

    InwardLineController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "inwardLineConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function InwardLineController($location, APP_CONSTANT, authService, apiService, helperService, inwardLineConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {
        
        var InwardLineCtrl = this;

        function Init() {
            InwardLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": inwardLineConfig.Entities
            };
            
            InwardLineCtrl.ePage.Masters.dataentryName = "InwardLine";
            InwardLineCtrl.ePage.Masters.taskName = "InwardLine";
            InwardLineCtrl.ePage.Masters.DefaultFilter = {
                "WorkOrderType":"INW"
            }

        }
         
        Init();

    }

})();
