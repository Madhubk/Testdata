/*
    Page : Verify PreAlert
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifyPreAlertController", VerifyPreAlertController);

    VerifyPreAlertController.$inject = [];

    function VerifyPreAlertController() {
        var VerifyPreAlertDirCtrl = this;

        function Init() {
            VerifyPreAlertDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Verify_Pre_Alert",
                "Masters": {},
                "Meta": {},
                "Entities": {}
            };

            VerifyPreAlertDirCtrl.ePage.Masters.emptyText = "-";
            VerifyPreAlertDirCtrl.ePage.Masters.TaskObj = VerifyPreAlertDirCtrl.taskObj;
        }

        Init();
    }
})();