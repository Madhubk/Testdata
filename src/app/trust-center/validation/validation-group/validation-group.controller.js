(function () {
    'use strict'

    angular
        .module("Application")
        .controller("TCValidationGroupController", TCValidationGroupController);

    TCValidationGroupController.$inject = ["authService", "apiService", "helperService", "trustCenterConfig", "$location", "toastr", "$uibModalInstance", "confirmation", "param"];

    function TCValidationGroupController(authService, apiService, helperService, trustCenterConfig, $location, toastr, $uibModalInstance, confirmation, param) {
        /* jshint validthis: true */
        var TCValidationGroupCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCValidationGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Validation_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCValidationGroupCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCValidationGroupCtrl.ePage.Masters.Application = {};
            TCValidationGroupCtrl.ePage.Masters.Application = angular.copy(param);
            try {
                TCValidationGroupCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (TCValidationGroupCtrl.ePage.Masters.QueryString.AppPk) {
                    InitValidationGroup();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitValidationGroup() {
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup = {};
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.AddNewValidationGroup = AddNewValidationGroup;
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.Refresh = Refresh;
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.DeleteValidationGroup = DeleteValidationGroup;
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.DeleteConfirmation = DeleteConfirmation;
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.Close = Close;
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.AddBtnText = "Add";
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.IsDisableAddBtn = false;
            GetValidationList();
        }

        function GetValidationList() {
            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.ListSource = undefined;
            var _filter = {
                SAP_FK: TCValidationGroupCtrl.ePage.Masters.Application.ActiveApplication.PK,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.ValidationGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ValidationGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCValidationGroupCtrl.ePage.Masters.ValidationGroup.ListSource = response.data.Response;
                } else {
                    TCValidationGroupCtrl.ePage.Masters.ValidationGroup.ListSource = [];
                }
            });
        }

        function Refresh() {
            GetValidationList();
        }

        function AddNewValidationGroup() {
            if (TCValidationGroupCtrl.ePage.Masters.ValidationGroup.GroupName) {
                TCValidationGroupCtrl.ePage.Masters.ValidationGroup.AddBtnText = "Please Wait...";
                TCValidationGroupCtrl.ePage.Masters.ValidationGroup.IsDisableAddBtn = true;
                var _input = {
                    GroupName: TCValidationGroupCtrl.ePage.Masters.ValidationGroup.GroupName,
                    Type: "GENERAL",
                    AppCode: authService.getUserInfo().AppCode,
                    SAP_FK: TCValidationGroupCtrl.ePage.Masters.Application.ActiveApplication.PK,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true
                };

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ValidationGroup.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            TCValidationGroupCtrl.ePage.Masters.ValidationGroup.ListSource.push(response.data.Response[0]);
                        }
                    } else {
                        toastr.error("Could not Add...!");
                    }

                    TCValidationGroupCtrl.ePage.Masters.ValidationGroup.AddBtnText = "Add";
                    TCValidationGroupCtrl.ePage.Masters.ValidationGroup.IsDisableAddBtn = false;
                    TCValidationGroupCtrl.ePage.Masters.ValidationGroup.GroupName = undefined;
                });
            } else {
                toastr.warning("GroupName Should not be Empy...!");
            }
        }

        function DeleteConfirmation($item, index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteValidationGroup($item, index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteValidationGroup($item, $index) {
            if ($item) {
                var _input = $item;
                _input.IsModified = true;
                _input.IsDeleted = true;

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.ValidationGroup.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        TCValidationGroupCtrl.ePage.Masters.ValidationGroup.ListSource.splice($index, 1);
                    } else {
                        toastr.error("Could not Add...!");
                    }
                });
            }
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
