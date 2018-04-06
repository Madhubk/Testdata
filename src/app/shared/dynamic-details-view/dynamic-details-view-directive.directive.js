(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicDetailsView", DynamicDetailsViewDirective);

    DynamicDetailsViewDirective.$inject = [];

    function DynamicDetailsViewDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/dynamic-details-view/dynamic-details-view-directive.html",
            controller: "DynamicDetailsViewDirectiveController",
            controllerAs: "DynamicDetailsViewDirectiveCtrl",
            scope: {
                dataentryName: "=",
                pkey: "=",
                mode: "=",
                defaultFilter: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
