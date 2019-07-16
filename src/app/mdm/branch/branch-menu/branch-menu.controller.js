(function () {
    "use strict";
    angular
        .module("Application")
        .controller("BranchMenuController", BranchMenuController);

    BranchMenuController.$inject = ["authService", "apiService", "toastr", "branchConfig", "helperService"];

    function BranchMenuController(authService, apiService, toastr, branchConfig, helperService) {
        var BranchMenuCtrl = this;

        function Init() {
            var currentBranch = BranchMenuCtrl.currentBranch[BranchMenuCtrl.currentBranch.code].ePage.Entities;

            BranchMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Branch_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBranch
            };

            BranchMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            BranchMenuCtrl.ePage.Masters.DisableSave = false;
            BranchMenuCtrl.ePage.Masters.DeactivateButtonText = "Deactivate";
            BranchMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            BranchMenuCtrl.ePage.Masters.isActivate = true;
            BranchMenuCtrl.ePage.Masters.isDeactivate = true;
            BranchMenuCtrl.ePage.Masters.Config = branchConfig;

            /* Function */
            BranchMenuCtrl.ePage.Masters.Activate = Activate;
            BranchMenuCtrl.ePage.Masters.Deactivate = Deactivate;
            BranchMenuCtrl.ePage.Masters.Validation = Validation;

            InitActivateDeactivate();
        }

        //#region InitActivateDeactivate
        function InitActivateDeactivate() {
            if (!BranchMenuCtrl.currentBranch.isNew && BranchMenuCtrl.ePage.Entities.Header.Data.IsActive) {
                BranchMenuCtrl.ePage.Masters.isActivate = true;
                BranchMenuCtrl.ePage.Masters.isDeactivate = false;
            }
            else if (!BranchMenuCtrl.currentBranch.isNew && !BranchMenuCtrl.ePage.Entities.Header.Data.IsActive) {
                BranchMenuCtrl.ePage.Masters.isActivate = false;
                BranchMenuCtrl.ePage.Masters.isDeactivate = true;
            }
        }
        //#endregion

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            BranchMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (BranchMenuCtrl.ePage.Entities.Header.Validations) {
                BranchMenuCtrl.ePage.Masters.Config.RemoveApiErrors(BranchMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": branchConfig.Entities.API.Branch.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", branchConfig.Entities.API.Branch.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        BranchMenuCtrl.ePage.Masters.UIBranch = response.data.Response;
                    }
                    var _count = BranchMenuCtrl.ePage.Masters.UIBranch.some(function (value, key) {
                        if (value.Code == _input.UICmpBranch.Code) {
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
                BranchMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(BranchMenuCtrl.currentBranch);
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            BranchMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            BranchMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UICmpBranch.PK = _input.PK;
                _input.UICmpBranch.CreatedBy = authService.getUserInfo().UserId;
                _input.UICmpBranch.CreatedDateTime = new Date();
                _input.UICmpBranch.ModifiedBy = authService.getUserInfo().UserId;
                _input.UICmpBranch.Source = "ERP";
                _input.UICmpBranch.TenantCode = "20CUB";
                _input.UICmpBranch.IsActive = true;
                _input.UICmpBranch.IsValid = true;
                _input.UICmpBranch.Fax = "";
                _input.UICmpBranch.InternalExtension = "";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                if ($item[$item.code].ePage.Entities.Header.Data.UICurrencyUplift.length > 0) {
                    $item[$item.code].ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                        (value.PK) ? value.IsModified = true : value.IsModified = false;
                    });
                }
            }

            helperService.SaveEntity($item, 'Branch').then(function (response) {
                BranchMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                BranchMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = branchConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(BranchMenuCtrl.currentBranch[BranchMenuCtrl.currentBranch.code].ePage.Entities.Header.Data.PK);

                    branchConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = BranchMenuCtrl.ePage.Entities.Header.Data.UICmpBranch.Code;
                                value[BranchMenuCtrl.ePage.Entities.Header.Data.UICmpBranch.Code] = value.isNew;
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
        //#endregion 

        //#region filterObjectUpdate
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
            BranchMenuCtrl.ePage.Masters.isActivate = true;
            BranchMenuCtrl.ePage.Masters.isDeactivate = false;
            BranchMenuCtrl.ePage.Entities.Header.Data.IsActive = true;
        }

        function Deactivate($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                toastr.error("New Branch should not be deactivate.");
            }
            else {
                var _filter = {
                    "Branchpk": _input.PK,
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": branchConfig.Entities.API.Branch.API.ValidateBrannch.FilterID
                };
                apiService.post("eAxisAPI", branchConfig.Entities.API.Branch.API.ValidateBranch.Url, _input).then(function (response) {
                    if (response.data.Response.length > 0) {
                        BranchMenuCtrl.ePage.Masters.UIBranchList = response.data.Response;

                        var _isDeactivate = BranchMenuCtrl.ePage.Masters.UIBranchList.some(function (value, key) {
                            if (value.IsActive != "true") {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });

                        if (_isDeactivate) {
                            toastr.error("Can't Deactivate the Branch untill all the open transaction get closed");
                        }
                        else {
                            BranchMenuCtrl.ePage.Masters.isDeactivate = true;
                            BranchMenuCtrl.ePage.Masters.isActivate = false;
                            BranchMenuCtrl.ePage.Entities.Header.Data.IsActive = false;
                        }
                    }
                    else if (response.data.Response.length == 0) {
                        BranchMenuCtrl.ePage.Masters.isDeactivate = true;
                        BranchMenuCtrl.ePage.Masters.isActivate = false;
                        BranchMenuCtrl.ePage.Entities.Header.Data.IsActive = false;
                    }
                });
            }
        }
        //#endregion

        Init();
    }
})();