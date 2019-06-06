(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountPayableGeneralController", AccountPayableGeneralController);

    AccountPayableGeneralController.$inject = ["helperService"];

    function AccountPayableGeneralController(helperService) {
        var AccountPayableGeneralCtrl = this;

        function Init() {
            var currentAccountPayable = AccountPayableGeneralCtrl.currentAccountPayable[AccountPayableGeneralCtrl.currentAccountPayable.code].ePage.Entities;

            AccountPayableGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "AccountPayable_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAccountPayable
            };
        }
        Init();
    }
})();