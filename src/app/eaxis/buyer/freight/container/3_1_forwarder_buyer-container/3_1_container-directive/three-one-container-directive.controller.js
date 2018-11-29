(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneContainerListDirectiveController", ThreeOneContainerListDirectiveController);

    ThreeOneContainerListDirectiveController.$inject = ["helperService"];

    function ThreeOneContainerListDirectiveController(helperService) {
        var ThreeOneContainerListDirectiveCtrl = this;

        function Init() {
            var currentContainer = ThreeOneContainerListDirectiveCtrl.currentContainer[ThreeOneContainerListDirectiveCtrl.currentContainer.label].ePage.Entities;
            ThreeOneContainerListDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "ConatainerList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentContainer
            };
        }

        Init();
    }
})();