(function () {
    "use strict";

    angular
        .module("Application")
        .factory('organizationConfig', OrganizationConfig);

    OrganizationConfig.$inject = ["$q", "helperService", "toastr"];

    function OrganizationConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {},
                },
                "API": {
                    "Org": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "Org/GetById/"
                            },
                            "OrganizationActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "Org/OrganizationActivityClose/"
                            },
                        }
                    },
                    "CfxTypes": {
                        "RowIndex": -1,
                        "API": {
                            "DynamicFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cfxtypes/DynamicFindAll/",
                                "FilterID": "CFXTYPE"
                            }
                        }
                    },
                    "CfxMenus": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/FindAll",
                                "FilterID": "CFXMENU"
                            }
                        }
                    },
                    "MstCountry": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "MstCountry/FindAll",
                                "FilterID": "MSTCOUN"
                            }
                        }
                    },
                    "CountryState": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CountryState/FindAll",
                                "FilterID": "MSTCSTE"
                            }
                        }
                    },
                    "OrgAddress": {
                        "RowIndex": -1,
                        "API": {
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgAddress/Delete/"
                            }
                        }
                    },
                    "OrgContact": {
                        "RowIndex": -1,
                        "API": {
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgContact/Delete/"
                            }
                        }
                    },
                    "SecTenant": {
                        "RowIndex": -1,
                        "API": {
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/Insert"
                            },
                            "CopyBaseTenantBehavior": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/CopyBaseTenantBehavior",
                                "FilterID": "SECTENA"
                            }
                        }
                    },
                    "SecAppSecTenant": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecAppSecTenant/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecAppSecTenant/Insert"
                            }
                        }
                    },
                    "SecParties": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecParties/FindAll",
                                "FilterID": "SECPART"
                            }
                        }
                    },
                    "SecRole": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecRole/FindAll",
                                "FilterID": "SECROLE"
                            }
                        }
                    },
                    "UserExtended": {
                        "RowIndex": -1,
                        "API": {
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserExtended/Insert"
                            }
                        }
                    },
                    "UserRole": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserRole/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserRole/Insert",
                            }
                        }
                    },
                    "GroupEventTypeOrganisation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupEventTypeOrganisation/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupEventTypeOrganisation/Insert",
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupEventTypeOrganisation/Update",
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "GroupEventTypeOrganisation/Delete/",
                            }
                        }
                    },
                    "GroupRoleEventTypeOrganisation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRoleEventTypeOrganisation/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRoleEventTypeOrganisation/Insert",
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRoleEventTypeOrganisation/Update",
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "GroupRoleEventTypeOrganisation/Delete/",
                            }
                        }
                    },
                    "GroupTaskTypeOrganisation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupTaskTypeOrganisation/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupTaskTypeOrganisation/Insert",
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupTaskTypeOrganisation/Update",
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "GroupTaskTypeOrganisation/Delete/",
                            }
                        }
                    },
                    "GroupRoleTaskTypeOrganisation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRoleTaskTypeOrganisation/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRoleTaskTypeOrganisation/Insert",
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRoleTaskTypeOrganisation/Update",
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "GroupRoleTaskTypeOrganisation/Delete/",
                            }
                        }
                    },
                    "SecMappings": {
                        "RowIndex": -1,
                        "API": {
                            "GetRoleByUserApp": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/GetRoleByUserApp",
                                "FilterID": "SECMAPP"
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/FindAll",
                                "FilterID": "SECMAPP"
                            }
                        }
                    },
                    "EventGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EventGroup/FindAll",
                                "FilterID": "EVEGR"
                            }
                        }
                    },
                    "EventGroupMapping": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EventGroupMapping/FindAll",
                                "FilterID": "EVGRMA"
                            }
                        }
                    },
                    "OrgEventGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventGroup/FindAll",
                                "FilterID": "OREVGR"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventGroup/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventGroup/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventGroup/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgEventGroup/Delete/"
                            }
                        }
                    },
                    "OrgEventEmailContacts": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventEmailContacts/FindAll",
                                "FilterID": "OREEMC"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventEmailContacts/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventEmailContacts/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventEmailContacts/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgEventEmailContacts/Delete/"
                            }
                        }
                    },
                    "OrgEventTask": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventTask/FindAll",
                                "FilterID": "ORGEVTA"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventTask/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventTask/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEventTask/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgEventTask/Delete/"
                            }
                        }
                    },
                    "EBPMProcessMaster": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "EBPMProcessMaster/FindAll",
                                "FilterID": "BPMPSM"
                            }
                        }
                    },
                    "EntitiesMapping": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EntitiesMapping/FindAll",
                                "FilterID": "ENTIMAP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EntitiesMapping/Insert"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "EntitiesMapping/Delete/"
                            }
                        }
                    },
                    "EBPMWorkStepInfo": {
                        "RowIndex": -1,
                        "API": {
                            "DynamicFindAll": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepInfo/DynamicFindAll",
                                "FilterID": "BPMWSI"
                            }
                        }
                    },
                    "EntitiesMappingDetail": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EntitiesMappingDetail/FindAll",
                                "FilterID": "ENMAPDE"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EntitiesMappingDetail/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EntitiesMappingDetail/Insert"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "EntitiesMappingDetail/Delete/"
                            }
                        }
                    },
                    "CmpCompany": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CmpCompany/FindAll",
                                "FilterID": "CMPCOMP"
                            }
                        }
                    },
                    "CmpBranch": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CmpBranch/FindAll",
                                "FilterID": "CMPBRAN"
                            }
                        }
                    },
                    "CmpDepartment": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CmpDepartment/FindAll",
                                "FilterID": "CMPDEPT"
                            }
                        }
                    },
                    "OrgCompanyData": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgCompanyData/FindAll",
                                "FilterID": "ORGCDTA"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgCompanyData/Delete/"
                            }
                        }
                    },
                    "OrgEmployeeAssignments": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEmployeeAssignments/FindAll",
                                "FilterID": "ORGSASS"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgEmployeeAssignments/Delete/"
                            }
                        }
                    },
                    "MstDebtorGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstDebtorGroup/FindAll",
                                "FilterID": "MSTDEGP",
                            }
                        }
                    },
                    "MstCreditorGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstCreditorGroup/FindAll",
                                "FilterID": "MSTCEGP",
                            }
                        }
                    },
                    "OrgCompanyData": {
                        "RowIndex": -1,
                        "API": {
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgCompanyData/Delete/"
                            }
                        }
                    },
                    "MstCurrency": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstCurrency/FindAll",
                                "FilterID": "MSTCURR"
                            }
                        }
                    },
                    "MstCommentType": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstCommentType/FindAll",
                                "FilterID": "MSTCMDT"
                            }
                        }
                    },
                    "DocTypeMaster": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DocTypeMaster/FindAll",
                                "FilterID": "MSTDOCT"
                            }
                        }
                    },
                    "MstExceptionType": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstExceptionType/FindAll",
                                "FilterID": "MSTEXCE"
                            }
                        }
                    },
                    "MstEmailType": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "MstEmailType/FindAll",
                                "FilterID": "MSTMAIL"
                            }
                        }
                    },
                    "OrgRefDate": {
                        "RowIndex": -1,
                        "API": {
                            "Delete": {
                                "IsAPI": true,
                                "Url": "OrgRefDate/Delete/"
                            }
                        }
                    },
                    "WmsInventory": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            }
                        }
                    },
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentOrganization, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
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
                            }
                        },
                        "Meta": {},
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
                var _code = currentOrganization.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentOrganization.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.Org.API.GetById.Url, currentOrganization.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var _code = currentOrganization.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentOrganization.Code,
                        code: _code,
                        pk: currentOrganization.PK,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }
    }

})();
