(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_MyTaskController", one_one_MyTaskController);

    one_one_MyTaskController.$inject = ["$ocLazyLoad", "helperService", "appConfig", "apiService", "authService"];

    function one_one_MyTaskController($ocLazyLoad, helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var one_one_MyTaskCtrl = this;

        function Init() {
            var currentObj;
            (one_one_MyTaskCtrl.currentOrder) ? currentObj = one_one_MyTaskCtrl.currentOrder[one_one_MyTaskCtrl.currentOrder.label].ePage.Entities: currentObj = one_one_MyTaskCtrl.obj[one_one_MyTaskCtrl.obj.label].ePage.Entities;

            one_one_MyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            one_one_MyTaskCtrl.ePage.Masters.MyTask = {};

            if (one_one_MyTaskCtrl.listSource) {
                one_one_MyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(one_one_MyTaskCtrl.listSource);
            } else {
                one_one_MyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
            }
            (one_one_MyTaskCtrl.obj) ? GetMyTaskList(): false;
        }

        function GetMyTaskList(menuList, index) {
            var _DocumentConfig = {
                IsDisableGenerate: true
            };
            var _CommentConfig = {};
            var _menuList = menuList,
                _index = index;
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                Status: "AVAILABLE,ASSIGNED",
                EntityRefKey: one_one_MyTaskCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: one_one_MyTaskCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.OrderCumSplitNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

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
                                one_one_MyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            });
                        } else {
                            one_one_MyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                        }
                    }
                }
            });
        }

        Init();
    }
})();