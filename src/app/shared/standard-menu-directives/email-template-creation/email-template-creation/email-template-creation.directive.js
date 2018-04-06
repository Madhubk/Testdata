(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplateCreation", EmailTemplateCreation);

    EmailTemplateCreation.$inject = [];

    function EmailTemplateCreation() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/email-template-creation/email-template-creation/email-template-creation.html",
            controller: 'EmailTemplateCreationController',
            controllerAs: 'EmailTemplateCreationCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
