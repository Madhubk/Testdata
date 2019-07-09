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

            GLaccountMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            GLaccountMenuCtrl.ePage.Masters.DisableSave = false;
            GLaccountMenuCtrl.ePage.Masters.Config = glaccountConfig;

            /* Function */
            GLaccountMenuCtrl.ePage.Masters.Validation = Validation;
        }

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            Save($item);
        }
        //#endregion

        //#region Save
        function Save($item) {
            GLaccountMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            GLaccountMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIAccGLHeader.PK = _input.PK;
                _input.UIAccGLHeader.CreatedBy = authService.getUserInfo().UserId;
                _input.UIAccGLHeader.CreatedDateTime = new Date();
                _input.UIAccGLHeader.Source = "ERP";
                _input.UIAccGLHeader.TenantCode = "20CUB";
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
                                value.label = GLaccountMenuCtrl.ePage.Entities.Header.Data.UIAccGLHeader.AccountNum;
                                value[GLaccountMenuCtrl.ePage.Entities.Header.Data.UIAccGLHeader.AccountNum] = value.isNew;
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

        Init()
    }
})();