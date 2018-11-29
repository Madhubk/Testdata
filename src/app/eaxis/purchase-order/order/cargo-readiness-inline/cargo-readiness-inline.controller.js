(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CargoReadinessInlineController", CargoReadinessInlineController);

    CargoReadinessInlineController.$inject = ["$scope", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService"];

    function CargoReadinessInlineController($scope, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var CargoReadinessInlineCtrl = this;

        function Init() {
            // var currentObject = CargoReadinessInlineCtrl.currentObject[CargoReadinessInlineCtrl.currentObject.label].ePage.Entities;
            CargoReadinessInlineCtrl.ePage = {
                "Title": "",
                "Prefix": "Cargo_Readiness_Inline_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIPorOrderheaders": []
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
            CargoReadinessInlineCtrl.ePage.Masters.emptyText = '-';
            CargoReadinessInlineCtrl.ePage.Masters.Enable = true;
            CargoReadinessInlineCtrl.ePage.Masters.selectedRow = -1;
            CargoReadinessInlineCtrl.ePage.Masters.selectedRowObj = {}
            CargoReadinessInlineCtrl.ePage.Masters.TableProperties = {};
            CargoReadinessInlineCtrl.ePage.Masters.OnChange = OnChange;

            CargoReadinessInlineCtrl.ePage.Masters.DatePicker = {};
            CargoReadinessInlineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CargoReadinessInlineCtrl.ePage.Masters.DatePicker.isOpen = [];
            CargoReadinessInlineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("CargoReadinessInlineCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
            // get table properties 
            if (CargoReadinessInlineCtrl.tableProperties) {
                $timeout(function () {
                    CargoReadinessInlineCtrl.ePage.Masters.TableProperties.UICargoReadiness = angular.copy(CargoReadinessInlineCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }
            CargoReadinessInlineCtrl.ePage.Entities.Header.Data.UIPorOrderheaders = CargoReadinessInlineCtrl.currentObject;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CargoReadinessInlineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        CargoReadinessInlineCtrl.ePage.Masters.TableProperties.UICargoReadiness = obj;
                    }
                }
            });
        }

        function OnChange(item) {
            CargoReadinessInlineCtrl.gridChange({
                item: item
            });
        }

        Init();
    }
})();