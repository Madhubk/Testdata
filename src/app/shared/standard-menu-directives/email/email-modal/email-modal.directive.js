(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailModal", EmailModal);

    EmailModal.$inject = ["$uibModal", "$templateCache"];

    function EmailModal($uibModal, $templateCache) {
        let _template = `<div class="modal-header">
            <button type="button" class="close" data-ng-click="EmailModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Email</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <email input="input" mode="mode" type="type" close-modal="EmailModalCtrl.ePage.Masters.Close()" on-complete="EmailModalCtrl.ePage.Masters.OnComplete($item)"></email>
        </div>`;
        $templateCache.put("EmailModal.html", _template);

        let exports = {
            restrict: "EA",
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                onComplete: "&",
                onCloseModal: "&"
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
                    windowClass: "right email",
                    scope: scope,
                    templateUrl: "EmailModal.html",
                    controller: 'EmailModalController as EmailModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            let exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(response => {
                    scope.onCloseModal({
                        $item: "email"
                    });
                }, () => {
                    scope.onCloseModal({
                        $item: "email"
                    });
                });
            }
        }
    }

    angular
        .module("Application")
        .controller("EmailModalController", EmailModalController);

    EmailModalController.$inject = ["$scope", "$uibModalInstance", "helperService", "param"];

    function EmailModalController($scope, $uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var EmailModalCtrl = this;

        function Init() {
            EmailModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EmailModalCtrl.ePage.Masters.Close = Close;
            EmailModalCtrl.ePage.Masters.OnComplete = OnComplete;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function OnComplete($item) {
            $scope.$parent.onComplete({
                $item: $item
            });
        }

        Init();
    }
})();
