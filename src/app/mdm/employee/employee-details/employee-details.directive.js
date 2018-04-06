(function () {
    "use strict";

    angular
        .module("Application")
        .directive("employeeDetails", EmployeeDetails);

    EmployeeDetails.$inject = [];
    function EmployeeDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/employee/employee-details/employee-details.html",
            link: Link,
            controller: "EmployeeDetailsController",
            controllerAs: "EmployeeDetailsCtrl",
            scope: {
                currentEmployee: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) {}
    }
})();
