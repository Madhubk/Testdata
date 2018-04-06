(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EventModalController", EventModalController);

    EventModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EventModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var EventModalCtrl = this;

        function Init() {
            EventModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EventModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EventModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
