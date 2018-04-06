(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailModal", EmailModal);

    EmailModal.$inject = ["$uibModal"];

    function EmailModal($uibModal) {
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
                    windowClass: "right email",
                    scope: scope,
                    templateUrl: "app/shared/standard-menu-directives/email/email-modal/email-modal.html",
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
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
