(function () {
    "use strict";

    angular
        .module("Application")
        .directive("addressDirectives", AddressDirective);

    AddressDirective.$inject = [];

    function AddressDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/shared/address-directive/address-directive.html",
            link: Link,
            controller: "addressDirectiveController",
            controllerAs: "addressDirectiveCtrl",
            scope: {
                currentObj: "=",
                entitysource:"@"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
