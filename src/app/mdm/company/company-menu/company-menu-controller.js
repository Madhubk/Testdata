(function() {
    "use strict";
    angular
        .module("Application")
        .controller("CompanyMenuController", CompanyMenuController);

    CompanyMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT","authService", "apiService", "toastr", "companyConfig", "helperService","errorWarningService"];

    function CompanyMenuController($scope, $timeout, APP_CONSTANT, authService,apiService, toastr,companyConfig, helperService,errorWarningService) {
        var CompanyMenuCtrl = this;

        function Init() {
            var currentCompany = CompanyMenuCtrl.currentCompany[CompanyMenuCtrl.currentCompany.label].ePage.Entities;
            CompanyMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "CompanyMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCompany
            };
            CompanyMenuCtrl.ePage.Masters.CompanyMenu = {};
            CompanyMenuCtrl.ePage.Masters.Config=companyConfig;
            CompanyMenuCtrl.ePage.Masters.SaveButtonText="Save";
            CompanyMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            CompanyMenuCtrl.ePage.Masters.DeactivateButtonText="Deactivate";

            CompanyMenuCtrl.ePage.Masters.isDeactivate = false;
            CompanyMenuCtrl.ePage.Masters.isActivate = true;
            CompanyMenuCtrl.ePage.Masters.Activate=Activate;
            CompanyMenuCtrl.ePage.Masters.Deactivate=Deactivate;
            CompanyMenuCtrl.ePage.Masters.Validation=Validation;

            // Menu list from configuration
            // OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = OrganizationMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }
        
        function Validation($item) {
            debugger;
            var _Data = $item[$item.label].ePage.Entities,
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
                    "FilterID": companyConfig.Entities.Header.API.FindAll.FilterID
                };

                // apiService.post("eAxisAPI", companyConfig.Entities.Header.API.FindAll.Url, _inputField).then(function (response) {
                //     if (response.data.Response) {
                //         CompanyMenuCtrl.ePage.Masters.Data = response.data.Response;
                //     }
                //     var _count = CompanyMenuCtrl.ePage.Masters.Data.some(function (value, key) {
                //         if (value.Code == _input.Code) {
                //             return true;
                //         }
                //         else {
                //             return false;
                //         }
                //     });

                //     if (_count) {
                //         toastr.error("Code is Unique, Rename the Code!.");
                //     } else {
                //         Save($item);
                //     }
                // });
                Save($item);
            } else {
                CompanyMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(CompanyMenuCtrl.currentCompany);
            }
        }
        function Save($item) {
            CompanyMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CompanyMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {                            
                _input.UICmpCompany.CreatedDateTime = new Date();
                _input.UICmpCompany.IsValid = true;
                _input.UICmpCompany.ModifiedBy = authService.getUserInfo().UserId;
                _input.UICmpCompany.CreatedBy = authService.getUserInfo().UserId;
                _input.UICmpCompany.Source = "ERP";
                _input.UICmpCompany.TenantCode = "20CUB";
                _input.UICmpCompany.IsActive = true;
                _input.UICmpCompany.PK=_Data.Header.Data.PK;
                _input.UICmpCompany.CompanyFK =""
                // _input.UICurrencyUplift.CreatedBy=authService.getUserInfo().UserId;
                // _input.UICurrencyUplift.CreatedDate=new Date();
                // _input.UICurrencyUplift.ModifiedBy="";
                // _input.UICurrencyUplift.ModifiedDate="";
                // _input.UICurrencyUplift.IsModified=false;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                if ($item[$item.label].ePage.Entities.Header.Data.UICurrencyUplift.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                        (value.PK) ? value.IsModified = true : value.IsModified = false;
                    });
                }
            }

            helperService.SaveEntity($item, 'Company').then(function (response) {
                CompanyMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                CompanyMenuCtrl.ePage.Masters.DisableSave = false;

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
        function Activate(){
            CompanyMenuCtrl.ePage.Masters.isActivate=true;
            CompanyMenuCtrl.ePage.Masters.isDeactivate=false;
            CompanyDetailsCtrl.ePage.Entities.Header.Data.UICmpCompany.IsActive=true;
            CompanyDetailsCtrl.ePage.Entities.Header.Data.UICmpCompany.IsValid=true;

        }
        // function Deactivate(){
        //     CompanyMenuCtrl.ePage.Masters.DisableDeactivate=true;
        //     CompanyMenuCtrl.ePage.Masters.DisableActivate=false;
        //     CompanyDetailsCtrl.ePage.Entities.Header.Data.UICmpCompany.IsActive=false;
        //     CompanyDetailsCtrl.ePage.Entities.Header.Data.UICmpCompany.IsValid=false;
        // }
        function Deactivate($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                toastr.error("New Branch should not be deactivate.");
            }
            else {
                var _filter = {
                    "Cmppk": _input.PK,
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": companyConfig.Entities.Header.API.ValidateCompany.FilterID
                };
                apiService.post("eAxisAPI", companyConfig.Entities.Header.API.ValidateCompany.Url, _input).then(function (response) {
                    if (response.data.Response.length > 0) {
                        CompanyMenuCtrl.ePage.Masters.Data = response.data.Response;

                        var _isDeactivate = CompanyMenuCtrl.ePage.Masters.Data.some(function (value, key) {
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
        Init();
    }
})();
