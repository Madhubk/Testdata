(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tcActivityFormConfiguration", TCActivityFormConfiguration);

    TCActivityFormConfiguration.$inject = ["$rootScope"];

    function TCActivityFormConfiguration($rootScope) {
        var exports = {
            restrict: "EA",
            templateUrl: "app/trust-center/process/tc-activity-form-configuration/tc-activity-form-configuration.html",
            controller: "TCActivityFormConfigurationController",
            controllerAs: "TCActivityFormConfigurationCtrl",
            bindToController: true,
            scope: {
                input: "=",
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();