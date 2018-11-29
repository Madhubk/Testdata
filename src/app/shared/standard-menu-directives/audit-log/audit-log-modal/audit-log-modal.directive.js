(function () {
    "use strict";

    angular
        .module("Application")
        .directive("auditLogModal", AuditLogModal);

    AuditLogModal.$inject = ["$uibModal", "$templateCache"];

    function AuditLogModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="AuditLogModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Audit Log</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <audit-log input="input" mode="1" entity="AuditLogModalCtrl.ePage.Masters.AuditEntity"></audit-log>
        </div>`;
        $templateCache.put("AuditLogModal.html", _template);

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
                    // backdrop: "static",
                    keyboard: true,
                    windowClass: "right audit-log",
                    scope: scope,
                    templateUrl: "AuditLogModal.html",
                    controller: 'AuditLogModalController as AuditLogModalCtrl',
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
