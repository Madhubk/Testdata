(function () {
    "use strict";

    angular
        .module("Application")
        .controller("HomeController", HomeController);

    HomeController.$inject = ["helperService"];

    function HomeController(helperService) {
        /* jshint validthis: true */
        var HomeCtrl = this;

        function Init() {
            HomeCtrl.ePage = {
                "Title": "",
                "Prefix": "App_Home",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
