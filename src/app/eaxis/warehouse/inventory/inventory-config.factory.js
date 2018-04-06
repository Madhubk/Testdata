(function () {
    "use strict";

    angular
        .module("Application")
        .factory("inventoryConfig", InventoryConfig);

    InventoryConfig.$inject = ["$location", "$q", "helperService", "apiService"];

    function InventoryConfig($location, $q, helperService, apiService) {
        //var appName = $location.path().split("/")[1];
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "DataEntry": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInventoryList/GetById/",
                        },
                        "InventoryDetails": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInventory/FindAll",
                            "FilterID": "WMSINV"
                        },
                    },
                    "Meta": {

                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails

        };
        return exports;

        function GetTabDetails(currentInventory, isNew, DataEntryName) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertInventory": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventoryList/Insert"
                            },
                            "UpdateInventory": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventoryList/Update"
                            }
                        },
                        "Meta": {
                        
                        },
                        "CheckPoints": {
                            "DataEntryName": DataEntryName,
                        },
                    },
                }
            }

            if (isNew) {
                _exports.Entities.Header.Data = currentInventory.data;

                var obj = {
                    [currentInventory.entity.PK]: {
                        ePage: _exports
                    },
                    label: currentInventory.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                if(DataEntryName == "InventoryByProduct"){
                    var _filter = {
                        "WAR_FK": currentInventory.WAR_FK,
                        "ORG_FK": currentInventory.ORG_FK,
                        "PRO_FK": currentInventory.PRO_FK
                    };
                }else if(DataEntryName == "InventoryByAttribute"){
                    var _filter = {
                        "WAR_FK": currentInventory.WAR_FK,
                        "ORG_FK": currentInventory.ORG_FK,
                        "PRO_FK": currentInventory.PRO_FK,
                        "PartAttrib1": currentInventory.PartAttrib1,
                        "PartAttrib2": currentInventory.PartAttrib2,
                        "PartAttrib3": currentInventory.PartAttrib3,
                        "PackingDate": currentInventory.PackingDate,
                        "ExpiryDate": currentInventory.ExpiryDate
                    };
                }else if(DataEntryName == "InventoryByLocation"){
                    var _filter = {
                        "WAR_FK": currentInventory.WAR_FK,
                        "ORG_FK": currentInventory.ORG_FK,
                        "PRO_FK": currentInventory.PRO_FK,
                        "WLO_FK": currentInventory.WLO_FK,
                    };
                }else if(DataEntryName == "WarehouseInventory"){
                    var _filter = {
                        "PK": currentInventory.PK
                    }
                }
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": exports.Entities.Header.API.InventoryDetails.FilterID
                };

                apiService.post("eAxisAPI", exports.Entities.Header.API.InventoryDetails.Url, _input).then(function (response) {
                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentInventory.PK]: {
                            ePage: _exports
                        },
                        label: currentInventory.PK,
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