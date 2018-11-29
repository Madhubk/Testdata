(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCUserController", TCUserController);

    TCUserController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "trustCenterConfig"];

    function TCUserController($scope, $location, $uibModal, authService, apiService, helperService, toastr, trustCenterConfig) {
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

            $scope.OnLogoChange = OnLogoChange;
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
                "FilterID": trustCenterConfig.Entities.API.UserExtended.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserExtended.API.FindAll.Url, _input).then(function SuccessCallback(response) {
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
                    GetLogo();
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

                var _input = TCUserCtrl.ePage.Masters.User.ActiveUser;
                _input.TenantCode = authService.getUserInfo().TenantCode;
                _input.IsModified = true;

                apiService.post("authAPI", trustCenterConfig.Entities.API.UserExtended.API[_apiAction].Url, _input).then(function SuccessCallback(response) {
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
                if (TCUserCtrl.ePage.Masters.User.UserList && TCUserCtrl.ePage.Masters.User.UserList.length > 0) {
                    TCUserCtrl.ePage.Masters.User.ActiveUser = angular.copy(TCUserCtrl.ePage.Masters.User.UserList[0]);
                } else {
                    TCUserCtrl.ePage.Masters.User.ActiveUser = undefined;
                }
            } else if (TCUserCtrl.ePage.Masters.User.ActiveUserCopy) {
                TCUserCtrl.ePage.Masters.User.ActiveUser = angular.copy(TCUserCtrl.ePage.Masters.User.ActiveUserCopy);
            }

            TCUserCtrl.ePage.Masters.User.EditModal.dismiss('cancel');
        }

        function OnLogoChange(event, input) {
            var maxSize = input.dataset.maxSize / 1024; // in bytes to KB
            TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = undefined;
            TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = undefined;

            if (input.files.length > 0) {
                var fileSize = input.files[0].size / 1024;

                if (fileSize > maxSize) {
                    toastr.warning('File size should not be more then ' + maxSize + ' KB');
                    TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = TCUserCtrl.ePage.Masters.User.ActiveUser.Logo.Logo;
                    TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = TCUserCtrl.ePage.Masters.User.ActiveUser.Logo.Logo;
                    return false;
                } else {
                    var ext = input.files[0]['name'].substring(input.files[0]['name'].lastIndexOf('.') + 1).toLowerCase();
                    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
                        helperService.getImageBase64Str(input.files[0]).then(function (response) {
                            TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = angular.copy(response);
                            TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = angular.copy(response);
                            SaveLogo();
                        }, function (error) {
                            console.log(error);
                        });
                    }
                }
            }
        }

        function GetLogo() {
            TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = undefined;
            TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = undefined;
            var _filter = {
                "EntitySource": "USR_LOGO",
                "EntityRefKey": TCUserCtrl.ePage.Masters.User.ActiveUser.Id,
                "EntityRefCode": TCUserCtrl.ePage.Masters.User.ActiveUser.UserName
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecLogo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = response.data.Response[0].Logo;
                        TCUserCtrl.ePage.Masters.User.ActiveUser.Logo = response.data.Response[0];
                        TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = response.data.Response[0].Logo;
                        TCUserCtrl.ePage.Masters.User.ActiveUserCopy.Logo = response.data.Response[0];
                    }
                }
            });
        }

        function SaveLogo() {
            if (TCUserCtrl.ePage.Masters.User.ActiveUser.Logo) {
                UpdateLogo();
            } else {
                InsertLogo();
            }
        }

        function InsertLogo() {
            var _input = {
                "EntitySource": "USR_LOGO",
                "EntityRefKey": TCUserCtrl.ePage.Masters.User.ActiveUser.Id,
                "EntityRefCode": TCUserCtrl.ePage.Masters.User.ActiveUser.UserName,
                "Logo": TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr,
                "IsModified": true
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.Insert.Url, [_input]).then(function (response) {
                TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = undefined;
                TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = undefined;
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCUserCtrl.ePage.Masters.User.ActiveUser.Logo = response.data.Response[0];
                        TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = response.data.Response[0].Logo;
                        TCUserCtrl.ePage.Masters.User.ActiveUserCopy.Logo = response.data.Response[0];
                        TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = response.data.Response[0].Logo;
                    }
                } else {
                    toastr.error("Couldn't Upload Logo...!");
                }
            });
        }

        function UpdateLogo() {
            var _input = TCUserCtrl.ePage.Masters.User.ActiveUser.Logo;
            _input.Logo = TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.SecLogo.API.Update.Url, _input).then(function (response) {
                TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = undefined;
                TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = undefined;
                if (response.data.Response) {
                    TCUserCtrl.ePage.Masters.User.ActiveUser.Logo = response.data.Response;
                    TCUserCtrl.ePage.Masters.User.ActiveUser.LogoStr = response.data.Response.Logo;
                    TCUserCtrl.ePage.Masters.User.ActiveUserCopy.Logo = response.data.Response;
                    TCUserCtrl.ePage.Masters.User.ActiveUserCopy.LogoStr = response.data.Response.Logo;
                } else {
                    toastr.error("Couldn't Upload Logo...!");
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
