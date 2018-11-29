(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentMyTaskController", ShipmentMyTaskController);

    ShipmentMyTaskController.$inject = ["helperService"];

    function ShipmentMyTaskController(helperService) {
        /* jshint validthis: true */
        var ShipmentMyTaskCtrl = this;

        function Init() {
            var currentObj = ShipmentMyTaskCtrl.currentShipment[ShipmentMyTaskCtrl.currentShipment.label].ePage.Entities;

            ShipmentMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            ShipmentMyTaskCtrl.ePage.Masters.MyTask = {};

            if (ShipmentMyTaskCtrl.listSource) {
                ShipmentMyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(ShipmentMyTaskCtrl.listSource);
            } else {
                ShipmentMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
            }
        }

        Init();
    }
})();
