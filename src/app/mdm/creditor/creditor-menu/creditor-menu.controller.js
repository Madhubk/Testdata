(function () {
    "use strict";

    angular.module("Application")
        .controller("CreditorMenuController", CreditorMenuController);

    CreditorMenuController.$inject = ["helperService", "toastr", "authService"];

    function CreditorMenuController(helperService, toastr, authService) {

        var CreditorMenuCtrl = this;

        function Init() {

            var currentCreditor = CreditorMenuCtrl.currentCreditor[CreditorMenuCtrl.currentCreditor.code].ePage.Entities;

            CreditorMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCreditor
            };

            CreditorMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            CreditorMenuCtrl.ePage.Masters.DisableSave = false;

            /* Function */
            CreditorMenuCtrl.ePage.Masters.Save = Save;
        }

        //#region Save
        function Save($item) {
            CreditorMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CreditorMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                _input.CreatedDateTime = new Date();
                _input.IsValid = true;
                _input.ModifiedBy = authService.getUserInfo().UserId;
                _input.CreatedBy = authService.getUserInfo().UserId;
                _input.Source = "ERP";
                _input.TenantCode = "20CUB";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Creditor').then(function (response) {
                CreditorMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                CreditorMenuCtrl.ePage.Masters.DisableSave = false;

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

        Init()
    }
})();