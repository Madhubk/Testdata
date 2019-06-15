(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountReceivableMenuController", AccountReceivableMenuController);

        AccountReceivableMenuController.$inject = ["helperService",];

    function AccountReceivableMenuController(helperService) {
        var AccountReceivableMenuCtrl = this;

        function Init() {
            var currentAccountReceivable = AccountReceivableMenuCtrl.currentAccountReceivable[AccountReceivableMenuCtrl.currentAccountPayable.code].ePage.Entities;

            AccountReceivableMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "AccountReceivable_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAccountReceivable
            };

            AccountReceivableMenuCtrl.ePage.Masters.PostButtonText = "Post";

            /* function */
            AccountReceivableMenuCtrl.ePage.Masters.Validation = Validation;
        }

        function Validation() {
        }

        Init();
    }
})();