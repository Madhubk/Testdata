(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardDispatchController", OutwardDispatchController);

    OutwardDispatchController.$inject = ["$scope", "$state", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "$injector", "$window", "toastr", "confirmation"];

    function OutwardDispatchController($scope, $state, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, $injector, $window, toastr, confirmation) {

        var OutwardDispatchCtrl = this;

        function Init() {

            var currentOutward = OutwardDispatchCtrl.currentOutward[OutwardDispatchCtrl.currentOutward.label].ePage.Entities;

            OutwardDispatchCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Dispatch",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward
            };
            OutwardDispatchCtrl.ePage.Masters.DropDownMasterList = {};
            OutwardDispatchCtrl.ePage.Masters.ManifestDetails = OutwardDispatchCtrl.manifestDetails;
            // DatePicker
            OutwardDispatchCtrl.ePage.Masters.DatePicker = {};
            OutwardDispatchCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OutwardDispatchCtrl.ePage.Masters.DatePicker.isOpen = [];
            OutwardDispatchCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            GetDropDownList();
            getVehicleType();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OutwardDispatchCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                "FilterID": OutwardDispatchCtrl.ePage.Entities.Header.API.MstContainer.FilterID
            };
            apiService.post("eAxisAPI", OutwardDispatchCtrl.ePage.Entities.Header.API.MstContainer.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    OutwardDispatchCtrl.ePage.Masters.VehicleType = response.data.Response;
                }
            });
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["ManifestType", "ManifestLoadType"];
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
                        OutwardDispatchCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OutwardDispatchCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        Init();
    }

})();