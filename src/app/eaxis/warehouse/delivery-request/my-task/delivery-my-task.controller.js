(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryMyTaskController", DeliveryMyTaskController);

    DeliveryMyTaskController.$inject = ["helperService", "appConfig", "apiService", "authService", "$ocLazyLoad"];

    function DeliveryMyTaskController(helperService, appConfig, apiService, authService, $ocLazyLoad) {
        /* jshint validthis: true */
        var DeliveryMyTaskCtrl = this;

        function Init() {
            var currentObj = DeliveryMyTaskCtrl.currentDelivery[DeliveryMyTaskCtrl.currentDelivery.label].ePage.Entities;

            DeliveryMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            DeliveryMyTaskCtrl.ePage.Masters.MyTask = {};

            if (DeliveryMyTaskCtrl.listSource) {
                DeliveryMyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(DeliveryMyTaskCtrl.listSource);
            } else {
                DeliveryMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
            }
            (DeliveryMyTaskCtrl.obj) ? GetMyTaskList() : false;
        }

        function GetTaskList() {
            var _DocumentConfig = {
                IsDisableGenerate: true
            };
            var _CommentConfig = {};
            var _menuList = menuList,
                _index = index;
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                Status: "AVAILABLE,ASSIGNED",
                EntityRefKey: DeliveryMyTaskCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: DeliveryMyTaskCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID
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
                                DeliveryMyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            });
                        } else {
                            DeliveryMyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                        }
                    }
                }
            });
        }

        Init();
    }
})();
