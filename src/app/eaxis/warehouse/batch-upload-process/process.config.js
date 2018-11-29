(function () {
    "use strict";

    angular
        .module("Application")
        .factory("batchUploadProcessConfig", BatchUploadProcessConfig);

        BatchUploadProcessConfig.$inject = ["$location", "$q", "helperService", "apiService","authService","appConfig"];

    function BatchUploadProcessConfig($location, $q, helperService, apiService,authService,appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API":"",
                    "Meta": {

                    },
                }

            },
            "TabList": [],
            "GetTabDetails":GetTabDetails
        };

        return exports;

        function GetTabDetails(currentProcess, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "WmsBulkUploadLineItems": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "FilterID":"WMSWIL",
                                "Url": "WmsBulkUploadLineItems/FindAll"
                            },
                        }
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentProcess.data;
                
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentProcess.entity.EntityRefCode,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                var _input = {
                    "PK":currentProcess.PK
                };
    
                var inputObj = {
                    "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                    "searchInput": helperService.createToArrayOfObject(_input)
                }
    
                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url  + authService.getUserInfo().AppPK, inputObj).then(function(response){
                    _exports.Entities.Header.Data = response.data.Response[0];
                    var obj = {
                        [currentProcess.EntityRefCode]: {
                            ePage: _exports
                        },
                        label: currentProcess.EntityRefCode,
                        code: currentProcess.EntityRefCode,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                })
               
            }
            return deferred.promise;
        }
    }
})();


