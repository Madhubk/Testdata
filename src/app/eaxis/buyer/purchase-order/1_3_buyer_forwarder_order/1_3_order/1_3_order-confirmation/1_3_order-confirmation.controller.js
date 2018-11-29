(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_OrderConfirmDirectiveController", one_three_OrderConfirmDirectiveController);

    one_three_OrderConfirmDirectiveController.$inject = ["$scope", "helperService", "APP_CONSTANT", "errorWarningService"];

    function one_three_OrderConfirmDirectiveController($scope, helperService, APP_CONSTANT, errorWarningService) {
        var one_three_OrderConfirmDirectiveCtrl = this;

        function Init() {
            one_three_OrderConfirmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "order_confirmation_directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitAction();
        }

        function InitAction() {
            // DatePicker
            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker = {};
            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.OnChange = OnChange;
            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.Mode = one_three_OrderConfirmDirectiveCtrl.mode;
            // error warning service
            if (one_three_OrderConfirmDirectiveCtrl.taskObj && one_three_OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                one_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                one_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[one_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                one_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[one_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }

            $scope.$watch('one_three_OrderConfirmDirectiveCtrl.list', function (newValue, oldValue) {
                one_three_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder = newValue;
            }, true);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Checkbox(item, $index) {
            if (item.status) {
                one_three_OrderConfirmDirectiveCtrl.gridChange({
                    item: item
                });
            } else {
                if (one_three_OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                    one_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', one_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E1020', true, $index);
                    one_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', one_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E1021', true, $index);
                }
                one_three_OrderConfirmDirectiveCtrl.gridChange({
                    item: item
                });
            }
        }

        function OnFieldValueChange(code, $index) {
            CommonErrorObjInput(code, $index);
        }

        function CommonErrorObjInput(errorCode, $index) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [one_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "CNR",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: one_three_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OnChange(obj, $index, typeOfValue) {
            if ($index == 0) {
                one_three_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.map(function (value, key) {
                    if (value.status && obj[typeOfValue] && !value[typeOfValue]) {
                        value[typeOfValue] = obj[typeOfValue];
                        (typeOfValue == "ConfirmNo") ? OnFieldValueChange('E1020'): OnFieldValueChange('E1021');
                    }
                });
            }
            if (!obj.status) {
                OnFieldValueChange('E1020,E1021');
            }
        }

        Init();
    }
})();