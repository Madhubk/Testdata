(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShareFieldController", ShareFieldController);

    ShareFieldController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ShareFieldController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var ShareFieldCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ShareFieldCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ShareField",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ShareFieldCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            ShareFieldCtrl.ePage.Masters.emptyText = "-";

            try {
                ShareFieldCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ShareFieldCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitShareField();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ShareFieldCtrl.ePage.Masters.Breadcrumb = {};
            ShareFieldCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _shareTableName = "";
            if (ShareFieldCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _shareTableName = " (" + ShareFieldCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            ShareFieldCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "configuration",
                Description: "Configuration",
                Link: "TC/dashboard/" + helperService.encryptData('{"Type":"Configuration", "BreadcrumbTitle": "Configuration"}'),
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "sharetable",
                Description: "Share Table",
                Link: "TC/share-table",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppCode": ShareFieldCtrl.ePage.Masters.QueryString.AppCode,
                    "AppPk": ShareFieldCtrl.ePage.Masters.QueryString.AppPk,
                    "AppName": ShareFieldCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "sharefield",
                Description: "Share Field " + _shareTableName,
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

        // ========================ShareField Start========================

        function InitShareField() {
            ShareFieldCtrl.ePage.Masters.ShareField = {};
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = {};
            ShareFieldCtrl.ePage.Masters.ShareField.Edit = Edit;
            ShareFieldCtrl.ePage.Masters.ShareField.AddNew = AddNew;
            ShareFieldCtrl.ePage.Masters.ShareField.Save = Save;
            ShareFieldCtrl.ePage.Masters.ShareField.Cancel = Cancel;
            ShareFieldCtrl.ePage.Masters.ShareField.OnShareFieldClick = OnShareFieldClick;
            ShareFieldCtrl.ePage.Masters.ShareField.OnShareFieldClick = OnShareFieldClick;
            ShareFieldCtrl.ePage.Masters.ShareField.DeleteConfirmation = DeleteConfirmation;

            ShareFieldCtrl.ePage.Masters.ShareField.SaveBtnText = "OK";
            ShareFieldCtrl.ePage.Masters.ShareField.IsDisableSaveBtn = false;

            ShareFieldCtrl.ePage.Masters.ShareField.DeleteBtnText = "Delete";
            ShareFieldCtrl.ePage.Masters.ShareField.IsDisableDeleteBtn = false;

            GetShareFieldList();
        }

        function GetShareFieldList() {
            var _filter = {
                "SAP_FK": ShareFieldCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
                "ETM_Entity_FK": ShareFieldCtrl.ePage.Masters.QueryString.Entity_PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.FieldMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.FieldMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShareFieldCtrl.ePage.Masters.ShareField.ListSource = response.data.Response;
                    if (ShareFieldCtrl.ePage.Masters.ShareField.ListSource.length > 0) {
                        OnShareFieldClick(ShareFieldCtrl.ePage.Masters.ShareField.ListSource[0]);
                    } else {
                        OnShareFieldClick();
                    }
                } else {
                    ShareFieldCtrl.ePage.Masters.ShareField.ListSource = [];
                }
            });
        }

        function AddNew() {
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = {};
            Edit();
        }

        function OnShareFieldClick($item) {
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = angular.copy($item);
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareFieldCopy = angular.copy($item);
        }

        function EditModalInstance() {
            return ShareFieldCtrl.ePage.Masters.ShareField.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'shareFieldEdit'"></div>`
            });
        }

        function Edit() {
            ShareFieldCtrl.ePage.Masters.ShareField.SaveBtnText = "OK";
            ShareFieldCtrl.ePage.Masters.ShareField.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            ShareFieldCtrl.ePage.Masters.ShareField.SaveBtnText = "Please Wait...";
            ShareFieldCtrl.ePage.Masters.ShareField.IsDisableSaveBtn = true;

            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.IsModified = true;
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.IsDelete = false;
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.TenantCode = authService.getUserInfo().TenantCode;
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.ETM_Entity_FK = ShareFieldCtrl.ePage.Masters.QueryString.Entity_PK;
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.SAP_FK = ShareFieldCtrl.ePage.Masters.QueryString.AppPk;

            var _input = [ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField];
            apiService.post("eAxisAPI", appConfig.Entities.FieldMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = angular.copy(_response);

                    var _index = ShareFieldCtrl.ePage.Masters.ShareField.ListSource.map(function (e) {
                        return e.Field_PK;
                    }).indexOf(_response.Field_PK);

                    if (_index === -1) {
                        ShareFieldCtrl.ePage.Masters.ShareField.ListSource.push(_response);
                    } else {
                        ShareFieldCtrl.ePage.Masters.ShareField.ListSource[_index] = _response;
                    }

                    OnShareFieldClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                ShareFieldCtrl.ePage.Masters.ShareField.SaveBtnText = "OK";
                ShareFieldCtrl.ePage.Masters.ShareField.IsDisableSaveBtn = false;
                ShareFieldCtrl.ePage.Masters.ShareField.EditModal.dismiss('cancel');

            });
        }

        function Cancel() {
            if (!ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField) {
                if (ShareFieldCtrl.ePage.Masters.ShareField.ListSource.length > 0) {
                    ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = angular.copy(ShareFieldCtrl.ePage.Masters.ShareField.ListSource[0]);
                } else {
                    ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = undefined;
                }
            } else if (ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareFieldCopy) {
                var _index = ShareFieldCtrl.ePage.Masters.ShareField.ListSource.map(function (value, key) {
                    return value.Field_PK;
                }).indexOf(ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareFieldCopy.Field_PK);

                if (_index !== -1) {
                    ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = angular.copy(ShareFieldCtrl.ePage.Masters.ShareField.ListSource[_index]);
                }
            }

            ShareFieldCtrl.ePage.Masters.ShareField.EditModal.dismiss('cancel');
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
            ShareFieldCtrl.ePage.Masters.ShareField.DeleteBtnText = "Please Wait...";
            ShareFieldCtrl.ePage.Masters.ShareField.IsDisableDeleteBtn = true;

            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.IsModified = true;
            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.IsDelete = true;
            var _input = [ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField];

            apiService.post("eAxisAPI", appConfig.Entities.FieldMaster.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = ShareFieldCtrl.ePage.Masters.ShareField.ListSource.map(function (value, key) {
                        return value.Field_PK;
                    }).indexOf(ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField.Field_PK);

                    if (_index !== -1) {
                        ShareFieldCtrl.ePage.Masters.ShareField.ListSource.splice(_index, 1);

                        if (ShareFieldCtrl.ePage.Masters.ShareField.ListSource.length > 0) {
                            ShareFieldCtrl.ePage.Masters.ShareField.ActiveShareField = angular.copy(ShareFieldCtrl.ePage.Masters.ShareField.ListSource[0]);
                        } else {
                            OnShareFieldClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }
                ShareFieldCtrl.ePage.Masters.ShareField.DeleteBtnText = "Delete";
                ShareFieldCtrl.ePage.Masters.ShareField.IsDisableDeleteBtn = false;
            });
        }

        // ========================ShareField End========================

        Init();
    }
})();
