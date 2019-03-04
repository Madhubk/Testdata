(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewGeneral", OrdBuyerViewGeneral);

    OrdBuyerViewGeneral.$inject = [];

    function OrdBuyerViewGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/general/general.html",
            controller: "OrdBuyerViewGeneralController",
            controllerAs: "OrdBuyerViewGeneralCtrl",
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