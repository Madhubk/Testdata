(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptionController", ExceptionController);

    ExceptionController.$inject = ["$location", "$timeout", "authService", "apiService", "helperService", "appConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function ExceptionController($location, $timeout, authService, apiService, helperService, appConfig, APP_CONSTANT, toastr, confirmation) {
        /* jshint validthis: true */
        var ExceptionCtrl = this;

        function Init() {
            ExceptionCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ExceptionCtrl.input
            };

            if (ExceptionCtrl.ePage.Entities) {
                InitException();
            }
        }

        function InitException() {
            ExceptionCtrl.ePage.Masters.Exception = {};
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.UserId = authService.getUserInfo().UserId;
            ExceptionCtrl.ePage.Masters.Exception.Compose = Compose;

            InitReadView();
            InitEditView();
            InitListView();
            InitSideBar();
        }

        function Compose($item) {
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Edit";
            ExceptionCtrl.ePage.Masters.Exception.EditView.ModeType = "Compose";
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = {};

            if ($item.OtherConfig) {
                OnMstExceptionClick($item, "New");
            } else {
                ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponseTemp = undefined;
                ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse = undefined;
                OnMstExceptionClick($item);
            }
        }

        // ============================ SideBar Start ============================
        // region
        function InitSideBar() {
            ExceptionCtrl.ePage.Masters.Exception.SideBar = {};
            ExceptionCtrl.ePage.Masters.Exception.SideBar.OnListClick = OnMstExceptionClick;

            if(ExceptionCtrl.mode == "1"){
                GetExceptionFilterList();
            }else{
                ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException = {};
                OnMstExceptionClick(ExceptionCtrl.type, "New");
            }
        }

        function GetExceptionFilterList() {
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "ExceptionType",
                "Key": ExceptionCtrl.ePage.Entities.Entity
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if (!_response.Value) {
                            _response.Value = "General";
                        }
                        GetMstExceptionList(_response.Value);
                    }else{
                        GetMstExceptionList("General");
                    }
                }
            });
        }

        function GetMstExceptionList($item) {
            var _filter = {
                // "TypeCode": ExceptionCtrl.ePage.Entities.EntitySource + ",OTH",
                "Key": $item,
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstExceptionType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstExceptionType.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    // if (!_list) {
                    //     _list = [{
                    //         Key: "GEN",
                    //         Description: "General",
                    //         Value: "Genaral",
                    //         TypeCode: ExceptionCtrl.ePage.Entities.EntitySource,
                    //         SAP_FK: authService.getUserInfo().AppPK,
                    //         TenantCode: authService.getUserInfo().TenantCode
                    //     }];
                    // }
                    var _obj = {
                        Description: "All",
                        Value: "All",
                        TypeCode: ExceptionCtrl.ePage.Entities.EntitySource,
                        SAP_FK: authService.getUserInfo().AppPK,
                        TenantCode: authService.getUserInfo().TenantCode
                    };

                    _list.push(_obj);
                    _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

                    if (_list.length > 0) {
                        _list.map(function (value, key) {
                            if (value.OtherConfig) {
                                if (typeof value.OtherConfig == "string") {
                                    value.OtherConfig = JSON.parse(value.OtherConfig);
                                }
                            }
                        });

                        ExceptionCtrl.ePage.Masters.Exception.SideBar.MstExceptionList = _list;
                        OnMstExceptionClick(ExceptionCtrl.ePage.Masters.Exception.SideBar.MstExceptionList[0]);
                    } else {
                        ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                    }
                } else {
                    ExceptionCtrl.ePage.Masters.Exception.SideBar.MstExceptionList = [];
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                }
            });
        }

        function OnMstExceptionClick($item, type) {
            if (type == "New") {
                ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException = $item;
                GetConfigDetails($item);
                GetJobExceptionList();
            } else if (!ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException || ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.Key != $item.Key) {
                ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException = $item;
                GetJobExceptionList();
            }
        }

        function GetConfigDetails($item) {
            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponseTemp = undefined;
            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse = undefined;
            var _filter = {};
            if ($item) {
                _filter.DataEntryName = $item.OtherConfig.CustomFormName;
            } else {
                _filter.DataEntryName = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CustomFormName;
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (typeof response.data.Response == "object") {
                        var _isEmpty = angular.equals({}, response.data.Response);

                        if (!_isEmpty) {
                            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponseTemp = angular.copy(response.data.Response);
                            ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse = response.data.Response;

                            if (ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.RelatedDetails) {
                                ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse.Entities = JSON.parse(ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.RelatedDetails);
                            }
                        }
                    }
                }
            });
        }
        // endregion

        // ============================ List View Start ============================
        // region
        function InitListView() {
            ExceptionCtrl.ePage.Masters.Exception.ListView = {};
            ExceptionCtrl.ePage.Masters.Exception.ListView.Refresh = RefreshListView;
            ExceptionCtrl.ePage.Masters.Exception.ListView.OnListViewClick = OnListViewClick;
        }

        function GetJobExceptionList() {
            ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = undefined;
            var _filter = {
                "Type": ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.Key,
                "EntitySource": ExceptionCtrl.ePage.Entities.EntitySource,
                "EntityRefKey": ExceptionCtrl.ePage.Entities.EntityRefKey,
                "EntityRefCode": ExceptionCtrl.ePage.Entities.EntityRefCode,
            };

            if (ExceptionCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobExceptions.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobExceptions.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = response.data.Response;
                } else {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource = [];
                }
            });
        }

        function RefreshListView() {
            GetJobExceptionList();
        }

        function OnListViewClick($item) {
            ExceptionCtrl.ePage.Masters.Exception.ReadView.IsShowDynamicForm = false;
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = angular.copy($item);
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput = undefined;

            GetConfigDetails();

            if (ExceptionCtrl.mode == "1") {
                PrepareGroupMapping();
            }
            
            $timeout(function () {
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput = angular.copy(ExceptionCtrl.ePage.Entities);

                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.EntityRefCode = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.EntityRefKey = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.EntitySource = "EXC";

                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.ParentEntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
                ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.CommentInput.ParentEntitySource = ExceptionCtrl.ePage.Entities.EntitySource;

                ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Read";
            });
        }

        function PrepareGroupMapping() {
            ExceptionCtrl.ePage.Masters.Exception.ReadView.GroupMapping = undefined;

            $timeout(function () {
                ExceptionCtrl.ePage.Masters.Exception.ReadView.GroupMapping = {
                    "MappingCode": "EXCE_GRUP_APP_TNT",
                    "Item_FK": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK,
                    "ItemCode": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Description,
                    "ItemName": "GRUP",
                    "Title": " Group Access",
                    "AccessTo": {
                        "Type": "EXCEPTION",
                        "API": "authAPI",
                        "APIUrl": "SecMappings/FindAll",
                        "FilterID": "SECMAPP",
                        "TextField": "ItemCode",
                        "ValueField": "Item_FK",
                        "Input": [{
                            "FieldName": "AccessCode",
                            "Value": ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Type
                        }, {
                            "FieldName": "MappingCode",
                            "Value": "GRUP_ETYP_APP_TNT"
                        }, {
                            "FieldName": "AppCode",
                            "Value": authService.getUserInfo().AppCode
                        }, {
                            "FieldName": "TenantCode",
                            "Value": authService.getUserInfo().TenantCode
                        }]
                    }
                };
                ExceptionCtrl.ePage.Masters.Exception.ViewMode = "Read";
            });
        }
        // endregion

        // ============================ Read View Start ============================
        // region
        function InitReadView() {
            ExceptionCtrl.ePage.Masters.Exception.ReadView = {};
            ExceptionCtrl.ePage.Masters.Exception.ReadView.GoToList = GoToList;

            ExceptionCtrl.ePage.Masters.Exception.ReadView.UpdateBtnText = "Update";
            ExceptionCtrl.ePage.Masters.Exception.ReadView.IsDisableUpdateBtn = false;
        }

        function GoToList() {
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = undefined;
        }
        // endregion

        // ============================ Edit View Start ============================
        // region
        function InitEditView() {
            ExceptionCtrl.ePage.Masters.Exception.EditView = {};
            ExceptionCtrl.ePage.Masters.Exception.EditView.Discard = Discard;
            ExceptionCtrl.ePage.Masters.Exception.EditView.Create = SaveException;

            ExceptionCtrl.ePage.Masters.Exception.EditView.ModeType = "Compose";

            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Create";
            ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
        }

        function SaveException(type) {
            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Please Wait...";
            ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = true;

            var _input = angular.copy(ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException);
            _input.IsModified = true;

            if (type == "insert") {
                if (!ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK) {
                    _input.TenantCode = authService.getUserInfo().TenantCode;
                    _input.SAP_FK = authService.getUserInfo().AppPK;
                    _input.Type = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.Key;

                    _input.EntitySource = ExceptionCtrl.ePage.Entities.EntitySource;
                    _input.EntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
                    _input.EntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;
                }

                if (ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse) {
                    _input.RelatedDetails = JSON.stringify(ExceptionCtrl.ePage.Masters.Exception.SideBar.DataConfigResponse.Entities);
                }

                if (ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig) {
                    _input.OtherConfig = JSON.stringify(ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.Choices);
                    _input.CustomFormName = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.CustomFormName;
                    _input.ProcessCode = ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.ProcessCode;
                }

                if (ExceptionCtrl.ePage.Entities.ParentEntityRefKey) {
                    _input.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.ParentEntityRefKey;
                    _input.ParentEntitySource = ExceptionCtrl.ePage.Entities.ParentEntitySource;
                    _input.ParentEntityRefCode = ExceptionCtrl.ePage.Entities.ParentEntityRefCode;
                }

                if (ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey) {
                    _input.AdditionalEntityRefKey = ExceptionCtrl.ePage.Entities.AdditionalEntityRefKey;
                    _input.AdditionalEntitySource = ExceptionCtrl.ePage.Entities.AdditionalEntitySource;
                    _input.AdditionalEntityRefCode = ExceptionCtrl.ePage.Entities.AdditionalEntityRefCode;
                }
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobExceptions.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        var _index = ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf(_response.PK);

                        if (_index === -1) {
                            ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource.push(_response);
                        } else {
                            ExceptionCtrl.ePage.Masters.Exception.ListView.ListSource[_index] = _response;
                        }

                        ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = _response;

                        if (type == "insert"){
                            CreateComment();
                        }

                        if (type == "insert" && ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig) {
                            CreateInstance();
                        } else {
                            Discard();
                            ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Save";
                            ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
                        }
                    } else {
                        toastr.error("Could not Save...!");
                    }

                    if (type == "update") {
                        Discard();
                        ExceptionCtrl.ePage.Masters.Exception.EditView.CreateBtnText = "Save";
                        ExceptionCtrl.ePage.Masters.Exception.EditView.IsDisableCreateBtn = false;
                    }
                }
            });
        }

        function CreateInstance() {
            var _input = {
                EntityName: "Exception",

                EntityRefCode: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title,
                EntityRefKey: ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK,
                EntitySource: "EXC",

                ParentEntityRefCode: ExceptionCtrl.ePage.Entities.EntityRefCode,
                ParentEntityRefKey: ExceptionCtrl.ePage.Entities.EntityRefKey,
                ParentEntitySource: ExceptionCtrl.ePage.Entities.EntitySource,

                ProcessName: ExceptionCtrl.ePage.Masters.Exception.SideBar.ActiveMstException.OtherConfig.ProcessName,

                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.InstanceNo = response.data.Response.InstanceNo;
                    SaveException("update");
                }
            });
        }

        function CreateComment(){
            var _input = {};
            _input.Comments = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Description;
            _input.Description = "Exception General";
            _input.EntityRefKey = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.PK;
            _input.EntitySource = "EXC";
            _input.EntityRefCode = ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException.Title;
            _input.CommentsType = "PUB";

            _input.ParentEntityRefKey = ExceptionCtrl.ePage.Entities.EntityRefKey;
            _input.ParentEntitySource = ExceptionCtrl.ePage.Entities.EntitySource;
            _input.ParentEntityRefCode = ExceptionCtrl.ePage.Entities.EntityRefCode;

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) { }
            });
        }

        function Discard() {
            ExceptionCtrl.ePage.Masters.Exception.ViewMode = "List";
            ExceptionCtrl.ePage.Masters.Exception.ListView.ActiveException = undefined;
        }
        // endregion

        Init();
    }
})();
