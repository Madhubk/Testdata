(function () {
    "use strict";

    angular
        .module("Application")
        .directive("containerMhu", ContainerMhu);

    ContainerMhu.$inject = [];

    function ContainerMhu() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/container-mhu/container-mhu.html",
            link: Link,
            controller: "ContainerMhuController",
            controllerAs: "ContainerMhuCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();