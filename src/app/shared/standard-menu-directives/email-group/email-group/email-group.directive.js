(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailGroup", Email);

    Email.$inject = ["$templateCache"];

    function Email($templateCache) {
        let _template = `<div class="clearfix p-30 text-center font-120" data-ng-if="!EmailGroupCtrl.ePage.Masters.EmailGroup.IsEnable">
            <i class="fa fa-spin fa-spinner"></i>
        </div>
        <div class="clearfix" data-ng-if="EmailGroupCtrl.ePage.Masters.EmailGroup.IsEnable">
            <iframe id="forum_embed" class="no-border" style="width: 100%; height: calc(100vh - 115px); overflow-y: auto;" data-ng-src="{{EmailGroupCtrl.ePage.Masters.EmailGroup.iframeSrc}}"></iframe>
        </div>`;
        $templateCache.put("EmailGroup.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "EmailGroup.html",
            controller: 'EmailGroupController',
            controllerAs: 'EmailGroupCtrl',
            bindToController: true,
            scope: {
                input: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("EmailGroupController", EmailGroupController);

    EmailGroupController.$inject = ["$sce", "apiService", "helperService", "appConfig"];

    function EmailGroupController($sce, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        let EmailGroupCtrl = this;

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
            let _communication = communication.split("@")[0];
            EmailGroupCtrl.ePage.Masters.EmailGroup.IsEnable = true;

            EmailGroupCtrl.ePage.Masters.EmailGroup.iframeSrc = $sce.trustAsResourceUrl('https://groups.google.com/a/20cube.com/forum/embed/?place=forum/' + _communication + '&showsearch=true&showpopout=false&showtabs=false&showtitle=false&showtopics=false&parenturl=' + encodeURIComponent(window.location.href));
        }

        Init();
    }
})();
