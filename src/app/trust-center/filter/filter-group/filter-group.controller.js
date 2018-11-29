(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCFilterGroupController", TCFilterGroupController);

    TCFilterGroupController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "confirmation", "trustCenterConfig"];

    function TCFilterGroupController($scope, $location, $uibModal, authService, apiService, helperService, toastr, confirmation, trustCenterConfig) {
        /* jshint validthis: true */
        var TCFilterGroupCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCFilterGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Applictions",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCFilterGroupCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            TCFilterGroupCtrl.ePage.Masters.emptyText = "-";

            try {
                TCFilterGroupCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCFilterGroupCtrl.ePage.Masters.QueryString.AppPk) {
                    InitFilterGroup();
                    InitBreadcrumb();
                    InitApplication();
                    InitSortAlphabets();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCFilterGroupCtrl.ePage.Masters.Breadcrumb = {};
            TCFilterGroupCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCFilterGroupCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCFilterGroupCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCFilterGroupCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCFilterGroupCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "filtergroup",
                Description: "Filter Group",
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

        //=========================Application Start=====================

        function InitApplication() {
            TCFilterGroupCtrl.ePage.Masters.Application = {};
            TCFilterGroupCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication) {
                TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCFilterGroupCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCFilterGroupCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCFilterGroupCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetFilterGroupList();
        }
        // ========================Alphabetic Sort Start========================

        function InitSortAlphabets() {
            TCFilterGroupCtrl.ePage.Masters.Sort = {};
            TCFilterGroupCtrl.ePage.Masters.Sort.OnAlphabetClick = OnAlphabetClick;
            TCFilterGroupCtrl.ePage.Masters.Sort.Alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

            OnAlphabetClick(TCFilterGroupCtrl.ePage.Masters.Sort.Alphabets[0]);
        }

        function OnAlphabetClick($item) {
            TCFilterGroupCtrl.ePage.Masters.Sort.ActiveAlphabet = $item;

            if (TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication) {
                GetFilterGroupList();
            }
        }

        // ========================Alphabetic Sort End========================

        // ========================FilterGroup Start========================

        function InitFilterGroup() {
            TCFilterGroupCtrl.ePage.Masters.FilterGroup = {};
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = {};

            TCFilterGroupCtrl.ePage.Masters.FilterGroup.RedirectPagetList = [{
                Code: "FilterList",
                Description: "Filter List",
                Icon: "fa fa-filter",
                Link: "TC/filter-list",
                Color: "#405de6"
            }];

            TCFilterGroupCtrl.ePage.Masters.FilterGroup.Cancel = Cancel;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.AddNew = AddNew;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.Save = Save;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.Edit = Edit;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.DeleteConfirmation = DeleteConfirmation;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.Delete = Delete;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.OnFilterGroupClick = OnFilterGroupClick;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.OnFilterListClick = OnFilterListClick;

            TCFilterGroupCtrl.ePage.Masters.FilterGroup.SaveBtnText = "OK";
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.IsDisableSaveBtn = false;

            TCFilterGroupCtrl.ePage.Masters.FilterGroup.DeleteBtnText = "Delete";
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.IsDisableDeleteBtn = false;
        }

        function AddNew() {
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = {};
            Edit();
        }

        function GetFilterGroupList() {
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList = undefined;
            var _filter = {
                "SAP_FK": TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "FilterCode": TCFilterGroupCtrl.ePage.Masters.Sort.ActiveAlphabet
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ComFilterGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ComFilterGroup.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList = response.data.Response;
                    if (TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.length > 0) {
                        if (TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroupTemp) {
                            OnFilterGroupClick(TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroupTemp);
                        } else {
                            OnFilterGroupClick(TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList[0]);
                        }
                    } else {
                        OnFilterGroupClick();
                    }
                } else {
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList = [];

                }
            });
        }

        function OnFilterGroupClick($item) {
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = angular.copy($item);
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroupCopy = angular.copy($item);

            if ($item) {
                GetFilterList();
            }
        }

        function EditModalInstance() {
            return TCFilterGroupCtrl.ePage.Masters.FilterGroup.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'filterEdit'"></div>`
            });
        }

        function Edit() {
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.SaveBtnText = "OK";
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) { }, function () {
                Cancel();
            });
        }

        function Save() {
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.SaveBtnText = "Please Wait...";
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.IsDisableSaveBtn = true;

            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.SAP_FK = TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication.PK;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.IsModified = true;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.IsDeleted = false;

            var _input = [TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup];

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ComFilterGroup.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    var _firstLetter = TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.FilterCode.substring(0, 1).toUpperCase();

                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = angular.copy(_response);
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroupTemp = angular.copy(_response);

                    if (TCFilterGroupCtrl.ePage.Masters.Sort.ActiveAlphabet != _firstLetter) {
                        OnAlphabetClick(_firstLetter);
                    } else {
                        var _index = TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.map(function (e) {
                            return e.Id;
                        }).indexOf(_response.Id);

                        if (_index === -1) {
                            TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.push(_response);
                        } else {
                            TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList[_index] = _response;
                        }
                    }

                } else {
                    toastr.error("Could not Save...!");
                }

                TCFilterGroupCtrl.ePage.Masters.FilterGroup.SaveBtnText = "OK";
                TCFilterGroupCtrl.ePage.Masters.FilterGroup.IsDisableSaveBtn = false;
                TCFilterGroupCtrl.ePage.Masters.FilterGroup.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup) {
                if (TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.length > 0) {
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = angular.copy(TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList[0]);
                } else {
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = undefined;
                }
            } else if (TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroupCopy) {
                var _index = TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.map(function (value, key) {
                    return value.Id;
                }).indexOf(TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroupCopy.Id);

                if (_index !== -1) {
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = angular.copy(TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList[_index]);
                }
            }

            TCFilterGroupCtrl.ePage.Masters.FilterGroup.EditModal.dismiss('cancel');
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
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.DeleteBtnText = "Please Wait...";
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.IsDisableDeleteBtn = true;

            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.IsModified = true;
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.IsDeleted = true;

            var _input = [TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup];

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ComFilterGroup.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.map(function (value, key) {
                        return value.Id
                    }).indexOf(TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.Id);

                    if (_index !== -1) {
                        TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.splice(_index, 1);
                        if (TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList.length > 0) {
                            TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup = angular.copy(TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterGroupList[0]);
                        } else {
                            OnFilterGroupClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                TCFilterGroupCtrl.ePage.Masters.FilterGroup.DeleteBtnText = "Delete";
                TCFilterGroupCtrl.ePage.Masters.FilterGroup.IsDisableDeleteBtn = false;
            });
        }

        function OnFilterListClick($item) {
            if (TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication) {
                var _queryString = {
                    "AppPk": TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    "AppCode": TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication.AppCode,
                    "AppName": TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication.AppName
                };
            } else {
                var _queryString = TCFilterGroupCtrl.ePage.Masters.QueryString;
            }

            _queryString.FilterID = TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.FilterCode;
            _queryString.GroupId = TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.GroupId;
            _queryString.ModuleCode = TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.ModuleCode;
            _queryString.BreadcrumbTitle = TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.FilterCode;

            $location.path($item.Link + "/" + helperService.encryptData(_queryString));
        }

        function GetFilterList() {
            TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterListSource = undefined;
            var _filter = {
                "SAP_FK": TCFilterGroupCtrl.ePage.Masters.Application.ActiveApplication.PK,
                "FilterID": TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.FilterCode,
                "GroupId": TCFilterGroupCtrl.ePage.Masters.FilterGroup.ActiveFilterGroup.GroupId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ComFilterList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ComFilterList.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterListSource = response.data.Response;
                } else {
                    TCFilterGroupCtrl.ePage.Masters.FilterGroup.FilterListSource = [];
                }
            });
        }

        // ========================FilterGroup End========================


        Init();
    }
})();
