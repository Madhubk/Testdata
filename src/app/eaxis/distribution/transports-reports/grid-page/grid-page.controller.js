(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GridPageController", GridPageController);

    GridPageController.$inject = ["$location", "helperService","param","$uibModalInstance"];
    function GridPageController($location, helperService, param,$uibModalInstance) {
        var GridPageCtrl = this,
            location = $location;

        function Init() {
            GridPageCtrl.ePage = {
                "Title": "",
                "Prefix": "Report_Grid",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            GridPageCtrl.ePage.Masters.dataEntryDetails = param.Entity;
            GridPageCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
        }
        function CloseEditActivity() {
            $uibModalInstance.dismiss("cancel");
        }
        Init();
    }
})();