/*
    Page : FollowUp Empty Bond
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmptyBondController", EmptyBondController);

    EmptyBondController.$inject = [];

    function EmptyBondController() {
        var EmptyBondDirCtrl = this;

        function Init() {
            EmptyBondDirCtrl.ePage = {
                "Title": "",
                "Prefix": "FollowUp Empty Bond",
                "Masters": {},
                "Meta": {},
                "Entities": {}
            };

            EmptyBondDirCtrl.ePage.Masters.emptyText = "-";
            EmptyBondDirCtrl.ePage.Masters.TaskObj = EmptyBondDirCtrl.taskObj;
        }

        Init();
    }
})();