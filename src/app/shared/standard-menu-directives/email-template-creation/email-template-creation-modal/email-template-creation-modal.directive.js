(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplateCreationModal", EmailTemplateCreationModal);

    EmailTemplateCreationModal.$inject = ["$uibModal", "$templateCache"];

    function EmailTemplateCreationModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="EmailTemplateCreationModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Email Template</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <email-template-creation input="input"></email-template-creation>
        </div>`;
        $templateCache.put("EmailTemplateCreationModal.html", _template);

        let exports = {
            restrict: "EA",
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "right email-template-creation",
                    scope: scope,
                    templateUrl: "EmailTemplateCreationModal.html",
                    controller: 'EmailTemplateCreationModalController as EmailTemplateCreationModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(response => {}, () => {});
            }
        }
    }

    angular
        .module("Application")
        .controller("EmailTemplateCreationModalController", EmailTemplateCreationModalController);

    EmailTemplateCreationModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EmailTemplateCreationModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let EmailTemplateCreationModalCtrl = this;

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
