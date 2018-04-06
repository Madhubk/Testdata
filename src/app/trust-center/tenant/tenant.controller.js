(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCTenantController", TCTenantController);

    TCTenantController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr"];

    function TCTenantController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr) {
        /* jshint validthis: true */
        var TCTenantCtrl = this;

        function Init() {
            TCTenantCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Tenant",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCTenantCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            InitBreadcrumb();
            InitTenant();
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCTenantCtrl.ePage.Masters.Breadcrumb = {};
            TCTenantCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCTenantCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "tenant",
                Description: "Tenant",
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

        // ========================Tenant Start========================

        function InitTenant() {
            TCTenantCtrl.ePage.Masters.Tenant = {};
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = {};

            TCTenantCtrl.ePage.Masters.Tenant.Cancel = Cancel;
            TCTenantCtrl.ePage.Masters.Tenant.Save = Save;
            TCTenantCtrl.ePage.Masters.Tenant.Edit = Edit;
            TCTenantCtrl.ePage.Masters.Tenant.OnTenantClick = OnTenantClick;
            TCTenantCtrl.ePage.Masters.Tenant.AddNew = AddNew;

            TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "OK";
            TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;

            GetTenantList();
        }

        function GetTenantList() {
            var _filter = {
                "pageSize": 100,
                "currentPage": 1,
                "SortColumn": "TenantCode",
                "SortType": "desc"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecTenant.API.MasterFindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecTenant.API.MasterFindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCTenantCtrl.ePage.Masters.Tenant.TenantList = response.data.Response;

                    if (TCTenantCtrl.ePage.Masters.Tenant.TenantList.length > 0) {
                        OnTenantClick(TCTenantCtrl.ePage.Masters.Tenant.TenantList[0]);
                    } else {
                        OnTenantClick();
                    }
                } else {
                    TCTenantCtrl.ePage.Masters.Tenant.TenantList = [];
                }
            });
        }

        function AddNew() {
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = {};
            Edit();
        }

        function OnTenantClick($item) {
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy($item);
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy = angular.copy($item);

            if ($item) {
                if (!TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr) {
                    InitLogoUpload(TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant);
                }
            }
        }

        function EditModalInstance() {
            return TCTenantCtrl.ePage.Masters.Tenant.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'tenantEdit'"></div>`
            });
        }

        function Edit() {
            TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "OK";
            TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;

            TCTenantCtrl.ePage.Masters.Tenant.Logo.fileDetails = [];
            TCTenantCtrl.ePage.Masters.Tenant.Logo.fileCount = 0;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "Please Wait...";
            TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = true;

            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.IsModified = true;
            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.IsDeleted = false;

            var _input = [TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant];

            apiService.post("authAPI", appConfig.Entities.SecTenant.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy(_response);
                    var _index = TCTenantCtrl.ePage.Masters.Tenant.TenantList.map(function (e) {
                        return e.PK;
                    }).indexOf(_response.PK);

                    if (_index === -1) {
                        TCTenantCtrl.ePage.Masters.Tenant.TenantList.push(_response);
                    } else {
                        TCTenantCtrl.ePage.Masters.Tenant.TenantList[_index] = _response;
                    }

                    OnTenantClick(TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCTenantCtrl.ePage.Masters.Tenant.SaveBtnText = "OK";
                TCTenantCtrl.ePage.Masters.Tenant.IsDisableSaveBtn = false;
                TCTenantCtrl.ePage.Masters.Tenant.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant) {
                if (TCTenantCtrl.ePage.Masters.Tenant.TenantList.length > 0) {
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy(TCTenantCtrl.ePage.Masters.Tenant.TenantList[0]);
                } else {
                    TCTenantCtrl.ePage.Masters.Tenant.TenantList = undefined;
                }
            } else if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy) {
                var _index = TCTenantCtrl.ePage.Masters.Tenant.TenantList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCTenantCtrl.ePage.Masters.Tenant.ActiveTenantCopy.PK);

                if (_index !== -1) {
                    TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant = angular.copy(TCTenantCtrl.ePage.Masters.Tenant.TenantList[_index]);
                }
            }

            TCTenantCtrl.ePage.Masters.Tenant.EditModal.dismiss('cancel');
        }

        function InitLogoUpload() {
            TCTenantCtrl.ePage.Masters.Tenant.Logo = {};
            TCTenantCtrl.ePage.Masters.Tenant.Logo.autherization = authService.getUserInfo().AuthToken;
            TCTenantCtrl.ePage.Masters.Tenant.Logo.fileDetails = [];
            TCTenantCtrl.ePage.Masters.Tenant.Logo.fileCount = 0;
            TCTenantCtrl.ePage.Masters.Tenant.Logo.fileSize = 1;
            TCTenantCtrl.ePage.Masters.Tenant.Logo.documentTypeList = [{
                Value: "Logo",
                DisplayName: "Logo"
            }];
            var _additionalValue = {
                "Entity": "TrustCenter",
                "Path": "TrustCenter,Tenant"
            };
            TCTenantCtrl.ePage.Masters.Tenant.Logo.additionalValue = JSON.stringify(_additionalValue);
            TCTenantCtrl.ePage.Masters.Tenant.Logo.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            TCTenantCtrl.ePage.Masters.Tenant.Logo.GetUploadedFiles = GetUploadedFiles;
            TCTenantCtrl.ePage.Masters.Tenant.Logo.GetSelectedFiles = GetSelectedFiles;

            GetLogo();
        }

        function GetLogo() {
            var _filter = {
                "EntityRefKey": TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.PK,
                "EntitySource": "TNT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant) {
                            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.JobDocument = response.data.Response;
                            DownloadDocument(response.data.Response[0]);
                        }
                    }
                } else {
                    console.log("Empty response");
                }
            });
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + curDoc.PK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant) {
                            TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.LogoStr = "data:image/jpeg;base64," + response.data.Response.Base64str;
                        }
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function GetUploadedFiles(Files) {
            if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.JobDocument && TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.JobDocument.length > 0) {
                DeleteDocument(Files[0]);
            } else {
                InsertLogo(Files[0]);
            }
        }

        function GetSelectedFiles(Files) {

        }

        function DeleteDocument($item) {
            if (TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.JobDocument) {
                var _DocFK = TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.JobDocument[0].PK;
                apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.Delete.Url + _DocFK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                    if (response.data.Response) {
                        InsertLogo($item);
                    } else {
                        console.log("Empty Documents Response");
                    }
                });
            } else {
                InsertLogo($item);
            }
        }

        function InsertLogo($item) {
            var _input = {
                "FileName": $item.FileName,
                "FileExtension": $item.FileExtension,
                "ContentType": $item.DocType,
                "IsActive": true,
                "IsModified": true,
                "IsDeleted": false,
                "DocFK": $item.Doc_PK,
                "EntitySource": "TNT",
                "EntityRefKey": TCTenantCtrl.ePage.Masters.Tenant.ActiveTenant.PK
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCTenantCtrl.ePage.Masters.Tenant.Logo.fileDetails = [];
                    TCTenantCtrl.ePage.Masters.Tenant.Logo.fileCount = 0;

                    DownloadDocument(response.data.Response[0]);
                } else {
                    console.log("Empty Documents Response");
                }
            });
        }

        // ========================Tenant End========================

        Init();
    }
})();
