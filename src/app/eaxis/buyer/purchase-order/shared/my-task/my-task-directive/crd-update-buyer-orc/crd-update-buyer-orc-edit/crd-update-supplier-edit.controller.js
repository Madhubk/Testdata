(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CrdUpdateSupplierEditDirectiveController", CrdUpdateSupplierEditDirectiveController);

    CrdUpdateSupplierEditDirectiveController.$inject = ["$q", "$timeout", "helperService", "APP_CONSTANT", "appConfig", "apiService", "toastr", "errorWarningService", "myTaskActivityConfig"];

    function CrdUpdateSupplierEditDirectiveController($q, $timeout, helperService, APP_CONSTANT, appConfig, apiService, toastr, errorWarningService, myTaskActivityConfig) {
        var CrdUpdateSupplierEditDirectiveCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            CrdUpdateSupplierEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "CRD_Update_Branch_Template",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            CRDInit();
        }

        function CRDInit() {
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
            // error warning modal
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTaskEdit.Entity[CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTaskEdit.Entity[CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            // DatePicker
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["MyTaskEdit"],
                Code: [CrdUpdateSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD",
                },
                GroupCode: "ORD_CRD",
                RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                }],
                EntityObject: CrdUpdateSupplierEditDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();