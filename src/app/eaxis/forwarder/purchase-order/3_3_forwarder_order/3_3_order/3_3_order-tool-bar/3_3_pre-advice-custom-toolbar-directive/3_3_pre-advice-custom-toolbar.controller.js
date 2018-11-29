(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_PreAdviceCustomToolBarController", three_three_PreAdviceCustomToolBarController);

    three_three_PreAdviceCustomToolBarController.$inject = ["$scope", "helperService", "apiService", "appConfig", "toastr"];

    function three_three_PreAdviceCustomToolBarController($scope, helperService, apiService, appConfig, toastr) {
        var three_three_PreAdviceCustomToolBarCtrl = this;

        function Init() {
            three_three_PreAdviceCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice_Custom_Tool_Bar_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrder_Forwarder": [],
                            "UISelectionList": []
                        }
                    }
                }
            };

            InitAction();
        }

        function InitAction() {
            three_three_PreAdviceCustomToolBarCtrl.input.map(function (val, key) {
                val.status = true;
            });
            three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder = three_three_PreAdviceCustomToolBarCtrl.input;
            three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList = angular.copy(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder);
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSchedule = false;
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.ScheduleBtn = "Add Schedule";
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.AddSchedule = AddSchedule;
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.OnComplete = OnMailSuccess;
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.DataChanges = DataChanges;

            $scope.$watch('three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList', function (newValue, oldValue) {
                three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList = newValue;
                if (three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                    VesselVerify();
                } else {
                    three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                }
            }, true);
        }

        function DataChanges(item) {
            if (item.item.status) {
                if (three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                    three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
                        if (value.PK == item.item.PK) {
                            value = item.item;
                        }
                    });
                } else {
                    three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.push(item.item);
                }
            } else {
                three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
                    if (value.PK == item.item.PK) {
                        three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.splice(key, 1);
                    }
                });
            }
        }

        function EmailOpenInput() {
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.Input = {
                "EntityRefKey": three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].PK,
                "EntitySource": "SPA",
                "EntityRefCode": three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList
            }
            var _subject = "Shipment Pre-Advice Notice -" + three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Buyer + " to " + three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Supplier;
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.MailObj = {
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
            if (three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                for (i = 0; i < three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length; i++) {
                    if (EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedCarrier) || EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedVessel)) {
                        three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].LoadPort) || EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].DischargePort)) {
                        three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedETA) || EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedETD)) {
                        three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].BookingCutOffDate) || EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].CargoCutOffDate)) {
                        three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedVoyage)) {
                        three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                }
            }
            three_three_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = true;
            EmailOpenInput();
        }

        function OnMailSuccess($item) {
            var _UIPreAdviceHeaderInput = {
                "PK": "",
                "Buyer": three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Buyer,
                "Supplier": three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Supplier,
                "Source": "GPPA"
            }
            var _UIPorPreAdviceShipment = [];
            // input for api call
            three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
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
            UpdateRecords(three_three_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList);
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