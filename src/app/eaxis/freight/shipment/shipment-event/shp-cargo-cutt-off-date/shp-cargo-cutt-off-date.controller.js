(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShpCargoCutOffDateDirController", ShpCargoCutOffDateDirController);

    ShpCargoCutOffDateDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ShpCargoCutOffDateDirController($scope, authService, apiService, helperService, appConfig) {
        var ShpCargoCutOffDateDirCtrl = this;

        function Init() {
            ShpCargoCutOffDateDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_Incoterm",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ShpCargoCutOffDateDirCtrl.ePage.Masters.Eventobj = ShpCargoCutOffDateDirCtrl.eventObj;
        }
        Init();
    }
})();