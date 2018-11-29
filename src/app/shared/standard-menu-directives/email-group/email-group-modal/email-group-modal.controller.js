(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailGroupModalController", EmailGroupModalController);

    EmailGroupModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EmailGroupModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var EmailGroupModalCtrl = this;

        function Init() {
            EmailGroupModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailGroupModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EmailGroupModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
