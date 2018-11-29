(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentReadOnlyController", ConsignmentReadOnlyController);

    ConsignmentReadOnlyController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "consignmentConfig", "helperService", "$window", "$uibModal"];

    function ConsignmentReadOnlyController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, consignmentConfig, helperService, $window, $uibModal) {

        var ConsignmentReadOnlyCtrl = this;

        function Init() {

            var currentConsignment = ConsignmentReadOnlyCtrl.currentConsignment[ConsignmentReadOnlyCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentReadOnlyCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_ReadOnly",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            ConsignmentReadOnlyCtrl.ePage.Masters.Empty = "-";

            ConsignmentReadOnlyCtrl.ePage.Masters.Config = consignmentConfig;

            ConsignmentReadOnlyCtrl.ePage.Masters.DropDownMasterList = {};

            ConsignmentReadOnlyCtrl.ePage.Masters.DispatchHublistSource = "";

            ConsignmentReadOnlyCtrl.ePage.Masters.IsDisable = true;

            // DatePicker
            ConsignmentReadOnlyCtrl.ePage.Masters.DatePicker = {};
            ConsignmentReadOnlyCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            ConsignmentReadOnlyCtrl.ePage.Masters.DatePicker.OptionsDel = angular.copy(APP_CONSTANT.DatePicker)
            
            ConsignmentReadOnlyCtrl.ePage.Masters.DatePicker.OptionsDel['minDate'] = new Date;

            ConsignmentReadOnlyCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsignmentReadOnlyCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            generalOperation();
            getCarrier();
            GetJourneyLeg();
            GetConsignmentLeg();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ConsignmentReadOnlyCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getCarrier() {
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode == null) {
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode = "";
            }
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierName == null) {
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierName = "";
            }
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierCode == null) {
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierCode = "";
            }
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierName == null) {
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierName = "";
            }
            ConsignmentReadOnlyCtrl.ePage.Masters.SenderCarrier = ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode + "-" + ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierName;
            ConsignmentReadOnlyCtrl.ePage.Masters.DeliveryCarrier = ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierCode + "-" + ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierName;
            if (ConsignmentReadOnlyCtrl.ePage.Masters.SenderCarrier == "-") {
                ConsignmentReadOnlyCtrl.ePage.Masters.SenderCarrier = "";
            }
            if (ConsignmentReadOnlyCtrl.ePage.Masters.DeliveryCarrier == "-") {
                ConsignmentReadOnlyCtrl.ePage.Masters.SenderCarrier = "";
            }
        }

        function generalOperation() {
            // Sender
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode == null)
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = "";
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName == null)
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName = "";
            ConsignmentReadOnlyCtrl.ePage.Masters.Sender = ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
            if (ConsignmentReadOnlyCtrl.ePage.Masters.Sender == " - ")
                ConsignmentReadOnlyCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode == null)
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = "";
            if (ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName == null)
                ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = "";
            ConsignmentReadOnlyCtrl.ePage.Masters.Receiver = ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
            if (ConsignmentReadOnlyCtrl.ePage.Masters.Receiver == " - ")
                ConsignmentReadOnlyCtrl.ePage.Masters.Receiver = "";
        }

        function GetConsignmentLeg() {
            var _filter = {
                "TMC_FK": ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentReadOnlyCtrl.ePage.Entities.Header.API.ConsignmentLeg.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentReadOnlyCtrl.ePage.Entities.Header.API.ConsignmentLeg.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentReadOnlyCtrl.ePage.Masters.ConsignmentLeg = response.data.Response;
                }
            });
        }

        function GetJourneyLeg() {
            var _filter = {
                "TMJ_FK": ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentReadOnlyCtrl.ePage.Entities.Header.API.TmsJourneyLeg.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentReadOnlyCtrl.ePage.Entities.Header.API.TmsJourneyLeg.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _TransitDays = 0;
                    angular.forEach(response.data.Response, function (value, key) {
                        var a = parseInt(value.TML_TransitDays);
                        _TransitDays = _TransitDays + a;
                        ConsignmentReadOnlyCtrl.ePage.Masters.TransitDays = _TransitDays;
                    });
                }
            });
        }

        function GetDispatchHub() {
            // get  
            var _filter = {
                "MappingFor_FK": ConsignmentReadOnlyCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                "MappingCode": "RECEIVER_DEPOT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentReadOnlyCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentReadOnlyCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentReadOnlyCtrl.ePage.Masters.DispatchHublistSource = response.data.Response;
                    ConsignmentReadOnlyCtrl.ePage.Masters.DispatchHub = response.data.Response[0].ORG_MappingToName + "-" + response.data.Response[0].ORG_MappingToCode;
                }
            });
        }

        function setSelectedRow(index) {
            ConsignmentReadOnlyCtrl.ePage.Masters.selectedRow = index;
        }

        Init();
    }

})();