(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AttachManifestDirectiveController", AttachManifestDirectiveController);

    AttachManifestDirectiveController.$inject = ["$scope", "$rootScope", "apiService", "helperService", "distributionConfig", "$q", "toastr", "appConfig", "errorWarningService", "$filter", "$timeout", "dynamicLookupConfig", "outwardConfig", "$uibModal", "$window"];

    function AttachManifestDirectiveController($scope, $rootScope, apiService, helperService, distributionConfig, $q, toastr, appConfig, errorWarningService, $filter, $timeout, dynamicLookupConfig, outwardConfig, $uibModal, $window) {
        var AttachManifestCtrl = this;

        function Init() {
            AttachManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Attach_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            InitFunction();
        }
        // #region - Init function
        function InitFunction() {
            AttachManifestCtrl.ePage.Masters.TaskObj = AttachManifestCtrl.taskObj;
            AttachManifestCtrl.ePage.Masters.EntityObj = AttachManifestCtrl.entityObj;
            AttachManifestCtrl.ePage.Masters.TabObj = AttachManifestCtrl.tabObj;

            AttachManifestCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            AttachManifestCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            // errorWarningService.Modules = {};

            if (AttachManifestCtrl.ePage.Masters.EntityObj) {
                AttachManifestCtrl.ePage.Meta.IsLoading = true;
                AttachManifestCtrl.ePage.Entities.Header.Data = AttachManifestCtrl.ePage.Masters.TabObj[AttachManifestCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
                AttachManifestCtrl.ePage.Masters.TabList = AttachManifestCtrl.ePage.Masters.TabObj;
                AttachManifestCtrl.ePage.Meta.IsLoading = false;
                AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                $timeout(function () {
                    if (!AttachManifestCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getOutwardDetails();
                        if (AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK)
                            getManifestDetails();
                        else
                            AttachManifestCtrl.ePage.Masters.ManifestDetails = [];
                        outwardConfig.ValidationFindall();
                        AttachManifestCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatus": "ENT",
                            "ClientCode": AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                        var AddressType = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "INW" ? "DEL" : "PIC";
                        if (AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "ORD") {
                            var Receiver_ORG_FK = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        } else {
                            var Sender_ORG_FK = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        }

                        AttachManifestCtrl.ePage.Masters.DefaultManifestFilter = {
                            "AddressType": AddressType,
                            "Sender_ORG_FK": Sender_ORG_FK,
                            "Receiver_ORG_FK": Receiver_ORG_FK,
                            "ManifestStatus": "TBK"
                        };
                    }
                }, 500);

            } else if (AttachManifestCtrl.ePage.Masters.TaskObj) {
                getGatepassDetails();
            }
            AttachManifestCtrl.ePage.Masters.Save = Save;
            AttachManifestCtrl.ePage.Masters.Complete = Complete;
            AttachManifestCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            AttachManifestCtrl.ePage.Masters.AttachOutward = AttachOutward;
            AttachManifestCtrl.ePage.Masters.AttachManifest = AttachManifest;
            AttachManifestCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            AttachManifestCtrl.ePage.Masters.ManifestSingleRecordView = ManifestSingleRecordView;
            AttachManifestCtrl.ePage.Masters.DeleteManifest = DeleteManifest;
            AttachManifestCtrl.ePage.Masters.Delete = Delete;
            AttachManifestCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AttachManifestCtrl.ePage.Masters.setManifestSelectedRow = setManifestSelectedRow;


            AttachManifestCtrl.ePage.Masters.IsDisableSaveBtn = false;
            AttachManifestCtrl.ePage.Masters.SaveBtnText = "Save";
            // AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            AttachManifestCtrl.ePage.Masters.CompleteBtnText = "Complete";
            AttachManifestCtrl.ePage.Masters.SaveButtonText = "Save";

            AttachManifestCtrl.ePage.Masters.selectedRow = -1;
            AttachManifestCtrl.ePage.Masters.selectedManifestRow = -1;
            AttachManifestCtrl.ePage.Masters.IsAttached = false;
            StandardMenuConfig();
        }
        // #endregion

        function Delete(item) {
            AttachManifestCtrl.ePage.Meta.IsLoading = true;
            var value = AttachManifestCtrl.ePage.Masters.OutwardDetails[AttachManifestCtrl.ePage.Masters.selectedRow];
            value.TGP_FK = null;
            value.GatepassNo = null;
            value.IsModified = true;
            apiService.post("eAxisAPI", distributionConfig.Entities.WmsOutward.API.Update.Url, value).then(function (response) {
                if (response.data.Response) {
                    AttachManifestCtrl.ePage.Masters.OutwardDetails.splice(AttachManifestCtrl.ePage.Masters.selectedRow, 1);
                    AttachManifestCtrl.ePage.Masters.selectedRow = -1;
                    toastr.success("Outward Deleted Successfully");
                    AttachManifestCtrl.ePage.Meta.IsLoading = false;
                }
            });
        }

        function getManifestDetails() {
            var _filter = {
                "PK": AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.TmsManifestList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.TmsManifestList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AttachManifestCtrl.ePage.Masters.ManifestDetails = response.data.Response;
                    AttachManifestCtrl.ePage.Masters.IsAttached = true;
                    AttachManifestCtrl.ePage.Masters.IsAttachedManifest = true;
                }
            });
        }

        function setSelectedRow(index) {
            AttachManifestCtrl.ePage.Masters.selectedRow = index;
        }

        function setManifestSelectedRow(index) {
            AttachManifestCtrl.ePage.Masters.selectedManifestRow = index;
        }

        function DeleteManifest() {
            AttachManifestCtrl.ePage.Meta.IsLoading = true;
            AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK = null;
            AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TMM_ManifestNumber = null;
            AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.JDAFK = null;
            AttachManifestCtrl.ePage.Entities.Header.Data.TmsManifestpickupanddelivery = {};
            AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;
            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, AttachManifestCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    AttachManifestCtrl.ePage.Masters.ManifestDetails.splice(AttachManifestCtrl.ePage.Masters.selectedManifestRow, 1);
                    AttachManifestCtrl.ePage.Masters.selectedManifestRow = -1;
                    toastr.success("Manifest Deleted Successfully");
                    AttachManifestCtrl.ePage.Meta.IsLoading = false;
                }
            });
        }

        function ManifestSingleRecordView(item) {
            var _queryString = {
                PK: item.PK,
                ManifestNumber: item.ManifestNumber,
                ConfigName: "dmsManifestConfig",
                Header: item
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/outwardmanifest/" + _queryString, "_blank");
        }
        // #region - attach manifest
        function AttachManifest(item) {
            if (item.length == 1) {
                if (AttachManifestCtrl.ePage.Masters.ManifestDetails.length == 0) {
                    var _isExist = AttachManifestCtrl.ePage.Masters.ManifestDetails.some(function (value1, index1) {
                        return value1.PK === item[0].PK;
                    });
                    if (!_isExist) {
                        AttachManifestCtrl.ePage.Meta.IsLoading = true;
                        AttachManifestCtrl.ePage.Masters.ManifestDetails.push(item[0]);
                        AttachManifestCtrl.ePage.Masters.AttachVariable = 'AttachManifest';
                        AttachManifestCtrl.ePage.Masters.IsAttached = true;
                        AttachManifestCtrl.ePage.Masters.IsAttachedManifest = true;
                        AttachManifestCtrl.ePage.Entities.Header.Data.TmsManifestpickupanddelivery = item[0];
                        AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK = item[0].EntityRefKey;
                        AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TMM_ManifestNumber = item[0].ManifestNumber;
                        AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.JDAFK = item[0].JDA_FK;
                        AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;
                        apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, AttachManifestCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                toastr.success("Manifest Attached Successfully");
                                AttachManifestCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    } else {
                        toastr.warning(item[0].EntityRefKey + " Already available");
                    }
                } else {
                    toastr.warning("Only one Manifest should be Attached to this Gatepass");
                }
            } else {
                toastr.warning("Please select one Manifest");
            }
        }
        // #endregion       
        // #region - single record view 
        function SingleRecordView(item) {
            var _queryString = {
                PK: item.PK,
                WorkOrderID: item.WorkOrderID
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/gatepassoutward/" + _queryString, "_blank");
        }
        // #endregion               
        // #region - attach outward
        function AttachOutward(item) {
            angular.forEach(item, function (value, key) {
                var _isExist = AttachManifestCtrl.ePage.Masters.OutwardDetails.some(function (value1, index1) {
                    return value1.PK === value.PK;
                });
                if (!_isExist) {
                    AttachManifestCtrl.ePage.Meta.IsLoading = true;
                    value.TGP_FK = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.PK;
                    value.GatepassNo = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                    value.ArrivalDate = new Date();
                    value.IsModified = true;
                    apiService.post("eAxisAPI", distributionConfig.Entities.WmsOutward.API.Update.Url, value).then(function (response) {
                        if (response.data.Response) {
                            AttachManifestCtrl.ePage.Masters.IsAttached = true;
                            AttachManifestCtrl.ePage.Masters.IsAttachedOutward = true;
                            AttachManifestCtrl.ePage.Masters.AttachVariable = 'AttachOrder';
                            AttachManifestCtrl.ePage.Masters.OutwardDetails.push(response.data.Response);
                            toastr.success("Outward Attached Successfully");
                            AttachManifestCtrl.ePage.Meta.IsLoading = false;
                        }
                    });
                } else {
                    toastr.warning(value.WorkOrderID + " Already Available...!");
                }
            });
        }
        // #endregion
        // #region - get outward details based on gatepass
        function getOutwardDetails() {
            var _filter = {
                "GatepassNo": AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsOutward.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.WmsOutward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AttachManifestCtrl.ePage.Masters.OutwardDetails = response.data.Response;
                    if (AttachManifestCtrl.ePage.Masters.OutwardDetails.length > 0) {
                        AttachManifestCtrl.ePage.Masters.IsAttached = true;
                        AttachManifestCtrl.ePage.Masters.IsAttachedOutward = true;
                    }
                }
            });
        }
        // #endregion
        // #region - get task level configuration  - common
        function getTaskConfigData() {
            var EEM_Code_3;
            if (AttachManifestCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = AttachManifestCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": AttachManifestCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EEM_Code_3": EEM_Code_3,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AttachManifestCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    AttachManifestCtrl.ePage.Masters.MenuListSource = $filter('filter')(AttachManifestCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    AttachManifestCtrl.ePage.Masters.ValidationSource = $filter('filter')(AttachManifestCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (AttachManifestCtrl.ePage.Masters.ValidationSource.length > 0) {
                        AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ValidationFindall();
                    } else {
                        AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    }
                    AttachManifestCtrl.ePage.Masters.DocumentValidation = $filter('filter')(AttachManifestCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (AttachManifestCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    AttachManifestCtrl.ePage.Masters.MenuObj = AttachManifestCtrl.taskObj;
                    AttachManifestCtrl.ePage.Masters.MenuObj.TabTitle = AttachManifestCtrl.taskObj.KeyReference;
                }
            });
        }

        function ValidationFindall() {
            if (AttachManifestCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT",
                    },
                    GroupCode: AttachManifestCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: AttachManifestCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
                AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            }
        }

        function DocumentValidation() {
            if (AttachManifestCtrl.ePage.Masters.TaskObj) {
                // errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "DMS",
                        SubModuleCode: "GAT"
                    },
                    GroupCode: "Document",
                    EntityObject: AttachManifestCtrl.ePage.Entities.Header.Data,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof AttachManifestCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                AttachManifestCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(AttachManifestCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            AttachManifestCtrl.ePage.Masters.docTypeSource = $filter('filter')(AttachManifestCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(AttachManifestCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                "EntityRefKey": AttachManifestCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": AttachManifestCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": AttachManifestCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (AttachManifestCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(AttachManifestCtrl.ePage.Masters.docTypeSource, 'DocType');
                        var DocumentListSource = _.groupBy(response.data.Response, 'DocumentType');
                        angular.forEach(TempDocTypeSource, function (value1, key1) {
                            angular.forEach(DocumentListSource, function (value, key) {
                                if (key == key1) {
                                    _arr.push(value);
                                }
                            });
                        });
                        deferred.resolve(_arr);
                    } else {
                        deferred.resolve(_arr);
                    }
                }
            });
            return deferred.promise;
        }
        // #endregion
        // #region - get entity obj details
        function getGatepassDetails() {
            AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            apiService.get("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.GetById.Url + AttachManifestCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    AttachManifestCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                    AttachManifestCtrl.ePage.Meta.IsLoading = false;
                    AttachManifestCtrl.ePage.Entities.Header.Data = AttachManifestCtrl.ePage.Masters.GatepassDetails;

                    if (!AttachManifestCtrl.ePage.Masters.IsTaskList) {
                        getTaskConfigData();
                        getOutwardDetails();
                        if (AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK)
                            getManifestDetails();
                        else
                            AttachManifestCtrl.ePage.Masters.ManifestDetails = [];
                        GetDynamicLookupConfig();
                        outwardConfig.ValidationFindall();
                        AttachManifestCtrl.ePage.Masters.DefaultFilter = {
                            "WorkOrderStatusIn": "OCP,OAS",
                            "ClientCode": AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode,
                            "WarehouseCode": AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode,
                            "GatepassNo": "NULL"
                        };
                        var AddressType = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "INW" ? "DEL" : "PIC";
                        if (AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "ORD") {
                            var Receiver_ORG_FK = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        } else {
                            var Sender_ORG_FK = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK;
                        }

                        AttachManifestCtrl.ePage.Masters.DefaultManifestFilter = {
                            "AddressType": AddressType,
                            "Sender_ORG_FK": Sender_ORG_FK,
                            "Receiver_ORG_FK": Receiver_ORG_FK,
                            "ManifestStatus": "TBK"
                        };

                        if (AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo)
                            AttachManifestCtrl.ePage.Masters.str = AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo.replace(/\//g, '');
                        else
                            AttachManifestCtrl.ePage.Masters.str = "New";
                    }
                }
            });
        }
        // #endregion
        // #region - general
        function StandardMenuConfig() {
            AttachManifestCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": AttachManifestCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": AttachManifestCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": AttachManifestCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": AttachManifestCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": AttachManifestCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": AttachManifestCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetDynamicLookupConfig() {
            var _filter = {
                pageName: 'WarehouseOutward'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }
        // #endregion
        // #region - Save and Complete 
        function Complete() {
            if (AttachManifestCtrl.ePage.Masters.ValidationSource.length > 0 || AttachManifestCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (AttachManifestCtrl.ePage.Masters.ValidationSource.length > 0) {

                    if (AttachManifestCtrl.ePage.Masters.OutwardDetails.length > 0 || AttachManifestCtrl.ePage.Masters.ManifestDetails.length > 0) {
                        AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrderNo = true;
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT",
                        },
                        GroupCode: AttachManifestCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: AttachManifestCtrl.ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }
                if (AttachManifestCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (AttachManifestCtrl.ePage.Masters.docTypeSource.length == 0 || AttachManifestCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            AttachManifestCtrl.ePage.Entities.Header.Data.Document = true;
                        } else {
                            AttachManifestCtrl.ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "DMS",
                                SubModuleCode: "GAT",
                            },
                            GroupCode: "Document",
                            EntityObject: AttachManifestCtrl.ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                } $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (AttachManifestCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    var doctypedesc = '';
                                    angular.forEach(AttachManifestCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        AttachManifestCtrl.ePage.Masters.ShowErrorWarningModal(AttachManifestCtrl.taskObj.PSI_InstanceNo);
                        if (AttachManifestCtrl.ePage.Masters.IsTaskList) {
                            AttachManifestCtrl.getErrorWarningList({
                                $item: _errorcount
                            });
                        }
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function CompleteWithSave() {
            AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            AttachManifestCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestAttachedTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: AttachManifestCtrl.ePage.Masters.TaskObj
                    };

                    AttachManifestCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                AttachManifestCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                AttachManifestCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            AttachManifestCtrl.ePage.Entities.Header.Data = filterObjectUpdate(AttachManifestCtrl.ePage.Entities.Header.Data, "IsModified");

            apiService.post("eAxisAPI", distributionConfig.Entities.TMSGatepassList.API.Update.Url, AttachManifestCtrl.ePage.Entities.Header.Data).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function Save() {
            AttachManifestCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            AttachManifestCtrl.ePage.Masters.IsDisableSaveBtn = true;
            AttachManifestCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    AttachManifestCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    AttachManifestCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        // #endregion

        Init();
    }
})();
