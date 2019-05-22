(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackingTab", TrackingTab);

    TrackingTab.$inject = [];

    function TrackingTab() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/tracking-tab/tracking-tab.html",
            link: Link,
            controller: "TrackingTabController",
            controllerAs: "TrackingTabCtrl",
            scope: {
                currentManifest: "=",
                isShowFooter: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();