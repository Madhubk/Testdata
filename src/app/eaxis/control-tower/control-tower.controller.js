(function () {
    "use strict"

    angular
        .module("Application")
        .controller("ControlTowerController", ControlTowerController);

    ControlTowerController.$inject = ["$scope", "$timeout", "$uibModal", "helperService", "authService", "apiService", "APP_CONSTANT", "appConfig", "dynamicLookupConfig"];

    function ControlTowerController($scope, $timeout, $uibModal, helperService, authService, apiService, APP_CONSTANT, appConfig, dynamicLookupConfig) {
        var ControlTowerCtrl = this;

        function Init() {
            ControlTowerCtrl.ePage = {
                "Title": "",
                "Prefix": "ControlTower",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitControlTower();
        }

        function InitControlTower() {
            ControlTowerCtrl.ePage.Masters.ControlTower = {};

            ControlTowerCtrl.ePage.Masters.ControlTower.Tab = {};
            ControlTowerCtrl.ePage.Masters.ControlTower.Tab.ActiveTabIndex = 0;
            ControlTowerCtrl.ePage.Masters.ControlTower.IsEnableWorkItemCountDir = true;

            ControlTowerCtrl.ePage.Masters.ControlTower.GetSelectedWorkItem = GetSelectedWorkItem;

            ControlTowerCtrl.ePage.Masters.ControlTower.Tab.OnClick = OnTabClick;

            InitFilter();
            GetTabList();
        }

        // region Filter
        function InitFilter() {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter = {};
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ModelValue = {};

            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnFilterBtnClick = OnFilterBtnClick;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.CloseFilter = CloseFilter;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.Apply = ApplyFilter;

           // ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnProcessGroupChange = OnProcessGroupChange;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnOrganizationChangeAutoComplete = OnOrganizationChangeAutoComplete;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnOrganizationChangeLookup = OnOrganizationChangeLookup;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnWarehouseChangeAutoComplete = OnWarehouseChangeAutoComplete;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnWarehouseChangeLookup = OnWarehouseChangeLookup;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnCompanyChangeAutoComplete = OnCompanyChangeAutoComplete;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnCompanyChangeLookup = OnCompanyChangeLookup;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnBranchChangeAutoComplete = OnBranchChangeAutoComplete;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnBranchChangeLookup = OnBranchChangeLookup;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnDepartmentChangeAutoComplete = OnDepartmentChangeAutoComplete;
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.OnDepartmentChangeLookup = OnDepartmentChangeLookup;

            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessMasterList = [];

            GetRelatedLookupList();
            InitDatePicker();
            GetPeriodList();
            GetProcessTopicList();
           // GetProcessGroupList();
            GetUserList();
            GetRoleList();
        }

        function InitDatePicker() {
            ControlTowerCtrl.ePage.Masters.ControlTower.DatePicker = {};
            ControlTowerCtrl.ePage.Masters.ControlTower.DatePicker.Options = APP_CONSTANT.DatePicker;
            ControlTowerCtrl.ePage.Masters.ControlTower.DatePicker.isOpen = false;
            ControlTowerCtrl.ePage.Masters.ControlTower.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            ControlTowerCtrl.ePage.Masters.ControlTower.DatePicker.isOpen = true;
        }

        function GetPeriodList() {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.PeriodList = [{
                Code: "StartDate",
                Description: "Start Date"
            }, {
                Code: "EndDate",
                Description: "End Date"
            }, {
                Code: "AvailableDate",
                Description: "Available Date"
            }, {
                Code: "AssignedDate",
                Description: "Assigned Date"
            }, {
                Code: "DueDate",
                Description: "Due Date"
            }, {
                Code: "WorkStartTime",
                Description: "Work Start Time"
            }];
        }

        function GetProcessTopicList() {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessTopicList = undefined;
                 var _filter = {
                MappingCode: "PROCESS_TOPIC",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };
             var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.FindAll.FilterID
            };
             apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessTopicList = response.data.Response;
                } else {
                    ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessTopicList = [];
                }
            });
        }

        // function GetProcessGroupList() {
        //     ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessGroupList = undefined;
        //     var _filter = {
        //         TypeCode: "PROCESSTYPE",
        //         SAP_FK: authService.getUserInfo().AppPK,
        //         TenantCode: authService.getUserInfo().TenantCode
        //     };

        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
        //         if (response.data.Response) {
        //             ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessGroupList = response.data.Response;
        //         } else {
        //             ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessGroupList = [];
        //         }
        //     });
        // }

        // function GetProcessMasterList() {
        //     ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessMasterList = undefined;
        //     var _filter = {
        //         SAP_FK: authService.getUserInfo().AppPK,
        //         TenantCode: authService.getUserInfo().TenantCode
        //     };

        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessMasterList = response.data.Response;
        //         } else {
        //             ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ProcessMasterList = [];
        //         }
        //     });
        // }

        function GetUserList() {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.UserList = undefined;
            var _filter = {
                MappingCode: 'USER_ROLE_APP_TNT',
                PropertyName: "SMP_ItemCode",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecMappings.API.GetColumnValuesWithFilters.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ControlTowerCtrl.ePage.Masters.ControlTower.Filter.UserList = response.data.Response;
                } else {
                    ControlTowerCtrl.ePage.Masters.ControlTower.Filter.UserList = [];
                }
            });
        }

        function GetRoleList() {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.RoleList = undefined;
            var _filter = {
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecRole.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecRole.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ControlTowerCtrl.ePage.Masters.ControlTower.Filter.RoleList = response.data.Response;
                } else {
                    ControlTowerCtrl.ePage.Masters.ControlTower.Filter.RoleList = [];
                }
            });
        }

        // function OnProcessGroupChange($item) {
        //     GetProcessMasterList();
        // }

        function OnOrganizationChangeAutoComplete($item) {}

        function OnOrganizationChangeLookup($item) {}

        function OnWarehouseChangeAutoComplete($item) {}

        function OnWarehouseChangeLookup($item) {}

        function OnCompanyChangeAutoComplete($item) {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.BranchFilter = {
                CMP_Code: $item.Code
            };
        }

        function OnCompanyChangeLookup($item) {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.BranchFilter = {
                CMP_Code: $item.data.entity.Code
            };
        }

        function OnBranchChangeAutoComplete($item) {}

        function OnBranchChangeLookup($item) {}

        function OnDepartmentChangeAutoComplete($item) {}

        function OnDepartmentChangeLookup($item) {}

        function OnFilterBtnClick() {
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ModelValue = {};

            $('.control-tower-filter-wrapper').toggleClass('open');
        }

        function CloseFilter() {
            $('.control-tower-filter-wrapper').removeClass('open');
        }

        function ApplyFilter() {
            CloseFilter();
            ControlTowerCtrl.ePage.Masters.ControlTower.IsEnableWorkItemCountDir = false;
            var _filterInput = angular.copy(ControlTowerCtrl.ePage.Masters.ControlTower.Filter.ModelValue);
            if (_filterInput.WIP_ProcessName) {
                _filterInput.WIP_ProcessName = _filterInput.WIP_ProcessName.join(",");
            }
            if (_filterInput.Period && _filterInput.PeriodDate) {
                _filterInput[_filterInput.Period] = _filterInput.PeriodDate;
                delete _filterInput.Period;
                delete _filterInput.PeriodDate;
            }
            
            ControlTowerCtrl.ePage.Masters.ControlTower.Filter.FilterInput = _filterInput;
            $timeout(function () {
                ControlTowerCtrl.ePage.Masters.ControlTower.IsEnableWorkItemCountDir = true;
            }, 0);
        }

        // endregion

        function GetTabList() {
            ControlTowerCtrl.ePage.Masters.ControlTower.Tab.ListSource = [{
                Code: "General",
                Description: "General"
            }, {
                Code: "ProActive",
                Description: "Pro Active"
            }, {
                Code: "Overdue",
                Description: "Overdue"
            }, {
                Code: "History",
                Description: "History"
            }];

            ControlTowerCtrl.ePage.Masters.ControlTower.Tab.ActiveTabIndex = 0;
            ControlTowerCtrl.ePage.Masters.ControlTower.Tab.ListSource[0].IsClicked = true;
        }

        function OnTabClick($item) {
            ControlTowerCtrl.ePage.Masters.ControlTower.Tab.ActiveTab = $item;
            if (!$item.IsClicked) {
                $item.IsClicked = true;
            }
        }

        function GetSelectedWorkItem($item, tab) {
            ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItem = $item.Data;
            if ($item.Status) {
                ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItemStatus = $item.Status;
            } else {
                ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItemStatus = undefined;
            }

            OpenTaskListModal().result.then(function (response) {
                ControlTowerCtrl.ePage.Masters.ControlTower.IsEnableWorkItemCountDir = false;
                $timeout(function () {
                    ControlTowerCtrl.ePage.Masters.ControlTower.IsEnableWorkItemCountDir = true;
                });
            }, function () {
                console.log("Cancelled");
            });
        }

        function OpenTaskListModal() {
            return ControlTowerCtrl.ePage.Masters.ControlTower.OpenTaskListModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "control-tower right",
                scope: $scope,
                templateUrl: "app/eaxis/control-tower/control-tower-task-list/control-tower-task-list.html",
                controller: 'ControlTowerTaskListController',
                controllerAs: "ControlTowerTaskListCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var _input = {
                            _filter: {
                                PSM_FK: ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItem.PSM_FK,
                                WSI_FK: ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItem.WSI_FK,
                                WSI_StepType: "ACTIVITY"
                            },
                            ListingPageName: (ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItem.ListingPageName) ? ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItem.ListingPageName : "WorkItemDetails"
                        };

                        if (ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItemStatus) {
                            _input._filter.Status = ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItemStatus;
                        } else {
                            _input._filter.UserStatus = ControlTowerCtrl.ePage.Masters.ControlTower.SelectedWorkItem.UserStatus
                        }

                        return _input;
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "ControlTowerOrgList_3236,ControlTowerWarehouse_3076,ControlTowerCompany_3194,ControlTowerBranch_3132,ControlTowerDepartment_3066",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        Init();
    }
})();
