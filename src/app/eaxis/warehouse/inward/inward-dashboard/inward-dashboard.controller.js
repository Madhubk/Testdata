(function () {
    "use strict";
    angular
        .module("Application")
        .controller("InwardDashboardController", InwardDashboardController);

    InwardDashboardController.$inject = [ "APP_CONSTANT", "apiService",  "helperService", "$location", "toastr", "$filter","inwardConfig"];

    function InwardDashboardController(APP_CONSTANT, apiService, helperService, $location, toastr, $filter,inwardConfig) {

        var InwardDashboardCtrl = this;

        function Init() {
            InwardDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": inwardConfig.Entities,
            };


            var _index = JSON.stringify($location.path()).indexOf("inward-dashboard");

            if(_index != -1){
                InwardDashboardCtrl.ePage.Masters.IsLoadContoller = true;
            }else{
                InwardDashboardCtrl.ePage.Masters.IsLoadContoller = false;
            }

            // DatePicker
            InwardDashboardCtrl.ePage.Masters.DatePicker = {};
            InwardDashboardCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            InwardDashboardCtrl.ePage.Masters.DatePicker.isOpen = [];
            InwardDashboardCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;



            InwardDashboardCtrl.ePage.Masters.Getsummarydetails = Getsummarydetails;
            InwardDashboardCtrl.ePage.Masters.CreateNewInward = CreateNewInward;
            InwardDashboardCtrl.ePage.Masters.GetInwardByDate = GetInwardByDate;
            InwardDashboardCtrl.ePage.Masters.GetInwardByClient = GetInwardByClient;
            InwardDashboardCtrl.ePage.Masters.GetWarehouseValues = GetWarehouseValues;

            InwardDashboardCtrl.ePage.Masters.dynamicPopover = {
                templateUrl: 'app/eaxis/warehouse/inward/inward-dashboard/popovertemplate.html',
                title: 'Choose Date'
            };

            GetWarehouseValues();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            InwardDashboardCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getChartDetails() {
            var ctx = "lineChart";
            var maximumcount = Math.max.apply(null, InwardDashboardCtrl.ePage.Masters.GetInwardByDateCount);
            var myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: InwardDashboardCtrl.ePage.Masters.GetInwardByDateArrivalDate,
                    datasets: [{
                        label: "Inward",
                        data: InwardDashboardCtrl.ePage.Masters.GetInwardByDateCount,
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
            InwardDashboardCtrl.ePage.Masters.IsLoading = false;

        }

        function getBarChartDetails() {
            var ctx = "barChart";
            var maximumcount = Math.max.apply(null, InwardDashboardCtrl.ePage.Masters.GetInwardByClientCount);
            var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: InwardDashboardCtrl.ePage.Masters.GetInwardByClientName,
                    datasets: [{
                        label: "Inward",
                        data: InwardDashboardCtrl.ePage.Masters.GetInwardByClientCount,
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
            InwardDashboardCtrl.ePage.Masters.IsLoading = false;

        }


        function GetWarehouseValues() {
            //Get Warehouse Details
            InwardDashboardCtrl.ePage.Masters.IsLoading = true;
            var _input = {
                "FilterID": InwardDashboardCtrl.ePage.Entities.Header.API.Warehouse.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", InwardDashboardCtrl.ePage.Entities.Header.API.Warehouse.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    InwardDashboardCtrl.ePage.Masters.userselected = InwardDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    Getsummarydetails(InwardDashboardCtrl.ePage.Masters.WarehouseDetails[0]);
                }
            });

        }

        function Getsummarydetails(item) {
            InwardDashboardCtrl.ePage.Masters.IsLoading = true;
            InwardDashboardCtrl.ePage.Masters.SelectedWarehouse = item;
            var _filter = {
                "WarehouseCode": item.WarehouseCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": InwardDashboardCtrl.ePage.Entities.Header.API.Summary.FilterID,
            };

            apiService.post("eAxisAPI", InwardDashboardCtrl.ePage.Entities.Header.API.Summary.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardDashboardCtrl.ePage.Masters.SummaryDetails = response.data.Response[0];
                    InwardDashboardCtrl.ePage.Masters.IsLoading = false;
                }
            });
            GetInwardByDate(item, undefined, undefined);
            GetInwardByClient(item, undefined, undefined);
        }

        function CreateNewInward() {
            InwardDashboardCtrl.ePage.Entities.Header.Message = true;
        }


        function GetInwardByDate(item, ToDate, FromDate) {

            // Get Values
            InwardDashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues = [];

            //Current and Previous Date
            if (ToDate) {
                InwardDashboardCtrl.ePage.Masters.ToDate = new Date(ToDate);
            } else {
                InwardDashboardCtrl.ePage.Masters.ToDate = new Date();
            }

            if (FromDate) {
                InwardDashboardCtrl.ePage.Masters.FromDate = new Date(FromDate);
            } else {
                InwardDashboardCtrl.ePage.Masters.FromDate = new Date(InwardDashboardCtrl.ePage.Masters.ToDate.getTime() - (6 * 24 * 60 * 60 * 1000));;
            }

            if (InwardDashboardCtrl.ePage.Masters.ToDate && InwardDashboardCtrl.ePage.Masters.FromDate) {
                var timeDiff = Math.abs(InwardDashboardCtrl.ePage.Masters.FromDate.getTime() - InwardDashboardCtrl.ePage.Masters.ToDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                for (var i = diffDays; i >= 0; i--) {
                    var mydate = new Date(InwardDashboardCtrl.ePage.Masters.ToDate.getTime() - (i * 24 * 60 * 60 * 1000));
                    var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');

                    var obj = {
                        "ArrivalDate": filtereddate,
                        "Count": 0
                    }
                    InwardDashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues.push(obj);
                }
                var ArrivaldateTo = $filter('date')(InwardDashboardCtrl.ePage.Masters.ToDate, 'yyyy-MM-dd');
                var ArrivaldateFrom = $filter('date')(InwardDashboardCtrl.ePage.Masters.FromDate, 'yyyy-MM-dd');
            }

            if (ArrivaldateTo > ArrivaldateFrom) {
                if (diffDays <= 10) {
                    InwardDashboardCtrl.ePage.Masters.IsLoading = true;
                    var _filter = {
                        "SortColumn": "WOD_WorkOrderID",
                        "WarehouseCode": item.WarehouseCode,
                        "ArrivaldateFrom": ArrivaldateFrom,
                        "ArrivaldateTo": ArrivaldateTo,
                        "SortType": "DESC",
                        "PageNumber": 1,
                        "PageSize": 25
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": InwardDashboardCtrl.ePage.Entities.Header.API.GetInwardByDate.FilterID
                    };

                    apiService.post("eAxisAPI", InwardDashboardCtrl.ePage.Entities.Header.API.GetInwardByDate.Url, _input).then(function SuccessCallback(response) {
                        if (response.data.Response) {
                            InwardDashboardCtrl.ePage.Masters.GetInwardByDateArrivalDate = [];
                            InwardDashboardCtrl.ePage.Masters.GetInwardByDateCount = [];

                            angular.forEach(response.data.Response, function (value1, key1) {
                                $filter("filter")(InwardDashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues, function (value, key) {
                                    if (value.ArrivalDate == value1.ArrivalDate) {
                                        value.Count = value1.Count;
                                    }
                                });
                            });

                            angular.forEach(InwardDashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues, function (value, key) {
                                InwardDashboardCtrl.ePage.Masters.GetInwardByDateArrivalDate.push($filter('date')(value.ArrivalDate, 'MM-dd'));
                                InwardDashboardCtrl.ePage.Masters.GetInwardByDateCount.push(value.Count);
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

        function GetInwardByClient(item, ToDate1, FromDate1) {

            // Get Values
            InwardDashboardCtrl.ePage.Masters.DummyGetInwardByClientvalues = [];

            //Current and Previous Date
            if (ToDate1) {
                InwardDashboardCtrl.ePage.Masters.ToDate1 = new Date(ToDate1);
            } else {
                InwardDashboardCtrl.ePage.Masters.ToDate1 = new Date();
            }

            if (FromDate1) {
                InwardDashboardCtrl.ePage.Masters.FromDate1 = new Date(FromDate1);
            } else {
                InwardDashboardCtrl.ePage.Masters.FromDate1 = new Date(InwardDashboardCtrl.ePage.Masters.ToDate1.getTime() - (6 * 24 * 60 * 60 * 1000));;
            }


            if (InwardDashboardCtrl.ePage.Masters.ToDate1 && InwardDashboardCtrl.ePage.Masters.FromDate1) {
                var timeDiff = Math.abs(InwardDashboardCtrl.ePage.Masters.FromDate1.getTime() - InwardDashboardCtrl.ePage.Masters.ToDate1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                for (var i = diffDays; i >= 0; i--) {
                    var mydate = new Date(InwardDashboardCtrl.ePage.Masters.ToDate1.getTime() - (i * 24 * 60 * 60 * 1000));
                    var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');

                    var obj = {
                        "ArrivalDate": filtereddate,
                        "Count": 0,
                        "ClientCode": "",
                    }
                    InwardDashboardCtrl.ePage.Masters.DummyGetInwardByClientvalues.push(obj);
                }
                var ArrivaldateTo = $filter('date')(InwardDashboardCtrl.ePage.Masters.ToDate1, 'yyyy-MM-dd');
                var ArrivaldateFrom = $filter('date')(InwardDashboardCtrl.ePage.Masters.FromDate1, 'yyyy-MM-dd');
            }

            if (ArrivaldateTo > ArrivaldateFrom) {
                if (diffDays <= 10) {
                    InwardDashboardCtrl.ePage.Masters.IsLoading = true;
                    var _filter = {
                        "SortColumn": "WOD_WorkOrderID",
                        "WarehouseCode": item.WarehouseCode,
                        "ArrivaldateFrom": ArrivaldateFrom,
                        "ArrivaldateTo": ArrivaldateTo,
                        "SortType": "DESC",
                        "PageNumber": 1,
                        "PageSize": 25
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": InwardDashboardCtrl.ePage.Entities.Header.API.GetInwardByClient.FilterID
                    };

                    apiService.post("eAxisAPI", InwardDashboardCtrl.ePage.Entities.Header.API.GetInwardByClient.Url, _input).then(function SuccessCallback(response) {
                        if (response.data.Response) {
                            InwardDashboardCtrl.ePage.Masters.TableValues = response.data.Response;
                            InwardDashboardCtrl.ePage.Masters.GetInwardByClientArrivalDate = [];
                            InwardDashboardCtrl.ePage.Masters.GetInwardByClientCount = [];
                            InwardDashboardCtrl.ePage.Masters.GetInwardByClientName = [];

                            angular.forEach(response.data.Response, function (value1, key1) {
                                $filter("filter")(InwardDashboardCtrl.ePage.Masters.DummyGetInwardByClientvalues, function (value, key) {
                                    if (value.ArrivalDate == value1.ArrivalDate) {
                                        value.Count = value1.Count;
                                        value.ClientCode = value1.ClientCode;
                                    }
                                });
                            });

                            angular.forEach(InwardDashboardCtrl.ePage.Masters.DummyGetInwardByClientvalues, function (value, key) {
                                InwardDashboardCtrl.ePage.Masters.GetInwardByClientArrivalDate.push($filter('date')(value.ArrivalDate, 'MM-dd'));
                                InwardDashboardCtrl.ePage.Masters.GetInwardByClientCount.push(value.Count);
                                InwardDashboardCtrl.ePage.Masters.GetInwardByClientName.push(value.ClientCode);
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