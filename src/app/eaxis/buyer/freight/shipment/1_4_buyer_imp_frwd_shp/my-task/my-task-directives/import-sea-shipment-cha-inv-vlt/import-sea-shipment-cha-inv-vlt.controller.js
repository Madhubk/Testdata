/*
    Page :Si Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImportSeaShipmentChaInvoiceVltController", ImportSeaShipmentChaInvoiceVltController);

    ImportSeaShipmentChaInvoiceVltController.$inject = ["$scope", "apiService", "helperService", "freightApiConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService", "errorWarningService", "$filter", "appConfig"];

    function ImportSeaShipmentChaInvoiceVltController($scope, apiService, helperService, freightApiConfig, myTaskActivityConfig, APP_CONSTANT, authService, errorWarningService, $filter, appConfig) {
        var ImportSeaShipmentChaInvoiceVltCtrl = this;

        function Init() {
            ImportSeaShipmentChaInvoiceVltCtrl.ePage = {
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

            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.emptyText = "-";
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data.UICustomEntity=[];
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.CurrentDate = new Date();
            if (ImportSeaShipmentChaInvoiceVltCtrl.taskObj) {
                ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj = ImportSeaShipmentChaInvoiceVltCtrl.taskObj;
                GetEntityObj();
            } else {
                ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data
                        }
                    }
                };
                var obj = {
                    [ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    code: ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    isNew: false
                };
                ImportSeaShipmentChaInvoiceVltCtrl.currentShipment = obj;
                ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
                getTaskConfigData();
                ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.CHAInvCompleteDate = ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.CurrentDate;

                ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.CustomFields=ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data.UICustomEntity;
                console.log(ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.CustomFields.CustomDecimalIII)
                // ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Consol.label];
            }
            // DatePicker
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker = {};
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_1"].API.listgetbyid.Url + ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskConfigData;
                    ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.MenuListSource = $filter('filter')(ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ValidationSource = $filter('filter')(ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        // DocumentValidation();
                    }
                    ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.MenuObj = ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj
                    ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.MenuObj.TabTitle = ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.KeyReference;

                }
            });
        }

        function ValidationFindall() {
            if (ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: [ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                Code: [ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: ImportSeaShipmentChaInvoiceVltCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
            ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[ImportSeaShipmentChaInvoiceVltCtrl.ePage.Masters.TaskObj.WSI_StepCode];

        }


        Init();
    }
})();