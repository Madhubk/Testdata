(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PreAdviceCustomToolBarController", PreAdviceCustomToolBarController);

    PreAdviceCustomToolBarController.$inject = ["$scope", "helperService", "apiService", "appConfig", "toastr"];

    function PreAdviceCustomToolBarController($scope, helperService, apiService, appConfig, toastr) {
        var PreAdviceCustomToolBarCtrl = this;

        function Init() {
            PreAdviceCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice_Custom_Tool_Bar_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIPorOrderheader": [],
                            "UISelectionList": []
                        }
                    }
                }
            };

            InitAction();
        }

        function InitAction() {
            PreAdviceCustomToolBarCtrl.input.map(function (val, key) {
                val.status = true;
            });
            PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UIPorOrderheader = PreAdviceCustomToolBarCtrl.input;
            PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList = angular.copy(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UIPorOrderheader);
            PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
            PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSchedule = false;
            PreAdviceCustomToolBarCtrl.ePage.Masters.ScheduleBtn = "Add Schedule";
            PreAdviceCustomToolBarCtrl.ePage.Masters.AddSchedule = AddSchedule;
            PreAdviceCustomToolBarCtrl.ePage.Masters.OnComplete = OnMailSuccess;
            PreAdviceCustomToolBarCtrl.ePage.Masters.DataChanges = DataChanges;

            $scope.$watch('PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList', function (newValue, oldValue) {
                PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList = newValue;
                if (PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                    VesselVerify();
                } else {
                    PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                }
            }, true);
        }

        function DataChanges(item) {
            if (item.item.status) {
                if (PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                    PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
                        if (value.PK == item.item.PK) {
                            value = item.item;
                        }
                    });
                } else {
                    PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.push(item.item);
                }
            } else {
                PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
                    if (value.PK == item.item.PK) {
                        PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.splice(key, 1);
                    }
                });
            }
        }

        function EmailOpenInput() {
            PreAdviceCustomToolBarCtrl.ePage.Masters.Input = {
                "EntityRefKey": PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].PK,
                "EntitySource": "SPA",
                "EntityRefCode": PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList
            }
            var _subject = "Shipment Pre-Advice Notice -" + PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Buyer + " to " + PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Supplier;
            PreAdviceCustomToolBarCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "Report3",
                TemplateObj: {
                    Key: "Report3",
                    Description: "Order Pre-Advice"
                }
            };
        }

        function AddSchedule() {
            var _check = VesselVerify();
            (!_check) ? toastr.warning("Selected Order(s) should have Carrier,Vessel,Voyage/Flight,ETA,ETD,POL,POD,Booking Cut Off and Cargo Cut off"): false;
        }

        function VesselVerify() {
            if (PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                for (i = 0; i < PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length; i++) {
                    if (EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedCarrier) || EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedVessel)) {
                        PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].LoadPort) || EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].DischargePort)) {
                        PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedETA) || EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedETD)) {
                        PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].BookingCutOffDate) || EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].CargoCutOffDate)) {
                        PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedVoyage)) {
                        PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                }
            }
            PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = true;
            EmailOpenInput();
        }

        function OnMailSuccess($item) {
            var _UIPreAdviceHeaderInput = {
                "PK": "",
                "Buyer": PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Buyer,
                "Supplier": PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Supplier,
                "Source": "GPPA"
            }
            var _UIPorPreAdviceShipment = [];
            // input for api call
            PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
                var _UIPorPreAdviceShipmentInput = {
                    "PK": "",
                    "CargoCutOffDate": value.CargoCutOffDate,
                    "BookingCutOffDate": value.BookingCutOffDate,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "PlannedETD": value.PlannedETD,
                    "PlannedETA": value.PlannedETA,
                    "PlannedVessel": value.PlannedVessel,
                    "PlannedVoyage": value.PlannedVoyage,
                    "PlannedCarrier": value.PlannedCarrier,
                    "Source": "PPA",
                    "PortOfLoading": value.LoadPort,
                    "PortOfDischarge": value.DischargePort,
                    "POH_FK": value.PK
                }
                _UIPorPreAdviceShipment.push(_UIPorPreAdviceShipmentInput);
            });
            var _input = {
                "PK": "",
                "UIPreAdviceHeader": _UIPreAdviceHeaderInput,
                "UIPorPreAdviceShipment": _UIPorPreAdviceShipment
            }
            apiService.post("eAxisAPI", appConfig.Entities.VesselPlanning.API.SendPreAdvice.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {}
            });
            UpdateRecords(PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList);
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

        function EmptyOrNullCheck(val) {
            if (val == "" || val == null || val == undefined)
                return true;
            else
                return false;
        }

        Init();
    }
})();