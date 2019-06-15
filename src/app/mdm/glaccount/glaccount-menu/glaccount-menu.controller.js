(function () {
    "use strict";

    angular.module("Application")
        .controller("GLaccountMenuController", GLaccountMenuController);

        GLaccountMenuController.$inject = ["helperService", "toastr", "authService", "glaccountConfig", "apiService"];

    function GLaccountMenuController(helperService, toastr, authService, glaccountConfig, apiService) {

        var GLaccountMenuCtrl = this;

        function Init() {
            var currentGlaccount = GLaccountMenuCtrl.currentGlaccount[GLaccountMenuCtrl.currentGlaccount.code].ePage.Entities;

            GLaccountMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_GLaccount",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGlaccount
            };

            GLaccountMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            GLaccountMenuCtrl.ePage.Masters.DisableActivate = true;
            GLaccountMenuCtrl.ePage.Masters.DeactivateButtonText = "Deactivate";
            GLaccountMenuCtrl.ePage.Masters.DisableDeactivate = false;
            GLaccountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            GLaccountMenuCtrl.ePage.Masters.DisableSave = false;
            GLaccountMenuCtrl.ePage.Masters.Config = glaccountConfig;

            /* Function */
            GLaccountMenuCtrl.ePage.Masters.Validation = Validation;
            GLaccountMenuCtrl.ePage.Masters.Activate = Activate;
            GLaccountMenuCtrl.ePage.Masters.Deactivate = Deactivate;
        }

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            GLaccountMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (GLaccountMenuCtrl.ePage.Entities.Header.Validations) {
                GLaccountMenuCtrl.ePage.Masters.Config.RemoveApiErrors(GLaccountMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": glaccountConfig.Entities.API.GLaccount.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", glaccountConfig.Entities.API.GLaccount.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        GLaccountMenuCtrl.ePage.Masters.UIGLaccountList = response.data.Response;
                    }

                    var _count = GLaccountMenuCtrl.ePage.Masters.UIGLaccountList.some(function (value, key) {
                        if (value.Code == _input.Code) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if ($item.isNew && _count) {
                        toastr.error("Code is Unique, Rename the Code!.");
                    } else {
                        if (_input.Code.length > 3) {
                            toastr.error("Code is accept max 3 character only!.");
                        } else if ($item.isNew && !_input.IsValid) {
                            toastr.error("New GLaccount can not be deactivate!.");
                        } else {
                            Save($item);
                        }
                    }
                });
            } else {
                GLaccountMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(GLaccountMenuCtrl.currentGlaccount);
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            GLaccountMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            GLaccountMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                _input.CreatedDateTime = new Date();
                _input.ModifiedBy = authService.getUserInfo().UserId;
                _input.CreatedBy = authService.getUserInfo().UserId;
                _input.Source = "ERP";
                _input.TenantCode = "20CUB";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'GLaccount').then(function (response) {
                GLaccountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                GLaccountMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = glaccountConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(GLaccountMenuCtrl.currentGlaccount[GLaccountMenuCtrl.currentGlaccount.code].ePage.Entities.Header.Data.PK);

                    glaccountConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = GLaccountMenuCtrl.ePage.Entities.Header.Data.Code;
                                value[GLaccountMenuCtrl.ePage.Entities.Header.Data.Code] = value.isNew;
                                delete value.isNew;
                            }
                        }
                    });

                    helperService.refreshGrid();
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

        //#region  Activate, Deactivate
        function Activate() {
            GLaccountMenuCtrl.ePage.Masters.DisableActivate = true;
            GLaccountMenuCtrl.ePage.Masters.DisableDeactivate = false;
            GLaccountMenuCtrl.ePage.Entities.Header.Data.IsValid = true;
        }

        function Deactivate() {
            GLaccountMenuCtrl.ePage.Masters.DisableDeactivate = true;
            GLaccountMenuCtrl.ePage.Masters.DisableActivate = false;
            GLaccountMenuCtrl.ePage.Entities.Header.Data.IsValid = false;
        }
        //#endregion

        Init()
    }
})();