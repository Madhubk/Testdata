(function () {
    "use strict";

    angular
        .module("Application")
        .factory("manifestTransConfig", ManifestTransConfig);

    ManifestTransConfig.$inject = ["$location", "$q", "helperService", "apiService", "appConfig"];

    function ManifestTransConfig($location, $q, helperService, apiService, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsManifestList/GetById/"
                        },
                        "OrgHeader": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeader/FindAll",
                            "FilterID": "ORGHEAD"
                        },
                    },
                    "Meta": {

                    }
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
        };
        return exports;

        function GetTabDetails(currentManifestTrans, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertManifest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsManifestList/Insert"
                            },
                            "UpdateManifest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsManifestList/Update"
                            },
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "OrgAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID": "ORGADDR"
                            },
                            "GetOrderList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrder/FindAll",
                                "FilterID": "WMSWORK"
                            },
                            "GetOrderLineList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderLine/FindAll",
                                "FilterID": "WMSINL"
                            },
                            "OrgHeader": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeader/FindAll",
                                "FilterID": "ORGHEAD"
                            },
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "CreateManifest",
                                "Icon": "fa fa-truck",
                            }, {
                                "DisplayName": "Orders",
                                "Value": "Orders",
                                "Icon": "fa fa-plane",
                            }, {
                                "DisplayName": "Manifest Items",
                                "Value": "ManifestItems",
                                "Icon": "fa fa-plane",
                            }, {
                                "DisplayName": "GatePass List",
                                "Value": "GatePassList",
                                "Icon": "fa fa-plane",
                            }, {
                                "DisplayName": "Routing",
                                "Value": "Routing",
                                "Icon": "fa fa-truck",
                            }, {
                                "DisplayName": "Tracking",
                                "Value": "Tracking",
                                "Icon": "fa fa-truck",
                            }],
                            "Language": helperService.metaBase(),
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "DisableAllocate": false,
                            "IsConsignmentAttach": false,
                            "WarehouseClient": "",
                            "IsWarehouseClient": false,
                            "IsPickupDeliveryList": false,
                            "IsToggleFilter": false,
                            "isShowFooter": false,
                        },
                    },
                }
            }
            if (isNew) {
                _exports.Entities.Header.Data = currentManifestTrans.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentManifestTrans.entity.ManifestNumber,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentManifestTrans.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentManifestTrans.ManifestNumber]: {
                            ePage: _exports
                        },
                        label: currentManifestTrans.ManifestNumber,
                        code: currentManifestTrans.ManifestNumber,
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