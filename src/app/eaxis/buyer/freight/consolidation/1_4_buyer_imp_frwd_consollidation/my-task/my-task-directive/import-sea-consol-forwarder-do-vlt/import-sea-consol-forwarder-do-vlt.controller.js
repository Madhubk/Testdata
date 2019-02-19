/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaConsolForwarderDoVltController", ImportSeaConsolForwarderDoVltController);

    ImportSeaConsolForwarderDoVltController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "three_consolidationConfig", "$filter"];

    function ImportSeaConsolForwarderDoVltController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, three_consolidationConfig, $filter) {
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
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.OnFieldValueChange1 = OnFieldValueChange1;
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
                ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
                getTaskConfigData();
                if (ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.DODate == null) {
                    $scope.date = new Date();
                    ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data.UIConsolExtendedInfo.DODate = $scope.date;
                }

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
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskConfigData;
                    ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.MenuListSource = $filter('filter')(ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        // DocumentValidation();
                    }
                    ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.MenuObj = ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj
                    ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.MenuObj.TabTitle = ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "CON",
                        SubModuleCode: "CON"
                    },
                    GroupCode: ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "CON",
                    SubModuleCode: "CON"
                },
                GroupCode: ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }
        function OnFieldValueChange1(code) {
            var _obj = {
                ModuleName: [ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "CON",
                    SubModuleCode: "CON"
                },
                GroupCode: [],
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaConsolForwarderDoVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: ['EV11004','EV11005']
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaConsolForwarderDoVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }
        Init();
    }
})();