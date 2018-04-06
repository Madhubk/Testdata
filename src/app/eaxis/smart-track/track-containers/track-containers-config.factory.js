(function () {
    "use strict";

    angular
        .module("Application")
        .factory('trackContainerConfig', TrackContainerConfig);

    TrackContainerConfig.$inject = ["$q", "helperService", "toastr"];

    function TrackContainerConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CntContainerList/GetById/",
                            "FilterID" : "CONTHEAD"
                        },
                        "ContainerActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CntContainer/ContainerActivityClose/"
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentContainer, isNew) {
            // Set configuration object to individual container
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {},
                        "Meta" : {}
                    },
                    "ShipmentHeader": {
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
                                "field": "ShipmentNo",
                                "displayName": "Shipment #",
                                "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",
                            }, {
                                "field": "HouseBill",
                                "displayName": "HBL"
                            }, {
                                "field": "ORG_Shipper_Code",
                                "displayName": "Shipper"
                            }, {
                                "field": "ORG_Consignee_Code",
                                "displayName": "Consignee"
                            }, {
                                "field": "Origin",
                                "displayName": "Origin"
                            }, {
                                "field": "Destination",
                                "displayName": "Destination"
                            }, {
                                "field": "OuterPackType",
                                "displayName": "PackType"
                            }, {
                                "field": "OuterPackCount",
                                "displayName": "PackCount"
                            }, {
                                "field": "Weight",
                                "displayName": "Weight"
                            }, {
                                "field": "Volume",
                                "displayName": "Volume"
                            }, {
                                "field": "IncoTerm",
                                "displayName": "Term"
                            }]
                        }
                    },
                    "OrderHeader": {
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
                                "field": "OrderNo",
                                "displayName": "Order #",
                                "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",
                            }, {
                                "field": "Buyer",
                                "displayName": "Buyer"
                            }, {
                                "field": "GoodsDescription",
                                "displayName": "Description"
                            }, {
                                "field": "UnitOfVolume",
                                "displayName": "Volume"
                            }, {
                                "field": "UnitofWeight",
                                "displayName": "Weight"
                            }, {
                                "field": "RequiredExWorksDate",
                                "displayName": "Req.ExWorks"
                            }, {
                                "field": "OrderDate",
                                "displayName": "Order Date",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }]
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentContainer.data;

                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentContainer.entity.ContainerNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Shipment details and set to configuration list
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentContainer.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentContainer.ContainerNo]: {
                            ePage: _exports
                        },
                        label: currentContainer.ContainerNo,
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
