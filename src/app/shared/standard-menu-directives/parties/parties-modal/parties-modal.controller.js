(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PartiesModalController", PartiesModalController);

    PartiesModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function PartiesModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var PartiesModalCtrl = this;

        function Init() {
            PartiesModalCtrl.ePage = {
                "Title": "",
                "Prefix": "PartiesModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            PartiesModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
