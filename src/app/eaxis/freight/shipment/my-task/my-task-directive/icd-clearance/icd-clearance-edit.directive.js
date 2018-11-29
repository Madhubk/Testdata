/*
Page: IcdClearance Edit
*/
(function () {
    "use strict"
    angular

        .module("Application")
        .directive("icdclearanceedit", IcdClearanceEditDirective)

    function IcdClearanceEditDirective() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/icd-clearance/icd-clearance/icd-clearance-edit/icd-clearance-edit.html",
            link: Link,
            controller: "IcdClearanceEditController",
            controllerAs: "IcdClearanceEditCtrl",
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