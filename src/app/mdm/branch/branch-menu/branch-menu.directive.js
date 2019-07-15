(function () {
    "use strict";
    angular
        .module("Application")
        .directive("branchMenu", branchMenu);

    branchMenu.$inject = [];

    function branchMenu() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/branch/branch-menu/branch-menu.html",
            link: Link,
            controller: "BranchMenuController",
            controllerAs: "BranchMenuCtrl",
            scope: {
                currentBranch: "=",
                dataentryObject: '=',
                isHideMenu: "=",
                hideAsnLine: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();