(function () {
    "use strict";

    angular
        .module("Application")
        .config(function (treeConfig) {
            treeConfig.defaultCollapsed = true;
            treeConfig.appendChildOnHover = true;
        });

    angular
        .module("Application")
        .controller("HelpTopicCreationController", HelpTopicCreationController);

    HelpTopicCreationController.$inject = ["$scope", "$q", "$uibModal", "helperService", "authService", "apiService", "helpConfig", "confirmation", "toastr"];

    function HelpTopicCreationController($scope, $q, $uibModal, helperService, authService, apiService, helpConfig, confirmation, toastr) {
        /* jshint validthis: true */
        var HelpTopicCreationCtrl = this;

        function Init() {
            HelpTopicCreationCtrl.ePage = {
                "Title": "",
                "Prefix": "HelpTopicCreation",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitTopicCreation();
        }

        function InitTopicCreation() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic = {};

            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.AddNewTopic = AddTopic;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.AddNewSubTopic = AddTopic;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.SaveAndUpdateTopic = SaveAndUpdateTopic;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.DeleteTopic = DeleteTopicConfirmation;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ToggleSubTopic = ToggleSubTopic;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.OnTopicClick = OnTopicClick;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.CloseTopicModal = CloseTopicModal;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.EditTopic = EditTopic;

            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue = {};

            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.SaveTopicBtnTxt = "Save";
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.IsDisabledSaveTopicBtn = false;

            InitDragAndDropTopic();
            GetModuleList();
            GetTopicList();
            GetTopicTypeList();
        }

        function InitDragAndDropTopic() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.DNDOptions = {
                dropped: function (event) {
                    try {
                        var _item = event.source.nodeScope.$modelValue,
                            _parent;

                        if (event.dest.nodesScope.$nodeScope) {
                            var _parent = event.dest.nodesScope.$nodeScope.$modelValue;
                        }
                        // SaveAndUpdateTopicAPICall(_input).then(function(response){

                        // });

                        if ((!_parent && !_item.Self_FK) || (_parent && _parent.PK == _item.Self_FK)) {

                        } else {
                            var _input = _item;
                            _input.IsModified = true;
                            (_parent) ? _input.Self_FK = _parent.PK: _input.Self_FK = null;

                            apiService.post("authAPI", helpConfig.Entities.Topics.API.Upsert.Url, [_input]).then(function (response) {
                                if (response.data.Response) {
                                    if (!_parent) {
                                        _item.ItHasChild = false;
                                        _item.IsToggle = false;
                                    }

                                    if (event.source.nodeScope.$parentNodeScope) {
                                        if (event.source.nodeScope.$parentNodeScope.$modelValue.SubTopicList.length == 0) {
                                            event.source.nodeScope.$parentNodeScope.$modelValue.ItHasChild = false;
                                            event.source.nodeScope.$parentNodeScope.$modelValue.IsToggle = false;
                                        }
                                    }

                                    if (event.dest.nodesScope.$nodeScope) {
                                        if (event.dest.nodesScope.$nodeScope.$modelValue.SubTopicList.length > 0) {
                                            event.dest.nodesScope.$nodeScope.$modelValue.ItHasChild = true;
                                            event.dest.nodesScope.$nodeScope.$modelValue.IsToggle = false;
                                        }
                                    }
                                }
                            });
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            };
        }

        function GetModuleList() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": helpConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", helpConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModuleListSource = response.data.Response;
                } else {
                    HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModuleListSource = [];
                }
            });
        }

        function GetTopicTypeList() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.TopicTypeList = [{
                Code: "Module",
                Desc: "Module"
            }, {
                Code: "HelpTopic",
                Desc: "Help Topic"
            }];
        }

        function GetTopicList() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource = undefined;
            var _filter = {
                "SortColumn": "TOP_DisplayOrder",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000,
                "Self_FK": "NULL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": helpConfig.Entities.Topics.API.FindAll.FilterID
            };

            apiService.post("authAPI", helpConfig.Entities.Topics.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource = response.data.Response;

                    HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource.map(function (value, key) {
                        value.SubTopicList = [];
                    });
                } else {
                    HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource = [];
                }
            });
        }

        function ToggleSubTopic($event, $item, scope) {
            // var _target = $event.target;
            // var _listElement = _target.parentNode.nextElementSibling
            // $("." + $item.PK).toggle();
            // $(_listElement).toggle();
            scope.toggle();

            $item.IsToggle = !$item.IsToggle;

            if ($item.ItHasChild && (!$item.SubTopicList || $item.SubTopicList.length == 0)) {
                GetSubTopicList($item);
            }
        }

        function GetSubTopicList($item, $patent, mode) {
            var _filter = {
                "Self_FK": $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": helpConfig.Entities.Topics.API.FindAll.FilterID
            };

            apiService.post("authAPI", helpConfig.Entities.Topics.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (mode == "delete") {
                            toastr.warning("Could not delete...!");
                        } else {
                            if (!$item.SubTopicList) {
                                $item.SubTopicList = [];
                            }
                            response.data.Response.map(function (value, key) {
                                if (!value.SubTopicList) {
                                    value.SubTopicList = [];
                                }
                                $item.SubTopicList.push(value);
                            });
                            $item.ItHasChild = true;
                            $item.IsToggle = true;
                        }
                    } else {
                        if (mode == "delete") {
                            DeleteTopic($item, $patent);
                        } else {
                            $item.SubTopicList = [];
                            $item.ItHasChild = false;
                            $item.IsToggle = false;
                        }
                    }
                }
            });
        }

        function TopicModalInstance(template) {
            return HelpTopicCreationCtrl.ePage.Masters.HelpTopic.TopicModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "help-topic-creation-modal",
                scope: $scope,
                template: `<div ng-include src="'HelpTopicCreation'"></div>`
            });
        }

        function CloseTopicModal() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic = undefined;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.TopicModal.dismiss('cancel');
        }

        function OpenTopicModal($item, mode) {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.SaveTopicBtnTxt = "Save";
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.IsDisabledSaveTopicBtn = false;

            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic = $item;
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.TopicMode = mode;

            if (mode == "Edit") {
                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue = angular.copy($item);
            } else {
                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue = {
                    IsActive: true,
                    IsPublic: true,
                    TopicType: "HelpTopic"
                };
            }

            TopicModalInstance().result.then(function (response) {}, function () {
                CloseTopicModal();
            });
        }

        function AddTopic($item) {
            if (!$item) {
                OpenTopicModal($item, "New");
            } else {
                OpenTopicModal($item, "NewSub");
            }
        }

        function EditTopic($item) {
            OpenTopicModal($item, "Edit");
        }

        function SaveAndUpdateTopic() {
            if (HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue.PK) {
                UpdateTopic();
            } else {
                SaveTopic();
            }
        }

        function SaveTopic() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.SaveTopicBtnTxt = "Please Wait...";
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.IsDisabledSaveTopicBtn = true;

            var _input = HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue;
            _input.ProjectCode = "TC";
            _input.ItHasChild = false;
            _input.IsReady = false;
            _input.IsReviewed = false;
            _input.IsModified = true;

            // var _input = {
            //     "Title": HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue.Title,
            //     "Tags": HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue.Tags,
            //     "Root_FK": HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue.Root_FK,
            //     "Module": HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue.Module,
            //     "SubModule": HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue.SubModule,
            //     "ProjectCode": "TC",
            //     "TopicType": HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue.TopicType,
            //     "ItHasChild": false,
            //     "IsModified": true
            // };

            if (HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic) {
                _input.Self_FK = HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic.PK;
            }

            apiService.post("authAPI", helpConfig.Entities.Topics.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic) {
                            if (!HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic.SubTopicList) {
                                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic.SubTopicList = [];
                            }
                            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic.SubTopicList.push(response.data.Response[0]);

                            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic.ItHasChild = true;
                            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic.IsToggle = false;
                        } else {
                            if (!HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource) {
                                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource = [];
                            }
                            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource.push(response.data.Response[0]);
                        }
                    }
                }

                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.SaveTopicBtnTxt = "Save";
                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.IsDisabledSaveTopicBtn = false;
                CloseTopicModal();
            });
        }

        function UpdateTopic() {
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.SaveTopicBtnTxt = "Please Wait...";
            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.IsDisabledSaveTopicBtn = true;

            var _input = angular.copy(HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ModalValue);
            _input.IsModified = true;

            apiService.post("authAPI", helpConfig.Entities.Topics.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        for (var x in HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic) {
                            for (var y in response.data.Response) {
                                if (x == y) {
                                    HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ActiveTopic[x] = response.data.Response[x];
                                }
                            }
                        }
                    }
                }

                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.SaveTopicBtnTxt = "Save";
                HelpTopicCreationCtrl.ePage.Masters.HelpTopic.IsDisabledSaveTopicBtn = false;
                CloseTopicModal();
            });
        }

        function DeleteTopicConfirmation($item, $parent) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteTopicValidation($item, $parent);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteTopicValidation($item, $parent) {
            if ($item.ItHasChild) {
                if ($item.SubTopicList) {
                    toastr.warning("Could not delete...!");
                } else if (!$item.SubTopicList) {
                    GetSubTopicList($item, $parent, "delete");
                } else if ($item.SubTopicList.length > 0) {
                    GetSubTopicList($item, $parent, "delete");
                } else if ($item.SubTopicList.length == 0) {
                    GetSubTopicList($item, $parent, "delete");
                }
            } else {
                DeleteTopic($item, $parent);
            }
        }

        function DeleteTopic($item, $parent) {
            var _input = angular.copy($item);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("authAPI", helpConfig.Entities.Topics.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if ($parent.$parent.$parent.$parent.x) {
                        var _index = $parent.$parent.$parent.$parent.x.SubTopicList.map(function (value, key) {
                            return value.PK;
                        }).indexOf($item.PK);

                        if (_index != -1) {
                            $parent.$parent.$parent.$parent.x.SubTopicList.splice(_index, 1);

                            if ($parent.$parent.$parent.$parent.x.SubTopicList.length == 0) {
                                $parent.$parent.$parent.$parent.x.ItHasChild = false;
                            }
                        }
                    } else {
                        var _index = HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf($item.PK);

                        if (_index != -1) {
                            HelpTopicCreationCtrl.ePage.Masters.HelpTopic.ListSource.splice(_index, 1);
                        }
                    }
                }
            });
        }

        function OnTopicClick($item) {
            var _obj = $item;

            window.open("#/help/content-creation?topic=" + helperService.encryptData(_obj), '_blank');
        }

        function SaveAndUpdateTopicAPICall(input) {
            if (input.PK) {
                UpdateTopicAPICall(input);
            } else {
                InsertTopicAPICall(input);
            }
        }

        function InsertTopicAPICall(input) {
            var deferred = $q.defer();
            var _input = angular.copy(input);

            apiService.post("authAPI", helpConfig.Entities.Topics.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response.data.Response);
                } else {
                    deferred.reject(response);
                }
            });

            return deferred.promise;
        }

        function UpdateTopicAPICall(input) {
            var deferred = $q.defer();
            var _input = angular.copy(input);

            apiService.post("authAPI", helpConfig.Entities.Topics.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response.data.Response);
                } else {
                    deferred.reject(response);
                }
            });

            return deferred.promise;
        }

        Init();
    }
})();
