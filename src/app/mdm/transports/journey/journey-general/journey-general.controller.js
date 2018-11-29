(function () {
    "use strict";

    angular
        .module("Application")
        .controller("JourneyGeneralController", JourneyGeneralController);

    JourneyGeneralController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "journeyConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "filterFilter"];

    function JourneyGeneralController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, journeyConfig, appConfig, toastr, $document, confirmation, $filter, filterFilter) {
        /* jshint validthis: true */
        var JourneyGeneralCtrl = this;

        function Init() {
            var currentJourney = JourneyGeneralCtrl.currentJourney[JourneyGeneralCtrl.currentJourney.label].ePage.Entities;

            JourneyGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Journey_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentJourney,
            };

            JourneyGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            JourneyGeneralCtrl.ePage.Masters.Lineslist = true;
            JourneyGeneralCtrl.ePage.Masters.Config = journeyConfig;
            JourneyGeneralCtrl.ePage.Meta.IsLoading = false;

            JourneyGeneralCtrl.ePage.Masters.emptyText = "-";
            JourneyGeneralCtrl.ePage.Masters.selectedRow = -1;

            JourneyGeneralCtrl.ePage.Masters.HeaderName = '';
            JourneyGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            JourneyGeneralCtrl.ePage.Masters.Edit = Edit;
            JourneyGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;
            JourneyGeneralCtrl.ePage.Masters.Attach = Attach;
            JourneyGeneralCtrl.ePage.Masters.AddNew = AddNew;
            JourneyGeneralCtrl.ePage.Masters.Done = Done;
            JourneyGeneralCtrl.ePage.Masters.Back = Back;
            JourneyGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;
            JourneyGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;

            JourneyGeneralCtrl.ePage.Masters.SelectedFromZone = SelectedFromZone;
            JourneyGeneralCtrl.ePage.Masters.SelectedToZone = SelectedToZone;
            JourneyGeneralCtrl.ePage.Masters.SelectedFromZoneLeg = SelectedFromZoneLeg;
            JourneyGeneralCtrl.ePage.Masters.SelectedToZoneLeg = SelectedToZoneLeg;
            JourneyGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            JourneyGeneralCtrl.ePage.Masters.Validation = Validation;
            JourneyGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
            serviceType()
            GetCfxTypeList()
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            JourneyGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            angular.forEach(JourneyGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                JourneyGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), JourneyGeneralCtrl.currentJourney.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                JourneyGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), JourneyGeneralCtrl.currentJourney.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function setSelectedRow(index) {
            JourneyGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function serviceType() {
            var _filter = {
                "MappingCode": "SENDER_SERVICETYPE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": JourneyGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", JourneyGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    JourneyGeneralCtrl.ePage.Masters.servicetypelistSource = response.data.Response;
                }
            });
        }

        function SelectedFromZone(item) {
            if (item.data) {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.TMZ_FromZoneFK = item.data.entity.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.FromZoneName = item.data.entity.Name;
            } else {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.TMZ_FromZoneFK = item.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.FromZoneName = item.Name;
            }
            JourneyGeneralCtrl.ePage.Masters.OnChangeValues(JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.FromZoneName, "E5524", false, undefined);
        }

        function SelectedToZone(item) {
            if (item.data) {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.TMZ_ToZoneFK = item.data.entity.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.ToZoneName = item.data.entity.Name;
            } else {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.TMZ_ToZoneFK = item.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.ToZoneName = item.Name;
            }
            JourneyGeneralCtrl.ePage.Masters.OnChangeValues(JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.ToZoneName, "E5525", false, undefined);
        }

        function SelectedFromZoneLeg(item) {
            if (item.data) {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_TMZ_FromZoneFK = item.data.entity.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_FromZoneName = item.data.entity.Name;
            } else {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_TMZ_FromZoneFK = item.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_FromZoneName = item.Name;
            }
            JourneyGeneralCtrl.ePage.Masters.OnChangeValues(JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_FromZoneName, "E5560", true, JourneyGeneralCtrl.ePage.Masters.selectedRow);
        }

        function SelectedToZoneLeg(item) {
            if (item.data) {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_TMZ_ToZoneFK = item.data.entity.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_ToZoneName = item.data.entity.Name;
            } else {
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_TMZ_ToZoneFK = item.PK;
                JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_ToZoneName = item.Name;
            }
            JourneyGeneralCtrl.ePage.Masters.OnChangeValues(JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow].TML_ToZoneName, "E5559", true, JourneyGeneralCtrl.ePage.Masters.selectedRow);
        }

        function OnChangeServiceType(serviceType) {
            angular.forEach(JourneyGeneralCtrl.ePage.Masters.servicetypelistSource, function (value, key) {
                if (value.AddRef1Code == serviceType) {
                    JourneyGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.ServiceType = value.AddRef1Code;
                }
            });
            JourneyGeneralCtrl.ePage.Masters.OnChangeValues(JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.ServiceType, "E5528", false, undefined);
        }

        function AddNew() {
            var obj = {
                "LegType": "",
                "PK": "",
                "TMJ_FK": JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.PK,
                "TMJ_JourneyType": "",
                "TMJ_ServiceType": "",
                "TMJ_TMZ_FromZoneFK": "",
                "TMJ_TMZ_ToZoneFK": "",
                "TMJ_Title": JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title,
                "TMJ_WorkingDays": "",
                "TML_FK": "",
                "TML_LegType": "",
                "TML_ManifestType": "",
                "TML_TMZ_ToZoneFK": "",
                "TML_TMZ_ToZoneFK": "",
                "TML_Title": "",
                "TML_TransitDays": ""
            }
            JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg.push(obj);

            JourneyGeneralCtrl.ePage.Masters.Edit(JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg.length - 1, 'New List');
        }

        function GetCfxTypeList() {
            var typeCodeList = ["Leg_type", "JourneyType", "ManifestType"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        JourneyGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        JourneyGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == "JourneyType") {
                            JourneyGeneralCtrl.ePage.Masters.DropDownMasterList.JourneyType.ListSource = filterFilter(JourneyGeneralCtrl.ePage.Masters.DropDownMasterList.JourneyType.ListSource, { Key: 'JRN' })
                        }
                    });
                }
            });
        }


        function Attach($item) {
            $item.some(function (value, index) {
                var _isExist = JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg.some(function (value1, index1) {
                    return value1.TML_FK === value.PK;
                });
                if (!_isExist) {
                    var obj = {
                        "LegType": "",
                        "TMJ_ServiceType": value.TMC_ServiceType,
                        "TMJ_TMZ_FromZoneFK": value.TMZ_FromZoneFK,
                        "TMJ_TMZ_ToZoneFK": value.TMZ_ToZoneFK,
                        "TMJ_Title": value.TMC_JourneyTitle,
                        "TML_FK": value.PK,
                        "TML_LegType": value.LegType,
                        "TML_ManifestType": value.ManifestType,
                        "TML_TMZ_FromZoneFK": value.TMZ_FromZoneFK,
                        "TML_TMZ_ToZoneFK": value.TMZ_ToZoneFK,
                        "TML_Title": value.Title,
                        "TML_TransitDays": value.TransitDays,
                        "IsDeleted": value.IsDeleted,
                    }
                    JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg.push(obj);
                    JourneyGeneralCtrl.ePage.Masters.IsAttach = true;
                    Save(JourneyGeneralCtrl.currentJourney);

                } else {
                    toastr.warning("Record Already Available...!");
                }
            });
        }

        function Edit(index, name) {
            JourneyGeneralCtrl.ePage.Masters.selectedRow = index;
            JourneyGeneralCtrl.ePage.Masters.Lineslist = false;
            JourneyGeneralCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        function RemoveRow() {
            var item = JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK == "") {
                        if (ReturnValue) {
                            JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg.splice(JourneyGeneralCtrl.ePage.Masters.selectedRow, 1);
                            JourneyGeneralCtrl.ePage.Masters.Config.GeneralValidation(JourneyGeneralCtrl.currentJourney);
                        }
                        JourneyGeneralCtrl.ePage.Masters.Lineslist = true;
                        JourneyGeneralCtrl.ePage.Masters.selectedRow = JourneyGeneralCtrl.ePage.Masters.selectedRow - 1;
                    } else {
                        item.IsDeleted = true;

                        JourneyGeneralCtrl.ePage.Entities.Header.Data = filterObjectUpdate(JourneyGeneralCtrl.ePage.Entities.Header.Data, "IsModified");
                        apiService.post("eAxisAPI", 'TmsJourneyList/Update', JourneyGeneralCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", 'TmsJourneyList/GetById/' + response.data.Response.PK).then(function (response) {
                                    JourneyGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                                    toastr.success('Item Removed Successfully');
                                    var ReturnValue = RemoveAllLineErrors();
                                    if (ReturnValue) {
                                        JourneyGeneralCtrl.ePage.Masters.Config.GeneralValidation(JourneyGeneralCtrl.currentJourney);
                                    }
                                    JourneyGeneralCtrl.ePage.Masters.selectedRow = JourneyGeneralCtrl.ePage.Masters.selectedRow - 1;
                                });
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Validation($item) {
            JourneyGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
            JourneyGeneralCtrl.ePage.Masters.SaveButtonText = "Please Wait..";
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            JourneyGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (JourneyGeneralCtrl.ePage.Entities.Header.Validations) {
                JourneyGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(JourneyGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                if (_input.TmsJourneyHeader.TMZ_FromZoneFK && _input.TmsJourneyHeader.TMZ_ToZoneFK && _input.TmsJourneyHeader.ServiceType && _input.TmsJourneyHeader.JourneyType && $item.isNew) {
                    var _filter = {
                        "TMZ_FromZoneFK": _input.TmsJourneyHeader.TMZ_FromZoneFK,
                        "TMZ_ToZoneFK": _input.TmsJourneyHeader.TMZ_ToZoneFK,
                        "ServiceType": _input.TmsJourneyHeader.ServiceType,
                        "JourneyType": _input.TmsJourneyHeader.JourneyType
                    };
                    var input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": JourneyGeneralCtrl.ePage.Entities.Header.API.TmsJourney.FilterID
                    };
                    apiService.post("eAxisAPI", JourneyGeneralCtrl.ePage.Entities.Header.API.TmsJourney.Url, input).then(function (response) {
                        if (response.data.Response.length > 0) {
                            OnChangeValues(null, "E5550", false, undefined);
                            toastr.warning("Journey Exists : " + response.data.Response[0].Title);
                            JourneyGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                            JourneyGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                        } else {
                            OnChangeValues(_input.TmsJourneyHeader.ServiceType, "E5550", false, undefined);
                            Save($item);
                        }
                    });
                } else {
                    Save($item);
                }
            } else {
                JourneyGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(JourneyGeneralCtrl.currentJourney);
                JourneyGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                JourneyGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
            }
        }

        function SaveList($item) {
            JourneyGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
            JourneyGeneralCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");
            apiService.post("eAxisAPI", "TmsJourneyList/Update", _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    toastr.success("Leg Added Successfully");
                    JourneyGeneralCtrl.ePage.Masters.IsLoadingToSave = false;
                    JourneyGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                    apiService.get("eAxisAPI", "TmsJourneyList/GetById/" + JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.PK).then(function SuccessCallback(response) {
                        JourneyGeneralCtrl.ePage.Entities.Header.Data = response.data.Response;
                    });
                } else {
                    toastr.error("Leg Added Failed. Please try again later");
                    JourneyGeneralCtrl.ePage.Masters.IsLoadingToSave = false;
                }
                JourneyGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
            });
        }

        function Back() {
            var item = JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg[JourneyGeneralCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        var ReturnValue = RemoveAllLineErrors();
                        if (ReturnValue) {
                            JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg.splice(JourneyGeneralCtrl.ePage.Masters.selectedRow, 1);
                            JourneyGeneralCtrl.ePage.Masters.Config.GeneralValidation(JourneyGeneralCtrl.currentJourney);
                        }
                        JourneyGeneralCtrl.ePage.Masters.Lineslist = true;
                        JourneyGeneralCtrl.ePage.Masters.selectedRow = JourneyGeneralCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                JourneyGeneralCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done($item) {
            if (JourneyGeneralCtrl.ePage.Masters.HeaderName == 'New List') {
                $timeout(function () {
                    var objDiv = document.getElementById("JourneyGeneralCtrl.ePage.Masters.your_div");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 500);
            }

            var _isExist;
            var test1 = _.groupBy(JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg, 'TML_Title');
            angular.forEach(test1, function (value, key) {
                if (key != "") {
                    if (key == $item.TML_Title) {
                        if (value.length > 1) {
                            _isExist = true;
                        }
                    }
                }
            })
            if (!_isExist) {
                var _Data = JourneyGeneralCtrl.currentJourney[JourneyGeneralCtrl.currentJourney.label].ePage.Entities,
                    _input = _Data.Header.Data,
                    _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

                //Validation Call

                JourneyGeneralCtrl.ePage.Masters.Config.GeneralValidation(JourneyGeneralCtrl.currentJourney);

                if (_errorcount.length == 0) {
                    // Save($item);
                    SaveList(JourneyGeneralCtrl.currentJourney);
                } else {
                    JourneyGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(JourneyGeneralCtrl.currentJourney);
                }

            } else {
                toastr.warning($item.TML_Title + " Already Available...!");
            }
            JourneyGeneralCtrl.ePage.Masters.Lineslist = true;
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

        function RemoveAllLineErrors() {
            for (var i = 0; i < JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyLeg.length; i++) {
                OnChangeValues('value', "E5555", true, i);
                OnChangeValues('value', "E5556", true, i);
                OnChangeValues('value', "E5557", true, i);
                OnChangeValues('value', "E5558", true, i);
                OnChangeValues('value', "E5559", true, i);
                OnChangeValues('value', "E5560", true, i);
            }
            return true;
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsJourneyHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            helperService.SaveEntity($item, 'Journey').then(function (response) {
                if (response.Status === "success") {
                    var _index = journeyConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(JourneyGeneralCtrl.currentJourney[JourneyGeneralCtrl.currentJourney.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        apiService.get("eAxisAPI", 'TmsJourneyList/GetById/' + JourneyGeneralCtrl.currentJourney[JourneyGeneralCtrl.currentJourney.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.data.Response) {
                                journeyConfig.TabList[_index][journeyConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                journeyConfig.TabList.map(function (value, key) {
                                    if (_index == key) {
                                        if (value.New) {
                                            value.label = JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title;
                                            value[JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title] = value.New;
                                            delete value.New;
                                        } else if (!value.isNew) {
                                            var templabel = value.label;
                                            if (templabel == JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title) {
                                                value.label = JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title;
                                                value[JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title] = value[templabel];
                                            } else {
                                                value.label = JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title;
                                                value[JourneyGeneralCtrl.ePage.Entities.Header.Data.TmsJourneyHeader.Title] = value[templabel];
                                                delete value[templabel];
                                            }

                                        }
                                    }
                                });
                            }
                        });
                        journeyConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/journey") {
                            helperService.refreshGrid();
                        }
                    }
                    JourneyGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                    if (JourneyGeneralCtrl.ePage.Masters.IsAttach) {
                        toastr.success("Leg Attached Successfully");
                    } else {
                        toastr.success("Saved Successfully");
                    }
                    JourneyGeneralCtrl.ePage.Masters.IsAttach = false;
                } else if (response.Status === "failed") {
                    toastr.error("Save Failed");
                    JourneyGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        JourneyGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), JourneyGeneralCtrl.currentJourney.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (JourneyGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        JourneyGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(JourneyGeneralCtrl.currentJourney);
                    }
                }
                JourneyGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
            });
        }

        Init();
    }
})();
