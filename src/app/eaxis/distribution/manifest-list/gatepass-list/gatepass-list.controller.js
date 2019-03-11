(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GatepassListController", GatepassListController);

    GatepassListController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http", "$filter"];

    function GatepassListController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http, $filter) {

        var GatepassListCtrl = this;

        function Init() {

            var currentManifest = GatepassListCtrl.currentManifest[GatepassListCtrl.currentManifest.label].ePage.Entities;

            GatepassListCtrl.ePage = {
                "Title": "",
                "Prefix": "Gatepass_List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            GatepassListCtrl.ePage.Entities.Header.Data.jobfk = $filter('filter')(GatepassListCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: GatepassListCtrl.jobfk })

            if (GatepassListCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                GatepassListCtrl.ePage.Masters.MenuList = GatepassListCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                GatepassListCtrl.ePage.Masters.MenuList = GatepassListCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            var res = GatepassListCtrl.ePage.Masters.MenuList[GatepassListCtrl.ePage.Entities.Header.CheckPoints.ActiveMenu].DisplayName.split(" ");

            if (res[1] == "Pickup" || res[1] == "Vehicle" || res[2] == "Dispatch") {
                GatepassListCtrl.ePage.Masters.Purpose = "ORD";
            }
            else if (res[1] == "Delivery" || res[1] == "Upload" || res[2] == "Delivery") {
                GatepassListCtrl.ePage.Masters.Purpose = "INW";
            }
            GatepassListCtrl.ePage.Masters.Empty = "-";
            GatepassListCtrl.ePage.Masters.Config = dmsManifestConfig;

            GatepassListCtrl.ePage.Masters.More = More;
            GatepassListCtrl.ePage.Masters.Close = Close;
            GatepassListCtrl.ePage.Masters.AttachGatepass = AttachGatepass;

            getGatePassList();
        }

        function AttachGatepass(value) {
            value.JDAFK = GatepassListCtrl.jobfk;
            value.ManifestFK = GatepassListCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK;
            GatepassListCtrl.ePage.Entities.Header.Data.TmsGatepassList.push(value);
            GatepassListCtrl.ePage.Entities.Header.Data.jobfk = $filter('filter')(GatepassListCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: GatepassListCtrl.jobfk })
        }

        function Close(value) {
            value.IsGatePassVisible = false;
        }

        function More(value) {
            value.IsGatePassVisible = true;
        }

        function getGatePassList() {
            var _filter = {
                "OrgFK": GatepassListCtrl.orgfk,
                "Purpose": GatepassListCtrl.ePage.Masters.Purpose,
                "ManifestFK": "NULL",
                "JDAFK": "NULL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": GatepassListCtrl.ePage.Entities.Header.API.TMSGatepass.FilterID
            };
            apiService.post("eAxisAPI", GatepassListCtrl.ePage.Entities.Header.API.TMSGatepass.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    GatepassListCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        Init();
    }

})();