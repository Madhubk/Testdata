(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_CargoReadinessInlineController", one_three_CargoReadinessInlineController);

    one_three_CargoReadinessInlineController.$inject = ["$scope", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService"];

    function one_three_CargoReadinessInlineController($scope, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var one_three_CargoReadinessInlineCtrl = this;

        function Init() {
            // var currentObject = one_three_CargoReadinessInlineCtrl.currentObject[one_three_CargoReadinessInlineCtrl.currentObject.label].ePage.Entities;
            one_three_CargoReadinessInlineCtrl.ePage = {
                "Title": "",
                "Prefix": "Cargo_Readiness_Inline_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrder_Buyer_Forwarder": []
                        }
                    }
                },
                "GlobalVariables": {
                    "Loading": false,
                    "NonEditable": false
                }
            };

            InitCRDGrid();
        }

        function InitCRDGrid() {
            one_three_CargoReadinessInlineCtrl.ePage.Masters.emptyText = '-';
            one_three_CargoReadinessInlineCtrl.ePage.Masters.Enable = true;
            one_three_CargoReadinessInlineCtrl.ePage.Masters.selectedRow = -1;
            one_three_CargoReadinessInlineCtrl.ePage.Masters.selectedRowObj = {}
            one_three_CargoReadinessInlineCtrl.ePage.Masters.TableProperties = {};
            one_three_CargoReadinessInlineCtrl.ePage.Masters.OnChange = OnChange;

            one_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker = {};
            one_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("one_three_CargoReadinessInlineCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
            // get table properties 
            if (one_three_CargoReadinessInlineCtrl.tableProperties) {
                $timeout(function () {
                    one_three_CargoReadinessInlineCtrl.ePage.Masters.TableProperties.UICargoReadiness = angular.copy(one_three_CargoReadinessInlineCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }
            one_three_CargoReadinessInlineCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder = one_three_CargoReadinessInlineCtrl.currentObject;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "CARGOREADINESS",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value);
                        one_three_CargoReadinessInlineCtrl.ePage.Masters.TableProperties.UICargoReadiness = obj;
                    }
                }
            });
        }

        function OnChange(item) {
            one_three_CargoReadinessInlineCtrl.gridChange({
                item: item
            });
        }

        Init();
    }
})();