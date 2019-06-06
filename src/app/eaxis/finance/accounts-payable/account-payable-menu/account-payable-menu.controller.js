(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountPayableMenuController", AccountPayableMenuController);

    AccountPayableMenuController.$inject = ["helperService",];

    function AccountPayableMenuController(helperService) {
        var AccountPayableMenuCtrl = this;

        function Init() {
            var currentAccountPayable = AccountPayableMenuCtrl.currentAccountPayable[AccountPayableMenuCtrl.currentAccountPayable.code].ePage.Entities;

            AccountPayableMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "AccountPayable_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAccountPayable
            };

            AccountPayableMenuCtrl.ePage.Masters.PostButtonText = "Post";

            /* function */
            AccountPayableMenuCtrl.ePage.Masters.Validation = Validation;
        }

        function Validation() {
        }

        Init();
    }
})();