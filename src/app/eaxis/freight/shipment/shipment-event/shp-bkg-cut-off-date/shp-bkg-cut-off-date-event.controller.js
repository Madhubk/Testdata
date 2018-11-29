(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShpBkgCutOffDateDirController", ShpBkgCutOffDateDirController);

    ShpBkgCutOffDateDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ShpBkgCutOffDateDirController($scope, authService, apiService, helperService, appConfig) {
        var ShpBkgCutOffDateDirCtrl = this;

        function Init() {
            ShpBkgCutOffDateDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_Incoterm",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ShpBkgCutOffDateDirCtrl.ePage.Masters.Eventobj = ShpBkgCutOffDateDirCtrl.eventObj;
        }
        Init();
    }
})();