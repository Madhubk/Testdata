(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PendingPickupController", PendingPickupController);

    PendingPickupController.$inject = ["$location", "helperService"];
    function PendingPickupController($location,helperService) {
        var PendingPickupCtrl = this,
            location = $location;

        function Init() {
            PendingPickupCtrl.ePage = {
                "Title": "",
                "Prefix": "PendingPickup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            PendingPickupCtrl.ePage.Masters.dataentryName = "PickupLine";
        }
        Init();
    }
})();