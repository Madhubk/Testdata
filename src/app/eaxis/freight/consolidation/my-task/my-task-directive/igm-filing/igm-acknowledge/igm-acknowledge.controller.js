/*
    Page : IGM Acknowledge
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IGMAcknowledgementController", IGMAcknowledgementController);

    IGMAcknowledgementController.$inject = [];

    function IGMAcknowledgementController() {
        var IGMAcknowledgementDirCtrl = this;

        function Init() {
            IGMAcknowledgementDirCtrl.ePage = {
                "Title": "",
                "Prefix": "IGM_Acknowledge",
                "Masters": {},
                "Meta": {},
                "Entities": {}
            };

            IGMAcknowledgementDirCtrl.ePage.Masters.emptyText = "-";
            IGMAcknowledgementDirCtrl.ePage.Masters.TaskObj = IGMAcknowledgementDirCtrl.taskObj;
        }

        Init();
    }
})();