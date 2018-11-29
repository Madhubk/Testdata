(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingGridDirectiveController", ConvertBookingGridDirectiveController);

    ConvertBookingGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "$window"];

    function ConvertBookingGridDirectiveController($scope, APP_CONSTANT, apiService, appConfig, helperService, toastr, $window) {
        var ConvertBookingGridDirectiveCtrl = this;

        function Init() {
            ConvertBookingGridDirectiveCtrl.ePage = {
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

            ConvertBookingGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function InitFollowUpGrid() {
            ConvertBookingGridDirectiveCtrl.ePage.Masters.ViewType = 1;
            // DatePicker
            ConvertBookingGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            ConvertBookingGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConvertBookingGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConvertBookingGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConvertBookingGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            ConvertBookingGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('ConvertBookingGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                ConvertBookingGridDirectiveCtrl.ePage.Masters.BookingList = newValue;
            }, true);
        }

        function Checkbox(item) {
            ConvertBookingGridDirectiveCtrl.gridChange({
                item: item
            });
        }

        Init();
    }
})();