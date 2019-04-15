(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackDamageGeneralController", TrackDamageGeneralController);

    TrackDamageGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "trackDamageSkuConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function TrackDamageGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, trackDamageSkuConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation) {

        var TrackDamageGeneralCtrl = this

        function Init() {

            var currentTrackDamage = TrackDamageGeneralCtrl.currentTrackDamage[TrackDamageGeneralCtrl.currentTrackDamage.label].ePage.Entities;

            TrackDamageGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Line_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTrackDamage,
            };

            // DatePicker
            TrackDamageGeneralCtrl.ePage.Masters.DatePicker = {};
            TrackDamageGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            TrackDamageGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            TrackDamageGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            TrackDamageGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            //Functions
            TrackDamageGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            TrackDamageGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            TrackDamageGeneralCtrl.ePage.Masters.SelectedLookupSite = SelectedLookupSite;
            TrackDamageGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            TrackDamageGeneralCtrl.ePage.Masters.Config = $injector.get("trackDamageSkuConfig");
            TrackDamageGeneralCtrl.ePage.Masters.emptyText = '-';
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.AcutalDeliveryDate)
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.IsDelivered = "Delivered";
            else
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.IsDelivered = "Not Delivered";

            GetDropDownList();
            GeneralOperations();
            GetBindValues();
        }

        // #region - Validation
        function OnChangeValues(fieldvalue, code) {
            angular.forEach(TrackDamageGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                TrackDamageGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, TrackDamageGeneralCtrl.currentTrackDamage.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                TrackDamageGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, TrackDamageGeneralCtrl.currentTrackDamage.label);
            }
        }
        // #endregion
        // #region - General
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            TrackDamageGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["Response_Type", "CSR_Mode"];
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
                        TrackDamageGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        TrackDamageGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == 'CSR_Mode') {
                            TrackDamageGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = $filter('orderBy')(TrackDamageGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource, 'Sequence')
                        }
                    });
                }
            });
        }
        // #endregion
        // #region - Lookup
        function SelectedLookupClient(item) {
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Client = item.Code + '-' + item.FullName;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ClientCode = item.Code;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ORG_Client_FK = item.PK;
        }

        function SelectedLookupSite(item) {
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Consignee = item.Code + '-' + item.FullName;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode = item.Code;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ORG_Consignee_FK = item.PK;
        }

        function SelectedLookupWarehouse(item) {
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Warehouse = item.WarehouseCode + "-" + item.WarehouseName;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode = item.WarehouseCode;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WAR_FK = item.WAR_PK;
        }

        function GeneralOperations() {
            //Remove Null Values from data
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WarehouseName == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WarehouseName = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ConsigneeName == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ConsigneeName = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ClientCode == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ClientCode = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ClientName == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ClientName = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ProductCode == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ProductCode = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ProductDescription == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ProductDescription = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductCode == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductCode = "";
            }
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductDesc == null) {
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductDesc = "";
            }
        }

        function GetBindValues() {
            //Binding of Two values together
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Warehouse = TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode + ' - ' + TrackDamageGeneralCtrl.ePage.Entities.Header.Data.WarehouseName;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Client = TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ClientCode + ' - ' + TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ClientName;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Consignee = TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode + ' - ' + TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ConsigneeName;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.RequestedProduct = TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ProductCode + ' - ' + TrackDamageGeneralCtrl.ePage.Entities.Header.Data.ProductDescription;
            TrackDamageGeneralCtrl.ePage.Entities.Header.Data.DeliveredProduct = TrackDamageGeneralCtrl.ePage.Entities.Header.Data.PIL_ProductCode + ' - ' + TrackDamageGeneralCtrl.ePage.Entities.Header.Data.PIL_ProductDesc;
            Removehyphen();
        }

        function Removehyphen() {
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Warehouse == ' - ')
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Warehouse = "";
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Client == ' - ')
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Client = "";
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Consignee == ' - ')
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.Consignee = "";
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.RequestedProduct == ' - ')
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.RequestedProduct = "";
            if (TrackDamageGeneralCtrl.ePage.Entities.Header.Data.DeliveredProduct == ' - ')
                TrackDamageGeneralCtrl.ePage.Entities.Header.Data.DeliveredProduct = "";
        }
        // #endregion       
        Init();
    }

})();
