
/*
Page: ICD Clearance
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IcdClearanceController", IcdClearanceController);

    IcdClearanceController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function IcdClearanceController(helperService) {
        var IcdClearanceCtrl = this;

        function Init() {
            
            IcdClearanceCtrl.ePage = {
                "Title": "",
                "Prefix": "CUS_CLEARANCE",
                "Masters": {},
                "Meta":{},
                "Entities": {}
            };

            IcdClearanceCtrl.ePage.Masters.emptyText = "-";
            IcdClearanceCtrl.ePage.Masters.TaskObj = IcdClearanceCtrl.taskObj;
        }

        Init();
    }
})();