(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MyTaskDefaultEditDirectiveController", MyTaskDefaultEditDirectiveController);

    MyTaskDefaultEditDirectiveController.$inject = ["helperService"];

    function MyTaskDefaultEditDirectiveController(helperService) {
        var MyTaskDefaultEditDirectiveCtrl = this;

        function Init() {
            MyTaskDefaultEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Default_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
