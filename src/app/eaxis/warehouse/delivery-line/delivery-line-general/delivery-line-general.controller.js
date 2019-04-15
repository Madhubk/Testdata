(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryLineGeneralController", DeliveryLineGeneralController);

    DeliveryLineGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "deliveryLineConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function DeliveryLineGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, deliveryLineConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation) {

        var DeliveryLineGeneralCtrl = this

        function Init() {

            var currentDelivery = DeliveryLineGeneralCtrl.currentDelivery[DeliveryLineGeneralCtrl.currentDelivery.label].ePage.Entities;

            DeliveryLineGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Line_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDelivery,
            };

            // DatePicker
            DeliveryLineGeneralCtrl.ePage.Masters.DatePicker = {};
            DeliveryLineGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DeliveryLineGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            DeliveryLineGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DeliveryLineGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            //Functions
            DeliveryLineGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            DeliveryLineGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            DeliveryLineGeneralCtrl.ePage.Masters.SelectedLookupSite = SelectedLookupSite;
            DeliveryLineGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            DeliveryLineGeneralCtrl.ePage.Masters.Config = $injector.get("deliveryLineConfig");
            DeliveryLineGeneralCtrl.ePage.Masters.emptyText = '-';
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.AcutalDeliveryDate)
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.IsDelivered = "Delivered";
            else
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.IsDelivered = "Not Delivered";

            GetDropDownList();
            GeneralOperations();
            GetBindValues();
        }

        // #region - Validation
        function OnChangeValues(fieldvalue, code) {
            angular.forEach(DeliveryLineGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                DeliveryLineGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DeliveryLineGeneralCtrl.currentDelivery.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                DeliveryLineGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DeliveryLineGeneralCtrl.currentDelivery.label);
            }
        }
        // #endregion
        // #region - General
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DeliveryLineGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        DeliveryLineGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        DeliveryLineGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == 'CSR_Mode') {
                            DeliveryLineGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = $filter('orderBy')(DeliveryLineGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource, 'Sequence')
                        }
                    });
                }
            });
        }
        // #endregion
        // #region - Lookup
        function SelectedLookupClient(item) {
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Client = item.Code + '-' + item.FullName;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ClientCode = item.Code;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ORG_Client_FK = item.PK;
        }

        function SelectedLookupSite(item) {
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Consignee = item.Code + '-' + item.FullName;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode = item.Code;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ORG_Consignee_FK = item.PK;
        }

        function SelectedLookupWarehouse(item) {
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Warehouse = item.WarehouseCode + "-" + item.WarehouseName;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode = item.WarehouseCode;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WAR_FK = item.WAR_PK;
        }

        function GeneralOperations() {
            //Remove Null Values from data
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WarehouseName == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WarehouseName = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ConsigneeName == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ConsigneeName = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ClientCode == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ClientCode = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ClientName == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ClientName = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ProductCode == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ProductCode = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ProductDescription == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ProductDescription = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductCode == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductCode = "";
            }
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductDesc == null) {
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductDesc = "";
            }
        }

        function GetBindValues() {
            //Binding of Two values together
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Warehouse = DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WarehouseCode + ' - ' + DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.WarehouseName;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Client = DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ClientCode + ' - ' + DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ClientName;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Consignee = DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ConsigneeCode + ' - ' + DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ConsigneeName;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.RequestedProduct = DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ProductCode + ' - ' + DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.ProductDescription;
            DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DeliveredProduct = DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductCode + ' - ' + DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DEL_OL_ProductDesc;
            Removehyphen();
        }

        function Removehyphen() {
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Warehouse == ' - ')
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Warehouse = "";
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Client == ' - ')
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Client = "";
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Consignee == ' - ')
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.Consignee = "";
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.RequestedProduct == ' - ')
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.RequestedProduct = "";
            if (DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DeliveredProduct == ' - ')
                DeliveryLineGeneralCtrl.ePage.Entities.Header.Data.DeliveredProduct = "";
        }
        // #endregion       
        Init();
    }

})();
