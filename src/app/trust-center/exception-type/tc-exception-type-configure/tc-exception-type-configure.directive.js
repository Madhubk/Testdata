(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tcExceptionTypeConfigure", TCExceptionTypeConfigure);

    TCExceptionTypeConfigure.$inject = [];

    function TCExceptionTypeConfigure() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/exception-type/tc-exception-type-configure/tc-exception-type-configure.html",
            link: Link,
            controller: "TCExceptionTypeConfigureController",
            controllerAs: "TCExceptionTypeConfigureCtrl",
            scope: {
                currentExceptionType: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
