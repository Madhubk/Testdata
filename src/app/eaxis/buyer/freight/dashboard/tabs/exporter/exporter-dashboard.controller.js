(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExporterDashboardController", ExporterDashboardController);

        ExporterDashboardController.$inject = ["$location", "helperService", "authService", "apiService", "appConfig"];

    function ExporterDashboardController($location, helperService, authService, apiService, appConfig) {
        var ExporterDashboardCtrl = this;

        function Init() {
            ExporterDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Importer_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            
            InitImporter();
        }

        function InitImporter() {
            ExporterDashboardCtrl.ePage.Masters.Importer = {};
            ExporterDashboardCtrl.ePage.Masters.CreateNewBooking = CreateNewBooking;
            ExporterDashboardCtrl.ePage.Masters.UploadSLI = UploadSLI;
            ExporterDashboardCtrl.ePage.Masters.TrackShipments = TrackShipments;
            DashboardCountCall();
        }
        
        function DashboardCountCall() {
            ExporterDashboardCtrl.ePage.Masters.DashboardConut = {};
            ExporterDashboardCtrl.ePage.Masters.DashboardConut.OpenOrdersCount = undefined;
            ExporterDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = undefined;
            ExporterDashboardCtrl.ePage.Masters.DashboardConut.ExceptionCount = undefined;
            ExporterDashboardCtrl.ePage.Masters.DashboardConut.ContainerPackingCount = undefined;
            
            OpenOrdersCountCall();
            BookingCountCall();
            ExceptionCountCall();
            ContainerPackingCountCall();
        }

        function OpenOrdersCountCall() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExporterDashboardCtrl.ePage.Masters.DashboardConut.OpenOrdersCount = response.data.Response;
                }
            });
        }

        function BookingCountCall() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExporterDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = response.data.Response;
                }
            });
        }

        function ExceptionCountCall() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExporterDashboardCtrl.ePage.Masters.DashboardConut.ExceptionCount = response.data.Response;
                }
            });
        }

        function ContainerPackingCountCall() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExporterDashboardCtrl.ePage.Masters.DashboardConut.ContainerPackingCount = response.data.Response;
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
            $location.path('/EA/PO/po-batch-upload').search({
                item: _queryString
            });
        }

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