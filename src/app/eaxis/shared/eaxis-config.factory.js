(function () {
    "use strict";

    angular
        .module("Application")
        .factory('eaxisConfig', EAxisConfig);

    function EAxisConfig() {
        let exports = {
            "Entities": {
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
                "EBPMCFXTypes": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "EBPMCFXTypes/FindAll",
                            "FilterID": "BPMCFT"
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
                "CfxTypes": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cfxtypes/FindAll/",
                            "FilterID": "CFXTYPE"
                        }
                    }
                },
                "SecMappings": {
                    "RowIndex": -1,
                    "API": {
                        "GetColumnValuesWithFilters": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "SecMappings/GetColumnValuesWithFilters",
                            "FilterID": "SECMAPP"
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
                "DYN_RelatedLookup": {
                    "RowIndex": -1,
                    "API": {
                        "GroupFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DYN_RelatedLookup/GroupFindAll",
                            "FilterID": "DYNREL"
                        }
                    }
                },
                "UserTenantList": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "UserTenantList/FindAll",
                            "FilterID": "USEREXT"
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
                        }
                    }
                },
                "EBPMWorkItem": {
                    "RowIndex": -1,
                    "API": {
                        "FindAllWithAccess": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllWithAccess",
                            "FilterID": "BPMWKI"
                        },
                        "FindAllStatusCount": {
                            "IsAPI": true,
                            "Url": "EBPMWorkItem/FindAllStatusCount",
                            "FilterID": "BPMWKI"
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
            }
        };

        return exports;
    }
})();
