(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailController", EmailController);

    EmailController.$inject = ["authService", "apiService", "helperService", "appConfig"];

    function EmailController(authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var EmailCtrl = this;

        function Init() {
            EmailCtrl.ePage = {
                "Title": "",
                "Prefix": "Email",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": EmailCtrl.input
            };

            if (EmailCtrl.ePage.Entities) {
                InitEmail();
            }
        }

        function InitEmail() {
            EmailCtrl.ePage.Masters.Email = {};
            EmailCtrl.ePage.Masters.Email.IsEnable = false;
            if (EmailCtrl.ePage.Entities.Communication) {
                IframeConfig(EmailCtrl.ePage.Entities.Communication);
            } else {
                GetCommunicationId();
            }
        }

        function GetCommunicationId() {
            apiService.get("eAxisAPI", appConfig.Entities.Communication.API.CreateGroupEmail.Url + EmailCtrl.ePage.Entities.EntityRefCode).then(function (response) {
                if (response.data.Response) {
                    IframeConfig(response.data.Response);
                } else {
                    EmailCtrl.ePage.Masters.Email.IsEnable = true;
                }
            });
        }

        function IframeConfig(communication) {
            var _communication = communication.split("@")[0];
            EmailCtrl.ePage.Masters.Email.IsEnable = true;

            EmailCtrl.ePage.Masters.Email.iframeSrc = $sce.trustAsResourceUrl('https://groups.google.com/a/20cube.com/forum/embed/?place=forum/' + _communication + '&showsearch=true&showpopout=false&showtabs=false&showtitle=false&showtopics=false&parenturl=' + encodeURIComponent(window.location.href));
        }

        Init();
    }
})();
