(function () {
    "use strict";

    angular
        .module("Application")
        .factory('pickConfig', PickConfig);

    PickConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function PickConfig($location, $q, helperService, apiService, toastr) {
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
                            "Url": "WmsPickList/GetById/",
                            "FilterID": "WMSWORK"
                        },
                        "OutwardGetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsOutwardList/GetById/",
                        },

                        "Validationapi": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickList/PickHeaderActivityClose/",
                        },
                    },
                    "Meta": {


                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ValidationValues": "",
            "SaveAndClose": false,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall

        };

        return exports;

        function GetTabDetails(currentPick, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertPick": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickList/Insert"
                            },
                            "UpdatePick": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickList/Update"
                            },
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "Inventory": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsOutwardWorkOrderLine/Delete/"
                            },
                            "AllocateStock": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickList/WmsAllocateStock",
                            },
                            "GenerateReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Communication/GenerateReport",
                            }
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa-plane",
                                "GParentRef": "pickgeneral"
                            }, {
                                "DisplayName": "Pick Slip",
                                "Value": "PickSlip",
                                "Icon": "fa-pencil-square-o",
                                "GParentRef": "pickslip"
                            }],
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "PickNo": helperService.metaBase(),
                                "PickOption": helperService.metaBase(),
                                "WarehouseCode": helperService.metaBase(),
                                "PickedQty": helperService.metaBase(),
                                "UIWmsPickLineSummary": helperService.metaBase()
                            },
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "DisableAllocate": false,
                            "CallInventoryFunction": true
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentPick.data;
                _exports.Entities.Header.GetById = currentPick.data;
                _exports.Entities.Header.Validations = currentPick.Validations;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentPick.entity.PickNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentPick.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentPick.PickNo]: {
                            ePage: _exports
                        },
                        label: currentPick.PickNo,
                        code: currentPick.PickNo,
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

                    if(!IsArray){
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            return value.Code == Code;
                        });  
                    }else{
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            if(value.Code == Code && value.RowIndex == RowIndex && value.ColIndex == ColIndex)
                            return true;
                        });
                    }

                    if (!_isExistGlobal) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.push(_obj);
                    }

                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsArray = IsArray;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ParentRef = ParentRef;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].GParentRef = GParentRef;

                    if (MessageType === "W") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = true;
                        
                        if(!IsArray){
                            var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        }else{
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if(val.Code == Code && val.RowIndex == RowIndex && val.ColIndex==ColIndex)
                                return val.Code;
                            }).indexOf(Code);
                        }

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

                        if(!IsArray){
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        }else{
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if(val.Code == Code && val.RowIndex == RowIndex && val.ColIndex==ColIndex)
                                return val.Code;
                            }).indexOf(Code);
                        }

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

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject,IsArray, RowIndex, ColIndex) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                    if (_index !== -1) {
                        if(!IsArray){
                            var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                                return value.Code;
                            }).indexOf(Code);
                        }else{
                            var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                                if(value.Code==Code && value.RowIndex==RowIndex && value.ColIndex==ColIndex)
                                return value.Code;
                            }).indexOf(Code);
                        }


                    if (_indexGlobal !== -1) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.splice(_indexGlobal, 1);
                    }

                    if (MessageType === "E") {
                        if(!IsArray){
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
                        }else if(IsArray){
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (value, key) {
                                    if (value.Code == Code && value.ColIndex == ColIndex && value.RowIndex == RowIndex) {
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
                        }
                    } else if (MessageType === "W") {
                        if(!IsArray){
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
                        }else if(IsArray){
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (value, key) {
                                    if (value.Code == Code && value.ColIndex == ColIndex && value.RowIndex == RowIndex) {
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

        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode": "WPK"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": exports.Entities.Header.API.Validationapi.FilterID
            };
            apiService.post("eAxisAPI", exports.Entities.Header.API.Validationapi.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues = (response.data.Response);
                }
            });
        }

        function GeneralValidation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            if (!_input.UIWmsPickHeader.PickNo || _input.UIWmsPickHeader.PickNo) {
                OnChangeValues(_input.UIWmsPickHeader.PickNo, 'E8001', false, undefined, $item.label);
            }
            if (!_input.UIWmsPickHeader.PickOption || _input.UIWmsPickHeader.PickOption) {
                OnChangeValues(_input.UIWmsPickHeader.PickOption, 'E8002', false, undefined, $item.label);
            }
            if (!_input.UIWmsPickHeader.WarehouseCode || _input.UIWmsPickHeader.WarehouseCode) {
                OnChangeValues(_input.UIWmsPickHeader.WarehouseCode, 'E8003', false, undefined, $item.label);
            }
            //Pick Line Summary Validation
            // if (_input.UIWmsPickLineSummary != null) {
            //     if (_input.UIWmsPickLineSummary.length > 0) {
            //         angular.forEach(_input.UIWmsPickLineSummary, function (value, key) {
            //             if (value.IsPicked == "1") {
            //                 if (value.PickedDateTime == null) {
            //                     OnChangeValues(value.Product, 'E8011', true, key, $item.label);
            //                 }
            //             }
            //         });
            //     }
            // }
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex, label) {
            angular.forEach(exports.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label);
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label) {
            if (IsArray) {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), label, undefined, undefined, undefined, undefined, undefined, undefined);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), label);
                }
            }
        }

        function RemoveApiErrors(item, label) {
            angular.forEach(item, function (value, key) {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), label);
            });
        }
    }
})();


