(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_PreAdviceCustomToolBarController", one_one_PreAdviceCustomToolBarController);

    one_one_PreAdviceCustomToolBarController.$inject = ["$scope", "helperService", "apiService", "appConfig", "orderApiConfig", "toastr"];

    function one_one_PreAdviceCustomToolBarController($scope, helperService, apiService, appConfig, orderApiConfig, toastr) {
        var one_one_PreAdviceCustomToolBarCtrl = this;

        function Init() {
            one_one_PreAdviceCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice_Custom_Tool_Bar_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrder_Buyer": [],
                            "UISelectionList": []
                        }
                    }
                }
            };

            InitAction();
        }

        function InitAction() {
            one_one_PreAdviceCustomToolBarCtrl.input.map(function (val, key) {
                val.status = true;
            });
            one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UIOrder_Buyer = one_one_PreAdviceCustomToolBarCtrl.input;
            one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList = angular.copy(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UIOrder_Buyer);
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSchedule = false;
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.ScheduleBtn = "Add Schedule";
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.AddSchedule = AddSchedule;
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.OnComplete = OnMailSuccess;
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.DataChanges = DataChanges;

            $scope.$watch('one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList', function (newValue, oldValue) {
                one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList = newValue;
                if (one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                    VesselVerify();
                } else {
                    one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                }
            }, true);
        }

        function DataChanges(item) {
            if (item.item.status) {
                if (one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                    one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
                        if (value.PK == item.item.PK) {
                            value = item.item;
                        }
                    });
                } else {
                    one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.push(item.item);
                }
            } else {
                one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
                    if (value.PK == item.item.PK) {
                        one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.splice(key, 1);
                    }
                });
            }
        }

        function EmailOpenInput() {
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.Input = {
                "EntityRefKey": one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].PK,
                "EntitySource": "SPA",
                "EntityRefCode": one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList
            }
            var _subject = "Shipment Pre-Advice Notice -" + one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Buyer + " to " + one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Supplier;
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.MailObj = {
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
            if (one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length > 0) {
                for (i = 0; i < one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.length; i++) {
                    if (EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedCarrier) || EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedVessel)) {
                        one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].LoadPort) || EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].DischargePort)) {
                        one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedETA) || EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedETD)) {
                        one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].BookingCutOffDate) || EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].CargoCutOffDate)) {
                        one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[i].PlannedVoyage)) {
                        one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = false;
                        return false;
                    }
                }
            }
            one_one_PreAdviceCustomToolBarCtrl.ePage.Masters.IsDisableSend = true;
            EmailOpenInput();
        }

        function OnMailSuccess($item) {
            var _UIPreAdviceHeaderInput = {
                "PK": "",
                "Buyer": one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Buyer,
                "Supplier": one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList[0].Supplier,
                "Source": "GPPA"
            }
            var _UIPorPreAdviceShipment = [];
            // input for api call
            one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList.map(function (value, key) {
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
            UpdateRecords(one_one_PreAdviceCustomToolBarCtrl.ePage.Entities.Header.Data.UISelectionList);
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
            apiService.post('eAxisAPI', orderApiConfig.Entities.BuyerOrder.API.updaterecords.Url, _updateInput).then(function (response) {
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