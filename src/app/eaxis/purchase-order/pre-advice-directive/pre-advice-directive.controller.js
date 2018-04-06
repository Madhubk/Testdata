(function () {
    "use strict";

    angular
        .module("Application")
        .controller("preAdviceBookingDirectiveController", PreAdviceBookingDirectiveController);

    PreAdviceBookingDirectiveController.$inject = ["$scope", "$injector", "$timeout", "$location",  "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "preAdviceConfig", "$window"];

    function PreAdviceBookingDirectiveController($scope, $injector, $timeout, $location, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModal, preAdviceConfig, $window) {
        var PreAdviceBookingDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            PreAdviceBookingDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": preAdviceConfig.Entities
            };

            PreAdviceBookingDirectiveCtrl.ePage.Masters.ViewType = 1;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            InitPreAdvice();
            InitDatePicker();
        }

        function InitPreAdvice() {  
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertToBooking = ConvertToBooking;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.SendPreAdvice = SendPreAdvice;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Filter = Filter;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.OpenFilter = OpenFilter;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.CloseFilter = CloseFilter;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clear = Clear;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders = [];
            PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput = {};
            PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableBulk = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.BackToDashboard= BackToDashboard;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.TrackOrders = TrackOrders;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.PlannedVesselReload = PlannedVesselReload;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.UnPlannedVesselReload = UnPlannedVesselReload;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.AllPendingReload = AllPendingReload;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.AddVessel = AddVessel;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
            PreAdviceBookingDirectiveCtrl.ePage.Masters.RecordCount = 0;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.SummaryView = SummaryView;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.DetailsView = DetailsView;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ViewPart = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ClickAction = ClickAction;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ActiveAction = ActiveAction;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectedPages = SelectedPages;
            
            InitShipmentPreAdvice();
            GetDynamicLookupConfig();
        }

        function InitShipmentPreAdvice() {
            if (PreAdviceBookingDirectiveCtrl.entity) {
                if (PreAdviceBookingDirectiveCtrl.entity === "Vessel Planning") {
                    VesselPlanningDetailsGrid(PreAdviceBookingDirectiveCtrl.filter);
                } else if (PreAdviceBookingDirectiveCtrl.entity === "Convert To Booking") {
                    VesselPlanningDetailsGrid(PreAdviceBookingDirectiveCtrl.filter);
                }
            }
            $scope.$watch('PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList', function (newValue, oldValue) {
                PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList = newValue;
            }, true);

            PreAdviceBookingDirectiveCtrl.ePage.Masters.GroupingGrid = [
              {
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
            
            $timeout(function(value){ 
                $scope.$apply();
                GetDoughnutChartDetails();
            },2000);

            InitGetDate();
            VesselPlanningCount();
            VesselUnPlanningCount();
            DueThisWeekCountCall();
            DueThisMonthCountCall();
            OverDueCountCall();
        }

        function InitDatePicker() {
             // DatePicker
             PreAdviceBookingDirectiveCtrl.ePage.Masters.DatePicker = {};
             PreAdviceBookingDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
             PreAdviceBookingDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
             PreAdviceBookingDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }
        
        function InitGetDate() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisWeekStart = helperService.DateFilter('@@@ThisWeek_From');
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisWeekEnd = helperService.DateFilter('@@@ThisWeek_To');
            PreAdviceBookingDirectiveCtrl.ePage.Masters.LastWeekStart = helperService.DateFilter('@@@LastWeek_From');
            PreAdviceBookingDirectiveCtrl.ePage.Masters.LastWeekEnd = helperService.DateFilter('@@@LastWeek_To');
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisMonthStart = helperService.DateFilter('@@@ThisMonth_From');
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisMonthEnd = helperService.DateFilter('@@@ThisMonth_To');
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Today = helperService.DateFilter('@@@Today');
        }
        
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PreAdviceBookingDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function SummaryView() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ViewPart = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsSummaryActive = true;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDetailsActive = false;
            
            $timeout(function(value){ 
                $scope.$apply();
                GetDoughnutChartDetails();
            },2000);
        }
        
        function DetailsView() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ViewPart = true;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDetailsActive = true;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsSummaryActive = false;
            
            VesselPlanningDetailsGrid(PreAdviceBookingDirectiveCtrl.filter);
        }
        
        function ClickAction(_input) {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ViewPart = true;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDetailsActive = true;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsSummaryActive = false;
        }
        
        function ActiveAction() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsSummaryActive = true;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDetailsActive = false;
        }
        
        function Filter() {
            var _filter = {
                "SortColumn" : "POH_CreatedDateTime",
                "SortType" : "DESC",
                "PageNumber" : "1",
                "PageSize" : 25,
                "IsShpCreated" : false,
                "Buyer" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Buyer,
                "Supplier" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Supplier,
                "OrderNo" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.OrderNo,
                "CargoReadyDate" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.CargoReadyDate,
                "Carrier" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Carrier,
                "Vessel" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Vessel,
                "Voyage" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Voyage,
                "ETD" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.ETD,
                "ETA" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.ETA,
                "PortOfLoading" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.PortOfLoading,
                "PortOfDischarge" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.PortOfDischarge,
                "CargoCutOffDate" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.CargoCutOffDate,
                "BookingCutOffDate" : PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.BookingCutOffDate
            }

            CloseFilter();
            VesselPlanningDetailsGrid(_filter);
        }
        
        function OpenFilter() {
             $timeout(function() {
                $('#filterSideBar').toggleClass('open');
            });
        }
        
        function CloseFilter() {
            $('#filterSideBar').removeClass('open');
        }
        
        function Clear() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput = {};
        }
        
        function BackToDashboard() {
            $location.url('/EA/PO/order-dashboard');
        }
        
        function TrackOrders() {
            var _queryString = {
                "IsCreated" : "Track Orders"
            };
            _queryString = helperService.encryptData(_queryString);
            $location.path('/EA/PO/order').search({ item: _queryString });
        }
        
        function GetDoughnutChartDetails() {
            var ctx = "myChart";
            //doughnut chart data
            var data1 = {
                labels: ["DEMSUPSHA","MITINTDEL","SPOTLIPKG","ZAKAUSYTN","SPOTLIMELD"],
                datasets: [
                    {
                        label: "",
                        data: [10, 25, 7, 12, 16],
                        backgroundColor: [
                            "#DEB887",
                            "#A9A9A9",
                            "#DC143C",
                            "#d9e7fd",
                            "#2E8B57"
                        ],
                        borderColor: [
                            "#CDA776",
                            "#989898",
                            "#CB252B",
                            "#d9e7fd",
                            "#1D7A46"
                        ],
                        borderWidth: [1, 1, 1, 1, 1]
                    }
                ]
            };
            //options
            var options = {
                responsive: true,
                title: {
                    display: false
                    // position: "bottom",
                    // text: "Supplier Order(s)",
                    // fontSize: 14,
                    // fontColor: "#111"
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        fontColor: "#333",
                        fontSize: 10
                    }
                }
            };

            var chart1 = new Chart(ctx, {
                type: "doughnut",
                data: data1,
                options: options
            });
        }
        
        function AddVessel(type, data) {
            if (type == "New") {
                if (PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders.length > 0 ) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "vessel-template",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eAxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.html",
                        controller: 'vesselModalController',
                        controllerAs: "VesselModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "BulkInput" : data,
                                    "Mode" : type,
                                    "OrderList" : PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {                       
                            PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders.map(function (value, key) {
                                if (value.status) {
                                    value.Vessel_FK = response.PK;
                                    value.PlannedVoyage =  response.VoyageFlight;
                                    value.PlannedVessel =  response.Vessel;
                                    value.PlannedETD = response.ETD;
                                    value.PortOfLoading = response.LoadPort;
                                    value.CargoCutOffDate = response.ATA;
                                    value.BookingCutOffDate = response.ATD;
                                    value.PortOfDischarge = response.DischargePort;
                                    value.PlannedETA = response.ETA;
                                    value.CarrierOrg_Code =  response.CarrierOrg_Code;
                                    value.CarrierOrg_FK =  response.CarrierOrg_FK;
                                }
                            })
                            toastr.success("Successfully saved...")
                        },
                        function (response) {
                        }
                    );
                } else {
                    toastr.warning("Select atlest one order(s) to update vessel")
                }
            }
            // Edit Mode
            if (type == "Edit") {
                if (data.length > 0 ) {
                    for (i=0; i < data.length; i++) {
                        if (EmptyOrNullCheck(data[i].PlannedVessel)) {
                            toastr.warning("Selected Order(s) should not have vessel. Please update vessel and then edit your vessel.");
                            return false;
                        }
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "vessel-template",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eAxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.html",
                        controller: 'vesselModalController',
                        controllerAs: "VesselModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "BulkInput" : data,
                                    "Mode" : type,
                                    "OrderList" : PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {                       
                            PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders.map(function (value, key) {
                                for (i=0; i < response.length; i++){
                                    if (value.status && value.Vessel_FK == response[i].PK) {
                                        value.Vessel_FK = response[i].PK;
                                        value.PlannedVoyage =  response[i].VoyageFlight;
                                        value.PlannedVessel =  response[i].Vessel;
                                        value.PlannedETD = response[i].ETD;
                                        value.PortOfLoading = response[i].LoadPort;
                                        value.CargoCutOffDate = response[i].ATA;
                                        value.BookingCutOffDate = response[i].ATD;
                                        value.PortOfDischarge = response[i].DischargePort;
                                        value.PlannedETA = response[i].ETA;
                                        value.CarrierOrg_Code =  response[i].CarrierOrg_Code;
                                        value.CarrierOrg_FK =  response[i].CarrierOrg_FK;
                                    }
                                }
                            })
                            toastr.success("Successfully updated...");
                        },
                        function (response) {
                        }
                    );
                } else {
                    toastr.warning("Select atlest one order(s) to update vessel");
                }
            }
        }
        
        function DataChanges(data) {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders = data;
            console.log(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders);
        }
        
        function SendPreAdvice() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = true;
            if (PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders.length > 0 ) {
                for(i=0; i < PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders.length; i++){
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedCarrier) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedVessel)) {
                        toastr.warning("Selected Order(s) has should be manotary for Carrier & Vessel");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PortOfLoading) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PortOfDischarge)) {
                        toastr.warning("Selected Order(s) has should be manotary for POL & POD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedETA) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedETD)) {
                        toastr.warning("Selected Order(s) has should be manotary for ETA & ETD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].BookingCutOffDate) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].CargoCutOffDate)) {
                        toastr.warning("Selected Order(s) has should be manotary for CargoCutOffDate & BookingCutOffDate");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedVoyage)) {
                        toastr.warning("Selected Order(s) has should be manotary for Voyage");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                }
                // PreAdviceMailSend(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders);
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "email-template",
                    scope: $scope,
                    // size : "sm",
                    templateUrl: "app/eAxis/purchase-order/pre-advice-directive/send-preadvice-modal/send-preadvice-modal.html",
                    controller: 'sendMailModalController',
                    controllerAs: "SendMailModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "SendList" : PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {                       

                    },
                    function (response) {
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                    }
                );            
            } else {
                toastr.warning("Select atlest one order(s)");
                PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
            }
        }
        
        function PreAdviceMailSend(_input) {
          var _fliterIinput = {
            "PK" : "",
            "Buyer": _input[0].Buyer,
            "Supplier": _input[0].Supplier,
            "PortOfLoading": _input[0].PortOfLoading
          }
          var _preAdviceInput = [];
          for (i = 0; i < _input.length; i++) {
            var _inputCall = {
              "PK" : "",
              "POH_FK" : _input[i].PK,
              "CreatedBy" : authService.getUserInfo().UserEmail,
              "EmailRecipient" : "jvenancius@20cube.com"
            }
            _preAdviceInput.push(_inputCall);
          }
          var _filter = {
            "UIPreAdviceHeader" : _fliterIinput,
            "UIPorPreAdviceShipment" : _preAdviceInput
          }

          apiService.post('eAxisAPI', appConfig.Entities.PreAdviceList.API.SendPreAdvice.Url, _filter).then(function (response) {
                if (response.data.Response) {                    
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }
                else{
                  PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }
            });
        }
        
        function ConvertToBooking() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Please wait...!";
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = true;
            if (PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders.length > 0 ) {
                for(i=0; i < PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders.length; i++){
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedCarrier) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedVessel)) {
                        toastr.warning("Selected Order(s) has should be manotary for Carrier & Vessel");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PortOfLoading) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PortOfDischarge)) {
                        toastr.warning("Selected Order(s) has should be manotary for POL & POD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedETA) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedETD)) {
                        toastr.warning("Selected Order(s) has should be manotary for ETA & ETD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].BookingCutOffDate) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].CargoCutOffDate)) {
                        toastr.warning("Selected Order(s) has should be manotary for CargoCutOffDate & BookingCutOffDate");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.selectedOrders[i].PlannedVoyage)) {
                        toastr.warning("Selected Order(s) has should be manotary for Voyage");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        return false;
                    }
                }
                PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
            } else {
                toastr.warning("Select atlest one order(s)");
                PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
            }
        }
        
        function VesselPlanningDetailsGrid(_filter) {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput = _filter;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList = [];
            PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = true;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdviceOrderList = response.data.Response;
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = false;
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.RecordCount = response.data.Count;
                    if (PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdviceOrderList.length > 0 ) {
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = false;
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdviceOrderList.map(function (value ,key) {
                            value.status = false;
                        });
                    }
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.numPerPage = 25;
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.noOfPages = Math.ceil(response.data.Count / PreAdviceBookingDirectiveCtrl.ePage.Masters.numPerPage);
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.currentPage = 1;
                }
            });
        }
        
        function VesselUnPlanningCount() {
            var _filter = {
                "IsShpCreated" : false,
                "IsValid" : true,
                "CargoReadyDate" : "NOTNULL",
                "JBS_FK" : "NULL"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.VesselUnPlanned = response.data.Count;
                }
            });
        }
        
        function VesselPlanningCount() {
            var _filter = {
                "IsShpCreated" : false,
                "IsValid" : true,
                "CargoReadyDate" : "NOTNULL",
                "JBS_FK" : "NOTNULL"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.VesselPlanned = response.data.Count;
                }
            });
        }
        
        function PlannedVesselReload() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clicked='Vessel Planned';
            var _filter = {
                "IsShpCreated" : false,
                "IsValid" : true,
                "CargoReadyDate" : "NOTNULL",
                "JBS_FK" : "NOTNULL"
            }

            VesselPlanningDetailsGrid(_filter);
        }
        
        function UnPlannedVesselReload() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clicked='Vessel Not Planned';
            var _filter = {
                "IsShpCreated" : false,
                "IsValid" : true,
                "CargoReadyDate" : "NOTNULL",
                "JBS_FK" : "NULL"
            }
            VesselPlanningDetailsGrid(_filter);
        }
        
        function AllPendingReload() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clicked='All Pending Orders';
            var _filter = {
                "IsShpCreated" : false,
                "IsValid" : true,
                "CargoReadyDate" : "NOTNULL",
                "JBS_FK" : "NULL"
            }
            VesselPlanningDetailsGrid(_filter);
        }
        
        function OverDueCountCall() {
            var _filter = {
                "FollowUpDateFrom" : PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisMonthStart,
                "FollowUpDateTo" : PreAdviceBookingDirectiveCtrl.ePage.Masters.Today,
                "IsShpCreated" : 'false',
                "IsValid" : 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.OverDueMonthlyCount = response.data.Response;
                }
            });
        }
        
        function DueThisWeekCountCall() {
            var _filter = {
                "CargoReadyDateFrom" : PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisWeekStart,
                "CargoReadyDateTo" : PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisWeekEnd,
                "IsShpCreated" : 'false',
                "IsValid" : 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI',  appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.DueWeeklyCount = response.data.Response;
                }
            });
        }
        
        function DueThisMonthCountCall() {
            var _filter = {
                "CargoReadyDateFrom" : PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisMonthStart,
                "CargoReadyDateTo" : PreAdviceBookingDirectiveCtrl.ePage.Masters.ThisMonthEnd,
                "IsShpCreated" : 'false',
                "IsValid" : 'true'
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID":  appConfig.Entities.PO.API.GetPendingCargoReadinessCount.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PO.API.GetPendingCargoReadinessCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.DueMonthlyCount = response.data.Response;
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
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };
            
            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;
                
                res.map(function (value, key) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }
        
        function SelectedPages(_input) {
          PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList = [];
          PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = true;
          PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.PageNumber = _input.page; 
          
          var _input = {
            "searchInput": helperService.createToArrayOfObject(PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput),
            "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
          }
          apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
            if (response.data.Response) {
                PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdviceOrderList = response.data.Response;
                PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = false;
              }
          });
        }

        Init();
    }
})();
