(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentDynamicTableController", ShipmentDynamicTableController);

    ShipmentDynamicTableController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "toastr"];

    function ShipmentDynamicTableController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, helperService, appConfig, toastr) {
        /* jshint validthis: true */
        var ShipmentDynamicTableCtrl = this;

        function Init() {
            var currentObject = ShipmentDynamicTableCtrl.currentObject[ShipmentDynamicTableCtrl.currentObject.label].ePage.Entities;
            ShipmentDynamicTableCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObject
            };
            ShipmentDynamicTableCtrl.ePage.Masters.Routing = {};

            // Grid Configuration Input
            ShipmentDynamicTableCtrl.ePage.Masters.Routing.gridConfig = {
                "isHeader": true,
                "isSearch": true,
                "title": "User Details",
                "isSorting": true,
                "isColumnHeader": true,
                "isEdit": true,
                "isDelete": true,
                "isPagination": true,
                "itemsPerPage": 10,
                "isRowTemplate": false,
                "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='p-5 clearfix'>
                <div class='col-sm-1'>{{x.Id}}</div>
                <div class='col-sm-2'>{{x.FName}}</div>
                <div class='col-sm-2'>{{x.LName}}</div>
                </div>`
            };

            ShipmentDynamicTableCtrl.ePage.Masters.Routing.gridConfig.columnDef = [{
                "field": "Id",
                "displayName": "Id",
                "width": 200
            }, {
                "field": "FName",
                "displayName": "First Name",
                "width": 200
            }, {
                "field": "LName",
                "displayName": "Last Name",
                "width": 200
            }, {
                "field": "Age",
                "displayName": "Age",
                "width": 200
            }, {
                "field": "City",
                "displayName": "City",
                "width": 200
            }, {
                "field": "Country",
                "displayName": "Country",
                "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"link\")'>{{x[y.field]}}</a>",
                "width": 200
            }, {
                "field": "DOB",
                "displayName": "Date of Birth",
                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                "width": 200
            }];

            ShipmentDynamicTableCtrl.ePage.Masters.Routing.SelectedGridRow = SelectedGridRow;

            GetGridData();
        }

        function GetGridData() {
            ShipmentDynamicTableCtrl.ePage.Masters.Routing.GridData = [];
            for (var index = 0; index < 100; index++) {
                var element = {
                    "Id": index + 1,
                    "FName": "AAA" + index + 1,
                    "LName": "A" + index + 1,
                    "Age": 10 + index + 1,
                    "City": "XXXX",
                    "Country": "YYYY",
                    "DOB": "2016-09-01T14:38:00"
                };
                ShipmentDynamicTableCtrl.ePage.Masters.Routing.GridData.push(element);
            }
        }

        function SelectedGridRow($item) {
            console.log($item);
        }

        Init();
    }
})();
