(function () {
    "use strict";

    angular
        .module("Application")
        .directive("overrideKpi", OverrideKpi);

    OverrideKpi.$inject = [];

    function OverrideKpi() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/override-kpi/override-kpi.html",
            controller: "OverrideKpiController",
            controllerAs: "OverrideKpiCtrl",
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                onSubmitResponse: "&"
            }
        };
        return exports;
    }
})();
