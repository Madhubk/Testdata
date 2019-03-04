(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplateCreation", EmailTemplateCreation);

    EmailTemplateCreation.$inject = ["$templateCache"];

    function EmailTemplateCreation($templateCache) {
        let _template = `<div class="email-template-creation-container p-10">
            <summernote config="EmailTemplateCtrl.ePage.Masters.SummernoteOptions" ng-model="EmailTemplateCtrl.ePage.Masters.EmailTemplate.ListView.ActiveEmail.Body"></summernote>
        </div>`;
        $templateCache.put("EmailTemplateCreation.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "EmailTemplateCreation.html",
            controller: 'EmailTemplateCreationController',
            controllerAs: 'EmailTemplateCreationCtrl',
            bindToController: true,
            scope: {
                input: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("EmailTemplateCreationController", EmailTemplateCreationController);

    EmailTemplateCreationController.$inject = ["helperService"];

    function EmailTemplateCreationController(helperService) {
        /* jshint validthis: true */
        let EmailTemplateCreationCtrl = this;

        function Init() {
            EmailTemplateCreationCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailTemplateCreation",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": EmailTemplateCreationCtrl.input
            };

            if (EmailTemplateCreationCtrl.input) {
                InitEmailTemplateCreation();
            }
        }

        function InitEmailTemplateCreation() {
            EmailTemplateCreationCtrl.ePage.Masters.ToolbarOptions = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
            ];
        }

        Init();
    }
})();
