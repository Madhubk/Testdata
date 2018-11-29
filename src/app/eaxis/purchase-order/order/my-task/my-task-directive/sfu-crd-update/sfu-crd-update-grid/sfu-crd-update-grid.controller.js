(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SFUUpdateGridDirectiveController", SFUUpdateGridDirectiveController);

    SFUUpdateGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "helperService", "errorWarningService"];

    function SFUUpdateGridDirectiveController($scope, APP_CONSTANT, helperService, errorWarningService) {
        var SFUUpdateGridDirectiveCtrl = this;

        function Init() {
            SFUUpdateGridDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail_Grid",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitFollowUpGrid();
        }

        function InitFollowUpGrid() {
            SFUUpdateGridDirectiveCtrl.ePage.Masters.ViewType = 1;
            // DatePicker
            SFUUpdateGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            SFUUpdateGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SFUUpdateGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SFUUpdateGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            SFUUpdateGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            SFUUpdateGridDirectiveCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            SFUUpdateGridDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            SFUUpdateGridDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[SFUUpdateGridDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            SFUUpdateGridDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[SFUUpdateGridDirectiveCtrl.taskObj.PSI_InstanceNo];

            $scope.$watch('SFUUpdateGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                SFUUpdateGridDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader = newValue;
            }, true);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SFUUpdateGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Checkbox(item) {
            SFUUpdateGridDirectiveCtrl.gridChange({
                item: item
            });
        }

        function OnFieldValueChange(code, $index) {
            CommonErrorObjInput(code, $index);
        }

        function CommonErrorObjInput(errorCode, $index) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [SFUUpdateGridDirectiveCtrl.taskObj.PSI_InstanceNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "CRD",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: SFUUpdateGridDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();