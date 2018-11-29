(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailModal", EmailModal);

    EmailModal.$inject = ["$uibModal", "$templateCache"];

    function EmailModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" data-ng-click="EmailModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Email</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <email input="input" mode="mode" type="type" close-modal="EmailModalCtrl.ePage.Masters.Close()" on-complete="EmailModalCtrl.ePage.Masters.OnComplete($item)"></email>
        </div>`;
        $templateCache.put("EmailModal.html", _template);

        var exports = {
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
                var modalInstance = $uibModal.open({
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
                            var exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    console.log(response);
                    scope.onCloseModal({
                        $item: "email"
                    });
                }, function () {
                    console.log("Cancelled");
                    scope.onCloseModal({
                        $item: "email"
                    });
                });
            }
        }
    }
})();
