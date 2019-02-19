(function () {
    "use strict"
    angular
        .module("Application")
        .directive("buyerActivityTemplateConsol1", BuyerActivityTemplateConsol1Directive);

    function BuyerActivityTemplateConsol1Directive() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/buyer-activity-template-consol1/buyer-activity-template-consol1.html",
            link: Link,
            controller: "BuyerActivityTemplateConsol1Controller",
            controllerAs: "ActivityTemplateConsol1Ctrl",
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
