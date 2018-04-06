(function () {
    "use strict";

    angular
        .module("Application")
        .controller("uploadPOEditDirectiveController", UploadPOEditDirectiveController);

    UploadPOEditDirectiveController.$inject = ["$injector", "helperService"];

    function UploadPOEditDirectiveController($injector, helperService) {
        var UploadPOEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            UploadPOEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_PO_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": UploadPOEditDirectiveCtrl.entityObj
                    }
                }
            };

            UploadPOEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            UploadPOEditDirectiveCtrl.ePage.Masters.TaskObj = UploadPOEditDirectiveCtrl.taskObj;
            UploadPOEditDirectiveCtrl.ePage.Masters.EntityObj = UploadPOEditDirectiveCtrl.entityObj;
            UploadPOEditDirectiveCtrl.ePage.Masters.TabObj = UploadPOEditDirectiveCtrl.tabObj;
        }

        Init();
    }
})();
