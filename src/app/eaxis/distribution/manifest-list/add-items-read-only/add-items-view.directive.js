(function () {
    "use strict";

    angular
        .module("Application")
        .directive("addItemsView", addItemsView);

    addItemsView.$inject = [];

    function addItemsView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/add-items-read-only/add-items-view.html",
            link: Link,
            controller: "AddItemsViewController",
            controllerAs: "AddItemsViewCtrl",
            scope: {
                currentManifest: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();


