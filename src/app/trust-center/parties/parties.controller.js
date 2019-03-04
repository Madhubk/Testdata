(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PartiesController", PartiesController);

    PartiesController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"]

    function PartiesController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        var PartiesCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            PartiesCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Parties",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PartiesCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            PartiesCtrl.ePage.Masters.emptyText = "-";

            try {
                PartiesCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (PartiesCtrl.ePage.Masters.QueryString.AppPk) {
                    InitApplication();
                    InitBreadcrumb();
                    InitParties();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            PartiesCtrl.ePage.Masters.Breadcrumb = {};
            PartiesCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (PartiesCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + PartiesCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            PartiesCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "application",
                Description: "Application",
                Link: "TC/application",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "parties",
                Description: "Parties " + _breadcrumbTitle,
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        function InitApplication() {
            PartiesCtrl.ePage.Masters.Application = {};
            PartiesCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            PartiesCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!PartiesCtrl.ePage.Masters.Application.ActiveApplication) {
                PartiesCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": PartiesCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": PartiesCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": PartiesCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetPartiesList();
        }

        function InitParties() {
            PartiesCtrl.ePage.Masters.Parties = {};
            PartiesCtrl.ePage.Masters.Parties.ActiveParty = {};

            PartiesCtrl.ePage.Masters.Parties.AddNew = AddNew;
            PartiesCtrl.ePage.Masters.Parties.Edit = Edit;
            PartiesCtrl.ePage.Masters.Parties.Cancel = Cancel;
            PartiesCtrl.ePage.Masters.Parties.Save = Save;
            PartiesCtrl.ePage.Masters.Parties.Delete = DeleteConfirmation;
            PartiesCtrl.ePage.Masters.Parties.OnPartyClick = OnPartyClick;
            PartiesCtrl.ePage.Masters.Parties.OnRedirectLinkClick = OnRedirectLinkClick;

            PartiesCtrl.ePage.Masters.Parties.SaveBtnText = "OK";
            PartiesCtrl.ePage.Masters.Parties.IsDisableSaveBtn = false;

            PartiesCtrl.ePage.Masters.Parties.DeleteBtnText = "Delete";
            PartiesCtrl.ePage.Masters.Parties.IsDisableDeleteBtn = false;

            GetRedirectLinkList();
        }

        function GetPartiesList() {
            PartiesCtrl.ePage.Masters.Parties.ListSource = undefined;
            var _filter = {
                "SAP_FK": PartiesCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    PartiesCtrl.ePage.Masters.Parties.ListSource = response.data.Response;

                    if (PartiesCtrl.ePage.Masters.Parties.ListSource.length > 0) {
                        OnPartyClick(PartiesCtrl.ePage.Masters.Parties.ListSource[0]);
                    } else {
                        OnPartyClick();
                    }
                } else {
                    PartiesCtrl.ePage.Masters.Parties.ListSource = [];
                }
            });
        }

        function OnPartyClick($item) {
            PartiesCtrl.ePage.Masters.Parties.ActiveParty = angular.copy($item);
            PartiesCtrl.ePage.Masters.Parties.ActivePartyCopy = angular.copy($item);

            if (PartiesCtrl.ePage.Masters.Parties.ActiveParty) {
                PartiesCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "SecParties",
                    ObjectId: PartiesCtrl.ePage.Masters.Parties.ActiveParty.PK
                };
                PartiesCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
             }
        }

        function AddNew() {
            PartiesCtrl.ePage.Masters.Parties.ActiveParty = {};
            Edit();
        }

        function EditModalInstance() {
            return PartiesCtrl.ePage.Masters.Parties.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'partiesEdit'"></div>`
            });
        }

        function Edit() {
            PartiesCtrl.ePage.Masters.Parties.SaveBtnText = "OK";
            PartiesCtrl.ePage.Masters.Parties.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            if (PartiesCtrl.ePage.Masters.Parties.ActiveParty.PK) {
                UpdateParty();
            } else {
                InsertParty();
            }
        }

        function InsertParty() {
            PartiesCtrl.ePage.Masters.Parties.SaveBtnText = "Please Wait...";
            PartiesCtrl.ePage.Masters.Parties.IsDisableSaveBtn = true;

            var _input = PartiesCtrl.ePage.Masters.Parties.ActiveParty;
            _input.IsModified = true;
            _input.SAP_FK = PartiesCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.Insert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        var _index = PartiesCtrl.ePage.Masters.Parties.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            PartiesCtrl.ePage.Masters.Parties.ListSource.push(_response);
                        } else {
                            PartiesCtrl.ePage.Masters.Parties.ListSource[_index] = _response;
                        }

                        OnPartyClick(_response);
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                PartiesCtrl.ePage.Masters.Parties.SaveBtnText = "OK";
                PartiesCtrl.ePage.Masters.Parties.IsDisableSaveBtn = false;
                PartiesCtrl.ePage.Masters.Parties.EditModal.dismiss('cancel');
            });
        }

        function UpdateParty() {
            PartiesCtrl.ePage.Masters.Parties.SaveBtnText = "Please Wait...";
            PartiesCtrl.ePage.Masters.Parties.IsDisableSaveBtn = true;

            var _input = PartiesCtrl.ePage.Masters.Parties.ActiveParty;
            _input.IsModified = true;
            _input.SAP_FK = PartiesCtrl.ePage.Masters.Application.ActiveApplication.PK;
            _input.TenantCode = authService.getUserInfo().TenantCode;

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    var _index = PartiesCtrl.ePage.Masters.Parties.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        PartiesCtrl.ePage.Masters.Parties.ListSource.push(_response);
                    } else {
                        PartiesCtrl.ePage.Masters.Parties.ListSource[_index] = _response;
                    }

                    OnPartyClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                PartiesCtrl.ePage.Masters.Parties.SaveBtnText = "OK";
                PartiesCtrl.ePage.Masters.Parties.IsDisableSaveBtn = false;
                PartiesCtrl.ePage.Masters.Parties.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!PartiesCtrl.ePage.Masters.Parties.ActiveParty) {
                if (PartiesCtrl.ePage.Masters.Parties.ListSource.length > 0) {
                    PartiesCtrl.ePage.Masters.Parties.ActiveParty = angular.copy(PartiesCtrl.ePage.Masters.Parties.ListSource[0]);
                } else {
                    PartiesCtrl.ePage.Masters.Parties.ActiveParty = undefined;
                }
            } else if (PartiesCtrl.ePage.Masters.Parties.ActivePartyCopy) {
                var _index = PartiesCtrl.ePage.Masters.Parties.ListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(PartiesCtrl.ePage.Masters.Parties.ActivePartyCopy.PK);

                if (_index !== -1) {
                    PartiesCtrl.ePage.Masters.Parties.ActiveParty = angular.copy(PartiesCtrl.ePage.Masters.Parties.ListSource[_index]);
                }
            }

            PartiesCtrl.ePage.Masters.Parties.EditModal.dismiss('cancel');
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    Delete();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Delete() {
            PartiesCtrl.ePage.Masters.Parties.DeleteBtnText = "Please Wait...";
            PartiesCtrl.ePage.Masters.Parties.IsDisableDeleteBtn = true;

            apiService.get("authAPI", trustCenterConfig.Entities.API.SecParties.API.Delete.Url + PartiesCtrl.ePage.Masters.Parties.ActiveParty.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = PartiesCtrl.ePage.Masters.Parties.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(PartiesCtrl.ePage.Masters.Parties.ActiveParty.PK);

                    if (_index !== -1) {
                        PartiesCtrl.ePage.Masters.Parties.ListSource.splice(_index, 1);
                        if (PartiesCtrl.ePage.Masters.Parties.ListSource.length > 0) {
                            PartiesCtrl.ePage.Masters.Parties.ActiveParty = angular.copy(PartiesCtrl.ePage.Masters.Parties.ListSource[0]);
                        } else {
                            OnPartyClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                PartiesCtrl.ePage.Masters.Parties.DeleteBtnText = "Delete";
                PartiesCtrl.ePage.Masters.Parties.IsDisableDeleteBtn = false;
            });
        }

        function GetRedirectLinkList() {
            PartiesCtrl.ePage.Masters.Parties.RedirectPagetList = [{
                Code: "roles",
                Description: "Roles",
                Icon: "fa fa-user",
                Link: "/TC/roles",
                Color: "#333333"
            }];
        }

        function OnRedirectLinkClick($item) {
            if (PartiesCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": PartiesCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": PartiesCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": PartiesCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = PartiesCtrl.ePage.Masters.QueryString;
            }

            _queryString.Party = PartiesCtrl.ePage.Masters.Parties.ActiveParty;
            _queryString.BreadcrumbTitle = PartiesCtrl.ePage.Masters.Parties.ActiveParty.PartyName;

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        Init();
    }
})();