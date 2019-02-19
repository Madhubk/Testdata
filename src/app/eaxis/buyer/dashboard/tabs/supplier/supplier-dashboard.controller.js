(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SupplierDashboardController", SupplierDashboardController);

    SupplierDashboardController.$inject = ["$location", "$filter", "helperService", "apiService", "appConfig"];

    function SupplierDashboardController($location, $filter, helperService, apiService, appConfig) {
        var SupplierDashboardCtrl = this;

        function Init() {
            SupplierDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier-Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitSupplier();
        }

        function InitSupplier() {
            SupplierDashboardCtrl.ePage.Masters.Supplier = {};
            SupplierDashboardCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            SupplierDashboardCtrl.ePage.Masters.UploadSLI = UploadSLI;
            SupplierDashboardCtrl.ePage.Masters.TrackShipments = TrackShipments;

            DashboardCountCall();
        }

        function DashboardCountCall() {
            SupplierDashboardCtrl.ePage.Masters.DashboardConut = {};
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.ShippedCount = undefined;
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.ShippingCount = undefined;
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.BookedCount = undefined;
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = undefined;



            ThisWeekShipCount($filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd-MMM-yyyy'), $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd-MMM-yyyy'));
            LastWeekShipCount($filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd-MMM-yyyy'), $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd-MMM-yyyy'));
            ThisWeekBookCount($filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd-MMM-yyyy'), $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd-MMM-yyyy'));
            LastWeekBookCount($filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd-MMM-yyyy'), $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd-MMM-yyyy'));
        }

        function ThisWeekShipCount(fromDate, toDate) {
            var _filter = {
                "ETDFrom": fromDate,
                "ETDTo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerShipmentHeader.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerShipmentHeader.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.ShippedCount = response.data.Count;
                }
            });
        }

        function LastWeekShipCount(fromDate, toDate) {
            var _filter = {
                "ETDFrom": fromDate,
                "ETDTo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerShipmentHeader.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerShipmentHeader.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.ShippingCount = response.data.Count;
                }
            });
        }

        function ThisWeekBookCount(fromDate, toDate) {
            var _filter = {
                "BookedDateFrom": fromDate,
                "BookedDateTo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerShipmentHeader.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerShipmentHeader.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.BookedCount = response.data.Count;
                }
            });
        }

        function LastWeekBookCount(fromDate, toDate) {
            var _filter = {
                "BookedDateFrom": fromDate,
                "BookedDateTo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerShipmentHeader.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerShipmentHeader.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = response.data.Response;
                }
            });
        }

        function CreateNewBooking() {
            var _queryString = {
                "IsCreated": "New"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/freight/booking').search({
                item: _queryString
            });
        }

        function UploadSLI() {
            var _queryString = {
                "IsCreated": "POBatch Upload"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/Buyer/Order/po-batch-upload').search({
                item: _queryString
            });
        }

        // function UploadSLI() {
        //     var _queryString = {
        //         New : true
        //     };
        //     _queryString = helperService.encryptData(_queryString);
        //     $window.open("#/EA/single-record-view/upload-sli/" + _queryString, "_blank");
        // }

        function TrackShipments() {
            var _queryString = {
                "IsCreated": "Track Shipments"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/smart-track/track-shipments').search({
                item: _queryString
            });
        }

        Init();
    }

})();