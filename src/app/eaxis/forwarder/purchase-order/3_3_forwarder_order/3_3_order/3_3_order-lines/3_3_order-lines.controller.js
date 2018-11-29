(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrdLinesController", three_three_OrdLinesController);

    three_three_OrdLinesController.$inject = ["$scope", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "confirmation"];

    function three_three_OrdLinesController($scope, apiService, appConfig, helperService, toastr, $uibModal, confirmation) {

        var three_three_OrdLinesCtrl = this;

        function Init() {
            var currentOrder = three_three_OrdLinesCtrl.currentOrder[three_three_OrdLinesCtrl.currentOrder.label].ePage.Entities;
            three_three_OrdLinesCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Line",
                "Masters": {
                    "PorOrderLine": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentOrder,
            };

            InitOrderLine();
        }

        function InitOrderLine() {
            //=======PorOrderLine GridConfig=======
            three_three_OrdLinesCtrl.ePage.Masters.PorOrderLine.addNew = AddNew;
            three_three_OrdLinesCtrl.ePage.Masters.PorOrderLine.RemoveLineItem = RemoveLineItem;
            three_three_OrdLinesCtrl.ePage.Masters.PorOrderLine.EditLineItem = EditLineItem;
            (three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK) ? GetConsolListing(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK): false;
        }

        function GetConsolListing(Shp_Pk) {
            three_three_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            var _filter = {
                "SHP_FK": Shp_Pk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GetContainerList(response.data.Response);
                }
            });
        }

        function GetContainerList(data) {
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = three_three_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
                            return value3.PK === value2.PK;
                        });

                        if (!_isExist) {
                            var _obj = {
                                "ContainerNo": value2.ContainerNo,
                                "CNT": value2.PK,
                                "ContainerCount": value2.ContainerCount,
                                "RC_Type": value2.RC_Type,
                                "SealNo": value2.SealNo
                            };
                            three_three_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                three_three_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }

        function EditLineItem(item) {
            AddNew(item, 'edit');
        }

        function AddNew(item, action) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right",
                scope: $scope,
                templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_order-lines.form.html",
                controller: 'three_three_OrderLinesFormModalController as three_three_OrderLinesFormModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Data": item,
                            "Action": action,
                            "List": three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder,
                            "CurrentOrder": three_three_OrdLinesCtrl.ePage.Entities
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {}
            );
        };

        function RemoveLineItem(item, index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete Order Line?',
                bodyText: 'Are you sure you want to remove this Order line?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    item.IsDeleted = true
                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [item]).then(function (response) {
                        if (response.data.Response) {
                            three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.splice(index, 1);
                            toastr.success("Order line has been removed Successfully..");
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        };

        $scope.$watch('three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder', function () {
            if (three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.length > 0) {
                three_three_OrdLinesCtrl.ePage.Masters.Consolidation = [{
                    Count: three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.length,
                    Quantity: _.sumBy(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(three_three_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                three_three_OrdLinesCtrl.ePage.Masters.Consolidation = [{
                    "Count": 0,
                    "InnerPacks": 0,
                    "InvoicedQuantity": 0,
                    "OuterPacks": 0,
                    "QtyRemaining": 0,
                    "Quantity": 0,
                    "RecievedQuantity": 0
                }];
            }

        }, true);

        Init();
    }
})();