(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestReadOnlyController", ManifestReadOnlyController);

    ManifestReadOnlyController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "manifestConfig", "helperService", "$window", "$uibModal"];

    function ManifestReadOnlyController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, manifestConfig, helperService, $window, $uibModal) {

        var ManifestReadOnlyCtrl = this;

        function Init() {

            var currentManifest = ManifestReadOnlyCtrl.currentManifest[ManifestReadOnlyCtrl.currentManifest.label].ePage.Entities;

            ManifestReadOnlyCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_ReadOnly",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            ManifestReadOnlyCtrl.ePage.Masters.Empty = "-";
            ManifestReadOnlyCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ManifestReadOnlyCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            ManifestReadOnlyCtrl.ePage.Masters.Config = manifestConfig;

            ManifestReadOnlyCtrl.ePage.Masters.DropDownMasterList = {};

            ManifestReadOnlyCtrl.ePage.Masters.IsDisable = true;

            // DatePicker
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker = {};
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.isOpen = [];
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetMastersList();
            generalOperation();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function generalOperation() {
            // Sender
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.Code == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.Code = "";
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.FullName == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.FullName = "";
            ManifestReadOnlyCtrl.ePage.Masters.Sender = ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.Code + ' - ' + ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.FullName;
            if (ManifestReadOnlyCtrl.ePage.Masters.Sender == " - ")
                ManifestReadOnlyCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.Code == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = "";
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = "";
            ManifestReadOnlyCtrl.ePage.Masters.Receiver = ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ManifestReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
            if (ManifestReadOnlyCtrl.ePage.Masters.Receiver == " - ")
                ManifestReadOnlyCtrl.ePage.Masters.Receiver = "";
        }

        function setSelectedRow(index) {
            ManifestReadOnlyCtrl.ePage.Masters.selectedRow = index;
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ManifestReadOnlyCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ManifestReadOnlyCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ManifestReadOnlyCtrl.currentManifest.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ManifestReadOnlyCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ManifestReadOnlyCtrl.currentManifest.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["ManifestType"];
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
                        ManifestReadOnlyCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ManifestReadOnlyCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        Init();
    }

})();