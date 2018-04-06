(function () {
    "use strict";

    angular
        .module("Application")
        .directive("quickView", ConsolQuickView)
        .directive("quickViewTest", ConsolQuickViewTest);

    ConsolQuickView.$inject = [];
    ConsolQuickViewTest.$inject = [];

    function ConsolQuickView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/quickview/quickview.html",
            link: Link,
            controller: "QuickViewController",
            controllerAs: "QuickViewCtrl",
            scope: {
                obj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
      function ConsolQuickViewTest() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/quickview/quickview1.html",
            link: Link,
            controller: "QuickViewController",
            controllerAs: "QuickViewCtrl",
            scope: {
                obj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
