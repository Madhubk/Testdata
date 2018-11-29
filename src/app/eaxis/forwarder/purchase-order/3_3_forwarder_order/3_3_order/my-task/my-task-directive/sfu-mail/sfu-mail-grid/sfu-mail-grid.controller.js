(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SFUMailGridDirectiveController", SFUMailGridDirectiveController);

    SFUMailGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "$window"];

    function SFUMailGridDirectiveController($scope, APP_CONSTANT, apiService, appConfig, helperService, toastr, $window) {
        var SFUMailGridDirectiveCtrl = this;

        function Init() {
            SFUMailGridDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail_Grid",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitFollowUpGrid();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SFUMailGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitFollowUpGrid() {
            SFUMailGridDirectiveCtrl.ePage.Masters.ViewType = 1;
            // DatePicker
            SFUMailGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            SFUMailGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SFUMailGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SFUMailGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            SFUMailGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            SFUMailGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('SFUMailGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                SFUMailGridDirectiveCtrl.ePage.Masters.SfuOrderList = newValue;
            }, true);
        }

        function Checkbox(item) {
            SFUMailGridDirectiveCtrl.gridChange({
                item: item
            });
        }

        Init();
    }
})();