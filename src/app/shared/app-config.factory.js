(function () {
    "use strict";

    angular
        .module("Application")
        .factory('appConfig', AppConfig);

    function AppConfig() {
        var exports = {
            "Entities": {
                "Token": {
                    "RowIndex": -1,
                    "API": {
                        "token": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "token"
                        },
                        "SoftLoginToken": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Token/SoftLoginToken"
                        },
                        "Logout": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Token/Logout"
                        },
                        "EmailLinkToken": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Token/EmailLinkToken"
                        }
                    }
                },
                "AuthTokenLink": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "AuthTokenLink/GetById/"
                        }
                    }
                },
                "UserPrivileges": {
                    "RowIndex": -1,
                    "API": {
                        "PublishPrivilegesByUser": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserPrivileges/PublishPrivilegesByUser"
                        },
                        "AppTenantRolePublish": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserPrivileges/AppTenantRolePublish"
                        },
                        "UserTenantRolePublish": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserPrivileges/UserTenantRolePublish"
                        },
                        "PublishAllUsers": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserPrivileges/PublishAllUsers"
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
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecMappings/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecMappings/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "SecMappings/Delete/"
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
                "SecTenantUserMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecTenantUserMapping/FindAll",
                            "FilterID": "SETUSM"
                        }
                    }
                },
                "AuthTrust": {
                    "RowIndex": -1,
                    "API": {
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AuthTrust/GetColumnValuesWithFilters",
                            "FilterID": "AUTHTRU"
                        }
                    }
                },
                "User": {
                    "RowIndex": -1,
                    "API": {
                        "ChangePassword": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "User/ChangePassword"
                        },
                        "ResetPassword": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "User/ResetPassword"
                        }
                    }
                },
                "HomeMenuUserRoleAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "HomeMenuUserRoleAccess/FindAll",
                            "FilterID": "HOMURA"
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
                "ProcessMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "Url": "ProcessMaster/FindAll",
                            "FilterID": "DYN_PRO"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "Url": "ProcessMaster/Upsert",
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
                        }
                    }
                },
                "DataEntryProcessTaskMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "Url": "DataEntryProcessTaskMapping/FindAll",
                            "FilterID": "DYN_PRS"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "Url": "DataEntryProcessTaskMapping/Upsert"
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
                "TeamProjectMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TeamProjectMaster/FindAll",
                            "FilterID": "TEAM_PR"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TeamProjectMaster/Upsert"
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
                        }
                    }
                },
                "SecRoleOperation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecRoleOperation/FindAll",
                            "FilterID": "SECROLE"
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
                "Country": {
                    "RowIndex": -1,
                    "API": {
                        "FindLookup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindLookup",
                            "FilterID": "MSTCOUN",
                            "DBObjectName": "MstCountry"
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
                "MstContainer": {
                    "RowIndex": -1,
                    "API": {
                        "FindLookup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindLookup",
                            "FilterID": "MSTCONT",
                            "DBObjectName": "MstContainer"
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
                "Currency": {
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
                "ServiceLevel": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstServiceLevel/FindAll",
                            "FilterID": "MSTPACK"
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
                "DataEntry": {
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "SaveAndComplete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/SaveAndComplete"
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
                "MstPackType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstPackType/FindAll",
                            "FilterID": "MSTPACK"
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
                "SecSession": {
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
                "Scripts": {
                    "RowIndex": -1,
                    "API": {
                        "WriteScript": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Scripts/WriteScript"
                        }
                    }
                },
                "GroupEventType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEventType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEventType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEventType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupEventType/Delete/"
                        }
                    }
                },
                "GroupRoleEventType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEventType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEventType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEventType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleEventType/Delete/"
                        }
                    }
                },
                "GroupCommentType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupCommentType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupCommentType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupCommentType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupCommentType/Delete/"
                        }
                    }
                },
                "GroupRoleCommentType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleCommentType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleCommentType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleCommentType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleCommentType/Delete/"
                        }
                    }
                },
                "GroupDocumentType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupDocumentType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupDocumentType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupDocumentType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupDocumentType/Delete/"
                        }
                    }
                },
                "GroupRoleDocumentType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleDocumentType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleDocumentType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleDocumentType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleDocumentType/Delete/"
                        }
                    }
                },
                "GroupEmailType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEmailType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEmailType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEmailType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupEmailType/Delete/"
                        }
                    }
                },
                "GroupRoleEmailType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEmailType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEmailType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEmailType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleEmailType/Delete/"
                        }
                    }
                },
                "GroupExceptionType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupExceptionType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupExceptionType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupExceptionType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupExceptionType/Delete/"
                        }
                    }
                },
                "GroupRoleExceptionType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleExceptionType/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleExceptionType/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleExceptionType/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleExceptionType/Delete/"
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
                "GroupCommentTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupCommentTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupCommentTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupCommentTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupCommentTypeOrganisation/Delete/"
                        }
                    }
                },
                "GroupRoleCommentTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleCommentTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleCommentTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleCommentTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleCommentTypeOrganisation/Delete/"
                        }
                    }
                },
                "GroupDocumentTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupDocumentTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupDocumentTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupDocumentTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupDocumentTypeOrganisation/Delete/"
                        }
                    }
                },
                "GroupRoleDocumentTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleDocumentTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleDocumentTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleDocumentTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleDocumentTypeOrganisation/Delete/"
                        }
                    }
                },
                "GroupExceptionTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupExceptionTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupExceptionTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupExceptionTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupExceptionTypeOrganisation/Delete/"
                        }
                    }
                },
                "GroupRoleExceptionTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleExceptionTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleExceptionTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleExceptionTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleExceptionTypeOrganisation/Delete/"
                        }
                    }
                },
                "GroupEmailTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEmailTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEmailTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupEmailTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupEmailTypeOrganisation/Delete/"
                        }
                    }
                },
                "GroupRoleEmailTypeOrganisation": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEmailTypeOrganisation/FindAll",
                            "FilterID": "SECMAPP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEmailTypeOrganisation/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "GroupRoleEmailTypeOrganisation/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "GroupRoleEmailTypeOrganisation/Delete/"
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
                    },
                },
                "OrgAddress": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgAddress/FindAll",
                            "FilterID": "ORGADDR"
                        },
                        "DynamicFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgAddress/DynamicFindAll",
                            "FilterID": "ORGADDR"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrgAddress/Delete/"
                        },
                        "CountryState": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CountryState/FindAll",
                            "FilterID": "MSTCSTE"
                        },
                        "UNLOCO": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstUnloco/FindAll",
                            "FilterID": "MSTUNL"
                        },
                    },
                },
                "OrgContact": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgContact/FindAll",
                            "FilterID": "ORGCONT"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrgContact/Delete/"
                        }
                    }
                },
                "WmsClientParameterByWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsClientParameterByWarehouse/Delete/"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientParameterByWarehouse/Insert/"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "T",
                            "Url": "WmsClientParameterByWarehouse/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientParameterByWarehouse/FindAll",
                            "FilterID": "WMSWCP"
                        }
                    }
                },
                "WmsClientPickPackParamsByWms": {
                    "RowIndex": -1,
                    "API": {
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsClientPickPackParamsByWms/Delete/"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "T",
                            "Url": "WmsClientPickPackParamsByWms/Insert/"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "T",
                            "Url": "WmsClientPickPackParamsByWms/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientPickPackParamsByWms/FindAll",
                            "FilterID": "WMSWPP"
                        }
                    }
                },
                "JobAddress": {
                    "RowIndex": -1,
                    "API": {
                        "DynamicFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/DynamicFindAll",
                            "FilterID": "JOBADDR"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/FindAll",
                            "FilterID": "JOBADDR"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/Insert",

                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobAddress/Update",

                        }
                    }
                },
                "JobRoutes": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/FindAll",
                            "FilterID": "JOBROUT"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/Delete/"
                        },
                        "UpdateList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/UpdateList",
                            "FilterID": "JOBROUT"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/UpdateRecords",
                            "FilterID": "JOBROUT"
                        },
                        "DeleteSailing": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/DeleteSailing",
                            "FilterID": "JOBROUT"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRoutes/Upsert",
                            "FilterID": "JOBROUT"
                        },
                    },
                    "Grid": {
                        "ColumnDef": [{
                            "field": "LegOrder",
                            "displayName": "LegOrder",
                        }, {
                            "field": "TransportMode",
                            "displayName": "Mode",
                        }, {
                            "field": "TransportType",
                            "displayName": "Type",
                        }, {
                            "field": "Status",
                            "displayName": "Status",
                        }, {
                            "field": "Vessel",
                            "displayName": "Vessel",
                        }, {
                            "field": "VoyageFlight",
                            "displayName": "Voyage/ Flight",
                        }, {
                            "field": "LoadPort",
                            "displayName": "Load",
                        }, {
                            "field": "DischargePort",
                            "displayName": "Discharge",
                        }, {
                            "field": "IsDomestic",
                            "displayName": "Is Domestic",
                        }, {
                            "field": "ETD",
                            "displayName": "ETD",
                            "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ETD | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                            "isDateField": true
                        }, {
                            "field": "ETA",
                            "displayName": "ETA",
                            "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ETA | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                            "isDateField": true
                        }, {
                            "field": "ATD",
                            "displayName": "ATD",
                            "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ATD | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                            "isDateField": true
                        }, {
                            "field": "ATA",
                            "displayName": "ATA",
                            "cellTemplate": "<div class='padding-5 text-single-line'>{{row.entity.ATA | date:'dd-MMM-yyyy  hh:mm a'}}</div>",
                            "isDateField": true
                        }],
                        "GridConfig": {
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
                            "rowTemplate": ""
                        }
                    }
                },
                "JobComments": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/FindAll",
                            "FilterID": "JOBCMTS"
                        },
                        "FindAllWithAccess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/FindAllWithAccess/",
                            "FilterID": "JOBCMTS"
                        },
                        "FindAllWithAccessCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/FindAllWithAccessCount/",
                            "FilterID": "JOBCMTS"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobComments/Delete/"
                        }
                    }
                },
                "JobCommentsAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobCommentsAccess/FindAll",
                            "FilterID": 'JOCOAC'
                        },
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobCommentsAccess/FindAllWithAccess",
                            "FilterID": 'JOCOAC'
                        },
                        "Insert": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobCommentsAccess/Insert"
                        },
                        "Update": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobCommentsAccess/Update"
                        },
                        "Delete": {
                            "IsAPI": true,
                            "HttpType": "GET",
                            "Url": "JobCommentsAccess/Delete/"
                        }
                    }
                },
                "JobException": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/FindAll",
                            "FilterID": "JOBEXCP"
                        },
                        "FindAllWithAccess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/FindAllWithAccess/",
                            "FilterID": "JOBEXCP"
                        },
                        "FindAllWithAccessCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/FindAllWithAccessCount/",
                            "FilterID": "JOBEXCP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/Delete/"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobException/Upsert"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobException/GetById/"
                        }
                    }
                },
                "JobExceptionAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobExceptionAccess/FindAll",
                            "FilterID": "JOEXAC"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobException/GetById/"
                        },
                        "FindAllWithAccess": {
                            "HttpType": "POST",
                            "Url": "JobExceptionAccess/FindAllWithAccess/",
                            "FilterID": "JOEXAC"
                        },
                        "FindAllWithAccessCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobExceptionAccess/FindAllWithAccessCount/",
                            "FilterID": " JOEXAC"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobExceptionAccess/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobExceptionAccess/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobExceptionAccess/Delete/"
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
                        "FindAllWithAccessCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobDocument/FindAllWithAccessCount/",
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
                            "HttpType": "POST",
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
                        }
                    }
                },
                "DataAudit": {
                    "RowIndex": -1,
                    "API": {
                        "DynamicFindAll": {
                            "IsAPI": true,
                            "Url": "DataAudit/DynamicFindAll",
                            "FilterID": "DATAAUD"
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataAudit/FindAll",
                            "FilterID": "DATAAUD"
                        }
                    }
                },
                "DataFullTextSearch": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataFullTextSearch/FindAll",
                            "FilterID": "DATAFUT"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "DataFullTextSearch/Upsert"
                        }
                    }
                },
                "DataSharedEntity": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataSharedEntity/FindAll",
                            "FilterID": "JOBSHEN"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "DataSharedEntity/Upsert"
                        }
                    }
                },
                "JobRequiredDocument": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobRequiredDocument/FindAll",
                            "FilterID": "JOBREQU"
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
                "ConShpMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConShpMapping/FindAll",
                            "FilterID": "CONSHPMAP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConShpMapping/Insert"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ConShpMapping/Delete/"
                        }
                    }
                },
                "ConConsolHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConConsolHeader/FindAll",
                            "FilterID": "CONSHEAD"
                        }
                    }
                },
                "ConsolList": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ConsolList/GetById/"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConsolList/Update"
                        }
                    }
                },
                "Communication": {
                    "RowIndex": -1,
                    "API": {
                        "CreateGroupEmail": {
                            "IsAPI": true,
                            "Url": "Communication/CreateGroupEmail/"
                        },
                        "GenerateReport": {
                            "IsAPI": true,
                            "Url": "Communication/GenerateReport/"
                        },
                        "JobDocument": {
                            "IsAPI": true,
                            "Url": "/JobDocument/DownloadFile/"
                        }
                    }
                },
                "JobService": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobService/FindAll",
                            "FilterID": "JOBSERV"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobService/Upsert"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "Get",
                            "Url": "JobService/Delete"
                        }
                    }
                },
                "JobEntryNum": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEntryNum/FindAll",
                            "FilterID": "JENTNUM"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEntryNum/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEntryNum/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobEntryNum/Delete/"
                        }
                    }
                },
                "JobHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobHeader/FindAll",
                            "FilterID": "JOBHEAD"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobHeader/Insert",
                            "FilterID": "JOBHEAD"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobHeader/Update",
                            "FilterID": "JOBHEAD"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobHeader/Delete/",
                            "FilterID": "JOBHEAD"
                        }
                    }
                },
                "PorOrderHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderHeader/FindAll",
                            "FilterID": "ORDHEAD"
                        },
                        "GetSplitOrdersByOrderNo": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderHeader/GetSplitOrdersByOrderNo/"
                        },
                        "SplitOrderByOrderPk": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderHeader/SplitOrderByOrderPk/",
                            "FilterID": "ORDHEAD"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderHeader/UpdateRecords"
                        },
                        "CheckOrderNumber": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderHeader/CheckOrderNumber/",
                            "FilterID": "ORDHEAD"
                        }
                    }
                },
                "ShipmentHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentHeader/FindAll",
                            "FilterID": "SHIPHEAD"
                        },
                        "Count": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentHeader/FindCount",
                            "FilterID": "SHIPHEAD"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "SHIPHEAD",
                            "Url": "ShipmentHeader/UpdateRecords"
                        },
                        "CloseVesselPlanningandCToB": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentHeader/CloseVesselPlanningandCToB/"
                        },
                        "InitiateUploadSLI": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentHeader/InitiateUploadSLI",
                            "FilterID": "SHIPHEAD"
                        }
                    }
                },
                "ShipmentList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/GetById/"
                        },
                        "ShipmentActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/ShipmentActivityClose/"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentList/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentList/Update"
                        },
                        "OrderCopy": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/OrderCopy/",
                            "FilterID": "ORDHEAD"
                        },
                    }
                },
                "JobPackLines": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/FindAll",
                            "FilterID": "JOBPACK"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/Upsert"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobPackLines/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobPackLines/Delete/"
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
                "InwardList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/GetById/",
                        },
                        "UpdateInwardProcess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/ProcessUpdate"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/FindAll",
                            "FilterID": "WMSINW"
                        }
                    }
                },
                "WmsOutwardList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsOutwardList/GetById/",
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/FindAll",
                            "FilterID": "WMSOUT",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardList/Insert"
                        },
                    }
                },
                "WmsDeliveryList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDeliveryList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDeliveryList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDeliveryList/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDelivery/FindAll",
                            "FilterID": "WMSDEL"
                        }
                    }
                },
                "WmsClientParameterByWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsClientParameterByWarehouse/FindAll",
                            "FilterID": "WMSWCP",
                        },
                    }
                },
                "WmsPickLineSummary": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickLineSummary/FindAll",
                            "FilterID": "WMSPLS",
                        },
                    }
                },
                "WmsPickList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickList/Update"
                        },
                    }
                },
                "WmsPickupList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickupList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickupList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickupList/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickup/FindAll",
                            "FilterID": "WMSPICR"
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
                            "FilterID": "WMSINV",
                        },
                    }
                },
                "WmsInventoryAdjustment": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInventoryAdjustment/Insert",
                        },
                    }
                },
                "AppCounter": {
                    "RowIndex": -1,
                    "API": {                        
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AppCounter/Update"
                        }
                    }
                },
                "WmsTestID": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TestID/FindAll",
                            "FilterID": "APPCOUNT"
                        }
                    }
                },
                "TmsManifestList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsManifestList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Update"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifest/FindAll",
                            "FilterID": "TMSMAN",
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Insert"
                        },
                    }
                },
                "TmsManifest": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsManifest/GetById/",
                        },
                    }
                },
                "TmsConsignmentList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsConsignmentList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsConsignmentList/Update"
                        }
                    }
                },
                "WmsWorkOrder": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWorkOrder/FindAll",
                            "FilterID": "WMSWORK"
                        },
                    }
                },
                "WmsWorkOrderLine": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWorkOrderLine/FindAll",
                            "FilterID": "WMSINL"
                        },
                    }
                },
                "TMSPickupandDeliverypoint": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TMSPickupandDeliverypoint/FindAll",
                            "FilterID": "TMSPICDEVPOI"
                        },
                    }
                },
                "TMSGatepassList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TMSGatepassList/GetById/"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TMSGatepassList/Update"
                        }
                    }
                },
                "TMSGatepass": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TMSGatepass/GetById/"
                        },
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
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgCompanyData/FindAll",
                            "FilterID": "ORGCDTA"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrgCompanyData/GetById/"
                        }
                    }
                },
                "Organization": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Org/FindAll",
                            "FilterID": ""
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "Org/GetById/"
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
                "OrgRelatedPartiesMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgRelatedPartiesMapping/FindAll",
                            "FilterID": "RELPARTY"
                        }
                    }
                },
                "SaveSettings": {
                    "RowIndex": -1,
                    "API": {
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SaveSettings/Upsert/"
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "SaveSettings/FindAll/",
                            "FilterID": "SAVESET"
                        }
                    }
                },
                "DataEvent": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataEvent/FindAll/",
                            "FilterID": "DATAEVT"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "DataEvent/Upsert",
                            "FilterID": ""
                        },
                        "GetColumnValuesWithFilters": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "DataEvent/GetColumnValuesWithFilters",
                            "FilterID": "DATAEVT"
                        },
                        "EventTypeAccess": {
                            "IsAPI": true,
                            "Url": "DataEvent/EventTypeAccess",
                            "FilterID": "DATAEVT"
                        },
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "Url": "DataEvent/FindAllWithAccess/",
                            "FilterID": "DATAEVT"
                        },
                        "FindAllWithAccessCount": {
                            "IsAPI": true,
                            "Url": "DataEvent/FindAllWithAccessCount/",
                            "FilterID": "DATAEVT"
                        }
                    }
                },
                "DataEventAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataEventAccess/FindAll",
                            "FilterID": "DATAEVT"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "DataEventAccess/Insert",
                        },
                        "Update": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "DataEventAccess/Update",
                        },
                        "Delete": {
                            "IsAPI": true,
                            "HttpType": "GET",
                            "Url": "DataEventAccess/Delete/"
                        }
                    }
                },
                "OrgPartyType": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "OrgPartyType/FindAll",
                            "FilterID": "ORGPTY"
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
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEmail/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEmail/Delete/"
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "JobEmail/FindAll",
                            "FilterID": "JOBEML"
                        },
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "Url": "JobEmail/FindAllWithAccess/",
                            "FilterID": "JOBEML"
                        },
                        "FindAllWithAccessCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "JobEmail/FindAllWithAccessCount/",
                            "FilterID": "JOBEML"
                        }
                    }
                },
                "JobEmailAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobEmailAccess/FindAll",
                            "FilterID": 'JOEMAC'
                        },
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobEmailAccess/FindAllWithAccess",
                            "FilterID": 'JOEMAC'
                        },
                        "Insert": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobEmailAccess/Insert"
                        },
                        "Update": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobEmailAccess/Update"
                        },
                        "Delete": {
                            "IsAPI": true,
                            "HttpType": "GET",
                            "Url": "JobEmailAccess/Delete/"
                        }
                    }
                },
                "NotificationEmail": {
                    "RowIndex": -1,
                    "API": {
                        "Send": {
                            "IsAPI": true,
                            "Url": "Notification/Email/Send",

                        },

                    }
                },
                "Notification": {
                    "RowIndex": -1,
                    "API": {
                        "SendSms": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Notification/SendSms"
                        },
                    }
                },
                "TeamTargetRelease": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamTargetRelease/FindAll",
                            "FilterID": "TEAMTRL"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamTargetRelease/Insert",
                            "FilterID": ""
                        },
                        "Update": {
                            "IsAPI": true,
                            "Url": "TeamTargetRelease/Update",
                            "FilterID": ""
                        }
                    }
                },
                "TeamTaskTagging": {
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamTaskTagging/FindAll",
                            "FilterID": "TEAMTAG"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamTaskTagging/Insert"
                        },
                        "Delete": {
                            "IsAPI": true,
                            "Url": "TeamTaskTagging/Delete/"
                        }
                    }
                },
                "TeamChat": {
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamChat/FindAll",
                            "FilterID": "TEAMCHAT"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamChat/Insert",
                            "FilterID": "TEAMCHAT"
                        }
                    }
                },
                "TeamEffort": {
                    "API": {
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamEffort/Insert",
                            "FilterID": ""
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "TeamEffort/Upsert",
                            "FilterID": ""
                        },
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamEffort/FindAll",
                            "FilterID": "TEAMEFT"
                        },
                    }
                },
                "TeamTask": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "TeamTask/FindAll",
                            "FilterID": "TEAMTSK"
                        },
                        "Insert": {
                            "IsAPI": true,
                            "Url": "TeamTask/Insert",
                            "FilterID": ""
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "TeamTask/Upsert",
                            "FilterID": ""
                        },
                        "GetColumnValues": {
                            "IsAPI": true,
                            "Url": "TeamTask/GetColumnValues/TSK_Remarks",
                            "FilterID": "TEAMTSK"
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
                "EBPMProcessScenario": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMProcessScenario/FindAll",
                            "FilterID": "BPMPSS"
                        },
                        "Upsert": {
                            "IsAPI": true,
                            "Url": "EBPMProcessScenario/Upsert"
                        }
                    }
                },
                "EBPMControlTower": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMControlTower/FindAll",
                            "FilterID": "BPMWKI"
                        }
                    }
                },
                "vwWorkItemControlTowerMoreInfo": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "vwWorkItemControlTowerMoreInfo/FindAll",
                            "FilterID": "WICTMI"
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
                "EBPMWorkItem": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAll",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithEntity": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithEntity",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllStatusCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllStatusCount",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithEntityCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithEntityCount",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllCount",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithAccess",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithAccessWithEntity": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithAccessWithEntity",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllWithAccessCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithAccessCount/",
                            "FilterID": "BPMWKI"
                        }
                    }
                },
                "EBPMWorkFlow": {
                    "RowIndex": -1,
                    "API": {
                        "GetByInstanceNo": {
                            "IsAPI": true,
                            "Url": "EBPMWorkFlow/GetByInstanceNo/"
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
                        },
                        "SuspendInstance": {
                            "IsAPI": true,
                            "Url": "EBPMEngine/SuspendInstance/",
                        }
                    }
                },
                "EBPMProcessInstance": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "EBPMProcessInstance/FindAll",
                            "FilterID": "BPMPSI"

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
                "LogErrorObject": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": true,
                            "Url": "LogErrorObject/Insert"
                        }
                    }
                },
                "Export": {
                    "RowIndex": -1,
                    "API": {
                        "Excel": {
                            "IsAPI": true,
                            "Url": "Export/Excel",
                            "FilterID": "TEST"
                        },
                        "GridExcel": {
                            "IsAPI": true,
                            "Url": "Export/GridExcel",
                            "FilterID": "TEST"
                        },
                        "AsHtml": {
                            "IsAPI": true,
                            "Url": "Export/AsHtml",
                            "FilterID": "TEST"
                        }
                    }
                },
                // Sailing 
                "SailingDetails": {
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/FindAll",
                            "FilterID": "JOBSAIL"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/Update"
                        },
                        "ListUpsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/ListUpsert"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/Insert"
                        },
                        "ListInsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SailingDetails/ListInsert"
                        }
                    }
                },
                // Order
                "PO": {
                    "RowIndex": -1,
                    "API": {
                        "GetOpenOrdersCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetOpenOrdersCount",
                            "FilterID": "ORDHEAD"
                        },
                        "GetPendingCargoReadinessCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetPendingCargoReadinessCount",
                            "FilterID": "ORDHEAD"
                        },
                        "GetPendingVesselPlanningCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetPendingVesselPlanningCount",
                            "FilterID": "ORDHEAD"
                        },
                        "GetPendingConvertToBookingCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PO/GetPendingConvertToBookingCount",
                            "FilterID": "ORDHEAD"
                        }
                    }
                },
                "OrderList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/GetById/",
                            "FilterID": "ORDHEAD"
                        },
                        "OrderCopy": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/OrderCopy/",
                            "FilterID": "ORDHEAD"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/Insert",
                            "FilterID": "ORDHEAD"
                        }
                    }
                },
                "CargoReadiness": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/FindAll",
                            "FilterID": "SFULIST"
                        },
                        "SendFollowUp": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/SendFollowUp",
                            "FilterID": "SFULIST"
                        },
                        "CreateFollowUpGroup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/CreateFollowUpGroup",
                            "FilterID": "SFULIST"
                        },
                        "GetGroupHeaderByGroupId": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CargoReadiness/FollowUpGroup/GetGroupHeaderByGroupId/",
                            "FilterID": "SFULIST"
                        },
                        "GetOrdersByGroupId": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CargoReadiness/FollowUpGroup/GetOrdersByGroupId/",
                            "FilterID": "SFULIST"
                        },
                        "CompleteFollowUpTask": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/CompleteFollowUpTask",
                            "FilterID": "SFULIST"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/FollowUpGroupDetail/UpdateRecords",
                            "FilterID": "SFULIST"
                        },
                        "FollowUpGroup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/FollowUpGroup/FindAll",
                            "FilterID": "ORDSPAH"
                        },
                        "GetFollowUpHistoryByOrderPK": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CargoReadiness/FollowUpGroup/GetFollowUpHistoryByOrderPK/",
                            "FilterID": "ORDSPAH"
                        }
                    }
                },
                "PreAdviceList": {
                    "API": {
                        "PreAdviceSendList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/PreAdviceSendList",
                            "FilterID": "SPALIST"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/Delete"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/Insert"
                        },
                        "SendPreAdvice": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PreAdviceList/SendPreAdvice"
                        }
                    }
                },
                "VesselPlanning": {
                    "API": {
                        "PreAdviceList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/PreAdviceList",
                            "FilterID": "SPALIST"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/Delete"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/Insert"
                        },
                        "SendPreAdvice": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/SendPreAdvice"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "VesselPlanning/GetById/"
                        },
                        "GetOrdersByVesselPk": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "VesselPlanning/PPAGroup/GetOrdersByVesselPk/"
                        },
                        "GetPPAGroupHeaderByVesselPk": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "VesselPlanning/PPAGroup/GetPPAGroupHeaderByVesselPk/"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/PPAGroupDetails/UpdateRecords"
                        },
                        "CreateVesselPlanningGroup": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "VesselPlanning/CreateVesselPlanningGroup"
                        },
                        "PreAdviceMailHistory": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "SPALIST",
                            "Url": "VesselPlanning/PreAdviceMailHistory"
                        }
                    }
                },
                "PorOrderLineDelivery": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLineDelivery/FindAll",
                            "FilterID": "ORDLDEL"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderLineDelivery/GetById/"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderLineDelivery/Delete/",
                            "FilterID": "ORDLDEL"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLineDelivery/Insert",
                            "FilterID": "ORDLDEL"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLineDelivery/Update",
                            "FilterID": "ORDLDEL"
                        }
                    }
                },
                "PorOrderLine": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderLine/GetById/",
                            "FilterID": "ORDLINE"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/FindAll",
                            "FilterID": "ORDLINE"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/Upsert",
                            "FilterID": "ORDLINE"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/Update",
                            "FilterID": "ORDLINE"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/Delete",
                            "FilterID": "ORDLINE"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderLine/UpdateRecords",
                            "FilterID": "ORDLINE"
                        }
                    }
                },
                // PO Upload
                "BatchUploadList": {
                    "RowIndex": -1,
                    "API": {
                        "CompletePOUpload": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "BatchUploadList/CompletePOUpload/",
                            "FilterID": ""
                        },
                        "InitatePOUpload": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "BatchUploadList/InitatePOUpload/",
                            "FilterID": ""
                        }
                    }
                },
                // PorOrderFollowUp
                "PorOrderFollowUp": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderFollowUp/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderFollowUp/Update"
                        }
                    }
                },
                // FollowUpList
                "FollowUpList": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/Delete"
                        },
                        "ActivateCRDUpdate": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "FollowUpList/ActivateCRDUpdate"
                        }
                    }
                },
                // Smart Track
                "PorOrderContainer": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderContainer/FindAll",
                            "FilterID": "ORDCONT"
                        }
                    }
                },
                "PkgCntMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PkgCntMapping/FindAll",
                            "FilterID": "PKGCNTMA"
                        }
                    }
                },
                "CntContainer": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CntContainer/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CntContainer/FindAll",
                            "FilterID": "CONTHEAD"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CntContainer/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CntContainer/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CntContainer/Delete/"
                        }
                    }
                },
                "ShipmentPreAdviceGroupHeader": {
                    "RowIndex": -1,
                    "API": {
                        "GetOrdersByGroupPK": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentPreAdviceGroupHeader/GetOrdersByGroupPK/"
                        }
                    }
                },
                "ConvertToBookingMapping": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ConvertToBookingMapping/Insert",
                            "FilterID": "SPACTB"
                        }
                    }
                },
                "ShipmentPreAdvice": {
                    "RowIndex": -1,
                    "API": {
                        "GetOrdersByGroupPK": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentPreAdvice/GetOrdersByGroupPK/"
                        }
                    }
                },
                "OrgBuyerSupplierMapping": {
                    "RowIndex": -1,
                    "API": {
                        "GetMDMDfaultFields": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "FilterID": "ORGBSMAP",
                            "Url": "OrgBuyerSupplierMapping/GetMDMDfaultFields/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGBSMAP",
                            "Url": "OrgBuyerSupplierMapping/FindAll"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "FilterID": "ORGBSMAP",
                            "Url": "OrgBuyerSupplierMapping/Delete/"
                        }
                    }
                },
                "OrgUserAcess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGUACC",
                            "Url": "OrgUserAcess/FindAll"
                        }
                    }
                },
                "Booking": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Booking/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Booking/Update"
                        }
                    }
                },
                "CompleteVerifyBooking": {
                    "RowIndex": -1,
                    "API": {
                        "CompleteVerifyBooking": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "mhplus/shipment/CompleteVerifyBooking",
                        }
                    }
                },
                "ApproveRejectBooking": {
                    "RowIndex": -1,
                    "API": {
                        "ApproveRejectBooking": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "mhplus/shipment/ApproveRejectBooking",
                        }
                    }
                },
                // Miscellaneous Service
                "OrgMiscServ": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGMISC",
                            "Url": "OrgMiscServ/FindAll"
                        }
                    }
                },
                // Product
                "PrdProduct": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGSUPP",
                            "Url": "PrdProduct/FindAll"
                        }
                    }
                },
                "PrdProductUnit": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGPARTU",
                            "Url": "PrdProductUnit/FindAll"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PrdProductUnit/Delete/"
                        },
                        "FetchQuantity": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PrdProductUnit/FetchQuantity"
                        }
                    }
                },
                "PrdProductRelatedParty": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGPRL",
                            "Url": "PrdProductRelatedParty/FindAll"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PrdProductRelatedParty/Delete/"
                        },
                    }
                },
                "PrdProductBOM": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGPABOM",
                            "Url": "PrdProductBOM/FindAll"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "Get",
                            "Url": "PrdProductBOM/Delete/"
                        }
                    }
                },
                "PrdPrductBarcode": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "ORGSUPPB",
                            "Url": "PrdPrductBarcode/FindAll"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "Get",
                            "Url": "PrdPrductBarcode/Delete/"
                        },
                    }
                },
                "PorOrderBatchUpload": {
                    "RowIndex": -1,
                    "API": {
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderBatchUpload/UpdateRecords",
                            "FilterID": "ORDBATCH"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PorOrderBatchUpload/FindAll",
                            "FilterID": "ORDBATCH"
                        }
                    }
                },
                "ShpExtended": {
                    "RowIndex": -1,
                    "API": {
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShpExtended/UpdateRecords",
                            "FilterId": ""
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
                "EPRExpression": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EPRExpression/FindAll",
                            "FilterID": "EPREXPR"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EPRExpression/Upsert"
                        }
                    }
                },
                "OrgConsigneeConsignorRelationship": {
                    "RowIndex": -1,
                    "API": {
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgConsigneeConsignorRelationship/Insert",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgConsigneeConsignorRelationship/Update",
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
                "ModuleSettings": {
                    "RowIndex": -1,
                    "API": {
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ModuleSettings/Upsert",
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ModuleSettings/FindAll",
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
                "BuyerOrder": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/findall",
                            "FilterID": "ORDHEAD"
                        },
                        "1_1_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/listgetbyid/"
                        },
                        "1_3_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyerforwarder/listgetbyid/"
                        },
                        "3_1_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/forwarderbuyer/listgetbyid/"
                        },
                        "1_2_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyersupplier/listgetbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/activityclose/"
                        },
                        "ordercopy": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/ordercopy/"
                        },
                        "split": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/split/"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/update"
                        },
                        "updaterecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/updaterecords"
                        },
                        "closecrd": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/closecrd"
                        },
                        "activatecrd": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/activatecrd"
                        },
                        "activateconverttobooking": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/activateconverttobooking"
                        }
                    }
                },
                "BuyerOrderBatchUpload": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderbatchupload/buyer/findall",
                            "FilterID": "ORDBATCH"
                        },
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderbatchupload/buyer/getbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderbatchupload/buyer/activityclose/"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderbatchupload/buyer/insert"
                        },
                        "updaterecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderbatchupload/buyer/updaterecords"
                        }
                    }
                },
                "ForwarderOrder": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/forwarder/findall",
                            "FilterID": "ORDHEAD"
                        },
                        "3_3_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/forwarder/listgetbyid/"
                        },
                        "1_3_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyerforwarder/listgetbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/forwarder/activityclose/"
                        },
                        "ordercopy": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/forwarder/ordercopy/"
                        },
                        "split": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/forwarder/split/"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/forwarder/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/forwarder/update"
                        }
                    }
                },
                "SupplierOrder": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/supplier/findall",
                            "FilterID": "ORDHEAD"
                        },
                        "2_2_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/supplier/listgetbyid/"
                        },
                        "1_2_listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyersupplier/listgetbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/supplier/activityclose/"
                        },
                        "ordercopy": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/supplier/ordercopy/"
                        },
                        "split": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/supplier/split/"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/supplier/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/supplier/update"
                        }
                    }
                },
                "JobDocumentAccess": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobDocumentAccess/FindAll",
                            "FilterID": 'JOBDOCU'
                        },
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobDocumentAccess/FindAllWithAccess",
                            "FilterID": 'JOBDOCU'
                        },
                        "Insert": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobDocumentAccess/Insert"
                        },
                        "Update": {
                            "IsAPI": true,
                            "HttpType": "POST",
                            "Url": "JobDocumentAccess/Update"
                        },
                        "Delete": {
                            "IsAPI": true,
                            "HttpType": "GET",
                            "Url": "JobDocumentAccess/Delete/"
                        }
                    }
                },
                "EBPMCheckList": {
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EBPMCheckList/FindAll",
                            "FilterID": "BPMCHL"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EBPMCheckList/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EBPMCheckList/Update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "EBPMCheckList/Delete/"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EBPMCheckList/Upsert"
                        }
                    }
                },
                "EBPMStepsCheckList": {
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EBPMStepsCheckList/FindAll",
                            "FilterID": "BPMSCL"
                        }
                    }
                },
                "EBPMStepsDelayReason": {
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EBPMStepsDelayReason/FindAll",
                            "FilterID": "BPMSDR"
                        }
                    }
                },
                "MstUnloco": {
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstUnloco/FindAll",
                            "FilterID": "UNLOCO"
                        }
                    }
                },
                "BuyerCntContainer": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "containerlist/buyer/getbyid/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "containerlist/buyer/findall",
                            "FilterID": "CONTHEAD"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cntcontainer/buyer/insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cntcontainer/buyer/update"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cntcontainer/buyer/delete/"
                        }
                    }
                },
                "BuyerShipmentHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "shipmentheader/buyer/findall",
                            "FilterID": "SHIPHEAD"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "SHIPHEAD",
                            "Url": "shipmentheader/buyer/updaterecords"
                        },
                        "FindCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "SHIPHEAD",
                            "Url": "shipmentheader/buyer/findcount"
                        }
                    }
                },
                "BuyerConShpMapping": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "conshpmapping/buyer/findall",
                            "FilterID": "CONSHPMAP"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "conshpmapping/buyer/insert"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "conshpmapping/buyer/delete/"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "conshpmapping/buyer/update"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "conshpmapping/buyer/upsert"
                        },
                        "UpdateRecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "conshpmapping/buyer/updateRecords"
                        },
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "conshpmapping/buyer/getbyid/"
                        }
                    }
                }
            }
        };

        return exports;
    }
})();
