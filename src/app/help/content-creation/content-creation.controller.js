(function () {
    "use strict";

    angular
        .module("Application")
        .controller("HelpContentCreationController", HelpContentCreationController);

    HelpContentCreationController.$inject = ["$scope", "$location", "$uibModal", "helperService", "apiService", "authService", "APP_CONSTANT", "confirmation", "helpConfig"];

    function HelpContentCreationController($scope, $location, $uibModal, helperService, apiService, authService, APP_CONSTANT, confirmation, helpConfig) {
        /* jshint validthis: true */
        var HelpContentCreationCtrl = this;
        var _queryString = $location.search();

        function Init() {
            HelpContentCreationCtrl.ePage = {
                "Title": "",
                "Prefix": "HelpContentCreation",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                if (_queryString.topic) {
                    HelpContentCreationCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString.topic));

                    if (HelpContentCreationCtrl.ePage.Masters.QueryString.PK) {
                        InitContentCreation();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        function InitContentCreation() {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation = {};

            HelpContentCreationCtrl.ePage.Masters.ContentCreation.AddNewContent = AddNewContent;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.EditContent = EditContent;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.DeleteContent = DeleteContentConfirmation;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.CloseContentModal = CloseContentModal;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.SaveAndUpdateContent = SaveAndUpdateContent;

            HelpContentCreationCtrl.ePage.Masters.ContentCreation.OnControlClick = OnControlClick;

            HelpContentCreationCtrl.ePage.Masters.ContentCreation.SaveContenBtnTxt = "Save";
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.IsDisabledSaveContentBtn = false;

            GetControlList();
            GetSummernoteOptions();
            GetContentList();
            InitImage();
        }

        function GetContentList() {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource = undefined;
            var _filter = {
                TOP_FK: HelpContentCreationCtrl.ePage.Masters.QueryString.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": helpConfig.Entities.HLPDocuments.API.FindAll.FilterID
            };

            apiService.post("authAPI", helpConfig.Entities.HLPDocuments.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource = response.data.Response;
                } else {
                    HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource = [];
                }
            });
        }

        function AddNewContent() {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl = undefined;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue = undefined;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UploadedImage = undefined;
            ContentModalInstance().result.then(function (response) {}, function () {
                CloseContentModal();
            });
        }

        function EditContent($item) {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue = $item;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl = {
                Code: $item.ContentType
            };

            if (HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.ContentType == "Image") {
                HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UploadedImage = {
                    FileName: HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.Content
                };
            }

            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ControlListSource.map(function (value, key) {
                if (value.Code === HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl.Code) {
                    HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl.Control = value.Control;
                }
            });

            ContentModalInstance().result.then(function (response) {}, function () {
                CloseContentModal();
            });
        }

        function ContentModalInstance() {
            return HelpContentCreationCtrl.ePage.Masters.ContentCreation.CreateContentModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "help-content-creation-modal right",
                scope: $scope,
                template: `<div ng-include src="'HelpContentCreation'"></div>`
            });
        }

        function CloseContentModal() {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.CreateContentModal.dismiss('cancel');
        }

        function SaveAndUpdateContent() {
            if (HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue && HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl.Code) {

                if (!HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource) {
                    HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource = [];
                }

                if (HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.PK) {
                    UpdateContent(HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue);
                } else {
                    SaveContent();
                }
            }

            CloseContentModal();
        }

        function SaveContent() {
            var _input = {
                "TOP_FK": HelpContentCreationCtrl.ePage.Masters.QueryString.PK,
                "ContentType": HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.ContentType,
                "Content": HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.Content,
                "DisplayOrder": HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.DisplayOrder,
                "JOD_FK": HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.JOD_FK,
                "Section": "Center",
                "Related": HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.Related,
                "IsModified": true
            };

            apiService.post("authAPI", helpConfig.Entities.HLPDocuments.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource.push(response.data.Response[0]);
                    }
                }
            });
        }

        function UpdateContent($item) {
            var _input = $item;
            _input.IsModified = true;

            apiService.post("authAPI", helpConfig.Entities.HLPDocuments.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        var _index = HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource.map(function (value, key) {
                            return value.PK
                        }).indexOf(_response.PK);

                        if (_index !== -1) {
                            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource[_index] = _response;
                        }
                    }
                }
            });
        }

        function GetControlList() {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ControlListSource = [{
                Code: "Header1",
                Desc: "Header 1",
                Control: "Textarea"
            }, {
                Code: "Header2",
                Desc: "Header 2",
                Control: "Textarea"
            }, {
                Code: "Header3",
                Desc: "Header 3",
                Control: "Textarea"
            }, {
                Code: "TextFormater",
                Desc: "Text Formater",
                Control: "TextFormater"
            }, {
                Code: "Image",
                Desc: "Image",
                Control: "Image"
            }, {
                Code: "Referance",
                Desc: "Referance",
                Control: "TextFormater"
            }];
        }

        function OnControlClick($item) {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UploadedImage = undefined;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.SelectedImage = undefined;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl = $item;

            if (!HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue) {
                var _obj = {
                    ContentType: HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl.Code
                };
                HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue = _obj;
            } else {
                HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.ContentType = HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveControl.Code;
                HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.Content = undefined;
                HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.JOD_FK = undefined;
            }
        }

        function GetSummernoteOptions() {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.SummernoteOptions = APP_CONSTANT.SummernoteOptions;
        }

        function DeleteContentConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContent($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteContent($item) {
            var _input = $item;
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("authAPI", helpConfig.Entities.HLPDocuments.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource.map(function (value, key) {
                        return value.PK
                    }).indexOf($item.PK);

                    if (_index !== -1) {
                        HelpContentCreationCtrl.ePage.Masters.ContentCreation.ContentListSource.splice(_index, 1);
                    }
                }
            });
        }

        function InitImage() {
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image = {};
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.Autherization = authService.getUserInfo().AuthToken;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.fileDetails = [];
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.fileSize = 2;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UserId = authService.getUserInfo().UserId;

            var _additionalValue = {
                "Entity": "Help",
                "Path": "Help,Content"
            };

            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.AdditionalValue = JSON.stringify(_additionalValue);
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UploadUrl = APP_CONSTANT.URL.eAxisAPI + helpConfig.Entities.DMS.API.DMSUpload.Url;

            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.GetUploadedFiles = GetUploadedFiles;
            HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.GetSelectedFiles = GetSelectedFiles;
        }

        function GetSelectedFiles(files) {
            if (files && files.length > 0) {
                HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UploadedImage = undefined;

                HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.SelectedImage = files[0];
            }
        }

        function GetUploadedFiles(files) {
            if (files && files.length > 0) {

                HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UploadedImage = files[0];

                HelpContentCreationCtrl.ePage.Masters.ContentCreation.ActiveContentValue.JOD_FK = HelpContentCreationCtrl.ePage.Masters.ContentCreation.Image.UploadedImage.Doc_PK;
            }
        }



        Init();
    }
})();
