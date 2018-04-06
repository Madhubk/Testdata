(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DocumentModalController", DocumentModalController);

    DocumentModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function DocumentModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var DocumentModalCtrl = this;

        function Init() {
            DocumentModalCtrl.ePage = {
                "Title": "",
                "Prefix": "DocumentModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            DocumentModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
