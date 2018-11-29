(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShpDocCuttOffDateDirController", ShpDocCuttOffDateDirController);

    ShpDocCuttOffDateDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function ShpDocCuttOffDateDirController($scope, authService, apiService, helperService, appConfig) {
        var ShpDocCuttOffDateDirCtrl = this;

        function Init() {
            ShpDocCuttOffDateDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_Doc_Cutt_Off_Date",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            ShpDocCuttOffDateDirCtrl.ePage.Masters.Eventobj = ShpDocCuttOffDateDirCtrl.eventObj;
        }
        Init();
    }
})();