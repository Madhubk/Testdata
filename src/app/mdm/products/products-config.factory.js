(function () {
    "use strict";

    angular
        .module("Application")
        .factory('productConfig', ProductConfig);

    ProductConfig.$inject = ["$location", "$q", "helperService", "apiService","toastr"];

    function ProductConfig($location, $q, helperService, apiService,toastr) {
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
                            "Url": "WmsProductList/GetById/"
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
                            "Url": "WmsProductList/ProductHeaderActivityClose/",
                        },
                    },
                    "Meta": {
                    },

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

        function GetTabDetails(currentProduct, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations":"",
                        "RowIndex": -1,
                        "API": {
                            "InsertProduct": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsProductList/Insert"
                            },
                            "UpdateProduct": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsProductList/Update"
                            },
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "Barcode": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdPrductBarcode/FindAll",
                                "FilterID": "ORGSUPPB"
                            },
                            "UnitConversation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FindAll",
                                "FilterID": "ORGPARTU"
                            },
                            "BOM": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductBOM/FindAll",
                                "FilterID": "ORGPABOM"
                            },
                            "Warehouse": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WMSProductParamsByWmsAndClient/FindAll",
                                "FilterID": "WMSPPWNC"
                            },
                            "PickFace": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WMSPickFace/FindAll",
                                "FilterID": "WMSPICF"
                            },
                            "RelatedOrganizationDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "PrdProductRelatedParty/Delete/"
                            },
                            "UnitConversionDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "PrdProductUnit/Delete/"
                            },
                            "BarcodeDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "PrdPrductBarcode/Delete/"
                            },
                            "WarehouseDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WMSProductParamsByWmsAndClient/Delete/"
                            },
                            "PickfaceDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WMSPickFace/Delete/"
                            },
                            "BOMDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "PrdProductBOM/Delete/"
                            },
                            "OrgMiscServ":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgMiscServ/FindAll",
                                "FilterID":"ORGMISC"
                            },
                            
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Product & Related Organization",
                                "Value": "Related Organization",
                                "Icon": "fa fa-users",
                                "GParentRef": "relatedorganization"
                            }, {
                                "DisplayName": "Unit Conversions",
                                "Value": "Unit Conversions",
                                "Icon": "fa fa-exchange",
                                "GParentRef": "unitconversions"
                            },{
                                "DisplayName": "Barcodes",
                                "Value": "Barcodes",
                                "Icon": "fa fa-barcode",
                                "GParentRef": "barcodes"
                            },{
                                "DisplayName": "Warehouse",
                                "Value": "Warehouse",
                                "Icon": "icomoon icon-warehouse",
                                "GParentRef": "warehouse"
                            },  {
                                "DisplayName": "BOM",
                                "Value": "BOM",
                                "Icon": "fa fa-cubes",
                                "GParentRef": "bom"
                            },{
                                "DisplayName": "Additional Details",
                                "Value": "Additional Details",
                                "Icon": "fa fa-info-circle",
                                "GParentRef": "additionaldetails"
                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "PartNum": helperService.metaBase(),
                                "Desc": helperService.metaBase(),
                                "StockKeepingUnit":helperService.metaBase(),
                                "UIOrgPartRelation":helperService.metaBase(),
                                "UIOrgPartUnit":helperService.metaBase(),
                                "UIOrgSupplierPartBarcode": helperService.metaBase(),
                                "UIWarehouse":helperService.metaBase(),
                                "UIWMSPickFace":helperService.metaBase(),
                            },
                        },
                        "CheckPoints":{
                            "Checkpointhidden":true,
                            "HideindexWarehouse":false,
                            "HideindexPickface":false,
                            "DisableSave":false,
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentProduct.data;
                _exports.Entities.Header.GetById = currentProduct.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentProduct.entity.PartNum,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentProduct.PK).then(function (response) {
              
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentProduct.PartNum]: {
                            ePage: _exports
                        },
                        label: currentProduct.PartNum,
                        code: currentProduct.PartNum,
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
                "SubModuleCode":"PRO"
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
           
            if(!_input.UIProductGeneral.PartNum || _input.UIProductGeneral.PartNum){
                OnChangeValues(_input.UIProductGeneral.PartNum,'E7010',false,undefined,$item.label);
            }
            if(!_input.UIProductGeneral.Desc || _input.UIProductGeneral.Desc){
                OnChangeValues(_input.UIProductGeneral.Desc,'E7011',false,undefined,$item.label);
            }
            if(!_input.UIProductGeneral.StockKeepingUnit || _input.UIProductGeneral.StockKeepingUnit){
                OnChangeValues(_input.UIProductGeneral.StockKeepingUnit,'E7012',false,undefined,$item.label);
            }

            // Related Organization Validation

            if(_input.UIOrgPartRelation.length==0){
                OnChangeValues(null,'E7013',false,undefined,$item.label);
            }else{
                OnChangeValues('value','E7013',false,undefined,$item.label);                
            }

            if(_input.UIOrgPartRelation.length>0){
                angular.forEach(_input.UIOrgPartRelation,function(value,key){
                    if(!value.Client || value.Client)
                    OnChangeValues(value.Client,'E7014',true,key,$item.label);

                    if(!value.Relationship || value.Relationship)
                    OnChangeValues(value.Relationship,'E7015',true,key,$item.label);

                });

            }
                //Check Duplicate
            if(_input.UIOrgPartRelation.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIOrgPartRelation.length;i++){
                    for(var j=i+1;j<_input.UIOrgPartRelation.length;j++){
                        if(_input.UIOrgPartRelation[i].Client && _input.UIOrgPartRelation[i].Relationship && !finishloop){
                            if(_input.UIOrgPartRelation[i].Client == _input.UIOrgPartRelation[j].Client &&_input.UIOrgPartRelation[i].Relationship == _input.UIOrgPartRelation[j].Relationship){
                                OnChangeValues(null,'E7002',true,i,$item.label);
                                OnChangeValues(null,'E7002',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            
            //Unit conversions
            if(_input.UIOrgPartUnit.length>0){
                angular.forEach(_input.UIOrgPartUnit,function(value,key){
                    if(!value.QuantityInParent || value.QuantityInParent)
                    OnChangeValues(value.QuantityInParent,'E7017',true,key,$item.label);

                    if(!value.ParentPackType || value.ParentPackType)
                    OnChangeValues(value.ParentPackType,'E7019',true,key,$item.label);

                    if(!value.PackType || value.PackType)
                    OnChangeValues(value.PackType,'E7020',true,key,$item.label);

                    if(value.QuantityInParent == '0')
                    OnChangeValues(null,'E7018',true,key,$item.label);
                    else
                    OnChangeValues('value','E7018',true,key,$item.label);

                    if(value.ParentPackType == value.PackType && value.ParentPackType && value.PackType){
                        OnChangeValues(null,'E7021',true,key,$item.label);
                        OnChangeValues(null,'E7022',true,key,$item.label);
                    }else{
                        OnChangeValues('value','E7021',true,key,$item.label);
                        OnChangeValues('value','E7022',true,key,$item.label);
                    }
                });
            }

             //Check Duplicate
             if(_input.UIOrgPartUnit.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIOrgPartUnit.length;i++){
                    for(var j=i+1;j<_input.UIOrgPartUnit.length;j++){
                        if(_input.UIOrgPartUnit[i].PackType && _input.UIOrgPartUnit[i].ParentPackType && !finishloop){
                            if(_input.UIOrgPartUnit[i].PackType == _input.UIOrgPartUnit[j].PackType &&_input.UIOrgPartUnit[i].ParentPackType == _input.UIOrgPartUnit[j].ParentPackType){
                                OnChangeValues(null,'E7004',true,i,$item.label);
                                OnChangeValues(null,'E7004',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //Barcode validation

            if(_input.UIOrgSupplierPartBarcode.length>0){
                angular.forEach(_input.UIOrgSupplierPartBarcode,function(value,key){
                    if(!value.PAC_NKPackType || value.PAC_NKPackType)
                    OnChangeValues(value.PAC_NKPackType,'E7023',true,key,$item.label);

                    if(!value.Barcode || value.Barcode)
                    OnChangeValues(value.Barcode,'E7024',true,key,$item.label);
                });
            }

            //Check Duplicate
            if(_input.UIOrgSupplierPartBarcode.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIOrgSupplierPartBarcode.length;i++){
                    for(var j=i+1;j<_input.UIOrgSupplierPartBarcode.length;j++){
                        if(_input.UIOrgSupplierPartBarcode[i].Barcode && !finishloop){
                            if(_input.UIOrgSupplierPartBarcode[i].Barcode == _input.UIOrgSupplierPartBarcode[j].Barcode){
                                OnChangeValues(null,'E7009',true,i,$item.label);
                                OnChangeValues(null,'E7009',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //Product Warehouse Validation
            if(_input.UIWarehouse.length>0){
                angular.forEach(_input.UIWarehouse,function(value,key){
                    if(!value.Client || value.Client)
                    OnChangeValues(value.Client,'E7025',true,key,$item.label);

                    if(!value.Warehouse || value.Warehouse)
                    OnChangeValues(value.Warehouse,'E7026',true,key,$item.label);
                });
            }
            //Check Duplicate
            if(_input.UIWarehouse.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWarehouse.length;i++){
                    for(var j=i+1;j<_input.UIWarehouse.length;j++){
                        if(_input.UIWarehouse[i].Client && _input.UIWarehouse[i].Warehouse  && !finishloop){
                            if(_input.UIWarehouse[i].Client == _input.UIWarehouse[j].Client && _input.UIWarehouse[i].Warehouse == _input.UIWarehouse[j].Warehouse){
                                OnChangeValues(null,'E7030',true,i,$item.label);
                                OnChangeValues(null,'E7030',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //PickFace Validation
            if(_input.UIWMSPickFace.length>0){
                angular.forEach(_input.UIWMSPickFace,function(value,key){
                    if(!value.Client || value.Client)
                    OnChangeValues(value.Client,'E7027',true,key,$item.label);

                    if(!value.Warehouse || value.Warehouse)
                    OnChangeValues(value.Warehouse,'E7028',true,key,$item.label);

                    if(!value.Location || value.Location)
                    OnChangeValues(value.Warehouse,'E7029',true,key,$item.label);

                    if(!value.ReplenishMinimum || value.ReplenishMinimum)
                    OnChangeValues(value.ReplenishMinimum,'E7033',true,key,$item.label);

                    if(!value.ReplenishMaximum || value.ReplenishMaximum)
                    OnChangeValues(value.ReplenishMaximum,'E7034',true,key,$item.label);
                });
            }

            //Check Duplicate
            if(_input.UIWMSPickFace.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWMSPickFace.length;i++){
                    for(var j=i+1;j<_input.UIWMSPickFace.length;j++){
                        if(_input.UIWMSPickFace[i].Client && _input.UIWMSPickFace[i].Warehouse && _input.UIWMSPickFace[i].Location && !finishloop){
                            if(_input.UIWMSPickFace[i].Client == _input.UIWMSPickFace[j].Client && _input.UIWMSPickFace[i].Warehouse == _input.UIWMSPickFace[j].Warehouse && _input.UIWMSPickFace[i].Location == _input.UIWMSPickFace[j].Location){
                                OnChangeValues(null,'E7031',true,i,$item.label);
                                OnChangeValues(null,'E7031',true,j,$item.label);
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
    }
})();



