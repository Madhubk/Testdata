(function () {
    "use strict";
	
    angular
        .module("Application")
        .factory("myTaskConfig", MyTaskConfig);

    MyTaskConfig.$Inject = ["$location", "helperService"];

    function MyTaskConfig($location, helperService) {
        var app = $location.path().split("/")[1];

        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "API": {}
                }
            }
        }
		
        return exports;
    }
})();