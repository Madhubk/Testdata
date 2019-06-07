(function () {
    "use strict";
    angular
        .module("Application")
        .controller("DepartmentMenuController", DepartmentMenuController);

    DepartmentMenuController.$inject = ["apiService", "departmentConfig", "authService", "helperService", "toastr"];

    function DepartmentMenuController(apiService, departmentConfig, authService, helperService, toastr) {
        var DepartmentMenuCtrl = this;

        function Init() {
            var currentDepartment = DepartmentMenuCtrl.currentDepartment[DepartmentMenuCtrl.currentDepartment.code].ePage.Entities;

            DepartmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "DepartmentMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDepartment
            };

            DepartmentMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            DepartmentMenuCtrl.ePage.Masters.DisableActivate = true;
            DepartmentMenuCtrl.ePage.Masters.DeactivateButtonText = "Deactivate";
            DepartmentMenuCtrl.ePage.Masters.DisableDeactivate = true;
            DepartmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            DepartmentMenuCtrl.ePage.Masters.DisableSave = false;
            DepartmentMenuCtrl.ePage.Masters.Config = departmentConfig;

            /* Function */
            DepartmentMenuCtrl.ePage.Masters.Validation = Validation;
            DepartmentMenuCtrl.ePage.Masters.Activate = Activate;
            DepartmentMenuCtrl.ePage.Masters.Deactivate = Deactivate;

            InitActivateDeactivate();
        }

        //#region InitActivateDeactivate
        function InitActivateDeactivate() {
            if (!DepartmentMenuCtrl.currentDepartment.isNew && DepartmentMenuCtrl.ePage.Entities.Header.Data.IsActive) {
                DepartmentMenuCtrl.ePage.Masters.DisableActivate = true;
                DepartmentMenuCtrl.ePage.Masters.DisableDeactivate = false;
            }
            else if (!DepartmentMenuCtrl.currentDepartment.isNew && !DepartmentMenuCtrl.ePage.Entities.Header.Data.IsActive) {
                DepartmentMenuCtrl.ePage.Masters.DisableActivate = false;
                DepartmentMenuCtrl.ePage.Masters.DisableDeactivate = true;
            }
        }
        //#endregion

        //#region  Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            DepartmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DepartmentMenuCtrl.ePage.Entities.Header.Validations) {
                DepartmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(DepartmentMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": departmentConfig.Entities.API.Department.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", departmentConfig.Entities.API.Department.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        DepartmentMenuCtrl.ePage.Masters.UIDepartmentList = response.data.Response;
                    }

                    var _count = DepartmentMenuCtrl.ePage.Masters.UIDepartmentList.some(function (value, key) {
                        if (value.Code.trim() == _input.Code) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if ($item.isNew && _count) {
                        toastr.error("Code is Unique, Rename the Code!.");
                    } else {
                        if (_input.Code.length > 5) {
                            toastr.error("Code is accept max 5 character only!.");
                        } else if (_input.Desc.length > 75) {
                            toastr.error("Department name is accept max 75 character only!.");
                        } else {
                            Save($item);
                        }
                    }
                });
            } else {
                DepartmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DepartmentMenuCtrl.currentDepartment);
            }
        }
        //#endregion

        //#region  Save
        function Save($item) {
            DepartmentMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            DepartmentMenuCtrl.ePage.Masters.DisableSave = true;

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

            helperService.SaveEntity($item, 'Department').then(function (response) {
                DepartmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                DepartmentMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = departmentConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(DepartmentMenuCtrl.currentDepartment[DepartmentMenuCtrl.currentDepartment.code].ePage.Entities.Header.Data.PK);

                    departmentConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = DepartmentMenuCtrl.ePage.Entities.Header.Data.Code;
                                value[DepartmentMenuCtrl.ePage.Entities.Header.Data.Code] = value.isNew;
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
            DepartmentMenuCtrl.ePage.Masters.DisableActivate = true;
            DepartmentMenuCtrl.ePage.Masters.DisableDeactivate = false;
            DepartmentMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = false;
            DepartmentMenuCtrl.ePage.Entities.Header.Data.IsActive = true;
        }

        function Deactivate($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                toastr.error("New department record should not deactivate.");
            }
            else {
                var _filter = {
                    "Deppk": _input.PK,
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": departmentConfig.Entities.API.AccMastersValidate.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", departmentConfig.Entities.API.AccMastersValidate.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response.length > 0) {
                        DepartmentMenuCtrl.ePage.Masters.UIDeactDepartmentList = response.data.Response;

                        var _isDeactivate = DepartmentMenuCtrl.ePage.Masters.UIDeactDepartmentList.some(function (value, key) {
                            if (value.JOBStatus != "CLS") {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });

                        if (_isDeactivate) {
                            toastr.error("Some open transactions are there in system so can't Deactivate the Department");
                        }
                        else {
                            DepartmentMenuCtrl.ePage.Masters.DisableDeactivate = true;
                            DepartmentMenuCtrl.ePage.Masters.DisableActivate = false;
                            DepartmentMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = true;
                            DepartmentMenuCtrl.ePage.Entities.Header.Data.IsActive = false;
                        }
                    }
                    else if (response.data.Response.length == 0) {
                        DepartmentMenuCtrl.ePage.Masters.DisableDeactivate = true;
                        DepartmentMenuCtrl.ePage.Masters.DisableActivate = false;
                        DepartmentMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = true;
                        DepartmentMenuCtrl.ePage.Entities.Header.Data.IsActive = false;
                    }
                });
            }
        }
        //#endregion

        Init();
    }
})();
