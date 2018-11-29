(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DelayReasonModalController", DelayReasonModalController);

    DelayReasonModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function DelayReasonModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var DelayReasonModalCtrl = this;

        function Init() {
            DelayReasonModalCtrl.ePage = {
                "Title": "",
                "Prefix": "DelayReasonModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            DelayReasonModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
