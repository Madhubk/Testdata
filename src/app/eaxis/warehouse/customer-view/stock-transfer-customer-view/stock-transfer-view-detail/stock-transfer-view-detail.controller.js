(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StockTransferViewDetailController", StockTransferViewDetailController);

    StockTransferViewDetailController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "helperService", "apiService", "$filter", "appConfig"];

    function StockTransferViewDetailController($rootScope, $scope, $state, $q, $location, helperService, apiService, $filter, appConfig) {

        var StockTransferViewDetailCtrl = this;

        function Init() {

            var currentStockTransferViewDetail = StockTransferViewDetailCtrl.currentStockTransferViewDetail[StockTransferViewDetailCtrl.currentStockTransferViewDetail.label].ePage.Entities;

            StockTransferViewDetailCtrl.ePage = {
                "Title": "",
                "Prefix": " AdjustmentView_Detail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentStockTransferViewDetail,
            };
            GetPartAttributeDetails();
        }

        function GetPartAttributeDetails() {
            if (StockTransferViewDetailCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK": StockTransferViewDetailCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        StockTransferViewDetailCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        StockTransferViewDetailCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        StockTransferViewDetailCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                    }
                });
            }
        }

        Init();
    }

})();