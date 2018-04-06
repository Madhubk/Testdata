(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailModalController", EmailModalController);

    EmailModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EmailModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var EmailModalCtrl = this;

        function Init() {
            EmailModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EmailModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
