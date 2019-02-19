/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentChecklistVltController", ImportSeaShipmentChecklistVltController);

    ImportSeaShipmentChecklistVltController.$inject = ["$scope", "apiService", "helperService", "freightApiConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "$filter", "appConfig", "three_consolidationConfig"];

    function ImportSeaShipmentChecklistVltController($scope, apiService, helperService, freightApiConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, $filter, appConfig, three_consolidationConfig) {
        var ImportSeaShipmentChecklistVltCtrl = this;

        function Init() {
            ImportSeaShipmentChecklistVltCtrl.ePage = {
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

            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.emptyText = "-";
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            if (ImportSeaShipmentChecklistVltCtrl.taskObj) {
                ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentChecklistVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentChecklistVltCtrl.currentShipment = obj;
                ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
                if (ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIConShpMappings) {
                    GetConsolDetails();
                }

                getTaskConfigData();
                // ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DropDownMasterList = {};

        }
        function GetConsolDetails() {
            if (ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIConShpMappings) {
                ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (val, key) {
                    apiService.get("eAxisAPI", three_consolidationConfig.Entities.Header.API.GetByID.Url + ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data.UIConShpMappings[key].CON_FK).then(function (response) {
                        if (response.data.Response) {
                            ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.ConData= response.data.Response;
                        }
                    });
                });
            }
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_1"].API.listgetbyid.Url + ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentChecklistVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskConfigData;
                    ImportSeaShipmentChecklistVltCtrl.ePage.Masters.MenuListSource = $filter('filter')(ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ImportSeaShipmentChecklistVltCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        // DocumentValidation();
                    }
                    ImportSeaShipmentChecklistVltCtrl.ePage.Masters.MenuObj = ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj
                    ImportSeaShipmentChecklistVltCtrl.ePage.Masters.MenuObj.TabTitle = ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                        VLG_Code: ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode
                    },
                    GroupCode: ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    VLG_Code: ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode
                },
                GroupCode: ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaShipmentChecklistVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaShipmentChecklistVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentChecklistVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }

        Init();
    }
})();