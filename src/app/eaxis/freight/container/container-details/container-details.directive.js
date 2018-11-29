(function () {
    "use strict";

    angular
        .module("Application")
        .directive("containerDetails", ContainerDetails);

    ContainerDetails.$inject = [];

    function ContainerDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/container/container-details/container-details.html",
            link: Link,
            controller: "ContainerDetailsController",
            controllerAs: "ContainerDetailsCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
