(function () {
    "use strict";
    angular
        .module("Application")
        .factory("toDoConfig", ToDoConfig);

    ToDoConfig.$Inject = ["$location", "helperService"];

    function ToDoConfig($location, helperService) {
        var app = $location.path().split("/")[1];

        var exports = {
            "Entities": {
                "ToDoHeader": {
                    "Data": {},
                    "API": {
                        "MyTask": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ProcessTask/FindAll",
                            "FilterID": "PROCTSK"
                        },
                        "FullTextSearch": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ProcessTask/FullTextSearch",
                            "FilterID": "DATAFUT"
                        }
                    }

                }
            }
        }
        return exports;
    }

})();