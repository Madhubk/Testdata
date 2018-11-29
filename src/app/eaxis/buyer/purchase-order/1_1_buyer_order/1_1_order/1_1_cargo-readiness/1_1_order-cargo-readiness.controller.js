(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrdCargoReadinessController", one_one_OrdCargoReadinessController);

    one_one_OrdCargoReadinessController.$inject = ["APP_CONSTANT", "apiService", "helperService", "appConfig", "authService"];

    function one_one_OrdCargoReadinessController(APP_CONSTANT, apiService, helperService, appConfig, authService) {
        var one_one_OrdCargoReadinessCtrl = this;

        function Init() {
            var currentOrder = one_one_OrdCargoReadinessCtrl.currentOrder[one_one_OrdCargoReadinessCtrl.currentOrder.label].ePage.Entities;
            one_one_OrdCargoReadinessCtrl.ePage = {
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
            one_one_OrdCargoReadinessCtrl.ePage.Masters.DatePicker = {};
            one_one_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_one_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_one_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (one_one_OrdCargoReadinessCtrl.currentOrder.isNew) {
                one_one_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = [];
            } else {
                GetFollowUpGroupHistory();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_one_OrdCargoReadinessCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                    one_one_OrdCargoReadinessCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    one_one_OrdCargoReadinessCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }

        function GetFollowUpGroupHistory() {
            var _filter = {
                "EntityRefKey": one_one_OrdCargoReadinessCtrl.ePage.Entities.Header.Data.PK,
                "Source": "SFU,GFU"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            };

            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        one_one_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = response.data.Response;
                    } else {
                        one_one_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = [];
                    }
                } else {
                    one_one_OrdCargoReadinessCtrl.ePage.Masters.FollowUpHistoryGroup = [];
                }
            });
        }

        Init();
    }
})();