(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_CargoReadinessInlineController", three_three_CargoReadinessInlineController);

        three_three_CargoReadinessInlineController.$inject = ["$timeout", "APP_CONSTANT", "helperService", "appConfig", "apiService", "authService"];

    function three_three_CargoReadinessInlineController($timeout, APP_CONSTANT, helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var three_three_CargoReadinessInlineCtrl = this;

        function Init() {
            // var currentObject = three_three_CargoReadinessInlineCtrl.currentObject[three_three_CargoReadinessInlineCtrl.currentObject.label].ePage.Entities;
            three_three_CargoReadinessInlineCtrl.ePage = {
                "Title": "",
                "Prefix": "Cargo_Readiness_Inline_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrder_Forwarders": []
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
            three_three_CargoReadinessInlineCtrl.ePage.Masters.emptyText = '-';
            three_three_CargoReadinessInlineCtrl.ePage.Masters.Enable = true;
            three_three_CargoReadinessInlineCtrl.ePage.Masters.selectedRow = -1;
            three_three_CargoReadinessInlineCtrl.ePage.Masters.selectedRowObj = {}
            three_three_CargoReadinessInlineCtrl.ePage.Masters.TableProperties = {};
            three_three_CargoReadinessInlineCtrl.ePage.Masters.OnChange = OnChange;

            three_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker = {};
            three_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("three_three_CargoReadinessInlineCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
            // get table properties 
            if (three_three_CargoReadinessInlineCtrl.tableProperties) {
                $timeout(function () {
                    three_three_CargoReadinessInlineCtrl.ePage.Masters.TableProperties.UICargoReadiness = angular.copy(three_three_CargoReadinessInlineCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }
            three_three_CargoReadinessInlineCtrl.ePage.Entities.Header.Data.UIOrder_Forwarders = three_three_CargoReadinessInlineCtrl.currentObject;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_three_CargoReadinessInlineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        three_three_CargoReadinessInlineCtrl.ePage.Masters.TableProperties.UICargoReadiness = obj;
                    }
                }
            });
        }

        function OnChange(item) {
            three_three_CargoReadinessInlineCtrl.gridChange({
                item: item
            });
        }

        Init();
    }
})();