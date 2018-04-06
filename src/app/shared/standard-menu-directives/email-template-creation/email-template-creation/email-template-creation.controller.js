(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailTemplateCreationController", EmailTemplateCreationController);

    EmailTemplateCreationController.$inject = ["$timeout", "authService", "apiService", "helperService", "appConfig", "confirmation", "toastr"];

    function EmailTemplateCreationController($timeout, authService, apiService, helperService, appConfig, confirmation, toastr) {
        /* jshint validthis: true */
        var EmailTemplateCreationCtrl = this;

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
