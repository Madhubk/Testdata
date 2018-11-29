(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrderConfirmDirectiveController", three_three_OrderConfirmDirectiveController);

    three_three_OrderConfirmDirectiveController.$inject = ["$scope", "helperService", "APP_CONSTANT", "errorWarningService"];

    function three_three_OrderConfirmDirectiveController($scope, helperService, APP_CONSTANT, errorWarningService) {
        var three_three_OrderConfirmDirectiveCtrl = this;

        function Init() {
            three_three_OrderConfirmDirectiveCtrl.ePage = {
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
            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker = {};
            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.OnChange = OnChange;
            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.Mode = three_three_OrderConfirmDirectiveCtrl.mode;
            // error warning service
            if (three_three_OrderConfirmDirectiveCtrl.taskObj && three_three_OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                three_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                three_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[three_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                three_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[three_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo];
            }

            $scope.$watch('three_three_OrderConfirmDirectiveCtrl.list', function (newValue, oldValue) {
                three_three_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder = newValue;
            }, true);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            three_three_OrderConfirmDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Checkbox(item, $index) {
            if (item.status) {
                three_three_OrderConfirmDirectiveCtrl.gridChange({
                    item: item
                });
            } else {
                if (three_three_OrderConfirmDirectiveCtrl.ePage.Masters.Mode == '1') {
                    three_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', three_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0013', true, $index);
                    three_three_OrderConfirmDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', three_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0014', true, $index);
                }
                three_three_OrderConfirmDirectiveCtrl.gridChange({
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
                Code: [three_three_OrderConfirmDirectiveCtrl.taskObj.PSI_InstanceNo],
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
                EntityObject: three_three_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OnChange(obj, $index, typeOfValue) {
            if ($index == 0) {
                three_three_OrderConfirmDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.map(function (value, key) {
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