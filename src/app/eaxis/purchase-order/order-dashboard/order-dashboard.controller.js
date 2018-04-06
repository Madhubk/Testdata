(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderDashController", OrderDashController);

    OrderDashController.$inject = ["$injector", "$location", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "orderDashboardConfig"];

    function OrderDashController($injector, $location, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, orderDashboardConfig) {
        var OrderDashCtrl = this,
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            OrderDashCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderDashboardConfig.Entities
            };

            OrderDashCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            OrderDashCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            // DatePicker
            OrderDashCtrl.ePage.Masters.DatePicker = {};
            OrderDashCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrderDashCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrderDashCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitOrderDashboard();
        }

        function InitOrderDashboard() {
            OrderDashCtrl.ePage.Masters.UploadPurchaseOrder = UploadPurchaseOrder;
            OrderDashCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            OrderDashCtrl.ePage.Masters.TrackOrders = TrackOrders;
            OrderDashCtrl.ePage.Masters.GetVolumeByDate = GetVolumeByDate;
            OrderDashCtrl.ePage.Masters.GetContainerByDate = GetContainerByDate;            
            OrderDashCtrl.ePage.Masters.IsLoading = false;
            OrderDashCtrl.ePage.Masters.GetSupplierContainerValues = GetSupplierContainerValues;
            OrderDashCtrl.ePage.Masters.GetSupplierVolumeValues = GetSupplierVolumeValues;            

            InitDashboardChart();            
            DashboardCount();
            RecentActivies();
            GetDynamicLookupConfig();
        }

        function InitDashboardChart() {
            OrderDashCtrl.ePage.Masters.SupplierVolume = ["01-12","01-13","01-14","01-15","01-16"];
            OrderDashCtrl.ePage.Masters.SupplierVolumeCount = [1000,3500,2781,1493,700];
            OrderDashCtrl.ePage.Masters.SupplierContainer = ["20cube","Marubeni","Sun Direct","SpotLight","City Beach"];
            OrderDashCtrl.ePage.Masters.SupplierContainerCount = [100, 700, 140, 200, 123];
            OrderDashCtrl.ePage.Masters.LastWeekStart = helperService.DateFilter('@@@LastWeek_From');
            OrderDashCtrl.ePage.Masters.LastWeekEnd = helperService.DateFilter('@@@LastWeek_To');
            
            // chart edit pop-over 
            OrderDashCtrl.ePage.Masters.dynamicPopover = {
                templateUrl: 'app/eaxis/purchase-order/order-dashboard/pop-over-template-date.html',
                title: 'Choose Date'
            };

            GetPieChartDetails();
            GetBarChartDetails();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OrderDashCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetPieChartDetails() {
            var ctx = "pie";
            var maximumcount = Math.max(OrderDashCtrl.ePage.Masters.SupplierContainer) ;
            var myChart = new Chart(ctx, {
                type: "pie",                
                data: {
                    labels: OrderDashCtrl.ePage.Masters.SupplierContainer,                    
                    datasets: [{
                            label: "Container",
                            data: OrderDashCtrl.ePage.Masters.SupplierContainerCount,
                            backgroundColor : [
                                'rgba(244, 123, 123, 1)',
                                'rgba(151, 187, 205, 1)',
                                'rgba(116, 109, 109, 1)',
                                'rgba(248, 217, 129, 1)',
                                'rgba(220, 220, 220, 1)'
                            ],
                            borderColor : [
                                'rgba(244, 123, 123, 1)',
                                'rgba(151, 187, 205, 1)',
                                'rgba(116, 109, 109, 1)',
                                'rgba(248, 217, 129, 1)',
                                'rgba(220, 220, 220, 1)'
                            ],
                        // borderColor: 'rgba(67, 133, 245, 1)',
                                borderWidth: 1
                         }],
                    },
                options: {
                    title: {
                        display: false
                    },
                    tooltips: {
                        enabled: true,
                        titleFontSize:14,
                        mode: 'index'
                    },
                    legend: {
                        display: false,
                        position: 'left',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10
                        }
                    }
                }
            });
            
            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            })
        }

        function GetBarChartDetails() {      
            var ctx = "barChart";
            var maximumcount = Math.max(OrderDashCtrl.ePage.Masters.SupplierVolume) ;
            var myChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: OrderDashCtrl.ePage.Masters.SupplierVolume,
                    datasets: [{
                        label: "Volume",
                        data: OrderDashCtrl.ePage.Masters.SupplierVolumeCount,
                        backgroundColor: 'rgba(251, 188, 5, 0.5)',
                        /*backgroundColor : [
                            'rgba(244, 123, 123, 1)',
                            'rgba(151, 187, 205, 1)',
                            'rgba(116, 109, 109, 1)',
                            'rgba(248, 217, 129, 1)',
                            'rgba(220, 220, 220, 1)'
                        ],*/
                        borderColor: 'rgba(251, 188, 5, 1)',
                        borderWidth: 1
                    }],
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                stepSize: maximumcount/5,
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
                    },
                    legend: {
                        display: false,
                        position: 'left',
                        labels: {
                            fontColor: "#333",
                            fontSize: 10
                        }
                    }
                }
            });

            myChart.update({
                duration: 800,
                easing: 'easeOutBounce'
            })
        }

        function GetSupplierVolumeValues() {
            // body...
        }

        function GetSupplierContainerValues() {
            // body...
        }

        function GetContainerByDate(fromDate, toDate) {
            if (fromDate == undefined) {
                toastr.warning('From Date should not be empty');
                return false;
            }
            if (toDate == undefined) {
                toastr.warning('To Date should not be empty');
                return false;
            }
            if (fromDate <= toDate) {
                toastr.warning('To Date should be greate than from date');
                return false;
            }
        }

        function GetVolumeByDate(fromDate, toDate) {
            if (fromDate == undefined) {
                toastr.warning('From Date should not be empty');
                return false;
            }
            if (toDate == undefined) {
                toastr.warning('To Date should not be empty');
                return false;
            }
            if (fromDate <= toDate) {
                toastr.warning('To Date should be greate than from date');
                return false;
            }
        }

        function CreateNewOrder() {
            var _queryString = {
                "IsCreated" : "New"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/order').search({ item: _queryString });
        }
        
        function UploadPurchaseOrder() {
            var _queryString = {
                "IsCreated" : "POBatch Upload"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/po-batch-upload').search({ item: _queryString });
        }

        function TrackOrders() {
            var _queryString = {
                "IsCreated" : "Track Orders"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/order').search({ item: _queryString });
        }

        function DashboardCount() {
            OrderDashCtrl.ePage.Masters.Count = {};
            OrderDashCtrl.ePage.Masters.Count.OpenOrders = 0;
            OrderDashCtrl.ePage.Masters.Count.CargoReadyDate = 0;
            OrderDashCtrl.ePage.Masters.Count.VesselPlanning = 0;
            OrderDashCtrl.ePage.Masters.Count.ConvertToBooking = 0;
            OrderDashCtrl.ePage.Masters.order = {};
            OrderDashCtrl.ePage.Masters.order.OpenOrders = OpenOrders;
            OrderDashCtrl.ePage.Masters.order.CargoReadyDate = CargoReadyDate;
            OrderDashCtrl.ePage.Masters.order.VesselPlanning = VesselPlanning;
            OrderDashCtrl.ePage.Masters.order.ConvertToBooking = ConvertToBooking;

            // date & week calculation
            OrderDashCtrl.ePage.Masters.ThisWeekStart = helperService.DateFilter('@@@ThisWeek_From');
            OrderDashCtrl.ePage.Masters.ThisWeekEnd = helperService.DateFilter('@@@ThisWeek_To');
            
            OpenOrdersCount();
            CargoReadyDateCount();
            VesselPlanningCount();
            ConvertToBookingCount();
        }
        
        function OpenOrdersCount() {
            var _filter = {
                "SortColumn" : "POH_CreatedDateTime",
                "SortType" : "DESC",
                "PageNumber" : "1",
                "PageSize" : 25,
                "IsShpCreated" : 'false',
                "IsValid" : 'true'
            }            
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetOpenOrdersCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetOpenOrdersCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrderDashCtrl.ePage.Masters.Count.OpenOrders = response.data.Response;
                }
            });
        }

        function CargoReadyDateCount() {
            var _filter = {
                // "IsFollowUpIdCreated" : 'true',
                "CargoReadyDate" : "NULL",
                "IsShpCreated" : 'false',
                "IsValid" : 'true'
            }            
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrderDashCtrl.ePage.Masters.Count.CargoReadyDate = response.data.Response;
                }
            });
        }
        
        function VesselPlanningCount() {
            var _filter = {
                "IsValid" : 'true',
                "IsShpCreated" : 'false',
                "CargoReadyDate" : "NOTNULL",
                "JBS_FK" : "NOTNULL"
            }
            
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingVesselPlanningCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingVesselPlanningCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrderDashCtrl.ePage.Masters.Count.VesselPlanning = response.data.Response;
                }
            });
        }

        function ConvertToBookingCount() {
            var _filter = {
                // "IsFollowUpIdCreated" : 'true',
                "IsPreAdviceIdCreated" : 'true',
                "IsValid" : 'true',
                "IsShpCreated" : 'false'
            }
            
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingConvertToBookingCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingConvertToBookingCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrderDashCtrl.ePage.Masters.Count.ConvertToBooking = response.data.Response;
                }
            });
        }

        function RecentActivies() {
            var _filter = {
                ActionType: "Transaction",
                EntitySource: "ORD",
                CreatedBy: authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecSessionActivity.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecSessionActivity.API.FindAll.Url, _input).then(function (response) {
                if(response.data.Response){
                    if (response.data.Response.length > 0) {
                        OrderDashCtrl.ePage.Masters.RecentList = response.data.Response;
                    }
                }
            });
        }

        function OpenOrders() {
            var _queryString = {
                "SortColumn" : "POH_CreatedDateTime",
                "SortType" : "DESC",
                "PageNumber" : "1",
                "PageSize" : 25,
                "IsShpCreated" : 'false',
                "IsValid" : 'true',
                "IsCreated" : "Open Orders"
            }
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/order').search({ item: _queryString });
        }

        function CargoReadyDate() {
            var _queryString = {
                "SortColumn" : "POH_CreatedDateTime",
                "SortType" : "DESC",
                "PageNumber" : "1",
                "PageSize" : 25,
                "CargoReadyDate" : "NULL",
                "IsShpCreated" : 'false',
                "IsValid" : 'true',
                "IsCreated" : "Cargo Ready Date"
            }
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/order').search({ item: _queryString });
        }

        function VesselPlanning() {
            var _queryString = {
                "SortColumn" : "POH_CreatedDateTime",
                "SortType" : "DESC",
                "PageNumber" : "1",
                "PageSize" : 25,
                "IsValid" : 'true',
                "IsShpCreated" : 'false',
                "CargoReadyDate" : "NOTNULL",
                "JBS_FK" : "NOTNULL",
                "IsCreated" : "Vessel Planning"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/pre-advice').search({ item: _queryString });
        }

        function ConvertToBooking() {
            var _queryString = {
                "SortColumn" : "POH_CreatedDateTime",
                "SortType" : "DESC",
                "PageNumber" : "1",
                "PageSize" : 25,
                // "IsFollowUpIdCreated" : 'true',
                "IsPreAdviceIdCreated" : 'true',
                "IsValid" : 'true',
                "IsShpCreated" : 'false',
                "IsCreated" : "Convert To Booking"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/pre-advice').search({ item: _queryString });
        }
        
        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,MDM_CarrierList,SailingDetails";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };
            
            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    OrderDashCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }
        
        Init();
    }
})();
