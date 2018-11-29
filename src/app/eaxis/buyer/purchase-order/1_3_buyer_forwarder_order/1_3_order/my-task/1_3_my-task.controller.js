(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_MyTaskController", one_three_MyTaskController);

    one_three_MyTaskController.$inject = ["helperService"];

    function one_three_MyTaskController(helperService) {
        /* jshint validthis: true */
        var one_three_MyTaskCtrl = this;

        function Init() {
            var currentObj;
            (one_three_MyTaskCtrl.currentOrder) ? currentObj = one_three_MyTaskCtrl.currentOrder[one_three_MyTaskCtrl.currentOrder.label].ePage.Entities : currentObj = one_three_MyTaskCtrl.obj[one_three_MyTaskCtrl.obj.label].ePage.Entities; 

            one_three_MyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            one_three_MyTaskCtrl.ePage.Masters.MyTask = {};

            if (one_three_MyTaskCtrl.listSource) {
                one_three_MyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(one_three_MyTaskCtrl.listSource);
            } else {
                one_three_MyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
            }
        }

        Init();
    }
})();
