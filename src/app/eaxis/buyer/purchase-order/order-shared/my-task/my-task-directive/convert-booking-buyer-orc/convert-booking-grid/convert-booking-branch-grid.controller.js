(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingBranchGridDirectiveController", ConvertBookingBranchGridDirectiveController);

    ConvertBookingBranchGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "helperService"];

    function ConvertBookingBranchGridDirectiveController($scope, APP_CONSTANT, helperService) {
        var ConvertBookingBranchGridDirectiveCtrl = this;

        function Init() {
            ConvertBookingBranchGridDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "CTB_Mail_Grid",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitFollowUpGrid();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitFollowUpGrid() {
            ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.ViewType = 1;
            // DatePicker
            ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            ConvertBookingBranchGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('ConvertBookingBranchGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                ConvertBookingBranchGridDirectiveCtrl.ePage.Masters.BookingList = newValue;
            }, true);
        }

        function Checkbox(item) {
            ConvertBookingBranchGridDirectiveCtrl.gridChange({
                item: item
            });
        }

        Init();
    }
})();