(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingSupplierGridDirectiveController", ConvertBookingSupplierGridDirectiveController);

    ConvertBookingSupplierGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "helperService"];

    function ConvertBookingSupplierGridDirectiveController($scope, APP_CONSTANT, helperService) {
        var ConvertBookingSupplierGridDirectiveCtrl = this;

        function Init() {
            ConvertBookingSupplierGridDirectiveCtrl.ePage = {
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

            ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitFollowUpGrid() {
            ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.ViewType = 1;
            // DatePicker
            ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            ConvertBookingSupplierGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('ConvertBookingSupplierGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                ConvertBookingSupplierGridDirectiveCtrl.ePage.Masters.BookingList = newValue;
            }, true);
        }

        function Checkbox(item) {
            ConvertBookingSupplierGridDirectiveCtrl.gridChange({
                item: item
            });
        }

        Init();
    }
})();