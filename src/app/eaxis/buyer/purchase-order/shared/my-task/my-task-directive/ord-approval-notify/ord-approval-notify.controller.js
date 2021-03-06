(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdApprovalNotifyDirectiveController", OrdApprovalNotifyDirectiveController);

    OrdApprovalNotifyDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr", "authService"];

    function OrdApprovalNotifyDirectiveController($q, helperService, apiService, appConfig, toastr, authService) {
        var OrdApprovalNotifyDirectiveCtrl = this;

        function Init() {
            OrdApprovalNotifyDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Approval_Notification_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitApprovalNotify();
        }

        function InitApprovalNotify() {
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask = OrdApprovalNotifyDirectiveCtrl.taskObj;
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MarkAsRead = MarkAsRead;
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;

            if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                        if (typeof response.data.Response.RelatedDetails == "string") {
                            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                        }
                        ConsigneeDetails(response.data.Response);
                        GetCommentsFilterList();
                        GetCommentsList();
                    }
                });
            }
        }

        function ConsigneeDetails(_inputData) {
            if (_inputData.EntitySource) {
                switch (_inputData.EntitySource) {
                    case "POH":
                        GetOrderDetails(_inputData);
                        break;
                    case "SHP":
                        GetShipmentDetails(_inputData);
                        break;
                    case "BKG":
                        GetShipmentDetails(_inputData);
                        break;
                    case "CNT":
                        GetContainerDetails(_inputData);
                        break;
                    default:
                        break;
                }
            }
        }

        function GetOrderDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIOrder_Buyer.Supplier;
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIOrder_Buyer.Buyer;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function MarkAsRead() {
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = true;
            if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionComments) {
                var _input = angular.copy(OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData);
                _input.Description = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionComments;
                _input.RelatedDetails = JSON.stringify(_input.RelatedDetails);
                _input.IsModified = true;
                apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionComments) {
                            JobCommentInsert().then(function (response) {
                                if (response.data.Status == "Success") {
                                    Complete();
                                } else {
                                    toastr.error("Failed...");
                                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
                                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = true;
                                }
                            });
                        } else {
                            Complete();
                        }
                    } else {
                        toastr.error("Failed...");
                        OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
                        OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = true;
                    }
                });
            } else {
                Complete();
            }
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.Description = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Job Comments Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;

        }

        function Complete() {
            var _input = InputData(OrdApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask, 5);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Completed...");
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                } else {
                    toastr.error("Failed...");
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                }
            });
        }

        function GetCommentsFilterList() {
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
            var _filter = {
                TypeCode: $item,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstCommentType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstCommentType.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    if (!_list) {
                        _list = [];
                    }

                    var _obj = {
                        TypeCode: "ALL",
                        Value: "All",
                        Key: "All"
                    };

                    _list.push(_obj);
                    _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        function GetCommentsList() {
            OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                    OrdApprovalNotifyDirectiveCtrl.listSource = OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentsList;
                } else {
                    OrdApprovalNotifyDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function InputData(_data, CompleteStepNo) {
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "CompleteStepNo": CompleteStepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        Init();
    }
})();