(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptionModalController", ExceptionModalController);

    ExceptionModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function ExceptionModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var ExceptionModalCtrl = this;

        function Init() {
            ExceptionModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ExceptionModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            ExceptionModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
