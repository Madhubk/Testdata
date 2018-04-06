(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DcDashboardController", DcDashboardController);

    DcDashboardController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function DcDashboardController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $injector, $window, confirmation) {

        var DcDashboardCtrl = this;

        function Init() {

            DcDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "DC-Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };

            DcDashboardCtrl.ePage.Masters.emptyText = "-";
            DcDashboardCtrl.ePage.Masters.GotoReceiveItemsPage = GotoReceiveItemsPage;
            getOrgSender();
        }

        function GotoReceiveItemsPage() {
            var _queryString = {
                PK: null,
                ManifestNumber: null
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/receivelines/" + _queryString, "_blank");
        }

        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "SortColumn": "WUA_Code",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.SenderDetails = response.data.Response[0];
                    if (DcDashboardCtrl.ePage.Masters.SenderDetails) {
                        // to get sender is store or DC or depot
                        DcDashboardCtrl.ePage.Masters.isUser = true;
                        getSenderType()
                    } else {
                        CManifestSummary()
                        DcDashboardCtrl.ePage.Masters.isUser = false;
                    }
                }
            });
        }
        // For User Dashboard
        function getSenderType() {
            // get Sender Type thru Findall
            var _filter = {
                "SortColumn": "ORG_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "Code": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGHEAD"
            };
            apiService.post("eAxisAPI", "OrgHeader/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.SenderTypeDetails = response.data.Response[0];
                    SManifestSummary();
                    RManifestSummary();

                }
            });
        }
        // find all thru Org as Sender 
        function SManifestSummary() {
            var _filter = {
                "SortColumn": "TMM_ManifestCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "SenderCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMASM"
            };
            apiService.post("eAxisAPI", "TmsManifestSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.ManifestSummary = response.data.Response;
                    SConsignmentSummary();
                }
            });
        }

        function SConsignmentSummary() {
            var _filter = {
                "SortColumn": "TMC_ConsignmentCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "SenderCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSCOSM"
            };
            apiService.post("eAxisAPI", "TmsConsignmentSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.ConsignmentSummary = response.data.Response;
                    SItemSummary();
                }
            });
        }

        function SItemSummary() {
            var _filter = {
                "SortColumn": "TIT_ItemCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "SenderCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSITSM"
            };
            apiService.post("eAxisAPI", "TmsItemSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.ItemSummary = response.data.Response;
                    Stotalsummary();
                }
            });
        }

        function Stotalsummary() {
            angular.forEach(DcDashboardCtrl.ePage.Masters.ManifestSummary, function (value, key) {
                value.ConsignmentCount = 0;
                angular.forEach(DcDashboardCtrl.ePage.Masters.ConsignmentSummary, function (value1, key1) {
                    if (value.ReceiverCode == value1.ReceiverCode) {
                        value.ConsignmentCount = value.ConsignmentCount + value1.ConsignmentCount;
                    }
                });
            });
            angular.forEach(DcDashboardCtrl.ePage.Masters.ManifestSummary, function (value, key) {
                value.ItemCount = 0;
                angular.forEach(DcDashboardCtrl.ePage.Masters.ItemSummary, function (value1, key1) {
                    if (value.ReceiverCode == value1.ReceiverCode) {
                        value.ItemCount = value.ItemCount + value1.ItemCount;
                    }
                });
            });
            piecolor();
            getManifestIntransitChart();
            getConsignmentIntransitChart();
            getItemIntransitChart();

            getManifestToBeArrivedChart();
            getConsignmentToBeArrivedChart();
            getItemToBeArrivedChart(); 

            getManifestPendingChart();
            getConsignmentPendingChart();
            getItemPendingChart();

            getManifestReceivedChart();
            getConsignmentReceivedChart();
            getItemReceivedChart();

            // getManifestStockChart();
            // getConsignmentStockChart();
            getItemStockChart();
        }
        // findall thru Org as receiver
        function RManifestSummary() {
            var _filter = {
                "SortColumn": "TMM_ManifestCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "ReceiverCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMASM"
            };
            apiService.post("eAxisAPI", "TmsManifestSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.RManifestSummary = response.data.Response;
                    RConsignmentSummary();
                }
            });
        }

        function RConsignmentSummary() {
            var _filter = {
                "SortColumn": "TMC_ConsignmentCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "ReceiverCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSCOSM"
            };
            apiService.post("eAxisAPI", "TmsConsignmentSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.RConsignmentSummary = response.data.Response;
                    RItemSummary();
                }
            });
        }

        function RItemSummary() {
            var _filter = {
                "SortColumn": "TIT_ItemCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 30,
                "ReceiverCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSITSM"
            };
            apiService.post("eAxisAPI", "TmsItemSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.RItemSummary = response.data.Response;
                    Stotalsummary();
                    DcDashboardCtrl.ePage.Masters.currentStock = [];
                    angular.forEach(DcDashboardCtrl.ePage.Masters.RItemSummary, function (value, key) {
                        if (value.ItemStatus) {
                            DcDashboardCtrl.ePage.Masters.currentStock.push(value)
                        }
                    });
                    console.log(DcDashboardCtrl.ePage.Masters.currentStock);
                }
            });
            Rtotalsummary()
        }

        function Rtotalsummary() {
            angular.forEach(DcDashboardCtrl.ePage.Masters.RManifestSummary, function (value, key) {
                value.ConsignmentCount = 0;
                angular.forEach(DcDashboardCtrl.ePage.Masters.RConsignmentSummary, function (value1, key1) {
                    if (value.ReceiverCode == value1.ReceiverCode) {
                        value.ConsignmentCount = value.ConsignmentCount + value1.ConsignmentCount;
                    }
                });
            });
            angular.forEach(DcDashboardCtrl.ePage.Masters.RManifestSummary, function (value, key) {
                value.ItemCount = 0;
                angular.forEach(DcDashboardCtrl.ePage.Masters.RItemSummary, function (value1, key1) {
                    if (value.ReceiverCode == value1.ReceiverCode) {
                        value.ItemCount = value.ItemCount + value1.ItemCount;
                    }
                });
            });
            console.log(DcDashboardCtrl.ePage.Masters.RManifestSummary)
            piecolor();
            
            getManifestIntransitChart();
            getConsignmentIntransitChart();
            getItemIntransitChart();

            getManifestToBeArrivedChart();
            getConsignmentToBeArrivedChart();
            getItemToBeArrivedChart();

            getManifestPendingChart();
            getConsignmentPendingChart();
            getItemPendingChart();

            getManifestReceivedChart();
            getConsignmentReceivedChart();
            getItemReceivedChart();

            getManifestTransitChart();
            getConsignmentTransitChart();
            getItemTransitChart();

            getItemStockChart();
            
            getPortManifestArrived();
            getPortConsignmentArrived();
            getPortItemArrived();            

        }
        // colors for every item in piecolor
        function piecolor() {
            DcDashboardCtrl.ePage.Masters.coloR1 = [];
            DcDashboardCtrl.ePage.Masters.coloR2 = [];
            DcDashboardCtrl.ePage.Masters.coloR3 = [];
            var dynamicColors = function () {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgba(" + r + "," + g + "," + b + "," + 0.4 + ")";
            };

            for (var i in DcDashboardCtrl.ePage.Masters.ManifestSummary) {
                DcDashboardCtrl.ePage.Masters.coloR1.push(dynamicColors());
                DcDashboardCtrl.ePage.Masters.coloR2.push(dynamicColors());
                DcDashboardCtrl.ePage.Masters.coloR3.push(dynamicColors());
            }

            DcDashboardCtrl.ePage.Masters.InTransitManifestCount = [];
            DcDashboardCtrl.ePage.Masters.InTransitConsignmentCount = [];
            DcDashboardCtrl.ePage.Masters.InTransitItemCount = [];
            DcDashboardCtrl.ePage.Masters.InTransitlabel = [];

            DcDashboardCtrl.ePage.Masters.PendingManifestCount = [];
            DcDashboardCtrl.ePage.Masters.PendingConsinmentCount = [];
            DcDashboardCtrl.ePage.Masters.PendingItemCount = [];
            DcDashboardCtrl.ePage.Masters.Pendinglabel = [];

            for (i = 0; i < DcDashboardCtrl.ePage.Masters.ManifestSummary.length; i++) {
                if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestStatus == "DSP") {
                    DcDashboardCtrl.ePage.Masters.InTransitManifestCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.InTransitConsignmentCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ConsignmentCount)
                    DcDashboardCtrl.ePage.Masters.InTransitItemCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ItemCount)
                    DcDashboardCtrl.ePage.Masters.InTransitlabel.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ReceiverName)                    
                } else if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestStatus == "DRF") {
                    DcDashboardCtrl.ePage.Masters.PendingManifestCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.PendingConsinmentCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ConsignmentCount)
                    DcDashboardCtrl.ePage.Masters.PendingItemCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ItemCount)
                    DcDashboardCtrl.ePage.Masters.Pendinglabel.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ReceiverName)
                }
            }
            // for Receiver
            for (var i in DcDashboardCtrl.ePage.Masters.RManifestSummary) {
                DcDashboardCtrl.ePage.Masters.coloR1.push(dynamicColors());
            }
            DcDashboardCtrl.ePage.Masters.RToBeArrivedManifestCount = [];
            DcDashboardCtrl.ePage.Masters.RToBeArrivedConsignmentCount = [];
            DcDashboardCtrl.ePage.Masters.RToBeArrivedItemCount = [];
            DcDashboardCtrl.ePage.Masters.RBeArrivedlabel = [];

            DcDashboardCtrl.ePage.Masters.RTransitManifestCount = [];
            DcDashboardCtrl.ePage.Masters.RTransitConsignmentCount = [];
            DcDashboardCtrl.ePage.Masters.RTransitItemCount = [];
            DcDashboardCtrl.ePage.Masters.RTransitlabel = [];

            DcDashboardCtrl.ePage.Masters.RToBeArrivedDelManifestCount = [];
            DcDashboardCtrl.ePage.Masters.RToBeArrivedDelConsignmentCount = [];
            DcDashboardCtrl.ePage.Masters.RToBeArrivedDelItemCount = [];
            DcDashboardCtrl.ePage.Masters.RToBeArrivedlabel = [];

            DcDashboardCtrl.ePage.Masters.ArrivedManifestCount = [];
            DcDashboardCtrl.ePage.Masters.ArrivedConsignmentCount = [];
            DcDashboardCtrl.ePage.Masters.ArrivedItemCount = [];
            DcDashboardCtrl.ePage.Masters.Arrivedlabel = [];

            for (i = 0; i < DcDashboardCtrl.ePage.Masters.RManifestSummary.length; i++) {
                if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestStatus == "DEL") {
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedDelManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedDelConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedDelItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedlabel.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ReceiverName)
                } else if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestStatus == "DSP") {
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    DcDashboardCtrl.ePage.Masters.RBeArrivedlabel.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ReceiverName)
                    // intransit for store - DSP - org as Receiver
                    DcDashboardCtrl.ePage.Masters.RTransitManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.RTransitConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    DcDashboardCtrl.ePage.Masters.RTransitItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    DcDashboardCtrl.ePage.Masters.RTransitlabel.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ReceiverName)
                } else if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestStatus == "ARV") {
                    DcDashboardCtrl.ePage.Masters.ArrivedManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.ArrivedConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    DcDashboardCtrl.ePage.Masters.ArrivedItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    DcDashboardCtrl.ePage.Masters.Arrivedlabel.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ReceiverName)
                }
            }
            // For Item
            for (var i in DcDashboardCtrl.ePage.Masters.currentStock) {
                DcDashboardCtrl.ePage.Masters.coloR1.push(dynamicColors());
            }

            var test1 = _.groupBy(DcDashboardCtrl.ePage.Masters.currentStock, 'SenderCode');
            DcDashboardCtrl.ePage.Masters.sumArray = [];
            DcDashboardCtrl.ePage.Masters.Itemsender = [];
            DcDashboardCtrl.ePage.Masters.ItemSumCount = [];
            for (var x in test1) {
                var test2 = _.sumBy(test1[x], function (o) {
                    return o.ItemCount;
                });
                var tempObj = {
                    "SenderCode": x,
                    "ItemCountSum": test2
                }
                DcDashboardCtrl.ePage.Masters.sumArray.push(tempObj)
                DcDashboardCtrl.ePage.Masters.Itemsender.push(tempObj.SenderCode)
                DcDashboardCtrl.ePage.Masters.ItemSumCount.push(tempObj.ItemCountSum)
                console.log(DcDashboardCtrl.ePage.Masters.sumArray);
            }
        }
        // Pie Charts
        // common Legent
        function commonLegentCallBack(chart) {
            var text = [];
            text.push('<ul class="' + chart.id + '-legend">');
            for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
                text.push('<li>');
                if (chart.data.labels[i]) {
                    text.push('<span class="legend-count" style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '">' + chart.data.datasets[0].data[i] + '</span>');
                    text.push('<p title="' + chart.data.labels[i] + '">' + chart.data.labels[i] + '</p>');
                }
                text.push('</li>');
            }
            text.push('</ul>');
            return text.join("")
        }
        //  DC , Depot , Port - Intransit 
        function getManifestIntransitChart() {
            var ctx = "man-intransit";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.InTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.InTransitManifestCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderWidth: 1,
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index',
                    },
                    legend: {
                        display: false,
                        position: 'right',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 15,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#man-int").html(myChart.generateLegend());
        }
        function getConsignmentIntransitChart() {
            var ctx = "con-intransit";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.InTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.InTransitConsignmentCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderWidth: 1,
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index',
                    },
                    legend: {
                        display: false,
                        position: 'right',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 15,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#con-int").html(myChart.generateLegend());
        }
        function getItemIntransitChart() {
            var ctx = "item-intransit";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.InTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.InTransitItemCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderWidth: 1,
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index',
                    },
                    legend: {
                        display: false,
                        position: 'right',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 15,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#item-int").html(myChart.generateLegend());
        }
        
        // depot , Port - To Be Arrived
        function getManifestToBeArrivedChart() {
            var ctx = "man-tobearr";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RBeArrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RToBeArrivedManifestCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#man-arr").html(myChart.generateLegend());
        }
        function getConsignmentToBeArrivedChart() {
            var ctx = "con-tobearr";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RBeArrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RToBeArrivedConsignmentCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#con-arr").html(myChart.generateLegend());
        }
        function getItemToBeArrivedChart() {
            var ctx = "item-tobearr";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RBeArrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RToBeArrivedConsignmentCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#item-arr").html(myChart.generateLegend());
        }
        
        // Depot , DC - Pending
        function getManifestPendingChart() {
            var ctx = "man-pending";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.Pendinglabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.PendingManifestCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#man-pend").html(myChart.generateLegend());
        }
        function getConsignmentPendingChart() {
            var ctx = "con-pending";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.Pendinglabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.PendingConsinmentCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#con-pend").html(myChart.generateLegend());
        }
        function getItemPendingChart() {
            var ctx = "item-pending";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.Pendinglabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.PendingItemCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#item-pend").html(myChart.generateLegend());
        }

        // store - Received
        function getManifestReceivedChart() {
            var ctx = "man-received";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RToBeArrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RToBeArrivedCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#man-rec").html(myChart.generateLegend());
        }
        function getConsignmentReceivedChart() {
            var ctx = "con-received";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RToBeArrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RToBeArrivedCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#con-rec").html(myChart.generateLegend());
        }
        function getItemReceivedChart() {
            var ctx = "item-received";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RToBeArrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RToBeArrivedCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#item-rec").html(myChart.generateLegend());
        }
        
        // store  - transit 
        function getManifestTransitChart() {
            var ctx = "pie";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RTransitManifestCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#man-int").html(myChart.generateLegend());
        }
        function getConsignmentTransitChart() {
            var ctx = "pie";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RTransitConsignmentCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#con-int").html(myChart.generateLegend());
        }
        function getItemTransitChart() {
            var ctx = "pie";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RTransitItemCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#item-int").html(myChart.generateLegend());
        }

        // depot - Stock in Hand
        function getItemStockChart() {
            var ctx = "item-stock";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.Itemsender,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.ItemSumCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
            $("#item-stok").html(myChart.generateLegend());
        }

        // port - Arrived 
        function getPortManifestArrived() {
            var ctx = "man-portarr";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.Arrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.ArrivedManifestCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR1,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
             $("#man-arrived").html(myChart.generateLegend());
        }
        function getPortConsignmentArrived() {
            var ctx = "con-portarr";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.Arrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.ArrivedConsignmentCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR2,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
             $("#con-arrived").html(myChart.generateLegend());
        }
        function getPortItemArrived() {
            var ctx = "item-portarr";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.RManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.Arrivedlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.ArrivedItemCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR3,
                        borderWidth: 1
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10,
                            boxWidth: 10,
                        }
                    },
                    legendCallback: commonLegentCallBack
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
             $("#item-arrived").html(myChart.generateLegend());
        }

        // FOR Consolidated Dashboard
        function CManifestSummary() {
            var _filter = {
                "SortColumn": "TMM_ManifestCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMASM"
            };
            apiService.post("eAxisAPI", "TmsManifestSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.CManifestSummary = response.data.Response;
                    CConsignmentSummary();
                }
            });
        }

        function CConsignmentSummary() {
            var _filter = {
                "SortColumn": "TMC_ConsignmentCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSCOSM"
            };
            apiService.post("eAxisAPI", "TmsConsignmentSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.CConsignmentSummary = response.data.Response;
                    CItemSummary();
                }
            });
        }

        function CItemSummary() {
            var _filter = {
                "SortColumn": "TIT_ItemCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSITSM"
            };
            apiService.post("eAxisAPI", "TmsItemSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.CItemSummary = response.data.Response;
                    Ctotalsummary();
                }
            });
        }

        function Ctotalsummary() {
            angular.forEach(DcDashboardCtrl.ePage.Masters.CManifestSummary, function (value, key) {
                value.ConsignmentCount = 0;
                angular.forEach(DcDashboardCtrl.ePage.Masters.CConsignmentSummary, function (value1, key1) {
                    if (value.ReceiverCode == value1.ReceiverCode) {
                        value.ConsignmentCount = value.ConsignmentCount + value1.ConsignmentCount;
                    }
                });
            });
            angular.forEach(DcDashboardCtrl.ePage.Masters.CManifestSummary, function (value, key) {
                value.ItemCount = 0;
                angular.forEach(DcDashboardCtrl.ePage.Masters.CItemSummary, function (value1, key1) {
                    if (value.ReceiverCode == value1.ReceiverCode) {
                        value.ItemCount = value.ItemCount + value1.ItemCount;
                    }
                });
            });
            Cpiecolor()
        }

        function Cpiecolor() {
            DcDashboardCtrl.ePage.Masters.coloR = [];
            var dynamicColors = function () {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgba(" + r + "," + g + "," + b + "," + 0.4 + ")";
            };

            for (var i in DcDashboardCtrl.ePage.Masters.CManifestSummary) {
                DcDashboardCtrl.ePage.Masters.coloR.push(dynamicColors());
            }

            DcDashboardCtrl.ePage.Masters.InTransitCount = [];
            DcDashboardCtrl.ePage.Masters.InTransitlabel = [];
            for (i = 0; i < DcDashboardCtrl.ePage.Masters.CManifestSummary.length; i++) {
                if (DcDashboardCtrl.ePage.Masters.CManifestSummary) {
                    DcDashboardCtrl.ePage.Masters.InTransitCount.push(DcDashboardCtrl.ePage.Masters.CManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.InTransitlabel.push(DcDashboardCtrl.ePage.Masters.CManifestSummary[i].ReceiverName)
                }
            }
            getConsolTransitChartDetails()
        }

        function getConsolTransitChartDetails() {
            var ctx = "pie";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.InTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.InTransitCount,
                        backgroundColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderColor: DcDashboardCtrl.ePage.Masters.coloR,
                        borderWidth: 1
                    }],
                },
                options: {
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize: 14,
                        mode: 'index'
                    },
                    legend: {
                        display: true,
                        position: 'left',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10
                        }
                    }
                }
            });

            // myChart.update({
            //     duration: 800,
            //     easing: 'easeOutBounce'
            // })
        }
        Init();
    }
})();