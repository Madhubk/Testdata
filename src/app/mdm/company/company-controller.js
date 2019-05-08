(function() {
    "use strict";

    angular
        .module("Application")
        .controller("CompanyController", CompanyController);

    CompanyController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "companyConfig", "toastr"];

    function CompanyController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, companyConfig, toastr) {
        var CompanyCtrl = this;

        function Init() {
            CompanyCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Branch",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": companyConfig.Entities
            };
            CompanyCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };
            // For list directive
            CompanyCtrl.ePage.Masters.IsDisableSave = false;
            CompanyCtrl.ePage.Masters.dataEntryName = "CmpCompany";
            CompanyCtrl.ePage.Masters.Title ="Company";
            CompanyCtrl.ePage.Masters.SaveButtonText = "Save";
            CompanyCtrl.ePage.Masters.Save = Save;
            CompanyCtrl.ePage.Masters.TabList = [];
            CompanyCtrl.ePage.Masters.AddTab = AddTab;
            CompanyCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CompanyCtrl.ePage.Masters.RemoveTab = RemoveTab;
            CompanyCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            CompanyCtrl.ePage.Masters.CreateNewCompany=CreateNewCompany;
        }
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                CompanyCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentCompany, isNew) {
            CompanyCtrl.ePage.Masters.currentCompany = undefined;
            var _isExist = CompanyCtrl.ePage.Masters.TabList.some(function(value) {
                if (!isNew) {
                    return value.label === currentCompany.entity.Code;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });
            if (!_isExist) {
                CompanyCtrl.ePage.Masters.IsTabClick = true;
                var _currentCompany = undefined;
                if (!isNew) {
                    _currentCompany = _currentCompany.entity;
                } else {
                    _currentCompany = currentCompany;
                }
                companyConfig.AddCompany(currentCompany, isNew).then(function(response) {
                    CompanyCtrl.ePage.Masters.TabList = response;
                    $timeout(function() {
                        CompanyCtrl.ePage.Masters.activeTabIndex = CompanyCtrl.ePage.Masters.TabList.length;
                        if(currentCompany.entity.Code == null){
                            currentCompany.entity.Code="";
                        }
                        CompanyCtrl.ePage.Masters.CurrentActiveTab(currentCompany.entity.Code);
                        CompanyCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Company already opened ');
            }
        }
        function RemoveTab(event, index, currentCompany) {
            event.preventDefault();
            event.stopPropagation();
            var currentCompany = currentCompany[currentCompany.label].ePage.Entities;
            CompanyCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewCompany() {
            var _isExist = CompanyCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                CompanyCtrl.ePage.Entities.CompanyHeader.Message = false;
                CompanyCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(CompanyCtrl.ePage.Entities.CompanyHeader.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response,
                            // Validations: response.data.Response.Validations
                        };
                        CompanyCtrl.ePage.Masters.AddTab(_obj, true);
                        CompanyCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Company response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }


        function Save(currentCompany) {
            CompanyCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CompanyCtrl.ePage.Masters.IsDisableSave = true;
            var _CompData = currentCompany[currentCompany.label].ePage.Entities;
            var _input = _CompData.CompanyHeader.Data,
                _api;
            if (currentCompany.isNew) {
                _input = filterObject(_input, "PK");
                _input.PK = _input.PK;
                _api = "CmpCompany/Insert";
            } else {
                _input.IsModified = true;
                _api = "CmpCompany/Update";

            }
            apiService.post("eAxisAPI", _api, _input).then(function(response) {
                CompanyCtrl.ePage.Masters.SaveButtonText = "Save";
                CompanyCtrl.ePage.Masters.IsDisableSave = false;
            }, function(response) {
                console.log("Error : " + response);
                CompanyCtrl.ePage.Masters.SaveButtonText = "Save";
                CompanyCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }

            CompanyCtrl.ePage.Masters.currentCompany = currentTab;
        }

        Init();
    }
})();
