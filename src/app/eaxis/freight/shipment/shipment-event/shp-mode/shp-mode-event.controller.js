(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShpTransModeDirController", ShpTransModeDirController);

    ShpTransModeDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ShpTransModeDirController($scope, authService, apiService, helperService, appConfig) {
        var ShpTransModeDirCtrl = this;

        function Init() {
            ShpTransModeDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_TransportMode",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ShpTransModeDirCtrl.ePage.Masters.Eventobj = ShpTransModeDirCtrl.eventObj;
        }
        Init();
    }
})();