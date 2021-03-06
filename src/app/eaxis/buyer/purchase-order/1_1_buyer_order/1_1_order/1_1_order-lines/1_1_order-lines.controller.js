(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrdLinesController", one_one_OrdLinesController);

    one_one_OrdLinesController.$inject = ["$scope", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "confirmation"];

    function one_one_OrdLinesController($scope, apiService, appConfig, helperService, toastr, $uibModal, confirmation) {

        var one_one_OrdLinesCtrl = this;

        function Init() {
            var currentOrder = one_one_OrdLinesCtrl.currentOrder[one_one_OrdLinesCtrl.currentOrder.label].ePage.Entities;
            one_one_OrdLinesCtrl.ePage = {
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
            one_one_OrdLinesCtrl.ePage.Masters.PorOrderLine.addNew = AddNew;
            one_one_OrdLinesCtrl.ePage.Masters.PorOrderLine.RemoveLineItem = RemoveLineItem;
            one_one_OrdLinesCtrl.ePage.Masters.PorOrderLine.EditLineItem = EditLineItem;
            (one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK) ? GetConsolListing(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK): false;
        }

        function GetConsolListing(Shp_Pk) {
            one_one_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
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
                        var _isExist = one_one_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
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
                            one_one_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                one_one_OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
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
                templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/1_1_order-lines.form.html",
                controller: 'one_one_OrderLinesFormModalController as one_one_OrderLinesFormModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Data": item,
                            "Action": action,
                            "List": one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer,
                            "CurrentOrder": one_one_OrdLinesCtrl.ePage.Entities
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
                            one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.splice(index, 1);
                            toastr.success("Order line has been removed Successfully..");
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        };

        $scope.$watch('one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer', function () {
            if (one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length > 0) {
                one_one_OrdLinesCtrl.ePage.Masters.Consolidation = [{
                    Count: one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.length,
                    Quantity: _.sumBy(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(one_one_OrdLinesCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                one_one_OrdLinesCtrl.ePage.Masters.Consolidation = [{
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