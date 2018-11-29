(function () {
    "use strict;"

    angular
        .module("Application")
        .controller("ProcessInstanceModalController", ProcessInstanceModalController);

    ProcessInstanceModalController.$inject = ["$location", "$uibModalInstance", "authService", "apiService", "helperService", "toastr", "param", "trustCenterConfig"];

    function ProcessInstanceModalController($location, $uibModalInstance, authService, apiService, helperService, toastr, param, trustCenterConfig) {
        var ProcessInstanceModalCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessInstanceModalCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessInstanceModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                ProcessInstanceModalCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk) {
                    InitProcessInstanceModal();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitProcessInstanceModal() {
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal = {};
            ProcessInstanceModalCtrl.ePage.Masters.param = angular.copy(param);

            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.InitiateProcess = InitiateProcess;
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.CompleteProcess = CompleteProcessCheck;
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.Cancel = Cancel;

            ProcessInstanceModalCtrl.ePage.Masters.CompleteBtnText = "Complete";
            ProcessInstanceModalCtrl.ePage.Masters.IsDisableBtnComplete = false;

            ProcessInstanceModalCtrl.ePage.Masters.CreateBtnText = "Create";
            ProcessInstanceModalCtrl.ePage.Masters.IsDisableBtnCreate = false;

            if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 2) {
                if (ProcessInstanceModalCtrl.ePage.Masters.param.Data.DueDate) {
                    var _dueDate = new Date(ProcessInstanceModalCtrl.ePage.Masters.param.Data.DueDate);
                    var _curDate = new Date();

                    if (_dueDate < _curDate) {
                        ProcessInstanceModalCtrl.ePage.Masters.IsShowDelayReason = true;
                        GetDelayReasonList();
                    }
                }
            }

            InitProcessInstance();
            InitChildItem();
            InitRelatedInstance();
        }

        function GetDelayReasonList() {
            var _filter = {
                "PK": ProcessInstanceModalCtrl.ePage.Masters.param.Data.WSI_PK,
                "SAP_FK": ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMWorkStepInfo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMWorkStepInfo.API.FindAll.Url, _input).then(function (response) {
                var _response = response.data.Response;
                if (_response) {
                    if (_response.length > 0) {
                        if (_response[0].DelayReason) {
                            if (typeof _response[0].DelayReason == "string") {
                                _response[0].DelayReason = JSON.parse(_response[0].DelayReason);
                            }
                        } else {
                            _response[0].DelayReason = [];
                        }
                        ProcessInstanceModalCtrl.ePage.Masters.DelayReasonList = _response[0].DelayReason;
                    }
                } else {
                    ProcessInstanceModalCtrl.ePage.Masters.DelayReasonList = [];
                }
            });
        }

        /** Process Instance */
        function InitProcessInstance() {
            var _processInfoJson = {};
            ProcessInstanceModalCtrl.ePage.Masters.Instance = {};
            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView = {};

            if (ProcessInstanceModalCtrl.ePage.Masters.param.Item) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView = ProcessInstanceModalCtrl.ePage.Masters.param.Item;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.ProcessName = ProcessInstanceModalCtrl.ePage.Masters.QueryString.Item.ProcessName;
            }

            if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 2) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.CompleteInstanceNo = ProcessInstanceModalCtrl.ePage.Masters.param.Data.PSI_InstanceNo;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.CompleteStepNo = ProcessInstanceModalCtrl.ePage.Masters.param.Data.WSI_StepNo;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.IsWorkStartEnabled = ProcessInstanceModalCtrl.ePage.Masters.param.Data.IsWorkStartEnabled;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.IsWorkStarted = ProcessInstanceModalCtrl.ePage.Masters.param.Data.IsWorkStarted;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.Status = ProcessInstanceModalCtrl.ePage.Masters.param.Data.Status;
            }

            // --------------
            if (ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo) {
                if (ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson) {
                    if (typeof ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson == "string") {
                        ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson = JSON.parse(ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson);
                        _processInfoJson = ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson.CompleteRules[0].WorkStepRules[0].Rules;
                        _processInfoJson = JSON.parse(_processInfoJson);

                        for (x in ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Labels) {
                            _processInfoJson[0].FilterInput.map(function (value, key) {
                                if (x == value.FieldName) {
                                    ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Labels[x] = value.InputName;
                                }
                            });
                        }
                    }
                }
            }

            if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 1) {
                // ProcessMasterList();
            }
        }

        function ProcessMasterList() {
            var _filter = {
                "SAP_FK": ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.EBPMProcessMasterList = response.data.Response;
                } else {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.EBPMProcessMasterList = [];
                }
            });
        }

        /*** Child Item */
        function InitChildItem() {
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.AddNewChildItem = AddNewChildItem;
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.RemoveChildItemRecord = RemoveChildItemRecord;
        }

        function AddNewChildItem() {
            var _obj = {
                EntitySource: "",
                EntityRefKey: "",
                KeyReference: ""
            };

            if (!ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots = {};
                if (!ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem) {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem = [];
                }
            } else {
                if (!ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem) {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem = [];
                }
            }

            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem.push(_obj);
        }

        function RemoveChildItemRecord(item, $index) {
            if ($index != -1) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem.splice($index, 1);
            }
        }

        /** Related Instance */
        function InitRelatedInstance() {
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.AddNewRelatedRecord = AddNewRelatedRecord;
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.RemoveRelatedRecord = RemoveRelatedRecord;
        }

        function AddNewRelatedRecord() {
            var _obj = {
                CompleteInstanceNo: "",
                CompleteStepNo: "",
                Mode: ""
            };

            if (!ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots = {};
                if (!ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related) {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related = [];
                }
            } else {
                if (!ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related) {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related = [];
                }
            }

            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related.push(_obj);
        }

        function RemoveRelatedRecord(item, $index) {
            if ($index != -1) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related.splice($index, 1);
            }
        }

        function InitiateProcess() {
            ProcessInstanceModalCtrl.ePage.Masters.CreateBtnText = "Please Wait...";
            ProcessInstanceModalCtrl.ePage.Masters.IsDisableBtnCreate = true;

            var _input = angular.copy(ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView);
            _input.SAP_FK = ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _obj = {
                        data: _response,
                        mode: ProcessInstanceModalCtrl.ePage.Masters.param.Mode
                    };

                    $uibModalInstance.close(_obj);
                }

                ProcessInstanceModalCtrl.ePage.Masters.CreateBtnText = "Create";
                ProcessInstanceModalCtrl.ePage.Masters.IsDisableBtnCreate = false;
            });
        }

        function CompleteProcessCheck() {
            if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 2 && ProcessInstanceModalCtrl.ePage.Masters.IsShowDelayReason) {
                if (ProcessInstanceModalCtrl.ePage.Masters.DelayReasonList) {
                    if (ProcessInstanceModalCtrl.ePage.Masters.DelayReasonList.length > 0) {
                        var _isChecked = ProcessInstanceModalCtrl.ePage.Masters.DelayReasonList.some(function (value, key) {
                            return value.IsChecked;
                        });

                        if (_isChecked) {
                            ProcessInstanceModalCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                            ProcessInstanceModalCtrl.ePage.Masters.IsDisableBtnComplete = true;

                            var _delayReasonList = angular.copy(ProcessInstanceModalCtrl.ePage.Masters.DelayReasonList);
                            // _delayReasonList.map(function (value, key) {
                            //     if (value.IsChecked) {
                            //         delete value.IsChecked;
                            //         // _delayReasonList.push(value);
                            //     }
                            // });

                            // _delayReasonList.map(function (value, key) {
                            //     if (!value.IsChecked) {
                            //         _delayReasonList.splice(key, 1);
                            //     }
                            // });

                            CompleteProcess(_delayReasonList);
                        } else {
                            toastr.warning("Please Select any Delay Reason...!");
                        }
                    } else {
                        toastr.warning("Configure Delay Reason...!");
                    }
                } else {
                    toastr.warning("Configure Delay Reason...!");
                }
            } else {
                CompleteProcess();
            }
        }

        function CompleteProcess(delayReasonList) {
            var _input = angular.copy(ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView);
            _input.EntityRefKey = ProcessInstanceModalCtrl.ePage.Masters.param.Data.EntityRefKey;
            _input.EntitySource = ProcessInstanceModalCtrl.ePage.Masters.param.Data.EntitySource;
            _input.KeyReference = ProcessInstanceModalCtrl.ePage.Masters.param.Data.KeyReference;

            _input.SAP_FK = ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.IsModified = true;

            if (delayReasonList && ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 2 && ProcessInstanceModalCtrl.ePage.Masters.IsShowDelayReason) {
                _input.DelayReason = delayReasonList;
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _obj = {
                        data: _response,
                        mode: ProcessInstanceModalCtrl.ePage.Masters.param.Mode
                    };

                    toastr.success("Completed Successfully....");
                    $uibModalInstance.close(_obj);
                }

                ProcessInstanceModalCtrl.ePage.Masters.CompleteBtnText = "Complete";
                ProcessInstanceModalCtrl.ePage.Masters.IsDisableBtnComplete = false;
            });
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
