(function () {
    "use strict";
    angular
        .module("Application")
        .controller("CompanyMenuController", CompanyMenuController);

    CompanyMenuController.$inject = ["authService", "apiService", "toastr", "companyConfig", "helperService"];

    function CompanyMenuController(authService, apiService, toastr, companyConfig, helperService) {
        var CompanyMenuCtrl = this;

        function Init() {
            var currentCompany = CompanyMenuCtrl.currentCompany[CompanyMenuCtrl.currentCompany.code].ePage.Entities;

            CompanyMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "CompanyMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCompany
            };

            CompanyMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            CompanyMenuCtrl.ePage.Masters.DisableSave = false;
            CompanyMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            CompanyMenuCtrl.ePage.Masters.DeactivateButtonText = "Deactivate";
            CompanyMenuCtrl.ePage.Masters.isDeactivate = true;
            CompanyMenuCtrl.ePage.Masters.isActivate = true;
            CompanyMenuCtrl.ePage.Masters.Config = companyConfig;

            /* Function */
            CompanyMenuCtrl.ePage.Masters.Activate = Activate;
            CompanyMenuCtrl.ePage.Masters.Deactivate = Deactivate;
            CompanyMenuCtrl.ePage.Masters.Validation = Validation;

            InitActivateDeactivate();
        }

        //#region InitActivateDeactivate
        function InitActivateDeactivate() {
            if (!CompanyMenuCtrl.currentCompany.isNew && CompanyMenuCtrl.ePage.Entities.Header.Data.UICmpCompany.IsActive) {
                CompanyMenuCtrl.ePage.Masters.isActivate = true;
                CompanyMenuCtrl.ePage.Masters.isDeactivate = false;
            }
            else if (!CompanyMenuCtrl.currentCompany.isNew && !CompanyMenuCtrl.ePage.Entities.Header.Data.UICmpCompany.IsActive) {
                CompanyMenuCtrl.ePage.Masters.isActivate = false;
                CompanyMenuCtrl.ePage.Masters.isDeactivate = true;
            }
        }
        //#endregion

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            CompanyMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (CompanyMenuCtrl.ePage.Entities.Header.Validations) {
                CompanyMenuCtrl.ePage.Masters.Config.RemoveApiErrors(CompanyMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": companyConfig.Entities.API.Company.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", companyConfig.Entities.API.Company.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        CompanyMenuCtrl.ePage.Masters.UICompany = response.data.Response;
                    }
                    var _count = CompanyMenuCtrl.ePage.Masters.UICompany.some(function (value, key) {
                        if (value.Code == _input.UICmpCompany.Code) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if ($item.isNew && _count) {
                        toastr.error("Code is Unique, Rename the Code!.");
                    } else {
                        Save($item);
                    }
                });
            } else {
                CompanyMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(CompanyMenuCtrl.currentCompany);
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            CompanyMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CompanyMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UICmpCompany.PK = _input.PK;
                _input.UICmpCompany.CreatedBy = authService.getUserInfo().UserId;
                _input.UICmpCompany.CreatedDateTime = new Date();
                _input.UICmpCompany.Source = "ERP";
                _input.UICmpCompany.TenantCode = "20CUB";
                _input.UICmpCompany.IsActive = true;
                _input.UICmpCompany.IsValid = true;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                if ($item[$item.code].ePage.Entities.Header.Data.UICurrencyUplift.length > 0) {
                    $item[$item.code].ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                        (value.PK) ? value.IsModified = true : value.IsModified = false;
                    });
                }
            }

            helperService.SaveEntity($item, 'Company').then(function (response) {
                CompanyMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                CompanyMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = companyConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(CompanyMenuCtrl.currentCompany[CompanyMenuCtrl.currentCompany.code].ePage.Entities.Header.Data.PK);

                    companyConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = CompanyMenuCtrl.ePage.Entities.Header.Data.UICmpCompany.Code;
                                value[CompanyMenuCtrl.ePage.Entities.Header.Data.UICmpCompany.Code] = value.isNew;
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

        //#region Activate, Deactivate
        function Activate() {
            CompanyMenuCtrl.ePage.Masters.isActivate = true;
            CompanyMenuCtrl.ePage.Masters.isDeactivate = false;
            CompanyMenuCtrl.ePage.Entities.Header.Data.UICmpCompany.IsActive = true;
        }

        function Deactivate($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                toastr.error("New Company should not be deactivate.");
            }
            else {
                var _filter = {
                    "Cmppk": _input.PK,
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": companyConfig.Entities.API.Company.API.ValidateCompany.FilterID
                };
                apiService.post("eAxisAPI", companyConfig.Entities.API.Company.API.ValidateCompany.Url, _input).then(function (response) {
                    if (response.data.Response.length > 0) {
                        CompanyMenuCtrl.ePage.Masters.UICompanyList = response.data.Response;

                        var _isDeactivate = CompanyMenuCtrl.ePage.Masters.UICompanyList.some(function (value, key) {
                            if (value.IsActive != "true") {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });

                        if (_isDeactivate) {
                            toastr.error("Can't Deactivate the Company untill all the open transaction get closed");
                        }
                        else {
                            CompanyMenuCtrl.ePage.Masters.isDeactivate = true;
                            CompanyMenuCtrl.ePage.Masters.isActivate = false;
                            CompanyMenuCtrl.ePage.Entities.Header.Data.UICmpCompany.IsActive = false;
                        }
                    }
                    else if (response.data.Response.length == 0) {
                        CompanyMenuCtrl.ePage.Masters.isDeactivate = true;
                        CompanyMenuCtrl.ePage.Masters.isActivate = false;
                        CompanyMenuCtrl.ePage.Entities.Header.Data.UICmpCompany.IsActive = false;
                    }
                });
            }
        }
        //#endregion

        Init();
    }
})();
