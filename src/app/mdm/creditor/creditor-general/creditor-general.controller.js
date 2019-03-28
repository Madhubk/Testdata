(function () {
    "use strict";

    angular.module("Application")
        .controller("CreditorGeneralController", CreditorGeneralController);

    CreditorGeneralController.$inject = ["helperService"];

    function CreditorGeneralController(helperService) {
        
        var CreditorGeneralCtrl = this;

        function Init() {

            var currentCreditor = CreditorGeneralCtrl.currentCreditor[CreditorGeneralCtrl.currentCreditor.code].ePage.Entities;

            CreditorGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCreditor
            };

            CreditorGeneralCtrl.ePage.Masters.UICreditor = CreditorGeneralCtrl.ePage.Entities.Header.Data;
        }

        Init()
    }
})();