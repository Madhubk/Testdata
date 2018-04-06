(function() {
    "use strict";
    angular
        .module("Application")
        .directive("departmentMenu", DepartmentMenu);

    DepartmentMenu.$inject = [];

    function DepartmentMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/department/department-menu/department-menu.html",
            link: Link,
            controller: "DepartmentMenuController",
            controllerAs: "DepartmentMenuCtrl",
            scope: {
                currentDepartment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();