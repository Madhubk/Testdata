(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailGroupModal", EmailGroupModal);

    EmailGroupModal.$inject = ["$uibModal", "$templateCache"];

    function EmailGroupModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="EmailGroupModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Email Group</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <email-group input="input"></email-group>
        </div>`;
        $templateCache.put("EmailGroupModal.html", _template);

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
                    windowClass: "right email-group",
                    scope: scope,
                    templateUrl: "EmailGroupModal.html",
                    controller: 'EmailGroupModalController as EmailGroupModalCtrl',
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
        .controller("EmailGroupModalController", EmailGroupModalController);

    EmailGroupModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function EmailGroupModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        let EmailGroupModalCtrl = this;

        function Init() {
            EmailGroupModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailGroupModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EmailGroupModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
