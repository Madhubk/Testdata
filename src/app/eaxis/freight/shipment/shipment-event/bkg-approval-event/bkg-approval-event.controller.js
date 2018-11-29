(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BkgApprovalDirController", BkgApprovalDirController);

    BkgApprovalDirController.$inject = ["$scope", "authService", "apiService", "helperService", "appConfig"];

    function BkgApprovalDirController($scope, authService, apiService, helperService, appConfig) {
        var BkgApprovalDirCtrl = this;

        function Init() {
            BkgApprovalDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Shp_Booking_Approval",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            }
            BkgApprovalDirCtrl.ePage.Masters.Eventobj = BkgApprovalDirCtrl.eventObj;
        }
        Init();
    }
})();