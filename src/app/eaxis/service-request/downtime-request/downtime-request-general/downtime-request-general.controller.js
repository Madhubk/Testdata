(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DowntimeRequestGeneralController", DowntimeRequestGeneralController);

    DowntimeRequestGeneralController.$inject = ["apiService", "appConfig", "APP_CONSTANT", "downtimeRequestConfig", "myRequestConfig", "helperService", "toastr", "authService", "$injector", "confirmation", "$timeout"];

    function DowntimeRequestGeneralController(apiService, appConfig, APP_CONSTANT, downtimeRequestConfig, myRequestConfig, helperService, toastr, authService, $injector, confirmation, $timeout) {

        var DowntimeRequestGeneralCtrl = this;

        function Init() {
            // if (DowntimeRequestGeneralCtrl.currentDowntimeRequest) {
            //     var currentDowntimeRequest = DowntimeRequestGeneralCtrl.currentDowntimeRequest[DowntimeRequestGeneralCtrl.currentDowntimeRequest.label].ePage.Entities;
            // }

            if (DowntimeRequestGeneralCtrl.currentDowntimeRequest) {
                var currentDowntimeRequest = DowntimeRequestGeneralCtrl.currentDowntimeRequest[DowntimeRequestGeneralCtrl.currentDowntimeRequest.label].ePage.Entities;
                DowntimeRequestGeneralCtrl.ePage = {
                    "Title": "",
                    "Prefix": "DowntimeRequest_General",
                    "Masters": {},
                    "Meta": helperService.metaBase(),
                    "Entities": currentDowntimeRequest
                };
                
                DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj = {};
                DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea = {};

                GetData();
            }
            else {
                DowntimeRequestGeneralCtrl.ePage = {
                    "Title": "",
                    "Prefix": "DowntimeRequest_General",
                    "Masters": {},
                    "Meta": helperService.metaBase(),
                    "Entities": {
                        "Header": {
                            "Data": {}
                        }
                    },
                };
                
                // grid empty array
                DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea = [];
            }

            //(currentDowntimeRequest) ? DowntimeRequestGeneralCtrl.ePage.Entities = currentDowntimeRequest : false;

            // save
            DowntimeRequestGeneralCtrl.ePage.Masters.InsertData = InsertData;
            DowntimeRequestGeneralCtrl.ePage.Masters.UpdateData = UpdateData;
            DowntimeRequestGeneralCtrl.ePage.Masters.ClearData = ClearData;
            DowntimeRequestGeneralCtrl.ePage.Masters.GetData = GetData;

            //Time Zone
            DowntimeRequestGeneralCtrl.ePage.Masters.TimeZone = TimeZone;

            // DatePicker
            DowntimeRequestGeneralCtrl.ePage.Masters.DatePicker = {};
            DowntimeRequestGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DowntimeRequestGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            DowntimeRequestGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            //For table
            DowntimeRequestGeneralCtrl.ePage.Masters.SelectAll = false;
            DowntimeRequestGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            DowntimeRequestGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            DowntimeRequestGeneralCtrl.ePage.Masters.Enable = true;
            DowntimeRequestGeneralCtrl.ePage.Masters.selectedRow = -1;
            DowntimeRequestGeneralCtrl.ePage.Masters.emptyText = '-';
            DowntimeRequestGeneralCtrl.ePage.Masters.SearchTable = '';

            DowntimeRequestGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            DowntimeRequestGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            DowntimeRequestGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            DowntimeRequestGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            DowntimeRequestGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            DowntimeRequestGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            DowntimeRequestGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            DowntimeRequestGeneralCtrl.ePage.Masters.userselected = "";
            DowntimeRequestGeneralCtrl.ePage.Masters.Linesave = true;
            DowntimeRequestGeneralCtrl.ePage.Masters.Config = $injector.get("downtimeRequestConfig");
            DowntimeRequestGeneralCtrl.ePage.Masters.TableProperties = DowntimeRequestGeneralCtrl.ePage.Masters.Config.Entities.Header.TableProperties;
            DowntimeRequestGeneralCtrl.ePage.Masters.AppChange = ChangeMethod;

            // grid empty array
            //DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea = [];

            // Priority Dropdown
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.PriorityDetails = [
                {
                    "value": 1,
                    "Name": "LOW"
                },
                {
                    "value": 2,
                    "Name": "MEDIUM"
                },
                {
                    "value": 3,
                    "Name": "HIGH"
                }
            ];

            // function
            DowntimeRequestGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
            DowntimeRequestGeneralCtrl.ePage.Masters.DisableSave = false;

            // Menu list from configuration
            //DowntimeRequestGeneralCtrl.ePage.Masters.DowntimeRequestMenu.ListSource = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Meta.MenuList;
            DowntimeRequestGeneralCtrl.ePage.Masters.Validation = Validation;
            DowntimeRequestGeneralCtrl.ePage.Masters.Config = downtimeRequestConfig;

            // get table properties 
            if (DowntimeRequestGeneralCtrl.tableProperties) {
                $timeout(function () {
                    DowntimeRequestGeneralCtrl.ePage.Masters.TableProperties.UIPackingLines = angular.copy(DowntimeRequestGeneralCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }

            TimeZone();
            DepotName();
        }

        //Get Time Zone
        function TimeZone() {
            apiService.get("eAxisAPI", downtimeRequestConfig.Entities.Header.API.TimeZone.Url).then(function (response) {
                if (response.data.Response) {
                    console.log(response.data.Response)
                    DowntimeRequestGeneralCtrl.ePage.Masters.TimeZoneDrop = response.data.Response;
                }
            });
        }

        function InsertData($item) {
            var _data = $item;

            // Get PK value
            apiService.get("eAxisAPI", downtimeRequestConfig.Entities.Header.API.EmptyGetByID.Url).then(function (response) {
                if (response.data.Response) {
                    console.log(response.data.Response)

                    var GetPK = response.data.Response;
                    var AddtionalInfoDetails = {
                        "UsersImpacted": _data.AppObj.UserImpacted,
                        "Purpose": _data.SrqArea
                    };
                    var _input = {
                        "PK": GetPK.PK,
                        "UIServiceRequest": {
                            "PK": GetPK.PK,
                            "RequestNo": GetPK.UIServiceRequest.RequestNo,
                            "RequestType": "Downtime Request",
                            "RequestedDateTime": null,
                            "ApprovedBy": null,
                            "RequestStatus": "Planned",
                            "Priority": _data.Priority,
                            "Application": _data.Application,
                            "Module": _data.Module,
                            "CreatedDateTime": null,
                            "CreatedBy": null,
                            "ModifiedDateTime": null,
                            "ModifiedBy": null,
                            "TenantCode": null,
                            "SAP_FK": null,
                            "IsModified": false,
                            "IsDeleted": false
                        },
                        "UIDowntimeRequest": {
                            "PK": "",
                            "SRR_FK": GetPK.PK,
                            "Environment": _data.Environment,
                            "IsCheckListVerfied": null,
                            "IsPlanned": true,
                            "ApplicationContactName": _data.AppObj.ApplicationContactName,
                            "ApplicationContactMail": _data.AppObj.ApplicationContactEmail,
                            "BusinessContactName": _data.AppObj.BusinessContactName,
                            "BusinessContactMail": _data.AppObj.BusinessContactEmail,
                            "PlannedStartDateTime": _data.PlannedStartDateTime,
                            "PlannedEndDateTime": _data.PlannedEndDateTimeDate,
                            "AppCurrentVersion": _data.ApplicationCurrentVersion,
                            "AppReleasedVersion": _data.ApplicationReleaseVersion,
                            // "AddtionalInfo": JSON.stringify(_data.SrqArea),
                            "AddtionalInfo": JSON.stringify(AddtionalInfoDetails),
                            "CreatedDateTime": null,
                            "CreatedBy": null,
                            "ModifiedDateTime": null,
                            "ModifiedBy": null,
                            "TenantCode": null,
                            "SAP_FK": null,
                            "IsModified": false,
                            "IsDeleted": false,
                            "TimeZone": _data.Timezone
                        }
                    }

                    // Insert data
                    apiService.post("eAxisAPI", downtimeRequestConfig.Entities.Header.API.InsertDownTimeRequest.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            toastr.success("Save Successful...")
                            ClearData();

                            // Get saved data
                            apiService.get("eAxisAPI", downtimeRequestConfig.Entities.Header.API.GetByID.Url + "/" + GetPK.PK).then(function (response) {
                                if (response.data.Response) {
                                    console.log(response.data.Response)

                                    var GetSavedData = response.data.Response;

                                    var strAddtionalInfo = JSON.parse(GetSavedData.UIDowntimeRequest.AddtionalInfo);

                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Application = GetSavedData.UIServiceRequest.Application;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Environment = GetSavedData.UIDowntimeRequest.Environment;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.ApplicationContactName = GetSavedData.UIDowntimeRequest.ApplicationContactName;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.ApplicationContactEmail = GetSavedData.UIDowntimeRequest.ApplicationContactMail;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Timezone = GetSavedData.UIDowntimeRequest.TimeZone;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Priority = GetSavedData.UIServiceRequest.Priority;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Module = GetSavedData.UIServiceRequest.Module;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.BusinessContactName = GetSavedData.UIDowntimeRequest.BusinessContactName;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.BusinessContactEmail = GetSavedData.UIDowntimeRequest.BusinessContactMail;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.PlannedStartDateTime = GetSavedData.UIDowntimeRequest.PlannedStartDateTime;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.PlannedEndDateTimeDate = GetSavedData.UIDowntimeRequest.PlannedEndDateTime;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.ApplicationCurrentVersion = GetSavedData.UIDowntimeRequest.AppCurrentVersion;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.ApplicationReleaseVersion = GetSavedData.UIDowntimeRequest.AppReleasedVersion;
                                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;
                                }
                            });

                            if (DowntimeRequestGeneralCtrl.ePage.Masters.Update) {
                                DowntimeRequestGeneralCtrl.ePage.Masters.Update = true;
                            }
                        } else {
                            toastr.error("Save failed...")
                        }
                    });
                } else {
                    toastr.error("Read failed..")
                }
            });
        }

        function GetData() {
            var GetSavedDetails = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data;

            var strAddtionalInfo = JSON.parse(GetSavedDetails.UIDowntimeRequest.AddtionalInfo);

            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Application = GetSavedDetails.UIServiceRequest.Application;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Environment = GetSavedDetails.UIDowntimeRequest.Environment;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.ApplicationContactName = GetSavedDetails.UIDowntimeRequest.ApplicationContactName;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.ApplicationContactEmail = GetSavedDetails.UIDowntimeRequest.ApplicationContactMail;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Timezone = GetSavedDetails.UIDowntimeRequest.TimeZone;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Priority = GetSavedDetails.UIServiceRequest.Priority;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Module = GetSavedDetails.UIServiceRequest.Module;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.BusinessContactName = GetSavedDetails.UIDowntimeRequest.BusinessContactName;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.BusinessContactEmail = GetSavedDetails.UIDowntimeRequest.BusinessContactMail;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.PlannedStartDateTime = GetSavedDetails.UIDowntimeRequest.PlannedStartDateTime;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.PlannedEndDateTimeDate = GetSavedDetails.UIDowntimeRequest.PlannedEndDateTime;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.ApplicationCurrentVersion = GetSavedDetails.UIDowntimeRequest.AppCurrentVersion;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.ApplicationReleaseVersion = GetSavedDetails.UIDowntimeRequest.AppReleasedVersion;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.strName = "Users Impacted";

        }

        function ClearData() {
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Application = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Environment = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.ApplicationContactName = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.ApplicationContactEmail = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Timezone = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Priority = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.Module = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.BusinessContactName = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.BusinessContactEmail = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = null;
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.PlannedStartDateTime = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.PlannedEndDateTimeDate = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.ApplicationCurrentVersion = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.ApplicationReleaseVersion = "";
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea = null;
        }

        function UpdateData() {

        }

        // Depot name
        function DepotName() {
            var _filter = {
                "SortColumn": "ORG_Code",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "FilterType": "organization",
                "IsRoadFreightDepot": true
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGHEAD"
            };
            apiService.post("eAxisAPI", "OrgHeader/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DowntimeRequestGeneralCtrl.ePage.Masters.DepotList = response.data.Response;
                }
            });
        }

        // Open Date Picker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DowntimeRequestGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        //#region application details(json)
        function GetGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "SERVICEREQUEST"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    DowntimeRequestGeneralCtrl.ePage.Masters.AppDrop = response.data.Response;
                }
            });
        }

        function ChangeMethod(obj) {
            //console.log(obj)

            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "SERVICEREQUEST",
                "Key": obj
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    if (obj !== null) {
                        if (response.data.Response[0].Value != '') {
                            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj = JSON.parse(response.data.Response[0].Value);
                            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj.strName = "Users Impacted";
                        }
                    }
                    else {
                        var JSONEmptyObj = {
                            "UserImpacted": null,
                            "ApplicationContactName": "",
                            "ApplicationContactEmail": "",
                            "BusinessContactName": "",
                            "BusinessContactEmail": "",
                            "strName": ""
                        }
                        DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.AppObj = JSONEmptyObj;
                    }
                }
            });
        }
        //#endregion application details(json)

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea, function (value, key) {
                if (DowntimeRequestGeneralCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    DowntimeRequestGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                    DowntimeRequestGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                }
                else {
                    value.SingleSelect = false;
                    DowntimeRequestGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                    DowntimeRequestGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                DowntimeRequestGeneralCtrl.ePage.Masters.SelectAll = false;
            } else {
                DowntimeRequestGeneralCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                DowntimeRequestGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                DowntimeRequestGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                DowntimeRequestGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                DowntimeRequestGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index) {
            DowntimeRequestGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            // DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "Name": "",
                "IsDeleted": false,
            };
            DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.push(obj);
            DowntimeRequestGeneralCtrl.ePage.Masters.selectedRow = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("DowntimeRequestGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            // DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            // DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.length - 1; i >= 0; i--) {
                if (DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea[i].SingleSelect) {
                    var obj = angular.copy(DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect = false;
                    obj.IsCopied = true;
                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.splice(i + 1, 0, obj);
                }
            }
            DowntimeRequestGeneralCtrl.ePage.Masters.selectedRow = -1;
            DowntimeRequestGeneralCtrl.ePage.Masters.SelectAll = false;
            // DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    // DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", DowntimeRequestGeneralCtrl.ePage.Entities.Header.API.AreaDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.length - 1; i >= 0; i--) {
                            if (DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea[i].SingleSelect == true)
                                DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.splice(i, 1);
                        }
                        DowntimeRequestGeneralCtrl.ePage.Masters.Config.GeneralValidation(DowntimeRequestGeneralCtrl.currentDowntimeRequest);
                    }
                    toastr.success('Record Removed Successfully');
                    DowntimeRequestGeneralCtrl.ePage.Masters.selectedRow = -1;
                    DowntimeRequestGeneralCtrl.ePage.Masters.SelectAll = false;
                    // DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    DowntimeRequestGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(DowntimeRequestGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                DowntimeRequestGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DowntimeRequestGeneralCtrl.currentDowntimeRequest.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                DowntimeRequestGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DowntimeRequestGeneralCtrl.currentDowntimeRequest.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqArea.length; i++) {
                OnChangeValues('value', "E4009", true, i);
                OnChangeValues('value', "E4010", true, i);
                OnChangeValues('value', "E4011", true, i);
            }
            return true;
        }
        //#endregion Validation

        //#region Validation, Save
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            DowntimeRequestGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DowntimeRequestGeneralCtrl.ePage.Entities.Header.Validations) {
                DowntimeRequestGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(DowntimeRequestGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                // Check DowntimeRequest Type 
                // Whether CEN, REP, SCP DowntimeRequest available or not                
                if (_input.SrqDowntimeRequest.DowntimeRequestType == "CEN" || _input.SrqDowntimeRequest.DowntimeRequestType == "SCR" || _input.SrqDowntimeRequest.DowntimeRequestType == "REP" || _input.SrqDowntimeRequest.DowntimeRequestType == "TES") {
                    var _filter = {
                        "DowntimeRequestType": _input.SrqDowntimeRequest.DowntimeRequestType
                    };
                    var _input1 = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.SrqDowntimeRequest.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.SrqDowntimeRequest.API.FindAll.Url, _input1).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 1) {
                                DowntimeRequestGeneralCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "DowntimeRequest already exist in this DowntimeRequest Type", "E", false, 'DowntimeRequestType', DowntimeRequestGeneralCtrl.currentDowntimeRequest.label, false, undefined, undefined, 'DowntimeRequestType', undefined, 'general');
                                DowntimeRequestGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestGeneralCtrl.currentDowntimeRequest);
                            } else if (response.data.Response.length == 1) {
                                if (response.data.Response[0].DowntimeRequestCode == _input.SrqDowntimeRequest.DowntimeRequestCode) {
                                    DowntimeRequestGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "DowntimeRequestType", $item.label);
                                    Save($item);
                                } else {
                                    DowntimeRequestGeneralCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "DowntimeRequest already exist in this DowntimeRequest Type", "E", false, 'DowntimeRequestType', DowntimeRequestGeneralCtrl.currentDowntimeRequest.label, false, undefined, undefined, 'DowntimeRequestType', undefined, 'general');
                                    DowntimeRequestGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestGeneralCtrl.currentDowntimeRequest);
                                }
                            } else if (response.data.Response.length == 0) {
                                DowntimeRequestGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "DowntimeRequestType", $item.label);
                                Save($item);
                            }
                        }
                    });
                } else {
                    Save($item);
                }
            } else {
                if (_input.SrqDowntimeRequest.DowntimeRequestType == "CEN" || _input.SrqDowntimeRequest.DowntimeRequestType == "SCR" || _input.SrqDowntimeRequest.DowntimeRequestType == "REP" || _input.SrqDowntimeRequest.DowntimeRequestType == "TES") {
                    var _filter = {
                        "DowntimeRequestType": _input.SrqDowntimeRequest.DowntimeRequestType
                    };
                    var _input1 = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.SrqDowntimeRequest.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.SrqDowntimeRequest.API.FindAll.Url, _input1).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 1) {
                                DowntimeRequestGeneralCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "DowntimeRequest already exist in this DowntimeRequest Type", "E", false, 'DowntimeRequestType', DowntimeRequestGeneralCtrl.currentDowntimeRequest.label, false, undefined, undefined, 'DowntimeRequestType', undefined, 'general');
                                DowntimeRequestGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestGeneralCtrl.currentDowntimeRequest);
                            } else if (response.data.Response.length == 1) {
                                if (response.data.Response[0].DowntimeRequestCode == _input.SrqDowntimeRequest.DowntimeRequestCode) {
                                    DowntimeRequestGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "DowntimeRequestType", $item.label);
                                    Save($item);
                                } else {
                                    DowntimeRequestGeneralCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "DowntimeRequest already exist in this DowntimeRequest Type", "E", false, 'DowntimeRequestType', DowntimeRequestGeneralCtrl.currentDowntimeRequest.label, false, undefined, undefined, 'DowntimeRequestType', undefined, 'general');
                                    DowntimeRequestGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestGeneralCtrl.currentDowntimeRequest);
                                }
                            } else if (response.data.Response.length == 0) {
                                DowntimeRequestGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "DowntimeRequestType", $item.label);
                                Save($item);
                            }
                        }
                    });
                }
                DowntimeRequestGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestGeneralCtrl.currentDowntimeRequest);
            }
        }

        function Save($item) {
            DowntimeRequestGeneralCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            DowntimeRequestGeneralCtrl.ePage.Masters.DisableSave = true;
            //DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            _input.SrqDowntimeRequest.IsActive = true;

            if ($item.isNew) {
                _input.PK = _input.SrqDowntimeRequest.PK;
                _input.SrqDowntimeRequest.CreatedDateTime = new Date();

                //Converting into Upper Case
                _input.SrqDowntimeRequest.DowntimeRequestCode = _input.SrqDowntimeRequest.DowntimeRequestCode.toUpperCase();
                _input.SrqDowntimeRequest.DowntimeRequestName = _input.SrqDowntimeRequest.DowntimeRequestName.toUpperCase();

                _input.SrqArea.map(function (value, key) {
                    value.Name = value.Name.toUpperCase();
                });

            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            helperService.SaveEntity($item, 'DowntimeRequest').then(function (response) {
                DowntimeRequestGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                DowntimeRequestGeneralCtrl.ePage.Masters.DisableSave = false;
                //DowntimeRequestGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                if (response.Status === "success") {

                    downtimeRequestConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqDowntimeRequest.DowntimeRequestCode;
                                value[DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqDowntimeRequest.DowntimeRequestCode] = value.New;
                                delete value.New;
                                value.code = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqDowntimeRequest.DowntimeRequestCode;
                            }
                        }
                    });

                    var _index = downtimeRequestConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(DowntimeRequestGeneralCtrl.currentDowntimeRequest[DowntimeRequestGeneralCtrl.currentDowntimeRequest.label].ePage.Entities.Header.Data.PK);


                    if (_index !== -1) {
                        if (response.Data.Response) {
                            downtimeRequestConfig.TabList[_index][downtimeRequestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            downtimeRequestConfig.TabList[_index][downtimeRequestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        //Changing Label name when DowntimeRequest code changes
                        if (DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqDowntimeRequest.DowntimeRequestCode != downtimeRequestConfig.TabList[_index].label) {
                            downtimeRequestConfig.TabList[_index].label = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqDowntimeRequest.DowntimeRequestCode;
                            downtimeRequestConfig.TabList[_index][downtimeRequestConfig.TabList[_index].label] = downtimeRequestConfig.TabList[_index][downtimeRequestConfig.TabList[_index].code];
                            delete downtimeRequestConfig.TabList[_index][downtimeRequestConfig.TabList[_index].code];
                            downtimeRequestConfig.TabList[_index].code = DowntimeRequestGeneralCtrl.ePage.Entities.Header.Data.SrqDowntimeRequest.DowntimeRequestCode
                        }
                        downtimeRequestConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/downtime-request") {
                            helperService.refreshGrid();
                        }
                    }
                    toastr.success("Saved Successfully...!");
                    if (DowntimeRequestGeneralCtrl.ePage.Masters.SaveAndClose) {
                        DowntimeRequestGeneralCtrl.ePage.Masters.Config.SaveAndClose = true;
                        DowntimeRequestGeneralCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    toastr.error("Could not Save...!");
                    DowntimeRequestGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        DowntimeRequestGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DowntimeRequestGeneralCtrl.currentDowntimeRequest.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (DowntimeRequestGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        DowntimeRequestGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DowntimeRequestGeneralCtrl.currentDowntimeRequest);
                    }
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
        //#endregion Validation, Save

        Init();
    }
})();





