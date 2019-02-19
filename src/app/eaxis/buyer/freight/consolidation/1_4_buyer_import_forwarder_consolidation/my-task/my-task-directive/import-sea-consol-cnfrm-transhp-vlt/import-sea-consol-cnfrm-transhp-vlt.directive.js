(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltconfirmtranshipment", BupVltConfirmTranshipment);

    function BupVltConfirmTranshipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_import_forwarder_consolidation/my-task/my-task-directive/import-sea-consol-cnfrm-transhp-vlt/import-sea-consol-cnfrm-transhp-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaConsolConfirmTranshipmentVltController",
            controllerAs: "ImportSeaConsolConfirmTranshipmentVltCtrl",
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
        .directive("importSeaConsolCnfrmTranshpVlt", ImportSeaConsolCnfrmTranshpVlt);

    function ImportSeaConsolCnfrmTranshpVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_import_forwarder_consolidation/my-task/my-task-directive/import-sea-consol-cnfrm-transhp-vlt/import-sea-consol-cnfrm-transhp-vlt-activity.html",
            link: Link,
            controller: "ImportSeaConsolConfirmTranshipmentVltController",
            controllerAs: "ImportSeaConsolConfirmTranshipmentVltCtrl",
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
