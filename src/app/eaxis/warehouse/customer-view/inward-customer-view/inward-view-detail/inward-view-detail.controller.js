(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardViewDetailController", InwardViewDetailController);

    InwardViewDetailController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "helperService", "apiService", "$filter","appConfig"];

    function InwardViewDetailController($rootScope, $scope, $state, $q, $location, helperService, apiService, $filter,appConfig) {

        var InwardViewDetailCtrl = this;

        function Init() {

            var currentInwardViewDetail = InwardViewDetailCtrl.currentInwardViewDetail[InwardViewDetailCtrl.currentInwardViewDetail.label].ePage.Entities;

            InwardViewDetailCtrl.ePage = {
                "Title": "",
                "Prefix": "InwardView_Detail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInwardViewDetail,
            };


            GetContainerlist();
            GetReferencelist();
            GetProductSummaryList();
            AllocatePartAttribute();

        }



        function GetContainerlist() {

            var _filter = {
                "WOD_FK": InwardViewDetailCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InwardViewDetailCtrl.ePage.Entities.Header.API.Containers.FilterID
            };
            apiService.post("eAxisAPI", InwardViewDetailCtrl.ePage.Entities.Header.API.Containers.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = response.data.Response;

                    InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = $filter('orderBy')(InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer, 'CreatedDateTime');
                }
            });
        }



        function GetReferencelist() {
            var _filter = {
                "WOD_FK": InwardViewDetailCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InwardViewDetailCtrl.ePage.Entities.Header.API.References.FilterID
            };

            apiService.post("eAxisAPI", InwardViewDetailCtrl.ePage.Entities.Header.API.References.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = response.data.Response;
                    InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = $filter('orderBy')(InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference, 'CreatedDateTime');
                }
            });
        }

        function GetProductSummaryList() {
            var _filter = {
                "WOD_FK": InwardViewDetailCtrl.ePage.Entities.Header.Data.PK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InwardViewDetailCtrl.ePage.Entities.Header.API.LineSummary.FilterID
            };

            apiService.post("eAxisAPI", InwardViewDetailCtrl.ePage.Entities.Header.API.LineSummary.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardViewDetailCtrl.ePage.Masters.ProductSummaryList = response.data.Response;
                }
            });
        }

        function AllocatePartAttribute() {
            if (InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK": InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        InwardViewDetailCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                    }
                });
            }
        }


        Init();
    }

})();