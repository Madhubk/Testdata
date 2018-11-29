(function () {
    "use strict";

    angular
        .module("Application")
        .factory("createmanifestConfig", CreatemanifestConfig);

    CreatemanifestConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function CreatemanifestConfig($location, $q, helperService, apiService, toastr) {
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
                            "Url": "TmsManifestList/GetById/"
                        },
                        "Validationapi": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        },
                        "ManifestUpdate": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Update"
                        },
                        "UpdateManifestProcess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/ProcessUpdate"
                        },
                        "OrgHeader": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeader/FindAll",
                            "FilterID": "ORGHEAD"
                        },
                    },
                    "Meta": {

                    },
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
        };

        return exports;

        function GetTabDetails(currentManifest, isNew) {
            var deferred = $q.defer();

            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "OrgAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID": "ORGADDR"
                            },
                            "InsertManifest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsManifestList/Insert"
                            },
                            "UpdateManifest": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsManifestList/Update"
                            },
                            "CfxMappingFindall": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxOrgMapping/FindAll",
                                "FilterID": "CFXORMAP"
                            },
                            "OrgHeader": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeader/FindAll",
                                "FilterID": "ORGHEAD"
                            },

                        },
                        "Meta": {
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "SenderCode": helperService.metaBase(),
                                "ReceiverCode": helperService.metaBase(),
                                "ManifestType": helperService.metaBase(),
                                "DriveName": helperService.metaBase(),
                                "DriverContactNo": helperService.metaBase(),
                                "TransporterCode": helperService.metaBase(),
                                "VehicleNo": helperService.metaBase(),
                                "VehicleTypeCode": helperService.metaBase(),
                                "ShipmentArrivalDate": helperService.metaBase(),
                                "ContainerTypeCode": helperService.metaBase(),
                                "ConsolNo": helperService.metaBase(),
                                "SealNo": helperService.metaBase(),
                                "ShipmentNo": helperService.metaBase(),
                                "VesselName": helperService.metaBase(),
                                "VoyageNo": helperService.metaBase(),
                                "ContainerNo": helperService.metaBase(),
                                "EstimatedDispatchDate": helperService.metaBase(),
                                "EstimatedDeliveryDate": helperService.metaBase()
                            },
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "DisableAllocate": false,
                            "Consignment": false,
                            "SaveAndClose": false,
                            "UnDispatchClose": false,
                            "UserAccessCode": ""
                        },

                    },
                }
            }

            if (isNew) {
                _exports.Entities.Header.Data = currentManifest.data;

                var obj = {
                    [currentManifest.entity.ManifestNumber]: {
                        ePage: _exports
                    },
                    label: currentManifest.entity.ManifestNumber,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentManifest.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentManifest.ManifestNumber]: {
                            ePage: _exports
                        },
                        label: currentManifest.ManifestNumber,
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

                        // var _isExistWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.some(function (val, key) {
                        //     return val.Code === Code;
                        // });
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

                        // var _isExistError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.some(function (val, key) {
                        //     return val.Code === Code;
                        // });
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
            $("#errorWarningContainernew").toggleClass("open");
        }

        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "TMS",
                "SubModuleCode": "MAN"
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

                OnChangeValues(_input.TmsManifestHeader.SenderCode, 'E5501', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsManifestHeader.ReceiverCode, 'E5500', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsManifestHeader.ManifestType, 'E5502', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsManifestHeader.TransporterCode, 'E5508', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsManifestHeader.EstimatedDispatchDate, 'E5545', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsManifestHeader.EstimatedDeliveryDate, 'E5546', false, undefined, $item.label);
            
            if (_input.ProcessInfo.length > 0) {
                if (_input.ProcessInfo[0].WSI_StepName == "Confirm Manifest Arrival") {
                        OnChangeValues(_input.TmsManifestHeader.ShipmentArrivalDate, 'E5513', false, undefined, $item.label);
                }
            }

            if (_input.TmsManifestHeader.ManifestType == "LDY") {
                
                OnChangeValues(_input.TmsManifestHeader.DriveName, 'E5504', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsManifestHeader.DriverContactNo, 'E5505', false, undefined, $item.label);

                OnChangeValues(_input.TmsManifestHeader.VehicleNo, 'E5509', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsManifestHeader.VehicleTypeCode, 'E5510', false, undefined, $item.label);
            }
            else if (_input.TmsManifestHeader.ManifestType == "LEH") {
                OnChangeValues(_input.TmsManifestHeader.VehicleTypeCode, 'E5510', false, undefined, $item.label);
            }
            else if (_input.TmsManifestHeader.ManifestType == "OCN") {
                    OnChangeValues(_input.TmsManifestHeader.ContainerTypeCode, 'E5515', false, undefined, $item.label);
                
                    OnChangeValues(_input.TmsManifestHeader.ContainerNo, 'E5514', false, undefined, $item.label);
                
                    OnChangeValues(_input.TmsManifestHeader.VoyageNo, 'E5512', false, undefined, $item.label);
                
                    OnChangeValues(_input.TmsManifestHeader.VesselName, 'E5511', false, undefined, $item.label);

                    OnChangeValues(_input.TmsManifestHeader.ShipmentNo, 'E5507', false, undefined, $item.label);
                
                    OnChangeValues(_input.TmsManifestHeader.SealNo, 'E5506', false, undefined, $item.label);
                
                    OnChangeValues(_input.TmsManifestHeader.ConsolNo, 'E5503', false, undefined, $item.label);
            }
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex, label) {
            angular.forEach(exports.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label);
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label) {
            if (!IsArray) {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, undefined, undefined, undefined, undefined, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function RemoveApiErrors(item, label) {
            angular.forEach(item, function (value, key) {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
            });
        }
    }

})();