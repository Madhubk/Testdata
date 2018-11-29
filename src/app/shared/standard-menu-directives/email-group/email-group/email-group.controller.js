(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailGroupController", EmailGroupController);

    EmailGroupController.$inject = ["authService", "apiService", "helperService", "appConfig"];

    function EmailGroupController(authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var EmailGroupCtrl = this;

        function Init() {
            EmailGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailGroup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": EmailGroupCtrl.input
            };

            if (EmailGroupCtrl.ePage.Entities) {
                InitEmailGroup();
            }
        }

        function InitEmailGroup() {
            EmailGroupCtrl.ePage.Masters.EmailGroup = {};
            EmailGroupCtrl.ePage.Masters.EmailGroup.IsEnable = false;
			
            if (EmailGroupCtrl.ePage.Entities.Communication) {
                IframeConfig(EmailGroupCtrl.ePage.Entities.Communication);
            } else {
                GetCommunicationId();
            }
        }

        function GetCommunicationId() {
            apiService.get("eAxisAPI", appConfig.Entities.Communication.API.CreateGroupEmail.Url + EmailGroupCtrl.ePage.Entities.EntityRefCode).then(function (response) {
                if (response.data.Response) {
                    IframeConfig(response.data.Response);
                } else {
                    EmailGroupCtrl.ePage.Masters.EmailGroup.IsEnable = true;
                }
            });
        }

        function IframeConfig(communication) {
            var _communication = communication.split("@")[0];
            EmailGroupCtrl.ePage.Masters.EmailGroup.IsEnable = true;

            EmailGroupCtrl.ePage.Masters.EmailGroup.iframeSrc = $sce.trustAsResourceUrl('https://groups.google.com/a/20cube.com/forum/embed/?place=forum/' + _communication + '&showsearch=true&showpopout=false&showtabs=false&showtitle=false&showtopics=false&parenturl=' + encodeURIComponent(window.location.href));
        }

        Init();
    }
})();
