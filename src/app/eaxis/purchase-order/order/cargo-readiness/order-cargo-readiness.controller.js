(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdCargoReadinessController", OrdCargoReadinessController);

    OrdCargoReadinessController.$inject = ["APP_CONSTANT", "apiService", "helperService", "appConfig", "authService"];

    function OrdCargoReadinessController(APP_CONSTANT, apiService, helperService, appConfig, authService) {
        var OrdCargoReadinessCtrl = this;
        
        function Init() {
            var currentOrder = OrdCargoReadinessCtrl.currentOrder[OrdCargoReadinessCtrl.currentOrder.label].ePage.Entities;
            OrdCargoReadinessCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_cargo_Readiness",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitCargoReadiness();
            GetCfxTypeList();
        }

        function InitCargoReadiness() {
            // DatePicker
            OrdCargoReadinessCtrl.ePage.Masters.DatePicker = {};
            OrdCargoReadinessCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdCargoReadinessCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdCargoReadinessCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            
            if (OrdCargoReadinessCtrl.currentOrder.isNew) {
                OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistory = [];
            } else {
                GetFollowUphistory();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdCargoReadinessCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetCfxTypeList() {
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS","JOBADDR"];
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
                typeCodeList.map(function (value, key) {
                    OrdCargoReadinessCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    OrdCargoReadinessCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }

        function GetFollowUphistory() {
            var _filter = {
                "EntitySource": "SFU",
                "EntityRefKey" : OrdCargoReadinessCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistory = response.data.Response;
                } else {
                    OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistory = [];
                }
            });
        }
                
        Init();
    }
})();
