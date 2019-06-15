(function () {
    "use strict";
    angular
        .module("Application")
        .factory("warehouseConfig", WarehouseConfig);

    WarehouseConfig.$inject = [];

    function WarehouseConfig() {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "FindAllCommonDashboard": {
                            "IsAPI": true,
                            "Url": "WmsCommonDashboard/FindAll",
                        },
                        "WmsBarcode": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsBarcode/GenerateBarcode"
                        },
                    },
                    "Meta": {},
                },
                "WmsWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID": "WMSWARH"
                        }
                    }
                },
                "WmsTestID": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TestID/FindAll",
                            "FilterID": "APPCOUNT"
                        }
                    }
                },
                "WmsInventoryAdjustment": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInventoryAdjustment/Insert",
                        },
                    }
                },
                "WmsInward": {
                    "RowIndex": -1,
                    "API": {
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/FindAll",
                            "FilterID": "WMSINW"
                        }
                    }
                },
                "WmsInwardList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/GetById/",
                        },
                        "UpdateInwardProcess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/ProcessUpdate"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/Insert"
                        }
                    }
                },
                "WmsOutward": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/FindAll",
                            "FilterID": "WMSOUT",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/Insert"
                        },
                    }
                },
                "WmsOutwardList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsOutwardList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardList/Insert"
                        },
                    }
                },
                "WmsDelivery": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDelivery/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDelivery/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDelivery/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDelivery/FindAll",
                            "FilterID": "WMSDEL"
                        }
                    }
                },
                "WmsDeliveryList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDeliveryList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDeliveryList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDeliveryList/Insert"
                        }
                    }
                },
                "WmsClientParameterByWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientParameterByWarehouse/FindAll",
                            "FilterID": "WMSWCP",
                        },
                    }
                },
                "WmsPickLineSummary": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickLineSummary/FindAll",
                            "FilterID": "WMSPLS",
                        },
                    }
                },
                "WmsPickList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickList/Update"
                        },
                        "AllocateStock": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickList/WmsAllocateStock",
                        },
                    }
                },
                "WmsPick": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPick/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPick/Update"
                        }
                    }
                },
                "ComponentRole": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ComponentRole/FindAll",
                            "FilterID": "SECMAPP"
                        }
                    }
                },
                "UserOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        }
                    }
                },
                "WmsPickup": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickup/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickup/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickup/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickup/FindAll",
                            "FilterID": "WMSPICR"
                        }
                    }
                },
                "WmsPickupList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickupList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickupList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickupList/Insert"
                        }
                    }
                },
                "WmsInventory": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInventory/FindAll",
                            "FilterID": "WMSINV",
                        },
                    }
                },
                "WmsDeliveryReport": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDeliveryReport/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDeliveryReport/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDeliveryReport/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDeliveryReport/FindAll",
                            "FilterID": "WMSWDR"
                        }
                    }
                },
                "WmsPickupReport": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickupReport/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickupReport/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickupReport/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickupReport/FindAll",
                            "FilterID": "WMSWPR"
                        }
                    }
                },
                "OrgHeaderWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeaderWarehouse/FindAll",
                            "FilterID": "TMSORGWAREH",
                        },
                    }
                },
                "WmsWorkOrder": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWorkOrder/FindAll",
                            "FilterID": "WMSWORK"
                        },
                    }
                },
                "WmsWorkOrderLine": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWorkOrderLine/FindAll",
                            "FilterID": "WMSINL"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsWorkOrderLine/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWorkOrderLine/Update"
                        }
                    }
                },
                "TmsManifestList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsManifestList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Update"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifest/FindAll",
                            "FilterID": "TMSMAN",
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Insert"
                        },
                    }
                },
                "WmsSettings": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsSettings/FindAll",
                            "FilterID": "WMSSET"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsSettings/Delete/"
                        }
                    }
                },
                "WmsDockConfig": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDockConfig/FindAll",
                            "FilterID": "WMSDCK"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDockConfig/Delete/"
                        }
                    }
                },
                "TMSGatepass": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TMSGatepass/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TMSGatepass/FindAll",
                            "FilterID": "TMSGATP"
                        },
                    }
                },
                "TMSGatepassList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TMSGatepassList/GetById/"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TMSGatepassList/Update"
                        }
                    }
                },
                "Message": false
            },
        }
        return exports;
    }
})();
