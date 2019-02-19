(function () {
    "use strict";

    angular
        .module("Application")
        .controller("shpBuyerViewGeneralController", shpBuyerViewGeneralController);

    shpBuyerViewGeneralController.$inject = ["$timeout", "helperService", "appConfig", "apiService"];

    function shpBuyerViewGeneralController($timeout, helperService, appConfig, apiService) {
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
            shpBuyerViewGeneralCtrl.ePage.Masters.UIJobRoutes = {};
            GetRoutingDetails();
        }

        function GetRoutingDetails() {
            var _filter = {
                "EntityRefKey": shpBuyerViewGeneralCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    shpBuyerViewGeneralCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;

                    GetJobSailingDetails();
                }
            });
        }

        function GetJobSailingDetails() {
            var _gridData = [];
            shpBuyerViewGeneralCtrl.ePage.Masters.UIJobRoutes.GridData = undefined;
            $timeout(function () {
                if (shpBuyerViewGeneralCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                    shpBuyerViewGeneralCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("UIJobRoutes List is Empty");
                }

                shpBuyerViewGeneralCtrl.ePage.Masters.UIJobRoutes.GridData = _gridData;
            });
        }

        Init();
    }
})();