(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargeCodeController", ChargeCodeController);

    ChargeCodeController.$inject = ["helperService", "chargeCodeConfig"];

    function ChargeCodeController(helperService, chargeCodeConfig) {

        var ChargeCodeCtrl = this;

        function Init() {
            ChargeCodeCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_ChargeCode",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": chargeCodeConfig.Entities
            };

            ChargeCodeCtrl.ePage.Masters.DataentryName = chargeCodeConfig.DataentryName;
            ChargeCodeCtrl.ePage.Masters.Title = chargeCodeConfig.DataentryTitle;

            ChargeCodeCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };


            /* Tab */
            ChargeCodeCtrl.ePage.Masters.TabList = [];

            /* Function */
            ChargeCodeCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function SelectedGridRow($item) {
        }
        Init();
    }
})();