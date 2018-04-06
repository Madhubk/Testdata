(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCFilterListController", TCFilterListController);

    TCFilterListController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function TCFilterListController($scope, $location, $uibModal, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var TCFilterListCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCFilterListCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Applictions",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            
            TCFilterListCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            TCFilterListCtrl.ePage.Masters.emptyText = "-";

            try {
                TCFilterListCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCFilterListCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitFilterList();
                }
            } catch (error) {
                console.log(error);
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCFilterListCtrl.ePage.Masters.Breadcrumb = {};
            TCFilterListCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _filterName = "";
            if (TCFilterListCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _filterName = " (" + TCFilterListCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            TCFilterListCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                Code: "filtergroup",
                Description: "Filter Group",
                Link: "TC/filter-group",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppCode": TCFilterListCtrl.ePage.Masters.QueryString.AppCode,
                    "AppPk": TCFilterListCtrl.ePage.Masters.QueryString.AppPk,
                    "AppName": TCFilterListCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "filterlist",
                Description: "Filter List " + _filterName,
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

        // ========================FilterList Start========================

        function InitFilterList() {
            TCFilterListCtrl.ePage.Masters.FilterList = {};
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = {};

            TCFilterListCtrl.ePage.Masters.FilterList.AddNew = AddNew;
            TCFilterListCtrl.ePage.Masters.FilterList.Cancel = Cancel;
            TCFilterListCtrl.ePage.Masters.FilterList.Delete = Delete;
            TCFilterListCtrl.ePage.Masters.FilterList.DeleteConfirmation = DeleteConfirmation;
            TCFilterListCtrl.ePage.Masters.FilterList.Save = Save;
            TCFilterListCtrl.ePage.Masters.FilterList.Edit = Edit;
            TCFilterListCtrl.ePage.Masters.FilterList.OnFilterListClick = OnFilterListClick;

            TCFilterListCtrl.ePage.Masters.FilterList.SaveBtnText = "OK";
            TCFilterListCtrl.ePage.Masters.FilterList.IsDisableSaveBtn = false;
            TCFilterListCtrl.ePage.Masters.FilterList.DeleteBtnText = "Delete";
            TCFilterListCtrl.ePage.Masters.FilterList.IsDisableDeleteBtn = false;

            GetFilterList();
        }

        function GetFilterList() {
            var _filter = {
                "SAP_FK": TCFilterListCtrl.ePage.Masters.QueryString.AppPk,
                "FilterID": TCFilterListCtrl.ePage.Masters.QueryString.FilterID,
                "GroupId": TCFilterListCtrl.ePage.Masters.QueryString.GroupId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ComFilterList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ComFilterList.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCFilterListCtrl.ePage.Masters.FilterList.ListSource = response.data.Response;

                    if (TCFilterListCtrl.ePage.Masters.FilterList.ListSource.length > 0) {
                        OnFilterListClick(TCFilterListCtrl.ePage.Masters.FilterList.ListSource[0]);
                    } else {
                        OnFilterListClick();
                    }
                } else {
                    TCFilterListCtrl.ePage.Masters.FilterList.ListSource = [];
                }
            });
        }

        function AddNew() {
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = {};
            Edit();
        }

        function OnFilterListClick($item) {
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = angular.copy($item);
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterListCopy = angular.copy($item);
        }

        function EditModalInstance() {
            return TCFilterListCtrl.ePage.Masters.FilterList.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'filterListEdit'"></div>`
            });
        }

        function Edit() {
            TCFilterListCtrl.ePage.Masters.FilterList.SaveBtnText = "OK";
            TCFilterListCtrl.ePage.Masters.FilterList.IsDisableSaveBtn = false;

            EditModalInstance().result.then(function (response) {}, function () {
                Cancel();
            });
        }

        function Save() {
            TCFilterListCtrl.ePage.Masters.FilterList.SaveBtnText = "Please Wait...";
            TCFilterListCtrl.ePage.Masters.FilterList.IsDisableSaveBtn = true;

            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.TenantCode = authService.getUserInfo().TenantCode;
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.SAP_FK = TCFilterListCtrl.ePage.Masters.QueryString.AppPk;
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.FilterID = TCFilterListCtrl.ePage.Masters.QueryString.FilterID;
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.IsModified = true;
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.IsDeleted = false;

            var _input = [TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList];

            apiService.post("eAxisAPI", appConfig.Entities.ComFilterList.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = angular.copy(_response);
                    var _index = TCFilterListCtrl.ePage.Masters.FilterList.ListSource.map(function (e) {
                        return e.Id;
                    }).indexOf(_response.Id);

                    if (_index === -1) {
                        TCFilterListCtrl.ePage.Masters.FilterList.ListSource.push(_response);
                    } else {
                        TCFilterListCtrl.ePage.Masters.FilterList.ListSource[_index] = _response;
                    }
                    OnFilterListClick(TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCFilterListCtrl.ePage.Masters.FilterList.SaveBtnText = "OK";
                TCFilterListCtrl.ePage.Masters.FilterList.IsDisableSaveBtn = false;
                TCFilterListCtrl.ePage.Masters.FilterList.EditModal.dismiss('cancel');
            });
        }

        function Cancel() {
            if (!TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList) {
                if (TCFilterListCtrl.ePage.Masters.FilterList.ListSource.length > 0) {
                    TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = angular.copy(TCFilterListCtrl.ePage.Masters.FilterList.ListSource[0]);
                } else {
                    TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = undefined;
                }
            } else if (TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterListCopy) {
                var _index = TCFilterListCtrl.ePage.Masters.FilterList.ListSource.map(function (value, key) {
                    return value.Id;
                }).indexOf(TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterListCopy.Id);

                if (_index !== -1) {
                    TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = angular.copy(TCFilterListCtrl.ePage.Masters.FilterList.ListSource[_index]);
                }
            }

            TCFilterListCtrl.ePage.Masters.FilterList.EditModal.dismiss('cancel');

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
            TCFilterListCtrl.ePage.Masters.FilterList.DeleteBtnText = "Please Wait...";
            TCFilterListCtrl.ePage.Masters.FilterList.IsDisableDeleteBtn = true;

            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.IsModified = true;
            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.IsDeleted = true;

            var _input = [TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList];

            apiService.post("eAxisAPI", appConfig.Entities.ComFilterList.API.Upsert.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _index = TCFilterListCtrl.ePage.Masters.FilterList.ListSource.map(function (value, key) {
                        return value.Id;
                    }).indexOf(TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList.Id);

                    if (_index !== -1) {
                        TCFilterListCtrl.ePage.Masters.FilterList.ListSource.splice(_index, 1);
                        if (TCFilterListCtrl.ePage.Masters.FilterList.ListSource.length > 0) {
                            TCFilterListCtrl.ePage.Masters.FilterList.ActiveFilterList = angular.copy(TCFilterListCtrl.ePage.Masters.FilterList.ListSource[0]);
                        } else {
                            OnFilterListClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                TCFilterListCtrl.ePage.Masters.FilterList.DeleteBtnText = "Delete";
                TCFilterListCtrl.ePage.Masters.FilterList.IsDisableDeleteBtn = false;
            });
        }

        // ========================FilterList End========================

        Init();
    }
})();
