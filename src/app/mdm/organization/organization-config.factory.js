(function () {
    "use strict";

    angular
        .module("Application")
        .factory('organizationConfig', OrganizationConfig);

    OrganizationConfig.$inject = ["$q", "apiService", "helperService", "toastr"];

    function OrganizationConfig($q, apiService, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "Org/GetById/",
                            "FilterID": "ORGLIST"
                        },
                        "Validationapi": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        },
                        "OrganizationActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "Org/OrganizationActivityClose/",
                        }
                    },
                    "Meta": {},
                },
                "Message": false
            },
            "TabList": [],
            "ValidationValues": [],
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "RemoveApiErrors": RemoveApiErrors,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
            "refreshgrid": refreshgrid,
        };
        return exports;

        function GetTabDetails(currentOrganization, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "InsertOrganization": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Org/Insert"
                            },
                            "UpdateOrganization": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Org/Update"
                            },
                            "MiscService": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgMiscServ/FindAll",
                                "FilterID": "ORGMISC"
                            },
                            "Validationapi": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Validation/FindAll",
                                "FilterID": "VALIDAT"
                            },
                        },
                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "Code": helperService.metaBase(),
                                "FullName": helperService.metaBase(),
                                "Address1": helperService.metaBase(),
                                "City": helperService.metaBase(),
                                "RelatedPortCode": helperService.metaBase(),
                                "PostCode": helperService.metaBase(),
                                "Language": helperService.metaBase(),
                                "ContactName": helperService.metaBase(),
                                "JobCategory": helperService.metaBase(),
                                "CMP_FK": helperService.metaBase(),
                                "BRN_ControllingBranch": helperService.metaBase(),
                                "Title": helperService.metaBase(),
                                "State": helperService.metaBase(),
                                "CMP_Name": helperService.metaBase(),
                                "AddressType": helperService.metaBase(),
                                "OAD_Address1": helperService.metaBase(),
                                "WarehouseCode": helperService.metaBase(),
                                "CountryCode": helperService.metaBase(),
                                "RelatedParty_PK": helperService.metaBase(),
                                "IMPartAttrib1Name": helperService.metaBase(),
                                "IMPartAttrib2Name": helperService.metaBase(),
                                "IMPartAttrib3Name": helperService.metaBase(),
                                "IMPartAttrib1Type": helperService.metaBase(),
                                "IMPartAttrib2Type": helperService.metaBase(),
                                "IMPartAttrib3Type": helperService.metaBase()
                            },
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa fa-plane",
                                "GParentRef": 'general'
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa fa-map-marker",
                                "GParentRef": "address"
                            }, {
                                "DisplayName": "Contact",
                                "Value": "Contact",
                                "Icon": "fa fa-user",
                                "GParentRef": "contact"
                            }, {
                                "DisplayName": "Company",
                                "Value": "Company",
                                "Icon": "fa fa-building-o",
                                "GParentRef": "company"
                            }, {
                                "DisplayName": "Employee",
                                "Value": "Employee",
                                "Icon": "fa fa-users",
                                "GParentRef": "Employee"
                            }, {
                                "DisplayName": "RelatedParties",
                                "Value": "RelatedParties",
                                "Icon": "fa fa-user",
                                "GParentRef": "RelatedParty"
                            }, {
                                "DisplayName": "Warehouse",
                                "Value": "Warehouse",
                                "Icon": "fa fa-cubes",
                                "GParentRef": "Miscserv"
                            }, {
                                "DisplayName": "Consignee",
                                "Value": "Consignee",
                                "Icon": "fa fa-user",
                                "GParentRef": "Consignee"
                            }, {
                                "DisplayName": "Consignor",
                                "Value": "Consignor",
                                "Icon": "fa fa-user",
                                "GParentRef": "Consignor"
                            }, {
                                "DisplayName": "Visibility",
                                "Value": "Visibility",
                                "Icon": "fa fa-eye",
                                "GParentRef": "Visibility"
                            }]
                        },
                        "SupplierHeader": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "JobCharge/FindAll",
                                    "FilterID": "JOBCHAR"
                                }
                            },
                            "Meta": {},
                            "gridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": true,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "columnDef": [{
                                    "field": "Supplier_Code",
                                    "displayName": "Supplier Code"
                                }, {
                                    "field": "SupplierName",
                                    "displayName": "Supplier Name"
                                }, {
                                    "field": "SFUSourceDate",
                                    "displayName": "SFU Source Date"
                                }, {
                                    "field": "ThresoldTime",
                                    "displayName": "ThresoldTime"
                                }, {
                                    "field": "IsActive",
                                    "displayName": "Is Active"
                                }, {
                                    "field": "SFULineItem",
                                    "displayName": "SFU Line Item"
                                }, {
                                    "field": "SFUWeekDay",
                                    "displayName": "SFUWeekDay"
                                }]
                            }
                        },
                        "ModeDetails": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "JobCharge/FindAll",
                                    "FilterID": "JOBCHAR"
                                }
                            },
                            "Meta": {},
                            "gridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": true,
                                "isDelete": true,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "columnDef": [{
                                    "field": "TransportMode",
                                    "displayName": "Mode",
                                    "width": 100,
                                    "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",
                                }, {
                                    "field": "ContainerMode",
                                    "width": 100,
                                    "displayName": "Cnt.Mode"
                                }, {
                                    "field": "IncoTerm",
                                    "width": 100,
                                    "displayName": "INCO"
                                }, {
                                    "field": "DefaultServiceLevel",
                                    "width": 100,
                                    "displayName": "Service Level"
                                }, {
                                    "field": "IsOverrideDeliveryDays",
                                    "width": 100,
                                    "displayName": "Override Delivery"
                                }, {
                                    "field": "IsOverrideDeliveryDays",
                                    "width": 100,
                                    "displayName": "Div.Days"
                                }, {
                                    "field": "NoOfOriginalBills",
                                    "width": 100,
                                    "displayName": "Original Bills"
                                }, {
                                    "field": "NoOfCopyBills",
                                    "width": 100,
                                    "displayName": "Copy Bills"
                                }, {
                                    "field": "PlaceOfDeliveryPort",
                                    "width": 100,
                                    "displayName": "Load Port"
                                }, {
                                    "field": "OriginPort",
                                    "width": 100,
                                    "displayName": "Origin Port"
                                }, {
                                    "field": "PickUpAddress",
                                    "width": 100,
                                    "displayName": "PickUp Address"
                                }, {
                                    "field": "PickUpCtct",
                                    "width": 100,
                                    "displayName": "PickUp Ctct."
                                }, {
                                    "field": "PickUpPTrm",
                                    "width": 100,
                                    "displayName": "PickUp P.Trm."
                                }, {
                                    "field": "PlaceOfReceivalPort",
                                    "width": 100,
                                    "displayName": "Discharge"
                                }, {
                                    "field": "Destiation",
                                    "width": 100,
                                    "displayName": "Origin Port"
                                }, {
                                    "field": "DeliveryAddress",
                                    "width": 100,
                                    "displayName": "DlryAddress"
                                }, {
                                    "field": "DeliveryContact",
                                    "width": 100,
                                    "displayName": "DlryCtct"
                                }, {
                                    "field": "Deliveryp_Term",
                                    "width": 100,
                                    "displayName": "Dlv.P.Trm"
                                }, {
                                    "field": "NotifyParty",
                                    "width": 100,
                                    "displayName": "NotifyParty"
                                }]
                            }
                        },
                        "DocumentTracking": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "JobCharge/FindAll",
                                    "FilterID": "JOBCHAR"
                                }
                            },
                            "Meta": {},
                            "gridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": true,
                                "isDelete": true,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "columnDef": [{
                                    "field": "Catagory",
                                    "displayName": "Catagory",
                                    "width": 100
                                }, {
                                    "field": "Type",
                                    "displayName": "Type",
                                    "width": 100
                                }, {
                                    "field": "Description",
                                    "displayName": "Description",
                                    "width": 200
                                }, {
                                    "field": "Period",
                                    "displayName": "Period",
                                    "width": 100
                                }, {
                                    "field": "DateReceived",
                                    "displayName": "Date Received",
                                    "width": 100
                                }, {
                                    "field": "ValidToDate",
                                    "displayName": "Valid To Date",
                                    "width": 100
                                }, {
                                    "field": "DocNum",
                                    "displayName": "Doc.Num",
                                    "width": 100
                                }, {
                                    "field": "Usage",
                                    "displayName": "Usage",
                                    "width": 100
                                }, {
                                    "field": "Country",
                                    "displayName": "Country",
                                    "width": 100
                                }, {
                                    "field": "OriginalReq",
                                    "displayName": "Original Req.",
                                    "width": 100
                                }, {
                                    "field": "CreditControl",
                                    "displayName": "Credit Control",
                                    "width": 100
                                }, {
                                    "field": "DocOwner",
                                    "displayName": "Doc Owner",
                                    "width": 100
                                }]
                            }
                        },
                        "OrgBuyerSupplierMappingDeatils": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgBuyerSupplierMapping/FindAll",
                                    "FilterID": "ORGBSMAP"
                                },
                                "GetByID": {
                                    "IsAPI": "true",
                                    "HttpType": "GET",
                                    "Url": "OrgConsigneeConsignorRelationship/GetById/",
                                    "FilterID": ""
                                },
                                "Insert": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgConsigneeConsignorRelationship/Insert",
                                    "FilterID": ""
                                },
                                "Update": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgConsigneeConsignorRelationship/Update",
                                    "FilterID": ""
                                }
                            },
                            "Meta": {},
                            "gridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": true,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "columnDef": [{
                                    "field": "ORG_SupplierCode",
                                    "displayName": "Code",
                                    "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",
                                    "width": 100
                                }, {
                                    "field": "UNLOCO",
                                    "displayName": "UNLOCO",
                                    "width": 100
                                }, {
                                    "field": "ImporterCountry",
                                    "displayName": "Imp. Ctry",
                                    "width": 100
                                }, {
                                    "field": "Currency",
                                    "displayName": "Currency",
                                    "width": 50
                                }, {
                                    "field": "InitialShipmentExpectedDate",
                                    "displayName": "1st Ship",
                                    "cellTemplate": "<div>{{x[y.field] | date:'dd-MMM-yyyy'}}</div>",
                                    "width": 100
                                }, {
                                    "field": "ValuationBasis",
                                    "displayName": "Valuation Basis",
                                    "width": 100
                                }, {
                                    "field": "IsRelatedParty",
                                    "displayName": "Transfer Related",
                                    "cellTemplate": "<div><span ng-show='x[y.field]'>Yes-Related</span><span ng-show='!x[y.field]'>No-Unrelated</span></div>",
                                    "width": 100
                                }, {
                                    "field": "AuthorityToLeave",
                                    "displayName": "ATL",
                                    "width": 50
                                }]
                            }
                        },
                        "OrgSupplierBuyerMappingDeatils": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgBuyerSupplierMapping/FindAll",
                                    "FilterID": "ORGBSMAP"
                                },
                                "GetByID": {
                                    "IsAPI": "true",
                                    "HttpType": "GET",
                                    "Url": "OrgConsigneeConsignorRelationship/GetById/",
                                    "FilterID": ""
                                },
                                "Insert": {
                                    "IsAPI": "true",
                                    "HttpType": "GET",
                                    "Url": "OrgConsigneeConsignorRelationship/Insert",
                                    "FilterID": ""
                                },
                                "Update": {
                                    "IsAPI": "true",
                                    "HttpType": "GET",
                                    "Url": "OrgConsigneeConsignorRelationship/Update",
                                    "FilterID": ""
                                }
                            },
                            "Meta": {},
                            "gridConfig": {
                                "isHeader": false,
                                "isSearch": false,
                                "title": "User Details",
                                "isSorting": false,
                                "isColumnHeader": true,
                                "isEdit": true,
                                "isDelete": false,
                                "isPagination": false,
                                "itemsPerPage": 10,
                                "isRowTemplate": false,
                                "columnDef": [{
                                    "field": "ORG_BuyerCode",
                                    "displayName": "Code",
                                    "cellTemplate": "<a class='text-single-line' href='javascript:void(0);' ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"Link\")'>{{x[y.field]}}</a>",
                                    "width": 100
                                }, {
                                    "field": "UNLOCO",
                                    "displayName": "UNLOCO",
                                    "width": 100
                                }, {
                                    "field": "ImporterCountry",
                                    "displayName": "Imp. Ctry",
                                    "width": 100
                                }, {
                                    "field": "Currency",
                                    "displayName": "Currency",
                                    "width": 100
                                }, {
                                    "field": "InitialShipmentExpectedDate",
                                    "displayName": "1st Ship",
                                    "cellTemplate": "<div>{{x[y.field] | date:'dd-MMM-yyyy'}}</div>",
                                    "width": 100
                                }, {
                                    "field": "ValuationBasis",
                                    "displayName": "Valuation Basis",
                                    "width": 120
                                }, {
                                    "field": "IsRelatedParty",
                                    "displayName": "Transfer Related",
                                    "cellTemplate": "<div><span ng-show='x[y.field]'>Yes-Related</span><span ng-show='!x[y.field]'>No-Unrelated</span></div>",
                                    "width": 150
                                }, {
                                    "field": "AuthorityToLeave",
                                    "displayName": "ATL",
                                    "width": 50
                                }]
                            }
                        },
                        "ConsignorFollowUpConfig": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgMiscServ/FindAll",
                                    "FilterID": "ORGMISC"
                                },
                                "Upsert": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgMiscServ/Update",
                                    "FilterID": "ORGMISC"
                                },
                                "Insert": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgMiscServ/Insert",
                                    "FilterID": "ORGMISC"
                                }
                            },
                            "Meta": {}
                        },
                        "OrgBuySupMappingTrnMode": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "Delete": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgBuySupMappingTrnMode/Delete",
                                    "FilterID": "ORGBSTRN"
                                },
                                "Update": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgBuySupMappingTrnMode/Update",
                                    "FilterID": "ORGBSTRN"
                                },
                                "Insert": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgBuySupMappingTrnMode/Insert",
                                    "FilterID": "ORGBSTRN"
                                },
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "OrgBuySupMappingTrnMode/FindAll",
                                    "FilterID": "ORGBSTRN"
                                }
                            },
                            "Meta": {}
                        },
                        "JobRequiredDocument": {
                            "Data": {},
                            "ListSource": [],
                            "RowIndex": -1,
                            "API": {
                                "Delete": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "JobRequiredDocument/Delete",
                                    "FilterID": "JOBREQU"
                                },
                                "Update": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "JobRequiredDocument/Update",
                                    "FilterID": "JOBREQU"
                                },
                                "Insert": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "JobRequiredDocument/Insert",
                                    "FilterID": "JOBREQU"
                                },
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "JobRequiredDocument/FindAll",
                                    "FilterID": "JOBREQU"
                                }
                            },
                            "Meta": {},
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentOrganization.data;
                _exports.Entities.Header.GetById = currentOrganization.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentOrganization.entity.Code,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetById.Url, currentOrganization.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;
                    var obj = {
                        [currentOrganization.Code]: {
                            ePage: _exports
                        },
                        label: currentOrganization.Code,
                        code: currentOrganization.Code,
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

                        // if (IsAlert) {
                        //     toastr.warning(Code, Message);
                        // }
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

                        // if (IsAlert) {
                        //     toastr.error(Code, Message);
                        // }
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
            if (EntityObject.label) {
                $("#errorWarningContainer" + EntityObject.label).toggleClass("open");
            } else if (EntityObject.label == "") {
                $("#errorWarningContainer" + EntityObject.label).toggleClass("open");
            } else if (EntityObject.Header.Data.OrgHeader) {
                $("#errorWarningContainer" + EntityObject.Header.Data.OrgHeader.Code).toggleClass("open");
            } else if (EntityObject.OrgHeader) {
                $("#errorWarningContainer" + EntityObject.OrgHeader.Code).toggleClass("open");
            }
        }

        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode": "ORG"
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

        function GeneralValidation($item, Type, index) {
            var _Data = $item.Entities,
                _input = _Data.Header.Data;
            if (Type == 'OrgHeader') {
                if (!_input.OrgHeader.FullName || _input.OrgHeader.FullName) {
                    OnChangeValues(_input.OrgHeader.FullName, 'E9002', false, undefined, $item.label);
                }
                if (!_input.OrgHeader.Code || _input.OrgHeader.Code) {
                    OnChangeValues(_input.OrgHeader.Code, 'E9001', false, undefined, $item.label);
                }
                if (!_input.OrgAddress[0].Address1 || _input.OrgAddress[0].Address1) {
                    OnChangeValues(_input.OrgAddress[0].Address1, 'E9003', false, undefined, $item.label);
                }
                if (!_input.OrgAddress[0].City || _input.OrgAddress[0].City) {
                    OnChangeValues(_input.OrgAddress[0].City, 'E9004', false, undefined, $item.label);
                }
                if (!_input.OrgAddress[0].RelatedPortCode || _input.OrgAddress[0].RelatedPortCode) {
                    OnChangeValues(_input.OrgAddress[0].RelatedPortCode, 'E9005', false, undefined, $item.label);
                }
                if (!_input.OrgAddress[0].PostCode || _input.OrgAddress[0].PostCode) {
                    OnChangeValues(_input.OrgAddress[0].PostCode, 'E9006', false, undefined, $item.label);
                }
                if (!_input.OrgAddress[0].Language || _input.OrgAddress[0].Language) {
                    OnChangeValues(_input.OrgAddress[0].Language, 'E9007', false, undefined, $item.label);
                }
                if (!_input.OrgAddress[0].State || _input.OrgAddress[0].State) {
                    OnChangeValues(_input.OrgAddress[0].State, 'E9022', false, undefined, $item.label);
                }
                if (!_input.OrgAddress[0].CountryCode || _input.OrgAddress[0].CountryCode) {
                    OnChangeValues(_input.OrgAddress[0].CountryCode, 'E9031', false, undefined, $item.label);
                }
            } else if (Type == 'OrgAddress') {
                if (!_input.OrgAddress[index].Address1 || _input.OrgAddress[index].Address1) {
                    OnChangeValues(_input.OrgAddress[index].Address1, 'E9024', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgAddress[index].City || _input.OrgAddress[index].City) {
                    OnChangeValues(_input.OrgAddress[index].City, 'E9025', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgAddress[index].RelatedPortCode || _input.OrgAddress[index].RelatedPortCode) {
                    OnChangeValues(_input.OrgAddress[index].RelatedPortCode, 'E9026', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgAddress[index].PostCode || _input.OrgAddress[index].PostCode) {
                    OnChangeValues(_input.OrgAddress[index].PostCode, 'E9028', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgAddress[index].Language || _input.OrgAddress[index].Language) {
                    OnChangeValues(_input.OrgAddress[index].Language, 'E9029', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgAddress[index].State || _input.OrgAddress[index].State) {
                    OnChangeValues(_input.OrgAddress[index].State, 'E9027', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgAddress[index].CountryCode || _input.OrgAddress[index].CountryCode) {
                    OnChangeValues(_input.OrgAddress[index].CountryCode, 'E9032', false, undefined, _input.OrgHeader.Code);
                }
            } else if (Type == 'OrgContact') {
                if (!_input.OrgContact[index].ContactName || _input.OrgContact[index].ContactName) {
                    OnChangeValues(_input.OrgContact[index].ContactName, 'E9008', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgContact[index].Title || _input.OrgContact[index].Title) {
                    OnChangeValues(_input.OrgContact[index].Title, 'E9023', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgContact[index].JobCategory || _input.OrgContact[index].JobCategory) {
                    OnChangeValues(_input.OrgContact[index].JobCategory, 'E9009', false, undefined, _input.OrgHeader.Code);
                }
            } else if (Type == 'OrgCompanyData') {
                if (!_input.OrgCompanyData[index].CMP_FK || _input.OrgCompanyData[index].CMP_FK) {
                    OnChangeValues(_input.OrgCompanyData[index].CMP_FK, 'E9030', false, undefined, _input.OrgHeader.Code);
                }
                if (!_input.OrgCompanyData[index].BRN_ControllingBranch || _input.OrgCompanyData[index].BRN_ControllingBranch) {
                    OnChangeValues(_input.OrgCompanyData[index].BRN_ControllingBranch, 'E9011', false, undefined, _input.OrgHeader.Code);
                }
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
                    PushErrorWarning(value.Code, value.Message, "E", true, value.CtrlKey, label, undefined, undefined, undefined, undefined, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", true, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
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

        function refreshgrid() {
            // helperService.refreshGrid();
        }
    }

})();
