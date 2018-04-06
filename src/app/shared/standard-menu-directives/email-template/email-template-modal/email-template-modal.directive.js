(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplateModal", EmailTemplateModal);

    EmailTemplateModal.$inject = ["$uibModal"];

    function EmailTemplateModal($uibModal) {
        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                mode: "=",
                type: "="
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
                    windowClass: "right email-template",
                    scope: scope,
                    templateUrl: "app/shared/standard-menu-directives/email-template/email-template-modal/email-template-modal.html",
                    controller: 'EmailTemplateModalController as EmailTemplateModalCtrl',
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
