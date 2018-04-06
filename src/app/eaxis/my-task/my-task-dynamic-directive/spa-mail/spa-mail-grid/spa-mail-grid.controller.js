(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SPAMailGridDirectiveController", SPAMailGridDirectiveController);

    SPAMailGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "$window"];

    function SPAMailGridDirectiveController($scope, APP_CONSTANT, apiService, appConfig, helperService, toastr, $window) {
        var SPAMailGridDirectiveCtrl = this;

        function Init() {
            SPAMailGridDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SPA_Mail_Grid",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };        

            InitFollowUpGrid();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SPAMailGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function InitFollowUpGrid() {
            SPAMailGridDirectiveCtrl.ePage.Masters.ViewType = 1;  
            // DatePicker
            SPAMailGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            SPAMailGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SPAMailGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SPAMailGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            SPAMailGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            SPAMailGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('SPAMailGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                SPAMailGridDirectiveCtrl.ePage.Masters.SPAOrderList = newValue;
            }, true);
        }
        
        function Checkbox(item) {
            SPAMailGridDirectiveCtrl.gridChange({ item: item });
        }

        Init();
    }
})();
