(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceController", FinanceController)

    FinanceController.$inject = ["financeConfig"];

    function FinanceController(financeConfig) {
        var FinanceCtrl = this;

        function Init() {
        }

        Init();
    }
})();