(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolMenuController", ConsolMenuController);

    ConsolMenuController.$inject = ["$rootScope", "$injector", "$location", "helperService", "appConfig", "authService", "apiService", "consolidationConfig", "errorWarningService", "confirmation", "$ocLazyLoad"];

    function ConsolMenuController($rootScope, $injector, $location, helperService, appConfig, authService, apiService, consolidationConfig, errorWarningService, confirmation, $ocLazyLoad) {
        var ConsolMenuCtrl = this;

        function Init() {
            var currentConsol = ConsolMenuCtrl.currentConsol[ConsolMenuCtrl.currentConsol.label].ePage.Entities;
            ConsolMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ConsolMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ConsolMenuCtrl.ePage.Masters.ConsolMenu = {};
            ConsolMenuCtrl.ePage.Masters.MyTask = {};
            ConsolMenuCtrl.ePage.Masters.Config = consolidationConfig
            ConsolMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConsolMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consolidation.Entity[ConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
            ConsolMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consolidation.Entity[ConsolMenuCtrl.currentConsol.code];

            // Standard Menu Configuration and Data
            // ConsolMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.ConsolHeader;
            // ConsolMenuCtrl.ePage.Masters.StandardMenuInput.obj = ConsolMenuCtrl.currentConsol;


            // Menu list from configuration

            var _menuList = angular.copy(ConsolMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (ConsolMenuCtrl.currentConsol.isNew) {
                _menuList[_index].IsDisabled = true;

                ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource = _menuList;
                ConsolMenuCtrl.ePage.Masters.ActiveMenu = ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource[0];
            } else {
                GetMyTaskList(_menuList, _index);
            }

            // Save
            // ConsolMenuCtrl.ePage.Masters.Save = Save;
            // ConsolMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            // ConsolMenuCtrl.ePage.Masters.IsDisableSave = false;
            ConsolMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            ConsolMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
        }

        function GetMyTaskList(menuList, index) {
            var _DocumentConfig = {
                // IsDisableRefreshButton: true,
                // IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                // IsDisableRelatedDocument: true,
                // IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };

            var _CommentConfig = {
                // IsDisableRefreshButton: true,
                // IsDisableCommentType: true
            };

            var _menuList = menuList,
                _index = index;
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                EntityRefKey: ConsolMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: ConsolMenuCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            var _response = response.data.Response;
                            var _arr = [];
                            if (_response.length > 0) {
                                _response.map(function (value, key) {
                                    value.AvailableObj = {
                                        RadioBtnOption: "Me",
                                        SaveBtnText: "Submit",
                                        IsDisableSaveBtn: false
                                    };
                                    value.AssignedObj = {
                                        RadioBtnOption: "MoveToQueue",
                                        SaveBtnText: "Submit",
                                        IsDisableSaveBtn: false
                                    };
                                    value.AdhocObj = {
                                        AssignTo: ""
                                    };

                                    if (value.OtherConfig) {
                                        if (typeof value.OtherConfig == "string") {
                                            value.OtherConfig = JSON.parse(value.OtherConfig);
                                        }
                                        if (value.OtherConfig) {
                                            if (value.OtherConfig.Directives) {
                                                var _index = value.OtherConfig.Directives.ListPage.indexOf(",");
                                                if (_index != -1) {
                                                    var _split = value.OtherConfig.Directives.ListPage.split(",");

                                                    if (_split.length > 0) {
                                                        _split.map(function (value, key) {
                                                            var _index = _arr.map(function (value1, key1) {
                                                                return value1;
                                                            }).indexOf(value);
                                                            if (_index == -1) {
                                                                _arr.push(value);
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    var _index = _arr.indexOf(value.OtherConfig.Directives.ListPage);
                                                    if (_index == -1) {
                                                        _arr.push(value.OtherConfig.Directives.ListPage);
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (value.RelatedProcess) {
                                        if (typeof value.RelatedProcess == "string") {
                                            value.RelatedProcess = JSON.parse(value.RelatedProcess);
                                        }
                                    }

                                    var _StandardMenuInput = {
                                        // Entity
                                        // "Entity": value.ProcessName,
                                        "Entity": value.WSI_StepCode,
                                        "Communication": null,
                                        "Config": undefined,
                                        "EntityRefKey": value.EntityRefKey,
                                        "EntityRefCode": value.KeyReference,
                                        "EntitySource": value.EntitySource,
                                        // Parent Entity
                                        "ParentEntityRefKey": value.PK,
                                        "ParentEntityRefCode": value.WSI_StepCode,
                                        "ParentEntitySource": value.EntitySource,
                                        // Additional Entity
                                        "AdditionalEntityRefKey": value.ParentEntityRefKey,
                                        "AdditionalEntityRefCode": value.ParentKeyReference,
                                        "AdditionalEntitySource": value.ParentEntitySource,
                                        "IsDisableParentEntity": true,
                                        "IsDisableAdditionalEntity": true
                                    };

                                    value.StandardMenuInput = _StandardMenuInput;
                                    value.DocumentConfig = _DocumentConfig;
                                    value.CommentConfig = _CommentConfig;
                                });
                            }

                            if (_arr.length > 0) {
                                _arr = _arr.filter(function (e) {
                                    return e;
                                });
                                $ocLazyLoad.load(_arr).then(function () {
                                    ConsolMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                                });
                            } else {
                                ConsolMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            }
                        } else {
                            if (_index != -1) {
                                _menuList[_index].IsDisabled = true;
                            }
                        }
                    } else {
                        ConsolMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }

                    ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource = _menuList;

                    var _isEnabledFirestTab = false;
                    ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource.map(function (value, key) {
                        if (!_isEnabledFirestTab && !value.IsDisabled) {
                            OnMenuClick(value);
                            _isEnabledFirestTab = true;
                        }
                    });
                });
            });
        }

        function OnMenuClick($item) {
            if ($item) {
                ConsolMenuCtrl.ePage.Masters.ActiveMenu = $item;
                ConsolMenuCtrl.activeTab = ConsolMenuCtrl.ePage.Masters.ActiveMenu;
            }
        }

        function TabSelected(tab, $index, $event) {
            var Config = undefined;
            Config = $injector.get("consolidationConfig");

            var _index = Config.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ConsolMenuCtrl.currentConsol[ConsolMenuCtrl.currentConsol.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (Config.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'Yes',
                            headerText: 'Save before tab change..',
                            bodyText: 'Do you want to save?'
                        };
                        confirmation.showModal({}, modalOptions).then(function (result) {
                            consolidationConfig.GeneralValidation(ConsolMenuCtrl.currentConsol).then(function (response) {
                                var _errorcount = errorWarningService.Modules.Consol.Entity[ConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
                                ConsolMenuCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Consol.Entity[ConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
                                if (_errorcount.length == 0) {
                                    Save(ConsolMenuCtrl.currentConsol);
                                } else {
                                    helperService.scrollElement('top')
                                    consolidationConfig.ShowErrorWarningModal(ConsolMenuCtrl.currentConsol);
                                }
                            });
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            }

        }


        function Save($item) {

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;


            _input.UIConConsolHeader.PK = _input.PK;
            _input.UIConsolExtendedInfo = {}

            helperService.SaveEntity($item, 'Consol').then(function (response) {
                if (response.Status === "success") {
                    var _index = consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(ConsolMenuCtrl.currentConsol.label);

                    if (_index !== -1) {
                        consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        consolidationConfig.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
            });
        }



        Init();
    }
})();