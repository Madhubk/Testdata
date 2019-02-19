/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolConfirmTranshipmentVltController", ImportSeaConsolConfirmTranshipmentVltController);

    ImportSeaConsolConfirmTranshipmentVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService"];

    function ImportSeaConsolConfirmTranshipmentVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService) {
        var ImportSeaConsolConfirmTranshipmentVltCtrl = this;

        function Init() {
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage = {
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

            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.emptyText = "-";
            if (ImportSeaConsolConfirmTranshipmentVltCtrl.taskObj) {
                ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.TaskObj = ImportSeaConsolConfirmTranshipmentVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;

                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    code: ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo,
                    isNew: false
                };
                ImportSeaConsolConfirmTranshipmentVltCtrl.currentConsol = obj;
                // ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];

            }
            // DatePicker
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.RefNumber = true;
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.TableProperties = {
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
            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.DropDownMasterList = {};

          
        }    

     
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                        console.log(ImportSeaConsolConfirmTranshipmentVltCtrl.ePage.Masters.EntityObj)
                    }
                });
            }
        }

        Init();
    }
})();