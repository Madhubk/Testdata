(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountViewDetailController", CycleCountViewDetailController);

    CycleCountViewDetailController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "helperService", "apiService", "$filter", "appConfig"];

    function CycleCountViewDetailController($rootScope, $scope, $state, $q, $location, helperService, apiService, $filter, appConfig) {

        var CycleCountViewDetailCtrl = this;

        function Init() {

            var currentCycleCountViewDetail = CycleCountViewDetailCtrl.currentCycleCountViewDetail[CycleCountViewDetailCtrl.currentCycleCountViewDetail.label].ePage.Entities;

            CycleCountViewDetailCtrl.ePage = {
                "Title": "",
                "Prefix": "CycleCountView_Detail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCycleCountViewDetail,
            };
            CycleCountViewDetailCtrl.ePage.Masters.OrgPartRelationValues = OrgPartRelationValues;

        }

        function OrgPartRelationValues(index){
            if(CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Client && CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Product ){
                CycleCountViewDetailCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var _filter = {
                    "ORG_FK": CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ORG_FK,
                    "OSP_FK": CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].OSP_FK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.PrdProductRelatedParty.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.PrdProductRelatedParty.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UseExpiryDate = response.data.Response[0].UseExpiryDate;
                        CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePackingDate = response.data.Response[0].UsePackingDate;
                        CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                        CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                        CycleCountViewDetailCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                    }
                });
            }
        }
        Init();
    }

})();