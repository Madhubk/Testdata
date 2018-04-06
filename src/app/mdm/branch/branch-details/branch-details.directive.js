(function() {
    "use strict";

    angular
        .module("Application")
        .directive("branchDetails", branchDetails);

    branchDetails.$inject = [];

    function branchDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/branch/branch-details/branch-details.html",
            link: Link,
            controller: "BranchDetailsController",
            controllerAs: "BranchDetailsCtrl",
            scope: {
                currentBranch: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
