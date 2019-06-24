(function () {
    "use strict";

    angular.module("Application")
        .factory("accountPayableConfig", accountPayableConfig);

    accountPayableConfig.$inject = ["$q", "helperService", "toastr"];

    function accountPayableConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {},
                },
                "API": {
                    "AccountpayableList": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccountpayableList/GetById/"
                            },
                            "AccountpayableListActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccountpayableList/AccountpayableListActivityClose/"
                            }
                        }
                    },
                    "AccountpayableListdata": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "Post",
                                "Url": "AccountpayableListdata/FindAll",
                                "FilterID": "ACCPAYAISDA"
                            }
                        }
                    },
                    "MstRecentExchangeRate": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "Post",
                                "Url": "MstRecentExchangeRate/FindAll",
                                "FilterID": "MSTRECEXC"
                            }
                        }
                    },
                    "OrgHeader": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "OrgHeader/GetById/"
                            }
                        }
                    }
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "InitBinding": InitBinding,
            "DataentryName": "AccTransactionHeader",
            "DataentryTitle": "AccTransactionHeader"
        };
        return exports;

        function GetTabDetails(currentAccountPayable, isNew) {
            /*  Set configuration object to individual Finance invoice */
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertAccountPayable": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AccountpayableList/Insert"
                            }
                        },
                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": []
                            }
                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                        },
                        "TableProperties": {
                            "UILineCharges": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 228
                                },
                                "Job": {
                                    "width": "100"
                                },
                                "Charge": {
                                    "width": "124"
                                },
                                "Type": {
                                    "width": "125"
                                },
                                "Branch": {
                                    "width": "125"
                                },
                                "Dept": {
                                    "width": "125"
                                },
                                "Amount": {
                                    "width": "125"
                                }
                            },
                            "UIAPListData": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 300
                                },
                                "checkbox": {
                                    "isenabled": true,
                                    "position": '1',
                                    "width": "40"
                                },
                                "sno": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "40"
                                },
                                "charges": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "105"
                                },
                                "chargetype": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "110"
                                },
                                "job": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "145"
                                },
                                "desc": {
                                    "isenabled": true,
                                    "position": '6',
                                    "width": "110"
                                },
                                // "description": {
                                //     "isenabled": true,
                                //     "position": '6',
                                //     "width": "110"
                                // },
                                "branch": {
                                    "isenabled": true,
                                    "position": '7',
                                    "width": "110"
                                },
                                "dept": {
                                    "isenabled": true,
                                    "position": '8',
                                    "width": "110"
                                },
                                "currency": {
                                    "isenabled": true,
                                    "position": '9',
                                    "width": "110"
                                },
                                "exchangerate": {
                                    "isenabled": true,
                                    "position": '10',
                                    "width": "110"
                                },
                                "amount": {
                                    "isenabled": true,
                                    "position": '11',
                                    "width": "110"
                                },
                                "taxid": {
                                    "isenabled": true,
                                    "position": '12',
                                    "width": "110"
                                },
                                // "taxdate": {
                                //     "isenabled": true,
                                //     "position": '13',
                                //     "width": "110"
                                // },
                                "tax": {
                                    "isenabled": true,
                                    "position": '13',
                                    "width": "110"
                                },
                                "total": {
                                    "isenabled": true,
                                    "position": '14',
                                    "width": "110"
                                },
                                "localtotal": {
                                    "isenabled": true,
                                    "position": '15',
                                    "width": "110"
                                },
                                "localamount": {
                                    "isenabled": true,
                                    "position": '16',
                                    "width": "110"
                                },
                                "localtax": {
                                    "isenabled": true,
                                    "position": '17',
                                    "width": "110"
                                },
                                "final": {
                                    "isenabled": true,
                                    "position": '18',
                                    "width": "45"
                                },
                                // "consol": {
                                //     "isenabled": true,
                                //     "position": '19',
                                //     "width": "110"
                                // },
                                "glaccount": {
                                    "isenabled": true,
                                    "position": '20',
                                    "width": "110"
                                },
                                // "sequence": {
                                //     "isenabled": true,
                                //     "position": '22',
                                //     "width": "110"
                                // },
                                // "joblocalref": {
                                //     "isenabled": true,
                                //     "position": '21',
                                //     "width": "110"
                                // },
                                // "taxmsg": {
                                //     "isenabled": true,
                                //     "position": '22',
                                //     "width": "110"
                                // },
                                // "goverment": {
                                //     "isenabled": true,
                                //     "position": '25',
                                //     "width": "110"
                                // }
                            }
                        }
                    }
                }
            };
            if (isNew) {
                _exports.Entities.Header.Data = currentAccountPayable.data;
                var _code = currentAccountPayable.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentAccountPayable.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.AccountpayableList.API.GetById.Url, currentAccountPayable.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var _code = currentAccountPayable.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentAccountPayable.Desc,
                        code: _code,
                        pk: currentAccountPayable.PK,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        function InitBinding($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if (!$item.isNew) {
                _input.UIAccTransactionHeader.Company = _input.UIAccTransactionHeader.CMP_Code + '-' + _input.UIAccTransactionHeader.CMP_Name;
                //_input.UIJobHeader.OverseasAgent = _input.UIAccTransactionHeader.AgentOrg_Code + '-' + _input.UIAccTransactionHeader.AgentOrg_Name;
            }
        }
    }
})();