/*
    Page :Custom Declaration
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentCustomDeclarationVltController", ImportSeaShipmentCustomDeclarationVltController);

    ImportSeaShipmentCustomDeclarationVltController.$inject = ["$scope", "apiService", "helperService", "freightApiConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "appConfig", "$filter"];

    function ImportSeaShipmentCustomDeclarationVltController($scope, apiService, helperService, freightApiConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, appConfig, $filter) {
        var ImportSeaShipmentCustomDeclarationVltCtrl = this;

        function Init() {
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage = {
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

            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.OnFieldValueChange1 = OnFieldValueChange1
            if (ImportSeaShipmentCustomDeclarationVltCtrl.taskObj) {
                ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentCustomDeclarationVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentCustomDeclarationVltCtrl.currentShipment = obj;
                ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
                getTaskConfigData();

            }
            // DatePicker
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DropDownMasterList = {};

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_1"].API.listgetbyid.Url + ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskConfigData;
                    ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.MenuListSource = $filter('filter')(ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        // DocumentValidation();
                    }
                    ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.MenuObj = ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj
                    ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.MenuObj.TabTitle = ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }
        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }


        function OnFieldValueChange1(code) {
            var _obj = {
                ModuleName: [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: [],
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: ['EV11013', 'EV11025']
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentCustomDeclarationVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }


        Init();
    }
})();