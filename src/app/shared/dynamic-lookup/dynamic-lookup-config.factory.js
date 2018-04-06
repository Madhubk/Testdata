(function () {
    "use strict";

    angular
        .module("Application")
        .factory('dynamicLookupConfig', DynamicLookupConfig);

    DynamicLookupConfig.$inject = [];

    function DynamicLookupConfig() {
        var exports = {
            Entities: {
                // MstUNLOCO: {
                // ConGeneralFirstForeignPort: {
                //     defaults: {},
                //     pageName: "UNLOCO",
                //     selectedRow: {},
                //     UIDisplay: "Code",
                //     PossibleFilters: [{
                //         "FieldName": "Code",
                //         "value": null
                //     }],
                //     setValues: [{
                //         sField: "Code",
                //         eField: "FirstForeignPort"
                //     }],
                //     getValues: [{
                //         sField: "Code",
                //         eField: "FirstForeignPort"
                //     }]
                // }
                // },
                // dynamicLookUp: {
                //     "FieldName": "RH_NKContainerCommodityCode",
                //     "FilterID": "TEAMTYP",
                //     "UIDisplay": "OP_OperationName",
                //     "DBSource": "MvwTEAM_Users",
                //     "APIUrl": "DataEntry/Dynamic/FindLookup",
                //     "Additional": [{
                //             "LookupField": "RoleName",
                //             "EntityField": "Max"
                //         },
                //         {
                //             "LookupField": "CMPCode",
                //             "EntityField": "GrossWeight"
                //         },
                //     ],
                // "PossibleFilters": [{
                //     "FieldName": "Code",
                //     "value": null
                // }]
                // }
            }
        }
        return exports;
    }
})();
