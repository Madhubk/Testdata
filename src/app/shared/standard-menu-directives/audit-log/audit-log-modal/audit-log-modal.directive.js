(function () {
    "use strict";

    angular
        .module("Application")
        .directive("auditLogModal", AuditLogModal);

    AuditLogModal.$inject = ["$uibModal"];

    function AuditLogModal($uibModal) {
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
                    templateUrl: "app/shared/standard-menu-directives/audit-log/audit-log-modal/audit-log-modal.html",
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
