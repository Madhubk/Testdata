(function () {
    "use strict";

    angular
        .module("Application")
        .factory('routingConfig', RoutingConfig);

    RoutingConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr","appConfig"];

    function RoutingConfig($location, $q, helperService, apiService, toastr,appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "Meta": {
                    },
                    "Message": false
                }

            },

            "TabList": [],
            "ValidationValues": "",
            "SaveAndClose":false,
            "ProductSummaryList": {},
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
            "ProductSummary": ProductSummary,
        };
        return exports;

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
                    _obj.Message = Message+' In Line No '+ (RowIndex+1);
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
                "SubModuleCode":"INW"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues = (response.data.Response);
                }
            });
        }

        function GeneralValidation($item) {
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            OnChangeValues(_input.UIWmsInwardHeader.Client, 'E3001', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsInwardHeader.Warehouse, 'E3002', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsInwardHeader.WorkOrderSubType, 'E3004', false, undefined, $item.label);

            //Asn Lines Validation
            if (_input.UIWmsAsnLine.length > 0) {
                angular.forEach(_input.UIWmsAsnLine, function (value, key) {
                    OnChangeValues(value.ProductCode, 'E3005', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Packs), 'E3006', true, key, $item.label);

                    OnChangeValues(value.PAC_PackType, 'E3007', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Quantity), 'E3030', true, key, $item.label);

                    OnChangeValues(value.StockKeepingUnit, 'E3031', true, key, $item.label);

                    OnChangeValues('value','E3040',true,key,$item.label);
                });
            }

            //Check Duplicate
            if(_input.UIWmsAsnLine.length>1){
                var finishloop = false;
                for(var i=0;i<_input.UIWmsAsnLine.length;i++){
                    for(var j=i+1;j<_input.UIWmsAsnLine.length;j++){
                        if(!finishloop){
                            if((_input.UIWmsAsnLine[i].POR_FK == _input.UIWmsAsnLine[j].POR_FK) && (_input.UIWmsAsnLine[i].Quantity ==_input.UIWmsAsnLine[j].Quantity) && (_input.UIWmsAsnLine[i].Packs==_input.UIWmsAsnLine[j].Packs) &&(_input.UIWmsAsnLine[i].PAC_PackType==_input.UIWmsAsnLine[j].PAC_PackType) &&(_input.UIWmsAsnLine[i].PartAttrib1==_input.UIWmsAsnLine[j].PartAttrib1) &&(_input.UIWmsAsnLine[i].PartAttrib2==_input.UIWmsAsnLine[j].PartAttrib2)&&(_input.UIWmsAsnLine[i].PartAttrib3==_input.UIWmsAsnLine[j].PartAttrib3)&&(_input.UIWmsAsnLine[i].PackingDate==_input.UIWmsAsnLine[j].PackingDate)&&(_input.UIWmsAsnLine[i].ExpiryDate == _input.UIWmsAsnLine[j].ExpiryDate) && (_input.UIWmsAsnLine[i].PalletId==_input.UIWmsAsnLine[j].PalletId)){
                                OnChangeValues(null,'E3040',true,i,$item.label);
                                OnChangeValues(null,'E3040',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //Receive Lines Validation
            if (_input.UIWmsWorkOrderLine.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderLine, function (value, key) {
                    OnChangeValues(value.ProductCode, 'E3008', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Packs), 'E3009', true, key, $item.label);

                    OnChangeValues(value.PAC_PackType, 'E3010', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Units), 'E3032', true, key, $item.label);

                    OnChangeValues(value.StockKeepingUnit, 'E3033', true, key, $item.label);

                    OnChangeValues(value.StockKeepingUnit, 'E3033', true, key, $item.label);

                    if (!value.PRO_FK && value.ProductCode|| value.PRO_FK && value.ProductCode)
                        OnChangeValues(value.PRO_FK, 'E3046', true, key, $item.label);

                    if (!value.WLO_FK && value.WLO_Location|| value.WLO_FK && value.WLO_Location)
                        OnChangeValues(value.WLO_FK, 'E3047', true, key, $item.label);

                    if(!value.IsPartAttrib1ReleaseCaptured){
                        if (_input.UIWmsInwardHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 || _input.UIWmsInwardHeader.IMPartAttrib1Type == 'MAN' && value.UsePartAttrib1 || _input.UIWmsInwardHeader.IMPartAttrib1Type == 'BAT' && value.UsePartAttrib1) {
                            if (!value.PartAttrib1 || value.PartAttrib1)
                                OnChangeValues(value.PartAttrib1, 'E3018', true, key, $item.label);
                        }
                    }    

                    if(!value.IsPartAttrib2ReleaseCaptured){
                        if (_input.UIWmsInwardHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2 || _input.UIWmsInwardHeader.IMPartAttrib2Type == 'MAN' && value.UsePartAttrib2 || _input.UIWmsInwardHeader.IMPartAttrib2Type == 'BAT' && value.UsePartAttrib2) {
                            if (!value.PartAttrib2 || value.PartAttrib2)
                                OnChangeValues(value.PartAttrib2, 'E3019', true, key, $item.label);
                        }
                    }

                    if(!value.IsPartAttrib3ReleaseCaptured){
                        if (_input.UIWmsInwardHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 || _input.UIWmsInwardHeader.IMPartAttrib3Type == 'MAN' && value.UsePartAttrib3 || _input.UIWmsInwardHeader.IMPartAttrib3Type == 'BAT' && value.UsePartAttrib3) {
                            if (!value.PartAttrib3 || value.PartAttrib3)
                                OnChangeValues(value.PartAttrib3, 'E3020', true, key, $item.label);
                        }
                    }

                    if (value.UsePackingDate) {
                        if (!value.PackingDate || value.PackingDate)
                            OnChangeValues(value.PackingDate, 'E3035', true, key, $item.label);
                    }

                    if (value.UseExpiryDate) {
                        if (!value.ExpiryDate || value.ExpiryDate)
                            OnChangeValues(value.ExpiryDate, 'E3036', true, key, $item.label);
                    }

                    if((_input.UIWmsInwardHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 && parseFloat(value.Units) != 1 && !value.IsPartAttrib1ReleaseCaptured) || (_input.UIWmsInwardHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2  && parseFloat(value.Units) !=1  && !value.IsPartAttrib2ReleaseCaptured) || (_input.UIWmsInwardHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 && parseFloat(value.Units) != 1  && !value.IsPartAttrib3ReleaseCaptured)){
                        OnChangeValues(null, 'E3038', true, key, $item.label);
                    }else{
                        OnChangeValues('value', 'E3038', true, key, $item.label);
                    }

                    OnChangeValues('value', 'E3021', true, key, $item.label);
                    OnChangeValues('value', 'E3022', true, key, $item.label);
                    OnChangeValues('value', 'E3023', true, key, $item.label);
                });
            }


            //Check Duplicate
            if(_input.UIWmsWorkOrderLine.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWmsWorkOrderLine.length;i++){
                    for(var j=i+1;j<_input.UIWmsWorkOrderLine.length;j++){
                        if(!finishloop){
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib1ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib1 && _input.UIWmsInwardHeader.IMPartAttrib1Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib1){
                                    if((_input.UIWmsWorkOrderLine[i].PartAttrib1 == _input.UIWmsWorkOrderLine[j].PartAttrib1)&&(_input.UIWmsWorkOrderLine[i].PRO_FK == _input.UIWmsWorkOrderLine[j].PRO_FK)){
                                        OnChangeValues(null,'E3021',true,i,$item.label);
                                        OnChangeValues(null,'E3021',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib2ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib2 && _input.UIWmsInwardHeader.IMPartAttrib2Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib2){
                                    if((_input.UIWmsWorkOrderLine[i].PartAttrib2 == _input.UIWmsWorkOrderLine[j].PartAttrib2)&&(_input.UIWmsWorkOrderLine[i].PRO_FK == _input.UIWmsWorkOrderLine[j].PRO_FK)){
                                        OnChangeValues(null,'E3022',true,i,$item.label);
                                        OnChangeValues(null,'E3022',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib3ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib3 && _input.UIWmsInwardHeader.IMPartAttrib3Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib3){
                                    if((_input.UIWmsWorkOrderLine[i].PartAttrib3 == _input.UIWmsWorkOrderLine[j].PartAttrib3)&&(_input.UIWmsWorkOrderLine[i].PRO_FK == _input.UIWmsWorkOrderLine[j].PRO_FK)){
                                        OnChangeValues(null,'E3023',true,i,$item.label);
                                        OnChangeValues(null,'E3023',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //Containers Validation
            if (_input.UIWmsWorkOrderContainer.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderContainer, function (value, key) {
                    OnChangeValues(value.ContainerNumber, 'E3013', true, key, $item.label);

                    OnChangeValues(value.Type, 'E3014', true, key, $item.label);
                });
            }

            //Containers Validation
            if (_input.UIWmsWorkOrderReference.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderReference, function (value, key) {
                    OnChangeValues(value.RefType, 'E3015', true, key, $item.label);

                    OnChangeValues(value.Reference, 'E3016', true, key, $item.label);
                });
            }

            //Services Validation
            if (_input.UIJobServices.length > 0) {
                angular.forEach(_input.UIJobServices, function (value, key) {
                    OnChangeValues(value.ServiceCode, 'E3017', true, key, $item.label);
                });
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

        //Get Product SummaryList
        function ProductSummary(item) {
            var _filter = {
                "WOD_FK": item.Data.PK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": item.API.LineSummary.FilterID
            };

            apiService.post("eAxisAPI", item.API.LineSummary.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var myvalue = angular.copy(item.Data.PK);
                    exports.ProductSummaryList[myvalue]=response.data.Response;
                }
            });
        }
    }
})();


