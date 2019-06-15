(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BranchController", BranchController);

    BranchController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "branchConfig", "toastr"];

    function BranchController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, branchConfig, toastr) {
        var BranchCtrl = this;

        function Init() {
            BranchCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Branch",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": branchConfig.Entities
            };
            BranchCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };
            // For list directive
            BranchCtrl.ePage.Masters.IsDisableSave = false;
            BranchCtrl.ePage.Masters.dataEntryName = "CmpBranch";
            BranchCtrl.ePage.Masters.Title = "Branch";
            BranchCtrl.ePage.Masters.SaveButtonText = "Save";
            BranchCtrl.ePage.Masters.Save = Save;
            BranchCtrl.ePage.Masters.TabList = [];
            BranchCtrl.ePage.Masters.AddTab = AddTab;
            BranchCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            BranchCtrl.ePage.Masters.RemoveTab = RemoveTab;
            BranchCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            BranchCtrl.ePage.Masters.CreateNewBranch = CreateNewBranch;
            branchConfig.ValidationFindall();
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                BranchCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentBranch, isNew) {
            BranchCtrl.ePage.Masters.currentBranch = undefined;
            var _isExist = BranchCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentBranch.entity.Code;
                } else {
                    return false;

                }
            });
            if (!_isExist) {
                BranchCtrl.ePage.Masters.IsTabClick = true;
                var _currentBranch = undefined;
                if (!isNew) {
                    _currentBranch = isNew.entity;
                } else {
                    _currentBranch = currentBranch;
                }
                branchConfig.AddBranch(currentBranch, isNew).then(function (response) {
                    var _entity = {};
                    BranchCtrl.ePage.Masters.TabList = response;                    
                    $timeout(function () {
                        BranchCtrl.ePage.Masters.activeTabIndex = BranchCtrl.ePage.Masters.TabList.length;
                        BranchCtrl.ePage.Masters.CurrentActiveTab(currentBranch.entity.PK);
                        BranchCtrl.ePage.Masters.IsTabClick = false;

                    });
                });
            } else {
                toastr.info('Branch already opened ');
            }
        }

        function RemoveTab(event, index, currentBranch) {
            event.preventDefault();
            event.stopPropagation();
            var currentBranch = currentBranch[currentBranch.label].ePage.Entities;
            BranchCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewBranch() {
            var _isExist = BranchCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                BranchCtrl.ePage.Entities.Header.Message = false;
                BranchCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(BranchCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response,
                            // Validations: response.data.Response.Validations
                        };
                        BranchCtrl.ePage.Masters.AddTab(_obj, true);
                        BranchCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Branch response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function Save(currentBranch) {
            BranchCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            BranchCtrl.ePage.Masters.IsDisableSave = true;
            var _BranchData = currentBranch[currentBranch.label].ePage.Entities;
            var _input = _BranchData.Header.Data,
                _api;
            if (currentBranch.isNew) {
                _input = filterObject(_input, "PK");
                _input.PK = _input.PK;
                _api = "CmpBranch/Insert";
            } else {
                _input.IsModified = true;
                _api = "CmpBranch/Update";

            }
            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                BranchCtrl.ePage.Masters.SaveButtonText = "Save";
                BranchCtrl.ePage.Masters.IsDisableSave = false;
            }, function (response) {
                console.log("Error : " + response);
                BranchCtrl.ePage.Masters.SaveButtonText = "Save";
                BranchCtrl.ePage.Masters.IsDisableSave = false;

            });
        }
        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            BranchCtrl.ePage.Masters.currentBranch = currentTab;
        }
        function GetValidationList(currentTab, entity) {
            var _obj = {
                ModuleName: ["Finance"],
                Code: [currentTab],
                API: "Group",
                //API: "Validation",
                FilterInput: {
                    ModuleCode: "Finance",
                    SubModuleCode: "JBA",
                },
                GroupCode: "",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }

        Init();
    }
})();
