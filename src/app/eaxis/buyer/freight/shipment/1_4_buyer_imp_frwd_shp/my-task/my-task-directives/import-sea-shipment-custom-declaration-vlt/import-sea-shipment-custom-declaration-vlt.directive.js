(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltcustomdeclaration", BupVltCustomDeclaration);

    function BupVltCustomDeclaration() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-custom-declaration-vlt/import-sea-shipment-custom-declaration-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaShipmentCustomDeclarationVltController",
            controllerAs: "ImportSeaShipmentCustomDeclarationVltCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return exports;
        function Link(scope, elem, attr) { }

    }

    angular
        .module("Application")
        .directive("importSeaShipmentCustomDeclarationVlt", ImportSeaShipmentCustomDeclarationVlt);

    function ImportSeaShipmentCustomDeclarationVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-custom-declaration-vlt/import-sea-shipment-custom-declaration-vlt-activity.html",
            link: Link,
            controller: "ImportSeaShipmentCustomDeclarationVltController",
            controllerAs: "ImportSeaShipmentCustomDeclarationVltCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
