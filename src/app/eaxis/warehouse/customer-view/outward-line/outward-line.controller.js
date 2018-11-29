(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardLineController", OutwardLineController);

    OutwardLineController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "outwardLineConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function OutwardLineController($location, APP_CONSTANT, authService, apiService, helperService, outwardLineConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {
        
        var OutwardLineCtrl = this;

        function Init() {
            OutwardLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": outwardLineConfig.Entities
            };
            
            OutwardLineCtrl.ePage.Masters.dataentryName = "OutwardLine";
            OutwardLineCtrl.ePage.Masters.taskName = "OutwardLine";
            OutwardLineCtrl.ePage.Masters.DefaultFilter = {
                "WorkOrderType":"ORD"
            }

        }

        Init();

    }

})();
