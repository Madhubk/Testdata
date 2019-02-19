(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdExceptRejectDirectiveController", OrdExceptRejectDirectiveController);

    OrdExceptRejectDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr", "authService"];

    function OrdExceptRejectDirectiveController($q, helperService, apiService, appConfig, toastr, authService) {
        var OrdExceptRejectDirectiveCtrl = this;

        function Init() {
            OrdExceptRejectDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Reject_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitExceptionReject();
            TaskGetById();
        }

        function InitExceptionReject() {
            OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask = OrdExceptRejectDirectiveCtrl.taskObj;
            OrdExceptRejectDirectiveCtrl.ePage.Masters.SendForApproval = SendForApproval;
            OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
            OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
            OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData = {};
            OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj = {};

            if (OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                        if (typeof response.data.Response.RelatedDetails == "string") {
                            OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                            OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
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
                    case "CNT":
                        GetContainerDetails(_inputData);
                        break;
                    case "BKG":
                        GetShipmentDetails(_inputData);
                        break;
                    default:
                        break;
                }
            }
        }

        function GetOrderDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIOrder_Buyer.Supplier;
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIOrder_Buyer.Buyer;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function SendForApproval() {
            OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = true;
            OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Please wait...";
            var _input = angular.copy(OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData);
            if (OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionComments) {
                _input.Description = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionComments;
            }
            _input.RelatedDetails = JSON.stringify(_input.RelatedDetails);
            _input.IsModified = true;

            apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                Complete();
                            } else {
                                toastr.error("Failed...");
                                OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                                OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                            }
                        });
                    } else {
                        Complete();
                    }
                } else {
                    toastr.error("Exception approval failed...");
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                }
            });
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.Description = OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function Complete() {
            var _input = InputData(OrdExceptRejectDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    toastr.success("Task completed succesfully...");
                } else {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    toastr.error("Send approval failed...");
                }
            });
        }

        function GetCommentsFilterList() {
            OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        function GetCommentsList() {
            OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = OrdExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                    OrdExceptRejectDirectiveCtrl.listSource = OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentsList;
                } else {
                    OrdExceptRejectDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function InputData(_data) {
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "CompleteStepNo": _data.WSI_StepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        Init();
    }
})();