(function () {
    "use strict";

    angular
        .module('Application')
        .controller('ExternalUrlRedirectController', ExternalUrlRedirectController);

    ExternalUrlRedirectController.$inject = ["$location", "helperService"];

    function ExternalUrlRedirectController($location, helperService) {
        var ExternalUrlRedirectCtrl = this;

        function Init() {
            ExternalUrlRedirectCtrl.ePage = {
                "Title": "",
                "Prefix": "ExternalUrlRedirect",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            console.log($location)
        }

        Init();
    }

})();
