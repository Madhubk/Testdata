(function () {
    "use strict";

    angular.module("Application")
        .directive("glaccountGeneral", GLaccountGeneral);

        GLaccountGeneral.$inject = [];

    function GLaccountGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/glaccount/glaccount-general/glaccount-general.html",
            link: Link,
            controller: "GLaccountGeneralController",
            controllerAs: "GLaccountGeneralCtrl",
            scope: {
                currentGlaccount: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();