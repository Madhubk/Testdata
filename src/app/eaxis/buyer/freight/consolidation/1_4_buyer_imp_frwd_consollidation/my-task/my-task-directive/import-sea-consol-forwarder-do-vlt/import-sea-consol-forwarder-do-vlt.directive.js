(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltforwarderdo", BupVltForwarderDo)        
        .directive("importSeaConsolForwarderDoVlt", ImportSeaConsolForwarderDoVlt);

    function BupVltForwarderDo() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-forwarder-do-vlt/import-sea-consol-forwarder-do-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaConsolForwarderDoVltController",
            controllerAs: "ImportSeaConsolForwarderDoVltCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return exports;
        function Link(scope, elem, attr) { }

    }

    function ImportSeaConsolForwarderDoVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/my-task-directive/import-sea-consol-forwarder-do-vlt/import-sea-consol-forwarder-do-vlt-activity.html",
            link: Link,
            controller: "ImportSeaConsolForwarderDoVltController",
            controllerAs: "ImportSeaConsolForwarderDoVltCtrl",
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
