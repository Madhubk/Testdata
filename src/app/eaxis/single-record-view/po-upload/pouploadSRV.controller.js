(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVPOUploadController", SRVPOUploadController);

    SRVPOUploadController.$inject = ["$location", "$timeout", "$injector", "$window", "apiService", "helperService", "toastr", "appConfig"];

    function SRVPOUploadController($location, $timeout, $injector, $window, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVPOUploadCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("poBatchUploadConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVPOUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView_PO_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": Config.Entities
            };

            SRVPOUploadCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVPOUploadCtrl.ePage.Masters.TabList = [];
            SRVPOUploadCtrl.ePage.Masters.activeTabIndex = 0;
            SRVPOUploadCtrl.ePage.Masters.IsTabClick = false;
            SRVPOUploadCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVPOUploadCtrl.ePage.Masters.IsDisableSave = false;
            Config.TabList = [];
            Config.ValidationFindall();
            SRVPOUploadCtrl.ePage.Masters.Config = Config;

            // functions
            SRVPOUploadCtrl.ePage.Entities.AddTab = AddTab;
            SRVPOUploadCtrl.ePage.Masters.RemoveTab = RemoveTab;
            SRVPOUploadCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            SRVPOUploadCtrl.ePage.Masters.Validation = Validation;
            SRVPOUploadCtrl.ePage.Masters.Close = Close;

            SRVPOUploadCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };

            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVPOUploadCtrl.ePage.Masters.Entity.BatchUploadNo;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVPOUploadCtrl.ePage.Masters.Entity.BatchUploadNo) {
                            SRVPOUploadCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVPOUploadCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVPOUploadCtrl.ePage.Masters.Entity.PK,
                            BatchUploadNo: SRVPOUploadCtrl.ePage.Masters.Entity.BatchUploadNo
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVPOUploadCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVPOUploadCtrl.ePage.Masters.Entity.PK,
                        BatchUploadNo: SRVPOUploadCtrl.ePage.Masters.Entity.BatchUploadNo
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdCarrierPlanning_2834,OrdVesselPlanning_3187,VesselPOL_3309,VesselPOD_3310",
                SAP_FK: authService.getUserInfo().AppPK
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

        function GetRecordDetails() {
            var _filter = {
                "PK": SRVPOUploadCtrl.ePage.Masters.Entity.PK,
                "SortColumn": "POH_BatchUploadNo",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "BatchUploadNo": SRVPOUploadCtrl.ePage.Masters.Entity.BatchUploadNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            GetRelatedLookupList();

            var currentObj;
            Config.GetTabDetails(curRecord, false, false, 'BatchUploadNo').then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVPOUploadCtrl.ePage.Masters.Entity.BatchUploadNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVPOUploadCtrl.ePage.Masters.CurrentObj = value;
                            SRVPOUploadCtrl.ePage.Masters.OrderOpen = true;
                            SRVPOUploadCtrl.ePage.Masters.TabList.push(value);
                        }
                    });
                }
            });
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            SRVPOUploadCtrl.ePage.Masters.currentObj = currentTab;
        }

        function RemoveTab(event, index, currentObj) {
            event.preventDefault();
            event.stopPropagation();
            var _currentObj = currentObj[currentObj.label].ePage.Entities;

            // Close Current Order
            apiService.get("eAxisAPI", Config.Entities.Header.API.OrderHeaderActivityClose.Url + _currentObj.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {} else {
                    console.log("Tab close Error : " + response);
                }
            });

            SRVPOUploadCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function Close(index, currentObj) {
            var _currentObj = currentObj[currentObj.label].ePage.Entities;

            // Close Current Order
            apiService.get("eAxisAPI", Config.Entities.Header.API.OrderHeaderActivityClose.Url + _currentObj.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {} else {
                    console.log("Tab close Error : " + response);
                }
            });
            Config.GlobalVar.IsClosed = false;
            $timeout(function () {
                $window.close();
            }, 1000);
        }

        function AddTab1($item) {
            AddTab($item, true, true, 'OrderNo')
        }

        function AddTab(currentObj, IsNew, IsNewOrder, keyObjNo) {
            SRVPOUploadCtrl.ePage.Masters.OrderOpen = false;
            SRVPOUploadCtrl.ePage.Masters.currentObj = undefined;
            if (keyObjNo == "OrderNo") {
                SRVPOUploadCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentObj.entity);
            }
            var _isExist = SRVPOUploadCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === currentObj.entity[keyObjNo];
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVPOUploadCtrl.ePage.Masters.IsTabClick = true;
                var _currentObj = undefined;
                if (!IsNew) {
                    _currentObj = currentObj.entity;
                } else {
                    _currentObj = currentObj;

                }
                Config.GetTabDetails(_currentObj, IsNew, IsNewOrder, keyObjNo).then(function (response) {
                    SRVPOUploadCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        SRVPOUploadCtrl.ePage.Masters.activeTabIndex = SRVPOUploadCtrl.ePage.Masters.TabList.length - 1;
                        SRVPOUploadCtrl.ePage.Masters.CurrentActiveTab(currentObj.entity[keyObjNo]);
                        SRVPOUploadCtrl.ePage.Masters.IsTabClick = false;
                        if (keyObjNo == 'OrderNo') {
                            SRVPOUploadCtrl.ePage.Masters.OrderOpen = false;
                            SRVPOUploadCtrl.ePage.Masters.TabConfig = "BatchUpload";
                        }
                        FindConfig();
                    });
                });
            } else {
                toastr.warning(keyObjNo + "Already Opened...!");

            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            Config.GeneralValidation($item);
            //Validation Call
            if (_errorcount.length == 0) {
                Save($item);
            } else {
                Config.ShowErrorWarningModal($item);
            }
        }

        function Save($item) {
            SRVPOUploadCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            SRVPOUploadCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            // Push addresslist to jobaddress
            var _array = [];
            for (var i in _Data.Header.Data.UIAddressContactList) {
                if (i !== "CfxTypeList") {
                    _array.push(_Data.Header.Data.UIAddressContactList[i]);
                }
            }
            _Data.Header.Data.UIJobAddress = [];
            _array.map(function (value, key) {
                _Data.Header.Data.UIJobAddress.push(value);
            });

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }
            if ($item.isNew) {
                _input.UIPorOrderHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                _input.UICustomEntity.IsNewInsert = true;
            }
            helperService.SaveEntity($item, 'Order').then(function (response) {
                if (response.Status === "success") {
                    var _Data = $item[$item.label].ePage.Entities;
                    if (SRVPOUploadCtrl.ePage.Masters.CopyOrderHeader.Comments != _Data.Header.Data.UIPorOrderHeader.Comments) {
                        JobCommentInsert(response.Data.UIPorOrderHeader);
                    }
                    SRVPOUploadCtrl.ePage.Masters.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == SRVPOUploadCtrl.ePage.Masters.TabList[key].code) {
                                value.label = SRVPOUploadCtrl.ePage.Masters.TabList[key].code;
                                value[SRVPOUploadCtrl.ePage.Masters.TabList[key].code] = value.New;
                                SRVPOUploadCtrl.ePage.Masters.currentObj = value.code;
                                delete value.New;
                            }
                        }
                    });
                    var _index = SRVPOUploadCtrl.ePage.Masters.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(SRVPOUploadCtrl.ePage.Masters.currentObj);

                    if (_index !== -1) {
                        Config.TabList[_index][Config.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        response.Data.UIJobAddress.map(function (val, key) {
                            Config.TabList[_index][Config.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        Config.TabList[_index].isNew = false;
                    }
                    SRVPOUploadCtrl.ePage.Masters.CopyOrderHeader = response.Data.UIPorOrderHeader;
                    console.log("Success");
                    toastr.success("Save successfully...");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Save failed...");
                }

                SRVPOUploadCtrl.ePage.Masters.SaveButtonText = "Save";
                SRVPOUploadCtrl.ePage.Masters.IsDisableSave = false;
            });

            function JobCommentInsert(data) {
                if (data) {
                    var _jobCommentsInput = {
                        "PK": "",
                        "EntityRefKey": data.PK,
                        "EntitySource": "SFU",
                        "Comments": data.Comments
                    }
                }

                // job comments api call
                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_jobCommentsInput]).then(function (response) {
                    if (response.data.Response) {

                    } else {
                        toastr.error("Job Comments Save Failed...")
                    }
                });
            }
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

        function FindConfig() {
            var _filter = {
                "DataEntryName": "OrderHeaderCustom"
            }
            var _input = {
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            }
            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {} else {
                    toastr.error("Empty Responseor error API...");
                }
            });
        }

        Init();
    }
})();