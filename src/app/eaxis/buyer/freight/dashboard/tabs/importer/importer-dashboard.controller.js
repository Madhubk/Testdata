(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImporterDashboardController", ImporterDashboardController);

    ImporterDashboardController.$inject = ["$location", "helperService", "authService", "apiService", "appConfig"];

    function ImporterDashboardController($location, helperService, authService, apiService, appConfig) {
        var ImporterDashboardCtrl = this;

        function Init() {
            ImporterDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Buyer_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ImporterDashboardCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitBuyer();
        }

        function InitBuyer() {
            ImporterDashboardCtrl.ePage.Masters.Buyer = {};
            ImporterDashboardCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            ImporterDashboardCtrl.ePage.Masters.UploadPurchaseOrder = UploadPurchaseOrder;
            ImporterDashboardCtrl.ePage.Masters.TrackOrders = TrackOrders;

            DashboardCountCall();
            
            setTimeout(() => {
                BuyerDashBoardInit();
            }, 0);
        }

        function DashboardCountCall() {
            ImporterDashboardCtrl.ePage.Masters.DashboardConut = {};
            ImporterDashboardCtrl.ePage.Masters.DashboardConut.OpenOrdersCount = undefined;
            ImporterDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = undefined;
            ImporterDashboardCtrl.ePage.Masters.DashboardConut.ExceptionCount = undefined;
            ImporterDashboardCtrl.ePage.Masters.DashboardConut.ContainerPackingCount = undefined;

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
                    ImporterDashboardCtrl.ePage.Masters.DashboardConut.OpenOrdersCount = response.data.Response;
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
                    ImporterDashboardCtrl.ePage.Masters.DashboardConut.BookingCount = response.data.Response;
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
                    ImporterDashboardCtrl.ePage.Masters.DashboardConut.ExceptionCount = response.data.Response;
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
                    ImporterDashboardCtrl.ePage.Masters.DashboardConut.ContainerPackingCount = response.data.Response;
                }
            });
        }

        function BuyerDashBoardInit() {
            GetCRDBarChartDetails();
            GetPortBarChartDetails();
        }

        function GetCRDBarChartDetails() {
            var ctx = document.getElementById("barChart");
            // var maximumcount = Math.max(ImporterDashboardCtrl.ePage.Masters.Buyer.CRDVariance);
            var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["11-May", "12-May", "13-May", "14-May"],
                    datasets: [{
                        label: "#  of product delay",
                        backgroundColor: "#3e95cd",
                        data: [113, 222, 378, 24]
                    }, {
                        label: "# of PO",
                        backgroundColor: "#8e5ea2",
                        data: [140, 354, 165, 34]
                    }]
                },
                options: {
                    title: {
                        display: false,
                        text: ''
                    }
                }
            });
            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            });
        }

        function GetPortBarChartDetails() {
            var ctx =  document.getElementById("portBarChart");
            var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["INMUS", "INMAA", "FIKMM", "INMUB"],
                    datasets: [{
                        label: "# of Container QTY which over Free date",
                        backgroundColor: "#3e95cd",
                        data: [113, 222, 378, 24]
                    }, {
                        label: "# of Container QTY",
                        backgroundColor: "#8e5ea2",
                        data: [140, 354, 165, 34]
                    }]
                },
                options: {
                    title: {
                        display: false,
                        text: ''
                    }
                }
            });
            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            });
        }

        function CreateNewOrder() {
            var _queryString = {
                "IsCreated": "New"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/order').search({
                item: _queryString
            });
        }

        function UploadPurchaseOrder() {
            var _queryString = {
                "IsCreated": "POBatch Upload"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/po-batch-upload').search({
                item: _queryString
            });
        }

        function TrackOrders() {
            var _queryString = {
                "IsCreated": "Track Orders"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/order').search({
                item: _queryString
            });
        }

        Init();
    }

})();
