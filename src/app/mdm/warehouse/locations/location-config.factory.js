(function () {
    "use strict";

    angular
        .module("Application")
        .factory('locationConfig', LocationConfig);

    LocationConfig.$inject = ["$location", "$q", "apiService", "helperService", "$rootScope","toastr"];

    function LocationConfig($location, $q, apiService, helperService, $rootScope,toastr) {
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
                            "Url": "WmsRowList/GetById/"
                        },
                        "Warehouse": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID": "WMSWARH"
                        },
                        "RowFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsRow/FindAll",
                            "FilterID": "WMSROW"
                        },
                        "WmsLocationWithAllocation": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsLocationWithAllocation/FindAll",
                            "FilterID": "WMSLOWAL"
                        },
                        "Validationapi":{
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID":"VALIDAT"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsRowList/RowHeaderActivityClose/",
                        },
                    },
                    "Meta": {

                    }
                }
            },
            "TabList": [],
            "ValidationValues":"",
            "SaveAndClose":false,
            "GetTabDetails": GetTabDetails,
            "GeneralValidation":GeneralValidation,
            "RemoveApiErrors":RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall":ValidationFindall,
        };
        return exports;

        function GetTabDetails(currentLocation, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations":"",
                        "RowIndex": -1,
                        "API": {
                            "InsertLocation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsRowList/Insert"
                            },
                            "UpdateLocation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsRowList/Update"
                            },
                            "Location": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsLocation/FindAll",
                                "FilterID": "WMSLOCN"
                            },
                            "updateOnlyLocation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsLocation/UpdateV2",
                            },
                            "RowFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsRow/FindAll",
                            "FilterID": "WMSROW"
                            },
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa-plane"
                            }, {
                                "DisplayName": "Location",
                                "Value": "Location",
                                "Icon": "fa-th-list"
                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "WarehouseCode": helperService.metaBase(),
                                "WarehouseName": helperService.metaBase(),
                                "Name": helperService.metaBase(),
                                "Columns": helperService.metaBase(),
                                "Levels": helperService.metaBase(),
                                "Trays": helperService.metaBase(),
                                "PickPathSequence": helperService.metaBase(),
                                "MaxWeightUnit":helperService.metaBase(),
                                "MaxCubicUnit":helperService.metaBase(),
                            }
                        }
                    },
                }
            }
            if (isNew) {
                _exports.Entities.Header.Data = currentLocation.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentLocation.entity.Name,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentLocation.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentLocation.Name]: {
                            ePage: _exports
                        },
                        label: currentLocation.Name,
                        code: currentLocation.Name,
                        isNew: isNew
                    };

                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        function PushErrorWarning(Code, Message, MessageType, IsAlert, MetaObject, EntityObject, IsArray, RowIndex, ColIndex, DisplayName, ParentRef, GParentRef) {
            if (Code) {
                var _obj = {
                    "Code": Code,
                    "Message": Message,
                    "MessageType": MessageType,
                    "IsAlert": IsAlert,
                    "MetaObject": MetaObject,
                    "ParentRef": ParentRef,
                    "GParentRef": GParentRef
                };

                if (IsArray) {
                    _obj.RowIndex = RowIndex;
                    _obj.ColIndex = ColIndex;
                    _obj.DisplayName = DisplayName;
                }

                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                if (_index !== -1) {
                    var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                        return value.Code === Code;
                    });

                    if (!_isExistGlobal) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.push(_obj);
                    }

                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsArray = IsArray;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ParentRef = ParentRef;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].GParentRef = GParentRef;

                    if (MessageType === "W") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = true;

                        var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                            return val.Code;
                        }).indexOf(Code);

                        if (_indexWarning === -1) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.push(_obj);
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING[_indexWarning] = _obj;
                        }

                        if (IsAlert) {
                            toastr.warning(Code, Message);
                        }
                    } else if (MessageType === "E") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = true;

                        var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                            return val.Code;
                        }).indexOf(Code);

                        if (_indexError === -1) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.push(_obj);
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR[_indexError] = _obj;
                        }

                        if (IsAlert) {
                            toastr.error(Code, Message);
                        }
                    }
                }
            }
        }

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                if (_index !== -1) {
                    var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                        return value.Code;
                    }).indexOf(Code);

                    if (_indexGlobal !== -1) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.splice(_indexGlobal, 1);
                    }

                    if (MessageType === "E") {
                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length > 0) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (value, key) {
                                if (value.Code === Code) {
                                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.splice(key, 1);

                                    if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length === 0) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                    }
                                }
                            });
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR = [];
                        }
                    } else if (MessageType === "W") {
                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length > 0) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (value, key) {
                                if (value.Code == Code) {
                                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.splice(key, 1);

                                    if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length === 0) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                    }
                                }
                            });
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING = [];
                        }
                    }
                }
            }
        }

        function GetErrorWarningCountParent(ParentId, EntityObject, Type, ParentType) {
            var _parentList = [];
            var _index = exports.TabList.map(function (value, key) {
                return value.label;
            }).indexOf(EntityObject);

            if (_index !== -1) {
                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value1, key1) {
                    // ParentIdList.map(function (value2, key2) {
                    if (ParentType == "GParent") {
                        if (value1.GParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    } else if (ParentType == "Parent") {
                        if (value1.ParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    }
                    // });
                });
            }
            return _parentList;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.label).toggleClass("open");
        }

        // Validations

        function ValidationFindall(){
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode":"WRO"
            };     
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": exports.Entities.Header.API.Validationapi.FilterID
            };
            apiService.post("eAxisAPI", exports.Entities.Header.API.Validationapi.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues=(response.data.Response);
                }
            });
        }
        function GeneralValidation($item){
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data;
           
            if(!_input.WmsRow.WarehouseCode || _input.WmsRow.WarehouseCode){
                OnChangeValues(_input.WmsRow.WarehouseCode,'E6001',false,undefined,$item.label);
            }
            if(!_input.WmsRow.Name || _input.WmsRow.Name){
                OnChangeValues(_input.WmsRow.Name,'E6002',false,undefined,$item.label);
            }
            if(_input.WmsRow.Columns && _input.WmsRow.Columns !== 0 || _input.WmsRow.Columns){
                OnChangeValues(_input.WmsRow.Columns,'E6003',false,undefined,$item.label);
            }
            if(_input.WmsRow.Columns > 0){
                OnChangeValues('value','E6007',false,undefined,$item.label);
            }else if(_input.WmsRow.Columns===0){
                OnChangeValues(null,'E6007',false,undefined,$item.label);                
            }
            if(!_input.WmsRow.Levels && _input.WmsRow.Levels !== 0 || _input.WmsRow.Levels){
                OnChangeValues(_input.WmsRow.Levels,'E6004',false,undefined,$item.label);
            }
            if(_input.WmsRow.Levels === 0){
                OnChangeValues(null,'E6008',false,undefined,$item.label);
            }else if(_input.WmsRow.Levels>0){
                OnChangeValues('value','E6008',false,undefined,$item.label);                
            }
            if(!_input.WmsRow.Trays && _input.WmsRow.Trays !== 0 || _input.WmsRow.Trays){
                OnChangeValues(_input.WmsRow.Trays,'E6005',false,undefined,$item.label);
            }
            if(_input.WmsRow.Trays === 0){
                OnChangeValues(null,'E6009',false,undefined,$item.label);
            }else if(_input.WmsRow.Trays>0){
                OnChangeValues('value','E6009',false,undefined,$item.label);                
            }
            if(!_input.WmsRow.PickPathSequence && _input.WmsRow.PickPathSequence != '0'  || _input.WmsRow.PickPathSequence){
                OnChangeValues(_input.WmsRow.PickPathSequence,'E6006',false,undefined,$item.label);
            }
            if(_input.WmsRow.PickPathSequence === '0'){
                OnChangeValues(null,'E6010',false,undefined,$item.label);
            }else if(_input.WmsRow.PickPathSequence){
                OnChangeValues('value','E6010',false,undefined,$item.label);                
            }
        }

        function OnChangeValues(fieldvalue,code,IsArray,RowIndex,label) { 
            angular.forEach(exports.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value,IsArray,RowIndex,label);
                }
            });
        }

        function GetErrorMessage(fieldvalue,value,IsArray,RowIndex,label){
            if (!fieldvalue) {
                PushErrorWarning(value.Code,value.Message,"E",false,value.CtrlKey,label,undefined,undefined,undefined,undefined,undefined,undefined);
            } else {
                RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
            }
        }
        
        function RemoveApiErrors(item,label){
            angular.forEach(item,function(value,key){
                RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
            });
        }
    }
})();
