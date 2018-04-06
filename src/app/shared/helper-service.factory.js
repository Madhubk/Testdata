(function () {
    "use strict";

    angular
        .module("Application")
        .factory("helperService", HelperService)

    HelperService.$inject = ["$location", "$q", "apiService", "authService", "APP_CONSTANT", "toastr"];

    function HelperService($location, $q, apiService, authService, APP_CONSTANT, toastr) {
        var exports = {
            createToArrayOfObject: CreateToArrayOfObject,
            CreateToArrayToObject: CreateToArrayToObject,
            metaBase: MetaBase,
            getFullObjectUsingGetById: GetFullObjectUsingGetById,
            checkUIControl: CheckUIControl,
            DownloadDocument: DownloadDocument,
            GetCurrentDateTime: GetCurrentDateTime,
            DateFilter: DateFilter,
            SaveEntity: SaveEntity,
            FormatDate: FormatDate,
            encryptData: EncryptData,
            decryptData: DecryptData,
            getSearchInput: GetSearchInput
        };
        return exports;

        // Convert object to array of object with "fieldName and Value" format
        function CreateToArrayOfObject(inputObject, isObject) {
            var dictionary = [];
            for (var key in inputObject)
                if (inputObject[key] != '' && inputObject[key] != undefined) {
                    dictionary.push({
                        'FieldName': key,
                        'value': inputObject[key],
                    });
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
            var deferred = $q.defer();
            var _Data = entity[entity.label].ePage.Entities;
            var _input = _Data.Header.Data,
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
                            toastr.success("Saved Successfully...!");
                        } else {
                            _response.Status = "failed";
                            deferred.resolve(_response);
                            if (response.data.Messages != null && response.data.Messages.length > 0) {
                                toastr.error(response.data.Messages[0].MessageDesc);
                            } else {
                                toastr.error("Could not Save...!");
                            }
                        }
                    }
                } else {
                    toastr.error("Could not Save...!");
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

        // Current Date and Time
        function GetCurrentDateTime(type) {
            var _date = new Date();

            console.log(_date.toUTCString())
            console.log(_date.toISOString())
            console.log(_date.toDateString())
            console.log(_date.toJSON())
            console.log(_date.toString())
            console.log(_date.toTimeString())
            console.log(_date.toLocaleDateString())
            console.log(_date.toLocaleString())
            console.log(_date.toLocaleTimeString())

            if (type === "date") {

            } else if (type === "time") {

            } else if (type === "datetime") {

            }

            return _date;
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
                date.setDate(getdate - 7),
                    Ldate.setDate(getdate - 1);
                return date + "," + Ldate;
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
                return lastSunday + ',' + lastSaturday;
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
                return firstday + ',' + lastday;
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
                return firstDay + "," + lastDay;
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
                return firstDay + "," + lastDay;
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
                return authService.getUserInfo().AppPK
            }

            function UserName() {
                return authService.getUserInfo().UserId
            }

            function TenantCode() {
                return authService.getUserInfo().TenantCode
            }
        }

        function FormatDate(date) {
            var month = date.getMonth() + 1;
            var Date = date.getDate();
            var year = date.getFullYear();
            var FDate = month + "/" + Date + "/" + year;
            return FDate;
        }

        // Prepare Search Input based on Source Object and Config
        function GetSearchInput(sourceObject, searchInputConfig) {
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

            var _input = {
                "searchInput": CreateToArrayOfObject(_filter),
                "FilterID": searchInputConfig.FilterID
            };

            return _input;
        }
    }
})();
