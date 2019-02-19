(function () {
    "use strict";

    angular
        .module("Application")
        .factory("helperService", HelperService)

    HelperService.$inject = ["$q", "$filter", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr"];

    function HelperService($q, $filter, apiService, authService, appConfig, APP_CONSTANT, toastr) {
        var exports = {
            createToArrayOfObject: CreateToArrayOfObject,
            CreateToArrayToObject: CreateToArrayToObject,
            metaBase: MetaBase,
            getFullObjectUsingGetById: GetFullObjectUsingGetById,
            checkUIControl: CheckUIControl,
            DownloadDocument: DownloadDocument,
            DateFilter: DateFilter,
            SaveEntity: SaveEntity,
            FormatDate: FormatDate,
            encryptData: EncryptData,
            decryptData: DecryptData,
            getSearchInput: GetSearchInput,
            excelDocObjPreparation: ExcelDocObjPreparation,
            prepareExcelDocumentObject: PrepareExcelDocumentObject,
            generateNewPk: GenerateNewPk,
            scrollElement: ScrollElement,
            IsMobile: GetDevice,
            previewDocument: PreviewDocument,
            getImageBase64Str: GetImageBase64Str
        };
        return exports;

        // Convert object to array of object with "fieldName and Value" format
        function CreateToArrayOfObject(inputObject, isObject) {
            var dictionary = [];
            for (var key in inputObject) {
                if (inputObject[key] != undefined && inputObject[key] !== "") {
                    dictionary.push({
                        'FieldName': key,
                        'value': inputObject[key],
                    });
                }
            }
            return dictionary;
        }

        // Convert array to  object 
        function CreateToArrayToObject(inputArray) {
            var obj = {};
            inputArray.map(function (val, key) {
                obj[val.FieldName] = val.value;
            });
            return obj;
        }

        // Common variables for individual Meta
        function MetaBase(UI, _valueField, _labelField, _searchField) {
            var obj = {
                "Visibility": true,
                "Enabled": true,
                "Mode": null,
                "IsLoading": true,
                "IsNoRecords": false,
                "IsRequired": false,
                "Format": "",
                "ListSource": [],
                "UIControl": {},
                "IsArray": false,
                "IsError": false,
                "ERROR": [],
                "IsWarning": false,
                "WARNING": [],
                "ParentRef": ""
            };

            if (UI == "SelTX") {
                obj.UIControl = {
                    "maxItem": "Nos",
                    "option": [],
                    "valueField": _valueField,
                    "labelField": _labelField,
                    "searchField": _searchField,
                    "displayOrder": "l"
                }
            }
            return obj;
        }

        // Get object using getbyId for Shipment, Order, Consolidation...etc
        function GetFullObjectUsingGetById(api, pk) {
            var deferred = $q.defer();

            apiService.get("eAxisAPI", api + pk).then(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        function CheckUIControl(controlList, controlId) {
            var _isExist = false;
            if (controlList) {
                if (controlList.length > 0) {
                    _isExist = controlList.some(function (value, key) {
                        return value == controlId;
                    });
                }
            }
            return _isExist;
        }

        function DownloadDocument(fileDetails) {
            var _fileDetails = fileDetails;
            // Convert Base64 to bytes
            function base64ToArrayBuffer(base64) {
                var binaryString = atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                for (var i = 0; i < binaryLen; i++) {
                    var ascii = binaryString.charCodeAt(i);
                    bytes[i] = ascii;
                }
                saveByteArray([bytes], _fileDetails.Name);
            }

            var saveByteArray = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                return function (data, name) {
                    var blob = new Blob(data, {
                            type: "octet/stream"
                        }),
                        url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = name;
                    a.click();
                    window.URL.revokeObjectURL(url);
                };
            }());

            if (_fileDetails.Base64str && _fileDetails.Base64str != "" && _fileDetails.Base64str != ' ') {
                base64ToArrayBuffer(_fileDetails.Base64str);
            } else {
                toastr.error("Invalid File...!");
            }
        }

        function SaveEntity(entity, module) {
            var deferred = $q.defer(),
                _code = entity.pk ? entity.code : entity.label,
                _Data = entity[_code].ePage.Entities,
                _input = _Data.Header.Data,
                _api;

            if (entity.isNew) {
                _api = _Data.Header.API["Insert" + module].Url;
            } else {
                _api = _Data.Header.API["Update" + module].Url;
            }

            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                var _response = {
                    Data: response.data.Response,
                    Validations: response.data.Validations
                };

                if (response.data.Response) {
                    if (response.data.Response === "Version Conflict : Please take the Latest Version!") {
                        deferred.resolve("failed");
                        toastr.error(response.data.Response);
                    } else {
                        if (response.data.Status === "Success") {
                            _response.Status = "success";
                            deferred.resolve(_response);
                        } else {
                            _response.Status = "failed";
                            deferred.resolve(_response);
                            if (response.data.Messages != null && response.data.Messages.length > 0) {
                                toastr.error(response.data.Messages[0].MessageDesc);
                            } else {
                                console.log("Could not Save...!");
                            }
                        }
                    }
                } else {
                    _response.Status = "failed";
                    deferred.resolve(_response);
                }
            }, function (response) {
                console.log("Error : " + response);
                deferred.reject("failed");
            });

            return deferred.promise;
        }

        // Encrypton and Decryption
        function EncryptData(data) {
            var _convertToStr = data;
            if (typeof data == "object") {
                _convertToStr = JSON.stringify(data);
            }

            var encrypted = CryptoJS.AES.encrypt(
                _convertToStr,
                APP_CONSTANT.Crypto.key, {
                    iv: APP_CONSTANT.Crypto.iv
                });
            var _cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
            return _cipherText;
        }

        function DecryptData(data) {
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Hex.parse(data)
            });
            var cipherParams = CryptoJS.AES.decrypt(
                cipherParams,
                APP_CONSTANT.Crypto.key, {
                    iv: APP_CONSTANT.Crypto.iv
                });
            var _descrString = cipherParams.toString(CryptoJS.enc.Utf8);
            return _descrString;
        }

        //Date Filter
        function DateFilter(dateType) {
            var date = new Date(),
                Ldate = new Date(),
                getdate = date.getDate(),
                getday = date.getDay(),
                getime = date.getTime(),
                getyear = date.getFullYear(),
                getmonth = date.getMonth(),
                _dateType;

            var _index = dateType.indexOf("@");
            if (_index != -1) {
                _dateType = dateType.substring(3)
            } else {
                _dateType = dateType
            }

            var _obj = {
                "Yesterday": Yesterday,
                "Today": Today,
                "Tomorrow": Tomorrow,
                "Last7Days": Last7Days,
                "Last7Days_From": Last7DaysFrom,
                "Last7Days_To": Last7DaysTo,
                "Next7Days": Next7Days,
                "Next7Days_From": Next7DaysFrom,
                "Next7Days_To": Next7DaysTo,
                "Last30Days": Last30Days,
                "Last30Days_From": Last30DaysFrom,
                "Last30Days_To": Last30DaysTo,
                "Next30Days": Next30Days,
                "Next30Days_From": Next30DaysFrom,
                "Next30Days_To": Next30DaysTo,
                "Last60Days": Last60Days,
                "Last60Days_From": Last60DaysFrom,
                "Last60Days_To": Last60DaysTo,
                "Next60Days": Next60Days,
                "Next60Days_From": Next60DaysFrom,
                "Next60Days_To": Next60DaysTo,
                "LastWeek": LastWeek,
                "LastWeek_From": LastWeekFrom,
                "LastWeek_To": LastWeekTo,
                "ThisWeek": ThisWeek,
                "ThisWeek_From": ThisWeekFrom,
                "ThisWeek_To": ThisWeekTo,
                "NextWeek": NextWeek,
                "NextWeek_From": NextWeekFrom,
                "NextWeek_To": NextWeekTo,
                "ThisMonth": ThisMonth,
                "ThisMonth_From": ThisMonthFrom,
                "ThisMonth_To": ThisMonthTo,
                "LastMonth": LastMonth,
                "LastMonth_From": LastMonthFrom,
                "LastMonth_To": LastMonthTo,
                "NextMonth": NextMonth,
                "NextMonth_From": NextMonthFrom,
                "NextMonth_To": NextMonthTo,
                "ThisQuarter": ThisQuarter,
                "ThisQuarter_From": ThisQuarterFrom,
                "ThisQuarter_To": ThisQuarterTo,
                "LastQuarter": LastQuarter,
                "LastQuarter_From": LastQuarterFrom,
                "LastQuarter_To": LastQuarterTo,
                "FirstQuarter": FirstQuarter,
                "FirstQuarter_From": FirstQuarterFrom,
                "FirstQuarter_To": FirstQuarterTo,
                "PreviousQuarter": PreviousQuarter,
                "PreviousQuarter_From": PreviousQuarterFrom,
                "PreviousQuarter_To": PreviousQuarterTo,
                "NextQuarter": NextQuarter,
                "NextQuarter_From": NextQuarterFrom,
                "NextQuarter_To": NextQuarterTo,
                "ThisYear": ThisYear,
                "ThisYear_From": ThisYearFrom,
                "ThisYear_To": ThisYearTo,
                "APP_PK": APP_PK,
                "UserName": UserName,
                "TenantCode": TenantCode,
            };
            return _obj[_dateType]();

            function Today() {
                return FormatDate(date);
            }

            function Tomorrow() {
                date.setDate(getdate + 1);
                return FormatDate(date);
            }

            function Yesterday() {
                date.setDate(getdate - 1);
                return FormatDate(date);
            }

            function Last7Days() {
                date.setDate(getdate - 7);
                Ldate.setDate(getdate - 1);
                // return date + "," + Ldate;
                return FormatDate(date) + "," + FormatDate(Ldate);
            }

            function Last7DaysFrom() {
                date.setDate(getdate - 7);
                return FormatDate(date);
            }

            function Last7DaysTo() {
                Ldate.setDate(getdate - 1);
                return FormatDate(Ldate);
            }

            function Next7Days() {
                date.setDate(getdate + 7);
                return FormatDate(date);
            }

            function Next7DaysFrom() {
                Ldate.setDate(getdate + 1);
                return FormatDate(Ldate);
            }

            function Next7DaysTo() {
                date.setDate(getdate + 7);
                return FormatDate(date);
            }

            function Last30Days() {
                date.setDate(getdate - 30);
                return FormatDate(date);
            }

            function Last30DaysFrom() {
                date.setDate(getdate - 30);
                return FormatDate(date);
            }

            function Last30DaysTo() {
                Ldate.setDate(getdate - 1);
                return FormatDate(Ldate);
            }

            function Next30Days() {
                date.setDate(getdate + 30);
                return FormatDate(date);
            }

            function Next30DaysFrom() {
                Ldate.setDate(getdate + 1);
                return FormatDate(Ldate);
            }

            function Next30DaysTo() {
                date.setDate(getdate + 30);
                return FormatDate(date);
            }

            function Last60Days() {
                date.setDate(getdate - 60);
                return FormatDate(date);
            }

            function Next60DaysFrom() {
                Ldate.setDate(getdate + 1);
                return FormatDate(Ldate);
            }

            function Next60DaysTo() {
                date.setDate(getdate + 60);
                return FormatDate(date);
            }

            function Last60DaysFrom() {
                date.setDate(getdate - 60);
                return FormatDate(date);
            }

            function Last60DaysTo() {
                Ldate.setDate(getdate - 1);
                return FormatDate(Ldate);
            }

            function Next60Days() {
                date.setDate(getdate + 60);
                return FormatDate(date);
            }

            function LastWeek() {
                var beforeOneWeek = new Date(getime - 60 * 60 * 24 * 7 * 1000),
                    day = beforeOneWeek.getDay(),
                    diffToSunday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 0),
                    lastSunday = new Date(beforeOneWeek.setDate(diffToSunday)),
                    lastSaturday = new Date(beforeOneWeek.setDate(diffToSunday + 6));

                return FormatDate(lastSunday) + ',' + FormatDate(lastSaturday);
            }

            function LastWeekFrom() {
                var beforeOneWeek = new Date(getime - 60 * 60 * 24 * 7 * 1000),
                    day = beforeOneWeek.getDay(),
                    diffToSunday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 0),
                    lastSunday = new Date(beforeOneWeek.setDate(diffToSunday))
                return lastSunday;
            }

            function LastWeekTo() {
                var beforeOneWeek = new Date(getime - 60 * 60 * 24 * 7 * 1000),
                    day = beforeOneWeek.getDay(),
                    diffToSunday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 0),
                    lastSaturday = new Date(beforeOneWeek.setDate(diffToSunday + 6));
                return lastSaturday;
            }

            function ThisWeek() {
                var first = getdate - getday,
                    last = first + 6,
                    firstday = new Date(date.setDate(first)),
                    lastday = new Date(date.setDate(last));
                // return firstday + ',' + lastday;
                return FormatDate(firstday) + ',' + FormatDate(lastday);
            }

            function ThisWeekFrom() {
                var first = getdate - getday,
                    firstday = new Date(date.setDate(first));
                return FormatDate(firstday);
            }

            function ThisWeekTo() {
                var first = getdate - getday,
                    last = first + 6,
                    lastday = new Date(date.setDate(last));
                return FormatDate(lastday);
            }

            function NextWeek() {
                var beforeOneWeek = new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000),
                    day = beforeOneWeek.getDay(),
                    diffToSunday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 0),
                    lastSunday = new Date(beforeOneWeek.setDate(diffToSunday)),
                    lastSaturday = new Date(beforeOneWeek.setDate(diffToSunday + 6));
                return lastSunday + ',' + lastSaturday;
            }

            function NextWeekFrom() {
                var beforeOneWeek = new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000),
                    day = beforeOneWeek.getDay(),
                    diffToSunday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 0),
                    lastSunday = new Date(beforeOneWeek.setDate(diffToSunday));
                return lastSunday;
            }

            function NextWeekTo() {
                var beforeOneWeek = new Date(new Date().getTime() + 60 * 60 * 24 * 7 * 1000),
                    day = beforeOneWeek.getDay(),
                    diffToSunday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 0),
                    lastSaturday = new Date(beforeOneWeek.setDate(diffToSunday + 6));
                return lastSaturday;
            }

            function LastMonth() {
                var firstDay = new Date(getyear, getmonth - 1, 1),
                    lastDay = new Date(getyear, getmonth, 0);
                // return firstDay + "," + lastDay;
                return FormatDate(firstDay) + "," + FormatDate(lastDay);
            }

            function LastMonthFrom() {
                var firstDay = new Date(getyear, getmonth - 1, 1);
                return FormatDate(firstDay);
            }

            function LastMonthTo() {
                var lastDay = new Date(getyear, getmonth, 0);
                return FormatDate(lastDay);
            }

            function ThisMonth() {
                var firstDay = new Date(getyear, getmonth, 1),
                    lastDay = new Date(getyear, getmonth + 1, 0);
                // return firstDay + "," + lastDay;
                return FormatDate(firstDay) + "," + FormatDate(lastDay);
            }

            function ThisMonthFrom() {
                var firstDay = new Date(getyear, getmonth, 1);
                return FormatDate(firstDay);
            }

            function ThisMonthTo() {
                var lastDay = new Date(getyear, getmonth + 1, 0);
                return FormatDate(lastDay);
            }

            function NextMonth() {
                var firstDay = new Date(getyear, getmonth + 1, 1),
                    lastDay = new Date(getyear, getmonth + 2, 0);
                return firstDay + "," + lastDay;
            }

            function NextMonthFrom() {
                var firstDay = new Date(getyear, getmonth + 1, 1);
                return FormatDate(firstDay);
            }

            function NextMonthTo() {
                var lastDay = new Date(getyear, getmonth + 2, 0);
                return FormatDate(lastDay);
            }

            function ThisQuarter() {
                var currQuarter = new Date(getmonth - 1) / 3 + 1,
                    dtFirstDay = new Date(getyear, 3 * parseInt(currQuarter) - 3, 1),
                    dtLastDay = new Date(getyear, 3 * parseInt(currQuarter), 0);
                return dtFirstDay + ',' + dtLastDay;
            }

            function ThisQuarterFrom() {
                var currQuarter = new Date(getmonth - 1) / 3 + 1,
                    dtFirstDay = new Date(getyear, 3 * parseInt(currQuarter) - 3, 1);
                return FormatDate(dtFirstDay);
            }

            function ThisQuarterTo() {
                var currQuarter = new Date(getmonth - 1) / 3 + 1,
                    dtLastDay = new Date(getyear, 3 * parseInt(currQuarter), 0);
                return FormatDate(dtLastDay);
            }

            function LastQuarter() {
                var dtFirstDay = new Date(getyear, 3 * parseInt(4) - 3, 1),
                    dtLastDay = new Date(getyear, 3 * parseInt(4), 0);
                return dtFirstDay + ',' + dtLastDay;
            }

            function LastQuarterFrom() {
                var dtFirstDay = new Date(getyear, 3 * parseInt(4) - 3, 1);
                return FormatDate(dtFirstDay);
            }

            function LastQuarterTo() {
                var dtLastDay = new Date(getyear, 3 * parseInt(4), 0);
                return FormatDate(dtLastDay);
            }

            function FirstQuarter() {
                var dtFirstDay = new Date(getyear, 3 * parseInt(1) - 3, 1),
                    dtLastDay = new Date(getyear, 3 * parseInt(1), 0);
                return FormatDate(dtFirstDay);
            }

            function FirstQuarterFrom() {
                var dtFirstDay = new Date(getyear, 3 * parseInt(1) - 3, 1);
                return dtFirstDay.toUTCString();
            }

            function FirstQuarterTo() {
                var dtLastDay = new Date(getyear, 3 * parseInt(1), 0);
                return FormatDate(dtLastDay);
            }

            function PreviousQuarter() {
                var currQuarter = new Date(getmonth - 0) / 3 + 1;
                if (currQuarter == 1) {
                    return LastQuarter();
                } else {
                    var dtFirstDay = new Date(getyear, 3 * parseInt(currQuarter - 1) - 3, 1),
                        dtLastDay = new Date(getyear, 3 * parseInt(currQuarter - 1), 0)
                    return dtFirstDay + ',' + dtLastDay;
                }
            }

            function PreviousQuarterFrom() {
                var currQuarter = new Date(getmonth - 0) / 3 + 1;
                if (currQuarter == 1) {
                    return LastQuarter();
                } else {
                    var dtFirstDay = new Date(getyear, 3 * parseInt(currQuarter - 1) - 3, 1);
                    return FormatDate(dtFirstDay);
                }
            }

            function PreviousQuarterTo() {
                var currQuarter = new Date(getmonth - 0) / 3 + 1;
                if (currQuarter == 1) {
                    return LastQuarter();
                } else {
                    var dtLastDay = new Date(getyear, 3 * parseInt(currQuarter - 1), 0);
                    return FormatDate(dtLastDay);
                }
            }

            function NextQuarter() {
                var currQuarter = new Date(getmonth - 1) / 3 + 1;
                if (currQuarter == 4) {
                    return FirstQuarter();
                } else {
                    var dtFirstDay = new Date(getyear, 3 * parseInt(currQuarter + 1) - 3, 1),
                        dtLastDay = new Date(getyear, 3 * parseInt(currQuarter + 1), 0);
                    return dtFirstDay + "," + dtLastDay;
                }
            }

            function NextQuarterFrom() {
                var currQuarter = new Date(getmonth - 1) / 3 + 1;
                if (currQuarter == 4) {
                    return FirstQuarter();
                } else {
                    var dtFirstDay = new Date(getyear, 3 * parseInt(currQuarter + 1) - 3, 1);
                    return FormatDate(dtFirstDay);
                }
            }

            function NextQuarterTo() {
                var currQuarter = new Date(getmonth - 1) / 3 + 1;
                if (currQuarter == 4) {
                    return FirstQuarter();
                } else {
                    var dtLastDay = new Date(getyear, 3 * parseInt(currQuarter + 1), 0);
                    return FormatDate(dtLastDay);
                }
            }

            function ThisYear() {
                var currYear = new Date(getmonth - 1) / 3 + 1,
                    ScurrYear = new Date(new Date().getFullYear(), 0, 1),
                    EcurrYear = new Date(getyear, 3 * parseInt(currYear + 1), 0);
                var ThisYear = {
                    "PeriodFrom": ScurrYear,
                    "PeriodTo": EcurrYear
                }
                return ThisYear;
            }

            function ThisYearFrom() {
                var currYear = new Date(getmonth - 1) / 3 + 1,
                    ScurrYear = new Date(new Date().getFullYear(), 0, 1);
                return FormatDate(ScurrYear);
            }

            function ThisYearTo() {
                var currYear = new Date(getmonth - 1) / 3 + 1,
                    EcurrYear = new Date(getyear, 3 * parseInt(currYear + 1), 0);
                return FormatDate(EcurrYear);
            }

            function APP_PK() {
                return authService.getUserInfo().AppPK;
            }

            function UserName() {
                return authService.getUserInfo().UserId;
            }

            function TenantCode() {
                return authService.getUserInfo().TenantCode;
            }
        }

        function FormatDate(date) {
            return $filter("date")(date, APP_CONSTANT.DatePicker.dateFormat);
        }

        // Prepare Search Input based on Source Object and Config
        function GetSearchInput(sourceObject, searchInputConfig, filterType) {
            var _filter = {};
            var _value;
            if (searchInputConfig) {
                if (searchInputConfig.SearchInputConfig.length > 0) {
                    searchInputConfig.SearchInputConfig.map(function (value, key) {
                        if (value.SField) {
                            if (sourceObject) {
                                if (sourceObject[value.MainEntity]) {
                                    if (sourceObject[value.MainEntity][value.SubEntity]) {
                                        if (sourceObject[value.MainEntity][value.SubEntity][value.MidEntity]) {
                                            if (sourceObject[value.MainEntity][value.SubEntity][value.MidEntity][value.FieldName]) {
                                                _value = sourceObject[value.MainEntity][value.SubEntity][value.MidEntity][value.FieldName];
                                            } else {
                                                _value = sourceObject[value.MainEntity][value.SubEntity][value.MidEntity];
                                            }
                                        } else {
                                            _value = sourceObject[value.MainEntity][value.SubEntity];
                                        }
                                    } else {
                                        _value = sourceObject[value.MainEntity];
                                    }
                                } else {}
                            }
                            _filter[value.SField] = _value;
                        }
                    });
                }
            }

            if (filterType == "Object") {
                var _input = _filter;
            } else {
                var _input = {
                    "searchInput": CreateToArrayOfObject(_filter),
                    "FilterID": searchInputConfig.FilterID
                };
            }

            return _input;
        }

        // region Excel Document generation
        function ExcelDocObjPreparation(_filter, sourceObject) {
            var deferred = $q.defer();
            var _input = {
                "searchInput": CreateToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];

                        if (_response.Value) {
                            _response.Value = JSON.parse(_response.Value);
                            // _response.Value.DataObjs[0].DataObject = JSON.parse(_response.Value.DataObjs[0].DataObject);
                            _response.Value.DataObjs[0].DataObject = _response.Value.DataObjs[0].DataObject;

                            if (sourceObject) {
                                var _excelDocumentObject = PrepareExcelDocumentObject(_response.Value, sourceObject);
                            } else {
                                var _excelDocumentObject = _response.Value;
                            }

                            if (_excelDocumentObject) {
                                GetExcelDocObj(_excelDocumentObject).then(function (response) {
                                    deferred.resolve(response);
                                });
                            }
                        }
                    }
                }
            });

            return deferred.promise;
        }

        function PrepareExcelDocumentObject(json, sourceObject) {
            if (json) {
                json.DataObjs.map(function (value1, key) {
                    if (value1.DataSource === "Local") {
                        for (var x in value1.DataObject) {
                            if (value1.DataObject[x].indexOf("@") !== -1) {
                                json.UIDataReference.SearchInputConfig.map(function (value2, key2) {
                                    if (value1.DataObject[x]) {
                                        if (value1.DataObject[x].indexOf(value2.SField) !== -1) {
                                            var _searchInput = {
                                                FilterID: json.UIDataReference.FilterID,
                                                SearchInputConfig: []
                                            };
                                            _searchInput.SearchInputConfig.push(value2);
                                            value1.DataObject[x] = GetSearchInput(sourceObject, _searchInput, "Object")[value1.DataObject[x].substring(1, value1.DataObject[x].length)];
                                        }
                                    }
                                });
                            }
                        }
                    } else if (value1.DataSource === "API") {
                        if (value1.HttpMethod === "GET") {
                            var _apiName = angular.copy(value1.ApiName);
                            var _apiNameSplit = _apiName.split("/");
                            var _apiInput = _apiNameSplit.pop();

                            if (_apiName.indexOf("@") !== -1) {
                                json.UIDataReference.SearchInputConfig.map(function (value2, key2) {
                                    if (_apiInput) {
                                        if (_apiInput.indexOf(value2.SField) !== -1) {
                                            var _searchInput = {
                                                FilterID: json.UIDataReference.FilterID,
                                                SearchInputConfig: []
                                            };
                                            _searchInput.SearchInputConfig.push(value2);

                                            _apiInput = GetSearchInput(sourceObject, _searchInput, "Object")[_apiInput.substring(1, _apiInput.length)];

                                            _apiNameSplit.push(_apiInput);
                                            value1.ApiName = _apiNameSplit.join("/");
                                        }
                                    }
                                });
                            }
                        } else if (value1.HttpMethod === "POST") {
                            value1.SearchInput.SearchInput.map(function (value2, key2) {
                                if (value2.value.indexOf("@") !== -1) {
                                    json.UIDataReference.SearchInputConfig.map(function (value3, key3) {
                                        if (value2.value) {
                                            if (value2.value.indexOf(value3.SField) !== -1) {
                                                var _searchInput = {
                                                    FilterID: json.UIDataReference.FilterID,
                                                    SearchInputConfig: []
                                                };
                                                _searchInput.SearchInputConfig.push(value3);

                                                value2.value = GetSearchInput(sourceObject, _searchInput, "Object")[value2.value.substring(1, value2.value.length)];
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });

                if (json.JobDocs) {
                    for (var x in json.JobDocs) {
                        if (json.JobDocs[x].indexOf("@") !== -1) {
                            json.UIDataReference.SearchInputConfig.map(function (value, key) {
                                if (json.JobDocs[x]) {
                                    if (json.JobDocs[x].indexOf(value.SField) !== -1) {
                                        var _searchInput = {
                                            FilterID: json.UIDataReference.FilterID,
                                            SearchInputConfig: []
                                        };
                                        _searchInput.SearchInputConfig.push(value);
                                        json.JobDocs[x] = GetSearchInput(sourceObject, _searchInput, "Object")[json.JobDocs[x].substring(1, json.JobDocs[x].length)];
                                    }
                                }
                            });
                        }
                    }
                }
            }

            return json;
        }

        function GetExcelDocObj($item) {
            var _input = $item;
            var deferred = $q.defer();

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response.data.Response);
                }
            });

            return deferred.promise;
        }
        // endregion

        function GenerateNewPk() {
            var deferred = $q.defer();

            apiService.get("eAxisAPI", appConfig.Entities.AppSettings.API.NewGuidId.Url).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response.data.Response);
                } else {
                    deferred.resolve(undefined);
                }
            });

            return deferred.promise;
        }

        function ScrollElement(eID) {
            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY);
                return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for (var i = startY; i < stopY; i += step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY += step;
                    if (leapY > stopY) leapY = stopY;
                    timer++;
                }
                return;
            }
            for (var i = startY; i > stopY; i -= step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY -= step;
                if (leapY < stopY) leapY = stopY;
                timer++;
            }

            function currentYPosition() {
                // Firefox, Chrome, Opera, Safari
                if (self.pageYOffset) return self.pageYOffset;
                // Internet Explorer 6 - standards mode
                if (document.documentElement && document.documentElement.scrollTop)
                    return document.documentElement.scrollTop;
                // Internet Explorer 6, 7 and 8
                if (document.body.scrollTop) return document.body.scrollTop;
                return 0;
            }

            function elmYPosition(eID) {
                var elm = document.getElementById(eID);
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                }
                return y;
            }
        }

        function GetDevice() {
            var _isMobile = false;
            // device detection
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                _isMobile = true;
            }

            return _isMobile;
        }

        function PreviewDocument(base64) {
            var _pdfWindow = window.open();
            var _document = _pdfWindow.document;
            _document.write("<iframe frameborder='0'  style='border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height: calc(100vh - 17px);' allowfullscreen src='data:application/pdf;base64, " + base64 + "'></iframe>");
            setTimeout(() => _document.title = 'Preview Document');
        }

        function GetBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        function GetImageBase64Str(file) {
            return new Promise((resolve, reject) => {
                GetBase64(file).then(function (response) {
                    var _str = angular.copy(response);
                    var _index = _str.indexOf("64,");
                    if (_index != -1) {
                        var subStr = _str.substr(_index + 3);
                        resolve(_str)
                    }
                }, function (error) {
                    console.log(error);
                    reject(error);
                });
            });
        }
    }

})();
