(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrdCargoReadinessController", three_three_OrdCargoReadinessController);

    three_three_OrdCargoReadinessController.$inject = ["APP_CONSTANT", "apiService", "helperService", "appConfig", "authService"];

    function three_three_OrdCargoReadinessController(APP_CONSTANT, apiService, helperService, appConfig, authService) {
        var three_three_OrdCargoReadinessCtrl = this;

        function Init() {
            var currentOrder = three_three_OrdCargoReadinessCtrl.currentOrder[three_three_OrdCargoReadinessCtrl.currentOrder.label].ePage.Entities;
            three_three_OrdCargoReadinessCtrl.ePage = {
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
            three_three_OrdCargoReadinessCtrl.ePage.Masters.DatePicker = {};
            three_three_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_three_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_three_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (three_three_OrdCargoReadinessCtrl.currentOrder.isNew) {
                three_three_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = [];
            } else {
                GetFollowUpGroupHistory();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_three_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetCfxTypeList() {
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS", "JOBADDR"];
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
                    three_three_OrdCargoReadinessCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    three_three_OrdCargoReadinessCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }

        function GetFollowUpGroupHistory() {
            var _filter = {
                "EntityRefKey": three_three_OrdCargoReadinessCtrl.ePage.Entities.Header.Data.PK,
                "Source": "SFU,GFU"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            };

            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        three_three_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = response.data.Response;
                    } else {
                        three_three_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = [];
                    }
                } else {
                    three_three_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = [];
                }
            });
        }

        Init();
    }
})();