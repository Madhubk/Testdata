(function () {
    "use strict"
    angular
        .module("Application")
        .directive("obtaindestuff", ObtainDestuff);

    function ObtainDestuff() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/destuff/obtain-destuff/obtain-destuff.html",
            link: Link,
            controller: "ObtainDestuffController",
            controllerAs: "ObtainDestuffDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "=" 
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
