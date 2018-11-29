(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CrdUpdateBranchEditDirectiveController", CrdUpdateBranchEditDirectiveController);

    CrdUpdateBranchEditDirectiveController.$inject = ["$q", "$scope", "$timeout", "helperService", "APP_CONSTANT", "appConfig", "apiService", "toastr", "errorWarningService", "myTaskActivityConfig"];

    function CrdUpdateBranchEditDirectiveController($q, $scope, $timeout, helperService, APP_CONSTANT, appConfig, apiService, toastr, errorWarningService, myTaskActivityConfig) {
        var CrdUpdateBranchEditDirectiveCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            CrdUpdateBranchEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "CRD_Update_Branch_Template",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            CRDInit();
        }

        function CRDInit() {
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
            // error warning modal
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTaskEdit.Entity[CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTaskEdit.Entity[CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            // DatePicker
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["MyTaskEdit"],
                Code: [CrdUpdateBranchEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
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
                EntityObject: CrdUpdateBranchEditDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();