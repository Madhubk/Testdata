(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdjustmentViewDetailController", AdjustmentViewDetailController);

    AdjustmentViewDetailController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "helperService", "apiService", "$filter", "appConfig"];

    function AdjustmentViewDetailController($rootScope, $scope, $state, $q, $location, helperService, apiService, $filter, appConfig) {

        var AdjustmentViewDetailCtrl = this;

        function Init() {

            var currentAdjustmentViewDetail = AdjustmentViewDetailCtrl.currentAdjustmentViewDetail[AdjustmentViewDetailCtrl.currentAdjustmentViewDetail.label].ePage.Entities;

            AdjustmentViewDetailCtrl.ePage = {
                "Title": "",
                "Prefix": " AdjustmentView_Detail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAdjustmentViewDetail,
            };
            GetPartAttributeDetails();
        }
        function GetPartAttributeDetails() {
            if ( AdjustmentViewDetailCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK":  AdjustmentViewDetailCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                         AdjustmentViewDetailCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                         AdjustmentViewDetailCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                         AdjustmentViewDetailCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                    }
                });
            }
        }

        Init();
    }

})();