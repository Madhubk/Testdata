(function () {
    "use strict";

    angular
        .module("Application")
        .factory("downtimeRequestConfig", DowntimeRequestConfig);

    DowntimeRequestConfig.$inject = ["$location", "$q", "helperService", "apiService", "appConfig"];

    function DowntimeRequestConfig($location, $q, helperService, apiService, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "SerDownTimeRequestList/GetById"
                        },
                        "EmptyGetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "SerDownTimeRequestList/GetById/null"
                        },
                        "TimeZone": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "SerCommon/GetTimeZone"
                        },
                        "InsertDownTimeRequest": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SerDownTimeRequestList/Insert"
                        },
                        "UpdateDownTimeRequest": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SerDownTimeRequestList/Update"
                        }
                    },
                    "Meta": {

                    },
                    "TableProperties":{
                        "SrqArea":{
                            "TableHeight":{
                                "isEnabled":true,
                                "height":200
                            },
                            "HeaderProperties":[{
                                "columnname":"Checkbox",
                                "isenabled":true,
                                "property":"checkbox",
                                "position":'1',
                                "width":"45",
                                "display":false
                            },{
                                "columnname":"S.No",
                                "isenabled":true,
                                "property":"sno",
                                "position":'2',
                                "width":"40",
                                "display":false
                            },
                            {
                                "columnname":"Purpose",
                                "isenabled":true,
                                "property":"purpose",
                                "position":"3",
                                "width":"400",
                                "display":true
                            }],
                            "checkbox":{
                                "isenabled":true,
                                "width":"45",
                                "position":"1"
                            },
                            "sno":{
                                "isenabled":true,
                                "width":"40",
                                "position":"2"
                            },
                            "purpose":{
                                "isenabled":true,
                                "width":"400",
                                "position":"3"
                            },
                        }
                    }
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "GeneralValidation":GeneralValidation
        };
        return exports;

        function GetTabDetails(currentDowntimeRequest, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertDownTimeRequest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SerDownTimeRequestList/Insert"
                            },
                            "UpdateDownTimeRequest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SerDownTimeRequestList/Update"
                            }
                        },
                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "SrqArea":helperService.metaBase(),
                            },
                        }
                    }
                }
            }
            if (isNew) {
                _exports.Entities.Header.Data = currentDowntimeRequest.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentDowntimeRequest.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentDowntimeRequest.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentDowntimeRequest.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentDowntimeRequest.WorkOrderID,
                        code: currentDowntimeRequest.WorkOrderID,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        function GeneralValidation($item){
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data;

            //General Validations
            OnChangeValues(_input.SrqDowntimeRequest.DowntimeRequestCode,'E4001',false,undefined,$item.label);
            OnChangeValues(_input.SrqDowntimeRequest.DowntimeRequestName,'E4002',false,undefined,$item.label);
            OnChangeValues(_input.SrqDowntimeRequest.DowntimeRequestType,'E4003',false,undefined,$item.label);
            OnChangeValues(_input.SrqDowntimeRequest.BRN_Code,'E4004',false,undefined,$item.label);
            OnChangeValues(_input.SrqDowntimeRequest.BRN_BranchName,'E4005',false,undefined,$item.label);
            OnChangeValues(_input.SrqDowntimeRequest.CountryCode,'E4006',false,undefined,$item.label);
            OnChangeValues(_input.SrqDowntimeRequest.Organization,'E4007',false,undefined,$item.label);

            //Areas Validation
            if(_input.SrqArea.length>0){
                angular.forEach(_input.SrqArea,function(value,key){
                    OnChangeValues(value.Name,'E4009',true,key,$item.label);
                    OnChangeValues(value.AreaType,'E4010',true,key,$item.label);
                    OnChangeValues('value','E4011',true,key,$item.label);
                });
            }

            //Check Duplicate
            if(_input.SrqArea.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.SrqArea.length;i++){
                    for(var j=i+1;j<_input.SrqArea.length;j++){
                        if(_input.SrqArea[i].Name && _input.SrqArea[i].AreaType && !finishloop){
                            if(_input.SrqArea[i].Name == _input.SrqArea[j].Name &&_input.SrqArea[i].AreaType == _input.SrqArea[j].AreaType){
                                OnChangeValues(null,'E4011',true,i,$item.label);
                                OnChangeValues(null,'E4011',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }
        }

        function OnChangeValues(fieldvalue,code,IsArray,RowIndex,label) { 
            angular.forEach(exports.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value,IsArray,RowIndex,label);
                }
            });
        }

    }
})();