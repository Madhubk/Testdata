(function(){
    "use strict";

    angular
         .module("Application")
         .factory("adjustmentConfig",AdjustmentConfig);

    AdjustmentConfig.$inject = ["$location", "$q", "helperService", "apiService"];

    function AdjustmentConfig($location, $q, helperService, apiService){
        var exports = {
            "Entities":{
                "Header":{
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
                            "Url": "WmsAdjustmentList/GetById/"
                        },
                        "Validationapi":{
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID":"VALIDAT"
                        },
                        "Inventory":{
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInventory/FindAll",
                            "FilterID": "WMSINV"
                        },
                    },
                    "Meta": {
                        
                    }
                }
            },
            "TabList": [],
            "ValidationValues":"",
            "SaveAndClose":false,
            "ProductSummaryList":"",
            "GetTabDetails": GetTabDetails,
            "GeneralValidation":GeneralValidation,
            "RemoveApiErrors":RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall":ValidationFindall,
            "refreshgrid":refreshgrid,
        };
        return exports;

        function GetTabDetails(currentAdjustment, isNew){
            var deferred = $q.defer();
            var _exports = {
                "Entities":{
                    "Header":{
                        "Data":{},
                        "Validations":"",
                        "RowIndex": -1,
                        "API":{
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "InsertAdjustment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsAdjustmentList/Insert"
                            },
                            "UpdateAdjustment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsAdjustmentList/Update"
                            },
                            "LineDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderLine/Delete/"
                            },
                            "FetchQuantity":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FetchQuantity",
                            },
                            "Inventory":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "UnitConversation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FindAll",
                                "FilterID": "ORGPARTU"
                            },
                            "OrgMiscServ": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgMiscServ/FindAll",
                                "FilterID": "ORGMISC"
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
                                "Client": helperService.metaBase(),
                                "Warehouse": helperService.metaBase(),
                                "UIWmsWorkOrderLine":helperService.metaBase(),
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
                _exports.Entities.Header.Data = currentAdjustment.data;
                
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentAdjustment.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentAdjustment.PK).then(function(response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentAdjustment.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentAdjustment.WorkOrderID,
                        code: currentAdjustment.WorkOrderID,
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
                "SubModuleCode":"WAL"
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
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data;
           
            if(!_input.UIAdjustmentHeader.Client || _input.UIAdjustmentHeader.Client){
                OnChangeValues(_input.UIAdjustmentHeader.Client,'E10001',false,undefined,$item.label);
            }
            if(!_input.UIAdjustmentHeader.Warehouse || _input.UIAdjustmentHeader.Warehouse){
                OnChangeValues(_input.UIAdjustmentHeader.Warehouse,'E10002',false,undefined,$item.label);
            }

             //Receive Lines Validation
             if(_input.UIWmsWorkOrderLine.length>0){
                angular.forEach(_input.UIWmsWorkOrderLine,function(value,key){
                    if(!value.Product || value.Product)
                    OnChangeValues(value.Product,'E10003',true,key,$item.label);

                    if(!parseFloat(value.Packs) || parseFloat(value.Packs))
                    OnChangeValues(parseFloat(value.Packs),'E10004',true,key,$item.label);

                    if(!value.PAC_PackType || value.PAC_PackType)
                    OnChangeValues(value.PAC_PackType,'E10005',true,key,$item.label);

                    if(!parseFloat(value.Units) || parseFloat(value.Units))
                    OnChangeValues(parseFloat(value.Units),'E10006',true,key,$item.label);

                    if(!value.StockKeepingUnit || value.StockKeepingUnit)
                    OnChangeValues(value.StockKeepingUnit,'E10007',true,key,$item.label);
                    
                    if(!value.ReasonCode || value.ReasonCode)
                    OnChangeValues(value.ReasonCode,'E10010',true,key,$item.label);

                    if(!value.AdjustmentArrivalDate || value.AdjustmentArrivalDate)
                    OnChangeValues(value.AdjustmentArrivalDate,'E10009',true,key,$item.label);

                    if(!value.WLO_Location || value.WLO_Location)
                    OnChangeValues(value.WLO_Location,'E10011',true,key,$item.label);

                    if(!value.IsPartAttrib1ReleaseCaptured){
                        if (_input.UIAdjustmentHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 || _input.UIAdjustmentHeader.IMPartAttrib1Type == 'MAN' && value.UsePartAttrib1 || _input.UIAdjustmentHeader.IMPartAttrib1Type == 'BAT' && value.UsePartAttrib1) {
                            if (!value.PartAttrib1 || value.PartAttrib1)
                                OnChangeValues(value.PartAttrib1, 'E10016', true, key, $item.label);
                        }
                    }    

                    if(!value.IsPartAttrib2ReleaseCaptured){
                        if (_input.UIAdjustmentHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2 || _input.UIAdjustmentHeader.IMPartAttrib2Type == 'MAN' && value.UsePartAttrib2 || _input.UIAdjustmentHeader.IMPartAttrib2Type == 'BAT' && value.UsePartAttrib2) {
                            if (!value.PartAttrib2 || value.PartAttrib2)
                                OnChangeValues(value.PartAttrib2, 'E10017', true, key, $item.label);
                        }
                    }

                    if(!value.IsPartAttrib3ReleaseCaptured){
                        if (_input.UIAdjustmentHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 || _input.UIAdjustmentHeader.IMPartAttrib3Type == 'MAN' && value.UsePartAttrib3 || _input.UIAdjustmentHeader.IMPartAttrib3Type == 'BAT' && value.UsePartAttrib3) {
                            if (!value.PartAttrib3 || value.PartAttrib3)
                                OnChangeValues(value.PartAttrib3, 'E10018', true, key, $item.label);
                        }
                    }

                    if (value.UsePackingDate) {
                        if (!value.PackingDate || value.PackingDate)
                            OnChangeValues(value.PackingDate, 'E10019', true, key, $item.label);
                    }

                    if (value.UsePackingDate) {
                        if (!value.ExpiryDate || value.ExpiryDate)
                            OnChangeValues(value.ExpiryDate, 'E10020', true, key, $item.label);
                    }

                    if ((_input.UIAdjustmentHeader.IMPartAttrib1Type == "SER" && value.UsePartAttrib1 && !value.IsPartAttrib1ReleaseCaptured) || (_input.UIAdjustmentHeader.IMPartAttrib2Type == "SER" && value.UsePartAttrib2 && !value.IsPartAttrib2ReleaseCaptured) || (_input.UIAdjustmentHeader.IMPartAttrib3Type == "SER" && value.UsePartAttrib3 && !value.IsPartAttrib3ReleaseCaptured)){
                        if (parseFloat(value.Units) > 1) {
                            OnChangeValues(null, 'E10021', true, key, $item.label);
                        } else {
                            OnChangeValues('value', 'E10021', true, key, $item.label);
                        }
                    }
                });
            }

            //Check Duplicate
            if(_input.UIWmsWorkOrderLine.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWmsWorkOrderLine.length;i++){
                    for(var j=i+1;j<_input.UIWmsWorkOrderLine.length;j++){
                        if(!finishloop){
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib1ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib1 && _input.UIAdjustmentHeader.IMPartAttrib1Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib1){
                                    if(_input.UIWmsWorkOrderLine[i].PartAttrib1 == _input.UIWmsWorkOrderLine[j].PartAttrib1){
                                        OnChangeValues(null,'E10022',true,i,$item.label);
                                        OnChangeValues(null,'E10022',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib2ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib2 && _input.UIAdjustmentHeader.IMPartAttrib2Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib2){
                                    if(_input.UIWmsWorkOrderLine[i].PartAttrib2 == _input.UIWmsWorkOrderLine[j].PartAttrib2){
                                        OnChangeValues(null,'E10023',true,i,$item.label);
                                        OnChangeValues(null,'E10023',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib3ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib3 && _input.UIAdjustmentHeader.IMPartAttrib3Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib3){
                                    if(_input.UIWmsWorkOrderLine[i].PartAttrib3 == _input.UIWmsWorkOrderLine[j].PartAttrib3){
                                        OnChangeValues(null,'E10024',true,i,$item.label);
                                        OnChangeValues(null,'E10024',true,j,$item.label);
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
            if(!IsArray){
                if (!fieldvalue) {
                    PushErrorWarning(value.Code,value.Message,"E",false,value.CtrlKey,label,undefined,undefined,undefined,undefined,undefined,value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
                }
            }else{
                if (!fieldvalue) {
                    PushErrorWarning(value.Code,value.Message,"E",false,value.CtrlKey,label,IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code,"E",value.CtrlKey,label,IsArray, RowIndex, value.ColIndex);
                }
            }
        }
        
        function RemoveApiErrors(item,label){
            angular.forEach(item,function(value,key){
                RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
            });
        }
        function refreshgrid(){
            helperService.refreshGrid();
        }
    }
})();