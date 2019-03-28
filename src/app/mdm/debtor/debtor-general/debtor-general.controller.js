(function () {
    "use strict";

    angular.module("Application")
        .controller("DebtorGeneralController", DebtorGeneralController);

    DebtorGeneralController.$inject = ["helperService"];

    function DebtorGeneralController(helperService) {

        var DebtorGeneralCtrl = this;

        function Init() {
            
            var currentDebtor = DebtorGeneralCtrl.currentDebtor[DebtorGeneralCtrl.currentDebtor.code].ePage.Entities;

            DebtorGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Debtor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDebtor
            };

            DebtorGeneralCtrl.ePage.Masters.UIDebtor = DebtorGeneralCtrl.ePage.Entities.Header.Data;
        }

        Init()
    }
})();