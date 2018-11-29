/*
    Page : Prepare HBL 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ObtainDestuffController", ObtainDestuffController);

    ObtainDestuffController.$inject = [];

    function ObtainDestuffController() {
        var ObtainDestuffDirCtrl = this;

        function Init() {
            ObtainDestuffDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Obtain_Destuff",
                "Masters": {},
                "Meta": {},
                "Entities": {}
            };

            ObtainDestuffDirCtrl.ePage.Masters.emptyText = "-";
            ObtainDestuffDirCtrl.ePage.Masters.TaskObj = ObtainDestuffDirCtrl.taskObj;
        }

        Init();
    }
})();