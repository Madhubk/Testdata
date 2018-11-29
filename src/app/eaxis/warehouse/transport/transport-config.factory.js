(function(){
    "use strict";

    angular
         .module("Application")
         .factory("transportConfig",TransportConfig);
    
    TransportConfig.$inject = ["$location", "$q", "helperService", "apiService"];

    function TransportConfig($location, $q, helperService, apiService){
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
                            "Url": "WmsTransportList/GetById/",
                            "FilterID": "WMSTRANP"
                        },
                        "TPDGetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickupanddeliveryPointsList/GetById/",
                            "FilterID": "WMSTRANP"
                        },
                        "WmsInwardInsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/Insert",
                        },
                        "WmsOutwardInsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardList/Insert",
                        }
                    },
                    "Meta": {

                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "SaveAndClose":false,
            "GetTabDetails": GetTabDetails,

        };
        return exports;

        function GetTabDetails(currentTransport, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                             "Transport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsTransport/FindAll",
                                "FilterID": "WMSTRAN"
                            },
                            "InsertTrans": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsTransportList/Insert"
                            },
                             "UpdateTrans": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsTransportList/Update"
                            },
                            "WODFindall":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsOutward/FindAll",  
                                "FilterID": "WMSOUT"
                            },
                            "PDOFindall":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickupAndDeliveryOrders/FindAll",  
                                "FilterID": "WMSPICDO"
                            }
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa-plane"
                            },{
                                "DisplayName": "Pickup and Delivery",
                                "Value": "Pickupanddelivery",
                                "Icon": "fa-truck"
                            },  {
                                "DisplayName": "Orders",
                                "Value": "Orders",
                                "Icon": "fa-th-list"
                            }, {
                                "DisplayName": "Vehicle Movement",
                                "Value": "Vehiclemovement",
                                "Icon": "fa-pencil-square-o"
                            },
                            ],
                            "Language": helperService.metaBase(),
                            
                        }
                    },
                }
            }
                if (isNew) {
                     _exports.Entities.Header.Data = currentTransport.data;
                
                var obj = {
                    [currentTransport.entity.TransportRefNo]: {
                        ePage: _exports
                    },
                    label: currentTransport.entity.TransportRefNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentTransport.PK).then(function(response) {
                  _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentTransport.TransportRefNo]: {
                            ePage: _exports
                        },
                        label: currentTransport.TransportRefNo,
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