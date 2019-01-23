(function () {
    "use strict";

    angular
        .module("Application")
        .factory('trustCenterConfig', TrustCenterConfig);

    TrustCenterConfig.$inject = [];

    function TrustCenterConfig() {
        var exports = {
            "Entities": {
                "API": {
                    "UsePrivileges": {
                        "RowIndex": -1,
                        "API": {
                            "PublishPrivilegesByUser": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UsePrivileges/PublishPrivilegesByUser"
                            },
                            "AppTenantRolePublish": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UsePrivileges/AppTenantRolePublish"
                            },
                            "UserTenantRolePublish": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UsePrivileges/UserTenantRolePublish"
                            },
                            "PublishAllUsers": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UsePrivileges/PublishAllUsers",
                                "FilterID": "USEREXT"
                            }
                        }
                    },
                    "SecApp": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecApp/FindAll",
                                "FilterID": "SECAPP"
                            },
                            "FindAllAccess": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecApp/FindAllAccess",
                                "FilterID": "SECAPP"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecApp/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecApp/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecApp/Update"
                            }
                        }
                    },
                    "SecLogo": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecLogo/FindAll",
                                "FilterID": "SECLOGO"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecLogo/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecLogo/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecLogo/Delete/"
                            }
                        }
                    },
                    "MenuGroups": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MenuGroups/FindAll",
                                "FilterID": "MENUGRO"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MenuGroups/Upsert"
                            }
                        }
                    },
                    "UserExtended": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserExtended/FindAll",
                                "FilterID": "USEREXT"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserExtended/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserExtended/Update"
                            }
                        }
                    },
                    "JobDocument": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobDocument/FindAll/",
                                "FilterID": "JOBDOC"
                            },
                            "FindAllWithAccess": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobDocument/FindAllWithAccess/",
                                "FilterID": "JOBDOC"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobDocument/Insert/"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobDocument/Update/"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "JobDocument/Delete/"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobDocument/Upsert/"
                            },
                            "GetAppLogoFile": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "JobDocument/GetAppLogoFile/"
                            },
                            "GetTenantLogoFile": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "JobDocument/GetTenantLogoFile/"
                            },
                            "GetUserLogoFile": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "JobDocument/GetUserLogoFile/"
                            },
                            "TrustInsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobDocument/TrustInsert"
                            },
                            "JobDocumentDownload": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "JobDocument/DownloadFile/"
                            },
                            "DocumentTypeAccess": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobDocument/DocumentTypeAccess"
                            },
                            "AmendDocument": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "JobDocument/AmendDocument/",
                                "FilterID": "JOBDOC"
                            },
                            "DownloadExcelFile": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "JobDocument/DownloadExcelFile/"
                            }
                        }
                    },
                    "CfxTypes": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cfxtypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "DynamicFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cfxtypes/DynamicFindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "GetColumnValues": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "cfxtypes/GetColumnValues/"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cfxtypes/GetColumnValuesWithFilters/",
                                "FilterID": "CFXTYPE"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cfxtypes/Upsert/"
                            },
                            "FindAllWithParent": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cfxtypes/FindAllWithParent/",
                                "FilterID": "CFXTYPE"
                            }
                        }
                    },
                    "SecUserSession": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecUserSession/FindAll",
                                "FilterID": "SECSESU"
                            }
                        }
                    },
                    "SecOperation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecOperation/FindAll",
                                "FilterID": "SECOPER"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecOperation/GetColumnValuesWithFilters",
                                "FilterID": "SECOPER"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecOperation/Upsert"
                            }
                        }
                    },
                    "Multilingual": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "Multilingual/FindAll",
                                "FilterID": "MLTILIG"
                            },
                            "DynamicFindAll": {
                                "IsAPI": true,
                                "Url": "Multilingual/DynamicFindAll",
                                "FilterID": "MLTILIG"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "Multilingual/Upsert"
                            }
                        }
                    },
                    "AppSettings": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AppSettings/FindAll/",
                                "FilterID": "APPSETT"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AppSettings/Upsert/"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AppSettings/GetColumnValuesWithFilters/",
                                "FilterID": "APPSETT"
                            },
                            "StaredFindAll": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AppSettings/StaredFindAll/DASHBOARD/"
                            },
                            "NewGuidId": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AppSettings/NewGuidId"
                            }
                        }
                    },
                    "Validation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "Validation/FindAll",
                                "FilterID": "VALIDAT"
                            },
                            "DynamicFindAll": {
                                "ISAPI": true,
                                "Url": "Validation/DynamicFindAll",
                                "FilterID": "VALIDAT"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "Validation/Upsert"
                            },
                            "ValidationByGroup": {
                                "IsAPI": true,
                                "Url": "Validation/ValidationByGroup",
                                "FilterID": "ENTIMAP"
                            }
                        }
                    },
                    "ValidationGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "ValidationGroup/FindAll",
                                "FilterID": "VADATGRO"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "ValidationGroup/Upsert"
                            }
                        }
                    },
                    "ComFilterGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComFilterGroup/FindAll",
                                "FilterID": "FILTERG"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComFilterGroup/Upsert"
                            }
                        }
                    },
                    "ComFilterList": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComFilterList/FindAll",
                                "FilterID": "FILTERL"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComFilterList/Upsert"
                            }
                        }
                    },
                    "EventMaster": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "Url": "EventMaster/FindAll",
                                "FilterID": "EVEMA"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "Url": "EventMaster/Upsert",
                            }
                        }
                    },
                    "EventGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindLookup": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DataEntry/Dynamic/FindLookup",
                                "FilterID": "EVEGRP",
                                "DBObjectName": "EventGroup"
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EventGroup/FindAll",
                                "FilterID": "EVEGR"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EventGroup/Upsert"
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
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EventGroupMapping/Upsert"
                            }
                        }
                    },
                    "DataConfig": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfig/FindAll",
                                "FilterID": 'DATACOF'
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfig/Upsert"
                            },
                            "Insert": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfig/Insert"
                            },
                            "Update": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfig/Update"
                            },
                            "Delete": {
                                "IsAPI": true,
                                "HttpType": "GET",
                                "Url": "DataConfig/Delete/"
                            }
                        }
                    },
                    "DataConfigFields": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfigFields/FindAll",
                                "FilterID": 'DACONF'
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfigFields/Upsert"
                            },
                            "Delete": {
                                "IsAPI": true,
                                "HttpType": "GET",
                                "Url": "DataConfigFields/Delete/"
                            },
                            "Insert": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfigFields/Insert"
                            },
                            "Update": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "DataConfigFields/Update"
                            }
                        }
                    },
                    "TableColumn": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "TableColumn/FindAll",
                                "FilterID": "TABLECOL"
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
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "Url": "MstEmailType/Upsert"
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
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "Url": "MstCommentType/Upsert",
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
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "Url": "DocTypeMaster/Upsert",
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
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "Url": "MstExceptionType/Upsert",
                            }
                        }
                    },
                    "EBPMCFXTypes": {
                        "RowIndex": -1,
                        "API": {
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EBPMCFXTypes/Upsert",
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EBPMCFXTypes/FindAll",
                                "FilterID": "BPMCFT"
                            },
                            "ActivityFindAll": {
                                "IsAPI": true,
                                "Url": "EBPMCFXTypes/ActivityFindAll",
                                "FilterID": "BPMCFT"
                            }
                        }
                    },
                    "CfxMenus": {
                        "RowIndex": -1,
                        "API": {
                            "FindAllMenuWise": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/FindAllMenuWise",
                                "FilterID": "CFXMENU"
                            },
                            "MasterFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/MasterFindAll",
                                "FilterID": "CFXMENU"
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/FindAll",
                                "FilterID": "CFXMENU"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/Upsert"
                            },
                            "MasterCascadeFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/MasterCascadeFindAll",
                                "FilterID": "CFXMENU"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMenus/GetColumnValuesWithFilters",
                                "FilterID": "CFXMENU"
                            }
                        }
                    },
                    "DataEntryMaster": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DataEntryMaster/FindAll",
                                "FilterID": "DYNDAT"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DataEntryMaster/GetColumnValuesWithFilters",
                                "FilterID": "DYNDAT"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DataEntryMaster/Upsert"
                            }
                        }
                    },
                    "DataEntryDetails": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "Url": "DataEntryDetails/GetById/"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "Url": "DataEntryDetails/Upsert"
                            }
                        }
                    },
                    "UserSettings": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserSettings/FindAll/",
                                "FilterID": "USRSETT"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserSettings/Upsert/"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserSettings/GetColumnValuesWithFilters/",
                                "FilterID": "USRSETT"
                            }
                        }
                    },
                    "SecLoginHistory": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecLoginHistory/FindAll",
                                "FilterID": "SECLOGI"
                            }
                        }
                    },
                    "SecSessionActivity": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecSessionActivity/FindAll",
                                "FilterID": "SECSESS"
                            }
                        }
                    },
                    "NLog": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "NLog/FindAll",
                                "FilterID": "NLOG"
                            }
                        }
                    },
                    "ElmahError": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ElmahError/FindAll",
                                "FilterID": "ELMAHERR"
                            }
                        }
                    },
                    "TenantUserSettings": {
                        "RowIndex": -1,
                        "API": {
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TenantUserSettings/Upsert",
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TenantUserSettings/FindAll",
                                "FilterID": "TENUSST"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TenantUserSettings/Insert",
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TenantUserSettings/Update",
                            },
                            "UpdateDefault": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TenantUserSettings/UpdateDefault",
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
                                "FilterID": "CMPCOMP",
                                "DBObjectName": "CmpCompany"
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
                                "FilterID": "CMPBRAN",
                                "DBObjectName": "CmpBranch"
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
                                "FilterID": "CMPDEPT",
                                "DBObjectName": "CmpDepartment"
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
                    "SecMappings": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/GetColumnValuesWithFilters",
                                "FilterID": "SECMAPP"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/Upsert"
                            },
                            "GetPartiesByUserName": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecMappings/GetPartiesByUserName/"
                            },
                            "GetRoleByUserName": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecMappings/GetRoleByUserName/"
                            },
                            "ListPKDelete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecMappings/ListPKDelete/"
                            },
                            "FindAllTenantByUser": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/FindAllTenantByUser",
                                "FilterID": "SECMAPP"
                            },
                            "UpsertUserWithRole": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/UpsertUserWithRole"
                            },
                            "GetPartiesByUserApp": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/GetPartiesByUserApp",
                                "FilterID": "SECMAPP"
                            },
                            "GetRoleByUserApp": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecMappings/GetRoleByUserApp",
                                "FilterID": "SECMAPP"
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
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecParties/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecParties/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecParties/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecParties/Delete/"
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
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecRole/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecRole/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecRole/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecRole/Delete/"
                            }
                        }
                    },
                    "TypeMaster": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TypeMaster/FindAll",
                                "FilterID": "DYN_TYP"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TypeMaster/GetColumnValuesWithFilters",
                                "FilterID": "DYN_TYP"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TypeMaster/Upsert"
                            }
                        }
                    },
                    "EntityMaster": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "Url": "EntityMaster/FindAll",
                                "FilterID": "DYN_ENT"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "Url": "EntityMaster/Upsert"
                            }
                        }
                    },
                    "FieldMaster": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "FieldMaster/FindAll",
                                "FilterID": "DYN_FIE"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "FieldMaster/Upsert",
                                "FilterID": ""
                            }
                        }
                    },
                    "MasterDYNDataentrymaster": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MasterDYNDataentrymaster/GetById/"
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MasterDYNDataentrymaster/FindAll",
                                "FilterID": "MADYNDAT"
                            }
                        }
                    },
                    "DYN_RelatedLookup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DYN_RelatedLookup/FindAll",
                                "FilterID": "DYNREL"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DYN_RelatedLookup/Upsert"
                            },
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DYN_RelatedLookup/GetColumnValuesWithFilters",
                                "FilterID": "DYNREL"
                            },
                            "GroupFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "DYN_RelatedLookup/GroupFindAll",
                                "FilterID": "DYNREL"
                            }
                        }
                    },
                    "Table": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "Table/FindAll",
                                "FilterID": "TABLENAM"
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
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "EBPMProcessMaster/Upsert"
                            },
                            "ProcessTypeAccess": {
                                "IsAPI": true,
                                "Url": "EBPMProcessMaster/ProcessTypeAccess"
                            }
                        }
                    },
                    "WmsWarehouse": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWarehouse/FindAll",
                                "FilterID": "WMSWARH"
                            }
                        }
                    },
                    "OrgHeader": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgHeader/GetById/"
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeader/FindAll",
                                "FilterID": "ORGHEAD"
                            },
                            "MasterFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeader/MasterFindAll",
                                "FilterID": "ORGHEAD"
                            }
                        }
                    },
                    "EBPMProcessScenario": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "EBPMProcessScenario/FindAll",
                                "FilterID": "BPMPSS"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "EBPMProcessScenario/Upsert"
                            },
                            "Insert": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "EBPMProcessScenario/Insert"
                            },
                            "Update": {
                                "IsAPI": true,
                                "HttpType": "POST",
                                "Url": "EBPMProcessScenario/Update"
                            },
                            "Delete": {
                                "IsAPI": true,
                                "HttpType": "GET",
                                "Url": "EBPMProcessScenario/Delete/"
                            }
                        }
                    },
                    "EBPMWorkStepInfo": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepInfo/FindAll",
                                "FilterID": "BPMWSI"
                            },
                            "DynamicFindAll": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepInfo/DynamicFindAll",
                                "FilterID": "BPMWSI"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepInfo/Upsert"
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
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EntitiesMapping/Upsert"
                            }
                        }
                    },
                    "EBPMEntitiesMapping": {
                        "RowIndex": -1,
                        "API": {
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EBPMEntitiesMapping/Upsert",
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "EBPMEntitiesMapping/FindAll",
                                "FilterID": "BPMENM"
                            }
                        }
                    },
                    "EBPMWorkStepAccess": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepAccess/FindAll",
                                "FilterID": "BPMWSA"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepAccess/Upsert"
                            }
                        }
                    },
                    "EBPMWorkStepRules": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepRules/FindAll",
                                "FilterID": "BPMWSR"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepRules/Upsert"
                            }
                        }
                    },
                    "EBPMWorkStepActions": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepActions/FindAll",
                                "FilterID": "BPMSTA"
                            },
                            "Upsert": {
                                "IsAPI": true,
                                "Url": "EBPMWorkStepActions/Upsert"
                            }
                        }
                    },
                    "EBPMEngine": {
                        "RowIndex": -1,
                        "API": {
                            "InitiateProcess": {
                                "IsAPI": true,
                                "Url": "EBPMEngine/InitiateProcess",
                            },
                            "ReAssignActivity": {
                                "IsAPI": true,
                                "Url": "EBPMEngine/ReAssignActivity",
                            },
                            "StartKPI": {
                                "IsAPI": true,
                                "Url": "EBPMEngine/StartKPI",
                            },
                            "CancelKPI": {
                                "IsAPI": true,
                                "Url": "EBPMEngine/CancelKPI",
                            },
                            "MovetoCommonQue": {
                                "IsAPI": true,
                                "Url": "EBPMEngine/MovetoCommonQue",
                            },
                            "CompleteProcess": {
                                "IsAPI": true,
                                "Url": "EBPMEngine/CompleteProcess",
                            }
                        }
                    },
                    "SecTenant": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/FindAll",
                                "FilterID": "SECTENA"
                            },
                            "MasterFindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/MasterFindAll",
                                "FilterID": "SECTENA"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/Update"
                            },
                            "GetByTenant": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecTenant/GetByTenant/"
                            },
                            "CopyBaseTenantBehavior": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecTenant/CopyBaseTenantBehavior",
                                "FilterID": "SECTENA"
                            }
                        }
                    },
                    "DMS": {
                        "RowIndex": -1,
                        "API": {
                            "DMSDownload": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "DMS/DownloadFile"
                            },
                            "DMSUpload": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "DMS/Upload"
                            },
                            "DeleteFile": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "DMS/DeleteFile/"
                            },
                            "UploadExcel": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "DMS/UploadExcel"
                            },
                            "DownloadTemplate": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "DMS/DownloadTemplate/"
                            },
                            "DownloadExeclAsPDFFile": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "DMS/DownloadExeclAsPDFFile/"
                            }
                        }
                    },
                    "SecAppUrl": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecAppUrl/FindAll",
                                "FilterID": "SECAPUL"
                            },
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecAppUrl/Upsert"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecAppUrl/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecAppUrl/Update"
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
                            "GetColumnValuesWithFilters": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgEmployeeAssignments/GetColumnValuesWithFilters",
                                "FilterID": "ORGSASS"
                            }
                        }
                    },
                    "SOPTypelist": {
                        "RowIndex": -1,
                        "API": {
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SOPTypelist/Upsert",
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SOPTypelist/FindAll",
                            }
                        }
                    },
                    "CompUserRoleAccess": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CompUserRoleAccess/FindAll",
                                "FilterID": "COMURA"
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
                            "Upsert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserRole/Upsert",
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserRole/Insert",
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserRole/Update",
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "UserRole/Delete/",
                            }
                        }
                    },
                    "JobEmail": {
                        "RowIndex": -1,
                        "API": {
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobEmail/Insert"
                            }
                        }
                    },
                    "ApplicationTrust": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ApplicationTrust/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ApplicationTrust/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ApplicationTrust/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "ApplicationTrust/Delete/"
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
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "SecAppSecTenant/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "SecAppSecTenant/Delete/"
                            }
                        }
                    },
                    "UserCompanyBranchOrganisationWarehouseDepartment": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserCompanyBranchOrganisationWarehouseDepartment/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserCompanyBranchOrganisationWarehouseDepartment/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserCompanyBranchOrganisationWarehouseDepartment/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "UserCompanyBranchOrganisationWarehouseDepartment/Delete/"
                            }
                        }
                    },
                    "UserCompanyBranchWarehouse": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserCompanyBranchWarehouse/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserCompanyBranchWarehouse/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserCompanyBranchWarehouse/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "UserCompanyBranchWarehouse/Delete/"
                            }
                        }
                    },
                    "UserOrganisation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserOrganisation/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserOrganisation/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "UserOrganisation/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "UserOrganisation/Delete/"
                            }
                        }
                    },
                    "ComponentRole": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComponentRole/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComponentRole/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComponentRole/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "ComponentRole/Delete/"
                            }
                        }
                    },
                    "ComponentOrganisation": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComponentOrganisation/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComponentOrganisation/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "ComponentOrganisation/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "ComponentOrganisation/Delete/"
                            }
                        }
                    },
                    "GroupRole": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRole/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRole/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "GroupRole/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "GroupRole/Delete/"
                            }
                        }
                    },
                    "MenuRole": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MenuRole/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MenuRole/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MenuRole/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MenuRole/Delete/"
                            }
                        }
                    },
                    "Export": {
                        "RowIndex": -1,
                        "API": {
                            "AsHtml": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Export/AsHtml",
                                "FilterID": "TEST"
                            }
                        }
                    },
                    "FilterRoleApplicationTenant": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "FilterRoleApplicationTenant/FindAll",
                                "FilterID": "SECMAPP"
                            },
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "FilterRoleApplicationTenant/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "FilterRoleApplicationTenant/Update"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "FilterRoleApplicationTenant/Delete/"
                            }
                        }
                    }
                },
                "OrgEmployeeAssignments": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "OrgName",
                            "displayName": "Org Name"
                        }, {
                            "field": "CompanyName",
                            "displayName": "Company Name"
                        }, {
                            "field": "DepartmentName",
                            "displayName": "Department Name"
                        }, {
                            "field": "BranchName",
                            "displayName": "Branch Name"
                        }, {
                            "field": "RoleName",
                            "displayName": "Role Name"
                        }],
                        "GridConfig": {
                            "isHeader": false,
                            "isSearch": false,
                            "title": "Company List",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='padding-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "SecSessionActivity": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "ActionType",
                            "displayName": "Action Type"
                        }, {
                            "field": "ActInfo",
                            "displayName": "Act Info"
                        }],
                        "GridConfig": {
                            "isHeader": true,
                            "isSearch": true,
                            "title": "Session Activity",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='p-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "NLog": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "MachineName",
                            "displayName": "Machine Name",
                            "width": 150
                        }, {
                            "field": "SiteName",
                            "displayName": "Site Name",
                            "width": 150
                        }, {
                            "field": "Logged",
                            "displayName": "Logged",
                            "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy'}}</div>",
                            "width": 150
                        }, {
                            "field": "Level",
                            "displayName": "Level",
                            "width": 150
                        }, {
                            "field": "UserName",
                            "displayName": "UserName",
                            "width": 150
                        }, {
                            "field": "Message",
                            "displayName": "Message",
                            "width": 150
                        }, {
                            "field": "Logger",
                            "displayName": "Logger",
                            "width": 150
                        }, {
                            "field": "Properties",
                            "displayName": "Properties",
                            "width": 150
                        }, {
                            "field": "ServerName",
                            "displayName": "ServerName",
                            "width": 150
                        }, {
                            "field": "Url",
                            "displayName": "Url",
                            "width": 200
                        }, {
                            "field": "ServerAddress",
                            "displayName": "ServerAddress",
                            "width": 150
                        }, {
                            "field": "Callsite",
                            "displayName": "Callsite",
                            "width": 250
                        }, {
                            "field": "Exception",
                            "displayName": "Exception",
                            "width": 150
                        }, {
                            "field": "Type",
                            "displayName": "Type",
                            "width": 150
                        }, {
                            "field": "Input",
                            "displayName": "Input",
                            "width": 150
                        }, {
                            "field": "ErrorId",
                            "displayName": "ErrorId",
                            "cellTemplate": "<a class='text-single-line' href='javascript:void(0);'  ng-click= 'DynamicTableCtrl.ePage.Masters.SelectedGridRow(x, $parent.$parent.$index, \"link\")'>{{x[y.field]}}</a>",
                            "width": 150
                        }, {
                            "field": "Userid",
                            "displayName": "Userid",
                            "width": 150
                        }],
                        "GridConfig": {
                            "isHeader": true,
                            "isSearch": true,
                            "title": "NLog",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='p-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                },
                "ElmahError": {
                    "Grid": {
                        "ColumnDef": [{
                            "field": "ErrorId",
                            "displayName": "Error Id",
                            "width": 150
                        }, {
                            "field": "Application",
                            "displayName": "Application",
                            "width": 150
                        }, {
                            "field": "Host",
                            "displayName": "Host",
                            "width": 150
                        }, {
                            "field": "Type",
                            "displayName": "Type",
                            "width": 150
                        }, {
                            "field": "Source",
                            "displayName": "Source",
                            "width": 150
                        }, {
                            "field": "Message",
                            "displayName": "Message",
                            "width": 150
                        }, {
                            "field": "User",
                            "displayName": "User",
                            "width": 150
                        }, {
                            "field": "StatusCode",
                            "displayName": "Status Code",
                            "width": 150
                        }, {
                            "field": "TimeUtc",
                            "displayName": "Time Utc",
                            "cellTemplate": "<div class='text-single-line' >{{x[y.field] | date: 'dd-MMM-yyyy h:mm:ss a'}}</div>",
                            "width": 150
                        }, {
                            "field": "Sequence",
                            "displayName": "Sequence",
                            "width": 150
                        }, {
                            "field": "AllXml",
                            "displayName": "AllXml",
                            "width": 150
                        }],
                        "GridConfig": {
                            "isHeader": true,
                            "isSearch": true,
                            "title": "Elmah Error",
                            "isSorting": false,
                            "isColumnHeader": true,
                            "isEdit": false,
                            "isDelete": false,
                            "isPagination": false,
                            "itemsPerPage": 10,
                            "isRowTemplate": false,
                            "rowTemplate": `<div data-ng-repeat='y in DynamicTableCtrl.ePage.Masters.GridConfig.columnDef' class='p-5 clearfix'>
                            <div class='col-sm-1'>{{x.Id}}</div>
                            <div class='col-sm-2'>{{x.FName}}</div>
                            <div class='col-sm-2'>{{x.LName}}</div>
                            </div>`
                        }
                    }
                }
            }
        };

        return exports;
    }
})();
