(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeeconnycDashboardController", DeeconnycDashboardController);

        DeeconnycDashboardController.$inject = ["$location", "$q", "$filter", "$scope", "$uibModal", "helperService", "authService", "apiService", "appConfig"];

    function DeeconnycDashboardController($location, $q, $filter, $scope, $uibModal, helperService, authService, apiService, appConfig) {
        var DeeconnycDashboardCtrl = this;

        function Init() {
            DeeconnycDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Deeconny_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DeeconnycDashboardCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitBuyer();
        }

        function InitBuyer() {
            DeeconnycDashboardCtrl.ePage.Masters.Buyer = {};
            DeeconnycDashboardCtrl.ePage.Masters.DummyDatevalues = [];
            // this week calculation Addays
            DeeconnycDashboardCtrl.ePage.Masters.StartDate=helperService.FormatDate(Addays(new Date(),14));
            DeeconnycDashboardCtrl.ePage.Masters.EndDate=helperService.FormatDate(Addays(new Date(),21));
            DeeconnycDashboardCtrl.ePage.Masters.ThisWeekStart = $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd');
            DeeconnycDashboardCtrl.ePage.Masters.ThisWeekEnd = $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd');
            // last week
            DeeconnycDashboardCtrl.ePage.Masters.LastWeekStart = $filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd');
            DeeconnycDashboardCtrl.ePage.Masters.LastWeekEnd = $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd');

            console.log(appConfig.Entities.ShipmentHeader.API.Count.Url);
          

            DashboardCountCall();
        }
        function Addays(tt,dd){
            var date = new Date(tt);
            var newdate = new Date(date);
            return newdate.setDate(newdate.getDate() + dd);
        }
      
        function DashboardCountCall() {
            DeeconnycDashboardCtrl.ePage.Masters.DashboardConut = {};
            DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.ShipmentCount = undefined;
            DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.ContainerCount = undefined;
            DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.FTZShipmentCount = undefined;
            DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.FTZContainerCount = undefined;

            ShipmentCount(DeeconnycDashboardCtrl.ePage.Masters.StartDate,DeeconnycDashboardCtrl.ePage.Masters.EndDate);
            FTZShipmentCount(DeeconnycDashboardCtrl.ePage.Masters.StartDate,DeeconnycDashboardCtrl.ePage.Masters.EndDate);
            ContainerCount(DeeconnycDashboardCtrl.ePage.Masters.StartDate,DeeconnycDashboardCtrl.ePage.Masters.EndDate);
            FTZContainerCount(DeeconnycDashboardCtrl.ePage.Masters.StartDate,DeeconnycDashboardCtrl.ePage.Masters.EndDate);
        }

        function ShipmentCount(fromDate, toDate) {
            var _filter = {
                "ETAStart": fromDate,
                "ETATo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerShipmentHeader.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerShipmentHeader.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.ShipmentCount= response.data.Response;
                }
            });
        }
        function FTZShipmentCount(fromDate, toDate) {
            var _filter = {
                "ETAStart": fromDate,
                "ETATo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerShipmentHeader.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerShipmentHeader.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.FTZShipmentCount= response.data.Response;
                }
            });
        }
        function ContainerCount(fromDate, toDate) {
            var _filter = {
                "ETAStart": fromDate,
                "ETATo": toDate,
                "SortColumn":"CNT_ContainerNo",
                "SortType":"DESC",
                "PageNumber":"1",
                "PageSize":"1"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerCntContainer.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.ContainerCount= response.data.Count;
                }
            });
        }
        function FTZContainerCount(fromDate, toDate) {
            var _filter = {
                "ETAStart": fromDate,
                "ETATo": toDate,
                "SortColumn":"CNT_ContainerNo",
                "SortType":"DESC",
                "PageNumber":"1",
                "PageSize":"1"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerCntContainer.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DeeconnycDashboardCtrl.ePage.Masters.DashboardConut.FTZContainerCount= response.data.Count;
                }
            });
        }
        

        Init();
    }

})();