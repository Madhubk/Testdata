(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailGroupModal", EmailGroupModal);

    EmailGroupModal.$inject = ["$uibModal", "$templateCache"];

    function EmailGroupModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="EmailGroupModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Email Group</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <email-group input="input"></email-group>
        </div>`;
        $templateCache.put("EmailGroupModal.html", _template);

        var exports = {
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
                var modalInstance = $uibModal.open({
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
                            var exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    console.log(response);
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
