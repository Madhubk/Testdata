(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DhcusDeeconnycDashboardDirectiveController", DhcusDeeconnycDashboardDirectiveController);

        DhcusDeeconnycDashboardDirectiveController.$inject = ["$location", "$q", "$filter", "$scope", "$uibModal", "helperService", "authService", "apiService", "appConfig"];

    function DhcusDeeconnycDashboardDirectiveController($location, $q, $filter, $scope, $uibModal, helperService, authService, apiService, appConfig) {
        var DhcusDeeconnycDashboardDirectiveCtrl = this;

        function Init() {
            DhcusDeeconnycDashboardDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Deeconny_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitBuyer();
        }

        function InitBuyer() {
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.Buyer = {};
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DummyDatevalues = [];
            // this week calculation Addays
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.StartDate=helperService.FormatDate(Addays(new Date(),14));
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.EndDate=helperService.FormatDate(Addays(new Date(),21));
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.ThisWeekStart = $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd');
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.ThisWeekEnd = $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd');
            // last week
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.LastWeekStart = $filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd');
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.LastWeekEnd = $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd');
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.TrackShipments=TrackShipments;
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.TrackContainer=TrackContainer;
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.TrackOrders=TrackOrders;
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.UploadOrder=UploadOrder;
            console.log(appConfig.Entities.ShipmentHeader.API.Count.Url);
          

            DashboardCountCall();
        }
        function Addays(tt,dd){
            var date = new Date(tt);
            var newdate = new Date(date);
            return newdate.setDate(newdate.getDate() + dd);
        }
      
        function DashboardCountCall() {
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut = {};
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.ShipmentCount = undefined;
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.ContainerCount = undefined;
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.FTZShipmentCount = undefined;
            DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.FTZContainerCount = undefined;

            ShipmentCount(DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.StartDate,DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.EndDate);
            FTZShipmentCount(DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.StartDate,DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.EndDate);
            ContainerCount(DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.StartDate,DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.EndDate);
            FTZContainerCount(DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.StartDate,DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.EndDate);
        }

        function ShipmentCount(fromDate, toDate) {
            var _filter = {
                "ETAStart": fromDate,
                "ETATo": toDate,
                "SortColumn":"SHP_ShipmentNo",
                "SortType":"DESC",
                "PageNumber":"1",
                "PageSize":"1"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": 'BPTRACKSHP'
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerTrackShipment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.ShipmentCount= response.data.Count;
                }
            });
        }
        function FTZShipmentCount(fromDate, toDate) {
            var _filter = {
                "ETAStart": fromDate,
                "ETATo": toDate,
                "TradeZone": "FTZ",
                "SortColumn":"SHP_ShipmentNo",
                "SortType":"DESC",
                "PageNumber":"1",
                "PageSize":"1"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": 'BPTRACKSHP'
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerTrackShipment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.FTZShipmentCount= response.data.Count;
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
                "FilterID": appConfig.Entities.BuyerTrackContainer.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerTrackContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.ContainerCount= response.data.Count;
                }
            });
        }
        function FTZContainerCount(fromDate, toDate) {
            var _filter = {
                "ETAStart": fromDate,
                "ETATo": toDate,
                "TradeZone": "FTZ",
                "SortColumn":"CNT_ContainerNo",
                "SortType":"DESC",
                "PageNumber":"1",
                "PageSize":"1"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerTrackContainer.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerTrackContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.DashboardConut.FTZContainerCount= response.data.Count;
                }
            });
        }
        function TrackShipments() {
            var _queryString = {
                "ETAStart": DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.StartDate,
                "ETATo": DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.EndDate
            }
            _queryString = helperService.encryptData(_queryString);
             $location.path('/EA/Buyer/Freight/track-shipment').search({
                 item: _queryString
             });
        }
        function TrackContainer() {
            var _queryString = {
                "ETAStart": DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.StartDate,
                "ETATo": DhcusDeeconnycDashboardDirectiveCtrl.ePage.Masters.EndDate
            }
            _queryString = helperService.encryptData(_queryString);
             $location.path('/EA/Buyer/Freight/track-containers').search({
                 item: _queryString
             });
        }

        function UploadOrder() {
             $location.path('/EA/Buyer/Order/po-batch-upload').search();
        }
        function TrackOrders() {
            $location.path('/EA/Buyer/Order/track-orders').search();
       }

        Init();
    }

})();