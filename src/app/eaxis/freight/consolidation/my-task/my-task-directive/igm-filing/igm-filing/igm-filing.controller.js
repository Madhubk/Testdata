/*
    Page : IGM Filing
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IGMFilingController", IGMFilingController);

    IGMFilingController.$inject = [];

    function IGMFilingController() {
        var IGMFilingDirCtrl = this;

        function Init() {
            IGMFilingDirCtrl.ePage = {
                "Title": "",
                "Prefix": "IGM_Filing",
                "Masters": {},
                "Meta": {},
                "Entities": {}
            };

            IGMFilingDirCtrl.ePage.Masters.emptyText = "-";
            IGMFilingDirCtrl.ePage.Masters.TaskObj = IGMFilingDirCtrl.taskObj;
        }

        Init();
    }
})();