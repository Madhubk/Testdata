
/*
Page:ICD Clearance
*/
(function () {
    "use strict"
    angular
        .module("Application")
        .directive("icdclearance", IcdClearance)

    function IcdClearance() {
        
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/icd-clearance/icd-clearance/icd-clearance.html",
            link: Link,
            controller: "IcdClearanceController",
            controllerAs: "IcdClearanceCtrl",
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