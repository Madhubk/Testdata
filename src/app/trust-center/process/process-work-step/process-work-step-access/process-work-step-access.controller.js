(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessWorkStepAccessModalController", ProcessWorkStepAccessModalController);

    ProcessWorkStepAccessModalController.$inject = ["$location", "authService", "apiService", "helperService", "toastr", "confirmation", "param", "$uibModalInstance", "trustCenterConfig"];

    function ProcessWorkStepAccessModalController($location, authService, apiService, helperService, toastr, confirmation, param, $uibModalInstance, trustCenterConfig) {
        /* jshint validthis: true */
        var ProcessWorkStepAccessModalCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessWorkStepAccessModalCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessWorkStepAccess",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessWorkStepAccessModalCtrl.ePage.Masters.emptyText = "-";

            try {
                ProcessWorkStepAccessModalCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ProcessWorkStepAccessModalCtrl.ePage.Masters.QueryString.AppPk) {
                    InitProcessWorkStepAccess();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitProcessWorkStepAccess() {
            ProcessWorkStepAccessModalCtrl.ePage.Masters.param = param;
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess = {};
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.RemoveRecord = DeleteConfirmation;
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.AddNewRow = AddNewRow;
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.Close = Close;
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.Save = Save;
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.OnAccessChange = OnAccessChange;
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.OnEntitySourceCodeChange = OnEntitySourceCodeChange;

            GetProcessWorkStepAccessList();
            GetSecRoleList();
            GetSecUserList();
            GetCmpDepartmentList();
            GetRoleUserList();
            GetMenuGroupList();
        }

        function GetProcessWorkStepAccessList() {
            var _filter = {
                "WSI_FK": ProcessWorkStepAccessModalCtrl.ePage.Masters.param.Item.PK,

                "SAP_FK": ProcessWorkStepAccessModalCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMWorkStepAccess.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepAccess.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {

                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.ProcessWorkStepAccessList = response.data.Response;

                } else {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.ProcessWorkStepAccessList = [];
                }
            });
        }

        function GetSecRoleList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {

                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.SecRoleList = response.data.Response;
                } else {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.SecRoleList = [];
                }
            });
        }

        function GetSecUserList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.UserExtended.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.UserExtended.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.SecUserList = response.data.Response;
                } else {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.SecUserList = [];
                }
            });
        }

        function GetMenuGroupList() {
            var _filter = {
                "GroupType": "BPMGroups"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.MenuGroups.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.MenuGroups.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {

                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.MenuGroupsList = response.data.Response;
                } else {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.MenuGroupsList = [];
                }
            });
        }

        function GetCmpDepartmentList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CmpDepartment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.CmpDepartmentList = response.data.Response;
                } else {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.CmpDepartmentList = [];
                }
            });
        }

        function GetRoleUserList() {
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.RoleUserList = [{
                Code: "ROLE",
                Name: "ROLE"
            }, {
                Code: "USER",
                Name: "USER"
            }, {
                Code: "GROUP",
                Name: "GROUP"
            }];
        }

        function OnAccessChange(obj) {
            if (obj.EntitySource === 'ROLE') {

            } else if (obj.EntitySource === 'USER') {

            } else if (obj.EntitySource === 'GROUP') {

            }
        }

        function OnEntitySourceCodeChange($item, row) {
            if (row.EntitySource === 'ROLE') {
                row.EntityRefKey = $item.PK;
            } else if (row.EntitySource === 'USER') {
                row.EntityRefKey = $item.Id;
            } else if (row.EntitySource === 'GROUP') {
                row.EntityRefKey = $item.PK;
                GetRoleByParty($item, row);
            }
        }

        function GetRoleByParty($item, row) {
            var _filter = {
                "SAP_Code": ProcessWorkStepAccessModalCtrl.ePage.Masters.QueryString.AppCode,
                "PartyCode": $item.GroupName,
                "GroupType": "BPMGroups"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecMappings.API.GetPartiesByUserApp.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecMappings.API.GetRoleByUserApp.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _filterType = "";
                        response.data.Response.map(function (value, key) {
                            if (value.RoleRef) {
                                _filterType += value.RoleRef + ",";
                            }
                        });

                        row.FilterType = _filterType.slice(0, -1);
                    }
                }
            });
        }

        function DeleteConfirmation($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    RemoveRecord($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveRecord($item, $index) {
            if ($item.PK) {
                $item.IsModified = true;
                $item.IsDeleted = true;

                var _input = [$item];

                apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepAccess.API.Upsert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.ProcessWorkStepAccessList.splice($index, 1);
                    }
                });
            } else {
                ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.ProcessWorkStepAccessList.splice($index, 1);
            }
        }

        function AddNewRow() {
            var _obj = {};
            ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.ProcessWorkStepAccessList.push(_obj);
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function Save($item, $index) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.WSI_FK = ProcessWorkStepAccessModalCtrl.ePage.Masters.param.Item.PK;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepAccess.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepAccessModalCtrl.ePage.Masters.ProcessWorkStepAccess.ProcessWorkStepAccessList[$index] = response.data.Response[0];
                    toastr.success("Saved Successfully...!");
                }
            });
        }


        Init();
    }
})();
