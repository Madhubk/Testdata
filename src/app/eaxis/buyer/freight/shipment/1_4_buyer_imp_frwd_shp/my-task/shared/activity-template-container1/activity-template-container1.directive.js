(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateContainer1", ActivityTemplateContainer1Directive);

    function ActivityTemplateContainer1Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/activity-template-container1/activity-template1.html",
            link: Link,
            controller: "ActivityTemplateContainer1Controller",
            controllerAs: "ActivityTemplateContainer1Ctrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
