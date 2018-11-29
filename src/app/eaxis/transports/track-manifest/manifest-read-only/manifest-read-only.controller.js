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
            ManifestReadOnlyCtrl.ePage.Masters.OnChangeArrivaldate = OnChangeArrivaldate;

            ManifestReadOnlyCtrl.ePage.Masters.Config = manifestConfig;

            ManifestReadOnlyCtrl.ePage.Masters.DropDownMasterList = {};

            ManifestReadOnlyCtrl.ePage.Masters.IsDisable = true;

            // DatePicker
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker = {};
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.OptionsDel = angular.copy(APP_CONSTANT.DatePicker)
            var a = new Date;
            var b = ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ActualDispatchDate;
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.OptionsDel['minDate'] = b;
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.OptionsDel['maxDate'] = a;

            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.isOpen = [];
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GetMastersList();
            generalOperation();
            ManifestSummary()
            ReceiverSummary()
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ManifestReadOnlyCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OnChangeArrivaldate(arrival){
            
            OnChangeValues(ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ShipmentArrivalDate,"E5513",false,undefined)
        }

        function generalOperation() {
            // Sender
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode = "";
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName = "";
            ManifestReadOnlyCtrl.ePage.Masters.Sender = ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode + ' - ' + ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName;
            if (ManifestReadOnlyCtrl.ePage.Masters.Sender == " - ")
                ManifestReadOnlyCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode = "";
            if (ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName == null)
                ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName = "";
            ManifestReadOnlyCtrl.ePage.Masters.Receiver = ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode + ' - ' + ManifestReadOnlyCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName;
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

        function ManifestSummary(){
            var tempvolume = 0;
            var tempquantity = 0;
            var tempweight = 0;
            angular.forEach(ManifestReadOnlyCtrl.ePage.Entities.Header.Data.ItemSummary,function(value,key){
                tempquantity = tempquantity + value.Quantity;
                tempvolume = tempvolume + value.Volumne;
                tempweight = tempweight + value.Weight;  
            });
            ManifestReadOnlyCtrl.ePage.Masters.TotalQuantity = tempquantity;
            ManifestReadOnlyCtrl.ePage.Masters.TotalWeight = tempweight;
            ManifestReadOnlyCtrl.ePage.Masters.TotalVolume = tempvolume;
        }    
        function ReceiverSummary(){
            var tempvolume = 0;
            var tempquantity = 0;
            var tempweight = 0;
            angular.forEach(ManifestReadOnlyCtrl.ePage.Entities.Header.Data.ReceiverSummary,function(value,key){
                tempquantity = tempquantity + value.Quantity;
                tempvolume = tempvolume + value.Volumne;
                tempweight = tempweight + value.Weight;  
            });
            ManifestReadOnlyCtrl.ePage.Masters.ReceiverTotalQuantity = tempquantity;
            ManifestReadOnlyCtrl.ePage.Masters.ReceiverTotalWeight = tempweight;
            ManifestReadOnlyCtrl.ePage.Masters.ReceiverTotalVolume = tempvolume;
        }
        Init();
    }

})();