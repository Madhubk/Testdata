(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MyTaskDefaultDirectiveController", MyTaskDefaultDirectiveController);

    MyTaskDefaultDirectiveController.$inject = ["helperService"];

    function MyTaskDefaultDirectiveController(helperService) {
        var MyTaskDefaultDirectiveCtrl = this;

        function Init() {
            MyTaskDefaultDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Default_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MyTaskDefaultDirectiveCtrl.ePage.Masters.MyTask = MyTaskDefaultDirectiveCtrl.taskObj;
        }

        Init();
    }
})();
