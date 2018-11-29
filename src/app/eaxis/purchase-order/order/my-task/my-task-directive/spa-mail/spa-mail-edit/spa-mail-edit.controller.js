(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SpaMailEditDirectiveController", SpaMailEditDirectiveController);

    SpaMailEditDirectiveController.$inject = ["$scope", "$uibModal", "apiService", "appConfig", "toastr", "helperService"];

    function SpaMailEditDirectiveController($scope, $uibModal, apiService, appConfig, toastr, helperService) {
        var SpaMailEditDirectiveCtrl = this;

        function Init() {
            SpaMailEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SPA_Mail_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            SPAMailInit();
        }

        function SPAMailInit() {
            SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj = SpaMailEditDirectiveCtrl.taskObj;
            SpaMailEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            SpaMailEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            SpaMailEditDirectiveCtrl.ePage.Masters.VesselPlan = VesselPlan;
            SpaMailEditDirectiveCtrl.ePage.Masters.OnComplete = OnMailSucces;
            SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;
            SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder = [];
            $scope.$watch('SpaMailEditDirectiveCtrl.ePage.Masters.SpaOrderList', function (newValue, oldValue) {
                if (SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                    VesselVerify();
                } else {
                    SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;
                }
            }, true);

            PreAdviceGrid();
            PreAdviceMailGrid();
        }

        function PreAdviceGrid() {
            apiService.get("eAxisAPI", appConfig.Entities.VesselPlanning.API.GetOrdersByVesselPk.Url + SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.Buyer = value.BuyerCode;
                        value.Supplier = value.SupplierCode;
                        value.status = true;
                    });
                    SpaMailEditDirectiveCtrl.ePage.Masters.SpaOrderList = response.data.Response;
                    SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                    SpaMailEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                } else {
                    SpaMailEditDirectiveCtrl.ePage.Masters.SpaOrderList = [];
                }
            });
        }

        function PreAdviceMailGrid() {
            var _filter = {
                "EntitySource": "GPA",
                "EntityRefKey": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SpaMailEditDirectiveCtrl.ePage.Masters.MailHistory = response.data.Response;
                } else {
                    SpaMailEditDirectiveCtrl.ePage.Masters.MailHistory = [];
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                if (SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                    SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                        if (value.POH_FK == _item.item.POH_FK) {
                            SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                        }
                    });
                } else {
                    SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
                }
            } else {
                SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.POH_FK == _item.item.POH_FK) {
                        SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function VesselPlan(type, data) {
            if (type == "New") {
                if (SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "vessel-templ right",
                        scope: $scope,
                        // size : "sm",
                        templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/spa-mail/spa-mail-vessel-modal/spa-mail-vessel-modal.html",
                        controller: 'SPAVesselModalController',
                        controllerAs: "SPAVesselModalCtrl",
                        bindToController: true,
                        resolve: {
                            param: function () {
                                var exports = {
                                    "BulkInput": data,
                                    "Mode": type,
                                    "ParentObj": SpaMailEditDirectiveCtrl.ePage
                                };
                                return exports;
                            }
                        }
                    }).result.then(
                        function (response) {
                            PreAdviceGrid();
                            toastr.success("Successfully saved...")
                        },
                        function (response) {}
                    );
                } else {
                    toastr.warning("Select atlest one order(s) to update vessel")
                }
            }
        }

        function VesselVerify() {
            if (SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                for (i = 0; i < SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length; i++) {
                    if (EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedCarrier) || EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedVessel)) {
                        SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PortOfLoading) || EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PortOfDischarge)) {
                        SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedETA) || EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedETD)) {
                        SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].BookingCutOffDate) || EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].CargoCutOffDate)) {
                        SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;
                        return false;
                    }
                    if (EmptyOrNullCheck(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedVoyage)) {
                        SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = false;
                        return false;
                    }
                }
                SpaMailEditDirectiveCtrl.ePage.Masters.IsDisabledSend = true;
                EmailOpenInput();
            }
        }

        function EmailOpenInput() {
            SpaMailEditDirectiveCtrl.ePage.Masters.Input = {
                "EntityRefKey": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntitySource": "GPA",
                "EntityRefCode": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder
            }
            var _subject = "Shipment Pre-Advice Notice -" + SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].BuyerCode + " to " + SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[0].SupplierCode;
            SpaMailEditDirectiveCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "Report3",
                TemplateObj: {
                    Key: "Report3",
                    Description: "Order Pre-Advice"
                }
            };
        }

        // function Complete() {
        //     var _input = [];
        //     SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
        //         var _inputData = {
        //             "OrderNo": value.OrderNo,
        //             "OrderSplitNo": value.OrderSplitNo,
        //             "POH_FK": value.POH_FK,
        //             "Buyer": value.BuyerCode,
        //             "Supplier": value.SupplierCode,
        //             "FollowUpDetailPK": value.FK
        //         }
        //         _input.push(_inputData);
        //     });
        //     var _filter = {
        //         "GroupEntityRefKey": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
        //         "UIVesselPlanningDetails": _input
        //     }
        //     apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
        //         if (response.data.Status === "Success") {
        //             toastr.success("Task Completed SuccesSpally...!");
        //             var _data = {
        //                 IsCompleted: true,
        //                 Item: SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj
        //             };

        //             SpaMailEditDirectiveCtrl.onComplete({
        //                 $item: _data
        //             });
        //         } else {
        //             toastr.error("Task Completion Failed...!");
        //         }
        //     });
        // }

        function OnMailSucces($item) {
            var _UIPreAdviceHeaderInput = {
                "PK": "",
                "Buyer": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer,
                "Supplier": SpaMailEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper,
                "Source": "GPPA"
            }
            var _UIPorPreAdviceShipment = [];
            for (i = 0; i < SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder.length; i++) {
                var _UIPorPreAdviceShipmentInput = {
                    "PK": "",
                    "CargoCutOffDate": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].CargoCutOffDate,
                    "BookingCutOffDate": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].BookingCutOffDate,
                    "Buyer": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].BuyerCode,
                    "Supplier": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].SupplierCode,
                    "OrderNo": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].OrderNo,
                    "OrderSplitNo": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].OrderSplitNo,
                    "PlannedETD": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedETD,
                    "PlannedETA": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedETA,
                    "PlannedVessel": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedVessel,
                    "PlannedVoyage": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedVoyage,
                    "PlannedCarrier": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PlannedCarrier,
                    "Source": "PPA",
                    "PortOfLoading": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PortOfLoading,
                    "PortOfDischarge": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].PortOfDischarge,
                    "POH_FK": SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder[i].POH_FK
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
            UpdateRecords(SpaMailEditDirectiveCtrl.ePage.Masters.SelectedOrder);
            PreAdviceMailGrid();
        }

        function UpdateRecords(_items) {
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].POH_FK,
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

        function EmptyOrNullCheck(value) {
            if (value == "" || value == null)
                return true;
            else
                return false;
        }

        Init();
    }
})();