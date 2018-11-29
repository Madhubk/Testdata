(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShpCreationDirController", ShpCreationDirController);

    ShpCreationDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ShpCreationDirController($scope, authService, apiService, helperService, appConfig) {
        var ShpCreationDirCtrl = this;

        function Init() {
            ShpCreationDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_Incoterm",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ShpCreationDirCtrl.ePage.Masters.Eventobj = ShpCreationDirCtrl.eventObj;
        }
        Init();
    }
})();