(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DcDashboardController", DcDashboardController);

    DcDashboardController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$interval", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "filterFilter", "$filter"];

    function DcDashboardController($rootScope, $scope, $state, $q, $location, $timeout, $interval, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $injector, $window, confirmation, filterFilter, $filter) {

        var DcDashboardCtrl = this;

        function Init() {

            DcDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };
            // screen 
            DcDashboardCtrl.ePage.Masters.screenwidth =  screen.width;
            console.log(DcDashboardCtrl.ePage.Masters.screenwidth)    
            DcDashboardCtrl.ePage.Masters.emptyText = "-";
            DcDashboardCtrl.ePage.Masters.GotoReceiveItemsPage = GotoReceiveItemsPage;
            DcDashboardCtrl.ePage.Masters.timeLeft = [];
            DcDashboardCtrl.ePage.Masters.ManifestFA = ManifestFA;
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
                        // CManifestSummary()
                        // ManifestFA()
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
                "OrgCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
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
                    if (DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsDistributionCentre || DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsRoadFreightDepot) {
                        SenderManifestFA();
                        SenderConsignmentFA();
                    }
                    if (DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsStore || DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsRoadFreightDepot) {
                        ReceiverManifestFA();
                        ReceiverConsignmentFA();
                    }
                    if(DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsDistributionCentre){
                        $("title").text("DC-dashboard");
                    }else if(DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsStore){
                        $("title").text("Store-dashboard");
                    }else if(DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsRoadFreightDepot){
                        $("title").text("Depot-dashboard");
                    }else if(DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsForwarder){
                        $("title").text("Carrier-dashboard");
                    }else if(DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsConsignor){
                        $("title").text("Supplier-dashboard");
                    }
                }
            });
        }
        // time binding 
        function timeBinding(futureDate) {
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }
            // Convert string to date object 
            var d = new Date(futureDate);
            var diff = new Date() - d;

            // Allow for previous times 
            var sign = diff < 0 ? '-' : '';
            diff = Math.abs(diff);
            // Get time components 
            var secs = Math.floor(diff / 1000);
            var minutes = Math.floor(secs / 60);
            secs = Math.floor(secs % 60);
            var hours = Math.floor(minutes / 60);
            minutes = Math.floor(minutes % 60);
            var days = Math.floor(hours / 24);
            hours = Math.floor(hours % 24);

            return z(days) + ' Days ' + z(hours) + ' Hours ' + z(minutes) + ' Min ' + z(secs) + ' Secs';
        }

        // Time Intervals 
        function timeIntervals(item) {
            if (item == "senderManifest") {
                $interval(function () {
                    DcDashboardCtrl.ePage.Masters.SenManifestListSource.map(function (val, key) {
                        DcDashboardCtrl.ePage.Masters.timeLeft[key] = timeBinding(val.EstimatedDeliveryDate)
                    })
                }, 1000)
            } else if (item == "senderConsignment") {
                $interval(function () {
                    DcDashboardCtrl.ePage.Masters.SenConsignmentListSource.map(function (val, key) {
                        DcDashboardCtrl.ePage.Masters.timeLeft[key] = timeBinding(val.EstimatedDeliveryDate)
                    })
                }, 1000)
            } else if (item == "receiverManifest") {
                $interval(function () {
                    DcDashboardCtrl.ePage.Masters.RecManifestListSource.map(function (val, key) {
                        DcDashboardCtrl.ePage.Masters.timeLeft[key] = timeBinding(val.EstimatedDeliveryDate)
                    })
                }, 1000)
            } else if (item == "receiverConsignment") {
                $interval(function () {
                    DcDashboardCtrl.ePage.Masters.RecManifestListSource.map(function (val, key) {
                        DcDashboardCtrl.ePage.Masters.timeLeft[key] = timeBinding(val.EstimatedDeliveryDate)
                    })
                }, 1000)
            }
        }

        // Calculating On dues Manifest [sender]
        function SenderManifestFA() {
            // if(!DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsForwarder){
            var _filter = {
                "SenderCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            // }else if(DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsForwarder){
            //     var _filter = {
            //     "TransporterCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            //      };
            // }


            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };
            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.ManifestList = response.data.Response;
                    // filter Intransit Records
                    var _CurrentDate = new Date();
                    _CurrentDate = $filter('date')(_CurrentDate, "dd/MM/yyyy")
                    DcDashboardCtrl.ePage.Masters.SenManifestListSource = [];
                    DcDashboardCtrl.ePage.Masters.ManifestIntransitList = filterFilter(DcDashboardCtrl.ePage.Masters.ManifestList, { ManifestStatus: 'DSP' })
                    angular.forEach(DcDashboardCtrl.ePage.Masters.ManifestIntransitList, function (value, key) {
                        var temp = value.EstimatedDeliveryDate;
                        if (value.EstimatedDeliveryDate <= _CurrentDate) {
                            DcDashboardCtrl.ePage.Masters.SenManifestListSource.push(value);
                            DcDashboardCtrl.ePage.Masters.SenManifestNorecord = false;
                        }
                    });
                    if (DcDashboardCtrl.ePage.Masters.SenManifestListSource.length > 0) {
                        timeIntervals('senderManifest')
                    }

                    if (DcDashboardCtrl.ePage.Masters.SenManifestListSource.length == 0) {
                        DcDashboardCtrl.ePage.Masters.SenManifestNorecord = true;
                    }
                }
            });
        }

        // Calculating On dues Consignment [sender]
        function SenderConsignmentFA() {
            var _filter = {
                "SenderCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSCON"
            };
            apiService.post("eAxisAPI", "TmsConsignment/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.ConsignmentList = response.data.Response;
                    // filter Intransit Records
                    var _CurrentDate = new Date();
                    _CurrentDate = $filter('date')(_CurrentDate, "dd/MM/yyyy")
                    DcDashboardCtrl.ePage.Masters.SenConsignmentListSource = [];
                    DcDashboardCtrl.ePage.Masters.ConsignmentIntransitList = filterFilter(DcDashboardCtrl.ePage.Masters.ConsignmentList, { ConsignmentListStatus: 'DSP' })
                    angular.forEach(DcDashboardCtrl.ePage.Masters.ConsignmentIntransitList, function (value, key) {
                        if (value.EstimatedDeliveryDate <= _CurrentDate) {
                            DcDashboardCtrl.ePage.Masters.SenConsignmentListSource.push(value);
                            DcDashboardCtrl.ePage.Masters.SenConsignmentNorecord = false;
                        }
                    });
                    if (DcDashboardCtrl.ePage.Masters.SenConsignmentListSource.length > 0) {
                        timeIntervals('senderConsignment')
                    }
                    if (DcDashboardCtrl.ePage.Masters.SenConsignmentListSource.length == 0) {
                        DcDashboardCtrl.ePage.Masters.SenConsignmentNorecord = true;
                    }
                }
            });
        }

        // Calculating On dues Manifest [Receiver]
        function ReceiverManifestFA() {
            var _filter = {
                "ReceiverCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };
            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.ManifestList = response.data.Response;
                    // filter Intransit Records
                    var _CurrentDate = new Date();
                    _CurrentDate = $filter('date')(_CurrentDate, "dd/MM/yyyy")
                    DcDashboardCtrl.ePage.Masters.RecManifestListSource = [];
                    DcDashboardCtrl.ePage.Masters.ManifestIntransitList = filterFilter(DcDashboardCtrl.ePage.Masters.ManifestList, { ManifestStatus: 'DSP' })
                    angular.forEach(DcDashboardCtrl.ePage.Masters.ManifestIntransitList, function (value, key) {
                        var temp = value.EstimatedDeliveryDate;
                        if (value.EstimatedDeliveryDate <= _CurrentDate) {
                            DcDashboardCtrl.ePage.Masters.RecManifestListSource.push(value);
                            DcDashboardCtrl.ePage.Masters.RecManifestNorecord = false;
                        }
                    });
                    if (DcDashboardCtrl.ePage.Masters.RecManifestListSource.length > 0) {
                        timeIntervals('receiverManifest')
                    }
                    if (DcDashboardCtrl.ePage.Masters.RecManifestListSource.length == 0) {
                        DcDashboardCtrl.ePage.Masters.RecManifestNorecord = true;
                    }
                }
            });
            // if(DcDashboardCtrl.ePage.Masters.ManifestListSource.ReceiverCode == DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code){
            //     DcDashboardCtrl.ePage.Masters.manifestclass = true;            
            // }
        }

        // Calculating On dues Consignment [Receiver]
        function ReceiverConsignmentFA() {
            var _filter = {
                "ReceiverCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSCON"
            };
            apiService.post("eAxisAPI", "TmsConsignment/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.ConsignmentList = response.data.Response;
                    // filter Intransit Records
                    var _CurrentDate = new Date();
                    _CurrentDate = $filter('date')(_CurrentDate, "dd/MM/yyyy")
                    DcDashboardCtrl.ePage.Masters.RecConsignmentListSource = [];
                    DcDashboardCtrl.ePage.Masters.ConsignmentIntransitList = filterFilter(DcDashboardCtrl.ePage.Masters.ConsignmentList, { ConsignmentListStatus: 'DSP' })
                    angular.forEach(DcDashboardCtrl.ePage.Masters.ConsignmentIntransitList, function (value, key) {
                        if (value.EstimatedDeliveryDate <= _CurrentDate) {
                            DcDashboardCtrl.ePage.Masters.RecConsignmentListSource.push(value);
                            DcDashboardCtrl.ePage.Masters.RecConsignmentNorecord = false;
                        }
                    });
                    if (DcDashboardCtrl.ePage.Masters.RecConsignmentListSource.length > 0) {
                        timeIntervals('receiverConsignment')
                    }
                    if (DcDashboardCtrl.ePage.Masters.RecConsignmentListSource.length == 0) {
                        DcDashboardCtrl.ePage.Masters.RecConsignmentNorecord = true;
                    }
                }
            });
            // if(DcDashboardCtrl.ePage.Masters.ConsignmentListSource.ReceiverCode == DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code){
            //     DcDashboardCtrl.ePage.Masters.consignclass = true;            
            // }
        }

        // find all thru Org as Sender 
        function SManifestSummary() {
            if (!DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsForwarder) {
                var _filter = {
                    "SortColumn": "TMM_ManifestCount",
                    "SortType": "DESC",
                    "PageNumber": 1,
                    "PageSize": 25000,
                    "SenderCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
                };
            } else if (DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsForwarder) {
                var _filter = {
                    "SortColumn": "TMM_ManifestCount",
                    "SortType": "DESC",
                    "PageNumber": 1,
                    "PageSize": 25000,
                    "TransporterCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
                };
            }

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
                "PageSize": 25000,
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
                "PageSize": 25000,
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

            // getManifestReceivedChart();
            // getConsignmentReceivedChart();
            // getItemReceivedChart();

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
                "PageSize": 25000,
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
                "PageSize": 25000,
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
                "PageSize": 25000,
                "ReceiverCode": DcDashboardCtrl.ePage.Masters.SenderDetails.ORG_Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSITSM"
            };
            apiService.post("eAxisAPI", "TmsItemSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDashboardCtrl.ePage.Masters.RItemSummary = response.data.Response;
                    DcDashboardCtrl.ePage.Masters.currentStock = [];
                    angular.forEach(DcDashboardCtrl.ePage.Masters.RItemSummary, function (value, key) {
                        if (value.ItemStatus) {
                            DcDashboardCtrl.ePage.Masters.currentStock.push(value)
                        }
                    });
                    Rtotalsummary()
                }
            });
            // Rtotalsummary()
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

            // getManifestReceivedChart();
            // getConsignmentReceivedChart();
            // getItemReceivedChart();

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
                    if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestCount != 0) {
                        DcDashboardCtrl.ePage.Masters.InTransitManifestCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ConsignmentCount != 0) {
                        DcDashboardCtrl.ePage.Masters.InTransitConsignmentCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ConsignmentCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ItemCount != 0) {
                        DcDashboardCtrl.ePage.Masters.InTransitItemCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ItemCount)
                    }
                    if (!DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsForwarder) {
                        DcDashboardCtrl.ePage.Masters.InTransitlabel.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ReceiverName)
                    }
                    if (DcDashboardCtrl.ePage.Masters.SenderTypeDetails.IsForwarder) {
                        DcDashboardCtrl.ePage.Masters.InTransitlabel.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].TransporterName)
                    }
                } else if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestStatus == "DRF") {
                    if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestCount != 0) {
                        DcDashboardCtrl.ePage.Masters.PendingManifestCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ManifestCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ConsignmentCount != 0) {
                        DcDashboardCtrl.ePage.Masters.PendingConsinmentCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ConsignmentCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ItemCount != 0) {
                        DcDashboardCtrl.ePage.Masters.PendingItemCount.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ItemCount)
                    }
                    DcDashboardCtrl.ePage.Masters.Pendinglabel.push(DcDashboardCtrl.ePage.Masters.ManifestSummary[i].ReceiverName)
                }
            }
            // for Receiver
            for (var i in DcDashboardCtrl.ePage.Masters.RManifestSummary) {
                DcDashboardCtrl.ePage.Masters.coloR1.push(dynamicColors());
                DcDashboardCtrl.ePage.Masters.coloR2.push(dynamicColors());
                DcDashboardCtrl.ePage.Masters.coloR3.push(dynamicColors());
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
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RToBeArrivedDelManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RToBeArrivedDelConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RToBeArrivedDelItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    }
                    DcDashboardCtrl.ePage.Masters.RToBeArrivedlabel.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ReceiverName)
                } else if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestStatus == "DSP") {
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RToBeArrivedManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RToBeArrivedConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RToBeArrivedItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    }
                    DcDashboardCtrl.ePage.Masters.RBeArrivedlabel.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ReceiverName)
                    // intransit for store - DSP - org as Receiver
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RTransitManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RTransitConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount != 0) {
                        DcDashboardCtrl.ePage.Masters.RTransitItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    }
                    DcDashboardCtrl.ePage.Masters.RTransitlabel.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].SenderName)
                } else if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestStatus == "ARV") {
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount != 0) {
                        DcDashboardCtrl.ePage.Masters.ArrivedManifestCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ManifestCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount != 0) {
                        DcDashboardCtrl.ePage.Masters.ArrivedConsignmentCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ConsignmentCount)
                    }
                    if (DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount != 0) {
                        DcDashboardCtrl.ePage.Masters.ArrivedItemCount.push(DcDashboardCtrl.ePage.Masters.RManifestSummary[i].ItemCount)
                    }

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
        //  DC , Depot , Port , Store - Intransit 
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
                        titleFontSize: 10,
                        mode: 'nearest',
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
                        mode: 'nearest',
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
                        mode: 'nearest',
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

        // store - Received - arrived
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

        // store  - transit  -  store as Receiver
        function getManifestTransitChart() {
            var ctx = "receiver-man";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RTransitManifestCount,
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
            $("#rec-man").html(myChart.generateLegend());
        }

        function getConsignmentTransitChart() {
            var ctx = "receiver-con";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RTransitConsignmentCount,
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
            $("#rec-con").html(myChart.generateLegend());
        }

        function getItemTransitChart() {
            var ctx = "receiver-item";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.ManifestSummary);
            var myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.RTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.RTransitItemCount,
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
            $("#rec-item").html(myChart.generateLegend());
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
                        display: false,
                        position: 'right',
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
                        display: false,
                        position: 'right',
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
                        display: false,
                        position: 'right',
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
            DcDashboardCtrl.ePage.Masters.coloR1 = [];
            DcDashboardCtrl.ePage.Masters.coloR2 = [];
            DcDashboardCtrl.ePage.Masters.coloR3 = [];
            var dynamicColors = function () {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgba(" + r + "," + g + "," + b + "," + 0.4 + ")";
            };

            for (var i in DcDashboardCtrl.ePage.Masters.CManifestSummary) {
                DcDashboardCtrl.ePage.Masters.coloR1.push(dynamicColors());
                DcDashboardCtrl.ePage.Masters.coloR2.push(dynamicColors());
                DcDashboardCtrl.ePage.Masters.coloR3.push(dynamicColors());
            }

            DcDashboardCtrl.ePage.Masters.InTransitManifestCount = [];
            DcDashboardCtrl.ePage.Masters.InTransitConsignmentCount = [];
            DcDashboardCtrl.ePage.Masters.InTransitItemCount = [];
            DcDashboardCtrl.ePage.Masters.InTransitlabel = [];
            for (i = 0; i < DcDashboardCtrl.ePage.Masters.CManifestSummary.length; i++) {
                if (DcDashboardCtrl.ePage.Masters.CManifestSummary) {

                    DcDashboardCtrl.ePage.Masters.InTransitManifestCount.push(DcDashboardCtrl.ePage.Masters.CManifestSummary[i].ManifestCount)
                    DcDashboardCtrl.ePage.Masters.InTransitConsignmentCount.push(DcDashboardCtrl.ePage.Masters.CManifestSummary[i].ConsignmentCount)
                    DcDashboardCtrl.ePage.Masters.InTransitItemCount.push(DcDashboardCtrl.ePage.Masters.CManifestSummary[i].ItemCount)
                    DcDashboardCtrl.ePage.Masters.InTransitlabel.push(DcDashboardCtrl.ePage.Masters.CManifestSummary[i].ReceiverName)
                }
            }
            getCManifestTransitChartDetails()
            getCConsignmentTransitChartDetails()
            getCItemTransitChartDetails()
        }

        function getCManifestTransitChartDetails() {
            var ctx = "consolidated-manifest";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.CManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.InTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.InTransitManifestCount,
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
                        titleFontSize: 10,
                        mode: 'nearest',
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
            $("#man-consolidated").html(myChart.generateLegend());
        }

        function getCConsignmentTransitChartDetails() {
            var ctx = "consolidated-consign";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.CManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.InTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.InTransitConsignmentCount,
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
                        titleFontSize: 10,
                        mode: 'y',
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
            $("#con-consolidated").html(myChart.generateLegend());
        }

        function getCItemTransitChartDetails() {
            var ctx = "consolidated-item";
            var maximumcount = Math.max(DcDashboardCtrl.ePage.Masters.CManifestSummary);
            var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: DcDashboardCtrl.ePage.Masters.InTransitlabel,
                    datasets: [{
                        label: "Container",
                        data: DcDashboardCtrl.ePage.Masters.InTransitItemCount,
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
                        titleFontSize: 10,
                        mode: 'y',
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
            $("#item-consolidated").html(myChart.generateLegend());
        }

        function ManifestFA() {
            var _filter = {
                "SortColumn": "TMM_ManifestCount",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25000,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMASM"
            };
            apiService.post("eAxisAPI", "TmsManifestSummary/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    var ConsolidatedManifestList = response.data.Response;
                    DcDashboardCtrl.ePage.Masters.ConsolidatedManifestList = filterFilter(ConsolidatedManifestList, { ManifestStatus: 'DSP' })
                    DcDashboardCtrl.ePage.Masters.ConsolidatedManifestList = $filter('filter')(DcDashboardCtrl.ePage.Masters.ConsolidatedManifestList, function (value, key) {
                        return value.SenderName != null;
                    });
                    TransitDataFormation()
                }
            });
        }

        function TransitDataFormation() {
            var sender = _.groupBy(DcDashboardCtrl.ePage.Masters.ConsolidatedManifestList, 'SenderCode');
            var main = {
                name: "",
                size: "",
                imports: []
            };
            DcDashboardCtrl.ePage.Masters.mainArray = [];
            var Receiver = []
            angular.forEach(sender, function (value, key) {
                main.name = value[0].SenderName;
                // main.size = value[0].ManifestCount; 
                var size = 0;
                angular.forEach(value, function (value1, key1) {
                    if (value1.ReceiverName) {
                        main.imports.push(value1.ReceiverName);
                        size = size + value1.ManifestCount;
                    }
                });
                main.size = size;
                DcDashboardCtrl.ePage.Masters.mainArray.push(main)
                main = {
                    name: "",
                    size: "",
                    imports: []
                };
            });
            // angular.forEach(DcDashboardCtrl.ePage.Masters.mainArray,function(value,key){
            //     if(value.imports.length == 0){
            //         DcDashboardCtrl.ePage.Masters.mainArray.splice(key,1)
            //     }
            // });    

            var Receiver = $filter('unique')(DcDashboardCtrl.ePage.Masters.ConsolidatedManifestList, 'ReceiverName');
            angular.forEach(Receiver, function (value, key) {
                main.name = value.ReceiverName;
                // main.size = value.ManifestCount;
                main.imports = []
                DcDashboardCtrl.ePage.Masters.mainArray.push(main)
                main = {
                    name: "",
                    // size :  "",
                    imports: []
                };
            });

            angular.forEach(DcDashboardCtrl.ePage.Masters.mainArray, function (value, key) {
                if (value.name == null) {
                    DcDashboardCtrl.ePage.Masters.mainArray.splice(key, 1)
                }
            });
            chart()
        }

        function chart() {
            d3.select("title").text("Admin Dashboard");
            var diameter = 700,
                radius = diameter / 2,
                innerRadius = radius - 125;

            var cluster = d3.cluster()
                .size([720, innerRadius]);

            var line = d3.radialLine()
                .curve(d3.curveBundle.beta(0.75))
                .radius(function (d) { return d.y; })
                .angle(function (d) { return d.x / 180 * Math.PI; });

            var svg = d3.select("d3body").append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .append("g")
                .attr("transform", "translate(" + radius + "," + radius + ")");

            var link = svg.append("g").selectAll(".link"),
                node = svg.append("g").selectAll(".node");

            
                //   if (error) throw error;
              var  classes = DcDashboardCtrl.ePage.Masters.mainArray;

                var root = packageHierarchy(classes)
                    .sum(function (d) { return d.size; });

                cluster(root);

                link = link
                    .data(packageImports(root.leaves()))
                    .enter().append("path")
                    .each(function (d) { d.source = d[0], d.target = d[d.length - 1]; })
                    .attr("class", "link")
                    .attr("d", line);

                node = node
                    .data(root.leaves())
                    .enter()

                    .append("text")
                    .attr("class", "node")
                    .attr("dy", "0.31em")
                    .attr("title", function (d) { return d.value })
                    .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
                    .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
                    .text(function (d) { return d.data.key })
                    .on("mouseover", mouseovered)
                    .on("mouseout", mouseouted);
        

            function mouseovered(d) {
                node
                    .each(function (n) { n.target = n.source = false; });

                link
                    .classed("link--target", function (l) { if (l.target === d) return l.source.source = true; })
                    .classed("link--source", function (l) { if (l.source === d) return l.target.target = true; })
                    .filter(function (l) { return l.target === d || l.source === d; })
                    .raise();

                node
                    .classed("node--target", function (n) { return n.target; })
                    .classed("node--source", function (n) { return n.source; });

                myTool.html(
                    "<div id='thumbnail'><span> Count : " + d.value + "</span></div>")
                    .style("left", (d3.event.pageX - 320) + "px")
                    .style("top", (d3.event.pageY - 190) + "px")
                myTool
                    .transition()  //Opacity transition when the tooltip appears
                    .duration(500)
                    .style("opacity", "1")
                    .style("display", "block")
            }
            var myTool = d3.select("d3body")
                .append("div")
                .attr("class", "mytooltip")
                .style("opacity", "0")
                .style("display", "none");

            function mouseouted(d) {
                link
                    .classed("link--target", false)
                    .classed("link--source", false);

                node
                    .classed("node--target", false)
                    .classed("node--source", false);
                myTool
                    .transition()  //Opacity transition when the tooltip appears
                    .duration(500)
                    .style("opacity", "0")
                    .style("display", "block")
            }

            // Lazily construct the package hierarchy from class names.
            function packageHierarchy(classes) {
                var map = {};

                function find(name, data) {
                    var node = map[name], i;
                    if (!node) {
                        node = map[name] = data || { name: name, children: [] };
                        if (name.length) {
                            node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                            node.parent.children.push(node);
                            node.key = name.substring(i + 1);
                        }
                    }
                    return node;
                }

                classes.forEach(function (d) {
                    find(d.name, d);
                });

                return d3.hierarchy(map[""]);
            }

            // Return a list of imports for the given array of nodes.
            function packageImports(nodes) {
                var map = {},
                    imports = [];
                // Compute a map from name to node.
                nodes.forEach(function (d) {
                    map[d.data.name] = d;
                });
                // For each import, construct a link from the source to target node.
                nodes.forEach(function (d) {
                    if (d.data.imports) d.data.imports.forEach(function (i) {
                        imports.push(map[d.data.name].path(map[i]));
                    });
                });
                return imports;
            }
        }
        Init();
    }
})();