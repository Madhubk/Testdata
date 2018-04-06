(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplateCreationModal", EmailTemplateCreationModal);

    EmailTemplateCreationModal.$inject = ["$uibModal"];

    function EmailTemplateCreationModal($uibModal) {
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
                    windowClass: "right email-template-creation",
                    scope: scope,
                    templateUrl: "app/shared/standard-menu-directives/email-template-creation/email-template-creation-modal/email-template-creation-modal.html",
                    controller: 'EmailTemplateCreationModalController as EmailTemplateCreationModalCtrl',
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
