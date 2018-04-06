(function () {
    "use strict";

    angular
        .module("Application")
        .factory('manifestConfig', ManifestConfig);

    ManifestConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function ManifestConfig($location, $q, helperService, apiService, toastr) {

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
                    },
                    "Meta": {


                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ValidationValues": "",
            "TempConsignmentNumber": "",
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall

        };

        return exports;

        function GetTabDetails(currentManifest, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
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
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "OrgAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID": "ORGADDR"
                            },
                            "CfxMappingFindall": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxOrgMapping/FindAll",
                                "FilterID": "CFXORMAP"
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
                                "GParentRef": "manifestgeneral"
                            }, {
                                "DisplayName": "Consignment",
                                "Value": "Consignment",
                                "Icon": "fa-plane",
                                "GParentRef": "manifestconsignment"
                            }, {
                                "DisplayName": "Manifest Item",
                                "Value": "Manifest Item",
                                "Icon": "fa-plane",
                                "GParentRef": "manifestitem"
                            }],
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
                                "ContainerTypeCode": helperService.metaBase()
                            },
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "DisableAllocate": false,
                            "Consignment": false,
                            "SaveAndClose": false,
                            "UnDispatchClose": false
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentManifest.data;
                _exports.Entities.Header.GetById = currentManifest.data;
                _exports.Entities.Header.Validations = currentManifest.Validations;
            
                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentManifest.entity.ManifestNumber,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
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

                    if (!IsArray) {
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            return value.Code === Code;
                        });
                    } else {
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            if (value.Code === Code && value.RowIndex === RowIndex && value.ColIndex === ColIndex)
                                return true;
                            else
                                return false;
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

                        if (!IsArray) {
                            var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        } else {
                            var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                                return [val.Code, val.RowIndex, val.ColIndex];
                            }).indexOf([Code, RowIndex, ColIndex]);
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

                        if (!IsArray) {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        } else {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                return [val.Code, val.RowIndex, val.ColIndex];
                            }).indexOf([Code, RowIndex, ColIndex]);
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

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject, IsArray, RowIndex, ColIndex) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                if (_index !== -1) {
                    if (!IsArray) {
                        var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                            return value.Code;
                        }).indexOf(Code);
                    } else {
                        var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                            if (value.Code == Code && value.RowIndex == RowIndex && value.ColIndex == ColIndex)
                                return value.Code;
                        }).indexOf(Code);
                    }


                    if (_indexGlobal !== -1) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.splice(_indexGlobal, 1);
                    }

                    if (MessageType === "E") {
                        if (!IsArray) {
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
                        } else if (IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (value, key) {
                                    if (value.Code === Code && value.ColIndex === ColIndex && value.RowIndex === RowIndex) {
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
                        if (!IsArray) {
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
                        } else if (IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (value, key) {
                                    if (value.Code === Code && value.ColIndex === ColIndex && value.RowIndex === RowIndex) {
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
            if (!_input.TmsManifestHeader.SenderCode || _input.TmsManifestHeader.SenderCode) {
                OnChangeValues(_input.TmsManifestHeader.SenderCode, 'E5501', false, undefined, $item.label);
            }
            if (!_input.TmsManifestHeader.ReceiverCode || _input.TmsManifestHeader.ReceiverCode) {
                OnChangeValues(_input.TmsManifestHeader.ReceiverCode, 'E5500', false, undefined, $item.label);
            }
            if (!_input.TmsManifestHeader.ManifestType || _input.TmsManifestHeader.ManifestType) {
                OnChangeValues(_input.TmsManifestHeader.ManifestType, 'E5502', false, undefined, $item.label);
            }
            if (!_input.TmsManifestHeader.TransporterCode || _input.TmsManifestHeader.TransporterCode) {
                OnChangeValues(_input.TmsManifestHeader.TransporterCode, 'E5508', false, undefined, $item.label);
            }
            if (_input.TmsManifestHeader.ManifestType == "LEH") {
                if (!_input.TmsManifestHeader.DriveName || _input.TmsManifestHeader.DriveName) {
                    OnChangeValues(_input.TmsManifestHeader.DriveName, 'E5504', false, undefined, $item.label);
                }
                if (!_input.TmsManifestHeader.DriverContactNo || _input.TmsManifestHeader.DriverContactNo) {
                    OnChangeValues(_input.TmsManifestHeader.DriverContactNo, 'E5505', false, undefined, $item.label);
                }
                if (!_input.TmsManifestHeader.VehicleNo || _input.TmsManifestHeader.VehicleNo) {
                    OnChangeValues(_input.TmsManifestHeader.VehicleNo, 'E5509', false, undefined, $item.label);
                }
                if (!_input.TmsManifestHeader.VehicleTypeCode || _input.TmsManifestHeader.VehicleTypeCode) {
                    OnChangeValues(_input.TmsManifestHeader.VehicleTypeCode, 'E5510', false, undefined, $item.label);
                }
            }
            else if (_input.TmsManifestHeader.ManifestType == "OCN") {
                if (!_input.TmsManifestHeader.ContainerTypeCode || _input.TmsManifestHeader.ContainerTypeCode) {
                    OnChangeValues(_input.TmsManifestHeader.ContainerTypeCode, 'E5515', false, undefined, $item.label);
                }
            }
            // if (_input.ProcessInfo.length > 0) {
            // if (_input.ProcessInfo[0].WSI_StepName == "Confirm Arrival at Port") {
            //     if (!_input.TmsManifestHeader.ShipmentArrivalDate || _input.TmsManifestHeader.ShipmentArrivalDate) {
            //         OnChangeValues(_input.TmsManifestHeader.ShipmentArrivalDate, 'E5513', false, undefined, $item.label);
            //     }
            // }
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
            if (!fieldvalue) {
                PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), label, undefined, undefined, undefined, undefined, undefined, undefined);
            } else {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), label);
            }
        }

        function RemoveApiErrors(item, label) {
            angular.forEach(item, function (value, key) {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), label);
            });
        }
    }
})();


