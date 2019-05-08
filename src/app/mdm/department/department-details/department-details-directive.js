(function () {
    "use strict";

    angular
        .module("Application")
        .directive("departmentDetails", DepartmentDetails);
        
    DepartmentDetails.$inject = [];

    function DepartmentDetails() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/department/department-details/department-details.html",
            link: Link,
            controller: "DepartmentDetailsController",
            controllerAs: "DepartmentDetailsCtrl",
            scope: {
                currentDepartment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
