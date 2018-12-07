(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupLineController", PickupLineController);

    PickupLineController.$inject = ["$location", "helperService"];
    function PickupLineController($location,helperService) {
        var PickupLineCtrl = this,
            location = $location;

        function Init() {
            PickupLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            PickupLineCtrl.ePage.Masters.dataentryName = "PickupLine";
        }
        Init();
    }
})();