(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BillableCostController", BillableCostController);

    BillableCostController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http"];

    function BillableCostController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http) {

        var BillableCostCtrl = this;

        function Init() {

            var currentManifest = BillableCostCtrl.currentManifest[BillableCostCtrl.currentManifest.label].ePage.Entities;

            BillableCostCtrl.ePage = {
                "Title": "",
                "Prefix": "Dockin_Vehicle",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            if (BillableCostCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                BillableCostCtrl.ePage.Masters.MenuList = BillableCostCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                BillableCostCtrl.ePage.Masters.MenuList = BillableCostCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            BillableCostCtrl.ePage.Masters.DropDownMasterList={};
            BillableCostCtrl.ePage.Masters.Empty = "-";
            BillableCostCtrl.ePage.Masters.Config = dmsManifestConfig;
            GetDropdownList()
        }
        function GetDropdownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["Currency"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        BillableCostCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BillableCostCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        Init();
    }

})();