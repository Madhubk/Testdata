(function () {
    "use strict";
    console.log("1");
    angular
        .module("Application")
        .directive("employeeMenu", EmployeeMenu);

    EmployeeMenu.$inject = [];

    function EmployeeMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/employee/employee-menu/employee-menu.html",
            link: Link,
            controller: "EmployeeMenuController",
            controllerAs: "EmployeeMenuCtrl",
            scope: {
                currentEmployee: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
