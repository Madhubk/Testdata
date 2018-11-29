(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdExceptNotifyEditDirectiveController", OrdExceptNotifyEditDirectiveController);

    OrdExceptNotifyEditDirectiveController.$inject = ["$injector", "$q", "helperService", "apiService", "appConfig", "toastr", "authService"];

    function OrdExceptNotifyEditDirectiveController($injector, $q, helperService, apiService, appConfig, toastr, authService) {
        var OrdExceptNotifyEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            OrdExceptNotifyEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Notification_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": OrdExceptNotifyEditDirectiveCtrl.entityObj
                    }
                }
            };

            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ExceptionNotifyInit();
        }

        function ExceptionNotifyInit() {
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj = OrdExceptNotifyEditDirectiveCtrl.taskObj;
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.Exception = {};
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.MarkAsRead = MarkAsRead;
            if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                        OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                    }
                    GetDetails(response.data.Response);
                    GetConfigDetails(OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData);
                    GetCommentsList();
                    GetCommentsFilterList();
                }
            });
        }

        function GetDetails(_inputData) {
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
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIOrder_Buyer.OrderNo;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIOrder_Buyer.ContainerMode;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIOrder_Buyer.BuyerName;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIOrder_Buyer.SupplierName;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIOrder_Buyer.TransportMode;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIOrder_Buyer.IncoTerm;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIOrder_Buyer.Comments;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIShipmentHeader.Comments;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UICntContainer.Comments;
                }
            });
        }

        function MarkAsRead() {
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
            if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                var _input = angular.copy(OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData);
                _input.Description = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionComments;
                _input.RelatedDetails = JSON.stringify(_input.RelatedDetails);
                _input.IsModified = true;
                apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                            JobCommentInsert().then(function (response) {
                                if (response.data.Status == "Success") {
                                    Complete();
                                } else {
                                    toastr.error("Failed...");
                                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
                                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
                                }
                            });
                        } else {
                            Complete();
                        }
                    } else {
                        toastr.error("Exception approval failed...");
                        OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
                        OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
                    }
                });
            } else {
                Complete();
            }
        }

        function Complete() {
            var _input = InputData(OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj, 2);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                    var _data = {
                        IsCompleted: true,
                        Item: OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Completed...");
                    OrdExceptNotifyEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                    toastr.error("Failed...");
                }
            });
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.Description = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
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

        function GetConfigDetails(_dataConfig) {
            var _filter = {
                "DataEntryName": _dataConfig.CustomFormName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (typeof response.data.Response == "object") {
                        var _isEmpty = angular.equals({}, response.data.Response);
                        if (!_isEmpty) {
                            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponseTemp = angular.copy(response.data.Response);
                            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse = response.data.Response;
                            if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails) {
                                OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse.Entities = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails;
                            }
                        }
                    }
                }
            });
        }

        function GetCommentsList() {
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                } else {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function GetCommentsFilterList() {
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    OrdExceptNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
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