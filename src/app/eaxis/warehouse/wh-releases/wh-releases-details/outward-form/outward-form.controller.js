(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardFormController", OutwardFormController);

    OutwardFormController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "releaseConfig"];

    function OutwardFormController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModal, releaseConfig) {

        var OutwardFormCtrl = this;

        function Init() {

            OutwardFormCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderLines_Form",
                "Masters": {
                    "OrderLines": {},
                    "Meta": {

                    }
                },
                "Meta": helperService.metaBase(),
                "Entities": "",
            };
            OutwardFormCtrl.ePage.Masters.Config = releaseConfig;

            OutwardFormCtrl.ePage.Masters.Meta.ListSource = [];
            OutwardFormCtrl.ePage.Masters.DropDownMasterList = {};
            OutwardFormCtrl.ePage.Masters.OutwardDetails = OutwardFormCtrl.lineOrder[0];
            OutwardFormCtrl.ePage.Masters.PickNo = OutwardFormCtrl.pickNumber.Data.UIWmsPickHeader.PickNo;
            OutwardFormCtrl.ePage.Masters.Meta = OutwardFormCtrl.pickNumber.Meta;

            OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails = OutwardFormCtrl.ePage.Masters.OutwardDetails[OutwardFormCtrl.ePage.Masters.OutwardDetails.label].ePage.Entities.Header.Data;
            OutwardFormCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            OutwardFormCtrl.ePage.Masters.SelectedLookupDataConsignee = SelectedLookupDataConsignee;
            OutwardFormCtrl.ePage.Masters.SelectedLookupDataWarehouse = SelectedLookupDataWarehouse;
            OutwardFormCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            // DatePicker
            OutwardFormCtrl.ePage.Masters.DatePicker = {};
            OutwardFormCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OutwardFormCtrl.ePage.Masters.DatePicker.isOpen = [];
            OutwardFormCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            OutwardFormCtrl.ePage.Masters.emptyText = "-";
            
            GetDropDownList();
            generalOperation();
        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(OutwardFormCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                OutwardFormCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardFormCtrl.ePage.Masters.PickNo, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                OutwardFormCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OutwardFormCtrl.ePage.Masters.PickNo);
            }
        }


        function generalOperation() {
            // Client
            if (OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode == null)
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode = "";
            if (OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientName == null)
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode = "";
            OutwardFormCtrl.ePage.Masters.ClientCode = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientName;
            if (OutwardFormCtrl.ePage.Masters.ClientCode == " - ")
                OutwardFormCtrl.ePage.Masters.ClientCode = "";

            // Consignee
            if (OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeCode == null)
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeCode = "";
            if (OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeName == null)
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeName = "";
            OutwardFormCtrl.ePage.Masters.Consignee = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeName;

            if (OutwardFormCtrl.ePage.Masters.Consignee == " - ")
                OutwardFormCtrl.ePage.Masters.Consignee = "";

            // Warehouse
            if (OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode == null)
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode = "";
            if (OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseName == null)
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseName = "";
            OutwardFormCtrl.ePage.Masters.WarehouseCode = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseName;
            if (OutwardFormCtrl.ePage.Masters.WarehouseCode == " - ")
                OutwardFormCtrl.ePage.Masters.WarehouseCode = "";
        }

        function SelectedLookupDataClient(item) {
            if (item.entity) {
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode = item.entity.Code;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientName = item.entity.FullName;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ORG_Client_FK = item.entity.PK;
                OutwardFormCtrl.ePage.Masters.ClientCode = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientName;
            } else {
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode = item.Code;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientName = item.FullName;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ORG_Client_FK = item.PK;
                OutwardFormCtrl.ePage.Masters.ClientCode = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientName;
            }
            OnChangeValues(OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ClientCode, 'E8502');
        }
        function SelectedLookupDataConsignee(item) {
            if (item.entity) {
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeCode = item.entity.Code;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeName = item.entity.FullName;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ORG_Consignee_FK = item.entity.PK;
                OutwardFormCtrl.ePage.Masters.Consignee = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeName;
            } else {
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeCode = item.Code;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeName = item.FullName;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ORG_Consignee_FK = item.PK;
                OutwardFormCtrl.ePage.Masters.Consignee = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.ConsigneeName;
            }
        }
        function SelectedLookupDataWarehouse(item) {
            if (item.entity) {
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode = item.entity.WarehouseCode;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseName = item.entity.WarehouseName;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WAR_FK = item.entity.PK;
                OutwardFormCtrl.ePage.Masters.WarehouseCode = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseName;
            } else {
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode = item.WarehouseCode;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseName = item.WarehouseName;
                OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WAR_FK = item.PK;
                OutwardFormCtrl.ePage.Masters.WarehouseCode = OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode + "-" + OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseName;
            }
            OnChangeValues(OutwardFormCtrl.ePage.Masters.OutwardGeneralDetails.UIWmsOutwardHeader.WarehouseCode, 'E8501');
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WorkOrderType", "WmsOrderFulfillmentRule", "PickOption", "DropMode"];
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
                        OutwardFormCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OutwardFormCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OutwardFormCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        Init();

    }

})();