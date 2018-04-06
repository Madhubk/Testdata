(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataEventModalController", DataEventModalController);

    DataEventModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function DataEventModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var DataEventModalCtrl = this;

        function Init() {
            DataEventModalCtrl.ePage = {
                "Title": "",
                "Prefix": "DataEventModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            DataEventModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
