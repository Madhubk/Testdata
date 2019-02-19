/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolForwarderDoVltController", ImportSeaConsolForwarderDoVltController);

    ImportSeaConsolForwarderDoVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "three_consolidationConfig"];

    function ImportSeaConsolForwarderDoVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, three_consolidationConfig) {
        var ImportSeaConsolForwarderDoVltCtrl = this;

        function Init() {
            ImportSeaConsolForwarderDoVltCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaConsolForwarderDoVltCtrl.taskObj) {
                ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj = ImportSeaConsolForwarderDoVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    code: ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    isNew: false
                };
                ImportSeaConsolForwarderDoVltCtrl.currentConsol = obj;
                ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TableProperties = {
                    "HeaderProperties": [
                        {
                            "columnname": "Container No",
                            "isenabled": true,
                            "property": "containerno",
                            "position": "1",
                            "width": "120",
                            "display": false
                        },
                        {
                            "columnname": "HouseBill No",
                            "isenabled": true,
                            "property": "HousebillNo",
                            "position": "1",
                            "width": "150",
                            "display": false
                        },
                        {
                            "columnname": "Shipper",
                            "isenabled": true,
                            "property": "Shipper",
                            "position": "1",
                            "width": "150",
                            "display": false
                        },
                        {
                            "columnname": "Consignee",
                            "isenabled": true,
                            "property": "Consignee",
                            "position": "1",
                            "width": "150",
                            "display": false
                        },
                        {
                            "columnname": "Orgin",
                            "isenabled": true,
                            "property": "Orgin",
                            "position": "1",
                            "width": "150",
                            "display": false
                        },
                        {
                            "columnname": "Destination",
                            "isenabled": true,
                            "property": "Destination",
                            "position": "1",
                            "width": "150",
                            "display": false
                        },
                        {
                            "columnname": "Type",
                            "isenabled": true,
                            "property": "Type",
                            "position": "1",
                            "width": "100",
                            "display": false
                        }
                    ]
                }
                // ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", three_consolidationConfig.Entities.Header.API.GetByID.Url + ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();