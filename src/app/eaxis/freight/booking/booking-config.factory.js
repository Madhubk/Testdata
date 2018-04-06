(function () {
    "use strict";

    angular
        .module("Application")
        .factory('BookingConfig', BookingConfig);

    BookingConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr"];

    function BookingConfig($rootScope, $location, $q, apiService, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/GetById/",
                            "FilterID": "SHIPHEAD"
                        },
                        "ShipmentActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/ShipmentActivityClose/"
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentBooking, isNew) {
            // Set configuration object to individual Booking
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertShipment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ShipmentList/Insert"
                            },
                            "UpdateShipment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ShipmentList/Update"
                            },
                            "OrderAttach": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderHeader/UpdateRecords"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa-plane"
                            }, {
                                "DisplayName": "Orders",
                                "Value": "Order",
                                "Icon": "fa-cart-plus"
                            }, {
                                "DisplayName": "Service & Reference",
                                "Value": "ServiceAndReference",
                                "Icon": "fa-wrench"
                            }, {
                                "DisplayName": "Pickup & Delivery",
                                "Value": "PickupAndDelivery",
                                "Icon": "fa-train"
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa-address-card-o"
                            }],
                            "AddressContactObject": {}
                        }
                    },
                    "BookingOrder": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderItem/FindAll",
                                "FilterID": "ORDITEM"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderItem/Upsert",
                            }
                        }
                    },
                    "JobSailing": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SailingDetails/FindAll",
                                "FilterID": "JOBSAIL"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobSailing/Upsert",
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobVoyage/Update",
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobVoyage/Insert",
                            },
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
                                "field": "SailingNo",
                                "displayName": "Reference #"
                            }, {
                                "field": "JVO_POL",
                                "displayName": "Load"
                            }, {
                                "field": "JVD_POD",
                                "displayName": "Discharge"
                            }, {
                                "field": "IsPublished",
                                "displayName": "Pub."
                            }, {
                                "field": "SendersMsgRef",
                                "displayName": "Booking Ref"
                            }, {
                                "field": "LCLReceivalCommences",
                                "displayName": "LCL Rec.Start",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>"
                            }, {
                                "field": "LCLCutOff",
                                "displayName": "LCL Cut Off",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>"
                            }, {
                                "field": "LCLAvailabilityDate",
                                "displayName": "Depot Avail.",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>"
                            }, {
                                "field": "LCLStorageDate",
                                "displayName": "Depot Store.",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }]
                        }
                    },
                    "Service": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
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
                                "field": "ServiceCode",
                                "displayName": "Service Code",
                            }, {
                                "field": "Booked",
                                "displayName": "Booked",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }, {
                                "field": "Duration",
                                "displayName": "Duration",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | duration}}</div>",
                            }, {
                                "field": "ServiceCount",
                                "displayName": "Service Count",
                            }, {
                                "field": "Completed",
                                "displayName": "Completed",
                                "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            }]
                        }
                    },
                    "Package": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
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
                                "field": "PackageCount",
                                "displayName": "Pack Cnt",
                            }, {
                                "field": "F3_NKPackType",
                                "displayName": "Pack Type",
                            }, {
                                "field": "Length",
                                "displayName": "Length",
                            }, {
                                "field": "Width",
                                "displayName": "Width",
                            }, {
                                "field": "Height",
                                "displayName": "Height",
                            }, {
                                "field": "UnitOfDimension",
                                "displayName": "UD",
                            }, {
                                "field": "ActualWeight",
                                "displayName": "Weight",
                            }, {
                                "field": "ActualWeightUQ",
                                "displayName": "UW",
                            }, {
                                "field": "ActualVolume",
                                "displayName": "Volume",
                            }, {
                                "field": "ActualVolumeUQ",
                                "displayName": "UV",
                            }, {
                                "field": "RH_NKCommodityCode",
                                "displayName": "Commodity",
                            }]
                        }
                    },
                    "Container": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/FindAll",
                                "FilterID": "CONTHEAD"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CntContainer/Delete/"
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
                                "field": "ContainerNo",
                                "displayName": "Container #"
                            }, {
                                "field": "ContainerCount",
                                "displayName": "Count"
                            }, {
                                "field": "RC_Type",
                                "displayName": "Type"
                            }, {
                                "field": "RH_NKContainerCommodityCode",
                                "displayName": "Commodity"
                            }, {
                                "field": "ReleaseNum",
                                "displayName": "Release"
                            }, {
                                "field": "OAD_DepartureContainerYardCode",
                                "displayName": "Dep.Container Yard"
                            }, {
                                "field": "OAD_ArrivalContainerYardCode",
                                "displayName": "Arr.Container Yard"
                            }]
                        }

                    },
                    "Reference": {
                        "Data": {},
                        "ListSource": [],
                        "RowIndex": -1,
                        "Meta": {},
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
                                "field": "EntryNum",
                                "displayName": "Number"
                            }, {
                                "field": "EntryType",
                                "displayName": "Number Type"
                            }]
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentBooking.data;

                var obj = {
                    [currentBooking.entity.ShipmentNo]: {
                        ePage: _exports
                    },
                    label: currentBooking.entity.ShipmentNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Booking details and set to configuration list
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentBooking.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentBooking.ShipmentNo]: {
                            ePage: _exports
                        },
                        label: currentBooking.ShipmentNo,
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