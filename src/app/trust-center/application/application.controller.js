(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCApplicationController", TCApplicationController);

    TCApplicationController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "jsonEditModal"];

    function TCApplicationController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, jsonEditModal) {
        /* jshint validthis: true */
        var TCApplicationCtrl = this;

        function Init() {
            TCApplicationCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Applictions",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCApplicationCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            InitBreadcrumb();
            InitApplication();
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCApplicationCtrl.ePage.Masters.Breadcrumb = {};
            TCApplicationCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCApplicationCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "application",
                Description: "Application",
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

        // ========================Application Start========================

        function InitApplication() {
            TCApplicationCtrl.ePage.Masters.Application = {};
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = {};

            TCApplicationCtrl.ePage.Masters.Application.Cancel = Cancel;
            TCApplicationCtrl.ePage.Masters.Application.Save = Save;
            TCApplicationCtrl.ePage.Masters.Application.Edit = Edit;
            TCApplicationCtrl.ePage.Masters.Application.OnApplicationClick = OnApplicationClick;
            TCApplicationCtrl.ePage.Masters.Application.OpenJsonModal = OpenJsonModal;
            TCApplicationCtrl.ePage.Masters.Application.OnRedirectListClick = OnRedirectListClick;
            TCApplicationCtrl.ePage.Masters.Application.AddNew = AddNew;
            TCApplicationCtrl.ePage.Masters.Application.AddNewExternalUrl = AddNewExternalUrl;
            TCApplicationCtrl.ePage.Masters.Application.RemoveExternalUrl = RemoveExternalUrl;

            TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
            TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;

            GetRedirectPagetList();
            GetApplicationList();
        }

        function GetApplicationList() {
            TCApplicationCtrl.ePage.Masters.Application.ApplicationList = undefined;

            var _filter = {
                "PageSize": 100,
                "PageNumber": 1,
                "SortColumn": "SAP_AppCode",
                "SortType": "ASC"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecApp.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecApp.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCApplicationCtrl.ePage.Masters.Application.ApplicationList = response.data.Response;

                    if (TCApplicationCtrl.ePage.Masters.Application.ApplicationList.length > 0) {
                        OnApplicationClick(TCApplicationCtrl.ePage.Masters.Application.ApplicationList[0]);
                    } else {
                        OnApplicationClick();
                    }
                } else {
                    TCApplicationCtrl.ePage.Masters.Application.ApplicationList = [];
                }
            });
        }

        function AddNew() {
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = {};
            Edit();
        }

        function OnApplicationClick($item) {
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);
            TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy = angular.copy($item);

            StringifyOtherConfig();

            if ($item) {
                if (!TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr) {
                    InitLogoUpload(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication);
                }

                GetExtenalUrlList();
            }
        }

        function GetExtenalUrlList() {
            TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList = undefined;

            var _filter = {
                "PageSize": 100,
                "PageNumber": 1,
                "SortColumn": "SAP_AppCode",
                "SortType": "ASC",
                "AppCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecAppUrl.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecAppUrl.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList = response.data.Response;
                } else {
                    TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList = [];
                }
            });
        }

        function EditModalInstance() {
            return TCApplicationCtrl.ePage.Masters.Application.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'applicationEdit'"></div>`
            });
        }

        function Edit() {
            TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
            TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;

            TCApplicationCtrl.ePage.Masters.Application.Logo.fileDetails = [];
            TCApplicationCtrl.ePage.Masters.Application.Logo.fileCount = 0;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function AddNewExternalUrl() {
            var _obj = {
                "InternalUrl": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.InternalUrl,
                "IsActive": true,
                "IsModified": true,
                "IsDeleted": false,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_FK": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "AppName": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppName
            };

            TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList.push(_obj);
        }

        function RemoveExternalUrl($item, $index) {
            $item.IsDeleted = true;
            $item.IsModified = true;
        }

        function Save() {
            TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "Please Wait...";
            TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = true;

            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK) {
                if (TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList.length > 0) {
                    TCApplicationCtrl.ePage.Masters.Application.ExternalUrlList.map(function (value, key) {
                        if (value.IsModified && value.ExternalUrl) {
                            SaveExternalUrl(value);
                        }
                    });
                }
            }

            var _input = angular.copy(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication);
            _input.TenantCode = authService.getUserInfo().TenantCode;

            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.IsModified) {
                apiService.post("authAPI", appConfig.Entities.SecApp.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        var _response = response.data.Response[0];
                        TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(_response);
                        var _index = TCApplicationCtrl.ePage.Masters.Application.ApplicationList.map(function (e) {
                            return e.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            TCApplicationCtrl.ePage.Masters.Application.ApplicationList.push(_response);
                        } else {
                            TCApplicationCtrl.ePage.Masters.Application.ApplicationList[_index] = _response;
                        }
                        StringifyOtherConfig();

                        OnApplicationClick(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication);
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
                    TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;
                    // TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
                });
            }
        }

        function SaveExternalUrl($item) {
            var _input = angular.copy($item);

            apiService.post("authAPI", appConfig.Entities.SecAppUrl.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {} else {
                    toastr.error("Could not Save...!");
                }

                if (!TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.IsModified) {
                    TCApplicationCtrl.ePage.Masters.Application.SaveBtnText = "OK";
                    TCApplicationCtrl.ePage.Masters.Application.IsDisableSaveBtn = false;
                    // TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
                }
            });
        }

        function Cancel() {
            if (!TCApplicationCtrl.ePage.Masters.Application.ActiveApplication) {
                if (TCApplicationCtrl.ePage.Masters.Application.ApplicationList.length > 0) {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(TCApplicationCtrl.ePage.Masters.Application.ApplicationList[0]);
                } else {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = undefined;
                }
            } else if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy) {
                var _index = TCApplicationCtrl.ePage.Masters.Application.ApplicationList.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCApplicationCtrl.ePage.Masters.Application.ActiveApplicationCopy.PK);

                if (_index !== -1) {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication = angular.copy(TCApplicationCtrl.ePage.Masters.Application.ApplicationList[_index]);
                }
            }

            StringifyOtherConfig();
            TCApplicationCtrl.ePage.Masters.Application.EditModal.dismiss('cancel');
        }

        function InitLogoUpload() {
            TCApplicationCtrl.ePage.Masters.Application.Logo = {};
            TCApplicationCtrl.ePage.Masters.Application.Logo.autherization = authService.getUserInfo().AuthToken;
            TCApplicationCtrl.ePage.Masters.Application.Logo.fileDetails = [];
            TCApplicationCtrl.ePage.Masters.Application.Logo.fileCount = 0;
            TCApplicationCtrl.ePage.Masters.Application.Logo.fileSize = 1;
            TCApplicationCtrl.ePage.Masters.Application.Logo.documentTypeList = [{
                Value: "Logo",
                DisplayName: "Logo"
            }];
            var _additionalValue = {
                "Entity": "TrustCenter",
                "Path": "TrustCenter,Application"
            };
            TCApplicationCtrl.ePage.Masters.Application.Logo.additionalValue = JSON.stringify(_additionalValue);
            TCApplicationCtrl.ePage.Masters.Application.Logo.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            TCApplicationCtrl.ePage.Masters.Application.Logo.GetUploadedFiles = GetUploadedFiles;
            TCApplicationCtrl.ePage.Masters.Application.Logo.GetSelectedFiles = GetSelectedFiles;

            GetLogo();
        }

        function GetLogo() {
            var _filter = {
                "EntityRefKey": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "EntitySource": "SAP"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication) {
                            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.JobDocument = response.data.Response;
                            DownloadDocument(response.data.Response[0]);
                        }
                    }
                } else {
                    console.log("Empty response");
                }
            });
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + curDoc.PK + "/" + TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication) {
                            TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.LogoStr = "data:image/jpeg;base64," + response.data.Response.Base64str;
                        }
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function GetUploadedFiles(Files) {
            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.JobDocument && TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.JobDocument.length > 0) {
                DeleteDocument(Files[0]);
            } else {
                InsertLogo(Files[0]);
            }
        }

        function GetSelectedFiles(Files) {}

        function DeleteDocument($item) {
            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.JobDocument) {
                var _DocFK = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.JobDocument[0].PK;
                apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.Delete.Url + _DocFK + "/" + TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK).then(function (response) {
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
                "EntitySource": "SAP",
                "EntityRefKey": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCApplicationCtrl.ePage.Masters.Application.Logo.fileDetails = [];
                    TCApplicationCtrl.ePage.Masters.Application.Logo.fileCount = 0;

                    DownloadDocument(response.data.Response[0]);
                } else {
                    console.log("Empty Documents Response");
                }
            });
        }

        function OpenJsonModal() {
            var _attributeJson = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig;
            if (_attributeJson !== undefined && _attributeJson !== null && _attributeJson !== '' && _attributeJson !== ' ') {
                try {
                    if (typeof JSON.parse(_attributeJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig = result;
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }

        function StringifyOtherConfig() {
            if (TCApplicationCtrl.ePage.Masters.Application.ActiveApplication) {
                if (typeof TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig == "object") {
                    TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig = JSON.stringify(TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.OtherConfig);
                }
            }
        }

        function GetRedirectPagetList() {
            TCApplicationCtrl.ePage.Masters.Application.RedirectPagetList = [{
                Code: "Roles",
                Description: "Roles",
                Icon: "fa fa-connectdevelop",
                Link: "TC/roles",
                Color: "#36ad97",
                AppCode: "",
                Type: 2
            }, {
                Code: "ProvideTrustCenterAccess",
                Description: "Provide Trust center Access",
                Icon: "fa fa fa-sign-in",
                Link: "TC/mapping-vertical",
                Color: "#bd081c",
                AppCode: "TC",
                AdditionalData: "APP_TRUST_APP_TNT",
                BreadcrumbTitle: "App Trust Center - APP_TRUST_APP_TNT",
                Type: 1
            }];
        }

        function OnRedirectListClick($item) {
            var _queryString = {
                "AppPk": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "AppCode": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                "AppName": TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppName
            };

            if ($item.Type === 1) {
                _queryString.AppPk = authService.getUserInfo().AppPK;
                _queryString.AppCode = authService.getUserInfo().AppCode;
                _queryString.DisplayName = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppName;
                _queryString.ItemPk = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.PK;
                _queryString.ItemCode = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppCode;
                _queryString.ItemName = "APP";
                _queryString.MappingCode = $item.AdditionalData;
                _queryString.BreadcrumbTitle = $item.BreadcrumbTitle;
            } else if ($item.Type === 2) {
                _queryString.BreadcrumbTitle = TCApplicationCtrl.ePage.Masters.Application.ActiveApplication.AppName;
            }

            if ($item.Link !== "#") {
                $location.path($item.Link + "/" + helperService.encryptData(_queryString));
            }
        }

        // ========================Application End========================

        Init();
    }
})();
