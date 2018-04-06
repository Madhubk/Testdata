(function () {
    "use strict";

    angular
        .module("Application")
        .directive("groupsfu1", GroupSfu1Directive1)
        .directive("groupsfu3", GroupSfu1Directive3)
        .directive("groupppa1", GroupPpa1Directive1)
        .directive("bookredy1", GroupSpa1Directive1);

    function GroupSfu1Directive1() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks-suf1.html",
            link: Link,
            controller: "GroupSfu1DirectiveController",
            controllerAs: "GroupSfu1DirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {
            console.log(scope)
        }
    }

    function GroupSfu1Directive3() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks-suf3.html",
            link: Link,
            controller: "GroupSfu1DirectiveController",
            controllerAs: "GroupSfu1DirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {
            console.log(scope)
        }
    }

    function GroupPpa1Directive1() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks-ppa1.html",
            link: Link,
            controller: "GroupSfu1DirectiveController",
            controllerAs: "GroupSfu1DirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {
            console.log(scope)
        }
    }

    function GroupSpa1Directive1() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/order-tasks/order-tasks-spa1.html",
            link: Link,
            controller: "GroupSfu1DirectiveController",
            controllerAs: "GroupSfu1DirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {
            console.log(scope)
        }
    }

})();
