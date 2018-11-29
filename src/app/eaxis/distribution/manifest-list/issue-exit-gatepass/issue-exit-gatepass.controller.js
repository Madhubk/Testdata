(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IssueExitGatepassController", IssueExitGatepassController);

    IssueExitGatepassController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function IssueExitGatepassController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var IssueExitGatepassCtrl = this;

        function Init() {

            var currentManifest = IssueExitGatepassCtrl.currentManifest[IssueExitGatepassCtrl.currentManifest.label].ePage.Entities;

            IssueExitGatepassCtrl.ePage = {
                "Title": "",
                "Prefix": "Issue_Exit_Gatepass",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            IssueExitGatepassCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(IssueExitGatepassCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: IssueExitGatepassCtrl.jobfk })

            if (IssueExitGatepassCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                IssueExitGatepassCtrl.ePage.Masters.MenuList = IssueExitGatepassCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                IssueExitGatepassCtrl.ePage.Masters.MenuList = IssueExitGatepassCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            IssueExitGatepassCtrl.ePage.Masters.Empty = "-";
            IssueExitGatepassCtrl.ePage.Masters.Config = dmsManifestConfig;

        }

        Init();
    }

})();