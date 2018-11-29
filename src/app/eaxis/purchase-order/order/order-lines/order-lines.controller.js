(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdLinesController", OrdLinesController);

    OrdLinesController.$inject = ["$scope", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "confirmation"];

    function OrdLinesController($scope, apiService, appConfig, helperService, toastr, $uibModal, confirmation) {

        var OrdLinesCtrl = this;

        function Init() {
            var currentOrder = OrdLinesCtrl.currentOrder[OrdLinesCtrl.currentOrder.label].ePage.Entities;
            OrdLinesCtrl.ePage = {
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
            OrdLinesCtrl.ePage.Masters.PorOrderLine.addNew = AddNew;
            OrdLinesCtrl.ePage.Masters.PorOrderLine.RemoveLineItem = RemoveLineItem;
            OrdLinesCtrl.ePage.Masters.PorOrderLine.EditLineItem = EditLineItem;
            (OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK) ? GetConsolListing(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK): false;
        }

        function GetConsolListing(Shp_Pk) {
            OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            var _filter = {
                "SHP_FK": Shp_Pk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GetContainerList(response.data.Response);
                }
            });
        }

        function GetContainerList(data) {
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
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
                            OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                OrdLinesCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
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
                templateUrl: "app/eaxis/purchase-order/order/order-lines/order-lines.form.html",
                controller: 'OrderLinesFormModalController as OrderLinesFormModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Data": item,
                            "Action": action,
                            "List": OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines,
                            "CurrentOrder": OrdLinesCtrl.ePage.Entities
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
                            OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines.splice(index, 1);
                            toastr.success("Order line has been removed Successfully..");
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        };

        $scope.$watch('OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines', function () {
            if (OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                OrdLinesCtrl.ePage.Masters.Consolidation = [{
                    Count: OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines.length,
                    Quantity: _.sumBy(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines, function (o) {
                        return o.Quantity;
                    }),
                    InvoicedQuantity: _.sumBy(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines, function (o) {
                        return o.InvoicedQuantity;
                    }),
                    RecievedQuantity: _.sumBy(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines, function (o) {
                        return o.RecievedQuantity;
                    }),
                    QtyRemaining: _.sumBy(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines, function (o) {
                        return o.Quantity;
                    }) - _.sumBy(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines, function (o) {
                        return o.RecievedQuantity;
                    }),
                    InnerPacks: _.sumBy(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines, function (o) {
                        return o.InnerPacks;
                    }),
                    OuterPacks: _.sumBy(OrdLinesCtrl.ePage.Entities.Header.Data.UIPorOrderLines, function (o) {
                        return o.OuterPacks;
                    })
                }];
            } else {
                OrdLinesCtrl.ePage.Masters.Consolidation = [{
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