(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShpIncotermDirController", ShpIncotermDirController);

    ShpIncotermDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ShpIncotermDirController($scope, authService, apiService, helperService, appConfig) {
        var ShpIncotermDirCtrl = this;

        function Init() {
            ShpIncotermDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_Incoterm",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ShpIncotermDirCtrl.ePage.Masters.Eventobj = ShpIncotermDirCtrl.eventObj;
        }
        Init();
    }
})();