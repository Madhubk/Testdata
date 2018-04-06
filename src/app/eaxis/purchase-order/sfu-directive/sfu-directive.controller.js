(function () {
    "use strict";

    angular
        .module("Application")
        .controller("supplierFollowUpDirectiveController", SupplierFollowUpDirectiveController);

    SupplierFollowUpDirectiveController.$inject = ["$scope", "$injector", "$timeout", "$location", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "orderConfig", "$window"];

    function SupplierFollowUpDirectiveController($scope, $injector, $timeout, $location, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModal, orderConfig, $window) {
        var SupplierFollowUpDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SupplierFollowUpDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SupplierFollowUp",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
            };

            InitFollowUp();
        }

        function InitFollowUp() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ViewType = 1;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkInput = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ViewPart = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.NotFollowedUpCount = 0;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.OrderFollowedUpCount = 0;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = false;

            SupplierFollowUpDirectiveCtrl.ePage.Masters.dynamicPopover = {
                templateUrl: 'app/eaxis/purchase-order/sfu-directive/pop-over-bulk-upload-template.html'
            };

            InitFollowUpFun();
            InitGetDate();
            InitChart();
            InitFollowUpCall();
            InitDatePicker();
            GetDynamicLookupConfig();
        }

        function InitFollowUpFun() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SaveCargoReadyDate = SaveCargoReadyDate;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SendFollowUp = SendFollowUp;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Filter = Filter;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.OpenFilter = OpenFilter;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.CloseFilter = CloseFilter;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clear = Clear;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.CargoReadyDateGridReload = CargoReadyDateGridReload;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SendFollwUpGridReload = SendFollwUpGridReload;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.AllPendingGridReload = AllPendingGridReload;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BackToDashboard = BackToDashboard;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.TrackOrders = TrackOrders;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SummaryView = SummaryView;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DetailsView = DetailsView;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ClickAction = ClickAction;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ActiveAction = ActiveAction;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkSave = BulkSave;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectedPages = SelectedPages;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.OverDueFilterCall = OverDueFilterCall;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DueThisMonthFilterCall = DueThisMonthFilterCall;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DueThisWeekFilterCall = DueThisWeekFilterCall;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FollowUpHistoryCall = FollowUpHistoryCall;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ProcessActiveCall = ProcessActiveCall;

            $scope.$watch('SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList', function (newValue, oldValue) {
                SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList = newValue;
            }, true);

            if (SupplierFollowUpDirectiveCtrl.entity) {
                if (SupplierFollowUpDirectiveCtrl.entity === "Update Cargo Ready Date") {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.filter = SupplierFollowUpDirectiveCtrl.filter;
                    FolowUpGridDetails(SupplierFollowUpDirectiveCtrl.filter);
                } else if (SupplierFollowUpDirectiveCtrl.entity === "Send FollowUp") {
                    FolowUpGridDetails(SupplierFollowUpDirectiveCtrl.filter);
                }
            }

        }

        function InitGetDate() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekStart = helperService.DateFilter('@@@ThisWeek_From');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekEnd = helperService.DateFilter('@@@ThisWeek_To');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.LastWeekStart = helperService.DateFilter('@@@LastWeek_From');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.LastWeekEnd = helperService.DateFilter('@@@LastWeek_To');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthStart = helperService.DateFilter('@@@ThisMonth_From');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthEnd = helperService.DateFilter('@@@ThisMonth_To');
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Today = helperService.DateFilter('@@@Today');
        }

        function InitChart() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.GroupingGrid = [{
                    "Buyer_Code": "DEMBUYMEL",
                    "Buyer_Name": "DEMO BUYER MELBOURNE AUMEL",
                    "Supplier_Code": "DEMSUPSHA",
                    "Supplier_Name": "DEMO SUPPLIER SHANGHAI",
                    "POL": "INMAA",
                    "OrdersCount": "10"
                },
                {
                    "Buyer_Code": "DEMBUYMEL1",
                    "Buyer_Name": "MEL MELBOURNE AUMEL",
                    "Supplier_Code": "SPOTLIMEL",
                    "Supplier_Name": " BOUNDARY ROAD AUMEL",
                    "POL": "INMAA",
                    "OrdersCount": "10"
                },
                {
                    "Buyer_Code": "DEMBUYMEL",
                    "Buyer_Name": "DEMO BUYER MELBOURNE VIC AUMEL",
                    "Supplier_Code": "DEMSUPSHA",
                    "Supplier_Name": "DEMO SUPPLIER SHANGHAI",
                    "POL": "INMAA",
                    "OrdersCount": "10"
                },
                {
                    "Buyer_Code": "DEMBUYMEL",
                    "Buyer_Name": "DEMO BUYER MELBOURNE AUMEL",
                    "Supplier_Code": "SPOTLIMEL",
                    "Supplier_Name": " LAVERTON NORTH AUMEL",
                    "POL": "INMAA",
                    "OrdersCount": "10"
                },
                {
                    "Buyer_Code": "DEMBUYMEL",
                    "Buyer_Name": "DEMO BUYER MELBOURNE VIC AUMEL",
                    "Supplier_Code": "DEMSUPSHA",
                    "Supplier_Name": "DEMO SUPPLIER SHANGHAI",
                    "POL": "INMAA",
                    "OrdersCount": "10"
                },
                {
                    "Buyer_Code": "XSFHANGUA",
                    "Buyer_Name": "NO 6, XI ROAD PANYU DISTRICT",
                    "Supplier_Code": "DEMSUPSHA",
                    "Supplier_Name": "DEMO SUPPLIER SHANGHAI",
                    "POL": "INMAA",
                    "OrdersCount": "10"
                },
                {
                    "Buyer_Code": "DEMBUYMEL1",
                    "Buyer_Name": "MEL MELBOURNE AUMEL",
                    "Supplier_Code": "DEMSUPATL",
                    "Supplier_Name": "ATLANTA ATLANTA GA",
                    "POL": "INMAA",
                    "OrdersCount": "10"
                },
                {
                    "Buyer_Code": "DEMBUYMELBB2",
                    "Buyer_Name": "MEL MELBOURNE AUMEL",
                    "Supplier_Code": "DEMSUPCAN",
                    "Supplier_Name": "DEMO ROGERS GUANGZHOU",
                    "POL": "INMUS",
                    "OrdersCount": "10"
                }
            ];

            $timeout(function (value) {
                $scope.$apply();
                GetDoughnutChartDetails();
            }, 2000);
        }

        function InitFollowUpCall() {
            NotFollowedUpCountCall();
            AllPendingOrderCountCall();
            OrderFollowedUpCountCall();
            DueThisWeekCountCall();
            DueThisMonthCountCall();
            OverDueCountCall();
        }

        function InitDatePicker() {
            // DatePicker
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SupplierFollowUpDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SummaryView() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ViewPart = false;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsSummaryActive = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDetailsActive = false;

            $timeout(function (value) {
                $scope.$apply();
                GetDoughnutChartDetails();
            }, 2000);
        }

        function DetailsView() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ViewPart = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDetailsActive = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsSummaryActive = false;
            FolowUpGridDetails(SupplierFollowUpDirectiveCtrl.filter);
        }

        function ClickAction(_input) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.ViewPart = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDetailsActive = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsSummaryActive = false;
        }

        function ActiveAction() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsSummaryActive = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDetailsActive = false;
        }

        function GetDoughnutChartDetails() {
            new Chart(document.getElementById("myChart"), {
                type: 'bar',
                data: {
                    labels: ["DEMSUPSHA", "MITINTDEL", "SPOTLIPKG"],
                    datasets: [{
                            label: "INMAA",
                            backgroundColor: "#3e95cd",
                            data: [8, 14, 34]
                        },
                        {
                            label: "INMUS",
                            backgroundColor: "#8e5ea2",
                            data: [18, 32, 14]
                        },
                        {
                            label: "ESPOT",
                            backgroundColor: "#3cba9f",
                            data: [40, 12, 13]
                        },
                        {
                            label: "AUSDH",
                            backgroundColor: "#e8c3b9",
                            data: [22, 10, 24]
                        },
                        {
                            label: "AUSBR",
                            backgroundColor: "#c45850",
                            data: [38, 20, 4]
                        }
                    ]
                },
                options: {
                    title: {
                        display: false
                        // text: 'Predicted world population (millions) in 2050'
                    },
                    legend: {
                        display: true,
                        position: "top",
                        labels: {
                            fontColor: "#333",
                            fontSize: 10
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0
                            }
                        }]
                    }
                }
            });
        }

        function ResetGrid() {
            var _filter = {
                "IsShpCreated": false,
                "IsFollowUpIdCreated": true
            }

            CloseFilter();
            FolowUpGridDetails(_filter);
        }

        function Filter() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": false,
                "Buyer": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.Buyer,
                "Supplier": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.Supplier,
                "OrderNo": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.OrderNo,
                "PortOfLoading": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.PortOfLoading,
                "IsFollowUpSend": SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.IsFollowUpSend
                // "Buyer" : SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.Buyer
            }

            CloseFilter();
            FolowUpGridDetails(_filter);
        }

        function OpenFilter() {
            $timeout(function () {
                $('#filterSideBar').toggleClass('open');
            });
        }

        function CloseFilter() {
            $('#filterSideBar').removeClass('open');
        }

        function Clear() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput = {};
            ResetGrid();
        }

        function BackToDashboard() {
            $location.url('/EA/PO/order-dashboard');
        }

        function TrackOrders() {
            SupplierFollowUpDirectiveCtrl.reload();
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }

        function BulkSave(item) {
            if (SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length > 0) {
                SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.map(function (value, key) {
                    value.CargoReadyDate = item.CargoReadyDate;
                    value.Comments = item.Comments;
                })
                for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length; i++) {
                    if (EmptyOrNullCheck(SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i].CargoReadyDate)) {
                        toastr.warning("Selected Order(s) must have  manotary for 'Cargo Ready Date'")
                        return false;
                    }
                }
            } else {
                toastr.warning("Selected atleast on Order(s) to Update Cargo Ready Date")
                return false;
            }
            SaveOnly(SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders);
        }

        function SaveOnly(_items) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSave = true;
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].PK,
                    "Properties": [{
                        "PropertyName": "POH_CargoReadyDate",
                        "PropertyNewValue": _items[i].CargoReadyDate
                    }]
                };
                _updateInput.push(_tempObj);
            }

            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                    toastr.success("Successfully saved...");
                } else {
                    toastr.error("Save Failed...")
                }
            });
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkInput = {};
            SupplierFollowUpDirectiveCtrl.ePage.Masters.BulkUploadOpen = false;
        }

        function AllPendingGridReload() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clicked = 'All Pending Orders';
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": ''
            };

            FolowUpGridDetails(_filter);
        }

        function SendFollwUpGridReload() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clicked = 'Orders Not Followed Up';
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsFollowUpIdCreated": 'false',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'false'
            };

            FolowUpGridDetails(_filter);
        }

        function CargoReadyDateGridReload() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.Clicked = 'Orders Followed Up';
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsFollowUpIdCreated": 'true',
                "CargoReadyDate": 'null',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'true'
            }

            FolowUpGridDetails(_filter);
        }

        function FollowUpHistoryCall() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CargoReadiness.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.CargoReadiness.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.FollowUpHistory = response.data.Response;
                    FollowUpHistoryModal();
                }
            });
        }

        function ProcessActiveCall() {
            if (SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length > 0) {
                SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = true;
                var _fliterIinput = {
                    "PK": "",
                    "Buyer": SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[0].Buyer,
                    "Supplier": SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[0].Supplier,
                    "PortOfLoading": SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[0].PortOfLoading
                }
                var _followUpInput = [];
                for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length; i++) {
                    var _inputCall = {
                        "PK": "",
                        "POH_FK": SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i].PK,
                        "OrderNo": SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i].OrderCumSplitNo
                    }
                    _followUpInput.push(_inputCall);
                }
                var _filter = {
                    "UIConsignorFollowUpHeader": _fliterIinput,
                    "UIConsignorFollowUp": _followUpInput
                }
                apiService.post('eAxisAPI', appConfig.Entities.CargoReadiness.API.CreateFollowUpGroup.Url, _filter).then(function (response) {
                    if (response.data.Response) {
                        toastr.success("Successfully followup group created..");
                        SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = false;
                    } else {
                        toastr.error("FollowUgroup tack trigger failed ..");
                        SupplierFollowUpDirectiveCtrl.ePage.Masters.IsGroupDisable = false;
                    }
                });
            } else {
                toastr.warning('Select atleast one Orders');
            }
        }

        function FollowUpHistoryModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "followup-history",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/purchase-order/sfu-directive/followup-history-modal/followup-history.html",
                controller: 'followUpModalController',
                controllerAs: "FollowUpModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "HistoryList": SupplierFollowUpDirectiveCtrl.ePage.Masters.FollowUpHistory
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }
            );
        }

        function SendFollowUp() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = true;
            if (SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length > 0) {
                // FollowUpMailSend(SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders);
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "email-template",
                    scope: $scope,
                    // size : "sm",
                    templateUrl: "app/eAxis/purchase-order/sfu-directive/send-follwup-modal/send-followup-modal.html",
                    controller: 'sendPopUpModalController',
                    controllerAs: "SendPopUpModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "SendList": SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {},
                    function (response) {
                        SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                    }
                );
            } else {
                toastr.warning("Select atlest one order(s)")
                SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
            }
        }

        function FollowUpMailSend(_input) {
            var _fliterIinput = {
                "PK": "",
                "Buyer": _input[0].Buyer,
                "Supplier": _input[0].Supplier,
                "PortOfLoading": _input[0].PortOfLoading
            }
            var _followUpInput = [];
            for (i = 0; i < _input.length; i++) {
                var _inputCall = {
                    "PK": "",
                    "POH_FK": _input[i].PK,
                    "CreatedBy": authService.getUserInfo().UserEmail,
                    "EmailRecipient": "jvenancius@20cube.com"
                }
                _followUpInput.push(_inputCall);
            }
            var _filter = {
                "UIConsignorFollowUpHeader": _fliterIinput,
                "UIConsignorFollowUp": _followUpInput
            }
            apiService.post('eAxisAPI', appConfig.Entities.CargoReadiness.API.SendFollowUp.Url, _filter).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                } else {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }
            });
        }

        function SaveCargoReadyDate() {
            for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length; i++) {
                if (i != 0) {
                    if ((SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i].Buyer != SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i - 1].Buyer) || (SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i].Supplier != SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i - 1].Supplier) || (SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i].PortOfLoading != SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i - 1].PortOfLoading)) {
                        toastr.warning("Selected Order(s) must have same load port")
                        return false;
                    }
                }
            }
            if (SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length > 0) {
                for (i = 0; i < SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders.length; i++) {
                    if (EmptyOrNullCheck(SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders[i].CargoReadyDate)) {
                        toastr.warning("Selected Order(s) must have  manotary for 'Cargo Ready Date'")
                        return false;
                    }
                }
                SaveOnly(SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders);
            } else {
                toastr.warning("Select atlest one order(s)")
            }
        }

        function OverDueFilterCall() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DueList = 'Over Due';
            var _filter = {
                "FollowUpDateFrom": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthStart,
                "FollowUpDateTo": SupplierFollowUpDirectiveCtrl.ePage.Masters.Today,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }

            FolowUpGridDetails(_filter);
        }

        function DueThisMonthFilterCall() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DueList = 'Due This Month';
            var _filter = {
                "FollowUpDateFrom": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthStart,
                "FollowUpDateTo": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthEnd,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }

            FolowUpGridDetails(_filter);
        }

        function DueThisWeekFilterCall() {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.DueList = 'Due This week';
            var _filter = {
                "FollowUpDateFrom": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekStart,
                "FollowUpDateTo": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekEnd,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }

            FolowUpGridDetails(_filter);
        }

        function FolowUpGridDetails(_filterInput) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput = _filterInput;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = true;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.TotalCount = response.data.Count;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = false;
                    if (SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList.length > 0) {
                        SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
                            value.status = false;
                        });
                    }
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.numPerPage = 25;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.noOfPages = Math.ceil(response.data.Count / SupplierFollowUpDirectiveCtrl.ePage.Masters.numPerPage);
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.currentPage = 1;
                }
            });
        }

        function DataChanges(data) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.selectedOrders = data;
        }

        function AllPendingOrderCountCall() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": ''
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.AllPendingCount = response.data.Response;
                }
            });
        }

        function OrderFollowedUpCountCall() {
            var _filter = {
                "IsFollowUpIdCreated": 'true',
                "CargoReadyDate": 'null',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.OrderFollowedUpCount = response.data.Response;
                }
            });
        }

        function NotFollowedUpCountCall() {
            var _filter = {
                "IsFollowUpIdCreated": 'false',
                "IsShpCreated": 'false',
                "IsValid": 'true',
                "IsFollowUpSend": 'false'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.NotFollowedUpCount = response.data.Response;
                }
            });
        }

        function OverDueCountCall() {
            var _filter = {
                "FollowUpDateFrom": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthStart,
                "FollowUpDateTo": SupplierFollowUpDirectiveCtrl.ePage.Masters.Today,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.OverDueMonthlyCount = response.data.Response;
                }
            });
        }

        function DueThisWeekCountCall() {
            var _filter = {
                "FollowUpDateFrom": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekStart,
                "FollowUpDateTo": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisWeekEnd,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.DueWeeklyCount = response.data.Response;
                }
            });
        }

        function DueThisMonthCountCall() {
            var _filter = {
                "FollowUpDateFrom": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthStart,
                "FollowUpDateTo": SupplierFollowUpDirectiveCtrl.ePage.Masters.ThisMonthEnd,
                "IsShpCreated": 'false',
                "IsValid": 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.DueMonthlyCount = response.data.Response;
                }
            });
        }

        function EmptyOrNullCheck(val) {
            if (val == "" || val == null || val == undefined)
                return true;
            else
                return false;
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,MDM_CarrierList";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;

                res.map(function (value, key) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function SelectedPages(_input) {
            SupplierFollowUpDirectiveCtrl.ePage.Masters.SelectionList = [];
            SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = true;
            SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput.PageNumber = _input.page;

            var _input = {
                "searchInput": helperService.createToArrayOfObject(SupplierFollowUpDirectiveCtrl.ePage.Masters.FilterInput),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.spinner = false;
                } else {
                    SupplierFollowUpDirectiveCtrl.ePage.Masters.SfuOrderList = [];
                }
            });
        }

        Init();
    }
})();