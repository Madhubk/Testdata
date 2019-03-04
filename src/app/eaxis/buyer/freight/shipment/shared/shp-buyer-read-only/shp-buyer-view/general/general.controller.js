(function () {
    "use strict";

    angular
        .module("Application")
        .controller("shpBuyerViewGeneralController", shpBuyerViewGeneralController);

    shpBuyerViewGeneralController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function shpBuyerViewGeneralController($window, helperService, appConfig, apiService) {
        /* jshint validthis: true */
        var shpBuyerViewGeneralCtrl = this;

        function Init() {
            var obj = shpBuyerViewGeneralCtrl.obj[shpBuyerViewGeneralCtrl.obj.label].ePage.Entities;
            shpBuyerViewGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "shpBuyerViewGeneral",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };
        }

        Init();
    }
})();