(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShareTableController", ShareTableController);

    ShareTableController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function ShareTableController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        /* jshint validthis: true */
        var ShareTableCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ShareTableCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ShareTable",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ShareTableCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            ShareTableCtrl.ePage.Masters.emptyText = "-";

            try {
                ShareTableCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ShareTableCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitApplication();
                    InitShareTable();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ShareTableCtrl.ePage.Masters.Breadcrumb = {};
            ShareTableCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            ShareTableCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": ShareTableCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ShareTableCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ShareTableCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "sharetable",
                Description: "Share Table",
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
            ShareTableCtrl.ePage.Masters.Application = {};
            ShareTableCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            ShareTableCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!ShareTableCtrl.ePage.Masters.Application.ActiveApplication)
                ShareTableCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": ShareTableCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ShareTableCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ShareTableCtrl.ePage.Masters.QueryString.AppName
                };

            GetShareTableList();
        }

        // ========================ShareTable Start========================
        function InitShareTable() {
            ShareTableCtrl.ePage.Masters.ShareTable = {};

            ShareTableCtrl.ePage.Masters.ShareTable.Edit = Edit;
            ShareTableCtrl.ePage.Masters.ShareTable.Save = Save;
            ShareTableCtrl.ePage.Masters.ShareTable.AddNew = AddNew;
            ShareTableCtrl.ePage.Masters.ShareTable.Cancel = Cancel;
            ShareTableCtrl.ePage.Masters.ShareTable.OnShareTableClick = OnShareTableClick;
            ShareTableCtrl.ePage.Masters.ShareTable.OnFieldListClick = OnFieldListClick;
            ShareTableCtrl.ePage.Masters.ShareTable.DeleteConfirmation = DeleteConfirmation;

            ShareTableCtrl.ePage.Masters.ShareTable.SaveBtnText = "OK";
            ShareTableCtrl.ePage.Masters.ShareTable.IsDisableSaveBtn = false;

            ShareTableCtrl.ePage.Masters.ShareTable.DeleteBtnText = "Delete";
            ShareTableCtrl.ePage.Masters.ShareTable.IsDisableDeleteBtn = false;

            GetRedirectLinkList();
        }

        function GetShareTableList() {
            ShareTableCtrl.ePage.Masters.ShareTable.ListSource = undefined;
            var _filter = {
                "SAP_FK": ShareTableCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EntityMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntityMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShareTableCtrl.ePage.Masters.ShareTable.ListSource = response.data.Response;

                    if (ShareTableCtrl.ePage.Masters.ShareTable.ListSource.length > 0) {
                        OnShareTableClick(ShareTableCtrl.ePage.Masters.ShareTable.ListSource[0]);
                    } else {
                        OnShareTableClick();
                    }
                } else {
                    ShareTableCtrl.ePage.Masters.ShareTable.ListSource = [];
                }
            });
        }

        function AddNew() {
            ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable = {};
            Edit();
        }

        function OnShareTableClick($item) {
            ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable = angular.copy($item);
            ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTableCopy = angular.copy($item);
        }

        function EditModalInstance() {
            return ShareTableCtrl.ePage.Masters.ShareTable.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'shareTableEdit'"></div>`
            });
        }

        function Edit() {
            ShareTableCtrl.ePage.Masters.ShareTable.SaveBtnText = "OK";
            ShareTableCtrl.ePage.Masters.ShareTable.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) { }, function () {
                Cancel();
            });
        }

        function Save() {
            ShareTableCtrl.ePage.Masters.ShareTable.SaveBtnText = "Please Wait...";
            ShareTableCtrl.ePage.Masters.ShareTable.IsDisableSaveBtn = true;

            var _input = angular.copy(ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable);

            _input.IsModified = true;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.SAP_FK = ShareTableCtrl.ePage.Masters.Application.ActiveApplication.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntityMaster.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable = angular.copy(_response);

                    var _index = ShareTableCtrl.ePage.Masters.ShareTable.ListSource.map(function (e) {
                        return e.Entity_PK;
                    }).indexOf(_response.Entity_PK);

                    if (_index === -1) {
                        ShareTableCtrl.ePage.Masters.ShareTable.ListSource.push(_response);
                    } else {
                        ShareTableCtrl.ePage.Masters.ShareTable.ListSource[_index] = _response;
                    }

                    OnShareTableClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                ShareTableCtrl.ePage.Masters.ShareTable.SaveBtnText = "OK";
                ShareTableCtrl.ePage.Masters.ShareTable.IsDisableSaveBtn = false;
                ShareTableCtrl.ePage.Masters.ShareTable.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable) {
                if (ShareTableCtrl.ePage.Masters.ShareTable.ListSource.length > 0) {
                    ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable = angular.copy(ShareTableCtrl.ePage.Masters.ListSource[0]);
                } else {
                    ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable = undefined;
                }
            } else if (ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTableCopy) {
                var _index = ShareTableCtrl.ePage.Masters.ShareTable.ListSource.map(function (value, key) {
                    return value.Entity_PK;
                }).indexOf(ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTableCopy.Entity_PK);

                if (_index !== -1) {
                    ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable = angular.copy(ShareTableCtrl.ePage.Masters.ShareTable.ListSource[_index]);
                }
            }

            ShareTableCtrl.ePage.Masters.ShareTable.EditModal.dismiss('cancel');
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
            ShareTableCtrl.ePage.Masters.ShareTable.DeleteBtnText = "Please Wait...";
            ShareTableCtrl.ePage.Masters.ShareTable.IsDisableDeleteBtn = true;

            ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable.IsModified = true;
            ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable.IsDelete = true;

            var _input = [ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable];

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EntityMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ShareTableCtrl.ePage.Masters.ShareTable.ListSource.map(function (value, key) {
                        return value.Entity_PK;
                    }).indexOf(ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable.Entity_PK);
                    if (_index !== -1) {
                        ShareTableCtrl.ePage.Masters.ShareTable.ListSource.splice(_index, 1);
                        if (ShareTableCtrl.ePage.Masters.ShareTable.ListSource.length > 0) {
                            ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable = angular.copy(ShareTableCtrl.ePage.Masters.ShareTable.ListSource[0]);
                        } else {
                            OnShareTableClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                ShareTableCtrl.ePage.Masters.ShareTable.DeleteBtnText = "Delete";
                ShareTableCtrl.ePage.Masters.ShareTable.IsDisableDeleteBtn = false;
            });
        }

        function GetRedirectLinkList() {
            ShareTableCtrl.ePage.Masters.ShareTable.RedirectPagetList = [{
                Code: "ShareField",
                Description: "Share Field",
                Icon: "fa fa-share-alt",
                Link: "TC/share-field",
                Color: "#bd081c"
            }];
        }

        function OnFieldListClick() {
            if (ShareTableCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": ShareTableCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": ShareTableCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": ShareTableCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = ShareTableCtrl.ePage.Masters.QueryString;
            }
            _queryString.Entity_PK = ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable.Entity_PK;
            _queryString.BreadcrumbTitle = ShareTableCtrl.ePage.Masters.ShareTable.ActiveShareTable.EntityName;

            $location.path("TC/share-field/" + helperService.encryptData(_queryString));
        }

        // ========================ShareTable End========================

        Init();
    }
})();
