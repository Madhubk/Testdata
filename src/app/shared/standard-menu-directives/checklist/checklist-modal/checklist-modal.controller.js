(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ChecklistModalController", ChecklistModalController);

    ChecklistModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function ChecklistModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var ChecklistModalCtrl = this;

        function Init() {
            ChecklistModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ChecklistModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            ChecklistModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
