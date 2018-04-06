(function(){
    "use strict";

    angular
         .module("Application")
         .factory("pickupanddeliveryConfig",PickupanddeliveryConfig);
    
    PickupanddeliveryConfig.$inject = ["$location", "$q", "helperService", "apiService"];

    function PickupanddeliveryConfig($location, $q, helperService, apiService){
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
                            "Url": "WmsPickupanddeliveryPointsList/GetById/",
                            "FilterID": "WMSTRANP"
                        },
                        "TransGetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsTransportList/GetById/",
                            "FilterID": "WMSTRANP"
                        }
                    },
                    "Meta": {

                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails

        };
        return exports;

        function GetTabDetails(currentPickupanddelivery, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                             "Pickupanddelivery": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickupAndDeliveryPointsList/FindAll",
                                "FilterID": "WMSTRAN"
                            },
                            "InsertPickupanddelivery": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickupAndDeliveryPointsList/Insert"
                            },
                             "UpdatePickupanddelivery": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickupAndDeliveryPointsList/Update"
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
                                "DisplayName": "POD Details",
                                "Value": "Pickupanddelivery",
                                "Icon": "fa-truck"
                            },  
                            ],
                            "Language": helperService.metaBase(),
                            
                        }
                    },
                }
            }
                if (isNew) {
                     _exports.Entities.Header.Data = currentPickupanddelivery.data;
                
                var obj = {
                    [currentPickupanddelivery.data.UIWmsPickupAndDeliveryPointsHeader.ReferenceNo]: {
                        ePage: _exports
                    },
                    label: currentPickupanddelivery.data.UIWmsPickupAndDeliveryPointsHeader.ReferenceNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentPickupanddelivery.PK).then(function(response) {
                  _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentPickupanddelivery.ReferenceNo]: {
                            ePage: _exports
                        },
                        label: currentPickupanddelivery.ReferenceNo,
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