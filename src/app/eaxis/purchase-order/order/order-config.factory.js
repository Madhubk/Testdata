(function () {
    "use strict";

    angular
        .module("Application")
        .factory('orderConfig', OrderConfig);

    OrderConfig.$inject = ["$q", "helperService", "toastr"];

    function OrderConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/GetById/",
                            "FilterID": " ORDHEAD"
                        },
                        "OrderHeaderActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/OrderHeaderActivityClose/",
                            "FilterID": ""
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };

        return exports;

        function GetTabDetails(currentOrder, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrderList/GetById/",
                                "FilterID": " ORDHEAD"
                            },
                            "InsertOrder": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrderList/Insert"
                            },
                            "UpdateOrder": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrderList/Update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Order",
                                "Value": "General",
                                "Icon": "fa-cart-plus"
                            }, {
                                "DisplayName": "Order Lines",
                                "Value": "OrderLines",
                                "Icon": "fa-th-list"
                            }, {
                                "DisplayName": "Product Summary",
                                "Value": "ProductQuantitySummary",
                                "Icon": "fa-calculator"
                            }, {
                                "DisplayName": "Cargo Readiness",
                                "Value": "CargoReadiness",
                                "Icon": "fa-truck"
                            }, {
                                "DisplayName": "Vessel Plannig",
                                "Value": "ShpPreAdvice",
                                "Icon": "fa-cubes"
                            }, {
                                "DisplayName": "Shipment",
                                "Value": "Shipment",
                                "Icon": "fa-plane"
                            }, {
                                "DisplayName": "Sub PO",
                                "Value": "Split",
                                "Icon": "fa-chain-broken"
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa-address-card-o"
                            }],
                            "Currency": helperService.metaBase(),
                            "ServiceLevel": helperService.metaBase(),
                            "Country": helperService.metaBase(),
                            "MstPackType": helperService.metaBase(),
                            "GoodsAvailAt": helperService.metaBase(),
                            "GoodsDeliveredTo": helperService.metaBase(),
                            "AddressContactObject": {}
                        }
                    },
                    "OrderShipment": {
                        "ListSource": [],
                        "RowIndex": -1,
                        "Grid": {
                            "ColumnDef": [{
                                "field": "ShipmentNo",
                                "displayName": "ShipmentNo",
                            }, {
                                "field": "TransportMode",
                                "displayName": "Transport Mode",
                            }, {
                                "field": "Destination",
                                "displayName": "Destination",
                            }, {
                                "field": "ORG_Consignee_Code",
                                "displayName": "ORG_Consignee_Code",
                            }, {
                                "field": "HouseBill",
                                "displayName": "HouseBill",
                            }, {
                                "field": "ETD",
                                "displayName": "ETD",
                            }, {
                                "field": "ORG_Shipper_Code",
                                "displayName": "ORG_Shipper_Code",
                            }, {
                                "field": "ETA",
                                "displayName": "ETA",
                            }, {
                                "field": "Origin",
                                "displayName": "Origin",
                            }],
                            "GridConfig": {
                                "_gridHeight": 230,
                                "_enableRowSelection": true,
                                "_enableRowHeaderSelection": true,
                                "_multiSelect": false,
                                "_exporterCsvFilename": "data",
                                "_exporterPdfFilename": "data",
                                "_enablePaginationControls": false,
                                "_enableGridMenu": false,
                                "_enableColumnMenus": false,
                                "_enableCellSelection": false,
                                "_enableCellEdit": false,
                                "_enableSorting": true,
                                "_useExternalSorting": false,
                                "_useExternalPagination": false,
                                "_isAPI": false,
                                "_rowTemplate": "",
                                "_columnPrefix": "SHP_",
                                "_sortColumn": "ShipmentNo",
                                "_sortType": "ASC",
                                "_pageNumber": 1,
                                "_paginationPageSize": 25,
                                "_paginationPageSizes": [25, 50, 100]
                            }
                        }
                    },
                    "OrderLineDelivery": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrderList/GetById/",
                                "FilterID": "ORDHEAD"
                            }
                        },
                        "Meta": {
                            "MstPackType": helperService.metaBase()
                        },
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "Consol Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "PortOfLoading",
                                "displayName": "Destination Port",
                                "width": 100
                            }, {
                                "field": "PortOfDischarge",
                                "displayName": "Delivery Port",
                                "width": 100
                            },{
                                "field": "Address1",
                                "displayName": "Address 1",
                                "width": 200
                            }, {
                                "field": "Address2",
                                "displayName": "Address2",
                                "width": 200
                            }, {
                                "field": "Qty_Delivered",
                                "displayName": "Qty.Delivered",
                                "width": 50
                            }]
                        }
                    },
                    "PorOrderLine": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrderLinesList/GetById/",
                                "FilterID": "ORDHEAD"
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderLine/FindAll",
                                "FilterID": "ORDLINE"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderLine/Upsert",
                                "FilterID": "ORDLINE"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderLine/Update",
                                "FilterID": "ORDLINE"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderLine/Delete",
                                "FilterID": "ORDLINE"
                            }
                        },
                        "Meta": {
                            "MstPackType": helperService.metaBase()
                        },
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "Consol Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "PartNo",
                                "displayName": "Part #",
                                "width": 50
                            }, {
                                "field": "InnerPacks",
                                "displayName": "Inner Packs",
                                "width": 75
                            }, {
                                "field": "OuterPacks",
                                "displayName": "Outer Packs",
                                "width": 75
                            }, {
                                "field": "Quantity",
                                "displayName": "Quantity",
                                "width": 75
                            }, {
                                "field": "InvoicedQuantity",
                                "displayName": "Invoiced Quantity",
                                "width": 75
                            }, {
                                "field": "RecievedQuantity",
                                "displayName": "Recieved Quantity",
                                "width": 75
                            }, {
                                "field": "QtyRemaining",
                                "displayName": "Qty Remaining",
                                "width": 75
                            }]
                        }
                        // "Grid": {
                        //     "ColumnDef": [{
                        //         "field": "PartNo",
                        //         "displayName": "PartNo",
                        //     }, {
                        //         "field": "LineNo",
                        //         "displayName": "Line No",
                        //     }, {
                        //         "field": "LineDescription",
                        //         "displayName": "LineDescription",
                        //     }, {
                        //         "field": "InnerPacks",
                        //         "displayName": "InnerPacks",
                        //     }, {
                        //         "field": "OuterPacks",
                        //         "displayName": "OuterPacks",
                        //     }, {
                        //         "field": "Quantity",
                        //         "displayName": "Quantity",
                        //     }, {
                        //         "field": "InvoicedQuantity",
                        //         "displayName": "Invoiced Quantity",
                        //     }, {
                        //         "field": "RecievedQuantity",
                        //         "displayName": "Recieved Quantity",
                        //     }, {
                        //         "field": "PackType",
                        //         "displayName": "Pack Type",
                        //     }, {
                        //         "field": "ItemPrice",
                        //         "displayName": "Item Price",
                        //     }, {
                        //         "field": "LinePrice",
                        //         "displayName": "Line Price",
                        //     }, {
                        //         "field": "CommercialInvoiceNo",
                        //         "displayName": "Commercial InvoiceNo",
                        //     }, {
                        //         "field": "OriginCountry",
                        //         "displayName": "Origin Country",
                        //     }],
                        //     "GridConfig": {
                        //         "_gridHeight": 230,
                        //         "_enableRowSelection": true,
                        //         "_enableRowHeaderSelection": true,
                        //         "_multiSelect": false,
                        //         "_exporterCsvFilename": "data",
                        //         '_exporterPdfFilename': "data",
                        //         "_enablePaginationControls": false,
                        //         "_enableGridMenu": false,
                        //         "_enableColumnMenus": false,
                        //         "_enableCellSelection": false,
                        //         "_enableCellEdit": false,
                        //         "_enableSorting": true,
                        //         "_useExternalSorting": false,
                        //         "_useExternalPagination": false,
                        //         "_isAPI": false,
                        //         "_rowTemplate": "",
                        //         "_columnPrefix": "POL_",
                        //         "_sortColumn": "LineNo",
                        //         "_sortType": "ASC",
                        //         "_pageNumber": 1,
                        //         "_paginationPageSize": 25,
                        //         "_paginationPageSizes": [25, 50, 100]
                        //     }
                        // }
                    },
                    "Container": {
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstContainer/FindAll"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderContainer/Delete/"
                            }
                        },
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": true,
                            "isDelete": true,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "ContainerNumber",
                                "displayName": "Container #",
                                "width": 100
                            }, {
                                "field": "ContainerCount",
                                "displayName": "Count",
                                "width": 100
                            }, {
                                "field": "RC_Type",
                                "displayName": "Type",
                                "width": 100
                            }, {
                                "field": "SealNum",
                                "displayName": "Seal #",
                                "width": 100
                            }]
                        }

                    },
                    "TrackOrderContainer": {
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderContainer/FindAll",
                                "FilterID" : "ORDCONT"
                            }
                        },
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "User Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "ContainerNumber",
                                "displayName": "Container #",
                                "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",
                                "width": 100
                            }, {
                                "field": "RC_Type",
                                "displayName": "Type",
                                "width": 100
                            }, {
                                "field": "SealNum",
                                "displayName": "Seal 1",
                                "width": 100
                            }, {
                                "field": "Seal2",
                                "displayName": "Seal 2",
                                "width": 100
                            }]
                        }

                    },
                    "TrackOrderShipment": {
                        "API": {
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "ShipmentHeader/GetById/",
                                "FilterID" : "SHIPHEAD"
                            }
                        }
                    },
                    "TrackPorOrderLine": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrderList/GetById/",
                                "FilterID": "ORDHEAD"
                            }
                        },
                        "Meta": {
                            "MstPackType": helperService.metaBase()
                        },
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "Consol Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                "field": "LineNo",
                                "displayName": "Line #",
                                "width": 50
                            }, {
                                "field": "PartNo",
                                "displayName": "Part #",
                                "width": 50
                            },{
                                "field": "PartDesc",
                                "displayName": "Part Desc.",
                                "width": 150
                            }, {
                                "field": "PartAttribute1",
                                "displayName": "PartAttr1",
                                "width": 75
                            }, {
                                "field": "PartAttribute2",
                                "displayName": "PartAttr2",
                                "width": 75
                            }, {
                                "field": "PartAttribute3",
                                "displayName": "Part Attr3",
                                "width": 75
                            }, {
                                "field": "OrderedQuantity",
                                "displayName": "Ordered Qty",
                                "width": 75
                            }, {
                                "field": "BookedQuantity",
                                "displayName": "Booked Qty",
                                "width": 75
                            }, {
                                "field": "ShippedQuantity",
                                "displayName": "Shipped Qty",
                                "width": 75
                            }, {
                                "field": "RecievedQuantity",
                                "displayName": "Qty Recieved",
                                "width": 75
                            }, {
                                "field": "RemainingQuantity",
                                "displayName": "Qty Remaining",
                                "width": 75
                            }, {
                                "field": "ShipmentNo",
                                "displayName": "Shipment #",
                                "width": 75
                            }, {
                                "field": "ContainerNumber",
                                "displayName": "Container #",
                                "width": 75
                            }]
                        }
                    },
                    "Consol": {
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ConsolHeader/FindAll"
                            }
                        },
                        "gridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "Consol Details",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "columnDef": [{
                                    "field": "ConsolNo",
                                    "displayName": "Consol #",
                                    "width": 75
                                }, {
                                    "field": "TransportMode",
                                    "displayName": "T.Mode",
                                    "width": 50
                                }, {
                                    "field": "FirstLoadPort",
                                    "displayName": "POL",
                                    "width": 50
                                }, {
                                    "field": "ETD",
                                    "displayName": "ETD",
                                    "width": 75
                                }, {
                                    "field": "LastDischargePort",
                                    "displayName": "POD",
                                    "width": 50
                                }, {
                                    "field": "ETA",
                                    "displayName": "ETA",
                                    "width": 75
                                }, {
                                    "field": "MasterBillNo",
                                    "displayName": "MasterBill",
                                    "width": 75
                                }, {
                                    "field": "Voyage",
                                    "displayName": "Voyage",
                                    "width": 75
                                }, {
                                    "field": "Carrier",
                                    "displayName": "Carrier",
                                    "width": 75
                                }, {
                                    "field": "SendingAgent",
                                    "displayName": "SendingAgent",
                                    "width": 75
                                }, {
                                    "field": "Payment",
                                    "displayName": "Payment",
                                    "width": 50
                                }

                            ]
                        }

                    },

                    "ConShpMapping": {
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ConShpMapping/FindAll",
                                "FilterID": "CONSHPMAP"
                            }
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentOrder.data;
                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentOrder.entity.OrderCumSplitNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Shipment details and set to configuration list
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentOrder.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentOrder.OrderCumSplitNo]: {
                            ePage: _exports
                        },
                        label: currentOrder.OrderCumSplitNo,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;

        }
    }
})();