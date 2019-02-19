/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolConfirmRailoutVltController", ImportSeaConsolConfirmRailoutVltController);

    ImportSeaConsolConfirmRailoutVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService","three_consolidationConfig"];

    function ImportSeaConsolConfirmRailoutVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService,three_consolidationConfig) {
        var ImportSeaConsolConfirmRailoutVltCtrl = this;

        function Init() {
            ImportSeaConsolConfirmRailoutVltCtrl.ePage = {
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

            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaConsolConfirmRailoutVltCtrl.taskObj) {
                ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.TaskObj = ImportSeaConsolConfirmRailoutVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaConsolConfirmRailoutVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;

                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaConsolConfirmRailoutVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaConsolConfirmRailoutVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaConsolConfirmRailoutVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    code: ImportSeaConsolConfirmRailoutVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    isNew: false
                };
                ImportSeaConsolConfirmRailoutVltCtrl.currentConsol = obj;
                // ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];

            }
            // DatePicker
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.RefNumber = true;
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.TableProperties = {
                "HeaderProperties": [
                    {
                        "columnname": "T.Mode",
                        "isenabled": true,
                        "property": "mode",
                        "position": "4",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "LoadPort",
                        "isenabled": true,
                        "property": "pol",
                        "position": "9",
                        "width": "200",
                        "display": true
                    },
                    {
                        "columnname": "DischargePort",
                        "isenabled": true,
                        "property": "pod",
                        "position": "10",
                        "width": "200",
                        "display": true
                    },
                    {
                        "columnname": "ETD",
                        "isenabled": true,
                        "property": "etd",
                        "position": "11",
                        "width": "200",
                        "display": true
                    },
                    {
                        "columnname": "ETA",
                        "isenabled": true,
                        "property": "eta",
                        "position": "12",
                        "width": "200",
                        "display": true
                    },
                    {
                        "columnname": "ATD",
                        "isenabled": true,
                        "property": "atd",
                        "position": "13",
                        "width": "200",
                        "display": true
                    },
                    {
                        "columnname": "ATA",
                        "isenabled": true,
                        "property": "ata",
                        "position": "14",
                        "width": "200",
                        "display": true
                    }
                ]
                ,
                "mode": {
                    "isenabled": true,
                    "position": "4",
                    "width": "120"
                },
                "pol": {
                    "isenabled": true,
                    "position": "9",
                    "width": "200"
                },
                "pod": {
                    "isenabled": true,
                    "position": "10",
                    "width": "200"
                },
                "etd": {
                    "isenabled": true,
                    "position": "11",
                    "width": "200"
                },
                "eta": {
                    "isenabled": true,
                    "position": "12",
                    "width": "200"
                },
                "atd": {
                    "isenabled": true,
                    "position": "13",
                    "width": "200"
                },
                "ata": {
                    "isenabled": true,
                    "position": "14",
                    "width": "200"
                }
            }
            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.DropDownMasterList = {};

          
        }    

     
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", three_consolidationConfig.Entities.Header.API.GetByID.Url + ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaConsolConfirmRailoutVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();