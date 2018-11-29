(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SupplierDashboardController", SupplierDashboardController);

    SupplierDashboardController.$inject = ["$location", "$window", "helperService", "authService", "apiService", "appConfig"];

    function SupplierDashboardController($location, $window, helperService, authService, apiService, appConfig) {
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
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.OpenOrdersCount = undefined;
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = undefined;
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.ExceptionCount = undefined;
            SupplierDashboardCtrl.ePage.Masters.DashboardConut.ContainerPackingCount = undefined;
            SupplierDashboardCtrl.ePage.Masters.PaginationFilter = {
                SortColumn: "WKI_CreatedDateTime",
                SortType: "DESC",
                PageNumber: 1,
                PageSize: 5
            };

            CRDUpdateCountCall();
            PreAdviceCountCall();
            BookingCountCall();
            ExceptionCountCall();
            // ContainerPackingCountCall();
        }

        function CRDUpdateCountCall() {
            var _filter = angular.copy(SupplierDashboardCtrl.ePage.Masters.PaginationFilter);
            _filter.C_Performer = authService.getUserInfo().UserId;
            _filter.PSM_FK = "6ff2ad4e-2d5e-400d-97b8-545a209865ef";
            _filter.WSI_FK = "f9b6f26a-7964-433d-ba6e-3afaa4709f8d";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.CRDUpdateCount = response.data.Count;
                }
            });
        }

        function PreAdviceCountCall() {
            var _filter = angular.copy(SupplierDashboardCtrl.ePage.Masters.PaginationFilter);
            _filter.C_Performer = authService.getUserInfo().UserId;
            _filter.PSM_FK = "dff6e396-1ca0-4eed-b5a3-02c0227463ad";
            _filter.WSI_FK = "8a4608ca-8bbe-4117-b342-8e75c58c2a80";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.PreAdviceCount = response.data.Count;
                }
            });
        }

        function BookingCountCall() {
            var _filter = angular.copy(SupplierDashboardCtrl.ePage.Masters.PaginationFilter);
            _filter.C_Performer = authService.getUserInfo().UserId;
            _filter.PSM_FK = "6ff2ad4e-2d5e-400d-97b8-545a209865ef";
            _filter.WSI_FK = "f9b6f26a-7964-433d-ba6e-3afaa4709f8d";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = response.data.Count;
                }
            });
        }

        function ExceptionCountCall() {
            var _filter = angular.copy(SupplierDashboardCtrl.ePage.Masters.PaginationFilter);
            _filter.C_Performer = authService.getUserInfo().UserId;
            _filter.PSM_FK = "72589a7b-de48-4b60-a174-5bb7d87e9fc3";
            _filter.WSI_FK = "5c967fc5-7d7c-40dc-bdc5-a7f0113cdf58";
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };
            apiService.post('eAxisAPI', appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierDashboardCtrl.ePage.Masters.DashboardConut.ExceptionCount = response.data.Count;
                }
            });
        }

        // function ContainerPackingCountCall() {
        //     var _filter = {
        //         "SortColumn": "POH_CreatedDateTime",
        //         "SortType": "DESC",
        //         "PageNumber": "1",
        //         "PageSize": 25,
        //         "IsShpCreated": 'false',
        //         "IsValid": 'true'
        //     }
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
        //     }
        //     apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             SupplierDashboardCtrl.ePage.Masters.DashboardConut.ContainerPackingCount = response.data.Response;
        //         }
        //     });
        // }

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
            $location.path('/EA/PO/po-batch-upload').search({
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