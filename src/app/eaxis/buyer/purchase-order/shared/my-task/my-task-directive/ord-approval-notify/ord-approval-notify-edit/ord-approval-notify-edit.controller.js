(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdApprovalNotifyEditDirectiveController", OrdApprovalNotifyEditDirectiveController);

    OrdApprovalNotifyEditDirectiveController.$inject = ["$injector", "$q", "helperService", "apiService", "appConfig", "toastr", "authService"];

    function OrdApprovalNotifyEditDirectiveController($injector, $q, helperService, apiService, appConfig, toastr, authService) {
        var OrdApprovalNotifyEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            OrdApprovalNotifyEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Notification_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": OrdApprovalNotifyEditDirectiveCtrl.entityObj
                    }
                }
            };

            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionNotifyInit();
        }

        function ExceptionNotifyInit() {
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj = OrdApprovalNotifyEditDirectiveCtrl.taskObj;
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.Exception = {};
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.MarkAsRead = MarkAsRead;
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;

            if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                        OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                    }
                    GetDetails(response.data.Response);
                    GetConfigDetails(OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData);
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
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIOrder_Buyer.OrderNo;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIOrder_Buyer.ContainerMode;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIOrder_Buyer.BuyerName;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIOrder_Buyer.SupplierName;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIOrder_Buyer.TransportMode;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIOrder_Buyer.IncoTerm;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIOrder_Buyer.PortOfLoading;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIOrder_Buyer.PortOfDischarge;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIOrder_Buyer.PlannedCarrier;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIOrder_Buyer.PlannedVoyage;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIOrder_Buyer.PlannedVessel;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIOrder_Buyer.PlannedETD;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIOrder_Buyer.PlannedETA;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIOrder_Buyer.Comments;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIShipmentHeader.Comments;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.Response.ContainerNo;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.Response.ContainerMode;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.Response.ORG_Consignee_Code;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.Response.ORG_Consignor_Code;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.Response.TransportMode;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.Response.IncoTerm;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.Response.Origin;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.Response.Destination;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.Carrier;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.Voyage;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.Vessel;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.ETD;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.ETA;
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.Comments;
                }
            });
        }

        function MarkAsRead() {
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
            if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                var _input = angular.copy(OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData);
                _input.Description = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionComments;
                _input.RelatedDetails = JSON.stringify(_input.RelatedDetails);
                _input.IsModified = true;
                apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                            JobCommentInsert().then(function (response) {
                                if (response.data.Status == "Success") {
                                    Complete();
                                } else {
                                    toastr.error("Failed...");
                                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
                                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
                                }
                            });
                        } else {
                            Complete();
                        }
                    } else {
                        toastr.error("Failed...");
                        OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
                        OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
                    }
                });
            } else {
                Complete();
            }
        }

        function Complete() {
            var _input = InputData(OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj, 5);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _data = {
                        IsCompleted: true,
                        Item: OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception read succesfully...");
                    OrdApprovalNotifyEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Exception read failed...");
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                }
            });
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.Description = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
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
                            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponseTemp = angular.copy(response.data.Response);
                            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse = response.data.Response;
                            if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails) {
                                OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse.Entities = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails;
                            }
                        }
                    }
                }
            });
        }

        function GetCommentsList() {
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                } else {
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function GetCommentsFilterList() {
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    OrdApprovalNotifyEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        Init();
    }
})();