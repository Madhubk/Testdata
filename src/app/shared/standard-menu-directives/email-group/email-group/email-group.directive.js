(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailGroup", Email);

    Email.$inject = [];

    function Email() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/email-group/email-group/email-group.html",
            controller: 'EmailGroupController',
            controllerAs: 'EmailGroupCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
