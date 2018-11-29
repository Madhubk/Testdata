(function () {
    "use strict";
    angular
        .module("Application")
        .controller("CustomerOutwardDashboardController", CustomerOutwardDashboardController);

    CustomerOutwardDashboardController.$inject = [ "APP_CONSTANT", "apiService",  "helperService", "$location", "toastr", "$filter","outwardConfig","authService"];

    function CustomerOutwardDashboardController(APP_CONSTANT, apiService, helperService, $location, toastr, $filter,outwardConfig,authService) {

        var DashboardCtrl = this;

        function Init() {
            DashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": outwardConfig.Entities,
            };


            DashboardCtrl.ePage.Masters.Getsummarydetails = Getsummarydetails;
            DashboardCtrl.ePage.Masters.GetOutwardByDate = GetOutwardByDate;
            DashboardCtrl.ePage.Masters.GetWarehouseValues = GetWarehouseValues;

           

            GetWarehouseValues();
            GetPiechartDetails();
        }

        
        function getChartDetails() {
            var ctx = "lineChart";
            var maximumcount = Math.max.apply(null, DashboardCtrl.ePage.Masters.GetOutwardByDateCount);
            var myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: DashboardCtrl.ePage.Masters.GetOutwardByDateRequiredDate,
                    datasets: [{
                        label: "Outward",
                        data: DashboardCtrl.ePage.Masters.GetOutwardByDateCount,
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
            DashboardCtrl.ePage.Masters.IsLoading = false;

        }


        function GetWarehouseValues() {
            //Get Warehouse Details
            DashboardCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "Code": authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID":DashboardCtrl.ePage.Entities.Header.API.WmsUserAccess.FilterID
            };

            apiService.post("eAxisAPI", DashboardCtrl.ePage.Entities.Header.API.WmsUserAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    DashboardCtrl.ePage.Masters.userselected = DashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    Getsummarydetails(DashboardCtrl.ePage.Masters.WarehouseDetails[0]);
                }
            });

        }


        function Getsummarydetails(item) {
            DashboardCtrl.ePage.Masters.IsLoading = true;
            DashboardCtrl.ePage.Masters.SelectedWarehouse = item;
            var _filter = {
                "WarehouseCode": item.WarehouseCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": DashboardCtrl.ePage.Entities.Header.API.Summary.FilterID,
            };

            apiService.post("eAxisAPI", DashboardCtrl.ePage.Entities.Header.API.Summary.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DashboardCtrl.ePage.Masters.SummaryDetails = response.data.Response[0];
                    DashboardCtrl.ePage.Masters.IsLoading = false;
                }
            });
            GetOutwardByDate(item, undefined, undefined);
        }


        function GetOutwardByDate(item, ToDate, FromDate) {

            // Get Values
            DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues = [];

            //Current and Previous Date
            if (ToDate) {
                DashboardCtrl.ePage.Masters.ToDate = new Date(ToDate);
            } else {
                DashboardCtrl.ePage.Masters.ToDate = new Date();
            }

            if (FromDate) {
                DashboardCtrl.ePage.Masters.FromDate = new Date(FromDate);
            } else {
                DashboardCtrl.ePage.Masters.FromDate = new Date(DashboardCtrl.ePage.Masters.ToDate.getTime() - (6 * 24 * 60 * 60 * 1000));;
            }

            if (DashboardCtrl.ePage.Masters.ToDate && DashboardCtrl.ePage.Masters.FromDate) {
                var timeDiff = Math.abs(DashboardCtrl.ePage.Masters.FromDate.getTime() - DashboardCtrl.ePage.Masters.ToDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                for (var i = diffDays; i >= 0; i--) {
                    var mydate = new Date(DashboardCtrl.ePage.Masters.ToDate.getTime() - (i * 24 * 60 * 60 * 1000));
                    var filtereddate = $filter('date')(mydate, 'yyyy-MM-dd');

                    var obj = {
                        "ArrivalDate": filtereddate,
                        "Count": 0
                    }
                    DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues.push(obj);
                }
                var ArrivaldateTo = $filter('date')(DashboardCtrl.ePage.Masters.ToDate, 'yyyy-MM-dd');
                var ArrivaldateFrom = $filter('date')(DashboardCtrl.ePage.Masters.FromDate, 'yyyy-MM-dd');
            }

            if (ArrivaldateTo > ArrivaldateFrom) {
                if (diffDays <= 10) {
                    DashboardCtrl.ePage.Masters.IsLoading = true;
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
                        "FilterID": DashboardCtrl.ePage.Entities.Header.API.GetOutwardByDate.FilterID
                    };

                    apiService.post("eAxisAPI", DashboardCtrl.ePage.Entities.Header.API.GetOutwardByDate.Url, _input).then(function SuccessCallback(response) {
                        if (response.data.Response) {
                            DashboardCtrl.ePage.Masters.GetOutwardByDateRequiredDate = [];
                            DashboardCtrl.ePage.Masters.GetOutwardByDateCount = [];
                            DashboardCtrl.ePage.Masters.TableValues = response.data.Response;
                            angular.forEach(response.data.Response, function (value1, key1) {
                                $filter("filter")(DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues, function (value, key) {
                                    if (value.ArrivalDate == value1.ArrivalDate) {
                                        value.Count = value1.Count;
                                    }
                                });
                            });

                            angular.forEach(DashboardCtrl.ePage.Masters.DummyGetOutwardByDatevalues, function (value, key) {
                                DashboardCtrl.ePage.Masters.GetOutwardByDateRequiredDate.push($filter('date')(value.ArrivalDate, 'MM-dd'));
                                DashboardCtrl.ePage.Masters.GetOutwardByDateCount.push(value.Count);
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


        function GetPiechartDetails(){
            var _filter = {
                "SortColumn": "WOL_WAR_WarehouseCode",
                "SortType":"DESC",
                "PageNumber":"1",
                "PageSize":"10"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID":DashboardCtrl.ePage.Entities.Header.API.WMSInventoryByProductDetail.FilterID
            };
              apiService.post("eAxisAPI", DashboardCtrl.ePage.Entities.Header.API.WMSInventoryByProductDetail.Url, _input).then(function SuccessCallback(response){
                DashboardCtrl.ePage.Masters.ProductDetails = response.data.Response;
                DashboardCtrl.ePage.Masters.BackGroundColors = [];
                response.data.Response.map(function(val,key){
                    var randomR = Math.floor((Math.random() * 130) + 100);
                    var randomG = Math.floor((Math.random() * 130) + 100);
                    var randomB = Math.floor((Math.random() * 130) + 100);
                    var graphBackground = "rgb(" + randomR + ", " + randomG + ", " + randomB + ")";
                    DashboardCtrl.ePage.Masters.BackGroundColors.push(graphBackground);
                });
                

                var ctx = document.getElementById("myChart").getContext('2d');
                var myChart = new Chart(ctx, {
                type: 'pie',
                animation: {
                    animateRotate:true
                },
                data: {
                    labels: DashboardCtrl.ePage.Masters.ProductDetails.map(function(value){
                        return value.ProductCode;
                    }),
                    
                    datasets: [{
                    backgroundColor: DashboardCtrl.ePage.Masters.BackGroundColors,
                    data: DashboardCtrl.ePage.Masters.ProductDetails.map(function(value){
                        return value.TotalUnits;
                    })
                    }]
                },
                options: {
                    legend: {
                        display: false,
                        pieceLabel: {
                            render: 'label'
                          }
                    }
                }
                });
                
              });
        }

        Init();
    }

})();