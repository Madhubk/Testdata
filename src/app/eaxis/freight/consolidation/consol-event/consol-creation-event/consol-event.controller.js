(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolCreationDirController", ConsolCreationDirController);

    ConsolCreationDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ConsolCreationDirController($scope, authService, apiService, helperService, appConfig) {
        var ConsolCreationDirCtrl = this;

        function Init() {
            ConsolCreationDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Creation",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ConsolCreationDirCtrl.ePage.Masters.Eventobj = ConsolCreationDirCtrl.eventObj;
        }
        Init();
    }
})();