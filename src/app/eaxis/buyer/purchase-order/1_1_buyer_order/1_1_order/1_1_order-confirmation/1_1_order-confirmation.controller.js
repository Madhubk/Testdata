(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrderConfirmDirectiveController", one_one_OrderConfirmDirectiveController);

    one_one_OrderConfirmDirectiveController.$inject = ["$scope", "helperService", "APP_CONSTANT", "errorWarningService"];

    function one_one_OrderConfirmDirectiveController($scope, helperService, APP_CONSTANT, errorWarningService) {
        var one_one_OrderConfirmDirectiveCtrl = this;

        function Init() {
            one_one_OrderConfirmDirectiveCtrl.ePage = {
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
            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker = {};
            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.OnChange = OnChange;
            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.Mode = one_one_OrderConfirmDirectiveCtrl.mode;
            // error warning service
            if (one_one_OrderConfirmDirectiveCtrl.taskObj && one_one_OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                one_one_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                one_one_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[one_one_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                one_one_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[one_one_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }

            $scope.$watch('one_one_OrderConfirmDirectiveCtrl.list', function (newValue, oldValue) {
                one_one_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer = newValue;
            }, true);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            one_one_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Checkbox(item, $index) {
            if (item.status) {
                one_one_OrderConfirmDirectiveCtrl.gridChange({
                    item: item
                });
            } else {
                if (one_one_OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                    one_one_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', one_one_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E1020', true, $index);
                    one_one_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', one_one_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E1021', true, $index);
                }
                one_one_OrderConfirmDirectiveCtrl.gridChange({
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
                Code: [one_one_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo],
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
                EntityObject: one_one_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OnChange(obj, $index, typeOfValue) {
            if ($index == 0) {
                one_one_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.map(function (value, key) {
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