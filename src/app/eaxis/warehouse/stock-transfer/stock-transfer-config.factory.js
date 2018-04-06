(function () {
    "use strict";

    angular
        .module("Application")
        .factory('stocktransferConfig', StocktransferConfig);

    StocktransferConfig.$inject = ["$location", "$q", "helperService", "apiService"];

    function StocktransferConfig($location, $q, helperService, apiService) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsStockTransferList/GetById/",
                            "FilterID": "WMSSTK"
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
                            "Url": "WmsStockTransferList/StockTransferHeaderActivityClose/",
                        },
                    },
                    "Meta": {
                    }
                }
            },

            "TabList": [],
            "ValidationValues":"",
            "SaveAndClose":false,
            "EnableFinaliseValidation":false,
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

        function GetTabDetails(currentStockTransfer, isNew) {
            console.log(currentStockTransfer)
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations":"",
                        "RowIndex": -1,
                        "API": {
                            "InsertStockTransfer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsStockTransferList/Insert"
                            },
                            "UpdateStockTransfer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsStockTransferList/Update"
                            },
                            "CfxMenus": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "cfxtypes/DynamicFindAll/",
                                    "FilterID": "CFXTYPE"
                                },
                            },
                            "FetchQuantity": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FetchQuantity",
                            },
                            "Validationapi": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Validation/FindAll",
                                "FilterID": "VALIDAT"
                            },
                            "OrgMiscServ": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgMiscServ/FindAll",
                                "FilterID": "ORGMISC"
                            },
                            "GetInventoryList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderLine/Delete/"
                            },
                            "UnitConversation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FindAll",
                                "FilterID": "ORGPARTU"
                            },
                            "OrgPartRelation":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductRelatedParty/FindAll",
                                "FilterID": "ORGPRL"
                            },
                        },

                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "UIWmsStockTransferLine": helperService.metaBase(),
                                "Warehouse": helperService.metaBase(),
                                "Client": helperService.metaBase(),
                            },
                        },
                        "CheckPoints":{
                            "DisableSave":false,
                            "NotFinaliseStage":true,
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentStockTransfer.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentStockTransfer.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentStockTransfer.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentStockTransfer.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentStockTransfer.WorkOrderID,
                        code: currentStockTransfer.WorkOrderID,
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

        function ValidationFindall(){
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode":"TFR"
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
           
            if (!_input.UIWmsStockTransferHeader.Client || _input.UIWmsStockTransferHeader.Client)
            OnChangeValues(_input.UIWmsStockTransferHeader.Client, 'E11011', false, undefined, $item.label);
            
            if (!_input.UIWmsStockTransferHeader.Warehouse || _input.UIWmsStockTransferHeader.Warehouse)
            OnChangeValues(_input.UIWmsStockTransferHeader.Warehouse, 'E11012', false, undefined, $item.label);

            if (_input.UIWmsStockTransferLine.length > 0) {
                angular.forEach(_input.UIWmsStockTransferLine, function (value, key) {
                    if (!value.Product || value.Product)
                        OnChangeValues(value.Product, 'E11004', true, key, $item.label);

                    if (!parseFloat(value.Packs) || parseFloat(value.Packs))
                        OnChangeValues(parseFloat(value.Packs), 'E11005', true, key, $item.label);

                    if (!parseFloat(value.Units) || parseFloat(value.Units))
                        OnChangeValues(parseFloat(value.Units), 'E11006', true, key, $item.label);

                    if (!value.StockKeepingUnit || value.StockKeepingUnit)
                        OnChangeValues(value.StockKeepingUnit, 'E11007', true, key, $item.label);

                    if (!value.WLO_Location &&exports.EnableFinaliseValidation == true || value.WLO_Location && exports.EnableFinaliseValidation == true)
                        OnChangeValues(value.WLO_Location, 'E11009', true, key, $item.label);

                    if (!value.WLO_TransferFrom || value.WLO_TransferFrom)
                        OnChangeValues(value.WLO_TransferFrom, 'E11008', true, key, $item.label);

                    if (!value.PAC_PackType || value.PAC_PackType)
                        OnChangeValues(value.PAC_PackType, 'E11010', true, key, $item.label);

                    if (value.WLO_Location == value.WLO_TransferFrom && value.WLO_Location && value.WLO_TransferFrom){
                        OnChangeValues(null, 'E11013', true, key, $item.label); 
                        OnChangeValues(null, 'E11014', true, key, $item.label); 
                    } else{
                        OnChangeValues('value', 'E11013', true, key, $item.label); 
                        OnChangeValues('value', 'E11014', true, key, $item.label);
                    } 
                    if (!value.AdjustmentArrivalDate || value.AdjustmentArrivalDate)
                    OnChangeValues(value.AdjustmentArrivalDate, 'E11015', true, key, $item.label);

                    if ((_input.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && value.UsePartAttrib1 && !value.IsPartAttrib1ReleaseCaptured) || (_input.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && value.UsePartAttrib2 && !value.IsPartAttrib2ReleaseCaptured) || (_input.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && value.UsePartAttrib3 && !value.IsPartAttrib3ReleaseCaptured)){
                        if (parseFloat(value.Units) > 1) {
                            OnChangeValues(null, 'E11017', true, key, $item.label);
                        } else {
                            OnChangeValues('value', 'E11017', true, key, $item.label);
                        }
                    }

                    if(!value.IsPartAttrib1ReleaseCaptured && exports.EnableFinaliseValidation == true){
                        if (_input.UIWmsStockTransferHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 || _input.UIWmsStockTransferHeader.IMPartAttrib1Type == 'MAN' && value.UsePartAttrib1 || _input.UIWmsStockTransferHeader.IMPartAttrib1Type == 'BAT' && value.UsePartAttrib1) {
                            if (!value.PartAttrib1  || value.PartAttrib1)
                                OnChangeValues(value.PartAttrib1, 'E11018', true, key, $item.label);
                        }
                    }    

                    if(!value.IsPartAttrib2ReleaseCaptured && exports.EnableFinaliseValidation == true){
                        if (_input.UIWmsStockTransferHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2 || _input.UIWmsStockTransferHeader.IMPartAttrib2Type == 'MAN' && value.UsePartAttrib2 || _input.UIWmsStockTransferHeader.IMPartAttrib2Type == 'BAT' && value.UsePartAttrib2) {
                            if (!value.PartAttrib2 || value.PartAttrib2)
                                OnChangeValues(value.PartAttrib2, 'E11019', true, key, $item.label);
                        }
                    }

                    if(!value.IsPartAttrib3ReleaseCaptured && exports.EnableFinaliseValidation == true){
                        if (_input.UIWmsStockTransferHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 || _input.UIWmsStockTransferHeader.IMPartAttrib3Type == 'MAN' && value.UsePartAttrib3 || _input.UIWmsStockTransferHeader.IMPartAttrib3Type == 'BAT' && value.UsePartAttrib3) {
                            if (!value.PartAttrib3 || value.PartAttrib3)
                                OnChangeValues(value.PartAttrib3, 'E11020', true, key, $item.label);
                        }
                    }

                    if (value.UsePackingDate && exports.EnableFinaliseValidation == true) {
                        if (!value.PackingDate || value.PackingDate)
                            OnChangeValues(value.PackingDate, 'E11021', true, key, $item.label);
                    }

                    if (value.UsePackingDate && exports.EnableFinaliseValidation == true) {
                        if (!value.ExpiryDate || value.ExpiryDate)
                            OnChangeValues(value.ExpiryDate, 'E11022', true, key, $item.label);
                    }
                });
            }
            
            //Check Duplicate
            if(_input.UIWmsStockTransferLine.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWmsStockTransferLine.length;i++){
                    for(var j=i+1;j<_input.UIWmsStockTransferLine.length;j++){
                        if(!finishloop){
                            if(!_input.UIWmsStockTransferLine[j].IsPartAttrib1ReleaseCaptured && _input.UIWmsStockTransferLine[j].UsePartAttrib1 && _input.UIWmsStockTransferHeader.IMPartAttrib1Type =='SER'){
                                if(_input.UIWmsStockTransferLine[j].PartAttrib1){
                                    if(_input.UIWmsStockTransferLine[i].PartAttrib1 == _input.UIWmsStockTransferLine[j].PartAttrib1){
                                        OnChangeValues(null,'E11023',true,i,$item.label);
                                        OnChangeValues(null,'E11023',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsStockTransferLine[j].IsPartAttrib2ReleaseCaptured && _input.UIWmsStockTransferLine[j].UsePartAttrib2 && _input.UIWmsStockTransferHeader.IMPartAttrib2Type =='SER'){
                                if(_input.UIWmsStockTransferLine[j].PartAttrib2){
                                    if(_input.UIWmsStockTransferLine[i].PartAttrib2 == _input.UIWmsStockTransferLine[j].PartAttrib2){
                                        OnChangeValues(null,'E11024',true,i,$item.label);
                                        OnChangeValues(null,'E11024',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsStockTransferLine[j].IsPartAttrib3ReleaseCaptured && _input.UIWmsStockTransferLine[j].UsePartAttrib3 && _input.UIWmsStockTransferHeader.IMPartAttrib3Type =='SER'){
                                if(_input.UIWmsStockTransferLine[j].PartAttrib3){
                                    if(_input.UIWmsStockTransferLine[i].PartAttrib3 == _input.UIWmsStockTransferLine[j].PartAttrib3){
                                        OnChangeValues(null,'E11025',true,i,$item.label);
                                        OnChangeValues(null,'E11025',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
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

        function GetErrorMessage(fieldvalue,value,IsArray,RowIndex,label){
            if (!IsArray) {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, undefined, undefined, undefined, undefined, undefined);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }
        
        function RemoveApiErrors(item,label){
            angular.forEach(item,function(value,key){
                RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
            });
        }
    }
})();


