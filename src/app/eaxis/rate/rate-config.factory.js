(function(){
"use strict";
angular
.module("Application")
.factory("rateConfig",RateConfig);
RateConfig.$inject=["$location", "$q", "apiService", "helperService", "toastr", "appConfig"];
function RateConfig($location,$q,apiService,helperService,toastr,appConfig){
    var exports = {
        "Entities": {
            "Header": {
                "Data": {},
                "RowIndex": -1,
                "API": {},
                "Meta": {},  
                },
                "Message": false
            },
    }
    return exports;
}
})();
