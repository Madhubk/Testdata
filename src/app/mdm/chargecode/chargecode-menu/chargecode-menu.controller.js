(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeMenuController", ChargecodeMenuController);

    ChargecodeMenuController.$inject = ["helperService", "toastr", "authService", "chargecodeConfig", "apiService"];

    function ChargecodeMenuController(helperService, toastr, authService, chargecodeConfig, apiService) {

        var ChargecodeMenuCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeMenuCtrl.currentChargecode[ChargecodeMenuCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ChargecodeMenuCtrl.ePage.Masters.DisableSave = false;
            ChargecodeMenuCtrl.ePage.Masters.Config = chargecodeConfig;
            ChargecodeMenuCtrl.ePage.Masters.ChargecodeMenu = {};
            ChargecodeMenuCtrl.ePage.Masters.ChargecodeMenu.ListSource = ChargecodeMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            /* Function */
            ChargecodeMenuCtrl.ePage.Masters.Validation = Validation;
            ChargecodeMenuCtrl.ePage.Masters.Save = Save;

        }

        //#region  Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            ChargecodeMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ChargecodeMenuCtrl.ePage.Entities.Header.Validations) {
                ChargecodeMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ChargecodeMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": chargecodeConfig.Entities.API.ChargecodeGroup.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", chargecodeConfig.Entities.API.ChargecodeGroup.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        ChargecodeMenuCtrl.ePage.Masters.UIChargecodeList = response.data.Response;
                    }

                    var _count = ChargecodeMenuCtrl.ePage.Masters.UIChargecodeList.some(function (value, key) {
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
                ChargecodeMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ChargecodeMenuCtrl.currentChargecode);
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            ChargecodeMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ChargecodeMenuCtrl.ePage.Masters.DisableSave = true;

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

            helperService.SaveEntity($item, 'Chargecode').then(function (response) {
                ChargecodeMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ChargecodeMenuCtrl.ePage.Masters.DisableSave = false;

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