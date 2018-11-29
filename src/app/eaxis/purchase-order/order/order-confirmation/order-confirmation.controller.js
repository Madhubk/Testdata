(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderConfirmDirectiveController", OrderConfirmDirectiveController);

    OrderConfirmDirectiveController.$inject = ["$scope", "helperService", "APP_CONSTANT", "errorWarningService"];

    function OrderConfirmDirectiveController($scope, helperService, APP_CONSTANT, errorWarningService) {
        var OrderConfirmDirectiveCtrl = this;

        function Init() {
            OrderConfirmDirectiveCtrl.ePage = {
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
            OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker = {};
            OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrderConfirmDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            OrderConfirmDirectiveCtrl.ePage.Masters.OnChange = OnChange;
            OrderConfirmDirectiveCtrl.ePage.Masters.Mode = OrderConfirmDirectiveCtrl.mode;
            // error warning service
            if (OrderConfirmDirectiveCtrl.taskObj && OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }

            $scope.$watch('OrderConfirmDirectiveCtrl.list', function (newValue, oldValue) {
                OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader = newValue;
            }, true);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Checkbox(item, $index) {
            if (item.status) {
                OrderConfirmDirectiveCtrl.gridChange({
                    item: item
                });
            } else {
                if (OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                    OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0013', true, $index);
                    OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0014', true, $index);
                }
                OrderConfirmDirectiveCtrl.gridChange({
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
                Code: [OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo],
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
                EntityObject: OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OnChange(obj, $index, typeOfValue) {
            if ($index == 0) {
                OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.map(function (value, key) {
                    if (value.status && obj[typeOfValue] && !value[typeOfValue]) {
                        value[typeOfValue] = obj[typeOfValue];
                        (typeOfValue == "ConfirmNo") ? OnFieldValueChange('E0013'): OnFieldValueChange('E0014');
                    }
                });
            }
            if (!obj.status) {
                OnFieldValueChange('E0013,E0014');
            }
        }

        Init();
    }
})();