(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisHtmlGenerationCodeController", EAxisHtmlGenerationCodeController);

    EAxisHtmlGenerationCodeController.$inject = ["$scope", "htmlCodeGenerationConfig"];

    function EAxisHtmlGenerationCodeController($scope, htmlCodeGenerationConfig) {
        /* jshint validthis: true */
        var EAxisHtmlGenerationCtrl = this;
        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');
        //   var sheetSelection = document.getElementById('sheetSelection');
        var viewSourceCode = document.getElementById('viewSourceCode');

        //   $scope.sheetSelection = false;
        EAxisHtmlGenerationCtrl.Sheets = htmlCodeGenerationConfig.sheets;

        var CLIENT_ID = '921349682613-v6772k5drftha0em64a24d6ro0efmddk.apps.googleusercontent.com';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

        function handleClientLoad() {
            gapi.load('client:auth2', initClient);
        }

        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        function initClient() {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
            });
        }

        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                authorizeButton.style.display = 'none';
                signoutButton.style.display = 'block';
                //   sheetSelection.style.display = 'block';
                viewSourceCode.style.display = 'block';
                // listMajors();
            } else {
                authorizeButton.style.display = 'block';
                signoutButton.style.display = 'none';
                //   sheetSelection.style.display = 'none';
                viewSourceCode.style.display = 'none';

            }
        }

        /**
         *  Sign in the user upon button click.
         */
        function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
            //  $scope.sheetSelection = true;
        }

        /**
         *  Sign out the user upon button click.
         */
        function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
            //  $scope.sheetSelection = false;
        }

        $scope.getData = function (selectedSheetObj) {
            if (selectedSheetObj != null)
                listMajors(selectedSheetObj);
        };
        /**
         * Print the names and majors of students in a sample spreadsheet:
         * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
         */
        function listMajors(selectedSheetObj) {
            console.log(selectedSheetObj);
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1YYSRqAXcV9xMt0Ky4k_S1cIYDaHznnMiZzR_b0Zdatc',
                range: selectedSheetObj.name + selectedSheetObj.range,
                majorDimension: 'ROWS'

            }).then(function (response) {
                $scope.Str = "";

                var range = response.result;
                if (range.values.length > 0) {

                    for (var k = 0; k < 1; k++) {
                        var keys = range.values[k]
                        $scope.Keys = keys;
                    }

                    var arrayOfObjects = [];
                    for (var i = 1; i < range.values.length; i++) {
                        var obj = {};
                        for (var j = 0; j < range.values[i].length; j++) {
                            obj[keys[j]] = range.values[i][j];

                        }

                        arrayOfObjects.push(obj);
                    }
                    $scope.arrayOfObjects = arrayOfObjects;
                    $scope.displayData(arrayOfObjects);
                } else {
                    // appendPre('No data found.');
                }
            }, function (response) {
                //   appendPre('Error: ' + response.result.error.message);
            });
        }
        $scope.displayData = function (arrayOfObjects) {
            // console.log(arrayOfObjects);
            function fnFilterChild(ParentID) {
                var filtered = arrayOfObjects.filter(function (el, index, arr) {
                    if (el.ParentControl == ParentID) {
                        return el;
                    }
                });
                return filtered;
            }


            $scope.Str = '';

            function GenerateHtml(ParentControl, ObjCollection) {
                for (var i = 0; i < ObjCollection.length; i++) {
                    if (ObjCollection[i].IsScript == 1) {
                        if (ObjCollection[i].HasChild == 1) {

                            switch (ObjCollection[i].UIControl) {
                                case "tab":
                                    var ObjTabs = fnFilterChild(ObjCollection[i].ControlName)
                                    $scope.Str += '<uib-tabset justified="true" class="' + ObjCollection[i].LabelClassname + '">';
                                    for (var j = 0; j < ObjTabs.length; j++) {

                                        $scope.Str += '<uib-tab heading="' + ObjTabs[j].ControlName + '"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">';
                                        GenerateHtml(ParentControl, fnFilterChild(ObjTabs[j].ControlName));
                                        $scope.Str += '</div></div></uib-tab>';
                                    }

                                    $scope.Str += '</uib-tabset>'

                                    break;
                                case "tabpane":


                                    $scope.Str += '<div  class="">'
                                    GenerateHtml(ParentControl, fnFilterChild(ObjCollection[i].ControlName));
                                    $scope.Str += '</div>';


                                    break;
                                case "panel":

                                    $scope.Str += '<div class="' + ObjCollection[i].LabelClassname + '"><div class="widget"><div class="widget-header bg-blue">'
                                    $scope.Str += '<span class="widget-caption">' + ObjCollection[i].ControlName + '</span>'
                                    $scope.Str += '</div><div class="widget-body"><div class="widget-main"><div class="row" >'
                                    GenerateHtml(ParentControl, fnFilterChild(ObjCollection[i].ControlName));
                                    $scope.Str += '</div></div></div></div></div>'

                                    break;
                                case "div":

                                    $scope.Str += '<div  class="' + ObjCollection[i].LabelClassname + '">'
                                    GenerateHtml(ParentControl, fnFilterChild(ObjCollection[i].ControlName));
                                    $scope.Str += '</div>'

                                    break;
                            }

                        } else {
                            switch (ObjCollection[i].UIControl) {
                                case "textbox":

                                    $scope.Str += '<div class="' + ObjCollection[i].LabelClassname + '"><div class="form-group">';
                                    $scope.Str += '<label class="control-label"  >' + ObjCollection[i].ControlName + '</label>';
                                    $scope.Str += '<input type="text" ng-model="' + ObjCollection[i].Controller + '.ePage.Entities.' + ObjCollection[i].EntityName + '.Data.' + ObjCollection[i].FieldPrefix + '.' + ObjCollection[i].FieldName + '" maxlength="' + ObjCollection[i].Length + '" class="form-control ' + ObjCollection[i].ControlClassname + '"  placeholder="' + ObjCollection[i].ControlName + '">'
                                    $scope.Str += '</div></div>';
                                    break;
                                case "tarea":

                                    $scope.Str += '<div class="' + ObjCollection[i].LabelClassname + '"><div class="form-group">';
                                    $scope.Str += '<label class="control-label" >' + ObjCollection[i].ControlName + '</label>';
                                    $scope.Str += '<textarea ng-model="' + ObjCollection[i].Controller + '.ePage.Entities.' + ObjCollection[i].EntityName + '.Data.' + ObjCollection[i].FieldPrefix + '.' + ObjCollection[i].FieldName + '" class="form-control no-resize"></textarea>'
                                    $scope.Str += '</div></div>';
                                    break;
                                case "dropdown":

                                    $scope.Str += '<div class="' + ObjCollection[i].LabelClassname + '"><div class="form-group">';
                                    $scope.Str += '<label class="control-label" >' + ObjCollection[i].ControlName + '</label>';
                                    $scope.Str += '<select chosen search-contains="true" ng-options="x.' + ObjCollection[i].ValueField + ' as x.' + ObjCollection[i].DisplayField + ' for x in ' + ObjCollection[i].Controller + '.ePage.Masters.DropDownMasterList.' + ObjCollection[i].SourceName + '.ListSource" ng-model="' + ObjCollection[i].Controller + '.ePage.Entities.' + ObjCollection[i].EntityName + '.Data.' + ObjCollection[i].FieldPrefix + '.' + ObjCollection[i].FieldName + '"  class="form-control"><option value="">--Select--</option></select>'
                                    $scope.Str += '</div></div>';
                                    break;
                                case "checkbox":

                                    $scope.Str += '<div class="' + ObjCollection[i].LabelClassname + '"><div class="form-group">';
                                    $scope.Str += '<label class="control-label" ></label>';
                                    $scope.Str += '<div class="checkbox"><label><input type="checkbox" ng-model="' + ObjCollection[i].Controller + '.ePage.Entities.' + ObjCollection[i].EntityName + '.Data.' + ObjCollection[i].FieldPrefix + '.' + ObjCollection[i].FieldName + '"  class="colored-blue" / >';
                                    $scope.Str += '<span class="text">' + ObjCollection[i].ControlName + '</span>';
                                    $scope.Str += '</label></div>';
                                    $scope.Str += '</div></div>';
                                    break;
                                case "lookup":

                                    $scope.Str += '<div class="' + ObjCollection[i].LabelClassname + '"><div class="form-group">';
                                    $scope.Str += '<label class="control-label" >' + ObjCollection[i].ControlName + '</label>';
                                    $scope.Str += '<div class="input-group ' + ObjCollection[i].ControlClassname + '"><input class="form-control" ng-model="' + ObjCollection[i].Controller + '.ePage.Entities.' + ObjCollection[i].EntityName + '.Data.' + ObjCollection[i].FieldPrefix + '.' + ObjCollection[i].FieldName + '"  type="text" placeholder="' + ObjCollection[i].ControlName + '">';
                                    $scope.Str += ' <span class="input-group-btn"><button dynamic-list-modal obj="' + ObjCollection[i].Controller + '.ePage.Entities.' + ObjCollection[i].EntityName + '.Data.' + ObjCollection[i].FieldPrefix + '" field-name="' + '\'' + ObjCollection[i].ListingPageID + '\'' + '" mode = "2" grid-refresh-fun-name="" grid-refresh-fun="" selected-data="' + ObjCollection[i].Controller + '.ePage.Masters.SelectedData($item)" class="btn btn-default shiny" type="button"><i class="fa fa-ellipsis-h"></i></button></span>';
                                    $scope.Str += '</div></div></div>';
                                    break;
                                case "datepicker":
                                    var trimControlName = ObjCollection[i].ControlName.replace(/ +/g, "");
                                    $scope.Str += '<div class="' + ObjCollection[i].LabelClassname + '"><div class="form-group">';
                                    $scope.Str += '<label class="control-label">' + ObjCollection[i].ControlName + '</label>';
                                    $scope.Str += '<div class="input-group ' + ObjCollection[i].ControlClassname + '"><input class="form-control"  type="text" ng-model="' + ObjCollection[i].Controller + '.ePage.Entities.' + ObjCollection[i].EntityName + '.Data.' + ObjCollection[i].FieldPrefix + '.' + ObjCollection[i].FieldName + '"  placeholder="{{' + ObjCollection[i].Controller + '.ePage.Masters.DatePicker.Options.format}}"  uib-datepicker-popup="{{' + ObjCollection[i].Controller + '.ePage.Masters.DatePicker.Options.format}}" datepicker-options="' + ObjCollection[i].Controller + '.ePage.Masters.DatePicker.Options" is-open="' + ObjCollection[i].Controller + '.ePage.Masters.DatePicker.isOpen[' + '\'' + trimControlName + '\'' + ']">';
                                    $scope.Str += '<span class="input-group-btn"> <button class="btn btn-default shiny" data-ng-click="' + ObjCollection[i].Controller + '.ePage.Masters.DatePicker.OpenDatePicker($event, ' + '\'' + trimControlName + '\'' + ')"><i class="fa fa-calendar"></i></button></span>';
                                    $scope.Str += '</div></div></div>';
                                    break;
                            }

                        }
                    }
                }

            }

            var arrObj = fnFilterChild("Page");
            var hrmlString = GenerateHtml("Page", arrObj);
            $scope.view = '<!DOCTYPE html><html lang="en" ng-app="iframe"> <head> <meta name="description" content="form layouts" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <link rel="shortcut icon" href="assets/img/favicon.png" type="image/x-icon"> <!--Basic Styles--> <link href="assets/css/bootstrap.min.css" rel="stylesheet" /> <link id="bootstrap-rtl-link" href="" rel="stylesheet" /> <link href="assets/css/font-awesome.min.css" rel="stylesheet" /> <!--Fonts--> <link href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,600,700,300" rel="stylesheet" type="text/css"> <!--Beyond styles--> <link id="beyond-link" href="assets/css/beyond.min.css" rel="stylesheet" /><!--Chosen--><link href="lib/angular/angular-chosen/chosen.css" rel="stylesheet" type="text/css" /><link href="lib/angular/angular-chosen/chosen-spinner.css" rel="stylesheet" type="text/css" /> <style> /*Chosen Start*/ .chosen-container { width: 100% !important; } .chosen-container-single .chosen-single { height: 30px; border-radius: 0; padding: 1px 0 0 8px; border: 1px solid #ccc; } .chosen-container-single .chosen-drop { border-radius: 0; } .chosen-container-single .chosen-search input[type="text"] { height: 30px; } .chosen-container-single .chosen-single div { top: 2px; } .chosen-container .chosen-results { max-height: 150px; } /*Chosen End*/</style> </head> <body> <div class="col-lg-12" style="margin-top:5px;">'
            $scope.view += $scope.Str;
            $scope.view += '<script src="lib/jquery/jquery.min.js"></script></div> <script src="lib/angular/angular/angular.js"></script><script src="lib/angular/angular-ui-bootstrap/ui-bootstrap.min.js"></script><script src="lib/angular/angular-ui-bootstrap/ui-bootstrap-tpls.min.js"></script><script src="lib/angular/angular-chosen/chosen.jquery.js"></script><script src="lib/angular/angular-chosen/angular-chosen.min.js"></script> <script>angular.module("iframe", ["ui.bootstrap","localytics.directives"]);</script></body></html>'

            function setFrame() {
                var editorHTML = $scope.view;
                var iframe = document.getElementById('outputIframe');
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(editorHTML);
                iframe.contentWindow.document.close();
            }
            setFrame();

        };

        $scope.copyClipBoard = function () {
            document.querySelector("#visible-input").select();
            // Copy to the clipboard
            document.execCommand('copy');
        };
        handleClientLoad();

    }
})();
