/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentForwarderInvoiceVltController", ImportSeaShipmentForwarderInvoiceVltController);

    ImportSeaShipmentForwarderInvoiceVltController.$inject = ["$scope", "apiService", "helperService", "freightApiConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "$filter", "appConfig"];

    function ImportSeaShipmentForwarderInvoiceVltController($scope, apiService, helperService, freightApiConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, $filter, appConfig) {
        var ImportSeaShipmentForwarderInvoiceVltCtrl = this;

        function Init() {
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage = {
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

            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.emptyText = "-";
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.CurrentDate = new Date();
            if (ImportSeaShipmentForwarderInvoiceVltCtrl.taskObj) {
                ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentForwarderInvoiceVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentForwarderInvoiceVltCtrl.currentShipment = obj;
                ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
                ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.ForwarderInvCompleteDate = ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.CurrentDate;
                getTaskConfigData();

                // ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.RefNumber = true;

            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DropDownMasterList = {};

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_1"].API.listgetbyid.Url + ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskConfigData;
                    ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.MenuListSource = $filter('filter')(ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        // DocumentValidation();
                    }
                    ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.MenuObj = ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj
                    ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.MenuObj.TabTitle = ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentForwarderInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }
        

        Init();
    }
})();