(function () {
    "use strict";

    angular
        .module("Application")
        .controller("KeywordModalController", KeywordModalController);

    KeywordModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function KeywordModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var KeywordModalCtrl = this;

        function Init() {
            KeywordModalCtrl.ePage = {
                "Title": "",
                "Prefix": "KeywordModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            KeywordModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
