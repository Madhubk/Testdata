(function () {
    "use strict";

    angular.module("Application")
        .controller("TaxMenuController", TaxMenuController);

    TaxMenuController.$inject = ["helperService", "toastr"];

    function TaxMenuController(helperService, toastr) {
        var TaxMenuCtrl = this;

        function Init() {
            var currentTax = TaxMenuCtrl.currentTax[TaxMenuCtrl.currentTax.code].ePage.Entities;

            TaxMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Tax",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTax
            };

            TaxMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            TaxMenuCtrl.ePage.Masters.DisableSave = false;

            /* Function */
            TaxMenuCtrl.ePage.Masters.Validation = Validation;
        }

        //#region  Validation
        function Validation($item) {
            console.log("Validation", $item[$item.code].ePage.Entities.Header.Data);
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            Save($item);
        }
        //#endregion


        //#region Save
        function Save($item) {
            TaxMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            //TaxMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                _input.CreatedDateTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'TaxRate').then(function (response) {
                TaxMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                TaxMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    toastr.success("Saved Successfully...!");
                } else if (response.Status === "failed") {
                    toastr.error("Could not Save...!");
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        //#endregion


        Init();
    }
})();