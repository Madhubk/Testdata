(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdConfirmBuyerOrcEditDirectiveController", OrdConfirmBuyerOrcEditDirectiveController);

    OrdConfirmBuyerOrcEditDirectiveController.$inject = ["APP_CONSTANT", "errorWarningService", "myTaskActivityConfig"];

    function OrdConfirmBuyerOrcEditDirectiveController(APP_CONSTANT, errorWarningService, myTaskActivityConfig) {
        var OrdConfirmBuyerOrcEditDirectiveCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Confrimation_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": obj
            };

            OrderConfrimationInit();
        }

        function OrderConfrimationInit() {
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
            // error warning modal
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTaskEdit.Entity[OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTaskEdit.Entity[OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            // DatePicker
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["MyTaskEdit"],
                Code: [OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD",
                },
                GroupCode: "ORDER_CONFIRM",
                RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                }],
                EntityObject: OrdConfirmBuyerOrcEditDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();