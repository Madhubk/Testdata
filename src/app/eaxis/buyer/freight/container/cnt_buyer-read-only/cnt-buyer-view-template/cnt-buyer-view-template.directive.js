(function () {
    "use strict";

    angular
        .module("Application")
        .directive("cntBuyerViewTemplate", cntBuyerViewTemplate);

    cntBuyerViewTemplate.$inject = [];

    function cntBuyerViewTemplate() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view-template/cnt-buyer-view-template.html",
            controller: "cntBuyerViewTemplateController",
            controllerAs: "cntBuyerViewTemplateCtrl",
            scope: {
                currentContainer: "=",
                dataentryObject: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();