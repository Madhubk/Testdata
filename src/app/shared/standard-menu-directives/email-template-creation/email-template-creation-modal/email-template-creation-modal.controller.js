(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailTemplateCreationModalController", EmailTemplateCreationModalController);

    EmailTemplateCreationModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EmailTemplateCreationModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var EmailTemplateCreationModalCtrl = this;

        function Init() {
            EmailTemplateCreationModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailTemplateCreationModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EmailTemplateCreationModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
