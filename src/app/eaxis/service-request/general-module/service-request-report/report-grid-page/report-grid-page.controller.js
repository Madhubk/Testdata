(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReportGridPageController", ReportGridPageController);

    ReportGridPageController.$inject = ["$location", "helperService","param","$uibModalInstance"];
    function ReportGridPageController($location, helperService, param,$uibModalInstance) {
        var ReportGridPageCtrl = this,
            location = $location;

        function Init() {
            ReportGridPageCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            ReportGridPageCtrl.ePage.Masters.dataEntryDetails = param.Entity;
            ReportGridPageCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
        }
        function CloseEditActivity() {
            $uibModalInstance.dismiss("cancel");
        }
        Init();
    }
})();