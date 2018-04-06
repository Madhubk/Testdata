(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OutwardDashboardController", OutwardDashboardController);

    OutwardDashboardController.$inject = [ "APP_CONSTANT", "apiService",  "helperService", "$location", "toastr", "$filter","outwardConfig"];

    function OutwardDashboardController(APP_CONSTANT, apiService, helperService, $location, toastr, $filter,outwardConfig) {

        var OutwardDashboardCtrl = this;

        function Init() {
            OutwardDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": outwardConfig.Entities,
            };

            // DatePicker
            OutwardDashboardCtrl.ePage.Masters.DatePicker = {};
            OutwardDashboardCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OutwardDashboardCtrl.ePage.Masters.DatePicker.isOpen = [];
            OutwardDashboardCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;



            OutwardDashboardCtrl.ePage.Masters.Getsummarydetails = Getsummarydetails;
            OutwardDashboardCtrl.ePage.Masters.CreateNewOutward = CreateNewOutward;
            OutwardDashboardCtrl.ePage.Masters.GetOutwardByDate = GetOutwardByDate;
            OutwardDashboardCtrl.ePage.Masters.GetOutwardByClient = GetOutwardByClient;
            OutwardDashboardCtrl.ePage.Masters.GetWarehouseValues = GetWarehouseValues;


            OutwardDashboardCtrl.ePage.Masters.dynamicPopover = {
                templateUrl: 'app/eaxis/warehouse/outward/outward-dashboard/popovertemplate.html',
                title: 'Choose Date'
            };

            GetWarehouseValues();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OutwardDashboardCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getChartDetails() {
            var ctx = "lineChartOutward";
            var maximumcount = Math.max.apply(null, OutwardDashboardCtrl.ePage.Masters.GetOutwardByDateCount);
            var myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: OutwardDashboardCtrl.ePage.Masters.GetOutwardByDateRequiredDate,
                    datasets: [{
                        label: "Outward",
                        data: OutwardDashboardCtrl.ePage.Masters.GetOutwardByDateCount,
                        backgroundColor: 'rgba(67, 133, 245, 0.5)',
                        borderColor: 'rgba(67, 133, 245, 1)',
                        borderWidth: 1
                    }],
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                stepSize: maximumcount / 5,
                                beginAtZero: true,
                                fontColor: "#9ca0a8"

                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.2)"
                            }
                        }],
                        xAxes: [{
                            ticks: {

                                fontColor: "#9ca0a8"
                            }, gridLines: { color: "transparent" }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    }
                    , legend: {
                        display: false
                    }
                }
            });

            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            })
            OutwardDashboardCtrl.ePage.Masters.IsLoading = false;

        }

        function getBarChartDetails() {
            var ctx = "barChartOutward";
            var maximumcount = Math.max.apply(null, OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientCount);
            var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientName,
                    datasets: [{
                        label: "Outward",
                        data: OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientCount,
                        backgroundColor: 'rgba(251, 188, 5, 0.5)',
                        borderColor: 'rgba(251, 188, 5, 1)',
                        borderWidth: 1
                    }],
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                stepSize: maximumcount / 5,
                                beginAtZero: true,
                                fontColor: "#9ca0a8"

                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.2)"
                            }
                        }],
                        xAxes: [{
                            ticks: {

                                fontColor: "#9ca0a8"
                            }, gridLines: { color: "transparent" }
                        }]
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    }
                    , legend: {
                        display: false
                    }
                }
            });

            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            })
            OutwardDashboardCtrl.ePage.Masters.IsLoading = false;

        }


        function GetWarehouseValues() {
            //Get Warehouse Details
            OutwardDashboardCtrl.ePage.Masters.IsLoading = true;
            var _input = {
                "FilterID": OutwardDashboardCtrl.ePage.Entities.Header.API.Warehouse.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", OutwardDashboardCtrl.ePage.Entities.Header.API.Warehouse.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OutwardDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    OutwardDashboardCtrl.ePage.Masters.userselected = OutwardDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    Getsummarydetails(OutwardDashboardCtrl.ePage.Masters.WarehouseDetails[0]);
                }
            });

        }

        function Getsummarydetails(item) {
            OutwardDashboardCtrl.ePage.Masters.IsLoading = true;
            OutwardDashboardCtrl.ePage.Masters.SelectedWarehouse = item;
            var _filter = {
                "WarehouseCode": item.WarehouseCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": OutwardDashboardCtrl.ePage.Entities.Header.API.Summary.FilterID,
            };

            apiService.post("eAxisAPI", OutwardDashboardCtrl.ePage.Entities.Header.API.Summary.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OutwardDashboardCtrl.ePage.Masters.SummaryDetails = response.data.Response[0];
                    OutwardDashboardCtrl.ePage.Masters.IsLoading = false;
                }
            });
            GetOutwardByDate(item, undefined, undefined);
            GetOutwardByClient(item, undefined, undefined);
        }

        function CreateNewOutward() {
            OutwardDashboardCtrl.ePage.Entities.Header.Message = true;
        }


        function GetOutwardByDate(item, ToDate, FromDate) {

            // Get Values
            OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues = [];

            //Current and Previous Date
            if (ToDate) {
                OutwardDashboardCtrl.ePage.Masters.ToDate = new Date(ToDate);
            } else {
                OutwardDashboardCtrl.ePage.Masters.ToDate = new Date();
            }

            if (FromDate) {
                OutwardDashboardCtrl.ePage.Masters.FromDate = new Date(FromDate);
            } else {
                OutwardDashboardCtrl.ePage.Masters.FromDate = new Date(OutwardDashboardCtrl.ePage.Masters.ToDate.getTime() - (6 * 24 * 60 * 60 * 1000));;
            }

            if (OutwardDashboardCtrl.ePage.Masters.ToDate && OutwardDashboardCtrl.ePage.Masters.FromDate) {
                var timeDiff = Math.abs(OutwardDashboardCtrl.ePage.Masters.FromDate.getTime() - OutwardDashboardCtrl.ePage.Masters.ToDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                for (var i = diffDays; i >= 0; i--) {
                    var mydate = new Date(OutwardDashboardCtrl.ePage.Masters.ToDate.getTime() - (i * 24 * 60 * 60 * 1000));
                    var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');

                    var obj = {
                        "RequiredDate": filtereddate,
                        "Count": 0
                    }
                    OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues.push(obj);
                }
                var RequiredDateTo = $filter('date')(OutwardDashboardCtrl.ePage.Masters.ToDate, 'yyyy-MM-dd');
                var RequiredDateFrom = $filter('date')(OutwardDashboardCtrl.ePage.Masters.FromDate, 'yyyy-MM-dd');
            }

            if (RequiredDateTo > RequiredDateFrom) {
                if (diffDays <= 10) {
                    OutwardDashboardCtrl.ePage.Masters.IsLoading = true;
                    var _filter = {
                        "SortColumn": "WOD_WorkOrderID",
                        "WarehouseCode": item.WarehouseCode,
                        "RequiredDateFrom": RequiredDateFrom,
                        "RequiredDateTo": RequiredDateTo,
                        "SortType": "DESC",
                        "PageNumber": 1,
                        "PageSize": 25
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": OutwardDashboardCtrl.ePage.Entities.Header.API.GetOutwardByDate.FilterID
                    };

                    apiService.post("eAxisAPI", OutwardDashboardCtrl.ePage.Entities.Header.API.GetOutwardByDate.Url, _input).then(function SuccessCallback(response) {
                        if (response.data.Response) {
                            OutwardDashboardCtrl.ePage.Masters.GetOutwardByDateRequiredDate = [];
                            OutwardDashboardCtrl.ePage.Masters.GetOutwardByDateCount = [];

                            angular.forEach(response.data.Response, function (value1, key1) {
                                $filter("filter")(OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues, function (value, key) {
                                    if (value.RequiredDate == value1.RequiredDate) {
                                        value.Count = value1.Count;
                                    }
                                });
                            });

                            angular.forEach(OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues, function (value, key) {
                                OutwardDashboardCtrl.ePage.Masters.GetOutwardByDateRequiredDate.push($filter('date')(value.RequiredDate, 'MM-dd'));
                                OutwardDashboardCtrl.ePage.Masters.GetOutwardByDateCount.push(value.Count);
                            })
                            getChartDetails();
                        }
                    });
                } else {
                    toastr.info("Date Range Must Be Between 10 Days");
                }

            } else {
                toastr.info("From Date Should Not Be Greater Than To Date");
            }


        }

        function GetOutwardByClient(item, ToDate1, FromDate1) {

            // Get Values
            OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByClientvalues = [];

            //Current and Previous Date
            if (ToDate1) {
                OutwardDashboardCtrl.ePage.Masters.ToDate1 = new Date(ToDate1);
            } else {
                OutwardDashboardCtrl.ePage.Masters.ToDate1 = new Date();
            }

            if (FromDate1) {
                OutwardDashboardCtrl.ePage.Masters.FromDate1 = new Date(FromDate1);
            } else {
                OutwardDashboardCtrl.ePage.Masters.FromDate1 = new Date(OutwardDashboardCtrl.ePage.Masters.ToDate1.getTime() - (6 * 24 * 60 * 60 * 1000));;
            }


            if (OutwardDashboardCtrl.ePage.Masters.ToDate1 && OutwardDashboardCtrl.ePage.Masters.FromDate1) {
                var timeDiff = Math.abs(OutwardDashboardCtrl.ePage.Masters.FromDate1.getTime() - OutwardDashboardCtrl.ePage.Masters.ToDate1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                for (var i = diffDays; i >= 0; i--) {
                    var mydate = new Date(OutwardDashboardCtrl.ePage.Masters.ToDate1.getTime() - (i * 24 * 60 * 60 * 1000));
                    var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');

                    var obj = {
                        "RequiredDate": filtereddate,
                        "Count": 0,
                        "Client_Code": "",
                    }
                    OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByClientvalues.push(obj);
                }
                var RequiredDateTo = $filter('date')(OutwardDashboardCtrl.ePage.Masters.ToDate1, 'yyyy-MM-dd');
                var RequiredDateFrom = $filter('date')(OutwardDashboardCtrl.ePage.Masters.FromDate1, 'yyyy-MM-dd');
            }

            if (RequiredDateTo > RequiredDateFrom) {
                if (diffDays <= 10) {
                    OutwardDashboardCtrl.ePage.Masters.IsLoading = true;
                    var _filter = {
                        "SortColumn": "WOD_WorkOrderID",
                        "WarehouseCode": item.WarehouseCode,
                        "RequiredDateFrom": RequiredDateFrom,
                        "RequiredDateTo": RequiredDateTo,
                        "SortType": "DESC",
                        "PageNumber": 1,
                        "PageSize": 25
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": OutwardDashboardCtrl.ePage.Entities.Header.API.GetOutwardByClient.FilterID
                    };

                    apiService.post("eAxisAPI", OutwardDashboardCtrl.ePage.Entities.Header.API.GetOutwardByClient.Url, _input).then(function SuccessCallback(response) {
                        if (response.data.Response) {
                            OutwardDashboardCtrl.ePage.Masters.TableValues = response.data.Response;
                            OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientRequiredDate = [];
                            OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientCount = [];
                            OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientName = [];

                            angular.forEach(response.data.Response, function (value1, key1) {
                                $filter("filter")(OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByClientvalues, function (value, key) {
                                    if (value.RequiredDate == value1.RequiredDate) {
                                        value.Count = value1.Count;
                                        value.Client_Code = value1.Client_Code;
                                    }
                                });
                            });

                            angular.forEach(OutwardDashboardCtrl.ePage.Masters.DummyGetOutwardByClientvalues, function (value, key) {
                                OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientRequiredDate.push($filter('date')(value.RequiredDate, 'MM-dd'));
                                OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientCount.push(value.Count);
                                OutwardDashboardCtrl.ePage.Masters.GetOutwardByClientName.push(value.Client_Code)
                            })
                            getBarChartDetails();
                        }
                    });
                } else {
                    toastr.info("Date Range Must Be Between 10 Days");
                }
            } else {
                toastr.info("From Date Should Not Be Greater Than To Date");
            }
        }

        Init();
    }

})();