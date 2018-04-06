(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dcDepotStore", DcDepotStore);

    DcDepotStore.$inject = [];

    function DcDepotStore() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/dc-depot-store/dc-depot-store.html",
            link: Link,
            controller: "DcDepotStoreController",
            controllerAs: "DcDepotStoreCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();