(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmTransportController", ConfirmTransportController);

    ConfirmTransportController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http"];

    function ConfirmTransportController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http) {

        var ConfirmTransportCtrl = this;

        function Init() {

            var currentManifest = ConfirmTransportCtrl.currentManifest[ConfirmTransportCtrl.currentManifest.label].ePage.Entities;

            ConfirmTransportCtrl.ePage = {
                "Title": "",
                "Prefix": "Approve Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            if (ConfirmTransportCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ConfirmTransportCtrl.ePage.Masters.MenuList = ConfirmTransportCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                ConfirmTransportCtrl.ePage.Masters.MenuList = ConfirmTransportCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            ConfirmTransportCtrl.ePage.Masters.Empty = "-";
            ConfirmTransportCtrl.ePage.Masters.Config = dmsManifestConfig;

            // DatePicker
            ConfirmTransportCtrl.ePage.Masters.DatePicker = {};
            ConfirmTransportCtrl.ePage.Masters.DatePicker.Options = angular.copy(APP_CONSTANT.DatePicker);
            ConfirmTransportCtrl.ePage.Masters.DatePicker.Options['minDate'] = new Date() + 1;

            ConfirmTransportCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConfirmTransportCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ConfirmTransportCtrl.ePage.Masters.OnChangeVehicleType = OnChangeVehicleType;
            ConfirmTransportCtrl.ePage.Masters.SelectedLookupCarrier = SelectedLookupCarrier;

            getVehicleType();
            generalOperation();
        }

        function generalOperation() {
            // Transporter
            if (ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode == null)
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode = "";
            if (ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName == null)
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName = "";
            ConfirmTransportCtrl.ePage.Masters.Transporter = ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode + ' - ' + ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName;
            if (ConfirmTransportCtrl.ePage.Masters.Transporter == " - ")
                ConfirmTransportCtrl.ePage.Masters.Transporter = "";
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ConfirmTransportCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                "FilterID": ConfirmTransportCtrl.ePage.Entities.Header.API.MstContainer.FilterID
            };
            apiService.post("eAxisAPI", ConfirmTransportCtrl.ePage.Entities.Header.API.MstContainer.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ConfirmTransportCtrl.ePage.Masters.VehicleType = response.data.Response;
                }
            });
        }

        function OnChangeVehicleType(item, text) {
            if (text == "VehicleType") {
                angular.forEach(ConfirmTransportCtrl.ePage.Masters.VehicleType, function (value, key) {
                    if (value.Code == item) {
                        ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeDescription = value.Description;
                        ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeCode = value.Code;
                        ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleType = value.PK;
                    }
                });
            }
        }

        function SelectedLookupCarrier(item) {
            if (item.data) {
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Transporter_ORG_FK = item.data.entity.PK;
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode = item.data.entity.Code;
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName = item.data.entity.FullName;
                ConfirmTransportCtrl.ePage.Masters.Transporter = item.data.entity.Code + '-' + item.data.entity.FullName;
            }
            else {
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Transporter_ORG_FK = item.PK;
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode = item.Code;
                ConfirmTransportCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName = item.FullName;
                ConfirmTransportCtrl.ePage.Masters.Transporter = item.Code + '-' + item.FullName;
            }
        }

        Init();
    }

})();