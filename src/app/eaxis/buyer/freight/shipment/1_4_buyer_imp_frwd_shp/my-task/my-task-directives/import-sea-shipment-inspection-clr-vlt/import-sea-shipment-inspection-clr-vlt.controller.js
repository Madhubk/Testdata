/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentCustomInspectionVltController", ImportSeaShipmentCustomInspectionVltController);

    ImportSeaShipmentCustomInspectionVltController.$inject = ["$scope", "apiService", "helperService", "freightApiConfig", "myTaskActivityConfig", "$filter", "APP_CONSTANT", "authService", "errorWarningService", "appConfig"];

    function ImportSeaShipmentCustomInspectionVltController($scope, apiService, helperService, freightApiConfig, myTaskActivityConfig, $filter, APP_CONSTANT, authService, errorWarningService, appConfig) {
        var ImportSeaShipmentCustomInspectionVltCtrl = this;

        function Init() {
            ImportSeaShipmentCustomInspectionVltCtrl.ePage = {
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

            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            if (ImportSeaShipmentCustomInspectionVltCtrl.taskObj) {
                ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentCustomInspectionVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentCustomInspectionVltCtrl.currentShipment = obj;
                ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
                getTaskConfigData();


            }
            // DatePicker
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.RefNumber = true;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_1"].API.listgetbyid.Url + ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EEM_Code_3": EEM_Code_3,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskConfigData;
                    ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.MenuListSource = $filter('filter')(ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        // DocumentValidation();
                    }
                    ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.MenuObj = ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj
                    ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.MenuObj.TabTitle = ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }
   
        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaShipmentCustomInspectionVltCtrl.ePage.Entities.Header.Data,
                ErrorCode:['EV11015','EV11016','EV11017','EV11018','EV11019','EV11028','EV11020','EV11029']
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentCustomInspectionVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }


        Init();
    }
})();