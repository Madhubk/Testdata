/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolConfirmArrivalVltController", ImportSeaConsolConfirmArrivalVltController);

    ImportSeaConsolConfirmArrivalVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ImportSeaConsolConfirmArrivalVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ImportSeaConsolConfirmArrivalVltCtrl = this;

        function Init() {
            ImportSeaConsolConfirmArrivalVltCtrl.ePage = {
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

            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaConsolConfirmArrivalVltCtrl.taskObj) {
                ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.TaskObj = ImportSeaConsolConfirmArrivalVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaConsolConfirmArrivalVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;

                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaConsolConfirmArrivalVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaConsolConfirmArrivalVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaConsolConfirmArrivalVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    code: ImportSeaConsolConfirmArrivalVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    isNew: false
                };
                ImportSeaConsolConfirmArrivalVltCtrl.currentConsol = obj;
                // ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];

            }
            // DatePicker
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.RefNumber = true;
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.TableProperties = {
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
                        "isenabled": false,
                        "property": "atd",
                        "position": "13",
                        "width": "200",
                        "display": true
                    },
                    {
                        "columnname": "ATA",
                        "isenabled": false,
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
                    "isenabled": false,
                    "position": "13",
                    "width": "200"
                },
                "ata": {
                    "isenabled": false,
                    "position": "14",
                    "width": "200"
                }
            }
            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.DropDownMasterList = {};

          
        }    

     
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log(ImportSeaConsolConfirmArrivalVltCtrl.ePage.Masters.EntityObj)
                    }
                });
            }
        }

        Init();
    }
})();