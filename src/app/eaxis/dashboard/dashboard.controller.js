(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisDashboardController", EAxisDashboardController);

    EAxisDashboardController.$inject = ["$window", "authService", "apiService", "helperService", "appConfig", "$location", "APP_CONSTANT", "$filter"];

    function EAxisDashboardController($window, authService, apiService, helperService, appConfig, $location, APP_CONSTANT, $filter) {
        /* jshint validthis: true */
        var EAxisDashboardCtrl = this;

        function Init() {
            EAxisDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EAxisDashboardCtrl.ePage.Masters.ShipmentNoList = [{
                "PK": "2ee386be-f1f9-47fa-907d-e1a4c4c23d65",
                "Code": "S00301716"
            }, {
                "PK": "b4286ade-116a-4b5e-8780-0001ffbaac37",
                "Code": "S00220357"
            }];

            EAxisDashboardCtrl.ePage.Masters.OrganizationList = [{
                "PK": "cc168fcc-2b4d-40f5-b26b-b05e300c69a2",
                "Code": "TESMAA9"
            }, {
                "Code": "New"
            }];

            EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList = [];
            EAxisDashboardCtrl.ePage.Masters.TestSingleRecordView = TestSingleRecordView;
            EAxisDashboardCtrl.ePage.Masters.GetSingleRecordDetail = GetSingleRecordDetail;
            EAxisDashboardCtrl.ePage.Masters.FavList = false;

            // GetReadOnlyList();
            // GetSaveSettingAndBasicFilterList("SHIPMENTSEARCH_TOP");

            EAxisDashboardCtrl.ePage.Masters.PreviewDocument = PreviewDocument;
            EAxisDashboardCtrl.ePage.Masters.GoToMyTask = GoToMyTask;

            // GetAppSettings();
        }

        function GetSaveSettingAndBasicFilterList(typeCode) {
            apiService.get("eAxisAPI", appConfig.Entities.AppSettings.API.StaredFindAll.Url + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.Value = JSON.parse(value.Value);

                        EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList.push(value);
                    });
                }
                GetFavouriteList();
            });
        }

        function GetFavouriteList() {
            var _filter = {
                "EntitySource": "SHIPMENTSEARCH_FAVORITES,ORDERHEADER_FAVORITES",
                "AppCode": authService.getUserInfo().AppCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.Value = JSON.parse(value.Value);
                        if (value.Value.ShowInDashboard === true) {
                            EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList.push(value);
                        }
                    });
                }
                EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList.map(function (value, key) {
                    if (value.EntitySource == "USER") {
                        value.SourceEntityRefKey = value.Value.Label;
                    }
                    GetFavouriteAndBasicFilterCount(value, key);
                });
            });
        }

        function GetFavouriteAndBasicFilterCount(obj, key) {
            if (obj != undefined) {
                var objData = obj.Value;
                if (objData.ShowCount) {
                    EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key].ShowCount = objData.ShowCount;
                    EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key].IsExcute = objData.IsExcute;
                }
                if (objData.CountInput != undefined) {
                    objData.CountInput.map(function (value, key) {
                        var x = value.value;
                        var y = x.charAt(0);
                        if (y == '@') {
                            var date = helperService.DateFilter(x);
                            value.value = date;
                        } else {
                            value.value = value.value;
                        }
                    });
                }

                var urlInput = objData.CountAPI;
                var StringUrl = '';
                urlInput.split('/').map(function (ele) {
                    var el = ele.charAt(0);
                    if (el == '@') {
                        var urlFilter = helperService.DateFilter(ele);
                        StringUrl += '/' + urlFilter;
                    } else {
                        StringUrl += '/' + ele;
                    }
                })
                var filterId = objData.CountFilterID;
                var _input = {
                    "searchInput": objData.CountInput,
                    "FilterID": filterId
                };
                if (objData.CountRequestMethod == 'get') {
                    apiService.get("eAxisAPI", StringUrl.substr(1)).then(function (response) {
                        EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key]['Count'] = response.data.Response;
                    });
                } else {
                    apiService.post("eAxisAPI", StringUrl.substr(1), _input).then(function (response) {
                        EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key]['Count'] = response.data.Response;
                    });
                }
            }
        }

        function GetReadOnlyList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "OperationType": "NOCTRL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecOperation.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecOperation.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    helperService.ComponentBasedAccess = response.data.Response;
                }
            });
        }

        function GetSingleRecordDetail() {
            var _queryString = {
                "Orgin": 'INMAA',
                "TransportMode": 'AIR'
            }
            var value = _queryString;
            $window.open("#/EA/shipment?a=" + helperService.encryptData(value));
        }

        function TestSingleRecordView(curEntity) {
            // var _queryString = {
            //     "PK": curEntity.PK,
            //     "Code": curEntity.Code
            // };
            var _queryString = helperService.encryptData(curEntity);
            // $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
            // $window.open("#/EA/single-record-view/organization/" + _queryString, "_blank");
            $window.open("#/EA/single-record-view/organization?q=" + _queryString, "_blank");
        }

        function PreviewDocument() {
            var _url = "http://www.africau.edu/images/default/sample.pdf";
            var _base64 = "JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg==";
            helperService.previewDocument(_base64);
        }

        function GetAppSettings() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": "ShipmentSearch",
                "EntitySource": "QUERY",
                "Key": "Test Date Time Search"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        SetDateFilter(_response);
                    }
                }
            });
        }

        function SetDateFilter($item) {
            if ($item.Value) {
                $item.Value = JSON.parse($item.Value);
                var _appFilter = {};

                $item.Value.ExcuteInput.map(function (value1, key1) {
                    if (value1.Type) {
                        if (value1.Type == "DateCompare") {
                            var _val = "";
                            if (typeof value1.value == "string") {
                                _val = JSON.parse(value1.value);
                            }

                            if (_val.length > 0) {
                                _val.map(function (value2, key2) {
                                    if (value2.FilterInput && value2.FilterInput.length > 0) {
                                        value2.FilterInput.map(function (value3, key3) {
                                            value3.Value = $filter('date')(new Date(), APP_CONSTANT.DatePicker.dateFormat);
                                        });
                                    }
                                });
                            }

                            value1.value = JSON.stringify(_val);
                        }
                    } else {
                        var _value = "";
                        if (typeof value1.value == "string") {
                            _value = value1.value;
                        } else {
                            _value = value1.value.toString();
                        }

                        if (_value.indexOf('@') != -1) {
                            var _date = helperService.DateFilter(_value);

                            if (value1.Add && value1.Add.length > 0) {
                                value1.Add.map(function (value, key) {
                                    if (typeof value.Value == "string") {
                                        value.Value = Number(value.Value);
                                    }
                                    switch (value.FieldName) {
                                        case "Day":
                                            var d = new Date(_date);
                                            _date = new Date(d.setDate(d.getDate() + value.Value));
                                            break;
                                        case "Month":
                                            var d = new Date(_date);
                                            _date = new Date(d.setMonth(d.getMonth() + value.Value));
                                            break;
                                        case "Year":
                                            var d = new Date(_date);
                                            _date = new Date(d.setFullYear(d.getFullYear() + value.Value));
                                            break;
                                        case "Hour":
                                            var d = new Date(_date);
                                            _date = new Date(d.setHours(d.getHours() + value.Value));
                                            break;
                                        case "Minute":
                                            var d = new Date(_date);
                                            _date = new Date(d.setMinutes(d.getMinutes() + value.Value));
                                            break;
                                        case "Second":
                                            var d = new Date(_date);
                                            _date = new Date(d.setSeconds(d.getSeconds() + value.Value));
                                            break;
                                        default:
                                            _date = new Date(value.Value);
                                            break;
                                    }
                                });
                            }

                            value1.value = $filter('date')(new Date(_date), APP_CONSTANT.DatePicker[value1.Format]);

                            console.log(new Date(), value1.value);
                        }
                    }
                    _appFilter[value1.FieldName] = value1.value;
                });
            }
        }

        function GoToMyTask() {
            var _filter = {
                PSM_FK: "2cbdea8c-f663-4b04-b1d6-7eb13e9506c6",
                WSI_FK: "ca54c69e-c3f8-4ba7-b8ef-ced34a5b0f4e",
                UserStatus: "OVERDUE_AVAILABLE"
            };
            $location.path("/EA/my-tasks").search({
                q: helperService.encryptData(_filter)
            });
        }

        Init();
    }

})();
