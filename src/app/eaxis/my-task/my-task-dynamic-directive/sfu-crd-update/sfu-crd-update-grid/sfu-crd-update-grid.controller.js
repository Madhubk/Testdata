(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SFUUpdateGridDirectiveController", SFUUpdateGridDirectiveController);

    SFUUpdateGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "orderConfig", "$window"];

    function SFUUpdateGridDirectiveController($scope, APP_CONSTANT, apiService, appConfig, helperService, toastr, orderConfig, $window) {
        var SFUUpdateGridDirectiveCtrl = this;

        function Init() {
            SFUUpdateGridDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail_Grid",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
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
            SFUUpdateGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('SFUUpdateGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                SFUUpdateGridDirectiveCtrl.ePage.Masters.SfuOrderList = newValue;
            }, true);
        }
        
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SFUUpdateGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function Checkbox(item) {
            SFUUpdateGridDirectiveCtrl.gridChange({ item: item });
        }

        Init();
    }
})();
