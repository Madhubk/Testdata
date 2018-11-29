(function () {
    "use strict"
    angular
        .module("Application")
        .directive("obtaindestuffedit", ObtainDestuffEditDirective)

    function ObtainDestuffEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/destuff/obtain-destuff/obtain-destuff-edit/obtain-destuff-edit.html",
            link: Link,
            controller: "ObtainDestuffEditController",
            controllerAs: "ObtainDestuffEditDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
