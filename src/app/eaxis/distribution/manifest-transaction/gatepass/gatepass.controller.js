(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GatePassController", GatePassController);

    GatePassController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "manifestTransConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation"];

    function GatePassController($scope, $timeout, APP_CONSTANT, apiService, manifestTransConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation) {
        var GatePassCtrl = this

        function Init() {

            var currentGatePass = GatePassCtrl.currentGatePass[GatePassCtrl.currentGatePass.label].ePage.Entities;

            GatePassCtrl.ePage = {
                "Title": "",
                "Prefix": "ManifestTrans_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatePass
            };

            // DatePicker
            GatePassCtrl.ePage.Masters.DatePicker = {};
            GatePassCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            GatePassCtrl.ePage.Masters.DatePicker.isOpen = [];
            GatePassCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
           
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            GatePassCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        Init();
    }

})();