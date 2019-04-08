(function(){
    "use strict";

    angular.module("Application")
    .factory("chargeCodeConfig", ChargeCodeConfig);

    ChargeCodeConfig.$inject=[];

    function ChargeCodeConfig(){
        var exports={
            "Entities": {
                "Header":{
                    "Data":{},
                    "Meta": {}
                }
            },
            "DataentryName": "AccChargeCode",
            "DataentryTitle": "Charge Code"
        };
        return exports;
    }
})();