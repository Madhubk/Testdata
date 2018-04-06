(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserController", TCUserController);

    TCUserController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr"];

    function TCUserController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr) {
        /* jshint validthis: true */
        var TCUserCtrl = this;

        function Init() {
            TCUserCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_User",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCUserCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCUserCtrl.ePage.Masters.emptyText = "-";

            InitUser();
            InitBreadcrumb();
            InitSortAlphabets();
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCUserCtrl.ePage.Masters.Breadcrumb = {};
            TCUserCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCUserCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "user",
                Description: "User",
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

        // ========================Alphabetic Sort Start========================

        function InitSortAlphabets() {
            TCUserCtrl.ePage.Masters.Sort = {};
            TCUserCtrl.ePage.Masters.Sort.OnAlphabetClick = OnAlphabetClick;
            TCUserCtrl.ePage.Masters.Sort.Alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

            OnAlphabetClick(TCUserCtrl.ePage.Masters.Sort.Alphabets[0]);
        }

        function OnAlphabetClick($item) {
            TCUserCtrl.ePage.Masters.Sort.ActiveAlphabet = $item;
            TCUserCtrl.ePage.Masters.Search = "";
            GetUserList();
        }

        // ========================Alphabetic Sort End========================

        // ========================User Start========================

        function InitUser() {
            TCUserCtrl.ePage.Masters.User = {};
            TCUserCtrl.ePage.Masters.User.ActiveUser = {};

            TCUserCtrl.ePage.Masters.User.Cancel = Cancel;
            TCUserCtrl.ePage.Masters.User.Save = Save;
            TCUserCtrl.ePage.Masters.User.Edit = Edit;
            TCUserCtrl.ePage.Masters.User.OnUserClick = OnUserClick;
            TCUserCtrl.ePage.Masters.User.AddNew = AddNew;
            TCUserCtrl.ePage.Masters.User.SearchUser = SearchUser;

            TCUserCtrl.ePage.Masters.User.SaveBtnText = "OK";
            TCUserCtrl.ePage.Masters.User.IsDisableSaveBtn = false;
        }

        function GetUserList() {
            TCUserCtrl.ePage.Masters.User.UserList = undefined;
            TCUserCtrl.ePage.Masters.User.ActiveUser = undefined;
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "DisplayName": TCUserCtrl.ePage.Masters.Sort.ActiveAlphabet
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCUserCtrl.ePage.Masters.User.UserList = response.data.Response;

                    if (TCUserCtrl.ePage.Masters.User.UserList.length > 0) {
                        if (!TCUserCtrl.ePage.Masters.User.ActiveUserTemp) {
                            OnUserClick(TCUserCtrl.ePage.Masters.User.UserList[0]);
                        } else {
                            OnUserClick(TCUserCtrl.ePage.Masters.User.ActiveUserTemp);
                        }
                    } else {
                        OnUserClick();
                    }
                } else {
                    TCUserCtrl.ePage.Masters.User.UserList = [];
                }
            });
        }

        function AddNew() {
            TCUserCtrl.ePage.Masters.User.ActiveUser = {};
            Edit();
        }

        function OnUserClick($item) {
            TCUserCtrl.ePage.Masters.User.ActiveUser = angular.copy($item);
            TCUserCtrl.ePage.Masters.User.ActiveUserCopy = angular.copy($item);

            if ($item) {
                if (!TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr) {
                    InitLogoUpload(TCUserCtrl.ePage.Masters.User.ActiveUser);
                }
            }
        }

        function EditModalInstance() {
            return TCUserCtrl.ePage.Masters.User.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'userEdit'"></div>`
            });
        }

        function Edit() {
            TCUserCtrl.ePage.Masters.User.SaveBtnText = "OK";
            TCUserCtrl.ePage.Masters.User.IsDisableSaveBtn = false;

            TCUserCtrl.ePage.Masters.User.Logo.fileDetails = [];
            TCUserCtrl.ePage.Masters.User.Logo.fileCount = 0;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            var _apiAction, _isAccessToSave = false;
            if (!TCUserCtrl.ePage.Masters.User.ActiveUser.Id) {
                _apiAction = "Insert";

                if (TCUserCtrl.ePage.Masters.User.ActiveUser.Password === TCUserCtrl.ePage.Masters.User.ActiveUser.ConfirmPassword) {
                    _isAccessToSave = true;
                } else {
                    toastr.error("Password should be same...!");
                }
            } else {
                _apiAction = "Update";
                _isAccessToSave = true;
            }

            if (_isAccessToSave) {
                TCUserCtrl.ePage.Masters.User.SaveBtnText = "Please Wait...";
                TCUserCtrl.ePage.Masters.User.IsDisableSaveBtn = true;

                TCUserCtrl.ePage.Masters.User.ActiveUser.TenantCode = authService.getUserInfo().TenantCode;
                TCUserCtrl.ePage.Masters.User.ActiveUser.IsModified = true;
                TCUserCtrl.ePage.Masters.User.ActiveUser.IsDeleted = false;

                var _input = TCUserCtrl.ePage.Masters.User.ActiveUser;

                apiService.post("authAPI", appConfig.Entities.UserExtended.API[_apiAction].Url, _input).then(function SuccessCallback(response) {
                    var _response = response.data.Response;

                    if (_response) {
                        TCUserCtrl.ePage.Masters.User.ActiveUser = angular.copy(_response);
                        TCUserCtrl.ePage.Masters.User.ActiveUserTemp = angular.copy(_response);
                        var _firstLetter = TCUserCtrl.ePage.Masters.User.ActiveUser.UserName.substring(0, 1).toUpperCase();

                        if (TCUserCtrl.ePage.Masters.Sort.ActiveAlphabet != _firstLetter) {
                            OnAlphabetClick(_firstLetter);
                        } else {
                            var _index = TCUserCtrl.ePage.Masters.User.UserList.map(function (e) {
                                return e.Id;
                            }).indexOf(_response.Id);

                            if (_index === -1) {
                                TCUserCtrl.ePage.Masters.User.UserList.push(_response);
                            } else {
                                TCUserCtrl.ePage.Masters.User.UserList[_index] = _response;
                            }

                            OnUserClick(_response);
                        }
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    TCUserCtrl.ePage.Masters.User.SaveBtnText = "OK";
                    TCUserCtrl.ePage.Masters.User.IsDisableSaveBtn = false;
                    TCUserCtrl.ePage.Masters.User.EditModal.dismiss('cancel');
                });
            }
        }

        function Cancel() {
            if (!TCUserCtrl.ePage.Masters.User.ActiveUser) {
                if (TCUserCtrl.ePage.Masters.User.UserList.length > 0) {
                    TCUserCtrl.ePage.Masters.User.ActiveUser = angular.copy(TCUserCtrl.ePage.Masters.User.UserList[0]);
                } else {
                    TCUserCtrl.ePage.Masters.User.ActiveUser = undefined;
                }
            } else if (TCUserCtrl.ePage.Masters.User.ActiveUserCopy) {
                var _index = TCUserCtrl.ePage.Masters.User.UserList.map(function (value, key) {
                    return value.Id;
                }).indexOf(TCUserCtrl.ePage.Masters.User.ActiveUserCopy.Id);

                if (_index !== -1) {
                    TCUserCtrl.ePage.Masters.User.ActiveUser = angular.copy(TCUserCtrl.ePage.Masters.User.UserList[_index]);
                }
            }

            TCUserCtrl.ePage.Masters.User.EditModal.dismiss('cancel');
        }

        function InitLogoUpload() {
            TCUserCtrl.ePage.Masters.User.Logo = {};
            TCUserCtrl.ePage.Masters.User.Logo.autherization = authService.getUserInfo().AuthToken;
            TCUserCtrl.ePage.Masters.User.Logo.fileDetails = [];
            TCUserCtrl.ePage.Masters.User.Logo.fileCount = 0;
            TCUserCtrl.ePage.Masters.User.Logo.fileSize = 1;
            TCUserCtrl.ePage.Masters.User.Logo.documentTypeList = [{
                Value: "Logo",
                DisplayName: "Logo"
            }];
            var _additionalValue = {
                "Entity": "TrustCenter",
                "Path": "TrustCenter,Users"
            };
            TCUserCtrl.ePage.Masters.User.Logo.additionalValue = JSON.stringify(_additionalValue);
            TCUserCtrl.ePage.Masters.User.Logo.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            TCUserCtrl.ePage.Masters.User.Logo.GetUploadedFiles = GetUploadedFiles;
            TCUserCtrl.ePage.Masters.User.Logo.GetSelectedFiles = GetSelectedFiles;

            GetLogo();
        }

        function GetLogo() {
            var _filter = {
                "EntityRefKey": TCUserCtrl.ePage.Masters.User.ActiveUser.Id,
                "EntitySource": "USR"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (TCUserCtrl.ePage.Masters.User.ActiveUser) {
                            TCUserCtrl.ePage.Masters.User.ActiveUser.JobDocument = response.data.Response;
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
                        if (TCUserCtrl.ePage.Masters.User.ActiveUser) {
                            TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = "data:image/jpeg;base64," + response.data.Response.Base64str;
                        }
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function GetUploadedFiles(Files) {
            if (TCUserCtrl.ePage.Masters.User.ActiveUser.JobDocument && TCUserCtrl.ePage.Masters.User.ActiveUser.JobDocument.length > 0) {
                DeleteDocument(Files[0]);
            } else {
                InsertLogo(Files[0]);
            }
        }

        function GetSelectedFiles(FIles) {

        }

        function DeleteDocument($item) {
            if (TCUserCtrl.ePage.Masters.User.ActiveUser.JobDocument) {
                var _DocFK = TCUserCtrl.ePage.Masters.User.ActiveUser.JobDocument[0].PK;
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
                "EntitySource": "USR",
                "EntityRefKey": TCUserCtrl.ePage.Masters.User.ActiveUser.Id
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCUserCtrl.ePage.Masters.User.Logo.fileDetails = [];
                    TCUserCtrl.ePage.Masters.User.Logo.fileCount = 0;

                    DownloadDocument(response.data.Response[0]);
                } else {
                    console.log("Empty Documents Response");
                }
            });
        }

        function SearchUser() {
            TCUserCtrl.ePage.Masters.Sort.ActiveAlphabet = TCUserCtrl.ePage.Masters.Search;
            GetUserList();
        }

        // ========================User End========================

        Init();
    }
})();
