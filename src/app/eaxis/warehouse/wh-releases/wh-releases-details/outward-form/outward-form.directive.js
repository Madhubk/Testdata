(function () {
    "use strict";

    angular
        .module("Application")
        .directive("outwardForm", OutwardForm);

    OutwardForm.$inject = [];

    function OutwardForm() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/wh-releases/wh-releases-details/outward-form/outward-form.html",
            link: Link,
            controller: "OutwardFormController",
            controllerAs: "OutwardFormCtrl",
            scope: {
                lineOrder: "=",
                pickNumber:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
