(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GatepassMyTaskController", GatepassMyTaskController);

    GatepassMyTaskController.$inject = ["helperService", "appConfig", "apiService", "authService", "$ocLazyLoad"];

    function GatepassMyTaskController(helperService, appConfig, apiService, authService, $ocLazyLoad) {
        /* jshint validthis: true */
        var GatepassMyTaskCtrl = this;

        function Init() {
            var currentObj = GatepassMyTaskCtrl.currentGatepass[GatepassMyTaskCtrl.currentGatepass.label].ePage.Entities;

            GatepassMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Gatepass_mytask",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            GatepassMyTaskCtrl.ePage.Masters.MyTask = {};

            if (GatepassMyTaskCtrl.listSource) {
                GatepassMyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(GatepassMyTaskCtrl.listSource);
            } else {
                GatepassMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
            }
            (GatepassMyTaskCtrl.obj) ? GetMyTaskList() : false;
        }

        Init();
    }
})();
