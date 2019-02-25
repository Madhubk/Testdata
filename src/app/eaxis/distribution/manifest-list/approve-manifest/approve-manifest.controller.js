(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApproveManifestController", ApproveManifestController);

    ApproveManifestController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http"];

    function ApproveManifestController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http) {

        var ApproveManifestCtrl = this;

        function Init() {

            var currentManifest = ApproveManifestCtrl.currentManifest[ApproveManifestCtrl.currentManifest.label].ePage.Entities;

            ApproveManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Approve Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            ApproveManifestCtrl.ePage.Masters.DropDownMasterList = {};

            if (ApproveManifestCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ApproveManifestCtrl.ePage.Masters.MenuList = ApproveManifestCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                ApproveManifestCtrl.ePage.Masters.MenuList = ApproveManifestCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            ApproveManifestCtrl.ePage.Masters.Empty = "-";
            ApproveManifestCtrl.ePage.Masters.Config = dmsManifestConfig;

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
                        ApproveManifestCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ApproveManifestCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        Init();
    }

})();