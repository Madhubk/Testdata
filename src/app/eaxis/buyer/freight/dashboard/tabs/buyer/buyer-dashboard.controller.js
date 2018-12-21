(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BuyerDashboardController", BuyerDashboardController);

    BuyerDashboardController.$inject = ["$location", "$q", "$filter", "$scope", "$uibModal", "helperService", "authService", "apiService", "appConfig"];

    function BuyerDashboardController($location, $q, $filter, $scope, $uibModal, helperService, authService, apiService, appConfig) {
        var BuyerDashboardCtrl = this;

        function Init() {
            BuyerDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Buyer_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            BuyerDashboardCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitBuyer();
        }

        function InitBuyer() {
            BuyerDashboardCtrl.ePage.Masters.Buyer = {};
            BuyerDashboardCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            BuyerDashboardCtrl.ePage.Masters.UploadOrder = UploadOrder;
            BuyerDashboardCtrl.ePage.Masters.TrackOrders = TrackOrders;
            BuyerDashboardCtrl.ePage.Masters.DummyDatevalues = [];
            // this week calculation
            BuyerDashboardCtrl.ePage.Masters.ThisWeekStart = $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd');
            BuyerDashboardCtrl.ePage.Masters.ThisWeekEnd = $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd');
            // last week
            BuyerDashboardCtrl.ePage.Masters.LastWeekStart = $filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd');
            BuyerDashboardCtrl.ePage.Masters.LastWeekEnd = $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd');

            // BuyerDashboardCtrl.ePage.Masters.DummyDatevalues.push(dateInput(BuyerDashboardCtrl.ePage.Masters.ThisWeekStart, BuyerDashboardCtrl.ePage.Masters.ThisWeekEnd));
            // BuyerDashboardCtrl.ePage.Masters.DummyDatevalues.push(dateInput(BuyerDashboardCtrl.ePage.Masters.LastWeekStart, BuyerDashboardCtrl.ePage.Masters.LastWeekEnd));
            // BuyerDashboardCtrl.ePage.Masters.DummyDatevalues.push(dateInput(BuyerDashboardCtrl.ePage.Masters.LastWeekStart, BuyerDashboardCtrl.ePage.Masters.ThisWeekEnd));

            // BuyerDashboardCtrl.ePage.Masters.DummyDataPoints = [{
            //     label: "DO's Received This Week",
            //     backgroundColor: "#3e95cd",
            //     data: [0]
            // }, {
            //     label: "DO's Received Last Week",
            //     backgroundColor: "#8e5ea2",
            //     data: [0]
            // }, {
            //     label: "DO's Shipped Last & This Week",
            //     backgroundColor: "#dcc5c5",
            //     data: [0]
            // }];

            DashboardCountCall();
        }

        // function dateInput(fromDate, endDate) {
        //     var value = fromDate + " to " + endDate;
        //     return value;
        // }

        function DashboardCountCall() {
            BuyerDashboardCtrl.ePage.Masters.DashboardConut = {};
            BuyerDashboardCtrl.ePage.Masters.DashboardConut.OpenOrdersCount = undefined;
            BuyerDashboardCtrl.ePage.Masters.DashboardConut.LastWeekDOCount = undefined;
            BuyerDashboardCtrl.ePage.Masters.DashboardConut.LastWeekDOShipCount = undefined;
            BuyerDashboardCtrl.ePage.Masters.DashboardConut.ThisWeekDOShipCount = undefined;

            DOOrderThisWeekCount($filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd-MMM-yyyy'), $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd-MMM-yyyy'));
            DOOrderLastWeekCount($filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd-MMM-yyyy'), $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd-MMM-yyyy'));
            DOShippedThisWeekCount($filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd-MMM-yyyy'), $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd-MMM-yyyy'));
            DOShippedLastWeekCount($filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd-MMM-yyyy'), $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd-MMM-yyyy'));

            // 
            // DOOrderCountCall("DO's Received This Week", $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_From')), 'dd-MMM-yyyy'), $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd-MMM-yyyy')).then(function (response) {
            //     if (response.data.Status == "Success") {
            //         DOOrderCountCall("DO's Received Last Week", $filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd-MMM-yyyy'), $filter('date')(helperService.DateFilter('@@@LastWeek_To'), 'dd-MMM-yyyy')).then(function (response) {
            //             if (response.data.Status == "Success") {
            //                 ShippedCountCall("DO's Shipped Last & This Week", $filter('date')(helperService.DateFilter('@@@LastWeek_From'), 'dd-MMM-yyyy'), $filter('date')(new Date(helperService.DateFilter('@@@ThisWeek_To')), 'dd-MMM-yyyy')).then(function (response) {
            //                     if (response.data.Status == "Success") {
            //                         GetBarChartDetails();
            //                     } else {
            //                         GetBarChartDetails();
            //                     }
            //                 });
            //             } else {
            //                 GetBarChartDetails();
            //             }
            //         });
            //     } else {
            //         GetBarChartDetails();
            //     }
            // });
            // setTimeout(() => {
            //     GetBarChartDetails();
            // }, 0);
        }

        function DOOrderThisWeekCount(fromDate, toDate) {
            var _filter = {
                "OrderDateFrom": fromDate,
                "OrderDateTo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    BuyerDashboardCtrl.ePage.Masters.DashboardConut.ThisWeekDOCount = response.data.Response;
                }
            });
        }

        function DOOrderLastWeekCount(fromDate, toDate) {
            var _filter = {
                "OrderDateFrom": fromDate,
                "OrderDateTo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    BuyerDashboardCtrl.ePage.Masters.DashboardConut.LastWeekDOCount = response.data.Response;
                }
            });
        }

        function DOShippedLastWeekCount(fromDate, toDate) {
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
                    BuyerDashboardCtrl.ePage.Masters.DashboardConut.LastWeekDOShipCount = response.data.Response;
                }
            });

        }

        function DOShippedThisWeekCount(fromDate, toDate) {
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
                    BuyerDashboardCtrl.ePage.Masters.DashboardConut.ThisWeekDOShipCount = response.data.Response;
                }
            });
        }

        function DOOrderCountCall(type, fromDate, toDate) {
            var deferred = $q.defer();
            var _filter = {
                "OrderDateFrom": fromDate,
                "OrderDateTo": toDate
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    BuyerDashboardCtrl.ePage.Masters.DummyDataPoints.map(function (value, key) {
                        if (value.label == type) {
                            value.data = [response.data.Response];
                        }
                    });
                    deferred.resolve(response);
                } else {
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function ShippedCountCall(type, fromDate, toDate) {
            var deferred = $q.defer();
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
                    BuyerDashboardCtrl.ePage.Masters.DummyDataPoints.map(function (value, key) {
                        if (value.label == type) {
                            value.data = [response.data.Response];
                        }
                    });
                    deferred.resolve(response);
                } else {
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function GetBarChartDetails() {
            var ctx = document.getElementById("barChartGroup");
            // var maximumcount = Math.max(BuyerDashboardCtrl.ePage.Masters.Buyer.CRDVariance);
            var chartOptions = {
                scales: {
                    xAxes: [{
                        barPercentage: 0.5
                    }]
                },
                elements: {
                    rectangle: {
                        borderSkipped: 'left',
                    }
                }
            };

            var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: BuyerDashboardCtrl.ePage.Masters.DummyDatevalues,
                    datasets: BuyerDashboardCtrl.ePage.Masters.DummyDataPoints
                },
                options: chartOptions
                // {
                //     title: {
                //         display: false,
                //         text: ''
                //     }
                // }
            });
            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            });
        }

        function UploadOrder(docType) {
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    (docType) ? response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = docType: response.data.Response.UIOrderBatchUpload_Buyer.BatchUploadType = one_poBatchUploadConfig.GlobalVar.DocType;
                    var _exports = {
                        "Entities": {
                            "Header": {
                                "Data": {},
                                "API": {
                                    "InsertBatch": {
                                        "IsAPI": "true",
                                        "HttpType": "POST",
                                        "Url": "orderbatchupload/buyer/insert"
                                    },
                                    "UpdateBatch": {
                                        "IsAPI": "true",
                                        "HttpType": "POST",
                                        "Url": "orderbatchupload/buyer/insert"
                                    }
                                },
                            }
                        }
                    };
                    _exports.Entities.Header.Data = response.data.Response;
                    var _obj = {
                        New: {
                            ePage: _exports
                        },
                        label: 'New',
                        code: response.data.Response.BatchUploadNo,
                        isNew: true
                    };
                    BatchModal(docType, _obj);
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function BatchModal(type, data) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "po-modal right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order_batch/1_1_batch-upload-modal/batch-upload-modal.html",
                controller: 'PoModalController',
                controllerAs: "PoModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentBatch": data,
                            "Type": type
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {}
            );
        }

        function CreateNewOrder() {
            var _queryString = {
                "IsCreated": "New"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/BUYER/PO/order').search({
                item: _queryString
            });
        }

        function TrackOrders() {
            var _queryString = {
                "IsCreated": "Track Orders"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/BUYER/PO/order').search({
                item: _queryString
            });
        }

        Init();
    }

})();