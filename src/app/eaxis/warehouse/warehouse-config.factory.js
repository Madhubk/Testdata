(function(){
"use strict";
angular
.module("Application")
.factory("warehouseConfig",WarehouseConfig);
WarehouseConfig.$inject=["$location", "$q", "apiService", "helperService", "toastr", "appConfig"];
function WarehouseConfig($location,$q,apiService,helperService,toastr,appConfig){
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
                "Meta": { },  
                },
                "Message": false
            },
    }
    return exports;
}
})();
