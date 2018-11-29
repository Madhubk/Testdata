(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuMailBuyerOrcEditDirectiveController", SfuMailBuyerOrcEditDirectiveController);

    SfuMailBuyerOrcEditDirectiveController.$inject = ["helperService", "myTaskActivityConfig"];

    function SfuMailBuyerOrcEditDirectiveController(helperService, myTaskActivityConfig) {
        var SfuMailBuyerOrcEditDirectiveCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            SfuMailBuyerOrcEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            SFUMailInit();
        }

        function SFUMailInit() {
            SfuMailBuyerOrcEditDirectiveCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.TaskObj;
        }

        Init();
    }
})();