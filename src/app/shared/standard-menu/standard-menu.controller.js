(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StandardMenuController", StandardMenuController);

    StandardMenuController.$inject = ["helperService", "authService", "apiService", "appConfig"];

    function StandardMenuController(helperService, authService, apiService, appConfig) {
        /* jshint validthis: true */
        let StandardMenuCtrl = this;

        function Init() {
            let _entity = StandardMenuCtrl.input[StandardMenuCtrl.input.code].ePage.Entities;
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
            let _toolList = StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList;
            StandardMenuCtrl.ePage.Masters.MenuList = [{
                "Name": "comment",
                "Code": "Comment",
                "DisplayName": "Comment",
                "Icon": "fa fa-comments",
                "IsShowCount": _toolList.comment ? true : false
            }, {
                "Name": "document",
                "Code": "Document",
                "DisplayName": "Document",
                "Icon": "fa fa-file",
                "IsShowCount": _toolList.document ? true : false
            }, {
                "Name": "email",
                "Code": "Email",
                "DisplayName": "Email",
                "Icon": "fa fa-envelope",
                "IsShowCount": _toolList.email ? true : false
            }, {
                "Name": "exception",
                "Code": "Exception",
                "DisplayName": "Exception",
                "Icon": "fa fa-warning",
                "IsShowCount": _toolList.exception ? true : false
            }, {
                "Name": "event",
                "Code": "Event",
                "DisplayName": "Event",
                "Icon": "fa fa-calendar",
                "IsShowCount": _toolList.event ? true : false
            }, {
                "Name": "task",
                "Code": "Task",
                "DisplayName": "Task",
                "Icon": "fa fa-user",
                "IsShowCount": _toolList.task ? true : false
            }, {
                "Name": "audit-log",
                "Code": "AuditLog",
                "DisplayName": "Audit Log",
                "Icon": "fa fa-user",
                "IsShowCount": false
            }, {
                "Name": "keyword",
                "Code": "Keywords",
                "DisplayName": "Keywords",
                "Icon": "fa fa-tag",
                "IsShowCount": false
            }, {
                "Name": "parties",
                "Code": "Parties",
                "DisplayName": "Parties",
                "Icon": "fa fa-gift",
                "IsShowCount": false
            }, {
                "Name": "checklist",
                "Code": "Checklist",
                "DisplayName": "Checklist",
                "Icon": "fa fa-gift",
                "IsShowCount": false
            }, {
                "Name": "delay-reason",
                "Code": "DelayReason",
                "DisplayName": "Delay Reason",
                "Icon": "fa fa-gift",
                "IsShowCount": false
            }, {
                "Name": "email-template-creation",
                "Code": "EmailTemplate",
                "DisplayName": "Email Template",
                "Icon": "fa fa-envelope",
                "IsShowCount": false
            }, {
                "Name": "email-group",
                "Code": "EmailGroup",
                "DisplayName": "Email Group",
                "Icon": "fa fa-envelope",
                "IsShowCount": false
            }, {
                "Name": "event-data",
                "Code": "DataEvent",
                "DisplayName": "Data Event",
                "Icon": "fa fa-calendar",
                "IsShowCount": false
            }, {
                "Name": "task-flow-graph",
                "Code": "TaskFlowGraph",
                "DisplayName": "Task Flow Graph",
                "Icon": "fa fa-user",
                "IsShowCount": false
            }];

            ConfigureStandardMenuObject();
            InitCount();
        }

        function ConfigureStandardMenuObject() {
            StandardMenuCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": (StandardMenuCtrl.input.pk) ? StandardMenuCtrl.input.pk : StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": StandardMenuCtrl.ePage.Entities.Header.Data,
                "Entity": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName
            };

            if (StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.EnableStandardToolbar) {
                StandardMenuCtrl.ePage.Masters.StandardMenuInput.Config = StandardMenuCtrl.dataentryObject.OtherConfig.ListingPageConfig.StandardToolbar.ToolList;
            }
        }

        function OnCloseModal($item) {
            // let _fun = {
            //     comment: GetCommentCount,
            //     document: GetDocumentCount,
            //     email: GetEmailCount,
            //     exception: GetExceptionCount,
            //     event: GetEventCount,
            //     task: GetTaskCount
            // };

            // _fun[$item]();
            GetAllCount();
        }

        // #region Count
        function InitCount() {
            // let _fun = {
            //     comment: GetCommentCount,
            //     document: GetDocumentCount,
            //     email: GetEmailCount,
            //     exception: GetExceptionCount,
            //     event: GetEventCount,
            //     task: GetTaskCount
            // };

            // StandardMenuCtrl.ePage.Masters.MenuList.map(value => {
            //     if (value.IsShowCount) {
            //         _fun[value.Name]();
            //     }
            // });

            GetAllCount();
        }

        function GetAllCount() {
            if (StandardMenuCtrl.ePage.Masters.MenuList && StandardMenuCtrl.ePage.Masters.MenuList.length > 0) {
                StandardMenuCtrl.ePage.Masters.MenuList.map((value, index) => StandardMenuCtrl.ePage.Masters.MenuList[index].Count = null);

                let _filter = {
                    "EntityRefKey": (StandardMenuCtrl.input.pk) ? StandardMenuCtrl.input.pk : StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                    "EntityRefCode": StandardMenuCtrl.input.label,
                    "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                    "Status": "Success",
                    "AppSettings": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName,
                    "AppSettingsDocument": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName + "_Document"
                };
                let _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccessCount.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.StandardComponent.API.GetCount.Url + authService.getUserInfo().AppPK, _input).then(response => {
                    if (response.data.Response) {
                        StandardMenuCtrl.ePage.Masters.MenuList.map((value, index) => {
                            for (let x in response.data.Response) {
                                if (value.Code == x) {
                                    value.Count = response.data.Response[x];
                                }
                            }
                        });
                    }
                });
            }
        }

        function GetCommentCount() {
            let _index = StandardMenuCtrl.ePage.Masters.MenuList.findIndex(value => value.Name == "comment");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;

                let _filter = {
                    "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                    "EntityRefCode": StandardMenuCtrl.input.label,
                    "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                    "AppSettings": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName
                };
                let _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccessCount.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(response => {
                    if (response.data.Response != null && response.data.Response != undefined) {
                        if (_index != -1) {
                            StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                        }
                    }
                });
            }
        }

        function GetDocumentCount() {
            let _index = StandardMenuCtrl.ePage.Masters.MenuList.findIndex(value => value.Name == "document");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;

                let _filter = {
                    "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                    "EntityRefCode": StandardMenuCtrl.input.label,
                    "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                    "Status": "Success",
                    "AppSettings": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName,
                    "AppSettingsDocument": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName + "_Document"
                };
                let _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccessCount.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(response => {
                    if (response.data.Response != null && response.data.Response != undefined) {
                        if (_index != -1) {
                            StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                        }
                    }
                });
            }
        }

        function GetEmailCount() {
            let _index = StandardMenuCtrl.ePage.Masters.MenuList.findIndex(value => value.Name === "email");
            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;

                let _filter = {
                    "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                    "EntityRefCode": StandardMenuCtrl.input.label,
                    "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                    "AppSettings": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName
                };
                let _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.JobEmail.API.FindAllWithAccessCount.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.JobEmail.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(response => {
                    if (response.data.Response != null && response.data.Response != undefined) {
                        if (_index != -1) {
                            StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                        }
                    }
                });
            }
        }

        function GetExceptionCount() {
            let _index = StandardMenuCtrl.ePage.Masters.MenuList.findIndex(value => value.Name == "exception");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;

                let _filter = {
                    "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                    "EntityRefCode": StandardMenuCtrl.input.label,
                    "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                    "AppSettings": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName
                };
                let _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.JobException.API.FindAllWithAccessCount.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.JobException.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(response => {
                    if (response.data.Response != null && response.data.Response != undefined) {
                        if (_index != -1) {
                            StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                        }
                    }
                });
            }
        }

        function GetEventCount() {
            let _index = StandardMenuCtrl.ePage.Masters.MenuList.findIndex(value => value.Name == "event");

            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;

                let _filter = {
                    "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                    "EntityRefCode": StandardMenuCtrl.input.label,
                    "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                    "AppSettings": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName
                };
                let _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.DataEvent.API.FindAllWithAccessCount.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(response => {
                    if (response.data.Response != null && response.data.Response != undefined) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                });
            }
        }

        function GetTaskCount() {
            let _index = StandardMenuCtrl.ePage.Masters.MenuList.findIndex(value => value.Name == "task");
            if (_index != -1) {
                StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = undefined;

                let _filter = {
                    "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                    "EntityRefCode": StandardMenuCtrl.input.label,
                    "EntitySource": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntitySource,
                    "AppSettings": StandardMenuCtrl.dataentryObject.OtherConfig.FilterConfig.EntityName
                };
                let _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccessCount.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccessCount.Url + authService.getUserInfo().AppPK, _input).then(response => {
                    if (response.data.Response != null && response.data.Response != undefined) {
                        StandardMenuCtrl.ePage.Masters.MenuList[_index].Count = response.data.Response;
                    }
                });
            }
        }
        // #endregion

        Init();
    }
})();
