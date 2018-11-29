(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VehicleGeneralController", VehicleGeneralController);

    VehicleGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "vehicleConfig", "helperService", "$filter", "$uibModal", "toastr", "appConfig", "$injector", "$document", "confirmation",];

    function VehicleGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, vehicleConfig, helperService, $filter, $uibModal, toastr, appConfig, $injector, $document, confirmation) {
        var VehicleGeneralCtrl = this;

        function Init() {
            var currentVehicle = VehicleGeneralCtrl.currentVehicle[VehicleGeneralCtrl.currentVehicle.label].ePage.Entities;

            VehicleGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentVehicle
            };
            VehicleGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            VehicleGeneralCtrl.ePage.Masters.Config = $injector.get("vehicleConfig");
            getVehicleType();
            GetDropDownList();
        }

        function getVehicleType() {
            var _filter = {
                "SortColumn": "CNM_Code",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": VehicleGeneralCtrl.ePage.Entities.Header.API.MstContainer.FilterID
            };
            apiService.post("eAxisAPI", VehicleGeneralCtrl.ePage.Entities.Header.API.MstContainer.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    VehicleGeneralCtrl.ePage.Masters.VehicleType = response.data.Response;
                }
            });
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["TransportMode"];
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
                        VehicleGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        VehicleGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        Init();
    }
})();