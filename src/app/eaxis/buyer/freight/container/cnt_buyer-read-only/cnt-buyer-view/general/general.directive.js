(function () {
    "use strict";

    angular
        .module("Application")
        .directive("cntBuyerViewGeneral", cntBuyerViewGeneral);

    cntBuyerViewGeneral.$inject = [];

    function cntBuyerViewGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/general/general.html",
            controller: "cntBuyerViewGeneralController",
            controllerAs: "cntBuyerViewGeneralCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();