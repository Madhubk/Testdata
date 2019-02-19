/*
    Page :Manifest
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolManifestFilingVltController", ImportSeaConsolManifestFilingVltController);

    ImportSeaConsolManifestFilingVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "three_consolidationConfig", "$filter"];

    function ImportSeaConsolManifestFilingVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, three_consolidationConfig, $filter) {
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
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;           
            if (ImportSeaConsolManifestFilingVltCtrl.taskObj) {
                ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj = ImportSeaConsolManifestFilingVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
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
                getTaskConfigData();
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
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskConfigData;
                    ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.MenuListSource = $filter('filter')(ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        //  DocumentValidation();
                    }
                    ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.MenuObj = ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj
                    ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.MenuObj.TabTitle = ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Validation",
                    FilterInput: {
                        ModuleCode: "CON",
                        SubModuleCode: "CON",
                        Code: "EV11001,EV11003",
                        VLG_Code: ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode
                    },
                    GroupCode: ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ImportSeaConsolManifestFilingVltCtrl.ePage.Entities.Header.Data
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }
        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "CON",
                    SubModuleCode: "CON",
                    Code: "EV11001,EV11003",
                    VLG_Code: ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode
                },
                GroupCode: ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaConsolManifestFilingVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaConsolManifestFilingVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }


        Init();
    }
})();