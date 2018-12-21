(function () {
    "use strict";

    angular
        .module("Application")
        .factory('mdmConfig', MdmConfig);

    function MdmConfig() {
        var exports = {
            "Entities": {
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
            }
        };

        return exports;
    }
})();
