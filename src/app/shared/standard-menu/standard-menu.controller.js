(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StandardMenuController", StandardMenuController);

    StandardMenuController.$inject = ["helperService", "authService", "apiService", "appConfig"];

    function StandardMenuController(helperService, authService, apiService, appConfig) {
        /* jshint validthis: true */
        var StandardMenuCtrl = this;

        function Init() {
            var _entity = StandardMenuCtrl.input[StandardMenuCtrl.input.label].ePage.Entities;
            StandardMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "StandardMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": _entity
            };

            StandardMenuCtrl.ePage.Masters.OnCloseModal = OnCloseModal;

            GetStandardMenuList();
        }

        function GetStandardMenuList() {
            StandardMenuCtrl.ePage.Masters.MenuList = [{
                "Name": "comment",
                "DisplayName": "Comment",
                "Icon": "fa fa-comments",
                // "Count": 0,
                "IsShowCount": (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList.comment) ? true : false
            }, {
                "Name": "document",
                "DisplayName": "Document",
                "Icon": "fa fa-file",
                // "Count": 0,
                "IsShowCount": (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList.document) ? true : false
            }, {
                "Name": "email",
                "DisplayName": "Email",
                "Icon": "fa fa-envelope",
                // "Count": 0,
                "IsShowCount": (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList.email) ? true : false
            }, {
                "Name": "email-template-creation",
                "DisplayName": "Email Template",
                "Icon": "fa fa-envelope",
                // "Count": 0,
                "IsShowCount": false
            }, {
                "Name": "exception",
                "DisplayName": "Exception",
                "Icon": "fa fa-warning",
                // "Count": 0,
                "IsShowCount": (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList.exception) ? true : false
            }, {
                "Name": "event",
                "DisplayName": "Event",
                "Icon": "fa fa-calendar",
                // "Count": 0,
                "IsShowCount": (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList.event) ? true : false
            }, {
                "Name": "task",
                "DisplayName": "Task",
                "Icon": "fa fa-user",
                // "Count": 0,
                "IsShowCount": (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList.task) ? true : false
            }, {
                "Name": "email-group",
                "DisplayName": "Email Group",
                "Icon": "fa fa-envelope",
                // "Count": 0,
                "IsShowCount": false
            }, {
                "Name": "audit-log",
                "DisplayName": "Audit Log",
                "Icon": "fa fa-user",
                // "Count": 0,
                "IsShowCount": false
            }, {
                "Name": "integration",
                "DisplayName": "Integration",
                "Icon": "fa fa-user",
                // "Count": 0,
                "IsShowCount": false
            }, {
                "Name": "event-data",
                "DisplayName": "Data Event",
                "Icon": "fa fa-calendar",
                // "Count": 0,
                "IsShowCount": false
            }, {
                "Name": "keyword",
                "DisplayName": "Keywords",
                "Icon": "fa fa-tag",
                // "Count": 0,
                "IsShowCount": false
            }, {
                "Name": "parties",
                "DisplayName": "Parties",
                "Icon": "fa fa-gift",
                // "Count": 0,
                "IsShowCount": false
            }];

            ConfigureStandardMenuObject();
            InitCount();
        }

        function ConfigureStandardMenuObject() {
            StandardMenuCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntitySource,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": StandardMenuCtrl.ePage.Entities.Header.Data,
                "Entity": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntityName
            };

            if (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EnableStandardToolbar) {
                StandardMenuCtrl.ePage.Masters.StandardMenuInput.Config = StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList;
            }
        }

        function InitCount() {
            var _fun = {
                comment: GetCommentCount,
                document: GetDocumentCount,
                email: GetEmailCount,
                exception: GetExceptionCount,
                event: GetEventCount,
                task: GetTaskCount
            };

            StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                if (value.IsShowCount) {
                    _fun[value.Name]();
                }
            });
        }

        function GetCommentCount() {
            var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                return value.Name;
            }).indexOf("comment");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;
            }

            var _filter = {
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntitySource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccessCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined && response.data.Response != null) {
                    // var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                    //     return value.Name;
                    // }).indexOf("comment");

                    if (_index != -1) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                }
            });
        }

        function GetDocumentCount() {
            var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                return value.Name;
            }).indexOf("document");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;
            }

            var _filter = {
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntitySource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccessCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined && response.data.Response != null) {
                    // var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                    //     return value.Name;
                    // }).indexOf("document");

                    if (_index != -1) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                }
            });
        }

        function GetEmailCount() {
            var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                return value.Name;
            }).indexOf("email");
            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;
            }

            var _filter = {
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntitySource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAllWithAccessCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined && response.data.Response != null) {
                    // var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                    //     return value.Name;
                    // }).indexOf("email");

                    if (_index != -1) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                }
            });
        }

        function GetExceptionCount() {
            var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                return value.Name;
            }).indexOf("exception");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;
            }

            var _filter = {
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntitySource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobException.API.FindAllWithAccessCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobException.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined && response.data.Response != null) {
                    // var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                    //     return value.Name;
                    // }).indexOf("exception");

                    if (_index != -1) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                }
            });
        }

        function GetEventCount() {
            var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                return value.Name;
            }).indexOf("event");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;
            }

            var _filter = {
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntitySource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEvent.API.FindAllWithAccessCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined && response.data.Response != null) {
                    var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                        return value.Name;
                    }).indexOf("event");

                    if (_index != -1) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                }
            });
        }

        function GetTaskCount() {
            var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                return value.Name;
            }).indexOf("task");
            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;
            }

            var _filter = {
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EntitySource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccessCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined && response.data.Response != null) {
                    var _index = StandardMenuCtrl.ePage.Masters.MenuList.map(function (value, key) {
                        return value.Name;
                    }).indexOf("task");

                    if (_index != -1) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                }
            });
        }

        function OnCloseModal($item) {
            var _fun = {
                comment: GetCommentCount,
                document: GetDocumentCount,
                email: GetEmailCount,
                exception: GetExceptionCount,
                event: GetEventCount,
                task: GetTaskCount
            };

            _fun[$item]();
        }

        Init();
    }
})();
