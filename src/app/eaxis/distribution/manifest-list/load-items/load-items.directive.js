(function () {
    "use strict";

    angular
        .module("Application")
        .directive("loadItems", LoadItems);

    LoadItems.$inject = [];

    function LoadItems() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/load-items/load-items.html",
            link: Link,
            controller: "LoadItemsController",
            controllerAs: "LoadItemsCtrl",
            scope: {
                currentManifest: "=",
                orgfk: "=",
                jobfk:"=",
                isShowFooter:"=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();