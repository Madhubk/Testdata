(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolMyTaskController", ConsolMyTaskController);

    ConsolMyTaskController.$inject = ["helperService", "appConfig", "authService", "apiService"];

    function ConsolMyTaskController(helperService, appConfig, authService, apiService) {
        /* jshint validthis: true */
        var ConsolMyTaskCtrl = this;
        function Init() {
            var currentObj = ConsolMyTaskCtrl.currentConsol[ConsolMyTaskCtrl.currentConsol.label].ePage.Entities;
            ConsolMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            ConsolMyTaskCtrl.ePage.Masters.MyTask = {};
            if (ConsolMyTaskCtrl.listSource) {
                ConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(ConsolMyTaskCtrl.listSource);
            } else {
                ConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
            }
        }

        Init();
    }
})();
