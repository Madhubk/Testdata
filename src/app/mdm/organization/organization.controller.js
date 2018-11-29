(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationController", OrganizationController);

    OrganizationController.$inject = ["$timeout", "apiService", "authService", "helperService", "appConfig", "organizationConfig", "toastr"];

    function OrganizationController($timeout, apiService, authService, helperService, appConfig, organizationConfig, toastr) {
        var OrganizationCtrl = this;

        function Init() {
            OrganizationCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": organizationConfig.Entities
            };

            OrganizationCtrl.ePage.Masters.dataEntryName = "OrganizationList";
            OrganizationCtrl.ePage.Masters.config = organizationConfig;

            OrganizationCtrl.ePage.Masters.TabList = [];
            organizationConfig.TabList = [];
            OrganizationCtrl.ePage.Masters.ActiveTabIndex = 0;
            OrganizationCtrl.ePage.Masters.IsTabClick = false;
            OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;

            OrganizationCtrl.ePage.Masters.AddTab = AddTab;
            OrganizationCtrl.ePage.Masters.RemoveTab = RemoveTab;
            OrganizationCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OrganizationCtrl.ePage.Masters.CreateNew = CreateNew;
            OrganizationCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            OrganizationCtrl.ePage.Masters.config.ValidationFindall();

            if (OrganizationCtrl.ePage.Entities.Header.Message == true) {
                CreateNew();
            }

            GetMastersDropDownList();
        }

        function GetMastersDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["LANGUAGE", "ADDRTYPE", "JOBCATEGORY"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                };
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        OrganizationCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                        OrganizationCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                    });
                }
            });

            // country list
            var _inputCountry = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstCountry.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstCountry.API.FindAll.Url, _inputCountry).then(function (response) {
                if (response.data.Response) {
                    OrganizationCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    OrganizationCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });
        }

        function CreateNew() {
            var _isExist = OrganizationCtrl.ePage.Masters.TabList.some(function (value) {
                return value.label === "New";
            });

            if (!_isExist) {
                OrganizationCtrl.ePage.Masters.IsNewOrgClicked = true;

                helperService.getFullObjectUsingGetById(OrganizationCtrl.ePage.Entities.Header.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.OrgHeader,
                            data: response.data.Response
                        };
                        OrganizationCtrl.ePage.Masters.AddTab(_obj, true);
                        OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;
                    } else {
                        console.log("Empty Org Response");
                    }
                });
            } else {
                toastr.warning("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentTab) {
            event.preventDefault();
            event.stopPropagation();
            var _currentTab = currentTab[currentTab.label].ePage.Entities;

            apiService.get("eAxisAPI", OrganizationCtrl.ePage.Entities.Header.API.OrganizationActivityClose.Url + _currentTab.Header.Data.OrgHeader.PK).then(function (response) {});

            OrganizationCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function AddTab(currentTab, isNew) {
            OrganizationCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = OrganizationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentTab.entity.Code)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                OrganizationCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                organizationConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    OrganizationCtrl.ePage.Masters.TabList = response;

                    if (OrganizationCtrl.ePage.Masters.TabList.length > 0) {
                        OrganizationCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.Code) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        OrganizationCtrl.ePage.Masters.ActiveTabIndex = OrganizationCtrl.ePage.Masters.TabList.length;
                        OrganizationCtrl.ePage.Masters.CurrentActiveTab(currentTab.entity.Code, _entity);
                        OrganizationCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            OrganizationCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OrganizationCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNew();
            }
        }

        Init();
    }
})();
