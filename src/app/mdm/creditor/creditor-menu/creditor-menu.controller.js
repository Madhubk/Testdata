(function () {
    "use strict";

    angular.module("Application")
        .controller("CreditorMenuController", CreditorMenuController);

    CreditorMenuController.$inject = ["helperService", "toastr", "authService", "creditorConfig", "apiService"];

    function CreditorMenuController(helperService, toastr, authService, creditorConfig, apiService) {

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
            CreditorMenuCtrl.ePage.Masters.Config = creditorConfig;

            /* Function */
            CreditorMenuCtrl.ePage.Masters.Validation = Validation;
            CreditorMenuCtrl.ePage.Masters.Save = Save;
        }

        //#region  Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            CreditorMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (CreditorMenuCtrl.ePage.Entities.Header.Validations) {
                CreditorMenuCtrl.ePage.Masters.Config.RemoveApiErrors(CreditorMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": creditorConfig.Entities.API.CreditorGroup.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", creditorConfig.Entities.API.CreditorGroup.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        CreditorMenuCtrl.ePage.Masters.UICreditorList = response.data.Response;
                    }

                    var _count = CreditorMenuCtrl.ePage.Masters.UICreditorList.some(function (value, key) {
                        if (value.Code == _input.Code) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if (_count) {
                        toastr.error("Code is Unique, Rename the Code!.");
                    } else {
                        Save($item);
                    }
                });
            } else {
                CreditorMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(CreditorMenuCtrl.currentCreditor);
            }
        }
        //#endregion

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