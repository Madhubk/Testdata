(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailTemplateModalController", EmailTemplateModalController);

    EmailTemplateModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EmailTemplateModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var EmailTemplateModalCtrl = this;

        function Init() {
            EmailTemplateModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailTemplateModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EmailTemplateModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
