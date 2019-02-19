/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolManifestFilingVltController", ImportSeaConsolManifestFilingVltController);

    ImportSeaConsolManifestFilingVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "three_consolidationConfig"];

    function ImportSeaConsolManifestFilingVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, three_consolidationConfig) {
        var ImportSeaConsolManifestFilingVltCtrl = this;

        function Init() {
            ImportSeaConsolManifestFilingVltCtrl.ePage = {
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

            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaConsolManifestFilingVltCtrl.taskObj) {
                ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj = ImportSeaConsolManifestFilingVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaConsolManifestFilingVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaConsolManifestFilingVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaConsolManifestFilingVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaConsolManifestFilingVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    code: ImportSeaConsolManifestFilingVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    isNew: false
                };
                ImportSeaConsolManifestFilingVltCtrl.currentConsol = obj;
                ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TableProperties = {
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
                // ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", three_consolidationConfig.Entities.Header.API.GetByID.Url + ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();