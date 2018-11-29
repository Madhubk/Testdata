(function(){
    "use strict";

    angular.module("Application")
           .filter("setDecimal",SetDecimal);

    angular.module("Application")
            .filter("separator",Separator);


    //Setting Decimal value and rounding off and showing in UI side
    function SetDecimal(){
        return function (input, places) {
            if (isNaN(input)) return input;
            var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
            return Math.round(input * factor) / factor;
        }
    };

    //split and return into array
    function Separator(){
        return function(input) {
            var arr = input.split('|');
            return arr;
        };
    }

})();