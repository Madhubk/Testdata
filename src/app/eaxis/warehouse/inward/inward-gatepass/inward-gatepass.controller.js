(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardGatepassController", InwardGatepassController);

    InwardGatepassController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "warehouseConfig", "inwardConfig", "helperService"];

    function InwardGatepassController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, warehouseConfig, inwardConfig, helperService) {

        var InwardGatepassCtrl = this

        function Init() {

            var currentInward = InwardGatepassCtrl.currentInward[InwardGatepassCtrl.currentInward.label].ePage.Entities;

            InwardGatepassCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Gatepass",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };
            if (!InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TGP_FK)
                GetGatepassList();
            else
                GetGatepassDetails();

            InwardGatepassCtrl.ePage.Masters.AttachGatepass = AttachGatepass;
            InwardGatepassCtrl.ePage.Masters.Config = inwardConfig;
        }

        // #region - Error Validation While onchanges
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(InwardGatepassCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                InwardGatepassCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardGatepassCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                InwardGatepassCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, InwardGatepassCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
            }
        }
        // #endregion

        // #region - attach gatepass to inward
        function AttachGatepass(item) {            
            InwardGatepassCtrl.ePage.Masters.Loading = true;
            InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TGP_FK = item.PK;
            InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.GatepassNo = item.GatepassNo;
            InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IsModified = true;

            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInwardList.API.Update.Url, InwardGatepassCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    InwardGatepassCtrl.ePage.Entities.Header.Data = response.data.Response;
                    apiService.get("eAxisAPI", warehouseConfig.Entities.TMSGatepassList.API.GetById.Url + InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TGP_FK).then(function (response) {
                        if (response.data.Response) {
                            InwardGatepassCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                            InwardGatepassCtrl.ePage.Masters.Loading = false;
                            OnChangeValues("value", "E3548", false, undefined);
                        }
                    });
                }
            });
        }
        // #endregion

        // #region - get gatepass List based on client and warehouse
        function GetGatepassList() {
            var _filter = {
                "Client_FK": InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                "WAR_FK": InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.TMSGatepass.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.TMSGatepass.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardGatepassCtrl.ePage.Masters.GatepassList = response.data.Response;
                }
            });
        }
        // #endregion
        // #region - get attached gatepass details
        function GetGatepassDetails() {
            apiService.get("eAxisAPI", warehouseConfig.Entities.TMSGatepassList.API.GetById.Url + InwardGatepassCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TGP_FK).then(function (response) {
                if (response.data.Response) {
                    InwardGatepassCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }
        // #endregion
        Init();
    }

})();