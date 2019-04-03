(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolidatedDocumentController", ConsolidatedDocumentController);

    ConsolidatedDocumentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService","$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function ConsolidatedDocumentController($location, APP_CONSTANT, authService, apiService, helperService,$timeout, toastr, appConfig, $rootScope, $scope, $window) {
        
        var ConsolidatedDocumentCtrl = this,
            location = $location;

        function Init() {
            ConsolidatedDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            
            ConsolidatedDocumentCtrl.ePage.Masters.dataentryName = "ConsolidatedDocument";
            ConsolidatedDocumentCtrl.ePage.Masters.taskName = "ConsolidatedDocument";
            ConsolidatedDocumentCtrl.ePage.Masters.activeTabIndex = 0;
            ConsolidatedDocumentCtrl.ePage.Masters.IsTabClick = false;
        }
        
        Init();

    }

})();
