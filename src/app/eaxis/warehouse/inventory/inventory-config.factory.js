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
            "GetTabDetails": GetTabDetails,
            "IsCloseTab":false

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
                            },
                            "PickSlip": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickLine/FindAll",
                                "FilterID": "WMSPICKL"
                            },
                            "WmsInventoryAdjustment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventoryAdjustment/Insert",
                            },
                        },
                        "Meta": {
                        
                        },
                        "CheckPoints": {
                            "DataEntryName": DataEntryName,
                        },
                        "TableProperties":{
                            "PickSlipDetails":{
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":300
                                },
                                "HeaderProperties":[{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"psno",
                                    "position":"1",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Pick No",
                                    "isenabled":true,
                                    "property":"ppickno",
                                    "position":"2",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Client",
                                    "isenabled":true,
                                    "property":"pclient",
                                    "position":"3",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Code",
                                    "isenabled":true,
                                    "property":"pproductcode",
                                    "position":"4",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Description",
                                    "isenabled":true,
                                    "property":"pproductdescription",
                                    "position":"5",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Packs",
                                    "isenabled":true,
                                    "property":"ppacks",
                                    "position":"6",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Packs UQ",
                                    "isenabled":true,
                                    "property":"ppacksuq",
                                    "position":"7",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Qty",
                                    "isenabled":true,
                                    "property":"pqty",
                                    "position":"8",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Qty UQ",
                                    "isenabled":true,
                                    "property":"pqtyuq",
                                    "position":"9",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Location",
                                    "isenabled":true,
                                    "property":"plocation",
                                    "position":"10",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 1",
                                    "isenabled":true,
                                    "property":"pudf1",
                                    "position":"11",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 2",
                                    "isenabled":true,
                                    "property":"pudf2",
                                    "position":"12",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 3",
                                    "isenabled":true,
                                    "property":"pudf3",
                                    "position":"13",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Packing Date",
                                    "isenabled":true,
                                    "property":"ppackingdate",
                                    "position":"14",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Expiry Date",
                                    "isenabled":true,
                                    "property":"pexpirydate",
                                    "position":"15",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Picked Date Time",
                                    "isenabled":true,
                                    "property":"ppickeddatetime",
                                    "position":"16",
                                    "width":"120",
                                    "display":true
                                }],
                                "psno":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"40"
                                },
                                "ppickno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"100"
                                },
                                "pclient":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"150"
                                },
                                "pproductcode":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"100"
                                },
                                "pproductdescription":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"100"
                                },
                                "ppacks":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"160"
                                },
                                "ppacksuq":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"60"
                                },
                                "pqty":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"60"
                                },
                                "pqtyuq":{
                                    "isenabled":true,
                                    "position":"9",
                                    "width":"60"
                                },
                                "plocation":{
                                    "isenabled":true,
                                    "position":"10",
                                    "width":"100"
                                },
                                "pudf1":{
                                    "isenabled":true,
                                    "position":"11",
                                    "width":"120"
                                },
                                "pudf2":{
                                    "isenabled":true,
                                    "position":"12",
                                    "width":"120"
                                },
                                "pudf3":{
                                    "isenabled":true,
                                    "position":"13",
                                    "width":"120"
                                },
                                "ppackingdate":{
                                    "isenabled":true,
                                    "position":"14",
                                    "width":"120"
                                },
                                "pexpirydate":{
                                    "isenabled":true,
                                    "position":"15",
                                    "width":"120"
                                },
                                "ppickeddatetime":{
                                    "isenabled":true,
                                    "position":"16",
                                    "width":"120"
                                },
                            },
                            "General":{
                                "TableHeight":{
                                    "isEnabled":true,
                                    "height":300
                                },
                                "HeaderProperties":[{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"gsno",
                                    "position":"1",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Receipt Reference",
                                    "isenabled":true,
                                    "property":"greceiptreference",
                                    "position":"2",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Client",
                                    "isenabled":true,
                                    "property":"gclient",
                                    "position":"3",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Warehouse",
                                    "isenabled":true,
                                    "property":"gwarehouse",
                                    "position":"4",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Code",
                                    "isenabled":true,
                                    "property":"gproductcode",
                                    "position":"5",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Description",
                                    "isenabled":true,
                                    "property":"gproductdescription",
                                    "position":"6",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Location",
                                    "isenabled":true,
                                    "property":"glocation",
                                    "position":"7",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Inventory Status",
                                    "isenabled":true,
                                    "property":"ginventorystatus",
                                    "position":"8",
                                    "width":"80",
                                    "display":true
                                },
                                {
                                    "columnname":"Total Qty",
                                    "isenabled":true,
                                    "property":"gtotalqty",
                                    "position":"9",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"In Location Qty",
                                    "isenabled":true,
                                    "property":"ginlocationqty",
                                    "position":"10",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Commited Qty",
                                    "isenabled":true,
                                    "property":"gcommitedqty",
                                    "position":"11",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"In Transit Qty",
                                    "isenabled":true,
                                    "property":"gintransitqty",
                                    "position":"12",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Reserved Qty",
                                    "isenabled":true,
                                    "property":"greservedqty",
                                    "position":"13",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Available To Pick",
                                    "isenabled":true,
                                    "property":"gavailabletopick",
                                    "position":"14",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Arrival Date",
                                    "isenabled":true,
                                    "property":"garrivaldate",
                                    "position":"15",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Pallet ID",
                                    "isenabled":true,
                                    "property":"gpalletid",
                                    "position":"16",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Area Name",
                                    "isenabled":true,
                                    "property":"gareaname",
                                    "position":"17",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 1",
                                    "isenabled":true,
                                    "property":"gudf1",
                                    "position":"18",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 2",
                                    "isenabled":true,
                                    "property":"gudf2",
                                    "position":"19",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 3",
                                    "isenabled":true,
                                    "property":"gudf3",
                                    "position":"20",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Packing Date",
                                    "isenabled":true,
                                    "property":"gpackingdate",
                                    "position":"21",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Expiry Date",
                                    "isenabled":true,
                                    "property":"gexpirydate",
                                    "position":"22",
                                    "width":"100",
                                    "display":true
                                }],
                                "gsno":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"40"
                                },
                                "greceiptreference":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"100"
                                },
                                "gclient":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"150"
                                },
                                "gwarehouse":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"150"
                                },
                                "gproductcode":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"100"
                                },
                                "gproductdescription":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"100"
                                },
                                "glocation":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"100"
                                },
                                "ginventorystatus":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"80"
                                },
                                "gtotalqty":{
                                    "isenabled":true,
                                    "position":"9",
                                    "width":"60"
                                },
                                "ginlocationqty":{
                                    "isenabled":true,
                                    "position":"10",
                                    "width":"60"
                                },
                                "gcommitedqty":{
                                    "isenabled":true,
                                    "position":"11",
                                    "width":"60"
                                },
                                "gintransitqty":{
                                    "isenabled":true,
                                    "position":"12",
                                    "width":"60"
                                },
                                "greservedqty":{
                                    "isenabled":true,
                                    "position":"13",
                                    "width":"60"
                                },
                                "gavailabletopick":{
                                    "isenabled":true,
                                    "position":"14",
                                    "width":"60"
                                },
                                "garrivaldate":{
                                    "isenabled":true,
                                    "position":"15",
                                    "width":"100"
                                },
                                "gpalletid":{
                                    "isenabled":true,
                                    "position":"16",
                                    "width":"100"
                                },
                                "gareaname":{
                                    "isenabled":true,
                                    "position":"17",
                                    "width":"100"
                                },
                                "gudf1":{
                                    "isenabled":true,
                                    "position":"18",
                                    "width":"100"
                                },
                                "gudf2":{
                                    "isenabled":true,
                                    "position":"19",
                                    "width":"100"
                                },
                                "gudf3":{
                                    "isenabled":true,
                                    "position":"20",
                                    "width":"100"
                                },
                                "gpackingdate":{
                                    "isenabled":true,
                                    "position":"21",
                                    "width":"100"
                                },
                                "gexpirydate":{
                                    "isenabled":true,
                                    "position":"22",
                                    "width":"100"
                                },
                            },
                        }
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