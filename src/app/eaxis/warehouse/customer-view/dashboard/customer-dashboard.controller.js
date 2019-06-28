(function () {
    "use strict";
    angular
        .module("Application")
        .controller("CustomerDashboardController", CustomerDashboardController);

    CustomerDashboardController.$inject = ["APP_CONSTANT", "apiService", "helperService", "$location", "toastr", "$filter", "customerConfig", "authService", "appConfig", "$timeout"];

    function CustomerDashboardController(APP_CONSTANT, apiService, helperService, $location, toastr, $filter, customerConfig, authService, appConfig, $timeout) {

        var DashboardCtrl = this;
        function Init() {
            DashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
            };
            DashboardCtrl.ePage.Masters.Config = customerConfig.Entities.Header;
            DashboardCtrl.ePage.Masters.Message = "Loading...";

            DashboardCtrl.ePage.Masters.selectedRow = -1;
            DashboardCtrl.ePage.Masters.Pagination = {};
            DashboardCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            DashboardCtrl.ePage.Masters.Pagination.MaxSize = 3;
            DashboardCtrl.ePage.Masters.Pagination.ItemsPerPage = 10;

            DashboardCtrl.ePage.Masters.GetProductWiseDetailsGrouping = GetProductWiseDetailsGrouping;

            DashboardCtrl.ePage.Masters.GetFilterList = GetFilterList;
            DashboardCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            DashboardCtrl.ePage.Masters.Filter = Filter;
            DashboardCtrl.ePage.Masters.GetAllDetails = GetAllDetails;

            GetWarehouseDetails();
            GetConfigDetails();
        }

        //#region  General Details

        function GetWarehouseDetails() {
            DashboardCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                MappingCode: 'USER_CMP_BRAN_WH_APP_TNT',
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                Item_FK: authService.getUserInfo().UserPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {

                    DashboardCtrl.ePage.Masters.WarehouseDetails = [];
                    angular.forEach(response.data.Response, function (value, key) {
                        var obj = {
                            "WarehouseCode": value.OtherEntityCode
                        };
                        DashboardCtrl.ePage.Masters.WarehouseDetails.push(obj);
                    })

                    DashboardCtrl.ePage.Masters.CurrentWarehouse = DashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    DashboardCtrl.ePage.Masters.Message = undefined;
                    GetOrganizationDetails();
                } else {
                    DashboardCtrl.ePage.Masters.IsLoading = false;
                    DashboardCtrl.ePage.Masters.Message = "Warehouse is not mapped to your Id ";
                }
            });
        }


        function GetOrganizationDetails() {
            DashboardCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                MappingCode: 'USER_ORG_APP_TNT',
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                Item_FK: authService.getUserInfo().UserPK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {

                    DashboardCtrl.ePage.Masters.OrganizationDetails = [];
                    angular.forEach(response.data.Response, function (value, key) {
                        var obj = {
                            "Code": value.AccessCode
                        };
                        DashboardCtrl.ePage.Masters.OrganizationDetails.push(obj);
                    })

                    DashboardCtrl.ePage.Masters.CurrentOrganization = DashboardCtrl.ePage.Masters.OrganizationDetails[0];

                    DashboardCtrl.ePage.Masters.Message = undefined;
                    DashboardCtrl.ePage.Masters.IsLoading = false;
                    GetAllDetails();
                } else {
                    DashboardCtrl.ePage.Masters.IsLoading = false;
                    DashboardCtrl.ePage.Masters.Message = "Organization does not mapped to your id...";
                }
            });
        }


        function GetAllDetails() {
            GetInwardDetails();
            GetOutwardDetails();
            GetProductWiseDetailsGrouping();
            GetStatusWiseDetails();
        }

        //#endregion

        //#region  Inward Chart Details

        function GetInwardDetails() {
            DashboardCtrl.ePage.Masters.InwardChartLoading = true;
            DashboardCtrl.ePage.Masters.GetInwardChartDetails = undefined;

            var ToDate = new Date();
            var FromDate = new Date(ToDate.getTime() - (6 * 24 * 60 * 60 * 1000));

            if (ToDate && FromDate) {
                DashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues = [];
                var timeDiff = Math.abs(FromDate.getTime() - ToDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                for (var i = diffDays; i >= 0; i--) {
                    var mydate = new Date(ToDate.getTime() - (i * 24 * 60 * 60 * 1000));
                    var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');

                    var obj = {
                        "FinalisedDate": filtereddate,
                        "Count": 0
                    }
                    DashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues.push(obj);
                }
                var FinalisedDateTo = $filter('date')(ToDate, 'yyyy-MM-dd');
                var FinalisedDateFrom = $filter('date')(FromDate, 'yyyy-MM-dd');
            }

            var _filter = {
                "WarehouseCode": DashboardCtrl.ePage.Masters.CurrentWarehouse.WarehouseCode,
                "ClientCode": DashboardCtrl.ePage.Masters.CurrentOrganization.Code,
                "WorkOrderType": 'INW',
                "FinalisedDateFrom": FinalisedDateFrom,
                "FinalisedDateTo": FinalisedDateTo
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": DashboardCtrl.ePage.Masters.Config.API.ProductWiseLineDetails.FilterID
            };
            apiService.post("eAxisAPI", DashboardCtrl.ePage.Masters.Config.API.ProductWiseLineDetails.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DashboardCtrl.ePage.Masters.GetInwardChartDetails = response.data.Response;

                    angular.forEach(response.data.Response, function (value1, key1) {
                        $filter("filter")(DashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues, function (value, key) {
                            if (value.FinalisedDate == value1.FinalisedDate) {
                                value.Count = value1.TotalUnits + value.Count
                            }
                        });
                    });

                    DrawInwardChart();
                }
            });
        }

        function DrawInwardChart() {
            DashboardCtrl.ePage.Masters.InwardChartLoading = false;

            var ctx = "lineChartinward";
            var mycount = DashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues.map(function (val, key) {
                return val.Count;
            });
            var maximumcount = Math.max.apply(null, mycount);
            var config = {
                type: "line",
                data: {
                    labels: DashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues.map(function (value, key) {
                        return $filter('date')(value.FinalisedDate, 'MM-dd')
                    }),
                    datasets: [{
                        label: "Units",
                        data: DashboardCtrl.ePage.Masters.DummyGetInwardByDatevalues.map(function (value, key) {
                            return value.Count
                        }),
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
                        titleFontSize: 14
                    },
                    legend: {
                        display: false
                    }
                }
            }

            var myChart = new Chart(ctx, config);

            myChart.destroy();
            myChart = new Chart(ctx, config);

            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            });
        }

        //#endregion

        //#region Outward Chart Details

        function GetOutwardDetails() {
            DashboardCtrl.ePage.Masters.OutwardChartLoading = true;
            DashboardCtrl.ePage.Masters.GetOutwardChartDetails = undefined;

            var ToDate = new Date();
            var FromDate = new Date(ToDate.getTime() - (6 * 24 * 60 * 60 * 1000));

            if (ToDate && FromDate) {
                DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues = [];
                var timeDiff = Math.abs(FromDate.getTime() - ToDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                for (var i = diffDays; i >= 0; i--) {
                    var mydate = new Date(ToDate.getTime() - (i * 24 * 60 * 60 * 1000));
                    var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');

                    var obj = {
                        "FinalisedDate": filtereddate,
                        "Count": 0
                    }
                    DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues.push(obj);
                }
                var FinalisedDateTo = $filter('date')(ToDate, 'yyyy-MM-dd');
                var FinalisedDateFrom = $filter('date')(FromDate, 'yyyy-MM-dd');
            }

            var _filter = {
                "WarehouseCode": DashboardCtrl.ePage.Masters.CurrentWarehouse.WarehouseCode,
                "ClientCode": DashboardCtrl.ePage.Masters.CurrentOrganization.Code,
                "WorkOrderType": 'ORD',
                "FinalisedDateFrom": FinalisedDateFrom,
                "FinalisedDateTo": FinalisedDateTo
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": DashboardCtrl.ePage.Masters.Config.API.ProductWiseLineDetails.FilterID
            };
            apiService.post("eAxisAPI", DashboardCtrl.ePage.Masters.Config.API.ProductWiseLineDetails.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DashboardCtrl.ePage.Masters.GetOutwardChartDetails = response.data.Response;

                    angular.forEach(response.data.Response, function (value1, key1) {
                        $filter("filter")(DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues, function (value, key) {
                            if (value.FinalisedDate == value1.FinalisedDate) {
                                value.Count = value1.TotalUnits + value.Count
                            }
                        });
                    });

                    DrawOutwardChart();
                }
            });
        }

        function DrawOutwardChart() {
            DashboardCtrl.ePage.Masters.OutwardChartLoading = false;

            var mycount = DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues.map(function (val, key) {
                return val.Count;
            });

            var maximumcount = Math.max.apply(null, mycount);
            var ctx = "lineChartoutward";
            var config = {
                type: "line",
                data: {
                    labels: DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues.map(function (value, key) {
                        return $filter('date')(value.FinalisedDate, 'MM-dd')
                    }),
                    datasets: [{
                        label: "Units",
                        data: DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues.map(function (value, key) {
                            return value.Count
                        }),
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
                        titleFontSize: 14
                    },
                    legend: {
                        display: false
                    }
                }
            }
            var myChart = new Chart(ctx, config);
            myChart.destroy();
            myChart = new Chart(ctx, config);

            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            })

        }

        //#endregion

        //#region Product Wise Line Details

        function GetProductWiseDetailsGrouping() {
            DashboardCtrl.ePage.Masters.ProductChartLoading = true;
            DashboardCtrl.ePage.Masters.ProductDetails = undefined;

            var _filter = {
                "SortColumn": "DPD_ProductCode",
                "SortType": "DESC",
                "PageNumber": DashboardCtrl.ePage.Masters.Pagination.CurrentPage,
                "PageSize": "10",
                "WarehouseCode": DashboardCtrl.ePage.Masters.CurrentWarehouse.WarehouseCode,
                "ClientCode": DashboardCtrl.ePage.Masters.CurrentOrganization.Code
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": DashboardCtrl.ePage.Masters.Config.API.DashboardProductWiseDetailsGrouping.FilterID
            };

            apiService.post("eAxisAPI", DashboardCtrl.ePage.Masters.Config.API.DashboardProductWiseDetailsGrouping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DashboardCtrl.ePage.Masters.ProductDetails = response.data.Response;
                    DashboardCtrl.ePage.Masters.ProductDetailsLength = response.data.Count
                    DrawProductChart();
                }
            });
        }

        function DrawProductChart() {

            DashboardCtrl.ePage.Masters.BackGroundColors = [];
            DashboardCtrl.ePage.Masters.ProductDetails.map(function (val, key) {
                var randomR = Math.floor((Math.random() * 130) + 100);
                var randomG = Math.floor((Math.random() * 130) + 100);
                var randomB = Math.floor((Math.random() * 130) + 100);
                var graphBackground = "rgb(" + randomR + ", " + randomG + ", " + randomB + ")";
                DashboardCtrl.ePage.Masters.BackGroundColors.push(graphBackground);
            });

            DashboardCtrl.ePage.Masters.ProductChartLoading = false;

            var ctx = document.getElementById("myChart").getContext('2d');
            var config = {
                type: 'pie',
                animation: {
                    animateRotate: true
                },
                data: {
                    labels: DashboardCtrl.ePage.Masters.ProductDetails.map(function (value, key) {
                        return value.ProductCode;
                    }),

                    datasets: [{
                        backgroundColor: DashboardCtrl.ePage.Masters.BackGroundColors,
                        data: DashboardCtrl.ePage.Masters.ProductDetails.map(function (value, key) {
                            return value.ClosingStock;
                        })
                    }]
                },
                options: {
                    legend: {
                        display: false
                    }
                }
            }

            var myChart = new Chart(ctx, config);
            myChart.destroy();
            myChart = new Chart(ctx, config);

            myChart.update();
        }

        //#endregion

        //#region Filters

        function GetConfigDetails() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "CustomerProductWiseDetailsGrouping"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    DashboardCtrl.ePage.Masters.DynamicControl = response.data.Response;


                    if (DashboardCtrl.ePage.Masters.defaultFilter !== undefined) {
                        DashboardCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = DashboardCtrl.ePage.Masters.defaultFilter;
                        });
                    }
                    DashboardCtrl.ePage.Masters.ViewType = 1;
                }
            });
        }

        function CloseFilterList() {
            $('#filterSideBar' + "CustomerProductWiseDetailsGrouping").removeClass('open');
        }

        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "CustomerProductWiseDetailsGrouping").toggleClass('open');
            });
        }

        function Filter() {
            DashboardCtrl.ePage.Masters.ProductDetails = undefined;
            DashboardCtrl.ePage.Masters.ProductChartLoading = true;

            $(".filter-sidebar-wrapper").toggleClass("open");

            var FilterObj = {
                "ProductCode": DashboardCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                "WarehouseCode": DashboardCtrl.ePage.Masters.CurrentWarehouse.WarehouseCode,
                "ClientCode": DashboardCtrl.ePage.Masters.CurrentOrganization.Code,
                "SortColumn": "DPD_ProductCode",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 10
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(FilterObj),
                "FilterID": DashboardCtrl.ePage.Masters.Config.API.DashboardProductWiseDetailsGrouping.FilterID,
            };
            apiService.post("eAxisAPI", DashboardCtrl.ePage.Masters.Config.API.DashboardProductWiseDetailsGrouping.Url, _input).then(function (response) {
                DashboardCtrl.ePage.Masters.ProductDetails = response.data.Response;
                DashboardCtrl.ePage.Masters.ProductDetailsLength = response.data.Count;
                DrawProductChart();
            });
        }

        //#endregion

        //#region  Status Wise Details

        function GetStatusWiseDetails() {
            DashboardCtrl.ePage.Masters.InwardStatusWiseSummaryDetails = '';
            DashboardCtrl.ePage.Masters.OutwardStatusWiseSummaryDetails = '';
            var FilterObj = {
                "WarehouseCode": DashboardCtrl.ePage.Masters.CurrentWarehouse.WarehouseCode,
                "ClientCode": DashboardCtrl.ePage.Masters.CurrentOrganization.Code,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(FilterObj),
                "FilterID": DashboardCtrl.ePage.Masters.Config.API.WorkOrderStatusWiseSummary.FilterID,
            };
            apiService.post("eAxisAPI", DashboardCtrl.ePage.Masters.Config.API.WorkOrderStatusWiseSummary.Url, _input).then(function (response) {
                angular.forEach(response.data.Response, function (value, key) {
                    if (value.WorkOrderType == 'INW') {
                        DashboardCtrl.ePage.Masters.InwardStatusWiseSummaryDetails = value;
                    } else {
                        DashboardCtrl.ePage.Masters.OutwardStatusWiseSummaryDetails = value;
                    }
                })
            });
        }

        //#endregion

        Init();
    }

})();