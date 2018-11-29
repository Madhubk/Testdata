(function () {
    "use strict";

    angular
        .module("Application")
        .controller("preAdviceBookingDirectiveController", PreAdviceBookingDirectiveController);

    PreAdviceBookingDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "preAdviceConfig", "authService"];

    function PreAdviceBookingDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, appConfig, helperService, toastr, $uibModal, preAdviceConfig, authService) {
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

            InitPreAdvice();
            InitDatePicker();
        }

        function InitPreAdvice() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertToBooking = ConvertToBooking;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Filter = Filter;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.OpenFilter = OpenFilter;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.CloseFilter = CloseFilter;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clear = Clear;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput = {};
            PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableBulk = false;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.PlannedVesselReload = PlannedVesselReload;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.UnPlannedVesselReload = UnPlannedVesselReload;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.AllPendingReload = AllPendingReload;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.AddVessel = AddVessel;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
            PreAdviceBookingDirectiveCtrl.ePage.Masters.RecordCount = 0;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectedPages = SelectedPages;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdviceHistoryCall = PreAdviceHistoryCall;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.OnComplete = OnMailSuccess;

            InitShipmentPreAdvice();
            GetRelatedLookupList();
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
                if (PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                    VesselVerify();
                } else {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }
            }, true);

            InitGetDate();
            VesselPlanningCount();
            VesselUnPlanningCount();
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

        function Filter() {
            var _filter = {
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "IsShpCreated": false,
                "Buyer": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Buyer,
                "Supplier": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Supplier,
                "OrderNo": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.OrderNo,
                "CargoReadyDate": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.CargoReadyDate,
                "Carrier": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Carrier,
                "Vessel": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Vessel,
                "Voyage": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.Voyage,
                "ETD": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.ETD,
                "ETA": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.ETA,
                "PortOfLoading": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.PortOfLoading,
                "PortOfDischarge": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.PortOfDischarge,
                "CargoCutOffDate": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.CargoCutOffDate,
                "BookingCutOffDate": PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput.BookingCutOffDate
            }

            CloseFilter();
            VesselPlanningDetailsGrid(_filter);
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
            PreAdviceBookingDirectiveCtrl.ePage.Masters.FilterInput = {};
        }

        function AddVessel(type, data) {
            if (type == "New") {
                if (PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "vessel-template right",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eAxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.html",
                        controller: 'vesselModalController',
                        controllerAs: "VesselModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "BulkInput": data,
                                    "Mode": type
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {
                            PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.map(function (value, key) {
                                if (value.status) {
                                    value.Vessel_FK = response.PK;
                                    value.PlannedVoyage = response.VoyageFlight;
                                    value.PlannedVessel = response.Vessel;
                                    value.PlannedETD = response.ETD;
                                    value.LoadPort = response.LoadPort;
                                    value.CargoCutOffDate = response.CargoCutOffDate;
                                    value.BookingCutOffDate = response.BookingCutOffDate;
                                    value.DischargePort = response.DischargePort;
                                    value.PlannedETA = response.ETA;
                                    value.PlannedCarrier = response.CarrierOrg_Code;
                                    value.CarrierOrg_FK = response.CarrierOrg_FK;
                                }
                            });
                            toastr.success("Successfully saved...")
                        },
                        function (response) {}
                    );
                } else {
                    toastr.warning("Select atlest one order(s) to update vessel")
                }
            }
            // Edit Mode
            if (type == "Edit") {
                if (data.length > 0) {
                    for (i = 0; i < data.length; i++) {
                        if (EmptyOrNullCheck(data[i].PlannedVessel)) {
                            toastr.warning("Selected Order(s) should not have vessel. Please update vessel and then edit your vessel.");
                            return false;
                        }
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "vessel-template right",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eAxis/purchase-order/pre-advice-directive/vessel-modal/vessel-modal.html",
                        controller: 'vesselModalController',
                        controllerAs: "VesselModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "BulkInput": data,
                                    "Mode": type,
                                    "OrderList": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {
                            PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.map(function (value, key) {
                                for (i = 0; i < response.length; i++) {
                                    if (value.status && value.Vessel_FK == response[i].PK) {
                                        value.Vessel_FK = response[i].PK;
                                        value.PlannedVoyage = response[i].VoyageFlight;
                                        value.PlannedVessel = response[i].Vessel;
                                        value.PlannedETD = response[i].ETD;
                                        value.LoadPort = response[i].LoadPort;
                                        value.CargoCutOffDate = response[i].CargoCutOffDate;
                                        value.BookingCutOffDate = response[i].BookingCutOffDate;
                                        value.DischargePort = response[i].DischargePort;
                                        value.PlannedETA = response[i].ETA;
                                        value.PlannedCarrier = response[i].CarrierOrg_Code;
                                        value.CarrierOrg_FK = response[i].CarrierOrg_FK;
                                    }
                                }
                            })
                            toastr.success("Successfully updated...");
                        },
                        function (response) {}
                    );
                } else {
                    toastr.warning("Select atlest one order(s) to update vessel");
                }
            }
        }

        function DataChanges(data) {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList = data;
        }

        function VesselVerify() {
            if (PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                for (i = 0; i < PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.length; i++) {
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedCarrier) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedVessel)) {
                        // toastr.warning("Selected Order(s) should have Carrier & Vessel");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].LoadPort) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].DischargePort)) {
                        // toastr.warning("Selected Order(s) should have POL & POD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedETA) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedETD)) {
                        // toastr.warning("Selected Order(s) should have ETA & ETD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].BookingCutOffDate) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].CargoCutOffDate)) {
                        // toastr.warning("Selected Order(s) should have CargoCutOffDate & BookingCutOffDate");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedVoyage)) {
                        // toastr.warning("Selected Order(s) should have Voyage");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                }
            }
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = true;
            EmailOpenInput();
        }

        function EmailOpenInput() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Input = {
                "EntityRefKey": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[0].PK,
                "EntitySource": "SPA",
                "EntityRefCode": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList
            }
            var _subject = "Shipment Pre-Advice Notice -" + PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[0].Buyer + " to " + PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[0].Supplier;
            PreAdviceBookingDirectiveCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "Report3",
                TemplateObj: {
                    Key: "Report3",
                    Description: "Order Pre-Advice"
                }
            };
        }

        function OnMailSuccess($item) {
            var _UIPreAdviceHeaderInput = {
                "PK": "",
                "Buyer": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[0].Buyer,
                "Supplier": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[0].Supplier,
                "Source": "GPPA"
            }
            var _UIPorPreAdviceShipment = [];
            for (i = 0; i < PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.length; i++) {
                var _UIPorPreAdviceShipmentInput = {
                    "PK": "",
                    "CargoCutOffDate": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].CargoCutOffDate,
                    "BookingCutOffDate": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].BookingCutOffDate,
                    "Buyer": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].Buyer,
                    "Supplier": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].Supplier,
                    "OrderNo": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].OrderNo,
                    "OrderSplitNo": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].OrderSplitNo,
                    "PlannedETD": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedETD,
                    "PlannedETA": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedETA,
                    "PlannedVessel": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedVessel,
                    "PlannedVoyage": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedVoyage,
                    "PlannedCarrier": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedCarrier,
                    "Source": "PPA",
                    "PortOfLoading": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].LoadPort,
                    "PortOfDischarge": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].DischargePort,
                    "POH_FK": PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PK
                }
                _UIPorPreAdviceShipment.push(_UIPorPreAdviceShipmentInput);
            }
            var _input = {
                "PK": "",
                "UIPreAdviceHeader": _UIPreAdviceHeaderInput,
                "UIPorPreAdviceShipment": _UIPorPreAdviceShipment
            }
            apiService.post("eAxisAPI", appConfig.Entities.VesselPlanning.API.SendPreAdvice.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {}
            });
            UpdateRecords(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList);
        }

        function PreAdviceHistoryCall() {
            var _filter = {
                "EntitySource": "PPA"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdiveHistory = response.data.Response;
                    PreAdiveHistoryModal();
                } else {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdiveHistory = [];
                    PreAdiveHistoryModal();
                }
            });
        }

        function PreAdiveHistoryModal() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/purchase-order/pre-advice-directive/pre-advice-history-modal/pre-advice-history-modal.html",
                controller: 'PreAdviceHistroyModalController',
                controllerAs: "PreAdviceHistroyModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "HistoryList": PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdiveHistory
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {
                    PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableSend = false;
                }
            );
        }

        function ConvertToBooking() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Please wait...!";
            PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = true;
            if (PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.length > 0) {
                for (i = 0; i < PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList.length; i++) {
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedCarrier) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedVessel)) {
                        toastr.warning("Selected Order(s) should have Carrier & Vessel");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].LoadPort) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].DischargePort)) {
                        toastr.warning("Selected Order(s) should have POL & POD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedETA) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedETD)) {
                        toastr.warning("Selected Order(s) should have ETA & ETD");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].BookingCutOffDate) || EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].CargoCutOffDate)) {
                        toastr.warning("Selected Order(s) should have CargoCutOffDate & BookingCutOffDate");
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.ConvertBookingText = "Convert As Booking";
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.IsDisableConvert = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceBookingDirectiveCtrl.ePage.Masters.SelectionList[i].PlannedVoyage)) {
                        toastr.warning("Selected Order(s) should have Voyage");
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

        function UpdateRecords(_items) {
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].PK,
                    "Properties": [{
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "PAC"
                    }]
                };
                _updateInput.push(_tempObj);
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Successfully saved...");
                } else {
                    toastr.error("Save Failed...")
                }
            });
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
                    if (PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdviceOrderList.length > 0) {
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.spinner = false;
                        PreAdviceBookingDirectiveCtrl.ePage.Masters.PreAdviceOrderList.map(function (value, key) {
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
                "IsShpCreated": false,
                "IsValid": true,
                "CargoReadyDate": "NOTNULL",
                "JBS_FK": "NULL"
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
                "IsShpCreated": false,
                "IsValid": true,
                "CargoReadyDate": "NOTNULL",
                "JBS_FK": "NOTNULL"
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
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clicked = 'Vessel Planned';
            var _filter = {
                "IsShpCreated": false,
                "IsValid": true,
                "CargoReadyDate": "NOTNULL",
                "JBS_FK": "NOTNULL"
            }

            VesselPlanningDetailsGrid(_filter);
        }

        function UnPlannedVesselReload() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clicked = 'Vessel Not Planned';
            var _filter = {
                "IsShpCreated": false,
                "IsValid": true,
                "CargoReadyDate": "NOTNULL",
                "JBS_FK": "NULL"
            }
            VesselPlanningDetailsGrid(_filter);
        }

        function AllPendingReload() {
            PreAdviceBookingDirectiveCtrl.ePage.Masters.Clicked = 'All Pending Orders';
            var _filter = {
                "IsShpCreated": false,
                "IsValid": true,
                "CargoReadyDate": "NOTNULL",
                "JBS_FK": "NULL"
            }
            VesselPlanningDetailsGrid(_filter);
        }

        function EmptyOrNullCheck(val) {
            if (val == "" || val == null || val == undefined)
                return true;
            else
                return false;
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdSUFBuyerSelection_2998,OrdSUFSupplierSelection_3000,OrdPlannedCarrier_2832,OrdPlannedVessel_3185,PortOfLoading_3086,POD_3308",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
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