(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplate", EmailTemplate);

    EmailTemplate.$inject = [];

    function EmailTemplate() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/email-template/email-template/email-template.html",
            controller: 'EmailTemplateController',
            controllerAs: 'EmailTemplateCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
