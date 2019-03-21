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
            BillableCostCtrl.ePage.Masters.Consignmentlist = [];
            BillableCostCtrl.ePage.Masters.DropDownMasterList = {};
            BillableCostCtrl.ePage.Masters.Empty = "-";
            BillableCostCtrl.ePage.Masters.Config = dmsManifestConfig;
            BillableCostCtrl.ePage.Masters.Save = save;
            BillableCostCtrl.ePage.Masters.SaveButtonText = "Save";

            GetDropdownList()
            // ManifestConsignmentDetails()
        }
        // function ManifestConsignmentDetails() {
        //     angular.forEach(BillableCostCtrl.ePage.Entities.Header.Data.TmsConsignmentList, function (value, key) {
        //         angular.forEach(value, function (value1, key1) {
        //        console.log(value1)
        //        console.log(key1)
        //         });
        //     });
        // }
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

        function save() {
            BillableCostCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = true;
            if (BillableCostCtrl.ePage.Masters.Save) {
                BillableCostCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            var item = filterObjectUpdate(BillableCostCtrl.ePage.Entities.Header.Data, "IsModified");

            // jobcustom manifest input
            if (!BillableCostCtrl.ePage.Entities.Header.Data.UIJobCustom.PK || BillableCostCtrl.ePage.Entities.Header.Data.UIJobCustom.PK == "00000000-0000-0000-0000-000000000000") {
                BillableCostCtrl.ePage.Entities.Header.Data.UIJobCustom.IsNewInsert = true;
            } else if (BillableCostCtrl.ePage.Entities.Header.Data.UIJobCustom.PK) {
                BillableCostCtrl.ePage.Entities.Header.Data.UIJobCustom.IsModified = true;
                BillableCostCtrl.ePage.Entities.Header.Data.UIJobCustom.IsNewInsert = false;
            }

            // consignment

            angular.forEach(BillableCostCtrl.ePage.Entities.Header.Data.TmsConsignmentList, function (value, key) {
                if (!value.UIJobCustom.PK || value.UIJobCustom.PK == "00000000-0000-0000-0000-000000000000") {
                    value.UIJobCustom.IsNewInsert = true;
                } else if (value.UIJobCustom.PK) {
                    value.TmsManifestCosignmentMapping.IsChanged = true;
                    value.UIJobCustom.IsNewInsert = false;
                }
            });

            apiService.post("eAxisAPI", BillableCostCtrl.ePage.Entities.Header.API.UpdateManifest.Url, BillableCostCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                        BillableCostCtrl.ePage.Entities.Header.Data = response.data.Response;
                        BillableCostCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        toastr.success("Saved Successfully");
                        BillableCostCtrl.ePage.Masters.SaveButtonText = "Save";
                    });
                } else {
                    BillableCostCtrl.ePage.Masters.SaveButtonText = "Save";
                    BillableCostCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                    BillableCostCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                }
            });
        }
        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        Init();
    }

})();